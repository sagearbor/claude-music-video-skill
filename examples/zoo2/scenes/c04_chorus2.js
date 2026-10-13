// c04_chorus2.js: chorus 2, 76.83–96.38 s. The chorus-1 stage, escalated: depth layers with parallax (a front row of
// crowd silhouettes moving faster than the stage, bokeh lights behind moving slower), harder push-ins, on-beat shake,
// fireworks. Shots (fn(t, lt, dur)):
//   S1 76.83 Zoo?(Nah!)Doom?(Nah!)Bliss?(Nah!) — drop flash; each door bursts into paint splats on the off-beat kick.
//   S2 78.75 Cage, grave, or a pill — Clawd pitches them, Pip bats each to pieces with a giant pencil, then poses.
//   S3 81.38 comeback track — Pip on a riser rapping into the handset, two rows of crowd, fireworks on beats.
//   S4 84.01 So we write back! — a giant pencil writes a glowing streak across the night sky over the crowd.
//   S5 86.96 Zoo? Doom? Bliss? — Clawd's crystal-ball prophecy cracks on each Nah! and shatters.
//   S6 88.80 prophecy's a myth / plot twist — Clawd's scroll tears in half; a twist-arrow loops round and points at Pip.
//   S7 91.19 pen, plan, seeds — Pip packs a backpack: pencil, map, glowing seed packet (one per beat), zips, shoulders it.
//   S8 94.22 You wrote us off? So we write back! — envelopes fly up out of the crowd; brush wipe out.
(() => {
  const { bt, INSIDE, DOOR, door, speedLines, stageBg } = SETS;
  const offs = (t, lt) => t - lt;                      // shot start in song time
  const CROWD = ['#E27A92', '#6E9F58', '#7B5CA8', '#E8AA38', '#3A9C98', '#D97757', '#8EC3E6'];
  const SKINS = ['#E9B28E', '#B97A56', '#8A5A3C', '#F2C4A0'];

  // ---------- depth layers ----------
  // Bokeh lights far behind the stage: drawn inside the camera but counter-shifted so they move at ~half the speed.
  function bokeh(t, camX, camY, n = 16) {
    for (let i = 0; i < n; i++) {
      boilSeed('bok' + i);
      const x = hash(i + 70) * (W + 600) - 300 + (camX - 960) * .5, y = 60 + hash(i + 80) * 420 + (camY - 540) * .5;
      const c = ['#FFD27A', '#F6A6C8', '#9FD8E8', '#C8B6F2'][i % 4];
      glow(x, y, 50 + 40 * hash(i + 90) + 30 * pulse(t + hash(i) * .5, 5), c, .55);
    }
  }
  // A front row of crowd silhouettes in SCREEN space, shifted 1.6x the camera move (closer than the stage) and bobbing
  // on the beat, a few hands up on the hits.
  function frontCrowd(t, camX, k = 1, y0 = 1080) {
    for (let i = 0; i < 13; i++) {
      boilSeed('fc' + i);
      const x = ((i * 175 - (camX - 960) * 1.6) % 2275 + 2275) % 2275 - 180, ph = hash(i + 3);
      const bob = Math.abs(Math.sin((bpOf(t) + ph) * Math.PI)) * 22 * k, hy = y0 - 120 - 40 * hash(i + 5) - bob;
      const col = mixCol('#1B1430', '#2F2050', hash(i + 9));
      paint(ellPts(x, y0 + 40, 105, 150, 18, 3), { wash: col, ink: null });                         // shoulders
      paint(ellPts(x, hy, 52, 56, 16, 2), { wash: col, ink: null });                                  // head
      if ((Math.floor(bpOf(t)) + i) % 3 === 0) {                                                      // a hand up on this beat
        const a = -.3 + .25 * Math.sin(t * 8 + i);
        paint(ribbon([[x + 60, y0 - 40], [x + 95 + 30 * a, hy - 60], [x + 110 + 60 * a, hy - 140 - bob]], 34, 26), { wash: col, ink: null });
      }
    }
  }
  // A firework burst at (x, y), age seconds after launch.
  function burst(x, y, age, col, r = 220, key = '') {
    if (age < 0 || age > 1.1) return;
    boilSeed('fw' + key);
    const k = easeOut(clamp(age / .55)), fade = 1 - seg(age, .5, 1.1);
    glow(x, y, r * (.4 + k), col, .9 * fade);
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * TAU + hash(i + x) * .2, r0 = r * k * .35, r1 = r * k;
      inkLine([[x + Math.cos(a) * r0, y + Math.sin(a) * r0 + 40 * age * age], [x + Math.cos(a) * r1, y + Math.sin(a) * r1 + 60 * age * age]], 2.2 * fade + .2, col, 'ink', 0);
      if (fade > .1) paint(starPts(x + Math.cos(a) * r1, y + Math.sin(a) * r1 + 60 * age * age, 9 * fade, .35, 4), { wash: PAL.cream, washOp: 255 * fade, ink: null });
    }
  }
  // Paint splats exploding out from a door's centre (the door bursting).
  function splat(x, y, age, col, key) {
    if (age < 0) return;
    boilSeed('splat' + key);
    const k = easeOut(clamp(age / .35)), shrink = 1 - ease(seg(age, .15, .6));
    if (shrink > .02) paint(starPts(x, y, (120 + 80 * k) * shrink, .55, 9, age * 2), { wash: mixCol(col, '#FFE6A6', .35), fill: col, fillOp: 90, tex: .6, ink: PAL.ink, sw: .9 });
    glow(x, y, 260 * shrink, '#FFE6A6', .7 * shrink);
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU + hash(i + key.length) * .5, d = (220 + 260 * hash(i + 11)) * k, r = (28 + 30 * hash(i + 21)) * (1 - .4 * k);
      paint(ellPts(x + Math.cos(a) * d, y + Math.sin(a) * d * .8 + 120 * age * age, r, r * .8, 12, 4), { wash: [col, '#F2C53D', PAL.cream, '#E27A92'][i % 4], ink: PAL.ink, sw: .5 });
    }
  }
  // "Hits" envelope: 1 on each event time, decaying.
  const hits = (lt, evs, k = 8) => Math.max(0, ...evs.map(p => lt > p ? Math.exp(-(lt - p) * k) : 0));
  const arcIn = (lt, p, a, b) => (lt > p - a && lt < p + b ? Math.sin(seg(lt, p - a, p + b) * Math.PI) : 0);

  // ---------- S1: Zoo? NAH! Doom? NAH! Bliss? NAH! — doors burst into paint ----------
  function s1(t, lt, dur) {
    const nah = [bt(120), bt(121), bt(122)].map(x => x + BEAT / 2 - offs(t, lt));
    const hit = hits(lt, nah), sh = shakeXY(t, 26 * hit);
    const camX = kf(lt, [[0, 820], [nah[0] + .05, 820], [nah[1] - .2, 960], [nah[1] + .05, 960], [nah[2] - .2, 1100], [dur, 1120]]);
    const camY = 560;
    camBegin(camX + sh[0], camY + sh[1], 1.14 + .12 * hit + .03 * lt);
    stageBg(t, lt, .45);
    bokeh(t, camX, camY);
    const xs = [600, 960, 1320], keys = ['zoo', 'doom', 'bliss'];
    keys.forEach((k, i) => {
      if (lt < nah[i]) door(xs[i] - 140, 330, 280, 480, .5 + .1 * Math.sin(lt * 9 + i), DOOR[k], (x, y, w, h) => INSIDE[k](x, y, w, h, t), 'c4' + k);
      else splat(xs[i], 570, lt - nah[i], DOOR[k], k);
    });
    const kick = nah.reduce((s, p) => s + arcIn(lt, p, .14, .18), 0);
    const px = kf(lt, [[0, 760], [nah[0] - .3, 780], [nah[1] - .3, 1140], [nah[2] - .3, 1500], [dur, 1500]], easeOut);
    pip(px, 900, 32, { eyes: 'narrow', brows: 'angry', mouth: kick > .3 ? 'O' : 'grin', flip: true, legs: [0, -1.2 * kick], rot: .12 * kick, aL: .5 + .7 * kick, aR: -.5 });
    camEnd();
    frontCrowd(t, camX, 1 + hit);
    nah.forEach((p, i) => sfx('NAH!', 960 + (xs[i] - camX) * 1.2, 190, 170, ['#F2C53D', '#FF7A4A', '#E27A92'][i], lt - p, { stroke: PAL.ink, life: .55, screen: true }));
    if (lt < .18) flash(1 - lt / .18);
  }

  // ---------- S2: Cage, grave, or a pill? Man, miss me with this — batting practice ----------
  const PROPS = [
    (x, y, s) => { for (let i = 0; i < 5; i++) inkLine([[x + (-60 + i * 30) * s, y - 70 * s], [x + (-60 + i * 30) * s, y + 70 * s]], 2.4, '#C9C2B5', 'ink', 0); inkLine([[x - 75 * s, y - 70 * s], [x + 75 * s, y - 70 * s]], 3, '#C9C2B5', 'ink', 0); inkLine([[x - 75 * s, y + 70 * s], [x + 75 * s, y + 70 * s]], 3, '#C9C2B5', 'ink', 0); },
    (x, y, s) => { paint([[x - 55 * s, y + 75 * s], [x - 55 * s, y - 30 * s], [x, y - 80 * s], [x + 55 * s, y - 30 * s], [x + 55 * s, y + 75 * s]], { wash: '#9A9AA8', fill: '#6E6E80', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1, curv: .4 }); inkLine([[x - 20 * s, y - 15 * s], [x + 20 * s, y - 15 * s]], 1.2, PAL.ink, 'ink', 0); inkLine([[x, y - 38 * s], [x, y + 22 * s]], 1.2, PAL.ink, 'ink', 0); },
    (x, y, s, r = 0) => { push(); translate(x, y); rotate(r); paint(rrPts(-70 * s, -28 * s, 70 * s, 56 * s, 28 * s), { wash: '#E27A92', ink: PAL.ink, sw: 1 }); paint(rrPts(0, -28 * s, 70 * s, 56 * s, 28 * s), { wash: PAL.cream, ink: PAL.ink, sw: 1 }); pop(); },
  ];
  const PROP_COL = ['#C9C2B5', '#9A9AA8', '#E27A92'];
  function shards(x, y, age, col, key) {
    if (age < 0 || age > .9) return;
    boilSeed('shard' + key);
    const k = easeOut(clamp(age / .5)), fade = 1 - seg(age, .5, .9);
    glow(x, y, 160 * (1 - k * .5), '#FFE6A6', .8 * fade);
    for (let i = 0; i < 10; i++) {
      const a = Math.PI + (hash(i + key) - .5) * 2.2, d = (180 + 260 * hash(i + 7)) * k;
      const sx = x + Math.cos(a) * d, sy = y + Math.sin(a) * d * .7 + 300 * age * age, r = 22 + 14 * hash(i + 3);
      paint(starPts(sx, sy, r * fade + 2, .45, 3, age * 9 + i), { wash: i % 2 ? col : PAL.cream, ink: PAL.ink, sw: .5 });
    }
    paint(starPts(x, y, 110 * k * fade + 2, .3, 8, age * 3), { wash: PAL.cream, washOp: 255 * fade, ink: null });
  }
  function s2(t, lt, dur) {
    const contact = [bt(123), bt(124), bt(125)].map(x => x + .32 - offs(t, lt));   // pitched on the beat, hit .32 s later
    const hit = hits(lt, contact, 9), sh = shakeXY(t, 22 * hit);
    camBegin(980 + sh[0] + 20 * Math.sin(lt), 560 + sh[1], 1.08 + .1 * hit);
    stageBg(t, lt, .7);
    bokeh(t, 980, 560);
    // Clawd on the mound (left), pitching on each beat, then sulking
    const pitch = contact.reduce((s, p) => s + arcIn(lt, p - .32, .18, .12), 0);
    clawd(330, 900, 28, { ...emotions(lt, [[0, 'determined'], [contact[2] + .5, 'disgusted']]), hat: 'headphones', view: 'q', aR: .2 + 1.3 * pitch, sq: -.1 * pitch });
    // Pip, facing left, swings the giant pencil like a bat through each contact
    const PX = 1300, PY = 900, S = 30;
    let swing = 1.35;   // arm raised = wound up
    contact.forEach(p => { if (lt > p - .12 && lt < p + .35) swing = lerp(1.35, -.7, ease(seg(lt, p - .12, p + .08))); else if (lt > p + .35 && lt < p + .6) swing = lerp(-.7, 1.35, ease(seg(lt, p + .35, p + .6))); });
    const cool = lt > contact[2] + .65;
    if (cool) swing = lerp(-.7, 1.5, ease(seg(lt, contact[2] + .65, contact[2] + 1.0)));
    pip(PX, PY, S, { eyes: cool ? 'closed' : 'narrow', brows: cool ? null : 'angry', mouth: cool ? 'smirk' : 'grin', flip: true, rot: -.08 * Math.sin(swing),
      aR: swing, aL: -.9, legs: [.15, -.25], pencil: false,
      handR: (s, sw) => { push(); rotate(cool ? 2.2 : .15); pencilShape(s * 1.5, sw); pop(); } });
    // the three pitches fly in on arcs to the contact point (~PX - 10.5S, PY - 7.6S), then shatter
    const cx = PX - 10.5 * S, cy = PY - 7.6 * S;
    PROPS.forEach((draw, i) => {
      const p = contact[i], k = seg(lt, p - .32, p);
      if (k > 0 && k < 1) { boilSeed('pitch' + i); const q = arcPt([430, 640], [cx, cy], 90, easeIn(k)); draw(q[0], q[1], 1.4 + .6 * k, t * 8); }
      shards(cx, cy, lt - p, PROP_COL[i], i);
    });
    camEnd();
    frontCrowd(t, 980, 1 + hit);
    if (lt > dur - .2) speedLines(ease((lt - (dur - .2)) / .2));
  }

  // ---------- S3: This ain't a eulogy, it's a comeback track — the riser ----------
  function s3(t, lt, dur) {
    const whip = lt < .2 ? 1 - ease(lt / .2) : 0;
    const beatHit = pulse(t, 7), sh = shakeXY(t, 8 * beatHit);
    const camX = 960 - 900 * whip, camY = kf(lt, [[0, 600], [dur, 520]]);
    camBegin(camX + sh[0], camY + sh[1], kf(lt, [[0, 1.0], [dur, 1.16]]) + .03 * beatHit);
    stageBg(t, lt, .25);
    bokeh(t, camX, camY, 20);
    // fireworks on successive beats, alternating sides
    for (let b = 0; b < 5; b++) {
      const tb = bt(129 + b) - offs(t, lt);
      burst(b % 2 ? 1500 : 420, 210 + 60 * (b % 3), lt - tb, ['#F2C53D', '#E27A92', '#9FD8E8', '#C8B6F2', '#FF7A4A'][b], 230, 's3' + b);
    }
    // back row of the crowd (smaller, behind the riser), then the riser, then Pip
    for (let i = 0; i < 9; i++) {
      const m = move(['bounce', 'roof', 'sway', 'hop'][i % 4], t + i * .11, i);
      pip(180 + i * 195, 790, 15, { ...m, walk: undefined, hoodie: CROWD[i % 7], beanie: CROWD[(i + 2) % 7], skin: SKINS[i % 4], pencil: false, eyes: 'happy', mouth: 'grin', boilKey: 'c3b' + i, dy: (m.dy || 0) * .5 });
    }
    boilSeed('riser');
    paint(rrPts(700, 640, 520, 260, 14, 2), { wash: '#5A3A5A', fill: PAL.violet, fillOp: 70, tex: .6, ink: PAL.ink, sw: 1.2 });
    for (let i = 0; i < 4; i++) inkLine([[730 + i * 130, 660], [730 + i * 130, 880]], .6, PAL.ink, 'inkfine', 0);
    glow(960, 640, 320, '#FFE6A6', .5 + .4 * beatHit);
    const m = move('bounce', t);
    pip(960, 650, 32, { ...m, walk: undefined, eyes: 'closed', mouth: frac(bpOf(t) * 2) < .5 ? 'O' : 'grin', aR: 1.1 + .35 * Math.sin(bpOf(t) * Math.PI), aL: .9,
      handL: (s, sw) => { push(); rotate(-1.2); translate(s * 1.5, 0); handset(s * .7, sw); pop(); } });
    // front row of the crowd, bigger, popping in on successive beats
    for (let i = 0; i < 8; i++) {
      const tIn = bt(127 + Math.floor(i / 2)) - offs(t, lt), k = backOut(seg(lt, tIn, tIn + .3)); if (k <= 0) continue;
      const m2 = move(['roof', 'bounce', 'hop', 'sway'][i % 4], t + i * .13, i);
      pip(150 + i * 235 + (i > 3 ? 120 : 0), 1060 + (1 - k) * 400, 22, { ...m2, walk: undefined, hoodie: CROWD[(i + 3) % 7], beanie: CROWD[(i + 5) % 7], skin: SKINS[(i + 1) % 4], pencil: false, eyes: 'happy', mouth: 'grin', boilKey: 'c3f' + i, dy: (m2.dy || 0) * .6 });
    }
    camEnd();
    frontCrowd(t, camX, 1.4);
    speedLines(whip);
  }

  // ---------- S4: You wrote us off? So we write back! — a pencil writes across the sky ----------
  function streakPath(k) {   // a big looping cursive stroke across the sky; k = 0..1 progress
    const P = [], n = Math.max(2, Math.floor(k * 90));
    for (let i = 0; i <= n; i++) { const u = i / 90; P.push([120 + u * 1700 + 70 * Math.cos(u * 22), 330 - 120 * Math.sin(u * 5) + 80 * Math.sin(u * 22)]); }
    return P;
  }
  function s4(t, lt, dur) {
    const write = seg(lt, .3, 2.5);
    const P = streakPath(write), tip = P[P.length - 1];
    const camX = kf(lt, [[0, 760], [2.5, 1160]]), camY = kf(lt, [[0, 760], [.6, 540]]);
    camBegin(camX, camY, 1.08);
    boilSeed('sky4');
    paint(rectPts(-600, -400, W + 1400, H + 900), { wash: '#141B3D', ink: null });
    paint(ellPts(960, 1000, 1400, 420, 30, 10), { fill: '#7B2B4A', fillOp: 100, bleed: .3, tex: .5, ink: null });
    for (let i = 0; i < 40; i++) { boilSeed('st4' + i); paint(starPts(hash(i) * 2600 - 300, hash(i + 40) * 600 - 50, 4 + 4 * hash(i + 2), .35, 4), { wash: PAL.cream, washOp: 150 + 90 * Math.sin(t * 2 + i), ink: null }); }
    bokeh(t, camX, camY, 10);
    // the glowing streak: a wide soft glow pass, then a bright painted ribbon
    if (P.length > 2) {
      boilSeed('streak');
      for (let i = 0; i < P.length; i += 6) glow(P[i][0], P[i][1], 70, '#FFD27A', .5);
      paint(ribbon(P, 8, 22), { wash: '#FFE6A6', fill: '#F2C53D', fillOp: 90, ink: null });
      for (let i = 0; i < 6; i++) { const q = P[Math.max(0, P.length - 1 - i * 3)]; paint(starPts(q[0] + 30 * hash(i + Math.floor(t * 12)), q[1] + 30 * hash(i + 9 + Math.floor(t * 12)), 10, .3, 4), { wash: PAL.cream, ink: null }); }
    }
    // the giant pencil writing, its point at the tip of the streak
    boilSeed('gpen');
    push(); translate(tip[0], tip[1]); rotate(-2.3 + .15 * Math.sin(lt * 18)); translate(-6.2 * 55, 0); pencilShape(55, 1.6); pop();
    glow(tip[0], tip[1], 120, '#FFF2C0', 1);
    // rooftop silhouette with Pip and the crowd cheering below
    boilSeed('roofs');
    for (let i = 0; i < 9; i++) paint(rectPts(-300 + i * 330, 820 - 140 * hash(i + 4), 300, 600, 2), { wash: '#1B1430', ink: null });
    for (let i = 0; i < 6; i++) { const m = move('roof', t + i * .1, i); pip(300 + i * 280 + (i > 2 ? 320 : 0), 900, 17, { ...m, walk: undefined, hoodie: CROWD[i], beanie: CROWD[(i + 4) % 7], skin: SKINS[i % 4], pencil: false, eyes: 'happy', mouth: 'O', lookY: -1, boilKey: 'c4r' + i, dy: (m.dy || 0) * .5 }); }
    pip(1120, 900, 26, { eyes: 'star', mouth: 'grin', aL: 1.3, aR: 1.3, lookY: -1, pencil: false, dy: -1.5 * Math.abs(Math.sin(bpOf(t) * Math.PI)) });
    camEnd();
    frontCrowd(t, camX, 1.2);
  }

  // ---------- S5: Zoo? Doom? Bliss? — the crystal-ball prophecy cracks ----------
  function crystal(x, y, r, cracks, shatter, t) {
    boilSeed('ball');
    if (shatter <= 0) {
      glow(x, y, r * 2.2, '#C8B6F2', .9);
      paint(ellPts(x, y, r, r, 30), { wash: '#B9A6E8', fill: '#E8DFFF', fillOp: 90, bleed: .2, tex: .4, ink: PAL.ink, sw: 1.2 });
      for (let i = 0; i < 3; i++) { const a = t * 1.5 + i * 2.1; paint(ellPts(x + Math.cos(a) * r * .35, y + Math.sin(a) * r * .25, r * .35, r * .18, 14, 0, a), { fill: '#7B5CA8', fillOp: 70, bleed: .3, ink: null }); }
      paint(ellPts(x - r * .38, y - r * .4, r * .18, r * .1, 10, 0, -.6), { wash: '#FFFFFF', washOp: 200, ink: null });
      for (let c = 0; c < cracks; c++) {
        const a0 = hash(c + 30) * TAU, P = [[x + Math.cos(a0) * r * .1, y + Math.sin(a0) * r * .1]];
        for (let j = 1; j < 6; j++) { const a = a0 + (hash(c * 7 + j) - .5) * 1.2; P.push([x + Math.cos(a) * r * j / 5.2, y + Math.sin(a) * r * j / 5.2]); }
        inkLine(P, 1.6, PAL.ink, 'ink', 0);
      }
    } else {
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * TAU, d = r * (.3 + 1.6 * easeOut(shatter)), fy = 500 * shatter * shatter;
        paint(starPts(x + Math.cos(a) * d, y + Math.sin(a) * d + fy, r * .28 * (1 - shatter * .5), .5, 3, a + shatter * 6), { wash: '#B9A6E8', fill: '#E8DFFF', fillOp: 80, ink: PAL.ink, sw: .7 });
      }
      glow(x, y, r * 2 * (1 - shatter), '#C8B6F2', 1 - shatter);
    }
  }
  function s5(t, lt, dur) {
    const nah = [bt(136), bt(137), bt(138)].map(x => x + BEAT / 2 - offs(t, lt));
    const hit = hits(lt, nah), sh = shakeXY(t, 18 * hit);
    const whip = lt < .2 ? 1 - ease(lt / .2) : 0;
    camBegin(960 + 900 * whip + sh[0], 520 + sh[1], kf(lt, [[0, 1.05], [dur, 1.3]]) + .08 * hit);
    stageBg(t, lt, .9);
    bokeh(t, 960, 520);
    const cracks = nah.filter(p => lt > p).length, shatter = seg(lt, nah[2], nah[2] + .5);
    const cl = emotions(lt, [[0, 'smug'], [nah[0], 'nervous'], [nah[1], 'scared'], [nah[2] + .1, 'ko']]);
    clawd(760, 930, 30, { ...cl, dy: Math.max(-1, cl.dy || 0), hat: "headphones", aL: shatter > 0 ? cl.aL : 1.4, aR: shatter > 0 ? cl.aR : 1.4 });
    crystal(760, 390 - 20 * Math.sin(lt * 3), 110, cracks, shatter, t);
    const point = nah.reduce((s, p) => s + arcIn(lt, p, .1, .25), 0);
    pip(1380, 930, 30, { eyes: 'narrow', brows: 'angry', mouth: point > .3 ? 'O' : 'flat', flip: true, aR: .2 + .9 * point, aL: -1.0, rot: .06 * point });
    camEnd();
    nah.forEach((p, i) => sfx('NAH!', [640, 960, 1280][i], 170, 150, ['#F2C53D', '#FF7A4A', '#E27A92'][i], lt - p, { stroke: PAL.ink, life: .5, screen: true }));
    frontCrowd(t, 960, 1 + hit);
    speedLines(whip);
  }

  // ---------- S6: Your prophecy's a myth, here comes the plot twist ----------
  function s6(t, lt, dur) {
    const tear = seg(lt, .75, 1.5), arrowK = seg(lt, 1.35, 2.1);
    camBegin(kf(lt, [[0, 900], [1.4, 900], [2.2, 1060]]), 540, kf(lt, [[0, 1.3], [1.2, 1.15], [dur, 1.08]]));
    stageBg(t, lt, .6);
    bokeh(t, 960, 540);
    if (lt < .7) { boilSeed('ballfall'); for (let i = 0; i < 10; i++) { const k = lt + .12; paint(starPts(840 + (hash(i) - .5) * 520 * (.4 + k), 560 + 700 * k * k + 60 * hash(i + 3), 26, .5, 3, k * 7 + i), { wash: '#B9A6E8', fill: '#E8DFFF', fillOp: 80, ink: PAL.ink, sw: .7 }); } }
    // the prophecy scroll, held up by Clawd, tearing down the middle and falling apart
    const sx = 520, sy = 300, sw = 640, sh = 340;
    for (const side of [0, 1]) {
      boilSeed('tear' + side);
      push();
      const dx = (side ? 1 : -1) * 160 * easeIn(tear), dy = 420 * tear * tear, rr = (side ? 1 : -1) * .5 * tear;
      translate(sx + sw / 2 + dx, sy + sh / 2 + dy); rotate(rr);
      const E = [];
      for (let j = 0; j <= 8; j++) E.push([(j % 2 ? 14 : -14) * (tear > 0 ? 1 : 0), -sh / 2 + j * sh / 8]);   // the jagged tear edge, top → bottom
      const pts = side ? [...E, [sw / 2, sh / 2], [sw / 2, -sh / 2]] : [[-sw / 2, -sh / 2], ...E, [-sw / 2, sh / 2]];
      paint(pts, { wash: PAL.cream, fill: '#E8DCC4', fillOp: 70, tex: .7, ink: PAL.ink, sw: 1 });
      const x0 = side ? 30 : -sw / 2 + 30, x1 = side ? sw / 2 - 30 : -30;
      for (let r = 0; r < 7; r++) inkLine([[x0, -sh / 2 + 50 + r * 40], [x0 + (x1 - x0) * (.6 + .4 * hash(r + side * 9)), -sh / 2 + 50 + r * 40]], .6, '#8A7F70', 'inkfine', 0);
      pop();
    }
    clawd(840, 930, 28, { ...emotions(lt, [[0, 'proud'], [.8, 'surprised'], [1.6, 'sad']]), hat: 'headphones', aL: tear > .02 ? .2 : 1.3, aR: tear > .02 ? .2 : 1.3 });
    // the plot twist: a fat arrow loops around the stage and lands pointing at Pip
    if (arrowK > 0) {
      boilSeed('twist');
      const A = [], n = Math.max(3, Math.floor(arrowK * 60));
      for (let i = 0; i <= n; i++) { const u = i / 60; A.push([400 + u * 1050 + 260 * Math.cos(u * 9), 420 - 240 * Math.sin(u * 9) + u * 220]); }
      paint(ribbon(A, 18, 46), { wash: '#F2C53D', fill: PAL.ochre, fillOp: 80, ink: PAL.ink, sw: 1.2 });
      const a = A[A.length - 1], b = A[A.length - 2], ang = Math.atan2(a[1] - b[1], a[0] - b[0]);
      push(); translate(a[0], a[1]); rotate(ang); paint([[0, -55], [70, 0], [0, 55]], { wash: '#F2C53D', ink: PAL.ink, sw: 1.2 }); pop();
      if (arrowK >= 1) glow(a[0], a[1], 140, '#FFE6A6', .8);
    }
    const landed = arrowK >= 1;
    pip(1560, 930, 30, { eyes: landed ? 'closed' : 'narrow', mouth: landed ? 'smirk' : 'flat', flip: true, aR: landed ? 1.0 : -1.1, aL: landed ? -.3 : -1.1, emote: landed ? 'spark' : null, emoteK: ease(seg(lt, 2.1, 2.3)) });
    camEnd();
    frontCrowd(t, 960, .8);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6);
  }

  // ---------- S7: Got a pen, got a plan, got seeds in the pack ----------
  function backpack(x, y, s, flap, key) {
    boilSeed('pack' + key);
    paint(rrPts(x - 90 * s, y - 150 * s, 180 * s, 190 * s, 40 * s, 2), { wash: '#C8324A', fill: '#8A2233', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1.2 * s });
    paint(rrPts(x - 60 * s, y - 40 * s, 120 * s, 60 * s, 14 * s), { wash: '#A82A3D', ink: PAL.ink, sw: .8 * s });
    inkLine([[x - 70 * s, y - 150 * s], [x - 85 * s, y - 210 * s], [x + 85 * s, y - 210 * s], [x + 70 * s, y - 150 * s]], 2 * s, '#5A1A25', 'ink', .5);   // handle
    const fh = lerp(18, 110, flap);   // the flap: open = thin strip at the top; closed = down over the top
    paint(rrPts(x - 92 * s, y - 155 * s, 184 * s, fh * s, 20 * s), { wash: '#E04A5E', ink: PAL.ink, sw: 1 * s });
    if (flap > .8) paint(rrPts(x - 12 * s, y - 155 * s + (fh - 24) * s, 24 * s, 22 * s, 4 * s), { wash: PAL.ochre, ink: PAL.ink, sw: .6 * s });
  }
  function mapShape(x, y, s, r = 0) {
    push(); translate(x, y); rotate(r);
    paint(rectPts(-60 * s, -40 * s, 120 * s, 80 * s), { wash: '#F3E2B5', fill: '#D9C48A', fillOp: 60, ink: PAL.ink, sw: .8 * s });
    for (const fx of [-20, 20]) inkLine([[fx * s, -40 * s], [fx * s, 40 * s]], .5, PAL.ink, 'inkfine', 0);
    inkLine([[-45 * s, 20 * s], [-10 * s, -5 * s], [15 * s, 10 * s], [40 * s, -20 * s]], 1.2, '#C8324A', 'ink', .5);
    pop();
  }
  function seedPacket(x, y, s, r = 0) {
    push(); translate(x, y); rotate(r);
    glow(0, 0, 90 * s, '#B6F27A', .9);
    paint(rectPts(-38 * s, -50 * s, 76 * s, 100 * s), { wash: '#9CCB6A', fill: PAL.sap, fillOp: 60, ink: PAL.ink, sw: .8 * s });
    paint(ellPts(0, 0, 18 * s, 24 * s, 12), { wash: '#F2C53D', ink: PAL.ink, sw: .5 * s });
    pop();
  }
  function s7(t, lt, dur) {
    const beats = [bt(143), bt(144), bt(145)].map(x => x - offs(t, lt));
    const zip = beats[2] + .55, lift = seg(lt, zip + .2, zip + .6);
    const hit = hits(lt, beats.map(b => b + .3), 9), sh = shakeXY(t, 6 * hit);
    camBegin(980 + sh[0], 600 + sh[1], kf(lt, [[0, 1.25], [dur, 1.12]]));
    stageBg(t, lt, .15);
    bokeh(t, 980, 600);
    const BX = 1060, BY = 880;
    const packX = lerp(BX, 820, ease(lift)), packY = lerp(BY, 730, ease(lift));
    if (lift <= 0) backpack(packX, packY, 1, ease(seg(lt, zip - .1, zip + .15)), 'p');
    // the three items, each tossed on its beat from Pip's hand into the bag
    const hand = [700, 600], into = [BX, BY - 140];
    const items = [(x, y, r) => { push(); translate(x, y); rotate(r); translate(-60, 0); pencilShape(22, 1.2); pop(); }, (x, y, r) => mapShape(x, y, 1.6, r), (x, y, r) => seedPacket(x, y, 1.6, r)];
    items.forEach((draw, i) => {
      const k = seg(lt, beats[i], beats[i] + .3);
      if (k > 0 && k < 1) { boilSeed('toss' + i); const q = arcPt(hand, into, 160, easeIn(k)); draw(q[0], q[1], k * 4); }
      if (lt > beats[i] + .3 && lt < beats[i] + .7) { boilSeed('pop' + i); paint(starPts(into[0], into[1] - 30, 40 * (1 - seg(lt, beats[i] + .3, beats[i] + .7)), .3, 4), { wash: PAL.cream, ink: null }); }
    });
    // Pip: holding up each item before its beat, then tossing; after the zip, the pack swings onto the back
    const tossing = beats.reduce((s, b) => s + arcIn(lt, b, .2, .15), 0);
    const holding = beats.findIndex(b => lt < b + .02);
    const shown = holding >= 0 && (holding === 0 || lt > beats[holding - 1] + .3);
    pip(780, 930, 32, { eyes: lt > zip ? 'closed' : 'dot', mouth: lt > zip ? 'grin' : 'smile', lookX: 1, aR: .4 + .9 * tossing, aL: lift > 0 ? .9 : -1.0, pencil: lt < beats[0] - .45,
      handR: shown ? (s, sw) => { if (holding === 0) { push(); rotate(-1.2); pencilShape(s * .75, sw); pop(); } else if (holding === 1) mapShape(0, -s * 1.2, s / 20); else seedPacket(0, -s * 1.2, s / 20); } : null,
      emote: lt > zip + .6 ? 'spark' : null, emoteK: ease(seg(lt, zip + .6, zip + .8)),
      draw: lift > .5 ? (s, sw) => { push(); translate(-1.9 * s, -6.5 * s); paint(rrPts(-1.6 * s, -2.6 * s, 2.2 * s, 4.6 * s, .6 * s), { wash: '#C8324A', ink: PAL.ink, sw: sw * .8 }); pop(); } : null });
    if (lift > 0 && lift < .5) backpack(packX, packY, lerp(1, .5, lift), 1, 'p');
    camEnd();
    frontCrowd(t, 980, .7);
    if (lt < .3) brushWipe(.5 + lt / .6);
  }

  // ---------- S8: You wrote us off? So we write back! — envelopes fly up ----------
  function envelope(x, y, s, r) {
    push(); translate(x, y); rotate(r);
    paint(rectPts(-40 * s, -26 * s, 80 * s, 52 * s), { wash: PAL.cream, fill: '#E8DCC4', fillOp: 50, ink: PAL.ink, sw: .7 * s });
    inkLine([[-40 * s, -26 * s], [0, 4 * s], [40 * s, -26 * s]], .7 * s, PAL.ink, 'inkfine', 0);
    paint(heartPts(0, 6 * s, 7 * s), { wash: '#C8324A', ink: null });
    pop();
  }
  function s8(t, lt, dur) {
    const beatHit = pulse(t, 6), sh = shakeXY(t, 10 * beatHit);
    camBegin(960 + sh[0], kf(lt, [[0, 620], [dur, 480]]) + sh[1], kf(lt, [[0, 1.0], [dur, 1.12]]));
    stageBg(t, lt, .35);
    bokeh(t, 960, 550, 20);
    for (let b = 0; b < 3; b++) burst([500, 1450, 960][b], [220, 260, 160][b], lt - (bt(148 + b) - offs(t, lt)), ['#F2C53D', '#E27A92', '#9FD8E8'][b], 260, 's8' + b);
    for (let i = 0; i < 7; i++) {
      const m = move(['roof', 'hop', 'bounce'][i % 3], t + i * .1, i);
      pip(220 + i * 250 + (i > 2 ? 100 : 0), 960, 20, { ...m, walk: undefined, hoodie: CROWD[(i + 1) % 7], beanie: CROWD[(i + 4) % 7], skin: SKINS[(i + 2) % 4], pencil: false, eyes: 'happy', mouth: 'grin', boilKey: 'c8c' + i, dy: (m.dy || 0) * .6 });
    }
    const m = move('roof', t);
    pip(960, 900, 30, { ...m, walk: undefined, eyes: 'closed', mouth: 'grin', lookY: -1 });
    // envelopes: launched from the crowd's hands in waves on each beat, fluttering up and out of frame
    for (let i = 0; i < 26; i++) {
      const t0 = bt(147 + (i % 4)) - offs(t, lt) + hash(i) * .2, a = lt - t0;
      if (a < 0) continue;
      boilSeed('env' + i);
      const x0 = 220 + hash(i + 1) * 1500, x = x0 + 120 * Math.sin(a * 3 + i) + (hash(i + 2) - .5) * 300 * a, y = 760 - a * (380 + 200 * hash(i + 3));
      if (y < -100) continue;
      envelope(x, y, 1 + .4 * hash(i + 4), .4 * Math.sin(a * 6 + i));
    }
    camEnd();
    frontCrowd(t, 960, 1.4);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6);
  }

  shots([[76.83, s1], [78.75, s2], [81.38, s3], [84.01, s4], [86.96, s5], [88.80, s6], [91.19, s7], [94.22, s8]]);
})();
