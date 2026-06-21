export interface AmplitudeGraphProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  amplitude?: number;
  wavelength?: number;
  label?: string;
}

export function AmplitudeGraph({ x = 82, y = 384, width = 360, height = 88, amplitude = 1, wavelength = 80, label = "amplitude-time graph" }: AmplitudeGraphProps) {
  const mid = y + height / 2;
  const path = Array.from({ length: 80 }, (_, index) => {
    const px = x + (index / 79) * width;
    const py = mid - Math.sin((index / 79) * width / Math.max(1, wavelength) * Math.PI * 2) * amplitude * 26;
    return `${index === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`;
  }).join(" ");
  return (
    <g aria-label={label}>
      <rect x={x} y={y} width={width} height={height} rx="14" fill="rgba(15,23,42,.78)" stroke="#93c5fd" />
      <line x1={x + 14} y1={mid} x2={x + width - 14} y2={mid} stroke="#64748b" />
      <path d={path} fill="none" stroke="#facc15" strokeWidth="4" />
      <text x={x + 16} y={y + 22} fill="#e0f2fe" fontWeight="900">{label}</text>
      <text x={x + 16} y={y + height - 12} fill="#bfdbfe">A = {amplitude.toFixed(1)}, lambda = {wavelength.toFixed(1)}</text>
    </g>
  );
}
