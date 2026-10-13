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
  const ROCKET = [-20, -6], FLAG = [9, -3], VAULT = [0, -36], KEYS = [9, -24], SWITCH = [-12, -22], TABLE = [-17, -20], CLIFF = [-46, -4], ROADY = -4;
  const PUMP = [-12, 15], BEANS = [-3, 15], NEIGH = [6, 15], PRESS = [17, 13], SHELF = [26, 4];
  const ON = (p, dy = 0) => M(p[0], dy, p[1]);


  // the landing: from c08's hand-off point (moon (0, 8, 0) at F5.t1) arcing off the pad to ROCKET, touchdown on bt(300) 191.75
  const LAND = 191.75;
  function rocketAt(t) {
    const k = easeOut(seg(t, WORLD.F.F5.t1, LAND)), rk = keep('moon-rocket', rocketObj);
    rk.userData.flame.visible = t < LAND + .25; rk.userData.flame.scale.set(1, (1.4 - .9 * k) * (1 + .15 * Math.sin(t * 47)), 1);
    const bump = t > LAND ? .25 * Math.exp(-(t - LAND) * 9) * Math.sin((t - LAND) * 40) : 0, h = t < LAND ? 7.6 * (1 - k) : 0;
    put(rk, ...M(lerp(0, ROCKET[0], k), .4 + h + bump, lerp(0, ROCKET[1], k)), 0);
  }
  function flagAt(t) {
    const plant = seg(t, 212.4, bt(333)), fl = keep('moon-flag', flagObj), geo = fl.userData.flag.geometry, pos = geo.attributes.position, base = fl.userData.base;
    for (let i = 0; i < pos.count; i++) { const x = base[i * 3]; pos.setZ(i, .25 * Math.sin(x * 1.6 - t * 6) * (x + 2.2) / 4.4); } pos.needsUpdate = true; geo.computeVertexNormals();
    put(fl, ...M(FLAG[0], 3 * (1 - plant), FLAG[1]));
  }

  // the whole moon base is persistent world (drawn by the district, so it is still there in c10's frames)
  const press = (t, tb) => .5 * Math.exp(-Math.max(0, t - tb) * 6) * (t > tb ? 1 : 0);
  function baseAt(t) {
    const dark = seg(t, 195.6, 196.3) * (1 - seg(t, 198.6, 199.3));
    // 3. vault door rolls shut (lava tube, deep freeze, sealed tight) at bt(307) 196.22; lamps go off
    const v = keep('moon-vault', vaultObj); v.userData.lamps.forEach(l => { l.material.emissiveIntensity = 2.5 * (1 - dark); });
    const shut = ease(seg(t, 194.9, 196.22)), door = keep('moon-door', doorObj);
    const glow = seg(t, bt(309), bt(309) + .12) * (1 - seg(t, 199.6, 200.4)), pulseS = t > bt(309) ? .4 + .6 * pulse(t, 5) : 0;
    door.userData.label.material.emissiveIntensity = 2.2 * glow * pulseS;
    put(door, ...M(VAULT[0] + lerp(10, 0, shut), 4.4, VAULT[1] + 2.8), 0);
    door.rotation.z = -lerp(2.2, 0, shut);
    // a "saving…" bar of green tiles above the door (fills across 197.5–198.8)
    const bars = Math.floor(clamp((t - 197.5) / 1.3) * 8);
    for (let i = 0; i < bars; i++) { const b = keep('savebar' + i, () => { const m = new THREE.Mesh(new THREE.BoxGeometry(.9, .5, .3), glowMat('#4cff7a', 1.6)); const g = new THREE.Group(); g.add(m); return g; });
      put(b, ...M(VAULT[0] - 3.6 + i * 1.03, 9.6, VAULT[1] + 3.4)); }

    // 4. Ctrl + S: Pip stomps the giant keys on bt(309) and bt(310)
    const kc = keep('key-ctrl', keyCap('Ctrl')), ks = keep('key-s', keyCap('S'));
    put(kc, ...M(KEYS[0] - 2.6, -press(t, bt(309)), KEYS[1])); put(ks, ...M(KEYS[0] + 2.6, -press(t, bt(310)), KEYS[1]));

    // 5. the switch and the red team (199.07–201.54)
    const lev = keep('moon-lever', leverObj); lev.userData.arm.rotation.x = -.6 + .05 * Math.sin(t * 3); put(lev, ...ON(SWITCH));
    put(keep('moon-table', tableObj), ...ON(TABLE));
    const mini = clawd('moonMini', { scale: .32 }); clawdPose(mini, { face: t > 200.2 ? 'shocked' : 'smug', hat: null, armL: .5 + .5 * Math.sin(t * 6), armR: .3, bob: .1 * pulse(t, 6) });
    put(mini, ...M(TABLE[0], 2.8, TABLE[1]), .4, .32);
    for (let i = 0; i < 2; i++) { const f = fig('redteam' + i, { ...crowdLook(i + 6), torso: COL.red, legs: COL.black, head: CROWD_HEADS[(i * 5 + 3) % CROWD_HEADS.length] });
      const poke = Math.max(0, Math.sin((t - 199) * 7 + i * 2));
      pose(f, { armR: 1.0 + .35 * poke, armL: i ? 1.3 : .3, holdL: i ? keep('moon-lens', lensObj) : null, lean: .15 + .1 * poke, face: t > 200.2 ? 'shocked' : 'determined', head: (i ? -1 : 1) * .3 });
      put(f, ...M(TABLE[0] + (i ? 3.2 : -3.2), 0, TABLE[1] + 1.2), (i ? -1 : 1) * 1.2); }

    // 6. rules of the road: a gold-laden car races for the cliff; a crew member holds up STOP; it brakes at the edge
    const carK = clamp((t - 201.3) / 2.2), brake = 1 - (1 - carK) ** 3, cx = lerp(-10, CLIFF[0] + 3.5, brake), car = keep('moon-car', carObj);
    car.children[0].rotation.set(0, Math.PI, carK > .9 ? -.12 * Math.sin(Math.min(1, (t - 203.3) * 3) * Math.PI) : 0);
    put(car, ...M(cx, 0, ROADY), 0);
    put(keep('moon-road', () => { const l = []; for (let x = -42; x <= -8; x += 2) l.push(['3068b', DKG, x, .03, -1], ['3068b', DKG, x, .03, 1]); return build(l); }), ...M(0, 0, ROADY));
    const sg = sign('moon-stop', ['STOP'], { w: 2.8, h: 1.6, bg: '#c4281c', fg: '#ffffff', size: 260, font: 'system-ui' });
    const stopper = crew(2); pose(stopper, { armR: 2.2, face: carK > .85 ? 'smug' : 'shocked' }); put(stopper, ...M(CLIFF[0] + 1.5, 0, ROADY + 3.4), .9);
    put(sg, ...M(CLIFF[0] + 1.0, 5.4, ROADY + 2.8), .9);
    put(keep('moon-cliff', () => { const l = []; for (let z = -12; z <= 6; z += 2) for (let x = 0; x < 8; x += 2) l.push(['3068b', '#2a2b30', x, .01, z]); return build(l); }), ...M(CLIFF[0] - 9, 0, ROADY));

    // 7. learn a trade, fix a pump, grow a bean, know your neighbour (one station per beat: bt(319) .. bt(322))
    const pmp = keep('moon-pump', pumpObj); pmp.userData.wheel.rotation.z = t > bt(319) ? (t - bt(319)) * 6 : 0; put(pmp, ...ON(PUMP));
    if (t > bt(319) + .2) for (let i = 0; i < 10; i++) { const u = frac(t * 1.4 + i / 10), d = keep('drop' + i, () => { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.SphereGeometry(.22, 8, 6), plastic('#5aa8ff', { transparent: true, opacity: .85 }))); return g; });
      put(d, ...M(PUMP[0] + 1.4 + u * 3, 2.6 + 2.2 * u - 3.4 * u * u, PUMP[1] + .2)); }
    const fixer = crew(3); pose(fixer, { armR: 1.0 + .4 * Math.abs(Math.sin(t * 9)), armL: .9, lean: .2, face: 'determined' }); put(fixer, ...M(PUMP[0] - 2.6, 0, PUMP[1] + 1.2), 1.3);
    const beans = keep('moon-beans', () => { const l = []; for (let i = 0; i < 6; i++) for (let r = 0; r < 4; r++) l.push(['30176', r === 3 ? COL.dkgreen : COL.green, (i % 3) * 2 - 2, .4 + r * 1.2, Math.floor(i / 3) * 2 - 1, i + r, bt(320) + i * .12 + r * .18]); return growing(l); });
    beans.userData.grow(t); put(beans, ...ON(BEANS));
    put(keep('bean-bed', () => build([['3020', COL.brown, 0, .4, 0, Math.PI / 2], ['3020', COL.brown, 0, .4, 2, Math.PI / 2]])), ...M(BEANS[0], 0, BEANS[1] - 1));
    const nb = crew(8); pose(nb, { ...(t > bt(322) ? dance('wave', t) : {}), face: t > bt(322) ? 'joy' : 'neutral' }); put(nb, ...ON(NEIGH), -.6);

    // 8. the press prints the manual: sheets fly out on every half beat and stack; the MANUAL is held up on bt(326)
    const pr = keep('moon-press', pressObj); pr.userData.roll.rotation.x = t * 8; put(pr, ...ON(PRESS));
    const nSheets = clamp(Math.floor((t - 206.6) / (BEAT / 2)), 0, 14);
    for (let i = 0; i < nSheets; i++) { const sh = keep('sheet' + i, sheetObj), tb = 206.6 + i * BEAT / 2, u = clamp((t - tb) / .35);
      put(sh, ...M(PRESS[0], lerp(2.6, .5 + i * .06, ease(u)), PRESS[1] + lerp(1.4, 3.6, ease(u))), hash(i) * .2 - .1); }

    // 9. sequels: books pop onto the shelf, three per beat (209.63 → 211.9)
    put(keep('moon-shelf', shelfObj), ...ON(SHELF), -.9);
    for (let i = 0; i < 12; i++) { const tb = bt(328) + i * BEAT / 3, u = backOut(seg(t, tb, tb + .2)); if (u <= 0) break;
      const row = Math.floor(i / 6), b = keep('book' + i, bookObj(i)), lx = -3 + (i % 6) * 1.1;
      put(b, ...M(SHELF[0] + Math.cos(-.9) * lx, row ? 3.6 : 1.2, SHELF[1] - Math.sin(-.9) * lx), -.9, u); }

  }

  // ---------- the moon district: set + background life ----------
  district('moon', { at: WORLD.D.moon, r: 120 }, t => {
    put(keep('moon-surface', moonSurface), ...M(0, 0, 0));
    const s = keep('moon-sky', sky); s.userData.earth.rotation.y = t * .02; put(s, ...M(0, 0, 0));
    put(keep('moon-pad', pad), ...M(0, 0, 0));
    put(keep('moon-vault', vaultObj), ...ON(VAULT));
    // a habitat dome going up in the distance (robots build it across the whole song) + crew shuttling crates
    onMoon(() => buildSite('moonhab', { at: G(-40, -60), w: 10, d: 8, floors: 6, col: COL.white, t0: 180, t1: 260, robots: 2 }, t));
    onMoon(() => buildSite('moonhab2', { at: G(46, -58), w: 6, d: 6, floors: 9, col: '#b9c2cc', t0: 185, t1: 255, robots: 2 }, t));
    for (let i = 4; i < 6; i++) { const f = crew(i), ph = frac(t / 7 + i * .37), out = ph < .5, k = ease(out ? ph * 2 : 2 - ph * 2);
      const x = lerp(-28, -10, k) + (i - 4) * 3, z = lerp(-48, -40, k);
      pose(f, { ...walk(t * 1.3 + i), bodyY: .25 * Math.abs(Math.sin(t * 4 + i)), armL: out ? 1.0 : 0, armR: out ? 1.0 : 0, face: 'neutral' });
      put(f, ...M(x, 0, z), out ? Math.PI / 2 : -Math.PI / 2); }
    // eggs: the basilisk just inside the vault mouth; the HAL eye on the rocket's console
    onMoon(() => EGGS.basilisk('moon', t, ...G(-4, -33), .4));
    put(keep('moon-console', () => build([['3003', COL.dkgrey, 0, 1.2, 0], ['3003', COL.dkgrey, 0, 2.4, 0], ['3068b', COL.black, 0, 2.8, 0]])), ...M(ROCKET[0] - 6, 0, ROCKET[1] - 4));
    EGGS.halEye('moonrocket', t, ...G(ROCKET[0] - 6, ROCKET[1] - 3.4), .5, MY + 2.8);
    // persistent after landing (c10 keeps seeing them): the rocket and the pencil flag
    baseAt(t);
    if (t >= WORLD.F.F5.t1) rocketAt(t);
    if (t > 212.0) flagAt(t);
  });

  // ---------- the chapter: one shot, one continuous camera ----------
  function moon(t, lt) {
    look({ ...WORLD.LOOK.moon });
    // lights off in the sealed vault (193.96–196.68 line), then the save icon glows
    const dark = seg(t, 195.6, 196.3) * (1 - seg(t, 198.6, 199.3));
    look({ keyInt: lerp(3.4, 1.1, dark), fill: lerp(.3, .12, dark) });

    // 1. the rocket lands: drawn by rocketAt() in the district (it stays for c10); the thud shakes the camera below
    const land = LAND, ry = ROCKET, k = easeOut(seg(t, WORLD.F.F5.t1, land));
    // dust puff at touchdown: grey puffs spread out and fade
    if (t > land - .1 && t < land + 1.6) for (let i = 0; i < 14; i++) { const u = clamp((t - land + .1) / 1.6), a = i / 14 * Math.PI * 2, r = 2 + 6 * easeOut(u);
      const d = keep('dust' + i, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(.7, 10, 8), matte('#c9c9cc', { transparent: true, opacity: .8 })); const g = new THREE.Group(); g.add(m); return g; });
      d.children[0].material.opacity = .7 * (1 - u); put(d, ...M(ry[0] + Math.cos(a) * r, .6 + 1.2 * Math.sin(u * Math.PI) * hash(i), ry[1] + Math.sin(a) * r), 0, 1 + u); }

    // 2. crew unloads: eggs, seeds, and the backup on ice, twice ("back it up twice": two identical stacks)
    const kinds = ['egg', 'seed', 'ice', 'ice'];
    kinds.forEach((kd, i) => {
      const c = keep('crate-' + kd + i, crate(kd)), t0 = 192.0 + i * .5, carry = seg(t, t0, t0 + 1.4), inVault = seg(t, 194.0 + i * .3, 195.6 + i * .2);
      if (t < t0 - .1 || inVault >= 1) return;
      const start = [ry[0] + 2.4, ry[1] + 1.2], stack = [4 + (i % 2) * 2.4, -10], into = [-2 + i * 1.2, -38];
      const p = inVault > 0 ? [lerp(stack[0], into[0], ease(inVault)), lerp(stack[1], into[1], ease(inVault))] : [lerp(start[0], stack[0], ease(carry)), lerp(start[1], stack[1], ease(carry))];
      const y = (i === 3 ? 2.4 : 0) + (carry > 0 && carry < 1 ? 2.2 + .6 * Math.sin(carry * Math.PI) : inVault > 0 ? 2.2 : 0);
      put(c, ...M(p[0], y, p[1]), 0, i >= 2 ? .9 : 1);
    });
    // the carriers: two crew with low-gravity bouncy steps
    for (let i = 0; i < 2; i++) { const f = crew(i), a = 192 + i * .5, b = 196.0;
      if (t < a - .4 || t > b) continue;
      const u = seg(t, a, b), x = lerp(ry[0] + 3.4, -1 + i * 2.4, ease(u)), z = lerp(ry[1] + 2.4, -33, ease(u));
      pose(f, { ...walk(t * 1.6 + i), bodyY: .5 * Math.abs(Math.sin(t * 5 + i)), armL: 1.1, armR: 1.1, face: 'determined' });
      put(f, ...M(x, 0, z), Math.atan2(-1 - x, -33 - z)); }

    const bookUp = seg(t, bt(326) - .2, bt(326)) * (1 - seg(t, 209.4, 209.8));
    if (bookUp > 0) put(sign('moon-manual', ['MANUAL'], { w: 3.2, h: 1.6, bg: '#F6EED8', size: 180 }), ...M(PRESS[0] - 3.4, 4.6 + bookUp * .6, PRESS[1] + 3.6), -.5);
    // Pip's route: off the rocket → keys → switch → (watch the car) → pump/beans/neighbour → press → flag at the pad
    const P = pipM();
    const route = [[189.17, [ROCKET[0] - 3, ROCKET[1] + 3]], [192.4, [ROCKET[0] - 3.4, ROCKET[1] + 3.6]], [194.4, [8, -16]], [196.6, [KEYS[0] - 2.6, KEYS[1] + 1]], [197.5, [KEYS[0] + 2.6, KEYS[1] + 1]],
      [198.6, [KEYS[0] + 2, KEYS[1] + 3]], [199.6, [SWITCH[0] + 1.2, SWITCH[1] + 1.4]], [201.5, [SWITCH[0] + 1.2, SWITCH[1] + 1.4]], [203.0, [-16, 6]], [204.3, [PUMP[0] + 2, PUMP[1] + 3]],
      [205.5, [BEANS[0] + 2, BEANS[1] + 3]], [206.4, [NEIGH[0] - 1, NEIGH[1] + 2]], [207.4, [PRESS[0] - 3.4, PRESS[1] + 3.8]], [209.5, [PRESS[0] - 3.4, PRESS[1] + 3.8]], [211.0, [FLAG[0] + 1.6, FLAG[1] + 2.2]], [212.9, [FLAG[0] + 1.6, FLAG[1] + 2.2]], [214.3, [0, .4]], [214.94, [0, 0]]];
    const pp = path(t, route, { easeEnds: false }), pp2 = path(t + .05, route, { easeEnds: false });
    const moving = Math.hypot(pp2[0] - pp[0], pp2[1] - pp[1]) > .02, heading = Math.atan2(pp2[0] - pp[0], pp2[1] - pp[1]);
    const stomp = Math.max(press(t, bt(309)), press(t, bt(310)));
    let pose9 = moving ? { ...walk(t * 1.7), bodyY: .45 * Math.abs(Math.sin(t * Math.PI * 1.7)) } : {};
    let faceP = 'determined', yaw = moving ? heading : 0;
    if (t > 196.4 && t < 198.6) { pose9 = { ...pose9, legR: stomp * 2.4, legL: -stomp * .6, armL: .8, armR: .8 }; faceP = stomp > .1 ? 'angry' : 'determined'; yaw = Math.PI; }
    if (t > 199.4 && t < 201.6) { pose9 = { armR: 2.0, armRz: .1, head: -.6 }; faceP = 'suspicious'; yaw = Math.PI * .85; }
    if (t > 201.6 && t < 203.3) faceP = 'shocked';
    if (t > 204.3 && t < 205.0) faceP = 'joy';
    if (t > 206.0 && t < 206.7) { pose9 = { ...pose9, ...dance('wave', t) }; faceP = 'joy'; }
    if (t > bt(326) - .2 && t < 209.8) { pose9 = { armR: 2.7, armL: 2.7, bodyY: .2 * pulse(t, 6) }; faceP = 'laugh'; yaw = .3; }
    // 10. the last word is the people's: Pip plants the pencil flag on bt(333) (212.82), the crowd cheers
    const plant = seg(t, 212.4, bt(333));
    if (t > 211.9 && t < 214.3) { pose9 = t < bt(333) ? { armR: 2.2 - plant * 1.2, armL: 2.2 - plant * 1.2, lean: .2 * plant } : { ...dance('bounce', t), armR: 2.7 }; faceP = t < bt(333) ? 'determined' : 'joy'; yaw = t < bt(333) ? -1.2 : .2; }
    pose(P, { ...pose9, face: faceP });
    if (t > 214.3) { yaw = yaw * (1 - seg(t, 214.3, 214.8)); faceP = 'determined'; pose9 = blend(pose9, {}, seg(t, 214.4, 214.85)); pose(P, { ...pose9, face: faceP }); }
    put(P, ...M(pp[0], onPad(pp[0], pp[1]), pp[1]), yaw);
    // the crowd gathers around the pad from 211.4 and cheers
    for (let i = 0; i < 6; i++) { const f = crew(10 + i), a = 211.4 + i * .18; if (t < a) continue;
      const u = ease(seg(t, a, a + 1.0)), ang = -.9 + i * .36, R = 5, x = FLAG[0] + Math.sin(ang) * R, z = FLAG[1] + 2 + Math.cos(ang) * R;
      const away = ease(seg(t, 213.9 + i * .06, 214.9)), ax = -40 - i * 3, az = 6 + i;
      pose(f, away > 0 ? { ...run(t * 2 + i), face: 'joy' } : t > 212.8 ? crowdDance(i, t) : { ...walk(t * 1.6), face: 'joy' });
      put(f, ...M(lerp(lerp(x + 6, x, u), ax, away), 0, lerp(lerp(z + 10, z, u), az, away)), away > 0 ? Math.atan2(ax - x, az - z) : Math.atan2(FLAG[0] - x, FLAG[1] - z)); }

    // ---------- camera: one path through the stations (moon-local), seams via F5 and Fm ----------
    const keys = [[190.70, [0, 8, 30]], [191.6, [-3, 7.5, 24]], [192.7, [3, 7, 18]], [194.2, [7, 6, 2]], [196.0, [3, 5.5, -16]], [197.4, [12, 7.5, -8]], [198.6, [9, 7, -9]], [199.6, [0, 6, -8]],
      [200.8, [-8, 6, -9]], [201.7, [-15, 7, 2]], [202.4, [-22, 7, 8]], [204.1, [-16, 6, 28]], [205.4, [-4, 6, 28]], [206.7, [6, 7, 32]], [208.4, [10, 8, 32]], [209.6, [20, 7, 22]],
      [210.9, [22, 7, 20]], [212.2, [18, 8, 24]], [213.4, [14, 8, 26]], [214.30, [8, 8, 28]]];
    const looks = [[190.70, [0, 4, 0]], [191.6, [-13, 5, -4]], [192.7, [-8, 4, -8]], [194.2, [2, 4, -24]], [196.0, [1, 5, -36]], [197.4, [5, 3.5, -28]], [198.6, [3, 4, -30]], [199.6, [-4, 5, -28]],
      [200.8, [-15, 3.5, -21]], [201.7, [-30, 2.5, -6]], [202.4, [-38, 2, -4]], [204.1, [-11, 3, 15]], [205.4, [-3, 3, 15]], [206.7, [8, 3, 14]], [208.4, [16, 4, 14]], [209.6, [26, 3.5, 4]],
      [210.9, [26, 3.5, 4]], [212.2, [9, 4.5, 0]], [213.4, [6, 4.5, 0]], [214.30, [0, 4, 0]]];
    // easeEnds: false — the default easing shifts every key's timing; the F5/Fm flights already ease my ends
    const cp = path(t, keys, { easeEnds: false }), ca = path(t, looks, { easeEnds: false }), fov = kf(t, [[190.7, 36], [196, 32], [204, 36], [209, 32], [214.3, 34]]);
    const d = drift(lt, .5 * seg(t, 191, 192) * (1 - seg(t, 213.4, 214.3)));
    const thud = t > land ? shake(t, .35 * Math.exp(-(t - land) * 7)) : [0, 0, 0];
    cam({ pos: M(cp[0] + d[0] + thud[0], cp[1] + d[1] + thud[1], cp[2] + d[2]), look: M(ca[0] + thud[0] * .4, ca[1], ca[2]), fov, blur: .7, focus: M(pp[0], 3, pp[1]) });
    if (t < WORLD.F.F5.t1) { WORLD.apply(WORLD.flight('F5', t)); cam({ blur: .3 }); }
    if (t >= WORLD.F.Fm.t0) { WORLD.apply(WORLD.flight('Fm', t)); cam({ blur: .6 }); }
  }

  shots([[189.17, moon]]);
})();
