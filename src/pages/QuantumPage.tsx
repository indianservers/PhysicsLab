import { useEffect, useMemo, useState } from "react";
import { Toolbar } from "../components/Toolbar";
import { BohrModelSim } from "../components/quantum/BohrModelSim";
import { PhotoelectricSim } from "../components/quantum/PhotoelectricSim";
import { TunnelingSim } from "../components/quantum/TunnelingSim";
import { trackQuantumVisit } from "../lib/achievements";
import { QuantumGuidePanel } from "../physics/quantum/components/QuantumGuidePanel";
import { quantumSimulations, QuantumLearningMode, QuantumSimulationId } from "../physics/quantum/quantumLabData";
import "../physics/quantum/quantumLab.css";

const modes: QuantumLearningMode[] = ["beginner", "normal", "advanced"];

export function QuantumPage() {
  const [mode, setMode] = useState<QuantumLearningMode>("normal");
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState<QuantumSimulationId | null>(null);
  useEffect(() => { trackQuantumVisit(); }, []);
  const searchResults = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return quantumSimulations;
    return quantumSimulations.filter((simulation) => [
      simulation.title,
      simulation.purpose,
      simulation.physicsGoal,
      simulation.keywords.join(" "),
      simulation.formulaList.map((formula) => `${formula.expression} ${formula.meaning}`).join(" "),
      simulation.learningOutcomes.join(" "),
    ].join(" ").toLowerCase().includes(needle));
  }, [query]);
  const jumpTo = (id: QuantumSimulationId, anchor: string) => {
    setHighlighted(id);
    document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => setHighlighted(null), 1800);
  };
  return (
    <div className="quantum-lab-page min-h-screen">
      <Toolbar />
      <main id="content" className="quantum-lab-shell">
        <section className="quantum-lab-hero">
          <div>
            <p className="ui-label">Complete Quantum Physics Lab - Phase 1 foundation</p>
            <h1>Quantum Physics Lab</h1>
            <p>Classroom-ready foundations for photoelectric effect, tunneling, and Bohr emission with shared constants, live observations, formulas, and learning modes.</p>
          </div>
          <div className="quantum-mode-panel" aria-label="Quantum learning mode">
            <span className="ui-label">Learning mode</span>
            <div>
              {modes.map((item) => (
                <button key={item} type="button" className={mode === item ? "quantum-mode-active" : ""} onClick={() => setMode(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="quantum-search-panel">
          <label>
            <span className="ui-label">Search quantum concepts</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="photoelectric, work function, tunneling, barrier, Balmer, wavelength..." />
          </label>
          <div className="quantum-search-results">
            {searchResults.map((simulation) => (
              <button key={simulation.id} type="button" onClick={() => jumpTo(simulation.id, simulation.routeAnchor)}>
                <strong>{simulation.title}</strong>
                <span>{simulation.keywords.slice(0, 4).join(" - ")}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="quantum-guide-grid" aria-label="Quantum guide cards">
          {quantumSimulations.map((simulation) => <QuantumGuidePanel key={simulation.id} info={simulation} mode={mode} />)}
        </section>

        <div className="quantum-sim-grid">
          <PhotoelectricSim mode={mode} highlighted={highlighted === "photoelectric"} />
          <TunnelingSim mode={mode} highlighted={highlighted === "tunneling"} />
          <BohrModelSim mode={mode} highlighted={highlighted === "bohr"} />
        </div>
      </main>
    </div>
  );
}
