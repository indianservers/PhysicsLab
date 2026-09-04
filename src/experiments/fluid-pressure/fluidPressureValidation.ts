import { runBenchmarkCases } from "../shared/validation";
import { fluidPressureCases as raw } from "./fluidPressurePhysics";
export const fluidPressureBenchmarks = runBenchmarkCases(raw.map((item) => ({ ...item, input: item.actual, actual: (value: number) => value })));
