# Engine bake-off: chorus 1 drop (0:25.69–0:35.69), 13 Oct 2026

Same shot built twice: the doors burst on the three "Nah!"s, Pip dodges the cage, gravestone and pill, raps into the
handset, the crowd pops up, and Clawd's scroll bursts into paper birds. The background is alive in both: robots raising
buildings, a sower and passers-by. Both versions use the **same** baked LDraw parts (`scripts/ldraw_bake.py`), the
**same** face decals (exported from the Three.js page), the same phase-fitted grid (94.00 BPM, offset 0.266 s) and the
same hit times. Each frame is a pure function of song time.

- Clips: `threejs.mp4` and `blender.mp4` (both 10.0 s, 1080p, h264 + aac).
- Frames side by side: `compare.jpg` (left Three.js, right Blender EEVEE; t = 26.3, 28.3, 31.5, 33.9, 35.3 s).

| | **Three.js** (render.mjs + headless Chrome, Metal) | **Blender 5.2.2 EEVEE** (bpy, `blender -b`) |
|---|---|---|
| Look | Saturated toy colours, crisp soft shadows, clearcoat sheen, bokeh DOF, sky gradient. Reads as "brick stop-motion" immediately. | Softer, more natural light falloff and better DOF bokeh. As tuned in the same time budget it came out washed out: AgX look, grey sky, emissive door glow not showing, paper texture missing. Blender's ceiling is higher (Cycles, real GI); its floor costs more tuning. |
| **s/frame at 1080p** | **≈0.03 s** on one worker: 240 frames in 7.4 s wall-clock including the Chrome launch | **1.48 s per process**; 4 processes in parallel → 97 s for 240 frames ≈ **0.40 s/frame effective** (first frame ~5.5 s for shader compile) |
| Full song (6,470 frames) | ≈3–4 min | ≈45 min (4 processes) |
| Karaoke / 2D overlays | Built in (Canvas 2D over the WebGL frame) | Needs a second compositing pass (ffmpeg or the compositor) |
| Sub-agents writing chapters | **Easy.** JS like the 2D chapters, same `render.mjs --sheet/--strip` review loop, 3 s to see a contact sheet. One file per chapter, globals. | **Harder.** Z-up vs y-up conversions everywhere, Euler and parenting quirks, `bpy.ops` context traps, ~6 s minimum to see a single frame. The bpy twin took more lines (~420 vs ~120) for the same shot. |
| 3D→2D flatten dial | **Done and working**: dolly-zoom to ortho + z-squash + toon blend in every material's shader + depth/normal ink pass, all per frame from one number. | Possible (ortho camera, scale an empty parent, Shader-to-RGB toon node group in every material, Line Art/Freestyle for ink), but each piece is heavier, and Freestyle adds seconds per frame. |
| Parallel renders | Workers pull frames out of order (pure function of t) | Works the same way (frame ranges per process) |
| Smoke / fluids (asked mid-run) | Code particles (pure function of t, art-directable: smoke that spells words) | Mantaflow is real simulation but must be baked sequentially, breaks the out-of-order rule, and is hard to direct |

## Winner (round 1): **Three.js**
It is about 13× faster, it fits the existing review loop and sub-agent workflow unchanged, and the flatten dial already
works in it. Blender's better light doesn't make up for that here: the brick-toy look is mostly sheen, shadows and DOF,
and Three.js already does those well. Both clips are kept. `blender/bakeoff_chorus1.py` stays as the reference if a
later video needs Cycles-quality hero shots (render those few shots in Blender and cut them in).

## Round 2: a fair rematch (Blender unleashed), 13 Oct 2026
Round 1 handicapped Blender: plain EEVEE at 32 samples, no ray tracing, no bevels, and an AgX look over a mis-mapped sky
that washed everything grey. In round 2 Blender got its real features: **EEVEE with ray tracing + fast GI, 64 samples,
real bevel modifiers on every brick (harden normals)**, a correctly mapped sky, Standard view transform, and **Cycles**
(path-traced, Metal GPU, 128 samples + denoise) for the same five frames.
`compare_unleashed.jpg` = Three.js | EEVEE unleashed | Cycles (first pass, before the colour fix); `unleashed_stills/` has the colour-fixed EEVEE.

| | Three.js | EEVEE unleashed | Cycles |
|---|---|---|---|
| s/frame at 1080p | 0.036 (incl. bevelled parts + the whole world) | ~3.0 per process | ~6.5 (GPU; first frame 104 s for kernel compile) |
| Full song, 6,470 frames | ≈4 min | ≈1.4 h (4 processes) | ≈12 h |
| Look | good | **best for the brick feel**: bevel highlights, tile seams, contact shading | best light, marginal over EEVEE here |

**Verdict:** Blender's look wins on bevels and contact shading. But the gap was mostly the **bevels**, and they don't need
Blender at render time. So the pipeline takes the best of both: **Blender bakes bevelled geometry once**
(`scripts/bevel_parts.py`, 3.5 s for 70 parts), and **Three.js renders** with those parts at 36 ms/frame.
Three.js stays the renderer (speed, review loop, sub-agents, flatten dial). Blender is the offline asset baker, and the
fallback for a few Cycles hero shots if a later video needs them. New clip with bevelled parts: `threejs_v2.mp4`.
