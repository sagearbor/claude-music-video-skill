# /// script
# requires-python = ">=3.10"
# ///
"""Turn a song's timed lyrics into a shot list that covers every second of the song.

  uv run plan_shots.py SONG --project DIR --stills DIR [--srt LYRICS.srt] [--profile mac32|mac64|mac128]
                       [--sing=hook|all] [--hook "Chorus,Final Chorus"]

Writes DIR/shots.json. Each shot: id, start, end, kind (sing|broll), section, lyric, still, prompt.
- Lyric lines become shots; gaps (intros, solos) become b-roll. Shots longer than the profile's
  max_clip_s are split. --sing=hook (default) lip-syncs only the hook sections; the rest is b-roll
  (cheaper, and verses read as story). --sing=all lip-syncs every sung line.
- Stills rotate through the character sheet (front first for sing shots).
- Prompts are placeholders built from section + lyric. The agent REWRITES them from STORYBOARD.md
  before rendering (see AVATAR.md step 4); plan_shots never invents the story.
"""
import argparse, json, subprocess, sys, tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
import beatgrid  # noqa: E402

HERE = Path(__file__).parent


def duration(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
                       capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def load_srt(song, srt):
    if srt:
        return beatgrid.parse_srt(Path(srt).read_text())
    out = Path(tempfile.mkdtemp()) / "e.srt"
    r = subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(song), "-map", "0:s:0", str(out)])
    return beatgrid.parse_srt(out.read_text()) if r.returncode == 0 and out.exists() else []


def plan(srt, dur, stills, max_s, sing_mode, hook_names):
    secs = beatgrid.sections(srt)
    lines = [(a, b, t) for a, b, t in srt if not (t.startswith("[") and t.endswith("]")) and b > a]
    lines.sort()

    def section_at(t):
        name = ""
        for s, n in secs:
            if s <= t + 0.05:
                name = n
        return name

    # tile the timeline: lyric spans + gaps (each line runs until the next one starts, so no black frames)
    spans, cur = [], 0.0
    for i, (a, b, t) in enumerate(lines):
        if a - cur > 0.3:
            spans.append((cur, a, ""))
        nxt = lines[i + 1][0] if i + 1 < len(lines) else dur
        end = nxt if nxt - b < 1.5 else b  # short breath: hold the singer; long gap: cut to b-roll
        spans.append((max(a, cur), end, t))
        cur = end
    if dur - cur > 0.05:
        spans.append((cur, dur, ""))

    fronts = [s for s in stills if "front" in s.name.lower()] or stills
    shots, k = [], 0
    for a, b, lyric in spans:
        sec = section_at(a)
        is_hook = any(h.strip().lower() in sec.lower() for h in hook_names) if sec else False
        kind = "sing" if lyric and (sing_mode == "all" or is_hook) else "broll"
        n = max(1, int(-(-(b - a) // max_s)))
        for j in range(n):
            s0, s1 = a + (b - a) * j / n, a + (b - a) * (j + 1) / n
            pool = fronts if kind == "sing" else stills
            still = pool[k % len(pool)]
            k += 1
            prompt = (f"{sec or 'instrumental'}; the singer performs to camera, mouth clearly visible, '{lyric}'"
                      if kind == "sing" else
                      f"{sec or 'instrumental'}; cinematic b-roll evoking: {lyric or 'the song mood'}; the character from the reference image")
            shots.append(dict(id=f"s{len(shots):03d}", start=round(s0, 3), end=round(s1, 3), kind=kind,
                              section=sec, lyric=lyric if j == 0 else "", still=str(still), prompt=prompt))
    return shots


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("song", type=Path)
    ap.add_argument("--project", type=Path, required=True)
    ap.add_argument("--stills", type=Path, required=True)
    ap.add_argument("--srt")
    ap.add_argument("--profile")
    ap.add_argument("--sing", choices=["hook", "all"], default="hook")
    ap.add_argument("--hook", default="Chorus,Hook,Drop")
    a = ap.parse_args()
    cfg = json.loads((HERE / "avatar.config.json").read_text())
    prof = a.profile or ((HERE / ".profile").read_text().split("=")[1].strip() if (HERE / ".profile").exists() else "mac32")
    stills = sorted(p for p in a.stills.iterdir() if p.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp"))
    if not stills:
        sys.exit(f"no stills in {a.stills}: make the character sheet first (AVATAR.md step 2)")
    srt = load_srt(a.song, a.srt)
    if not srt:
        sys.exit("no timed lyrics: pass --srt (Suno downloads usually embed them)")
    shots = plan(srt, duration(a.song), stills, cfg["profiles"][prof]["max_clip_s"], a.sing, a.hook.split(","))
    a.project.mkdir(parents=True, exist_ok=True)
    (a.project / "shots.json").write_text(json.dumps(dict(profile=prof, song=str(a.song.resolve()), shots=shots), indent=1))
    n_sing = sum(s["kind"] == "sing" for s in shots)
    print(f"{len(shots)} shots ({n_sing} sing, {len(shots) - n_sing} b-roll), profile {prof} → {a.project / 'shots.json'}")


if __name__ == "__main__":
    main()
