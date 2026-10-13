// continuity.mjs: the continuity linter. Simulates EVERY frame of a range without rendering (fast) and reports:
//   TELEPORT   an on-screen actor (a figure, Clawd, or ANY cached prop) makes a SPIKE move: more than --jump studs in one
//              frame AND 4x more than in the frames around it (so fast-but-smooth motion, like a thrown cage, passes)
//   SNAP       the same spike test for a joint angle (--snap radians)
//   UNDERGROUND a figure on screen with its feet below the floor while its legs are straight (rising through solid floor)
//   CONTACT    a failed expect(...) contact assertion (e.g. the kicking foot never reaches the door)
//   POP        an actor vanishes or appears while on screen (costume swaps, shot-boundary resets). Review each one: intended
//              pop-ups are fine; a character silently replaced by a costume twin (Pip -> panda Pip) is not.
// Sparse contact sheets can't see a 1-frame pop; this can. Exit code 1 if anything is found.
//   node tools/continuity.mjs --range=35.66:76.83 [--jump=1.0] [--snap=1.1] [--fps=24] [--json=out/check/c03_continuity.json]
import puppeteer from 'puppeteer-core';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const [a, b] = String(args.range || '0:10').split(':').map(Number), fps = +(args.fps || 24), JUMP = +(args.jump || 1.0), SNAP = +(args.snap || 1.1);
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, protocolTimeout: 0, args: ['--allow-file-access-from-files', '--use-angle=metal', '--ignore-gpu-blocklist'] });
const page = await browser.newPage();
// a scene file that fails to parse or throws is silently skipped by the page: the lint would look "clean" with that
// chapter missing. Any page error fails the run.
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(e.message));
page.on('console', m => { if (m.type() === 'error') pageErrors.push(m.text()); });
page.on('requestfailed', r => pageErrors.push('failed to load ' + r.url()));
await page.goto(pathToFileURL(resolve('studio.html')).href + '?render', { waitUntil: 'networkidle0' });
await page.waitForFunction('window.ready === true', { timeout: 60000 });
const times = []; for (let i = Math.round(a * fps); i <= Math.round(b * fps); i++) times.push(i / fps);
const frames = await page.evaluate(ts => ts.map(t => window.simulateAt(t)), times);
if (pageErrors.length) { console.log('PAGE ERRORS (the lint is not valid until these are fixed):\n  ' + [...new Set(pageErrors)].join('\n  ')); await browser.close(); process.exit(2); }
await browser.close();

const issues = [], maps = frames.map(f => new Map(f.actors.map(x => [x.id, x])));
const step = (i, id, g) => { const a = maps[i - 1]?.get(id), b = maps[i]?.get(id); return a && b ? g(a, b) : 0; };
const inPlace = (x, list) => x.id.startsWith('obj:') && list.some(y => y.id !== x.id && y.id.startsWith('obj:') && Math.hypot(y.p[0] - x.p[0], y.p[1] - x.p[1], y.p[2] - x.p[2]) < .2);
const dpos = (a, b) => Math.hypot(b.p[0] - a.p[0], b.p[1] - a.p[1], b.p[2] - a.p[2]);
for (let i = 1; i < frames.length; i++) {
  const prev = maps[i - 1], f = frames[i];
  for (const x of f.actors) {
    const p = prev.get(x.id);
    if (!p) { if (x.on && i > 1 && (x.sc ?? 1) > .3 && !inPlace(x, frames[i - 1].actors)) issues.push({ kind: 'POP', t: f.t, id: x.id + ' appears', size: 0 }); continue; }   // growing in from ~0 is smooth, not a pop
    if (x.on && x.sink < -.4 && x.straight) issues.push({ kind: 'UNDERGROUND', t: f.t, id: x.id, size: x.sink });
    if (!(x.on && p.on)) continue;   // a jump is only visible if the actor is on screen on both sides
    const d = dpos(p, x), around = Math.max(step(i - 1, x.id, dpos), step(i + 1, x.id, dpos), .05);
    if (d > JUMP && d > 4 * around) issues.push({ kind: 'TELEPORT', t: f.t, id: x.id, size: +d.toFixed(2), from: p.p, to: x.p });
    for (const [k, v] of Object.entries(x.joints)) { if (p.joints[k] == null) continue; const dj = Math.abs(v - p.joints[k]);
      const aj = Math.max(step(i - 1, x.id, (a, b) => Math.abs((b.joints[k] ?? 0) - (a.joints[k] ?? 0))), step(i + 1, x.id, (a, b) => Math.abs((b.joints[k] ?? 0) - (a.joints[k] ?? 0))), .05);
      if (dj > SNAP && dj > 3 * aj) issues.push({ kind: 'SNAP', t: f.t, id: x.id, joint: k, size: +dj.toFixed(2) }); }
  }
  const now = new Set(f.actors.map(x => x.id));
  // (inPlace: a PROP replaced in place by another prop, e.g. a sign whose text changed, is a texture change, not a pop)
  for (const p of frames[i - 1].actors) if (p.on && (p.sc ?? 1) > .3 && !now.has(p.id) && !inPlace(p, f.actors)) issues.push({ kind: 'POP', t: f.t, id: p.id + ' vanishes', size: 0 });
  for (const e of f.expects) if (!e.ok) issues.push({ kind: 'CONTACT', t: f.t, id: e.name, size: e.d, max: e.maxDist });
}
// merge runs of the same issue on consecutive frames into one event
const events = [];
for (const it of issues) { const last = events.findLast(e => e.kind === it.kind && e.id === it.id && (e.joint || '') === (it.joint || '') && it.t - e.t1 <= 1.5 / fps);
  if (last) { last.t1 = it.t; last.frames++; last.size = Math.max(last.size, it.size); } else events.push({ ...it, t0: it.t, t1: it.t, frames: 1 }); }
for (const e of events) console.log(`${e.kind.padEnd(8)} ${e.t0.toFixed(3)}${e.frames > 1 ? '–' + e.t1.toFixed(3) : ''}  ${e.id}${e.joint ? ' ' + e.joint : ''}  ${e.kind === 'CONTACT' ? 'distance ' + e.size + ' > ' + e.max : e.kind === 'TELEPORT' ? e.size + ' studs in one frame' : e.kind === 'POP' ? '(review: intended?)' : e.kind === 'UNDERGROUND' ? 'feet ' + (-e.size) + ' below the floor' : e.size + ' rad in one frame'}`);
const bad = events.filter(e => e.kind !== 'POP');
console.log(`continuity ${a}–${b} s: ${frames.length} frames, ${bad.length} problem(s), ${events.length - bad.length} pop(s) to review` + (bad.length ? '' : ' — clean'));
if (args.json) writeFileSync(args.json, JSON.stringify(events, null, 1));
process.exit(bad.length ? 1 : 0);
