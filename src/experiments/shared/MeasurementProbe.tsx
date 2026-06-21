export interface MeasurementProbeProps {
  label: string;
  value: string;
  unit?: string;
  x?: number;
  y?: number;
}

export function MeasurementProbe({ label, value, unit, x, y }: MeasurementProbeProps) {
  const style = typeof x === "number" && typeof y === "number" ? ({ left: `${x}%`, top: `${y}%`, position: "absolute" } as CSSProperties) : undefined;
  return (
    <div className="measurement-probe" style={style} role="status" aria-label={`${label} ${value}${unit ? ` ${unit}` : ""}`}>
      <span>{label}</span>
      <strong>{value}{unit ? ` ${unit}` : ""}</strong>
    </div>
  );
}
import type { CSSProperties } from "react";
