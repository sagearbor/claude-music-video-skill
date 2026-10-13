// c04_chorus2.js: chorus 2, 76.83–96.38 s, the STAGE again, escalated at dusk (WORLD.LOOK.stage2).
// One continuous camera path. Hits (beat grid + onset scan of 76.5–97 s):
//   drop 76.83 (Fz lands, bump + flash) · Nah! ×3 at bt(120.5) 77.18, bt(121.5) 77.82, bt(122.5) 78.45 → Clawd's NEW gold doors burst
//   cage / grave / pill on bt(124) 79.41, bt(125) 80.05, bt(126) 80.69 → the whole crowd dodges in unison
//   big perc hits 79.75 81.03 82.58 83.23 85.79 86.11 90.15 90.57 93.45 95.38 → brick fireworks
//   Nah! ×3 again at bt(136.5) 87.39, bt(137.5) 88.03, bt(138.5) 88.67 → Clawd's ZOO / DOOM / BLISS cards blow away
//   prophecy scroll unrolls 88.8, TEARS on the 90.15 hit ("here comes the plot twist"), crowd spins on 90.57
//   "got a pen, got a plan, got seeds in the pack" 91.2–94.2: pencil up, plan, seed packets arc into Pip's backpack
//   "you wrote us off? so we write back!" 94.2–96.4: every raised pencil, finale fireworks, camera lifts into F2.
(() => {
  const T0 = 76.83, T1 = 96.38, NAH1 = [bt(120.5), bt(121.5), bt(122.5)], NAH2 = [bt(136.5), bt(137.5), bt(138.5)];
  const THROWS = [{ make: () => { const g = new THREE.Group(), c = cage(); c.scale.setScalar(.45); c.position.y = -1.5; g.add(c); return g; }, at: bt(124) },
    { make: () => gravestone(), at: bt(125) }, { make: () => pill(), at: bt(126) }];
  const TEAR = 90.15;
  const FIREWORKS = [[76.83, -6, 20, '#ff5a8a'], [77.18, -16, 17, '#ffd23a'], [77.82, 2, 21, '#5ad8ff'], [78.45, 14, 18, '#ff7a3a'], [79.75, -10, 22, '#b28aff'],
    [81.03, 10, 19, '#7aff8a'], [82.58, -14, 21, '#ff5a8a'], [83.23, 6, 23, '#ffd23a'], [85.79, -4, 22, '#5ad8ff'], [86.11, 12, 20, '#ff5a8a'],
    [87.39, -12, 18, '#ffd23a'], [88.03, 0, 21, '#ff7a3a'], [88.67, 12, 19, '#5ad8ff'], [90.15, -8, 22, '#ffffff'], [90.57, 8, 22, '#ffd23a'],
    [93.45, -2, 22, '#7aff8a'], [94.73, -14, 19, '#ff5a8a'], [95.38, 0, 24, '#ffd23a'], [95.38, 14, 21, '#5ad8ff']];
  const N_CROWD = 18;
  // crowd places on the stage platform (x -14..14, z -8..4) behind Pip
  const CROWD = Array.from({ length: N_CROWD }, (_, i) => {
    const row = i < 6 ? 0 : i < 12 ? 1 : 2, k = i % 6, x = (k - 2.5) * 4.4 + (row % 2) * 2.2;
    return { x, z: [-2.6, -5.0, -7.4][row], move: ['bounce', 'floss', 'disco', 'dab', 'runningMan', 'robot', 'clap', 'headbang', 'sprinkler'][(i * 5) % 9] };
  });

  // ---------- local helpers ----------
  // brick fireworks: one burst = 36 glowing round plates flying out, falling, shrinking (pure function of t since the burst)
  const BURST_N = 36, LIFE = 1.6;
  function fireworks(t) {
    FIREWORKS.forEach(([tb, x, y, col], j) => {
      const u = t - tb; if (u < 0 || u > LIFE) return;
      const g = keep('c04fw' + j, () => { const im = new THREE.InstancedMesh(partGeo('6141'), glowMat(col, 3), BURST_N); im.frustumCulled = false; const gg = new THREE.Group(); gg.add(im); gg.userData.im = im; return gg; });
      const im = g.userData.im, M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), k = easeOut(u / .55), s = (1 - u / LIFE) * 2.6;
      for (let i = 0; i < BURST_N; i++) {
        const a = hash(i + j * 50) * Math.PI * 2, b = Math.acos(2 * hash(i * 3 + j * 7 + 1) - 1), r = 12 * k;
        const p = new THREE.Vector3(Math.sin(b) * Math.cos(a) * r, Math.cos(b) * r - 4 * u * u, Math.sin(b) * Math.sin(a) * r * .6);
        M.compose(p, q.setFromEuler(e.set(u * 7 + i, u * 5, 0)), new THREE.Vector3(s, s, s)); im.setMatrixAt(i, M);
      }
      im.instanceMatrix.needsUpdate = true; put(g, x, y, -16);
    });
  }
  // Clawd's escalated offer: three NEW gold-framed doors (they burst on the first Nah! set)
  const NEWDOORS = [{ x: -11, col: '#c8a24a', label: 'ZOO' }, { x: -2, col: '#8a2a3a', label: 'DOOM' }, { x: 7, col: '#f0a8c8', label: 'BLISS' }];
  // a backpack (receives the seed packets), held in the left hand
  const backpack = () => keep('c04pack', () => { const g = new THREE.Group(), b = build([['3003', '#c86a2a', 0, 0, 0], ['3003', '#c86a2a', 0, 1.2, 0], ['3022', '#8a4a1a', 0, 1.6, 0]]); b.scale.setScalar(.55); b.position.set(0, -1.6, .1); g.add(b);
    const strap = new THREE.Mesh(new THREE.TorusGeometry(.5, .08, 6, 16, Math.PI), plastic('#5a3a1a')); strap.position.set(0, -.2, .1); g.add(strap); return g; });
  const SEEDS = [91.54, 92.18, 92.82, 93.46];   // a packet flies into the pack on each beat
  const seedPacket = i => keep('c04seed' + i, () => { const m = new THREE.Mesh(new THREE.BoxGeometry(.9, 1.2, .12), new THREE.MeshStandardMaterial({ map: signTexture(['SEEDS'], { bg: ['#7fd06a', '#f2cd37', '#ff9a6a', '#9fc3e9'][i], size: 120, pw: 256, ph: 340 }), roughness: .6 })); m.castShadow = true; const g = new THREE.Group(); g.add(m); return g; });
  const card = (label, col) => sign('c04card' + label, [label + '?'], { w: 5, h: 3.2, bg: col, fg: '#fff', size: 170 });

  // ---------- the stage extras for this chapter (the stage set itself belongs to c02) ----------
  district('stage-c04', { at: [0, 0], r: 90 }, t => {
    if (t < T0 - 2.5 || t > T1 + 1.5) return;
    // the stadium scoreboard (egg): P(DOOM) drops a notch on every "Nah!" the crowd shouts
    const nahs = [...NAH1, ...NAH2].filter(h => t >= h).length, v = 42 - nahs * 6 - (t > TEAR ? 4 : 0);
    put(sign('c04pdoom' + v, ['P(DOOM)', v + '%'], { w: 9, h: 5.6, bg: '#101418', fg: '#ff8a3a', font: 'ui-monospace, monospace', size: 210, post: true, postH: 8, glow: true }), 17, 0, -13, -.3);
    // two light towers flanking the stage, lamps pulsing on the beat
    for (const sx of [-1, 1]) {
      put(keep('c04tower' + sx, () => { const l = []; for (let r = 1; r <= 12; r++) l.push(['3005', COL.dkgrey, 0, r * 1.2, 0]); return build(l); }), sx * 19, 0, -4);
      const lamp = keep('c04lamp' + sx, () => { const m = new THREE.Mesh(new THREE.CylinderGeometry(.9, .6, 1.2, 16), glowMat('#fff2c0', 2).clone()); const g = new THREE.Group(); g.add(m); return g; });
      lamp.children[0].material.emissiveIntensity = 1.5 + 2 * pulse(t, 5); put(lamp, sx * 19, 15.2, -4);
    }
    fireworks(t);
  });

  // ---------- the shot ----------
  function chorus2(t, lt) {
    const q = t;   // smooth 24 fps acting
    // Clawd's new gold doors: they rise on the drop, burst on the three Nah!s
    NEWDOORS.forEach((d, i) => {
      const hit = NAH1[i]; if (t > hit + 1.2) return;
      const u = doorUnit(d.col, COL.gold); doorPose(u, t < hit ? .1 * pulse(t, 4) : 0, t < hit ? 0 : seg(t, hit, hit + 1.1), i + 7);
      const rise = easeOut(seg(t, T0 - .3, T0 + .25)); put(u, d.x, .8 - 9 * (1 - rise), -6.5);
      if (t < hit) put(sign('c04door' + d.label, [d.label], { w: 3.2, h: 1.1, bg: COL.gold, fg: '#3a2a10', size: 110 }), d.x + 2, .8 + 8.6 - 9 * (1 - rise), -6.3);
    });
    // Pip, front and centre
    const P = fig('pip', PIP), pp = { face: 'determined' }, px = 0, pz = 3.0;
    let pry = 0;
    NAH1.forEach((h, i) => { const k = seg(q, h - .2, h + .04) * (1 - seg(q, h + .2, h + .4)); if (q > h - .25 && q < h + .4) { pry = (NEWDOORS[i].x + 2 - px) * .05; Object.assign(pp, { legR: 1.3 * k, armL: .7 * k, armR: -.4 * k, lean: -.15 * k, face: 'angry' }); } });
    if (q >= 78.75 && q < 81.38) Object.assign(pp, dodge(q), { face: 'shocked' });
    if (q >= 81.38 && q < 84.02) Object.assign(pp, dance('bounce', t), { armR: 1.55, holdR: heldHandset(), face: beatPh(t) < .5 ? 'sing' : 'joy' });
    if (q >= 84.02 && q < 86.97) Object.assign(pp, writeBack(q, 85.79), { holdR: heldPencil(), face: q > 85.79 ? 'joy' : 'determined' });
    if (q >= 86.97 && q < 91.2) { Object.assign(pp, dance('disco', t), { face: q > TEAR ? 'laugh' : 'smug' }); NAH2.forEach(h => { if (q > h - .1 && q < h + .3) Object.assign(pp, { armR: 2.3, armRz: .6, face: 'angry' }); }); if (q > 90.57) Object.assign(pp, dance('spin', t, { offset: -.5 })); }
    if (q >= 91.2 && q < 94.23) {
      const pen = q < 91.9, plan = q >= 91.9 && q < 92.4;
      Object.assign(pp, { face: 'determined', armR: pen ? 2.5 : plan ? 1.3 : .9 + .4 * pulse(t, 6), holdR: pen ? heldPencil() : null, armL: 1.0, holdL: backpack(), head: plan ? .3 : -.2 });
      if (q > 93.46) Object.assign(pp, { face: 'joy', armL: 2.6, armLz: .2 });   // swings the full pack up
    }
    if (q >= 94.23) Object.assign(pp, writeBack(q, 95.38), { holdR: heldPencil(), holdL: backpack(), armL: .5, face: 'laugh' });
    pose(P, pp); if (P.userData.J.earPencil) P.userData.J.earPencil.visible = pp.holdR !== heldPencil();
    put(P, px, .8, pz, pry);
    // the plan: a blueprint sheet Pip flashes at "got a plan"
    if (q >= 91.9 && q < 92.5) { const bp = keep('c04plan', () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.6), new THREE.MeshStandardMaterial({ map: signTexture(['THE PLAN:', '1. build', '2. plant', '3. write'], { bg: '#2a5ab8', fg: '#e8f2ff', size: 90, pw: 512, ph: 380, font: 'ui-monospace, monospace' }), side: THREE.DoubleSide })); g.add(m); return g; });
      put(bp, px - 2.0, 3.6 + .15 * Math.sin(q * 6), pz + 1.2, .25); }
    // seed packets arc from the crowd into the backpack on the beats
    SEEDS.forEach((ts, i) => { const k = seg(t, ts - .45, ts); if (k <= 0 || k >= 1) return;
      const a = [(i % 2 ? 6 : -6), 4, -3], b = [px - .9, 3.1, pz + .6], s = seedPacket(i), y = lerp(a[1], b[1], k) + 3 * Math.sin(Math.PI * k);
      put(s, lerp(a[0], b[0], k), y, lerp(a[2], b[2], k), k * 9); s.rotation.x = k * 6; });
    // the crowd: 18 dancers, different moves; dodge in unison; pencils up on "write back"
    CROWD.forEach((c, i) => {
      const f = fig('c04crowd' + i, crowdLook(i + 2)), rise = backOut(seg(q, T0 - .1 + (i % 6) * .06, T0 + .35 + (i % 6) * .06));
      let p = { ...crowdDance(i, t, [c.move]) };
      if (q >= 78.75 && q < 81.38) p = { ...p, ...dodge(q + (i % 3) * .03), face: 'shocked' };
      if ((q >= 84.02 && q < 86.97) || q >= 94.23) p = { ...p, ...writeBack(q + (i % 4) * .04, q < 90 ? 85.79 : 95.38), holdR: heldPencil('c04c' + i), face: 'joy' };
      [...NAH1, ...NAH2].forEach(h => { if (q > h - .05 && q < h + .25) p = { ...p, armR: 2.6, armRz: .4, armL: 2.6, armLz: .4, bodyY: .4, face: 'angry' }; });
      if (q > 90.57 && q < 91.2) p = { ...p, ...dance('spin', t, { offset: -.5 }) };
      p.bodyY = (p.bodyY || 0) - 5 * (1 - rise);
      pose(f, p); put(f, c.x, .8, c.z, -c.x * .03);
    });
    // throws (cage, gravestone, pill) sail over the crowd's heads into the backdrop
    THROWS.forEach((th, i) => { const o = keep('c04throw' + i, th.make), k = seg(t, th.at - .7, th.at + .6); if (k <= 0 || k >= 1) return;
      put(o, lerp(18, -8 + i * 6, k), lerp(5, 3, k) + 7 * Math.sin(k * Math.PI), lerp(20, -26, k), k * 6, .6); o.rotation.x = k * 7; });
    // Clawd: offer cards on the second Nah! set, then the prophecy scroll that tears
    if (q >= 84.5) {
      const C = clawd('c', {}), k = ease(seg(q, 84.5, 85.6)), torn = q > TEAR, sh = torn ? shake(t, .35 * Math.exp(-(t - TEAR) * 5)) : [0, 0, 0];
      clawdPose(C, { face: torn ? 'shocked' : q > 89.5 ? 'fear' : q > 86.97 ? 'smug' : 'neutral', hat: 'headset', armL: .9, armR: .9, walk: k < 1 ? q * 3 : null, bob: .2 * pulse(t, 6), roll: sh[0] * .06 });
      const cx = lerp(18, 9.5, k); put(C, cx + sh[0], .8, -1.5, -.5);
      // the three offer cards held up in turn; each blows away on its Nah!
      if (q >= 86.6 && q < 89.6) [['ZOO', '#3a9c98'], ['DOOM', '#8a2a3a'], ['BLISS', '#e86aa0']].forEach(([lab, col], i) => {
        const h = NAH2[i], up = ease(seg(q, h - .55, h - .3)), gone = seg(t, h, h + .9); if (up <= 0 || gone >= 1) return;
        const cd = card(lab, col); put(cd, cx - 3.4 + gone * (6 + i * 3), .8 + 5.4 * up + gone * 9, .6 + gone * 4, -.45 + gone * 5); cd.rotation.z = gone * 4;
      });
      // the prophecy scroll: unrolls 88.8, tears in two on the 90.15 hit, halves fly and tumble
      if (q >= 88.6) {
        const un = ease(seg(q, 88.8, 89.4));
        if (!torn) { const s = keep('c04scroll', () => new THREE.Mesh(scroll(1, 3.4, 5), PAPER())); s.geometry.dispose(); s.geometry = scroll(.05 + .95 * un, 4.4, 6.2); s.castShadow = true; put(s, cx - 3.6, .8 + 6.0, .4, -.55);
          if (q > 88.8) put(sign('c04proph', ['PROPHECY'], { w: 4.2, h: .9, bg: '#F6EED8', size: 110 }), cx - 3.6, .8 + 9.6, .45, -.55); }
        else for (const sd of [-1, 1]) { const u = t - TEAR; if (u > 2.2) continue;
          const h = keep('c04half' + sd, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 6.2), PAPER()); m.position.x = sd * 1.1; m.castShadow = true; g.add(m); return g; });
          put(h, cx - 3.6 + sd * (1 + 5 * u), .8 + 6.0 + 3 * u - 4 * u * u, .4 + 2 * u, -.6 + sd * u * 3); h.rotation.z = sd * u * 2.5; h.rotation.x = u * 1.5; }
      }
    }
    // ---------- camera: one continuous path, Fz.B → … → F2.A at 95.60 ----------
    const B = WORLD.F.Fz.B, A = WORLD.F.F2.A;
    const posK = [[76.83, B.pos], [78.75, [-9, 5.5, 22]], [80.4, [10, 4.2, 19]], [82.6, [3, 3.2, 15]], [84.6, [-3, 3.6, 15]], [86.3, [0, 8, 30]], [87.8, [5, 5.5, 22]],
      [89.4, [6, 5.5, 20]], [90.45, [8, 6.2, 22]], [91.2, [2, 4.6, 14]], [93.4, [-2, 4.4, 13]], [94.9, [-.5, 10, 26]], [95.6, A.pos]];
    const lookK = [[76.83, B.look], [78.75, [-2, 4, -4]], [80.4, [0, 4, -2]], [82.6, [0, 4.6, 1]], [84.6, [0, 4.6, 0]], [86.3, [0, 10, -8]], [87.8, [5, 6, -1]],
      [89.4, [4.5, 6.4, 0]], [90.45, [5.2, 6.8, 0]], [91.2, [-.5, 4.4, 3]], [93.4, [-.5, 4, 3]], [94.9, [0, 7.4, 0]], [95.6, A.look]];
    const fovK = [[76.83, B.fov], [80.4, 36], [82.6, 32], [86.3, 44], [87.8, 36], [89.4, 34], [90.45, 38], [91.2, 30], [95.6, A.fov]];
    // easeEnds:false keeps every key on its beat (the default end-easing shifts interior keys by up to ~.8 s on a 19 s path)
    const NE = { easeEnds: false }; let pos = path(t, posK, NE), lk = path(t, lookK, NE), fov = path(t, fovK, NE);
    const d = drift(lt, .5 * seg(t, T0, T0 + 1) * (1 - seg(t, 95.0, 95.6))), land = WORLD.landing(t, T0);
    let hs = [0, 0, 0];
    for (const h of [...NAH1, ...NAH2, TEAR, 85.79, 95.38]) if (t > h && t < h + .6) { const s = shake(t, .28 * Math.exp(-(t - h) * 8)); hs = hs.map((v, j) => v + s[j]); }
    pos = pos.map((v, j) => v + d[j] + land.shake[j] + hs[j]); lk = lk.map((v, j) => v + (land.shake[j] + hs[j]) * .3);
    cam({ pos, look: lk, fov, blur: .8, focus: [px, 4, pz] });
    look({ ...WORLD.LOOK.stage2 });
    if (t >= WORLD.F.F2.t0) { WORLD.apply(WORLD.flight('F2', t)); cam({ blur: .4 }); }
    if (land.flash > 0) hud(ctx => { ctx.fillStyle = `rgba(255,255,255,${land.flash})`; ctx.fillRect(0, 0, W, H); });
  }
  // the unison dodge: lean back, duck, side-step on the three throws
  function dodge(q) {
    const o = {};
    THROWS.forEach((th, i) => { const k = ease(seg(q, th.at - .25, th.at)) * (1 - ease(seg(q, th.at + .3, th.at + .55)));
      if (k <= 0) return; if (i === 0) Object.assign(o, { lean: -.55 * k, armL: 1.2 * k, armR: 1.2 * k, bodyY: -.3 * k });
      if (i === 1) Object.assign(o, { bodyY: -1.3 * k, legL: 1.3 * k, legR: 1.3 * k, lean: .35 * k }); if (i === 2) Object.assign(o, { bodyRoll: .45 * k, armL: 2.2 * k }); });
    return o;
  }
  // "so we WRITE BACK": pencils thrust up on the hit, then scribble in the air
  function writeBack(q, hit) { const up = ease(seg(q, hit - .3, hit)); return { armR: lerp(1.0, 2.8, up) + (q > hit ? .25 * Math.sin(q * 18) : 0), armRz: q > hit ? .15 * Math.sin(q * 14) : 0, armL: .4, bodyY: .3 * up * pulse(q, 5) }; }

  shots([[T0, chorus2]]);
})();
