# Chapter guide (3D brick world): read fully before writing your chapter

You own ONE file: `scenes3d/<your chapter>.js` (a stub already exists and is already in `studio.html`).
**Never edit any other file**: not `src3d/*`, `world.js`, `country.js`, `design.js`, `studio.html` or another chapter.
If you need something shared, write it inside your own file (local helpers are fine) and mention it in your report.

## The look (approved at the design stop; see `out/design/*`)
- Brick-toy stop-motion world, bevelled LDraw parts (`part`, `build`, `growing`), plastic sheen, soft key light, DOF.
- Pip = `fig('pip', PIP)` with custom decal faces. Crowd = `fig('x' + i, crowdLook(i))`, official printed heads, 2-sided:
  a "back" face (fear, shocked, sad, angry, dizzy, x, determined) spins the head to its second print.
- Clawd = `clawd(key, {})` + `clawdPose(c, { face, hat: 'headset'|'keeper'|'reaper'|'halo', armL, armR, walk, bob, lean, roll, holdL, holdR })`.
- Motion: `walk(ph)`, `run(ph)`, `dance(name, t)` (bounce dab floss robot disco runningMan sprinkler headbang wave clap shrug jump spin sway),
  `crowdDance(i, t)`, `blend(a, b, k)`. Spread with `pose(f, { ...walk(t * 1.1), face: 'joy' })`. Smooth motion (24 fps) is the default.
- Faces for `pose(..., { face })`: neutral joy laugh fear determined smug suspicious shocked sing sleepy angry dizzy wink x star sad.
- Props: `heldPencil()`, `heldHandset()` (pass as holdR/holdL), `pencil`, `handset`, `pill`, `cage`, `gravestone`, `doorUnit/doorPose`,
  `scroll(k)` + `PAPER()`, `paperBird/birdPose`, `robot/robotPose`, `buildSite`, `field`, `passerby`, `tree`, `studGround`, `sign(key, lines, o)`.
- Easter eggs: `EGGS.<name>(key, t, x, z, ry)`: paperclipFactory halEye shoggoth captcha pdoomBoard parrot chromeBot clipAssistant
  basilisk offSwitch gpuMine daisyBell billboard(key, t, x, z, ry, lines). Place YOUR assigned eggs inside your district, visible
  for at least ~1.5 s in passing (pausing viewers should find them; don't make them the subject of a shot).

## The rules
1. **Pure function of song time.** Build geometry once with `keep(key, () => ...)`, then every frame `put()` it and set EVERY
   transform/pose you care about. `put()` overwrites position/rotation/scale: wrap tilted meshes in a Group.
2. **One continuous camera, no cuts, anywhere.** Use `path(t, keys)` (Catmull-Rom; never `kf` for the camera: it stops at
   every key). Add `drift(lt, k)` for life. Shots only organise action; the camera path is continuous across your shot boundaries.
3. **Seams** (`scenes3d/world.js`): at the start and end of your range, call `WORLD.apply(WORLD.flight(id, t))` for the seam
   flight's span on YOUR side. At the flight's end point your own path must start exactly at `WORLD.F[id].B` (incoming), or
   your path must reach `WORLD.F[id].A` exactly at `F[id].t0` (outgoing). For drops (F0, Fz, Fb) add `WORLD.landing(t, tDrop)`:
   its `shake` on the camera and its `flash` as a `hud()` white rectangle.
4. **Your district**: register `district('<name>', { at: WORLD.D.<name>, r: 60 }, t => {...})` for the set + ambient life
   (robots building, people strolling, eggs). Use `WORLD.at(name, dx, dy, dz)` for positions. The stage district belongs to
   c02; chapters using the stage add extras gated by time (`if (t < a || t > b) return;`) in their own `district('stage-cNN', ...)`.
   Chapters on the moon: the moon is at `y = WORLD.MOON_Y`.
5. **Look**: call `look({ ...WORLD.LOOK.<preset>, ... })` every frame of your shots (sky gradient, key light). The presets follow the palette arc.
6. **One idea per lyric line, acted by characters**, big on screen (minifigs ≥ ~1/4 of frame height in hero moments).
   Hits on `bt(k)` or half-beats; check real hits with the lyric times in `src/lyrics.js`. Keep action above y ≈ 920 px
   (the karaoke bar). Screen text: at most one or two painted words, once (`sign` or `hud`).
7. **Background life in every frame**: something moves behind the action (robots, walkers, flowing river, cranes).
8. **Performance**: stay under ~80 ms/frame in the sheets' `ms/frame` (the bake-off shot is ~36 ms). Don't create geometry per frame
   except tiny things (e.g. the scroll); use `keep`.

## Review loop (contact sheets ONLY into out/check/<chapter>_*.jpg; never out/frames, never MP4s)
```
node render.mjs --sheet=a,b,c,... --cols=4 --w=480 --out=out/check/cNN_a.jpg        # look at it with the Read tool
node render.mjs --strip=a:b --cols=6 --w=320 --out=out/check/cNN_strip.jpg         # every frame: motion check
```
Do **at least 2 review passes** (framing, readability, seams at your boundaries ±0.04 s and ±0.3 s, karaoke clear, nothing
static, no geometry popping in), then report: shot list with times, eggs placed, seam checks done, ms/frame, known weaknesses.
