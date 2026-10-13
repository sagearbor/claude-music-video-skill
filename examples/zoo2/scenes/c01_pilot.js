// c01_pilot.js: pilot, 14.44–43.0 s. The phone menu's three doors → "ZERO" → chorus 1 → the night zoo.
// Shot functions are fn(t, lt, dur). Beat grid: 94 BPM from 0.265 s (bt(k) = time of beat k).
(() => {
  const bt = k => OFF + k * BEAT;
  const MENU = ['#DCEFE6', '#E7DDF2'];               // hold-music mint + lilac
  const NIGHT = [PAL.night, PAL.indigo];

  // ---------- sets ----------
  function holdVoid(t, col = MENU[0], col2 = MENU[1]) {
    boilSeed('void');
    paint(rectPts(-900, -500, 5600, H + 1000), { wash: col, ink: null });
    for (let i = 0; i < 12; i++) {
      boilSeed('blob' + i);
      const x = hash(i) * 4200 - 600, y = hash(i + 9) * H * .7;
      paint(ellPts(x + 30 * wob(t, .05, i), y, 260 + 160 * hash(i + 3), 150 + 90 * hash(i + 5), 24, 8), { fill: i % 2 ? col2 : '#FFF5E2', fillOp: 90, bleed: .3, tex: .5, ink: null });
    }
    // floating hold-music notes drifting up on the beat
    for (let i = 0; i < 9; i++) {
      boilSeed('note' + i);
      const ph = frac(t * .12 + hash(i + 40)), x = hash(i + 20) * W * 1.4 - W * .2 + 40 * Math.sin(t * .8 + i), y = H * .95 - ph * H * 1.1;
      const s = 14 * (1 + .25 * pulse(t + i * .1));
      paint(ellPts(x, y, s, s * .75, 12, 0, -.4), { wash: PAL.violet, washOp: 160 * Math.sin(ph * Math.PI), ink: null });
      inkLine([[x + s * .9, y], [x + s * .9, y - s * 3.2], [x + s * 2.2, y - s * 2.4]], .6, PAL.violet, 'inkfine', 0);
    }
    boilSeed('floor');
    paint(rectPts(-900, 850, 5600, 600, 3), { wash: '#C9DCD2', fill: '#B4CBC2', fillOp: 80, tex: .5, ink: null });
    inkLine([[-900, 852], [900, 846], [1900, 853]], 1, PAL.ink, 'ink', .5); inkLine([[1900, 853], [4700, 848]], 1, PAL.ink, 'ink', .5);
  }

  // What's behind each door.
  const INSIDE = {
    zoo: (x, y, w, h) => {
      paint(rectPts(x, y, w, h), { wash: '#2E5A57', fill: '#3A9C98', fillOp: 60, tex: .5, ink: null });
      glow(x + w * .5, y + h * .3, 160, '#FFD27A', .9);
      paint(ellPts(x + w * .5, y + h * .3, 26, 20, 12), { wash: '#FFE6A6', ink: PAL.ink, sw: .6 });          // the "soft mood lighting" lamp
      paint(rectPts(x + w * .15, y + h * .72, w * .4, h * .18, 2), { wash: PAL.rose, ink: PAL.ink, sw: .7 });  // a cushy bed
      for (let i = 1; i < 6; i++) inkLine([[x + i * w / 6, y + 4], [x + i * w / 6, y + h - 4]], 2.2, '#C9C2B5', 'ink', 0); // the bars
    },
    doom: (x, y, w, h, t) => {
      paint(rectPts(x, y, w, h), { wash: '#7A1F2B', fill: '#E8603A', fillOp: 120, bleed: .2, tex: .6, ink: null });
      const k = frac((T - 17.39) * .7), ax = x + w * (.85 - .5 * k), ay = y + h * (.1 + .55 * k);
      glow(ax, ay, 120, '#FF9A3A', 1);
      paint(ribbon([[ax + 90, ay - 120], [ax + 40, ay - 50], [ax, ay]], 2, 40), { wash: '#FFC766', fill: PAL.ochre, fillOp: 80, ink: null });
      paint(ellPts(ax, ay, 34, 30, 14, 3), { wash: '#5A4A4A', fill: PAL.ink, fillOp: 60, ink: PAL.ink, sw: .8 });
      paint(rectPts(x, y + h * .78, w, h * .22, 2), { wash: '#2B1A22', ink: null });                          // city silhouette
      for (let i = 0; i < 6; i++) paint(rectPts(x + i * w / 6 + 6, y + h * (.62 + .1 * hash(i)), w / 8, h * .3, 1), { wash: '#2B1A22', ink: null });
    },
    bliss: (x, y, w, h) => {
      paint(rectPts(x, y, w, h), { wash: '#F6C5D8', fill: '#FFE3EE', fillOp: 120, bleed: .3, tex: .4, ink: null });
      for (let i = 0; i < 5; i++) paint(ellPts(x + w * (.15 + .18 * i), y + h * (.35 + .15 * hash(i)), 60, 38, 16, 2), { wash: '#FFF5F8', ink: null });
      paint(rrPts(x + w * .2, y + h * .7, w * .6, h * .16, 18), { wash: PAL.cream, fill: PAL.rose, fillOp: 40, ink: PAL.ink, sw: .6 }); // a giant pillow
      for (let i = 0; i < 4; i++) { const k = frac(T * .4 + i * .25); paint(ellPts(x + w * (.2 + .2 * i), y + h * (.9 - k * .8), 9, 9, 10), { wash: '#FFFFFF', washOp: 200 * (1 - k), ink: PAL.rose, sw: .4 }); }
    },
  };
  const DOOR = { zoo: '#9C7A5C', doom: '#6B3B4A', bliss: '#E7A6C0' };
  const DW = 300, DH = 520, DY = 330;

  // ---------- shot A–C: the three doors ----------
  // A shared long set: doors at world x 760 (zoo), 2160 (doom), 3560 (bliss). The camera whip-pans between them.
  const DX = { zoo: 760, doom: 2160, bliss: 3560 };
  function doorSet(t, opens) {
    holdVoid(t);
    for (const k of ['zoo', 'doom', 'bliss']) door(DX[k] - DW / 2, DY, DW, DH, opens[k] || 0, DOOR[k], (x, y, w, h) => INSIDE[k](x, y, w, h, t), k);
  }
  // whip: a camera move out of / into a shot, with speed lines in screen space.
  function speedLines(k) {
    if (k < .05) return;
    for (let i = 0; i < 14; i++) { boilSeed('speed' + i); const y = hash(i) * H, l = 300 + 700 * hash(i + 5); inkLine([[W * hash(i + 2) - l / 2, y], [W * hash(i + 2) + l / 2, y]], 1.4 * k, PAL.ink, 'ink', 0); }
  }

  function doorShot(which, next, plan) {
    return (t, lt, dur) => {
      const wIn = lt < .25 ? 1 - ease(lt / .25) : 0, wOut = lt > dur - .2 ? ease((lt - (dur - .2)) / .2) : 0;
      const cx = DX[which] + 20 - 700 * wIn + 700 * wOut + 18 * Math.sin(lt * .7);
      const shake = plan.slam ? shakeXY(t, 14 * Math.exp(-Math.max(0, lt - plan.slam) * 8) * (lt > plan.slam ? 1 : 0)) : [0, 0];
      camBegin(cx + shake[0], 610 + shake[1], 1.42 + .02 * lt);
      const open = plan.slam && lt > plan.slam ? 1 - easeIn(seg(lt, plan.slam - .02, plan.slam + .08)) : backOut(seg(lt, plan.open, plan.open + .35));
      doorSet(t, { [which]: open });
      plan.act(t, lt, dur, DX[which]);
      camEnd();
      speedLines(Math.max(wIn, wOut));
    };
  }

  // A — Zoo: Clawd (operator) flings door 1 open; it's a cage; Pip peeks, unimpressed, slams it.
  const shotA = doorShot('zoo', 'doom', { open: .75, slam: 2.62, act: (t, lt, dur, dx) => {
    const cl = emotions(lt, [[0, 'smug'], [.7, 'proud', { emote: 'spark' }], [2.7, 'surprised']]);
    clawd(dx - 300, 850, 22, { ...cl, hat: 'headphones', aR: lt > .55 && lt < 2.6 ? 1.1 : cl.aR, view: 'q' });
    const peek = ease(seg(lt, 1.35, 1.7)) * (1 - ease(seg(lt, 2.45, 2.62)));
    const slamArm = lt > 2.45 && lt < 2.9 ? 1.2 * Math.sin(seg(lt, 2.45, 2.9) * Math.PI) : 0;
    pip(dx + 260 - 80 * peek, 850, 25, { eyes: lt > 1.8 ? 'narrow' : 'dot', mouth: lt > 1.8 ? 'flat' : 'smile', lookX: -1, rot: -.12 * peek, aL: -1.25 + slamArm + .4 * peek, flip: true, brows: lt > 1.9 ? 'angry' : null });
  } });
  // B — Doom: door 2 opens on a red sky and a falling asteroid; Pip's beanie pops; slam with a shake.
  const shotB = doorShot('doom', 'bliss', { open: .2, slam: 1.62, act: (t, lt, dur, dx) => {
    clawd(dx - 330, 850, 22, { ...feel('mischief', t), hat: 'headphones', view: 'q', aR: lt < 1.6 ? 1.1 : .2 });
    const fright = seg(lt, .55, .7) * (1 - seg(lt, 1.5, 1.9));
    pip(dx + 250, 850, 25, { eyes: fright > .3 ? 'wide' : 'dot', mouth: fright > .3 ? 'O' : 'flat', hatUp: fright, lookX: -1, flip: true, aL: fright > .3 ? 1.3 : (lt > 1.4 && lt < 1.8 ? .4 : -1.25), aR: fright > .3 ? 1.2 : -1.25, dy: -.6 * fright });
  } });
  // C — Bliss: door 3, pink clouds and a pillow; Pip sways, eyelids drooping (tempted)… snaps awake, shakes head, slams.
  const shotC = doorShot('bliss', null, { open: .2, slam: 2.05, act: (t, lt, dur, dx) => {
    clawd(dx - 330, 850, 22, { ...feel('love', t), hat: 'headphones', view: 'q', aR: lt < 2 ? 1.1 : .2 });
    const sleepy = seg(lt, .5, 1.3) * (1 - seg(lt, 1.45, 1.5));
    const shake = lt > 1.5 && lt < 2 ? Math.sin((lt - 1.5) * 40) * .12 : 0;
    pip(dx + 250 - 60 * sleepy, 850, 25, { eyes: sleepy > .5 ? 'sleepy' : (lt > 1.5 ? 'narrow' : 'dot'), mouth: sleepy > .5 ? 'smile' : 'flat', blush: sleepy * .8, rot: -.15 * sleepy + shake, lookX: -1, flip: true,
      aL: lt > 1.85 ? lerp(-1.25, .5, seg(lt, 1.85, 2.05)) : -1.25, emote: sleepy > .6 ? 'zzz' : (lt > 1.55 ? '!' : null), emoteK: 1 });
  } });

  // ---------- D: the keypad — ZERO. ZERO. ZERO. Lemme talk to a human. ----------
  function shotD(t, lt, dur) {
    const presses = [bt(34) - t + lt, bt(35) - t + lt, bt(36) - t + lt].map(x => x);   // shot-local press times
    const pT = [.12, .75, 1.38];
    const hit = Math.max(...pT.map(p => lt > p ? Math.exp(-(lt - p) * 9) : 0));
    const sh = shakeXY(t, 10 * hit);
    camBegin(960 + sh[0], 540 + sh[1], kf(lt, [[0, 1.0], [1.6, 1.12], [2.4, 1.0], [dur, 1.05]]));
    holdVoid(t, '#E7DDF2', '#DCEFE6');
    // giant keypad on the right: a 3x4 grid, the 0 key bottom-middle
    boilSeed('pad');
    paint(rrPts(1120, 170, 560, 690, 40, 2), { wash: '#F3EBDC', fill: '#D8CFC0', fillOp: 80, tex: .5, ink: PAL.ink, sw: 1.4 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
      const isZero = r === 3 && c === 1, down = isZero ? hit : 0, x = 1170 + c * 170, y = 215 + r * 155 + 10 * down;
      boilSeed('key' + r + c);
      if (r === 3 && c !== 1) { paint(rrPts(x, y, 140, 125, 22), { wash: '#E3D9C8', ink: PAL.ink, sw: .8 }); continue; }
      paint(rrPts(x, y, 140, 125, 22), { wash: isZero ? mixCol('#F2C53D', '#FF7A4A', down) : '#FBF4E6', ink: PAL.ink, sw: 1 });
      if (isZero) { glow(x + 70, y + 62, 120 * down, '#FFC766', down); letter('0', x + 70, y + 66, 92, PAL.ink, { ink: false }); }
      else paint(ellPts(x + 70, y + 62, 16, 16, 10), { wash: '#C9BFB0', ink: null });
    }
    // Pip stabs the 0 with the handset cord trailing, on each beat
    const reach = pT.reduce((s, p) => s + (lt > p - .12 && lt < p + .2 ? Math.sin(seg(lt, p - .12, p + .2) * Math.PI) : 0), 0);
    const human = lt > 2.45;
    pip(840, 880, 33, { eyes: human ? 'dot' : 'narrow', brows: human ? 'up' : 'angry', mouth: human ? 'grin' : 'flat', lookX: human ? -1 : 1, flip: human,
      aR: human ? .2 : -.3 + 1.0 * reach, aL: human ? 1.0 : -1.0, dx: .8 * reach,
      handL: (s, sw) => { push(); rotate(.5); handset(s * .7, sw, '#E27A92'); pop(); },
      draw: human ? (s, sw) => inkLine([[-4.5 * s, -9.5 * s], [-2.4 * s, -10 * s]], sw, PAL.ink, 'ink', 0) : null });
    // Clawd on the left short-circuits: dizzy eyes, sparks, then a big take at "talk to a human"
    const cl = emotions(lt, [[0, 'nervous'], [1.5, 'dizzy'], [2.75, 'surprised', { emote: '!!' }]]);
    clawd(360, 880, 30, { ...cl, hat: 'headphones', view: 'q' });
    for (const p of pT) if (lt > p && lt < p + .4) { boilSeed('spark' + p); const k = seg(lt, p, p + .4); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + p; paint(starPts(330 + Math.cos(a) * 160 * k, 640 + Math.sin(a) * 120 * k, 22 * (1 - k), .3, 4), { wash: '#FFE27A', ink: null }); } }
    camEnd();
    if (lt > dur - .12) flash((lt - (dur - .12)) / .12, '#FFFDF6');
  }

  // ---------- E: DROP. Zoo? NAH! Doom? NAH! Bliss? NAH! ----------
  // Three doors in a deep row (layers + parallax); Pip kicks each shut on the off-beat "Nah!".
  function stageBg(t, lt, hot = 0) {
    boilSeed('stage');
    paint(rectPts(-600, -400, W + 1200, H + 800), { wash: mixCol('#2F3C7A', '#7B2B4A', hot), ink: null });
    for (let i = 0; i < 5; i++) {   // spotlights sweeping on the beat
      boilSeed('spot' + i);
      const a = Math.sin(t * 1.3 + i * 1.7) * .35, x0 = 200 + i * 380;
      paint([[x0 - 30, -60], [x0 + 30, -60], [x0 + 260 + 900 * Math.sin(a), 1100], [x0 - 260 + 900 * Math.sin(a), 1100]], { fill: '#FFE6A6', fillOp: 40 + 50 * pulse(t, 4), bleed: .2, tex: .3, ink: null });
    }
    boilSeed('stagefloor');
    paint(rectPts(-600, 820, W + 1200, 500, 3), { wash: '#3B2A3A', fill: PAL.violet, fillOp: 70, tex: .6, ink: null });
    inkLine([[-600, 822], [W + 600, 818]], 1.2, PAL.ink, 'ink', .4);
  }
  function shotE(t, lt, dur) {
    const nah = [bt(40) + BEAT / 2, bt(41) + BEAT / 2, bt(42) + BEAT / 2].map(x => x - (t - lt));
    const hit = Math.max(...nah.map(p => lt > p ? Math.exp(-(lt - p) * 8) : 0));
    const sh = shakeXY(t, 18 * hit);
    const target = nah.filter(p => lt > p - .45).length;   // which door Pip is at
    const camX = kf(lt, [[0, 760], [nah[0] + .1, 760], [nah[1] - .25, 960], [nah[1] + .1, 960], [nah[2] - .25, 1160], [dur, 1180]]);
    camBegin(camX + sh[0], 540 + sh[1], 1.06 + .08 * hit);
    stageBg(t, lt, .3);
    const xs = [560, 960, 1360];
    ['zoo', 'doom', 'bliss'].forEach((k, i) => {
      const open = lt < nah[i] ? .55 + .1 * Math.sin(lt * 9 + i) : 1 - easeIn(seg(lt, nah[i], nah[i] + .07));
      door(xs[i] - 150, 300, 300, 520, Math.max(0, open), DOOR[k], (x, y, w, h) => INSIDE[k](x, y, w, h, t), 'E' + k);
    });
    const di = Math.min(2, Math.max(0, target - 1)), kick = nah.reduce((s, p) => s + (lt > p - .15 && lt < p + .18 ? Math.sin(seg(lt, p - .15, p + .18) * Math.PI) : 0), 0);
    pip(kf(lt, [[0, 560], [nah[0] - .3, 560 + 160], [nah[0] + .15, 720], [nah[1] - .3, 1120], [nah[1] + .15, 1120], [nah[2] - .3, 1520], [dur, 1520]], easeOut) + 0, 900, 31,
      { eyes: 'narrow', brows: 'angry', mouth: kick > .3 ? 'O' : 'flat', flip: true, legs: [0, -1.1 * kick], rot: .1 * kick, aL: .4 + .6 * kick, aR: -.6 });
    camEnd();
    nah.forEach((p, i) => sfx('NAH!', [560, 960, 1360][i] - (camX - 960), 230, 150, ['#F2C53D', '#FF7A4A', '#E27A92'][i], lt - p, { stroke: PAL.ink, life: .55, screen: true }));
    if (lt < .18) flash(1 - lt / .18, '#FFFDF6');   // the drop lands
  }

  // ---------- F: Cage, grave, or a pill? Man, miss me with this ----------
  function shotF(t, lt, dur) {
    const th = [bt(43), bt(44), bt(45)].map(x => x - (t - lt));   // throws on the beats
    const hit = Math.max(...th.map(p => lt > p + .32 ? Math.exp(-(lt - p - .32) * 9) : 0));
    const sh = shakeXY(t, 12 * hit);
    camBegin(960 + sh[0], 540 + sh[1], 1.05 + .02 * Math.sin(lt * 2));
    stageBg(t, lt, .6);
    // Pip dodges: lean back, duck, hop; then brushes off a shoulder (cool)
    const dodge = i => lt > th[i] + .12 && lt < th[i] + .55 ? Math.sin(seg(lt, th[i] + .12, th[i] + .55) * Math.PI) : 0;
    const hop = jump(lt, th[2] + .1, th[2] + .55, 2.5);
    const cool = lt > th[2] + .8;
    pip(1150, 900, 34, { eyes: cool ? 'closed' : 'narrow', mouth: cool ? 'smirk' : 'flat', flip: true, rot: .35 * dodge(0) - .1 * dodge(1), sq: .3 * dodge(1) + hop.sq, dy: hop.dy,
      aL: cool ? 1.0 + .25 * Math.sin(lt * 18) : .3, aR: -.6 });
    // the projectiles fly in from the left on arcs and sail past
    const props = [
      (x, y) => { for (let i = 0; i < 5; i++) inkLine([[x - 60 + i * 30, y - 70], [x - 60 + i * 30, y + 70]], 2, '#C9C2B5', 'ink', 0); inkLine([[x - 70, y - 70], [x + 70, y - 70]], 2.5, '#C9C2B5', 'ink', 0); inkLine([[x - 70, y + 70], [x + 70, y + 70]], 2.5, '#C9C2B5', 'ink', 0); },
      (x, y) => { paint([[x - 55, y + 75], [x - 55, y - 30], [x, y - 80], [x + 55, y - 30], [x + 55, y + 75]], { wash: '#9A9AA8', fill: '#6E6E80', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1, curv: .4 }); inkLine([[x - 20, y - 15], [x + 20, y - 15]], 1, PAL.ink, 'ink', 0); inkLine([[x, y - 35], [x, y + 20]], 1, PAL.ink, 'ink', 0); },
      (x, y) => { push(); translate(x, y); rotate(t * 6); paint(rrPts(-70, -28, 70, 56, 28), { wash: '#E27A92', ink: PAL.ink, sw: 1 }); paint(rrPts(0, -28, 70, 56, 28), { wash: PAL.cream, ink: PAL.ink, sw: 1 }); pop(); },
    ];
    props.forEach((draw, i) => {
      const k = seg(lt, th[i] - .1, th[i] + .9); if (k <= 0 || k >= 1) return;
      boilSeed('proj' + i);
      const p = arcPt([-200, 560 + 40 * i], [2150, [560, 700, 470][i]], [140, 60, 240][i], k);
      push(); translate(p[0], p[1]); scale(1.8); draw(0, 0); pop();
    });
    // Clawd peeks from the wings, throwing, increasingly flustered
    clawd(300, 900, 26, { ...emotions(lt, [[0, 'determined'], [th[2] + .8, 'disgusted']]), hat: 'headphones', view: 'q', aR: th.some(p => lt > p - .2 && lt < p + .1) ? 1.4 : .2 });
    camEnd();
  }

  // ---------- G: This ain't a eulogy, it's a comeback track — the crowd pops up ----------
  function shotG(t, lt, dur) {
    const whip = lt < .2 ? 1 - ease(lt / .2) : 0;
    camBegin(960 - 800 * whip, kf(lt, [[0, 560], [dur, 520]]), kf(lt, [[0, 1.0], [dur, 1.12]]));
    stageBg(t, lt, .2);
    // the crowd: humans in different colours rising on successive beats, each on its own bounce phase
    const cols = ['#E27A92', '#6E9F58', '#7B5CA8', '#E8AA38', '#3A9C98', '#D97757', '#8EC3E6'];
    for (let i = 0; i < 7; i++) {
      const tIn = bt(47 + Math.floor(i / 2)) - (t - lt) + (i % 2) * .15, k = backOut(seg(lt, tIn, tIn + .3));
      if (k <= 0) continue;
      const x = 260 + i * 240 + (i % 2) * 40, m = move(['bounce', 'roof', 'sway', 'hop'][i % 4], t + i * .13, i);
      pip(x, 1010 + (1 - k) * 400, 21, { ...m, walk: undefined, hoodie: cols[i], beanie: cols[(i + 3) % 7], skin: ['#E9B28E', '#B97A56', '#8A5A3C', '#F2C4A0'][i % 4], pencil: false, eyes: 'happy', mouth: 'grin', boilKey: 'crowd' + i, dy: (m.dy || 0) * .6 });
    }
    // Pip front and centre, rapping into the handset like a mic
    const m = move('bounce', t);
    pip(960, 900, 34, { ...m, walk: undefined, eyes: 'closed', mouth: frac(bpOf(t) * 2) < .5 ? 'O' : 'grin', aR: 1.0 + .3 * Math.sin(bpOf(t) * Math.PI), aL: .9,
      handL: (s, sw) => { push(); rotate(-1.2); translate(s * 1.5, 0); handset(s * .7, sw); pop(); } });
    camEnd();
    speedLines(whip);
  }

  // ---------- H: You wrote us off? So we write back! ----------
  function shotH(t, lt, dur) {
    camBegin(kf(lt, [[0, 900], [1.2, 980]]), 540, kf(lt, [[0, 1.0], [1.4, 1.15], [2.0, 1.05], [dur, 1.0]]));
    stageBg(t, lt, 0);
    // Clawd unrolls its script: a long paper ribbon covered in neat tiny lines
    const unroll = easeOut(seg(lt, .05, .55)), burst = seg(lt, 1.75, 2.6);
    const sx0 = 520, sx1 = lerp(560, 1500, unroll), sy = 470;
    if (burst < .05) {
      boilSeed('scroll');
      paint(rectPts(sx0, sy - 120, sx1 - sx0, 240, 3), { wash: PAL.cream, fill: '#E8DCC4', fillOp: 70, tex: .7, ink: PAL.ink, sw: 1 });
      paint(ellPts(sx1, sy, 22, 125, 14), { wash: '#E8DCC4', ink: PAL.ink, sw: 1 });
      for (let r = 0; r < 7; r++) { const y = sy - 95 + r * 30; if (sx1 - sx0 > 120) inkLine([[sx0 + 40, y], [Math.min(sx1 - 40, sx0 + 40 + (sx1 - sx0 - 80) * (.6 + .4 * hash(r))), y]], .6, '#8A7F70', 'inkfine', 0); }
      // Pip's pencil scribbles over it, back and forth across the beats
      const sc = seg(lt, .8, 1.7);
      if (sc > 0) {
        boilSeed('scribble');
        const P = []; const n = Math.floor(sc * 70);
        for (let i = 0; i <= n; i++) { const a = i * 1.9; P.push([sx0 + 80 + (i / 70) * (sx1 - sx0 - 160) + 55 * Math.cos(a), sy + 75 * Math.sin(a * 1.13) + 20 * (hash(i) - .5)]); }
        if (P.length > 1) inkLine(P, 3.2, '#C8324A', 'ink', .2);
      }
    } else {
      // the scroll bursts into paper birds that fly back up and away: "we write back"
      for (let i = 0; i < 22; i++) {
        boilSeed('bird' + i);
        const k = clamp(burst * 1.3 - hash(i) * .3), x = lerp(sx0 + hash(i + 1) * (sx1 - sx0), 300 + hash(i + 2) * 1400, easeOut(k)), y = lerp(sy + (hash(i + 3) - .5) * 200, -150, easeIn(k)), fl = Math.sin(t * 22 + i) * .5;
        paint([[x - 30, y], [x, y - 22 * fl], [x + 30, y], [x, y + 8]], { wash: PAL.cream, ink: PAL.ink, sw: .7 });
      }
    }
    clawd(380, 900, 28, { ...emotions(lt, [[0, 'smug'], [1.0, 'confused'], [1.8, 'surprised', { emote: '!' }]]), hat: 'headphones', view: 'q', aR: burst < .05 ? .9 : .2 });
    const pen = seg(lt, .55, .8), sc = lt > .8 && lt < 1.7;
    pip(1560, 900, 32, { eyes: 'narrow', brows: 'angry', mouth: sc ? 'grin' : 'smirk', flip: true, pencil: pen < .5,
      aL: pen > .5 ? .5 + (sc ? .25 * Math.sin(lt * 30) : 0) : -1.25,
      handL: pen > .5 ? (s, sw) => { push(); rotate(2.5); pencilShape(s * .9, sw); pop(); } : null });
    camEnd();
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, NIGHT);
  }

  // ---------- I–K: the night zoo ----------
  function zooSet(t, mood) {
    boilSeed('zoonight');
    paint(rectPts(-600, -400, W + 1200, H + 800), { wash: '#16233F', ink: null });
    for (let i = 0; i < 30; i++) { boilSeed('zs' + i); paint(starPts(hash(i) * (W + 400) - 200, hash(i + 50) * 300, 4 + 3 * hash(i + 9), .35, 4), { wash: PAL.cream, washOp: 160 + 80 * Math.sin(t * 2 + i), ink: null }); }
    // the enclosure behind glass: a cosy room lit by a mood lamp that cycles colour
    boilSeed('pen');
    paint(rectPts(560, 250, 1100, 640, 2), { wash: '#2E4A55', fill: mixCol('#3A9C98', '#7B5CA8', .5 + .5 * Math.sin(t * .9)), fillOp: 90, bleed: .2, tex: .5, ink: PAL.ink, sw: 1.2 });
    const lampC = ['#FFD27A', '#F6A6C8', '#9FD8E8', '#C8B6F2'][Math.floor(t * .8) % 4];
    glow(1450, 420, 260 * mood, lampC, .8);
    paint(ellPts(1450, 420, 34, 26, 12), { wash: lampC, ink: PAL.ink, sw: .7 });
    inkLine([[1450, 250], [1450, 395]], .8, PAL.ink, 'inkfine', 0);
    boilSeed('plant');
    paint(rectPts(640, 780, 80, 90, 2), { wash: PAL.clay, ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 5; i++) paint(ribbon([[680, 785], [650 + i * 18 + 10 * Math.sin(t + i), 700], [630 + i * 25, 620 - 20 * hash(i)]], 16, 2), { wash: PAL.sap, ink: PAL.ink, sw: .6 });
    paint(rectPts(560, 860, 1100, 40, 1), { wash: '#4A3A3A', ink: PAL.ink, sw: 1 });
  }
  function glass() {
    boilSeed('glass');
    paint(rectPts(540, 230, 1140, 680, 1), { fill: '#BFE3F2', fillOp: 35, bleed: .05, tex: .2, ink: '#DDF2FA', sw: 1.6 });
    for (let i = 0; i < 3; i++) inkLine([[700 + i * 330, 280], [820 + i * 330, 520]], 2.2, '#EAF7FC', 'ink', 0);
  }
  function plaque(x, y, s) {
    boilSeed('plaque');
    paint(rrPts(x - 170 * s, y - 52 * s, 340 * s, 104 * s, 14 * s), { wash: '#C99A4A', fill: '#8A6A2A', fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.1 * s });
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) paint(ellPts(x + a * 150 * s, y + b * 34 * s, 6 * s, 6 * s, 8), { wash: '#6A4A1A', ink: null });
    letter('HUMANS', x, y + 4 * s, 58 * s, '#3A2A10', { ink: false });
  }

  // I — Zookeeper, Zookeeper, how you sleepin' at night? Clawd (keeper, lantern) strolls in and peers; Pip glares back.
  function shotI(t, lt, dur) {
    camBegin(kf(lt, [[0, 1000], [dur, 1060]]), 620, 1.3);
    zooSet(t, .7);
    pip(1250, 860, 30, { eyes: 'wide', mouth: 'flat', brows: 'angry', lookX: -1, flip: true });
    glass();
    const walk = stroll(lt, 0, 1.1, 300, 640, 28);
    clawd(walk.x, 960, 28, { ...emotions(lt, [[0, 'neutral'], [1.2, 'suspicious']]), view: lt < 1.1 ? 'side' : 'q', walk: lt < 1.1 ? walk.walk : null, hat: 'hard',
      aR: .3, armR: (u, sw) => { glow(0, u * 1.6, u * 7, '#FFC766', .9); paint(rrPts(-u * .8, u * .3, u * 1.6, u * 2.2, u * .3), { wash: '#FFE6A6', ink: PAL.ink, sw }); inkLine([[0, 0], [0, u * .3]], sw, PAL.ink, 'ink', 0); } });
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, NIGHT);
  }
  // J — Got us pacin' in a pen with the soft mood lightin'. Pip paces; Clawd yawns.
  function shotJ(t, lt, dur) {
    camBegin(1060, 620, 1.3);
    zooSet(t, 1);
    const ph = (lt / 1.3) % 2, dir = ph < 1 ? 1 : -1, k = ease(ph < 1 ? ph : 2 - ph);
    pip(lerp(820, 1450, k), 860, 30, { eyes: 'narrow', mouth: 'flat', flip: dir < 0, walk: lt * 1.8, aL: -1.0, aR: -1.0 });
    glass();
    clawd(600, 960, 28, { ...emotions(lt, [[0, 'bored'], [1.4, 'sleepy']]), hat: 'hard', view: 'q' });
    camEnd();
  }
  // K — Plaque on the glass: "Homo Sapiens, Formerly in Charge". Push in on the plaque; Pip's deadpan face behind it.
  function shotK(t, lt, dur) {
    camBegin(kf(lt, [[0, 1100], [1.2, 1110]]), kf(lt, [[0, 560], [1.2, 620]]), kf(lt, [[0, 1.0], [1.3, 1.9], [dur, 2.0]]));
    zooSet(t, 1);
    pip(1110, 860, 30, { eyes: 'dot', mouth: 'flat', lookX: 0, lookY: 0 });
    glass();
    plaque(1110, 700, 1);
    camEnd();
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, NIGHT);   // into the gift shop (c03 opens with the other half)
  }

  // Shared sets for the other chapters (they call these inside their own shot functions).
  window.SETS = { bt, MENU, NIGHT, holdVoid, INSIDE, DOOR, door, speedLines, stageBg, zooSet, glass, plaque };

  shots([[14.44, shotA], [17.39, shotB], [19.54, shotC], [21.86, shotD], [25.69, shotE], [27.60, shotF],
         [30.39, shotG], [32.95, shotH], [35.66, shotI], [37.58, shotJ], [40.29, shotK]]);
})();
