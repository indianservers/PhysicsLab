# Mechanics — Inclined Plane

Status: IN PROGRESS. Page 14 of 102 unique pages; page 13 passed every gate before this page began.

Reference: 03_mechanics/02_inclined_plane.png, 1536×1024. Existing route: /experiments/inclined-plane. Saved actual browser baseline: artifacts/studio-rebuild/14-inclined-plane/before.png. No implementation source changes yet.

## Inspection

Reference geometry: 200-pixel sidebar; 52-pixel top strip; main heading/modes at y65–125; photo-real metal incline stage x202 y126 to1148 y870; right 378-pixel column with controls, live readings and formula; 85-pixel action bar and 69-pixel bottom status. Dark blue apparatus bench, inclined rail downhill toward right at25°, steel block near upper third, protractor/support left and pivot right. Force arrows N cyan perpendicular out, friction purple upslope, mg sinθ green downslope. Small v–t graph in upper-right scene. View dropdown, Reset, Run/Pause, Zoom menu, Next Challenge, four learning modes, sidebar/library/settings all require real behavior.

Defaults θ25°, m2 kg, μ.30, g9.81; ranges θ0..60, mass.5..10, μ0..1. Normal mg cosθ≈17.78 N; downslope mg sinθ≈8.29 N; kinetic friction μN≈5.33 N; acceleration≈1.48 m/s². The reference graph reaches only about1.7 m/s after4s, inconsistent with its own1.47 m/s² acceleration; recreate its chart placement but compute genuine synchronized data. At low angle static friction must balance demand, not propel the block uphill. Define the visible μ convention explicitly and account for velocity sign/stopping. Ramp endpoints and graph duration need a physically explicit design before implementation.

Inspected src/experiments/inclined-plane/inclined-planeSimulation.ts: simulateInclinedPlane computes components, static threshold μN, but kinetic force uses0.8μN and a.005 m/s moving threshold. Preserve this existing contract. Dedicated InclinedPlaneLab defaults22°, .5kg, μ.35 and has applied uphill force/sweep controls; preserve it. inclined-planeData defaults30°,5kg,μ.2,g9.8 and defines separate general lesson controls.

Actual browser route renders the general lesson with mass/angle/μ controls and a3D incline, not the dedicated lab component. Baseline readouts N42.48 N, f8.50 N, a3.21 m/s². Preserve this route and lesson-specific behavior; a new /mechanics/inclined-plane route is the likely mapping, pending implementation. Reuse correct force-component calculations where practical without changing the existing friction convention globally.

Next: finish inspecting the general calculator, implement a page-specific validated dynamics model, then rebuild this single page and complete all required verification gates. No later Mechanics page started.

## Implementation and model validation

New route /mechanics/inclined-plane uses InclineStudioPage, InclineScene, incline-studio.css and src/lib/inclineStudio.ts. Mechanics parent has an entry link; the original /experiments/inclined-plane route and both prior engines are unchanged. General calculator in ExperimentDetailPage resolves mg components, limits friction to static demand, and clamps initial downhill acceleration; inspected before implementation. New dynamics reuses simulateInclinedPlane for the correct force components with friction set to zero, then implements the page's explicitly equal μs/μk convention separately.

Physical ramp length3m, block length.45m, center bounds.225..2.775m, initial center1m. Exact constant-acceleration segments split at speed zero and zero-restitution end-stop impacts. A stop reaction balances residual force after impact; a finite post-impact acceleration is not substituted for the impulse. Forecast has exact pre/post-impact velocity points at the same timestamp. Default: N17.7817588 N, downhill8.2917703 N, friction−5.3345276 N, net2.9572427 N, a1.47862133m/s². Four physics groups pass all min/max/zero/signed-velocity cases and agree with400 fine steps. Evidence: physics-results.json, testInclinePhysics.mjs.

The page provides three diagram views, draggable starting position, live signed force readouts, adaptive ramp framing from0° to60°, a working angle gauge, zoom, pause/resume/replay, three presets, prediction feedback, three acceleration challenges, graph visibility and half-speed playback. The velocity forecast uses the same solver as the bright run trace. Parameter changes or dragging start a new trial. Full weight is now shown as a solid vector; green/perpendicular dashed vectors are explicitly components, not extra forces. This corrects the reference's incomplete free-body force balance as well as its inconsistent v–t slope.

First browser prechecks passed initial outputs, every slider endpoint, Reset, all views/zoom options, pause/resume/end-stop, all presets and six viewport overflow checks, with no page/console errors or failed requests. Extra checks passed wrong/correct prediction, all three challenge states with empty/correct answers, graph and half-speed settings, and block dragging. Screenshot inspection corrected the protractor geometry, flat-ramp framing, crowded graph caption, mobile gauge label sizes and graph placement at steep angles. Latest icon refinement reuses existing PhysicsIcon and MasteryChallengeIcon instead of temporary text glyphs.

Desktop/mobile/tablet screenshots captured in artifacts/studio-rebuild/14-inclined-plane. Desktop,390 and1024 plus flat/60° states were inspected. Current status NEEDS ITERATION: inspect final screenshots at every requested size, verify graph hiding on mobile does not leave excess space, check end-stop reaction text fits its panel, runtime, direct refresh, all navigation and unrelated route regression. Then run/inspect final production build. Previous builds75092 and60608 passed (767 precache entries). Latest build26067 and browser16610 were live when this note was written; poll the same handles, do not restart on timeout.

## Asset provenance

Built-in image_gen.imagegen generated public/assets/inclined-plane/workshop.png,1448×1086. Copied without modifying the source at C:/Users/saisa/.codex/generated_images/01a07335-84ef-78b2-bcb9-d2e500ff94cb/exec-3d5e5520-1eaa-415e-b474-7cbf527a074c.png. Inspected the result: empty foreground, low-key pegboard/workbench, no UI or baked apparatus. Ramp, block, hardware, metal grain, rock surface, protractor, vectors and graph are code-driven. No target screenshot is rendered.

Exact prompt: Use case: background-plate. Photorealistic dark mechanics laboratory workshop, landscape composition 4:3, camera looking slightly downward across an empty heavy dark brushed-steel workbench. Bench occupies lower 38 percent of image and is completely clear for an interactive inclined-plane apparatus to be composited later. Background upper 62 percent: softly defocused charcoal perforated tool pegboard, a few vertical steel rods and blurred small precision workshop instruments on a distant shelf. Cool navy-blue ambient light, subtle cyan rim light, realistic worn steel scratches and low-key photographic shadows, industrial university physics lab. Leave center and entire foreground empty. No ramp, no block, no apparatus in foreground, no people, no readable text, no charts, no arrows, no interface, no labels, no logos. Background must remain subdued and low contrast so overlaid scientific apparatus is clearly visible.
Build26067 and browser16610 both completed with exit0. No live handles remain from this turn. The final gate is still pending the remaining visual/responsive/navigation/runtime reviews above; successful compilation alone does not verify the page.

## Final review and corrections

Final browser review passed direct refresh, all sidebar destinations, Mechanics parent entry, previous Free-Body Diagrams page and original incline route. It also tested end-stop reaction text bounds at all six viewports and the graph-hidden mobile layout. No page-specific console warnings/errors or failed requests. Existing Three.js shader/deprecation warnings from other studio routes are retained with URLs in final-review.json; shared React Router notices are recorded separately. Runtime over90 frames: median7ms, p9514ms, max20.9ms (host-dependent).

The parent-entry test exposed a missing Suspense boundary: direct load worked but navigation could suspend synchronously. Added the same local fallback pattern as the other dedicated routes; reproduced the failure and confirmed the repaired parent entry renders. No global router configuration changed.

Visual review corrected the reaction panel height, graph-hidden mobile spacing, right-edge component label clipping, and block clipping at the lower end. Near the end stop the camera widens smoothly by up to8 percent; labels anchor inward and R sits above friction. The final stopped mobile screenshot was inspected with the whole block visible. Explain now states the common force scale normalized to weight and the camera behavior. Stop equilibrium explicitly reads mg sinθ+f+R=0, avoiding ambiguity about whether ΣF already includes R.

Final screenshots captured at all six sizes with fresh browser pages. Earlier full-page captures contained an offscreen skip-link artifact caused by the site's smooth scrolling during capture; the real element's rect was verified above the viewport, and final captures use an immediate scroll-to-top. No global accessibility CSS was changed. Final desktop,1440,1280,1024,768,390 layouts and the graph-hidden stopped mobile state were inspected. Initial screenshot geometry is unchanged by the conditional end-stop camera correction.

Current final build handle87278 was live at the time of this note. Every other gate is passed; poll that handle before marking page14 VERIFIED. No later Mechanics page has started.

Final build87278 completed successfully. All gates are VERIFIED. Overall progress14/102 unique pages. No live process handles remain. Next page: Mechanics / Pulley Systems.
