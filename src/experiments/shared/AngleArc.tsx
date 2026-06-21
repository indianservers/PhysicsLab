export function AngleArc({ cx, cy, radius = 48, startDeg, endDeg, label }: { cx: number; cy: number; radius?: number; startDeg: number; endDeg: number; label: string }) {
  const start = point(cx, cy, radius, startDeg);
  const end = point(cx, cy, radius, endDeg);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return (
    <g aria-label={label}>
      <path d={`M${start.x} ${start.y} A${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`} fill="none" stroke="#facc15" strokeWidth="4" />
      <text x={cx + radius + 8} y={cy - 8} fill="#fde68a" fontWeight="900">{label}</text>
    </g>
  );
}

function point(cx: number, cy: number, radius: number, deg: number) {
  const radians = (deg * Math.PI) / 180;
  return { x: cx + Math.cos(radians) * radius, y: cy + Math.sin(radians) * radius };
}
