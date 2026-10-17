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
