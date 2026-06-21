export interface DetectorProbeProps {
  x: number;
  y: number;
  reading: string;
  label?: string;
}

export function DetectorProbe({ x, y, reading, label = "detector probe" }: DetectorProbeProps) {
  return (
    <g aria-label={`${label}: ${reading}`}>
      <line x1={x} y1={y - 42} x2={x} y2={y + 42} stroke="#facc15" strokeWidth="3" strokeDasharray="6 6" />
      <circle cx={x} cy={y} r="12" fill="#facc15" stroke="#fef9c3" strokeWidth="4" />
      <rect x={x + 18} y={y - 24} width="138" height="48" rx="12" fill="rgba(15,23,42,.9)" stroke="#facc15" />
      <text x={x + 30} y={y - 4} fill="#fef9c3" fontWeight="900">{label}</text>
      <text x={x + 30} y={y + 16} fill="#e0f2fe">{reading}</text>
    </g>
  );
}
