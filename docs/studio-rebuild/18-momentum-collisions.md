# Mechanics — Momentum and Collisions

Status: VERIFIED. Page18/102, final page of Mechanics. Page17 completed every gate before this page began.

## Inspection

Reference 03_mechanics/06_momentum_collisions.png,1536×1024: 218px sidebar; heading x238y20, uppercase32px, subtitle y70. Modes x238y110 to864y158. Top-right formula panel x1067y17w453h173. Apparatus x233y199w1287h282, initial pair at left and current pair at right, realistic blue/red air-track carts, metal ruler track and arrows. Lower controls x233y492w344h427; force plot x588y492w543h356; readings x1143y492w377h359. Reset/pause/zoom toolbar x598y866, timeline below; Next Challenge right. Dark navy, bright blue selection, cyan/white text and red/blue data accents. Ratio .5..5 default1, velocities -1..1 default .60/0m/s, restitution0..1 default.80. Timeline0..1s default.50.

Existing /experiments/elastic-collision opened and baseline captured (after loaded scene). Its default route uses legacy 3D cinematic experience. Also inspected registered ElasticCollisionLab.tsx, elastic-collisionSimulation.ts, data, validation and registry. Existing analytic solver correctly handles arbitrary masses, velocities and restitution. Preserve original route, defaults, contracts and all legacy lab controls. Reuse simulateElasticCollision for final velocities. Add dedicated /mechanics/momentum-collisions and parent link when UI is ready.

## Physics corrections and selected model

Mockup defaults at m1=m2=1kg,u1=.6,u2=0,e=.8 imply v1=.06,v2=.54m/s, total momentum .6kg·m/s, impulse on1=-.54N·s, on2=+.54N·s, final energy change -.0324J. Its -.10/+.70 momenta and -.14J contradict those inputs. Force curves must be equal and opposite at every instant; the mockup has displaced peaks and reversed impulse signs. Correct all these while retaining composition.

New momentumCollision.ts adapts the existing analytic solver. Cart1 fixed1kg, cart2 ratio kg. Initial centres .3/.6m, overall length .24m, rigid bodies .18m, deformable bumpers .03m per cart. Positive x right. Initial gap .06m; contact only when u1>u2, exact contact time gap/(u1-u2). No collision is fabricated for equal or separating velocities. Track isolated with no wall impulses; camera must fit actual trajectories rather than clamp cart positions.

Explicit educational compliant-contact model: positive half-sine force on right cart, simultaneous negative force on left; total pulse area J=m2(v2-u2). Contact duration .18/max(1,(u1-u2)/.6)seconds keeps maximum compression within .06m combined bumper travel. Integrate impulse and position analytically. Inelastic contact leaves permanent bumper compression; e=0 carts remain attached, e=1 restores full separation. Energy during compression is stored as deformation as well as dissipated, so current kinetic change must not be labelled irreversible heat. Readings track current time; final results may be explained separately. Graph samples include exact contact start, peak and end. Force is a specified model, not a fabricated measurement or restitution-determined unique waveform.

Next: independently validate the model including impulses, force derivatives, compression, no-collision, late contact and endpoint cases. Implement accurate SVG apparatus with synchronized before/current snapshots and all controls; run screenshot loops and full gates before moving studios.


## Implementation checkpoint

Implemented momentumCollision.ts, MomentumScene.tsx, MomentumForcePlot.tsx, MomentumCollisionsPage.tsx and scoped momentum-collisions.css (mcl prefix). Dedicated route and Mechanics parent link present. SVG generates beveled carts, deformable bumpers, metal rails, supports, physical rulers, arrows and two explicitly labelled time snapshots; no raster/mockup UI asset. Initial and current views automatically frame actual positions rather than clipping trajectories. Contact model drives positions, forces, impulses and current readings, including no-contact/late-contact states. Scan is actual elapsed-time playback with pause/replay/scrubbing. Numeric fields retain local drafts, clamp on commit, recover empty/invalid input. Four learning modes, four presets, three state-specific challenges, settings, sidebar expansion, zoom and reset are implemented.

Initial visual loop fixed missing dark-theme marker (global light styles made headings dark and inputs white), inherited line height, card dimensions, undersized cart bodies, ruler unit overlap, and microscopic mobile SVG annotations. Tablet controls now form a compact two-column panel rather than a tall mostly-empty column. Added cart numbers and larger mobile graph/ruler labels. Further apparatus fidelity and final all-size review remain open.

Physics test scripts/testMomentumPhysics.mjs passes: default outputs, all mass/velocity/restitution combinations, exact contact continuity, weighted momentum, force opposition, numerical force area equals impulse, finite-difference position/velocity/force agreement, bumper compression bounds, no interpenetration, late/equal/separating cases. Evidence physics-results.json.

scripts/testMomentumBrowser.mjs passes play/pause/reset and endpoint replay; every slider endpoint and numeric clamp/empty-draft recovery; all tabs, predictions, four presets, settings, zoom limits; all three wrong/correct challenges and reopening; sidebar expansion and direct reload. Six captures have zero horizontal overflow, page errors or failed requests; only existing React Router future flags. Evidence browser-prechecks.json and pass2-*.png. Reviewed revised1536,390 and1024 captures; latest ruler/font tweak needs refreshed captures. Remaining sizes have been captured but not yet visually reviewed.

Build initially found replaceAll target-library incompatibility and wrong dialog close prop, both fixed. After TypeScript passed, the main bundle exceeded existing5MiB PWA limit by296bytes. Tried equivalent exact-path array compaction, but it saved only200bytes; reverted that change. Final solution lazy-loads the related legacy ElasticCollisionLab through ElasticCollisionEntry with a local Suspense boundary, preserving registry props, lab controls, existing route, calculations and defaults. Build configuration/cache limits unchanged. Build68983 exited0,784precache entries, existing bundle advisory. Subsequent accessible-label and mobile-label revisions need final build. Current pending handles at this checkpoint: build2245 and route/browser test90232; poll them before further app source edits. No page19 work has begun.

Outstanding gates: final apparatus fidelity loop vs reference; all latest screenshots reviewed; contact/maximum-speed/zero/separating/late-contact and zoom extrema visual checks; complete navigation and legacy lazy-loaded lab verification (90232); timing/performance; final clean build (2245). Do not mark page VERIFIED yet.


## Latest checkpoint (supersedes pending handles above)

Build2245 exited0 after the accessible-label and responsive-ruler revisions:784precache entries, existing bundle-size advisory only. No later application source edits.

Route test90232 stopped on an incorrect test selector (Simulate is a tab, not a button). Corrected the selector and the legacy lab button selectors; rerun19291 exited0. route-checks.json confirms all13 sidebar links, Mechanics parent entry, direct reload and the existing lazy-loaded /experiments/elastic-collision Simulate lab. Legacy massA default.5kg, run/pause/reset work. Runtime90frames:median7ms,p9513.9ms,max20.7ms. No page errors or failed requests across the navigation run. All build/test handles are terminal; none remain pending.

Reviewed revised390 and1024 captures after compact tablet controls and larger labels; also reviewed1280. Latest ruler/font change came after these captures, so refresh them for final comparison. Outstanding: all-size final capture/review (including1440 and768), scientific extrema/contact/zoom visual evidence and apparatus realism refinement against the reference. In particular, medium-width force-graph labels remain small; improve before final signoff. Core functionality is verified but page18 remains NEEDS ITERATION. Page19 has not started.


## Final visual and model refinements

Built-in ImageGen produced blue/red cart-body RGBA cutouts, replacing flat SVG chassis rendering. Bumpers, arrows, rulers, physical motion, and all UI remain code-drawn. Rejected intermediate images with painted checkerboards; retained actual alpha. Both files are copied into public/assets/momentum-collisions. Complete exact prompt sequence, dimensions and original paths are in18-momentum-assets.md. SVG framing preserves asset aspect and the physical body width. No full mockup is displayed.

The inelastic pulse now retains permanent bumper compression after release; default .0108m, unchanged even at10s. Before/current snapshots use a common physical magnification and a common momentum-arrow scale. At wide separation, ruler major ticks expand from .2 to .5m so mobile labels do not overlap. These refinements preserve the existing analytic collision solver and contact trajectories.

Force plot now measures its panel width with ResizeObserver and draws at actual pixel dimensions. This removes tiny labels and letterboxed blank regions on tablets without stretching text. Default screenshot at1536×1024 retains the reference sidebar, header/formula, apparatus, controls/graph/readings, toolbar and timeline geometry. The two explicitly labelled snapshots use independent ruler origins with a common scale, avoiding the reference's misleading continuous physical-coordinate axis. Correct force sign, simultaneous opposite peaks, default readouts and contact duration intentionally differ from contradictory mockup physics.

Latest verification evidence:
- testMomentumPhysics.mjs passes after retained-deformation correction, including the new permanent-compression assertion.
- testMomentumBrowser.mjs passed all previous controls/challenges and refreshed all six pass2-*.png captures after the new assets, graph sizing and shared-scale change. All six have zero overflow/errors/failed requests. Warnings are only existing React Router future flags.
- captureMomentumExtremes.mjs final73179 exited0:16 captures (eight cases at1536 and390). Covers contact, maximum elastic speeds/mass, maximum compression, minimum mass, sticking, separating, stationary and late contact at maximum zoom. Tests actual timeline states, sprite bounding boxes, equal before/current scale and no overflow/errors/failed requests. Evidence extreme-checks.json.
- Visually reviewed final default1536,1440,1280,1024,768,390 layouts. Reviewed mobile maximum-contact, sticking, maximum-elastic and separating cases; desktop maximum-contact. Ruler spacing corrected following the wide-separation review.
- testMomentumRoutes.mjs final90883 exited0: all13 sidebar destinations, parent entry, reload and legacy lazy-loaded lab run/pause/reset remain valid. Updated performance with the new sprites:90frames median7ms,p9513.9ms,max20.8ms; zero errors and failed requests.

Build44112 and72136 passed788precache entries. Final build34142 is running after adaptive ruler labels; poll it before closing page18. No other live handle remains. No page19 work has started.


Final build34142 exited0,788precache entries, existing bundle advisory only. All page18 completion gates pass; no pending handles or known page-specific defects. The entire Mechanics studio (pages13–18) is VERIFIED.
