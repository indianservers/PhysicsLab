import { MatterSimulationEngine } from "./matterEngine";
import { PhysicsObjectInstance, SimulationSettings } from "../types";

let engine = new MatterSimulationEngine();

type WorkerRequest =
  | { type: "init"; objects: PhysicsObjectInstance[] }
  | { type: "sync"; objects: PhysicsObjectInstance[] }
  | { type: "step"; dt: number; settings: SimulationSettings }
  | { type: "reset-time" };

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const message = event.data;
  if (message.type === "init") {
    engine = new MatterSimulationEngine(message.objects);
    self.postMessage({ type: "ready" });
    return;
  }
  if (message.type === "sync") {
    engine.syncObjects(message.objects);
    return;
  }
  if (message.type === "reset-time") {
    engine.resetTime();
    return;
  }
  if (message.type === "step") {
    const snapshot = engine.step(message.dt, message.settings);
    self.postMessage({ type: "snapshot", snapshot });
  }
};
