import { PhysicsIconName } from "./icons";

export interface AstroConcept {
  id: string;
  title: string;
  category: string;
  icon: PhysicsIconName;
  summary: string;
  explanation: string;
  keyIdeas: string[];
  formula?: string;
  visual: "orbit" | "star" | "black-hole" | "wave" | "galaxy" | "field" | "spectrum" | "planet";
  scale: "Solar System" | "Stellar" | "Galactic" | "Cosmic" | "Observation";
  observe: string;
  misconception: string;
  tryThis: string;
}

const concept = (
  id: string,
  title: string,
  category: string,
  icon: PhysicsIconName,
  summary: string,
  explanation: string,
  keyIdeas: string[],
  formula: string | undefined,
  visual: AstroConcept["visual"],
  scale: AstroConcept["scale"],
  observe: string,
  misconception: string,
  tryThis: string,
): AstroConcept => ({
  id,
  title,
  category,
  icon,
  summary,
  explanation,
  keyIdeas,
  formula,
  visual,
  scale,
  observe,
  misconception,
  tryThis,
});

export const astrophysicsConcepts: AstroConcept[] = [
  concept("gravity-orbits", "Gravity & Orbits", "Celestial Mechanics", "orbit", "How masses attract and move around each other.", "Astrophysics begins with gravity: planets orbit stars, moons orbit planets, and galaxies hold together because mass curves motion into orbital paths.", ["Newtonian gravity", "Kepler laws", "escape speed"], "F = GMm / r^2", "orbit", "Solar System", "Orbital speed falls as orbital radius increases.", "Orbiting objects are not gravity-free; they are falling around the central body.", "Double the orbital distance and compare force, speed, and period."),
  concept("kepler-laws", "Kepler's Laws", "Celestial Mechanics", "orbit", "Planetary motion in ellipses, equal areas, and period-distance scaling.", "Kepler's laws connect observed planet paths with gravity. The third law makes orbital period scale with the 3/2 power of semi-major axis around the Sun.", ["elliptical orbit", "area law", "T^2 proportional a^3"], "T^2 proportional a^3", "orbit", "Solar System", "Farther planets move more slowly but travel much longer paths.", "Planets do not move in perfect circles at constant speed.", "Compare Earth, Mars, Jupiter, and Neptune in the order strip."),
  concept("escape-speed", "Escape Speed", "Celestial Mechanics", "rocket", "Minimum launch speed to avoid falling back without more thrust.", "Escape speed depends on mass and radius. Compact objects require extreme speeds because gravity changes very quickly near small radii.", ["gravitational energy", "launch speed", "compactness"], "v_e = sqrt(2GM / r)", "orbit", "Solar System", "Escape speed rises for larger mass and smaller radius.", "Escape speed is not the same as orbital speed.", "Use Earth and a neutron star as contrast cases."),
  concept("tidal-forces", "Tidal Forces", "Celestial Mechanics", "wave", "Gravity differences across an object stretch and squeeze it.", "Tidal forces create ocean tides, heat moons, disrupt stars near black holes, and shape rings around planets.", ["gravity gradient", "Roche limit", "spaghettification"], undefined, "field", "Solar System", "The near side and far side feel slightly different gravity.", "Tides are not only water effects; they affect rocks, moons, stars, and galaxies.", "Move the same object closer to a compact mass in your notes and predict stretching."),
  concept("solar-system", "Solar System Architecture", "Planetary Systems", "sun", "A star, eight planets, small bodies, belts, and distant icy reservoirs.", "The Solar System is ordered by temperature, orbital period, composition, and formation history, from rocky inner planets to gas giants and icy outer worlds.", ["terrestrial planets", "gas giants", "Kuiper belt"], undefined, "planet", "Solar System", "Inner planets are rocky; outer major planets are larger and colder.", "The asteroid belt is not packed like a wall of rocks.", "Trace the planet order and note how orbital period grows."),
  concept("planetary-atmospheres", "Planetary Atmospheres", "Planetary Systems", "field", "Gas layers shaped by gravity, temperature, chemistry, and solar radiation.", "Atmospheres determine surface pressure, greenhouse heating, cloud structure, escape to space, and whether liquid water can persist.", ["greenhouse effect", "escape velocity", "pressure"], undefined, "planet", "Solar System", "Low gravity and high temperature make atmospheric escape easier.", "A thick atmosphere is not automatically life-friendly.", "Compare Venus, Earth, Mars, and Titan."),
  concept("exoplanets", "Exoplanets", "Planetary Systems", "orbit", "Planets orbiting stars beyond the Sun.", "Astrophysicists find exoplanets using transits, radial velocity shifts, imaging, and gravitational microlensing.", ["transit method", "radial velocity", "habitable zone"], undefined, "planet", "Observation", "A transit is a tiny, repeated dip in starlight.", "The habitable zone does not prove life exists.", "Estimate what happens to a transit dip when planet radius doubles."),
  concept("transit-method", "Transit Method", "Observation", "chart", "Planet size from the dip it makes while crossing a star.", "The fractional brightness dip is approximately the square of the planet-to-star radius ratio for a central transit.", ["light curve", "planet radius", "orbital period"], "dip approx (R_p / R_star)^2", "spectrum", "Observation", "Larger planets block more light; repeated dips reveal period.", "A single dip is not enough to confirm a planet.", "Sketch three dips and infer the orbital period."),
  concept("stellar-luminosity", "Stellar Luminosity", "Stars", "sun", "The total energy a star emits every second.", "Luminosity lets astronomers compare stars even when they are at different distances. A star's radius and surface temperature strongly control its brightness.", ["blackbody radiation", "stellar radius", "temperature"], "L = 4 pi R^2 sigma T^4", "star", "Stellar", "Temperature matters strongly because luminosity scales as T^4.", "A star that looks bright in the sky is not always intrinsically luminous.", "Increase temperature by 2x and watch luminosity rise by 16x."),
  concept("main-sequence", "Main Sequence Stars", "Stars", "sun", "Stable stars that fuse hydrogen in their cores.", "Most stars spend the majority of their lives on the main sequence, balancing inward gravity with outward pressure from nuclear fusion.", ["hydrogen fusion", "hydrostatic equilibrium", "mass-luminosity relation"], undefined, "star", "Stellar", "Mass controls lifetime, temperature, and luminosity.", "Bigger stars do not live longer; they burn fuel much faster.", "Compare a red dwarf with an O-type star."),
  concept("stellar-evolution", "Stellar Evolution", "Stars", "flame", "The life cycle from nebula to remnant.", "A star's mass decides whether it becomes a white dwarf, neutron star, or black hole after its fuel changes and the core can no longer support itself.", ["protostar", "red giant", "supernova", "remnant"], undefined, "star", "Stellar", "Mass decides the path after the main sequence.", "All stars do not explode as supernovae.", "Sort low-mass and high-mass stars into final remnants."),
  concept("supernovae", "Supernovae", "Stars", "flame", "Explosive deaths of massive or compact stars.", "Supernovae forge and spread heavy elements, trigger new star formation, and act as distance markers in cosmology.", ["core collapse", "Type Ia", "heavy elements"], undefined, "star", "Stellar", "Supernovae enrich gas clouds with heavy elements.", "A supernova is not simply a bigger ordinary nova.", "Link one supernova to element formation and distance measurement."),
  concept("nucleosynthesis", "Nucleosynthesis", "Stars", "atom", "Formation of elements in stars and explosions.", "Light elements formed early, while stars, supernovae, and neutron-star mergers build heavier nuclei through fusion and neutron-capture processes.", ["fusion", "heavy elements", "stellar cores"], undefined, "star", "Stellar", "Different environments make different nuclei.", "The Big Bang did not make most heavy elements.", "Trace hydrogen to helium, carbon, iron, and gold sources."),
  concept("white-dwarfs", "White Dwarfs", "Compact Objects", "moon", "Dense Earth-sized remnants supported by electron degeneracy.", "A white dwarf forms from a low- or medium-mass star core. If it gains too much mass, it can trigger a Type Ia supernova.", ["degeneracy pressure", "Chandrasekhar limit", "cooling remnant"], undefined, "star", "Stellar", "White dwarfs are small but very dense.", "They are not tiny normal stars still doing hydrogen fusion.", "Compare radius and mass with Earth and the Sun."),
  concept("neutron-stars", "Neutron Stars", "Compact Objects", "atom", "Ultra-dense stellar remnants.", "After some supernovae, the collapsed core becomes a neutron star, packing stellar mass into a city-sized sphere.", ["degenerate matter", "pulsars", "strong magnetic fields"], undefined, "field", "Stellar", "Small radius plus high mass creates extreme density.", "A neutron star is not an oversized atomic nucleus, though densities are nuclear-like.", "Estimate density if solar mass is squeezed into 12 km radius."),
  concept("pulsars", "Pulsars", "Compact Objects", "volume", "Rotating neutron stars that sweep radio beams like lighthouses.", "Pulses arrive with high regularity because a magnetized neutron star rotates while its radiation beam crosses Earth.", ["radio pulses", "rotation", "magnetosphere"], undefined, "wave", "Stellar", "Pulse period tells rotation speed.", "The star does not physically turn on and off each pulse.", "Model a flashlight beam rotating across a wall."),
  concept("black-holes", "Black Holes", "Relativity", "orbit", "Regions where escape speed exceeds light speed.", "A black hole forms when gravity compresses mass inside an event horizon. Outside it, motion can still be described by gravity and orbital dynamics.", ["event horizon", "Schwarzschild radius", "accretion disk"], "R_s = 2GM / c^2", "black-hole", "Stellar", "Event horizon size grows linearly with mass.", "Black holes do not suck in everything from any distance.", "Change black-hole mass and calculate horizon radius."),
  concept("accretion-disks", "Accretion Disks", "Compact Objects", "orbit", "Hot rotating gas around compact objects.", "Gas falling toward a black hole, neutron star, or white dwarf forms a disk. Friction and magnetic turbulence heat it until it glows intensely.", ["angular momentum", "thermal radiation", "jets"], undefined, "black-hole", "Stellar", "The inner disk is hotter and faster.", "The disk is not the event horizon.", "Compare disk color near and far from the center."),
  concept("gravitational-lensing", "Gravitational Lensing", "Relativity", "eye", "Light bends around mass.", "Massive objects curve spacetime, bending light from objects behind them. Lensing can magnify galaxies and map dark matter.", ["spacetime curvature", "Einstein ring", "mass mapping"], undefined, "field", "Cosmic", "A foreground mass can create arcs, rings, or multiple images.", "Lensing does not require glass; gravity changes light paths.", "Draw source, lens, and observer in one line."),
  concept("general-relativity", "General Relativity", "Relativity", "field", "Gravity as curvature of spacetime.", "General relativity replaces gravity as a pull with motion through curved spacetime caused by mass and energy.", ["spacetime", "geodesics", "curvature"], "G_mu_nu + Lambda g_mu_nu = 8 pi G T_mu_nu / c^4", "field", "Cosmic", "Free-fall paths are straightest possible paths in curved spacetime.", "The rubber-sheet picture is a metaphor, not the full theory.", "Use it to connect black holes, lensing, and expansion."),
  concept("gravitational-waves", "Gravitational Waves", "Relativity", "wave", "Ripples in spacetime from accelerating masses.", "Compact-object mergers create waves that stretch and squeeze space by tiny amounts as they pass detectors.", ["strain", "binary merger", "LIGO"], "strain h = Delta L / L", "wave", "Cosmic", "The signal chirps upward as orbiting bodies spiral inward.", "They are not sound waves travelling through air.", "Match a rising chirp to a shrinking binary orbit."),
  concept("redshift", "Redshift", "Cosmology", "wave", "Stretching of light toward longer wavelengths.", "Redshift reveals motion, gravity, and cosmic expansion. Distant galaxies are redshifted because space itself has expanded while their light travelled.", ["Doppler shift", "cosmic expansion", "spectral lines"], "z = Delta lambda / lambda", "spectrum", "Cosmic", "Spectral lines shift together toward longer wavelengths.", "Redshift is not only caused by ordinary motion through space.", "Calculate z from observed and rest wavelengths."),
  concept("hubble-law", "Hubble's Law", "Cosmology", "chart", "Distant galaxies recede faster on average.", "Hubble's law is one of the central observational clues that the universe is expanding and that distance can be estimated from recession speed.", ["expanding universe", "galaxy distance", "Hubble constant"], "v = H_0 d", "galaxy", "Cosmic", "Recession speed grows with distance in the nearby universe.", "Galaxies are not exploding from a central point into empty space.", "Move distance from 10 to 1000 Mpc and compare speed."),
  concept("big-bang", "Big Bang Model", "Cosmology", "spark", "The universe evolved from a hot, dense early state.", "The Big Bang model explains expansion, light element abundance, and the cosmic microwave background.", ["hot early universe", "expansion", "light elements"], undefined, "wave", "Cosmic", "The model describes expansion of space, not an explosion in space.", "It does not say the universe expanded from a point into pre-existing emptiness.", "Connect CMB, redshift, and nucleosynthesis as evidence."),
  concept("cosmic-microwave-background", "Cosmic Microwave Background", "Cosmology", "volume", "Ancient afterglow from the early universe.", "The CMB is cooled radiation from when the universe became transparent, carrying a map of tiny density variations that grew into galaxies.", ["early universe", "recombination", "temperature anisotropy"], "T approx 2.725 K", "wave", "Cosmic", "Tiny temperature variations seeded later structure.", "The CMB is not light from stars.", "Relate 2.725 K to microwave wavelengths."),
  concept("dark-matter", "Dark Matter", "Cosmology", "field", "Invisible mass inferred from gravity.", "Galaxy rotation curves and gravitational lensing show more gravity than visible matter can explain, suggesting a non-luminous matter component.", ["rotation curves", "lensing", "missing mass"], undefined, "field", "Galactic", "Outer galaxy stars orbit faster than visible mass predicts.", "Dark matter is not ordinary dark gas or dust in enough quantity.", "Compare a falling rotation curve with an observed flat curve."),
  concept("dark-energy", "Dark Energy", "Cosmology", "spark", "The driver of accelerated cosmic expansion.", "Observations of distant supernovae indicate that cosmic expansion is accelerating, commonly modeled as dark energy or a cosmological constant.", ["accelerating universe", "supernova evidence", "cosmological constant"], undefined, "galaxy", "Cosmic", "Expansion acceleration appears on cosmic scales.", "Dark energy is not the same as dark matter.", "Sort evidence: rotation curves for dark matter, supernova distances for dark energy."),
  concept("galaxy-structure", "Galaxy Structure", "Galaxies", "orbit", "How stars, gas, dust, and dark matter organize.", "Galaxies may be spiral, elliptical, or irregular, and their structure records formation history and environment.", ["spiral arms", "bulge", "halo", "dark matter"], undefined, "galaxy", "Galactic", "Spiral arms, bulge, disk, and halo play different roles.", "Spiral arms are not rigid material arms.", "Label the Milky Way as disk, bulge, halo, and arm."),
  concept("milky-way", "The Milky Way", "Galaxies", "orbit", "Our barred spiral galaxy, about 100,000 light-years wide.", "We live inside a thin stellar disk, so the Milky Way appears as a bright river of stars across dark skies.", ["barred spiral", "thin disk", "galactic center"], undefined, "galaxy", "Galactic", "The disk is much wider than it is thick.", "The Milky Way is not the whole universe.", "Compare a 100,000 light-year width with a 1,000 light-year thickness."),
  concept("cosmic-web", "Cosmic Web", "Cosmology", "field", "Large-scale network of filaments, clusters, and voids.", "Galaxies are arranged in a web-like structure shaped by gravity acting on early density variations.", ["filaments", "voids", "clusters"], undefined, "galaxy", "Cosmic", "Matter clusters along filaments around low-density voids.", "The universe is not uniformly sprinkled with galaxies at all scales.", "Sketch nodes, filaments, and voids from a galaxy map."),
  concept("quasars", "Quasars", "Galaxies", "spark", "Extremely bright active galactic nuclei.", "Quasars are powered by accretion onto supermassive black holes, making them visible across enormous distances.", ["active galaxy", "supermassive black hole", "jets"], undefined, "black-hole", "Cosmic", "Huge luminosity can come from a small central region.", "A quasar is not a single super-bright normal star.", "Connect accretion disk energy to quasar brightness."),
  concept("distance-ladder", "Cosmic Distance Ladder", "Observation", "ruler", "Linked methods for measuring astronomical distances.", "Nearby parallax measurements calibrate standard candles, which then calibrate farther distance methods.", ["parallax", "Cepheids", "supernovae"], "m - M = 5 log10(d) - 5", "spectrum", "Observation", "Each method calibrates the next farther method.", "There is no single ruler for all cosmic distances.", "Order parallax, Cepheids, Type Ia supernovae, and Hubble law."),
  concept("spectroscopy", "Astronomical Spectroscopy", "Observation", "prism", "Using spectra to decode objects in space.", "Spectral lines reveal composition, temperature, motion, magnetic fields, and pressure in distant stars and galaxies.", ["absorption lines", "emission lines", "chemical composition"], undefined, "spectrum", "Observation", "Line positions identify elements; shifts reveal motion.", "Astronomers do not need to touch a star to know its composition.", "Shift a hydrogen line and identify redshift."),
  concept("parallax", "Stellar Parallax", "Observation", "ruler", "Nearby star distance from apparent position shift.", "As Earth orbits the Sun, nearby stars appear to shift against distant background stars. Smaller parallax means larger distance.", ["baseline", "arcsecond", "parsec"], "d(pc) = 1 / p(arcsec)", "spectrum", "Observation", "Parallax gets smaller as distance grows.", "Parallax is not useful for every distant galaxy.", "Calculate distance for 0.5, 0.1, and 0.01 arcsecond."),
  concept("radio-astronomy", "Radio Astronomy", "Observation", "wave", "Studying the universe with long-wavelength light.", "Radio telescopes reveal cold gas, pulsars, jets, magnetic fields, and the cosmic microwave background.", ["21 cm line", "pulsars", "interferometry"], undefined, "wave", "Observation", "Long wavelengths can map gas invisible to optical telescopes.", "Radio astronomy is not listening to ordinary sound from space.", "Compare optical image data with a radio map."),
  concept("space-telescopes", "Space Telescopes", "Observation", "eye", "Observatories above Earth's atmosphere.", "Space telescopes avoid atmospheric blur and absorption, opening infrared, ultraviolet, X-ray, and precision visible observations.", ["atmospheric absorption", "infrared", "deep field"], undefined, "spectrum", "Observation", "Different wavelengths reveal different physical processes.", "A larger telescope is not always enough if atmosphere blocks the light.", "Match UV, visible, infrared, and X-ray to astrophysical sources."),
  concept("cosmic-rays", "Cosmic Rays", "High-Energy Astrophysics", "spark", "High-energy particles arriving from space.", "Cosmic rays are mostly protons and nuclei accelerated by energetic astrophysical sources such as supernova remnants and active galaxies.", ["charged particles", "air showers", "acceleration"], undefined, "field", "Cosmic", "Charged particles make cascades in the atmosphere.", "Cosmic rays are particles, not just electromagnetic rays.", "Trace one high-energy proton into an air shower."),
  concept("gamma-ray-bursts", "Gamma-Ray Bursts", "High-Energy Astrophysics", "spark", "Brief extreme flashes of gamma radiation.", "Gamma-ray bursts are linked to massive star collapse or compact-object mergers and can outshine galaxies for seconds.", ["jets", "compact merger", "massive star collapse"], undefined, "wave", "Cosmic", "Short and long bursts point to different source families.", "They are not nearby atmospheric lightning events.", "Classify burst duration as short or long and infer a likely source."),
];

export const astroCategories = Array.from(new Set(astrophysicsConcepts.map((concept) => concept.category))).sort();
export const astroScales = Array.from(new Set(astrophysicsConcepts.map((concept) => concept.scale))).sort();

export const solarSystemBodies = [
  { name: "Sun", type: "Star", distanceAu: 0, radiusKm: 696340, note: "Central mass and energy source.", color: "#fde047" },
  { name: "Mercury", type: "Rocky planet", distanceAu: 0.39, radiusKm: 2440, note: "Smallest planet and closest to the Sun.", color: "#a3a3a3" },
  { name: "Venus", type: "Rocky planet", distanceAu: 0.72, radiusKm: 6052, note: "Thick CO2 atmosphere and strong greenhouse heating.", color: "#f59e0b" },
  { name: "Earth", type: "Rocky planet", distanceAu: 1, radiusKm: 6371, note: "Liquid water surface and active biosphere.", color: "#38bdf8" },
  { name: "Mars", type: "Rocky planet", distanceAu: 1.52, radiusKm: 3390, note: "Cold, thin atmosphere and ancient water evidence.", color: "#ef4444" },
  { name: "Jupiter", type: "Gas giant", distanceAu: 5.2, radiusKm: 69911, note: "Largest planet with strong gravity and storms.", color: "#f97316" },
  { name: "Saturn", type: "Gas giant", distanceAu: 9.58, radiusKm: 58232, note: "Bright ring system and many moons.", color: "#facc15" },
  { name: "Uranus", type: "Ice giant", distanceAu: 19.2, radiusKm: 25362, note: "Tilted rotation and methane-blue color.", color: "#67e8f9" },
  { name: "Neptune", type: "Ice giant", distanceAu: 30.05, radiusKm: 24622, note: "Distant windy ice giant.", color: "#2563eb" },
];

export const cosmicTimeline = [
  { label: "Big Bang", age: "0 s", detail: "Hot, dense early state begins expansion." },
  { label: "First nuclei", age: "3 min", detail: "Hydrogen, helium, and traces of lithium form." },
  { label: "CMB released", age: "380,000 yr", detail: "Atoms form and light travels freely." },
  { label: "First stars", age: "~100 Myr", detail: "Gravity lights the first stellar furnaces." },
  { label: "Galaxies grow", age: "1-5 Gyr", detail: "Stars, gas, black holes, and dark matter build galaxies." },
  { label: "Solar System", age: "9.2 Gyr", detail: "The Sun and planets form from a molecular cloud." },
  { label: "Today", age: "13.8 Gyr", detail: "Expansion is accelerating on cosmic scales." },
];

export const astroVisualAssets = [
  {
    id: "cosmic-timeline",
    title: "Age of the Universe",
    category: "Cosmology",
    path: "/assets/astrophysics/cosmic-timeline.png",
    summary: "A visual timeline from the hot early universe to galaxies, the Solar System, Earth, and Moon.",
    conceptIds: ["big-bang", "cosmic-microwave-background", "milky-way", "solar-system"],
  },
  {
    id: "galaxy-atlas",
    title: "Galaxy Atlas",
    category: "Galaxies",
    path: "/assets/astrophysics/galaxy-atlas.png",
    summary: "Morphology board for spiral, barred spiral, elliptical, irregular, lenticular, interacting, ring, and starburst galaxies.",
    conceptIds: ["galaxy-structure", "milky-way", "cosmic-web", "quasars"],
  },
  {
    id: "stellar-life-cycle",
    title: "Stellar Life Cycle",
    category: "Stars",
    path: "/assets/astrophysics/stellar-life-cycle.png",
    summary: "Branching stellar evolution from molecular cloud and protostar to white dwarf, neutron star, pulsar, or black hole.",
    conceptIds: ["stellar-evolution", "main-sequence", "supernovae", "neutron-stars", "black-holes"],
  },
  {
    id: "black-hole-lensing",
    title: "Black Hole Lensing",
    category: "Relativity",
    path: "/assets/astrophysics/black-hole-lensing.png",
    summary: "Black-hole accretion disk, gravitational lensing arcs, and a curved spacetime grid.",
    conceptIds: ["black-holes", "accretion-disks", "gravitational-lensing", "general-relativity"],
  },
];

export const astroQuickLinks = [
  { label: "Formulas", path: "/formulas?category=relativity-astrophysics" },
  { label: "Graphs", path: "/graphs?category=Astronomy" },
  { label: "Scale Explorer", path: "/physics/scale-of-universe" },
  { label: "Experiments", path: "/experiments?domain=Astronomy" },
  { label: "Dictionary", path: "/dictionary?term=black%20hole" },
];
