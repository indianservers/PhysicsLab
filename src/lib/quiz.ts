import { allSolverQuestions, solverCategories, SolverDifficulty } from "./solver";

export type QuizDifficulty = SolverDifficulty;

export interface QuizCategoryOption {
  id: string;
  title: string;
  domain: string;
  classRange: string;
  subcategories: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

export interface QuizQuestion {
  id: string;
  categoryId: string;
  categoryTitle: string;
  subcategoryId: string;
  subcategoryTitle: string;
  classRange: string;
  difficulty: QuizDifficulty;
  prompt: string;
  options: string[];
  correctOption: string;
  answer: string;
  conceptTags: string[];
}

export interface QuizFilters {
  categoryId?: string;
  subcategoryId?: string;
  difficulty?: "all" | QuizDifficulty;
  classFilter?: string;
  seed?: number;
  weakConcepts?: string[];
}

export const quizCategoryOptions: QuizCategoryOption[] = solverCategories.map((category) => ({
  id: category.id,
  title: category.title,
  domain: category.domain,
  classRange: category.classRange,
  subcategories: category.subcategories.map((subcategory) => ({
    id: subcategory.id,
    title: subcategory.title,
    description: subcategory.description,
  })),
}));

const sourceQuestions = allSolverQuestions().slice(0, 400);

export const quizQuestions: QuizQuestion[] = sourceQuestions.map((question) => {
  const correctOption = compactAnswer(question.answer);
  const distractors = sourceQuestions
    .filter((candidate) => candidate.id !== question.id)
    .filter((candidate) => candidate.category.id === question.category.id || candidate.difficulty === question.difficulty)
    .map((candidate) => compactAnswer(candidate.answer));
  const options = stableShuffle(uniqueOptions([correctOption, ...distractors, ...fallbackDistractors(question.conceptTags)]).slice(0, 4), question.id);

  return {
    id: `quiz-${question.id}`,
    categoryId: question.category.id,
    categoryTitle: question.category.title,
    subcategoryId: question.subcategory.id,
    subcategoryTitle: question.subcategory.title,
    classRange: question.classRange,
    difficulty: question.difficulty,
    prompt: question.prompt,
    options,
    correctOption,
    answer: question.answer,
    conceptTags: question.conceptTags,
  };
});

export const quizStats = {
  questions: quizQuestions.length,
  sessionSize: 12,
  categories: new Set(quizQuestions.map((question) => question.categoryId)).size,
  subcategories: new Set(quizQuestions.map((question) => question.subcategoryId)).size,
  basic: quizQuestions.filter((question) => question.difficulty === "Basic").length,
  intermediate: quizQuestions.filter((question) => question.difficulty === "Intermediate").length,
  difficult: quizQuestions.filter((question) => question.difficulty === "Difficult").length,
};

export function getQuizQuestions(filters: QuizFilters = {}) {
  return quizQuestions.filter((question) => {
    const categoryMatch = !filters.categoryId || filters.categoryId === "all" || question.categoryId === filters.categoryId;
    const subcategoryMatch = !filters.subcategoryId || filters.subcategoryId === "all" || question.subcategoryId === filters.subcategoryId;
    const difficultyMatch = !filters.difficulty || filters.difficulty === "all" || question.difficulty === filters.difficulty;
    const classMatch = !filters.classFilter || filters.classFilter === "all" || question.classRange.includes(filters.classFilter);
    return categoryMatch && subcategoryMatch && difficultyMatch && classMatch;
  });
}

export function makeQuizSession(filters: QuizFilters = {}) {
  const strictPool = getQuizQuestions(filters);
  const relaxedPool = strictPool.length >= quizStats.sessionSize ? strictPool : getQuizQuestions({ ...filters, subcategoryId: "all" });
  const finalPool = relaxedPool.length >= quizStats.sessionSize ? relaxedPool : quizQuestions;
  const seed = `session-${filters.seed ?? 1}-${filters.categoryId ?? "all"}-${filters.subcategoryId ?? "all"}-${filters.difficulty ?? "all"}-${filters.classFilter ?? "all"}`;
  const weakConcepts = new Set((filters.weakConcepts ?? []).map((concept) => concept.toLowerCase()));
  if (weakConcepts.size === 0) return stableShuffle(finalPool, seed).slice(0, quizStats.sessionSize);

  const weakPool = finalPool.filter((question) => question.conceptTags.some((tag) => weakConcepts.has(tag.toLowerCase())));
  if (weakPool.length < 3) return stableShuffle(finalPool, seed).slice(0, quizStats.sessionSize);

  const targetWeakCount = Math.min(8, Math.max(4, Math.ceil(quizStats.sessionSize * 0.6)));
  const weakQuestions = stableShuffle(weakPool, `${seed}-weak`).slice(0, targetWeakCount);
  const weakIds = new Set(weakQuestions.map((question) => question.id));
  const mixedQuestions = stableShuffle(finalPool.filter((question) => !weakIds.has(question.id)), `${seed}-mixed`).slice(0, quizStats.sessionSize - weakQuestions.length);
  return stableShuffle([...weakQuestions, ...mixedQuestions], `${seed}-final`).slice(0, quizStats.sessionSize);
}

function compactAnswer(answer: string) {
  const cleaned = answer.replace(/\s+/g, " ").trim();
  const firstSentence = cleaned.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim();
  const compact = firstSentence && firstSentence.length >= 32 ? firstSentence : cleaned;
  return compact.length > 170 ? `${compact.slice(0, 167).trim()}...` : compact;
}

function uniqueOptions(options: string[]) {
  const seen = new Set<string>();
  return options.filter((option) => {
    const key = option.toLowerCase();
    if (seen.has(key) || option.length < 8) return false;
    seen.add(key);
    return true;
  });
}

function fallbackDistractors(tags: string[]) {
  const topic = tags[0] ?? "the concept";
  return [
    `Only memorize ${topic}; no units or reasoning are needed.`,
    `Use any formula first, then decide units after the final number.`,
    `Ignore direction, signs, and graph area because they do not affect the result.`,
    `Change two variables together so the pattern is easier to force.`,
  ];
}

function stableShuffle<T>(items: T[], seed: string) {
  return [...items].sort((left, right) => hash(`${seed}-${String(left)}`) - hash(`${seed}-${String(right)}`));
}

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}
