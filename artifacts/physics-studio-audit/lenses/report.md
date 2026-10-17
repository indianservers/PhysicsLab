# Lenses rebuild checkpoint

Route `/optics/lenses`; reference `10_optics/03_lenses.png`. The existing sidebar JSX is preserved exactly. Four reference learning modes remain; no unrelated visualization tabs or enhancement dock. Replaced the unrelated static reflection image and fixed ray paths with original procedural Three.js apparatus, parametric lens bodies, a graduated optical rail, luminous object, principal rays and calculated image. No reference pixels are application assets.

## Physics

The signed ideal thin-lens equation is solved in metres. Controls/readings display centimetres. Converging f is positive, diverging f negative; real image distance is positive, virtual negative. Magnification is -di/do and image height is magnification times the actual 0.02 m object height. Exact do=f yields no finite image distance, magnification or height, rather than invalid numeric output.

Each valid principal ray reaches x=0, then changes slope by -y/f. Parallel, central and front-focal constructions converge at the model image or backward extensions of outgoing virtual rays. A ray whose lens-plane height exceeds the 0.065 m aperture is omitted with an explanation. Virtual extensions are dashed and carry no moving packets. Screen and image placements follow the model; off-bench images are explicitly reported without clamping calculated distance. A physical ruler and arrows use the same geometric scale, so their apparent proportions differ from the reference's inconsistent illustrated scale.

Convex and plano-convex lenses have distinct native bodies but equal ideal optical power at the same selected f; concave has negative power. The lens surfaces illustrate shape rather than solve finite-thickness refraction or aberration. This is an ideal paraxial model, increasingly approximate at large ray slopes; no diffraction, radiometry, phase delay or hardware obstruction is claimed. Markers propagate along forward geometric ray segments at c, slowed to one nanosecond per wall-clock second, rather than represent optical phase.

Reference: [OpenStax, Thin Lenses](https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses).

## Verification

- 2208 model configurations; 6382 valid principal rays, 242 unavailable-ray cases; 14916 packet samples. Four independent textbook cases, exact/near-focus boundaries, sign conventions, lens identity, ray convergence, aperture handling, propagation and no nonfinite coordinates tested.
- Maximum model intersection error 5.55e-17 m.
- Twelve native configurations checked by reading actual instance-matrix endpoints: 136 endpoint checks, maximum error 1.19e-08 m. Actual native packet matrices and ray visibility verified.
- Frozen native-canvas captures at 0 and 0.37 ns confirm visible marker motion: 58 pixels changed by more than 20 levels.
- Browser checks cover numeric/range inputs, lens cards/select, ray and axis toggles, zoom, reset/play/pause, learning dialogs, calculated configuration recording, six viewport sizes, assignment locks, three SPA remounts and WebGL fallback. No captured normal-page console/page errors.
- Shared regression: 581/581 passed. The production build/PWA, final bundle refresh and final production smoke passed, including native rendering, finite/infinite images, concave/plano choices, mobile control placement and calibrated slider labels. Final source type-check passed with exit code 0. Keyboard range steps, numeric clamping and touch range interaction also passed (input-verification.json).
- 60 headless frame intervals averaged 7.08 ms, maximum 13.90 ms on this host. This does not establish cross-device performance or GPU-memory stability.

## Visual status

Sidebar-excluded, main-width-normalized MAE 19.218; SSIM 0.6057. Scores are diagnostics, not acceptance percentages. Matching page regions, before/after images and difference images are saved. Native glass/metal lighting, optical glow, instrument detail, some label placement, typography and the reference's object/ruler proportions remain visibly different. This checkpoint does not certify full visual completion or completion of the 102-page goal.

An initial numerical-equation escaping error was caught by the browser suite and fixed; all subsequent finite, virtual and infinite formula checks passed. A later screenshot attempt encountered a transient ENOSPC write failure; storage availability was rechecked and the suite reran successfully, and all six final PNGs were decoded successfully.

Four additional native scene captures now cover virtual convex, exact focal position, concave and plano-convex cases; inspected virtual and focal views. See case-*.png.

Finite-screen consistency correction: the 12 cm screen now receives full real-image projections only within its actual height. Oversized images remain calculated but are marked outside screen/bench limits. Large virtual images fit the orthographic view. The 2,208-case model suite plus actual scene-object boundary/camera regressions passed; see ../mirrors/screen-boundary-verification.json. Final compiled regression is tracked with the Mirrors release.

The finite-screen correction and virtual-image framing passed final production smoke checks. The short-desktop inspector is compacted without clipping its inputs/readings/equations; toolbar bottom is 872 px in a 912 px viewport. All six current production viewport captures were refreshed. Latest type-check/build/bundle evidence is in ../mirrors/final-typecheck.log, verified-build.log and final-bundle.log.
