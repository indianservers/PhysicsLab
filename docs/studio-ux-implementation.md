# Studio UX implementation — 21 October 2026

Scope: the 16 studio homes and the 96 labs registered in `studioReferenceLabs.ts`.
The earlier 2,880-item proposal uses 30 common review dimensions tailored to each
lab. This implementation provides shared tools for those dimensions and preserves
each page's specialized apparatus, graphs, challenges and physics models.

## Implemented shared experience

Every registered lab has a **Lab notebook & tools** launcher. The notebook has
independent Observe, Predict, Experiment, Explain and Challenge tabs. These are
additional investigation tools; existing apparatus learning modes remain usable.

| Roadmap dimensions | Implementation |
| --- | --- |
| 1–4: goal, controls, precision, evidence | Route-specific task, grouped precise controls, bounded numeric edits, increment buttons, labeled readout table with units from the page. |
| 5: visual linkage | Focus/locate actions outline matching control/readout labels in the apparatus. |
| 6–10: learning sequence and continuity | Saved prediction, four-step investigation checklist, explanatory chapter, optional challenge hint and reference reasoning, URL learning mode and retained notebook state. |
| 11: keyboard and focus | Tab arrows/Home/End, panel associations, visible focus, Escape dismissal and launcher focus return; native page tab handlers are reused. |
| 12–13: equations and units | Equation-symbol explorer outlines exact matching apparatus labels; units and definitions stay available when no matching label exists. |
| 14–17: examples, derivations, misconceptions, validity | Worked-example replay, derivation stepper/Show all, misconception explanation and model-assumption disclosure. |
| 18–21: comparisons, trials, inspection, reversibility | Pinned baseline alongside current readouts and optional captured visual previews; saved trial notes and values; selectable evidence rows; baseline/trial restore, control undo and undo trial removal. |
| 22–26: mobile and accessible presentation | Responsive notebook, text labels alongside data, user-triggered status announcements, annotation/decorative-effect preferences, reduced interface motion and apparatus Pause action. |
| 27–30: practice, extensions, reproducibility, continuity | Hint/answer self-check, model-extension activity, JSON notebook and SVG evidence-summary export, exposed-control sharing, session recap and next lab in the same studio. |

Original per-lab content is sourced from `studioTheoryContent.json`. The controls,
observable and visual guide for each of the 96 labs are in `studioUxContent.json`.
Recorded values come from real page controls and textual readouts; the notebook
does not calculate a competing physics model or invent observations.

## Studio navigation

Each studio home has six lab cards, a working search field and no placeholder
concept/activity links or unrelated subject navigation. Lab sidebars use
`StudioLabNav`, which lists only their studio's labs. Useful local actions such
as settings, help and challenge tools are retained separately.

## Precision and reproducibility boundaries

The shared number input accepts finite in-range values even between step
increments. Blur clamps bounds without silently quantizing a physical constant.
Incomplete edits stay local until valid. Notebook stepping accounts for the
displayed resolution of scientific notation and unrestricted numeric steps.

Snapshots restore **exposed controls**, not an entire solver checkpoint. Navigation
selectors and learning/challenge launch buttons are excluded. Locked or unavailable
inputs are skipped and reported. Paired number/range controls are recorded once,
using the number field rather than logarithmic slider coordinates. Hidden state,
unexposed precision, playback history and some scene choices may need manual setup.
The exported SVG is a labeled evidence summary, not an apparatus screenshot.
Optional baseline/current previews capture an available canvas or SVG graph;
unreadable/empty WebGL buffers fall back to the labeled comparison table.
Previews stay in the current session and notebook exports; local persistence omits
image data so it does not crowd out saved notes for other labs.

## Graph and native scene completion

All 103 labs, including the six practicals and optical elements workspace, publish typed snapshots from their actual production
solver into Graph & scene tools, available on the primary apparatus viewport.
Each lab has explicit physical axis labels and units. The response plot supports
bounded sweeps, cursor replay, a point table, immutable baseline traces, zoom,
pan, logarithmic axes, and CSV/SVG/JSON export. JSON includes original input and
scene snapshots, model assumptions and a solver source fingerprint.

A sweep holds other physical inputs fixed and restores the original input and
playback state. Cursor selection replays the exact saved setting through the
native model; an undo action restores the pre-inspection setting. Changing a held
parameter starts a new current trace. Undefined outputs remain gaps, and paths
break at physical branch changes. Logic states and integer quantum/nucleon
settings are shown as discrete points without interpolating impossible states.
These curves are sampled solver evaluations, not independent measurements.

Every primary native scene supports keyboard pan/magnification, enlarged view,
a reset restricted to presentation settings, and optional native grid/trail layers
where authored. View actions preserve experiment inputs and physical units.
Viewport magnification applies once to outer graphics; nested SVG artwork retains its native placement.
Native camera controls, specialized graphs and apparatus interactions remain
available. The atomic spectrum scene now uses the same transition solver for its
energy levels, selected arrow and wavelength positions; it labels schematic
level spacing and wavelengths outside the visible window explicitly.

The six practicals additionally provide 12 native response charts with keyboard
inspection, units, frozen baselines, zoom/pan, positive logarithmic axes, point
tables and CSV/SVG exports. Recorded readings use scatter plots; trial restore
replays the full apparatus settings and clock. Fits are withheld when controlled
variables differ. Five practical tabs retain their state when switching views.
Native camera presets and reset operate on the actual 3D camera, and paused
apparatus renders only when its state or view changes.

Optical sweeps evaluate the native ray tracer without adding undo-history steps.
Laser-off, no-hit and truncated paths remain undefined; graph lines break when
the interface, polygon face, TIR branch or angle winding changes. Measurements,
Theory and Experiments are keyboard-operable tabs. All seven added labs include
dedicated theory, worked examples, assumptions, misconceptions and investigations.
Studio navigation is restricted to the respective studio's labs. There are 103
unique lab routes and 104 studio cards because falling papers is cross-listed.

## Verification artifacts

- `artifacts/studio-physics-audit/results.json`: physics-model and theory checks.
- `artifacts/studio-ux-audit/all-labs-browser-results.json`: current full 103-lab audit, including native practical workflows and optical edge cases.
- `artifacts/studio-ux-audit/visual-browser-results.json`: combined learning, graph and native-scene browser results.
- `artifacts/studio-ux-audit/visual-release-browser-results.json`: graph, scene and native-tab checks against the isolated staged release.
- `artifacts/studio-ux-audit/visual-math-tests.json`: graph domains, singularities, units, spectrum transitions and solver fingerprints.
- `artifacts/studio-ux-audit/visual-adapter-tests.json`: development lifecycle, exact replay, clock ordering and assignment locks.
- `artifacts/studio-ux-audit/studio-homes.json`: studio-scoped lab-link/search checks for 16 homes.
- `artifacts/studio-physics-audit/page-interactions.json`: source interaction scan.
- `artifacts/studio-ux-audit/*-mobile.png`: representative notebook screenshots.

The browser suite exercises the rendered pages and existing model handlers with
software WebGL; animation callbacks are throttled to keep UI tests reproducible.
Browser checks cover five notebook modes, native learning modes, input/restore
round trips where an editable numeric control exists, saved predictions, reference
reasoning, focus return, and 390-pixel notebook layout. This is interaction
verification, not a claim of screen-reader or WCAG conformance certification.

## Final verification result

- 103/103 unique lab routes passed in browser batches and focused rechecks; every route received the same notebook, graph, scene and theory assertions.
- 16/16 studio homes passed studio-scoped link and search checks (104 cards; falling papers is cross-listed).
- 515 notebook tabs, 309 graph/scene tabs and 288 native learning modes passed.
- 103 native ARIA tab interactions across 25 groups checked selection, visible content, arrow navigation and focus.
- All 103 notebook and graph layouts checked at 390 px; 102 numeric control round trips.
- All 103 real-solver sweeps, cursor replays, presentation resets and CSV/SVG exports checked.
- Six practical workflows additionally checked all 12 native plots, saved-trial replay, immutable baselines, CSV/SVG exports, clear/undo, actual camera presets and on-demand paused rendering. Mobile captures wait for WebGL repaint after resize.
- Optical checks cover 44 shapes, 26 materials, mouse/touch dragging, 20 detailed interaction scenarios, history-preserving sweeps and undefined no-hit/laser-off responses.
- 292 studio physics assertions, 581 existing physics tests, 75 graph/spectrum assertions, eight adapter checks and 80 lesson-content routes passed. The six practical model and visual-geometry suites also passed.
- 145 page components scanned without dead-button/Observe-handler findings.
- TypeScript and the Vite/PWA production build passed with the existing large-bundle warning.

The authoritative per-route report is `artifacts/studio-ux-audit/all-labs-browser-results.json`; counts are reproduced by `node scripts/summarizeStudioBrowserAudit.mjs`. Its recheck metadata records the corrected screenshot wait and the resulting viewport recovery. File-import checks wait for the asynchronous setup restoration. Browser checks used headless Edge and software WebGL with 500 ms animation callbacks. The electronics batch used a 0.5 device pixel ratio to reduce software rendering cost; CSS viewports and assertions were unchanged. Remaining batches used a pixel ratio of 1.

These checks verify interactions, not screen-reader or WCAG certification. A Git push does not independently confirm the deployed website has refreshed.
