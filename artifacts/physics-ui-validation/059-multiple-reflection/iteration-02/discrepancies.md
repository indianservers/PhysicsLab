# Lesson 059 visual comparison — iteration 02

- Matched the reference's warm instrument layout, numbered controls, large triangular chamber, staged virtual images, right circular kaleidoscope view/readings/challenge, and lower prediction/formula/preset strip.
- Replaced the deferred GLB with a generated 1254×1254 true-alpha triangular mirror frame, eyepiece and colored glass pieces. All mirror lines, images, rays, angle markers and pattern repetitions remain live SVG state.
- Preserved the application shell instead of reproducing the mockup's standalone navigation.
- Implemented the conditional school-level image-count rule rather than presenting N=360°/θ−1 as universal. Exact odd quotients distinguish centered and off-axis objects; non-integral quotients use floor(360°/θ).
- Browser checks confirmed the 40° boundary gives 8 centered images and 9 off-axis images; the 45° mission gives exactly 7.
- The two-mirror image count is explicitly labelled when the third mirror is enabled, because a three-mirror chamber creates an extended tiling rather than the same finite pair count.
- Verified 1440×900, 820×1180 and 390×844. The document has no horizontal overflow, the alpha asset loads at natural width, and no broken images or alert states remain.
