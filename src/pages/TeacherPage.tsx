import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { allCurriculumTopics, classOptions } from "../lib/curriculum";
import { experiments } from "../lib/experiments";
import { iconForExperiment, PhysicsIcon, PhysicsIconName } from "../lib/icons";
import { assignmentSharePath, assignmentShareUrl, createAssignment, defaultAssignmentDraft, deleteAssignment, extractSnapshotData, importAssignments, listAssignments, TeacherAssignment } from "../lib/teacher";
import { GuidePanel } from "../components/GuidePanel";
import { teacherGuide } from "../lib/guides";
import { TeacherReadinessPanel } from "../components/TeacherReadinessPanel";
import { createClassPack, downloadPack, importPhysicsLabPack } from "../lib/localPacks";
import { listLocalArtifacts, LocalArtifact } from "../lib/offlineDB";

export function TeacherPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(defaultAssignmentDraft());
  const [assignments, setAssignments] = useState<TeacherAssignment[]>(listAssignments());
  const [copied, setCopied] = useState("");
  const [activeTab, setActiveTab] = useState<"create" | "assignments" | "evidence" | "readiness" | "guide">("create");
  const [evidence, setEvidence] = useState<TeacherEvidenceSummary>({ notebooks: [], reports: [], status: "No evidence loaded yet." });
  const topics = useMemo(() => allCurriculumTopics(), []);
  const classTopics = topics.filter((topic) => topic.classId === draft.classId);
  const selectedTopic = topics.find((topic) => topic.id === draft.topicId) ?? classTopics[0];
  const topicExperiments = experiments.filter((experiment) => selectedTopic?.experimentIds.includes(experiment.id));
  const availableExperiments = topicExperiments.length > 0 ? topicExperiments : experiments;
  const evidenceStats = useMemo(() => summarizeEvidence(evidence.notebooks, evidence.reports), [evidence]);

  const updateDraft = (patch: Partial<typeof draft>) => {
    const next = { ...draft, ...patch };
    if (patch.classId) {
      const firstTopic = topics.find((topic) => topic.classId === patch.classId);
      next.topicId = firstTopic?.id ?? "";
      next.experimentId = firstTopic?.experimentIds[0] ?? experiments[0].id;
    }
    if (patch.topicId) {
      const topic = topics.find((item) => item.id === patch.topicId);
      next.experimentId = topic?.experimentIds[0] ?? next.experimentId;
    }
    setDraft(next);
  };

  const save = () => {
    createAssignment({ ...draft, snapshotData: extractSnapshotData(draft.snapshotData ?? "") });
    setAssignments(listAssignments());
  };

  const copy = async (assignment: TeacherAssignment) => {
    await navigator.clipboard.writeText(assignmentShareUrl(assignment));
    setCopied(assignment.id);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const download = () => {
    downloadPack(createClassPack());
  };

  const importFile = async (file: File) => {
    const text = await file.text();
    const payload = JSON.parse(text);
    try {
      await importPhysicsLabPack(payload);
    } catch {
      importAssignments(payload);
    }
    setAssignments(listAssignments());
  };

  const refreshEvidence = async () => {
    setEvidence((current) => ({ ...current, status: "Loading local evidence..." }));
    try {
      const [studentProgress, reports] = await Promise.all([
        listLocalArtifacts("student-progress"),
        listLocalArtifacts("reports"),
      ]);
      setEvidence({
        notebooks: studentProgress.map(normalizeNotebookArtifact).filter(Boolean) as NotebookEvidence[],
        reports,
        status: "Loaded from this browser.",
      });
    } catch {
      setEvidence((current) => ({ ...current, status: "Could not read browser evidence." }));
    }
  };

  const exportEvidence = () => {
    const payload = {
      kind: "teacher-evidence-export",
      version: "1.0.0",
      browserOnly: true,
      exportedAt: new Date().toISOString(),
      summary: evidenceStats,
      notebooks: evidence.notebooks,
      reports: evidence.reports,
      notes: ["Evidence is read from this browser only. No server sync or account lookup is used."],
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `physicslab-evidence-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (activeTab === "evidence") void refreshEvidence();
  }, [activeTab]);

  return (
    <div className="min-h-screen">
      <Toolbar />
      <div id="content" className="desktop-page">
        <div className="page-hero mesh-bg flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="ui-label">Teacher mode</p>
            <h1 className="mt-2 text-3xl font-black text-gradient">Assignments and Classroom Controls</h1>
            <p className="mt-2 max-w-3xl text-slate-500 dark:text-slate-300">
              Create browser-local lab assignments, lock variables by instruction, require notebook/quiz completion, and share links that carry assignment data in the URL. No server account is required.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="tool-btn inline-flex items-center gap-2" onClick={() => fileRef.current?.click()}><PhysicsIcon name="clipboard" className="h-4 w-4" />Import</button>
            <button className="tool-btn inline-flex items-center gap-2" onClick={download}><PhysicsIcon name="chart" className="h-4 w-4" />Export all</button>
            <input ref={fileRef} className="hidden" type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && importFile(event.target.files[0])} />
          </div>
        </div>
        <div className="desktop-tabs mt-3" aria-label="Teacher sections">
          {[
            { id: "create" as const, label: "Create", icon: "teacher" as const },
            { id: "assignments" as const, label: "Assignments", icon: "clipboard" as const },
            { id: "evidence" as const, label: "Evidence", icon: "chart" as const },
            { id: "readiness" as const, label: "Readiness", icon: "check" as const },
            { id: "guide" as const, label: "Guide", icon: "book" as const },
          ].map((tab) => (
            <button key={tab.id} className={activeTab === tab.id ? "tab-active" : "tab-btn"} type="button" onClick={() => setActiveTab(tab.id)}>
              <span className="inline-flex items-center gap-1.5"><PhysicsIcon name={tab.icon} className="h-3.5 w-3.5" />{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="desktop-tab-panel desktop-tab-panel-tall desktop-scroll-panel">
          {activeTab === "guide" && (
            <div className="grid gap-3">
              <GuidePanel guide={teacherGuide} defaultOpen />
              <div className="rounded-md border border-cyan-300/40 bg-cyan-400/10 p-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Sharing is browser-only: copied assignment links include the assignment payload, and imported/exported packs are plain JSON files. Student progress remains on each student's device unless they export it.
              </div>
            </div>
          )}
          {activeTab === "readiness" && <TeacherReadinessPanel />}
          {activeTab === "evidence" && (
            <TeacherEvidencePanel
              evidence={evidence}
              stats={evidenceStats}
              onRefresh={refreshEvidence}
              onExport={exportEvidence}
            />
          )}
          {(activeTab === "create" || activeTab === "assignments") && (
        <section className={activeTab === "create" ? "desktop-two-pane desktop-two-pane-wide" : "grid gap-4"}>
          {activeTab === "create" && (
          <div className="panel p-4">
            <h2 className="panel-title flex items-center gap-2"><PhysicsIcon name="teacher" className="h-5 w-5 text-cyan-500" />Create Assignment</h2>
            <div className="mt-4 grid gap-3">
              <Field label="Title">
                <input className="w-full rounded bg-white p-2 dark:bg-slate-900" value={draft.title} onChange={(event) => updateDraft({ title: event.target.value })} />
              </Field>
              <Field label="Class">
                <select className="w-full rounded bg-white p-2 dark:bg-slate-900" value={draft.classId} onChange={(event) => updateDraft({ classId: event.target.value })}>
                  {classOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </Field>
              <Field label="Topic">
                <select className="w-full rounded bg-white p-2 dark:bg-slate-900" value={draft.topicId} onChange={(event) => updateDraft({ topicId: event.target.value })}>
                  {classTopics.map((topic) => <option key={topic.id} value={topic.id}>{topic.unitTitle}: {topic.title}</option>)}
                </select>
              </Field>
              <Field label="Experiment">
                <select className="w-full rounded bg-white p-2 dark:bg-slate-900" value={draft.experimentId} onChange={(event) => updateDraft({ experimentId: event.target.value })}>
                  {availableExperiments.map((experiment) => <option key={experiment.id} value={experiment.id}>{experiment.title}</option>)}
                </select>
              </Field>
              <Field label="Due date">
                <input className="w-full rounded bg-white p-2 dark:bg-slate-900" type="date" value={draft.dueDate} onChange={(event) => updateDraft({ dueDate: event.target.value })} />
              </Field>
              <Field label="Instructions">
                <textarea className="min-h-24 w-full rounded bg-white p-2 dark:bg-slate-900" value={draft.instructions} onChange={(event) => updateDraft({ instructions: event.target.value })} />
              </Field>
              <Field label="Starter snapshot">
                <div className="grid gap-2">
                  <input
                    className="w-full rounded bg-white p-2 dark:bg-slate-900"
                    value={draft.snapshotData ?? ""}
                    onChange={(event) => updateDraft({ snapshotData: event.target.value })}
                    placeholder="Paste a lab snapshot link or snapshot token"
                  />
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Optional. Copy a snapshot from any lab, paste it here, and the assignment opens with those exact controls and workspace view.
                  </p>
                </div>
              </Field>
              <label className="property-row"><span>Lock variables</span><input type="checkbox" checked={draft.lockVariables} onChange={(event) => updateDraft({ lockVariables: event.target.checked })} /></label>
              <label className="property-row"><span>Require notebook</span><input type="checkbox" checked={draft.requireNotebook} onChange={(event) => updateDraft({ requireNotebook: event.target.checked })} /></label>
              <label className="property-row"><span>Require quiz</span><input type="checkbox" checked={draft.requireQuiz} onChange={(event) => updateDraft({ requireQuiz: event.target.checked })} /></label>
              <button className="tool-btn-primary inline-flex items-center justify-center gap-2" onClick={save}><PhysicsIcon name="check" className="h-4 w-4" />Save assignment</button>
            </div>
          </div>
          )}

          <div className="grid gap-4 desktop-main-scroll">
            <section className="grid gap-3 md:grid-cols-4">
              <Metric icon="teacher" label="Assignments" value={assignments.length} />
              <Metric icon="gauge" label="Locked" value={assignments.filter((item) => item.lockVariables).length} />
              <Metric icon="clipboard" label="Notebook" value={assignments.filter((item) => item.requireNotebook).length} />
              <Metric icon="check" label="Quiz" value={assignments.filter((item) => item.requireQuiz).length} />
            </section>

            <section className="grid gap-3">
              {assignments.length === 0 && <div className="panel p-4">No assignments created yet.</div>}
              {assignments.map((assignment) => {
                const experiment = experiments.find((item) => item.id === assignment.experimentId);
                const topic = topics.find((item) => item.id === assignment.topicId);
                return (
                  <article key={assignment.id} className="panel p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-cyan-400/40 bg-cyan-400/10 text-cyan-500">
                          <PhysicsIcon name={experiment ? iconForExperiment(experiment) : "flask"} />
                        </span>
                        <div>
                        <div className="font-black">{assignment.title}</div>
                        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{topic?.classLabel} | {topic?.title} | {experiment?.title}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {assignment.lockVariables && <span className="badge">locked</span>}
                        {assignment.snapshotData && <span className="badge">snapshot</span>}
                        {assignment.requireNotebook && <span className="badge">notebook</span>}
                        {assignment.requireQuiz && <span className="badge">quiz</span>}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{assignment.instructions}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link className="tool-btn-primary inline-flex items-center gap-2" to={assignmentSharePath(assignment)}><PhysicsIcon name="flask" className="h-4 w-4" />Open</Link>
                      <button className="tool-btn inline-flex items-center gap-2" onClick={() => copy(assignment)}><PhysicsIcon name="clipboard" className="h-4 w-4" />{copied === assignment.id ? "Copied" : "Copy link"}</button>
                      <button className="tool-btn inline-flex items-center gap-2" onClick={() => { deleteAssignment(assignment.id); setAssignments(listAssignments()); }}><PhysicsIcon name="check" className="h-4 w-4" />Delete</button>
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        </section>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</div>
      {children}
    </label>
  );
}

function Metric({ icon, label, value }: { icon: PhysicsIconName; label: string; value: number }) {
  return (
    <div className="metric-card">
      <div className="flex items-center gap-2">
        <PhysicsIcon name={icon} className="h-4 w-4 text-cyan-500" />
        <div className="ui-label">{label}</div>
      </div>
      <div className="mt-1 text-2xl font-black text-cyan-500">{value}</div>
    </div>
  );
}

interface NotebookEvidence {
  id: string;
  title: string;
  experimentId: string;
  experimentTitle: string;
  modelVersion: string;
  assignment?: {
    id: string;
    title: string;
    dueDate?: string;
    requirements?: string[];
    snapshotIncluded?: boolean;
  };
  updatedAt: string;
  prediction: string;
  observation: string;
  conclusion: string;
  uncertainty: string;
  trialCount: number;
  score: number;
  outputs: Array<{ label: string; value: string }>;
}

interface TeacherEvidenceSummary {
  notebooks: NotebookEvidence[];
  reports: LocalArtifact[];
  status: string;
}

function TeacherEvidencePanel({ evidence, stats, onRefresh, onExport }: { evidence: TeacherEvidenceSummary; stats: EvidenceStats; onRefresh: () => void; onExport: () => void }) {
  return (
    <section className="grid gap-4">
      <div className="panel p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="ui-label">Browser-local evidence</p>
            <h2 className="text-2xl font-black">Notebook and report review</h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold text-slate-600 dark:text-slate-300">
              Review evidence saved on this device from guided experiments. This does not fetch student data from a server; students must export or use this same browser profile.
            </p>
            <p className="mt-2 text-xs font-bold text-slate-500 dark:text-slate-400">{evidence.status}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="tool-btn inline-flex items-center gap-2" type="button" onClick={onRefresh}><PhysicsIcon name="check" className="h-4 w-4" />Refresh</button>
            <button className="tool-btn-primary inline-flex items-center gap-2" type="button" onClick={onExport}><PhysicsIcon name="download" className="h-4 w-4" />Export evidence</button>
          </div>
        </div>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        <Metric icon="clipboard" label="Notebooks" value={stats.notebooks} />
        <Metric icon="printer" label="Reports" value={stats.reports} />
        <Metric icon="teacher" label="Assigned" value={stats.assigned} />
        <Metric icon="chart" label="Trials" value={stats.trials} />
      </section>

      <div className="grid gap-3">
        {evidence.notebooks.length === 0 && (
          <div className="panel p-4">
            <h3 className="font-black">No saved notebooks yet</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Open a guided experiment, use the Investigation Notebook, then choose Save local.</p>
          </div>
        )}
        {evidence.notebooks.map((notebook) => (
          <article key={notebook.id} className="panel p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={notebook.score >= 80 ? "status-chip status-chip-cyan" : notebook.score >= 50 ? "status-chip status-chip-amber" : "status-chip"}>{notebook.score}% evidence</span>
                  <span className="status-chip">{notebook.modelVersion}</span>
                  <span className="status-chip">{notebook.trialCount} trials</span>
                  {notebook.assignment && <span className="status-chip status-chip-cyan">assigned</span>}
                  {notebook.assignment?.snapshotIncluded && <span className="status-chip">snapshot</span>}
                </div>
                <h3 className="mt-2 text-xl font-black">{notebook.experimentTitle}</h3>
                {notebook.assignment && (
                  <p className="mt-1 text-sm font-bold text-cyan-600 dark:text-cyan-300">
                    {notebook.assignment.title}{notebook.assignment.dueDate ? ` | Due ${notebook.assignment.dueDate}` : ""}
                  </p>
                )}
                <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">Updated {new Date(notebook.updatedAt).toLocaleString()}</p>
              </div>
              <Link className="tool-btn-primary inline-flex items-center gap-2" to={`/experiments/${notebook.experimentId}#notebook`}><PhysicsIcon name="flask" className="h-4 w-4" />Open lab</Link>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <EvidenceText label="Prediction" value={notebook.prediction} />
              <EvidenceText label="Observation" value={notebook.observation} />
              <EvidenceText label="Uncertainty / limits" value={notebook.uncertainty} />
              <EvidenceText label="Conclusion" value={notebook.conclusion} />
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="notebook-table">
                <thead><tr><th>Latest outputs</th><th>Value</th></tr></thead>
                <tbody>
                  {notebook.outputs.slice(0, 5).map((output) => <tr key={output.label}><td>{output.label}</td><td>{output.value}</td></tr>)}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EvidenceText({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-300/70 bg-white p-3 text-sm dark:border-lab-line dark:bg-slate-950">
      <div className="ui-label">{label}</div>
      <p className="mt-1 font-semibold text-slate-700 dark:text-slate-200">{value || "Missing"}</p>
    </div>
  );
}

interface EvidenceStats {
  notebooks: number;
  reports: number;
  ready: number;
  assigned: number;
  trials: number;
}

function summarizeEvidence(notebooks: NotebookEvidence[], reports: LocalArtifact[]): EvidenceStats {
  return {
    notebooks: notebooks.length,
    reports: reports.length,
    ready: notebooks.filter((notebook) => notebook.score >= 80).length,
    assigned: notebooks.filter((notebook) => notebook.assignment).length,
    trials: notebooks.reduce((sum, notebook) => sum + notebook.trialCount, 0),
  };
}

function normalizeNotebookArtifact(artifact: LocalArtifact): NotebookEvidence | null {
  const payload = artifact.payload as {
    kind?: string;
    experimentId?: string;
    experimentTitle?: string;
    modelVersion?: string;
    assignment?: NotebookEvidence["assignment"];
    result?: Array<{ label: string; value: string }>;
    record?: {
      prediction?: string;
      observation?: string;
      conclusion?: string;
      uncertainty?: string;
      trials?: unknown[];
      updatedAt?: string;
    };
  };
  if (payload.kind !== "experiment-notebook" || !payload.experimentId || !payload.record) return null;
  const prediction = payload.record.prediction ?? "";
  const observation = payload.record.observation ?? "";
  const conclusion = payload.record.conclusion ?? "";
  const uncertainty = payload.record.uncertainty ?? "";
  const trialCount = payload.record.trials?.length ?? 0;
  return {
    id: artifact.id,
    title: artifact.title,
    experimentId: payload.experimentId,
    experimentTitle: payload.experimentTitle ?? payload.experimentId,
    modelVersion: payload.modelVersion ?? "starter",
    assignment: payload.assignment,
    updatedAt: artifact.updatedAt,
    prediction,
    observation,
    conclusion,
    uncertainty,
    trialCount,
    score: evidenceScore({ prediction, observation, conclusion, uncertainty, trialCount }),
    outputs: payload.result ?? [],
  };
}

function evidenceScore(input: { prediction: string; observation: string; conclusion: string; uncertainty: string; trialCount: number }) {
  return [
    input.prediction.trim() ? 20 : 0,
    input.observation.trim() ? 20 : 0,
    input.conclusion.trim() ? 20 : 0,
    input.uncertainty.trim() ? 20 : 0,
    Math.min(20, input.trialCount * 7),
  ].reduce((sum, value) => sum + value, 0);
}
