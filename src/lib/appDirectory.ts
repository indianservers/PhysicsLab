import { clientDemos } from "./clientDemos";
import { buildConceptCards } from "./concepts";
import { experiments } from "./experiments";
import { allPhysicsModules } from "./physicsModules";
import type { PhysicsIconName } from "./icons";
import { conceptExperiences } from "./conceptExperiences";

export type DirectorySection = "Modules" | "Concepts" | "Experiments" | "Pro Lab" | "Client Demos" | "Teaching" | "Platform";
export interface DirectoryEntry { id: string; title: string; description: string; path: string; section: DirectorySection; group: string; icon: PhysicsIconName; keywords: string[]; badge?: string; }

const platform: Array<Omit<DirectoryEntry, "section">> = [
  ["home","Home","Product home and launch point.","/","Core","atom"], ["syllabus","Syllabus","Curriculum structure and topic coverage.","/syllabus","Learning","book"],
  ["formulas","Formula Bank","Searchable equations and variables.","/formulas","Reference","book"], ["revision","Formula Revision Grid","Categorized revision cards.","/formulas/revision-grid","Reference","calculator"],
  ["dictionary","Visual Dictionary","Searchable physics definitions.","/dictionary","Reference","clipboard"], ["solver","Solver Bank","Unit-aware worked problems.","/solver","Practice","calculator"],
  ["quiz","Quiz","Conceptual and numerical assessment.","/quiz?view=practice","Practice","check"], ["graphs","Graph Studio","Interactive physics plots.","/graphs","Analysis","chart"],
  ["video","Video Analysis","Calibrated motion tracking.","/video","Analysis","eye"], ["knowledge","Knowledge Graph","Connected concepts, labs, and formulas.","/graph","Learning","orbit"],
  ["scale","Scale of Universe","Powers-of-ten visual explorer.","/physics/scale-of-universe","Immersive","ruler"], ["innovation","Physics Innovations","Discoveries and invention timeline.","/physics-innovations","Immersive","spark"],
  ["atmosphere","Earth Atmosphere","Interactive atmospheric layers.","/atmosphere","Immersive","orbit"], ["astrophysics","AstroPhysics","Black holes, galaxies, and cosmology.","/astrophysics","Immersive","orbit"],
  ["particle","Particle Physics","Standard Model and particle concepts.","/particle-physics","Immersive","atom"], ["string","String Theory","3D theoretical-physics concepts.","/string-theory","Immersive","wave"],
  ["quantum","Quantum Lab","Interactive modern-physics laboratory.","/quantum","Immersive","atom"], ["sandbox","Open Sandbox","Free-form physics workspace.","/sandbox","Laboratory","spark"],
  ["guided","Guided Lab","Structured physics workspace.","/lab","Laboratory","compass"], ["projects","Projects","Saved learner work.","/projects","Workspace","folder"],
  ["comparison","Platform Comparison","Product benchmark and positioning.","/comparison?view=benchmark","Governance","chart"], ["settings","Settings","Application preferences.","/settings","Workspace","settings"],
  ["backup","Backup & Restore","Local project backup tools.","/backup","Workspace","download"], ["help","Help Center","Usage guidance and shortcuts.","/help","Support","book"],
  ["privacy","Privacy","Privacy information.","/privacy","Support","clipboard"], ["terms","Terms","Terms of use.","/terms","Support","clipboard"],
].map(([id,title,description,path,group,icon]) => ({ id, title, description, path, group, icon: icon as PhysicsIconName, keywords: [title, description, group] }));

const teaching: Array<Omit<DirectoryEntry, "section">> = [
  ["teacher","Teacher Workspace","Assignments, evidence, and snapshots.","/teacher","Teaching","teacher"], ["lms","LMS Configuration","Learning-platform integration settings.","/lms-config","Teaching","settings"],
  ["studio","Learning Studio","Guided lesson and misconception design.","/learning-studio","Learning Design","teacher"], ["roadmap","Mastery Roadmap","Adaptive class-wise learning paths.","/roadmap","Learning Design","compass"],
  ["deployment","Classroom Deployment","Assignment rollout and evidence.","/classroom-deployment","Operations","upload"], ["insights","Insights Center","Readiness and intervention analytics.","/insights-center","Operations","chart"],
  ["quality","Quality Audit","Simulation-quality baseline.","/quality-audit","Trust & Quality","chart"], ["accuracy","Accuracy Center","Validated benchmark evidence.","/accuracy-center","Trust & Quality","check"],
  ["depth","Simulation Depth","Visualization and interaction depth.","/simulation-depth","Trust & Quality","eye"], ["accessibility","Accessibility Center","Inclusive experience audit.","/accessibility-center","Trust & Quality","settings"],
  ["release","Release Governance","Scientific review and publishing gate.","/release-governance","Trust & Quality","check"], ["excellence","Excellence Benchmark","Product quality command board.","/excellence-benchmark","Trust & Quality","gauge"],
  ["trust","Scientific Trust","Sources, assumptions, and model status.","/trust","Trust & Quality","check"],
].map(([id,title,description,path,group,icon]) => ({ id, title, description, path, group, icon: icon as PhysicsIconName, keywords: [title, description, group] }));

export const appDirectoryEntries: DirectoryEntry[] = [
  ...allPhysicsModules.map((module) => ({ id: `module-${module.id}`, title: module.title, description: module.description, path: module.path, section: "Modules" as const, group: module.groupTitle, icon: module.icon, keywords: module.keywords, badge: "MODULE" })),
  ...buildConceptCards().map((concept) => ({ id: `concept-${concept.id}`, title: concept.title, description: concept.summary, path: `/concepts?concept=${concept.id}`, section: "Concepts" as const, group: concept.domain, icon: "spark" as const, keywords: [concept.classLabel, concept.unitTitle, ...concept.outcomes, ...concept.essentials], badge: concept.classLabel })),
  ...conceptExperiences.map((concept) => ({ id: `live-concept-${concept.id}`, title: `Live ${concept.title}`, description: concept.summary, path: `/concept-studio/${concept.id}`, section: "Concepts" as const, group: "Interactive Concept Studio", icon: concept.icon, keywords: [concept.principle, concept.formula, ...concept.observe, ...concept.examples.map((item)=>item.title), ...concept.applications.map((item)=>item.title)], badge: "LIVE" })),
  ...experiments.map((experiment) => ({ id: `experiment-${experiment.id}`, title: experiment.title, description: experiment.aim, path: `/experiments/${experiment.id}`, section: "Experiments" as const, group: experiment.category, icon: "flask" as const, keywords: [experiment.difficulty, experiment.classLevel ?? "", experiment.theory], badge: experiment.difficulty })),
  ...[
    ["pro-program","Pro Lab Mission Program","Six professional scientific operations programs.","/pro-lab","Mission Control","rocket"], ["rocket-build","Build & Launch Rocket","Integrate, verify, fuel, and launch a virtual vehicle.","/pro-lab/launch-vehicle","Rocket Program","rocket"],
    ["rocket-parts","Rocket Parts & Systems","Search and inspect 225 launch-vehicle components.","/rocket-lab/parts","Rocket Program","settings"], ["mission-planner","Mission Planner","Configure mission objectives and launch criteria.","/pro-lab/launch-vehicle#mission","Rocket Program","clipboard"],
    ["launch-ascent","Launch & Ascent","Countdown, liftoff, ascent, and mission outcomes.","/pro-lab/launch-vehicle#launch","Rocket Program","rocket"],
  ].map(([id,title,description,path,group,icon]) => ({ id, title, description, path, section: "Pro Lab" as const, group, icon: icon as PhysicsIconName, keywords: [title, description, group], badge: "PRO" })),
  ...clientDemos.map((demo) => ({ id: `demo-${demo.rank}`, title: demo.title, description: demo.pitch, path: demo.path, section: "Client Demos" as const, group: demo.category, icon: demo.icon, keywords: demo.show, badge: `#${demo.rank}` })),
  ...teaching.map((entry) => ({ ...entry, section: "Teaching" as const })), ...platform.map((entry) => ({ ...entry, section: "Platform" as const })),
];

export const directorySections: DirectorySection[] = ["Modules", "Concepts", "Experiments", "Pro Lab", "Client Demos", "Teaching", "Platform"];
export const directoryCounts = Object.fromEntries(directorySections.map((section) => [section, appDirectoryEntries.filter((entry) => entry.section === section).length]));
