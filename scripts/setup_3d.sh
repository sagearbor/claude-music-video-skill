#!/usr/bin/env bash
# setup_3d.sh DIR — add the 3D (Three.js, brick-toy) engine to a project made by setup_project.sh. Idempotent.
#   - npm install three (pinned), studio.html → studio2d.html, the 3D studio.html + src3d/ + tools/ from template3d/
#   - the LDraw parts library (CC BY 4.0, ~146 MB zip) into $LDRAW_DIR (default ~/.cache/ldraw) if missing
#   - bakes template3d/parts.txt (+ DIR/parts.txt extras, if any) into DIR/parts/*.json and DIR/parts/parts.js
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
DIR="${1:?usage: setup_3d.sh DIR}"
LDRAW="${LDRAW_DIR:-$HOME/.cache/ldraw}"
THREE_VER=0.170.0
[ -f "$DIR/render.mjs" ] || { echo "run setup_project.sh first"; exit 1; }
(cd "$DIR" && npm ls three@$THREE_VER >/dev/null 2>&1 || npm install --silent three@$THREE_VER)
if [ -f "$DIR/studio.html" ] && ! grep -q 'src3d/engine.js' "$DIR/studio.html"; then mv "$DIR/studio.html" "$DIR/studio2d.html"; fi
[ -f "$DIR/studio.html" ] || cp "$HERE/template3d/studio.html" "$DIR/studio.html"
mkdir -p "$DIR/src3d" "$DIR/tools" "$DIR/scenes3d" "$DIR/parts"
cp "$HERE"/template3d/src3d/*.js "$DIR/src3d/"
cp "$HERE"/template3d/tools/*.mjs "$DIR/tools/"
if [ ! -f "$LDRAW/parts/3001.dat" ]; then
  echo "downloading the LDraw parts library (CC BY 4.0) to $LDRAW ..."
  tmp="$(mktemp -d)"; curl -sSL -o "$tmp/complete.zip" https://library.ldraw.org/library/updates/complete.zip
  mkdir -p "$(dirname "$LDRAW")"; unzip -q -o "$tmp/complete.zip" -d "$(dirname "$LDRAW")"; rm -rf "$tmp"
  [ -d "$(dirname "$LDRAW")/ldraw" ] && [ "$(dirname "$LDRAW")/ldraw" != "$LDRAW" ] && mv "$(dirname "$LDRAW")/ldraw" "$LDRAW"
fi
cat "$HERE/template3d/parts.txt" > "$DIR/parts/.list"; [ -f "$DIR/parts.txt" ] && cat "$DIR/parts.txt" >> "$DIR/parts/.list"
python3 "$HERE/scripts/ldraw_bake.py" --lib "$LDRAW" --out "$DIR/parts" --list "$DIR/parts/.list" --js >/dev/null
# bevelled edges: Blender bakes them once into the parts (the bake-off showed they are most of the "real brick" look)
if command -v blender >/dev/null; then blender -b -P "$HERE/scripts/bevel_parts.py" -- "$DIR/parts" 2>/dev/null | tail -1
else echo "note: Blender not found, parts stay unbevelled (brew install --cask blender, then re-run this script)"; fi
# starter scenes: the one-world layout (districts + seam flights), the countryside, the --design sheets; and the agent guide
for f in world.js country.js design.js; do [ -f "$DIR/scenes3d/$f" ] || cp "$HERE/template3d/scenes/$f" "$DIR/scenes3d/$f"; done
[ -f "$DIR/CHAPTER_GUIDE.md" ] || cp "$HERE/template3d/CHAPTER_GUIDE.md" "$DIR/CHAPTER_GUIDE.md"
python3 - "$DIR/studio.html" <<'PY'
import sys, pathlib
p = pathlib.Path(sys.argv[1]); s = p.read_text()
tags = "".join(f'<script type="module" src="scenes3d/{n}.js"></script>\n' for n in ("world", "country", "design") if f"scenes3d/{n}.js" not in s)
s = s.replace("<!-- SCENES: one module tag per chapter file, in song order -->\n", "<!-- SCENES: one module tag per chapter file, in song order -->\n" + tags)
p.write_text(s)
PY
echo "3D engine ready in $DIR ($(ls "$DIR"/parts/*.json | grep -vc raw.json | tr -d ' ') parts baked). Chapters go in scenes3d/, one <script type=module> tag each in studio.html."
