# LESSONS: improvement log (newest first; read before every video)

Add a dated entry after each video: what broke, what fixed it, and what to try next. Promote a lesson into SKILL.md
once it has held for two videos.

## 2026-10-13 · zoo2-3d (same song, rebuilt as a 3D brick world; `--engine=3d`)
**Worked**
- **Bake-off before committing to an engine.** The same 10 s shot in Three.js and in Blender (bpy). Three.js rendered about
  100× faster and fits the sheet/strip review loop and the sub-agents unchanged, so it became the renderer. The flatten dial
  also took one evening in Three.js.
- **A fair rematch changed the answer.** Round 1 handicapped Blender (plain EEVEE, no bevels, a washed-out colour setup);
  with ray tracing, GI and real bevels it looked clearly better. The gap was mostly the **bevels**, so Blender became an
  *offline asset baker* (`bevel_parts.py`, 3.5 s for 70 parts) and Three.js renders the bevelled parts.
- **Don't draw what a library already has.** LDraw ships 395 official printed minifig heads as coloured geometry. The baker
  keeps print colours, and the crowd wears real printed faces (2-sided heads spin for the second expression). Hand-drawn
  decals stay only for the hero, who needs 16 expressions with the same glasses.
- **One world, one take.** Districts + shared seam flights (`WORLD.F`), both chapters calling the same `flight()`, gave
  continuous seams by construction. Measuring the actual camera (`tools/camprobe.mjs`) settled a "seam jump" that was really
  content arriving under a flash.
- **A living background is cheap when it's a function of song time**: buildings that grow across the whole song, sowers,
  river ripples, cranes. Easter-egg props (`EGGS.*`) reward pausing.
- **Agents found engine bugs the orchestrator missed**: `path()` time warp, an impure `earPencil`, the reaper hood hiding the
  face, a per-frame `doorUnit()` leak, egg caches that ignored their key. Fix them centrally the moment they're reported.

**Broke / fix**
- `put()` overwrites rotation: a ground plane became a giant wall hiding everything. Wrap tilted meshes in a Group.
- `ShaderPass` clones uniforms and drops render-target textures, so the ink pass had no input. Assign them after construction.
- Ink outlines vanished when flat: the z-squash also flattens depth and normals. Render the edge pass un-squashed (exact once
  orthographic) and fade the ink in only above flat ≈ .82.
- `kf()` for cameras stops at every key (jerky). Use `path()` (Catmull-Rom), easing only the first and last segment;
  global end-easing pushed keys up to 1 s late.
- Blender washed out: AgX look + a mis-mapped world gradient. Use Standard view + Map Range on the world's z.
- The bevel step merged coplanar faces across print colours (scrambled faces). Dissolve with `delimit={'MATERIAL'}`, and
  don't bevel heads.
- BFC: an uncertified parent makes its children two-sided (found by a new unit test).

**Your review of v1 → the continuity round (the biggest lesson of this video)**
The first full cut looked good in contact sheets but had motion errors a viewer spots instantly: kicks into thin air,
keys blinking between hands that weren't near each other, a pencil writing with the eraser, bodies teleporting at shot
changes (37/41/46/51 s), a costume swap in plain view (panda), people rising through a solid floor with their legs
appearing later. **Contact sheets sample every ~0.5 s and cannot see a 1-frame pop.** What fixed it, now part of the skill:
- `tools/continuity.mjs` simulates EVERY frame without rendering (~5 s per song-minute) and flags spike TELEPORTs, joint
  SNAPs, UNDERGROUND feet, failed CONTACT assertions, and POPs (things appearing/vanishing in view). It found every one of
  your timestamps by itself. It must fail on page errors: a chapter that doesn't parse otherwise lints "clean" by vanishing.
- **Interactions are assertions**: `expect(name, limb(fig, 'footR'), target)` on the contact frame; helpers `kickAt`,
  `stepTo` (walk phase from distance, so no foot sliding; stride grows with speed), `handoff` (prop travels hand to hand).
- The engine **blends actors across shot boundaries** (0.25 s, from the previous shot's last frame: still a pure function).
- Track props as actors too (every `keep()`-ed object), not just people; loops must hide their wrap (scale to 0).
- Smaller rules found by agents and fixed centrally: held props must reset their transform on attach (they kept their
  world position: 300-stud jumps in the parallel render); measure limbs with no squash left from the last frame; a whole
  district must not pop in at a draw-distance edge (draw the small world fully); costume swaps happen under a puff.
- **The gate is the whole song**, not each chapter: districts are visible from other chapters' time ranges.

**Weak in the result (try next time)**
- Flights between far districts sometimes look down at empty grass for 1–2 s; aim the flight's look point at the horizon.
- Finale crowd shots are busy; Pip gets lost. Give the hero a contrasting rim light or a clearing.
- Motion is hand-built gaits/dances; real mocap retargeted onto minifig joints (CMU data) would add weight. It isn't plug-and-play.
- Seams carry content changes under flashes (props pop); fade props across the flash instead.

## 2026-10-13 · zoo2 (first video; Suno song, 4:29.6, 94 BPM)
**Worked**
- Code-drawn frames beat AI generation decisively. The Deforum/SDXL-Turbo overnight attempt was choppy and melty and was rejected.
- Phase-fitting the beat grid. Librosa said 95.7 BPM, the truth was 94.0, and the drift would have been a full beat by about 35 s.
- Storyboard → 30 s pilot → approval → 9 parallel fork agents (5–8 min each) → seam sheet → render. That's about 30 min
  from approval to the final MP4.
- Exporting shared sets from the pilot (`window.SETS`) and pre-creating stub files and script tags, so no agent touched a shared file.
- The seam contract (matching wipe colours, flash on drops) gave 10 clean seams on the first try.

**Broke / fix**
- Pilot pass 1: characters tiny at camera zoom 1.0. Fix: zoom 1.3–1.5, unit 28–34 for leads.
- Whip pans showed bare paper because background rects only spanned W ± 900. Fix: size backgrounds to the widest camera x plus 1200.
- A scribble drawn as a zig-zag read as the letter "M". Fix: a looping path, `cos(a), sin(1.13a)`.
- A two-point curved `inkLine` doesn't render (found in c09). Fix: always give a midpoint.
- Props under the karaoke bar (y > 950) were hidden. Keep action above y ≈ 920.
- The big "(WE DO!)" caption revealed word by word. Fix: show big single-shout lines whole.
- QuickTime stalls were likely Spotlight indexing thousands of frames plus huge grainy MP4s. Fix: `out/frames.noindex`.

**Weak in the result (try next time)**
- Chorus "3D" is only parallax plus shake. Try more depth layers, scale-by-depth crowds and dolly-zoom moves.
- Small props (padlock, atoms, neighbours' props) are easy to miss. Rule: a prop that carries a joke is at least 120 px.
- Hands don't grip props. Add `handL`/`handR` hooks in `pip()` (they exist) and use them.
- Quality is uneven between agents. Have one reviewer agent pass over every chapter's sheet before the full render.
- Audio sync isn't verified numerically. Borrow video-studio's cross-correlation check (±20 ms).
