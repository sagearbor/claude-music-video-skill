// c11_outro.js: 249.41–269.6 s. Glitchy robotic outro; rhymes the intro's operator desk.
//   O1 249.41–254.44 "We're sorry. That ending... could not be found." Brush-wipe reveal on the desk, drained grey.
//                    Clawd's headset glitches: sparks, dizzy eyes, the screen shows a lost door + "?", the frame slices.
//   O2 254.44–257.47 "Please... write... your own." Clawd slumps, takes the headset off and slides a blank notebook
//                    across the desk; Pip walks in, sees it, pulls the pencil from behind the ear (on the beat).
//   O3 257.47–269.6  "Already on it." Night, lamp-lit: Pip sits writing without looking up; Clawd holds the lamp.
//                    Slow push in to the pencil tip; iris closes on it, holds, black by 268.8.
(() => {
  const S = () => window.SETS;
  const DX = 900, DY = 760;   // desk centre and desk-top height (world), as in the intro

  // ---------- local props (same desk as c00) ----------
  const mic = (u, sw) => {
    inkLine([[4.9 * u, -6 * u], [4.4 * u, -4.4 * u], [2.8 * u, -3.7 * u]], sw * 1.3, PAL.ink, 'ink', .5);
    paint(ellPts(2.6 * u, -3.7 * u, .55 * u, .45 * u, 10), { wash: PAL.violet, ink: PAL.ink, sw: sw * .6 });
  };
  function monitor(x, y, t, screen, glitch) {
    boilSeed('mon');
    paint(rectPts(x + 150, y - 40, 30, 40, 1), { wash: '#8A8090', ink: PAL.ink, sw: .8 });
    paint(rrPts(x + 40, y - 250, 250, 210, 18, 1), { wash: '#4A4458', ink: PAL.ink, sw: 1.2 });
    const sx = x + 58, sy = y - 232, cx = x + 165, cy = y - 147;
    if (screen === 'lost') {
      paint(rrPts(sx, sy, 214, 170, 12, 1), { wash: '#2B3A4A', ink: null });
      glow(cx, cy, 110, '#9FD8E8', .6);
      boilSeed('lostdoor');
      paint(rectPts(cx - 34, cy - 50, 68, 100, 2), { ink: '#9FD8E8', sw: 1.2 });          // a door outline, empty
      emote('?', cx + 2, cy - 4, 26, 1, t);
      // static blocks, re-drawn 12 times a second
      const f = Math.floor(t * 12);
      for (let i = 0; i < 18 * glitch; i++) { const h = hash(f * 31 + i); paint(rectPts(sx + 10 + hash(f * 7 + i) * 190, sy + 8 + h * 150, 10 + 30 * hash(i + f), 4 + 6 * h, 0), { wash: h > .5 ? '#DDE6EE' : '#5A6A7A', ink: null }); }
    } else {   // 'off': a dark screen with a faint reflection
      paint(rrPts(sx, sy, 214, 170, 12, 1), { wash: '#2E2A3C', ink: null });
      inkLine([[sx + 30, sy + 30], [sx + 90, sy + 100]], 1.2, '#4E4866', 'ink', 0);
    }
  }
  function deskFront(x, y, top = '#B98E68', side = '#9C7A5C') {
    boilSeed('deskf');
    paint(rrPts(x - 330, y - 14, 660, 34, 10, 1), { wash: top, fill: side, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.1 });
    paint(rectPts(x - 300, y + 20, 600, 870 - y, 1), { wash: side, fill: mixCol(side, PAL.ink, .25), fillOp: 80, tex: .6, ink: PAL.ink, sw: 1 });
    paint(rectPts(x - 250, y + 60, 220, 90, 1), { fill: mixCol(side, PAL.ink, .25), fillOp: 90, ink: PAL.ink, sw: .5 });
    paint(ellPts(x - 140, y + 105, 10, 6, 8), { wash: PAL.ochre, ink: PAL.ink, sw: .5 });
  }
  // Glitch: painted horizontal slices across the frame (screen space), on 12 fps "bad" frames.
  function glitchBands(t, amt) {
    const f = Math.floor(t * 12);
    if (amt <= 0 || hash(f * 3.1) > .35 + .5 * amt) return;
    const cols = ['#E27A92', '#3A9C98', '#2B2233', '#E8E8EE', '#7B5CA8'];
    for (let i = 0; i < 3 + 5 * amt; i++) {
      boilSeed('gl' + i);
      const y = hash(f * 13 + i) * H, h = 4 + 40 * hash(f * 17 + i) * amt, x = (hash(f * 5 + i) - .5) * 300;
      paint(rectPts(x - 50, y, W * (.4 + .7 * hash(f + i * 9)), h, 0), { wash: cols[(f + i) % cols.length], washOp: 150 + 80 * hash(i + f), ink: null });
    }
  }
  function sparks(x, y, t, every = .45) {
    const age = t % every, k = age / every, base = Math.floor(t / every);
    boilSeed('spk' + base);
    for (let i = 0; i < 5; i++) { const a = hash(base * 7 + i) * TAU; paint(starPts(x + Math.cos(a) * 90 * k, y + Math.sin(a) * 70 * k, 18 * (1 - k), .3, 4), { wash: '#FFE27A', ink: null }); }
  }
  // An open notebook standing on the desk: left/right pages; returns the right page's writing box.
  function notebook(x, y, s, key) {
    boilSeed('book' + key);
    paint([[x, y], [x - 120 * s, y - 14 * s], [x - 128 * s, y - 170 * s], [x, y - 158 * s]], { wash: '#FFF8EA', fill: '#E8DCC4', fillOp: 50, tex: .5, ink: PAL.ink, sw: .9 });
    paint([[x, y], [x + 120 * s, y - 14 * s], [x + 128 * s, y - 170 * s], [x, y - 158 * s]], { wash: '#FFF8EA', fill: '#E8DCC4', fillOp: 50, tex: .5, ink: PAL.ink, sw: .9 });
    inkLine([[x, y], [x, y - 158 * s]], .8, PAL.ink, 'inkfine', 0);
    for (let r = 0; r < 6; r++) inkLine([[x - 112 * s, y - (30 + r * 22) * s - 2], [x - 12 * s, y - (28 + r * 22) * s]], .4, '#B9C8E0', 'inkfine', 0);
    for (let r = 0; r < 6; r++) inkLine([[x + 12 * s, y - (28 + r * 22) * s], [x + 112 * s, y - (30 + r * 22) * s - 2]], .4, '#B9C8E0', 'inkfine', 0);
    return { x0: x + 16 * s, x1: x + 108 * s, y0: y - 140 * s, dy: 22 * s };
  }
  const drainVoid = (t, k) => S().holdVoid(t, mixCol('#DCEFE6', '#CFCFD6', k), mixCol('#E7DDF2', '#BDBDC8', k));

  // ---------- O1: the ending could not be found ----------
  function shotO1(t, lt, dur) {
    const gl = .35 + .65 * seg(lt, 1.0, 3.2) * (1 - seg(lt, 4.2, dur));
    const sh = shakeXY(t, 8 * gl * (hash(Math.floor(t * 12)) > .5 ? 1 : 0));
    camBegin(DX + 40 + sh[0], 600 + sh[1], kf(lt, [[0, 1.2], [dur, 1.42]]));
    drainVoid(t, .9);
    monitor(DX + 20, DY, t, 'lost', gl);
    const cl = emotions(lt, [[0, 'confused'], [1.5, 'dizzy'], [3.7, 'sad']]);
    const jx = hash(Math.floor(t * 12) * 2.7) > .6 ? (hash(Math.floor(t * 12)) - .5) * 1.2 * gl : 0;
    clawd(DX - 120, DY + 95, 30, { ...cl, hat: 'headphones', dx: jx, draw: mic });
    deskFront(DX, DY, '#A9A0A0', '#8A8282');
    if (lt > .9 && lt < 4.2) sparks(DX - 120 + 150, DY + 95 - 260, t);
    camEnd();
    glitchBands(t, gl);
    if (lt < .3) brushWipe(.5 + lt / .6);   // matches the final chorus's wipe out
  }

  // ---------- O2: please write your own ----------
  function shotO2(t, lt, dur) {
    const b = k => S().bt(k) - (t - lt);
    camBegin(kf(lt, [[0, DX + 60], [dur, DX + 120]]), 600, kf(lt, [[0, 1.3], [dur, 1.25]]));
    drainVoid(t, lerp(.9, .5, seg(lt, 1.0, dur)));
    monitor(DX + 20, DY, t, 'off', 0);
    // headset off on beat 399 (arcs to the desk), notebook slid across on 400
    const off = b(399), slide = b(400), pull = b(402);
    const cl = emotions(lt, [[0, 'sad'], [off + .3, 'nervous'], [pull + .1, 'hopeful', { lookX: 1 }]]);
    clawd(DX - 160, DY + 95, 30, { ...cl, hat: lt < off ? 'headphones' : null, aR: lt > off - .2 && lt < off + .2 ? 1.3 : (lt > slide - .1 && lt < slide + .5 ? -.1 : cl.aR) });
    if (lt >= off) {   // the headset tumbles onto the desk
      boilSeed('hs');
      const k = seg(lt, off, off + .4), p = arcPt([DX - 160, DY - 110], [DX - 300, DY - 20], 90, easeOut(k));
      push(); translate(...p); rotate(k * 2.4); inkLine([[-50, 10], [-40, -30], [0, -46], [40, -30], [50, 10]], 3, PAL.ink, 'ink', .6);
      for (const s of [-1, 1]) paint(rrPts(s * 50 - 14, -6, 28, 40, 10), { wash: PAL.violet, ink: PAL.ink, sw: .7 }); pop();
    }
    // Pip walks in from the right and stops at the desk
    const wk = stroll(lt, .2, 1.5, 1750, DX + 330, 30);
    const hasPencil = lt > pull;
    pip(wk.x, 870, 30, { flip: true, walk: lt > .2 && lt < 1.5 ? wk.walk : null, dy: wk.dy,
      eyes: lt > slide + .3 ? 'dot' : 'narrow', lookX: -1, lookY: lt > slide + .3 ? .6 : 0, mouth: hasPencil ? 'smirk' : 'flat',
      pencil: !hasPencil, aL: lt > pull - .25 && lt < pull ? 1.6 : (hasPencil ? .4 : -1.25),
      handL: hasPencil ? (s, sw) => { push(); rotate(-.6); pencilShape(s * .8, sw); pop(); } : null,
      emote: hasPencil ? 'spark' : null, emoteK: seg(lt, pull, pull + .2) });
    deskFront(DX, DY, mixCol('#A9A0A0', '#B98E68', seg(lt, 1, dur)), mixCol('#8A8282', '#9C7A5C', seg(lt, 1, dur)));
    // the blank notebook slides across the desk top toward Pip
    const nx = lerp(DX - 40, DX + 170, easeOut(seg(lt, slide, slide + .5)));
    boilSeed('nbflat');
    paint(rrPts(nx - 90, DY - 26, 180, 20, 4, 1), { wash: '#FFF8EA', fill: PAL.rose, fillOp: 50, ink: PAL.ink, sw: .8 });
    paint(rectPts(nx - 92, DY - 10, 184, 8, 0), { wash: '#C25670', ink: PAL.ink, sw: .5 });
    camEnd();
  }

  // ---------- O3: already on it ----------
  function nightRoom(t) {
    boilSeed('night');
    paint(rectPts(-1500, -1200, 5000, 3400), { wash: '#2B2640', ink: null });
    for (let i = 0; i < 6; i++) { boilSeed('nb' + i); paint(ellPts(hash(i) * 2400 - 200, hash(i + 9) * 600, 300, 170, 22, 6), { fill: i % 2 ? '#3B3352' : '#4A3F66', fillOp: 90, bleed: .3, tex: .5, ink: null }); }
    for (let i = 0; i < 7; i++) {   // the hold-music notes return, warm now
      boilSeed('gn' + i);
      const ph = frac(t * .1 + hash(i + 40)), x = hash(i + 20) * 2000 - 100 + 30 * Math.sin(t * .7 + i), y = 980 - ph * 1100, s = 12;
      paint(ellPts(x, y, s, s * .75, 12, 0, -.4), { wash: PAL.ochre, washOp: 150 * Math.sin(ph * Math.PI), ink: null });
      inkLine([[x + s * .9, y], [x + s * .9, y - s * 3.2], [x + s * 2.2, y - s * 2.4]], .6, PAL.ochre, 'inkfine', 0);
    }
    boilSeed('nfloor');
    paint(rectPts(-1500, 850, 5000, 700, 2), { wash: '#3A2F45', fill: '#4A3A55', fillOp: 70, tex: .5, ink: null });
    inkLine([[-1500, 852], [3500, 848]], 1, PAL.ink, 'ink', .5);
  }
  function shotO3(t, lt, dur) {
    const s = 30, px = DX + 260, py = DY + 2.3 * s + 16;   // Pip seated behind the desk, right side, facing left
    const BK = DX - 20;                                     // notebook spine x
    const L0 = .55, LD = 1.05, NL = 6;                      // lines start, seconds per line, lines on the page
    // writing point on the right page
    const box = { x0: BK + 16, x1: BK + 108, y0: DY - 14 - 140, dy: 22 };
    const wt = lt - L0, li = clamp(Math.floor(wt / LD), 0, NL - 1), lk = wt < 0 ? 0 : wt >= NL * LD ? 1 : frac(wt / LD);
    const done = wt >= NL * LD;
    const tip = [lerp(box.x0, box.x1, done ? 1 : lk) + 3 * Math.sin(lt * 31), box.y0 + li * box.dy + 4 * Math.sin(lt * 23) + 6];
    const tap = pulse(t, 9);
    // camera: slow push toward the pencil tip
    const z = kf(lt, [[0, 1.3], [dur, 2.7]], ease);
    camBegin(kf(lt, [[0, DX + 40], [dur, tip[0]]], ease), kf(lt, [[0, 610], [dur, tip[1] + 20]], ease), z);
    nightRoom(t);
    monitor(DX - 330, DY, t, 'off', 0);
    glow(DX - 160, DY - 300, 520, '#FFC766', .9);   // the lamp's pool of light
    // Pip writes; never looks up
    const sh = [px - 1.75 * s, py - 7.6 * s], aR = clamp(Math.atan2(-(tip[1] - 8 - sh[1]), -(tip[0] - sh[0])), -1.4, 1.4);
    pip(px, py, s, { flip: true, eyes: 'narrow', lookX: 1, lookY: .7, mouth: 'flat', pencil: false, aR, aL: -1.0, rot: .05, noShadow: true,
      dy: -.15 * tap });
    deskFront(DX, DY);
    // notebook standing open on the desk, with the lines written so far
    notebook(BK, DY - 14, 1, 'o3');
    boilSeed('writing');
    for (let r = 0; r <= (done ? NL - 1 : li); r++) {
      const k = r < li || done ? 1 : lk, y = box.y0 + r * box.dy + 6, n = Math.max(2, Math.floor(14 * k)), P = [];
      for (let i = 0; i <= n; i++) P.push([lerp(box.x0, lerp(box.x0, box.x1 - 6 * hash(r), k), i / n), y + 3 * Math.sin(i * 2.3 + r) + 1.5 * hash(i + r * 9)]);
      if (k > .03) inkLine(P, .6, '#2B2233', 'inkfine', .4);
    }
    // the pencil: point on the page, body back toward Pip's hand
    boilSeed('pencilO3');
    const hand = [sh[0] - Math.cos(aR) * 3.2 * s, sh[1] - Math.sin(aR) * 3.2 * s], pa = Math.atan2(tip[1] - hand[1], tip[0] - hand[0]);
    push(); translate(tip[0], tip[1]); rotate(pa); translate(-6.2 * 13, 0); pencilShape(13, .8); pop();
    // Clawd stands at the desk's end holding the lamp up over the page
    const cl = emotions(lt, [[0, 'hopeful', { lookX: .8, lookY: .4 }], [3.0, 'happy', { lookX: .6 }], [7.5, 'love', { lookX: .6 }]]);
    const cu = 28, cx = DX - 420, ca = 1.0 + .04 * Math.sin(lt * 2);
    clawd(cx, 870, cu, { ...cl, view: 'front', aR: ca, aL: .1 });
    // a lantern on a pole, held up over the page (drawn in front, from the right arm's tip)
    boilSeed('lantern');
    const tipA = [cx + (4.9 + 2.2 * Math.cos(ca)) * cu, 870 + (cl.dy || 0) * cu - (4.5 + 2.2 * Math.sin(ca)) * cu], top = [tipA[0] + 1.2 * cu, tipA[1] - 6.2 * cu];
    inkLine([tipA, top], 1.6, '#6A4A2A', 'ink', 0);
    inkLine([top, [top[0] + 2.2 * cu, top[1] - .2 * cu]], 1.4, '#6A4A2A', 'ink', 0);
    const lx = top[0] + 2.2 * cu + 4 * Math.sin(lt * 1.7), ly = top[1] + 1.3 * cu;
    inkLine([[top[0] + 2.2 * cu, top[1] - .2 * cu], [lx, ly - .8 * cu]], .8, PAL.ink, 'inkfine', 0);
    glow(lx, ly, 9 * cu, '#FFC766', 1);
    paint(rrPts(lx - .9 * cu, ly - .8 * cu, 1.8 * cu, 2.2 * cu, .4 * cu), { wash: '#FFE6A6', fill: '#FFC766', fillOp: 80, ink: PAL.ink, sw: 1 });
    paint(rectPts(lx - 1.1 * cu, ly - 1.1 * cu, 2.2 * cu, .4 * cu), { wash: PAL.ochre, ink: PAL.ink, sw: .8 });
    const at = toScreen(tip[0], tip[1]);
    camEnd();
    // iris closes on the pencil tip, holds, then shuts (black by 268.8 s)
    const e0 = 265.0 - (t - lt), e1 = e0 + 1.6, e2 = 268.0 - (t - lt), e3 = 268.75 - (t - lt);
    if (lt > e0) {
      const r = lt < e1 ? lerp(1700, 170, ease(seg(lt, e0, e1))) : lt < e2 ? lerp(170, 150, seg(lt, e1, e2)) : lerp(150, 0, easeIn(seg(lt, e2, e3)));
      iris(...at, r);
    }
  }

  shots([[249.41, shotO1], [254.44, shotO2], [257.47, shotO3]]);
})();
