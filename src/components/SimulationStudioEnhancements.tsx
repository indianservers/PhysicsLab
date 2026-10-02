import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "./simulationStudioEnhancements.css";

type Trial = { time: string; values: Array<{ label: string; value: string }> };
type StudioMode = "Observe" | "Predict" | "Experiment" | "Explain";

const MODES: StudioMode[] = ["Observe", "Predict", "Experiment", "Explain"];

function isStudioPath(pathname: string) {
  return /(^|\/)(motion|mechanics|measurement|electricity|magnetism|optics|thermodynamics|fluid-mechanics|modern-physics|astrophysics|electronics)\//.test(pathname)
    || pathname.startsWith("/concept-studio/")
    || pathname === "/graph";
}

function controls() {
  return [...document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    'input:not([type="button"]):not([type="submit"]), select, textarea',
  )].filter((item) => !item.closest(".studio-enhancement-dock"));
}

function controlValues() {
  return controls().map((control, index) => ({
    label: control.getAttribute("aria-label") || control.closest("label")?.textContent?.replace(control.value, "").trim() || `Control ${index + 1}`,
    value: control.value,
  }));
}

export function SimulationStudioEnhancements() {
  const { pathname } = useLocation();
  const active = isStudioPath(pathname);
  const storageKey = `simulation-studio:${pathname}`;
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<StudioMode>("Observe");
  const [prediction, setPrediction] = useState("");
  const [notes, setNotes] = useState("");
  const [trials, setTrials] = useState<Trial[]>([]);
  const [baseline, setBaseline] = useState<Array<{ label: string; value: string }> | null>(null);

  const pageTitle = useMemo(() => document.title.replace(/\s*[|·].*$/, "") || "Simulation Studio", [pathname]);

  useEffect(() => {
    if (!active) return;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null") as { mode?: StudioMode; prediction?: string; notes?: string; trials?: Trial[] } | null;
      if (saved) {
        setMode(saved.mode || "Observe");
        setPrediction(saved.prediction || "");
        setNotes(saved.notes || "");
        setTrials(saved.trials || []);
      }
    } catch { /* local storage may be unavailable in private browsing */ }
    return () => document.documentElement.removeAttribute("data-studio-mode");
  }, [active, storageKey]);

  useEffect(() => {
    if (!active) return;
    document.documentElement.dataset.studioMode = mode.toLowerCase();
    localStorage.setItem(storageKey, JSON.stringify({ mode, prediction, notes, trials }));
  }, [active, mode, notes, prediction, storageKey, trials]);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key.toLowerCase() === "h") setOpen((value) => !value);
      if (event.key.toLowerCase() === "f") document.documentElement.requestFullscreen?.();
      if (event.key.toLowerCase() === "e") exportCsv();
      if (event.key.toLowerCase() === "r") clickButton(/reset|restart|clear/i);
      if (event.key.toLowerCase() === "s") clickButton(/step|advance/i);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, pathname, trials]);

  if (!active) return null;

  const captureTrial = () => setTrials((items) => [...items.slice(-19), { time: new Date().toLocaleTimeString(), values: controlValues() }]);
  const saveState = () => {
    localStorage.setItem(`${storageKey}:controls`, JSON.stringify(controlValues()));
    localStorage.setItem(storageKey, JSON.stringify({ mode, prediction, notes, trials }));
  };
  const restoreState = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(`${storageKey}:controls`) || "[]") as Array<{ value: string }>;
      controls().forEach((control, index) => {
        if (saved[index]) {
          control.value = saved[index].value;
          control.dispatchEvent(new Event("input", { bubbles: true }));
          control.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    } catch { /* ignore malformed local state */ }
  };
  const setCompareBaseline = () => setBaseline(controlValues());
  const compareCount = baseline ? controlValues().filter((item, index) => item.value !== baseline[index]?.value).length : 0;

  return (
    <aside className={`studio-enhancement-dock ${open ? "is-open" : ""}`} aria-label={`${pageTitle} studio tools`}>
      <button className="studio-enhancement-handle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span>⚙ Studio tools</span><kbd>H</kbd>
      </button>
      {open && <div className="studio-enhancement-panel">
        <div className="studio-enhancement-title"><div><small>COMMON STUDIO LAYER</small><strong>{pageTitle}</strong></div><button type="button" onClick={() => setOpen(false)} aria-label="Close studio tools">×</button></div>
        <div className="studio-enhancement-modes" role="tablist" aria-label="Learning mode">
          {MODES.map((item) => <button key={item} type="button" role="tab" aria-selected={mode === item} onClick={() => setMode(item)}>{item}</button>)}
        </div>
        {mode === "Predict" && <label className="studio-enhancement-field">Prediction<textarea value={prediction} onChange={(event) => setPrediction(event.target.value)} placeholder="What do you expect to change?" /></label>}
        <div className="studio-enhancement-actions">
          <button type="button" onClick={() => clickButton(/reset|restart|clear/i)}>↻ Reset</button>
          <button type="button" onClick={() => clickButton(/step|advance/i)}>▶ Step</button>
          <button type="button" onClick={() => document.documentElement.requestFullscreen?.()}>⛶ Fullscreen <kbd>F</kbd></button>
          <button type="button" onClick={captureTrial}>＋ Capture trial</button>
          <button type="button" onClick={exportCsv}>⇩ Export CSV <kbd>E</kbd></button>
          <button type="button" onClick={saveState}>Save state</button>
          <button type="button" onClick={restoreState}>Restore state</button>
          <button type="button" onClick={setCompareBaseline}>Set comparison baseline</button>
        </div>
        {baseline && <p className="studio-enhancement-status">Comparison: {compareCount} control value{compareCount === 1 ? "" : "s"} changed.</p>}
        <label className="studio-enhancement-field">Notebook<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Record observations, units, and conclusions…" /></label>
        <div className="studio-enhancement-trials"><strong>Trial history <span>{trials.length}/20</span></strong>{trials.length === 0 ? <p>No trials captured yet.</p> : trials.slice().reverse().map((trial, index) => <details key={`${trial.time}-${index}`}><summary>{trial.time} · {trial.values.length} values</summary><pre>{trial.values.map((item) => `${item.label}: ${item.value}`).join("\n")}</pre></details>)}</div>
        <small className="studio-enhancement-help">Shortcuts: H tools · F fullscreen · R reset · S step · E export</small>
      </div>}
    </aside>
  );
}

function clickButton(pattern: RegExp) {
  const button = [...document.querySelectorAll<HTMLButtonElement>("button")].find((item) => pattern.test(item.textContent || "") && !item.closest(".studio-enhancement-dock"));
  button?.click();
}

function exportCsv() {
  const rows = [["Control", "Value"], ...controlValues().map((item) => [item.label, item.value])];
  const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${location.pathname.split("/").filter(Boolean).pop() || "simulation"}-trial.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
