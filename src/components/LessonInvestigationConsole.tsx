import { useEffect, useMemo, useState } from "react";
import type { ExperimentDefinition } from "../types";
import { lessonUiUpgrades } from "../lib/lessonUiUpgrades";
import "./lesson-investigation-console.css";

type TrialSnapshot = { capturedAt: string; controls: Array<[string, string]>; readings: string[] };

const noteKey = (id: string) => `physicslab.investigation-note.${id}`;
const clean = (value: string) => value.replace(/\s+/g, " ").trim();

function labelFor(element: Element) {
  const aria = element.getAttribute("aria-label");
  if (aria) return clean(aria);
  const id = element.getAttribute("id");
  const explicit = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null;
  const label = explicit ?? element.closest("label");
  return clean(label?.textContent ?? element.getAttribute("name") ?? element.tagName.toLowerCase()).slice(0, 72);
}

function captureTrial(experimentId: string): TrialSnapshot | null {
  const root = document.getElementById(`live-lab-${experimentId}`);
  if (!root) return null;
  const controls = [...root.querySelectorAll("input, select, [role='slider']")]
    .filter((element) => (element as HTMLElement).offsetParent !== null)
    .slice(0, 12)
    .map((element): [string, string] => {
      const input = element as HTMLInputElement;
      const value = input.type === "checkbox" ? (input.checked ? "On" : "Off") : input.value || element.getAttribute("aria-valuenow") || "—";
      return [labelFor(element), value];
    });
  const readings = [...root.querySelectorAll("output, [role='status'], .result-card-value, dd")]
    .filter((element) => (element as HTMLElement).offsetParent !== null)
    .map((element) => clean(element.textContent ?? ""))
    .filter(Boolean)
    .filter((value, index, all) => all.indexOf(value) === index)
    .slice(0, 8);
  return { capturedAt: new Date().toLocaleTimeString(), controls, readings };
}

function pressLabControl(experimentId: string, action: "play" | "pause" | "step" | "reset") {
  const root = document.getElementById(`live-lab-${experimentId}`);
  if (!root) return false;
  const patterns = {
    play: /(?:^|\s)(play|run|start|charge|close key|power on|apply load|fill & reveal|narrated turn|release)(?:\s|$)/i,
    pause: /(?:^|\s)pause(?:\s|$)/i,
    step: /(?:^|\s)step(?:\s|$)/i,
    reset: /(?:^|\s)(reset|replay|rinse & reset)(?:\s|$)/i,
  };
  const buttons = [...root.querySelectorAll("button")].filter((button) => button.offsetParent !== null && !button.disabled);
  const matches = buttons.filter((candidate) => {
    const name = `${candidate.getAttribute("aria-label") ?? ""} ${candidate.textContent ?? ""}`;
    if (action === "pause" && /^\s*\+\s*Pause/i.test(candidate.textContent ?? "")) return false;
    return patterns[action].test(clean(name));
  });
  const button = action === "reset"
    ? matches.find((candidate) => /reset experiment|rinse & reset|reset workflow/i.test(`${candidate.getAttribute("aria-label") ?? ""} ${candidate.textContent ?? ""}`)) ?? matches[matches.length - 1]
    : matches[0];
  button?.click();
  return Boolean(button);
}

export function LessonInvestigationConsole({ experiment }: { experiment: ExperimentDefinition }) {
  const upgrade = lessonUiUpgrades[experiment.id];
  const [trialA, setTrialA] = useState<TrialSnapshot | null>(null);
  const [trialB, setTrialB] = useState<TrialSnapshot | null>(null);
  const [note, setNote] = useState(() => {
    try { return localStorage.getItem(noteKey(experiment.id)) ?? ""; } catch { return ""; }
  });
  const [feedback, setFeedback] = useState("Ready to investigate");
  const [timeline, setTimeline] = useState(0);

  useEffect(() => {
    try { localStorage.setItem(noteKey(experiment.id), note); } catch { /* Keep the console usable without storage. */ }
  }, [experiment.id, note]);

  const comparison = useMemo(() => {
    if (!trialA || !trialB) return [];
    const labels = [...new Set([...trialA.controls.map(([label]) => label), ...trialB.controls.map(([label]) => label)])];
    return labels.slice(0, 8).map((label) => [label, trialA.controls.find(([item]) => item === label)?.[1] ?? "—", trialB.controls.find(([item]) => item === label)?.[1] ?? "—"] as const);
  }, [trialA, trialB]);

  if (!upgrade) return null;

  const pin = (slot: "A" | "B") => {
    const snapshot = captureTrial(experiment.id);
    if (!snapshot) { setFeedback("Open the live apparatus before capturing a trial."); return; }
    if (slot === "A") setTrialA(snapshot); else setTrialB(snapshot);
    setFeedback(`Trial ${slot} captured from the live apparatus.`);
  };
  const control = (action: "play" | "pause" | "step" | "reset") => {
    setFeedback(pressLabControl(experiment.id, action) ? `${action[0].toUpperCase()}${action.slice(1)} sent to this lesson.` : `${action} is not available in the current apparatus state.`);
  };
  const scrub = (percent: number) => {
    setTimeline(percent);
    const root = document.getElementById(`live-lab-${experiment.id}`);
    const range = [...(root?.querySelectorAll("input[type='range']") ?? [])].find((input) => /timeline|playback time|phase/i.test(input.getAttribute("aria-label") ?? "")) as HTMLInputElement | undefined;
    if (!range) { setFeedback("This lesson uses direct stepping instead of a scrub timeline."); return; }
    const min = Number(range.min || 0), max = Number(range.max || 100);
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(range, String(min + (max - min) * percent / 100));
    range.dispatchEvent(new Event("input", { bubbles: true }));
    range.dispatchEvent(new Event("change", { bubbles: true }));
    setFeedback(`Timeline moved to ${percent}%.`);
  };
  const exportEvidence = () => {
    const evidence = { lesson: experiment.title, route: experiment.id, investigation: upgrade, trialA, trialB, note, exportedAt: new Date().toISOString() };
    const url = URL.createObjectURL(new Blob([JSON.stringify(evidence, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url; link.download = `${experiment.id}-evidence.json`; link.click();
    URL.revokeObjectURL(url);
    setFeedback("Lesson evidence exported.");
  };

  return (
    <section className="lesson-investigation" aria-labelledby={`investigation-${experiment.id}`}>
      <header>
        <div><span>LESSON-SPECIFIC UI UPGRADE</span><h2 id={`investigation-${experiment.id}`}>{upgrade.mode}</h2><p>{upgrade.focus}</p></div>
        <div className="investigation-transport" aria-label={`${experiment.title} mirrored playback controls`}>
          <button type="button" onClick={() => control("play")}>▶ Play</button>
          <button type="button" onClick={() => control("pause")}>Ⅱ Pause</button>
          <button type="button" onClick={() => control("step")}>▷ Step</button>
          <button type="button" onClick={() => control("reset")}>↻ Reset</button>
        </div>
      </header>

      <div className="causal-chain" aria-label="Lesson causal chain">
        {upgrade.causal.map((item, index) => <div key={item}><small>{index === 0 ? "CHANGE" : index === 1 ? "PHYSICS" : "OBSERVE"}</small><b>{item}</b>{index < 2 && <i aria-hidden="true">→</i>}</div>)}
      </div>

      <div className="investigation-grid">
        <article className="investigation-task"><span>MEASURE</span><p>{upgrade.measure}</p><span>MISSION</span><p>{upgrade.mission}</p></article>
        <article className="timeline-control"><span>SYNCHRONIZED TIMELINE</span><label>Lesson progress<input aria-label={`${experiment.title} synchronized timeline`} type="range" min="0" max="100" step="5" value={timeline} onChange={(event) => scrub(Number(event.target.value))} /></label><small>{timeline}% · direct Step remains available when no timeline is exposed</small></article>
        <article className="trial-capture"><span>A/B COMPARISON</span><div><button type="button" onClick={() => pin("A")}>{trialA ? `Update A · ${trialA.capturedAt}` : "Pin trial A"}</button><button type="button" onClick={() => pin("B")}>{trialB ? `Update B · ${trialB.capturedAt}` : "Pin trial B"}</button></div>{comparison.length > 0 && <table><thead><tr><th>Control</th><th>A</th><th>B</th></tr></thead><tbody>{comparison.map(([label, a, b]) => <tr key={label}><td>{label}</td><td>{a}</td><td>{b}</td></tr>)}</tbody></table>}{trialA && !trialB && <small>Change one variable in the apparatus, then pin trial B.</small>}</article>
        <article className="evidence-capture"><span>EVIDENCE</span><label>Observation and explanation<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder={`Explain how ${upgrade.causal[0].toLowerCase()} changed ${upgrade.causal[2].toLowerCase()}.`} /></label><button type="button" onClick={exportEvidence}>Export lesson evidence</button></article>
      </div>
      <p className="investigation-feedback" role="status" aria-live="polite">{feedback}</p>
    </section>
  );
}
