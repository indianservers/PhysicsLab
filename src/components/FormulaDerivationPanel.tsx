import { ExperimentDefinition } from "../types";
import { LearningLevel, learningLevelProfiles } from "../lib/learningLevels";
import { renderFormula } from "../lib/formulas";
import { PhysicsIcon } from "../lib/icons";

interface Derivation {
  id: string;
  title: string;
  expression: string;
  simple: string[];
  mathematical: string[];
  visual: string[];
  keywords: string[];
}

const derivations: Derivation[] = [
  d("velocity-acceleration", "v = u + at", "v = u + at", ["Acceleration tells how quickly velocity changes.", "Start with initial velocity u and add the change."], ["a = (v-u)/t", "at = v-u", "v = u + at"], ["On a velocity-time graph, acceleration is the slope.", "The final velocity is the starting value plus slope times time."], ["velocity", "acceleration", "free fall", "motion"]),
  d("displacement-constant-a", "s = ut + 1/2at^2", "s = ut + \\frac{1}{2}at^2", ["Displacement equals area under the velocity-time graph.", "The rectangle is ut and the triangle is half at times t."], ["s = area under v-t graph", "s = ut + 1/2(v-u)t", "v-u = at", "s = ut + 1/2at^2"], ["Rectangle area gives uniform-motion part.", "Triangle area gives extra distance from acceleration."], ["displacement", "free fall", "projectile"]),
  d("newton-2", "F = ma", "F = ma", ["Net force changes motion.", "More force gives more acceleration; more mass gives less acceleration."], ["a proportional F", "a proportional 1/m", "F = ma"], ["Push the same cart harder: it accelerates more.", "Use a heavier cart: it accelerates less."], ["force", "newton", "dynamics"]),
  d("work", "Work = Force x Displacement", "W = Fs", ["Work is energy transferred by force through distance."], ["W = \\vec F \\cdot \\vec s", "If force is parallel to displacement, W = Fs"], ["Area under force-displacement graph is work."], ["work", "power", "energy"]),
  d("ke", "KE = 1/2mv^2", "K = \\frac{1}{2}mv^2", ["Kinetic energy is energy of motion.", "Speed matters strongly because it is squared."], ["W = Fs", "F = ma", "v^2-u^2 = 2as", "For u=0, W = 1/2mv^2"], ["Area under force-distance graph becomes motion energy."], ["kinetic", "energy"]),
  d("pe", "PE = mgh", "U = mgh", ["Lifting a mass stores gravitational energy."], ["W = Fs", "F = mg", "s = h", "U = mgh"], ["Higher height means more area under weight-height graph."], ["potential", "height", "gravity"]),
  d("pendulum", "T = 2pi sqrt(L/g)", "T = 2\\pi\\sqrt{\\frac{L}{g}}", ["A longer pendulum takes more time.", "Mass does not matter in the ideal small-angle model."], ["For small angles, restoring acceleration is proportional to displacement.", "omega = sqrt(g/L)", "T = 2pi/omega"], ["A longer arc gives a slower swing cycle."], ["pendulum", "oscillation"]),
  d("hooke", "Hooke's Law", "F = -kx", ["A spring pulls back proportional to stretch."], ["Restoring force proportional extension", "F = -kx"], ["Stretch twice as far; restoring force doubles."], ["spring", "hooke"]),
  d("ohm", "Ohm's Law", "V = IR", ["Voltage pushes charge, resistance opposes flow."], ["I proportional V", "I inversely proportional R", "V = IR"], ["The V-I graph slope is resistance."], ["ohm", "current", "electric"]),
  d("lens", "Lens Formula", "\\frac{1}{f}=\\frac{1}{v}-\\frac{1}{u}", ["Object distance, image distance, and focal length are linked by similar triangles."], ["Use paraxial ray geometry", "Apply Cartesian sign convention", "1/f = 1/v - 1/u"], ["Principal rays meet at the image point."], ["lens", "optics"]),
  d("mirror", "Mirror Formula", "\\frac{1}{f}=\\frac{1}{v}+\\frac{1}{u}", ["Mirror focus connects object and image distances."], ["Use ray geometry and sign convention", "1/f = 1/v + 1/u"], ["Parallel rays reflect through focus."], ["mirror", "optics"]),
  d("snell", "Snell's Law", "n_1\\sin i = n_2\\sin r", ["Light bends because speed changes in a new medium."], ["Wavefront speed changes at boundary", "sin ratio gives refractive-index relation"], ["Measure angles from the normal, not the surface."], ["snell", "refraction"]),
  d("gas", "PV = nRT", "PV = nRT", ["Gas pressure depends on amount, temperature, and volume."], ["Ideal gas particles exchange momentum with walls", "P proportional nT/V", "PV = nRT"], ["Compress a gas: same particles hit walls more often."], ["gas", "thermo"]),
  d("wave", "lambda = v/f", "\\lambda = \\frac{v}{f}", ["Wavelength is speed divided by how many cycles pass each second."], ["v = f lambda", "lambda = v/f"], ["Higher frequency packs wave crests closer together if speed is fixed."], ["wave", "sound", "frequency"]),
  d("photoelectric", "Photoelectric Equation", "K_{max}=hf-\\phi", ["A photon must first pay the work function; leftover energy becomes electron kinetic energy."], ["Energy conservation: hf = phi + Kmax", "Kmax = hf - phi"], ["Below threshold, no electrons escape no matter how bright the light is."], ["photoelectric", "modern"]),
  d("half-life", "Half-life equation", "N=N_0\\left(\\frac{1}{2}\\right)^{t/T}", ["Each half-life halves the remaining sample."], ["After n half-lives, N=N0(1/2)^n", "n=t/T", "N=N0(1/2)^(t/T)"], ["Repeated halving creates an exponential decay curve."], ["half-life", "nuclear", "decay"]),
];

export function FormulaDerivationPanel({ experiment, level }: { experiment: ExperimentDefinition; level: LearningLevel }) {
  const profile = learningLevelProfiles[level];
  const selected = selectDerivations(experiment).slice(0, profile.formulaComplexity <= 2 ? 1 : 3);
  return (
    <section className="phase4-panel">
      <div className="phase4-panel-head">
        <div>
          <p className="ui-label">Formula derivation</p>
          <h2>From intuition to equation</h2>
        </div>
        <span className="status-chip">{level}</span>
      </div>
      <div className="grid gap-3">
        {selected.map((item) => (
          <article key={item.id} className="phase4-derivation">
            <div className="phase4-card-title"><PhysicsIcon name="calculator" className="h-4 w-4" />{item.title}</div>
            <div className="phase4-equation" dangerouslySetInnerHTML={{ __html: renderFormula(item.expression) }} />
            <DerivationList title="Simple explanation" items={item.simple} />
            {profile.formulaComplexity >= 3 && <DerivationList title="Mathematical explanation" items={item.mathematical} ordered />}
            {profile.formulaComplexity >= 4 && <DerivationList title="Visual explanation" items={item.visual} />}
          </article>
        ))}
      </div>
    </section>
  );
}

function d(id: string, title: string, expression: string, simple: string[], mathematical: string[], visual: string[], keywords: string[]): Derivation {
  return { id, title, expression, simple, mathematical, visual, keywords };
}

function selectDerivations(experiment: ExperimentDefinition) {
  const text = `${experiment.id} ${experiment.title} ${experiment.category} ${experiment.formulae.map((f) => `${f.name} ${f.expression}`).join(" ")}`.toLowerCase();
  const matches = derivations.filter((item) => item.keywords.some((keyword) => text.includes(keyword)));
  return matches.length ? matches : derivations.slice(0, 2);
}

function DerivationList({ title, items, ordered = false }: { title: string; items: string[]; ordered?: boolean }) {
  const List = ordered ? "ol" : "ul";
  return (
    <div className="mt-3">
      <div className="ui-label">{title}</div>
      <List className={ordered ? "mt-2 list-decimal space-y-1 pl-5 text-sm" : "mt-2 list-disc space-y-1 pl-5 text-sm"}>
        {items.map((item) => <li key={item}>{item}</li>)}
      </List>
    </div>
  );
}
