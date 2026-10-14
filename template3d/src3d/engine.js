// engine.js: the 3D engine (Three.js in headless Chrome), the same page contract as the 2D kit, so render.mjs works
// unchanged: window.ready, window.renderAt(t, type, q), window.renderSheet(times, cols, w, crop), window.LOOPS/LOOP, DUR.
//
// THE RULE (as in 2D): every frame is a pure function of song time t. Frames render in parallel and out of order.
//   - Build geometry ONCE with keep(key, () => object) (cached by key).
//   - Every frame the world is emptied, then districts and the current shot put() the objects they need and set EVERY
//     transform / pose / visibility they care about. Nothing carries over from the previous frame.
//
// ONE WORLD: the video is one continuous brick world. Chapters own districts (a centre + radius in world x/z):
//   district('zoo', { at: [x, z], r: 40 }, t => { ...put set dressing, ambient life... })   drawn whenever near the camera
//   shots([[t0, fn], ...])  fn(t, lt, dur): actors + camera for that stretch of song time (lt = t - t0)
// Units: 1 = one stud (8 mm). A minifig is about 4.4 tall. y is up.
//
// Camera (call once per frame from the shot): cam({ pos, look, fov, focus, blur, roll, flat })
//   flat ∈ [0,1] is the 2D-flatten dial: dolly-zoom to orthographic + z-squash toward the focus plane + PBR→toon
//   + ink outlines fading in. Animate it like anything else.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { mergeGeometries, toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';

const W = 1920, H = 1080;
const BPM = PROJECT.bpm, BEAT = 60 / BPM, OFF = PROJECT.offset || 0, DUR = PROJECT.duration;
let T = 0;

// ---------- maths helpers (same names as the 2D kit) ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => { k = clamp(k); return k * k * (3 - 2 * k); };
const easeIn = k => { k = clamp(k); return k * k * k; };
const easeOut = k => { k = clamp(k); return 1 - (1 - k) ** 3; };
const backOut = k => { k = clamp(k); const c = 1.7; return 1 + (c + 1) * (k - 1) ** 3 + c * (k - 1) ** 2; };
const seg = (x, a, b) => clamp((x - a) / (b - a));
const frac = x => x - Math.floor(x);
const hash = i => frac(Math.sin(i * 127.1 + 311.7) * 43758.5453);
const bt = k => OFF + k * BEAT;                                   // time of beat k
const beatPh = t => frac((t - OFF) / BEAT);                       // 0..1 within the current beat
const pulse = (t, sharp = 6) => Math.exp(-beatPh(t) * sharp);     // 1 on each beat, decaying
// kf(x, [[x0, v0], [x1, v1], ...], easeFn): keyframes; values may be numbers or arrays
function kf(x, keys, fn = ease) {
  if (x <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (x <= keys[i][0]) {
    const [a, va] = keys[i - 1], [b, vb] = keys[i], k = fn((x - a) / (b - a));
    return Array.isArray(va) ? va.map((v, j) => lerp(v, vb[j], k)) : lerp(va, vb, k);
  }
  return keys[keys.length - 1][1];
}
function shake(t, amp, f = 23) { return [amp * Math.sin(t * f * 1.3 + 1), amp * Math.sin(t * f + 4), amp * .5 * Math.sin(t * f * .7 + 2)]; }

// ---------- renderer ----------
const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;   // Neutral keeps toy colours saturated
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
const ENV = pmrem.fromScene(new RoomEnvironment(), .04).texture;
scene.environment = ENV; scene.environmentIntensity = .35;   // reflections for the plastic sheen, not a second fill light
const ROOT = new THREE.Group(); scene.add(ROOT);
// the sky: look({ sky: [top, horizon, bottom] }) paints a gradient dome (a plain colour string paints a flat background)
const SKY_U = { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, bot: { value: new THREE.Color() } };
const SKY = new THREE.Mesh(new THREE.SphereGeometry(3000, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: SKY_U,
  vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: 'uniform vec3 top, hor, bot; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(hor, top, smoothstep(0.0, 0.3, h)) : mix(hor, bot, smoothstep(0.0, 0.2, -h)); gl_FragColor = vec4(c, 1.0);\n#include <colorspace_fragment>\n}' }));
SKY.renderOrder = -10; SKY.frustumCulled = false; scene.add(SKY);                  // emptied every frame; districts + shots fill it
const persp = new THREE.PerspectiveCamera(35, W / H, .1, 4000);
const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 8000);

// lights: soft studio. A key light with soft shadows that follows the camera's focus, a hemisphere fill, a rim.
const hemi = new THREE.HemisphereLight('#fff6ea', '#6a5f7a', .5); scene.add(hemi);
const key = new THREE.DirectionalLight('#fff1dc', 2.6); key.castShadow = true;
key.shadow.mapSize.set(4096, 4096); key.shadow.bias = -.0004; key.shadow.normalBias = .02; key.shadow.radius = 4;
scene.add(key, key.target);
const rim = new THREE.DirectionalLight('#cfe3ff', 1.1); scene.add(rim, rim.target);

// ---------- global uniforms for the flat dial (shared by every engine material) ----------
const U = { uToon: { value: 0 }, uKeyDir: { value: new THREE.Vector3(0, 1, 0) }, uShadowTint: { value: new THREE.Color('#6b6380') } };
function toonify(mat) {
  mat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    sh.fragmentShader = 'uniform float uToon; uniform vec3 uKeyDir; uniform vec3 uShadowTint;\n' + sh.fragmentShader.replace('#include <opaque_fragment>', `
      #ifdef OPAQUE
      diffuseColor.a = 1.0;
      #endif
      float nl = dot(normalize(normal), normalize(uKeyDir));
      vec3 toon = diffuseColor.rgb * mix(mix(uShadowTint, vec3(1.0), 0.55), vec3(1.08), smoothstep(-0.02, 0.06, nl));
      toon += totalEmissiveRadiance;
      outgoingLight = mix(outgoingLight, toon, uToon);
      gl_FragColor = vec4(outgoingLight, diffuseColor.a);`);
  };
  mat.customProgramCacheKey = () => 'toon1';
  return mat;
}
// Materials are cached by name. plastic(col): glossy brick ABS. matte(col): paper, floors. glow(col): emissive.
const MATS = new Map();
function plastic(col, o = {}) {
  const k = 'p' + col + JSON.stringify(o);
  if (!MATS.has(k)) MATS.set(k, toonify(new THREE.MeshPhysicalMaterial({ color: col, roughness: .38, clearcoat: .4, clearcoatRoughness: .18, metalness: 0, envMapIntensity: .45, ...o })));
  return MATS.get(k);
}
function matte(col, o = {}) {
  const k = 'm' + col + JSON.stringify(o);
  if (!MATS.has(k)) MATS.set(k, toonify(new THREE.MeshStandardMaterial({ color: col, roughness: .9, metalness: 0, ...o })));
  return MATS.get(k);
}
function glowMat(col, strength = 2) {
  const k = 'g' + col + strength;
  if (!MATS.has(k)) MATS.set(k, toonify(new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: strength, roughness: .5 })));
  return MATS.get(k);
}

// ---------- LDraw parts (baked by scripts/ldraw_bake.py into parts/parts.js as window.PARTS) ----------
const GEO = new Map();
function partGeo(id) {
  if (!GEO.has(id)) {
    const d = window.PARTS?.[id]; if (!d) throw new Error('part not baked: ' + id + ' (add it to parts.txt and re-run setup)');
    let g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(d.pos, 3)); g.setIndex(d.idx);
    if (d.nrm) g.setAttribute('normal', new THREE.Float32BufferAttribute(d.nrm, 3));   // Blender-bevelled part: use its hardened normals
    else g = toCreasedNormals(g, .5);                             // raw LDraw: smooth curves, crisp brick edges
    // print colours (face prints, decorated parts): draw group 0 = the part's main colour, the rest fixed colours
    if (d.groups?.length) { g.clearGroups(); d.groups.forEach((gr, i) => g.addGroup(gr.start * 3, gr.count * 3, i)); }
    g.userData = { bbox: d.bbox, two: d.two_sided, groups: d.groups || [] };
    GEO.set(id, g);
  }
  return GEO.get(id);
}
// part('3001', '#c4281c') → a Mesh of one brick (origin at the LDraw part origin: top of the brick, stud base).
function part(id, col, o = {}) {
  const g = partGeo(id), side = g.userData.two ? { side: THREE.DoubleSide } : {};
  const m = new THREE.Mesh(g, o.mat || (g.userData.groups.length ? g.userData.groups.map(gr => gr.c === 16 ? plastic(col, side) : plastic(gr.hex || '#000000', side)) : plastic(col, side)));
  m.castShadow = m.receiveShadow = true;
  return m;
}
// Static brick builds, merged per colour into a few meshes (fast). list: [[partId, colour, x, y, z, rotY], ...]
// y in plates? No: y in world units; a brick is 1.2 tall, a plate .4. Bricks stack at y = n*1.2 (part origin = top).
function build(list) {
  const by = new Map();
  for (const [id, col, x, y, z, ry = 0, s = 1] of list) {
    const g = partGeo(id).clone(); const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), ry), new THREE.Vector3(s, s, s));
    g.applyMatrix4(m); if (!by.has(col)) by.set(col, []); by.get(col).push(g);
  }
  const grp = new THREE.Group();
  for (const [col, gs] of by) { const mesh = new THREE.Mesh(mergeGeometries(gs), plastic(col)); mesh.castShadow = mesh.receiveShadow = true; grp.add(mesh); }
  return grp;
}
// Builds that grow over time: one InstancedMesh per (part, colour), instances sorted by the time they appear.
// list: [[partId, colour, x, y, z, rotY, tAppear], ...]. Call grow(obj, t) every frame to show the placed ones.
function growing(list) {
  const grp = new THREE.Group(), groups = new Map();
  for (const it of [...list].sort((a, b) => a[6] - b[6])) { const k = it[0] + '|' + it[1]; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(it); }
  for (const [k, items] of groups) {
    const [id, col] = k.split('|'), im = new THREE.InstancedMesh(partGeo(id), plastic(col), items.length);
    im.castShadow = im.receiveShadow = true; im.userData.times = items.map(i => i[6]);
    const M = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), one = new THREE.Vector3(1, 1, 1);
    items.forEach((it, i) => im.setMatrixAt(i, M.compose(new THREE.Vector3(it[2], it[3], it[4]), q.setFromAxisAngle(up, it[5] || 0), one)));
    im.frustumCulled = false; grp.add(im);
  }
  grp.userData.grow = t => { for (const im of grp.children) { const ts = im.userData.times; let n = 0; while (n < ts.length && ts[n] <= t) n++; im.count = n; } };
  return grp;
}

// limb(fig, 'footR'|'footL'|'handR'|'handL'|'head'): world position of that anchor in THIS frame (after put()/pose()).
function limb(f, name) { const J = f.userData.J, o = J[name] || J['grip' + name.slice(-1)]; f.updateWorldMatrix(true, true); return o.getWorldPosition(new THREE.Vector3()).toArray(); }

// ---------- frame registry ----------
const CACHE = new Map();
// every cached Object3D is a tracked actor for tools/continuity.mjs (props included: a prop that blinks between two hands is a bug)
const keep = (key, make) => { if (!CACHE.has(key)) { const o = make(); if (o?.isObject3D && !o.userData.actor) o.userData.actor = 'obj:' + key; CACHE.set(key, o); } return CACHE.get(key); };
// put(obj, x, y, z, ry, s): add a cached object to this frame's world and set its transform. It OVERWRITES the object's
// position/rotation/scale, so a mesh that needs its own fixed tilt (a ground plane, a sign) must sit inside a Group.
function put(obj, x = 0, y = 0, z = 0, ry = 0, s = 1) {
  obj.position.set(x, y, z); obj.rotation.set(0, ry, 0); obj.scale.setScalar(s); obj.visible = true;
  ROOT.add(obj); return obj;
}
const DISTRICTS = [], SHOTS = [], LOOPS = {};
function district(name, o, fn) { DISTRICTS.push({ name, at: o.at || [0, 0], r: o.r || 60, fn, always: !!o.always }); }
function shots(list) { SHOTS.push(...list); SHOTS.sort((a, b) => a[0] - b[0]); }

// ---------- camera + look state (reset every frame) ----------
let VIEW;
function resetView() {
  VIEW = { pos: [0, 6, 30], look: [0, 3, 0], fov: 35, roll: 0, focus: null, blur: .5, flat: 0, sky: ['#5f9fe0', '#cfe2f4', '#cfe6c0'], fog: null, exposure: 1,
    keyDir: [-.55, 1, .65], keyCol: '#fff1dc', keyInt: 3.2, fill: .5, rimInt: 1.1, outline: null, vignette: .35, fade: 0, fadeCol: '#000000' };
}
// cam({ pos, look, fov, focus, blur, roll, flat }): focus is a point or a distance (default: the look point).
function cam(o) { Object.assign(VIEW, o); }
function look(o) { Object.assign(VIEW, o); }          // sky, fog, exposure, keyDir/keyCol/keyInt, fill, fade, vignette
// orbit(center, radius, angle, height): a camera position circling `center` (angle in radians, 0 = from +z)
const orbit = (c, r, a, h) => [c[0] + r * Math.sin(a), c[1] + h, c[2] + r * Math.cos(a)];
// drift(lt, k): a slow cinematic drift to add to any camera position (default on: the user wants slow pans)
const drift = (lt, k = 1) => [k * .35 * Math.sin(lt * .21 + 1), k * .12 * Math.sin(lt * .17), k * .25 * Math.sin(lt * .13 + 2)];

// path(t, keys): a smooth camera path through time-stamped keys [[t, [x,y,z]], ...] (centripetal Catmull-Rom).
// Unlike kf(), which eases INTO each key (the camera stops at every key: jerky), the path keeps moving through its keys
// and only eases in its first and last segment (keys always land on time). Use it for every camera position and look point.
//   path(t, keys, { easeEnds: false }) keeps full speed at the ends too (for joining a flight).
function path(t, keys, o = {}) {
  const n = keys.length; if (n === 1) return keys[0][1];
  const tt = clamp(t, keys[0][0], keys[n - 1][0]); let i = 0; while (i < n - 2 && tt > keys[i + 1][0]) i++;
  const P = k => keys[clamp(k, 0, n - 1)][1], p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
  let s = clamp((tt - keys[i][0]) / (keys[i + 1][0] - keys[i][0]));
  // ease only the first and last SEGMENT (start from rest / settle), so every key still lands exactly on its time
  if (o.easeEnds !== false) { const first = i === 0, last = i === n - 2, f = x => x * x * (2 - x);
    if (first && last) s = s * s * s * (s * (s * 6 - 15) + 10); else if (first) s = f(s); else if (last) s = 1 - f(1 - s); }
  if (!Array.isArray(p1)) return crSpline(s, [p0], [p1], [p2], [p3])[0];
  return crSpline(s, p0, p1, p2, p3);
}
function crSpline(s, p0, p1, p2, p3) {   // uniform Catmull-Rom per component (simple, C1-continuous, passes through keys)
  return p1.map((_, j) => { const a = p0[j], b = p1[j], c = p2[j], d = p3[j];
    return .5 * ((2 * b) + (-a + c) * s + (2 * a - 5 * b + 4 * c - d) * s * s + (-a + 3 * b - 3 * c + d) * s * s * s); });
}

// fly(t, t0, t1, A, B, o): a camera flight between two views A, B = { pos, look, fov, sky, ... } over [t0, t1].
// It returns a view to pass to cam()/look(). Position arcs up by o.arc (default: a quarter of the distance, min 8),
// eased with smootherstep (o.ease overrides: k => k * k arrives at full speed, for whips). Colours (sky arrays, keyCol, fadeCol) blend. Use the SAME call on both sides of a seam.
function smoother(k) { k = clamp(k); return k * k * k * (k * (k * 6 - 15) + 10); }
function mixVal(a, b, k) {
  if (typeof a === 'number' && typeof b === 'number') return lerp(a, b, k);
  if (typeof a === 'string' && typeof b === 'string' && a[0] === '#' && b[0] === '#') return '#' + new THREE.Color(a).lerp(new THREE.Color(b), k).getHexString();
  if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) return a.map((x, i) => mixVal(x, b[i], k));
  return k < .5 ? a : b;
}
function fly(t, t0, t1, A, B, o = {}) {
  const k = (o.ease || smoother)(clamp((t - t0) / (t1 - t0))), out = {};
  for (const key of new Set([...Object.keys(A), ...Object.keys(B)])) out[key] = mixVal(A[key] ?? B[key], B[key] ?? A[key], k);
  const d = Math.hypot(B.pos[0] - A.pos[0], B.pos[2] - A.pos[2]), arc = o.arc ?? Math.max(8, d * .25), up = Math.sin(Math.PI * k) * arc;
  out.pos = [out.pos[0], out.pos[1] + up, out.pos[2]]; out.look = [out.look[0], out.look[1] + up * .7, out.look[2]];
  return out;
}

// ---------- post: DOF + ink outlines + vignette/fade ----------
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 }));
composer.setPixelRatio(1); composer.setSize(W, H);
const renderPass = new RenderPass(scene, persp); composer.addPass(renderPass);
const normalRT = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, depthTexture: new THREE.DepthTexture(W, H) });
const normalMat = new THREE.MeshNormalMaterial();
const inkPass = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, tNormal: { value: null }, tDepth: { value: null }, amount: { value: 0 },
    width: { value: 2.0 }, res: { value: new THREE.Vector2(W, H) }, near: { value: .1 }, far: { value: 1000 }, isOrtho: { value: 0 }, ink: { value: new THREE.Color('#1d1820') } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse, tNormal, tDepth; uniform float amount, width, near, far, isOrtho; uniform vec2 res; uniform vec3 ink; varying vec2 vUv;
    float lin(float d){ if (isOrtho > .5) return near + d * (far - near); float z = d * 2.0 - 1.0; return 2.0 * near * far / (far + near - z * (far - near)); }
    void main(){
      vec4 c = texture2D(tDiffuse, vUv); if (amount <= 0.001) { gl_FragColor = c; return; }
      vec2 px = width / res; float d0 = lin(texture2D(tDepth, vUv).r); vec3 n0 = texture2D(tNormal, vUv).rgb; float e = 0.0;
      for (int i = 0; i < 8; i++) { float a = float(i) * 0.785398; vec2 o = vec2(cos(a), sin(a)) * px;
        float d = lin(texture2D(tDepth, vUv + o).r); vec3 n = texture2D(tNormal, vUv + o).rgb;
        e = max(e, step(0.02 * (d0 - near) + 0.3, abs(d - d0))); e = max(e, smoothstep(.35, .55, length(n - n0))); }
      gl_FragColor = amount > 1.5 ? vec4(vec3(e), 1.0) + 0.0 * texture2D(tNormal, vUv) : vec4(mix(c.rgb, ink, e * amount), c.a); }`,
});
inkPass.uniforms.tNormal.value = normalRT.texture; inkPass.uniforms.tDepth.value = normalRT.depthTexture;   // ShaderPass clones uniforms and drops render-target textures
composer.addPass(inkPass);
const bokeh = new BokehPass(scene, persp, { focus: 30, aperture: .0004, maxblur: .006 }); composer.addPass(bokeh);
const outPass = new OutputPass(); composer.addPass(outPass);
const gradePass = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, vig: { value: .35 }, fade: { value: 0 }, fadeCol: { value: new THREE.Color(0, 0, 0) }, grain: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float vig, fade; uniform vec3 fadeCol; varying vec2 vUv;
    void main(){ vec4 c = texture2D(tDiffuse, vUv); vec2 q = vUv - .5; c.rgb *= 1.0 - vig * smoothstep(.25, .85, length(q * vec2(1.6, 1.0)));
      gl_FragColor = vec4(mix(c.rgb, fadeCol, fade), 1.0); }`,
});
composer.addPass(gradePass);

// ---------- the flat dial ----------
const SQUASH = new THREE.Matrix4();
function applyView() {
  const v = VIEW, f = clamp(v.flat), pos = new THREE.Vector3(...v.pos), at = new THREE.Vector3(...v.look);
  const dir = pos.clone().sub(at), d0 = dir.length(); dir.normalize();
  // 1. dolly-zoom to orthographic: shrink the fov while backing off so the focus plane keeps its size
  const fov0 = v.fov, fov = lerp(fov0, .6, easeIn(f)), dist = d0 * Math.tan(fov0 * Math.PI / 360) / Math.tan(fov * Math.PI / 360);
  const useOrtho = f > .985, sceneR = 220;
  const camObj = useOrtho ? ortho : persp;
  camObj.position.copy(at).addScaledVector(dir, dist);
  camObj.up.set(Math.sin(v.roll), Math.cos(v.roll), 0);
  camObj.lookAt(at);
  if (useOrtho) {
    const h = d0 * Math.tan(fov0 * Math.PI / 360);
    Object.assign(ortho, { left: -h * W / H, right: h * W / H, top: h, bottom: -h, near: Math.max(.1, dist - sceneR), far: dist + sceneR });
    ortho.updateProjectionMatrix();
  } else {
    persp.fov = fov; persp.near = Math.max(.05, f > .05 ? dist - sceneR : .1); persp.far = dist + (f > .05 ? sceneR : 4000); persp.updateProjectionMatrix();
  }
  camObj.updateMatrixWorld();
  // 2. z-squash: compress the world along the view axis toward the focus plane (a paper cut-out theatre)
  const s = 1 - .93 * ease(f / .8), n = dir;
  SQUASH.set(1 - (1 - s) * n.x * n.x, -(1 - s) * n.x * n.y, -(1 - s) * n.x * n.z, 0,
    -(1 - s) * n.y * n.x, 1 - (1 - s) * n.y * n.y, -(1 - s) * n.y * n.z, 0,
    -(1 - s) * n.z * n.x, -(1 - s) * n.z * n.y, 1 - (1 - s) * n.z * n.z, 0, 0, 0, 0, 1);
  const Tm = new THREE.Matrix4().makeTranslation(at.x, at.y, at.z), Ti = new THREE.Matrix4().makeTranslation(-at.x, -at.y, -at.z);
  ROOT.matrixAutoUpdate = false; ROOT.matrix.copy(Tm).multiply(SQUASH).multiply(Ti); ROOT.matrixWorldNeedsUpdate = true;
  // 3. PBR → toon, 4. outlines fade in (and DOF fades out: flat things are all in focus)
  U.uToon.value = ease(seg(f, .15, .75));
  const outline = v.outline ?? ease(seg(f, .82, .98));   // only once near-ortho (the edge pass is un-squashed). outline: 2 = debug, edges only
  inkPass.uniforms.amount.value = outline; inkPass.uniforms.isOrtho.value = useOrtho ? 1 : 0;
  inkPass.uniforms.near.value = camObj.near; inkPass.uniforms.far.value = camObj.far;
  // lights follow the focus point
  const kd = new THREE.Vector3(...v.keyDir).normalize();
  key.position.copy(at).addScaledVector(kd, 120); key.target.position.copy(at); key.color.set(v.keyCol); key.intensity = v.keyInt;
  const sc = key.shadow.camera, R = Math.max(30, d0 * .9); Object.assign(sc, { left: -R, right: R, top: R, bottom: -R, near: 1, far: 300 }); sc.updateProjectionMatrix();
  rim.position.copy(at).add(new THREE.Vector3(-kd.x * 80, 40, -kd.z * 80)); rim.target.position.copy(at); rim.intensity = v.rimInt;
  hemi.intensity = v.fill;
  U.uKeyDir.value.copy(kd).transformDirection(camObj.matrixWorldInverse);
  if (Array.isArray(v.sky)) { SKY.visible = true; SKY.position.copy(camObj.position); SKY_U.top.value.set(v.sky[0]); SKY_U.hor.value.set(v.sky[1]); SKY_U.bot.value.set(v.sky[2] ?? v.sky[1]); scene.background = null; }
  else { SKY.visible = false; scene.background = new THREE.Color(v.sky); }
  scene.fog = v.fog ? new THREE.Fog(v.fog[0], v.fog[1], v.fog[2]) : null;
  renderer.toneMappingExposure = v.exposure;
  // DOF: focus at the look point unless told otherwise; blur 0..1 (1 = very shallow, toy-macro look)
  const focusD = typeof v.focus === 'number' ? v.focus : v.focus ? camObj.position.distanceTo(new THREE.Vector3(...v.focus)) : dist;
  bokeh.enabled = !useOrtho && v.blur * (1 - f) > .01;
  bokeh.camera = camObj;   // BokehPass reads the camera's near/far for depth
  bokeh.uniforms.focus.value = focusD; bokeh.uniforms.aperture.value = .00055 * v.blur * (1 - f) * (35 / Math.max(fov, 1));
  bokeh.uniforms.maxblur.value = .009; bokeh.uniforms.nearClip.value = camObj.near; bokeh.uniforms.farClip.value = camObj.far;
  gradePass.uniforms.vig.value = v.vignette; gradePass.uniforms.fade.value = v.fade; gradePass.uniforms.fadeCol.value.set(v.fadeCol);
  renderPass.camera = camObj; window.__cam = camObj;   // for projecting world points in hud() overlays
  return camObj;
}

// ---------- karaoke (screen-space, drawn on the 2D output canvas) ----------
const outC = document.getElementById('out'), octx = outC.getContext('2d');
function karaoke(t, ctx) {
  if (!PROJECT.karaoke || typeof LY === 'undefined') return;
  const L = LY.find(l => t >= l[0] && t < l[1] + .1); if (!L) return;
  const [a, b, txt] = L, grow = easeOut((t - a) / .15) * (1 - ease((t - (b - .02)) / .12)); if (grow < .02) return;
  const big = /^\(WE DO!\)$/.test(txt), size = big ? 110 : 56, font = `${size}px "Permanent Marker", cursive`;
  ctx.save(); ctx.font = font;
  // the bar opens from a pill already its full height (never a tiny ring) and fades in with it
  const tw = ctx.measureText(txt).width, hh = big ? 160 : 90, w = hh + (tw + 110 - hh) * grow, x0 = 960 - w / 2, y0 = big ? 850 : 962;
  ctx.globalAlpha = Math.min(1, grow * 2.5);
  ctx.fillStyle = 'rgba(24,20,30,.80)'; ctx.beginPath(); ctx.roundRect(x0, y0, w, hh, hh / 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,214,120,.9)'; ctx.lineWidth = 4; ctx.stroke();   // a yellow plastic rim, like a brick tile edge
  if (grow > .85) {
    const words = txt.split(' '), n = txt.length + 1, dur = Math.max(.4, (b - a) * .85); let acc = 0;
    const shown = big ? words.length : words.filter(wd => { const k = acc / n; acc += wd.length + 1; return t >= a + k * dur; }).length;
    ctx.fillStyle = '#FFF5E2'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(words.slice(0, shown).join(' '), 960 - tw / 2, y0 + hh / 2 + 3);
  }
  ctx.restore();
}

// runShot(t): run whichever shot owns song time t (design loops use it to replay a shot, then override cam/look)
function shotIndex(t) { let i = 0; while (i + 1 < SHOTS.length && t >= SHOTS[i + 1][0]) i++; return i; }
function callShot(i, t) { const t0 = SHOTS[i][0], end = i + 1 < SHOTS.length ? SHOTS[i + 1][0] : DUR; SHOTS[i][1](t, t - t0, end - t0); }
function runShot(t) { if (SHOTS.length) callShot(shotIndex(t), t); }

// SHOT-BOUNDARY BLEND: for SHOT_BLEND seconds after a shot starts, every actor that also existed at the previous shot's last
// frame (and moved less than SHOT_BLEND_MAX studs) glides from that state to its new one, so a shot change never makes a body
// or prop jump. Pure: the previous shot is simply evaluated at (start - 1 frame). Set SHOT_BLEND = 0 to switch it off.
window.SHOT_BLEND = .25; window.SHOT_BLEND_MAX = 6;
function snapshotActors() {
  const snap = new Map();
  ROOT.traverse(o => { const a = o.userData?.actor; if (!a) return; const J = o.userData.J, js = {};
    if (J) for (const [k, g] of Object.entries(J)) if (g?.isObject3D && g !== o) js[k] = [g.position.clone(), g.quaternion.clone()];
    snap.set(a, { p: o.position.clone(), q: o.quaternion.clone(), s: o.scale.clone(), js }); });
  return snap;
}
function blendActors(snap, k) {
  ROOT.traverse(o => { const a = o.userData?.actor, b = a && snap.get(a); if (!b || b.p.distanceTo(o.position) > window.SHOT_BLEND_MAX) return;
    o.position.lerpVectors(b.p, o.position, k); o.quaternion.slerpQuaternions(b.q, o.quaternion, k); o.scale.lerpVectors(b.s, o.scale, k);
    const J = o.userData.J; if (J) for (const [key, [p, q]] of Object.entries(b.js)) { const g = J[key]; if (!g?.isObject3D) continue; g.position.lerpVectors(p, g.position, k); g.quaternion.slerpQuaternions(q, g.quaternion, k); } });
}

// ---------- one frame ----------
const OVERLAYS = [];          // screen-space 2D draws after the 3D frame: overlay((ctx, t) => ...)
const overlay = fn => OVERLAYS.push(fn);
let FRAME_OVERLAYS = [];
const hud = fn => FRAME_OVERLAYS.push(fn); // per-frame screen draw from inside a shot (sfx words, flashes)
// expect(name, a, b, maxDist): a contact assertion for THIS frame (a, b = [x,y,z] world points, e.g. limb(pip, 'footR') and
// the door's face). Failures print as page warnings in every sheet/strip render, and tools/continuity.mjs collects them.
let EXPECTS = [];
function expect(name, a, b, maxDist = .6) { const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); EXPECTS.push({ name, d: +d.toFixed(2), ok: d <= maxDist, maxDist }); }
function buildFrame(t) {
  T = t; ROOT.clear(); resetView(); FRAME_OVERLAYS = []; EXPECTS = [];
  ROOT.matrix.identity(); ROOT.updateMatrixWorld(true);   // no squash left over from the previous frame (limb() measures during the shot)
  if (window.LOOP) window.LOOP(t);
  else if (SHOTS.length) {
    const i = shotIndex(t), since = t - SHOTS[i][0];
    if (i > 0 && window.SHOT_BLEND > 0 && since < window.SHOT_BLEND) {
      callShot(i - 1, SHOTS[i][0] - 1 / 24);                       // the previous shot's last frame
      const snap = snapshotActors(); ROOT.clear(); resetView(); FRAME_OVERLAYS = []; EXPECTS = [];
      callShot(i, t); blendActors(snap, ease(since / window.SHOT_BLEND));
    } else callShot(i, t);
  }
  const camObj = applyView();
  if (!window.LOOP || window.LOOP.world) {
    const c = new THREE.Vector3(...VIEW.look); window.__camLook = VIEW.look;   // districts may LOD by distance to the look point
    for (const d of DISTRICTS) if (d.always || Math.hypot(d.at[0] - c.x, d.at[1] - c.z) < d.r + 1600) d.fn(t);   // wide: a district popping in on the horizon (or seen from the moon) is a visible pop
  }
  scene.updateMatrixWorld(true);
  for (const e of EXPECTS) if (!e.ok) console.warn(`expect "${e.name}" failed at t=${t.toFixed(3)}: distance ${e.d} > ${e.maxDist}`);
  return camObj;
}
// simulateAt(t): build the frame WITHOUT rendering and report the actors (anything made by fig/clawd/robot): world position,
// on-screen (in the camera frustum), and joint angles. tools/continuity.mjs uses it to find teleports and pose snaps.
const _fr = new THREE.Frustum(), _pm = new THREE.Matrix4(), _v = new THREE.Vector3();
window.simulateAt = t => {
  const camObj = buildFrame(t); _pm.multiplyMatrices(camObj.projectionMatrix, camObj.matrixWorldInverse); _fr.setFromProjectionMatrix(_pm);
  const actors = [];
  const _s = new THREE.Vector3();
  ROOT.traverse(o => { const a = o.userData?.actor; if (!a || !o.visible) return; let shown = true; o.traverseAncestors(p => { if (!p.visible) shown = false; }); if (!shown) return;
    o.getWorldScale(_s); if (Math.max(_s.x, _s.y, _s.z) < .05) return;   // hidden or scaled to nothing: not on screen
    o.getWorldPosition(_v);
    const J = o.userData.J, joints = J ? Object.fromEntries(['legL', 'legR', 'armL', 'armR', 'head', 'upper'].filter(k => J[k]).map(k => [k, +(J[k].rotation.x + J[k].rotation.y + J[k].rotation.z).toFixed(3)])) : {};
    const sink = J?.body ? +(J.body.position.y - 3.6).toFixed(3) : 0, straight = J?.legL ? Math.abs(J.legL.rotation.x) < .5 && Math.abs(J.legR.rotation.x) < .5 : false;
    actors.push({ id: a, p: [+_v.x.toFixed(3), +_v.y.toFixed(3), +_v.z.toFixed(3)], on: _fr.containsPoint(_v.clone().setY(_v.y + 2)), joints, sink, straight, sc: +Math.max(_s.x, _s.y, _s.z).toFixed(3) }); });
  return { t, actors, expects: EXPECTS, cam: camObj.position.toArray().map(v => +v.toFixed(3)) };
};
function drawFrame(t) {
  const camObj = buildFrame(t);
  if (inkPass.uniforms.amount.value > .001) {      // normals + depth for the ink pass
    // un-squashed world for edges: the squash runs along the view axis, so on screen nothing moves (exactly, once ortho),
    // but depth and normals keep their real 3D differences, which is what the edge detector needs
    const squashed = ROOT.matrix.clone(); ROOT.matrix.identity(); scene.updateMatrixWorld(true);
    scene.overrideMaterial = normalMat; const bg = scene.background, skyOn = SKY.visible; scene.background = null; SKY.visible = false;
    renderer.setRenderTarget(normalRT); renderer.clear(); renderer.render(scene, camObj);
    scene.overrideMaterial = null; scene.background = bg; SKY.visible = skyOn; renderer.setRenderTarget(null);
    ROOT.matrix.copy(squashed); scene.updateMatrixWorld(true);
  }
  composer.render();
  octx.drawImage(canvas, 0, 0);
  for (const f of FRAME_OVERLAYS) { octx.save(); f(octx, t); octx.restore(); }
  for (const f of OVERLAYS) { octx.save(); f(octx, t); octx.restore(); }
  if (!window.LOOP) karaoke(t, octx);
}

// ---------- page contract for render.mjs ----------
window.renderAt = async (t, type = 'image/png', q = .92) => { drawFrame(t); return outC.toDataURL(type, q); };
window.renderSheet = async (times, cols = 3, w = 640, crop = null) => {
  const h = crop ? Math.round(w * crop[3] / crop[2]) : Math.round(w * H / W), rows = Math.ceil(times.length / cols);
  const sc = document.createElement('canvas'); sc.width = cols * w; sc.height = rows * (h + 22);
  const c = sc.getContext('2d'); c.fillStyle = '#111'; c.fillRect(0, 0, sc.width, sc.height); const ms = [];
  for (let i = 0; i < times.length; i++) {
    const t0 = performance.now(); drawFrame(times[i]); ms.push(Math.round(performance.now() - t0));
    const x = (i % cols) * w, y = Math.floor(i / cols) * (h + 22);
    if (crop) c.drawImage(outC, crop[0], crop[1], crop[2], crop[3], x, y + 22, w, h); else c.drawImage(outC, x, y + 22, w, h);
    c.fillStyle = '#ddd'; c.font = '14px monospace'; c.fillText(times[i].toFixed(2) + 's', x + 6, y + 16);
  }
  return { url: sc.toDataURL('image/jpeg', .9), ms };
};
window.gpuInfo = () => { const gl = renderer.getContext(), e = gl.getExtension('WEBGL_debug_renderer_info'); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER); };

// export everything chapters need as globals (chapter files are plain modules that use these names)
Object.assign(window, { expect, limb, path, fly, smoother, mixVal, runShot, THREE, W, H, BPM, BEAT, OFF, DUR, clamp, lerp, ease, easeIn, easeOut, backOut, seg, frac, hash, bt, beatPh, pulse, kf, shake,
  plastic, matte, glowMat, part, partGeo, build, growing, keep, put, district, shots, cam, look, orbit, drift, overlay, hud, LOOPS, ROOT, renderer,
  T: () => T, scene });
window.ENGINE3D = { start: async () => {
  await document.fonts.load('56px "Permanent Marker"').catch(() => {}); await document.fonts.ready;
  drawFrame(0); window.ready = true;
  // interactive scrubber (studio.html without ?render)
  const s = document.getElementById('scrub'), lab = document.getElementById('tt'); if (!s) return;
  s.max = window.LOOP ? window.LOOP.len : DUR;
  s.oninput = () => { const t0 = performance.now(); drawFrame(+s.value); lab.textContent = `${(+s.value).toFixed(2)}s · ${Math.round(performance.now() - t0)} ms`; };
} };
