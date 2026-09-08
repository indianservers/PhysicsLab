# Universal Gravitation

- Mockup: `07_gravitation/01_universal_gravitation.png`
- Route: `/motion/universal-gravity`
- Status: VERIFIED

Implemented a dark torsion-balance studio with generated apparatus art, opposing force vectors, mass and separation controls, live Newtonian force, torque, ratio, equation, reset, zoom, and mastery challenge modes. Force uses `F = G m1 m2 / r²` with SI units and bounded controls (masses 0.1–20 kg, separation 0.05–1 m). Inputs clamp at bounds and reset restores 5 kg, 1 kg, 0.30 m.

Validation: production `npx vite build` succeeds; direct route load and refresh pass; default force is 3.708e-9 N and min-bound force is 7.416e-12 N; reset and zoom controls operate; responsive viewports 1440×900, 1280×720, 1024×768, 768×1024, and 390×844 have no horizontal overflow. Console output contains only existing React Router future-flag warnings.
