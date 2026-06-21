export const scaleUnits = [
  unit("Meter", "m", 1, "everyday classroom measurements", "Human"),
  unit("Millimeter", "mm", 1e-3, "small visible objects", "Grain of Sand"),
  unit("Micrometer", "um", 1e-6, "cells and bacteria", "Red Blood Cell"),
  unit("Nanometer", "nm", 1e-9, "molecules and DNA", "DNA Width"),
  unit("Picometer", "pm", 1e-12, "atoms and atomic bonds", "Hydrogen Atom"),
  unit("Femtometer", "fm", 1e-15, "atomic nuclei and nucleons", "Proton"),
  unit("Kilometer", "km", 1e3, "geography and planetary surfaces", "Mount Everest"),
  unit("Astronomical Unit", "AU", 1.496e11, "Solar System distances", "Distance from Earth to Sun"),
  unit("Light Year", "ly", 9.461e15, "interstellar and galactic distances", "Light Year"),
  unit("Parsec", "pc", 3.086e16, "astronomy and star distances", "Distance to Proxima Centauri"),
];

export function formatBestUnit(sizeMeters) {
  const abs = Math.abs(sizeMeters);
  if (!Number.isFinite(abs) || abs === 0) return "0 m";
  const candidates = [
    { limit: 1e-13, factor: 1e-15, symbol: "fm" },
    { limit: 1e-10, factor: 1e-12, symbol: "pm" },
    { limit: 1e-7, factor: 1e-9, symbol: "nm" },
    { limit: 1e-4, factor: 1e-6, symbol: "um" },
    { limit: 1, factor: 1e-3, symbol: "mm" },
    { limit: 1e3, factor: 1, symbol: "m" },
    { limit: 1e8, factor: 1e3, symbol: "km" },
    { limit: 5e14, factor: 1.496e11, symbol: "AU" },
    { limit: 2e17, factor: 9.461e15, symbol: "ly" },
    { limit: Infinity, factor: 3.086e16, symbol: "pc" },
  ];
  const choice = candidates.find((candidate) => abs < candidate.limit);
  const value = sizeMeters / choice.factor;
  return `${formatNumber(value)} ${choice.symbol}`;
}

export function renderUnitCards() {
  return scaleUnits
    .map(
      (entry) => `
        <article>
          <strong>${entry.name}</strong>
          <span>${entry.symbol}</span>
          <p>1 ${entry.symbol} = ${formatNumber(entry.meters)} m</p>
          <small>Useful for ${entry.usefulFor}. Example: ${entry.example}.</small>
        </article>
      `,
    )
    .join("");
}

function unit(name, symbol, meters, usefulFor, example) {
  return { name, symbol, meters, usefulFor, example };
}

function formatNumber(value) {
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs >= 1000 || abs < 0.01) return value.toExponential(2).replace("e", " x 10^");
  return value.toFixed(abs >= 100 ? 0 : abs >= 10 ? 1 : 2).replace(/\.?0+$/, "");
}
