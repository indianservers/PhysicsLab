export function StreamlineLayer({ speed = 1, narrow = false }: { speed?: number; narrow?: boolean }) {
  return (
    <g aria-label="fluid streamlines">
      {Array.from({ length: 6 }, (_, index) => (
        <path key={index} d={`M90 ${170 + index * 38} C250 ${150 + index * 20} 360 ${220 + index * 8} 520 ${190 + index * 24} S720 ${150 + index * 36} 820 ${180 + index * 32}`} fill="none" stroke="#67e8f9" strokeWidth={narrow ? 3 + speed : 3} opacity="0.75" markerEnd="url(#ray-arrow)" />
      ))}
      <text x="118" y="104" fill="#e0f2fe" fontWeight="900">streamlines: closer lines mean faster flow</text>
    </g>
  );
}
