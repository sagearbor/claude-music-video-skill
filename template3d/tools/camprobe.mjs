// camprobe.mjs: print the rendered camera (position, fov) at given times: node tools/camprobe.mjs 138.03,138.07,138.11
import puppeteer from 'puppeteer-core';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--allow-file-access-from-files', '--use-angle=metal', '--ignore-gpu-blocklist'] });
const p = await b.newPage(); await p.goto(pathToFileURL(resolve('studio.html')).href + '?render'); await p.waitForFunction('window.ready === true', { timeout: 60000 });
for (const t of process.argv[2].split(',').map(Number)) {
  const r = await p.evaluate(async t => { await window.renderAt(t, 'image/jpeg', .1); const c = window.__cam; return [c.position.x, c.position.y, c.position.z, c.fov ?? 0, c.isOrthographicCamera ? 'ortho' : 'persp'].map(v => typeof v === 'number' ? +v.toFixed(2) : v); }, t);
  console.log(t.toFixed(3), JSON.stringify(r));
}
await b.close();
