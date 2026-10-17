from pathlib import Path
import json,hashlib,re
out=Path('artifacts/physics-studio-audit/solenoids');checks=['model-verification.json','browser-verification.json','runtime-verification.json','touch-verification.json','fallback-verification.json','production-smoke.json']
for f in checks: assert json.loads((out/f).read_text(encoding='utf-8-sig'))['passed'],f
hashes=json.loads((out/'build-source-hashes.json').read_text(encoding='utf-8-sig'));assert all(hashlib.sha256(Path(f).read_bytes()).hexdigest()==h for f,h in hashes.items());build=(out/'build.log').read_text(encoding='utf-8-sig');assert 'built in' in build and 'files generated' in build;pc=re.search(r'precache\s+(\d+) entries \(([\d.]+) KiB\)',build);assert pc
visual=json.loads((out/'visual-comparison.json').read_text(encoding='utf-8-sig'));assert visual['sidebarSourceUnchanged'];browser=json.loads((out/'browser-verification.json').read_text(encoding='utf-8-sig'));model=json.loads((out/'model-verification.json').read_text(encoding='utf-8-sig'));runtime=json.loads((out/'runtime-verification.json').read_text(encoding='utf-8-sig'))
status={'overallGoalComplete':False,'route':'/magnetism/solenoids','status':'Native rebuild; visual refinement and real-material fidelity open','gates':{**{f:True for f in checks},'physicsCatalog':{'passed':True,'tests':581,'warnings':80}},'build':{'passed':True,'exitCode':0,'sourceHashesMatch':True,'precacheEntries':int(pc[1]),'precacheKiB':float(pc[2]),'largeBundleWarning':True},'production':json.loads((out/'production-smoke.json').read_text(encoding='utf-8-sig')),'sourceHashes':hashes,'visualMetrics':visual,'modelLimit':'Finite current sheet plus uniform magnetization closed at centre; not an exact nonuniform or nonlinear material solution.'}
(out/'verification-status.json').write_text(json.dumps(status,indent=2,ensure_ascii=False),encoding='utf-8')
report=f'''# Solenoid native rebuild

Route: `/magnetism/solenoids`  
Reference: `12_magnetism/04_solenoids.png` (1536 × 1024)  
Status: native rebuild; visual refinement and real-material fidelity remain open. Overall goal incomplete.

## Scope and implementation

The original sidebar markup is preserved. Comparison excludes the 193 px target sidebar / 201 px application sidebar and aligns the remaining main regions. Only Observe, Predict, Experiment and Explain are mode tabs. The reference-relevant view selector supports actual Cutaway, Exterior and End cameras; zoom and fullscreen work. No generic 3D tab or enhancement dock is added.

An original Three.js bench includes representative copper winding rings, cutaway/full core, flanges/shafts, frame, ruler, current supply and leads, and a movable ideal Hall probe. Canvas textures are generated locally for the table, labels and supply readout. Winding detail is explicitly schematic: the default 800 physical turns are represented by 33 visible rings; the numerical model uses actual N. Ring count changes with N; the air core removes the magnetic core body and other presets change its appearance. No reference image or cropped pixels are imported by the application.

All inputs, steppers and material buttons change the same SI model used by native probe data, field directions, profile and CSV. Mouse/touch dragging and keyboard move the probe along x. Play is a mechanical 2 cm/s scan reflecting at ±10 cm; the steady field traces remain fixed. Parameter edits pause the scan and preserve the probe location. Reset restores the paused default, cutaway view, zoom and initial challenge; recorded data survives. Five real challenge tasks advance with Next Challenge and grade the actual setup through Check setup. Prediction, experiment recording and quoted nine-column CSV export are functional.

## Corrected model and declared limits

The previous page used `μ₀ μᵣ (N/125) I`. That implicit length is 125 metres; it was used to reproduce 2.41 mT from the mockup. The old VERIFIED claim and calibration are withdrawn. The new dimensions are declared choices for the centimetre-scale apparatus: L = 0.16 m, R = 0.025 m. The image does not fully specify those dimensions; this is not a claim of an exact dimensional reconstruction.

For a tightly wound cylindrical current sheet, Kfree = NI/L. The material model assumes uniform axial magnetization M inside a cylinder of the same dimensions. At the centre, α = (L/2)/√((L/2)² + R²), D = 1 − α, Hcentre = Kfree α − DM. Closing the illustrative linear constitutive law M = (μᵣ − 1)Hcentre gives:

M = (μᵣ − 1) Kfree α / [1 + (μᵣ − 1)D].

Its bound surface current adds to Kfree, so Ktotal = Kfree + M. The exact axial field of this prescribed current-sheet/uniform-M model is:

Bx(x) = μ₀Ktotal/2 × [(x + L/2)/√((x + L/2)² + R²) − (x − L/2)/√((x − L/2)² + R²)].

μ₀ is approximated as 4π × 10⁻⁷ H/m. The displayed B = μnI equation is identified as the long-coil limit, rather than used as a position-independent finite-coil field. For the default N = 800, I = 1.50 A, μᵣ = 200, the model gives α = 0.9544799780, D = 0.0455200220, M = 141627.8352 A/m, effective boost = 19.88371136, and central B = 0.1788691323 T = 178.87 mT. The corresponding naive long-coil expression gives 1.88496 T. Neither result is calibrated back to 2.41 mT.

Off-axis fields integrate the same cylindrical free/bound current sheet: the axial integral is analytical and azimuth uses 512 midpoint samples. RK4 traces use normalized B directions. An excluded 1.5 mm band around the winding sheet avoids near-sheet evaluation. The cutaway shows inner trace segments locally and computed outer return paths; inner continuations outside that diagram region are omitted, not joined with invented curves. Lines ending at the excluded band or bounds are truncated.

Positive current gives +x internally, south at the left and north at the right. End View looks from −x, so its direction readout correctly changes to ⊗ (+x, into view). At zero current, M and B vanish and direction is undefined; native traces and S/N labels disappear. This ideal nonperturbing probe does not model a physical sensor bore or measurement noise.

**Core approximation:** The centre closure is not an exact solution of the nonuniform finite-core boundary problem. Core names label illustrative constant-μᵣ presets from the reference, not measured B–H curves. Saturation, hysteresis, remanence, lead/contact fields, winding pitch, heating and transient induction after edits are omitted. These limits are stated in the UI. Mathematical verification below validates this stated model, not empirical accuracy for a real iron/ferrite/steel specimen.

Primary references checked: [OpenStax finite-solenoid derivation](https://openstax.org/books/university-physics-volume-2/pages/12-6-solenoids-and-toroids), [MIT Electromagnetic Fields and Energy, chapter 9, uniform magnetization of a cylinder](https://ocw.mit.edu/courses/res-6-001-electromagnetic-fields-and-energy-spring-2008/d4860fdc85d667828060e6d72e49a62f_09.pdf), and [Feynman Lectures, ferromagnetism and bound surface currents](https://www.feynmanlectures.caltech.edu/II_36.html). The centre-based closure above is an explicitly derived approximation; the sources are not claimed to validate it as an exact material solution. No source illustrations are reused.

## Verification

- `model-verification.json`: {model['configurations']} parameter configurations / {model['axisStates']} axial states, plus 12 challenge grading cases. SI axial magnitude, centre constitutive closure, symmetry, zero field and current/turn scaling pass. Maximum normalized constitutive residual {model['maxConstitutiveResidual']:.3g}.
- Independent full Biot–Savart surface integration at four off-axis points converges toward the implementation: 32 → 256 axial slices with 512 azimuth samples reduces maximum relative vector error 0.00234527 → 0.0000367284, approximately second order. The 512-versus-1024 azimuth check at 28 near-sheet/end/outer points has maximum relative error {model['nearSheetError']:.3g}.
- Finite-difference normalized divergence and curl residuals outside the sheet are {model['maxDivergence']:.3g} and {model['maxCurl']:.3g}. The {model['calculatedTraces']} computed traces / {model['lineSegments']} checked segments have maximum normalized tangent residual {model['maxTangency']:.3g}.
- `browser-verification.json`: all steppers, sliders, core presets/selector, probe keyboard/mouse drag, zero current, three views including end-view direction, zoom/fullscreen, 2.5-second play/pause, prediction, challenge advance/grade, independently parsed nine-column CSV and record persistence pass. Native SI probe data and profile marker agree with the model.
- Eight viewports: 1536×1024, 1920×912, 1251×900, 1250×900, 1024×768, 768×1024, 390×844, 320×740. Document/card/inner-control overflow, actual formula bounds, header order, narrow-screen playback placement and desktop panel separation pass. Short-desktop control overflow found in the first run was corrected before these final captures.
- Scoped resource instrumentation observes {browser['nativeRendererDisposals']} renderer disposals/context releases and {browser['nativeResourceDisposals']} owned geometry/material/direct-texture disposals during StrictMode and three SPA remounts. Environment resources are cleaned in source but are outside that counter. This does not certify arbitrary long-session heap usage or FPS.
- `runtime-verification.json`: 10/30/60 Hz clocks reach x = 0.02 m with the same B after one second. Native arrow direction error is at most {runtime['maxDirectionError']:.3g}. Field-line vertices stay fixed, probe geometry is reused, pause generates no bench renders, reflection/resume and hidden-tab exclusion pass, and the owned scan callback is removed on route exit.
- `touch-verification.json`: actual CDP touch drag, touch play/pause, core selection and reset pass.
- `fallback-verification.json`: forced WebGL failure shows a calculated axial SVG; zoom, keyboard probe, zero-field handling and reset pass. Unsupported 3D views are disabled and explained; reset maintains cutaway.
- `physics-catalog.log`: 581/581 existing broad catalog checks pass, with 80 existing validation-metadata warnings. Those checks do not replace the direct solenoid tests.
- `build.log`: final TypeScript/Vite/PWA command exits 0. SHA-256 snapshot matches all four delivered source files. PWA precache {pc[1]} entries / {pc[2]} KiB; the existing large-bundle warning remains.
- `production-smoke.json`: normal local production bundle, without an external-request mask, passes default finite field, keyboard slider, core/zero current, views and end-view direction, zoom/fullscreen, play/pause, finite-end CSV/profile agreement, record persistence, short-desktop/breakpoint/mobile bounds and only four mode tabs. Local page/console/request errors are empty. Only the script-owned preview server on port 4197 is stopped; the user dev server remains running.

## Visual evidence and unfinished work

Before, eight after screenshots, paired probe scans at 0 and 4 seconds, responsive contact sheet, comparison and difference images, and regional metrics are saved in this directory. Sidebar-excluded RGB MAE is {visual['before']['meanAbsoluteChannelDifference']} → {visual['after']['meanAbsoluteChannelDifference']}; Gaussian-window grayscale SSIM is {visual['before']['ssim']} → {visual['after']['ssim']}. Average pixel error improves only slightly and structural similarity remains slightly below baseline. These are diagnostics, not matching percentages or acceptance.

Layout and functional reconstruction are in place, but photorealistic materials/lighting, winding and flange finish/proportions, Hall-label placement/callout, field presentation, supply details and other scene differences still require refinement. The reference ruler and rendered coil are not treated as a reliable common pixel-to-length calibration; the rebuilt ruler and coil share actual metre coordinates. The profile and displayed field intentionally differ to remain consistent with the declared model. The exact finite nonlinear core and empirical material response remain unimplemented. Other browser engines, hardware performance and the roughly 327 MB PWA precache remain open concerns.

All 102 canonical references / 17 studios remain in scope. This checkpoint does not mark the lab or the overall goal visually complete.
'''
(out/'report.md').write_text(report,encoding='utf-8')
p=Path('docs/studio-rebuild/71-solenoid.md');s=p.read_text(encoding='utf-8').replace('Native rebuild; final build/production gate pending, visual refinement open.','Native rebuild; current verification gates pass, visual refinement and real-material fidelity open.');s+='\nFinal TypeScript/Vite/PWA and normal production checks pass. Direct model, eight-view browser, controlled clock, touch, fallback, CSV and scoped resource cleanup evidence is saved. MAE 22.818 / SSIM 0.5217 are diagnostics; structural similarity remains slightly below baseline. This is not visual acceptance.\n';p.write_text(s,encoding='utf-8')
p=Path('artifacts/physics-studio-audit/completion-matrix.md');s=p.read_text(encoding='utf-8-sig');s=re.sub(r'^\| 12_magnetism \| solenoids? \|.*$', '| 12_magnetism | solenoids | /magnetism/solenoids | 22.818 | 0.5217 | Finite current-sheet / approximate uniform-core model, 64 configurations / 576 axial states, eight-size browser, runtime/touch/fallback/CSV, final build and normal production pass | Native rebuild; visual and real-material refinement open |',s,flags=re.M);assert '| /magnetism/solenoids | 22.818 |' in s;p.write_text(s,encoding='utf-8')
p=Path('artifacts/physics-studio-audit/reference-tabs.json');items=json.loads(p.read_text(encoding='utf-8-sig'))
for item in items:
 if item.get('route')=='/magnetism/solenoids':
  item['tabs']=[{'text':m,'label':None,'group':'slx-modes'} for m in ['Observe','Predict','Experiment','Explain']];item['assets']=[];item['dock']=0
p.write_text(json.dumps(items,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
checkpoint='''

## Solenoid native rebuild checkpoint

See [Solenoid evidence](solenoids/report.md) and [current gate status](solenoids/verification-status.json). The implicit 125 m calibration and prior VERIFIED claim are withdrawn. An explicit 16 cm × 2.5 cm radius finite coil, approximate uniform magnetization, original native apparatus and movable Hall probe share SI state with the profile and CSV. Four reference modes remain; the relevant three-view selector, zoom/fullscreen, steppers/core presets and five advancing/graded challenges work. Direct model (64 configurations / 576 axial states plus numerical field/trace checks), eight-view browser, controlled runtime, actual touch, fallback, scoped disposal, final TypeScript/Vite/PWA and normal production checks pass. 581/581 broad catalog checks pass with 80 existing metadata warnings. Default field is 178.87 mT for the declared approximation, not a calibrated 2.41 mT. MAE 22.818 / SSIM 0.5217 remain diagnostic; structural similarity is slightly below baseline. Visual refinement, exact finite/nonlinear material response, cross-engine/hardware verification and application bundle/PWA size remain open. All 102 references / 17 studios stay in scope; overall completion is not claimed.
'''
for name in ['studio-inventory.md','ui-audit.md','physics-audit.md','functional-audit.md','test-results.md','performance-report.md','unresolved-issues.md','final-summary.md']:
 p=Path('artifacts/physics-studio-audit')/name;s=p.read_text(encoding='utf-8-sig');assert '## Solenoid native rebuild checkpoint' not in s;s+=checkpoint;p.write_text(s,encoding='utf-8')
print(json.dumps({'passed':True,'overallGoalComplete':False,'sourceHashesMatch':True,'precacheEntries':int(pc[1]),'precacheKiB':float(pc[2]),'visual':visual['after']},indent=2))
