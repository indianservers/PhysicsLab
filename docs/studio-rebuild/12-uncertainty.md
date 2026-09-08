# Measurement — Uncertainty and Error Analysis

Status: VERIFIED. Mockup: 02_measurement/06_uncertainty.png, 1536×1024. Route: /measurement/uncertainty.

## Preserved code and scientific scope

Inspected the original measurement-errors solver/component before adding the volume-specific lesson. Its roundUncertainty helper is reused and existing contracts/routes are preserved. Browser tests verify the original lesson link and the Measurement studio entry.

Seeded normal reading error has σ=.45 mL about a 66.4 mL reference, interpolated to .1 mL. Systematic mode injects +.8 mL without random scatter; mixed mode combines both. The correction toggle subtracts known injected bias. The cylinder illustrates the selected observed reading, not a claim that reading error changes actual liquid volume.

Sample SD uses n−1 and SEM=s/√n. Instrument precision is interpreted as calibration half-width a with a rectangular distribution: uB=a/√3. This common calibration component does not average down. Combined standard uncertainty is sqrt(s²/n+a²/3), assuming independent components, with k=1. Uncorrected injected bias is explicitly flagged separately. Empty and one-reading random uncertainty estimates are unavailable. Percent error is signed relative to 66.4 mL.

Source verified: [NIST TN 1297 Appendix A](https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-appendix-law-propagation-uncertainty), equations A-5 and A-7. The calibration bound is converted to standard uncertainty before combination.

The reference's table, plots and summary values disagree. Every new output derives from the same simulated readings. Default mean 66.42 mL, sample SD .576965 mL, SEM .182452 mL, calibration component .288675 mL, combined .341500 mL and signed error +.03012%. The histogram conserves all observations; its mean marker and the scatter mean agree with the table.

## Implementation and visual review

The page contains a code-defined graduated cylinder and meniscus magnifier, sample count/precision/error controls, selectable reading table, results, significant-figure calculator, scatter plot, histogram, uncertainty relation, replay/pause, zoom, learning levels, bias correction, predictions, three challenges and notes. The meniscus bottom and its guide follow the selected table reading. Run acquires a new seeded series; default data are an explicitly simulated preview.

Repeated screenshot review corrected malformed meniscus paths, bottom-of-meniscus guides, subscript placement, tick duplication, cylinder text contrast and mobile table height. A generated volumetric laboratory background brings the rack, wash bottle, cloth and worktop closer to the reference. The 1536×1024 panel composition follows the mockup. Independent glass contours and scientifically corrected values differ from the photograph. All scientific geometry, scales, measurements and UI remain code; no mockup screenshot is rendered.

Six required viewports pass overflow/clipping checks. Final desktop and phone captures were inspected; the phone exposes all ten default rows, keeps plots readable through container-width coordinates and stacks controls/results. Zoom deliberately changes the scientific viewport.

## Validation

- Three physics groups cover all sample count/precision/error models, mean/SD/SEM/RSS, bias correction, histogram conservation, empty/single states and formatting/invalid inputs.
- Eight browser groups cover table selection, counts/precision, error models/correction, acquisition/pause/resume, calculator validation, all challenges/prediction, actual clipboard readback, notes/focus, learning levels, zoom limits/keyboard operation, complete 50-reading acquisition, independently recomputed mean/SD/histogram totals, old lesson navigation, studio entry and direct refresh.
- All six viewport checks pass on the final implementation. No page exceptions, console errors or failed requests. Only pre-existing React Router future-flag warnings occur.
- The generated background decodes at 1448×1086. A 120-frame sample reports median 6.9 ms, p95 7.1 ms and maximum 7.5 ms on this host; these are local measurements, not a universal guarantee.
- Final TypeScript/Vite/PWA production build passes with 759 precache entries.

Evidence: artifacts/studio-rebuild/12-uncertainty/{physics-results.json,interaction-prechecks.json,additional-interactions.json,runtime-results.json,build.log}, six viewport PNGs; scripts/testUncertaintyPhysics.mjs, testUncertainty.mjs, testUncertaintyAdditional.mjs, testUncertaintyRuntime.mjs and captureUncertainty.mjs.

Reset restores default samples/input, selection, zoom, mode, challenge and calculator values. Notes and learning level are session preferences. Measurement Studio's six pages are now verified. No Mechanics page was started before this gate.

## Asset provenance

Built-in image_gen.imagegen produced public/assets/uncertainty/volume-bench.png (1448×1086). Source: C:/Users/saisa/.codex/generated_images/01a07335-84ef-78b2-bcb9-d2e500ff94cb/exec-09c8b362-bcf7-4d30-a1d7-65ee88678e67.png.

Exact prompt: Use case: product-mockup. Photorealistic empty volumetric measurement laboratory bench background, landscape 4:3. Low front camera at tabletop height looking slightly downward. Central 65 percent completely clear for a separately rendered tall graduated cylinder. Dark charcoal stone worktop fills lower 35 percent, subtle realistic texture. Softly blurred perforated grey metal laboratory wall in upper background. Far left: out-of-focus rack of narrow empty test tubes and a folded medium blue microfiber cloth resting on bench at bottom left edge. Far right: blurred translucent white laboratory wash bottle with long curved spout, no lettering or labels, behind empty central working area. Cool neutral laboratory illumination, bright soft highlights from upper left, dark blue-grey shadows, realistic depth of field and photographic grain. No cylinder or measuring vessel in central area, no foreground instruments, no diagrams, no text, no numbers, no UI, no borders. The foreground surface must be empty and in focus.
