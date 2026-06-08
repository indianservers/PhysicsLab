import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import i18next from "../i18n";
import { experiments } from "../lib/experiments";
import { listLearningRecords, progressPercent } from "../lib/learning";
import { listProjects } from "../lib/storage";
import { useLabStore } from "../store/useLabStore";
import { ProjectFile } from "../types";

export function SimplePage({ title, showProjects = false }: { title: string; showProjects?: boolean }) {
  const [projects, setProjects] = useState<ProjectFile[]>([]);
  const [learningRecords, setLearningRecords] = useState(listLearningRecords());
  const { accessibility, setAccessibility, unitSystem, setUnitSystem, significantFigures, setSignificantFigures } = useLabStore();
  useEffect(() => {
    if (showProjects) listProjects().then(setProjects).catch(() => setProjects([]));
    if (showProjects) setLearningRecords(listLearningRecords());
  }, [showProjects]);
  return (
    <div className="min-h-screen">
      <Toolbar />
      <div id="content" className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{introFor(title)}</p>
        {title === "Help" && <HelpContent />}
        {title === "Graphs" && <GraphsContent />}
        {title === "Privacy" && <PrivacyContent />}
        {title === "Terms" && <TermsContent />}
        {title === "Settings" && (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <label className="property-row">
              <span>Language</span>
              <select value={i18next.language} onChange={(event) => { localStorage.setItem("lang", event.target.value); void i18next.changeLanguage(event.target.value); }} className="rounded bg-slate-100 p-1 dark:bg-slate-800">
                <option value="en">English</option>
                <option value="hi">&#2361;&#2367;&#2344;&#2381;&#2342;&#2368;</option>
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
          <>
            <section className="mt-6">
              <h2 className="mb-3 text-xl font-black">Learning Portfolio</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {learningRecords.length === 0 && <div className="panel p-4">No guided learning records yet.</div>}
                {learningRecords.map((record) => {
                  const experiment = experiments.find((item) => item.id === record.experimentId);
                  return (
                    <div key={record.experimentId} className="panel p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold">{experiment?.title ?? record.experimentId}</div>
                          <div className="text-sm text-slate-500">Updated {new Date(record.updatedAt).toLocaleString()}</div>
                        </div>
                        <span className="badge">{progressPercent(record)}%</span>
                      </div>
                      <div className="mt-3 metric-bar"><span style={{ width: `${progressPercent(record)}%` }} /></div>
                      <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">Quiz {record.quizScore}% | Stage {record.currentStage}</div>
                    </div>
                  );
                })}
              </div>
            </section>
            <section className="mt-8">
              <h2 className="mb-3 text-xl font-black">Saved Lab Projects</h2>
              <div className="grid gap-3">
                {projects.length === 0 && <div className="panel p-4">No local projects saved yet.</div>}
                {projects.map((project) => (
                  <div key={project.name} className="panel p-4">
                    <div className="font-bold">{project.name}</div>
                    <div className="text-sm text-slate-500">Updated {new Date(project.updatedAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function introFor(title: string) {
  if (title === "Help") return "A browser-only operating guide for students, teachers, lab instructors, and industry trainers.";
  if (title === "Graphs") return "Where graphing lives in PhysicsLab 100 and how to export data without a server.";
  if (title === "Privacy") return "PhysicsLab 100 runs in the browser first, with data kept on this device unless you export or share it.";
  if (title === "Terms") return "Launch-use notes for schools, colleges, and training teams.";
  if (title === "Projects") return "Local learning records and saved lab projects on this device.";
  if (title === "Settings") return "Accessibility, language, and measurement preferences stored in this browser.";
  return "PhysicsLab 100 browser module.";
}

function HelpContent() {
  const sections = [
    ["Students", "Open a guided experiment, change one variable at a time, record observations, complete the quiz, and export screenshots or reports when required."],
    ["Teachers", "Use Teacher mode to create assignments. Copy links include assignment data in the URL, so they work across devices without a server."],
    ["Labs", "Use the sandbox for free exploration, and use guided experiments when you need syllabus-mapped steps, formulas, viva prompts, and notebook columns."],
    ["Offline", "Install the PWA after first load. Cached assets and browser-local projects remain available when the network is unavailable."],
  ];
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {sections.map(([heading, body]) => (
        <section key={heading} className="panel p-4">
          <h2 className="panel-title">{heading}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{body}</p>
        </section>
      ))}
      <section className="panel p-4 md:col-span-2">
        <h2 className="panel-title">Quick Launch Links</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link className="hero-btn-secondary" to="/experiments">Experiments</Link>
          <Link className="hero-btn-secondary" to="/teacher">Teacher mode</Link>
          <Link className="hero-btn-secondary" to="/solver">Solver bank</Link>
          <Link className="hero-btn-secondary" to="/quiz">Quiz</Link>
          <Link className="hero-btn-secondary" to="/privacy">Privacy</Link>
        </div>
      </section>
    </div>
  );
}

function GraphsContent() {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <section className="panel p-4">
        <h2 className="panel-title">Live Graphs</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Run the lab workspace to see kinetic energy, potential energy, total energy, object motion, and experiment outputs update live.</p>
        <Link className="hero-btn-secondary mt-4 inline-flex" to="/lab">Open lab workspace</Link>
      </section>
      <section className="panel p-4">
        <h2 className="panel-title">Video Analysis Graphs</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Upload a local video, calibrate distance, track points, and export position, velocity, and acceleration data as CSV.</p>
        <Link className="hero-btn-secondary mt-4 inline-flex" to="/video">Open video analysis</Link>
      </section>
      <section className="panel p-4 md:col-span-2">
        <h2 className="panel-title">Data Ownership</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Graph data is generated inside the browser. Use CSV, JSON, PNG, or PDF export when you want to move it to a report, LMS, or external spreadsheet.</p>
      </section>
    </div>
  );
}

function PrivacyContent() {
  const rows = [
    ["Storage", "Projects, learning records, quiz scores, accessibility settings, and teacher assignments are stored in this browser's local storage."],
    ["Sharing", "Shared lab and assignment links encode state in the URL. Anyone with the link can read that encoded lab or assignment data."],
    ["LMS/xAPI", "If configured, xAPI statements are sent directly from this browser to the LRS endpoint entered by the user. PhysicsLab 100 does not add a server proxy."],
    ["Student Data", "Use student names/emails only when your institution has approved that workflow. For pilots, prefer roll numbers or anonymized learner IDs."],
  ];
  return (
    <div className="mt-6 grid gap-3">
      {rows.map(([heading, body]) => (
        <section key={heading} className="panel p-4">
          <h2 className="panel-title">{heading}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{body}</p>
        </section>
      ))}
    </div>
  );
}

function TermsContent() {
  return (
    <div className="mt-6 grid gap-4">
      <section className="panel p-4">
        <h2 className="panel-title">Educational Use</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Use PhysicsLab 100 as a simulation, visualization, practice, and lab-preparation tool. Teachers and instructors should validate activities before graded deployment.</p>
      </section>
      <section className="panel p-4">
        <h2 className="panel-title">Safety</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Virtual experiments do not replace physical laboratory safety procedures. Industry and college demonstrations should be reviewed by a qualified supervisor before being mapped to real equipment.</p>
      </section>
      <section className="panel p-4">
        <h2 className="panel-title">Browser-Only Limit</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">There is no central account, cloud sync, or server-side backup in this build. Export projects, assignments, and reports when records must be preserved.</p>
      </section>
    </div>
  );
}
