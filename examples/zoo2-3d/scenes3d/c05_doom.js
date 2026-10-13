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
  function paperTex(struck) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 680; const g = c.getContext('2d');
    g.fillStyle = '#F6EED8'; g.fillRect(0, 0, 512, 680); g.fillStyle = '#2a2420'; g.font = '44px "Courier New", monospace';
    ['CHAPTER ONE', '', 'The humans', 'were doing', 'fine. And', 'then', 'EVERYBODY', 'DIED.', '', 'THE END.'].forEach((l, i) => g.fillText(l, 40, 70 + i * 58));
    if (struck) { g.strokeStyle = '#d0202a'; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(30, 380); g.lineTo(470, 520); g.moveTo(40, 520); g.lineTo(460, 370); g.stroke();
      g.lineWidth = 10; g.beginPath(); for (let k = 0; k < 7; k++) g.lineTo(60 + k * 60, 600 + (k % 2 ? -26 : 26)); g.stroke();
      g.fillStyle = '#d0202a'; g.font = 'bold 54px "Permanent Marker", cursive'; g.fillText('NAH.', 330, 655); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  const paper = struck => keep('c05paper' + struck, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.9), new THREE.MeshStandardMaterial({ map: paperTex(struck), roughness: .9, side: THREE.DoubleSide }));
    m.position.y = 1.45; m.castShadow = true; g.add(m); g.userData.m = m; return g; });
  const desk = () => keep('c05desk', () => { const l = [];
    for (const [x, z] of [[-2.5, -1], [2.5, -1], [-2.5, 1], [2.5, 1]]) for (let r = 1; r <= 2; r++) l.push(['3005', COL.brown, x, r * 1.2, z]);
    for (let x = -2; x <= 2; x += 2) l.push(['3020', COL.brown, x, 2.8, 0, Math.PI / 2]);
    l.push(['3003', COL.dkgrey, -1, 4.0, 0], ['3003', COL.dkgrey, 1, 4.0, 0], ['3020', COL.black, 0, 4.4, .2, 0]);   // the typewriter
    for (let i = 0; i < 6; i++) l.push(['98138', COL.black, -2.0 + i * .8, 4.45, 1.2]);
    return build(l); });
  const redPen = () => keep('c05redpen', () => { const g = new THREE.Group(), p = new THREE.Group();
    const b = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, 1.6, 8), plastic(COL.red)); b.position.y = .8; p.add(b);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(.11, .3, 8), plastic('#d0202a')); tip.position.y = 1.75; p.add(tip);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, .3, 8), plastic(COL.white)); cap.position.y = .1; p.add(cap);
    p.position.y = -.7; g.add(p); g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g; });
  const chip = () => keep('c05chip', () => { const g = new THREE.Group(), c = part('3068b', COL.dkgrey); c.rotation.x = Math.PI / 2; c.position.set(0, .4, .2); g.add(c);
    const d = new THREE.Mesh(new THREE.BoxGeometry(.9, .9, .05), glowMat('#3ac8ff', 1.2)); d.position.set(0, .4, .33); g.add(d); return g; });
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
    if (lt < TW + .6) { const rb = keep('c05smokebot', robot), u = clamp(lt / TW), p = robotAt(u); robotPose(rb, { walk: t * 4, carry: false });
      put(rb, ...A(p[0], p[1] - 1.6, p[2]), Math.PI / 2 + .3 * Math.sin(u * 19), .7); }
    // the doofus backs into the words (walking backwards, on the phone), bonk, looks around bewildered
    const df = fig('c05doofus', crowdLook(11)), wx = lerp(WORDS.x1 + 8, WORDS.x1 - 1.5, ease(seg(t, SMOKE0 + 2.0, bump))), hit = t > bump, u2 = Math.max(0, t - bump);
    pose(df, hit ? { face: 'shocked', armL: 1.6, armR: 1.3, armLz: .6, armRz: .6, lean: -.15 + .15 * Math.sin(u2 * 9) * Math.exp(-u2 * 2), head: .6 * Math.sin(u2 * 3) }
      : { ...walk(-t * 1.3), armR: 1.5, holdR: heldHandset('c05doofus'), face: 'joy', head: .4 });
    put(df, ...A(wx, 0, WORDS.z + 1.2), hit ? .4 : -Math.PI / 2);
  }

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
    smoke(t);
    // the dinosaur trots in, ducks behind the rock before the hit, then peeks out
    const d = dino(), duck = ease(seg(t, 107.4, 107.9)) * (1 - ease(seg(t, 109.0, 109.6))), peek = ease(seg(t, 109.0, 109.6));
    d.userData.body.position.y = -2.2 * duck; d.userData.body.rotation.set(.35 * duck, 0, 0); d.userData.legs.forEach((l, i) => { l.rotation.x = t > 106.8 && t < 107.4 ? .4 * Math.sin(t * 14 + i * 3) : 0; });
    put(d, ...A(DINO[0] + (t < 107.4 ? lerp(-3, 0, ease(seg(t, 106.8, 107.4))) : 0), 0, DINO[1]), Math.PI / 2 - .4 * peek);
    if (t > 106.6 && t < HIT) { const k = seg(t, 106.84, HIT), p0 = A(DINO[0] + 2, 20, DINO[1] - 55), p1 = A(DINO[0] - 6, 1, DINO[1] - 5), a = asteroid();
      put(a, lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], easeIn(k)), lerp(p0[2], p1[2], k)); a.lookAt(new THREE.Vector3(...p1)); a.userData.inner.rotation.set(0, 0, t * 2); }
    if (t > HIT && t < HIT + 2.2) { const du = dust(), im = du.userData.im, M = new THREE.Matrix4(), q = new THREE.Quaternion(), u = t - HIT;
      for (let i = 0; i < 40; i++) { const a = hash(i) * 6.28, r = (3 + 6 * hash(i + 1)) * easeOut(u / 1.2), s = (1.2 + hash(i + 2)) * Math.max(.02, 1 - u / 2.2);
        M.compose(new THREE.Vector3(...A(DINO[0] - 6 + Math.cos(a) * r, 1 + u * 2 * hash(i + 3), DINO[1] - 5 + Math.sin(a) * r)), q, new THREE.Vector3(s, s, s)); im.setMatrixAt(i, M); }
      im.instanceMatrix.needsUpdate = true; put(du); }
  });

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
    // the page rolls up out of the typewriter as it's typed, is struck through after the red pen, then balled and tossed
    if (t < 115.75) { const up = .35 + .65 * ease(seg(t, 97.6, 100.2)), pg = paper(t > STRIKE[0] + .4); pg.userData.m.scale.y = up; pg.userData.m.position.y = 1.45 * up; put(pg, ...A(0, 4.5, .2), 0); }
    // Pip
    const P = fig('pip', PIP); let pp = { face: 'suspicious' }, px = 2.6, pz = 2.2, pry = -.5;
    if (t < 99.6) { px = lerp(9, 2.6, ease(seg(t, 98.4, 99.6))); if (t > 98.4) { pp = { ...walk(t * 1.2), face: 'suspicious' }; pry = -Math.PI / 2; } }
    else if (t < 101.9) { const sc = t > STRIKE[0] && t < STRIKE[1] ? Math.sin(t * 38) : 0;
      pp = { face: t > STRIKE[1] ? 'smug' : 'determined', armR: t > 100.0 ? 1.15 + .2 * sc : lerp(0, 1.15, seg(t, 99.6, 100.0)), armRz: .25 * sc, head: -.3, holdR: t > 99.8 ? redPen() : null }; pry = -.9; }
    else if (t < 109.95) { pp = { ...dance('sway', t), face: t > 104.6 && t < 107 ? 'shocked' : 'smug', armL: .4 }; pry = -.4; }
    else if (t < 112.3) { const k = ease(seg(t, 110.0, 110.4)); pp = { face: 'smug', armR: 1.2 * k, holdR: chip(), head: -.2, armL: .3 + .3 * Math.sin(t * 5) * k }; pry = -.8; }
    else if (t < 115.3) { const k = ease(seg(t, 112.3, 113.6)); px = lerp(2.6, ICE[0] - 2, k); pz = lerp(2.2, ICE[1], k);
      if (t < 113.6) { pp = { ...walk(t * 1.3), face: 'neutral' }; pry = Math.atan2(ICE[0] - 2 - 2.6, ICE[1] - 2.2); } else { pp = { ...dance('shrug', t), face: 'smug' }; pry = -.2; } }
    else { px = ICE[0] - 2; pz = ICE[1]; pry = -1.1; const th = ease(seg(t, 115.4, 115.75));
      pp = { face: t > 116.3 ? 'joy' : 'determined', armR: lerp(.6, 2.6, th) * (1 - seg(t, 115.75, 116.1) * .6), lean: -.1 * th }; }
    pose(P, pp); put(P, ...A(px, 0, pz), pry);
    // the balled page flies into the bin
    if (t > 115.4 && t < 117.4) { const k = seg(t, 115.75, 116.45), bl = ball();
      const p = t < 115.75 ? [px + .6, 4.2 + seg(t, 115.4, 115.75), pz] : [lerp(px, BIN[0], k), lerp(4.5, 1.4, k) + 5 * Math.sin(Math.PI * k), lerp(pz, BIN[1], k)];
      if (t < 116.5) { put(bl, ...A(...p)); bl.rotation.set(t * 5, t * 3, 0); } }

    // ---------- camera: F2 in, one path, F3 out ----------
    if (t < WORLD.F.F2.t1) { WORLD.apply(WORLD.flight('F2', t)); cam({ blur: .5 }); return; }
    if (t >= WORLD.F.F3.t0) { WORLD.apply(WORLD.flight('F3', t)); cam({ blur: .4 }); return; }
    const F2B = WORLD.F.F2.B, F3A = WORLD.F.F3.A, L = p => A(...p);
    const pos = path(t, [[97.6, F2B.pos], [99.1, L([3, 5.6, 13])], [100.7, L([2.5, 5.2, 9.5])], [102.4, L([-4, 11, 30])], [103.6, L([-17, 7.5, 21])], [104.7, L([-15, 7.5, 22])], [105.7, L([8, 10, 28])],
      [106.6, L([12, 8.5, 16])], [107.6, L([-10, 8, 26])], [109.4, L([-12, 6.5, 22])], [110.8, L([3, 6, 13])], [112.4, L([5, 6, 15])], [113.8, L([12, 6.5, 22])], [115.3, L([10, 7, 20])], [116.6, F3A.pos]]);
    const at = path(t, [[97.6, F2B.look], [99.1, L([0, 4.6, 0])], [100.7, L([.5, 4.6, 0])], [102.4, L([-12, 3, -12])], [103.6, L([-17, 3, -16])], [104.7, L([-14, 3, -16])], [105.7, L([12, 5, -17])],
      [106.6, L([15, 6, -18])], [107.6, L([-22, 4, 3])], [109.4, L([-24, 4, 4])], [110.8, L([1, 4.4, 0])], [112.4, L([4, 4, 2])], [113.8, L([12, 3.5, 7])], [115.3, L([9, 3.5, 5])], [116.6, F3A.look]]);
    const fov = path(t, [[97.6, F2B.fov], [100.7, 30], [102.4, 40], [103.6, 38], [104.7, 38], [105.7, 40], [106.6, 34], [109.4, 34], [112.4, 32], [116.6, F3A.fov]]);
    const dk = .5 * Math.min(seg(t, 97.6, 98.6), 1 - seg(t, 115.6, 116.6)), d = drift(lt, dk), hs = t > HIT ? shake(t, .7 * Math.exp(-(t - HIT) * 5)) : [0, 0, 0];
    let focus = A(1, 4.5, 0); if (t > 101.9 && t < 105.2) focus = A(-14, 3, -16); else if (t >= 105.2 && t < 106.7) focus = A(BRIDGE[0], 5, BRIDGE[1]); else if (t >= 106.7 && t < 109.8) focus = A(DINO[0], 4, DINO[1]); else if (t > 112.3) focus = A(px, 4, pz);
    cam({ pos: [pos[0] + d[0] + hs[0], pos[1] + d[1] + hs[1], pos[2] + d[2]], look: [at[0] + hs[0] * .3, at[1] + hs[1] * .3, at[2]], fov, blur: t > 101.9 && t < 106.6 ? .25 : .7, focus });
  }

  shots([[96.38, doom]]);
})();
