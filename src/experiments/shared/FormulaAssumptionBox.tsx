import type { ReactNode } from "react";

export type FormulaStatus = "validated" | "benchmark-pending" | "qualitative-only";

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

const statusLabels: Record<FormulaStatus, string> = {
  validated: "Quantitative benchmark passed",
  "benchmark-pending": "Benchmark required before accuracy claim",
  "qualitative-only": "Qualitative visual only",
};

export function FormulaAssumptionBox({ formula, symbols = [], assumptions = [], status, statusNote }: FormulaAssumptionBoxProps) {
  return (
    <section className={`formula-assumption-box formula-assumption-box-${status}`} aria-label="Formula assumptions and status">
      <div className="formula-assumption-head">
        <div>
          <p className="ui-label">Model formula</p>
          <strong>{formula}</strong>
        </div>
        <span>{statusLabels[status]}</span>
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
