export const atomicDefaults = { separation: 3.8, sigma: 3.4, epsilon: 10 };
export function atomicInteraction(separation: number, sigma: number, epsilon: number) {
  const ratio6 = (sigma / separation) ** 6;
  const potential = 4 * epsilon * (ratio6 ** 2 - ratio6);
  const force = 24 * epsilon / separation * (2 * ratio6 ** 2 - ratio6);
  const equilibrium = 2 ** (1 / 6) * sigma;
  const balanced = Math.abs(separation - equilibrium) < 1e-6;
  return { potential, force: balanced ? 0 : force, equilibrium, interaction: balanced ? "Balanced" : force > 0 ? "Repulsive" : "Attractive" };
}
