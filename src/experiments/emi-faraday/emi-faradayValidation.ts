import { approximatelyEqual, runBenchmarkCases } from "../shared/validation";
import { emiFaradayBenchmarks as emiFaradayBenchmarkInputs } from "./emi-faradaySimulation";

export const emiFaradayBenchmarks = runBenchmarkCases(
  emiFaradayBenchmarkInputs.map((item) => ({
    ...item,
    input: item.actual,
    actual: (value: number) => value,
  })),
);

export const emiFaradayValidated = emiFaradayBenchmarks.every(
  (item) =>
    item.pass && approximatelyEqual(item.actual, item.expected, item.tolerance),
);
