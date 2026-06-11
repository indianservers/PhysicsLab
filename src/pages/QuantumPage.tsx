import { useEffect } from "react";
import { Toolbar } from "../components/Toolbar";
import { BohrModelSim } from "../components/quantum/BohrModelSim";
import { PhotoelectricSim } from "../components/quantum/PhotoelectricSim";
import { TunnelingSim } from "../components/quantum/TunnelingSim";
import { GuidePanel } from "../components/GuidePanel";
import { guideForQuantumTool } from "../lib/guides";
import { trackQuantumVisit } from "../lib/achievements";

export function QuantumPage() {
  useEffect(() => { trackQuantumVisit(); }, []);
  return (
    <div className="min-h-screen">
      <Toolbar />
      <main className="mx-auto grid max-w-7xl gap-4 px-5 py-6">
        <h1 className="text-3xl font-bold text-gradient-quantum">Quantum Simulations</h1>
        <div className="grid gap-3 lg:grid-cols-3">
          <GuidePanel guide={guideForQuantumTool("photoelectric")} compact />
          <GuidePanel guide={guideForQuantumTool("tunneling")} compact />
          <GuidePanel guide={guideForQuantumTool("bohr")} compact />
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <PhotoelectricSim />
          <TunnelingSim />
          <div className="xl:col-span-2"><BohrModelSim /></div>
        </div>
      </main>
    </div>
  );
}
