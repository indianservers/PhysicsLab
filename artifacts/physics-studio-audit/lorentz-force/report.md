# Lorentz Force native rebuild checkpoint

Route: `/magnetism/lorentz-force`. Reference: `12_magnetism/02_lorentz_force.png`. Full 102-reference / 17-studio goal remains incomplete.

The static schematic trajectory is replaced by a native chamber, injector, pole pieces, uniform-field arrows, moving particle and instantaneous velocity/force arrows. The equation, vector triad, top-view trajectory, parameters and live readings use one analytic state. Existing sidebar JSX and the four reference learning modes are preserved. The reference's relevant 3D Perspective view selector and vector-triad panel remain; no unrelated enhancement tabs are added. No mockup crops are application assets.

## Physical corrections and model

Coordinates are +x right, +y up, +z toward the viewer in the stated reference convention. B = (0,-B,0), launch velocity = (v,0,0). Thus positive q initially has F = (0,0,-qvB), into the page; the reference's out-of-page annotation has the wrong sign. Negative q reverses curvature. Both particles have proton mass: the negative case is an ideal antiproton, not an electron.

Constants are exact elementary charge magnitude 1.602176634e-19 C and 2022 CODATA proton mass 1.67262192595e-27 kg. Define omega = q B/m; x = v sin(omega t)/omega, z = -2v sin²(omega t/2)/omega, vx = v cos(omega t), vz = -v sin(omega t). The orbit centre is (0,0,-v/omega). Fx = q B vz, Fz = -q B vx, r = mv/(|q|B), T = 2pi m/(|q|B), frequency = 1/T, K = mv²/2. Small-angle displacement uses sin² to avoid cancellation in cos(theta)-1.

Default: r = 0.260992123223974 m, |F| = 1.602176634e-13 N, T = 3.279723747860955e-7 s, frequency = 3049037.2875221665 Hz. These intentionally differ from the reference's inconsistent 0.106 m / 4.81e-15 N / 1.34e-7 s. The prior scalar model largely used the correct formulas with approximate constants; the principal old failures were static trajectory/vector behavior and charge-sign changes that did not affect the drawing.

This is an exact solution of the nonrelativistic ideal model, not an exact relativistic chamber simulation. At maximum allowed speed 1e7 m/s, the relativistic radius correction is about 0.055679%. Infinite uniform B, E = 0 and no collisions/radiation/fringe fields are assumed. Apparatus is schematic; initial conditions are prescribed at the origin and injection dynamics are omitted. An orbit extending beyond the fixed chamber is flagged while the ideal B model continues. Camera auto-fit and normalized vector glyph lengths are display choices. Dashed curves predict the orbit; they are not measured past trajectories.

Playback advances 100 ns per wall second. Parameter edits begin a new paused trial; pause/resume preserves elapsed model time. Timestamp increments are captured before React state updates to avoid mutable callback timing/StrictMode ambiguity. `typecheck-before-fix.log` records the initial timestamp-capture issue; final build/typechecking evidence supersedes it.

## Verification

- Direct model: 32 parameter configurations / 192 states for both signs. Speed, circular radius, force magnitude and sign-mirrored orbits pass. Maximum normalized magnetic work residual 6.6085e-17; kinetic-energy relative residual 2.3582e-16; acceleration finite-difference relative error 6.6210e-10.
- Independent RK4 convergence over one period: position errors at 16/32/64/128 steps are 3.2443e-4 / 2.0304e-5 / 1.2694e-6 / 7.9341e-8 m, showing fourth-order convergence toward the analytic orbit.
- Actual browser clock at 10/30/60 Hz advances 1e-7 s per wall second. Native positions and velocity/force arrow orientations match the model; maximum normalized vector-component error 1.4766e-14. Paused rendering adds zero frames; resume, hidden-tab suspension without catch-up and route clock cleanup pass.
- Six viewport sizes: 1536×1024, 1920×912, 1024×768, 768×1024, 390×844, 320×740. Saved run has no horizontal/card overflow, page errors, local console errors or failed local requests. Playback follows the apparatus on tablet/mobile.
- Controls: charge selection, speed/field number and range controls, all three actual camera views, zoom, prediction feedback, quarter-period inspection, recording, independently parsed 14-column CSV and records surviving reset. Top view hides opaque hardware as an orbit cutaway; side and perspective views retain the chamber.
- Native cleanup: three SPA round trips, seven observed renderer/context disposals and 819 geometry/material/direct-texture-map disposals. ArrowHelper geometries are cloned so the component owns their cleanup. This is bounded lifecycle evidence, not long-duration memory/GPU certification.
- Touch selection and play/pause pass. WebGL-disabled fallback renders the calculated XZ orbit, mirrors with charge sign, supports zoom, and explicitly disables unsupported 3D views with an explanation. Reset retains the supported fallback view.
- Shared physics catalog: 581/581 pass, 80 catalog warnings. This catalog is distinct from the direct Lorentz tests above.

Final gates are recorded in verification-status.json; pending build/production checks are not implied passed here. Before/after screenshots, region diagnostics, comparisons/difference images and a responsive contact sheet are retained.

## Remaining work

The apparatus still has a schematic CAD finish rather than photographic fidelity. The correct orbit lies in the XZ plane, rather than reproducing the reference's inconsistent projected force/path illustration. Material/lighting realism, fine typography/camera alignment, all parameter/zoom/view combinations, broad accessibility/cross-engine coverage and long-duration GPU/FPS/memory measurements remain open. Visual metrics are diagnostics, not completion percentages. The inherited large main bundle/PWA footprint remains unresolved.

Scientific sources:
- https://openstax.org/books/university-physics-volume-2/pages/11-3-motion-of-a-charged-particle-in-a-magnetic-field
- https://openstax.org/books/university-physics-volume-2/pages/11-2-magnetic-fields-and-lines
- https://physics.nist.gov/cgi-bin/cuu/Value?mp

Latest sidebar-excluded diagnostics: before MAE 22.134 / SSIM 0.5456; after MAE 21.991 / SSIM 0.5419. Pixel MAE is slightly lower but structural similarity is below baseline; visual completion is not claimed.

A default-perspective line-of-sight check samples 13 predicted-orbit points against the actual opaque pole-piece bounds. It passes after shortening the pole depth; this is not a visibility claim for every parameter/view/zoom combination. The final mobile screenshot was visually inspected.

Final gates: TypeScript/Vite/PWA build exited 0, superseding the initial timestamp-capture typecheck failure; all four source hashes match. Normal production checks pass for the calculated proton default, keyboard slider, signed charge, all view/zoom choices, playback, independently parsed quarter-period 14-column CSV, retained records, short desktop/mobile layouts and four reference modes. Page errors, local console errors and failed local requests are empty. The inherited main-bundle warning and 1,259-entry / 326,869.44 KiB precache remain open.
