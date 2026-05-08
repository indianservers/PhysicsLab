import { Link } from "react-router-dom";
import { objectRegistry } from "../lib/objectRegistry";
import { experiments } from "../lib/experiments";
import { useLabStore } from "../store/useLabStore";

const topics = ["Mechanics", "Waves", "Optics", "Electricity", "Magnetism", "Thermodynamics", "Fluids", "Modern Physics"];

export function LeftSidebar() {
  const addObject = useLabStore((state) => state.addObject);
  return (
    <aside className="panel flex min-h-0 flex-col overflow-hidden">
      <div className="sidebar-section">
        <h2>Topics</h2>
        <div className="grid grid-cols-2 gap-2">
          {topics.map((topic) => (
            <Link key={topic} to={`/topics/${topic.toLowerCase().replace(" ", "-").replace("fluids", "fluid-mechanics")}`} className="pill">
              {topic}
            </Link>
          ))}
        </div>
      </div>
      <div className="sidebar-section">
        <h2>Objects</h2>
        <div className="grid grid-cols-2 gap-2">
          {objectRegistry.map((object) => (
            <button key={object.id} className="object-tile" onClick={() => addObject(object.id)}>
              <span className="text-xl">{object.icon}</span>
              <span>{object.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="sidebar-section">
        <h2>Forces & Instruments</h2>
        <div className="grid grid-cols-2 gap-2">
          {["Force Arrow", "Ruler", "Protractor", "Stopwatch", "Motion Sensor", "Graph Plotter"].map((item) => (
            <button key={item} className="pill">{item}</button>
          ))}
        </div>
      </div>
      <div className="sidebar-section min-h-0 flex-1 overflow-auto">
        <h2>Experiments</h2>
        <div className="space-y-2">
          {experiments.slice(0, 10).map((experiment) => (
            <Link key={experiment.id} to={`/experiments/${experiment.id}`} className="block rounded border border-slate-300/60 p-2 text-sm hover:border-cyan-400 dark:border-lab-line">
              {experiment.title}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
