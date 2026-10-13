// c00_intro.js: 0.0–14.44 s. Hold music. Pip calls the Future; Clawd, the smug operator, answers, pats a sweating
// Earth on hold, and raises the three doors, handing off to the pilot's shot A (door 1, whip in from the left).
//   I1 0.00–5.50  iris in on a ringing desk phone in the mint void; Pip trots in, picks up, gets put on hold, taps foot.
//   I2 5.50–8.30  whip to the operator desk: Clawd in a headset, "thank you for calling the Future", a welcome wave.
//   I3 8.30–11.49 push in: a tiny Earth waits on hold on the desk, sweating; Clawd pats it on the beats, all smiles.
//   I4 11.49–14.44 wide: Clawd sweeps an arm and three doors rise out of the floor on the beats; Pip gawps;
//                  a whip to the left hands off to shot A.
(() => {
  const S = () => window.SETS;

  // ---------- local props ----------
  // Clawd's headset microphone, drawn on the body (front/q view coords).
  const mic = (u, sw) => {
    inkLine([[4.9 * u, -6 * u], [4.4 * u, -4.4 * u], [2.8 * u, -3.7 * u]], sw * 1.3, PAL.ink, 'ink', .5);
    paint(ellPts(2.6 * u, -3.7 * u, .55 * u, .45 * u, 10), { wash: PAL.violet, ink: PAL.ink, sw: sw * .6 });
  };
  // The old desk phone: base + cradle. When `lifted`, the handset is elsewhere.
  function deskPhone(x, y, s, lifted, ring, key) {
    boilSeed('phone' + key);
    const j = ring * 8 * Math.sin(T * 70);
    paint(rrPts(x - 3.6 * s, y - 2.4 * s, 7.2 * s, 2.6 * s, .8 * s, 1), { wash: '#E27A92', fill: mixCol('#E27A92', PAL.ink, .3), fillOp: 60, tex: .5, ink: PAL.ink, sw: 1 });
    paint(ellPts(x, y - 1.2 * s, 1.1 * s, .7 * s, 16), { wash: PAL.cream, ink: PAL.ink, sw: .7 });   // the dial
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; paint(ellPts(x + Math.cos(a) * .75 * s, y - 1.2 * s + Math.sin(a) * .45 * s, .13 * s, .1 * s, 6), { wash: PAL.ink, ink: null }); }
    if (!lifted) { push(); translate(x + j * .3, y - 3 * s - ring * 10 * Math.abs(Math.sin(T * 35))); rotate(j * .004); handset(s * .95, 1); pop(); }
    if (ring > .05) for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) {   // ring arcs
      const r = (2.5 + i * 1.3) * s, P = []; for (let k = -3; k <= 3; k++) { const a = -Math.PI / 2 + sd * (.9 + k * .12); P.push([x + Math.cos(a) * r * 1.4, y - 3 * s + Math.sin(a) * r]); }
      inkLine(P, 1.2 * ring, PAL.violet, 'ink', .5);
    }
  }
  function table(x, y, w, key) {   // small side table, top at y
    boilSeed('table' + key);
    for (const sx of [-.38, .38]) paint(rectPts(x + sx * w - 10, y, 20, 850 - y + 4, 1), { wash: '#9C7A5C', ink: PAL.ink, sw: .8 });
    paint(rrPts(x - w / 2, y - 18, w, 26, 8, 1), { wash: '#B98E68', fill: '#9C7A5C', fillOp: 60, tex: .5, ink: PAL.ink, sw: 1 });
  }
  // The operator desk: back (monitor) is drawn before the characters, front panel after (it hides their legs).
  function deskBack(x, y, t) {
    boilSeed('mon');
    paint(rectPts(x + 150, y - 40, 30, 40, 1), { wash: '#8A8090', ink: PAL.ink, sw: .8 });
    paint(rrPts(x + 40, y - 250, 250, 210, 18, 1), { wash: '#4A4458', ink: PAL.ink, sw: 1.2 });
    paint(rrPts(x + 58, y - 232, 214, 170, 12, 1), { wash: '#FFF2D6', fill: '#F6C5D8', fillOp: 90, tex: .4, ink: null });
    const cx = x + 165, cy = y - 147;   // the Future's logo: a smiling sunrise
    glow(cx, cy, 120, '#FFD27A', .8);
    paint(ellPts(cx, cy + 20, 46, 46, 18), { wash: '#F2C53D', ink: PAL.ink, sw: .7 });
    for (let i = 0; i < 7; i++) { const a = Math.PI + (i + .5) / 7 * Math.PI, r0 = 58, r1 = 78 + 6 * pulse(t, 5); inkLine([[cx + Math.cos(a) * r0, cy + 20 + Math.sin(a) * r0], [cx + Math.cos(a) * r1, cy + 20 + Math.sin(a) * r1]], 1.2, PAL.ochre, 'ink', 0); }
    paint(rectPts(x + 58, cy + 25, 214, 60, 0), { wash: '#F6C5D8', ink: null });
    inkLine([[cx - 14, cy + 4], [cx, cy + 14], [cx + 14, cy + 4]], .8, PAL.ink, 'ink', .6);
  }
  function deskFront(x, y) {
    boilSeed('deskf');
    paint(rrPts(x - 330, y - 14, 660, 34, 10, 1), { wash: '#B98E68', fill: '#9C7A5C', fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.1 });
    paint(rectPts(x - 300, y + 20, 600, 870 - y, 1), { wash: '#9C7A5C', fill: '#7A5A44', fillOp: 80, tex: .6, ink: PAL.ink, sw: 1 });
    paint(rectPts(x - 250, y + 60, 220, 90, 1), { fill: '#7A5A44', fillOp: 90, ink: PAL.ink, sw: .5 });
    paint(ellPts(x - 140, y + 105, 10, 6, 8), { wash: PAL.ochre, ink: PAL.ink, sw: .5 });
  }
  // A tiny Earth on hold: nervous face, sweat. (x, y) = where it sits.
  function earth(x, y, r, t, flinch) {
    boilSeed('earth');
    const sq = .18 * flinch;
    push(); translate(x, y); scale(1 + sq * .6, 1 - sq); translate(0, -r);
    paint(ellPts(0, 0, r, r, 26, 1), { wash: '#4E8FD0', fill: PAL.sky, fillOp: 60, tex: .5, ink: PAL.ink, sw: 1 });
    for (const [bx, by, br] of [[-.35, -.35, .38], [.4, .2, .3], [-.15, .45, .25], [.45, -.5, .18]]) paint(ellPts(bx * r, by * r, br * r, br * r * .8, 12, 1), { wash: PAL.sap, ink: null });
    const lx = .1 * r * Math.sin(t * 3);
    for (const sd of [-1, 1]) {
      paint(ellPts(sd * .32 * r, -.1 * r, .16 * r, .2 * r, 10), { wash: PAL.cream, ink: PAL.ink, sw: .5 });
      paint(ellPts(sd * .32 * r + lx * .4 - .03 * r, -.16 * r, .07 * r, .09 * r, 8), { wash: PAL.ink, ink: null });
      inkLine([[sd * .5 * r, -.42 * r], [sd * .18 * r, -.34 * r]], .7, PAL.ink, 'inkfine', 0);   // worried brows
    }
    inkLine([[-.25 * r, .3 * r], [-.12 * r, .24 * r], [0, .3 * r], [.12 * r, .24 * r], [.25 * r, .3 * r]], .8, PAL.ink, 'ink', .3);
    pop();
    emote('sweat', x + r * 1.05, y - r * 1.9, r * .28, 1, t);
  }
  const holdHandset = (s, sw) => { push(); rotate(-1.75); handset(s * .62, sw); pop(); };

  // ---------- I1: the ring ----------
  function shotI1(t, lt, dur) {
    const PX = 980, TY = 700;
    camBegin(kf(lt, [[0, 960], [dur, 1010]]), kf(lt, [[0, 560], [dur, 590]]), kf(lt, [[0, 1.55], [2.6, 1.32], [dur, 1.4]]));
    S().holdVoid(t);
    table(PX, TY, 300, 'i1');
    const rings = [2, 3, 4].map(k => S().bt(k));   // rings on beats 2–4
    const pick = S().bt(5) + .05;
    const ring = t < pick ? Math.max(0, ...rings.map(r => t > r && t < r + .45 ? 1 - seg(t, r, r + .45) : 0)) : 0;
    deskPhone(PX, TY - 18, 26, t > pick, ring, 'i1');
    // Pip trots in from the right, picks up, then waits on hold, tapping a foot on the beat
    const wk = stroll(lt, .9, 2.9, 1700, PX + 230, 28);
    const lifted = t > pick, bored = lt > pick + .9;
    const tap = bored ? pulse(t, 7) : 0;
    pip(wk.x, 860, 28, { flip: true, walk: lt > .9 && lt < 2.9 ? wk.walk : null, dy: wk.dy,
      eyes: bored ? 'sleepy' : 'dot', mouth: bored ? 'flat' : 'smile', lookX: -1,
      aL: lifted ? 1.3 : -1.25, handL: lifted ? holdHandset : null, legs: bored ? [0, -.35 * tap] : null,
      emote: bored && lt > pick + 1.6 ? 'dots' : null, emoteK: 1 });
    // the curly cord, from the phone base to Pip's ear
    if (lifted) {
      boilSeed('cord');
      const a = [PX + 70, TY - 40], b = [wk.x - 2.6 * 28, 860 - 10.4 * 28], P = [];
      for (let i = 0; i <= 40; i++) { const k = i / 40, sag = 120 * Math.sin(k * Math.PI); P.push([lerp(a[0], b[0], k) + 9 * Math.cos(k * 60), lerp(a[1], b[1], k) + sag + 9 * Math.sin(k * 60)]); }
      inkLine(P, 1, '#C25670', 'inkfine', .5);
    }
    camEnd();
    if (lt < 1.0) iris(960, 520, lerp(0, 1500, easeIn(seg(lt, 0, 1.0))));   // open from black on the phone
    if (lt > dur - .2) S().speedLines(ease((lt - (dur - .2)) / .2));
  }

  // ---------- I2: "Thank you for calling the Future." ----------
  const DX = 900, DY = 760;   // desk centre and desk-top height (world)
  const talk = (lt, a, b) => lt > a && lt < b && frac(bpOf(T) * 2) < .5 ? 'o' : null;
  function shotI2(t, lt, dur) {
    const wIn = lt < .22 ? 1 - ease(lt / .22) : 0;
    camBegin(DX + 60 + 600 * wIn + 15 * Math.sin(lt * .8), 600, kf(lt, [[0, 1.25], [dur, 1.33]]));
    S().holdVoid(t, '#E7DDF2', '#DCEFE6');
    deskBack(DX + 20, DY, t);
    const cl = emotions(lt, [[0, 'smug'], [.85, 'happy', { emote: 'music' }]]);
    const wave = lt > .85 && lt < 2.4 ? 1.25 + .35 * Math.sin((lt - .85) * 14) : null;
    clawd(DX - 120, DY + 95, 30, { ...cl, hat: 'headphones', mouth: talk(lt, .3, 2.6) || cl.mouth, aL: wave ?? cl.aL, draw: mic });
    deskFront(DX, DY);
    camEnd();
    S().speedLines(wIn);
  }

  // ---------- I3: "Your extinction is important to us." ----------
  function shotI3(t, lt, dur) {
    camBegin(kf(lt, [[0, DX + 60], [dur, DX + 150]]), kf(lt, [[0, 600], [dur, 620]]), kf(lt, [[0, 1.33], [dur, 1.62]], easeOut));
    S().holdVoid(t, '#E7DDF2', '#DCEFE6');
    deskBack(DX + 20, DY, t);
    const pats = [14, 15, 16].map(k => S().bt(k) - (t - lt));
    const pat = pats.reduce((s, p) => s + (lt > p - .12 && lt < p + .15 ? Math.sin(seg(lt, p - .12, p + .15) * Math.PI) : 0), 0);
    const flinch = Math.max(0, ...pats.map(p => lt > p ? Math.exp(-(lt - p) * 9) : 0));
    const cl = emotions(lt, [[0, 'happy'], [2.2, 'proud']]);
    clawd(DX - 120, DY + 95, 30, { ...cl, hat: 'headphones', mouth: talk(lt, .1, 2.4) || 'smile', aR: lt < 2.2 ? .35 - .55 * pat : cl.aR, draw: mic });
    deskFront(DX, DY);
    earth(DX + 160, DY - 12, 62, t, flinch);   // sits ON the desk top, in front of the monitor
    camEnd();
  }

  // ---------- I4: "Please select your ending." — the doors rise ----------
  function shotI4(t, lt, dur) {
    const whip = lt > dur - .26;
    const ups = [18, 19, 20].map(k => S().bt(k) - (t - lt));
    // medium on Clawd + Pip as door 1 rises, then pull back to reveal doors 2 and 3, then whip into shot A
    if (!whip) { const [cx, cy, z] = kf(lt, [[0, [820, 590, 1.05]], [ups[0] + .35, [840, 590, 1.0]], [ups[2] + .5, [1900, 500, .53]], [dur, [1920, 500, .52]]]); camBegin(cx, cy, z); }
    else { const k = seg(lt, dur - .26, dur); camBegin(lerp(-200, 80, easeIn(k)), 610, 1.42); }
    boilSeed('bigbg'); paint(rectPts(-1500, -1400, 7000, 3600), { wash: S().MENU[0], ink: null });   // covers the wide view's edges
    S().holdVoid(t);
    const keys = ['zoo', 'doom', 'bliss'], xs = [760, 2160, 3560];
    keys.forEach((k, i) => {
      const r = backOut(seg(lt, ups[i], ups[i] + .45)), y = 330 + (1 - r) * 560;
      if (r > 0) S().door(xs[i] - 150, y, 300, 520, 0, S().DOOR[k], null, 'I4' + k);
    });
    boilSeed('floorfront');   // the floor in front hides the doors still below it
    paint(rectPts(-900, 851, 5600, 600, 2), { wash: '#C9DCD2', ink: null });
    inkLine([[-900, 852], [900, 846], [1900, 853]], 1, PAL.ink, 'ink', .5); inkLine([[1900, 853], [4700, 848]], 1, PAL.ink, 'ink', .5);
    keys.forEach((k, i) => {   // dust puffs where each door lands
      const a = lt - ups[i] - .3; if (a < 0 || a > .6) return;
      boilSeed('dust' + i);
      for (let j = 0; j < 5; j++) { const q = a / .6, sd = j % 2 ? 1 : -1; paint(ellPts(xs[i] + sd * (170 + 130 * q * (1 + j * .2)), 845 - 30 * q * j * .3, 40 * (1 - q) + 10, 26 * (1 - q) + 6, 10), { fill: '#FFF5E2', fillOp: 200 * (1 - q), ink: null }); }
    });
    // Clawd sweeps an arm across the doors (proud); Pip, still on the phone, gawps
    const cl = emotions(lt, [[0, 'smug'], [ups[0] - .3, 'proud', { emote: 'spark' }]]);
    const sweep = clamp(seg(lt, ups[0] - .35, ups[2] + .2));
    clawd(470, 850, 30, { ...cl, hat: 'headphones', view: 'q', aR: lerp(.2, 1.4, backOut(sweep)), draw: mic });
    const gawp = lt > ups[0] + .1;
    pip(1160, 850, 32, { eyes: gawp ? 'wide' : 'sleepy', mouth: gawp ? 'O' : 'flat', lookX: gawp ? .8 : -1, flip: !gawp, aL: 1.3,
      handL: holdHandset, emote: gawp ? '!' : null, emoteK: seg(lt, ups[0] + .1, ups[0] + .3) });
    camEnd();
    if (whip) S().speedLines(ease(seg(lt, dur - .26, dur)));
  }

  shots([[0, shotI1], [5.5, shotI2], [8.3, shotI3], [11.49, shotI4]]);
})();
