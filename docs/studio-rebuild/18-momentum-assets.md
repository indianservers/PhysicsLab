# Momentum cart asset provenance

Built-in image_gen.imagegen was used for all generation and edits. Both final cutouts were inspected, confirmed RGBA, and copied without pixel changes into the workspace. SVG frames and positions the sprites; all bumpers, rulers, forces, arrows and UI remain code-driven.

Final assets: public/assets/momentum-collisions/blue-cart.png (1586×992, 1,228,402 bytes) and red-cart.png (1596×985, 1,320,018 bytes).

Source folder: C:/Users/saisa/.codex/generated_images/01a07335-84ef-78b2-bcb9-d2e500ff94cb/.

Sequence: initial blue exec-5742755a-9f73-4470-a396-507ea8540934.png; compact revision exec-365b8963-c4e9-479a-96d2-4c6274900b18.png (painted checkerboard rejected); final blue alpha extraction exec-02682967-32d5-4d21-82d2-ee765e4b82a8.png; red variant exec-16ec7da1-a2a8-49d9-8dce-628dca513851.png (painted checkerboard rejected); final red alpha extraction exec-cb19babe-8437-4f5f-b5cd-6c583e9ee21a.png.

### momentumCartPrompt

Use case: scientific-educational. Asset type: transparent cart-body sprite for an interactive physics air-track simulation. Create one photorealistic compact blue laboratory dynamics cart, isolated on genuine transparent alpha. Nearly straight-on side elevation, orthographic long-lens, only a narrow strip of its top visible and a tiny right end face. Horizontal rectangular cobalt-blue anodized chassis with realistic glossy highlights, black metal end plates, small silver screw heads, two small black wheels barely protruding below, one thin vertical stainless steel peg rising from the centre of the top. Chassis width approximately 2.6 times its height; total silhouette including peg/wheels about 1.7 times as wide as tall. Precise machined laboratory apparatus, polished blue paint, detailed dark brushed metal, subtle edge wear. Cool neutral studio lighting from upper left, no strong perspective, no ground or cast shadow outside the object. Centre the whole cart tightly in a landscape canvas with minimal transparent margins. Do not include track, ruler, background, floor, bumpers, spring, labels, text, numbers, logos, arrows, extra objects, or UI. The front broad blue face must be clean and uninterrupted. Keep all hardware neutral black/silver.

### momentumCartEditPrompt

Edit this cart cutout only: make the chassis more compact and taller, with its full width exactly about 2.6 times the blue body height (currently it is much too long and flat). Preserve the photorealistic cobalt-blue anodized metal, black end plates, silver screws, two small wheels and central thin steel peg. Reduce the peg height slightly so the total cart silhouette is about 1.6 times as wide as tall. Straight side elevation with a slim top surface visible. Genuine transparent alpha, tightly framed whole cart with minimal margins. No track, ground, shadows outside the object, bumpers, text, logos, arrows, or UI.

### momentumCartAlphaPrompt

Background extraction only. Remove the entire pale gray/white checkerboard background from this cart image and output a genuine RGBA PNG with fully transparent alpha outside the cart. The checkerboard must not be painted into the output. Keep exactly the same cart, shape, compact proportions, blue color, metal materials, central peg and wheels. No other changes, no ground shadow, no new backdrop.

### momentumCartRedPrompt

Change only the blue anodized chassis color to vivid red. Preserve this exact compact laboratory cart silhouette, position, size, camera, machined texture, gloss, black end plates, silver hardware, peg and wheels. Preserve genuine transparent alpha outside the object, no painted checkerboard or backdrop. No text or extra objects.

### momentumCartRedAlphaPrompt

Background extraction only. Remove the entire pale gray/white checkerboard background from this red cart image and output a genuine RGBA PNG with fully transparent alpha outside the cart. The checkerboard must not be painted into the output. Keep exactly the same red cart, shape, compact proportions, materials, central peg and wheels. No other changes, no ground shadow, no new backdrop.
