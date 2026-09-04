# Lesson 019 — Semiconductor Diode and Rectifier visual review

- The supplied GLB was deliberately not loaded under the current 2D-first direction. Its P region, N region, depletion region and carrier roles are recreated as a responsive DOM/SVG carrier view over a generated transparent apparatus image.
- The generated image combines an isolated PN-junction block and a bridge-rectifier breadboard. Live depletion width, carrier motion, polarity, current, scope traces and measurements remain code-driven rather than baked into the asset.
- The mockup's PN explorer, I–V plot, rectifier builder, oscilloscope, ripple meter, equations and challenge are retained inside the existing application shell. On mobile, the scientific stage comes before the stacked controls and analysis.
- Junction current follows `ID = Is(exp(VD/(nVT)) − 1)` with `VT = kT/q`; the instructional model uses silicon and ideality factor 2. Doping and temperature affect saturation current, barrier potential and depletion width.
- Rectifier output uses the proper half/full-wave ripple frequency and `Vr(pp) ≈ Iload/(fripple C)`. The safe-limit panel exposes PIV and peak diode current; avalanche, recovery, series resistance and capacitor ESR are documented omissions.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-a51f7692-ece0-44b3-bb4c-660267425478.png`; app copy: `public/assets/experiments/semiconductor-diode/junction-rectifier.png` (1983×793, 32-bit alpha).
- Browser checks verified +0.70 V forward current/depletion, −2.0 V reverse leakage/widening, 50→100 Hz full-wave ripple, playback and reduced-motion controls, and the low-ripple mission. A fresh console had no errors; two React Router future-flag warnings are pre-existing.
