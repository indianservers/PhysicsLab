import { useMemo, useRef } from "react";
import { ExperimentDefinition } from "../types";
import { iconForExperiment, PhysicsIcon, PhysicsIconName } from "../lib/icons";
import { FullscreenButton } from "./FullscreenButton";

export interface AnimationMoment {
  id: string;
  label: string;
  time: number;
  icon: PhysicsIconName;
  explanation: string;
  watch: string;
}

interface AnimationExplanationTimelineProps {
  experiment: ExperimentDefinition;
  activeMomentId: string | null;
  onMomentChange: (moment: AnimationMoment | null) => void;
}

export function AnimationExplanationTimeline({ experiment, activeMomentId, onMomentChange }: AnimationExplanationTimelineProps) {
  const panelRef = useRef<HTMLDetailsElement>(null);
  const moments = useMemo(() => animationMomentsForExperiment(experiment), [experiment]);
  const activeMoment = moments.find((moment) => moment.id === activeMomentId) ?? null;

  return (
    <details ref={panelRef} className="animation-timeline-panel fullscreen-target" aria-label={`${experiment.title} animation explanation timeline`} open>
      <summary className="animation-timeline-summary">
        <div className="flex min-w-0 items-start gap-3">
          <span className="animation-timeline-icon">
            <PhysicsIcon name={iconForExperiment(experiment)} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="ui-label">Animation explanation timeline</p>
            <h2 className="text-lg font-black">Pause at key physics moments</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Tap a checkpoint to freeze the SVG and 3D animation at the idea students should notice.
            </p>
          </div>
        </div>
        <span className="flex flex-wrap gap-2">
          <FullscreenButton targetRef={panelRef} compact />
          <button className={activeMoment ? "tool-btn" : "tool-btn tool-btn-primary"} type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onMomentChange(null); }}>
            <PhysicsIcon name="play" className="h-4 w-4" />
            Live animation
          </button>
        </span>
      </summary>

      <div className="animation-timeline-body">
        <div className="animation-timeline-track mt-4">
          {moments.map((moment, index) => {
            const active = moment.id === activeMomentId;
            return (
              <button
                key={moment.id}
                className={active ? "animation-moment animation-moment-active" : "animation-moment"}
                type="button"
                onClick={() => onMomentChange(moment)}
                title={`Pause at ${moment.label}`}
              >
                <span className="animation-moment-dot">
                  <PhysicsIcon name={moment.icon} className="h-4 w-4" />
                </span>
                <span className="animation-moment-copy">
                  <span className="animation-moment-index">Moment {index + 1}</span>
                  <strong>{moment.label}</strong>
                </span>
              </button>
            );
          })}
        </div>

        <div className="animation-moment-explainer mt-4">
          <div className="flex items-start gap-3">
            <span className={activeMoment ? "animation-pause-badge" : "animation-live-badge"}>
              <PhysicsIcon name={activeMoment ? "step" : "play"} className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-black">{activeMoment ? activeMoment.label : "Live animation running"}</div>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {activeMoment ? activeMoment.explanation : "The animation loops normally. Choose a moment when you want to explain a cause, law, graph feature, or final observation without the motion moving away."}
              </p>
              {activeMoment && (
                <div className="mt-2 rounded-md border border-cyan-400/25 bg-cyan-400/10 p-2 text-xs font-bold text-cyan-700 dark:text-cyan-100">
                  Watch: {activeMoment.watch}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </details>
  );
}

export function animationMomentsForExperiment(experiment: ExperimentDefinition): AnimationMoment[] {
  const id = experiment.id.toLowerCase();
  const category = experiment.category.toLowerCase();
  if (id.includes("projectile")) {
    return [
      moment("launch", "Launch vector", 0.15, "rocket", "Resolve the launch velocity into horizontal and vertical parts before the motion begins.", "the arrow direction and the first x/y velocity split"),
      moment("rise", "Rising motion", 1.15, "chart", "Horizontal velocity stays steady while vertical velocity is reduced by gravity.", "x spacing stays even while y spacing shrinks"),
      moment("peak", "Top of path", 2.15, "gauge", "At the highest point, vertical velocity is momentarily zero, but horizontal velocity remains.", "the peak marker and the flat tangent"),
      moment("range", "Landing range", 3.05, "ruler", "The total range comes from the whole flight time and the horizontal component.", "where the shadow meets the ground line"),
    ];
  }
  if (id.includes("ohm") || id.includes("circuit") || id.includes("current") || id.includes("resistance") || id.includes("power") || category.includes("electric")) {
    return [
      moment("source", "Potential difference", 0.2, "battery", "The cell creates the energy difference that pushes charge around the circuit.", "the battery side before charge motion speeds up"),
      moment("flow", "Current flow", 1.4, "field", "Current is the rate of charge flow; more voltage or less resistance increases that rate.", "carrier spacing and motion around the loop"),
      moment("load", "Resistor response", 2.7, "flame", "The resistor converts electrical energy into heat or light, depending on the experiment.", "glow or heating near the load"),
      moment("law", "Formula check", 4.0, "calculator", "Connect the visual result to the model: V = IR, P = VI, or the displayed circuit relation.", "which quantity changed and which output followed"),
    ];
  }
  if (id.includes("wave") || id.includes("sound") || id.includes("slit") || id.includes("interference") || category.includes("wave")) {
    return [
      moment("source", "Source oscillates", 0.2, "wave", "The source vibration starts the disturbance; frequency decides how often crests or compressions are produced.", "the repeating motion at the source"),
      moment("wavelength", "Wavelength spacing", 1.45, "ruler", "Wavelength is the distance between matching points, such as crest to crest or compression to compression.", "the spacing between two bright bands or wave peaks"),
      moment("interaction", "Overlap or travel", 2.8, "field", "When waves meet, they superpose; when sound travels, particles oscillate while energy moves forward.", "bright/dark bands, nodes, or compression zones"),
      moment("measurement", "Read the pattern", 4.1, "chart", "Use v = fλ or the fringe relation only after identifying the measured spacing.", "the final spacing, speed, or intensity pattern"),
    ];
  }
  if (id.includes("lens") || id.includes("mirror") || id.includes("prism") || id.includes("refraction") || id.includes("eye") || category.includes("optic")) {
    return [
      moment("incident", "Incident ray", 0.2, "prism", "Start from the incoming ray and the normal; this fixes the angle you should measure.", "where the ray first meets the surface"),
      moment("bend", "Interaction at surface", 1.5, "field", "Reflection, refraction, or dispersion happens at the boundary because speed or direction changes.", "the bend, reflection, or color split"),
      moment("image", "Image or focus", 2.9, "eye", "Rays that actually meet form a real image; rays that only appear to meet form a virtual image.", "the focal point, screen, or retina"),
      moment("rule", "Law and sign", 4.2, "calculator", "Now apply the correct law: i = r, Snell's law, lens formula, or mirror formula.", "the sign convention and measured distances"),
    ];
  }
  if (id.includes("heat") || id.includes("thermal") || id.includes("calorimetry") || id.includes("gas") || category.includes("thermo")) {
    return [
      moment("start", "Initial states", 0.2, "thermometer", "Compare the starting temperatures, volume, or pressure before energy transfer begins.", "which body or gas starts hotter or more compressed"),
      moment("transfer", "Energy transfer", 1.5, "flame", "Thermal energy moves because of a temperature difference, work done, or collisions.", "particles speeding up, heat packets, or wall collisions"),
      moment("balance", "Equilibrium trend", 2.9, "gauge", "The system moves toward a balanced final state: equal temperature or a new pressure-volume relation.", "the slowing change near the end"),
      moment("model", "Equation reading", 4.2, "calculator", "Use Q = mc DeltaT, PV = nRT, or the displayed model with consistent units.", "the final reading and unit conversion"),
    ];
  }
  if (id.includes("magnet") || id.includes("emi") || id.includes("generator") || id.includes("transformer") || category.includes("magnet")) {
    return [
      moment("field", "Field forms", 0.2, "magnet", "Current or a magnet creates a field pattern before any induced effect is read.", "field loops and direction markers"),
      moment("change", "Change in flux", 1.55, "field", "Induction needs changing magnetic flux, not just a static magnetic field.", "motion through the coil or changing AC field"),
      moment("response", "Circuit responds", 2.9, "battery", "The induced emf or magnetic force appears as a current, meter kick, or output voltage.", "the meter, coil, or output indicator"),
      moment("law", "Rule/law check", 4.25, "calculator", "Connect direction and size to Faraday's law, transformer ratio, generator emf, or the motor rule.", "direction, turns ratio, and changing field speed"),
    ];
  }
  if (id.includes("force") || id.includes("newton") || id.includes("friction") || id.includes("incline") || id.includes("motion") || id.includes("work") || id.includes("energy") || category.includes("mechanic")) {
    return [
      moment("setup", "Initial condition", 0.2, "ruler", "Identify the body, mass, surface, direction, and starting speed before applying a law.", "the starting position and vector labels"),
      moment("interaction", "Forces act", 1.5, "gauge", "Forces combine into a net force; balanced forces keep motion unchanged, unbalanced forces change velocity.", "which vector is larger and where the net arrow points"),
      moment("change", "Motion changes", 2.9, "chart", "Acceleration, energy conversion, or momentum transfer becomes visible after the interaction.", "speed change, height change, or graph slope"),
      moment("result", "Measured result", 4.2, "calculator", "Use the final reading to connect the animation to the equation and observation table.", "the output card and graph pattern"),
    ];
  }
  return [
    moment("observe", "Observe setup", 0.2, "eye", `Start by naming the key object and variable in ${experiment.title}.`, "the object, field, ray, or particle that changes first"),
    moment("cause", "Cause begins", 1.5, "spark", "Pause where the main cause appears: force, energy transfer, field, wave, or ray interaction.", "the first visible change"),
    moment("effect", "Effect develops", 2.9, "chart", "The output grows, bends, oscillates, heats, or shifts because of the physical model.", "the pattern that repeats or grows"),
    moment("conclusion", "Conclusion point", 4.2, "check", "Compare the frozen visual to the formula, graph, and expected result.", "the final measured value"),
  ];
}

function moment(id: string, label: string, time: number, icon: PhysicsIconName, explanation: string, watch: string): AnimationMoment {
  return { id, label, time, icon, explanation, watch };
}
