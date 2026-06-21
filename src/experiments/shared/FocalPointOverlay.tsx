export function FocalPointOverlay({ centerX = 450, y = 260, focalPx = 120 }: { centerX?: number; y?: number; focalPx?: number }) {
  return (
    <g aria-label="focal points">
      <line x1="80" y1={y} x2="820" y2={y} stroke="#94a3b8" strokeWidth="3" />
      <circle cx={centerX - focalPx} cy={y} r="8" fill="#facc15" /><circle cx={centerX + focalPx} cy={y} r="8" fill="#facc15" />
      <text x={centerX - focalPx} y={y + 30} textAnchor="middle" fill="#fde68a" fontWeight="900">F</text>
      <text x={centerX + focalPx} y={y + 30} textAnchor="middle" fill="#fde68a" fontWeight="900">F</text>
    </g>
  );
}
