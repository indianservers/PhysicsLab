# Interference rebuild checkpoint

Route: `/optics/interference` · reference `10_optics/05_interference.png`.

The generic reflection image has been removed. Original Three.js apparatus includes a laser barrel, metal stands, finite double-slit mask, rail/ruler, screen and sampled intensity texture. Four learning modes and three reference scene views are retained; no unrelated tabs or 3D dock. Original sidebar JSX is byte-for-byte equivalent to the preceding revision.

## Scientific model

SI-unit exact-path high-frequency long-slit scalar propagation with finite width 40 μm, 32-point quadrature and coherent field summation. Ideal narrow slits and incoherent intensity summation are separate comparisons. The profile/readings/screen share this model. Relative I(0)=1 is configuration-normalized, not calibrated irradiance. Extrema are sampled over ±10 mm; spacing is the nominal small-angle λL/d. The far-field formula is labeled approximate. The screenshot's inconsistent extrema are not hardcoded.

The rendered optical transverse scale is ×50, longitudinal distances physical. Markers travel at c in physical coordinates and one nominal ns per wall second. Fronts sample every 50,000th equal-phase center-source front. These are representative explanatory geometry, not a resolved carrier or full finite-aperture phase map. Screen gamma 0.45, approximate spectral color and vertical taper are presentation choices, not the measured intensity calculation.

Authoritative educational comparison: [OpenStax, Double-Slit Diffraction](https://openstax.org/books/university-physics-volume-3/pages/4-3-double-slit-diffraction). Independent far-field product and limiting-case tests validate the implementation without treating the simplified formula as exact throughout the control range.

## Evidence

- `model-verification.json`: 180 configurations / 1620 sampled positions; symmetry, positivity, normalization, quadrature convergence, far-field/narrow limits, finite-window power bound, c-speed markers, sampled phase fronts.
- `browser-verification.json`: three optical modes/views/presets; all controls and numeric inputs; pointer/keyboard/touch detector; learning/recording/quizzes; assignment locks; three SPA remounts; WebGL fallback; six sizes (1536×1024, 1920×912, 1024×768, 768×1024, 390×844, 320×740). Formula unclipped and no horizontal overflow. Desktop toolbar fits viewport.
- Actual Three scene inspected through its devtools observation hook: ray endpoint maximum error 5.36e-09 m, texture maximum channel error 0. Actual front vertices checked against physical phase.
- `visible-packet-motion.json`: 787 stage pixels change by >20 levels from 0 to 0.37 ns.
- `before.png`, six `after-*.png`, fallback screenshot, packet screenshots, `comparison.png`, `difference.png`, `responsive-contact-sheet.png`.
- `visual-comparison.json`: sidebar excluded, main widths normalized; MAE 18.308, SSIM 0.5491. Diagnostic metrics, not acceptance percentages.
- Full `npm run build` passed (TypeScript, Vite, PWA); shared physics tests 581/581; production smoke passed. Terminal results and source hashes are in `verification-status.json`. Existing application-wide large bundle/precache warnings remain open.

## Remaining work

Photographic background and material/lighting realism, apparatus proportions, detailed hardware and typography remain visibly different. Cross-browser engines, extended GPU memory and focus-order audits remain open. Polarization, evanescent fields and material boundary effects are omitted. No claim of full visual fidelity or overall completion. The complete 102-reference / 17-studio goal remains active.
