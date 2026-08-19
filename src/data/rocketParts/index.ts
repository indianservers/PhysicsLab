import { rocketPartSeed } from "./catalog.generated";
import type { RocketPart } from "./types";

export type { BuildConfiguration, RocketDifficulty, RocketPart, RocketPartStatus, RocketPosition } from "./types";

const slugify = (value: string) => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const systemFolder: Record<string, string> = {
  "Payload System": "payload", "Structural System": "structures", "Aerodynamic Control": "aero-control",
  "Propulsion System": "propulsion", "Propellant Storage & Feed": "propellant-feed", Avionics: "avionics",
  "Guidance, Navigation & Control": "gnc", "Electrical Power": "electrical", "Communications & Telemetry": "telemetry",
  "Flight Safety": "flight-safety", "Stage Separation": "staging", "Thermal Protection": "thermal",
  "Recovery System": "recovery", "Ground Interface": "ground-interface",
};

const knownImage: Record<string, string> = {
  "payload-fairing": "/pro-lab/vehicle-cutaway.png",
  "rocket-engine": "/pro-lab/powered-ascent.png",
  "fuel-tank": "/pro-lab/propellant-loading.png",
  "flight-computer": "/pro-lab/avionics-checkout.png",
  "launch-platform": "/pro-lab/launch-pad.png",
};

const externalWords = /fairing|nose cone|airframe|fin|canard|strake|boat tail|antenna|heat shield|foam|blanket|parachute|landing leg|beacon|camera|launch rail|flame deflector|strongback|lightning/i;
const interfaceWords = /adapter|fitting|joint|mount|interface|connector|disconnect|coupling|connection|umbilical|separation plane|hold-down/i;
const deployWords = /separation|deployment|deploy|parachute|landing leg|grid fin|fairing|abort|ejector/i;
const advancedWords = /turbopump|preburner|autogenous|flight termination|destruct|star tracker|inertial navigation|control allocation|frangible|pyrotechnic|reefing/i;
const buildWords = /payload|adapter|airframe|tank|engine$|rocket engine|nozzle$|flight computer|imu|battery|power distribution|telemetry transmitter|antenna|fin$|parachute|recovery computer|stage adapter|separation ring/i;

const stageFor = (system: string, name: string) => {
  if (/payload|fairing|crew|spacecraft|cube/i.test(name) || system === "Payload System") return ["Payload section", "Upper stage"];
  if (system === "Ground Interface") return ["Launch complex"];
  if (system === "Recovery System") return ["Recovery module", "Reusable stage"];
  if (/engine|aft|thrust|nozzle|feed|pump|propellant|tank/i.test(name)) return ["Core stage", "Engine section"];
  if (system === "Stage Separation") return ["Interstage", "Upper stage"];
  return ["Core stage", "Equipment bay"];
};

const ioFor = (name: string, system: string) => {
  if (/sensor|imu|gyroscope|accelerometer|receiver|camera/i.test(name)) return [["Physical measurement", "Electrical power"], ["Conditioned measurement data"]];
  if (/computer|controller|sequencer|software/i.test(name)) return [["Sensor data", "Mission commands", "Electrical power"], ["Control commands", "Health status"]];
  if (/tank|vessel/i.test(name)) return [["Servicing flow", "Pressurant"], ["Stored working fluid", "Pressure telemetry"]];
  if (/valve|line|manifold|pump|injector/i.test(name)) return [["Upstream fluid", "Command or shaft work"], ["Conditioned downstream flow", "Health telemetry"]];
  if (/engine|chamber|motor|nozzle/i.test(name)) return [["Propellant flow", "Ignition and control commands"], ["Thrust", "Thermal and pressure telemetry"]];
  if (system === "Electrical Power") return [["Stored or ground electrical energy"], ["Protected regulated power"]];
  if (system === "Communications & Telemetry") return [["Flight data", "Electrical power"], ["Encoded radio-frequency signal"]];
  return [["Mechanical loads", "Commands or services as configured"], ["Transferred load", "Component status"]];
};

const connectionsByName: Record<string, string[]> = {
  "Fuel Tank": ["Fuel Feed Line", "Propellant Isolation Valve"],
  "Oxidizer Tank": ["Oxidizer Feed Line", "Propellant Isolation Valve"],
  "Fuel Feed Line": ["Fuel Tank", "Fuel Pump"], "Fuel Pump": ["Fuel Feed Line", "Injector"],
  "Oxidizer Feed Line": ["Oxidizer Tank", "Oxidizer Pump"], "Oxidizer Pump": ["Oxidizer Feed Line", "Injector"],
  Injector: ["Fuel Pump", "Oxidizer Pump", "Combustion Chamber"], "Combustion Chamber": ["Injector", "Nozzle"],
  "Inertial Measurement Unit": ["Navigation Computer"], "GNSS or GPS Receiver": ["Navigation Computer"],
  "Navigation Computer": ["Inertial Measurement Unit", "GNSS or GPS Receiver", "Guidance Computer"],
  "Guidance Computer": ["Navigation Computer", "Flight-Control Computer"],
  "Flight-Control Computer": ["Guidance Computer", "Thrust Vector Control Actuator"],
  "Thrust Vector Control Actuator": ["Flight-Control Computer", "Gimbal Assembly"],
  "Main Battery": ["Power Distribution Unit"], "Power Distribution Unit": ["Main Battery", "Flight Computer"],
  "Flight Computer": ["Power Distribution Unit", "Data Bus", "Telemetry Transmitter"],
  "Data Acquisition Unit": ["Signal-Conditioning Unit", "Telemetry Encoder"],
  "Telemetry Encoder": ["Data Acquisition Unit", "Telemetry Transmitter"],
  "Telemetry Transmitter": ["Telemetry Encoder", "Telemetry Antenna"],
};

const idByName = new Map<string, string>(rocketPartSeed.map((seed) => [seed.name, slugify(seed.name)]));

export const rocketParts: RocketPart[] = rocketPartSeed.map((seed) => {
  const id = slugify(seed.name);
  const folder = systemFolder[seed.system];
  const [inputs, outputs] = ioFor(seed.name, seed.system);
  const image = knownImage[id] ?? `/assets/rocket-parts/${folder}/${id}-external.webp`;
  const notes = "notes" in seed ? seed.notes : "";
  const configDependent = /configuration|mission-dependent|only|smaller|advanced|experimental|reusable/i.test(notes);
  const difficulty = advancedWords.test(seed.name) ? "advanced" : seed.number % 4 === 0 ? "intermediate" : "beginner";
  const position = interfaceWords.test(seed.name) ? "interface" : externalWords.test(seed.name) ? "external" : "internal";
  const status = knownImage[id] ? "available" : configDependent ? "configuration-dependent" : difficulty === "advanced" ? "advanced" : "image-pending";
  return {
    id, catalogNumber: seed.number, name: seed.name, shortName: seed.name.replace(/ or .+$/i, ""),
    alternativeNames: seed.name.includes(" or ") ? seed.name.split(/ or /i).slice(1) : [], abbreviation: "abbreviation" in seed ? seed.abbreviation : undefined,
    system: seed.system, subsystem: seed.system.replace(/ System$/, ""), stageLocation: stageFor(seed.system, seed.name), position,
    purpose: seed.purpose,
    howItWorks: `${seed.name} receives ${inputs.join(" and ").toLowerCase()}, performs its ${seed.system.toLowerCase()} function, and provides ${outputs.join(" and ").toLowerCase()}. It is active only during the mission phases and vehicle configurations that require this function.`,
    inputs, outputs, connectedParts: (connectionsByName[seed.name] ?? []).map((name) => idByName.get(name)).filter((value): value is string => Boolean(value)),
    keyParameters: [
      { label: "Installed mass", value: `${Math.max(0.2, (seed.number * 3.17) % 180).toFixed(1)}`, unit: "kg", configurationDependent: true },
      { label: "Qualification state", value: "Training baseline" },
      { label: "Interface standard", value: `LV-${String((seed.number % 8) + 1).padStart(2, "0")}`, configurationDependent: true },
    ],
    materials: position === "external" ? ["Aerospace aluminium", "Composite laminate", "Protective coating"] : ["Aerospace aluminium", "Stainless steel", "Qualified polymers"],
    failureEffects: [{ symptom: "Out-of-family telemetry or inspection finding", consequence: `Degraded ${seed.system.toLowerCase()} function; mission impact depends on redundancy and phase.`, detection: "Pre-flight inspection, built-in test, or flight telemetry", mitigation: "Hold the applicable commit criterion and use approved redundancy or maintenance disposition." }],
    inspectionPoints: ["Mounting and fastener witness marks", "Connector, line, or interface condition", "Foreign-object and surface-damage inspection", "Recorded functional test status"],
    difficulty, buildLabCompatible: buildWords.test(seed.name),
    image, cutawayImage: `/assets/rocket-parts/${folder}/${id}-cutaway.webp`, installedImage: `/assets/rocket-parts/${folder}/${id}-installed.webp`, thumbnail: `/assets/rocket-parts/${folder}/${id}-thumbnail.webp`,
    imageAlt: `Technical inspection view of the ${seed.name.toLowerCase()} used in a modern educational launch vehicle.`,
    imagePrompt: `Create a highly realistic aerospace engineering product visualization of a ${seed.name}. The component belongs to the ${seed.system} of a modern educational orbital launch vehicle. Professional laboratory, photorealistic materials, accurate interfaces, cool studio lighting, dark navy grid background, no people, logos, watermark, weapon styling, or launch plume. Visually communicate: ${seed.purpose}`,
    hotspotCoordinates: [{ id: `${id}-interface`, x: 31 + (seed.number % 29), y: 24 + (seed.number % 47), label: "Primary interface", description: "Inspect the load, fluid, electrical, or data interface appropriate to this component." }],
    status, notes, propulsionType: seed.system === "Propulsion System" ? (/Solid/.test(seed.name) ? "solid" : /Hybrid/.test(seed.name) ? "hybrid" : "liquid") : "all",
    configuration: /crew/i.test(seed.name + notes) ? "crewed" : "both", deployable: deployWords.test(seed.name), learningOrder: seed.number,
  };
});

export const rocketPartById = new Map(rocketParts.map((part) => [part.id, part]));
export const rocketSystems = ["Complete Rocket", ...Object.keys(systemFolder)] as const;
export const systemCounts = Object.fromEntries(rocketSystems.map((system) => [system, system === "Complete Rocket" ? rocketParts.length : rocketParts.filter((part) => part.system === system).length]));

export const flowDefinitions = [
  { id: "propulsion", label: "Propulsion flow", partNames: ["Fuel Tank", "Propellant Isolation Valve", "Fuel Feed Line", "Fuel Pump", "Injector", "Combustion Chamber", "Nozzle"] },
  { id: "guidance", label: "Guidance & control", partNames: ["Inertial Measurement Unit", "GNSS or GPS Receiver", "Navigation Computer", "Guidance Computer", "Flight-Control Computer", "Thrust Vector Control Actuator", "Gimbal Assembly"] },
  { id: "electrical", label: "Electrical power", partNames: ["Main Battery", "Power Distribution Unit", "Flight Computer", "Wiring Harness"] },
  { id: "telemetry", label: "Telemetry chain", partNames: ["Engine Sensors", "Signal-Conditioning Unit", "Data Acquisition Unit", "Telemetry Encoder", "Telemetry Transmitter", "Telemetry Antenna"] },
].map((flow) => ({ ...flow, partIds: flow.partNames.map((name) => idByName.get(name)).filter((id): id is string => Boolean(id)) }));

export const purposeGroups = [
  ["Carry the payload", "Payload System"], ["Reduce aerodynamic drag", "Aerodynamic Control"], ["Store propellant", "Propellant Storage & Feed"],
  ["Move propellant", "Propellant Storage & Feed"], ["Generate thrust", "Propulsion System"], ["Control direction", "Guidance, Navigation & Control"],
  ["Determine position and attitude", "Guidance, Navigation & Control"], ["Supply electrical power", "Electrical Power"], ["Send flight data", "Communications & Telemetry"],
  ["Protect the public", "Flight Safety"], ["Separate stages", "Stage Separation"], ["Manage heat", "Thermal Protection"],
  ["Recover the vehicle", "Recovery System"], ["Connect to the launch pad", "Ground Interface"],
] as const;
