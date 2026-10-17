# Physics verification

The existing suite passed 581/581 numerical reference and source-policy tests. This is not independent certification of every studio. Its validation metadata covers 81 experiments, whereas the browser catalogue contains 92 entries; coverage reconciliation remains open.

Work: the new apparatus and live output use the existing constant-force model W = Fd cos θ. Six analytical cases test parallel/perpendicular forces, zero force, zero distance, and an oblique force; component magnitudes satisfy Fx² + Fy² = F². Playback prescribes displacement at 0.5 m/s and recalculates work from that distance. It does not model acceleration or net work. See [OpenStax: Work](https://openstax.org/books/university-physics-volume-1/pages/7-1-work).

Field: g = GM/r² and Φ = −GM/r drive the vectors, readings and graph. The test confirms the default numerical value, quarter field at double radius, changed graph at changed mass, inward directions, density changes and synchronized probe playback. The circular trajectory has angular speed √(GM/r³); elapsed simulation time advances at 1000 s per real second. The central planet is a visual marker; the model is a point source and does not model Earth's interior. Arrow lengths use a logarithmic display scale. See [OpenStax: gravitational field](https://openstax.org/books/university-physics-volume-1/pages/13-2-gravitation-near-earths-surface) and [circular orbits](https://openstax.org/books/university-physics-volume-1/pages/13-4-satellite-orbits-and-energy).

The field reference gives 9.22 m/s² for M=5.97e24 kg and r=2.08e7 m, whereas GM/r² is approximately 0.921 m/s². The app retains the correct computation. Its right-side probe has consistent positive-x position and an inward 180° field direction; the reference's negative-x label is inconsistent with that placement.

Raw new-page evidence: work/verification.json and gravitational-field/verification.json. Remaining models, invariants and numerical convergence checks are not recertified by this pass.

## Standing Waves checkpoint — 2026-10-17

Standing Waves: linear fixed-fixed normal modes, SI lengths/time, f=n√(T/μ)/(2L), μ=.005 kg/m, small-slope amplitude cap, physical energy integral. 540 parameter/time cases and independent rendered-instance sampling passed. Corrected contradictory reference readouts; ideal support/forcing assumptions documented. See standing-waves/report.md and verification.json.

## Sound Spectrum checkpoint — 2026-10-17

Sound Spectrum: calibrated SI pressure, five actual source signals, finite ten-harmonic Fourier series, pressure RMS/SPL, source-dependent THD, fλ=343 m/s and T=1/f. Real radix-2 Hann FFT and 40 short-time spectra share generated signal samples; noise is a documented finite periodic digital approximation. Corrected gain=0 handling and contradictory sine/harmonic mockup outputs. 720 source/frequency/gain/time cases plus direct DFT/Parseval/Hann/noise checks passed. See sound-spectrum/report.md.

## Doppler Effect checkpoint — 2026-10-17

Doppler Effect: corrected the receding observer sign and spatial wavelength calculation. Signed subsonic velocities, f±=f(c±vo)/(c∓vs), λ±=(c∓vs)/f, exact emission-centred fronts and retarded actual microphone phase share one state. 900 motion cases and 225 crest arrivals passed, with independent finite-difference frequency and rendered-geometry checks. Graph is explicit independent directional comparisons; actual pass-by/coincidence is recorded separately. Assumptions and inconsistent mockup numbers documented in doppler-effect/report.md.

## Reflection checkpoint — 2026-10-17

Reflection: d−2(d·n)n specular vector model; independent parallel-ray intersections, fixed laboratory graduation disc and relative-angle mirror/source configuration. Atan2 avoids a reproduced normal-incidence acos roundoff failure. Passed 2,853 configuration checks and 22,950 packet samples, equal optical paths, native matrix/hit tests and marker speed c. Marker timing uses ideal n=1 propagation and slowed ns playback. Table values are calculated/recorded model states, not real measurements. See reflection/report.md.
