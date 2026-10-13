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
  district('bliss', { at: WORLD.D.bliss, r: 700 }, t => {   // r 700: drawn whenever it can be on screen (no pop-in on the horizon)
    put(keep('c06-room', room), ...A());
    put(keep('c06-curt', curtains), ...A(0, 0, .05 * Math.sin(t * .6)));
    put(sign('c06-bliss', ['BLISS'], { w: 7, h: 1.6, bg: '#ffe3ee', fg: '#c2387a', size: 150, glow: true }), ...A(0, 7.0, BACK + .2));
    // the ceiling flaps: each flips up and back over the wall on its half-beat, then leans down outside
    const ceil = keep('c06-ceil', ceiling); put(ceil, ...A());
    ceil.userData.hinges.forEach((h, i) => { const k = ease(seg(t, PEEL(i), PEEL(i) + .55)), fall = easeIn(seg(t, PEEL(i) + .45, PEEL(i) + .9));
      h.rotation.set(-(k * Math.PI * .92 + fall * .5) + .03 * Math.sin(t * 9 + i) * k * (1 - fall), 0, .05 * (hash(i) - .5) * k); });
    // a real dawn sun beyond the back wall: below the horizon until the ceiling opens, then it rises
    const sun = keep('c06-sun', () => { const g = new THREE.Group(), s = new THREE.Mesh(new THREE.CircleGeometry(9, 48), glowMat('#ffd27a', 2.4)); g.add(s); return g; });
    put(sun, ...A(14, lerp(-14, 22, ease(seg(t, L.tear - .3, L.end))) + 5 * seg(t, L.tear, L.end), -140));
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
    // eggs: the smiley-masked shoggoth receptionist and the red/blue pill dish on the desk
    const sp = A(-11, 0, -6); EGGS.shoggoth('c06', t, sp[0], sp[2], .15);
    const dish = keep('c06-dish', () => { const g = new THREE.Group(), d = part('4740', '#ffffff'); d.rotation.x = Math.PI; d.position.y = .9; g.add(d);
      [[COL.red, -.45, .1], [COL.blue, .45, -.1], [COL.red, .1, .5], [COL.blue, -.1, -.5]].forEach(([c, x, z], i) => { const p = pill(c, c); p.scale.setScalar(.55); p.position.set(x, 1.15, z); p.rotation.set(Math.PI / 2, 0, i); g.add(p); }); return g; });
    put(dish, ...A(-8.5, 2.8, -1.8), .4);
    actors(t);   // the cast lives in the district, so they persist (pure function of t) before and after this chapter
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
  }

  // ---------- the cast (called from the district: pure function of t, persists before/after the chapter) ----------
  const LV = { x: L => -9 + L * 2, y: L => L * 1.2 };   // pillow-stair levels: 0 = floor in front, 3 = top brick (x -3)
  const STAND = [CAGE[0], CAGE[1] + 2.1];                 // where Pip stands to push the heart bars (just inside the tip)
  const TOSS_TO = [2.6, 0, -1.2];                          // where the yanked goggles land on the floor
  const GOG_OFF = new THREE.Matrix4().makeTranslation(0, -.55, .55);
  // Pip's stages; each returns { pp, pos, ry }. Boundaries blend over .25 s, so no joint snaps.
  function pipStage(i, q) {
    if (i === 0) { const coma = seg(q, L.coma, L.coma + .4);   // in bed, leaning back on the pillow, goggles on
      return { pp: { legL: 1.57, legR: 1.57, lean: -.7 + .05 * pulse(q, 5), armL: 2.8, armR: 2.8, armLz: .35, armRz: .35, headTilt: .25, face: coma > .5 ? 'sleepy' : 'joy' }, pos: [CAGE[0], .45, CAGE[1] + .2], ry: 0 }; }
    if (i === 1) {   // "Wake me up instead": sits up, right hand to the goggles (grab at L.wake), then up and away with them
      const sit = ease(seg(q, L.wake - .3, L.wake)), lift = ease(seg(q, L.wake + .05, L.wake + .35));
      return { pp: { legL: 1.57, legR: 1.57, lean: lerp(-.7, .1, sit), armR: lerp(lerp(2.8, 2.2, sit), 3.0, lift), armRz: .7 * sit * (1 - lift), armL: lerp(2.8, .6, sit), armLz: .35 * (1 - sit),
        head: 0, headTilt: lerp(.25, 0, sit), face: q < L.wake + .15 ? 'shocked' : 'determined' }, pos: [CAGE[0], .45, CAGE[1] + .2], ry: 0 }; }
    if (i === 2) {   // stands, steps off the bed to the heart's tip, tosses the goggles, grips the bars, pushes
      const up = ease(seg(q, L.cage, L.cage + .4)), fwd = ease(seg(q, L.cage + .35, L.cage + .9)), push = seg(q, L.bars - .5, L.bars) * (1 - seg(q, L.bars + .2, L.bars + .35));
      const toss = seg(q, L.cage, L.cage + .3), grip = ease(seg(q, L.cage + .7, L.cage + 1.0));
      return { pp: { legL: 1.57 * (1 - up), legR: 1.57 * (1 - up), armR: lerp(lerp(3.0, 2.2, toss), 1.45, grip), armL: lerp(.6, 1.45, grip), lean: .25 * push, face: 'determined', ...(fwd > 0 && fwd < 1 ? { legL: .4 * Math.sin(fwd * Math.PI * 2), legR: -.4 * Math.sin(fwd * Math.PI * 2) } : {}) },
        pos: [lerp(CAGE[0], STAND[0], fwd), lerp(.45, 1.6, up) * (1 - fwd) + 0 * fwd + (fwd > 0 && fwd < 1 ? .4 * Math.sin(fwd * Math.PI) : 0), lerp(CAGE[1] + .2, STAND[1], fwd)], ry: 0 }; }
    if (i === 3) {   // out through the burst bars, walking (distance-driven gait) to the pillow stairs, then points up
      const s = stepTo(q, [[L.bars + .35, STAND], [L.bars + .9, [STAND[0], STAND[1] + 2.2]], [L.velvet + .3, [LV.x(0), PILLOWS[1]]]]);
      return { pp: q < L.velvet + .3 ? { ...s.pose, face: 'determined' } : { armR: 2.9, armL: .3, face: 'suspicious', headTilt: .5 }, pos: [s.x, 0, s.z], ry: q < L.velvet + .3 ? s.ry : .3 }; }
    if (i === 4) {   // climbs one step per beat, then shoves the painted ceiling up on the half-beats
      const u = seg(q, L.velvet + 1.0, L.tear - .4) * 3, st0 = Math.min(3, Math.floor(u)), sk = st0 >= 3 ? 1 : ease(Math.min(1, (u - st0) / .5)), lev = Math.min(3, st0 + sk);
      const pushing = q > L.tear - .3, k = ease(seg(q, L.tear - .3, L.tear)), shove = pushing ? Math.exp(-frac((q - OFF) / BEAT * 2) * 6) : 0;
      const climb = { legL: .5 * Math.sin(sk * Math.PI), legR: -.3 * Math.sin(sk * Math.PI), armL: .4, armR: .4, face: 'determined' };
      const push = { armL: 3.05, armR: 3.05, armLz: .18, armRz: .18, face: q > PEEL(5) ? 'laugh' : 'determined', headTilt: .45, bodyY: .3 + .25 * shove };   // up on tiptoe: hands meet the ceiling
      return { pp: blend(climb, push, k), pos: [LV.x(lev), st0 < 3 ? LV.y(st0) + sk * 1.2 + .5 * Math.sin(sk * Math.PI) : LV.y(3), PILLOWS[1]], ry: lerp(Math.PI / 2, 0, k) }; }
    // 5: hops down and walks the trail out toward the stage (keeps walking after the chapter, stops at the trail's end)
    const hop = seg(q, 134.4, 134.75), z = q < 134.75 ? lerp(PILLOWS[1], 4, hop) : Math.min(80, 4 + (q - 134.75) * 3.4), x = -4 + 3 * Math.sin(z / 9) + 1;   // smooth along the (snapped) tile trail
    const walking = q >= 134.75 && z < 80;
    return { pp: q < 134.75 ? { armL: 2.6, armR: 2.6, legL: .4, legR: -.4, face: 'laugh' } : walking ? { ...walk((q - 134.75) * 1.5, { stride: .62 }), face: 'joy', armR: .2 } : { face: 'joy', armR: 2.6 },
      pos: [q < 134.75 ? lerp(LV.x(3), x, hop) : x, q < 134.75 ? 3.6 * (1 - hop) + 1.2 * Math.sin(hop * Math.PI) : 0, z], ry: walking ? Math.atan2(3 / 9 * Math.cos(z / 9), 1) * ease(seg(q, 134.75, 135.2)) : 0 };
  }
  const STARTS = [-1e9, L.wake - .3, L.cage, L.bars + .35, L.velvet + 1.0, 134.4];
  function pipAt(q) {
    let i = 0; while (i + 1 < STARTS.length && q >= STARTS[i + 1]) i++;
    const cur = pipStage(i, q), k = i ? ease(seg(q, STARTS[i], STARTS[i] + .25)) : 1;
    if (k >= 1) return cur;
    const prev = pipStage(i - 1, q);
    return { pp: blend(prev.pp, cur.pp, k), pos: prev.pos.map((v, j) => lerp(v, cur.pos[j], k)), ry: lerp(prev.ry, cur.ry, k) };
  }
  function placePip(q) { const P = fig('pip-c06', PIP), s = pipAt(q); pose(P, s.pp); put(P, ...A(...s.pos), s.ry); P.updateWorldMatrix(true, true); return P; }
  // a goggle object placed in world space from a parent's world matrix (head or grip) times a local offset
  function placeAt(o, parent, off) { const m = parent.matrixWorld.clone(); if (off) m.multiply(off); const p = new THREE.Vector3(), qq = new THREE.Quaternion(), sc = new THREE.Vector3(); m.decompose(p, qq, sc);
    put(o); o.position.copy(p); o.quaternion.copy(qq); o.scale.setScalar(1); }

  function actors(t) {
    const q = t;
    // ---- Clawd: halo + robe; holds the spare goggles all chapter (raises them to offer at "heaven on a hard drive")
    const C = clawd('c06', {});
    keep('c06-robe', () => { const g = new THREE.Group(), robe = new THREE.Mesh(new THREE.BoxGeometry(4.3, 1.35, 2.3), plastic('#ffffff', { roughness: .8 })); robe.position.y = 3.05; g.add(robe);
      const belt = new THREE.Mesh(new THREE.BoxGeometry(4.36, .28, 2.36), plastic(ROSE)); belt.position.y = 3.6; g.add(belt); C.userData.J.body.add(g); return g; });
    const offerGog = keep('c06-gog-c', () => { const g = new THREE.Group(), gg = goggles(); gg.rotation.y = Math.PI / 2; g.add(gg); return g; });
    const offer = ease(seg(q, L.drive - .2, L.drive + .3)) * (1 - ease(seg(q, L.bed - .3, L.bed + .2)));
    let cp = { hat: 'halo', face: 'smug', armL: .4, armR: .4 + .7 * offer, bob: .15 * pulse(t, 5), holdR: offerGog };
    if (q < L.drive) cp = { ...cp, face: q < 118.6 ? 'neutral' : 'joy', armL: .7 + .2 * Math.sin(q * 3) };
    else if (q < L.bed) cp = { ...cp, face: 'smug', lean: .1 * pulse(t, 4) };
    else if (q < L.wake) cp = { ...cp, face: 'joy', roll: .06 * Math.sin((t - OFF) / BEAT * Math.PI), armL: .6 };
    else { const scare = ease(seg(q, L.wake, L.wake + .3)), back = ease(seg(q, L.bars - .2, L.bars + .3)), calm = ease(seg(q, 134.5, 135.5));
      cp = { ...cp, face: q < L.bars ? 'shocked' : q < L.tear ? 'fear' : q < 134.5 ? 'shocked' : 'suspicious', armL: lerp(.6, 1.1, scare) * (1 - calm) + .4 * calm, armR: lerp(.4, 1.1, scare) * (1 - calm) + .4 * calm, lean: -.2 * back * (1 - calm), bob: .15 * pulse(t, 5) * (1 - scare) }; }
    clawdPose(C, cp);
    const cx = lerp(lerp(lerp(5.5, 4, ease(seg(q, 119.5, 121))), 6.5, ease(seg(q, L.bed, L.bed + .6))), 7.5, ease(seg(q, L.bars, L.bars + .8))) - 0 * 0;
    const crx = lerp(-.25, -.9, ease(seg(q, L.bed - .3, L.bed + .3)));
    put(C, ...A(cx, 0, -1.5), crx);
    C.updateWorldMatrix(true, true); expect('clawd holds the spare goggles', limb(C, 'handR'), offerGog.getWorldPosition(new THREE.Vector3()).toArray(), .3);
    // gold glitter dripping off Clawd (each flake grows in, falls, shrinks out: no wrap jump); stops after the wake-up
    const drip = 1 - seg(q, L.wake - .5, L.wake);
    for (let i = 0; i < 12; i++) { const s = keep('c06-sp' + i, sparkle), u = frac(t * .8 + hash(i)), sz = Math.sin(u * Math.PI) * drip;
      if (sz < .2) continue;   // a flake is only drawn while big enough: its loop wraps while invisible
      put(s, ...A(cx + (hash(i + 1) - .5) * 3.6, 7.4 - u * 7.2, -1.5 + (hash(i + 2) - .5) * 2 + 1.2), t * 3 + i, sz); }
    // ---- the heart cage: bars burst outward at L.bars, then the front ones topple to the floor
    const hc = keep('c06-cage', heartCage), burst = backOut(seg(q, L.bars, L.bars + .35)), topple = easeIn(seg(q, L.bars + .5, L.bars + 1.1));
    hc.userData.bars.forEach(b => { const a = Math.atan2(b.position.x, b.position.z), front = Math.max(0, Math.cos(a)), r = front * (burst * .5 + topple * 1.0) + (1 - front) * topple * .15;
      b.rotation.set(r * Math.cos(a), 0, -r * Math.sin(a) * .6); });
    hc.userData.top.visible = true; hc.userData.top.position.y = 5.6 - 5.4 * topple; hc.userData.top.scale.setScalar(1 + .25 * burst);   // the top ring drops with the bars (no pop)
    put(hc, ...A(CAGE[0], 1.6, CAGE[1]));
    // ---- Pip
    const P = placePip(q), J = P.userData.J, gog = keep('c06-gog-p', () => goggles());
    const GRIP_OFF = new THREE.Matrix4().makeTranslation(0, .2, .1);
    if (q < L.wake) placeAt(gog, J.head, GOG_OFF);                                   // on the face
    else if (q < L.wake + .2) {                                                      // pulled off the face into the hand (no jump)
      placeAt(gog, J.head, GOG_OFF); const p0 = gog.position.clone(), q0 = gog.quaternion.clone();
      placeAt(gog, J.gripR, GRIP_OFF); const k = ease(seg(q, L.wake, L.wake + .2)); gog.position.lerpVectors(p0, gog.position, k); gog.quaternion.slerpQuaternions(q0, gog.quaternion, k);
    } else if (q < L.cage) placeAt(gog, J.gripR, GRIP_OFF);                           // yanked into the right hand
    else {                                                                           // tossed over the shoulder onto the floor
      const P0 = placePip(L.cage), from = new THREE.Vector3(); P0.userData.J.gripR.getWorldPosition(from); placePip(q);
      const to = A(...TOSS_TO), w = handoff(q, L.cage, L.cage + .55, from.toArray(), [to[0], to[1] + .25, to[2]], 2.5), k = seg(q, L.cage, L.cage + .55);
      put(gog, ...w, 0); gog.rotation.set(k * 5, k * 3, 0);
    }
    if (q > L.wake - .06 && q < L.wake + .05) expect('pip grabs the goggles', limb(P, 'handR'), gog.getWorldPosition(new THREE.Vector3()).toArray(), .9);
    if (q > L.bars - .5 && q < L.bars + .1) {   // both hands on the heart bars while pushing
      const bars = hc.userData.bars.map(b => b.getWorldPosition(new THREE.Vector3()));
      for (const h of ['handL', 'handR']) { const p = limb(P, h), n = bars.reduce((m, b) => Math.min(m, Math.hypot(b.x - p[0], b.z - p[2])), 1e9); expect('pip pushes the bars (' + h + ')', [n, 0, 0], [0, 0, 0], .7); }
    }
    if (q > L.tear - .05 && q < PEEL(5)) expect('pip shoves the ceiling', [0, limb(P, 'handR')[1], 0], [0, A(0, CEIL_Y, 0)[1], 0], 1.0);
    // "coma with a playlist": notes grow in, float up, shrink out
    const nf = seg(q, L.coma, L.coma + .4) * (1 - seg(q, L.wake, L.wake + .6));
    for (let i = 0; i < 6; i++) { const n = keep('c06-note' + i, note), u = frac(t * .5 + i / 6);
      put(n, ...A(CAGE[0] + .8 * Math.sin(u * 6 + i) - .5, 4 + u * 4, CAGE[1] - .6), Math.sin(t + i) * .5, Math.max(.001, .9 * Math.sin(u * Math.PI) * nf)); }
  }
  shots([[117.40, bliss]]);
})();
