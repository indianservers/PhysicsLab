# Test results

- npm run build: PASS, including TypeScript, Vite and service-worker generation. build.log contains output. A large chunk warning remains.
- npm run test:physics: 581/581 existing checks PASS.
- npm run test:concepts: 16/16 existing checks PASS.
- auditLabTabs.mjs: 92/92 routes PASS.
- auditStudioNavigation.mjs: 16/16 subject homes PASS, including 96 dedicated links at desktop/mobile widths.
- auditAstronomyNavigation.mjs: 38/38 concepts PASS.
- auditLesson3D.mjs --resume: 763 passing entries; 650 reused and 113 rechecked during this pass. Full logs and JSON checkpoints are saved.
- testWorkStudio.mjs: PASS, including analytical cases, synchronized SVG geometry, learning modes, playback, reset, zoom and four viewport/overlap checks.
- testGravitationalFieldStudio.mjs: PASS, including numerical default, inverse-square sensitivity, density/direction, graph updates, three views, playback, prediction, reset and four widths.
- captureReferencePages.mjs: 102/102 matching-size captures.
- compareReferencePages.py: 102/102 measured comparisons. This does not establish visual acceptance.
- Initial feature matching: 49 image/reference pairs, no flagged shared-image regions. SVG-image coverage is being added. Feature matching is not proof of provenance.

Initial shared-page browser runs terminated and were resumed with fresh pages. Initial screenshots used a default viewport; those were replaced with correctly sized captures. One heading wait assumed h1; it was corrected to support pages whose reference uses an h2 heading.
