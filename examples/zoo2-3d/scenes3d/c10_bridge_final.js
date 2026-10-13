// c10_bridge_final.js: 214.94–249.41 s, on the MOON. The climax and the 2D-flatten showcase.
//   Bridge 214.94–222.85: "Who …? (We do!)": on each shout a neighbour RUNS IN from off-screen with that line's prop and
//     lands in the row on the shout; the row pumps its arms and the camera punches in. From 219.3 the flat dial ramps 0 → 1 (dolly-zoom to ortho,
//     z-squash to a paper cut-out, toon shading, then bold ink at flat = 1) while the light drains to a pool on the row.
//   222.85–227.47 "So who writes the ending?": black except a spotlight on the flat Pip; he raises his pencil and the
//     spotlight tightens onto its tip.
//   227.47 "(WE DO!)": white flash; the cut-out inflates back to full 3D (.35 s). Three doors stand round Pip; on each
//     "Nah!" he turns and KICKS one (right foot on the door, asserted with expect) and it flies away. Cage/grave/pill drop
//     in and burst into gold; the crowd and Clawd run in and dance; a giant pencil writes a gold line across the sky;
//     Clawd swaps the headset for a hard hat; the red barn goes up a course per beat; the sun rises; confetti, fireworks.
//     Ends rising toward Earth on the F6 flight to the desk.
(() => {
  const M = (dx = 0, dy = 0, dz = 0) => WORLD.at('moon', dx, dy, dz);
  const onPad = (x, z) => Math.abs(x) <= 7 && Math.abs(z) <= 7 ? .42 : 0;   // c09's launch pad (12x12 tiles, top at .42) under centre stage
  const F = (x, z) => M(x, onPad(x, z), z);                                  // a standing spot: feet on the pad or the ground
  const T0 = 214.94, DROP = 227.47, T1 = 249.41;
  const WD = [215.45, 216.72, 218.0, 219.3, 220.55, 221.72];          // the "(We do!)" shouts (onsets, as in the 2D video)
  const NAH = [DROP + .43, DROP + 1.07, DROP + 1.70, 237.61 + .43, 237.61 + 1.07, 237.61 + 1.70];
  const THROW = [230.13, 230.77, 231.41];                              // cage, grave, pill: burst into gold
  const TWIST = 240.8;                                                 // "here comes the plot twist": headset off, hard hat on
  const FLAT_A = 219.3, FLAT_B = 222.0, FLAT_C = 222.25;               // 0→.8 slowly, then .8→1 in .25 s (skips the ghost-outline zone)
  const live = t => t >= T0 - .5 && t < T1 + .5;
  const pumpAt = (t, times) => { let v = 0; for (const p of times) { const k = t - p; if (k > -.2 && k < .7) v = Math.max(v, k < 0 ? ease((k + .2) / .2) : Math.exp(-k * 5)); } return v; };
  const punchAt = (t, times, k = 7) => times.reduce((s, p) => s + (t >= p ? Math.exp(-(t - p) * k) : 0), 0);
  const flatAt = t => t >= DROP ? 1 - ease(seg(t, DROP, DROP + .35)) : t < FLAT_A ? 0 : t < FLAT_B ? .8 * ease(seg(t, FLAT_A, FLAT_B)) : .8 + .2 * seg(t, FLAT_B, FLAT_C);
  const win = (t, a, b, r = .2) => ease(seg(t, a - r, a)) * (1 - ease(seg(t, b, b + r)));   // a soft 0→1→0 window (blends poses in and out)

  // ---------- layout (moon-local x, z) ----------
  const SLOTS = [-4.9, 4.9, -7.3, 7.3, -9.7, 9.7], ROW_Z = -1.5;        // neighbour i stands at SLOTS[i] (left, right, left, …)
  // three doors (at .6 scale) stand round Pip at radius 2.3, each with its BACK to him: a kick on the back face sends it flying away
  const DS = .6, DOORS = [{ ry: 0, at: [-2 * DS, 2.3], hit: [0, 2.19] }, { ry: Math.PI / 2, at: [2.3, 2 * DS], hit: [2.19, 0] }, { ry: -Math.PI / 2, at: [-2.3, -2 * DS], hit: [-2.19, 0] }];
  // measured with limb(): at kickPose(0) the right foot is at (-.525, 1.68, +1.317) from the feet point, in the figure's frame
  const FOOT = [-.525, 1.68, 1.317], FACE = DOORS.map(d => Math.atan2(d.hit[0], d.hit[1]));
  const S = DOORS.map((d, i) => { const c = Math.cos(FACE[i]), s = Math.sin(FACE[i]); return [d.hit[0] - (FOOT[0] * c + FOOT[2] * s), d.hit[1] - (-FOOT[0] * s + FOOT[2] * c)]; });
  const PIP_SPOT = S[0];                                                // Pip stands a step in front of the row, already on the first door's kick spot
  const PIP_PLAN = [[T0, [1.5, 3]], [216.2, PIP_SPOT], [NAH[0] + .12, S[0]], [NAH[1] - .28, S[1]], [NAH[1] + .12, S[1]], [NAH[2] - .28, S[2]], [NAH[2] + .3, S[2]], [230.6, PIP_SPOT]];

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
  // Pip's pencil for the whole chapter, gripped point-DOWN in hand space: raised overhead (armR ≈ 2.95) it points UP
  const penUp = () => keep('c10-penup', () => { const g = new THREE.Group(), p = pencil(.85); p.rotation.z = Math.PI; p.position.y = .6; g.add(p); return g; });   // grip at the eraser end: ~1.9 studs stick out
  const giantPencil = () => keep('c10-giant-pencil', () => { const g = new THREE.Group(), p = pencil(3.2); p.rotation.z = Math.PI * .75; g.add(p); return g; });
  // the gold line the giant pencil writes across the sky (a tube revealed with drawRange: pure function of t)
  const SKYPATH = (() => { const pts = []; for (let i = 0; i <= 80; i++) { const u = i / 80; pts.push(new THREE.Vector3(lerp(-34, 34, u), 26 + 5 * Math.sin(u * Math.PI * 3) + 3 * Math.sin(u * 17), -22 + 4 * Math.sin(u * 5))); } return new THREE.CatmullRomCurve3(pts); })();
  const goldLine = () => keep('c10-goldline', () => { const m = new THREE.Mesh(new THREE.TubeGeometry(SKYPATH, 240, .45, 8), glowMat('#FFD24A', 1.8)); const g = new THREE.Group(); g.add(m); g.userData.m = m; return g; });
  const sunDisc = () => keep('c10-sun', () => { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16), new THREE.MeshBasicMaterial({ color: '#FFE08A', fog: false }))); return g; });
  const hardHat = () => keep('c10-hardhat', () => { const g = new THREE.Group(); const d = new THREE.Mesh(new THREE.SphereGeometry(1.9, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), plastic(COL.mustard)); d.castShadow = true; g.add(d);
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, .18, 28), plastic(COL.mustard))); return g; });
  const spark = () => keep('c10-spark', () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), new THREE.MeshBasicMaterial({ color: '#FFD24A', transparent: true })); g.add(m); g.userData.m = m; return g; });
  // the paper-theatre backdrop: a painted night sky with Earth, flown in from above behind the row as the world flattens
  // (it hides the moon base behind, which the ortho cut-out would otherwise stack right behind the row) and flown out at the drop
  const backdrop = () => keep('c10-backdrop', () => {
    const c = document.createElement('canvas'); c.width = 2048; c.height = 1024; const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 1024); g.addColorStop(0, '#05061a'); g.addColorStop(.7, '#151c44'); g.addColorStop(1, '#27305e'); x.fillStyle = g; x.fillRect(0, 0, 2048, 1024);
    for (let i = 0; i < 260; i++) { x.fillStyle = `rgba(255,255,240,${.4 + .6 * hash(i + 3)})`; const r = 1 + 3 * hash(i + 5) ** 3; x.beginPath(); x.arc(hash(i) * 2048, hash(i + 1) * 900, r, 0, 7); x.fill(); }
    x.fillStyle = '#2a5fb8'; x.beginPath(); x.arc(1460, 300, 150, 0, 7); x.fill(); x.save(); x.beginPath(); x.arc(1460, 300, 150, 0, 7); x.clip(); x.fillStyle = '#4f9a4a';
    for (let i = 0; i < 9; i++) { x.beginPath(); x.ellipse(1340 + hash(i + 30) * 240, 180 + hash(i + 31) * 240, 30 + 40 * hash(i + 32), 18 + 26 * hash(i + 33), hash(i + 34) * 3, 0, 7); x.fill(); } x.restore();
    x.strokeStyle = 'rgba(255,255,255,.05)'; x.lineWidth = 3; for (let y = 0; y < 1024; y += 9) { x.beginPath(); x.moveTo(0, y + hash(y) * 4); x.lineTo(2048, y + hash(y + 1) * 4); x.stroke(); }   // paper grain
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const grp = new THREE.Group(), m = new THREE.Mesh(new THREE.BoxGeometry(64, 30, .3), [matte('#20263f'), matte('#20263f'), matte('#20263f'), matte('#20263f'), matte('#ffffff', { map: tex }), matte('#20263f')]);
    m.position.y = 15; m.receiveShadow = true; grp.add(m); return grp; });
  const doors = i => keep('c10door' + i, () => doorUnit(['#9C7A5C', '#6B3B4A', '#E7A6C0'][i]));
  // the P(DOOM) board: ONE object whose painted number updates (no new board per value). Falls to 0% in the last 30 s.
  const pdoomV = t => t > DUR - 30 ? Math.max(0, Math.round(lerp(42, 0, (t - (DUR - 30)) / 25))) : Math.round(30 + 25 * Math.sin(t * .13) + 10 * Math.sin(t * .71));
  const pdoom = () => keep('c10-pdoom', () => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 348; const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const g = new THREE.Group(), face = new THREE.Mesh(new THREE.BoxGeometry(5, 3.4, .3), [matte('#3a3a3a'), matte('#3a3a3a'), matte('#3a3a3a'), matte('#3a3a3a'),
      new THREE.MeshStandardMaterial({ map: tex, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: .6, roughness: .6 }), matte('#3a3a3a')]);
    face.position.y = 3.6 + 1.7; face.castShadow = true; g.add(face);
    for (const x of [-1.9, 1.9]) for (let r = 0; r < 3; r++) { const b = part('3005', COL.dkgrey); b.position.set(x, (r + 1) * 1.2, 0); g.add(b); }
    g.userData = { c, tex, v: null }; return g; });
  function drawPdoom(b, v) {
    if (b.userData.v === v) return; b.userData.v = v; const x = b.userData.c.getContext('2d');
    x.fillStyle = '#101418'; x.fillRect(0, 0, 512, 348); x.strokeStyle = '#ff8a3a'; x.lineWidth = 12; x.strokeRect(6, 6, 500, 336);
    x.fillStyle = '#ff8a3a'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '100px ui-monospace, monospace'; x.fillText('P(DOOM)', 256, 110); x.fillText(v + '%', 256, 245);
    b.userData.tex.needsUpdate = true;
  }

  // the barn: red 1x4-brick walls with a door gap, a white door frame, a stepped red roof. One course per beat after the drop
  // (the storyboard's "the barn goes up on the beats": a stop-motion build, course by course)
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
  // confetti: 1x1 tiles raining after the drop; each tile shrinks to ~0 at the bottom of its fall before wrapping to the top
  const NCONF = 280, CONF_COLS = ['#FFD24A', '#E27A92', '#5FB0E8', '#6E9F58', '#F4F4F4', '#D97757', '#CDA4DE'];
  const confetti = () => keep('c10-confetti', () => { const im = new THREE.InstancedMesh(partGeo('3070b'), plastic('#ffffff'), NCONF); im.frustumCulled = false;
    const c = new THREE.Color(); for (let i = 0; i < NCONF; i++) im.setColorAt(i, c.set(CONF_COLS[i % CONF_COLS.length])); const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; });
  // fireworks on the bar lines: unlit coloured dots bursting outward with gravity
  const NFW = 8, FW_N = 48, BAR0 = Math.ceil((DROP - OFF) / BEAT / 4) * 4;
  const fireworks = () => keep('c10-fw', () => { const im = new THREE.InstancedMesh(new THREE.SphereGeometry(.35, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff' }), NFW * FW_N); im.frustumCulled = false;
    const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; });
  const _M = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3(), _c = new THREE.Color();

  // ---------- district: this chapter's moon set (the surface, sky, Earth, pad and base come from c09's 'moon' district) ----------
  district('moon-c10', { at: WORLD.D.moon, r: 140 }, t => {
    if (!live(t)) return;
    const b = pdoom(); drawPdoom(b, pdoomV(t)); put(b, ...M(17, 0, -14), -.5);
    { const down = ease(seg(t, 218.9, 220.0)), up = ease(seg(t, DROP, DROP + .5)); if (down > 0 && up < 1) put(backdrop(), ...M(0, 44 * (1 - down) + 46 * up, -4.6)); }
    // While the world is a paper cut-out the camera is orthographic, so the moon-base stations standing between the camera
    // and the row (c09's pump/beans/press/crew at z ≈ 13–15, off-screen in perspective) would cover it: they sit this out.
    if (flatAt(t) > .02) for (const o of ROOT.children) {
      const a = o.userData?.actor || ''; if (a.includes('c10') || a === 'fig:pip' || a.startsWith('obj:heldPencil')) continue;
      if (o.position.z - WORLD.D.moon[1] > 5 && Math.abs(o.position.x - WORLD.D.moon[0]) < 45 && o.position.y > WORLD.MOON_Y - 5) o.visible = false;
    }
    // the sun rises from below the horizon after the drop (the gold sunrise)
    put(sunDisc(), ...M(260, lerp(-70, 40, ease(seg(t, DROP, DROP + 6))), -600));
    const br = barn(); br.userData.grow(t); put(br, ...M(BARN[0], 0, BARN[1]));
    { const g = goldLine(), k = clamp((t - 234.65) / 2.6), m = g.userData.m; m.geometry.setDrawRange(0, Math.floor(m.geometry.index.count * k / 3) * 3); put(g, ...M()); }
    const cf = confetti(), im = cf.userData.im;
    for (let i = 0; i < NCONF; i++) { const per = 2.6 + hash(i) * 1.6, s = (t - DROP) / per - hash(i + 1) * .7, ph = frac(Math.max(0, s)), y = 24 - ph * 26;
      const sc = s < 0 ? 0 : .8 * Math.min(1, ph / .06, (1 - ph) / .08);   // grows in at the top, shrinks out at the bottom: no visible wrap
      _M.compose(_v.set((hash(i + 2) - .5) * 46 + Math.sin(t * 2 + i) * .8, s < 0 ? -60 : y, (hash(i + 3) - .5) * 26 - 9), _q.setFromEuler(_e.set(t * 3 + i, t * 2.3 + i * .7, 0)), _s.setScalar(sc)); im.setMatrixAt(i, _M); }
    im.instanceMatrix.needsUpdate = true; put(cf, ...M());
    const fw = fireworks(), fim = fw.userData.im; let n = 0;
    for (let bb = 0; bb < NFW; bb++) { const tb = OFF + (BAR0 + bb * 4) * BEAT, age = t - tb, cx = (hash(bb + 70) - .5) * 60, cy = 30 + hash(bb + 71) * 12, cz = -40 - hash(bb + 72) * 20, on = age >= 0 && age <= 1.6;
      for (let i = 0; i < FW_N; i++) { const a = i / FW_N * Math.PI * 2, el = (hash(i + bb * 13) - .5) * 2.2, r = 11 * easeOut(age / .7);
        _M.compose(on ? _v.set(cx + Math.cos(a) * Math.cos(el) * r, cy + Math.sin(el) * r - 3 * age * age, cz + Math.sin(a) * Math.cos(el) * r) : _v.set(0, -999, 0), _q.identity(), _s.setScalar(on ? 1 - seg(age, .9, 1.6) : 0));
        fim.setMatrixAt(n, _M); fim.setColorAt(n, _c.set(['#FFD24A', '#E27A92', '#5FB0E8', '#9BE07A'][bb % 4])); n++; } }
    fim.instanceMatrix.needsUpdate = true; if (fim.instanceColor) fim.instanceColor.needsUpdate = true; put(fw, ...M());
  });

  // ---------- dances with a soft attack (bounce/headbang/clap pulse instantly on the beat: props would teleport) ----------
  const soft = b => { const f = frac(b); return Math.min(1, f / .1) * Math.exp(-f * 5); };
  function danceS(name, t, o = {}) {
    const b = (t - OFF) / BEAT + (o.offset || 0);
    if (name === 'bounce') { const p = soft(b); return { bodyY: .32 * Math.abs(Math.sin(Math.PI * b)), armL: .5 + .7 * p, armR: .5 + .7 * p, headTilt: -.15 * p, bodyRoll: .05 * Math.sin(b * Math.PI) }; }
    if (name === 'headbang') { const p = soft(b); return { headTilt: .55 * p - .1, lean: .25 * p, armL: 2.6, armR: 2.6, armLz: .3, armRz: .3, bodyY: -.05 * p }; }
    if (name === 'clap') { const k = soft(b); return { armL: 1.2, armR: 1.2, armLz: -.45 + .55 * (1 - k), armRz: -.45 + .55 * (1 - k), bodyY: .05 * k }; }
    return dance(name, t, o);
  }
  const MOVES = ['bounce', 'floss', 'disco', 'dab', 'runningMan', 'robot', 'clap', 'headbang', 'sprinkler', 'wave'];
  const crowdS = (i, t) => ({ ...danceS(MOVES[i % MOVES.length], t, { offset: (i % 3) * .5, side: i % 2 ? -1 : 1 }), face: ['joy', 'sing', 'wink', 'star'][i % 4] });

  // ---------- poses ----------
  const raisePose = t => { const r = ease(seg(t, 222.95, 223.3)), k = ease(seg(t, 223.45, 224.3));   // reach to the ear, take the pencil, raise it
    return { face: t > 225.3 ? 'smug' : 'determined', armR: lerp(lerp(.3, 2.9, r), 3.0, k), armRz: .3 * r * (1 - k), head: .4 * r * (1 - k), headTilt: -.25 * k }; };
  function pipBridge(t) {
    const shout = pumpAt(t, WD), w = clamp(shout * 2);
    let p = blend({ ...dance('sway', t), face: 'determined' }, { face: 'sing', armL: 2.6 * shout, armR: 2.6 * shout, bodyY: .15 * shout }, w);
    if (t >= 222.85) p = blend(p, raisePose(t), ease(seg(t, 222.85, 223.2)));
    return p;
  }
  function pipFinal(t) {
    const base = blend(danceS('bounce', t), dance('runningMan', t), ease(seg(t, 242.0, 242.4)));
    let p = { ...base, face: 'joy' };
    const conduct = win(t, 234.65, 237.61, .3);
    if (conduct > 0) p = blend(p, { armR: 2.4 + .3 * Math.sin(t * 5), armRz: .4 * Math.sin(t * 3), head: .2 * Math.sin(t * 3), headTilt: -.35, face: 'joy' }, conduct);
    for (let i = 3; i < 6; i++) { const w = win(t, NAH[i] - .05, NAH[i] + .45, .15); if (w > 0) p = blend(p, { ...dance('dab', NAH[i] + .01, { side: i % 2 ? -1 : 1 }), face: 'angry' }, w); }
    // the three kicks: pose from kickPose around each hit; between them Pip shuffles to the next door (PIP_PLAN)
    for (let i = 0; i < 3; i++) { const u = t - NAH[i]; if (u > -.32 && u < .3) p = blend(p, { ...kickPose(u), face: 'angry' }, win(t, NAH[i] - .3, NAH[i] + .14, .06)); }
    return blend(raisePose(DROP), p, ease(seg(t, DROP, DROP + .22)));   // out of the pencil-raise without a snap
  }

  // ---------- camera keys (moon-relative); front-on through the flatten, so the cut-out reads as flat cards ----------
  const CAMPOS = [[215.60, [-4, 6, 22]], [217.4, [-2, 6.3, 19.5]], [219.3, [0, 6.3, 18]], [221.0, [0, 6.1, 17.5]], [222.85, [0, 6.1, 17.5]], [227.47, [0, 6.1, 17]],   // y ≥ 6: c09's bean bed (z≈15) stays below frame [227.95, [1.5, 7, 16]], [228.6, [2.5, 6.6, 16]], [229.39, [4, 6.6, 17.5]], [230.3, [10, 7.5, 24]], [232.02, [-11, 4.6, 18]], [234.65, [0, 9, 30]], [237.61, [0, 15, 34]], [239.44, [13, 6, 20]],
    [242.15, [-20, 10, 32]], [244.87, [0, 9, 37]], [247.6, [0, 17, 39.5]], [248.40, [0, 20, 40]]];
  const CAMLOOK = [[215.60, [0, 4.5, 0]], [217.4, [0, 4.5, 0]], [219.3, [0, 4.4, 0]], [221.0, [0, 4.4, 0]], [222.85, [0, 4.4, 0]], [227.47, [0, 4.4, 0]], [227.95, [0, 2.8, .5]], [228.6, [0, 2.8, .3]], [229.39, [-.5, 3, 0]], [230.3, [-1, 4.4, 0]], [232.02, [0, 4.4, -3]], [234.65, [0, 9, -8]], [237.61, [0, 22, -14]], [239.44, [9, 5, -2.5]],
    [242.15, [0, 6, -14]], [244.87, [0, 8, -10]], [247.6, [0, 27, -2]], [248.40, [0, 30, 0]]];

  function c10(t, lt) {
    const fin = t >= DROP, f = flatAt(t);
    // ---------- Pip: walks from c09's last spot to the front of the row; in the finale shuffles to and kicks each door ----------
    const P = fig('pip', PIP), pl = stepTo(t, PIP_PLAN, { face: 0 });
    // facing: camera-front, then turn door to door (each turn spread over the shuffle), back to front on the walk home
    const ry = kf(t, [[NAH[0] + .12, FACE[0]], [NAH[1] - .28, FACE[1]], [NAH[1] + .12, FACE[1]], [NAH[2] - .28, FACE[2]], [NAH[2] + .3, FACE[2]], [230.6, 0]]);
    const pp = fin ? pipFinal(t) : pipBridge(t);
    pose(P, { ...blend(pp, pl.pose, Object.keys(pl.pose).length ? .7 : 0), holdR: t > 223.3 ? penUp() : null });
    if (P.userData.J.earPencil) P.userData.J.earPencil.visible = t <= 223.3;
    put(P, ...F(pl.x, pl.z), ry);
    // the pencil comes from behind the ear: the hand is at the ear when it changes hands
    if (Math.abs(t - 223.3) < .05) { P.updateWorldMatrix(true, true); expect('pip takes the pencil from behind his ear', limb(P, 'handR'), P.userData.J.earPencil.getWorldPosition(new THREE.Vector3()).toArray(), .6); }
    // kicks: assert the right foot is on each door's back face at its hit
    for (let i = 0; i < 3; i++) if (Math.abs(t - NAH[i]) < .03) expect(`pip kicks door ${i}`, limb(P, 'footR'), M(DOORS[i].hit[0], FOOT[1] + .42, DOORS[i].hit[1]), .6);

    // ---------- neighbours: each runs in from off-screen and lands in the row on its shout ----------
    for (let i = 0; i < 6; i++) {
      const side = SLOTS[i] < 0 ? -1 : 1, x0 = side < 0 ? -26 : 26, arrive = WD[i] - .08;
      if (t < arrive - 2.2) continue;
      const nb = fig('c10n' + i, crowdLook(i + 2)), mv = stepTo(t, [[arrive - 2.2, [x0, ROW_Z]], [arrive, [SLOTS[i], ROW_Z]]], { face: 0, run: true });
      const shout = pumpAt(t, WD.filter(w => w >= WD[i])), prop = PROPS[i](), hop = .7 * Math.max(0, Math.sin(Math.PI * clamp((t - arrive) / .45)));
      let np = { ...mv.pose, face: shout > .1 ? 'laugh' : 'joy', armL: (mv.pose.armL || 0) * (1 - shout) + 2.6 * shout, armR: prop ? 1.0 + 1.6 * shout : (mv.pose.armR || 0) * (1 - shout) + 2.6 * shout, bodyY: (mv.pose.bodyY || 0) + hop, holdR: prop };
      if (i === 2 && t > arrive + .5) np = blend(np, { ...dance('wave', t), holdR: null }, ease(seg(t, arrive + .5, arrive + .8)));
      np = blend(np, { face: 'neutral', armL: 0, armR: prop ? .6 : 0, armLz: 0, armRz: 0, head: -side * .35, headTilt: -.25, holdR: prop }, ease(seg(t, 222.85, 223.2)));   // they look up at the pencil
      if (fin) np = blend(np, { ...crowdS(i, t), holdR: prop }, ease(seg(t, DROP, DROP + .35)));
      for (let k = 3; k < 6; k++) { const w = win(t, NAH[k] - .05, NAH[k] + .45, .15); if (w > 0) np = blend(np, { ...dance('dab', t, { side: i % 2 ? -1 : 1 }), face: 'laugh', holdR: prop }, w); }
      pose(nb, np); put(nb, ...F(mv.x, mv.z), t < arrive ? mv.ry : -side * .1 * (1 - (fin ? 1 : 0)));
    }

    if (fin) {
      // ---------- the crowd pours in from both sides and dances ----------
      for (let i = 0; i < 16; i++) {
        const row = Math.floor(i / 8), x = (i % 8 - 3.5) * 3.4 + (row ? 1.7 : 0), z = -5 - row * 3.2, from = x < 0 ? -26 : 26, t0 = DROP + .1 + .06 * (i % 8), t1 = t0 + 1.4 + Math.abs(x) * .03;
        const f2 = fig('c10c' + i, crowdLook(i + 8)), mv = stepTo(t, [[t0, [from, z]], [t1, [x, z]]], { face: 0, run: true });
        let dn = blend(mv.pose, crowdS(i + 8, t), ease(seg(t, t1, t1 + .3)));
        for (let k = 3; k < 6; k++) { const w = win(t, NAH[k] - .05, NAH[k] + .45, .15); if (w > 0) dn = blend(dn, { ...dance('dab', t, { side: i % 2 ? -1 : 1 }), face: 'laugh' }, w); }
        pose(f2, { ...dn, face: dn.face || 'joy' }); put(f2, ...F(mv.x, mv.z), t < t1 ? mv.ry : (hash(i) - .5) * .3);
      }
      // ---------- Clawd walks in from the right and dances; the plot twist swaps the headset for a hard hat ----------
      const C = clawd('c10', {}), twist = t >= TWIST, cw = stepTo(t, [[DROP + .3, [26, -3.5]], [DROP + 2.2, [13, -3.5]]], { face: -.5 });
      const walking = t < DROP + 2.2, bob = walking ? 0 : .35 * Math.abs(Math.sin(Math.PI * (t - OFF) / BEAT)) * ease(seg(t, DROP + 2.2, DROP + 2.5));
      const armsK = ease(seg(t, DROP + 2.2, DROP + 2.5));
      clawdPose(C, { face: t < 229.4 ? 'shocked' : twist && t < TWIST + .6 ? 'shocked' : 'joy', hat: twist ? null : 'headset', walk: walking ? t * 3 : null,
        armL: armsK * (.6 + .4 * Math.sin(t * 7.4)), armR: armsK * (.6 + .4 * Math.sin(t * 7.4 + 1)), bob, roll: .06 * Math.sin(t * 3) * armsK });
      put(C, ...F(cw.x, cw.z), walking ? -Math.PI / 2 : -.5);
      // the headset vanishes in a gold poof (it covers the swap); the hard hat drops in from above the frame
      if (t >= TWIST - .05 && t < TWIST + .5) { const s = spark(), a = (t - TWIST + .05) / .55; s.userData.m.material.opacity = .8 * (1 - a); put(s, ...M(13, 6.5, -3.5), 0, 4 * Math.sin(Math.PI * a) ** 2); }
      if (t >= TWIST - .4) { const k = clamp((t - TWIST + .4) / .75), y = 6.3 + 16 * (1 - easeIn(k)) + (k >= 1 ? .3 * Math.exp(-(t - TWIST - .35) * 9) * Math.sin((t - TWIST) * 30) : 0); put(hardHat(), ...M(13, y, -3.5), -.5); }
      // ---------- the three doors round Pip (they stand there from the drop, under the flash) ----------
      // on the kick the panel flies off and the whole door bursts into a spray of bricks (the frame shrinks into the spray)
      for (let i = 0; i < 3; i++) {
        const d = DOORS[i], gone = ease(seg(t, NAH[i] + .05, NAH[i] + .32));
        if (gone < 1) { const u = doors(i); doorPose(u, 0, seg(t, NAH[i], NAH[i] + 1.1), i + 4); put(u, ...F(d.at[0], d.at[1]), d.ry, DS * (1 - gone)); }
        const age = t - NAH[i]; if (age > 0 && age < 1.0) for (let j = 0; j < 12; j++) {
          const b = keep(`c10brick${i}_${j}`, () => { const g = new THREE.Group(), m = part('3005', j % 3 ? COL.white : ['#9C7A5C', '#6B3B4A', '#E7A6C0'][i]); m.position.y = -.6; g.add(m); return g; });
          const away = FACE[i] + (hash(j + i * 17) - .5) * 1.6, sp = 4 + 5 * hash(j + 3 + i * 7), up = 3 + 4 * hash(j + 9 + i * 5);
          const x = d.hit[0] + Math.sin(away) * sp * age, z = d.hit[1] + Math.cos(away) * sp * age, y = 1.5 + hash(j + i) * 2.5 + up * age - 9 * age * age;
          if (y < 0) continue; put(b, ...M(x, y + .42, z), age * 7 + j, .8 * Math.sin(Math.PI * Math.min(1, age / .95)) ** .5 * Math.min(1, y / 1.2));   // shrinks to nothing as it lands b.rotation.x = age * 5 + j;
        }
      }
      // ---------- cage, grave, pill: fall in from above the frame, shrink into a gold burst ----------
      THROW.forEach((th, i) => {
        const o = keep('c10throw' + i, [() => { const g = new THREE.Group(), c = cage(); c.scale.setScalar(.45); g.add(c); return g; }, () => gravestone(), () => pill()][i]), k = seg(t, th - 1.0, th);
        if (t < th && k > 0) { put(o, ...M(lerp(-30 + i * 12, -3 + i * 3, k), lerp(42, 6, k) + 3 * Math.sin(k * Math.PI), lerp(-20, -2, k)), k * 4, (i ? .8 : 1) * (1 - ease(seg(t, th - .2, th - .02)))); o.rotation.x = k * 6; }
        const age = t - th; if (age >= 0 && age < .7) for (let j = 0; j < 10; j++) { const s = keep(`c10gold${i}_${j}`, () => { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.SphereGeometry(.35, 10, 6), glowMat('#FFD24A', 2))); return g; }), a = j / 10 * Math.PI * 2, r = 5 * easeOut(age / .5);
          put(s, ...M(-3 + i * 3 + Math.cos(a) * r, 6 + Math.sin(a) * r * .7 - 4 * age * age, -2), 0, 1.2 * Math.sin(Math.PI * age / .7)); }
      });
      // ---------- the giant pencil writing gold across the sky (it flies in from off the left edge, out the right) ----------
      if (t >= 233.9 && t < 238.6) { const k = clamp((t - 234.65) / 2.6), p = SKYPATH.getPoint(k), inK = ease(seg(t, 233.9, 234.65)), outK = ease(seg(t, 237.61, 238.6)), gp = giantPencil();
        put(gp, ...M(p.x + 1.5 - 40 * (1 - inK) + 50 * outK, p.y + 1.2, p.z + .5)); gp.rotation.z = -.4 + .15 * Math.sin(t * 9); }
    }

    // ---------- camera ----------
    const pos = path(t, CAMPOS, { easeEnds: false }), lk = path(t, CAMLOOK, { easeEnds: false }), d = drift(lt, fin ? .7 : .25);
    const punch = fin ? 0 : punchAt(t, WD) * 1.4;
    let shk = [0, 0, 0]; for (const h of fin ? [...NAH, ...THROW, TWIST] : WD) if (t > h && t < h + .7) { const s = shake(t, (fin ? .3 : .18) * Math.exp(-(t - h) * 8)); shk = shk.map((v, j) => v + s[j]); }
    const land = WORLD.landing(t, DROP); if (fin) shk = shk.map((v, j) => v + land.shake[j]);
    const still = f > .05 ? 0 : 1;   // no drift/shake while the world is a paper cut-out
    cam({ pos: M(pos[0] + (d[0] + shk[0]) * still, pos[1] + (d[1] + shk[1]) * still, pos[2] + d[2] * still), look: M(lk[0] + shk[0] * .3 * still, lk[1] + shk[1] * .3 * still, lk[2]),
      fov: (fin ? kf(t, [[DROP, 34], [234.65, 40], [242.15, 42], [248.4, 40]]) : 34) - punch * 3, blur: fin ? .8 : .7 * (1 - f), focus: M(0, 4, 0), flat: f,
      outline: f >= .98 ? ease(seg(t, FLAT_C, FLAT_C + .35)) : 0 });   // exactly 1 at most: >1 extrapolates to negative colours (white halos)
    // ---------- light ----------
    if (!fin) {
      const dark = ease(seg(t, FLAT_A, 222.85));   // the moon light drains to black as the world flattens
      look({ ...WORLD.LOOK.moon, sky: WORLD.LOOK.moon.sky.map(c => mixVal(c, '#000000', dark)), keyInt: lerp(3.4, 2.6, dark), fill: lerp(.3, .2, dark), vignette: .35 + .1 * dark });
    } else look({ ...WORLD.LOOK.final, sky: WORLD.LOOK.final.sky.map((c, i) => mixVal(i === 1 ? '#a85a2a' : c, c, ease(seg(t, DROP, 236)))) });   // the gold sunrise comes up
    // ---------- the light pool (screen space): in toon mode shading ignores light, so the dark is a pool: first the whole row,
    // then Pip, then the pencil tip ----------
    if (!fin && t >= 220.3) {
      const a = ease(seg(t, 220.3, 222.85)), toPip = ease(seg(t, 222.85, 223.6)), tight = ease(seg(t, 224.6, 225.6)), J = P.userData.J;
      hud(ctx => {
        const c3 = window.__cam, toS = v => [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H];
        const [px, py] = toS(new THREE.Vector3(...F(PIP_SPOT[0], PIP_SPOT[1])).add(new THREE.Vector3(0, 3.0, 0)).project(c3));
        const [rcx, rcy] = toS(new THREE.Vector3(...M(0, 3.0, ROW_Z * .5)).project(c3));
        const tipW = new THREE.Vector3(0, -1.8, 0).applyMatrix4(J.gripR.matrixWorld), [tx, ty] = toS(tipW.project(c3));   // the pencil tip, as rendered
        const cx = lerp(lerp(rcx, px, toPip), tx, tight), cy = lerp(lerp(rcy, py, toPip), ty, tight);
        const rx = lerp(lerp(1000, 330, toPip), 200, tight) * (1 + .03 * Math.sin(t * 9)), ry = lerp(lerp(520, 330, toPip), 200, tight) * (1 + .03 * Math.sin(t * 9));
        ctx.save(); ctx.translate(cx, cy); ctx.scale(1, ry / rx);
        const g = ctx.createRadialGradient(0, 0, rx * .62, 0, 0, rx * 1.15); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`);
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
