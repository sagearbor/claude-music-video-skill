# zoo2-3d — "Please Select Your Ending": brick-world storyboard (3D engine)

**Same song, same story** as the 2D video (`examples/zoo2/STORYBOARD.md`): Clawd, the Future's customer-service bot,
offers humanity three endings (Zoo, Extinction, Bliss). Pip turns down every one, rallies the neighbours, builds, and
finally writes the ending while Clawd holds the lamp.

**What changes in 3D:** the whole video is **one continuous brick world** that the camera flies through, like a single take.
Each chapter is a *district* along a winding route. Between chapters the camera doesn't cut: it lifts off, flies over the
living world, and lands in the next district. **There are no hard cuts at all:** the camera path is continuous for the whole
song. At the three chorus drops the camera whip-flies into the stage and slams to a stop exactly on the drop beat (shake +
a short white flash on landing). Inside a chapter, too, it's one continuous camera path.

**Look:** brick-toy stop-motion. LDraw parts with a clearcoat plastic sheen, soft studio key light with soft shadows,
shallow depth of field, saturated toy colours. Characters animate **on twos** (`st(t)`, 12 fps steps); the camera moves
smoothly. Faces are swappable 2D decals (14 expressions). Karaoke bar as in 2D (a yellow plastic rim).

**The living world:** nothing in the background is static. Robots raise brick buildings that grow across the **whole
song** (so every time the camera flies past a site, it is further along), farmers sow fields that sprout, people stroll.
A robot's cotton-wool smoke trail swirls into the words "AI TAKEOVER", then a doofus backs into it and breaks it up
(the doom verse).

**Motif:** Pip's pencil (behind the right ear) and the phone handset. The phone desk opens and closes the video.

## Cast
| Who | Build | Arc |
|---|---|---|
| **Pip** | Minifig: teal torso, navy legs, mustard knit cap, round glasses on the face decal, pencil behind the ear | Unimpressed → defiant → rallying → building → writing |
| **Clawd** | Terracotta block body (three 2×4 bricks), four round-brick legs, side arms, screen face. Costume per chapter: headset → keeper cap → reaper hood → halo | Smug salesbot → flustered → outvoted → curious → teammate |
| **The crowd** | Minifigs in 8 torso colours, hair or caps | Appear one by one until they chant "WE DO!" |
| **Robots** | Grey 2×2 brick bots with a cyan visor | The background workforce, building everything |

## World map (district centres, world x/z; 1 unit = 1 stud)
```
                       moon (far above: rocket flight)  [  0, 900] y=+300
   doom office [-220,-200]     bliss spa [0,-280]      roast club [220,-200]
         zoo [-200, -20]           STAGE [0, 0]         farm [220, -20]
                                 desk  [0, 150]
```

## Chapters (one sub-agent per row; c00 + c11 paired)
| # | File | Time | District | Seam IN → OUT |
|---|---|---|---|---|
| 1 | c00_intro | 0:00–0:25.69 | desk → three doors on the stage edge | iris in from black → whip `F0` desk→stage, slam on the drop |
| 2 | c02_chorus1 | 0:25.69–0:35.66 | stage | `F0` landing → `F1` stage→zoo (done: bake-off shot) |
| 3 | c03_zoo | 0:35.66–1:16.83 | zoo (night) | `F1` → whip `Fz` zoo→stage, slam on the drop |
| 4 | c04_chorus2 | 1:16.83–1:36.38 | stage, escalated (fireworks, bigger crowd, seeds) | `Fz` landing → `F2` stage→doom |
| 5 | c05_doom | 1:36.38–1:57.40 | doom office (red), smoke-word gag | `F2` → `F3` doom→bliss |
| 6 | c06_bliss | 1:57.40–2:18.11 | bliss spa (pink, painted-sky dome) | `F3` → whip `Fb` bliss→stage, slam on the drop |
| 7 | c07_chorus3_roast | 2:18.11–2:48.35 | stage at sunrise → roast club | `Fb` landing → `F4` roast→farm |
| 8 | c08_dutch | 2:48.35–3:09.17 | Lancaster farm (barn raising, buggy, hex sign) | `F4` → `F5` rocket farm→moon |
| 9 | c09_moon | 3:09.17–3:34.94 | moon seed vault | `F5` → continuous into the bridge (same district) |
| 10 | c10_bridge_final | 3:34.94–4:09.41 | moon: bridge, **2D flatten**, final chorus (barn on the moon, Earth in the sky) | continuous → `F6` moon→desk |
| 11 | c11_outro | 4:09.41–4:29.61 | desk at night, lamp, notebook | `F6` → iris out on the pencil |

## The bridge flatten (c10)
"Who…? (WE DO!)" adds a neighbour beside Pip on each shout. From 3:34.9 the dial `flat` ramps 0 → 1 while the light
drops to black: the world squashes into a paper cut-out, toon shading and ink outlines come in. At "So who writes the
ending?" (about 3:45) everything is black except a spotlight on the flat Pip and his pencil. On the final-chorus drop
(3:47.47) flash, and `flat` snaps back to 0: full 3D, barn on the moon, confetti.
