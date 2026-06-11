import { useEffect, useRef, useState } from "react";
import { PhysicsIcon } from "../lib/icons";

const AUDIO_KEY = "audio_enabled";

export function AmbientAudio() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(AUDIO_KEY) === "true");
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscRefs = useRef<OscillatorNode[]>([]);

  const start = () => {
    if (ctxRef.current) return;
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2.5);
    master.connect(ctx.destination);
    ctxRef.current = ctx;
    gainRef.current = master;

    const NOTES = [55, 110, 165, 220, 275]; // A1 harmonic series
    const oscs: OscillatorNode[] = [];
    NOTES.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(1 / (i + 1) * 0.4, ctx.currentTime);
      osc.connect(g);
      g.connect(master);
      osc.start();
      oscs.push(osc);
    });
    oscRefs.current = oscs;
  };

  const stop = () => {
    if (!ctxRef.current || !gainRef.current) return;
    gainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 1.5);
    const ctx = ctxRef.current;
    window.setTimeout(() => {
      oscRefs.current.forEach((o) => { try { o.stop(); o.disconnect(); } catch { /* ignore */ } });
      oscRefs.current = [];
      ctx.close();
    }, 1600);
    ctxRef.current = null;
    gainRef.current = null;
  };

  useEffect(() => {
    localStorage.setItem(AUDIO_KEY, String(enabled));
    if (enabled) start();
    else stop();
    return () => { if (!enabled) stop(); };
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stop(), []); // cleanup on unmount // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button
      className={`ambient-audio-btn${enabled ? " active" : ""}`}
      onClick={() => setEnabled((e) => !e)}
      title={enabled ? "Mute ambient physics audio" : "Enable ambient physics audio"}
      aria-pressed={enabled}
    >
      <PhysicsIcon name={enabled ? "wave" : "moon"} className="h-3.5 w-3.5" />
      <span className="ambient-audio-label">{enabled ? "Audio On" : "Audio Off"}</span>
    </button>
  );
}
