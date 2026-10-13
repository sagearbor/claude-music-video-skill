// c02_chorus1.js: chorus 1 drop, 25.69–35.66 (the engine bake-off shot, Three.js version).
// One continuous camera move through the STAGE district (world origin). Hits from the onset scan:
//   Nah! ×3 at bt(40.5) 26.12, bt(41.5) 26.76, bt(42.5) 27.39 → doors burst
//   cage / grave / pill hurled on bt(44) 28.35, bt(45) 28.99, bt(46) 29.63 → Pip dodges each
//   crowd pops up on beats 48–51; scribble 33.6–34.6; scroll → paper birds on the 34.73 hit.
const STAGE = [0, 0];
const DOORS = [{ x: -9, col: '#9C7A5C', hit: bt(40.5), inside: '#FFD27A' }, { x: -2, col: '#6B3B4A', hit: bt(41.5), inside: '#FF7A3A' }, { x: 5, col: '#E7A6C0', hit: bt(42.5), inside: '#FFE3EE' }];
const THROWS = [{ make: () => { const g = new THREE.Group(), c = cage(); c.scale.setScalar(.45); c.position.y = -1.5; g.add(c); return g; }, at: bt(44), dodge: 'lean' }, { make: () => gravestone(), at: bt(45), dodge: 'duck' }, { make: () => pill(), at: bt(46), dodge: 'side' }];
const BURST = 34.73;

// ---------- the stage district: ground, sky, buildings going up, a field, passers-by ----------
district('stage', { at: STAGE, r: 90 }, t => {


  put(studGround('stage', '#8fc06a', 12), 0, 0, -10);
  // the stage: a raised platform of white tiles with a lilac trim
  put(keep('platform', () => { const l = []; for (let x = -14; x <= 14; x += 2) for (let z = -8; z <= 4; z += 2) l.push(['3068b', z === 4 || Math.abs(x) === 14 ? COL.lilac : COL.white, x, .8, z, 0]);
    for (let x = -14; x <= 14; x += 2) for (const z of [-8, 4]) l.push(['3003', COL.lilac, x, .4, z, 0]); return build(l); }));
  // background: robots raising buildings (they grow over the WHOLE song), a sower, trees, a strolling crowd
  buildSite('stageA', { at: [-26, -34], w: 6, d: 4, floors: 10, col: COL.red, t0: 0, t1: 220 }, t);
  buildSite('stageB', { at: [22, -40], w: 8, d: 4, floors: 14, col: COL.blue, t0: 10, t1: 240 }, t);
  buildSite('stageC', { at: [-4, -62], w: 10, d: 6, floors: 18, col: COL.tan, t0: 0, t1: 260, robots: 3 }, t);
  field('stage', { at: [38, -16], rows: 5, len: 16, t0: 20, t1: 120, look: 4 }, t);
  for (const [k, x, z] of [[0, -36, -12], [1, -40, -22], [2, 30, -60], [3, 44, -40], [4, -18, -48], [5, 14, -20]]) put(tree('t' + k, k % 2 ? COL.green : COL.dkgreen), x, 0, z, k);
  for (let i = 0; i < 4; i++) passerby('stage', i, t, [[-30, -18], [30, -18], [30, -24], [-30, -24]]);
});

// the kick assertion: on the hit frame, Pip's right toe must be on the door panel
function EXPECT_KICK(P, t, H, target) { H.forEach((h, i) => { if (Math.abs(t - h) <= .5 / 24) expect('pip kicks door ' + (i + 1), limb(P, 'footR'), target(DOORS[i]), .7); }); }

// ---------- shot ----------
function chorus1(t, lt) {
  const q = t;                                       // smooth 24 fps (stepping on twos made fast moves judder)
  // Doors (they stay blown off after their hit)
  DOORS.forEach((d, i) => {
    const u = keep('c02door' + i, () => doorUnit(d.col)); const before = t < d.hit;
    const ajar = before ? .12 * ease(seg(q, d.hit - .45, d.hit - .1)) : 0, burst = before ? 0 : seg(t, d.hit, d.hit + .9);
    doorPose(u, ajar, burst, i + 1); put(u, d.x, .8, -6);
    const glow = keep('doorglow' + i, () => { const m = new THREE.Mesh(new THREE.PlaneGeometry(4, 7.1), glowMat(d.inside, 1.6)); return m; });
    put(glow, d.x + 2, .8 + 3.6, -6.3);
  });
  // Pip: ONE continuous run along the door row (the Nah!s are only .64 s apart): he plants at each door, turns, and his right
  // toe lands on the panel exactly on the Nah! (kickPose + expect), then jogs back to centre for the dodges.
  const P = fig('pip', PIP), pp = { face: 'determined', head: 0 };
  const target = d => [d.x + 2, .8 + 1.35, -5.75];                       // the panel's front face, kick height
  const H = DOORS.map(d => d.hit), STAND = DOORS.map(d => [d.x + 2, -5.75 + KICK_REACH]);
  const plan = [[H[0] - .62, [-2, 1]], [H[0] - .1, STAND[0]], [H[0] + .1, STAND[0]], [H[1] - .1, STAND[1]], [H[1] + .1, STAND[1]], [H[2] - .1, STAND[2]], [H[2] + .4, STAND[2]], [H[2] + 1.3, [0, 1]]];
  const pos = stepTo(t, plan, { run: true, face: 0 });
  const near = H.reduce((m, h) => Math.abs(t - h) < Math.abs(t - m) ? h : m, H[0]), kickW = 1 - seg(Math.abs(t - near), .14, .32);
  Object.assign(pp, blend(pos.pose, kickPose(t - near), kickW));
  if (kickW > .5) pp.face = 'angry';
  // face the door while kicking, the direction of travel while running
  const dyaw = Math.atan2(Math.sin(Math.PI - pos.ry), Math.cos(Math.PI - pos.ry)), yaw = pos.ry + dyaw * kickW;
  const px = pos.x, pz = pos.z;
  for (const th of THROWS) {                        // dodges: lean back / duck / side-step, timed to the pass
    const k = ease(seg(t, th.at - .25, th.at)) * (1 - ease(seg(t, th.at + .3, th.at + .55)));
    if (k > 0) { if (th.dodge === 'lean') { pp.lean = -.55 * k; pp.armL = 1.2 * k; pp.armR = 1.2 * k; pp.bodyY = -.3 * k; }
      if (th.dodge === 'duck') { pp.bodyY = -1.4 * k * k; pp.legL = 1.4 * k; pp.legR = 1.4 * k; pp.lean = .35 * k; }   // hips drop only as the legs fold
      if (th.dodge === 'side') { pp.bodyRoll = .45 * k; pp.armL = 2.2 * k; }
      pp.face = 'shocked'; }
  }
  if (t >= 30.2 && t < 32.95) {                     // G: raps into the handset like a mic, bobbing on the beat
    // the handset comes out of the hoodie pocket (grows in at the hip), goes to the ear, and is tucked away at the end
    const b = pulse(t, 5), k = ease(seg(t, 30.2, 30.45)), hs = heldHandset(), g = Math.min(1, seg(t, 30.2, 30.32), 1 - seg(t, 32.8, 32.95));
    hs.scale.setScalar(Math.max(.001, g)); Object.assign(pp, { armR: 1.55 * k, armL: (.6 + .5 * b) * k, bodyY: -.12 * b, headTilt: -.15 * b, face: beatPh(t) < .5 ? 'sing' : 'joy', holdR: hs });
  }
  if (t >= 32.95) {                                  // H: pencil from behind the ear, point DOWN, scribbling on the scroll
    const sc = t > 33.55 && t < BURST ? Math.sin(t * 40) : 0, up = ease(seg(t, 32.95, 33.3));
    // the arm continues from the rap pose (1.55): up to the ear (2.6) for the pencil, then down to the scroll (1.75), no jumps
    const arm = kf(t, [[32.95, 1.55], [33.25, 2.6], [33.55, 1.75]]) + .12 * sc;
    Object.assign(pp, { face: t > BURST ? 'joy' : 'determined', armR: arm, armRz: .12 * sc, head: .5 * ease(seg(t, 32.95, 33.3)), armL: t > BURST ? 2.8 * ease(seg(t, BURST, BURST + .2)) : lerp(.6, 0, ease(seg(t, 32.95, 33.2))),
      holdR: t > 33.2 ? heldPencil('c02', .55, { write: true }) : null, noEarPencil: t > 33.2 });
  }
  pose(P, pp);
  put(P, px, .8, pz, t >= 32.95 ? .9 : yaw);
  EXPECT_KICK(P, t, H, target);
  // throws: each object flies from front-right past Pip into the backdrop
  THROWS.forEach((th, i) => {
    const o = keep('throw' + i, th.make), k = Math.min(1, seg(t, th.at - .7, th.at + .5));   // after landing it lies there as debris
    if (k <= 0) return;
    const a = [16, 5, 18], b = [-2 + i * 2, .8, -20], x = lerp(a[0], b[0], k), z = lerp(a[2], b[2], k), y = lerp(a[1], b[1], k) + 5 * Math.sin(k * Math.PI);
    o.rotation.set(k * 7, k * 5, 0); put(o, x, y, z, k * 6, .55); o.rotation.x = k * 7;
  });
  // the crowd RUNS IN from the wings on beats 48–51 (two per beat), arriving on the beat, then cheers
  for (let i = 0; i < 8; i++) {
    const tb = bt(48 + Math.floor(i / 2)), x = (i % 2 ? 1 : -1) * (3 + Math.floor(i / 2) * 2.4), z = -2.5 - (i % 3), fromX = (i % 2 ? 1 : -1) * 34;   // start well outside the frame
    if (t < tb - 1.1) continue;
    const f = fig('crowd' + i, crowdLook(i)), s2 = stepTo(t, [[tb - 1.1, [fromX, z]], [tb, [x, z]]], { face: -x * .05, run: true }), cheer = t > tb ? ease(seg(t, tb, tb + .25)) : 0;
    pose(f, { ...s2.pose, face: 'joy', armL: cheer * (2.6 + .3 * Math.sin(t * 8 + i)), armR: cheer * (2.6 + .3 * Math.sin(t * 8 + i + 1)), bodyY: (s2.pose.bodyY || 0) + .25 * cheer * pulse(t, 8) });
    put(f, s2.x, .8, s2.z, s2.ry);
  }
  // Clawd slides in with the scroll (H)
  if (q >= 32.6) {
    const C = clawd('c', {}), k = ease(seg(q, 32.6, 33.2)), un = ease(seg(q, 33.0, 33.5)), torn = q > BURST;
    const sh = q < BURST ? [0, 0, 0] : shake(t, .4 * Math.exp(-(t - BURST) * 4));
    clawdPose(C, { face: torn ? 'shocked' : q > 33.6 ? 'fear' : 'smug', hat: 'headset', armL: .9, armR: .9, walk: k < 1 ? q * 3 : null, bob: .2 * pulse(t, 6), roll: sh[0] * .05 });
    put(C, lerp(14, 7.5, k) + sh[0], .8, -1, -.5);
    if (!torn) {
      const s = keep('scroll', () => new THREE.Mesh(scroll(1), PAPER())); s.geometry.dispose(); s.geometry = scroll(.05 + .95 * un); s.castShadow = true;
      put(s, lerp(14, 6.5, k) - 3.2, .8 + 5.6, 1.4, -.9);
    }
  }
  // the scroll bursts into paper birds that climb and scatter toward the camera and the sky
  if (t >= BURST) for (let i = 0; i < 18; i++) {
    const b = keep('bird' + i, paperBird), u = t - BURST, sx = 3.9 + (hash(i) - .5) * 2.4, sy = 5.5 + hash(i + 7) * 3;
    birdPose(b, q * 3 + hash(i)); b.rotation.set(-.3, 0, 0);
    put(b, sx + (hash(i + 3) - .5) * 16 * u, sy + 6 * u + 1.2 * u * u, 1.6 + (hash(i + 5) - .1) * 10 * u, (hash(i + 3) - .5) * 2, .9);
  }
  // ---------- camera: one continuous move, hits shake it ----------
  let hitShake = [0, 0, 0];
  for (const h of [...DOORS.map(d => d.hit), ...THROWS.map(x => x.at), 32.76, 33.04, BURST]) if (t > h) { const s = shake(t, .35 * Math.exp(-(t - h) * 7)); hitShake = hitShake.map((v, j) => v + s[j]); }
  const path = [[25.69, [-2, 6, 28]], [27.6, [-1, 5, 20]], [29.0, [12, 4, 14]], [30.4, [8, 2.4, 11]], [32.95, [1, 4.2, 15]], [34.6, [1.5, 5, 17]], [35.10, [0, 14, 26]]];   // ends on WORLD.F.F1.A
  const lookPath = [[25.69, [-2, 4, -4]], [27.6, [-2, 3.5, -2]], [29.0, [0, 3, 0]], [30.4, [0, 3.6, 0]], [32.95, [2.5, 4.8, 0]], [34.6, [3.2, 6, 0]], [35.10, [3, 14, 0]]];
  const p = kf(t, path), l = kf(t, lookPath), d = drift(lt, .6 * (1 - seg(t, 34.6, 35.1)));
  cam({ pos: [p[0] + d[0] + hitShake[0], p[1] + d[1] + hitShake[1], p[2] + d[2]], look: [l[0] + hitShake[0] * .3, l[1] + hitShake[1] * .3, l[2]], fov: kf(t, [[25.69, 32], [30.4, 38], [32.95, 30], [35.10, 38]]), blur: .9, focus: [px, 4, pz] });
  if (t >= WORLD.F.F1.t0) { WORLD.apply(WORLD.flight('F1', t)); cam({ blur: .4 }); }   // seam: the flight to the zoo
  look({ ...WORLD.LOOK.stage, keyDir: [-.5, 1, .7] });
  // the F0 whip lands on the drop: flash (not a cut; the camera path is continuous)
  const land = WORLD.landing(t, 25.69);
  if (land.flash > 0) hud(ctx => { ctx.fillStyle = `rgba(255,255,255,${land.flash})`; ctx.fillRect(0, 0, W, H); });
}

window.SETS3D = { STAGE, DOORS };   // the doors' world positions/colours, for c00 (closed doors) and the other chorus chapters
shots([[25.69, chorus1]]);
