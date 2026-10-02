# Relative Motion assets

Built-in image_gen used. Source originals remain in `C:/Users/saisa/.codex/generated_images/01a07335-84ef-78b2-bcb9-d2e500ff94cb/`.

Selected assets copied unchanged:
- `public/assets/relative-motion/river.png`, 1611x976 RGB, source `exec-9d746ce2-1537-4e16-96cd-434b7a13492a.png`.
- `public/assets/relative-motion/boat.png`, 1024x1536 RGBA, source `exec-67c30a7d-c9ed-482b-baca-7f86dba76115.png`. Metadata confirms alpha0 outside hull, including grey RGB pixels which are fully transparent. Alpha preserved.

The boat refinement `exec-176a8cda-a0a3-4c2a-b4c1-9bb708ecc773.png` was rejected: RGB with painted checkerboard. It is not shipped. The original RGBA cutout is selected; verify compositing in the actual scene.

## Exact river prompt

Use case: scientific-educational. Asset type: realistic aerial background for an interactive river-crossing simulation. Perfectly vertical top-down drone photograph of a wide deep turquoise river flowing horizontally from left to right. Parallel natural river banks run horizontally along the very top and bottom edges. Dark clear teal water occupies the middle 80 percent of the picture, with fine ripples and subtle current streaks, no strong white rapids. The narrow upper and lower banks have grey rocks, lush green shrubs and trees. Straight stretch of river, approximately uniform width. Landscape composition about 1.65:1. Crisp realistic daylight, detailed water texture, rich deep blue-green colours, natural rocky shore. Empty scene: no boats, no people, no bridges, no buildings, no text, no arrows, no markers, no scale bar, no diagram or UI. Keep the central water unobstructed for a dynamic boat and scientific vector overlays.

## Exact boat prompt

Use case: scientific-educational. Asset type: transparent RGBA boat sprite for an interactive overhead river-crossing simulation. Photorealistic small white and dark navy motorboat viewed from perfectly vertical overhead, bow pointing straight upward and stern straight downward. Long narrow pointed bow, white hull rim, dark blue interior, small wood-toned seats and compact windshield, visible small outboard at stern. No people. Entire boat isolated on genuinely transparent alpha, no water, no wake, no floor, no shadow outside the hull, no painted checkerboard. Crisp natural daylight and realistic fine hull detail. Tight portrait framing with small transparent margins, boat silhouette about three times as long as its width. No text, logos, labels, arrows or UI.

## Exact rejected refinement prompt

Remove only the grey glow, shadow and every background pixel outside this boat. Keep the complete white and navy boat, windshield, wood seats and outboard motor exactly as they are, in the same overhead orientation with bow upward. The outside of the hull and motor must be fully transparent alpha with no halo, no grey gradient, no water, no floor, no checkerboard. Crisp clean RGBA cutout edge suitable for compositing onto dark turquoise water. Preserve the boat's photographic realism and colours.

