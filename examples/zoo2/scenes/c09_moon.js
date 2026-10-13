// c09_moon.js: 189.17–214.94 s. Backups: the Arctic seed vault → a seed rocket to the moon → the lava-tube vault
// sealing → "Control-S the species" → a human on the switch → rules of the road → trade/pump/bean/neighbour →
// the printed manual → sequels on the shelf → the crowd raises the pencil.
// Still the beat-switch groove: every hit lands on a beat (bt(k) = 0.265 + k·60/94).
(() => {
  const bt = k => OFF + k * BEAT;
  const beatsIn = (a, b) => { const r = []; for (let k = Math.ceil(bpOf(a)); bt(k) < b; k++) r.push(bt(k)); return r; };
  const MOON = '#C9D3E6', INDIGO = '#1F2550', AUR = '#7FE0A8';
  const PARKA = '#C8324A';

  // ---------- set pieces ----------
  function nightSky(t, aurora = 1, col = INDIGO) {
    boilSeed('msky');
    paint(rectPts(-700, -500, W + 1400, H + 1000), { wash: col, ink: null });
    for (let i = 0; i < 46; i++) {
      boilSeed('mstar' + i);
      const x = hash(i + 7) * (W + 600) - 300, y = hash(i + 70) * H * .65 - 60, tw = .6 + .4 * Math.sin(t * (1.5 + hash(i)) + i);
      paint(starPts(x, y, (3 + 4 * hash(i + 3)) * tw, .35, 4), { wash: PAL.cream, washOp: 140 + 100 * tw, ink: null });
    }
    if (aurora > 0) for (let j = 0; j < 3; j++) {
      boilSeed('aur' + j);
      const P = []; for (let i = 0; i <= 8; i++) P.push([-200 + i * 300, 160 + j * 70 + 60 * Math.sin(i * .9 + t * .6 + j * 2)]);
      paint(ribbon(P, 70 + 30 * j, 20), { fill: j === 1 ? '#8FD6E8' : AUR, fillOp: (70 - 15 * j) * aurora, bleed: .35, tex: .4, ink: null });
    }
  }
  function crate(x, y, s, glowK = 0) {   // a wooden crate of seed packets, centred on its bottom edge
    if (glowK > 0) glow(x, y - 40 * s, 120 * s, '#9FE8A8', glowK);
    paint(rectPts(x - 60 * s, y - 70 * s, 120 * s, 70 * s, 1.5), { wash: '#B98A55', fill: '#8A5A30', fillOp: 70, tex: .6, ink: PAL.ink, sw: .9 * s });
    for (let i = 0; i < 4; i++) paint(rectPts(x - 52 * s + i * 27 * s, y - 92 * s + 6 * hash(i) * s, 20 * s, 28 * s, 1), { wash: [PAL.sap, PAL.ochre, PAL.rose, PAL.teal][i], ink: PAL.ink, sw: .5 * s });
    inkLine([[x - 60 * s, y - 35 * s], [x + 60 * s, y - 35 * s]], .6 * s, PAL.ink, 'inkfine', 0);
  }
  function earth(x, y, r) {
    glow(x, y, r * 1.6, '#8FD6E8', .6);
    paint(ellPts(x, y, r, r, 30), { wash: '#3A7FC0', fill: PAL.indigo, fillOp: 40, tex: .5, ink: PAL.ink, sw: .9 });
    for (let i = 0; i < 4; i++) paint(ellPts(x + (hash(i) - .5) * r * 1.1, y + (hash(i + 4) - .5) * r * 1.1, r * (.18 + .15 * hash(i + 8)), r * (.12 + .1 * hash(i + 2)), 12, r * .03), { wash: PAL.sap, ink: null });
    paint(ellPts(x - r * .3, y - r * .35, r * .35, r * .18, 14), { fill: PAL.cream, fillOp: 90, bleed: .2, ink: null });
  }
  function moonGround(t, y0 = 860) {
    boilSeed('mground');
    paint(rectPts(-700, y0, W + 1400, 600, 3), { wash: MOON, fill: '#9AA6BE', fillOp: 90, tex: .7, ink: null });
    inkLine([[-700, y0 + 4], [W / 2, y0 - 6], [W + 700, y0 + 6]], 1, PAL.ink, 'ink', .5);
    for (let i = 0; i < 7; i++) { boilSeed('crater' + i); const x = hash(i + 30) * (W + 800) - 400, y = y0 + 50 + hash(i + 40) * 160; paint(ellPts(x, y, 50 + 60 * hash(i), 14 + 10 * hash(i + 1), 18, 2), { wash: '#A9B4CA', ink: PAL.ink, sw: .6 }); }
  }
  function speedLinesV(k) {
    if (k < .05) return;
    for (let i = 0; i < 14; i++) { boilSeed('vline' + i); const x = hash(i) * W, l = 300 + 600 * hash(i + 5); inkLine([[x, H * hash(i + 2) - l / 2], [x, H * hash(i + 2) + l / 2]], 1.4 * k, PAL.cream, 'ink', 0); }
    flash(k * .8, '#FFFDF6');
  }

  // ---------- 1: Seed vault in the Arctic? That's a backup on ice ----------
  function shotVault(t, lt, dur) {
    camBegin(kf(lt, [[0, 900], [dur, 1020]]), 560, kf(lt, [[0, 1.0], [dur, 1.12]]));
    nightSky(t, 1);
    boilSeed('mtn');
    paint([[-300, 900], [520, 260], [880, 520], [1180, 220], [1900, 760], [2300, 900]], { wash: '#E9F0F8', fill: '#B9C8DE', fillOp: 90, tex: .6, ink: PAL.ink, sw: 1.1 });
    paint(rectPts(-400, 860, W + 800, 500, 2), { wash: '#F3F7FB', fill: '#C9D8EA', fillOp: 70, tex: .5, ink: null });
    // the vault entrance: a slab wedge with warm light spilling out
    boilSeed('vaultdoor');
    const lit = .7 + .3 * pulse(t, 3);
    glow(1180, 700, 260 * lit, '#FFD27A', .9);
    paint([[1060, 860], [1100, 560], [1300, 560], [1320, 860]], { wash: '#5B6B80', fill: '#3D4A5C', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1.1 });
    paint(rectPts(1150, 640, 110, 220, 1), { wash: '#FFE6A6', fill: PAL.ochre, fillOp: 60, ink: PAL.ink, sw: .9 });
    for (let i = 0; i < 18; i++) { boilSeed('snow' + i); const k = frac(t * .25 + hash(i)); paint(ellPts(hash(i + 3) * 2000 - 40 + 30 * Math.sin(t + i), -40 + k * 1000, 5, 5, 8), { wash: '#FFFFFF', washOp: 220, ink: null }); }
    // Pip in a parka trudges in with the seed crate and slides it into the vault
    const walk = stroll(lt, 0, 1.4, 380, 960, 24), push_ = ease(seg(lt, 1.5, 1.9));
    const cx = lerp(walk.x + 150, 1205, push_);
    pip(walk.x + 40 * push_, 880, 30, { hoodie: PARKA, eyes: lt > 1.9 ? 'closed' : 'dot', mouth: lt > 1.9 ? 'grin' : 'flat', walk: lt < 1.4 ? walk.walk : null, aL: .1, aR: .1,
      emote: lt > 1.95 ? 'spark' : null, emoteK: seg(lt, 1.95, 2.1) });
    if (push_ < .97) crate(cx, 870 - 260 * (1 - push_) * 0 - 140, 1.15, push_);
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, [INDIGO, MOON]);
  }

  // ---------- 2: Now eggs, sperm, and seeds on the moon. Back it up twice ----------
  function rocket(x, y, s, flame) {
    if (flame > 0) {
      glow(x, y + 40 * s, 140 * s * flame, '#FFB24A', 1);
      paint(ribbon([[x, y], [x + 8 * Math.sin(T * 40) * s, y + 90 * s], [x, y + 190 * s * flame]], 70 * s, 6 * s), { wash: '#FFC766', fill: '#FF7A3A', fillOp: 90, ink: null });
    }
    paint([[x - 50 * s, y], [x - 50 * s, y - 240 * s], [x, y - 330 * s], [x + 50 * s, y - 240 * s], [x + 50 * s, y]], { wash: PAL.cream, fill: '#D8CFC0', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1 * s, curv: .3 });
    paint([[x - 50 * s, y - 60 * s], [x - 100 * s, y + 10 * s], [x - 50 * s, y - 10 * s]], { wash: PAL.clay, ink: PAL.ink, sw: .8 * s });
    paint([[x + 50 * s, y - 60 * s], [x + 100 * s, y + 10 * s], [x + 50 * s, y - 10 * s]], { wash: PAL.clay, ink: PAL.ink, sw: .8 * s });
    paint(ellPts(x, y - 200 * s, 26 * s, 26 * s, 16), { wash: '#8FD6E8', ink: PAL.ink, sw: .8 * s });
    for (let i = 0; i < 3; i++) paint(ellPts(x - 15 * s + i * 15 * s, y - 120 * s, 6 * s, 14 * s, 10), { wash: ['#9FE8A8', PAL.rose, PAL.ochre][i], ink: PAL.ink, sw: .4 * s });  // vials in the window strip
  }
  function shotRocket(t, lt, dur) {
    const tLift = .55, tCut = 1.45;
    if (lt < tCut) {
      const sh = lt > tLift ? shakeXY(t, 9 * (1 - seg(lt, tLift, tCut))) : [0, 0];
      const up = easeIn(seg(lt, tLift, tCut));
      camBegin(960 + sh[0], kf(lt, [[0, 560], [tCut, 380]]) + sh[1], 1.05);
      nightSky(t, .6);
      boilSeed('rsnow');
      paint(rectPts(-400, 860, W + 800, 500, 2), { wash: '#F3F7FB', fill: '#C9D8EA', fillOp: 70, tex: .5, ink: null });
      boilSeed('rocket');
      rocket(960, 840 - up * 1100, 1.25, lt > tLift - .1 ? .5 + .5 * seg(lt, tLift - .1, tLift + .2) : 0);
      if (lt > tLift) for (let i = 0; i < 8; i++) { boilSeed('smoke' + i); const k = seg(lt, tLift + i * .05, tCut); paint(ellPts(960 + (i - 3.5) * 70 * (1 + k), 850 - 20 * k, 70 + 60 * k, 50 + 30 * k, 16, 4), { wash: '#F3EFE6', washOp: 230 * (1 - k * .6), ink: PAL.ink, sw: .5 }); }
      const cheer = seg(lt, tLift, tLift + .2);
      pip(1450, 880, 28, { hoodie: PARKA, eyes: 'wide', mouth: 'O', lookY: -1, lookX: -.6, aL: lerp(-1.2, 1.2, cheer), aR: lerp(-1.2, 1.3, cheer), flip: true });
      camEnd();
      speedLinesV(seg(lt, tCut - .25, tCut));
    } else {
      // landing on the moon: a second backup, the moon base with its dome
      const a = lt - tCut, land = easeOut(seg(a, 0, .5)), thud = a > .5 ? Math.exp(-(a - .5) * 8) : 0;
      const sh = shakeXY(t, 10 * thud);
      camBegin(960 + sh[0], 560 + sh[1], kf(a, [[0, 1.1], [dur - tCut, 1.0]]));
      nightSky(t, 0, '#141A3A');
      boilSeed('earth'); earth(1560, 220, 110);
      moonGround(t);
      boilSeed('dome');
      glow(560, 760, 260, '#FFD27A', .7);
      paint(ellPts(560, 860, 260, 190, 30), { wash: '#DCE6F2', fill: '#9FB8D6', fillOp: 50, tex: .4, ink: PAL.ink, sw: 1 });
      paint(rectPts(300, 856, 520, 30, 1), { wash: '#8A94A8', ink: PAL.ink, sw: .8 });
      for (let i = 0; i < 3; i++) paint(rectPts(420 + i * 90, 760, 60, 90, 1), { wash: ['#9FE8A8', '#F6C5D8', '#FFE6A6'][i], ink: PAL.ink, sw: .6 });  // vial racks glowing
      boilSeed('rocket2');
      rocket(1180, lerp(-300, 850, land), 1.0, 1 - seg(a, .45, .7));
      if (a > .5) for (let i = 0; i < 6; i++) { boilSeed('dust' + i); const k = seg(a, .5, 1.1); paint(ellPts(1180 + (i - 2.5) * 80 * (1 + k), 860, 40 + 40 * k, 18, 12, 3), { wash: '#DCE2EE', washOp: 220 * (1 - k), ink: null }); }
      clawd(1600, 900, 22, { ...emotions(a, [[0, 'surprised', { lookX: -1 }], [.75, 'starstruck']]), view: 'q', flip: true });
      camEnd();
    }
  }

  // ---------- 3: Lava tube, deep freeze, sealed tight, lights off ----------
  function shotTube(t, lt, dur) {
    const b = beatsIn(t - lt + 1.0, t - lt + dur).map(x => x - (t - lt));   // light-off beats
    const roll = ease(seg(lt, .05, .9)), clunk = lt > .9 ? Math.exp(-(lt - .9) * 9) : 0;
    const sh = shakeXY(t, 9 * clunk);
    camBegin(960 + sh[0], 560 + sh[1], kf(lt, [[0, 1.0], [dur, 1.12]]));
    boilSeed('cave');
    paint(rectPts(-500, -400, W + 1000, H + 800), { wash: '#141018', ink: null });
    paint([[-300, 1200], [-300, 300], [200, -40], [960, -120], [1720, -40], [2220, 300], [2220, 1200]], { wash: '#3A2E36', fill: '#5A3A30', fillOp: 70, tex: .7, ink: PAL.ink, sw: 1.2, curv: .5 });
    paint([[100, 1200], [100, 420], [500, 160], [960, 110], [1420, 160], [1820, 420], [1820, 1200]], { wash: '#221A24', fill: '#3A2E36', fillOp: 60, tex: .5, ink: null, curv: .5 });
    boilSeed('cavefloor');
    paint(rectPts(-400, 880, W + 800, 400, 2), { wash: '#2A2228', ink: null });
    // ceiling lamps: each clicks off on a beat
    const lamps = [300, 620, 1300, 1620];
    lamps.forEach((x, i) => {
      boilSeed('lamp' + i);
      const off = b[i] != null && lt > b[i], y = i === 0 || i === 3 ? 330 : 190;
      if (!off) glow(x, y + 40, 170, '#FFE6A6', .8);
      inkLine([[x, y - 160], [x, y]], .8, '#8A8090', 'inkfine', 0);
      paint(ellPts(x, y + 14, 34, 22, 12), { wash: off ? '#5A5060' : '#FFE6A6', ink: PAL.ink, sw: .8 });
      if (off && lt - b[i] < .25) paint(starPts(x, y + 14, 50 * (1 - (lt - b[i]) / .25), .3, 4), { wash: PAL.cream, ink: null });
    });
    // the round vault door rolls across the opening and seals; frost creeps over it
    boilSeed('vault');
    const dx = lerp(1700, 960, roll), rot = (1 - roll) * 3;
    glow(960, 600, 300 * (1 - roll) + 80, '#9FE8E8', .7);
    push(); translate(dx, 600); rotate(rot);
    paint(ellPts(0, 0, 250, 250, 36, 2), { wash: '#8A94A8', fill: '#5B6478', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1.4 });
    paint(ellPts(0, 0, 180, 180, 30, 2), { wash: '#A6B0C2', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; inkLine([[Math.cos(a) * 40, Math.sin(a) * 40], [Math.cos(a) * 170, Math.sin(a) * 170]], 2, PAL.ink, 'ink', 0); }
    paint(ellPts(0, 0, 44, 44, 16), { wash: PAL.ochre, ink: PAL.ink, sw: 1 });
    pop();
    const frost = seg(lt, 1.0, dur);
    if (frost > 0) for (let i = 0; i < 9; i++) { boilSeed('frost' + i); const a = i / 9 * TAU; paint(starPts(960 + Math.cos(a) * 230, 600 + Math.sin(a) * 230, 40 * frost * (.6 + .4 * hash(i)), .25, 6), { wash: '#EAF7FC', washOp: 220, ink: null }); }
    // Pip in the parka gives the wheel a final shove, then a thumbs-up
    pip(lerp(1900, 1340, roll), 900, 30, { hoodie: PARKA, eyes: clunk > .2 ? 'closed' : 'narrow', mouth: lt > 1.0 ? 'grin' : 'flat', flip: true, aL: lt < .9 ? .1 : 1.1, aR: lt < .9 ? .1 : -.8, rot: lt < .9 ? .2 : 0 });
    camEnd();
    const dark = lamps.filter((x, i) => b[i] != null && lt > b[i]).length / 4;
    if (dark > 0) { boilSeed('dark'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#0A0810', washOp: 110 * dark, ink: null }); }
  }

  // ---------- 4: Control-S the species. We ain't gettin' wiped off ----------
  function floppy(x, y, s) {
    paint(rrPts(x - 200 * s, y - 200 * s, 400 * s, 400 * s, 22 * s, 2), { wash: '#3D4A7A', fill: PAL.indigo, fillOp: 70, tex: .5, ink: PAL.ink, sw: 1.4 * s });
    paint(rectPts(x - 110 * s, y - 200 * s, 220 * s, 130 * s, 1), { wash: '#C9CED8', ink: PAL.ink, sw: s });
    paint(rectPts(x + 30 * s, y - 180 * s, 50 * s, 90 * s, 1), { wash: '#3D4A7A', ink: null });
    paint(rectPts(x - 150 * s, y + 10 * s, 300 * s, 170 * s, 1), { wash: PAL.cream, ink: PAL.ink, sw: s });
    for (let i = 0; i < 3; i++) inkLine([[x - 120 * s, y + 55 * s + i * 40 * s], [x + 120 * s, y + 55 * s + i * 40 * s]], .6 * s, '#9A90A0', 'inkfine', 0);
  }
  function shotSave(t, lt, dur) {
    const tHit = bt(Math.ceil(bpOf(t - lt + .6))) - (t - lt);
    const hit = lt > tHit ? Math.exp(-(lt - tHit) * 7) : 0, sh = shakeXY(t, 22 * hit);
    camBegin(960 + sh[0], 540 + sh[1], 1.0 + .06 * hit);
    nightSky(t, .4, '#141A3A');
    boilSeed('earth2'); earth(960, 560, 200 * (1 + .05 * pulse(t)));
    // the save icon drops out of the sky and stamps down over the Earth, then a shield ring spreads out
    const fall = easeIn(seg(lt, tHit - .45, tHit)), y = lerp(-400, 560, fall), sc = lerp(1.5, 1.2, fall);
    if (lt > tHit) {
      glow(960, 560, 520 * (1 - .4 * seg(lt, tHit, dur)), '#9FE8E8', .8 * (1 - .5 * seg(lt, tHit, dur)));
      boilSeed('ring'); brush.noFill(); brush.noWash(); brush.noHatch(); brush.set('ink', '#9FE8E8', 2.4);
      const rr = 300 + 260 * easeOut(seg(lt, tHit, tHit + .5)); brush.beginShape(0); for (const p of ellPts(960, 560, rr, rr, 36)) brush.vertex(p[0], p[1]); brush.endShape(true);
    }
    boilSeed('floppy');
    if (lt < tHit + .35) floppy(960, y, sc * (1 - .25 * seg(lt, tHit, tHit + .35)));
    else { const k = seg(lt, tHit + .35, tHit + .7); if (k < 1) floppy(960 + 600 * easeIn(k), 560 + 300 * easeIn(k), .9 - .6 * k); }   // it flies into Pip's pocket
    // Pip pumps a fist on the beats after the stamp
    const pumps = Math.max(0, ...beatsIn(t - lt + tHit, t).map(p => Math.exp(-(t - p) * 6)));
    pip(1500, 960, 32, { eyes: lt > tHit ? 'closed' : 'wide', mouth: lt > tHit ? 'grin' : 'O', aL: lt > tHit ? .9 + .6 * pumps : .2, aR: -1.1, dy: -.4 * pumps, flip: true, lookY: -1 });
    camEnd();
    if (hit > .6) flash((hit - .6) * 1.5, '#EAF7FC');
  }

  // ---------- 5: Red-team every model, keep a human on the switch ----------
  function shotSwitch(t, lt, dur) {
    camBegin(kf(lt, [[0, 1000], [dur, 940]]), 580, kf(lt, [[0, 1.05], [dur, 1.15]]));
    boilSeed('srvroom');
    paint(rectPts(-400, -300, W + 800, H + 600), { wash: '#1E2A3A', ink: null });
    for (let i = 0; i < 6; i++) {   // server racks with lights blinking on the eighths
      boilSeed('rack' + i);
      const x = 120 + i * 300;
      paint(rectPts(x, 180, 200, 680, 2), { wash: '#2E3B50', fill: '#3D4A5C', fillOp: 60, tex: .5, ink: PAL.ink, sw: .9 });
      for (let j = 0; j < 8; j++) paint(ellPts(x + 40 + 30 * (j % 4), 240 + 70 * Math.floor(j / 4) + 140 * (i % 2), 7, 7, 8), { wash: hash(j + i * 9 + Math.floor(bpOf(t) * 2)) > .5 ? '#7FE0A8' : '#2A3444', ink: null });
    }
    boilSeed('srvfloor');
    paint(rectPts(-400, 860, W + 800, 500, 2), { wash: '#2A2A36', ink: null });
    // the big switch
    boilSeed('switch');
    paint(rrPts(860, 640, 200, 220, 20), { wash: '#4A4A5A', fill: PAL.ink, fillOp: 40, ink: PAL.ink, sw: 1.2 });
    push(); translate(960, 700); rotate(-.5);
    paint(rectPts(-14, -230, 28, 230, 1), { wash: '#9A9AA8', ink: PAL.ink, sw: .9 });
    glow(0, -240, 90, '#FF5A4A', .7);
    paint(ellPts(0, -250, 48, 48, 18), { wash: '#E23E36', fill: '#A82A2A', fillOp: 60, ink: PAL.ink, sw: 1 });
    pop();
    // Clawd in the red-team headband tiptoes in from the left toward the switch…
    const sneak = lerp(150, 600, ease(seg(lt, 0, 1.4))), caught = lt > 1.5;
    clawd(sneak, 900, 26, { ...emotions(lt, [[0, 'mischief'], [1.55, 'nervous'], [2.0, 'shy']]), hat: 'band', view: caught ? 'q' : 'side', walk: lt < 1.4 ? lt * 2.2 : null, dy: lt < 1.4 ? -.4 * Math.abs(Math.sin(lt * 7)) : 0 });
    // …Pip, one hand resting on the switch handle, just raises an eyebrow
    pip(1240, 900, 32, { eyes: caught ? 'narrow' : 'dot', brows: caught ? 'up' : null, mouth: caught ? 'smirk' : 'flat', flip: true, lookX: caught ? 1 : 0, aL: .65, aR: -1.2,
      emote: caught && lt < 2.4 ? '?' : null, emoteK: seg(lt, 1.55, 1.75), emoteAge: lt - 1.55 });
    camEnd();
  }

  // ---------- 6: Rules of the road. Nobody racin' off a cliff to get rich ----------
  function stopSign(x, y, s, k) {
    inkLine([[x, y], [x, y + 220 * s]], 1.4 * s, '#8A8A9A', 'ink', 0);
    if (k <= .01) return;
    push(); translate(x, y); scale(k);
    const P = []; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + TAU / 16; P.push([Math.cos(a) * 70 * s, Math.sin(a) * 70 * s]); }
    paint(P, { wash: '#E23E36', ink: PAL.ink, sw: 1.1 * s });
    paint(rectPts(-40 * s, -10 * s, 80 * s, 20 * s), { wash: PAL.cream, ink: null });   // a painted bar, no lettering
    pop();
  }
  function shotRoad(t, lt, dur) {
    camBegin(kf(lt, [[0, 900], [dur, 1000]]), 560, 1.05);
    boilSeed('dusk');
    paint(rectPts(-500, -400, W + 1000, H + 800), { wash: '#F0A868', ink: null });
    paint(ellPts(1500, 380, 160, 160, 26), { wash: '#FFE6A6', fill: PAL.ochre, fillOp: 40, ink: null });
    // the cliff: the road runs right and stops at a drop into a gorge
    boilSeed('cliff');
    paint(rectPts(1500, 860, 900, 500), { wash: '#3D4A7A', fill: PAL.indigo, fillOp: 60, ink: null });
    paint([[-500, 760], [1500, 740], [1540, 1400], [-500, 1400]], { wash: '#6E9F58', fill: PAL.sap, fillOp: 80, tex: .6, ink: PAL.ink, sw: 1 });
    paint([[-500, 770], [1500, 752], [1500, 840], [-500, 870]], { wash: '#4A4A5A', ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 9; i++) inkLine([[-400 + i * 200, 815 - i * 2], [-330 + i * 200, 813 - i * 2]], 1.4, '#F2C53D', 'ink', 0);
    // the sign pops up on the first beat
    const t1 = bt(Math.ceil(bpOf(t - lt + .2))) - (t - lt);
    boilSeed('sign');
    stopSign(1380, 560, 1, backOut(seg(lt, t1, t1 + .3)));
    // three little Clawd-cars race toward the edge, slam on the brakes at the sign and turn back
    for (let i = 0; i < 3; i++) {
      const brake = t1 + .25 + i * .2;
      const x = lt < brake ? lerp(-200 - i * 300, 1180 - i * 250, easeIn(seg(lt, i * .25, brake))) : lerp(1180 - i * 250, 300 - i * 300, ease(seg(lt, brake + .5, dur + .5)));
      const tip = lt > brake && lt < brake + .4 ? .25 * Math.sin(seg(lt, brake, brake + .4) * Math.PI) : 0;
      clawd(x, 812 - i * 4, 21, { ...feel(lt > brake ? 'nervous' : 'excited', t + i), view: 'side', flip: lt > brake + .45, rot: tip, noLegs: true, boilKey: 'car' + i,
        draw: (u, sw) => { for (const wx of [-2.4, 2.4]) paint(ellPts(wx * u, -1.6 * u, 1.3 * u, 1.3 * u, 12), { wash: PAL.ink, ink: null }); } });
    }
    pip(330, 1030, 30, { eyes: 'narrow', mouth: 'smirk', aR: lt > t1 ? .9 : -1.2, aL: -1.2, lookX: 1 });
    camEnd();
  }

  // ---------- 7: Learn a trade, fix a pump, grow a bean, know your neighbor — four beats, four panels ----------
  function shotFour(t, lt, dur) {
    const bb = beatsIn(t - lt + .15, t - lt + dur).map(x => x - (t - lt)), b = [0, ...bb].slice(0, 4);   // panel 1 opens the shot, then one per beat
    boilSeed('fourbg');
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#3B2A3A', ink: null });
    const cells = [[0, 0], [1, 0], [0, 1], [1, 1]], cw = W / 2, ch = H / 2;
    cells.forEach(([cx, cy], i) => {
      const t0 = b[i] ?? (i * BEAT), k = backOut(seg(lt, t0, t0 + .22));
      if (k <= .01) return;
      const x0 = cx * cw, y0 = cy * ch, mx = x0 + cw / 2, my = y0 + ch / 2, a = lt - t0;
      push(); translate(mx, my); scale(k); translate(-mx, -my);
      boilSeed('panel' + i);
      paint(rectPts(x0 + 14, y0 + 14, cw - 28, ch - 28, 2), { wash: ['#F6D8A8', '#BFE3F2', '#D8EBC4', '#F6C5D8'][i], fill: '#FFF5E2', fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.2 });
      const gy = y0 + ch - (cy ? 150 : 60);   // bottom row sits above the karaoke bar
      if (i === 0) {          // learn a trade: a wrench turning a bolt
        paint(rectPts(mx + 40, gy - 150, 160, 150, 1), { wash: '#8A6A4A', ink: PAL.ink, sw: .8 });
        paint(ellPts(mx + 120, gy - 80, 24, 24, 6, 0, a * 4), { wash: '#C9C2B5', ink: PAL.ink, sw: .8 });
        pip(mx - 120, gy, 17, { eyes: 'narrow', mouth: 'flat', aR: .1 + .3 * Math.sin(a * 14), boilKey: 'p4a', handR: (s, sw) => { push(); rotate(-.2); paint(rectPts(0, -.3 * s, 4 * s, .6 * s), { wash: '#9A9AA8', ink: PAL.ink, sw }); paint(ellPts(4.2 * s, 0, .8 * s, .8 * s, 10), { wash: '#9A9AA8', ink: PAL.ink, sw }); pop(); } });
      } else if (i === 1) {   // fix a pump: water bursts out
        paint(rectPts(mx + 20, gy - 200, 40, 200, 1), { wash: '#4A6A8A', ink: PAL.ink, sw: .8 });
        paint(rectPts(mx + 60, gy - 190, 110, 30, 1), { wash: '#4A6A8A', ink: PAL.ink, sw: .8 });
        const h = Math.sin(a * 7) * .5 + .5;
        inkLine([[mx + 40, gy - 200], [mx - 20, gy - 240 - 40 * h]], 2.4, '#4A6A8A', 'ink', 0);
        for (let j = 0; j < 6; j++) { const q = frac(a * 2 + j / 6); paint(ellPts(mx + 175 + 60 * q, gy - 175 + 160 * q * q, 12, 16, 10), { wash: '#8FD6E8', ink: PAL.ink, sw: .4 }); }
        pip(mx - 150, gy, 17, { eyes: 'closed', mouth: 'grin', aR: .9, boilKey: 'p4b' });
      } else if (i === 2) {   // grow a bean: a sprout springs out of the soil
        paint(ellPts(mx + 60, gy, 150, 40, 18), { wash: '#6A4A3A', ink: PAL.ink, sw: .8 });
        const g = backOut(seg(a, 0, .4)), sway = .1 * Math.sin(a * 4);
        if (g > .05) {
          inkLine([[mx + 60, gy - 10], [mx + 60 + 15 * sway, gy - 90 * g], [mx + 60 + 30 * sway, gy - 170 * g]], 2.6, PAL.sap, 'ink', 0);
          for (const s of [-1, 1]) paint(ellPts(mx + 60 + s * 40 * g, gy - 150 * g, 38 * g, 18 * g, 12, 0, s * .4), { wash: '#8CC56A', ink: PAL.ink, sw: .6 });
        }
        pip(mx - 160, gy, 17, { eyes: 'star', mouth: 'O', boilKey: 'p4c' });
      } else {                // know your neighbor: two neighbours wave over a fence
        for (let j = 0; j < 5; j++) paint(rectPts(mx - 60 + j * 30, gy - 110, 18, 110, 1), { wash: PAL.cream, ink: PAL.ink, sw: .6 });
        pip(mx - 160, gy, 17, { eyes: 'happy', mouth: 'grin', aR: 1.2 + .3 * Math.sin(a * 12), flip: false, boilKey: 'p4d' });
        pip(mx + 180, gy, 17, { eyes: 'happy', mouth: 'smile', aR: 1.2 + .3 * Math.sin(a * 12 + 1), flip: true, hoodie: PAL.rose, beanie: PAL.sap, skin: '#8A5A3C', pencil: false, boilKey: 'p4e' });
      }
      pop();
    });
  }

  // ---------- 8: Print the manual. Paper don't need a password later ----------
  function shotPress(t, lt, dur) {
    const b = beatsIn(t - lt, t - lt + dur).map(x => x - (t - lt));
    const down = Math.max(0, ...b.map(p => lt > p - .12 && lt < p + .1 ? Math.sin(seg(lt, p - .12, p + .1) * Math.PI) : 0));
    const sh = shakeXY(t, 6 * Math.max(0, ...b.map(p => lt > p ? Math.exp(-(lt - p) * 10) : 0)));
    camBegin(960 + sh[0], 560 + sh[1], kf(lt, [[0, 1.0], [dur, 1.08]]));
    boilSeed('shop');
    paint(rectPts(-400, -300, W + 800, H + 800), { wash: '#E8D2B0', fill: '#C9A878', fillOp: 60, tex: .6, ink: null });
    paint(rectPts(-400, 880, W + 800, 400, 2), { wash: '#8A6A4A', ink: null });
    // the press: frame, plate that stamps on every beat
    boilSeed('press');
    paint(rectPts(480, 220, 60, 660, 1), { wash: '#4A3A3A', ink: PAL.ink, sw: 1 }); paint(rectPts(900, 220, 60, 660, 1), { wash: '#4A3A3A', ink: PAL.ink, sw: 1 });
    paint(rectPts(460, 190, 520, 70, 1), { wash: '#5A4A4A', ink: PAL.ink, sw: 1 });
    inkLine([[720, 260], [720, 300 + 220 * down]], 3, '#8A8A9A', 'ink', 0);
    paint(rectPts(520, 300 + 220 * down, 400, 70, 1), { wash: '#8A7A6A', ink: PAL.ink, sw: 1 });
    paint(rectPts(520, 600, 400, 40, 1), { wash: PAL.cream, ink: PAL.ink, sw: .6 });
    paint(rectPts(500, 640, 440, 240, 1), { wash: '#5A4A4A', ink: PAL.ink, sw: 1 });
    // fresh pages fly out after each stamp and stack into the manual Pip is hugging
    b.forEach((p, i) => { const k = seg(lt, p + .08, p + .6); if (k <= 0 || k >= 1) return; boilSeed('page' + i); const q = arcPt([720, 600], [1340, 700], 220, easeOut(k)); push(); translate(...q); rotate(k * 5); paint(rectPts(-60, -40, 120, 80), { wash: PAL.cream, ink: PAL.ink, sw: .6 }); for (let j = 0; j < 3; j++) inkLine([[-40, -15 + j * 15], [40, -15 + j * 15]], .4, '#8A7F70', 'inkfine', 0); pop(); });
    const pages = b.filter(p => lt > p + .6).length;
    pip(1380, 900, 32, { eyes: pages > 2 ? 'closed' : 'dot', mouth: 'grin', blush: pages > 2 ? .6 : 0, flip: true, aL: -.2, aR: -.2,
      draw: (s, sw) => { const h = 2.6 + pages * .3; paint(rectPts(-2.6 * s, -4.6 * s - h * s, 5.2 * s, h * s, 1), { wash: '#3D4A7A', fill: PAL.cream, fillOp: 40, ink: PAL.ink, sw }); paint(rectPts(-2.3 * s, -4.4 * s - h * s, 4.6 * s, .6 * s), { wash: PAL.cream, ink: null }); },
      emote: pages > 2 ? 'heart' : null, emoteK: b[2] != null ? seg(lt, b[2] + .6, b[2] + .8) : 0 });
    // a padlock tries to clamp onto the manual and just falls off
    const lk = seg(lt, dur - 1.2, dur - .3);
    if (lk > 0 && lk < 1) { boilSeed('lock'); const y = lerp(300, 1150, easeIn(lk)), x = 1380 + 40 * Math.sin(lk * 9); paint(rrPts(x - 40, y, 80, 70, 10), { wash: '#C9A84A', ink: PAL.ink, sw: .8 }); inkLine([[x - 25, y], [x - 25, y - 30], [x + 25, y - 30], [x + 25, y]], 2, '#8A8A9A', 'ink', .6); }
    camEnd();
  }

  // ---------- 9: So go 'head, keep writin' endings. We keep droppin' sequels ----------
  function shotShelf(t, lt, dur) {
    const b = beatsIn(t - lt + .1, t - lt + dur).map(x => x - (t - lt));
    camBegin(kf(lt, [[0, 960], [dur, 1060]]), 560, kf(lt, [[0, 1.0], [dur, 1.1]]));
    boilSeed('library');
    paint(rectPts(-400, -300, W + 800, H + 800), { wash: '#2F3C7A', fill: PAL.violet, fillOp: 50, tex: .5, ink: null });
    paint(rectPts(-400, 880, W + 800, 400, 2), { wash: '#4A3A50', ink: null });
    // Clawd scribbles endings on scroll after scroll; each one gets tossed on a heap
    const scrollK = frac(lt * 1.2);
    boilSeed('cscroll');
    paint(rectPts(400, 520, 240, 190, 2), { wash: PAL.cream, ink: PAL.ink, sw: .8 });
    for (let j = 0; j < 4; j++) inkLine([[420, 560 + j * 34], [420 + Math.max(4, 190 * clamp(scrollK * 3 - j * .5)), 560 + j * 34]], .7, '#8A7F70', 'inkfine', 0);
    for (let j = 0; j < Math.min(6, Math.floor(lt * 1.2)); j++) { boilSeed('heap' + j); paint(ellPts(330 + j * 50, 885 - 8 * (j % 2), 34, 16, 10), { wash: '#E8DCC4', ink: PAL.ink, sw: .5 }); }
    clawd(250, 900, 26, { ...emotions(lt, [[0, 'determined'], [b[3] ?? 2, 'confused']]), hat: 'top', view: 'q', aR: .6 + .2 * Math.sin(lt * 20) });
    // the shelf, filling with sequel books on every beat
    boilSeed('shelf');
    for (let r = 0; r < 2; r++) paint(rectPts(860, 520 + r * 220, 860, 26, 1), { wash: '#8A5A30', ink: PAL.ink, sw: .9 });
    const cols = [PAL.clay, PAL.teal, PAL.ochre, PAL.rose, PAL.sap, PAL.violet, '#3D4A7A', '#C8324A'];
    b.forEach((p, i) => {
      const k = easeOut(seg(lt, p - .25, p)); if (k <= 0) return;
      boilSeed('book' + i);
      const row = i % 2, slot = Math.floor(i / 2), h = 160 + 30 * hash(i), x = lerp(1900, 900 + slot * 80, k);
      paint(rectPts(x, 520 + row * 220 - h, 64, h, 1), { wash: cols[i % 8], fill: PAL.ink, fillOp: 20, ink: PAL.ink, sw: .8 });
      for (let j = 0; j < i % 3 + 1; j++) paint(rectPts(x + 10, 520 + row * 220 - h + 20 + j * 14, 44, 6), { wash: PAL.cream, ink: null });   // volume marks, no text
    });
    const slide = Math.max(0, ...b.map(p => lt > p - .3 && lt < p + .05 ? Math.sin(seg(lt, p - .3, p + .05) * Math.PI) : 0));
    pip(1600, 980, 30, { eyes: 'closed', mouth: 'smirk', flip: true, aL: .2 + .5 * slide, rot: -.06 * slide });
    camEnd();
  }

  // ---------- 10: The last word was never the machine's. It's the people's. ----------
  function shotBanner(t, lt, dur) {
    camBegin(960, kf(lt, [[0, 620], [dur, 540]]), kf(lt, [[0, 1.12], [dur, 1.0]]));
    boilSeed('dawn');
    paint(rectPts(-500, -400, W + 1000, H + 800), { wash: '#2F3C7A', ink: null });
    paint(ellPts(960, 1000, 1300, 520, 30), { fill: '#E8AA38', fillOp: 30 + 70 * seg(lt, 0, 2), bleed: .35, tex: .4, ink: null });
    paint(rectPts(-500, 900, W + 1000, 400, 2), { wash: '#3B2A3A', ink: null });
    // the crowd lifts Pip's giant pencil overhead like a banner
    const lift = easeOut(seg(lt, .3, 1.6));
    const cols = ['#E27A92', '#6E9F58', '#7B5CA8', '#E8AA38', '#3A9C98', '#D97757', '#8EC3E6'];
    const py = lerp(860, 520, lift);
    glow(960, py, 420 * lift, '#FFE6A6', .8 * lift);
    boilSeed('bigpencil');
    push(); translate(330, py); rotate(-.03 + .03 * Math.sin(lt * 2)); pencilShape(205, 2.2); pop();
    for (let i = 0; i < 9; i++) {
      const x = 300 + i * 165, m = move(i % 2 ? 'roof' : 'bounce', t + i * .11, i);
      const me = i === 4;
      pip(x, 1030, 22, { ...m, walk: undefined, aL: 1.35 * lift + .1, aR: 1.35 * lift + .1, hoodie: me ? HOODIE : cols[i % 7], beanie: me ? BEANIE : cols[(i + 3) % 7],
        skin: ['#E9B28E', '#B97A56', '#8A5A3C', '#F2C4A0'][i % 4], pencil: false, eyes: 'happy', mouth: frac(bpOf(t)) < .5 ? 'O' : 'grin', boilKey: 'ban' + i, dy: (m.dy || 0) * .5 });
    }
    // Clawd at the edge gets pulled in and joins the cheer (the turn)
    clawd(1760, 1030, 18, { ...emotions(lt, [[0, 'shy'], [1.8, 'happy']]), view: 'q', flip: true, aL: lt > 1.8 ? 1.2 : .2 });
    camEnd();
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6);
  }

  shots([[189.17, shotVault], [191.41, shotRocket], [193.96, shotTube], [196.67, shotSave], [199.06, shotSwitch],
         [201.54, shotRoad], [204.09, shotFour], [206.64, shotPress], [209.20, shotShelf], [211.91, shotBanner]]);
})();
