import { ExperimentDefinition } from "../types";
import { safeStorage } from "./safeStorage";

export type GuidedStage = "concept" | "predict" | "experiment" | "record" | "quiz" | "mastered";

export interface QuizItem {
  id: string;
  prompt: string;
  answer: string;
  options: string[];
}

export interface LearningRecord {
  experimentId: string;
  currentStage: GuidedStage;
  completedStages: GuidedStage[];
  prediction: string;
  observation: string;
  conclusion: string;
  quizAnswers: Record<string, string>;
  quizScore: number;
  updatedAt: string;
}

const KEY = "physicslab-learning-records-v1";
const stages: GuidedStage[] = ["concept", "predict", "experiment", "record", "quiz", "mastered"];

export function createEmptyRecord(experimentId: string): LearningRecord {
  return {
    experimentId,
    currentStage: "concept",
    completedStages: [],
    prediction: "",
    observation: "",
    conclusion: "",
    quizAnswers: {},
    quizScore: 0,
    updatedAt: new Date().toISOString(),
  };
}

export function listLearningRecords(): LearningRecord[] {
  return Object.values(readRecords()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getLearningRecord(experimentId: string): LearningRecord {
  return readRecords()[experimentId] ?? createEmptyRecord(experimentId);
}

export function saveLearningRecord(record: LearningRecord) {
  const normalized = normalizeLearningRecord(record);
  if (!normalized) return;
  const records = readRecords();
  records[normalized.experimentId] = { ...normalized, updatedAt: new Date().toISOString() };
  safeStorage.writeJSON(KEY, records);
}

export function completeStage(record: LearningRecord, stage: GuidedStage): LearningRecord {
  if (!stages.includes(stage)) return record;
  const completedStages = Array.from(new Set([...(Array.isArray(record.completedStages) ? record.completedStages.filter(item => stages.includes(item)) : []), stage]));
  const currentIndex = stages.indexOf(stage);
  const next = stages[Math.min(stages.length - 1, currentIndex + 1)] ?? "mastered";
  return { ...record, completedStages, currentStage: next };
}

export function progressPercent(record: LearningRecord) {
  return Math.round((new Set(Array.isArray(record.completedStages) ? record.completedStages.filter(stage => stages.includes(stage)) : []).size / stages.length) * 100);
}

export function generateQuiz(experiment: ExperimentDefinition): QuizItem[] {
  const firstViva = experiment.vivaQuestions[0];
  const formula = experiment.formulae[0];
  const mistake = experiment.commonMistakes[0];
  return [
    {
      id: "viva",
      prompt: firstViva?.prompt ?? `What is the main aim of ${experiment.title}?`,
      answer: firstViva?.answer ?? experiment.aim,
      options: shuffle([
        firstViva?.answer ?? experiment.aim,
        "It is independent of all variables in the setup.",
        "Only the apparatus list is needed to explain it.",
      ]),
    },
    {
      id: "formula",
      prompt: "Which formula or relation is most useful here?",
      answer: formula?.expression ?? "Use the displayed model relation.",
      options: shuffle([
        formula?.expression ?? "Use the displayed model relation.",
        "density = mass + volume",
        "speed = force x time",
      ]),
    },
    {
      id: "mistake",
      prompt: "Which mistake should you avoid in this lab?",
      answer: mistake ?? "Using inconsistent units",
      options: shuffle([
        mistake ?? "Using inconsistent units",
        "Recording observations before changing variables",
        "Writing units with measured values",
      ]),
    },
  ];
}

export function gradeQuiz(quiz: QuizItem[], answers: Record<string, string>) {
  const correct = quiz.filter((item) => answers[item.id] === item.answer).length;
  return Math.round((correct / Math.max(1, quiz.length)) * 100);
}

export function exportLearningPortfolio(experiments: ExperimentDefinition[]) {
  const records = listLearningRecords();
  return {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    records: records.map((record) => {
      const experiment = experiments.find((item) => item.id === record.experimentId);
      return {
        ...record,
        title: experiment?.title ?? record.experimentId,
        classLevel: experiment?.classLevel ?? "",
        tags: experiment?.curriculumTags,
      };
    }),
  };
}

export function importLearningRecords(records: LearningRecord[]) {
  const existing = readRecords();
  let count = 0;
  if (!Array.isArray(records)) return count;
  for (const record of records) {
    const normalized = normalizeLearningRecord(record);
    if (!normalized) continue;
    existing[normalized.experimentId] = normalized;
    count++;
  }
  safeStorage.writeJSON(KEY, existing);
  return count;
}

function readRecords(): Record<string, LearningRecord> {
  const parsed = safeStorage.readJSON<unknown>(KEY, {});
  const result: Record<string, LearningRecord> = Object.create(null);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return result;
  for (const value of Object.values(parsed)) { const record = normalizeLearningRecord(value); if (record) result[record.experimentId] = record; }
  return result;
}

export function normalizeLearningRecord(value: unknown): LearningRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Partial<LearningRecord>;
  if (typeof record.experimentId !== "string" || !record.experimentId.trim() || ["__proto__", "constructor", "prototype"].includes(record.experimentId)) return null;
  const initial = createEmptyRecord(record.experimentId);
  return { ...initial,
    currentStage: record.currentStage && stages.includes(record.currentStage) ? record.currentStage : "concept",
    completedStages: Array.from(new Set(Array.isArray(record.completedStages) ? record.completedStages.filter(stage => stages.includes(stage)) : [])),
    prediction: typeof record.prediction === "string" ? record.prediction : "",
    observation: typeof record.observation === "string" ? record.observation : "",
    conclusion: typeof record.conclusion === "string" ? record.conclusion : "",
    quizAnswers: record.quizAnswers && typeof record.quizAnswers === "object" && !Array.isArray(record.quizAnswers) ? Object.fromEntries(Object.entries(record.quizAnswers).filter(([,answer]) => typeof answer === "string")) : {},
    quizScore: typeof record.quizScore === "number" && Number.isFinite(record.quizScore) ? Math.max(0, Math.min(100, record.quizScore)) : 0,
    updatedAt: typeof record.updatedAt === "string" && Number.isFinite(Date.parse(record.updatedAt)) ? record.updatedAt : initial.updatedAt,
  };
}

function shuffle<T>(items: T[]) {
  return [...items].sort((a, b) => String(a).localeCompare(String(b)));
}
