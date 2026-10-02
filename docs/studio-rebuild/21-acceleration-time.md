# Motion & Kinematics — Acceleration–Time

Status: VERIFIED, page21/102. Page20 passed every gate before work began. Third of six pages in04_motion_kinematics. No later page has started.

## Reference inspection

03_acceleration_time.png1536×1024. Sidebar238px with brand, Home, expanded Mechanics and active Motion & Kinematics, seven sublinks, other subject groups, Tools/BrowseExperiments and lower-left learning note. Main title at258,46; eyebrowy22, subtitley83. Four modes top-right891,15 width497 height45. Main two columns: left856px x254, right400px x1124, gap14. Apparatus top117 height337; realistic silver air-track cart with accelerometer black box, wire, two supports and silver calibrated centimetre ruler, time1.842upperright. Combined plot panel below454 to915, three aligned graphs acceleration, jerk, velocity, horizontal t0..3. Pulse start~1.1,end~1.5,400ms dimension. Acceleration rectangular, jerk opposite peaks at edges, velocity smooth rise/plateau. Right controls117..492:amplitude2.50m/s² range−5..5; width400ms range50..2000; rate500Hz range100..2000. All sliders/numericfields. Live readings502..722,a2.49,deltaV.997,j−.12. Key relationships732..879 integral deltaV and j=da/dt. Footer933reset,pause,zoomdropdown,timelinescrub,time1.842/3.000,nextchallenge.

Scientific corrections: displayed acceleration2.49 after a pulse ending~1.5s is inconsistent with t1.842. Drawn pulse height~4.4 is inconsistent with input2.5. Drawn terminal velocity~1.5 does not equal amplitude2.5×width.4=1.0. A rectangular ideal pulse has impulsive/undefined finite jerk at its edges, not arbitrary finite spikes. Implement a narrow raised-cosine edge, explicitly defined width, and honest sampled measurements; do not fabricate noise to mimic2.49/.997/−.12.

## Existing inspection

Mapped legacy route /experiments/uniform-motion remains correct constant-v lesson. Reopened default and Simulate after completing page20; before-default.png and before-simulate.png captured in21-acceleration-time. Existing lab shows x=x0+vt,a0 with speed.45,right,x0.2,interval.5 and all existing controls. Read engine/data/lab in previous page and reconfirmed current browser state. Preserve lesson route, parameters and contracts. Read src/lib/positionTime.ts: piecewise constant acceleration programs have abrupt edges and no sensor model, so cannot supply finite jerk without changing that contract. src/lib/velocityTime.ts is one constant segment, also not a finite pulse. Add dedicated model/UI at proposed /motion/acceleration-time.

## Model implemented

src/lib/accelerationTime.ts. Amplitude−5..5m/s²; width50..2000ms; integer sensor rate100..2000Hz. Pulse centred1.3s so even maximum2s width fits3s observation. Width is FWHM and area-equivalent width. Each raised-cosine edge lasts r=min(.020s,.1width) centred at the nominal start/end. Difference of two ramped steps gives flat-top acceleration, finite analytic jerk, continuous velocity and position. Exact first/second integrals include cosine edge terms. Total deltaV=A×width in seconds exactly. Default t1.842 gives a0,j0,v1m/s,x.542m from rest atx0=0. Default FWHM edges1.1/1.5 have half-amplitude1.25; plateau2.5 at1.3. The graph and track must represent these values honestly and adapt ruler range for large displacement.

Sensor is ideal boxcar: each sample is exact mean acceleration over preceding1/rate interval. Jerk is backward difference of consecutive mean accelerations, explicitly a measured estimate; sampled deltaV is integral of those means, equal to analytical velocity at latest sample boundary. Sample-and-hold introduces rate-dependent timing and edge smoothing, not fabricated random noise. True cart follows continuous analytical position. Graph labels/explanations must distinguish sampled jerk from physical analytic jerk.

scripts/testAccelerationTimePhysics.mjs passes defaults and all amplitude/width/rate extrema, signs,zero, exact area, analytical derivatives at edge/interior/end, finite jerk, sensor sum, sample-hold timing. Derivative tests use a smaller jerk difference step at the C1 edge because the second derivative changes there; tolerance reflects finite-difference truncation. physics-results.json stores evidence. 

## Completed implementation and visual iterations

Dedicated lazy route `/motion/acceleration-time`; original uniform-motion lesson retained. `AccelerationTimePage.tsx`, scoped `acceleration-time.css`, `AccelerationTimeScene.tsx`, and `AccelerationTimePlots.tsx` separate presentation from the analytical model. Parent studio exposes a visible Acceleration-Time link, verified after refresh and by navigation.

Rebuilt the reference sidebar, four modes, 856/400px desktop columns, 337px apparatus, aligned three-trace plot, three parameter controls, readings, relations and timeline footer. Generated a compact silver cart with black accelerometer and cable; original prompts and source provenance are in 21-acceleration-assets.md. Track, ruler, cursor and labels are real SVG. Cyan marker represents true cart position; enlarged apparatus is disclosed. Ruler adapts to trajectory extent, including negative 20m travel. Mobile extreme ruler labels were thinned to 500cm spacing to eliminate crowding. Iterations corrected subtitle placement, control height, background brightness, apparatus proportions, mobile graph axes and negative-velocity tick spacing. Pulse detail is named accurately rather than claiming a fixed graph magnification.

Six final viewport captures exist: 1536x1024, 1440x900, 1280x720, 1024x768, 768x1024, 390x844. All six pass2 layouts were visually reviewed; final desktop and mobile, negative extreme and parent links were inspected again after the last label corrections. Reference geometry is closely retained. Scientific differences are intentional: correct pulse area, finite smoothed edges, honest sampled jerk, and physical ruler span replace inconsistent mockup numbers. No mockup image appears in the implementation.

## Verification

- `testAccelerationTimePhysics.mjs`: exact defaults, signed/zero/extreme pulses, derivatives, sample hold and integrated sensor area pass. Input rounding agrees with displayed precision.
- `testAccelerationTimeBrowser.mjs`: every slider/numeric field including blanks, clamps and rounding; elapsed play/pause, replay and reset; graph pointer capture and sample-step keyboard navigation; both zoom views; accordion; all modes; wrong/correct prediction; six presets; sensor rate effects; explanation close/Escape; all three challenges rejecting wrong and accepting exact answers. All pass.
- `testAccelerationTimeFinal.mjs`: 16 route checks including sidebar, parent link, direct refresh and legacy uniform-motion Simulate controls. Ten extreme screenshots cover min/max, zero, short pulses and slow/fast sampling on desktop/mobile. All values match pulse area and every viewport has zero horizontal overflow.
- No page errors or failed requests. Only pre-existing router future-flag notices remain. 90 animation frames at maximum sample rate: median7ms, p95 13.9ms, maximum14.1ms.
- Final production build exited0 after last scene/ruler changes; 804 precache entries. Existing large-chunk advisory remains unrelated to this page.

Evidence: `artifacts/studio-rebuild/21-acceleration-time/` contains physics-results.json, browser-checks.json, final-checks.json, before screenshots, iterative/final screenshots, extreme states and parent-links.png. All completion gates VERIFIED. No remaining page-specific defects or blockers.
