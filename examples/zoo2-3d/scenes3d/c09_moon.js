// c09_moon.js: 189.17–214.94 s, the MOON district (floats at y = WORLD.MOON_Y). One continuous camera path.
// Seed rocket lands → crew unloads backups → lava-tube vault seals, lights off → Ctrl+S saves the species (giant floppy) →
// a human's hand on the switch while the red team pokes a tiny model → a gold-laden car brakes at the cliff edge →
// fix a pump, grow a bean, know your neighbour → the press prints the manual → sequels fill the shelf → the people plant
// the pencil flag. Hands off to c10 on the shared Fm glide.
// Beats (94 BPM from 0.266 s): bar lines at bt(296) 189.20, bt(300) 191.75, bt(304) 194.31, bt(308) 196.86, bt(312) 199.41,
// bt(316) 201.97, bt(320) 204.52, bt(324) 207.07, bt(328) 209.63, bt(332) 212.18, bt(336) 214.73.
(() => {
  const MY = WORLD.MOON_Y, C = WORLD.D.moon;
  const M = (dx, dy, dz) => [C[0] + dx, MY + dy, C[1] + dz];                 // moon-local → world
  // run a helper that put()s at y = 0 (eggs, buildSite, sign...) and lift what it added onto the moon
  const onMoon = fn => { const n0 = ROOT.children.length; fn(); for (let i = n0; i < ROOT.children.length; i++) ROOT.children[i].position.y += MY; };
  const G = (dx, dz) => [C[0] + dx, C[1] + dz];                              // ground x/z
  const GREY = '#9a9ca0', DKG = '#5e6066';

  // ---------- set pieces (built once) ----------
  const moonSurface = () => { const g = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CircleGeometry(170, 64), matte('#8d8f94')); disc.rotation.x = -Math.PI / 2; disc.position.y = -.05; disc.receiveShadow = true; g.add(disc);
    const l = []; for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) l.push(['3958', (i + j) % 3 ? GREY : '#a6a8ac', (i - 4) * 6, 0, (j - 4) * 6 - 6]);
    // craters: rings of round plates around dark tile floors
    for (const [cx, cz, r] of [[-30, 18, 4], [26, -28, 3], [-36, -30, 5], [34, 22, 3], [-8, 36, 2.5], [44, -6, 4]]) {
      for (let a = 0; a < 24; a++) { const q = a / 24 * Math.PI * 2; l.push(['6141', '#b4b6ba', cx + Math.cos(q) * r, .4, cz + Math.sin(q) * r]); }
      for (let x = -r + 1; x < r; x += 1) for (let z = -r + 1; z < r; z += 1) if (x * x + z * z < (r - .8) ** 2) l.push(['3070b', '#5a5c62', cx + x, .02, cz + z]); }
    // a small moon ISLAND floating in space: from the F5 climb you see it as a world, with stars and Earth behind
    const under = new THREE.Mesh(new THREE.SphereGeometry(170, 64, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), matte('#7d7f85', { side: THREE.DoubleSide }));
    under.scale.y = .5; under.position.y = -.4; g.add(under);
    for (let i = 0; i < 40; i++) { const a = hash(i + 200) * Math.PI * 2, r = 30 + hash(i + 201) * 125, cr = new THREE.Mesh(new THREE.CircleGeometry(3 + hash(i + 202) * 8, 24), matte('#62646a', { side: THREE.DoubleSide }));
      const y = -Math.sqrt(Math.max(0, 1 - (r / 170) ** 2)) * 170 * .5 - .2; cr.position.set(Math.cos(a) * r * 1.002, y - .6, Math.sin(a) * r * 1.002); cr.lookAt(cr.position.x * 2, cr.position.y * 2 + .0001, cr.position.z * 2); g.add(cr); }
    g.add(build(l)); return g; };
  const sky = () => { const g = new THREE.Group();
    const c = document.createElement('canvas'); c.width = 512; c.height = 256; const x = c.getContext('2d'); x.fillStyle = '#2a64c8'; x.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 40; i++) { x.fillStyle = i % 3 ? '#4f9a4a' : '#c8b47a'; x.beginPath(); x.ellipse(hash(i) * 512, 40 + hash(i + 9) * 176, 20 + hash(i + 3) * 50, 10 + hash(i + 4) * 26, hash(i + 5) * 3, 0, 7); x.fill(); }
    for (let i = 0; i < 30; i++) { x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.ellipse(hash(i + 50) * 512, hash(i + 60) * 256, 30, 8, 0, 0, 7); x.fill(); }
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const earth = new THREE.Mesh(new THREE.SphereGeometry(60, 48, 32), new THREE.MeshStandardMaterial({ map: tex, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: .55, roughness: .6 }));
    const halo = new THREE.Mesh(new THREE.SphereGeometry(64, 32, 16), new THREE.MeshBasicMaterial({ color: '#7fb6ff', transparent: true, opacity: .18, side: THREE.BackSide }));
    const e = new THREE.Group(); e.add(earth, halo); e.position.set(-160, 170, -520); g.add(e); g.userData.earth = earth;
    const pts = []; for (let i = 0; i < 1400; i++) { const u = hash(i * 3.1) * 2 - 1, a = hash(i * 7.7) * Math.PI * 2, r = Math.sqrt(1 - u * u); pts.push(r * Math.cos(a) * 1300, Math.abs(u) * 1300 * .9 + 40, r * Math.sin(a) * 1300); }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    g.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: '#ffffff', size: 2.2, sizeAttenuation: false, fog: false }))); return g; };
  const pad = () => { const l = []; for (let x = -6; x <= 6; x += 2) for (let z = -6; z <= 6; z += 2) l.push(['3068b', Math.abs(x) === 6 || Math.abs(z) === 6 ? COL.mustard : COL.dkgrey, x, .42, z]); return build(l); };
  // the seed rocket: the SAME design as c08's (cream hull, red nose/bands/fins, hex window), so the hand-off at F5.t1 is seamless.
  // c08 draws it until F5.t1 (hovering at moon (0, 8, 0)); this file lands it on the pad and keeps it there.
  const rocketObj = () => { const g = new THREE.Group(), CREAM = '#F3E7C8', RED = COL.red;
    const hull = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 9, 32), plastic(CREAM)); hull.position.y = 4.5; g.add(hull);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.2, 32), plastic(RED)); nose.position.y = 10.6; g.add(nose);
    for (const y of [2.0, 7.4]) { const band = new THREE.Mesh(new THREE.CylinderGeometry(1.63, 1.63, .5, 32), plastic(RED)); band.position.y = y; g.add(band); }
    const win = new THREE.Mesh(new THREE.CircleGeometry(.6, 24), plastic('#7fb3e0', { roughness: .1 })); win.position.set(0, 6.0, 1.62); g.add(win);
    const hc = document.createElement('canvas'); hc.width = hc.height = 256; const x = hc.getContext('2d'); x.fillStyle = '#F2CD37'; x.beginPath(); x.arc(128, 128, 124, 0, 7); x.fill();
    x.fillStyle = '#c4281c'; x.beginPath(); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, r = i % 2 ? 40 : 100; x.lineTo(128 + Math.cos(a) * r, 128 + Math.sin(a) * r); } x.fill();
    const ht = new THREE.CanvasTexture(hc); ht.colorSpace = THREE.SRGBColorSpace;
    const hx = new THREE.Mesh(new THREE.CircleGeometry(.75, 32), new THREE.MeshStandardMaterial({ map: ht, roughness: .5 })); hx.position.set(0, 4.2, 1.62); g.add(hx);
    for (let k = 0; k < 3; k++) { const f = new THREE.Mesh(new THREE.BoxGeometry(.25, 2.6, 1.6), plastic(RED)); const p = new THREE.Group(); p.rotation.y = k * Math.PI * 2 / 3; f.position.set(0, 1.0, 2.1); p.add(f); g.add(p); }
    const flame = new THREE.Mesh(new THREE.ConeGeometry(1.1, 4, 16), glowMat('#ff8a2a', 3)); flame.rotation.x = Math.PI; flame.position.y = -2; g.add(flame); g.userData.flame = flame;
    g.traverse(m => m.isMesh && (m.castShadow = true)); return g; };
  const crate = (kind) => () => { const c = kind === 'egg' ? COL.white : kind === 'seed' ? COL.brown : COL.ltblue, l = [['3003', c, 0, 1.2, 0], ['3003', c, 0, 2.4, 0]];
    if (kind === 'egg') for (const [a, b] of [[-.5, -.5], [.5, -.5], [-.5, .5], [.5, .5]]) l.push(['98138', '#fff4e0', a, 2.45, b]);
    if (kind === 'seed') for (const [a, b] of [[-.5, -.5], [.5, .5]]) l.push(['30176', COL.green, a, 2.4, b, hash(a + b)]);
    if (kind === 'ice') for (const [a, b] of [[-.5, -.5], [.5, .5], [-.5, .5]]) l.push(['3070b', COL.white, a, 2.42, b]);
    return build(l); };
  const vaultObj = () => { const g = new THREE.Group(), l = [];
    // a lava-tube mouth: a stepped mound of dark plates with an arched opening
    for (let s = 0; s < 6; s++) { const w = 9 - s; for (let u = -w; u <= w; u++) for (let v = -3; v <= 2; v++) if (Math.abs(u) === w || v === -3 || s === 5) l.push(['3958', s % 2 ? DKG : '#6c6e74', u * 2, s * 1.2 + .4, v * 2 - 2]); }
    for (let r = 1; r <= 6; r++) for (const x of [-6, -5, 5, 6]) l.push(['3005', '#4a4c52', x, r * 1.2, 2]);
    for (let x = -6; x <= 6; x++) l.push(['3005', '#4a4c52', x, 7.2, 2]);
    g.add(build(l));
    const inside = new THREE.Mesh(new THREE.PlaneGeometry(10, 7), matte('#111216')); inside.position.set(0, 3.6, 1); g.add(inside);
    const lamps = []; for (const x of [-4, 4]) { const lamp = new THREE.Mesh(new THREE.SphereGeometry(.45, 16, 10), glowMat('#ffe7a0', 2.5)); lamp.position.set(x, 6.4, 2.6); g.add(lamp); lamps.push(lamp); }
    g.userData.lamps = lamps; return g; };
  // the big round vault door with a brick floppy-disk "save" icon on it
  const doorObj = () => { const g = new THREE.Group(); const d = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, .8, 48), plastic('#c9cacd', { metalness: .4, roughness: .3 })); d.rotation.x = Math.PI / 2; d.castShadow = true; g.add(d);
    const body = new THREE.Mesh(new THREE.BoxGeometry(5.2, 5.2, .4), plastic('#2a58b8')); body.position.z = .55; g.add(body);
    const shutter = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.7, .2), plastic(COL.silver, { metalness: .8, roughness: .25 })); shutter.position.set(.3, 1.6, .85); g.add(shutter);
    const slot = new THREE.Mesh(new THREE.BoxGeometry(.6, 1.1, .2), plastic('#2a58b8')); slot.position.set(.9, 1.6, .95); g.add(slot);
    const label = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.2, .2), glowMat('#f4f4f4', 0)); label.position.set(0, -1.2, .85); g.add(label); g.userData.label = label;
    return g; };
  const keyCap = (txt) => () => { const g = new THREE.Group(); const k = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.4, 4.4), plastic('#f2f2ee')); k.position.y = .7; k.castShadow = true; g.add(k);
    const top = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), new THREE.MeshStandardMaterial({ map: signTexture(txt, { bg: '#f2f2ee', fg: '#222', size: txt.length > 1 ? 230 : 380, font: 'system-ui', pw: 512, ph: 512 }), roughness: .5 }));
    top.rotation.x = -Math.PI / 2; top.position.y = 1.41; g.add(top); return g; };
  const leverObj = () => { const g = new THREE.Group(); g.add(build([['3003', COL.dkgrey, 0, 1.2, 0], ['3003', COL.dkgrey, 0, 2.4, 0]]));
    const arm = new THREE.Group(); arm.position.set(0, 2.6, 0); const rod = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, 3, 10), plastic(COL.silver, { metalness: .7 })); rod.position.y = 1.5; arm.add(rod);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(.4, 14, 10), plastic(COL.red)); knob.position.y = 3; arm.add(knob); g.add(arm); g.userData.arm = arm; return g; };
  const tableObj = () => build([['3020', COL.white, 0, 2.4, 0, 0], ['3005', COL.dkgrey, -1.5, 1.2, -.5], ['3005', COL.dkgrey, 1.5, 1.2, .5]]);
  const lensObj = () => { const g = new THREE.Group(); const r = new THREE.Mesh(new THREE.TorusGeometry(.8, .12, 10, 28), plastic(COL.black)); g.add(r);
    const gl = new THREE.Mesh(new THREE.CircleGeometry(.75, 24), new THREE.MeshPhysicalMaterial({ color: '#cfe8ff', transparent: true, opacity: .35, roughness: .05 })); g.add(gl);
    const h = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, 1.4, 8), plastic(COL.black)); h.position.y = -1.4; g.add(h); return g; };
  const carObj = () => { const g = build([['3020', COL.red, 0, .8, 0, 0], ['3003', COL.red, -.5, 2.0, 0, 0], ['3062b', COL.black, -1.5, .8, 1.3], ['3062b', COL.black, 1.5, .8, 1.3], ['3062b', COL.black, -1.5, .8, -1.3], ['3062b', COL.black, 1.5, .8, -1.3]]);
    const coins = new THREE.Group(); for (let i = 0; i < 9; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, .18, 18), plastic(COL.gold, { metalness: .8, roughness: .25 })); c.position.set(1 + (i % 3) * .5 - .5, 1.3 + Math.floor(i / 3) * .2, (i % 2) * .5 - .25); coins.add(c); }
    g.add(coins); const wrap = new THREE.Group(); wrap.add(g); return wrap; };
  const pumpObj = () => { const g = new THREE.Group(); g.add(build([['3003', COL.blue, 0, 1.2, 0], ['3003', COL.blue, 0, 2.4, 0], ['3005', COL.silver, 1.2, 2.4, 0]]));
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(1, .14, 8, 20), plastic(COL.red)); wheel.position.set(0, 3.2, 1.2); g.add(wheel); g.userData.wheel = wheel; return g; };
  const pressObj = () => { const g = new THREE.Group(); g.add(build([['3001', COL.dkgrey, 0, 1.2, 0], ['3001', COL.dkgrey, 0, 2.4, 0], ['3001', COL.dkgrey, 0, 3.6, 0], ['3022', COL.red, 0, 4.0, 0]]));
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(.6, .6, 3.6, 18), plastic(COL.black)); roll.rotation.z = Math.PI / 2; roll.position.set(0, 2.6, 1.3); g.add(roll); g.userData.roll = roll; return g; };
  const sheetObj = () => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.2), PAPER()); m.castShadow = true; const g = new THREE.Group(); m.rotation.x = -Math.PI / 2; g.add(m); return g; };
  const shelfObj = () => { const l = []; for (let r = 1; r <= 5; r++) for (const x of [-4, 4]) l.push(['3005', COL.brown, x, r * 1.2, 0]); for (const y of [.4, 2.8, 5.2]) for (let x = -3; x <= 3; x += 2) l.push(['3020', COL.brown, x, y + .4, 0, Math.PI / 2]);
    return build(l); };
  const bookObj = (i) => () => { const m = new THREE.Mesh(new THREE.BoxGeometry(.5, 1.8, 1.4), plastic([COL.red, COL.blue, COL.green, COL.mustard, COL.magenta, COL.orange][i % 6])); m.castShadow = true; const g = new THREE.Group(); m.position.y = .9; g.add(m); return g; };
  const flagObj = () => { const g = new THREE.Group(); const pole = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, 9, 10), plastic(COL.silver, { metalness: .7 })); pole.position.y = 4.5; g.add(pole);
    const c = document.createElement('canvas'); c.width = 512; c.height = 320; const x = c.getContext('2d'); x.fillStyle = '#3A9C98'; x.fillRect(0, 0, 512, 320);
    x.save(); x.translate(256, 160); x.rotate(-.5); x.fillStyle = '#F2C53D'; x.fillRect(-150, -26, 240, 52); x.fillStyle = '#E4ADC8'; x.fillRect(-190, -26, 40, 52); x.fillStyle = '#F1D2A8';
    x.beginPath(); x.moveTo(90, -26); x.lineTo(160, 0); x.lineTo(90, 26); x.fill(); x.fillStyle = '#222'; x.beginPath(); x.moveTo(140, -8); x.lineTo(160, 0); x.lineTo(140, 8); x.fill(); x.restore();
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const geo = new THREE.PlaneGeometry(4.4, 2.75, 16, 4); const flag = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: .7 })); flag.position.set(2.3, 7.5, 0); flag.castShadow = true; g.add(flag);
    g.userData.flag = flag; g.userData.base = Float32Array.from(geo.attributes.position.array); return g; };
  // a clear fishbowl space helmet on a crew member's head (each moon figure is its own cached fig, so this never leaks)
  const helmet = f => { const J = f.userData.J; if (J.helmet) return; const h = new THREE.Mesh(new THREE.SphereGeometry(1.25, 28, 18), new THREE.MeshPhysicalMaterial({ color: '#e8f4ff', transparent: true, opacity: .22, roughness: .02, clearcoat: 1 }));
    h.position.set(0, -.55, 0); J.head.add(h); J.helmet = h; };
  const crew = (i) => { const f = fig('moonCrew' + i, { ...crowdLook(i + 2), torso: [COL.white, COL.orange, COL.white, COL.ltblue, COL.white, COL.mustard, COL.white, COL.lilac][i % 8] }); helmet(f); return f; };
  const pipM = () => fig('pip', PIP);   // the shared Pip, no helmet: c10 picks up the same figure at the pad centre
  const onPad = (x, z) => Math.abs(x) <= 7 && Math.abs(z) <= 7 ? .42 : 0;

  // positions (moon-local)
  const ROCKET = [-20, -6], FLAG = [12, 2], FLAGH = [15, 8], VAULT = [0, -36], KEYS = [9, -24], SWITCH = [2, -17], TABLE = [-5, -19], CLIFF = [-46, -4], ROADY = -4;
  const PUMP = [-12, 15], BEANS = [-3, 15], NEIGH = [10, 15], PRESS = [17, 13], SHELF = [26, 4];
  const ON = (p, dy = 0) => M(p[0], dy, p[1]);
  const V3 = a => new THREE.Vector3(...a);
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const rotY = (v, y) => [v[0] * Math.cos(y) + v[2] * Math.sin(y), v[1], -v[0] * Math.sin(y) + v[2] * Math.cos(y)];
  // a smooth window weight: 0 → 1 over [a - f, a], 1 → 0 over [b, b + f] (pose changes blend instead of snapping)
  const win = (t, a, b, f = .25) => seg(t, a - f, a) * (1 - seg(t, b, b + f));

  // ---------- calibration: where Pip's right hand is (relative to his feet, facing +z) for a given pose ----------
  // A private copy of Pip that is never put() in the world; same geometry, so the offsets hold for the real Pip.
  const handOf = (name, p) => keep('c09cal:' + name, () => { const f = fig('c09cal', PIP); pose(f, p); f.position.set(0, 0, 0); f.rotation.set(0, 0, 0); f.scale.setScalar(1);
    f.updateWorldMatrix(true, true); return f.userData.J.gripR.getWorldPosition(new THREE.Vector3()).toArray(); });
  const P_LEVER = { armR: 1.3, armL: .2, head: .6, face: 'suspicious' }, P_FLAG = { armR: 1.0, armL: .3 }, P_FLAGUP = { armR: 1.55, armL: .5 };
  const P_BOOK = { armR: 1.15, armL: 1.15 }, P_BOOKUP = { armR: 2.75, armL: 2.75 };
  // the switch: its knob is set to the height of Pip's hand in P_LEVER, so the hand really rests on it
  const leverCal = () => keep('c09cal:lever', () => { const h = handOf('lever', P_LEVER), th = Math.acos(clamp((h[1] - 2.6) / 3, -1, 1));
    const knob = [SWITCH[0], 2.6 + 3 * Math.cos(th), SWITCH[1] - 3 * Math.sin(th)], yaw = -Math.PI / 2, o = rotY(h, yaw);
    return { th, knob, yaw, spot: [knob[0] - o[0], knob[2] - o[2]] }; });
  const flagCal = () => keep('c09cal:flag', () => { const h = handOf('flag', P_FLAG), yaw = -Math.PI / 2, o = rotY(h, yaw);
    return { grip: h[1], yaw, pick: [FLAGH[0] - o[0], FLAGH[1] - o[2]], plant: [FLAG[0] - o[0], FLAG[1] - o[2]] }; });

  // ---------- the landing: c08's rocket, taken over at F5.t1 (same cached object, so nothing pops) ----------
  // c08 hands it over upright, hovering above the pad; it eases off the pad to ROCKET and touches down on bt(300) 191.75.
  const LAND = 191.75;
  function rocketAt(t) {
    // start from EXACTLY where c08 leaves it: its live position at F5.t1, upright (c08 rights it before the hand-off)
    const t1 = WORLD.F.F5.t1, P0 = window.C08 ? C08.rocketPos(t1) : M(0, 8, 0);
    const k = easeOut(seg(t, t1, LAND)), rk = keep('c08:rocket', rocketObj);
    rk.userData.flame.visible = t < LAND + .25; rk.userData.flame.scale.set(1, (1.4 - .9 * k) * (1 + .15 * Math.sin(t * 47)), 1);
    const bump = t > LAND ? .25 * Math.exp(-(t - LAND) * 9) * Math.sin((t - LAND) * 40) : 0, end = M(ROCKET[0], .4, ROCKET[1]);
    put(rk, lerp(P0[0], end[0], k), lerp(P0[1], end[1], k) + bump, lerp(P0[2], end[2], k), 0);
    rk.quaternion.identity();   // upright, as c08 hands it over
    // c08's smoke-trail puffs: the same objects, same formula, shrinking away over .8 s (instead of vanishing)
    const fade = 1 - seg(t, WORLD.F.F5.t1, WORLD.F.F5.t1 + .8);
    if (fade > 0 && window.C08) for (let k2 = 1; k2 <= 16; k2++) {
      const tk = t - k2 * .07; if (tk < 187.0) break; const pp = C08.rocketPos(tk);
      const m = keep('c08:puff' + k2, () => new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), keep('c08:puffmat', () => plastic('#f4f1ea', { roughness: .9 }))));
      put(m, pp[0] + Math.sin(k2 * 3.1) * .06 * k2, pp[1] - 1.5, pp[2] + Math.cos(k2 * 2.3) * .06 * k2, 0, (.8 + k2 * .28) * Math.max(.001, fade));
    }
  }
  // the flag: in its holder until Pip pulls it out, carried (drawn by the shot), planted at FLAG on bt(333) 212.82
  const PICK = 211.25, PLANT = bt(333);
  function flagWave(fl, t) { const geo = fl.userData.flag.geometry, pos = geo.attributes.position, base = fl.userData.base;
    for (let i = 0; i < pos.count; i++) { const x = base[i * 3]; pos.setZ(i, .25 * Math.sin(x * 1.6 - t * 6) * (x + 2.2) / 4.4); } pos.needsUpdate = true; geo.computeVertexNormals(); }
  function flagAt(t) {
    put(keep('flag-holder', () => build([['6141', COL.dkgrey, 0, .4, 0], ['3062b', COL.dkgrey, 0, 1.2, 0]])), ...ON(FLAGH));
    if (t >= PICK && t < PLANT) return;                      // in Pip's hands: the shot draws it
    const fl = keep('moon-flag', flagObj); flagWave(fl, t); put(fl, ...(t < PICK ? ON(FLAGH) : ON(FLAG)));
  }

  // ---------- the whole moon base is persistent world (drawn by the district, so it is still there in c10's frames) ----------
  const press = (t, tb) => .5 * Math.exp(-Math.max(0, t - tb) * 6) * (t > tb ? 1 : 0);
  // four carriers come out from behind the rocket with a crate each, run it into the vault, set it down inside, come out
  const KINDS = ['egg', 'seed', 'ice', 'ice'];
  const carrierPlan = i => { const t0 = 191.85 + .3 * i, t1 = t0 + 2.1, t2 = t1 + .35, t3 = t2 + 1.9;
    return { t0, t1, t2, t3, plan: [[t0, [ROCKET[0] - .9 + .6 * i, ROCKET[1] - 3.2]], [t1, [-3 + 2 * i, -40]], [t2, [-3 + 2 * i, -40]], [t3, [-22 - 3 * i, -46 + i]]] }; };
  function carriersAt(t) {
    for (let i = 0; i < 4; i++) {
      const c = carrierPlan(i); if (t < c.t0) continue;   // still inside the rocket: they step out from behind it
      const a0 = c.plan[0][1], a1 = c.plan[1][1], f = crew(20 + i), st0 = stepTo(t, c.plan, { run: true, face: Math.atan2(a1[0] - a0[0], a1[1] - a0[1]) });
      const holding = t < c.t1, w = win(t, c.t0 - 1, c.t1, .2);
      pose(f, blend({ ...st0.pose, bodyY: (st0.pose.bodyY || 0) + .3 * Math.abs(Math.sin(t * 6 + i)), face: 'determined' }, { armL: 1.1, armR: 1.1, armLz: -.15, armRz: -.15, face: 'determined', ...(st0.pose.legL != null ? { legL: st0.pose.legL, legR: st0.pose.legR } : {}) }, w));
      put(f, ...M(st0.x, 0, st0.z), st0.ry);
      const cr = keep('crate-' + KINDS[i] + i, crate(KINDS[i])), s = i >= 2 ? .9 : 1;
      const hands = mid(limb(f, 'handL'), limb(f, 'handR')), floor = M(-3 + 2 * i, 0, -41.6);
      let p = add(hands, [0, -1.2 * s, 0]);
      if (t >= c.t1) p = handoff(t, c.t1, c.t1 + .3, p, floor, .2);
      if (t < c.t1 && t > c.t0) expect(`carrier ${i} holds its crate`, limb(f, 'handR'), add(p, [0, 1.2 * s, 0]), 1.3);
      cr.position.set(...p); cr.rotation.set(0, st0.ry, 0); cr.scale.setScalar(s); ROOT.add(cr);
    }
  }
  // two shelvers move the sequels from a crate on the floor to the shelf, by hand, three books per beat (209.63 →)
  const BOOKT = i => bt(328) + i * BEAT / 3;
  const SH_ANG = -.9, ALONG = [Math.cos(SH_ANG), -Math.sin(SH_ANG)], FRONT = [Math.sin(SH_ANG), Math.cos(SH_ANG)];   // shelf axis and front normal (x, z)
  const onShelf = (a, f) => [SHELF[0] + ALONG[0] * a + FRONT[0] * f, SHELF[1] + ALONG[1] * a + FRONT[1] * f];
  // book i → shelver i % 2; each shelver fills the three columns on its own side, bottom row first
  const bookSlot = i => { const s = i % 2, k = Math.floor(i / 2), row = Math.floor(k / 3), lx = -3 + (s * 3 + k % 3) * 1.1, [x, z] = onShelf(lx, 0); return M(x, row ? 3.6 : 1.2, z); };
  const bookRow = i => Math.floor(Math.floor(i / 2) / 3);
  const shelverSpot = s => onShelf(s ? 1.4 : -1.9, 2.1), SHELVER_YAW = Math.atan2(-FRONT[0], -FRONT[1]);
  const crateSpot = s => onShelf(s ? 3.6 : -4.1, 1.6);
  function shelvesAt(t) {
    put(keep('moon-shelf', shelfObj), ...ON(SHELF), SH_ANG);
    const hand = [];
    for (let s = 0; s < 2; s++) {
      put(keep('book-crate' + s, () => build([['3003', COL.brown, 0, 1.2, 0, 0]])), ...ON(crateSpot(s)), SH_ANG);
      const f = crew(30 + s);
      // per book: reach to the crate (tb - .38), lift to the shelf row (tb - .22), place (tb), back to rest
      let pz = { armR: .5, armL: .3, lean: .1, twist: 0 };
      for (let i = s; i < 12; i += 2) { const tb = BOOKT(i), row = bookRow(i);
        pz = blend(pz, { armR: .45, armL: .3, lean: .3, twist: s ? -.5 : .5 }, win(t, tb - .4, tb - .32, .08));
        pz = blend(pz, { armR: row ? 1.75 : .85, armL: .3, lean: .05, twist: 0 }, win(t, tb - .22, tb, .1)); }
      pose(f, { ...pz, face: 'joy' }); put(f, ...ON(shelverSpot(s)), SHELVER_YAW);
      hand.push(limb(f, 'handR'));
    }
    for (let i = 0; i < 12; i++) {
      const b = keep('book' + i, bookObj(i)), tb = BOOKT(i), h = hand[i % 2], k = Math.floor(i / 2), c = crateSpot(i % 2);
      const [cx, cz] = [c[0] + ALONG[0] * ((k % 6) - 2.5) * .25, c[1] + ALONG[1] * ((k % 6) - 2.5) * .25], inCrate = M(cx, 1.0, cz);
      const held = add(h, [0, -.9, 0]);
      let p = inCrate;
      if (t >= tb - .38) p = handoff(t, tb - .38, tb - .22, inCrate, held, .3);
      if (t >= tb - .22) p = handoff(t, tb - .22, tb, held, bookSlot(i), .2);
      if (t > tb - .24 && t < tb - .2) expect(`book ${i} in a shelver's hand`, h, add(p, [0, .9, 0]), .7);
      b.position.set(...p); b.rotation.set(0, SH_ANG, 0); b.scale.setScalar(1); ROOT.add(b);
    }
  }
  // the pump's spray: ONE instanced mesh (a looping stream must never teleport a tracked prop)
  const SPRAY = 14;
  function sprayAt(t) {
    const g = keep('pump-spray', () => { const im = new THREE.InstancedMesh(new THREE.SphereGeometry(.22, 8, 6), plastic('#5aa8ff', { transparent: true, opacity: .85 }), SPRAY); im.frustumCulled = false; const w = new THREE.Group(); w.add(im); w.userData.im = im; return w; });
    const im = g.userData.im, on = seg(t, bt(319), bt(319) + .3), Mx = new THREE.Matrix4(), q = new THREE.Quaternion();
    for (let i = 0; i < SPRAY; i++) { const u = frac(t * 1.4 + i / SPRAY), sc = on * Math.sin(Math.PI * u);   // each drop grows out of the spout and shrinks as it lands
      Mx.compose(new THREE.Vector3(1.4 + u * 3, 2.6 + 2.2 * u - 3.4 * u * u, .2), q, new THREE.Vector3(sc, sc, sc)); im.setMatrixAt(i, Mx); }
    im.instanceMatrix.needsUpdate = true; put(g, ...ON(PUMP));
  }
  function baseAt(t) {
    const dark = seg(t, 195.6, 196.3) * (1 - seg(t, 198.6, 199.3));
    // 3. the vault door rolls shut (lava tube, deep freeze, sealed tight) by bt(307) 196.22; the lamps go off
    const v = keep('moon-vault', vaultObj); v.userData.lamps.forEach(l => { l.material.emissiveIntensity = 2.5 * (1 - dark); });
    const shut = ease(seg(t, 194.9, 196.22)), door = keep('moon-door', doorObj);
    const glow = seg(t, bt(309), bt(309) + .12) * (1 - seg(t, 199.6, 200.4)), pulseS = t > bt(309) ? .4 + .6 * pulse(t, 5) : 0;
    door.userData.label.material.emissiveIntensity = 2.2 * glow * pulseS;
    put(door, ...M(VAULT[0] + lerp(10, 0, shut), 4.4, VAULT[1] + 2.8), 0);
    door.rotation.z = -lerp(2.2, 0, shut);
    // the "saving…" bar: each tile lights up by growing in (197.5 → 198.8)
    for (let i = 0; i < 8; i++) { const g = seg(t, 197.5 + i * .16, 197.62 + i * .16); if (g <= 0) continue;
      const b = keep('savebar' + i, () => { const m = new THREE.Mesh(new THREE.BoxGeometry(.9, .5, .3), glowMat('#4cff7a', 1.6)); const w = new THREE.Group(); w.add(m); return w; });
      put(b, ...M(VAULT[0] - 3.6 + i * 1.03, 9.6, VAULT[1] + 3.4), 0, g); }
    // 4. Ctrl + S: the keys go down when Pip lands on them
    put(keep('key-ctrl', keyCap('Ctrl')), ...M(KEYS[0] - 2.6, -press(t, bt(309)), KEYS[1])); put(keep('key-s', keyCap('S')), ...M(KEYS[0] + 2.6, -press(t, bt(310)), KEYS[1]));
    // 5. the switch (knob at Pip's hand height) and the red team poking a tiny model
    const lc = leverCal(), lev = keep('moon-lever', leverObj); lev.userData.arm.rotation.x = -lc.th; put(lev, ...ON(SWITCH));
    put(keep('moon-table', tableObj), ...ON(TABLE));
    const mini = clawd('moonMini', { scale: .32 }); clawdPose(mini, { face: t > 200.2 ? 'shocked' : 'smug', hat: null, armL: .5 + .5 * Math.sin(t * 6), armR: .3, bob: .1 * pulse(t, 6) });
    put(mini, ...M(TABLE[0], 2.8, TABLE[1]), .4, .32);
    for (let i = 0; i < 2; i++) { const f = fig('redteam' + i, { ...crowdLook(i + 6), torso: COL.red, legs: COL.black, head: CROWD_HEADS[(i * 5 + 3) % CROWD_HEADS.length] });
      const poke = Math.max(0, Math.sin((t - 199) * 7 + i * 2));
      pose(f, { armR: 1.0 + .35 * poke, armL: i ? 1.3 : .3, holdL: i ? keep('moon-lens', lensObj) : null, lean: .15 + .1 * poke, face: 'determined', head: (i ? -1 : 1) * .3 });
      put(f, ...M(TABLE[0] + (i ? 3.2 : -3.2), 0, TABLE[1] + 1.2), (i ? -1 : 1) * 1.2); }
    // 6. rules of the road: the gold-laden car brakes at the cliff edge in front of the STOP sign
    const carK = clamp((t - 201.3) / 2.2), brake = 1 - (1 - carK) ** 3, cx = lerp(-10, CLIFF[0] + 3.5, brake), car = keep('moon-car', carObj);
    car.children[0].rotation.set(0, Math.PI, carK > .9 ? -.12 * Math.sin(Math.min(1, (t - 203.3) * 3) * Math.PI) : 0);
    put(car, ...M(cx, 0, ROADY), 0);
    put(keep('moon-road', () => { const l = []; for (let x = -42; x <= -8; x += 2) l.push(['3068b', DKG, x, .03, -1], ['3068b', DKG, x, .03, 1]); return build(l); }), ...M(0, 0, ROADY));
    const stopper = crew(2); pose(stopper, { armR: 2.2, holdR: keep('stop-held', () => { const g = new THREE.Group(), sg = sign('moon-stop', ['STOP'], { w: 2.8, h: 1.6, bg: '#c4281c', fg: '#ffffff', size: 260, font: 'system-ui' }); sg.position.set(0, .2, 0); sg.rotation.set(0, 0, 0); g.add(sg); return g; }), face: carK > .85 ? 'smug' : 'shocked' });
    put(stopper, ...M(CLIFF[0] + 1.5, 0, ROADY + 3.4), .9);
    put(keep('moon-cliff', () => { const l = []; for (let z = -12; z <= 6; z += 2) for (let x = 0; x < 8; x += 2) l.push(['3068b', '#2a2b30', x, .01, z]); return build(l); }), ...M(CLIFF[0] - 9, 0, ROADY));
    // 7. fix a pump, grow a bean, know your neighbour
    const pmp = keep('moon-pump', pumpObj); pmp.userData.wheel.rotation.z = t > bt(319) ? (t - bt(319)) * 6 : 0; put(pmp, ...ON(PUMP)); sprayAt(t);
    const fixer = crew(3); pose(fixer, { armR: 1.0 + .4 * Math.abs(Math.sin(t * 9)), armL: .9, lean: .2, face: 'determined' }); put(fixer, ...M(PUMP[0] - 2.6, 0, PUMP[1] + 1.2), 1.3);
    const beans = keep('moon-beans', () => { const l = []; for (let i = 0; i < 6; i++) for (let r = 0; r < 4; r++) l.push(['30176', r === 3 ? COL.dkgreen : COL.green, (i % 3) * 2 - 2, .4 + r * 1.2, Math.floor(i / 3) * 2 - 1, i + r, bt(320) + i * .12 + r * .18]); return growing(l); });
    beans.userData.grow(t); put(beans, ...ON(BEANS));
    put(keep('bean-bed', () => build([['3020', COL.brown, 0, .4, 0, Math.PI / 2], ['3020', COL.brown, 0, .4, 2, Math.PI / 2]])), ...M(BEANS[0], 0, BEANS[1] - 1));
    const nb = crew(8); pose(nb, { ...blend({}, dance('wave', t), seg(t, bt(322) - .25, bt(322))), face: t > bt(322) - .1 ? 'joy' : 'neutral' }); put(nb, ...ON(NEIGH), -.6);
    // 8. the press: sheets slide out of the roller (growing in from inside it) on every half beat and stack in the tray
    const pr = keep('moon-press', pressObj); pr.userData.roll.rotation.x = t * 8; put(pr, ...ON(PRESS));
    for (let i = 0; i < 14; i++) { const tb = 206.6 + i * BEAT / 2; if (t < tb) break; const sh = keep('sheet' + i, sheetObj), u = clamp((t - tb) / .35);
      put(sh, ...M(PRESS[0], lerp(2.6, .5 + i * .06, ease(u)), PRESS[1] + lerp(.6, 3.6, ease(u))), hash(i) * .2 - .1, Math.min(1, u * 3 + .02)); }
    if (t < MAN_IN || t >= MAN_OUT) manualAt(t, null);   // the MANUAL: inside the press, then set back on its top after the reading
    // 9. sequels, shelved by hand
    shelvesAt(t);
    carriersAt(t);
  }

  // ---------- the MANUAL (a book that comes out of the press, into Pip's hands, overhead on bt(326), back onto the press) ----------
  const MAN_IN = 207.55, MAN_OUT = 209.85;
  const manualObj = () => sign('moon-manual', ['MANUAL'], { w: 2.4, h: 1.5, bg: '#F6EED8', size: 170 });
  function manualAt(t, P) {
    const book = manualObj(), slot = M(PRESS[0], 2.2, PRESS[1] + 2.1), inside = M(PRESS[0], 2.2, PRESS[1] + .1), top = M(PRESS[0], 4.05, PRESS[1]);
    let p, ry = 0;
    if (t < MAN_IN) { p = handoff(t, 207.05, 207.5, inside, slot, 0); }
    else if (t >= MAN_OUT) { p = top; }
    else {
      const hands = add(mid(limb(P, 'handL'), limb(P, 'handR')), [0, -.45, 0]); ry = P.rotation.y;
      p = t < 207.85 ? handoff(t, MAN_IN, 207.85, slot, hands, .3) : t < 209.55 ? hands : handoff(t, 209.55, MAN_OUT, hands, top, .4);
      if (t > 207.9 && t < 209.5) expect('Pip holds the MANUAL', limb(P, 'handR'), add(p, [0, .45, 0]), 1.4);
    }
    book.position.set(...p); book.rotation.set(0, ry, 0); book.scale.setScalar(1); ROOT.add(book);
  }

  // ---------- the moon district: set + background life ----------
  district('moon', { at: WORLD.D.moon, r: 120 }, t => {
    put(keep('moon-surface', moonSurface), ...M(0, 0, 0));
    const s = keep('moon-sky', sky); s.userData.earth.rotation.y = t * .02; put(s, ...M(0, 0, 0));
    put(keep('moon-pad', pad), ...M(0, 0, 0));
    put(keep('moon-vault', vaultObj), ...ON(VAULT));
    // habitat domes going up in the distance (robots build them across the whole song) + two crew shuttling between them
    onMoon(() => buildSite('moonhab', { at: G(-40, -60), w: 10, d: 8, floors: 6, col: COL.white, t0: 180, t1: 260, robots: 2 }, t));
    onMoon(() => buildSite('moonhab2', { at: G(46, -58), w: 6, d: 6, floors: 9, col: '#b9c2cc', t0: 185, t1: 255, robots: 2 }, t));
    for (let i = 4; i < 6; i++) { const f = crew(i), ph = frac(t / 7 + i * .37), out = ph < .5, k = ease(out ? ph * 2 : 2 - ph * 2);
      const x = lerp(-28, -10, k) + (i - 4) * 3, z = lerp(-48, -40, k);
      const yaw = ph < .75 ? Math.PI / 2 - Math.PI * ease(seg(ph, .47, .53)) : -Math.PI / 2 + Math.PI * ease(seg(ph, .97, 1));   // turns around at each end
      pose(f, { ...walk(t * 1.3 + i), bodyY: .25 * Math.abs(Math.sin(t * 4 + i)), armL: 1.0, armR: 1.0, face: 'neutral' });
      put(f, ...M(x, 0, z), yaw); }
    // eggs: the basilisk just inside the vault mouth; the HAL eye on the rocket's console
    onMoon(() => EGGS.basilisk('moon', t, ...G(-4, -33), .4));
    put(keep('moon-console', () => build([['3003', COL.dkgrey, 0, 1.2, 0], ['3003', COL.dkgrey, 0, 2.4, 0], ['3068b', COL.black, 0, 2.8, 0]])), ...M(ROCKET[0] - 6, 0, ROCKET[1] - 4));
    EGGS.halEye('moonrocket', t, ...G(ROCKET[0] - 6, ROCKET[1] - 3.4), .5, MY + 2.8);
    baseAt(t);
    if (t >= WORLD.F.F5.t1) rocketAt(t);
    flagAt(t);
  });

  // ---------- Pip: one plan with physical contacts ----------
  // Comes out from behind the rocket → jumps onto Ctrl (bt 309), hops to S (bt 310), hops down → hand on the switch knob →
  // watches the car → past the pump, the beans, the neighbour → takes the MANUAL from the press, holds it up on bt(326),
  // puts it back → pulls the flag from its holder, plants it at FLAG on bt(333) → walks to the pad centre for c10.
  const KC = [KEYS[0] - 2.6, KEYS[1]], KS = [KEYS[0] + 2.6, KEYS[1]], KA = [KEYS[0] - 2.6, KEYS[1] + 3.6], KB = [KEYS[0] + 1.0, KEYS[1] + 3.8];
  const J1 = [197.06, bt(309)], J2 = [bt(309) + .2, bt(310)], J3 = [bt(310) + .22, bt(310) + .55];   // jump onto Ctrl, hop to S, hop down
  const keyTop = (t, which) => 1.4 - press(t, which === 'c' ? bt(309) : bt(310));
  function pipPlan() { const lc = leverCal(), fc = flagCal(), PS = [PRESS[0], PRESS[1] + 3.3];
    return [[191.85, [ROCKET[0] + .3, ROCKET[1] - 3.2]], [192.75, [ROCKET[0] + 1.6, ROCKET[1] + .4]], [195.9, [5, -15]], [196.9, KA],
      [J3[1], KB], [199.6, lc.spot], [201.45, lc.spot], [205.75, [NEIGH[0] - 1.6, NEIGH[1] + 2.4]], [206.35, [NEIGH[0] - 1.6, NEIGH[1] + 2.4]],
      [207.45, PS], [209.9, PS], [211.1, fc.pick], [PICK + .05, fc.pick], [212.45, fc.plant], [PLANT + .15, fc.plant], [214.5, [0, .3]], [214.94, [0, 0]]]; }
  function pipAt(t) {
    const P = pipM(), plan = pipPlan(), lc = leverCal(), fc = flagCal();
    // walking: my own stepper so each leg picks walk/run by its speed, and the phase follows the distance (no foot sliding)
    let x = plan[0][1][0], z = plan[0][1][1], ry = Math.PI * .3, dist = 0, moving = false, fast = false;
    for (let i = 1; i < plan.length; i++) { const [t0, a] = plan[i - 1], [t1, b] = plan[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (t <= t0) break; const k = ease(Math.min(1, (t - t0) / (t1 - t0))); dist += L * k; x = lerp(a[0], b[0], k); z = lerp(a[1], b[1], k);
      if (L > .05) ry = Math.atan2(b[0] - a[0], b[1] - a[1]); moving = t < t1 && L > .05; fast = L / (t1 - t0) > 5; }
    let y = onPad(x, z), p = moving ? (fast ? { ...run(dist / STRIDE * .6), bodyY: .5 * Math.abs(Math.sin(dist * 1.05)) } : walk(dist / STRIDE)) : {}, face = 'determined';   // low-gravity bounds: long strides
    // the key jumps: ballistic arcs between the ground and the key tops; feet land ON the keys (asserted)
    const air = (a, b, y0, y1, h) => { const k = seg(t, a, b); return lerp(y0, y1, k) + 4 * h * k * (1 - k); };
    if (t >= J1[0] && t < J3[1] + .05) {
      if (t < J1[1]) { const k = ease(seg(t, J1[0], J1[1])); x = lerp(KA[0], KC[0], k); z = lerp(KA[1], KC[1], k); y = air(J1[0], J1[1], 0, keyTop(t, 'c'), 1.6); }
      else if (t < J2[0]) { x = KC[0]; z = KC[1]; y = keyTop(t, 'c'); }
      else if (t < J2[1]) { const k = ease(seg(t, J2[0], J2[1])); x = lerp(KC[0], KS[0], k); z = lerp(KC[1], KS[1], k); y = air(J2[0], J2[1], keyTop(t, 'c'), keyTop(t, 's'), 1.2); }
      else if (t < J3[0]) { x = KS[0]; z = KS[1]; y = keyTop(t, 's'); }
      else { const k = ease(seg(t, J3[0], J3[1])); x = lerp(KS[0], KB[0], k); z = lerp(KS[1], KB[1], k); y = air(J3[0], J3[1], keyTop(t, 's'), 0, 1.0); }
      const airW = Math.max(win(t, J1[0] + .06, J1[1] - .06, .06), win(t, J2[0] + .06, J2[1] - .06, .06), win(t, J3[0] + .06, J3[1] - .06, .06)), inAir = airW > .5;
      const landB = (tb) => t > tb ? -.18 * Math.exp(-(t - tb) * 8) : 0;
      const jp = { legL: .55 * airW, legR: -.25 * airW, armL: lerp(.7, 2.2, airW), armR: lerp(.7, 2.2, airW), bodyY: landB(J1[1]) + landB(J2[1]) };
      p = blend(p, jp, win(t, J1[0], J3[1], .14));
      ry = Math.PI; face = inAir ? 'determined' : 'angry';
    }
    // layered actions, each blended in and out (no snaps)
    const wL = win(t, 199.6, 201.45, .3), wW = win(t, 205.9, 206.35, .2), wB = win(t, MAN_IN, 209.55, .25), wBU = win(t, bt(326), 209.3, .3);
    const wF = win(t, 211.1, PLANT, .2), wFU = win(t, 211.55, PLANT - .25, .25), wJoy = win(t, PLANT + .35, PLANT + .5, .3);   // the thrust down lands ON the beat
    if (wL > 0) { p = blend(p, P_LEVER, wL); if (wL > .5) { ry = lerp(ry, lc.yaw, 1); face = 'suspicious'; } }
    if (wW > 0) { p = blend(p, { ...p, ...dance('wave', t) }, wW); face = 'joy'; }
    if (wB > 0) { p = blend(p, blend(P_BOOK, P_BOOKUP, wBU), wB); face = wBU > .5 ? 'laugh' : 'joy'; ry = lerp(Math.PI, 0, ease(seg(t, 207.95, 208.25))); }
    if (wF > 0) { p = blend(p, blend(P_FLAG, P_FLAGUP, wFU), wF); ry = fc.yaw; face = 'determined'; }
    if (wJoy > 0) { p = blend(p, { ...dance('bounce', t), armR: 2.6 }, wJoy); face = 'joy'; ry = lerp(fc.yaw, .2, seg(t, PLANT + .1, PLANT + .4)); }
    if (t > 213.15) { face = t > 214.3 ? 'determined' : 'joy'; if (t > 214.3) ry = ry * (1 - seg(t, 214.3, 214.8)); p = blend(p, {}, seg(t, 214.3, 214.85)); }
    if (t > 202.0 && t < 203.2) face = 'shocked';
    if (t > 204.3 && t < 205.0) face = 'joy';
    pose(P, { ...p, face });
    put(P, ...M(x, y, z), ry);
    // contacts
    if (t >= J2[0] - .15 && t < J2[0]) expect('Pip lands on Ctrl', limb(P, 'footR'), M(KC[0], keyTop(t, 'c'), KC[1]), 1.4);
    if (t >= J3[0] - .15 && t < J3[0]) expect('Pip lands on S', limb(P, 'footR'), M(KS[0], keyTop(t, 's'), KS[1]), 1.4);
    if (t > 199.8 && t < 201.2) expect('hand on the switch', limb(P, 'handR'), M(...lc.knob), .6);
    return P;
  }

  // ---------- the chapter: one shot, one continuous camera ----------
  function moon(t, lt) {
    look({ ...WORLD.LOOK.moon });
    const dark = seg(t, 195.6, 196.3) * (1 - seg(t, 198.6, 199.3));   // the sealed vault: lights off, then the save icon glows
    look({ keyInt: lerp(3.4, 1.1, dark), fill: lerp(.3, .12, dark) });
    const land = LAND, ry = ROCKET;
    // touchdown dust: puffs grow out from under the rocket and fade
    if (t > land - .1 && t < land + 1.6) for (let i = 0; i < 14; i++) { const u = clamp((t - land + .1) / 1.6), a = i / 14 * Math.PI * 2, r = 2 + 6 * easeOut(u);
      const d = keep('dust' + i, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(.7, 10, 8), matte('#c9c9cc', { transparent: true, opacity: .8 })); const g = new THREE.Group(); g.add(m); return g; });
      d.children[0].material.opacity = .7 * (1 - u); put(d, ...M(ry[0] + Math.cos(a) * r, .6 + 1.2 * Math.sin(u * Math.PI) * hash(i), ry[1] + Math.sin(a) * r), 0, Math.min(1, u * 8) * (1 + u) + .001); }

    // Pip (hidden behind the rocket until he steps out)
    const P = t >= 191.85 ? pipAt(t) : null;
    // the MANUAL in Pip's hands, the flag in Pip's hands
    if (P && t >= MAN_IN && t < MAN_OUT) manualAt(t, P);
    if (P && t >= PICK && t < PLANT) {
      const fc = flagCal(), fl = keep('moon-flag', flagObj), h = limb(P, 'handR'); flagWave(fl, t);
      const bottom = [h[0], h[1] - fc.grip, h[2]]; fl.position.set(...bottom); fl.rotation.set(0, 0, 0); fl.scale.setScalar(1); ROOT.add(fl);
      expect('Pip grips the flagpole', h, add(bottom, [0, fc.grip, 0]), .2);
    }

    // the people gather at the flag from off-screen right, cheer, then run off-screen left before c10 starts
    for (let i = 0; i < 6; i++) {
      const f = crew(10 + i), a = 211.0 + i * .18, ang = -.9 + i * .36, R = 5, rx = FLAG[0] + Math.sin(ang) * R, rz = FLAG[1] + 2 + Math.cos(ang) * R;
      const plan = [[a, [44, 8 + i * 2]], [212.5 + i * .08, [rx, rz]], [213.9 + i * .06, [rx, rz]], [214.9, [-44 - i * 3, 6 + i]]];
      if (t < a - .01) continue;
      const s2 = stepTo(t, plan, { run: true, face: Math.atan2(FLAG[0] - rx, FLAG[1] - rz) }), wD = win(t, 212.75, 213.9, .25);
      pose(f, { ...blend(s2.pose, crowdDance(i, t), wD), face: 'joy' }); put(f, ...M(s2.x, 0, s2.z), s2.ry);
    }

    // ---------- camera: one path through the stations (moon-local), seams via F5 and Fm ----------
    const keys = [[190.70, [0, 8, 30]], [191.6, [-3, 7.5, 24]], [192.7, [3, 7, 18]], [194.2, [7, 6, 2]], [196.0, [3, 5.5, -16]], [197.4, [12, 7.5, -8]], [198.6, [9, 7, -9]], [199.6, [2, 6.5, -6]],
      [200.8, [-2, 6.5, -5]], [201.7, [-15, 7, 2]], [202.4, [-22, 7, 8]], [204.1, [-16, 6, 28]], [205.4, [-4, 6, 28]], [206.7, [6, 7, 32]], [208.4, [10, 8, 32]], [209.6, [20, 7, 22]],
      [210.9, [24, 7, 20]], [212.2, [18, 8, 24]], [213.4, [14, 8, 26]], [214.30, [8, 8, 28]]];
    const looks = [[190.70, [0, 4, 0]], [191.6, [-13, 5, -4]], [192.7, [-8, 4, -8]], [194.2, [2, 4, -24]], [196.0, [1, 5, -36]], [197.4, [5, 3.5, -28]], [198.6, [3, 4, -30]], [199.6, [-2, 4, -19]],
      [200.8, [0, 4.5, -18]], [201.7, [-30, 2.5, -6]], [202.4, [-38, 2, -4]], [204.1, [-11, 3, 15]], [205.4, [-3, 3, 15]], [206.7, [8, 3, 14]], [208.4, [16, 4, 14]], [209.6, [26, 3.5, 4]],
      [210.9, [27, 3.5, 6]], [212.2, [9, 4.5, 0]], [213.4, [6, 4.5, 0]], [214.30, [0, 4, 0]]];
    // easeEnds: false — the default easing shifts every key's timing; the F5/Fm flights already ease my ends
    const cp = path(t, keys, { easeEnds: false }), ca = path(t, looks, { easeEnds: false }), fov = kf(t, [[190.7, 36], [196, 32], [204, 36], [209, 32], [214.3, 34]]);
    const d = drift(lt, .5 * seg(t, 191, 192) * (1 - seg(t, 213.4, 214.3)));
    const thud = t > land ? shake(t, .35 * Math.exp(-(t - land) * 7)) : [0, 0, 0];
    const focus = P ? [P.position.x, P.position.y + 3, P.position.z] : M(0, 4, 0);
    cam({ pos: M(cp[0] + d[0] + thud[0], cp[1] + d[1] + thud[1], cp[2] + d[2]), look: M(ca[0] + thud[0] * .4, ca[1], ca[2]), fov, blur: .7, focus });
    if (t < WORLD.F.F5.t1) { WORLD.apply(WORLD.flight('F5', t)); cam({ blur: .3 }); }
    if (t >= WORLD.F.Fm.t0) { WORLD.apply(WORLD.flight('Fm', t)); cam({ blur: .6 }); }
  }

  shots([[189.17, moon]]);
})();
