import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { experiments } from "../lib/experiments";
import { coreFormulae } from "../lib/formulas";
import { createObject, objectRegistry } from "../lib/objectRegistry";
import { useLabStore } from "../store/useLabStore";
import { PhysicsObjectInstance } from "../types";
import { GuidePanel } from "./GuidePanel";
import { guideForTool } from "../lib/guides";

const topics = ["Mechanics", "Waves", "Optics", "Electricity", "Magnetism", "Thermodynamics", "Fluid Mechanics", "Modern Physics", "Energy"];
const tabs = ["Topics", "Objects", "Forces", "Instruments", "Graphs", "Experiments", "Formulas", "Quantum"];
const circuitKinds = ["battery", "resistor", "bulb", "switch", "ammeter", "voltmeter", "wire"];

export function LeftSidebar() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("Objects");
  const { addObject, selectedTool, setSelectedTool, setObjects, objects, selectedId, selectObject, updateObject, removeSelected, duplicateSelected } = useLabStore();
  const selected = objects.find((object) => object.id === selectedId);
  const circuitObjects = objectRegistry.filter((object) => circuitKinds.includes(object.id));
  const otherObjects = objectRegistry.filter((object) => !circuitKinds.includes(object.id));

  const spawnChaosDemo = () => {
    const left = createObject("double-pendulum", 0, 0);
    const right = createObject("double-pendulum", 0, 0);
    const pair = [
      { ...left, id: crypto.randomUUID(), pivotX: 330, pivotY: 105, angle1: 1.22, angle2: 1.95, color: "#fb923c", trail: [] },
      { ...right, id: crypto.randomUUID(), pivotX: 570, pivotY: 105, angle1: 1.221, angle2: 1.95, color: "#22d3ee", trail: [] },
    ];
    setObjects([...objects, ...pair]);
    selectObject(pair[0].id);
  };

  if (selected) {
    const definition = objectRegistry.find((object) => object.id === selected.kind);
    return (
      <aside className="panel flex min-h-0 flex-col overflow-auto p-4" aria-label="Selected object inspector">
        <div className="drawer-head mb-4">
          <div>
            <div className="ui-label">{definition?.category ?? selected.kind}</div>
            <h2 className="ui-title mt-1">{selected.name}</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Focused controls for the selected object.</p>
          </div>
          <button className="drawer-close-btn" type="button" onClick={() => selectObject(undefined)} aria-label="Close selected object controls">Close</button>
        </div>
        <GuidePanel guide={guideForTool(selected.name)} compact />
        <div className="space-y-3">
          {definition?.editableProperties.slice(0, 10).map((property) => {
            const value = selected[property.key as keyof PhysicsObjectInstance];
            if (property.type === "boolean") {
              return <label key={property.key} className="property-row"><span>{property.label}</span><input type="checkbox" checked={Boolean(value)} onChange={(event) => updateObject(selected.id, { [property.key]: event.target.checked } as Partial<PhysicsObjectInstance>)} /></label>;
            }
            return <label key={property.key} className="property-row"><span>{property.label}</span><input type="number" min={property.min} max={property.max} step={property.step ?? 0.1} value={Number(value ?? 0)} onChange={(event) => updateObject(selected.id, { [property.key]: Number(event.target.value) } as Partial<PhysicsObjectInstance>)} /></label>;
          })}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="tool-btn" onClick={duplicateSelected}>Duplicate</button>
          <button className="tool-btn" onClick={() => updateObject(selected.id, { locked: !selected.locked })}>{selected.locked ? "Unlock" : "Lock"}</button>
          <button className="tool-btn" onClick={() => addObject("force-arrow", selected.x + 60, selected.y)}>Add Force</button>
          <button className="rounded-md bg-rose-500 px-3 py-2 text-sm font-semibold text-white" onClick={removeSelected}>Delete</button>
        </div>
        <button className="mt-4 text-left text-xs font-semibold text-cyan-500" onClick={() => selectObject(undefined)}>Back to object library</button>
      </aside>
    );
  }

  return (
    <aside className="panel flex min-h-0 flex-col overflow-hidden" aria-label="Physics lab library">
      <div className="grid grid-cols-3 gap-1 border-b border-slate-300/60 p-2 dark:border-lab-line">
        {tabs.map((item) => (
          <button key={item} title={`${item} library`} className={item === tab ? "tab-active" : "tab-btn"} onClick={() => setTab(item)}>
            {t(`sidebar.${item.charAt(0).toLowerCase()}${item.slice(1).replace(/\s+/g, "")}`, item)}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        <div className="mb-3">
          <GuidePanel guide={guideForTool(`${tab} tool`)} compact />
        </div>
        {tab === "Topics" && <TileLinks items={topics.map((topic) => ({ label: topic, href: `/topics/${topic.toLowerCase().replace(/\s+/g, "-")}` }))} />}
        {tab === "Objects" && (
          <div className="space-y-4">
            <ObjectGrid objects={otherObjects} onAdd={(id) => addObject(id)} />
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t("sidebar.circuits")}</div>
              <div className="grid grid-cols-2 gap-2">
                {circuitObjects.map((object) => (
                  <button
                    key={object.id}
                    title={object.id === "wire" ? "Wire tool" : `Add ${object.name}`}
                    className={object.id === "wire" && selectedTool === "wire" ? "object-tile border-cyan-400" : "object-tile"}
                    draggable={object.id !== "wire"}
                    onDragStart={(event) => {
                      if (object.id === "wire") return;
                      event.dataTransfer.setData("application/x-physics-object", object.id);
                      event.dataTransfer.effectAllowed = "copy";
                    }}
                    onClick={() => object.id === "wire" ? setSelectedTool(selectedTool === "wire" ? "select" : "wire") : addObject(object.id)}
                  >
                    <span className="text-sm font-mono">{object.icon}</span>
                    <span>{object.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === "Forces" && <ActionTiles items={["Force Arrow", "Velocity Arrow", "Acceleration Arrow", "Gravity Field", "Electric Field Region", "Bar Magnet"]} />}
        {tab === "Instruments" && <ActionTiles items={["Stopwatch", "Ruler", "Protractor", "Motion Sensor", "Force Sensor", "Graph Plotter", "Thermometer"]} />}
        {tab === "Graphs" && <ActionTiles items={["x-time", "y-time", "velocity-time", "energy-time", "P-V", "V-I", "Intensity-Angle", "Wavelength-Frequency"]} />}
        {tab === "Experiments" && (
          <div className="space-y-2">
            {experiments.slice(0, 10).map((experiment) => (
              <Link key={experiment.id} to={`/experiments/${experiment.id}`} className="block rounded border border-slate-300/60 p-2 text-sm hover:border-cyan-400 dark:border-lab-line">
                {experiment.title}
              </Link>
            ))}
            <button className="block w-full rounded border border-slate-300/60 p-2 text-left text-sm hover:border-cyan-400 dark:border-lab-line" onClick={spawnChaosDemo}>
              {t("experiments.Chaos Demo")}
            </button>
          </div>
        )}
        {tab === "Quantum" && (
          <div className="grid gap-2">
            <Link to="/quantum" className="pill">Photoelectric Effect</Link>
            <Link to="/quantum" className="pill">Quantum Tunneling</Link>
            <Link to="/quantum" className="pill">Bohr Model</Link>
          </div>
        )}
        {tab === "Formulas" && (
          <div className="space-y-2 text-sm">
            {coreFormulae.map((formula) => (
              <div key={formula.id} className="rounded border border-slate-300/60 p-2 dark:border-lab-line">
                <div className="font-semibold text-cyan-500">{formula.name}</div>
                <code className="text-xs">{formula.expression}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function ObjectGrid({ objects, onAdd }: { objects: typeof objectRegistry; onAdd: (id: (typeof objectRegistry)[number]["id"]) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {objects.map((object) => (
        <button
          key={object.id}
          title={`Add ${object.name}`}
          className={`object-card object-card-${categoryClass(object.category)}`}
          draggable
          onClick={() => onAdd(object.id)}
          onDragStart={(event) => {
            event.dataTransfer.setData("application/x-physics-object", object.id);
            event.dataTransfer.effectAllowed = "copy";
          }}
        >
          <span className="object-card-icon">{categoryIcon(object.category, object.icon)}</span>
          <span>{object.name}</span>
        </button>
      ))}
    </div>
  );
}

function categoryClass(category: string) {
  if (category.includes("Electric") || category.includes("Circuits")) return "electricity";
  if (category.includes("Optics")) return "optics";
  if (category.includes("Wave") || category.includes("Oscillation")) return "waves";
  if (category.includes("Thermal") || category.includes("Thermo")) return "thermal";
  return "mechanics";
}

function categoryIcon(category: string, fallback: string) {
  if (category.includes("Electric") || category.includes("Circuits")) return "⚡";
  if (category.includes("Optics")) return "✦";
  if (category.includes("Wave") || category.includes("Oscillation")) return "∿";
  if (category.includes("Thermal") || category.includes("Thermo")) return "≋";
  if (category.includes("Mechanics")) return "➤";
  return fallback;
}

function TileLinks({ items }: { items: { label: string; href: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => <Link key={item.label} to={item.href} className="pill">{item.label}</Link>)}
    </div>
  );
}

function ActionTiles({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => <button key={item} title={item} className="pill">{item}</button>)}
    </div>
  );
}
