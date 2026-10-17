# Remaining work

The latest instruction requires the pages to follow their mockups, including the exact relevant tabs, and forbids using cropped screenshot parts as UI assets.

Completed in this pass: unsupported 3D cleanup; reference-page dock removal; 96 dedicated lab links; working Work and Gravitational Field rebuilds; 102 captures at matching target dimensions; 102 measured main-region comparisons; a completed resumed 763-entry route sweep.

Still open: manually review and refine every meaningful visual discrepancy across all 102 pages; verify all primary and secondary tab groups against their individual references; replace remaining static apparatus or disconnected visuals; independently validate every model and every visible control; reconcile the 81-entry validation metadata with the 92-entry catalogue; expand source-asset checks; benchmark supported browsers, WebGL fallbacks, disposal and repeated navigation. Automated comparisons show substantial discrepancies on multiple pages and do not prove completion. Prior per-page VERIFIED labels are historical records, not recertification.

## Oscillations rebuild checkpoint (2026-10-17)

All six `/motion/` oscillation reference pages now have dedicated apparatus/layout rebuilds, four matching primary learning modes, and per-control/physics evidence under `spring-shm/`, `pendulum/`, `energy-exchange/`, `damping/`, `resonance/` and `coupled/`. The six-route browser tab/asset inventory was refreshed; no extra floating tools dock was found. This does not close visual acceptance: scenes still differ materially in photorealism, camera/backdrop and typography. Cross-browser/performance acceptance and remaining non-oscillation pages remain open. MAE and SSIM are refreshed by `scripts/compareOscillationRebuilds.py`, with sidebar excluded, and must not be interpreted as completion percentages.

Wave Properties now has a native model-driven rebuild and per-control evidence in `wave-properties/`. It remains open for photographic/material, header/type and cross-browser/performance acceptance. Superposition now also has a native rebuild with its own evidence; the remaining four Waves & Sound pages need the same reference-specific reconstruction and verification.

Superposition has passed model/control/shader checks, but its photographic water detail, exact header/type treatment and multi-browser/performance acceptance remain open. See superposition/report.md.

Interference now has dedicated reconstruction and model/control evidence in interference/. The centimetre/metre mismatch and signed-phase error are corrected. Native water lighting/material appearance, exact type, multi-browser and broad performance acceptance remain open. Standing Waves, Sound Spectrum and Doppler Effect are the remaining Waves & Sound pages awaiting equivalent rebuilds.

## Standing Waves checkpoint — 2026-10-17

Standing Waves native rebuild is functionally/scientifically checked, but material/lighting realism and precise typography remain below the reference. Linear fixed-end model excludes finite moving-support forcing, damping and nonlinear effects. Quarter/real-time high-frequency sampling can alias; Resolve cycles is available and explained. Measured local headless performance is about 29 fps, with long-duration/cross-browser profiling open. Remaining Sound Spectrum, Doppler Effect and the broader 102-page visual/model/control acceptance remain open.

## Sound Spectrum checkpoint — 2026-10-17

Sound Spectrum has validated generated signals, FFT/STFT and working controls, but photographic material/lighting/detail and typography matching remain open. Calibration is assumed, microphone/device audio is not used, periodic digital noise is a finite approximation, and room acoustics/physical speaker transfer are not solved. Correct pure-sine plots intentionally differ from the contradictory mockup. Doppler Effect and the broader 102-page visual/model/control/performance acceptance remain open.

## Doppler Effect checkpoint — 2026-10-17

Doppler Effect now has a validated native rebuild, but photographic material/lighting/fine geometry and typography matching remain open. Correct wave spacing, frequency values and graph cycles differ from the contradictory mockup. Phase-only ideal model omits amplitude spreading, reflections, collisions and actual audio capture; exact source/observer coincidence has undefined instantaneous frequency. All six Waves & Sound labs now have native rebuild checkpoints, but their visual/material and broad cross-browser/performance acceptance remains open, alongside the rest of the 102-page inventory.

## Reflection checkpoint — 2026-10-17

Reflection native/physics/control rebuild is verified, with photographic material/lighting, instrument detail and typography matching still open. Physical plane-mirror rays/protractor centre intentionally correct inconsistent illustrated geometry. The mirror-control setup maintains incidence relative to its rotating normal; fixed-source mirror rotation is explained separately. Small printed graduations benefit from zoom on phones; numeric readings stay legible. Ideal n=1 ray model omits diffraction, polarization, reflectivity calibration and hardware obstruction. Remaining optics pages and the broader 102-page acceptance remain open.


## Refraction checkpoint — 2026-10-17

Refraction native materials/lighting and fine hardware detail remain below the reference. Incidence-angle arcs and some scene labels need refinement; target water angle label differs from correct Snell calculation. GPU-memory/leak profiling remains open. Assignment locks and host-specific frame cadence were subsequently tested; see runtime-verification.json. Full 102-reference acceptance remains unproven.


## Lenses checkpoint — 2026-10-17

Lenses native materials/lighting, optical glow, fine apparatus detail and typography remain below reference fidelity. Uniform physical scale intentionally differs from inconsistent reference arrow/ruler proportions. Ideal paraxial optics does not include full curved-surface refraction/aberration. GPU-memory profiling remains open; full 102-reference acceptance is not proven.


## Curved Mirrors checkpoint — 2026-10-17

Curved Mirrors materials/lighting, glow, fine hardware and typography still need visual refinement. Correct default real image is beyond the object; matching the mockup placement would contradict its own numbers. Existing sidebar remains unchanged, with light controls relocated into the main scene. Model is explicitly Gaussian/paraxial, not exact curved-surface ray tracing. Cross-browser and extended memory profiling remain open. Lenses/Mirrors finite-screen regressions were corrected; final release gates passed.

Keyboard parameter editing is verified; a complete keyboard focus-order review across CSS-reordered layouts is still pending. Untouched routes and their typography after optional-font loading are not recertified by these scoped tests.


## Interference checkpoint — 2026-10-17

Interference visual fidelity remains open: photographic lab/background, material/lighting realism, apparatus proportions, detailed instrument hardware and typography need refinement. Optical transverse scale is explicitly magnified ×50 to make micrometre slits and millimetre fringes legible. The scalar model omits polarization, evanescent and material boundary effects; representative phase fronts are not full aperture-field phase surfaces. Actual intensities replace mockup extrema 0.98/0.02. Extended memory, additional browser engines and responsive keyboard focus order need further auditing. The full 102-reference / 17-studio objective remains active.


## Diffraction checkpoint - 2026-10-17

Diffraction remains visually short of the photographic reference: laboratory background, material/lighting realism, apparatus proportions, fine hardware and typography need refinement. Its correct numerical defaults intentionally differ from inconsistent mockup readings. Fraunhofer validity is explicitly limited; the optional Fresnel comparison is paraxial and scalar, omitting polarization, evanescent fields and material-boundary diffraction. A single-slit screen's vertical taper is presentation styling; circular intensity is radial in both transverse dimensions. The red beam is an axis guide, not the diffracted field. Extended GPU memory, additional browser engines and responsive focus-order audits remain unverified. The complete 102-reference / 17-studio objective remains active.


## Coulomb Force checkpoint - 2026-10-17

Coulomb Force still differs from the reference photograph in background, metallic surface/lighting detail, fine support/table hardware and typography. Numerical fields and the true slope-minus-two log-log curve intentionally correct inconsistent mockup content. Spheres are point-charge markers, not interacting conductors; induced surface charge, support/table polarization, radiation and retardation are omitted. Equipotential wireframes approximate surfaces between refined endpoints; field-line counts are representative, not quantitative flux. Force arrows use a disclosed logarithmic display scale; moving markers are explicitly not charge flow. Additional browser engines, long-duration GPU/FPS/memory and responsive focus-order checks remain open. The complete 102-reference / 17-studio scope remains active.


## Electric Field checkpoint - 2026-10-17

Electric Field visual refinements remain: source glow/material detail, line brightness/arrow rendering, typography, composition and annotation placement need further reference review. Correct physical positions, a consistent metric scale, downward-right default vector and computed contributions differ from contradictory mockup artwork. This is a static scalar vacuum model of held point charges, omitting induced charge, dielectric boundaries, radiation and retardation. The scene is an XY projection of 3D data; projected curves can overlap at different depths. Representative line counts/colors are not calibrated flux or field-strength measurements. Probe arrow length is normalized; marker animation is a direction illustration, not current or charge speed. Additional browser engines, long-duration GPU/FPS/memory and responsive focus order remain unverified. The complete 102-reference / 17-studio objective remains active.

## Electric Potential checkpoint - 2026-10-17

Electric Potential native physics/function gates passed, but visual fidelity is not complete: MAE 24.214 / SSIM 0.5268 are both worse than its static baseline. Warm-area distribution, native mesh/contour styling, perspective, glyphs, typography, glow, mobile overlay crowding and axis labels need further refinement. Correct SI values and z-slice plot intentionally differ from inconsistent mockup readings. Other browser engines, long-running GPU/memory and broad accessibility focus-order checks remain unverified. The rest of the full 102-reference / 17-studio program remains open.

## Electric Potential visual refinement - 2026-10-17

Main-region MAE 19.224 / SSIM 0.5299, versus prior native 24.214 / 0.5268: both metrics improved versus the prior native checkpoint; SSIM remains below the static baseline and visual acceptance remains open. Physical source topology/values and coherent axes differ from the inconsistent mockup. Perspective, exact contour placement, typography, lighting/glow and overlay composition need further refinement. Six default viewport checks do not establish all parameter/zoom combinations or broad accessibility/cross-engine acceptance. The remaining 102-reference / 17-studio program stays open.
