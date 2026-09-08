# Electronics Diodes

- Mockup: `13_electronics/02_diodes.png`
- Route: `/electronics/diodes`
- Status: VERIFIED

Implemented a PN diode I–V experiment with bias-voltage, diode-material, and series-resistance controls; live threshold voltage, forward current, and diode power; circuit SVG, Shockley-style exponential relation, reset, modes, and challenge dialog. Forward current rises exponentially above threshold and is bounded at 50 mA to match the reference graph range.

Validation: production build succeeds; direct route load passes; default readings are V_D = 0.69 V, I_D = 1.80 mA, and P_D = 1.26 mW; voltage changes update readings and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
