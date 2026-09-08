# Electronics Amplifiers

- Mockup: `13_electronics/04_amplifiers.png`
- Route: `/electronics/amplifiers`
- Status: VERIFIED

Implemented a common-emitter amplifier with input amplitude, gain, and bias controls; live input/output peak-to-peak voltage, gain, collector voltage, and current; dual-channel waveform SVG, amplifier relation, reset, modes, and challenge dialog. Uses `Aᵥ = Vout/Vin ≈ −R_C/r_e` with output clipping at the supply swing.

Validation: production build succeeds; direct route load passes; default readings reproduce Vin = 0.40 Vpp, Vout = 8.40 Vpp, and gain = −10.5; input changes update the clipped output and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024. Peak-to-peak scaling is applied to match the reference instrument readout.
