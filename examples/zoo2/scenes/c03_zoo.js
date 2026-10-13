// c03_zoo.js: verse 1, the human zoo at night, 43.0–76.83 s. One shot per lyric line.
// Clawd is the zookeeper (hard hat); Pip is the exhibit who keeps winning the argument.
(() => {
  const { bt, NIGHT, zooSet, glass, speedLines } = SETS;
  const GOLD = '#F2C53D', NAVY = '#16233F';

  // ---------- small helpers ----------
  const whipIn = (lt, d = .22) => lt < d ? 1 - ease(lt / d) : 0;
  const whipOut = (lt, dur, d = .2) => lt > dur - d ? ease((lt - (dur - d)) / d) : 0;
  const beatsIn = (t, lt, k0, k1) => { const r = []; for (let k = k0; k <= k1; k++) r.push(bt(k) - (t - lt)); return r; };
  const hitEnv = (lt, times, k = 9) => Math.max(0, ...times.map(p => lt > p ? Math.exp(-(lt - p) * k) : 0));
  function nightSky(t, col = NAVY) {
    boilSeed('c3sky');
    paint(rectPts(-800, -500, W + 1600, H + 1000), { wash: col, ink: null });
    for (let i = 0; i < 34; i++) { boilSeed('c3st' + i); paint(starPts(hash(i + 7) * (W + 800) - 400, hash(i + 61) * 340 - 40, 4 + 3 * hash(i + 3), .35, 4), { wash: PAL.cream, washOp: 150 + 90 * Math.sin(t * 2.2 + i), ink: null }); }
  }
  function floor(y, col = '#2A2F45') {
    boilSeed('c3floor' + y);
    paint(rectPts(-800, y, W + 1600, 700, 3), { wash: col, fill: mixCol(col, PAL.violet, .4), fillOp: 70, tex: .6, ink: null });
    inkLine([[-800, y + 2], [W / 2, y - 3], [W + 800, y + 2]], 1, PAL.ink, 'ink', .5);
  }
  const keeper = (x, y, u, o) => clawd(x, y, u, { hat: 'hard', view: 'q', ...o });

  // ---------- 1. Gift shop sellin' plushie humans, small, medium, large (43.0–45.88) ----------
  function shotShop(t, lt, dur) {
    const pops = beatsIn(t, lt, 68, 70);               // small, medium, large pop up on beats
    const wo = whipOut(lt, dur);
    camBegin(980 + 700 * wo + 15 * Math.sin(lt), 560, 1.12 + .02 * lt);
    nightSky(t, '#2A2140');
    boilSeed('shopwall');
    paint(rectPts(-200, 120, 2400, 760, 2), { wash: '#4A2F4A', fill: '#7B5CA8', fillOp: 60, tex: .6, ink: null });
    for (let i = 0; i < 6; i++) { boilSeed('bunt' + i); paint([[150 + i * 300, 130], [300 + i * 300, 130], [225 + i * 300, 210]], { wash: [PAL.rose, PAL.ochre, PAL.teal][i % 3], ink: PAL.ink, sw: .6 }); }
    inkLine([[100, 130], [1950, 130]], .8, PAL.ink, 'ink', 0);
    glow(980, 300, 420, '#FFD27A', .5);
    boilSeed('shelf');
    paint(rectPts(380, 660, 1220, 50, 2), { wash: '#9C7A5C', fill: '#6B4A33', fillOp: 70, ink: PAL.ink, sw: 1 });
    // plush Pips: small, medium, large, each with a dangling price tag
    const xs = [600, 900, 1260], ss = [11, 17, 25];
    ss.forEach((s, i) => {
      const k = backOut(seg(lt, pops[i] - .05, pops[i] + .25)); if (k <= .01) return;
      const wig = Math.sin((lt - pops[i]) * 14) * .06 * Math.exp(-(lt - pops[i]) * 3);
      pip(xs[i], 660, s * k, { eyes: 'dot', mouth: 'smile', blush: .8, rot: wig, aL: -.9, aR: -.9, noShadow: true, boilKey: 'plush' + i });
      boilSeed('tag' + i);
      inkLine([[xs[i] + 1.5 * s * k, 660 - 7 * s * k], [xs[i] + 3 * s * k, 660 - 4 * s * k]], .6, PAL.ink, 'inkfine', 0);
      paint(rectPts(xs[i] + 2.6 * s * k, 660 - 4.4 * s * k, 2.2 * s * k, 1.3 * s * k, 1), { wash: PAL.cream, ink: PAL.ink, sw: .5 });
    });
    keeper(330, 960, 26, { ...emotions(lt, [[0, 'happy'], [pops[0], 'excited'], [pops[2] + .3, 'proud']]), aR: lt > pops[0] - .1 ? 1.1 : .2 });
    const shock = lt > pops[2] + .1 && lt < pops[2] + 1.0;
    pip(1660, 960, 30, { eyes: shock ? 'wide' : 'narrow', mouth: shock ? 'O' : 'flat', brows: lt > pops[2] + 1 ? 'angry' : null,
      flip: true, lookX: -1, ...take(lt, pops[2] + .1, .8) });
    floor(960, '#3B2A3A');
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, NIGHT);
    speedLines(wo);
  }

  // ---------- 2. Field trip from the cloud, little bots at the rail (45.88–48.43) ----------
  function cloudBus(x, y) {
    boilSeed('cloudbus');
    for (const [dx, dy, r] of [[-170, 10, 110], [-60, -40, 130], [70, -20, 120], [180, 20, 100], [0, 40, 150]]) paint(ellPts(x + dx, y + dy, r * 1.1, r * .8, 20, 2), { wash: '#F4F1FA', fill: '#D6DCF2', fillOp: 70, tex: .4, ink: null });
    paint(ellPts(x, y + 10, 330, 120, 30, 2), { ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 4; i++) paint(rrPts(x - 210 + i * 110, y - 30, 70, 50, 14), { wash: '#BFE3F2', ink: PAL.ink, sw: .7 });
    for (const wx of [-200, 200]) paint(ellPts(x + wx, y + 120, 40, 40, 14), { wash: PAL.ink, ink: null });
  }
  function shotTrip(t, lt, dur) {
    const wi = whipIn(lt), wo = whipOut(lt, dur, .25);
    camBegin(1000 - 700 * wi + 40 * lt, 600, 1.15 + .12 * wo);
    zooSet(t, .8);
    pip(1260, 860, 26, { eyes: 'narrow', mouth: 'flat', lookX: -1, flip: true });
    glass();
    const land = easeOut(seg(lt, 0, .55));
    cloudBus(lerp(-200, 420, land), lerp(150, 760, land) + 8 * Math.sin(t * 3));
    boilSeed('rail');
    inkLine([[300, 900], [1900, 900]], 3, '#C9C2B5', 'ink', 0);
    for (let i = 0; i < 8; i++) inkLine([[350 + i * 200, 900], [350 + i * 200, 975]], 2, '#C9C2B5', 'ink', 0);
    const hops = beatsIn(t, lt, 73, 76);
    for (let i = 0; i < 4; i++) {
      const t0 = hops[i] - .3, k = seg(lt, t0, t0 + .55); if (k <= 0) continue;
      const p = arcPt([420, 860], [700 + i * 170, 985], 160, easeOut(k)), m = k >= 1 ? move('hop', t + i * .2, i) : {};
      clawd(p[0], p[1], 13, { ...m, view: k < 1 ? 'side' : 'front', walk: null, hat: ['party', 'beanie', 'bow', 'cat'][i], eyes: 'wide', mouth: 'open', boilKey: 'kid' + i, lookX: .6, lookY: -.6, aR: k >= 1 ? 1.2 : .3 });
    }
    camEnd();
    speedLines(wi);
  }

  // ---------- 3. "Look, Mom, a human! Does it have a tail?" (48.43–51.14) ----------
  function shotTail(t, lt, dur) {
    camBegin(960, 620, kf(lt, [[0, 1.12], [dur, 1.3]]));
    zooSet(t, 1);
    const turned = lt > 1.3 && lt < 1.9, hopK = lt > 1.15 && lt < 2.0 ? Math.sin(seg(lt, 1.15, 2) * Math.PI) : 0;
    pip(1250, 860, 32, { eyes: lt > 2 ? 'narrow' : 'dot', mouth: lt > 2 ? 'flat' : 'o', flip: !turned, lookX: turned ? 1 : -1,
      rot: turned ? -.12 : 0, dy: -.3 * hopK, emote: lt > 1.4 && lt < 2.3 ? '?' : null, emoteK: seg(lt, 1.4, 1.55) });
    glass();
    clawd(560, 980, 14, { ...feel('excited', t), hat: 'party', view: 'q', aR: 1.3 + .15 * Math.sin(lt * 18), lookX: .8, lookY: -.4, boilKey: 'kid', emote: lt < 1.2 ? '!' : 'spark', emoteK: seg(lt, .15, .35) });
    clawd(330, 980, 22, { ...emotions(lt, [[0, 'neutral'], [.9, 'surprised', { lookX: .7 }], [2.1, 'laugh']]), hat: 'flower', view: 'q', boilKey: 'mom' });
    camEnd();
  }

  // ---------- 4. Tap on the glass? Bet. I tap back in Morse (51.14–53.54) ----------
  function ripples(x, y, times, lt, col = '#EAF7FC') {
    times.forEach((p, i) => {
      const a = lt - p; if (a < 0 || a > .7) return;
      boilSeed('rip' + col + i);
      for (const d of [0, .12]) { const k = seg(a, d, .7); if (k > 0 && k < 1) paint(ellPts(x, y, 30 + 220 * easeOut(k), 22 + 160 * easeOut(k), 24), { ink: col, sw: 1.6 * (1 - k), br: 'inkfine' }); }
    });
  }
  function shotTap(t, lt, dur) {
    camBegin(kf(lt, [[0, 960], [dur, 1000]]), 600, kf(lt, [[0, 1.25], [dur, 1.45]]));
    zooSet(t, 1);
    const taps = beatsIn(t, lt, 80, 81), back = [1.45, 1.65, 1.85];
    const reply = lt > 1.3;
    pip(1180, 860, 32, { eyes: reply ? 'narrow' : 'wide', mouth: reply ? 'smirk' : 'flat', flip: true, lookX: -1, brows: reply ? 'angry' : null,
      aL: reply ? .3 + .2 * hitEnv(lt, back, 14) : -1.25, dx: reply ? -1.2 : 0 });
    glass();
    const tapK = hitEnv(lt, taps, 12);
    keeper(780, 980, 28, { ...emotions(lt, [[0, 'mischief'], [1.5, 'surprised']]), view: 'side', aL: .2 + .5 * tapK, dx: .15 * tapK });
    ripples(905, 620, taps, lt);
    ripples(1010, 610, back, lt, '#FFE27A');
    for (const p of back) if (lt > p && lt < p + .3) glow(1010, 610, 120 * Math.exp(-(lt - p) * 8), '#FFD27A', 1);
    camEnd();
  }

  // ---------- 5. Dash-dot, dash-dash-dash. That's N-O, of course (53.54–55.93) ----------
  function shotMorse(t, lt, dur) {
    camBegin(980, 580, 1.2 + .03 * lt);
    zooSet(t, .6);
    const marks = [[0, 'd'], [.32, '.'], [.95, 'd'], [1.27, 'd'], [1.59, 'd']].map(([d, m]) => [.12 + d, m]);
    pip(1300, 860, 30, { eyes: 'narrow', mouth: 'flat', flip: true, lookX: -1, aL: .4 + .25 * hitEnv(lt, marks.map(m => m[0]), 14) });
    glass();
    let x = 620;
    marks.forEach(([p, m], i) => {
      const k = seg(lt, p, p + .12), w = m === 'd' ? 110 : 34;
      if (k > 0) {
        boilSeed('mark' + i);
        const hot = Math.exp(-Math.max(0, lt - p) * 4);
        glow(x + w / 2, 470, 90 + 80 * hot, '#FFD27A', .4 + .6 * hot);
        paint(m === 'd' ? rrPts(x, 452, Math.max(20, w * k), 36, 16) : ellPts(x + 17, 470, 18 * k, 18 * k, 12), { wash: '#FFE6A6', ink: PAL.ink, sw: .8 });
      }
      x += m === 'd' ? 150 : 70; if (i === 1) x += 60;   // a gap between N and O
    });
    keeper(470, 980, 30, { ...emotions(lt, [[0, 'thinking'], [1.95, 'confused', { emote: '?' }]]), view: 'q' });
    camEnd();
    if (lt > dur - .35) iris(1280, 560, lerp(1500, 0, easeIn(seg(lt, dur - .35, dur))));
  }

  // ---------- 6. You want us like pandas: fed, cute, endangered (55.93–58.56) ----------
  function shotPanda(t, lt, dur) {
    const chews = beatsIn(t, lt, 87, 90), chew = hitEnv(lt, chews, 7);
    const snap = [1.7, 2.1];
    camBegin(980, 600, kf(lt, [[0, 1.2], [dur, 1.3]]));
    boilSeed('grove');
    paint(rectPts(-400, -300, W + 800, H + 600), { wash: '#1E3A35', ink: null });
    for (let i = 0; i < 14; i++) {
      boilSeed('bam' + i);
      const x = 200 + i * 130 + 40 * hash(i), sw = 14 * Math.sin(t * .9 + i);
      paint(ribbon([[x, 980], [x + sw * .5, 600], [x + sw, 180]], 26, 18), { wash: mixCol(PAL.sap, '#1E3A35', .3 + .3 * hash(i + 4)), ink: PAL.ink, sw: .6 });
      for (let j = 1; j < 5; j++) inkLine([[x - 12 + sw * j / 6, 980 - j * 170], [x + 12 + sw * j / 6, 980 - j * 170]], .8, PAL.ink, 'inkfine', 0);
    }
    floor(940, '#2E4A3A');
    pip(1080, 940, 34, { hoodie: '#F3EBDC', pants: PAL.ink, beanie: '#2B2233', eyes: 'narrow', mouth: chew > .5 ? 'o' : 'flat', pencil: false,
      sq: .04 * chew, aR: .9 + .2 * chew, aL: -1.0,
      handR: (s, sw) => { push(); rotate(-1.4); paint(ribbon([[0, 0], [2 * s, -.3 * s], [4.5 * s, 0]], .7 * s, .55 * s), { wash: PAL.sap, ink: PAL.ink, sw: sw * .6 }); paint(ellPts(4.2 * s, -.8 * s, 1 * s, .45 * s, 10, 0, -.5), { wash: '#8CC26E', ink: PAL.ink, sw: sw * .5 }); pop(); },
      draw: (s, sw) => { for (const sd of [-1, 1]) paint(ellPts(sd * 2.3 * s, -13.2 * s, .95 * s, .95 * s, 14), { wash: '#2B2233', ink: PAL.ink, sw: sw * .6 }); } });
    keeper(420, 960, 28, { ...feel('love', t), view: 'q', aR: .9, aL: .9,
      armR: (u, sw) => paint(rrPts(-u * 1.2, -u * .9, u * 2.4, u * 1.8, u * .3), { wash: PAL.ink, ink: PAL.ink, sw }) });
    const fl = hitEnv(lt, snap, 12);
    if (fl > .02) glow(520, 760, 300 * fl, '#FFFFFF', fl);
    camEnd();
    if (lt < .35) iris(1080, 500, lerp(0, 1500, easeIn(lt / .35)));
    if (lt > dur - .12) flash((lt - (dur - .12)) / .12, '#FFFDF6');
  }

  // ---------- 7. And a breedin' program? Nah. Swipe left, stranger (58.56–61.2) ----------
  function shotSwipe(t, lt, dur) {
    const tSw = bt(94) - (t - lt) - .05, k = seg(lt, tSw, tSw + .3), wo = whipOut(lt, dur);
    camBegin(960 + 700 * wo, 560, 1.0 + .05 * lt);
    boilSeed('swbg');
    paint(rectPts(-400, -300, W + 800, H + 600), { wash: '#3A2140', ink: null });
    for (let i = 0; i < 18; i++) { boilSeed('swh' + i); paint(heartPts(hash(i) * W, (hash(i + 4) * H + t * 40 * (1 + hash(i))) % H, 14 + 10 * hash(i + 2)), { wash: PAL.rose, washOp: 90, ink: null }); }
    boilSeed('phone');
    paint(rrPts(700, 110, 520, 860, 60, 2), { wash: '#2B2233', ink: PAL.ink, sw: 1.4 });
    paint(rrPts(730, 160, 460, 760, 36, 1), { wash: '#FBF4E6', ink: null });
    const cx = 960 - 900 * easeIn(k), rot = -.6 * easeIn(k);
    if (k < 1) {
      push(); translate(cx, 520); rotate(rot); translate(-960, -520);
      boilSeed('card');
      paint(rrPts(770, 200, 380, 560, 28), { wash: '#F6C5D8', fill: PAL.rose, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1 });
      clawd(960, 640, 18, { ...feel('love', t), col: '#9AA4B8', dk: '#6E7890', lt: '#C4CCDA', tint: null, hat: 'bowtie', boilKey: 'date', noShadow: true });
      boilSeed('ant'); inkLine([[960, 495], [960, 445]], 1.2, PAL.ink, 'ink', 0); paint(ellPts(960, 438, 12, 12, 10), { wash: '#E2476E', ink: PAL.ink, sw: .6 });
      if (lt > tSw - .5) {
        boilSeed('X'); const q = seg(lt, tSw - .5, tSw - .3), q2 = seg(lt, tSw - .3, tSw - .1);
        inkLine([[820, 260], [lerp(820, 1100, q), lerp(260, 700, q)]], 4, '#C8324A', 'ink', 0);
        if (q2 > 0) inkLine([[1100, 260], [lerp(1100, 820, q2), lerp(260, 700, q2)]], 4, '#C8324A', 'ink', 0);
      }
      pop();
    }
    const reach = ease(seg(lt, tSw - .6, tSw - .2)), swing = ease(seg(lt, tSw - .1, tSw + .25));
    pip(1560 - 200 * reach + 300 * swing * 0, 1100, 34, { eyes: 'narrow', mouth: lt > tSw ? 'smirk' : 'flat', flip: true, lookX: -1, aL: .35 + .4 * reach - .9 * swing });
    keeper(330, 1060, 30, { ...emotions(lt, [[0, 'hopeful'], [tSw + .25, 'sad']]), view: 'q' });
    camEnd();
    speedLines(Math.max(wo, Math.min(1, k * (1 - k) * 4)));
  }

  // ---------- 8. Gilded cage is still a cage, I don't care how it's lit (61.2–63.59) ----------
  function birdcage(x, y, s, lit) {
    boilSeed('cage');
    glow(x, y - 300 * s, 360 * s * lit, '#FFD27A', .9 * lit);
    paint(ellPts(x, y, 330 * s, 40 * s, 30), { wash: '#C99A4A', fill: '#8A6A2A', fillOp: 60, ink: PAL.ink, sw: 1.1 });
    for (let i = 0; i <= 10; i++) { const a = i / 10, bx = x - 320 * s + 640 * s * a; inkLine([[bx, y], [lerp(bx, x, .55), y - 520 * s], [x, y - 640 * s]], 1.6, GOLD, 'ink', .6); }
    paint(ellPts(x, y - 640 * s, 26 * s, 26 * s, 12), { wash: GOLD, ink: PAL.ink, sw: .8 });
    inkLine([[x, y - 640 * s], [x, y - 1400 * s]], 1.4, '#B8B2A8', 'ink', 0);
    for (let i = 0; i < 3; i++) paint(ellPts(x + (i - 1) * 140 * s, y - 360 * s, 30 * s, 12 * s, 10), { wash: PAL.rose, ink: PAL.ink, sw: .5 });
  }
  function shotCage(t, lt, dur) {
    const tLand = .85, tOff = 1.75, lit = lt < tOff ? 1 : Math.max(0, 1 - (lt - tOff) * 6);
    const sh = shakeXY(t, 10 * (lt > tLand ? Math.exp(-(lt - tLand) * 9) : 0));
    camBegin(960 + sh[0], 560 + sh[1], 1.05);
    zooSet(t, .5 + .5 * lit);
    const cy = lerp(-200, 940, easeIn(seg(lt, 0, tLand))) + (lt > tLand ? 18 * spring(lt, tLand, 6, 20) : 0);
    pip(980, 940, 30, { eyes: 'narrow', mouth: lt > tOff ? 'smirk' : 'flat', brows: 'angry', aR: lt > tOff - .35 && lt < tOff + .2 ? 1.1 : -.6, aL: -.6, emote: lt > tOff + .1 ? 'dots' : null, emoteK: seg(lt, tOff + .1, tOff + .3) });
    birdcage(980, cy, 1, lit);
    keeper(330, 960, 30, { ...emotions(lt, [[0, 'proud'], [tOff + .1, 'nervous']]), view: 'q', aR: lt < tLand ? 1.4 : .5 });
    camEnd();
    if (lt > dur - .3) iris(960, 520, lerp(1500, 0, easeIn(seg(lt, dur - .3, dur))));
  }

  // ---------- 9. Five-star habitat, zero-star exit (63.59–65.98) ----------
  function shotStars(t, lt, dur) {
    const stars = [0, 1, 2, 3, 4].map(i => .25 + i * BEAT / 2), tRun = 1.3, tBonk = 1.75;
    const sh = shakeXY(t, 14 * (lt > tBonk ? Math.exp(-(lt - tBonk) * 9) : 0));
    camBegin(980 + sh[0], 580 + sh[1], 1.1);
    boilSeed('hotel');
    paint(rectPts(-400, -300, W + 800, H + 600), { wash: '#4A1F35', fill: '#7B2B4A', fillOp: 80, tex: .5, ink: null });
    for (const sd of [-1, 1]) { boilSeed('curt' + sd); paint(ribbon([[960 + sd * 900, 100], [960 + sd * 780, 500], [960 + sd * 880, 980]], 260, 360), { wash: '#A8324A', fill: '#6A1F35', fillOp: 70, tex: .6, ink: PAL.ink, sw: .8 }); }
    boilSeed('chand'); glow(800, 200, 220, '#FFD27A', .8); paint(ellPts(800, 210, 90, 30, 16), { wash: GOLD, ink: PAL.ink, sw: .8 });
    boilSeed('fakedoor');
    paint(rectPts(1380, 420, 220, 420, 2), { wash: '#6A4A33', fill: '#9C7A5C', fillOp: 60, ink: PAL.ink, sw: .9 });
    paint(ellPts(1560, 640, 10, 10, 8), { wash: GOLD, ink: null });
    if (lt > tBonk) { boilSeed('crack'); inkLine([[1420, 560], [1470, 600], [1440, 650], [1500, 700]], 1.4, PAL.ink, 'ink', 0); }
    floor(900, '#3A1A2A');
    stars.forEach((p, i) => {
      const k = backOut(seg(lt, p, p + .25)); if (k <= 0) return;
      boilSeed('star5' + i);
      const fall = lt > tBonk + i * .07 ? easeIn(seg(lt, tBonk + i * .07, tBonk + .6 + i * .07)) : 0;
      paint(starPts(560 + i * 170, 220 + 900 * fall, 52 * k, .45, 5, fall * 3), { wash: GOLD, ink: PAL.ink, sw: .8 });
    });
    const x = lt < tRun ? 900 : lt < tBonk ? lerp(900, 1380, easeIn(seg(lt, tRun, tBonk))) : 1340 - 60 * easeOut(seg(lt, tBonk, tBonk + .4));
    const dizzy = lt > tBonk;
    pip(x, 900, 30, { eyes: dizzy ? 'swirl' : (lt > tRun ? 'wide' : 'narrow'), mouth: dizzy ? 'wobble' : 'flat', run: lt > tRun && lt < tBonk ? lt * 3 : null,
      rot: dizzy ? -.15 * spring(lt, tBonk, 4, 14) : 0, sq: dizzy ? .2 * Math.exp(-(lt - tBonk) * 6) : 0, emote: dizzy ? 'stars' : null, emoteK: 1, emoteAge: lt - tBonk });
    camEnd();
    if (lt < .3) iris(960, 520, lerp(0, 1500, easeIn(lt / .3)));
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, NIGHT);
  }

  // ---------- 10. You don't love us, you just like your pets well-trained (65.98–68.38) ----------
  function shotLeash(t, lt, dur) {
    const tStop = 1.35, yank = lt > tStop ? Math.exp(-(lt - tStop) * 6) : 0;
    const walkK = lt < tStop ? lt : tStop + (lt - tStop) * .05;
    const cx = 700 + walkK * 330;
    camBegin(cx + 120, 600, 1.1);
    nightSky(t, '#1E2A4A');
    for (let i = 0; i < 8; i++) { boilSeed('tree' + i); const x = i * 520 - 200; paint(ellPts(x, 640, 170, 210, 22, 6), { wash: mixCol('#2E4A3A', PAL.sap, .3 * hash(i)), ink: PAL.ink, sw: .7 }); paint(rectPts(x - 18, 780, 36, 180, 2), { wash: '#4A3A2A', ink: PAL.ink, sw: .6 }); }
    for (let i = 0; i < 5; i++) { boilSeed('lamp' + i); const x = i * 700; glow(x, 430, 180, '#FFD27A', .7); paint(ellPts(x, 430, 20, 28, 10), { wash: '#FFE6A6', ink: PAL.ink, sw: .6 }); inkLine([[x, 455], [x, 940]], 1.5, PAL.ink, 'ink', 0); }
    floor(940, '#3A3A4A');
    const keeperX = cx + 300 - 60 * yank, pipX = cx - 150, walking = lt < tStop;
    keeper(keeperX, 940, 26, { ...emotions(lt, [[0, 'happy', { emote: 'music' }], [tStop, 'surprised']]), view: walking ? 'side' : 'q', walk: walking ? lt * 2.2 : null, rot: -.25 * yank, aL: .4 });
    pip(pipX, 940, 30, { eyes: 'narrow', brows: 'angry', mouth: 'flat', walk: walking ? lt * 1.4 : null, rot: walking ? .12 : -.05, aL: -.6, aR: -.6,
      draw: (s, sw) => paint(rectPts(-1.7 * s, -8.9 * s, 3.4 * s, .7 * s, 1), { wash: '#C8324A', ink: PAL.ink, sw: sw * .5 }) });
    boilSeed('leash');
    const a = [pipX, 940 - 8.6 * 30], b = [keeperX - 30, 940 - 4.5 * 26], sag = walking ? 70 : 70 * (1 - yank);
    inkLine([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag], b], 1.4, '#C8324A', 'ink', .6);
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, NIGHT);
  }

  // ---------- 11. "Sanctuary"? That's a cell with a fancier name (68.38–71.09) ----------
  function shotSpa(t, lt, dur) {
    const tPull = .95, tLift = 1.75;
    camBegin(980, kf(lt, [[0, 600], [tPull, 600], [tPull + .5, 580]]), kf(lt, [[0, 1.7], [tPull, 1.75], [tPull + .55, 1.0]], easeOut));
    boilSeed('cellwall');
    paint(rectPts(-400, -300, W + 800, H + 600), { wash: '#7A7A88', fill: '#5A5A6A', fillOp: 70, tex: .7, ink: null });
    for (let r = 0; r < 9; r++) for (let c = 0; c < 10; c++) { boilSeed('brick' + r + c); paint(rectPts(c * 240 - 120 * (r % 2) - 200, r * 120 - 100, 230, 110, 2), { fill: '#6A6A7A', fillOp: 70, ink: PAL.ink, sw: .3 }); }
    boilSeed('window'); paint(rectPts(1280, 220, 200, 160, 2), { wash: NAVY, ink: PAL.ink, sw: .9 }); for (let i = 1; i < 4; i++) inkLine([[1280 + i * 50, 220], [1280 + i * 50, 380]], 1.6, PAL.ink, 'ink', 0);
    for (let i = 0; i < 3; i++) { boilSeed('cand' + i); const x = 660 + i * 60; glow(x, 690, 70, '#FFC766', .8 + .2 * Math.sin(t * 9 + i)); paint(rectPts(x - 14, 700, 28, 60, 1), { wash: PAL.cream, ink: PAL.ink, sw: .5 }); paint(ellPts(x, 688, 6, 12, 8), { wash: PAL.ochre, ink: null }); }
    boilSeed('towel'); paint(rrPts(1240, 760, 200, 90, 30), { wash: '#F6C5D8', ink: PAL.ink, sw: .7 });
    floor(880, '#5A5060');
    const lifted = lt > tLift;
    pip(980, 880, 30, { hoodie: '#F6C5D8', eyes: lifted ? 'narrow' : 'closed', mouth: lifted ? 'flat' : 'smile', brows: lifted ? 'angry' : null, aL: lifted ? 1.2 : -1, aR: lifted ? 1.2 : -1,
      draw: !lifted ? (s, sw) => { for (const sd of [-1, 1]) paint(ellPts(sd * .95 * s, -10.55 * s, .8 * s, .78 * s, 14), { wash: '#A8D88A', fill: '#6E9F58', fillOp: 60, ink: PAL.ink, sw: sw * .5 }); } : null,
      handL: lifted ? (s, sw) => paint(ellPts(0, -.6 * s, .8 * s, .78 * s, 14), { wash: '#A8D88A', ink: PAL.ink, sw: sw * .5 }) : null,
      handR: lifted ? (s, sw) => paint(ellPts(0, -.6 * s, .8 * s, .78 * s, 14), { wash: '#A8D88A', ink: PAL.ink, sw: sw * .5 }) : null });
    const bk = easeOut(seg(lt, tPull, tPull + .5));
    if (bk > 0) for (let i = 0; i < 9; i++) { boilSeed('fbar' + i); const x = 520 + i * 115; inkLine([[x, lerp(-300, 180, bk)], [x, lerp(500, 1000, bk)]], 5, '#3A3A48', 'ink', 0); }
    camEnd();
    if (lt > dur - .12) flash((lt - (dur - .12)) / .12, '#FFB060');
  }

  // ---------- 12. We ain't the exhibit, we invented the glass (71.09–73.32) ----------
  function shotBlow(t, lt, dur) {
    const puffs = beatsIn(t, lt, 111, 113), puffK = hitEnv(lt, puffs, 6), tFlat = 1.45;
    camBegin(1000, 580, kf(lt, [[0, 1.2], [dur, 1.05]]));
    boilSeed('shop');
    paint(rectPts(-400, -300, W + 800, H + 600), { wash: '#3A1E18', fill: '#6A2E1E', fillOp: 70, tex: .6, ink: null });
    boilSeed('furnace');
    glow(360, 640, 380, '#FF8A3A', 1);
    paint(rrPts(200, 480, 320, 420, 60, 2), { wash: '#4A3A3A', ink: PAL.ink, sw: 1 });
    paint(ellPts(360, 640, 90, 90, 18), { wash: '#FFB060', fill: '#FF7A3A', fillOp: 120, ink: PAL.ink, sw: .8 });
    floor(900, '#2A1A14');
    const grow = clamp(puffs.reduce((s, p) => s + seg(lt, p - .05, p + .35), 0) / 3);
    const flatK = ease(seg(lt, tFlat, tFlat + .4));
    const bx = lerp(1180, 1300, flatK), by = 560, r = 50 + 170 * grow;
    boilSeed('bubble');
    glow(bx, by, r * 2.2, '#FFC766', .9);
    if (flatK < 1) paint(ellPts(bx, by, lerp(r, 330, flatK), lerp(r * .95, 240, flatK), 26, 2), { wash: '#FFD27A', fill: '#FF9A3A', fillOp: 90, tex: .4, ink: PAL.ink, sw: 1 });
    if (flatK > 0) { paint(rectPts(bx - 330 * flatK, by - 240 * flatK, 660 * flatK, 480 * flatK, 2), { fill: '#BFE3F2', fillOp: 80 * flatK, ink: '#EAF7FC', sw: 1.8 }); for (let i = 0; i < 3; i++) inkLine([[bx - 200 + i * 160, by - 180], [bx - 120 + i * 160, by]], 1.8 * flatK, '#FFFFFF', 'ink', 0); }
    boilSeed('pipe');
    inkLine([[790, 560], [bx - lerp(r, 330, flatK) + 10, by]], 3, '#8A8A9A', 'ink', 0);
    pip(700, 900, 32, { eyes: lt > tFlat + .3 ? 'closed' : 'narrow', mouth: lt > tFlat + .3 ? 'grin' : 'o', sq: -.05 * puffK, blush: puffK * .8, aR: .1, aL: -.8,
      emote: lt > tFlat + .4 ? 'spark' : null, emoteK: seg(lt, tFlat + .4, tFlat + .6) });
    camEnd();
    if (lt < .25) flash(1 - lt / .25, '#FFB060');
  }

  // ---------- 13. Keep pressin' your face on it, Keeper. We laugh last. (73.32–76.84) ----------
  function shotLaugh(t, lt, dur) {
    const lastBar = beatsIn(t, lt, 116, 119), squish = hitEnv(lt, lastBar, 6), tLaugh = 1.4;
    const sh = shakeXY(t, 6 * squish);
    camBegin(960 + sh[0], 560 + sh[1], kf(lt, [[0, 1.0], [lastBar[0], 1.05], [dur, 1.35]], easeIn) + .04 * squish);
    boilSeed('outside');
    paint(rectPts(-400, -300, W + 800, H + 600), { wash: '#16233F', ink: null });
    glow(960, 300, 500, '#2E4A6A', .6);
    keeper(1060, 1120, 64, { ...emotions(lt, [[0, 'determined'], [tLaugh + .3, 'angry']]), view: 'front', sx: 1.12 + .12 * squish, sy: .95 - .08 * squish, noShadow: true, boilKey: 'squish', aL: 1.2, aR: 1.2 });
    boilSeed('pane');
    paint(rectPts(-100, -100, W + 200, H + 200), { fill: '#BFE3F2', fillOp: 40, bleed: .05, tex: .2, ink: null });
    paint(ellPts(1060, 800, 360 + 40 * squish, 180, 22), { fill: '#EAF7FC', fillOp: 60, bleed: .3, ink: null });
    for (let i = 0; i < 4; i++) inkLine([[200 + i * 450, 80], [380 + i * 450, 520]], 2.4, '#EAF7FC', 'ink', 0);
    const laugh = lt > tLaugh;
    pip(420, 1040, 40, { eyes: laugh ? 'closed' : 'narrow', mouth: laugh ? 'grin' : 'smirk', rot: laugh ? .1 * Math.sin(lt * 25) + .12 * squish : 0, dy: laugh ? -.4 * Math.abs(Math.sin(lt * 12)) : 0,
      aL: laugh ? -.3 : -1.0, aR: laugh ? 1.1 + .2 * Math.sin(lt * 20) : -1.0, blush: laugh ? .7 : 0 });
    camEnd();
  }

  shots([[43.0, shotShop], [45.88, shotTrip], [48.43, shotTail], [51.14, shotTap], [53.54, shotMorse], [55.93, shotPanda],
         [58.56, shotSwipe], [61.2, shotCage], [63.59, shotStars], [65.98, shotLeash], [68.38, shotSpa], [71.09, shotBlow], [73.32, shotLaugh]]);
})();
