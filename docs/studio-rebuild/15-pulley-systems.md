# Mechanics — Pulley Systems / Atwood Machine

Status: VERIFIED. Page15/102; page14 passed all gates before this page began.

Mockup:03_mechanics/03_pulley_systems.png,1536×1024. Existing mapping /concept-studio/mechanics. Opened the actual parent in the browser and saved artifacts/studio-rebuild/15-pulley-systems/before.png. It is a general Mechanics dashboard; no dedicated Atwood page is present.

## Reference inspection

239px left sidebar, 1255px main. Breadcrumb and Atwood Machine title at x271 y25/50; two subject selectors upper-right. Four learning-mode tabs x264 y115 height48. Tall realistic apparatus viewport x264 y175 width698 height760; right column x974 width545. Controls height253, four live reading tiles height141, theory panel height267 and reset/pause/zoom/challenge toolbar below. Bottom status at y944. Sidebar Mechanics expands with Kinematics/Dynamics/Forces/Energy/Momentum/Rotational Motion/Pulley Systems/Simple Machines; other subject sections collapse.

Apparatus: steel two-post frame on heavy footed base, fixed six-spoke pulley centered(629,333), radius roughly73px. Cord over upper semicircle and vertical strings at x557/702, brass A cylinder higher at y506–580 and steel B at y596–691. Upward tension cyan, downward weight white, violet angular arrow above pulley. Need code-controlled wheel rotation, no-slip cord motion, connected mass displacements and scientific vectors; regenerate passive laboratory backdrop/metal materials as needed without embedding the mockup.

Defaults mA1.00kg, mB1.50kg, I.010kg·m², fixed R.050m, g9.81m/s². Mass ranges.1..5kg, inertia0...1kg·m². Formula a=(mB−mA)g/(mA+mB+I/R²); positive a means B down/A up. T_A=mA(g+a), T_B=mB(g−a), alpha=a/R, omega=v/R. Default acceleration is.75461538m/s², T_A10.564615N and T_B13.583077N, not reference2.46,12.26,14.72. Starting from rest, at2.38s displacement would exceed2.13m and omega≈35.92rad/s, inconsistent with reference±.29m and4.31rad/s. Initialize honestly and synchronize every readout. Finite apparatus travel/stop behavior and energy accounting must be physically explicit; do not clamp positions while pretending ideal energy remains conserved after stopping.

## Existing implementation inspection

Searched all src TS/TSX for atwood/pulley. No Atwood simulation, route or dedicated lesson found. Mechanics metadata mentions a featured compound hoist but links general activities. Generic src/engine/matterEngine.ts attaches two bodies through separate fixed-end Matter constraints(length130,stiffness.85); this is not a single inextensible Atwood rope and must not be reused as a scientifically valid Atwood solver. Preserve its existing behavior.

Inspected src/experiments/rotational-dynamics/rotationalDynamicsSimulation.ts: fixed2kg disk radius.25m plus point masses, external torque/damping, alpha=tau/I and rotational energy. Correct for its existing lesson, but not the coupled Atwood system. Preserve it; use reusable scalar relations only where they fit. PhysicsIcon/MasteryChallengeDialog and page13/14 responsive patterns are reusable UI pieces. A dedicated /mechanics/pulley-systems route with a parent entry is the intended mapping, pending implementation.

Next: implement and validate coupled translation/rotation, mass symmetry, zero inertia/equal masses, no-slip string constraint, energy and physically justified travel boundaries. Then build this one page and complete visual/interaction/responsive/build checks before Torque/Levers. No later page started.

## First implementation

Implemented src/lib/atwood.ts, AtwoodScene, AtwoodPage and atwood.css at /mechanics/pulley-systems. The route has a local Suspense boundary and the existing Mechanics parent now links it. Original generic pulley constraints and rotational engines are unchanged.

Dynamics uses effective mass mA+mB+I/R², signed B-down acceleration, separate tensions, alpha=a/R and omega=v/R. Translation and rotation share one inextensible no-slip rope. Frame rendering uses1460px/m and physical radius.05m, so a73px pulley rotates byq/R while masses move by±1460q. The continuous rope path keeps constant length; its dash texture follows the attached endpoints without an extra phase offset that would double-count motion.

The compact apparatus has±.080m travel. A zero-restitution axle brake automatically engages at a boundary, absorbs all kinetic energy, and holds the wheel. Tensions then equal the respective weights; holding torque balances their difference. Energy accounting includes recorded brake dissipation. Default loss at the positive limit is.3924J. Playback defaults to.25×, explicitly labeled, so the short physical motion is observable without altering SI velocity/time relationships. Equal masses remain still. Input changes restart the trial.

Four physics groups pass: default coupled acceleration/tensions; Newton/torque relations, mass reversal/equality and zero inertia across all limits; exact step agreement, no-slip, both travel stops and energy balance; default brake loss equals released potential energy. Evidence: physics-results.json/testAtwoodPhysics.mjs. Numeric controls use focused local drafts to permit sequential decimal typing without padding corrupting the entered value.

Initial browser groups pass: default outputs and typing0.15; pause/resume, brake, Variables/Equation tabs and.3924J loss; balance/zero-inertia/swap presets; six screenshots with no horizontal overflow. No console/page errors. First visual loop refined rim material, brake-note space, typography and mobile theory legend/apparatus proportions. Desktop,1024 and390 screenshots inspected. All six captures are saved. Builds45099 and56716 passed (772 precache entries); a later copy edit removed mockup-related wording from the learner explanation, so run the final build again after remaining checks.

Status NEEDS ITERATION. Remaining: final screenshot comparison at all sizes and stop states, all three challenges/prediction outcomes, labels toggle/playback rates/zoom, numeric and slider limits, subject accordions and both navigation selectors, direct refresh/parent entry, unaffected-route checks, own console/network warnings, runtime, and final build. Check stopped theory note and vector labels at extreme mass/inertia values. No later Mechanics page started.

## Asset provenance

Built-in image_gen.imagegen generated public/assets/atwood/lab.png (1122×1402). Original retained at C:/Users/saisa/.codex/generated_images/01a07335-84ef-78b2-bcb9-d2e500ff94cb/exec-89866a7e-e637-41a7-81c0-709c6e28473e.png. Generated output visually inspected: empty dark laboratory center and bench, no baked pulley or UI. All frame hardware, cylinders, wheel spokes/rim, rope, force arrows and interface are code. No target screenshot is rendered.

Exact prompt: Use case: background-plate. Photorealistic dim university mechanics laboratory, portrait-ish 4:5 composition, camera perfectly front-on at apparatus height with slight view downward onto an empty heavy dark steel laboratory bench in the bottom 18 percent. Center and foreground completely empty for a tall Atwood pulley frame to be composited later. Softly defocused background contains dark gray wall panels, a cabinet on far left and distant precision instruments on far right, cool navy low-key ambient lighting, tiny subdued cyan dust glints, warm subtle side illumination from upper right. Realistic scratches on bench, industrial optical-lab atmosphere. No pulley, no frame, no weights, no ropes in foreground. No people, text, poster lettering, equations, graphs, arrows, UI or logos. Keep the central 65 percent especially empty and dark. Authentic photographic material and depth of field.


## Final verification

All page completion gates passed. Final six viewport captures were visually inspected against the original composition, together with stopped mobile and extreme reversed-mass views. Geometry, frame, wheel/rope and cylinder positions closely follow the reference; generated background and procedural metallic textures vary naturally. Correct SI readings and explicit playback/brake accounting replace the reference inconsistencies noted above. No mockup is rendered.

Extra browser checks pass prediction outcomes, all three signed acceleration challenges (including empty answers), every slider endpoint and numeric upper clamps, labels, playback and zoom options, direct reload, Mechanics parent entry and both selectors. Every subject accordion and Mechanics destination renders. Mobile popovers fit. Six viewport and stopped-state checks find zero overflow, and brake notes remain within their panels. Extreme masses in both directions with zero/maximum inertia stop correctly and keep force labels inside the scene. Physics checks separately cover energy, signs, limiting states and timestep agreement.

No own console errors or failed requests in final browser evidence. Only existing shared React Router future-flag warnings occur. Runtime median6.9ms, p957.1ms, maximum41.7ms over90 frames. Final production build53145 exited0,772 precache entries; existing application bundle-size advisory remains. No live build/test handles remain.

Evidence: artifacts/studio-rebuild/15-pulley-systems/{physics-results,extra-checks,responsive-final,navigation-runtime,extreme-checks}.json; final-WxH.png, stop-W.png and extreme mass screenshots. All implementation, interaction, physics, screenshot, responsive and build statuses VERIFIED. No known page-specific blocker. Next sequential page: Torque and Levers.
