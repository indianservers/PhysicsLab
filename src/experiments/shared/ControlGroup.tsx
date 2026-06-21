export interface ExperimentControl {
  id: string;
  label: string;
  unit?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  defaultValue: number;
}

export interface ControlPreset {
  id: string;
  label: string;
  values: Record<string, number>;
  description?: string;
}

export interface ControlGroupProps {
  title?: string;
  controls: ExperimentControl[];
  disabled?: boolean;
  presets?: ControlPreset[];
  onChange: (id: string, value: number) => void;
  onReset?: () => void;
  onPreset?: (preset: ControlPreset) => void;
}

export function ControlGroup({ title = "Controls", controls, disabled = false, presets = [], onChange, onReset, onPreset }: ControlGroupProps) {
  const builtInPresets: ControlPreset[] = [
    { id: "default", label: "Default", values: Object.fromEntries(controls.map((control) => [control.id, control.defaultValue])), description: "Return every visible control to its normal value." },
    { id: "low-value", label: "Low value", values: Object.fromEntries(controls.map((control) => [control.id, control.min])), description: "Show a low-end comparison." },
    { id: "high-value", label: "High value", values: Object.fromEntries(controls.map((control) => [control.id, control.max])), description: "Show a high-end comparison." },
    { id: "misconception-demo", label: "Misconception demo", values: Object.fromEntries(controls.map((control, index) => [control.id, index === 0 ? control.max : control.min])), description: "Use an extreme setup that often reveals a wrong prediction." },
    { id: "real-world-demo", label: "Real-world demo", values: Object.fromEntries(controls.map((control) => [control.id, control.defaultValue])), description: "Return to a classroom-scale real-world setup." },
  ];
  const mergedPresets = [...builtInPresets, ...presets];
  const applyPreset = (preset: ControlPreset) => {
    if (onPreset) {
      onPreset(preset);
      return;
    }
    Object.entries(preset.values).forEach(([id, value]) => onChange(id, value));
  };

  return (
    <section className="dedicated-control-group" aria-label={title}>
      <div className="dedicated-control-head">
        <div>
          <p className="ui-label">Inputs</p>
          <h3>{title}</h3>
        </div>
        {onReset && <button type="button" onClick={onReset} disabled={disabled} aria-label={`Reset ${title}`}>Reset</button>}
      </div>

      {mergedPresets.length > 0 && (
        <div className="dedicated-control-presets" aria-label="Control presets">
          {mergedPresets.map((preset) => (
            <button key={preset.id} type="button" onClick={() => applyPreset(preset)} disabled={disabled} title={preset.description} aria-label={`Apply ${preset.label} preset for ${title}`}>
              {preset.label}
            </button>
          ))}
        </div>
      )}

      <div className="dedicated-control-list">
        {controls.map((control) => {
          const progress = ((control.value - control.min) / Math.max(control.step, control.max - control.min)) * 100;
          return (
            <label key={control.id} className="dedicated-control">
              <span id={`${control.id}-label`}>{control.label}{control.unit ? ` (${control.unit})` : ""}</span>
              <strong>{formatControlValue(control.value, control.step)} {control.unit}</strong>
              <input
                aria-labelledby={`${control.id}-label`}
                aria-valuemin={control.min}
                aria-valuemax={control.max}
                aria-valuenow={control.value}
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={control.value}
                disabled={disabled}
                onChange={(event) => onChange(control.id, Number(event.target.value))}
                style={{ backgroundSize: `${Math.max(0, Math.min(100, progress))}% 100%` }}
              />
              <small><b>{control.min}</b><b>{control.max}</b></small>
            </label>
          );
        })}
      </div>
    </section>
  );
}

function formatControlValue(value: number, step: number) {
  if (step < 0.01) return value.toFixed(3);
  if (step < 0.1) return value.toFixed(2);
  if (step < 1) return value.toFixed(1);
  return value.toFixed(0);
}
