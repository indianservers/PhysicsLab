# Magnetism Current-Carrying Wire

- Mockup: `12_magnetism/03_current_wire.png`
- Route: `/magnetism/current-wire`
- Status: Native rebuild; all current verification gates pass, visual refinement remains open.

The previous VERIFIED label overstated visual and functional completion. Its scalar field formula was already correct, but the old SVG did not reverse field direction and did not provide the reference apparatus, compass behavior, playback, or genuine experiment recording.

The rebuild preserves the original sidebar and retains only Observe, Predict, Experiment and Explain. An original Three.js bench, calculated field loops, eight outer compasses and a movable cyan probe replace the flat diagram. Native compass positions, headings, readings and CSV values share the same SI field model. An original SVG top view and right-hand illustration replace the missing reference insets. No reference pixels are used as application assets.

See [current evidence](../../artifacts/physics-studio-audit/current-wire/report.md) and [gate status](../../artifacts/physics-studio-audit/current-wire/verification-status.json). A build gate is only passed after its process exits successfully; the full 102-reference / 17-studio goal remains active.

Final TypeScript/Vite/PWA build and normal production checks pass. Direct model, six-size browser/formula bounds, controlled clock, actual touch, WebGL fallback and scoped resource cleanup checks pass. MAE 20.192 / SSIM 0.5995 are diagnostics; apparatus and hand fidelity remain open.
