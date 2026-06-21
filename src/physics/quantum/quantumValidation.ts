import { QuantumSimulationId } from "./quantumLabData";

export const quantumValidationNotes: Record<QuantumSimulationId, string[]> = {
  photoelectric: [
    "Photon energy is calculated from h f and converted to eV.",
    "No emission is shown when photon energy is below work function.",
    "Relative current depends on intensity only after emission begins.",
  ],
  tunneling: [
    "For E < V0, transmission uses T approximately exp(-2 kappa L).",
    "eV and nm are converted to joules and meters before kappa is computed.",
    "The chart remains conceptual; probability values are bounded for classroom readability.",
  ],
  bohr: [
    "Hydrogen energy levels use -13.6/n^2 eV.",
    "Emission is allowed only from higher n to lower n.",
    "Wavelength uses hc/Delta E through shared constants.",
  ],
};
