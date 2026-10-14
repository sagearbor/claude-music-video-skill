"""Fixture tests for music-video (stdlib only): beat-grid fit, SRT parsing, lyrics.js rendering, the LDraw baker, setup flags.

  python3 tests/run_tests.py          (also runs tests/js_tests.mjs with node)
"""
import math
import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import beatgrid  # noqa: E402
import ldraw_bake  # noqa: E402
import subprocess  # noqa: E402
import tempfile  # noqa: E402

SRT = """1
00:00:05,505 --> 00:00:05,505
[Intro]

2
00:00:05,505 --> 00:00:08,298
Thank you for calling the Future.

3
00:00:25,691 --> 00:00:25,691
[Chorus]

4
00:03:47,470 --> 00:03:47,470
(WE DO!)
"""


def test_fit_recovers_94bpm_with_jitter_and_misses():
    rnd = random.Random(1)
    P, off = 60 / 94, 0.265
    beats = [off + k * P + rnd.gauss(0, 0.03) for k in range(400) if rnd.random() > 0.1]
    period, offset, coh = beatgrid.fit_grid(beats)
    assert abs(60 / period - 94) < 0.1, 60 / period
    assert min(abs(offset - off), P - abs(offset - off)) < 0.03, offset
    assert coh > 0.8


def test_fit_rejects_half_time():
    P = 60 / 94
    period, _, _ = beatgrid.fit_grid([k * P for k in range(200)])
    assert abs(period - P) < 0.002, period   # not P/2 (188 BPM)


def test_srt_sections_and_lyrics():
    srt = beatgrid.parse_srt(SRT)
    assert beatgrid.sections(srt) == [(5.505, "Intro"), (25.691, "Chorus")]
    js = beatgrid.lyrics_js(srt)
    assert '"Thank you for calling the Future."' in js and "[Intro]" not in js
    assert "[227.47, 228.47, \"(WE DO!)\"]" in js   # zero-length shout stretched to 1 s


# ---------- LDraw baker ----------
def _lib(files):
    d = Path(tempfile.mkdtemp())
    (d / "parts" / "s").mkdir(parents=True); (d / "p").mkdir()
    (d / "LDConfig.ldr").write_text("0 !COLOUR Black CODE 0 VALUE #1B2A34 EDGE #808080\n0 !COLOUR Red CODE 4 VALUE #C91A09 EDGE #333333\n")
    for name, text in files.items():
        (d / name).write_text(text)
    return ldraw_bake.Library(d)


def _normal_y(d, tri=0):
    p, i = d["pos"], d["idx"][tri * 3: tri * 3 + 3]
    a, b, c = ([p[k * 3 + j] for j in range(3)] for k in i)
    u = [b[j] - a[j] for j in range(3)]; v = [c[j] - a[j] for j in range(3)]
    return u[2] * v[0] - u[0] * v[2]   # y component of u x v


# a CCW-certified square at LDraw y=0 whose front faces LDraw -y (= up after the y-flip)
SQUARE = "0 BFC CERTIFY CCW\n4 16 0 0 0 0 0 20 20 0 20 20 0 0\n2 24 0 0 0 20 0 0\n"


def test_bake_quad_split_scaled_and_flipped_to_y_up():
    lib = _lib({"parts/sq.dat": "0 Square\n" + SQUARE})
    d = ldraw_bake.bake(lib, "sq")
    assert len(d["idx"]) == 6 and len(d["pos"]) == 12, d       # one quad = 2 tris, 4 shared verts
    assert d["bbox"] == [[0, 0, -1.0], [1.0, 0, 0]], d["bbox"]   # 20 LDU = 1 unit, z flipped
    assert len(d["edges"]) == 6 and not d["two_sided"]


def test_bake_winding_mirror_and_invertnext():
    up = _normal_y(ldraw_bake.bake(_lib({"parts/sq.dat": "0 S\n" + SQUARE}), "sq"))
    lib = _lib({"parts/s/sq.dat": "0 S\n" + SQUARE,
                "parts/mir.dat": "0 M\n0 BFC CERTIFY CCW\n1 16 0 0 0 -1 0 0 0 1 0 0 0 1 s\\sq.dat\n",
                "parts/inv.dat": "0 I\n0 BFC CERTIFY CCW\n0 BFC INVERTNEXT\n1 16 0 0 0 1 0 0 0 1 0 0 0 1 s\\sq.dat\n"})
    # a mirrored placement (det < 0) must keep the face pointing the same way (the winding flip undoes the mirror)
    assert _normal_y(ldraw_bake.bake(lib, "mir")) * up > 0
    # INVERTNEXT flips the facing
    assert _normal_y(ldraw_bake.bake(lib, "inv")) * up < 0


def test_bake_colour_groups_and_palette():
    lib = _lib({"parts/pr.dat": "0 Print\n0 BFC CERTIFY CCW\n3 16 0 0 0 0 0 20 20 0 0\n3 0 0 0 0 20 0 20 20 0 0\n3 4 0 0 0 20 0 0 20 0 20\n"})
    d = ldraw_bake.bake(lib, "pr")
    assert [(g["c"], g["hex"], g["count"]) for g in d["groups"]] == [(16, None, 1), (0, "#1B2A34", 1), (4, "#C91A09", 1)], d["groups"]
    assert d["groups"][1]["start"] == 1 and d["groups"][2]["start"] == 2


def test_bake_inherits_colour_and_reports_missing():
    lib = _lib({"parts/s/tri.dat": "0 T\n0 BFC CERTIFY CCW\n3 16 0 0 0 0 0 20 20 0 0\n",
                "parts/use.dat": "0 U\n1 4 0 0 0 1 0 0 0 1 0 0 0 1 s\\tri.dat\n1 16 0 0 0 1 0 0 0 1 0 0 0 1 nothere.dat\n"})
    d = ldraw_bake.bake(lib, "use")
    assert d["colours"] == {"4": 1} and d["missing"] == ["nothere.dat"] and d["two_sided"] is True   # use.dat is uncertified


def test_js_engine_maths():
    r = subprocess.run(["node", str(Path(__file__).with_name("js_tests.mjs"))], capture_output=True, text=True)
    assert r.returncode == 0, r.stdout + r.stderr


def test_setup_rejects_unknown_engine():
    r = subprocess.run(["bash", str(Path(__file__).resolve().parents[1] / "scripts" / "setup_project.sh"), tempfile.mkdtemp() + "/x", "--engine=4d"], capture_output=True, text=True)
    assert r.returncode == 2 and "unknown option" in r.stdout, (r.returncode, r.stdout, r.stderr)


if __name__ == "__main__":
    fails = 0
    for name, fn in list(globals().items()):
        if name.startswith("test_"):
            try:
                fn(); print("PASS", name)
            except AssertionError as e:
                fails += 1; print("FAIL", name, e)
    sys.exit(1 if fails else 0)
