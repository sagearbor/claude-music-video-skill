# music-video: a Claude Code skill for coded music videos

Give Claude Code a song (plus timed lyrics), and it storyboards, pilots and builds a full-length, beat-synced,
hand-painted-cartoon music video. Every frame is **drawn by code**: p5.js + p5.brush in headless Chrome, with ffmpeg
for the audio. There's no AI image or video generation and no API costs beyond your Claude plan.

Example: **"Please Select Your Ending"** (4:30, about 100 shots), made with this workflow. See `examples/zoo2/MAKING-OF.md`.

## Install (any computer)
```bash
git clone https://github.com/sagearbor/claude-music-video-skill ~/.claude/skills/music-video
```
No git? Download the ZIP from GitHub and unzip it so that `~/.claude/skills/music-video/SKILL.md` exists.

Needs: Node 20+, Google Chrome, ffmpeg, [uv](https://docs.astral.sh/uv/), git. On a Mac: `brew install node ffmpeg uv`.

## Use
In Claude Code:
> Use the music-video skill to make a video for ~/Downloads/song.mp3 (lyrics in ~/Downloads/song.srt)

Claude writes a storyboard and **stops for your approval**, builds a 30-second pilot and **stops again**, then
builds the rest in parallel with sub-agents and renders a 1080p MP4. Suno exports with embedded lyrics work
without an .srt.

## Improve it over time
After each video, have Claude add a dated entry to `LESSONS.md` (what broke, what fixed it, what to try next).
Claude reads it first every time, so the next video starts smarter.

## Layout
| Path | What |
|---|---|
| `SKILL.md` | The workflow Claude follows |
| `LESSONS.md` | The improvement log, newest first |
| `scripts/setup_project.sh` | Clones [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) at a pinned commit and adds the cast and karaoke |
| `scripts/analyze_song.py` | Tempo (phase-fitted), drops, sections, `lyrics.js`, `config.js` |
| `template/src/cast.js` | Pip (the human), props, karaoke bar |
| `examples/zoo2/` | Storyboard, all chapter files and the making-of from the first video |
| `tests/run_tests.py` | `python3 tests/run_tests.py` |

## Credits
Built on John Heibel's MIT-licensed [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) and
inspired by [I'm Upping My P(doom)](https://github.com/JohnHeibel/PDoomVideo). The Pip character is adapted from that
video's Researcher.
