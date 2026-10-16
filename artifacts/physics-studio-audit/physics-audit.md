# Physics verification

The existing suite passed 581/581 numerical reference and source-policy tests. This is not independent certification of every studio. Its validation metadata covers 81 experiments, whereas the browser catalogue contains 92 entries; coverage reconciliation remains open.

Work: the new apparatus and live output use the existing constant-force model W = Fd cos θ. Six analytical cases test parallel/perpendicular forces, zero force, zero distance, and an oblique force; component magnitudes satisfy Fx² + Fy² = F². Playback prescribes displacement at 0.5 m/s and recalculates work from that distance. It does not model acceleration or net work. See [OpenStax: Work](https://openstax.org/books/university-physics-volume-1/pages/7-1-work).

Field: g = GM/r² and Φ = −GM/r drive the vectors, readings and graph. The test confirms the default numerical value, quarter field at double radius, changed graph at changed mass, inward directions, density changes and synchronized probe playback. The circular trajectory has angular speed √(GM/r³); elapsed simulation time advances at 1000 s per real second. The central planet is a visual marker; the model is a point source and does not model Earth's interior. Arrow lengths use a logarithmic display scale. See [OpenStax: gravitational field](https://openstax.org/books/university-physics-volume-1/pages/13-2-gravitation-near-earths-surface) and [circular orbits](https://openstax.org/books/university-physics-volume-1/pages/13-4-satellite-orbits-and-energy).

The field reference gives 9.22 m/s² for M=5.97e24 kg and r=2.08e7 m, whereas GM/r² is approximately 0.921 m/s². The app retains the correct computation. Its right-side probe has consistent positive-x position and an inward 180° field direction; the reference's negative-x label is inconsistent with that placement.

Raw new-page evidence: work/verification.json and gravitational-field/verification.json. Remaining models, invariants and numerical convergence checks are not recertified by this pass.
