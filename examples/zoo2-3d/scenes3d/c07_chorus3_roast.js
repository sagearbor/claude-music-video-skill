// c07_chorus3_roast.js: 138.11–168.35 s. Chorus 3 on the STAGE at sunrise, then ONE continuous flight (no cut) to the ROAST
// comedy club for verse 3. Seams: in = the Fb glide (lands 138.11, landing bump + flash); out = F4 (from 167.55).
// Hits: each door drops in beside Pip on bt(216–218) and he kicks it away on the "Nah!" half beats bt(216.5–218.5);
// throws batted on bt(220–222); the crowd runs in from both wings (arriving bt(223–225.5)); jump + gold arc 145.3–146.8;
// club: contract handed over 150.6, OK avalanche 152.8–155.4 (burst bt(243)), keys snatched bt(246), ice 158.4–160.2,
// shatter on "Nah" 160.85, road forks bt(252–255), keys hung on the mic 163.4, fire 164.3, gloves picked up bt(260)/bt(261).
// Continuity (CHAPTER_GUIDE rules 9–13): every move is planned with stepTo(), pose changes blend with track(), and props
// that pass between characters travel with handoff() between limb() anchors, asserted with expect().
(() => {
  const R = WORLD.D.roast, RX = R[0], RZ = R[1];
  const at = (dx, dy, dz) => [RX + dx, dy, RZ + dz];
  const SY = 2.4;                                  // club stage top height
  const DROP = 138.11, FLY0 = 146.8, FLY1 = 149.3, BURY = bt(243), NAH = 160.85, FIRE = 164.3, SNATCH = bt(246);
  const GL = bt(260), GR = bt(261);                // the glove pick-ups
  const beatOf = t => (t - OFF) / BEAT;
  const PIPX = -2.5, PIPZ = 1.2;                   // Pip's spot on the chorus stage

  // ---------- small helpers ----------
  // track(t, keys, w): the latest key's pose (an object or a function of t), blended from the previous key over w seconds
  function track(t, keys, w = .25) {
    let i = 0; for (let j = 0; j < keys.length; j++) if (t >= keys[j][0]) i = j;
    const ev = k => typeof keys[k][1] === 'function' ? keys[k][1](t) : keys[k][1], cur = ev(i);
    if (i === 0 || t - keys[i][0] >= w) return cur;
    return blend(ev(i - 1), cur, ease((t - keys[i][0]) / w));
  }
  const angLerp = (a, b, k) => { let d = ((b - a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; return a + d * k; };
  function angTrack(t, keys, w = .3) { let i = 0; for (let j = 0; j < keys.length; j++) if (t >= keys[j][0]) i = j; if (i === 0 || t - keys[i][0] >= w) return keys[i][1]; return angLerp(keys[i - 1][1], keys[i][1], ease((t - keys[i][0]) / w)); }
  const win = (t, a, b, w = .25) => ease(seg(t, a - w, a)) * (1 - ease(seg(t, b, b + w)));   // a smooth on/off window
  const rel = p => [RX + p[0], RZ + p[1]];
  const legsOnly = p => ({ legL: p.legL, legR: p.legR, bodyY: p.bodyY, bodyRoll: p.bodyRoll, twist: p.twist });
  // a world-placed prop that keeps its own tilt: put() sets the outer group, `inner` carries the prop's rotation
  const holder = (key, make) => keep(key, () => { const o = new THREE.Group(), i = make(); o.add(i); o.userData.inner = i; return o; });

  // ---------- camera: one path for the whole chapter (keys ~1.3–1.6 s apart so speed stays even) ----------
  const r = (dx, dy, dz) => at(dx, dy, dz);
  const CAM = [
    [138.11, [0, 6, 30], [0, 4, -4], 34], [138.9, [-12, 5.5, 17], [-1, 3.4, 0], 32], [140.0, [-6, 5, 19], [0, 3.4, 0], 34],
    [141.4, [6, 4.4, 18], [0, 3.4, -1], 34], [142.8, [11, 6.5, 24], [1, 4, -2], 38], [144.2, [4, 5, 22], [2, 4.2, -2], 36],
    [145.5, [-2, 4.6, 18], [1, 5.2, -1], 33], [146.8, [0, 12, 30], [0, 10, -6], 40],
    [148.0, [110, 70, -90], [185, 20, -175], 40],                               // over the city with its cranes
    [149.3, r(0, 16, 30), r(0, 4, -6), 38], [150.8, r(-1, 10, 18), r(0, 5.4, -6), 30], [152.4, r(3, 10, 18), r(0, 5.6, -6), 28],
    [153.9, r(0, 12, 23), r(0, 4, -6), 36], [155.5, r(-3, 10, 18), r(-1.5, 4.5, -6), 32], [157.0, r(-2, 9.5, 16), r(-2, 5.4, -6), 28],
    [158.6, r(0, 10, 20), r(-2, 4.5, -7), 34], [160.2, r(-5, 10, 18), r(-2, 4, -7), 32], [161.8, r(0, 16, 12), r(0, 2.4, -8), 40],
    [163.4, r(-14, 6, 1.5), r(-4, 4.2, .5), 42], [164.9, r(-10, 5, 1.8), r(-6, 5.0, 4.8), 34], [165.6, r(-2, 12, 9), r(-5, 4.5, -5), 34], [166.3, r(0, 10, 17), r(-5, 5, -5), 32],
    [167.0, r(0, 9.8, 25), r(0, 6, -.5), 36], [167.55, r(0, 10, 26), r(0, 6, 0), 36]];   // last key = WORLD.F.F4.A
  const P = CAM.map(k => [k[0], k[1]]), Lk = CAM.map(k => [k[0], k[2]]), Fv = CAM.map(k => [k[0], [k[3]]]);
  function camera(t, lt) {
    if (t >= WORLD.F.F4.t0) { WORLD.apply(WORLD.flight('F4', t)); cam({ blur: .4 }); return; }
    const p = path(t, P, { easeEnds: false }), l = path(t, Lk, { easeEnds: false }), fov = path(t, Fv, { easeEnds: false })[0];
    // drift and DOF fade smoothly through the flight and to zero at the F4 hand-off (so the seam is exact)
    const flyK = Math.sin(Math.PI * seg(t, FLY0, FLY1)), endK = 1 - seg(t, 166.9, 167.55);
    const d = drift(lt, .5 * (1 - flyK) * endK), land = WORLD.landing(t, DROP);
    let sh = land.shake.slice();
    for (const h of [bt(216.5), bt(217.5), bt(218.5), bt(220), bt(221), bt(222), BURY, NAH]) if (t > h && t < h + .6) { const s = shake(t, .3 * Math.exp(-(t - h) * 8)); sh = sh.map((v, j) => v + s[j]); }
    cam({ pos: [p[0] + d[0] + sh[0], p[1] + d[1] + sh[1], p[2] + d[2]], look: [l[0] + sh[0] * .3, l[1] + sh[1] * .3, l[2]], fov, blur: (.8 - .7 * flyK) * endK + .4 * (1 - endK) });
    const k = smoother(seg(t, FLY0, FLY1)), A = { ...WORLD.LOOK.sunrise }, B = { ...WORLD.LOOK.roast }, o = {};
    for (const key of new Set([...Object.keys(A), ...Object.keys(B)])) o[key] = mixVal(A[key] ?? B[key], B[key] ?? A[key], k);
    look(o);
    if (land.flash > 0) hud(ctx => { ctx.fillStyle = `rgba(255,255,255,${land.flash})`; ctx.fillRect(0, 0, W, H); });
  }

  // ---------- stage extras for chorus 3 (sunrise): a sun, a garland of round bricks over the stage ----------
  district('stage-c07', { at: [0, 0], r: 90 }, t => {
    if (t < 137 || t > 150) return;
    const sun = keep('c07-sun', () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16), glowMat('#ffcf6a', 2.2)); g.add(m); return g; });
    put(sun, -60, 45 + 6 * seg(t, 138, 147), -420);
    const gar = keep('c07-garland', () => { const l = []; for (let x = -14; x <= 14; x += 1) l.push(['3062b', ['#F2CD37', '#E8AA38', '#F6A65A', '#ffffff'][(x + 14) % 4], x, 9.6 + .9 * Math.cos(x / 4.5), -7.6, 0, .55]); return build(l); });
    put(gar, 0, 0, 0);
  });

  // =============================== the verse plans (pure functions of t; the district uses them too) ===============================
  // Pip on the club stage (club-relative x, z)
  const P_PLAN = [[147.45, [-1, -6]], [152.85, [-1, -6]], [153.25, [0, -6]], [160.95, [0, -6]], [161.55, [0, -12]], [162.35, [0, -12]],
    [163.25, [0, -5.8]], [165.35, [0, -5.8]], [166.0, [-6.2, -6.0]]].map(([t, p]) => [t, rel(p)]);
  const pipAt = t => stepTo(t, P_PLAN, { run: t > 160.9 && t < 161.6 });
  // Clawd: giant in the wings → hands over the contract (left hand) → watches → dangles the keys (right hand) → crowned →
  // watches the road → hops off the stage to the front-row seat
  const C_PLAN = [[147.45, [10, -11]], [149.9, [10, -11]], [150.55, [3.26, -5.14]], [151.35, [3.26, -5.14]], [151.8, [4.5, -8.5]], [152.1, [4.5, -8.5]],
    [153.3, [-7, -9]], [155.55, [-7, -9]], [156.2, [-4.06, -7.26]], [157.6, [-4.06, -7.26]], [158.3, [-6.5, -9]], [160.95, [-6.5, -9]], [161.6, [-8, -3]],
    [162.35, [-8, -3]], [162.7, [-7.2, -.3]], [163.0, [-6.6, 2.2]], [163.3, [-6, 4.6]]].map(([t, p]) => [t, rel(p)]);
  // the walking segments of a plan: [t0, t1, direction]; facing() blends a standing angle toward each segment's direction
  const segsOf = plan => plan.slice(1).map((q, i) => [plan[i][0], q[0], Math.atan2(q[1][0] - plan[i][1][0], q[1][1] - plan[i][1][1]), Math.hypot(q[1][0] - plan[i][1][0], q[1][1] - plan[i][1][1])]).filter(sg => sg[3] > .05);
  const facing = (t, stand, segs) => segs.reduce((ry, [a, c, d]) => angLerp(ry, d, win(t, a + .05, c - .05, .18)), stand);
  const clawdY = t => SY * (1 - ease(seg(t, 162.7, 163.0))) + .9 * Math.sin(Math.PI * seg(t, 162.7, 163.0));   // the hop off the stage
  const MIC = at(0, SY, -4.4), HOOK = [MIC[0] + .3, MIC[1] + 3.9, MIC[2]];
  const CRATE = at(-6.2, SY, -4.4), GLOVE_SPOT = { L: [CRATE[0] + .5, SY + 2.6, CRATE[2]], R: [CRATE[0] - .5, SY + 2.6, CRATE[2]] };
  const CHAIR_STICK = at(-8.8, .7, 4.4), CHAIR_GRAB = at(-8.8, 3.4, 4.4);   // the marshmallow stick leans by Clawd's seat, waiting
  const MALLOW0 = 163.75, MALLOW1 = 164.0;                                   // picked up once Clawd has sat and turned

  // ---------- the roast club (roofless, open fourth wall, so the camera can glide in) ----------
  const club = () => {
    const l = [];
    for (let x = -12; x <= 12; x += 2) for (let z = -14; z <= -2; z += 2) l.push(['3068b', (x + z) % 4 ? '#7a1f2b' : '#6a1a24', RX + x, SY, RZ + z]);              // stage boards
    for (let x = -13; x <= 13; x += 2) l.push(['3004', '#2a1a22', RX + x, 1.2, RZ - 1, 0], ['3004', '#2a1a22', RX + x, 2.4 - .01, RZ - 1, 0]);                      // stage lip
    for (let x = -22; x <= 22; x += 2) for (let z = -16; z <= 14; z += 2) l.push(['3068b', ((x + z) / 2) % 2 ? '#5b3a24' : '#4a2e1c', RX + x, .02, RZ + z]);         // wooden floor
    for (let rr = 1; rr <= 8; rr++) for (let x = -22; x <= 22; x += 4) l.push(['3010', rr % 3 ? '#3b2a4a' : '#2e2038', RX + x, rr * 1.2, RZ - 18, 0]);                 // back wall
    for (let rr = 1; rr <= 8; rr++) for (let z = -16; z <= 8; z += 4) for (const x of [-24, 24]) l.push(['3010', '#3b2a4a', RX + x, rr * 1.2, RZ + z, Math.PI / 2]); // side walls
    for (let rr = 1; rr <= 8; rr++) for (const x of [-14, -13, -12, -11, 11, 12, 13, 14]) l.push(['3062b', rr === 8 ? '#9a1a24' : '#c4281c', RX + x, SY + rr * 1.2 - 1.2, RZ - 15]);   // curtain folds
    for (let x = -14; x <= 14; x += 1) l.push(['3062b', '#9a1a24', RX + x, SY + 9 * 1.2, RZ - 15]);                                                                // curtain pelmet
    for (let k = 0; k < 18; k++) { const x = -10 + (k % 6) * 4, z = 4 + Math.floor(k / 6) * 4; l.push(['3003', '#2a1a22', RX + x, 1.2, RZ + z + .8, 0]); }        // chairs
    l.push(['3003', COL.tan, CRATE[0], SY + 1.2, CRATE[2], 0], ['3003', COL.tan, CRATE[0], SY + 2.4, CRATE[2], 0]);                                                  // the glove crate
    return build(l);
  };
  const truss = () => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.BoxGeometry(30, .6, .6), plastic('#55585e', { metalness: .6, roughness: .35 })); b.position.set(0, 15, -3); g.add(b);
    for (const x of [-8, 0, 8]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.6, .8, 1.4, 16), plastic('#1b1b1f')); c.position.set(x, 14.2, -3); g.add(c); } return g; };
  const beamGeo = new THREE.ConeGeometry(1, 1, 24, 1, true); beamGeo.translate(0, -.5, 0);
  const beamMat = new THREE.MeshBasicMaterial({ color: '#fff3c8', transparent: true, opacity: .13, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
  function beam(key, from, to, width = 3.5, op = .13) {
    const g = keep('c07-beam' + key, () => { const g = new THREE.Group(), m = new THREE.Mesh(beamGeo, beamMat.clone()); g.add(m); g.userData.m = m; return g; });
    const d = new THREE.Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]), len = d.length();
    g.userData.m.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), d.clone().normalize()); g.userData.m.scale.set(width, len, width); g.userData.m.material.opacity = op;
    put(g, from[0], from[1], from[2]);
  }
  const micStand = () => keep('c07-mic', () => { const g = new THREE.Group(), m = plastic('#2a2a2e', { metalness: .6, roughness: .3 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(.7, .8, .15, 18), m); base.position.y = .08; g.add(base); const pole = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 4.4, 8), m); pole.position.y = 2.2; g.add(pole);
    const hook = new THREE.Mesh(new THREE.TorusGeometry(.15, .04, 6, 12), m); hook.position.set(.3, 3.9, 0); g.add(hook);
    const mic = new THREE.Mesh(new THREE.SphereGeometry(.28, 14, 10), plastic('#8a8e94', { metalness: .7, roughness: .3 })); mic.position.set(0, 4.5, .15); g.add(mic); g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g; });
  const glove = side => holder('c07-glove' + side, () => { const g = new THREE.Group(), m = plastic('#4b9f4a');
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(.42, .36, .55, 14), m); cuff.rotation.x = Math.PI / 2; cuff.position.set(0, -.05, -.25); g.add(cuff);
    const palm = new THREE.Mesh(new THREE.SphereGeometry(.42, 14, 10), m); palm.scale.set(1, .9, 1.15); palm.position.set(0, 0, .25); g.add(palm); return g; });
  const marshmallow = () => holder('c07-mallow', () => { const g = new THREE.Group(); const sk = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 4, 6), matte(COL.brown)); sk.position.y = 1.4; g.add(sk);
    const mm = new THREE.Mesh(new THREE.CylinderGeometry(.32, .32, .55, 14), matte('#fbf6ee')); mm.position.y = 3.5; g.add(mm); g.userData.mm = mm;
    const fl = new THREE.Group(); fl.position.y = 3.9; const f1 = new THREE.Mesh(new THREE.ConeGeometry(.35, 1.1, 10), glowMat('#ff8a2a', 2.5)); f1.position.y = .45; fl.add(f1);
    const f2 = new THREE.Mesh(new THREE.ConeGeometry(.2, .7, 8), glowMat('#ffe36a', 3)); f2.position.y = .3; fl.add(f2); g.add(fl); g.userData.fl = fl; return g; });

  district('roast', { at: R, r: 70 }, t => {
    put(keep('c07-club', club)); put(keep('c07-truss', truss), RX, 0, RZ); put(micStand(), MIC[0], MIC[1], MIC[2]);
    if (t >= 147.45) clubActors(t);
    put(sign('c07-roastsign', ['THE ROAST'], { w: 12, h: 2.6, bg: '#1a0f2a', fg: '#ffcf6a', glow: true, size: 150 }), RX, 11.4, RZ - 17.6);
    EGGS.offSwitch('club', t, RX - 18, RZ - 8, .5);                    // easter egg: the OFF switch by the stage wing, guarded
    // spotlights: two sweep, one follows Pip's planned spot (pure function of t), one waits for the seedling
    const T3 = [[RX - 8, 14.2, RZ - 3], [RX, 14.2, RZ - 3], [RX + 8, 14.2, RZ - 3]];
    beam('a', T3[0], [RX - 6 + 4 * Math.sin(t * .9), SY, RZ - 10]); beam('b', T3[2], [RX + 6 + 4 * Math.sin(t * 1.1 + 1), SY, RZ - 10]);
    const ps = t > 147.45 ? pipAt(t) : { x: RX, z: RZ - 6 }, k0 = seg(t, 147.45, 150.2);
    beam('c', T3[1], [lerp(RX + 6 * Math.sin(t * 1.2), ps.x, k0), SY, lerp(RZ - 8, ps.z, k0)], 4, .17);
    beam('d', [RX - 4, 14.2, RZ - 3], [RX - 3.8, SY, RZ - 3.6], 2.4, .18 * win(t, 165.6, 168.6, .5));
    // set dressing waiting for its moment: the seedling pot, the gloves on the crate, the marshmallow stick on the chair
    put(keep('c07-pot', () => build([['3062b', COL.brown, 0, 1.2, 0], ['4740', COL.dkorange, 0, 1.5, 0]])), RX - 3.8, SY, RZ - 3.6);
    for (const s of ['L', 'R']) if (t <= (s === 'L' ? GL : GR) - .35) { const g = glove(s); g.userData.inner.rotation.set(-Math.PI / 2, 0, 0); put(g, ...GLOVE_SPOT[s], s === 'L' ? .3 : -.3); }
    if (t <= MALLOW0) { const m = marshmallow(); m.userData.inner.userData.fl.visible = false; m.userData.inner.rotation.set(-.35, 0, 0); put(m, ...CHAIR_STICK, Math.PI); }
    // the audience: 17 seated minifigs (seat 1 is kept free for Clawd); they laugh on the punchlines and clap on the beat
    const lw = Math.max(win(t, 151.0, 152.6), win(t, 155.4, 156.3), win(t, 163.5, 165.6), win(t, 166.3, 168.3));
    for (let k = 0; k < 18; k++) {
      if (k === 1) continue;
      const f = fig('c07-aud' + k, crowdLook(k + 5)), b = beatOf(t);
      const idle = { armL: .3 + .1 * Math.sin(t + k), armR: .3 + .1 * Math.sin(t * 1.3 + k), head: .25 * Math.sin(t * .4 + k), lean: .05 };
      const clap = { ...dance('clap', t, { offset: (k % 3) * .25 }), head: .25 * Math.sin(t * .4 + k), lean: -.12 };
      pose(f, { legL: 1.45, legR: 1.45, ...blend(idle, clap, lw), bodyY: -1.25 + lw * .12 * Math.abs(Math.sin(b * Math.PI)),
        face: win(t, 155.4, 156.3) > .5 ? 'shocked' : lw > .5 ? 'laugh' : k % 4 ? 'neutral' : 'smug' });
      put(f, RX - 10 + (k % 6) * 4, 0, RZ + 4 + Math.floor(k / 6) * 4 + .8, Math.PI);
    }
  });

  // ---------- props ----------
  const Pp = () => { const f = fig('pip', PIP); if (f.userData.J.earPencil) f.userData.J.earPencil.visible = true; return f; };
  const OKN = 300;
  const okButtons = () => { const geo = new THREE.CylinderGeometry(.55, .55, .35, 20); const top = new THREE.MeshStandardMaterial({ map: signTexture(['OK'], { bg: '#3fae5a', fg: '#ffffff', size: 240, pw: 256, ph: 256, font: 'system-ui' }), roughness: .35 });
    const im = new THREE.InstancedMesh(geo, [plastic('#3fae5a'), top, plastic('#3fae5a')], OKN); im.castShadow = true; im.frustumCulled = false; const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; };
  const keyRing = () => { const g = new THREE.Group(), gold = plastic(COL.gold, { metalness: .8, roughness: .25 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.45, .07, 8, 24), gold); g.add(ring);
    for (let i = 0; i < 3; i++) { const k = new THREE.Group(); k.position.set(0, -.45, 0); k.rotation.z = (i - 1) * .45;
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(.14, 1.1, .08), gold); shaft.position.y = -.75; k.add(shaft); const bow = new THREE.Mesh(new THREE.TorusGeometry(.18, .06, 6, 16), gold); bow.position.y = -.15; k.add(bow);
      const bit = new THREE.Mesh(new THREE.BoxGeometry(.3, .14, .08), gold); bit.position.set(.12, -1.2, 0); k.add(bit); g.add(k); }
    g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g; };
  const crown = () => { const g = new THREE.Group(), gold = plastic(COL.gold, { metalness: .85, roughness: .2, side: THREE.DoubleSide });
    const band = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, .8, 24, 1, true), gold); g.add(band);
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, s = new THREE.Mesh(new THREE.ConeGeometry(.3, .9, 8), gold); s.position.set(Math.sin(a) * 1.5, .8, Math.cos(a) * 1.5); g.add(s);
      const gem = new THREE.Mesh(new THREE.SphereGeometry(.14, 10, 8), glowMat(['#ff3a5a', '#3ac8ff'][i % 2], 1.2)); gem.position.set(Math.sin(a) * 1.55, 0, Math.cos(a) * 1.55); g.add(gem); }
    g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g; };
  const ICE = () => plastic('#cfeaff', { transparent: true, opacity: .55, roughness: .05, clearcoat: 1, metalness: 0 });
  const nearHit = (t, h) => Math.abs(t - h) <= 1 / 48 + 1e-6;   // exactly one rendered frame at 24 fps

  // =============================== CHORUS 3 (stage, sunrise) ===============================
  function chorus(t, lt) {
    camera(t, lt);
    const Pf = Pp(), C = clawd('c07', {});
    // A1: each door drops in right beside Pip (its back to him) and he kicks it away on the "Nah!" half beat
    for (let i = 0; i < 3; i++) {
      const land = bt(216 + i), hit = bt(216.5 + i); if (t < land - .45 || t > hit + 1.6) continue;
      const u = keep('c07-door' + i, () => doorUnit(['#9C7A5C', '#6B3B4A', '#E7A6C0'][i])); doorPose(u, 0, 0, i);
      const dx = PIPX + KICK_REACH + .175, z0 = PIPZ + 2, k = t - hit;
      if (t < hit) { const f = seg(t, land - .45, land), y = t < land ? lerp(15, .8, f * f) : .8 + .5 * Math.max(0, Math.sin(Math.PI * seg(t, land, land + .22))); put(u, dx, y, z0, Math.PI / 2); }
      else { const y = .8 + 13 * k - 11 * k * k; put(u, dx + 9 * k, y, z0 - 16 * k, Math.PI / 2 + k * 2.5, y < .2 ? Math.max(.01, 1 + (y - .2) / 4) : 1); u.rotation.z = -k * 3; }
    }
    // Pip: stands his ground and kicks (right foot meets each door), bats the throws, then dances
    const kicks = [0, 1, 2].map(i => bt(216.5 + i)), throwsT = [0, 1, 2].map(i => bt(220 + i));
    let pp = { face: 'determined' };
    for (const h of kicks) if (t > h - .45 && t < h + .6) pp = { ...pp, ...kickPose(t - h), face: t > h - .2 && t < h + .3 ? 'angry' : 'determined' };
    // the bat swings: wind up 2.2 → strike to .2 on the hit → recover to .5; one continuous curve across all three
    let armR = .5, twist = 0;
    for (const h of throwsT) { if (t > h - .45 && t < h + .19) { armR = t < h - .15 ? lerp(.5, 2.2, ease(seg(t, h - .45, h - .15))) : t < h + .03 ? lerp(2.2, .2, ease(seg(t, h - .15, h + .03))) : lerp(.2, .5, ease(seg(t, h + .03, h + .19))); twist = -.4 * Math.sin(Math.PI * seg(t, h - .45, h + .19)); } }
    if (t > bt(219.3) && t < 142.5) pp = { ...pp, armR, armRz: .4 * win(t, bt(219.4), 142.3, .2), twist, face: throwsT.some(h => t > h && t < h + .3) ? 'joy' : 'determined' };
    const danceP = track(t, [[0, pp], [142.5, () => { const s = .5 + .5 * Math.cos(2 * Math.PI * beatOf(t)); return { ...dance('bounce', t), armL: .5 + .7 * s, armR: .5 + .7 * s, face: 'sing' }; }], [145.29, () => ({ ...dance('jump', t), face: 'joy' })], [bt(230), () => ({ ...dance('dab', bt(230)), face: 'wink' })]], .22);
    pose(Pf, { ...danceP, holdR: heldHandset('c07') });
    const pry = angTrack(t, [[0, Math.PI / 2], [140.0, 1.75], [142.5, .2]], .35);
    put(Pf, PIPX, .8, PIPZ, pry);
    for (const [i, h] of kicks.entries()) if (nearHit(t, h)) expect('pip kicks door ' + (i + 1), limb(Pf, 'footR'), [PIPX + KICK_REACH, limb(Pf, 'footR')[1], PIPZ], .8);
    // A2: Clawd conjures each offer in its hand (scales up from nothing) and lobs it; Pip's handset meets it on the beat
    const THR = [() => { const g = new THREE.Group(), c = cage(); c.scale.setScalar(.4); c.position.y = -1.2; g.add(c); return g; }, () => gravestone(), () => pill()];
    let cp = { face: 'smug', hat: 'headset', armL: .25, armR: .25, bob: 0 };
    THR.forEach((mk, i) => {
      const hit = throwsT[i], o = keep('c07-throw' + i, mk);
      const from = [8.5 - 2.5, 6.2, -1 + 1.8], to = [PIPX + 1.4, 4.4, PIPZ + .9];
      if (t > hit - 1.05 && t < hit + 1.5) {
        let x, y, z, s = 1;
        if (t < hit - .75) { x = from[0]; y = from[1]; z = from[2]; s = Math.max(.02, ease(seg(t, hit - 1.05, hit - .8))); }
        else if (t < hit) { const k = seg(t, hit - .75, hit), hnd = limb(Pf, 'handR'), a = ease(seg(t, hit - .3, hit)), tg = to.map((v, j) => lerp(v, hnd[j], a)); x = lerp(from[0], tg[0], k); y = lerp(from[1], tg[1], k) + 3 * Math.sin(Math.PI * k); z = lerp(from[2], tg[2], k); }
        else { const u = t - hit; x = to[0] - 13 * u; y = to[1] + 13 * u - 7 * u * u; z = to[2] - 10 * u; s = Math.max(.02, 1 - ease(seg(t, hit + 1.1, hit + 1.45))); }
        put(o, x, y, z, t * 6, (i === 1 ? .6 : 1) * s); o.rotation.x = t * 5;
        if (nearHit(t, hit)) expect('handset meets throw ' + (i + 1), limb(Pf, 'handR'), [x, y, z], [1.9, 1.7, 1.2][i]);   // centre-to-hand: the object's own radius (cage ~1.1, grave ~.9, pill ~.5) + .7
      }
      if (t > hit - 1.05 && t < hit - .55) cp = { ...cp, armR: .3 + .9 * Math.sin(Math.PI * seg(t, hit - 1.05, hit - .55)) };
    });
    // the crowd runs in from both wings (off screen), hops up onto the stage and dances
    for (let i = 0; i < 10; i++) {
      const tb = bt(223 + Math.floor(i / 2) * .5), side = i % 2 ? 1 : -1, spot = [PIPX + side * (2.6 + Math.floor(i / 2) * 2.2), -2.2 - (i % 3) * .9];
      if (t < tb - 1.9) continue;
      const s = stepTo(t, [[tb - 1.9, [side * 34, spot[1] + 3]], [tb - .55, [side * 15.5, spot[1] + .5]], [tb, spot]], { run: true, face: 0 });
      const onStage = Math.abs(s.x) < 14.2, hop = Math.abs(s.x) < 15.5 && Math.abs(s.x) > 13.6 ? .9 * Math.sin(Math.PI * seg(Math.abs(s.x), 15.5, 13.6)) : 0;
      const f = fig('c07-crowd' + i, crowdLook(i)), moving = t < tb;
      const mv = track(t, [[0, crowdDance(i, t)], [145.29, () => ({ ...dance('jump', t, { offset: (i % 2) * .5 }), face: 'joy' })], [bt(230), () => ({ ...dance('dab', bt(230), { side: side }), face: 'laugh' })]], .25);
      pose(f, moving ? { ...s.pose, face: 'joy' } : blend(s.pose, mv, ease(seg(t, tb, tb + .2))));
      put(f, s.x, (onStage ? .8 : 0) + hop, s.z, moving ? s.ry : angLerp(s.ry, -side * .04, ease(seg(t, tb, tb + .3))));
    }
    // Clawd: smug while lobbing → a stiff robot dance half a beat late → warms up → jumps → dabs (blended, no snaps)
    const bl = beatOf(t - BEAT / 2), q = Math.floor(bl * 2), e = ease(Math.min(1, frac(bl * 2) / .3)), h = j => hash(q * 13 + j) - .5, hp = j => hash((q - 1) * 13 + j) - .5;
    const robot = { face: 'suspicious', hat: 'headset', armL: .6 + lerp(hp(1), h(1), e) * .8, armR: .6 + lerp(hp(2), h(2), e) * .8, twist: lerp(hp(3), h(3), e) * .5, bob: 0 };
    const warm = { face: 'joy', hat: 'headset', armL: .5 + .5 * Math.sin(bl * Math.PI), armR: .5 + .5 * Math.cos(bl * Math.PI), twist: .15 * Math.sin(bl * Math.PI), bob: .3 * Math.abs(Math.sin(bl * Math.PI)) };
    const jumpC = { face: 'joy', hat: 'headset', armL: .9, armR: .9, bob: 1.2 * Math.max(0, Math.sin(Math.PI * clamp(frac(beatOf(t) / 2) * 1.6))) };
    const dabC = { face: 'joy', hat: 'headset', armR: 1.35, armL: .05, roll: .28, lean: .15, bob: 0 };
    put(clawdPose(C, track(t, [[0, cp], [142.66, robot], [144.3, warm], [145.29, jumpC], [bt(230), dabC]], .3)), 8.5, .8, -1, -.9);
    // the gold arc: a giant pencil draws it over the stage (145.3–146.75); the pencil flies up out of frame after
    if (t > 145.25) {
      const arc = keep('c07-arc', () => { const pts = []; for (let i = 0; i <= 40; i++) { const a = Math.PI * i / 40; pts.push(new THREE.Vector3(-16 * Math.cos(a), 6 + 12 * Math.sin(a), -9)); }
        const g = new THREE.Group(), m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, .5, 10), glowMat('#ffd25a', 1.8)); g.add(m); g.userData = { m }; return g; });
      const k = ease(seg(t, 145.3, 146.75)); arc.userData.m.geometry.setDrawRange(0, Math.round(k * 160) * 10 * 6); put(arc, 0, 0, 0, 0, Math.max(.01, seg(t, 145.25, 145.4)));
      const pen = keep('c07-bigpencil', () => { const g = new THREE.Group(), p = pencil(1.8); p.rotation.z = Math.PI; p.position.y = 5.4; g.add(p); return g; });
      const a = Math.PI * k, up = t > 146.75 ? 30 * (t - 146.75) ** 2 : 0;
      put(pen, -16 * Math.cos(a), 6 + 12 * Math.sin(a) + up, -9, 0, Math.max(.01, seg(t, 145.25, 145.45))); pen.rotation.z = -.5 + a * .3;
    }
  }

  // =============================== VERSE 3 (the roast club) ===============================
  // the shot only flies the camera; the club cast and props are drawn by the district (clubActors) for every t >= 147.45,
  // so they stay put while F4 leaves the club and in any later frame that sees the club. Verse Pip is a twin
  // (fig 'c07-pip'), so the district never moves the shared fig('pip') that the next chapters use elsewhere.
  function verse(t, lt) { camera(t, lt); }
  const PipClub = () => { const f = fig('c07-pip', PIP); if (f.userData.J.earPencil) f.userData.J.earPencil.visible = true; return f; };
  function clubActors(t) {
    const b = beatOf(t), Pf = PipClub(), C = clawd('c07', {});
    // ---- positions (planned, continuous) ----
    const ps = pipAt(t), cs0 = stepTo(t, C_PLAN, { run: t > 160.9 }), cy = clawdY(t);
    const csc = lerp(2.2, 1, ease(seg(t, 149.9, 150.5)));
    // ---- Pip's pose: one track of states, blended ----
    const HAND0 = 150.85, HAND1 = 151.15, contractHeld = t > HAND1 && t < 152.85, frozen = seg(t, 159.2, 160.1);
    const pTrack = track(t, [
      [147.45, { face: 'suspicious', armL: .2, armR: .2 }],
      [150.5, { face: 'neutral', armR: 1.8, armL: .2 }],                                     // reaches for the contract
      [151.15, { face: 'determined', armR: 1.3, armL: 1.3 }],                                 // both hands on it, unrolls
      [151.8, { face: 'smug', armR: 1.3, armL: 1.3 }],
      [152.79, { face: 'shocked', armL: 1.6, armR: 1.6 }],                                    // the avalanche
      [153.6, () => ({ face: 'shocked', armL: 1.6, armR: 1.6, bodyY: -.3 * seg(t, 153.6, 155) })],
      [BURY, () => ({ face: 'determined', ...dance('jump', bt(243) + (t - BURY)), armL: 3, armR: 3 })],
      [155.75, { face: 'suspicious', armR: .3, armL: .3 }],
      [SNATCH - .45, { face: 'suspicious', armR: 1.8, armL: .3 }],                           // reaches for the keys
      [SNATCH + .1, { face: 'smug', armR: 2.2, armL: .3 }],                                   // snatched, held up
      [158.22, () => ({ face: frozen > .6 ? 'x' : 'fear', armL: 1.4 * (1 - frozen * .3), armR: 1.6, lean: -.15 })],
      [NAH, { face: 'angry', armL: 2.6, armR: 2.4 }],
      [NAH + .5, () => ({ face: 'determined', armR: 1.4, armRz: .5, head: .4 * Math.sin(t * 2) })],
      [163.25, () => ({ face: Math.sin(b * Math.PI * 2) > 0 ? 'sing' : 'smug', armR: 1.25, armL: .6 + .4 * pulse(t, 5), lean: .08, head: .3 * Math.sin(t) })],
      [GL - .5, { face: 'determined', armL: .7, armR: .3 }],                                  // reaches down to the crate
      [GL, { face: 'determined', armL: 1.8, armR: .7 }],                                     // glove L snaps on
      [GR, { face: 'determined', armL: 1.0, armR: 1.8 }],                                    // glove R snaps on
      [GR + .3, () => ({ face: 'joy', armL: 1.0 + .2 * Math.sin(t * 3), armR: 1.0 + .2 * Math.cos(t * 3) })],
    ], .22);
    const pStand = angTrack(t, [[147.45, 0], [150.0, Math.PI / 2], [151.2, .25], [152.79, 0], [155.6, -Math.PI / 2], [158.4, -.4], [161.6, 0], [166.0, .15]], .35);
    const PW = [[152.85, 153.25], [160.95, 161.55], [162.35, 163.25], [165.35, 166.0]], pMove = Math.max(...PW.map(([a, c]) => win(t, a + .05, c - .05, .15)));
    const pry = facing(t, pStand, segsOf(P_PLAN));
    const holdKeys = t > SNATCH + .12 && t < 163.3;
    pose(Pf, { ...pTrack, ...(ps.pose.legL != null ? legsOnly(ps.pose) : {}), holdL: t > GL ? glove('L') : null, holdR: t > GR ? glove('R') : null });
    put(Pf, ps.x, SY, ps.z, pry, Math.max(.02, seg(t, 147.45, 147.9)));   // comes into being while the camera is ~250 studs away, mid-flight
    // ---- Clawd's pose ----
    const fire = t > FIRE;
    const cTrack = track(t, [
      [147.45, { face: 'smug', hat: 'headset', armL: .2, armR: .2 }],
      [150.4, { face: 'smug', hat: 'headset', armL: 0, armR: .2 }],                            // left arm out with the contract
      [151.35, { face: 'shocked', hat: 'headset', armL: .2, armR: .2 }],
      [152.79, () => ({ face: 'smug', hat: 'headset', armL: .6 + .3 * Math.sin(t * 4), armR: .6 + .3 * Math.cos(t * 4) })],
      [156.0, () => ({ face: 'smug', hat: 'headset', armL: .2, armR: 0 })],                    // right arm out, dangling the keys
      [SNATCH + .05, { face: 'shocked', hat: 'headset', armL: .3, armR: .2 }],
      [158.3, { face: 'smug', hat: 'headset', armL: 1.1, armR: 1.1, bob: .15 }],
      [NAH, { face: 'shocked', hat: 'headset', armL: .5, armR: .5 }],
      [163.3, () => ({ face: fire ? 'shocked' : 'fear', hat: 'headset', armL: .2, armR: .6, bob: -1.0 + .04 * Math.sin(t * 20) })],   // seated, sweating
      [165.6, () => ({ face: 'joy', hat: 'headset', armL: .3 + .3 * pulse(t, 6), armR: .6, bob: -1.0 + .08 * pulse(t, 6) })],      // cheering from the seat
    ], .25);
    const cStand = angTrack(t, [[147.45, -.9], [150.55, 0], [153.3, 0], [156.2, 0], [158.3, .4], [161.6, .5], [163.3, Math.PI]], .35);
    const CW = [[149.9, 150.55], [151.35, 151.8], [152.1, 153.3], [155.55, 156.2], [157.6, 158.3], [160.95, 161.6], [162.35, 163.3]];
    const walking = CW.some(([a, c]) => t > a && t < c), wMove = Math.max(...CW.map(([a, c]) => win(t, a + .05, c - .05, .18)));
    const cry = facing(t, cStand, segsOf(C_PLAN));
    clawdPose(C, { ...cTrack, walk: walking ? t * (t > 160.9 ? 4.5 : 3) : null });
    put(C, cs0.x, cy, cs0.z, cry, csc);
    // ---- props that travel between hands ----
    // the contract: Clawd's LEFT hand → Pip's right hand (150.6–150.95) → between Pip's hands, unrolled → dropped (152.79)
    const sc = holder('c07-contract', () => { const g = new THREE.Group(), m = new THREE.Mesh(scroll(1, 2.4, 3.2), PAPER()); m.castShadow = true; m.position.y = -1.6; g.add(m); g.userData.m = m; return g; });
    const un = ease(seg(t, 151.25, 151.8)), mid = () => { const a = limb(Pf, 'handL'), c = limb(Pf, 'handR'); return [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, (a[2] + c[2]) / 2]; };
    let cAt, cRot = 0;
    if (t < HAND0) cAt = limb(C, 'handL');
    else if (t < HAND1) { cAt = handoff(t, HAND0, HAND1, limb(C, 'handL'), limb(Pf, 'handR'), .3); }
    else if (t < 152.79) { const k = ease(seg(t, HAND1, HAND1 + .25)), rh = limb(Pf, 'handR'), m = mid(); cAt = [lerp(rh[0], m[0], k), lerp(rh[1], m[1], k), lerp(rh[2], m[2], k)]; }
    else { const m0 = mid(), f = [RX - .7, SY + .05, RZ - 3.6], k = seg(t, 152.79, 153.15) ** 2; cAt = [lerp(m0[0], f[0], k), lerp(m0[1], f[1], k), lerp(m0[2], f[2], k)]; cRot = -Math.PI / 2 * k; }
    const scm = sc.userData.inner.userData.m; scm.geometry.dispose(); scm.geometry = scroll(t > HAND1 ? .06 + .94 * un : .05, 2.4, 3.2);
    sc.userData.inner.rotation.set(cRot, 0, 0);
    put(sc, cAt[0], cAt[1], cAt[2], t < HAND1 ? 0 : pry * .4, Math.max(.02, seg(t, 147.45, 147.9)));
    if (t > HAND0 - .03 && t < HAND0 + .03) expect('contract: Clawd hand meets Pip hand', limb(C, 'handL'), limb(Pf, 'handR'), 1.4);
    // the SIGNED stamp pops onto the contract (scale from nothing), shrinks away when it's dropped
    const sk0 = seg(t, 151.8, 152.2), stampK = Math.min(1, backOut(sk0)) * Math.min(1, sk0 * 3) * (1 - ease(seg(t, 152.79, 152.95)));
    if (stampK > .01) put(sign('c07-signed', ['SIGNED'], { w: 2.2, h: .7, bg: '#F6EED8', fg: '#c4281c', size: 150 }), cAt[0], cAt[1] - 2.3, cAt[2] + .35, pry * .4, stampK);
    // the keys: in Clawd's RIGHT hand from the start → snatched by Pip's right hand → hung on the mic hook (163.3–163.55)
    const keys = holder('c07-keys', keyRing);
    let kAt; keys.userData.inner.rotation.set(0, 0, t < SNATCH ? .4 * Math.sin(t * 5) : .15 * Math.sin(t * 3));
    if (t < SNATCH - .1) kAt = limb(C, 'handR');
    else if (t < SNATCH + .12) kAt = handoff(t, SNATCH - .1, SNATCH + .12, limb(C, 'handR'), limb(Pf, 'handR'), .2);
    else if (t < 163.3) kAt = limb(Pf, 'handR');
    else if (t < 163.55) kAt = handoff(t, 163.3, 163.55, limb(Pf, 'handR'), HOOK, .4);
    else kAt = HOOK;
    put(keys, kAt[0], kAt[1] - .1, kAt[2], 0, Math.max(.02, seg(t, 147.45, 147.9)));
    if (t > SNATCH - .14 && t < SNATCH - .06) expect('keys: Clawd hand meets Pip hand', limb(C, 'handR'), limb(Pf, 'handR'), 1.4);
    if (t > 163.28 && t < 163.34) expect('keys: Pip hand at the mic hook', limb(Pf, 'handR'), HOOK, 1.6);
    // the gloves: from the crate to Pip's hands (handoff over .35 s), then worn (held by the grips via pose above)
    for (const [s, g0] of [['L', GL], ['R', GR]]) if (t > g0 - .35 && t < g0) { const g = glove(s); g.userData.inner.rotation.set(-Math.PI / 2 * (1 - seg(t, g0 - .35, g0)), 0, 0); const p = handoff(t, g0 - .35, g0, GLOVE_SPOT[s], limb(Pf, 'hand' + s), .4); put(g, ...p, 0); }
    for (const [s, g0] of [['L', GL], ['R', GR]]) if (t > g0 - .38 && t < g0 - .32) expect('glove ' + s + ': Pip hand at the crate', limb(Pf, 'hand' + s), GLOVE_SPOT[s], 1.6);
    // the marshmallow: picked up from the chair (163.3–163.55), catches fire at 164.3, the flame dies out by 165.8
    if (t > MALLOW0) {
      const m = marshmallow(), fl = m.userData.inner.userData.fl, f = win(t, FIRE, 165.6, .3);
      fl.visible = f > .02; fl.scale.setScalar(Math.max(.01, f * (1.7 + .5 * Math.sin(t * 30)))); m.userData.inner.userData.mm.material = fire ? matte('#3a2a22') : matte('#fbf6ee');
      const p = t < MALLOW1 ? handoff(t, MALLOW0, MALLOW1, CHAIR_STICK, limb(C, 'handR'), .3) : limb(C, 'handR');
      m.userData.inner.rotation.set(lerp(-.35, -.8, seg(t, MALLOW0, MALLOW1)), 0, 0); put(m, ...p, Math.PI);
      if (t > MALLOW0 - .03 && t < MALLOW0 + .03) expect('marshmallow: Clawd hand at the stick', limb(C, 'handR'), CHAIR_GRAB, 1.4);
    }
    // sweat drops: each one swells from nothing, slides down, shrinks to nothing before it wraps (rule 11)
    if (t > 163.2 && t < 165.7) for (let i = 0; i < 5; i++) {
      const d = keep('c07-sweat' + i, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.SphereGeometry(.18, 8, 6), plastic('#9fd3ff', { transparent: true, opacity: .8 })); m.scale.y = 1.5; g.add(m); return g; });
      const k = frac(t * 1.4 + i / 5), env = Math.max(0, Math.sin(Math.PI * k) - .3) / .7 * win(t, 163.4, 165.4, .2);
      put(d, cs0.x + (i - 2) * .55, cy + 4.6 - k * 2.5, cs0.z - .9, 0, Math.max(.01, env));
    }
    // B3: the OK avalanche (instanced; 152.8–156.6): a heap over Pip that blasts outward on BURY
    if (t > 152.8 && t < 156.6) {
      const g = keep('c07-ok', okButtons), im = g.userData.im, M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1);
      for (let i = 0; i < OKN; i++) {
        const ts = lerp(152.8, 155.0, hash(i * 3.1)), a = hash(i) * 6.28, rr = Math.sqrt(hash(i + 7)) * 5, rest = Math.max(.2, 5.6 * (1 - rr / 5)) * (.6 + .4 * hash(i + 9)) + hash(i + 2) * .4;
        const x0 = RX + Math.cos(a) * rr, z0 = RZ - 6 + Math.sin(a) * rr * .8; let x = x0, y, z = z0, rot = 0;
        if (t < ts) y = -100; else if (t < BURY) { const u = t - ts; y = Math.max(SY + rest, SY + 26 - 22 * u * u); rot = Math.min(u, 1.2) * 5 * hash(i + 4); }
        else { const u = t - BURY, v = 6 + 8 * hash(i + 5); x = x0 + Math.cos(a) * v * u; z = z0 + Math.sin(a) * v * u; y = SY + rest + 9 * u * hash(i + 6) - 14 * u * u; rot = u * 9; if (y < -1) y = -100; }
        im.setMatrixAt(i, M.compose(new THREE.Vector3(x, y, z), q.setFromEuler(e.set(rot, a, rot * .6)), one));
      }
      im.instanceMatrix.needsUpdate = true; put(g);
    }
    // B5: the crown drops onto Clawd's head from above the frame, rides there, flies off up out of frame on "Nah"
    if (t > 158.0 && t < NAH + .6) {
      const fall = easeIn(seg(t, 158.0, 158.45)), head = cy + 6.55 * csc, y = t < 158.45 ? lerp(head + 22, head, fall) : head + .3 * Math.max(0, Math.sin(Math.PI * seg(t, 158.45, 158.65)));
      put(keep('c07-crown', crown), cs0.x, t > NAH ? head + 28 * (t - NAH) : y, cs0.z, t * .3 + (t > NAH ? (t - NAH) * 8 : 0));
    }
    // B5: ice creeps from Clawd across the stage and seals Pip in; on "Nah" it shatters (shards cover the block vanishing)
    if (t > 158.3 && t < NAH + .35) {
      const ice = keep('c07-icefloor', () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.CircleGeometry(1, 48), ICE()); m.rotation.x = -Math.PI / 2; m.position.y = .03; g.add(m); return g; });
      put(ice, RX - 6.5, SY, RZ - 9, 0, Math.max(.02, (.05 + 14 * ease(seg(t, 158.4, 159.6))) * (1 - ease(seg(t, NAH, NAH + .3)))));
      const blk = keep('c07-iceblock', () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1, 2.6), ICE()); g.add(m); g.userData.m = m; return g; });
      blk.userData.m.scale.y = .01 + 6.4 * frozen; blk.userData.m.position.y = blk.userData.m.scale.y / 2;
      put(blk, RX, SY, RZ - 6, 0, Math.max(.02, Math.min(1, frozen * 6) * (1 - ease(seg(t, NAH, NAH + .08)))));
    }
    if (t > NAH && t < NAH + 1.4) { const u = t - NAH, sh = keep('c07-shards', () => { const im = new THREE.InstancedMesh(new THREE.BoxGeometry(.5, .5, .3), ICE(), 40); im.frustumCulled = false; const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; });
      const M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = Math.max(.02, 1 - seg(u, 1.0, 1.35));
      for (let i = 0; i < 40; i++) { const a = hash(i) * 6.28, v = 4 + 6 * hash(i + 1); sh.userData.im.setMatrixAt(i, M.compose(new THREE.Vector3(RX + Math.cos(a) * v * u, Math.max(.2, SY + 2 + 2 * hash(i + 2) + 7 * u - 14 * u * u), RZ - 6 + Math.sin(a) * v * u), q.setFromEuler(e.set(u * 9 * hash(i + 3), u * 7, 0)), new THREE.Vector3(s, s, s))); }
      sh.userData.im.instanceMatrix.needsUpdate = true; put(sh); }
    // B6: the road unrolls from Pip toward the audience, forking on every beat bt(252..255); it stays for the rest of the verse
    if (t > NAH) {
      const road = keep('c07-road', () => { const segs = [], add = (x0, z0, x1, z1, lvl) => { segs.push([x0, z0, x1, z1, lvl]); if (lvl < 3) { const w = 6 / (lvl + 1); add(x1, z1, x1 - w, z1 + 2.2, lvl + 1); add(x1, z1, x1 + w, z1 + 2.2, lvl + 1); } };
        add(0, -11, 0, -8.6, 0); const g = new THREE.Group();
        g.userData.segs = segs.map(([x0, z0, x1, z1, lvl]) => { const L = Math.hypot(x1 - x0, z1 - z0), s = new THREE.Group(), body = new THREE.Group(); s.position.set(x0, .08, z0); s.rotation.y = Math.atan2(x1 - x0, z1 - z0);
          const m = new THREE.Mesh(new THREE.BoxGeometry(1.2, .14, L), plastic('#5a5d63')); m.position.z = L / 2; m.receiveShadow = true; body.add(m);
          const line = new THREE.Mesh(new THREE.BoxGeometry(.14, .16, L * .8), plastic('#F2CD37')); line.position.z = L / 2; body.add(line); s.add(body); g.add(s); return [body, lvl]; }); return g; });
      for (const [body, lvl] of road.userData.segs) { const k = ease(seg(t, bt(252 + lvl) - .15, bt(252 + lvl) + .2)); body.visible = k > .01; body.scale.set(1, 1, Math.max(.01, k)); }
      put(road, RX, SY, RZ, 0, Math.max(.02, ease(seg(t, NAH, NAH + .1))));
      const post = keep('c07-post', () => { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, 4.6, 8), plastic(COL.brown)); p.position.y = 2.3; g.add(p);
        g.userData.arrows = [0, 1, 2, 3].map(i => { const a = new THREE.Group(); a.position.y = 4.2 - i * .8; const m = new THREE.Mesh(new THREE.BoxGeometry(2, .5, .1), plastic(['#c4281c', '#0055BF', '#F2CD37', '#4B9F4A'][i])); m.position.x = (i % 2 ? -1 : 1) * 1.1; a.add(m);
          const tip = new THREE.Mesh(new THREE.ConeGeometry(.35, .5, 3), m.material); tip.rotation.z = (i % 2 ? 1 : -1) * Math.PI / 2; tip.position.x = (i % 2 ? -1 : 1) * 2.3; a.add(tip); g.add(a); return a; }); return g; });
      post.userData.arrows.forEach((a, i) => { const k = backOut(seg(t, bt(252 + i), bt(252 + i) + .25)); a.scale.setScalar(Math.max(.01, k)); a.rotation.y = (1 - k) * 1.6 + .3 * i; });
      put(post, RX + 2.5, SY, RZ - 10.5, 0, Math.max(.02, backOut(seg(t, bt(251.6), bt(252)))));   // springs up like a jack-in-the-box
    }
    // B8: the seedling unfurls in the pot (from nothing)
    if (t > 165.5) { const plant = keep('c07-sprout', () => { const g = new THREE.Group(); g.add(part('30176', COL.green)); return g; });
      put(plant, RX - 3.8, SY + 1.6, RZ - 3.6, t * .4, Math.max(.01, ease(seg(t, 165.6, 166.8)) * 1.4)); }
  }

  shots([[138.11, chorus], [147.45, verse]]);
})();
