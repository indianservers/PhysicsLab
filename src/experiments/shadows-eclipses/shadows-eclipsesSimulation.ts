import { runBenchmarkCases } from "../shared/validation";

export type EclipseMode = "solar" | "lunar";
export type EclipseInput = {
  mode: EclipseMode;
  sunRadiusScale: number;
  moonDistanceScale: number;
  alignmentDeg: number;
  observerLatitudeDeg: number;
};

export const astronomicalConstants = {
  sunRadiusKm: 696_340,
  earthRadiusKm: 6_371,
  moonRadiusKm: 1_737.4,
  astronomicalUnitKm: 149_597_870.7,
  meanMoonDistanceKm: 384_400,
};

const rad = (degrees: number) => (degrees * Math.PI) / 180;
const deg = (radians: number) => (radians * 180) / Math.PI;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function angularDiameterDeg(radiusKm: number, distanceKm: number) {
  return deg(2 * Math.atan(radiusKm / distanceKm));
}

export function solveEclipse(input: EclipseInput) {
  const {
    earthRadiusKm,
    moonRadiusKm,
    astronomicalUnitKm,
    meanMoonDistanceKm,
  } = astronomicalConstants;
  const sunRadiusKm = astronomicalConstants.sunRadiusKm * input.sunRadiusScale;
  const moonDistanceKm = meanMoonDistanceKm * input.moonDistanceScale;
  const sunAngularDiameterDeg = angularDiameterDeg(
    sunRadiusKm,
    astronomicalUnitKm,
  );
  const moonAngularDiameterDeg = angularDiameterDeg(
    moonRadiusKm,
    moonDistanceKm,
  );
  const horizontalParallaxDeg = deg(Math.asin(earthRadiusKm / moonDistanceKm));
  const observerParallaxDeg =
    horizontalParallaxDeg * Math.sin(rad(input.observerLatitudeDeg));
  const apparentSeparationDeg = Math.abs(
    input.alignmentDeg - observerParallaxDeg,
  );
  const sunAngularRadiusDeg = sunAngularDiameterDeg / 2;
  const moonAngularRadiusDeg = moonAngularDiameterDeg / 2;

  let solarType: "none" | "partial" | "annular" | "total" = "none";
  if (apparentSeparationDeg < sunAngularRadiusDeg + moonAngularRadiusDeg) {
    if (
      apparentSeparationDeg <=
      Math.abs(moonAngularRadiusDeg - sunAngularRadiusDeg)
    )
      solarType =
        moonAngularRadiusDeg >= sunAngularRadiusDeg ? "total" : "annular";
    else solarType = "partial";
  }

  const sunMoonDistanceKm = astronomicalUnitKm - moonDistanceKm;
  const moonUmbraLengthKm =
    (sunMoonDistanceKm * moonRadiusKm) / (sunRadiusKm - moonRadiusKm);
  const signedUmbraRadiusAtEarthKm =
    moonRadiusKm -
    (moonDistanceKm * (sunRadiusKm - moonRadiusKm)) / sunMoonDistanceKm;
  const penumbraRadiusAtEarthKm =
    moonRadiusKm +
    (moonDistanceKm * (sunRadiusKm + moonRadiusKm)) / sunMoonDistanceKm;

  const earthUmbraLengthKm =
    (astronomicalUnitKm * earthRadiusKm) / (sunRadiusKm - earthRadiusKm);
  const earthUmbraRadiusAtMoonKm =
    earthRadiusKm -
    (moonDistanceKm * (sunRadiusKm - earthRadiusKm)) / astronomicalUnitKm;
  const earthPenumbraRadiusAtMoonKm =
    earthRadiusKm +
    (moonDistanceKm * (sunRadiusKm + earthRadiusKm)) / astronomicalUnitKm;
  const moonOffsetKm = Math.abs(
    moonDistanceKm * Math.tan(rad(input.alignmentDeg)),
  );
  let lunarType: "none" | "penumbral" | "partial" | "total" = "none";
  if (moonOffsetKm + moonRadiusKm <= earthUmbraRadiusAtMoonKm)
    lunarType = "total";
  else if (moonOffsetKm < earthUmbraRadiusAtMoonKm + moonRadiusKm)
    lunarType = "partial";
  else if (moonOffsetKm < earthPenumbraRadiusAtMoonKm + moonRadiusKm)
    lunarType = "penumbral";

  const eclipseType = input.mode === "solar" ? solarType : lunarType;
  const bodyOrder =
    input.mode === "solar" ? "Sun → Moon → Earth" : "Sun → Earth → Moon";
  const angularSizeDifferenceDeg =
    moonAngularDiameterDeg - sunAngularDiameterDeg;
  const totalityCenterLatitudeDeg = deg(
    Math.asin(clamp(input.alignmentDeg / horizontalParallaxDeg, -1, 1)),
  );
  const centralCondition =
    apparentSeparationDeg <=
    Math.abs(moonAngularRadiusDeg - sunAngularRadiusDeg);

  return {
    ...input,
    sunRadiusKm,
    moonDistanceKm,
    sunAngularDiameterDeg,
    moonAngularDiameterDeg,
    angularSizeDifferenceDeg,
    horizontalParallaxDeg,
    observerParallaxDeg,
    apparentSeparationDeg,
    solarType,
    lunarType,
    eclipseType,
    bodyOrder,
    centralCondition,
    totalityCenterLatitudeDeg,
    moonUmbraLengthKm,
    signedUmbraRadiusAtEarthKm,
    penumbraRadiusAtEarthKm,
    earthUmbraLengthKm,
    earthUmbraRadiusAtMoonKm,
    earthPenumbraRadiusAtMoonKm,
    moonOffsetKm,
  };
}

export const shadowsEclipsesBenchmarks = runBenchmarkCases([
  {
    id: "solar-order",
    name: "solar eclipse has Moon between Sun and Earth",
    input: { value: 1 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: () =>
      solveEclipse({
        mode: "solar",
        sunRadiusScale: 1,
        moonDistanceScale: 0.94,
        alignmentDeg: 0,
        observerLatitudeDeg: 0,
      }).bodyOrder === "Sun → Moon → Earth"
        ? 1
        : 0,
  },
  {
    id: "lunar-order",
    name: "lunar eclipse has Earth between Sun and Moon",
    input: { value: 1 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: () =>
      solveEclipse({
        mode: "lunar",
        sunRadiusScale: 1,
        moonDistanceScale: 1,
        alignmentDeg: 0,
        observerLatitudeDeg: 0,
      }).bodyOrder === "Sun → Earth → Moon"
        ? 1
        : 0,
  },
  {
    id: "total-angular-size",
    name: "central larger apparent Moon produces total solar eclipse",
    input: { moonDistanceScale: 0.94 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (value) => {
      const result = solveEclipse({
        mode: "solar",
        sunRadiusScale: 1,
        moonDistanceScale: value.moonDistanceScale!,
        alignmentDeg: 0,
        observerLatitudeDeg: 0,
      });
      return result.eclipseType === "total" &&
        result.angularSizeDifferenceDeg > 0
        ? 1
        : 0;
    },
  },
  {
    id: "annular-angular-size",
    name: "central smaller apparent Moon produces annular eclipse",
    input: { moonDistanceScale: 1.08 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (value) =>
      solveEclipse({
        mode: "solar",
        sunRadiusScale: 1,
        moonDistanceScale: value.moonDistanceScale!,
        alignmentDeg: 0,
        observerLatitudeDeg: 0,
      }).eclipseType === "annular"
        ? 1
        : 0,
  },
  {
    id: "lunar-totality",
    name: "aligned Moon fits inside Earth's umbra",
    input: { alignment: 0 },
    expected: 1,
    unit: "boolean",
    tolerance: 0,
    actual: (value) =>
      solveEclipse({
        mode: "lunar",
        sunRadiusScale: 1,
        moonDistanceScale: 1,
        alignmentDeg: value.alignment!,
        observerLatitudeDeg: 0,
      }).eclipseType === "total"
        ? 1
        : 0,
  },
]);
