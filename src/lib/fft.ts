export function fft(signal: Float64Array): { frequencies: Float64Array; magnitudes: Float64Array } {
  const n = nextPowerOfTwo(Math.min(Math.max(signal.length, 1), 4096));
  const real = new Float64Array(n);
  const imag = new Float64Array(n);
  real.set(signal.slice(0, n));
  transform(real, imag);
  const bins = n / 2;
  const frequencies = new Float64Array(bins);
  const magnitudes = new Float64Array(bins);
  for (let i = 0; i < bins; i += 1) {
    frequencies[i] = i;
    magnitudes[i] = (2 * Math.hypot(real[i], imag[i])) / n;
  }
  return { frequencies, magnitudes };
}

function transform(real: Float64Array, imag: Float64Array) {
  const n = real.length;
  if (n <= 1) return;
  const levels = Math.log2(n);
  if (!Number.isInteger(levels)) throw new Error("FFT input length must be a power of 2.");

  for (let i = 0; i < n; i += 1) {
    const j = reverseBits(i, levels);
    if (j > i) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }
  }

  for (let size = 2; size <= n; size *= 2) {
    const half = size / 2;
    const theta = (-2 * Math.PI) / size;
    const phaseReal = Math.cos(theta);
    const phaseImag = Math.sin(theta);
    for (let start = 0; start < n; start += size) {
      let wr = 1;
      let wi = 0;
      for (let k = 0; k < half; k += 1) {
        const even = start + k;
        const odd = even + half;
        const tr = wr * real[odd] - wi * imag[odd];
        const ti = wr * imag[odd] + wi * real[odd];
        real[odd] = real[even] - tr;
        imag[odd] = imag[even] - ti;
        real[even] += tr;
        imag[even] += ti;
        const nextWr = wr * phaseReal - wi * phaseImag;
        wi = wr * phaseImag + wi * phaseReal;
        wr = nextWr;
      }
    }
  }
}

function reverseBits(value: number, bits: number) {
  let result = 0;
  for (let i = 0; i < bits; i += 1) {
    result = (result << 1) | (value & 1);
    value >>= 1;
  }
  return result;
}

function nextPowerOfTwo(value: number) {
  let n = 1;
  while (n < value && n < 4096) n *= 2;
  return n;
}
