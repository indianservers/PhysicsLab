# Measurement — Mass and Time

Status: VERIFIED. Reference: 02_measurement/05_mass_time.png, 1536×1024. Route: /measurement/mass-time.

## Preserved implementation and physics

Inspected measurement-errors and uniform-motion solvers/components before adding this page. The existing measurement model handles length statistics; cart position reuses simulateUniformMotion without changing its contract. Original uncertainty navigation and the Measurement studio entry are browser-tested.

The mass standard sits on an independent electronic balance. Changing it does not change cart speed. Tare subtracts the standard's current mass, so reducing the mass afterward gives a negative net reading. Power, g/kg conversion and ideal calibration work. Cylinder height follows mass at fixed steel density and radius.

Setup A uses 1.54 m/s and B uses .80 m/s. Gate spacing is 10–100 cm and trial count 1–20. Gate 1's ideal event is at .2 s; Gate 2 follows after d/v seconds. An explicitly simulated seeded sensor model adds independent uniform ±2 ms timestamp jitter and quantizes to .1 ms. The 3 cm flag's leading edge starts each pulse, and its length sets pulse duration .03/v. The scene's blocking condition and flag width use the same geometry.

All displayed statistics derive from the actual simulated elapsed times. The default five-record preview has mean .32408 s, sample SD .00169322 s and last interval .3256 s. These correct the reference's inconsistent table, mean, SD, last reading and pulse separation. The sample SD uses n−1 and is unavailable for one observation; empty statistics are also unavailable. No fabricated reference numbers are substituted.

## Interaction and visual acceptance

Run creates a new seeded series and records each Gate 2 crossing exactly once. Pause/resume preserves simulation time; complete series can be rerun. Configuration edits create an explicitly labeled preview. Numeric fields permit sequential typing, clamp on blur and update valid values immediately. Reset restores default apparatus, series, mode, zoom and challenge; notes and lighting persist as session preferences.

Iterative screenshot review corrected control clipping, ruler label positions, mobile chart text, wide-interval tick density, zoomed balance controls and poster alignment. The scene uses a generated steel worktop/pegboard background, code-defined balance/cart/gates/ruler, metal gradients and a brushed-steel material. The desktop composition follows the reference: top navigation and modes, large apparatus, right controls/readings, sensor timeline/table/equation and bottom actions. Independent apparatus contours and perspective remain distinct from the photograph. Short beams across gate slots and corrected numerical data preserve scientific meaning.

Six required viewport captures show zero horizontal overflow and no clipped checked panels. The phone uses a shorter scene, separate accessible balance buttons and a timeline drawn in container-width coordinates. Background poster text follows the background's crop. No mockup screenshot is rendered as UI.

## Validation

- Three physics groups: both speeds and all spacing boundaries, true gate positions, measured intervals and jitter bounds; balance/tare/power/negative net readings; reproducible sample statistics, n=0/n=1 and mass independence.
- Eleven browser groups across testMassTime, testMassTimeAdditional and testMassTimeBoundaries: balance controls, single-trial state, pause/resume/completion, setup and parameter bounds, keyboard/sequential numeric entry, prediction, all three challenges with wrong-answer feedback, zoom controls, lighting/dialogs/notebook focus, complete 20-trial run with independently recomputed statistics, navigation and refresh, mobile long-interval tick spacing.
- No page errors or failed requests. Only pre-existing React Router future-flag warnings occur.
- Both image assets decode. A 120-frame sample reports 6.9 ms median, 7.2 ms p95 and 41.7 ms maximum on this host, not a universal performance guarantee.
- Final TypeScript/Vite/PWA production build passed after the poster crop correction, with 755 precache entries.

Evidence: artifacts/studio-rebuild/11-mass-time/{physics-results.json,interaction-prechecks.json,additional-interactions.json,boundary-interactions.json,runtime-results.json,build.log}, six viewport PNGs, mobile-long-interval.png and the capture/test scripts. A keyboard assertion was changed to wait for React's field synchronization rather than reading before the effect committed; the settled-value test passes.

## Asset provenance

Built-in image_gen.imagegen generated public/assets/mass-time/measurement-bench.png, 1619×971. Source: C:/Users/saisa/.codex/generated_images/01a07335-84ef-78b2-bcb9-d2e500ff94cb/exec-c99a115b-67d7-4228-850b-e66055d92866.png. Brushed steel is reused from page 08 with its original provenance. Posters, formulas, apparatus, motion, pulse plots and all UI are code.

Exact prompt: Use case: product-mockup. Empty teaching physics measurement workbench, photorealistic cinematic landscape 5:3 background plate for code-rendered scientific apparatus. Camera at low front three-quarter angle, looking slightly down. Upper 55 percent: dark charcoal perforated metal pegboard wall, softly out of focus, a blank off-white framed poster at far left, a blank cool grey framed poster at far right, a few small blurred cylindrical metal calibration weights along rear countertop. Lower 45 percent: completely empty brushed stainless steel tabletop with grey mottling and soft broad reflections, sharp foreground focus, neutral cool laboratory lighting from left and above. Keep central 80 percent empty. No electronic balance, no cart, no rail or track, no photogates, no instruments in foreground, no cables, no red beams, no text, no numbers, no logos, no diagrams, no UI or borders. Dark navy and charcoal palette, realistic photographic texture, softly illuminated worktop.

No Uncertainty or later studio page has been started.
