# Wave Properties rebuild — 2026-10-17

Route `/motion/wave-properties`; target `09_waves_sound/01_wave_properties.png`.

Replaced static wave-machine photograph and fixed SVG curve with original native Three.js apparatus: motor housing, particle markers, telescopic stems, rail, ruler, model trace and selected probe. Geometry, materials and motor label are procedural; room is the independently generated original lab backdrop. No screenshot crops. Existing sidebar markup and routes retained. Exactly four reference learning modes and the two relevant wave-type buttons; no unrelated 3D tabs or tools dock.

Reference layout recreated: large apparatus with two right-side plots; three controls; live readings, equation and view cards below; reset/play-pause, zoom and challenge transport. Grid, waveform trace, measurements and slow-motion toggles function. Position-graph pointer/keyboard moves the probe. Experiment dialog preserves time scrubbing and records actual model values. Prediction, explanation and challenge have lab-specific working behavior. Assignment variable locks are respected.

Physics: all internal lengths use metres. u(x,t)=A sin(kx−ωt), k=2πf/v, ω=2πf. Calculated particle velocity/acceleration and spatial derivatives satisfy the linear nondispersive wave equation. The medium particles oscillate about equilibrium, while phase propagates right. Transverse motion is perpendicular; longitudinal is parallel. Longitudinal amplitude is limited to |Ak|<=.9 so the position mapping remains ordered. Beads are ideal markers, not a collision model. Short wavelengths increase particle sampling (at least twelve markers per wavelength) to prevent aliasing. Transverse apparatus displacement is explicitly shown at three times the physical scale; charts/measurements retain actual centimetres.

Reference physical values preserved: A=2 cm, f=1.5 Hz, v=.6 m/s give lambda=.4 m and T=.667 s. Reference's illustrative wave curves do not have the matching spatial period; native curves use the computed wavelength and actual model time.

`node scripts/testWavePropertiesRebuild.mjs` passed 2,754 parameter/time cases covering rightward transport, spatial/time periodicity, wave equation, SI conversion and longitudinal particle order. Browser checks cover both wave types, all inputs and view toggles, reset/play/pause/zoom, slow physical time, probe, recording, learning dialogs, WebGL fallback and six responsive sizes. Actual instanced particle matrix is independently read and compared to analytical displacement. No page errors, horizontal overflow or stage/control overlap. Renderer uses instancing, bounded buffers, one model clock, resize observer cleanup and disposal of geometries/materials/textures/environment/instances/context. Native SVG fallback remains model-driven and zoomable.

Checks: `npm run test:physics` passed 581/581; `npm run build` passed TypeScript, Vite and PWA. Raw logs saved in this folder. Browser test only covers installed Chromium; cross-browser and broad performance acceptance remain open.

[Physics reference: OpenStax, Mathematics of Waves](https://openstax.org/books/university-physics-volume-1/pages/16-2-mathematics-of-waves). Sinusoidal wave, phase direction, particle motion and wave-speed relation agree with this primary textbook reference. Longitudinal ordering bound follows directly from dx_particle/dx_equilibrium = 1 + du/dx > 0.

Comparison evidence: baseline, deterministic after images at t=.1 s, sidebar-excluded MAE/SSIM, side-by-side comparison and amplified difference. Visual acceptance is still open: PBR apparatus is less photographic than target, and exact font/header/material treatment differs. Diagnostic scores do not establish completion of this page or the full 102-page goal.
