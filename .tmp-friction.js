"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/lib/frictionStudio.ts
var frictionStudio_exports = {};
__export(frictionStudio_exports, {
  FRICTION_DEFAULTS: () => FRICTION_DEFAULTS,
  frictionStudioSettings: () => frictionStudioSettings,
  frictionStudioSolution: () => frictionStudioSolution
});
module.exports = __toCommonJS(frictionStudio_exports);
var FRICTION_DEFAULTS = { normal: 10, pull: 0, surface: "wood" };
var COEFF = { wood: [0.5, 0.36], metal: [0.15, 0.1], rubber: [1, 0.8] };
function frictionStudioSettings(v) {
  return { normal: Math.round(Math.min(30, Math.max(0, Number.isFinite(v.normal) ? v.normal : 10)) * 10) / 10, pull: Math.round(Math.min(30, Math.max(0, Number.isFinite(v.pull) ? v.pull : 0)) * 10) / 10, surface: v.surface in COEFF ? v.surface : "wood" };
}
function frictionStudioSolution(raw) {
  const input = frictionStudioSettings(raw), [muS, muK] = COEFF[input.surface], staticLimit = muS * input.normal, kinetic = muK * input.normal, moving = input.pull > staticLimit, friction = moving ? -kinetic : -input.pull;
  return { input, muS, muK, staticLimit, kinetic, friction, net: input.pull + friction, moving };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FRICTION_DEFAULTS,
  frictionStudioSettings,
  frictionStudioSolution
});
