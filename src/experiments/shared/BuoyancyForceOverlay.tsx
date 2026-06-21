export function BuoyancyForceOverlay({ x = 310, y = 260, up = 100, down = 120 }: { x?: number; y?: number; up?: number; down?: number }) {
  return (
    <g aria-label="buoyancy and weight arrows">
      <line x1={x} y1={y} x2={x} y2={y - up} stroke="#22d3ee" strokeWidth="6" markerEnd="url(#ray-arrow)" />
      <text x={x + 12} y={y - up + 12} fill="#bae6fd" fontWeight="900">Fb</text>
      <line x1={x + 40} y1={y - 20} x2={x + 40} y2={y - 20 + down} stroke="#fb7185" strokeWidth="6" markerEnd="url(#ray-arrow)" />
      <text x={x + 52} y={y + down - 14} fill="#fecdd3" fontWeight="900">W</text>
    </g>
  );
}
