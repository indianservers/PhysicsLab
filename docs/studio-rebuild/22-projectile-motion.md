# Motion & Kinematics - Projectile Motion

Status: VERIFIED, page22/102. Page21 verified before starting. Fourth of six pages in04_motion_kinematics. No later page started.

## Reference and existing implementation inspected

Reference04_projectile_motion.png at1536x1024. Sidebar233px; main x255 width1263. Header title/subtitle and top-right gravity preset panel332x87. Modes full-width y117 height45. Main photographic field scene y172 height470: sky, mountains, tree-lined playing field, cannon lower-left, target lower-right. Cyan dashed arc, white ball at apex, height dashed vertical, ground distance ruler, launch vector components and upper-right legend. Three panels below y653 height263: controls406, live readings524, formula313. Footer y933 height69: Reset, Pause, Zoom-/+, Next Challenge. Default controls speed46.4m/s, angle33deg, gravity9.81. Limits speed10..100, angle0..90, gravity1.62..24.79.

Reference is scientifically inconsistent: those inputs imply vx38.9143, vy25.2713, time5.15214s, range200.492m, height32.5503m, rather than displayed38.6,25.7,5.24,177.6,33.7. Arc starts at visibly elevated muzzle but formula states level ground. Keep visual intent while using a common launch/landing height and accurately calibrated coordinates. If using unequal x/y screen scales to retain reference silhouette, disclose vertical exaggeration and keep vector angles unambiguous. No air resistance on this dedicated level-ground page.

Read ProjectileMotionLab.tsx, projectile-motionSimulation.ts, projectile-motionData.ts and route metadata. Opened existing /experiments/projectile-motion, captured Guide and Simulate states using captureProjectileBaseline.mjs. Existing defaults28m/s,40deg,height2m and gravity9.81; drag toggle, target mission, component graphs and height controls are preserved. Existing no-drag projectileFlight engine computes exact level/raised-ground results; pointAt performs previous-sample lookup. Reuse projectileFlight without changing its contracts, and provide exact continuous current-state evaluation for the new page. A dedicated route /motion/projectile-motion was selected to preserve the existing lab.

## Model checkpoint

src/lib/projectileStudio.ts wraps existing no-drag engine with level-ground parameters matching mockup, clamps and rounds controls, cleans the exactly vertical90deg cosine residue, and evaluates exact x,y,vx,vy at clamped time. Horizontal0deg flight has zero duration/range on level ground. At90deg trajectory has zero horizontal extent and returns to origin. No arbitrary flight duration is introduced for either boundary.

scripts/testProjectileStudioPhysics.mjs passes default equations; all speed/angle/gravity extrema, horizontal and vertical limits, complementary angles, apex and landing, energy conservation, finite outputs and time/input clamping. Evidence physics-results.json in artifacts/studio-rebuild/22-projectile-motion. This initial model checkpoint preceded the completed implementation and verification recorded below.


## Implemented page and iteration evidence

Dedicated lazy `/motion/projectile-motion`, quiet app shell and visible parent-studio link added. Existing `/experiments/projectile-motion` and its height, drag, target mission and lesson contracts retained. `ProjectileStudioPage.tsx`, `ProjectileStudioScene.tsx` and scoped `projectile-studio.css` provide the reference composition. Generated empty field and transparent launch-tube assets are documented with exact prompts/source paths in22-projectile-assets.md. Background refined to place landing on visible grass. Launcher rotates with angle and its mechanical support follows its mounting point; tube size is illustrative.

True analytical ball position follows the calibrated dashed trajectory. Initial velocity vectors explicitly labelled v0, components, and theta; their common scale preserves physical angles. Current flight time is scrubbed separately. Forecast readings show full flight and velocity immediately before landing. Vertical scene scale is explicitly disclosed with three significant digits, including strong compression for extreme vertical flights. Horizontal and vertical scales adapt independently to keep full paths visible. Camera zoom is uniform and follows the ball. Mobile legend becomes two columns above the arc; graph coordinate width adapts to the rendered container to keep labels legible.

Desktop1536x1024 reference composition closely retained: sidebar233, header/preset, full-width four modes,470px scene, three lower panels and footer. Apparatus baseline and target share one zero height, correcting the reference's elevated muzzle/level-ground inconsistency. Other deliberate differences: correct numeric results; initial vectors labelled explicitly; paused apex default; added compact scrubber; honest scale/no-drag note. No mockup is displayed as UI. Compared first and successive screenshots and corrected field framing, label colour, mobile arc height/legend occlusion, responsive text scale, tube bounds/support attachment and tiny scale rounding.

## Test evidence

- testProjectileStudioPhysics.mjs: defaults, every speed/angle/gravity extreme, horizontal/vertical boundaries, complementary-angle identity, apex, landing, energy conservation, signs, finite states and input/time clamping pass.
- testProjectileStudioBrowser.mjs: all sliders/numeric fields, clamps, blanks and precision; Earth/Moon/Mars/Jupiter/custom gravity; play/pause/reset/replay, scrubber, zoom bounds, accordion; Observe/Predict/Experiment/Explain, wrong/correct predictions, six presets, Settings; all three challenges reject wrong settings and accept physical solutions. Horizontal zero-duration play/scrub disabled appropriately. Found and fixed end-of-slider quantization that prevented replay; landing selection snaps to exact flight end.
- Eight extrema screenshots: min/zero-angle, maximum vertical, lunar maximum range and shallow launch at1536 and390. Correct finite values and zero horizontal overflow; reviewed mobile zero/vertical/max plus desktop and responsive layouts.
- captureProjectileSizes.mjs: all six required sizes captured and visually compared, zero overflow. Latest mobile default and vertical support inspected after final apparatus adjustment.
- testProjectileStudioFinal.mjs:14 route entries including all sidebar links, visible parent link, direct refresh, and legacy projectile Simulate default speed28,height2 plus Launch/Pause. No page errors or failed requests.90 animation frames: median6.9ms,p95 7.1ms,max7.2ms.
- Final production build after support adjustment exited0;812precache entries. Existing large-chunk advisory remains unrelated to this page.

Evidence directory: artifacts/studio-rebuild/22-projectile-motion. All completion gates VERIFIED. No known page-specific defects or blockers. No live test/build/image tool handles remain.
