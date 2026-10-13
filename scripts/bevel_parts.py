"""Bevel baked LDraw parts in Blender (offline, once) so the real-time engine gets real rounded brick edges.

  blender -b -P scripts/bevel_parts.py -- PARTS_DIR [--width 0.035] [--segments 2] [--only 3001,3626c]

For every PARTS_DIR/<id>.json (from ldraw_bake.py): build the mesh, merge near-duplicate vertices, add a Bevel modifier
(angle-limited, harden normals), apply it, triangulate, and write back pos/idx plus per-vertex normals ("nrm") and
"bevel": width. The original is kept as <id>.raw.json the first time, so re-running starts from the raw geometry.
Then re-run ldraw_bake.py's --js step equivalent: this script rewrites PARTS_DIR/parts.js itself.
Why Blender only offline: in the bake-off, Blender's bevels + GI looked best but rendered ~100x slower than Three.js.
"""
import bpy, bmesh, json, math, sys
from pathlib import Path

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
D = Path(argv[0]); opt = {argv[i].lstrip("-"): argv[i + 1] for i in range(1, len(argv) - 1, 2)}
WIDTH, SEG = float(opt.get("width", .035)), int(opt.get("segments", 2))
only = set(opt["only"].split(",")) if "only" in opt else None
SKIP_BEVEL = {"2423", "30176"}   # leafy plants: thin geometry, a bevel only adds triangles

bpy.ops.wm.read_factory_settings(use_empty=True)
done = []
for f in sorted(D.glob("*.json")):
    if f.name.endswith(".raw.json"): continue
    pid = f.stem
    if only and pid not in only: continue
    raw = D / f"{pid}.raw.json"
    if not raw.exists(): raw.write_text(f.read_text())
    d = json.loads(raw.read_text()); p, ix = d["pos"], d["idx"]
    me = bpy.data.meshes.new(pid); me.from_pydata([tuple(p[i:i + 3]) for i in range(0, len(p), 3)], [], [tuple(ix[i:i + 3]) for i in range(0, len(ix), 3)]); me.update()
    G = d.get("groups") or []
    for gi, g in enumerate(G):   # print colours ride along as material slots, so the bevel keeps them apart
        me.materials.append(bpy.data.materials.new(f"g{gi}"))
        for fi in range(g["start"], g["start"] + g["count"]): me.polygons[fi].material_index = gi
    o = bpy.data.objects.new(pid, me); bpy.context.scene.collection.objects.link(o); bpy.context.view_layer.objects.active = o; o.select_set(True)
    bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=.002)
    bmesh.ops.dissolve_limit(bm, angle_limit=math.radians(.5), verts=bm.verts, edges=bm.edges, delimit={'MATERIAL'})   # coplanar triangles → ngons: cleaner bevels
    bm.to_mesh(me); bm.free()
    if pid not in SKIP_BEVEL and not pid.startswith("3626"):   # heads are round: nothing to bevel, and prints must stay exact
        m = o.modifiers.new("b", "BEVEL"); m.width = WIDTH; m.segments = SEG; m.limit_method = "ANGLE"; m.angle_limit = math.radians(40); m.harden_normals = True; m.miter_outer = "MITER_ARC"
        bpy.ops.object.modifier_apply(modifier="b")
    me.set_sharp_from_angle(angle=math.radians(35))
    t = o.modifiers.new("t", "TRIANGULATE"); t.keep_custom_normals = True; bpy.ops.object.modifier_apply(modifier="t")
    me = o.data
    # split vertices per corner normal (export what Blender would shade)
    normals = [tuple(round(c, 3) for c in l.normal) for l in me.loops] if hasattr(me.loops[0], "normal") else None
    key, pos, nrm, idx, groups = {}, [], [], [], []
    polys = sorted(me.polygons, key=lambda q: q.material_index)
    for gi, g in enumerate(G):
        n = sum(1 for q in polys if q.material_index == gi); groups.append({**g, "start": sum(x["count"] for x in groups), "count": n})
    for poly in polys:
        for li in poly.loop_indices:
            v = me.vertices[me.loops[li].vertex_index].co; n = me.corner_normals[li].vector if hasattr(me, "corner_normals") else me.loops[li].normal
            k = (round(v.x, 4), round(v.y, 4), round(v.z, 4), round(n.x, 2), round(n.y, 2), round(n.z, 2))
            if k not in key: key[k] = len(pos) // 3; pos += k[:3]; nrm += [round(n.x, 3), round(n.y, 3), round(n.z, 3)]
            idx.append(key[k])
    d.update(pos=pos, idx=idx, nrm=nrm, groups=groups, bevel=WIDTH if pid not in SKIP_BEVEL else 0)
    f.write_text(json.dumps(d, separators=(",", ":")))
    done.append((pid, len(idx) // 3))
    bpy.data.objects.remove(o)
# rebuild parts.js (the page loads every part from one script tag)
allp = {}
for f in sorted(D.glob("*.json")):
    if f.name.endswith(".raw.json"): continue
    d = json.loads(f.read_text()); allp[f.stem] = {k: d[k] for k in ("pos", "idx", "two_sided", "bbox", "edges", "nrm", "groups") if k in d}
(D / "parts.js").write_text("window.PARTS = " + json.dumps(allp, separators=(",", ":")) + ";\n")
for pid, n in done: print(f"BEVEL {pid:10s} {n:6d} tris")
print(f"DONE {len(done)} parts")
