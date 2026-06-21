export function FieldLineLayer({ cx = 450, cy = 250, rings = 5, strength = 1, label = "magnetic field lines" }: { cx?: number; cy?: number; rings?: number; strength?: number; label?: string }) {
  const opacity = Math.max(0.2, Math.min(0.85, strength));
  return (
    <g aria-label={label}>
      {Array.from({ length: rings }, (_, index) => (
        <circle key={index} cx={cx} cy={cy} r={38 + index * 34} fill="none" stroke="#60a5fa" strokeWidth={2 + strength * 2} strokeDasharray="12 10" opacity={opacity - index * 0.08} />
      ))}
      <path d={`M${cx + 92} ${cy - 92} C${cx + 126} ${cy - 48} ${cx + 124} ${cy + 52} ${cx + 86} ${cy + 96}`} fill="none" stroke="#facc15" strokeWidth="4" markerEnd="url(#em-arrow)" />
      <text x={cx - 106} y={cy - 118} fill="#e0f2fe" fontWeight="900">{label}</text>
    </g>
  );
}
