# Capacitors native rebuild checkpoint

Route: `/electricity/capacitors`. Reference: `11_electricity/06_capacitors.png`.

The live procedural Three.js apparatus replaces the former SVG scene. No reference pixels are used as application assets. Four reference learning modes and three equation tabs remain; unrelated enhancement tabs are absent. Existing sidebar markup is preserved.

The old area conversion exaggerated capacitance by 100,000. Internal area is now cm² × 1e-4 and separation is mm × 1e-3. Default C = 86.3283311748 pF. Initial inspection is paused at four RC time constants: Q = 0.4237 nC and U = 1.040 nJ. Mockup microfarad values are inconsistent with the displayed geometry and are deliberately corrected.

The analytical RC model drives capacitor voltage, charge, energy, current, field, polarization, graph and native glyphs together. Source work equals stored energy plus resistor heat. Replay starts at zero, finishes at eight time constants, and advances 10 ms per wall second. Setup edits begin a new trial at four time constants. Wire markers follow normalized delivered charge; they do not represent literal carrier speeds. Gap geometry is exaggerated ×45 for visibility. A linear dielectric fully fills the gap; negative dipole ends face the positive plate. The d/sqrt(A) > 0.1 warning is a uniform-field approximation heuristic, not a certified error bound. Leakage, dielectric loss and fringing fields are omitted.

Model verification covers 720 configurations, 5,040 states, 4,320 derivative checks and 20,160 independently parsed engineering-unit displays. Numerical quadrature checks source work and resistor heat. A separate shared-model regression covers 18 network configurations and eight direct benchmarks: series field now uses per-capacitor voltage, correcting energy density and force as well. The alternate capacitor lab UI has not been re-audited.

Browser evidence covers six viewport sizes, default and Custom material layouts, controls, mouse/touch/keyboard supply knob, teacher locks, CSV data, seven renderer disposals and 242 observed resource disposals. Runtime checks cover 10/30/60 Hz clock independence, paused rendering, hidden-tab suspension and route cleanup. See JSON evidence for exact observed results; these are bounded checks, not long-duration performance certification.

Visual comparison excludes the sidebar: prior MAE 25.120 / SSIM 0.5500; current MAE 23.663 / SSIM 0.5799. These diagnostics are not completion percentages. The scene remains visibly more schematic than the photographic reference. Visual refinement, cross-browser coverage, broader accessibility checks, long-duration GPU/memory measurements and all parameter/zoom combinations remain open. Historical failure PNGs document resolved transient material-button overflow; they are not current acceptance screenshots.

Scientific references:
- https://openstax.org/books/university-physics-volume-2/pages/8-1-capacitors-and-capacitance
- https://openstax.org/books/university-physics-volume-2/pages/8-4-capacitor-with-a-dielectric
- https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits
- https://openstax.org/books/university-physics-volume-2/pages/8-2-capacitors-in-series-and-in-parallel

The full 102-reference, 17-studio goal remains incomplete.

An initial production rerun exposed a service-worker MIME error (text/html instead of script). After a fresh successful TypeScript/Vite/PWA build, the normal production rerun passed with no page errors, local console errors or failed local requests. The transient failure was not reproduced; its root cause is not established. Six source hashes match the build inputs. Existing large bundle/PWA footprint (326,764 KiB precache) remains open.
