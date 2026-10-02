# Motion & Kinematics - Relative Motion

Status: VERIFIED, page23/102. Page22 passed every completion gate before this page began. Fifth of six motion studio pages; no later page started.

## Reference inspection

05_relative_motion.png1536x1024. Sidebar219px; top breadcrumb header54px; modes and action toolbar y64..108. Top content: river scene x231,y118,w944,h572; right controls x1185,w337,h348 and readings y477,h213. Lower row y700..974: vector diagram435px, equations479px, crossing graph357px. River photograph is overhead, rocky green banks along top/bottom, dark turquoise flowing water. Boat centred, initial heading30deg. Current cyan, boat-relative-water green, ground vector magenta. Shore names, compass, scale bar, dashed reference lines. Controls boat5m/s0..20, current2m/s0..10, heading30deg -90..90. Readings ground5.39m/s, drift37.3m,time55.7s,width300m. Diagram and graph use same colours.

Scientific corrections required: heading is declared relative to straight across but drawn from east in the mockup. Adopt x east/downstream and y north/across, theta from north, positive downstream. Boat components vb*sin(theta),vb*cos(theta); add current to x. Ground magnitude=sqrt(vb^2+vc^2+2vbvc*sin(theta)). Time=W/(vb*cos(theta)). Total downstream displacement=(vc+vb*sin(theta))*time, not vc*time unless theta0. Current-only drift is vc*time. Defaults yield ground(4.5,4.3301)m/s, magnitude6.2450, time69.2820s,total311.7691m,current-only138.5641m. Mockup's5.39,55.7,37.3 and graph endpoint disagree with these controls. Keep visual intent while correcting all quantities, axes and angle annotation. Zero boat speed or exactly +/-90deg heading has no finite crossing; never invent a crossing time or displacement.

## Existing implementation inspected

Searched experiment registry, lesson catalog, calculators and formula bank. No dedicated river/boat relative-motion route or engine found. Motion parent contains Relative Motion concept selection but uses generic motion-track apparatus and links to uniform-motion. Formula bank correctly records v_AB=v_A-v_B; preserve it. Read conceptStudioHomes.ts and ConceptExperiencesPage.tsx, including selection state and telemetry. The special-relativity-bridge route concerns Lorentz transformations and is not this low-speed Galilean lesson. Keep all existing contracts/routes; selected dedicated route is /motion/relative-motion.

## Model and asset checkpoint

src/lib/relativeMotion.ts separates settings, vector solution and time state. Speeds rounded0.1; heading integer degrees matching reference. Width fixed300m. Crossing time/drift nullable for no crossing; ground vector remains finite. Continuous shore/water positions obey x_ground-x_water=vc*t; the shore origin in water frame is -vc*t. Landing clamps exactly to opposite bank. noDriftHeading returns no solution when current>=boat, because the equality case points parallel to shore and cannot cross.

scripts/testRelativeMotionPhysics.mjs passes defaults and all boat/current/heading limits; stationary boat/water; upstream/downstream signs; no-crossing boundaries; exact landing; Galilean coordinate transformation; vector magnitude identity; cancellation example boat4,current2,heading-30; impossible cancellation cases. Evidence physics-results.json. Overall page physics remains IN PROGRESS until UI/graphs agree.

Generated river photograph and RGBA boat copied to public/assets/relative-motion/. Exact prompts and source/alpha metadata in23-relative-assets.md. Original boat alpha is real, including fully transparent grey RGB outside hull. Rejected refinement has painted checkerboard and is not used. Next verify selected boat compositing in browser. No page UI yet; next implement calibrated scene, vector diagram and path graph, controls/toolbar/modes/challenges/settings, route and parent link, then full screenshot/control/responsive/build loop.

Browser baseline: captureRelativeBaseline.mjs exited0 after correcting a case-sensitive heading locator. before-relative-concept.png shows Relative Motion selected with generic track Position/Velocity/Acceleration telemetry. This confirms the missing river-specific coverage. No live tool handles remain.


## Implemented page and visual iterations

Dedicated lazy /motion/relative-motion route and visible parent link added without altering existing labs. RelativeMotionPage.tsx, RelativeMotionVisuals.tsx and scoped relative-motion.css provide the full reference composition:219px sidebar, breadcrumb, mode/action toolbar,572px river scene beside controls/readings, lower vector/equation/path panels and compact scrubber. Original generated river and real-alpha boat composite cleanly. The boat moves continuously, rotates to the heading from north, and remains synchronized with the magenta path and graph cursor. Current-flow arrows animate only when the current is nonzero. Zoom follows the boat; vector and flow overlays are controlled in Settings.

The photo and diagram coordinate systems adapt together to keep actual shore boundaries aligned on narrower screens. The top view explicitly states it is not to scale and the boat is enlarged. The horizontal ruler is calibrated to the scene's actual x mapping, switches to km for large drift, and places its unit above the endpoint to prevent crowded labels. The lower vector diagram preserves a common vector scale and fits opposing vectors. The path graph preserves true coordinates even at huge drift. Zero/parallel cases display No crossing and use a clearly labelled60s observation interval.

Iterated screenshots corrected unsupported vector glyphs, ruler calibration, photo/shore alignment at different aspect ratios, vector legend/font sizing, extreme scale labels and excess blank space in tablet readings. Six required viewport captures show zero horizontal overflow and were visually reviewed. Changes from reference are scientific corrections already listed, accurate graph bounds, explicit north-based heading, paused midpoint default and added scrubber/settings. No mockup image is part of implementation.

## Verification checkpoint

- testRelativeMotionPhysics.mjs: all model equations, signed limits, frame transforms, finite/no-crossing states and cancellations pass.
- testRelativeMotionBrowser.mjs: all controls including blanks/clamps/rounding; elapsed play/pause/reset/replay; graph keyboard/pointer capture; zoom; sidebar accordion; all four modes; wrong/correct prediction; seven presets; vector/flow toggles, playback rate and full-view reset; all3challenges rejecting wrong and accepting exact solutions. Fourteen extreme screenshots cover stationary, drifting, parallel, opposing, upstream, huge drift and cancellation on desktop/mobile. No errors/failed requests. A rapid input-update timing issue was corrected with synchronous draft synchronization and tests wait for committed updates.
- testRelativeMotionFinal.mjs:13 route entries, all sidebar destinations, visible parent link, direct refresh and preserved original projectile height/drag lab default28m/s,height2 plus Launch/Pause. No errors/failed requests. Latest90frame run median34.7ms,p9535ms,max37.4ms. Separate profileRelativeMotion.mjs measured paused34.7ms and running34.7ms median: stable approximately29fps in this browser, with no animation-related slowdown.
- Final production build after unit-label/input/tablet refinements exited0;818precache entries. Existing large-chunk advisory remains unrelated to this page.

Evidence: artifacts/studio-rebuild/23-relative-motion contains before-relative-concept.png, physics-results.json, browser-checks.json, final-checks.json, six pass2 sizes, fourteen extreme captures and parent-links.png. Final ruler/km, upstream boundary and tablet screenshots were inspected after the last changes. All completion gates VERIFIED. No known page-specific defects or blockers; no live tool handles. No later page started.
