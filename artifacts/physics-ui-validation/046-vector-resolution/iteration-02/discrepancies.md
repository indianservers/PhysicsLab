# Lesson 046 — Vector Resolution

- Followed the user's current direction to defer 3D. A generated transparent crate/rope PNG provides the physical context; axes, resultant, components, projection drops, parallelogram, labels, handle, and animation are live SVG.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-00448159-bd42-473f-83d9-d3c8622f8bee.png`.
- App asset: `public/assets/experiments/vector-resolution/crate-rope.png` (1536×1024 RGBA; transparent alpha verified).
- Physics uses `Aₓ=A cos(θ−φ)`, `Aᵧ=A sin(θ−φ)`, and `A=√(Aₓ²+Aᵧ²)` for perpendicular axes rotated by φ. Signs are preserved across quadrants.
- Added magnitude, angle, axis-rotation, and 0°/15°/45° snap controls; min/typical/max presets; draggable and keyboard-operable vector head; projection/recombination playback, pause, step, replay, speed, and reduced motion.
- The target mission reached 60 N at 30° with Aₓ=52.0 N and Aᵧ=30.0 N, both inside their component limits. Keyboard movement of the vector head was verified.
- Checked at 1440×900, 820×1180, and 390×844. No console errors were reported. Mobile retains the live SVG workspace and stacks the controls/readings below it.
