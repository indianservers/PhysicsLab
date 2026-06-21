import { useEffect, useState } from "react";
import { objectRegistry } from "../lib/objectRegistry";
import { useLabStore } from "../store/useLabStore";
import { PhysicsObjectInstance } from "../types";

export function PropertiesPanel() {
  const { objects, selectedId, selectObject, updateObject, removeSelected, duplicateSelected } = useLabStore();
  const [dismissed, setDismissed] = useState(false);
  const selected = objects.find((object) => object.id === selectedId);

  useEffect(() => {
    if (selected) setDismissed(false);
  }, [selected?.id]);

  const closeDrawer = () => {
    selectObject(undefined);
    setDismissed(true);
  };

  if (!selected && dismissed) return null;

  if (!selected) {
    return (
      <aside className="properties-drawer properties-drawer-empty">
        <div className="drawer-head">
          <h2 className="panel-title">No object selected</h2>
          <button className="drawer-close-btn" type="button" onClick={closeDrawer} aria-label="Close properties panel">Close</button>
        </div>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Click any object on the canvas to open mass, velocity, energy, and material controls here.</p>
      </aside>
    );
  }
  const definition = objectRegistry.find((object) => object.id === selected.kind);
  const speed = Math.hypot(selected.vx, selected.vy);
  const momentum = selected.mass * speed;
  const ke = 0.5 * selected.mass * speed * speed;
  const pe = selected.mass * 9.81 * Math.max(0, (560 - selected.y) / 50);
  const isCircuit = ["battery", "resistor", "bulb", "switch", "ammeter", "voltmeter", "wire"].includes(selected.kind);

  const setValue = (key: keyof PhysicsObjectInstance, value: string | boolean) => {
    const next = typeof value === "boolean" ? value : value;
    updateObject(selected.id, { [key]: typeof next === "string" && next !== "" && !Number.isFinite(Number(next)) ? next : typeof next === "boolean" ? next : Number(next) } as Partial<PhysicsObjectInstance>);
  };

  const setMaterial = (material: string) => {
    const refractiveIndex = material === "water" ? 1.33 : material === "diamond" ? 2.42 : 1.5;
    updateObject(selected.id, { material, refractiveIndex });
  };

  const setFluidPreset = (preset: string) => {
    const values = {
      Water: { density: 1000, viscosity: 0.001, color: "rgba(56,189,248,0.28)" },
      Oil: { density: 900, viscosity: 0.1, color: "rgba(250,204,21,0.24)" },
      Honey: { density: 1400, viscosity: 10, color: "rgba(251,146,60,0.32)" },
      Air: { density: 1.2, viscosity: 0.000018, color: "rgba(226,232,240,0.16)" },
    }[preset];
    if (values) updateObject(selected.id, values);
  };

  return (
    <aside className="properties-drawer properties-drawer-open">
      <div className="drawer-head">
        <div>
          <h2 className="ui-title">{selected.name}</h2>
          <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{definition?.name ?? selected.kind}</p>
        </div>
        <button className="drawer-close-btn" type="button" onClick={closeDrawer} aria-label="Close properties panel">Close</button>
      </div>
      <details className="property-section mt-4" open>
        <summary>Motion metrics</summary>
        <div className="property-section-body grid gap-2 text-xs">
          <Metric label="Velocity" value={`${speed.toFixed(2)} m/s`} ratio={speed / 20} />
          <Metric label="Momentum" value={`${momentum.toFixed(2)} kg m/s`} ratio={momentum / 50} />
          <Metric label="Kinetic Energy" value={`${ke.toFixed(2)} J`} ratio={ke / 120} />
          <Metric label="Potential Energy" value={`${pe.toFixed(2)} J`} ratio={pe / 120} />
          {isCircuit && <Metric label="Current" value={`${(selected.current ?? 0).toFixed(3)} A`} ratio={Math.abs(selected.current ?? 0) / 5} />}
          {isCircuit && <Metric label="Voltage" value={`${(selected.voltageDiff ?? selected.voltage ?? 0).toFixed(3)} V`} ratio={Math.abs(selected.voltageDiff ?? selected.voltage ?? 0) / 20} />}
          {selected.kind === "bulb" && <Metric label="Brightness" value={`${Math.round((selected.brightness ?? 0) * 100)}%`} ratio={selected.brightness ?? 0} />}
          {selected.kind === "double-pendulum" && <Metric label="Omega 1" value={`${(selected.omega1 ?? 0).toFixed(3)} rad/s`} ratio={Math.abs(selected.omega1 ?? 0) / 10} />}
          {selected.kind === "double-pendulum" && <Metric label="Omega 2" value={`${(selected.omega2 ?? 0).toFixed(3)} rad/s`} ratio={Math.abs(selected.omega2 ?? 0) / 10} />}
        </div>
      </details>
      <details className="property-section mt-3" open>
        <summary>Editable properties</summary>
        <div className="property-section-body space-y-3">
          {selected.kind === "fluid-region" && (
            <label className="property-row">
              <span>Preset</span>
              <select className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800" onChange={(event) => setFluidPreset(event.target.value)} defaultValue="Water">
                <option>Water</option>
                <option>Oil</option>
                <option>Honey</option>
                <option>Air</option>
              </select>
            </label>
          )}
          {definition?.editableProperties.map((property) => {
            const value = selected[property.key as keyof PhysicsObjectInstance];
            if (property.type === "select" && property.key === "material") {
              return (
                <label key={property.key} className="property-row">
                  <span>{property.label}</span>
                  <select className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800" value={String(selected.material ?? "glass")} onChange={(event) => setMaterial(event.target.value)}>
                    <option value="glass">glass n=1.5</option>
                    <option value="water">water n=1.33</option>
                    <option value="diamond">diamond n=2.42</option>
                  </select>
                </label>
              );
            }
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
      </details>
      <div className="property-drawer-actions">
        <button className="tool-btn justify-center" onClick={duplicateSelected}>Duplicate</button>
        <button className="tool-btn justify-center" onClick={closeDrawer}>Close</button>
        <button className="tool-btn justify-center text-rose-300" onClick={removeSelected}>Delete</button>
      </div>
    </aside>
  );
}

function Metric({ label, value, ratio = 0 }: { label: string; value: string; ratio?: number }) {
  const pct = Math.max(0, Math.min(100, ratio * 100));
  return (
    <div className="metric-card">
      <div className="ui-label">{label}</div>
      <div className="mt-2 flex items-center gap-3">
        <div className="metric-bar"><span style={{ width: `${pct}%` }} /></div>
        <div className="ui-value">{value}</div>
      </div>
    </div>
  );
}
