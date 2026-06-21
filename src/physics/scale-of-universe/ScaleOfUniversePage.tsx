import { useEffect, useRef } from "react";
import { Toolbar } from "../../components/Toolbar";
import { createScaleUniverseExplorer } from "./scaleUniverseEngine.js";
import "./scaleUniverse.css";

export function ScaleOfUniversePage() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hostRef.current) return undefined;
    const explorer = createScaleUniverseExplorer(hostRef.current);
    return () => explorer.destroy();
  }, []);

  return (
    <div className="scale-universe-page min-h-screen">
      <Toolbar />
      <main id="content" className="scale-universe-shell" aria-label="Scale of Universe Explorer page">
        <div ref={hostRef} className="scale-universe-root" />
      </main>
    </div>
  );
}
