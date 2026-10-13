// c06_bliss.js: 117.40–138.11 s, the BLISS spa district (pink). Verse 2b.
// Clawd (halo + spa robe, dripping gold glitter) sells heaven on a hard drive; Pip lies in a heart-bar cage on a plush bed
// wearing VR goggles; "Wake me up instead": Pip yanks them off, bursts the heart bars, climbs the pillow stack and pushes
// the painted-sky ceiling up: it flips away strip by strip on the half-beats and shows a real dawn. Pip walks the trail out
// toward the stage while the camera lifts into the Fb glide (c07 owns the landing at 138.11).
// Seams: F3 (doom → bliss) until 118.60; my path starts at F3.B and ends at Fb.A at 135.70; Fb glide 135.70–138.11.
// Eggs: EGGS.shoggoth as the smiley-masked spa receptionist (RLHF), a dish of red and blue pills on the spa desk.
(() => {
  const A = (dx = 0, dy = 0, dz = 0) => WORLD.at('bliss', dx, dy, dz);
  const L = { slick: 117.45, drive: 119.92, bed: 122.47, coma: 124.71, wake: bt(197.5), cage: 127.42, bars: bt(202), velvet: 129.81, tear: 132.53, mile: 135.56, end: 138.11 };
  const VELVET = '#923978', VELVET2 = '#B8456E', PINK = '#E4ADC8', ROSE = '#E27A92', CEIL_Y = 9, BACK = -14, HALF = 16;
  const STRIPS = 6, ORDER = [2, 3, 1, 4, 0, 5], PEEL = i => bt(207.5 + ORDER.indexOf(i) * .5);   // strip over Pip (i = 2) flips first
  const CAGE = [0, -5], PILLOWS = [-5, 1];

  // ---------- builders (cached) ----------
  function ceilingTexture() {   // a painted sky: too-blue gradient, puffy clouds, a smiling sun, visible brush strokes
    const c = document.createElement('canvas'); c.width = 1536; c.height = 1024; const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, '#5fb4f0'); gr.addColorStop(1, '#bfe6ff'); g.fillStyle = gr; g.fillRect(0, 0, 1536, 1024);
    for (let i = 0; i < 260; i++) { g.strokeStyle = `rgba(255,255,255,${.05 + .06 * hash(i)})`; g.lineWidth = 14 + 20 * hash(i + 1); g.beginPath(); const x = hash(i + 2) * 1536, y = hash(i + 3) * 1024; g.moveTo(x, y); g.lineTo(x + 120 + 80 * hash(i + 4), y + 20 * (hash(i + 5) - .5)); g.stroke(); }
    for (let k = 0; k < 7; k++) { const cx = 140 + k * 210 + 60 * hash(k), cy = 160 + 600 * hash(k + 9); g.fillStyle = '#ffffff';
      for (let j = 0; j < 5; j++) { g.beginPath(); g.arc(cx + (j - 2) * 46, cy - (j % 2) * 30, 52 + 14 * hash(k * 5 + j), 0, Math.PI * 2); g.fill(); } }
    const sx = 1180, sy = 300; g.strokeStyle = '#ffcf3a'; g.lineWidth = 16; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.moveTo(sx + Math.cos(a) * 120, sy + Math.sin(a) * 120); g.lineTo(sx + Math.cos(a) * 175, sy + Math.sin(a) * 175); g.stroke(); }
    g.fillStyle = '#ffd84a'; g.beginPath(); g.arc(sx, sy, 100, 0, Math.PI * 2); g.fill(); g.fillStyle = '#3a2a10'; g.beginPath(); g.arc(sx - 32, sy - 18, 10, 0, 7); g.arc(sx + 32, sy - 18, 10, 0, 7); g.fill();
    g.lineWidth = 9; g.strokeStyle = '#3a2a10'; g.beginPath(); g.arc(sx, sy + 8, 46, .3, Math.PI - .3); g.stroke();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  }
  // the ceiling: STRIPS hinged at the back wall; each flips up and over the wall, then leans down outside
  const ceiling = () => {
    const tex = ceilingTexture(), mat = new THREE.MeshStandardMaterial({ map: tex, roughness: .9, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: .35 });
    const g = new THREE.Group(), w = 2 * HALF / STRIPS, d = 22, hinges = [];
    for (let i = 0; i < STRIPS; i++) {
      const geo = new THREE.BoxGeometry(w - .005, .25, d), uv = geo.attributes.uv, n = geo.attributes.normal;
      for (let k = 0; k < uv.count; k++) if (n.getY(k) < -.5) uv.setXY(k, (i + uv.getX(k)) / STRIPS, uv.getY(k));   // the painted underside
      const m = new THREE.Mesh(geo, [mat, mat, matte('#f3e7c8'), mat, matte(VELVET2), matte(VELVET2)]);   // sides painted too: no pink seams between strips
      m.position.set(0, 0, d / 2);
      const h = new THREE.Group(); h.position.set(-HALF + w * (i + .5), CEIL_Y, BACK); h.add(m); g.add(h); hinges.push(h);
    }
    const holder = new THREE.Group(); holder.add(g); holder.userData.hinges = hinges; return holder;
  };
  const room = () => {
    const l = [];
    for (let x = -HALF + 1; x < HALF; x += 2) for (let z = BACK + 1; z < 8; z += 2) l.push(['3068b', ((x + z + 64) / 2) % 2 ? '#ffffff' : '#F6C5D8', x, .02, z]);    // checker floor
    for (let r = 1; r <= 7; r++) { for (let x = -HALF + 2; x <= HALF - 2; x += 4) l.push(['3010', r % 2 ? VELVET : VELVET2, x, r * 1.2, BACK - .5, 0]);
      for (let z = BACK + 2; z <= 6; z += 4) for (const s of [-1, 1]) l.push(['3010', r % 2 ? VELVET2 : VELVET, s * (HALF + .5), r * 1.2, z, Math.PI / 2]); }
    for (let x = -HALF + 1; x < HALF; x += 2) l.push(['3024', '#FFD45A', x, 8.8, BACK - .5]);                                  // gold trim
    // the spa desk (left) with a white top
    for (const x of [-12, -10, -8]) l.push(['3003', '#ffffff', x, 1.2, -2], ['3003', PINK, x, 2.4, -2], ['3022', '#ffffff', x, 2.8, -2]);
    // the pillow stack (Pip's stairs to the ceiling): 3 steps of pink 2x2 bricks, rising toward +x
    for (let s = 0; s < 3; s++) for (let k = 0; k <= s; k++) l.push(['3003', s % 2 ? PINK : '#f8dce8', PILLOWS[0] - 2 + s * 2, (k + 1) * 1.2, PILLOWS[1]]);
    // lounge beds along the back for the blissed-out guests
    for (const x of [-13, -9, 9, 13]) l.push(['3020', '#ffffff', x, .8, -10, Math.PI / 2], ['3069b', PINK, x, 1.2, -11.5, 0]);
    // Pip's plush bed inside the cage
    l.push(['3001', '#ffffff', CAGE[0] - 1, 1.2, CAGE[1], Math.PI / 2], ['3001', '#ffffff', CAGE[0] + 1, 1.2, CAGE[1], Math.PI / 2], ['3020', ROSE, CAGE[0] - 1, 1.6, CAGE[1] + .5, Math.PI / 2],
      ['3020', ROSE, CAGE[0] + 1, 1.6, CAGE[1] + .5, Math.PI / 2], ['3069b', '#ffffff', CAGE[0], 1.6, CAGE[1] - 1.6, 0]);
    // the trail out: tan tiles winding toward the stage (+z)
    for (let z = 9; z <= 80; z += 2) { const x = Math.round((-4 + 3 * Math.sin(z / 9)) / 2) * 2; l.push(['3068b', COL.tan, x, .02, z], ['3068b', COL.tan, x + 2, .02, z]); }
    return build(l);
  };
  // curtains: velvet folds hanging in front of the back wall
  const curtains = () => { const g = new THREE.Group(); for (const s of [-1, 1]) { const geo = new THREE.PlaneGeometry(9, 8.6, 36, 1), p = geo.attributes.position;
    for (let k = 0; k < p.count; k++) p.setZ(k, .35 * Math.sin(p.getX(k) * 3.2)); geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, matte(VELVET, { side: THREE.DoubleSide, roughness: .95 })); m.position.set(s * 11, 4.4, BACK + .4); m.castShadow = true; g.add(m); } return g; };
  // the heart-bar cage: pink bars around a heart outline; they bend outward at L.bars
  const heartPts = n => { const out = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; out.push([.2 * 16 * Math.sin(a) ** 3, -.2 * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) + .6]); } return out; };
  const heartCage = () => { const g = new THREE.Group(), bars = [], m = plastic('#ff5fa2', { roughness: .2, clearcoat: 1 });
    for (const [x, z] of heartPts(16)) { const piv = new THREE.Group(); piv.position.set(x, 0, z); const b = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 5.6, 8), m); b.position.y = 2.8; b.castShadow = true; piv.add(b); g.add(piv); bars.push(piv); }
    const top = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(heartPts(40).map(([x, z]) => new THREE.Vector3(x, 0, z)), true), 80, .12, 6, true), m); top.position.y = 5.6; g.add(top);
    g.userData = { bars, top }; return g; };
  const goggles = (lens = '#ff7ac0') => { const g = new THREE.Group(); const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, .55, .45), plastic('#1b1b22', { roughness: .2 })); g.add(body);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(1.32, .34, .05), glowMat(lens, 1.6)); glass.position.z = .24; g.add(glass);
    const strap = new THREE.Mesh(new THREE.TorusGeometry(.7, .06, 6, 30), plastic('#1b1b22')); strap.rotation.x = Math.PI / 2; strap.position.z = -.45; g.add(strap); return g; };
  const hardDrive = () => { const g = build([['3003', '#C9CACA', 0, 1.2, 0], ['3003', '#C9CACA', 0, 2.4, 0]]);   // a pedestal
    const box = new THREE.Mesh(new THREE.BoxGeometry(6, .9, 4.2), plastic('#C9CACA', { metalness: .8, roughness: .25 })); box.position.y = 3.1; g.add(box);
    const plat = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, .12, 40), plastic('#e8e8f0', { metalness: 1, roughness: .1 })); plat.position.set(-.7, 3.6, 0); g.add(plat);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(2.2, .12, .2), plastic(COL.black)); arm.position.set(1.2, 3.72, .6); arm.rotation.y = .5; g.add(arm);
    const cloud = new THREE.Group(); for (let j = 0; j < 4; j++) { const s = new THREE.Mesh(new THREE.SphereGeometry(.5 + .15 * j, 16, 10), plastic('#ffffff', { roughness: .6 })); s.position.set((j - 1.5) * .55, 4.3 + (j % 2) * .25, 0); cloud.add(s); } cloud.position.x = -.7; g.add(cloud);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(.9, .08, 8, 30), glowMat('#FFE38A', 2.4)); halo.rotation.x = Math.PI / 2; halo.position.set(-.7, 5.4, 0); g.add(halo);
    const lab = sign('c06-heaven', ['HEAVEN.exe'], { w: 3.6, h: .7, bg: '#1b1b22', fg: '#ffd45a', size: 300, glow: true }); lab.position.set(1.0, 2.75, 2.12); g.add(lab);
    const holder = new THREE.Group(); holder.add(g); holder.userData = { plat, halo }; return holder; };
  const note = () => { const g = new THREE.Group(), m = plastic('#3a1a3a'); const h = new THREE.Mesh(new THREE.SphereGeometry(.22, 12, 8), m); h.scale.set(1.3, 1, 1); g.add(h);
    const s = new THREE.Mesh(new THREE.BoxGeometry(.06, .8, .06), m); s.position.set(.26, .4, 0); g.add(s); return g; };
  const sparkle = () => { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.OctahedronGeometry(.16), glowMat('#FFD45A', 2.2))); return g; };

  // ---------- the district: room, ceiling, guests, life, eggs ----------
  district('bliss', { at: WORLD.D.bliss, r: 60 }, t => {
    put(keep('c06-room', room), ...A());
    put(keep('c06-curt', curtains), ...A(0, 0, .05 * Math.sin(t * .6)));
    put(sign('c06-bliss', ['BLISS'], { w: 7, h: 1.6, bg: '#ffe3ee', fg: '#c2387a', size: 150, glow: true }), ...A(0, 7.0, BACK + .2));
    // the ceiling flaps: each flips up and back over the wall on its half-beat, then leans down outside
    const ceil = keep('c06-ceil', ceiling); put(ceil, ...A());
    ceil.userData.hinges.forEach((h, i) => { const k = ease(seg(t, PEEL(i), PEEL(i) + .55)), fall = easeIn(seg(t, PEEL(i) + .45, PEEL(i) + .9));
      h.rotation.set(-(k * Math.PI * .92 + fall * .5) + .03 * Math.sin(t * 9 + i) * k * (1 - fall), 0, .05 * (hash(i) - .5) * k); });
    // a real dawn sun beyond the back wall (only matters once the ceiling is open)
    if (t > L.tear - .5) { const sun = keep('c06-sun', () => { const g = new THREE.Group(), s = new THREE.Mesh(new THREE.CircleGeometry(9, 48), glowMat('#ffd27a', 2.4)); g.add(s); return g; });
      put(sun, ...A(14, 22 + 5 * seg(t, L.tear, L.end), -140)); }
    // the giant hard drive (right back): its platter spins
    const hd = keep('c06-hd', hardDrive); hd.userData.plat.rotation.y = t * 9; hd.userData.halo.position.y = 5.4 + .15 * Math.sin(t * 2); put(hd, ...A(11, 0, -7), -.4);
    // blissed-out guests with VR goggles, lounging and bobbing on the beat
    [-13, -9, 9, 13].forEach((x, i) => { const f = fig('c06-guest' + i, crowdLook(i + 2));
      keep('c06-gg' + i, () => { const g = goggles(['#7ae0ff', '#ff7ac0', '#b48aff', '#7affb0'][i]); g.position.set(0, -.55, .55); f.userData.J.head.add(g); return g; }).visible = true;
      pose(f, { legL: 1.57, legR: 1.57, lean: -1.0, armL: 2.8, armR: 2.8, armLz: .35, armRz: .35, face: 'joy', bodyY: .05 * pulse(t + i * .1, 6), headTilt: -.2 });
      put(f, ...A(x, .05, -10.6), 0); });
    // a robot attendant shuttles towels past the desk
    const r = keep('c06-bot', robot), ph = frac(t / 7), k = ease(ph < .5 ? ph * 2 : 2 - ph * 2); robotPose(r, { walk: t * 2, carry: true });
    put(r, ...A(lerp(-6, 6, k), 0, -12.6), ph < .5 ? Math.PI / 2 : -Math.PI / 2);
    // bubbles drifting up
    const bub = keep('c06-bub', () => { const im = new THREE.InstancedMesh(new THREE.SphereGeometry(.3, 14, 10), plastic('#ffffff', { transparent: true, opacity: .35, roughness: .05, clearcoat: 1 }), 30); im.frustumCulled = false; const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; });
    const M = new THREE.Matrix4(), q = new THREE.Quaternion();
    for (let i = 0; i < 30; i++) { const u = frac(t * (.08 + .05 * hash(i + 7)) + hash(i)), s = .5 + 1.2 * hash(i + 3);
      M.compose(new THREE.Vector3(-14 + 28 * hash(i + 1) + .5 * Math.sin(t + i), u * CEIL_Y * 1.1, BACK + 1.5 + 9 * hash(i + 2)), q, new THREE.Vector3(s, s, s)); bub.userData.im.setMatrixAt(i, M); }
    bub.userData.im.instanceMatrix.needsUpdate = true; put(bub, ...A());
    // eggs (only while we're here: the shoggoth object is shared with the countryside egg)
    const lk = window.__camLook || [0, 0, 0];
    if (Math.hypot(lk[0] - 120, lk[2] + 120) > 140) {   // the countryside owns the shared shoggoth when the camera is near ITS spot
      const sp = A(-11, 0, -6); EGGS.shoggoth('c06', t, sp[0], sp[2], .15);
      const dish = keep('c06-dish', () => { const g = new THREE.Group(), d = part('4740', '#ffffff'); d.rotation.x = Math.PI; d.position.y = .9; g.add(d);
        [[COL.red, -.45, .1], [COL.blue, .45, -.1], [COL.red, .1, .5], [COL.blue, -.1, -.5]].forEach(([c, x, z], i) => { const p = pill(c, c); p.scale.setScalar(.55); p.position.set(x, 1.15, z); p.rotation.set(Math.PI / 2, 0, i); g.add(p); }); return g; });
      put(dish, ...A(-8.5, 2.8, -1.8), .4);
    }
  });

  // ---------- the shot (one continuous camera) ----------
  const CAM = [[118.60, [0, 6, 24], [0, 4, 0]], [119.92, [5, 5.6, 15], [6, 4.4, -2]], [121.2, [9, 6.4, 11], [11, 4.6, -6]], [122.47, [3, 7.8, 9], [0, 2.6, -5]],
    [124.71, [1, 8.0, 4.6], [0, 3.2, -4.6]], [126.4, [-.4, 7.4, 7.0], [0, 4.0, -5]], [127.42, [-5, 5.6, 7.5], [0, 3.4, -5]], [129.81, [-7, 4.6, 10], [-4, 6.5, -2]],
    [131.6, [-7, 4.0, 9.5], [-4.5, 7.6, -3]], [132.53, [0, 4.2, 12], [-2, 9.5, -5]], [134.4, [1, 8, 20], [0, 9.5, -3]], [135.70, [0, 12, 26], [0, 10, 0]]];
  const camPos = CAM.map(([t, p]) => [t, p]), camLook = CAM.map(([t, , l]) => [t, l]);

  function bliss(t, lt) {
    const q = t;   // smooth 24 fps motion
    // ---- camera
    if (t < WORLD.F.F3.t1) WORLD.apply(WORLD.flight('F3', t));
    else if (t >= WORLD.F.Fb.t0) { WORLD.apply(WORLD.flight('Fb', t)); look({ ...WORLD.LOOK.sunrise }); cam({ blur: .35 }); }
    else {
      const w = seg(t, 118.6, 119.6) * (1 - seg(t, 134.9, 135.7)), d = drift(lt, .5), p = path(t, camPos), l = path(t, camLook);
      let s = [0, 0, 0];   // a small bump each time a ceiling strip flips
      for (let i = 0; i < STRIPS; i++) if (t > PEEL(i) && t < PEEL(i) + .6) { const b = shake(t, .14 * Math.exp(-(t - PEEL(i)) * 9)); s = s.map((v, j) => v + b[j]); }
      s = s.map(v => v * (1 - seg(t, 134.9, 135.7)));
      cam({ pos: A(p[0] + d[0] * w + s[0], p[1] + d[1] * w + s[1], p[2] + d[2] * w + s[2]), look: A(...l),
        fov: kf(t, [[118.6, 34], [122.47, 34], [124.71, 30], [129.81, 34], [134.4, 38], [135.7, 36]]), blur: .8, focus: t < L.velvet ? A(0, 3.5, -5) : A(-3, 5, 0) });
      const dawn = ease(seg(t, L.tear, PEEL(5) + .6)), B = WORLD.LOOK.bliss, S = WORLD.LOOK.sunrise;
      look({ sky: mixVal(B.sky, S.sky, dawn), keyCol: mixVal(B.keyCol, S.keyCol, dawn), keyInt: lerp(B.keyInt, S.keyInt, dawn), fill: lerp(B.fill, S.fill, dawn), exposure: lerp(B.exposure, S.exposure, dawn),
        keyDir: dawn > 0 ? mixVal([-.55, 1, .65], S.keyDir, dawn) : [-.55, 1, .65] });
    }
    // ---- Clawd: halo + robe; gold glitter drips off it
    const C = clawd('c06', {});
    keep('c06-robe', () => { const g = new THREE.Group(), robe = new THREE.Mesh(new THREE.BoxGeometry(4.3, 1.35, 2.3), plastic('#ffffff', { roughness: .8 })); robe.position.y = 3.05; g.add(robe);
      const belt = new THREE.Mesh(new THREE.BoxGeometry(4.36, .28, 2.36), plastic(ROSE)); belt.position.y = 3.6; g.add(belt); C.userData.J.body.add(g); return g; });
    const offerGog = keep('c06-gog-c', () => { const g = new THREE.Group(), gg = goggles(); gg.rotation.y = Math.PI / 2; g.add(gg); return g; });
    let cp = { hat: 'halo', face: 'smug', armL: .4, armR: .4, bob: .15 * pulse(t, 5) };
    if (q < L.drive) cp = { ...cp, face: q < 118.6 ? 'neutral' : 'joy', armL: .8 + .2 * Math.sin(q * 3), armR: .8 + .2 * Math.sin(q * 3 + 1) };
    else if (q < L.bed) cp = { ...cp, face: 'smug', armR: 1.0, holdR: offerGog, lean: .1 * pulse(t, 4) };
    else if (q < L.wake) cp = { ...cp, face: 'joy', roll: .06 * Math.sin((t - OFF) / BEAT * Math.PI), armL: .6, armR: .6 };
    else if (q < L.bars) cp = { ...cp, face: 'shocked', armL: 1, armR: 1, bob: 0 };
    else if (q < L.tear) cp = { ...cp, face: 'fear', armL: 1.1, armR: 1.1, lean: -.15 };
    else { const e = 1 - seg(q, 134.5, 135.5); cp = { ...cp, face: q < 134.5 ? 'shocked' : 'suspicious', armL: 1.2 * e, armR: 1.2 * e, lean: -.25 * e }; }
    clawdPose(C, cp);
    const cx = q < L.bed ? lerp(5.5, 4, ease(seg(q, 119.5, 121))) : q < L.bars ? lerp(4, 6.5, ease(seg(q, L.bed, L.bed + .6))) : lerp(6.5, 7.5, ease(seg(q, L.bars, L.bars + .8)));
    put(C, ...A(cx, 0, -1.5), q < L.bed ? -.25 : -.9);
    if (q < L.wake) for (let i = 0; i < 12; i++) { const s = keep('c06-sp' + i, sparkle), u = frac(t * .8 + hash(i));
      put(s, ...A(cx + (hash(i + 1) - .5) * 3.6, 7.4 - u * 7.2, -1.5 + (hash(i + 2) - .5) * 2 + 1.2), t * 3 + i); }
    // ---- the heart cage: bars burst outward at L.bars
    const hc = keep('c06-cage', heartCage), burst = backOut(seg(q, L.bars, L.bars + .35)), topple = easeIn(seg(q, L.bars + .5, L.bars + 1.1));
    hc.userData.bars.forEach(b => { const a = Math.atan2(b.position.x, b.position.z), front = Math.max(0, Math.cos(a)), r = front * (burst * .5 + topple * 1.0) + (1 - front) * topple * .15;
      b.rotation.set(r * Math.cos(a), 0, -r * Math.sin(a) * .6); });   // the front bars burst open, then topple to the floor
    hc.userData.top.visible = burst < .05; put(hc, ...A(CAGE[0], 1.6, CAGE[1]));
    // ---- Pip (own fig instance: goggles ride on its head)
    const P = fig('pip-c06', PIP), J = P.userData.J;
    const gogOn = keep('c06-gog-p', () => { const g = goggles(); g.position.set(0, -.55, .55); J.head.add(g); return g; });
    const gogHand = keep('c06-gog-hand', () => { const g = new THREE.Group(), gg = goggles(); gg.rotation.set(0, Math.PI / 2, 0); g.add(gg); return g; });
    let pp, pos, ry = 0;
    if (q < L.wake) {   // in bed, leaning back on the pillow, goggles on, blissed
      const coma = seg(q, L.coma, L.coma + .4);
      pp = { legL: 1.57, legR: 1.57, lean: -.7 + .05 * pulse(t, 5), armL: 2.8, armR: 2.8, armLz: .35, armRz: .35, headTilt: .25, face: coma > .5 ? 'sleepy' : 'joy' };
      pos = [CAGE[0], .45, CAGE[1] + .2];
    } else if (q < L.cage) {   // "Wake me up instead": sits up, yanks the goggles off
      const k = ease(seg(q, L.wake, L.wake + .25));
      pp = { legL: 1.57, legR: 1.57, lean: lerp(-.7, .1, k), armR: lerp(2.8, 3.0, k), armL: lerp(2.8, .6, k), armLz: .35 * (1 - k), face: k < .6 ? 'shocked' : 'determined', holdR: k > .5 ? gogHand : null };
      pos = [CAGE[0], .45, CAGE[1] + .2];
    } else if (q < L.bars + .35) {   // stands on the bed, grips the heart bars, pushes
      const up = ease(seg(q, L.cage, L.cage + .4)), push = seg(q, L.bars - .5, L.bars) * (1 - seg(q, L.bars + .2, L.bars + .35));
      pp = { legL: 1.57 * (1 - up), legR: 1.57 * (1 - up), armL: 1.4, armR: 1.4, lean: .25 * push, face: 'determined' };
      pos = [CAGE[0], lerp(.45, 1.6, up), CAGE[1] + .2 + 1.2 * up];
    } else if (q < L.velvet + 1.0) {   // out through the bent bars, walking to the pillow stack, pointing up at the painted sky
      const k = ease(seg(q, L.bars + .35, L.velvet + .4)), from = [CAGE[0], CAGE[1] + 1.4], to = [PILLOWS[0] - 3.5, PILLOWS[1] + .2];
      pp = q < L.velvet ? { ...walk(q * 1.3), face: 'determined' } : { armR: 2.9, armL: .3, face: 'suspicious', headTilt: .5 };
      pos = [lerp(from[0], to[0], k), lerp(1.6, 0, ease(seg(q, L.bars + .35, L.bars + .7))), lerp(from[1], to[1], k)];
      ry = q < L.velvet ? Math.atan2(to[0] - from[0], to[1] - from[1]) : .3;
    } else if (q < 134.4) {   // climbs the pillow stairs (one step per beat) and shoves the ceiling up
      const u = seg(q, L.velvet + 1.0, L.tear - .2) * 3, step = Math.min(3, Math.floor(u)), sk = ease(Math.min(1, (u - step) / .5));
      const level = step >= 3 ? 3 : step + sk, pushing = q > L.tear - .2, shove = pushing ? Math.exp(-frac((q - OFF) / BEAT * 2) * 6) : 0;
      pp = pushing ? { armL: 3.05, armR: 3.05, armLz: .2, armRz: .2, face: q > PEEL(5) ? 'laugh' : 'determined', headTilt: .45, bodyY: .2 * shove }
        : { legL: .5 * Math.sin(sk * Math.PI), legR: -.3 * Math.sin(sk * Math.PI), armL: .4, armR: .4, face: 'determined', bodyY: .4 * Math.sin(sk * Math.PI) };
      pos = [PILLOWS[0] - 3.5 + level * 2 + (level > 0 ? .5 : 0), level * 1.2, PILLOWS[1]]; ry = pushing ? 0 : Math.PI / 2;
    } else {   // hops down and walks the trail out toward the stage
      const hop = seg(q, 134.4, 134.75), z = q < 134.75 ? lerp(PILLOWS[1], 4, hop) : 4 + (q - 134.75) * 3.4, x = -4 + 3 * Math.sin(z / 9) + 1;
      pp = q < 134.75 ? { armL: 2.6, armR: 2.6, legL: .4, legR: -.4, face: 'laugh' } : { ...walk((q - 134.75) * 1.5, { stride: .62 }), face: 'joy', armR: .2 };
      pos = [q < 134.75 ? lerp(PILLOWS[0] + 3, x, hop) : x, q < 134.75 ? 3.6 * (1 - hop) + 1.2 * Math.sin(hop * Math.PI) : 0, z];
    }
    gogOn.visible = q < L.wake + .12;
    pose(P, pp); put(P, ...A(...pos), ry);
    // "coma with a playlist": notes float up off the sleeper
    if (q > L.coma && q < L.wake + .6) { const fade = 1 - seg(q, L.wake, L.wake + .6);
      for (let i = 0; i < 6; i++) { const n = keep('c06-note' + i, note), u = frac(t * .5 + i / 6);
        put(n, ...A(CAGE[0] + .8 * Math.sin(u * 6 + i) - .5, 4 + u * 4, CAGE[1] - .6), Math.sin(t + i) * .5, .9 * Math.sin(u * Math.PI) * fade + .001); } }
  }
  shots([[117.40, bliss]]);
})();
