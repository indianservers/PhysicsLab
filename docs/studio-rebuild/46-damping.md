# Damping

- Mockup: `08_oscillations/04_damping.png`
- Route: `/motion/damping`
- Status: VERIFIED

Implemented damped spring visualization with damping coefficient, mass, initial displacement, and time controls; live displacement, velocity, decay constant, Q factor, regime, equation, reset, and challenge dialog. Physics uses `δ = b/(2m)` and the damped oscillator solution with under/critical/overdamped classification.

Validation: production build succeeds; direct route load passes; default displacement 0.080 m, decay constant 1.600 s⁻¹, Q 4.42; controls update; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
