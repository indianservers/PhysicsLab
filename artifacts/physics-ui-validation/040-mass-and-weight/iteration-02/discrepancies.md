# Lesson 040 — Mass and Weight

## Deliberate visual deviation

- The supplied mockup suggests a dimensional laboratory scene. Per the current product direction, this implementation uses a generated transparent PNG apparatus with live 2D HTML/CSS motion; no new GLB or 3D scene was created.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-103bfea7-1d54-42d5-830c-b4555103f577.png`.
- Application asset: `public/assets/experiments/mass-and-weight/mass-weight-station.png`.

## Scientific behavior implemented

- True weight uses `W = mg` with body-specific surface gravity.
- Altitude uses the inverse-square field `g(h) = g0[R/(R+h)]^2`.
- The balance preserves the object's mass across all worlds.
- The spring scale reports apparent weight `N = m(g + a)`, clamped to zero after contact is lost.
- The elevator mission checks a numerical prediction to ±0.05 N.

## Interaction and responsive verification

- Exercised all four worlds, all three condition presets, rest/upward/free-fall elevator modes, relocate/pause/step, all playback settings used by the lab, reduced motion, reset, and mission calculation/check.
- Verified at desktop, tablet, and 390 px mobile widths. Additional focused mobile captures cover the stage and mission because a single phone viewport cannot show the full lesson.
- No runtime console errors were observed. The only warnings are the existing React Router future-flag notices.
