import { MathExpression, MathText } from "./MathExpression";
import { useEffect, useState } from "react";
import type { ExperimentDefinition } from "../types";
import { safeStorage } from "../lib/safeStorage";
import "./virtualLabEnhancements.css";

type Trial = { time: string; values: Array<{ label: string; value: string }> };

function pageControls() {
  return [...document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("[id^='live-lab'] input, [id^='live-lab'] select, [id^='live-lab'] textarea")]
    .filter((item) => !item.closest(".virtual-lab-dock"));
}

function readControls() {
  return pageControls().map((control, index) => ({
    label: control.getAttribute("aria-label") || control.closest("label")?.textContent?.replace(control.value, "").trim() || `Control ${index + 1}`,
    value: control instanceof HTMLInputElement && control.type === "checkbox" ? String(control.checked) : control.value,
  }));
}

export function VirtualLabEnhancements({ experiment }: { experiment: ExperimentDefinition }) {
  const key = `virtual-lab:${experiment.id}`;
  const [saved] = useState(() => {
    const value = safeStorage.readJSON<Partial<{ prediction: string; notes: string; trials: Trial[]; checked: string[] }> | null>(key, null);
    return value && typeof value === "object" ? value : {};
  });
  const [persistenceAvailable, setPersistenceAvailable] = useState(true);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [prediction, setPrediction] = useState(typeof saved.prediction === "string" ? saved.prediction : "");
  const [notes, setNotes] = useState(typeof saved.notes === "string" ? saved.notes : "");
  const [trials, setTrials] = useState<Trial[]>(Array.isArray(saved.trials) ? saved.trials.filter(trial => trial && typeof trial.time === "string" && Array.isArray(trial.values) && trial.values.every(value => typeof value?.label === "string" && typeof value?.value === "string")).slice(-20) : []);
  const [checked, setChecked] = useState<string[]>(Array.isArray(saved.checked) ? saved.checked.filter(value => typeof value === "string") : []);

  useEffect(() => {
    setPersistenceAvailable(safeStorage.writeJSON(key, { prediction, notes, trials, checked }));
  }, [checked, key, notes, prediction, trials]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey && !event.altKey && !event.repeat && event.key.toLowerCase() === "v" && !(event.target instanceof HTMLElement && (event.target.matches("input,select,textarea") || event.target.isContentEditable))) setOpen((value) => !value);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const capture = () => setTrials((items) => [...items.slice(-19), { time: new Date().toLocaleTimeString(), values: readControls() }]);
  const toggleCheck = (label: string) => setChecked((items) => items.includes(label) ? items.filter((item) => item !== label) : [...items, label]);
  const report = () => {
    const text = [`# ${experiment.title}`, `\n## Objective\n${experiment.aim}`, `\n## Prediction\n${prediction || "Not recorded"}`, `\n## Apparatus\n${experiment.apparatus.map((item) => `- ${item}`).join("\n")}`, `\n## Trials\n${trials.map((trial) => `${trial.time}: ${trial.values.map((item) => `${item.label}=${item.value}`).join(", ")}`).join("\n") || "No trials captured"}`, `\n## Notes\n${notes || "No notes recorded"}`].join("\n");
    download(text, `${experiment.id}-lab-report.md`, "text/markdown");
  };

  return <aside className={`virtual-lab-dock ${open ? "is-open" : ""}`} aria-label={`${experiment.title} virtual laboratory tools`}>
    <button className="virtual-lab-handle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>🧪 Virtual lab tools <kbd>V</kbd></button>
    {open && <div className="virtual-lab-panel">
      <header><div><small>EXPERIMENT WORKBENCH</small><strong>{experiment.title}</strong></div><button type="button" onClick={() => setOpen(false)} aria-label="Close virtual lab tools">×</button></header>
      <section><b>Objective</b><p>{experiment.aim}</p></section>
      <section><b>Apparatus inventory</b><div className="virtual-lab-chips">{experiment.apparatus.map((item) => <span key={item}>{item}</span>)}</div></section>
      <section><b>Procedure · {step + 1}/{experiment.procedure.length}</b><p>{experiment.procedure[step] || "Complete the experiment and record your conclusion."}</p><div className="virtual-lab-row"><button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))}>← Previous</button><button type="button" onClick={() => setStep((value) => Math.min(experiment.procedure.length - 1, value + 1))}>Next →</button></div></section>
      <section><b>Safety and setup check</b>{["Identify apparatus and units", "Keep one variable changing", "Stay within the stated range", "Reset after an extreme setup"].map((item) => <label className="virtual-lab-check" key={item}><input type="checkbox" checked={checked.includes(item)} onChange={() => toggleCheck(item)} />{item}</label>)}</section>
      <label className="virtual-lab-field">Prediction<textarea value={prediction} onChange={(event) => setPrediction(event.target.value)} placeholder="Predict the trend before changing controls…" /></label>
      <div className="virtual-lab-actions"><button type="button" onClick={capture}>＋ Capture reading</button><button type="button" onClick={() => download([["Control", "Value"], ...readControls().map((item) => [item.label, item.value])].map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n"), `${experiment.id}-readings.csv`, "text/csv")}>⇩ Export data</button><button type="button" onClick={report}>Report</button><button type="button" onClick={() => window.print()}>Print worksheet</button></div>
      <section className="virtual-lab-formula"><b>Formula reference</b>{experiment.formulae.length ? experiment.formulae.map((formula) => <p key={formula.id}><strong>{formula.name}:</strong> <MathExpression expression={formula.expression} /><br /><small><MathText text={formula.variables.map((item) => `${item.symbol} = ${item.name}${item.unit ? ` (${item.unit})` : ""}`).join(" · ")} /></small></p>) : <p>Build the relationship from repeated observations.</p>}</section>
      <label className="virtual-lab-field">Notebook<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Units, uncertainty, graph trend, conclusion…" /></label>
      <section className="virtual-lab-history"><b>Observation table · {trials.length} trials</b>{trials.length === 0 ? <p>No readings captured yet.</p> : <table><thead><tr><th>Time</th><th>Values</th></tr></thead><tbody>{trials.slice().reverse().map((trial, index) => <tr key={`${trial.time}-${index}`}><td>{trial.time}</td><td>{trial.values.map((item) => `${item.label}: ${item.value}`).join("; ")}</td></tr>)}</tbody></table>}</section>
      <small className="virtual-lab-shortcuts">Press V to open tools · {persistenceAvailable ? "all work saves locally" : "Local saving is unavailable. Export a report to keep your work."}</small>
    </div>}
  </aside>;
}

function download(content: string, filename: string, type: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
