export interface VariableInspectorItem {
  symbol: string;
  label: string;
  value: string;
  unit?: string;
  validRange?: string;
}

export function VariableInspector({ items, title = "Variable inspector" }: { items: VariableInspectorItem[]; title?: string }) {
  return (
    <section className="variable-inspector" aria-label={title}>
      <p className="premium-mini-label">{title}</p>
      <div className="variable-inspector-list">
        {items.map((item) => (
          <div className="variable-inspector-row" key={item.symbol}>
            <label>
              <strong>{item.symbol}</strong>
              <span>{item.label}{item.validRange ? `, valid ${item.validRange}` : ""}</span>
            </label>
            <strong>{item.value}{item.unit ? ` ${item.unit}` : ""}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
