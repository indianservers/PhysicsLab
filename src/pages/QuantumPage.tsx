import { Toolbar } from "../components/Toolbar";
import { BohrModelSim } from "../components/quantum/BohrModelSim";
import { PhotoelectricSim } from "../components/quantum/PhotoelectricSim";
import { TunnelingSim } from "../components/quantum/TunnelingSim";

export function QuantumPage() {
  return (
    <div className="min-h-screen">
      <Toolbar />
      <main className="mx-auto grid max-w-7xl gap-4 px-5 py-6">
        <h1 className="text-3xl font-bold">Quantum Simulations</h1>
        <div className="grid gap-4 xl:grid-cols-2">
          <PhotoelectricSim />
          <TunnelingSim />
          <div className="xl:col-span-2"><BohrModelSim /></div>
        </div>
      </main>
    </div>
  );
}
