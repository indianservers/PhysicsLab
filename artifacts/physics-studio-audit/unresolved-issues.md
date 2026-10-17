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
