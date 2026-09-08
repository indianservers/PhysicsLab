# Mechanics — Free-Body Diagrams

Status: IN PROGRESS, reference and existing engine inspected. Reference: 03_mechanics/01_free_body_diagrams.png, 1536×1024. Existing related route: /experiments/balanced-unbalanced-forces.

Mechanics inventory, in order: free-body diagrams, inclined plane, pulley systems, torque/levers, equilibrium/center of mass, momentum/collisions. Only the first page is selected.

Inspected balancedForcesSimulation.ts and BalancedUnbalancedForcesLab.tsx. The existing engine handles horizontal left/right forces, a fixed mg normal force, static/kinetic friction and one-dimensional stepping. Preserve its contracts, defaults and route. Its G=9.80665 can be reused; a separate vector/contact solver is required for the mockup's angled applied force and possible lift-off.

The reference is internally inconsistent: its 2 kg mass cannot have 196.2 N weight, its upward applied component should reduce the normal force, the listed friction is not μN, and its acceleration/equation do not match the listed mass. Keeping F=100 N, θ=30°, μ=.40 and m=2 kg means Fy=50 N exceeds mg=19.6133 N, so contact normal and friction are zero and the crate lifts. Ax≈43.3013 m/s² and ay≈15.1934 m/s². This boundary must be handled explicitly rather than forcing equilibrium with negative normal force.

Planned solver scope: 2D translational forces, unilateral ground contact, static/kinetic Coulomb friction, flight and inelastic landing. The single μ control will use an explicitly stated friction convention. Force vectors and spatial motion must not confuse newton axes with a meter scale. Preserve the original horizontal-force lesson through navigation.

Remaining: inspect existing route in the browser, implement and validate the vector/contact solver, recreate the page and apparatus, run the full visual/interaction/responsive/build sequence. No later Mechanics page started.
## First implementation and checks

Implemented src/lib/freeBody.ts with event-split integration: exact constant-acceleration flight, vertical inelastic landing, ground friction and exact splitting at horizontal stopping. The normal force never becomes negative. Both static and kinetic friction use the visible μ; no hidden coefficient multiplier. G is reused from the existing engine.

Four physics groups pass: default lift-off; Newton balance/contact/friction across mass, force, angle, μ and signed-velocity boundaries; static balance and exact friction stopping; agreement between large event-split steps and 200 fine steps including flight and landing. Evidence: physics-results.json and testFreeBodyPhysics.mjs.

Opened the existing route in the browser and saved before.png. It renders the general horizontal-force lesson with its 3D scene, distinct from the dedicated component. Preserve it unchanged. The new route is /mechanics/free-body-diagrams; FreeBodyPage, FreeBodyScene and free-body.css provide the first full page implementation.

The crate moves in spatial coordinates with a following camera. Force arrows share a common force scale and the grid is labeled in newtons. A separate meter bar describes spatial motion. Display toggles control grid, components, values and resultant. Applied force can be dragged or adjusted with sliders; mass, friction and angle remain live. Controls/subject sections expand, and prediction, three challenge states and explanatory/release experiments are present.

Three initial browser groups pass: default lift-off/reduced normal/static friction; all display toggles, pause, release and landing; pointer dragging of applied force. No page or console errors occurred. The initial render has zero horizontal overflow at 1536×1024. First build found unsupported String.replaceAll for the configured target; replaced it locally with replace(/ /g, '-') without changing build configuration. Added explicit accessible Reset/Zoom names after the first automation run could not find Reset by its plain name. The corrected browser prechecks pass.

Status remains NEEDS ITERATION. Remaining: refine slider appearance and smaller-screen layout, verify numeric typing and all limits, audit sidebar destinations, verify three challenges and all other controls, screenshot comparison loop, responsive checks, runtime and final build. The latest build was launched after fixes; inspect its existing process/result rather than restarting on an observation timeout. No later Mechanics page has started.

## Asset provenance

Built-in image_gen.imagegen generated public/assets/free-body/crate.png (1254×1254 RGBA). Verified alpha spans 0–255 and copied without flattening. Source: C:/Users/saisa/.codex/generated_images/01a07335-84ef-78b2-bcb9-d2e500ff94cb/exec-e954f8c4-7d89-4bd9-baf4-cf5dd0704802.png. Only the crate is raster; platform material, geometry, force vectors, labels and UI are code. No mockup screenshot is rendered.

Exact prompt: Use case: product-mockup. A single realistic square wooden shipping crate viewed perfectly straight from the front, orthographic, no visible top or side panels. Weathered warm medium oak horizontal boards, thick square border rails, two diagonal wooden braces forming an X across the front. Small dark steel round bolt heads at four corners and the brace intersection. Carefully detailed wood grain, scratches, end grain, subtle ambient shadows between boards, soft cool laboratory light from upper left. Exact square outer silhouette, centered, fills 90 percent of image. Genuinely transparent background with alpha. No floor, no ground shadow outside silhouette, no scenery, no text, no markings, no numbers, no arrows, no UI. Photorealistic cutout asset for an interactive physics simulation.

## Verification iteration

The first successful build completed with 763 precache entries. Subsequent browser inspection corrected numeric draft entry and blur clamping, mobile subject expansion and accessible category names, registered studio destinations, compact force labels, the tablet column layout, and slider styling. The procedural platform now uses fractal height noise with directional diffuse lighting instead of flat grain.

Nine extended browser groups pass: keyboard slider limits; numeric lower/upper/empty values; controls collapse/expand; zoom clamps; prediction outcomes and explanation; all three challenges with incorrect and correct submissions; leftward velocity with friction reversal and stopping; 90 animation frames; direct refresh; sidebar destinations; previous uncertainty and original force route smoke checks. No console errors. Runtime sampled median 7.0 ms, p95 7.1 ms and max 7.2 ms (host-dependent, not a performance guarantee).

All six viewport checks pass numeric decimal typing, Reset and zero horizontal overflow. No failed requests or page errors. The two app-wide React Router future-flag warnings are recorded separately in responsive-results.json and are unrelated to this page; no global router settings changed. Mobile force vectors use larger symbolic labels; full numerical values remain in synchronized controls/readings. All six screenshots were captured; desktop, 1440, 1280, 1024, tablet and mobile were visually inspected against the reference geometry.

One final spacing refinement remains in the controls panel before final screenshots/build acceptance. Current build handle 51102 must reach a terminal result before source edits. No later page has started.

## Final acceptance evidence

The controls panel spacing now keeps all endpoint labels within its border. Repeated six-size checks passed after this adjustment. During flight the camera exposed right-edge clipping of applied/resultant labels; these now anchor inward near the edge, and the component label is offset below the resultant. checkFreeBodyMoving.mjs verifies zero text bounds outside the 920-unit scene. moving-check.png was visually inspected; all force labels remain legible. No default screenshot geometry changes result from this conditional correction.

A Free-Body Diagrams entry link was added to the existing Mechanics studio hero beside its original start link. testFreeBodyEntry.mjs opened the parent, clicked the entry and confirmed the dedicated route renders. Existing parent interactions remain intact.

Visual comparison: 1536×1024 composition follows the reference's 56-pixel header, 249-pixel sidebar, 922×724 scene, 308-pixel controls/readings panel, crate centered over the platform and footer alignment. Native interactive sliders, regenerated crate and procedural stone replace the reference pixels. Intentional scientific differences: actual 2 kg weight (19.6133 N), reduced/nonnegative normal, lift-off, signed friction, both accelerations, and consistently scaled force vectors. Full numerical readouts stay visible on compact layouts while in-scene labels use enlarged symbols.

Final production build currently running as session 98551. All other gates passed. Do not mark implementation VERIFIED or start page 14 until that handle completes successfully.

Final build 98551 completed successfully (763 PWA precache entries). Implementation, interactions, physics, screenshot comparison, responsive layout and build are VERIFIED. Page 13 is complete; overall progress is 13 of 102 unique pages. The goal remains active. Next: Mechanics / Inclined Plane.
