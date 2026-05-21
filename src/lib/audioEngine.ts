type WaveType = "sine" | "square" | "sawtooth";

const tones = new Map<string, { oscillator: OscillatorNode; gain: GainNode }>();
let context: AudioContext | undefined;
let master: GainNode | undefined;

export function getAudioContext() {
  if (typeof window === "undefined") return undefined;
  if (!context) {
    const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return undefined;
    context = new AudioCtor();
    master = context.createGain();
    master.gain.value = Number(localStorage.getItem("audio_volume") ?? 0.25);
    master.connect(context.destination);
  }
  return context;
}

export function playTone(id: string, frequency: number, amplitude: number, waveType: WaveType) {
  if (typeof window === "undefined" || localStorage.getItem("audio_enabled") !== "true") return;
  const ctx = getAudioContext();
  if (!ctx || !master) return;
  let tone = tones.get(id);
  if (!tone) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = waveType;
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start();
    tone = { oscillator, gain };
    tones.set(id, tone);
  }
  tone.oscillator.frequency.setTargetAtTime(frequency, ctx.currentTime, 0.02);
  tone.gain.gain.setTargetAtTime(Math.max(0, Math.min(1, amplitude)) * 0.15, ctx.currentTime, 0.02);
}

export function stopTone(id: string) {
  const tone = tones.get(id);
  if (!tone) return;
  tone.oscillator.stop();
  tone.oscillator.disconnect();
  tone.gain.disconnect();
  tones.delete(id);
}

export function setMasterVolume(value: number) {
  localStorage.setItem("audio_volume", String(value));
  const ctx = getAudioContext();
  if (ctx && master) master.gain.setTargetAtTime(Math.max(0, Math.min(1, value)), ctx.currentTime, 0.02);
}

export function setAudioEnabled(enabled: boolean) {
  localStorage.setItem("audio_enabled", String(enabled));
  const ctx = getAudioContext();
  if (!ctx) return;
  if (enabled) ctx.resume();
  else ctx.suspend();
}
