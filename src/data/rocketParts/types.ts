export type RocketPartStatus = "available" | "optional" | "configuration-dependent" | "advanced" | "image-pending";
export type RocketPosition = "internal" | "external" | "interface";
export type RocketDifficulty = "beginner" | "intermediate" | "advanced";

export interface RocketPart {
  id: string;
  catalogNumber: number;
  name: string;
  shortName: string;
  alternativeNames: string[];
  abbreviation?: string;
  system: string;
  subsystem: string;
  stageLocation: string[];
  position: RocketPosition;
  purpose: string;
  howItWorks: string;
  inputs: string[];
  outputs: string[];
  connectedParts: string[];
  keyParameters: Array<{ label: string; value: string; unit?: string; configurationDependent?: boolean }>;
  materials: string[];
  failureEffects: Array<{ symptom: string; consequence: string; detection: string; mitigation?: string }>;
  inspectionPoints: string[];
  difficulty: RocketDifficulty;
  buildLabCompatible: boolean;
  image: string;
  cutawayImage: string;
  installedImage: string;
  thumbnail: string;
  imageAlt: string;
  imagePrompt: string;
  modelPath?: string;
  hotspotCoordinates: Array<{ id: string; x: number; y: number; label: string; description: string }>;
  status: RocketPartStatus;
  notes?: string;
  propulsionType?: "liquid" | "solid" | "hybrid" | "electric" | "all";
  configuration: "crewed" | "uncrewed" | "both";
  deployable: boolean;
  learningOrder: number;
}

export interface BuildConfiguration {
  partIds: string[];
  massKg: number;
  readiness: number;
  updatedAt: string;
}
