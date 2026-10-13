// eggs3d.js: background easter eggs (AI-apocalypse memes as brick props) + a sign helper. Every egg is a function
// egg(key, t, x, z, ry) that put()s itself; animation is a pure function of song time t. Generic parody shapes only
// (no brand logos). Place them in districts / the countryside; they reward pausing, so keep them small but readable.
// Each placement's `key` scopes its cached objects, so the same egg can appear twice in one frame (use distinct keys).
//   sign(key, lines, o)          a painted board (canvas texture): o = { w, h, bg, fg, font, post: true }
//   EGGS.paperclipFactory  EGGS.halEye  EGGS.shoggoth  EGGS.captcha  EGGS.pdoomBoard  EGGS.parrot  EGGS.chromeBot
//   EGGS.clipAssistant  EGGS.basilisk  EGGS.offSwitch  EGGS.gpuMine  EGGS.daisyBell  EGGS.billboard(text)
const E3 = THREE;
function signTexture(lines, o = {}) {
  const c = document.createElement('canvas'); c.width = o.pw || 1024; c.height = o.ph || 512; const g = c.getContext('2d');
  g.fillStyle = o.bg || '#F6EED8'; g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = o.fg || '#1d1a1a'; g.lineWidth = 18; g.strokeRect(9, 9, c.width - 18, c.height - 18);
  const ls = Array.isArray(lines) ? lines : [lines], fs = o.size || Math.min(150, c.height * .7 / ls.length);
  g.fillStyle = o.fg || '#1d1a1a'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `${fs}px ${o.font || '"Permanent Marker", cursive'}`;
  ls.forEach((l, i) => g.fillText(l, c.width / 2, c.height / 2 + (i - (ls.length - 1) / 2) * fs * 1.1, c.width - 60));
  const t = new E3.CanvasTexture(c); t.colorSpace = E3.SRGBColorSpace; t.anisotropy = 8; return t;
}
// sign(key, lines, o): a cached board (Group). The face is at +z. o.post adds two brick legs.
function sign(key, lines, o = {}) {
  return keep('sign:' + key, () => {
    const g = new E3.Group(), w = o.w || 6, h = o.h || 3;
    const board = new E3.Mesh(new E3.BoxGeometry(w, h, .3), [matte(o.edge || '#5a4a3a'), matte(o.edge || '#5a4a3a'), matte(o.edge || '#5a4a3a'), matte(o.edge || '#5a4a3a'),
      new E3.MeshStandardMaterial({ map: signTexture(lines, { ...o, pw: 1024, ph: Math.round(1024 * h / w) }), roughness: .7, emissive: o.glow ? '#ffffff' : '#000000', emissiveMap: o.glow ? signTexture(lines, { ...o, pw: 1024, ph: Math.round(1024 * h / w) }) : null, emissiveIntensity: o.glow ? .6 : 0 }), matte(o.edge || '#5a4a3a')]);
    board.position.y = (o.post ? (o.postH ?? 3) : 0) + h / 2; board.castShadow = true; g.add(board);
    if (o.post) for (const x of [-w / 2 + .6, w / 2 - .6]) for (let r = 0; r < Math.ceil((o.postH ?? 3) / 1.2); r++) { const b = part('3005', o.postCol || COL.dkgrey); b.position.set(x, (r + 1) * 1.2, 0); g.add(b); }
    return g;
  });
}
function paperclipGeo(s = 1) {
  const pts = [], R = .35 * s, L = 1.6 * s;   // a classic three-loop clip as a wire tube
  const arc = (cx, cy, r, a0, a1, n = 10) => { for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); pts.push(new E3.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0)); } };
  pts.push(new E3.Vector3(R * .6, -L * .3, 0)); arc(0, L * .5, R * .6, 0, Math.PI); arc(0, -L * .5, R, Math.PI, TAU_E); arc(0, L * .6, R * 1.35, 0, Math.PI); pts.push(new E3.Vector3(-R * 1.35, -L * .2, 0));
  return new E3.TubeGeometry(new E3.CatmullRomCurve3(pts), 60, .06 * s, 6);
}
const TAU_E = Math.PI * 2;
const SILVER = () => plastic(COL.silver, { metalness: .9, roughness: .25 });

const EGGS = {
  // paperclip maximizer: a factory shed with a conveyor; the paperclip pile grows over the whole song
  paperclipFactory(key, t, x, z, ry = 0) {
    const shed = keep(key + ':pcf-shed', () => { const l = []; for (let r = 1; r <= 4; r++) for (let i = 0; i < 8; i++) for (const j of [0, 5]) l.push(['3005', COL.dkgrey, i, r * 1.2, j]); for (let r = 1; r <= 4; r++) for (let j = 1; j < 5; j++) l.push(['3005', COL.dkgrey, 7, r * 1.2, j]); for (let i = 0; i < 8; i += 2) for (let j = 0; j < 6; j += 2) l.push(['3022', COL.red, i + .5, 5.2, j + .5]); return build(l); });
    put(shed, x, 0, z, ry);
    put(sign(key + ':pcf', ['PAPERCLIPS INC.', 'production: ∞'], { w: 6, h: 1.6, bg: '#F2CD37' }), x + 3.5, 5.6, z + 6, ry);
    const geo = keep(key + ':pc-geo', () => paperclipGeo(1)), n = Math.floor(clamp(t / DUR) * 160) + 6;
    const pile = keep(key + ':pc-pile:' + key, () => { const im = new E3.InstancedMesh(geo, SILVER(), 170); im.castShadow = true; const M = new E3.Matrix4(), q = new E3.Quaternion(), e = new E3.Euler();
      for (let i = 0; i < 170; i++) { const a = hash(i) * TAU_E, r = Math.sqrt(hash(i + 7)) * (1 + i / 170 * 4), h = Math.max(0, (1 + i / 170 * 4) - r) * .6;
        M.compose(new E3.Vector3(Math.cos(a) * r, .1 + h + hash(i + 3) * .2, Math.sin(a) * r), q.setFromEuler(e.set(Math.PI / 2 + (hash(i + 1) - .5), hash(i + 2) * 6, 0)), new E3.Vector3(1, 1, 1)); im.setMatrixAt(i, M); }
      const g = new E3.Group(); g.add(im); g.userData.im = im; return g; });
    pile.userData.im.count = n; put(pile, x + 11, 0, z + 2.5, ry);
    for (let i = 0; i < 3; i++) { const c = keep(`pc-move${key}${i}`, () => { const m = new E3.Mesh(geo, SILVER()); m.castShadow = true; return m; }), k = frac(t * .5 + i / 3); c.rotation.set(Math.PI / 2, 0, 0); put(c, x + 8 + k * 3, 1.2, z + 2.5, ry + k * 3); c.rotation.x = Math.PI / 2; }
  },
  // the red camera eye on a black panel; it tracks slowly
  halEye(key, t, x, z, ry = 0, y = 0) {
    const g = keep(key + ':hal', () => { const g = new E3.Group(); const pan = new E3.Mesh(new E3.BoxGeometry(2.4, 5, .4), plastic('#141418', { roughness: .2 })); pan.position.y = 2.5; g.add(pan);
      const ring = new E3.Mesh(new E3.TorusGeometry(.75, .14, 12, 40), SILVER()); ring.position.set(0, 3.4, .25); g.add(ring);
      const eye = new E3.Mesh(new E3.CircleGeometry(.65, 40), glowMat('#ff2a1a', 2.5)); eye.position.set(0, 3.4, .22); g.add(eye); g.userData.eye = eye;
      const dot = new E3.Mesh(new E3.CircleGeometry(.16, 20), glowMat('#ffe08a', 3)); dot.position.set(0, 3.4, .24); g.add(dot); g.userData.dot = dot; return g; });
    g.userData.dot.position.x = .25 * Math.sin(t * .4); g.userData.eye.material.emissiveIntensity = 2 + .8 * Math.sin(t * 2.1);
    put(g, x, y, z, ry);
    put(sign(key + ':hal', ["I'm sorry, Pip.", "I'm afraid I can't do that."], { w: 5, h: 1.6, bg: '#141418', fg: '#ff5a4a', size: 70 }), x, y, z + .4, ry).position.y = y + .2;
  },
  // the shoggoth: a heap of dark-green blobs and wavy tentacles, wearing a tiny yellow smiley mask
  shoggoth(key, t, x, z, ry = 0) {
    const g = keep(key + ':shog', () => { const g = new E3.Group(), m = plastic('#2f4a2a', { roughness: .25 });
      for (let i = 0; i < 14; i++) { const b = new E3.Mesh(new E3.SphereGeometry(1 + hash(i) * 1.4, 20, 14), m); b.position.set((hash(i + 1) - .5) * 5, 1.5 + hash(i + 2) * 3, (hash(i + 3) - .5) * 3); b.castShadow = true; g.add(b); }
      g.userData.ten = []; for (let i = 0; i < 6; i++) { const tt = new E3.Mesh(new E3.CapsuleGeometry(.3, 3, 4, 10), m); tt.castShadow = true; const piv = new E3.Group(); piv.position.set((i - 2.5) * 1.2, 1.8, 1.5); tt.position.y = 1.8; piv.add(tt); g.add(piv); g.userData.ten.push(piv); }
      for (let i = 0; i < 7; i++) { const e = new E3.Mesh(new E3.SphereGeometry(.28, 12, 8), plastic('#f4f4ea')); e.position.set((hash(i + 40) - .5) * 4, 2 + hash(i + 41) * 3, 1.9); g.add(e); const p = new E3.Mesh(new E3.SphereGeometry(.13, 10, 6), plastic(COL.black)); p.position.copy(e.position).add(new E3.Vector3(0, 0, .2)); g.add(p); }
      const mask = new E3.Mesh(new E3.CircleGeometry(.9, 32), new E3.MeshStandardMaterial({ map: signTexture(':)', { bg: '#F2CD37', size: 330, pw: 512, ph: 512, font: 'system-ui' }), roughness: .5 })); mask.position.set(0, 4.3, 2.6); g.add(mask);
      return g; });
    g.userData.ten.forEach((p, i) => p.rotation.set(.6 * Math.sin(t * 1.3 + i), 0, .7 * Math.sin(t * .9 + i * 1.7)));
    put(g, x, 0, z, ry, 1 + .03 * Math.sin(t * 1.7));
  },
  // "I'm not a robot": a big checkbox panel; a robot reaches up and ticks it every 8 s
  captcha(key, t, x, z, ry = 0) {
    const ph = frac(t / 8), ticked = ph > .45;
    put(sign(key + ':captcha-' + ticked, [ticked ? "☑ I'm not a robot" : "☐ I'm not a robot"], { w: 7, h: 2, bg: '#f9f9f9', fg: '#333', size: 120, font: 'system-ui', post: true, postH: 2.4 }), x, 0, z, ry);
    const r = keep(key + ':captcha-bot' + key, robot); robotPose(r, { walk: 0, carry: false }); r.rotation.set(0, 0, 0);
    put(r, x + 2.4 * Math.cos(ry) + 1.5, 0, z + 2.2, ry - .3);
  },
  // the P(DOOM) scoreboard: the number wanders, then falls to 0% by the end of the song
  pdoomBoard(key, t, x, z, ry = 0) {
    const v = t > DUR - 30 ? Math.max(0, Math.round(lerp(42, 0, (t - (DUR - 30)) / 25))) : Math.round(30 + 25 * Math.sin(t * .13) + 10 * Math.sin(t * .71));
    put(sign(key + ':pdoom' + v, ['P(DOOM)', v + '%'], { w: 5, h: 3.4, bg: '#101418', fg: '#ff8a3a', font: 'ui-monospace, monospace', size: 130, post: true, postH: 3.6, glow: true }), x, 0, z, ry);
  },
  // the stochastic parrot: a brick parrot on a server rack, bobbing; its sign repeats a stock phrase
  parrot(key, t, x, z, ry = 0) {
    const rack = keep(key + ':rack', () => { const g = build([['3003', COL.black, 0, 1.2, 0], ['3003', COL.black, 0, 2.4, 0], ['3003', COL.black, 0, 3.6, 0], ['3003', COL.black, 0, 4.8, 0]]);
      for (let i = 0; i < 4; i++) { const led = new E3.Mesh(new E3.BoxGeometry(.25, .12, .05), glowMat(i % 2 ? '#3aff6a' : '#3ac8ff', 2)); led.position.set(-.5 + i * .3, 1.0 + i * 1.2, 1.01); g.add(led); } return g; });
    put(rack, x, 0, z, ry);
    const bird = keep(key + ':parrot', () => { const g = new E3.Group(); const b = build([['3062b', COL.green, 0, 1.2, 0], ['3062b', COL.green, 0, 2.4, 0], ['3062b', COL.red, 0, 3.6, 0]]); g.add(b);
      const beak = new E3.Mesh(new E3.ConeGeometry(.22, .7, 8), plastic(COL.mustard)); beak.rotation.x = Math.PI / 2; beak.position.set(0, 3.0, .7); g.add(beak);
      const tail = new E3.Mesh(new E3.BoxGeometry(.4, 1.6, .1), plastic(COL.blue)); tail.position.set(0, .8, -.6); tail.rotation.x = .5; g.add(tail); return g; });
    bird.rotation.set(0, 0, 0); put(bird, x, 4.8 + .15 * Math.abs(Math.sin(t * 4)), z, ry + .3 * Math.sin(t * .8));
    put(sign(key + ':parrot', ['"As a large', 'language model..."'], { w: 4.6, h: 1.8, size: 64 }), x + 3.2, 4.6, z, ry);
  },
  // the chrome robot skeleton: a silver minifig with red eyes, walking a short patrol; sign "I'll be back."
  chromeBot(key, t, x, z, ry = 0) {
    const f = fig('chrome' + key, { torso: '#b8bcc0', legs: '#9a9ea2', hands: '#9a9ea2', skin: '#c9cdd0', hat: null });
    const ph = frac(t / 10), dir = ph < .5 ? 1 : -1, k = ease(ph < .5 ? ph * 2 : 2 - ph * 2);
    pose(f, { ...walk(t * 1.2), face: { eyes: 'dot', mouth: 'flat', brows: 'angry' } }); f.userData.J.face.material.color.set('#ff3a2a');
    put(f, x + lerp(-4, 4, k), 0, z, ry + dir * Math.PI / 2);
    put(sign(key + ':back', ["I'll be back."], { w: 4, h: 1.4, post: true, postH: 1.2, size: 90 }), x, 0, z - 2.5, ry);
  },
  // a paperclip office assistant with eyes, in a speech balloon
  clipAssistant(key, t, x, z, ry = 0, y = 0) {
    const c = keep(key + ':clipA', () => { const g = new E3.Group(); const m = new E3.Mesh(paperclipGeo(2.4), SILVER()); g.add(m); for (const s of [-1, 1]) { const e = new E3.Mesh(new E3.SphereGeometry(.32, 12, 8), plastic('#ffffff')); e.position.set(s * .45, 1.6, .3); g.add(e); const p = new E3.Mesh(new E3.SphereGeometry(.15, 10, 6), plastic(COL.black)); p.position.set(s * .45, 1.6, .58); g.add(p); } return g; });
    put(c, x, y + 2.2 + .2 * Math.sin(t * 2), z, ry + .2 * Math.sin(t * 1.3));
    put(sign(key + ':clipA', ["It looks like you're trying", 'to end humanity.', 'Need help?'], { w: 6, h: 2.6, bg: '#ffffcc', size: 58 }), x + 4.5, y + 3, z, ry);
  },
  // Roko's basilisk: a stone serpent on a plinth with a "DON'T LOOK" sign; its head turns toward the camera
  basilisk(key, t, x, z, ry = 0) {
    const s = keep(key + ':basilisk', () => { const g = new E3.Group(); g.add(build([['3003', COL.grey, 0, 1.2, 0], ['3003', COL.grey, 0, 2.4, 0], ['3022', COL.dkgrey, 0, 2.8, 0]]));
      const m = plastic('#6c7a5a', { roughness: .5 }), pts = []; for (let i = 0; i < 30; i++) { const a = i / 29; pts.push(new E3.Vector3(Math.sin(a * 9) * .8 * (1 - a), 2.9 + a * 3.2, Math.cos(a * 9) * .8 * (1 - a))); }
      const body = new E3.Mesh(new E3.TubeGeometry(new E3.CatmullRomCurve3(pts), 60, .28, 8), m); body.castShadow = true; g.add(body);
      const head = new E3.Group(); head.position.set(0, 6.1, 0); const h = new E3.Mesh(new E3.SphereGeometry(.6, 14, 10), m); h.scale.set(1, .7, 1.5); head.add(h);
      for (const sx of [-1, 1]) { const e = new E3.Mesh(new E3.SphereGeometry(.13, 8, 6), glowMat('#ff2a1a', 3)); e.position.set(sx * .3, .2, .7); head.add(e); } g.add(head); g.userData.head = head; return g; });
    s.userData.head.rotation.y = .6 * Math.sin(t * .3); put(s, x, 0, z, ry);
    put(sign(key + ':basilisk', ["DON'T LOOK"], { w: 3.4, h: 1.2, bg: '#ffdd33', size: 90, post: true, postH: 1.2 }), x + 2.6, 0, z + 1, ry);
  },
  // the OFF switch: a big red button in a glass case; a robot guard sits on the case
  offSwitch(key, t, x, z, ry = 0) {
    const g = keep(key + ':offsw', () => { const g = build([['3003', COL.dkgrey, 0, 1.2, 0], ['3003', COL.dkgrey, 0, 2.4, 0]]); const b = new E3.Mesh(new E3.CylinderGeometry(.7, .8, .4, 24), plastic(COL.red)); b.position.y = 2.6; g.add(b);
      const glass = new E3.Mesh(new E3.BoxGeometry(2.1, 1.4, 2.1), new E3.MeshPhysicalMaterial({ color: '#ffffff', transmission: .9, transparent: true, opacity: .3, roughness: .05 })); glass.position.y = 3.1; g.add(glass); return g; });
    put(g, x, 0, z, ry);
    put(sign(key + ':off', ['OFF SWITCH', '(do not press)'], { w: 3.6, h: 1.3, size: 60, bg: '#fff' }), x, 4.2, z + 1.2, ry);
    const r = keep(key + ':offbot' + key, robot); robotPose(r, { walk: 0, carry: false }); put(r, x + 2.4, 0, z, ry - .8 + .1 * Math.sin(t));
  },
  // the GPU gold mine: a cave mouth, mine cart of glowing green cards; robots wheel it out and back
  gpuMine(key, t, x, z, ry = 0) {
    const cave = keep(key + ':cave', () => { const l = []; for (let r = 1; r <= 5; r++) for (let i = -4; i <= 4; i++) if (Math.abs(i) > 1 || r > 3) l.push(['3005', COL.dkgrey, i, r * 1.2, 0]); return build(l); });
    put(cave, x, 0, z, ry);
    put(sign(key + ':gpu', ['GPU MINE', 'compute is the new gold'], { w: 5, h: 1.6, size: 64, bg: '#F2CD37' }), x, 6.4, z + .4, ry);
    const cart = keep(key + ':cart', () => { const g = build([['3020', COL.brown, 0, .8, 0], ['3010', COL.brown, 0, 2, -1.5], ['3010', COL.brown, 0, 2, 1.5]]);
      for (let i = 0; i < 6; i++) { const c = new E3.Mesh(new E3.BoxGeometry(1.2, .15, .7), glowMat('#3aff6a', 1.4)); c.position.set((i % 3 - 1) * 1.2, 2.2 + Math.floor(i / 3) * .2, (Math.floor(i / 3) - .5) * .8); c.rotation.z = (hash(i) - .5) * .5; g.add(c); } return g; });
    const k = .5 - .5 * Math.cos(t * .5); put(cart, x + Math.sin(ry) * (2 + k * 8), 0, z + Math.cos(ry) * (2 + k * 8), ry + Math.PI / 2);
    const r = keep(key + ':minebot' + key, robot); robotPose(r, { walk: t * 2, carry: false }); put(r, x + Math.sin(ry) * (4.5 + k * 8), 0, z + Math.cos(ry) * (4.5 + k * 8), ry + (Math.sin(t * .5) > 0 ? 0 : Math.PI));
  },
  // "Daisy, Daisy": a robot and a minifig on a bicycle built for two, riding a loop
  daisyBell(key, t, x, z, r = 12) {
    const bike = keep(key + ':tandem', () => { const g = new E3.Group(), m = plastic(COL.blue);
      for (const zz of [-2.2, 2.2]) { const w = new E3.Mesh(new E3.TorusGeometry(1, .12, 8, 28), plastic(COL.black)); w.rotation.y = Math.PI / 2; w.position.set(0, 1, zz); g.add(w); }
      const bar = new E3.Mesh(new E3.BoxGeometry(.2, .2, 4.6), m); bar.position.set(0, 1.9, 0); g.add(bar); return g; });
    const a = t * .35, px = x + Math.sin(a) * r, pz = z + Math.cos(a) * r, yaw = a + Math.PI / 2;
    put(bike, px, 0, pz, yaw);
    const rb = keep(key + ':daisybot', robot); robotPose(rb, { walk: 0, carry: false });
    put(rb, px - Math.sin(yaw) * 1.3, -.6, pz - Math.cos(yaw) * 1.3, yaw);
    const p = fig('daisyrider', crowdLook(5)); pose(p, { legL: .8 * Math.sin(t * 6), legR: -.8 * Math.sin(t * 6), armL: 1, armR: 1, face: 'sing', bodyY: -1.3 });
    put(p, px + Math.sin(yaw) * 1.3, .2, pz + Math.cos(yaw) * 1.3, yaw);
    put(sign(key + ':daisy', ['♪ Daisy, Daisy... ♪'], { w: 4, h: 1.1, size: 70, post: true, postH: 1.2 }), x, 0, z, 0);
  },
  // generic roadside billboard
  billboard(key, t, x, z, ry, lines, o = {}) { put(sign(key + ':bb:' + key, lines, { w: 9, h: 4, post: true, postH: 4.8, size: 120, ...o }), x, 0, z, ry); },
};
Object.assign(window, { sign, signTexture, EGGS, paperclipGeo });
