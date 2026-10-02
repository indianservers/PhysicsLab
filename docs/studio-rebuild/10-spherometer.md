# Measurement — Spherometer

Status: VERIFIED. Mockup: 02_measurement/04_spherometer.png, 1536×1024. Route: /measurement/spherometer. No later page has been started.

## Scope and physics

Inspected the existing measurement-errors route, instrument defaults and uncertainty model before creating the dedicated solver. That original lesson remains available through Explain; the Measurement studio has a Spherometer entry.

R=(r²+h²)/(2h), with r the support-circle radius. The foot separation is √3 r. Default r=30 mm and h=.420 mm gives R=1071.638571 mm, correcting the mockup's 107.1 mm. Independent standard uncertainties σh=.005 mm and σr=.02 mm give σR≈12.832368 mm, correcting its 1.8 mm. Convex and concave surfaces have opposite signed curvature and the same radius magnitude. Zero sagitta produces zero curvature and infinite radius. Near zero, the UI flags first-order radius uncertainty as poorly constrained; curvature uncertainty remains finite. The rationalized spherical profile avoids cancellation.

## Implementation and visual comparison

The code-defined instrument uses three feet at 120° on the radius-r support circle, a screw tip at signed sagitta, shaded steel, cast-metal arms and knurled grips. The drum has 100 divisions and a 1 mm pitch; its fractional-turn markings rotate with signed sagitta. Live readings include total height. The side profile uses explicitly labeled vertical magnification, because the real sagitta is small. R extends beyond the diagram instead of using the mockup's scientifically inconsistent center arrow.

Repeated screenshot comparison corrected scene width, panel sizes, slider styling, apparatus proportions, metal textures, glass highlights, top-view shading and side-view hardware. A generated empty granite optical bench now matches the reference's setting. All controls, geometry and readings remain code. No target screenshot is rendered. The shallower glass profile and corrected numbers follow the given physical dimensions; independent hardware contours and lighting are not pixel-identical to the photograph.

Desktop, tablet and phone captures were reviewed. The six required viewports have no horizontal overflow or clipped checked panels. The phone stacks panels and retains usable controls. The page keeps its desktop composition at the 1536×1024 reference size.

## Validation

- Four physics groups validate defaults, all boundary combinations, convex/concave sphere profiles, zero/near-flat cases, numerical uncertainty derivatives and monotonicity.
- Eleven browser groups cover both surface selectors, numeric inputs and keyboard sliders, extremes, scan/pause/resume including descending direction, zoom bounds/reset, prediction feedback, all three challenges, notes/focus containment, uncertainty preference, tools, flat preset, explanation, direct refresh, old lesson navigation and the studio entry.
- Six viewport screenshots and geometry checks pass after the final visual changes.
- No page exceptions or failed requests. Only existing React Router future-flag warnings occur.
- All three assets decode. Final 120-frame sample: median 13.9 ms, p95 21 ms, maximum 90.2 ms on this shared host; earlier sample max was 27.8 ms. These are local measurements, not a frame-rate guarantee.
- Final TypeScript/Vite/PWA production build passes, with 751 precache entries. Existing main-bundle size warning remains outside this page.

Evidence is in artifacts/studio-rebuild/10-spherometer: physics-results.json, interaction-prechecks.json, additional-interactions.json, runtime-results.json, build.log and six viewport PNGs. Scripts are testSpherometerPhysics.mjs, testSpherometer.mjs, testSpherometerAdditional.mjs and testSpherometerRuntime.mjs.

Reset restores the default input, challenge, scan, mode and zoom. Notes and uncertainty preference persist for the session. No later page was modified.

## Asset provenance

Built-in image_gen.imagegen produced public/assets/spherometer/optical-bench.png (1448×1086). Source: C:/Users/saisa/.codex/generated_images/01a07335-84ef-78b2-bcb9-d2e500ff94cb/exec-b5892aed-c757-4f45-b66c-33dd0456b5f3.png. Brushed steel and hammered enamel are reused from pages 08 and 09, where their original prompts and provenance are recorded.

Exact prompt: Use case: product-mockup. Generate only an empty optical laboratory bench background for a separately code-rendered scientific instrument. Landscape 4:3 photo, close camera looking downward at a shallow angle. The lower 75 percent is a dark charcoal finely mottled granite tabletop in sharp focus, subtle grey mineral grains and soft overhead reflections. The central 70 percent must be completely empty and evenly lit to receive a composited instrument. Upper 25 percent is a dark blurred optical laboratory: an indistinct black equipment case at far left edge and a small blurred stack of metallic lens rings at far right edge, dark vertical equipment shapes at the back. Cool steel blue lighting, realistic photographic texture, soft bright light from upper left, moody low-key exposure but granite remains visible. No instrument, no tripod, no spherometer, no glass lens or discs on the central worktop, no text, no lettering, no UI, no numbers, no measurement marks. Edge-to-edge photograph with no border.
