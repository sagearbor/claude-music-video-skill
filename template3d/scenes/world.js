// world.js: the ONE brick world (orchestrator-owned; chapter agents read it, never edit it).
//   WORLD.D.<name>      district centre [x, z]
//   WORLD.LOOK.<name>   a look() preset: sky gradient, key light, fill, exposure, fog
//   WORLD.F.<id>        seam flights { t0, t1, A, B }: A = the outgoing chapter's camera at t0, B = the incoming one's at t1
//   WORLD.flight(id, t) → a view for cam(...) + look(...) during [t0, t1]. BOTH chapters call it on their side of the seam:
//     outgoing chapter: from F.t0 to the seam time; incoming chapter: from the seam time to F.t1.
//   WORLD.at(name, dx, dy, dz) → world position relative to a district centre.
// NO HARD CUTS, anywhere: the camera path is continuous for the whole song (one take). Inside a chapter, keep one camera
// path (path() over the chapter, never kf for the camera: kf stops at every key); shots only organise the action.
// Drops ARRIVE ON THE DOWNBEAT: Fz, Fb glide in smoothly; F0 (chorus 1, the biggest boom) whips in. Punch: action + landing bump.
const D = { desk: [0, 150], stage: [0, 0], zoo: [-200, -20], doom: [-220, -200], bliss: [0, -280], roast: [220, -200], farm: [220, -20], moon: [0, 900] };
const MOON_Y = 300;   // the moon district floats high above the world (reached by rocket)
const at = (n, dx = 0, dy = 0, dz = 0) => [D[n][0] + dx, (n === 'moon' ? MOON_Y : 0) + dy, D[n][1] + dz];

const LOOK = {
  menu:   { sky: ['#bfe3d6', '#e7ddf2', '#dcefe6'], keyCol: '#fff4e8', keyInt: 3.0, fill: .6, exposure: 1.0 },
  stage:  { sky: ['#4f8fd8', '#d6e8f6', '#cfe6c0'], keyCol: '#fff1dc', keyInt: 3.2, fill: .5, exposure: 1.0 },
  stage2: { sky: ['#3b5fc4', '#f0c8e8', '#cfe6c0'], keyCol: '#ffe6d0', keyInt: 3.2, fill: .5, exposure: 1.0 },      // chorus 2: dusk, fireworks
  sunrise:{ sky: ['#f6a65a', '#ffe0a8', '#e8c890'], keyCol: '#ffd9a0', keyInt: 3.4, fill: .55, exposure: 1.02, keyDir: [-.9, .45, .4] },
  zoo:    { sky: ['#0d1a3a', '#24506a', '#1a2a3a'], keyCol: '#9fc0ff', keyInt: 1.6, fill: .35, exposure: 1.0, keyDir: [.4, 1, .3] },
  doom:   { sky: ['#3a0d14', '#e8603a', '#4a1a1a'], keyCol: '#ffb08a', keyInt: 3.0, fill: .4, exposure: 1.0, keyDir: [.7, .8, .4] },
  bliss:  { sky: ['#f6a6c8', '#ffe8f2', '#fbd0e0'], keyCol: '#fff0f6', keyInt: 2.8, fill: .75, exposure: 1.05 },
  roast:  { sky: ['#1a0f2a', '#4a2a6a', '#1a1020'], keyCol: '#ffe9c0', keyInt: 3.6, fill: .3, exposure: 1.0, keyDir: [0, 1, .5] },
  farm:   { sky: ['#5fa0d8', '#f3e2b0', '#c8b070'], keyCol: '#ffe2b0', keyInt: 3.4, fill: .55, exposure: 1.0, keyDir: [-.8, .7, .5] },
  moon:   { sky: ['#05060f', '#1c2240', '#0a0c18'], keyCol: '#e6ecff', keyInt: 3.4, fill: .3, exposure: 1.0, keyDir: [.6, .7, .5] },
  final:  { sky: ['#1a1440', '#f2b85a', '#2a2040'], keyCol: '#ffd88a', keyInt: 3.6, fill: .45, exposure: 1.05, keyDir: [-.7, .6, .6] },
  night:  { sky: ['#0a0f24', '#1c2c4a', '#101626'], keyCol: '#ffd8a0', keyInt: 2.2, fill: .3, exposure: 1.0, keyDir: [.3, 1, .6] },
};
const view = (n, pos, lookAt, fov, lk) => ({ pos: at(n, ...pos), look: at(n, ...lookAt), fov, ...LOOK[lk] });

// Seam flights. Times are seconds of song time.
const F = {
  // drops: smooth glides that arrive on the drop beat (t1 = the drop); the incoming chapter adds the bump + flash on landing
  F0: { t0: 24.30, t1: 25.69, whip: true,   // chorus 1 is the biggest boom: a whip that arrives at full speed
    A: view('stage', [-24, 9, 46], [-6, 5, -6], 34, 'menu'), B: view('stage', [-2, 6, 28], [-2, 4, -4], 32, 'stage') },
  Fz: { t0: 74.40, t1: 76.83, A: view('zoo', [0, 14, 30], [0, 8, 0], 36, 'zoo'), B: view('stage', [0, 6, 30], [0, 4, -4], 34, 'stage2') },
  Fb: { t0: 135.70, t1: 138.11, A: view('bliss', [0, 12, 26], [0, 10, 0], 36, 'bliss'), B: view('stage', [0, 6, 30], [0, 4, -4], 34, 'sunrise') },
  F1: { t0: 35.10, t1: 37.10, A: view('stage', [0, 14, 26], [3, 14, 0], 38, 'stage'), B: view('zoo', [0, 6, 26], [0, 4, 0], 34, 'zoo') },
  F2: { t0: 95.60, t1: 97.60, A: view('stage', [0, 12, 30], [0, 8, 0], 40, 'stage2'), B: view('doom', [0, 7, 24], [0, 4, 0], 34, 'doom') },
  F3: { t0: 116.60, t1: 118.60, A: view('doom', [0, 10, 26], [0, 6, 0], 36, 'doom'), B: view('bliss', [0, 6, 24], [0, 4, 0], 34, 'bliss') },
  F4: { t0: 167.55, t1: 169.35, A: view('roast', [0, 10, 26], [0, 6, 0], 36, 'roast'), B: view('farm', [0, 7, 28], [0, 4, 0], 34, 'farm') },
  F5: { t0: 187.90, t1: 190.70, A: view('farm', [0, 30, 20], [0, 60, -10], 40, 'farm'), B: view('moon', [0, 8, 30], [0, 4, 0], 36, 'moon') },
  Fm: { t0: 214.30, t1: 215.60, A: view('moon', [8, 8, 28], [0, 4, 0], 34, 'moon'), B: view('moon', [-4, 6, 22], [0, 4.5, 0], 34, 'moon') },   // c09 → c10, same district
  F6: { t0: 248.40, t1: 250.60, A: view('moon', [0, 20, 40], [0, 30, 0], 40, 'final'), B: view('desk', [0, 6, 22], [0, 4, 0], 32, 'night') },
};
function flight(id, t) {
  const f = F[id];
  if (f.whip) return fly(t, f.t0, f.t1, f.A, f.B, { arc: 6, ease: k => k * k * k });   // accelerates INTO the beat; the landing bump stops it
  return fly(t, f.t0, f.t1, f.A, f.B, { arc: id === 'F5' ? 160 : id === 'Fm' ? 0 : undefined });   // Fm: same district, no hop
}
// landing(t, tDrop): the hit at a drop: { shake: [dx, dy, dz] (a short camera bump), flash: 0..1 (a .15 s white flash) }
function landing(t, tDrop) { const u = t - tDrop; if (u < 0 || u > .6) return { shake: [0, 0, 0], flash: 0 }; return { shake: shake(t, .45 * Math.exp(-u * 9)), flash: .7 * Math.max(0, 1 - u / .15) }; }
// apply(viewObject): shorthand for cam(v) + look(v) (cam/look accept the same keys; extra keys are ignored)
function apply(v) { cam({ pos: v.pos, look: v.look, fov: v.fov }); look(Object.fromEntries(Object.entries(v).filter(([k]) => !['pos', 'look', 'fov'].includes(k)))); }

window.WORLD = { D, MOON_Y, at, LOOK, F, flight, landing, apply, view };
