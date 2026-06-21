export interface EnergyBar {
  label: string;
  value: number;
  max: number;
  unit?: string;
}

export function EnergyBarSystem({ bars, title = "Energy bars" }: { bars: EnergyBar[]; title?: string }) {
  return (
    <section className="energy-bar-system" aria-label={title}>
      <p className="premium-mini-label">{title}</p>
      {bars.map((bar) => {
        const width = Math.max(0, Math.min(100, (bar.value / Math.max(1e-9, bar.max)) * 100));
        return (
          <div className="energy-bar" key={bar.label}>
            <div className="energy-bar-label">
              {bar.label}: <strong>{bar.value.toFixed(2)}{bar.unit ? ` ${bar.unit}` : ""}</strong>
            </div>
            <div className="energy-bar-track">
              <span className="energy-bar-fill" style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
