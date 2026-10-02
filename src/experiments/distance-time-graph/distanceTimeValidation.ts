import { distanceTimeBenchmarks } from "./distanceTimeSimulation";
export { distanceTimeBenchmarks };
export const distanceTimeValidated = distanceTimeBenchmarks.every(
  (item) => item.pass,
);
