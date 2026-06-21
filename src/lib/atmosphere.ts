export type AtmosphereVisual = "balloon" | "plane" | "rocket" | "meteor" | "aurora" | "satellite" | "shuttle" | "radiosonde";

export interface AtmosphereLayer {
  id: string;
  name: string;
  altitude: string;
  temperature: string;
  rangeKm: [number, number];
  color: string;
  visual: AtmosphereVisual;
  summary: string;
  science: string;
  features: string[];
  examples: string[];
}

export const atmosphereLayers: AtmosphereLayer[] = [
  {
    id: "troposphere",
    name: "Troposphere",
    altitude: "0 to 12-18 km",
    temperature: "15 to -56.5 C",
    rangeKm: [0, 18],
    color: "#38bdf8",
    visual: "plane",
    summary: "Weather, clouds, passenger aircraft, and most breathable air live in this lowest layer.",
    science: "Air pressure and density drop rapidly with height. Temperature usually decreases upward because the ground warms the air from below.",
    features: ["weather", "clouds", "water vapour", "jet streams"],
    examples: ["Passenger plane", "Hot air balloon", "Mountains", "Storm clouds"],
  },
  {
    id: "stratosphere",
    name: "Stratosphere",
    altitude: "12-18 to 50 km",
    temperature: "-56.5 to -2.5 C",
    rangeKm: [18, 50],
    color: "#22d3ee",
    visual: "rocket",
    summary: "Stable air and the ozone layer make this region crucial for absorbing ultraviolet radiation.",
    science: "Temperature rises with altitude because ozone absorbs high-energy ultraviolet light and converts it to thermal energy.",
    features: ["ozone layer", "stable air", "UV absorption", "weather balloons"],
    examples: ["Meteorological rocket", "Radiosonde", "Ozone shield"],
  },
  {
    id: "mesosphere",
    name: "Mesosphere",
    altitude: "50 to 80-90 km",
    temperature: "-2.5 to -86.5 C",
    rangeKm: [50, 90],
    color: "#818cf8",
    visual: "meteor",
    summary: "Meteors burn here as thin air still provides enough drag to heat incoming debris.",
    science: "This is the coldest atmospheric layer. Density is low, but high-speed meteoroids collide with enough molecules to glow and break apart.",
    features: ["meteor trails", "coldest layer", "noctilucent clouds"],
    examples: ["Meteors", "Upper-atmosphere waves"],
  },
  {
    id: "thermosphere",
    name: "Thermosphere",
    altitude: "80-90 to 800 km",
    temperature: "-86.5 to 1200 C",
    rangeKm: [90, 800],
    color: "#a78bfa",
    visual: "aurora",
    summary: "Auroras and many low-Earth-orbit spacecraft occur in extremely thin but energetic air.",
    science: "Solar radiation ionizes atoms and molecules. Individual particles have high kinetic energy, so temperature is high even though the gas is very sparse.",
    features: ["aurora", "ionosphere", "ISS region", "radio propagation"],
    examples: ["Aurora", "Low Earth orbit satellite", "Space station"],
  },
  {
    id: "exosphere",
    name: "Exosphere",
    altitude: "800 to 3000+ km",
    temperature: "up to about 1200 C",
    rangeKm: [800, 3000],
    color: "#facc15",
    visual: "satellite",
    summary: "The atmosphere thins into space, where particles can travel long distances before colliding.",
    science: "Hydrogen and helium atoms can follow long ballistic paths. The boundary with space is gradual, not a hard shell.",
    features: ["outer atmosphere", "satellites", "escape paths", "very low density"],
    examples: ["Satellites", "Spacecraft", "Escaping atoms"],
  },
];

export const atmosphereStats = {
  layers: atmosphereLayers.length,
  maxAltitudeKm: Math.max(...atmosphereLayers.map((layer) => layer.rangeKm[1])),
  examples: atmosphereLayers.reduce((count, layer) => count + layer.examples.length, 0),
};
