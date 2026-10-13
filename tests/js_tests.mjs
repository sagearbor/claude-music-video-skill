// js_tests.mjs: pure-maths tests for the 3D engine (no browser): the camera spline, seam flights, the dance library.
// The functions are lifted out of src3d/*.js by name and evaluated in a vm sandbox with stub globals.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const root = new URL('../template3d/src3d/', import.meta.url);
const engine = readFileSync(new URL('engine.js', root), 'utf8'), motion = readFileSync(new URL('motion.js', root), 'utf8');
const lift = (src, name) => { const i = src.indexOf(`function ${name}(`); if (i < 0) throw new Error('no ' + name); let d = 0, j = src.indexOf(') {', i) + 2;   // the body brace (skip braces in default params)
  for (let k = j; k < src.length; k++) { if (src[k] === '{') d++; if (src[k] === '}' && --d === 0) return src.slice(i, k + 1); } };
const ctx = { Math, console, OFF: .266, BEAT: 60 / 94, THREE: { Color: class { constructor(h) { this.h = h; } lerp() { return this; } getHexString() { return '000000'; } } } };
vm.createContext(ctx);
vm.runInContext(`const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)); const lerp = (a, b, k) => a + (b - a) * k;
  const ease = k => { k = clamp(k); return k * k * (3 - 2 * k); }; const frac = x => x - Math.floor(x); const hash = i => frac(Math.sin(i * 127.1 + 311.7) * 43758.5453);
  ${['path', 'crSpline', 'smoother', 'mixVal', 'fly'].map(n => lift(engine, n)).join('\n')}
  globalThis.path = path; globalThis.fly = fly;`, ctx);
vm.runInContext(motion.replace(/Object\.assign\(window,.*\);/, 'globalThis.M = { walk, run, dance, DANCES, blend, crowdDance };'), ctx);
let fails = 0; const test = (name, fn) => { try { fn(); console.log('PASS', name); } catch (e) { fails++; console.log('FAIL', name, e.message); } };
const near = (a, b, e = 1e-6) => { if (Math.abs(a - b) > e) throw new Error(`${a} != ${b}`); };

test('path passes through its keys', () => { const keys = [[0, [0, 0, 0]], [1, [10, 2, 0]], [2, [10, 2, 10]], [3, [0, 5, 10]]];
  for (const [t, p] of keys.slice(1, -1)) { const q = ctx.path(t, keys, { easeEnds: false }); p.forEach((v, i) => near(q[i], v, 1e-9)); } });
test('path keeps moving through a key (no stop, unlike kf)', () => { const keys = [[0, [0, 0, 0]], [1, [10, 0, 0]], [2, [20, 0, 0]]];
  const v = (ctx.path(1.01, keys, { easeEnds: false })[0] - ctx.path(.99, keys, { easeEnds: false })[0]) / .02; if (v < 5) throw new Error('speed at key ' + v); });
test('default easing keeps every key on time', () => { const keys = [[0, [0, 0, 0]], [3, [9, 0, 0]], [6, [3, 4, 0]], [9, [0, 0, 7]]];
  for (const [t, p] of keys) { const q = ctx.path(t, keys); p.forEach((v, i) => near(q[i], v, 1e-9)); } });
test('path is continuous (no jumps between frames)', () => { const keys = [[0, [0, 0, 0]], [1.3, [8, 3, -2]], [2, [5, 9, 4]], [4, [-3, 1, 1]]]; let prev = ctx.path(0, keys);
  for (let t = 1 / 24; t <= 4; t += 1 / 24) { const p = ctx.path(t, keys); if (Math.hypot(p[0] - prev[0], p[1] - prev[1], p[2] - prev[2]) > 1) throw new Error('jump at ' + t); prev = p; } });
test('fly starts at A and ends at B (seam contract)', () => { const A = { pos: [0, 5, 20], look: [0, 3, 0], fov: 30 }, B = { pos: [200, 6, -20], look: [200, 4, -40], fov: 40 };
  const a = ctx.fly(10, 10, 12, A, B), b = ctx.fly(12, 10, 12, A, B); A.pos.forEach((v, i) => near(a.pos[i], v)); B.pos.forEach((v, i) => near(b.pos[i], v)); near(a.fov, 30); near(b.fov, 40);
  if (ctx.fly(11, 10, 12, A, B).pos[1] < 30) throw new Error('no arc'); });
test('dances are pure and beat-locked', () => { for (const n of Object.keys(ctx.M.DANCES)) { const a = ctx.M.dance(n, 31.4), b = ctx.M.dance(n, 31.4); if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(n);
    const one = ctx.M.dance(n, 31.4 + 4 * ctx.BEAT), per = n === 'sprinkler' || n === 'dab' || n === 'disco' || n === 'robot' || n === 'jump' || n === 'spin' ? null : one;   // most repeat every 4 beats
    if (per) for (const k of Object.keys(a)) if (typeof a[k] === 'number') near(a[k], per[k], 1e-6); } });
test('dab snaps to its pose within .2 beat of the downbeat', () => { const b0 = ctx.OFF + 8 * ctx.BEAT, p = ctx.M.dance('dab', b0 + .2 * ctx.BEAT); near(p.armR, 2.3, .05); });
test('walk legs counter-swing and stay in range', () => { for (let ph = 0; ph < 1; ph += .05) { const w = ctx.M.walk(ph); near(w.legL, -w.legR); if (Math.abs(w.legL) > .6 || w.bodyY < 0) throw new Error(ph); } });
test('unknown dance throws a helpful error', () => { try { ctx.M.dance('moonwalk', 1); throw new Error('no throw'); } catch (e) { if (!/unknown dance/.test(e.message)) throw e; } });
process.exit(fails ? 1 : 0);
