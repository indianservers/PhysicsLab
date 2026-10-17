# Electromagnetic Induction original assets

No reference image, scene crop, instrument crop or icon crop is used by the application.

- `src/components/InductionBench.tsx`: original Three.js rail/drive, moving red/blue magnet and letter textures, representative copper winding, bobbin/stands, ruler, leads and galvanometer. The calibrated dial is a locally generated canvas texture; its native needle uses the calculated current. Table texture is seeded; the original chalkboard is decorative and labelled Reference sketch. It does not impersonate a live field display.
- `src/pages/InductionStudioPage.tsx`: original SVG speed/coil/direction icons, calculated flux/emf graphs, qualitative induced-field diagram and native controls.
- `src/lib/inductionStudio.ts`: SI dipole/coil flux and derivative, prescribed bounded trajectory, Faraday/Lenz/circuit/force-power state and graduated control mappings.

The WebGL fallback reconstructs magnet/coil positions and pole labels in SVG and retains supported zoom/placement/controls. All geometry, materials, textures, environment and renderer are cleaned up on route exit. No external asset licensing is needed for these generated visuals. Native materials, lighting and apparatus finish remain visually different from the reference.
