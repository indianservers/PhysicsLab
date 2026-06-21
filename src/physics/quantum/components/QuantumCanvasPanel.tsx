import { ReactNode } from "react";

export function QuantumCanvasPanel({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="quantum-canvas-panel" aria-label={label}>
      {children}
    </div>
  );
}
