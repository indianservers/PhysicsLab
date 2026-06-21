import { experimentModes, type ExperimentMode } from "./experimentModes";

export function LabModeSwitcher({ mode, onMode }: { mode: ExperimentMode; onMode?: (mode: ExperimentMode) => void }) {
  return (
    <div className="lab-mode-switcher" role="group" aria-label="Premium lab mode">
      {experimentModes.map((item) => (
        <button key={item} type="button" aria-pressed={mode === item} onClick={() => onMode?.(item)}>
          {item}
        </button>
      ))}
    </div>
  );
}
