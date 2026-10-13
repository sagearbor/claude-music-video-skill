// c10_bridge_final.js: 214.94–249.41 s. The climax.
//   Bridge (214.94–222.85): call and response. On each "Who …?" a new neighbour hops into the row beside Pip with that
//     line's prop; on each "(We do!)" the whole row pumps its arms and the camera punches in.
//   222.85–227.47 "So who writes the ending?": everything drains to black but a spotlight, then only Pip's raised pencil.
//   227.47 "(WE DO!)": flash, and we're ON THE MOON with a huge crowd. Final chorus (227.47–249.41), the deepest, most
//     "3D" stretch of the video: parallax layers, big camera moves, confetti, fireworks, a gold sunrise over Earth.
//     The three doors get kicked off their hinges and become barn planks; the cage, grave and pill shatter into gold;
//     Pip raps on the barn roof; the prophecy scroll burns into butterflies; Clawd swaps the headset for a hard hat
//     (the plot twist); the barn goes up on the beats; and the crowd lifts a giant pencil that writes gold across the sky.
(() => {
  const bt = k => OFF + k * BEAT;
  const GY = 880;                                   // ground line (world y)
  // "(We do!)" shouts, read off the onset envelope (each lands ~0.55 of the way through its line)
  const WD = [215.45, 216.72, 218.0, 219.3, 220.55, 221.72];
  const LINES = [214.94, 216.06, 217.42, 218.7, 219.97, 221.17];
  const HOOD = ['#E27A92', '#6E9F58', '#7B5CA8', '#E8AA38', '#D97757', '#8EC3E6', '#C8324A', '#5A8F7B'];
  const SKINS = ['#E9B28E', '#B97A56', '#8A5A3C', '#F2C4A0', '#C98E6A', '#6E4630'];
  const WOOD = '#A8693E', WOODDK = '#7A4526', HOODIE_P = '#3A9C98';
  const DOORCOL = ['#9C7A5C', '#6B3B4A', '#E7A6C0'];

  // ---------- small helpers ----------
  // A parallax layer: f = 0 is pinned to the screen, 1 moves with the main camera, >1 is foreground.
  function layer(f, cam, draw) {
    camBegin(960 + (cam.x - 960) * f, 540 + (cam.y - 540) * f, 1 + (cam.z - 1) * f, (cam.r || 0) * f);
    draw(); camEnd();
  }
  // Arm pump envelope: 0 → 1 fast just before the shout, then decays.
  function pumpAt(t, times) {
    let v = 0;
    for (const p of times) { const k = t - p; if (k > -.09 && k < .7) v = Math.max(v, k < 0 ? (k + .09) / .09 : Math.exp(-k * 5)); }
    return v;
  }
  const punchAt = (t, times, k = 7) => times.reduce((s, p) => s + (t >= p ? Math.exp(-(t - p) * k) : 0), 0);
  // Pip's raised right hand in world space (unflipped): shoulder (1.75s, -7.6s), arm 3.2s at angle a.
  const handPos = (x, y, s, a, dy = 0) => [x + 1.75 * s + 3.2 * s * Math.cos(a), y + dy * s - 7.6 * s - 3.2 * s * Math.sin(a)];

  function firework(x, y, age, col, r = 190) {
    if (age < 0 || age > 1.3) return;
    boilSeed('fw' + Math.round(x) + '_' + Math.round(y));
    const k = easeOut(age / .55), fade = 1 - seg(age, .6, 1.3);
    if (age < .5) glow(x, y, r * 1.1 * k + 30, col, .8 * (1 - age / .5));
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * TAU + x, r0 = r * k * .45, r1 = r * k * (.9 + .15 * hash(i + x));
      if (fade > .05) inkLine([[x + Math.cos(a) * r0, y + Math.sin(a) * r0 + 30 * age * age], [x + Math.cos(a) * r1, y + Math.sin(a) * r1 + 60 * age * age]], 2.2 * fade, col, 'ink', 0);
      if (age > .3 && fade > .05) paint(starPts(x + Math.cos(a) * r1, y + Math.sin(a) * r1 + 60 * age * age, 9 * fade, .35, 4), { wash: PAL.cream, washOp: 255 * fade, ink: null });
    }
  }
  function confetti(t, t0, n = 32) {
    const age = t - t0; if (age < 0) return;
    const cols = ['#F2C53D', '#E27A92', '#3A9C98', '#8EC3E6', '#FFF5E2', '#E8603A'];
    for (let i = 0; i < n; i++) {
      boilSeed('conf' + i);
      const sp = 140 + 160 * hash(i + 7), y = frac(hash(i) + age * sp / 1300) * 1300 - 150, x = hash(i + 3) * 2100 - 90 + 40 * Math.sin(age * 3 + i);
      push(); translate(x, y); rotate(age * (3 + 4 * hash(i + 9)) + i); scale(1, Math.max(.15, Math.abs(Math.cos(age * 7 + i))));
      paint(rectPts(-9, -5, 18, 10), { wash: cols[i % 6], ink: null }); pop();
    }
  }

  // ---------- props held in a hand (drawn in arm space; +x runs along the arm, outward) ----------
  const PROPS = {
    seeds: (s, sw) => { paint(rectPts(.2 * s, -1.1 * s, 1.6 * s, 2.2 * s, s * .05), { wash: '#E8AA38', ink: PAL.ink, sw: sw * .6 }); paint(ellPts(1 * s, 0, .45 * s, .3 * s, 10), { wash: PAL.sap, ink: null }); inkLine([[1 * s, .1 * s], [1 * s, .8 * s]], sw * .6, PAL.sap, 'inkfine', 0); },
    wrench: (s, sw) => { paint(rectPts(0, -.25 * s, 2.6 * s, .5 * s), { wash: '#9AA3B0', ink: PAL.ink, sw: sw * .6 }); paint([[2.4 * s, -.7 * s], [3.3 * s, -.8 * s], [3.1 * s, -.2 * s], [2.7 * s, -.25 * s], [2.7 * s, .25 * s], [3.1 * s, .2 * s], [3.3 * s, .8 * s], [2.4 * s, .7 * s]], { wash: '#9AA3B0', ink: PAL.ink, sw: sw * .6 }); },
    pie: (s, sw) => { paint(ellPts(.9 * s, 0, 1.5 * s, .55 * s, 18), { wash: '#C98E4A', ink: PAL.ink, sw: sw * .6 }); for (const d of [-.6, 0, .6]) inkLine([[(.9 + d) * s, -.4 * s], [(.9 + d + .2) * s, .3 * s]], sw * .5, '#7A4526', 'inkfine', 0); },
    plug: (s, sw) => { paint(rrPts(.2 * s, -.8 * s, 1.6 * s, 1.6 * s, .3 * s), { wash: '#F3EBDC', ink: PAL.ink, sw: sw * .6 }); for (const d of [-.4, .4]) paint(rectPts(1.8 * s, (d - .12) * s, .8 * s, .24 * s), { wash: '#C9A24A', ink: PAL.ink, sw: sw * .4 }); inkLine([[.2 * s, 0], [-.6 * s, .6 * s], [-1.4 * s, .2 * s]], sw * 1.2, PAL.ink, 'ink', .5); },
    hammer: (s, sw) => { paint(rectPts(0, -.22 * s, 2.8 * s, .44 * s), { wash: WOOD, ink: PAL.ink, sw: sw * .6 }); paint(rectPts(2.5 * s, -.9 * s, .8 * s, 1.8 * s), { wash: '#6E6E80', ink: PAL.ink, sw: sw * .6 }); },
    crate: (s, sw) => { paint(rectPts(.3 * s, -1.4 * s, 2.8 * s, 2.8 * s, s * .05), { wash: WOOD, fill: WOODDK, fillOp: 70, tex: .6, ink: PAL.ink, sw: sw * .7 }); inkLine([[.3 * s, -.5 * s], [3.1 * s, -.5 * s]], sw * .5, WOODDK, 'inkfine', 0); for (let i = 0; i < 4; i++) paint(ellPts((.9 + i * .55) * s, -1.6 * s, .25 * s, .25 * s, 8), { wash: ['#E8AA38', PAL.sap, '#C8324A', PAL.cream][i], ink: null }); },
    pencil: (s, sw) => { push(); rotate(-.15); pencilShape(s * .7, sw); pop(); },
    mic: (s, sw) => { push(); rotate(-1.2); translate(s * 1.5, 0); handset(s * .7, sw); pop(); },
  };

  // ---------- bridge set: a warm dusk street with the barn skeleton waiting on the hill ----------
  function duskBg(t, cam) {
    layer(0, cam, () => {
      boilSeed('dusk');
      paint(rectPts(-200, -200, W + 400, H + 400), { wash: mixCol('#E98E7A', '#3B2E5A', .35), ink: null });
      paint(ellPts(960, 820, 1400, 520, 30, 6), { fill: '#FFC766', fillOp: 110, bleed: .3, tex: .4, ink: null });
      paint(ellPts(400, 160, 700, 260, 24, 6), { fill: PAL.violet, fillOp: 70, bleed: .3, tex: .5, ink: null });
    });
    layer(.3, cam, () => {   // the far town
      for (let i = 0; i < 12; i++) {
        boilSeed('town' + i);
        const x = -300 + i * 230, h = 140 + 90 * hash(i);
        paint(rectPts(x, 700 - h, 180, h + 200, 2), { wash: mixCol('#5A3E6A', '#2B2233', .3), ink: null });
        if (hash(i + 4) > .4) paint(rectPts(x + 50, 720 - h * .7, 26, 30), { wash: '#FFE6A6', ink: null });
      }
    });
    layer(.6, cam, () => {   // the hill with the barn frame waiting
      boilSeed('hill');
      paint(ellPts(1350, 900, 1100, 230, 30, 4), { wash: mixCol(PAL.sap, '#2B2233', .5), fill: '#3B4A3A', fillOp: 70, tex: .5, ink: PAL.ink, sw: .8 });
      boilSeed('frame');
      for (const x of [1250, 1450, 1650]) inkLine([[x, 690], [x, 530]], 3, WOODDK, 'ink', 0);
      inkLine([[1230, 530], [1670, 530]], 3, WOODDK, 'ink', 0);
      inkLine([[1230, 530], [1450, 420], [1670, 530]], 3, WOODDK, 'ink', 0);
    });
    layer(1, cam, () => {
      boilSeed('street');
      paint(rectPts(-800, GY - 10, W + 1600, 600, 3), { wash: '#6A4E5A', fill: '#4A3442', fillOp: 90, tex: .6, ink: null });
      inkLine([[-800, GY - 8], [960, GY - 14], [W + 800, GY - 6]], 1.2, PAL.ink, 'ink', .5);
    });
  }

  // The row: Pip in the middle, neighbours hop in on each line to alternating slots.
  const ROW = [
    { slot: 1, prop: 'seeds' }, { slot: -1, prop: 'wrench' }, { slot: 2, prop: 'pie' },
    { slot: -2, prop: 'plug' }, { slot: 3, prop: 'hammer' }, { slot: -3, prop: 'crate' },
  ];
  const SLOT = 270;
  const pencilHook = (s, sw) => { push(); rotate(-.2); pencilShape(s * .85, sw); pop(); };
  function pipCentre(t, pump, pu, key) {
    const aR = pu > 0 ? lerp(-1.25, 1.35, ease(pu)) : lerp(-.4, 1.45, pump);
    pip(960, GY, 28, { boilKey: key, eyes: pu > .5 ? 'narrow' : (pump > .4 ? 'closed' : 'dot'), mouth: pu > .5 ? 'smirk' : (pump > .3 ? 'O' : 'grin'), brows: pu > .5 ? 'angry' : null,
      aR, aL: pu > 0 ? -1.1 : lerp(-.4, 1.45, pump), dy: -.6 * pump, sq: .08 * pump, pencil: pu <= .25, lookY: pu > .5 ? -.6 : 0, handR: pu > .25 ? pencilHook : null });
    return handPos(960, GY, 28, aR, -.6 * pump);
  }
  function bridgeRow(t, pump, pu = 0) {
    for (const i of [5, 4, 3, 2, 1, 0]) {   // outer slots first, so inner ones overlap them
      const n = ROW[i], tIn = LINES[i] - .12;
      if (t < tIn) continue;
      const side = Math.sign(n.slot), x1 = 960 + n.slot * SLOT, x0 = x1 + side * 520;
      const k = seg(t, tIn, tIn + .42), hop = jump(t, tIn, tIn + .42, 2.4), landed = k >= 1;
      const x = lerp(x0, x1, easeOut(k)), s = 24 - Math.abs(n.slot) * .8;
      pip(x, GY, s, { boilKey: 'nb' + i, pencil: false, hoodie: HOOD[i], beanie: HOOD[(i + 3) % 8], skin: SKINS[i % 6],
        flip: side > 0, eyes: pump > .4 ? 'closed' : 'dot', mouth: pump > .3 ? 'O' : 'grin', dy: hop.dy - .5 * pump, sq: hop.sq + .08 * pump,
        aR: landed ? lerp(.15, 1.45, pump) : .6, aL: landed ? lerp(-.9, 1.3, pump) : .9, handR: PROPS[n.prop], lookX: -side * .6 });
    }
    return pipCentre(t, pump, pu, 'pip');
  }

  // B1 — Who keeps the seeds? … Who backs up the species? (We do!)
  function shotRow(t, lt, dur) {
    const pump = pumpAt(t, WD), punch = punchAt(t, WD, 6);
    const z = kf(t, [[214.94, 1.42], [216.06, 1.28], [217.42, 1.15], [218.7, 1.06], [219.97, .99], [221.17, .93]]) + .07 * punch;
    const sh = shakeXY(t, 9 * punch);
    const cam = { x: 960 + sh[0] + 14 * Math.sin(lt * .6), y: kf(t, [[214.94, 640], [221.17, 560]]) + sh[1], z };
    duskBg(t, cam);
    // Clawd on the hill, figuring it out: confused → thinking → the idea (on the last "We do!")
    layer(.6, cam, () => clawd(1820, 760, 12, { ...emotions(t, [[214.94, 'confused'], [217.42, 'thinking'], [221.6, 'idea']]), hat: 'headphones', view: 'q', flip: true, boilKey: 'clawdhill' }));
    camBegin(cam.x, cam.y, cam.z);
    bridgeRow(t, pump);
    camEnd();
    for (const p of WD) if (t > p && t < p + .35) {   // sparkle rays from the row on each shout
      boilSeed('ray' + p); const k = seg(t, p, p + .35);
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i - 4.5) * .3; paint(starPts(960 + Math.cos(a) * (300 + 500 * k), 520 + Math.sin(a) * (200 + 380 * k), 20 * (1 - k), .3, 4), { wash: '#FFE27A', ink: null }); }
    }
    if (lt < .3) brushWipe(.5 + lt / .6);
  }

  // B2 — So who writes the ending? Drain to black, a spotlight on Pip, then only the raised pencil. Hold. (Beat cuts out.)
  function shotDark(t, lt, dur) {
    const cam = { x: 960, y: kf(lt, [[0, 560], [dur, 470]]), z: kf(lt, [[0, .93], [2.2, 1.25], [dur, 1.55]], ease) };
    const dark = ease(seg(lt, .1, 1.6)), pu = seg(lt, 1.3, 2.3), only = ease(seg(lt, 3.05, 3.7));
    duskBg(t, cam);
    camBegin(cam.x, cam.y, cam.z);
    const pen = bridgeRow(t, 0, pu);
    const pipS = toScreen(960, GY - 6 * 28), penS = toScreen(pen[0], pen[1]);
    camEnd();
    boilSeed('dark');
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#0B0A12', washOp: 255 * dark, ink: null });
    if (dark > .2 && only < .99) {
      boilSeed('cone');   // the spotlight, and Pip redrawn on top inside it
      paint([[pipS[0] - 60, -40], [pipS[0] + 60, -40], [pipS[0] + 340, pipS[1] + 360], [pipS[0] - 340, pipS[1] + 360]], { fill: '#FFF0C8', fillOp: 80 * dark, bleed: .15, tex: .3, ink: null });
      camBegin(cam.x, cam.y, cam.z);
      pipCentre(t, 0, pu, 'pipspot');
      camEnd();
      if (only > .01) { boilSeed('only'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#0B0A12', washOp: 255 * only, ink: null }); }
    }
    if (only > .01) {   // the pencil alone in the dark, glowing
      const ps = 28 * .85 * cam.z * 2.2;
      glow(penS[0], penS[1] - ps * 2.2, 240 * only * (1 + .12 * Math.sin(lt * 9)), '#FFD96A', .9 * only);
      boilSeed('lonepencil');
      push(); translate(penS[0], penS[1] + ps * 1.5); rotate(-1.77); translate(-.4 * ps, 0); pencilShape(ps, 2); pop();
    }
  }

  // ---------- the moon ----------
  function moonBg(t, cam, o = {}) {
    const sun = clamp(o.sun ?? seg(t, 227.47, 249.41));   // the gold sunrise across the final chorus
    layer(0, cam, () => {
      boilSeed('msky');
      paint(rectPts(-300, -300, W + 600, H + 600), { wash: mixCol(mixCol('#141A3A', '#3B2E6A', .5), '#B8607A', sun * .75), ink: null });
      paint(ellPts(960, 1000, 1700, 300 + 520 * sun, 30, 6), { fill: '#F2A262', fillOp: 70 * sun, bleed: .3, tex: .3, ink: null });
      paint(ellPts(960, 960, 1500, 420 + 260 * sun, 30, 6), { fill: mixCol('#E8603A', '#FFC766', sun), fillOp: 90 + 80 * sun, bleed: .3, tex: .4, ink: null });
      glow(1500, 700, 420 + 420 * sun, '#FFC766', .5 + .5 * sun);
    });
    layer(.05, cam, () => {
      for (let i = 0; i < 40; i++) { boilSeed('mst' + i); paint(starPts(hash(i) * 2400 - 240, hash(i + 70) * 620 - 80, 3 + 4 * hash(i + 3), .35, 4), { wash: PAL.cream, washOp: (140 + 110 * Math.sin(t * 2.3 + i)) * (1 - .6 * sun), ink: null }); }
    });
    layer(.15, cam, () => {   // Earth
      const ey = o.earthY ?? 260, ex = o.earthX ?? 470;
      boilSeed('earth');
      glow(ex, ey, 260, '#8EC3E6', .7);
      paint(ellPts(ex, ey, 150, 150, 30, 1), { wash: '#3A6FB0', fill: '#8EC3E6', fillOp: 80, tex: .5, ink: PAL.ink, sw: 1 });
      for (const [dx, dy, rx, ry] of [[-40, -40, 60, 40], [50, 30, 50, 60], [-60, 70, 40, 25]]) paint(ellPts(ex + dx, ey + dy, rx, ry, 14, 4), { wash: '#6E9F58', ink: null });
      paint(ellPts(ex + 20, ey - 70, 70, 20, 12, 3), { wash: PAL.cream, washOp: 200, ink: null });
    });
    layer(.35, cam, () => {
      boilSeed('ridge1');
      paint([[-500, 760], [0, 650], [350, 700], [700, 610], [1100, 690], [1500, 600], [1900, 680], [2400, 640], [2400, 1100], [-500, 1100]], { wash: '#6A6488', fill: '#4E4870', fillOp: 70, tex: .5, ink: PAL.ink, sw: .8, curv: .4 });
    });
    layer(.6, cam, () => {
      boilSeed('ridge2');
      paint([[-600, 830], [100, 760], [500, 800], [950, 740], [1400, 790], [1850, 730], [2500, 800], [2500, 1200], [-600, 1200]], { wash: '#8E87A8', fill: '#6A6488', fillOp: 70, tex: .5, ink: PAL.ink, sw: .9, curv: .4 });
      for (let i = 0; i < 5; i++) { boilSeed('cr' + i); paint(ellPts(-200 + i * 520, 820 + 15 * hash(i), 90, 18, 16), { fill: '#5A5478', fillOp: 120, ink: null }); }
    });
    layer(1, cam, () => {
      boilSeed('mground');
      paint(rectPts(-900, GY - 20, W + 1800, 700, 3), { wash: '#B9B3C9', fill: '#9C95B4', fillOp: 90, tex: .6, ink: null });
      inkLine([[-900, GY - 18], [960, GY - 26], [W + 900, GY - 16]], 1.2, PAL.ink, 'ink', .5);
      for (let i = 0; i < 6; i++) { boilSeed('gc' + i); paint(ellPts(-500 + i * 600, GY + 90 + 40 * hash(i), 120, 22, 16), { fill: '#8E87A8', fillOp: 120, ink: null }); }
    });
  }
  function moonFg(cam) {
    layer(1.4, cam, () => {
      boilSeed('fgrock');
      paint([[-300, 1080], [-150, 990], [80, 1010], [200, 1100]], { wash: '#5A5478', ink: PAL.ink, sw: 1, curv: .4 });
      paint([[1780, 1110], [1900, 1000], [2100, 1020], [2250, 1120]], { wash: '#5A5478', ink: PAL.ink, sw: 1, curv: .4 });
    });
  }
  // The crowd at two depths behind the action. jumpAt: a shared explosion jump; gap: keep the centre clear.
  function crowd(t, cam, o = {}) {
    const props = o.props;
    layer(.8, cam, () => {   // back row
      for (let i = 0; i < 7; i++) {
        const m = move(['bounce', 'roof', 'hop'][i % 3], t + i * .11, i), j = o.jumpAt ? jump(t, o.jumpAt + i * .02, o.jumpAt + .45 + i * .02, 3) : { dy: 0, sq: 0 };
        pip(-80 + i * 340, GY - 70, 13, { boilKey: 'cb' + i, ...m, walk: undefined, pencil: false, hoodie: HOOD[(i + 2) % 8], beanie: HOOD[(i + 5) % 8], skin: SKINS[(i + 1) % 6], eyes: 'happy', mouth: 'grin', dy: (m.dy || 0) * .7 + j.dy, sq: (m.sq || 0) + j.sq, noShadow: true,
          ...(props ? { aR: 1.35, handR: PROPS[props] } : {}) });
      }
    });
    layer(1, cam, () => {   // mid row
      for (let i = 0; i < 6; i++) {
        const x = -60 + i * 380 + (i % 2) * 60;
        if (o.gap && Math.abs(x - 960) < o.gap) continue;
        const m = move(['roof', 'bounce', 'sway', 'hop'][i % 4], t + i * .17, i + 3), j = o.jumpAt ? jump(t, o.jumpAt + .05 + i * .03, o.jumpAt + .5 + i * .03, 3) : { dy: 0, sq: 0 };
        pip(x, GY - 20, 18, { boilKey: 'cm' + i, ...m, walk: undefined, pencil: false, hoodie: HOOD[i % 8], beanie: HOOD[(i + 3) % 8], skin: SKINS[i % 6], eyes: 'happy', mouth: i % 2 ? 'grin' : 'O', dy: (m.dy || 0) * .7 + j.dy, sq: (m.sq || 0) + j.sq,
          ...(props ? { aR: 1.35 + .1 * Math.sin(t * 6 + i), handR: PROPS[props] } : {}) });
      }
    });
  }

  // C1 — (WE DO!) Zoo? NAH! Doom? NAH! Bliss? NAH! The doors are kicked clean off their hinges onto the plank pile.
  function shotWeDo(t, lt, dur) {
    const nah = [bt(356) + BEAT / 2, bt(357) + BEAT / 2, bt(358) + BEAT / 2];
    const hit = punchAt(t, nah, 8), sh = shakeXY(t, 16 * hit + 26 * Math.exp(-lt * 6));
    const cam = { x: 960 + sh[0] + 30 * Math.sin(lt), y: 560 + sh[1], z: kf(lt, [[0, 1.25], [.5, 1.02], [dur, 1.08]], easeOut) + .05 * hit };
    moonBg(t, cam, { earthY: 300 });
    crowd(t, cam, { jumpAt: 227.47, gap: 520 });
    camBegin(cam.x, cam.y, cam.z);
    boilSeed('pile');   // the plank pile on the right where the doors land
    const landed = nah.filter(p => t > p + .55).length;
    for (let i = 0; i < landed; i++) paint(rectPts(1500 + i * 12, GY - 30 - i * 26, 300, 24, 1.5), { wash: DOORCOL[i], fill: WOODDK, fillOp: 60, ink: PAL.ink, sw: .9 });
    const xs = [600, 960, 1320];
    ['zoo', 'doom', 'bliss'].forEach((k, i) => {
      const p = nah[i];
      if (t < p) { SETS.door(xs[i] - 110, GY - 400, 220, 380, .1 + .1 * Math.sin(t * 7 + i), SETS.DOOR[k], (x, y, w, h) => SETS.INSIDE[k](x, y, w, h, t), 'F' + k); return; }
      boilSeed('fframe' + k);   // the empty frame stays; the panel flies off on an arc, spinning, to the pile
      paint(rectPts(xs[i] - 124, GY - 414, 248, 414, 2), { ink: PAL.ink, sw: 1.4 });
      const kk = seg(t, p, p + .55);
      if (kk < 1) { boilSeed('fly' + k); const q = arcPt([xs[i], GY - 210], [1650, GY - 50 - i * 26], 360, easeOut(kk)); push(); translate(q[0], q[1]); rotate(kk * TAU * 1.25 * (i % 2 ? -1 : 1)); paint(rectPts(-110, -190, 220, 380, 1.5), { wash: SETS.DOOR[k], fill: WOODDK, fillOp: 50, ink: PAL.ink, sw: 1.1 }); pop(); }
    });
    // kickers: a neighbour at door 1, Pip at door 2, a neighbour at door 3
    const kick = i => { const p = nah[i]; return t > p - .16 && t < p + .2 ? Math.sin(seg(t, p - .16, p + .2) * Math.PI) : 0; };
    const kj = jump(t, 227.47, 227.92, 3);
    pip(xs[0] + 190, GY, 22, { boilKey: 'k0', pencil: false, hoodie: HOOD[0], beanie: HOOD[3], skin: SKINS[1], flip: true, legs: [0, -1.1 * kick(0)], eyes: 'narrow', mouth: kick(0) > .3 ? 'O' : 'grin', aL: .3 + .8 * kick(0), aR: 1.2, dy: kj.dy, sq: kj.sq });
    pip(xs[1] + 200, GY, 28, { boilKey: 'pipk', flip: true, legs: [0, -1.2 * kick(1)], eyes: 'narrow', brows: 'angry', mouth: kick(1) > .3 ? 'O' : 'grin', aL: .4 + .8 * kick(1), aR: 1.3, dy: kj.dy, sq: kj.sq, rot: .1 * kick(1) });
    pip(xs[2] + 190, GY, 22, { boilKey: 'k2', pencil: false, hoodie: HOOD[4], beanie: HOOD[1], skin: SKINS[2], flip: true, legs: [0, -1.1 * kick(2)], eyes: 'narrow', mouth: kick(2) > .3 ? 'O' : 'grin', aL: .3 + .8 * kick(2), aR: 1.2, dy: kj.dy, sq: kj.sq });
    clawd(250, GY + 20, 22, { ...feel('excited', t), hat: 'party', view: 'q', boilKey: 'clawdF' });   // on our side now
    camEnd();
    moonFg(cam);
    confetti(t, 227.47);
    nah.forEach((p, i) => sfx('NAH!', 960 + (600 + i * 360 - cam.x) * cam.z, 250, 150, ['#F2C53D', '#FF7A4A', '#E27A92'][i], t - p, { stroke: PAL.ink, life: .55, screen: true }));
    if (lt < .15) flash(1 - lt / .15, '#FFFDF6');
  }

  // C2 — Cage, grave, or a pill? Man, miss me with this: three throws, each punched into gold light on the beat.
  function shotSmash(t, lt, dur) {
    const th = [bt(359), bt(360), bt(361)];
    const hits = th.map(p => p + .42), hit = punchAt(t, hits, 9), sh = shakeXY(t, 14 * hit);
    const cam = { x: kf(lt, [[0, 900], [dur, 1040]]) + sh[0], y: 560 + sh[1], z: kf(lt, [[0, 1.05], [dur, 1.25]]) + .05 * hit };
    moonBg(t, cam, { earthY: 290 });
    crowd(t, cam, { gap: 300 });
    camBegin(cam.x, cam.y, cam.z);
    const drawObj = [
      () => { for (let i = 0; i < 5; i++) inkLine([[-60 + i * 30, -70], [-60 + i * 30, 70]], 2.4, '#C9C2B5', 'ink', 0); inkLine([[-70, -70], [70, -70]], 2.8, '#C9C2B5', 'ink', 0); inkLine([[-70, 70], [70, 70]], 2.8, '#C9C2B5', 'ink', 0); },
      () => { paint([[-55, 75], [-55, -30], [0, -80], [55, -30], [55, 75]], { wash: '#9A9AA8', fill: '#6E6E80', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1, curv: .4 }); inkLine([[-20, -15], [20, -15]], 1, PAL.ink, 'ink', 0); inkLine([[0, -35], [0, 20]], 1, PAL.ink, 'ink', 0); },
      () => { rotate(t * 6); paint(rrPts(-70, -28, 70, 56, 28), { wash: '#E27A92', ink: PAL.ink, sw: 1 }); paint(rrPts(0, -28, 70, 56, 28), { wash: PAL.cream, ink: PAL.ink, sw: 1 }); },
    ];
    const HX = 1120, HY = 470;
    drawObj.forEach((d, i) => {
      const p = th[i], h = hits[i];
      if (t > p - .05 && t < h) { boilSeed('obj' + i); const q = arcPt([2300, 380 + 60 * i], [HX, HY], 120, easeIn(seg(t, p - .05, h))); push(); translate(q[0], q[1]); scale(1.6); d(); pop(); }
      if (t >= h && t < h + .9) {   // shatter into gold light
        const k = seg(t, h, h + .9);
        glow(HX, HY, 80 + 300 * easeOut(k), '#FFD96A', 1 - k);
        for (let j = 0; j < 12; j++) { boilSeed('sh' + i + '_' + j); const a = j / 12 * TAU + i, r = 60 + 420 * easeOut(k); paint(starPts(HX + Math.cos(a) * r, HY + Math.sin(a) * r * .8 + 200 * k * k, 26 * (1 - k), .3, 4), { wash: j % 2 ? '#FFE27A' : '#F2C53D', ink: null }); }
      }
    });
    const punch = i => t > hits[i] - .12 && t < hits[i] + .15 ? Math.sin(seg(t, hits[i] - .12, hits[i] + .15) * Math.PI) : 0;
    const pAny = Math.max(punch(0), punch(1), punch(2)), cool = t > hits[2] + .5;
    pip(900, GY, 30, { boilKey: 'pipS', eyes: cool ? 'closed' : 'narrow', brows: cool ? null : 'angry', mouth: cool ? 'smirk' : (pAny > .3 ? 'O' : 'grin'),
      aR: cool ? -1.2 : .35 + .9 * pAny, aL: cool ? 1.0 + .25 * Math.sin(t * 18) : -.6, dx: .5 * pAny, rot: -.06 * pAny });
    clawd(560, GY + 10, 24, { ...emotions(t, [[229.39, 'excited'], [hits[2] + .3, 'laugh']]), hat: 'party', view: 'q', boilKey: 'clawdS' });
    camEnd();
    moonFg(cam);
    confetti(t, 227.47);
  }

  // The barn frame: posts rise one by one (prog 0..1), then the beam, then the rafters.
  function barn(x, y, w, h, prog) {
    boilSeed('sill');
    paint(rectPts(x - 20, y - 22, w + 40, 26, 1), { wash: WOOD, fill: WOODDK, fillOp: 60, ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 4; i++) {
      const k = clamp(prog * 6 - i), a = (1 - backOut(k)) * (-Math.PI / 2) * (i % 2 ? -1 : 1);
      if (k <= 0) continue;
      boilSeed('post' + i);
      push(); translate(x + i * w / 3, y - 20); rotate(a);
      paint(rectPts(-14, -h, 28, h, 1.2), { wash: WOOD, fill: WOODDK, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1 }); pop();
    }
    const kb = clamp(prog * 6 - 4);
    if (kb > 0) { boilSeed('beam'); paint(rectPts(x - 30, y - 20 - h - 26 - 60 * (1 - backOut(kb)), w + 60, 28, 1), { wash: WOOD, fill: WOODDK, fillOp: 60, ink: PAL.ink, sw: 1 }); }
    const kr = clamp(prog * 6 - 5);
    if (kr > 0) {
      boilSeed('rafters');
      const top = y - 20 - h - 26, peak = top - 260 * backOut(kr);
      paint([[x - 50, top], [x + w / 2, peak], [x + w + 50, top], [x + w + 20, top + 8], [x + w / 2, peak + 30], [x - 20, top + 8]], { wash: WOOD, fill: WOODDK, fillOp: 60, ink: PAL.ink, sw: 1 });
      inkLine([[x + w / 2, peak + 20], [x + w / 2, top]], 2.4, WOODDK, 'ink', 0);
    }
  }

  // C3 — This ain't a eulogy, it's a comeback track: Pip raps on the barn beam; fireworks on the beats.
  function shotRoof(t, lt, dur) {
    const cam = { x: 960 + 40 * Math.sin(lt * .8), y: kf(lt, [[0, 640], [dur, 480]]), z: kf(lt, [[0, 1.12], [dur, .98]]), r: kf(lt, [[0, -.04], [dur, .03]]) };
    moonBg(t, cam, { earthY: 270 });
    layer(.05, cam, () => { for (let k = 363; k < 368; k++) firework(300 + 340 * ((k * 3) % 5), 160 + 70 * (k % 3), t - bt(k), ['#F2C53D', '#E27A92', '#8EC3E6', '#FF7A4A'][k % 4]); });
    crowd(t, cam, { gap: 420 });
    camBegin(cam.x, cam.y, cam.z, cam.r);
    barn(660, GY, 600, 330, .84);
    const m = move('bounce', t);
    pip(960, GY - 20 - 330 - 26 + 4, 26, { boilKey: 'pipR', ...m, walk: undefined, eyes: 'closed', mouth: frac(bpOf(t) * 2) < .5 ? 'O' : 'grin', aR: 1.0 + .3 * Math.sin(bpOf(t) * Math.PI), aL: .9, handL: PROPS.mic, noShadow: true });
    clawd(1440, GY + 10, 24, { ...move('roof', t), eyes: 'happy', mouth: 'grin', hat: 'party', view: 'q', flip: true, boilKey: 'clawdR' });
    camEnd();
    moonFg(cam);
    confetti(t, 227.47);
  }

  // C4 — You wrote us off? So we write back! Everyone holds a pencil up; paper birds stream up into the sky.
  function shotWriteBack(t, lt, dur) {
    const cam = { x: 960, y: kf(lt, [[0, 600], [1.2, 600], [dur, 330]], ease), z: kf(lt, [[0, 1.05], [dur, .94]]) };
    moonBg(t, cam, { earthY: 250 });
    crowd(t, cam, { props: 'pencil', gap: 300 });
    camBegin(cam.x, cam.y, cam.z);
    barn(660, GY, 600, 330, .84);
    pip(960, GY, 30, { boilKey: 'pipW', eyes: 'closed', mouth: 'grin', aR: 1.4, aL: .9, pencil: false, handR: PROPS.pencil, dy: -.6 * pulse(t, 5) });
    clawd(1420, GY + 10, 24, { ...feel('happy', t), hat: 'party', view: 'q', flip: true, aR: 1.3, armR: PROPS.pencil, boilKey: 'clawdW' });
    for (let i = 0; i < 26; i++) {
      boilSeed('wb' + i);
      const t0 = 234.95 + hash(i) * 1.6, k = seg(t, t0, t0 + 1.6); if (k <= 0 || k >= 1) continue;
      const x = lerp(200 + hash(i + 1) * 1520, 300 + hash(i + 2) * 1300, k) + 60 * Math.sin(k * 6 + i), y = lerp(560, -380, easeIn(k) * .6 + k * .4), fl = Math.sin(t * 22 + i) * .6;
      paint([[x - 34, y], [x, y - 26 * fl], [x + 34, y], [x, y + 10]], { wash: PAL.cream, ink: PAL.ink, sw: .8 });
    }
    camEnd();
    layer(.05, cam, () => { for (let k = 368; k < 373; k++) firework(260 + 360 * ((k * 2) % 5), 140 + 80 * (k % 3), t - bt(k) - .3, ['#E27A92', '#F2C53D', '#8EC3E6'][k % 3]); });
    moonFg(cam);
    confetti(t, 227.47);
  }

  // C5 — Zoo? Nah! Doom? Nah! Bliss? Nah!: Clawd holds out its old prophecy scroll; Pip's pencil touches it and it
  //      burns, a third per "Nah!", into butterflies.
  function shotScroll(t, lt, dur) {
    const nah = [bt(372) + BEAT / 2, bt(373) + BEAT / 2, bt(374) + BEAT / 2], hit = punchAt(t, nah, 8), sh = shakeXY(t, 10 * hit);
    const cam = { x: 960 + sh[0], y: 520 + sh[1], z: 1.25 + .05 * hit + .04 * lt };
    moonBg(t, cam, { earthY: 250 });
    crowd(t, cam, { gap: 700 });
    camBegin(cam.x, cam.y, cam.z);
    const burnt = nah.reduce((s, p) => s + seg(t, p, p + .4), 0) / 3;
    const sx0 = 640, sx1 = 1320, sy = 520, edge = lerp(sx0, sx1, burnt);
    if (burnt < 1) {
      boilSeed('pscroll');
      paint(rectPts(edge, sy - 110, sx1 - edge, 220, 3), { wash: PAL.cream, fill: '#E8DCC4', fillOp: 70, tex: .7, ink: PAL.ink, sw: 1 });
      for (let r = 0; r < 6; r++) if (sx1 - 40 - Math.max(edge + 20, sx0 + 40) > 20) inkLine([[Math.max(edge + 20, sx0 + 40), sy - 80 + r * 32], [sx1 - 40, sy - 80 + r * 32]], .6, '#8A7F70', 'inkfine', 0);
      if (burnt > 0) { glow(edge, sy, 90, '#FF9A3A', .9); paint(ribbon([[edge, sy - 110], [edge - 8, sy], [edge + 4, sy + 110]], 16, 16), { wash: '#E8603A', fill: '#FFC766', fillOp: 90, ink: null }); }
    }
    for (let i = 0; i < 24; i++) {   // butterflies released from the burning edge
      const b0 = sx0 + (i / 24) * (sx1 - sx0), tb = nah[0] + (i / 24) * (nah[2] + .4 - nah[0]);
      const k = seg(t, tb, tb + 1.4); if (k <= 0 || k >= 1) continue;
      boilSeed('bf' + i);
      const x = b0 + 220 * Math.sin(k * 4 + i) * k, y = sy - 380 * easeOut(k) - 80 * hash(i), fl = Math.abs(Math.sin(t * 16 + i)), c = ['#F2C53D', '#E27A92', '#8EC3E6', '#FFF5E2'][i % 4];
      for (const sd of [-1, 1]) paint(ellPts(x + sd * 28 * fl, y, 30 * fl + 5, 38, 10), { wash: c, ink: PAL.ink, sw: .7 });
    }
    clawd(470, GY, 30, { ...emotions(t, [[237.61, 'nervous'], [nah[0] + .1, 'surprised'], [nah[2] + .2, 'laugh']]), hat: 'party', view: 'q', aR: burnt < 1 ? .9 : .2, boilKey: 'clawdP' });
    pip(1500, GY, 32, { boilKey: 'pipP', flip: true, eyes: 'narrow', mouth: 'smirk', aL: .55 + .1 * Math.sin(t * 20) * (burnt < 1 ? 1 : 0), pencil: false, handL: PROPS.pencil });
    camEnd();
    moonFg(cam);
    confetti(t, 227.47);
  }

  // C6 — Your prophecy's a myth, here comes the plot twist: a whip-spin, Clawd flings off the headset, Pip tosses it a
  //      hard hat (and a hammer), fist bump.
  function shotTwist(t, lt, dur) {
    const spin = 1 - easeOut(seg(lt, 0, .45));
    const cam = { x: 960, y: 560, z: 1.3 + .2 * spin, r: -1.6 * spin };
    moonBg(t, cam, { earthY: 230 });
    crowd(t, cam, { gap: 600 });
    camBegin(cam.x, cam.y, cam.z, cam.r);
    const tToss = .7, tHat = 1.35, tBump = 2.05;
    const cl = emotions(lt, [[0, 'confused'], [.55, 'mischief'], [tHat + .1, 'determined'], [tBump + .05, 'proud']]);
    const bump = lt > tBump - .2 && lt < tBump + .3;
    clawd(780, GY, 32, { ...cl, view: 'q', hat: lt < tToss ? 'headphones' : (lt > tHat ? 'hard' : null), boilKey: 'clawdT', aL: lt > tToss - .2 && lt < tToss + .2 ? 1.5 : cl.aL,
      aR: lt > tHat ? (bump ? .3 : 1.0) : cl.aR, armR: lt > tHat ? PROPS.hammer : null, dx: bump ? .6 : 0 });
    if (lt > tToss && lt < tToss + 1.2) {   // the headset flies off, spinning
      boilSeed('hs');
      const k = seg(lt, tToss, tToss + 1.2), q = arcPt([760, GY - 260], [-100, GY - 120], 420, k);
      push(); translate(q[0], q[1]); rotate(k * 9);
      inkLine([[-70, 20], [-55, -40], [0, -60], [55, -40], [70, 20]], 4, PAL.ink, 'ink', .6);
      for (const s of [-1, 1]) paint(rrPts(s * 70 - 18, 0, 36, 56, 12), { wash: PAL.violet, ink: PAL.ink, sw: .8 }); pop();
    }
    if (lt > tHat - .45 && lt < tHat) {   // the hard hat, tossed from Pip's hand to Clawd's head
      boilSeed('hhat');
      const k = seg(lt, tHat - .45, tHat), q = arcPt([1240, GY - 300], [780, GY - 8 * 32 - 40], 200, ease(k));
      paint(ellPts(q[0], q[1], 90, 50, 16), { wash: '#F2C53D', ink: PAL.ink, sw: 1 });
    }
    pip(1300, GY, 32, { boilKey: 'pipT', flip: true, eyes: lt > tBump ? 'closed' : 'dot', mouth: 'grin', aL: lt > tHat - .5 && lt < tHat ? 1.2 : (bump ? .2 : -.6), dx: bump ? -.6 : 0, brows: 'up' });
    if (lt > tBump && lt < tBump + .5) { const k = seg(lt, tBump, tBump + .5); boilSeed('bump'); glow(1050, GY - 160, 200 * (1 - k), '#FFE27A', 1 - k); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; paint(starPts(1050 + Math.cos(a) * 200 * k, GY - 160 + Math.sin(a) * 160 * k, 24 * (1 - k), .3, 4), { wash: '#FFE27A', ink: null }); } }
    camEnd();
    moonFg(cam);
    SETS.speedLines(spin);
    confetti(t, 227.47);
  }

  // C7 — Barn's goin' up and the moon's got our back: a post per beat, rope teams hauling; Earth rises, the sun blazes.
  function shotRaise(t, lt, dur) {
    const beats = [bt(379), bt(380), bt(381), bt(382), bt(383)], hit = punchAt(t, beats, 9), sh = shakeXY(t, 8 * hit);
    const cam = { x: 960 + sh[0], y: kf(lt, [[0, 520], [dur, 600]]) + sh[1], z: kf(lt, [[0, 1.15], [dur, .9]], ease) };
    const prog = beats.reduce((s, p) => s + seg(t, p - .1, p + .25), 0) / 5;
    moonBg(t, cam, { earthY: kf(lt, [[0, 520], [dur, 220]], easeOut), earthX: 1180, sun: .7 + .3 * seg(lt, 0, dur) });
    crowd(t, cam, { gap: 900 });
    camBegin(cam.x, cam.y, cam.z);
    barn(660, GY, 600, 330, prog);
    for (const [side, x0] of [[-1, 330], [1, 1590]]) {   // rope teams, leaning back on each beat
      for (let i = 0; i < 3; i++) {
        const x = x0 + side * i * 120, lean = .25 + .2 * pulse(t, 5), isPip = side < 0 && i === 0;
        pip(x, GY, isPip ? 26 : 22 - i * 1.5, { boilKey: 'rope' + side + i, pencil: isPip, flip: side > 0, ...(isPip ? {} : { hoodie: HOOD[(i + (side > 0 ? 4 : 0)) % 8], skin: SKINS[(i + 2) % 6], beanie: HOOD[(i + 6) % 8] }),
          rot: -side * lean, aL: .2, aR: .2, eyes: 'closed', mouth: 'grin' });
      }
      boilSeed('ropeline' + side);
      inkLine([[x0 + side * 300, GY - 200], [x0 - side * 10, GY - 210], [side < 0 ? 760 : 1160, GY - 330]], 1.6, '#C9A24A', 'ink', .3);
    }
    clawd(960, GY + 30, 20, { ...feel('determined', t), hat: 'hard', view: 'front', aL: 1.2, aR: 1.2 + .3 * pulse(t, 4), armR: PROPS.hammer, boilKey: 'clawdB' });
    camEnd();
    moonFg(cam);
    confetti(t, 227.47);
  }

  // C8 — You wrote us off? So we write back!: the crowd lifts a giant pencil; it writes a gold streak across the sky,
  //      over the finished barn and the risen Earth. Brush wipe out to the outro.
  function shotPencil(t, lt, dur) {
    const cam = { x: 960 + 30 * Math.sin(lt * .5), y: kf(lt, [[0, 640], [1.5, 520], [dur, 470]], ease), z: kf(lt, [[0, 1.12], [dur, .92]], ease) };
    moonBg(t, cam, { earthY: 220, earthX: 1180, sun: 1 });
    layer(.05, cam, () => { for (let k = 384; k < 392; k++) firework(220 + 210 * ((k * 3) % 8), 130 + 90 * (k % 3), t - bt(k) - .2, ['#F2C53D', '#E27A92', '#8EC3E6', '#FF7A4A'][k % 4]); });
    camBegin(cam.x, cam.y, cam.z);
    barn(560, GY - 40, 800, 300, 1);
    const wr = seg(lt, .9, 3.3), path = u => [180 + u * 1560, 300 - 170 * Math.sin(u * Math.PI) + 60 * Math.sin(u * 13)];
    if (wr > 0) {   // the gold streak, written on progressively
      const P = []; const n = Math.max(2, Math.floor(wr * 40));
      for (let i = 0; i <= n; i++) P.push(path(i / n * wr));
      boilSeed('streak');
      paint(ribbon(P, 8, 34), { wash: '#F2C53D', fill: '#FFE27A', fillOp: 90, ink: null });
      const tip = P[P.length - 1]; glow(tip[0], tip[1], 160, '#FFD96A', 1);
    }
    // the giant pencil on many hands, its tip tracing the streak
    const tipNow = wr > 0 ? path(wr) : [760, 380];
    const base = [lerp(620, 1300, wr), GY - 360], a = Math.atan2(tipNow[1] - base[1], tipNow[0] - base[0]), L = Math.hypot(tipNow[0] - base[0], tipNow[1] - base[1]);
    boilSeed('gpencil');
    push(); translate(base[0], base[1]); rotate(a); translate(-L * .2, 0); pencilShape(L * 1.2 / 6.2, 2.2); pop();
    for (let i = 0; i < 5; i++) {   // the lifters under it
      const x = 520 + i * 220, lift = 1.35 + .1 * Math.sin(t * 7 + i), isPip = i === 2;
      pip(x, GY, isPip ? 28 : 21, { boilKey: 'lift' + i, pencil: false, ...(isPip ? {} : { hoodie: HOOD[(i + 1) % 8], beanie: HOOD[(i + 4) % 8], skin: SKINS[(i + 3) % 6] }),
        aL: lift, aR: lift, eyes: 'closed', mouth: 'grin', dy: -.4 * pulse(t, 5) });
    }
    clawd(1560, GY + 20, 24, { ...feel('starstruck', t), hat: 'hard', view: 'q', flip: true, boilKey: 'clawdE' });
    camEnd();
    moonFg(cam);
    confetti(t, 227.47, 44);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6);
  }

  shots([[214.94, shotRow], [222.85, shotDark], [227.47, shotWeDo], [229.39, shotSmash], [232.02, shotRoof], [234.65, shotWriteBack],
         [237.61, shotScroll], [239.44, shotTwist], [242.15, shotRaise], [244.87, shotPencil]]);
})();
