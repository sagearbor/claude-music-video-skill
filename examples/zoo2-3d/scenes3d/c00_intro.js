// c00_intro.js: 0–25.69 s. The Future's call centre (desk district) → the three doors at the stage edge → "ZERO ZERO ZERO".
// One continuous camera path; it reaches WORLD.F.F0.A at 24.30, then the F0 whip carries it into the chorus-1 drop (c02).
//   0.00  iris in on Clawd at the desk, hold music (notes float up), robot operators in their cubicles
//   5.50  "Thank you for calling the Future."  Clawd picks up, waves into the headset mic
//   8.30  "Your extinction is important to us." Clawd taps hold; the monitor says PLEASE HOLD
//  11.49  "Please select your ending."  Clawd points off; the camera lifts off and flies to the doors on the stage edge
//  14.44  "For the Zoo, press one."  door 1 cracks open (cage + mood lamp); Pip peeks, unimpressed, slams it on bt(26)
//  17.39  "For Extinction, press two."  door 2: red sky + asteroid; Pip jumps, hair-raising; slam on bt(29)
//  19.55  "For eternal Bliss, press three."  door 3: pink clouds + pillow; Pip sways, sleepy; snaps awake, slam on bt(33)
//  21.86  "Zero. Zero. ZERO."  Pip jabs the giant keypad's 0 on bt(34), bt(35), bt(36); Clawd: suspicious → shocked → dizzy + sparks
//  23.30  "Lemme talk to a human."  Pip thumbs at self; the camera pulls back to F0.A (24.30) → the F0 whip
(() => {
  const DK = WORLD.D.desk, at = (dx, dy, dz) => WORLD.at('desk', dx, dy, dz);
  const S = () => window.SETS3D || { DOORS: [{ x: -9, col: '#9C7A5C' }, { x: -2, col: '#6B3B4A' }, { x: 5, col: '#E7A6C0' }] };
  const DOOR_Y = .8, DOOR_Z = -6;
  const SLAM = [bt(26), bt(29), bt(33)], OPEN = [14.95, 17.55, 19.75], ZERO = [bt(34), bt(35), bt(36)];

  // ---------- the call centre (shared with c11 through window.C00) ----------
  function desk() {   // a 10-stud desk: brick legs, a 2x10 plate top with tiles (front at +z), a panel at the back
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
    return g;
  }
  const SCREENS = { hold: ['PLEASE', 'HOLD'], menu: ['1   2   3'], nf: ['ENDING', 'NOT FOUND'], blank: [' '] };
  function screen(kind) {
    return sign('c00scr-' + kind, SCREENS[kind], { w: 3.8, h: 2.4, bg: kind === 'nf' ? '#2a0608' : '#0d2a3a', fg: kind === 'nf' ? '#ff4a3a' : '#9fe8ff', font: 'ui-monospace, monospace', size: 120, glow: true, edge: '#111' });
  }
  function note() {   // a floating hold-music note: head + stem + flag
    const g = new THREE.Group(), m = plastic('#5a4a8a');
    const h = new THREE.Mesh(new THREE.SphereGeometry(.35, 14, 10), m); h.scale.set(1.25, .9, .8); g.add(h);
    const s = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 1.6, 6), m); s.position.set(.38, .8, 0); g.add(s);
    const f = new THREE.Mesh(new THREE.BoxGeometry(.5, .14, .1), m); f.position.set(.6, 1.5, 0); f.rotation.z = -.5; g.add(f);
    return g;
  }
  function lampObj() {   // a desk lamp to hold (local origin = the grip at the base of the stem), with its own warm point light
    const g = new THREE.Group(), m = plastic(COL.mustard);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 2.4, 8), m); stem.position.y = 1.2; g.add(stem);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(.9, 1.1, 20, 1, true), plastic(COL.mustard, { side: THREE.DoubleSide })); shade.position.y = 2.6; g.add(shade);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.3, 12, 8), glowMat('#fff2c0', 3)); bulb.position.y = 2.3; g.add(bulb);
    const L = new THREE.PointLight('#ffd890', 60, 18, 1.6); L.position.y = 2.2; g.add(L);
    return g;
  }
  window.C00 = { desk, monitor, screen, lampObj, at };

  // the desk district: the Future's call centre. Daytime (hold music); after 200 s (the outro) it's night and the robots doze.
  district('desk', { at: DK, r: 60 }, t => {
    const night = t > 200;
    put(keep('c00-floor', () => studGround('desk-floor', '#cdd6e6', 6)), DK[0], 0, DK[1] - 4);
    put(keep('c00-wall', () => { const l = []; for (let r = 1; r <= 9; r++) for (let x = -17; x <= 17; x += 2) l.push(['3004', r === 5 || r === 6 ? (Math.abs(x) % 6 === 1 ? COL.ltblue : '#e7ddf2') : (r % 2 ? '#e7ddf2' : '#dcefe6'), x, r * 1.2, 0]);
      for (let x = -17; x <= 17; x += 2) l.push(['3022', '#bfa8e0', x, 11.2, 0]); return build(l); }), DK[0], 0, DK[1] - 12);
    put(sign('c00-future', ['THE FUTURE', 'customer care'], { w: 12, h: 3, bg: '#ffffff', fg: '#6a4aa8', size: 110, edge: '#bfa8e0' }), DK[0], 7.2, DK[1] - 11.6);
    put(keep('c00-desk', desk), DK[0], 0, DK[1]);
    put(keep('c00-mon', monitor), DK[0] - 4.6, 3.2, DK[1] - .2, .45);
    const scr = night ? (t < 254.6 ? (Math.floor(t * 10) % 7 ? 'nf' : 'blank') : 'blank') : t > 14 ? 'menu' : t > 8.6 ? 'hold' : 'blank';
    put(screen(scr), DK[0] - 4.6 + .09, 3.2 + 1.5, DK[1] - .2 + .2, .45, .95);
    // the desk phone (rings and shakes before Clawd picks up at 5.3)
    const ring = !night && t > 3.2 && t < 5.3 ? .08 * Math.sin(t * 60) : 0;
    if (night || t < 5.3) put(keep('c00-phone', () => { const g = new THREE.Group(), h = handset(); h.scale.setScalar(.5); h.position.y = .5; g.add(h); g.add(build([['3022', '#E27A92', 0, .4, 0]])); return g; }), DK[0] + 2.8, 3.2, DK[1] + .4, ring);
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
    // hold-music notes drifting up (daytime)
    if (!night) for (let i = 0; i < 9; i++) { const ph = frac(t * .18 + hash(i)), n = keep('c00-note' + i, note);
      put(n, DK[0] + (hash(i + 3) - .5) * 26 + Math.sin(t * .8 + i) * .8, 2 + ph * 12, DK[1] - 3 - hash(i + 7) * 6, Math.sin(t + i) * .3, .9 * Math.sin(ph * Math.PI) + .05); }
  });

  // ---------- the rooms behind the doors (only in this chapter; c02 has its own glow panels) ----------
  function room(kind) {   // an open-front box behind a door: x 0..4 (the frame's opening), z 0..-3.4, height 7.1
    const g = new THREE.Group(), C = { zoo: ['#2E5A57', '#3A9C98'], doom: ['#7A1F2B', '#E8603A'], bliss: ['#F6C5D8', '#FFE3EE'] }[kind];
    const wall = (w, h, x, y, z, ry, c) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), matte(c, { side: THREE.DoubleSide })); m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true; g.add(m); };
    wall(4, 7.1, 2, 3.55, -3.4, 0, C[1]); wall(3.4, 7.1, 0, 3.55, -1.7, Math.PI / 2, C[0]); wall(3.4, 7.1, 4, 3.55, -1.7, Math.PI / 2, C[0]);
    const top = new THREE.Mesh(new THREE.PlaneGeometry(4, 3.4), matte(C[0], { side: THREE.DoubleSide })); top.rotation.x = Math.PI / 2; top.position.set(2, 7.1, -1.7); g.add(top);
    if (kind === 'zoo') {   // a cosy pen: a bed, a soft mood lamp, bars
      const bed = build([['3020', COL.pink, 0, .4, 0, 0]]); bed.position.set(1.4, 0, -2.2); g.add(bed);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(.5, 16, 10), glowMat('#FFD27A', 2.6)); lamp.position.set(2.8, 5.4, -2.4); g.add(lamp);
      for (let i = 1; i < 6; i++) { const b = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 7, 6), plastic(COL.silver, { metalness: .7, roughness: .3 })); b.position.set(i * .67, 3.5, -.6); g.add(b); }
    } else if (kind === 'doom') {   // a city skyline + the falling asteroid (animated in the shot)
      for (let i = 0; i < 5; i++) { const h = 1 + hash(i) * 1.6, b = new THREE.Mesh(new THREE.BoxGeometry(.6, h, .3), matte('#2B1A22')); b.position.set(.4 + i * .8, h / 2, -3.2); g.add(b); }
      const ast = new THREE.Group(); ast.add(new THREE.Mesh(new THREE.IcosahedronGeometry(.55, 1), plastic('#5A4A4A', { roughness: .8 })));
      const trail = new THREE.Mesh(new THREE.ConeGeometry(.45, 2.2, 12), glowMat('#FF9A3A', 2.4)); trail.position.set(.9, .9, 0); trail.rotation.z = 2.3; ast.add(trail); g.add(ast); g.userData.ast = ast;
    } else {   // pink clouds and a giant pillow
      for (let i = 0; i < 6; i++) { const c = new THREE.Mesh(new THREE.SphereGeometry(.55 + hash(i) * .3, 14, 10), plastic('#FFF5F8', { roughness: .7 })); c.position.set(.5 + (i % 3) * 1.4, 4.8 + Math.floor(i / 3) * 1.1, -2.6 + hash(i + 2)); g.add(c); g.userData['c' + i] = c; }
      const p = new THREE.Mesh(new THREE.BoxGeometry(3, .8, 1.6), plastic('#FFF0F5', { roughness: .6 })); p.position.set(2, .5, -2); g.add(p);
    }
    return g;
  }
  const KINDS = ['zoo', 'doom', 'bliss'];
  function keypad() {   // a giant desk-phone keypad standing on the stage (front +z); "0" is key 10
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
    [14.6, [-8, 7, 16]], [16.4, [-5.5, 6.2, 13.5]], [17.4, [0, 7, 16]], [18.9, [1, 6.4, 13.5]], [19.7, [5.5, 7, 16.5]], [21.4, [6, 6.4, 14.5]], [22.2, [-1, 6.5, 16]],
    [23.4, [-6, 7.5, 24]], [F0.t0, F0.A.pos]];
  const LOOKP = [
    [0, at(0, 5, -2)], [3, at(0, 5, -2)], [5.5, at(0, 5, -2)], [8.3, at(-1, 4.8, -2)], [10.8, at(0, 4.6, -4)], [12.2, [0, 8, 10]], [13.6, [-8, 5, -4]],
    [14.6, [-6, 4.6, -5]], [16.4, [-6, 4.4, -5]], [17.4, [1, 4.8, -5]], [18.9, [1, 4.6, -5]], [19.7, [7.5, 4.8, -5]], [21.4, [7.5, 4.6, -5]], [22.2, [-3, 4.2, -2]],
    [23.4, [-4.5, 4.4, -4]], [F0.t0, F0.A.look]];
  const FOV = [[0, 30], [10.8, 32], [12.2, 46], [13.6, 34], [21.4, 32], [22.2, 30], [F0.t0, F0.A.fov]];
  const pathE = (t, keys) => path(t, keys, { easeEnds: false });

  function intro(t, lt) {
    const d = S().DOORS;
    // ---------- the desk: Clawd at work ----------
    if (t < 14.5) {
      const C = clawd('c00', {}), talk = t > 5.5 && t < 11.49;
      clawdPose(C, { hat: 'headset', face: t < 5.5 ? 'smug' : t < 8.3 ? 'joy' : t < 11.49 ? 'smug' : 'neutral', bob: .15 * pulse(t, 5),
        armL: talk ? .35 + .3 * Math.abs(Math.sin(t * 3)) : .1, armR: t > 11.49 ? kf(t, [[11.49, .1], [11.9, 1.1]]) : t > 8.6 && t < 9.4 ? .6 * Math.sin((t - 8.6) / .8 * Math.PI) : .15,
        twist: t > 11.49 ? kf(t, [[11.49, 0], [12, -.5]]) : 0 });
      put(C, DK[0], 0, DK[1] - 2.4, 0);
    }
    // ---------- the doors ----------
    d.forEach((dd, i) => {
      const u = keep('c00-door' + i, () => doorUnit(dd.col)), r = keep('c00-room' + i, () => room(KINDS[i]));
      const open = t < OPEN[i] ? 0 : t < SLAM[i] ? backOut(seg(t, OPEN[i], OPEN[i] + .4)) * .62 : (1 - easeIn(seg(t, SLAM[i] - .02, SLAM[i] + .1))) * .62;
      doorPose(u, open, 0, i + 1); put(u, dd.x, DOOR_Y, DOOR_Z);
      if (open > .01) {
        put(r, dd.x, DOOR_Y, DOOR_Z);
        if (r.userData.ast) { const k = frac((t - OPEN[i]) * .8); r.userData.ast.position.set(3.4 - 2.6 * k, 6.4 - 4.2 * k, -2.4); r.userData.ast.rotation.set(t * 3, t * 2, 0); }
        if (KINDS[i] === 'bliss') for (let c = 0; c < 6; c++) r.userData['c' + c].position.x = .5 + (c % 3) * 1.4 + .2 * Math.sin(t * .9 + c);
      }
      put(sign('c00-num' + i, [String(i + 1)], { w: 1.4, h: 1.4, bg: '#ffffff', fg: '#6a4aa8', size: 300, glow: true }), dd.x + 2, DOOR_Y + 7.9, DOOR_Z + .3);
    });
    if (t > 13.2) {
      const P = fig('pip', PIP), q = t, spot = i => [d[i].x + 5.0, -3.6];
      let x, z, ry = -1.0, pp = { face: 'neutral' };
      if (q < 14.6) { const k = ease(seg(q, 13.2, 14.6)); x = lerp(d[0].x - 6, spot(0)[0], k); z = lerp(1.5, spot(0)[1], k); ry = Math.atan2(spot(0)[0] - (d[0].x - 6), spot(0)[1] - 1.5); pp = { ...walk(q * 1.4), face: 'neutral' }; }
      else if (q < 17.0) { [x, z] = spot(0); const peek = seg(q, 15.4, 15.7) * (1 - seg(q, SLAM[0] - .25, SLAM[0] - .05));
        pp = { lean: .35 * peek, head: -.3 * peek, armR: q > SLAM[0] - .3 && q < SLAM[0] + .2 ? 1.4 : .2, face: q < 15.6 ? 'neutral' : q < SLAM[0] + .3 ? 'suspicious' : 'determined' }; }
      else if (q < 17.6) { const k = ease(seg(q, 17.0, 17.6)); x = lerp(spot(0)[0], spot(1)[0], k); z = spot(1)[1]; ry = lerp(Math.PI / 2, -1.0, Math.abs(2 * k - 1)); pp = { ...run(q * 2.2), face: 'neutral' }; }
      else if (q < 19.1) { [x, z] = spot(1); const sc = seg(q, 17.85, 18.0) * (1 - seg(q, 18.6, 18.75));
        pp = { bodyY: .9 * sc * Math.abs(Math.sin((q - 17.85) * 9)), armL: 2.4 * sc, armR: q > SLAM[1] - .25 && q < SLAM[1] + .2 ? 1.4 : 2.4 * sc, face: q < 17.85 ? 'neutral' : q < SLAM[1] + .25 ? 'shocked' : 'fear', lean: -.2 * sc }; }
      else if (q < 19.7) { const k = ease(seg(q, 19.1, 19.7)); x = lerp(spot(1)[0], spot(2)[0], k); z = spot(2)[1]; ry = lerp(Math.PI / 2, -1.0, Math.abs(2 * k - 1)); pp = { ...run(q * 2.2), face: 'neutral' }; }
      else if (q < 21.9) { [x, z] = spot(2); const sway = seg(q, 20.1, 20.4) * (1 - seg(q, 20.95, 21.05)), snap = q > 20.95 && q < 21.3;
        pp = { bodyRoll: .14 * sway * Math.sin(q * 3), lean: .25 * sway, headTilt: .3 * sway, head: snap ? .5 * Math.sin((q - 20.95) * 40) : -.2 * sway,
          armR: q > SLAM[2] - .25 && q < SLAM[2] + .2 ? 1.4 : .1, face: sway > .3 ? 'sleepy' : snap ? 'shocked' : q > SLAM[2] ? 'determined' : 'neutral' }; }
      else {   // the keypad: walk over, three jabs on the beats, then "lemme talk to a human"
        const k = ease(seg(q, 21.6, 21.95)); x = lerp(spot(2)[0], -2.6, k); z = lerp(spot(2)[1], 1, k); ry = lerp(-1.0, -1.3, k);
        let jab = 0; for (const zb of ZERO) if (q >= zb - .12) jab = Math.max(jab, q < zb ? (q - zb + .12) / .12 : Math.exp(-(q - zb) * 7));
        pp = { ...(k < 1 ? walk(q * 1.4) : {}), armR: .3 + 1.2 * jab, lean: .25 * jab, face: q < ZERO[2] + .2 ? 'determined' : 'smug' };
        if (q > 23.3) {   // turn to camera, thumb at self, ending on c02's start spot (-2, 1) facing +z
          const tk = ease(seg(q, 23.3, 23.8)); x = lerp(-2.6, -2, ease(seg(q, 24.6, 25.4))); ry = lerp(-1.3, 0, tk);
          pp = { face: q < 24.8 ? 'smug' : 'determined', armR: tk * (q < 24.9 ? 1.0 : .2), armRz: -.55 * tk * (q < 24.9 ? 1 : 0), head: q < 24.4 ? .2 * Math.sin(q * 6) : 0, headTilt: -.1 };
        }
      }
      pose(P, pp); put(P, x, DOOR_Y, z, ry);
      // the giant keypad + Clawd the host (dizzy after the third ZERO)
      if (q > 21.45) {
        const K = keep('c00-keypad', keypad); let lit = 0; for (const zb of ZERO) if (q > zb && q < zb + .25) lit = 1;
        K.userData.keys[10].position.z = .55 - .18 * lit; K.userData.keys[10].material = lit ? glowMat('#fff4d0', 1.8) : plastic('#fff4d0');
        put(K, -5.6, DOOR_Y, -.4, .6);
        const C = clawd('c00h', {}), f = q < ZERO[0] ? 'smug' : q < ZERO[1] ? 'suspicious' : q < ZERO[2] ? 'shocked' : 'dizzy';
        clawdPose(C, { hat: 'headset', face: f, roll: q > ZERO[2] ? Math.sin(q * 9) * .12 : 0, armL: q > ZERO[2] ? .6 + .3 * Math.sin(q * 7) : .2, armR: q > ZERO[2] ? .6 + .3 * Math.sin(q * 7 + 2) : .2, bob: .1 * pulse(t, 6) });
        const wk = seg(q, 21.45, 22.3); put(C, lerp(16, 4.5, ease(wk)), DOOR_Y, -1.2, wk < 1 ? -Math.PI / 2 : -.5);
        if (wk < 1) clawdPose(C, { hat: 'headset', face: 'smug', walk: q * 3, bob: .1 * pulse(t, 6) });
        if (q > ZERO[2]) for (let s = 0; s < 6; s++) {   // sparks orbiting Clawd's head
          const sp = keep('c00-spark' + s, () => new THREE.Mesh(new THREE.OctahedronGeometry(.22), glowMat(s % 2 ? '#FFE38A' : '#7CE3FF', 3))), a = q * 5 + s * 1.05;
          put(sp, 4.5 + Math.cos(a) * 2.6, DOOR_Y + 6.6 + .4 * Math.sin(a * 2), -1.2 + Math.sin(a) * 1.4, a);
        }
      } else {   // Clawd the host stands by the doors, presenting the menu
        const C = clawd('c00h', {}); clawdPose(C, { hat: 'headset', face: 'smug', armR: q > 14.4 ? .5 + .2 * Math.sin(q * 2) : .2, armL: .2, bob: .1 * pulse(t, 6) });
        put(C, -14.5, DOOR_Y, -4.5, .7);
      }
    }
    // door slams and ZERO jabs bump the camera
    let bump = [0, 0, 0];
    for (const s of SLAM) if (t > s && t < s + .6) { const k = shake(t, .3 * Math.exp(-(t - s) * 9)); bump = bump.map((v, j) => v + k[j]); }
    for (const zb of ZERO) if (t > zb && t < zb + .5) { const k = shake(t, .2 * Math.exp(-(t - zb) * 10)); bump = bump.map((v, j) => v + k[j]); }
    // ---------- camera + look ----------
    if (t >= F0.t0) { WORLD.apply(WORLD.flight('F0', t)); cam({ blur: .4 }); }
    else {
      const p = pathE(t, CAM), l = pathE(t, LOOKP), dr = drift(lt, .5 * (1 - seg(t, 23.4, 24.3)));
      cam({ pos: [p[0] + dr[0] + bump[0], p[1] + dr[1] + bump[1], p[2] + dr[2]], look: [l[0] + bump[0] * .3, l[1] + bump[1] * .3, l[2]], fov: pathE(t, FOV), blur: t < 11 ? .7 : t < 13.6 ? .2 : .8,
        focus: t < 12 ? at(0, 4.6, -2) : t < 21.9 ? [lerp(-5, 7.5, seg(t, 14, 21.4)), 4.5, -4] : [-3, 4.5, 0] });
      look({ ...WORLD.LOOK.menu });
    }
    // iris in from black (screen space)
    if (t < 1.8) { const r = easeOut(seg(t, .15, 1.8)) * 1250;
      hud(ctx => { ctx.fillStyle = '#000'; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(W / 2, H * .45, Math.max(.1, r), 0, Math.PI * 2, true); ctx.fill(); }); }
  }
  shots([[0, intro]]);
})();
