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
    <canvas class="scale-preview-canvas" width="640" height="320" aria-label="${object.sourceBox ? 'Illustrative object image' : 'Illustrative object preview; drag to rotate'}"></canvas>
    <p class="scale-preview-caption">${object.sourceBox ? 'Illustrative reference image' : 'Illustrative preview · drag to rotate supported 3D models'} · main view uses shared measurement brackets</p>
    <dl>
      <div><dt>Measurement</dt><dd>Approximate ${object.measurementType}</dd></div>
      <div><dt>Best unit</dt><dd>${object.bestUnitLabel ?? formatMeters(object.sizeMeters)}</dd></div>
      <div><dt>Size in meters</dt><dd>${formatMeters(object.sizeMeters)}</dd></div>
      <div><dt>Power of ten</dt><dd>10<sup>${object.logSize.toFixed(1)}</sup> meters</dd></div>
      <div><dt>Scale band</dt><dd>${object.scaleBand ?? getScaleBand(object.logSize)}</dd></div>
      <div><dt>Difficulty</dt><dd>${object.difficultyLevel ?? "beginner"}</dd></div>
      <div><dt>Scientific notation</dt><dd>${object.formula}</dd></div>
    </dl>
    <p>${object.summary}</p>
    <p>${object.measurementDefinition}</p>
    <p class="scale-source-note">${object.uncertainty}<br><strong>${object.validationStatus}</strong><br>${object.sourceUrl ? `<a href="${object.sourceUrl}" target="_blank" rel="noopener noreferrer">${object.sourceName}</a>` : object.sourceName}</p>
    <h3>Why this matters</h3>
    <p>${object.whyItMatters}</p>
    <h3>Key facts</h3>
    <ol>${object.facts.map((fact) => `<li>${fact}</li>`).join("")}</ol>
    <h3>Scale notation</h3>
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
      <button type="button" data-info-action="focus">Focus Object</button>
      ${object.sourceUrl ? `<a href="${object.sourceUrl}" target="_blank" rel="noopener noreferrer">Learn More ↗</a>` : `<button type="button" disabled title="Independent measurement source is pending review">Source review pending</button>`}
      <button type="button" data-info-action="bookmark">${isBookmarked ? "Remove Bookmark" : "Bookmark"}</button>
      <button type="button" data-info-action="compare">Compare</button>
      <button type="button" data-info-action="journey">Guided Journey</button>
      <button type="button" data-info-action="more">More</button>
    </div>
  `;
  const preview = panel.querySelector("canvas");
  const ctx = preview.getContext("2d");
  let rotation = 0;
  let lastX = null;
  const image = new Image();
  preview.dataset.visualType = object.sourceBox ? "transparent-cutout" : "model-or-reference";
  preview.dataset.objectId = object.id;
  const renderPreview = () => {
    if (!preview.isConnected) return;
    ctx.clearRect(0, 0, 640, 320);
    if (object.sourceBox || !options.models?.draw(ctx, object, 320, 155, 205, 205, rotation)) {
      if (!image.complete || !image.naturalWidth) return;
      const source = object.sourceBox ?? [0, 0, image.naturalWidth, image.naturalHeight];
      const factor = 230 / Math.max(source[2], source[3]);
      const width = source[2] * factor, height = source[3] * factor;
      ctx.drawImage(image, ...source, 320 - width / 2, 155 - height / 2, width, height);
    }
  };
  image.onload = renderPreview;
  if (object.assetPath) image.src = object.assetPath;
  renderPreview();
  preview.onpointerdown = event => { if (object.sourceBox) return; lastX = event.clientX; preview.setPointerCapture(event.pointerId); };
  preview.onpointermove = event => { if (lastX === null) return; rotation += (event.clientX - lastX) * .02; lastX = event.clientX; renderPreview(); };
  preview.onpointerup = preview.onpointercancel = () => { lastX = null; };
  const onClick = (event) => {
    if (event.target.closest(".scale-info-close")) options.onClose?.();
    const action = event.target.closest("[data-info-action]")?.dataset.infoAction;
    if (action === "compare") options.onCompare?.(object);
    if (action === "focus") options.onRelated?.(object);
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
