"""Lip-sync one clip to one vocal segment with the MuseTalk 1.5 MLX port.

  python musetalk_run.py --video IN.mp4 --audio SEG.wav --out OUT.mp4

NOT YET WIRED (written blind, before the port was installed on a Mac). First run on the Mac (AVATAR.md step 0):
read ~/.cache/music-video-avatar/musetalk/weights/README.md, implement `sync()` with its pipeline
(face detect/crop -> latents -> generate_faces(latents, audio_chunks) -> paste back -> mux), test on one
5-second clip, then delete this notice. If the port can't be made to work, set commands.lipsync in
avatar.config.json to ltx-2-mlx's experimental LipDub mode instead.
"""
import argparse
import sys


def sync(video, audio, out):
    raise NotImplementedError("musetalk_run.py: wire the MuseTalk MLX API first (see the docstring)")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--audio", required=True)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    try:
        sync(a.video, a.audio, a.out)
    except NotImplementedError as e:
        sys.exit(str(e))
