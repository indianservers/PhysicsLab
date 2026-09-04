# Lesson 030 — Measurement, Error, and Significant Figures visual review

- The supplied GLB and effect layers were deliberately not loaded under the user's current 2D-first direction. A generated transparent PNG establishes the caliper, cylindrical sample, balance and ruler; live SVG layers render the movable jaw, parallax sight lines, zero correction and readings.
- The PNG is presentation-only. Instrument selection, least count, jaw reading, trial table, statistics, propagated uncertainty and report text share one authoritative state.
- Ruler, vernier and micrometer presets use 1.00, 0.02 and 0.01 mm least counts. Raw readings are quantized to the selected least count; positive zero error is subtracted and negative zero error is added.
- Repeated trial scatter is deterministic from the displayed seed. The corrected mean and sample standard deviation retain full precision; random uncertainty is `s/√n`, instrument uncertainty is `LC/2`, and independent contributions combine in quadrature.
- Absolute error is `|x̄−xtrue|` and percentage error is `|x̄−xtrue|/xtrue×100%`. The area example uses `A=x²` and first-order propagation `ΔA/A=2Δx/x`.
- The uncertainty is rounded first (two significant digits when its leading digit is 1 or 2, otherwise one), then the measured value is rounded to the same decimal place. No intermediate value is rounded.
- Browser verification covered all three instruments, least-count/true-value/zero-error/trial controls, ruler parallax, signed correction, 2× playback, reduced motion, pointer jaw drag and a keyboard 0.01 mm jaw step.
- The reporting mission correctly accepted `(24.488 ± 0.011) mm` and rejected both over-precise and unjustifiably coarse alternatives.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-f8aa13cb-c805-49d5-ae06-d37037d3f22e.png`; app copy: `public/assets/experiments/measurement-errors/measurement-instruments.png` (1536×1024, 32-bit alpha).
- Desktop 1440×900, tablet 1024×768 and mobile 390×844 were captured. The mobile trial table scrolls internally while the instrument interaction remains live. A fresh console had no runtime errors; its only warnings were the two pre-existing React Router future-flag notices.
