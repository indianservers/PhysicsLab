# UI audit: current state

The 102 mapped reference pages have captures at their exact target dimensions. Their native learning modes have been inspected; no extra Guide/Quiz/Coach/3D tab labels were found in the mapped-page sweep. The shared floating Studio tools dock is disabled on dedicated reference pages. Relevant Code/Formula and graph controls shown in the Mastery mockup are retained.

Work and Gravitational Field were rebuilt in this pass. Work has procedural apparatus, synchronized force components, displacement and work. Field has the three views named in its reference, generated inward vectors, equipotentials, an analytic orbit and a model-driven logarithmic graph. Existing left navigation was preserved.

Six dedicated lab links are available for each of the sixteen subject home pages. These replace incomplete and mixed cross-subject shortcut lists.

reference-captures/ contains baseline captures, reference-diffs/ contains amplified differences, and visual-comparison.json records MAE and SSIM. Main-region comparison excludes automatically detected target sidebar columns and current main/sidebar bounds, then aligns region widths. Border detection and image comparisons still need visual inspection. Metrics are not acceptance percentages. completion-matrix.md leaves all visual review/refinement gates open.

No reference screenshot regions were inserted into the rebuilt components. Work uses native SVG. Field combines independent existing Earth/starfield assets with native vectors and geometry. Source checks are continuing for remaining assets.

## Standing Waves checkpoint — 2026-10-17

Standing Waves now matches the reference panel arrangement and primary vertical bounds, with original native string apparatus and four learning modes. Deterministic comparison and remaining PBR/typography differences are in standing-waves/report.md. No screenshot assets inserted; sidebar JSX preserved. Visual acceptance remains open.

## Sound Spectrum checkpoint — 2026-10-17

Sound Spectrum now recreates the reference breadcrumb/modes, apparatus with three source cards, three right plots, three lower cards and transport. Original native geometry/procedural materials/icons; no cropped assets. Sidebar retained. Adaptive graph widths preserve phone labels; tablet zoom wraps. Evidence and remaining material/lighting/typography differences in sound-spectrum/.

## Doppler Effect checkpoint — 2026-10-17

Doppler Effect now has the reference header/modes, native siren/cart/microphone/track, right controls, lower graph/readings/formula and medium footer. Existing sidebar retained, no reference crops. Phone captions/note no longer overlap, and air fronts are not rendered below the bench. Frozen screenshots and region comparisons in doppler-effect/. Material/lighting/hardware detail and typography remain open.

## Reflection checkpoint — 2026-10-17

Reflection now recreates the reference primary apparatus, right controls/readings/law, transport, independent side view, mirror-frame diagram and calculated data table. Original procedural geometry/textures only; sidebar retained. Fixed clipped Ray Count and controlled environment glare. Main impact/protractor centres coincide and rays use true selected angles. Native material/lighting/detail/type refinement remains open; evidence in reflection/.


## Refraction checkpoint — 2026-10-17

Reference header, four learning modes, full-width bench, overlaid controls, three lower cards and transport rebuilt. Sidebar preserved; no cropped assets. Six screenshots and sidebar-excluded comparison saved. MAE 16.093, SSIM 0.6354. Materials, lighting, fine apparatus detail, arcs and typography remain open.


## Lenses checkpoint — 2026-10-17

Lenses now follows its reference layout: four learning modes, native bench, ray toggles, image properties, three lens cards, inspector/equations and transport. Sidebar unchanged; no cropped assets. Six sizes captured. MAE 19.218, SSIM 0.6057, with sidebar excluded and main width normalized. Material/lighting, hardware detail, typography and illustrated-scale differences remain open.


## Curved Mirrors checkpoint — 2026-10-17

Curved Mirrors now follows the reference header/four-mode/scene/parameter/lower-card/transport structure, using original native apparatus. Sidebar JSX preserved. Light controls relocated into the main scene to honor that exception. Real-image placement corrects the contradictory mockup. Six responsive sizes captured; MAE 20.169, SSIM 0.5567. Material, lighting, hardware and typography refinement remains open.


## Interference checkpoint — 2026-10-17

Interference now uses its reference header, four learning modes, three scene views, native apparatus, three lower parameter controls/presets, right readings/profile/equations and transport. The original sidebar JSX is unchanged. No screenshot pixels or reflection photograph are application assets. Six viewport screenshots show no horizontal overflow or clipped formula content. Camera framing, original PBR materials and instrument details still differ from the photograph. Sidebar-excluded, width-normalized MAE 18.308, SSIM 0.5491; these are diagnostics, not completion percentages.


## Diffraction checkpoint - 2026-10-17

Diffraction now follows its reference-specific layout: breadcrumb/four learning modes, a large native apparatus, right aperture selection/profile/readings, and lower aperture close-up, controls, equation and 3D camera preview. Top/Side/Front are explicitly present in the mockup and retained as working camera controls. The existing sidebar JSX is unchanged. No screenshot crops or reflection photograph are used. Six sizes have no horizontal overflow or clipped cards, and desktop transport fits. Sidebar-excluded, width-normalized MAE 19.949, SSIM 0.5723; these are diagnostics, not acceptance percentages. Photographic material/background realism, apparatus composition and detailed typography remain open.


## Coulomb Force checkpoint - 2026-10-17

Coulomb Force now follows the reference header/four-mode, native apparatus, right controls/readings/equation/log graph and bottom transport layout. Sidebar JSX is unchanged; the reflection photograph is removed. Original spheres, supports, perforated table, ruler and calculated overlays replace the placeholder. Page-scoped rules correct the competing global gutter and an intrinsic grid-height issue that overlapped scene and toolbar on short desktops. Six viewport sizes now have no horizontal overflow, clipped cards or scene/transport overlap. Sidebar-excluded width-normalized MAE 20.01, SSIM 0.5446; these are diagnostic measurements, not completion percentages. Photographic background, sphere/support material detail, fine hardware and typography remain open.


## Electric Field checkpoint - 2026-10-17

Electric Field now follows its reference-specific header/four-mode, projected field/grid, source XYZ, probe XYZ, vector toggle, density, net/contribution readings, equation/definitions and transport layout. Original native spheres/glows, probe/vector, grid and integrated field curves replace control-independent SVG Bezier curves. Sidebar JSX is unchanged and no reference pixels are application assets. Original SVG panel icons replace unrelated text glyphs. Six sizes have no horizontal overflow, clipped cards or scene/transport overlap; desktop transport fits. Sidebar-excluded, width-normalized MAE 14.572, SSIM 0.5988; these are diagnostics, not acceptance percentages. Glow/material detail, curve rendering, typography and composition remain open. Correct metric positions, a consistent 0.5 m scale and calculated probe direction intentionally differ from inconsistent mockup artwork.

## Electric Potential checkpoint - 2026-10-17

Replaced the decorative SVG with a calculated native potential mesh, source/probe markers, base contours, grid and voltage axis. Rebuilt controls, readings, equations, four reference learning modes and transport; sidebar JSX preserved. Main-region MAE 24.214 / SSIM 0.5268 versus old 20.398 / 0.5805: both global metrics are worse. No visual completion claim. Camera/color/contour/glyph/typography and mobile overlay refinement remain open. Six after screenshots, reference comparison and difference are saved in `electric-potential/`.

## Electric Potential visual refinement - 2026-10-17

Refined native framing, sign-colored contours, source projections and grid walls; expanded the plot to +/-100 kV so default peaks are not flattened. Matched header mode widths, original SVG controls, source/control spacing, scientific energy and larger display equations more closely. Numeric XY controls remain under Experiment. Added functional local light/dark view. Small-screen framing keeps source glyphs below the legend/layers; sidebar source and header/nav pixels remain unchanged within one channel level. Main-region MAE 19.224 / SSIM 0.5299, versus prior native 24.214 / 0.5268: both metrics improved versus the prior native checkpoint; SSIM remains below the static baseline and visual acceptance remains open.
