export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  category: "explore" | "quiz" | "lab" | "streak" | "mastery";
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-lab",      name: "Lab Rookie",       description: "Open your first experiment",         icon: "⚗️",  xp: 50,  category: "explore" },
  { id: "first-quiz",     name: "Quiz Starter",      description: "Complete your first quiz round",     icon: "📝", xp: 50,  category: "quiz" },
  { id: "quiz-perfect",   name: "Perfect Score",     description: "Score 12/12 on a quiz round",        icon: "🏆", xp: 200, category: "quiz" },
  { id: "sim-run",        name: "Simulation On",     description: "Run your first physics simulation",  icon: "▶️",  xp: 50,  category: "lab" },
  { id: "five-labs",      name: "Lab Explorer",      description: "Visit 5 different experiments",      icon: "🔭", xp: 100, category: "explore" },
  { id: "ten-labs",       name: "Experiment Master", description: "Visit 10 different experiments",     icon: "🎓", xp: 200, category: "explore" },
  { id: "graph-plot",     name: "Data Scientist",    description: "Plot your first graph",              icon: "📊", xp: 75,  category: "lab" },
  { id: "three-d",        name: "3D Thinker",        description: "Open a 3D experiment view",         icon: "🌐", xp: 75,  category: "explore" },
  { id: "solver-use",     name: "Formula Hunter",    description: "Practice with the Solver Bank",      icon: "🧮", xp: 75,  category: "lab" },
  { id: "quiz-streak-3",  name: "On a Roll",         description: "Answer 3 questions correctly in a row",icon:"🔥", xp: 100, category: "streak" },
  { id: "quantum-visit",  name: "Quantum Curious",   description: "Explore the Quantum Lab",            icon: "⚛️", xp: 100, category: "explore" },
  { id: "save-project",   name: "Lab Saver",         description: "Save your first project",            icon: "💾", xp: 75,  category: "lab" },
  { id: "all-categories", name: "Physics All-Round", description: "Open experiments in 5 categories",  icon: "🌟", xp: 300, category: "mastery" },
  { id: "xp-500",         name: "Rising Star",       description: "Earn 500 XP total",                 icon: "⭐", xp: 0,  category: "mastery" },
  { id: "xp-1000",        name: "Physics Pro",       description: "Earn 1000 XP total",                icon: "💫", xp: 0,  category: "mastery" },
];

const KEY_UNLOCKED = "physicslab-achievements-v1";
const KEY_XP       = "physicslab-xp-v1";
const KEY_VISITED  = "physicslab-visited-experiments-v1";
const KEY_CATS     = "physicslab-visited-categories-v1";

export function getUnlocked(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(KEY_UNLOCKED) ?? "[]")); }
  catch { return new Set(); }
}

export function getTotalXP(): number {
  return Number(localStorage.getItem(KEY_XP) ?? 0);
}

function saveUnlocked(ids: Set<string>) {
  localStorage.setItem(KEY_UNLOCKED, JSON.stringify([...ids]));
}

function addXP(amount: number) {
  const next = getTotalXP() + amount;
  localStorage.setItem(KEY_XP, String(next));
  return next;
}

type UnlockCallback = (achievement: Achievement, totalXp: number) => void;

let _cb: UnlockCallback | null = null;
export function setAchievementCallback(cb: UnlockCallback) { _cb = cb; }

function tryUnlock(id: string) {
  const unlocked = getUnlocked();
  if (unlocked.has(id)) return;
  const achievement = ACHIEVEMENTS.find((a) => a.id === id);
  if (!achievement) return;
  unlocked.add(id);
  saveUnlocked(unlocked);
  const totalXp = addXP(achievement.xp);
  _cb?.(achievement, totalXp);

  // Check XP milestones
  if (totalXp >= 500) tryUnlock("xp-500");
  if (totalXp >= 1000) tryUnlock("xp-1000");
}

export function trackExperimentVisit(experimentId: string, category: string) {
  const visited = new Set<string>(JSON.parse(localStorage.getItem(KEY_VISITED) ?? "[]"));
  const cats    = new Set<string>(JSON.parse(localStorage.getItem(KEY_CATS)    ?? "[]"));
  visited.add(experimentId);
  cats.add(category);
  localStorage.setItem(KEY_VISITED, JSON.stringify([...visited]));
  localStorage.setItem(KEY_CATS,    JSON.stringify([...cats]));

  if (visited.size >= 1)  tryUnlock("first-lab");
  if (visited.size >= 5)  tryUnlock("five-labs");
  if (visited.size >= 10) tryUnlock("ten-labs");
  if (cats.size >= 5)     tryUnlock("all-categories");
}

export function trackQuizComplete(score: number, total: number) {
  tryUnlock("first-quiz");
  if (score === total && total >= 12) tryUnlock("quiz-perfect");
}

export function trackQuizStreak(streak: number) {
  if (streak >= 3) tryUnlock("quiz-streak-3");
}

export function trackSimRun() { tryUnlock("sim-run"); }
export function trackGraphPlot() { tryUnlock("graph-plot"); }
export function trackThreeD() { tryUnlock("three-d"); }
export function trackSolverUse() { tryUnlock("solver-use"); }
export function trackSaveProject() { tryUnlock("save-project"); }
export function trackQuantumVisit() { tryUnlock("quantum-visit"); }
