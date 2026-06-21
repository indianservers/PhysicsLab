export function buoyantForce(fluidDensity: number, gravity: number, displacedVolume: number) {
  return fluidDensity * gravity * displacedVolume;
}

export function objectWeight(objectDensity: number, gravity: number, volume: number) {
  return objectDensity * gravity * volume;
}

export function floatingFraction(objectDensity: number, fluidDensity: number) {
  return Math.max(0, Math.min(1, objectDensity / Math.max(0.000001, fluidDensity)));
}

export function bernoulliPressure(totalPressure: number, density: number, speed: number, height = 0, gravity = 9.8) {
  return totalPressure - 0.5 * density * speed * speed - density * gravity * height;
}

export function continuitySpeed(flowRate: number, area: number) {
  return flowRate / Math.max(0.000001, area);
}
