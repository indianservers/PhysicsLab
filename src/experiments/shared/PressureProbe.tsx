export function PressureProbe({ x, y, value, unit = "Pa", label = "pressure probe" }: { x: number; y: number; value: number; unit?: string; label?: string }) {
  return (
    <g aria-label={label}>
      <circle cx={x} cy={y} r="36" fill="rgba(15,23,42,.9)" stroke="#facc15" strokeWidth="4" />
      <line x1={x} y1={y} x2={x + 24} y2={y - 18} stroke="#facc15" strokeWidth="4" />
      <text x={x} y={y + 58} textAnchor="middle" fill="#fde68a" fontWeight="900">{value.toFixed(0)} {unit}</text>
      <text x={x} y={y - 48} textAnchor="middle" fill="#e0f2fe" fontWeight="900">{label}</text>
    </g>
  );
}
