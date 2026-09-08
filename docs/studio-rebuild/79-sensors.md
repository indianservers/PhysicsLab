# Electronics Sensors

- Mockup: `13_electronics/06_sensors.png`
- Route: `/electronics/sensors`
- Status: VERIFIED

Implemented an LDR/thermistor sensor explorer with sensor type, stimulus level, and sampling-rate controls; live resistance, divider output voltage, and temperature; sensor SVG, calibration relation, reset, modes, and challenge dialog. The LDR follows `R = aI^b` and the output uses a voltage-divider relation.

Validation: production build succeeds; direct route load passes; default readings reproduce 3.22 kΩ, 2.18 V, and 24.6 °C; stimulus changes readings and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024. Divider calibration is matched to the reference circuit.
