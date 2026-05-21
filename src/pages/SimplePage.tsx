import { useEffect, useState } from "react";
import { Toolbar } from "../components/Toolbar";
import i18next from "../i18n";
import { listProjects } from "../lib/storage";
import { useLabStore } from "../store/useLabStore";
import { ProjectFile } from "../types";

export function SimplePage({ title, showProjects = false }: { title: string; showProjects?: boolean }) {
  const [projects, setProjects] = useState<ProjectFile[]>([]);
  const { accessibility, setAccessibility, unitSystem, setUnitSystem, significantFigures, setSignificantFigures } = useLabStore();
  useEffect(() => {
    if (showProjects) listProjects().then(setProjects).catch(() => setProjects([]));
  }, [showProjects]);
  return (
    <div className="min-h-screen">
      <Toolbar />
      <div className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">PhysicsLab 100 module page.</p>
        {title === "Settings" && (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <label className="property-row">
              <span>Language</span>
              <select value={i18next.language} onChange={(event) => { localStorage.setItem("lang", event.target.value); void i18next.changeLanguage(event.target.value); }} className="rounded bg-slate-100 p-1 dark:bg-slate-800">
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </label>
            {[
              ["highContrast", "High contrast mode"],
              ["largeUi", "Larger UI mode"],
              ["colorBlindSafe", "Color-blind safe palette"],
              ["reducedMotion", "Pause/reduce animations"],
            ].map(([key, label]) => (
              <label key={key} className="property-row">
                <span>{label}</span>
                <input type="checkbox" checked={Boolean(accessibility[key as keyof typeof accessibility])} onChange={(event) => setAccessibility({ [key]: event.target.checked })} />
              </label>
            ))}
            <label className="property-row">
              <span>Unit system</span>
              <select value={unitSystem} onChange={(event) => setUnitSystem(event.target.value as "SI" | "CGS")} className="rounded bg-slate-100 p-1 dark:bg-slate-800">
                <option>SI</option>
                <option>CGS</option>
              </select>
            </label>
            <label className="property-row">
              <span>Significant figures</span>
              <input type="number" min={2} max={8} value={significantFigures} onChange={(event) => setSignificantFigures(Number(event.target.value))} />
            </label>
          </div>
        )}
        {showProjects && (
          <div className="mt-6 grid gap-3">
            {projects.length === 0 && <div className="panel p-4">No local projects saved yet.</div>}
            {projects.map((project) => (
              <div key={project.name} className="panel p-4">
                <div className="font-bold">{project.name}</div>
                <div className="text-sm text-slate-500">Updated {new Date(project.updatedAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
