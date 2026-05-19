import { useEffect, useMemo, useRef, useState } from "react";
import { EngineSnapshot, PhysicsObjectInstance, SimulationSettings } from "../types";
import { MatterSimulationEngine } from "./matterEngine";

export interface SimulationEngineController {
  step: (dt: number, settings: SimulationSettings) => Promise<EngineSnapshot>;
  syncObjects: (objects: PhysicsObjectInstance[]) => void;
  setObjectPosition: (id: string, x: number, y: number) => void;
  resetTime: () => void;
  workerEnabled: boolean;
}

export function useSimulationEngine(initialObjects: PhysicsObjectInstance[]): SimulationEngineController {
  const fallback = useRef(new MatterSimulationEngine(initialObjects));
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<((snapshot: EngineSnapshot) => void) | null>(null);
  const [workerEnabled, setWorkerEnabled] = useState(false);

  useEffect(() => {
    try {
      const worker = new Worker(new URL("./simulationWorker.ts", import.meta.url), { type: "module" });
      workerRef.current = worker;
      worker.onmessage = (event: MessageEvent<{ type: string; snapshot?: EngineSnapshot }>) => {
        if (event.data.type === "ready") setWorkerEnabled(true);
        if (event.data.type === "snapshot" && event.data.snapshot && pendingRef.current) {
          pendingRef.current(event.data.snapshot);
          pendingRef.current = null;
        }
      };
      worker.postMessage({ type: "init", objects: initialObjects });
      return () => worker.terminate();
    } catch {
      setWorkerEnabled(false);
    }
  }, []);

  return useMemo(
    () => ({
      workerEnabled,
      step: (dt: number, settings: SimulationSettings) => {
        const worker = workerRef.current;
        if (!workerEnabled || !worker) return Promise.resolve(fallback.current.step(dt, settings));
        return new Promise<EngineSnapshot>((resolve) => {
          pendingRef.current = resolve;
          worker.postMessage({ type: "step", dt, settings });
        });
      },
      syncObjects: (objects: PhysicsObjectInstance[]) => {
        fallback.current.syncObjects(objects);
        workerRef.current?.postMessage({ type: "sync", objects });
      },
      setObjectPosition: (id: string, x: number, y: number) => {
        fallback.current.setObjectPosition(id, x, y);
      },
      resetTime: () => {
        fallback.current.resetTime();
        workerRef.current?.postMessage({ type: "reset-time" });
      },
    }),
    [workerEnabled]
  );
}
