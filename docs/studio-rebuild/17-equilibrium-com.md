# Mechanics — Equilibrium and Centre of Mass

Status: VERIFIED. Page17/102. All completion gates passed. Historical checkpoints below record the iteration; the final verification section is authoritative.

## Reference inspection

Mockup03_mechanics/05_equilibrium_com.png,1536x1024. Sidebar220px; headingx239y20, subtitley51, four modesx827y25w690h44. Main apparatusx234y86w885h576. Right controlsx1130y86w387h351, live readingsy448h215, key relationy674h209, four-action toolbar y898h62. Bottom chartsx234y672w441h294 andx684w435h294. Side panel contains mass distribution0.70 (left to right concentration), support width4.0cm (1..10), tilt0degrees (-15..15). Three camera buttons Top/Side/Front, side selected; zoom, reset, pause, next challenge. Sidebar includes subject links, Simulations, Lab Tools, Data and Graphs, Challenges.

Apparatus: irregular rough stone/metal plate, large dark left cuboid topped with gold cube, taller silver right cuboid and small bronze cube beside it. Red COM, dashed vertical gravitational line, blue support polygon on plate, support post and black metallic base, perforated optical bench. Axis triad upper right and10cm scale lower right. Bottom left xy COM path with point markers and current red point; bottom right top view repeats actual mass arrangement/support region/COM. Real 3D geometry is useful here for the three camera views and tilted support plane; keep readings and both plots driven by the same physical coordinates.

Reference shows COM(-1.8,.6,2.4)cm, distance1.8cm, margin2.6cm and Stable with net torque.02Nm. Radial xy distance is actually sqrt(1.8²+.6²)=1.897cm, not1.8. A full-width4cm centred square cannot have2.6cm edge clearance at x=-1.8: the nearest x edge is.2cm away. The drawn polygon shape is ambiguous and varies between main/top views; define one explicit support geometry and use it consistently. Net torque including the support reaction must be zero in true static equilibrium. A COM labelled negative x at right-concentrated.70 also needs consistency with the chosen coordinates and mass definition. Do not reproduce contradictory readouts or fabricate a curved path when the governing mass interpolation gives a straight locus.

## Existing implementation inspection

Current related mapping /experiments/balancing-act was opened and captured to artifacts/studio-rebuild/17-equilibrium-com/before.png. It is the existing static two-mass beam-moment lesson in PhysicsExpansionLab.tsx, with left mass/distance, right mass, target balance distance and an illustrative tilt. It has no 3D mass distribution, support polygon or tipping criterion. Preserve its contracts and content. Previous page16 inspection also verified the unrelated rotating-disk engine should remain unchanged.

Searched src/lib,src/experiments,src/engine,src/components for centre/center of mass and tipping/stability. formulaBank.ts has the correct scalar weighted-average COM expression; no dedicated support-polygon lesson/engine found. Reuse shared icons/dialogs and the existing Three rendering infrastructure where suitable. Proposed new route /mechanics/equilibrium-com with parent entry; inspect exact integration patterns before implementing.

## Planned physical model and open implementation work

Define real masses/centres, include plate mass with geometry-consistent centroid, and label how the distribution parameter moves/transfers ballast. Keep densities and centimetre-scale geometry physically reasonable. Use an explicit centred square support with full width w; the vertical through COM must intersect its plane inside that square. For a tilt about y, the intersection in support coordinates is (x+z tan(theta),y). Edge margin must be signed and derive from those coordinates, and net overturning torque must include the available support reaction. At an edge distinguish marginal stability from a stable interior. If a fixture holds an unstable test pose for inspection, explain that the freely released object would tip; do not display a motionless object as freely stable. Playback can scan the controlled ballast, with a genuine computed path, rather than invented falling motion.

Next: implement and independently validate one precise model, then build the 3D apparatus, live readings/top view/path, every control, challenges and responsive layouts. All implementation, physics, interaction, screenshot, responsive and build gates remain outstanding. No page18 work started.


## First implementation and validation

Implemented src/lib/centreOfMass.ts, ComScene.tsx, ComPlots.tsx, EquilibriumComPage.tsx and equilibrium-com.css (ecm prefix). Dedicated /mechanics/equilibrium-com route has a local Suspense boundary; Mechanics parent links it. Existing related lessons are unchanged.

The plate uses a shared160-vertex closed Catmull–Rom outline sampled from20 control vertices, with two circular holes. Shoelace area/centroid moments minus exact circular-hole moments determine the uniform plate mass and centroid; thickness.35cm, density2.7g/cm³. Same outline and holes drive the extruded Three mesh and SVG top view. Left/right containers each have15g empty mass plus a shared240g ballast transfer, with fraction t in the right container. Left(-4,1,1.55)cm size4x3x2.4; gold(-4,1,3.4),size2x1.7x1.3,70g; right(4,1.5,1.6),size2.5x2.5x2.5; bronze(5,-2.5,.95),size1.2cubed,15g. Mass positions are the declared centres, with total mass537.1816g. Default COM(.33038,.68568,1.32503)cm, radial projected distance.761cm approximately, margin1.31432cm,Stable and net torque0.

Full support width defines a centred square. Local gravity intersection (x+z tan(theta),y) drives signed nearest-edge clearance. Contact reaction is placed at that intersection when feasible, or at the clamped edge/corner. Residual gravitational moment is computed in world coordinates with centimetres converted to metres. Stable net torque0; marginal within1e-8cm tolerance; outside Would tip. Normal/friction requirements Mg cos(theta),Mg|sin(theta)| are available; rough contact/no sliding assumption and required mu are explained. An inspection clamp holds unstable poses explicitly. Scan is a slow controlled ballast transfer (.1 fraction per second), reversing at0/1, not a fake free-fall animation. Calculated complete-transfer COM locus is correctly straight; the red dot tracks current state. White top-view cross is the gravity intersection, not an extra mass.

Four physics groups pass: default mass/COM/distance/margin/zero equilibrium torque; weighted COM and conserved total mass across all parameter limits, tilted vertical projection and reaction magnitude; exact marginal contact and +/- boundary transitions; true linear ballast-transfer locus. Evidence testComPhysics.mjs and physics-results.json, updated after the smooth plate geometry change.

## Rendering and browser loops

Three scene uses z-up orthographic views, beveled apparatus blocks, support shaft/base, dimensionally shared adjustable square pad, x-ray support overlay, COM sphere and vertical dashed line. Top/Side/Front change the actual camera. Adaptive frustum fits narrow displays; the10cm scale derives from the actual orthographic span and is not CSS-capped. Metal/bench textures and six reflection-cube faces are generated with Canvas. Bench hole repeat aspect ratio was corrected for circular physical holes.

Initial screenshot revealed filled SVG axis triangles (missing fill=none), unsupported combining vector glyphs, an oversized bright bench background, and periodic procedural stone bands. Fixed the graph, vector notation, finite bench depth and camera elevation. RoomEnvironment/PMREM caused an ANGLE tiny-constant precision warning; replaced that lighting path with an explicit Canvas reflection cube and Phong materials, without suppressing warnings. Subsequent captures have zero own errors and only the two existing React Router future warnings. Added rounded metal edges and corrected reflection combine mode to avoid black metal.

First interaction checks pass scan/pause/reset, both prediction outcomes, all three challenge solutions and wrong outcomes/reopen, all camera buttons, all zoom states and four experiment presets. Six responsive captures have zero horizontal overflow. No page errors or failed requests in prechecks.json. Latest granite texture loading was tested separately: renderer waits for real texture data, including StrictMode remounts, so there are no image-data warnings. captureCom.mjs waits for both scene-ready and texture-ready.

Initial build73172 passed778 precache entries before the material/texture revisions. Current build82080 must be polled before any further source changes. No other live test handle is pending at this checkpoint.

Remaining gates: final material/geometry comparison (gold and silver block proportions are still visibly larger/taller than the reference), all final screenshots including Top/Front/extreme tilted states, all slider endpoints and scan reversal, support-polygon containment/edge cases, info/Explain dialogs, direct refresh/parent/sidebar/unrelated navigation, page-specific warning/network audit, frame performance, final production build. Main desktop and390 screenshots plus initial Top view were inspected; later texture changes need refreshed all-size/camera evidence. Page18 has not begun.

## Asset provenance

Built-in image_gen.imagegen created public/assets/equilibrium-com/granite.png (1254x1254). Source retained at C:/Users/saisa/.codex/generated_images/01a07335-84ef-78b2-bcb9-d2e500ff94cb/exec-a3e85c50-db8e-47a4-a2a6-1b145d83db48.png. Image inspected: uninterrupted fine-grain gray granite, no objects/UI. Used only as material albedo/bump and SVG plate texture. The mockup is never displayed. Metal maps, bench perforations and reflection cube are code-generated.

Exact prompt: Use case: texture asset for a physically rendered laboratory platform. Create a seamless tileable square photographic texture of a medium-dark cool gray granite slab, perfectly overhead flat orthographic view, uniformly illuminated diffuse light. Fine realistic mineral grain, irregular subtle pale gray mineral veins and chipped flecks, no regular bands, no repetitive swirls, no wood grain. Natural mottled variation without large light or dark patches. Entire image is uninterrupted stone surface, no edges, bevels, holes, props, shadows, text, labels or UI. Suitable as a neutral albedo texture for a rough gray physics laboratory support plate. Avoid exaggerated dramatic marble stripes.


Build checkpoint:82080 exited0 after the granite material integration, with780 precache entries. No live build/test handles remain. This is a successful intermediate build, not page completion; the remaining visual and final validation gates above still apply.


## Final verification — all gates VERIFIED

Adjusted gold/silver/left block proportions against the reference and revalidated their exact contact heights. The support pad now has a sharp square footprint with its top exactly at z=0, matching the mathematical support region. Corrected the world-axis triad using the actual camera basis. Removed premature stacked-chart layout at medium desktop widths; both charts fit without unnecessary blank space. Plate-frame numerical coordinates and world-frame axes are explicitly distinguished.

Evidence in artifacts/studio-rebuild/17-equilibrium-com:
- testComPhysics.mjs / physics-results.json: all four groups passed after the final dimensions; default COM (.33038354553,.68568413276,1.32503006022) cm, total .5371816106089962 kg, margin 1.31431586724 cm, equilibrium torque zero.
- testComGeometry.mjs / geometry-checks.json: square support perimeter containment across widths 1–10 cm, holes excluded, all block contact heights correct.
- testComPrechecks.mjs / prechecks.json: scan/pause/reset, correct/incorrect predictions and three challenges, reopening challenges, three cameras, all zoom states, four presets, no errors or failed requests.
- testComFinal.mjs / final-checks.json (98183 exit 0): every slider endpoint; reversal at both scan boundaries; both info/Explain entry points and Escape; reload/defaults; sidebar, parent and related/unrelated navigation. 90 runtime frames: median 7 ms, p95 13.9 ms, maximum 14 ms. Own route warnings are only existing React Router future flags; Three warnings belong to unchanged legacy routes.
- captureComFinal.mjs / responsive-final.json (44628 exit 0): six final viewport sizes, fresh decoded texture, all camera views at desktop/mobile, both extreme tilted states. Zero horizontal overflow, errors or failed requests; warnings are existing router flags only.
- Visually reviewed final-1536x1024.png, final-1440x900.png, final-1280x720.png, final-1024x768.png, final-768x1024.png, final-390x844.png, final Top/Front views and both mobile extremes. Desktop composition closely follows reference; all responsive controls/readings remain usable. The physically consistent straight COM locus, calculated values and explicit square support intentionally correct mockup contradictions described above.
- Final production build 1869 exited 0 after the final CSS change, 780 precache entries, only existing bundle-size advisory. No subsequent application source edits and no pending build/test handles.

No known page-specific blockers remain. Page18 starts only after this verification record.
