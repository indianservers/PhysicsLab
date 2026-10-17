# Performance status

This change removes unavailable render panels and their navigation entries; it does not change simulation loops or numerical time steps. No controlled frame-rate, memory, or repeated-navigation benchmark was performed in this pass. The production bundle still produces Vite's large chunk warning. Claims of target performance or leak-free behavior remain unverified.

## Standing Waves checkpoint — 2026-10-17

Standing Waves local headless sample: 60 frames averaged 34.48 ms/frame (about 29 fps), maximum 34.90 ms. Native geometry/buffers are reused; static formula/mode thumbnails do not rebuild each frame. Three remounts leave one canvas each and no console errors. This narrows the earlier unmeasured status for this page only; cross-browser, long-run memory and target-device smoothness remain open.

## Sound Spectrum checkpoint — 2026-10-17

Sound Spectrum local headless sample: 60 frames, mean 6.90 ms, maximum 7.10 ms. Foam ridges use instancing; spectral calculation and static plots cache by source parameters; one clock/resize observer and explicit GPU cleanup. Three remounts yield one canvas each, no console errors. This is a limited local measurement; cross-browser, target-device and long-duration memory acceptance remain open.

## Doppler Effect checkpoint — 2026-10-17

Doppler Effect: local headless 60-frame sample mean 9.27 ms, maximum 14.20 ms. One analytical parent clock, reusable native geometry, bounded emission-front history and explicit observer/GPU cleanup; three remounts leave one canvas and no normal-run console errors. Limited observation only; long-run memory, cross-browser and target-device performance remain open. Global large-bundle warning remains.

## Reflection checkpoint — 2026-10-17

Reflection: two views share one model clock; instanced rays/packets and explicit observer/GPU/context cleanup. Three SPA unmount/remount cycles retain two canvases and produce no normal-run console errors. Local 60-frame headless observation mean 12.61 ms, maximum 20.90 ms. Extended memory, target-device and cross-browser acceptance remain open; global bundle-size warning persists.


## Refraction checkpoint — 2026-10-17

Refraction caches the trace by parameters, reuses ray/packet instanced meshes, renders on state/resize updates, and disposes geometry/materials/textures/environment/renderer at unmount. Three SPA remounts tested. A 60-frame headless Chromium sample averaged 9.46 ms, maximum 14.10 ms (host-specific). GPU-memory/leak profiling remains open; three remounts alone do not prove memory stability.


## Lenses checkpoint — 2026-10-17

Lenses caches model by configuration, reuses ray/marker instance meshes, disposes resources, and owns no independent animation loop. Three SPA remounts passed. A 60-frame headless host sample averaged 7.08 ms, max 13.90 ms. GPU-memory/leak profiling and cross-device measurements remain open.


## Curved Mirrors checkpoint — 2026-10-17

Curved Mirrors reuses geometry/materials/instanced rays and markers with explicit resize/clock/GPU cleanup. Three SPA remounts checked. A 60-frame headless host sample averaged 6.84 ms, max 7.10 ms. Optional remote fonts no longer block production startup; four deliberately pending stylesheets did not prevent canvas readiness, and later style activation passed. Large-bundle/precache size, cross-device and long-run memory acceptance remain open.


## Interference checkpoint — 2026-10-17

Interference: the aperture profile is memoized by optical configuration; detector/time updates do not recalculate the 2,049-sample profile. Native meshes reuse box/cylinder geometry, instanced rays and markers, a dynamic wavefront buffer and a procedural screen texture updated only on model changes. One parent RAF advances physical time; cleanup cancels it, disconnects observers and disposes geometry/materials/textures/renderer/environment on unmount. Three remounts passed. This is code/resource-lifecycle evidence, not a long-duration memory or frame-rate benchmark. Extended GPU memory and cross-browser performance remain unverified. One browser launch failed from temporary disk exhaustion; stale-profile cleanup was policy-rejected and not performed. A subsequent fresh run passed after authoritative free-space checks.


Final Interference gates: `npm run build` exited 0 (TypeScript, Vite and PWA); shared physics checks passed 581/581; production smoke passed with native canvas, modes/presets/views, detector/reset, mobile transport and unclipped short-desktop formula/toolbar. Build still warns about the existing large main chunk (5,382.96 kB) and broad PWA precache (1,247 entries / 326,559.94 KiB). These application-wide performance issues remain open. Per-lab `verification-status.json` records source hashes and terminal results.


## Diffraction checkpoint - 2026-10-17

Diffraction caches quadrature nodes and memoizes aperture profiles; time and detector changes do not rebuild the optical profile. Original meshes reuse geometry; aperture extrusion is replaced only for aperture type/size changes, and both rendered views dispose resources on unmount. Three SPA remounts verified 14 disposed renderers/context losses with no later renders. While paused, the main renderer produced zero additional frames over 200 ms. Actual marker matrix coordinates agree with the model within 1.4e-08 m; Float32 speed relative error 6.53e-06. This is lifecycle and coordinate evidence, not an extended GPU memory/FPS benchmark. Full build/PWA passed. The application-wide main bundle (5383.07 kB) and precache (1249 entries / 326600.64 KiB) remain large; extended memory, additional browser engines and broad loading optimizations remain open.


## Coulomb Force checkpoint - 2026-10-17

Coulomb Force memoizes model/streamlines/contours and skips unchanged parameter updates. Field-strength pixels are regenerated only for source changes when enabled; contour meshes are built only when enabled. Instanced direction markers reuse geometry; replaced line/surface GPU buffers are explicitly disposed. Route cleanup disconnects observers and disposes original geometry/materials/textures/environment/renderer/context. Three SPA remounts verified seven disposed renderers with no further rendering. Runtime inspected 232 native marker matrices, maximum coordinate error 1.85e-08 m and minimum local-E direction cosine 1.0000000000. Paused renderer produced zero additional frames over 200 ms. This is lifecycle/coordinate evidence, not a long-duration GPU-memory or frame-rate benchmark. Full TypeScript/Vite/PWA build passed; broad application bundle/precache size, extended memory, additional browser engines and responsive focus order remain open.


## Electric Field checkpoint - 2026-10-17

Electric Field memoizes source geometry/curves separately from probe coordinates and inspection time. Probe-only changes reuse curve GPU buffers; source/density changes replace and dispose them. Instanced fixed/moving arrows share geometry and instance colors. Original grid/glow resources, observers, renderer and context are disposed on unmount; parent RAF is cancelled. Three SPA remounts verified seven disposed renderers with no further renders. Runtime inspected 358 actual instance matrices: max coordinate error 1.24e-07 m, minimum local-E direction cosine 1.0000000000. Paused main renderer produced zero frames over 200 ms. These are lifecycle/coordinate checks, not extended GPU-memory/FPS benchmarks. Full TypeScript/Vite/PWA build passed; broad app precache remains large (1252 entries / 326682.97 KiB). Additional engines, long-duration memory/FPS and global bundle optimization remain open.

## Electric Potential checkpoint - 2026-10-17

Electric Potential caches mesh/contours across probe scans and reuses guide buffers; no idle rendering after pause (200 ms observation). Seven disposed renderer/context pairs observed across StrictMode/remounts. Deterministic native scan reaches 0.10000000000000142 m after 0.5 s. Final TypeScript/Vite/PWA build passed; existing bundle warning and roughly 327 MB PWA precache remain. These checks do not establish long-duration memory or cross-engine/FPS acceptance.

## Electric Potential visual refinement - 2026-10-17

Native camera and sampled geometry reuse across probe updates; memoized SVG fallback avoids rebuilding its static mesh for probe-only movement. Seven renderer/context lifetimes and 147 geometry/material disposals after final use verified across remount activity; zero idle renders after pause in 200 ms. Build passed; existing main-bundle and roughly 327 MB PWA precache limitations remain. Long-duration GPU/memory/FPS and other browser engines remain unverified.
