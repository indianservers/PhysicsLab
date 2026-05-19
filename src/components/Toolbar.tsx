import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { saveProject } from "../lib/storage";
import { useLabStore } from "../store/useLabStore";
import { ProjectFile } from "../types";

export function Toolbar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    running,
    toggleRunning,
    resetSandbox,
    stepSimulation,
    gravity,
    setGravity,
    timeScale,
    setTimeScale,
    airResistance,
    setAirResistance,
    viewport,
    resetViewport,
    theme,
    setTheme,
    toProject,
    loadProject,
  } = useLabStore();

  const exportJson = () => {
    const project = toProject("PhysicsLab 100 Project");
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "physicslab-project.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPng = () => {
    const canvas = document.querySelector<HTMLCanvasElement>("[data-physics-canvas='true']");
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "physicslab-canvas.png";
    link.click();
  };

  const importJson = async (file: File) => {
    const text = await file.text();
    loadProject(JSON.parse(text) as ProjectFile);
  };

  const save = async () => {
    await saveProject(toProject("PhysicsLab 100 Project"));
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
      if (event.key.toLowerCase() === "s" && !event.ctrlKey) {
        event.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <header className="flex min-h-14 items-center gap-2 border-b border-slate-300/60 bg-white/80 px-3 backdrop-blur dark:border-lab-line dark:bg-slate-950/70">
      <Link to="/" className="mr-2 whitespace-nowrap text-lg font-bold text-cyan-500">
        PhysicsLab 100
      </Link>
      <button className="tool-btn" title="New experiment" onClick={resetSandbox}>New</button>
      <button className="tool-btn" onClick={() => inputRef.current?.click()}>Open</button>
      <button className="tool-btn" onClick={save}>Save</button>
      <button className="tool-btn" onClick={exportJson}>Export JSON</button>
      <button className="tool-btn" onClick={() => inputRef.current?.click()}>Import JSON</button>
      <button className="tool-btn" onClick={exportPng}>Export PNG</button>
      <button className="tool-btn" onClick={() => window.print()}>Export PDF</button>
      <span className="mx-1 h-7 w-px bg-slate-300 dark:bg-lab-line" />
      <button className="tool-btn-primary" onClick={toggleRunning}>{running ? "Pause" : "Run"}</button>
      <button className="tool-btn" onClick={stepSimulation}>Step</button>
      <button className="tool-btn" onClick={resetSandbox}>Reset</button>
      <button className="tool-btn" onClick={() => setTimeScale(0.35)}>Slow motion</button>
      <label className="toolbar-field">
        Speed
        <input type="range" min="0.1" max="2" step="0.1" value={timeScale} onChange={(event) => setTimeScale(Number(event.target.value))} />
      </label>
      <label className="toolbar-field">
        Gravity
        <input className="w-16 rounded bg-slate-100 px-2 py-1 dark:bg-slate-800" type="number" step="0.1" value={gravity} onChange={(event) => setGravity(Number(event.target.value))} />
      </label>
      <label className="toolbar-field">
        Air
        <input type="checkbox" checked={airResistance} onChange={(event) => setAirResistance(event.target.checked)} />
      </label>
      <button className="tool-btn" onClick={resetViewport}>View {Math.round(viewport.zoom * 100)}%</button>
      <button className="tool-btn ml-auto" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Theme</button>
      <Link to="/help" className="tool-btn">Help</Link>
      <input ref={inputRef} className="hidden" type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && importJson(event.target.files[0])} />
    </header>
  );
}
