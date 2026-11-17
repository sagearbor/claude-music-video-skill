# Avatar mode: `/music-video SONG --avatar`

A second pipeline beside the coded one: a consistent AI character sings the song (real lip-sync), with
AI b-roll, all made by **free local models on the Mac** plus the user's existing subscriptions. Claude Code
on the Mac runs it end to end; **Claude in Chrome** (`claude --chrome`) drives the websites. No API spend.

Status (2026-11-17): plan_shots / run_shots / assemble are tested end to end with stand-in models.
The two model hookups (LTX image-to-video flags, MuseTalk wrapper) are **unverified until step 0 runs on a Mac.**

| Stage | Tool | Where | Cost |
|---|---|---|---|
| Song | Suno free tier | Chrome | free |
| Character sheet | Gemini (Nano Banana) or ChatGPT images | Chrome | in subscription |
| Shot list | `plan_shots.py` | Mac | free |
| Motion clips | LTX-2.3 MLX (`ltx-2-mlx`) | Mac | free |
| Lip-sync | MuseTalk 1.5 MLX | Mac | free |
| Vocal stem | Suno stem, else demucs | Mac | free |
| Edit + captions + pop-ups | `assemble.py` (ffmpeg) | Mac | free |

Hardware: `doctor.sh` picks a profile from RAM. **mac32** (16–48 GB, e.g. a 3-year-old 32 GB Mac): 512×320,
≤5 s clips, int4; works, just slower and softer. **mac128** (M5 Max): 1024×576, int8, two-stage.
Upscale later if needed. Under 16 GB: not supported locally.

## Steps (gates G1–G3 stop for the user unless `--auto`)

0. **First run on a new Mac only.** `bash ~/.claude/skills/music-video/scripts/avatar/doctor.sh --install`.
   Then compare `ltx-2-mlx generate --help` with `commands.i2v` in `scripts/avatar/avatar.config.json` and fix
   flags there (image-to-video flag names especially). Wire `musetalk_run.py` from the MuseTalk MLX README
   (its docstring says how). Test: one 5 s shot with `run_shots.py --only s00X`. Commit the fixes to this repo.
1. **Song (Chrome).** If the user gave a song file, skip. Else open suno.com in Chrome (the user's signed-in
   session), Create > Custom: paste lyrics, style prompt and exclude styles exactly as given (e.g. from
   musicVideos `hooks-restart/FINAL.md`). Generate, listen-check both takes' durations, download the better one
   (prefer a format with embedded lyrics; also download the vocal stem if the plan offers it → `assets/vocals.wav`).
   Free tier = non-commercial; say so once if the user plans to monetize.
2. **Character sheet (Chrome).** In Gemini, upload the reference photo (`--human` or `_shared/sageHeadshot.png`)
   and ask for separate images of the SAME person, same outfit, plain background: `front`, `three-quarter-left`,
   `three-quarter-right`, `profile`, `singing-closeup-front`, plus 2–3 in-scene poses from the storyboard.
   Save to `PROJECT/stills/` with those names (`front` in the name = used for sing shots). Reuse
   `_shared/cast/<name>/` if it exists. **G1 — STOP:** send the sheet; the face must match across all angles.
3. **Shot list.** `uv run .../avatar/plan_shots.py SONG --project PROJECT --stills PROJECT/stills [--sing=hook|all]`.
   Default lip-syncs only the hook sections (fastest; verses as story b-roll).
4. **Storyboard.** Write `STORYBOARD.md` (one scene idea per section, same rules as the coded pipeline), then
   rewrite each shot's `prompt` in `shots.json` from it: one concrete action + camera move, the character
   described the same way every time, ≤40 words. Sing shots: face to camera, mouth unobstructed.
   **G2 — STOP:** render 3 sample shots (`run_shots.py --only ...`, one sing, two b-roll) and send them.
5. **Render.** `uv run .../avatar/run_shots.py --project PROJECT` (resumable; leave it running, it can take
   hours on mac32). Re-render a bad shot by deleting `clips/<id>.mp4` (and `clips/raw/<id>*`), editing its prompt or still.
6. **Assemble.** `uv run .../avatar/assemble.py --project PROJECT --captions --popups PROJECT/popups.json`
   Pop-ups: the user's real solution projects, timed to the verses that hint at them.
   **G3 — STOP:** send `out/final.mp4`. Then layer extras with the coded pipeline if wanted (e.g. render
   a coded title card or cube transition and splice it in as a shot).

## Lessons / gotchas
- Lip-sync quality is mostly the input: clean vocal stem, frontal face, mouth visible, no hands near the mouth.
- LTX wants 8n+1 frames; run_shots rounds up and conform() trims to the exact shot length, so the cut never drifts.
- Backup models if a shot type keeps failing: LongCat-Video-Avatar 1.6 (sings straight from photo + audio,
  open weights, but built for Nvidia; untested on Mac) or a cloud lip-sync on fal.ai (paid, needs the domain allowed).
