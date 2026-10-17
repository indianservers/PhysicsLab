from pathlib import Path
import json,hashlib,re
out=Path('artifacts/physics-studio-audit/current-wire')
hashes=json.loads((out/'build-source-hashes.json').read_text(encoding='utf-8-sig'))
assert all(hashlib.sha256(Path(p).read_bytes()).hexdigest()==h for p,h in hashes.items())
# Finalizing waits for the final build/production tool results; this script is prepared now and run only afterward.
checks=['model-verification.json','browser-verification.json','runtime-verification.json','fallback-verification.json','touch-verification.json','production-smoke.json']
for name in checks: assert json.loads((out/name).read_text(encoding='utf-8-sig'))['passed'],name
build=(out/'build.log').read_text(encoding='utf-8-sig');assert 'built in' in build and 'precache' in build and 'files generated' in build
pc=re.search(r'precache\s+(\d+) entries \(([\d.]+) KiB\)',build);assert pc
visual=json.loads((out/'visual-comparison.json').read_text(encoding='utf-8-sig'))
assert visual['sidebarSourceUnchanged']
status={'overallGoalComplete':False,'route':'/magnetism/current-wire','status':'Native rebuild; visual refinement open','gates':{**{name:True for name in checks},'physicsCatalog':{'passed':True,'tests':581,'warnings':80}},'build':{'passed':True,'exitCode':0,'sourceHashesMatch':True,'precacheEntries':int(pc[1]),'precacheKiB':float(pc[2]),'largeBundleWarning':True},'production':json.loads((out/'production-smoke.json').read_text(encoding='utf-8-sig')),'sourceHashes':hashes,'visualMetrics':visual}
(out/'verification-status.json').write_text(json.dumps(status,indent=2),encoding='utf-8')
p=out/'report.md';s=p.read_text(encoding='utf-8');s=s.replace('`build.log` / `production-smoke.json`: final build and production verification pending completion of the current build process. Earlier production run passed but predates the final overlay scheduling fix and is not used as final evidence.',f'`build.log` / `production-smoke.json`: final TypeScript/Vite/PWA build exits successfully; the normal production bundle passes default field, signed current, keyboard slider, zoom, play/pause, independently parsed CSV, record persistence, short-desktop/mobile bounds and four-mode checks with no local console/page/request errors. Final four-file SHA-256 hashes match the build snapshot. PWA precache: {pc[1]} entries / {pc[2]} KiB; large-bundle warning remains.');p.write_text(s,encoding='utf-8')
p=Path('docs/studio-rebuild/70-current-wire.md');s=p.read_text(encoding='utf-8').replace('Native rebuild; visual refinement and final build gate pending.','Native rebuild; all current verification gates pass, visual refinement remains open.');s += '\nFinal TypeScript/Vite/PWA build and normal production checks pass. Direct model, six-size browser/formula bounds, controlled clock, actual touch, WebGL fallback and scoped resource cleanup checks pass. MAE 20.192 / SSIM 0.5995 are diagnostics; apparatus and hand fidelity remain open.\n';p.write_text(s,encoding='utf-8')
p=Path('artifacts/physics-studio-audit/completion-matrix.md');s=p.read_text(encoding='utf-8-sig');s=re.sub(r'^\| 12_magnetism \| current wire \|.*$', '| 12_magnetism | current wire | /magnetism/current-wire | 20.192 | 0.5995 | Native SI field/compass model, 32 configurations/192 states, six-size browser/formula bounds, runtime/touch/fallback/CSV, final build and normal production pass | Native rebuild; visual refinement open |',s,flags=re.M);p.write_text(s,encoding='utf-8')
p=Path('artifacts/physics-studio-audit/reference-tabs.json');items=json.loads(p.read_text(encoding='utf-8-sig'))
for item in items:
 if item.get('route')=='/magnetism/current-wire':
  item['tabs']=[{'text':m,'label':None,'group':'cwr-modes'} for m in ['Observe','Predict','Experiment','Explain']]
  item['assets']=[]
  # Preserve existing inventory keys; current runtime evidence independently asserts no enhancement dock.
  for key in list(item):
   if 'dock' in key.lower(): item[key]=0
p.write_text(json.dumps(items,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
checkpoint='''

## Current-Carrying Wire native rebuild checkpoint

See [Current-Carrying Wire evidence](current-wire/report.md) and [current gate status](current-wire/verification-status.json). Original native wire/compass apparatus and calculated insets replace the flat SVG. Signed SI field, probe position, compass headings, readings and nine-column CSV share state; zero current has no defined needle direction. Play scans the probe at 0.3 rad/s while field lines stay fixed. The original sidebar and only the four reference modes remain. Model (32 configurations / 192 states), six-size browser/formula bounds, controlled runtime, actual touch, fallback and scoped cleanup checks pass. Final TypeScript/Vite/PWA build and normal production checks pass; 581/581 broad catalog checks pass with 80 existing metadata warnings. An intermittent derived-state update-depth warning was corrected by drawing the probe overlay through refs; final long-play/browser runs have no console errors. MAE 20.192 / SSIM 0.5995 improve over baseline, but apparatus finish, hand illustration and other visual differences remain. Full 102-reference / 17-studio completion is not claimed; the goal stays active.
'''
for name in ['studio-inventory.md','ui-audit.md','physics-audit.md','functional-audit.md','test-results.md','performance-report.md','unresolved-issues.md','final-summary.md']:
 p=Path('artifacts/physics-studio-audit')/name;s=p.read_text(encoding='utf-8-sig');assert '## Current-Carrying Wire native rebuild checkpoint' not in s;s+=checkpoint;p.write_text(s,encoding='utf-8')
print(json.dumps({'passed':True,'sourceHashesMatch':True,'overallGoalComplete':False,'precacheEntries':int(pc[1]),'precacheKiB':float(pc[2]),'metrics':visual['after']},indent=2))
