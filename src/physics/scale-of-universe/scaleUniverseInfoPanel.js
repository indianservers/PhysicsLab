import { formatMeters } from "./scaleUniverseCompare.js";
import { getScaleBand } from "./scaleUniverseRenderer.js";

export function showInfoPanel(panel, object, options = {}) {
  const related = (object.relatedObjects ?? [])
    .map((id) => options.objects?.find((candidate) => candidate.id === id))
    .filter(Boolean);
  const isBookmarked = options.isBookmarked?.(object.id);
  panel.hidden = false;
  panel.dataset.sheetState = "half";
  panel.classList.remove("scale-sheet-expanded");
  panel.innerHTML = `
    <div class="scale-sheet-handle" aria-hidden="true"></div>
    <button class="scale-info-close" type="button" aria-label="Close object information">Close</button>
    <p class="scale-eyebrow">${object.category}</p>
    ${object.assetPath ? `<img class="scale-info-sprite" src="${object.assetPath}" alt="" loading="lazy" />` : ""}
    <h2>${object.name}</h2>
    <dl>
      <div><dt>Best unit</dt><dd>${object.bestUnitLabel ?? formatMeters(object.sizeMeters)}</dd></div>
      <div><dt>Size in meters</dt><dd>${formatMeters(object.sizeMeters)}</dd></div>
      <div><dt>Power of ten</dt><dd>10<sup>${object.logSize.toFixed(1)}</sup> meters</dd></div>
      <div><dt>Scale band</dt><dd>${object.scaleBand ?? getScaleBand(object.logSize)}</dd></div>
      <div><dt>Difficulty</dt><dd>${object.difficultyLevel ?? "beginner"}</dd></div>
      <div><dt>Scientific notation</dt><dd>${object.formula}</dd></div>
    </dl>
    <p>${object.summary}</p>
    <h3>Why this matters</h3>
    <p>${object.whyItMatters}</p>
    <h3>Key facts</h3>
    <ol>${object.facts.map((fact) => `<li>${fact}</li>`).join("")}</ol>
    <h3>Scale formula</h3>
    <code>${object.formula}</code>
    ${
      related.length
        ? `<h3>Related objects</h3><div class="scale-related-list">${related
            .map((relatedObject) => `<button type="button" data-related-id="${relatedObject.id}">${relatedObject.name}</button>`)
            .join("")}</div>`
        : ""
    }
    ${object.learningTags?.length ? `<div class="scale-info-tags">${object.learningTags.map((tag) => `<span>${tag}</span>`).join("")}</div>` : ""}
    <div class="scale-info-actions">
      <button type="button" data-info-action="bookmark">${isBookmarked ? "Remove Bookmark" : "Bookmark"}</button>
      <button type="button" data-info-action="compare">Compare</button>
      <button type="button" data-info-action="journey">Guided Journey</button>
      <button type="button" data-info-action="more">More</button>
    </div>
  `;
  const onClick = (event) => {
    if (event.target.closest(".scale-info-close")) options.onClose?.();
    const action = event.target.closest("[data-info-action]")?.dataset.infoAction;
    if (action === "compare") options.onCompare?.(object);
    if (action === "journey") options.onJourney?.(object);
    if (action === "bookmark") options.onBookmark?.(object);
    if (action === "more") {
      panel.classList.toggle("scale-sheet-expanded");
      panel.dataset.sheetState = panel.classList.contains("scale-sheet-expanded") ? "expanded" : "half";
    }
    const relatedId = event.target.closest("[data-related-id]")?.dataset.relatedId;
    if (relatedId) {
      const relatedObject = options.objects?.find((candidate) => candidate.id === relatedId);
      if (relatedObject) options.onRelated?.(relatedObject);
    }
  };
  panel.onclick = onClick;
}

export function hideInfoPanel(panel) {
  panel.hidden = true;
  panel.onclick = null;
  panel.innerHTML = "";
}
