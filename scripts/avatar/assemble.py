# /// script
# requires-python = ">=3.10"
# ///
"""Join the rendered shots into the finished video with the full song, captions and pop-ups.

  uv run assemble.py --project DIR [--captions] [--popups popups.json] [--out out/final.mp4]

popups.json: [{"t": 42.0, "dur": 3.5, "text": "basic-income coin: github.com/sagearbor/..."}]
Missing clips become black so a partial render can still be previewed.
"""
import argparse, json, subprocess, sys, tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
import beatgrid  # noqa: E402

HERE = Path(__file__).parent


def esc(t):
    return t.replace("\\", "\\\\").replace(":", "\\:").replace("'", "’").replace("%", "\\%")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", type=Path, required=True)
    ap.add_argument("--captions", action="store_true")
    ap.add_argument("--popups", type=Path)
    ap.add_argument("--srt")
    ap.add_argument("--out", type=Path)
    a = ap.parse_args()
    cfg = json.loads((HERE / "avatar.config.json").read_text())
    plan = json.loads((a.project / "shots.json").read_text())
    p = cfg["profiles"][plan["profile"]]
    tmp = Path(tempfile.mkdtemp())
    parts = []
    for s in plan["shots"]:
        c = a.project / "clips" / f"{s['id']}.mp4"
        if not c.exists():
            c = tmp / f"{s['id']}_black.mp4"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=black:s={p['w']}x{p['h']}:r={p['fps']}",
                            "-t", f"{s['end'] - s['start']:.3f}", "-c:v", "libx264", "-pix_fmt", "yuv420p", str(c)], check=True)
        parts.append(c)
    lst = tmp / "list.txt"
    lst.write_text("".join(f"file '{c.resolve()}'\n" for c in parts))
    silent = tmp / "silent.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(silent)], check=True)

    filt = []
    fs = max(18, p["h"] // 16)
    if a.captions:
        srt = beatgrid.parse_srt(Path(a.srt).read_text()) if a.srt else []
        if not srt:
            e = tmp / "e.srt"
            if subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", plan["song"], "-map", "0:s:0", str(e)]).returncode == 0:
                srt = beatgrid.parse_srt(e.read_text())
        for s0, s1, t in srt:
            if t and not (t.startswith("[") and t.endswith("]")):
                filt.append(f"drawtext=text='{esc(t)}':fontcolor=white:fontsize={fs}:borderw=3:bordercolor=black:"
                            f"x=(w-text_w)/2:y=h-text_h-{fs}:enable='between(t,{s0:.2f},{s1:.2f})'")
    if a.popups:
        for q in json.loads(a.popups.read_text()):
            filt.append(f"drawtext=text='{esc(q['text'])}':fontcolor=white:fontsize={int(fs * 0.8)}:box=1:boxcolor=black@0.6:"
                        f"boxborderw=12:x=w-text_w-{fs}:y={fs}:enable='between(t,{q['t']:.2f},{q['t'] + q.get('dur', 3):.2f})'")
    out = a.out or a.project / "out" / "final.mp4"
    out.parent.mkdir(parents=True, exist_ok=True)
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(silent), "-i", plan["song"], "-map", "0:v", "-map", "1:a:0"]
    if filt:
        cmd += ["-vf", ",".join(filt), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "veryfast", "-crf", "18"]
    else:
        cmd += ["-c:v", "copy"]
    cmd += ["-c:a", "aac", "-b:a", "192k", "-shortest", str(out)]
    subprocess.run(cmd, check=True)
    print(f"→ {out}  ({sum(1 for s in plan['shots'] if (a.project / 'clips' / (s['id'] + '.mp4')).exists())}/{len(plan['shots'])} shots rendered)")


if __name__ == "__main__":
    main()
