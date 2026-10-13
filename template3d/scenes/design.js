// design.js: --design stage sheets (LOOPS only, never on the timeline). Each loop frame is one panel; label via hud().
const label = (txt, sub) => hud(ctx => { ctx.font = '64px "Permanent Marker"'; ctx.fillStyle = 'rgba(20,16,28,.78)'; ctx.fillRect(0, 0, W, sub ? 150 : 100); ctx.fillStyle = '#FFF5E2'; ctx.fillText(txt, 40, 74); if (sub) { ctx.font = '38px system-ui'; ctx.fillStyle = '#d8cfe8'; ctx.fillText(sub, 42, 128); } });
const studio = (hex = '#e9e4ef') => { look({ sky: [hex, '#f7f4fa', '#d9d3e2'], keyDir: [-.6, 1, .8], keyInt: 3.2, fill: .6 }); put(keep('sheet-floor', () => build([['3958', COL.white, -3, 0, -3], ['3958', COL.white, 3, 0, -3], ['3958', COL.white, -3, 0, 3], ['3958', COL.white, 3, 0, 3]]))); };
const posePip = p => put(pose(fig('pip', PIP), p), 0, 0, 0);

// Pip turnaround: front, three-quarter, side, back
LOOPS.pipTurn = t => { const i = Math.floor(t), a = [0, .8, 1.57, Math.PI][i];
  cam({ pos: [Math.sin(a) * 15, 4.2, Math.cos(a) * 15], look: [0, 2.6, 0], fov: 28, blur: 0 }); studio(); posePip({ face: 'neutral' });
  label(['Pip: front', 'three-quarter', 'side', 'back'][i], i ? '' : 'teal hoodie torso, navy legs, mustard knit cap, glasses decal, pencil behind the right ear'); };
LOOPS.pipTurn.len = 4;
// Pip expressions (face decals) in close-up
const EXPR = ['neutral', 'joy', 'fear', 'determined', 'smug', 'suspicious', 'shocked', 'sing', 'sleepy', 'angry', 'dizzy', 'wink'];
LOOPS.pipFaces = t => { const i = Math.floor(t); cam({ pos: [1.2, 5.6, 7], look: [0, 4.6, 0], fov: 26, blur: 0 }); studio('#f1e6d6'); posePip({ face: EXPR[i], head: -.15 }); label(EXPR[i]); };
LOOPS.pipFaces.len = EXPR.length;
// Pip action poses from the storyboard
const ACT = [['kicks a door ("Nah!")', { face: 'angry', legR: 1.3, armL: .6, armR: -.4, lean: -.15 }],
  ['dodges: matrix lean', { face: 'shocked', lean: -.55, armL: 1.2, armR: 1.2, bodyY: -.3 }],
  ['raps into the handset', { face: 'sing', armR: 1.55, armL: 1.0, holdR: heldHandset('d') }],
  ['scribbles with the pencil', { face: 'determined', armR: 1.0, holdR: heldPencil('d'), head: .3 }],
  ['cheers ("WE DO!")', { face: 'joy', armL: 2.8, armR: 2.8, bodyY: .3 }],
  ['walks (stiff, on twos)', { face: 'neutral', ...walkPose(.25) }]];
LOOPS.pipPoses = t => { const i = Math.floor(t); cam({ pos: [6, 5, 13], look: [0, 2.8, 0], fov: 30, blur: 0 }); studio('#e3eef2'); posePip(ACT[i][1]); label(ACT[i][0]); };
LOOPS.pipPoses.len = ACT.length;
// Clawd: turnaround + costumes + faces
const CL = [['Clawd: front', { face: 'neutral', hat: 'headset' }, 0], ['three-quarter', { face: 'smug', hat: 'headset', armR: .6 }, .8], ['side', { face: 'neutral', hat: 'headset' }, 1.57],
  ['zoo: keeper cap', { face: 'suspicious', hat: 'keeper', armR: .8 }, .4], ['doom: reaper hood', { face: 'smug', hat: 'reaper' }, .4], ['bliss: halo', { face: 'joy', hat: 'halo', armL: .7, armR: .7 }, .4],
  ['shocked', { face: 'shocked', hat: 'headset', armL: 1, armR: 1 }, .2], ['dizzy (ZERO ZERO ZERO)', { face: 'dizzy', hat: 'headset', roll: .15 }, .2], ['glitch (outro)', { face: 'glitch', hat: 'headset' }, .2]];
LOOPS.clawd = t => { const i = Math.floor(t), [name, p, a] = CL[i]; cam({ pos: [Math.sin(a) * 19, 5.5, Math.cos(a) * 19], look: [0, 4, 0], fov: 28, blur: 0 }); studio('#f3e2d6'); put(clawdPose(clawd('d', {}), p), 0, 0, 0); label(name); };
LOOPS.clawd.len = CL.length;
// line-up: heights of the whole cast
LOOPS.lineup = t => { cam({ pos: [0, 5.5, 34], look: [0, 3.5, 0], fov: 30, blur: 0 }); studio('#e6e9ee');
  put(pose(fig('pip', PIP), { face: 'joy' }), -9, 0, 0); put(clawdPose(clawd('d', {}), { face: 'smug', hat: 'headset' }), -2.5, 0, 0);
  for (let i = 0; i < 3; i++) put(pose(fig('lc' + i, crowdLook(i)), { face: ['joy', 'neutral', 'wink'][i] }), 3 + i * 3, 0, 0);
  put(robotPose(keep('lbot', robot), { walk: 0, carry: true }), 13, 0, 0); label('The cast, to scale', 'Pip · Clawd · the neighbours · a builder robot'); };
LOOPS.lineup.len = 1;
// the lit set: the stage district at golden hour, hero angle; and the world map from above
LOOPS.litSet = t => { runShot(29.0); cam({ pos: [26, 14, 40], look: [0, 3, -6], fov: 40, blur: .5, focus: [0, 4, 0] }); label('Lit set: the STAGE district', 'soft key + fill, clearcoat plastic, DOF; background robots raise buildings across the song'); };
LOOPS.litSet.len = 1; LOOPS.litSet.world = true;
LOOPS.worldMap = t => { cam({ pos: [60, 420, 330], look: [0, 0, -90], fov: 40, blur: 0 }); look({ ...WORLD.LOOK.stage });
  label('The one world (camera flies; no cuts)', 'desk → stage → zoo → doom → bliss → roast → farm → rocket to the moon → desk');
  hud((ctx) => { /* district tags drawn by projecting world points */ for (const [n, p] of Object.entries(WORLD.D)) { if (n === 'moon') continue; const v = new THREE.Vector3(p[0], 0, p[1]).project(window.__cam); const x = (v.x + 1) / 2 * W, y = (1 - v.y) / 2 * H;
    ctx.fillStyle = 'rgba(20,16,28,.8)'; ctx.font = '40px "Permanent Marker"'; const w = ctx.measureText(n).width; ctx.fillRect(x - w / 2 - 12, y - 34, w + 24, 50); ctx.fillStyle = '#FFE38A'; ctx.fillText(n, x - w / 2, y + 4); } }); };
LOOPS.worldMap.len = 1; LOOPS.worldMap.world = true;
// motion test: every dance + walk + run, locked to the beat of chorus 2 (song time 76.83 + t)
LOOPS.moves = t => {
  const T = 76.83 + t, names = ['walk', 'run', ...Object.keys(DANCES)];
  cam({ pos: [0, 15, 46], look: [0, 1.5, 1], fov: 36, blur: 0 }); studio('#e9eef3');
  put(keep('moves-floor', () => { const l = []; for (let i = -4; i < 4; i++) for (let j = -3; j < 3; j++) l.push(['3958', COL.white, i * 6 + 3, 0, j * 6 + 3]); return build(l); }));
  names.forEach((n, i) => {
    const x = (i % 4 - 1.5) * 8, z = (Math.floor(i / 4) - 1.5) * 8.5;
    const p = n === 'walk' ? walk(T * 1.1) : n === 'run' ? run(T * 1.6) : dance(n, T);
    put(pose(fig('mv' + i, i ? crowdLook(i) : PIP), { face: n === 'robot' ? 'neutral' : 'joy', ...p }), x, 0, z, n === 'walk' || n === 'run' ? Math.PI / 2 : 0);
    hud(ctx => { const v = new THREE.Vector3(x, 0, z + 2.6).project(window.__cam), sx = (v.x + 1) / 2 * W, sy = (1 - v.y) / 2 * H;
      ctx.font = '26px "Permanent Marker"'; const w = ctx.measureText(n).width; ctx.fillStyle = 'rgba(20,16,28,.75)'; ctx.fillRect(sx - w / 2 - 8, sy - 26, w + 16, 36); ctx.fillStyle = '#FFE38A'; ctx.fillText(n, sx - w / 2, sy + 2); });
  });
};
LOOPS.moves.len = 12;
// face identities × key expressions (7 heads per row, one row per expression)
const FIDS = ['pip', 'classic', 'lady', 'beard', 'grandpa', 'kid', 'chrome'], FEX = ['neutral', 'joy', 'laugh', 'shocked', 'determined', 'smug', 'sad', 'sing'];
LOOPS.faceIds = t => {
  const ex = FEX[Math.floor(t)]; cam({ pos: [0, 4.7, 40], look: [0, 4.75, 0], fov: 9.6, blur: 0 }); studio('#efe7da');
  FIDS.forEach((id, i) => { const f = fig('fid' + i, { faceId: id, torso: i ? CROWD_TORSO[i] : COL.teal, legs: COL.navy, hat: id === 'pip' ? 'beanie' : id === 'chrome' ? null : 'hair', hatCol: COL.mustard,
    hairCol: [COL.brown, COL.brown, COL.dkorange, COL.black, COL.grey, COL.tan, COL.grey][i], skin: id === 'chrome' ? '#c9cdd0' : COL.yellow });
    put(pose(f, { face: ex }), (i - 3) * 1.75, 0, 0); });
  label(ex, FIDS.join(' · '));
};
LOOPS.faceIds.len = FEX.length;
// zone views: low aerial passes over the city, town, river, forest + farmland, at song time 150 s (sites half built)
const ZV = [['city: skyscrapers + cranes', [40, 40, -110], [130, 18, -230]], ['town: church + plaza', [-40, 26, 175], [-95, 4, 115]], ['river + bridge + boats', [-40, 22, -40], [-80, 0, -95]],
  ['forest + zoo edge', [-140, 30, 40], [-270, 0, -30]], ['farmland + tractor', [230, 30, 40], [300, 0, -60]], ['eggs: shoggoth, OFF switch, P(DOOM)', [90, 14, -70], [110, 4, -115]]];
LOOPS.zones = t => { const [n, p, l] = ZV[Math.floor(t)]; cam({ pos: p, look: l, fov: 38, blur: .2 }); look({ ...WORLD.LOOK.stage }); runShotTime = 150; label(n); };
LOOPS.zones.len = ZV.length; LOOPS.zones.world = true;
var runShotTime;
// official printed heads (LDraw 3626cp*): front row = front print, back row = the head spun 180° (2-sided prints)
LOOPS.heads = t => {
  const ids = window.HEAD_IDS, page = Math.floor(t), per = 9, set = ids.slice(page * per, page * per + per);
  cam({ pos: [0, 0, 60], look: [0, 0, 0], fov: 11, blur: 0 }); look({ sky: ['#ece6dc', '#f6f2ea', '#e4ddd2'], keyDir: [-.3, .6, 1], keyInt: 3, fill: .7 });
  set.forEach((id, i) => { for (const back of [0, 1]) { const h = keep('hd' + id + back, () => { const g = new THREE.Group(), m = part(id, COL.yellow); m.position.y = .6; g.add(m); return g; }); put(h, (i - 4) * 1.75, back ? -1.0 : 1.0, 0, back ? Math.PI : 0); } });
  label('printed heads ' + (page * per + 1) + '–' + (page * per + set.length), set.join(' '));
};
LOOPS.heads.len = 4;
window.HEAD_IDS=["3626cp01", "3626cp03", "3626cp04", "3626cp05", "3626cp0a", "3626cp0b", "3626cp0c", "3626cp70", "3626cp71", "3626cp72", "3626cp73", "3626cp76", "3626cp78", "3626cp7a", "3626cp7b", "3626cp7j", "3626cp7l", "3626cp7p", "3626cp7s", "3626cp80", "3626cp81", "3626cp83", "3626cp85", "3626cp87", "3626cp88", "3626cp8b", "3626cp8d", "3626cp8e", "3626cp8j", "3626cp8m", "3626cp8q", "3626cp8s", "3626cp8t", "3626cp7e", "3626cp7k", "3626cp75"];
