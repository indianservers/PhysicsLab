# Electric Field rebuild checkpoint

Route: `/electricity/electric-field`; reference: `11_electricity/02_electric_field.png`.

Original native source/probe spheres, glows, metric grid and adaptive field curves replace decorative Bezier paths. The reference's four modes, source/probe XYZ cards, collapse controls, vector checkbox, density, net/contribution readings, equation/definitions and transport are functional. Sidebar JSX is unchanged; no reference pixels are app assets.

## Scientific behavior

Three-dimensional vacuum point-charge superposition uses k = 8.99e9 and SI metres/coulombs internally. All nine coordinate controls work. The scene is an explicitly labeled orthographic XY projection; E_z/elevation appear for nonzero depth inputs. Probe arrow length is normalized to 0.16 diagram metres; true magnitude is numeric. A common physical scale drives grid and the 0.5 m bar.

Default Ex = 254950.100408130, Ey = -121805.386543815, Ez = 0 N/C; magnitude 282552.837340565, azimuth -25.536683146 degrees. The correct arrow is down-right, not the reference's inconsistent upward direction. Contributions are added by components. The displayed vacuum-permittivity expression is evaluated using the explicitly rounded k constant.

The old 3 cm denominator clamp is removed. A probe at an active source gives an undefined field, not zero or a softened value. Coincident charges combine algebraically for the total field; separate contributions may be undefined at their common location. Exact cancellation has zero magnitude and no direction; pure Z fields have undefined azimuth and defined elevation. Spheres are point markers, not polarized conductors; dielectric boundaries, radiation and retardation are omitted.

RK4 curves follow normalized total E in a source-axis meridional plane, with adaptive spatial steps bounded by the point-field Jacobian norm near cancellation points. Negative-source backward traces are reversed. Domain endpoints are clipped. Counts/colors are representative, not flux or field-strength calibration. Direction markers move at 0.25 diagram m/s, not a physical charge or signal speed. Dragging changes held source/probe configurations quasi-statically; depth is retained during XY gestures.

Sources: [OpenStax electric field and superposition](https://openstax.org/books/university-physics-volume-2/pages/5-4-electric-field), [OpenStax field lines](https://openstax.org/books/university-physics-volume-2/pages/5-6-electric-field-lines).

## Evidence

- `model-verification.json`: 144 3D configurations, 432 independent finite-difference potential-gradient checks (max relative error 4.99e-10); singularity, coincident/nonzero-source cancellation, zero/axial direction and density invariance cases.
- 67398 streamline segments follow E (minimum cosine 0.999980410); default step-halving maximum positional difference 2.2e-05 m.
- `browser-verification.json`: every coordinate/charge/density input, native 3D positions, vector axes (max component error 1.11e-16), native field tangents (minimum cosine 0.999999995), source/probe gestures, keyboard/touch, collapse/vector/zoom/pause/reset, singular/zero/depth cases, learning/recording, locks, six sizes and fallback. Probe-only moves reuse curve geometry. Seven old renderer/context pairs disposed across three SPA remounts with no later renders. No material page/console/local-request errors.
- `runtime-verification.json`: 358 actual marker instance matrices agree with model coordinates within 1.24e-07 m; minimum local-E direction cosine 1.0000000000. Zero paused renderer frames over 200 ms.
- `visible-direction-motion.json`: 1897 stage pixels changed by more than 20 levels between inspection times 0 and 0.37 s. This is direction-marker animation, not charged-particle motion.
- `production-smoke.json`: normal production bundle, correct default direction/values, all XYZ/depth/axial/singular semantics, density independence, collapsible cards, keyboard probe, vector/reset/recording and short-desktop/mobile layout passed. Controlled-input passive effects are awaited in the production keyboard check.
- Full `npm run build` passed (TypeScript/Vite/PWA); shared physics suite passed 581/581. Broad app bundle/precache concerns remain (1252 entries / 326682.97 KiB).
- Before, six after screenshots, depth/singular/fallback/motion cases, comparison/difference and responsive contact sheet are saved.
- `visual-comparison.json`: sidebar excluded and main widths normalized; MAE 14.572, SSIM 0.5988. These are diagnostics, not completion percentages. Correct spatial scale/direction and computed readings intentionally differ from inconsistent mockup artwork.

## Remaining work

Glow/material detail, field-line/arrow styling, composition, typography and annotation placement require further reference refinement. Additional browser engines, extended GPU-memory/FPS and responsive focus order remain unverified. The full 102-reference / 17-studio objective remains active; this checkpoint does not establish full visual fidelity or overall completion.
