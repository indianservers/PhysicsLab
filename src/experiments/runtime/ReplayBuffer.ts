export interface ReplaySample<T> {
  time: number;
  state: T;
}

export class ReplayBuffer<T> {
  private samples: ReplaySample<T>[] = [];

  constructor(private readonly capacity = 2400) {}

  clear(initial?: ReplaySample<T>) {
    this.samples = initial ? [initial] : [];
  }

  push(sample: ReplaySample<T>) {
    this.samples.push(sample);
    if (this.samples.length > this.capacity) this.samples.splice(0, this.samples.length - this.capacity);
  }

  at(progress: number): ReplaySample<T> | undefined {
    if (!this.samples.length) return undefined;
    const index = Math.round(Math.max(0, Math.min(1, progress)) * (this.samples.length - 1));
    return this.samples[index];
  }

  get duration() {
    return this.samples.length < 2 ? 0 : this.samples[this.samples.length - 1].time - this.samples[0].time;
  }

  get length() {
    return this.samples.length;
  }
}
