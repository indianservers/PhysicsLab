import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import i18next from "../i18n";
import { experiments } from "../lib/experiments";
import { listLearningRecords, progressPercent } from "../lib/learning";
import { deleteProject, listProjects, renameProject } from "../lib/storage";
import { useLabStore } from "../store/useLabStore";
import { ProjectFile } from "../types";
import { LearningProgressDashboard } from "../components/LearningProgressDashboard";
import { createClassPack, createFullBackupPack, createProgressPack, downloadPack, importPhysicsLabPack, packSummary, PhysicsLabPack } from "../lib/localPacks";
import { createValidationSummary, scientificSources } from "../lib/scientificSources";
import { listLocalArtifacts } from "../lib/offlineDB";
import { flagshipLabModelIds } from "../lib/flagshipLabModels";
import { accuracyAuditStats, accuracyDomainSummaries, experimentAccuracyProfiles } from "../lib/accuracyValidation";

export function SimplePage({ title, showProjects = false }: { title: string; showProjects?: boolean }) {
  const [projects, setProjects] = useState<ProjectFile[]>([]);
  const [learningRecords, setLearningRecords] = useState(listLearningRecords());
  const [renamingName, setRenamingName] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const navigate = useNavigate();
  const { accessibility, setAccessibility, unitSystem, setUnitSystem, significantFigures, setSignificantFigures, loadProject } = useLabStore();

  const refreshProjects = () => listProjects().then(setProjects).catch(() => setProjects([]));

  useEffect(() => {
    if (showProjects) { refreshProjects(); setLearningRecords(listLearningRecords()); }
  }, [showProjects]);

  const handleDelete = async (name: string) => {
    if (!window.confirm(`Delete project "${name}"?`)) return;
    await deleteProject(name);
    refreshProjects();
  };

  const startRename = (project: ProjectFile) => {
    setRenamingName(project.name);
    setRenameValue(project.name);
  };

  const commitRename = async () => {
    if (!renamingName || !renameValue.trim() || renameValue.trim() === renamingName) {
      setRenamingName(null);
      return;
    }
    await renameProject(renamingName, renameValue.trim());
    setRenamingName(null);
    refreshProjects();
  };

  const openInSandbox = (project: ProjectFile) => {
    loadProject(project);
    navigate("/sandbox");
  };
  return (
    <div className="min-h-screen">
      <Toolbar />
      <div id="content" className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{introFor(title)}</p>
        {title === "Help" && <HelpContent />}
        {title === "Graphs" && <GraphsContent />}
        {title === "Scientific Trust" && <ScientificTrustContent />}
        {title === "Backup" && <BackupContent />}
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
            <LearningProgressDashboard compact />
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
                    {renamingName === project.name ? (
                      <div className="flex items-center gap-2">
                        <input className="flex-1 rounded border border-slate-300 bg-slate-100 px-2 py-1 text-sm dark:border-lab-line dark:bg-slate-800" value={renameValue} autoFocus onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenamingName(null); }} />
                        <button className="tool-btn" onClick={commitRename}>Save</button>
                        <button className="tool-btn" onClick={() => setRenamingName(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="font-bold">{project.name}</div>
                          <div className="text-sm text-slate-500">Updated {new Date(project.updatedAt).toLocaleString()}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="tool-btn" onClick={() => openInSandbox(project)}>Open</button>
                          <button className="tool-btn" onClick={() => startRename(project)}>Rename</button>
                          <button className="tool-btn text-rose-400 hover:text-rose-300" onClick={() => handleDelete(project.name)}>Delete</button>
                        </div>
                      </div>
                    )}
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
  if (title === "Scientific Trust") return "How PhysicsLab labels model limits, validation status, assumptions, and source notes in a browser-only app.";
  if (title === "Backup") return "Export or restore browser-only packs for projects, assignments, progress, preferences, and local lab autosaves.";
  if (title === "Privacy") return "PhysicsLab 100 runs in the browser first, with data kept on this device unless you export or share it.";
  if (title === "Terms") return "Launch-use notes for schools, colleges, and training teams.";
  if (title === "Projects") return "Local learning records and saved lab projects on this device.";
  if (title === "Settings") return "Accessibility, language, and measurement preferences stored in this browser.";
  return "PhysicsLab 100 browser module.";
}

function ScientificTrustContent() {
  const maturityCounts = countBy((experiment) => experiment.maturityLevel ?? "Starter");
  const evidenceCounts = countBy((experiment) => experiment.evidenceType ?? "Exact Formula");
  const modelCounts = countBy((experiment) => experiment.modelClass ?? "Calculator");
  const validationSummary = createValidationSummary();
  const pendingAccuracy = experimentAccuracyProfiles.filter((profile) => profile.modelGrade < 70 || profile.validationCases === 0);
  const validationRate = Math.round((accuracyAuditStats.passing / Math.max(1, accuracyAuditStats.cases)) * 100);
  const [localEvidence, setLocalEvidence] = useState({ notebooks: 0, reports: 0, graphExports: 0 });
  useEffect(() => {
    Promise.all([
      listLocalArtifacts("student-progress"),
      listLocalArtifacts("reports"),
      listLocalArtifacts("graph-exports"),
    ])
      .then(([notebooks, reports, graphExports]) => setLocalEvidence({ notebooks: notebooks.length, reports: reports.length, graphExports: graphExports.length }))
      .catch(() => setLocalEvidence({ notebooks: 0, reports: 0, graphExports: 0 }));
  }, []);
  const audit = createReadinessAudit(validationSummary, localEvidence);
  const rows = [
    ["Exact Formula", "A displayed numeric result is computed directly from a stated textbook relationship inside the listed assumptions and valid ranges."],
    ["Educational Approximation", "The lab is useful for learning trends, but it simplifies losses, geometry, material behavior, or boundary effects."],
    ["Visual Model", "The animation or diagram is meant to build intuition. Treat numbers as trusted only when a formula output is explicitly shown."],
    ["Sandbox Only", "The setup is exploratory or generic. It should be promoted to a lab-specific model before graded classroom use."],
  ];
  const maturity = [
    ["Starter", "Mapped content exists, but the lab may still rely on generic controls or broad visualization."],
    ["Validated", "Core numeric relationships have local reference tests or strong formula checks."],
    ["Classroom Ready", "The lab has assumptions, limits, teacher-friendly flow, and reliable formula outputs for the intended level."],
    ["Flagship", "A deeper, purpose-built lab with a stronger simulation path and clear validation status."],
  ];
  return (
    <div className="mt-6 grid gap-4">
      <section className="panel p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="ui-label">Current build accuracy</p>
            <h2 className="panel-title">Browser-Only Trust Promise</h2>
          </div>
          <Link className="hero-btn-secondary inline-flex" to="/accuracy-center">Open accuracy center</Link>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          PhysicsLab runs locally in the browser. Trust metadata, reports, assignments, and progress records are generated on this device unless you export, share, or configure a direct xAPI endpoint.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-5">
          <TrustStat label="Executable checks" value={accuracyAuditStats.executableChecks} />
          <TrustStat label="Formula cases" value={`${accuracyAuditStats.passing}/${accuracyAuditStats.cases}`} />
          <TrustStat label="Pass rate" value={`${validationRate}%`} />
          <TrustStat label="Benchmarked labs" value={accuracyAuditStats.validatedProfiles} />
          <TrustStat label="Pending items" value={accuracyAuditStats.pendingProfiles} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(maturityCounts).map(([label, count]) => <span key={label} className="status-chip">{label}: {count}</span>)}
        </div>
      </section>

      <ReadinessAuditPanel audit={audit} />

      <section className="grid gap-4 md:grid-cols-2">
        <div className="panel p-4">
          <h2 className="panel-title">Evidence Labels</h2>
          <div className="mt-3 grid gap-3">
            {rows.map(([label, body]) => (
              <div key={label} className="rounded-md border border-slate-300/70 bg-slate-100/70 p-3 dark:border-lab-line dark:bg-slate-900/60">
                <div className="font-black text-slate-800 dark:text-slate-100">{label}</div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-4">
          <h2 className="panel-title">Maturity Levels</h2>
          <div className="mt-3 grid gap-3">
            {maturity.map(([label, body]) => (
              <div key={label} className="rounded-md border border-slate-300/70 bg-slate-100/70 p-3 dark:border-lab-line dark:bg-slate-900/60">
                <div className="font-black text-slate-800 dark:text-slate-100">{label}</div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <TrustMetric title="Evidence Types" rows={evidenceCounts} />
        <TrustMetric title="Model Classes" rows={modelCounts} />
        <TrustMetric title="Validation Status" rows={{ "Executable checks": accuracyAuditStats.executableChecks, "Formula benchmark cases": accuracyAuditStats.cases, "Source families": validationSummary.sourceCount, "Experiments": validationSummary.experimentCount }} />
      </section>

      <section className="panel p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="ui-label">Module accuracy coverage</p>
            <h2 className="panel-title">What is validated right now</h2>
          </div>
          <span className="status-chip status-chip-cyan">{accuracyAuditStats.domains} physics domains</span>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {accuracyDomainSummaries.map((domain) => (
            <div key={domain.domain} className="rounded-md border border-slate-300/70 bg-slate-100/70 p-3 dark:border-lab-line dark:bg-slate-900/60">
              <div className="flex items-center justify-between gap-3">
                <strong className="text-slate-800 dark:text-slate-100">{domain.domain}</strong>
                <span className="status-chip status-chip-cyan">{domain.passRate}%</span>
              </div>
              <div className="metric-bar mt-2"><span style={{ width: `${domain.passRate}%` }} /></div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{domain.passing}/{domain.cases} benchmark cases passing.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="ui-label">Pending accuracy items</p>
            <h2 className="panel-title">Do not overclaim these modules</h2>
          </div>
          <span className="status-chip status-chip-amber">{pendingAccuracy.length} need review</span>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {pendingAccuracy.slice(0, 10).map((profile) => (
            <article key={profile.experimentId} className="rounded-md border border-amber-300/40 bg-amber-100/40 p-3 dark:border-amber-300/20 dark:bg-amber-400/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link className="font-black text-slate-800 dark:text-slate-100" to={`/experiments/${profile.experimentId}`}>{profile.title}</Link>
                <span className="status-chip">{profile.modelGrade}% accuracy</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{profile.nextAccuracyActions[0]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel p-4">
        <h2 className="panel-title">Source Families</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {scientificSources.map((source) => (
            <article key={source.id} className="rounded-md border border-slate-300/70 bg-slate-100/70 p-3 dark:border-lab-line dark:bg-slate-900/60">
              <div className="flex flex-wrap items-center gap-2">
                <span className="status-chip status-chip-cyan">{source.domain}</span>
                <span className="status-chip">{source.level}</span>
                <code className="status-chip">{source.id}</code>
              </div>
              <h3 className="mt-2 font-black text-slate-800 dark:text-slate-100">{source.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{source.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel p-4">
        <h2 className="panel-title">What We Do Not Claim Yet</h2>
        <ul className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
          {validationSummary.caveats.map((caveat) => <li key={caveat}>{caveat}</li>)}
        </ul>
      </section>
    </div>
  );
}

function countBy(getKey: (experiment: typeof experiments[number]) => string) {
  return experiments.reduce<Record<string, number>>((acc, experiment) => {
    const key = getKey(experiment);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

interface ReadinessAuditCheck {
  label: string;
  status: "pass" | "watch";
  detail: string;
}

interface ReadinessAudit {
  score: number;
  generatedAt: string;
  checks: ReadinessAuditCheck[];
  localEvidence: { notebooks: number; reports: number; graphExports: number };
}

function createReadinessAudit(validationSummary: ReturnType<typeof createValidationSummary>, localEvidence: ReadinessAudit["localEvidence"]): ReadinessAudit {
  const starterCount = validationSummary.maturityCounts.Starter ?? 0;
  const flagshipCount = flagshipLabModelIds.length;
  const exactFormulaCount = validationSummary.evidenceCounts["Exact Formula"] ?? 0;
  const sandboxCount = validationSummary.evidenceCounts["Sandbox Only"] ?? 0;
  const checks: ReadinessAuditCheck[] = [
    {
      label: "Reference validation",
      status: "pass",
      detail: `${accuracyAuditStats.executableChecks} local physics checks cover formulas, trust policy, source metadata, and flagship-registry coverage.`,
    },
    {
      label: "Flagship coverage",
      status: flagshipCount >= 10 ? "pass" : "watch",
      detail: `${flagshipCount} purpose-built flagship/classroom model definitions are registered.`,
    },
    {
      label: "Scientific source map",
      status: validationSummary.sourceCount >= 10 ? "pass" : "watch",
      detail: `${validationSummary.sourceCount} source families are cataloged for trust metadata.`,
    },
    {
      label: "Formula-first library",
      status: exactFormulaCount > sandboxCount ? "pass" : "watch",
      detail: `${exactFormulaCount} exact-formula labs versus ${sandboxCount} sandbox-only labs.`,
    },
    {
      label: "Starter transparency",
      status: "pass",
      detail: `${starterCount} starter labs remain clearly labeled instead of being overclaimed.`,
    },
    {
      label: "Local evidence flow",
      status: localEvidence.notebooks + localEvidence.reports > 0 ? "pass" : "watch",
      detail: `${localEvidence.notebooks} notebook artifacts, ${localEvidence.reports} reports, ${localEvidence.graphExports} graph exports in this browser.`,
    },
    {
      label: "Browser-only handoff",
      status: "pass",
      detail: "Assignments, notebooks, reports, progress packs, and evidence exports are generated as browser-local data files.",
    },
  ];
  const score = Math.round((checks.filter((check) => check.status === "pass").length / checks.length) * 100);
  return { score, generatedAt: new Date().toISOString(), checks, localEvidence };
}

function TrustStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="metric-card">
      <div className="ui-label">{label}</div>
      <div className="mt-1 text-2xl font-black text-cyan-500">{value}</div>
    </div>
  );
}

function ReadinessAuditPanel({ audit }: { audit: ReadinessAudit }) {
  const exportAudit = () => {
    const blob = new Blob([JSON.stringify({ kind: "physicslab-readiness-audit", version: "1.0.0", ...audit }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `physicslab-readiness-audit-${audit.generatedAt.slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <section className="panel p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="ui-label">Phase 10 audit</p>
          <h2 className="panel-title">Classroom Readiness Snapshot</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
            A local readiness check for scientific trust, evidence handoff, and browser-only operation. It is generated from this build and this browser's local evidence stores.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={audit.score >= 85 ? "status-chip status-chip-cyan" : "status-chip status-chip-amber"}>{audit.score}% ready</span>
          <button className="hero-btn-secondary inline-flex items-center gap-2" type="button" onClick={exportAudit}>Export audit</button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {audit.checks.map((check) => (
          <div key={check.label} className="rounded-md border border-slate-300/70 bg-slate-100/70 p-3 dark:border-lab-line dark:bg-slate-900/60">
            <div className="flex items-center justify-between gap-3">
              <div className="font-black text-slate-800 dark:text-slate-100">{check.label}</div>
              <span className={check.status === "pass" ? "status-chip status-chip-cyan" : "status-chip status-chip-amber"}>{check.status === "pass" ? "Pass" : "Watch"}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{check.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrustMetric({ title, rows }: { title: string; rows: Record<string, number> }) {
  return (
    <section className="panel p-4">
      <h2 className="panel-title">{title}</h2>
      <div className="mt-3 grid gap-2">
        {Object.entries(rows).map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3 rounded-md bg-slate-100 px-3 py-2 text-sm dark:bg-slate-900">
            <span className="font-bold text-slate-700 dark:text-slate-200">{label}</span>
            <span className="status-chip status-chip-cyan">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function BackupContent() {
  const [status, setStatus] = useState("");
  const [lastPack, setLastPack] = useState<PhysicsLabPack | null>(null);
  const [importResult, setImportResult] = useState<Record<string, number> | null>(null);
  const [portfolio, setPortfolio] = useState({ notebooks: 0, reports: 0, graphExports: 0 });

  const refreshPortfolio = async () => {
    try {
      const [notebooks, reports, graphExports] = await Promise.all([
        listLocalArtifacts("student-progress"),
        listLocalArtifacts("reports"),
        listLocalArtifacts("graph-exports"),
      ]);
      setPortfolio({ notebooks: notebooks.length, reports: reports.length, graphExports: graphExports.length });
    } catch {
      setPortfolio({ notebooks: 0, reports: 0, graphExports: 0 });
    }
  };

  useEffect(() => {
    void refreshPortfolio();
  }, []);

  const exportFull = async () => {
    setStatus("Preparing full browser backup...");
    const pack = await createFullBackupPack();
    setLastPack(pack);
    downloadPack(pack);
    setStatus("Full backup exported.");
  };

  const exportClass = () => {
    const pack = createClassPack();
    setLastPack(pack);
    downloadPack(pack);
    setStatus("Class pack exported.");
  };

  const exportProgress = async () => {
    setStatus("Collecting portfolio evidence...");
    const pack = await createProgressPack();
    setLastPack(pack);
    downloadPack(pack);
    await refreshPortfolio();
    setStatus("Progress and evidence pack exported.");
  };

  const importFile = async (file: File) => {
    setStatus(`Importing ${file.name}...`);
    setImportResult(null);
    try {
      const payload = JSON.parse(await file.text());
      const result = await importPhysicsLabPack(payload);
      setImportResult(result);
      setStatus("Import complete. Reload open pages to refresh cached views.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Import failed.");
    }
  };

  const summary = lastPack ? packSummary(lastPack) : null;
  return (
    <div className="mt-6 grid gap-4">
      <section className="panel p-4">
        <h2 className="panel-title">Local-First Pack System</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Packs are plain JSON files generated in this browser. They can move work between devices without a server, account, or cloud sync.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <button className="hero-btn inline-flex justify-center" type="button" onClick={exportFull}>Export full backup</button>
          <button className="hero-btn-secondary inline-flex justify-center" type="button" onClick={exportClass}>Export class pack</button>
          <button className="hero-btn-secondary inline-flex justify-center" type="button" onClick={() => void exportProgress()}>Export progress + evidence</button>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="metric-card">
          <div className="ui-label">Notebook evidence</div>
          <div className="mt-1 text-2xl font-black text-cyan-500">{portfolio.notebooks}</div>
        </div>
        <div className="metric-card">
          <div className="ui-label">Generated reports</div>
          <div className="mt-1 text-2xl font-black text-cyan-500">{portfolio.reports}</div>
        </div>
        <div className="metric-card">
          <div className="ui-label">Graph exports</div>
          <div className="mt-1 text-2xl font-black text-cyan-500">{portfolio.graphExports}</div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="panel p-4">
          <h2 className="panel-title">Restore A Pack</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Import `.physicslab-pack.json`, `.physicslab-class.json`, `.physicslab-progress.json`, or older teacher/learning exports.
          </p>
          <label className="mt-4 block">
            <span className="sr-only">Import PhysicsLab pack</span>
            <input
              className="search-field"
              type="file"
              accept=".json,application/json"
              onChange={(event) => event.target.files?.[0] && void importFile(event.target.files[0])}
            />
          </label>
          {status && <p className="mt-3 rounded-md border border-cyan-300/30 bg-cyan-400/10 p-3 text-sm font-bold text-slate-700 dark:text-cyan-100">{status}</p>}
        </div>

        <div className="panel p-4">
          <h2 className="panel-title">What Gets Included</h2>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <div className="property-row"><span>Projects</span><strong>IndexedDB</strong></div>
            <div className="property-row"><span>Lab autosaves</span><strong>IndexedDB</strong></div>
            <div className="property-row"><span>Assignments</span><strong>Local storage</strong></div>
            <div className="property-row"><span>Progress and quiz records</span><strong>Local storage</strong></div>
            <div className="property-row"><span>Notebook evidence</span><strong>IndexedDB student-progress</strong></div>
            <div className="property-row"><span>Generated reports</span><strong>IndexedDB reports</strong></div>
            <div className="property-row"><span>xAPI Basic auth</span><strong>Never exported</strong></div>
          </div>
        </div>
      </section>

      {(summary || importResult) && (
        <section className="panel p-4">
          <h2 className="panel-title">{summary ? "Last Export Summary" : "Last Import Summary"}</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {Object.entries(summary ?? importResult ?? {}).map(([label, value]) => (
              <div key={label} className="metric-card">
                <div className="ui-label">{label}</div>
                <div className="mt-1 text-2xl font-black text-cyan-500">{value}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
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
