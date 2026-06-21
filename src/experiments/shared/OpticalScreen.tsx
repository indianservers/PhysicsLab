export function OpticalScreen({ x = 730, y = 110, height = 300, label = "screen" }: { x?: number; y?: number; height?: number; label?: string }) {
  return (
    <g aria-label={label}>
      <rect x={x} y={y} width="22" height={height} rx="8" fill="#e0f2fe" opacity="0.9" />
      <text x={x + 12} y={y - 14} textAnchor="middle" fill="#e0f2fe" fontWeight="900">{label}</text>
    </g>
  );
}
