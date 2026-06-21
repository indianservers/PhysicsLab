export function QuantumObservationPanel({ title = "Live observation", observation, mode }: { title?: string; observation: string; mode: string }) {
  return (
    <aside className="quantum-observation-panel">
      <p className="ui-label">{title}</p>
      <strong>{mode}</strong>
      <span>{observation}</span>
    </aside>
  );
}
