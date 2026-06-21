export interface InterferenceMapProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fringeWidth?: number;
  label?: string;
}

export function InterferenceMap({ x = 570, y = 90, width = 220, height = 300, fringeWidth = 28, label = "intensity map" }: InterferenceMapProps) {
  return (
    <g aria-label={label}>
      <rect x={x} y={y} width={width} height={height} rx="18" fill="rgba(15,23,42,.82)" stroke="#93c5fd" />
      {Array.from({ length: 13 }, (_, index) => {
        const bandX = x + 14 + index * (width - 28) / 12;
        const bright = index % 2 === 0;
        return <rect key={index} x={bandX - fringeWidth / 8} y={y + 18} width={Math.max(2, fringeWidth / 4)} height={height - 36} rx="5" fill={bright ? "#fef08a" : "#312e81"} opacity={bright ? 0.9 : 0.55} />;
      })}
      <text x={x + 18} y={y + height + 24} fill="#e0f2fe" fontWeight="900">bright / dark screen bands</text>
    </g>
  );
}
