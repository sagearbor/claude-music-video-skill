"""Fixture tests for music-video (stdlib only): beat-grid fit, SRT parsing, lyrics.js rendering.

  python3 tests/run_tests.py
"""
import math
import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import beatgrid  # noqa: E402

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


if __name__ == "__main__":
    fails = 0
    for name, fn in list(globals().items()):
        if name.startswith("test_"):
            try:
                fn(); print("PASS", name)
            except AssertionError as e:
                fails += 1; print("FAIL", name, e)
    sys.exit(1 if fails else 0)
