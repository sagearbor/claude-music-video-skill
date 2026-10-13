// country.js: the land BETWEEN districts (orchestrator-owned), in zones so the background never looks uniform:
//   CITY   high-rises + 3 skyscrapers going up with tower cranes (they grow across the whole song)
//   TOWN   pitched-roof houses, a church with a steeple, a plaza with a fountain
//   RIVER  a winding blue river with bridges where the roads cross, boats drifting
//   FOREST dense trees; FARMLAND patchwork fields with a tractor; HILLS stepped plate mounds on the horizon
// Static pieces are merged once per colour; living pieces animate only near the camera.
(() => {
  const { D } = WORLD, ROUTE = ['desk', 'stage', 'zoo', 'doom', 'bliss', 'roast', 'farm', 'stage'];
  const camNear = (x, z, r) => { const c = window.__camLook || [0, 0, 0]; return Math.hypot(x - c[0], z - c[2]) < r; };
  const rnd = i => hash(i * 7.31 + 1.7);
  const clear = (x, z, r = 48) => Object.values(D).every(([a, b]) => Math.hypot(x - a, z - b) > r);
  const RIVER = z0 => x => -95 + 22 * Math.sin(x / 70) + 10 * Math.sin(x / 23 + 1);   // river centre-line z(x)
  const riverZ = RIVER();
  const onRiver = (x, z, pad = 7) => Math.abs(z - riverZ(x)) < pad;
  const zone = (x, z) => x > 40 && x < 190 && z < -150 && z > -320 ? 'city' : x < -40 && x > -150 && z > 40 && z < 190 ? 'town'
    : x < -240 || (x < -100 && z < -80 && z > -170) ? 'forest' : x > 250 ? 'farm' : 'open';

  function tree(l, x, z, i, s = 1) { const c = rnd(i) < .5 ? COL.green : COL.dkgreen; l.push(['3062b', COL.brown, x, 1.2, z], ['3062b', COL.brown, x, 2.4, z], ['2423', c, x, 2.6, z, rnd(i) * 6], ['2423', c, x, 3.2, z, rnd(i + 3) * 6]); if (s > 1) l.push(['3062b', COL.brown, x, 3.6, z], ['2423', COL.dkgreen, x, 4.2, z, rnd(i + 5) * 6]); }
  function house(l, x, z, i, c) { for (let r = 1; r <= 3; r++) for (let a = -1; a <= 1; a++) for (const b of [-1, 1]) l.push(['3005', r === 2 && a === 0 ? COL.ltblue : c, x + a, r * 1.2, z + b * 1.5]);
    for (let r = 1; r <= 3; r++) for (const a of [-1, 1]) l.push(['3005', c, x + a, r * 1.2, z]);
    for (let k = 0; k < 3; k++) for (let a = -1; a <= 1; a++) l.push(['3024', COL.red, x + a, 4.0 + k * .4, z + (k - 1) * .9]); }   // stepped roof
  function tower(l, x, z, w, d, floors, c, glass) {   // a hollow high-rise; every second row has a window band
    for (let r = 1; r <= floors; r++) for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) { if (i && j && i < w - 1 && j < d - 1) continue; l.push(['3005', r % 2 && (i + j) % 2 ? glass : c, x + i - w / 2 + .5, r * 1.2, z + j - d / 2 + .5]); }
    for (let i = 0; i < w; i += 2) for (let j = 0; j < d; j += 2) l.push(['3022', COL.dkgrey, x + i - w / 2 + 1, floors * 1.2 + .4, z + j - d / 2 + 1]); }

  const statics = () => {
    const l = [];
    // roads (with bridges over the river)
    for (let i = 0; i + 1 < ROUTE.length; i++) {
      const [a, b] = [D[ROUTE[i]], D[ROUTE[i + 1]]], n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 2);
      for (let k = 0; k <= n; k++) { const x = Math.round(lerp(a[0], b[0], k / n) / 2) * 2, z = Math.round(lerp(a[1], b[1], k / n) / 2) * 2;
        if (!clear(x, z, 30)) continue; const br = onRiver(x, z, 9), y = br ? 1.6 : .02;
        l.push(['3068b', COL.dkgrey, x - 1, y, z, 0], ['3068b', COL.dkgrey, x + 1, y, z, 0]); if (br) l.push(['3010', COL.tan, x - 2.5, y, z, Math.PI / 2], ['3010', COL.tan, x + 2.5, y, z, Math.PI / 2]); }
    }
    // the river: blue tiles along the centre-line, sandy banks
    for (let x = -420; x <= 420; x += 2) { const zc = riverZ(x); for (let dz = -6; dz <= 6; dz += 2) { const z = Math.round((zc + dz) / 2) * 2; if (!clear(x, z, 34)) continue; if (Math.abs(dz) > 5) l.push(['3068b', COL.tan, x, .02, z]); } }
    // TOWN: a street grid of houses (60% of lots)
    for (let gx = -150; gx <= -40; gx += 9) for (let gz = 40; gz <= 190; gz += 9) { const i = gx * 31 + gz; if (!clear(gx, gz, 40) || Math.abs(gx + 95) < 10 && Math.abs(gz - 120) < 16) continue;
      if (rnd(i) < .6) house(l, gx, gz, i, [COL.white, COL.tan, COL.mustard, '#f0c8a8', COL.ltblue, '#e8b4b8'][Math.abs(i) % 6]); else if (rnd(i + 1) < .5) tree(l, gx, gz, i); }
    // FOREST: dense, jittered
    for (let gx = -420; gx <= -230; gx += 5) for (let gz = -260; gz <= 220; gz += 5) { const i = gx * 17 + gz * 3, x = gx + (rnd(i) - .5) * 4, z = gz + (rnd(i + 1) - .5) * 4;
      if (clear(x, z) && !onRiver(x, z, 9) && rnd(i + 2) < .75) tree(l, x, z, i, rnd(i + 3) < .4 ? 2 : 1); }
    for (let gx = -160; gx <= -100; gx += 5) for (let gz = -175; gz <= -120; gz += 5) { const i = gx * 13 + gz, x = gx + (rnd(i) - .5) * 4, z = gz + (rnd(i + 1) - .5) * 4; if (clear(x, z) && !onRiver(x, z, 9) && rnd(i + 2) < .7) tree(l, x, z, i, 2); }
    // OPEN land: fences around small paddocks, ponds
    for (let k = 0; k < 18; k++) { const x = (rnd(k + 300) - .5) * 560, z = (rnd(k + 400) - .5) * 520 - 40; if (!clear(x, z, 60) || onRiver(x, z, 14) || zone(x, z) !== 'open') continue;
      if (k % 3 === 0) { for (let u = -4; u <= 4; u += 2) for (let v = -3; v <= 3; v += 2) l.push(['3068b', '#3d7fd0', x + u, .02, z + v]); for (let u = -5; u <= 5; u += 2) l.push(['3005', COL.dkgreen, x + u, 1.2, z - 4]); }
      else { for (let u = -8; u <= 8; u += 2) for (const v of [-6, 6]) l.push(['3024', COL.brown, x + u, 1.6, z + v], ['3005', COL.brown, x + u, 1.2, z + v]); for (let u = -6; u <= 6; u += 6) for (let v = -4; v <= 4; v += 4) l.push(['3958', ['#d9b24a', '#7fae5a', '#c8d06a'][k % 3], x + u, .02, z + v]); } }
    // zones
    for (let i = 0; i < 1600; i++) {
      const x = (rnd(i) - .5) * 860, z = (rnd(i + 999) - .5) * 820 - 70; if (!clear(x, z) || onRiver(x, z, 9)) continue;
      const zn = zone(x, z), k = rnd(i + 55);
      if (zn === 'forest') { if (k < .85) tree(l, x, z, i, k < .4 ? 2 : 1); }
      else if (zn === 'city') { /* the city grid below */ }
      else if (zn === 'town') { /* the town grid above */ }
      else if (zn === 'farm') { if (k < .06) tree(l, x, z, i); }
      else { if (k < .07) tree(l, x, z, i); else if (k < .085) house(l, Math.round(x), Math.round(z), i, [COL.white, COL.red, COL.tan][i % 3]); }
    }
    // the town church + plaza
    const [cx, cz] = [-95, 115];
    for (let r = 1; r <= 5; r++) for (let a = -2; a <= 2; a++) for (const b of [-3, 3]) l.push(['3005', COL.white, cx + a, r * 1.2, cz + b]);
    for (let r = 1; r <= 5; r++) for (let b = -3; b <= 3; b++) for (const a of [-2, 2]) l.push(['3005', COL.white, cx + a, r * 1.2, cz + b]);
    for (let r = 6; r <= 14; r++) for (const [a, b] of [[0, -3], [1, -3], [0, -2], [1, -2]]) l.push(['3005', r > 12 ? COL.red : COL.white, cx + a - .5, r * 1.2, cz + b]);
    for (let a = -6; a <= 6; a += 2) for (let b = 6; b <= 16; b += 2) l.push(['3068b', COL.tan, cx + a, .02, cz + b]);
    l.push(['3062b', COL.ltblue, cx, 1.2, cz + 11], ['3062b', COL.ltblue, cx, 2.4, cz + 11], ['4740', COL.white, cx, 2.6, cz + 11]);
    // farmland patchwork (big coloured plates) near the farm
    for (let a = 0; a < 6; a++) for (let b = 0; b < 6; b++) { const x = 270 + a * 14, z = -110 + b * 14; if (!clear(x, z, 40)) continue; const c = ['#d9b24a', '#7fae5a', '#a07a3a', '#c8d06a', '#5f9a3a'][(a * 3 + b) % 5];
      for (let u = 0; u < 12; u += 6) for (let v = 0; v < 12; v += 6) l.push(['3958', c, x + u, .02, z + v]); }
    // hills on the horizon: stepped stacks of 6x6 plates
    for (let h = 0; h < 14; h++) { const a = h / 14 * Math.PI * 2, R = 470 + rnd(h) * 60, x = Math.cos(a) * R, z = Math.sin(a) * R - 70, n = 4 + Math.floor(rnd(h + 4) * 6);
      for (let s = 0; s < n; s++) { const w = n - s; for (let u = -w; u <= w; u++) for (let v = -w; v <= w; v++) if (Math.abs(u) === w || Math.abs(v) === w || s === n - 1) l.push(['3958', s > n - 3 ? COL.dkgreen : COL.green, x + u * 6, s * 3 + 1, z + v * 6]); } }
    return build(l);
  };

  // CITY: a street grid of tower blocks. Cheap: one textured box per tower (brick courses + window grid), a real plate roof.
  function towerTex(seed, col) { const c = document.createElement('canvas'); c.width = 256; c.height = 1024; const g = c.getContext('2d');
    g.fillStyle = col; g.fillRect(0, 0, 256, 1024); g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2;
    for (let y = 0; y < 1024; y += 12) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); for (let x = (y / 12) % 2 ? 0 : 16; x < 256; x += 32) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 12); g.stroke(); } }
    for (let y = 18; y < 1010; y += 36) for (let x = 14; x < 250; x += 40) { g.fillStyle = hash(seed + x * 3 + y) < .25 ? '#ffe9a8' : '#6f9fc8'; g.fillRect(x, y, 24, 20); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; }
  const city = () => { const g = new THREE.Group(), cols = ['#d8d2c4', '#b9c2cc', '#e8e0d0', '#a8b4c0', '#cfb9a0']; const mats = cols.map((c, i) => new THREE.MeshStandardMaterial({ map: towerTex(i * 97, c), roughness: .7 }));
    const roofs = [];
    for (let gx = 40; gx <= 190; gx += 13) for (let gz = -320; gz <= -150; gz += 13) { const i = gx * 7 + gz; if (!clear(gx, gz, 46) || rnd(i) < .25 || CRANES.some(([cx, cz]) => Math.hypot(cx - gx, cz - gz) < 14)) continue;
      const w = 6 + Math.floor(rnd(i + 1) * 3) * 2, d = 6 + Math.floor(rnd(i + 2) * 2) * 2, h = 18 + Math.floor(rnd(i + 3) ** 2 * 60);
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats[Math.abs(i) % 5]); const uv = m.geometry.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * w / 8, uv.getY(k) * h / 32); m.position.set(gx, h / 2, gz); m.castShadow = m.receiveShadow = true; g.add(m);
      for (let u = 0; u < w; u += 2) for (let v = 0; v < d; v += 2) roofs.push(['3022', COL.dkgrey, gx - w / 2 + u + 1, h + .4, gz - d / 2 + v + 1]);
      for (let u = -w / 2 - 2; u <= w / 2 + 2; u += 2) roofs.push(['3068b', COL.grey, gx + u, .02, gz + d / 2 + 2]); }
    g.add(build(roofs)); return g; };
  // skyscrapers under construction, each with a tower crane (grow across the whole song)
  const CRANES = [[120, -205, 14, 0], [160, -255, 12, 1], [70, -270, 10, 2]];
  function craneSite(x, z, floors0, i, t) {
    buildSite('sky' + i, { at: [x, z], w: 8, d: 8, floors: floors0 + 24, col: ['#b9c2cc', COL.white, COL.tan][i], t0: 0, t1: DUR - 10 - i * 8, robots: 2 }, t);
    const cr = keep('crane' + i, () => { const g = new THREE.Group(), y = COL.mustard, mast = []; for (let r = 1; r <= 40; r++) mast.push(['3005', y, 0, r * 1.2, 0]); g.add(build(mast));
      const jib = new THREE.Group(); jib.position.y = 49; const arm = new THREE.Mesh(new THREE.BoxGeometry(32, .8, .8), plastic(y)); arm.position.x = 8; jib.add(arm);
      const cw = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 2), plastic(COL.dkgrey)); cw.position.set(-7, -1, 0); jib.add(cw);
      const cab = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), plastic(COL.white)); cab.position.set(1.5, -1.5, 0); jib.add(cab);
      const trolley = new THREE.Group(); jib.add(trolley); const cable = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 1, 4), plastic(COL.black)); trolley.add(cable);
      const load = build([['3001', COL.red, -1, 0, 0], ['3001', COL.red, 1, 0, 0]]); trolley.add(load); g.add(jib); g.userData = { jib, trolley, cable, load }; return g; });
    const u = cr.userData, ph = frac(t / 14 + i * .3);
    u.jib.rotation.y = Math.sin(ph * Math.PI * 2) * 1.2 + i; u.trolley.position.x = 6 + 14 * (.5 + .5 * Math.sin(ph * Math.PI * 4)); const drop = 8 + 18 * (.5 + .5 * Math.cos(ph * Math.PI * 2));
    u.cable.scale.y = drop; u.cable.position.y = -drop / 2; u.load.position.y = -drop - .2;
    put(cr, x + 6, 0, z + 6);
  }
  // the river: a translucent trans-blue tile bed (merged once) + round tiles drifting downstream as ripples and foam
  const riverBed = () => { const l = []; for (let x = -420; x <= 420; x += 2) { const zc = riverZ(x); for (let dz = -4; dz <= 4; dz += 2) { const z = Math.round((zc + dz) / 2) * 2; if (clear(x, z, 34)) l.push(['3068b', '#2f6fc4', x, .02, z]); } }
    const g = build(l); g.traverse(o => { if (o.isMesh) o.material = plastic('#3a7fd8', { transparent: true, opacity: .82, roughness: .08, clearcoat: 1, clearcoatRoughness: .03 }); }); return g; };
  const RIPPLES = 260;
  const ripples = () => { const im = new THREE.InstancedMesh(partGeo('98138'), plastic('#cfe6ff', { transparent: true, opacity: .85, roughness: .1 }), RIPPLES); im.frustumCulled = false; const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; };
  function flow(t) {
    const r = keep('ripples', ripples), im = r.userData.im, M = new THREE.Matrix4(), q = new THREE.Quaternion(), c = window.__camLook || [0, 0, 0];
    let n = 0;
    for (let i = 0; i < RIPPLES * 3 && n < RIPPLES; i++) {
      const x = ((hash(i) * 840 + t * (6 + 3 * hash(i + 1))) % 840) - 420, z = riverZ(x) + (hash(i + 2) - .5) * 7;
      if (Math.hypot(x - c[0], z - c[2]) > 140 || !clear(x, z, 34)) continue;
      const k = frac(t * .7 + hash(i + 3)), s = .6 + .5 * Math.sin(k * Math.PI);   // each ripple swells and fades as it drifts
      M.compose(new THREE.Vector3(x, .3 + .05 * Math.sin(t * 3 + i), z), q, new THREE.Vector3(s, 1, s)); im.setMatrixAt(n++, M);
    }
    im.count = n; im.instanceMatrix.needsUpdate = true; put(r);
  }
  const BOATS = 4;
  function boats(t) { for (let i = 0; i < BOATS; i++) { const x = ((t * 3 + i * 210) % 840) - 420, z = riverZ(x) + (i % 2 ? 1.5 : -1.5);
    if (!camNear(x, z, 170)) continue; const b = keep('boat' + i, () => build([['3020', [COL.red, COL.white, COL.blue, COL.mustard][i], 0, .5, 0, 0], ['3004', COL.white, 0, 1.7, 0, 0]]));
    const z2 = riverZ(x + 1), yaw = Math.atan2(1, z2 - z); put(b, x, .2 + .1 * Math.sin(t * 2 + i), z, yaw); } }

  // fixed background easter eggs (chapters place their own district eggs)
  const EGG_AT = [['paperclipFactory', -150, -150, .4], ['shoggoth', 120, -120, -.5], ['gpuMine', -300, 60, 1.2], ['halEye', 90, -205, 0], ['captcha', -110, 80, .6], ['pdoomBoard', 40, 40, -.3],
    ['parrot', -70, 140, .3], ['chromeBot', 150, 60, 0], ['clipAssistant', -30, -150, .2], ['basilisk', 300, 120, -.8], ['offSwitch', 60, -60, .5], ['daisyBell', 100, 120]];
  const BILLBOARDS = [[-50, 30, .5, ['SINGULARITY', 'COMING SOON']], [80, -40, -.4, ['NOW HIRING:', 'HUMANS (legacy)']], [-160, -60, 1.0, ['Have you tried', 'turning it off?']],
    [170, -150, -.8, ['AGI by Friday', '(terms apply)']], [30, 110, .2, ['THIS TOWN IS', 'NOT A SIMULATION']], [260, -150, -1.2, ['Free GPUs', 'inside!']]];

  district('country', { at: [0, 0], always: true }, t => {
    put(flatGround('land', '#86b85e'));
    put(keep('country-statics', statics));
    put(keep('country-city', city));
    for (const [x, z, f, i] of CRANES) if (camNear(x, z, 260)) craneSite(x, z, f, i, t);
    put(keep('river-bed', riverBed)); flow(t); boats(t);
    for (const [name, x, z, ry] of EGG_AT) if (camNear(x, z, 330)) EGGS[name]('bg', t, x, z, ry);
    for (const [x, z, ry, lines] of BILLBOARDS) if (camNear(x, z, 360)) EGGS.billboard(lines.join('|'), t, x, z, ry, lines);
    // town life: people strolling the plaza, a tractor in the fields
    if (camNear(-95, 125, 300)) for (let j = 0; j < 5; j++) passerby('plaza', j, t, [[-103, 120], [-87, 120], [-87, 132], [-103, 132]], 1.2);
    if (camNear(300, -60, 360)) { const k = frac(t / 40), x = 275 + 70 * (k < .5 ? k * 2 : 2 - k * 2), tr = keep('tractor', () => build([['3020', COL.green, 0, 1.2, 0, Math.PI / 2], ['3003', COL.green, 0, 2.4, -.5, 0], ['3062b', COL.black, -1.5, 1.2, 1], ['3062b', COL.black, 1.5, 1.2, 1], ['3062b', COL.black, -1.5, 1.2, -1], ['3062b', COL.black, 1.5, 1.2, -1]]));
      put(tr, x, 0, -40, k < .5 ? Math.PI / 2 : -Math.PI / 2); }
    // road walkers near the camera
    const c = window.__camLook || [0, 0, 0];
    for (let i = 0; i + 1 < ROUTE.length; i++) { const [a, b] = [D[ROUTE[i]], D[ROUTE[i + 1]]], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      if (Math.hypot(m[0] - c[0], m[1] - c[2]) > 160) continue;
      for (let j = 0; j < 2; j++) passerby('road' + i, j, t, [[lerp(a[0], b[0], .25) + 3, lerp(a[1], b[1], .25)], [lerp(a[0], b[0], .75) + 3, lerp(a[1], b[1], .75)]], 1.4); }
  });
})();
