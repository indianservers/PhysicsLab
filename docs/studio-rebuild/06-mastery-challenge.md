# Concept Overview — Mastery Challenge

Status: VERIFIED. Reference: 01_concept_overview/06_mastery_challenge.png, 1536 × 1024. Intended route: /quiz. No later studio has been started.

## Existing implementation inspected

Read the complete QuizPage.tsx, quiz.ts session metadata, relevant App routes and quiz links. The current route is the existing Physics MCQ Challenge with class/category/subcategory/difficulty filters, 12-question sessions, adaptive weak concepts, achievements, explanations, reveal/replay and saved best score. Its existing browser rendering is recorded in artifacts/studio-rebuild/06-mastery-challenge/before.png. The complete original practice component is retained for every query URL, including focus and query. The explicit practice-bank destination is /quiz?view=practice; MCQ catalog links retain that destination. Plain /quiz loads the new mastery surface lazily.

## Mockup and governing model

The reference couples a moving cart, generator, electrical light source, lens and thermal sample. Its formula conflates instantaneous electrical power with average kinetic-energy transfer, and its displayed source can otherwise imply more heat than the finite cart energy supplies. The implementation must keep a closed energy ledger rather than reproduce an invented heating curve.

New independent model: src/lib/masteryChallenge.ts. The apparatus, values, graphs, predictions and mission checks all consume this model.

- Defaults: cart mass 0.50 kg, launch speed 2.20 m/s, resistance 15 ohms, focal length 0.10 m, sample mass 10 mg, thermal conductance 0.4 mW/K. Initial temperature 20°C. Initial kinetic energy 1.21 J.
- Ideal regenerative emf V = kv with k = 4.8/2.2 V s/m. Current I = V/R. Electrical drag k²/R and mechanical viscous drag 0.08 N s/m give m dv/dt = −(k²/R + b)v. Position is the integral of that velocity. Initial V = 4.8 V and I = 0.32 A match the reference consistently, then decay as the cart slows.
- Fixed idealized emitter electrical-to-light fraction 0.70, lens transmission 0.85, sample absorptivity 0.85. Depict/describe an idealized light emitter rather than claim a real incandescent bulb has 70% optical efficiency. Beam waist combines 0.006 rad source divergence and geometric defocus at a fixed sample distance of 0.10 m through a 0.01 m aperture radius.
- Default 1/e² spot radius is 0.60 mm. A centered circular sample of radius 1 mm captures F = 1 − exp(−2a²/w²). Irradiance is a radial Gaussian whose integral equals incident optical power; no graph amplitudes are fabricated.
- Sample specific heat is a stated constant 900 J/(kg K), so the 10 mg sample has heat capacity 0.009 J/K. The sample apparatus view uses explicit magnified/schematic labels; it does not imply a macroscopic block is heated by 1.21 J.
- Thermal model C dT/dt = P_abs(t) − H(T−20). Both electrical power and the cooling response are integrated analytically, including the equal-rate limiting case. Predicted peak is analytic, not a sampled maximum.
- Energy ledger at every instant: initial cart energy = remaining kinetic energy + mechanical loss + optical/conversion loss + stored sample heat + thermal loss. Absorbed energy never exceeds electrical energy, which never exceeds initial kinetic energy.
- Default peak: 68.8063°C at 2.31517 s. At 2.40 m/s with other defaults, peak is 78.0835°C. Thus a 70°C mission is reachable by physically meaningful adjustment. Zero launch speed gives zero power and no heating; zero thermal conductance stores all absorbed heat.

## Model prechecks

scripts/testMasteryPhysics.mjs passes seven groups (physics-results.json): independent default values/unit conversions; every parameter bound and times 0–1000 s with energy conservation; numerical derivative checks of position/braking/heating; zero-input and insulated limits; analytic peak and equal-rate convolution; defocus/capture and numerical radial irradiance integration; target reachability and finite plots.

## Implemented page and browser verification

The dedicated surface recreates the top bar, sidebar, three selectors, mission stages, large apparatus, four lower panels and four learning modes. The original MCQ bank and its filters remain functional behind query URLs. Three distinct missions cover reaching a peak temperature, correcting defocus and retaining heat at 12 seconds. Each has beginner/intermediate/advanced thresholds, real prediction feedback and session completion records. No fabricated historical scores or persistence are implied. Reset restores the current mission preset; level, display/hint/playback preferences and session results remain.

All six parameter sliders reset the launch coherently. Bounds are mass 0.10–0.75 kg, speed 0–3 m/s, resistance 5–30 ohms, focal length 0.05–0.20 m, sample mass 5–50 mg, and conductance 0–1 mW/K. Physics checks include all 64 parameter corners plus focused equivalents, remain finite through 1000 s, conserve energy, and keep peak temperature below 400 °C within these controls. Gaussian irradiance integrates to model absorbed power. The plot rolls over the latest 12 seconds and the run ends at 60 seconds.

- scripts/testMasteryChallenge.mjs: ten groups pass. Every control, parameter bound, stage, mode, graph, display option, playback option, zoom, search, dialog focus/Escape, actual 70 °C success, direct refresh and original focused MCQ filters are exercised. No own console errors or failed requests; only existing React Router future-flag warnings.
- scripts/testMasteryBoundaryBrowser.mjs: four additional groups pass. Zero speed leaves the sample at 20 °C and current zero; wrong predictions receive corrective feedback. Refocusing the second mission reaches its actual target. Insulating the third mission achieves the 12-second hold target and records completion. Reset and retained preferences are verified.
- scripts/testMasteryPhysics.mjs: seven groups pass, including independent calculations, differential equations, equal-rate/zero-input/zero-loss limits, analytic peak, radial integration and rolling plots.
- Six full-page captures: 1536×1024, 1440×900, 1280×720, 1024×768, 768×1024 and 390×844. All have zero horizontal overflow, no clipped panel/filter containers, visible goals and graphs at least 201 px high. The mobile Explain dialog stays within the viewport with readable colors.
- A 120-frame live-run sample reports median 34.7 ms, p95 36.2 ms and maximum 38.8 ms on this host. These are local headless-browser timings, not a 60 fps guarantee.

## Visual comparison and scientific departures

The 1536×1024 reference and output were inspected directly. Top bar, sidebar, heading/filter layout, mission frame, apparatus order, lower panel proportions and learning-mode placements closely follow the reference. Phone layout was revised after screenshot inspection to remove excessive space above the apparatus. Tablet and shorter desktop views scroll vertically without crushing graph content.

Individual apparatus materials and geometry are independently rendered and do not reproduce the exact photographed hardware. This is an intentional live reconstruction, with SVG electrical wiring, rotor, lens, spot, numerical readouts and sample layered over passive cart/chamber assets. The room is passive. No mockup screenshot is used in the page. A circular sample matches the Gaussian capture model; its orange appearance indicates optical illumination, not incandescence. The reference's invalid sustained power/formula/temperature curve are replaced with instantaneous absorbed power and a finite-energy heating/cooling curve. Default values evolve after launch instead of remaining frozen at the mockup numbers.

## Generated asset provenance

Tool: built-in image_gen.imagegen. Transparent originals were copied without removing alpha to public/assets/mastery-challenge/cart.png (1536×1024 RGBA) and chamber-housing.png (1305×1205 RGBA). They contain no interface text or live state. The passive room is the already inspected experiment-launcher/lab-environment-v2.png asset.

Chamber prompt: Use case: product-mockup. Project asset: isolated passive thermal experiment chamber housing for a live physics simulation. Generate one photorealistic laboratory thermal chamber, compact roughly cubic brushed stainless steel housing with dark graphite front frame, machined fasteners, subtle side ventilation slots and small feet. Nearly frontal camera, slightly above and to the left so a narrow right side and top are visible. Front is open with no door in the way, revealing a deep dark empty cavity and a small EMPTY raised sample platform centered low inside. Upper-right front panel has one plain dark rectangular LCD window with absolutely no text, digits or glow. Cavity has realistic metal reflections, hinges, screws and restrained cool blue laboratory lighting. No sample, glowing object, heater coil, rays, thermal glow, people, UI, labels, logos, cables, external table or room. Genuine transparent RGBA background; preserve empty surrounding alpha, not a checkerboard painting. Tightly frame the complete object including feet, with five percent margin. Aim for realistic photographed metal and optical-bench equipment quality, not flat vector graphics. The sample and live LCD text will be composited separately by code.

Cart prompt: Use case: product-mockup. Asset for a live physics teaching simulation. One isolated realistic optical-laboratory dynamics cart carrying a single unmarked grey metal cube mass. Navy-blue anodized rectangular cart body with chamfered metal edges, small hex bolts, slight brushed finish, silver axle hubs and two visible smooth black rubber wheels with rotationally symmetric silver hubs (no spokes or angular markings). Cube sits centered on the cart. Camera almost side-on, slightly above showing a narrow top and right end; cart points horizontally right. Photorealistic cool laboratory lighting with restrained steel-blue reflections. Genuine transparent RGBA background, complete object with small margins. No rail, table, floor, environment, external shadow, cables, generator, arrows, beam, text, labels, logos or UI. Real physical materials, not a flat vector drawing. The complete cart and cube will translate together in a simulation, with all numerical values rendered separately.

Final production build passes after the last icon/phone-layout refinements: TypeScript, Vite and PWA generation, 732 precache entries. Evidence is in build.log. Studio 1 is complete; the next page in inventory order is Studio 2, Measurement page 1.
