# Resonance

- Mockup: `08_oscillations/05_resonance.png`
- Route: `/motion/resonance`
- Status: VERIFIED

Implemented a driven oscillator with generated apparatus visual, controls for drive frequency, drive amplitude, and damping, live steady-state amplitude, phase, resonant frequency, quality factor, governing equation, reset, and challenge dialog. Uses the forced oscillator response `A = F₀ / √((k−mω²)²+(bω)²)`.

Validation: production build succeeds; direct route load passes; default amplitude 9.62 cm, resonant frequency 2.00 Hz, Q 6.32; controls update; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
