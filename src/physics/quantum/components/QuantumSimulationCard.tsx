import { ReactNode, useEffect, useState } from "react";
import { QuantumFormulaBox } from "./QuantumFormulaBox";
import { QuantumObservationPanel } from "./QuantumObservationPanel";
import { QuantumOutputGrid, QuantumOutputItem } from "./QuantumOutputGrid";
import { QuantumLearningMode, QuantumSimulationInfo } from "../quantumLabData";

export function QuantumSimulationCard({
  info,
  mode,
  className,
  children,
  controls,
  outputs,
  observation,
  onReset,
}: {
  info: QuantumSimulationInfo;
  mode: QuantumLearningMode;
  className: string;
  children: ReactNode;
  controls: ReactNode;
  outputs: QuantumOutputItem[];
  observation: string;
  onReset: () => void;
}) {
  const [advancedOpen, setAdvancedOpen] = useState(mode === "advanced");
  useEffect(() => {
    if (mode === "advanced") setAdvancedOpen(true);
  }, [mode]);
  return (
    <section id={info.routeAnchor} className={`quantum-sim-card ${className}`}>
      <header className="quantum-sim-head">
        <div>
          <p className="ui-label">{info.physicsGoal}</p>
          <h2>{info.title}</h2>
          <p>{info.purpose}</p>
        </div>
        <div className="quantum-sim-actions">
          <button type="button" onClick={() => setAdvancedOpen((value) => !value)}>{advancedOpen ? "Hide details" : "Advanced details"}</button>
          <button type="button" onClick={onReset}>Reset</button>
        </div>
      </header>
      <div className="quantum-sim-layout">
        <div className="quantum-visual-panel">{children}</div>
        <div className="quantum-control-panel">{controls}</div>
      </div>
      <QuantumOutputGrid outputs={outputs} />
      <div className="quantum-learning-row">
        <QuantumFormulaBox formulas={info.formulaList} />
        <QuantumObservationPanel observation={observation} mode={mode} />
      </div>
      {advancedOpen && (
        <div className="quantum-advanced-panel">
          <div>
            <h3>Accuracy notes</h3>
            <ul>{info.accuracyNotes.map((note) => <li key={note}>{note}</li>)}</ul>
          </div>
          <div>
            <h3>Learning outcomes</h3>
            <ul>{info.learningOutcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
          </div>
          <div>
            <h3>Teacher notes</h3>
            <ul>{info.teacherNotes.map((note) => <li key={note}>{note}</li>)}</ul>
          </div>
        </div>
      )}
    </section>
  );
}
