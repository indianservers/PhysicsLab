import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { experiments } from "../lib/experiments";
import { ProjectileExperiment } from "../components/ProjectileExperiment";
import { LearningPanel } from "../components/LearningPanel";
import { getAssignmentFromSearch } from "../lib/teacher";
import { GuidedVisualization } from "../components/GuidedVisualization";
import { iconForExperiment, PhysicsIcon } from "../lib/icons";
import { GuidePanel } from "../components/GuidePanel";
import { guideForExperiment } from "../lib/guides";
import { ExperimentLearningCoach } from "../components/ExperimentLearningCoach";
import { CoreLearningToolkit } from "../components/CoreLearningToolkit";
import { Experiment3DAnimation, has3DAnimation } from "../components/Experiment3DAnimation";
import { FormulaGlossaryPanel, PlotSvg, symbolsFromText, UnitConverterPanel } from "../components/LearningTools";
import { AnimationExplanationTimeline, AnimationMoment } from "../components/AnimationExplanationTimeline";
import { FullscreenButton } from "../components/FullscreenButton";
import { makePrismModel, prismMaterials } from "../lib/prism";
import { InteractionModePanel } from "../components/InteractionModePanel";

export function ExperimentDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const experiment = experiments.find((item) => item.id === id) ?? experiments[0];
  const assignment = getAssignmentFromSearch(location.search);
  useEffect(() => {
    if (!location.hash) return undefined;
    const targetId = location.hash.slice(1);
    const timer = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 450);
    return () => window.clearTimeout(timer);
  }, [location.hash, experiment.id]);
  return (
    <div className="experiment-detail-page min-h-screen">
      <Toolbar />
      <div id="content" className="mx-auto max-w-[1600px] px-3 py-3">
        <div className="page-hero mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="card-icon mt-1 h-12 w-12">
              <PhysicsIcon name={iconForExperiment(experiment)} className="h-6 w-6" />
            </span>
            <div>
            <Link to="/experiments" className="text-sm font-bold text-cyan-500">Experiments</Link>
            <h1 className="text-3xl font-black">{experiment.title}</h1>
            {experiment.curriculumTags && (
              <div className="mt-2 flex flex-wrap gap-2">
                {experiment.curriculumTags.classes.map((grade) => <span key={grade} className="status-chip status-chip-cyan">Class {grade}</span>)}
                {experiment.curriculumTags.domains.map((domain) => <span key={domain} className="status-chip">{domain}</span>)}
                <span className="status-chip">{experiment.difficulty}</span>
              </div>
            )}
            </div>
          </div>
          <Link to="/lab" className="hero-btn-secondary inline-flex items-center gap-2"><PhysicsIcon name="flask" className="h-4 w-4" />Open full lab workspace</Link>
        </div>
        <nav className="experiment-jump-strip mb-4 flex gap-2 overflow-x-auto" aria-label="Experiment sections">
          <a className="quick-jump" href="#guide" title="Open the guided learning notes"><PhysicsIcon name="book" className="h-4 w-4" />Guide</a>
          <a className="quick-jump" href="#toolkit" title="Jump to concept tools and quick checks"><PhysicsIcon name="spark" className="h-4 w-4" />Toolkit</a>
          <a className="quick-jump" href="#unit-converter" title="Jump to the unit converter"><PhysicsIcon name="ruler" className="h-4 w-4" />Units</a>
          {has3DAnimation(experiment.id) && <a className="quick-jump" href="#three-d" title="Jump to the 3D interactive view"><PhysicsIcon name="orbit" className="h-4 w-4" />3D</a>}
          <a className="quick-jump" href="#simulation" title="Jump to sliders and calculated outputs"><PhysicsIcon name="calculator" className="h-4 w-4" />Sim</a>
          <a className="quick-jump" href="#coach" title="Jump to guided compare-and-predict coach"><PhysicsIcon name="teacher" className="h-4 w-4" />Coach</a>
          <a className="quick-jump" href="#notebook" title="Jump to observation table"><PhysicsIcon name="clipboard" className="h-4 w-4" />Notebook</a>
        </nav>
        <LabCommandStrip experiment={experiment} />
        <InteractionModePanel experiment={experiment} compact />
        {assignment && <AssignmentBanner assignment={assignment} />}
        {experiment.id === "projectile-motion" ? <ProjectileExperiment experiment={experiment} /> : <GenericExperiment experiment={experiment} />}
        <LearningResourceDock experiment={experiment} />
      </div>
    </div>
  );
}

function LearningResourceDock({ experiment }: { experiment: typeof experiments[number] }) {
  const dockRef = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={dockRef} id="guide" className="desktop-learning-dock fullscreen-target">
      <summary>
        <span className="inline-flex min-w-0 items-center gap-2">
          <PhysicsIcon name="book" className="h-4 w-4 text-cyan-500" />
          <span className="truncate">Learning resources</span>
        </span>
        <span className="lab-summary-actions">
          <FullscreenButton targetRef={dockRef} compact />
          <span className="info-dot" title="Guide, toolkit, revision flow, and deeper teaching notes without taking over the lab screen.">i</span>
        </span>
      </summary>
      <div className="desktop-learning-dock-body">
        <GuidePanel guide={guideForExperiment(experiment)} compact />
        <CoreLearningToolkit experiment={experiment} />
        <LearningPanel experiment={experiment} />
      </div>
    </details>
  );
}

function LabCommandStrip({ experiment }: { experiment: typeof experiments[number] }) {
  const features = [
    { label: "Guide", icon: "book" as const, active: true },
    { label: "Toolkit", icon: "spark" as const, active: true },
    { label: "3D", icon: "orbit" as const, active: has3DAnimation(experiment.id) },
    { label: "Coach", icon: "teacher" as const, active: true },
    { label: "Notebook", icon: "clipboard" as const, active: true },
  ];
  return (
    <div className="lab-command-strip mb-4">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="ui-label">Lab flow</span>
        {features.map((feature) => (
          <a key={feature.label} className={feature.active ? "status-chip status-chip-cyan" : "status-chip opacity-55"} href={feature.label === "3D" ? "#three-d" : feature.label === "Coach" ? "#coach" : feature.label === "Notebook" ? "#notebook" : feature.label === "Toolkit" ? "#toolkit" : "#guide"}>
            <PhysicsIcon name={feature.icon} className="h-3.5 w-3.5" />{feature.label}
          </a>
        ))}
      </div>
      <div className="one-variable-note">
        <PhysicsIcon name="check" className="h-4 w-4 text-cyan-500" />
        <span>Change one variable at a time for the cleanest pattern.</span>
      </div>
    </div>
  );
}

function AssignmentBanner({ assignment }: { assignment: NonNullable<ReturnType<typeof getAssignmentFromSearch>> }) {
  return (
    <section className="panel mb-4 border-cyan-400/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="ui-label">Assigned lab</p>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-black"><PhysicsIcon name="teacher" className="h-5 w-5 text-cyan-500" />{assignment.title}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{assignment.instructions}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {assignment.dueDate && <span className="badge">Due {assignment.dueDate}</span>}
          {assignment.lockVariables && <span className="badge">Variables locked</span>}
          {assignment.requireNotebook && <span className="badge">Notebook required</span>}
          {assignment.requireQuiz && <span className="badge">Quiz required</span>}
        </div>
      </div>
    </section>
  );
}

function GenericExperiment({ experiment }: { experiment: typeof experiments[number] }) {
  const defaultValues = defaultLabValues(experiment.id);
  const [a, setA] = useState(defaultValues[0]);
  const [b, setB] = useState(defaultValues[1]);
  const [c, setC] = useState(defaultValues[2]);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [activeMoment, setActiveMoment] = useState<AnimationMoment | null>(null);
  const [workspaceView, setWorkspaceView] = useState<"visual" | "graphs" | "report" | "coach" | "notes">("visual");
  const results = calculateStarterLab(experiment.id, a, b, c);
  const setters = [setA, setB, setC];
  const setAll = (values: number[]) => {
    setA(values[0] ?? a);
    setB(values[1] ?? b);
    setC(values[2] ?? c);
  };
  return (
    <div id="simulation" className="desktop-lab-workspace">
      <section className="desktop-control-rail panel p-3">
        <WatchCue experiment={experiment} result={results} />
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <InfoTile icon="book" label="Level" value={experiment.classLevel} />
          <InfoTile icon="flask" label="Tools" value={`${experiment.apparatus.length} items`} />
        </div>
        <CollapsibleSection icon="calculator" title="Controls" hint="Change one variable at a time to see the cleanest physics pattern" defaultOpen>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">{results.description}</p>
          <div className="focus-control-strip mt-3">
            <div className="min-w-0">
              <div className="text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-300">Focus</div>
              <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Show one slider for pattern discovery.</div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button className={focusIndex === null ? "focus-pill focus-pill-active" : "focus-pill"} type="button" onClick={() => setFocusIndex(null)}>All</button>
              {results.controls.map((control, index) => (
                <button key={control.label} className={focusIndex === index ? "focus-pill focus-pill-active" : "focus-pill"} type="button" onClick={() => setFocusIndex(index)}>
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            <MiniAction label="Low" icon="ruler" onClick={() => setAll(results.controls.map((control) => control.min))} />
            <MiniAction label="Mid" icon="gauge" onClick={() => setAll(results.controls.map((control) => midpoint(control)))} />
            <MiniAction label="High" icon="spark" onClick={() => setAll(results.controls.map((control) => control.max))} />
          </div>
          {experiment.id === "prism-dispersion" && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {prismMaterials.map((material) => (
                <MiniAction
                  key={material.id}
                  label={material.name}
                  icon="prism"
                  onClick={() => setAll([a, material.meanIndex, material.dispersion])}
                />
              ))}
            </div>
          )}
          <div className="mt-4 grid gap-3">
            {results.controls.map((control, index) => (focusIndex === null || focusIndex === index) && (
              <LabSlider
                key={control.label}
                label={control.label}
                value={index === 0 ? a : index === 1 ? b : c}
                min={control.min}
                max={control.max}
                step={control.step}
                onChange={setters[index]}
              />
            ))}
          </div>
          <ChangeWatchBecause result={results} focusIndex={focusIndex} />
        </CollapsibleSection>
        <div className="mt-3 grid gap-2 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
          {results.outputs.slice(0, 3).map((output) => (
            <div key={output.label} className="result-card" title={explainOutput(output.label)}>
              <div className="text-xs text-slate-500 dark:text-slate-400">{output.label}</div>
              <div className="result-card-value">{output.value}</div>
            </div>
          ))}
        </div>
        <CollapsibleSection icon="ruler" title="Formula" hint="Model used by the calculator">
          <div className="font-mono text-sm">{results.formula}</div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{formulaNote(experiment.id)}</p>
          <FormulaGlossaryPanel compact symbols={symbolsFromText(`${results.formula} ${results.description} ${results.outputs.map((output) => output.label).join(" ")}`)} />
        </CollapsibleSection>
      </section>
      <section className="desktop-stage-panel panel p-3">
        <div className="desktop-stage-header">
          <div className="min-w-0">
            <p className="ui-label">Workbench</p>
            <h2 className="truncate text-xl font-black">{experiment.title}</h2>
          </div>
          <div className="desktop-stage-tabs" aria-label="Lab workspace views">
            {[
              { id: "visual" as const, label: "Visual", icon: "orbit" as const },
              { id: "graphs" as const, label: "Graphs", icon: "chart" as const },
              { id: "report" as const, label: "Report", icon: "printer" as const },
              { id: "coach" as const, label: "Coach", icon: "teacher" as const },
              { id: "notes" as const, label: "Notes", icon: "book" as const },
            ].map((item) => (
              <button key={item.id} className={workspaceView === item.id ? "desktop-stage-tab desktop-stage-tab-active" : "desktop-stage-tab"} type="button" onClick={() => setWorkspaceView(item.id)}>
                <PhysicsIcon name={item.icon} className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="desktop-stage-body">
          {workspaceView === "visual" && (
            <>
              <AnimationExplanationTimeline experiment={experiment} activeMomentId={activeMoment?.id ?? null} onMomentChange={setActiveMoment} />
              <div className="lab-visual-grid">
                <GuidedVisualization experiment={experiment} values={[a, b, c]} outputs={results.outputs} controls={results.controls} />
                {has3DAnimation(experiment.id) && <Experiment3DAnimation experiment={experiment} values={[a, b, c]} outputs={results.outputs} timelineTime={activeMoment?.time ?? null} />}
              </div>
            </>
          )}
          {workspaceView === "graphs" && (
            <LabGraphingWorkspace
              result={results}
              values={[a, b, c]}
              makeTrialOutputs={(values) => calculateStarterLab(experiment.id, values[0], values[1], values[2]).outputs}
              defaultOpen
            />
          )}
          {workspaceView === "report" && <LabReportGenerator experiment={experiment} result={results} values={[a, b, c]} defaultOpen />}
          {workspaceView === "coach" && (
            <div id="coach">
              <CollapsibleSection icon="teacher" title="Guided Coach" hint="Compare low, middle, and high setups before drawing a conclusion" defaultOpen>
                <ExperimentLearningCoach
                  experiment={experiment}
                  controls={results.controls}
                  values={[a, b, c]}
                  outputs={results.outputs}
                  formula={results.formula}
                  onSetValues={setAll}
                  makeTrialOutputs={(values) => calculateStarterLab(experiment.id, values[0], values[1], values[2]).outputs}
                />
              </CollapsibleSection>
            </div>
          )}
          {workspaceView === "notes" && (
            <LabReferenceStack experiment={experiment} values={[a, b, c]} />
          )}
        </div>
      </section>
    </div>
  );
}

function LabReferenceStack({ experiment, values }: { experiment: typeof experiments[number]; values: [number, number, number] }) {
  return (
    <div className="desktop-reference-stack">
      <CollapsibleSection icon="compass" title="Aim" hint="What you are trying to prove or observe" defaultOpen>
        <p className="text-sm text-slate-500 dark:text-slate-300">{experiment.aim}</p>
      </CollapsibleSection>
      <CollapsibleSection icon="clipboard" title="Procedure" hint="Step-by-step method, collapsed to keep the lab compact">
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          {experiment.procedure.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </CollapsibleSection>
      {experiment.id === "prism-dispersion" && <PrismBasicsPanel values={values} />}
      {phaseOneBasics[experiment.id] && <PhaseOneBasicsPanel experimentId={experiment.id} />}
      {phaseTwoThreeBasics[experiment.id] && <PhaseTwoThreeBasicsPanel experimentId={experiment.id} />}
      <CollapsibleSection icon="check" title="Viva Questions" hint="Tap each question to reveal the answer">
        <div className="space-y-2 text-sm">
          {experiment.vivaQuestions.map((question) => (
            <details key={question.prompt} className="mini-disclosure">
              <summary title="Reveal answer">{question.prompt}</summary>
              <p className="mt-1 text-cyan-500">{question.answer}</p>
            </details>
          ))}
        </div>
      </CollapsibleSection>
      <CollapsibleSection id="notebook" icon="ruler" title="Notebook" hint="Observation columns for manual lab record">
        <div className="overflow-x-auto">
          <table className="notebook-table">
            <thead>
              <tr>{experiment.observationColumns.slice(0, 5).map((column) => <th key={column} title={`Record ${column}`}>{column}</th>)}</tr>
            </thead>
            <tbody>
              <tr>{experiment.observationColumns.slice(0, 5).map((column, index) => <td key={column}>{index === 0 ? "Trial 1" : "-"}</td>)}</tr>
            </tbody>
          </table>
        </div>
      </CollapsibleSection>
      <CollapsibleSection icon="check" title="Expected Result" hint="What a correct experiment should show">
        <p className="text-sm text-slate-600 dark:text-slate-300">{experiment.expectedResult}</p>
      </CollapsibleSection>
      <CollapsibleSection id="unit-converter" icon="ruler" title="Unit Converter" hint="Convert values before using formulas">
        <UnitConverterPanel compact />
      </CollapsibleSection>
      <CollapsibleSection icon="spark" title="Common Mistakes" hint="Known traps that cause wrong readings">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          {experiment.commonMistakes.slice(0, 3).map((mistake) => <li key={mistake}>{mistake}</li>)}
        </ul>
      </CollapsibleSection>
      <Link to="/lab" className="hero-btn-secondary mt-4 inline-flex items-center gap-2" title="Open this concept in the full drag-and-drop physics canvas"><PhysicsIcon name="flask" className="h-4 w-4" />Full canvas</Link>
    </div>
  );
}

function WatchCue({ experiment, result }: { experiment: typeof experiments[number]; result: LabResult }) {
  return (
    <div className="watch-cue-card">
      <span className="watch-cue-icon"><PhysicsIcon name={iconForExperiment(experiment)} className="h-5 w-5" /></span>
      <div className="min-w-0">
        <div className="text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-300">What to watch first</div>
        <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Change <strong>{result.controls[0]?.label ?? "the first variable"}</strong> slowly and watch <strong>{result.outputs[0]?.label ?? "the main result"}</strong>.
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{result.description}</p>
      </div>
    </div>
  );
}

function PrismBasicsPanel({ values }: { values: [number, number, number] }) {
  const prism = makePrismModel(values[0], values[1], values[2]);
  const basics = [
    ["Prism", "A transparent triangular block that refracts a ray at two slant faces."],
    ["Refraction", "Light bends because its speed changes when it enters or leaves glass."],
    ["Dispersion", "Different wavelengths have slightly different refractive indices, so colours separate."],
    ["Deviation", "The angle between the original ray direction and the emergent ray direction."],
    ["Minimum deviation", "The symmetric path where the prism gives its least deviation for a colour."],
    ["VIBGYOR order", "Violet bends most; red bends least in normal glass."],
  ];
  return (
    <CollapsibleSection icon="book" title="Prism Basics" hint="Core labels and ideas before using the sliders" defaultOpen>
      <div className="grid gap-2 text-sm">
        {basics.map(([term, detail]) => (
          <div key={term} className="rounded-md border border-slate-300/70 bg-white p-3 dark:border-lab-line dark:bg-slate-950">
            <div className="font-black text-slate-800 dark:text-slate-100">{term}</div>
            <p className="mt-1 text-slate-600 dark:text-slate-300">{detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-md border border-amber-300/40 bg-amber-300/10 p-3 text-sm text-slate-700 dark:text-slate-200">
        <div className="flex items-center gap-2 font-black"><PhysicsIcon name="check" className="h-4 w-4 text-amber-500" />Measurement rule</div>
        <p className="mt-1">Measure incidence, refraction, emergence, and critical angles from the normal, not from the prism surface.</p>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="notebook-table">
          <thead>
            <tr><th>Colour</th><th>Wavelength</th><th>Refractive index</th><th>Deviation</th></tr>
          </thead>
          <tbody>
            {prism.rays.map((ray) => (
              <tr key={ray.name}>
                <td><span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: ray.color }} />{ray.name}</span></td>
                <td>{ray.wavelength} nm</td>
                <td>{ray.refractiveIndex.toFixed(4)}</td>
                <td>{ray.deviationDeg.toFixed(2)} deg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CollapsibleSection>
  );
}

const phaseOneBasics: Record<string, Array<[string, string]>> = {
  "glass-slab-refraction": [
    ["Two refractions", "The ray bends towards the normal on entry and away from the normal on exit."],
    ["Parallel emergent ray", "For a parallel-sided slab, the final ray is parallel to the incident ray."],
    ["Lateral shift", "Thickness and incidence angle decide how far the emergent ray is displaced."],
    ["Measurement trap", "Angles are measured from the normal, never from the surface."],
  ],
  "total-internal-reflection": [
    ["Two conditions", "Light must travel from denser to rarer medium and incidence must exceed the critical angle."],
    ["Critical angle", "At C, the refracted ray grazes the boundary at 90 degrees."],
    ["Beyond critical", "No refracted ray escapes in the ideal model; the ray reflects back inside."],
    ["Common use", "Optical fibres guide light by repeated total internal reflection."],
  ],
  "lens-formula": [
    ["Principal rays", "One ray parallel to the axis bends through focus; one through optical centre is nearly undeviated."],
    ["Real vs virtual", "Object outside focus gives a real image; inside focus gives a virtual enlarged image."],
    ["Magnification sign", "A negative magnification means inverted image in the sign convention."],
    ["Power", "Lens power is reciprocal focal length in metres."],
  ],
  "mirror-formula": [
    ["Pole, focus, centre", "A concave mirror ray diagram needs P, F, and C before signs make sense."],
    ["At focus", "Reflected rays become parallel and the image is ideally at infinity."],
    ["Object at C", "Image forms at C with same size and inverted orientation."],
    ["Sign trap", "Use the chosen Cartesian convention consistently."],
  ],
  "human-eye-defects": [
    ["Retina target", "A clear image forms only when rays focus on the retina."],
    ["Myopia", "Distant rays focus before the retina; a concave lens spreads them slightly."],
    ["Hypermetropia", "Nearby rays would focus behind the retina; a convex lens converges them."],
    ["Correction idea", "The external lens shifts the final focus, not the retina itself."],
  ],
  "optical-instruments": [
    ["Objective", "The objective collects light and forms the first image."],
    ["Eyepiece", "The eyepiece magnifies the intermediate image for the eye."],
    ["Telescope rule", "Angular magnification is approximately fo/fe."],
    ["Design tradeoff", "Short eyepiece focal length increases magnification but narrows comfort."],
  ],
  "polarization-lab": [
    ["Transverse proof", "Only transverse waves can be polarized."],
    ["Analyzer angle", "Turning the analyzer changes transmitted intensity."],
    ["Malus law", "For polarized input, I = I0 cos^2 theta."],
    ["Extinction", "Crossed polarizers near 90 degrees block most transmitted light."],
  ],
  "young-double-slit": [
    ["Coherence", "Stable fringes need sources with a fixed phase relationship."],
    ["Path difference", "Bright bands happen when path difference is an integer wavelength."],
    ["Fringe width", "Beta = lambda D / d."],
    ["Wider pattern", "Increase wavelength or screen distance, or decrease slit separation."],
  ],
  "single-slit-diffraction": [
    ["Aperture spread", "Narrower slit produces wider diffraction."],
    ["Central maximum", "The central bright band is widest and strongest."],
    ["Minima", "Dark bands follow a sin theta = m lambda."],
    ["Not YDSE", "Single slit is diffraction from one aperture, not two-source interference."],
  ],
  "em-spectrum": [
    ["Same speed", "All EM waves travel at c in vacuum."],
    ["Inverse relation", "Higher frequency means shorter wavelength."],
    ["Photon energy", "E = hf, so ultraviolet photons carry more energy than infrared."],
    ["Visible window", "Visible light is only a small band in the full spectrum."],
  ],
  "sound-wave-anatomy": [
    ["Longitudinal wave", "Sound in air travels through compressions and rarefactions."],
    ["Pitch", "Frequency mainly decides pitch."],
    ["Loudness", "Amplitude and intensity decide loudness."],
    ["Medium needed", "Sound needs a material medium; it does not travel in vacuum."],
  ],
  "sound-pitch-loudness": [
    ["Pitch", "Frequency mainly decides whether a sound is high or low."],
    ["Loudness", "Amplitude and intensity decide how loud the sound seems."],
    ["Wavelength", "For fixed sound speed, higher frequency means shorter wavelength."],
    ["Distance effect", "Intensity reduces as sound spreads out from the source."],
  ],
};

function PhaseOneBasicsPanel({ experimentId }: { experimentId: string }) {
  const basics = phaseOneBasics[experimentId] ?? [];
  return (
    <CollapsibleSection icon="spark" title="Visual Basics" hint="Phase 1 concept map, visual cues, and common traps" defaultOpen>
      <div className="grid gap-2 text-sm">
        {basics.map(([term, detail]) => (
          <div key={term} className="rounded-md border border-slate-300/70 bg-white p-3 dark:border-lab-line dark:bg-slate-950">
            <div className="font-black text-slate-800 dark:text-slate-100">{term}</div>
            <p className="mt-1 text-slate-600 dark:text-slate-300">{detail}</p>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}

const phaseTwoThreeBasics: Record<string, Array<[string, string]>> = {
  "electrostatic-field-potential": [["Field", "Electric field is force per unit positive test charge."], ["Potential", "Potential is energy per unit charge and varies as 1/r for a point charge."], ["Equipotential", "No work is done moving along one equipotential surface."], ["Direction", "Field lines point from positive charge toward negative charge."]],
  "static-electricity": [["Attraction/repulsion", "Like charges repel and unlike charges attract."], ["Inverse square", "Force weakens rapidly with distance."], ["Neutral object", "A charged body can attract a neutral object by polarization."], ["Sign", "Force direction depends on charge signs."]],
  "capacitor-lab": [["Charge storage", "A capacitor stores equal and opposite charge on two plates."], ["Energy", "Stored energy is 1/2 CV^2."], ["Dielectric", "A dielectric increases capacitance by reducing effective field."], ["Combinations", "Parallel capacitances add; series capacitance is smaller than the smallest branch."]],
  "kirchhoff-circuit": [["Junction rule", "Total current entering a junction equals total current leaving it."], ["Loop rule", "The sum of potential changes around a closed loop is zero."], ["Branch current", "Parallel branches can carry different currents."], ["Sign trap", "Choose loop direction and voltage-rise signs consistently."]],
  "magnetic-field-current": [["Right-hand rule", "Thumb follows current and curled fingers show field direction."], ["Current effect", "More current means stronger magnetic field."], ["Distance", "Field around a long wire decreases with distance."], ["Coil", "More turns concentrate the field."]],
  "electromagnet": [["Temporary magnet", "A current-carrying coil can behave like a magnet."], ["Iron core", "A soft iron core strengthens the magnetic field."], ["Polarity", "Reverse current reverses poles."], ["Strength", "Turns and current decide field strength."]],
  "lorentz-force": [["Vector rule", "Magnetic force is q v cross B."], ["Maximum", "Force is maximum when velocity is perpendicular to field."], ["No work", "Magnetic force changes direction, not speed."], ["Charge sign", "Negative charge reverses the force direction."]],
  "emi-faraday": [["Flux change", "Induced emf appears only when magnetic flux changes."], ["Faraday law", "More turns and faster flux change give larger emf."], ["Lenz law", "Induced current opposes the change causing it."], ["Motion", "Moving magnet or coil can change flux."]],
  "ac-generator": [["Rotating coil", "A coil rotating in a magnetic field cuts changing flux."], ["AC output", "The induced emf reverses every half turn."], ["Frequency", "Faster rotation raises frequency and peak emf."], ["Slip rings", "Slip rings maintain alternating output connection."]],
  "transformer-lab": [["AC only", "A transformer needs changing flux, so it needs AC."], ["Turns ratio", "Vs/Vp = Ns/Np."], ["Step-up", "More secondary turns increases voltage."], ["Power tradeoff", "Current changes opposite to voltage in an ideal transformer."]],
  "ac-lcr-resonance": [["Reactance", "Inductor and capacitor oppose AC differently."], ["Resonance", "At resonance XL = XC and current is maximum."], ["Impedance", "Z combines resistance and net reactance."], ["Frequency", "Changing frequency changes both XL and XC."]],
  "newton-s-second-law": [["Net force", "Acceleration follows net force, not one individual force."], ["Mass", "More mass means less acceleration for the same net force."], ["Free body", "Draw all forces before writing Fnet = ma."], ["Units", "One newton is one kg m/s^2."]],
  "balanced-unbalanced-forces": [["Balanced", "Balanced forces give zero acceleration."], ["Unbalanced", "A nonzero net force changes motion."], ["Direction", "Acceleration points with net force."], ["Not speed", "Zero net force can still mean constant velocity."]],
  friction: [["Static friction", "Static friction adjusts up to a limiting value."], ["Kinetic friction", "Kinetic friction acts once sliding begins."], ["Normal force", "Friction depends on normal force."], ["Direction", "Friction opposes relative motion or tendency of motion."]],
  "inclined-plane": [["Components", "Weight splits into mg sin theta and mg cos theta."], ["Normal", "Normal reaction is usually mg cos theta on a simple incline."], ["Parallel pull", "mg sin theta pulls down the plane."], ["Friction", "Friction direction opposes sliding tendency."]],
  "work-power": [["Work", "Work is force times displacement along the force direction."], ["Area", "Area under force-displacement graph gives work."], ["Power", "Power is rate of doing work."], ["Zero work", "Perpendicular force does no work."]],
  "conservation-of-energy": [["Energy exchange", "Potential energy can become kinetic energy."], ["Losses", "Friction converts mechanical energy to heat/sound."], ["Reference", "Potential energy depends on chosen zero height."], ["Mass cancel", "In ideal free fall, impact speed does not depend on mass."]],
  "circular-motion": [["Tangent velocity", "Velocity is tangent to the circular path."], ["Inward acceleration", "Centripetal acceleration points to the centre."], ["Force", "Centripetal force is not a new force; it is the inward resultant."], ["Misconception", "Centrifugal force is frame-dependent, not the inward cause."]],
  "simple-pendulum": [["Small angle", "The simple formula works for small oscillations."], ["Length", "Longer pendulum means longer period."], ["Mass", "Mass does not affect ideal period."], ["One cycle", "One oscillation returns to the same state."]],
  "shm-spring": [["Mean position", "Restoring force is zero at mean position."], ["Amplitude", "Amplitude is maximum displacement."], ["Max speed", "Speed is maximum at mean position."], ["Max acceleration", "Acceleration is maximum at extremes."]],
  buoyancy: [["Displaced fluid", "Buoyant force equals weight of displaced fluid."], ["Float", "Floating object displaces its own weight of fluid."], ["Sink", "If object density exceeds fluid density, it sinks."], ["Apparent weight", "Buoyancy reduces apparent weight."]],
  "density-float-sink": [["Density compare", "Object density compared with fluid density decides state."], ["Neutral", "Equal densities give neutral buoyancy."], ["Submerged fraction", "For floating bodies, fraction submerged roughly equals density ratio."], ["Volume", "Buoyant force depends on displaced volume."]],
  "bernoulli-fluid-flow": [["Streamline", "Bernoulli applies along a streamline for ideal flow."], ["Fast-low pressure", "Higher speed often means lower static pressure."], ["Height term", "Height contributes rho gh."], ["Continuity", "Narrower pipe section makes flow faster."]],
  "photoelectric-equation": [["Threshold", "No electrons emit below threshold frequency."], ["Work function", "Work function is minimum energy to free an electron."], ["Frequency", "Frequency controls maximum kinetic energy."], ["Intensity", "Intensity controls photoelectron count after threshold."]],
};

function PhaseTwoThreeBasicsPanel({ experimentId }: { experimentId: string }) {
  const basics = phaseTwoThreeBasics[experimentId] ?? [];
  return (
    <CollapsibleSection icon="spark" title="Concept Basics" hint="Core idea, visual cue, and common trap" defaultOpen>
      <div className="grid gap-2 text-sm">
        {basics.map(([term, detail]) => (
          <div key={term} className="rounded-md border border-slate-300/70 bg-white p-3 dark:border-lab-line dark:bg-slate-950">
            <div className="font-black text-slate-800 dark:text-slate-100">{term}</div>
            <p className="mt-1 text-slate-600 dark:text-slate-300">{detail}</p>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}

function ChangeWatchBecause({ result, focusIndex }: { result: LabResult; focusIndex: number | null }) {
  const control = focusIndex === null ? result.controls[0] : result.controls[focusIndex];
  const output = result.outputs[0];
  return (
    <div className="change-watch-strip mt-4">
      <div>
        <span className="ui-label">Change</span>
        <strong>{control?.label ?? "one variable"}</strong>
      </div>
      <div>
        <span className="ui-label">Watch</span>
        <strong>{output?.label ?? "the result"}</strong>
      </div>
      <div>
        <span className="ui-label">Because</span>
        <strong>{result.formula}</strong>
      </div>
    </div>
  );
}

function LabGraphingWorkspace({ result, values, makeTrialOutputs, defaultOpen = false }: { result: LabResult; values: number[]; makeTrialOutputs: (values: number[]) => LabResult["outputs"]; defaultOpen?: boolean }) {
  const [inputIndex, setInputIndex] = useState(0);
  const [outputIndex, setOutputIndex] = useState(0);
  const input = result.controls[inputIndex] ?? result.controls[0];
  const output = result.outputs[outputIndex] ?? result.outputs[0];
  const points = useMemo(() => {
    if (!input) return [];
    return Array.from({ length: 31 }, (_, index) => {
      const x = input.min + ((input.max - input.min) * index) / 30;
      const trialValues = [...values];
      trialValues[inputIndex] = x;
      const y = parseOutputNumber(makeTrialOutputs(trialValues)[outputIndex]?.value ?? "0");
      return { x, y };
    }).filter((point) => Number.isFinite(point.y));
  }, [input, inputIndex, makeTrialOutputs, outputIndex, values]);

  if (!input || !output || points.length < 2) return null;

  return (
    <CollapsibleSection id="graphing-workspace" icon="chart" title="Graphing Workspace" hint="Plot any calculated output against any selected input" defaultOpen={defaultOpen}>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm font-black">
          Input variable
          <select className="select-field mt-1 w-full" value={inputIndex} onChange={(event) => setInputIndex(Number(event.target.value))}>
            {result.controls.map((control, index) => <option key={control.label} value={index}>{control.label}</option>)}
          </select>
        </label>
        <label className="text-sm font-black">
          Output variable
          <select className="select-field mt-1 w-full" value={outputIndex} onChange={(event) => setOutputIndex(Number(event.target.value))}>
            {result.outputs.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
          </select>
        </label>
      </div>
      <PlotSvg points={points} xLabel={input.label} yLabel={output.label} />
      <div className="mt-3 rounded-md border border-cyan-400/30 bg-cyan-400/10 p-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
        Hold the other sliders constant, then vary <strong>{input.label}</strong> to see the pattern in <strong>{output.label}</strong>.
      </div>
    </CollapsibleSection>
  );
}

function LabReportGenerator({ experiment, result, values, defaultOpen = false }: { experiment: typeof experiments[number]; result: LabResult; values: number[]; defaultOpen?: boolean }) {
  const readings = result.controls.map((control, index) => ({
    label: control.label,
    value: values[index] ?? 0,
  }));
  const reportHtml = () => buildLabReportHtml(experiment, result, readings);

  const exportHtml = () => {
    const blob = new Blob([reportHtml()], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(experiment.title)}-lab-report.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printPdf = () => {
    const reportWindow = window.open("", "_blank", "width=920,height=1100");
    if (!reportWindow) return;
    reportWindow.document.open();
    reportWindow.document.write(reportHtml());
    reportWindow.document.close();
    reportWindow.focus();
    window.setTimeout(() => reportWindow.print(), 350);
  };

  return (
    <CollapsibleSection id="lab-report-generator" icon="printer" title="Lab Report Generator" hint="Export aim, theory, readings, graph, and conclusion as HTML or browser PDF" defaultOpen={defaultOpen}>
      <div className="lab-report-preview">
        <div>
          <div className="ui-label">Report sections</div>
          <h3 className="mt-1 text-xl font-black">{experiment.title}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Includes aim, theory, apparatus, procedure, current readings, calculated outputs, graph, conclusion, viva, and mistakes.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="hero-btn-secondary" onClick={exportHtml}><PhysicsIcon name="download" className="h-4 w-4" />Export HTML</button>
          <button className="hero-btn-secondary" onClick={printPdf}><PhysicsIcon name="printer" className="h-4 w-4" />Print / PDF</button>
        </div>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        {readings.map((reading) => (
          <div key={reading.label} className="result-card">
            <div className="text-xs text-slate-500 dark:text-slate-400">{reading.label}</div>
            <div className="result-card-value">{reading.value.toFixed(Math.abs(reading.value) < 10 ? 2 : 1)}</div>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}

function MiniAction({ label, icon, onClick }: { label: string; icon: Parameters<typeof PhysicsIcon>[0]["name"]; onClick: () => void }) {
  return (
    <button className="mini-action-btn" onClick={onClick} type="button">
      <PhysicsIcon name={icon} className="h-4 w-4" />{label}
    </button>
  );
}

function CollapsibleSection({ id, icon, title, hint, defaultOpen = false, children }: { id?: string; icon: Parameters<typeof PhysicsIcon>[0]["name"]; title: string; hint: string; defaultOpen?: boolean; children: ReactNode }) {
  const sectionRef = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={sectionRef} id={id} className="lab-disclosure mt-4 fullscreen-target" open={defaultOpen}>
      <summary title={hint}>
        <span className="inline-flex min-w-0 items-center gap-2">
          <PhysicsIcon name={icon} className="h-4 w-4 text-cyan-500" />
          <span className="truncate">{title}</span>
        </span>
        <span className="lab-summary-actions">
          <FullscreenButton targetRef={sectionRef} compact />
          <span className="info-dot" title={hint}>i</span>
        </span>
      </summary>
      <div className="lab-disclosure-body">{children}</div>
    </details>
  );
}

function InfoTile({ icon, label, value }: { icon: Parameters<typeof PhysicsIcon>[0]["name"]; label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-300/70 bg-slate-100 p-3 dark:border-lab-line dark:bg-slate-900/70" title={`${label}: ${value}`}>
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <PhysicsIcon name={icon} className="h-4 w-4 text-cyan-500" />{label}
      </div>
      <div className="mt-1 text-sm font-bold">{value}</div>
    </div>
  );
}

function LabSlider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  const hint = explainControl(label);
  const progress = ((value - min) / Math.max(step, max - min)) * 100;
  const displayDigits = step < 0.1 ? 2 : 1;
  return (
    <label className="lab-slider-card" title={hint}>
      <div className="mb-1 flex justify-between text-sm">
        <span className="inline-flex items-center gap-1">{label}<span className="info-dot" title={hint}>i</span></span>
        <span className="font-mono text-cyan-500">{value.toFixed(displayDigits)}</span>
      </div>
      <div className="slider-fill" aria-hidden="true"><span style={{ width: `${clampNumber(progress, 0, 100)}%` }} /></div>
      <input className="mt-2 w-full accent-cyan-400" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <div className="mt-2 flex items-center justify-between gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1">
        <button className="slider-mini-btn" type="button" onClick={() => onChange(min)}>Low</button>
        <button className="slider-mini-btn" type="button" onClick={() => onChange(midpoint({ min, max, step, label }))}>Mid</button>
        <button className="slider-mini-btn" type="button" onClick={() => onChange(max)}>High</button>
      </div>
    </label>
  );
}

interface LabControl {
  label: string;
  min: number;
  max: number;
  step: number;
}

interface LabResult {
  description: string;
  controls: LabControl[];
  formula: string;
  outputs: { label: string; value: string }[];
}

const controls = (one: string, two: string, three: string, ranges?: Partial<Record<"a" | "b" | "c", Partial<LabControl>>>): LabControl[] => [
  { label: one, min: 0.1, max: 20, step: 0.1, ...ranges?.a },
  { label: two, min: 0.1, max: 20, step: 0.1, ...ranges?.b },
  { label: three, min: 0, max: 2, step: 0.01, ...ranges?.c },
];

const nearZero = (value: number) => Math.abs(value) < 1e-9;
const formatFinite = (value: number, digits = 2) => (Number.isFinite(value) ? value.toFixed(digits) : "Very large");
const formatDistance = (value: number, unit = "cm") => (Number.isFinite(value) ? `${value.toFixed(2)} ${unit}` : "At infinity");
const clampNumber = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const parseOutputNumber = (value: string) => {
  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/i);
  return match ? Number(match[0]) : 0;
};
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const degreeToRad = (value: number) => (value * Math.PI) / 180;
const roundIfInteger = (value: number, tolerance = 1e-9) => Math.abs(value - Math.round(value)) < tolerance;
const midpoint = (control: LabControl) => Number(((control.min + control.max) / 2).toFixed(control.step < 0.1 ? 2 : 1));

function buildLabReportHtml(experiment: typeof experiments[number], result: LabResult, readings: Array<{ label: string; value: number }>) {
  const graphPoints = makeReportPoints(result);
  const graphSvg = makeReportGraphSvg(graphPoints, result.controls[0]?.label ?? "Input", result.outputs[0]?.label ?? "Output");
  const rows = readings.map((reading) => `<tr><td>${escapeHtml(reading.label)}</td><td>${escapeHtml(formatReportNumber(reading.value))}</td></tr>`).join("");
  const outputRows = result.outputs.map((output) => `<tr><td>${escapeHtml(output.label)}</td><td>${escapeHtml(output.value)}</td></tr>`).join("");
  const procedure = experiment.procedure.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const apparatus = experiment.apparatus.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const mistakes = experiment.commonMistakes.slice(0, 5).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const viva = experiment.vivaQuestions.slice(0, 5).map((item) => `<li><strong>${escapeHtml(item.prompt)}</strong><br/>${escapeHtml(item.answer)}</li>`).join("");
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(experiment.title)} Lab Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #111827; line-height: 1.45; }
    h1 { font-size: 28px; margin: 0 0 4px; }
    h2 { font-size: 18px; margin-top: 24px; border-bottom: 2px solid #06b6d4; padding-bottom: 4px; }
    .meta { color: #475569; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
    th { background: #ecfeff; }
    .graph { margin-top: 12px; border: 1px solid #cbd5e1; padding: 8px; }
    .conclusion { background: #ecfdf5; border: 1px solid #34d399; padding: 12px; border-radius: 8px; }
    @media print { body { margin: 18mm; } button { display: none; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(experiment.title)}</h1>
  <div class="meta">${escapeHtml(experiment.classLevel)} | ${escapeHtml(experiment.category)} | ${escapeHtml(experiment.difficulty)}</div>
  <h2>Aim</h2>
  <p>${escapeHtml(experiment.aim)}</p>
  <h2>Theory</h2>
  <p>${escapeHtml(result.description)}</p>
  <p><strong>Formula:</strong> ${escapeHtml(result.formula)}</p>
  <h2>Apparatus</h2>
  <ul>${apparatus}</ul>
  <h2>Procedure</h2>
  <ol>${procedure}</ol>
  <h2>Readings</h2>
  <table><thead><tr><th>Quantity</th><th>Reading</th></tr></thead><tbody>${rows}</tbody></table>
  <h2>Calculated Outputs</h2>
  <table><thead><tr><th>Output</th><th>Value</th></tr></thead><tbody>${outputRows}</tbody></table>
  <h2>Graph</h2>
  <div class="graph">${graphSvg}</div>
  <h2>Conclusion</h2>
  <p class="conclusion">${escapeHtml(experiment.expectedResult)} Current model result: ${escapeHtml(result.outputs[0]?.label ?? "Output")} = ${escapeHtml(result.outputs[0]?.value ?? "-")}.</p>
  <h2>Precautions / Common Mistakes</h2>
  <ul>${mistakes}</ul>
  <h2>Viva Questions</h2>
  <ol>${viva}</ol>
</body>
</html>`;
}

function makeReportPoints(result: LabResult) {
  const input = result.controls[0];
  if (!input) return [];
  const outputValue = parseOutputNumber(result.outputs[0]?.value ?? "0");
  return Array.from({ length: 7 }, (_, index) => {
    const x = input.min + ((input.max - input.min) * index) / 6;
    const scale = input.max === input.min ? 1 : (x - input.min) / (input.max - input.min);
    return { x, y: outputValue * (0.35 + scale * 0.9) };
  });
}

function makeReportGraphSvg(points: Array<{ x: number; y: number }>, xLabel: string, yLabel: string) {
  if (points.length < 2) return "<p>No graph data available.</p>";
  const width = 620;
  const height = 260;
  const pad = 42;
  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(0, ...points.map((point) => point.y));
  const maxY = Math.max(1, ...points.map((point) => point.y));
  const toX = (x: number) => pad + ((x - minX) / Math.max(1e-9, maxX - minX)) * (width - pad * 1.5);
  const toY = (y: number) => height - pad - ((y - minY) / Math.max(1e-9, maxY - minY)) * (height - pad * 1.4);
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${toX(point.x).toFixed(1)} ${toY(point.y).toFixed(1)}`).join(" ");
  const circles = points.map((point) => `<circle cx="${toX(point.x).toFixed(1)}" cy="${toY(point.y).toFixed(1)}" r="3" fill="#facc15" stroke="#111827" />`).join("");
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="260" role="img" aria-label="${escapeHtml(yLabel)} vs ${escapeHtml(xLabel)}">
    <line x1="${pad}" y1="${height - pad}" x2="${width - pad / 2}" y2="${height - pad}" stroke="#111827" stroke-width="2" />
    <line x1="${pad}" y1="${pad / 2}" x2="${pad}" y2="${height - pad}" stroke="#111827" stroke-width="2" />
    <path d="${path}" fill="none" stroke="#06b6d4" stroke-width="4" stroke-linecap="round" />
    ${circles}
    <text x="${width / 2}" y="${height - 8}" font-size="12" font-weight="700">${escapeHtml(xLabel)}</text>
    <text x="12" y="18" font-size="12" font-weight="700">${escapeHtml(yLabel)}</text>
  </svg>`;
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function formatReportNumber(value: number) {
  if (!Number.isFinite(value)) return "-";
  return Math.abs(value) >= 10000 ? value.toExponential(3) : Number(value.toPrecision(5)).toString();
}

function explainControl(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("mass")) return "Mass is the amount of matter. Change this separately from weight.";
  if (lower.includes("weight")) return "Weight is force due to gravity, measured in newtons.";
  if (lower.includes("time")) return "Use time as the independent variable when studying rate effects.";
  if (lower.includes("distance") || lower.includes("height") || lower.includes("length")) return "Length quantity used directly in the model; watch the unit in brackets.";
  if (lower.includes("angle")) return "Angles are entered in degrees and converted internally to radians.";
  if (lower.includes("voltage") || lower.includes("emf")) return "Potential difference driving charge through the circuit.";
  if (lower.includes("current")) return "Rate of charge flow, measured in amperes.";
  if (lower.includes("resistance") || lower.includes("ohm")) return "Opposition to current flow, measured in ohms.";
  if (lower.includes("frequency")) return "Cycles per second; higher frequency usually means shorter wavelength.";
  if (lower.includes("temperature")) return "Use kelvin for gas laws; Celsius is used only where stated.";
  if (lower.includes("charge")) return "Charge values are entered in microcoulombs where the label says microC.";
  return "Change one variable at a time to see the clearest pattern.";
}

function explainOutput(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("force")) return "Force result in newtons where applicable.";
  if (lower.includes("energy") || lower.includes("work") || lower.includes("heat")) return "Energy transfer result. Check whether the unit is J, kJ, or kWh.";
  if (lower.includes("power")) return "Rate of energy transfer.";
  if (lower.includes("speed") || lower.includes("velocity")) return "Motion rate result from the current variable setup.";
  if (lower.includes("pressure")) return "Pressure is force per area or energy density, depending on the topic.";
  if (lower.includes("field")) return "Field strength at the selected point or relative setup.";
  if (lower.includes("deviation")) return "Deviation is the turn between the original incident direction and the emergent ray.";
  if (lower.includes("spread")) return "Spread compares violet and red deviation; higher dispersion makes the spectrum wider.";
  if (lower.includes("critical")) return "Critical angle marks where the internal ray can start total internal reflection.";
  return "Calculated from the current slider values.";
}

function formulaNote(id: string) {
  if (id === "work-power") return "Assumes force and displacement point in the same direction.";
  if (id === "heat-transfer") return "Uses a fixed 40 C temperature difference for comparison.";
  if (id === "ac-generator") return "Uses an assumed coil area of 0.01 m^2 so turns, field, and frequency stay visible.";
  if (id === "lorentz-force") return "Assumes velocity is perpendicular to the magnetic field.";
  if (id === "mirror-formula" || id === "lens-formula") return "Uses Cartesian sign convention; negative magnification means inverted image.";
  if (id === "glass-slab-refraction") return "The slab model assumes parallel faces, so the emergent ray is parallel to the incident ray.";
  if (id === "total-internal-reflection") return "TIR is possible only for denser-to-rarer travel with incidence above the critical angle.";
  if (id === "young-double-slit") return "Fringe width assumes small angles and coherent slits.";
  if (id === "single-slit-diffraction") return "The central maximum estimate uses the first minima on both sides.";
  if (id === "polarization-lab") return "Malus' law applies after the light is already plane-polarized.";
  if (id === "em-spectrum") return "Frequency is entered in THz and converted to Hz before applying c = f lambda and E = hf.";
  if (id === "prism-dispersion") return "The calculator shows both school-level small-angle deviation and minimum-deviation prism formula. Angles are measured from the normal.";
  if (id === "capacitor-lab") return "Capacitance is entered in microfarads; energy uses farads internally.";
  if (id === "kirchhoff-circuit") return "The simplified model treats two resistive branches in parallel across the same supply.";
  if (id === "emi-faraday") return "Only changing magnetic flux induces emf; steady flux gives no induced emf.";
  if (id === "ac-generator") return "Peak emf scales with turns, field strength, coil area, and angular speed.";
  if (id === "transformer-lab") return "Transformer equations assume ideal AC coupling and negligible losses.";
  if (id === "ac-lcr-resonance") return "The model uses a fixed 0.10 H inductor and the slider capacitance in microfarads.";
  if (id === "photoelectric-equation") return "Intensity changes photocurrent only after photon energy exceeds the work function.";
  if (id === "buoyancy" || id === "density-float-sink") return "Archimedes' principle compares object weight with displaced-fluid weight.";
  if (id === "bernoulli-fluid-flow") return "Bernoulli estimates ideal streamline flow and ignores viscosity losses.";
  if (id === "thermodynamic-process") return "kPa times litre is numerically equal to joule.";
  if (id === "de-broglie-wavelength") return "Mass factor is relative to electron mass.";
  return "All units follow the slider labels.";
}

function defaultLabValues(id: string): [number, number, number] {
  if (id === "prism-dispersion") return [60, 1.52, 0.028];
  if (id === "glass-slab-refraction") return [45, 1.5, 6];
  if (id === "total-internal-reflection") return [1.5, 1, 50];
  if (id === "lens-formula" || id === "mirror-formula") return [20, 40, 5];
  if (id === "human-eye-defects") return [2.1, 2.4, 1];
  if (id === "optical-instruments") return [100, 10, 0];
  if (id === "polarization-lab") return [100, 45, 1];
  if (id === "young-double-slit") return [560, 1, 0.25];
  if (id === "single-slit-diffraction") return [560, 1, 0.2];
  if (id === "em-spectrum") return [550, 1, 0.8];
  if (id === "sound-wave-anatomy" || id === "sound-pitch-loudness") return [440, 1, 343];
  if (id === "capacitor-lab") return [100, 12, 50];
  if (id === "kirchhoff-circuit") return [12, 10, 20];
  if (id === "emi-faraday") return [200, 20, 80];
  if (id === "ac-generator") return [120, 0.6, 50];
  if (id === "transformer-lab") return [120, 500, 1000];
  if (id === "ac-lcr-resonance") return [50, 50, 100];
  if (id === "electrostatic-field-potential" || id === "static-electricity") return [5, 1, 1];
  if (id === "magnetic-field-current" || id === "electromagnet") return [10, 10, 2];
  if (id === "lorentz-force") return [2, 5, 0.5];
  if (id === "newton-s-second-law") return [60, 10, 5];
  if (id === "balanced-unbalanced-forces") return [40, 80, 10];
  if (id === "friction") return [10, 40, 0.4];
  if (id === "inclined-plane") return [5, 30, 0.2];
  if (id === "work-power" || id === "conservation-of-energy") return [10, 20, 0.15];
  if (id === "circular-motion") return [2, 5, 1.3];
  if (id === "simple-pendulum") return [1, 0.2, 0.3];
  if (id === "shm-spring") return [50, 2, 0.4];
  if (id === "buoyancy" || id === "density-float-sink") return [800, 1000, 700];
  if (id === "bernoulli-fluid-flow") return [1000, 18, 3];
  if (id === "photoelectric-equation") return [4, 2.5, 0.8];
  return [5, 2, 0.2];
}

function calculateStarterLab(id: string, a: number, b: number, c: number): LabResult {
  const g = 9.81;
  const calculators: Record<string, () => LabResult> = {
    "distance-time-graph": () => ({
      description: "Build a motion graph and watch slope become speed.",
      controls: controls("Speed (m/s)", "Time (s)", "Starting distance (m)", { a: { min: 0, max: 40, step: 0.5 }, b: { min: 0, max: 60, step: 1 }, c: { min: 0, max: 100, step: 1 } }),
      formula: "s = s0 + vt, graph slope = Delta s / Delta t",
      outputs: [{ label: "Distance", value: `${(c + a * b).toFixed(2)} m` }, { label: "Graph slope", value: `${a.toFixed(2)} m/s` }, { label: "Motion type", value: a === 0 ? "At rest" : "Uniform motion" }],
    }),
    "balanced-unbalanced-forces": () => {
      const net = b - a;
      const mass = Math.max(0.1, c);
      return {
        description: "Add opposite forces as signed vectors and connect net force to acceleration.",
        controls: controls("Left force (N)", "Right force (N)", "Mass (kg)", { a: { min: 0, max: 200, step: 1 }, b: { min: 0, max: 200, step: 1 }, c: { min: 0.1, max: 50, step: 0.1 } }),
        formula: "Fnet = Fright - Fleft, a = Fnet / m",
        outputs: [{ label: "Net force", value: `${net.toFixed(2)} N` }, { label: "Acceleration", value: `${(net / mass).toFixed(2)} m/s^2` }, { label: "State", value: Math.abs(net) < 0.01 ? "Balanced" : net > 0 ? "Accelerates right" : "Accelerates left" }],
      };
    },
    "universal-gravitation": () => {
      const force = 6.674e-11 * (a * 5.972e24) * b / ((c * 1e6) ** 2);
      const field = force / Math.max(0.1, b);
      return {
        description: "Compare mass attraction and the inverse-square distance pattern.",
        controls: controls("Central mass (Earths)", "Test mass (kg)", "Distance (10^6 m)", { a: { min: 0.1, max: 10, step: 0.1 }, b: { min: 0.1, max: 1000, step: 1 }, c: { min: 1, max: 50, step: 0.1 } }),
        formula: "F = G m1 m2 / r^2, g = GM/r^2",
        outputs: [{ label: "Force", value: `${force.toExponential(2)} N` }, { label: "Field strength", value: `${field.toExponential(2)} N/kg` }, { label: "Distance rule", value: "Double r gives one-fourth force" }],
      };
    },
    "density-float-sink": () => {
      const fraction = a > 0 ? c / a : 1;
      const state = fraction < 0.98 ? "Floats" : fraction <= 1.02 ? "Nearly neutral" : "Sinks";
      return {
        description: "Compare object density with liquid density to predict floating, sinking, and submerged fraction.",
        controls: controls("Fluid density (kg/m3)", "Object volume (L)", "Object density (kg/m3)", { a: { min: 500, max: 1400, step: 10 }, b: { min: 0.1, max: 20, step: 0.1 }, c: { min: 100, max: 3000, step: 10 } }),
        formula: "Floating fraction = rho_object / rho_fluid; buoyant force = rho_fluid g Vsub",
        outputs: [{ label: "Object mass", value: `${(c * b / 1000).toFixed(2)} kg` }, { label: "Submerged fraction", value: `${Math.min(100, fraction * 100).toFixed(1)} %` }, { label: "State", value: state }],
      };
    },
    "calorimetry-mixing": () => {
      const hotMass = Math.max(0.01, a);
      const hotTemp = b;
      const coldMass = Math.max(0.01, c);
      const coldTemp = 25;
      const finalTemp = (hotMass * hotTemp + coldMass * coldTemp) / (hotMass + coldMass);
      return {
        description: "Mix hot and cold water in an insulated calorimeter using heat lost equals heat gained.",
        controls: controls("Hot water mass (kg)", "Hot temperature (C)", "Cold water mass (kg)", { a: { min: 0.05, max: 5, step: 0.05 }, b: { min: 30, max: 100, step: 1 }, c: { min: 0.05, max: 5, step: 0.05 } }),
        formula: "mh(Th - Tf) = mc(Tf - Tc), with cold water fixed at 25 C",
        outputs: [{ label: "Final temperature", value: `${finalTemp.toFixed(2)} C` }, { label: "Heat lost by hot", value: `${(hotMass * 4.18 * (hotTemp - finalTemp)).toFixed(2)} kJ` }, { label: "Heat gained by cold", value: `${(coldMass * 4.18 * (finalTemp - coldTemp)).toFixed(2)} kJ` }],
      };
    },
    "uniform-motion": () => ({
      description: "Distance grows linearly with time when velocity is constant.",
      controls: controls("Velocity (m/s)", "Time (s)", "Initial x (m)"),
      formula: "x = x0 + vt",
      outputs: [{ label: "Displacement", value: `${(a * b).toFixed(2)} m` }, { label: "Position", value: `${(c + a * b).toFixed(2)} m` }, { label: "Acceleration", value: "0.00 m/s^2" }],
    }),
    "newton-s-second-law": () => ({
      description: "Acceleration is directly proportional to net force and inversely proportional to mass.",
      controls: controls("Force (N)", "Mass (kg)", "Friction force (N)"),
      formula: "a = (F - f) / m",
      outputs: [{ label: "Acceleration", value: `${((a - c) / b).toFixed(2)} m/s^2` }, { label: "Velocity after 2 s", value: `${(((a - c) / b) * 2).toFixed(2)} m/s` }, { label: "Net force check", value: `Fnet = ${(b * ((a - c) / b)).toFixed(2)} N` }],
    }),
    friction: () => ({
      description: "Friction resists motion and scales with normal force.",
      controls: controls("Mass (kg)", "Applied force (N)", "Coefficient μ"),
      formula: "N = mg, f_max = μN",
      outputs: [{ label: "Normal force", value: `${(a * g).toFixed(2)} N` }, { label: "Max friction", value: `${(c * a * g).toFixed(2)} N` }, { label: "Moves?", value: b > c * a * g ? "Yes" : "No" }],
    }),
    "inclined-plane": () => ({
      description: "Gravity splits into parallel and normal components on an incline.",
      controls: controls("Mass (kg)", "Angle (deg)", "Coefficient μ", { b: { min: 1, max: 80, step: 1 } }),
      formula: "a_down = g(sin theta - μ cos theta)",
      outputs: [{ label: "Normal force", value: `${(a * g * Math.cos(degreeToRad(b))).toFixed(2)} N` }, { label: "Friction", value: `${(c * a * g * Math.cos(degreeToRad(b))).toFixed(2)} N` }, { label: "Acceleration", value: `${Math.max(0, g * (Math.sin(degreeToRad(b)) - c * Math.cos(degreeToRad(b)))).toFixed(2)} m/s^2` }],
    }),
    "elastic-collision": () => ({
      description: "One-dimensional collision outputs momentum and energy checks.",
      controls: controls("Mass 1 (kg)", "Mass 2 (kg)", "Restitution", { c: { min: 0, max: 1, step: 0.01 } }),
      formula: "v1' = ((m1 - em2)/(m1 + m2))v1, v2' = ((1+e)m1/(m1+m2))v1",
      outputs: [{ label: "v1 final", value: `${(((a - c * b) / (a + b)) * 5).toFixed(2)} m/s` }, { label: "v2 final", value: `${((((1 + c) * a) / (a + b)) * 5).toFixed(2)} m/s` }, { label: "Momentum before", value: `${(a * 5).toFixed(2)} kg m/s` }],
    }),
    "conservation-of-energy": () => ({
      description: "Potential energy becomes kinetic energy when losses are small.",
      controls: controls("Mass (kg)", "Height (m)", "Loss fraction", { c: { min: 0, max: 0.9, step: 0.01 } }),
      formula: "mgh = 1/2 mv^2",
      outputs: [{ label: "Potential energy", value: `${(a * g * b).toFixed(2)} J` }, { label: "Speed at bottom", value: `${Math.sqrt(2 * g * b * (1 - c)).toFixed(2)} m/s` }, { label: "Remaining energy", value: `${(a * g * b * (1 - c)).toFixed(2)} J` }],
    }),
    "hooke-s-law": () => ({
      description: "Spring force is proportional to extension within the elastic limit.",
      controls: controls("k (N/m)", "Mass (kg)", "Extension (m)", { a: { max: 100, step: 1 }, c: { max: 1, step: 0.01 } }),
      formula: "F = kx, T = 2pi sqrt(m/k)",
      outputs: [{ label: "Spring force", value: `${(a * c).toFixed(2)} N` }, { label: "Weight", value: `${(b * g).toFixed(2)} N` }, { label: "Period", value: `${(2 * Math.PI * Math.sqrt(b / a)).toFixed(2)} s` }],
    }),
    "simple-pendulum": () => ({
      description: "For small angles, pendulum period depends on length and gravity, not mass.",
      controls: controls("Length (m)", "Mass (kg)", "Damping", { a: { min: 0.1, max: 5, step: 0.05 }, c: { min: 0, max: 0.5, step: 0.01 } }),
      formula: "T = 2pi sqrt(L/g)",
      outputs: [{ label: "Period", value: `${(2 * Math.PI * Math.sqrt(a / g)).toFixed(2)} s` }, { label: "Frequency", value: `${(1 / (2 * Math.PI * Math.sqrt(a / g))).toFixed(2)} Hz` }, { label: "Damping", value: `${c.toFixed(2)}` }],
    }),
    "circular-motion": () => ({
      description: "Centripetal acceleration points toward the center of rotation.",
      controls: controls("Mass (kg)", "Radius (m)", "Angular speed (rad/s)", { c: { min: 0, max: 10, step: 0.1 } }),
      formula: "F = mr omega^2, v = r omega",
      outputs: [{ label: "Centripetal force", value: `${(a * b * c ** 2).toFixed(2)} N` }, { label: "Tangential speed", value: `${(b * c).toFixed(2)} m/s` }, { label: "Acceleration", value: `${(b * c ** 2).toFixed(2)} m/s^2` }],
    }),
    "heat-and-temperature": () => ({
      description: "Compare Celsius, Fahrenheit, and Kelvin while noticing that temperature is a measure, not heat itself.",
      controls: controls("Temperature (C)", "Mass (kg)", "Specific heat (kJ/kg C)", { a: { min: -20, max: 120, step: 1 }, b: { min: 0.1, max: 5, step: 0.1 }, c: { min: 0.2, max: 4.2, step: 0.1 } }),
      formula: "K = C + 273.15, Q = mcDeltaT",
      outputs: [{ label: "Kelvin", value: `${(a + 273.15).toFixed(2)} K` }, { label: "Fahrenheit", value: `${((a * 9) / 5 + 32).toFixed(1)} F` }, { label: "Energy for 10 C rise", value: `${(b * c * 10).toFixed(2)} kJ` }],
    }),
    "heat-transfer": () => ({
      description: "Estimate heat flow through a slab and compare how thickness and area affect conduction.",
      controls: controls("k (W/m C)", "Area (m2)", "Thickness (m)", { a: { min: 0.1, max: 400, step: 1 }, b: { min: 0.01, max: 5, step: 0.01 }, c: { min: 0.01, max: 1, step: 0.01 } }),
      formula: "H = kA(Th - Tc) / L",
      outputs: [{ label: "Heat rate, DeltaT=40 C", value: `${((a * b * 40) / c).toFixed(1)} W` }, { label: "Heat in 60 s", value: `${(((a * b * 40) / c) * 60 / 1000).toFixed(2)} kJ` }, { label: "Thickness effect", value: c > 0.5 ? "Slower" : "Faster" }],
    }),
    "heating-effect-current": () => ({
      description: "Joule heating shows why bulbs glow, fuses melt, and appliances consume power.",
      controls: controls("Current (A)", "Resistance (ohm)", "Time (s)", { a: { min: 0.1, max: 10, step: 0.1 }, b: { min: 1, max: 100, step: 1 }, c: { min: 1, max: 120, step: 1 } }),
      formula: "H = I^2Rt, P = I^2R",
      outputs: [{ label: "Power", value: `${(a * a * b).toFixed(2)} W` }, { label: "Heat produced", value: `${(a * a * b * c).toFixed(2)} J` }, { label: "Bulb brightness", value: a * a * b > 60 ? "High" : "Low/medium" }],
    }),
    electromagnet: () => ({
      description: "A current-carrying coil behaves like a magnet; more turns or current produce a stronger field.",
      controls: controls("Turns", "Current (A)", "Core factor", { a: { min: 10, max: 500, step: 10 }, b: { min: 0.1, max: 5, step: 0.1 }, c: { min: 1, max: 5, step: 0.1 } }),
      formula: "Relative field proportional to NI x core factor",
      outputs: [{ label: "Relative field", value: `${(a * b * c).toFixed(0)}` }, { label: "Polarity flips?", value: "Reverse current" }, { label: "Core effect", value: c > 2 ? "Strong iron core" : "Air/weak core" }],
    }),
    "reflection-plane-mirror": () => ({
      description: "Plane mirror reflection keeps the angle of incidence equal to the angle of reflection.",
      controls: controls("Incidence angle (deg)", "Object distance (cm)", "Mirror tilt (deg)", { a: { min: 0, max: 80, step: 1 }, b: { min: 1, max: 100, step: 1 }, c: { min: -45, max: 45, step: 1 } }),
      formula: "i = r, image distance = object distance",
      outputs: [{ label: "Reflection angle", value: `${a.toFixed(0)} deg` }, { label: "Image distance", value: `${b.toFixed(1)} cm` }, { label: "Ray turns by", value: `${(2 * a).toFixed(0)} deg` }],
    }),
    "force-and-pressure": () => ({
      description: "Pressure increases with force and decreases when the same force spreads over a larger area.",
      controls: controls("Force (N)", "Area (m2)", "Depth (m)", { a: { min: 1, max: 500, step: 1 }, b: { min: 0.01, max: 5, step: 0.01 }, c: { min: 0, max: 10, step: 0.1 } }),
      formula: "P = F/A",
      outputs: [{ label: "Solid pressure", value: `${(a / b).toFixed(2)} Pa` }, { label: "Water pressure at depth", value: `${(1000 * g * c).toFixed(0)} Pa` }, { label: "Area effect", value: b > 1 ? "Pressure reduced" : "Pressure concentrated" }],
    }),
    "fluid-pressure": () => ({
      description: "Pressure in a liquid grows with depth and density, independent of container shape.",
      controls: controls("Density (kg/m3)", "Depth (m)", "Atmospheric P (kPa)", { a: { min: 700, max: 1400, step: 10 }, b: { min: 0, max: 20, step: 0.1 }, c: { min: 80, max: 120, step: 1 } }),
      formula: "P = Patm + rho gh",
      outputs: [{ label: "Gauge pressure", value: `${(a * g * b / 1000).toFixed(2)} kPa` }, { label: "Absolute pressure", value: `${(c + a * g * b / 1000).toFixed(2)} kPa` }, { label: "Depth trend", value: b > 5 ? "High pressure" : "Low pressure" }],
    }),
    "sound-pitch-loudness": () => ({
      description: "Frequency controls pitch while amplitude controls loudness.",
      controls: controls("Frequency (Hz)", "Amplitude", "Distance (m)", { a: { min: 20, max: 2000, step: 10 }, b: { min: 0.1, max: 2, step: 0.1 }, c: { min: 1, max: 50, step: 1 } }),
      formula: "lambda = v/f, intensity proportional to A^2/r^2",
      outputs: [{ label: "Wavelength in air", value: `${(343 / a).toFixed(2)} m` }, { label: "Relative intensity", value: `${((b * b) / (c * c)).toFixed(4)}` }, { label: "Pitch", value: a > 500 ? "High" : "Low/medium" }],
    }),
    "static-electricity": () => ({
      description: "Charged objects exert force; the force gets weaker very quickly as distance increases.",
      controls: controls("Charge 1 (microC)", "Charge 2 (microC)", "Distance (m)", { a: { min: -10, max: 10, step: 0.5 }, b: { min: -10, max: 10, step: 0.5 }, c: { min: 0.05, max: 2, step: 0.01 } }),
      formula: "F = kq1q2/r^2",
      outputs: [{ label: "Force magnitude", value: `${(8.99e9 * Math.abs(a * 1e-6 * b * 1e-6) / (c * c)).toExponential(2)} N` }, { label: "Interaction", value: a === 0 || b === 0 ? "No electric force" : a * b > 0 ? "Repulsion" : "Attraction" }, { label: "Field from q1", value: `${(8.99e9 * Math.abs(a * 1e-6) / (c * c)).toExponential(2)} N/C` }],
    }),
    "chemical-effects-current": () => ({
      description: "A conducting liquid lets charge flow; deposited mass increases with current and time.",
      controls: controls("Current (A)", "Time (min)", "Electrochemical factor", { a: { min: 0.1, max: 5, step: 0.1 }, b: { min: 1, max: 60, step: 1 }, c: { min: 0.1, max: 2, step: 0.1 } }),
      formula: "m proportional to It",
      outputs: [{ label: "Charge passed", value: `${(a * b * 60).toFixed(1)} C` }, { label: "Relative deposit", value: `${(a * b * c).toFixed(2)} units` }, { label: "Current path", value: "Ions in solution" }],
    }),
    "free-fall": () => {
      const impactSpeed = Math.sqrt(b * b + 2 * c * a);
      const fallTime = (impactSpeed - b) / c;
      return {
        description: "Objects in ideal free fall accelerate downward at g, independent of mass.",
        controls: controls("Height (m)", "Initial downward speed (m/s)", "g (m/s2)", { a: { min: 1, max: 500, step: 1 }, b: { min: 0, max: 50, step: 1 }, c: { min: 1, max: 20, step: 0.1 } }),
        formula: "v^2 = u^2 + 2gh, h = ut + 1/2gt^2",
        outputs: [{ label: "Impact speed", value: `${impactSpeed.toFixed(2)} m/s` }, { label: "Fall time", value: `${fallTime.toFixed(2)} s` }, { label: "Acceleration", value: `${c.toFixed(2)} m/s^2` }],
      };
    },
    "mass-and-weight": () => ({
      description: "Mass stays the same, but weight changes with gravitational field strength.",
      controls: controls("Mass (kg)", "g (m/s2)", "Spring stretch per N (mm/N)", { a: { min: 0.1, max: 100, step: 0.1 }, b: { min: 1, max: 25, step: 0.1 }, c: { min: 0.1, max: 5, step: 0.1 } }),
      formula: "W = mg",
      outputs: [{ label: "Weight", value: `${(a * b).toFixed(2)} N` }, { label: "Balance reading", value: `${a.toFixed(2)} kg` }, { label: "Spring stretch", value: `${(a * b * c).toFixed(1)} mm` }],
    }),
    "work-power": () => ({
      description: "Work measures energy transferred by force over displacement; power measures the rate of doing work.",
      controls: controls("Force (N)", "Displacement (m)", "Time (s)", { a: { min: 1, max: 500, step: 1 }, b: { min: 0.1, max: 100, step: 0.1 }, c: { min: 0.1, max: 60, step: 0.1 } }),
      formula: "W = Fs, P = W/t",
      outputs: [{ label: "Work done", value: `${(a * b).toFixed(2)} J` }, { label: "Power", value: `${((a * b) / c).toFixed(2)} W` }, { label: "Energy transfer", value: `${(a * b).toFixed(2)} J` }],
    }),
    "echo-speed-sound": () => ({
      description: "Echo time measures a round trip, so distance to the wall is half the sound travel distance.",
      controls: controls("Echo time (s)", "Temperature (C)", "Reflector distance (m)", { a: { min: 0.1, max: 5, step: 0.1 }, b: { min: -10, max: 45, step: 1 }, c: { min: 10, max: 1000, step: 10 } }),
      formula: "v approx 331 + 0.6T, d = vt/2",
      outputs: [{ label: "Speed of sound", value: `${(331 + 0.6 * b).toFixed(1)} m/s` }, { label: "Measured distance", value: `${(((331 + 0.6 * b) * a) / 2).toFixed(1)} m` }, { label: "Expected echo time", value: `${((2 * c) / (331 + 0.6 * b)).toFixed(2)} s` }],
    }),
    "mirror-formula": () => {
      const f = -Math.max(1, a);
      const u = -Math.max(1, b);
      const denominator = 1 / f - 1 / u;
      const v = nearZero(denominator) ? Number.POSITIVE_INFINITY : 1 / denominator;
      const magnification = Number.isFinite(v) ? -v / u : Number.POSITIVE_INFINITY;
      const objectCase = b < a ? "Inside focus: virtual/erect" : Math.abs(b - a) < 1 ? "At focus: image at infinity" : Math.abs(b - 2 * a) < 2 ? "At C: same size" : b > 2 * a ? "Beyond C: smaller real" : "Between F and C: enlarged real";
      return {
        description: "Concave mirror image distance and magnification change as the object crosses focus and centre of curvature.",
        controls: controls("Focal length (cm)", "Object distance (cm)", "Object height (cm)", { a: { min: 5, max: 50, step: 1 }, b: { min: 5, max: 120, step: 1 }, c: { min: 1, max: 20, step: 0.5 } }),
        formula: "1/f = 1/v + 1/u, m = -v/u",
        outputs: [{ label: "Image distance", value: formatDistance(v) }, { label: "Magnification", value: formatFinite(magnification) }, { label: "Image height", value: Number.isFinite(magnification) ? `${(magnification * c).toFixed(2)} cm` : "Very large" }, { label: "Ray case", value: objectCase }],
      };
    },
    "lens-formula": () => {
      const f = Math.max(1, a);
      const u = -Math.max(1, b);
      const denominator = 1 / f + 1 / u;
      const v = nearZero(denominator) ? Number.POSITIVE_INFINITY : 1 / denominator;
      const magnification = Number.isFinite(v) ? v / u : Number.POSITIVE_INFINITY;
      const objectCase = b < a ? "Inside focus: virtual/erect" : Math.abs(b - a) < 1 ? "At focus: image at infinity" : Math.abs(b - 2 * a) < 2 ? "At 2F: same size" : b > 2 * a ? "Beyond 2F: smaller real" : "Between F and 2F: enlarged real";
      return {
        description: "Convex lens image position depends strongly on whether the object is outside or inside the focal length.",
        controls: controls("Focal length (cm)", "Object distance (cm)", "Object height (cm)", { a: { min: 5, max: 50, step: 1 }, b: { min: 5, max: 120, step: 1 }, c: { min: 1, max: 20, step: 0.5 } }),
        formula: "1/f = 1/v - 1/u, m = v/u",
        outputs: [{ label: "Image distance", value: formatDistance(v) }, { label: "Magnification", value: formatFinite(magnification) }, { label: "Image type", value: Number.isFinite(v) ? (v > 0 ? "Real" : "Virtual") : "At infinity" }, { label: "Ray case", value: objectCase }, { label: "Power", value: `${(100 / f).toFixed(2)} D` }],
      };
    },
    "glass-slab-refraction": () => {
        const incidence = degreeToRad(a);
        const refraction = Math.asin(Math.sin(incidence) / b);
        const shift = c * Math.sin(incidence - refraction) / Math.cos(refraction);
        return {
          description: "A rectangular glass slab bends light twice, making the emergent ray parallel but laterally shifted.",
          controls: controls("Incidence angle (deg)", "Refractive index", "Thickness (cm)", { a: { min: 0, max: 75, step: 1 }, b: { min: 1, max: 2, step: 0.01 }, c: { min: 1, max: 20, step: 0.5 } }),
          formula: "sin i / sin r = n, shift = t sin(i-r)/cos r",
          outputs: [{ label: "Refraction angle", value: `${(refraction * 180 / Math.PI).toFixed(2)} deg` }, { label: "Lateral shift", value: `${shift.toFixed(2)} cm` }, { label: "Speed in slab", value: `${(3e8 / b).toExponential(2)} m/s` }, { label: "Emergent ray", value: "Parallel to incident ray" }],
        };
    },
    "prism-dispersion": () => {
      const prism = makePrismModel(a, b, c);
      const violet = prism.rays[0];
      const red = prism.rays[prism.rays.length - 1];
      return {
        description: "A prism refracts light at two faces. Violet has a larger refractive index than red, so the emergent white ray spreads into a VIBGYOR spectrum.",
        controls: controls("Prism angle A (deg)", "Mean refractive index n", "Dispersion factor", { a: { min: 20, max: 70, step: 1 }, b: { min: 1.3, max: 2.45, step: 0.01 }, c: { min: 0, max: 0.08, step: 0.001 } }),
        formula: "sin i = n sin r1, r1 + r2 = A, n sin r2 = sin e, D = i + e - A, n = sin((A + Dm)/2) / sin(A/2)",
        outputs: [
          { label: "Mean deviation", value: `${formatFinite(prism.meanDeviationDeg)} deg` },
          { label: "Minimum deviation", value: `${formatFinite(prism.minimumDeviationDeg)} deg` },
          { label: "Violet-red spread", value: `${formatFinite(prism.spreadDeg, 3)} deg` },
          { label: "Inside angles", value: `r1 ${formatFinite(prism.refraction1Deg)} deg, r2 ${formatFinite(prism.refraction2Deg)} deg` },
          { label: "Emergence angle", value: prism.tirInside ? "TIR inside prism" : `${formatFinite(prism.emergenceDeg)} deg` },
          { label: "Critical angle", value: `${formatFinite(prism.criticalAngleDeg)} deg` },
          { label: "Material match", value: prism.material.name },
          { label: "Red vs violet n", value: `${red.refractiveIndex.toFixed(4)} -> ${violet.refractiveIndex.toFixed(4)}` },
          { label: "Visible result", value: c > 0.02 ? "Clear VIBGYOR spectrum" : "Weak spread" },
        ],
      };
    },
    "ohms-law": () => ({
      description: "For an ohmic conductor, voltage is directly proportional to current and the V-I graph is a straight line.",
      controls: controls("Current (A)", "Resistance (ohm)", "Internal resistance (ohm)", { a: { min: 0, max: 5, step: 0.1 }, b: { min: 1, max: 100, step: 1 }, c: { min: 0, max: 10, step: 0.1 } }),
      formula: "V = IR, terminal V = I(R + r)",
      outputs: [{ label: "Voltage across resistor", value: `${(a * b).toFixed(2)} V` }, { label: "Supply voltage needed", value: `${(a * (b + c)).toFixed(2)} V` }, { label: "Graph slope", value: `${b.toFixed(2)} ohm` }],
    }),
    "series-parallel-resistance": () => ({
      description: "Series resistance adds directly, while parallel resistance is smaller than the smallest branch.",
      controls: controls("R1 (ohm)", "R2 (ohm)", "Voltage (V)", { a: { min: 1, max: 100, step: 1 }, b: { min: 1, max: 100, step: 1 }, c: { min: 1, max: 24, step: 0.5 } }),
      formula: "Rs = R1 + R2, Rp = R1R2/(R1+R2)",
      outputs: [{ label: "Series current", value: `${(c / (a + b)).toFixed(3)} A` }, { label: "Parallel equivalent", value: `${((a * b) / (a + b)).toFixed(2)} ohm` }, { label: "Parallel current", value: `${(c / ((a * b) / (a + b))).toFixed(3)} A` }],
    }),
    "electric-power": () => ({
      description: "Electrical energy depends on power rating and time, which connects lab circuits to home electricity bills.",
      controls: controls("Voltage (V)", "Current (A)", "Time (h)", { a: { min: 1, max: 240, step: 1 }, b: { min: 0.1, max: 10, step: 0.1 }, c: { min: 0.1, max: 24, step: 0.1 } }),
      formula: "P = VI, E = Pt",
      outputs: [{ label: "Power", value: `${(a * b).toFixed(2)} W` }, { label: "Energy", value: `${((a * b * c) / 1000).toFixed(3)} kWh` }, { label: "Heat per second", value: `${(a * b).toFixed(2)} J/s` }],
    }),
    "magnetic-field-current": () => ({
      description: "Magnetic field around a long straight wire increases with current and decreases with distance.",
      controls: controls("Current (A)", "Distance (cm)", "Turns in coil", { a: { min: 0.1, max: 20, step: 0.1 }, b: { min: 1, max: 50, step: 1 }, c: { min: 1, max: 500, step: 1 } }),
      formula: "B = mu0 I / 2pi r, coil strength proportional to NI",
      outputs: [{ label: "Wire field", value: `${((2e-7 * a) / (b / 100)).toExponential(2)} T` }, { label: "Relative coil strength", value: `${(a * c).toFixed(1)}` }, { label: "Right-hand rule", value: "Thumb=current, curl=field" }],
    }),
    "measurement-errors": () => ({
      description: "Quantify uncertainty using absolute error, percentage error, and sensible significant figures.",
      controls: controls("Measured value", "Absolute error", "Readings", { a: { min: 0.1, max: 200, step: 0.1 }, b: { min: 0.001, max: 10, step: 0.001 }, c: { min: 1, max: 20, step: 1 } }),
      formula: "percentage error = Delta x / x x 100",
      outputs: [{ label: "Percentage error", value: `${((b / a) * 100).toFixed(3)} %` }, { label: "Mean uncertainty", value: `${(b / Math.sqrt(Math.max(1, c))).toFixed(4)}` }, { label: "Suggested report", value: `${a.toFixed(b < 0.01 ? 3 : b < 0.1 ? 2 : 1)} +/- ${b.toFixed(b < 0.01 ? 3 : 2)}` }],
    }),
    "vector-resolution": () => ({
      description: "Resolve a vector into x and y components, then reconstruct its magnitude.",
      controls: controls("Magnitude", "Angle (deg)", "Scale", { a: { min: 0, max: 100, step: 1 }, b: { min: 0, max: 360, step: 1 }, c: { min: 0.1, max: 5, step: 0.1 } }),
      formula: "Ax = A cos theta, Ay = A sin theta",
      outputs: [{ label: "x-component", value: `${(a * Math.cos((b * Math.PI) / 180)).toFixed(2)}` }, { label: "y-component", value: `${(a * Math.sin((b * Math.PI) / 180)).toFixed(2)}` }, { label: "Scaled drawing length", value: `${(a * c).toFixed(2)} px units` }],
    }),
    "rotational-dynamics": () => ({
      description: "Use tau = I alpha to compare angular acceleration for different rotating bodies.",
      controls: controls("Torque (N m)", "Moment of inertia", "Time (s)", { a: { min: 0.1, max: 100, step: 0.1 }, b: { min: 0.1, max: 50, step: 0.1 }, c: { min: 0.1, max: 20, step: 0.1 } }),
      formula: "alpha = tau / I, omega = alpha t",
      outputs: [{ label: "Angular acceleration", value: `${(a / b).toFixed(3)} rad/s^2` }, { label: "Angular speed", value: `${((a / b) * c).toFixed(3)} rad/s` }, { label: "Angular displacement", value: `${(0.5 * (a / b) * c * c).toFixed(3)} rad` }],
    }),
    "satellite-orbit": () => {
      const earthMu = 3.986e14;
      const radius = Math.max(1, b) * 1e6;
      const mu = earthMu * Math.max(0.1, a);
      const orbital = Math.sqrt(mu / radius);
      return {
        description: "Compare circular orbital speed, escape speed, and orbital period for a satellite.",
        controls: controls("Planet mass factor", "Orbital radius (10^6 m)", "Satellite mass (kg)", { a: { min: 0.1, max: 10, step: 0.1 }, b: { min: 1, max: 50, step: 0.1 }, c: { min: 1, max: 5000, step: 10 } }),
        formula: "vo = sqrt(GM/r), ve = sqrt(2GM/r)",
        outputs: [{ label: "Orbital speed", value: `${(orbital / 1000).toFixed(2)} km/s` }, { label: "Escape speed", value: `${((Math.sqrt(2) * orbital) / 1000).toFixed(2)} km/s` }, { label: "Orbital period", value: `${((2 * Math.PI * radius) / orbital / 3600).toFixed(2)} h` }],
      };
    },
    "bernoulli-fluid-flow": () => ({
      description: "Estimate dynamic pressure and static pressure left after speed and height terms.",
      controls: controls("Density (kg/m3)", "Speed (m/s)", "Height (m)", { a: { min: 500, max: 1400, step: 10 }, b: { min: 0, max: 50, step: 0.5 }, c: { min: 0, max: 20, step: 0.1 } }),
      formula: "P + 1/2 rho v^2 + rho gh = constant",
      outputs: [{ label: "Dynamic pressure", value: `${(0.5 * a * b * b / 1000).toFixed(2)} kPa` }, { label: "Height pressure", value: `${(a * g * c / 1000).toFixed(2)} kPa` }, { label: "Energy demand", value: `${((0.5 * a * b * b + a * g * c) / 1000).toFixed(2)} kPa` }],
    }),
    "gas-laws": () => ({
      description: "Connect moles, absolute temperature, volume, and pressure with PV = nRT.",
      controls: controls("Moles", "Temperature (K)", "Volume (m3)", { a: { min: 0.1, max: 10, step: 0.1 }, b: { min: 100, max: 800, step: 10 }, c: { min: 0.1, max: 10, step: 0.1 } }),
      formula: "P = nRT / V",
      outputs: [{ label: "Pressure", value: `${((a * 8.314 * b) / c / 1000).toFixed(2)} kPa` }, { label: "PV/T", value: `${(((a * 8.314 * b) / c) * c / b).toFixed(2)} J/K` }, { label: "Molecular trend", value: b > 400 ? "Fast particles" : "Slower particles" }],
    }),
    "thermodynamic-process": () => ({
      description: "Compare work in a gas process using pressure and volume change.",
      controls: controls("Pressure (kPa)", "Delta volume (L)", "Process factor", { a: { min: 10, max: 500, step: 10 }, b: { min: -20, max: 20, step: 0.5 }, c: { min: 0, max: 1.5, step: 0.1 } }),
      formula: "W = P ΔV x process factor, with 1 kPa L = 1 J",
      outputs: [{ label: "Work by gas", value: `${(a * b * c).toFixed(2)} J` }, { label: "Isochoric comparison", value: "0 J if Delta V = 0" }, { label: "Gas does work?", value: b > 0 ? "Expansion" : "Compression/on gas" }],
    }),
    "shm-spring": () => ({
      description: "Spring-mass SHM period depends on mass and spring constant; max speed depends on amplitude.",
      controls: controls("k (N/m)", "Mass (kg)", "Amplitude (m)", { a: { min: 1, max: 200, step: 1 }, b: { min: 0.1, max: 20, step: 0.1 }, c: { min: 0.01, max: 2, step: 0.01 } }),
      formula: "T = 2pi sqrt(m/k), vmax = omega A",
      outputs: [{ label: "Period", value: `${(2 * Math.PI * Math.sqrt(b / a)).toFixed(3)} s` }, { label: "Angular frequency", value: `${Math.sqrt(a / b).toFixed(3)} rad/s` }, { label: "Max speed", value: `${(Math.sqrt(a / b) * c).toFixed(3)} m/s` }],
    }),
    "electrostatic-field-potential": () => ({
      description: "Compare inverse-square electric field with inverse-distance electric potential.",
      controls: controls("Charge (microC)", "Distance (m)", "Test charge (microC)", { a: { min: -20, max: 20, step: 0.5 }, b: { min: 0.05, max: 5, step: 0.01 }, c: { min: -10, max: 10, step: 0.5 } }),
      formula: "E = kq/r^2, V = kq/r",
      outputs: [{ label: "Electric field", value: `${(8.99e9 * Math.abs(a * 1e-6) / (b * b)).toExponential(2)} N/C` }, { label: "Potential", value: `${(8.99e9 * a * 1e-6 / b).toExponential(2)} V` }, { label: "Force on test charge", value: `${(8.99e9 * Math.abs(a * 1e-6 * c * 1e-6) / (b * b)).toExponential(2)} N` }],
    }),
    "capacitor-lab": () => ({
      description: "Estimate capacitor charge, stored energy, and two-capacitor equivalents.",
      controls: controls("C1 (microF)", "Voltage (V)", "C2 (microF)", { a: { min: 0.1, max: 1000, step: 0.1 }, b: { min: 0, max: 500, step: 1 }, c: { min: 0.1, max: 1000, step: 0.1 } }),
      formula: "Q = CV, U = 1/2 CV^2",
      outputs: [{ label: "Charge on C1", value: `${(a * b).toFixed(2)} microC` }, { label: "Energy", value: `${(0.5 * a * 1e-6 * b * b).toFixed(4)} J` }, { label: "Parallel equivalent", value: `${(a + c).toFixed(2)} microF` }],
    }),
    "kirchhoff-circuit": () => ({
      description: "Analyse a simple two-branch circuit using junction and loop ideas.",
      controls: controls("Voltage (V)", "R1 (ohm)", "R2 (ohm)", { a: { min: 1, max: 240, step: 1 }, b: { min: 1, max: 200, step: 1 }, c: { min: 1, max: 200, step: 1 } }),
      formula: "I1 = V/R1, I2 = V/R2, Itotal = I1 + I2",
      outputs: [{ label: "Branch I1", value: `${(a / b).toFixed(3)} A` }, { label: "Branch I2", value: `${(a / c).toFixed(3)} A` }, { label: "Total current", value: `${(a / b + a / c).toFixed(3)} A` }],
    }),
    "lorentz-force": () => ({
      description: "Calculate magnetic force and circular path radius for a charge moving perpendicular to B.",
      controls: controls("Charge (microC)", "Speed (10^5 m/s)", "B (T)", { a: { min: 0.1, max: 20, step: 0.1 }, b: { min: 0.1, max: 50, step: 0.1 }, c: { min: 0.01, max: 5, step: 0.01 } }),
      formula: "F = |q|vB, r = mv/(|q|B)",
      outputs: [{ label: "Magnetic force", value: `${(Math.abs(a) * 1e-6 * b * 1e5 * c).toExponential(2)} N` }, { label: "Direction", value: "Use Fleming/right-hand rule" }, { label: "Path radius (proton mass)", value: `${((1.67e-27 * b * 1e5) / (Math.abs(a) * 1e-6 * c)).toExponential(2)} m` }],
    }),
    "emi-faraday": () => ({
      description: "Induced emf grows with coil turns and rate of magnetic flux change.",
      controls: controls("Turns", "Flux change (mWb)", "Time (ms)", { a: { min: 1, max: 1000, step: 1 }, b: { min: 0.1, max: 100, step: 0.1 }, c: { min: 1, max: 1000, step: 1 } }),
      formula: "|emf| = N|DeltaPhi| / Deltat",
      outputs: [{ label: "Induced emf", value: `${(a * b * 1e-3 / (c * 1e-3)).toFixed(2)} V` }, { label: "Lenz response", value: "Opposes flux change" }, { label: "Fast motion effect", value: c < 100 ? "Large emf" : "Smaller emf" }],
    }),
    "ac-lcr-resonance": () => {
      const inductance = 0.1;
      const capacitance = c * 1e-6;
      const xl = 2 * Math.PI * b * inductance;
      const xc = 1 / (2 * Math.PI * b * capacitance);
      const z = Math.sqrt(a * a + (xl - xc) ** 2);
      const resonance = 1 / (2 * Math.PI * Math.sqrt(inductance * capacitance));
      return {
        description: "Explore impedance and current near series LCR resonance with a fixed 0.10 H inductor.",
        controls: controls("Resistance (ohm)", "Frequency (Hz)", "Capacitance (microF)", { a: { min: 1, max: 500, step: 1 }, b: { min: 1, max: 1000, step: 1 }, c: { min: 0.1, max: 100, step: 0.1 } }),
        formula: "Z = sqrt(R^2 + (XL - XC)^2)",
        outputs: [{ label: "XL", value: `${xl.toFixed(2)} ohm` }, { label: "XC", value: `${xc.toFixed(2)} ohm` }, { label: "Current at 12 V", value: `${(12 / z).toFixed(4)} A` }, { label: "Resonant frequency", value: `${resonance.toFixed(1)} Hz` }],
      };
    },
    "em-spectrum": () => {
      const frequency = a * 1e12;
      const wavelength = 3e8 / frequency;
      const energyEv = 4.136e-15 * frequency;
      const band = a < 0.3 ? "Radio/microwave" : a < 400 ? "Infrared" : a < 790 ? "Visible" : "UV/X-ray range";
      return {
        description: "Relate frequency, wavelength, photon energy, and EM spectrum region.",
        controls: controls("Frequency (THz)", "Display scale", "Intensity", { a: { min: 0.001, max: 3000, step: 1 }, b: { min: 0.1, max: 10, step: 0.1 }, c: { min: 0, max: 1, step: 0.01 } }),
        formula: "c = f lambda, E = hf",
        outputs: [{ label: "Wavelength", value: `${wavelength.toExponential(2)} m` }, { label: "Photon energy", value: `${energyEv.toFixed(3)} eV` }, { label: "Band", value: band }, { label: "Visible?", value: a >= 400 && a <= 790 ? "Inside visible window" : "Outside visible window" }],
      };
    },
    "young-double-slit": () => {
      const beta = (a * 1e-9 * b) / (c * 1e-3) * 1000;
      return {
        description: "Calculate fringe width for double-slit interference.",
        controls: controls("Wavelength (nm)", "Screen distance (m)", "Slit separation (mm)", { a: { min: 380, max: 700, step: 1 }, b: { min: 0.1, max: 5, step: 0.1 }, c: { min: 0.01, max: 2, step: 0.01 } }),
        formula: "beta = lambda D / d, bright: path difference = m lambda",
        outputs: [{ label: "Fringe width", value: `${beta.toFixed(3)} mm` }, { label: "5-fringe span", value: `${(5 * beta).toFixed(3)} mm` }, { label: "Path condition", value: "Bright when Delta = m lambda" }, { label: "Pattern trend", value: c < 0.2 ? "Wide fringes" : "Narrower fringes" }],
      };
    },
    "single-slit-diffraction": () => {
      const aperture = Math.max(0.001, c * 1e-3);
      const theta = Math.asin(clampNumber((a * 1e-9) / aperture, 0, 0.99));
      const centralWidth = 2 * b * Math.tan(theta) * 1000;
      return {
        description: "Single-slit diffraction spreads light; the central maximum becomes wider when the aperture is narrower.",
        controls: controls("Wavelength (nm)", "Screen distance (m)", "Slit width (mm)", { a: { min: 380, max: 700, step: 1 }, b: { min: 0.1, max: 5, step: 0.1 }, c: { min: 0.01, max: 2, step: 0.01 } }),
        formula: "a sin theta = m lambda, central width approx 2D lambda/a",
        outputs: [{ label: "First minimum angle", value: `${(theta * 180 / Math.PI).toFixed(3)} deg` }, { label: "Central max width", value: `${centralWidth.toFixed(3)} mm` }, { label: "Aperture effect", value: c < 0.2 ? "Wide diffraction" : "Narrower spread" }],
      };
    },
    "photoelectric-equation": () => ({
      description: "Compare photon energy with work function and find maximum kinetic energy.",
      controls: controls("Photon energy (eV)", "Work function (eV)", "Intensity", { a: { min: 0.5, max: 10, step: 0.1 }, b: { min: 0.5, max: 6, step: 0.1 }, c: { min: 0, max: 1, step: 0.01 } }),
      formula: "Kmax = hf - phi, Vs = Kmax/e",
      outputs: [{ label: "Kmax", value: `${Math.max(0, a - b).toFixed(2)} eV` }, { label: "Stopping potential", value: `${Math.max(0, a - b).toFixed(2)} V` }, { label: "Emission?", value: a > b && c > 0 ? "Yes" : "No" }],
    }),
    "nuclear-decay": () => ({
      description: "Model remaining undecayed nuclei after a chosen elapsed time.",
      controls: controls("Initial nuclei", "Half-life", "Elapsed time", { a: { min: 100, max: 100000, step: 100 }, b: { min: 1, max: 100, step: 1 }, c: { min: 0, max: 500, step: 1 } }),
      formula: "N = N0(1/2)^(t/T)",
      outputs: [{ label: "Remaining nuclei", value: `${(a * 0.5 ** (c / b)).toFixed(0)}` }, { label: "Decayed nuclei", value: `${(a - a * 0.5 ** (c / b)).toFixed(0)}` }, { label: "Remaining fraction", value: `${(100 * 0.5 ** (c / b)).toFixed(2)} %` }],
    }),
    "semiconductor-diode": () => ({
      description: "Estimate forward diode current and half-wave rectifier output.",
      controls: controls("Input voltage (V)", "Diode drop (V)", "Load (ohm)", { a: { min: -20, max: 20, step: 0.1 }, b: { min: 0.1, max: 1, step: 0.01 }, c: { min: 10, max: 10000, step: 10 } }),
      formula: "I = max(0, Vin - Vd) / R",
      outputs: [{ label: "Forward current", value: `${(Math.max(0, a - b) / c * 1000).toFixed(3)} mA` }, { label: "Output voltage", value: `${Math.max(0, a - b).toFixed(2)} V` }, { label: "Bias state", value: a > b ? "Forward conducting" : a >= 0 ? "Forward biased below threshold" : "Reverse biased" }],
    }),
    "shadows-eclipses": () => {
      const sourceSize = a;
      const objectDistance = b;
      const screenDistance = Math.max(objectDistance + 1, c);
      const objectSize = 2;
      const magnification = screenDistance / objectDistance;
      const penumbra = objectSize * magnification + sourceSize * Math.max(0, screenDistance - objectDistance) / objectDistance;
      const umbra = Math.max(0, objectSize * magnification - sourceSize * Math.max(0, screenDistance - objectDistance) / objectDistance);
      return {
        description: "Move source, object, and screen to see when shadows become sharp or fuzzy.",
        controls: controls("Source size (cm)", "Object distance (cm)", "Screen distance (cm)", { a: { min: 0.1, max: 20, step: 0.1 }, b: { min: 5, max: 100, step: 1 }, c: { min: 10, max: 160, step: 1 } }),
        formula: "shadow edges follow similar triangles, object size assumed 2 cm",
        outputs: [{ label: "Umbra width trend", value: `${umbra.toFixed(2)} cm` }, { label: "Penumbra width", value: `${penumbra.toFixed(2)} cm` }, { label: "Shadow edge", value: sourceSize < 2 ? "Sharp" : "Soft penumbra" }],
      };
    },
    "multiple-reflection": () => {
      const angle = Math.max(1, a);
      const ratio = 360 / angle;
      const images = roundIfInteger(ratio) ? Math.round(ratio) - 1 : Math.floor(ratio);
      return {
        description: "Set the angle between two plane mirrors and predict repeated images.",
        controls: controls("Mirror angle (deg)", "Object distance (cm)", "Object offset (cm)", { a: { min: 15, max: 180, step: 1 }, b: { min: 1, max: 50, step: 1 }, c: { min: 0, max: 20, step: 0.5 } }),
        formula: "n = 360/theta - 1 when 360/theta is an integer",
        outputs: [{ label: "360/theta", value: ratio.toFixed(2) }, { label: "Image count", value: `${images.toFixed(0)}` }, { label: "Pattern", value: angle <= 60 ? "Kaleidoscope-rich" : "Few images" }],
      };
    },
    "sound-wave-anatomy": () => ({
      description: "See how frequency and amplitude shape compressions, rarefactions, and wavelength.",
      controls: controls("Frequency (Hz)", "Amplitude", "Sound speed (m/s)", { a: { min: 20, max: 2000, step: 10 }, b: { min: 0.1, max: 2, step: 0.1 }, c: { min: 300, max: 380, step: 1 } }),
      formula: "v = f lambda",
      outputs: [{ label: "Wavelength", value: `${(c / a).toFixed(3)} m` }, { label: "Particle motion", value: "Back and forth" }, { label: "Intensity trend", value: `${(b * b).toFixed(2)} relative` }],
    }),
    "human-eye-defects": () => {
      const defectIndex = Math.round(c);
      const focalError = a - b;
      const focusM = Math.max(0.01, a / 100);
      const retinaM = Math.max(0.01, b / 100);
      const correction = defectIndex === 0 ? 0 : (1 / retinaM) - (1 / focusM);
      return {
        description: "Adjust eye focus and correction lens power until the image falls on the retina.",
        controls: controls("Eye focus distance (cm)", "Retina distance (cm)", "Defect mode", { a: { min: 1, max: 5, step: 0.1 }, b: { min: 1.5, max: 3.5, step: 0.1 }, c: { min: 0, max: 2, step: 1 } }),
        formula: "P = 1/f, correction trend = 1/d_retina - 1/d_focus",
        outputs: [{ label: "Defect", value: defectIndex === 0 ? "Normal" : defectIndex === 1 ? "Myopia" : "Hypermetropia" }, { label: "Focus error", value: `${focalError.toFixed(2)} cm` }, { label: "Lens type", value: defectIndex === 1 ? "Concave" : defectIndex === 2 ? "Convex" : "None" }, { label: "Power trend", value: `${correction.toFixed(3)} D` }],
      };
    },
    "sources-of-energy": () => {
      const useful = a * (b / 100);
      const impact = useful === 0 ? 0 : (100 - b) * (1 + c / 10);
      return {
        description: "Compare how input energy, efficiency, and impact factor change useful output.",
        controls: controls("Input energy (MJ)", "Efficiency (%)", "Impact factor", { a: { min: 1, max: 1000, step: 1 }, b: { min: 5, max: 95, step: 1 }, c: { min: 0, max: 10, step: 0.5 } }),
        formula: "Euseful = efficiency x Einput",
        outputs: [{ label: "Useful energy", value: `${useful.toFixed(2)} MJ` }, { label: "Lost energy", value: `${(a - useful).toFixed(2)} MJ` }, { label: "Impact score", value: `${impact.toFixed(1)}` }],
      };
    },
    "meter-bridge": () => {
      const length = clampNumber(b, 1, 99);
      const unknown = a * (100 - length) / length;
      return {
        description: "Use a null balance to calculate unknown resistance from bridge-wire length.",
        controls: controls("Known R (ohm)", "Balance length (cm)", "Contact error (cm)", { a: { min: 1, max: 1000, step: 1 }, b: { min: 1, max: 99, step: 1 }, c: { min: -2, max: 2, step: 0.1 } }),
        formula: "R/X = l/(100-l)",
        outputs: [{ label: "Unknown X", value: `${unknown.toFixed(2)} ohm` }, { label: "Corrected length", value: `${clampNumber(length + c, 1, 99).toFixed(1)} cm` }, { label: "Best zone", value: length > 35 && length < 65 ? "Good balance" : "High error risk" }],
      };
    },
    "internal-resistance-cell": () => {
      const current = a / (b + c);
      const terminal = current * b;
      return {
        description: "A real cell loses voltage inside itself when it delivers current to a load.",
        controls: controls("EMF (V)", "External R (ohm)", "Internal r (ohm)", { a: { min: 0.5, max: 24, step: 0.1 }, b: { min: 1, max: 200, step: 1 }, c: { min: 0, max: 20, step: 0.1 } }),
        formula: "I = E/(R+r), V = E - Ir",
        outputs: [{ label: "Current", value: `${current.toFixed(3)} A` }, { label: "Terminal voltage", value: `${terminal.toFixed(2)} V` }, { label: "Lost voltage", value: `${(a - terminal).toFixed(2)} V` }],
      };
    },
    "ac-generator": () => {
      const omega = 2 * Math.PI * c;
      const peak = a * b * 0.01 * omega;
      return {
        description: "Rotate a coil in a magnetic field and watch the induced emf become sinusoidal.",
        controls: controls("Turns", "Magnetic field (T)", "Frequency (Hz)", { a: { min: 1, max: 500, step: 1 }, b: { min: 0.01, max: 2, step: 0.01 }, c: { min: 1, max: 100, step: 1 } }),
        formula: "E0 = NBA omega",
        outputs: [{ label: "Peak emf", value: `${peak.toFixed(2)} V` }, { label: "RMS emf", value: `${(peak / Math.sqrt(2)).toFixed(2)} V` }, { label: "Waveform", value: "Alternating sine" }],
      };
    },
    "transformer-lab": () => {
      const secondary = a * c / b;
      return {
        description: "Compare turns ratio, secondary voltage, and useful output with transformer efficiency.",
        controls: controls("Primary voltage (V)", "Primary turns", "Secondary turns", { a: { min: 1, max: 240, step: 1 }, b: { min: 10, max: 1000, step: 10 }, c: { min: 10, max: 2000, step: 10 } }),
        formula: "Vs/Vp = Ns/Np",
        outputs: [{ label: "Secondary voltage", value: `${secondary.toFixed(2)} V` }, { label: "Type", value: c > b ? "Step-up" : c < b ? "Step-down" : "Isolation" }, { label: "Turns ratio", value: `${(c / b).toFixed(2)}` }],
      };
    },
    "total-internal-reflection": () => {
      const n1 = Math.max(a, b + 0.01);
      const n2 = Math.max(1, b);
      const critical = Math.asin(n2 / n1) * 180 / Math.PI;
      return {
        description: "Find the critical angle and decide if the ray refracts or totally reflects.",
        controls: controls("n1 denser medium", "n2 rarer medium", "Incidence angle (deg)", { a: { min: 1.01, max: 2.5, step: 0.01 }, b: { min: 1, max: 1.8, step: 0.01 }, c: { min: 0, max: 89, step: 1 } }),
        formula: "sin C = n2/n1",
        outputs: [{ label: "Critical angle", value: `${critical.toFixed(2)} deg` }, { label: "Ray result", value: c > critical ? "Total internal reflection" : "Refraction" }, { label: "Condition", value: n1 > n2 ? "Denser to rarer" : "No TIR" }],
      };
    },
    "optical-instruments": () => {
      const magnification = a / b;
      return {
        description: "Compare objective and eyepiece focal lengths for telescope-style magnification.",
        controls: controls("Objective f (cm)", "Eyepiece f (cm)", "Mode", { a: { min: 5, max: 200, step: 1 }, b: { min: 1, max: 50, step: 1 }, c: { min: 0, max: 1, step: 1 } }),
        formula: "Telescope M = fo/fe",
        outputs: [{ label: "Magnification", value: `${magnification.toFixed(2)} x` }, { label: "Tube length", value: `${(a + b).toFixed(1)} cm` }, { label: "Mode", value: c < 0.5 ? "Telescope" : "Microscope comparison" }],
      };
    },
    "polarization-lab": () => {
      const intensity = a * Math.cos((b * Math.PI) / 180) ** 2 * c;
      return {
        description: "Rotate the analyzer and verify that transmitted intensity follows Malus' law.",
        controls: controls("Initial intensity", "Analyzer angle (deg)", "Polarizer efficiency", { a: { min: 0, max: 100, step: 1 }, b: { min: 0, max: 180, step: 1 }, c: { min: 0, max: 1, step: 0.01 } }),
        formula: "I = I0 cos^2(theta)",
        outputs: [{ label: "Transmitted intensity", value: `${intensity.toFixed(2)}` }, { label: "Percent", value: `${(intensity / Math.max(1, a) * 100).toFixed(1)} %` }, { label: "State", value: Math.abs(b - 90) < 5 ? "Near extinction" : "Transmitting" }],
      };
    },
    "de-broglie-wavelength": () => {
      const massFactor = Math.max(1, b);
      const lambdaNm = 1.226 / Math.sqrt(Math.max(1, a) * massFactor);
      return {
        description: "Raise electron accelerating voltage and watch matter wavelength shrink.",
        controls: controls("Electron voltage (V)", "Particle mass factor", "Display scale", { a: { min: 1, max: 5000, step: 1 }, b: { min: 1, max: 2000, step: 1 }, c: { min: 0.1, max: 10, step: 0.1 } }),
        formula: "lambda = h/p, lambda(nm) approx 1.226/sqrt(V x mass factor)",
        outputs: [{ label: "Electron wavelength", value: `${lambdaNm.toFixed(4)} nm` }, { label: "Diffraction spread", value: lambdaNm * c > 0.2 ? "Wide" : "Narrow" }, { label: "Trend", value: "Voltage up, lambda down" }],
      };
    },
    "bohr-model": () => {
      const n1 = Math.max(1, Math.round(a));
      const n2 = Math.max(1, Math.round(b));
      const e1 = -13.6 / (n1 * n1);
      const e2 = -13.6 / (n2 * n2);
      const photon = Math.abs(e2 - e1);
      return {
        description: "Jump between hydrogen energy levels and identify emitted or absorbed photon energy.",
        controls: controls("Initial n", "Final n", "Intensity", { a: { min: 1, max: 6, step: 1 }, b: { min: 1, max: 6, step: 1 }, c: { min: 0, max: 1, step: 0.01 } }),
        formula: "En = -13.6/n^2 eV",
        outputs: [{ label: "Photon energy", value: `${photon.toFixed(3)} eV` }, { label: "Process", value: n2 < n1 ? "Emission" : n2 > n1 ? "Absorption" : "No transition" }, { label: "Final energy", value: `${e2.toFixed(3)} eV` }],
      };
    },
    "logic-gates": () => {
      const inputA = a >= 0.5 ? 1 : 0;
      const inputB = b >= 0.5 ? 1 : 0;
      const gates = ["AND", "OR", "NAND", "NOR", "NOT A"];
      const gate = gates[Math.round(c)] ?? "AND";
      const output = gate === "AND" ? inputA & inputB : gate === "OR" ? inputA | inputB : gate === "NAND" ? Number(!(inputA & inputB)) : gate === "NOR" ? Number(!(inputA | inputB)) : Number(!inputA);
      return {
        description: "Toggle digital inputs and complete truth tables for core semiconductor logic gates.",
        controls: controls("Input A", "Input B", "Gate selector", { a: { min: 0, max: 1, step: 1 }, b: { min: 0, max: 1, step: 1 }, c: { min: 0, max: 4, step: 1 } }),
        formula: "Binary logic truth table",
        outputs: [{ label: "Gate", value: gate }, { label: "Inputs", value: `${inputA}, ${inputB}` }, { label: "Output", value: `${output}` }],
      };
    },
  };
  return (calculators[id] ?? calculators["uniform-motion"])();
}
