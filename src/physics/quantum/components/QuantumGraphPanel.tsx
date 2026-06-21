import { ReactNode } from "react";

export function QuantumGraphPanel({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="quantum-graph-panel" aria-label={label}>
      {children}
    </div>
  );
}
