export const pixelsPerReferenceLength = 76;
export function physicalScreenSize(sizeMeters, exponent, referencePixels = pixelsPerReferenceLength) {
  return referencePixels * 10 ** (Math.log10(sizeMeters) - exponent);
}
export function discoverObjects(objects, exponent, width, height, selectedId, filters = null) {
  const maxSize = Math.min(width * 0.72, height * 0.75);
  return objects.map(object => ({ object, extent: physicalScreenSize(object.sizeMeters, exponent), distance: Math.abs(object.logSize - exponent) }))
    .filter(entry => entry.extent >= 3 && entry.extent <= maxSize && (filters === null || filters.has(entry.object.categoryGroup) || entry.object.id === selectedId))
    .sort((a, b) => Number(b.object.id === selectedId) - Number(a.object.id === selectedId) || priority(b.object) - priority(a.object) || a.distance - b.distance);
}
function priority(object) {
  const preferred = ["human", "door", "laptop", "microscope", "car", "school-bus", "chair", "desk", "football", "earth", "moon", "jupiter", "sun", "dna-width", "hydrogen-atom", "red-blood-cell", "observable-universe"];
  return object.importance + (preferred.includes(object.id) ? 8 : 0);
}
export function layoutObjects(candidates, width, height, panX = 0, panY = 0, selectedId = null) {
  const compact = width < 600;
  const limit = compact ? 4 : 8;
  const top = compact ? 104 : 112;
  const usable = Math.max(80, height - top - 45);
  const floors = [top + usable * .36, top + usable * .9];
  const leftReserve = width >= 1700 ? 380 : width >= 900 ? 340 : 0;
  const rowWidths = [width - leftReserve - 40, width - 40];
  const secondRowHeight = Math.max(75, floors[1] - floors[0] - 55);
  const rows = [[], []];
  const used = [0, 0];
  const visible = [];
  for (const candidate of candidates) {
    if (visible.length >= limit) break;
    const { object, extent } = candidate;
    const aspect = object.dimensionAxis === "vertical" ? object.assetAspect ?? 0.65 : object.dimensionAxis === "diameter" ? 1 : Math.max(1, object.assetAspect ?? 1.5);
    const w = object.dimensionAxis === "vertical" ? extent * aspect : extent;
    const h = object.dimensionAxis === "vertical" ? extent : extent / aspect;
    const footprint = Math.max(w + 28, compact ? 110 : 150, object.name.length * 6.5 + 18);
    let row = used[0] <= used[1] ? 0 : 1;
    if (h > secondRowHeight) row = 0;
    if (used[row] + footprint > rowWidths[row]) row = 1 - row;
    if (used[row] + footprint > rowWidths[row] || (row === 1 && h > secondRowHeight) || h > usable * 0.6) {
      if (object.id !== selectedId) continue;
      // A focused object always gets a measurable, unclipped inspection lane.
      row = 0;
    }
    const entry = { ...candidate, boxWidth: w, boxHeight: h, radius: extent / 2, row, footprint, opacity: Math.min(1, (extent - 2) / 9) };
    rows[row].push(entry); used[row] += footprint; visible.push(entry);
  }
  rows.forEach((entries, row) => {
    let x = (row === 0 ? leftReserve : 0) + (rowWidths[row] + 40 - used[row]) / 2;
    entries.forEach(entry => {
      entry.screenX = x + entry.footprint / 2 + panX;
      entry.screenY = floors[row] - entry.boxHeight / 2 + panY;
      x += entry.footprint;
    });
  });
  return visible;
}
