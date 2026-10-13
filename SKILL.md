---
name: music-video
description: Make a full-length music video for a song, drawn entirely from CODE (p5.js + p5.brush painted cartoon in headless Chrome, ffmpeg for audio), with no AI image/video generation and no API spend beyond the Claude plan. Lyric-driven storyboard, phase-fitted beat grid, karaoke captions, a 30-second pilot gate, then chapters built in parallel by sub-agents. Use when asked to make, animate or storyboard a music video, lyric video or beat-synced animation, in ANY repo.
metadata:
  author: Sage Arbor
---

# music-video

## Subcommands (check these first)
| Invocation | Do this |
|---|---|
| `/music-video help`, `/music-video` with no song, or "how do I use this?" | Print the **Help** block below verbatim, then check prerequisites (`node -v`, `ffmpeg -version`, `uv --version`, Chrome present) and report each as ✅/❌ with the install command. Stop; don't start a video. |
| `/music-video lessons` | Print `LESSONS.md` (the newest entry in full, older entries as headings only). |
| `/music-video <song file> [lyrics.srt] [notes]` | Run the pipeline below. |

**Help**
```
/music-video: turn a song into a hand-painted, beat-synced cartoon music video drawn entirely in code.

USAGE
  /music-video ~/Downloads/song.mp3                     Suno files with embedded lyrics need nothing else
  /music-video ~/Downloads/song.mp3 lyrics.srt          other songs: give timed lyrics (.srt)
  /music-video song.mp3 "noir style, cat detective"     optional creative direction
  /music-video help | lessons

WHAT HAPPENS (about 1.5–2 h, mostly waiting on your two approvals)
  1. Analyses the song: tempo, drops, sections, lyric timing
  2. Writes STORYBOARD.md and STOPS for your approval
  3. Builds a 30 s pilot clip and STOPS so you can watch it
  4. Builds the rest in parallel (sub-agents), checks every scene change
  5. Renders out/<song>_full.mp4 (1080p, H.264 + AAC), ready for YouTube

NEEDS   Node 20+, Google Chrome, ffmpeg, uv  (Mac: brew install node ffmpeg uv)
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

## Pipeline (do these in order; the two STOPs are real)

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
   One visual idea per lyric line, acted by characters. **STOP: show the user and wait for approval.**
5. **Pilot.** Pick about 30 s that crosses a section boundary into a chorus. Build it as one chapter file with shared
   sets exported on `window.SETS` (see the end of `c01_pilot.js`). Check it with
   `node render.mjs --sheet=... --out=out/check/x.jpg` and `--strip=a:b`, and **look** at the images. The usual
   first-pass bugs: characters too small (push the camera in to 1.3–1.5×), background shapes not wide enough for
   whip pans, props hidden under the karaoke bar. Render `node render.mjs --clip --range=a:b --out=out/pilot.mp4`.
   **STOP: the user watches it and approves or gives changes.**
6. **Chapters in parallel.** Add stub files and their `<script>` tags in `studio.html` for every chapter first
   (an agent must never edit a shared file). Then launch one sub-agent per chapter (fork type, so it inherits
   this context). Give each one its time range, its lyric lines, its chapter brief from the storyboard,
   "YOUR FILE ONLY", the shared `SETS` and globals, and the **seam contract**:
   - between chapters, a `brushWipe` with the SAME colours on both sides (out: `p<.5` in the last 0.3 s; in: `.5+lt/.6`);
   - into a chorus drop, a hard cut out and `flash(1-lt/.18)` in;
   - contact sheets go to `out/check/<chapter>_*.jpg` only, never `out/frames` or MP4s;
   - at least 2 review passes, then report the shot list and known weaknesses.
   Pair intro and outro in one agent so the ending rhymes with the opening.
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
