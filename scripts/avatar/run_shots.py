# /// script
# requires-python = ">=3.10"
# ///
"""Render every shot in DIR/shots.json with the local models. Resumable: finished clips are skipped.

  uv run run_shots.py --project DIR [--only s004,s005] [--limit N] [--dry-run]

Per shot: image-to-video (LTX) from the shot's still and prompt -> clips/raw/<id>.mp4;
for kind=sing, cut the vocal stem for [start,end] and lip-sync (MuseTalk) -> clips/<id>.mp4.
Every final clip is conformed to exactly (end-start) seconds at the profile's size and fps, so assemble.py
can concatenate without drift. Vocals: DIR/assets/vocals.wav (Suno stem) or made once with demucs.
"""
import argparse, json, math, os, shlex, subprocess, sys
from pathlib import Path

HERE = Path(__file__).parent
SKILL = HERE.parent.parent


def sh(cmd, dry):
    print("$", cmd, flush=True)
    if not dry:
        subprocess.run(cmd, shell=True, check=True)


def conform(src, dst, secs, w, h, fps):
    # scale+crop to frame, hold the last frame if short, cut to exact length, drop audio
    vf = f"scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},fps={fps},tpad=stop_mode=clone:stop_duration={secs}"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vf", vf, "-t", f"{secs:.3f}", "-an",
                    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "veryfast", "-crf", "18", str(dst)], check=True)


def vocals(proj, song, cfg, dry):
    v = proj / "assets" / "vocals.wav"
    if v.exists():
        return v
    out = proj / "assets" / "stems"
    sh(cfg["commands"]["stems"].format(outdir=shlex.quote(str(out)), audio=shlex.quote(str(song))), dry)
    found = list(out.rglob("vocals.wav"))
    if found and not dry:
        found[0].rename(v)
    return v


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", type=Path, required=True)
    ap.add_argument("--only")
    ap.add_argument("--limit", type=int)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    cfg = json.loads(Path(os.environ.get("AVATAR_CONFIG", HERE / "avatar.config.json")).read_text())
    plan = json.loads((a.project / "shots.json").read_text())
    p = cfg["profiles"][plan["profile"]]
    proj, dry = a.project, a.dry_run
    (proj / "clips" / "raw").mkdir(parents=True, exist_ok=True)
    (proj / "clips" / "vox").mkdir(parents=True, exist_ok=True)
    shots = plan["shots"]
    if a.only:
        keep = set(a.only.split(","))
        shots = [s for s in shots if s["id"] in keep]
    todo = [s for s in shots if not (proj / "clips" / f"{s['id']}.mp4").exists()][: a.limit]
    need_vox = any(s["kind"] == "sing" for s in todo)
    vox = vocals(proj, plan["song"], cfg, dry) if need_vox else None
    musetalk = Path.home() / ".cache" / "music-video-avatar" / "musetalk"
    for i, s in enumerate(todo, 1):
        secs = s["end"] - s["start"]
        frames = 8 * math.ceil(secs * p["fps"] / 8) + 1  # LTX wants 8n+1 frames
        raw, fin = proj / "clips" / "raw" / f"{s['id']}.mp4", proj / "clips" / f"{s['id']}.mp4"
        print(f"[{i}/{len(todo)}] {s['id']} {s['kind']} {secs:.1f}s {s['lyric'][:40]!r}")
        if not raw.exists():
            sh(cfg["commands"]["i2v"].format(image=shlex.quote(s["still"]), prompt=shlex.quote(s["prompt"]), frames=frames,
                                             seconds=f"{secs:.2f}", w=p["w"], h=p["h"], model=p["ltx_model"],
                                             extra=p["ltx_extra"], out=shlex.quote(str(raw))), dry)
        if dry:
            continue
        if s["kind"] == "sing":
            seg = proj / "clips" / "vox" / f"{s['id']}.wav"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s['start']:.3f}", "-t", f"{secs:.3f}", "-i", str(vox), str(seg)], check=True)
            mid = proj / "clips" / "raw" / f"{s['id']}_conf.mp4"
            conform(raw, mid, secs, p["w"], p["h"], p["fps"])
            synced = proj / "clips" / "raw" / f"{s['id']}_sync.mp4"
            sh(cfg["commands"]["lipsync"].format(musetalk_dir=shlex.quote(str(musetalk)), skill=shlex.quote(str(SKILL)),
                                                 video=shlex.quote(str(mid)), audio=shlex.quote(str(seg)),
                                                 out=shlex.quote(str(synced))), dry)
            conform(synced, fin, secs, p["w"], p["h"], p["fps"])
        else:
            conform(raw, fin, secs, p["w"], p["h"], p["fps"])
    left = sum(1 for s in plan["shots"] if not (proj / "clips" / f"{s['id']}.mp4").exists())
    print(f"done; {left} shots still to render")


if __name__ == "__main__":
    main()
