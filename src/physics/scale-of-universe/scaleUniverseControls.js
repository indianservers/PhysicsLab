import { SCALE_MAX_LOG, SCALE_MIN_LOG } from "./scaleUniverseData.js";
import { clamp } from "./scaleUniverseRenderer.js";

export function createScaleSlider(slider, state, onChange) {
  const track = slider.querySelector(".scale-slider-track");
  const fill = slider.querySelector(".scale-slider-fill");
  const thumb = slider.querySelector(".scale-slider-thumb");
  const tickLayer = slider.querySelector(".scale-slider-ticks");
  let dragging = false;

  const updateVisual = () => {
    const percent = ((state.targetLog - SCALE_MIN_LOG) / (SCALE_MAX_LOG - SCALE_MIN_LOG)) * 100;
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

  renderTicks(tickLayer);
  track.addEventListener("pointerdown", down);
  track.addEventListener("pointermove", move);
  track.addEventListener("pointerup", up);
  track.addEventListener("pointercancel", up);
  updateVisual();

  return {
    updateVisual,
    destroy() {
      track.removeEventListener("pointerdown", down);
      track.removeEventListener("pointermove", move);
      track.removeEventListener("pointerup", up);
      track.removeEventListener("pointercancel", up);
    },
  };
}

function pointX(event) {
  return event.clientX;
}

function renderTicks(tickLayer) {
  if (!tickLayer) return;
  const ticks = [
    ["Subatomic", -15],
    ["Atomic", -10],
    ["Molecular", -8],
    ["Cell", -5],
    ["Human", 0],
    ["Planet", 7],
    ["Solar", 12],
    ["Galaxy", 21],
    ["Cosmic", 25],
  ];
  tickLayer.innerHTML = ticks
    .map(([label, log]) => {
      const left = ((log - SCALE_MIN_LOG) / (SCALE_MAX_LOG - SCALE_MIN_LOG)) * 100;
      return `<span style="left:${left}%"><i></i><em>${label}</em></span>`;
    })
    .join("");
}
