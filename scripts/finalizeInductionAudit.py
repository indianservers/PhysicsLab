from pathlib import Path
import json,hashlib,re
out=Path('artifacts/physics-studio-audit/induction');checks=['model-verification.json','browser-verification.json','runtime-verification.json','touch-verification.json','fallback-verification.json','production-smoke.json']
for f in checks: assert json.loads((out/f).read_text(encoding='utf-8-sig'))['passed'],f
assert (out/'production-smoke.json').stat().st_mtime>(out/'build.log').stat().st_mtime,'Run production verification after the final build.'
hashes=json.loads((out/'build-source-hashes.json').read_text(encoding='utf-8-sig'));assert all(hashlib.sha256(Path(f).read_bytes()).hexdigest()==h for f,h in hashes.items());build=(out/'build.log').read_text(encoding='utf-8-sig');assert 'built in' in build and 'files generated' in build;pc=re.search(r'precache\s+(\d+) entries \(([\d.]+) KiB\)',build);assert pc
visual=json.loads((out/'visual-comparison.json').read_text(encoding='utf-8-sig'));assert visual['sidebarSourceUnchanged'];browser=json.loads((out/'browser-verification.json').read_text(encoding='utf-8-sig'));model=json.loads((out/'model-verification.json').read_text(encoding='utf-8-sig'));runtime=json.loads((out/'runtime-verification.json').read_text(encoding='utf-8-sig'));production=json.loads((out/'production-smoke.json').read_text(encoding='utf-8-sig'));assert production['sixRapidPauseResumeChecks']
status={'overallGoalComplete':False,'route':'/magnetism/induction','status':'Native rebuild; visual refinement open','gates':{**{f:True for f in checks},'physicsCatalog':{'passed':True,'tests':581,'warnings':80}},'build':{'passed':True,'exitCode':0,'sourceHashesMatch':True,'precacheEntries':int(pc[1]),'precacheKiB':float(pc[2]),'largeBundleWarning':True},'production':production,'sourceHashes':hashes,'visualMetrics':visual,'modelLimit':'Coaxial ideal dipole, finite-width air coil, prescribed motion and purely resistive circuit; finite-bar corrections, coil self-inductance and meter inertia omitted.'}
(out/'verification-status.json').write_text(json.dumps(status,indent=2,ensure_ascii=False),encoding='utf-8')
report=f'''# Electromagnetic Induction native rebuild

Route: `/magnetism/induction`  
Reference: `12_magnetism/05_induction.png` (1536 × 1024)  
Status: native rebuild; visual refinement remains open. Overall goal incomplete.

## Reference scope and reconstruction

The original sidebar markup is unchanged. Comparison excludes the 228 px reference sidebar and 201 px application sidebar, then aligns the main regions. Only Observe, Predict, Experiment and Explain are mode tabs. The reference-relevant setup selector supports normal/reversed magnet polarity; zoom is 1×/2×/4×. No unrelated 3D tab, view menu, enhancement dock or fullscreen action is added.

An original Three.js scene replaces the flat SVG: coaxial bar magnet on a driven rod, air coil/bobbin/stands, ruler, leads, galvanometer body/dial/needle, rail and table. Generated canvas textures provide the pole letters, dial calibration, ruler labels, seeded table and decorative chalkboard. The chalkboard is labelled Reference sketch; it is not represented as a live field measurement. The moving magnet and meter are real meshes driven by the model. Winding detail is explicitly schematic; the default 200 turns are represented by 25 visible rings, while actual N is used numerically. No reference image, instrument crop or scene crop is imported.

Normal orientation now has S on the left and N on the right, making Into Coil (N first) true. The reference image labels its leading right-hand pole S while that control says N first; this inconsistency is corrected rather than copied. The reversed setup flips the colours/letters, signed moment, flux and emf, and changes the direction-button pole labels accordingly.

## Physics corrections

The old page displayed constant Φ = BA = 3.06 mWb, but computed ε = NBA v. That expression has units V·m and is not the time derivative of its displayed flux. The previous VERIFIED claim is withdrawn.

Declared model geometry: coil radius R = 0.05 m, axial width w = 0.02 m, centre xc = 0.20 m, N uniformly distributed turns. The visual bar is approximated by an axial point dipole with signed moment m = ±8 A·m². Total circuit resistance is 1000 Ω. These are explicit model choices, not measurements or a calibration to the screenshot.

For a single coaxial loop at axial offset u, its dipole flux is Φloop = μ₀mR²/[2(R² + u²)³ᐟ²]. Averaging over the finite coil width, with d = xmag − xc, h = w/2 and f(u) = u/√(R² + u²):

Φ(xmag) = μ₀m [f(d + h) − f(d − h)]/(2w).

g = dΦ/dxmag = μ₀mR² [(R² + (d + h)²)⁻³ᐟ² − (R² + (d − h)²)⁻³ᐟ²]/(2w).

Faraday’s law then gives ε = −N g v. Here Φ is mean flux per turn; total flux linkage is NΦ. With the +x loop normal, normal N-first approach from the left increases positive flux, giving negative emf/current and a leftward induced field. Beyond the coil centre, flux decreases and emf reverses. At the centre, flux is maximal but its derivative and emf are zero. Reversing the moment reverses Φ, ε and I. Positive I is counterclockwise as viewed from +x.

The circuit/meter model uses I = ε/Rtotal. By reciprocity, the magnetic reaction force on the driven dipole is Fmag = I N g. Thus Fmag v = −εI = −I²Rtotal. The external drive supplies the magnetic resistive loss. Acceleration/kinetic energy at the ideal drive start/stop are outside this mass-free prescribed-motion model. μ₀ is approximated as 4π × 10⁻⁷ H/m.

Default frozen snapshot: x = 0.12 m, v = +0.25 m/s, N = 200, m = +8 A·m²; Φ = 0.00001518615853 Wb (0.015186 mWb), ε = −0.02056507348 V (−20.565 mV), I = −20.565 µA, Fmag = −1.691689 µN and resistor power = 0.422922 µW. The reference’s flux/emf values are not preserved by an arbitrary scale factor.

**Assumptions:** The dipole approximation is not an exact field model of the rendered finite 6 cm bar. The coil is represented by a uniform turn distribution. Self-inductance, real galvanometer inertia, finite-bar corrections, hysteresis/saturation, radiation and mechanical friction are omitted. The meter is ideal and instantaneous; it autoranges in µA so large signals are not silently clipped. The plots are predictions of the selected trial, not invented experimental samples; their dot is the current snapshot.

Primary sources checked: [OpenStax Faraday’s law](https://openstax.org/books/university-physics-volume-2/pages/13-1-faradays-law), [OpenStax Lenz’s law](https://openstax.org/books/university-physics-volume-2/pages/13-2-lenzs-law) and [Feynman Lectures, vector-potential circulation and flux/current-loop integrals](https://www.feynmanlectures.caltech.edu/II_14.html). The finite-width average and gradient above are derived for the declared ideal geometry. No source illustration is reused.

## Interaction and timing

Into selects a paused trial starting at 12 cm and drives +x through the coil to 28 cm. Out starts at the coil centre (20 cm) and drives −x to 4 cm. Parameter/polarity/direction changes select new paused trials. Play advances 0.2 simulation seconds per wall second, explicitly labelled 5× slow playback. Motion stops at its travel limit with v, ε and I zero; Play can replay.

Pause freezes the full instantaneous simulation state, including velocity/emf; it is not a physical brake. Manual magnet placement creates a resting state, so its flux changes spatially but ε is zero until a prescribed drive starts. Mouse, actual touch and keyboard dragging/placement are supported. Editing experiment position/time pauses the clock, and their displayed precision is bounded. Speed has a piecewise graduated scale and N a logarithmic scale matching the displayed tick sequence; accessible values and numeric inputs use physical units.

Prediction/challenge answers are checked, mode tabs support arrow-key navigation, and Experiment records 14 quoted SI CSV columns: time, position, velocity, signed moment, N, polarity, mean flux, gradient, flux rate, emf, current, magnetic force, resistor power and resistance. Records survive reset.

An initial production regression found one queued frame advancing after Pause (12.14 → 12.17 cm). The clock now owns elapsed time and liveness in a ref, updates it outside React state updaters, and captures the latest time on Pause while preventing a pending frame from advancing. Final production checks include six rapid pause/resume cycles; controlled-clock tests also confirm no paused renders and no owned callback after unmount. Right-edge clipping originally masked by the application’s global overflow rule was fixed using explicit widths; tests inspect actual panel edges as well as scroll bounds.

## Verification evidence

- `model-verification.json`: {model['cases']} signed parameter/position cases. Flux gradient finite-difference maximum relative error {model['maxDerivativeError']:.3g}; magnetic force/power relative balance residual {model['maxPowerError']:.3g}. Velocity reversal, polarity reversal, N scaling, unchanged mean flux with N, centre/rest zero emf, bounded trajectory, stop and graduated-control mappings pass.
- Independent axial mean-flux quadrature converges: 8 → 128 slices reduces maximum relative error 0.000289201 → 0.00000112861. An independent finite source-loop Neumann integral at fixed dipole moment approaches the model as source radius shrinks 8 → 1 mm: maximum relative error 0.00900209 → 0.000138829. This validates the dipole limit, not an empirical finite bar magnet.
- Numerical integration of ε over a non-symmetric partial trajectory converges to −NΔΦ: 20 → 160 midpoint steps reduces error 3.18834 × 10⁻⁶ → 4.98666 × 10⁻⁸ V·s.
- `browser-verification.json`: numeric/graduated sliders, polarity/direction setups, native SI pose/meter/plots, mouse/keyboard placement and rest, playback, all zooms, keyboard modes, prediction/challenge, independently parsed 14-column CSV including Faraday/power relations, record persistence and zero-speed disabling pass.
- Eight viewports: 1536×1024, 1920×912, 1251×900, 1250×900, 1024×768, 768×1024, 390×844, 320×740. Panel inner/outer bounds, formula bounds, header order, mobile playback placement and desktop region separation pass. Normal page/console/local request error arrays are empty.
- Scoped StrictMode/three-SPA-remount instrumentation observes {browser['nativeRendererDisposals']} renderer disposals/context releases and {browser['nativeResourceDisposals']} owned geometry/material/direct-texture disposals. Environment resources are cleaned in source but outside that counter. This is not a general heap-leak or hardware-FPS certification.
- `runtime-verification.json`: 10/30/60 Hz clocks give t = 0.2 s, x = 0.17 m, ε = −0.08149829749 V after one wall second. Native meter angle error {runtime['maxMeterError']}; plots agree with the same state. Geometry reuse, paused render count zero, centre zero emf, sign reversal after crossing, automatic stop/clock cleanup, replay, hidden-tab exclusion, unclipped high-signal autorange and route cleanup pass.
- `touch-verification.json`: CDP touch drag, resting emf zero, touch play/pause, polarity, zoom and reset pass.
- `fallback-verification.json`: forced WebGL failure gives a calculated SVG; rendered pole labels and emf reverse together. Keyboard placement/rest, zoom, zero-speed handling and reset pass. No unsupported 3D control is offered.
- `physics-catalog.log`: 581/581 existing broad catalog checks pass, with 80 existing metadata warnings. These do not replace the direct induction tests.
- `build.log`: final TypeScript/Vite/PWA command exits 0; SHA-256 hashes match all four delivered sources. PWA precache {pc[1]} entries / {pc[2]} KiB. The existing large-bundle warning remains.
- `production-smoke.json`: normal production bundle without external request masking passes signed defaults, keyboard slider, polarity/withdrawal, all zooms, play/pause plus six rapid cycles, CSV/Faraday/power/plot agreement, manual rest, zero speed, record persistence and desktop/breakpoint/mobile bounds. Local errors are empty. Only the owned preview server on port 4198 is stopped; the user dev server remains alive.

## Visual evidence and remaining work

Before/eight after screenshots, reversed-pole capture, native motion at 0 and 0.2 simulated seconds, regional metrics, comparison/difference images and an eight-size contact sheet are saved. Sidebar-excluded RGB MAE improves {visual['before']['meanAbsoluteChannelDifference']} → {visual['after']['meanAbsoluteChannelDifference']}; Gaussian-window grayscale SSIM improves {visual['before']['ssim']} → {visual['after']['ssim']}. These diagnostics are not matching percentages or visual acceptance.

Native geometry now provides actual motion and a calibrated meter, but photographic materials/lighting, background depth, apparatus proportions/detail, dial finish and other visual differences remain. The default is a paused initial snapshot (Play), whereas the reference displays Pause; the model can reproduce moving and paused states. Flux and emf curves/values intentionally differ to correct physics. Finite-bar accuracy, nonzero self-inductance/meter dynamics, other browser engines, target-hardware performance and the roughly 327 MB PWA precache remain open limits.

All 102 references / 17 studios remain in scope. Neither this lab’s visual match nor the overall goal is marked complete.
'''
(out/'report.md').write_text(report,encoding='utf-8')
p=Path('artifacts/physics-studio-audit/completion-matrix.md');s=p.read_text(encoding='utf-8-sig');s=re.sub(r'^\| 12_magnetism \| induction \|.*$', '| 12_magnetism | induction | /magnetism/induction | 25.379 | 0.5423 | SI dipole/finite-coil Faraday model, 384 cases and independent convergence, eight-size browser, native runtime/touch/fallback/CSV, final build and normal production pass | Native rebuild; visual refinement open |',s,flags=re.M);assert '| /magnetism/induction | 25.379 |' in s;p.write_text(s,encoding='utf-8')
p=Path('artifacts/physics-studio-audit/reference-tabs.json');items=json.loads(p.read_text(encoding='utf-8-sig'))
for item in items:
 if item.get('route')=='/magnetism/induction':
  item['tabs']=[{'text':m,'label':None,'group':'idx-mode-tabs'} for m in ['Observe','Predict','Experiment','Explain']];item['assets']=[];item['dock']=0
p.write_text(json.dumps(items,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
checkpoint='''

## Electromagnetic Induction native rebuild checkpoint

See [Induction evidence](induction/report.md) and [current gate status](induction/verification-status.json). The dimensionally invalid NBA v expression and prior VERIFIED claim are withdrawn. A native dipole/finite-width coil apparatus, SI flux gradient, Faraday/Lenz/current/force-power state, actual galvanometer and model plots replace the flat SVG. Normal S-left/N-right orientation makes N-first entry true. Original sidebar/four modes remain; setup polarity, graduated controls, three zooms, placement, replay and recording/export work. Direct model (384 cases plus independent flux/dipole-limit/Faraday convergence), eight-size browser, controlled runtime, actual touch, fallback, scoped cleanup, final TypeScript/Vite/PWA and normal production checks pass. A queued-frame Pause race is corrected and covered by six rapid production pause/resume checks. 581/581 broad catalog checks pass with 80 existing warnings. MAE 25.379 / SSIM 0.5423 improve over baseline; photographic fidelity and model limits remain open. The full 102-reference / 17-studio goal stays active.
'''
for name in ['studio-inventory.md','ui-audit.md','physics-audit.md','functional-audit.md','test-results.md','performance-report.md','unresolved-issues.md','final-summary.md']:
 p=Path('artifacts/physics-studio-audit')/name;s=p.read_text(encoding='utf-8-sig');assert '## Electromagnetic Induction native rebuild checkpoint' not in s;s+=checkpoint;p.write_text(s,encoding='utf-8')
print(json.dumps({'passed':True,'overallGoalComplete':False,'sourceHashesMatch':True,'precacheEntries':int(pc[1]),'precacheKiB':float(pc[2]),'visual':visual['after']},indent=2))
