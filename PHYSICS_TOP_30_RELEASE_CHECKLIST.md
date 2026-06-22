# Physics Top 30 Release Checklist

## Build And Tests

- [x] `npm run build` passed.
- [x] `npm run test:physics` passed.
- [x] Physics validation reported `201/201 physics validation tests passed`.
- [x] Browser console error scan passed during smoke QA.
- [ ] Large bundle warning resolved. Current release has a non-blocking Vite chunk-size warning.

## Route QA

- [x] `/experiments/circular-motion`
- [x] `/experiments/elastic-collision`
- [x] `/experiments/friction`
- [x] `/experiments/hooke-s-law`
- [x] `/experiments/inclined-plane`
- [x] `/experiments/uniform-motion`
- [x] `/experiments/newton-s-second-law`
- [x] `/experiments/conservation-of-energy`
- [x] `/experiments/simple-pendulum`
- [x] `/experiments/projectile-motion`
- [x] `/experiments/chladni-plate`
- [x] `/experiments/single-slit-diffraction`
- [x] `/experiments/wave-lab`
- [x] `/experiments/young-double-slit`
- [x] `/experiments/sound-wave-anatomy`
- [x] `/experiments/ohms-law`
- [x] `/experiments/series-parallel-resistance`
- [x] `/experiments/emi-faraday`
- [x] `/experiments/ac-generator`
- [x] `/experiments/transformer-lab`
- [x] `/experiments/electromagnet`
- [x] `/experiments/magnetic-field-current`
- [x] `/experiments/reflection-plane-mirror`
- [x] `/experiments/lens-formula`
- [x] `/experiments/prism-dispersion`
- [x] `/experiments/total-internal-reflection`
- [x] `/experiments/human-eye-defects`
- [x] `/experiments/buoyancy`
- [x] `/experiments/bernoulli-fluid-flow`
- [x] `/experiments/gas-laws`

## Fallback QA

- [x] Non-Top-30 fallback routes still load.
- [x] `/experiments/shadows-eclipses` fallback checked.
- [x] `/experiments/advanced-quantum-operators` fallback checked.
- [x] Existing `/experiments/:id` route contract preserved.

## Premium UI QA

- [x] All Top 30 labs render with the premium shell.
- [x] Domain-specific visual identities checked.
- [x] Preset strip present in all Top 30 labs.
- [x] Replay timeline present in all Top 30 labs.
- [x] Reset button present in all Top 30 labs.
- [x] Prediction/misconception cards present where expected.
- [x] Model status labels checked.
- [x] No exact claims for qualitative models checked.
- [x] Teacher mode content checked by shell/secondary panel presence.
- [x] Report export integration remains available through the experiment detail page.

## Mobile QA

- [x] 390 x 844 viewport checked.
- [x] No horizontal overflow in all Top 30 labs.
- [x] Visual stage remains visible.
- [x] Controls remain reachable.
- [x] Mobile dock present.
- [x] Observation/cause-effect panel present.
- [x] Range inputs meet 44 px touch height.
- [x] Wave-domain button touch target issue fixed.

## Accessibility QA

- [x] Inputs have labels and unit text.
- [x] Reset buttons have `aria-label`.
- [x] Preset/replay controls are keyboard-reachable buttons.
- [x] Important SVG objects have text labels.
- [x] Color is paired with text/shape labels where meaning matters.
- [x] Reduced-motion CSS rule present.
- [ ] Full tab-order audit with keyboard-only recording.

## Scientific Accuracy QA

- [x] Quantitative priority benchmarks pass.
- [x] Graph direction/shape checks pass where registered.
- [x] Boundary checks pass in physics script.
- [x] Unit labels present in controls and validation metadata.
- [x] Qualitative Chladni model is labeled as qualitative.
- [x] No accurate-calculator claim without registry language checked.

## Release Notes

- [x] Final report created: `PHYSICS_TOP_30_PREMIUM_VISUALIZATION_REPORT.md`.
- [x] Release checklist created: `PHYSICS_TOP_30_RELEASE_CHECKLIST.md`.
- [x] Known limitation documented: large bundle warning.
- [x] Recommended next 20 labs documented.

