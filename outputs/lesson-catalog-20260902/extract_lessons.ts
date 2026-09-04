import fs from "node:fs";
import { curriculum } from "../../src/lib/curriculum";
import { experiments } from "../../src/lib/experiments";
import { learningStudioProfiles } from "../../src/lib/learningStudio";

const experimentById = new Map(experiments.map((item) => [item.id, item]));
const profileById = new Map(learningStudioProfiles.map((item) => [item.experimentId, item]));

const curriculumTopics = curriculum.flatMap((level) =>
  level.units.flatMap((unit) =>
    unit.topics.map((topic) => ({
      classId: level.id,
      grade: level.grade,
      classLabel: level.label,
      curriculumSource: level.source,
      classDescription: level.description,
      unitId: unit.id,
      unitTitle: unit.title,
      unitMarks: unit.marks ?? null,
      topicId: topic.id,
      topicTitle: topic.title,
      domain: topic.domain,
      stage: topic.stage,
      outcomes: topic.outcomes,
      tools: topic.tools,
      experimentIds: topic.experimentIds,
    })),
  ),
);

const lessonMappings = curriculumTopics.flatMap((topic) =>
  topic.experimentIds.length
    ? topic.experimentIds.map((experimentId) => {
        const lesson = experimentById.get(experimentId);
        const profile = profileById.get(experimentId);
        return {
          ...topic,
          lessonId: experimentId,
          lessonTitle: lesson?.title ?? "Unresolved experiment",
          lessonCategory: lesson?.category ?? "Unresolved",
          difficulty: lesson?.difficulty ?? "",
          classLevel: lesson?.classLevel ?? "",
          aim: lesson?.aim ?? "",
          theory: lesson?.theory ?? "",
          formulae: lesson?.formulae.map((formula) => `${formula.name}: ${formula.expression}`) ?? [],
          apparatus: lesson?.apparatus ?? [],
          procedure: lesson?.procedure ?? [],
          observationColumns: lesson?.observationColumns ?? [],
          expectedResult: lesson?.expectedResult ?? "",
          readinessScore: profile?.readinessScore ?? null,
          priority: profile?.priority ?? "",
          lessonQuestion: profile?.lessonQuestion ?? "",
          misconception: profile?.misconception ?? "",
          successEvidence: profile?.successEvidence ?? "",
        };
      })
    : [{
        ...topic,
        lessonId: "",
        lessonTitle: "No mapped interactive lesson",
        lessonCategory: topic.domain,
        difficulty: "",
        classLevel: topic.classLabel,
        aim: "",
        theory: "",
        formulae: [],
        apparatus: [],
        procedure: [],
        observationColumns: [],
        expectedResult: "",
        readinessScore: null,
        priority: "",
        lessonQuestion: "",
        misconception: "",
        successEvidence: "",
      }],
);

const lessonProfiles = experiments.map((lesson) => {
  const profile = profileById.get(lesson.id);
  const mappedTopics = curriculumTopics.filter((topic) => topic.experimentIds.includes(lesson.id));
  return {
    lessonId: lesson.id,
    title: lesson.title,
    category: lesson.category,
    classLevel: lesson.classLevel,
    difficulty: lesson.difficulty,
    mappedClasses: [...new Set(mappedTopics.map((item) => item.classLabel))],
    mappedUnits: [...new Set(mappedTopics.map((item) => item.unitTitle))],
    mappedTopics: [...new Set(mappedTopics.map((item) => item.topicTitle))],
    curriculumDomains: lesson.curriculumTags?.domains ?? [],
    aim: lesson.aim,
    theory: lesson.theory,
    apparatus: lesson.apparatus,
    formulae: lesson.formulae.map((formula) => `${formula.name}: ${formula.expression}`),
    procedure: lesson.procedure,
    observationColumns: lesson.observationColumns,
    expectedResult: lesson.expectedResult,
    commonMistakes: lesson.commonMistakes,
    vivaCount: lesson.vivaQuestions.length,
    readinessScore: profile?.readinessScore ?? null,
    learningScore: profile?.learningScore ?? null,
    classroomScore: profile?.classroomScore ?? null,
    accuracyScore: profile?.accuracyScore ?? null,
    priority: profile?.priority ?? "",
    lessonQuestion: profile?.lessonQuestion ?? "",
    successEvidence: profile?.successEvidence ?? "",
    teacherChecks: profile?.teacherChecks ?? [],
    studentOutputs: profile?.studentOutputs ?? [],
  };
});

fs.writeFileSync(
  new URL("./lesson_data.json", import.meta.url),
  JSON.stringify({ curriculumTopics, lessonMappings, lessonProfiles }, null, 2),
);

console.log(JSON.stringify({
  curriculumLevels: curriculum.length,
  curriculumTopics: curriculumTopics.length,
  lessonMappings: lessonMappings.length,
  lessons: lessonProfiles.length,
  unmappedLessons: lessonProfiles.filter((item) => item.mappedTopics.length === 0).length,
  unresolvedMappings: lessonMappings.filter((item) => item.lessonId && item.lessonTitle === "Unresolved experiment").length,
}));
