// c08_dutch.js: 168.35–189.17 s. The beat switch: fiddle, foot stomps, hand claps. Pennsylvania Dutch folk art —
// barn red, ochre, forest green and cream; hex signs, tulips, distelfinks, rolling Lancaster farmland.
// Everything stomps and claps on the beat (pulse(), move('stomp')). Shot functions are fn(t, lt, dur).
(() => {
  const RED = '#B5462E', OCHRE = '#E8AA38', GREEN = '#3F6B3A', CREAM = '#F6EAD0', SKY = '#F3D9A4', WOOD = '#8A5A34';
  const FOLK = [RED, OCHRE];

  // ---------- folk-art pieces ----------
  // Hex sign: a painted rosette, eight petals alternating red and green, an ochre heart, a dotted rim.
  function hexSign(x, y, r, spin = 0, key = 'hex', lit = 0) {
    boilSeed(key);
    if (lit > 0) glow(x, y, r * (1.6 + .5 * lit), '#FFD27A', lit);
    paint(ellPts(x, y, r, r, 36, 1), { wash: CREAM, ink: PAL.ink, sw: clamp(r / 90, .6, 1.6) });
    paint(ellPts(x, y, r * .9, r * .9, 36), { ink: RED, sw: clamp(r / 120, .5, 1.3), br: 'inkfine' });
    for (let i = 0; i < 8; i++) {
      const a = spin + i / 8 * TAU, c = i % 2 ? RED : GREEN, tip = [x + Math.cos(a) * r * .82, y + Math.sin(a) * r * .82];
      const s1 = [x + Math.cos(a + .2) * r * .38, y + Math.sin(a + .2) * r * .38], s2 = [x + Math.cos(a - .2) * r * .38, y + Math.sin(a - .2) * r * .38];
      paint([[x, y], s1, tip, s2], { wash: c, ink: PAL.ink, sw: clamp(r / 160, .4, 1) });
    }
    paint(ellPts(x, y, r * .2, r * .2, 16), { wash: OCHRE, ink: PAL.ink, sw: clamp(r / 160, .4, 1) });
    for (let i = 0; i < 16; i++) { const a = spin * .5 + i / 16 * TAU; paint(ellPts(x + Math.cos(a) * r * .95, y + Math.sin(a) * r * .95, r * .035, r * .035, 8), { wash: OCHRE, ink: null }); }
  }
  function tulip(x, y, s, t, i) {
    boilSeed('tulip' + i);
    const sw = 6 * Math.sin(t * 2.3 + i);
    inkLine([[x, y], [x + sw * .5, y - 40 * s], [x + sw, y - 80 * s]], 1.2, GREEN, 'ink', .5);
    paint([[x - 20 * s + sw, y - 80 * s], [x - 22 * s + sw, y - 115 * s], [x - 8 * s + sw, y - 100 * s], [x + sw, y - 120 * s], [x + 8 * s + sw, y - 100 * s], [x + 22 * s + sw, y - 115 * s], [x + 20 * s + sw, y - 80 * s]],
      { wash: i % 2 ? RED : OCHRE, ink: PAL.ink, sw: .7, curv: .3 });
  }
  // Distelfink: the folk-art goldfinch. Flaps on eighths.
  function finch(x, y, s, t, i, flip = false) {
    boilSeed('finch' + i);
    const f = Math.sin(bpOf(t) * TAU * 2 + i) * .6;
    push(); translate(x, y); scale(flip ? -s : s, s);
    paint(ribbon([[-40, 4], [-60, -6], [-74, 0]], 22, 6), { wash: GREEN, ink: PAL.ink, sw: .6 });
    paint(ellPts(0, 0, 38, 22, 18), { wash: OCHRE, ink: PAL.ink, sw: .8 });
    paint(ellPts(28, -14, 16, 15, 12), { wash: OCHRE, ink: PAL.ink, sw: .7 });
    paint([[42, -16], [56, -12], [42, -9]], { wash: RED, ink: PAL.ink, sw: .5 });
    paint(ellPts(32, -17, 3, 3, 6), { wash: PAL.ink, ink: null });
    paint([[-6, -4], [-30, -30 - 24 * f], [6, -12]], { wash: RED, ink: PAL.ink, sw: .6 });
    pop();
  }
  function sunsetSky(t, sunY = 260, k = 0) {
    boilSeed('sky');
    paint(rectPts(-600, -400, W + 1200, H + 800), { wash: mixCol(SKY, '#E9906A', k), ink: null });
    paint(ellPts(W / 2, 120, W, 320, 30, 10), { fill: mixCol('#F7E6B8', '#E26A5A', k), fillOp: 110, bleed: .3, tex: .5, ink: null });
    boilSeed('sun');
    glow(1400, sunY, 260, '#FFC766', .8);
    paint(ellPts(1400, sunY, 110, 110, 30, 1.5), { wash: mixCol(OCHRE, '#F2804A', k), ink: PAL.ink, sw: .8 });
  }
  function hills(t) {
    const H3 = [[300, 760, 900, 260, '#7FA65C'], [1500, 800, 1000, 300, '#5E8C48'], [900, 980, 1600, 330, GREEN]];
    H3.forEach(([cx, cy, rx, ry, c], i) => {
      boilSeed('hill' + i);
      paint(ellPts(cx, cy, rx, ry, 40, 2), { wash: c, fill: mixCol(c, PAL.ink, .2), fillOp: 70, bleed: .08, tex: .6, ink: PAL.ink, sw: .9 });
    });
    for (let r = 0; r < 4; r++) { boilSeed('furrow' + r); inkLine([[200 + r * 60, 700 + r * 26], [900, 640 + r * 30], [1700, 690 + r * 24]], .6, mixCol('#5E8C48', PAL.ink, .3), 'inkfine', .5); }
  }
  // A barn: red, gambrel roof, white X doors, a hex sign on the gable.
  function barn(x, y, w, h, t, key = 'barn', lit = 0) {
    boilSeed(key);
    paint(rectPts(x, y - h, w, h, 2), { wash: RED, fill: mixCol(RED, PAL.ink, .25), fillOp: 70, tex: .7, ink: PAL.ink, sw: 1.1 });
    paint([[x - 20, y - h], [x + w * .12, y - h - h * .45], [x + w / 2, y - h - h * .62], [x + w * .88, y - h - h * .45], [x + w + 20, y - h]], { wash: '#5A3A3A', ink: PAL.ink, sw: 1.1 });
    const dx = x + w * .3, dw = w * .4, dh = h * .62;
    paint(rectPts(dx, y - dh, dw, dh, 1), { wash: mixCol(RED, PAL.ink, .15), ink: CREAM, sw: 1.4 });
    inkLine([[dx, y - dh], [dx + dw, y]], 1.4, CREAM, 'ink', 0); inkLine([[dx + dw, y - dh], [dx, y]], 1.4, CREAM, 'ink', 0);
    hexSign(x + w / 2, y - h - h * .22, h * .17, t * .3, key + 'hex', lit);
  }
  // A horse, side view, facing right. head 0..1 lowers the head to the ground; walk = leg phase.
  function horse(x, y, s, o = {}) {
    boilSeed('horse' + (o.key || ''));
    push(); translate(x, y); scale(o.flip ? -s : s, s);
    const C = '#7A4A2E', D = '#4E2E1C', walk = o.walk ?? null;
    for (let i = 0; i < 4; i++) {
      const lx = [-70, -45, 55, 80][i], ph = walk == null ? 0 : Math.sin((walk + [0, .5, .5, 0][i]) * TAU) * .35;
      push(); translate(lx, 10); rotate(ph);
      paint(rectPts(-9, 0, 18, 95, 1), { wash: i % 2 ? D : C, ink: PAL.ink, sw: .7 });
      paint(rectPts(-11, 88, 22, 12, 1), { wash: PAL.ink, ink: null });
      pop();
    }
    paint(ribbon([[-95, -20], [-125, 10], [-130, 60]], 22, 6), { wash: D, ink: PAL.ink, sw: .7 });
    paint(ellPts(0, 0, 115, 52, 26, 1), { wash: C, fill: D, fillOp: 50, tex: .5, ink: PAL.ink, sw: 1 });
    const hd = clamp(o.head || 0), turn = o.turn || 0;
    const nk = [[70, -20], [100 + 20 * hd, -70 + 110 * hd], [125 + 40 * hd, -110 + 200 * hd]];
    paint(ribbon(nk, 52, 34), { wash: C, ink: PAL.ink, sw: .9 });
    paint(ribbon([[60, -30], [90 + 20 * hd, -80 + 100 * hd], [110 + 30 * hd, -120 + 180 * hd]], 14, 6), { wash: D, ink: null });
    const hx = nk[2][0], hy = nk[2][1];
    push(); translate(hx, hy); rotate(.5 + 1.0 * hd - turn);
    paint(rrPts(-18, -22, 82, 40, 16), { wash: C, ink: PAL.ink, sw: .9 });
    paint(ellPts(58, 6, 6, 4, 8), { wash: PAL.ink, ink: null });
    paint(ellPts(10, -8, 5, 5, 8), { wash: PAL.ink, ink: null });
    paint([[-10, -22], [-4, -42], [4, -22]], { wash: C, ink: PAL.ink, sw: .6 });
    if (o.munch) inkLine([[60, 14], [78, 30 + 6 * Math.sin(T * 20)], [70, 40]], 1.2, '#7FA65C', 'ink', .4);
    pop();
    pop();
  }
  function buggy(x, y, s, t) {
    boilSeed('buggy');
    push(); translate(x, y); scale(s);
    paint(rrPts(-90, -170, 170, 120, 16), { wash: '#4A4A55', fill: '#2B2233', fillOp: 60, ink: PAL.ink, sw: 1 });
    paint(rectPts(-90, -60, 180, 30, 1), { wash: '#2B2233', ink: PAL.ink, sw: .8 });
    paint([[-70, -100], [-70, -150], [60, -150], [60, -100]], { wash: '#6A6A78', ink: PAL.ink, sw: .6 });
    for (const wx of [-60, 60]) {
      paint(ellPts(wx, -10, 40, 40, 20), { ink: PAL.ink, sw: 1.2 });
      for (let k = 0; k < 6; k++) { const a = -t * 6 + k / 6 * Math.PI; inkLine([[wx + Math.cos(a) * 38, -10 + Math.sin(a) * 38], [wx - Math.cos(a) * 38, -10 - Math.sin(a) * 38]], .5, PAL.ink, 'inkfine', 0); }
    }
    inkLine([[90, -45], [190, -40]], 1, PAL.ink, 'ink', 0);
    pop();
  }
  // The farmer: a pip with a beard and a black brimmed hat (drawn over the beanie), plain colours.
  function farmer(x, y, s, o = {}) {
    pip(x, y, s, { hoodie: '#2F3550', beanie: '#2B2233', pants: '#2B2233', pencil: false, skin: '#E2A880', boilKey: 'farmer', ...o,
      draw: (s, sw) => {
        paint([[-2.1 * s, -9.6 * s], [2.1 * s, -9.6 * s], [1.4 * s, -7.6 * s], [0, -7.1 * s], [-1.4 * s, -7.6 * s]], { wash: '#6A4A3A', fill: '#4A2E22', fillOp: 60, ink: PAL.ink, sw: sw * .6, curv: .4 });
        paint(ellPts(0, -12.1 * s, 4.2 * s, .7 * s, 20), { wash: '#2B2233', ink: PAL.ink, sw: sw * .7 });
        paint(rrPts(-2.4 * s, -15 * s, 4.8 * s, 3 * s, .6 * s), { wash: '#2B2233', ink: PAL.ink, sw: sw * .7 });
      } });
  }
  // Clap: both arms up, hands meeting over the head on each beat, with a painted clap spark.
  const clapArms = (t, ph = 0) => { const p = pulse(t + ph, 7); return { aL: 1.05 + .35 * p, aR: 1.05 + .35 * p }; };
  function clapSpark(x, y, t, s = 1) {
    const a = frac(bpOf(t)); if (a > .35) return;
    boilSeed('clapspark' + Math.round(x));
    const k = a / .35;
    for (let i = 0; i < 5; i++) { const ang = -Math.PI / 2 + (i - 2) * .45; inkLine([[x + Math.cos(ang) * 30 * s * (1 + k), y + Math.sin(ang) * 30 * s * (1 + k)], [x + Math.cos(ang) * 60 * s * (1 + k), y + Math.sin(ang) * 60 * s * (1 + k)]], 1.4 * (1 - k), OCHRE, 'ink', 0); }
  }
  const stompShake = (t, a = 6) => shakeXY(t, a * pulse(t, 10));
  // A stomping, clapping dancer pose: the stomp's body motion, the clap's arms.
  const hoedown = t => { const m = move('stomp', t); return { ...m, walk: undefined, ...clapArms(t) }; };

  // ---------- 1: PA Dutch been off-grid since before it was cool ----------
  function shot1(t, lt, dur) {
    const sh = stompShake(t, 5);
    camBegin(kf(lt, [[0, 900], [dur, 1020]]) + sh[0], 560 + sh[1], 1.08);
    sunsetSky(t, 240, 0);
    hills(t);
    barn(1250, 690, 300, 210, t, 'farbarn');
    const bx = lerp(-200, 1150, lt / 2.6);
    buggy(bx, 800, 1.0, t);
    horse(bx + 330, 700, .9, { walk: lt * 2.4, key: 'b' });
    for (let i = 0; i < 7; i++) tulip(120 + i * 90, 1010, 1.1, t, i);
    for (let i = 0; i < 3; i++) finch(lerp(-200, 2200, frac(lt * .25 + i * .33)), 180 + 70 * i + 20 * Math.sin(t * 3 + i), .7, t, i);
    const p = hoedown(t);
    pip(1350, 990, 30, { ...p, eyes: 'happy', mouth: 'grin', blush: .4 });
    clapSpark(1350, 990 - 30 * 15.5 + (p.dy || 0) * 30, t, 1.2);
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, FOLK);
  }

  // ---------- 2: Barn up by sundown, no cloud, just a crew and some tools ----------
  function shot2(t, lt, dur) {
    const t0 = t - lt, k0 = Math.ceil((t0 - OFF) / BEAT), beats = [0, 1, 2, 3].map(k => SETS.bt(k0 + k) - t0);
    const up = beats.filter(b => lt > b).length;
    const ang = kf(lt, [[0, -1.45], ...beats.map((b, i) => [b + .2, -1.45 + (i + 1) * (1.45 / 4)])], backOut);
    const thunk = lt > beats[3] + .2 ? Math.exp(-(lt - beats[3] - .2) * 8) : 0, sh = shakeXY(t, 14 * thunk + 4 * pulse(t, 10));
    camBegin(960 + sh[0], kf(lt, [[0, 600], [dur, 560]]) + sh[1], kf(lt, [[0, 1.0], [dur, 1.08]]));
    sunsetSky(t, lerp(280, 520, lt / dur), .4 + .4 * lt / dur);
    hills(t);
    boilSeed('frame');
    push(); translate(720, 880); rotate(ang);
    const FW = 640, FH = 430;
    for (let i = 0; i <= 4; i++) paint(rectPts(i * FW / 4 - 12, -FH, 24, FH, 1), { wash: WOOD, fill: '#5E3A1E', fillOp: 60, tex: .6, ink: PAL.ink, sw: .9 });
    for (const yy of [-FH, -FH / 2]) paint(rectPts(-12, yy - 12, FW + 24, 24, 1), { wash: WOOD, fill: '#5E3A1E', fillOp: 60, tex: .6, ink: PAL.ink, sw: .9 });
    for (let i = 0; i < 4; i++) inkLine([[i * FW / 4, -FH / 2], [(i + 1) * FW / 4, -FH]], 3.5, '#6A4428', 'ink', 0);
    pop();
    const cols = ['#E27A92', '#7B5CA8', '#6E9F58', '#3A9C98', '#D97757'];
    for (let i = 0; i < 4; i++) {
      const x = 560 + i * 230, p1 = pulse(t + i * .05, 6);
      pip(x, 960, 20, { hoodie: cols[i], beanie: cols[(i + 2) % 5], skin: ['#E9B28E', '#B97A56', '#8A5A3C', '#F2C4A0'][i], pencil: false, boilKey: 'crew' + i,
        rot: -.2 - .12 * p1, aL: 1.0, aR: .9, eyes: 'closed', mouth: up >= 4 ? 'grin' : 'flat', sq: .08 * p1 });
    }
    const p = hoedown(t);
    pip(1600, 980, 28, { ...p, eyes: up >= 4 ? 'happy' : 'dot', mouth: 'grin', flip: true });
    clapSpark(1600, 980 - 28 * 15.5 + (p.dy || 0) * 28, t, 1.1);
    camEnd();
    if (lt > dur - .35) irisShape(starPts(960, 540, lerp(1500, 4, easeIn(seg(lt, dur - .35, dur))), .62, 8), '#2B2233');   // hex-star iris out
  }

  // ---------- 3: Blackout hit the city? In Lancaster, that's a Tuesday ----------
  function shot3(t, lt, dur) {
    camBegin(960, 560, kf(lt, [[0, 1.12], [dur, 1.0]]));
    const off = seg(lt, .55, .75), flick = lt > .55 && lt < .8 && Math.floor(lt * 30) % 2 ? 1 : 0;
    boilSeed('city');
    paint(rectPts(-400, -400, 1360, H + 800), { wash: mixCol('#3A4A7A', '#141826', off), ink: null });
    for (let i = 0; i < 9; i++) {
      boilSeed('tower' + i);
      const x = -100 + i * 120, h = 300 + 320 * hash(i + 4), y0 = 900 - h;
      paint(rectPts(x, y0, 100, h, 1), { wash: mixCol('#5A6A9A', '#20263A', off), ink: PAL.ink, sw: .7 });
      for (let r = 0; r < Math.floor(h / 60); r++) for (let c = 0; c < 3; c++) {
        const on = (1 - off) * (flick ? 0 : 1) * (hash(i * 31 + r * 7 + c) > .3 ? 1 : 0);
        paint(rectPts(x + 12 + c * 30, y0 + 20 + r * 60, 18, 26), { wash: on ? '#FFE6A6' : '#2A3048', ink: null });
      }
    }
    boilSeed('farmside');
    paint(rectPts(960, -400, 1400, H + 800), { wash: '#2E3A5A', fill: '#5A4A7A', fillOp: 60, ink: null });
    paint(ellPts(1450, 1000, 900, 220, 30, 2), { wash: GREEN, ink: PAL.ink, sw: .9 });
    paint(rectPts(1200, 560, 520, 340, 2), { wash: CREAM, fill: '#E3D2AE', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1 });
    paint([[1170, 560], [1460, 380], [1750, 560]], { wash: RED, ink: PAL.ink, sw: 1 });
    for (const [lx, ly] of [[1290, 660], [1630, 660], [1460, 500]]) {
      boilSeed('lan' + lx);
      glow(lx, ly, 150 * (1 + .1 * pulse(t, 4)), '#FFC766', 1);
      paint(rrPts(lx - 22, ly - 30, 44, 60, 10), { wash: '#FFE6A6', ink: PAL.ink, sw: .7 });
    }
    boilSeed('seam');
    inkLine([[960 + jit(4), -100], [955 + jit(4), 540], [962 + jit(4), 1200]], 2.6, PAL.ink, 'ink', .3);
    const shrug = seg(lt, 1.25, 1.45) * (1 - seg(lt, 2.2, 2.5));
    pip(1180, 960, 30, { eyes: lt > 1.3 ? 'closed' : 'dot', lookX: -1, mouth: lt > 1.3 ? 'smirk' : 'flat', flip: true,
      aL: lerp(-1.25, .15, shrug), aR: lerp(-1.25, .15, shrug), dy: -.4 * shrug, brows: lt > 1.3 ? 'up' : null });
    camEnd();
    if (lt < .35) irisShape(starPts(960, 540, lerp(4, 1500, easeOut(seg(lt, 0, .35))), .62, 8), '#2B2233');
    if (lt > dur - .2) SETS.speedLines(ease((lt - (dur - .2)) / .2));
  }

  // ---------- 4: Horse don't need a charger, corn don't need a news feed ----------
  function shot4(t, lt, dur) {
    const whip = lt < .2 ? 1 - ease(lt / .2) : 0;
    camBegin(960 - 600 * whip, 560, 1.05);
    sunsetSky(t, 200, .2);
    for (let i = 0; i < 16; i++) {
      boilSeed('corn' + i);
      const x = 60 + i * 120 + 30 * hash(i), sw = 14 * Math.sin(bpOf(t) * Math.PI + i * .4);
      inkLine([[x, 900], [x + sw * .5, 650], [x + sw, 420 + 40 * hash(i + 2)]], 2.4, '#5E8C48', 'ink', .4);
      for (let k = 0; k < 3; k++) paint(ribbon([[x + sw * .3, 800 - k * 110], [x + 50 + sw * .4, 760 - k * 110], [x + 90 + sw * .5, 780 - k * 110]], 18, 2), { wash: '#7FA65C', ink: PAL.ink, sw: .5 });
      paint(ellPts(x + sw * .6, 610, 16, 44, 12, 0, .1), { wash: OCHRE, ink: PAL.ink, sw: .6 });
    }
    boilSeed('field');
    paint(rectPts(-400, 880, W + 800, 400, 2), { wash: '#7A6A3A', fill: '#5E8C48', fillOp: 70, tex: .6, ink: PAL.ink, sw: .8 });
    boilSeed('charger');
    inkLine([[1500, 905], [1380, 915], [1250, 895], [1140, 900]], 2, '#E3E3EA', 'ink', .5);
    paint(rrPts(1080, 875, 60, 40, 8), { wash: '#F3F3F6', ink: PAL.ink, sw: .8 });
    if (Math.floor(t * 3) % 2) glow(1110, 895, 30, '#7FE07A', .8);
    const head = kf(lt, [[0, 0], [.35, .85], [1.15, .85], [1.45, .2], [dur, .25]]);
    horse(720, 700, 1.6, { head, turn: lt > 1.35 ? .8 * seg(lt, 1.35, 1.6) : 0, munch: lt > 1.6, key: 'h4' });
    if (lt > 1.0 && lt < 1.5) { boilSeed('snort'); const k = seg(lt, 1.0, 1.5); for (let i = 0; i < 3; i++) paint(ellPts(1060 + 90 * k + i * 20, 820 - 30 * i * k, 18 * k + 6, 12 * k + 4, 10), { fill: '#FFFFFF', fillOp: 150 * (1 - k), ink: null }); }
    camEnd();
    SETS.speedLines(whip);
  }

  // ---------- 5: Every gadget at the door gets the same interview ----------
  function shot5(t, lt, dur) {
    camBegin(kf(lt, [[0, 900], [dur, 960]]), 600, kf(lt, [[0, 1.15], [dur - .3, 1.25], [dur, 2.2]], easeIn));
    boilSeed('porch');
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#E3D2AE', fill: CREAM, fillOp: 80, tex: .5, ink: null });
    for (let i = 0; i < 12; i++) { boilSeed('board' + i); inkLine([[-200 + i * 190, 0], [-200 + i * 190, 880]], .6, '#C9B48A', 'inkfine', 0); }
    boilSeed('door5');
    paint(rectPts(1000, 300, 300, 580, 2), { wash: '#2B2233', ink: PAL.ink, sw: 1.2 });
    paint(rectPts(1000, 300, 60, 580, 1), { wash: RED, ink: PAL.ink, sw: .8 });
    hexSign(1150, 220, 70, t * .2, 'doorhex');
    boilSeed('deck');
    paint(rectPts(-400, 880, W + 800, 400, 2), { wash: WOOD, fill: '#6A4428', fillOp: 70, tex: .6, ink: PAL.ink, sw: .9 });
    for (let i = 0; i < 14; i++) inkLine([[-300 + i * 180, 880], [-320 + i * 180, 1100]], .6, '#5E3A1E', 'inkfine', 0);
    const lean = seg(lt, .4, .8) * (1 - seg(lt, 1.9, 2.2));
    pip(1330, 900, 26, { flip: true, eyes: 'dot', lookX: -1, mouth: 'smirk', rot: .25, boilKey: 'pippeek' });
    farmer(1150, 900, 31, { flip: true, eyes: 'narrow', brows: 'angry', mouth: 'flat', lookX: 1, rot: .12 * lean, aL: -.2, aR: -.2 });
    clawd(620, 900, 26, { ...emotions(lt, [[0, 'nervous'], [1.5, 'determined'], [2.1, 'hopeful']]), view: 'q' });
    camEnd();
    if (lt > dur - .25) flash(seg(lt, dur - .25, dur), '#2B2233');
  }

  // ---------- 6: "Will you make us closer?" If not: "We're good, thank you" ----------
  function shot6(t, lt, dur) {
    camBegin(kf(lt, [[0, 920], [dur, 980]]), 600, 1.08);
    boilSeed('kitchen');
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#C98A5A', fill: '#E8AA38', fillOp: 50, tex: .6, ink: null });
    glow(960, 300, 520, '#FFD27A', .9);
    boilSeed('lamp6');
    paint(ellPts(960, 300, 40, 30, 12), { wash: '#FFE6A6', ink: PAL.ink, sw: .7 });
    inkLine([[960, -100], [960, 270]], .9, PAL.ink, 'inkfine', 0);
    hexSign(300, 330, 90, t * .2, 'wallhex'); hexSign(1650, 330, 90, -t * .2, 'wallhex2');
    const fam = [[520, '#6E9F58', '#E9B28E'], [760, '#7B5CA8', '#B97A56'], [1160, '#E27A92', '#8A5A3C'], [1400, '#3A9C98', '#F2C4A0']];
    fam.forEach(([x, c, sk], i) => {
      const laugh = lt > 1.6 ? Math.abs(Math.sin((lt - 1.6) * 12 + i)) : 0;
      if (i === 1) farmer(x, 820, 22, { eyes: lt > 1.5 ? 'happy' : 'narrow', mouth: lt > 1.5 ? 'grin' : 'flat', aL: -1.0, aR: -1.0, dy: -.2 * laugh });
      else pip(x, 820, 22, { hoodie: c, beanie: fam[(i + 1) % 4][1], skin: sk, pencil: false, boilKey: 'fam' + i, eyes: lt > 1.5 ? 'happy' : 'dot', mouth: lt > 1.5 ? 'grin' : 'smile', aL: -1.0, aR: -1.0, dy: -.25 * laugh });
    });
    pip(960, 820, 23, { eyes: lt > 1.5 ? 'happy' : 'dot', mouth: 'grin', aL: -1.0, aR: -1.0, boilKey: 'pip6' });
    boilSeed('table');
    paint(rectPts(300, 760, 1300, 60, 2), { wash: WOOD, fill: '#6A4428', fillOp: 60, tex: .6, ink: PAL.ink, sw: 1 });
    paint(rectPts(260, 820, 1380, 300, 2), { wash: CREAM, fill: RED, fillOp: 40, hatch: { d: 40, a: Math.PI / 2, b: 'HB', c: RED, w: .6 }, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 5; i++) { boilSeed('dish' + i); paint(ellPts(420 + i * 260, 770, 60, 16, 16), { wash: '#F3F3F6', ink: PAL.ink, sw: .6 }); paint(ellPts(420 + i * 260, 764, 34, 12, 12), { wash: [OCHRE, '#7FA65C', RED, '#E8C080', '#B5462E'][i], ink: null }); }
    const hop = jump(lt, 1.15, 1.5, 2.2);
    const cl = emotions(lt, [[0, 'thinking'], [.9, 'idea'], [1.55, 'happy']]);
    const cx = 1660;
    clawd(cx, 840, 24, { ...cl, dy: (cl.dy || 0) + hop.dy, sq: (cl.sq || 0) + hop.sq, view: 'q', flip: true, aR: lt > 1.5 ? 1.0 : cl.aR });
    if (lt > 1.5) {
      boilSeed('pie');
      const k = easeOut(seg(lt, 1.6, 2.3)), p = arcPt([cx - 140, 700], [1180, 740], 120, k);
      paint(ellPts(p[0], p[1], 56, 20, 18), { wash: '#D9944A', ink: PAL.ink, sw: .7 });
      for (let i = 0; i < 4; i++) inkLine([[p[0] - 40 + i * 25, p[1] - 12], [p[0] - 30 + i * 25, p[1] + 10]], .5, '#8A5A34', 'inkfine', 0);
      if (k >= 1) emote('heart', 1160, 520, 22, seg(lt, 2.3, 2.45));
    }
    camEnd();
    if (lt < .3) flash(1 - lt / .3, '#2B2233');
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, FOLK);
  }

  // ---------- 7: Hex sign on the barn, that's the original firewall ----------
  function shot7(t, lt, dur) {
    const k0 = Math.ceil((t - lt - OFF) / BEAT), hits = [0, 1, 2, 3].map(k => SETS.bt(k0 + k) - (t - lt));
    const hit = Math.max(...hits.map(h => lt > h ? Math.exp(-(lt - h) * 7) : 0)), sh = shakeXY(t, 10 * hit);
    camBegin(960 + sh[0], kf(lt, [[0, 520], [dur, 470]]) + sh[1], kf(lt, [[0, 1.0], [dur, 1.25]]));
    boilSeed('night');
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#2A2A4A', fill: '#4A3A6A', fillOp: 70, tex: .5, ink: null });
    for (let i = 0; i < 24; i++) { boilSeed('st' + i); paint(starPts(hash(i) * W, hash(i + 40) * 380, 5, .35, 4), { wash: CREAM, washOp: 200, ink: null }); }
    boilSeed('ground7');
    paint(ellPts(960, 1100, 1300, 260, 30, 2), { wash: '#2F4A2E', ink: PAL.ink, sw: .9 });
    boilSeed('wall');
    paint(rectPts(360, 160, 1200, 820, 2), { wash: RED, fill: mixCol(RED, PAL.ink, .3), fillOp: 70, tex: .7, ink: PAL.ink, sw: 1.2 });
    for (let i = 0; i < 9; i++) inkLine([[360 + i * 150, 170], [360 + i * 150, 970]], .7, mixCol(RED, PAL.ink, .4), 'inkfine', 0);
    glow(960, 520, 420 + 80 * hit, '#FFD27A', .5 + .5 * hit);
    hexSign(960, 520, 250 * (1 + .04 * pulse(t, 6)), t * .4, 'bighex', .3);
    boilSeed('shield');
    brush.noFill(); brush.noWash(); brush.noHatch(); brush.set('ink', '#FFE6A6', 1.4 + 2 * hit);
    brush.beginShape(0); for (const p of ellPts(0, 0, 330 + 20 * hit, 330 + 20 * hit, 40)) brush.vertex(p[0] + 960, p[1] + 520); brush.endShape(true);
    hits.forEach((h, i) => {
      const k = seg(lt, h - .45, h), ang = [-2.4, -.6, 2.5, .7][i], d = lerp(720, 330, k);
      boilSeed('glitch' + i);
      if (lt < h - .45) return;
      if (lt < h) {
        const gx = 960 + Math.cos(ang) * d, gy = 520 + Math.sin(ang) * d;
        for (let j = 0; j < 5; j++) paint(rectPts(gx + (hash(j + i * 9) - .5) * 70, gy + (hash(j + i * 9 + 4) - .5) * 90, 40, 40), { wash: j % 2 ? '#FF3AD0' : '#3AF0FF', ink: null });
      } else if (lt < h + .4) {
        const a = seg(lt, h, h + .4);
        for (let j = 0; j < 12; j++) { const aa = ang + (j - 5.5) * .22, r = 340 + 300 * easeOut(a) * (.6 + .4 * hash(j + i)); paint(rectPts(960 + Math.cos(aa) * r, 520 + Math.sin(aa) * r, 34 * (1 - a) + 4, 34 * (1 - a) + 4), { wash: j % 2 ? '#FF3AD0' : '#3AF0FF', washOp: 255 * (1 - a), ink: null }); }
      }
    });
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, FOLK);
    if (lt > dur - .15) flash(seg(lt, dur - .15, dur), '#FFF5E2');
  }

  // ---------- 8: Neighbors are the insurance, cellar stocked wall to wall ----------
  function shot8(t, lt, dur) {
    camBegin(kf(lt, [[0, 960], [dur, 1000]]), 580, 1.05);
    boilSeed('cellar');
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#6A5A4A', fill: '#4A3A2E', fillOp: 70, tex: .7, ink: null });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { boilSeed('stone' + r + c); paint(rrPts(-60 + c * 360 + (r % 2) * 180, 40 + r * 120, 330, 110, 30, 3), { fill: '#7A6A58', fillOp: 70, ink: '#3A2E24', sw: .5 }); }
    glow(960, 200, 500, '#FFD27A', .8);
    const nb = Math.floor(bpOf(t)) - Math.floor(bpOf(t - lt)), filled = nb * 6 + 14;
    for (let r = 0; r < 3; r++) {
      boilSeed('shelf' + r);
      paint(rectPts(220, 330 + r * 170, 1480, 22, 1), { wash: WOOD, ink: PAL.ink, sw: .8 });
      for (let c = 0; c < 13; c++) {
        const idx = r * 13 + c; if (idx > filled) continue;
        boilSeed('jar' + idx);
        const x = 260 + c * 112, y = 330 + r * 170, col = [RED, OCHRE, '#7FA65C', '#B5462E', '#E8C080', '#7B5CA8'][Math.floor(hash(idx) * 6)];
        const pp = idx > filled - 6 && nb > 0 ? backOut(seg(frac(bpOf(t)), 0, .4)) : 1;
        paint(rrPts(x - 34 * pp, y - 110 * pp, 68 * pp, 110 * pp, 12), { wash: col, fill: CREAM, fillOp: 40, ink: PAL.ink, sw: .7 });
        paint(rectPts(x - 28 * pp, y - 122 * pp, 56 * pp, 14 * pp), { wash: '#C9C2B5', ink: PAL.ink, sw: .5 });
      }
    }
    boilSeed('floor8');
    paint(rectPts(-400, 880, W + 800, 400, 2), { wash: '#4A3A2E', ink: PAL.ink, sw: .9 });
    const cols = ['#E27A92', '#6E9F58', '#7B5CA8', '#D97757'];
    for (let i = 0; i < 4; i++) {
      const tin = i * .45; if (lt < tin) continue;
      const w = stroll(lt, tin, tin + 1.2, -200, 300 + i * 260, 22);
      pip(w.x, 980, 22, { hoodie: cols[i], beanie: cols[(i + 2) % 4], skin: ['#B97A56', '#E9B28E', '#8A5A3C', '#F2C4A0'][i], pencil: false, boilKey: 'nb' + i,
        walk: lt < tin + 1.2 ? w.walk : null, eyes: 'happy', mouth: 'grin', aL: .3, aR: .3,
        handR: (s, sw) => { paint(rrPts(-1.4 * s, -.2 * s, 2.8 * s, 1.8 * s, .5 * s), { wash: '#C99A4A', hatch: { d: 10, a: .8, b: 'HB', c: '#8A6A2A', w: .5 }, ink: PAL.ink, sw: sw * .6 }); paint(ellPts(0, -.4 * s, .7 * s, .5 * s, 10), { wash: [RED, OCHRE, '#7FA65C', '#E8C080'][i], ink: null }); } });
    }
    const p = hoedown(t);
    pip(1500, 990, 30, { ...p, eyes: 'happy', mouth: 'grin', flip: true, boilKey: 'pip8' });
    clapSpark(1500, 990 - 30 * 15.5 + (p.dy || 0) * 30, t, 1.2);
    camEnd();
    if (lt < .15) flash(1 - lt / .15, '#FFF5E2');
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#1F2550', '#C9D3E6']);
  }

  shots([[168.35, shot1], [170.75, shot2], [173.46, shot3], [176.25, shot4], [178.88, shot5], [181.52, shot6], [184.07, shot7], [186.62, shot8]]);
})();
