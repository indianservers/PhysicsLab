import { PhysicsObjectInstance } from "../types";

export interface SharedLabSettings {
  gravity: number;
  timeScale: number;
  airResistance: boolean;
  showGrid: boolean;
  showVectors: boolean;
}

export interface SharedLabState {
  objects: PhysicsObjectInstance[];
  settings: SharedLabSettings;
}

export async function serializeState(objects: PhysicsObjectInstance[], settings: SharedLabSettings): Promise<string> {
  const json = JSON.stringify({ objects, settings });
  const bytes = new TextEncoder().encode(json);
  if (!("CompressionStream" in window)) return bytesToBase64(bytes);
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate-raw"));
  return bytesToBase64(new Uint8Array(await new Response(stream).arrayBuffer()));
}

export async function deserializeState(encoded: string): Promise<SharedLabState> {
  const bytes = base64ToBytes(encoded);
  if (!("DecompressionStream" in window)) return JSON.parse(new TextDecoder().decode(bytes)) as SharedLabState;
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return JSON.parse(await new Response(stream).text()) as SharedLabState;
}

export function rawStateJson(objects: PhysicsObjectInstance[], settings: SharedLabSettings) {
  return JSON.stringify({
    generatedBy: "PhysicsLab Scientific Trust Export",
    modelClass: "Dynamic Simulation",
    trustLevel: 78,
    assumptions: [
      "Workspace exports preserve state; quantitative interpretation depends on registered graph measurement adapters.",
      "Matter.js dynamics use educational SI conversion assumptions.",
    ],
    units: {
      position: "m",
      velocity: "m/s",
      acceleration: "m/s^2",
      force: "N",
      energy: "J",
    },
    formulaUsed: "Live workspace formulas are attached to graph adapters and selected-object formula cards.",
    objects,
    settings,
  }, null, 2);
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64ToBytes(encoded: string) {
  const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}
