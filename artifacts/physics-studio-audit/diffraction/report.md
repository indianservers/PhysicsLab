# Diffraction rebuild checkpoint

Route: `/optics/diffraction`; reference: `10_optics/06_diffraction.png`.

Original native laser, aperture mask, screen, rails, ruler and stands replace the static reflection image. The slit/circular opening is actual extruded geometry with a hole, not a photograph. Its procedural SVG close-up shares the aperture dimensions and a disclosed 2 mm window. Four learning modes and the reference's relevant three camera views remain. Sidebar JSX is unchanged. No reference pixels are application assets.

## Scientific behavior

Default slit: 100 micrometres, wavelength 632 nm, screen distance 0.50 m. Nominal central width 6.32 mm; first minimum 0.362111737 degrees. These correct the mockup's inconsistent 4.32 mm / 0.52 degrees. Exact screen positions use L tan(theta), while the displayed small-angle equations remain labeled approximations.

Fraunhofer slit intensity is sinc squared, with exact angular screen geometry and scalar obliquity. Circular intensity is the Airy function, using the first J1 zero 3.8317059702075125, giving the factor 1.2196698913 relative to the slit. N = a squared/(wavelength times L) is disclosed and an amber warning marks N > 0.1. A paraxial Fresnel comparison in Experiment includes quadratic aperture phase, integrated across a long slit or by a circular Hankel integral. Its width reading is explicitly a nominal far-field comparison, not a measured near-field width.

All computations use SI units; controls/readouts convert units. Intensity is normalized separately to I(0)=1. Near-field off-axis peaks can exceed 1; the graph rescales. Native and fallback screen patterns share the sampled model, display gamma 0.35 and exposure normalized to the profile maximum. The single-slit vertical taper is presentation styling, not a solved two-dimensional field. Circular intensity uses radial distance in both coordinates. Optical transverse dimensions in the apparatus are magnified x50, including the 20 by 8 mm screen window. Hardware dimensions are illustrative. The axis guide and c-speed representative markers do not claim to trace the diffracted wave field or photon counts. Pausing freezes propagation, while time-averaged intensity remains steady.

Sources: [OpenStax single slit](https://openstax.org/books/university-physics-volume-3/pages/4-1-single-slit-diffraction), [OpenStax circular apertures](https://openstax.org/books/university-physics-volume-3/pages/4-5-circular-apertures-and-resolution), [NIST Bessel expansions](https://dlmf.nist.gov/10.17).

## Verification evidence

- `model-verification.json`: 240 configurations / 1680 positions; 12 finite-window power bounds; symmetry, positive finite intensity, minima, quadrature convergence, Fresnel circle-axis formula, far-field limit and marker speed.
- `fresnel-reference.json`: 216 independent SciPy adaptive-quadrature complex fields; maximum error 3.73e-14. Includes wide aperture / short distance / high Fresnel number.
- `bessel-reference.json`: 6001 arguments from 0 to 600 checked independently against SciPy; maximum J0/J1 error 8.63e-13.
- `browser-verification.json`: six sizes, synchronized duplicate aperture selectors, actual mask geometry and open center, native texture agreement (max channel error 0), three real camera directions, all parameter numeric/range inputs, zoom/pause/reset, learning levels/quizzes, recording, propagation selection, pointer/keyboard/touch detector, assignment locks, three SPA remounts, 14 disposed renderers and circular WebGL fallback. No material console/page/local-request errors.
- `runtime-verification.json`: actual instance-matrix coordinates at 0, 0.37 and 0.38 ns; maximum position error 1.4e-08 m; c-speed relative error 6.53e-06 from Float32 coordinates. Zero main-renderer frames while paused over 200 ms.
- `visible-packet-motion.json`: 101 pixels change by more than 20 levels between physical times 0 and 0.37 ns.
- `production-smoke.json`: both native canvases, two apertures, three cameras, Fresnel comparison, validity warning, controls/recording/reset and short-desktop/mobile layout passed.
- Full `npm run build` passed (TypeScript/Vite/PWA); shared physics suite passed 581/581. Build still has a large application main bundle (5383.07 kB) and PWA precache (1249 entries / 326600.64 KiB).
- `before.png`, six `after-*.png`, circular/near-field cases, fallback and packet screenshots, comparison/difference images and responsive contact sheet are saved.
- `visual-comparison.json`: sidebar excluded and main widths normalized; MAE 19.949, SSIM 0.5723. Diagnostic metrics, not completion percentages.

## Remaining work

Photographic lab background, material/lighting realism, apparatus composition, fine instrument detail and typography remain visibly different. Scalar and paraxial models omit polarization, evanescent fields and material boundary effects. Additional browser engines, extended memory/FPS and responsive focus order remain unverified. The full 102-reference / 17-studio objective is still active; this checkpoint does not establish overall completion.
