# Lesson 050 — de Broglie Wavelength

## Implementation decision

- The supplied GLB is intentionally deferred per the user’s instruction. The experiment uses a generated true-alpha PNG diffraction apparatus with live 2D beam, phase-wave, wavelength-ruler, and diffraction-ring overlays.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-4f729ec5-cf33-4318-8db7-0fc14fc9dfcb.png`
- App asset: `public/assets/experiments/de-broglie-wavelength/electron-diffraction-apparatus.png`.

## Scientific behavior verified

- Matter wavelength uses `λ=h/p` with nonrelativistic momentum `p=mv`.
- Electron voltage mode uses `v=√(2eV/mₑ)` and therefore `λ=h/√(2mₑeV)`.
- Screen spacing uses the stated small-angle model `Δy≈Lλ/d`, with `L=0.250 m`.
- Exact SI constants give 100.137 pm at 150 V and 70.807 pm at 300 V.
- Voltage and speed inputs are coupled to avoid contradictory particle states; neutral particles are controlled by speed and show equivalent kinetic voltage.
- A visible warning identifies states above `0.2c` where the nonrelativistic classroom approximation becomes limited.
- The 300 V target-wavelength mission completes with immediate numerical feedback.

## Browser and responsive evidence

- Desktop: 1440 × 900 requested viewport.
- Tablet: 820 × 1180 requested viewport.
- Mobile: 390 × 844 requested viewport; the apparatus remains live and the layout stacks into one column.
- Desktop document width stayed within the viewport; browser console errors: none.

## Validation

- TypeScript project build: passed.
- Physics regression: 432/432 passed before the final presentation-only overflow correction; final full regression is recorded in the tracker.
