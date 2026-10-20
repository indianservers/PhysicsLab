// Reference dimensions are SI lengths. Generic objects are illustrative specimens,
// never claims that every member of a class has one universal dimension.
export const scienceSources = {
  planets: { sourceName: "NASA JPL — volumetric mean radii (diameters = 2r)", sourceUrl: "https://ssd.jpl.nasa.gov/planets/phys_par.html" },
  planck: { sourceName: "NIST CODATA — Planck length", sourceUrl: "https://physics.nist.gov/cgi-bin/cuu/Value?plkl" },
  dna: { sourceName: "NCBI Bookshelf — Heredity, Genes, and DNA", sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK9944/" },
  universe: { sourceName: "NASA — How Big Is Space?", sourceUrl: "https://www.nasa.gov/science-research/astrophysics/how-big-is-space-we-asked-a-nasa-expert-episode-61/" },
  liberty: { sourceName: "US National Park Service — Statue of Liberty facts", sourceUrl: "https://www.nps.gov/stli/learn/statue-of-liberty-facts.htm" },
  eiffel: { sourceName: "Société d’Exploitation de la Tour Eiffel — key figures", sourceUrl: "https://www.toureiffel.paris/en/the-monument/key-figures" },
  burj: { sourceName: "Emaar — Burj Khalifa fact sheet", sourceUrl: "https://bk.emaar.com/en/assets/FACT-SHEET.pdf" },
  sun: { sourceName: "NASA Science — Sun facts", sourceUrl: "https://science.nasa.gov/sun/facts/" },
  au: { sourceName: "NASA JPL — IAU astronomical unit definition", sourceUrl: "https://ssd.jpl.nasa.gov/glossary/au.html" },
  lightYear: { sourceName: "NASA Science — What is a light-year?", sourceUrl: "https://science.nasa.gov/exoplanets/what-is-a-light-year/" },
  nearbyGalaxies: { sourceName: "ESO — A Cosmic Zoo in the Large Magellanic Cloud", sourceUrl: "https://www.eso.org/public/news/eso1021/" },
  crab: { sourceName: "NASA Hubble — Zoom into the Crab Nebula", sourceUrl: "https://science.nasa.gov/asset/hubble/zoom-into-the-crab-nebula/" },
};

const verified = {
  "planck-length": [1.616255e-35, "length", "planck", "Theoretical length derived from constants; not a resolved particle or a proven minimum length."],
  mercury: [4.8788e6, "diameter", "planets"], venus: [1.21036e7, "diameter", "planets"],
  earth: [1.27420168e7, "diameter", "planets"], mars: [6.779e6, "diameter", "planets"],
  jupiter: [1.39822e8, "diameter", "planets"], saturn: [1.16464e8, "diameter", "planets", "Volumetric mean globe diameter; rings are excluded."],
  uranus: [5.0724e7, "diameter", "planets"], neptune: [4.9244e7, "diameter", "planets"],
  ceres: [9.394e5, "diameter", "planets"], pluto: [2.3766e6, "diameter", "planets"],
  sun: [1.4e9, "diameter", "sun", "Approximate photospheric diameter, rounded to NASA’s reference value; diffuse atmospheric layers extend farther."],
  "earth-sun-distance": [1.495978707e11, "distance", "au", "One astronomical unit is exactly 149,597,870,700 m by convention; actual Earth–Sun separation varies over the orbit."],
  "light-year": [9.46e15, "distance", "lightYear", "Approximate distance light travels in one year; this is a length, not a time interval."],
  "large-magellanic-cloud": [1.3e20, "diameter", "nearbyGalaxies", "Approximate visible stellar extent, about 14,000 light-years; excludes the extended gaseous halo. Corrects a factor-of-ten error in the legacy catalog."],
  "milky-way": [9.46e20, "diameter", "nearbyGalaxies", "Approximate 100,000-light-year stellar-disk diameter; excludes the much larger dark-matter halo."],
  "crab-nebula": [1.04e17, "width", "crab", "Approximate 11-light-year extent of the expanding remnant; wavelength, boundary and epoch affect the measurement."],
  "dna-width": [2e-9, "width", "dna", "Approximate B-DNA double-helix diameter; not total molecule length."],
  "dna-helix": [3.4e-9, "length", "dna", "Axial length of one B-DNA helical turn; not the entire strand."],
  "observable-universe": [8.8e26, "diameter", "universe", "Approximate present-day comoving diameter, about 93 billion light-years; model dependent, not the age of the universe."],
  "statue-of-liberty": [92.9894, "height", "liberty", "Ground to torch, including pedestal."],
  "eiffel-tower": [330, "height", "eiffel", "Overall height including antenna."],
  "burj-khalifa": [828, "height", "burj", "Architectural height including spire."],
};

const conventions = {
  electron: ["extent", "Experimental resolution reference, not an electron diameter. Fundamental electrons are point-like in the Standard Model; this is not a measured radius."],
  "quark-scale": ["extent", "Interaction-scale reference only. Quarks have no established hard-sphere diameter."],
  "quark-interaction-scale": ["extent", "Interaction-scale reference only. Quarks have no established hard-sphere diameter."],
  proton: ["diameter", "Approximate twice the proton charge radius; diffuse charge distribution, not a hard surface."],
  neutron: ["diameter", "Illustrative nucleon extent; a neutron has no hard boundary."],
  "solar-system": ["extent", "Diameter of the planetary region out to approximately Neptune’s orbit; excludes the Oort cloud."],
  "earth-sun-distance": ["distance", "Mean Earth–Sun separation, approximately one astronomical unit."],
  "earth-moon-distance": ["distance", "Mean center-to-center separation; varies over the orbit."],
  "neptune-orbit": ["diameter", "Diameter of the orbital path, approximately twice the semimajor axis; not Neptune’s diameter."],
  "oort-cloud": ["radius", "Assumed outer radius of the Oort cloud; highly uncertain and boundary dependent."],
  "low-earth-orbit": ["height", "Illustrative altitude of 400 km above Earth’s surface. LEO spans a range; this is not the instantaneous ISS altitude."],
  "gps-orbit": ["radius", "Approximate Earth-center orbital radius; not altitude above the surface."],
  "black-hole-stellar": ["eventHorizonDiameter", "Schwarzschild horizon diameter for an illustrative roughly 10 solar-mass non-rotating black hole; apparent shadow is larger."],
  "sagittarius-a": ["eventHorizonDiameter", "Approximate Schwarzschild-equivalent diameter for about 4 million solar masses; not the observed shadow diameter. Spin changes the horizon."],
  "mount-everest": ["height", "Summit elevation above mean sea level; not mountain width or base-to-summit relief."],
  "earth-atmosphere": ["thickness", "100 km is a conventional space boundary reference, not the physical end of the atmosphere."],
  "milky-way": ["diameter", "Approximate stellar-disk diameter; excludes the larger dark-matter halo."],
  andromeda: ["diameter", "Approximate stellar-disk extent; boundary dependent, excludes halo."],
  football: ["diameter", "Association football (soccer) reference diameter, about 22 cm; not an American football."],
  "basketball-hoop": ["height", "Rim height above the floor, not hoop diameter."],
  "human-hair-width": ["width", "Representative hair shaft width; varies between people."],
  "paper-thickness": ["thickness", "Representative single-sheet thickness; paper grades vary."],
  "cell-membrane": ["thickness", "Representative lipid-bilayer thickness; composition and measurement convention vary."],
  "cell-membrane-thickness": ["thickness", "Representative lipid-bilayer thickness; composition and measurement convention vary."],
  "ceiling-fan": ["diameter", "Blade-tip swept diameter, not height above the floor."],
  "whiteboard": ["width", "Representative horizontal board width, not diagonal or area."],
  "classroom-window": ["width", "Representative horizontal window width, not height."],
  "basketball": ["diameter", "Approximate outside diameter; ball sizes vary by regulation and age group."],
  "coin": ["diameter", "Representative coin diameter; denomination is not specified."],
  "ribosome": ["diameter", "Representative ribosome extent; organism, subunits and conformation affect dimensions."],
  "football-field": ["length", "Reference association-football pitch length; not American football. Pitch dimensions vary within permitted ranges."],
  butterfly: ["wingspan", "Illustrative wingspan; no species is specified."],
};
const tallIds = new Set(["human", "giraffe", "chair", "door", "microscope", "water-bottle", "desk-lamp", "school-bag", "coffee-mug", "ceiling-fan", "small-tree", "mango-tree", "coconut-tree", "street-light", "utility-pole", "cell-tower", "water-tower", "wind-turbine", "apartment-floor", "two-storey-house", "school-building"]);

export function scientificMetadata(object) {
  const spec = verified[object.id];
  const convention = conventions[object.id];
  const spherical = ["Planet", "Moon", "Natural Satellite", "Dwarf Planet", "Star", "Atom", "Subatomic Particle"].includes(object.category);
  const measurementType = spec?.[1] ?? convention?.[0] ?? (tallIds.has(object.id) ? "height" : spherical ? "diameter" : /Width/.test(object.name) ? "width" : /Galaxy|Nebula|Cosmic|Supercluster|Group|Geography|Atmosphere/.test(object.category) ? "extent" : "length");
  const definition = spec?.[3] ?? convention?.[1] ?? (object.category === "Atom" ? "Effective atomic diameter; electron probability distributions have no fixed surface and are not classical orbits." : `Representative ${measurementType}; the named specimen, model, species or boundary is not specified.`);
  const disputed = /hercules|great-wall/.test(object.id);
  const uncertainStar = ["betelgeuse", "uy-scuti", "stephenson-2-18"].includes(object.id);
  return {
    sizeMeters: spec?.[0] ?? object.sizeMeters,
    measurementType, dimensionAxis: measurementType === "height" ? "vertical" : measurementType === "diameter" ? "diameter" : "horizontal",
    estimated: true,
    measurementDefinition: definition,
    uncertainty: disputed ? "Proposed large-scale structure; extent, statistical significance and boundaries are disputed." : uncertainStar ? "Highly uncertain stellar photospheric diameter; distance, variability and model assumptions affect the estimate." : definition,
    validationStatus: spec ? "source-checked reference" : "reference estimate — source review pending",
    ...(spec ? scienceSources[spec[2]] : { sourceName: "Existing educational catalog — independent measurement source pending", sourceUrl: null }),
    scientificExplanation: `${object.summary} ${definition}`,
    visualType: object.category === "Astronomical Distance" ? "measurement-path" : "reference-illustration",
    aliases: ({ "red-blood-cell": ["RBC"], "dna-width": ["DNA"], "dna-helix": ["DNA"], "sagittarius-a": ["Sgr A*", "Sagittarius A*"], "earth-moon-distance": ["Earth-Moon"], "laniakea": ["Laniakea"], "low-earth-orbit": ["ISS altitude reference"] })[object.id] ?? [],
  };
}
