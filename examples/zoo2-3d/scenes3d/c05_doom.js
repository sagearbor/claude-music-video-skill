// c05_doom.js: verse 2, Extinction, 96.38–117.40 s, district 'doom' (red/orange office). One continuous camera path.
//   96.38  F2 flight lands (stage → doom)
//   97.6   "Extinction, you a hack": reaper Clawd types the ending at the typewriter
//   99.1   "...and then everybody died. Done.": the page rolls up; Pip walks in, reads it
//  100.4   Pip red-pens it (strike-through scribble)
//  101.65  pull back wide: THE SMOKE GAG (left) — a robot's cotton-wool trail swirls into "AI TAKEOVER" (~103.7),
//          a doofus backs into it (105.55) and it scatters; meanwhile the red bridge (right) melts into paperclips (104.6–106.5)
//  106.84  "Dinosaurs got an asteroid": a brick dinosaur ducks behind a rock, the asteroid hits (108.3)
//  109.95  "Literally sand that we taught how to talk": Pip holds up a chip to Clawd, Clawd sheepish
//  112.5   "Ice age tried it, plague tried it": Pip walks into falling snow past a plague doctor, shrugs
//  115.29  "you a bad first draft": Pip balls up the page and tosses it into the bin; F3 flight out from 116.60
// Eggs: EGGS.paperclipFactory (next to the melting bridge), EGGS.chromeBot (patrolling behind the dinosaur).
(() => {
  const A = (x, y, z) => WORLD.at('doom', x, y, z);
  const SMOKE0 = 101.20;                     // the smoke gag clock
  const BIN = [6, 0, 4], DESK = [0, 0, 0];

  // ---------- local props ----------
  function paperTex(stage) {   // stage 0 clean, 1 first stroke, 2 the X, 3 the X + scribble + "NAH."
    const c = document.createElement('canvas'); c.width = 512; c.height = 680; const g = c.getContext('2d');
    g.fillStyle = '#F6EED8'; g.fillRect(0, 0, 512, 680); g.fillStyle = '#2a2420'; g.font = '44px "Courier New", monospace';
    ['CHAPTER ONE', '', 'The humans', 'were doing', 'fine. And', 'then', 'EVERYBODY', 'DIED.', '', 'THE END.'].forEach((l, i) => g.fillText(l, 40, 70 + i * 58));
    g.strokeStyle = '#d0202a'; g.lineCap = 'round'; g.lineWidth = 16;
    if (stage >= 1) { g.beginPath(); g.moveTo(30, 380); g.lineTo(470, 520); g.stroke(); }
    if (stage >= 2) { g.beginPath(); g.moveTo(40, 520); g.lineTo(460, 370); g.stroke(); }
    if (stage >= 3) { g.lineWidth = 10; g.beginPath(); for (let k = 0; k < 7; k++) g.lineTo(60 + k * 60, 600 + (k % 2 ? -26 : 26)); g.stroke();
      g.fillStyle = '#d0202a'; g.font = 'bold 54px "Permanent Marker", cursive'; g.fillText('NAH.', 330, 655); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  // ONE page object for the whole chapter; the ink appears in stages on its texture (no object swap)
  const PAGE_W = 1.3, PAGE_H = 1.7;
  const page = () => keep('c05page', () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(PAGE_W, PAGE_H), new THREE.MeshStandardMaterial({ map: paperTex(0), roughness: .9, side: THREE.DoubleSide }));
    m.position.y = PAGE_H / 2; m.castShadow = true; g.add(m); g.userData = { m, tex: [0, 1, 2, 3].map(paperTex) }; return g; });
  const desk = () => keep('c05desk', () => { const l = [];
    for (const [x, z] of [[-2.5, -1], [2.5, -1], [-2.5, 1], [2.5, 1]]) for (let r = 1; r <= 2; r++) l.push(['3005', COL.brown, x, r * 1.2, z]);
    for (let x = -2; x <= 2; x += 2) l.push(['3020', COL.brown, x, 2.8, 0, Math.PI / 2]);
    l.push(['3003', COL.dkgrey, -1, 4.0, -1], ['3003', COL.dkgrey, 1, 4.0, -1], ['3020', COL.black, 0, 4.4, -.8, 0]);   // the typewriter, on the back half (the front strip is for writing)
    for (let i = 0; i < 6; i++) l.push(['98138', COL.black, -2.0 + i * .8, 4.45, .2]);
    return build(l); });
  // the red pen, point DOWN for writing (a tip marker for the contact check); `pen.userData.body` is the pen itself
  const redPen = () => keep('c05redpen', () => { const g = new THREE.Group(), p = new THREE.Group();
    const b = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, 1.6, 8), plastic(COL.red)); b.position.y = .8; p.add(b);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(.11, .3, 8), plastic('#d0202a')); tip.position.y = 1.75; p.add(tip);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, .3, 8), plastic(COL.white)); cap.position.y = .1; p.add(cap);
    const mark = new THREE.Object3D(); mark.position.y = 1.9; p.add(mark);
    p.rotation.x = Math.PI; p.position.y = .7; g.add(p); g.traverse(o => { if (o.isMesh) o.castShadow = true; }); g.userData = { mark }; return g; });
  const chip = () => keep('c05chip', () => { const g = new THREE.Group(), c = part('3068b', COL.dkgrey); g.add(c);
    const d = new THREE.Mesh(new THREE.BoxGeometry(.9, .05, .9), glowMat('#3ac8ff', 1.2)); d.position.set(0, .06, 0); g.add(d); return g; });
  const bin = () => keep('c05bin', () => { const g = new THREE.Group(), c = new THREE.Mesh(new THREE.CylinderGeometry(1.1, .9, 2.6, 24, 1, true), plastic(COL.dkgrey, { side: THREE.DoubleSide }));
    c.position.y = 1.3; c.castShadow = c.receiveShadow = true; g.add(c); const b = new THREE.Mesh(new THREE.CircleGeometry(.9, 20), plastic(COL.black)); b.rotation.x = -Math.PI / 2; b.position.y = .05; g.add(b); return g; });
  const crate = () => keep('c05crate', () => build([['3001', COL.black, -1, 1.2, -.5, 0], ['3001', COL.black, 1, 1.2, -.5, 0], ['3001', COL.black, -1, 1.2, .5, 0], ['3001', COL.black, 1, 1.2, .5, 0]]));
  const ball = () => keep('c05ball', () => { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(.45, 1), matte('#F6EED8')); m.castShadow = true; const g = new THREE.Group(); g.add(m); return g; });

  // ---------- the bridge that melts into paperclips ----------
  const BRIDGE = [16, -18];
  const bridge = () => keep('c05bridge', () => {
    const g = new THREE.Group(), items = [];
    for (const tx of [-7, 7]) for (let r = 1; r <= 10; r++) for (const dx of [-.5, .5]) items.push(['3005', '#c0392b', tx + dx, r * 1.2, 0, r * 2 + tx + dx]);
    for (let x = -11; x <= 11; x += 4) items.push(['3010', '#c0392b', x, 6.4, 0, 20 + x]);
    for (let k = -10; k <= 10; k++) items.push(['3024', '#a02a20', k, 8 + 4 * (Math.abs(k) / 10) ** 2, 0, 40 + k]);   // the suspension cable
    g.userData.ms = items.map(([id, col, x, y, z, seed]) => { const m = part(id, col); m.userData = { x, y, z, seed }; g.add(m); return m; });
    return g;
  });
  function bridgePose(g, m) {
    for (const b of g.userData.ms) { const { x, y, z, seed } = b.userData, h = hash(seed), k = clamp(m * 1.4 - h * .4);   // each brick melts at its own time
      const sag = ease(k), drop = Math.max(0, k - .55) / .45;
      b.position.set(x + (hash(seed + 3) - .5) * 2 * sag, Math.max(.2, y - sag * y * .35 - drop * drop * y), z + (hash(seed + 5) - .5) * 1.5 * sag);
      b.rotation.set(sag * (hash(seed + 7) - .5) * 1.4, 0, sag * (hash(seed + 9) - .5) * 1.4); b.scale.setScalar(Math.max(.001, 1 - Math.max(0, drop - .6) * 2.5)); }
  }
  const clipHeap = () => keep('c05clips', () => { const im = new THREE.InstancedMesh(paperclipGeo(1.1), plastic(COL.silver, { metalness: .9, roughness: .25 }), 240); im.castShadow = true;
    const M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    for (let i = 0; i < 240; i++) { const x = (hash(i * 3) - .5) * 22, r = Math.abs(x) / 11, h = (1 - r * r) * 2.4 * hash(i + 11) + .1;
      M.compose(new THREE.Vector3(x, h, (hash(i + 7) - .5) * 4), q.setFromEuler(e.set(Math.PI / 2 + (hash(i + 1) - .5), hash(i + 2) * 6, hash(i + 4) - .5)), new THREE.Vector3(1, 1, 1)); im.setMatrixAt(i, M); }
    const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; });

  // ---------- the smoke gag: "AI TAKEOVER" written in cotton-wool puffs ----------
  const WORDS = { x0: -29, x1: -5, y0: 1.0, y1: 4.6, z: -16 };
  let PTS = null;
  function smokePts() {
    if (PTS) return PTS;
    const c = document.createElement('canvas'); c.width = 900; c.height = 150; const g = c.getContext('2d');
    g.fillStyle = '#000'; g.font = 'bold 128px "Arial Black", Impact, sans-serif'; g.textBaseline = 'middle'; g.fillText('AI TAKEOVER', 6, 78);
    const d = g.getImageData(0, 0, 900, 150).data, pts = [];
    for (let y = 2; y < 150; y += 9) for (let x = 2; x < 900; x += 9) if (d[(y * 900 + x) * 4 + 3] > 128) pts.push([x / 900, y / 150]);
    pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);   // left → right, the robot "writes" in its direction of travel
    return (PTS = pts);
  }
  const puffs = n => keep('c05puffs', () => { const im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.34, 1), matte('#fbfbf6', { roughness: 1 }), n); im.castShadow = true; im.frustumCulled = false;
    const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; });
  const robotAt = u => [lerp(WORDS.x0 - 6, WORDS.x1 + 4, u) + 1.2 * Math.sin(u * 19), 3.0 + 1.6 * Math.sin(u * 13), WORDS.z + 1.6 * Math.cos(u * 11)];
  const TW = 1.7, SETTLE = 1.8, HOLD = 3.45, GONE = 4.6;   // seconds after SMOKE0: write, settle into letters, the bump, all gone
  function smoke(t) {
    const lt = t - SMOKE0; if (lt < 0 || lt > GONE + .2) return;
    const pts = smokePts(), N = pts.length, r = puffs(N), im = r.userData.im, M = new THREE.Matrix4(), q = new THREE.Quaternion(), bump = SMOKE0 + HOLD;
    let n = 0;
    for (let i = 0; i < N; i++) {
      const [u, v] = pts[i], te = SMOKE0 + (i / N) * TW; if (t < te) continue;
      const age = t - te, b = robotAt(i / N), tgt = [lerp(WORDS.x0, WORDS.x1, u), lerp(WORDS.y1, WORDS.y0, v), WORDS.z];
      // 1. drift + swirl in the wake; 2. ease onto the letter; 3. after the bump, blow apart in a swirling noise field
      const sw = [b[0] + .8 * Math.sin(age * 3 + i), b[1] + .5 * Math.cos(age * 2.5 + i * .7) + age * .3, b[2] + .7 * Math.sin(age * 2 + i * 1.3)];
      const k = ease(seg(t, SMOKE0 + SETTLE - .2 + hash(i) * .5, SMOKE0 + SETTLE + .6 + hash(i) * .5));
      let p = [lerp(sw[0], tgt[0], k), lerp(sw[1], tgt[1], k), lerp(sw[2], tgt[2], k)], s = .55 + .5 * Math.min(1, age * 3) + .15 * hash(i + 9);
      if (t > bump) { const dist = Math.hypot(tgt[0] - (WORDS.x1 - 2), tgt[1] - 2.5), kk = Math.max(0, t - bump - dist * .035);   // the shock spreads from the bump point
        const a = hash(i + 21) * 6.283 + kk * 2.2, rr = kk * (2 + 2.5 * hash(i + 22));
        p = [p[0] + Math.cos(a) * rr - kk * 1.5, p[1] + kk * (1.2 + 1.5 * hash(i + 23)) + Math.sin(kk * 4 + i) * .4, p[2] + Math.sin(a) * rr * .6]; s *= Math.max(.02, 1 - kk / 1.0); }
      M.compose(new THREE.Vector3(...A(...p)), q, new THREE.Vector3(s, s * .85, s)); im.setMatrixAt(n++, M);
    }
    im.count = n; im.instanceMatrix.needsUpdate = true; put(r);
  }
  // the smoke robot: flies in from far left (parked off-screen before), writes, flies off right and parks off-screen
  const PARK0 = [-90, 16, -30], PARK1 = [80, 22, -50];
  function smokeBot(t) {
    const rb = keep('c05smokebot', robot), w0 = SMOKE0, w1 = SMOKE0 + TW; let p, ry;
    if (t < w0) { const k = ease(seg(t, w0 - 1.2, w0)), a = robotAt(0); p = [lerp(PARK0[0], a[0], k), lerp(PARK0[1], a[1], k), lerp(PARK0[2], a[2], k)]; ry = Math.PI / 2; }
    else if (t < w1) { const u = (t - w0) / TW; p = robotAt(u); ry = Math.PI / 2 + .3 * Math.sin(u * 19); }
    else { const k = easeIn(seg(t, w1, w1 + 1.4)), a = robotAt(1); p = [lerp(a[0], PARK1[0], k), lerp(a[1], PARK1[1], k), lerp(a[2], PARK1[2], k)]; ry = Math.PI / 2; }
    robotPose(rb, { walk: t * 4, carry: false }); put(rb, ...A(p[0], p[1] - 1.6, p[2]), ry, .7);
  }
  // the doofus: strolls in on his phone from off-screen right, turns, backs into the words, drops the phone, wanders off left
  const DZ = WORDS.z + 1.2, BUMP = SMOKE0 + HOLD, DOOF_END = WORDS.x1 - 1.5;
  const DPHONE_GROUND = [DOOF_END + 1.2, .25, DZ + 1.0];
  function doofusPose(t) {   // returns { x, z, ry, pose } (pure in t)
    if (t < BUMP - 1.45) { const s = stepTo(t, [[98.0, [70, DZ]], [BUMP - 1.6, [WORDS.x1 + 8, DZ]]]); const turn = ease(seg(t, BUMP - 1.6, BUMP - 1.45));
      return { x: s.x, z: s.z, ry: lerp(-Math.PI / 2, Math.PI / 2, turn), pose: { ...s.pose, armR: 1.5, face: 'joy', head: .4 } }; }
    if (t < BUMP) { const k = ease(seg(t, BUMP - 1.45, BUMP)), x = lerp(WORDS.x1 + 8, DOOF_END, k);
      return { x, z: DZ, ry: Math.PI / 2, pose: { ...walk(-(x - (WORDS.x1 + 8)) / STRIDE), armR: 1.5, face: 'joy', head: .4 } }; }
    const u = t - BUMP, hitP = { face: 'shocked', armL: 1.6, armR: 1.3, armLz: .6, armRz: .6, lean: -.15 + .15 * Math.sin(u * 9) * Math.exp(-u * 2), head: .6 * Math.sin(u * 3) };
    const from = { ...walk(-(DOOF_END - (WORDS.x1 + 8)) / STRIDE), armR: 1.5, face: 'joy', head: .4 };
    if (u < 1.0) return { x: DOOF_END, z: DZ, ry: lerp(Math.PI / 2, .4, ease(seg(u, 0, .3))), pose: blend(from, hitP, ease(seg(u, 0, .18))) };
    const s = stepTo(t, [[BUMP + 1.0, [DOOF_END, DZ]], [BUMP + 9.0, [-75, DZ - 4]]]);
    return { x: s.x, z: s.z, ry: s.ry, pose: blend(hitP, { ...s.pose, face: 'suspicious' }, ease(seg(u, 1.0, 1.3))) };
  }
  function doofus(t) {
    const df = fig('c05doofus', crowdLook(11)), d = doofusPose(t), phone = heldHandset('c05doofus');
    if (t < BUMP) { phone.position.set(0, 0, 0); phone.rotation.set(0, 0, 0); phone.scale.setScalar(1); }
    pose(df, { ...d.pose, holdR: t < BUMP ? phone : null }); put(df, ...A(d.x, 0, d.z), d.ry);
    if (t >= BUMP) {   // the phone falls from his hand at the bump and stays on the ground
      const h0 = measure(fig('c05probeD', crowdLook(11)), { ...doofusPose(BUMP - .001).pose }, [DOOF_END, DZ], Math.PI / 2, 'handR'), g = A(...DPHONE_GROUND);
      const k = seg(t, BUMP, BUMP + .4), p = [lerp(h0[0], g[0], k), lerp(h0[1], g[1], easeIn(k)), lerp(h0[2], g[2], k)];
      put(phone, ...p, k * 2); phone.rotation.set(k * 1.4, k * 2, 0);
    }
    // contact: his back reaches the letters
    if (t > BUMP - .05 && t < BUMP + .05) { const pts = smokePts(); let best = 1e9, bp = null; const me = A(d.x - .6, 2.5, d.z);
      for (const [u, v] of pts) { const q = A(lerp(WORDS.x0, WORDS.x1, u), lerp(WORDS.y1, WORDS.y0, v), WORDS.z), dd = Math.hypot(q[0] - me[0], q[1] - me[1], q[2] - me[2]); if (dd < best) { best = dd; bp = q; } }
      expect('doofus backs into the smoke words', me, bp, 1.6); }
  }
  // a probe figure (never put in the world) for measuring where a pose puts a hand
  function measure(f, p, xz, ry, name) { pose(f, p); f.position.set(...A(xz[0], 0, xz[1])); f.rotation.set(0, ry, 0); f.scale.setScalar(1); f.updateWorldMatrix(true, true); return limb(f, name); }

  // ---------- the dinosaur, the rock and the asteroid ----------
  const DINO = [-24, 6], HIT = 108.30;
  const dino = () => keep('c05dino', () => { const g = new THREE.Group(), c = COL.green, body = new THREE.Group(); g.add(body);
    body.add(build([['3001', c, 0, 3.6, 0, Math.PI / 2], ['3001', c, 0, 4.8, 0, Math.PI / 2], ['3001', c, 0, 2.4, 0, Math.PI / 2], ['3003', c, 0, 6.0, 2.5], ['3003', c, 0, 7.2, 3.2], ['3004', c, 0, 7.2, 4.6, Math.PI / 2],
      ['3004', c, 0, 3.6, -3.5, Math.PI / 2], ['3005', c, 0, 3.0, -5.0], ['3024', COL.white, -.6, 7.6, 5.2], ['3024', COL.white, .6, 7.6, 5.2]]));
    for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.2, 10, 8), plastic(COL.black)); e.position.set(s * .9, 7.6, 3.9); body.add(e); }
    g.userData.legs = [-1, 1].map(s => { const l = new THREE.Group(); l.position.set(s * .9, 1.4, 0); l.add(build([['3005', c, 0, 0, 0], ['3005', c, 0, -1.2, .3]])); g.add(l); return l; });
    g.userData.body = body; return g; });
  const rock = () => keep('c05rock', () => build([['3001', COL.dkgrey, -1, 1.2, 0], ['3001', COL.dkgrey, 1, 1.2, 0, .3], ['3003', COL.grey, 0, 2.4, 0], ['3003', COL.dkgrey, 1.5, 2.4, .4], ['3005', COL.grey, 0, 3.6, 0]]));
  const asteroid = () => keep('c05ast', () => { const g = new THREE.Group(), inner = new THREE.Group(); g.add(inner);
    const m = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), plastic('#5a4a4a', { roughness: .8 })); m.castShadow = true; inner.add(m);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(1.4, 9, 16, 1, true), glowMat('#ff8a3a', 2.4)); tail.rotation.x = Math.PI / 2; tail.position.z = -5.4; inner.add(tail);
    inner.add(new THREE.PointLight('#ff9a4a', 30, 30)); g.userData.inner = inner; return g; });
  const dust = () => keep('c05dust', () => { const im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.6, 1), matte('#c8b8a8'), 40); im.frustumCulled = false; const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; });

  // ---------- the ice age patch + plague doctor ----------
  const ICE = [14, 7];
  const snowfield = () => keep('c05snow', () => { const l = []; for (let x = -6; x <= 6; x += 6) for (let z = -4; z <= 4; z += 6) l.push(['3958', COL.white, ICE[0] + x, .03, ICE[1] + z]);
    l.push(['3003', COL.ltblue, ICE[0] + 5, 1.2, ICE[1] - 4], ['3005', COL.ltblue, ICE[0] + 5, 2.4, ICE[1] - 4]); return build(l); });
  const flakes = () => keep('c05flakes', () => { const im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.13, 0), matte('#ffffff'), 180); im.frustumCulled = false; const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; });
  function snow(t) { const r = flakes(), im = r.userData.im, M = new THREE.Matrix4(), q = new THREE.Quaternion();
    const live = Math.floor(180 * seg(t, 111.6, 112.8)); im.count = live; for (let i = 0; i < live; i++) { const y = 12 - ((t * (1.4 + hash(i)) + hash(i + 1) * 12) % 12);
      M.compose(new THREE.Vector3(...A(ICE[0] + (hash(i + 2) - .5) * 16 + Math.sin(t + i) * .4, y, ICE[1] + (hash(i + 3) - .5) * 12)), q, new THREE.Vector3(1, 1, 1)); im.setMatrixAt(i, M); }
    im.instanceMatrix.needsUpdate = true; put(r); }
  function plagueDoc(t) {
    const f = fig('c05pdoc', { torso: COL.black, legs: COL.black, arms: COL.black, hands: COL.black, hat: null, head: '3626cp80' });
    if (!f.userData.beak) { const J = f.userData.J, b = new THREE.Mesh(new THREE.ConeGeometry(.32, 1.6, 12), plastic('#e8dcc0')); b.rotation.x = Math.PI / 2; b.position.set(0, -.75, 1.25); J.head.add(b);
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, .12, 24), plastic(COL.black)); brim.position.y = .25; J.head.add(brim);
      const top = new THREE.Mesh(new THREE.CylinderGeometry(.7, .75, 1.1, 24), plastic(COL.black)); top.position.y = .8; J.head.add(top); f.userData.beak = b; }
    pose(f, { face: 'determined', head: .3 * Math.sin(t * .9), armR: .6 + .2 * Math.sin(t * 2) }); put(f, ...A(ICE[0] + 5, 0, ICE[1] + 2), -.9);
  }

  // ---------- the district ----------
  district('doom', { at: WORLD.D.doom, r: 70 }, t => {
    put(studGround('doom', '#6a2a2a', 10), ...A(0, 0, -8));
    put(desk(), ...A(...DESK));
    put(bin(), ...A(...BIN));
    put(snowfield(), ...A(0, 0, 0)); if (t > 111.6) snow(t); plagueDoc(t);
    put(rock(), ...A(DINO[0] + 4, 0, DINO[1] + .5));
    const b = bridge(); bridgePose(b, seg(t, 104.9, 106.7)); put(b, ...A(BRIDGE[0], 0, BRIDGE[1]));
    const h = clipHeap(); h.userData.im.count = Math.floor(240 * ease(seg(t, 105.2, 106.8))); put(h, ...A(BRIDGE[0], 0, BRIDGE[1] + 1.5));
    const pf = A(BRIDGE[0] + 16, 0, BRIDGE[1] - 6); EGGS.paperclipFactory('c05', t, pf[0], pf[2], -.5);
    const cb = A(DINO[0] - 8, 0, DINO[1] - 12); EGGS.chromeBot('c05', t, cb[0], cb[2], .4);
    // background life: the robots keep raising a grim tower; people hurry past
    const tw = A(-6, 0, -42); buildSite('c05tower', { at: [tw[0], tw[2]], w: 8, d: 6, floors: 22, col: '#4a3a3a', t0: 0, t1: 250, robots: 3 }, t);
    const wa = A(-40, 0, -30), wb = A(40, 0, -30); for (let i = 0; i < 3; i++) passerby('c05', i, t, [[wa[0], wa[2]], [wb[0], wb[2]]], 1.6);
    smoke(t); smokeBot(t); doofus(t);
    // the dinosaur trots in, ducks behind the rock before the hit, then peeks out
    const d = dino(), duck = ease(seg(t, 107.4, 107.9)) * (1 - ease(seg(t, 109.0, 109.6))), peek = ease(seg(t, 109.0, 109.6));
    d.userData.body.position.y = -2.2 * duck; d.userData.body.rotation.set(.35 * duck, 0, 0); d.userData.legs.forEach((l, i) => { l.rotation.x = t > 106.8 && t < 107.4 ? .4 * Math.sin(t * 14 + i * 3) : 0; });
    put(d, ...A(DINO[0] + (t < 107.4 ? lerp(-3, 0, ease(seg(t, 106.8, 107.4))) : 0), 0, DINO[1]), Math.PI / 2 - .4 * peek);
    { const k = seg(t, 106.84, HIT), p0 = A(DINO[0] + 2, 20, DINO[1] - 55), p1 = A(DINO[0] - 6, 1, DINO[1] - 5), a = asteroid();   // high in the sky before (off-screen), embedded after
      if (t < HIT) { put(a, lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], easeIn(k)), lerp(p0[2], p1[2], k)); a.lookAt(new THREE.Vector3(...p1)); }
      else { put(a, p1[0], p1[1] - .9, p1[2]); a.lookAt(new THREE.Vector3(p1[0], p1[1] - 3, p1[2] + 1)); }
      a.userData.inner.rotation.set(0, 0, t < HIT ? t * 2 : HIT * 2); a.userData.inner.children[1].visible = t < HIT; a.userData.inner.children[2].intensity = t < HIT ? 30 : 30 * Math.exp(-(t - HIT) * 2); }
    if (t > HIT && t < HIT + 2.2) { const du = dust(), im = du.userData.im, M = new THREE.Matrix4(), q = new THREE.Quaternion(), u = t - HIT;
      for (let i = 0; i < 40; i++) { const a = hash(i) * 6.28, r = (3 + 6 * hash(i + 1)) * easeOut(u / 1.2), s = (1.2 + hash(i + 2)) * Math.max(.02, 1 - u / 2.2);
        M.compose(new THREE.Vector3(...A(DINO[0] - 6 + Math.cos(a) * r, 1 + u * 2 * hash(i + 3), DINO[1] - 5 + Math.sin(a) * r)), q, new THREE.Vector3(s, s, s)); im.setMatrixAt(i, M); }
      im.instanceMatrix.needsUpdate = true; put(du); }
  });

  // ---------- Pip, the page, the red pen, the chip, the ball: one continuous plan with measured contacts ----------
  // Stand spots are computed from where the pose actually puts Pip's hand (a probe figure), so every touch lands exactly.
  const PI = Math.PI, DESK_TOP = 2.86, SLOT = [0, 4.5, -.8];                // SLOT: the page's bottom edge in the typewriter
  const P_UP = { armR: 2.3 }, P_DESK = { armR: .9 };
  const rotOff = (o, ry) => [o[0] * Math.cos(ry) + o[2] * Math.sin(ry), o[1], -o[0] * Math.sin(ry) + o[2] * Math.cos(ry)];
  const G = (() => { let g = null; return () => g || (g = (() => {
    const pf = fig('c05probeP', PIP), off = (pz, name = 'handR') => { const h = measure(pf, pz, [0, 0], 0, name), o = A(0, 0, 0); return [h[0] - o[0], h[1], h[2] - o[2]]; };
    const pen = redPen(), tipOff = a => { pose(pf, { armR: a, holdR: pen }); const o = A(0, 0, 0); pf.position.set(...o); pf.rotation.set(0, 0, 0); pf.updateWorldMatrix(true, true);
      const w = pen.userData.mark.getWorldPosition(new THREE.Vector3()); pose(pf, {}); return [w.x - o[0], w.y, w.z - o[2]]; };
    // the writing arm angle that puts the pen tip on the desk-top page
    let WA = 1.4, best = 9; for (let a = .9; a <= 1.9; a += .02) { const d = Math.abs(tipOff(a)[1] - (DESK_TOP + .02)); if (d < best) { best = d; WA = a; } }
    const up = rotOff(off(P_UP), -PI / 2), desk = rotOff(off(P_DESK), PI), tip = rotOff(tipOff(WA), PI);
    const PAGE = [1.19, DESK_TOP, 1.95], S_l = [PAGE[0] - desk[0], PAGE[2] - desk[2]];   // the ejected page lies on the front strip (bottom edge here)
    const S_g = S_l;
    const PAGE_C = [PAGE[0], DESK_TOP, PAGE[2] - PAGE_H * .62];          // where to write: the struck lines, ~62% down the page
    const S_w = [PAGE_C[0] - tip[0], PAGE_C[2] - tip[2]];
    const S_p = [1.75, 3.1], PEN = [S_p[0] + desk[0], DESK_TOP + .11, S_p[1] + desk[2]];
    const S_c = [-1.3, 3.1], CHIP = [S_c[0] + desk[0], DESK_TOP + .02, S_c[1] + desk[2]];
    return { WA, S_g, S_l, PAGE, PAGE_C, S_w, S_p, PEN, S_c, CHIP, up, desk };
  })()); })();
  const S_rest = [2.8, 4.4], ICE_S = [ICE[0] - 2, ICE[1]], RYB = Math.atan2(BIN[0] - ICE_S[0], BIN[1] - ICE_S[1]);
  // pose track: blend between timed pose keys (each a pose object or a function of t) so no joint ever snaps
  function track(t, keys) { let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
    const P0 = typeof keys[i][1] === 'function' ? keys[i][1](t) : keys[i][1]; if (i + 1 >= keys.length) return P0;
    const [t1, k1, dur = .22] = keys[i + 1], P1 = typeof k1 === 'function' ? k1(t) : k1, k = ease(seg(t, t1 - dur, t1)); return k > 0 ? blend(P0, P1, k) : P0; }
  const scrib = t => t > 100.45 && t < 101.4 ? Math.sin(t * 34) : 0;
  function pipChapter(t) {
    const g = G(), P = fig('pip', PIP);
    // where Pip stands (stepTo: the walk phase follows the distance, no foot sliding)
    const plan = [[97.0, [15, 3.6]], [99.6, g.S_p], [99.85, g.S_p], [100.15, g.S_w], [101.45, g.S_w], [101.65, g.S_p],
      [101.85, g.S_p], [102.3, S_rest], [109.4, S_rest], [110.1, g.S_c], [111.9, g.S_c], [112.1, g.S_l], [112.3, g.S_l], [113.0, [5, 6.2]], [113.7, ICE_S]];
    const st = stepTo(t, plan);
    // facing: by segment (smooth turns, .25 s)
    const H1 = Math.atan2(5 - g.S_l[0], 6.2 - g.S_l[1]), H2 = Math.atan2(ICE_S[0] - 5, ICE_S[1] - 6.2);
    const RY = [[97.0, -PI / 2], [99.45, -PI / 2], [99.7, -PI], [101.85, -PI], [102.3, -.5], [109.4, -.5], [109.6, -PI / 2], [109.95, -PI / 2], [110.1, -PI], [110.25, -PI], [110.5, -PI / 2 + .25],
      [111.6, -PI / 2 + .25], [111.8, -PI], [112.3, -PI], [112.5, H1], [113.0, H1], [113.2, H2], [113.7, H2], [113.95, -.3], [115.45, -.3], [115.65, RYB]];
    const wrap = (a, ref) => a + 2 * PI * Math.round((ref - a) / (2 * PI));   // shortest turn
    let ry = RY[0][1]; for (let i = 1; i < RY.length; i++) { const b0 = ry, b1 = wrap(RY[i][1], b0); if (t >= RY[i - 1][0]) ry = lerp(b0, b1, ease(seg(t, RY[i - 1][0], RY[i][0]))); else break; ry = t >= RY[i][0] ? b1 : ry; }
    const walking = st.pose.legL != null, gait = walking ? st.pose : {};
    const arm = track(t, [[97.0, () => ({ face: 'suspicious' })], [99.85, { ...P_DESK, face: 'determined' }, .3],
      [100.3, () => ({ armR: g.WA + .03 * scrib(t), armRz: .18 * scrib(t), face: 'determined', head: -.25 }), .3], [101.7, { ...P_DESK, face: 'smug' }, .2], [102.3, () => ({ ...dance('sway', t), armL: .4, face: 'smug' }), .4],
      [110.2, { ...P_DESK, face: 'smug' }, .3], [110.6, () => ({ armR: 1.2 + .1 * Math.sin(t * 5), head: -.2, face: 'smug' }), .3], [111.85, { ...P_DESK, face: 'smug' }, .3],
      [112.15, { ...P_DESK, face: 'neutral' }], [112.5, { armR: .55, face: 'neutral' }, .3], [113.95, () => ({ ...dance('shrug', t), armR: .55, face: 'smug' }), .3],
      [115.5, { armR: 1.0, armL: 1.0, armLz: -.35, armRz: -.35, face: 'determined' }, .2], [115.72, { armR: 2.6, armL: .3, lean: -.12, face: 'determined' }, .2], [116.05, { armR: 1.0, face: 'joy' }, .3]]);
    const pp = { ...gait, ...Object.fromEntries(Object.entries(arm).filter(([k]) => !(walking && (k === 'legL' || k === 'legR')))) };
    const pen = redPen(), holdPen = t >= 99.85 && t < 101.7, holdChip = t >= 110.2 && t < 111.85;
    const held = holdPen ? pen : holdChip ? chip() : null; if (held) { held.position.set(0, 0, 0); held.rotation.set(0, 0, 0); held.scale.setScalar(1); }   // a prop that was put() in the world keeps a stale transform
    pose(P, { ...pp, holdR: held }); put(P, ...A(st.x, 0, st.z), ry);
    const hand = limb(P, 'handR');

    // the page: in the typewriter (rolling up) → in Pip's hand → flat on the desk → in hand to the ice patch → crumpled → inside the ball
    const pg = page(), m = pg.userData.m;
    m.material.map = pg.userData.tex[t < 100.6 ? 0 : t < 100.95 ? 1 : t < 101.3 ? 2 : 3];
    let pgPos, pgRot = 0, pgS = 1;
    if (t < 99.0) { pgPos = A(...SLOT); const up = .35 + .65 * ease(seg(t, 97.6, 98.9)); m.scale.y = up; m.position.y = PAGE_H / 2 * up; }
    else { m.scale.y = 1; m.position.y = PAGE_H / 2;
      if (t < 99.5) { const k = ease(seg(t, 99.0, 99.5)), a = A(...SLOT), b = A(...g.PAGE); pgPos = [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 1.2 * Math.sin(PI * k), lerp(a[2], b[2], k)]; pgRot = -PI / 2 * k; }   // the typewriter ejects it
      else if (t < 112.15) { pgPos = A(...g.PAGE); pgRot = -PI / 2; }                                     // on the desk
      else if (t < 115.3) { pgPos = hand; pgRot = -PI / 2 * (1 - ease(seg(t, 112.15, 112.5))); }          // carried upright
      else { pgPos = hand; pgS = Math.max(.02, 1 - ease(seg(t, 115.3, 115.5))); } }                       // crumpled into the ball
    const ballP = ballPos(t, hand);
    if (t >= 115.5) pgPos = ballP;   // the crumpled page IS the ball (kept inside it)
    put(pg, ...pgPos, 0, pgS); pg.rotation.set(pgRot, t >= 112.15 && t < 115.3 ? ry : 0, 0);
    // the red pen: on the desk → in hand → back on the desk
    if (!holdPen) { put(pen, ...A(...g.PEN)); pen.rotation.set(0, 0, PI / 2); }
    // the chip: on the desk → in hand → back on the desk
    if (!holdChip) { const c = chip(); put(c, ...A(...g.CHIP)); }
    // the ball: grows in Pip's hands while the page shrinks, rides the throwing hand, flies into the bin, stays there
    if (t >= 115.3) { const bl = ball(); put(bl, ...ballP, 0, t < 115.5 ? Math.max(.05, ease(seg(t, 115.3, 115.5))) : 1); if (t < 116.45) bl.rotation.set(t * 5, t * 3, 0); }

    // contact checks on the touch frames
    const near = (a, b) => Math.abs(t - a) <= (b ?? .021);
    if (near(99.85)) expect('pip picks up the red pen', hand, A(...g.PEN), .5);
    if (t > 100.45 && t < 101.4) { const tp = pen.userData.mark.getWorldPosition(new THREE.Vector3()).toArray(), c = A(...g.PAGE), rel = [tp[0] - c[0], tp[2] - c[2]];
      const on = A(clamp(rel[0], -PAGE_W / 2, PAGE_W / 2) + g.PAGE[0], DESK_TOP, clamp(rel[1], -PAGE_H, 0) + g.PAGE[2]);   // the page lies from its bottom edge toward -z
      expect('red pen tip on the page', tp, on, .45); }
    if (near(101.7)) expect('pip puts the red pen back', hand, A(...g.PEN), .5);
    if (near(110.2)) expect('pip picks up the chip', hand, A(...g.CHIP), .5);
    if (near(111.85)) expect('pip puts the chip back', hand, A(...g.CHIP), .5);
    if (near(112.15)) expect('pip picks the page up off the desk', hand, A(...g.PAGE), .5);
    if (near(116.46)) expect('the ball lands in the bin', ballP, A(BIN[0], .7, BIN[1]), .8);
  }
  // the ball's path: at the hands while crumpling, in the throwing hand, then an arc into the bin, then resting inside it
  function ballPos(t, hand) {
    if (t < 115.75) return hand;
    const rel = measure(fig('c05probeP', PIP), { armR: 2.6, armL: .3, lean: -.12 }, [ICE[0] - 2, ICE[1]], Math.atan2(BIN[0] - (ICE[0] - 2), BIN[1] - ICE[1]), 'handR');
    const k = seg(t, 115.75, 116.45), b = A(BIN[0], .7, BIN[1]);
    return [lerp(rel[0], b[0], k), lerp(rel[1], b[1], k) + 4 * Math.sin(PI * k), lerp(rel[2], b[2], k)];
  }

  // ---------- the shot: actors + one continuous camera ----------
  const STRIKE = [100.35, 101.5];
  function doom(t, lt) {
    look({ ...WORLD.LOOK.doom });
    // Clawd (reaper) at the typewriter: types on half-beats, flinches at the strike, sheepish at "sand", dizzy at "bad first draft"
    const C = clawd('c05', {}), typing = t < STRIKE[0], hb = Math.floor((t - OFF) / BEAT * 2) % 2;
    let cf = 'smug'; if (t > STRIKE[0]) cf = 'shocked'; if (t > 101.65) cf = 'suspicious'; if (t > 109.95) cf = 'sleepy'; if (t > 115.6) cf = 'dizzy';
    clawdPose(C, { face: cf, hat: 'reaper', armL: typing ? .25 + .25 * hb : .3, armR: typing ? .25 + .25 * (1 - hb) : (t > STRIKE[0] && t < 102 ? .9 : .3),
      bob: typing ? .08 * pulse(t, 7) : 0, lean: t > 109.95 && t < 112.5 ? .12 : 0, roll: t > 115.6 ? .12 * Math.sin(t * 6) : 0 });
    const hood = C.userData.J.hats.reaper.children[0]; hood.position.set(0, 5.4, -1.5); hood.scale.set(1.05, 1.05, .62);   // hood back, face visible
    put(C, ...A(-4.6, 1.2, -1.2), .75); put(crate(), ...A(-4.6, 0, -1.2), .75);
    pipChapter(t);
    // ---------- camera: F2 in, one path, F3 out ----------
    if (t < WORLD.F.F2.t1) { WORLD.apply(WORLD.flight('F2', t)); cam({ blur: .5 }); return; }
    if (t >= WORLD.F.F3.t0) { WORLD.apply(WORLD.flight('F3', t)); cam({ blur: .4 }); return; }
    const F2B = WORLD.F.F2.B, F3A = WORLD.F.F3.A, L = p => A(...p);
    const pos = path(t, [[97.6, F2B.pos], [99.1, L([4.5, 6.2, 10])], [100.7, L([5.4, 7.6, 7.4])], [102.4, L([-4, 11, 30])], [103.6, L([-17, 7.5, 21])], [104.7, L([-15, 7.5, 22])], [105.7, L([8, 10, 28])],
      [106.6, L([12, 8.5, 16])], [107.6, L([-10, 8, 26])], [109.4, L([-12, 6.5, 22])], [110.8, L([3, 6, 13])], [112.4, L([5, 6, 15])], [113.8, L([12, 6.5, 22])], [115.3, L([10, 7, 20])], [116.6, F3A.pos]]);
    const at = path(t, [[97.6, F2B.look], [99.1, L([.4, 4.0, .4])], [100.7, L([1.0, 3.0, 1.0])], [102.4, L([-12, 3, -12])], [103.6, L([-17, 3, -16])], [104.7, L([-14, 3, -16])], [105.7, L([12, 5, -17])],
      [106.6, L([15, 6, -18])], [107.6, L([-22, 4, 3])], [109.4, L([-24, 4, 4])], [110.8, L([1, 4.4, 0])], [112.4, L([4, 4, 2])], [113.8, L([12, 3.5, 7])], [115.3, L([9, 3.5, 5])], [116.6, F3A.look]]);
    const fov = path(t, [[97.6, F2B.fov], [100.7, 30], [102.4, 40], [103.6, 38], [104.7, 38], [105.7, 40], [106.6, 34], [109.4, 34], [112.4, 32], [116.6, F3A.fov]]);
    const dk = .5 * Math.min(seg(t, 97.6, 98.6), 1 - seg(t, 115.6, 116.6)), d = drift(lt, dk), hs = t > HIT ? shake(t, .7 * Math.exp(-(t - HIT) * 5)) : [0, 0, 0];
    let focus = A(1, 4.5, 0); if (t > 101.9 && t < 105.2) focus = A(-14, 3, -16); else if (t >= 105.2 && t < 106.7) focus = A(BRIDGE[0], 5, BRIDGE[1]); else if (t >= 106.7 && t < 109.8) focus = A(DINO[0], 4, DINO[1]); else if (t > 112.3) { const pp = fig('pip', PIP).position; focus = [pp.x, 4, pp.z]; }
    cam({ pos: [pos[0] + d[0] + hs[0], pos[1] + d[1] + hs[1], pos[2] + d[2]], look: [at[0] + hs[0] * .3, at[1] + hs[1] * .3, at[2]], fov, blur: t > 101.9 && t < 106.6 ? .25 : .7, focus });
  }

  shots([[96.38, doom]]);
})();
