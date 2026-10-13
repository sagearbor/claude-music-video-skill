// cast3d.js: brick-toy cast for the 3D engine. Minifig-style people built from baked LDraw parts, faces as swappable
// 2D decals, Clawd built from bricks, props, and ambient "life" (robots building, farmers sowing) for living backgrounds.
//
//   const p = fig('pip', PIP);              cached figure (one per key; two on screen at once need two keys)
//   pose(p, { legL, legR, armL, armR, head, face: 'joy', lean, ... });   sets EVERY joint (unset = rest)
//   put(p, x, 0, z, ry);                    feet on y=0; faces +z when ry = 0
//   walkPose(ph) / runPose(ph) / st(t)      stiff stop-motion gaits; st(t) quantises time to 12 fps ("on twos")
// Arm angles: + swings the arm forward/up (1.57 = straight ahead, 3.1 = up). Leg angles: + forward.
// Face names: neutral, joy, fear, determined, smug, suspicious, shocked, dizzy, sleepy, angry, sing, wink, x, star.
//   Or an object { eyes, mouth, brows, lookX, lookY } with the 2D kit's eye/mouth names.
const T3 = THREE, LDU = 1 / 20;
const COL = { yellow: '#F2CD37', teal: '#3A9C98', navy: '#2D3A6B', mustard: '#E8AA38', white: '#F4F4F4', black: '#1B1B1F', red: '#C4281C',
  orange: '#D97757', dkorange: '#A95500', tan: '#E4CD9E', brown: '#583927', grey: '#A0A5A9', dkgrey: '#6C6E68', green: '#4B9F4A', dkgreen: '#237841',
  blue: '#0055BF', ltblue: '#9FC3E9', pink: '#E4ADC8', magenta: '#923978', lilac: '#CDA4DE', mint: '#A5D9B9', cream: '#F3E7C8', gold: '#DBAC34', silver: '#C9CACA' };
const st = (t, fps = 12) => Math.floor(t * fps) / fps;

// LDraw placement → our frame (y up, front +z): position flips y and z; a rotation about LDraw x stays a rotation about x.
const L = (x, y, z) => new T3.Vector3(x * LDU, -y * LDU, -z * LDU);

// ---------- face decals ----------
const FACES = {
  neutral: { eyes: 'dot', mouth: 'smile' }, joy: { eyes: 'happy', mouth: 'grin' }, fear: { eyes: 'wide', mouth: 'wobble', brows: 'worried' },
  determined: { eyes: 'narrow', mouth: 'flat', brows: 'angry' }, smug: { eyes: 'narrow', mouth: 'smirk', brows: 'up' }, suspicious: { eyes: 'narrow', mouth: 'flat', lookX: .6 },
  shocked: { eyes: 'wide', mouth: 'O', brows: 'up' }, dizzy: { eyes: 'swirl', mouth: 'wobble' }, sleepy: { eyes: 'sleepy', mouth: 'o' }, angry: { eyes: 'dot', mouth: 'grin', brows: 'angry' },
  sing: { eyes: 'happy', mouth: 'O' }, wink: { eyes: 'wink', mouth: 'smirk' }, x: { eyes: 'x', mouth: 'flat' }, star: { eyes: 'star', mouth: 'grin' },
};
const FACE_TEX = new Map();
// The decal canvas covers the front 180° of the head: x 0..1024 = angle -90°..+90°, y 0..512 = head height.
function faceTexture(spec, glasses) {
  const f = typeof spec === 'string' ? (FACES[spec] || FACES.neutral) : spec, k = JSON.stringify(f) + glasses;
  if (FACE_TEX.has(k)) return FACE_TEX.get(k);
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d');
  g.translate(512, 250); g.scale(1.32, 1.32); g.translate(-512, -262);   // features bigger and a touch higher on the head
  const ink = '#1d1a1a', cx = 512, ey = 230, ex = 118, lx = (f.lookX || 0) * 16, ly = (f.lookY || 0) * 12;
  g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = ink; g.fillStyle = ink;
  const line = (pts, w) => { g.lineWidth = w; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); };
  const ell = (x, y, rx, ry, fill = ink) => { g.fillStyle = fill; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); g.fillStyle = ink; };
  for (const s of [-1, 1]) {
    const x = cx + s * ex, e = f.eyes === 'wink' && s > 0 ? 'happy' : f.eyes;
    if (e === 'dot' || !e) ell(x + lx, ey + ly, 20, 26);
    else if (e === 'narrow') { ell(x + lx, ey + 8 + ly, 20, 13); line([[x - 34, ey - 14], [x + 34, ey - 8]], 9); }
    else if (e === 'wide') { ell(x, ey, 44, 46, '#fff'); g.lineWidth = 7; g.beginPath(); g.ellipse(x, ey, 44, 46, 0, 0, 7); g.stroke(); ell(x + lx * 1.4, ey + ly, 18, 20); }
    else if (e === 'happy') line([[x - 30, ey + 10], [x, ey - 20], [x + 30, ey + 10]], 11);
    else if (e === 'sleepy') { line([[x - 32, ey + 4], [x + 32, ey + 4]], 10); ell(x, ey + 16, 16, 9); }
    else if (e === 'x') { line([[x - 24, ey - 24], [x + 24, ey + 24]], 11); line([[x + 24, ey - 24], [x - 24, ey + 24]], 11); }
    else if (e === 'swirl') { g.lineWidth = 7; g.beginPath(); for (let a = 0; a < 16; a += .2) { const r = a * 2.4; g.lineTo(x + Math.cos(a * s) * r, ey + Math.sin(a * s) * r); } g.stroke(); }
    else if (e === 'star') { g.fillStyle = '#E8AA38'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 18 : 42; g.lineTo(x + Math.cos(a) * r, ey + Math.sin(a) * r); } g.closePath(); g.fill(); g.lineWidth = 5; g.stroke(); g.fillStyle = ink; }
    if (glasses) { g.lineWidth = 9; g.beginPath(); g.ellipse(x, ey, 62, 58, 0, 0, 7); g.stroke(); }
    if (f.brows) { const tilt = f.brows === 'worried' ? -s * 14 : f.brows === 'angry' ? s * 16 : 0, lift = f.brows === 'up' ? -22 : 0;
      line([[x - 38, ey - 78 + lift + tilt], [x + 38, ey - 78 + lift - tilt]], 11); }
  }
  if (glasses) line([[cx - 56, ey - 6], [cx + 56, ey - 6]], 8);
  const my = 368, m = f.mouth || 'smile';
  if (m === 'smile') { g.lineWidth = 10; g.beginPath(); g.arc(cx, my - 46, 60, .35, Math.PI - .35); g.stroke(); }
  else if (m === 'grin') { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(cx - 84, my - 20); g.quadraticCurveTo(cx, my + 90, cx + 84, my - 20); g.closePath(); g.fill(); g.lineWidth = 9; g.stroke(); g.fillStyle = ink; }
  else if (m === 'smirk') line([[cx - 56, my + 4], [cx + 18, my + 12], [cx + 62, my - 18]], 10);
  else if (m === 'flat') line([[cx - 46, my], [cx + 46, my]], 10);
  else if (m === 'o') ell(cx, my + 6, 22, 28, '#6a2a35');
  else if (m === 'O') { ell(cx, my + 14, 44, 56, '#6a2a35'); g.lineWidth = 7; g.beginPath(); g.ellipse(cx, my + 14, 44, 56, 0, 0, 7); g.stroke(); }
  else if (m === 'wobble') line([[cx - 70, my], [cx - 35, my - 16], [cx, my], [cx + 35, my - 16], [cx + 70, my]], 9);
  const tex = new T3.CanvasTexture(c); tex.colorSpace = T3.SRGBColorSpace; tex.anisotropy = 8;
  FACE_TEX.set(k, tex); return tex;
}
const FACE_GEO = new T3.CylinderGeometry(.662, .662, .9, 40, 1, true, -Math.PI / 2, Math.PI);

// ---------- the minifig ----------
// look: { torso, legs, hips, arms, hands, skin, hat: 'beanie'|'hair'|null, hatCol, hairCol, glasses, pencil, scale }
function makeFig(look) {
  const skin = look.skin || COL.yellow, J = {};
  const g = new T3.Group(); J.root = g;
  const body = new T3.Group(); body.position.set(0, 3.6, 0); g.add(body); J.body = body;               // torso origin = neck base
  const hips = part('3815', look.hips || look.legs || COL.navy); hips.position.copy(L(0, 32, 0)); body.add(hips);
  for (const [side, id] of [['R', '3816'], ['L', '3817']]) {
    const pv = new T3.Group(); pv.position.copy(L(0, 44, 0)); body.add(pv); pv.add(part(id, look.legs || COL.navy)); J['leg' + side] = pv;
  }
  const upper = new T3.Group(); body.add(upper); J.upper = upper;                                       // torso + arms + head (leans)
  upper.add(part('973', look.torso || COL.teal));
  for (const [side, id, sx] of [['R', '3818', -1], ['L', '3819', 1]]) {
    const sh = new T3.Group(); sh.position.copy(L(sx * 15.552, 9, 0)); sh.rotation.z = sx * -.17; upper.add(sh);
    const swing = new T3.Group(); sh.add(swing); swing.add(part(id, look.arms || look.torso || COL.teal)); J['arm' + side] = swing;
    // wrist: the forearm tip measured from the 3818 mesh (-.25, -.94, .50); the hand's peg runs along its -z, so tilt +45°
    const wr = new T3.Group(); wr.position.set(sx * .25, -1.05, .6); wr.rotation.x = Math.PI / 4; swing.add(wr);
    const hand = new T3.Group(); wr.add(hand); hand.add(part('3820', look.hands || skin)); J['hand' + side] = hand;
    const grip = new T3.Group(); grip.position.set(0, .1, .45); hand.add(grip); J['grip' + side] = grip;   // attach held props here
  }
  const neck = new T3.Group(); neck.position.copy(L(0, -24, 0)); upper.add(neck); J.head = neck;
  neck.add(part('3626c', skin));
  const face = new T3.Mesh(FACE_GEO, new T3.MeshStandardMaterial({ transparent: true, roughness: .45, polygonOffset: true, polygonOffsetFactor: -2 }));
  face.position.set(0, -.68, 0); neck.add(face); J.face = face;
  if (look.hat === 'beanie') { const h = part('41334', look.hatCol || COL.mustard); h.position.set(0, 0, 0); neck.add(h); J.hat = h; }
  else if (look.hat === 'hair') { const h = part('62810', look.hairCol || COL.brown); neck.add(h); J.hat = h; }
  if (look.pencil) { const p = pencil(.42); p.position.set(-.72, -.42, -.6); p.rotation.set(1.42, 0, .12); neck.add(p); J.earPencil = p; }   // behind the right ear, along the head
  g.userData = { J, look };
  if (look.scale) g.scale.setScalar(look.scale);
  return g;
}
function fig(key, look) { return keep('fig:' + key, () => makeFig(look)); }
const REST = { legL: 0, legR: 0, armL: 0, armR: 0, armLz: 0, armRz: 0, handL: 0, handR: 0, head: 0, headTilt: 0, headRoll: 0, lean: 0, twist: 0, bodyY: 0, bodyRoll: 0, face: 'neutral' };
function pose(f, p = {}) {
  const { J, look } = f.userData, q = { ...REST, ...p };
  J.legL.rotation.set(-q.legL, 0, 0); J.legR.rotation.set(-q.legR, 0, 0);
  J.armL.rotation.set(-q.armL, 0, -q.armLz); J.armR.rotation.set(-q.armR, 0, q.armRz);
  J.handL.rotation.set(0, 0, q.handL); J.handR.rotation.set(0, 0, q.handR);
  J.head.rotation.set(-q.headTilt, q.head, q.headRoll);
  J.upper.rotation.set(q.lean, q.twist, 0);
  J.body.position.y = 3.6 + q.bodyY; J.body.rotation.set(0, 0, q.bodyRoll);
  J.face.material.map = faceTexture(q.face, !!look.glasses); J.face.material.needsUpdate = true;
  for (const s of ['L', 'R']) { const gp = J['grip' + s]; while (gp.children.length) gp.remove(gp.children[0]); if (q['hold' + s]) gp.add(q['hold' + s]); }
  return f;
}
// gaits (ph = cycles; stiff: legs swing as straight hinges, arms counter-swing)
const walkPose = ph => { const s = Math.sin(ph * Math.PI * 2); return { legL: .5 * s, legR: -.5 * s, armL: -.45 * s, armR: .45 * s, bodyY: .06 * Math.abs(Math.cos(ph * Math.PI * 2)) }; };
const runPose = ph => { const s = Math.sin(ph * Math.PI * 2); return { legL: .9 * s, legR: -.9 * s, armL: -1.0 * s, armR: 1.0 * s, lean: .18, bodyY: .25 * Math.abs(s) }; };

// ---------- Pip and the crowd ----------
const PIP = { torso: COL.teal, legs: COL.navy, hat: 'beanie', hatCol: COL.mustard, glasses: true, pencil: true };
const CROWD_TORSO = [COL.red, COL.blue, COL.green, COL.magenta, COL.orange, COL.lilac, COL.white, COL.dkorange];
const crowdLook = i => ({ torso: CROWD_TORSO[i % 8], legs: [COL.navy, COL.black, COL.tan, COL.dkgrey][i % 4], hat: i % 3 ? 'hair' : 'beanie',
  hairCol: [COL.brown, COL.black, COL.dkorange, COL.tan][i % 4], hatCol: [COL.red, COL.blue, COL.green][i % 3], skin: COL.yellow });

// ---------- Clawd, built from bricks ----------
// A terracotta block body (4 wide, 3 bricks tall), stubby side arms, four round-brick legs, a screen-face decal.
// clawdPose: { legs (walk phase or null), armL, armR (raise 0..1), face, hat: 'headset'|'keeper'|'reaper'|'halo'|null, bob, squash }
const CLAWD_FACES = { neutral: { eyes: 'bar' }, joy: { eyes: 'happy' }, smug: { eyes: 'bar', lids: .4 }, shocked: { eyes: 'big' }, dizzy: { eyes: 'swirl' },
  suspicious: { eyes: 'bar', lids: .55, lookX: .5 }, sleepy: { eyes: 'bar', lids: .8 }, x: { eyes: 'x' }, fear: { eyes: 'big', lookX: -.4 }, glitch: { eyes: 'glitch' } };
const CF_TEX = new Map();
function clawdFaceTex(name) {
  if (CF_TEX.has(name)) return CF_TEX.get(name);
  const f = CLAWD_FACES[name] || CLAWD_FACES.neutral, c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = '#1d1a1a'; g.strokeStyle = '#1d1a1a'; g.lineCap = 'round'; g.lineWidth = 30;
  for (const s of [-1, 1]) {
    const x = 256 + s * 105 + (f.lookX || 0) * 30, y = 128;
    if (f.eyes === 'bar') { const h = 170 * (1 - (f.lids || 0)); g.fillRect(x - 30, y + 85 - h, 60, h); }
    else if (f.eyes === 'big') { g.fillStyle = '#fff'; g.fillRect(x - 48, y - 100, 96, 200); g.fillStyle = '#1d1a1a'; g.fillRect(x - 26, y - 40, 52, 90); }
    else if (f.eyes === 'happy') { g.beginPath(); g.moveTo(x - 36, y + 20); g.lineTo(x, y - 24); g.lineTo(x + 36, y + 20); g.stroke(); }
    else if (f.eyes === 'x') { g.beginPath(); g.moveTo(x - 30, y - 30); g.lineTo(x + 30, y + 30); g.moveTo(x + 30, y - 30); g.lineTo(x - 30, y + 30); g.stroke(); }
    else if (f.eyes === 'swirl') { g.lineWidth = 10; g.beginPath(); for (let a = 0; a < 16; a += .2) g.lineTo(x + Math.cos(a * s) * a * 3, y + Math.sin(a * s) * a * 3); g.stroke(); g.lineWidth = 22; }
    else if (f.eyes === 'glitch') { for (let i = 0; i < 5; i++) g.fillRect(x - 30 + (i * 37 % 23), y - 60 + i * 26, 40 + (i * 13 % 30), 14); }
  }
  const tex = new T3.CanvasTexture(c); tex.colorSpace = T3.SRGBColorSpace; CF_TEX.set(name, tex); return tex;
}
function makeClawd(o = {}) {
  const col = o.col || COL.orange, J = {}, g = new T3.Group(), body = new T3.Group(); g.add(body); J.body = body;
  const list = [];
  for (let r = 0; r < 3; r++) list.push(['3001', col, 0, 2.4 + (r + 1) * 1.2, 0, 0]);               // 2x4 bricks, 4 wide, stacked
  body.add(build(list));
  J.legs = [];
  for (const [x, z] of [[-1.5, -.5], [-.5, .5], [.5, -.5], [1.5, .5]].map(([x, z], i) => [[-1.5, -.5, .5, 1.5][i], z])) {
    const lg = new T3.Group(); lg.position.set(x, 2.4, 0); body.add(lg); J.legs.push(lg);
    for (let k = 0; k < 2; k++) { const b = part('3062b', col); b.position.set(0, -k * 1.2, 0); lg.add(b); }
  }
  for (const [s, k] of [[-1, 'L'], [1, 'R']]) {
    const sh = new T3.Group(); sh.position.set(s * 2, 4.4, 0); body.add(sh);
    const arm = part('3004', col); arm.rotation.y = Math.PI / 2; arm.position.set(s * .5, .6, 0); sh.add(arm); J['arm' + k] = sh;
    const grip = new T3.Group(); grip.position.set(s * 1.1, 0, .2); sh.add(grip); J['grip' + k] = grip;
  }
  const scr = new T3.Mesh(new T3.PlaneGeometry(3.4, 1.7), new T3.MeshStandardMaterial({ transparent: true, roughness: .4, polygonOffset: true, polygonOffsetFactor: -2 }));
  scr.position.set(0, 4.5, 1.001); body.add(scr); J.face = scr;
  const hats = {
    headset: () => { const h = new T3.Group(); const band = new T3.Mesh(new T3.TorusGeometry(2.15, .14, 10, 32, Math.PI), plastic(COL.black)); band.position.y = 6.0; h.add(band);
      for (const s of [-1, 1]) { const cup = new T3.Mesh(new T3.CylinderGeometry(.5, .5, .3, 20), plastic(COL.dkgrey)); cup.rotation.z = Math.PI / 2; cup.position.set(s * 2.15, 6, 0); h.add(cup); }
      const mic = new T3.Mesh(new T3.CylinderGeometry(.07, .07, 1.8, 8), plastic(COL.black)); mic.rotation.set(Math.PI / 2, 0, 0); mic.position.set(-2.1, 5.4, .9); h.add(mic);
      const tip = new T3.Mesh(new T3.SphereGeometry(.2, 12, 8), plastic(COL.black)); tip.position.set(-2.1, 5.4, 1.8); h.add(tip); return h; },
    keeper: () => { const h = new T3.Group(); const cap = new T3.Mesh(new T3.CylinderGeometry(1.6, 1.8, .9, 24), plastic('#5B7A3A')); cap.position.y = 6.5; h.add(cap);
      const brim = new T3.Mesh(new T3.BoxGeometry(2.4, .12, 1.4), plastic('#4A6630')); brim.position.set(0, 6.1, 1.6); h.add(brim); return h; },
    reaper: () => { const h = new T3.Group(); const hood = new T3.Mesh(new T3.SphereGeometry(2.7, 24, 16, 0, Math.PI * 2, 0, Math.PI * .55), matte('#232026')); hood.scale.set(1, 1.1, .9); hood.position.set(0, 5.0, -.4); h.add(hood); return h; },
    halo: () => { const h = new T3.Group(); const ring = new T3.Mesh(new T3.TorusGeometry(1.4, .16, 12, 40), glowMat('#FFE38A', 2.2)); ring.rotation.x = Math.PI / 2; ring.position.y = 7.2; h.add(ring); return h; },
  };
  J.hats = {}; for (const [k, f] of Object.entries(hats)) { J.hats[k] = f(); body.add(J.hats[k]); }
  g.userData = { J }; if (o.scale) g.scale.setScalar(o.scale); return g;
}
function clawd(key, o) { return keep('clawd:' + key, () => makeClawd(o)); }
function clawdPose(c, p = {}) {
  const { J } = c.userData, walk = p.walk;
  J.legs.forEach((lg, i) => { lg.rotation.set(walk != null ? .45 * Math.sin((walk + (i % 2) * .5) * Math.PI * 2) : 0, 0, 0); });
  J.armL.rotation.set(0, 0, -(p.armL || 0) * 1.2); J.armR.rotation.set(0, 0, (p.armR || 0) * 1.2);
  J.body.position.y = (p.bob || 0); J.body.rotation.set(p.lean || 0, p.twist || 0, p.roll || 0);
  J.body.scale.set(1 + (p.squash || 0) * .3, 1 - (p.squash || 0) * .3, 1 + (p.squash || 0) * .3);
  J.face.material.map = clawdFaceTex(p.face || 'neutral'); J.face.material.needsUpdate = true;
  for (const [k, h] of Object.entries(J.hats)) h.visible = p.hat === k;
  for (const s of ['L', 'R']) { const gp = J['grip' + s]; while (gp.children.length) gp.remove(gp.children[0]); if (p['hold' + s]) gp.add(p['hold' + s]); }
  return c;
}

// ---------- props ----------
function pencil(s = 1) {   // along +y: eraser at the bottom, point at the top; length about 3s
  const g = new T3.Group();
  const add = (geo, m, y) => { const x = new T3.Mesh(geo, m); x.position.y = y * s; x.scale.setScalar(s); x.castShadow = true; g.add(x); };
  add(new T3.CylinderGeometry(.16, .16, .35, 6), plastic(COL.pink), .17);
  add(new T3.CylinderGeometry(.165, .165, .18, 12), plastic(COL.silver, { metalness: .8, roughness: .3 }), .43);
  add(new T3.CylinderGeometry(.16, .16, 1.9, 6), plastic(COL.yellow), 1.47);
  add(new T3.ConeGeometry(.16, .5, 6), matte(COL.tan), 2.67);
  add(new T3.ConeGeometry(.055, .17, 6), matte(COL.black), 2.84);
  return g;
}
function handset(col = '#E27A92') {
  const g = new T3.Group(), m = plastic(col);
  const bar = new T3.Mesh(new T3.CapsuleGeometry(.32, 3.2, 6, 16), m); bar.rotation.z = Math.PI / 2; g.add(bar);
  for (const s of [-1, 1]) { const cup = new T3.Mesh(new T3.CylinderGeometry(.55, .45, .7, 20), m); cup.position.set(s * 1.7, -.45, 0); g.add(cup); }
  g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g;
}
function pill(a = COL.red, b = COL.white) {
  const g = new T3.Group();
  for (const [c, y] of [[a, .45], [b, -.45]]) { const m = new T3.Mesh(new T3.CapsuleGeometry(.5, .9, 6, 16), plastic(c)); m.scale.set(1, .5, 1); m.position.y = y * .5; g.add(m); }
  g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g;
}
function cage(col = COL.gold) {   // a little birdcage: a base plate, bars, a domed top
  const g = new T3.Group();
  g.add(build([['3958', col, 0, .4, 0]]));
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, b = new T3.Mesh(new T3.CylinderGeometry(.08, .08, 5, 6), plastic(col, { metalness: .6, roughness: .25 })); b.position.set(Math.sin(a) * 2.6, 2.9, Math.cos(a) * 2.6); g.add(b); }
  const top = new T3.Mesh(new T3.SphereGeometry(2.7, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), plastic(col, { metalness: .6, roughness: .25, side: T3.DoubleSide })); top.position.y = 5.3; g.add(top);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g;
}
function gravestone() {
  return build([['3004', COL.grey, -.5, 1.2, 0, 0], ['3004', COL.grey, .5, 1.2, 0, 0], ['3004', COL.grey, -.5, 2.4, 0, 0], ['3004', COL.grey, .5, 2.4, 0, 0],
    ['3062b', COL.grey, -.5, 3.6, 0], ['3062b', COL.grey, .5, 3.6, 0], ['3022', COL.dkgrey, 0, .4, 0]].map(([id, c, x, y, z, r]) => [id, c, x, y, z, r ?? 0]));
}
// A door in a brick frame (local: hinge at x=0, panel extends to +x; open 0..1 swings it; burst k 0..1 blows it off)
function doorUnit(col, frame = COL.white) {
  const g = new T3.Group(), list = [];
  for (let r = 0; r < 6; r++) for (const x of [-.5, 4.5]) list.push(['3005', frame, x, (r + 1) * 1.2, 0, 0]);
  for (let x = -.5; x <= 4.5; x += 1) list.push(['3024', frame, x, 7.6, 0, 0]);
  g.add(build(list));
  const hinge = new T3.Group(); hinge.position.set(0, 0, 0); g.add(hinge);
  const panel = new T3.Mesh(new T3.BoxGeometry(4, 7.1, .35), plastic(col)); panel.position.set(2, 3.6, 0); panel.castShadow = panel.receiveShadow = true; hinge.add(panel);
  for (const y of [2, 5]) { const inset = new T3.Mesh(new T3.BoxGeometry(2.8, 2.4, .1), plastic(col, { roughness: .45 })); inset.position.set(2, y, .22); hinge.add(inset); }
  const knob = new T3.Mesh(new T3.SphereGeometry(.22, 12, 8), plastic(COL.gold, { metalness: .7, roughness: .25 })); knob.position.set(3.5, 3.6, .3); hinge.add(knob);
  g.userData = { hinge, panel };
  return g;
}
function doorPose(d, open = 0, burst = 0, seed = 1) {
  const h = d.userData.hinge;
  h.rotation.set(0, -open * 1.9, 0); h.position.set(0, 0, 0);
  if (burst > 0) { const k = easeOut(burst); h.position.set(-1.5 * k + Math.sin(seed) * 2 * k, 3 * k - 9 * burst * burst, 9 * k); h.rotation.set(-1.4 * k, (hash(seed) - .5) * 2 * k, 2.2 * k * (hash(seed + 1) - .5)); }
  return d;
}
// a sheet of paper (scroll) that can unroll: k 0..1
function scroll(k, w = 3, h = 4.4) {
  const geo = new T3.PlaneGeometry(w, h, 1, 24), pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i), v = (h / 2 - y) / h; if (v > k) { const a = (v - k) * h / .35; pos.setY(i, h / 2 - k * h - Math.sin(a) * .35); pos.setZ(i, .35 - Math.cos(a) * .35); } }
  pos.needsUpdate = true; geo.computeVertexNormals();
  return geo;
}
const PAPER = () => keep('mat:paper', () => toonPaper());
function toonPaper() { const c = document.createElement('canvas'); c.width = 256; c.height = 360; const g = c.getContext('2d'); g.fillStyle = '#F6EED8'; g.fillRect(0, 0, 256, 360);
  g.strokeStyle = '#8a7f6a'; g.lineWidth = 5; for (let y = 50; y < 330; y += 34) { g.beginPath(); g.moveTo(26, y); g.lineTo(230 - (y % 3) * 20, y); g.stroke(); }
  const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; return matte('#ffffff', { map: t, side: T3.DoubleSide }); }
// an origami paper bird with flapping wings (flap = phase)
function paperBird() {
  const g = new T3.Group(), m = matte('#F6EED8', { side: T3.DoubleSide });
  const body = new T3.Mesh(new T3.ConeGeometry(.25, 1.4, 4), m); body.rotation.x = Math.PI / 2; g.add(body);
  for (const s of [-1, 1]) { const wg = new T3.Group(); const w = new T3.Mesh(new T3.BufferGeometry().setFromPoints([new T3.Vector3(0, 0, -.5), new T3.Vector3(s * 1.4, 0, 0), new T3.Vector3(0, 0, .5)]), m); w.geometry.computeVertexNormals(); wg.add(w); g.add(wg); g.userData['w' + s] = wg; }
  g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g;
}
function birdPose(b, flap) { const a = .8 * Math.sin(flap * Math.PI * 2); b.userData['w-1'].rotation.z = -a; b.userData.w1.rotation.z = a; return b; }

// Props pre-oriented for a minifig hand: pose(f, { armR: 1.0, holdR: heldPencil('k') }). The hand's grip axis is local y.
//   heldPencil: upright in the fist (point up). heldHandset: at the ear when armR ≈ 1.55 (talking into it).
const heldPencil = (key = 'p', s = .55) => keep('heldPencil:' + key, () => { const g = new T3.Group(), p = pencil(s); p.position.y = -.6 * s / .42; g.add(p); return g; });
const heldHandset = (key = 'h', col) => keep('heldHandset:' + key, () => { const g = new T3.Group(), h = handset(col); h.rotation.set(0, 0, Math.PI / 2); h.scale.setScalar(.38); g.add(h); return g; });

// ---------- ambient life: building sites and fields (pure functions of song time) ----------
// buildSite(key, { at:[x,z], w, d, floors, col, t0, t1, robots }): a brick building rising from t0 to t1. Robots ferry bricks.
function buildSite(key, o, t) {
  const site = keep('site:' + key, () => {
    const list = [], w = o.w || 6, d = o.d || 4, floors = o.floors || 8, n = [];
    for (let r = 0; r < floors; r++) for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) {
      if (i > 0 && i < w - 1 && j > 0 && j < d - 1) continue;                                 // hollow walls
      const win = r % 3 === 1 && (i % 2 === 1) && (j === 0 || j === d - 1);
      n.push([win ? '3005' : '3005', win ? COL.ltblue : (o.col || COL.red), i - w / 2 + .5, (r + 1) * 1.2, j - d / 2 + .5, 0]);
    }
    n.forEach((b, k) => list.push([...b, lerp(o.t0 ?? 0, o.t1 ?? DUR, k / n.length)]));
    return growing(list);
  });
  site.userData.grow(t); put(site, o.at[0], 0, o.at[1], o.ry || 0);
  // robots: little grey brick bots walking a loop between a brick pile and the wall, carrying a brick
  const nb = o.robots ?? 2;
  for (let i = 0; i < nb; i++) {
    const r = keep(`bot:${key}:${i}`, () => robot()), ph = frac(st(t) * .25 + i / nb), out = ph < .5;
    const k = out ? ease(ph * 2) : ease(2 - ph * 2), x = o.at[0] + lerp((o.w || 6) * .5 + 4, (o.w || 6) * .5 + .5, k) * (i % 2 ? -1 : 1), z = o.at[1] + (o.d || 4) * .5 + 1.5 + i * .8;
    robotPose(r, { walk: st(t) * 2 + i, carry: out });
    put(r, x, 0, z, (out ? -1 : 1) * (i % 2 ? -1 : 1) * Math.PI / 2);
  }
}
function robot() {
  const g = new T3.Group(), J = {};
  const body = build([['3003', COL.grey, 0, 3.6, 0, 0], ['3003', COL.dkgrey, 0, 2.4, 0, 0], ['3062b', COL.black, 0, 4.8, 0, 0], ['6141', COL.red, 0, 5.2, 0, 0]]); g.add(body);
  const eye = new T3.Mesh(new T3.BoxGeometry(1.2, .25, .1), glowMat('#7CE3FF', 2)); eye.position.set(0, 3.9, 1.02); g.add(eye);
  J.legs = [-.5, .5].map(x => { const l = new T3.Group(); l.position.set(x, 1.2, 0); l.add(part('3005', COL.dkgrey)); g.add(l); return l; });
  const carry = build([['3001', COL.red, 0, 0, 0, 0]]); carry.position.set(0, 5, .6); carry.scale.setScalar(.8); g.add(carry); J.carry = carry;
  g.userData = { J }; return g;
}
function robotPose(r, p) { const { J } = r.userData; J.legs.forEach((l, i) => { l.rotation.x = .5 * Math.sin((p.walk + i * .5) * Math.PI * 2); }); J.carry.visible = !!p.carry; return r; }
// field(key, { at:[x,z], rows, len, t0, t1, crop }): furrows; sprouts appear as the sower passes (sown at t0..t1), then grow
function field(key, o, t) {
  const rows = o.rows || 5, len = o.len || 16, t0 = o.t0 ?? 0, t1 = o.t1 ?? DUR;
  const soil = keep('soil:' + key, () => { const l = []; for (let r = 0; r < rows; r++) for (let x = 0; x < len; x += 2) l.push(['3022', COL.brown, x - len / 2 + 1, .4, r * 2.4 - rows * 1.2, 0]); return build(l); });
  put(soil, o.at[0], 0, o.at[1]);
  const sprouts = keep('sprout:' + key, () => { const l = []; for (let r = 0; r < rows; r++) for (let x = 0; x < len; x += 2) { const k = (r + (r % 2 ? (len - x) / len : x / len)) / rows; l.push(['30176', COL.green, x - len / 2 + 1, .8, r * 2.4 - rows * 1.2 + .5, hash(r * 31 + x) * 6, lerp(t0, t1, k) + 2]); } return growing(l); });
  sprouts.userData.grow(t); put(sprouts, o.at[0], 0, o.at[1]);
  // the sower walks the boustrophedon path
  const k = clamp((t - t0) / (t1 - t0)), rr = Math.min(rows - 1, Math.floor(k * rows)), u = k * rows - rr, dir = rr % 2 ? -1 : 1;
  const f = fig('sower:' + key, crowdLook(o.look ?? 2)), x = o.at[0] + (dir > 0 ? lerp(-len / 2, len / 2, u) : lerp(len / 2, -len / 2, u)), z = o.at[1] + rr * 2.4 - rows * 1.2 - .6;
  pose(f, { ...walkPose(st(t) * 1.2), armR: 1.2 + .3 * Math.sin(st(t) * 9), face: 'joy' });
  put(f, x, 0, z, dir * Math.PI / 2);
}

// ---------- world helpers ----------
// skyDome(key, top, bottom): a huge unlit gradient sphere (drawn behind everything; ignores fog and the flat dial)
function skyDome(key, top, bottom, horizon) {
  const d = keep('sky:' + key, () => {
    const m = new T3.ShaderMaterial({ side: T3.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new T3.Color(top) }, bot: { value: new T3.Color(bottom) }, hor: { value: new T3.Color(horizon || bottom) } },
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform vec3 top, bot, hor; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(hor, top, smoothstep(0.0, 0.55, h)) : mix(hor, bot, smoothstep(0.0, 0.2, -h)); gl_FragColor = vec4(c, 1.0);\n#include <colorspace_fragment>\n}' });
    const s = new T3.Mesh(new T3.SphereGeometry(1500, 32, 16), m); s.renderOrder = -10; s.frustumCulled = false; return s;
  });
  return d;
}
// studGround(key, col, n): an n×n grid of 6×6 plates (merged once), centred on its origin. 6 studs each, so n=12 → 72 studs.
function studGround(key, col, n = 12) {
  return keep('ground:' + key, () => { const l = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) l.push(['3958', col, (i - n / 2 + .5) * 6, 0, (j - n / 2 + .5) * 6, 0]); return build(l); });
}
// flatGround(key, col, size): a big matte floor for the far distance (no studs, cheap)
function flatGround(key, col, size = 3000) {
  return keep('flat:' + key, () => { const g = new T3.Group(), m = new T3.Mesh(new T3.PlaneGeometry(size, size), matte(col)); m.rotation.x = -Math.PI / 2; m.position.y = -.42; m.receiveShadow = true; g.add(m); return g; });
}
// tree(key, col): a brick tree (brown round-brick trunk, leafy plant parts)
function tree(key, col = COL.green) {
  return keep('tree:' + key, () => build([['3062b', COL.brown, 0, 1.2, 0], ['3062b', COL.brown, 0, 2.4, 0], ['3062b', COL.brown, 0, 3.6, 0], ['2423', col, 0, 3.8, 0, 0], ['2423', col, 0, 4.4, 0, 1.6], ['2423', COL.dkgreen, 0, 5.0, 0, .8]]));
}
// passerby(key, i, t, path): a background minifig walking a closed loop of [x,z] points at walking pace (pure function of t)
function passerby(key, i, t, path, speed = 1.6) {
  const f = fig('pass:' + key + i, crowdLook(i + 3)), segs = [];
  let tot = 0; for (let k = 0; k < path.length; k++) { const a = path[k], b = path[(k + 1) % path.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); segs.push([a, b, l]); tot += l; }
  let d = frac((st(t) * speed + hash(i) * tot) / tot) * tot, sg = segs[0];
  for (const s of segs) { sg = s; if (d <= s[2]) break; d -= s[2]; }
  const [a, b, l] = sg, k = d / l, x = lerp(a[0], b[0], k), z = lerp(a[1], b[1], k);
  pose(f, { ...walkPose(st(t) * speed / 1.4 + hash(i)), face: i % 2 ? 'joy' : 'neutral' });
  return put(f, x, 0, z, Math.atan2(b[0] - a[0], b[1] - a[1]));
}

Object.assign(window, { clawdFaceTex, heldPencil, heldHandset, skyDome, studGround, flatGround, tree, passerby, COL, st, FACES, fig, pose, walkPose, runPose, PIP, crowdLook, clawd, clawdPose, pencil, handset, pill, cage, gravestone,
  doorUnit, doorPose, scroll, PAPER, paperBird, birdPose, buildSite, field, robot, robotPose, faceTexture });
