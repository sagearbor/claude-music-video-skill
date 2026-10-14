// c00_intro.js: 0–25.69 s. The Future's call centre (desk district) → the three doors at the stage edge → "ZERO ZERO ZERO".
// One continuous camera path; it reaches WORLD.F.F0.A at 24.30, then the F0 whip carries it into the chorus-1 drop (c02).
//   0.00  iris in on Clawd at the desk, hold music (notes float up), robot operators in their cubicles
//   5.50  "Thank you for calling the Future."  the phone stops ringing, Clawd waves into the headset mic
//   8.30  "Your extinction is important to us." Clawd taps hold; the monitor says PLEASE HOLD
//  11.49  "Please select your ending."  Clawd points off; the camera flies to the doors on the stage edge (Pip is already walking there)
//  14.44  "For the Zoo, press one."  door 1 cracks open (cage + mood lamp); Pip peeks, unimpressed, then SHOVES it shut on bt(26)
//  17.39  "For Extinction, press two."  door 2: red sky + asteroid; Pip jumps, hair-raising; shoves it shut on bt(29)
//  19.55  "For eternal Bliss, press three."  door 3: pink clouds + pillow; Pip sways, sleepy; snaps awake; shoves it shut on bt(33)
//  21.86  "Zero. Zero. ZERO."  a giant keypad pops up; Pip's finger lands on its 0 on bt(34), bt(35), bt(36);
//         Clawd (walked in): suspicious → shocked → dizzy + sparks
//  23.30  "Lemme talk to a human."  Pip thumbs at self; dizzy Clawd staggers off; the keypad and the door numbers retract;
//         the camera pulls back to F0.A (24.30) → the F0 whip
// Contacts are solved, not guessed: standFor()/solveArm() measure the posed figure, and expect() asserts every touch.
(() => {
  const DK = WORLD.D.desk, at = (dx, dy, dz) => WORLD.at('desk', dx, dy, dz);
  const S = () => window.SETS3D || { DOORS: [{ x: -9, col: '#9C7A5C', inside: '#FFD27A' }, { x: -2, col: '#6B3B4A', inside: '#FF7A3A' }, { x: 5, col: '#E7A6C0', inside: '#FFE3EE' }] };
  const DOOR_Y = .8, DOOR_Z = -6, OPENA = .62;                         // doorPose open 0..1 swings the hinge by -open*1.9 rad
  const SLAM = [bt(26), bt(29), bt(33)], OPEN = [14.95, 17.55, 19.75], ZERO = [bt(34), bt(35), bt(36)];
  const CONTACT = SLAM.map(s => s - .05);                              // the frame the hand meets the panel (door still fully open)
  const KEYPAD = [2.0, -.6, 1.0];                                      // x, z, ry of the giant keypad (stage coords)

  // ---------- solving contacts: measure the posed figure, then place it ----------
  // standFor(f, poseObj, ry, y, target, limbName): the [x, z] that puts limbName exactly on target (y is the figure's floor)
  function standFor(f, poseObj, ry, y, target, limbName) {
    pose(f, poseObj); put(f, 0, y, 0, ry); const h = limb(f, limbName); return [target[0] - h[0], target[2] - h[2]];
  }
  // solveArm(f, base, key, lo, hi, ry, y, targetY, limbName, cacheKey): the joint value putting the limb at height targetY
  const ARM_CACHE = new Map();
  function solveArm(f, base, key, lo, hi, ry, y, targetY, limbName, cacheKey) {
    if (ARM_CACHE.has(cacheKey)) return ARM_CACHE.get(cacheKey);
    let best = lo, bd = 1e9;
    for (let a = lo; a <= hi; a += .01) { pose(f, { ...base, [key]: a }); put(f, 0, y, 0, ry); const d = Math.abs(limb(f, limbName)[1] - targetY); if (d < bd) { bd = d; best = a; } }
    ARM_CACHE.set(cacheKey, best); return best;
  }
  const v3 = (o, p) => { o.updateWorldMatrix(true, true); return o.localToWorld(new THREE.Vector3(...p)).toArray(); };

  // ---------- the call centre (shared with c11 through window.C00) ----------
  function desk() {   // a 10-stud desk: brick legs, a 2x10 plate top with tiles (front at +z), a panel at the front
    const l = [];
    for (const x of [-4.5, 4.5]) for (const z of [-.5, .5]) for (let r = 1; r <= 2; r++) l.push(['3005', COL.white, x, r * 1.2, z]);
    l.push(['3832', COL.white, 0, 2.8, 0, 0]);
    for (let x = -4; x <= 4; x += 2) l.push(['3068b', '#cfd6e6', x, 3.2, 0]);
    for (let x = -3.5; x <= 3.5; x += 1) l.push(['3005', '#9fb3d8', x, 1.2, .5], ['3005', '#9fb3d8', x, 2.4, .5]);
    return build(l);
  }
  function monitor() {
    const g = new THREE.Group();
    g.add(build([['3005', COL.dkgrey, 0, 1.2, 0], ['3022', COL.dkgrey, 0, .4, 0]]));
    const bez = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.8, .35), plastic(COL.black)); bez.position.y = 2.9; bez.castShadow = true; g.add(bez);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.4), new THREE.MeshStandardMaterial({ roughness: .4, emissive: '#ffffff', emissiveIntensity: .7 })); scr.position.set(0, 2.9, .18); g.add(scr); g.userData.scr = scr;
    return g;
  }
  // the monitor's display: ONE screen whose texture changes (content changing on a screen is not an object popping in)
  const SCREENS = { hold: [['PLEASE', 'HOLD'], '#0d2a3a', '#9fe8ff'], menu: [['1   2   3'], '#0d2a3a', '#9fe8ff'], nf: [['ENDING', 'NOT FOUND'], '#2a0608', '#ff4a3a'], blank: [[' '], '#0d2a3a', '#9fe8ff'] };
  const SCR_TEX = {};
  function setScreen(mon, kind) {
    if (!SCR_TEX[kind]) { const [l, bg, fg] = SCREENS[kind]; SCR_TEX[kind] = signTexture(l, { bg, fg, font: 'ui-monospace, monospace', size: 120, pw: 1024, ph: 646 }); }
    const m = mon.userData.scr.material; if (m.map !== SCR_TEX[kind]) { m.map = SCR_TEX[kind]; m.emissiveMap = SCR_TEX[kind]; m.needsUpdate = true; }
  }
  function note() {   // a floating hold-music note: head + stem + flag
    const g = new THREE.Group(), m = plastic('#5a4a8a');
    const h = new THREE.Mesh(new THREE.SphereGeometry(.35, 14, 10), m); h.scale.set(1.25, .9, .8); g.add(h);
    const s = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 1.6, 6), m); s.position.set(.38, .8, 0); g.add(s);
    const f = new THREE.Mesh(new THREE.BoxGeometry(.5, .14, .1), m); f.position.set(.6, 1.5, 0); f.rotation.z = -.5; g.add(f);
    return g;
  }
  function lampObj() {   // a desk lamp (local origin = the base / grip point), with its own warm point light (off until lit)
    const g = new THREE.Group(), m = plastic(COL.mustard);
    g.add(build([['6141', COL.mustard, 0, 0, 0]]));
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 2.4, 8), m); stem.position.y = 1.2; g.add(stem);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(.9, 1.1, 20, 1, true), plastic(COL.mustard, { side: THREE.DoubleSide })); shade.position.y = 2.6; g.add(shade);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.3, 12, 8), glowMat('#fff2c0', 3)); bulb.position.y = 2.3; g.add(bulb);
    const L = new THREE.PointLight('#ffd890', 0, 18, 1.6); L.position.y = 2.2; g.add(L); g.userData.light = L;
    return g;
  }
  window.C00 = { desk, monitor, setScreen, lampObj, at, standFor, solveArm, v3 };

  // the desk district: the Future's call centre. Daytime (hold music); after 200 s (the outro) it's night and the robots doze.
  // r 700: always drawn when the camera is anywhere near (so it can't pop in during the F6 flight from the moon).
  district('desk', { at: DK, r: 700 }, t => {
    const night = t > 200;
    put(keep('c00-floor', () => studGround('desk-floor', '#cdd6e6', 6)), DK[0], 0, DK[1] - 4);
    put(keep('c00-wall', () => { const l = []; for (let r = 1; r <= 9; r++) for (let x = -17; x <= 17; x += 2) l.push(['3004', r === 5 || r === 6 ? (Math.abs(x) % 6 === 1 ? COL.ltblue : '#e7ddf2') : (r % 2 ? '#e7ddf2' : '#dcefe6'), x, r * 1.2, 0]);
      for (let x = -17; x <= 17; x += 2) l.push(['3022', '#bfa8e0', x, 11.2, 0]); return build(l); }), DK[0], 0, DK[1] - 12);
    put(sign('c00-future', ['THE FUTURE', 'customer care'], { w: 12, h: 3, bg: '#ffffff', fg: '#6a4aa8', size: 110, edge: '#bfa8e0' }), DK[0], 7.2, DK[1] - 11.6);
    put(keep('c00-desk', desk), DK[0], 0, DK[1]);
    const mon = put(keep('c00-mon', monitor), DK[0] - 4.6, 3.2, DK[1] - .2, .45);
    setScreen(mon, night ? (t < 254.6 ? (Math.floor(t * 10) % 7 ? 'nf' : 'blank') : 'blank') : t > 14 ? 'menu' : t > 8.6 ? 'hold' : 'blank');
    // the desk phone: rings (rattles) until Clawd answers on the headset at 5.3; it stays on the desk
    const ring = !night && t > 3.2 && t < 5.3 ? .08 * Math.sin(t * 60) : 0;
    put(keep('c00-phone', () => { const g = new THREE.Group(), h = handset(); h.scale.setScalar(.5); h.position.y = .5; g.add(h); g.add(build([['3022', '#E27A92', 0, .4, 0]])); return g; }), DK[0] + 2.8, 3.2, DK[1] + .4, ring);
    // cubicles of robot operators, bobbing to the hold music (dozing at night)
    for (let i = 0; i < 6; i++) {
      if (i === 4) continue;   // the aisle behind Clawd
      const x = DK[0] + (i % 3 - 1) * 10, z = DK[1] - 8 + Math.floor(i / 3) * 3.5;
      put(keep('c00-cub' + i, () => build([['3005', COL.white, -1.5, 1.2, 1], ['3005', COL.white, 1.5, 1.2, 1], ['3020', '#9fb3d8', 0, 2.0, 1, 0], ['3010', '#dcefe6', -2.5, 1.2, 0, Math.PI / 2], ['3010', '#dcefe6', -2.5, 2.4, 0, Math.PI / 2]])), x, 0, z);
      const r = keep('c00-bot' + i, robot); robotPose(r, { walk: 0, carry: false });
      put(r, x, 0, z - 1.2, 0);
      r.rotation.set(night ? .25 : .06 * Math.sin((t - OFF) / BEAT * Math.PI + i), 0, night ? .1 : 0);
    }
    // eggs: the red eye on the wall, the paperclip assistant by the desk
    EGGS.halEye('c00', t, DK[0] - 13, DK[1] - 11.4, 0);
    EGGS.clipAssistant('c00', t, DK[0] + 8.5, DK[1] + 1.5, -.35);
    // hold-music notes drift up and shrink to nothing at the top of their loop (daytime)
    if (!night) for (let i = 0; i < 9; i++) { const ph = frac(t * .18 + hash(i)), n = keep('c00-note' + i, note);
      put(n, DK[0] + (hash(i + 3) - .5) * 26 + Math.sin(t * .8 + i) * .8, 2 + ph * 12, DK[1] - 3 - hash(i + 7) * 6, Math.sin(t + i) * .3, .9 * Math.sin(ph * Math.PI) + .001); }
  });

  // ---------- the rooms behind the doors (they grow/shrink only while their door is shut, so nothing pops in view) ----------
  function room(kind) {   // an open-front box behind a door: x 0..4 (the frame's opening), z 0..-3.4, height 7.1
    const g = new THREE.Group(), C = { zoo: ['#2E5A57', '#3A9C98'], doom: ['#7A1F2B', '#E8603A'], bliss: ['#F6C5D8', '#FFE3EE'] }[kind];
    const wall = (w, h, x, y, z, ry, c) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), matte(c, { side: THREE.DoubleSide })); m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true; g.add(m); };
    wall(4, 7.1, 2, 3.55, -3.4, 0, C[1]); wall(3.4, 7.1, 0, 3.55, -1.7, Math.PI / 2, C[0]); wall(3.4, 7.1, 4, 3.55, -1.7, Math.PI / 2, C[0]);
    const top = new THREE.Mesh(new THREE.PlaneGeometry(4, 3.4), matte(C[0], { side: THREE.DoubleSide })); top.rotation.x = Math.PI / 2; top.position.set(2, 7.1, -1.7); g.add(top);
    if (kind === 'zoo') {
      const bed = build([['3020', COL.pink, 0, .4, 0, 0]]); bed.position.set(1.4, 0, -2.2); g.add(bed);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(.5, 16, 10), glowMat('#FFD27A', 2.6)); lamp.position.set(2.8, 5.4, -2.4); g.add(lamp);
      for (let i = 1; i < 6; i++) { const b = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 7, 6), plastic(COL.silver, { metalness: .7, roughness: .3 })); b.position.set(i * .67, 3.5, -.6); g.add(b); }
    } else if (kind === 'doom') {
      for (let i = 0; i < 5; i++) { const h = 1 + hash(i) * 1.6, b = new THREE.Mesh(new THREE.BoxGeometry(.6, h, .3), matte('#2B1A22')); b.position.set(.4 + i * .8, h / 2, -3.2); g.add(b); }
      const ast = new THREE.Group(); ast.add(new THREE.Mesh(new THREE.IcosahedronGeometry(.55, 1), plastic('#5A4A4A', { roughness: .8 })));
      const trail = new THREE.Mesh(new THREE.ConeGeometry(.45, 2.2, 12), glowMat('#FF9A3A', 2.4)); trail.position.set(.9, .9, 0); trail.rotation.z = 2.3; ast.add(trail); g.add(ast); g.userData.ast = ast;
    } else {
      for (let i = 0; i < 6; i++) { const c = new THREE.Mesh(new THREE.SphereGeometry(.55 + hash(i) * .3, 14, 10), plastic('#FFF5F8', { roughness: .7 })); c.position.set(.5 + (i % 3) * 1.4, 4.8 + Math.floor(i / 3) * 1.1, -2.6 + hash(i + 2)); g.add(c); g.userData['c' + i] = c; }
      const p = new THREE.Mesh(new THREE.BoxGeometry(3, .8, 1.6), plastic('#FFF0F5', { roughness: .6 })); p.position.set(2, .5, -2); g.add(p);
    }
    return g;
  }
  const KINDS = ['zoo', 'doom', 'bliss'];
  function keypad() {   // a giant desk-phone keypad (front +z); key 10 is "0"
    const g = new THREE.Group(), base = new THREE.Mesh(new THREE.BoxGeometry(4.6, 6.2, 1), plastic('#E27A92')); base.position.y = 3.6; base.castShadow = true; g.add(base);
    const legs = build([['3005', '#E27A92', -1.5, 1.2, 0], ['3005', '#E27A92', 1.5, 1.2, 0]]); legs.position.y = -.5; g.add(legs);
    g.userData.keys = [];
    for (let i = 0; i < 12; i++) {
      const k = new THREE.Mesh(new THREE.BoxGeometry(1.1, .95, .3), plastic(i === 10 ? '#fff4d0' : COL.white)); k.position.set((i % 3 - 1) * 1.35, 5.8 - Math.floor(i / 3) * 1.25, .55); k.castShadow = true; g.add(k); g.userData.keys.push(k);
      const lbl = new THREE.Mesh(new THREE.PlaneGeometry(.8, .7), new THREE.MeshStandardMaterial({ map: signTexture(['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'][i], { bg: i === 10 ? '#fff4d0' : '#ffffff', size: 300, pw: 256, ph: 256, font: 'system-ui' }), roughness: .5 }));
      lbl.position.set(0, 0, .16); k.add(lbl);
    }
    return g;
  }

  // ---------- one continuous camera path ----------
  const F0 = WORLD.F.F0;
  const CAM = [
    [0, at(.5, 6, 13)], [3, at(1.5, 6.2, 14)], [5.5, at(3.5, 6.4, 15)], [8.3, at(-3, 6.8, 17)], [10.8, at(-1, 8, 20)], [12.2, [0, 34, 80]], [13.6, [-12, 10, 22]],
    [14.6, [-8, 7, 16]], [16.4, [-5.5, 6.2, 13.5]], [17.4, [0, 7, 16]], [18.9, [1, 6.4, 13.5]], [19.7, [5.5, 7, 16.5]], [21.4, [6, 6.4, 14.5]], [22.2, [3.5, 6.5, 16]],
    [23.4, [-3, 7.5, 24]], [F0.t0, F0.A.pos]];
  const LOOKP = [
    [0, at(0, 5, -2)], [3, at(0, 5, -2)], [5.5, at(0, 5, -2)], [8.3, at(-1, 4.8, -2)], [10.8, at(0, 4.6, -4)], [12.2, [0, 8, 10]], [13.6, [-8, 5, -4]],
    [14.6, [-6, 4.6, -5]], [16.4, [-6, 4.4, -5]], [17.4, [1, 4.8, -5]], [18.9, [1, 4.6, -5]], [19.7, [7.5, 4.8, -5]], [21.4, [7.5, 4.6, -5]], [22.2, [4, 4.2, -1]],
    [23.4, [2, 4.4, -3]], [F0.t0, F0.A.look]];
  const FOV = [[0, 30], [10.8, 32], [12.2, 46], [13.6, 34], [21.4, 32], [22.2, 30], [F0.t0, F0.A.fov]];
  const pathE = (t, keys) => path(t, keys, { easeEnds: false });

  // ---------- Pip's spots, SOLVED once from the posed figure (cached) ----------
  const PUSH_POSE = { armR: 1.35, armL: .5, lean: .12 };                    // a one-handed shove at chest height
  const TH = OPENA * 1.9, PANEL = [Math.cos(TH), Math.sin(TH)], NORMAL = [-Math.sin(TH), Math.cos(TH)];   // open panel direction, its outer-face normal
  const PUSH_RY = Math.atan2(-NORMAL[0], -NORMAL[1]);                       // facing into the panel's outer face (the way it closes)
  let SPOTS = null;
  function solveSpots(P) {
    if (SPOTS) return SPOTS;
    const d = S().DOORS; SPOTS = { peek: [], push: [], target: [] };
    pose(P, PUSH_POSE); put(P, 0, DOOR_Y, 0, PUSH_RY); const handY = limb(P, 'handR')[1];
    d.forEach(dd => {
      const r = 3.5, target = [dd.x + r * PANEL[0] + NORMAL[0] * .3, handY, DOOR_Z + r * PANEL[1] + NORMAL[1] * .3];   // outer face near its free end
      SPOTS.target.push(target);
      SPOTS.push.push(standFor(P, PUSH_POSE, PUSH_RY, DOOR_Y, target, 'handR'));
      SPOTS.peek.push([dd.x + 3.2, DOOR_Z + 3.0]);
    });
    const K = keep('c00-keypad', keypad); put(K, KEYPAD[0], DOOR_Y, KEYPAD[1], KEYPAD[2]); const key0 = v3(K.userData.keys[10], [0, 0, .3]); ROOT.remove(K);   // measured only; the shot decides whether it's drawn
    const ry = KEYPAD[2] + Math.PI, armR = solveArm(P, { lean: .2 }, 'armR', -.4, 1.8, ry, DOOR_Y, key0[1], 'handR', 'c00-jab');
    SPOTS.jab = { key0, ry, armR, stand: standFor(P, { lean: .2, armR }, ry, DOOR_Y, key0, 'handR') };
    return SPOTS;
  }

  function intro(t, lt) {
    ROOT.matrix.identity(); ROOT.updateMatrixWorld(true);   // a stale flatten matrix from another chapter's frame must not skew limb()
    const d = S().DOORS, q = t;
    // ---------- the desk: Clawd at work ----------
    if (t < 14.5) {
      const C = clawd('c00', {}), talk = t > 5.5 && t < 11.49;
      clawdPose(C, { hat: 'headset', face: t < 5.5 ? 'smug' : t < 8.3 ? 'joy' : t < 11.49 ? 'smug' : 'neutral', bob: .15 * pulse(t, 5),
        armL: talk ? .35 + .3 * Math.abs(Math.sin(t * 3)) : .1, armR: t > 11.49 ? kf(t, [[11.49, .1], [11.9, 1.1]]) : t > 8.6 && t < 9.4 ? .6 * Math.sin((t - 8.6) / .8 * Math.PI) : .15,
        twist: t > 11.49 ? kf(t, [[11.49, 0], [12, -.5]]) : 0 });
      put(C, DK[0], 0, DK[1] - 2.4, 0);
    }
    const P = fig('pip', PIP), SP = solveSpots(P);
    // ---------- the doors, their rooms, their numbers ----------
    d.forEach((dd, i) => {
      const u = keep('c02door' + i, () => doorUnit(dd.col)), r = keep('c00-room' + i, () => room(KINDS[i]));   // the SAME door objects c02 uses
      const open = t < OPEN[i] ? 0 : t < SLAM[i] ? backOut(seg(t, OPEN[i], OPEN[i] + .4)) * OPENA : (1 - easeIn(seg(t, SLAM[i], SLAM[i] + .1))) * OPENA;
      doorPose(u, open, 0, i + 1); put(u, dd.x, DOOR_Y, DOOR_Z);
      const rs = seg(t, OPEN[i] - .4, OPEN[i] - .05) * (1 - seg(t, SLAM[i] + .15, SLAM[i] + .5));      // grows/shrinks only while the door is shut
      if (rs > .001) {
        put(r, dd.x, DOOR_Y, DOOR_Z, 0, rs);
        if (r.userData.ast) { const k = frac((t - OPEN[i]) * .8); r.userData.ast.position.set(3.4 - 2.6 * k, 6.4 - 4.2 * k, -2.4); r.userData.ast.rotation.set(t * 3, t * 2, 0); r.userData.ast.scale.setScalar(Math.sin(Math.PI * k) + .01); }
        if (KINDS[i] === 'bliss') for (let c = 0; c < 6; c++) r.userData['c' + c].position.x = .5 + (c % 3) * 1.4 + .2 * Math.sin(t * .9 + c);
      }
      // c02's glow panels grow in behind the shut doors before the whip, so the hand-over at 25.69 has nothing new to pop in
      const gs = ease(seg(t, 22.0, 22.6)); if (gs > .001) put(keep('doorglow' + i, () => new THREE.Mesh(new THREE.PlaneGeometry(4, 7.1), glowMat(dd.inside || '#FFE3EE', 1.6))), dd.x + 2, DOOR_Y + 3.6, DOOR_Z - .3, 0, gs);
      const ns = 1 - ease(seg(t, 24.35, 24.85)); if (ns > .001) put(sign('c00-num' + i, [String(i + 1)], { w: 1.4, h: 1.4, bg: '#ffffff', fg: '#6a4aa8', size: 300, glow: true }), dd.x + 2, DOOR_Y + 7.9, DOOR_Z + .3, 0, ns);
    });
    // ---------- Pip: one timed walk plan through every spot (no teleports), action poses blended in and out as layers ----------
    const pk = SP.peek, pu = SP.push, J = SP.jab;
    const plan = [[0, [-30, 3]], [5.4, [-30, 3]], [14.4, pk[0]], [16.2, pk[0]], [16.62, pu[0]], [16.95, pu[0]], [17.8, pk[1]], [18.32, pk[1]], [18.6, pu[1]],
      [18.9, pu[1]], [19.75, pk[2]], [20.95, pk[2]], [21.12, pu[2]], [21.4, pu[2]], [21.85, J.stand], [23.3, J.stand], [25.3, [-2, 1]]];
    const sp = stepTo(q, plan, { run: q > 16.9 && q < 19.8 }), w = (a, b, c, e) => seg(q, a, b) * (1 - seg(q, c, e));   // a layer's weight
    let ry = sp.ry; const lay = [], faces = [];
    // door 1: peek (lean into the room), turn to camera unimpressed
    if (q > 14.4 && q < 16.3) { lay.push([w(14.6, 14.9, 15.85, 16.05), { lean: .35, head: .2 }]); ry = lerp(Math.PI - .25, -.6, ease(seg(q, 15.85, 16.15))); faces.push(q < 15.9 ? 'neutral' : 'suspicious'); }
    // door 2: a shocked jump at the asteroid, turning out to the camera
    if (q > 17.8 && q < 18.45) { lay.push([w(17.85, 17.95, 18.3, 18.42), { bodyY: .9 * Math.abs(Math.sin((q - 17.85) * 9)), armL: 2.4, armR: 2.4, lean: -.2 }]); ry = lerp(Math.PI - .25, -.4, ease(seg(q, 17.85, 18.0))); faces.push('shocked'); }
    // door 3: a sleepy sway into the pink room, snap awake
    if (q > 19.75 && q < 21.1) { const k = w(20.0, 20.3, 20.9, 21.0); lay.push([k, { bodyRoll: .14 * Math.sin(q * 3), lean: .25, headTilt: .3 }]); ry = lerp(Math.PI - .25, -.5, ease(seg(q, 20.95, 21.08))); faces.push(k > .3 ? 'sleepy' : q > 20.9 ? 'shocked' : 'neutral'); }
    // the shoves: face the panel; the push pose is fully in on the contact frame, out after the slam
    for (let i = 0; i < 3; i++) if (q > CONTACT[i] - .4 && q < SLAM[i] + .6) { lay.push([w(CONTACT[i] - .3, CONTACT[i] - .03, SLAM[i] + .15, SLAM[i] + .5), PUSH_POSE]);
      if (q > CONTACT[i] - .32 && q < SLAM[i] + .2) ry = lerp(ry, PUSH_RY, ease(seg(q, CONTACT[i] - .32, CONTACT[i] - .12))); faces.push('determined'); }
    // the keypad: three jabs; the arm is solved so the hand lands on the 0 key exactly on each beat
    if (q > 21.85 && q < 23.4) { ry = lerp(sp.ry, J.ry, ease(seg(q, 21.6, 21.85))); let jab = 0; for (const zb of ZERO) jab = Math.max(jab, q < zb - .14 ? 0 : q < zb ? ease((q - zb + .14) / .14) : 1 - ease((q - zb) / .2));
      lay.push([1, { lean: .2, armR: lerp(.2, J.armR, jab) }]); faces.push(q < ZERO[2] + .25 ? 'determined' : 'smug'); }
    // "lemme talk to a human": face the camera, thumb at self, then walk to c02's start spot
    if (q > 23.3) { if (q < 24.4) ry = lerp(J.ry, 0, ease(seg(q, 23.3, 23.7))); lay.push([w(23.35, 23.7, 24.6, 24.9), { armR: 1.0, armRz: -.55, head: .15 * Math.sin(q * 6), headTilt: -.1 }]); faces.push(q < 24.8 ? 'smug' : 'determined'); }
    if (q > 25.3) ry = lerp(sp.ry, 0, ease(seg(q, 25.3, 25.6)));
    let pp = { ...sp.pose, face: faces[faces.length - 1] || 'neutral' };
    for (const [k, L] of lay) pp = blend(pp, { ...pp, ...L, face: pp.face }, clamp(k));
    pose(P, pp); P.userData.J.earPencil && (P.userData.J.earPencil.visible = true);
    put(P, sp.x, DOOR_Y, sp.z, ry);
    // contacts: the shoving hand on each door's panel; the finger on the 0 key on each ZERO beat
    for (let i = 0; i < 3; i++) if (Math.abs(q - CONTACT[i]) < .021) expect(`pip shoves door ${i + 1}`, limb(P, 'handR'), SP.target[i], .6);
    for (const zb of ZERO) if (Math.abs(q - zb) < .021) expect('pip presses 0', limb(P, 'handR'), J.key0, .6);
    // ---------- the keypad (pops up from scale 0, retracts after) + Clawd the host ----------
    const ks = (ease(seg(q, 21.2, 21.6)) + .08 * Math.sin(Math.PI * seg(q, 21.45, 21.75))) * (1 - easeIn(seg(q, 24.85, 25.35)));   // eases up from 0 with a little bounce
    if (ks > .001) {
      const K = keep('c00-keypad', keypad); let lit = 0; for (const zb of ZERO) if (q > zb && q < zb + .25) lit = 1;
      K.userData.keys[10].position.z = .55 - .15 * lit; K.userData.keys[10].material = lit ? glowMat('#fff4d0', 1.8) : plastic('#fff4d0');
      put(K, KEYPAD[0], DOOR_Y, KEYPAD[1], KEYPAD[2], ks);
    }
    const C = clawd('c00h', {});
    if (q > 21.45) {   // walks in from off-screen right, reacts to the three ZEROs, then staggers off dizzy (off-screen right)
      const cs = stepTo(q, [[21.45, [17, 1.5]], [22.1, [7.6, 1.4]], [23.55, [7.6, 1.4]], [25.3, [34, 4]]], { run: q > 23.5 }), f = q < ZERO[0] ? 'smug' : q < ZERO[1] ? 'suspicious' : q < ZERO[2] ? 'shocked' : 'dizzy';
      const moving = q < 22.1 || q > 23.55;
      clawdPose(C, { hat: 'headset', face: f, walk: moving ? q * 3.5 : null, roll: q > ZERO[2] ? Math.sin(q * 9) * .12 : 0, armL: q > ZERO[2] ? .6 + .3 * Math.sin(q * 7) : .2, armR: q > ZERO[2] ? .6 + .3 * Math.sin(q * 7 + 2) : .2, bob: .1 * pulse(t, 6) });
      put(C, cs.x, DOOR_Y, cs.z, lerp(cs.ry, -.7, seg(q, 22.0, 22.3) * (1 - seg(q, 23.5, 23.7))));
      const ss = ease(seg(q, ZERO[2], ZERO[2] + .3));   // sparks grow in around the head and leave with him
      if (ss > .001) for (let s = 0; s < 6; s++) { const sk = keep('c00-spark' + s, () => new THREE.Mesh(new THREE.OctahedronGeometry(.22), glowMat(s % 2 ? '#FFE38A' : '#7CE3FF', 3))), a = q * 5 + s * 1.05;
        put(sk, cs.x + Math.cos(a) * 2.6, DOOR_Y + 6.6 + .4 * Math.sin(a * 2), cs.z + Math.sin(a) * 1.4, a, ss); }
    } else {   // the doors' host (another of the Future's operators) waits by the doors from the start, presenting them
      clawdPose(C, { hat: 'headset', face: 'smug', armR: q > 14.4 ? .5 + .2 * Math.sin(q * 2) : .2, armL: .2, bob: .1 * pulse(t, 6) });
      put(C, -14.5, DOOR_Y, -4.5, .7);
    }
    // door slams and ZERO presses bump the camera
    let bump = [0, 0, 0];
    for (const s of SLAM) if (t > s && t < s + .6) { const k = shake(t, .3 * Math.exp(-(t - s) * 9)); bump = bump.map((v, j) => v + k[j]); }
    for (const zb of ZERO) if (t > zb && t < zb + .5) { const k = shake(t, .2 * Math.exp(-(t - zb) * 10)); bump = bump.map((v, j) => v + k[j]); }
    // ---------- camera + look ----------
    if (t >= F0.t0) { WORLD.apply(WORLD.flight('F0', t)); cam({ blur: .4 }); }
    else {
      const p = pathE(t, CAM), l = pathE(t, LOOKP), dr = drift(lt, .5 * (1 - seg(t, 23.4, 24.3)));
      cam({ pos: [p[0] + dr[0] + bump[0], p[1] + dr[1] + bump[1], p[2] + dr[2]], look: [l[0] + bump[0] * .3, l[1] + bump[1] * .3, l[2]], fov: pathE(t, FOV), blur: t < 11 ? .7 : t < 13.6 ? .2 : .8,
        focus: t < 12 ? at(0, 4.6, -2) : t < 21.9 ? [lerp(-5, 7.5, seg(t, 14, 21.4)), 4.5, -4] : [3, 4.5, 0] });
      look({ ...WORLD.LOOK.menu });
    }
    // iris in from black (screen space)
    if (t < 1.8) { const r = easeOut(seg(t, .15, 1.8)) * 1250;
      hud(ctx => { ctx.fillStyle = '#000'; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(W / 2, H * .45, Math.max(.1, r), 0, Math.PI * 2, true); ctx.fill(); }); }
  }
  shots([[0, intro]]);
})();
