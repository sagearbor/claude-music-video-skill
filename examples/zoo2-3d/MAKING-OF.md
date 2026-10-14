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
| 17:08–17:13 | **v2 rendered: 6,471 frames in 305 s (0.046 s/frame, 6 workers; slower than v1 because every district is now drawn every frame)** |
| 17:15–17:25 | Encoded, checked with ffprobe (1920×1080 h264 + aac, 269.61 s), spot-checked your flagged moments in v2, delivered a phone copy + OneDrive |

## What made it work
- **The bake-off, run twice.** Round 1 favoured Three.js on speed; a fair round 2 showed Blender's look was better,
  mostly because of bevels. Result: Blender bevels the parts once (3.5 s), Three.js renders them (~0.03 s/frame).
- **Don't reinvent what a library has**: 395 official printed heads ship with LDraw as coloured geometry.
- **One world, shared seam flights**: both chapters call the same `flight()`, so the seams are continuous by construction.
- **The continuity linter.** v1 looked fine in contact sheets and still had obvious motion errors. Simulating every
  frame found all of them, and the agents fixed them against a 0-problem gate.

## Tokens and cost (from this session's transcripts, deduplicated by message id)
| | Output | Cache reads | Cache writes | API-equivalent |
|---|---|---|---|---|
| Main session (orchestration, engine, bake-off, tools) | 0.37 M | 131 M | 1.4 M | $41 |
| Sub-agents (9 chapter builders × build + fix round) | 0.13 M | 274 M | 6.3 M | $89 |
| **Total** | **0.50 M** | **405 M** | **7.7 M** | **≈ $130** |

At Opus 5.5 list prices ($4/M input, $20/M output, $0.20/M cache read, $5/M cache write). On a Claude subscription: $0 extra.
The continuity round roughly tripled the sub-agent spend: catching motion errors with the linter *before* v1 would have
saved most of it, and that's now the default (the gate is in `CHAPTER_GUIDE.md`).
**Wall clock:** 2 h 39 min from the prompt to the v2 MP4 (14:46 → 17:25), including your design review and v1 review.
**Render:** v1 0.024 s/frame, v2 0.046 s/frame at 1080p (6 parallel headless Chrome workers on an M5 Max).

## Files
- Video: `~/PROJECTS/zoo2-3d-video/out/zoo2_3d_full.mp4` (v2) and `zoo2_3d_full_v1.mp4` (kept for comparison)
- Bake-off: `bakeoff/` (`VERDICT.md`, compare sheets, `bakeoff_chorus1.py`)
- Design sheets: `design/`; storyboard: `STORYBOARD.md`; agent contract: `CHAPTER_GUIDE.md`; chapters: `scenes3d/`

## YouTube: paste-ready

**Title**
Please Select Your Ending (3D brick-world remake): a music video built entirely in code by Claude Code

**Description**
```
Zoo? Nah. Doom? Nah. Bliss? Nah. We write our own ending. Now in a brick-toy 3D world.

Song: made with Suno. Video: every frame was rendered by code that Claude (Opus 5.5 in Claude Code) wrote.
No AI image or video generators were used. It's a remake of my 2D version, and this time it's one continuous camera flight through a living 3D world, with no hard cuts.

CHAPTERS
0:00 The call: "Please select your ending"
0:25 Chorus 1: the three doors
0:35 Ending 1: the Zoo
1:16 Chorus 2
1:36 Ending 2: Doom (watch the smoke)
1:57 Ending 3: Bliss
2:18 Chorus 3 and the roast
2:48 Pennsylvania Dutch barn raising
3:09 The moon seed vault
3:34 Bridge: "Who writes the ending?" (the world flattens to 2D)
3:47 Final chorus: back to 3D
4:09 Outro: writing our own ending

HOW IT WAS MADE
• Built from the free LDraw open parts library (bricks, printed minifig-style heads), bevelled once in Blender and rendered in Three.js inside headless Chrome.
• Engine bake-off: Claude rendered the same chorus in Blender and in Three.js. Blender looked better, Three.js was about 50x faster, so I used both: Blender bevels the parts once and Three.js draws every frame.
• A "flat" dial turns 3D into a paper cut-out for the bridge: a dolly-zoom to orthographic, toon shading and ink outlines. Then it pops back to 3D on the final drop.
• 9 Claude sub-agents built the chapters in parallel. Each one had to pass a continuity checker: no teleporting bodies, kicks that really hit the door, keys that pass hand to hand.
• Hidden in the background: robots building the city, farmers sowing, a river, and AI-apocalypse easter eggs (a paperclip factory, HAL's eye, the shoggoth, the off switch, Daisy Bell...). How many can you find?

BY THE NUMBERS
• 2 hours 39 minutes from the prompt to the final video, including two rounds of my review.
• 6,471 frames at 1080p, rendered in about 5 minutes on a MacBook (M5 Max), about 0.05 s per frame.
• Cost: $0 extra on my Claude subscription. About $130 if it had been paid at API prices.

The code is open source as a Claude Code skill:
https://github.com/sagearbor/claude-music-video-skill

Parts from the LDraw library (CC BY 4.0), ldraw.org. Not affiliated with or endorsed by any toy company.
Original 2D kit: John Heibel's ClaudeAnimationBase (MIT) https://github.com/JohnHeibel/ClaudeAnimationBase

#ClaudeCode #AIMusicVideo #CreativeCoding #threejs #Suno
```

**Tags:** Claude Code, AI music video, Three.js, LDraw, brick animation, stop motion, creative coding, Suno, AI apocalypse, p(doom), music video, Blender
**Category:** Music (or Science & Technology). **Audience:** not made for kids. **Altered or synthetic content:** yes (AI-generated song).
**Thumbnail:** `out/thumb.jpg`
