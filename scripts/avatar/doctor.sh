#!/usr/bin/env bash
# Check this Mac for the avatar pipeline, pick a profile, and (with --install) install what's missing.
#   bash doctor.sh            report only
#   bash doctor.sh --install  install ffmpeg/uv (brew), ltx-2-mlx, MuseTalk MLX weights
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
TOOLS="${AVATAR_TOOLS:-$HOME/.cache/music-video-avatar}"
ok(){ echo "✅ $*"; }; bad(){ echo "❌ $*"; }

[ "$(uname -s)" = Darwin ] || { bad "not macOS: local MLX models need Apple Silicon"; exit 1; }
CHIP=$(sysctl -n machdep.cpu.brand_string); GB=$(( $(sysctl -n hw.memsize) / 1073741824 ))
if   [ "$GB" -ge 120 ]; then P=mac128; elif [ "$GB" -ge 60 ]; then P=mac64; else P=mac32; fi
ok "$CHIP, ${GB} GB → profile: $P"
[ "$GB" -lt 16 ] && bad "under 16 GB: video models won't fit; use the cloud fallback in AVATAR.md"
FREE=$(df -g "$HOME" | awk 'NR==2{print $4}'); [ "$FREE" -ge 60 ] && ok "disk free ${FREE} GB" || bad "disk free ${FREE} GB (want 60+ for weights)"

for t in ffmpeg uv git; do command -v $t >/dev/null && ok "$t" || bad "$t  (brew install $t)"; done
command -v ltx-2-mlx >/dev/null && ok "ltx-2-mlx" || bad "ltx-2-mlx (run with --install)"
[ -d "$TOOLS/musetalk" ] && ok "MuseTalk MLX at $TOOLS/musetalk" || bad "MuseTalk MLX (run with --install)"

if [ "${1:-}" = --install ]; then
  command -v brew >/dev/null || { bad "Homebrew missing: install from brew.sh first"; exit 1; }
  for t in ffmpeg uv git; do command -v $t >/dev/null || brew install $t; done
  mkdir -p "$TOOLS"
  [ -d "$TOOLS/ltx-2-mlx" ] || git clone --depth 1 https://github.com/dgrauet/ltx-2-mlx "$TOOLS/ltx-2-mlx"
  (cd "$TOOLS/ltx-2-mlx" && uv sync --all-extras && uv tool install --force -e .) || bad "ltx-2-mlx install failed: read its README"
  mkdir -p "$TOOLS/musetalk"
  uvx --from huggingface_hub huggingface-cli download mlx-community/MuseTalk-1.5-fp16 --local-dir "$TOOLS/musetalk/weights"
  echo "Now read $TOOLS/musetalk/weights/README.md and make musetalk_run.py match its API (see AVATAR.md step 0)."
fi
echo "--- tool help (check flags against avatar.config.json) ---"
command -v ltx-2-mlx >/dev/null && ltx-2-mlx generate --help 2>&1 | head -40
echo "PROFILE=$P" > "$HERE/.profile"
