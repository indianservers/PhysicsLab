import { QuantumFormulaInfo } from "../quantumLabData";

export function QuantumFormulaBox({ formulas }: { formulas: QuantumFormulaInfo[] }) {
  return (
    <div className="quantum-formula-box">
      <p className="ui-label">Formula box</p>
      <div className="quantum-formula-list">
        {formulas.map((formula) => (
          <div key={formula.expression}>
            <code>{formula.expression}</code>
            <span>{formula.meaning}</span>
            <small>{formula.units}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
