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

const generatedQuizQuestions: QuizQuestion[] = sourceQuestions.map((question) => {
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

export const quizQuestions: QuizQuestion[] = [
  ...generatedQuizQuestions,
  ...buildTopicQuizBoosters(),
];

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

function buildTopicQuizBoosters(): QuizQuestion[] {
  return solverCategories.flatMap((category) =>
    category.subcategories.flatMap((subcategory) => {
      const tags = uniqueTags([...category.conceptTags, ...subcategory.questions.flatMap((question) => question.conceptTags)]).slice(0, 5);
      const primaryTag = tags[0] ?? subcategory.title;
      const secondaryTag = tags[1] ?? category.domain;
      const classRange = subcategory.questions[0]?.classRange ?? category.classRange;
      const common = {
        categoryId: category.id,
        categoryTitle: category.title,
        subcategoryId: subcategory.id,
        subcategoryTitle: subcategory.title,
        classRange,
        conceptTags: tags.length > 0 ? tags : [subcategory.title],
      };
      return [
        makeQuizQuestion({
          ...common,
          id: `topic-${subcategory.id}-model`,
          difficulty: "Basic",
          prompt: `In ${subcategory.title}, what should you identify before substituting numbers?`,
          correctOption: `The physical model, known values, unknown quantity, and units for ${primaryTag}.`,
          options: [
            `The physical model, known values, unknown quantity, and units for ${primaryTag}.`,
            `The final numerical answer first, then the formula later if time remains.`,
            `Only the biggest number in the question, because it usually controls the answer.`,
            `A random formula from the same chapter, even if the variables do not match.`,
          ],
          answer: `${subcategory.title} problems are easiest when you name the model first, list knowns and unknowns, and keep units consistent before calculation.`,
        }),
        makeQuizQuestion({
          ...common,
          id: `topic-${subcategory.id}-variable`,
          difficulty: "Intermediate",
          prompt: `A learner is testing ${subcategory.title} in a simulation and changes two sliders together. What is the best correction?`,
          correctOption: `Change one variable at a time and compare the output pattern clearly.`,
          options: [
            `Change one variable at a time and compare the output pattern clearly.`,
            `Keep changing all sliders until the result looks close to the textbook answer.`,
            `Ignore the graph or table because simulations do not need controlled trials.`,
            `Use only the largest slider value so the effect becomes dramatic.`,
          ],
          answer: `A controlled trial changes one variable at a time. That makes the relationship in ${subcategory.title} easier to see and explain.`,
        }),
        makeQuizQuestion({
          ...common,
          id: `topic-${subcategory.id}-check`,
          difficulty: "Difficult",
          prompt: `Which final-answer check is most useful for a ${subcategory.title} question?`,
          correctOption: `Check units, sign or direction, and whether the size is physically reasonable.`,
          options: [
            `Check units, sign or direction, and whether the size is physically reasonable.`,
            `Accept any answer with many decimal places because precision proves correctness.`,
            `Remove units from the final line so the number is easier to read.`,
            `Compare only with ${secondaryTag}; signs and magnitudes are not important.`,
          ],
          answer: `For ${subcategory.title}, the final answer should have correct units, sensible sign or direction where relevant, and a magnitude that fits the situation.`,
        }),
      ];
    })
  );
}

function makeQuizQuestion(question: QuizQuestion): QuizQuestion {
  return {
    ...question,
    options: stableShuffle(question.options, question.id),
  };
}

function uniqueTags(tags: string[]) {
  return Array.from(new Set(tags.filter(Boolean)));
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
