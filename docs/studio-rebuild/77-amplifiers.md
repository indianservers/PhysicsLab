# Electronics — Amplifiers native rebuild

Route: `/electronics/amplifiers` · reference: `13_electronics/04_amplifiers.png`.

Status: native rebuild verified in the recorded checks; visual acceptance and full project goal remain open. The earlier VERIFIED claim and artificial Vpp scaling are withdrawn. A 0.40 Vpp source with approximately −10.5 gain cannot produce the old unclipped 8.40 Vpp readout. Reference values and waveform phase are internally inconsistent.

The existing sidebar is preserved. Only the reference's four Observe/Predict/Experiment/Explain modes and Circuit/Waveforms/Equation theory tabs remain; no extra 3D tab or enhancement dock. The page has paired scopes, compact controls, a native generator/tilted breadboard/transistor/oscilloscope scene, live readings and player. Instruments, SVG scopes, readouts and CSV share the same state. Hardware AUTO, MEAS, CURS, SAVE, FREQ, AMPL and OUT are functional. AUTO includes its exact timebase in settings, including four cycles at 100 Hz (5 ms/div).

## Physics and assumptions

The isothermal Ebers–Moll model uses transport saturation current 1e−14 A, βF = 100, βR = 2, VT = k·300 K/q, collector supply 12 V, RE = 470 Ω, RB = 100 kΩ and source resistance 50 Ω. IC = IS[(exp(VBE/VT)−1)−(exp(VBC/VT)−1)/αR]; IE = IS[(exp(VBE/VT)−1)/αF−(exp(VBC/VT)−1)]; IB = IE−IC. Collector, emitter and Thevenin source equations solve together. A fast deep-active branch omits the reverse BC exponential only for VBC < −0.4 V; independently reconstructed full Ebers–Moll currents bound its absolute error in the tested domain.

The nominal gain setting changes RC against the emitter-degenerated small-signal relation at 1.2 V bias. Bias changes the operating point without retuning RC. Default RC is 5.222182 kΩ; actual base 0.399400 Vpp, collector 4.185868 Vpp, fundamental source gain −10.469716, mean VC 6.030999 V, VE 0.542586 V and IC 1.143009 mA. Measured fundamental gain and peak-to-peak gain differ under distortion. CH1 shows loaded base AC; CH2 removes the collector cycle mean. Off produces zero AC and undefined gain. Cutoff and saturation follow junction signs rather than an arbitrary output clamp.

Optional ideal AC emitter bypass holds VE at Q. Input/output coupling are ideal passband couplers. Power includes collector and bias supplies, ideal offset base drive, all four resistor losses, transistor dissipation and bypass reservoir exchange VE·(IE−VE/RE). The exported ideal drive power includes its ideal DC-offset reservoir; it is not a measurement of a zero-DC generator's delivered power. Finite capacitor transients, rectification-induced DC bias drift, bandwidth, Early effect, high injection, breakdown and self-heating are omitted. Parameters are illustrative, not a calibrated 2N3904 fit.

Scientific basis: [TU Graz semiconductor-device course: common-emitter Ebers–Moll equations](https://lampz.tugraz.at/~hadley/psd/L13/commonemitter.php). The circuit coupling, resistor choices and nominal-gain mapping are declared implementation assumptions, not claims from this source.

## Verification

Raw evidence is in `artifacts/physics-studio-audit/amplifiers/`. Model tests cover 54 configurations / 3456 phase states, independent full Ebers–Moll reconstruction, KVL/KCL/power, small-signal agreement, output off, cutoff/saturation and periodic quadrature convergence. Maximum residuals: KVL 4.69e−13 V, KCL 1.98e−16 A, power 4.13e−16 W, independently reconstructed device currents 4.38e−16 A.

Browser checks cover all seven native hardware actions, three numeric/range inputs, both circuit topologies, all four zooms, theme, fullscreen/challenge, prediction, keyboard mode changes, three theory tabs, settings Escape/focus, records preserve/clear and 30-column SI CSV with independent KCL/power checks. Eight viewport interior bounds pass. Repeated SPA mounts dispose seven renderers and 868 tracked scene resources; environment resources are cleaned in source but outside this counter. Controlled 10/30/60 fps timing confirms 0.1 cycles per wall second, shared native/plot state, geometry reuse, zero paused render frames, hidden no catch-up, automatic stop/replay and no owned clock after route unmount. Real CDP touch and calculated SVG fallback checks pass, including all fallback instrument buttons and their desktop/mobile bounds.

## Remaining work

Native apparatus camera/framing, casing details, tabletop finish, cable shape and photorealism do not yet closely match the target. Sidebar-excluded image MAE improves 37.524 → 32.558 and Gaussian SSIM 0.4724 → 0.5179; these diagnostics are not completion percentages. Material calibration and wider browser/device performance remain open. The app-wide large bundle/PWA precache also remains open. Final build session 67683 completed with exit 0; unmasked production smoke on owned port 4203 passed, with no local request failures or page/console errors. The physics catalog passed 581/581. Final four source hashes match. Default generator/scope screen corners fit all eight tested viewports after widening the minimum horizontal camera span. The full 102-reference objective remains incomplete.
