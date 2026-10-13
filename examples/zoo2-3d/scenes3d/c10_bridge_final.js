// c10_bridge_final.js: 214.94–249.41 s, on the MOON. The climax and the 2D-flatten showcase.
//   Bridge 214.94–222.85: "Who …? (We do!)": on each shout a new neighbour pops up beside Pip with that line's prop, the
//     whole row pumps its arms and the camera punches in. From 219.3 the flat dial ramps 0 → 1 (dolly-zoom to ortho,
//     z-squash to a paper cut-out, toon shading, ink outlines) while the moon light drains to black.
//   222.85–227.47 "So who writes the ending?": black, except a spotlight on the flat Pip; he raises his pencil and the
//     spotlight tightens onto it.
//   227.47 "(WE DO!)": white flash, flat snaps back to 0: full 3D. Final chorus: the three doors get kicked off on the
//     "Nah!"s, cage/grave/pill burst into gold, Pip raps, a giant pencil writes a gold line across the sky, Clawd swaps
//     the headset for a hard hat (the plot twist), the red barn goes up course by course on the beat, Earth hangs in a
//     gold-sunrise sky, the whole crowd dances, confetti and fireworks. Ends rising toward Earth on the F6 flight to the desk.
(() => {
  const M = (dx = 0, dy = 0, dz = 0) => WORLD.at('moon', dx, dy, dz);
  const onPad = (x, z) => Math.abs(x) <= 7 && Math.abs(z) <= 7 ? .42 : 0;   // c09's launch pad (12x12 tiles, top at .42) under centre stage
  const F = (x, z) => M(x, onPad(x, z), z);                                  // a standing spot, feet on the pad or the ground
  const MY = WORLD.MOON_Y, T0 = 214.94, DROP = 227.47, T1 = 249.41;
  const WD = [215.45, 216.72, 218.0, 219.3, 220.55, 221.72];          // the "(We do!)" shouts (onsets, as in the 2D video)
  const NAH = [DROP + .43, DROP + 1.07, DROP + 1.70, 237.61 + .43, 237.61 + 1.07, 237.61 + 1.70];
  const THROW = [230.13, 230.77, 231.41];                              // cage, grave, pill: burst into gold
  const TWIST = 240.8;                                                 // "here comes the plot twist": headset off, hard hat on
  const FLAT_A = 219.3, FLAT_B = 222.0, FLAT_C = 222.25;               // ramp 0→.8 slowly, then .8→1 in .25 s (skips the ghost zone)
  const live = t => t >= T0 - .5 && t < T1 + .5;
  const pumpAt = (t, times) => { let v = 0; for (const p of times) { const k = t - p; if (k > -.09 && k < .7) v = Math.max(v, k < 0 ? (k + .09) / .09 : Math.exp(-k * 5)); } return v; };
  const punchAt = (t, times, k = 7) => times.reduce((s, p) => s + (t >= p ? Math.exp(-(t - p) * k) : 0), 0);
  const flatAt = t => t >= DROP ? 0 : t < FLAT_A ? 0 : t < FLAT_B ? .8 * ease(seg(t, FLAT_A, FLAT_B)) : .8 + .2 * seg(t, FLAT_B, FLAT_C);

  // ---------- props ----------
  const box = (w, h, d, col, o) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), plastic(col, o)); m.castShadow = true; return m; };
  const held = (key, make) => keep('c10held:' + key, () => { const g = new THREE.Group(); g.add(make()); return g; });
  const PROPS = [
    () => held('seeds', () => { const g = new THREE.Group(); const b = box(.9, 1.1, .6, '#6E9F58'); b.position.y = .2; g.add(b); const t = box(.95, .2, .65, '#4A6630'); t.position.y = .8; g.add(t); return g; }),
    () => held('wrench', () => { const g = new THREE.Group(); const h = box(.22, 2.2, .22, COL.silver, { metalness: .7, roughness: .3 }); h.position.y = .6; g.add(h); const j = box(.8, .35, .22, COL.silver, { metalness: .7, roughness: .3 }); j.position.y = 1.7; g.add(j); return g; }),
    () => null,                                                                                            // "knows the neighbours": waves
    () => held('plug', () => { const g = new THREE.Group(); const b = box(.7, .9, .5, COL.red); b.position.y = .3; g.add(b); for (const x of [-.18, .18]) { const p = box(.08, .45, .08, COL.silver, { metalness: .8 }); p.position.set(x, .95, 0); g.add(p); } return g; }),
    () => held('hammer', () => { const g = new THREE.Group(); const h = box(.2, 2, .2, '#7A4526'); h.position.y = .5; g.add(h); const k = box(.9, .4, .4, COL.dkgrey); k.position.y = 1.5; g.add(k); return g; }),
    () => held('floppy', () => { const g = new THREE.Group(); const d = box(1.3, 1.3, .12, '#2D5AA8'); d.position.y = .7; g.add(d); const l = box(.9, .5, .02, '#F4F4F4'); l.position.set(0, .45, .07); g.add(l); const s = box(.6, .35, .02, COL.silver, { metalness: .7 }); s.position.set(.1, 1.15, .07); g.add(s); return g; }),
  ];
  const giantPencil = () => keep('c10-giant-pencil', () => { const g = new THREE.Group(), p = pencil(3.2); p.rotation.z = Math.PI * .75; g.add(p); return g; });
  // the gold line the giant pencil writes across the sky (a tube revealed with drawRange: pure function of t)
  const SKYPATH = (() => { const pts = []; for (let i = 0; i <= 80; i++) { const u = i / 80; pts.push(new THREE.Vector3(lerp(-34, 34, u), 26 + 5 * Math.sin(u * Math.PI * 3) + 3 * Math.sin(u * 17), -22 + 4 * Math.sin(u * 5))); } return new THREE.CatmullRomCurve3(pts); })();
  const goldLine = () => keep('c10-goldline', () => { const m = new THREE.Mesh(new THREE.TubeGeometry(SKYPATH, 240, .45, 8), glowMat('#FFD24A', 1.8)); const g = new THREE.Group(); g.add(m); g.userData.m = m; return g; });
  const sunDisc = () => keep('c10-sun', () => { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16), new THREE.MeshBasicMaterial({ color: '#FFE08A', fog: false }))); return g; });
  const hardHat = () => keep('c10-hardhat', () => { const g = new THREE.Group(); const d = new THREE.Mesh(new THREE.SphereGeometry(1.9, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), plastic(COL.mustard)); d.castShadow = true; g.add(d);
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, .18, 28), plastic(COL.mustard))); return g; });
  const spark = () => keep('c10-spark', () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), new THREE.MeshBasicMaterial({ color: '#FFD24A', transparent: true })); g.add(m); g.userData.m = m; return g; });
  // a pencil gripped point-DOWN in hand space: with the arm raised overhead (armR ≈ 2.95) the hand flips, so it points UP
  const penUp = () => keep('c10-penup', () => { const g = new THREE.Group(), p = pencil(.85); p.rotation.z = Math.PI; p.position.y = 1.21; g.add(p); return g; });
  const doors = i => keep('c10door' + i, () => doorUnit(['#9C7A5C', '#6B3B4A', '#E7A6C0'][i]));


  // the barn: red 1x4-brick walls with a door gap, a white door frame, a stepped red roof. One course per beat after the drop.
  const BARN = [0, -15];
  const barn = () => keep('c10-barn', () => {
    const l = [], W = 16, D = 10, x0 = -W / 2, z0 = -D / 2, beat0 = Math.ceil((DROP - OFF) / BEAT) + 1, tOf = c => OFF + (beat0 + c) * BEAT;
    for (let r = 0; r < 7; r++) {
      const ta = tOf(r), red = r % 2 ? '#B22A1E' : '#C4281C';
      for (let x = 0; x < W; x += 4) for (const z of [z0 + .5, z0 + D - .5]) { if (z > 0 && r < 4 && x === 8) continue; l.push(['3010', red, x0 + x + 2, (r + 1) * 1.2, z, 0, ta + x * .01]); }
      for (let z = 1; z < D - 1; z += 4) for (const x of [x0 + .5, x0 + W - .5]) l.push(['3010', red, x, (r + 1) * 1.2, z0 + z + 2, Math.PI / 2, ta]);
    }
    for (let r = 0; r < 4; r++) for (const x of [x0 + 8.5, x0 + 11.5]) l.push(['3005', COL.white, x, (r + 1) * 1.2, z0 + D - .5, 0, tOf(r)]);
    for (let s = 0; s < 5; s++) for (let x = 0; x < W; x += 2) for (let z = s; z < D - s; z += 2) l.push(['3022', s % 2 ? '#8E1E16' : '#B22A1E', x0 + x + 1, 8.4 + s * .4 + .4, z0 + z + 1, 0, tOf(7 + s * 2)]);
    l.push(['3024', COL.white, x0 + 8, 11, z0 + D / 2, 0, tOf(18)], ['3062b', COL.black, x0 + 8, 12.4, z0 + D / 2, 0, tOf(18)]);
    return growing(l);
  });
  // confetti: 1x1 tiles in party colours raining after the drop (each tile starts its fall at a random delay)
  const NCONF = 280, CONF_COLS = ['#FFD24A', '#E27A92', '#5FB0E8', '#6E9F58', '#F4F4F4', '#D97757', '#CDA4DE'];
  const confetti = () => keep('c10-confetti', () => { const im = new THREE.InstancedMesh(partGeo('3070b'), plastic('#ffffff'), NCONF); im.frustumCulled = false;
    const c = new THREE.Color(); for (let i = 0; i < NCONF; i++) im.setColorAt(i, c.set(CONF_COLS[i % CONF_COLS.length])); const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; });
  // fireworks on the bar lines: unlit coloured dots bursting outward with gravity
  const NFW = 8, FW_N = 48, BAR0 = Math.ceil((DROP - OFF) / BEAT / 4) * 4;
  const fireworks = () => keep('c10-fw', () => { const im = new THREE.InstancedMesh(new THREE.SphereGeometry(.35, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff' }), NFW * FW_N); im.frustumCulled = false;
    const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; });
  const pdoomV = t => t > DUR - 30 ? Math.max(0, Math.round(lerp(42, 0, (t - (DUR - 30)) / 25))) : Math.round(30 + 25 * Math.sin(t * .13) + 10 * Math.sin(t * .71));
  const _M = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3(), _c = new THREE.Color();

  // ---------- district: the moon set during this chapter ----------
  district('moon-c10', { at: WORLD.D.moon, r: 140 }, t => {
    if (!live(t)) return;
    // the moon surface, sky and Earth come from c09's always-on 'moon' district (this file adds only the finale set)
    // the P(DOOM) board on the moon: it falls to 0% in the song's last 30 s (same rule as EGGS.pdoomBoard, at moon height)
    const v = pdoomV(t); put(sign('pdoom' + v, ['P(DOOM)', v + '%'], { w: 5, h: 3.4, bg: '#101418', fg: '#ff8a3a', font: 'ui-monospace, monospace', size: 130, post: true, postH: 3.6, glow: true }), ...M(17, 0, -14), -.5);
    if (t < DROP) return;
    put(sunDisc(), ...M(260, 40, -600));
    const b = barn(); b.userData.grow(t); put(b, ...M(BARN[0], 0, BARN[1]));
    if (t >= 234.65) { const g = goldLine(), k = clamp((t - 234.65) / 2.6), m = g.userData.m; m.geometry.setDrawRange(0, Math.floor(m.geometry.index.count * k / 3) * 3); put(g, ...M()); }
    const cf = confetti(), im = cf.userData.im;
    for (let i = 0; i < NCONF; i++) { const per = 2.6 + hash(i) * 1.6, s = (t - DROP) / per - hash(i + 1) * .7, y = 24 - frac(Math.max(0, s)) * 26;
      _M.compose(_v.set((hash(i + 2) - .5) * 46 + Math.sin(t * 2 + i) * .8, s < 0 ? -60 : y, (hash(i + 3) - .5) * 26 - 9), _q.setFromEuler(_e.set(t * 3 + i, t * 2.3 + i * .7, 0)), _s.set(.8, .8, .8)); im.setMatrixAt(i, _M); }
    im.instanceMatrix.needsUpdate = true; put(cf, ...M());
    const fw = fireworks(), fim = fw.userData.im; let n = 0;
    for (let bb = 0; bb < NFW; bb++) { const tb = OFF + (BAR0 + bb * 4) * BEAT, age = t - tb, cx = (hash(bb + 70) - .5) * 60, cy = 30 + hash(bb + 71) * 12, cz = -40 - hash(bb + 72) * 20, on = age >= 0 && age <= 1.6;
      for (let i = 0; i < FW_N; i++) { const a = i / FW_N * Math.PI * 2, el = (hash(i + bb * 13) - .5) * 2.2, r = 11 * easeOut(age / .7);
        _M.compose(on ? _v.set(cx + Math.cos(a) * Math.cos(el) * r, cy + Math.sin(el) * r - 3 * age * age, cz + Math.sin(a) * Math.cos(el) * r) : _v.set(0, -999, 0), _q.identity(), _s.setScalar(on ? 1 - seg(age, .9, 1.6) : 0));
        fim.setMatrixAt(n, _M); fim.setColorAt(n, _c.set(['#FFD24A', '#E27A92', '#5FB0E8', '#9BE07A'][bb % 4])); n++; } }
    fim.instanceMatrix.needsUpdate = true; if (fim.instanceColor) fim.instanceColor.needsUpdate = true; put(fw, ...M());
    // background life: robots carrying seed crates from the rocket pad to the barn
    for (let i = 0; i < 3; i++) { const r = keep('c10-bot' + i, robot), ph = frac(t * .2 + i / 3), out = ph < .5, k = ease(out ? ph * 2 : 2 - ph * 2);
      robotPose(r, { walk: t * 2 + i, carry: out }); put(r, ...M(lerp(-26, -12, k), 0, -24 + i * 3), out ? Math.PI / 2 : -Math.PI / 2); }
  });

  // ---------- the shot: one continuous camera for the whole chapter (moon-relative keys) ----------
  const CAMPOS = [[215.60, [-4, 6, 22]], [217.4, [-2, 5.6, 19.5]], [219.3, [0, 5.2, 18]], [222.85, [0, 5, 17.5]], [227.47, [0, 5, 17]],
    [229.39, [10, 7, 24]], [232.02, [-11, 4.2, 18]], [234.65, [0, 9, 30]], [237.61, [0, 15, 34]], [239.44, [13, 6, 20]],
    [242.15, [-20, 10, 32]], [244.87, [0, 9, 37]], [247.6, [0, 17, 39.5]], [248.40, [0, 20, 40]]];
  const CAMLOOK = [[215.60, [0, 4.5, 0]], [217.4, [0, 4.5, 0]], [219.3, [0, 4.4, 0]], [222.85, [0, 4.4, 0]], [227.47, [0, 4.4, 0]],
    [229.39, [-2, 5, -5]], [232.02, [0, 4.4, -3]], [234.65, [0, 9, -8]], [237.61, [0, 22, -14]], [239.44, [9, 5, -2.5]],
    [242.15, [0, 6, -14]], [244.87, [0, 8, -10]], [247.6, [0, 27, -2]], [248.40, [0, 30, 0]]];

  function c10(t, lt) {
    const fin = t >= DROP, f = flatAt(t);
    // ---------- Pip, centre stage ----------
    const P = fig('pip', PIP), pp = { face: 'determined' };
    if (!fin) {
      const shout = pumpAt(t, WD);
      Object.assign(pp, shout > .05 ? { face: 'sing', armL: 2.6 * shout, armR: 2.6 * shout, bodyY: .15 * shout } : { face: 'determined', ...dance('sway', t) });
      if (t >= 222.85) {   // "So who writes the ending?": the pencil goes up
        const k = ease(seg(t, 223.5, 224.4));
        Object.assign(pp, { face: t > 225.3 ? 'smug' : 'determined', armR: lerp(.3, 2.95, k), armL: 0, armRz: 0, bodyY: 0, bodyRoll: 0, twist: 0, head: 0, headTilt: -.25 * k, holdR: t > 223.3 ? penUp() : null });
      }
    } else {
      const nah = NAH.find(n => t >= n - .05 && t < n + .5);
      if (nah) Object.assign(pp, { ...dance('dab', nah + .01, { side: NAH.indexOf(nah) % 2 ? -1 : 1 }), face: 'angry' });
      else if (t >= 232.02 && t < 234.65) Object.assign(pp, { armR: 1.55, armL: .6 + .5 * pulse(t, 5), bodyY: -.12 * pulse(t, 5), face: beatPh(t) < .5 ? 'sing' : 'joy', holdR: heldHandset('c10') });
      else if (t >= 234.65 && t < 237.61) Object.assign(pp, { armR: 2.4 + .3 * Math.sin(t * 5), armRz: .4 * Math.sin(t * 3), holdR: heldPencil('c10'), head: .2 * Math.sin(t * 3), headTilt: -.35, face: 'joy' });
      else Object.assign(pp, { ...dance(t < 242.15 ? 'bounce' : 'runningMan', t), face: 'joy' });
    }
    pose(P, pp); if (P.userData.J.earPencil) P.userData.J.earPencil.visible = !pp.holdR || pp.holdR === heldHandset('c10');
    put(P, ...F(0, 0), 0);

    // ---------- bridge neighbours: one pops up per shout, alternating sides, holding that line's prop ----------
    for (let i = 0; i < 6; i++) {
      const k = backOut(seg(t, WD[i] - .12, WD[i] + .2)); if (k <= 0) continue;
      const f2 = fig('c10n' + i, crowdLook(i + 2)), side = i % 2 ? 1 : -1, x = side * 2.7 * (1 + Math.floor(i / 2));
      const shout = pumpAt(t, WD.filter(w => w >= WD[i])), prop = PROPS[i]();
      let np = { face: shout > .05 ? 'laugh' : 'joy', bodyY: -4.5 * (1 - k), armL: 2.6 * shout, armR: prop ? 1.0 + 1.6 * shout : 2.6 * shout, holdR: prop };
      if (i === 2) np = { ...np, ...dance('wave', t), bodyY: np.bodyY };
      if (t >= 222.85 && !fin) np = { ...np, face: 'neutral', armL: 0, armR: prop ? .6 : 0, head: -side * .35, headTilt: -.25 };   // they look up at Pip's pencil
      if (fin) np = { ...crowdDance(i, t), holdR: null };
      pose(f2, np); put(f2, ...F(fin ? x * 1.15 : x, fin ? -1.5 : 0), fin ? -x * .03 : -side * .1);
    }
    if (fin) {
      // the whole crowd in two rows behind Pip, each dancing a different move; everyone dabs on the Nahs
      const nah = NAH.some(n => t >= n - .05 && t < n + .5);
      for (let i = 0; i < 16; i++) {
        const row = Math.floor(i / 8), x = (i % 8 - 3.5) * 3.4 + (row ? 1.7 : 0), z = -5 - row * 3.2, k = backOut(seg(t, DROP + .05 * (i % 8), DROP + .3 + .05 * (i % 8)));
        const f2 = fig('c10c' + i, crowdLook(i + 8)), dn = nah ? dance('dab', t, { side: i % 2 ? -1 : 1 }) : crowdDance(i + 8, t);
        pose(f2, { ...dn, face: nah ? 'laugh' : dn.face, bodyY: -4.5 * (1 - k) + (dn.bodyY || 0) }); put(f2, ...F(x, z), (hash(i) - .5) * .3);
      }
      // Clawd dances too: headset until the plot twist, then a hard hat drops on (with a gold poof)
      const C = clawd('c10', {}), twist = t >= TWIST;
      clawdPose(C, { face: t < 229.4 ? 'shocked' : twist && t < TWIST + .6 ? 'shocked' : 'joy', hat: twist ? null : 'headset', armL: .6 + .4 * Math.sin(t * 7.4), armR: .6 + .4 * Math.sin(t * 7.4 + 1), bob: .35 * Math.abs(Math.sin(Math.PI * (t - OFF) / BEAT)), roll: .06 * Math.sin(t * 3) });
      put(C, ...F(13, -3.5), -.5);
      if (twist) { const k = clamp((t - TWIST) / .35), y = 6.3 + 7 * (1 - easeIn(k)) + (k >= 1 ? .3 * Math.exp(-(t - TWIST - .35) * 9) * Math.sin((t - TWIST) * 30) : 0); put(hardHat(), ...M(13, y, -3.5), -.5); }
      if (t >= TWIST - .05 && t < TWIST + .5) { const s = spark(), a = (t - TWIST + .05) / .55; s.userData.m.material.opacity = .8 * (1 - a); put(s, ...M(13, 6.5, -3.5), 0, 2 + 3 * a); }
      // the three doors stand on the left; each is kicked off its hinges on one of the first three Nahs
      for (let i = 0; i < 3; i++) { const u = doors(i); doorPose(u, 0, seg(t, NAH[i], NAH[i] + 1.1), i + 4); put(u, ...M(-17 + i * 5.5, 0, -6), .25); }
      // cage, grave, pill: drop in from the sky and burst into gold
      THROW.forEach((th, i) => {
        const o = keep('c10throw' + i, [() => { const g = new THREE.Group(), c = cage(); c.scale.setScalar(.45); g.add(c); return g; }, () => gravestone(), () => pill()][i]), k = seg(t, th - .8, th);
        if (t < th && k > 0) { put(o, ...M(lerp(-30 + i * 12, -3 + i * 3, k), lerp(26, 6, k) + 3 * Math.sin(k * Math.PI), lerp(-20, -2, k)), k * 4, i ? .8 : 1); o.rotation.x = k * 6; }
        const age = t - th; if (age >= 0 && age < .7) for (let j = 0; j < 10; j++) { const s = keep(`c10gold${i}_${j}`, () => { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.SphereGeometry(.35, 10, 6), glowMat('#FFD24A', 2))); return g; }), a = j / 10 * Math.PI * 2, r = 5 * easeOut(age / .5);
          put(s, ...M(-3 + i * 3 + Math.cos(a) * r, 6 + Math.sin(a) * r * .7 - 4 * age * age, -2), 0, 1 - age / .7); }
      });
      // the giant pencil writing gold across the sky
      if (t >= 234.4 && t < 238.2) { const k = clamp((t - 234.65) / 2.6), p = SKYPATH.getPoint(k), gp = giantPencil(); put(gp, ...M(p.x + 1.5, p.y + 1.2, p.z + .5), 0, 1 - seg(t, 237.7, 238.2)); gp.rotation.z = -.4 + .15 * Math.sin(t * 9); }
    }

    // ---------- camera ----------
    const pos = path(t, CAMPOS, { easeEnds: false }), lk = path(t, CAMLOOK, { easeEnds: false }), d = drift(lt, fin ? .7 : .25);
    const punch = fin ? 0 : punchAt(t, WD) * 1.4;
    let shk = [0, 0, 0]; for (const h of fin ? [...NAH, ...THROW, TWIST] : WD) if (t > h && t < h + .7) { const s = shake(t, (fin ? .3 : .18) * Math.exp(-(t - h) * 8)); shk = shk.map((v, j) => v + s[j]); }
    const land = WORLD.landing(t, DROP); if (fin) shk = shk.map((v, j) => v + land.shake[j]);
    const still = f > .05 ? 0 : 1;   // no drift/shake while the world is a paper cut-out
    cam({ pos: M(pos[0] + (d[0] + shk[0]) * still, pos[1] + (d[1] + shk[1]) * still, pos[2] + d[2] * still), look: M(lk[0] + shk[0] * .3 * still, lk[1] + shk[1] * .3 * still, lk[2]),
      fov: (fin ? kf(t, [[DROP, 34], [234.65, 40], [242.15, 42], [248.4, 40]]) : 34) - punch * 3, blur: fin ? .8 : .7 * (1 - f), focus: M(0, 4, 0), flat: f,
      outline: f >= .98 ? ease(seg(t, FLAT_C, FLAT_C + .35)) : 0 });
    // ---------- light ----------
    if (!fin) {
      const dark = ease(seg(t, FLAT_A, 222.85));   // the moon light drains to black as the world flattens
      look({ ...WORLD.LOOK.moon, sky: WORLD.LOOK.moon.sky.map(c => mixVal(c, '#000000', dark)), keyInt: lerp(3.4, 1.2, dark), fill: lerp(.3, .05, dark), vignette: .35 + .4 * dark });
    } else look({ ...WORLD.LOOK.final, sky: WORLD.LOOK.final.sky.map((c, i) => mixVal(i === 1 ? '#a85a2a' : c, c, ease(seg(t, DROP, 236)))) });   // the gold sunrise comes up
    // ---------- the spotlight (screen space): black everywhere except Pip, then only the pencil ----------
    // In toon mode the shading ignores the light, so the "drop to black" is a screen-space pool: first a wide pool on the
    // whole row (the background goes black from 220.3), then it closes onto Pip, then onto the raised pencil's tip.
    if (!fin && t >= 220.3) {
      const a = ease(seg(t, 220.3, 222.85)), toPip = ease(seg(t, 222.85, 223.6)), tight = ease(seg(t, 224.6, 225.6)), J = P.userData.J;
      hud(ctx => {
        const c3 = window.__cam, toS = v => [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H];
        const [px, py] = toS(new THREE.Vector3(...M(0, 3.4, 0)).project(c3));
        const tipW = new THREE.Vector3(0, -1.6, 0).applyMatrix4(J.gripR.matrixWorld), [tx, ty] = toS(tipW.project(c3));   // the pencil tip, as rendered
        const cx = lerp(px, tx, tight), cy = lerp(py, ty, tight) - lerp(40, 0, toPip);
        const rx = lerp(lerp(980, 330, toPip), 200, tight) * (1 + .03 * Math.sin(t * 9)), ry = lerp(lerp(460, 330, toPip), 200, tight) * (1 + .03 * Math.sin(t * 9));
        ctx.save(); ctx.translate(cx, cy); ctx.scale(1, ry / rx);
        const g = ctx.createRadialGradient(0, 0, rx * .55, 0, 0, rx * 1.15); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`);
        ctx.fillStyle = g; ctx.fillRect(-W * 4, -H * 8, W * 8, H * 16);
        ctx.fillStyle = `rgba(255,236,170,${.10 * toPip})`; ctx.beginPath(); ctx.arc(0, 0, rx * .6, 0, 7); ctx.fill(); ctx.restore();
      });
    }
    if (fin && land.flash > 0) hud(ctx => { ctx.fillStyle = `rgba(255,255,255,${Math.min(1, land.flash * 1.5)})`; ctx.fillRect(0, 0, W, H); });
    // ---------- seams ----------
    if (t < WORLD.F.Fm.t1) { WORLD.apply(WORLD.flight('Fm', t)); cam({ blur: .6, flat: 0, outline: 0 }); }
    if (t >= WORLD.F.F6.t0) { WORLD.apply(WORLD.flight('F6', t)); cam({ blur: .4, flat: 0, outline: 0 }); }
  }
  shots([[T0, c10]]);
})();
