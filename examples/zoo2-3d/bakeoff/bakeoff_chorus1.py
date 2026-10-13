"""Chorus 1 drop (25.69–35.69) in Blender/EEVEE, scripted with bpy: the bake-off twin of scenes3d/c02_chorus1.js.

  blender -b -P blender/bakeoff_chorus1.py -- --out out/bakeoff/blender_frames [--frames 0:240] [--still 133]

Same baked LDraw parts (parts/*.json), same face decals (out/faces/*.png), same beat grid (src/config.js) and the same
hit times as the Three.js version. Every frame is a pure function of song time: all transforms/visibility are set per frame.
"""
import bpy, json, math, re, sys, time
from pathlib import Path
from mathutils import Matrix, Vector, Euler

ROOT = Path(__file__).resolve().parents[1]
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
opt = {argv[i].lstrip("-"): argv[i + 1] for i in range(0, len(argv) - 1, 2)}
OUT = ROOT / opt.get("out", "out/bakeoff/blender_frames"); OUT.mkdir(parents=True, exist_ok=True)
cfg = (ROOT / "src/config.js").read_text()
BPM = float(re.search(r"bpm: ([\d.]+)", cfg)[1]); OFF = float(re.search(r"offset: ([\d.]+)", cfg)[1]); BEAT = 60 / BPM
T0, FPS = 25.69, 24

# ---------- maths (same as engine.js) ----------
clamp = lambda x, a=0, b=1: min(b, max(a, x))
lerp = lambda a, b, k: a + (b - a) * k
def ease(k): k = clamp(k); return k * k * (3 - 2 * k)
def easeOut(k): k = clamp(k); return 1 - (1 - k) ** 3
def backOut(k): k = clamp(k); c = 1.7; return 1 + (c + 1) * (k - 1) ** 3 + c * (k - 1) ** 2
seg = lambda x, a, b: clamp((x - a) / (b - a))
frac = lambda x: x - math.floor(x)
hsh = lambda i: frac(math.sin(i * 127.1 + 311.7) * 43758.5453)
bt = lambda k: OFF + k * BEAT
beatPh = lambda t: frac((t - OFF) / BEAT)
pulse = lambda t, s=6: math.exp(-beatPh(t) * s)
st = lambda t, fps=12: math.floor(t * fps) / fps
def kf(x, keys):
    if x <= keys[0][0]: return keys[0][1]
    for i in range(1, len(keys)):
        if x <= keys[i][0]:
            a, va = keys[i - 1]; b, vb = keys[i]; k = ease((x - a) / (b - a))
            return [lerp(u, v, k) for u, v in zip(va, vb)] if isinstance(va, (list, tuple)) else lerp(va, vb, k)
    return keys[-1][1]
def shake(t, amp, f=23): return [amp * math.sin(t * f * 1.3 + 1), amp * math.sin(t * f + 4), amp * .5 * math.sin(t * f * .7 + 2)]
def drift(lt, k=1): return [k * .35 * math.sin(lt * .21 + 1), k * .12 * math.sin(lt * .17), k * .25 * math.sin(lt * .13 + 2)]

# Three.js is y-up with the camera's front at +z; Blender is z-up. Map (x, y, z)three → (x, -z, y)blender.
def V(x, y, z): return Vector((x, -z, y))

# ---------- scene setup ----------
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "BLENDER_EEVEE"
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1920, 1080, 100
sc.render.image_settings.file_format = "JPEG"; sc.render.image_settings.quality = 92
sc.eevee.taa_render_samples = int(opt.get("samples", 32))
sc.eevee.use_shadows = True
sc.view_settings.view_transform = "AgX"; sc.view_settings.look = "AgX - Medium High Contrast"
MODE = opt.get("mode", "basic")   # basic = the first bake-off; unleashed = EEVEE with ray tracing, GI, bevels; cycles = path traced
if MODE in ("unleashed", "cycles"):
    sc.view_settings.view_transform = "Standard"; sc.view_settings.look = "None"; sc.view_settings.exposure = -.2
    sc.eevee.taa_render_samples = int(opt.get("samples", 64)); sc.eevee.use_raytracing = True; sc.eevee.ray_tracing_method = "SCREEN"
    sc.eevee.use_fast_gi = True; sc.eevee.fast_gi_method = "GLOBAL_ILLUMINATION"; sc.eevee.shadow_ray_count = 2
if MODE == "cycles":
    import addon_utils; addon_utils.enable("cycles", default_set=True)
    sc.render.engine = "CYCLES"; prefs = bpy.context.preferences.addons["cycles"].preferences; prefs.compute_device_type = "METAL"; prefs.get_devices()
    for d in prefs.devices: d.use = d.type == "METAL"
    sc.cycles.device = "GPU"; sc.cycles.samples = int(opt.get("samples", 128)); sc.cycles.use_denoising = True; sc.cycles.max_bounces = 6
BEVEL = MODE != "basic"
def bevel(o):
    if not BEVEL or o.type != "MESH": return
    m = o.modifiers.new("bevel", "BEVEL"); m.width = .035; m.segments = 2; m.limit_method = "ANGLE"; m.angle_limit = math.radians(40); m.harden_normals = True
COL = dict(yellow="#F2CD37", teal="#3A9C98", navy="#2D3A6B", mustard="#E8AA38", white="#F4F4F4", black="#1B1B1F", red="#C4281C", orange="#D97757",
           brown="#583927", grey="#A0A5A9", dkgrey="#6C6E68", green="#4B9F4A", dkgreen="#237841", blue="#0055BF", ltblue="#9FC3E9", pink="#E4ADC8",
           magenta="#923978", lilac="#CDA4DE", tan="#E4CD9E", gold="#DBAC34", cream="#F3E7C8", dkorange="#A95500", silver="#C9CACA")

def srgb(h):
    h = h.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= .04045 else ((x + .055) / 1.055) ** 2.4 for x in c] + [1]

MATS = {}
def plastic(hexc, rough=.38, emit=0, metal=0):
    k = (hexc, rough, emit, metal)
    if k in MATS: return MATS[k]
    m = bpy.data.materials.new("p" + hexc); m.use_nodes = True; b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = srgb(hexc); b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal
    b.inputs["Coat Weight"].default_value = .4; b.inputs["Coat Roughness"].default_value = .18
    if emit: b.inputs["Emission Color"].default_value = srgb(hexc); b.inputs["Emission Strength"].default_value = emit
    MATS[k] = m; return m

PARTS = {}
def part_mesh(pid):
    if pid in PARTS: return PARTS[pid]
    d = json.loads((ROOT / "parts" / f"{pid}.json").read_text())
    p = d["pos"]; verts = [(p[i], -p[i + 2], p[i + 1]) for i in range(0, len(p), 3)]
    ix = d["idx"]; faces = [(ix[i], ix[i + 1], ix[i + 2]) for i in range(0, len(ix), 3)]
    me = bpy.data.meshes.new(pid); me.from_pydata(verts, [], faces); me.update()
    me.set_sharp_from_angle(angle=.5); me.shade_smooth() if hasattr(me, "shade_smooth") else None
    for poly in me.polygons: poly.use_smooth = True
    PARTS[pid] = me; return me

def obj(name, mesh=None, parent=None, mat=None):
    o = bpy.data.objects.new(name, mesh); sc.collection.objects.link(o)
    if parent: o.parent = parent
    if mat is not None and mesh is not None:
        o.data = o.data.copy() if mesh.users > 1 and False else o.data
        o.material_slots and None
        if not o.data.materials: o.data.materials.append(mat)
        else: o.material_slots[0].link = "OBJECT"; o.material_slots[0].material = mat
    return o

def part(pid, hexc, name=None, parent=None):
    me = part_mesh(pid)
    if not me.materials: me.materials.append(plastic(COL["white"]))
    o = bpy.data.objects.new(name or pid, me); sc.collection.objects.link(o)
    o.material_slots[0].link = "OBJECT"; o.material_slots[0].material = plastic(hexc)
    if parent: o.parent = parent
    bevel(o)
    return o

def empty(name, parent=None, loc=(0, 0, 0)):
    o = bpy.data.objects.new(name, None); sc.collection.objects.link(o); o.parent = parent; o.location = loc; return o

def build(name, items, parent=None):
    """Static brick build merged into ONE mesh per colour: items [(pid, hexc, x, y, z, ry)] in three.js coords."""
    root = empty(name, parent); bycol = {}
    for pid, c, x, y, z, *r in items: bycol.setdefault(c, []).append((pid, x, y, z, r[0] if r else 0))
    for c, lst in bycol.items():
        V_, F_ = [], []
        for pid, x, y, z, ry in lst:
            me = part_mesh(pid); M = Matrix.Translation(V(x, y, z)) @ Matrix.Rotation(ry, 4, "Z"); n0 = len(V_)
            V_ += [tuple(M @ v.co) for v in me.vertices]; F_ += [tuple(n0 + i for i in p.vertices) for p in me.polygons]
        me = bpy.data.meshes.new(name + c); me.from_pydata(V_, [], F_); me.update(); me.set_sharp_from_angle(angle=.5)
        for poly in me.polygons: poly.use_smooth = True
        me.materials.append(plastic(c)); o = bpy.data.objects.new(name + c, me); sc.collection.objects.link(o); o.parent = root; bevel(o)
    return root

# ---------- faces ----------
IMGS = {}
def face_img(name):
    if name not in IMGS: IMGS[name] = bpy.data.images.load(str(ROOT / "out/faces" / f"{name}.png"))
    return IMGS[name]
def decal_material(img_name):
    m = bpy.data.materials.new("decal"); m.use_nodes = True; nt = m.node_tree; b = nt.nodes["Principled BSDF"]
    tex = nt.nodes.new("ShaderNodeTexImage"); tex.image = face_img(img_name); tex.extension = "CLIP"
    nt.links.new(tex.outputs["Color"], b.inputs["Base Color"]); nt.links.new(tex.outputs["Alpha"], b.inputs["Alpha"])
    b.inputs["Roughness"].default_value = .45; m.blend_method = "BLEND" if hasattr(m, "blend_method") else None
    m.surface_render_method = "BLENDED" if hasattr(m, "surface_render_method") else None
    return m, tex
def half_cylinder(name, r, h, n=40):
    vs, fs = [], []
    for i in range(n + 1):
        a = -math.pi / 2 + math.pi * i / n; x, y = r * math.sin(a), r * math.cos(a)   # three: x = r sin, z = r cos
        vs += [(x, -y, -h / 2), (x, -y, h / 2)]
    for i in range(n): fs.append((2 * i, 2 * i + 2, 2 * i + 3, 2 * i + 1))
    me = bpy.data.meshes.new(name); me.from_pydata(vs, [], fs); me.update()
    uv = me.uv_layers.new()
    for poly in me.polygons:
        for li in poly.loop_indices:
            vi = me.loops[li].vertex_index; uv.data[li].uv = ((vi // 2) / n, vi % 2)
    for p in me.polygons: p.use_smooth = True
    return me

# ---------- the minifig rig (same joint offsets as cast3d.js) ----------
LDU = 1 / 20
def L(x, y, z): return V(x * LDU, -y * LDU, -z * LDU)
class Fig:
    def __init__(self, name, torso, legs, hat=None, hatcol=None, glasses=False, pencil=False):
        self.glasses = glasses
        self.root = empty(name)
        self.body = empty(name + "body", self.root, V(0, 3.6, 0))
        part("3815", legs, parent=self.body).location = L(0, 32, 0)
        self.legR = empty(name + "legR", self.body, L(0, 44, 0)); part("3816", legs, parent=self.legR)
        self.legL = empty(name + "legL", self.body, L(0, 44, 0)); part("3817", legs, parent=self.legL)
        self.upper = empty(name + "upper", self.body); part("973", torso, parent=self.upper)
        self.arm, self.hand, self.grip = {}, {}, {}
        for side, pid, sx in (("R", "3818", -1), ("L", "3819", 1)):
            sh = empty(name + "sh" + side, self.upper, L(sx * 15.552, 9, 0)); sh.rotation_euler = Euler((0, sx * .17, 0))   # three z-rot → blender -y
            sw = empty(name + "arm" + side, sh); part(pid, torso, parent=sw); self.arm[side] = sw
            wr = empty(name + "wr" + side, sw, V(sx * .25, -1.05, .6)); wr.rotation_euler = Euler((math.pi / 4, 0, 0))
            hd = empty(name + "hand" + side, wr); part("3820", COL["yellow"], parent=hd); self.hand[side] = hd
            self.grip[side] = empty(name + "grip" + side, hd, V(0, .1, .45))
        self.head = empty(name + "head", self.upper, L(0, -24, 0)); part("3626c", COL["yellow"], parent=self.head)
        fm, self.facetex = decal_material(("figg_" if glasses else "fig_") + "neutral")
        fo = bpy.data.objects.new(name + "face", half_cylinder(name + "facecyl", .662, .9)); fo.data.materials.append(fm); sc.collection.objects.link(fo)
        fo.parent = self.head; fo.location = V(0, -.68, 0)
        if hat == "beanie": part("41334", hatcol, parent=self.head)
        elif hat == "hair": part("62810", hatcol, parent=self.head)
        self.earPencil = make_pencil(name + "earpencil", .42, self.head) if pencil else None
        if self.earPencil: self.earPencil.location = V(-.72, -.42, -.6); self.earPencil.rotation_euler = Euler((1.42, -.12, 0))   # approx of three (1.42, 0, .12)

    def pose(self, legL=0, legR=0, armL=0, armR=0, armLz=0, armRz=0, head=0, headTilt=0, lean=0, bodyY=0, bodyRoll=0, face="neutral", holdR=None, holdL=None):
        # three rotation.x = -a → blender rotation about x by -a (x axis is shared); three y-rot → blender z-rot; three z-rot → blender -y-rot
        self.legL.rotation_euler = Euler((-legL, 0, 0)); self.legR.rotation_euler = Euler((-legR, 0, 0))
        self.arm["L"].rotation_euler = Euler((-armL, armLz, 0)); self.arm["R"].rotation_euler = Euler((-armR, -armRz, 0))
        self.head.rotation_euler = Euler((-headTilt, 0, head)); self.upper.rotation_euler = Euler((lean, 0, 0))
        self.body.location = V(0, 3.6 + bodyY, 0); self.body.rotation_euler = Euler((0, -bodyRoll, 0))
        self.facetex.image = face_img(("figg_" if self.glasses else "fig_") + face)
        for s, held in (("R", holdR), ("L", holdL)):
            for c in list(self.grip[s].children): c.parent = None; hide(c, True)
            if held is not None: held.parent = self.grip[s]; held.matrix_parent_inverse = Matrix.Identity(4); hide(held, False)

def hide(o, h=True):
    o.hide_render = h
    for c in o.children_recursive: c.hide_render = h

def place(o, x, y, z, ry=0, s=1):
    o.location = V(x, y, z); o.rotation_euler = Euler((0, 0, ry)); o.scale = (s, s, s); hide(o, False)

def make_pencil(name, s, parent=None):
    root = empty(name, parent)
    for (geo, c, y, a, b, h) in (("cyl", COL["pink"], .17, .16, .16, .35), ("cyl", COL["silver"], .43, .165, .165, .18), ("cyl", COL["yellow"], 1.47, .16, .16, 1.9),
                                 ("cone", COL["tan"], 2.67, .16, 0, .5), ("cone", COL["black"], 2.84, .055, 0, .17)):
        bpy.ops.mesh.primitive_cone_add(vertices=6 if c != COL["silver"] else 12, radius1=a * s, radius2=b * s, depth=h * s, location=(0, 0, y * s))
        o = bpy.context.active_object; o.name = name + c; o.data.materials.append(plastic(c, rough=.5)); o.parent = root
    return root

# ---------- props ----------
def door_unit(name, col):
    root = empty(name)
    items = [("3005", COL["white"], x, (r + 1) * 1.2, 0) for r in range(6) for x in (-.5, 4.5)] + [("3024", COL["white"], x + .5, 7.6, 0) for x in range(-1, 5)]
    build(name + "frame", items, root)
    hinge = empty(name + "hinge", root)
    bpy.ops.mesh.primitive_cube_add(size=1); p = bpy.context.active_object; p.scale = (4, .35, 7.1); p.location = V(2, 3.6, 0); p.parent = hinge
    bpy.ops.object.modifier_add(type="BEVEL"); p.modifiers["Bevel"].width = .06; p.modifiers["Bevel"].segments = 2
    p.data.materials.append(plastic(col))
    bpy.ops.mesh.primitive_uv_sphere_add(radius=.22, location=V(3.5, 3.6, .3)); k = bpy.context.active_object; k.parent = hinge; k.data.materials.append(plastic(COL["gold"], .25, metal=.7))
    return root, hinge

def handset():
    root = empty("handset"); m = plastic("#E27A92")
    bpy.ops.mesh.primitive_cylinder_add(radius=.32, depth=3.2, rotation=(0, math.pi / 2, 0)); b = bpy.context.active_object; b.parent = root; b.data.materials.append(m)
    for s in (-1, 1):
        bpy.ops.mesh.primitive_cone_add(radius1=.45, radius2=.55, depth=.7, location=(s * 1.7, 0, -.45)); c = bpy.context.active_object; c.parent = root; c.data.materials.append(m)
    holder = empty("handsetHeld"); root.parent = holder; root.rotation_euler = Euler((0, -math.pi / 2, 0)); root.scale = (.38, .38, .38)
    return holder

def cage():
    root = empty("cage"); m = plastic(COL["gold"], .25, metal=.6)
    for i in range(12):
        a = i / 12 * math.tau; bpy.ops.mesh.primitive_cylinder_add(radius=.08, depth=5, location=V(math.sin(a) * 2.6, 2.9, math.cos(a) * 2.6)); o = bpy.context.active_object; o.parent = root; o.data.materials.append(m)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=2.7, location=V(0, 5.3, 0)); d = bpy.context.active_object; d.scale = (1, 1, .5); d.parent = root; d.data.materials.append(m)
    build("cagebase", [("3958", COL["gold"], 0, .4, 0)], root)
    return root

def pill():
    root = empty("pill")
    for c, y in ((COL["red"], .22), (COL["white"], -.22)):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=.5, location=(0, 0, y)); o = bpy.context.active_object; o.scale = (1, .5, 1.2); o.parent = root; o.data.materials.append(plastic(c))
    return root

def gravestone():
    return build("grave", [("3004", COL["grey"], -.5, 1.2, 0), ("3004", COL["grey"], .5, 1.2, 0), ("3004", COL["grey"], -.5, 2.4, 0), ("3004", COL["grey"], .5, 2.4, 0),
                           ("3062b", COL["grey"], -.5, 3.6, 0), ("3062b", COL["grey"], .5, 3.6, 0), ("3022", COL["dkgrey"], 0, .4, 0)])

class Clawd:
    def __init__(self):
        c = COL["orange"]; self.root = empty("clawd"); self.body = empty("clawdbody", self.root)
        build("clawdblocks", [("3001", c, 0, 2.4 + (r + 1) * 1.2, 0) for r in range(3)], self.body)
        self.legs = []
        for i, x in enumerate((-1.5, -.5, .5, 1.5)):
            lg = empty(f"cleg{i}", self.body, V(x, 2.4, 0)); self.legs.append(lg)
            for k in range(2): part("3062b", c, parent=lg).location = V(0, -k * 1.2, 0)
        self.arms = {}
        for s, k in ((-1, "L"), (1, "R")):
            sh = empty("carm" + k, self.body, V(s * 2, 4.4, 0)); a = part("3004", c, parent=sh); a.location = V(s * .5, .6, 0); a.rotation_euler = Euler((0, 0, math.pi / 2)); self.arms[k] = sh
        bpy.ops.mesh.primitive_plane_add(size=1, location=V(0, 4.5, 1.001), rotation=(math.pi / 2, 0, 0)); scr = bpy.context.active_object; scr.scale = (3.4, 1.7, 1); scr.parent = self.body
        fm, self.tex = decal_material("clawd_neutral"); scr.data.materials.append(fm)
        hs = empty("headset", self.body)
        bpy.ops.mesh.primitive_torus_add(major_radius=2.15, minor_radius=.14, location=V(0, 6, 0), rotation=(math.pi / 2, 0, 0)); band = bpy.context.active_object; band.parent = hs; band.data.materials.append(plastic(COL["black"]))
        bpy.ops.object.mode_set(mode="OBJECT")
        for s in (-1, 1):
            bpy.ops.mesh.primitive_cylinder_add(radius=.5, depth=.3, location=V(s * 2.15, 6, 0), rotation=(0, math.pi / 2, 0)); cup = bpy.context.active_object; cup.parent = hs; cup.data.materials.append(plastic(COL["dkgrey"]))
        # cut the lower half of the torus band with a boolean-free trick: a bisect would cost more code; scale it flat into an arc instead
        band.scale = (1, 1, 1)
    def pose(self, face="neutral", walk=None, armL=0, armR=0, bob=0, roll=0):
        for i, lg in enumerate(self.legs): lg.rotation_euler = Euler((.45 * math.sin((walk + (i % 2) * .5) * math.tau) if walk is not None else 0, 0, 0))
        self.arms["L"].rotation_euler = Euler((0, armL * 1.2, 0)); self.arms["R"].rotation_euler = Euler((0, -armR * 1.2, 0))
        self.body.location = V(0, bob, 0); self.body.rotation_euler = Euler((0, -roll, 0)); self.tex.image = face_img("clawd_" + face)

def scroll_mesh(k, w=3, h=4.4, n=24):
    vs, fs = [], []
    for j in range(n + 1):
        y = h / 2 - h * j / n; v = j / n; z = 0
        if v > k: a = (v - k) * h / .35; y = h / 2 - k * h - math.sin(a) * .35; z = .35 - math.cos(a) * .35
        vs += [V(-w / 2, y, z), V(w / 2, y, z)]
    for j in range(n): fs.append((2 * j, 2 * j + 1, 2 * j + 3, 2 * j + 2))
    return vs, fs

def paper_bird(i):
    root = empty(f"bird{i}"); m = plastic(COL["cream"], .8)
    bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=.25, depth=1.4, rotation=(0, 0, 0)); b = bpy.context.active_object; b.rotation_euler = Euler((math.pi / 2, 0, 0)); b.parent = root; b.data.materials.append(m)
    wings = []
    for s in (-1, 1):
        me = bpy.data.meshes.new("w"); me.from_pydata([V(0, 0, -.5), V(s * 1.4, 0, 0), V(0, 0, .5)], [], [(0, 1, 2)]); me.materials.append(m)
        w = bpy.data.objects.new(f"wing{i}{s}", me); sc.collection.objects.link(w); piv = empty(f"wp{i}{s}", root); w.parent = piv; wings.append((s, piv))
    return root, wings

# ---------- world (stage district) ----------
def world_setup():
    w = bpy.data.worlds.new("sky"); sc.world = w; w.use_nodes = True; nt = w.node_tree
    bg = nt.nodes["Background"]; tc = nt.nodes.new("ShaderNodeTexCoord"); sep = nt.nodes.new("ShaderNodeSeparateXYZ"); ramp = nt.nodes.new("ShaderNodeValToRGB")
    nt.links.new(tc.outputs["Generated"], sep.inputs[0]); nt.links.new(sep.outputs["Z"], ramp.inputs[0]); nt.links.new(ramp.outputs[0], bg.inputs["Color"])
    ramp.color_ramp.elements[0].position = .5; ramp.color_ramp.elements[0].color = srgb("#cfe2f4"); ramp.color_ramp.elements[1].position = .8; ramp.color_ramp.elements[1].color = srgb("#5f9fe0")
    bg.inputs["Strength"].default_value = .9
    if MODE != "basic":
        # world "Generated" z is the view direction's z in -1..1 → map horizon (0) to pale, zenith to deep blue; keep the ambient modest
        mp = nt.nodes.new("ShaderNodeMapRange"); nt.links.new(sep.outputs["Z"], mp.inputs["Value"]); mp.inputs["From Min"].default_value = 0; mp.inputs["From Max"].default_value = .35
        nt.links.new(mp.outputs["Result"], ramp.inputs[0])
        ramp.color_ramp.elements[0].position = 0; ramp.color_ramp.elements[0].color = srgb("#d6e8f6"); ramp.color_ramp.elements[1].position = 1; ramp.color_ramp.elements[1].color = srgb("#4f8fd8"); bg.inputs["Strength"].default_value = .55
    bpy.ops.mesh.primitive_plane_add(size=3000, location=(0, 0, -.42)); g = bpy.context.active_object; g.data.materials.append(plastic("#7fae5a", .9))
    gr = build("ground", [("3958", "#8fc06a", (i - 5.5) * 6, 0, (j - 5.5) * 6 - 10) for i in range(12) for j in range(12)])
    items = []
    for x in range(-14, 15, 2):
        for z in range(-8, 5, 2): items.append(("3068b", COL["lilac"] if z == 4 or abs(x) == 14 else COL["white"], x, .8, z))
        for z in (-8, 4): items.append(("3003", COL["lilac"], x, .4, z))
    build("platform", items)
    for k, (x, z) in enumerate(((-36, -12), (-40, -22), (30, -60), (44, -40), (-18, -48), (14, -20))):
        t = build(f"tree{k}", [("3062b", COL["brown"], 0, 1.2, 0), ("3062b", COL["brown"], 0, 2.4, 0), ("3062b", COL["brown"], 0, 3.6, 0), ("2423", COL["green"] if k % 2 else COL["dkgreen"], 0, 3.8, 0, 0),
                                ("2423", COL["green"], 0, 4.4, 0, 1.6), ("2423", COL["dkgreen"], 0, 5.0, 0, .8)]); place(t, x, 0, z, k)
    # sun (soft key), area fill, rim
    sun = bpy.data.objects.new("key", bpy.data.lights.new("key", "SUN")); sc.collection.objects.link(sun); sun.data.energy = 4.2 if MODE == "basic" else 3.6; sun.data.angle = math.radians(9 if MODE == "basic" else 6)
    sun.data.color = srgb("#fff1dc")[:3]; d = V(-.5, 1, .7).normalized(); sun.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
    rim = bpy.data.objects.new("rim", bpy.data.lights.new("rim", "SUN")); sc.collection.objects.link(rim); rim.data.energy = 1.4; rim.data.color = srgb("#cfe3ff")[:3]
    rim.rotation_euler = V(.5, .6, -.7).normalized().to_track_quat("Z", "Y").to_euler()

# growing buildings: each brick is its own object, shown when its time has come (pure function of t)
def building(name, at, w, d, floors, col, t0, t1):
    bricks = []
    for r in range(floors):
        for i in range(w):
            for j in range(d):
                if 0 < i < w - 1 and 0 < j < d - 1: continue
                win = r % 3 == 1 and i % 2 == 1 and j in (0, d - 1)
                bricks.append(("3005", COL["ltblue"] if win else col, at[0] + i - w / 2 + .5, (r + 1) * 1.2, at[1] + j - d / 2 + .5))
    # merge into one mesh per floor (a floor appears at once): cheaper than one object per brick
    out = []
    per = w * 2 + (d - 2) * 2
    for r in range(floors):
        fl = build(f"{name}f{r}", bricks[r * per:(r + 1) * per]); out.append((lerp(t0, t1, r / floors), fl))
    return out

class Robot:
    def __init__(self, n):
        self.root = empty(f"bot{n}")
        build(f"botbody{n}", [("3003", COL["grey"], 0, 3.6, 0), ("3003", COL["dkgrey"], 0, 2.4, 0), ("3062b", COL["black"], 0, 4.8, 0), ("6141", COL["red"], 0, 5.2, 0)], self.root)
        self.legs = []
        for x in (-.5, .5):
            l = empty(f"botleg{n}{x}", self.root, V(x, 1.2, 0)); part("3005", COL["dkgrey"], parent=l); self.legs.append(l)
        self.carry = build(f"botcarry{n}", [("3001", COL["red"], 0, 0, 0)], self.root); self.carry.location = V(0, 5, .6); self.carry.scale = (.8, .8, .8)
    def pose(self, walk, carry):
        for i, l in enumerate(self.legs): l.rotation_euler = Euler((.5 * math.sin((walk + i * .5) * math.tau), 0, 0))
        hide(self.carry, not carry)

# ---------- build everything once ----------
t_build = time.time()
world_setup()
DOORS = [dict(x=-9, col="#9C7A5C", hit=bt(40.5), inside="#FFD27A"), dict(x=-2, col="#6B3B4A", hit=bt(41.5), inside="#FF7A3A"), dict(x=5, col="#E7A6C0", hit=bt(42.5), inside="#FFE3EE")]
for i, d in enumerate(DOORS):
    d["root"], d["hinge"] = door_unit(f"door{i}", d["col"])
    bpy.ops.mesh.primitive_plane_add(size=1, rotation=(math.pi / 2, 0, 0)); g = bpy.context.active_object; g.scale = (4, 7.1, 1); g.data.materials.append(plastic(d["inside"], emit=1.6)); d["glow"] = g
THROWS = [dict(o=cage(), at=bt(44), dodge="lean", s=.25), dict(o=gravestone(), at=bt(45), dodge="duck", s=.55), dict(o=pill(), at=bt(46), dodge="side", s=.55)]
BURST = 34.73
pip = Fig("pip", COL["teal"], COL["navy"], "beanie", COL["mustard"], glasses=True, pencil=True)
CROWD_T = [COL["red"], COL["blue"], COL["green"], COL["magenta"], COL["orange"], COL["lilac"], COL["white"], COL["dkorange"]]
crowd = [Fig(f"crowd{i}", CROWD_T[i % 8], [COL["navy"], COL["black"], COL["tan"], COL["dkgrey"]][i % 4], "beanie" if i % 3 == 0 else "hair",
             [COL["red"], COL["blue"], COL["green"]][i % 3] if i % 3 == 0 else [COL["brown"], COL["black"], COL["dkorange"], COL["tan"]][i % 4]) for i in range(8)]
walkers = [Fig(f"walk{i}", CROWD_T[(i + 3) % 8], COL["navy"], "hair", COL["brown"]) for i in range(4)]
clawd = Clawd()
held_handset = handset(); held_pencil = empty("heldPencil"); hp = make_pencil("hp", .55, held_pencil); hp.location = V(0, -.6 * .55 / .42, 0)
sm = bpy.data.meshes.new("scroll"); vs, fs = scroll_mesh(1); sm.from_pydata(vs, [], fs); sm.update(); sm.materials.append(plastic(COL["cream"], .85))
scroll_o = bpy.data.objects.new("scroll", sm); sc.collection.objects.link(scroll_o)
birds = [paper_bird(i) for i in range(18)]
B1 = building("bA", (-26, -34), 6, 4, 10, COL["red"], 0, 220); B2 = building("bB", (22, -40), 8, 4, 14, COL["blue"], 10, 240); B3 = building("bC", (-4, -62), 10, 6, 18, COL["tan"], 0, 260)
bots = [Robot(i) for i in range(7)]
cam_o = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); sc.collection.objects.link(cam_o); sc.camera = cam_o
cam_o.data.sensor_fit = "VERTICAL"; cam_o.data.dof.use_dof = True; cam_o.data.dof.aperture_fstop = float(opt.get("fstop", .9)); cam_o.data.clip_end = 4000
print(f"BUILD {time.time() - t_build:.1f}s")

def look_at(o, eye, target, fov):
    o.location = eye; o.rotation_euler = (target - eye).to_track_quat("-Z", "Y").to_euler(); o.data.angle_y = math.radians(fov)

def frame(t):
    lt, q = t - T0, st(t)
    # buildings
    for blds in (B1, B2, B3):
        for ta, fl in blds: hide(fl, t < ta)
    # robots (2 per site, 3 for the big one) shuttle bricks
    sites = [((-26, -34), 6, 4, 2), ((22, -40), 8, 4, 2), ((-4, -62), 10, 6, 3)]; bi = 0
    for at, w, d, nb in sites:
        for i in range(nb):
            r = bots[bi]; bi += 1; ph = frac(q * .25 + i / nb); out = ph < .5; k = ease(ph * 2) if out else ease(2 - ph * 2)
            x = at[0] + lerp(w * .5 + 4, w * .5 + .5, k) * (-1 if i % 2 else 1); z = at[1] + d * .5 + 1.5 + i * .8
            r.pose(q * 2 + i, out); place(r.root, x, 0, z, (-1 if out else 1) * (-1 if i % 2 else 1) * math.pi / 2)
    # passers-by on a loop path
    path = [(-30, -18), (30, -18), (30, -24), (-30, -24)]; segs = [(path[k], path[(k + 1) % 4]) for k in range(4)]; lens = [math.dist(a, b) for a, b in segs]; tot = sum(lens)
    for i, f in enumerate(walkers):
        dd = frac((q * 1.6 + hsh(i) * tot) / tot) * tot; k = 0
        while dd > lens[k]: dd -= lens[k]; k += 1
        (a, b), u = segs[k], dd / lens[k]; s = math.sin((q * 1.6 / 1.4 + hsh(i)) * math.tau)
        f.pose(legL=.5 * s, legR=-.5 * s, armL=-.45 * s, armR=.45 * s, face="joy" if i % 2 else "neutral")
        place(f.root, lerp(a[0], b[0], u), 0, lerp(a[1], b[1], u), math.atan2(b[0] - a[0], b[1] - a[1]))
    # doors
    for i, d in enumerate(DOORS):
        before = t < d["hit"]; ajar = .12 * ease(seg(q, d["hit"] - .45, d["hit"] - .1)) if before else 0; burst = 0 if before else seg(t, d["hit"], d["hit"] + .9)
        h = d["hinge"]; h.location = (0, 0, 0); h.rotation_euler = Euler((0, 0, -ajar * 1.9))
        if burst > 0:
            k = easeOut(burst); h.location = V(-1.5 * k + math.sin(i + 1) * 2 * k, 3 * k - 9 * burst * burst, 9 * k)
            h.rotation_euler = Euler((-1.4 * k, -2.2 * k * (hsh(i + 2) - .5), (hsh(i + 1) - .5) * 2 * k))
        place(d["root"], d["x"], .8, -6); place(d["glow"], d["x"] + 2, .8 + 3.6, -6.3)
    # Pip
    px = kf(q, [(25.7, -2), (27.6, -2), (28.0, 0), (30.4, 0)]); pz = 1; pp = dict(face="determined"); pry = 0
    for d in DOORS:
        k = seg(q, d["hit"] - .22, d["hit"] + .05) * (1 - seg(q, d["hit"] + .2, d["hit"] + .4))
        if d["hit"] - .3 < q < d["hit"] + .4: pry = math.atan2(d["x"] + 2 - px, -6 - pz) * .6; pp.update(legR=1.3 * k, armL=.6 * k, armR=-.4 * k, lean=-.15 * k, face="angry")
    for th in THROWS:
        k = ease(seg(q, th["at"] - .25, th["at"])) * (1 - ease(seg(q, th["at"] + .3, th["at"] + .55)))
        if k > 0:
            if th["dodge"] == "lean": pp.update(lean=-.55 * k, armL=1.2 * k, armR=1.2 * k, bodyY=-.3 * k)
            if th["dodge"] == "duck": pp.update(bodyY=-1.4 * k, legL=1.4 * k, legR=1.4 * k, lean=.35 * k)
            if th["dodge"] == "side": pp.update(bodyRoll=.45 * k, armL=2.2 * k)
            pp["face"] = "shocked"
    if 30.4 <= q < 32.95:
        b = pulse(t, 5); pp.update(armR=1.55, armL=.6 + .5 * b, bodyY=-.12 * b, headTilt=-.15 * b, face="sing" if beatPh(t) < .5 else "joy", holdR=held_handset)
    if q >= 32.95:
        sc_ = math.sin(q * 40) if 33.55 < q < BURST else 0
        pp.update(face="joy" if q > BURST else "determined", armR=1.0 + .25 * sc_ if q > 33.3 else kf(q, [(32.95, 0), (33.3, 2.6)]), armRz=.15 * sc_, head=.5, armL=2.8 if q > BURST else 0,
                  holdR=held_pencil if q > 33.2 else None)
    hide(held_handset, True); hide(held_pencil, True)
    pip.pose(**pp); hide(pip.earPencil, q >= 33.2); place(pip.root, px, .8, pz, .9 if q >= 32.95 else pry)
    # throws
    for i, th in enumerate(THROWS):
        o = th["o"]; k = seg(t, th["at"] - .7, th["at"] + .5)
        if k <= 0 or k >= 1: hide(o, True); continue
        x, y, z = lerp(16, px - 2 + i, k), lerp(5, 2.5, k) + 5 * math.sin(k * math.pi), lerp(18, -20, k)
        place(o, x, y, z, k * 6, th["s"]); o.rotation_euler = Euler((k * 7, 0, k * 6))
    # crowd
    for i, f in enumerate(crowd):
        tb = bt(48 + i // 2); k = backOut(seg(q, tb, tb + .25))
        if k <= 0: hide(f.root, True); continue
        x = (1 if i % 2 else -1) * (3 + (i // 2) * 2.4); z = -2.5 - (i % 3)
        f.pose(face="joy", armL=2.6 + .3 * math.sin(q * 8 + i) if q > 31 else 0, armR=2.6 + .3 * math.sin(q * 8 + i + 1) if q > 31 else 0, bodyY=-4 * (1 - k) + .25 * pulse(t, 8))
        place(f.root, px + x, .8, z, -x * .05)
    # Clawd + scroll
    if q >= 32.6:
        k = ease(seg(q, 32.6, 33.2)); un = ease(seg(q, 33.0, 33.5)); torn = q > BURST
        sh = shake(t, .4 * math.exp(-(t - BURST) * 4)) if q >= BURST else [0, 0, 0]
        clawd.pose(face="shocked" if torn else "fear" if q > 33.6 else "smug", armL=.9, armR=.9, walk=q * 3 if k < 1 else None, bob=.2 * pulse(t, 6), roll=sh[0] * .05)
        place(clawd.root, lerp(14, 7.5, k) + sh[0], .8, -1, -.5)
        if not torn:
            vs, fs = scroll_mesh(.05 + .95 * un); sm.clear_geometry(); sm.from_pydata(vs, [], fs); sm.update(); place(scroll_o, lerp(14, 7.5, k) - 3.2, .8 + 5.6, 1.4, -.9)
        else: hide(scroll_o, True)
    else: hide(clawd.root, True); hide(scroll_o, True)
    for i, (b, wings) in enumerate(birds):
        if t < BURST: hide(b, True); continue
        u = t - BURST; sx, sy = 3.9 + (hsh(i) - .5) * 2.4, 5.5 + hsh(i + 7) * 3
        a = .8 * math.sin((q * 3 + hsh(i)) * math.tau)
        for s, piv in wings: piv.rotation_euler = Euler((0, -s * a, 0))
        place(b, sx + (hsh(i + 3) - .5) * 16 * u, sy + 6 * u + 1.2 * u * u, 1.6 + (hsh(i + 5) - .1) * 10 * u, (hsh(i + 3) - .5) * 2, .9)
    # camera
    hs = [0, 0, 0]
    for h in [d["hit"] for d in DOORS] + [th["at"] for th in THROWS] + [32.76, 33.04, BURST]:
        if t > h: s = shake(t, .35 * math.exp(-(t - h) * 7)); hs = [a + b for a, b in zip(hs, s)]
    p = kf(t, [(25.69, [-2, 6, 28]), (27.6, [-1, 5, 20]), (29.0, [12, 4, 14]), (30.4, [8, 2.4, 11]), (32.95, [1, 4.2, 15]), (34.6, [1.5, 5, 17]), (35.66, [0, 9, 22])])
    l = kf(t, [(25.69, [-2, 4, -4]), (27.6, [-2, 3.5, -2]), (29.0, [0, 3, 0]), (30.4, [0, 3.6, 0]), (32.95, [2.5, 4.8, 0]), (34.6, [3.2, 6, 0]), (35.66, [3, 10, 0])])
    dr = drift(lt, .6); eye = V(p[0] + dr[0] + hs[0], p[1] + dr[1] + hs[1], p[2] + dr[2]); tgt = V(l[0] + hs[0] * .3, l[1] + hs[1] * .3, l[2])
    look_at(cam_o, eye, tgt, kf(t, [(25.69, 32), (30.4, 38), (32.95, 30), (35.66, 36)]))
    cam_o.data.dof.focus_distance = (V(px, 4, pz) - eye).length

# ---------- render ----------
if "still" in opt: rng = [int(x) for x in opt["still"].split(",")]
else: a, b = map(int, opt.get("frames", "0:240").split(":")); rng = range(a, b)
times = []
for n in rng:
    t = T0 + n / FPS; t1 = time.time(); frame(t)
    sc.render.filepath = str(OUT / f"f{n:05d}.jpg"); bpy.ops.render.render(write_still=True); times.append(time.time() - t1)
    print(f"FRAME {n} t={t:.2f} {times[-1]:.2f}s", flush=True)
print(f"DONE {len(times)} frames, mean {sum(times) / len(times):.2f} s/frame (first {times[0]:.2f}s incl. shader compile)")
