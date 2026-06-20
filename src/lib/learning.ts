import { ExperimentDefinition } from "../types";

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
  const records = readRecords();
  records[record.experimentId] = { ...record, updatedAt: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(records));
}

export function completeStage(record: LearningRecord, stage: GuidedStage): LearningRecord {
  const completedStages = Array.from(new Set([...record.completedStages, stage]));
  const currentIndex = stages.indexOf(stage);
  const next = stages[Math.min(stages.length - 1, currentIndex + 1)] ?? "mastered";
  return { ...record, completedStages, currentStage: next };
}

export function progressPercent(record: LearningRecord) {
  return Math.round((record.completedStages.length / stages.length) * 100);
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
  for (const record of records) {
    if (!record.experimentId || !record.currentStage) continue;
    existing[record.experimentId] = {
      ...createEmptyRecord(record.experimentId),
      ...record,
      updatedAt: record.updatedAt || new Date().toISOString(),
    };
    count++;
  }
  localStorage.setItem(KEY, JSON.stringify(existing));
  return count;
}

function readRecords(): Record<string, LearningRecord> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, LearningRecord>;
  } catch {
    return {};
  }
}

function shuffle<T>(items: T[]) {
  return [...items].sort((a, b) => String(a).localeCompare(String(b)));
}
