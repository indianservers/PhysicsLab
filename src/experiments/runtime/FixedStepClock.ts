export interface FixedStepFrame {
  elapsedSeconds: number;
  alpha: number;
  steps: number;
}

export class FixedStepClock {
  private accumulator = 0;
  private previousMs: number | null = null;

  constructor(
    readonly stepSeconds = 1 / 120,
    readonly maxFrameSeconds = 0.1,
    readonly maxStepsPerFrame = 16,
  ) {}

  reset(nowMs?: number) {
    this.accumulator = 0;
    this.previousMs = nowMs ?? null;
  }

  advance(nowMs: number, timeScale: number, step: (dtSeconds: number) => void): FixedStepFrame {
    if (this.previousMs === null) {
      this.previousMs = nowMs;
      return { elapsedSeconds: 0, alpha: 0, steps: 0 };
    }

    const elapsedSeconds = Math.min(this.maxFrameSeconds, Math.max(0, (nowMs - this.previousMs) / 1000));
    this.previousMs = nowMs;
    this.accumulator += elapsedSeconds * Math.max(0, timeScale);

    let steps = 0;
    while (this.accumulator >= this.stepSeconds && steps < this.maxStepsPerFrame) {
      step(this.stepSeconds);
      this.accumulator -= this.stepSeconds;
      steps += 1;
    }

    if (steps === this.maxStepsPerFrame) this.accumulator = 0;
    return { elapsedSeconds, alpha: this.accumulator / this.stepSeconds, steps };
  }
}
