import { curriculum } from "./curriculum";
import { experiments } from "./experiments";
import { allPhysicsFormulas } from "./formulaBank";
import { iconForCategory, iconForExperiment, iconForTool, PhysicsIconName } from "./icons";
import { physicsDictionary } from "./dictionary";
import { astrophysicsConcepts } from "./astrophysics";
import { particlePhysicsConcepts } from "./particlePhysics";
import { atmosphereLayers } from "./atmosphere";
import { stringTheoryConcepts } from "./stringTheory";
import { physicsInnovations } from "./physicsInnovations";
import { learningStudioProfiles } from "./learningStudio";
import { simulationDepthProfiles } from "./simulationDepth";
import { classroomDeploymentProfiles } from "./classroomDeployment";
import { accessibilityProfiles } from "./accessibilityAudit";
import { masteryRoadmapProfiles } from "./masteryRoadmap";
import { insightProfiles } from "./insightAnalytics";
import { releaseGovernanceProfiles } from "./releaseGovernance";
import { excellenceBenchmarkPillars, excellenceSprintItems } from "./excellenceBenchmark";
import { objectRegistry } from "./objectRegistry";
import { quizQuestions } from "./quiz";
import { allSolverQuestions } from "./solver";

export type SearchResultType = "experiment" | "topic" | "solver" | "quiz" | "formula" | "dictionary" | "object" | "action";

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
  qft: "quantum field theory particle physics field excitation",
  higgs: "higgs field higgs boson mass standard model",
  "standard model": "particle physics quarks leptons gauge bosons higgs",
  gluon: "strong interaction color charge quark confinement",
  neutrino: "neutrino oscillation lepton flavor mass particle physics",
  atmosphere: "earth atmosphere layers troposphere stratosphere mesosphere thermosphere exosphere",
  troposphere: "weather clouds passenger plane hot air balloon earth atmosphere",
  stratosphere: "ozone layer weather balloon meteorological rocket earth atmosphere",
  mesosphere: "meteors coldest layer earth atmosphere",
  thermosphere: "aurora ionosphere low earth orbit earth atmosphere",
  exosphere: "satellite spacecraft outer atmosphere",
  "string theory": "vibrating strings quantum gravity extra dimensions theory of everything graviton",
  strings: "string theory vibrating strings particle modes extra dimensions",
  graviton: "string theory quantum gravity vibration mode general relativity",
  inventions: "physics inventions discoveries instruments technology innovations laser transistor telescope battery generator",
  discoveries: "physics discoveries inventions laws theories instruments innovations gravity electron x-rays radioactivity",
  innovations: "physics inventions discoveries instruments technologies milestones explore",
  laser: "coherent light stimulated emission optics invention",
  transistor: "semiconductor switch electronics invention",
  fission: "nuclear fission energy neutron discovery",
  gps: "satellite time relativity positioning technology",
};

const typeWeights: Record<SearchResultType, number> = {
  action: 10,
  experiment: 9,
  topic: 7,
  formula: 7,
  dictionary: 7,
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
    { id: "action-dictionary", title: "Open dictionary", subtitle: "Action - Visual term reference", path: "/dictionary", icon: "clipboard" as const, tags: ["dictionary", "visual dictionary", "terms", "glossary", "physics definitions"] },
    { id: "action-astrophysics", title: "Open AstroPhysics", subtitle: "Action - Space physics concepts", path: "/astrophysics", icon: "orbit" as const, tags: ["astrophysics", "astronomy", "space", "stars", "cosmology"] },
    { id: "action-particle-physics", title: "Open Particle Physics", subtitle: "Action - Standard Model visual concepts", path: "/particle-physics", icon: "atom" as const, tags: ["particle physics", "standard model", "higgs", "quarks", "gluons", "leptons", "qft"] },
    { id: "action-atmosphere", title: "Open Earth Atmosphere", subtitle: "Action - Interactive layer visual", path: "/atmosphere", icon: "orbit" as const, tags: ["earth atmosphere", "layers", "troposphere", "stratosphere", "mesosphere", "thermosphere", "exosphere", "aurora", "satellite"] },
    { id: "action-string-theory", title: "Open String Theory Lab", subtitle: "Action - Interactive 3D theoretical physics", path: "/string-theory", icon: "wave" as const, tags: ["string theory", "vibrating strings", "extra dimensions", "quantum gravity", "theory of everything", "graviton"] },
    { id: "action-physics-innovations", title: "Open Physics Inventions & Discoveries", subtitle: "Action - Explore 100+ physics milestones", path: "/physics-innovations", icon: "spark" as const, tags: ["physics inventions", "discoveries", "innovations", "instruments", "technology", "timeline", "explore"] },
    { id: "action-comparison", title: "Compare physics tools", subtitle: "Action - App benchmark", path: "/comparison", icon: "chart" as const, tags: ["comparison", "ranking", "phet", "labster", "algodoo", "pivot"] },
    { id: "action-quality-audit", title: "Open quality audit", subtitle: "Action - Simulation quality baseline", path: "/quality-audit", icon: "chart" as const, tags: ["quality", "audit", "phase 1", "phet", "accuracy", "visual depth", "simulation validation"] },
    { id: "action-accuracy-center", title: "Open accuracy center", subtitle: "Action - Validated physics benchmarks", path: "/accuracy-center", icon: "check" as const, tags: ["accuracy", "phase 2", "validation", "benchmarks", "solver", "model guardrails", "physics tests"] },
    { id: "action-learning-studio", title: "Open learning studio", subtitle: "Action - Phase 3 guided lesson design", path: "/learning-studio", icon: "teacher" as const, tags: ["learning studio", "phase 3", "lesson", "teacher", "misconception", "predict", "explain", "phet"] },
    { id: "action-simulation-depth", title: "Open simulation depth studio", subtitle: "Action - Phase 4 visual depth upgrades", path: "/simulation-depth", icon: "eye" as const, tags: ["simulation depth", "phase 4", "visual depth", "2d", "3d", "probes", "replay", "phet"] },
    { id: "action-classroom-deployment", title: "Open classroom deployment", subtitle: "Action - Phase 5 assignment rollout", path: "/classroom-deployment", icon: "teacher" as const, tags: ["classroom", "deployment", "phase 5", "teacher", "assignment", "evidence", "rubric", "class pack"] },
    { id: "action-accessibility-center", title: "Open accessibility center", subtitle: "Action - Phase 6 inclusive UX audit", path: "/accessibility-center", icon: "settings" as const, tags: ["accessibility", "phase 6", "keyboard", "contrast", "reduced motion", "screen reader", "inclusive"] },
    { id: "action-roadmap", title: "Open student mastery roadmap", subtitle: "Action - Phase 7 adaptive learning path", path: "/roadmap", icon: "compass" as const, tags: ["roadmap", "phase 7", "mastery", "student path", "adaptive", "curriculum", "practice"] },
    { id: "action-insights-center", title: "Open insights center", subtitle: "Action - Phase 8 intervention analytics", path: "/insights-center", icon: "chart" as const, tags: ["insights", "analytics", "phase 8", "intervention", "teacher dashboard", "readiness", "risk"] },
    { id: "action-release-governance", title: "Open release governance", subtitle: "Action - Phase 9 scientific review gate", path: "/release-governance", icon: "check" as const, tags: ["release", "governance", "phase 9", "publish", "review", "scientific validation", "gate"] },
    { id: "action-excellence-benchmark", title: "Open excellence benchmark", subtitle: "Action - Phase 10 PhET target command board", path: "/excellence-benchmark", icon: "gauge" as const, tags: ["excellence", "benchmark", "phase 10", "phet", "target", "sprint", "capstone"] },

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
  ...physicsDictionary.map((term) => ({
    id: `dictionary-${term.id}`,
    type: "dictionary" as const,
    title: term.term,
    subtitle: `${term.category} - Visual dictionary`,
    path: `/dictionary?term=${term.id}&q=${encodeURIComponent(term.term)}`,
    icon: term.visual,
    tags: [term.category, ...term.tags, "dictionary", "definition", "visual dictionary"],
    titleText: [term.term, term.category, ...term.tags].join(" "),
    bodyText: [term.definition, term.example, term.formula ?? "", ...term.tags].join(" "),
  })),
  ...astrophysicsConcepts.map((concept) => ({
    id: `astro-${concept.id}`,
    type: "topic" as const,
    title: concept.title,
    subtitle: `${concept.category} - AstroPhysics`,
    path: `/astrophysics?concept=${concept.id}`,
    icon: concept.icon,
    tags: [concept.category, ...concept.keyIdeas, "astrophysics", "astronomy"],
    titleText: [concept.title, concept.category, ...concept.keyIdeas].join(" "),
    bodyText: [concept.summary, concept.explanation, concept.formula ?? ""].join(" "),
  })),
  ...particlePhysicsConcepts.map((concept) => ({
    id: `particle-${concept.id}`,
    type: "topic" as const,
    title: concept.title,
    subtitle: `${concept.category} - Particle Physics`,
    path: `/particle-physics?concept=${concept.id}`,
    icon: "atom" as const,
    tags: [concept.category, ...concept.keyIdeas, "particle physics", "standard model"],
    titleText: [concept.title, concept.category, ...concept.keyIdeas].join(" "),
    bodyText: [concept.summary, concept.explanation, concept.equation ?? "", concept.misconception, concept.classroomPrompt].join(" "),
  })),
  ...atmosphereLayers.map((layer) => ({
    id: `atmosphere-${layer.id}`,
    type: "topic" as const,
    title: layer.name,
    subtitle: `${layer.altitude} - Earth's atmosphere`,
    path: `/atmosphere?layer=${layer.id}`,
    icon: layer.id === "troposphere" ? "rocket" as const : "orbit" as const,
    tags: ["earth atmosphere", "layers", layer.name, ...layer.features, ...layer.examples],
    titleText: [layer.name, layer.altitude, layer.temperature, ...layer.features, ...layer.examples].join(" "),
    bodyText: [layer.summary, layer.science, layer.altitude, layer.temperature].join(" "),
  })),
  ...stringTheoryConcepts.map((concept) => ({
    id: `string-theory-${concept.id}`,
    type: "topic" as const,
    title: concept.title,
    subtitle: `${concept.status} - String Theory Lab`,
    path: `/string-theory?concept=${concept.id}`,
    icon: "wave" as const,
    tags: [concept.status, "string theory", "vibrating strings", "extra dimensions", "quantum gravity"],
    titleText: [concept.title, concept.status].join(" "),
    bodyText: [concept.summary, concept.explanation, concept.interactiveCue].join(" "),
  })),
  ...physicsInnovations.map((item) => ({
    id: `innovation-${item.id}`,
    type: "topic" as const,
    title: item.title,
    subtitle: `${item.year} - ${item.type} - ${item.domain}`,
    path: `/physics-innovations?innovation=${item.id}&q=${encodeURIComponent(item.title)}`,
    icon: item.icon,
    tags: [item.type, item.domain, item.era, ...item.tags, "physics inventions", "discoveries", "innovations"],
    titleText: [item.title, item.type, item.domain, item.era, item.year, item.principle, ...item.tags].join(" "),
    bodyText: [item.summary, item.impact, item.principle].join(" "),
  })),
  ...learningStudioProfiles.map((profile) => ({
    id: `learning-${profile.experimentId}`,
    type: "topic" as const,
    title: `${profile.title} lesson flow`,
    subtitle: `${profile.priority} - Learning Studio`,
    path: `/learning-studio?lesson=${profile.experimentId}`,
    icon: "teacher" as const,
    tags: [profile.category, profile.priority, "learning studio", "lesson", "misconception", "teacher", "phase 3"],
    titleText: [profile.title, profile.category, profile.priority, profile.classLevel].join(" "),
    bodyText: [profile.lessonQuestion, profile.misconception, profile.repairPrompt, profile.successEvidence].join(" "),
  })),
  ...simulationDepthProfiles.map((profile) => ({
    id: `depth-${profile.experimentId}`,
    type: "experiment" as const,
    title: `${profile.title} visual depth`,
    subtitle: `${profile.tier} - Simulation Depth Studio`,
    path: `/simulation-depth?simulation=${profile.experimentId}`,
    icon: "eye" as const,
    tags: [profile.category, profile.tier, "simulation depth", "visual depth", "2d", "3d", "probe", "replay", "phase 4"],
    titleText: [profile.title, profile.category, profile.tier, profile.classLevel].join(" "),
    bodyText: [profile.visualPromise, profile.sceneUpgrade, profile.probeUpgrade, profile.replayUpgrade, profile.accessibilityUpgrade].join(" "),
  })),
  ...classroomDeploymentProfiles.map((profile) => ({
    id: `deployment-${profile.experimentId}`,
    type: "topic" as const,
    title: `${profile.title} classroom deployment`,
    subtitle: `${profile.tier} - Classroom Deployment`,
    path: `/classroom-deployment?assignment=${profile.experimentId}`,
    icon: "teacher" as const,
    tags: [profile.category, profile.tier, "classroom deployment", "teacher", "assignment", "evidence", "rubric", "phase 5"],
    titleText: [profile.title, profile.category, profile.tier, profile.classLevel].join(" "),
    bodyText: [profile.teacherSetup, profile.studentSubmission, profile.rolloutRisk, profile.nextDeploymentAction, ...profile.evidenceRequirements].join(" "),
  })),
  ...accessibilityProfiles.map((profile) => ({
    id: `accessibility-${profile.experimentId}`,
    type: "experiment" as const,
    title: `${profile.title} accessibility`,
    subtitle: `${profile.tier} - Accessibility Center`,
    path: `/accessibility-center?experiment=${profile.experimentId}`,
    icon: "settings" as const,
    tags: [profile.category, profile.tier, "accessibility", "keyboard", "contrast", "reduced motion", "screen reader", "phase 6"],
    titleText: [profile.title, profile.category, profile.tier, profile.classLevel].join(" "),
    bodyText: [profile.inclusiveSummary, profile.keyboardAction, profile.textStateAction, profile.contrastAction, profile.reducedMotionAction, profile.assessmentAction].join(" "),
  })),
  ...masteryRoadmapProfiles.map((profile) => ({
    id: `mastery-roadmap-${profile.topicId}`,
    type: "topic" as const,
    title: `${profile.title} mastery path`,
    subtitle: `${profile.classLabel} - ${profile.tier}`,
    path: `/roadmap?class=${profile.classId}&topic=${profile.topicId}`,
    icon: iconForCategory(profile.domain),
    tags: [profile.classLabel, profile.domain, profile.unitTitle, profile.tier, profile.priority, "roadmap", "mastery", "phase 7"],
    titleText: [profile.title, profile.classLabel, profile.domain, profile.unitTitle, profile.tier, profile.priority].join(" "),
    bodyText: [...profile.outcomes, ...profile.masteryEvidence, ...profile.nextActions, ...profile.practicePrompts, ...profile.labTitles].join(" "),
  })),
  ...insightProfiles.map((profile) => ({
    id: `insights-${profile.experimentId}`,
    type: "experiment" as const,
    title: `${profile.title} intervention insight`,
    subtitle: `${profile.urgency} - ${profile.focus}`,
    path: `/insights-center?experiment=${profile.experimentId}`,
    icon: "chart" as const,
    tags: [profile.category, profile.classLevel, profile.urgency, profile.focus, "insights", "analytics", "phase 8", "intervention"],
    titleText: [profile.title, profile.category, profile.classLevel, profile.urgency, profile.focus].join(" "),
    bodyText: [...profile.evidenceSignals, ...profile.interventionPlan, profile.teacherMove, profile.studentMove, ...profile.affectedTopics].join(" "),
  })),
  ...releaseGovernanceProfiles.map((profile) => ({
    id: `release-governance-${profile.experimentId}`,
    type: "experiment" as const,
    title: `${profile.title} release packet`,
    subtitle: `${profile.gate} - ${profile.reviewTrack}`,
    path: `/release-governance?experiment=${profile.experimentId}`,
    icon: "check" as const,
    tags: [profile.category, profile.classLevel, profile.gate, profile.reviewTrack, "release", "governance", "phase 9", "publish", "review"],
    titleText: [profile.title, profile.category, profile.classLevel, profile.gate, profile.reviewTrack].join(" "),
    bodyText: [profile.publishSummary, ...profile.releaseRisks, ...profile.reviewerNotes, ...profile.releaseChecklist.map((item) => `${item.label} ${item.status} ${item.detail}`)].join(" "),
  })),
  ...excellenceBenchmarkPillars.map((pillar) => ({
    id: `excellence-pillar-${pillar.id}`,
    type: "topic" as const,
    title: `${pillar.pillar} excellence target`,
    subtitle: `${pillar.status} - ${pillar.current}% / ${pillar.target}%`,
    path: "/excellence-benchmark",
    icon: "gauge" as const,
    tags: [pillar.pillar, pillar.status, "excellence", "benchmark", "phase 10", "phet target"],
    titleText: [pillar.pillar, pillar.status, pillar.current, pillar.target].join(" "),
    bodyText: [pillar.evidence, pillar.action].join(" "),
  })),
  ...excellenceSprintItems.map((item) => ({
    id: `excellence-sprint-${item.id}`,
    type: "experiment" as const,
    title: `${item.title} excellence sprint`,
    subtitle: `${item.pillar} - final sprint`,
    path: item.path,
    icon: "step" as const,
    tags: [item.category, item.pillar, "excellence", "sprint", "phase 10", "phet target"],
    titleText: [item.title, item.category, item.pillar].join(" "),
    bodyText: [item.reason, item.action].join(" "),
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
    { action: 0, experiment: 0, topic: 0, solver: 0, quiz: 0, formula: 0, dictionary: 0, object: 0 }
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
