export interface QuantumOutputItem {
  label: string;
  value: string;
  detail?: string;
}

export function QuantumOutputGrid({ outputs }: { outputs: QuantumOutputItem[] }) {
  return (
    <div className="quantum-output-grid">
      {outputs.map((output) => (
        <div key={output.label}>
          <span>{output.label}</span>
          <strong>{output.value}</strong>
          {output.detail && <small>{output.detail}</small>}
        </div>
      ))}
    </div>
  );
}
