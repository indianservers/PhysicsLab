# Lesson 013 — Meter Bridge verification

## Deliberate deviations

- The supplied `meter-bridge.glb` and its manifest describe an electrolysis vessel, electrodes, and ions rather than a meter bridge. In accordance with the user's current 2D-first direction, the lesson does not load that mismatched 3D scene.
- The mockup's photographic apparatus was recreated as a transparent generated PNG with live HTML/SVG wire, jockey, meter, direction, graph, and measurement overlays. The existing application shell and its Simulate/3D navigation remain intact.
- The generated base contains a visually fixed central jockey from the still image; the bright orange/green live jockey marker is the authoritative interactive position.
- The default is intentionally slightly off balance (62.4 cm) so signed deflection is visible. Exact null is 60.9375 cm for R = 15.0 Ω and X = 23.4 Ω.

## Scientific checks

- Nodal equations solve the resistor-junction and wire-contact potentials with a finite 2 kΩ galvanometer.
- At exact balance, `X/R = l/(L-l) = 1.56` and galvanometer current is `+0.00 µA` at display precision.
- Left-of-null current is negative; right-of-null current is positive.
- Jockey input is clamped to `[0.5 cm, L-0.5 cm]`, preventing zero-resistance wire segments.
- Hidden-resistance mission completed at the exact null with `X = 23.4 Ω`.

## Browser checks

- Desktop: 1440×900 (`desktop.png`)
- Tablet: 900×1100 (`tablet.png`)
- Mobile: 390×844 (`mobile.png`)
- Minimum, typical, and maximum presets remained finite; endpoint currents were −489.87 µA and +485.36 µA.
- Play, pause, resume, step, 2× speed, replay path, reduced motion, keyboard range adjustment, and the hidden mission were exercised.
- Console errors: 0.

## Generated asset

- Runtime path: `public/assets/experiments/meter-bridge/apparatus.png`
- Original retained at: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-63ef0484-1826-48ea-99e9-db01a676a3bc.png`
- Alpha verification: 1536×1024, both sampled corner alpha values = 0.
- Prompt: "Create a high-resolution transparent-background PNG asset for a polished educational Class 12 physics web simulator: a realistic Indian school laboratory meter bridge apparatus viewed from a slightly elevated front angle. Include a long one-metre wooden bridge board with a straight resistance wire and clear 0–100 cm ruler ticks, left and right brass terminals, a central sliding jockey contact with black handle, a centered analog galvanometer below the wire, a blue dry cell with key switch at lower left, a known resistance box labeled R at lower center, and an unknown resistance box labeled X at lower right, connected with neat red and black wires. Warm walnut wood, brass and cream instrument faces, physically plausible proportions, no people, no room/background, no shadows extending beyond the object group, no white rectangle, fully transparent alpha outside the apparatus. Keep the central wire and jockey unobstructed for live SVG overlays. Do not add explanatory paragraphs; only small instrument labels R, X, G and ruler numbers where natural."
