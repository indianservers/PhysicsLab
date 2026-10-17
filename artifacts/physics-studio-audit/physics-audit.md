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


## Refraction checkpoint — 2026-10-17

Vector Snell model now traces finite tank/prism faces through explicit air gap, handles TIR/critical/grazing cases and Fresnel power coefficients, and propagates representative packets at c/n. 4,525 interface cases and 4,525 traces passed. Default angles 28.8/19.1 degrees. Idealizations documented in refraction/report.md and Explain. Source: https://openstax.org/books/physics/pages/16-2-refraction .


## Lenses checkpoint — 2026-10-17

Lenses signed thin-lens/ray-slope engine uses SI geometry, cm instruments, exact infinity/virtual handling and finite aperture. 2208 configurations, 6382 valid rays and 14916 packet samples passed. Native instance-matrix endpoints/packets checked. Convex/plano equal selected power is explained; finite body surfaces are illustrative. Source and assumptions in lenses/report.md.


## Curved Mirrors checkpoint — 2026-10-17

Curved Mirrors signed Gaussian model and first-order ray construction passed 6992 configurations, 19438 valid rays and 97503 packet samples; 24 native configurations/matrices checked. Correct default image lies beyond object (di=60 cm). Finite screen dimensions are now enforced in Mirrors and Lenses; large virtual images fit the camera. Assumptions/source/evidence: mirrors/report.md and screen-boundary-verification.json.

Curved Mirrors focal readout retains the exact derived half-step precision for fractional radius controls (for example R=11.5 cm gives f=5.75 cm). Production regression covers this near-focus setup.


## Interference checkpoint — 2026-10-17

Interference uses a finite, equally illuminated long double slit (40 μm width), coherent complex-amplitude superposition, exact Euclidean path differences, a high-frequency scalar obliquity kernel and 32-point Gauss–Legendre integration. Separate point-slit and incoherent comparisons change the actual model. I(0) is normalized to 1 per configuration. Nominal λL/d is distinguished from exact profile extrema. The plotted far-field formula is explicitly approximate. 180 configurations / 1620 sampled positions passed symmetry, positivity, normalization, 32→64 convergence, finite-window energy bounds, independent far-field and narrow-width limits. Maximum quadrature error 1.89e-15; default nominal spacing 2.1666666667 mm. Scene transverse coordinates are disclosed ×50; longitudinal distances remain physical. Native ray endpoints agree with the model within 5.36e-09 m, and sampled texture channels agree exactly with the gamma-adjusted model profile. Representative markers move at c; wavefronts sample every 50,000th center-source phase front. Scalar/polarization/near-field limitations are explained.


## Diffraction checkpoint - 2026-10-17

Diffraction now supports a uniformly illuminated long slit and circular aperture. Fraunhofer sinc-squared/Airy intensity uses angular geometry and obliquity; minima use the first J1 zero 3.8317059702 for a circular opening. At the reference defaults (100 micrometres, 632 nm, 0.50 m), the correct single-slit nominal width is 6.32 mm and first minimum about 0.362 degrees, correcting the mockup's inconsistent 4.32 mm / 0.52 degrees. Far-field validity is disclosed with N = a squared/(wavelength times L) and an amber warning above 0.1. Experiment offers a paraxial Fresnel comparison using slit quadrature or a circular Hankel integral. Fresnel width readings explicitly remain nominal far-field values. 240 configurations / 1680 positions, 12 finite-window energy bounds, symmetry, convergence, limiting cases and physical marker speed passed. Independent SciPy checks cover 216 complex fields (maximum error 3.73e-14) and 6001 Bessel arguments through 600 (maximum error 8.63e-13). SI calculations, relative normalization, display gamma/exposure, optical transverse scale x50, long-slit vertical taper and scalar/paraxial omissions are explained.


## Coulomb Force checkpoint - 2026-10-17

Coulomb Force uses signed rightward-axis vectors for sources at x = -r/2 and +r/2: F on A = -k q1 q2/r squared and F on B its opposite. The former page reversed A's sign. External fields exclude self-fields. At +5/-5 microcoulombs and 0.30 m, force magnitude is 2.497222 N and each external field magnitude is 499444.444 N/C, correcting the mockup's inconsistent 89900 N/C. k is explicitly the rounded 8.99e9 constant. Total E and V share the same charges; unsoftened point-charge formulas drive RK4 meridional field lines, bisection-refined equipotential meridians revolved about the charge axis, and a fixed log-strength slice. 343 force/field cases and 343 potential-gradient checks passed (max relative gradient error 1.33e-10). 66290 line segments follow E, with step-size convergence error 7.23e-06 m; 6104 contour endpoints have normalized potential residual at most 4.84e-08. The true log-log force curve has slope -2. Like, unlike, neutral and tiny-charge cases are handled without log(0) or negative-zero force artifacts. Animated markers represent field direction, not charge flow or propagation physics.


## Electric Field checkpoint - 2026-10-17

Electric Field now evaluates unsoftened three-dimensional point-source superposition and potential in SI. All nine source/probe coordinates work; optional depth fields and elevation become visible. The former 3 cm distance clamp is removed. Active-source coincidences produce an undefined probe field; coincident sources combine algebraically for the total field. Zero fields and axial vectors have undefined azimuth. At the stated defaults, Ex = 254950.100408, Ey = -121805.386544, Ez = 0 N/C, magnitude 282552.837341 N/C and azimuth -25.536683 degrees. The correct arrow points down-right, unlike the mockup. 144 configurations / 432 potential-gradient checks passed, maximum relative gradient error 4.99e-10. 67398 curve segments align with E (minimum cosine 0.999980410); default step-halving convergence difference 2.2e-05 m. Adaptive spatial RK4 limits steps using a source-field Jacobian norm bound near cancellation points. Density affects representative count, never the numeric field. Native geometry is an explicitly labeled XY projection of 3D coordinates; probe arrows are normalized for legibility and markers illustrate direction rather than charged-particle motion.

## Electric Potential checkpoint - 2026-10-17

Point-charge potential, actual full-XYZ electric field magnitude and U=qtest V now share SI state. Defaults: 17668.6344627 V / 0.0176686344627 J / 44809.1251349 V/m. Reference mockup values were inconsistent with its microcoulomb/metre units. Infinite and finite-point gauge choices preserve E; singularities are explicit. Height selects a physical z slice, plotted ordinate is clipped at +/-50 kV, contours spaced by 5 kV. Probe scans are instrument motion, not free-charge dynamics. 225 cases, 675 gradient derivatives and four-grid convergence passed; see `electric-potential/report.md` for scientific sources, assumptions and errors.

## Electric Potential visual refinement - 2026-10-17

SI potential/field/energy are unchanged and independently reverified. Default sampled potential range is -48258.635 to +71491.136 V, fully within the new +/-100 kV plot range. Red positive / blue-purple negative / cyan zero contour signs match all 4520 native segments. Probe callout guide ends at the calculated potential surface; metric base-plane picking matches known physical XY coordinates. Model 225 cases / 675 derivatives and four-resolution convergence passed; default 80-cell contour RMS 31.820 V -> 160-cell 7.920 V. See current per-lab report for assumptions and scientific references.


## Capacitors native rebuild checkpoint

See [Capacitors evidence](capacitors/report.md). Correct SI capacitance and analytical RC state replace the old calibrated values; native apparatus and reference-only tabs are implemented. Visual refinement remains open (MAE 23.663, SSIM 0.5799). Full 102-reference / 17-studio completion is not claimed.


## Electric Current native rebuild checkpoint

See [Electric Current evidence](current/report.md) and [current gate status](current/verification-status.json). Static SVG is replaced by a native apparatus and shared-state electron drift. Direct model, six-size browser, runtime and fallback checks pass. Final TypeScript/Vite/PWA build and normal production checks pass, including fullscreen, keyboard slider and independently parsed nine-column CSV. Sidebar and four reference modes are preserved. MAE 20.710 / SSIM 0.5584 (sidebar excluded); visual refinement remains open. All 102 references / 17 studios remain in scope.


## Circuits native rebuild checkpoint

See [Circuits evidence](circuits/report.md) and [current gate status](circuits/verification-status.json). A native breadboard, instruments, lamps, switch and model-driven current replace the static SVG. The explicit 47 ohm series lamps correct the reference power inconsistency. Direct model, six-size browser, touch/runtime and fallback checks pass; final TypeScript/Vite/PWA build and normal production checks pass, including open-switch equations, keyboard controls, CSV values and corrected mobile header ordering. Sidebar and four reference modes are preserved. MAE 34.462 / SSIM 0.4795 (sidebar excluded); visual refinement remains open. All 102 references / 17 studios remain in scope.


## Magnetic Field Lines native rebuild checkpoint

See [Magnetic Field Lines evidence](magnetic-field-lines/report.md) and [current gate status](magnetic-field-lines/verification-status.json). Decorative ellipses and hard-coded readings are replaced by two equivalent dipoles, calculated traces/filings, compass probes and vector/profile plots. Both poles are represented. Direct model, six-size browser, runtime, touch and fallback checks pass; final TypeScript/Vite/PWA build and normal production checks pass, including core/null handling, keyboard probe, both-pole labels and independently parsed CSV values. Sidebar and four reference modes are preserved. MAE 27.026 / SSIM 0.4337 (sidebar excluded): average pixel difference improves, structural similarity remains below the old page. Visual refinement stays open; all 102 references / 17 studios remain in scope.


## Lorentz Force native rebuild checkpoint

See [Lorentz Force evidence](lorentz-force/report.md) and [current gate status](lorentz-force/verification-status.json). The native chamber, signed cross-product motion, instantaneous vector triad and orbit inset share the analytic SI state. Reference force direction and proton numbers are corrected. Model, six-size browser, runtime, touch and fallback checks pass; final TypeScript/Vite/PWA build and normal production checks pass, including signed charge, keyboard slider, views, playback and independently parsed quarter-period CSV. Sidebar/four modes and the relevant reference view selector remain. MAE 21.991 / SSIM 0.5419; visual refinement remains open (SSIM below baseline). The full 102-reference / 17-studio goal remains active.
