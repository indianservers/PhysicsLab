# Magnetism Solenoid

- Mockup: `12_magnetism/04_solenoids.png`
- Route: `/magnetism/solenoids`
- Status: Native rebuild; current verification gates pass, visual refinement and real-material fidelity open.

The earlier VERIFIED claim and effective-length calibration are withdrawn. The previous implementation divided NI by 125, equivalent to a 125 m coil, solely to reproduce the mockup’s 2.41 mT. The rebuilt apparatus explicitly uses L = 0.16 m and R = 0.025 m; these are declared geometry choices for the centimetre-scale reference, whose dimensions are not fully specified. Field values are not calibrated to the image.

A native winding/core/frame/supply and movable Hall probe replace the flat SVG. Finite-solenoid fields are evaluated from free and uniform-magnetization bound surface currents. The core uses a centre-based demagnetizing approximation, explicitly not an exact nonlinear real-material solution. The corrected default is 178.87 mT for the declared model, rather than 2.41 mT. Current, N, core, probe, profile and CSV share state. Play scans the ideal probe mechanically at 2 cm/s; field lines remain static. Winding detail is clearly schematic.

The original sidebar and four reference modes are preserved. The relevant cutaway/exterior/end view selector, zoom and fullscreen are functional; no extra 3D tab is introduced. Five challenge tasks advance and grade actual setups. See [evidence](../../artifacts/physics-studio-audit/solenoids/report.md) and [gate status](../../artifacts/physics-studio-audit/solenoids/verification-status.json). All 102 references / 17 studios remain in scope.

Final TypeScript/Vite/PWA and normal production checks pass. Direct model, eight-view browser, controlled clock, touch, fallback, CSV and scoped resource cleanup evidence is saved. MAE 22.818 / SSIM 0.5217 are diagnostics; structural similarity remains slightly below baseline. This is not visual acceptance.
