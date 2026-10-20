import { SCALE_MAX_LOG, SCALE_MIN_LOG } from "./scaleUniverseData.js";
import { clamp } from "./scaleUniverseRenderer.js";

export function createScaleSlider(slider, state, onChange) {
  const track = slider.querySelector(".scale-slider-track");
  const fill = slider.querySelector(".scale-slider-fill");
  const thumb = slider.querySelector(".scale-slider-thumb");
  const tickLayer = slider.querySelector(".scale-slider-ticks");
  let dragging = false;
  track.tabIndex = 0;
  track.setAttribute("role", "slider");
  track.setAttribute("aria-label", "Logarithmic reference length in meters");
  track.setAttribute("aria-valuemin", String(SCALE_MIN_LOG));
  track.setAttribute("aria-valuemax", String(SCALE_MAX_LOG));

  const updateVisual = () => {
    const percent = ((state.currentLog - SCALE_MIN_LOG) / (SCALE_MAX_LOG - SCALE_MIN_LOG)) * 100;
    track.setAttribute("aria-valuenow", state.currentLog.toFixed(2));
    track.setAttribute("aria-valuetext", `10 to the power ${state.currentLog.toFixed(2)} meters`);
    fill.style.width = `${percent}%`;
    thumb.style.left = `${percent}%`;
    thumb.innerHTML = `<strong>10<sup>${Math.round(state.targetLog)}</sup></strong><span>${state.scaleBand ?? "meters"}</span>`;
  };

  const setFromPoint = (clientX) => {
    const rect = track.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    state.targetLog = SCALE_MIN_LOG + ratio * (SCALE_MAX_LOG - SCALE_MIN_LOG);
    onChange(state.targetLog);
    updateVisual();
  };

  const down = (event) => {
    dragging = true;
    setFromPoint(pointX(event));
    track.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  };
  const move = (event) => {
    if (!dragging) return;
    setFromPoint(pointX(event));
    event.preventDefault();
  };
  const up = () => { dragging = false; };
  const keydown = event => {
    const keys = { ArrowRight: .25, ArrowLeft: -.25, ArrowUp: -.25, ArrowDown: .25, PageUp: -3, PageDown: 3 };
    if (event.key === "Home") onChange(SCALE_MIN_LOG);
    else if (event.key === "End") onChange(SCALE_MAX_LOG);
    else if (keys[event.key] !== undefined) onChange(clamp(state.targetLog + keys[event.key], SCALE_MIN_LOG, SCALE_MAX_LOG));
    else return;
    event.preventDefault(); event.stopPropagation();
  };

  renderTicks(tickLayer);
  track.addEventListener("pointerdown", down);
  track.addEventListener("pointermove", move);
  track.addEventListener("pointerup", up);
  track.addEventListener("pointercancel", up);
  track.addEventListener("keydown", keydown);
  updateVisual();

  return {
    updateVisual,
    destroy() {
      track.removeEventListener("pointerdown", down);
      track.removeEventListener("pointermove", move);
      track.removeEventListener("pointerup", up);
      track.removeEventListener("pointercancel", up);
      track.removeEventListener("keydown", keydown);
    },
  };
}

function pointX(event) {
  return event.clientX;
}

function renderTicks(tickLayer) {
  if (!tickLayer) return;
  const ticks = Array.from({ length: SCALE_MAX_LOG - SCALE_MIN_LOG + 1 }, (_, i) => SCALE_MIN_LOG + i);
  tickLayer.innerHTML = ticks.map(log => {
    const left = ((log - SCALE_MIN_LOG) / (SCALE_MAX_LOG - SCALE_MIN_LOG)) * 100;
    const major = log % 3 === 0 || log === SCALE_MIN_LOG || log === SCALE_MAX_LOG;
    return `<span class="${major ? "major" : "minor"}" style="left:${left}%"><i></i><em>10<sup>${log}</sup></em></span>`;
  }).join("");
}
