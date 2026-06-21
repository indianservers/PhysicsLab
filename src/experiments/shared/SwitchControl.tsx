export function SwitchControl({ x, y, closed, label = "switch" }: { x: number; y: number; closed: boolean; label?: string }) {
  return (
    <g aria-label={`${label} ${closed ? "closed" : "open"}`}>
      <circle cx={x} cy={y} r="7" fill="#e0f2fe" />
      <circle cx={x + 76} cy={y} r="7" fill="#e0f2fe" />
      <line x1={x} y1={y} x2={x + (closed ? 76 : 55)} y2={y - (closed ? 0 : 26)} stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
      <text x={x + 38} y={y + 32} textAnchor="middle" fill="#e0f2fe" fontWeight="900">{label}</text>
    </g>
  );
}
