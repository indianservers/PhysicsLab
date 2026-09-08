# Thermodynamics Temperature

- Mockup: `14_thermodynamics/01_temperature.png`
- Route: `/thermodynamics/temperature`
- Status: VERIFIED

Implemented hot and cold gas chambers with temperature and particle-count controls; live mean kinetic energies, temperature difference, and equilibrium progress; molecular SVG visualization, kinetic-energy equation, reset, modes, and challenge dialog. Uses `⟨Eₖ⟩ = 3/2 kᵦT`.

Validation: production build succeeds; direct route load passes; defaults produce 1.24 × 10⁻²⁰ J and 4.14 × 10⁻²¹ J with a 400 K difference; changing the cold temperature updates readings and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
