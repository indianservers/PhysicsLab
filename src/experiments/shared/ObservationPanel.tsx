export interface ObservationItem {
  label: string;
  value: string;
  explanation?: string;
}

export interface ObservationPanelProps {
  title?: string;
  changed?: string;
  why?: string;
  observations: ObservationItem[];
}

export function ObservationPanel({ title = "What changed and why", changed, why, observations }: ObservationPanelProps) {
  return (
    <section className="dedicated-observation-panel" aria-label={title}>
      <p className="ui-label">Observation</p>
      <h3>{title}</h3>
      {changed && <p><strong>Changed:</strong> {changed}</p>}
      {why && <p><strong>Why:</strong> {why}</p>}
      <div className="dedicated-observation-list">
        {observations.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            {item.explanation && <small>{item.explanation}</small>}
          </div>
        ))}
      </div>
    </section>
  );
}
