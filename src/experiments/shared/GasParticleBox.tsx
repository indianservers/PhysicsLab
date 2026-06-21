export function GasParticleBox({ volume = 1, temperature = 300, count = 40 }: { volume?: number; temperature?: number; count?: number }) {
  const width = Math.max(190, Math.min(520, 180 + volume * 120));
  const speed = Math.sqrt(temperature / 300);
  return (
    <g aria-label="gas particle box">
      <rect x="150" y="110" width={width} height="280" rx="22" fill="rgba(15,23,42,.55)" stroke="#bfdbfe" strokeWidth="4" />
      <line x1={150 + width} y1="110" x2={150 + width} y2="390" stroke="#facc15" strokeWidth="8" />
      {Array.from({ length: count }, (_, index) => {
        const x = 170 + ((index * 53) % Math.max(40, width - 40));
        const y = 134 + ((index * 37) % 230);
        return <circle key={index} cx={x} cy={y} r={3 + speed} fill="#67e8f9" stroke="#ecfeff" />;
      })}
      <text x="168" y="94" fill="#e0f2fe" fontWeight="900">particles move faster at higher Kelvin temperature</text>
    </g>
  );
}
