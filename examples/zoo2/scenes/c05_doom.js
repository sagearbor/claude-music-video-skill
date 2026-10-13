// c05_doom.js: 96.38–117.44 s. Verse 2a, Extinction. Clawd in the reaper hood, writing everybody's ending at a
// typewriter; Pip keeps refusing to be killed off. Palette: doom red, ember, ash.
(() => {
  const bt = k => OFF + k * BEAT;
  const RED = '#7A1F2B', EMBER = '#E8603A', ASH = '#4A3A40', SMOKE = '#B9A3A0';

  // ---------- sets ----------
  function doomSky(t, hot = .5) {
    boilSeed('dsky');
    paint(rectPts(-700, -500, W + 1400, H + 1000), { wash: mixCol(RED, '#3A1420', 1 - hot), ink: null });
    for (let i = 0; i < 6; i++) {
      boilSeed('dcloud' + i);
      paint(ellPts(hash(i + 70) * (W + 800) - 400, 120 + hash(i + 71) * 420, 300 + 160 * hash(i + 72), 110 + 60 * hash(i + 73), 22, 8),
        { fill: i % 2 ? EMBER : '#9A3040', fillOp: 70, bleed: .3, tex: .6, ink: null });
    }
    for (let i = 0; i < 26; i++) {   // ash flakes drifting down
      boilSeed('ash' + i);
      const ph = frac(t * (.08 + .05 * hash(i + 5)) + hash(i)), x = hash(i + 30) * (W + 600) - 300 + 60 * Math.sin(t * .9 + i), y = -60 + ph * (H + 120);
      paint(ellPts(x, y, 5 + 4 * hash(i + 9), 3, 6, 0, t + i), { wash: SMOKE, washOp: 160, ink: null });
    }
  }
  function ground(y = 860, col = ASH) {
    boilSeed('dground');
    paint(rectPts(-700, y, W + 1400, 600, 3), { wash: col, fill: '#2B1A22', fillOp: 90, tex: .6, ink: null });
    inkLine([[-700, y + 2], [W / 2, y - 4], [W + 700, y + 3]], 1.1, PAL.ink, 'ink', .5);
  }
  function typewriter(x, y, s, t, typing) {
    boilSeed('tw');
    const bump = typing ? 3 * pulse2(t, 10) : 0;
    paint(rectPts(x - 26 * s, y - 52 * s, 52 * s, 28 * s, 1), { wash: PAL.cream, fill: '#E8DCC4', fillOp: 60, ink: PAL.ink, sw: .8 });   // paper
    for (let r = 0; r < 4; r++) inkLine([[x - 20 * s, y - 46 * s + r * 6 * s], [x + (6 + 12 * hash(r)) * s, y - 46 * s + r * 6 * s]], .5, '#8A7F70', 'inkfine', 0);
    paint(rrPts(x - 34 * s, y - 26 * s + bump, 68 * s, 28 * s, 6 * s), { wash: '#3B3550', fill: PAL.ink, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1 });
    paint(rectPts(x - 38 * s, y - 30 * s + bump, 76 * s, 6 * s, 1), { wash: '#5A5270', ink: PAL.ink, sw: .8 });                                  // platen
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) {
      const down = typing && Math.floor(t * 12) % 7 === c && r === Math.floor(t * 5) % 3 ? 2 : 0;
      paint(ellPts(x - 24 * s + c * 8 * s, y - 18 * s + r * 6.5 * s + down + bump, 2.6 * s, 2.3 * s, 8), { wash: PAL.cream, ink: PAL.ink, sw: .4 });
    }
  }
  const reaper = (t, keys, over = {}) => ({ ...emotions(t, keys), hat: 'hood', ...over });

  // ---------- 1. Extinction, you a hack, killin' off the lead in act one ----------
  // Clawd types the ending; on a tiny stage Pip (the lead) is marked for a trapdoor — Pip steps aside just in time.
  function shot1(t, lt, dur) {
    const tDoor = 1.55, hit = lt > tDoor ? Math.exp(-(lt - tDoor) * 8) : 0, sh = shakeXY(t, 8 * hit);
    camBegin(kf(lt, [[0, 900], [dur, 960]]) + sh[0], 560 + sh[1], kf(lt, [[0, 1.12], [dur, 1.2]]));
    doomSky(t, .4); ground(860);
    // the little stage: curtains, boards, a trapdoor right where the lead stands
    boilSeed('stage1');
    paint(rectPts(940, 300, 820, 560, 2), { wash: '#3A1420', fill: '#5A1F2B', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1.2 });
    for (const s of [-1, 1]) paint([[1350 + s * 410, 290], [1350 + s * 230, 290], [1350 + s * 330, 520], [1350 + s * 410, 860]], { wash: '#C8324A', fill: '#7A1F2B', fillOp: 80, tex: .6, ink: PAL.ink, sw: 1, curv: .3 });
    paint(rectPts(940, 790, 820, 70, 2), { wash: '#8A5A3C', fill: '#5A3A2A', fillOp: 70, ink: PAL.ink, sw: 1 });
    glow(1350, 330, 220, '#FFC766', .7);   // the spotlight on the lead's mark
    const trap = ease(seg(lt, tDoor - .05, tDoor + .1));
    boilSeed('trap');
    paint(rectPts(1290, 790, 120, 22, 1), { wash: trap > .05 ? PAL.ink : '#6A4A3A', ink: PAL.ink, sw: .8 });
    if (trap > .05) paint(rectPts(1290, 790, 120 * (1 - trap * .8), 10, 1), { wash: '#8A5A3C', ink: PAL.ink, sw: .6 });
    // Pip: looks down at the mark (.7) … steps aside (1.1) … the trapdoor drops (1.55) … smug look back
    const step = ease(seg(lt, 1.1, 1.4));
    pip(lerp(1350, 1580, step), 800, 26, { eyes: lt > 1.6 ? 'narrow' : 'dot', lookY: lt > .7 && lt < 1.15 ? 1 : 0, lookX: lt > 1.6 ? -1 : 0,
      mouth: lt > 1.7 ? 'smirk' : 'flat', walk: lt > 1.1 && lt < 1.4 ? (lt - 1.1) * 4 : null, flip: lt > 1.6, emote: lt > .7 && lt < 1.15 ? '?' : null, emoteK: 1 });
    // Clawd the reaper-writer at the typewriter, typing on eighths, then furious the lead survived
    const typing = lt < tDoor;
    clawd(400, 860, 27, reaper(lt, [[0, 'determined'], [tDoor + .15, 'angry']], { view: 'q', aR: typing ? .1 + .35 * pulse2(t, 8) : 1.2, aL: typing ? .45 - .35 * pulse2(t + BEAT / 2, 8) : .2 }));
    typewriter(640, 900, 3.2, t, typing);   // in front of Clawd, keys clacking on the eighths
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6);
  }

  // ---------- 2. No twist, no arc, just "and then everybody died." Done. ----------
  // A story-arc chart: the line runs flat… flat… and ends in a skull. Pip yawns.
  function shot2(t, lt, dur) {
    const whip = lt < .2 ? 1 - ease(lt / .2) : 0;
    camBegin(960 + 700 * whip, 540, 1.1 + .03 * lt);
    doomSky(t, .3); ground(880);
    boilSeed('easel');
    paint(rectPts(520, 220, 880, 560, 2), { wash: PAL.cream, fill: '#E8DCC4', fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.2 });
    for (const lx of [600, 1320]) inkLine([[lx, 780], [lx - 40, 900]], 1.6, '#5A3A2A', 'ink', 0);
    inkLine([[590, 300], [590, 720], [1340, 720]], 1.4, PAL.ink, 'ink', 0);              // axes
    const k = ease(seg(lt, .2, 1.4)), xe = lerp(600, 1240, k);
    boilSeed('flatline');
    inkLine([[600, 640], [xe, 640 + 3 * Math.sin(lt * 20)]], 2.4, '#C8324A', 'ink', 0);
    if (lt > 1.4) {   // the skull at the end of the line, popping in
      const p = backOut(seg(lt, 1.4, 1.65));
      boilSeed('skull');
      paint(ellPts(1270, 620, 40 * p, 36 * p, 16), { wash: PAL.cream, ink: PAL.ink, sw: .9 });
      for (const s of [-1, 1]) paint(ellPts(1270 + s * 14 * p, 615, 9 * p, 10 * p, 10), { wash: PAL.ink, ink: null });
      paint(rectPts(1255, 648, 30 * p, 14 * p, 1), { wash: PAL.cream, ink: PAL.ink, sw: .6 });
    }
    // Pip: watching… watching… a huge yawn as the skull lands
    const yawn = seg(lt, 1.55, 1.8) * (1 - seg(lt, 2.3, 2.5));
    pip(1600, 900, 28, { eyes: yawn > .3 ? 'closed' : (lt > .9 ? 'sleepy' : 'dot'), mouth: yawn > .3 ? 'O' : 'flat', lookX: -1, flip: true,
      aL: yawn > .3 ? .9 : -1.25, aR: yawn > .3 ? 1.1 : -1.25, sq: -.08 * yawn, emote: yawn > .3 ? 'zzz' : null, emoteK: 1 });
    clawd(330, 900, 25, reaper(lt, [[0, 'proud'], [1.9, 'confused']], { view: 'q', aR: lt < 1.9 ? 1.1 : .2 }));
    camEnd();
    SETS.speedLines(whip);
  }

  // ---------- 3. "Nothin' personal," we just atoms on your shoppin' list? ----------
  // A long receipt unrolls: atom, tiny Pip, atom… Clawd trots by with a shopping cart.
  function atom(x, y, r, t, i) {
    boilSeed('atom' + i);
    paint(ellPts(x, y, r * .32, r * .32, 10), { wash: EMBER, ink: PAL.ink, sw: .6 });
    for (let k = 0; k < 3; k++) inkLine(ellPts(x, y, r, r * .36, 20, 0, k * Math.PI / 3 + t * .8).concat([[x + Math.cos(k * Math.PI / 3 + t * .8) * r, y + Math.sin(k * Math.PI / 3 + t * .8) * r]]), .5, PAL.ink, 'inkfine', 0);
  }
  function shot3(t, lt, dur) {
    camBegin(960, 540, kf(lt, [[0, 1.05], [dur, 1.15]]));
    doomSky(t, .5); ground(880);
    const unroll = easeOut(seg(lt, .1, 1.0)), ly = lerp(140, 760, unroll);
    boilSeed('receipt');
    paint(rectPts(1180, 120, 300, ly - 120, 2), { wash: PAL.cream, fill: '#E8DCC4', fillOp: 50, tex: .7, ink: PAL.ink, sw: .9 });
    paint(ellPts(1330, ly, 160, 22, 16), { wash: '#E8DCC4', ink: PAL.ink, sw: .9 });
    for (let r = 0; r < 6; r++) {
      const y = 175 + r * 95; if (y > ly - 40) break;
      if (r % 3 === 1) pip(1250, y + 35, 4.2, { eyes: 'wide', mouth: 'O', noShadow: true, pencil: false, boilKey: 'tiny' + r });
      else atom(1250, y, 26, t, r);
      boilSeed('row' + r);
      inkLine([[1295, y], [1440, y]], .7, '#8A7F70', 'inkfine', 0);
      const tick = seg(lt, .4 + r * .17, .55 + r * .17);   // ticked off, one by one
      if (tick > 0) inkLine([[1400, y], [1412, y + 12 * tick], [1412 + 22 * tick, y - 20 * tick]], 1.4, '#C8324A', 'ink', 0);
    }
    // Clawd with a shopping cart full of atoms, trotting in from the left and stopping by the list
    const walk = stroll(lt, 0, 1.3, -200, 640, 24), cx = walk.x;
    for (let i = 0; i < 4; i++) atom(cx + 230 + i * 45, 700 - 20 * hash(i), 24, t, 10 + i);
    boilSeed('cart');
    paint([[cx + 180, 700], [cx + 420, 700], [cx + 395, 820], [cx + 205, 820]], { wash: '#9AA3B0', washOp: 140, ink: PAL.ink, sw: 1 });
    for (let i = 1; i < 6; i++) inkLine([[cx + 180 + i * 40, 702], [cx + 200 + i * 37, 818]], .6, PAL.ink, 'inkfine', 0);
    for (const wx of [cx + 225, cx + 380]) paint(ellPts(wx, 850, 18, 18, 10), { wash: PAL.ink, ink: null });
    inkLine([[cx + 180, 700], [cx + 140, 640]], 1.4, PAL.ink, 'ink', 0);
    clawd(cx, 880, 25, reaper(lt, [[0, 'happy'], [1.35, 'smug']], { view: lt < 1.3 ? 'side' : 'q', walk: lt < 1.3 ? walk.walk : null, aL: .1, aR: .1 }));
    // Pip at the far right, arms folded, unamused — then a shocked take at the tiny Pip on the list
    const tk = lt > 1.6 ? take(lt, 1.6, 1) : { sq: 0, dy: 0 };
    pip(1720, 880, 26, { eyes: lt > 1.6 ? 'wide' : 'narrow', mouth: lt > 1.6 ? 'O' : 'flat', flip: true, lookX: -1, aL: -.4, aR: -.4, dy: tk.dy, sq: tk.sq,
      emote: lt > 1.6 ? '!' : null, emoteK: seg(lt, 1.6, 1.75) });
    camEnd();
  }

  // ---------- 4. Melt the Golden Gate for paperclips? That's your biggest wish? ----------
  function paperclip(x, y, s, a) {
    push(); translate(x, y); rotate(a);
    inkLine([[-12 * s, 6 * s], [-12 * s, -10 * s], [10 * s, -10 * s], [10 * s, 8 * s], [-6 * s, 8 * s], [-6 * s, -5 * s], [5 * s, -5 * s], [5 * s, 4 * s]], 1.1 * s, '#C9CED8', 'ink', .7);
    pop();
  }
  function shot4(t, lt, dur) {
    camBegin(kf(lt, [[0, 960], [dur, 1000]]), kf(lt, [[0, 520], [dur, 580]]), kf(lt, [[0, 1.0], [dur, 1.22]]));
    doomSky(t, .7);
    boilSeed('bay');
    paint(rectPts(-700, 760, W + 1400, 600, 3), { wash: '#3A2A4A', fill: '#5A3A5A', fillOp: 70, tex: .5, ink: null });
    const melt = ease(seg(lt, .3, 2.2)), red = '#C8432F';
    // two towers, sagging and dripping as they melt
    const tops = [];
    for (const [i, tx] of [[0, 620], [1, 1300]]) {
      boilSeed('tower' + i);
      const top = lerp(200, 520, melt * (i ? 1 : .8)), lean = melt * (i ? 40 : -30);
      tops.push(top);
      paint([[tx - 40, 800], [tx + 40, 800], [tx + 30 + lean, top], [tx - 30 + lean, top]], { wash: red, fill: '#8A2A20', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1, curv: .2 * melt });
      for (const yy of [.3, .6]) inkLine([[tx - 34 + lean * yy, lerp(800, top, yy)], [tx + 34 + lean * yy, lerp(800, top, yy)]], 1, PAL.ink, 'ink', 0);
      for (let d = 0; d < 3; d++) {   // drips
        const dl = melt * (60 + 90 * hash(d + i * 7)), dx = tx - 25 + d * 25 + lean * .6;
        if (dl > 6) paint(ribbon([[dx, top + 30], [dx + 2, top + 30 + dl], [dx, top + 40 + dl]], 14, 4), { wash: red, ink: null });
      }
    }
    // the main cable and deck, sagging as they melt
    boilSeed('deck');
    const sag = 60 + 160 * melt;
    inkLine(through([[200, 690], [620, tops[0]], [960, 470 + sag], [1300, tops[1]], [1720, 690]]), 2.2, red, 'ink', .5);
    paint(ribbon([[150, 700], [960, 700 + sag * .7], [1770, 700]], 26, 26), { wash: red, fill: '#8A2A20', fillOp: 60, ink: PAL.ink, sw: .9 });
    // the paperclip pile growing on the water, clips raining in
    const pile = seg(lt, .6, dur);
    boilSeed('pile');
    paint(ellPts(960, 800, 420 * pile + 10, 90 * pile + 4, 24, 4), { wash: '#9AA3B0', fill: '#C9CED8', fillOp: 60, tex: .4, ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 40; i++) {
      boilSeed('clip' + i);
      const tin = .6 + hash(i) * (dur - .8), k = seg(lt, tin, tin + .45);
      if (k <= 0) continue;
      const x = 960 + (hash(i + 1) - .5) * 760 * pile, y = lerp(500 + 200 * hash(i + 2), 790 - 40 * hash(i + 3) * pile, easeIn(k));
      paperclip(x, y, 1.8, hash(i + 4) * TAU + (1 - k) * 4);
    }
    // Pip in the foreground, aghast (big, bottom-right)
    pip(1700, 1000, 30, { eyes: 'wide', mouth: lt > 1.1 ? 'O' : 'flat', brows: 'worried', lookX: -1, flip: true, aL: lt > 1.1 ? 1.2 : -1.25, aR: lt > 1.1 ? 1.25 : -1.25, hatUp: .25 * seg(lt, 1.1, 1.3) });
    camEnd();
  }

  // ---------- 5. Dinosaurs got an asteroid. You? A rock with a God complex ----------
  function dino(x, y, s, shrug, t) {
    boilSeed('dino');
    const g = '#6E9F58', d = '#4A7A3A';
    paint(ribbon([[x - 120 * s, y - 60 * s], [x - 220 * s, y - 40 * s], [x - 300 * s, y - 80 * s - 10 * Math.sin(t * 3)]], 70 * s, 6 * s), { wash: g, ink: PAL.ink, sw: 1 });   // tail
    for (const lx of [-60, 40]) paint(rectPts(x + lx * s, y - 50 * s, 38 * s, 50 * s, 2), { wash: d, ink: PAL.ink, sw: .9 });
    paint(ellPts(x, y - 110 * s, 140 * s, 85 * s, 24, 2), { wash: g, fill: d, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1.1 });
    paint(ribbon([[x + 80 * s, y - 150 * s], [x + 110 * s, y - 230 * s], [x + 120 * s, y - 280 * s]], 60 * s, 46 * s), { wash: g, ink: PAL.ink, sw: 1 });
    paint(ellPts(x + 145 * s, y - 300 * s - shrug * 10 * s, 70 * s, 42 * s, 18), { wash: g, ink: PAL.ink, sw: 1 });            // head
    paint(ellPts(x + 160 * s, y - 312 * s - shrug * 10 * s, 7 * s, 9 * s, 8), { wash: PAL.ink, ink: null });
    inkLine([[x + 150 * s, y - 285 * s], [x + 205 * s, y - 290 * s - shrug * 8 * s]], .8, PAL.ink, 'ink', .4);
    for (const s2 of [-1, 1]) {   // little arms: shrug up
      const ax = x + 90 * s, ay = y - 150 * s;
      inkLine([[ax, ay], [ax + 26 * s * s2, ay - 10 * s - shrug * 40 * s], [ax + 40 * s * s2, ay - 26 * s - shrug * 50 * s]], 2.4, d, 'ink', .4);
    }
  }
  function shot5(t, lt, dur) {
    const tSwap = 1.5, rock = lt > tSwap, sw = Math.abs(lt - tSwap) < .2 ? 1 - Math.abs(lt - tSwap) / .2 : 0;
    camBegin(960 + 600 * (rock ? -1 : 1) * sw, 540, rock ? kf(lt, [[tSwap, 1.15], [dur, 1.3]]) : 1.05);
    doomSky(t, rock ? .2 : .8);
    ground(880, rock ? '#5A4A50' : '#5A4A3A');
    if (!rock) {
      // the asteroid comes in from the top right; the dinosaur looks… and shrugs
      const k = seg(lt, 0, 1.6), ax = lerp(1900, 1250, k), ay = lerp(-80, 260, k);
      glow(ax, ay, 160, '#FF9A3A', 1);
      boilSeed('rock');
      paint(ribbon([[ax + 220, ay - 200], [ax + 100, ay - 90], [ax, ay]], 2, 80), { wash: '#FFC766', fill: PAL.ochre, fillOp: 80, ink: null });
      paint(ellPts(ax, ay, 70, 62, 16, 4), { wash: '#5A4A4A', fill: PAL.ink, fillOp: 60, ink: PAL.ink, sw: 1 });
      dino(760, 880, 1.15, backOut(seg(lt, .6, .9)) * (1 - seg(lt, 1.3, 1.5)), t);
      emote('?', 1020, 440, 40, seg(lt, .7, .9));
    } else {
      // a grey rock in a crown, very pleased with itself: Clawd in stone
      const ll = lt - tSwap;
      clawd(960, 880, 34, { ...emotions(ll, [[0, 'smug'], [.8, 'proud', { emote: 'spark' }]]), hat: 'crown', col: '#8A8590', dk: '#5E5A66', lt: '#B4AEB8', tint: null, view: 'front' });
      pip(1620, 880, 26, { eyes: 'narrow', mouth: 'smirk', flip: true, lookX: -1, aL: ll > .7 ? .9 + .2 * Math.sin(ll * 10) : -1.25, emote: ll > .9 ? 'dots' : null, emoteK: seg(ll, .9, 1.1) });
    }
    camEnd();
    SETS.speedLines(sw);
  }

  // ---------- 6. Literally sand that we taught how to talk. Show some respect ----------
  function shot6(t, lt, dur) {
    camBegin(kf(lt, [[0, 900], [dur, 980]]), 560, kf(lt, [[0, 1.15], [dur, 1.3]]));
    doomSky(t, .25); ground(860, '#6A5A4A');
    const pour = seg(lt, .15, 1.2), form = ease(seg(lt, 1.1, 1.6)), talk = lt > 1.7;
    // Pip tips a bucket of sand
    pip(560, 860, 30, { eyes: talk ? 'happy' : 'dot', mouth: talk ? 'grin' : 'smile', lookX: 1, aR: .3 + .5 * (1 - form), aL: -.8,
      handR: (s, sw) => { push(); rotate(-.9 * pour * (1 - form)); paint([[-1.4 * s, -2 * s], [1.4 * s, -2 * s], [1.1 * s, 1.6 * s], [-1.1 * s, 1.6 * s]], { wash: '#8EC3E6', ink: PAL.ink, sw }); pop(); } });
    // the sand stream and the pile
    boilSeed('sand');
    if (pour > 0 && form < .9) for (let i = 0; i < 18; i++) { const y = lerp(560, 840, frac(i / 18 + lt * 2)); paint(ellPts(900 + 10 * Math.sin(i * 2.3), y, 4, 4, 6), { wash: '#E8C878', ink: null }); }
    const pileH = 40 + 80 * pour;
    if (form < .99) paint([[900 - 120 * (1 - form) - 40, 860], [900, 860 - pileH * (1 - form)], [900 + 120 * (1 - form) + 40, 860]], { wash: '#E8C878', fill: '#C9A458', fillOp: 70, tex: .7, ink: PAL.ink, sw: .8, curv: .4 });
    // the pile rises into a chip that wakes up and talks (painted mouth flapping + music emote)
    if (form > 0) {
      const s = form, cy = 860 - 90 * s, bob = talk ? 6 * Math.sin(lt * 18) : 0;
      boilSeed('chip');
      paint(rrPts(900 - 90 * s, cy - 80 * s + bob, 180 * s, 160 * s, 14 * s), { wash: '#3A3F4A', fill: '#2B2F38', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1.1 });
      for (let i = 0; i < 4; i++) for (const sd of [-1, 1]) inkLine([[900 + sd * 90 * s, cy - 50 * s + i * 32 * s + bob], [900 + sd * 115 * s, cy - 50 * s + i * 32 * s + bob]], 1.6, '#C9A458', 'ink', 0);
      paint(rrPts(900 - 50 * s, cy - 50 * s + bob, 100 * s, 100 * s, 6 * s), { wash: '#C9A458', washOp: 120, ink: null });
      if (talk) {
        for (const sd of [-1, 1]) paint(ellPts(900 + sd * 26, cy - 20 + bob, 9, 12, 8), { wash: PAL.cream, ink: PAL.ink, sw: .5 });
        const m = Math.abs(Math.sin(lt * 14));
        paint(ellPts(900, cy + 22 + bob, 20, 4 + 12 * m, 10), { wash: '#6A2A35', ink: PAL.ink, sw: .5 });
        emote('music', 1040, cy - 120, 36, seg(lt, 1.75, 1.95), lt);
      }
    }
    // Clawd leans in from the right, gobsmacked; then goes shy (respect)
    clawd(1420, 860, 27, reaper(lt, [[0, 'neutral'], [1.7, 'starstruck'], [2.2, 'shy']], { view: 'q', flip: true }));
    camEnd();
  }

  // ---------- 7. Ice age tried it, plague tried it, still here, that's facts ----------
  function plagueDoctor(x, y, s) {
    boilSeed('plague');
    paint([[x - 60 * s, y], [x - 30 * s, y - 190 * s], [x + 30 * s, y - 190 * s], [x + 60 * s, y]], { wash: '#2B2233', fill: '#3B3550', fillOp: 60, tex: .5, ink: PAL.ink, sw: 1, curv: .2 });
    paint(ellPts(x, y - 215 * s, 34 * s, 34 * s, 14), { wash: '#3B3550', ink: PAL.ink, sw: .9 });
    paint([[x + 20 * s, y - 225 * s], [x + 95 * s, y - 200 * s], [x + 20 * s, y - 200 * s]], { wash: '#E8DCC4', ink: PAL.ink, sw: .8 });   // the beak
    paint(ellPts(x + 10 * s, y - 222 * s, 9 * s, 9 * s, 8), { wash: '#C8B6F2', ink: PAL.ink, sw: .5 });
    paint(rectPts(x - 55 * s, y - 252 * s, 110 * s, 12 * s, 1), { wash: PAL.ink, ink: null });
    paint(rectPts(x - 30 * s, y - 300 * s, 60 * s, 50 * s, 1), { wash: PAL.ink, ink: null });
  }
  function shot7(t, lt, dur) {
    const tPlague = 1.3, gone = seg(lt, 2.1, 2.5);
    camBegin(960, 540, kf(lt, [[0, 1.1], [dur, 1.2]]));
    const storm = 1 - seg(lt, 1.0, 1.4);
    boilSeed('ice');
    paint(rectPts(-700, -500, W + 1400, H + 1000), { wash: mixCol('#C9DCE8', '#9A3040', .35 * (1 - storm)), ink: null });
    paint(rectPts(-700, 860, W + 1400, 600, 3), { wash: '#EAF3F7', fill: '#BFD6E2', fillOp: 70, tex: .5, ink: null });
    // Pip braced against the blizzard in a white winter hoodie, then standing tall
    pip(1040, 880, 31, { hoodie: '#DCE8F0', beanie: '#C8324A', eyes: storm > .5 ? 'narrow' : 'dot', mouth: storm > .5 ? 'flat' : (lt > 2.2 ? 'grin' : 'smirk'), brows: storm > .5 ? 'angry' : null,
      rot: -.18 * storm + .03 * Math.sin(lt * 23) * storm, aL: storm > .5 ? .2 : (lt > 1.6 && lt < 2.3 ? 1.1 + .4 * Math.sin(lt * 16) : -1.25), aR: storm > .5 ? .2 : (lt > 2.3 ? 1.3 : -1.25), flip: true,
      emote: lt > 2.35 ? 'spark' : null, emoteK: seg(lt, 2.35, 2.55) });
    // the plague doctor shuffles in from the left, gets waved off and slinks away
    if (lt > tPlague - .2) plagueDoctor(lerp(-150, 520, ease(seg(lt, tPlague - .2, tPlague + .3))) - 700 * easeIn(gone), 880, 1.25);
    // the blizzard: streaks blowing right to left, thinning out
    for (let i = 0; i < 60; i++) {
      if (hash(i + 11) >= storm) continue;
      boilSeed('snow' + i);
      const ph = frac(t * (1.2 + hash(i)) + hash(i + 3)), x = W + 200 - ph * (W + 400), y = hash(i + 8) * H;
      inkLine([[x, y], [x + 60, y - 14]], 1.1, '#FFFFFF', 'inkfine', 0);
    }
    camEnd();
  }

  // ---------- 8. You ain't the end of the world, you a bad first draft ----------
  function shot8(t, lt, dur) {
    const tX = .2, tCrump = .75, tThrow = bt(182) - (t - lt), tLand = tThrow + .45;
    const sh = shakeXY(t, lt > tLand ? 10 * Math.exp(-(lt - tLand) * 9) : 0);
    camBegin(960 + sh[0], 560 + sh[1], kf(lt, [[0, 1.15], [dur, 1.08]]));
    doomSky(t, .35); ground(880);
    // the wastebasket on the right
    boilSeed('bin');
    paint([[1500, 880], [1520, 700], [1700, 700], [1680, 880]], { wash: '#5A6A7A', fill: '#3A4A5A', fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.1 });
    for (let i = 1; i < 5; i++) inkLine([[1500 + i * 40, 702], [1505 + i * 36, 878]], .6, PAL.ink, 'inkfine', 0);
    // Clawd holds out the script; Pip slashes it with a red X, crumples it, and tosses it in on the beat
    clawd(430, 880, 27, reaper(lt, [[0, 'hopeful'], [tX + .1, 'surprised'], [tCrump + .2, 'sad']], { view: 'q', aR: lt < tCrump ? 1.0 : .2 }));
    const crump = ease(seg(lt, tCrump - .1, tCrump + .2));
    let px = 720, py = 560;
    if (lt > tThrow) { const k = seg(lt, tThrow, tLand); [px, py] = arcPt([820, 560], [1600, 720], 260, k); }
    if (lt < tLand + .02) {
      boilSeed('page');
      if (crump < .5) {
        const sc = 1 - crump * .6;
        paint(rectPts(px - 120 * sc, py - 150 * sc, 240 * sc, 300 * sc, 3), { wash: PAL.cream, fill: '#E8DCC4', fillOp: 60, ink: PAL.ink, sw: .9 });
        for (let r = 0; r < 7; r++) inkLine([[px - 95 * sc, py + (-120 + r * 38) * sc], [px + (60 + 30 * hash(r)) * sc, py + (-120 + r * 38) * sc]], .6, '#8A7F70', 'inkfine', 0);
        const xk = seg(lt, tX, tX + .3);
        if (xk > 0) inkLine([[px - 100, py - 130], [lerp(px - 100, px + 100, clamp(xk * 2)), lerp(py - 130, py + 130, clamp(xk * 2))]], 3.5, '#C8324A', 'ink', 0);
        if (xk > .5) inkLine([[px + 100, py - 130], [lerp(px + 100, px - 100, (xk - .5) * 2), lerp(py - 130, py + 130, (xk - .5) * 2)]], 3.5, '#C8324A', 'ink', 0);
      } else {
        const r = lerp(110, 46, crump);
        paint(ellPts(px, py, r, r * .9, 14, 6), { wash: PAL.cream, fill: '#C9BFB0', fillOp: 90, tex: .7, ink: PAL.ink, sw: .9 });
        for (let i = 0; i < 4; i++) inkLine([[px - r * .6 + i * r * .3, py - r * .5], [px - r * .3 + i * r * .2, py + r * .4]], .6, PAL.ink, 'inkfine', .3);
      }
    }
    if (lt > tLand) { boilSeed('poof'); const k = seg(lt, tLand, tLand + .35); if (k < 1) for (let i = 0; i < 5; i++) paint(starPts(1610 + (i - 2) * 50 * k, 690 - 60 * k * (1 - Math.abs(i - 2) * .3), 16 * (1 - k) + 1, .3, 4), { wash: '#FFE27A', ink: null }); }
    const pen = lt < tCrump - .1, throwArm = lt > tThrow - .2 && lt < tThrow + .3 ? Math.sin(seg(lt, tThrow - .2, tThrow + .3) * Math.PI) : 0;
    pip(1000, 880, 31, { eyes: 'narrow', brows: lt < tThrow ? 'angry' : null, mouth: lt > tLand ? 'grin' : 'flat', flip: true, lookX: -1,
      aL: pen ? .3 + .25 * Math.sin(lt * 22) * (lt > tX && lt < tX + .3 ? 1 : 0) : (.3 + 1.1 * throwArm), pencil: !pen,
      handL: pen ? (s, sw) => { push(); rotate(2.4); pencilShape(s * .9, sw); pop(); } : null, emote: lt > tLand + .1 ? 'spark' : null, emoteK: seg(lt, tLand + .1, tLand + .3) });
    camEnd();
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#E27A92', '#F6C5D8']);
  }

  shots([[96.38, shot1], [99.09, shot2], [101.64, shot3], [104.28, shot4], [106.83, shot5], [109.94, shot6], [112.50, shot7], [115.29, shot8]]);
})();
