import { ExperimentDefinition } from "../types";

const mistakeLibrary: Record<string, string[]> = {
  "projectile-motion": [
    "Confusing horizontal and vertical motion.",
    "Using degrees directly inside radian formulas.",
    "Assuming velocity is zero at the highest point instead of vertical velocity only.",
  ],
  "newton-s-second-law": [
    "Doubling mass and expecting acceleration to double.",
    "Forgetting that acceleration depends on net force.",
    "Using weight as mass.",
  ],
  "ohms-law": [
    "Confusing voltage and current.",
    "Forgetting resistance unit.",
    "Using Ohm's law for non-ohmic devices.",
  ],
  "lens-formula": ["Ignoring sign convention.", "Mixing focal length units.", "Forgetting image can be virtual."],
  "mirror-formula": ["Ignoring sign convention.", "Measuring distances from the wrong reference point.", "Confusing real and virtual images."],
  "glass-slab-refraction": ["Measuring angle from the surface instead of the normal.", "Assuming all colors refract equally."],
  "prism-dispersion": ["Measuring angle from the prism surface.", "Confusing deviation with dispersion."],
};

export function commonMistakesForExperiment(experiment: ExperimentDefinition) {
  const categoryMistakes = categoryMistakesFor(experiment.category);
  return [...new Set([...(mistakeLibrary[experiment.id] ?? []), ...experiment.commonMistakes, ...categoryMistakes])].slice(0, 8);
}

function categoryMistakesFor(category: string) {
  if (category === "Optics") return ["Angles in ray diagrams are measured from the normal unless stated otherwise."];
  if (category === "Electricity") return ["Check units before substituting: V, A, ohm, W, J."];
  if (category === "Waves") return ["Do not confuse amplitude with wavelength or frequency."];
  if (category === "Thermodynamics") return ["Use Kelvin for gas laws and absolute-temperature formulas."];
  if (category === "Fluid Mechanics") return ["Pressure and force are different quantities; area matters."];
  return ["Changing several variables at once makes the cause of the result unclear."];
}
