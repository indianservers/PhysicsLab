# Magnetism Electromagnetic Induction

- Mockup: `12_magnetism/05_induction.png`
- Route: `/magnetism/induction`
- Status: Native rebuild; current verification gates pass, visual refinement open.

The old VERIFIED claim is withdrawn. The old page used a constant Φ = BA while setting ε = NBA v, which has units V·m rather than V and does not differentiate that displayed flux. The rebuilt page uses the position-dependent mean flux of a coaxial dipole through a finite-width coil, ε = −N(dΦ/dx)v, and a declared 1 kΩ ideal resistive circuit. Magnet pose, poles, velocity, galvanometer, plots, Lenz direction and CSV share the same state. Normal orientation now has N on the right so the Into Coil (N first) label is true.

The original sidebar is preserved. Only Observe, Predict, Experiment and Explain are mode tabs. The relevant setup selector changes pole orientation; all three zoom buttons, speed/turn inputs, direction setups, mouse/touch/keyboard placement, playback, prediction, challenge and recording/export work. There is no added 3D tab or fullscreen action. Native apparatus and decorative chalkboard textures are independently generated; no reference crop is imported.

See [current evidence](../../artifacts/physics-studio-audit/induction/report.md) and [gate status](../../artifacts/physics-studio-audit/induction/verification-status.json). The dipole/resistive-drive assumptions are explicit. MAE 25.379 / SSIM 0.5423 are diagnostics; photographic scene refinement and other visual differences remain open. The full 102-reference / 17-studio goal remains active.
