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
  const VAULT = [64, -30], PAD = [54, 4], VW = 3;   // a stepped mound (VW rings); its door faces +z at VAULT z + 6*VW + 3.5

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
    const DZ = 6 * VW + 3.5;
    for (let s = 0; s < VW; s++) { const w = VW - s; for (let u = -w; u <= w; u++) for (let v = -w; v <= w; v++) if (Math.abs(u) === w || Math.abs(v) === w || s === VW - 1) l.push(['3958', s > 0 ? GREEN : '#5f8a3a', u * 6, s * 2.4 + .4, v * 6]); }
    for (let r = 1; r <= 6; r++) for (const x of [-3.5, 3.5]) l.push(['3005', '#8a8f96', x, r * 1.2, DZ]);
    for (let x = -3.5; x <= 3.5; x++) l.push(['3005', '#8a8f96', x, 8.4, DZ]);
    for (let r = 1; r <= 6; r++) for (let x = 5.5; x <= 13.5; x++) l.push(['3005', '#8a8f96', x, r * 1.2, DZ]);            // the cellar wall
    for (let k = 0; k < 4; k++) for (let x = 6; x <= 13; x += 1) l.push(['3024', WOOD, x, 1.3 + k * 1.7, DZ + 1]);          // shelves
    return build(l); });
  const jars = () => keep('c08:jars', () => { const g = new THREE.Group(); for (let k = 0; k < 4; k++) for (let i = 0; i < 8; i++) { const j = new THREE.Mesh(new THREE.CylinderGeometry(.32, .32, .9, 10), plastic(['#e8aa38', '#c4281c', '#4b9f4a', '#e4cd9e'][(i + k) % 4], { transparent: true, opacity: .88, roughness: .15 }));
    j.position.set(6 + i, 1.8 + k * 1.7, 6 * VW + 4.5); g.add(j); } return g; });
  const vaultDoor = () => keep('c08:vaultdoor', () => { const g = new THREE.Group(), d = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, .6, 32), plastic('#9aa0a8', { metalness: .6, roughness: .3 }));
    d.rotation.x = Math.PI / 2; d.position.set(3, 3.8, 0); g.add(d); const w = new THREE.Mesh(new THREE.TorusGeometry(1.2, .15, 8, 24), plastic('#5a5f66', { metalness: .7 })); w.position.set(3, 3.8, .4); g.add(w); return g; });

  // ---------- the seed rocket (an always-on district during the launch + the F5 flight) ----------
  const rocket = () => keep('c08:rocket', () => { const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
    const hull = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 9, 32), plastic(CREAM)); hull.position.y = 4.5; body.add(hull);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.2, 32), plastic(RED)); nose.position.y = 10.6; body.add(nose);
    for (const y of [2.0, 7.4]) { const band = new THREE.Mesh(new THREE.CylinderGeometry(1.63, 1.63, .5, 32), plastic(RED)); band.position.y = y; body.add(band); }
    const win = new THREE.Mesh(new THREE.CircleGeometry(.6, 24), plastic('#7fb3e0', { roughness: .1 })); win.position.set(0, 6.4, 1.62); body.add(win);
    const hatch = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.6, .12), plastic('#3a3f55')); hatch.position.set(0, 2.6, 1.6); body.add(hatch);   // the cargo hatch (faces +z, the camera side)
    const hx = new THREE.Mesh(new THREE.CircleGeometry(.75, 32), new THREE.MeshStandardMaterial({ map: hexTex(), roughness: .5 })); hx.position.set(0, 4.5, 1.62); body.add(hx);
    for (let k = 0; k < 3; k++) { const f = new THREE.Mesh(new THREE.BoxGeometry(.25, 2.6, 1.6), plastic(RED)); const p = new THREE.Group(); p.rotation.y = k * Math.PI * 2 / 3; f.position.set(0, 1.0, 2.1); p.add(f); body.add(p); }
    const flame = new THREE.Group(); const o = new THREE.Mesh(new THREE.ConeGeometry(1.1, 4, 16), new THREE.MeshStandardMaterial({ color: '#ff8a2a', emissive: '#ff7a1a', emissiveIntensity: 3, transparent: true, opacity: .85 }));
    o.rotation.x = Math.PI; o.position.y = -2; flame.add(o); const n = new THREE.Mesh(new THREE.ConeGeometry(.6, 2.6, 16), new THREE.MeshStandardMaterial({ color: '#fff2a8', emissive: '#ffe08a', emissiveIntensity: 4 }));
    n.rotation.x = Math.PI; n.position.y = -1.3; flame.add(n); body.add(flame); g.userData = { body, flame }; g.traverse(m => m.isMesh && (m.castShadow = true)); return g; });
  const puffMat = () => keep('c08:puffmat', () => plastic('#f4f1ea', { roughness: .9 }));
  const puff = i => keep('c08:puff' + i, () => new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), puffMat()));
  const launchPad = () => keep('c08:pad', () => { const l = []; for (let u = -1; u <= 1; u++) for (let v = -1; v <= 1; v++) l.push(['3958', '#8a8f96', u * 6, .4, v * 6]);
    for (let r = 1; r <= 9; r++) l.push(['3005', '#c4281c', -4.5, .8 + r * 1.2, 0]); return build(l); });   // gantry on the far side

  // ---------- helpers for continuity ----------
  const lerpAng = (a, b, k) => { let d = ((b - a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; return a + d * k; };
  const wpos = o => { o.updateWorldMatrix(true, true); return o.getWorldPosition(new THREE.Vector3()).toArray(); };
  // a hammer swing: slow raise over 70% of the beat, a quick (quadratic) strike that lands ON the beat (no 1-frame jumps)
  const swing = (t, off = 0) => { const p = frac((t - OFF) / BEAT + off); return p < .7 ? lerp(.55, 2.3, ease(p / .7)) : lerp(2.3, .55, ((p - .7) / .3) ** 2); };
  // stepTo with a smoothed heading (circular mean over the last .24 s), so starting/stopping never snaps a body around
  const walkTo = (t, plan, o) => { const a = stepTo(t, plan, o); let sx = 0, sz = 0; for (let k = 0; k < 6; k++) { const r = k ? stepTo(t - k * .048, plan, o).ry : a.ry; sx += Math.sin(r); sz += Math.cos(r); } return { ...a, ry: Math.atan2(sx, sz) }; };
  const hitNow = (t, off = 0) => { const p = frac((t - OFF) / BEAT + off); return p < .045 || p > .985; };
  const IGNITE = 187.26, LIFT = 187.42;                   // the loaders finish at 187.22, then ignition and lift-off
  const DOORZ = VAULT[1] + 6 * VW + 3.5;                   // the vault door plane (world-relative z)
  const HATCH = [PAD[0], 3.2, PAD[1] + 1.75];              // the rocket's cargo hatch on the pad (relative), facing +z

  // ---------- the seed rocket (an always-on district through the launch + F5; it hands over to c09 at F5.t1) ----------
  const rocketPos = t => {
    const pad = FA(PAD[0], .6, PAD[1]);
    if (t <= LIFT) return pad;
    if (t < F5.t0) { const k = easeIn(seg(t, LIFT, F5.t0)), e = F5.A.look; return pad.map((v, i) => lerp(v, e[i], k)); }
    const L = WORLD.flight('F5', Math.min(t, F5.t1)).look, up = 4 * ease(seg(t, F5.t1 - .9, F5.t1));   // ends hovering at moon (0, 8, 0): where c09 takes over
    return [L[0], L[1] + up, L[2]];
  };
  const rocketDir = t => {   // backward difference (never zero at the end of F5), blended toward the moon once in flight
    const p = rocketPos(t), q = rocketPos(t - .06), d = new THREE.Vector3(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
    if (t <= LIFT || d.length() < 1e-4) d.set(0, 1, 0); d.normalize();
    if (t > F5.t0) { const m = F5.B.look, toMoon = new THREE.Vector3(m[0] - p[0], m[1] - p[1], m[2] - p[2]).normalize(); d.lerp(toMoon, .75 * seg(t, F5.t0, F5.t0 + .6)).normalize(); }
    if (t > LIFT && t < LIFT + .3) d.lerp(new THREE.Vector3(0, 1, 0), 1 - seg(t, LIFT, LIFT + .3)).normalize();
    if (t > F5.t1 - 1.0) d.lerp(new THREE.Vector3(0, 1, 0), ease(seg(t, F5.t1 - 1.0, F5.t1 - .1))).normalize();   // upright for the landing (c09 keeps it upright)   // ease out of vertical
    return d;
  };
  district('c08rocket', { at: [0, 0], always: true }, t => {
    if (t < 160 || t > F5.t1) return;
    const p = rocketPos(t);
    if (t < 186 && !(window.__camLook && Math.hypot(window.__camLook[0] - p[0], window.__camLook[2] - p[2]) < 330)) return;
    const R = rocket(); put(R, p[0], p[1], p[2]); R.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rocketDir(t));
    const lit = t > IGNITE, fl = R.userData.flame; fl.visible = true; fl.scale.set(lit ? 1 : .001, lit ? (t < LIFT ? .4 + .6 * seg(t, IGNITE, LIFT) : 1.4) * (1 + .15 * Math.sin(t * 47)) : .001, lit ? 1 : .001);
    for (let k = 1; k <= 16; k++) {                       // cotton-wool smoke at the rocket's past positions (they grow out of the nozzle)
      const tk = t - k * .07, m = puff(k);
      if (tk < IGNITE) { put(m, p[0], p[1] - 1, p[2], 0, .001); continue; }
      const pp = rocketPos(tk); put(m, pp[0] + Math.sin(k * 3.1) * .06 * k, pp[1] - 1.5, pp[2] + Math.cos(k * 2.3) * .06 * k, 0, Math.max(.001, Math.min(.8 + k * .28, (tk - IGNITE) * 4)));
    }
    // the seed sacks once loaded ride inside the rocket (hidden, tiny)
    for (let i = 0; i < 2; i++) if (t >= 187.6) put(sack('v' + i), p[0], p[1] + 2, p[2], 0, .001);
  });

  // ---------- Daisy Bell (local copy of the egg with this chapter's own keys; the rider sits ON the seat) ----------
  function daisy(t) {
    const c = FA(36, 0, 30), r = 8, a = t * .35, px = c[0] + Math.sin(a) * r, pz = c[2] + Math.cos(a) * r, yaw = a + Math.PI / 2;
    const bike = keep('c08:tandemL', () => { const g = new THREE.Group(), m = plastic(COL.blue);
      for (const zz of [-2.2, 2.2]) { const w = new THREE.Mesh(new THREE.TorusGeometry(1, .12, 8, 28), plastic(COL.black)); w.rotation.y = Math.PI / 2; w.position.set(0, 1, zz); g.add(w); }
      const bar = new THREE.Mesh(new THREE.BoxGeometry(.2, .2, 4.6), m); bar.position.set(0, 1.9, 0); g.add(bar);
      for (const zz of [-1.3, 1.3]) { const seat = new THREE.Mesh(new THREE.BoxGeometry(.8, .25, .9), plastic(COL.black)); seat.position.set(0, 2.15, zz); g.add(seat); } return g; });
    put(bike, px, 0, pz, yaw);
    const rb = keep('c08:daisybotL', robot); robotPose(rb, { walk: 0, carry: false }); put(rb, px - Math.sin(yaw) * 1.3, .5, pz - Math.cos(yaw) * 1.3, yaw);
    const rider = fig('c08daisyrider', crowdLook(5)); pose(rider, { legL: 1.2 + .4 * Math.sin(t * 6), legR: 1.2 - .4 * Math.sin(t * 6), armL: 1, armR: 1, face: 'sing', bodyY: -1.2 });
    put(rider, px + Math.sin(yaw) * 1.3, 1.25, pz + Math.cos(yaw) * 1.3, yaw);
    put(sign('c08daisyL', ['♪ Daisy, Daisy... ♪'], { w: 4, h: 1.1, size: 70, post: true, postH: 1.2 }), c[0], 0, c[2], 0);
  }

  // ---------- the farm district: set, ambient life, eggs (big radius: stays drawn through the F5 flight, no pop) ----------
  district('farm', { at: WORLD.D.farm, r: 1100 }, t => {
    const C = FA();
    put(keep('c08:ground', () => studGround('c08farm', '#9cc062', 8)), C[0], 0, C[2] - 8);
    const b = barn(); b.userData.grow(t); put(b, C[0], 0, C[2]);
    put(barnDoors(), C[0], 0, C[2] - 1);
    // the hex sign leans by the barn until it's hoisted onto the gable when the roof is done
    const hs = hexSign(), hk = ease(seg(t, ROOF_T1 - .5, ROOF_T1 + .2));
    hs.userData.m.material.emissiveIntensity = kf(t, [[184.3, 0], [184.6, 1.6], [186.4, 1.6], [186.9, .2]]) * (1 + .3 * pulse(t, 5));
    put(hs, C[0] + lerp(7.35, 0, hk), lerp(2.3, 11.4, hk), C[2] + lerp(-4, -.85, hk), lerp(Math.PI / 2, 0, hk)); hs.rotation.x = lerp(-.12, 0, hk);
    put(farmhouse(), ...FA(-20, 0, -4)); put(table(), ...FA(-18, 0, 2));
    put(vault(), ...FA(VAULT[0], 0, VAULT[1])); put(jars(), ...FA(VAULT[0], 0, VAULT[1]));
    put(vaultDoor(), ...FA(VAULT[0] - 3, 0, DOORZ + .6), -1.6 * ease(seg(t, 184.3, 184.8)));
    put(launchPad(), ...FA(PAD[0], 0, PAD[1]));
    const lm = lanternMat(); lm.emissiveIntensity = .25 + 2.3 * ease(seg(t, BLACKOUT + .15, BLACKOUT + .7)) * (1 - .4 * ease(seg(t, 177.0, 178.5))) * (1 + .08 * Math.sin(t * 11));
    const LAMPS = [-44, 14, 22, 30, 38];
    for (let i = 0; i < LAMPS.length; i++) { const Lp = keep('c08:lamp' + i, () => { const g = new THREE.Group(); g.add(build([['3005', WOOD, 0, 1.2, 0], ['3005', WOOD, 0, 2.4, 0], ['3005', WOOD, 0, 3.6, 0]])); const s = new THREE.Mesh(new THREE.SphereGeometry(.42, 12, 8), lanternMat()); s.position.y = 4.1; g.add(s); return g; });
      put(Lp, ...FA(LAMPS[i], 0, 7)); }
    for (const s of [-1, 1]) { const bl = keep('c08:barnlamp' + s, () => new THREE.Mesh(new THREE.SphereGeometry(.5, 12, 8), lanternMat())); put(bl, ...FA(s * 3.6, 7.4, -.5)); }
    const corn = keep('c08:corn', () => { const im = new THREE.InstancedMesh(partGeo('30176'), plastic('#6fae3a'), 99); im.castShadow = true; const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; });
    { const im = corn.userData.im, M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(); let n = 0;
      for (let x = 10; x <= 20; x += 2) for (let z = -18; z <= -2; z += 2) { M.compose(new THREE.Vector3(x, 0, z), q.setFromEuler(e.set(.1 * Math.sin(t * 1.7 + x * .3), hash(x * 9 + z) * 6, .1 * Math.sin(t * 1.3 + z * .4))), new THREE.Vector3(1.1, 2.3, 1.1)); im.setMatrixAt(n++, M); }
      im.count = n; im.instanceMatrix.needsUpdate = true; put(corn, C[0], 1.2, C[2]); }
    const city = cityTowers(); city.userData.mats.forEach((m, i) => { const tOff = BLACKOUT + i * .09, fl = t > tOff - .25 && t < tOff ? (Math.sin(t * 90 + i) > 0 ? 1 : .2) : 1;
      m.emissiveIntensity = (t < tOff ? 1.2 : 0) * fl; }); put(city, C[0], 0, C[2]);
    const lb = keep('c08:lowbat', robot); robotPose(lb, { walk: 0, carry: false }); put(lb, ...FA(-24, 0, 9.5), .3); lb.rotation.x = .25;
    put(sign('c08lowbat', ['LOW BATTERY'], { w: 3.6, h: 1, bg: '#1b1b1f', fg: '#ff4a3a', size: 90, post: true, postH: 1.6 }), ...FA(-28.5, 0, 8.5), .3);
    daisy(t);
    const gm = FA(14, 0, -60); EGGS.gpuMine('c08', t, gm[0], gm[2], 0);
    for (let i = 0; i < 2; i++) passerby('c08lane', i, t, [[C[0] - 40, C[2] - 46], [C[0] + 34, C[2] - 46]], 1.3);
  });

  // ---------- camera: farm-relative keys (pos, look, fov) through the whole chapter ----------
  const P = [[F4.t1, [0, 7, 28]], [170.0, [-1.5, 6.6, 25]], [170.75, [-4, 6.4, 22]], [172.0, [-14, 8, 18]], [173.46, [-11, 11, 25]], [174.6, [-5, 10, 27]],
    [175.8, [-4, 8, 32]], [176.6, [-22, 7, 40]], [177.7, [-4, 7, 40]], [178.88, [-34, 6.5, 9]], [180.2, [-34, 6, 7]], [181.52, [-33.5, 5.6, 5.5]],
    [182.8, [-34, 6, 6.5]], [183.5, [-32, 9, 22]], [184.07, [-14, 10, 28]], [185.2, [3, 9, 27]], [186.62, [30, 10, 38]], [187.3, [28, 13, 38]], [187.6, [24, 16, 36]], [F5.t0, [0, 30, 20]]];
  const L = [[F4.t1, [0, 4, 0]], [170.0, [0, 3.8, -2]], [170.75, [0, 3.6, -4]], [172.0, [0, 4.5, -6]], [173.46, [0, 6, -6]], [174.6, [40, 10, -70]],
    [175.8, [-6, 4, 12]], [176.6, [-14, 3.5, 12]], [177.7, [6, 3.5, 12]], [178.88, [-17, 3.6, 5]], [180.2, [-17, 3.6, 5]], [181.52, [-17, 3.8, 4.5]],
    [182.8, [-17, 4, 4]], [183.5, [-12, 5, 2]], [184.07, [-2, 9, -2]], [185.2, [4, 7, 0]], [186.62, [56, 5, 0]], [187.3, [54, 9, 4]], [187.6, [54, 16, 4]], [F5.t0, [0, 60, -10]]];
  const FOV = [[F4.t1, 34], [173.46, 36], [174.6, 32], [176.6, 36], [178.88, 32], [184.07, 32], [185.2, 36], [186.62, 38], [F5.t0, 40]];
  const abs = keys => keys.map(([tt, p]) => [tt, FA(...p)]);
  const PA = abs(P), LA = abs(L);

  // ---------- who stands where, when (timed waypoints; stepTo walks them, so nobody teleports) ----------
  const CREW_A = i => [-6 + i * 2.4, 3.2], CREW_B = i => [[-6, -4.6, -3.2, 3.2, 4.6, 6][i], 1.15];
  const PIP_PLAN = [[168, [0, 6]], [173.9, [0, 6]], [174.5, [-3, 9]], [175.5, [-3, 9]], [176.3, [-10, 9.6]], [177.95, [-10, 9.6]], [178.85, [-14.5, 2.5]], [183.4, [-14.5, 2.5]], [184.35, [-6, 7.5]]];
  const CLAWD_PLAN = [[168, [-44, 10]], [176.9, [-44, 10]], [178.6, [-18, 6.8]], [183.55, [-18, 6.8]], [184.4, [-9, 7.2]]];
  const CELLAR = i => [[168, [VAULT[0] - 1.5 + i, VAULT[1] + 6 * VW + 1.2]], [186.05, [VAULT[0] - 1.5 + i, VAULT[1] + 6 * VW + 1.2]], [186.4, [VAULT[0] - 2 + i * .4, DOORZ + 3.5]],
    [186.92 + i * .06, [HATCH[0] + 1.45, HATCH[2] - 1.5 + i * 1.0]], [187.2 + i * .06, [HATCH[0] + 1.45, HATCH[2] - 1.5 + i * 1.0]], [187.6 + i * .06, [PAD[0] + 12 + i * 1.3, PAD[1] + 4 + i]]];

  function dutch(t) {
    const C = FA(), at = (x, z) => [C[0] + x, C[2] + z];
    if (t < F4.t1) WORLD.apply(WORLD.flight('F4', t));
    else if (t >= F5.t0) WORLD.apply(WORLD.flight('F5', t));
    else {
      const pos = path(t, PA, { easeEnds: false }), lk = path(t, LA, { easeEnds: false }), fov = path(t, FOV, { easeEnds: false });
      const d = drift(t - F4.t1, .5 * Math.min(seg(t, F4.t1, F4.t1 + 1.5), 1 - seg(t, 186.8, F5.t0)));
      const sh = t > 185.6 && t < 186.62 ? shake(t, .25 * Math.exp(-(t - 185.6) * 6)) : [0, 0, 0];
      if (t > LIFT) { const rp = rocketPos(t), k = ease(seg(t, LIFT, LIFT + .35)); for (let i = 0; i < 3; i++) lk[i] = lerp(lk[i], rp[i] + (i === 1 ? 5 : 0) * (1 - seg(t, LIFT + .35, F5.t0)), k); }
      cam({ pos: [pos[0] + d[0] + sh[0], pos[1] + d[1] + sh[1], pos[2] + d[2]], look: [lk[0] + sh[0] * .3, lk[1], lk[2]], fov, blur: .7, focus: t > 184.07 && t < 186.62 ? FA(0, 10, -1) : undefined });
      const k = ease(seg(t, 173.3, 174.3)) * (1 - ease(seg(t, 175.9, 177.0)));
      const base = WORLD.LOOK.farm, dusk = { sky: ['#2a3566', '#f09a5a', '#6a5040'], keyCol: '#ffb070', keyInt: 2.2, fill: .35, exposure: .92 };
      look({ ...base, sky: mixVal(base.sky, dusk.sky, k), keyCol: mixVal(base.keyCol, dusk.keyCol, k), keyInt: lerp(base.keyInt, dusk.keyInt, k), fill: lerp(base.fill, dusk.fill, k), exposure: lerp(base.exposure, dusk.exposure, k) });
    }

    // ---- the barn crew: hammers in hand all along; stomp + pump (A), walk to the wall (170.45–170.95), then hammer on the beat ----
    for (let i = 0; i < 6; i++) {
      const f = crew(i), off = (i % 2) * .5, A = CREW_A(i), B = CREW_B(i), b = (t - OFF) / BEAT + off;
      const st = walkTo(t, [[170.45, A], [170.95, B], [171.25, B]], { face: Math.PI }), ryA = (i - 2.5) * .12;
      const ry = t < 170.45 ? ryA : lerpAng(ryA, st.ry, ease(seg(t, 170.45, 170.6)));
      const pump = { armR: .75 + .45 * (.5 + .5 * Math.cos(b * 2 * Math.PI)), armL: .6 + .4 * (.5 + .5 * Math.cos(b * 2 * Math.PI)), bodyY: .3 * Math.abs(Math.sin(Math.PI * b)), face: i % 2 ? 'joy' : 'laugh' };
      const work = { ...st.pose, armR: swing(t, off), armL: .3, lean: .1, face: 'determined' };
      const p = { ...blend(pump, work, ease(seg(t, 170.45, 170.95))), holdR: hammer(i) };
      put(pose(f, p), C[0] + st.x, 0, C[2] + st.z, ry);
      if (t > 171.1 && t < 186.6 && hitNow(t, off)) {   // the hammer head lands on the barn wall
        const head = wpos(hammer(i).children[1]); expect(`crew ${i} hammer hits the barn wall`, head, [head[0], head[1], C[2] - 1.0], .8);
      }
    }

    // ---- Pip: one walked route; each activity blends into the next over .3 s (no snaps) ----
    const pip = fig('pip', PIP), sp = walkTo(t, PIP_PLAN, { face: 0 });
    const PIP_SEGS = [
      [168, tt => ({ p: { ...DANCES.sway((tt - OFF) / BEAT), armR: .7 + .4 * (.5 + .5 * Math.cos((tt - OFF) / BEAT * 2 * Math.PI)), armL: .7 + .4 * (.5 + .5 * Math.cos((tt - OFF) / BEAT * 2 * Math.PI)), bodyY: .3 * Math.abs(Math.sin(Math.PI * (tt - OFF) / BEAT)), face: 'joy' }, ry: 0 })],
      [170.75, tt => ({ p: { armL: 1.2, armR: 1.2, armLz: -.45 + .55 * (1 - Math.exp(-frac((tt - OFF) / BEAT) * 7)), armRz: -.45 + .55 * (1 - Math.exp(-frac((tt - OFF) / BEAT) * 7)), face: 'laugh' }, ry: Math.PI * .9 })],
      [173.9, tt => ({ p: { ...walkTo(tt, PIP_PLAN, { face: 0 }).pose, face: 'neutral' }, ry: walkTo(tt, PIP_PLAN, { face: 0 }).ry })],
      [174.6, tt => { const k = Math.sin(Math.PI * clamp((tt - 174.6) / .8)); return { p: { armL: .5 * k, armR: .5 * k, armLz: .9 * k, armRz: .9 * k, headRoll: .2 * k, head: -.4, face: 'smug' }, ry: .2 }; }],
      [175.5, tt => ({ p: { ...walkTo(tt, PIP_PLAN, { face: 0 }).pose, face: 'joy' }, ry: walkTo(tt, PIP_PLAN, { face: 0 }).ry })],
      [176.3, tt => ({ p: { armR: 2.6, armRz: .4 + .35 * Math.sin((tt - OFF) / BEAT * 2 * Math.PI), head: .1, face: 'joy' }, ry: .3 })],
      [177.95, tt => ({ p: { ...walkTo(tt, PIP_PLAN, { face: 0 }).pose, face: 'neutral' }, ry: walkTo(tt, PIP_PLAN, { face: 0 }).ry })],
      [178.85, tt => { const nod = tt > 182.8 ? .25 * Math.sin((tt - 182.8) * 9) : 0; return { p: { armL: 1, armR: 1, armLz: -.7, armRz: -.7, face: tt > 182.6 ? 'smug' : 'suspicious', headTilt: nod, head: .5 }, ry: -.8 }; }],
      [183.4, tt => ({ p: { ...walkTo(tt, PIP_PLAN, { face: 0 }).pose, face: 'joy' }, ry: walkTo(tt, PIP_PLAN, { face: 0 }).ry })],
      [184.35, tt => ({ p: { face: tt > 185.6 ? 'laugh' : 'joy', headTilt: -.35, armR: lerp(1.4, 2.6, ease(seg(tt, 185.45, 185.75))), armRz: .2 }, ry: -.2 })],
      [186.4, tt => ({ p: { face: 'star', headTilt: -.5, armR: 2.6, armL: lerp(0, 2.6, ease(seg(tt, LIFT - .2, LIFT))), armRz: .2 }, ry: 1.2 })],
    ];
    let si = 0; while (si + 1 < PIP_SEGS.length && t >= PIP_SEGS[si + 1][0]) si++;
    let cur = PIP_SEGS[si][1](t);
    if (si > 0 && t < PIP_SEGS[si][0] + .3) { const prev = PIP_SEGS[si - 1][1](t), k = ease((t - PIP_SEGS[si][0]) / .3); cur = { p: blend(prev.p, cur.p, k), ry: lerpAng(prev.ry, cur.ry, k) }; }
    put(pose(pip, cur.p), C[0] + sp.x, 0, C[2] + sp.z, cur.ry);

    // ---- D: the horse and buggy (parked at the west end, trots east 175.9–179.6, parked at the east end after) ----
    // the buggy trots east 175.9–181.5 and parks past the pad
    { const k = seg(t, 175.9, 181.5), x = lerp(-44, 74, k), moving = t > 175.9 && t < 181.5, H = horse(), B = buggy(), tr = t * 9;
      H.userData.J.legs.forEach((l, i) => { l.rotation.z = moving ? .45 * Math.sin(tr + (i === 0 || i === 3 ? 0 : Math.PI)) : 0; });
      H.userData.J.head.rotation.z = .08 * Math.sin(moving ? tr * 2 : t * 1.5); H.userData.J.tail.rotation.x = .3 * Math.sin(moving ? tr : t * 2);
      put(H, ...FA(x + 6.4, moving ? .15 * Math.abs(Math.sin(tr)) : 0, 12.5));
      B.userData.J.wheels.forEach(w => { w.rotation.z = -(x / 1.05); }); put(B, ...FA(x, 0, 12.5));
      put(pose(crew(6), { legL: 1.5, legR: 1.5, bodyY: -1.1, armL: 1.0, armR: 1.0, face: 'neutral' }), ...FA(x + .9, 2.5, 12.5), Math.PI / 2); }

    // ---- E/F: the gadget interview (the interviewer sits at the porch table all chapter, his sign in hand) ----
    { const iv = keep('c08:interviewer', () => { const f = fig('c08iv', { ...crowdLook(4), head: '3626cp7p', hat: null, torso: '#2b2f45', arms: '#2b2f45', legs: '#1b1b1f' }); f.userData.J.head.add(strawHat()); return f; });
      const paddle = keep('c08:paddle', () => { const g = new THREE.Group(), stick = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, 2.2, 6), plastic(WOOD)); stick.position.y = .7; g.add(stick);
        const s1 = sign('c08noA', ['NO THANKS'], { w: 3.4, h: 1.1, size: 110, bg: CREAM, fg: RED }), s2 = sign('c08noB', ['NO THANKS'], { w: 3.4, h: 1.1, size: 110, bg: CREAM, fg: RED });
        const a = new THREE.Group(); a.add(s1); a.position.set(-.2, 1.55, 0); a.rotation.y = -Math.PI / 2; const b2 = new THREE.Group(); b2.add(s2); b2.position.set(.2, 1.55, 0); b2.rotation.y = Math.PI / 2; g.add(a, b2); g.userData.grip = stick; return g; });
      const raise = ease(seg(t, 182.6, 182.95)), shakeNo = t > 182.0 && t < 182.9 ? .5 * Math.sin((t - 182.0) * 14) : 0;
      const ivArm = lerp(.15, 2.2, raise); paddle.rotation.set(ivArm - Math.PI / 4, 0, 0);   // counter the arm + wrist so the board stays upright
      put(pose(iv, { legL: 1.5, legR: 1.5, bodyY: -1.25, armL: 1.0, armR: ivArm, head: shakeNo, face: t > 182.0 ? 'neutral' : 'suspicious', holdR: paddle }), ...FA(-18, 0, -.2), 0);
      expect('interviewer holds the NO THANKS sign', limb(iv, 'handR'), wpos(paddle), .6);
      // the queue: a robot and a TV-on-legs, hopping on the beat while the interview runs
      const hop = t > 178.9 && t < 183.4 ? 1 : 0;
      const rb = keep('c08:qbot', robot); robotPose(rb, { walk: hop ? t * 2 : 0, carry: false }); put(rb, ...FA(-18, .2 * pulse(t, 8) * hop, 10.8), Math.PI);
      const tv = keep('c08:tv', () => { const g = build([['3003', '#1b1b1f', 0, 3.6, 0], ['3003', '#1b1b1f', 0, 2.4, 0], ['3005', '#1b1b1f', -.5, 1.2, 0], ['3005', '#1b1b1f', .5, 1.2, 0]]);
        const s = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), glowMat('#7fd0ff', 1.4)); s.position.set(0, 3.0, 1.02); g.add(s); return g; });
      put(tv, ...FA(-18, .2 * pulse(t + .3, 8) * hop, 14), Math.PI); }

    // ---- Clawd: waits by the lane, walks into the interview, slumps, walks over to watch the firewall ----
    { const Cw = clawd('c08', {}), sc = stepTo(t, CLAWD_PLAN, { face: Math.PI }), slump = ease(seg(t, 182.9, 183.4)) * (1 - ease(seg(t, 183.45, 183.7)));
      const walking = Object.keys(sc.pose).length > 0, inQueue = t > 178.6 && t < 183.55;
      clawdPose(Cw, { face: t > 185.6 ? 'shocked' : t > 184.4 ? 'suspicious' : t > 182.9 ? 'shocked' : t > 181.52 ? 'suspicious' : 'smug', hat: 'headset',
        walk: walking ? t * 2.2 : null, armL: inQueue ? .4 + .4 * pulse(t, 6) * (1 - slump) : t > 185.6 ? 1 : .2, armR: t > 185.6 ? 1 : .4, lean: .2 * slump, bob: inQueue ? .15 * pulse(t, 7) * (1 - slump) : 0, squash: .25 * slump });
      put(Cw, C[0] + sc.x, 0, C[2] + sc.z, t > 184.4 ? lerpAng(sc.ry, .5, ease(seg(t, 184.4, 184.7))) : sc.ry); }

    // ---- G: the firewall dome (always there, invisible until the hex sign lights it) bounces a rogue gadget ----
    { const dome = keep('c08:dome', () => { const g = new THREE.Group(); const w = new THREE.Mesh(new THREE.IcosahedronGeometry(10, 2), new THREE.MeshBasicMaterial({ color: '#ffd27a', wireframe: true, transparent: true, opacity: 0 }));
        const f = new THREE.Mesh(new THREE.SphereGeometry(9.9, 32, 16), new THREE.MeshBasicMaterial({ color: '#ffcc66', transparent: true, opacity: 0, depthWrite: false })); g.add(w, f); g.userData = { w, f }; return g; });
      const on = ease(seg(t, 184.6, 185.0)) * (1 - ease(seg(t, 186.2, 186.7))), hit = t > 185.6 ? Math.exp(-(t - 185.6) * 5) : 0;
      dome.userData.w.material.opacity = .45 * on + .5 * hit * on; dome.userData.f.material.opacity = .08 * on + .25 * hit * on;
      put(dome, C[0], 4, C[2] - 6, t * .2, .6 + .4 * on + .06 * hit);
      // the rogue robot walks in from the east, hits the dome at 185.6, flies back and lies there
      const bot = keep('c08:roguebot', robot), kIn = seg(t, 183.9, 185.6), kOut = seg(t, 185.6, 186.4);
      const HITX = 7.2; robotPose(bot, { walk: t < 185.6 ? t * 2.5 : 0, carry: false }); const bx = t < 185.6 ? lerp(40, HITX, kIn) : lerp(HITX, 22, easeOut(kOut));
      put(bot, ...FA(bx, t < 185.6 ? 0 : 3 * Math.sin(Math.PI * kOut), 2), -Math.PI / 2); bot.rotation.z = t > 185.6 ? -1.57 * easeOut(kOut) : 0;
      if (t > 185.58 && t < 185.64) { const front = [C[0] + HITX - 1.1, 3, C[2] + 2], c = new THREE.Vector3(C[0], 4, C[2] - 6), v = new THREE.Vector3(...front).sub(c).setLength(10 * (.6 + .4 * on)).add(c);
        expect('rogue robot meets the firewall dome', front, v.toArray(), .6); } }

    // ---- H: the cellar crew walk out of the vault; two loaders take turns at the rocket's hatch (one hand at a time) ----
    const SPOT = [HATCH[0] - .35, HATCH[2] + 1.48], LOADS = [[186.76, 186.92], [187.1, 187.24]], WAIT = [SPOT[0], SPOT[1] + 1.5];   // measured: the right hand is 1.48 ahead, .35 to the side
    for (let i = 0; i < 4; i++) {
      const f = keep('c08:cellar' + i, () => { const g = fig('c08v' + i, { ...crowdLook(i + 9), hat: null, torso: AMISH[(i + 2) % AMISH.length], arms: AMISH[(i + 2) % AMISH.length], legs: '#1b1b1f' }); g.userData.J.head.add(strawHat()); return g; });
      const inside = [VAULT[0] - 1.5 + i, VAULT[1] + 6 * VW + 1.2], out = [VAULT[0] - 2 + i * .5, DOORZ + 3.5], cheer = [PAD[0] + 12 + i * 1.3, PAD[1] + 5 + i];
      const loader = i < 2, [t0, t1] = loader ? LOADS[i] : [0, 0];
      const plan = loader ? (i === 0 ? [[168, inside], [184.5, inside], [184.9, out], [186.2, SPOT], [186.95, SPOT], [187.35, cheer]]
                                     : [[168, inside], [184.65, inside], [185.05, out], [186.4, WAIT], [186.95, WAIT], [187.1, SPOT], [187.27, SPOT], [187.62, cheer]])
                          : [[168, inside], [184.8 + i * .15, inside], [185.2 + i * .15, out], [186.4 + i * .1, cheer]];
      const sc = walkTo(t, plan, { face: Math.PI }), carry = loader && t < t0;
      const reach = loader ? ease(seg(t, t0 - .15, t0)) * (1 - ease(seg(t, t1, t1 + .2))) : 0;
      let p = { ...sc.pose, armL: carry ? .9 : 0, armR: carry ? .9 : loader ? lerp(.2, 1.0, reach) : 0, face: 'joy', holdR: carry ? sack('v' + i) : null };
      if (t > 187.45 + i * .06) p = blend(p, { ...dance('jump', t, { offset: i * .25 }), face: 'star' }, ease(seg(t, 187.45 + i * .06, 187.7 + i * .06)));
      put(pose(f, p), C[0] + sc.x, 0, C[2] + sc.z, sc.ry);
      if (loader && !carry && t < 187.6) {   // the sack travels from the hand into the hatch, then shrinks inside
        const S = sack('v' + i), hatch = FA(...HATCH), hand = limb(f, 'handR'), q = handoff(t, t0, t1, hand, hatch, .25), shrink = 1 - seg(t, t1, t1 + .12);
        const into = seg(t, t1, t1 + .12);   // after the hand-off the sack slides through the hatch into the hull as it shrinks
        put(S, q[0], q[1] - .3, q[2] - 1.3 * into, 0, Math.max(.001, shrink));
        if (t >= t0 && t < t0 + .045) expect(`loader ${i} hand at the rocket hatch`, hand, hatch, .9);
        if (t >= t1 - .02 && t < t1 + .03) expect(`sack ${i} goes in the hatch`, q, hatch, .35);
      }
    }
  }
  shots([[T0, dutch]]);
  rocket(); for (let k = 1; k <= 16; k++) puff(k);   // build the shared rocket + smoke NOW: every render worker gets this design, whatever range it starts in
  window.C08 = { rocketPos };   // for c09: where the seed rocket is during F5 (this file draws it until F5.t1)
})();
