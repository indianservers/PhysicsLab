from pathlib import Path
import json,hashlib
out=Path('artifacts/physics-studio-audit/electromagnets')
hashes=json.loads((out/'build-source-hashes.json').read_text());assert all(hashlib.sha256(Path(p).read_bytes()).hexdigest()==h for p,h in hashes.items())
assert (out/'production-smoke.json').stat().st_mtime>(out/'build.log').stat().st_mtime
names=['browser-verification.json','runtime-verification.json','touch-fallback-verification.json','convergence-verification.json','production-smoke.json']
assert all(json.loads((out/name).read_text()).get('passed') for name in names)
status={'route':'/magnetism/electromagnets','reference':'12_magnetism/06_electromagnets.png','overallGoalComplete':False,'pageAcceptanceComplete':False,'sourceHashes':hashes,'gates':{'typeScriptAndProductionBuild':'passed; build session 3395 terminal exit 0','initialModel36Configurations':'passed','virtualWorkAndEnergy':'passed','independentRK4AndWindingConvergence':'passed','eightViewportInteriorBounds':'passed','nativeSITurnsGapsAndFluxDirections':'passed','CSV17ColumnsAndEnergy':'passed','frameRateInvariantClockAndCleanup':'passed','touchAndWebGLFallback':'passed','normalProductionSmoke':'passed','repositoryPhysicsCatalog':'581/581 passed'},'visual':json.loads((out/'visual-comparison.json').read_text()),'limitations':['Photographic material, lighting and composition fidelity remain open; diagnostics are slightly worse than old static baseline.','Corrected U-core/two-gap armature geometry differs from ambiguous reference poles.','Illustrative non-hysteretic constitutive law; no material calibration, leakage, fringing, eddy currents or temperature model.','Fixed-gap fixture does not model freely lifting or falling armature.','Winding length omits lead/crossover length; fallback winding is schematic.','Large app bundle and PWA precache remain open (1263 entries, 327006.97 KiB).']}
(out/'verification-status.json').write_text(json.dumps(status,indent=2),encoding='utf-8')
p=Path('docs/studio-rebuild/73-electromagnets.md');s=p.read_text(encoding='utf-8-sig');s+='''

## Native verification checkpoint — 2026-10-17

Full browser verification now passes eight viewports with interior bounds checks, actual native turn counts and pole gaps, flux directions, all five zooms, lab theme/fullscreen, prediction, keyboard mode navigation, 17-column CSV parsing, blank unknown steady energy history, transient energy balance, record persistence/clear and a graded configuration challenge. Repeated SPA navigation disposes seven native renderer instances and 917 tracked scene resources (PMREM/environment cleanup is separate from that tracked count).

Controlled 10/30/60 fps playback agrees at one wall second: model time 0.101837234799 s, current 1.939412228751 A and gap field 0.373174754725 T. Pause adds zero render frames. Repeated hidden-frame advances, automatic stop, replay and route-unmount clock removal pass. The hidden-frame guard was added after reviewing the clock logic. Real CDP touch gap changes and touch play/pause pass; calculated no-WebGL geometry, all zooms and zero-current flux visibility pass. Independent winding polygon convergence and nonlinear transient quadrature convergence pass. The initial 8192-segment winding test was too coarse for the smallest corner radius; refinement to 32768 segments proves the specified error bound without changing the model.

Production build session 3395 exited 0; Vite finished in 27.31 s and PWA generated 1263 precache entries (327006.97 KiB). Normal unmasked production smoke on owned port 4199 exited 0, testing keyboard turns, six rapid pause/resume cycles, CSV energy, theme, zoom and desktop/breakpoint/mobile interior bounds. The first keyboard assertion raced React rendering; the verifier now waits for the numeric input to reflect the actual change. Repository physics tests: 581/581 passed. Four source hashes are saved and checked against current files.

Screenshot diagnostics excluding the preserved sidebar: baseline MAE 31.863 / SSIM 0.4934; native MAE 33.018 / SSIM 0.4916. This is not an improvement in those global metrics. Regional comparisons, difference image, responsive contact sheet and visible electrical-startup evidence are saved. Visual fidelity remains open: material/lighting/background and corrected apparatus composition differ substantially. No percentage-completion claim is made. Source sidebar markup equals HEAD.

The earlier open verification list is superseded for the gates described above; full visual acceptance and empirical material calibration remain unproven. See `verification-status.json` for current limitations. No claim that all 102 reference pages are complete.
''';p.write_text(s,encoding='utf-8');(out/'report.md').write_text(s,encoding='utf-8')
p=Path('artifacts/physics-studio-audit/completion-matrix.md');s=p.read_text(encoding='utf-8-sig').replace('eight-size interior bounds, native geometry/CSV/runtime/touch/fallback checks pass; production verification pending | Native rebuild; visual fidelity and production gate open','eight-size interior bounds, native geometry/CSV/runtime/touch/fallback checks, final build and normal production pass | Native rebuild; visual fidelity and real-material refinement open');p.write_text(s,encoding='utf-8')
checkpoint='''

## Electromagnets native verification checkpoint — 2026-10-17

Route `/magnetism/electromagnets` now uses the four reference modes with original native apparatus and preserved sidebar. Model/energy/virtual-work/RK4/winding convergence, eight-layout interior bounds, 17-column CSV, native SI geometry, 10/30/60 fps playback, hidden/pause/end/replay/unmount behavior, real touch, no-WebGL fallback, final production build and normal production smoke pass. Seven renderer instances and 917 tracked scene resources were disposed across navigation. Repository physics catalog: 581/581 passed. Build session 3395 terminal 0; production port 4199 smoke terminal 0. Source hashes checked.

Sidebar-excluded MAE/SSIM: baseline 31.863/0.4934 → native 33.018/0.4916. These metrics do not show visual improvement; photographic fidelity remains open. Corrected two-gap fixed-armature geometry, illustrative material law, omitted fringing/leakage/hysteresis/thermal effects and the large PWA bundle remain limitations. Initial verification gaps listed in the earlier checkpoint are superseded by the specific gates above. See `electromagnets/report.md`, `verification-status.json` and raw verification files. Full repository goal remains incomplete.
'''
for name in ['ui-audit.md','physics-audit.md','functional-audit.md','test-results.md','performance-report.md','unresolved-issues.md','final-summary.md','studio-inventory.md']:
 p=Path('artifacts/physics-studio-audit')/name;p.write_text(p.read_text(encoding='utf-8-sig')+checkpoint,encoding='utf-8')
print('Electromagnet checkpoint, hashes and eight reports recorded; overall goal incomplete.')
