export function MeterGauge({ x, y, label, value, unit, min = 0, max = 100 }: { x: number; y: number; label: string; value: number; unit: string; min?: number; max?: number }) {
  const fraction = Math.max(0, Math.min(1, (value - min) / Math.max(0.000001, max - min)));
  const angle = -120 + fraction * 240;
  const radians = (angle * Math.PI) / 180;
  const needleX = x + Math.cos(radians) * 40;
  const needleY = y + Math.sin(radians) * 40;

  return (
    <g aria-label={`${label} meter`}>
      <circle cx={x} cy={y} r="58" fill="rgba(15,23,42,.92)" stroke="#93c5fd" strokeWidth="3" />
      <path d={`M${x - 42} ${y + 18} A48 48 0 0 1 ${x + 42} ${y + 18}`} fill="none" stroke="#22d3ee" strokeWidth="6" />
      <line x1={x} y1={y} x2={needleX} y2={needleY} stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
      <circle cx={x} cy={y} r="5" fill="#f8fafc" />
      <text x={x} y={y - 66} textAnchor="middle" fill="#e0f2fe" fontWeight="900">{label}</text>
      <text x={x} y={y + 44} textAnchor="middle" fill="#fde68a" fontWeight="900">{value.toFixed(Math.abs(value) >= 10 ? 1 : 2)} {unit}</text>
    </g>
  );
}
