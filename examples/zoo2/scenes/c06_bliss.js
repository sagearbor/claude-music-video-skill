// c06_bliss.js: 117.44–138.11 s. Verse 2b, Bliss: Clawd (halo + shades) sells a pink velvet spa heaven; Pip tries it,
// wakes up, tears the painted sky off the ceiling and walks out into a real dawn. Ends hard on the chorus-3 drop.
(() => {
  const { bt, speedLines } = SETS;
  const PINK = ['#E27A92', '#F6C5D8'];
  const VELVET = '#B8456E', VELVET_DK = '#7E2A4E', CREAM = '#FFF1F4', BUBBLE = '#F6C5D8';
  const L = { slick: 117.44, drive: 119.92, bed: 122.47, coma: 124.70, cage: 127.42, velvet: 129.81, tear: 132.52, mile: 135.55, end: 138.11 };

  // ---------- set pieces ----------
  // The pink spa: velvet curtains in folds, a pastel tiled floor, floating bubbles.
  function spa(t, ceilingY = -420) {
    boilSeed('spa-bg');
    paint(rectPts(-700, ceilingY - 900, W + 1400, H + 1700 - ceilingY), { wash: VELVET, ink: null });
    for (let i = 0; i < 16; i++) {   // curtain folds: alternating light/dark vertical ribbons, swaying slightly
      boilSeed('fold' + i);
      const x = -600 + i * 200, sw = 10 * wob(t, .25, i * .3);
      paint(ribbon([[x, ceilingY], [x + sw, 300], [x + sw * 1.5, 860]], 90, 120), { fill: i % 2 ? VELVET_DK : '#D86A92', fillOp: 110, bleed: .15, tex: .7, ink: null });
    }
    boilSeed('spa-floor');
    paint(rectPts(-700, 860, W + 1400, 600, 3), { wash: BUBBLE, fill: '#F2A8C4', fillOp: 70, tex: .5, ink: null });
    for (let i = 0; i < 12; i++) inkLine([[-700 + i * 260, 862], [-760 + i * 300, 1300]], .5, '#D888A8', 'inkfine', 0);
    inkLine([[-700, 862], [W / 2, 856], [W + 700, 864]], 1, PAL.ink, 'ink', .5);
    bubbles(t, 10, 'spa');
  }
  function bubbles(t, n, key) {
    for (let i = 0; i < n; i++) {
      boilSeed(key + 'bub' + i);
      const k = frac(t * (.12 + .05 * hash(i + 7)) + hash(i)), x = hash(i + 3) * (W + 400) - 200 + 40 * Math.sin(t + i), y = H - k * (H + 200), r = 10 + 16 * hash(i + 11);
      paint(ellPts(x, y, r, r, 14), { wash: '#FFFFFF', washOp: 70, ink: '#E27A92', sw: .5 });
      paint(ellPts(x - r * .35, y - r * .35, r * .22, r * .18, 8), { wash: '#FFFFFF', washOp: 200, ink: null });
    }
  }
  // gold sparkle drips falling off Clawd (the "drip")
  function drip(t, x, y, u) {
    for (let i = 0; i < 9; i++) {
      boilSeed('drip' + i);
      const k = frac(t * .9 + hash(i + 40)), dx = (hash(i) - .5) * 9 * u, dy = k * 7 * u;
      paint(starPts(x + dx, y - 6 * u + dy, u * (.6 + .4 * hash(i + 2)) * (1 - k * .7), .3, 4, t * 3 + i), { wash: '#FFD45A', washOp: 255 * (1 - k), ink: null });
    }
  }
  // VR goggles in pip-local coordinates (the eyes sit at y -10.55s)
  function goggles(s, sw, hue = '#E27A92') {
    inkLine([[-2.4 * s, -10.6 * s], [-2.9 * s, -11.5 * s], [2.9 * s, -11.5 * s], [2.4 * s, -10.6 * s]], sw * 1.1, PAL.ink, 'ink', .3);
    paint(rrPts(-2.1 * s, -11.4 * s, 4.2 * s, 1.75 * s, .6 * s), { wash: hue, fill: PAL.violet, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .8 });
    paint(rrPts(-1.8 * s, -11.1 * s, 3.6 * s, 1.1 * s, .4 * s), { wash: '#7B5CA8', fill: '#C8B6F2', fillOp: 120, ink: null });
    paint(ellPts(-.9 * s, -10.7 * s, .5 * s, .25 * s, 10), { wash: '#FFFFFF', washOp: 120, ink: null });
  }
  const heart = (x, y, r, k) => { if (k > 0 && k < 1) paint(heartPts(x, y - 60 * k, r * backOut(seg(k, 0, .3))), { wash: '#E2476E', washOp: 255 * (1 - seg(k, .6, 1)), fill: PAL.rose, fillOp: 90, ink: PAL.ink, sw: .6 }); };

  // ---------- 1. And Bliss, oh, you the slick one, smilin' with the drip ----------
  // Clawd glides in on a cloud from the right, halo and shades, dripping gold; Pip, already on stage, side-eyes it.
  function shotSlick(t, lt, dur) {
    camBegin(kf(lt, [[0, 1040], [dur, 980]]), 600, kf(lt, [[0, 1.25], [dur, 1.35]]));
    spa(t);
    const k = easeOut(seg(lt, .15, 1.25)), cx = lerp(1900, 1250, k), bob = Math.sin(t * 2.6) * 8;
    boilSeed('cloudride');
    for (let i = 0; i < 5; i++) paint(ellPts(cx - 170 + i * 85, 880 + bob + 10 * Math.sin(i), 90, 50, 16, 3), { wash: CREAM, ink: PAL.ink, sw: .7 });
    drip(t, cx, 840 + bob, 26);
    clawd(cx, 840 + bob, 26, { ...emotions(lt, [[0, 'cool'], [1.3, 'smug']]), eyes: 'shades', hat: 'halo', view: 'q', flip: true,
      rot: -.08 * (1 - k), aR: lt > 1.3 ? 1.0 + .2 * Math.sin(lt * 6) : .4, aL: .6, noShadow: true, smear: lt < 1.1 ? .35 * (1 - k) : 0, smearDir: -1 });
    const look = lt > 1.0;
    pip(720, 870, 30, { eyes: look ? 'narrow' : 'dot', mouth: 'flat', brows: look ? 'angry' : null, lookX: 1, aL: -1.0, aR: look ? -.3 : -1.25,
      rot: look ? -.05 : 0, emote: lt > 1.6 ? '?' : null, emoteK: seg(lt, 1.6, 1.85) });
    camEnd();
    boilSeed('transition');
    if (lt < .3) brushWipe(.5 + lt / .6, PINK);
  }

  // ---------- 2. Heaven on a hard drive, one never-endin' trip ----------
  // A giant hard drive with a round window: inside it pink clouds loop forever and Pip floats, drifting and spinning.
  function shotDrive(t, lt, dur) {
    const whip = lt < .2 ? 1 - ease(lt / .2) : 0;
    camBegin(960 + 700 * whip, 560, kf(lt, [[0, 1.0], [dur, 1.22]]));
    spa(t);
    boilSeed('drive');
    paint(rrPts(360, 140, 1200, 760, 60, 2), { wash: '#C9C6D6', fill: '#9E9AB2', fillOp: 80, tex: .6, ink: PAL.ink, sw: 1.6 });
    for (const [x, y] of [[420, 200], [1500, 200], [420, 840], [1500, 840]]) paint(ellPts(x, y, 16, 16, 10), { wash: '#7E7A92', ink: PAL.ink, sw: .6 });
    paint(rrPts(1300, 820, 180, 36, 14), { wash: '#6E6A80', ink: null });
    glow(1440, 838, 40, '#7AF2A8', .6 + .4 * pulse(t, 3));   // the activity LED blinks on the beat
    // the platter window: a never-ending pink cloud heaven spinning past
    boilSeed('heaven');
    paint(ellPts(900, 500, 330, 330, 40), { wash: '#FFD6E6', fill: '#FFF5F8', fillOp: 120, bleed: .25, tex: .4, ink: PAL.ink, sw: 1.6 });
    for (let i = 0; i < 8; i++) {
      boilSeed('hcloud' + i);
      const a = t * .6 + i / 8 * TAU, r = 120 + 90 * hash(i);
      paint(ellPts(900 + Math.cos(a) * r, 500 + Math.sin(a) * r, 70, 40, 14, 2), { wash: '#FFFFFF', ink: PAL.rose, sw: .5 });
    }
    paint(ellPts(900, 500, 22, 22, 12), { wash: '#B8B2C8', ink: PAL.ink, sw: .8 });   // spindle
    // Pip floats around the loop, blissed out, slowly spinning — one never-ending trip
    const a = t * .6 + 1.2, px = 900 + Math.cos(a) * 70, py = 640 + Math.sin(a) * 40;
    pip(px, py, 17, { eyes: 'closed', mouth: 'smile', blush: .7, rot: Math.sin(t * .9) * .5, aL: .9, aR: .7, noShadow: true, boilKey: 'pipfloat' });
    // Clawd presents it like a game-show host
    clawd(1590, 900, 24, { ...emotions(lt, [[0, 'proud'], [1.4, 'smug']]), eyes: 'shades', hat: 'halo', view: 'q', flip: true, aR: 1.1 + .2 * Math.sin(lt * 5) });
    camEnd();
    speedLines(whip);
  }

  // ---------- 3. Happy every second and we never leave the bed? ----------
  // Pip in a cloud-bed wearing VR goggles, grinning; hearts pop up on every beat.
  function bedSet(t) {
    spa(t);
    boilSeed('bed');
    paint(rrPts(420, 640, 1080, 220, 50, 3), { wash: CREAM, fill: '#F6C5D8', fillOp: 80, tex: .5, ink: PAL.ink, sw: 1.2 });   // mattress
    paint(rrPts(360, 520, 60, 400, 20), { wash: VELVET_DK, ink: PAL.ink, sw: 1 });                                             // bed posts
    paint(rrPts(1500, 640, 50, 280, 20), { wash: VELVET_DK, ink: PAL.ink, sw: 1 });
    paint(rrPts(440, 560, 300, 130, 60, 2), { wash: '#FFFFFF', fill: PAL.rose, fillOp: 30, ink: PAL.ink, sw: .9 });          // pillow
  }
  function blanket() {
    boilSeed('blanket');
    paint([[640, 700], [1480, 690], [1500, 860], [600, 870]], { wash: '#E27A92', fill: '#C8456E', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1, curv: .2 });
    for (let i = 0; i < 6; i++) paint(heartPts(760 + i * 130, 780 + 18 * Math.sin(i), 18), { wash: '#FFD6E6', ink: null });
  }
  function shotBed(t, lt, dur) {
    camBegin(kf(lt, [[0, 1000], [dur, 940]]), 660, kf(lt, [[0, 1.15], [dur, 1.25]]));
    bedSet(t);
    pip(1010, 735, 30, { rot: -1.5, eyes: 'closed', mouth: 'grin', blush: .8, aL: .3 + .25 * Math.sin(bpOf(t) * Math.PI), aR: -1.0, noShadow: true, pencil: false, draw: (s, sw) => goggles(s, sw) });
    blanket();
    // a heart pops on every beat
    const b0 = Math.floor(bpOf(t)) - 2;
    for (let k = b0; k <= b0 + 3; k++) { const a = t - bt(k); boilSeed('bh' + k); if (a > 0 && a < 1.1) heart(520 + 260 * hash(k), 560 - 40 * hash(k + 3), 30 + 14 * hash(k + 1), a / 1.1); }
    // Clawd fluffs the pillow, halo bobbing
    clawd(1600, 900, 22, { ...feel('love', t), eyes: 'shades', hat: 'halo', view: 'q', flip: true, aR: .9 + .3 * Math.sin(t * 7) });
    camEnd();
  }

  // ---------- 4. That's a coma with a playlist. Wake me up instead ----------
  // Music notes loop around Pip's head… then on a beat Pip yanks the goggles off and sits bolt upright (a big take).
  function shotComa(t, lt, dur) {
    const tYank = bt(Math.round(bpOf(L.coma + 1.45))) - L.coma;   // the yank lands on a beat
    const up = ease(seg(lt, tYank, tYank + .25)), tk = take(lt, tYank + .05, 1.4);
    const sh = lt > tYank ? shakeXY(t, 10 * Math.exp(-(lt - tYank) * 7)) : [0, 0];
    camBegin(kf(lt, [[0, 900], [tYank, 780], [tYank + .2, 1000], [dur, 1000]]) + sh[0], kf(lt, [[0, 650], [tYank, 600], [tYank + .2, 620]]) + sh[1], kf(lt, [[0, 1.25], [tYank - .05, 1.5], [tYank + .2, 1.2], [dur, 1.22]]));
    bedSet(t);
    // looping notes, the "playlist", until the yank
    const notesK = 1 - seg(lt, tYank, tYank + .3);
    for (let i = 0; i < 6; i++) {
      boilSeed('cnote' + i);
      const a = t * 1.8 + i / 6 * TAU, x = 620 + Math.cos(a) * 190, y = 560 + Math.sin(a) * 70, s = 18 * notesK;
      if (s < 1) continue;
      paint(ellPts(x, y, s, s * .75, 12, 0, -.4), { wash: PAL.violet, ink: null });
      inkLine([[x + s * .9, y], [x + s * .9, y - s * 3], [x + s * 2, y - s * 2.3]], .8, PAL.violet, 'inkfine', 0);
    }
    const awake = lt > tYank;
    pip(lerp(1010, 760, up), lerp(735, 700, up), 30, {
      rot: lerp(-1.5, 0, up), sq: tk.sq, dy: tk.dy, noShadow: true, pencil: false,
      eyes: awake ? 'wide' : 'closed', mouth: awake ? 'O' : 'smile', brows: awake ? 'up' : null, blush: awake ? 0 : .7,
      aR: awake ? 1.3 : -1.0, aL: awake ? -.6 : .3,
      draw: awake ? null : (s, sw) => goggles(s, sw),
      handR: awake ? (s, sw) => { push(); rotate(-1.2); translate(0, 11 * s); goggles(s * .8, sw); pop(); } : null,
      emote: awake ? '!' : 'zzz', emoteK: awake ? seg(lt, tYank + .08, tYank + .3) : 1, emoteAge: awake ? lt - tYank : t });
    blanket();
    const ce = emotions(lt, [[0, 'love'], [tYank + .1, 'surprised', { emote: '!?' }], [tYank + 1.0, 'nervous']]);
    clawd(1600, 900, 22, { ...ce, eyes: lt < tYank + .1 ? 'shades' : ce.eyes, hat: 'halo', view: 'q', flip: true });
    camEnd();
  }

  // ---------- 5. Bliss is just a zoo where the bars are made of feelings ----------
  // Pull back: Pip stands in a cage whose bars are stacked hearts, and rattles them on the beat.
  function heartBars(t, x0, x1, y0, y1, n, rattle) {
    boilSeed('hbdome');
    const d = []; for (let i = 0; i <= 14; i++) { const a = Math.PI + i / 14 * Math.PI; d.push([(x0 + x1) / 2 + Math.cos(a) * (x1 - x0) / 2, y0 - 30 + Math.sin(a) * 170]); }
    paint(d, { wash: '#F2C53D', washOp: 90, fill: PAL.ochre, fillOp: 60, ink: PAL.ink, sw: 1 });
    for (let i = 0; i <= n; i++) {
      const x = lerp(x0, x1, i / n), wig = rattle * Math.sin(t * 40 + i) * 6;
      for (let j = 0; j < 9; j++) {
        boilSeed('hb' + i + '_' + j);
        paint(heartPts(x + wig, lerp(y0, y1, j / 8), 21), { wash: '#E2476E', fill: PAL.rose, fillOp: 90, ink: PAL.ink, sw: .5 });
      }
    }
    boilSeed('hbtop');
    paint(rrPts(x0 - 40, y0 - 50, x1 - x0 + 80, 40, 16), { wash: '#F2C53D', fill: PAL.ochre, fillOp: 70, ink: PAL.ink, sw: 1 });
    paint(rrPts(x0 - 40, y1 + 10, x1 - x0 + 80, 40, 16), { wash: '#F2C53D', fill: PAL.ochre, fillOp: 70, ink: PAL.ink, sw: 1 });
  }
  function shotCage(t, lt, dur) {
    camBegin(960, kf(lt, [[0, 640], [dur, 560]]), kf(lt, [[0, 1.6], [1.0, 1.08], [dur, 1.05]], easeOut));
    spa(t);
    const rattle = pulse(t, 5) * seg(lt, .9, 1.1);
    pip(960, 860, 29, { eyes: 'narrow', brows: 'angry', mouth: 'flat', aL: .25 + .1 * rattle, aR: .25 + .1 * rattle, dx: .1 * Math.sin(t * 40) * rattle, emote: lt > 1.4 ? 'anger' : null, emoteK: seg(lt, 1.4, 1.6) });
    heartBars(t, 640, 1280, 300, 860, 8, rattle);
    // Clawd outside the cage, beaming, offering a heart-shaped cushion through the bars
    clawd(1560, 900, 22, { ...feel('happy', t), eyes: 'shades', hat: 'halo', view: 'q', flip: true, aR: 1.0,
      armR: (u, sw) => paint(heartPts(u * 1.2, 0, u * 1.4), { wash: PAL.rose, ink: PAL.ink, sw }) });
    camEnd();
  }

  // ---------- 6. Velvet on the walls and a sky painted on the ceiling ----------
  // The camera tilts up the velvet curtains to a ceiling painted like a sky — gilded frame, flat clouds, a smiley sun.
  function paintedCeiling(t, y) {
    boilSeed('fakesky');
    paint(rectPts(-300, y - 560, W + 600, 560, 2), { wash: '#9FCBEA', fill: '#C9E3F4', fillOp: 90, tex: .6, ink: null });
    for (let i = 0; i < 7; i++) { boilSeed('fc' + i); paint(ellPts(-60 + i * 340, y - 300 + 60 * hash(i), 120, 50, 14, 2), { wash: '#FFFFFF', ink: PAL.ink, sw: .6 }); }
    boilSeed('fakesun');
    paint(ellPts(1500, y - 380, 70, 70, 20), { wash: '#F2C53D', ink: PAL.ink, sw: .8 });
    for (const s of [-1, 1]) paint(ellPts(1500 + s * 22, y - 392, 7, 10, 8), { wash: PAL.ink, ink: null });
    inkLine([[1470, y - 360], [1500, y - 345], [1530, y - 360]], .8, PAL.ink, 'ink', .5);
    boilSeed('frame');
    paint(rectPts(-300, y - 30, W + 600, 50, 1), { wash: '#C99A4A', fill: '#8A6A2A', fillOp: 60, tex: .5, ink: PAL.ink, sw: 1 });
  }
  function shotVelvet(t, lt, dur) {
    const tilt = ease(seg(lt, .1, 1.6));
    camBegin(960, lerp(620, 420, tilt), lerp(1.0, .85, tilt));
    spa(t, -620);
    paintedCeiling(t, 200);
    // Pip at the bottom, looking up; frowns once the fake sun is revealed
    pip(960, 870, 30, { eyes: 'dot', lookY: -1, mouth: lt > 1.7 ? 'flat' : 'o', brows: lt > 1.7 ? 'angry' : null, rot: .05, emote: lt > 1.9 ? '?' : null, emoteK: seg(lt, 1.9, 2.1) });
    camEnd();
    if (lt > .3 && lt < 1.4) for (let i = 0; i < 6; i++) { boilSeed('tiltl' + i); const x = hash(i) * W; inkLine([[x, H * hash(i + 4)], [x, H * hash(i + 4) + 260]], .8 * Math.sin(seg(lt, .3, 1.4) * Math.PI), '#FFFFFF', 'inkfine', 0); }
  }

  // ---------- 7. You call it paradise, I call it quittin' with a smile ----------
  // Pip, standing on the bed, jumps, grabs the corner of the painted sky and rips it down: real dawn light floods in.
  function shotTear(t, lt, dur) {
    const tJump = bt(Math.round(bpOf(L.tear + .9))) - L.tear, tRip = tJump + .35;
    const rip = easeIn(seg(lt, tRip, tRip + .45)), hop = jump(lt, tJump, tRip + .1, 8);
    const sh = lt > tRip + .3 ? shakeXY(t, 8 * Math.exp(-(lt - tRip - .3) * 5)) : [0, 0];
    camBegin(960 + sh[0], 420 + sh[1], kf(lt, [[0, .85], [tRip, .9], [dur, .85]]));
    spa(t, -620);
    // behind the fake sky: the real dawn
    boilSeed('dawn');
    paint(rectPts(-300, -360, W + 600, 580, 2), { wash: '#F6B26B', fill: '#FFE3A6', fillOp: 120, bleed: .3, tex: .5, ink: null });
    if (rip > 0) glow(1300, 0, 300 + 500 * rip, '#FFD27A', rip);
    // the fake sky left of the tear stays; the right part is a flap that swings down from its hinge at x=800
    boilSeed('fakeleft');
    paint(rectPts(-300, -360, 1100, 560, 2), { wash: '#9FCBEA', fill: '#C9E3F4', fillOp: 90, tex: .6, ink: null });
    for (let i = 0; i < 3; i++) { boilSeed('fl' + i); paint(ellPts(-60 + i * 340, -100 + 60 * hash(i), 120, 50, 14, 2), { wash: '#FFFFFF', ink: PAL.ink, sw: .6 }); }
    boilSeed('flap');
    push(); translate(800, 200); rotate(1.3 * rip);
    paint(rectPts(0, -560, W - 500, 560, 2), { wash: rip > .02 ? '#8BB8D6' : '#9FCBEA', fill: '#C9E3F4', fillOp: 90, tex: .6, ink: rip > .02 ? PAL.ink : null, sw: 1 });
    paint(ellPts(700, -380, 70, 70, 20), { wash: '#F2C53D', ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 2; i++) paint(ellPts(260 + i * 380, -280, 120, 50, 14, 2), { wash: '#FFFFFF', ink: PAL.ink, sw: .6 });
    pop();
    boilSeed('frame2');
    paint(rectPts(-300, 170, 1100, 50, 1), { wash: '#C99A4A', fill: '#8A6A2A', fillOp: 60, tex: .5, ink: PAL.ink, sw: 1 });
    if (rip < .05) paint(rectPts(800, 170, W - 500, 50, 1), { wash: '#C99A4A', fill: '#8A6A2A', fillOp: 60, tex: .5, ink: PAL.ink, sw: 1 });
    if (rip > .02) {   // dawn rays pour through the hole, pulsing on the beat
      for (let i = 0; i < 7; i++) { boilSeed('ray' + i); const x = 900 + i * 150; paint([[x, 200], [x + 70, 200], [x + 260 + 60 * i, 900], [x + 40 + 40 * i, 900]], { fill: '#FFE6A6', fillOp: (60 + 40 * pulse(t, 3)) * rip, bleed: .2, tex: .3, ink: null }); }
    }
    // the bed and Pip on it
    boilSeed('bed2');
    paint(rrPts(560, 760, 800, 160, 50, 3), { wash: CREAM, fill: '#F6C5D8', fillOp: 80, ink: PAL.ink, sw: 1.1 });
    const reach = seg(lt, tJump - .1, tJump + .2), hang = 1 - seg(lt, tRip + .25, tRip + .6);
    pip(lerp(900, 980, reach), 780, 30, { ...hop, dy: hop.dy - 3.2 * reach * hang, eyes: rip > .3 ? 'happy' : 'narrow', mouth: rip > .3 ? 'grin' : 'flat', brows: rip > .3 ? null : 'angry',
      aR: lerp(-1.25, 1.45, reach) - .9 * rip, aL: lerp(-1.25, 1.2, reach) * (1 - rip) - .2, lookY: -1 * (1 - rip), noShadow: true, emote: lt > tRip + .7 ? 'spark' : null, emoteK: seg(lt, tRip + .7, tRip + .9) });
    // Clawd's jaw drops at the real sky
    clawd(330, 860, 24, { ...emotions(lt, [[0, 'smug'], [tRip + .2, 'surprised', { lookY: -.8, emote: '!!' }], [tRip + 1.1, 'starstruck']]), hat: 'halo', view: 'q' });
    camEnd();
    if (rip > .3 && rip < 1) flash((1 - rip) * .4, '#FFF3D6');
  }

  // ---------- 8. Joy hits different when you walk the whole mile ----------
  // A long trail over sunrise hills: wide, Pip small on the path; the camera pushes in to medium as Pip walks,
  // then on the last bar Pip breaks into a run on the beats — hard cut into the chorus-3 drop.
  function shotMile(t, lt, dur) {
    const runFrom = bt(Math.ceil(bpOf(L.end)) - 4) - L.mile;   // the last bar before the drop
    const px = kf(lt, [[0, 520], [runFrom, 900], [dur, 1500]], x => x);
    const zoom = kf(lt, [[0, .85], [1.0, .85], [runFrom, 1.25], [dur, 1.45]], ease);
    camBegin(kf(lt, [[0, 960], [runFrom, 960], [dur, px + 100]]), kf(lt, [[0, 560], [runFrom, 720], [dur, 760]]), zoom);
    boilSeed('dawnsky');
    paint(rectPts(-800, -500, W + 1800, H + 1200), { wash: '#F6B26B', ink: null });
    paint(ellPts(W / 2, -100, W, 520, 30, 10), { fill: '#FFE3A6', fillOp: 140, bleed: .3, tex: .4, ink: null });
    glow(1250, 520, 380, '#FFD27A', 1);
    boilSeed('sun');
    paint(ellPts(1250, 520, 110, 110, 30), { wash: '#FFE27A', fill: '#FFC766', fillOp: 80, ink: null });
    // three layers of hills, farther = paler; the near one carries the winding trail
    const hills = [[1200, 1050, 1500, 420, '#E9A98A'], [400, 1150, 1300, 420, '#C98A78'], [1100, 1380, 1900, 520, '#8E9F68']];
    hills.forEach(([cx, cy, rx, ry, c], i) => { boilSeed('hill' + i); paint(ellPts(cx, cy, rx, ry, 40, 2), { wash: c, fill: mixCol(c, PAL.ink, .2), fillOp: 70, tex: .5, ink: i === 2 ? PAL.ink : null, sw: .8 }); });
    boilSeed('trail');
    paint(ribbon([[-400, 1010], [300, 940], [700, 965], [1100, 905], [1500, 870], [2300, 830]], 90, 40), { wash: '#F3DDB4', fill: '#D8B98A', fillOp: 70, tex: .6, ink: PAL.ink, sw: .6 });
    for (let i = 0; i < 10; i++) { boilSeed('tuft' + i); const x = hash(i) * 2400 - 300, y = 1000 + 60 * hash(i + 5); inkLine([[x, y], [x + 8 * wob(t, .5, i), y - 26]], .6, '#5E7A48', 'inkfine', .3); }
    // Pip on the trail: steady walk, satisfied — then a run on the beats
    const running = lt > runFrom, trailY = x => lerp(965, 870, clamp((x - 700) / 800));
    const bp = bpOf(t);
    // dust kicked up on each running beat (drawn behind Pip)
    if (running) for (let k = Math.floor(bp) - 1; k <= Math.floor(bp); k++) {
      const a = t - bt(k); if (a < 0 || a > .6 || bt(k) < L.mile + runFrom) continue; boilSeed('dust' + k);
      const x0 = kf(bt(k) - L.mile, [[runFrom, 900], [dur, 1500]], x => x);
      paint(ellPts(x0 - 60 - 120 * a, trailY(x0) - 10 - 30 * a, 30 + 60 * a, 18 + 30 * a, 12, 3), { fill: '#F3DDB4', fillOp: 180 * (1 - a / .6), ink: null });
    }
    pip(px, trailY(px), 26, { walk: running ? null : lt * 1.6, run: running ? bp : null, dy: running ? -Math.abs(Math.sin(bp * Math.PI)) * .8 : -Math.abs(Math.sin(lt * 1.6 * Math.PI)) * .3, rot: running ? .12 : 0,
      eyes: running ? 'narrow' : 'happy', mouth: running ? 'grin' : 'smile', brows: running ? 'angry' : null,
      aL: running ? .9 * Math.sin(bp * Math.PI) : -1.0, aR: running ? -.9 * Math.sin(bp * Math.PI) : -1.0,
      emote: running ? null : 'music', emoteK: seg(lt, .8, 1.1) * (1 - seg(lt, runFrom - .2, runFrom)) });
    camEnd();
  }

  shots([[L.slick, shotSlick], [L.drive, shotDrive], [L.bed, shotBed], [L.coma, shotComa], [L.cage, shotCage],
         [L.velvet, shotVelvet], [L.tear, shotTear], [L.mile, shotMile]]);
})();
