# Phase 5 Full Physics And Learning Audit Report

Audit date: 2026-06-26

## 1. Executive Summary

This audit reviewed the Physics Simulator as a scientific learning platform, not only as a React application. The current product is meaningfully stronger than a prototype: it has a broad experiment catalog, central scientific-trust metadata, unit-aware calculator modules, graph measurement adapters, flagship lab models, guided learning stages, teacher assignment snapshots, report exports, and a physics validation script.

Current maturity level: strong classroom-oriented learning platform with validated formula islands and transparent trust UX. It is not yet a fully validated simulation platform because most experiments remain textbook calculators, educational visualizations, or starter workspace entries rather than independently validated dynamic models.

Baseline verified during this audit:

- `npm run test:physics`: previously passed 165/165 in this session and should remain the primary audit gate.
- `npm run build`: previously passed in this session; Vite reported a large main JS chunk warning around the production bundle.
- Catalog scale from source inspection: about 72 experiment definitions across 13 categories.
- Page-level calculator surface: 69 explicit legacy calculator entries remain inside `ExperimentDetailPage.tsx`.
- Flagship model registry: 11 labs.
- Trust override coverage: 14 experiment-specific entries in `experimentAssumptions.ts`.

Final audit scores:

| Area | Score | Verdict |
| --- | ---: | --- |
| Scientific accuracy | 86/100 | Strong for formula calculators; uneven for visual simulations. |
| Unit clarity | 84/100 | Unit-aware pure calculators exist; UI/page-level legacy logic still creates risk. |
| Assumption visibility | 90/100 | Strong trust panel and exports; many labs inherit generic assumptions. |
| Pedagogical design | 86/100 | Solid guided flow; remediation is still shallow. |
| Assessment quality | 78/100 | Good question coverage types; many prompts are templated. |
| Graph and measurement trust | 88/100 | Fake cross-domain graph fields are blocked; formula graphs still need per-output provenance. |
| Classroom readiness | 85/100 | Teacher snapshots, locked variables, exports, and reports are strong; browser QA is missing. |
| Research usefulness | 64/100 | Transparent, but postgraduate/research labs are conceptual rather than research-grade. |

## 2. Domain Coverage Map

| Domain | Count | Current Quality | Main Strength | Main Gap |
| --- | ---: | --- | --- | --- |
| Electricity | 15 | High classroom breadth | Ohm, power, meters, LCR, transformer, generator coverage | Circuit topology solving is not yet the single source of truth for all electrical behavior. |
| Optics | 10 | Broad and useful | Reflection, lenses, mirrors, prism, TIR, instruments, eye defects | Several ray models are educational approximations and need clearer validation by case. |
| Waves | 10 | Strong conceptual range | Sound, wave speed, interference, diffraction, polarization, Chladni | Numerical wave engine lacks exposed CFL/wave-speed calibration and validation. |
| Mechanics | 9 | Strong foundation | Projectile, free fall, Newton, energy, pendulum, collisions | Starter workspace labs remain less validated than flagship calculators. |
| Thermodynamics | 6 | Good formula coverage | Heat, conduction, calorimetry, gas laws, ensembles | Dynamic heat flow and statistical mechanics are mostly conceptual. |
| Modern Physics | 6 | Good senior-school coverage | Photoelectric, nuclear decay, Bohr, de Broglie, relativity bridge | Quantum/operator labs need normalized state math before advanced claims. |
| Fluid Mechanics | 5 | Useful school/intro coverage | Hydrostatics, pressure, buoyancy, Bernoulli | Flow regime, viscosity, and Reynolds number are not deeply modeled. |
| Magnetism | 3 | Adequate school coverage | Electromagnet and magnetic field basics | Field visualizations remain mostly idealized diagrams. |
| Measurement | 2 | Good intent | Error, significant figures, computational workflow | Needs stronger notebook auto-checks and reproducibility scoring. |
| Astronomy | 2 | Good enrichment | Gravitation and satellite formulas | Orbital simulation is formula-first, not numerical orbit integration. |
| Electronics | 2 | Adequate board coverage | Logic gates and diode/rectifier basics | Diode model is threshold-level, not Shockley/rectifier waveform validated. |
| Energy | 1 | Useful comparator | Energy source comparison | More informational than simulation-based. |
| Oscillations | 1 | Interesting bridge | Coupled/chaotic oscillator concept | Needs energy drift, timestep, and chaos diagnostic validation. |

## 3. Ranked Findings

| Priority | Finding | Evidence | Risk | Recommendation |
| --- | --- | --- | --- | --- |
| P0 | Trust defaults can overstate validation for inherited calculator labs. | Domain defaults set many categories to `trustLevel: 100` and `modelClass: "Calculator"` unless overridden. | Users may read a generic formula smoke test as lab-specific validation. | Require explicit validation status per experiment before showing 100% trust; otherwise cap at classroom-ready confidence. |
| P0 | Legacy calculator logic remains the largest scientific maintenance risk. | `ExperimentDetailPage.tsx` still contains 69 explicit calculator entries plus category fallbacks. | Formula fixes can bypass pure calculator tests, units, and domain metadata. | Move all remaining page calculators into `src/lib/labCalculators/*` or domain model modules with validation cases. |
| P1 | Visual simulations and validated formulas are not always separated enough at the lab behavior level. | `wave-lab` is correctly marked visualization, but other visual-heavy labs inherit formula-centric domain trust. | Learners may treat qualitative animations as numerically predictive. | Add per-output provenance: formula, visual metaphor, numerical model, or measured canvas state. |
| P1 | Assessment remediation is present but shallow. | `generateQuiz()` uses three generic quiz items and fallback distractors such as wrong formula templates; `questionEngine.ts` creates useful types but generic answers. | Students can answer quizzes without diagnosing misconceptions deeply. | Bind wrong answers to misconception-specific explanations and next-step practice. |
| P1 | Advanced/postgraduate labs are conceptually useful but not advanced-model rigorous. | Relativity, quantum operators, statistical ensemble, and computational workflow entries mostly use conceptual formulas and general procedures. | Research/PhD users may expect reproducibility, parameter logs, normalized math, and numerical validation that are not present. | Rename as bridge/concept labs unless upgraded with reproducible computation, seeded runs, and validated algorithms. |
| P2 | Browser visual QA is still missing from the acceptance loop. | Prior Phase 4B explicitly called deeper screenshot testing future work; package has no dedicated browser test script. | Trust panels, classroom mode, graph cards, and mobile density can regress unnoticed. | Add Playwright route screenshots for home, experiments, flagship lab, teacher assignment, and sandbox. |
| P2 | Unit clarity is strong in pure calculators but not uniformly guaranteed in legacy UI controls. | Pure calculators use `quantity()` and `assertDimensions()`; page calculators parse units from control labels and formulas. | A formula can be numerically right while labels, graph axes, or report units drift. | Add metadata-based control/output units and reject string-parsed unit contracts for promoted labs. |
| P2 | Graph trust metadata is strong but formula graph provenance is too coarse. | Calculated lab graph card shows `Formula Calculation`, experiment trust, and model class. | Individual plotted outputs may have different assumptions or valid ranges. | Attach source, unit, valid range, and uncertainty to every output series, not only the experiment. |
| P3 | Large bundle warning remains. | Production build completed with a Vite chunk-size warning. | Classroom devices may experience slow load, especially with Three.js, Recharts, KaTeX, and broad route imports. | Code-split routes and heavy visual systems. |
| P3 | No lint script exists. | Package scripts expose `dev`, `build`, `serve`, `preview`, and `test:physics` only. | Style and simple correctness regressions depend on TypeScript/build catching them. | Add lint or static quality gate after audit findings are converted into implementation tasks. |

## 4. Experiment Maturity Table

| Group | Current Status | Recommended Target |
| --- | --- | --- |
| Flagship validated/formula labs: free fall, projectile motion, Ohm's law, Newton's second law, lens formula, buoyancy, gas laws, Young double slit, photoelectric equation | Strongest part of the platform; many have model versions, prediction prompts, measurement plans, graph presets, and validation references. | Keep as flagship/classroom ready, but add independent edge-case tests and per-output graph provenance. |
| Classroom-ready formula labs: mechanics, optics, electricity, fluids, thermo, waves | Broad curriculum coverage with assumptions, procedures, viva questions, and common mistakes. | Promote only after each lab has pure calculator modules, explicit valid ranges, and validation cases. |
| Visual model labs: wave lab, Chladni plate, sound anatomy, chemical effects, electromagnet, advanced quantum visuals | Useful teaching metaphors. | Keep visible but label every quantitative-looking display as visual unless backed by a tested model. |
| Starter workspace labs: generic mechanics entries built from the common lab workspace | Correctly capped as starter concepts by `withScientificTrust()` when template theory is detected. | Promote selectively; do not claim classroom-ready status until lab-specific model and graph behavior exist. |
| Advanced/research bridge labs: relativity, chaotic oscillators, quantum operators, statistical ensemble, computational workflow | Good conceptual bridge content. | Treat as enrichment until reproducibility, numerical stability, and domain-specific validation are added. |

## 5. Learning Flow Critique

Strengths:

- Guided learning stages cover concept, prediction, experiment, record, quiz, and mastery.
- Experiment details expose scientific trust, assumptions, limitations, valid ranges, failure conditions, sources, reports, graph metadata, and notebook exports.
- `questionEngine.ts` now includes conceptual, prediction, numerical, graph interpretation, error spotting, real-world, and viva question types.
- Teacher workflows support browser-only snapshots, locked variables, assignment metadata, and submission JSON exports.
- Learning portfolio import/export gives a usable local progress path.

Gaps:

- `generateQuiz()` still depends on one viva item, one formula, and one common mistake; this is too thin for mastery.
- Generic distractors can be pedagogically weak and sometimes too obviously wrong.
- Adaptive questions ask for reasoning but answers are often generic, so feedback is not strongly tied to the experiment's actual variables or misconception.
- Common mistakes are listed but not yet a remediation graph: wrong answer -> misconception -> explanation -> simpler replay -> reassessment.
- Research/advanced learning levels need reproducibility prompts, uncertainty accounting, seed/config export, and explicit model comparison.

Recommended learning upgrade:

- Replace static quiz generation with misconception-tagged item banks per domain.
- Score notebook entries for units, changed variable, observed trend, graph claim, and conclusion.
- Add remediation cards that cite the exact assumption, formula symbol, or graph feature the learner missed.
- Add teacher-facing rubric summaries for prediction quality, observation quality, unit consistency, and conclusion validity.

## 6. Scientific Trust UX Review

What is working well:

- The experiment detail page has a visible Scientific Trust section.
- Model class, evidence type, maturity level, and trust percentage are surfaced.
- Assumptions, limitations, valid ranges, failure conditions, and source refs are present in the data contract.
- Exports include trust and unit metadata.
- Sandbox graph variables are sanitized through measurement adapters, and fake pressure/voltage/current/intensity/wavelength/frequency graph points are not emitted generically from the Matter engine.

What needs tightening:

- Trust percentages should distinguish formula truth from lab implementation validation.
- Domain-level 100% defaults should not imply every experiment in that domain has independently tested behavior.
- Formula graphs should show output-specific assumptions and valid ranges.
- Visual-first labs should have a persistent badge that says "visual teaching model" near animations and graphs, not only inside trust details.

## 7. Phase 5 Roadmap

### P0 - Prevent Misleading Science

1. Cap inherited trust scores unless an experiment has explicit validation evidence.
2. Add a required `validationEvidence` or equivalent metadata field for promoted labs.
3. Move the highest-use legacy calculators out of `ExperimentDetailPage.tsx` into pure model modules.
4. Add validation cases for all flagship models, including invalid inputs and edge cases.

### P1 - Improve Learning And Remediation

1. Build misconception-tagged quizzes for mechanics, electricity, optics, waves, fluids, and thermodynamics.
2. Replace generic distractors with realistic misconceptions from `commonMistakes`.
3. Add remediation feedback tied to the selected wrong answer.
4. Add notebook rubric checks for units, variable isolation, graph interpretation, and conclusion.

### P2 - Validate Visual And Classroom Experience

1. Add Playwright screenshot smoke tests for `/`, `/experiments`, one flagship lab, one visual lab, `/teacher`, and `/sandbox`.
2. Verify mobile density for experiment detail pages, graph panels, and trust cards.
3. Test teacher snapshot -> student lock -> submission export round trip.
4. Add accessibility checks for high contrast, reduced motion, and keyboard reachability.

### P3 - Scale And Maintainability

1. Code-split heavy routes and libraries such as Three.js, Recharts, KaTeX-heavy pages, quantum pages, and teacher/LMS routes.
2. Split the experiment catalog by domain after validation metadata is stable.
3. Add lint/static quality scripts.
4. Add CI gates for build, physics validation, and browser smoke tests.

## 8. Future Test Matrix

| Test Area | Required Scenarios |
| --- | --- |
| Formula validation | Normal case, boundary case, invalid input, unit consistency, expected exception. |
| Trust metadata | Every experiment has assumptions, limitations, valid ranges, failure conditions, evidence type, maturity, and source refs. |
| Graph provenance | Every graph series has source type, unit, valid range, confidence, and assumptions. |
| Learning flow | Prediction saved, observation saved, conclusion saved, quiz graded, remediation displayed after wrong answer. |
| Teacher workflow | Snapshot URL generated, student values locked, submission JSON includes assignment and trust metadata. |
| Visual QA | Core routes render without console errors; graph/trust panels fit desktop and mobile; reduced motion respected. |
| Performance | Main chunk reduced through route-level dynamic imports; PWA still precaches intended assets. |

## 9. Final Verdict

The project is already a credible physics learning platform for school and early undergraduate use when its trust disclosures are read carefully. Its best labs can become flagship-grade with focused validation and model extraction. The largest remaining risk is not missing content; it is over-trusting broad, formula-based, or visual-first experiences before each one has lab-specific validation evidence.

The Phase 5 sprint should therefore prioritize scientific trust semantics and assessment depth before adding more experiments. The shortest path to a world-class platform is: fewer ambiguous claims, more validated model modules, stronger misconception remediation, and browser-tested classroom flows.
