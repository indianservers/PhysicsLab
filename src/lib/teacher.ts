import { allCurriculumTopics, classOptions } from "./curriculum";
import { experiments } from "./experiments";

export interface TeacherAssignment {
  id: string;
  title: string;
  classId: string;
  topicId: string;
  experimentId: string;
  instructions: string;
  dueDate: string;
  snapshotData?: string;
  lockVariables: boolean;
  requireNotebook: boolean;
  requireQuiz: boolean;
  createdAt: string;
  updatedAt: string;
}

const KEY = "physicslab-teacher-assignments-v1";

export function createAssignment(input: Omit<TeacherAssignment, "id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const assignment: TeacherAssignment = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  saveAssignment(assignment);
  return assignment;
}

export function saveAssignment(assignment: TeacherAssignment) {
  const assignments = readAssignments();
  assignments[assignment.id] = { ...assignment, updatedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(assignments));
}

export function listAssignments() {
  return Object.values(readAssignments()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getAssignment(id: string | null) {
  if (!id) return undefined;
  return readAssignments()[id];
}

export function getAssignmentFromSearch(search: string) {
  const params = new URLSearchParams(search);
  const encoded = params.get("assignmentData");
  if (encoded) {
    const assignment = decodeAssignment(encoded);
    if (assignment) {
      saveAssignment(assignment);
      return assignment;
    }
  }
  return getAssignment(params.get("assignment"));
}

export function deleteAssignment(id: string) {
  const assignments = readAssignments();
  delete assignments[id];
  localStorage.setItem(KEY, JSON.stringify(assignments));
}

export function assignmentSharePath(assignment: TeacherAssignment) {
  const params = new URLSearchParams({
    assignment: assignment.id,
    assignmentData: encodeAssignment(assignment),
  });
  if (assignment.snapshotData) params.set("snapshot", assignment.snapshotData);
  return `/experiments/${assignment.experimentId}?${params.toString()}`;
}

export function assignmentShareUrl(assignment: TeacherAssignment) {
  return `${window.location.origin}${assignmentSharePath(assignment)}`;
}

export function exportAssignments() {
  return {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    assignments: listAssignments(),
  };
}

export function importAssignments(payload: unknown) {
  const parsed = payload as { assignments?: TeacherAssignment[] };
  if (!Array.isArray(parsed.assignments)) return 0;
  const existing = readAssignments();
  for (const assignment of parsed.assignments) {
    if (assignment.id && assignment.experimentId) existing[assignment.id] = { ...assignment, snapshotData: extractSnapshotData(assignment.snapshotData ?? "") };
  }
  localStorage.setItem(KEY, JSON.stringify(existing));
  return parsed.assignments.length;
}

export function defaultAssignmentDraft(): Omit<TeacherAssignment, "id" | "createdAt" | "updatedAt"> {
  const firstClass = classOptions[0];
  const firstTopic = allCurriculumTopics().find((topic) => topic.classId === firstClass.id);
  const firstExperimentId = firstTopic?.experimentIds[0] ?? experiments[0].id;
  return {
    title: "Guided Physics Lab",
    classId: firstClass.id,
    topicId: firstTopic?.id ?? "",
    experimentId: firstExperimentId,
    instructions: "Complete the concept, prediction, experiment, notebook, and quiz stages.",
    dueDate: "",
    snapshotData: "",
    lockVariables: false,
    requireNotebook: true,
    requireQuiz: true,
  };
}

export function extractSnapshotData(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    return parsed.searchParams.get("snapshot") ?? "";
  } catch {
    const params = new URLSearchParams(trimmed.startsWith("?") ? trimmed : `snapshot=${trimmed}`);
    return params.get("snapshot") ?? "";
  }
}

function readAssignments(): Record<string, TeacherAssignment> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, TeacherAssignment>;
  } catch {
    return {};
  }
}

function encodeAssignment(assignment: TeacherAssignment) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(assignment))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeAssignment(encoded: string): TeacherAssignment | undefined {
  try {
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const parsed = JSON.parse(decodeURIComponent(escape(atob(padded)))) as TeacherAssignment;
    if (!parsed.id || !parsed.experimentId || !parsed.title) return undefined;
    parsed.snapshotData = extractSnapshotData(parsed.snapshotData ?? "");
    return parsed;
  } catch {
    return undefined;
  }
}
