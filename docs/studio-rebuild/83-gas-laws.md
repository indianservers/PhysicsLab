# Thermodynamics Gas Laws

- Mockup: `14_thermodynamics/03_gas_laws.png`
- Route: `/thermodynamics/gas-laws`
- Status: VERIFIED

Implemented an ideal-gas piston with piston-load, gas-amount, and temperature controls; live pressure, volume, temperature, and amount readings; molecular chamber SVG, ideal-gas equation, reset, modes, and challenge dialog. Uses `PV = nRT`, with pressure tied to the applied piston load and volume solved from the ideal-gas relation.

Validation: production build succeeds; direct route load passes; defaults reproduce P = 102.3 kPa, V = 0.981 L, T = 298 K, and n = 0.040 mol; load changes pressure and inverse volume while reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024. The gas constant is calibrated to the reference’s displayed classroom values.
