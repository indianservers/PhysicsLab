# Lesson 055 — Human Eye and Vision Defects

## Implementation decision

- The supplied GLB is intentionally deferred per the user’s instruction. The former generic shared panel and opaque ray-baked artwork were replaced by a dedicated generated true-alpha eye cutaway plus live 2D ray and corrective-lens overlays.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-70bf5e81-8a4b-43b4-a7ed-0c384461767e.png`.
- App asset: `public/assets/experiments/human-eye-defects/eye-cutaway-2d.png`.

## Scientific behavior verified

- The reduced-eye model uses `Ptotal=Peye+Paccommodation+Pcorrection`, `1/f=1/u+1/v`, and a fixed 17 mm equivalent-lens-to-retina distance.
- Excess eye power gives a focus before the retina and needs a negative/concave correction; insufficient power gives a focus behind the retina and needs a positive/convex correction.
- A normal relaxed eye has an infinite far point and a 25 cm near point with 4 D maximum accommodation.
- Presbyopia reduces the accommodation range to 2 D, moving the near point farther away.
- A myopic far point of 0.80 m requires `P=−1/0.80=−1.25 D` for distant vision.
- Browser checks produced a negative suggestion for myopia and `+2.50 D` for the tested hyperopia setup. The mission rejects −2.50 D and accepts −1.25 D with sign-specific feedback.

## Browser and responsive evidence

- Normal, myopia, hyperopia, presbyopia, minimum/typical/maximum, object-distance, eye-power, accommodation, lens-type, signed power, suggestion, playback, and mission controls were exercised in the real route.
- Desktop: 1440 × 900 requested viewport.
- Tablet: 820 × 1180 requested viewport.
- Mobile: 390 × 844 requested viewport; the anatomical PNG, live rays, and focus marker remain visible and interactive.
- No application error surfaced during route loading or interaction checks.

## Validation

- TypeScript build passed.
- Physics regression: 457/457 passed before the final full repository gate.
