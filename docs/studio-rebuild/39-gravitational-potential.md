# Gravitational Potential

- Mockup: `07_gravitation/03_gravitational_potential.png`
- Route: `/motion/gravitational-potential`
- Status: VERIFIED

Implemented the initial interactive planet–moon potential surface with controls for planet mass, moon mass, probe radius, and orbital angle; live potential, potential energy, gradient, equation, reset, and challenge dialog. Physics uses `V = −G Σ(Mᵢ/rᵢ)`.

Validation: production 
px vite build succeeds; direct route load and refresh pass; default potential is −4.905e12 J/kg and gradient 1.98 m/s²; probe radius control updates values; reset restores defaults; screenshot captured at 1536×1024; required responsive viewports have no horizontal overflow and no failed requests.

