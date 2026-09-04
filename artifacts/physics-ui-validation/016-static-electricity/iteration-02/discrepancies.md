# Lesson 016 — Static Electricity and Lightning verification

## Deliberate deviations

- Following the user's 2D-first direction, the small supplied positive/negative-charge GLB is not loaded. A generated transparent lab apparatus PNG provides the visual base; discrete charges, fields, electroscope leaves, ground, and lightning are live SVG/HTML state.
- The mockup's Van de Graaff, electroscope, and lightning contexts remain, but are organized around the required friction/contact/induction learning sequence instead of a decorative high-voltage display.

## Scientific and interaction checks

- Rubbing transfers electron packets from the positive triboelectric material to the negative one. The UI explicitly states that protons remain bound in nuclei.
- Paired body charges are equal and opposite; displayed total charge is `0.0e+0 C` for all rubbing settings.
- Coulomb force uses `F=k|q1q2|/r²`; unlike signs attract, like signs repel, and doubling separation quarters force.
- Field uses `E=k|q|/r²`. Maximum-field preset produced `3.42 MV/m`, exceeding the `3.0 MV/m` dry-air approximation and triggering the visible lightning state. Grounding suppresses air breakdown and exposes the ground path.
- Minimum, typical, maximum-field, all three material pairs, rubbing, separation, and grounding controls remained finite.
- Play, pause, resume, step, replay, 2× speed, reduced motion, electron/field animation, electroscope response, and lightning threshold were exercised.
- Induction mission completed in the required approach → ground → disconnect ground → withdraw order, leaving a charged electroscope without contact.
- Responsive screenshots: desktop 1440×900, tablet 900×1100, mobile 390×844. Fresh-tab console errors: 0.

## Generated asset

- Runtime: `public/assets/experiments/static-electricity/static-lab.png`
- Original: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-147d51bd-f0c9-46e0-8754-d1e9145faf69.png`
- Alpha: 1536×1024; sampled corner alpha values are 0.
- Prompt: "Create a high-resolution transparent-background PNG asset for a school physics static-electricity and lightning simulator, realistic front three-quarter laboratory display. Arrange a Van de Graaff generator with a large polished metal dome on a dark blue base at left, a glass-jar electroscope with metal cap and two gold leaves in the center, and at right a miniature green landscape base with a pointed lightning rod under a compact dark storm cloud. Include a black PVC rod and a cream wool cloth lying near the bottom as friction materials. Brushed metal, clear glass, warm wooden tabletop accents, dramatic but readable lighting. No electrons, charge symbols, field lines, lightning bolt, text labels, people, room, or background—those are live overlays. No white rectangle; fully transparent alpha outside the apparatus group. Leave open space around the dome, electroscope, cloud, and rod for animated SVG overlays."
