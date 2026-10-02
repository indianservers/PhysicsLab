# Lesson 032 — Circular Motion visual review

- The supplied GLB and 3D orbit/zoom gestures were deliberately omitted under the user's current 2D-first direction. A generated top-down rotating-platform PNG establishes the apparatus; live SVG supplies the cord, mass, orbit, tangent velocity, inward acceleration/force, and release trail.
- The generated edit encoded a checkerboard outside the circular apparatus rather than alpha. The app clips the bitmap exactly to the disk boundary, so no checkerboard or rectangular background is visible. All scientifically meaningful moving parts remain live overlays.
- One authoritative SI state drives `v=ωr`, `ac=v²/r=ω²r`, `Fc=mac=mrω²`, `T=2π/ω`, the digital tension reading, vector geometry, graph, accessible summary, and mission.
- Clockwise and counterclockwise change the sign of angular/tangential velocity while centripetal acceleration and force remain radially inward. Releasing the constraint sets tension to zero and advances the puck along `r_release(t)=r0+v_tangent t`.
- Minimum, typical, and maximum parameter presets cover the full mass/radius/angular-speed ranges. Play, Pause, Step, 0.25×–2× playback, reduced motion, Reset, and release were browser-tested.
- The challenge recorded `6.29 N` at `r=2.60 m`, then accepted `r=3.60 m` and `ω=1.87 rad/s` as the same force (within 0.5%).
- Generated sources: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-62247156-7783-44c6-af65-ff621a2d665c.png` and refined disk `exec-cace7a05-1ca6-498a-8d6e-04d7ff4b5cfb.png`; app copy: `public/assets/experiments/circular-motion/rotating-platform.png`.
- Desktop 1440×900, tablet 820×1180, and mobile 390×844 viewport evidence were captured, plus a tangent-release state. A fresh console had no runtime errors; its only warnings were the two pre-existing React Router future-flag notices.
