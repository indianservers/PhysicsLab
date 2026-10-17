# Coulomb Force rebuild checkpoint

Route: `/electricity/coulomb-force`; reference: `11_electricity/01_coulomb_force.png`.

Original native spheres, mounts, perforated optical bench and procedural ruler replace the reflection-image placeholder. The reference header, four learning modes, three parameter controls, readings/equation/inverse-square graph, overlay widgets and transport are reconstructed. Sidebar JSX is unchanged. No reference pixels are application assets.

## Scientific behavior

Static vacuum point charges occupy x = -r/2 and +r/2. Common +x is rightward. F on A = -k q1 q2/r squared, F on B the opposite. At +5/-5 microcoulombs and 0.30 m, magnitude is 2.497222 N and each external field magnitude is 499444.444 N/C. The old page reversed A's sign; the mockup's 89900 N/C is inconsistent and is not hardcoded. k = 8.99e9 is explicitly the rounded constant. External-field readings omit self-fields; E and V share the model source state. Small forces use scientific notation instead of misleading signed 0.00.

RK4 trajectories follow normalized total E with adaptive spatial steps and clipped domain endpoints. Negative-source backward traces are oriented along E after reversal; representative counts are not quantitative flux. Equipotential surfaces use bisection-refined marching-square meridians revolved about the charge axis as wireframes; chords approximate between samples. Strength is a meridional log-color slice with a fixed 1e3 to 1e8 N/C display range. Zero, below-range values and glyph interiors are transparent; high values saturate. There is no softened force or capped numeric field reading.

Spheres are point markers, not conductors with induced surface charge. Supports hold positions fixed; dragging changes separation symmetrically and quasi-statically. Table/support polarization, dielectric response, radiation and retardation are omitted. Force arrows use a disclosed common logarithmic length scale. Moving markers illustrate field direction at 0.12 diagram m/s; they are not charge/current or photon flow. Pause freezes markers and leaves the static field unchanged. The actual log-log force curve has slope -2; zero-force cases explicitly avoid log(0).

Sources: [OpenStax Coulomb law](https://openstax.org/books/university-physics-volume-2/pages/5-3-coulombs-law), [OpenStax equipotential surfaces](https://openstax.org/books/university-physics-volume-2/pages/7-5-equipotential-surfaces-and-conductors).

## Verification evidence

- `model-verification.json`: 343 signed force/external-field and potential-gradient configurations; Newton's third law, zero-charge cases, units and inverse-square slope. Maximum relative gradient error 1.33e-10.
- 66290 field-line segments aligned with E; RK4 step convergence maximum difference 7.23e-06 m. 6104 contour endpoints with maximum normalized residual 4.84e-08.
- `browser-verification.json`: actual native sphere positions, arrow matrices/signs, field tangent cosine (minimum 0.999999999), equipotential geometry (max normalized potential residual 3.39e-07), log-strength pixels, four overlay toggles, all numeric/range inputs, sign/neutral/tiny-force cases, actual zoom, fullscreen, mouse charge dragging, keyboard/touch graph/sphere inspection, learning/recording, assignment locks, six viewport sizes and three SPA remounts. Seven old renderer/context pairs disposed with no further rendering. WebGL fallback supports all overlays. No material page/console/local-request failures.
- `runtime-verification.json`: 232 native instance matrices at inspection times 0 and 0.37 s agree with model positions within 1.85e-08 m. Minimum local-E cone direction cosine 1.0000000000; zero main-renderer frames while paused over 200 ms.
- `visible-direction-motion.json`: 3104 stage pixels changed by more than 20 levels; these are explanatory field-direction markers.
- `production-smoke.json`: normal bundle boots native canvas and passes corrected readings, sign/neutral cases, overlays, graph keyboard, zoom/reset/recording, short-desktop/mobile fit and the current 48px procedural ruler texture with correct physical/texture aspect ratio.
- Final `npm run build` exited 0 (TypeScript/Vite/PWA); shared physics suite passed 581/581. Application-wide large main bundle and precache remain performance concerns (1250 entries / 326643.56 KiB).
- `before.png`, six `after-*.png`, overlays/neutral/fallback/motion screenshots, comparison/difference and responsive contact sheet are saved.
- `visual-comparison.json`: sidebar excluded and main widths normalized; MAE 20.01, SSIM 0.5446. Diagnostic metrics, not acceptance percentages. Comparison-script folder mix-up was fixed and both Coulomb and Diffraction sets regenerated.

## Remaining work

Photographic background, surface/lighting realism, support/table detail and typography differ visibly from the reference. Additional browser engines, extended GPU/FPS/memory and responsive keyboard focus order remain unverified. The full 102-reference / 17-studio objective remains active; this checkpoint does not establish full visual fidelity or overall completion.
