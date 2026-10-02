# Spring SHM

- Mockup: `08_oscillations/01_spring_shm.png`
- Route: `/motion/spring-shm`
- Status: VERIFIED

Implemented a vertical spring-mass apparatus with generated asset, controls for spring constant, mass, amplitude, and time, live displacement, velocity, acceleration, period, angular frequency, governing equations, reset, and challenge dialog. Physics uses `ω = √(k/m)`, `x = A cos(ωt)`, and `a = −ω²x`.

Validation: production build succeeds; direct route load passes; default period 0.397 s and acceleration −37.50 m/s²; controls update; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
