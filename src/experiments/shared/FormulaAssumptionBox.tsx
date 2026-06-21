import type { ReactNode } from "react";
import { canonicalAccuracyStatus, type AccuracyStatus, type ValidationClaimStatus } from "./validation";

export type FormulaStatus = AccuracyStatus;

export interface FormulaSymbol {
  symbol: string;
  meaning: string;
  unit?: string;
}

export interface FormulaAssumptionBoxProps {
  formula: string;
  symbols?: FormulaSymbol[];
  assumptions?: string[];
  status: FormulaStatus;
  statusNote?: ReactNode;
}

const statusLabels: Record<ValidationClaimStatus, string> = {
  validated: "Quantitative benchmark passed",
  "formula-only": "Formula shown, validation pending",
  "qualitative-visual": "Qualitative visual model",
  "needs-benchmark": "Benchmark required before accuracy claim",
  "unsafe-claim": "Unsafe quantitative claim",
};

export function FormulaAssumptionBox({ formula, symbols = [], assumptions = [], status, statusNote }: FormulaAssumptionBoxProps) {
  const normalizedStatus = canonicalAccuracyStatus(status);

  return (
    <section className={`formula-assumption-box formula-assumption-box-${normalizedStatus}`} aria-label="Formula assumptions and status">
      <div className="formula-assumption-head">
        <div>
          <p className="ui-label">Model formula</p>
          <strong>{formula}</strong>
        </div>
        <span>{statusLabels[normalizedStatus]}</span>
      </div>
      {symbols.length > 0 && (
        <div className="formula-symbol-grid">
          {symbols.map((item) => (
            <div key={`${item.symbol}-${item.meaning}`}>
              <b>{item.symbol}</b>
              <span>{item.meaning}</span>
              <small>{item.unit || "unitless"}</small>
            </div>
          ))}
        </div>
      )}
      {assumptions.length > 0 && (
        <ul className="formula-assumption-list">
          {assumptions.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}
      {statusNote && <p className="formula-assumption-note">{statusNote}</p>}
    </section>
  );
}
