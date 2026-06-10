import { curriculum } from "./curriculum";
import { experiments } from "./experiments";
import { allPhysicsFormulas } from "./formulaBank";
import { iconForCategory, iconForExperiment, iconForTool, PhysicsIconName } from "./icons";
import { objectRegistry } from "./objectRegistry";
import { quizQuestions } from "./quiz";
import { allSolverQuestions } from "./solver";

export type SearchResultType = "experiment" | "topic" | "solver" | "quiz" | "formula" | "object" | "action";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  snippet: string;
  path: string;
  icon: PhysicsIconName;
  score: number;
  tags: string[];
}

interface SearchRecord extends Omit<SearchResult, "score" | "snippet"> {
  titleText: string;
  bodyText: string;
}

const aliases: Record<string, string> = {
  c: "critical angle total internal reflection optics prism",
  tir: "total internal reflection critical angle",
  ydse: "young double slit experiment interference fringe",
  shm: "simple harmonic motion spring pendulum oscillation",
  emi: "electromagnetic induction faraday lenz generator transformer",
  ac: "alternating current transformer generator",
  dc: "direct current circuit battery resistance",
  vi: "voltage current graph ohm law",
  "v i": "voltage current graph ohm law",
  "ohms": "ohm's law resistance current voltage",
  "ray optics": "mirror lens prism refraction reflection",
  "wave optics": "interference diffraction polarization young slit",
  "newton": "force motion inertia momentum acceleration",
  "snell": "snell's law refraction refractive index",
  "malus": "malus law polarization analyzer intensity",
  "bohr": "hydrogen atom energy level modern physics",
  "de broglie": "matter wave wavelength momentum",
};

const typeWeights: Record<SearchResultType, number> = {
  action: 10,
  experiment: 9,
  topic: 7,
  formula: 7,
  solver: 5,
  quiz: 4,
  object: 4,
};

const topicPathByDomain: Record<string, string> = {
  astronomy: "astronomy",
  electricity: "electricity",
  electronics: "electronics",
  energy: "energy",
  "fluid mechanics": "fluid-mechanics",
  magnetism: "magnetism",
  mechanics: "mechanics",
  measurement: "measurement",
  "modern physics": "modern-physics",
  optics: "optics",
  thermodynamics: "thermodynamics",
  waves: "waves",
};

const index: SearchRecord[] = [
  ...[
    { id: "action-sandbox", title: "Open sandbox", subtitle: "Action · Simulation workspace", path: "/sandbox", icon: "spark" as const, tags: ["sandbox", "lab", "simulation", "free workspace"] },
    { id: "action-guided-lab", title: "Open guided lab", subtitle: "Action · Lab workspace", path: "/lab", icon: "compass" as const, tags: ["guided", "lab", "workspace"] },
    { id: "action-experiments", title: "Browse experiments", subtitle: "Action - Experiment library", path: "/experiments", icon: "flask" as const, tags: ["experiments", "library", "demos", "practicals"] },
    { id: "action-formulas", title: "Open formula bank", subtitle: "Action - Formula reference", path: "/formulas", icon: "book" as const, tags: ["formula", "equation", "reference", "physics formulas"] },

    { id: "action-video", title: "Open video analysis", subtitle: "Action · Measurement tool", path: "/video", icon: "eye" as const, tags: ["video", "analysis", "motion", "tracking"] },
    { id: "action-quantum", title: "Open quantum lab", subtitle: "Action · Advanced physics", path: "/quantum", icon: "atom" as const, tags: ["quantum", "photoelectric", "bohr", "advanced"] },
    { id: "action-teacher", title: "Open teacher mode", subtitle: "Action · Assignments", path: "/teacher", icon: "teacher" as const, tags: ["teacher", "assignments", "classroom"] },
    { id: "action-projects", title: "Open projects", subtitle: "Action · Saved work", path: "/projects", icon: "folder" as const, tags: ["projects", "saved", "portfolio"] },
    { id: "action-settings", title: "Open settings", subtitle: "Action · Preferences", path: "/settings", icon: "settings" as const, tags: ["settings", "theme", "accessibility"] },
    { id: "action-help", title: "Open help", subtitle: "Action · Guidance", path: "/help", icon: "book" as const, tags: ["help", "support", "guide", "shortcuts"] },
  ].map((action) => ({
    ...action,
    type: "action" as const,
    titleText: [action.title, action.subtitle, ...action.tags].join(" "),
    bodyText: action.tags.join(" "),
  })),
  ...experiments.map((experiment) => {
    const tags = [
      experiment.category,
      experiment.classLevel,
      ...(experiment.curriculumTags?.domains ?? []),
      ...(experiment.curriculumTags?.topicIds ?? []),
      ...(experiment.curriculumTags?.classes ?? []).map((grade) => `Class ${grade}`),
    ];
    return {
      id: `experiment-${experiment.id}`,
      type: "experiment" as const,
      title: experiment.title,
      subtitle: `${experiment.category} · ${experiment.classLevel}`,
      path: `/experiments/${experiment.id}`,
      icon: iconForExperiment(experiment),
      tags,
      titleText: [experiment.title, experiment.category, experiment.classLevel, ...tags].join(" "),
      bodyText: [
        experiment.aim,
        experiment.theory,
        experiment.expectedResult,
        ...(experiment.apparatus ?? []),
        ...(experiment.procedure ?? []),
        ...(experiment.commonMistakes ?? []),
        ...(experiment.vivaQuestions ?? []).flatMap((question) => [question.prompt, question.answer]),
      ].join(" "),
    };
  }),
  ...experiments.flatMap((experiment) =>
    (experiment.formulae ?? []).map((formula) => ({
      id: `formula-${experiment.id}-${formula.id}`,
      type: "formula" as const,
      title: formula.name,
      subtitle: `${experiment.title} · Formula`,
      path: `/experiments/${experiment.id}`,
      icon: "calculator" as const,
      tags: [experiment.category, experiment.classLevel, "formula"],
      titleText: [formula.name, formula.expression, experiment.title].join(" "),
      bodyText: [formula.expression, ...(formula.variables ?? []).flatMap((variable) => [variable.symbol, variable.name, variable.unit])].join(" "),
    }))
  ),
  ...allPhysicsFormulas.map((formula) => ({
    id: `formula-bank-${formula.category.id}-${formula.id}`,
    type: "formula" as const,
    title: formula.name,
    subtitle: `${formula.category.title} - Formula bank`,
    path: `/formulas?category=${formula.category.id}&q=${encodeURIComponent(formula.name)}`,
    icon: formula.category.icon,
    tags: [formula.category.domain, formula.category.classRange, ...formula.tags, "formula"],
    titleText: [formula.name, formula.expression, formula.category.title, formula.category.domain, ...formula.tags].join(" "),
    bodyText: [formula.expression, ...formula.variables, ...formula.tags, formula.category.classRange].join(" "),
  })),

  ...curriculum.flatMap((schoolClass) =>
    schoolClass.units.flatMap((unit) =>
      unit.topics.map((topic) => ({
        id: `topic-${topic.id}`,
        type: "topic" as const,
        title: topic.title,
        subtitle: `${schoolClass.label} · ${unit.title} · ${topic.domain}`,
        path: `/topics/${topicPathByDomain[normalize(topic.domain)] ?? "mechanics"}`,
        icon: iconForCategory(topic.domain),
        tags: [schoolClass.label, unit.title, topic.domain, topic.stage],
        titleText: [topic.title, topic.domain, schoolClass.label, unit.title, topic.stage].join(" "),
        bodyText: [...topic.outcomes, ...topic.tools, ...topic.experimentIds, schoolClass.description].join(" "),
      }))
    )
  ),
  ...allSolverQuestions().map((question) => ({
    id: `solver-${question.id}`,
    type: "solver" as const,
    title: question.prompt,
    subtitle: `${question.category.title} · ${question.subcategory.title} · ${question.difficulty}`,
    path: `/solver?query=${encodeURIComponent(question.prompt)}`,
    icon: "calculator" as const,
    tags: [question.category.domain, question.classRange, question.difficulty, ...question.conceptTags],
    titleText: [question.prompt, question.category.title, question.subcategory.title, ...question.conceptTags].join(" "),
    bodyText: [question.answer, question.category.domain, question.classRange].join(" "),
  })),
  ...quizQuestions.map((question) => ({
    id: `quiz-${question.id}`,
    type: "quiz" as const,
    title: question.prompt,
    subtitle: `${question.categoryTitle} · Quiz · ${question.difficulty}`,
    path: `/quiz?query=${encodeURIComponent(question.prompt)}`,
    icon: "check" as const,
    tags: [question.categoryTitle, question.subcategoryTitle, question.classRange, question.difficulty, ...question.conceptTags],
    titleText: [question.prompt, question.categoryTitle, question.subcategoryTitle, ...question.conceptTags].join(" "),
    bodyText: [question.answer, ...question.options].join(" "),
  })),
  ...objectRegistry.map((object) => ({
    id: `object-${object.id}`,
    type: "object" as const,
    title: object.name,
    subtitle: `${object.category} · Lab object`,
    path: `/lab?object=${encodeURIComponent(object.id)}`,
    icon: iconForTool(`${object.name} ${object.category}`),
    tags: [object.category, object.simulationType, "lab object"],
    titleText: [object.name, object.category, object.simulationType].join(" "),
    bodyText: [
      ...object.editableProperties.map((property) => property.label),
      ...Object.keys(object.defaultProperties),
    ].join(" "),
  })),
];

export const suggestedSearches = [
  "Prism dispersion",
  "Critical angle TIR",
  "Ohm's law V-I graph",
  "Projectile motion",
  "Young double slit",
  "Magnetic field",
  "Heat transfer",
  "Buoyancy",
];

export function searchAll(query: string, limit = 36): SearchResult[] {
  const expanded = expandQuery(query);
  const tokens = tokenize(expanded);
  if (!tokens.length) return [];

  return index
    .map((record) => {
      const score = scoreRecord(record, tokens, query);
      return { ...record, score, snippet: makeSnippet(record, tokens) };
    })
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score || left.title.length - right.title.length)
    .slice(0, limit);
}

export function searchCounts() {
  return index.reduce<Record<SearchResultType, number>>(
    (counts, item) => ({ ...counts, [item.type]: counts[item.type] + 1 }),
    { action: 0, experiment: 0, topic: 0, solver: 0, quiz: 0, formula: 0, object: 0 }
  );
}

export function searchTokens(query: string) {
  return tokenize(expandQuery(query));
}

function scoreRecord(record: SearchRecord, tokens: string[], rawQuery: string) {
  const normalizedTitle = normalize(record.titleText);
  const normalizedBody = normalize(record.bodyText);
  const normalizedTags = normalize(record.tags.join(" "));
  const exactQuery = normalize(rawQuery);
  let score = typeWeights[record.type];

  if (exactQuery.length > 2 && normalizedTitle.includes(exactQuery)) score += 80;
  if (exactQuery.length > 2 && normalizedBody.includes(exactQuery)) score += 24;

  for (const token of tokens) {
    if (normalizedTitle.startsWith(token)) score += 34;
    if (normalizedTitle.includes(token)) score += 22;
    if (normalizedTags.includes(token)) score += 18;
    if (normalizedBody.includes(token)) score += 7;
  }

  const coverage = tokens.filter((token) => `${normalizedTitle} ${normalizedTags} ${normalizedBody}`.includes(token)).length;
  if (coverage === 0) return 0;
  score += coverage * 12;
  if (coverage === tokens.length) score += 24;
  return score;
}

function makeSnippet(record: SearchRecord, tokens: string[]) {
  const fields = [record.bodyText, record.titleText].filter(Boolean);
  for (const field of fields) {
    const clean = squeeze(field);
    const normalized = normalize(clean);
    const hit = tokens.map((token) => normalized.indexOf(token)).filter((indexOfToken) => indexOfToken >= 0).sort((a, b) => a - b)[0];
    if (hit === undefined) continue;
    const start = Math.max(0, hit - 48);
    const snippet = clean.slice(start, start + 150).trim();
    return `${start > 0 ? "... " : ""}${snippet}${start + 150 < clean.length ? " ..." : ""}`;
  }
  return record.subtitle;
}

function expandQuery(query: string) {
  const normalized = normalize(query);
  const expansions = Object.entries(aliases)
    .filter(([alias]) => normalized.includes(alias))
    .map(([, expansion]) => expansion);
  return [query, ...expansions].join(" ");
}

function tokenize(value: string) {
  return Array.from(new Set(normalize(value).split(" ").filter((token) => token.length > 1)));
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/\\theta/g, "theta")
    .replace(/\\lambda/g, "lambda")
    .replace(/\\rho/g, "rho")
    .replace(/\\pi/g, "pi")
    .replace(/[^\w\s.+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function squeeze(value: string) {
  return value.replace(/\s+/g, " ").trim();
}
