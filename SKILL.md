---
name: music-video
description: Make a full-length music video for a song, drawn entirely from CODE (2D: p5.js + p5.brush painted cartoon; 3D: a Three.js brick-toy stop-motion world built from LDraw parts; headless Chrome, ffmpeg for audio), with no AI image/video generation and no API spend beyond the Claude plan. Lyric-driven storyboard, phase-fitted beat grid, karaoke captions, a 30-second pilot gate, then chapters built in parallel by sub-agents. Use when asked to make, animate or storyboard a music video, lyric video or beat-synced animation, in ANY repo.
metadata:
  author: Sage Arbor
---

# music-video

## Subcommands (check these first)
| Invocation | Do this |
|---|---|
| `/music-video help`, `/music-video` with no song, or "how do I use this?" | Print the **Help** block below verbatim, then check prerequisites (`node -v`, `ffmpeg -version`, `uv --version`, Chrome present; for 3D also `blender --version`, optional) and report each as ✅/❌ with the install command. Stop; don't start a video. |
| `/music-video lessons` | Print `LESSONS.md` (the newest entry in full, older entries as headings only). |
| `/music-video <song file> [lyrics.srt] [flags] [notes]` | Parse the **Flags** below, say which gates are on in one line, then run the pipeline. |

**Help**
```
/music-video: turn a song into a hand-painted, beat-synced cartoon music video drawn entirely in code.

USAGE
  /music-video ~/Downloads/song.mp3                     Suno files with embedded lyrics need nothing else
  /music-video ~/Downloads/song.mp3 lyrics.srt          other songs: give timed lyrics (.srt)
  /music-video song.mp3 "noir style, cat detective"     optional creative direction
  /music-video help | lessons

FLAGS (default: stop at storyboard AND pilot for your approval)
  --skip=storyboard        don't wait on the storyboard; still wait on the pilot
  --skip=pilot             wait on the storyboard; don't wait on the pilot
  --skip=all  (or --auto)  no stops: song in, finished MP4 out, fully agentic
  --design                 MORE planning: adds a design stage (character model
                           sheets, palette swatches, one style frame per chapter)
                           and stops so you can iterate on the look before any
                           animation. Combine: --design --skip=pilot
                           (3D: turnaround + expression sheets, a motion test
                           clip, one lit set, a world map and zone views)
  --engine=2d|3d           2d (default): hand-painted p5.brush cartoon.
                           3d: a brick-toy stop-motion world (minifig-style
                           people, plastic sheen, soft light, shallow focus),
                           ONE continuous world the camera flies through, with
                           a flat dial that squashes 3D into a 2D cut-out.
  Skipped gates are not skipped work: the artifact is still made and self-reviewed,
  and the choices it made are listed in DECISIONS.md for you to read afterwards.

WHAT HAPPENS (about 1.5–2 h with stops; about 45–60 min with --auto)
  1. Analyses the song: tempo, drops, sections, lyric timing
  2. Writes STORYBOARD.md and STOPS for your approval        (unless --skip)
  2b. With --design: model sheets + style frames, STOPS to iterate
  3. Builds a 30 s pilot clip and STOPS so you can watch it   (unless --skip)
  4. Builds the rest in parallel (sub-agents), checks every scene change
  5. Renders out/<song>_full.mp4 (1080p, H.264 + AAC), ready for YouTube

NEEDS   Node 20+, Google Chrome, ffmpeg, uv  (Mac: brew install node ffmpeg uv)
        3d also downloads the LDraw parts library (CC BY 4.0, 146 MB, once);
        Blender is optional (brew install --cask blender): it bevels the bricks
COST    no API spend; uses your Claude plan (a full song is a sizeable chunk of usage)
OUTPUT  a project folder (default ~/PROJECTS/<song>-video/), outside any repo
AFTER   "add today's lessons to the music-video skill" makes the next video better
```

The finished example is the zoo2 video ("Please Select Your Ending", 4:30): about 100 shots, built in about 1 h 40 m wall clock.
`examples/zoo2/` has its storyboard, every chapter file and the making-of with timeline, tokens and cost. **Read
`LESSONS.md` before starting**: it is the improvement log, and it overrides anything here that it contradicts.

## Why code, not generation
Image models (Deforum, SDXL-Turbo img2img, etc.) re-guess every frame, which gives flicker, melting faces and bad hands.
Attempt 1 of zoo2 did that overnight and was rejected. Code-drawn frames are pure functions of song time:
smooth, on model and exactly on the beat. Cloud video models (Kling, Seedance, Veo) are the other route, at about $70–300 a song.

## Flags and gates
`--engine=3d` (or "3D", "brick", "stop-motion", "minifig" in plain words) switches to the 3D engine: follow the
**3D engine** section below wherever it differs. Default stays `--engine=2d`.
Parse flags from the arguments **and** from plain words: "no stops", "fully autonomous", "just make it" mean
`--skip=all`; "skip the storyboard approval" means `--skip=storyboard`; "let me see the characters first", "plan it
out more" mean `--design`. Values combine with commas (`--skip=storyboard,design`). Unknown flag: say so and stop.

| Gate | Default | When skipped |
|---|---|---|
| **G1 storyboard** | STOP | Write it, run one self-critique pass against the lyric sheet (one idea per line? every chorus a payoff? motif returns at the end?), then continue. |
| **G2 design** (only with `--design`) | STOP, iterate until approved | `--skip=design` keeps the stage but self-critiques the sheets instead of waiting. |
| **G3 pilot** | STOP | Still build the pilot (it creates the shared `SETS` the chapters need). Do **two** contact-sheet review passes and fix the usual first-pass bugs before continuing. |

A gate is only skipped when the user said so; when in doubt, stop. A STOP is real: end the turn and wait.
For every skipped gate, append to `DIR/DECISIONS.md`: the gate, what was decided, the alternatives you weighed,
and the paths of the images you reviewed. Link `DECISIONS.md` in the final report so the user can audit it.
Never skip the final ffprobe check and the lyric/frame spot check in step 8: those are verification, not approval.

## Pipeline (do these in order; the STOPs are real unless a flag skipped them)

1. **Project.** Make the project folder **outside** any repo, e.g. `~/PROJECTS/<song>-video/`:
   `bash ~/.claude/skills/music-video/scripts/setup_project.sh ~/PROJECTS/<song>-video`
   This clones ClaudeAnimationBase at `UPSTREAM_PIN`, adds `src/cast.js` (Pip, props, karaoke) and wires the karaoke in.
   It needs Node 20+, Chrome, ffmpeg, uv and git.
2. **Analyze.** `uv run ~/.claude/skills/music-video/scripts/analyze_song.py SONG --project DIR [--srt LYRICS.srt]`
   This writes `src/config.js` (phase-fitted bpm and offset), `src/lyrics.js` and `analysis.json`. **Never trust
   librosa's BPM.** Use the fitted value. Check `energy_drops` against the `[Chorus]` section starts. Suno exports
   embed an SRT track with `[Section]` tags; for other songs, get timings first (ask the user, or align with whisper).
3. **Read** `DIR/ANIMATION_GUIDE.md` (the kit's rules), `LESSONS.md` and one example chapter
   (`examples/zoo2/scenes/c01_pilot.js`) before writing anything.
4. **Storyboard.** Write `DIR/STORYBOARD.md` (format: `examples/zoo2/STORYBOARD.md`) with the logline, cast,
   palette arc, motif, a chapter table for the whole song, and the pilot shot by shot with timed "reads".
   One visual idea per lyric line, acted by characters. **G1 — STOP: show the user and wait for approval**
   (with `--skip=storyboard`/`all`: self-critique, log to `DECISIONS.md`, continue).
4b. **Design (only with `--design`).** Before any animation, settle the look as still images in `out/design/`:
   - `cast_<name>.jpg` model sheet per character: front, three-quarter and side view, 4 expressions
     (neutral, joy, fear, determination), 3 action poses from the storyboard, and a height line-up of the whole cast;
   - `palette.jpg`: swatch strip per chapter, showing the palette arc across the song;
   - `style_<chapter>.jpg`: one finished key frame per chapter at the storyboard's hero moment, karaoke bar on.
   Draw them with a throwaway `scenes/design.js` (a sheet-only chapter outside the song's time range) and
   `node render.mjs --sheet=...`; character code goes in `src/cast.js` additions that the chapters will reuse, so
   approved designs carry straight into the video. **G2 — STOP:** show the sheets; take notes ("bigger eyes",
   "warmer chorus palette"), re-render, repeat until the user approves. Then update `STORYBOARD.md` to match.
5. **Pilot.** Pick about 30 s that crosses a section boundary into a chorus. Build it as one chapter file with shared
   sets exported on `window.SETS` (see the end of `c01_pilot.js`). Check it with
   `node render.mjs --sheet=... --out=out/check/x.jpg` and `--strip=a:b`, and **look** at the images. The usual
   first-pass bugs: characters too small (push the camera in to 1.3–1.5×), background shapes not wide enough for
   whip pans, props hidden under the karaoke bar. Render `node render.mjs --clip --range=a:b --out=out/pilot.mp4`.
   **G3 — STOP: the user watches it and approves or gives changes** (with `--skip=pilot`/`all`: two review passes,
   log to `DECISIONS.md`, continue).
6. **Chapters in parallel.** Add stub files and their `<script>` tags in `studio.html` for every chapter first
   (an agent must never edit a shared file). Then launch one sub-agent per chapter (fork type, so it inherits
   this context). Give each one its time range, its lyric lines, its chapter brief from the storyboard,
   "YOUR FILE ONLY", the shared `SETS` and globals, and the **seam contract**:
   - between chapters, a `brushWipe` with the SAME colours on both sides (out: `p<.5` in the last 0.3 s; in: `.5+lt/.6`);
   - into a chorus drop, a hard cut out and `flash(1-lt/.18)` in;
   - contact sheets go to `out/check/<chapter>_*.jpg` only, never `out/frames` or MP4s;
   - at least 2 review passes, then report the shot list and known weaknesses.
   Pair intro and outro in one agent so the ending rhymes with the opening.
   With `--design`, also give each agent its approved `out/design/style_<chapter>.jpg` as the look to match.
7. **Seams.** Render a sheet at each boundary ±0.04 and ±0.2 s and check that the wipe colours match and the flashes land.
8. **Render.** `node render.mjs --frames --workers=6`, then
   `node render.mjs --encode --audio=assets/song.mp3 --out=out/<song>_full.mp4`.
   Verify with ffprobe (duration ≈ song, 1920×1080, h264 + aac) and pull about 12 frames to check that the lyric
   matches the scene. About 0.1–0.6 s/frame gives about 15 min for a 4.5-minute song on an M5 Max.
9. **Log it.** Append what went wrong and what fixed it to `LESSONS.md` (dated). Copy the storyboard and chapter
   files into `examples/<song>/` if they're a better reference than zoo2. Write `MAKING-OF.md` with the timeline,
   tokens from `~/.claude/projects/<proj>/<session>.jsonl` usage fields (main plus `subagents/`), and API-equivalent cost.

## House style (from zoo2; change it per song)
- **Cast:** `pip()`, a human with hoodie, beanie, glasses and a pencil motif; `clawd()` with costume hats as the
  antagonist turned teammate; crowds are `pip()` with varied `hoodie`, `skin` and `pencil:false`.
- **Verses** are flat stage shots with a gentle camera. **Choruses** use parallax layers, push-ins, on-beat `shakeXY`,
  fireworks (`glow`) and painted `sfx()` hit words.
- **Captions:** the kit's guide says "no text"; music videos override that with the karaoke bar (`PROJECT.karaoke`).
  Keep scene text to one or two painted words, used once.
- **Beat helper:** `SETS.bt(k) = OFF + k*BEAT`. Put hits on `bt(k)` or on off-beats (`+BEAT/2`), and big changes on bar lines.

## 3D engine (`--engine=3d`)
Example: `examples/zoo2-3d/` (zoo2 remade as a brick world). Same pipeline and gates; these steps differ:
1. **Project:** `bash ~/.claude/skills/music-video/scripts/setup_project.sh DIR --engine=3d`. On top of the 2D kit, this adds
   Three.js (pinned), the 3D `studio.html` (the 2D one is kept as `studio2d.html`), `src3d/` (engine, motion, cast, eggs),
   the LDraw parts baked by `scripts/ldraw_bake.py` into `parts/parts.js` (crowd faces are official printed heads), a
   Blender bevel pass (`scripts/bevel_parts.py`, if Blender is installed), and starter scenes `scenes3d/world.js` (districts,
   look presets, seam flights), `country.js` (the land between districts: city, town, river, forest, farmland, eggs),
   `design.js` (the design sheets), plus `CHAPTER_GUIDE.md`, which every chapter agent reads first.
2. **One world, no cuts.** Each chapter is a *district* (`WORLD.D`). Between chapters the camera flies (`WORLD.F` flights,
   `fly()`); big drops may *whip* in (`whip: true`), others glide in and land on the downbeat with `WORLD.landing()` (a bump
   and a flash, not a cut). Inside a chapter the camera follows one `path()` (Catmull-Rom; `kf` stops at every key).
   Edit `world.js` for the song: district centres, `LOOK` presets for the palette arc, flight times at the chapter seams.
3. **The living world.** Background motion in every frame: `buildSite` (robots raising buildings that grow across the
   WHOLE song), `field` (sowers), `passerby`, cranes, river ripples, boats; easter eggs (`EGGS.*`) hidden in districts.
4. **Cast:** `fig(key, PIP)` (custom decal faces, 16 expressions), `fig(key, crowdLook(i))` (official 2-sided printed
   heads: unhappy faces spin the head), `clawd()` + `clawdPose()` (costume hats), `robot()`. Motion: `walk`, `run`,
   `dance(name, t)` (14 beat-locked moves), `crowdDance(i, t)`. Props are pre-oriented for hands (`heldPencil`, `heldHandset`).
5. **The flat dial:** `cam({ flat })`, 0 → 1, combines a dolly-zoom to orthographic, a z-squash toward the focus plane,
   PBR → toon shading and ink outlines (a depth + normal edge pass). Animate it per shot (zoo2: the bridge flattens to 2D as
   the light drops to black, then snaps back to 3D on the final-chorus drop). Ink only appears once nearly orthographic.
6. **Design (`--design`):** `node render.mjs --loop=<name> --sheet=...` on the `design.js` loops: `pipTurn`, `pipFaces`,
   `pipPoses`, `faceIds`, `heads`, `clawd`, `lineup`, `litSet`, `worldMap`, `zones`, and `moves` as a short clip
   (`--clip --loop=moves`) for judging motion. G2 stops on these.
7. **Chapters:** pre-create stubs + module tags; each agent gets its time range, district, seam flight ids, eggs to hide
   and "YOUR FILE ONLY"; `CHAPTER_GUIDE.md` is the contract. Render as in 2D: about 0.04 s/frame (zoo2: 6,470 frames in minutes).
8. **Blender** is the offline asset baker, not the renderer: in the zoo2 bake-off, EEVEE/Cycles looked best (bevels, contact
   shading) but rendered ~100× slower; baking the bevels into the parts closed most of the gap
   (see `examples/zoo2-3d/bakeoff/VERDICT.md`). Keep `blender/bakeoff_chorus1.py` as the template for a Cycles hero shot.
