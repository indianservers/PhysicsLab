# Electronics Transistors

- Mockup: `13_electronics/03_transistors.png`
- Route: `/electronics/transistors`
- Status: VERIFIED

Implemented an NPN BJT characteristic explorer with base-current, collector-voltage, and load-resistance controls; live collector current, gain, operating region, and collector power; transistor circuit SVG, transfer relation, reset, modes, and challenge dialog. Uses `I_C = βI_B`, with cutoff below V_CE(sat) and active-region behavior above it.

Validation: production build succeeds; direct route load passes; default readings reproduce β = 98.8, I_C = 2.38 mA, and active operation at 5.0 V; base-current changes update readings and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
