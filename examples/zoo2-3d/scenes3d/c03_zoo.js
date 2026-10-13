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

    // the plaque on the glass: HUMANS → SANCTUARY
    if (t < BLOW) { const sanct = t >= 68.38;
      put(sign(sanct ? 'zoo-plq2' : 'zoo-plq1', sanct ? ['SANCTUARY', '(it\'s a cell)'] : ['HUMANS', 'formerly in charge'], { w: 5.2, h: 1.7, bg: '#c99a4a', fg: '#3a2a10', size: 80, edge: '#8a6a2a' }), ...Z(0, 6.5, GLASS_Z + .2)); }

    // the mood lamp: cycles colours slowly, pulses on the beat
    const lp = keep('zoo-lamp', lamp), col = new THREE.Color().setHSL(frac(t * .05), .65, .62);
    lp.userData.bulb.material.color.copy(col); lp.userData.bulb.material.emissive.copy(col); lp.userData.bulb.material.emissiveIntensity = 1.8 + .6 * pulse(t, 4);
    lp.userData.L.color.copy(col); put(lp, ...Z(-7.5, .4, 0));

    // ---------- Pip ----------
    const panda = t >= 55.93 && t < 58.56;
    const P = panda ? fig('pip-panda', { torso: COL.white, arms: COL.black, legs: COL.black, hands: COL.black, faceId: 'pip', hat: null }) : fig('pip', PIP);
    if (P.userData.J.earPencil) P.userData.J.earPencil.visible = !(t >= 70.4 && t < 74.0);   // the pencil comes out to tap the glass
    if (panda) { const ears = keep('zoo-ears', () => { const g = new THREE.Group(); for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.32, 14, 10), plastic(COL.black)); e.position.set(s * .5, .2, 0); g.add(e); } return g; });
      if (ears.parent !== P.userData.J.head) P.userData.J.head.add(ears); ears.visible = true; }
    let p = { face: 'determined' }, px = 0, pz = -1, pry = 0;
    if (t < 37.58) { p = { face: 'determined', head: -.3 }; px = 2; pry = .25; }
    else if (t < 40.29) { const ph = (t - 37.58) / 1.35, dir = Math.floor(ph) % 2 ? -1 : 1, k = ease(frac(ph)); px = dir > 0 ? lerp(-4, 4, k) : lerp(4, -4, k); pry = dir * Math.PI / 2; p = { ...walk(t * 1.6), face: 'suspicious' }; }
    else if (t < 43.01) { p = { face: 'neutral' }; px = 0; pz = 0; }
    else if (t < 45.88) { p = { face: 'smug', armL: .4, armLz: .7, armR: .4, armRz: .7 }; px = 3; pry = .9; }             // eyeing the gift shop
    else if (t < 48.43) { p = { face: 'suspicious', head: .2 }; px = 0; pz = 0; }
    else if (t < 51.14) { const k = ease(seg(t, 49.3, 49.8)) * (1 - ease(seg(t, 50.6, 51.0))); p = { face: k > .5 ? 'smug' : 'shocked', bodyYaw: Math.PI * k, head: -1.2 * k }; px = 0; pz = 0; }   // spins round: "a tail?"
    else if (t < 53.54) { const tap = Math.exp(-frac((t - OFF) / (BEAT / 2)) * 6); p = { face: 'determined', armR: 1.25 + .25 * tap, armL: .2 }; px = 1; pz = GLASS_Z - 1.6; }
    else if (t < 55.93) { p = { face: 'smug', armL: .5, armR: .5, armLz: .6, armRz: .6 }; px = 1; pz = GLASS_Z - 1.6; }
    else if (panda) { p = { ...dance('sway', t), face: 'wink', armR: 1.1, holdR: keep('zoo-bamboo', () => { const g = new THREE.Group(), b = part('30176', COL.green); b.position.y = -.6; g.add(b); return g; }) }; px = -1; pz = 0; }
    else if (t < 61.2) { const sw = seg(t, 59.6, 60.1); p = { face: sw > .5 ? 'smug' : 'suspicious', armR: 1.3, armRz: lerp(-.9, .9, ease(sw)), head: -.3 * ease(sw) }; px = 1; pz = 0; }
    else if (t < 63.59) { p = { face: t > 62.3 ? 'determined' : 'suspicious', headTilt: -.2 }; px = 0; pz = -1; }
    else if (t < 65.98) { p = { face: 'smug', armL: .5, armLz: .9, armR: .5, armRz: .9 }; px = 0; pz = -1; }      // shrugs at the five-star sign
    else if (t < 68.38) { p = { face: 'smug', armL: 1.3, armR: 1.3, armLz: -.5, armRz: -.5, head: .4 }; px = 1; pz = 0; }   // arms folded, ignores the treat
    else if (t < 71.09) { p = { face: 'suspicious', head: .3 }; px = -1; pz = 0; }
    else if (t < 73.32) { const k = ease(seg(t, BLOW - .5, BLOW)), after = t > BLOW; p = { face: after ? 'joy' : 'determined', armR: after ? 2.6 : 1.1 + .5 * k, holdR: t >= 70.4 && t < 74.0 ? heldPencil('zoo') : null, lean: -.1 * k }; px = 0; pz = GLASS_Z - 1.4; }
    else { p = { ...dance('bounce', t), face: 'laugh' }; px = 0; pz = 1; }
    pose(P, p); put(P, ...Z(px, .4, pz), pry);

    // ---------- Clawd the keeper ----------
    const C = clawd('keeper', {}), lan = keep('zoo-lantern', lantern);
    let c = { face: 'smug', hat: 'keeper', armR: .5, holdR: lan }, cx = 7.5, cz = 6.8, cry = -.6;
    if (t < 37.58) { const k = ease(seg(t, 35.66, 37.4)); cx = lerp(16, 7.5, k); c = { ...c, walk: k < 1 ? t * 2 : null, face: k < 1 ? 'smug' : 'suspicious' }; cry = k < 1 ? -Math.PI / 2 : -.4; }
    else if (t < 40.29) c = { ...c, face: 'sleepy', bob: .1 * Math.sin(t * 2), lean: .1 };
    else if (t < 43.01) { c = { ...c, face: 'smug', armL: .6 }; }
    else if (t < 45.88) { cx = 19; cz = -.8; cry = 0; c = { ...c, face: 'joy', armL: .7 + .3 * Math.sin(t * 6), bob: .15 * pulse(t, 5) }; }   // the shopkeeper too
    else if (t < 51.14) { cx = 10; cz = 8; c = { ...c, face: 'joy' }; }
    else if (t < 53.54) { c = { ...c, face: 'suspicious', lean: .1 }; }
    else if (t < 55.93) { c = { ...c, face: 'dizzy', roll: .05 * Math.sin(t * 4) }; }
    else if (t < 58.56) { c = { ...c, face: 'joy', armL: .9, armR: .9, bob: .2 * pulse(t, 5) }; }
    else if (t < 61.2) { c = { ...c, face: t > 60.1 ? 'shocked' : 'joy' }; }
    else if (t < 63.59) { cx = 6; c = { ...c, face: 'smug', armL: 1, armR: 1 }; }
    else if (t < 65.98) { c = { ...c, face: 'smug', armL: .8 }; }
    else if (t < 68.38) { cx = 3.5; cz = 6.2; c = { ...c, face: 'neutral', armL: 1.0, holdL: keep('zoo-treat', () => { const g = new THREE.Group(), pl = pill('#E8AA38', '#F4E2B8'); pl.scale.setScalar(.6); g.add(pl); return g; }) }; }
    else if (t < 71.09) { c = { ...c, face: 'smug' }; }
    else if (t < 73.32) { c = { ...c, face: t > BLOW ? 'shocked' : 'neutral', armL: t > BLOW ? 1 : 0, armR: t > BLOW ? 1 : .5 }; }
    else { const k = ease(seg(t, 73.4, 74.0)); cx = lerp(7.5, 1.5, k); cz = lerp(6.8, GLASS_Z + 1.6, k); c = { ...c, face: 'fear', lean: .35 * k, squash: .25 * k * (.6 + .4 * Math.sin(t * 9)) }; cry = lerp(-.6, 0, k); }
    clawdPose(C, c); put(C, ...Z(cx, .4, cz), cry);

    // ---------- props per line ----------
    // gift shop: plush Pips small / medium / large with price tags
    if (t >= 42.0 && t < 47.0) {
      [[.42, -2.5, 'S'], [.62, 0, 'M'], [.85, 2.6, 'L']].forEach(([s, x, tag], i) => {
        const pl = fig('plush' + i, PIP); pose(pl, { face: 'joy', armL: .4, armR: .4, armLz: .3, armRz: .3 }); put(pl, ...Z(19 + x, 4.4, 2.2), 0, s);
        put(sign('zoo-tag' + tag, [tag], { w: .9, h: .8, size: 300, bg: '#fff' }), ...Z(19 + x, 2.6, 2.9)); });
      const buyer = keep('zoo-buyer', robot); robotPose(buyer, { walk: 0, carry: false }); put(buyer, ...Z(16, .4, 6.5), Math.PI * .85);
    }
    // the field trip: six tiny Clawds march to the rail; a robot teacher; the "TAIL?" bubble
    if (t >= 45.0 && t < 52.0) {
      for (let i = 0; i < 6; i++) { const k = ease(seg(t, 45.88 + i * .12, 47.2 + i * .12)), tc = clawd('tiny' + i, {});
        clawdPose(tc, { face: i === 2 && t > 48.43 ? 'shocked' : 'joy', hat: null, walk: k < 1 ? t * 3 + i : null, bob: k >= 1 ? .3 * pulse(t + i * .1, 6) : 0, armR: i === 2 && t > 48.43 ? 1 : 0 });
        put(tc, ...Z(lerp(-16, -6 + i * 2.2, k), .4, 7.8 + (i % 2) * .7), k < 1 ? Math.PI / 2 : Math.PI, .32); }
      const teacher = keep('zoo-teacher', robot); robotPose(teacher, { walk: t * 2, carry: false }); put(teacher, ...Z(lerp(-18, -9, ease(seg(t, 45.88, 47.6))), .4, 10.5), Math.PI / 2);
      if (t > 48.43 && t < 51.14) put(sign('zoo-tail', ['TAIL?'], { w: 1.8, h: .9, size: 200, bg: '#fff' }), ...Z(-2.6, 4.6 + .1 * Math.sin(t * 8), 7.4));
    }
    // Morse on the glass: dash-dot  dash-dash-dash, one mark per half-beat tap; the keeper's reply "?"
    if (t >= 51.14 && t < 58.56) {
      const marks = [2, 1, 0, 2, 2, 2], n = clamp(Math.floor((t - 51.3) / (BEAT / 2)) + 1, 0, marks.length);
      let x = -3.4; for (let i = 0; i < n; i++) { const w = marks[i] === 2 ? 1.3 : .45; if (marks[i]) { const m = keep('zoo-morse' + i, () => { const g = new THREE.Group(), b = new THREE.Mesh(new THREE.BoxGeometry(1, .38, .1), glowMat('#bff6ff', 2.2)); g.add(b); g.userData.b = b; return g; });
        m.userData.b.scale.set(w, 1, 1); put(m, ...Z(x + w / 2, 6.2, GLASS_Z + .18)); } x += (marks[i] ? w : .3) + .35; }
      if (t >= 53.9 && t < 56.0) put(sign('zoo-q', ['?'], { w: 1.6, h: 1.6, size: 400, bg: '#fff' }), ...Z(6, 8.4 + .15 * Math.sin(t * 5), 8));
    }
    // the swipe-left card: slides in, then swipes away to the left
    if (t >= 58.56 && t < 61.2) {
      const kin = easeOut(seg(t, 58.6, 59.1)), kout = easeIn(seg(t, 59.7, 60.3)), card = sign('zoo-card', ['BREEDING', 'PROGRAM ♥', 'match?'], { w: 3.4, h: 4.2, size: 110, bg: '#ffe0ec', fg: '#a0204a' });
      put(card, ...Z(lerp(14, 4.5, kin) - 14 * kout, 5.2 + 2 * kout, 5.5), -.3 + kout * .9);
      if (t > 60.1) put(sign('zoo-nope', ['NOPE'], { w: 3, h: 1.2, size: 200, bg: '#e8403a', fg: '#fff' }), ...Z(-1, 8, 4.5), 0);
    }
    // the gilded cage: lowered over Pip on the beat, lifted again after the five-star joke
    if (t >= 61.2 && t < 66.2) {
      const cg = keep('zoo-gcage', () => { const g = new THREE.Group(), c = cage(COL.gold); c.scale.setScalar(.75); g.add(c); return g; });
      const down = backOut(seg(t, 61.6, 62.3)), up = easeIn(seg(t, 65.5, 66.2)); put(cg, ...Z(0, .4 + 16 * (1 - down) + 16 * up, -1));
    }
    if (t >= 63.59 && t < 65.98) { const exit = t > 64.8;
      put(sign(exit ? 'zoo-exit' : 'zoo-5star', exit ? ['EXIT: 0 ★'] : ['★★★★★', 'HABITAT'], { w: 6, h: 2.2, size: 120, bg: exit ? '#2a1a1a' : '#fff6d0', fg: exit ? '#ff5a4a' : '#8a6a10', glow: exit }), ...Z(0, 9.0 + .1 * Math.sin(t * 6), 1)); }
    if (t >= 66.3 && t < 68.38) put(sign('zoo-good', ['GOOD HUMAN?'], { w: 4.2, h: 1.2, size: 110, bg: '#fff' }), ...Z(4, 6.6, 6.5));
    // laugh last: the zoo visitors gather at the rail and laugh along
    if (t >= 73.32) for (let i = 0; i < 5; i++) { const f = fig('zoo-laugh' + i, crowdLook(i + 2)); pose(f, { ...dance(i % 2 ? 'clap' : 'bounce', t, { offset: i * .3 }), face: 'laugh' }); put(f, ...Z(-8 + i * 3.6, .4, 10.2), Math.PI * .02 * (i - 2)); }
  }

  shots([[T0, t => zoo(t)]]);
})();
