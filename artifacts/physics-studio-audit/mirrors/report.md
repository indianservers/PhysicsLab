# Curved Mirrors rebuild checkpoint

Route `/optics/mirrors`; reference `10_optics/04_mirrors.png`. Existing sidebar JSX is preserved exactly. Exactly four reference learning modes remain; no unrelated 3D tab or enhancement dock. Replaced the generic static reflection image and fixed rays with original native geometry, a candle, spherical reflector, rail/ruler, screen and model-driven image. Procedural canvas textures are original drawings, not screenshot crops.

## Correctness and reference discrepancy

The signed Gaussian paraxial model uses f = R/2, 1/f = 1/do + 1/di and m = -di/do. Internal lengths are metres, instrument/readout lengths centimetres and time seconds. Concave f is positive; convex f negative. Exact do=f produces no finite image or magnification. Each ray obeys the first-order slope relation u_out = y/f - u_in, with reflected propagation toward decreasing world x. A real image is on the object side; virtual images are behind the mirror and located by dashed backward extensions.

At the reference defaults R=40 cm, do=30 cm, f=20 cm, di=60 cm and hi=-4 cm. The image therefore lies beyond the object, not between object and mirror as illustrated by the mockup. The native scene and measurement brackets follow the equation. The original 2 cm candle and image/ruler use one physical scale. This intentionally changes the mockup's illustrated spatial arrangement and proportions.

The native spherical surface follows selected R; its aperture radius is at most min(8.5 cm, 0.22*abs(R)). The ray construction uses the paraxial vertex plane, not exact spherical-surface intersections. Large-slope aberration, optical obstruction, diffraction, phase, radiometry and actual candle combustion are not modeled. The returning center-line construction is first-order. Rays outside the aperture or degenerate focal/center constructions are omitted rather than forced through the mirror.

The real screen is 15 cm high, centered on the axis: a full projection is shown only when its position fits the finite bench and the entire image height fits its face. Larger real images remain reported numerically with a screen/bench-limit message. Virtual images use a translucent diagram projection; no real screen is placed behind the mirror. Camera framing includes large virtual images and reserves space for overlaid controls on desktop. Lenses received the same screen-bound correction for its actual 12 cm screen, plus a large-virtual-image camera fit regression.

Source: [OpenStax, Spherical Mirrors](https://openstax.org/books/university-physics-volume-3/pages/2-2-spherical-mirrors). This validates the ideal paraxial conventions; no exact high-aperture experimental accuracy is claimed.

## Controls and runtime

Both numeric/range parameters, concave/convex buttons, all five light switches, actual camera zoom (buttons and slider), reset/play/pause, four learning modes, computed configuration recording and challenge answers are implemented. Light controls move from the reference sidebar into the scene to preserve the existing sidebar. On smaller screens controls follow the bench immediately; optional legend/light controls follow them. Derived results are not editable pretend controls. Recorded configurations are computed model data, not measured experiments.

Markers travel along real incident/reflected paths at c, slowed nominally to one nanosecond per wall-clock second. Virtual extensions carry no markers. One parent clock drives the scene. Static geometry/materials are reused; changing curvature replaces/disposes only reflector geometry; rays and markers are instanced. Resize observers, animation frames and GPU resources are cleaned up at unmount.

## Evidence

- 6992 configurations; 19438 valid principal rays; 1538 omitted/degenerate-ray cases; 97503 packet samples. Model equations, signs, focal/C boundaries, convergence, aperture, finite-screen regression and propagation tests passed. Maximum algebraic intersection error 2.22e-16 m.
- 24 native configurations and 272 actual instance-matrix endpoint checks passed; maximum float32 geometry error 2.53e-08 m. Actual image position/height and native packet matrices also checked.
- Actual Three.js scene objects were inspected through its devtools observation event: image/focus/axis/ray visibility and orthographic zoom ratio passed. Independent canvas captures confirm visible packet/visibility changes; pixel differences alone are not treated as proof of correct physics.
- All controls, numerical real/virtual/infinite cases, answer keys, assignment locks, six viewport sizes, WebGL fallback and three SPA Home/back remounts passed. Deterministic layout tests exclude optional remote font/analytics requests; normal production smoke and separate stalled-font startup verification cover the full production entry.
- Shared physics regression passed 581/581. Full production build/PWA, final current-source type-check, final bundle refresh, both labs’ production smoke tests, finite-screen regressions and final responsive capture/touch checks passed. Logs: verified-build.log, final-typecheck.log and final-bundle.log.
- A 60-frame headless host sample averaged 6.84 ms, maximum 7.10 ms. This is not a target-device, cross-browser or GPU-memory-stability guarantee.

## Startup correction

Two existing remote font stylesheets in index.html and two stylesheet @imports could hold up simulator startup. They now load as optional style preloads and activate after arriving. Existing font URLs/families and all other CSS declarations are preserved. A production test held all four font stylesheets unresolved while the native bench became usable in 6181 ms, then released CSS sentinels and verified all styles activated. This confirms the entry no longer waits for optional font styles; it does not certify every unrelated page's typography or performance.

## Visual status and remaining work

Sidebar-excluded main-width-normalized MAE 20.169; SSIM 0.5567. These are diagnostic metrics, not acceptance percentages. Reference comparison/difference images and six responsive screenshots are saved. The mathematical image placement and sidebar-preserving light-control relocation are deliberate differences. Photographic lighting/materials, optical glow, fine hardware, exact typography and some illustrative proportions remain below target fidelity. The native Gaussian model excludes full spherical aberration. Cross-browser and extended GPU-memory checks remain open. This page and the full 102-reference goal are not claimed complete.
