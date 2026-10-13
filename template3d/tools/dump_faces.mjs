// dump_faces.mjs: export every face decal (minifig faces with/without glasses, Clawd screen faces) as PNGs, so another
// renderer (Blender) or a design sheet can use the exact same faces.   node tools/dump_faces.mjs [outDir=out/faces]
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const out = process.argv[2] || 'out/faces'; mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true,
  args: ['--allow-file-access-from-files', '--use-angle=metal', '--ignore-gpu-blocklist'] });
const page = await browser.newPage();
await page.goto(pathToFileURL(resolve('studio.html')).href + '?render', { waitUntil: 'networkidle0' });
await page.waitForFunction('window.ready === true', { timeout: 60000 });
const faces = await page.evaluate(() => {
  const r = {};
  for (const n of Object.keys(FACES)) { r[`fig_${n}`] = faceTexture(n, false).image.toDataURL(); r[`figg_${n}`] = faceTexture(n, true).image.toDataURL(); }
  for (const n of ['neutral', 'joy', 'smug', 'shocked', 'dizzy', 'suspicious', 'sleepy', 'x', 'fear', 'glitch']) r[`clawd_${n}`] = window.clawdFaceTex ? clawdFaceTex(n).image.toDataURL() : null;
  return r;
});
for (const [k, url] of Object.entries(faces)) if (url) writeFileSync(`${out}/${k}.png`, Buffer.from(url.split(',')[1], 'base64'));
console.log(`${Object.keys(faces).length} faces → ${out}`);
await browser.close();
