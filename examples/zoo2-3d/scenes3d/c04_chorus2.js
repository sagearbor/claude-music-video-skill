// c04_chorus2.js: chorus 2, 76.83–96.38 s, the STAGE again, escalated at dusk (WORLD.LOOK.stage2).
// One continuous camera path. Hits (beat grid + onset scan of 76.5–97 s):
//   drop 76.83 (Fz lands: bump + flash) · Nah! ×3 at bt(120.5) 77.18, bt(121.5) 77.82, bt(122.5) 78.45: Pip RUNS to each of
//     Clawd's three new gold doors (an arc around him) and his right foot hits each one on its Nah!; the door bursts into gold shards
//   the crowd runs in from both wings and hops up onto the stage 78.25–80.5 · cage / grave / pill on bt(124–126) → unison dodges
//   big perc hits → brick fireworks · second Nah! set bt(136.5–138.5) → Clawd's ZOO / DOOM / BLISS cards blow away
//   prophecy scroll unrolls 88.8, TEARS on 90.15 ("here comes the plot twist"), everyone spins 90.57–91.2
//   "got a pen" (pencil up) · "got a plan" (pencil to the temple) · "seeds in the pack": Pip picks his backpack up off the
//     stage and four neighbours toss seed packets into it on the half-beats · "so we write back!": every pencil up.
// Continuity: every override is a weighted blend (no pose snaps); props arrive physically (ear → hand, pocket → hand,
// floor → hand, thrown hand → pack) or leave under cover (shard bursts, shrinking into the pack / into the distance).
(() => {
  const T0 = 76.83, T1 = 96.38, NAH1 = [bt(120.5), bt(121.5), bt(122.5)], NAH2 = [bt(136.5), bt(137.5), bt(138.5)];
  const TEAR = 90.15, SPIN0 = 90.57, SPIN1 = 91.2, TAU = Math.PI * 2;
  const G = (x, s) => Math.exp(-(x / s) * (x / s));                    // a smooth bump
  const win = (t, a, b, r = .14) => ease(seg(t, a - r, a + r)) * (1 - ease(seg(t, b - r, b + r)));   // smooth on/off window
  // weighted blend of pose layers [[w, pose], ...]: numbers average by weight; faces/held props come from the heaviest layer
  function mix(layers) {
    const L = layers.filter(([w]) => w > 1e-4); if (!L.length) return {};
    const out = {}, tot = L.reduce((s, [w]) => s + w, 0), keys = new Set(L.flatMap(([, p]) => Object.keys(p)));
    for (const k of keys) { const nums = L.filter(([, p]) => typeof p[k] === 'number');
      if (nums.length) out[k] = L.reduce((s, [w, p]) => s + w * (typeof p[k] === 'number' ? p[k] : 0), 0) / tot;
      else { let best = -1; for (const [w, p] of L) if (p[k] !== undefined && w > best) { best = w; out[k] = p[k]; } } }
    return out;
  }

  // ---------- the doors: an arc around Pip, facing him ----------
  const DC = [0, -2], DR = 5.5, DOOR_A = [-70, 0, 70].map(a => a * Math.PI / 180);
  const DOORS = DOOR_A.map((a, i) => {
    const d = [Math.sin(a), -Math.cos(a)], face = [DC[0] + d[0] * DR, DC[1] + d[1] * DR];     // panel centre, on the ring
    const ry = Math.atan2(-d[0], -d[1]);                                                       // local +z (door front) faces the centre
    const origin = [face[0] - 2 * Math.cos(ry), face[1] + 2 * Math.sin(ry)];                    // the hinge (panel centre is local x = 2)
    return { i, d, face, ry, origin, hit: NAH1[i], col: ['#c8a24a', '#8a2a3a', '#f0a8c8'][i], label: ['ZOO', 'DOOM', 'BLISS'][i],
      target: [face[0] - d[0] * .2, .8 + 1.74, face[1] - d[1] * .2] };   // .8 stage + the toe's height at full kick                          // the kick spot on the panel's front
  });
  const doorUnitC = i => keep('c04doorunit' + i, () => { const D = DOORS[i], u = doorUnit(D.col, COL.gold);
    const lab = sign('c04doorlab' + i, [D.label], { w: 3.2, h: 1.1, bg: COL.gold, fg: '#3a2a10', size: 110 }).clone(); lab.position.set(2, 7.9, .3); u.userData.hinge.add(lab); return u; });
  // shard bursts (doors exploding into gold bricks; fireworks): instanced pieces, pure function of time since the burst
  function burst(key, t, tb, at, col, o = {}) {
    const u = t - tb, life = o.life ?? 1.4; if (u < 0 || u > life) return;
    const n = o.n ?? 30, g = keep('c04burst' + key, () => { const im = new THREE.InstancedMesh(partGeo(o.part || '3005'), o.glow ? glowMat(col, 3) : plastic(col), n); im.frustumCulled = false; im.castShadow = !o.glow; const gg = new THREE.Group(); gg.add(im); gg.userData.im = im; return gg; });
    const im = g.userData.im, M = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), k = easeOut(u / .5), s = (o.size ?? .7) * (1 - u / life);
    for (let i = 0; i < n; i++) {
      const a = hash(i + tb * 13) * TAU, b = Math.acos(2 * hash(i * 3 + tb * 7 + 1) - 1), r = (o.r ?? 6) * k * (.6 + .4 * hash(i + 9));
      M.compose(new THREE.Vector3(Math.sin(b) * Math.cos(a) * r, Math.cos(b) * r * (o.flat ?? 1) - (o.g ?? 6) * u * u, Math.sin(b) * Math.sin(a) * r), q.setFromEuler(e.set(u * 7 + i, u * 5 + i, 0)), new THREE.Vector3(s, s, s)); im.setMatrixAt(i, M);
    }
    im.instanceMatrix.needsUpdate = true; put(g, at[0], at[1], at[2], 0, Math.max(.01, Math.min(1, u / .18) * Math.min(1, (life - u) / .3)));   // grows in, shrinks out: no pop
  }
  const FIREWORKS = [[76.83, -6, 20, '#ff5a8a'], [77.18, -16, 17, '#ffd23a'], [77.82, 2, 21, '#5ad8ff'], [78.45, 14, 18, '#ff7a3a'], [79.75, -10, 22, '#b28aff'],
    [81.03, 10, 19, '#7aff8a'], [82.58, -14, 21, '#ff5a8a'], [83.23, 6, 23, '#ffd23a'], [85.79, -4, 22, '#5ad8ff'], [86.11, 12, 20, '#ff5a8a'],
    [87.39, -12, 18, '#ffd23a'], [88.03, 0, 21, '#ff7a3a'], [88.67, 12, 19, '#5ad8ff'], [90.15, -8, 22, '#ffffff'], [90.57, 8, 22, '#ffd23a'],
    [93.45, -2, 22, '#7aff8a'], [94.73, -14, 19, '#ff5a8a'], [95.38, 0, 24, '#ffd23a'], [95.38, 14, 21, '#5ad8ff']];

  // ---------- the scoreboard egg: one board, its face redrawn per value (no swapping objects) ----------
  const SB_TEX = new Map();
  const sbTex = v => { if (!SB_TEX.has(v)) SB_TEX.set(v, signTexture(['P(DOOM)', v + '%'], { bg: '#101418', fg: '#ff8a3a', font: 'ui-monospace, monospace', size: 210, pw: 1024, ph: 640 })); return SB_TEX.get(v); };
  const scoreboard = () => keep('c04scoreboard', () => { const g = new THREE.Group(), l = []; for (let r = 1; r <= 7; r++) for (const x of [-3.6, 3.6]) l.push(['3005', COL.dkgrey, x, r * 1.2, 0]); g.add(build(l));
    const face = new THREE.MeshStandardMaterial({ map: sbTex(42), emissive: '#ffffff', emissiveMap: sbTex(42), emissiveIntensity: .55, roughness: .6 });
    const b = new THREE.Mesh(new THREE.BoxGeometry(9, 5.6, .4), [matte('#2a2a30'), matte('#2a2a30'), matte('#2a2a30'), matte('#2a2a30'), face, matte('#2a2a30')]); b.position.y = 8.4 + 2.8; b.castShadow = true; g.add(b); g.userData.face = face; return g; });

  // ---------- props ----------
  const backpack = () => keep('c04pack', () => { const g = new THREE.Group(), b = build([['3003', '#c86a2a', 0, 0, 0], ['3003', '#c86a2a', 0, 1.2, 0], ['3022', '#8a4a1a', 0, 1.6, 0]]); b.scale.setScalar(.55); b.position.set(0, -.9, .1); g.add(b);   // bag spans 1.56 → .02 below the handle
    const strap = new THREE.Mesh(new THREE.TorusGeometry(.45, .08, 6, 16, Math.PI), plastic('#5a3a1a')); strap.position.set(0, -.4, .1); g.add(strap); return g; });
  const PACK_FLOOR = [1.32, 2.36, 3.04];   // = Pip's left hand at the bottom of his crouch (measured); the pack's base then sits on the stage   // where the pack rests on the stage (origin = handle), beside Pip
  const SEEDS = [92.82, 93.14, 93.46, 93.78];
  const seedPacket = i => keep('c04seed' + i, () => { const m = new THREE.Mesh(new THREE.BoxGeometry(.9, 1.2, .12), new THREE.MeshStandardMaterial({ map: signTexture(['SEEDS'], { bg: ['#7fd06a', '#f2cd37', '#ff9a6a', '#9fc3e9'][i], size: 120, pw: 256, ph: 340 }), roughness: .6 })); m.castShadow = true; const g = new THREE.Group(); g.add(m); return g; });
  const THROWS = [{ make: () => { const g = new THREE.Group(), c = cage(); c.scale.setScalar(.45); c.position.y = -1.5; g.add(c); return g; }, at: bt(124), s: .6 },
    { make: () => gravestone(), at: bt(125), s: .6 }, { make: () => pill(), at: bt(126), s: .9 }];
  const PROPH_TEX = () => keep('c04prophtex', () => signTexture(['PROPHECY', '1. humans: zoo', '2. or: doom', '3. or: bliss', 'THE END'], { bg: '#F6EED8', fg: '#3a2a1a', size: 72, pw: 512, ph: 720 }));
  function prophecyGeo(k, w, h) { return scroll(k, w, h); }

  // ---------- the crowd ----------
  const N_CROWD = 18;
  const CROWD = Array.from({ length: N_CROWD }, (_, i) => {
    const row = i < 6 ? 0 : i < 12 ? 1 : 2, k = i % 6, x = (k - 2.5) * 4.2 + (row % 2) * 2.0, side = x >= 0 ? 1 : -1;
    const tIn = 78.25 + (k * 3 % 6) * .14 + row * .22, x0 = side * 31, dur = Math.abs(x0 - x) / 9.5;
    return { i, x, z: [-2.6, -5.0, -7.4][row], x0, tIn, tArr: tIn + dur, move: ['sway', 'floss', 'disco', 'dab', 'runningMan', 'robot', 'wave', 'headbang', 'sprinkler'][(i * 5) % 9],   // no bounce/clap: their beat pump jumps a held prop
      seed: i < 4 ? i : -1 };   // the front four carry a seed packet in their left hand
  });
  const stageY = x => { const a = Math.abs(x); if (a >= 15.5) return 0; if (a <= 13) return .8; const k = (15.5 - a) / 2.5; return .8 * k + .9 * Math.sin(Math.PI * k); };   // hop up at the wings
  const hopping = x => { const a = Math.abs(x); return a > 13 && a < 15.5; };

  // ---------- the stage extras for this chapter (the stage set itself belongs to c02) ----------
  district('stage-c04', { at: [0, 0], r: 90 }, t => {
    if (t < T0 - 2.5 || t > T1 + 1.5) return;
    const nahs = [...NAH1, ...NAH2].filter(h => t >= h).length, v = 42 - nahs * 6 - (t > TEAR ? 4 : 0);
    const sb = scoreboard(); sb.userData.face.map = sbTex(v); sb.userData.face.emissiveMap = sbTex(v); put(sb, 17, 0, -13, -.3);
    for (const sx of [-1, 1]) {
      put(keep('c04tower' + sx, () => { const l = []; for (let r = 1; r <= 12; r++) l.push(['3005', COL.dkgrey, 0, r * 1.2, 0]); return build(l); }), sx * 19, 0, -4);
      const lamp = keep('c04lamp' + sx, () => { const m = new THREE.Mesh(new THREE.CylinderGeometry(.9, .6, 1.2, 16), glowMat('#fff2c0', 2).clone()); const g = new THREE.Group(); g.add(m); return g; });
      lamp.children[0].material.emissiveIntensity = 1.5 + 2 * pulse(t, 5); put(lamp, sx * 19, 15.2, -4);
    }
    // Clawd's three gold doors stand waiting (before the drop too); each bursts into gold bricks when Pip's foot hits it
    DOORS.forEach(D => { const gone = seg(t, D.hit, D.hit + .3); if (gone < 1) { const u = doorUnitC(D.i); doorPose(u, .08 * pulse(t, 4) * (1 - gone), 0, D.i + 7); put(u, D.origin[0], .8, D.origin[1], D.ry, Math.max(.01, 1 - gone)); }
      burst('door' + D.i, t, D.hit, [D.face[0], .8 + 3.6, D.face[1]], COL.gold, { n: 34, r: 7, g: 7, size: .9 }); burst('doorc' + D.i, t, D.hit + .02, [D.face[0], .8 + 3.2, D.face[1]], D.col, { n: 20, r: 6, g: 7, size: .9 }); });
    if (t < 92.5) put(backpack(), ...PACK_FLOOR, -.4);   // resting on the stage until Pip picks it up (the shot holds it from then on)
    FIREWORKS.forEach(([tb, x, y, col], j) => burst('fw' + j, t, tb, [x, y, -16], col, { glow: true, part: '6141', n: 36, r: 12, g: 4, size: 2.6, life: 1.6, flat: .9 }));
  });

  // ---------- the shot ----------
  const NE = { easeEnds: false };
  // stand so the RIGHT toe (local x -.525) lands on the target: back off by the reach, shift by the toe's sideways offset
  const stance = D => { const ry = Math.atan2(D.d[0], D.d[1]); return [D.target[0] - D.d[0] * KICK_REACH + .525 * Math.cos(ry), D.target[2] - D.d[1] * KICK_REACH - .525 * Math.sin(ry)]; };
  const SA = stance(DOORS[0]);   // at the drop Pip is already striding toward door A
  const posK = [[T0 - .5, [SA[0] + 1.6, SA[1] + 3.2]], [T0, [SA[0] + .7, SA[1] + 1.4]], ...DOORS.map(D => [D.hit, stance(D)]), [79.3, [0, 3.0]], [80, [0, 3.0]]];
  const ryA = DOORS.map(D => Math.atan2(D.d[0], D.d[1])); ryA[1] = -Math.PI; ryA[2] -= TAU;            // keep the turn continuous
  const ryK = [[T0 - .5, -.6], [T0, -1.2], [NAH1[0], ryA[0]], [NAH1[1], ryA[1]], [NAH1[2], ryA[2]], [79.3, -TAU], [80, -TAU]];
  // distance run along Pip's kick path (the run's leg phase follows it: feet don't slide); tabulated once
  const D0 = T0 - .5, DIST = (() => { const out = [0]; let prev = path(D0, posK, NE), d = 0; for (let i = 1; i <= 24 * 3.8; i++) { const c = path(D0 + i / 24, posK, NE); d += Math.hypot(c[0] - prev[0], c[1] - prev[1]); out.push(d); prev = c; } return out; })();
  const distAt = t => { const x = clamp((t - D0) * 24, 0, DIST.length - 1), i = Math.floor(x); return lerp(DIST[i], DIST[Math.min(i + 1, DIST.length - 1)], x - i); };
  const speedAt = t => t > 79.6 ? 0 : (distAt(t + 1 / 48) - distAt(t - 1 / 48)) * 24;
  const dodgeT = [{ lean: -.55, armL: 1.2, armR: 1.2, bodyY: -.3 }, { bodyY: -1.3, legL: 1.95, legR: 1.95, lean: .35 }, { bodyRoll: .45, armL: 2.2 }];   // the duck bends the knees more than it drops (never straight-legged below the floor)
  const TAKE = 81.12, PICK = 92.5;

  function chorus2(t, lt) {
    // ===== Pip =====
    const P = fig('pip', PIP);
    const [px, pz] = t < 80 ? path(t, posK, NE) : [0, 3.0], pry = t < 80 ? path(t, ryK, NE) : -TAU;
    const kickW = Math.min(1, NAH1.reduce((s, h) => s + G(t - h, .16), 0));
    const kickLeg = NAH1.reduce((s, h) => s + 1.45 * G(t - h, .085) - .4 * G(t - h + .17, .07), 0);
    const runW = Math.min(1, speedAt(t) / 3) * (1 - kickW) * win(t, T0 - 1, 79.6);
    const pKick = { legR: kickLeg, armL: .7, armR: -.5, lean: -.18, face: 'angry' };
    const pRun = { ...run(distAt(t) / STRIDE * .8), face: 'determined' };
    const pStand = { ...dance('sway', t), face: 'determined' };
    const dodgeW = THROWS.map(th => G(t - th.at, .2) * win(t, 79.0, 81.2));
    const hasPen = t >= TAKE;
    const pTake = { armR: 2.75, armRz: .45, head: .35, headTilt: -.1, face: 'smug' };
    const pRap = { bodyY: .18 * (.5 - .5 * Math.cos(beatPh(t) * TAU)), headTilt: -.1 * Math.sin(beatPh(t) * TAU), armL: .7 + .25 * Math.sin(beatPh(t) * TAU), armR: 1.55, face: beatPh(t) < .5 ? 'sing' : 'joy' };
    const pWrite = h => ({ ...writeBack(t, h), face: t > h ? 'joy' : 'determined' });
    const pDisco = { ...dance('disco', t), face: t > TEAR ? 'laugh' : 'smug' };
    const pNah = { armR: 2.4, armRz: .6, armL: 2.4, armLz: .5, face: 'angry' };
    const nahW = NAH2.map(h => G(t - h, .14) * win(t, 86.97, 89.2));
    const pPen = { armR: 2.7, armL: .3, face: 'determined', head: -.1 };
    const pPlan = { armR: 2.3, armRz: -.55, head: .25, headTilt: .1, face: 'smug' };
    const pCrouch = { bodyY: -.55, legL: .85, legR: .85, lean: .45, armL: .1, armLz: -.45, armR: 1.2, face: 'determined' };
    const pCatch = { armL: 1.05, armR: 1.0, face: 'joy', head: -.15 };
    const pSwing = { armL: 2.6, armLz: .2, armR: 1.4, face: 'laugh' };
    const early = win(t, T0 - 1, 79.4), standEarly = Math.max(0, 1 - runW - kickW) * early;
    const midStand = win(t, 79.4, 81.0) * Math.max(0, 1 - dodgeW.reduce((a, b) => a + b, 0));
    const P_ = mix([
      [runW, pRun], [kickW * early, pKick], [standEarly, pStand], [midStand, pStand],
      ...dodgeT.map((p, i) => [dodgeW[i], { ...pStand, ...p, face: 'shocked' }]),
      [win(t, 81.0, 81.3, .1), pTake], [win(t, 81.3, 84.0), pRap], [win(t, 84.0, 86.97), pWrite(85.79)],
      [win(t, 86.97, 91.2) * Math.max(0, 1 - nahW.reduce((a, b) => a + b, 0)), pDisco], ...nahW.map(w => [w, pNah]),
      [win(t, 91.2, 91.9, .1), pPen], [win(t, 91.9, 92.3, .1), pPlan], [win(t, 92.3, 92.7, .12), pCrouch], [win(t, 92.7, 93.9, .12), pCatch], [win(t, 93.9, 94.23, .1), pSwing],
      [win(t, 94.23, T1 + 1), pWrite(95.38)],
    ]);
    P_.bodyYaw = TAU * ease(seg(t, SPIN0, SPIN1));                         // the plot-twist spin (one smooth turn)
    P_.holdR = hasPen ? heldPencil() : null;
    if (t >= PICK) { const bp = backpack(); bp.position.set(0, 0, 0); bp.rotation.set(0, 0, 0); bp.scale.setScalar(1); P_.holdL = bp; } else P_.holdL = null;
    pose(P, P_); if (P.userData.J.earPencil) P.userData.J.earPencil.visible = !hasPen;
    put(P, px, .8, pz, pry);
    // contact assertions: the kicking foot on each door, the hand at the ear for the pencil, the hand at the pack
    DOORS.forEach(D => { if (Math.abs(t - D.hit) < .021) expect('pip kicks door ' + D.label, limb(P, 'footR'), D.target, .6); });
    if (Math.abs(t - TAKE) < .021) expect('pip takes the pencil from behind his ear', limb(P, 'handR'), limb(P, 'head'), 1.6);
    if (Math.abs(t - PICK) < .021) expect('pip grabs the backpack', limb(P, 'handL'), PACK_FLOOR, .9);

    // ===== the crowd =====
    CROWD.forEach(c => {
      const f = fig('c04crowd' + c.i, crowdLook(c.i + 2));
      const s = stepTo(t, [[c.tIn, [c.x0, c.z]], [c.tArr, [c.x, c.z]]], { run: true, face: 0 }), arrived = ease(seg(t, c.tArr - .1, c.tArr + .3));
      const ryRun = c.x0 > 0 ? -Math.PI / 2 : Math.PI / 2;   // facing the way they run (stepTo would snap to `face` on arrival)
      const tuck = hopping(s.x) ? .7 * Math.sin(Math.PI * (15.5 - Math.abs(s.x)) / 2.5) : 0;   // knees up during the hop onto the stage
      const base = mix([[1 - arrived, { ...s.pose, legL: (s.pose.legL || 0) + tuck, legR: (s.pose.legR || 0) + tuck, face: 'joy' }], [arrived, crowdDance(c.i, t, [c.move])]]);
      const dW = THROWS.map(th => G(t - th.at - (c.i % 3) * .03, .2) * arrived);
      const pocket = G(t - 83.92 - (c.i % 4) * .03, .12), penIn = seg(t, 83.86 + (c.i % 4) * .03, 84.12 + (c.i % 4) * .03);
      const wb = win(t, 84.02, 86.97) + win(t, 94.23, T1 + 1);
      const nW = Math.min(1, NAH2.reduce((a, h) => a + G(t - h, .13), 0)) * arrived;
      const p = mix([[Math.max(0, 1 - dW.reduce((a, b) => a + b, 0) - pocket - wb - nW), base],
        ...dodgeT.map((d, i) => [dW[i], { ...base, ...d, face: 'shocked' }]),
        [pocket, { ...base, armR: -.55, armRz: .25, face: 'smug' }],
        [wb * (1 - pocket), { ...base, ...writeBack(t + (c.i % 4) * .04, t < 90 ? 85.79 : 95.38), face: 'joy' }],
        [nW, { ...base, armR: 2.5, armRz: .4, armL: 2.5, armLz: .4, bodyY: .35, face: 'angry' }]]);
      p.bodyYaw = TAU * ease(seg(t, SPIN0 + (c.i % 3) * .04, SPIN1 + (c.i % 3) * .04)) * arrived;
      // pencils slide out of the back pocket (scaled up from nothing while the hand is at the pocket), then stay in hand
      if (penIn > 0) { const pen = heldPencil('c04c' + c.i); pen.scale.setScalar(Math.max(.02, penIn)); p.holdR = pen; } else p.holdR = null;
      // the front four carry a seed packet in their left hand until they toss it into Pip's pack
      p.holdL = c.seed >= 0 && t < SEEDS[c.seed] - .4 ? seedPacket(c.seed) : null;
      if (p.holdL) { p.holdL.position.set(0, 0, 0); p.holdL.rotation.set(0, 0, 0); p.holdL.scale.setScalar(1); }
      pose(f, p); put(f, s.x, stageY(s.x), s.z, ryRun * (1 - arrived) + (-c.x * .03) * arrived);
    });
    // seed packets: tossed from each neighbour's hand into the pack (a handoff on an arc), then they sink into it
    SEEDS.forEach((ts, i) => { const c = CROWD[i], t0 = ts - .4; if (t < t0 || t > ts + .32) return;
      const f = fig('c04crowd' + c.i, crowdLook(c.i + 2)), hand = limb(f, 'handL'), packAt = limb(P, 'handL');
      const at = handoff(t, t0, ts, hand, [packAt[0], packAt[1] - .3, packAt[2]], 2.2), s = seedPacket(i), sink = 1 - seg(t, ts, ts + .3);
      put(s, at[0], at[1] - .5 * (1 - sink), at[2], (t - t0) * 9, Math.max(.01, sink)); s.rotation.x = (t - t0) * 6;
      if (Math.abs(t - ts) < .021) expect('seed packet ' + i + ' lands in the pack', at, packAt, 1.2); });
    // throws (cage, gravestone, pill) sail in from off-screen right, over the crowd, and shrink away into the distance
    THROWS.forEach((th, i) => { const o = keep('c04throw' + i, th.make), k = seg(t, th.at - .8, th.at + .8); if (k <= 0 || k >= 1) return;
      put(o, lerp(34, -8 + i * 6, k), lerp(7, 3, k) + 7 * Math.sin(k * Math.PI), lerp(34, -40, k), k * 6, Math.max(.01, th.s * (1 - ease(seg(k, .82, 1))))); o.rotation.x = k * 7; });

    // ===== Clawd: walks on with the rolled prophecy, pulls three cards from behind his back, then the scroll tears =====
    if (t >= 84.5) {
      const C = clawd('c', {}), cs = stepTo(t, [[84.5, [27, -1.5]], [86.2, [9.5, -1.5]]], { face: -.5 }), walking = t < 86.2;
      const torn = t > TEAR, sh = torn ? shake(t, .35 * Math.exp(-(t - TEAR) * 5)) : [0, 0, 0];
      clawdPose(C, { face: torn ? 'shocked' : t > 89.5 ? 'fear' : t > 86.97 ? 'smug' : 'neutral', hat: 'headset', armL: .9, armR: .9, walk: walking ? t * 3 : null, bob: .2 * pulse(t, 6), roll: sh[0] * .06 });
      const cx = cs.x, cry = lerp(-Math.PI / 2, -.5, ease(seg(t, 85.9, 86.4))); put(C, cx + sh[0], .8, -1.5, cry);
      [['ZOO', '#3a9c98'], ['DOOM', '#8a2a3a'], ['BLISS', '#e86aa0']].forEach(([lab, col], i) => {
        const h = NAH2[i], up = ease(seg(t, h - .6, h - .25)), gone = seg(t, h, h + 1.0); if (up <= 0 || gone >= 1) return;
        const cd = keep('c04card' + lab, () => { const g = new THREE.Group(); g.add(sign('c04cardsign' + lab, [lab + '?'], { w: 5, h: 3.2, bg: col, fg: '#fff', size: 170 }).clone()); return g; });
        const sc = Math.max(.02, up) * (1 - ease(seg(gone, .55, 1)));    // pulled out from behind Clawd; shrinks away as it flies off
        put(cd, cx - 3.4 * up + gone * (6 + i * 3), .8 + 5.4 * up - 1.6 * (1 - up) + gone * 9, -2.6 + 3.2 * up + gone * 4, -.45 + gone * 5, Math.max(.01, sc)); cd.rotation.z = gone * 4;
      });
      // the prophecy: rolled up beside Clawd as he walks on, unrolls 88.8, tears on 90.15; the halves tumble and shrink away
      const un = ease(seg(t, 88.8, 89.4)), sx = cx - 3.6;
      if (!torn) { const s = keep('c04scroll', () => new THREE.Mesh(prophecyGeo(1, 4.4, 6.2), new THREE.MeshStandardMaterial({ map: PROPH_TEX(), side: THREE.DoubleSide, roughness: .8 })));
        s.geometry.dispose(); s.geometry = prophecyGeo(.05 + .95 * un, 4.4, 6.2); s.castShadow = true; put(s, sx, .8 + 6.0, .4, -.55); }
      else for (const sd of [-1, 1]) { const u = t - TEAR; if (u > 1.7) continue;
        const h = keep('c04half' + sd, () => { const g = new THREE.Group(), geo = new THREE.PlaneGeometry(2.2, 6.2), uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, sd < 0 ? uv.getX(i) * .5 : .5 + uv.getX(i) * .5);
          const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: PROPH_TEX(), side: THREE.DoubleSide, roughness: .8 })); m.position.set(sd * 1.1, -3.1, 0); m.castShadow = true; g.add(m); return g; });
        put(h, sx + sd * (5 * u), .8 + 9.1 + 3 * u - 4 * u * u, .4 + 2 * u, -.55 + sd * u * 3, Math.max(.01, 1 - ease(seg(u, 1.1, 1.7)))); h.rotation.z = sd * u * 2.5; h.rotation.x = u * 1.5; }
    }

    // ===== camera: one continuous path, Fz.B → … → F2.A at 95.60 =====
    const B = WORLD.F.Fz.B, A = WORLD.F.F2.A;
    const cK = [[76.83, B.pos], [77.5, [-4, 4.8, 17]], [78.75, [-6, 4.6, 16]], [80.4, [10, 4.2, 19]], [82.6, [3, 3.2, 15]], [84.6, [-3, 3.6, 15]], [86.3, [0, 8, 30]], [87.8, [5, 5.5, 22]],
      [89.4, [6, 5.5, 20]], [90.45, [8, 6.2, 22]], [91.2, [2, 4.6, 14]], [93.4, [-1, 4.0, 13]], [94.9, [-.5, 10, 26]], [95.6, A.pos]];
    const lK = [[76.83, B.look], [77.5, [-1.5, 3.4, -4.5]], [78.75, [1, 3.4, -3]], [80.4, [0, 4, -2]], [82.6, [0, 4.6, 1]], [84.6, [0, 4.6, 0]], [86.3, [0, 10, -8]], [87.8, [5, 6, -1]],
      [89.4, [4.5, 6.4, 0]], [90.45, [5.2, 6.8, 0]], [91.2, [-.5, 4.4, 3]], [93.4, [.3, 3.4, 3]], [94.9, [0, 7.4, 0]], [95.6, A.look]];
    const fK = [[76.83, B.fov], [80.4, 36], [82.6, 32], [86.3, 44], [87.8, 36], [89.4, 34], [90.45, 38], [91.2, 30], [93.4, 32], [95.6, A.fov]];
    let pos = path(t, cK, NE), lk = path(t, lK, NE), fov = path(t, fK, NE);
    const d = drift(lt, .5 * seg(t, T0, T0 + 1) * (1 - seg(t, 95.0, 95.6))), land = WORLD.landing(t, T0);
    let hs = [0, 0, 0];
    for (const h of [...NAH1, ...NAH2, TEAR, 85.79, 95.38]) if (t > h && t < h + .6) { const s = shake(t, .28 * Math.exp(-(t - h) * 8)); hs = hs.map((v, j) => v + s[j]); }
    pos = pos.map((v, j) => v + d[j] + land.shake[j] + hs[j]); lk = lk.map((v, j) => v + (land.shake[j] + hs[j]) * .3);
    cam({ pos, look: lk, fov, blur: .8, focus: [px, 4, pz] });
    look({ ...WORLD.LOOK.stage2 });
    if (t >= WORLD.F.F2.t0) { WORLD.apply(WORLD.flight('F2', t)); cam({ blur: .4 }); }
    if (land.flash > 0) hud(ctx => { ctx.fillStyle = `rgba(255,255,255,${land.flash})`; ctx.fillRect(0, 0, W, H); });
  }
  // "so we WRITE BACK": pencils thrust up on the hit, then scribble in the air
  function writeBack(q, hit) { const up = ease(seg(q, hit - .3, hit)), sc = ease(seg(q, hit, hit + .2)); return { armR: lerp(1.0, 2.8, up) + .25 * sc * Math.sin(q * 18), armRz: .15 * sc * Math.sin(q * 14), armL: .4, bodyY: .3 * up * pulse(q, 5) }; }

  shots([[T0, chorus2]]);
})();
