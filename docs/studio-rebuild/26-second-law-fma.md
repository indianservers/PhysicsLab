# Force & Newton’s Laws — Second Law

Status: VERIFIED, page26/102. Reference: `05_force_newton/02_second_law_fma.png` (1536×1024).

The reference shows a dark Physics Studio page with a two-row laboratory layout: navigation rail, Force & Newton’s Laws / Second Law heading, four mode tabs, F=ma equation card, realistic blue cart and force sensor scene, live readings for force/mass/measured and predicted acceleration, velocity and position cards, acceleration-time graph, three parameter sliders and transport controls.

Existing `src/experiments/newton-s-second-law/NewtonsSecondLawLab.tsx` and `newton-s-second-lawSimulation.ts` were inspected. The engine correctly computes net force after friction, acceleration `Fnet/m`, position `½at²`, velocity `at`, static hold and recorded trials. Its original route and controls must remain preserved while this dedicated page receives the reference-matched presentation.

Implementation is in `src/pages/SecondLawStudioPage.tsx` and `src/second-law-studio.css`, reusing `NewtonTrackScene` and the validated Newton model. The generated scene is native Three.js apparatus rather than the reference screenshot; all labels, force arrows, graph and readings are native UI.

Verification: `testSecondLawDeterministic.mjs` passes the page defaults, force/mass/friction controls, exact F=ma reading, prediction response and reset. `final-checks.json` records play/pause/reset, six viewport screenshots, no horizontal overflow, no page errors and no failed requests. The final 1536px capture aligns the reference’s navigation, heading, F=ma card, wide cart scene, right readings, graph, three slider cards and transport controls. `npx vite build` completed with 2245 modules and emitted `SecondLawStudioPage-D4FyZqpH.js` and its CSS chunk. Existing `/experiments/newton-s-second-law` remains preserved and was separately smoke-tested. No known page defects remain.
