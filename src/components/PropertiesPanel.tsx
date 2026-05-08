import { objectRegistry } from "../lib/objectRegistry";
import { useLabStore } from "../store/useLabStore";
import { PhysicsObjectInstance } from "../types";

export function PropertiesPanel() {
  const { objects, selectedId, updateObject, removeSelected, duplicateSelected } = useLabStore();
  const selected = objects.find((object) => object.id === selectedId);
  if (!selected) {
    return (
      <aside className="panel p-4">
        <h2 className="panel-title">Properties</h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Select an object to inspect mass, position, velocity, energy, material, and constraints.</p>
      </aside>
    );
  }
  const definition = objectRegistry.find((object) => object.id === selected.kind);
  const speed = Math.hypot(selected.vx, selected.vy);
  const momentum = selected.mass * speed;
  const ke = 0.5 * selected.mass * speed * speed;
  const pe = selected.mass * 9.81 * Math.max(0, (560 - selected.y) / 50);

  const setValue = (key: keyof PhysicsObjectInstance, value: string | boolean) => {
    updateObject(selected.id, { [key]: typeof value === "boolean" ? value : Number(value) } as Partial<PhysicsObjectInstance>);
  };

  return (
    <aside className="panel min-h-0 overflow-auto p-4">
      <h2 className="panel-title">{selected.name}</h2>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <Metric label="Speed" value={`${speed.toFixed(2)} m/s`} />
        <Metric label="Momentum" value={`${momentum.toFixed(2)} kg m/s`} />
        <Metric label="Kinetic E" value={`${ke.toFixed(2)} J`} />
        <Metric label="Potential E" value={`${pe.toFixed(2)} J`} />
        <Metric label="Charge" value={`${(selected.charge ?? 0).toFixed(2)} C`} />
        <Metric label="Temp." value={`${(selected.temperature ?? 293.15).toFixed(1)} K`} />
      </div>
      <div className="mt-4 space-y-3">
        {definition?.editableProperties.map((property) => {
          const value = selected[property.key as keyof PhysicsObjectInstance];
          if (property.type === "boolean") {
            return (
              <label key={property.key} className="property-row">
                <span>{property.label}</span>
                <input type="checkbox" checked={Boolean(value)} onChange={(event) => setValue(property.key as keyof PhysicsObjectInstance, event.target.checked)} />
              </label>
            );
          }
          return (
            <label key={property.key} className="property-row">
              <span>{property.label}</span>
              <input
                type="number"
                min={property.min}
                max={property.max}
                step={property.step ?? 0.1}
                value={Number(value ?? 0)}
                onChange={(event) => setValue(property.key as keyof PhysicsObjectInstance, event.target.value)}
              />
            </label>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="rounded bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950" onClick={duplicateSelected}>Duplicate</button>
        <button className="rounded bg-rose-500 px-3 py-2 text-sm font-semibold text-white" onClick={removeSelected}>Delete</button>
      </div>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-300/60 bg-slate-100 p-2 dark:border-lab-line dark:bg-slate-900/70">
      <div className="text-slate-500 dark:text-slate-400">{label}</div>
      <div className="font-mono text-cyan-500">{value}</div>
    </div>
  );
}
