# Lesson 049 — Bohr Atom Transitions

## Implementation decision

- The supplied 3D direction is intentionally deferred per the user’s instruction. The lesson uses a live 2D shell animation with a generated transparent PNG nucleus.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-b1fe8978-be37-47aa-82c6-04b8205f4cd4.png`
- App asset: `public/assets/experiments/bohr-model/nucleus.png` (RGBA, 1254 × 1254, transparent background).

## Scientific behavior verified

- Hydrogenic levels use `E_n = −13.605693122994 Z²/n² eV` for Z = 1–3 and n = 1–6.
- Atomic energy change is signed as `ΔE_atom = E_final − E_initial`; photon energy is the positive magnitude `|ΔE_atom|`.
- Frequency and wavelength satisfy `E_photon = hf = hc/λ`.
- The hydrogen n=3 → n=2 emission produces the ideal-model Hα wavelength 656.1 nm and passes the mission tolerance around 656.3 nm.
- The electron can be dragged only onto allowed integer shells, and playback supports play, pause, step, replay, speed, and reduced-motion controls.
- One completed animation creates exactly one transition-history entry; this was explicitly checked in the browser.

## Browser and layout evidence

- Desktop: 1440 × 900 requested viewport.
- Tablet: 820 × 1180 requested viewport; controls/readings reflow without overlap.
- Mobile: 390 × 844 requested viewport; the lab switches to a single-column flex layout, its lower grid becomes one column, and document overflow remains within tolerance.
- Browser console errors: none.

## Validation

- TypeScript project build: passed.
- Physics regression: 427/427 passed.
