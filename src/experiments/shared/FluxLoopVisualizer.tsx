export function FluxLoopVisualizer({ x = 500, y = 110, turns = 5, flux = 1, label = "changing flux" }: { x?: number; y?: number; turns?: number; flux?: number; label?: string }) {
  const width = 46 + Math.min(12, turns) * 9;
  const opacity = Math.max(0.18, Math.min(0.9, Math.abs(flux)));
  return (
    <g aria-label={label}>
      {Array.from({ length: Math.min(12, turns) }, (_, index) => (
        <ellipse key={index} cx={x + index * 12} cy={y + 90} rx="22" ry="76" fill="none" stroke="#f8fafc" strokeWidth="3" opacity="0.82" />
      ))}
      {Array.from({ length: 7 }, (_, index) => (
        <path key={index} d={`M${x - 80} ${y + 28 + index * 22} C${x + width / 2} ${y + 6 + index * 18} ${x + width / 2} ${y + 178 - index * 5} ${x + width + 90} ${y + 36 + index * 18}`} fill="none" stroke="#60a5fa" strokeWidth="4" opacity={opacity} markerEnd="url(#em-arrow)" />
      ))}
      <text x={x - 52} y={y - 8} fill="#e0f2fe" fontWeight="900">{label}</text>
    </g>
  );
}
