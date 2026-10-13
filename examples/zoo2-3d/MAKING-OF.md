# Making-of: zoo2 as a 3D brick world (13 Oct 2026)

Same song as `examples/zoo2/` ("Please Select Your Ending", 4:29.6, 94 BPM), rebuilt with the new `--engine=3d`:
a brick-toy stop-motion world built from the open LDraw parts library, one continuous camera flight through a living
world, and a dial that flattens 3D into a 2D cut-out at the bridge. Every frame is a pure function of song time, written
by Claude Code (Opus 5.5) plus 9 parallel chapter sub-agents. No image or video generation was used.

## Timeline (ET, from the session transcript and file timestamps)
| When | What |
|---|---|
| 14:46 | Prompt: build a 3D engine, run a bake-off, remake zoo2 |
| 14:47–14:55 | Installed Blender 5.2.2 and the LDraw library (146 MB); wrote the LDraw → JSON baker |
| 14:55–15:02 | Three.js engine, minifig cast, bake-off shot (chorus 1 drop) in Three.js: **240 frames in 7.4 s** |
| 15:02–15:08 | The same shot in Blender/bpy (EEVEE): **1.48 s/frame per process** |
| 15:08–15:16 | Verdict (Three.js), the flat dial, one-world layout, `--design` sheets → **design stop** |
| 15:16–15:35 | Your notes: smoother one-world flights, richer zones (city, town, river), better faces, natural motion, easter eggs, a fair Blender rematch. Round 2: Blender unleashed won on look → Blender became the offline bevel baker; official LDraw printed heads for the crowd |
| 15:40 | "go": 9 chapter agents in parallel |
| 15:41–15:55 | All chapters built and self-reviewed |
| 15:57–16:00 | **v1 rendered: 6,471 frames in 2 min 35 s (0.024 s/frame, 6 workers)**, encoded in 57 s |
| 16:20 | You reviewed v1: kicks into air, keys jumping hands, upside-down pencil, bodies teleporting (37/41/46/51/56 s), legs popping through the floor at 2:25 |
| 16:25–17:05 | The continuity round: the linter, contact assertions, interaction helpers, shot-boundary blend; every chapter fixed to **0 problems** |
| 17:05– | Whole-song lint, v2 render |

## What made it work
- **The bake-off, run twice.** Round 1 favoured Three.js on speed; a fair round 2 showed Blender's look was better,
  mostly because of bevels. Result: Blender bevels the parts once (3.5 s), Three.js renders them (~0.03 s/frame).
- **Don't reinvent what a library has**: 395 official printed heads ship with LDraw as coloured geometry.
- **One world, shared seam flights**: both chapters call the same `flight()`, so the seams are continuous by construction.
- **The continuity linter.** v1 looked fine in contact sheets and still had obvious motion errors. Simulating every
  frame found all of them, and the agents fixed them against a 0-problem gate.

## Tokens and cost
See the PR description for the final numbers. At the v1 render the session had used (deduplicated by message id):
0.36 M output, 172 M cache-read and 1.2 M cache-write tokens (main session plus 9 sub-agents); about **$48 at API list
prices** (Opus 5.5: $4/M input, $20/M output, $0.20/M cache read, $5/M cache write). On a Claude subscription: $0 extra.
The continuity round roughly doubled the sub-agent usage.

## Files
- Video: `~/PROJECTS/zoo2-3d-video/out/zoo2_3d_full.mp4` (v2) and `zoo2_3d_full_v1.mp4` (kept for comparison)
- Bake-off: `bakeoff/` (`VERDICT.md`, compare sheets, `bakeoff_chorus1.py`)
- Design sheets: `design/`; storyboard: `STORYBOARD.md`; agent contract: `CHAPTER_GUIDE.md`; chapters: `scenes3d/`
