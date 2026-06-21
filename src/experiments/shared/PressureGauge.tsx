export function PressureGauge({ x = 720, y = 270, value = 100, max = 300, label = "pressure" }: { x?: number; y?: number; value?: number; max?: number; label?: string }) {
  const fraction = Math.max(0, Math.min(1, value / Math.max(1, max)));
  const angle = -130 + fraction * 260;
  const rad = (angle * Math.PI) / 180;
  return (
    <g aria-label={`${label} gauge`}>
      <circle cx={x} cy={y} r="70" fill="rgba(15,23,42,.92)" stroke="#93c5fd" strokeWidth="4" />
      <path d={`M${x - 50} ${y + 24} A58 58 0 0 1 ${x + 50} ${y + 24}`} fill="none" stroke="#22d3ee" strokeWidth="8" />
      <line x1={x} y1={y} x2={x + Math.cos(rad) * 48} y2={y + Math.sin(rad) * 48} stroke="#facc15" strokeWidth="5" />
      <text x={x} y={y + 58} textAnchor="middle" fill="#fde68a" fontWeight="900">{value.toFixed(0)}</text>
      <text x={x} y={y - 84} textAnchor="middle" fill="#e0f2fe" fontWeight="900">{label}</text>
    </g>
  );
}
