import { ExperimentDefinition } from "../types";
import { allCurriculumTopics, domainSlugs, slugify } from "./curriculum";
import { experiments } from "./experiments";

export type ConceptDepth = "foundation" | "board" | "advanced" | "research";

export interface ConceptCard {
  id: string;
  title: string;
  domain: string;
  classLabel: string;
  grade: number;
  unitTitle: string;
  summary: string;
  outcomes: string[];
  tools: string[];
  experimentIds: string[];
  topicPath: string;
  depth: ConceptDepth;
  essentials: string[];
  misconception: string;
  practicePrompt: string;
}

export interface ConceptJourneyStep {
  id: string;
  label: string;
  detail: string;
  target?: string;
}

export function buildConceptCards(): ConceptCard[] {
  return allCurriculumTopics().map((topic) => {
    const mappedExperiments = topic.experimentIds.map((id) => experiments.find((experiment) => experiment.id === id)).filter(Boolean) as ExperimentDefinition[];
    return {
      id: topic.id,
      title: topic.title,
      domain: topic.domain,
      classLabel: topic.classLabel,
      grade: topic.grade,
      unitTitle: topic.unitTitle,
      summary: makeSummary(topic.title, topic.domain, topic.outcomes, mappedExperiments),
      outcomes: topic.outcomes,
      tools: topic.tools,
      experimentIds: topic.experimentIds,
      topicPath: `/topics/${domainSlugs[topic.domain] ?? slugify(topic.domain)}`,
      depth: depthForGrade(topic.grade),
      essentials: makeEssentials(topic.domain, topic.title),
      misconception: mappedExperiments[0]?.commonMistakes[0] ?? misconceptionForDomain(topic.domain),
      practicePrompt: makePracticePrompt(topic.title, topic.domain, mappedExperiments),
    };
  });
}

export function findConceptById(id: string) {
  return buildConceptCards().find((concept) => concept.id === id);
}

export function conceptJourney(concept: ConceptCard): ConceptJourneyStep[] {
  const firstExperiment = concept.experimentIds[0];
  return [
    {
      id: "anchor",
      label: "Concept",
      detail: `Read the core idea and identify the input, output, and fixed quantity in ${concept.title}.`,
      target: concept.topicPath,
    },
    {
      id: "visual",
      label: "2D Visual",
      detail: "Use the guided visualization to see the cause-effect pattern before using numbers.",
      target: firstExperiment ? `/experiments/${firstExperiment}` : "/lab",
    },
    {
      id: "model",
      label: "3D Model",
      detail: "Rotate or inspect the 3D model so the physical setup is spatially clear.",
      target: firstExperiment ? `/experiments/${firstExperiment}#three-d` : "/lab",
    },
    {
      id: "practice",
      label: "Practice",
      detail: concept.practicePrompt,
      target: `/quiz?focus=${encodeURIComponent(concept.essentials[0] ?? concept.title)}`,
    },
    {
      id: "mastery",
      label: "Mastery",
      detail: "Explain the idea, calculate one example, graph the trend, and name one real use.",
      target: firstExperiment ? `/experiments/${firstExperiment}#notebook` : "/projects",
    },
  ];
}

export function conceptLibraryStats(cards = buildConceptCards()) {
  return {
    concepts: cards.length,
    interactive: cards.filter((card) => card.experimentIds.length > 0).length,
    domains: new Set(cards.map((card) => card.domain)).size,
    advanced: cards.filter((card) => card.depth === "advanced" || card.depth === "research").length,
  };
}

function depthForGrade(grade: number): ConceptDepth {
  if (grade <= 8) return "foundation";
  if (grade <= 12) return "board";
  if (grade <= 14) return "advanced";
  return "research";
}

function makeSummary(title: string, domain: string, outcomes: string[], mappedExperiments: ExperimentDefinition[]) {
  const action = outcomes[0] ?? `Build the main ${domain.toLowerCase()} relationship.`;
  const lab = mappedExperiments[0] ? ` Try it in ${mappedExperiments[0].title}.` : " A lab will be added in the interactive build phase.";
  return `${action}${lab}`;
}

function makeEssentials(domain: string, title: string) {
  const shared = ["One changing variable", "Clear units", "Graph the pattern"];
  if (domain.includes("Optics")) return ["Ray direction", "Normal line", "Image position"];
  if (domain.includes("Electric")) return ["Voltage", "Current", "Resistance or field"];
  if (domain.includes("Magnet")) return ["Field direction", "Current direction", "Force direction"];
  if (domain.includes("Wave")) return ["Amplitude", "Frequency", "Wavelength"];
  if (domain.includes("Thermo")) return ["Temperature", "Heat flow", "Material property"];
  if (domain.includes("Fluid")) return ["Pressure", "Density", "Depth or area"];
  if (domain.includes("Modern")) return ["Energy packet", "Transition", "Probability"];
  if (title.includes("Motion") || domain.includes("Mechanics")) return ["Position", "Velocity", "Force or energy"];
  return shared;
}

function misconceptionForDomain(domain: string) {
  if (domain.includes("Optics")) return "Measuring ray angles from the surface instead of the normal.";
  if (domain.includes("Electric")) return "Treating voltage, current, and energy as the same quantity.";
  if (domain.includes("Wave")) return "Mixing up amplitude, frequency, and speed.";
  if (domain.includes("Thermo")) return "Calling heat and temperature the same thing.";
  if (domain.includes("Fluid")) return "Confusing force with pressure.";
  return "Changing multiple variables at once and then trusting the pattern.";
}

function makePracticePrompt(title: string, domain: string, mappedExperiments: ExperimentDefinition[]) {
  const lab = mappedExperiments[0]?.title ?? title;
  return `Predict one trend in ${lab}, then verify it with a slider or quiz question from ${domain}.`;
}
