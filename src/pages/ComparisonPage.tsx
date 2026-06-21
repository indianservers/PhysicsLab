import { Toolbar } from "../components/Toolbar";
import { PhysicsIcon } from "../lib/icons";

const rankings = [
  { rank: 1, tool: "PhET Interactive Simulations", score: 94, bestFor: "Free, research-backed concept simulations", verdict: "Still the benchmark for focused, classroom-ready interactive physics simulations." },
  { rank: 2, tool: "PhysicsLab 100", score: 86, bestFor: "Integrated simulation, formulas, dictionary, syllabus, solver, quiz, and teacher workflow", verdict: "Broadest all-in-one learning workspace here, strongest when curriculum navigation and local tooling matter." },
  { rank: 3, tool: "Labster", score: 84, bestFor: "Guided virtual laboratory experiences", verdict: "Excellent guided lab pedagogy and polish, but less open-ended for quick physics sandbox work." },
  { rank: 4, tool: "Pivot Interactives", score: 82, bestFor: "Video-based real experiment measurement", verdict: "Very strong for authentic data and measurement practice, especially when students analyze real footage." },
  { rank: 5, tool: "Algodoo", score: 76, bestFor: "Creative 2D physics sandboxing", verdict: "Fast and playful for mechanics prototyping, but less structured as a complete teaching platform." },
  { rank: 6, tool: "VRLab Academy", score: 74, bestFor: "VR and PC virtual labs", verdict: "Good immersive lab direction, with more friction where schools need lightweight web-first access." },
];

const criteria = [
  ["Simulation depth", "PhET and Algodoo lead in interactive simulation feel; PhysicsLab 100 is strongest when simulation is paired with formulas, quizzes, and syllabus context."],
  ["Teaching workflow", "PhysicsLab 100, Labster, and Pivot are strongest because they connect activity, guidance, assessment, and classroom use."],
  ["Open-ended exploration", "Algodoo and PhysicsLab 100 are strongest for building and experimenting rather than only following a preset activity."],
  ["Reference learning", "PhysicsLab 100 now stands out with formula explanations, dictionary terms, visual dictionary cards, solver paths, and AstroPhysics concepts in one place."],
  ["Accessibility and cost", "PhET is the clearest winner for free public access; PhysicsLab 100 has the advantage of local/offline-friendly app structure."],
  ["Authentic lab data", "Pivot Interactives is strongest for measurement from real experiment videos; Labster is strongest for guided virtual lab procedure."],
];

export function ComparisonPage() {
  return (
    <div className="min-h-screen">
      <Toolbar />
      <main id="content" className="desktop-page">
        <section className="page-hero mesh-bg">
          <p className="ui-label">Competitive benchmark</p>
          <h1 className="mt-2 text-3xl font-black text-gradient">Physics Tool Comparison</h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold text-slate-600 dark:text-slate-300">
            Ranking PhysicsLab 100 against leading physics simulation and teaching platforms across simulation depth, teaching flow, reference support, openness, and classroom fit.
          </p>
        </section>

        <section className="mt-4 grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {rankings.map((item) => (
            <article key={item.tool} className="enhanced-card concept-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="ui-label">Rank #{item.rank}</p>
                  <h2 className="mt-1 text-lg font-black text-slate-800 dark:text-slate-100">{item.tool}</h2>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-cyan-400/10 text-lg font-black text-cyan-500">{item.score}</span>
              </div>
              <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">{item.bestFor}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.verdict}</p>
            </article>
          ))}
        </section>

        <section className="panel mt-4 p-4">
          <div className="flex items-center gap-2">
            <PhysicsIcon name="chart" className="h-5 w-5 text-cyan-500" />
            <h2 className="panel-title">Aspect-by-aspect notes</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {criteria.map(([title, text]) => (
              <div key={title} className="rounded-md border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[0.04]">
                <h3 className="text-sm font-black">{title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
