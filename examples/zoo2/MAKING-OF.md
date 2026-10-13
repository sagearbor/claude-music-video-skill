# Making-of: "zoo2" music video, made with Claude Code (13 Oct 2026)

## YouTube: paste-ready

**Title**
Please Select Your Ending: an AI music video drawn entirely in code (Claude Code + p5.js)

**Description**
```
Zoo? Nah. Doom? Nah. Bliss? Nah. We write our own ending.

Song: made with Suno. Video: every frame was drawn by code that Claude (Opus 5.5 in Claude Code) wrote.
No AI image or video generators were used: no Sora, no Runway, no Stable Diffusion.

HOW IT WAS MADE
• Claude read the song's timed lyrics and found the beat (94 BPM), then wrote a storyboard: one visual idea per lyric line. I approved it.
• It built a 30-second pilot. I watched it and said "go".
• 9 Claude sub-agents then built the 12 chapters in parallel: intro, zoo, extinction, bliss, the roast, the Pennsylvania Dutch barn raising, the moon seed vault, the "WE DO!" bridge, the finale and the outro. Each one checked its own work with contact sheets.
• Frames are painted with p5.js + p5.brush in headless Chrome, and ffmpeg adds the audio.
• About 100 shots, roughly 4,000 lines of JavaScript, 6,470 frames at 1080p.

BY THE NUMBERS
• Coded version: about 1 hour 40 minutes from cloning the starter kit to the final MP4. That includes my review time. About 30 minutes after I approved the pilot.
• Rendering the full video on a MacBook (M5 Max): about 15 minutes.
• Cost: $0 extra, because I used my Claude subscription. The whole session, including a failed first attempt, used about 66M cached-input and 0.27M output tokens. At API prices that would be about $25–30.

THE FAILED FIRST TRY
My first overnight attempt used Stable Diffusion (SDXL-Turbo) to dream every frame, Deforum style. It came out choppy and melty, with morphing faces and bad hands. Coded animation won by a mile.

Built on John Heibel's ClaudeAnimationBase kit (MIT) and inspired by "I'm Upping My P(doom)":
https://github.com/JohnHeibel/ClaudeAnimationBase
https://github.com/JohnHeibel/PDoomVideo

#ClaudeCode #AIMusicVideo #CreativeCoding #p5js #Suno
```

## Timeline (ET, from file timestamps)

| When | What |
|---|---|
| 02:48 | Asked Claude Code to make the video overnight (prompt below), then went to bed |
| 02:48–03:14 | Setup and a 22-second preview. Found the song's timed lyrics inside the m4a. Downloaded SDXL-Turbo. |
| 03:17–06:40 | **Attempt 1:** a Deforum-style SDXL-Turbo render on the local GPU, 4,046 AI keyframes plus Python effects and captions |
| 06:40–09:29 | Re-rendered the 2D verse sections, which had collapsed into flat colour (slow because the Mac was busy) |
| ~09:40 | Verdict: choppy and morphy. Researched what good videos do: they draw the frames with code |
| 10:05 | Cloned ClaudeAnimationBase and wrote STORYBOARD.md |
| 10:07–11:11 | Built the cast (Pip, Clawd as the "Future" operator), the lyrics and the 30-second pilot. Rendered contact sheets and fixed framing. |
| 11:15 | I approved the pilot. Claude launched 9 parallel chapter agents. |
| 11:21–11:25 | All 9 chapters built and self-reviewed (5–8 minutes each) |
| 11:25–11:47 | Checked every seam between chapters, rendered 6,470 frames, encoded **zoo2_full.mp4** |

## Tokens and cost (from this session's transcripts)

| | Output tokens | Cache reads | Cache writes | Uncached input |
|---|---|---|---|---|
| Main session (both attempts, orchestration) | 135,262 | 22.5 M | 0.62 M | ~200 |
| Sub-agents (9 chapter builders + 1 researcher) | 130,080 | 42.7 M | 0.53 M | ~260 |
| **Total** | **0.27 M** | **65.2 M** | **1.15 M** | negligible |

Estimated API cost at Claude Opus 5.5 list prices ($4/M input, $20/M output, $0.20/M cache read, $5/M 5-minute or $8/M 1-hour cache write):
output $5.31, cache reads $13.04, cache writes $5.74–9.18, so **about $24–28 for the whole session**, of which the sub-agents were about $14–15.
Actual cost to me: **$0 extra**, because this ran on a Claude subscription. Rendering was local (Chrome plus ffmpeg on the Mac).
Not counted: the separate Codex comparison run and the other Claude Code session I used for laptop questions.

## The prompts

**Night 1 prompt (Deforum approach, which gave the weak result):** "Write a complete Python pipeline that generates an audio-reactive music video that dynamically shifts between 2D and 3D visual styles based on the song's energy… librosa… Replicate Deforum or local ComfyUI… ffmpeg… 1080p H.264/AAC… I want it to be a viral video."

**Day 2: what actually worked.** These were short steering messages, not one big prompt:
1. "Search the web for how people are doing this for free on Claude plans." That surfaced the code-drawn approach.
2. "Go ahead with plan to try new way and for me to see a demo clip and review plan." Claude wrote the storyboard and a 30-second pilot.
3. "Approved STORYBOARD.md." / "Looked good. Go ahead and make rest." This triggered the parallel chapter build.

**Recommended one-shot prompt for next time** (puts everything learned into one message):
```
Make a music video for the song in <folder> (audio + timed lyrics .srt), rendered entirely from CODE
(no AI image/video generation). First clone and read https://github.com/JohnHeibel/ClaudeAnimationBase
(read ANIMATION_GUIDE.md fully; build on it) and study https://github.com/JohnHeibel/PDoomVideo.
- Every frame is a pure function of song time t; 1920x1080 24fps; mux original audio -> H.264 + AAC.
- Detect the tempo by phase-fitting the beat track (don't trust librosa's BPM); cuts/hits on beats,
  chorus drops on bar lines with a flash; brush-wipe transitions between chapters with matching colours.
- One visual idea per lyric line, acted by characters (big on screen), karaoke captions from the SRT.
- Write STORYBOARD.md and STOP for my approval. Then build a 30 s pilot, review contact sheets, show me.
- After I approve, build the remaining chapters in parallel with sub-agents (one file each, shared
  cast/sets exported from the pilot), check every chapter seam, render the full song, verify with ffprobe.
```

## Lessons for next time
- **Draw with code; don't generate with AI.** Image models re-guess every frame, so you get flicker, melting faces and bad hands. Code gives smooth motion and characters that stay on model.
- **Storyboard → pilot → parallel chapters** is the right loop. The pilot caught scale problems (characters too small) before they spread to 100 shots.
- **Parallel sub-agents work** if each owns one file and the shared pieces (cast, sets, wipe colours, beat grid) are fixed first.
- **Known weak spots in v1:** some props too small, a few shots crowd the lyric bar, hands don't grip props, the chorus "3D" is only parallax, and quality is a little uneven between chapters.
- **Practical:** keep render scratch folders out of Spotlight (name them `.noindex`). Big grainy MP4s plus indexing made QuickTime stall.

## Files
- Final video: `v2/zoo/out/zoo2_full.mp4` (4:29.6, 1080p24, 483 MB)
- Pilot: `v2/zoo/out/zoo2_pilot.mp4`
- Code: `v2/zoo/src/` (`cast.js`, `lyrics.js`, `scenes/c00…c11`), storyboard: `v2/zoo/STORYBOARD.md`
- Failed attempt 1: `out/zoo2_music_video.mp4` (Deforum/SDXL-Turbo), pipeline `musicvideo.py`
