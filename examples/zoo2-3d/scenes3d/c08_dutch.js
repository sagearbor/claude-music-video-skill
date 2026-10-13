// c08_dutch.js: 168.35–189.17 s, the FARM district (Lancaster, the beat switch: fiddle, stomps, claps).
// One continuous camera (path) from the F4 landing to F5.A, then the F5 rocket flight toward the moon.
//   168.35 F4 lands · A 169.35 crew stomps ("PA Dutch been off-grid") · B 170.75 barn rises brick by brick on the stomps
//   C 173.46 dusk: the city skyline blacks out, the farm's lanterns come on, Pip shrugs ("that's a Tuesday")
//   D 176.25 horse and buggy trots the lane past a low-battery robot; corn sways · E 178.88 the gadget interview on the porch
//   F 181.52 "We're good, thank you": NO THANKS sign, Clawd slumps · G 184.07 the hex sign glows, a firewall dome bounces a robot
//   H 186.62 seed sacks from the stocked cellar to the rocket; lift-off 187.2; F5 from 187.90 (the rocket leads the camera)
// Eggs: EGGS.daisyBell on the farm lane, EGGS.gpuMine in the hillside by the vault.
(() => {
  const FA = (dx = 0, dy = 0, dz = 0) => WORLD.at('farm', dx, dy, dz);
  const T0 = 168.35, F4 = WORLD.F.F4, F5 = WORLD.F.F5;
  const RED = '#B5462E', CREAM = '#F6EAD0', OCHRE = '#E8AA38', GREEN = '#3F6B3A', WOOD = '#7A4E2C';
  const AMISH = ['#2b2f45', '#3e5a8a', '#5a3d6e', '#2f5d4a', '#6a2f3a', '#2b2b30', '#3e5a8a'];
  const beatsFrom = t0 => Math.ceil((t0 - OFF) / BEAT);
  const VAULT = [66, -44], PAD = [30, -4];   // the vault mound's door faces +z at VAULT z + 33.5

  // ---------- materials with per-frame intensity (owned by this chapter) ----------
  const lanternMat = () => keep('c08:lantern', () => new THREE.MeshStandardMaterial({ color: '#ffd27a', emissive: '#ffbb55', emissiveIntensity: .3, roughness: .4 }));
  const hexTex = () => keep('c08:hextex', () => {
    const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d'), x = 256, y = 256, r = 240;
    g.fillStyle = CREAM; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.strokeStyle = RED; g.lineWidth = 14; g.beginPath(); g.arc(x, y, r * .92, 0, 7); g.stroke();
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; g.fillStyle = i % 2 ? RED : GREEN; g.beginPath(); g.moveTo(x, y);
      g.lineTo(x + Math.cos(a + .22) * r * .38, y + Math.sin(a + .22) * r * .38); g.lineTo(x + Math.cos(a) * r * .82, y + Math.sin(a) * r * .82); g.lineTo(x + Math.cos(a - .22) * r * .38, y + Math.sin(a - .22) * r * .38); g.fill(); }
    g.fillStyle = OCHRE; g.beginPath(); g.arc(x, y, r * .2, 0, 7); g.fill();
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; g.beginPath(); g.arc(x + Math.cos(a) * r * .97, y + Math.sin(a) * r * .97, 8, 0, 7); g.fill(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; });
  const hexSign = () => keep('c08:hexsign', () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.CircleGeometry(2.3, 48),
    new THREE.MeshStandardMaterial({ map: hexTex(), emissive: '#ffffff', emissiveMap: hexTex(), emissiveIntensity: 0, roughness: .5 }));
    const rim = new THREE.Mesh(new THREE.TorusGeometry(2.3, .12, 8, 48), plastic(WOOD)); g.add(m, rim); g.userData.m = m; return g; });

  // ---------- the barn: 1x1 red bricks appear in batches on every beat (the stomps); stepped roof; cream corner trim ----------
  const BARN_T0 = 169.40, BARN_T1 = 175.10, ROOF_T1 = 176.0;
  const barn = () => keep('c08:barn', () => {
    const walls = [], roof = [];
    for (let r = 0; r < 8; r++) for (let i = 0; i < 14; i++) for (let j = 0; j < 10; j++) {
      if (i > 0 && i < 13 && j > 0 && j < 9) continue;
      const x = i - 6.5, z = j - 10.5;
      if (j === 9 && Math.abs(x) < 2 && r < 5) continue;                                 // the big door opening
      const corner = (i === 0 || i === 13) && (j === 0 || j === 9), win = r === 4 && j > 0 && j < 9 && (i === 0 || i === 13) && j % 3 === 1;
      walls.push(['3005', corner ? CREAM : win ? '#3a3f55' : RED, x, (r + 1) * 1.2, z, 0]);
    }
    for (let r = 8; r < 14; r++) { const w = 6.5 - (r - 8); for (let j = 0; j < 10; j++) { const z = j - 10.5;
      roof.push(['3005', '#5a5560', -w, (r + 1) * 1.2, z, 0], ['3005', '#5a5560', w, (r + 1) * 1.2, z, 0]);
      if (j === 0 || j === 9) for (let x = -w + 1; x <= w - 1; x++) roof.push(['3005', RED, x, (r + 1) * 1.2, z, 0]); } }
    for (let j = 0; j < 10; j++) roof.push(['3005', '#5a5560', -.5, 15.6, j - 10.5, 0], ['3005', '#5a5560', .5, 15.6, j - 10.5, 0]);
    const b0 = beatsFrom(BARN_T0), nb = Math.max(1, Math.floor((BARN_T1 - BARN_T0) / BEAT)), per = Math.ceil(walls.length / nb);
    const list = walls.map((w, k) => [...w, bt(b0 + Math.floor(k / per))]);
    const perR = Math.ceil(roof.length / 6);
    roof.forEach((w, k) => list.push([...w, BARN_T1 + Math.floor(k / perR) * (ROOF_T1 - BARN_T1) / 6]));
    return growing(list); });
  const barnDoors = () => keep('c08:barndoors', () => { const g = new THREE.Group(); for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(2, 6, .3), plastic(RED)); p.position.set(s * 3.2, 3, -.6); p.rotation.y = s * .9; p.castShadow = true; g.add(p);
    const x = new THREE.Mesh(new THREE.BoxGeometry(.15, 6.6, .32), plastic(CREAM)); x.rotation.set(0, p.rotation.y, .35 * s); x.position.copy(p.position); g.add(x); } return g; });

  // ---------- farmhouse with porch, the interview table ----------
  const farmhouse = () => keep('c08:house', () => { const l = [];
    for (let r = 1; r <= 5; r++) for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) { if (i > 0 && i < 7 && j > 0 && j < 5) continue; const x = i - 3.5, z = j - 2.5;
      if (j === 5 && Math.abs(x) < 1 && r < 4) continue; const win = r === 3 && (j === 5 || j === 0) && Math.abs(x) > 1.5 && Math.abs(x) < 3; l.push(['3005', win ? '#9fc3e9' : CREAM, x, r * 1.2, z]); }
    for (let k = 0; k < 4; k++) for (let i = -4 + k; i <= 4 - k; i++) l.push(['3005', RED, i, 7.2 + k * 1.2, -2.5], ['3005', RED, i, 7.2 + k * 1.2, 2.5]);
    for (let k = 0; k < 5; k++) for (let j = 0; j < 6; j++) for (const s of [-1, 1]) l.push(['3005', '#5a5560', s * (4.5 - k), 7.2 + k * 1.2, j - 2.5]);
    for (let i = -4; i <= 4; i += 2) for (let j = 3; j <= 7; j += 2) l.push(['3068b', WOOD, i, .02, j]);   // porch boards
    return build(l); });
  const table = () => keep('c08:table', () => build([['3005', WOOD, -1, 1.2, 0], ['3005', WOOD, 1, 1.2, 0], ['3020', WOOD, 0, 1.6, 0, 0]]));

  // ---------- horse + buggy ----------
  const horse = () => keep('c08:horse', () => { const g = new THREE.Group(), J = {}, BR = '#6b4226';
    g.add(build([['3001', BR, 0, 4.8, 0, 0], ['3001', BR, 0, 3.6, 0, 0]]));
    const head = new THREE.Group(); head.position.set(2.6, 4.8, 0); head.add(build([['3005', BR, 0, 1.2, 0], ['3005', BR, 0, 2.4, 0], ['3004', BR, .9, 3.0, 0, 0]]));
    const mane = new THREE.Mesh(new THREE.BoxGeometry(.4, 2.4, .5), plastic('#1b1b1f')); mane.position.set(-.5, 1.6, 0); head.add(mane);
    for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.12, 8, 6), plastic('#1b1b1f')); e.position.set(1.2, 2.6, s * .52); head.add(e); }
    g.add(head); J.head = head;
    J.legs = [[1.5, .5], [1.5, -.5], [-1.5, .5], [-1.5, -.5]].map(([x, z]) => { const l = new THREE.Group(); l.position.set(x, 2.4, z); for (let k = 0; k < 2; k++) { const b = part('3062b', k ? '#1b1b1f' : BR); b.position.y = -k * 1.2; l.add(b); } g.add(l); return l; });
    const tail = new THREE.Mesh(new THREE.BoxGeometry(.3, 2.2, .3), plastic('#1b1b1f')); tail.position.set(-2.3, 3.6, 0); tail.rotation.z = -.5; g.add(tail); J.tail = tail;
    g.userData.J = J; return g; });
  const buggy = () => keep('c08:buggy', () => { const g = new THREE.Group(), J = {};
    g.add(build([['3001', '#1b1b1f', 0, 2.8, -1, 0], ['3001', '#1b1b1f', 0, 2.8, 1, 0], ['3020', '#1b1b1f', 0, 1.6, 0, 0]]));
    const roof = new THREE.Mesh(new THREE.BoxGeometry(4.6, .3, 3.2), plastic('#3a3a40')); roof.position.y = 6.6; g.add(roof);
    for (const [x, z] of [[-2, -1.4], [2, -1.4], [-2, 1.4], [2, 1.4]]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 3.8, 6), plastic('#1b1b1f')); p.position.set(x, 4.7, z); g.add(p); }
    J.wheels = [[-1.3, -1.75], [1.3, -1.75], [-1.3, 1.75], [1.3, 1.75]].map(([x, z]) => { const w = new THREE.Group(); w.position.set(x, 1.1, z);
      w.add(new THREE.Mesh(new THREE.TorusGeometry(1.05, .1, 8, 24), plastic('#1b1b1f')));
      for (let k = 0; k < 4; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(.08, 2, .08), plastic(WOOD)); s.rotation.z = k * Math.PI / 4; w.add(s); } g.add(w); return w; });
    for (const s of [-1, 1]) { const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 4.2, 6), plastic(WOOD)); shaft.rotation.z = Math.PI / 2; shaft.position.set(3.8, 3.2, s * .9); g.add(shaft); }
    g.userData.J = J; return g; });

  // ---------- props ----------
  const strawHat = () => { const g = new THREE.Group(), m = plastic('#d9b24a', { roughness: .7 });
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, .08, 24), m); brim.position.y = .05; const band = new THREE.Mesh(new THREE.CylinderGeometry(.64, .64, .14, 20), plastic('#1b1b1f'));
    band.position.y = .16; const crown = new THREE.Mesh(new THREE.CylinderGeometry(.6, .66, .5, 20), m); crown.position.y = .35; g.add(brim, band, crown); g.traverse(o => o.isMesh && (o.castShadow = true)); return g; };
  const hammer = k => keep('c08:hammer' + k, () => { const g = new THREE.Group(), h = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, 1.7, 6), plastic(WOOD)); h.position.y = .45; g.add(h);
    const head = new THREE.Mesh(new THREE.BoxGeometry(.8, .35, .35), plastic('#8a8f96', { metalness: .6, roughness: .3 })); head.position.y = 1.25; g.add(head); return g; });
  const sack = k => keep('c08:sack' + k, () => { const g = new THREE.Group(), s = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, .9), plastic('#d8c08a', { roughness: .9 })); s.position.set(0, .3, .4); g.add(s);
    const tie = new THREE.Mesh(new THREE.CylinderGeometry(.18, .3, .4, 8), plastic('#b89a5a')); tie.position.set(0, .95, .4); g.add(tie); g.traverse(o => o.isMesh && (o.castShadow = true)); return g; });
  const crew = i => keep('c08:crew' + i, () => { const f = fig('c08n' + i, { ...crowdLook(i + 3), hat: null, torso: AMISH[i % AMISH.length], arms: AMISH[i % AMISH.length], legs: '#1b1b1f' });
    f.userData.J.head.add(strawHat()); return f; });

  // ---------- the blackout city on the horizon (its own dark towers; windows go out at 174.1, one tower after another) ----------
  const CITY = [[96, -126, 7, 34], [104, -134, 6, 46], [113, -124, 8, 28], [120, -138, 6, 52], [128, -128, 7, 38], [90, -140, 6, 24]];
  const winTex = () => keep('c08:wintex', () => { const c = document.createElement('canvas'); c.width = 128; c.height = 512; const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 128, 512);
    for (let y = 10; y < 500; y += 22) for (let x = 8; x < 120; x += 24) if (hash(x * 7 + y) > .3) { g.fillStyle = '#ffd27a'; g.fillRect(x, y, 14, 12); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; });
  const cityTowers = () => keep('c08:city', () => { const g = new THREE.Group(); g.userData.mats = [];
    CITY.forEach(([x, z, w, h]) => { const m = new THREE.MeshStandardMaterial({ color: '#4a4e5c', emissive: '#ffffff', emissiveMap: winTex(), emissiveIntensity: 1, roughness: .7 });
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), m); b.position.set(x, h / 2, z); b.castShadow = true; g.add(b); g.userData.mats.push(m); }); return g; });
  const BLACKOUT = 174.10;

  // ---------- the seed-vault hillside: a stepped mound, a round vault door, the cellar shelves stocked wall to wall ----------
  const vault = () => keep('c08:vault', () => { const l = [];
    for (let s = 0; s < 5; s++) { const w = 5 - s; for (let u = -w; u <= w; u++) for (let v = -w; v <= w; v++) if (Math.abs(u) === w || Math.abs(v) === w || s === 4) l.push(['3958', s > 2 ? GREEN : '#5f8a3a', u * 6, s * 2.4 + .4, v * 6]); }
    for (let r = 1; r <= 6; r++) for (const x of [-3.5, 3.5]) l.push(['3005', '#8a8f96', x, r * 1.2, 33.5]);
    for (let x = -3.5; x <= 3.5; x++) l.push(['3005', '#8a8f96', x, 8.4, 33.5]);
    for (let r = 1; r <= 6; r++) for (let x = 5.5; x <= 13.5; x++) l.push(['3005', '#8a8f96', x, r * 1.2, 33.5]);           // the cellar wall
    for (let k = 0; k < 4; k++) for (let x = 6; x <= 13; x += 1) l.push(['3024', WOOD, x, 1.3 + k * 1.7, 34.5]);           // shelves
    return build(l); });
  const jars = () => keep('c08:jars', () => { const g = new THREE.Group(); for (let k = 0; k < 4; k++) for (let i = 0; i < 8; i++) { const j = new THREE.Mesh(new THREE.CylinderGeometry(.32, .32, .9, 10), plastic(['#e8aa38', '#c4281c', '#4b9f4a', '#e4cd9e'][(i + k) % 4], { transparent: true, opacity: .88, roughness: .15 }));
    j.position.set(6 + i, 1.8 + k * 1.7, 34.5); g.add(j); } return g; });
  const vaultDoor = () => keep('c08:vaultdoor', () => { const g = new THREE.Group(), d = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, .6, 32), plastic('#9aa0a8', { metalness: .6, roughness: .3 }));
    d.rotation.x = Math.PI / 2; d.position.set(3, 3.8, 0); g.add(d); const w = new THREE.Mesh(new THREE.TorusGeometry(1.2, .15, 8, 24), plastic('#5a5f66', { metalness: .7 })); w.position.set(3, 3.8, .4); g.add(w); return g; });

  // ---------- the seed rocket (an always-on district during the launch + the F5 flight) ----------
  // the rocket rides the camera's look point during F5 (centre frame for the whole flight); before that it lifts off the pad
  const rocketPos = t => {
    const pad = FA(PAD[0], .6, PAD[1]);
    if (t <= 187.2) return pad;
    if (t < F5.t0) { const k = easeIn(seg(t, 187.2, F5.t0)), e = F5.A.look; return pad.map((v, i) => lerp(v, e[i], k)); }
    return WORLD.flight('F5', Math.min(t, F5.t1)).look;
  };
  const rocket = () => keep('c08:rocket', () => { const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
    const hull = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 9, 32), plastic(CREAM)); hull.position.y = 4.5; body.add(hull);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.2, 32), plastic(RED)); nose.position.y = 10.6; body.add(nose);
    for (const y of [2.0, 7.4]) { const band = new THREE.Mesh(new THREE.CylinderGeometry(1.63, 1.63, .5, 32), plastic(RED)); band.position.y = y; body.add(band); }
    const win = new THREE.Mesh(new THREE.CircleGeometry(.6, 24), plastic('#7fb3e0', { roughness: .1 })); win.position.set(0, 6.0, 1.62); body.add(win);
    const hx = new THREE.Mesh(new THREE.CircleGeometry(.75, 32), new THREE.MeshStandardMaterial({ map: hexTex(), roughness: .5 })); hx.position.set(0, 4.2, 1.62); body.add(hx);
    for (let k = 0; k < 3; k++) { const f = new THREE.Mesh(new THREE.BoxGeometry(.25, 2.6, 1.6), plastic(RED)); const p = new THREE.Group(); p.rotation.y = k * Math.PI * 2 / 3; f.position.set(0, 1.0, 2.1); p.add(f); body.add(p); }
    const flame = new THREE.Group(); const o = new THREE.Mesh(new THREE.ConeGeometry(1.1, 4, 16), new THREE.MeshStandardMaterial({ color: '#ff8a2a', emissive: '#ff7a1a', emissiveIntensity: 3, transparent: true, opacity: .85 }));
    o.rotation.x = Math.PI; o.position.y = -2; flame.add(o); const n = new THREE.Mesh(new THREE.ConeGeometry(.6, 2.6, 16), new THREE.MeshStandardMaterial({ color: '#fff2a8', emissive: '#ffe08a', emissiveIntensity: 4 }));
    n.rotation.x = Math.PI; n.position.y = -1.3; flame.add(n); body.add(flame); g.userData = { body, flame }; g.traverse(m => m.isMesh && (m.castShadow = true)); return g; });
  const puffMat = () => keep('c08:puffmat', () => plastic('#f4f1ea', { roughness: .9 }));
  const puff = i => keep('c08:puff' + i, () => new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), puffMat()));
  const launchPad = () => keep('c08:pad', () => { const l = []; for (let u = -1; u <= 1; u++) for (let v = -1; v <= 1; v++) l.push(['3958', '#8a8f96', u * 6, .4, v * 6]);
    for (let r = 1; r <= 9; r++) l.push(['3005', '#c4281c', 4.5, .8 + r * 1.2, 0]); return build(l); });

  district('c08rocket', { at: [0, 0], always: true }, t => {
    if (t < 160 || t > F5.t1) return;
    const p = rocketPos(t), q = rocketPos(t + .06), d = new THREE.Vector3(q[0] - p[0], q[1] - p[1], q[2] - p[2]);
    if (t < 186 && !(window.__camLook && Math.hypot(window.__camLook[0] - p[0], window.__camLook[2] - p[2]) < 330)) return;
    const R = rocket(); put(R, p[0], p[1], p[2]);
    if (t > F5.t0) { const m = F5.B.look, k = seg(t, F5.t0, F5.t0 + .6), toMoon = new THREE.Vector3(m[0] - p[0], m[1] - p[1], m[2] - p[2]).normalize();
      if (d.length() > 1e-4) d.normalize(); d.lerp(toMoon, .75 * k); }                // nose toward the moon once in flight
    if (d.length() > 1e-4) R.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); else R.quaternion.identity();
    const lit = t > 186.9, fl = R.userData.flame; fl.visible = lit; fl.scale.set(1, lit ? (t < 187.2 ? .4 + .6 * seg(t, 186.9, 187.2) : 1.4) * (1 + .15 * Math.sin(t * 47)) : 1, 1);
    if (t > 187.0) for (let k = 1; k <= 16; k++) {                                // smoke trail: cotton-wool puffs at the rocket's past positions
      const tk = t - k * .07; if (tk < 187.0) break; const pp = rocketPos(tk), m = puff(k), s = .8 + k * .28;
      put(m, pp[0] + Math.sin(k * 3.1) * .06 * k, pp[1] - 1.5, pp[2] + Math.cos(k * 2.3) * .06 * k, 0, s);
    }
  });

  // ---------- the farm district: set, ambient life, eggs ----------
  district('farm', { at: WORLD.D.farm, r: 70 }, t => {
    const C = FA();
    put(keep('c08:ground', () => studGround('c08farm', '#9cc062', 8)), C[0], 0, C[2] - 8);
    const b = barn(); b.userData.grow(t); put(b, C[0], 0, C[2]);
    if (t > BARN_T1) put(barnDoors(), C[0], 0, C[2] - 1);
    const hs = hexSign(), up = ease(seg(t, ROOF_T1 - .3, ROOF_T1 + .3)); hs.userData.m.material.emissiveIntensity = kf(t, [[184.3, 0], [184.6, 1.6], [186.4, 1.6], [186.9, .2]]) * (1 + .3 * pulse(t, 5));
    if (up > 0) put(hs, C[0], 11.4, C[2] - .85, 0, up);
    put(farmhouse(), ...FA(-20, 0, -4)); put(table(), ...FA(-18, 0, 2));
    put(vault(), ...FA(VAULT[0], 0, VAULT[1])); put(jars(), ...FA(VAULT[0], 0, VAULT[1]));
    put(vaultDoor(), ...FA(VAULT[0] - 3, 0, VAULT[1] + 34.1), -1.6 * ease(seg(t, 186.0, 186.7)));
    put(launchPad(), ...FA(PAD[0], 0, PAD[1]));
    // lanterns along the lane: low by day, glowing once the city blacks out
    const lm = lanternMat(); lm.emissiveIntensity = .25 + 2.3 * ease(seg(t, BLACKOUT + .15, BLACKOUT + .7)) * (1 - .4 * ease(seg(t, 177.0, 178.5))) * (1 + .08 * Math.sin(t * 11));
    const LAMPS = [-44, 14, 22, 30, 38];
    for (let i = 0; i < LAMPS.length; i++) { const Lp = keep('c08:lamp' + i, () => { const g = new THREE.Group(); g.add(build([['3005', WOOD, 0, 1.2, 0], ['3005', WOOD, 0, 2.4, 0], ['3005', WOOD, 0, 3.6, 0]])); const s = new THREE.Mesh(new THREE.SphereGeometry(.42, 12, 8), lanternMat()); s.position.y = 4.1; g.add(s); return g; });
      put(Lp, ...FA(LAMPS[i], 0, 7)); }
    for (const s of [-1, 1]) { const bl = keep('c08:barnlamp' + s, () => new THREE.Mesh(new THREE.SphereGeometry(.5, 12, 8), lanternMat())); put(bl, ...FA(s * 3.6, 7.4, -.5)); }   // lights by the barn door
    // the corn field, swaying
    const corn = keep('c08:corn', () => { const im = new THREE.InstancedMesh(partGeo('30176'), plastic('#6fae3a'), 99); im.castShadow = true; const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; });
    { const im = corn.userData.im, M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(); let n = 0;
      for (let x = 10; x <= 20; x += 2) for (let z = -18; z <= -2; z += 2) { M.compose(new THREE.Vector3(x, 0, z), q.setFromEuler(e.set(.1 * Math.sin(t * 1.7 + x * .3), hash(x * 9 + z) * 6, .1 * Math.sin(t * 1.3 + z * .4))), new THREE.Vector3(1.1, 2.3, 1.1)); im.setMatrixAt(n++, M); }
      im.count = n; im.instanceMatrix.needsUpdate = true; put(corn, C[0], 1.2, C[2]); }
    // the blackout city
    const city = cityTowers(); city.userData.mats.forEach((m, i) => { const tOff = BLACKOUT + i * .09, fl = t > tOff - .25 && t < tOff ? (Math.sin(t * 90 + i) > 0 ? 1 : .2) : 1;
      m.emissiveIntensity = (t < tOff ? 1.2 : 0) * fl; }); put(city, C[0], 0, C[2]);
    // the low-battery robot slumped by its sign
    const lb = keep('c08:lowbat', robot); robotPose(lb, { walk: 0, carry: false }); put(lb, ...FA(-24, 0, 9.5), .3); lb.rotation.x = .25;
    put(sign('c08lowbat', ['LOW BATTERY'], { w: 3.6, h: 1, bg: '#1b1b1f', fg: '#ff4a3a', size: 90, post: true, postH: 1.6 }), ...FA(-28.5, 0, 8.5), .3);
    // eggs
    const dz = FA(36, 0, 30); EGGS.daisyBell('c08', t, dz[0], dz[2], 8);
    const gm = FA(14, 0, -60); EGGS.gpuMine('c08', t, gm[0], gm[2], 0);
    // a sower and neighbours strolling the lane
    field('c08', { at: [C[0] + 44, C[2] + 16], rows: 4, len: 14, t0: 150, t1: 200, look: 9 }, t);
    for (let i = 0; i < 2; i++) passerby('c08lane', i, t, [[C[0] - 40, C[2] - 46], [C[0] + 34, C[2] - 46]], 1.3);
  });

  // ---------- camera: farm-relative keys (pos, look, fov) through the whole chapter ----------
  const P = [[F4.t1, [0, 7, 28]], [170.0, [-1.5, 6.6, 25]], [170.75, [-4, 6.4, 22]], [172.0, [-14, 8, 18]], [173.46, [-11, 11, 25]], [174.6, [-5, 10, 27]],
    [175.8, [-4, 8, 32]], [176.6, [-22, 7, 40]], [177.7, [-4, 7, 40]], [178.88, [-34, 6.5, 9]], [180.2, [-34, 6, 7]], [181.52, [-33.5, 5.6, 5.5]],
    [182.8, [-34, 6, 6.5]], [183.5, [-32, 9, 22]], [184.07, [-14, 10, 28]], [185.2, [3, 9, 27]], [186.62, [12, 10, 34]], [187.3, [8, 16, 32]], [F5.t0, [0, 30, 20]]];
  const L = [[F4.t1, [0, 4, 0]], [170.0, [0, 3.8, -2]], [170.75, [0, 3.6, -4]], [172.0, [0, 4.5, -6]], [173.46, [0, 6, -6]], [174.6, [40, 10, -70]],
    [175.8, [-6, 4, 12]], [176.6, [-14, 3.5, 12]], [177.7, [6, 3.5, 12]], [178.88, [-17, 3.6, 5]], [180.2, [-17, 3.6, 5]], [181.52, [-17, 3.8, 4.5]],
    [182.8, [-17, 4, 4]], [183.5, [-12, 5, 2]], [184.07, [-2, 9, -2]], [185.2, [4, 7, 0]], [186.62, [44, 5, -6]], [187.3, [26, 22, -6]], [F5.t0, [0, 60, -10]]];
  const FOV = [[F4.t1, 34], [173.46, 36], [174.6, 32], [176.6, 36], [178.88, 32], [184.07, 32], [185.2, 36], [186.62, 38], [F5.t0, 40]];
  const abs = keys => keys.map(([tt, p]) => [tt, FA(...p)]);
  const PA = abs(P), LA = abs(L);

  function dutch(t) {
    const C = FA();
    if (t < F4.t1) WORLD.apply(WORLD.flight('F4', t));
    else if (t >= F5.t0) WORLD.apply(WORLD.flight('F5', t));
    else {
      const pos = path(t, PA, { easeEnds: false }), lk = path(t, LA, { easeEnds: false }), fov = path(t, FOV, { easeEnds: false });
      const d = drift(t - F4.t1, .5 * Math.min(seg(t, F4.t1, F4.t1 + 1.5), 1 - seg(t, 186.8, F5.t0)));
      const sh = t > 185.6 && t < 186.62 ? shake(t, .25 * Math.exp(-(t - 185.6) * 6)) : [0, 0, 0];
      if (t > 187.2) { const rp = rocketPos(t), k = ease(seg(t, 187.2, 187.55)); for (let i = 0; i < 3; i++) lk[i] = lerp(lk[i], rp[i] + (i === 1 ? 5 : 0) * (1 - seg(t, 187.55, F5.t0)), k); }   // track the lift-off
      cam({ pos: [pos[0] + d[0] + sh[0], pos[1] + d[1] + sh[1], pos[2] + d[2]], look: [lk[0] + sh[0] * .3, lk[1], lk[2]], fov, blur: .7, focus: t > 184.07 && t < 186.62 ? FA(0, 10, -1) : undefined });
      const k = ease(seg(t, 173.3, 174.3)) * (1 - ease(seg(t, 175.9, 177.0)));      // dusk for the blackout, then back to afternoon
      const base = WORLD.LOOK.farm, dusk = { sky: ['#2a3566', '#f09a5a', '#6a5040'], keyCol: '#ffb070', keyInt: 2.2, fill: .35, exposure: .92 };
      look({ ...base, sky: mixVal(base.sky, dusk.sky, k), keyCol: mixVal(base.keyCol, dusk.keyCol, k), keyInt: lerp(base.keyInt, dusk.keyInt, k), fill: lerp(base.fill, dusk.fill, k), exposure: lerp(base.exposure, dusk.exposure, k) });
    }

    // ---- the crew: stomp + clap (A), hammer on the beats (B–G), carry seed sacks then cheer the launch (H) ----
    for (let i = 0; i < 6; i++) {
      const f = crew(i), stomp = pulse(t, 7), h = Math.exp(-frac((t - OFF) / BEAT + i * .5) * 6);
      let x = -6 + i * 2.4, z = 3.2, ry = 0, p = { face: i % 2 ? 'joy' : 'laugh' };
      if (t < 170.75) { p = { ...p, ...dance(i % 2 ? 'clap' : 'bounce', t, { offset: i % 2 ? 0 : .5 }), bodyY: .3 * stomp }; ry = (i - 2.5) * .12; }
      else if (t < 186.62) { ry = Math.PI; z = .6 + (i % 2) * .6; x = -5.5 + i * 2.2; p = { ...p, armR: .5 + 1.9 * (1 - h), armL: .3, holdR: hammer(i), face: 'determined', lean: .1 }; }
      else { const k = seg(t, 186.62 + i * .08, 187.5 + i * .08); x = lerp(VAULT[0] - 4 + i * 1.6, PAD[0] + 11 + i * 1.6, k); z = 3 + (i % 3) * 2; ry = -Math.PI / 2;
        p = { ...p, ...walk(t * 1.6 + i * .3), armL: .9, armR: .9, holdR: sack(i), face: 'joy' };
        if (t > 187.45) { p = { ...dance('jump', t, { offset: i * .25 }), face: 'star' }; ry = -Math.PI * .75; } }
      put(pose(f, p), C[0] + x, 0, C[2] + z, ry);
    }

    // ---- Pip ----
    const pip = fig('pip', PIP);
    if (t < 170.75) put(pose(pip, { ...dance('bounce', t), face: 'joy', bodyY: .3 * pulse(t, 7) }), C[0], 0, C[2] + 6, 0);
    else if (t < 173.46) { const h = Math.exp(-frac((t - OFF) / BEAT) * 6); put(pose(pip, { armR: .5 + 1.9 * (1 - h), armL: .3, holdR: hammer('pip'), face: 'determined' }), C[0] + 7.6, 0, C[2] + .6, Math.PI * .75); }
    else if (t < 175.9) put(pose(pip, { ...(t > 174.6 ? dance('shrug', t) : {}), face: t > 174.6 ? 'smug' : 'neutral', head: t > 174.6 ? -.4 : .6 }), C[0] - 3, 0, C[2] + 9, t > 174.6 ? .2 : 2.4);
    else if (t < 178.88) { /* riding the buggy (below) */ }
    else if (t < 184.07) { const nod = t > 182.8 ? .25 * Math.sin((t - 182.8) * 9) * (1 - seg(t, 183.4, 184)) : 0;
      put(pose(pip, { armL: 1.0, armR: 1.0, armLz: -.7, armRz: -.7, face: t > 182.6 ? 'smug' : 'suspicious', headTilt: nod, head: .5 }), ...FA(-14.5, 0, 2.5), -.8); }
    else if (t < 186.62) put(pose(pip, { face: t > 185.6 ? 'laugh' : 'joy', headTilt: -.35, armR: t > 185.6 ? 2.6 : 1.4, armRz: .2 }), ...FA(3.5, 0, 6), -.2);
    else { const k = seg(t, 186.62, 187.4); put(pose(pip, t < 187.35 ? { ...walk(t * 1.6), armL: .9, armR: .9, holdR: sack('pip'), face: 'determined' } : { ...dance('wave', t), face: 'star', headTilt: -.5 }),
      ...FA(lerp(VAULT[0] - 8, PAD[0] + 10, k), 0, 9), t < 187.35 ? -Math.PI / 2 : -2.4); }

    // ---- D: horse and buggy trot the lane (Pip rides, waving) ----
    if (t > 175.9 && t < 179.6) {
      const k = seg(t, 175.9, 179.6), x = lerp(-44, 34, k), H = horse(), B = buggy(), tr = t * 9;
      H.userData.J.legs.forEach((l, i) => { l.rotation.z = .45 * Math.sin(tr + (i === 0 || i === 3 ? 0 : Math.PI)); });
      H.userData.J.head.rotation.z = .08 * Math.sin(tr * 2); H.userData.J.tail.rotation.x = .3 * Math.sin(tr);
      put(H, ...FA(x + 6.4, .15 * Math.abs(Math.sin(tr)), 12.5));
      B.userData.J.wheels.forEach(w => { w.rotation.z = -(x / 1.05); }); put(B, ...FA(x, 0, 12.5));
      put(pose(crew(6), { legL: 1.5, legR: 1.5, bodyY: -1.1, armL: 1.0, armR: 1.0, face: 'neutral' }), ...FA(x + .9, 2.5, 12.5), Math.PI / 2);
      if (t > 176.0) put(pose(pip, { legL: 1.5, legR: 1.5, bodyY: -1.1, ...dance('wave', t), face: 'joy', head: -1.2 }), ...FA(x - .9, 2.5, 12.5), Math.PI / 2);
    }

    // ---- E/F: the gadget interview on the porch ----
    if (t > 177.8 && t < 186.62) {
      const iv = keep('c08:interviewer', () => { const f = fig('c08iv', { ...crowdLook(4), head: '3626cp7p', hat: null, torso: '#2b2f45', arms: '#2b2f45', legs: '#1b1b1f' }); f.userData.J.head.add(strawHat()); return f; });
      const shakeNo = t > 182.0 && t < 183.0 ? .5 * Math.sin((t - 182.0) * 14) : 0, sayNo = t > 182.7;
      put(pose(iv, { legL: 1.5, legR: 1.5, bodyY: -1.25, armL: 1.0, armR: sayNo ? 1.9 : 1.0, head: shakeNo, face: t > 182.0 ? 'neutral' : 'suspicious' }), ...FA(-18, 0, -.2), 0);
      if (sayNo) put(sign('c08no', ['NO THANKS'], { w: 4.2, h: 1.3, size: 110, bg: CREAM, fg: RED }), ...FA(-17.2, 5.6 + .1 * Math.sin(t * 6), 1.3), 0, ease(seg(t, 182.7, 183.0)));
      if (t < 184.07) {   // the queue: Clawd first, then a robot and a TV-on-legs, hopping on the beat
        const Cw = clawd('c08', {}), slump = ease(seg(t, 182.9, 183.5));
        clawdPose(Cw, { face: t > 182.9 ? 'shocked' : t > 181.52 ? 'suspicious' : 'smug', hat: 'headset', armL: .4 + .4 * pulse(t, 6) * (1 - slump), armR: .4, lean: .2 * slump, bob: .15 * pulse(t, 7) * (1 - slump), squash: .25 * slump });
        put(Cw, ...FA(-18 + 2.4 * slump, 0, 6.8 + 1.5 * slump), Math.PI + .5 * slump);
      }
      const rb = keep('c08:qbot', robot); robotPose(rb, { walk: t * 2, carry: false }); put(rb, ...FA(-18, .2 * pulse(t, 8), 10.8), Math.PI);
      const tv = keep('c08:tv', () => { const g = build([['3003', '#1b1b1f', 0, 3.6, 0], ['3003', '#1b1b1f', 0, 2.4, 0], ['3005', '#1b1b1f', -.5, 1.2, 0], ['3005', '#1b1b1f', .5, 1.2, 0]]);
        const s = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), glowMat('#7fd0ff', 1.4)); s.position.set(0, 3.0, 1.02); g.add(s); return g; });
      put(tv, ...FA(-18, .2 * pulse(t + .3, 8), 14), Math.PI);
    }

    // ---- G: the hex sign glows; the firewall dome bounces a gadget ----
    if (t > 183.8 && t < 186.9) {
      const dome = keep('c08:dome', () => { const g = new THREE.Group(); const w = new THREE.Mesh(new THREE.IcosahedronGeometry(10, 2), new THREE.MeshBasicMaterial({ color: '#ffd27a', wireframe: true, transparent: true, opacity: .5 }));
        const f = new THREE.Mesh(new THREE.SphereGeometry(9.9, 32, 16), new THREE.MeshBasicMaterial({ color: '#ffcc66', transparent: true, opacity: .12, depthWrite: false })); g.add(w, f); g.userData = { w, f }; return g; });
      const on = ease(seg(t, 184.6, 185.0)) * (1 - ease(seg(t, 186.2, 186.7))), hit = t > 185.6 ? Math.exp(-(t - 185.6) * 5) : 0;
      dome.userData.w.material.opacity = .45 * on + .5 * hit; dome.userData.f.material.opacity = .08 * on + .25 * hit;
      if (on > .01) put(dome, C[0], 4, C[2] - 6, t * .2, on * (1 + .06 * hit));
      const bot = keep('c08:roguebot', robot), kIn = seg(t, 184.4, 185.6), kOut = seg(t, 185.6, 186.4);
      robotPose(bot, { walk: t * 2.5, carry: false }); const bx = t < 185.6 ? lerp(24, 10.2, kIn) : lerp(10.2, 22, easeOut(kOut));
      put(bot, ...FA(bx, t < 185.6 ? 0 : 3 * Math.sin(Math.PI * kOut), 2), -Math.PI / 2); if (t > 185.6) bot.rotation.z = -2.6 * easeOut(kOut);
      if (t >= 184.07) { const Cw = clawd('c08', {}); clawdPose(Cw, { face: t > 185.6 ? 'shocked' : 'suspicious', hat: 'headset', armL: t > 185.6 ? 1 : .2, armR: t > 185.6 ? 1 : .2 }); put(Cw, ...FA(-9, 0, 7), .5); }
    }
  }
  shots([[T0, dutch]]);
  window.C08 = { rocketPos };   // for c09: where the seed rocket is during F5 (this file draws it until F5.t1)
})();
