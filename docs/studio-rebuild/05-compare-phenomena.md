# Concept Overview — Compare Phenomena

Status: VERIFIED. Route: /comparison. Reference: 01_concept_overview/05_compare_phenomena.png, 1536 × 1024. No later page has been started.

## Existing implementation and preservation

Read the complete existing ComparisonPage.tsx, App routes and linking pages. The route was a static product benchmark, not a phenomenon simulation. Captured its existing browser rendering in before.png. Retained the entire benchmark component at /comparison?view=benchmark (all query URLs continue to use the original content). The plain route lazy-loads ComparePhenomenaPage. Existing lesson IDs, engines, datasets and routing contracts are unchanged.

## Physics

- Pendulum: linear small-angle θ = θ₀ cos(√(g/ℓ)t), g = 9.81 m/s², T = 2π√(ℓ/g), arc displacement ℓθ. Maximum amplitude 0.20 rad; nonlinear period correction approximately 0.25%, explicitly disclosed. Positive displacement is to the left in the apparatus. Drawing auto-fits the string, while its period and arc displacement depend on physical length.
- Orbit: relative circular Earth–Moon separation r = 384.4 Mm by default, μ = (398600.435507 + 4902.800118) × 10⁹ m³/s². T = 2π√(r³/μ) = approximately 27.3 days. Earth-centered relative coordinates and illustrative planet sizes. x = r cos(ωt). Orbital playback advances four days per real second at 1× and is labeled directly on the card. The mockup’s combination of an Earth–Moon image, r = 1 AU and T = 27.3 d is inconsistent and has been corrected.
- Source for gravitational parameters and day conversion: [JPL Astrodynamic Parameters](https://ssd.jpl.nasa.gov/astro_par.html). One day = 86400 s; the ratio between compared models always uses seconds internally.
- String: y(x,t) = A cos(2π(ft − x/λ)), λ = v/f. The graph follows the marked x = 0 point. Changing frequency at fixed speed changes wavelength. Varying speed represents a different string/tension, explained in Experiment.
- LC: C is converted from mF to F. T = 2π√(LC), V = V₀ cos(ωt), I = −dQ/dt = C V₀ ω sin(ωt), Q = CV. No resistance or source. Negative initial voltage reverses phase; zero produces no oscillation. E = CV²/2 + LI²/2 stays constant.
- Every graph is calculated from its model, correcting the reference’s inconsistent number of cycles (especially the 2 Hz wave over 3 s). The graph phase marker repeats the equivalent first-cycle phase after the fixed window; clocks always display elapsed model time.

## Implementation

Separated scientific calculations, apparatus, graphs, icons and page interactions. Four independently selectable cards support repeated systems. Header selectors and Phenomenon A/B selectors share state. Shared quantity switches between period, frequency and angular frequency and updates the relationship and every live value. Experiment opens per-card controls; Predict provides five distinct scaling questions with recorded feedback. Explain describes each selected model and computes a unit-consistent A/B ratio. Notebook saves locally and reports unavailable storage. Settings exposes playback speed, amplitude guides and the preserved benchmark. Pause stops all clocks; Reset restores simulation defaults; zoom changes only the apparatus.

The Earth asset reuses the independently generated transparent globe already verified for Physics Atlas. It was visually inspected before reuse. All other apparatus are SVG, including metal bob, support, string, orbit, procedural Moon surface, travelling wave, LC wires and continuous coil. The target screenshot is never used as page content.

## Current validation

Six physics groups pass: independent default periods/conversions; reciprocal identities and phase quadrants; every control boundary; period scaling; zero and negative excitation; travelling-wave consistency; LC energy conservation. Evidence: physics-results.json. Browser and responsive checks are in progress. First screenshot comparison exposed missing icon mappings, a disconnected coil path, overly heavy body text and title spacing; corrected before the next capture.


## Final comparison and browser evidence

Reviewed final-default.png at 1536 × 1024 against the target. The top bar, narrow navigation, title/mode row, four equal cards, scientific apparatus/readings, graphs, bottom A/B selectors, shared quantity/relationship/live panels and playback row follow the target composition. Iterated title size and spacing, graph origin/height, readable tick precision, icon mapping and coil continuity. The bob uses the actual 0.20 rad model angle rather than exaggerating the reference swing. Scientific plot cycle counts and orbital distance/units intentionally correct the mockup. The independently generated globe and procedural metal/Moon materials differ in surface detail from the reference image.

Ten browser groups pass in interaction-results.json. Tested all four header dropdowns through all models, both A/B selectors, all quantities, every parameter at min/max, pause/play, five question banks with wrong and correct feedback, saved notes and blocked storage, speed/guides/zoom, every learning mode, direct refresh, and preserved benchmark. Six viewport captures have zero horizontal overflow, zero clipped control containers and graphs at least 150 px high. Inspected all six screenshots and mobile-explain.png. Mobile stacks the cards; tablet uses two columns. No page errors, failed requests or page-specific warnings were recorded; existing React Router migration notices are retained separately.

Screenshot capture was corrected to scroll to the top before full-page capture. Chrome had included the globally fixed, unfocused skip link above the scrolled viewport in full-page images; this was an evidence-capture artifact, not a visible in-viewport overlay. The fresh captures remove it without changing the shared skip-link behavior.

Additional checks: the actual SVG Earth asset decodes (1254 px); dialog Shift+Tab/Tab wraps focus, Escape restores the triggering settings button; zero pendulum/wave amplitudes, the widest orbit and a long-period reversed-voltage LC state render with graph markers inside their plot. Evidence: additional-results.json and boundary-models.png. Graph time spans expand to a clean multiple of their default span when a longer period needs space.

The 90-frame local animation sample recorded median 20.9 ms, p95 34.9 ms, maximum 48.5 ms and no intervals over 50 ms while all four models ran. This is local headless-browser evidence, not a guarantee for every device.

Preserved benchmark links in the existing audit, client demos, excellence benchmark, app directory and search metadata now explicitly target /comparison?view=benchmark. Their labels and content are unchanged. The dedicated surface styling is limited to the new plain route, preserving the benchmark's original application shell.


Final current-direction review corrected the LC annotation to counterclockwise for I = −dQ/dt, with Q defined as upper-plate charge and voltage measured upper relative to lower. Added instantaneous +/− plate signs, suppressed at zero voltage. The current magnitude, energy calculation and voltage graph are unchanged. Re-ran physics and boundary/keyboard/asset checks after this correction. The original benchmark shell and all four existing benchmark-link pages passed route-results.json.


## Acceptance

All completion gates VERIFIED. Final production build exited 0 after the LC polarity correction, including 725 PWA entries. Existing large-chunk advisory remains. The boundary capture initially timed out waiting for the browser's full load event; rerun waited for DOM readiness, then explicitly decoded the actual scene image, and passed with exit 0. No source workaround or skipped assertion was needed. Five of 102 unique pages are now verified. The next page is Mastery Challenge; no later studio has been started.
