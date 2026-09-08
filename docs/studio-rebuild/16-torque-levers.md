# Mechanics — Torque and Levers

Status: VERIFIED. Page16/102. Page15 passed every gate before this page began. Dedicated implementation now present; final verification is in progress.

## Reference inspection

Mockup03_mechanics/04_torque_levers.png,1536x1024. Sidebar202px; titlex234y20; mode tabsx234y92h42. Apparatus viewportx216y149w962h776; right controlsx1192y150w332h338, live readingsy500h222, formulay734h192. Top right six-challenge card, previous/next controls. Footer reset, pause, zoom minus/100%/plus and Next Challenge. Sidebar home, Mechanics, Thermodynamics, Waves, Electricity and Magnetism, Optics, Modern Physics, Simulations, Lab Notebook, Data and Graphs, Challenges and Settings.

Realistic beam balance: brushed metal ruler x291..1134y371..415, fulcrum x693y404, post/base to y773. Left10N slotted weight attached nearx422, effort6.7N nearx1057. Cyan and violet horizontal moment-arm guides above beam. Need generated passive laboratory bench and code-controlled ruler/fulcrum/weights, genuine draggable load, effort attachment and pivot. No mockup asset use.

Defaults load position-.300m, effort6.7N, pivot0, effort attachment+.450m (deduced from moment-arm guide). Position controls-.5..+.5m, force0..50N. Reference ruler tick positions are inconsistent with its moment-arm labels: implement a consistent physical scale. Left downward10N at-.3m produces+3.00Nm counterclockwise; right downward6.7N at+.45m produces-3.015Nm clockwise. Reference clockwise/counterclockwise headings are reversed and net+.02 has opposite sign to standard CCW-positive. Correct to CW3.02,CCW3.00,net-.02Nm. Actual load/effort ratio10/6.7=1.492537; ideal arm ratio.45/.3=1.5. Formula equating these applies at equilibrium only; make that condition clear. Use vector torque r cross F (reference F cross r is incorrect vector order).

## Existing coverage

Inspected rotationalDynamicsSimulation.ts and associated lab: disk2kg/radius.25m, point masses, external torque, damping, angular acceleration. This is a different valid lesson; preserve it. Existing mapping /experiments/rotational-dynamics does not supply beam equilibrium. Inspected expansion-labs/PhysicsExpansionLab.tsx balancing-act: static leftmass/leftdistance/rightmass controls, computes required right distance and compares moments at1m; illustrative clamped tilt. Preserve existing contracts and lesson. Dedicated /mechanics/torque-levers is appropriate for requested controls and apparatus. Baseline script scripts/captureTorqueBaseline.mjs opens both related routes; screenshots go to artifacts/studio-rebuild/16-torque-levers.

Next: finish baseline capture, design signed torque/rotational dynamics including physical travel stops, singular pivot/attachment cases and valid mechanical advantage, then implement this one page. All interaction, physics, screenshot, responsive and build gates remain outstanding. No page17 work started.


## Implementation and physics

Implemented /mechanics/torque-levers with local Suspense, TorqueLeversPage, LeverScene, page-scoped tlv CSS and src/lib/lever.ts. Mechanics parent links the new page. Existing rotational-dynamics and balancing-act remain intact; both baselines were captured successfully after using the actual main element rather than assuming an h1 exists.

The 10 N point load is fixed on a rigid hanger with its centre0.150m below the beam. The ideal beam and effort applicator are massless, with a finite0.150kg m² axle hub. g9.81; load mass10/g. About the selected pivot, I=Ihub+(10/g)(rL²+d²). At angle theta, the load arm is rL cos(theta)+d sin(theta), effort arm rE cos(theta). Signed CCW torques are minus force times horizontal arm. The effort is a constant vertical force through a vertical cable; its marker stays vertical as the beam turns. The load rotates rigidly with its hanger. I alpha=net torque-b omega with b0.120Nm s. RK4 substeps no longer than.001s integrate dynamics and damping loss; bisection locates a15degree travel limit. A zero-restitution latch absorbs kinetic energy and holds the axle, with reaction explicitly shown separately from applied-force torque. Reset/input changes release it. U=10[rL sin(theta)+d(1-cos(theta))]+FE rE sin(theta), K=.5I omega², with losses completing the energy balance.

Three physics test groups pass default torques/ratios, exhaustive massless-beam force/position limits and mirrored signs, zero force/zero moment arm, positive inertia, exact balance, both travel limits, damping/impact energy and timestep convergence. Evidence physics-results.json and testLeverPhysics.mjs. Default CW3.015Nm, CCW3.000Nm, net-.015Nm, force ratio1.492537, ideal ratio1.5. Explicit correction to the mockup retained above.

Every control is implemented: local numeric drafts, sliders, reset/run/pause, bounded zoom, load/pivot/effort dragging and keyboard arrows/Home/End, six challenge navigation and configuration-specific checking, prediction, experiment presets, exact balance and labels, explanation, notebook records/notes/clear, sidebar and parent links. Notebook is explicitly session-local. Exact balance is disabled where no nonnegative downward effort solution exists. Challenge tolerance.005Nm, with nondegenerate opposing arms and task-specific geometry.

## Visual and browser iterations

Initial screenshot exposed global #content rules stretching the challenge card and overriding main padding; scoped higher-specificity overrides restore the requested geometry. Vertical zero-width gradient strokes were invisible; explicit metal stroke colours restore the rigid hangers. Reduced procedural grain strength, placed consistent ruler labels on the metal, fixed end-label/unit collisions, enlarged mobile labels and touch targets, aligned default moment guides, and placed effort markers above the beam where two force attachments nearly coincide. The camera widens modestly near an extreme fulcrum so the base remains visible. Correct physical ruler positions replace inconsistent mockup tick geometry.

Prechecks pass motion/pause/reset, prediction, exact balance, mirrored arrangement, labels, slider limits, keyboard/pointer drag, zoom and notebook. Extra checks pass all six challenge solutions and both extreme latch states, including mobile stopped captures. Final browser checks pass numeric lower/upper/empty behaviour, wrong challenge, zero effort arm, direct refresh, every sidebar destination and parent entry. Runtime90frames: median7ms,p9513.9ms,max14ms. No page errors or failed requests. Own-page warnings are only the existing two shared React Router future-flag advisories. Navigation to unrelated subject pages emits existing THREE shadow-map/shader advisories, recorded with URL in final-checks.json.

Six required viewport screenshots have been iterated repeatedly and have zero horizontal overflow. Final fresh-page evidence responsive-final.json has zero errors/failed requests and12 shared router warnings across6 pages. Screenshot review and the final production build remain to be closed out before VERIFIED. Builds66041,39996,64990 passed776 precache entries; latest CSS alignment changes require the final active build53223. First build53959 caught ES target incompatibility of replaceAll; replaced with a regular expression. No configuration changes.

## Asset provenance

Built-in image_gen.imagegen created public/assets/torque-levers/lab.png (1402x1122). Source retained at C:/Users/saisa/.codex/generated_images/01a07335-84ef-78b2-bcb9-d2e500ff94cb/exec-3d0eabfb-f633-4abd-8e22-c0e284cb3070.png. Image visually inspected: empty central lab bench, peripheral calibration weights/clamp/ruler, no central apparatus or UI. All dynamic apparatus and interface are SVG/HTML/CSS. No target screenshot is rendered.

Exact prompt: Use case: background-plate. Photorealistic dim mechanics teaching laboratory, landscape 5:4 composition, perfectly frontal camera at beam-balance height. Empty dark steel workbench surface across lower 35 percent, softly reflected cool light and fine scratches. Entire center 80 percent empty for a beam balance to be composited later. Deep charcoal navy wall with very faint grid-like seams, defocused clamp stand at far left edge, small stacked calibration weights at bottom far left, and a loose steel ruler at bottom far right. Low-key cinematic side lighting, authentic university lab, muted contrast so foreground apparatus can read clearly. No beam balance, central stand, central ruler, text, labels, people, UI, graphs, arrows or logos. Keep all peripheral equipment small and out of focus. Materials should look like a real photograph.


## Completion

Final production build53223 exited0 with776 precache entries after all source changes. Final fresh screenshots at1536x1024,1440x900,1280x720,1024x768,768x1024 and390x844 were visually reviewed; stopped views in both directions were also reviewed, including mobile. Final scoped padding restores the reference desktop stage origin216,149 and major panel geometry. Default starts at rest, with scientifically corrected torque values, signs, ruler scale and mechanical-advantage condition. Passive photographic background and procedural apparatus textures differ naturally from the reference; no outstanding page-specific visual or functional defect is known. All six completion statuses VERIFIED. No live build/test handles remain. Next sequential page17: Equilibrium and Centre of Mass.
