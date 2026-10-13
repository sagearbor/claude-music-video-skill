"""Bake LDraw parts into compact JSON meshes for the 3D engine (stdlib only, unit-tested).

  python3 ldraw_bake.py --lib ~/.cache/ldraw --out DIR 3626c 973 3818 ...     one JSON per part
  python3 ldraw_bake.py --lib ~/.cache/ldraw --out DIR --list parts.txt          part ids, one per line (# comments ok)

Why our own parser: the same baked JSON feeds both Three.js (BufferGeometry) and Blender (bpy mesh), so a shot looks the
same in both engines, and the LDraw edge lines (type 2) and conditional lines (type 5) come along for free as the ink
outlines the 2D-flatten dial fades in. The LDraw library is CC BY 4.0 (see CAreadme.txt in the library).

Output (units: 1 = one stud pitch = 20 LDU; y up; LDraw's -y-up frame is turned 180° about x, so handedness is kept):
  {"id", "name", "pos": [x,y,z,...], "idx": [a,b,c,...] (CCW front faces), "two_sided": bool (any NOCERTIFY file),
   "edges": [x,y,z, x,y,z, ...] (pairs), "cond": [p1,p2,c1,c2 ...] (quads of points), "bbox": [min3, max3],
   "colors": {code: tri_count} (16 = the part's main colour)}
"""
import argparse
import json
import math
import os
import sys
from pathlib import Path

SCALE = 1 / 20.0


def mat_mul(a, b):
    """3x4 affine matrices as (a,b,c,d,e,f,g,h,i,x,y,z): rows (a b c | x), (d e f | y), (g h i | z)."""
    A = [[a[0], a[1], a[2], a[9]], [a[3], a[4], a[5], a[10]], [a[6], a[7], a[8], a[11]], [0, 0, 0, 1]]
    B = [[b[0], b[1], b[2], b[9]], [b[3], b[4], b[5], b[10]], [b[6], b[7], b[8], b[11]], [0, 0, 0, 1]]
    C = [[sum(A[r][k] * B[k][c] for k in range(4)) for c in range(4)] for r in range(3)]
    return (C[0][0], C[0][1], C[0][2], C[1][0], C[1][1], C[1][2], C[2][0], C[2][1], C[2][2], C[0][3], C[1][3], C[2][3])


IDENT = (1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0)


def apply(m, p):
    x, y, z = p
    return (m[0] * x + m[1] * y + m[2] * z + m[9], m[3] * x + m[4] * y + m[5] * z + m[10], m[6] * x + m[7] * y + m[8] * z + m[11])


def det(m):
    return (m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]))


class Library:
    def __init__(self, root):
        self.root = Path(root).expanduser()
        self.dirs = [self.root / "parts", self.root / "p", self.root / "models", self.root]
        self.cache = {}

    def find(self, name):
        rel = name.strip().replace("\\", "/")
        for d in self.dirs:
            for cand in (rel, rel.lower()):
                f = d / cand
                if f.is_file():
                    return f
        return None

    def lines(self, name):
        if name not in self.cache:
            f = self.find(name)
            if f is None:
                raise FileNotFoundError(f"LDraw file not found: {name}")
            self.cache[name] = f.read_text(encoding="utf-8", errors="replace").splitlines()
        return self.cache[name]


class Baker:
    def __init__(self, lib):
        self.lib = lib
        self.tris = []      # (p0, p1, p2, colour)
        self.edges = []     # (p0, p1)
        self.cond = []      # (p0, p1, c0, c1)
        self.two_sided = False
        self.missing = set()

    def walk(self, name, m=IDENT, colour=16, invert=False, depth=0, text=None):
        """Recurse into an LDraw file. `invert` is the accumulated winding flip from parents (INVERTNEXT, det<0)."""
        if depth > 40:
            raise RecursionError(name)
        lines = text.splitlines() if text is not None else self.lib.lines(name)
        certified, ccw, invert_next = None, True, False
        flip = invert ^ (det(m) < 0)
        for raw in lines:
            tok = raw.split()
            if not tok:
                continue
            kind = tok[0]
            if kind == "0":
                if len(tok) >= 2 and tok[1] == "BFC":
                    opts = tok[2:]
                    if "NOCERTIFY" in opts:
                        certified = False
                    elif "CERTIFY" in opts:
                        certified = True
                    if "CW" in opts:
                        ccw = False
                    if "CCW" in opts:
                        ccw = True
                    if "INVERTNEXT" in opts:
                        invert_next = True
                continue
            col = _colour(tok[1], colour) if len(tok) > 1 else colour
            if kind == "1" and len(tok) >= 15:
                v = [float(x) for x in tok[2:14]]
                sub = (v[3], v[4], v[5], v[6], v[7], v[8], v[9], v[10], v[11], v[0], v[1], v[2])
                child = " ".join(tok[14:])
                try:
                    self.walk(child, mat_mul(m, sub), col, invert ^ invert_next, depth + 1)
                except FileNotFoundError:
                    self.missing.add(child)
                invert_next = False
            elif kind == "2" and len(tok) >= 8:
                p = _pts(tok[2:8], m)
                self.edges.append((p[0], p[1]))
            elif kind in ("3", "4"):
                n = 3 if kind == "3" else 4
                if len(tok) < 2 + 3 * n:
                    continue
                p = _pts(tok[2:2 + 3 * n], m)
                if certified is not True:
                    self.two_sided = True
                # front face is CCW after the winding rules; our output frame flips handedness twice (no net change)
                back = (not ccw) ^ flip
                quads = [(p[0], p[1], p[2])] if n == 3 else [(p[0], p[1], p[2]), (p[0], p[2], p[3])]
                for a, b, c in quads:
                    self.tris.append(((a, c, b) if back else (a, b, c)) + (col,))
            elif kind == "5" and len(tok) >= 14:
                p = _pts(tok[2:14], m)
                self.cond.append(tuple(p))

    def result(self, pid, name, palette=None):
        index, pos, idx = {}, [], []
        colours = {}
        # main colour (16) first, then print colours: each becomes a draw group with its own material
        self.tris.sort(key=lambda tr: (tr[3] != 16, tr[3]))

        def vid(p):
            q = tuple(round(c * SCALE, 4) for c in _out(p))
            if q not in index:
                index[q] = len(pos) // 3
                pos.extend(q)
            return index[q]

        for a, b, c, col in self.tris:
            ia, ib, ic = vid(a), vid(b), vid(c)
            if ia == ib or ib == ic or ia == ic:
                continue
            idx.extend((ia, ib, ic))
            colours[str(col)] = colours.get(str(col), 0) + 1
        groups, start = [], 0
        for code in sorted(colours, key=lambda c: (c != "16", int(c))):
            n = colours[code]; groups.append({"c": int(code), "hex": (palette or {}).get(int(code)), "start": start, "count": n}); start += n
        flat = lambda pts: [round(c * SCALE, 4) for p in pts for c in _out(p)]
        xs, ys, zs = pos[0::3], pos[1::3], pos[2::3]
        bbox = [[min(xs), min(ys), min(zs)], [max(xs), max(ys), max(zs)]] if pos else [[0, 0, 0], [0, 0, 0]]
        return {"id": pid, "name": name, "pos": pos, "idx": idx, "two_sided": self.two_sided,
                "edges": flat([q for e in self.edges for q in e]), "cond": flat([q for c in self.cond for q in c]),
                "bbox": bbox, "colours": colours, "groups": groups if len(groups) > 1 else []}


def _colour(tok, inherited):
    try:
        c = int(tok)
    except ValueError:
        return inherited
    return inherited if c in (16, 24) else c


def _pts(vals, m):
    f = [float(x) for x in vals]
    return [apply(m, (f[i], f[i + 1], f[i + 2])) for i in range(0, len(f), 3)]


def _out(p):
    """LDraw (-y up) to y-up by a 180° turn about x: (x, y, z) -> (x, -y, -z)."""
    return (p[0], -p[1], -p[2])


def palette(lib):
    """LDraw colour code → '#rrggbb' from LDConfig.ldr (empty if the library has none)."""
    f = lib.root / "LDConfig.ldr"
    out = {}
    if f.is_file():
        for line in f.read_text(errors="replace").splitlines():
            t = line.split()
            if len(t) > 6 and t[1] == "!COLOUR" and "CODE" in t and "VALUE" in t:
                out[int(t[t.index("CODE") + 1])] = t[t.index("VALUE") + 1].upper()
    return out


def part_title(lib, pid):
    for line in lib.lines(pid + ".dat"):
        if line.startswith("0 "):
            return line[2:].strip()
    return pid


def bake(lib, pid, text=None):
    b = Baker(lib)
    b.walk(pid + ".dat" if text is None else pid, text=text)
    name = part_title(lib, pid) if text is None else pid
    out = b.result(pid, name, palette(lib) if text is None else {})
    if b.missing:
        out["missing"] = sorted(b.missing)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lib", default=os.environ.get("LDRAW_DIR", "~/.cache/ldraw"))
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--list", type=Path)
    ap.add_argument("--js", action="store_true", help="also write OUT/parts.js (window.PARTS = {...}) for the 3D page")
    ap.add_argument("parts", nargs="*")
    a = ap.parse_args()
    lib = Library(a.lib)
    ids = list(a.parts)
    if a.list:
        ids += [ln.split("#")[0].strip() for ln in a.list.read_text().splitlines() if ln.split("#")[0].strip()]
    a.out.mkdir(parents=True, exist_ok=True)
    allp = {}
    for pid in ids:
        d = bake(lib, pid)
        allp[pid] = {k: d[k] for k in ("pos", "idx", "two_sided", "bbox", "edges", "groups") if d.get(k) is not None}
        (a.out / f"{pid}.json").write_text(json.dumps(d, separators=(",", ":")))
        warn = f"  MISSING {d['missing']}" if d.get("missing") else ""
        print(f"{pid:10s} {len(d['idx']) // 3:6d} tris {len(d['edges']) // 6:5d} edges  {d['name']}{warn}")
    if a.js:
        # file:// pages can't fetch() JSON, so the 3D page loads every part from one script tag
        (a.out / "parts.js").write_text("window.PARTS = " + json.dumps(allp, separators=(",", ":")) + ";\n")


if __name__ == "__main__":
    main()
