import { useState } from "react";
import { Link } from "react-router-dom";
import { experiments } from "../lib/experiments";
import { coreFormulae } from "../lib/formulas";
import { objectRegistry } from "../lib/objectRegistry";
import { useLabStore } from "../store/useLabStore";

const topics = ["Mechanics", "Waves", "Optics", "Electricity", "Magnetism", "Thermodynamics", "Fluid Mechanics", "Modern Physics"];
const tabs = ["Topics", "Objects", "Forces", "Instruments", "Graphs", "Experiments", "Formulas"];

export function LeftSidebar() {
  const [tab, setTab] = useState("Objects");
  const addObject = useLabStore((state) => state.addObject);
  return (
    <aside className="panel flex min-h-0 flex-col overflow-hidden" aria-label="Physics lab library">
      <div className="grid grid-cols-3 gap-1 border-b border-slate-300/60 p-2 dark:border-lab-line">
        {tabs.map((item) => (
          <button key={item} title={`${item} library`} className={item === tab ? "tab-active" : "tab-btn"} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        {tab === "Topics" && <TileLinks items={topics.map((topic) => ({ label: topic, href: `/topics/${topic.toLowerCase().replace(/\s+/g, "-")}` }))} />}
        {tab === "Objects" && (
          <div className="grid grid-cols-2 gap-2">
            {objectRegistry.map((object) => (
              <button key={object.id} title={`Add ${object.name}`} className="object-tile" onClick={() => addObject(object.id)}>
                <span className="text-sm font-mono">{object.icon}</span>
                <span>{object.name}</span>
              </button>
            ))}
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
