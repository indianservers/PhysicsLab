# Lesson 029 — Computational Physics Workflow visual review

- The supplied GLB and effect layers were deliberately not loaded under the user's current 2D-first direction. A generated transparent PNG establishes a five-station numerical workstation; live HTML/SVG layers provide the selectable workflow blocks, data pulse, numerical/reference traces and convergence chart.
- The PNG is presentation-only. Every model choice, stability flag, error, cost, chart, workflow state and reproducibility identifier is derived from the authoritative numerical run.
- Explicit and implicit one-dimensional diffusion solve `∂u/∂t = α∂²u/∂x²` for a sine eigenmode and compare with `u(x,t)=sin(πx)e^(−απ²t)`. The oscillator mode uses classical RK4 and compares with `x(t)=cos(t)`.
- Error is `RMS(unumerical − ureference)`. Explicit diffusion reports unstable when `λ=αΔt/Δx² > 0.5`; the implicit solver iterates to the selected tolerance. Work cost counts deterministic grid updates and solver iterations, not wall-clock device performance.
- Model, mesh N=10/40/80, timestep 0.0005/0.005/0.02 s, three solver tolerances and reproducible seed all alter a real calculation or acceptance result. Identical settings produce the same FNV-derived run ID.
- The five problem/model/discretize/solve/verify blocks are individually selectable. Run/pause/step, 0.25×–2× playback and reduced motion animate deterministic data flow without changing the result.
- Browser verification included explicit diffusion, implicit diffusion, oscillator RK4, parameter extrema, stable and unstable cases, reference/error display, convergence rows and reproducible settings.
- The challenge begins with an unstable `N=80`, `Δt=0.02 s` explicit run and passes with the efficient candidate `N=20`, `Δt=0.005 s`: RMS error `4.59×10⁻⁵`, cost `1,560`, below both targets.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-d1e805e4-14ad-4bd0-b7d2-8ecc981d6fa3.png`; app copy: `public/assets/experiments/computational-physics-workflow/numerical-workflow-bench.png` (1536×1024, 32-bit alpha).
- Desktop 1440×900, tablet 1024×768 and mobile 390×844 were captured. The mobile pipeline scrolls internally while all controls remain available. A fresh console had no runtime errors; its only warnings were the two pre-existing React Router future-flag notices.
