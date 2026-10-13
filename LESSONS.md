# LESSONS: improvement log (newest first; read before every video)

Add a dated entry after each video: what broke, what fixed it, and what to try next. Promote a lesson into SKILL.md
once it has held for two videos.

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
