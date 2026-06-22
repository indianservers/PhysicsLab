import {
  getScaleBandExplanation,
  normalizedScaleUniverseObjects,
  SCALE_MAX_LOG,
  SCALE_MIN_LOG,
} from "./scaleUniverseData.js";
import { createBookmarkController } from "./scaleUniverseBookmarks.js";
import { createScaleSlider } from "./scaleUniverseControls.js";
import { createCompareController } from "./scaleUniverseCompare.js";
import { createFilterController } from "./scaleUniverseFilters.js";
import { hideInfoPanel, showInfoPanel } from "./scaleUniverseInfoPanel.js";
import { createJourneyController } from "./scaleUniverseJourney.js";
import { createQuizController } from "./scaleUniverseQuiz.js";
import { renderScaleUniverse, clamp, getScaleBand } from "./scaleUniverseRenderer.js";
import { createSearchController } from "./scaleUniverseSearch.js";
import { createTeacherMode } from "./scaleUniverseTeacherMode.js";
import { renderUnitCards } from "./scaleUniverseUnits.js";

export function createScaleUniverseExplorer(host) {
  const objects = normalizedScaleUniverseObjects();
  const displayObjects = buildCuratedDisplayObjects(objects);
  const defaultObjectDisplayLimit = Math.min(75, displayObjects.length);
  host.innerHTML = `
    <section class="scale-explorer" aria-label="Scale of Universe Explorer">
      <header class="scale-topbar">
        <div class="scale-title-block">
          <p class="scale-eyebrow">Browser-only physics module</p>
          <h1>Scale of Universe Explorer</h1>
          <p>Explore sizes from particles to galaxies using powers of ten.</p>
        </div>
        <div class="scale-search">
          <label for="scale-universe-search">Search</label>
          <div class="scale-search-box">
            <input id="scale-universe-search" type="search" placeholder="Search the Universe..." aria-label="Search the Universe" autocomplete="off" />
            <button class="scale-search-clear" type="button" aria-label="Clear search" hidden>Clear</button>
          </div>
          <div class="scale-search-results" hidden></div>
        </div>
      </header>
      <div class="scale-stage">
        <aside class="scale-filter-panel" aria-label="Object category filters"></aside>
        <nav class="scale-path-panel" aria-label="Mini scale path"></nav>
        <canvas aria-label="Scale of Universe canvas visualization" role="img" tabindex="0"></canvas>
        <div class="scale-legend" aria-live="polite">
          <span>Current Scale</span>
          <strong>10<sup>0</sup> meters</strong>
          <em>Band: Human Scale</em>
          <p>Objects we can see, touch, and measure directly in everyday life.</p>
        </div>
        <div class="scale-instructions">Wheel or pinch to zoom. Drag the universe. Tap any object to learn.</div>
        <aside class="scale-info-panel" hidden></aside>
        <section class="scale-compare-panel" hidden aria-label="Object comparison">
          <button type="button" class="scale-info-close" data-compare-close>Close</button>
          <p class="scale-eyebrow">Compare sizes</p>
          <label>Compare with
            <select class="scale-compare-select"></select>
          </label>
          <div class="scale-compare-body"></div>
        </section>
        <section class="scale-journey-picker" hidden aria-label="Guided scale journeys"></section>
        <section class="scale-journey-status" hidden aria-live="polite"></section>
        <section class="scale-units-panel" hidden aria-label="Scale unit explanations">
          <button type="button" class="scale-info-close" data-units-close aria-label="Close units panel">Close</button>
          <p class="scale-eyebrow">Units</p>
          <h3>Scale units explained</h3>
          <div class="scale-unit-grid">${renderUnitCards()}</div>
        </section>
        <section class="scale-bookmarks-panel" hidden aria-label="Bookmarked scale objects"></section>
        <section class="scale-quiz-panel" hidden aria-label="Scale quiz mode"></section>
        <section class="scale-teacher-panel" hidden aria-label="Teacher presentation mode"></section>
        <section class="scale-help-panel" hidden aria-label="Scale explorer help">
          <button type="button" class="scale-info-close" data-help-close>Close</button>
          <p class="scale-eyebrow">How to explore</p>
          <div class="scale-help-grid">
            <article>
              <h3>Desktop</h3>
              <ul>
                <li>Mouse wheel to zoom across powers of ten.</li>
                <li>Drag the canvas to pan.</li>
                <li>Click an object to learn its size.</li>
                <li>Use search or guided journeys to jump fast.</li>
              </ul>
            </article>
            <article>
              <h3>Mobile / Tablet</h3>
              <ul>
                <li>Pinch with two fingers to zoom.</li>
                <li>Drag with one finger to pan.</li>
                <li>Tap an object to open the bottom sheet.</li>
                <li>Drag the bottom scale bar to zoom.</li>
              </ul>
            </article>
          </div>
          <label class="scale-help-check"><input type="checkbox" data-help-session /> Do not show again during this session</label>
        </section>
      </div>
      <footer class="scale-control-deck">
        <div class="scale-button-row">
          <button type="button" data-action="zoom-in">Zoom In</button>
          <button type="button" data-action="zoom-out">Zoom Out</button>
          <button type="button" data-action="journey">Guided Journey</button>
          <button type="button" data-action="quiz">Quiz Mode</button>
          <button type="button" data-action="teacher">Teacher Mode</button>
          <button type="button" data-action="bookmarks">Bookmarks</button>
          <button type="button" data-action="units">Units</button>
          <button type="button" data-action="help">Help</button>
          <button type="button" data-action="reset">Reset View</button>
          <button type="button" data-action="fullscreen">Fullscreen</button>
          <button type="button" data-action="sound">Sound Coming Soon</button>
        </div>
        <div class="scale-object-count-control" aria-label="Displayed object count control">
          <label for="scale-object-count">
            <span>Total objects to display</span>
            <strong><output data-object-count-output>${defaultObjectDisplayLimit}</output> / ${displayObjects.length}</strong>
          </label>
          <input id="scale-object-count" type="range" min="30" max="${displayObjects.length}" step="1" value="${defaultObjectDisplayLimit}" />
        </div>
        <div class="scale-slider" aria-label="Logarithmic scale slider">
          <div class="scale-slider-track">
            <div class="scale-slider-ticks" aria-hidden="true"></div>
            <div class="scale-slider-fill"></div>
            <div class="scale-slider-thumb"></div>
          </div>
          <div class="scale-slider-labels"><span>10<sup>-35</sup> m</span><span>10<sup>0</sup> m</span><span>10<sup>26</sup> m</span></div>
        </div>
      </footer>
    </section>
  `;

  const root = host.querySelector(".scale-explorer");
  const canvas = host.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const legend = host.querySelector(".scale-legend");
  const panel = host.querySelector(".scale-info-panel");
  const searchInput = host.querySelector(".scale-search input");
  const searchClear = host.querySelector(".scale-search-clear");
  const searchResults = host.querySelector(".scale-search-results");
  const helpPanel = host.querySelector(".scale-help-panel");
  const unitsPanel = host.querySelector(".scale-units-panel");
  const scalePath = host.querySelector(".scale-path-panel");
  const objectCountInput = host.querySelector("#scale-object-count");
  const objectCountOutput = host.querySelector("[data-object-count-output]");

  const state = {
    minLog: SCALE_MIN_LOG,
    maxLog: SCALE_MAX_LOG,
    currentLog: 0,
    targetLog: 0,
    panX: 0,
    panY: 0,
    selectedObjectId: null,
    width: 1,
    height: 1,
    isMobile: false,
    scaleBand: getScaleBand(0),
    categoryFilters: new Set(),
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    objects,
    displayObjects,
    visibleObjects: [],
    objectDisplayLimit: defaultObjectDisplayLimit,
  };

  let raf = 0;
  let dirty = true;
  let lastRenderedLog = Number.NaN;
  let lastPointerPoint = null;
  let dragDistance = 0;
  let sheetStartY = null;
  let pinchDistance = null;
  let pinchCenter = null;
  const activePointers = new Map();

  const markDirty = () => {
    dirty = true;
  };

  const updateObjectLimit = (value) => {
    const next = Math.round(clamp(Number(value), 30, displayObjects.length));
    state.objectDisplayLimit = next;
    objectCountInput.value = String(next);
    objectCountOutput.textContent = String(next);
    markDirty();
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    state.width = Math.max(300, rect.width);
    state.height = Math.max(260, rect.height);
    state.isMobile = state.width < 640 || window.matchMedia("(max-width: 640px)").matches;
    root.dataset.mobile = state.isMobile ? "true" : "false";
    canvas.width = Math.round(state.width * dpr);
    canvas.height = Math.round(state.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    markDirty();
  };

  const setTargetLog = (value) => {
    state.targetLog = clamp(value, SCALE_MIN_LOG, SCALE_MAX_LOG);
    state.scaleBand = getScaleBand(state.targetLog);
    slider.updateVisual();
    updateScalePath(scalePath, state.targetLog);
    markDirty();
  };

  const centerObject = (object) => {
    state.panX += (-object.x - state.panX) * 0.8;
    state.panY += (-object.y - state.panY) * 0.8;
  };

  const selectObject = (object) => {
    state.selectedObjectId = object.id;
    setTargetLog(object.logSize);
    centerObject(object);
    showInfoPanel(panel, object, {
      onClose: closeInfo,
      onCompare: (selected) => compare.open(selected),
      onJourney: () => journey.openPicker(),
      onRelated: (related) => selectObject(related),
      onBookmark: (selected) => {
        bookmarks.toggle(selected);
        showInfoPanel(panel, selected, panelOptions(selected));
      },
      isBookmarked: (id) => bookmarks.isBookmarked(id),
      objects,
    });
    markDirty();
  };

  const closeInfo = () => {
    state.selectedObjectId = null;
    hideInfoPanel(panel);
    markDirty();
  };

  const reset = () => {
    state.currentLog = 0;
    state.targetLog = 0;
    state.panX = 0;
    state.panY = 0;
    state.scaleBand = getScaleBand(0);
    compare.close();
    journey.exit();
    closeInfo();
    slider.updateVisual();
    markDirty();
  };

  const zoomTo = (object) => {
    selectObject(object);
  };

  const panelOptions = (object) => ({
    onClose: closeInfo,
    onCompare: (selected) => compare.open(selected),
    onJourney: () => journey.openPicker(),
    onRelated: (related) => selectObject(related),
    onBookmark: (selected) => {
      bookmarks.toggle(selected);
      showInfoPanel(panel, selected, panelOptions(selected));
    },
    isBookmarked: (id) => bookmarks.isBookmarked(id),
    objects,
  });

  const slider = createScaleSlider(host.querySelector(".scale-slider"), state, setTargetLog);
  const bookmarks = createBookmarkController(root, objects, { zoomTo });
  const search = createSearchController(searchInput, searchResults, searchClear, objects, selectObject, {
    getFilters: () => state.categoryFilters,
    isBookmarked: (id) => bookmarks.isBookmarked(id),
  });
  const filters = createFilterController(root, state, { onChange: markDirty });
  const compare = createCompareController(root, objects, { zoomTo });
  const journey = createJourneyController(root, objects, { zoomTo });
  const quiz = createQuizController(root, objects);
  const teacher = createTeacherMode(root, objects, { zoomTo });

  const onWheel = (event) => {
    event.preventDefault();
    setTargetLog(state.targetLog + (event.deltaY < 0 ? 0.32 : -0.32));
  };

  const onKey = (event) => {
    if (event.target === searchInput) {
      if (event.key === "Escape") {
        searchResults.hidden = true;
        searchInput.blur();
      }
      return;
    }
    if (event.key === "+" || event.key === "=") setTargetLog(state.targetLog + 1);
    if (event.key === "-" || event.key === "_") setTargetLog(state.targetLog - 1);
    if (event.key.toLowerCase() === "r") reset();
    if (event.key === "Escape") {
      helpPanel.hidden = true;
      unitsPanel.hidden = true;
      journey.closePicker();
      compare.close();
      bookmarks.close();
      quiz.close();
      closeInfo();
    }
  };

  const onObjectCountInput = (event) => {
    updateObjectLimit(event.target.value);
  };

  const onPointerDown = (event) => {
    canvas.focus();
    activePointers.set(event.pointerId, point(event));
    canvas.setPointerCapture?.(event.pointerId);
    dragDistance = 0;
    if (activePointers.size === 1) {
      lastPointerPoint = point(event);
      pinchDistance = null;
      pinchCenter = null;
    }
    if (activePointers.size === 2) {
      const gesture = getTwoPointerGesture();
      pinchDistance = gesture.distance;
      pinchCenter = gesture.center;
    }
    event.preventDefault();
  };

  const onPointerMove = (event) => {
    if (!activePointers.has(event.pointerId)) return;
    activePointers.set(event.pointerId, point(event));
    if (activePointers.size === 1 && lastPointerPoint) {
      const next = point(event);
      const dx = next.x - lastPointerPoint.x;
      const dy = next.y - lastPointerPoint.y;
      state.panX += dx;
      state.panY += dy;
      dragDistance += Math.abs(dx) + Math.abs(dy);
      lastPointerPoint = next;
      markDirty();
    }
    if (activePointers.size >= 2) {
      const gesture = getTwoPointerGesture();
      if (pinchDistance && pinchCenter) {
        const scale = clamp(gesture.distance / pinchDistance, 0.72, 1.32);
        const deltaLog = Math.log(scale) * 2.8;
        setTargetLog(state.targetLog + deltaLog);
        state.panX += gesture.center.x - pinchCenter.x;
        state.panY += gesture.center.y - pinchCenter.y;
        dragDistance += Math.abs(gesture.center.x - pinchCenter.x) + Math.abs(gesture.center.y - pinchCenter.y);
      }
      pinchDistance = gesture.distance;
      pinchCenter = gesture.center;
      markDirty();
    }
    event.preventDefault();
  };

  const onPointerUp = (event) => {
    activePointers.delete(event.pointerId);
    if (activePointers.size === 0) {
      lastPointerPoint = null;
      pinchDistance = null;
      pinchCenter = null;
    }
    if (activePointers.size === 1) {
      lastPointerPoint = [...activePointers.values()][0];
    }
  };

  const onCanvasClick = (event) => {
    if (dragDistance > 12) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = [...state.visibleObjects]
      .reverse()
      .find((entry) => Math.hypot(entry.screenX - x, entry.screenY - y) <= Math.max(entry.radius * 1.2, 18));
    if (hit) selectObject(hit.object);
  };

  const onSheetPointerDown = (event) => {
    if (!state.isMobile) return;
    if (!event.target.closest(".scale-sheet-handle")) return;
    sheetStartY = event.clientY;
    panel.setPointerCapture?.(event.pointerId);
  };

  const onSheetPointerMove = (event) => {
    if (sheetStartY == null) return;
    const delta = Math.max(0, event.clientY - sheetStartY);
    panel.style.transform = `translateY(${delta}px)`;
    event.preventDefault();
  };

  const onSheetPointerUp = (event) => {
    if (sheetStartY == null) return;
    const delta = event.clientY - sheetStartY;
    panel.style.transform = "";
    sheetStartY = null;
    if (delta > 90) closeInfo();
  };

  const openHelp = () => {
    if (sessionStorage.getItem("scaleUniverseHelpHidden") === "true") return;
    helpPanel.hidden = false;
  };

  const closeHelp = () => {
    const neverAgain = helpPanel.querySelector("[data-help-session]")?.checked;
    if (neverAgain) sessionStorage.setItem("scaleUniverseHelpHidden", "true");
    helpPanel.hidden = true;
  };

  const buttons = {
    "zoom-in": () => setTargetLog(state.targetLog - 1),
    "zoom-out": () => setTargetLog(state.targetLog + 1),
    journey: () => journey.openPicker(),
    quiz: () => quiz.start(),
    teacher: () => teacher.open(),
    bookmarks: () => bookmarks.open(),
    units: () => {
      unitsPanel.hidden = false;
    },
    help: () => {
      helpPanel.hidden = false;
    },
    reset,
    fullscreen: () => root.requestFullscreen?.(),
    sound: () => {
      const button = host.querySelector('[data-action="sound"]');
      button.textContent = "Sound Coming Soon";
    },
  };

  const onButtonClick = (event) => {
    if (event.target.closest("[data-help-close]")) closeHelp();
    if (event.target.closest("[data-units-close]")) unitsPanel.hidden = true;
    const bandLog = event.target.closest("[data-band-log]")?.dataset.bandLog;
    if (bandLog) setTargetLog(Number(bandLog));
    const action = event.target?.closest?.("[data-action]")?.dataset?.action;
    if (action && buttons[action]) buttons[action]();
  };

  const animate = () => {
    const diff = state.targetLog - state.currentLog;
    if (Math.abs(diff) > 0.004) {
      const ease = Math.abs(diff) > 8 ? 0.075 : 0.145;
      state.currentLog += state.prefersReducedMotion ? diff : diff * ease;
      state.currentLog = clamp(state.currentLog, SCALE_MIN_LOG, SCALE_MAX_LOG);
      dirty = true;
    }
    if (dirty || Math.abs(state.currentLog - lastRenderedLog) > 0.002) {
      state.scaleBand = getScaleBand(state.currentLog);
      state.visibleObjects = renderScaleUniverse(ctx, state);
      updateLegend(legend, state.currentLog, state.isMobile);
      updateScalePath(scalePath, state.currentLog);
      slider.updateVisual();
      lastRenderedLog = state.currentLog;
      dirty = false;
    }
    raf = requestAnimationFrame(animate);
  };

  resize();
  updateObjectLimit(defaultObjectDisplayLimit);
  updateScalePath(scalePath, 0);
  openHelp();
  raf = requestAnimationFrame(animate);

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", onKey);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("click", onCanvasClick);
  panel.addEventListener("pointerdown", onSheetPointerDown);
  panel.addEventListener("pointermove", onSheetPointerMove);
  panel.addEventListener("pointerup", onSheetPointerUp);
  panel.addEventListener("pointercancel", onSheetPointerUp);
  objectCountInput.addEventListener("input", onObjectCountInput);
  host.addEventListener("click", onButtonClick);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("click", onCanvasClick);
      panel.removeEventListener("pointerdown", onSheetPointerDown);
      panel.removeEventListener("pointermove", onSheetPointerMove);
      panel.removeEventListener("pointerup", onSheetPointerUp);
      panel.removeEventListener("pointercancel", onSheetPointerUp);
      objectCountInput.removeEventListener("input", onObjectCountInput);
      host.removeEventListener("click", onButtonClick);
      slider.destroy();
      search.destroy();
      filters.destroy();
      bookmarks.destroy();
      compare.destroy();
      journey.destroy();
      quiz.destroy();
      teacher.destroy();
      host.innerHTML = "";
    },
  };

  function getTwoPointerGesture() {
    const [a, b] = [...activePointers.values()];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return {
      distance: Math.max(12, Math.hypot(dx, dy)),
      center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    };
  }
}

function updateScalePath(panel, log) {
  const bands = [
    ["Subatomic", -15],
    ["Atomic", -10],
    ["Molecular", -8],
    ["Cellular", -5],
    ["Human", 0],
    ["Planetary", 7],
    ["Solar", 11],
    ["Stellar", 13],
    ["Galactic", 21],
    ["Cosmic", 26],
  ];
  const active = getScaleBand(log).split(" ")[0];
  panel.innerHTML = bands
    .map(([label, value]) => `<button type="button" data-band-log="${value}" class="${active.toLowerCase().startsWith(label.toLowerCase().slice(0, 5)) ? "active" : ""}">${label}</button>`)
    .join("");
}

function updateLegend(legend, log, isMobile) {
  const band = getScaleBand(log);
  const power = Math.round(log);
  const label = isMobile
    ? `<strong>10<sup>${power}</sup> m</strong><em>${band}</em>`
    : `<span>Current Scale</span><strong>10<sup>${power}</sup> meters</strong><em>Band: ${band}</em>`;
  legend.innerHTML = `${label}<p>${getScaleBandExplanation(log, getScaleBand)}</p>`;
}

function point(event) {
  return { x: event.clientX, y: event.clientY };
}

const displayBandOrder = [
  "Subatomic",
  "Atomic",
  "Molecular",
  "Cellular / Microscopic",
  "Human Scale",
  "Planetary",
  "Solar System",
  "Interstellar",
  "Galactic",
  "Cosmic",
];

const highPriorityScaleObjects = new Set([
  "planck-length",
  "proton",
  "electron",
  "hydrogen-atom",
  "water-molecule",
  "dna-width",
  "virus",
  "red-blood-cell",
  "human-hair-width",
  "grain-of-sand",
  "football",
  "basketball",
  "school-bag",
  "notebook",
  "textbook",
  "water-bottle",
  "laptop",
  "chair",
  "desk",
  "door",
  "whiteboard",
  "microscope",
  "football-goal",
  "car",
  "bicycle",
  "school-bus",
  "human",
  "giraffe",
  "elephant",
  "blue-whale",
  "mount-everest",
  "earth",
  "moon",
  "jupiter",
  "sun",
  "earth-sun-distance",
  "solar-system",
  "light-year",
  "milky-way",
  "andromeda",
  "observable-universe",
]);

const lowPriorityScaleObjects = new Set([
  "dust-speck",
  "flour-grain",
  "mustard-seed",
  "chia-seed",
  "peppercorn",
  "staple",
  "button",
  "paperclip",
  "thumbtack",
  "usb-drive",
  "coffee-mug",
  "spoon",
  "fork",
  "toothbrush",
  "student-desk-row",
  "laboratory-table",
  "bus-stop-shelter",
  "traffic-signal",
  "utility-pole",
  "apartment-floor",
  "basketball-court",
  "cricket-pitch",
  "swimming-lane",
  "railway-platform",
  "pedestrian-bridge",
  "city-block",
  "neighborhood",
  "village",
  "rain-cell",
  "football-field",
  "swimming-pool",
  "runway",
  "mountain-range-width",
  "gps-orbit",
  "neptune-orbit",
  "bootes-void",
  "sloan-great-wall",
]);

function buildCuratedDisplayObjects(objects) {
  const candidates = objects
    .filter((object) => !lowPriorityScaleObjects.has(object.id))
    .sort((a, b) => displayScore(b) - displayScore(a));
  const byBand = new Map(displayBandOrder.map((band) => [band, []]));
  for (const object of candidates) {
    const band = displayBandOrder.find((name) => object.scaleBand.startsWith(name)) ?? object.scaleBand;
    if (!byBand.has(band)) byBand.set(band, []);
    byBand.get(band).push(object);
  }

  const ordered = [];
  let moved = true;
  while (moved) {
    moved = false;
    for (const band of displayBandOrder) {
      const bucket = byBand.get(band);
      if (bucket?.length) {
        ordered.push(bucket.shift());
        moved = true;
      }
    }
  }
  return ordered;
}

function displayScore(object) {
  let score = object.importance * 100;
  if (highPriorityScaleObjects.has(object.id)) score += 900;
  if (object.assetPath) score += 90;
  if (object.categoryGroup === "Human Scale") score += 120;
  if (object.categoryGroup === "Planets and Moons") score += 80;
  if (object.categoryGroup === "Stars") score += 60;
  if (object.categoryGroup === "Galaxies") score += 60;
  if (object.name.length > 24) score -= 45;
  return score;
}
