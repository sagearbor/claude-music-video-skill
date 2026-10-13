// c11_outro.js: 249.41–269.61 s. The desk again, at night: a rhyme with the opening. Pip takes the desk and writes the ending.
//   249.41  (F6 flight, moon → desk, until 250.60) "We're sorry. That ending... could not be found."  Clawd at the desk, headset
//           glitching (face 'glitch', sparks); the monitor flickers ENDING NOT FOUND (drawn by c00's desk district at night)
//   254.44  "Please... write... your own."  Pip walks in; Clawd steps aside and offers the chair; Pip sits, pulls the pencil
//   257.47  "Already on it."  Pip flourishes the pencil with a wink; Clawd fetches the desk lamp and holds it over the notebook
//   258–269 Pip writes; neighbours wave goodnight from the cubicles; the robots doze; slow push in; iris closes on the pencil (269.4)
(() => {
  const at = (dx, dy, dz) => WORLD.at('desk', dx, dy, dz), F6 = WORLD.F.F6;
  const SIT0 = 255.3, SIT1 = 256.1, WINK = 257.47, LAMP = 258.4, IRIS0 = 266.4, IRIS1 = 269.4;
  const notebook = () => { const g = new THREE.Group();
    for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(1.3, .06, 1.7), PAPER()); p.position.set(s * .66, 0, 0); p.rotation.z = -s * .06; p.castShadow = true; g.add(p); }
    const cover = new THREE.Mesh(new THREE.BoxGeometry(2.8, .05, 1.85), plastic(COL.red)); cover.position.y = -.05; g.add(cover); return g; };

  // the clip assistant's line changes for the ending (drawn over the egg's own sign, same spot)
  district('desk-c11', { at: WORLD.D.desk, r: 60 }, t => {
    if (t < 249) return;
    const x = WORLD.D.desk[0] + 8.5, z = WORLD.D.desk[1] + 1.5, ry = -.35;
    put(sign('c11-clip', ["It looks like you're", 'writing an ending.', 'Need help?'], { w: 6.1, h: 2.7, bg: '#ffffcc', size: 66 }), x + 4.5 * Math.cos(ry) + .3 * Math.sin(ry), 3, z - 4.5 * Math.sin(ry) + .3 * Math.cos(ry), ry);
  });

  const CAM = [[F6.t1, F6.B.pos], [254.2, at(-2.5, 6.2, 18.5)], [258.2, at(1.2, 5.8, 13)], [263.2, at(.6, 5.2, 8.5)], [269.61, at(.25, 4.7, 4.6)]];
  const LOOKP = [[F6.t1, F6.B.look], [254.2, at(0, 4.3, -1)], [258.2, at(0, 4.0, -1.5)], [263.2, at(0, 3.8, -1.3)], [269.61, at(.2, 3.55, -1.1)]];
  const FOV = [[F6.t1, F6.B.fov], [258.2, 32], [269.61, 30]];

  function outro(t, lt) {
    const q = t, PIPZ = -2.4;
    // ---------- Clawd: glitching at the desk, then steps aside and holds the lamp ----------
    const C = clawd('c11', {}), glitch = q < 254.6, step = ease(seg(q, 254.6, 255.6));
    const jit = glitch ? [(hash(Math.floor(q * 14)) - .5) * .25, 0, (hash(Math.floor(q * 14) + 9) - .5) * .12] : [0, 0, 0];
    const holdLamp = q > LAMP, lampUp = ease(seg(q, LAMP, LAMP + .6));
    clawdPose(C, { hat: 'headset', face: glitch ? (Math.floor(q * 6) % 5 ? 'glitch' : 'x') : q < WINK ? 'neutral' : 'joy', roll: glitch ? Math.sin(q * 23) * .04 : 0,
      walk: step > 0 && step < 1 ? q * 3 : null, armL: holdLamp ? .4 + .5 * lampUp : glitch ? .3 + .2 * Math.sin(q * 17) : .15, armR: q > 254.6 && q < 255.8 ? .7 : .15,
      holdL: holdLamp ? keep('c11-lamp', () => { const g = new THREE.Group(), l = C00.lampObj(); l.position.y = -.2; l.rotation.z = .5; g.add(l); return g; }) : null, bob: .1 * pulse(t, 5) });
    put(C, WORLD.D.desk[0] + lerp(0, 6.3, step) + jit[0], 0, WORLD.D.desk[1] + lerp(-2.4, -3.6, step) + jit[2], lerp(0, -.8, step));
    if (glitch) for (let s = 0; s < 4; s++) { const sp = keep('c11-spark' + s, () => new THREE.Mesh(new THREE.OctahedronGeometry(.18), glowMat(s % 2 ? '#7CE3FF' : '#FF5A4A', 3)));
      const on = hash(Math.floor(q * 9) + s) > .4; if (on) put(sp, WORLD.D.desk[0] + (s < 2 ? -2.2 : 2.2) + (hash(s + Math.floor(q * 9)) - .5), 6 + hash(s * 3 + Math.floor(q * 9)), WORLD.D.desk[1] - 2.4, q * 4); }
    // ---------- Pip: walks in, sits, writes ----------
    if (q > 253.6) {
      const P = fig('pip', PIP); let x, z, ry, pp;
      if (q < SIT0) { const k = ease(seg(q, 253.6, SIT0)); x = lerp(12, 0, k); z = lerp(1, PIPZ, k); ry = k < .9 ? -Math.PI / 2 : lerp(-Math.PI / 2, 0, (k - .9) / .1); pp = { ...walk(q * 1.3), face: 'determined' }; }
      else {
        const sk = ease(seg(q, SIT0, SIT1)); x = 0; z = PIPZ; ry = 0;
        const writing = q > WINK + .9, scrib = writing ? Math.sin(q * 22) : 0, flourish = q > WINK - .1 && q < WINK + .8 ? Math.sin(Math.PI * seg(q, WINK - .1, WINK + .8)) : 0;
        pp = { legL: 1.5 * sk, legR: 1.5 * sk, bodyY: .25 * sk, face: flourish > .1 ? 'wink' : writing ? (Math.floor(q / 3) % 3 === 2 ? 'joy' : 'determined') : 'neutral',
          armR: q > SIT1 - .2 ? .95 + 1.4 * flourish + .06 * scrib : .2, armRz: .08 * scrib, armL: q > SIT1 ? .85 : .2, armLz: .15,
          headTilt: writing ? .38 : .1 * sk, head: writing ? .1 * Math.sin(q * .7) : 0, holdR: q > SIT1 - .2 ? heldPencil('c11') : null };
      }
      pose(P, pp); P.userData.J.earPencil && (P.userData.J.earPencil.visible = q < SIT1 - .2);
      put(P, WORLD.D.desk[0] + x, 0, WORLD.D.desk[1] + z, ry);
      put(keep('c11-chair', () => build([['3005', COL.dkgrey, 0, 1.2, 0], ['3022', COL.dkgrey, 0, 1.6, 0], ['3010', COL.dkgrey, 0, 3.0, -1, 0], ['3010', COL.dkgrey, 0, 4.2, -1, 0]])), WORLD.D.desk[0], 0, WORLD.D.desk[1] + PIPZ - .2);
    }
    // the notebook on the desk, in front of Pip's hands
    put(keep('c11-nb', notebook), WORLD.D.desk[0] + .1, 3.28, WORLD.D.desk[1] - .7, .08);
    // the neighbours wave goodnight from the cubicle rows (they drift off after 266)
    for (let i = 0; i < 5; i++) {
      const f = fig('c11n' + i, crowdLook(i + 2)), bx = [-11, -7, 7, 11, 14][i], bz = [-5, -2.5, -2.5, -5, -1][i];
      const leave = seg(q, 265.5 + i * .3, 268), wv = dance('wave', t, { offset: i * .4, side: i % 2 ? -1 : 1 });
      pose(f, leave > 0 ? { ...walk(q * 1.2), face: 'joy' } : { ...wv, face: i % 2 ? 'joy' : 'wink' });
      put(f, WORLD.D.desk[0] + bx + (leave > 0 ? Math.sign(bx) * leave * 10 : 0), 0, WORLD.D.desk[1] + bz, leave > 0 ? Math.sign(bx) * Math.PI / 2 : -Math.sign(bx) * .4);
    }
    // ---------- camera + look ----------
    if (t < F6.t1) WORLD.apply(WORLD.flight('F6', t));
    else {
      const p = path(t, CAM, { easeEnds: false }), l = path(t, LOOKP, { easeEnds: false }), dr = drift(lt, .35 * (1 - seg(t, 264, 269)));
      cam({ pos: [p[0] + dr[0], p[1] + dr[1], p[2] + dr[2]], look: l, fov: path(t, FOV, { easeEnds: false }), blur: .8, focus: at(0, 3.8, -1.2) });
      look({ ...WORLD.LOOK.night, keyInt: lerp(1.5, .9, seg(t, LAMP, LAMP + 2)), fill: .22, vignette: .5 });
    }
    // iris closes on the pencil tip (screen-projected every frame)
    if (t > IRIS0) {
      const r = (1 - easeIn(seg(t, IRIS0, IRIS1))) * 1400;
      hud(ctx => {
        const pen = heldPencil('c11'), tip = new THREE.Vector3(0, 2.84 * .55 - .6 * .55 / .42, 0); pen.updateMatrixWorld(true); pen.localToWorld(tip);
        const v = tip.project(window.__cam), cx = (v.x + 1) / 2 * W, cy = (1 - v.y) / 2 * H;
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.rect(0, 0, W, H); if (r > .5) ctx.arc(cx, cy, r, 0, Math.PI * 2, true); ctx.fill();
      });
    }
  }
  shots([[249.41, outro]]);
})();
