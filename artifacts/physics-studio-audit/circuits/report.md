# Circuits native rebuild checkpoint

Route: `/electricity/circuits`. Reference: `11_electricity/05_circuits.png`. Overall 102-reference / 17-studio goal remains incomplete.

The former static two-resistor SVG is replaced by a native procedural breadboard, supply, resistor bands, two lamps, switch, leads and three meters. Existing sidebar JSX is preserved. The four reference learning modes remain. Unrelated enhancement/3D tabs are absent. DC Circuits is explicitly the only supported model. Procedural canvas labels/table/glow textures and original SVG fallback are used; no mockup pixels are application assets.

## Scientific correction

The reference lists resistor powers and equally large lamp powers while its total counts only the resistors. That is not energy-conserving. This implementation includes an explicit 47 ohm lamp in series with each selected resistor. It uses I1 = V/(R1 + 47), I2 = V/(R2 + 47), It = I1 + I2; PRi = Ii² Ri; PLi = Ii² × 47; Psource = V It = PR1 + PR2 + PL1 + PL2. Live equations show zero branch currents when the common return switch is open.

At 6 V, R1 = 220 ohm, R2 = 470 ohm: I1 = 22.4719101124 mA, I2 = 11.6054158607 mA, It = 34.0773259731 mA, total power = 0.204463955839 W. PR1 = 0.111097083702 W, PR2 = 0.0633022683313 W, PL1 = 0.0237343769726 W and PL2 = 0.00633022683313 W. Values deliberately differ from the inconsistent mockup.

A and B are the positive and grounded negative supply nodes. VA = V, VB = 0 and VAB = V even when S1 opens. The internal return node C is 0 V when closed and rises to VA when open; the open switch supports the supply voltage. Each ammeter is in its branch path; the ideal voltmeter is connected across A/B. Meter input impedance/burden, wire/contact resistance, source impedance, capacitance and inductance are idealized. No startup transient is simulated.

Lamps are ideal fixed-resistance loads, not a temperature-dependent incandescent model. Filament heating/cooling and radiometric photometry are omitted. Display brightness is sqrt(P/(P+0.01 W)), a bounded qualitative power mapping, not calibrated luminance. Marker phase advances by integrated branch charge with one traversal per 0.04 C; trunk phase uses Q1 + Q2. Markers are conventional-current indicators, not individual carriers or physical drift velocities. Opening S1 or setting V = 0 stops charge accumulation; pause freezes the visualization clock. Knob, slider and number field use 0.1 V adjustment precision.

## Verification evidence

- Direct model: 160 configurations checked against an independent three-node Gaussian conductance solve. Maximum junction residual 1.388e-17 A, loop residual 1.111e-15 V, and power residual 4.441e-16 W. Open circuits, zero voltage, per-load power and switch voltage are checked.
- Model charge accumulation at 10/30/60/144 Hz; actual browser clock at 10/30/60 Hz gives the same delivered charges after one second (Q1 = 0.0224719101124 C, Q2 = 0.0116054158607 C).
- Actual native runtime: 26 marker matrices match calculated curve positions, maximum coordinate error 2.043e-7 diagram units. Paused and open-switch idle rendering add zero frames; closing resumes charge; hidden tabs pause without catch-up; route exit removes the owned clock.
- Six viewport sizes: 1536×1024, 1920×912, 1024×768, 768×1024, 390×844, 320×740. No horizontal/card overflow in the recorded browser run. Playback remains adjacent to the apparatus on mobile.
- Controls: all 16 resistor pairs, number/range voltage, native and panel switch, mouse/keyboard supply knob, Enter/Space switch activation, play/pause, reset, zoom, learning modes, prediction/challenge grading and records surviving reset. The exported 15-column CSV is independently parsed and checked numerically.
- Touch: actual CDP touch drag on the native supply knob, followed by a switch tap. A reproduced missing compatibility-click issue is fixed by one pointer-release activation with separate keyboard activation. `touch-debug.png` is a historical failure capture, not acceptance evidence.
- Resource lifecycle: three SPA round trips; seven renderer/context disposals and 1,365 observed geometry/material/direct-texture-map disposals. This excludes internal environment resources from the counted proof; explicit source cleanup covers the PMREM environment. No long-duration leak or GPU performance certification is claimed.
- WebGL-disabled fallback: visible calculated schematic, zero current/dark lamps on open switch, and correct changed currents at 12 V.
- Shared physics catalog: 581/581 pass with 80 catalog warnings. The catalog is distinct from the direct model and runtime tests above.

Build/production status is recorded in verification-status.json; pending gates are not implied passed by this report. Before/after PNGs, comparison/difference images, regional image diagnostics and a six-size contact sheet are saved beside the JSON results.

## Remaining limitations

The apparatus is still substantially more schematic than the photographic reference. Material finish, fine camera/perspective alignment, hardware typography and lead routing require further visual refinement. Full parameter/zoom combinations, broad accessibility/cross-engine coverage and long-duration GPU/FPS/memory measurements are unverified. The inherited large main bundle and PWA footprint remain open. No fullscreen control was added because it is absent from this reference.

Scientific sources:
- https://openstax.org/books/university-physics-volume-2/pages/10-2-resistors-in-series-and-parallel
- https://openstax.org/books/university-physics-volume-2/pages/10-3-kirchhoffs-rules
- https://openstax.org/books/university-physics-volume-2/pages/10-summary

Latest sidebar-excluded visual diagnostics: before MAE 36.096 / SSIM 0.4753; after MAE 34.462 / SSIM 0.4795. Metrics are diagnostics, not completion percentages.

Mobile visual review caught a title/mode ordering defect that overflow checks alone missed. It is corrected, and the six-size browser script now asserts header → modes → apparatus ordering. The final 320 px screenshot was visually inspected with that correction.

Final gates: TypeScript/Vite/PWA build exited 0 and all four source hashes match. Normal production checks pass for the corrected power model, open-switch equations, keyboard slider/knob, native/panel switching, all resistor options, playback, records, independently parsed 15-column CSV, desktop/mobile layout and header/mode ordering. Page errors, local console errors and failed local requests are empty. The inherited large-bundle warning and 1,257-entry / 326,815.19 KiB precache remain unresolved.
