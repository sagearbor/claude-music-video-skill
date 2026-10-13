// c07_chorus3_roast.js: 138.11–168.35 s. Chorus 3 on the STAGE at sunrise, then ONE continuous flight (no cut) to the ROAST
// comedy club for verse 3. Seams: in = the Fb glide (lands 138.11, landing bump + flash); out = F4 (from 167.55).
// Hits: doors drop on bt(216–218), "Nah!" kicks on the half beats bt(216.5–218.5); throws batted on bt(220–222);
// crowd rises bt(223–226); jump + gold arc 145.3–146.8; club: contract 151, OK avalanche 152.8–155.4 (burst bt(243)),
// keys snatched bt(246), ice 158.4–160.2, shatter on "Nah" 160.85, road forks bt(252–255), fire 164.3, gloves bt(260)/bt(261).
(() => {
  const R = WORLD.D.roast, RX = R[0], RZ = R[1];
  const at = (dx, dy, dz) => [RX + dx, dy, RZ + dz];
  const SY = 2.4;                                  // club stage top height
  const DROP = 138.11, FLY0 = 146.8, FLY1 = 149.3, BURY = bt(243), NAH = 160.85, FIRE = 164.3;
  const DOORS = (window.SETS3D && SETS3D.DOORS) || [{ x: -9, col: '#9C7A5C' }, { x: -2, col: '#6B3B4A' }, { x: 5, col: '#E7A6C0' }];
  const beatOf = t => (t - OFF) / BEAT;

  // ---------- camera: one path for the whole chapter (keys ~1.3–1.6 s apart so speed stays even) ----------
  const r = (dx, dy, dz) => at(dx, dy, dz);
  const CAM = [
    [138.11, [0, 6, 30], [0, 4, -4], 34], [138.9, [-1, 5.6, 26], [-2, 4, -5], 33], [140.0, [-5, 5, 21], [-3, 3.8, -5], 32],
    [141.4, [6, 4.4, 18], [0, 3.4, -1], 34], [142.8, [11, 6.5, 24], [1, 4, -2], 38], [144.2, [4, 5, 22], [2, 4.2, -2], 36],
    [145.5, [-2, 4.6, 18], [1, 5.2, -1], 33], [146.8, [0, 12, 30], [0, 10, -6], 40],
    [148.0, [110, 70, -90], [185, 20, -175], 40],                               // over the city with its cranes
    [149.3, r(0, 16, 30), r(0, 4, -6), 38], [150.8, r(-4, 10.5, 19), r(0, 5, -6), 30], [152.4, r(3, 10, 18), r(0, 5.6, -6), 28],
    [153.9, r(0, 12, 23), r(0, 4, -6), 36], [155.5, r(-3, 10, 18), r(-.5, 4.5, -6), 32], [157.0, r(4, 9.5, 16), r(0, 5, -6), 28],
    [158.6, r(0, 10, 20), r(0, 4.5, -7), 34], [160.2, r(-5, 10, 18), r(-1, 4, -7), 32], [161.8, r(0, 16, 12), r(0, 2.4, -8), 40],
    [163.4, r(-14, 6, 1.5), r(-4, 4.2, .5), 42], [164.9, r(-10, 5, 1.8), r(-6, 5.0, 4.8), 34], [165.6, r(-9, 8.5, 0), r(-3, 5, -3), 34], [166.3, r(0, 10, 20), r(0, 5, -4), 32],
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
    // sky + light: sunrise on the stage, blending to the club's night during the flight
    const k = smoother(seg(t, FLY0, FLY1)), A = { ...WORLD.LOOK.sunrise }, B = { ...WORLD.LOOK.roast }, o = {};
    for (const key of new Set([...Object.keys(A), ...Object.keys(B)])) o[key] = mixVal(A[key] ?? B[key], B[key] ?? A[key], k);
    look(o);
    if (land.flash > 0) hud(ctx => { ctx.fillStyle = `rgba(255,255,255,${land.flash})`; ctx.fillRect(0, 0, W, H); });
  }

  // ---------- stage extras for chorus 3 (sunrise): a sun, a garland over the doors ----------
  district('stage-c07', { at: [0, 0], r: 90 }, t => {
    if (t < 137 || t > 150) return;
    const sun = keep('c07-sun', () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16), glowMat('#ffcf6a', 2.2)); g.add(m); return g; });
    put(sun, -60, 45 + 6 * seg(t, 138, 147), -420);
    const gar = keep('c07-garland', () => { const l = []; for (let x = -14; x <= 14; x += 1) l.push(['3062b', ['#F2CD37', '#E8AA38', '#F6A65A', '#ffffff'][(x + 14) % 4], x, 9.6 + .9 * Math.cos(x / 4.5), -7.6, 0, .55]); return build(l); });
    put(gar, 0, 0, 0);
  });

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
  district('roast', { at: R, r: 70 }, t => {
    put(keep('c07-club', club)); put(keep('c07-truss', truss), RX, 0, RZ);
    put(sign('c07-roastsign', ['THE ROAST'], { w: 12, h: 2.6, bg: '#1a0f2a', fg: '#ffcf6a', glow: true, size: 150 }), RX, 11.4, RZ - 17.6);
    EGGS.offSwitch('club', t, RX - 18, RZ - 8, .5);                    // easter egg: the OFF switch by the stage wing, guarded
    // the audience (18 seated minifigs facing the stage); they laugh on the punchlines, clap on the beat
    for (let k = 0; k < 18; k++) {
      if (k === 1 && t > 162.8 && t < 165.6) continue;                // that seat is Clawd's in B7
      const f = fig('c07-aud' + k, crowdLook(k + 5)), b = beatOf(t), laugh = (t > 151 && t < 152.6) || (t > 163.5 && t < 165.6) || (t > 155.4 && t < 156.4);
      const clap = laugh ? dance('clap', t, { offset: (k % 3) * .25 }) : { armL: .3 + .1 * Math.sin(t + k), armR: .3 + .1 * Math.sin(t * 1.3 + k) };
      pose(f, { legL: 1.45, legR: 1.45, bodyY: -1.25 + (laugh ? .12 * Math.abs(Math.sin(b * Math.PI)) : 0), lean: laugh ? -.12 : .05, head: .25 * Math.sin(t * .4 + k), ...clap,
        face: t > 155.4 && t < 156.4 ? 'shocked' : laugh ? 'laugh' : k % 4 ? 'neutral' : 'smug' });
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
  const glove = side => keep('c07-glove' + side, () => { const g = new THREE.Group(), m = plastic('#4b9f4a');
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(.42, .36, .55, 14), m); cuff.rotation.x = Math.PI / 2; cuff.position.set(0, -.05, -.25); g.add(cuff);
    const palm = new THREE.Mesh(new THREE.SphereGeometry(.42, 14, 10), m); palm.scale.set(1, .9, 1.15); palm.position.set(0, 0, .25); g.add(palm); return g; });
  const marshmallow = () => keep('c07-mallow', () => { const g = new THREE.Group(); const sk = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 4, 6), matte(COL.brown)); sk.position.y = 1.4; g.add(sk);
    const mm = new THREE.Mesh(new THREE.CylinderGeometry(.32, .32, .55, 14), matte('#fbf6ee')); mm.position.y = 3.5; g.add(mm); g.userData.mm = mm;
    const fl = new THREE.Group(); fl.position.y = 3.9; const f1 = new THREE.Mesh(new THREE.ConeGeometry(.35, 1.1, 10), glowMat('#ff8a2a', 2.5)); f1.position.y = .45; fl.add(f1);
    const f2 = new THREE.Mesh(new THREE.ConeGeometry(.2, .7, 8), glowMat('#ffe36a', 3)); f2.position.y = .3; fl.add(f2); g.add(fl); g.userData.fl = fl; return g; });
  const micStand = () => keep('c07-mic', () => { const g = new THREE.Group(), m = plastic('#2a2a2e', { metalness: .6, roughness: .3 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(.7, .8, .15, 18), m); base.position.y = .08; g.add(base); const pole = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 4.4, 8), m); pole.position.y = 2.2; g.add(pole);
    const mic = new THREE.Mesh(new THREE.SphereGeometry(.28, 14, 10), plastic('#8a8e94', { metalness: .7, roughness: .3 })); mic.position.set(0, 4.5, .15); g.add(mic); g.traverse(o => { if (o.isMesh) o.castShadow = true; }); return g; });
  const ICE = () => plastic('#cfeaff', { transparent: true, opacity: .55, roughness: .05, clearcoat: 1, metalness: 0 });

  // =============================== CHORUS 3 (stage, sunrise) ===============================
  function chorus(t, lt) {
    camera(t, lt);
    const P = Pp(), C = clawd('c07', {});
    const pp = { face: 'determined' }, px = -1, pz = 1.2; let pry = 0;
    // A1: doors drop in on bt(216..218); Pip kicks each flat on the "Nah!" half beats
    DOORS.forEach((d, i) => {
      const land = bt(216 + i), kick = bt(216.5 + i); if (t < land - .45) return;
      const u = doorUnit(d.col), y = t < land ? lerp(22, .8, easeIn(seg(t, land - .45, land))) : .8;
      doorPose(u, 0, seg(t, kick, kick + .9), i + 11); put(u, d.x, y, -6);
      if (t > kick - .25 && t < kick + .35) { const k = seg(t, kick - .22, kick + .02) * (1 - seg(t, kick + .15, kick + .35)); pry = Math.atan2(d.x + 2 - px, -6 - pz) * .7; Object.assign(pp, { legR: 1.35 * k, armL: .7 * k, armR: -.3 * k, lean: -.15 * k, face: 'angry' }); }
    });
    // A2: Clawd lobs cage, grave, pill on bt(220..222); Pip bats each away with the handset (a tennis swing)
    const THR = [() => { const g = new THREE.Group(), c = cage(); c.scale.setScalar(.4); c.position.y = -1.2; g.add(c); return g; }, () => gravestone(), () => pill()];
    THR.forEach((mk, i) => {
      const hit = bt(220 + i), o = keep('c07-throw' + i, mk);
      if (t > hit - .75 && t < hit + 1.6) {
        let x, y, z; const from = [8.5, 5.5, -1], to = [px + 1.6, 3.6, pz + .6];
        if (t < hit) { const k = seg(t, hit - .75, hit); x = lerp(from[0], to[0], k); y = lerp(from[1], to[1], k) + 3 * Math.sin(Math.PI * k); z = lerp(from[2], to[2], k); }
        else { const u = t - hit; x = to[0] - 14 * u; y = to[1] + 12 * u - 6 * u * u; z = to[2] + 9 * u; }
        put(o, x, y, z, t * 6, i === 1 ? .6 : 1); o.rotation.x = t * 5;
      }
      const k = seg(t, hit - .3, hit) * (1 - seg(t, hit + .15, hit + .45));
      if (t > hit - .5 && t < hit + .5) Object.assign(pp, { armR: 2.2 - 2.0 * seg(t, hit - .12, hit + .06), armRz: .4, twist: -.4 * k, face: t < hit ? 'determined' : 'joy' });
    });
    if (t > bt(219.5) && t < 142.66) pp.holdR = heldHandset('c07');
    // A3: everyone dances; A4: jumps; the final word "back!" is a dab
    if (t >= 142.5) {
      Object.assign(pp, { ...dance(t < 145.29 ? 'bounce' : 'jump', t), face: t < 145.29 ? 'sing' : 'joy' });
      if (t > 146.75) Object.assign(pp, dance('dab', bt(230)), { face: 'wink' });
    }
    for (let i = 0; i < 10; i++) {
      const tb = bt(223 + Math.floor(i / 2) * .5), k = backOut(seg(t, tb, tb + .28)); if (k <= 0) continue;
      const f = fig('c07-crowd' + i, crowdLook(i)), x = (i % 2 ? 1 : -1) * (2.6 + Math.floor(i / 2) * 2.2), z = -2.2 - (i % 3) * .9;
      const mv = t > 146.75 ? dance('dab', bt(230), { side: i % 2 ? -1 : 1 }) : t > 145.29 ? dance('jump', t, { offset: (i % 2) * .5 }) : crowdDance(i, t);
      pose(f, { ...mv, face: t > 146.75 ? 'laugh' : mv.face || 'joy', bodyY: (mv.bodyY || 0) - 4.5 * (1 - k) });
      put(f, px + x, .8, z, -x * .04);
    }
    pose(P, pp); put(P, px, .8, pz, pry);
    // Clawd: smug, lobbing → a stiff robot dance half a beat late → it warms up → jumps → dabs
    let cp = { face: 'smug', hat: 'headset', armL: .25, armR: .25, bob: 0 };
    if (t > bt(219.6) && t < 142.66) { const i = [220, 221, 222].findIndex(k => t > bt(k) - .8 && t < bt(k) + .1); if (i >= 0) { const k = seg(t, bt(220 + i) - .8, bt(220 + i) - .65); cp = { ...cp, armR: .3 + .9 * Math.sin(Math.PI * k) }; } }
    if (t >= 142.66) {
      const bl = beatOf(t - BEAT / 2), q = Math.floor(bl * 2), warm = seg(t, 143.6, 145.0), e = ease(Math.min(1, frac(bl * 2) / .1)), h = j => hash(q * 13 + j) - .5;
      cp = { face: warm < .5 ? 'suspicious' : 'joy', hat: 'headset', armL: lerp(.6 + h(1) * 1.2 * e, .5 + .5 * Math.sin(bl * Math.PI), warm), armR: lerp(.6 + h(2) * 1.2 * e, .5 + .5 * Math.cos(bl * Math.PI), warm),
        twist: lerp(h(3) * .6 * e, .15 * Math.sin(bl * Math.PI), warm), bob: lerp(0, .3 * Math.abs(Math.sin(bl * Math.PI)), warm) };
      if (t > 145.29) cp = { ...cp, bob: 1.2 * Math.max(0, Math.sin(Math.PI * clamp(frac(beatOf(t) / 2) * 1.6))), armL: .9, armR: .9, face: 'joy' };
      if (t > 146.75) { const k = ease(seg(t, bt(230), bt(230) + .12)); cp = { ...cp, bob: 0, armR: lerp(.9, 1.35, k), armL: lerp(.9, .05, k), roll: .28 * k, lean: .15 * k, face: 'joy' }; }
    }
    put(clawdPose(C, cp), 8.5, .8, -1, -.9);
    // the gold arc: a giant pencil draws it over the stage (145.3–146.75)
    if (t > 145.25) {
      const arc = keep('c07-arc', () => { const pts = []; for (let i = 0; i <= 40; i++) { const a = Math.PI * i / 40; pts.push(new THREE.Vector3(-16 * Math.cos(a), 6 + 12 * Math.sin(a), -9)); }
        const g = new THREE.Group(), m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, .5, 10), glowMat('#ffd25a', 1.8)); g.add(m); g.userData = { m }; return g; });
      const k = ease(seg(t, 145.3, 146.75)); arc.userData.m.geometry.setDrawRange(0, Math.round(k * 160) * 10 * 6); put(arc);
      if (k < 1) { const pen = keep('c07-bigpencil', () => { const g = new THREE.Group(), p = pencil(1.8); p.rotation.z = Math.PI; p.position.y = 5.4; g.add(p); return g; });
        const a = Math.PI * k; put(pen, -16 * Math.cos(a), 6 + 12 * Math.sin(a), -9, 0); pen.rotation.z = -.5 + a * .3; }
    }
  }

  // =============================== VERSE 3 (the roast club) ===============================
  function verse(t, lt) {
    camera(t, lt);
    const b = beatOf(t), P = Pp(), C = clawd('c07', {});
    put(micStand(), RX, SY, RZ - 5);
    let pp = { face: 'neutral' }, ppos = [RX - 2, SY, RZ - 6], pry = 0, cpos = [RX + 7, SY, RZ - 8], cry = -.6, cs = 1;
    let cp = { face: 'smug', hat: 'headset', armL: .2, armR: .2, bob: .1 * Math.abs(Math.sin(b * Math.PI)) };
    // spotlights: two sweep the stage, one finds Pip
    const trussPts = [[RX - 8, 14.2, RZ - 3], [RX, 14.2, RZ - 3], [RX + 8, 14.2, RZ - 3]];
    beam('a', trussPts[0], [RX - 6 + 4 * Math.sin(t * .9), SY, RZ - 10]); beam('b', trussPts[2], [RX + 6 + 4 * Math.sin(t * 1.1 + 1), SY, RZ - 10]);

    // B1 147.45–149.76 "Bootloader": tiny Pip at the mic, Clawd a giant in the wings (scale 2.2), smug
    if (t < 149.76) { ppos = [RX - 1, SY, RZ - 6]; pp = { face: 'suspicious', armL: .2 }; cpos = [RX + 10, SY, RZ - 11]; cs = 2.2; cry = -.9; cp = { ...cp, face: 'smug', armR: .5 + .2 * Math.sin(t * 2) }; }
    // B2 149.76–152.79 "openin' act owns the stage and the contract": Clawd shrinks to size and hands over the contract;
    // Pip unfurls it, signed, and holds it up
    else if (t < 152.79) {
      cs = lerp(2.2, 1, ease(seg(t, 149.76, 150.4))); cpos = [lerp(RX + 10, RX + 3.5, ease(seg(t, 149.76, 150.6))), SY, lerp(RZ - 11, RZ - 7, ease(seg(t, 149.76, 150.6)))];
      cp = { ...cp, face: t < 151.2 ? 'smug' : 'shocked', walk: t < 150.6 ? t * 3 : null, armR: t < 151.0 ? .8 : .2 };
      ppos = [RX - 1, SY, RZ - 6]; pry = .25;
      const un = ease(seg(t, 151.1, 151.7)), have = t > 150.95;
      pp = { face: have ? (t > 151.7 ? 'smug' : 'determined') : 'neutral', armL: have ? 1.3 : .2, armR: have ? 1.3 : .2 };
      const sc = keep('c07-contract', () => { const g = new THREE.Group(), m = new THREE.Mesh(scroll(1, 2.4, 3.2), PAPER()); m.castShadow = true; g.add(m); g.userData.m = m; return g; });
      sc.userData.m.geometry.dispose(); sc.userData.m.geometry = scroll(have ? .06 + .94 * un : .05, 2.4, 3.2);
      if (have) put(sc, ppos[0] + .2, SY + 5.3, ppos[2] + 1.6, .25); else put(sc, cpos[0] - 1.6, SY + 5.4, cpos[2] + 1.4, -.6);
      if (t > 151.7) put(sign('c07-signed', ['SIGNED'], { w: 2.2, h: .7, bg: '#F6EED8', fg: '#c4281c', size: 150 }), ppos[0] + .25, SY + 3.75, ppos[2] + 1.75, .25);
    }
    // B3 152.79–155.50 "a thousand little okay": OK buttons rain down and bury Pip… who bursts out on bt(243)
    else if (t < 155.5) {
      ppos = [RX, SY, RZ - 6]; cpos = [RX + 7, SY, RZ - 9];
      cp = { ...cp, face: 'smug', armL: .6 + .3 * Math.sin(t * 4), armR: .6 + .3 * Math.cos(t * 4) };
      pp = t < BURY ? { face: 'shocked', armL: 1.6, armR: 1.6, bodyY: -.3 * seg(t, 153.5, 155) } : { face: 'determined', ...dance('jump', bt(243) + (t - BURY)), armL: 3, armR: 3 };
    }
    // B4 155.50–158.22 "handin' over the keys": Clawd dangles the key ring; Pip snatches it back on bt(246)
    else if (t < 158.22) {
      ppos = [RX - 2.5, SY, RZ - 6]; cpos = [RX + 2.6, SY, RZ - 7]; cry = -1.2; pry = 1.1;
      const snatch = bt(246), got = t > snatch, keys = keep('c07-keys', keyRing);
      keys.rotation.set(0, 0, got ? 0 : .4 * Math.sin(t * 5));
      cp = { ...cp, face: got ? 'shocked' : 'smug', armR: got ? .2 : .95, holdR: got ? null : keys };
      pp = { face: got ? 'smug' : 'suspicious', armR: got ? 2.4 : 1.2 * seg(t, snatch - .4, snatch), holdR: got ? keys : null, bodyY: got ? .3 * Math.max(0, 1 - (t - snatch) * 3) : 0 };
    }
    // B5 158.22–160.85 "Lock-In… one king's code": Clawd crowned; ice creeps across the stage and freezes Pip
    else if (t < NAH) {
      ppos = [RX - 3, SY, RZ - 6]; cpos = [RX + 5, SY, RZ - 9]; cry = -.7;
      cp = { ...cp, face: 'smug', armL: 1.1, armR: 1.1, bob: .15 };
      const fr = seg(t, 159.2, 160.1); pp = { face: fr > .6 ? 'x' : 'fear', armL: 1.4 * (1 - fr * .3), armR: .3, lean: -.15 };
      const ice = keep('c07-icefloor', () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.CircleGeometry(1, 48), ICE()); m.rotation.x = -Math.PI / 2; m.position.y = .03; g.add(m); return g; });
      put(ice, cpos[0], SY, cpos[2], 0, .3 + 14 * ease(seg(t, 158.4, 159.6)));
      const blk = keep('c07-iceblock', () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1, 2.6), ICE()); g.add(m); g.userData.m = m; return g; });
      blk.userData.m.scale.y = .01 + 6.4 * fr; blk.userData.m.position.y = blk.userData.m.scale.y / 2; put(blk, ppos[0], SY, ppos[2]);
    }
    // B6 160.85–163.16 "Nah. We keep a fork in every road": the ice shatters; a road unrolls and forks on every beat
    else if (t < 163.16) {
      ppos = [RX, SY, RZ - 12]; cpos = [RX + 9, SY, RZ - 11]; cry = -.9;
      cp = { ...cp, face: 'shocked', armL: .5, armR: .5, bob: 0 };
      const u = t - NAH; pp = u < .5 ? { face: 'angry', armL: 2.6, armR: 2.6 } : { face: 'determined', armR: 1.4, armRz: .5, head: .4 * Math.sin(t * 2) };
      if (u < 1.4) { const sh = keep('c07-shards', () => { const im = new THREE.InstancedMesh(new THREE.BoxGeometry(.5, .5, .3), ICE(), 40); im.frustumCulled = false; const g = new THREE.Group(); g.add(im); g.userData.im = im; return g; });
        const M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
        for (let i = 0; i < 40; i++) { const a = hash(i) * 6.28, v = 4 + 6 * hash(i + 1); sh.userData.im.setMatrixAt(i, M.compose(new THREE.Vector3(RX - 3 + Math.cos(a) * v * u, Math.max(.2, SY + 2 + 2 * hash(i + 2) + 7 * u - 14 * u * u), RZ - 6 + Math.sin(a) * v * u), q.setFromEuler(e.set(u * 9 * hash(i + 3), u * 7, 0)), new THREE.Vector3(1, 1, 1))); }
        sh.userData.im.instanceMatrix.needsUpdate = true; put(sh); }
      // the road: a trunk from Pip toward the audience that forks at each level on bt(252..255)
      const road = keep('c07-road', () => { const segs = [], add = (x0, z0, x1, z1, lvl) => { segs.push([x0, z0, x1, z1, lvl]); if (lvl < 3) { const w = 6 / (lvl + 1); add(x1, z1, x1 - w, z1 + 2.2, lvl + 1); add(x1, z1, x1 + w, z1 + 2.2, lvl + 1); } };
        add(0, -11, 0, -8.6, 0); const g = new THREE.Group();
        g.userData.segs = segs.map(([x0, z0, x1, z1, lvl]) => { const L = Math.hypot(x1 - x0, z1 - z0), s = new THREE.Group(), body = new THREE.Group(); s.position.set(x0, .08, z0); s.rotation.y = Math.atan2(x1 - x0, z1 - z0);
          const m = new THREE.Mesh(new THREE.BoxGeometry(1.2, .14, L), plastic('#5a5d63')); m.position.z = L / 2; m.receiveShadow = true; body.add(m);
          const line = new THREE.Mesh(new THREE.BoxGeometry(.14, .16, L * .8), plastic('#F2CD37')); line.position.z = L / 2; body.add(line); s.add(body); g.add(s); return [body, lvl]; }); return g; });
      for (const [body, lvl] of road.userData.segs) { const k = ease(seg(t, bt(252 + lvl) - .15, bt(252 + lvl) + .2)); body.visible = k > .01; body.scale.set(1, 1, Math.max(.01, k)); }
      put(road, RX, SY, RZ);
      // the signpost: one arrow flips out per beat
      const post = keep('c07-post', () => { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, 4.6, 8), plastic(COL.brown)); p.position.y = 2.3; g.add(p);
        g.userData.arrows = [0, 1, 2, 3].map(i => { const a = new THREE.Group(); a.position.y = 4.2 - i * .8; const m = new THREE.Mesh(new THREE.BoxGeometry(2, .5, .1), plastic(['#c4281c', '#0055BF', '#F2CD37', '#4B9F4A'][i])); m.position.x = (i % 2 ? -1 : 1) * 1.1; a.add(m);
          const tip = new THREE.Mesh(new THREE.ConeGeometry(.35, .5, 3), m.material); tip.rotation.z = (i % 2 ? 1 : -1) * Math.PI / 2; tip.position.x = (i % 2 ? -1 : 1) * 2.3; a.add(tip); g.add(a); return a; }); return g; });
      post.userData.arrows.forEach((a, i) => { const k = backOut(seg(t, bt(252 + i), bt(252 + i) + .25)); a.scale.setScalar(Math.max(.01, k)); a.rotation.y = (1 - k) * 1.6 + .3 * i; });
      put(post, RX + 2, SY, RZ - 9.5);
    }
    // B7 163.16–165.56 "I could roast y'all…": Pip at the mic; Clawd in the front row sweating, a marshmallow that catches fire
    else if (t < 165.56) {
      ppos = [RX - .1, SY, RZ - 4.6];
      const sing = Math.sin(b * Math.PI * 2) > 0;
      pp = { face: sing ? 'sing' : 'smug', armR: 1.6 + .2 * Math.sin(t * 3), armL: .6 + .4 * pulse(t, 5), lean: .08, head: .3 * Math.sin(t) };
      cpos = [RX - 6, 0, RZ + 4.8]; cry = Math.PI; cs = .85;
      const fire = t > FIRE, mm = marshmallow(); mm.userData.fl.visible = fire; mm.userData.fl.scale.setScalar(fire ? 1.7 + .5 * Math.sin(t * 30) : 1); mm.userData.mm.material = fire ? matte('#3a2a22') : matte('#fbf6ee');
      cp = { face: fire ? 'shocked' : 'fear', hat: 'headset', armL: .2, armR: .7, holdR: mm, bob: -.5 + .05 * Math.sin(t * 20), squash: .05 };
      for (let i = 0; i < 5; i++) { const d = keep('c07-sweat' + i, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.SphereGeometry(.18, 8, 6), plastic('#9fd3ff', { transparent: true, opacity: .8 })); m.scale.y = 1.5; g.add(m); return g; });
        const k = frac(t * 1.4 + i / 5); put(d, cpos[0] + (i - 2) * .55, 4.6 - k * 3 - .5, cpos[2] - .9, 0, 1 - k * .5); }
    }
    // B8 165.56–168.35 "grief don't plant a garden… gloves on": a seedling unfurls; Pip snaps on the gloves, one per beat
    else {
      ppos = [RX - 1.5, SY, RZ - 5]; pry = .3; cpos = [RX + 6, SY, RZ - 8]; cry = -.8;
      cp = { face: 'joy', hat: 'headset', armL: .3, armR: .3, bob: .05 * Math.sin(t * 2) };
      const gL = t > bt(260), gR = t > bt(261), snapL = gL ? Math.exp(-(t - bt(260)) * 6) : 0, snapR = gR ? Math.exp(-(t - bt(261)) * 6) : 0;
      pp = { face: 'determined', armL: gL ? .9 + .9 * snapL : 1.0, armR: gR ? .9 + .9 * snapR : (gL ? 1.2 : .3), holdL: gL ? glove('L') : null, holdR: gR ? glove('R') : null, head: -.2 };
      put(keep('c07-pot', () => build([['3062b', COL.brown, 0, 1.2, 0], ['4740', COL.dkorange, 0, 1.5, 0]])), RX + 2, SY, RZ - 4.5);
      const plant = keep('c07-sprout', () => { const g = new THREE.Group(); g.add(part('30176', COL.green)); return g; });
      put(plant, RX + 2, SY + 1.6, RZ - 4.5, t * .4, Math.max(.01, ease(seg(t, 165.6, 166.8)) * 1.4));
      beam('d', [RX + 2, 14.2, RZ - 3], [RX + 2, SY, RZ - 4.5], 2.4, .1 + .08 * seg(t, 165.6, 166.4));
    }
    // the main spot follows Pip (and the mic in B7)
    beam('c', trussPts[1], t < 150.2 ? [RX + 6 * Math.sin(t * 1.2), SY, RZ - 8] : [ppos[0], SY, ppos[2]], 4, .17);
    // the OK avalanche (instanced; 152.8–156.6): a heap over Pip that blasts outward on BURY
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
    pose(P, pp); put(P, ...ppos, pry);
    put(clawdPose(C, cp), cpos[0], cpos[1], cpos[2], cry, cs);
    // B5 crown on Clawd (my own Clawd key 'c07', so no other chapter ever sees it); it flies off on "Nah"
    if (t > 158.22 && t < NAH + .5) put(keep('c07-crown', crown), cpos[0], cpos[1] + 6.55 * cs + (t > NAH ? 7 * (t - NAH) : 0), cpos[2], t * .3 + (t > NAH ? (t - NAH) * 8 : 0));
  }

  shots([[138.11, chorus], [147.45, verse]]);
})();
