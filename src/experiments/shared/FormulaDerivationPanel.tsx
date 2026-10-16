import { MathText } from "../../components/MathExpression";
export interface FormulaDerivationStep {
  label: string;
  expression: string;
  explanation: string;
}

export function FormulaDerivationPanel({ formula, steps }: { formula: string; steps: FormulaDerivationStep[] }) {
  return (
    <section className="formula-derivation-panel" aria-label="Formula derivation">
      <p className="premium-mini-label">Derivation</p>
      <h3><MathText text={formula} /></h3>
      <ol>
        {steps.map((step) => (
          <li key={step.label}>
            <strong>{step.label}: <MathText text={step.expression} /></strong>
            <p>{step.explanation}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
