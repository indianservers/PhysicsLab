import { runBenchmarkCases } from "../shared/validation";

export const C = 299_792_458;
export const H = 6.626_070_15e-34;
export const EV = 1.602_176_634e-19;

export type MediumId = "vacuum" | "air" | "water" | "glass";

export const media = {
  vacuum: { label: "Vacuum", refractiveIndex: 1 },
  air: { label: "Air", refractiveIndex: 1.0003 },
  water: { label: "Water", refractiveIndex: 1.333 },
  glass: { label: "Glass", refractiveIndex: 1.5 },
} as const;

export const bands = [
  {
    id: "radio",
    label: "Radio",
    minHz: 1e3,
    maxHz: 3e8,
    color: "#70a7ff",
    use: "broadcasting and navigation",
    hazard: "Usually non-ionising; strong fields can heat tissue.",
  },
  {
    id: "microwave",
    label: "Microwave",
    minHz: 3e8,
    maxHz: 3e11,
    color: "#ff9c55",
    use: "Wi-Fi, radar and cooking",
    hazard: "Non-ionising; intense exposure causes heating.",
  },
  {
    id: "infrared",
    label: "Infrared",
    minHz: 3e11,
    maxHz: 4e14,
    color: "#ff6c64",
    use: "thermal imaging and remote controls",
    hazard: "Strong sources can heat skin and damage eyes.",
  },
  {
    id: "visible",
    label: "Visible",
    minHz: 4e14,
    maxHz: 7.5e14,
    color: "#66d9ba",
    use: "vision, imaging and fibre optics",
    hazard: "Bright lasers can damage the retina.",
  },
  {
    id: "ultraviolet",
    label: "Ultraviolet",
    minHz: 7.5e14,
    maxHz: 3e16,
    color: "#a58aff",
    use: "sterilisation and fluorescence",
    hazard: "Can damage cells, skin and eyes.",
  },
  {
    id: "xray",
    label: "X-ray",
    minHz: 3e16,
    maxHz: 3e19,
    color: "#65c7ff",
    use: "medical and security imaging",
    hazard: "Ionising; dose must be limited.",
  },
  {
    id: "gamma",
    label: "Gamma",
    minHz: 3e19,
    maxHz: Number.POSITIVE_INFINITY,
    color: "#db7cff",
    use: "radiotherapy and sterilisation",
    hazard: "Highly penetrating ionising radiation.",
  },
] as const;

export type BandId = (typeof bands)[number]["id"];

export function bandForFrequency(frequencyHz: number) {
  if (!Number.isFinite(frequencyHz) || frequencyHz <= 0)
    throw new RangeError("Frequency must be positive.");
  return (
    bands.find(
      (band) => frequencyHz >= band.minHz && frequencyHz < band.maxHz,
    ) ?? bands[bands.length - 1]
  );
}

export function solveSpectrum(frequencyHz: number, medium: MediumId) {
  if (!Number.isFinite(frequencyHz) || frequencyHz <= 0)
    throw new RangeError("Frequency must be positive.");
  const refractiveIndex = media[medium].refractiveIndex;
  const speedMps = C / refractiveIndex;
  const wavelengthM = speedMps / frequencyHz;
  const photonEnergyJ = H * frequencyHz;
  return {
    frequencyHz,
    refractiveIndex,
    speedMps,
    wavelengthM,
    photonEnergyJ,
    photonEnergyEv: photonEnergyJ / EV,
    band: bandForFrequency(frequencyHz),
  };
}

export function representativeFrequency(id: BandId) {
  const band = bands.find((entry) => entry.id === id)!;
  const upper = Number.isFinite(band.maxHz) ? band.maxHz : 1e21;
  return Math.sqrt(band.minHz * upper);
}

export const emSpectrumBenchmarks = runBenchmarkCases([
  {
    id: "vacuum-speed",
    name: "Vacuum speed is exact c",
    input: { f: 2.45e9 },
    expected: C,
    unit: "m/s",
    tolerance: 0,
    actual: ({ f }) => solveSpectrum(Number(f), "vacuum").speedMps,
  },
  {
    id: "frequency-wavelength",
    name: "c equals frequency times wavelength",
    input: { f: 5.5e14 },
    expected: C,
    unit: "m/s",
    tolerance: 1e-7,
    actual: ({ f }) => {
      const r = solveSpectrum(Number(f), "vacuum");
      return r.frequencyHz * r.wavelengthM;
    },
  },
  {
    id: "photon-energy",
    name: "Photon energy follows Planck relation",
    input: { f: 5.5e14 },
    expected: H * 5.5e14,
    unit: "J",
    tolerance: 1e-30,
    actual: ({ f }) => solveSpectrum(Number(f), "vacuum").photonEnergyJ,
  },
  {
    id: "visible-band",
    name: "550 THz lies in visible band",
    input: { f: 5.5e14 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: ({ f }) => Number(bandForFrequency(Number(f)).id === "visible"),
  },
  {
    id: "medium-frequency",
    name: "Frequency stays fixed in a medium",
    input: { f: 3e14 },
    expected: 3e14,
    unit: "Hz",
    tolerance: 0,
    actual: ({ f }) => solveSpectrum(Number(f), "water").frequencyHz,
  },
  {
    id: "water-wavelength",
    name: "Water wavelength contracts by refractive index",
    input: { f: 3e14 },
    expected: C / 1.333 / 3e14,
    unit: "m",
    tolerance: 1e-12,
    actual: ({ f }) => solveSpectrum(Number(f), "water").wavelengthM,
  },
]);
