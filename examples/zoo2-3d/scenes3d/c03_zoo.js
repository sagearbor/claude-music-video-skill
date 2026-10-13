// c03_zoo.js: verse 1, the night zoo, 35.66–76.83 s (district 'zoo').
// Clawd is the keeper (cap + lantern); Pip lives in a cozy glass pen with a colour-cycling mood lamp.
// One continuous camera path: F1 lands at 37.10 (WORLD.F.F1.B), the path ends on WORLD.F.Fz.A at Fz.t0, then the Fz glide.
// One idea per lyric line (times from src/lyrics.js):
//   35.66 keeper strolls in · 37.58 Pip paces · 40.29 plaque "HUMANS" · 43.01 gift shop of plush Pips S/M/L
//   45.88 field trip of tiny Clawds · 48.43 "does it have a tail?" · 51.14 Pip taps Morse · 53.54 reply "?"
//   55.93 panda costume · 58.56 swipe left · 61.20 gilded cage lowered · 63.59 five-star sign → exit 0★
//   65.98 treat on offer, Pip unimpressed · 68.38 plaque → "SANCTUARY" · 71.09 Pip taps the glass with the pencil: it bursts
//   73.32 Clawd presses its face to the empty frame, everyone laughs, camera pulls up and away
(() => {
  const Z = (dx = 0, dy = 0, dz = 0) => WORLD.at('zoo', dx, dy, dz);
  const XZ = (dx, dz) => { const p = Z(dx, 0, dz); return [p[0], p[2]]; };
  const T0 = 35.66, BLOW = bt(113);            // the glass bursts on the beat at "...the glass" (72.39 s)
  const GLASS_Z = 3.2, PEN_W = 18;

  // ---------- the set (built once) ----------
  const r2 = (x, z) => (Math.abs(x + z) / 2) % 2 ? COL.red : COL.white;
  const penBuild = () => {
    const l = [], wall = '#7a5a3a', trim = '#c9a86a';
    for (let r = 1; r <= 6; r++) {
      for (let x = -9; x <= 9; x++) l.push(['3005', r % 2 ? wall : '#6a4c30', x, r * 1.2, -7]);
      for (let z = -6; z <= 2; z++) for (const x of [-9, 9]) l.push(['3005', r % 2 ? wall : '#6a4c30', x, r * 1.2, z]);
    }
    for (let x = -9; x <= 9; x++) l.push(['3024', trim, x, 7.6, -7]);
    for (let x = -8; x <= 8; x += 2) for (let z = -6; z <= 2; z += 2) l.push(['3068b', '#8fae6a', x, .4, z]);
    for (let x = -9; x <= 9; x++) l.push(['3024', trim, x, 8.0, GLASS_Z]);                       // the glass frame top
    for (let r = 1; r <= 6; r++) for (const x of [-9.5, 9.5]) l.push(['3005', trim, x, r * 1.2, GLASS_Z]);
    l.push(['3020', COL.pink, -5, .8, -4.5, 0], ['3020', COL.pink, -5, 1.2, -4.5, 0], ['3022', COL.white, -6, 1.6, -4.5, 0]);   // cozy bed
    l.push(['3958', '#c66a6a', 2, .45, -2, 0]);                                                                               // rug
    l.push(['3062b', COL.brown, 7, 1.2, -5.5], ['30176', COL.green, 7, 1.6, -5.5, 0]);                                         // potted plant
    return build(l);
  };
  const glassMesh = () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.BoxGeometry(PEN_W, 7.2, .25), plastic('#cfeeff', { transparent: true, opacity: .2, roughness: .03, depthWrite: false }));
    m.position.y = 4.3; g.add(m);
    for (let i = 0; i < 3; i++) { const s = new THREE.Mesh(new THREE.PlaneGeometry(.35, 4.5), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .25, depthWrite: false })); s.position.set(-5 + i * 4.5, 4.6, .14); s.rotation.z = -.35; g.add(s); }
    return g; };
  const lamp = () => { const g = new THREE.Group(); g.add(build([['3062b', COL.dkgrey, 0, 1.2, 0], ['3062b', COL.dkgrey, 0, 2.4, 0], ['3062b', COL.dkgrey, 0, 3.6, 0]]));
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.7, 20, 14), new THREE.MeshStandardMaterial({ color: '#ffd27a', emissive: '#ffd27a', emissiveIntensity: 2.2 })); bulb.position.y = 4.4; g.add(bulb);
    const L = new THREE.PointLight('#ffd27a', 40, 22, 1.6); L.position.y = 4.4; g.add(L); g.userData = { bulb, L }; return g; };
  const lantern = () => { const g = new THREE.Group(); const box = new THREE.Mesh(new THREE.BoxGeometry(.8, 1.1, .8), new THREE.MeshStandardMaterial({ color: '#ffe6a6', emissive: '#ffc766', emissiveIntensity: 2.5 }));
    box.position.y = -.4; g.add(box); const cap = new THREE.Mesh(new THREE.BoxGeometry(1, .2, 1), plastic(COL.black)); cap.position.y = .2; g.add(cap);
    const L = new THREE.PointLight('#ffc766', 30, 18, 1.6); L.position.y = -.4; g.add(L); return g; };
  const shop = () => { const l = [];
    for (let r = 1; r <= 3; r++) for (let x = -3; x <= 3; x++) l.push(['3005', COL.white, x, r * 1.2, 2]);               // counter
    for (let x = -3; x <= 3; x += 2) l.push(['3022', COL.red, x + .5, 4.0, 2]);
    for (let r = 1; r <= 7; r++) for (const x of [-4, 4]) l.push(['3005', COL.red, x, r * 1.2, -1]);                     // posts
    for (let x = -4; x <= 4; x += 2) for (let z = -2; z <= 2; z += 2) l.push(['3022', r2(x, z), x, 8.8, z]);              // striped awning
    for (let x = -3; x <= 3; x++) l.push(['3024', COL.tan, x, 4.4, -1], ['3024', COL.tan, x, 2.0, -1]);                  // shelves
    return build(l); };
  const gate = () => { const l = []; for (let r = 1; r <= 7; r++) for (const x of [-5, 5]) l.push(['3003', '#7a5a3a', x, r * 1.2, 0]);
    for (let x = -6; x <= 6; x += 2) l.push(['3020', '#5a3a22', x, 8.8, 0, Math.PI / 2]); return build(l); };
  const rail = () => { const l = []; for (let x = -10; x <= 10; x += 2) l.push(['3005', '#5a3a22', x, 1.2, 0]); for (let x = -9; x <= 9; x += 4) l.push(['3010', '#7a5a3a', x, 1.6, 0, 0]); return build(l); };
  const SH = 46;   // glass shards for the burst
  const shardsMesh = () => { const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1.1, 1.1, .12), plastic('#d8f2ff', { transparent: true, opacity: .5, roughness: .02, depthWrite: false }), SH); im.frustumCulled = false; const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; };

  district('zoo', { at: WORLD.D.zoo, r: 70 }, t => {
    put(keep('zoo-ground', () => { const l = []; for (let i = 0; i < 9; i++) for (let j = 0; j < 7; j++) l.push(['3958', (i + j) % 3 ? '#3f6b3a' : '#467a40', (i - 4) * 6, 0, (j - 3) * 6]); return build(l); }), ...Z(0, .02, 4));
    put(keep('zoo-path', () => { const l = []; for (let x = -24; x <= 24; x += 2) for (let z = 7; z <= 11; z += 2) l.push(['3068b', '#b9a88a', x, .02, z]); return build(l); }), ...Z(0, .4, 0));
    put(keep('zoo-pen', penBuild), ...Z(0, .4, 0));
    put(keep('zoo-rail', rail), ...Z(0, .4, 6.2));
    put(keep('zoo-shop', shop), ...Z(19, .4, 1));
    put(sign('zoo-shop-sign', ['GIFT SHOP'], { w: 7, h: 1.4, bg: '#fff3d6', size: 120 }), ...Z(19, 9.6, 3.6));
    put(keep('zoo-gate', gate), ...Z(-17, .4, 15), .5);
    put(sign('zoo-gate-sign', ['THE HUMAN ZOO'], { w: 10, h: 1.6, bg: '#2b3a2a', fg: '#ffe6a6', size: 110 }), ...Z(-17 + Math.sin(.5) * .6, 9.2, 15 + Math.cos(.5) * .6), .5);
    EGGS.captcha('zoo', t, ...XZ(-25, 12), .7);
    EGGS.parrot('zoo', t, ...XZ(-15, -3), .6);
    put(sign('zoo-parrot-sign', ['STOCHASTIC PARROT', '(feeds on internet)'], { w: 5, h: 1.6, size: 52, post: true, postH: 1.2 }), ...Z(-15, 0, .2), .6);
    for (const [k, x, z] of [[0, -28, -10], [1, -26, 4], [2, 28, -12], [3, 30, 8], [4, -6, -16], [5, 10, -18], [6, 24, 18]]) put(tree('zt' + k, k % 2 ? COL.dkgreen : '#1f5a30'), ...Z(x, 0, z), k);
    for (let i = 0; i < 4; i++) { const p = keep('zoo-post' + i, () => { const g = new THREE.Group(); g.add(build([['3062b', COL.black, 0, 1.2, 0], ['3062b', COL.black, 0, 2.4, 0], ['3062b', COL.black, 0, 3.6, 0], ['3062b', COL.black, 0, 4.8, 0]]));
      const b = new THREE.Mesh(new THREE.SphereGeometry(.5, 14, 10), glowMat('#ffe6a6', 2.4)); b.position.y = 5.6; g.add(b); return g; }); put(p, ...Z(-21 + i * 14, .4, 18)); }
    // background life: visitors strolling the path, a robot sweeping
    for (let i = 0; i < 2; i++) passerby('zooVisL', i, t, [XZ(-30, 9.4), XZ(-13, 9.4), XZ(-13, 11), XZ(-30, 11)], 1.3);   // visitors stroll the side paths,
    for (let i = 0; i < 2; i++) passerby('zooVisR', i, t, [XZ(13, 9.4), XZ(30, 9.4), XZ(30, 11), XZ(13, 11)], 1.3);    // never in front of the pen
    const sw = keep('zoo-sweeper', robot), k = .5 - .5 * Math.cos(t * .45);
    robotPose(sw, { walk: t * 2, carry: false }); put(sw, ...Z(-26 + k * 10, .4, 16), Math.sin(t * .45) > 0 ? Math.PI / 2 : -Math.PI / 2);
  });

  // ---------- the camera: one continuous path through the chapter (zoo-local keys) ----------
  const CAM = [[37.10, [0, 6, 26], [0, 4, 0]], [39.6, [-6, 5.5, 18], [0, 3.8, -1]], [42.0, [1.2, 6.4, 9.6], [0, 6.4, GLASS_Z]], [44.3, [13, 6.5, 15], [19, 5, 1]],
    [46.9, [2, 6.5, 21], [-3, 3, 7.5]], [49.8, [-2, 4.6, 14], [0, 3.8, 2]], [52.3, [3.5, 5.2, 10.5], [0, 5, GLASS_Z]], [54.7, [-5, 6.5, 14], [0, 6, 3]],
    [57.2, [-2, 5.2, 14], [-1, 4, 0]], [59.9, [-5, 5.4, 15], [2, 5, 2]], [62.4, [-2, 13, 20], [0, 4.5, -1]], [64.8, [-7, 6.5, 16], [0, 7.4, 0]],
    [67.2, [-7, 5, 15.5], [2, 4.2, 3]], [69.7, [-4, 5.6, 15], [0, 5.8, 0]], [72.2, [-1, 4.8, 14], [0, 4.2, 2]]];
  const camAt = t => {
    const Fz = WORLD.F.Fz, A = Fz.A, keysP = CAM.map(([kt, p]) => [kt, Z(...p)]), keysL = CAM.map(([kt, , l]) => [kt, Z(...l)]);
    keysP.push([Fz.t0, A.pos]); keysL.push([Fz.t0, A.look]);
    // easeEnds: false — keys are hit ON their times (the eased mode warps time across the whole span)
    const o = { easeEnds: false };
    return { pos: path(t, keysP, o), look: path(t, keysL, o), fov: path(t, [[37.10, [34]], [42.0, [30]], [62.4, [38]], [72.2, [32]], [Fz.t0, [A.fov]]], o)[0] };
  };

  // ---------- the shot ----------
  function zoo(t) {
    look({ ...WORLD.LOOK.zoo });
    if (t < WORLD.F.F1.t1) WORLD.apply(WORLD.flight('F1', t));
    else if (t >= WORLD.F.Fz.t0) WORLD.apply(WORLD.flight('Fz', t));
    else {
      const c = camAt(t), d = drift(t - 37.1, .5), u = t - BLOW, s = u >= 0 && u < .6 ? shake(t, .5 * Math.exp(-u * 8)) : [0, 0, 0];
      cam({ pos: [c.pos[0] + d[0] + s[0], c.pos[1] + d[1] + s[1], c.pos[2] + d[2] + s[2]], look: c.look, fov: c.fov, blur: .7 });
      if (u >= 0 && u < .2) hud(ctx => { ctx.fillStyle = `rgba(230,250,255,${.55 * (1 - u / .2)})`; ctx.fillRect(0, 0, W, H); });
    }

    // the glass (until the burst), the shards (after)
    if (t < BLOW) put(keep('zoo-glass', glassMesh), ...Z(0, .4, GLASS_Z));
    else { const u = t - BLOW, g = keep('zoo-shards', shardsMesh), im = g.userData.im, M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
      for (let i = 0; i < SH; i++) { const x0 = (hash(i) - .5) * 17, y0 = 1 + hash(i + 1) * 6.5, vx = x0 * .6 + (hash(i + 2) - .5) * 4, vz = 6 + hash(i + 3) * 8, vy = 3 + hash(i + 4) * 5;
        const y = Math.max(.3, y0 + vy * u - 9 * u * u), x = x0 + vx * Math.min(u, 1.2), z = vz * Math.min(u, .9);
        M.compose(new THREE.Vector3(x, y, z), q.setFromEuler(e.set(u * 7 * hash(i + 5), u * 5, u * 3)), new THREE.Vector3(1, 1, 1)); im.setMatrixAt(i, M); }
      im.instanceMatrix.needsUpdate = true; put(g, ...Z(0, .4, GLASS_Z)); }


    // the mood lamp: cycles colours slowly, pulses on the beat
    const lp = keep('zoo-lamp', lamp), col = new THREE.Color().setHSL(frac(t * .05), .65, .62);
    lp.userData.bulb.material.color.copy(col); lp.userData.bulb.material.emissive.copy(col); lp.userData.bulb.material.emissiveIntensity = 1.8 + .6 * pulse(t, 4);
    lp.userData.L.color.copy(col); put(lp, ...Z(-7.5, .4, 0));

    // ---------- continuity helpers (rules 9–13): positions from ONE plan, poses blended across lyric segments ----------
    const segPose = (SEGS, t, d = .25) => { let i = 0; while (i + 1 < SEGS.length && t >= SEGS[i + 1][0]) i++;
      const cur = SEGS[i][1](t); if (i > 0 && t - SEGS[i][0] < d) return blend(SEGS[i - 1][1](t), cur, ease((t - SEGS[i][0]) / d)); return cur; };
    const smoothRy = (rawRy, t, w = .3) => { let sx = 0, sz = 0; for (let k = 0; k <= 6; k++) { const r = rawRy(t - w * k / 6); sx += Math.sin(r); sz += Math.cos(r); } return Math.atan2(sx, sz); };
    const growS = (t, a, b, d = .25) => backOut(seg(t, a, a + d)) * (1 - ease(seg(t, b - d, b)));      // signs grow in / shrink out
    const PUFFS = [55.96, 58.58];                                                                     // costume swaps happen inside these

    // ---------- Pip: one position plan for the whole chapter ----------
    const PIPPLAN = [[35.66, [2, -1]], [37.6, [2, -1]], [38.6, [-4, -1]], [39.7, [4, -1]], [40.6, [0, 0]], [43.0, [0, 0]], [43.6, [3, 0]], [45.9, [3, 0]], [46.5, [0, 0]],
      [51.1, [0, 0]], [51.7, [1, GLASS_Z - 1.2]], [56.3, [1, GLASS_Z - 1.2]], [56.9, [-1, 0]], [58.75, [-1, 0]], [59.55, [1, 0]], [60.7, [1, 0]], [61.25, [0, -1]],
      [66.25, [0, -1]], [66.8, [1, 0]], [68.4, [1, 0]], [69.0, [-1, 0]], [71.1, [-1, 0]], [71.8, [0, GLASS_Z - 1.2]], [77, [0, GLASS_Z - 1.2]]];
    const pipFace = t => t < 37.58 ? .25 : t >= 43.6 && t < 45.9 ? .9 : 0;
    const pipStep = tt => stepTo(tt, PIPPLAN, { face: pipFace(tt) });
    const ps = pipStep(t), pry = smoothRy(tt => pipStep(tt).ry, t);
    const tapK = t => Math.exp(-frac((t - OFF) / (BEAT / 2)) * 6);
    const PIPSEG = [
      [35.66, () => ({ face: 'determined', head: -.3 })],
      [37.58, () => ({ face: 'suspicious' })],
      [40.29, () => ({ face: 'neutral' })],
      [43.01, () => ({ face: 'smug', armL: .4, armLz: .7, armR: .4, armRz: .7 })],                                  // eyeing the gift shop
      [45.88, () => ({ face: 'suspicious', head: .2 })],
      [48.43, t => { const k = ease(seg(t, 49.3, 49.8)) * (1 - ease(seg(t, 50.6, 51.0))); return { face: k > .5 ? 'smug' : 'shocked', bodyYaw: Math.PI * k, head: -1.2 * k }; }],   // "a tail?"
      [51.14, t => ({ face: 'determined', armR: t > 51.7 ? 1.0 + .25 * tapK(t) : 0, armL: .2 })],                    // taps Morse on the glass
      [53.54, () => ({ face: 'smug', armL: .5, armR: .5, armLz: .6, armRz: .6 })],
      [55.96, t => ({ ...dance('sway', t), face: 'wink', armR: 1.1 })],                                              // panda (inside the puff)
      [58.58, t => { const sw = seg(t, 59.6, 60.1); return { face: sw > .5 ? 'smug' : 'suspicious', armR: 1.3, armRz: lerp(-.9, .9, ease(sw)), head: -.3 * ease(sw) }; }],   // swipe left
      [61.2, t => ({ face: t > 62.3 ? 'determined' : 'suspicious', headTilt: -.2 })],
      [63.59, () => ({ face: 'smug', armL: .5, armLz: .9, armR: .5, armRz: .9 })],                                  // shrug at five stars
      [65.98, () => ({ face: 'smug', armL: 1.3, armR: 1.3, armLz: -.5, armRz: -.5, head: .4 })],                    // arms folded
      [68.38, () => ({ face: 'suspicious', head: .3 })],
      [71.09, t => ({ face: t > BLOW ? 'joy' : 'determined', armR: t < 71.8 ? lerp(0, 1.25, ease(seg(t, 71.1, 71.5))) : t < BLOW ? 1.25 : lerp(1.25, 2.6, ease(seg(t, BLOW + .15, BLOW + .5))), lean: -.1 * ease(seg(t, BLOW - .5, BLOW)) })],
      [73.32, t => ({ ...dance('bounce', t), face: 'laugh', armR: 2.6 })],
    ];
    // gait weight = how fast Pip is actually moving (0 standing → 1 walking): limbs ease in and out of the walk, no snap
    const gaitW = (step, tt) => { const a = step(tt), b = step(tt - 1 / 24); return clamp(Math.hypot(a.x - b.x, a.z - b.z) * 24 / 2.2); };
    const withGait = (base, st0, w) => w > .001 && Object.keys(st0.pose).length ? blend(base, { ...base, ...st0.pose, face: base.face, holdR: base.holdR, holdL: base.holdL }, w) : base;
    let pp = withGait(segPose(PIPSEG, t), ps, gaitW(pipStep, t));
    const panda = t >= PUFFS[0] && t < PUFFS[1];
    const P = panda ? fig('pip-panda', { torso: COL.white, arms: COL.black, legs: COL.black, hands: COL.black, faceId: 'pip', hat: null }) : fig('pip', PIP);
    if (panda) { const ears = keep('zoo-ears', () => { const g = new THREE.Group(); for (const sd of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.32, 14, 10), plastic(COL.black)); e.position.set(sd * .5, .2, 0); g.add(e); } return g; });
      if (ears.parent !== P.userData.J.head) P.userData.J.head.add(ears);
      pp.holdR = keep('zoo-bamboo', () => { const g = new THREE.Group(), bb = part('30176', COL.green); bb.position.y = -.6; g.add(bb); return g; }); }
    // the pencil: one object, from behind the ear (70.5) into the hand (70.85), held to the end of the chapter
    const pen = keep('zoo-pen', () => { const g = new THREE.Group(), pc = pencil(.42); pc.position.y = -.55; g.add(pc); return g; });
    if (P.userData.J.earPencil) P.userData.J.earPencil.visible = t < 70.5;
    if (t >= 70.85) pp.holdR = pen;
    pose(P, pp); put(P, ...Z(ps.x, .4, ps.z), pry);
    if (t >= 70.5 && t < 70.85) { P.updateWorldMatrix(true, true); const ear = P.userData.J.earPencil.getWorldPosition(new THREE.Vector3()).toArray(), hand = limb(P, 'handR');
      const q = handoff(t, 70.5, 70.85, ear, hand, .3); put(pen, ...q, pry); pen.rotation.set(0, pry, 0); }
    // contacts: the Morse taps and the pencil tap really reach the glass
    const glassZ = Z(0, 0, GLASS_Z - .14)[2];
    if (t > 51.8 && t < 53.5 && tapK(t) > .85) { const h = limb(P, 'handR'); expect('pip taps the glass (Morse)', h, [h[0], h[1], glassZ], .6); }
    if (Math.abs(t - BLOW) < .05) { const h = limb(P, 'handR'); expect('pip taps the glass with the pencil', h, [h[0], h[1], glassZ], .6); }

    // the costume puffs: cotton-wool balls burst around Pip; the swap happens at their fullest
    for (const tc of PUFFS) { const u = t - tc; if (u < -.28 || u > .4) continue;
      const pf = keep('zoo-puff' + tc, () => { const im = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 14, 10), plastic('#f7f3ee', { roughness: .95, clearcoat: 0 }), 48); im.frustumCulled = false; const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; });
      const sz = u < 0 ? easeOut((u + .28) / .28) : 1 - ease(u / .4), M = new THREE.Matrix4(), q = new THREE.Quaternion(), im = pf.userData.im;
      for (let i = 0; i < 48; i++) { const a = hash(i) * Math.PI * 2, r = (.6 + hash(i + 1) * 1.1) * (1 + .4 * Math.max(0, u)), y = .6 + hash(i + 2) * 4.6 + Math.max(0, u) * 2;
        M.compose(new THREE.Vector3(Math.sin(a) * r, y, Math.cos(a) * r * .8), q, new THREE.Vector3().setScalar((.75 + .4 * hash(i + 3)) * sz)); im.setMatrixAt(i, M); }
      im.instanceMatrix.needsUpdate = true; put(pf, ...Z(ps.x, .4, ps.z)); }

    // ---------- Clawd the keeper: one position plan ----------
    const CPLAN = [[35.66, [16, 6.8]], [37.4, [7.5, 6.8]], [43.0, [7.5, 6.8]], [43.45, [14.5, 4.4]], [43.75, [15.2, -.8]], [44.1, [19, -.8]], [45.9, [19, -.8]],
      [46.25, [15.2, -.8]], [46.55, [14.5, 4.4]], [47.1, [10, 8]], [51.2, [10, 8]], [51.8, [7.5, 6.8]], [61.2, [7.5, 6.8]], [61.6, [6, 6.8]], [63.6, [6, 6.8]],
      [64.0, [7.5, 6.8]], [65.98, [7.5, 6.8]], [66.5, [3.5, 6.4]], [68.4, [3.5, 6.4]], [68.9, [7.5, 6.8]], [73.4, [7.5, 6.8]], [74.0, [1.5, GLASS_Z + 1.05]], [77, [1.5, GLASS_Z + 1.05]]];
    const cFace = t => t >= 44.1 && t < 45.9 ? 0 : t >= 74.0 ? Math.PI : -.6;
    const cStep = tt => stepTo(tt, CPLAN, { face: cFace(tt) }), cs = cStep(t), cry = smoothRy(tt => cStep(tt).ry, t), cMoving = Object.keys(cs.pose).length > 0;
    const CSEG = [
      [35.66, () => ({ face: 'smug' })], [37.58, t => ({ face: 'sleepy', bob: .1 * Math.sin(t * 2), lean: .1 })], [40.29, () => ({ face: 'smug', armL: .6 })],
      [43.01, t => ({ face: 'joy', armL: .7 + .3 * Math.sin(t * 6), bob: .15 * pulse(t, 5) })], [45.88, () => ({ face: 'joy' })],
      [51.14, () => ({ face: 'suspicious', lean: .1 })], [53.54, t => ({ face: 'dizzy', roll: .05 * Math.sin(t * 4) })], [55.93, t => ({ face: 'joy', armL: .9, armR: .9, bob: .2 * pulse(t, 5) })],
      [58.56, t => ({ face: t > 60.1 ? 'shocked' : 'joy' })], [61.2, () => ({ face: 'smug', armL: 1, armR: 1 })], [63.59, () => ({ face: 'smug', armL: .8 })],
      [65.98, () => ({ face: 'neutral', armL: 1.0 })], [68.38, () => ({ face: 'smug' })],
      [71.09, t => ({ face: t > BLOW ? 'shocked' : 'neutral', armL: t > BLOW ? 1 : 0, armR: t > BLOW ? 1 : .5 })],
      [73.32, t => { const k = ease(seg(t, 73.9, 74.2)); return { face: 'fear', armL: .3, lean: .35 * k, squash: .25 * k * (.6 + .4 * Math.sin(t * 9)) }; }],
    ];
    const C = clawd('keeper', {}), lan = keep('zoo-lantern', lantern);
    const cp = { armR: .5, ...segPose(CSEG, t), hat: 'keeper', holdR: lan, walk: cMoving ? t * 2.6 : null };
    // the treat: grows out of Clawd's hand when offered, shrinks away when Pip ignores it
    const treat = keep('zoo-treat', () => { const g = new THREE.Group(), pl = pill('#E8AA38', '#F4E2B8'); pl.scale.setScalar(.6); g.add(pl); return g; });
    const ts = growS(t, 66.5, 68.3); if (ts > .01) { treat.scale.setScalar(ts); cp.holdL = treat; }
    clawdPose(C, cp); put(C, ...Z(cs.x, .4, cs.z), cry);
    if (t >= 74.0 && t < 74.5) expect('clawd presses its face to the glass frame', [Z(cs.x, 0, cs.z)[0], 0, Z(cs.x, 0, cs.z)[2] - 1.0], [Z(cs.x, 0, cs.z)[0], 0, glassZ], .6);

    // ---------- props per line ----------
    // gift shop: plush Pips small / medium / large with price tags (they sit on the counter the whole time; only the camera visits)
    [[.42, -2.5, 'S'], [.62, 0, 'M'], [.85, 2.6, 'L']].forEach(([sc, x, tag], i) => {
      const pl = fig('plush' + i, PIP); pose(pl, { face: 'joy', armL: .4, armR: .4, armLz: .3, armRz: .3 }); put(pl, ...Z(19 + x, 4.4, 2.2), 0, sc);
      put(sign('zoo-tag' + tag, [tag], { w: .9, h: .8, size: 300, bg: '#fff' }), ...Z(19 + x, 2.6, 2.9)); });
    const buyer = keep('zoo-buyer', robot); robotPose(buyer, { walk: 0, carry: false }); put(buyer, ...Z(16, .4, 6.5), Math.PI * .85);
    // the field trip: six tiny Clawds walk in from off-screen left, wait at the rail, then walk on (exit right, off-screen)
    if (t >= 45.0 && t < 54.5) {
      for (let i = 0; i < 6; i++) { const tc = clawd('tiny' + i, {}), plan = [[45.88 + i * .12, [-30, 7.8 + (i % 2) * .7]], [47.2 + i * .12, [-6 + i * 2.2, 7.8 + (i % 2) * .7]], [51.6, [-6 + i * 2.2, 7.8 + (i % 2) * .7]], [54.4, [30 + i * 2.2, 7.8 + (i % 2) * .7]]];
        const st2 = stepTo(t, plan, { face: Math.PI }), mv = Object.keys(st2.pose).length > 0, point = i === 2 ? ease(seg(t, 48.43, 48.7)) * (1 - ease(seg(t, 51.0, 51.3))) : 0;
        clawdPose(tc, { face: point > .5 ? 'shocked' : 'joy', hat: null, walk: mv ? t * 3 + i : null, bob: mv ? 0 : .3 * pulse(t + i * .1, 6), armR: point });
        put(tc, ...Z(st2.x, .4, st2.z), smoothRy(tt => stepTo(tt, plan, { face: Math.PI }).ry, t), .32); }
      const tplan = [[45.88, [-34, 10.5]], [47.6, [-9, 10.5]], [51.6, [-9, 10.5]], [54.4, [26, 10.5]]], ts2 = stepTo(t, tplan, { face: Math.PI }), teacher = keep('zoo-teacher', robot);
      robotPose(teacher, { walk: Object.keys(ts2.pose).length ? t * 2 : 0, carry: false }); put(teacher, ...Z(ts2.x, .4, ts2.z), smoothRy(tt => stepTo(tt, tplan, { face: Math.PI }).ry, t));
      const sT = growS(t, 48.43, 51.14); if (sT > .01) put(sign('zoo-tail', ['TAIL?'], { w: 1.8, h: .9, size: 200, bg: '#fff' }), ...Z(-2.6, 4.6 + .1 * Math.sin(t * 8), 7.4), 0, sT);
    }
    // Morse on the glass: dash-dot  dash-dash-dash, one mark per tap; they fade out before the panda puff; the keeper's reply "?"
    if (t >= 51.7 && t < 55.9) {
      const marks = [2, 1, 0, 2, 2, 2], n = clamp(Math.floor((t - 51.8) / (BEAT / 2)) + 1, 0, marks.length), fade = 1 - ease(seg(t, 55.4, 55.85));
      let x = -3.4; for (let i = 0; i < n; i++) { const w = marks[i] === 2 ? 1.3 : .45, grow = easeOut(seg(t, 51.8 + i * BEAT / 2, 51.8 + i * BEAT / 2 + .12)) * fade;
        if (marks[i]) { const m = keep('zoo-morse' + i, () => { const g = new THREE.Group(), bx = new THREE.Mesh(new THREE.BoxGeometry(1, .38, .1), glowMat('#bff6ff', 2.2)); g.add(bx); g.userData.b = bx; return g; });
          m.userData.b.scale.set(w * Math.max(.01, grow), Math.max(.01, grow), 1); put(m, ...Z(x + w / 2, 6.2, GLASS_Z + .18)); } x += (marks[i] ? w : .3) + .35; }
    }
    { const sq = growS(t, 53.9, 56.0); if (sq > .01) put(sign('zoo-q', ['?'], { w: 1.6, h: 1.6, size: 400, bg: '#fff' }), ...Z(7.5, 8.4 + .15 * Math.sin(t * 5), 7.5), 0, sq); }
    // the swipe-left card: slides in from off-screen right, then swipes away off-screen left; NOPE grows in
    if (t >= 58.56 && t < 61.2) {
      const kin = easeOut(seg(t, 58.6, 59.1)), kout = easeIn(seg(t, 59.7, 60.3)), card = sign('zoo-card', ['BREEDING', 'PROGRAM ♥', 'match?'], { w: 3.4, h: 4.2, size: 110, bg: '#ffe0ec', fg: '#a0204a' });
      put(card, ...Z(lerp(24, 4.5, kin) - 30 * kout, 5.2 + 2 * kout, 5.5), -.3 + kout * .9);
    }
    { const sn = growS(t, 60.1, 61.3); if (sn > .01) put(sign('zoo-nope', ['NOPE'], { w: 3, h: 1.2, size: 200, bg: '#e8403a', fg: '#fff' }), ...Z(-1, 8, 4.5), 0, sn); }
    // the gilded cage: drops from above onto Pip's actual spot on the beat, lifts off again after the five-star joke
    if (t >= 61.2 && t < 66.4) {
      const cg = keep('zoo-gcage', () => { const g = new THREE.Group(), c = cage(COL.gold); c.scale.setScalar(.75); g.add(c); return g; });
      const down = backOut(seg(t, 61.6, 62.3)), up = easeIn(seg(t, 65.5, 66.2)), pos = Z(0, .4 + 22 * (1 - down) + 22 * up, -1);
      put(cg, ...pos);
      if (t >= 62.3 && t < 62.6) { const pf = Z(ps.x, .4, ps.z); expect('gilded cage lands around Pip', pos, pf, .6); }
    }
    // five-star sign → flips edge-on to "EXIT: 0 ★" (the swap happens at 90°, invisible)
    if (t >= 63.59 && t < 66.0) { const sc = growS(t, 63.59, 66.0), flip = ease(seg(t, 64.55, 65.05)), exit = flip >= .5, ang = exit ? (1 - flip) * Math.PI / 2 * 2 - 0 : flip * Math.PI;
      const sg = sign(exit ? 'zoo-exit' : 'zoo-5star', exit ? ['EXIT: 0 ★'] : ['★★★★★', 'HABITAT'], { w: 6, h: 2.2, size: 120, bg: exit ? '#2a1a1a' : '#fff6d0', fg: exit ? '#ff5a4a' : '#8a6a10', glow: exit });
      put(sg, ...Z(0, 9.0 + .1 * Math.sin(t * 6), 1), exit ? -(1 - flip) * Math.PI : flip * Math.PI, sc); }
    { const sg2 = growS(t, 66.6, 68.4); if (sg2 > .01) put(sign('zoo-good', ['GOOD HUMAN?'], { w: 4.2, h: 1.2, size: 110, bg: '#fff' }), ...Z(4, 6.6, 6.5), 0, sg2); }
    // the plaque flips (like a split-flap) from HUMANS to SANCTUARY at 68.38; the swap happens edge-on
    if (t < BLOW) { const fl = ease(seg(t, 68.2, 68.6)), back = fl >= .5, plq = sign(back ? 'zoo-plq2' : 'zoo-plq1', back ? ['SANCTUARY', '(it\'s a cell)'] : ['HUMANS', 'formerly in charge'], { w: 5.2, h: 1.7, bg: '#c99a4a', fg: '#3a2a10', size: 80, edge: '#8a6a2a' });
      put(plq, ...Z(0, 6.5, GLASS_Z + .2)); plq.rotation.set(back ? (fl - 1) * Math.PI : fl * Math.PI, 0, 0); }
    // laugh last: zoo visitors walk up to the rail and laugh along
    if (t >= 72.6) for (let i = 0; i < 5; i++) { const f = fig('zoo-laugh' + i, crowdLook(i + 2)), plan = [[72.6 + i * .1, [i < 2 ? -30 : 30, 10.6]], [73.6 + i * .1, [-8 + i * 3.6, 10.2]]], s3 = stepTo(t, plan, { face: Math.PI * .02 * (i - 2) });
      const st3 = tt => stepTo(tt, plan, { face: Math.PI * .02 * (i - 2) }), w3 = gaitW(st3, t), base3 = { ...dance(i % 2 ? 'clap' : 'bounce', t, { offset: i * .3 }), face: w3 > .5 ? 'joy' : 'laugh' };
      pose(f, blend(base3, { ...base3, ...s3.pose }, Object.keys(s3.pose).length ? w3 : 0));
      put(f, ...Z(s3.x, .4, s3.z), smoothRy(tt => stepTo(tt, plan, { face: Math.PI * .02 * (i - 2) }).ry, t)); }
  }

  shots([[T0, t => zoo(t)]]);
})();
