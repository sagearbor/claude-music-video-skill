// c07_chorus3_roast.js: 138.11–168.35 s. Chorus 3 on the stage at sunrise (Clawd gets pulled into the dance), then
// verse 3, "the roast": a comedy-club stage where Pip takes every one of the Future's last pitches apart.
// Shot functions are fn(t, lt, dur), pure functions of t. Beat k at bt(k); 138.11 s is the bar line (beat 216).
(() => {
  const bt = k => OFF + k * BEAT;
  const CROWD = ['#E27A92', '#6E9F58', '#7B5CA8', '#E8AA38', '#3A9C98', '#D97757', '#8EC3E6'];
  const SKINS = ['#E9B28E', '#B97A56', '#8A5A3C', '#F2C4A0'];
  const CLUB = ['#3B2A3A', '#7B2B4A'];

  // ---------- the chorus stage at sunrise, in depth layers ----------
  // far: sky + sun (moves 0.3x the camera, screen space), mid: the stage (under the camera), near: crowd silhouettes
  // (screen space, sliding 0.6x the other way) so the three planes separate as the camera moves.
  function sunriseFar(t, camX, hit) {
    const px = -(camX - 960) * .3, sx = W / 2 + px;
    boilSeed('sr-sky');
    paint(rectPts(-400, -300, W + 800, H + 600), { wash: '#F2A07B', ink: null });
    paint(ellPts(sx, H * .15, W * .9, H * .45, 30, 10), { fill: '#E8768C', fillOp: 110, bleed: .3, tex: .5, ink: null });
    paint(ellPts(sx, H * .8, W * .8, H * .4, 30, 10), { fill: '#FFD27A', fillOp: 120, bleed: .3, tex: .5, ink: null });
    for (let i = 0; i < 12; i++) {   // sun rays, rotating slowly, flaring on the beat
      boilSeed('ray' + i);
      const a = i / 12 * TAU + t * .15, r0 = 270, r1 = 1000 + 120 * pulse(t, 5);
      paint([[sx + Math.cos(a - .05) * r0, 640 + Math.sin(a - .05) * r0], [sx + Math.cos(a + .05) * r0, 640 + Math.sin(a + .05) * r0],
             [sx + Math.cos(a + .11) * r1, 640 + Math.sin(a + .11) * r1], [sx + Math.cos(a - .11) * r1, 640 + Math.sin(a - .11) * r1]],
            { fill: '#FFF0C2', fillOp: 45 + 40 * pulse(t, 5), bleed: .2, tex: .3, ink: null });
    }
    boilSeed('sr-sun');
    glow(sx, 640, 420 + 80 * hit, '#FFD27A', .9);
    paint(ellPts(sx, 640, 230, 230, 40, 2), { wash: '#FFE6A6', fill: '#FFC766', fillOp: 90, tex: .4, ink: null });
  }
  function sunriseStage(t) {
    boilSeed('sr-stage');
    paint(rectPts(-700, 820, W + 1400, 500, 3), { wash: '#7A3B4A', fill: '#E8AA38', fillOp: 60, tex: .6, ink: null });
    inkLine([[-700, 822], [W + 700, 818]], 1.2, PAL.ink, 'ink', .4);
    for (let i = 0; i < 9; i++) {   // footlights along the stage lip
      boilSeed('foot' + i);
      const x = -300 + i * 320;
      glow(x, 836, 60 + 30 * pulse(t + i * .07, 5), '#FFE6A6', .8);
      paint(ellPts(x, 836, 22, 10, 10), { wash: '#FFE6A6', ink: PAL.ink, sw: .6 });
    }
  }
  function crowdNear(t, camX) {
    const px = -(camX - 960) * .6;
    for (let i = 0; i < 9; i++) {
      boilSeed('sil' + i);
      const x = -160 + i * 260 + px, b = Math.abs(Math.sin((bpOf(t) + i * .37) * Math.PI)), y = 1130 - 40 * b, arm = (i % 3 === 0);
      paint(ellPts(x, y - 220, 66, 72, 18, 2), { wash: '#3A1E2E', ink: null });
      paint(rrPts(x - 105, y - 150, 210, 320, 70), { wash: '#3A1E2E', ink: null });
      if (arm) paint(ribbon([[x + 70, y - 110], [x + 120, y - 250 - 40 * b], [x + 140, y - 350 - 60 * b]], 44, 30), { wash: '#3A1E2E', ink: null });
    }
  }

  // A1 — Zoo? NAH! Doom? NAH! Bliss? NAH! Three doors drop in from above on the beats; Pip kicks each one flat.
  function shotA1(t, lt, dur) {
    const s0 = t - lt, nah = [bt(216) + BEAT / 2, bt(217) + BEAT / 2, bt(218) + BEAT / 2].map(x => x - s0);
    const hit = Math.max(...nah.map(p => lt > p ? Math.exp(-(lt - p) * 8) : 0)), sh = shakeXY(t, 20 * hit);
    const camX = kf(lt, [[0, 900], [dur, 1020]]);
    sunriseFar(t, camX, hit);
    camBegin(camX + sh[0], 560 + sh[1], 1.1 + .1 * hit);
    sunriseStage(t);
    const xs = [520, 960, 1400], kinds = ['zoo', 'doom', 'bliss'];
    kinds.forEach((k, i) => {
      const drop = backOut(seg(lt, nah[i] - .6, nah[i] - .3)), fall = easeIn(seg(lt, nah[i], nah[i] + .14));
      if (drop <= 0) return;
      push(); translate(xs[i], 820); rotate(fall * 1.5 * (i % 2 ? -1 : 1)); translate(-xs[i], -820);
      SETS.door(xs[i] - 130, 820 - 460 - (1 - drop) * 800, 260, 460, .55, SETS.DOOR[k], (x, y, w, h) => SETS.INSIDE[k](x, y, w, h, t), 'c7' + k);
      pop();
    });
    const kick = nah.reduce((s, p) => s + (lt > p - .15 && lt < p + .18 ? Math.sin(seg(lt, p - .15, p + .18) * Math.PI) : 0), 0);
    const px = kf(lt, [[0, 300], [nah[0] - .3, 300], [nah[0] + .1, 340], [nah[1] - .3, 760], [nah[1] + .1, 780], [nah[2] - .3, 1200], [dur, 1220]], easeOut);
    pip(px, 900, 32, { eyes: 'narrow', brows: 'angry', mouth: kick > .3 ? 'O' : 'grin', legs: [0, -1.2 * kick], rot: -.1 * kick, aL: -.6, aR: .4 + .6 * kick });
    // Clawd at the far right, bobbing despite itself
    clawd(1720, 900, 24, { ...emotions(lt, [[0, 'confused', { lookX: -1 }], [1.3, 'nervous']]), hat: 'headphones', view: 'q', flip: true });
    camEnd();
    crowdNear(t, camX);
    nah.forEach((p, i) => sfx('NAH!', xs[i] - (camX - 960) * 1.1, 200, 160, ['#F2C53D', '#FF7A4A', '#E27A92'][i], lt - p, { stroke: PAL.ink, life: .55, screen: true }));
    if (lt < .18) flash(1 - lt / .18, '#FFFDF6');
  }

  // A2 — Cage, grave, or a pill? Man, miss me with this. Clawd lobs them; Pip bats each one away with the handset.
  function shotA2(t, lt, dur) {
    const s0 = t - lt, th = [bt(219), bt(220), bt(221)].map(x => x - s0);
    const hit = Math.max(...th.map(p => lt > p + .35 ? Math.exp(-(lt - p - .35) * 9) : 0)), sh = shakeXY(t, 14 * hit);
    const camX = 960 + 30 * Math.sin(lt * 1.5);
    sunriseFar(t, camX, hit);
    camBegin(camX + sh[0], 560 + sh[1], 1.12);
    sunriseStage(t);
    const swing = th.reduce((s, p) => s + (lt > p + .2 && lt < p + .5 ? Math.sin(seg(lt, p + .2, p + .5) * Math.PI) : 0), 0);
    const cool = lt > th[2] + .8;
    pip(1250, 900, 33, { eyes: cool ? 'closed' : 'narrow', mouth: cool ? 'smirk' : 'grin', flip: true, rot: -.12 * swing,
      aL: cool ? 1.0 + .25 * Math.sin(lt * 18) : -.4 + 1.8 * swing, aR: -.8,
      handL: cool ? null : (s, sw) => { push(); rotate(-.6); translate(s * 1.4, 0); handset(s * .65, sw); pop(); } });
    const props = [
      (x, y) => { for (let i = 0; i < 5; i++) inkLine([[x - 60 + i * 30, y - 70], [x - 60 + i * 30, y + 70]], 2.4, '#5A5448', 'ink', 0); inkLine([[x - 70, y - 70], [x + 70, y - 70]], 3, '#5A5448', 'ink', 0); inkLine([[x - 70, y + 70], [x + 70, y + 70]], 3, '#5A5448', 'ink', 0); },
      (x, y) => { paint([[x - 55, y + 75], [x - 55, y - 30], [x, y - 80], [x + 55, y - 30], [x + 55, y + 75]], { wash: '#9A9AA8', fill: '#6E6E80', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1, curv: .4 }); inkLine([[x - 20, y - 15], [x + 20, y - 15]], 1, PAL.ink, 'ink', 0); inkLine([[x, y - 35], [x, y + 20]], 1, PAL.ink, 'ink', 0); },
      (x, y) => { paint(rrPts(x - 70, y - 28, 70, 56, 28), { wash: '#E27A92', ink: PAL.ink, sw: 1 }); paint(rrPts(x, y - 28, 70, 56, 28), { wash: PAL.cream, ink: PAL.ink, sw: 1 }); },
    ];
    props.forEach((draw, i) => {
      // in on an arc from Clawd to Pip's swing (k 0..1), then batted up and off the top of the frame (k2 0..1)
      const k = seg(lt, th[i] - .05, th[i] + .35), k2 = seg(lt, th[i] + .35, th[i] + .9);
      if (k <= 0 || k2 >= 1) return;
      boilSeed('c7proj' + i);
      const p = k2 > 0 ? arcPt([1120, 560], [300 + 500 * i, -300], 160, easeOut(k2)) : arcPt([600, 640], [1120, 560], 180, k);
      push(); translate(p[0], p[1]); rotate((k + k2) * 5 * (i % 2 ? 1 : -1)); scale(1.5); draw(0, 0); pop();
      if (k2 > 0 && k2 < .35) { boilSeed('pow' + i); paint(starPts(1120, 560, 100 * (1 - k2 / .35), .4, 7, t), { wash: '#FFE27A', ink: PAL.ink, sw: .8 }); }
    });
    // Clawd throws, then gives up mid-throw and starts bopping to the beat (it can't help it)
    const bop = lt > th[2] + .5, mv = move('bounce', t);
    clawd(520, 900, 26, { ...emotions(lt, [[0, 'determined'], [th[2] + .5, 'confused', { emote: '?' }]]), ...(bop ? { dy: mv.dy, sq: mv.sq } : {}), hat: 'headphones', view: 'q',
      aR: !bop && th.some(p => lt > p - .25 && lt < p + .05) ? 1.4 : (bop ? mv.aR : .2), aL: bop ? mv.aL : .2 });
    camEnd();
    crowdNear(t, camX);
  }

  // A3 — This ain't a eulogy, it's a comeback track. The crowd rises; Clawd is in the dance line, half a beat late.
  function shotA3(t, lt, dur) {
    const s0 = t - lt, whip = lt < .2 ? 1 - ease(lt / .2) : 0;
    const camX = 960 - 700 * whip;
    sunriseFar(t, camX, pulse(t, 5) * .5);
    camBegin(camX, kf(lt, [[0, 560], [dur, 520]]), kf(lt, [[0, 1.05], [dur, 1.16]]));
    sunriseStage(t);
    for (let i = 0; i < 6; i++) {
      const tIn = bt(223 + Math.floor(i / 2)) - s0 + (i % 2) * .15, k = backOut(seg(lt, tIn, tIn + .3));
      if (k <= 0) continue;
      const x = [230, 470, 1450, 1690, 110, 1810][i], m = move(['roof', 'bounce', 'hop', 'sway'][i % 4], t + i * .13, i);
      pip(x, 900 + (1 - k) * 420, 22, { ...m, walk: undefined, hoodie: CROWD[i], beanie: CROWD[(i + 3) % 7], skin: SKINS[i % 4], pencil: false, eyes: 'happy', mouth: 'grin', boilKey: 'c7crowd' + i, dy: (m.dy || 0) * .6 });
    }
    const m = move('bounce', t);
    pip(820, 900, 34, { ...m, walk: undefined, eyes: 'closed', mouth: frac(bpOf(t) * 2) < .5 ? 'O' : 'grin', aR: 1.0 + .3 * Math.sin(bpOf(t) * Math.PI), aL: .9,
      handL: (s, sw) => { push(); rotate(-1.2); translate(s * 1.5, 0); handset(s * .7, sw); pop(); } });
    // Clawd, in the line, doing the same bounce half a beat late, then catching up and loving it
    const late = lt < 1.3 ? BEAT / 2 : 0, cm = move('bounce', t - late);
    clawd(1170, 900, 26, { ...emotions(lt, [[0, 'nervous'], [1.3, 'happy', { emote: 'music' }]]), dy: cm.dy, sq: cm.sq, aL: cm.aL, aR: cm.aR, hat: 'headphones' });
    camEnd();
    crowdNear(t, camX);
    SETS.speedLines(whip);
  }

  // A4 — You wrote us off? So we write back! A giant pencil draws a gold arc over the sun; Pip and Clawd jump on the beat.
  function shotA4(t, lt, dur) {
    const camX = kf(lt, [[0, 960], [dur, 990]]);
    sunriseFar(t, camX, 0);
    camBegin(camX, 540, kf(lt, [[0, 1.0], [1.0, 1.08], [dur, 1.04]]));
    sunriseStage(t);
    const k = ease(seg(lt, .3, 1.5));
    const arc = q => { const a = Math.PI * (1.08 + .84 * q); return [960 + Math.cos(a) * 600, 760 + Math.sin(a) * 470]; };
    if (k > 0) {
      boilSeed('c7arc');
      const P = []; for (let i = 0; i <= 40 * k; i++) P.push(arc(i / 40));
      if (P.length > 1) inkLine(P, 9, '#F2C53D', 'ink', .5);
      const tip = arc(k); glow(tip[0], tip[1], 140, '#FFD27A', 1);
    }
    // the giant pencil rides the arc, tip on the line, leaning back along it
    const tip = arc(k), ahead = arc(Math.min(1, k + .02)), ang = Math.atan2(ahead[1] - tip[1], ahead[0] - tip[0]);
    boilSeed('c7bigpencil');
    push(); translate(tip[0], tip[1]); rotate(ang - 2.2); translate(-6.2 * 36, 0); pencilShape(36, 1.2); pop();
    const j1 = jump(lt, 1.6, 2.0, 2.4), j2 = jump(lt, 1.66, 2.06, 2.4);
    pip(640, 900, 32, { eyes: 'closed', mouth: 'grin', aR: 1.3, aL: .9, dy: j1.dy, sq: j1.sq });
    clawd(1290, 900, 25, { ...feel('excited', t), hat: 'headphones', aL: 1.3, dy: j2.dy, sq: j2.sq });
    camEnd();
    crowdNear(t, camX);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, CLUB);
  }

  // ---------- verse 3: the comedy club ----------
  function club(t, spotX, spotK = 1) {
    boilSeed('club-wall');
    paint(rectPts(-600, -400, W + 1200, H + 800), { wash: '#4A2630', ink: null });
    for (let r = 0; r < 12; r++) for (let c = 0; c < 14; c++) {   // brick wall
      boilSeed('brick' + r + '_' + c);
      const x = -300 + c * 190 + (r % 2) * 95, y = -40 + r * 76;
      paint(rectPts(x, y, 176, 64, 2), { wash: mixCol('#7A3B3A', '#5A2A2E', hash(r * 31 + c)), ink: null });
    }
    boilSeed('club-spot');
    paint([[spotX - 50, -100], [spotX + 50, -100], [spotX + 330, 900], [spotX - 330, 900]], { fill: '#FFF0C2', fillOp: 70 * spotK, bleed: .15, tex: .3, ink: null });
    glow(spotX, 860, 380, '#FFE6A6', .5 * spotK);
    boilSeed('club-floor');
    paint(rectPts(-600, 860, W + 1200, 400, 3), { wash: '#2E1E26', fill: '#6A3A2A', fillOp: 70, tex: .7, ink: null });
    paint(ellPts(spotX, 880, 340, 50, 24), { fill: '#FFF0C2', fillOp: 90 * spotK, bleed: .2, ink: null });
    inkLine([[-600, 862], [W + 600, 858]], 1.2, PAL.ink, 'ink', .4);
  }
  function micStand(x, y, h) {
    boilSeed('mic' + x);
    inkLine([[x, y], [x, y - h]], 3, '#2B2233', 'ink', 0);
    paint(ellPts(x, y, 60, 12, 12), { wash: '#2B2233', ink: null });
    paint(rrPts(x - 18, y - h - 50, 36, 60, 16), { wash: '#6E6E80', fill: '#2B2233', fillOp: 60, ink: PAL.ink, sw: .8 });
  }
  function contract(x, y, s, open = 1) {   // a signed contract: paper, lines, a big swooping signature
    boilSeed('contract');
    const h = 240 * s * open;
    paint(rectPts(x - 80 * s, y - h / 2, 160 * s, h, 2), { wash: PAL.cream, fill: '#E8DCC4', fillOp: 70, tex: .7, ink: PAL.ink, sw: .9 });
    for (const yy of [-1, 1]) paint(ellPts(x, y + yy * h / 2, 92 * s, 16 * s, 12), { wash: '#E8DCC4', ink: PAL.ink, sw: .9 });
    if (open > .6) {
      for (let r = 0; r < 5; r++) inkLine([[x - 55 * s, y - 80 * s + r * 22 * s], [x + (30 + 25 * hash(r)) * s, y - 80 * s + r * 22 * s]], .5, '#8A7F70', 'inkfine', 0);
      inkLine([[x - 55 * s, y + 70 * s], [x - 20 * s, y + 42 * s], [x, y + 74 * s], [x + 25 * s, y + 48 * s], [x + 55 * s, y + 66 * s]], 1.6, '#2F3C7A', 'ink', .6);
    }
  }

  // B1 — "Bootloader," callin' us the openin' act? Tiny Pip on a huge stage; a GIANT Clawd shadow slides in from the wings.
  function shotB1(t, lt, dur) {
    camBegin(kf(lt, [[0, 960], [dur, 900]]), 540, kf(lt, [[0, 1.0], [dur, 1.06]]));
    club(t, 760, kf(lt, [[0, .4], [.4, 1]]));
    micStand(840, 860, 230);
    const sk = ease(seg(lt, .2, 1.3)), sx = lerp(2400, 1500, sk);
    boilSeed('c7shadow');
    paint(rectPts(sx - 420, 140, 840, 500, 6), { wash: '#1B1018', washOp: 235, ink: null });
    for (let i = 0; i < 4; i++) paint(rectPts(sx - 340 + i * 200, 620, 90, 240, 4), { wash: '#1B1018', washOp: 235, ink: null });
    paint(rectPts(sx - 560, 330, 160, 80, 4), { wash: '#1B1018', washOp: 235, ink: null });
    for (const ex of [-160, 120]) paint(rectPts(sx + ex, 270, 40, 90, 2), { wash: '#FFC766', washOp: 230 * seg(lt, 1.1, 1.3), ink: null });
    pip(760, 870, 15, { eyes: lt > 1.3 ? 'wide' : 'dot', mouth: lt > 1.3 ? 'o' : 'smile', lookX: lt > 1.3 ? 1 : 0, aL: lt < 1.2 ? .9 + .3 * Math.sin(lt * 14) : -1.2,
      emote: lt > 1.4 ? '?' : null, emoteK: seg(lt, 1.4, 1.6) });
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, CLUB);
  }
  // B2 — Funny, openin' act owns the stage and the contract. The spotlight swings onto Pip, who unfurls a signed contract.
  function shotB2(t, lt, dur) {
    camBegin(kf(lt, [[0, 900], [1.2, 1000]]), kf(lt, [[0, 540], [1.4, 600]]), kf(lt, [[0, 1.0], [1.4, 1.3]]));
    const spot = kf(lt, [[0, 1500], [.7, 960]], backOut);
    club(t, spot, 1);
    micStand(1220, 860, 230);
    const un = ease(seg(lt, .8, 1.3));
    pip(960, 870, 30, { eyes: un > .5 ? 'closed' : 'dot', mouth: un > .5 ? 'smirk' : 'smile', aL: 1.1, aR: 1.1 });
    if (un > 0) contract(960, 430, 1.3, un);
    clawd(1540, 870, 24, { ...emotions(lt, [[0, 'smug'], [1.35, 'surprised', { emote: '!' }], [2.0, 'nervous']]), view: 'q', flip: true });
    camEnd();
  }
  // B3 — "Slow Fade," no bang, just a thousand little "okay". Check-mark buttons rain down and bury Pip… who bursts out.
  function shotB3(t, lt, dur) {
    const pop0 = 1.95, burst = seg(lt, pop0, pop0 + .5);
    const sh = lt > pop0 ? shakeXY(t, 12 * Math.exp(-(lt - pop0) * 8)) : [0, 0];
    camBegin(960 + sh[0], 600 + sh[1], 1.15);
    club(t, 960, 1);
    if (lt < pop0) pip(960, 870, 28, { eyes: 'wide', mouth: 'wobble', lookY: -1, aL: .6, aR: .6, brows: 'worried' });
    const N = 72;
    for (let i = 0; i < N; i++) {
      boilSeed('ok' + i);
      const t0 = .1 + (i / N) * 1.6, k = seg(lt, t0, t0 + .45);
      if (k <= 0) continue;
      const pile = Math.floor(i / 9), slot = i % 9;
      const rest = [960 + (slot - 4) * 64 * (1 - pile * .07) + 16 * (pile % 2), 860 - 34 - pile * 58];
      let p = arcPt([rest[0] + (hash(i) - .5) * 600, -120], rest, -40, easeIn(k));
      if (burst > 0) { const a = hash(i + 7) * Math.PI + Math.PI, f = easeOut(burst); p = [rest[0] + Math.cos(a) * 900 * f, rest[1] + Math.sin(a) * 700 * f + 900 * f * f]; }
      paint(ellPts(p[0], p[1], 34, 34, 16), { wash: ['#8EC3E6', '#6E9F58', '#E8AA38', '#E27A92'][i % 4], ink: PAL.ink, sw: .8 });
      inkLine([[p[0] - 14, p[1]], [p[0] - 3, p[1] + 12], [p[0] + 16, p[1] - 12]], 1.6, PAL.cream, 'ink', 0);
    }
    if (lt >= pop0) {
      const j = jump(lt, pop0, pop0 + .45, 4);
      pip(960, 870, 30, { eyes: 'narrow', brows: 'angry', mouth: 'grin', aL: 1.4, aR: 1.4, dy: j.dy, sq: j.sq, hatUp: Math.exp(-(lt - pop0) * 4) * .8 });
    }
    camEnd();
  }
  // B4 — Handin' over the keys one convenience a day. Clawd dangles the key ring; Pip snatches it back on the beat.
  function shotB4(t, lt, dur) {
    const s0 = t - lt, grab = bt(246) - s0;   // 157.3 s
    camBegin(kf(lt, [[0, 900], [dur, 960]]), 600, kf(lt, [[0, 1.2], [grab, 1.32], [grab + .2, 1.25]]));
    club(t, 960, 1);
    const got = lt > grab, dangle = Math.sin(lt * 6) * .25;
    const keys = (u, sw) => {
      boilSeed('keyring');
      push(); rotate(dangle); scale(2.4);
      brush.noFill(); brush.noWash(); brush.noHatch(); brush.set('ink', '#C99A4A', sw * 1.2);
      brush.beginShape(0); for (const p of ellPts(0, u * 1.2, u * .9, u * .9, 16)) brush.vertex(p[0], p[1]); brush.endShape(true);
      for (let i = 0; i < 4; i++) { push(); translate(0, u * 2); rotate(-.8 + i * .5); paint(rectPts(-u * .15, 0, u * .3, u * 1.6), { wash: '#E8C46A', ink: PAL.ink, sw: sw * .5 }); paint(ellPts(0, u * 1.6, u * .3, u * .3, 8), { wash: '#E8C46A', ink: PAL.ink, sw: sw * .5 }); pop(); }
      pop();
    };
    clawd(700, 880, 26, { ...emotions(lt, [[0, 'smug'], [grab + .05, 'surprised', { emote: '!?' }]]), view: 'q', aR: got ? .2 : 1.0, armR: got ? null : (u, sw) => keys(u, sw) });
    const reach = got ? 0 : ease(seg(lt, grab - .5, grab)), tk = take(lt, grab + .02, .6);
    pip(lerp(1300, 1170, reach), 880, 30, { eyes: got ? 'closed' : 'narrow', mouth: got ? 'smirk' : 'flat', flip: true, aL: got ? 1.3 : .2 + 1.0 * reach, sq: tk.sq, dy: tk.dy,
      handL: got ? (s, sw) => { push(); translate(0, -s * .8); keys(s * .9, sw); pop(); } : null });
    camEnd();
  }
  // B5 — "Lock-In," freeze the world on one king's code? Clawd in a crown; ice creeps across the stage and freezes Pip.
  function shotB5(t, lt, dur) {
    camBegin(960, 560, kf(lt, [[0, 1.08], [dur, 1.0]]));
    club(t, 700, 1);
    const ice = ease(seg(lt, .4, 1.8));
    boilSeed('c7frost');
    paint(rectPts(-600, -400, W + 1200, H + 800), { fill: '#BFE3F2', fillOp: 90 * ice, bleed: .2, tex: .5, ink: null });
    for (let i = 0; i < 16; i++) {   // ice spikes growing from the floor, left to right
      boilSeed('spike' + i);
      const k = seg(ice, i / 20, i / 20 + .3), x = 140 + i * 110, h = (160 + 160 * hash(i)) * k;
      if (k > 0) paint([[x - 40, 862], [x, 862 - h], [x + 40, 862]], { wash: '#DDF2FA', fill: '#8EC3E6', fillOp: 60, ink: PAL.ink, sw: .7 });
    }
    clawd(700, 880, 28, { ...feel('cool', t), hat: 'crown', aL: 1.2, aR: 1.2 });
    const frozen = seg(lt, 1.4, 1.7);
    pip(1350, 880, 28, { eyes: frozen > .5 ? 'wide' : 'narrow', mouth: 'flat', flip: true, aL: .5, rot: frozen > .5 ? .02 * Math.sin(lt * 50) : 0 });
    if (frozen > 0) { boilSeed('icecube'); paint(rrPts(1350 - 140, 880 - 470, 280, 480, 30), { fill: '#BFE3F2', fillOp: 120 * frozen, bleed: .05, tex: .3, ink: '#EAF7FC', sw: 1.4 }); inkLine([[1250, 470], [1300, 600]], 2, '#FFFFFF', 'ink', 0); }
    camEnd();
  }
  // B6 — Nah. We keep a fork in every road. The ice shatters on "Nah"; a road branches and branches;
  // Pip at a signpost whose arrows flip out one per beat.
  function shotB6(t, lt, dur) {
    const s0 = t - lt;
    camBegin(kf(lt, [[0, 960], [dur, 1000]]), kf(lt, [[0, 600], [dur, 560]]), kf(lt, [[0, 1.2], [dur, 1.0]]));
    // seen from above, like a map: a green field the roads fork across
    boilSeed('c7grass');
    paint(rectPts(-600, -400, W + 1200, H + 800), { wash: '#8FBF6A', ink: null });
    for (let i = 0; i < 14; i++) { boilSeed('field' + i); paint(ellPts(hash(i) * W, hash(i + 4) * H, 200 + 160 * hash(i + 8), 120 + 80 * hash(i + 9), 18, 6), { fill: i % 2 ? PAL.sap : '#B5D98A', fillOp: 70, bleed: .3, tex: .5, ink: null }); }
    const grow = ease(seg(lt, .1, 1.8));
    const road = (x0, y0, a, len, depth, key) => {
      const k = clamp(grow * 3 - depth * .55), L = len * k; if (k <= 0) return;
      const x1 = x0 + Math.cos(a) * L, y1 = y0 + Math.sin(a) * L;
      boilSeed('road' + key);
      const w0 = 220 * Math.pow(.55, depth), w1 = 220 * Math.pow(.55, depth + 1);
      paint(ribbon([[x0, y0], [(x0 + x1) / 2 + 10 * Math.sin(depth + a), (y0 + y1) / 2], [x1, y1]], w0, w1), { wash: '#E3D3B0', fill: '#C9B79A', fillOp: 50, tex: .5, ink: '#7A6A4A', sw: .6 });
      for (let d = 0; d < 6; d++) { const q0 = d / 6 + .03, q1 = q0 + .07; if (q1 < k) inkLine([[lerp(x0, x1, q0 / k * k), lerp(y0, y1, q0)], [lerp(x0, x1, q1), lerp(y0, y1, q1)]], 1.6 * Math.pow(.6, depth), '#F2C53D', 'ink', 0); }
      if (depth < 4 && k >= 1) { road(x1, y1, a - .7, len * .72, depth + 1, key + 'L'); road(x1, y1, a + .7, len * .72, depth + 1, key + 'R'); }
    };
    road(960, 1250, -Math.PI / 2, 470, 0, 'r');
    boilSeed('post');
    paint(rectPts(1290, 520, 22, 380, 2), { wash: '#8A5A3C', ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 4; i++) {
      const k = backOut(seg(lt, bt(253 + i) - s0, bt(253 + i) - s0 + .25)); if (k <= 0) continue;
      boilSeed('arrow' + i);
      const d = i % 2 ? -1 : 1, y = 550 + i * 70, w = 170 * k;
      paint([[1301, y], [1301 + d * w, y], [1301 + d * (w + 34), y + 24], [1301 + d * w, y + 48], [1301, y + 48]], { wash: ['#E8AA38', '#E27A92', '#8EC3E6', '#6E9F58'][i], ink: PAL.ink, sw: .8 });
    }
    pip(1180, 900, 30, { eyes: 'closed', mouth: 'grin', aR: 1.2, aL: -1.1, lookX: 1 });
    camEnd();
    if (lt < .45) {   // the ice from the last shot shatters on "Nah": shards fly off the screen
      for (let i = 0; i < 18; i++) {
        boilSeed('shard' + i);
        const a = hash(i) * TAU, k = easeOut(lt / .45), x = 960 + Math.cos(a) * 1100 * k, y = 540 + Math.sin(a) * 800 * k;
        paint([[x, y - 40], [x + 30, y + 10], [x - 20, y + 40]], { wash: '#DDF2FA', washOp: 255 * (1 - k), ink: '#8EC3E6', sw: .8 });
      }
      flash(1 - lt / .12, '#EAF7FC');
    }
  }
  // B7 — Real talk? I could roast y'all 'til the crack of dawn. Pip at the mic; Clawd in the front row, sweating, holding a
  // marshmallow on a stick… which catches fire.
  function shotB7(t, lt, dur) {
    camBegin(kf(lt, [[0, 960], [dur, 1000]]), 560, kf(lt, [[0, 1.0], [dur, 1.08]]));
    club(t, 760, 1);
    micStand(760, 860, 260);
    pip(620, 870, 30, { eyes: 'narrow', mouth: frac(bpOf(t) * 2) < .5 ? 'grin' : 'O', aR: .9 + .25 * Math.sin(lt * 8), aL: .4 });
    boilSeed('row');
    for (const x of [1150, 1650]) paint(rrPts(x - 130, 880, 260, 220, 30), { wash: '#5A2A3A', ink: PAL.ink, sw: 1 });
    const fire = seg(lt, 1.3, 1.5);
    clawd(1400, 1000, 26, { ...emotions(lt, [[0, 'nervous', { emote: 'sweat', lookX: -1 }], [1.45, 'scared', { emote: '!!' }]]), view: 'q', flip: true, aL: .6,
      armL: (u, sw) => { boilSeed('stick'); inkLine([[0, 0], [u * 4, -u * 2]], sw * .8, '#8A5A3C', 'ink', 0); paint(rrPts(u * 3.6, -u * 2.9, u * 1.2, u * 1.4, u * .4), { wash: fire > .5 ? '#3A2B28' : PAL.cream, ink: PAL.ink, sw: sw * .6 });
        if (fire > 0) { glow(u * 4.2, -u * 3.4, u * 4 * fire, '#FF9A3A', 1); paint(ribbon([[u * 4.2, -u * 2.3], [u * 4 + u * .3 * Math.sin(T * 30), -u * 3.6], [u * 4.3, -u * 4.8]], u * 1.1 * fire, 2), { wash: '#FF9A3A', fill: '#FFE27A', fillOp: 120, ink: null }); } } });
    camEnd();
  }
  // B8 — But grief don't plant a garden. So let's get the gloves on. Morning; a seedling unfurls; Pip snaps on gardening
  // gloves, one per beat, determined.
  function shotB8(t, lt, dur) {
    const s0 = t - lt, snap = [bt(260) - s0, bt(261) - s0];   // 166.2, 166.9 s
    camBegin(kf(lt, [[0, 960], [dur, 1060]]), 580, kf(lt, [[0, 1.0], [snap[1] + .2, 1.2], [dur, 1.15]]));
    boilSeed('c7dawn');
    paint(rectPts(-600, -400, W + 1200, H + 800), { wash: '#F6D6A8', ink: null });
    paint(ellPts(1500, 260, 600, 300, 24, 10), { fill: '#FFE6A6', fillOp: 120, bleed: .3, tex: .5, ink: null });
    glow(1500, 260, 300, '#FFD27A', .5);
    boilSeed('c7soil');
    paint(rectPts(-600, 820, W + 1200, 500, 3), { wash: '#7A4E32', fill: '#5A3A22', fillOp: 70, tex: .7, ink: null });
    for (let i = 0; i < 4; i++) { boilSeed('furrow' + i); inkLine([[-300, 870 + i * 50], [W + 300, 866 + i * 50]], .8, '#4A2E1C', 'dry', .3); }
    const sp = ease(seg(lt, .2, 1.2));
    if (sp > 0) {
      boilSeed('seedling');
      paint(ribbon([[650, 826], [650 + 8 * Math.sin(t * 2), 822 - 110 * sp], [650 + 10 * Math.sin(t * 2), 822 - 210 * sp]], 16, 9), { wash: '#6E9F58', ink: PAL.ink, sw: .7 });
      for (const d of [-1, 1]) paint(ribbon([[650, 822 - 200 * sp], [650 + d * 80 * sp, 822 - 260 * sp], [650 + d * 140 * sp, 822 - 240 * sp]], 44 * sp + 1, 3), { wash: '#8FBF6A', ink: PAL.ink, sw: .8 });
      glow(650, 822 - 230 * sp, 120 * sp, '#FFE6A6', .6);
    }
    const glove = (s, sw) => { paint(rrPts(-.9 * s, -.8 * s, 1.8 * s, 1.6 * s, .5 * s), { wash: '#E8AA38', fill: '#B5462E', fillOp: 50, ink: PAL.ink, sw: sw * .6 }); paint(rectPts(-1.1 * s, -.95 * s, .5 * s, 1.9 * s), { wash: '#6E9F58', ink: PAL.ink, sw: sw * .5 }); };
    const gL = lt > snap[0], gR = lt > snap[1], tk = take(lt, snap[1] + .02, .5);
    pip(1050, 880, 32, { eyes: 'narrow', brows: 'angry', mouth: gR ? 'grin' : 'flat', aL: gL && !gR ? 1.2 : .2 + (gR ? .5 * pulse(t, 6) : 0), aR: gR ? 1.2 : .2,
      handL: gL ? glove : null, handR: gR ? glove : null, sq: tk.sq, dy: tk.dy, lookX: -.6 });
    for (const p of snap) if (lt > p && lt < p + .35) { boilSeed('snap' + p); const k = seg(lt, p, p + .35); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .5; inkLine([[1050 + Math.cos(a) * 160, 450 + Math.sin(a) * 160], [1050 + Math.cos(a) * (160 + 90 * k), 450 + Math.sin(a) * (160 + 90 * k)]], 2, PAL.ink, 'ink', 0); } }
    camEnd();
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#B5462E', '#E8AA38']);
  }

  shots([[138.11, shotA1], [140.03, shotA2], [142.66, shotA3], [145.29, shotA4],
         [147.45, shotB1], [149.76, shotB2], [152.79, shotB3], [155.50, shotB4], [158.22, shotB5], [160.77, shotB6], [163.16, shotB7], [165.56, shotB8]]);
})();
