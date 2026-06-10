import { useEffect, useRef, useState } from "react";
import { BottomPanel } from "../components/BottomPanel";
import { LeftSidebar } from "../components/LeftSidebar";
import { PhysicsCanvas } from "../components/PhysicsCanvas";
import { PropertiesPanel } from "../components/PropertiesPanel";
import { Toolbar } from "../components/Toolbar";
import { solveCircuit, isCircuitLike } from "../lib/circuitSolver";
import { deserializeState } from "../lib/stateSerializer";
import { useLabStore } from "../store/useLabStore";
import { sendStatement } from "../lib/xapi";
import { GuidePanel } from "../components/GuidePanel";
import { workspaceGuide } from "../lib/guides";
import { PhysicsIcon } from "../lib/icons";
import {
  loadExperimentState,
  saveExperimentState,
  deleteExperimentState,
  type ExperimentSnapshot,
} from "../lib/offlineDB";

export function WorkspacePage({ mode }: { mode: "guided" | "sandbox" }) {
  const loadedRef = useRef(false);
  const saveTimerRef = useRef<number>();
  const [onboardingStep, setOnboardingStep] = useState(() =>
    Number(localStorage.getItem("physicslab_onboarding_done") ? 4 : 0),
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [hasSave, setHasSave] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareObjects, setCompareObjects] = useState<ReturnType<typeof useLabStore.getState>["objects"]>([]);
  const graphSplit = useLabStore((state) => state.graphSplit);
  const running = useLabStore((state) => state.running);
  const timeScale = useLabStore((state) => state.timeScale);
  const liveObjects = useLabStore((state) => state.objects);
  const params = new URLSearchParams(window.location.search);
  const embedded = params.get("embed") === "1" || window.parent !== window;
  const experimentName = params.get("experiment") ?? (mode === "sandbox" ? "sandbox" : "lab");

  // Load saved state on mount (URL params take priority over IndexedDB)
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    sendStatement("attempted", `/lab/${experimentName}`);
    const encoded = new URLSearchParams(window.location.search).get("lab");
    if (encoded) {
      deserializeState(encoded)
        .then(({ objects, settings }) => {
          useLabStore.setState({
            objects,
            gravity: settings.gravity,
            timeScale: settings.timeScale,
            airResistance: settings.airResistance,
            showGrid: settings.showGrid,
            showVectors: settings.showVectors,
            running: false,
            selectedId: undefined,
          });
          const url = new URL(window.location.href);
          url.searchParams.delete("lab");
          window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
        })
        .catch(() => {
          const url = new URL(window.location.href);
          url.searchParams.delete("lab");
          window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
        });
      return;
    }
    // Restore from IndexedDB if available
    loadExperimentState(experimentName)
      .then((snap) => {
        if (!snap) return;
        useLabStore.setState({
          objects: snap.objects,
          gravity: snap.settings.gravity,
          timeScale: snap.settings.timeScale,
          airResistance: snap.settings.airResistance,
          showGrid: snap.settings.showGrid,
          showVectors: snap.settings.showVectors,
          observationRows: snap.observationRows,
          graphTraces: snap.graphTraces,
          running: false,
          selectedId: undefined,
        });
        setHasSave(true);
        setSavedAt(snap.savedAt);
      })
      .catch(() => {});
  }, []);

  // Auto-save to IndexedDB on any paused-state change
  useEffect(() => {
    const unsubscribe = useLabStore.subscribe((state) => {
      if (state.running) return;
      window.clearTimeout(saveTimerRef.current);
      setSaveStatus("saving");
      saveTimerRef.current = window.setTimeout(() => {
        const s = useLabStore.getState();
        const snapshot: ExperimentSnapshot = {
          key: experimentName,
          savedAt: new Date().toISOString(),
          objects: s.objects,
          settings: {
            gravity: s.gravity,
            timeScale: s.timeScale,
            airResistance: s.airResistance,
            showGrid: s.showGrid,
            showVectors: s.showVectors,
          },
          observationRows: s.observationRows,
          graphTraces: s.graphTraces,
        };
        saveExperimentState(snapshot)
          .then(() => {
            setHasSave(true);
            setSavedAt(snapshot.savedAt);
            setSaveStatus("saved");
            window.setTimeout(() => setSaveStatus("idle"), 3000);
          })
          .catch(() => setSaveStatus("idle"));
      }, 1500);
    });
    return () => {
      unsubscribe();
      window.clearTimeout(saveTimerRef.current);
    };
  }, [experimentName]);

  const restoreSaved = () => {
    loadExperimentState(experimentName)
      .then((snap) => {
        if (!snap) return;
        useLabStore.setState({
          objects: snap.objects,
          gravity: snap.settings.gravity,
          timeScale: snap.settings.timeScale,
          airResistance: snap.settings.airResistance,
          showGrid: snap.settings.showGrid,
          showVectors: snap.settings.showVectors,
          observationRows: snap.observationRows,
          graphTraces: snap.graphTraces,
          graphData: [],
          simulationTime: 0,
          running: false,
          selectedId: undefined,
        });
      })
      .catch(() => {});
  };

  const resetToDefaults = () => {
    deleteExperimentState(experimentName).catch(() => {});
    useLabStore.getState().resetSandbox();
    setHasSave(false);
    setSavedAt(null);
    setSaveStatus("idle");
  };

  useEffect(() => {
    if (onboardingStep >= 4) return;
    const unsubscribe = useLabStore.subscribe((state) => {
      if (onboardingStep === 0 && state.objects.some((object) => object.kind === "ball"))
        setOnboardingStep(1);
      if (onboardingStep === 1 && state.running) setOnboardingStep(2);
      if (onboardingStep === 2 && state.simulationTime > 2) setOnboardingStep(3);
    });
    return unsubscribe;
  }, [onboardingStep]);

  const completeOnboarding = () => {
    localStorage.setItem("physicslab_onboarding_done", "true");
    setOnboardingStep(4);
  };

  const submit = () => {
    const answers = useLabStore.getState().observationRows;
    const score = answers.length ? 100 : 70;
    sendStatement("completed", `/lab/${experimentName}`, {
      score: { raw: score, scaled: score / 100 },
    });
    if (score >= 70)
      sendStatement("passed", `/lab/${experimentName}`, {
        score: { raw: score, scaled: score / 100 },
        success: true,
      });
    window.parent?.postMessage({ type: "physicslab_submit", score, answers }, "*");
  };

  const toggleCompareMode = () => {
    if (compareMode) {
      setCompareMode(false);
      return;
    }
    const snapshot = useLabStore.getState().objects.map((object) => ({ ...object, trail: [...object.trail] }));
    setCompareObjects(snapshot);
    setCompareMode(true);
  };

  useEffect(() => {
    let timer: number | undefined;
    let lastSignature = "";
    const run = () => {
      const state = useLabStore.getState();
      const signature = circuitSignature(state.objects);
      if (signature === lastSignature) return;
      lastSignature = signature;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const latest = useLabStore.getState();
        const results = solveCircuit(latest.objects);
        useLabStore.setState({
          objects: latest.objects.map((object) => {
            const result = results[object.id];
            if (!result) return object;
            const brightness =
              object.kind === "bulb"
                ? Math.min(
                    1,
                    Math.abs((result.current ** 2 * (object.resistance ?? 1)) / 10),
                  )
                : object.brightness;
            return { ...object, current: result.current, voltage: result.voltage, voltageDiff: result.voltage, brightness };
          }),
        });
      }, 50);
    };
    const unsubscribe = useLabStore.subscribe(run);
    run();
    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {embedded ? (
        <header className="flex min-h-12 items-center gap-3 border-b border-slate-300/60 bg-white/80 px-3 dark:border-lab-line dark:bg-slate-950/70">
          <div className="font-bold text-cyan-500">PhysicsLab 100: {experimentName}</div>
          <button className="tool-btn-primary ml-auto" onClick={submit}>
            Submit
          </button>
        </header>
      ) : (
        <Toolbar />
      )}
      <div className="relative grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 lg:grid-cols-[280px_minmax(0,1fr)]">
        {onboardingStep < 4 && (
          <Onboarding step={onboardingStep} onDone={completeOnboarding} />
        )}
        <LeftSidebar />
        <main
          className={
            graphSplit
              ? "grid min-h-0 grid-cols-[minmax(0,0.6fr)_minmax(340px,0.4fr)] gap-3 transition-all duration-300"
              : "grid min-h-0 grid-rows-[minmax(360px,1fr)_270px] gap-3 transition-all duration-300"
          }
        >
          <section className="panel relative min-h-0 p-2">
            <FloatingCanvasToolbar
              running={running}
              timeScale={timeScale}
              hasSave={hasSave}
              savedAt={savedAt}
              saveStatus={saveStatus}
              compareMode={compareMode}
              onToggleCompare={toggleCompareMode}
              onRestoreSaved={restoreSaved}
              onResetDefaults={resetToDefaults}
            />
            <div className="mb-2 flex items-center justify-between px-2">
              <h1 className="panel-title text-gradient">
                {mode === "sandbox" ? "Free Sandbox" : "Guided Lab Workspace"}
              </h1>
              <div className="flex gap-2 text-xs">
                <span className="badge">Matter.js</span>
                <span className="badge">SI Units</span>
                <span className="badge">Vectors</span>
              </div>
            </div>
            <div className="mb-2 px-2">
              <GuidePanel guide={workspaceGuide} compact />
            </div>
            {compareMode ? (
              <div className="compare-workspace">
                <div className="compare-pane">
                  <div className="compare-pane-badge">A live setup</div>
                  <PhysicsCanvas />
                </div>
                <div className="compare-divider">
                  <CompareDiff baseline={compareObjects} current={liveObjects} />
                </div>
                <div className="compare-pane compare-pane-frozen">
                  <div className="compare-pane-badge">B captured baseline</div>
                  <CompareCanvasSnapshot objects={compareObjects} />
                </div>
              </div>
            ) : (
              <PhysicsCanvas />
            )}
          </section>
          <BottomPanel />
        </main>
        <PropertiesPanel />
      </div>
    </div>
  );
}

function timeSince(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

function FloatingCanvasToolbar({
  running,
  timeScale,
  hasSave,
  savedAt,
  saveStatus,
  compareMode,
  onToggleCompare,
  onRestoreSaved,
  onResetDefaults,
}: {
  running: boolean;
  timeScale: number;
  hasSave: boolean;
  savedAt: string | null;
  saveStatus: "idle" | "saving" | "saved";
  compareMode: boolean;
  onToggleCompare: () => void;
  onRestoreSaved: () => void;
  onResetDefaults: () => void;
}) {
  const store = useLabStore();
  const speeds = [0.5, 1, 2, 4];
  const [showReset, setShowReset] = useState(false);
  const resetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showReset) return;
    const close = (e: MouseEvent) => {
      if (resetRef.current && !resetRef.current.contains(e.target as Node))
        setShowReset(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showReset]);

  return (
    <div className="floating-canvas-toolbar">
      <button onClick={store.toggleRunning} title={running ? "Pause simulation" : "Play simulation"} aria-label={running ? "Pause simulation" : "Play simulation"}>
        <PhysicsIcon name="play" className="h-4 w-4" />
        <span>{running ? "Pause" : "Play"}</span>
      </button>

      {/* Reset — single button when no save, dropdown when save exists */}
      <div ref={resetRef} className="relative">
        <button onClick={() => (hasSave ? setShowReset((v) => !v) : onResetDefaults())} title="Reset simulation" aria-label="Reset simulation">
          <PhysicsIcon name="spark" className="h-4 w-4" />
          <span>Reset{hasSave ? " menu" : ""}</span>
        </button>
        {showReset && (
          <div className="absolute left-0 top-full z-50 mt-1 min-w-[172px] rounded border border-slate-300/50 bg-white/95 text-xs shadow-xl dark:border-slate-600 dark:bg-slate-800">
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-cyan-500/10"
              onClick={() => {
                onRestoreSaved();
                setShowReset(false);
              }}
            >
              <span>⟳</span>
              <span>
                Restore saved{savedAt ? ` · ${timeSince(savedAt)}` : ""}
              </span>
            </button>
            <div className="mx-2 border-t border-slate-200 dark:border-slate-700" />
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-500 hover:bg-red-500/10"
              onClick={() => {
                onResetDefaults();
                setShowReset(false);
              }}
            >
              <span>✕</span>
              <span>Reset to defaults</span>
            </button>
          </div>
        )}
      </div>

      <button
        title="Cycle simulation speed"
        aria-label={`Cycle simulation speed. Current speed ${timeScale}x`}
        onClick={() =>
          store.setTimeScale(
            speeds[(speeds.indexOf(timeScale) + 1 + speeds.length) % speeds.length],
          )
        }
      >
        <PhysicsIcon name="gauge" className="h-4 w-4" />
        <span>{timeScale}x</span>
      </button>

      <button
        title={compareMode ? "Exit comparison mode" : "Capture current setup for comparison"}
        aria-label={compareMode ? "Exit comparison mode" : "Compare current setup"}
        onClick={onToggleCompare}
      >
        <PhysicsIcon name="chart" className="h-4 w-4" />
        <span>{compareMode ? "Exit compare" : "Compare"}</span>
      </button>

      {/* Save status indicator */}
      {saveStatus !== "idle" && (
        <span
          className={`ml-1 text-[11px] ${saveStatus === "saved" ? "text-green-400" : "text-slate-400"}`}
        >
          {saveStatus === "saving" ? "Saving…" : "✓ Saved"}
        </span>
      )}
      {saveStatus === "idle" && hasSave && savedAt && (
        <span className="ml-1 text-[11px] text-slate-400" title={`Last saved ${savedAt}`}>
          ● {timeSince(savedAt)}
        </span>
      )}
    </div>
  );
}

function Onboarding({ step, onDone }: { step: number; onDone: () => void }) {
  const text = [
    "Add a Ball from the object library.",
    "Run the simulation.",
    "Watch the live data appear.",
    "You're ready. Try an Experiment.",
  ][step];
  const className = ["onboarding-tip left", "onboarding-tip play", "onboarding-tip graph", "onboarding-tip done"][step];
  return (
    <div className="onboarding-layer">
      <div className={className}>
        <div className="text-[10px] font-black uppercase tracking-widest text-cyan-300">Quick start</div>
        <div className="mt-1">{text}</div>
        <button className="tool-btn mt-3 w-full justify-center" onClick={onDone}>
          {step === 3 ? "Finish" : "Skip guide"}
        </button>
      </div>
    </div>
  );
}

function CompareDiff({ baseline, current }: { baseline: ReturnType<typeof useLabStore.getState>["objects"]; current: ReturnType<typeof useLabStore.getState>["objects"] }) {
  const baselineDynamic = baseline.filter((object) => !object.isStatic);
  const currentDynamic = current.filter((object) => !object.isStatic);
  const baselineSpeed = averageSpeed(baselineDynamic);
  const currentSpeed = averageSpeed(currentDynamic);
  const baselineMass = baselineDynamic.reduce((sum, object) => sum + object.mass, 0);
  const currentMass = currentDynamic.reduce((sum, object) => sum + object.mass, 0);
  const speedDelta = currentSpeed - baselineSpeed;
  const massDelta = currentMass - baselineMass;
  const main = Math.abs(speedDelta) >= Math.abs(massDelta) ? `Δspeed ${speedDelta.toFixed(2)} m/s` : `Δmass ${massDelta.toFixed(2)} kg`;
  return (
    <div className="compare-diff-chip">
      <span>Largest diff</span>
      <strong>{main}</strong>
      <small>A: {baselineDynamic.length} objects · B: {currentDynamic.length} objects</small>
    </div>
  );
}

function CompareCanvasSnapshot({ objects }: { objects: ReturnType<typeof useLabStore.getState>["objects"] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    const gradient = ctx.createRadialGradient(rect.width / 2, rect.height / 2, 0, rect.width / 2, rect.height / 2, Math.max(rect.width, rect.height) * 0.7);
    gradient.addColorStop(0, "#0b1b31");
    gradient.addColorStop(1, "#020611");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = "rgba(0,229,255,0.14)";
    for (let x = 0; x < rect.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rect.height); ctx.stroke();
    }
    for (let y = 0; y < rect.height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(rect.width, y); ctx.stroke();
    }
    objects.forEach((object) => {
      const x = Math.max(24, Math.min(rect.width - 24, object.x));
      const y = Math.max(24, Math.min(rect.height - 24, object.y));
      const color = object.color ?? (object.isStatic ? "#64748b" : "#00e5ff");
      ctx.fillStyle = color;
      ctx.strokeStyle = "rgba(226,232,240,0.72)";
      ctx.shadowColor = color;
      ctx.shadowBlur = object.isStatic ? 2 : 12;
      if (object.radius) {
        ctx.beginPath();
        ctx.arc(x, y, Math.max(7, Math.min(28, object.radius)), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        const w = Math.min(90, object.width ?? 42);
        const h = Math.min(70, object.height ?? 34);
        ctx.fillRect(x - w / 2, y - h / 2, w, h);
        ctx.strokeRect(x - w / 2, y - h / 2, w, h);
      }
      ctx.shadowBlur = 0;
    });
  }, [objects]);
  return <canvas ref={canvasRef} className="compare-snapshot-canvas" aria-label="Captured baseline comparison canvas" />;
}

function averageSpeed(objects: ReturnType<typeof useLabStore.getState>["objects"]) {
  return objects.length ? objects.reduce((sum, object) => sum + Math.hypot(object.vx, object.vy), 0) / objects.length : 0;
}

function circuitSignature(
  objects: ReturnType<typeof useLabStore.getState>["objects"],
) {
  return JSON.stringify(
    objects.filter(isCircuitLike).map((object) => ({
      id: object.id,
      kind: object.kind,
      emf: object.emf,
      internalResistance: object.internalResistance,
      resistance: object.resistance,
      closed: object.closed,
      connectedTo: object.connectedTo,
      fromId: object.fromId,
      fromTerminal: object.fromTerminal,
      toId: object.toId,
      toTerminal: object.toTerminal,
    })),
  );
}
