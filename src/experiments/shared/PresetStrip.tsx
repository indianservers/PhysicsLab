export interface PremiumPreset {
  id: string;
  label: string;
  description: string;
  values?: Record<string, number>;
}

export function PresetStrip({ presets, activePreset, onPreset }: { presets: PremiumPreset[]; activePreset?: string; onPreset?: (preset: PremiumPreset) => void }) {
  return (
    <section className="preset-strip" aria-label="Lab presets">
      <p className="premium-mini-label">Presets</p>
      <div className="preset-strip-buttons">
        {presets.map((preset) => (
          <button key={preset.id} type="button" aria-pressed={activePreset === preset.id} title={preset.description} onClick={() => onPreset?.(preset)}>
            {preset.label}
          </button>
        ))}
      </div>
    </section>
  );
}
