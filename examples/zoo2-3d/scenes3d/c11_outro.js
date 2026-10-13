// c11_outro.js: 249.41–269.61 s. The desk again, at night: a rhyme with the opening. Pip takes the desk and writes the ending.
//   249.41  (F6 flight, moon → desk, until 250.60) "We're sorry. That ending... could not be found."  Clawd at the desk, headset
//           glitching (face 'glitch'/'x', sparks); the monitor flickers ENDING NOT FOUND (c00's desk district, night mode)
//   252.8   Pip walks in from the left (off-screen); Clawd steps aside to the right of the desk
//   254.44  "Please... write... your own."  Pip sits; at 256.5 his hand goes to his ear and takes the pencil
//   257.47  "Already on it."  Pip flourishes the pencil with a wink; Clawd's hand meets the desk lamp, lifts it, it lights
//   258.3+  Pip WRITES (pencil point down, tip on the page); neighbours wave goodnight then walk off; the robots doze;
//           slow push in; the iris closes on the pencil tip (fully black at 269.4)
// Contacts: hand at the ear for the pencil grab, Clawd's hand on the lamp at pickup, the pencil tip on the page while writing.
(() => {
  const DK = WORLD.D.desk, at = (dx, dy, dz) => WORLD.at('desk', dx, dy, dz), F6 = WORLD.F.F6;
  const SIT0 = 255.3, SIT1 = 256.1, TGRAB = 256.5, WINK = 257.47, LIFT = 258.4, WRITE = 258.3, IRIS0 = 266.4, IRIS1 = 269.4;
  const PIPZ = -2.4, PAGE_Y = 3.31, NB = [.1, 3.28, -.7];          // Pip's seat z (desk-relative), page top height, notebook centre
  const LAMP0 = [3.9, 3.2, -.2];                                    // the lamp's spot on the desk (desk-relative; base on the top)
  const PEN_S = .55, PEN_TIP = 2.84 * PEN_S, PEN_OFF = .6 * PEN_S / .42 + .3;   // writing grip: tip = grip + (0, PEN_OFF - PEN_TIP, 0)
  const D = (x, y, z) => [DK[0] + x, y, DK[1] + z];
  const notebook = () => { const g = new THREE.Group();
    for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(1.3, .06, 1.7), PAPER()); p.position.set(s * .66, 0, 0); p.rotation.z = -s * .06; p.castShadow = true; g.add(p); }
    const cover = new THREE.Mesh(new THREE.BoxGeometry(2.8, .05, 1.85), plastic(COL.red)); cover.position.y = -.05; g.add(cover); return g; };
  const pen = () => { const g = new THREE.Group(), inner = new THREE.Group(); inner.add(pencil(PEN_S)); g.add(inner); g.userData.inner = inner; return g; };
  const _m = new THREE.Matrix4(), _p = new THREE.Vector3(), _q = new THREE.Quaternion(), _s = new THREE.Vector3();
  function placeWorld(o, M) { M.decompose(_p, _q, _s); o.position.copy(_p); o.quaternion.copy(_q); o.scale.copy(_s); }

  // the clip assistant's line changes for the ending (grows in over the egg's own sign, same spot)
  district('desk-c11', { at: DK, r: 700 }, t => {
    const k = ease(seg(t, 249.0, 249.6)); if (k < .001) return;
    const x = DK[0] + 8.5, z = DK[1] + 1.5, ry = -.35;
    put(sign('c11-clip', ["It looks like you're", 'writing an ending.', 'Need help?'], { w: 6.1, h: 2.7, bg: '#ffffcc', size: 66 }), x + 4.5 * Math.cos(ry) + .3 * Math.sin(ry), 3, z - 4.5 * Math.sin(ry) + .3 * Math.cos(ry), ry, k);
  });

  // ---------- solved once: where the hand meets the ear, the arm that puts the pencil tip on the page, Clawd's lamp spot ----------
  let SOL = null;
  const SIT = { legL: 1.5, legR: 1.5, bodyY: .25 };
  function earPoint(P) { const J = P.userData.J; J.head.updateWorldMatrix(true, false); return J.head.localToWorld(new THREE.Vector3(-.72, -.42, -.6 + .9)).toArray(); }
  function tipOf(P) { const g = P.userData.J.gripR; g.updateWorldMatrix(true, false); return g.localToWorld(new THREE.Vector3(0, PEN_OFF - PEN_TIP, 0)).toArray(); }
  function solve(P, C) {
    if (SOL) return SOL;
    SOL = {};
    let best = 1.5, bd = 1e9;   // the arm that brings the hand nearest the ear (seated, head turned a little)
    for (let a = 1.2; a <= 3.2; a += .02) { pose(P, { ...SIT, armR: a, head: .25 }); put(P, DK[0], 0, DK[1] + PIPZ, 0); const h = limb(P, 'handR'), e = earPoint(P), d = Math.hypot(h[0] - e[0], h[1] - e[1], h[2] - e[2]); if (d < bd) { bd = d; best = a; } }
    SOL.earArm = best;
    const WBASE = { ...SIT, armL: .85, armLz: .15, headTilt: .38 };   // the writing arm: pencil tip at the page height
    best = .9; bd = 1e9;
    for (let a = .2; a <= 1.8; a += .01) { pose(P, { ...WBASE, armR: a }); put(P, DK[0], 0, DK[1] + PIPZ, 0); const d = Math.abs(tipOf(P)[1] - (PAGE_Y + .02)); if (d < bd) { bd = d; best = a; } }
    SOL.writeArm = best;
    clawdPose(C, { hat: 'headset', armL: -.9 }); put(C, 0, 0, 0, 0); const g = limb(C, 'handL'), L0 = D(...LAMP0);   // Clawd's stand: left hand on the lamp base
    SOL.clawdStand = [L0[0] - g[0], L0[2] - g[2]];
    return SOL;
  }

  const CAM = [[F6.t1, F6.B.pos], [254.2, at(-2.5, 6.2, 18.5)], [258.2, at(1.2, 5.8, 13)], [263.2, at(.6, 5.2, 8.5)], [269.61, at(.25, 4.7, 4.6)]];
  const LOOKP = [[F6.t1, F6.B.look], [254.2, at(0, 4.3, -1)], [258.2, at(0, 4.0, -1.5)], [263.2, at(0, 3.8, -1.3)], [269.61, at(.2, 3.55, -1.1)]];
  const FOV = [[F6.t1, F6.B.fov], [258.2, 32], [269.61, 30]];

  function outro(t, lt) {
    ROOT.matrix.identity(); ROOT.updateMatrixWorld(true);   // a stale flatten matrix from another chapter's frame must not skew limb()
    const q = t, P = fig('pip', PIP), C = clawd('c11', {}), SO = solve(P, C);
    // ---------- Clawd: glitching at the desk, steps aside, picks up the lamp, holds it over the notebook ----------
    const glitch = q < 254.6, cs = stepTo(q, [[254.6, [DK[0], DK[1] - 2.4]], [255.3, [SO.clawdStand[0], DK[1] - 2.4]], [255.9, [SO.clawdStand[0], SO.clawdStand[1]]]]);
    const jit = glitch ? [(hash(Math.floor(q * 14)) - .5) * .25, (hash(Math.floor(q * 14) + 9) - .5) * .12] : [0, 0];
    const reach = ease(seg(q, LIFT - .45, LIFT)), lift = ease(seg(q, LIFT, LIFT + .6));
    const armL = q < LIFT ? lerp(glitch ? .3 + .2 * Math.sin(q * 17) : .15, -.9, reach) : lerp(-.9, .55, lift);
    const moving = q > 254.6 && q < 255.9;
    clawdPose(C, { hat: 'headset', face: glitch ? (Math.floor(q * 6) % 5 ? 'glitch' : 'x') : q < WINK ? 'neutral' : 'joy', roll: glitch ? Math.sin(q * 23) * .04 : 0,
      walk: moving ? q * 3 : null, armL, armR: moving ? .7 : .15, bob: q > LIFT - .5 && q < LIFT + .1 ? 0 : .1 * pulse(t, 5) });
    put(C, cs.x + jit[0], 0, cs.z + jit[1], moving ? cs.ry : 0);
    // the lamp: on the desk until Clawd's hand meets it, then it travels with his hand (upright) and lights up
    const lamp = keep('c11-lamp', () => C00.lampObj());
    const onDesk = D(...LAMP0), inHand = limb(C, 'handL'), lp = q < LIFT ? onDesk : inHand;
    put(lamp, lp[0], lp[1], lp[2], 0); lamp.userData.light.intensity = 60 * ease(seg(q, LIFT, LIFT + .5));
    if (Math.abs(q - LIFT) < .021) expect('clawd takes the lamp', inHand, onDesk, .6);
    // glitch sparks: each one swells and shrinks through zero (no blinking on/off), fading out with the glitch
    const env = 1 - seg(q, 254.2, 254.7);
    if (env > 0) for (let s = 0; s < 4; s++) { const sk = keep('c11-spark' + s, () => new THREE.Mesh(new THREE.OctahedronGeometry(.18), glowMat(s % 2 ? '#7CE3FF' : '#FF5A4A', 3)));
      const sc = env * Math.max(0, Math.sin(q * 2.6 + s * 1.7)); if (sc > .001) put(sk, cs.x + (s < 2 ? -2.2 : 2.2) + .4 * Math.sin(q * 3 + s), 6 + .6 * Math.sin(q * 5 + s), cs.z + .3, q * 4, sc); }
    // ---------- Pip: walks in from the left, sits, takes the pencil from his ear, writes ----------
    const ps = stepTo(q, [[252.8, [DK[0] - 15, DK[1] - 3.6]], [254.9, [DK[0] - 1.2, DK[1] - 3.6]], [SIT0, [DK[0], DK[1] + PIPZ]]]);
    const sk = ease(seg(q, SIT0, SIT1));
    const toEar = q < TGRAB ? ease(seg(q, TGRAB - .45, TGRAB)) : 1 - ease(seg(q, TGRAB + .05, TGRAB + .55));
    const flourish = q > WINK - .1 && q < WINK + .8 ? Math.sin(Math.PI * seg(q, WINK - .1, WINK + .8)) : 0;
    const writing = q > WRITE, scrib = writing ? Math.sin(q * 22) : 0, wk = ease(seg(q, WRITE - .5, WRITE));
    const pp = q < SIT0 ? { ...ps.pose, face: 'determined' } : {
      legL: 1.5 * sk, legR: 1.5 * sk, bodyY: .25 * sk, armL: lerp(.2, .85, wk), armLz: .15 * wk, headTilt: lerp(.1 * sk, .38, wk), head: toEar > .1 ? .25 * toEar : writing ? .1 * Math.sin(q * .7) : 0,
      armR: lerp(lerp(.2, SO.earArm, toEar), SO.writeArm + .05 * scrib, q > TGRAB ? wk : 0) + 1.3 * flourish, armRz: .08 * scrib,
      face: flourish > .1 ? 'wink' : writing ? (Math.floor(q / 3) % 3 === 2 ? 'joy' : 'determined') : 'neutral' };
    pose(P, pp); P.userData.J.earPencil && (P.userData.J.earPencil.visible = false);
    put(P, ps.x, 0, ps.z, q < SIT0 ? ps.ry : lerp(ps.ry, 0, ease(seg(q, SIT0 - .3, SIT0 + .2))));
    // the pencil: one object, at the ear until the hand reaches it, then in the hand POINT DOWN (writing grip)
    const PEN = keep('c11-pen', pen), J = P.userData.J; J.head.updateWorldMatrix(true, true);
    put(PEN); PEN.userData.inner.position.set(0, 0, 0); PEN.userData.inner.rotation.set(0, 0, 0);
    // two world poses, ear and writing grip; around the grab the pencil travels between them (no jump between hand and ear)
    const mEar = J.head.matrixWorld.clone().multiply(new THREE.Matrix4().compose(new THREE.Vector3(-.72, -.42, -.6), new THREE.Quaternion().setFromEuler(new THREE.Euler(1.42, 0, .12)), new THREE.Vector3(.42 / PEN_S, .42 / PEN_S, .42 / PEN_S)));
    const mHand = J.gripR.matrixWorld.clone().multiply(new THREE.Matrix4().compose(new THREE.Vector3(0, PEN_OFF, 0), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, 0)), new THREE.Vector3(1, 1, 1)));
    const gk = ease(seg(q, TGRAB - .15, TGRAB + .15));
    if (gk <= 0) placeWorld(PEN, mEar); else if (gk >= 1) placeWorld(PEN, mHand);
    else { const a = [new THREE.Vector3(), new THREE.Quaternion(), new THREE.Vector3()], b = [new THREE.Vector3(), new THREE.Quaternion(), new THREE.Vector3()];
      mEar.decompose(...a); mHand.decompose(...b); PEN.position.copy(a[0].lerp(b[0], gk)); PEN.quaternion.copy(a[1].slerp(b[1], gk)); PEN.scale.copy(a[2].lerp(b[2], gk)); }
    if (Math.abs(q - TGRAB) < .021) expect('pip takes the pencil from his ear', limb(P, 'handR'), earPoint(P), .9);
    if (writing) { const tip = tipOf(P); expect('pencil tip on the page', tip, [clamp(tip[0], DK[0] + NB[0] - 1.25, DK[0] + NB[0] + 1.25), PAGE_Y, clamp(tip[2], DK[1] + NB[2] - .8, DK[1] + NB[2] + .8)], .3); }
    put(keep('c11-chair', () => build([['3005', COL.dkgrey, 0, 1.2, 0], ['3022', COL.dkgrey, 0, 1.6, 0], ['3010', COL.dkgrey, 0, 3.0, -1, 0], ['3010', COL.dkgrey, 0, 4.2, -1, 0]])), DK[0], 0, DK[1] + PIPZ - .2);
    put(keep('c11-nb', notebook), DK[0] + NB[0], NB[1], DK[1] + NB[2], .08);
    // the neighbours wave goodnight from the cubicle rows, then walk off sideways (out of the closing frame)
    for (let i = 0; i < 5; i++) {
      const f = fig('c11n' + i, crowdLook(i + 2)), bx = [-11, -7, 7, 11, 14][i], bz = [-5, -2.5, -2.5, -5, -1][i];
      const ws = stepTo(q, [[265.5 + i * .3, [DK[0] + bx, DK[1] + bz]], [268.5 + i * .3, [DK[0] + bx + Math.sign(bx) * 9, DK[1] + bz]]]), leaving = q > 265.5 + i * .3;
      pose(f, leaving ? { ...ws.pose, face: 'joy' } : { ...dance('wave', t, { offset: i * .4, side: i % 2 ? -1 : 1 }), face: i % 2 ? 'joy' : 'wink' });
      put(f, ws.x, 0, ws.z, leaving ? ws.ry : -Math.sign(bx) * .4);
    }
    // ---------- camera + look ----------
    if (t < F6.t1) WORLD.apply(WORLD.flight('F6', t));
    else {
      const p = path(t, CAM, { easeEnds: false }), l = path(t, LOOKP, { easeEnds: false }), dr = drift(lt, .35 * (1 - seg(t, 264, 269)));
      cam({ pos: [p[0] + dr[0], p[1] + dr[1], p[2] + dr[2]], look: l, fov: path(t, FOV, { easeEnds: false }), blur: .8, focus: at(0, 3.8, -1.2) });
      look({ ...WORLD.LOOK.night, keyInt: lerp(1.5, .9, seg(t, LIFT, LIFT + 2)), fill: .22, vignette: .5 });
    }
    // iris closes on the pencil tip (screen-projected every frame)
    if (t > IRIS0) {
      const r = (1 - easeIn(seg(t, IRIS0, IRIS1))) * 1400, tip = new THREE.Vector3(...tipOf(P));
      hud(ctx => { const v = tip.clone().project(window.__cam), cx = (v.x + 1) / 2 * W, cy = (1 - v.y) / 2 * H;
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.rect(0, 0, W, H); if (r > .5) ctx.arc(cx, cy, r, 0, Math.PI * 2, true); ctx.fill(); });
    }
  }
  shots([[249.41, outro]]);
})();
