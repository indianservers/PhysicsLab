export function SpectrumBeam({ x1 = 450, y1 = 250, spread = 60 }: { x1?: number; y1?: number; spread?: number }) {
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#38bdf8", "#6366f1", "#a855f7"];
  return (
    <g aria-label="split spectrum beam">
      {colors.map((color, index) => (
        <line key={color} x1={x1} y1={y1} x2={x1 + 280} y2={y1 - spread / 2 + index * (spread / 6)} stroke={color} strokeWidth="5" markerEnd="url(#ray-arrow)" />
      ))}
      <text x={x1 + 190} y={y1 - spread / 2 - 14} fill="#e0f2fe" fontWeight="900">red bends less, violet bends more</text>
    </g>
  );
}
