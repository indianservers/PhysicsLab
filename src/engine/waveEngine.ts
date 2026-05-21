import { PhysicsObjectInstance } from "../types";

export interface WaveSource {
  x: number;
  y: number;
  frequency: number;
  amplitude: number;
  phase: number;
}

export interface WaveBarrier {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  gapPositions: number[];
  gapWidth: number;
}

const SIZE = 256;

export class WaveEngine {
  readonly width = SIZE;
  readonly height = SIZE;
  current = new Float32Array(SIZE * SIZE);
  previous = new Float32Array(SIZE * SIZE);
  private next = new Float32Array(SIZE * SIZE);
  private time = 0;

  reset() {
    this.current.fill(0);
    this.previous.fill(0);
    this.next.fill(0);
    this.time = 0;
  }

  step(dt: number, sources: WaveSource[], barriers: WaveBarrier[]) {
    this.time += dt;
    const lambda = 0.22;
    for (let y = 1; y < SIZE - 1; y += 1) {
      for (let x = 1; x < SIZE - 1; x += 1) {
        const i = index(x, y);
        this.next[i] = 2 * this.current[i] - this.previous[i] + lambda * (
          this.current[index(x + 1, y)] + this.current[index(x - 1, y)] + this.current[index(x, y + 1)] + this.current[index(x, y - 1)] - 4 * this.current[i]
        );
      }
    }
    this.applyMurBoundaries();
    sources.forEach((source) => {
      const x = clamp(Math.round(source.x), 1, SIZE - 2);
      const y = clamp(Math.round(source.y), 1, SIZE - 2);
      this.next[index(x, y)] = source.amplitude * Math.sin(2 * Math.PI * source.frequency * this.time + source.phase);
    });
    barriers.forEach((barrier) => this.applyBarrier(barrier));
    [this.previous, this.current, this.next] = [this.current, this.next, this.previous];
  }

  private applyMurBoundaries() {
    const k = 0.72;
    for (let x = 1; x < SIZE - 1; x += 1) {
      this.next[index(x, 0)] = this.current[index(x, 1)] + k * (this.next[index(x, 1)] - this.current[index(x, 0)]);
      this.next[index(x, SIZE - 1)] = this.current[index(x, SIZE - 2)] + k * (this.next[index(x, SIZE - 2)] - this.current[index(x, SIZE - 1)]);
    }
    for (let y = 1; y < SIZE - 1; y += 1) {
      this.next[index(0, y)] = this.current[index(1, y)] + k * (this.next[index(1, y)] - this.current[index(0, y)]);
      this.next[index(SIZE - 1, y)] = this.current[index(SIZE - 2, y)] + k * (this.next[index(SIZE - 2, y)] - this.current[index(SIZE - 1, y)]);
    }
  }

  private applyBarrier(barrier: WaveBarrier) {
    const horizontal = Math.abs(barrier.x2 - barrier.x1) >= Math.abs(barrier.y2 - barrier.y1);
    const xMin = clamp(Math.min(barrier.x1, barrier.x2), 0, SIZE - 1);
    const xMax = clamp(Math.max(barrier.x1, barrier.x2), 0, SIZE - 1);
    const yMin = clamp(Math.min(barrier.y1, barrier.y2), 0, SIZE - 1);
    const yMax = clamp(Math.max(barrier.y1, barrier.y2), 0, SIZE - 1);
    for (let y = yMin; y <= yMax; y += 1) {
      for (let x = xMin; x <= xMax; x += 1) {
        const axis = horizontal ? x : y;
        const inGap = barrier.gapPositions.some((gap) => Math.abs(axis - gap) <= barrier.gapWidth / 2);
        if (inGap) continue;
        this.next[index(x, y)] = 0;
        this.current[index(x, y)] = 0;
        this.previous[index(x, y)] = 0;
      }
    }
  }
}

export function sourcesFromObjects(objects: PhysicsObjectInstance[], width: number, height: number): WaveSource[] {
  return objects.filter((object) => object.kind === "wave-source").map((object) => ({
    x: clamp(Math.round((object.x / Math.max(1, width)) * SIZE), 0, SIZE - 1),
    y: clamp(Math.round((object.y / Math.max(1, height)) * SIZE), 0, SIZE - 1),
    frequency: object.frequency ?? 2,
    amplitude: object.amplitude ?? 1,
    phase: object.phase ?? 0,
  }));
}

export function barriersFromObjects(objects: PhysicsObjectInstance[], width: number, height: number): WaveBarrier[] {
  return objects.filter((object) => object.kind === "wave-barrier").map((object) => ({
    x1: clamp(Math.round(((object.x1 ?? object.x - (object.width ?? 12) / 2) / Math.max(1, width)) * SIZE), 0, SIZE - 1),
    y1: clamp(Math.round(((object.y1 ?? object.y - (object.height ?? 120) / 2) / Math.max(1, height)) * SIZE), 0, SIZE - 1),
    x2: clamp(Math.round(((object.x2 ?? object.x + (object.width ?? 12) / 2) / Math.max(1, width)) * SIZE), 0, SIZE - 1),
    y2: clamp(Math.round(((object.y2 ?? object.y + (object.height ?? 120) / 2) / Math.max(1, height)) * SIZE), 0, SIZE - 1),
    gapPositions: object.gapPositions ?? [128],
    gapWidth: object.gapWidth ?? 18,
  }));
}

function index(x: number, y: number) {
  return y * SIZE + x;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
