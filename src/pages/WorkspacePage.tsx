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
  const graphSplit = useLabStore((state) => state.graphSplit);
  const running = useLabStore((state) => state.running);
  const timeScale = useLabStore((state) => state.timeScale);
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
      <div className="relative grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 lg:grid-cols-[280px_minmax(0,1fr)_300px]">
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
              onRestoreSaved={restoreSaved}
              onResetDefaults={resetToDefaults}
            />
            <div className="mb-2 flex items-center justify-between px-2">
              <h1 className="panel-title">
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
            <PhysicsCanvas />
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
  onRestoreSaved,
  onResetDefaults,
}: {
  running: boolean;
  timeScale: number;
  hasSave: boolean;
  savedAt: string | null;
  saveStatus: "idle" | "saving" | "saved";
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
      <button onClick={store.toggleRunning}>{running ? "Pause" : "Play"}</button>

      {/* Reset — single button when no save, dropdown when save exists */}
      <div ref={resetRef} className="relative">
        <button onClick={() => (hasSave ? setShowReset((v) => !v) : onResetDefaults())}>
          Reset{hasSave ? " ▾" : ""}
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
        onClick={() =>
          store.setTimeScale(
            speeds[(speeds.indexOf(timeScale) + 1 + speeds.length) % speeds.length],
          )
        }
      >
        {timeScale}x
      </button>
      <button onClick={() => store.addObject("ball", 280, 140)}>+ Add</button>
      <button onClick={() => store.addObject("ruler", 340, 220)}>Measure</button>

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
        <div>{text}</div>
        {step === 3 && (
          <button className="tool-btn mt-2" onClick={onDone}>
            Finish
          </button>
        )}
      </div>
    </div>
  );
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
