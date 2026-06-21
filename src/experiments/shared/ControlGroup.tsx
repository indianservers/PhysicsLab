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
  return (
    <section className="dedicated-control-group" aria-label={title}>
      <div className="dedicated-control-head">
        <div>
          <p className="ui-label">Inputs</p>
          <h3>{title}</h3>
        </div>
        {onReset && <button type="button" onClick={onReset} disabled={disabled}>Reset</button>}
      </div>

      {presets.length > 0 && (
        <div className="dedicated-control-presets" aria-label="Control presets">
          {presets.map((preset) => (
            <button key={preset.id} type="button" onClick={() => onPreset?.(preset)} disabled={disabled}>
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
              <span>{control.label}</span>
              <strong>{formatControlValue(control.value, control.step)} {control.unit}</strong>
              <input
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
