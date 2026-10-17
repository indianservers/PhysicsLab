# Electric Current native rebuild checkpoint

Route: `/electricity/current`. Target: `11_electricity/04_current.png`. Full 102-reference / 17-studio goal remains incomplete.

The original static wire SVG over an unrelated reflection background is replaced by procedural Three.js supply, ammeter, terminals, cables, cylindrical wire envelope, supports, schematic copper ions and drifting electron markers. A second native view shows the same integrated mean drift at microscopic scale. No reference pixels are used as assets. Existing sidebar JSX is preserved. Four reference learning modes remain; unrelated enhancement/3D tabs are absent. Single supported DC and copper selectors are explicitly disabled with explanations.

## Model

Copper uses rho20 = 1.68e-8 ohm m, alpha = 0.0039 / degC, n = 8.5e28 / m³, exact elementary charge 1.602176634e-19 C, and fixed effective series wire length 186 m. The former hidden length is now explicit in the apparatus note, equations and learning content. The bench represents an enlarged short segment, not 186 m stretched across the viewport.

A = pi(d/2)² with mm converted to metres; rho(T) = rho20[1 + alpha(T-20)]; R = rho L/A; I = V/R; J = I/A; vd = J/(ne); E = V/L; power = VI = I²R. Temperature is externally maintained, so Joule heat leaves to a thermostat. Linear resistivity is approximate across the available 0–200°C range; density and geometry omit thermal expansion. Contact resistance, inductance, startup transients and self-heating are omitted.

Default: R = 15.914475717553747 ohm, I = 0.31417937283884095 A, J = 1600102.4065540193 A/m², vd = 0.00011749474930086373 m/s. These are calculated rather than calibrated to the reference's slightly inconsistent 0.318 A / 15.7 ohm / 1.12e-4 m/s values. Conventional current is left-to-right from the positive supply terminal; electron mean drift is right-to-left. This corrects the reference/old diagram's misleading drift direction for the drawn supply polarity.

Electron positions use the time integral of vd, with a fixed 1200 diagram-units/metre display scale and periodic boundaries. Parameter changes preserve accumulated displacement and change its subsequent rate. Glyphs are schematic, not individual carriers; random thermal velocity, microscopic collisions and actual copper crystallography are not simulated. The cross-section represents uniform J with a marked 0–4.17 MA/m² scale. The I–V graph is analytically recomputed from the same resistance.

## Evidence

- Model: 125 configurations and 3,125 graph points. Checks cover SI conversion, diameter-squared current, diameter-independent J and vd at fixed V/L, temperature response, zero voltage, E = rho J, and Joule power. Maximum absolute power balance residual 2.8422e-14 W.
- Model clock accumulation: 10/30/60/144 Hz. Actual browser clock: 10/30/60 Hz, each giving 0.00011749474930086 m drift in one simulated second.
- Native runtime: 90 electron x coordinates checked against integrated displacement, maximum error 5.9056e-8 diagram units. Paused rendering adds zero frames; zero voltage stops drift; hidden tabs suspend without catch-up; route exit removes the owned clock. Four observed renderer disposals and context losses include StrictMode lifecycle cleanup for both views. This is bounded cleanup evidence, not a long-duration leak certification.
- Browser: six sizes (1536×1024, 1920×912, 1024×768, 768×1024, 390×844, 320×740), parameter controls, play/pause, reset, zoom, four learning modes, prediction feedback, recording and CSV download. No card/horizontal overflow, page errors, local console errors or failed local requests in the saved run.
- WebGL-disabled fallback: both views render calculated SVG schematics and update actual readings.
- Shared physics catalog: 581/581 passed, 80 catalog warnings. This catalog is distinct from the direct current-model tests.

Final build/production status is recorded in verification-status.json; do not infer a pass from this narrative while those gates are pending. Visual comparisons and source hashes are saved alongside the evidence. Diagnostic image metrics are not completion percentages.

## Remaining limitations

Native apparatus is still visibly more schematic than the photographic reference. Photographic material/background fidelity, finer typography/camera alignment, touch-specific interaction coverage, broader accessibility/cross-engine checks, all parameter/zoom combinations and long-duration GPU/FPS/memory measurements remain open. Fullscreen, keyboard slider and independent CSV parsing are covered by the production script only when its saved result passes. The large inherited main bundle/PWA footprint remains open.

Scientific sources:
- https://openstax.org/books/university-physics-volume-2/pages/9-2-model-of-conduction-in-metals
- https://openstax.org/books/university-physics-volume-2/pages/9-3-resistivity-and-resistance
- https://openstax.org/books/university-physics-volume-2/pages/9-key-equations

Latest visual diagnostics (sidebar excluded): before MAE 24.833 / SSIM 0.4918; after MAE 20.710 / SSIM 0.5584. The paired native drift captures contain 974 pixels with a maximum channel change above 20; this is visible-motion evidence, not a fidelity percentage.

Final production verification: TypeScript/Vite/PWA build exited 0; all four recorded source hashes match. Normal preview checks passed for keyboard slider updates, fullscreen entry/exit, independently parsed nine-column CSV values, short desktop/mobile layouts, four learning modes and absence of unrelated tabs. Page errors, local console errors and failed local requests were empty. The inherited precache remains 1,256 entries / 326,789.45 KiB and the main bundle size warning remains open.
