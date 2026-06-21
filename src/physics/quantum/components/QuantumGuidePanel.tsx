import { QuantumLearningMode, QuantumSimulationInfo } from "../quantumLabData";

export function QuantumGuidePanel({ info, mode }: { info: QuantumSimulationInfo; mode: QuantumLearningMode }) {
  const explanation = mode === "beginner" ? info.beginnerExplanation : mode === "advanced" ? info.advancedExplanation : info.normalStudentExplanation;
  return (
    <details className="quantum-guide-card" id={`${info.routeAnchor}-guide`}>
      <summary>
        <span>{info.title}</span>
        <strong>{mode}</strong>
      </summary>
      <div className="quantum-guide-body">
        <p>{explanation}</p>
        <div>
          <h3>How to use</h3>
          <ol>{info.howToUse.map((step) => <li key={step}>{step}</li>)}</ol>
        </div>
        <div>
          <h3>Observe</h3>
          <ul>{info.whatToObserve.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h3>Misconception</h3>
          <ul>{info.commonMisconceptions.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h3>Use</h3>
          <p>{info.realWorldApplications.slice(0, 3).join(", ")}</p>
        </div>
      </div>
    </details>
  );
}
