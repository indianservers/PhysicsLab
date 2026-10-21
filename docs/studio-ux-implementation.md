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

The shared layer does not redraw every domain-specific graph or add a new plot
cursor to every visualization. Existing plot interactions remain; the shared
inspector provides a textual evidence alternative. Optional challenge feedback
provides reference reasoning and separate saved self-assessment of result/units
and reasoning/assumptions rather than automatically grading free-form prose.
These distinctions matter when reviewing the original proposals: shared coverage
is not a claim of 2,880 independently implemented bespoke scene changes.

## Verification artifacts

- `artifacts/studio-physics-audit/results.json`: physics-model and theory checks.
- `artifacts/studio-physics-audit/browser-results.json`: final lab-browser results.
- `artifacts/studio-ux-audit/studio-homes.json`: six-link/search checks for 16 homes.
- `artifacts/studio-physics-audit/page-interactions.json`: source interaction scan.
- `artifacts/studio-ux-audit/*-mobile.png`: representative notebook screenshots.

The browser suite exercises the rendered pages and existing model handlers with
software WebGL; animation callbacks are throttled to keep UI tests reproducible.
Browser checks cover five notebook modes, native learning modes, input/restore
round trips where an editable numeric control exists, saved predictions, reference
reasoning, focus return, and 390-pixel notebook layout. This is interaction
verification, not a claim of screen-reader or WCAG conformance certification.

## Final verification result

- 96/96 lab routes passed after the full sequential run and focused rechecks.
- 16/16 studio homes passed six-link and search checks.
- 480 notebook-tab and 288 native learning-mode checks passed.
- All 96 notebook layouts checked at 390 px; 95 numeric control round trips.
- Three representative labs additionally checked visual captures and self-assessment.
- 264 studio physics assertions, 581 existing physics tests and six focused numeric-input assertions passed.
- 144 page components scanned without dead-button/Observe-handler findings.
- TypeScript and the final Vite/PWA production build passed. The build retains
  the existing large-bundle warning.

The merged per-route report identifies which results came from focused rechecks;
its summary is `artifacts/studio-ux-audit/summary.json`. Changes are local and have
not been deployed.
