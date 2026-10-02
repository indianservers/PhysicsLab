# Lesson 033 — Conservation of Energy visual review

- The supplied GLB was deliberately omitted under the user's 2D-first direction. A generated transparent alpine track supplies the visual plate; the ball, height guide, target marker, readings, and all energy feedback are live code-driven overlays.
- One SI state drives `mgh + ½mv² + Ethermal = constant`. Friction work `μmg s` is transferred exactly into the thermal bar, while kinetic energy is the nonnegative remainder.
- The track has a fixed 6 m target hill so the minimum-height mission has a stable physical solution. With friction, the required release height is `htarget + μs`; without friction, mass cancels from `mgh = ½mv²`.
- Controls cover start height, mass, friction, gravity, and release position plus minimum/Earth/maximum presets. Play, Pause, Step, 2× playback, reduced motion, reset, descent/climb motion, and settling were browser-tested.
- The mission accepted a 7.04 m release height and predicted 0.00 m/s arrival at the target under the selected friction model.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-bffadd0d-0a7b-49c5-9d38-352bfdff5b9e.png`; app copy: `public/assets/experiments/conservation-of-energy/energy-track.png`.
- Desktop 1440×900, tablet 820×1180, and mobile 390×844 were captured. A fresh console had no runtime errors; its only warnings were the two pre-existing React Router future-flag notices.
