#!/usr/bin/env bash
# setup_project.sh DIR [--engine=2d|3d] — new coded-music-video project: ClaudeAnimationBase at the pinned commit + our overlay.
#   - clones the kit (MIT, JohnHeibel/ClaudeAnimationBase) at UPSTREAM_PIN, npm install
#   - adds src/cast.js (Pip, props, karaoke bar), wires lyrics/cast into studio.html, karaoke into timeline.js
#   - out/frames -> out/frames.noindex (keeps Spotlight from indexing thousands of frames)
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
DIR="${1:?usage: setup_project.sh DIR [--engine=2d|3d]}"
ENGINE=2d; for a in "${@:2}"; do case "$a" in --engine=2d|--engine=3d) ENGINE="${a#--engine=}";; *) echo "unknown option: $a"; exit 2;; esac; done
PIN="$(cat "$HERE/UPSTREAM_PIN")"
if [ -e "$DIR/studio.html" ]; then
  echo "$DIR already set up"
  [ "$ENGINE" = 3d ] && exec bash "$HERE/scripts/setup_3d.sh" "$DIR"
  exit 0
fi
git clone -q https://github.com/JohnHeibel/ClaudeAnimationBase.git "$DIR"
git -C "$DIR" checkout -q "$PIN"
(cd "$DIR" && npm install --silent)
cp "$HERE/template/src/cast.js" "$DIR/src/cast.js"
python3 - "$DIR" <<'PY'
import sys, pathlib
d = pathlib.Path(sys.argv[1])
s = (d / 'studio.html').read_text()
old = '<script src="src/scenes/demo.js"></script>'
assert old in s, 'studio.html layout changed upstream'
s = s.replace(old, '<script src="src/lyrics.js"></script>\n<script src="src/cast.js"></script>\n<!-- SCENES: one tag per chapter file, in song order -->')
(d / 'studio.html').write_text(s)
t = (d / 'src/timeline.js').read_text()
old = "    SHOTS[i][1](t, t - t0, end - t0);\n    CAM = null;\n"
assert old in t, 'timeline.js layout changed upstream'
t = t.replace(old, old + "    if (typeof karaoke === 'function') { boilSeed('karaoke'); karaoke(t); }\n")
(d / 'src/timeline.js').write_text(t)
PY
[ -f "$DIR/src/lyrics.js" ] || echo "const LY = [];" > "$DIR/src/lyrics.js"
mkdir -p "$DIR/out/frames.noindex" "$DIR/out/check" && ln -sfn frames.noindex "$DIR/out/frames"
[ "$ENGINE" = 3d ] && bash "$HERE/scripts/setup_3d.sh" "$DIR"
echo "ready: $DIR  engine=$ENGINE  (next: uv run $HERE/scripts/analyze_song.py SONG --project $DIR)"
