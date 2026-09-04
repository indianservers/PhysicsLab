# Lesson 056 — Lens Formula

## Implementation decision

- The supplied GLB is intentionally deferred per the user’s instruction. The former generic panel was replaced by a generated true-alpha 2D optical rail with live draggable SVG object/lens hit areas, screen, focal points, principal rays, and image.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-11af20fe-2dbf-42ed-95d7-e9b36f23d77f.png`.
- App asset: `public/assets/experiments/lens-formula/optical-rail-2d.png`.

## Scientific behavior verified

- The Cartesian convention takes incoming light left-to-right, `u<0`, convex `f>0`, and concave `f<0`.
- Image distance uses `1/f=1/v−1/u`; magnification uses `m=v/u=hᵢ/hₒ`.
- The default `u=−30 cm`, `f=+15 cm` case produces `v=+30 cm`, `m=−1`, a real inverted same-size image, and a zero equation residual.
- A concave lens produces an upright, diminished virtual image; the browser default comparison gave `v=−10 cm`, `m=+0.33`.
- Screen sharpness is based on its measured difference from the real image location, and virtual images cannot be caught on the screen.
- The focal-length mission rejects 15 cm and accepts `f=+16.0 cm` for `u=−24 cm`, `v=+48 cm`.

## Browser and responsive evidence

- Convex/concave, minimum/typical/maximum, object distance, focal length, object height, screen position, ray/focus visibility, playback, and mission controls were exercised in the real route.
- Desktop: 1440 × 900 requested viewport.
- Tablet: 820 × 1180 requested viewport.
- Mobile: 390 × 844 requested viewport; the live ray diagram and PNG optical rail remain visible.
- No application error surfaced during route loading or interaction checks.

## Validation

- TypeScript build passed.
- Physics regression: 462/462 passed before the final full repository gate.
