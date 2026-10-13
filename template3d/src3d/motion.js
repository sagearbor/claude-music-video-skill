// motion.js: natural gaits and a beat-synced dance library for minifigs. All return pose objects for pose(fig, ...),
// so they mix with anything: pose(f, { ...dance('dab', t), face: 'joy' }).
//   walk(ph, o) / run(ph, o)     ph = cycles (e.g. t * 1.1). Hip sway, a double bounce, arm lag, head steadying.
//   dance(name, t, o)            locked to the song's beat grid (OFF + k*BEAT). o.offset shifts by beats; o.side flips.
//   DANCES                       the move names: bounce, dab, floss, robot, disco, runningMan, sprinkler, headbang, wave,
//                                clap, shrug, jump, spin, sway
//   blend(a, b, k)               mix two poses (numbers lerp; faces/held props switch at k = .5)
//   crowdDance(i, t)             a varied dance for crowd member i (different move + offset per person)
// INTERACTIONS (one thing acting on another: kicks, hand-overs, pushes, writing) must physically meet. Use these + expect():
//   stepTo(t, plan, o)           walk/run a figure along timed waypoints plan = [[t, [x, z]], ...]: returns { x, z, ry, pose }
//                                with the walk phase driven by distance travelled (no foot sliding); stands still between legs
//   kickAt(t, tHit, target, o)   where to stand + the pose so the RIGHT FOOT touches target [x,y,z] exactly at tHit
//                                (o.from: [x, z] where the kicker comes from; walks in over o.lead s). Returns { x, z, ry, pose }
//   handoff(t, t0, t1, from, to) a prop's world position travelling from point `from` to `to` (e.g. two limb() hands) over
//                                [t0, t1] on a small arc; before t0 = from, after t1 = to. Pair it with expect() on both hands.
// Smooth by default (24 fps). For the stop-motion "on twos" feel, pass st(t) instead of t.
const TAU = Math.PI * 2;
const sn = x => Math.sin(x * TAU), cs = x => Math.cos(x * TAU);
const snap = (x, k = .18) => { const f = x - Math.floor(x); return Math.floor(x) + ease(Math.min(1, f / k)); };   // hit a pose fast, then hold

function walk(ph, o = {}) {
  const a = o.stride ?? .55, s = sn(ph), lag = sn(ph - .07);
  return { legL: a * s, legR: -a * s, armL: -.5 * a / .55 * lag + (o.armL ?? 0), armR: .5 * a / .55 * lag + (o.armR ?? 0),
    bodyY: .11 * (1 - Math.abs(s)), bodyRoll: .045 * s, twist: -.09 * s, lean: .05 + (o.lean ?? 0),
    headRoll: -.03 * s, headTilt: -.04 * (1 - Math.abs(s)), head: o.head ?? 0 };
}
function run(ph, o = {}) {
  const s = sn(ph), lag = sn(ph - .06);
  return { legL: 1.0 * s, legR: -1.0 * s, armL: -1.1 * lag + .35, armR: 1.1 * lag + .35, armLz: .15, armRz: .15,
    bodyY: .38 * Math.abs(cs(ph)), bodyRoll: .06 * s, twist: -.16 * s, lean: .22, headTilt: -.12, head: o.head ?? 0 };
}
function blend(a, b, k) {
  const out = {};
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[key], y = b[key];
    out[key] = typeof x === 'number' || typeof y === 'number' ? lerp(x ?? 0, y ?? 0, k) : (k < .5 ? x ?? y : y ?? x);
  }
  return out;
}

const DANCES = {
  // a hop on every beat, arms pumping
  bounce: b => { const p = Math.exp(-frac(b) * 5); return { bodyY: .32 * Math.abs(Math.sin(Math.PI * b)), armL: .5 + .7 * p, armR: .5 + .7 * p, headTilt: -.15 * p, bodyRoll: .05 * sn(b / 2) }; },
  // snap into a dab on the beat, alternate sides every 2 beats
  dab: (b, o) => { const n = Math.floor(b / 2), side = (n % 2 ? -1 : 1) * (o.side || 1), k = ease(Math.min(1, frac(b / 2) * 2 / .32));
    const R = { armR: 2.3, armRz: 1.1, armL: 1.7, armLz: -.75, head: -.45, headTilt: .45, lean: .18, bodyRoll: -.08 },
      L = { armL: 2.3, armLz: 1.1, armR: 1.7, armRz: -.75, head: .45, headTilt: .45, lean: .18, bodyRoll: .08 };
    return blend(side > 0 ? L : R, side > 0 ? R : L, k); },   // from the previous side's dab, never from rest (no pop)
  // arms swing side to side together while the hips go the other way, twice a beat
  floss: b => { const s = sn(b), h = sn(b + .25); return { armL: .35, armR: .35, armLz: .65 * s, armRz: -.65 * s, twist: .25 * h, bodyRoll: -.12 * s, bodyY: .05 * Math.abs(s) }; },
  // staccato: every half beat a new rigid pose, blended from the previous one
  robot: b => { const q = Math.floor(b * 2), r = k => hash(q * 13 + k) - .5, rp = k => hash((q - 1) * 13 + k) - .5, e = ease(Math.min(1, frac(b * 2) / .35));
    const m = (k, a) => lerp(rp(k), r(k), e) * a;
    return { armL: 1.57 + m(1, 1.4), armR: 1.57 + m(2, 1.4), armLz: .2, armRz: .2, twist: m(3, .8), head: m(4, 1.0), headTilt: m(5, .3), lean: .05, face: 'neutral' }; },
  // the disco point: up-out on one beat, down-across on the next (each blends from the other)
  disco: b => { const up = Math.floor(b) % 2 === 0, k = ease(Math.min(1, frac(b) / .3));
    const U = { armR: 2.7, armRz: .55, head: -.3, headTilt: -.2, bodyRoll: -.1 }, D = { armR: .4, armRz: -.5, head: .3, headTilt: .25, bodyRoll: .1 };
    return blend(up ? D : U, up ? U : D, k); },
  // the running man: legs alternate kick/slide each half beat, arms pump
  runningMan: b => { const s = sn(b / 2); return { legL: .7 * s, legR: -.7 * s, armL: .9 - .6 * s, armR: .9 + .6 * s, bodyY: .18 * Math.abs(sn(b)), lean: .08 }; },
  // the sprinkler: hand behind head, the other arm ratchets across in 3 steps then whips back (4 beats)
  sprinkler: b => { const ph = frac(b / 4), step = ph < .75 ? Math.floor(ph * 4) : 3 - (ph - .75) * 12; return { armL: 2.7, armLz: -.35, armR: 1.57, twist: -.5 + Math.min(3, step) * .33, head: -.2 + Math.min(3, step) * .15, bodyY: .06 * Math.abs(sn(b)) }; },
  headbang: b => { const p = Math.exp(-frac(b) * 4); return { headTilt: .55 * p - .1, lean: .25 * p, armL: 2.6, armR: 2.6, armLz: .3, armRz: .3, bodyY: -.05 * p }; },
  wave: b => ({ armR: 2.6, armRz: .4 + .35 * sn(b), armL: .2, head: .1 * sn(b), bodyRoll: .04 * sn(b) }),
  clap: b => { const k = Math.exp(-frac(b) * 7); return { armL: 1.2, armR: 1.2, armLz: -.45 + .55 * (1 - k), armRz: -.45 + .55 * (1 - k), bodyY: .05 * k }; },
  shrug: b => { const k = Math.sin(Math.PI * clamp(frac(b / 2) * 2)); return { armL: .5 * k, armR: .5 * k, armLz: .9 * k, armRz: .9 * k, headRoll: .2 * k, bodyY: .1 * k }; },
  jump: b => { const ph = frac(b / 2), h = Math.max(0, Math.sin(Math.PI * clamp(ph * 1.6))); return { bodyY: 1.4 * h, armL: .3 + 2.4 * h, armR: .3 + 2.4 * h, legL: .3 * h, legR: -.3 * h }; },
  spin: b => ({ bodyYaw: TAU * ease(frac(b / 2)), armL: 1.2, armR: 1.2, armLz: .9, armRz: .9 }),
  sway: b => ({ bodyRoll: .1 * sn(b / 2), head: .2 * sn(b / 2), armL: .4 + .2 * sn(b / 2), armR: .4 - .2 * sn(b / 2) }),
};
function dance(name, t, o = {}) {
  const b = (t - OFF) / BEAT + (o.offset || 0), f = DANCES[name];
  if (!f) throw new Error('unknown dance: ' + name + ' (have ' + Object.keys(DANCES).join(', ') + ')');
  const p = f(b, o);
  if (o.side === -1) { const m = { ...p }; for (const [a, c] of [['armL', 'armR'], ['armLz', 'armRz'], ['legL', 'legR']]) { m[a] = p[c]; m[c] = p[a]; }
    for (const k of ['head', 'twist', 'bodyRoll', 'headRoll', 'bodyYaw']) if (m[k] != null) m[k] = -m[k]; return m; }
  return p;
}
const CROWD_MOVES = ['bounce', 'floss', 'disco', 'dab', 'runningMan', 'robot', 'clap', 'headbang', 'sprinkler', 'wave'];
function crowdDance(i, t, moves = CROWD_MOVES) { return { ...dance(moves[i % moves.length], t, { offset: (i % 3) * .5, side: i % 2 ? -1 : 1 }), face: ['joy', 'sing', 'wink', 'star'][i % 4] }; }

const STRIDE = 2.2;   // studs per walk cycle (2 steps): phase = distance / STRIDE keeps the feet planted
function stepTo(t, plan, o = {}) {
  const pts = plan, n = pts.length; let dist = 0, x = pts[0][1][0], z = pts[0][1][1], ry = o.ry0 ?? 0, amp = 0;
  for (let i = 1; i < n; i++) {
    const [t0, a] = pts[i - 1], [t1, b] = pts[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (t <= t0) break;
    // stride grows with speed so the cadence never passes ~3 cycles/s (faster than that, legs flip between frames)
    const stride = Math.max(STRIDE, L / (t1 - t0) / 3 * 1.5), u = Math.min(1, (t - t0) / (t1 - t0)), k = ease(u); dist += L * k * STRIDE / stride; x = lerp(a[0], b[0], k); z = lerp(a[1], b[1], k);
    if (L > .01) ry = Math.atan2(b[0] - a[0], b[1] - a[1]);
    amp = t < t1 && L > .01 ? Math.min(1, u / .2, (1 - u) / .2) : 0;   // the stride grows and settles with the speed (no snap to rest)
  }
  if (amp === 0 && o.face != null) ry = o.face;
  const gait = (o.run ? run : walk)(dist / STRIDE * (o.run ? .8 : 1));
  return { x, z, ry, pose: amp > 0 ? blend({ legL: 0, legR: 0, armL: 0, armR: 0, bodyY: 0, lean: 0, twist: 0, bodyRoll: 0 }, gait, amp) : {} };
}
// Measured with limb() at full kick (legR 1.4): the right toe sits 1.317 studs in front of the feet point, .525 to the figure's
// right (local x -.525) and 1.68 up. kickStand() puts the kicker so that toe lands on the target.
const KICK_FOOT = [-.525, 1.68, 1.317], KICK_REACH = 1.317;
function kickStand(target, ry) { const c = Math.cos(ry), s = Math.sin(ry); return [target[0] - (KICK_FOOT[0] * c + KICK_FOOT[2] * s), target[2] - (-KICK_FOOT[0] * s + KICK_FOOT[2] * c)]; }
function kickPose(u) {   // u: seconds relative to the hit: wind-up before, strike at 0, recover after
  const wind = Math.max(0, Math.min(1, (u + .3) / .2)), strike = u < -.1 ? 0 : u <= 0 ? ease((u + .1) / .1) : 1 - ease(Math.min(1, u / .35));
  return { legR: -.5 * wind * (1 - strike) + 1.4 * strike, armL: .7 * strike, armR: -.5 * strike, lean: -.18 * strike };
}
function kickAt(t, tHit, target, o = {}) {
  const from = o.from || [target[0], target[2] + 6], dir = o.face ?? Math.atan2(target[0] - from[0], target[2] - from[1]);
  const [sx, sz] = kickStand(target, dir), lead = o.lead ?? 1.0;
  const s = stepTo(t, [[tHit - lead - .4, from], [tHit - .4, [sx, sz]]], { face: dir, run: o.run });
  return { ...s, pose: { ...s.pose, ...(t > tHit - .45 && t < tHit + .6 ? kickPose(t - tHit) : {}) } };
}
function handoff(t, t0, t1, from, to, arc = .6) {
  const k = ease(Math.min(1, Math.max(0, (t - t0) / (t1 - t0)))); return [lerp(from[0], to[0], k), lerp(from[1], to[1], k) + Math.sin(Math.PI * k) * arc, lerp(from[2], to[2], k)];
}
Object.assign(window, { walk, run, dance, DANCES, blend, crowdDance, snap, stepTo, kickAt, kickPose, kickStand, KICK_FOOT, KICK_REACH, handoff, STRIDE });
