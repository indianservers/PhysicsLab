export interface PhysicsConstant {
  symbol: string;
  name: string;
  value: number;
  unit: string;
  reference: string;
}

const codata2022 = "CODATA 2022 / SI exact where defined";

export const physicsConstants = {
  c: { symbol: "c", name: "speed of light in vacuum", value: 299_792_458, unit: "m/s", reference: "SI exact" },
  h: { symbol: "h", name: "Planck constant", value: 6.626_070_15e-34, unit: "J s", reference: "SI exact" },
  hbar: { symbol: "hbar", name: "reduced Planck constant", value: 1.054_571_817e-34, unit: "J s", reference: codata2022 },
  e: { symbol: "e", name: "elementary charge", value: 1.602_176_634e-19, unit: "C", reference: "SI exact" },
  G: { symbol: "G", name: "Newtonian gravitational constant", value: 6.674_30e-11, unit: "m^3 kg^-1 s^-2", reference: codata2022 },
  g: { symbol: "g", name: "standard gravity", value: 9.806_65, unit: "m/s^2", reference: "NIST standard gravity" },
  k: { symbol: "k", name: "Boltzmann constant", value: 1.380_649e-23, unit: "J/K", reference: "SI exact" },
  R: { symbol: "R", name: "molar gas constant", value: 8.314_462_618_153_24, unit: "J mol^-1 K^-1", reference: "Derived from exact constants" },
  NA: { symbol: "N_A", name: "Avogadro constant", value: 6.022_140_76e23, unit: "mol^-1", reference: "SI exact" },
  epsilon0: { symbol: "epsilon_0", name: "vacuum permittivity", value: 8.854_187_8128e-12, unit: "F/m", reference: codata2022 },
  mu0: { symbol: "mu_0", name: "vacuum permeability", value: 1.256_637_062_12e-6, unit: "N/A^2", reference: codata2022 },
  sigma: { symbol: "sigma", name: "Stefan-Boltzmann constant", value: 5.670_374_419e-8, unit: "W m^-2 K^-4", reference: "SI exact derived" },
  electronMass: { symbol: "m_e", name: "electron mass", value: 9.109_383_7139e-31, unit: "kg", reference: codata2022 },
  protonMass: { symbol: "m_p", name: "proton mass", value: 1.672_621_925_95e-27, unit: "kg", reference: codata2022 },
  neutronMass: { symbol: "m_n", name: "neutron mass", value: 1.674_927_500_56e-27, unit: "kg", reference: codata2022 },
} satisfies Record<string, PhysicsConstant>;

export type PhysicsConstantKey = keyof typeof physicsConstants;
