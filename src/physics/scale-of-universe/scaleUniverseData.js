import { formatBestUnit } from "./scaleUniverseUnits.js";
import { localScaleObjectSpecs } from "./scaleUniverseLocalObjects.js";
import { scaleUniverseSpriteSpec } from "./scaleUniverseSpriteCatalog.js";

export const SCALE_MIN_LOG = -35;
export const SCALE_MAX_LOG = 26;

export const scaleBandExplanations = {
  Subatomic: "This scale contains particles smaller than atoms, such as protons, neutrons, and electrons.",
  Atomic: "Atoms are the building blocks of chemical elements and are measured around angstrom scales.",
  Molecular: "Molecules are groups of atoms bonded together, often measured in nanometers.",
  "Cellular / Microscopic": "Cells, microbes, and fine biological structures are usually measured in micrometers.",
  "Human Scale": "These are objects we can see, touch, and measure directly in everyday life.",
  Planetary: "Moons, mountains, and planets are measured in thousands to millions of meters.",
  "Solar System": "Distances become so large that astronomical units help make comparisons easier.",
  Interstellar: "The spaces between stars are so wide that light years become useful.",
  Galactic: "Stars, nebulae, and galaxies require light years and galactic-scale thinking.",
  Cosmic: "This scale includes galaxy clusters, superclusters, and the observable universe.",
};

const baseScaleUniverseObjects = [
  item("proton", "Proton", "Subatomic Particle", 1.7e-15, -420, -90, 10, "A proton is a positively charged particle found in atomic nuclei.", ["Radius is about one femtometer.", "It is built from quarks and gluons.", "It helps define the identity of an element."], "1.7 x 10^-15 m", "particle", "#ff6b6b"),
  item("neutron", "Neutron", "Subatomic Particle", 1.7e-15, -250, 80, 9, "A neutron is a neutral particle found in most atomic nuclei.", ["It is close in size to a proton.", "Free neutrons decay over time.", "Neutrons stabilize many nuclei."], "1.7 x 10^-15 m", "particle", "#b8c7d9"),
  item("electron", "Electron", "Subatomic Particle", 1e-18, 180, -70, 10, "An electron is a tiny negatively charged particle.", ["Its classical radius is extremely small.", "Electrons form clouds around atoms.", "Electric current is often electron motion."], "~10^-18 m scale", "particle", "#ffd60a"),
  item("hydrogen-atom", "Hydrogen Atom", "Atom", 1.06e-10, -260, -120, 10, "Hydrogen is the simplest atom, with one proton and one electron.", ["It is the most abundant element in the universe.", "Atomic size is measured in angstroms.", "Its spectrum helped reveal quantum energy levels."], "1.06 x 10^-10 m", "circle", "#60a5fa"),
  item("carbon-atom", "Carbon Atom", "Atom", 1.4e-10, -50, 105, 8, "Carbon atoms bond in many ways and form the backbone of organic chemistry.", ["Carbon has six protons.", "It can form chains, sheets, and crystals.", "Graphite and diamond are carbon structures."], "1.4 x 10^-10 m", "circle", "#94a3b8"),
  item("water-molecule", "Water Molecule", "Molecule", 2.75e-10, 230, 80, 8, "A water molecule is made of two hydrogen atoms bonded to oxygen.", ["Its polarity helps dissolve many substances.", "It is larger than a single atom.", "Hydrogen bonding shapes water's properties."], "2.75 x 10^-10 m", "circle", "#38bdf8"),
  item("glucose-molecule", "Glucose Molecule", "Molecule", 9e-10, -190, -20, 7, "Glucose is a sugar molecule used by cells for energy.", ["It contains carbon, hydrogen, and oxygen.", "It is roughly nanometer scale.", "It stores chemical energy."], "9 x 10^-10 m", "circle", "#f59e0b"),
  item("dna-width", "DNA Width", "Molecule", 2e-9, 95, -115, 9, "DNA is about two nanometers wide.", ["This width is far below optical microscope resolution.", "DNA stores genetic information.", "The double helix has paired molecular bases."], "2 x 10^-9 m", "dna", "#facc15"),
  item("dna-helix", "DNA Helix", "Molecule", 3.4e-9, 275, 35, 8, "One turn of DNA helix is a few nanometers long.", ["The helix repeats about every 3.4 nm.", "Bases stack along the molecule.", "Molecular scale is visible with advanced instruments."], "3.4 x 10^-9 m", "dna", "#fde047"),
  item("virus", "Virus", "Biology / Microscopic Physics", 1e-7, -300, -80, 9, "A virus is much smaller than most cells.", ["Many viruses are tens to hundreds of nanometers wide.", "They require host cells to reproduce.", "Electron microscopes reveal their structure."], "1 x 10^-7 m", "cell", "#ef4444"),
  item("e-coli", "E. coli", "Biology / Microscopic Physics", 2e-6, -110, 100, 9, "E. coli is a rod-shaped bacterium a few micrometers long.", ["It is larger than most viruses.", "It can be seen with a light microscope.", "Its motion can involve flagella."], "2 x 10^-6 m", "bacteria", "#22c55e"),
  item("red-blood-cell", "Red Blood Cell", "Biology / Microscopic Physics", 7e-6, 110, -70, 10, "A red blood cell carries oxygen through the body.", ["It is roughly 7 micrometers wide.", "It is much larger than most bacteria.", "It can be seen using a microscope."], "7 x 10^-6 m", "cell", "#dc2626"),
  item("white-blood-cell", "White Blood Cell", "Biology / Microscopic Physics", 1.2e-5, 265, 95, 8, "White blood cells help the body fight infection.", ["They are often larger than red blood cells.", "They are part of the immune system.", "Their shape can change during motion."], "1.2 x 10^-5 m", "cell", "#e0f2fe"),
  item("human-hair-width", "Human Hair Width", "Human Scale", 8e-5, -250, -80, 7, "A human hair is tens of micrometers wide.", ["Hair width varies widely.", "It is visible to the eye.", "It is much wider than most cells."], "8 x 10^-5 m", "lineDistance", "#64748b"),
  item("grain-of-sand", "Grain of Sand", "Human Scale", 5e-4, -70, 80, 8, "A grain of sand is about half a millimeter across.", ["Sand grains vary by rock type.", "They are enormous compared with cells.", "Granular materials have interesting physics."], "5 x 10^-4 m", "circle", "#f4c26b"),
  item("ant", "Ant", "Animal", 5e-3, 150, -40, 8, "An ant is millimeter scale.", ["Ant size depends on species.", "Its mass is small but its strength-to-weight ratio is high.", "Motion is strongly affected by friction and surface forces."], "5 x 10^-3 m", "animal", "#111827"),
  item("coin", "Coin", "Everyday Object", 2.4e-2, -220, 95, 7, "A coin is a few centimeters wide.", ["It is human-hand scale.", "Thickness is much smaller than diameter.", "Circular objects help introduce diameter and radius."], "2.4 x 10^-2 m", "circle", "#c0c7d2"),
  item("football", "Football", "Everyday Object", 2.2e-1, 0, -110, 7, "A football is tens of centimeters across.", ["It is close to common classroom scale.", "Its shape is roughly spherical or ellipsoidal.", "It helps compare volume and diameter."], "2.2 x 10^-1 m", "ellipse", "#f97316", spriteOptions("football")),
  item("human", "Human", "Human Scale", 1.7, 220, 50, 10, "A human body is about meter scale.", ["A typical adult is around 1 to 2 meters tall.", "This scale is our everyday reference.", "Many classroom measurements start here."], "1.7 x 10^0 m", "human", "#111827", spriteOptions("human")),
  item("giraffe", "Giraffe", "Animal", 5.5, -260, -70, 8, "A giraffe is one of the tallest living animals.", ["Adult height can exceed 5 meters.", "It is several times taller than a human.", "Animal scale still sits near 10^0 meters."], "5.5 x 10^0 m", "animal", "#d69e2e", spriteOptions("giraffe")),
  item("elephant", "Elephant", "Animal", 6, 40, 90, 8, "An elephant is several meters long.", ["It is one of the largest land animals.", "Its mass is far larger than a human's.", "Biological scaling affects bones and motion."], "6 x 10^0 m", "animal", "#7c8680", spriteOptions("elephant")),
  item("blue-whale", "Blue Whale", "Animal", 3e1, 250, -105, 9, "A blue whale is the largest known animal.", ["It can be around 30 meters long.", "It lives in the ocean.", "Large body size changes heat and motion constraints."], "3 x 10^1 m", "ellipse", "#2563eb", spriteOptions("blue-whale")),
  item("tyrannosaurus-rex", "Tyrannosaurus Rex", "Animal / Fossil", 1.2e1, -150, 110, 8, "Tyrannosaurus rex was a large predatory dinosaur.", ["It was about 12 meters long.", "Its fossils reveal extinct animal scale.", "It is much larger than a human."], "1.2 x 10^1 m", "animal", "#65a30d", spriteOptions("tyrannosaurus-rex")),
  item("mount-everest", "Mount Everest", "Planetary / Earth", 8.849e3, -40, -80, 9, "Mount Everest is Earth's highest mountain above sea level.", ["Its height is about 8.8 km.", "It is tiny compared with Earth's diameter.", "Mountains reveal geological scale."], "8.849 x 10^3 m", "mountain", "#94a3b8"),
  item("earth", "Earth", "Planet", 1.2742e7, -260, 70, 10, "Earth is the planet we live on.", ["Earth's diameter is about 12,742 km.", "Gravity holds its atmosphere and oceans.", "It is small compared with the Sun."], "1.2742 x 10^7 m", "planet", "#22c55e"),
  item("moon", "Moon", "Natural Satellite", 3.474e6, -15, -100, 9, "The Moon is Earth's natural satellite.", ["Its diameter is about 3,474 km.", "Its gravity causes tides with the Sun.", "It is much smaller than Earth."], "3.474 x 10^6 m", "planet", "#cbd5e1"),
  item("jupiter", "Jupiter", "Planet", 1.398e8, 210, 80, 9, "Jupiter is the largest planet in the Solar System.", ["Its diameter is about 140,000 km.", "It is a gas giant.", "It is much larger than Earth."], "1.398 x 10^8 m", "planet", "#f59e0b"),
  item("sun", "Sun", "Star", 1.3927e9, -170, -70, 10, "The Sun is the star at the center of the Solar System.", ["Its diameter is about 1.39 million km.", "Fusion in its core releases energy.", "It dominates Solar System mass."], "1.3927 x 10^9 m", "star", "#facc15"),
  item("sirius", "Sirius", "Star", 2.38e9, 90, 105, 8, "Sirius is a bright star visible from Earth.", ["It is larger than the Sun.", "It appears bright because it is nearby and luminous.", "Star sizes vary greatly."], "2.38 x 10^9 m", "star", "#bfdbfe"),
  item("betelgeuse", "Betelgeuse", "Star", 1.2e12, 270, -85, 9, "Betelgeuse is a red supergiant star.", ["Its size is hundreds of times the Sun's diameter.", "Its exact radius varies by measurement.", "Supergiants show how enormous stars can become."], "~1.2 x 10^12 m", "star", "#fb7185"),
  item("solar-system", "Solar System", "Solar System", 9e12, -280, 60, 10, "The Solar System spans planets, dwarf planets, comets, and outer small bodies.", ["Neptune's orbit is much smaller than the far outer cloud.", "Distances are often measured in astronomical units.", "The Sun is the central mass."], "~9 x 10^12 m", "lineDistance", "#fde68a"),
  item("earth-sun-distance", "Distance from Earth to Sun", "Astronomical Distance", 1.496e11, -40, -90, 10, "One astronomical unit is the average Earth-Sun distance.", ["It is about 150 million km.", "Light takes about 8 minutes to cross it.", "It anchors Solar System distance scales."], "1 AU = 1.496 x 10^11 m", "lineDistance", "#38bdf8"),
  item("light-year", "Light Year", "Astronomical Distance", 9.461e15, 220, 90, 10, "A light year is the distance light travels in one year.", ["It is a distance, not a time.", "It is about 9.46 trillion km.", "Interstellar distances often use light years."], "c x 1 year = 9.461 x 10^15 m", "lineDistance", "#a78bfa"),
  item("milky-way", "Milky Way Galaxy", "Galaxy", 1.05e21, -220, -80, 10, "The Milky Way is our home galaxy.", ["It contains hundreds of billions of stars.", "Its diameter is about 100,000 light years.", "The Sun orbits around its center."], "~1.05 x 10^21 m", "galaxy", "#93c5fd"),
  item("andromeda", "Andromeda Galaxy", "Galaxy", 2.1e21, 45, 95, 9, "Andromeda is a large spiral galaxy near the Milky Way.", ["It is larger than the Milky Way.", "It is on a long-term collision course with our galaxy.", "It is visible under dark skies."], "~2.1 x 10^21 m", "galaxy", "#c4b5fd"),
  item("local-group", "Local Group", "Galaxy Group", 1e23, 250, -70, 9, "The Local Group contains the Milky Way, Andromeda, and many smaller galaxies.", ["It is several million light years across.", "Gravity binds its member galaxies.", "It is part of larger cosmic structure."], "~1 x 10^23 m", "galaxy", "#818cf8"),
  item("virgo-supercluster", "Virgo Supercluster", "Supercluster", 1.05e24, -260, 70, 8, "The Virgo Supercluster is a large collection of galaxy groups and clusters.", ["It includes the Local Group.", "Superclusters reveal cosmic web structure.", "They are not always tightly gravitationally bound."], "~1.05 x 10^24 m", "galaxy", "#60a5fa"),
  item("laniakea", "Laniakea Supercluster", "Supercluster", 5e24, -20, -100, 9, "Laniakea is the large-scale region containing the Milky Way's flow of galaxies.", ["Its name means immense heaven.", "It organizes galaxy motions on huge scales.", "It is hundreds of millions of light years across."], "~5 x 10^24 m", "galaxy", "#a78bfa"),
  item("hercules-corona-borealis", "Hercules-Corona Borealis Great Wall", "Cosmic Structure", 1e26, 205, 85, 8, "This proposed giant structure represents extreme cosmic scale.", ["Its size estimate is enormous and debated.", "Large structures are found through galaxy and gamma-ray burst distributions.", "It approaches observable-universe scale."], "~1 x 10^26 m", "galaxy", "#64748b"),
  item("observable-universe", "Observable Universe", "Cosmic Horizon", 8.8e26, 0, 0, 10, "The observable universe is the region whose light can reach us in principle.", ["Its diameter is about 93 billion light years.", "Expansion affects how distances are measured.", "It is the largest scale in this prototype."], "~8.8 x 10^26 m", "galaxy", "#f8fafc"),
];

const supplementalSpecs = [
  ["planck-length", "Planck Length", "Subatomic Particle", 1.616e-35, "Particles", 10, "A theoretical minimum length scale used in quantum gravity.", "Planck scale"],
  ["atomic-nucleus", "Atomic Nucleus", "Subatomic Particle", 1e-14, "Particles", 9, "The dense central core of an atom.", "Nuclear scale"],
  ["helium-nucleus", "Helium Nucleus", "Subatomic Particle", 3.2e-15, "Particles", 8, "A compact nucleus made of two protons and two neutrons.", "Alpha particle scale"],
  ["quark-scale", "Quark Interaction Scale", "Subatomic Particle", 1e-18, "Particles", 8, "A scale used to discuss quarks inside hadrons.", "Quark scale"],
  ["uranium-atom", "Uranium Atom", "Atom", 3.5e-10, "Atoms", 8, "A large heavy atom used in nuclear physics.", "3.5 x 10^-10 m"],
  ["oxygen-atom", "Oxygen Atom", "Atom", 1.2e-10, "Atoms", 7, "An atom central to water, air, and life chemistry.", "1.2 x 10^-10 m"],
  ["silicon-atom", "Silicon Atom", "Atom", 2.2e-10, "Atoms", 7, "A semiconductor atom important in electronics.", "2.2 x 10^-10 m"],
  ["gold-atom", "Gold Atom", "Atom", 2.9e-10, "Atoms", 7, "A heavy atom familiar from materials and electronics.", "2.9 x 10^-10 m"],
  ["oxygen-molecule", "Oxygen Molecule", "Molecule", 3e-10, "Molecules", 8, "A diatomic molecule needed for respiration.", "3 x 10^-10 m"],
  ["carbon-dioxide", "Carbon Dioxide Molecule", "Molecule", 3.3e-10, "Molecules", 8, "A linear greenhouse gas molecule.", "3.3 x 10^-10 m"],
  ["nitrogen-molecule", "Nitrogen Molecule", "Molecule", 3.1e-10, "Molecules", 7, "The main molecule in Earth's atmosphere.", "3.1 x 10^-10 m"],
  ["caffeine-molecule", "Caffeine Molecule", "Molecule", 1e-9, "Molecules", 7, "A familiar organic molecule at nanometer scale.", "1 x 10^-9 m"],
  ["protein-molecule", "Protein Molecule", "Molecule", 5e-9, "Molecules", 8, "A molecular machine made from folded amino acid chains.", "5 x 10^-9 m"],
  ["hemoglobin", "Hemoglobin Molecule", "Molecule", 6.5e-9, "Molecules", 8, "A protein that carries oxygen in red blood cells.", "6.5 x 10^-9 m"],
  ["ribosome", "Ribosome", "Molecule", 2.5e-8, "Molecules", 8, "A molecular machine that builds proteins.", "2.5 x 10^-8 m"],
  ["cell-membrane", "Cell Membrane Thickness", "Molecule", 8e-9, "Molecules", 7, "A thin molecular boundary surrounding many cells.", "8 x 10^-9 m"],
  ["influenza-virus", "Influenza Virus", "Biology / Microscopic Physics", 1e-7, "Cells and Microbes", 8, "A virus roughly one hundred nanometers across.", "1 x 10^-7 m"],
  ["bacteriophage", "Bacteriophage", "Biology / Microscopic Physics", 2e-7, "Cells and Microbes", 8, "A virus that infects bacteria.", "2 x 10^-7 m"],
  ["coronavirus", "Coronavirus", "Biology / Microscopic Physics", 1.2e-7, "Cells and Microbes", 8, "A spiked virus at nanometer scale.", "1.2 x 10^-7 m"],
  ["yeast-cell", "Yeast Cell", "Biology / Microscopic Physics", 5e-6, "Cells and Microbes", 8, "A single-celled fungus visible under a microscope.", "5 x 10^-6 m"],
  ["platelet", "Blood Platelet", "Biology / Microscopic Physics", 2e-6, "Cells and Microbes", 7, "A tiny blood component involved in clotting.", "2 x 10^-6 m"],
  ["human-egg-cell", "Human Egg Cell", "Biology / Microscopic Physics", 1e-4, "Cells and Microbes", 8, "One of the largest human cells.", "1 x 10^-4 m"],
  ["pollen-grain", "Pollen Grain", "Biology / Microscopic Physics", 3e-5, "Cells and Microbes", 7, "A microscopic plant structure.", "3 x 10^-5 m"],
  ["dust-mite", "Dust Mite", "Biology / Microscopic Physics", 3e-4, "Cells and Microbes", 7, "A tiny animal near the edge of naked-eye visibility.", "3 x 10^-4 m"],
  ["amoeba", "Amoeba", "Biology / Microscopic Physics", 5e-4, "Cells and Microbes", 7, "A single-celled organism that can be hundreds of micrometers wide.", "5 x 10^-4 m"],
  ["salt-crystal", "Salt Crystal", "Everyday Object", 3e-4, "Human Scale", 7, "A visible crystal made from many ions.", "3 x 10^-4 m"],
  ["sesame-seed", "Sesame Seed", "Everyday Object", 3e-3, "Human Scale", 7, "A small seed useful for millimeter comparisons.", "3 x 10^-3 m"],
  ["rice-grain", "Rice Grain", "Everyday Object", 7e-3, "Human Scale", 7, "A familiar grain at millimeter scale.", "7 x 10^-3 m"],
  ["paper-thickness", "Paper Thickness", "Everyday Object", 1e-4, "Human Scale", 7, "A sheet of paper is about a tenth of a millimeter thick.", "1 x 10^-4 m"],
  ["pencil", "Pencil", "Everyday Object", 0.19, "Human Scale", 7, "A classroom object measured in centimeters.", "0.19 m"],
  ["smartphone", "Smartphone", "Everyday Object", 0.16, "Human Scale", 8, "A familiar object at hand scale.", "0.16 m"],
  ["basketball", "Basketball", "Everyday Object", 0.24, "Human Scale", 7, "A ball near a quarter meter in diameter.", "0.24 m"],
  ["honey-bee", "Honey Bee", "Animal", 1.5e-2, "Animals", 8, "A small flying insect measured in centimeters.", "1.5 x 10^-2 m"],
  ["butterfly", "Butterfly Wingspan", "Animal", 7e-2, "Animals", 7, "A small animal wingspan at centimeter scale.", "7 x 10^-2 m"],
  ["mouse", "Mouse", "Animal", 9e-2, "Animals", 7, "A small mammal at decimeter scale.", "9 x 10^-2 m"],
  ["cat", "Cat", "Animal", 0.46, "Animals", 7, "A familiar animal under one meter long.", "0.46 m"],
  ["dog", "Dog", "Animal", 0.9, "Animals", 7, "A common animal near meter scale.", "0.9 m"],
  ["horse", "Horse", "Animal", 2.4, "Animals", 8, "A large animal a few meters long.", "2.4 m"],
  ["school-bus", "School Bus", "Vehicle", 1.1e1, "Human Scale", 8, "A classroom-friendly large vehicle.", "11 m"],
  ["car", "Car", "Vehicle", 4.5, "Human Scale", 8, "A common vehicle several meters long.", "4.5 m"],
  ["bicycle", "Bicycle", "Vehicle", 1.8, "Human Scale", 7, "A human-powered vehicle at meter scale.", "1.8 m"],
  ["house", "House", "Building", 1.2e1, "Earth and Geography", 8, "A building useful for comparing human spaces.", "12 m"],
  ["classroom", "Classroom", "Building", 9, "Earth and Geography", 8, "A familiar room-scale learning space.", "9 m"],
  ["statue-of-liberty", "Statue of Liberty", "Building / Landmark", 9.3e1, "Earth and Geography", 8, "A landmark almost one hundred meters tall.", "93 m"],
  ["eiffel-tower", "Eiffel Tower", "Building / Landmark", 3.3e2, "Earth and Geography", 8, "A tall human-built structure.", "330 m"],
  ["burj-khalifa", "Burj Khalifa", "Building / Landmark", 8.28e2, "Earth and Geography", 9, "One of the tallest buildings on Earth.", "828 m"],
  ["grand-canyon-width", "Grand Canyon Width", "Geography", 2.9e4, "Earth and Geography", 8, "A major canyon width measured in kilometers.", "29 km"],
  ["city", "City", "Geography", 5e4, "Earth and Geography", 8, "A city spans tens of kilometers.", "50 km"],
  ["india-width", "India Width", "Geography", 3e6, "Earth and Geography", 9, "A country-scale distance across India.", "3 x 10^6 m"],
  ["earth-moon-distance", "Earth-Moon Distance", "Astronomical Distance", 3.844e8, "Distances", 9, "The average distance between Earth and the Moon.", "3.844 x 10^8 m"],
  ["mars", "Mars", "Planet", 6.779e6, "Planets and Moons", 8, "A rocky planet smaller than Earth.", "6.779 x 10^6 m"],
  ["venus", "Venus", "Planet", 1.2104e7, "Planets and Moons", 8, "A rocky planet close in size to Earth.", "1.2104 x 10^7 m"],
  ["mercury", "Mercury", "Planet", 4.879e6, "Planets and Moons", 7, "The smallest planet in the Solar System.", "4.879 x 10^6 m"],
  ["saturn", "Saturn", "Planet", 1.1646e8, "Planets and Moons", 9, "A gas giant famous for its rings.", "1.1646 x 10^8 m"],
  ["uranus", "Uranus", "Planet", 5.0724e7, "Planets and Moons", 7, "An ice giant planet.", "5.0724 x 10^7 m"],
  ["neptune", "Neptune", "Planet", 4.9244e7, "Planets and Moons", 7, "A distant ice giant planet.", "4.9244 x 10^7 m"],
  ["neptune-orbit", "Neptune Orbit", "Astronomical Distance", 9e12, "Distances", 8, "The wide orbit of Neptune around the Sun.", "9 x 10^12 m"],
  ["oort-cloud", "Oort Cloud", "Astronomical Distance", 1.5e16, "Distances", 8, "A distant icy reservoir around the Solar System.", "1.5 x 10^16 m"],
  ["pollux", "Pollux", "Star", 1.22e10, "Stars", 8, "An orange giant star larger than the Sun.", "1.22 x 10^10 m"],
  ["arcturus", "Arcturus", "Star", 3.5e10, "Stars", 8, "A bright red giant star.", "3.5 x 10^10 m"],
  ["rigel", "Rigel", "Star", 1.09e11, "Stars", 8, "A luminous blue supergiant.", "1.09 x 10^11 m"],
  ["uy-scuti", "UY Scuti", "Star", 2.4e12, "Stars", 8, "A very large red supergiant star.", "2.4 x 10^12 m"],
  ["stephenson-2-18", "Stephenson 2-18", "Star", 3e12, "Stars", 8, "An extreme red supergiant candidate.", "3 x 10^12 m"],
  ["distance-proxima", "Distance to Proxima Centauri", "Astronomical Distance", 4.01e16, "Distances", 9, "The distance to the nearest known star system.", "4.01 x 10^16 m"],
  ["orion-nebula", "Orion Nebula", "Nebula", 2.27e17, "Galaxies", 8, "A nearby star-forming nebula.", "2.27 x 10^17 m"],
  ["crab-nebula", "Crab Nebula", "Nebula", 1.04e17, "Galaxies", 8, "A supernova remnant in our galaxy.", "1.04 x 10^17 m"],
  ["large-magellanic-cloud", "Large Magellanic Cloud", "Galaxy", 1.3e21, "Galaxies", 8, "A satellite galaxy of the Milky Way.", "1.3 x 10^21 m"],
  ["triangulum-galaxy", "Triangulum Galaxy", "Galaxy", 5.7e20, "Galaxies", 8, "A spiral galaxy in the Local Group.", "5.7 x 10^20 m"],
  ["sloan-great-wall", "Sloan Great Wall", "Cosmic Structure", 1.3e25, "Cosmic Structures", 8, "A huge cosmic web feature.", "1.3 x 10^25 m"],
  ["bootes-void", "Bootes Void", "Cosmic Structure", 3.1e24, "Cosmic Structures", 7, "A vast region with relatively few galaxies.", "3.1 x 10^24 m"],
  ["shapley-supercluster", "Shapley Supercluster", "Cosmic Structure", 6.2e24, "Cosmic Structures", 8, "A massive concentration of galaxies.", "6.2 x 10^24 m"],
  ["cosmic-web-filament", "Cosmic Web Filament", "Cosmic Structure", 2e25, "Cosmic Structures", 8, "A threadlike galaxy structure in the cosmic web.", "2 x 10^25 m"],
  ["football-field", "Football Field", "Everyday Object", 1.05e2, "Human Scale", 7, "A large sports field useful for classroom comparison.", "105 m"],
  ["swimming-pool", "Swimming Pool", "Everyday Object", 5e1, "Human Scale", 7, "A pool length at tens of meters.", "50 m"],
  ["train", "Train", "Vehicle", 2e2, "Human Scale", 7, "A long vehicle made of connected cars.", "200 m"],
  ["airplane", "Passenger Airplane", "Vehicle", 7e1, "Human Scale", 8, "A large aircraft tens of meters long.", "70 m"],
  ["runway", "Airport Runway", "Geography", 3e3, "Earth and Geography", 7, "A runway can be several kilometers long.", "3 km"],
  ["mountain-range-width", "Mountain Range Width", "Geography", 2e5, "Earth and Geography", 7, "A regional landform width.", "200 km"],
  ["earth-atmosphere", "Earth Atmosphere Thickness", "Geography", 1e5, "Earth and Geography", 8, "A simplified useful atmosphere thickness.", "100 km"],
  ["low-earth-orbit", "Low Earth Orbit Height", "Astronomical Distance", 4e5, "Distances", 8, "A common satellite altitude scale.", "400 km"],
  ["gps-orbit", "GPS Orbit Radius", "Astronomical Distance", 2.66e7, "Distances", 7, "The orbital size used by GPS satellites.", "2.66 x 10^7 m"],
  ["asteroid-bennu", "Asteroid Bennu", "Small Solar System Body", 4.9e2, "Planets and Moons", 7, "A small asteroid visited by spacecraft.", "490 m"],
  ["ceres", "Ceres", "Dwarf Planet", 9.4e5, "Planets and Moons", 7, "The largest object in the asteroid belt.", "9.4 x 10^5 m"],
  ["pluto", "Pluto", "Dwarf Planet", 2.377e6, "Planets and Moons", 7, "A dwarf planet in the outer Solar System.", "2.377 x 10^6 m"],
  ["titan", "Titan", "Moon", 5.15e6, "Planets and Moons", 7, "Saturn's large moon with a thick atmosphere.", "5.15 x 10^6 m"],
  ["europa", "Europa", "Moon", 3.12e6, "Planets and Moons", 7, "An icy moon of Jupiter.", "3.12 x 10^6 m"],
  ["black-hole-stellar", "Stellar Black Hole Horizon", "Compact Object", 6e4, "Stars", 8, "A simplified event horizon size for a stellar black hole.", "60 km"],
  ["sagittarius-a", "Sagittarius A* Horizon", "Compact Object", 2.4e10, "Stars", 9, "The black hole at the center of the Milky Way.", "2.4 x 10^10 m"],
  ["planetary-nebula", "Planetary Nebula", "Nebula", 9e15, "Galaxies", 7, "A glowing shell from an aging star.", "9 x 10^15 m"],
  ["globular-cluster", "Globular Cluster", "Star Cluster", 9e17, "Galaxies", 8, "A dense cluster of old stars.", "9 x 10^17 m"],
];

const supplementalObjects = supplementalSpecs.map((spec, index) =>
  item(
    spec[0],
    spec[1],
    spec[2],
    spec[3],
    ((index % 9) - 4) * 86,
    (Math.floor(index / 9) % 7 - 3) * 62,
    spec[5],
    spec[6],
    [
      `${spec[1]} belongs to the ${spec[4]} category.`,
      `Its size is approximately ${spec[7]}.`,
      "Use it as an approximate classroom comparison point.",
    ],
    spec[7],
    renderStyleFor(spec[2], spec[4], spec[1]),
    colorFor(spec[4], index),
    {
      categoryGroup: spec[4],
      ...spriteOptions(spec[0]),
    },
  ),
);

const localScaleObjects = localScaleObjectSpecs.map((spec, index) =>
  item(
    spec[0],
    spec[1],
    spec[2],
    spec[3],
    ((index % 12) - 5.5) * 72,
    (Math.floor(index / 12) % 8 - 3.5) * 56,
    spec[5],
    spec[6],
    [
      `${spec[1]} is a local reference object students can recognize.`,
      `Its largest classroom-useful length is approximately ${scientificLabel(spec[3])}.`,
      "Use it to connect powers of ten to familiar surroundings.",
    ],
    scientificLabel(spec[3]),
    renderStyleFor(spec[2], spec[4], spec[1]),
    colorFor(spec[4], index + supplementalSpecs.length),
    {
      categoryGroup: spec[4],
      ...spriteOptions(spec[0]),
      learningTags: ["local object", "everyday scale", spec[4].toLowerCase()],
    },
  ),
);

export const scaleUniverseObjects = [...baseScaleUniverseObjects, ...supplementalObjects, ...localScaleObjects];

export function normalizedScaleUniverseObjects() {
  return scaleUniverseObjects.map((object) => {
    const enrichment = objectDetailEnrichment[object.id] ?? {};
    const logSize = Number.isFinite(object.logSize) ? object.logSize : Math.log10(object.sizeMeters);
    const scaleBand = scaleBandForLog(logSize);
    const categoryGroup = object.categoryGroup ?? categoryGroupFor(object.category, object.name);
    const learningTags = enrichment.learningTags ?? object.learningTags ?? [
      object.category.toLowerCase(),
      categoryGroup.toLowerCase(),
      scaleBand.toLowerCase(),
    ];
    const bestUnitLabel = formatBestUnit(object.sizeMeters);
    return {
      ...object,
      ...enrichment,
      logSize,
      scaleBand,
      categoryGroup,
      bestUnitLabel,
      difficultyLevel: object.difficultyLevel ?? difficultyFor(logSize, object.importance),
      whyItMatters:
        enrichment.whyItMatters ??
        "This object helps compare sizes across powers of ten.",
      relatedObjects: enrichment.relatedObjects ?? relatedFor(object.id, categoryGroup),
      learningTags,
      searchText: `${object.name} ${object.category} ${categoryGroup} ${scaleBand} ${learningTags.join(" ")} ${bestUnitLabel}`.toLowerCase(),
    };
  });
}

export function getScaleBandExplanation(log, getBand) {
  const band = getBand(log);
  return scaleBandExplanations[band] ?? "This scale helps students compare objects using powers of ten.";
}

const objectDetailEnrichment = {
  proton: {
    whyItMatters: "It anchors the femtometer scale and helps connect nuclear physics to atomic structure.",
    relatedObjects: ["neutron", "electron", "hydrogen-atom"],
    learningTags: ["subatomic", "nucleus", "charge", "femtometer"],
  },
  neutron: {
    whyItMatters: "It shows that atomic nuclei contain neutral matter as well as charged protons.",
    relatedObjects: ["proton", "electron", "carbon-atom"],
    learningTags: ["subatomic", "nucleus", "isotope", "femtometer"],
  },
  electron: {
    whyItMatters: "Electrons connect tiny particle scale to electricity, chemistry, and atomic spectra.",
    relatedObjects: ["proton", "hydrogen-atom", "carbon-atom"],
    learningTags: ["subatomic", "electricity", "charge", "atom"],
  },
  "hydrogen-atom": {
    whyItMatters: "Hydrogen makes atomic scale concrete because it is the simplest atom.",
    relatedObjects: ["proton", "electron", "carbon-atom"],
    learningTags: ["atom", "angstrom", "spectra", "quantum"],
  },
  "carbon-atom": {
    whyItMatters: "Carbon links atomic size to molecules, life, materials, graphite, and diamond.",
    relatedObjects: ["hydrogen-atom", "glucose-molecule", "dna-width"],
    learningTags: ["atom", "chemistry", "bonding", "material"],
  },
  "water-molecule": {
    whyItMatters: "Water helps students see how atoms combine into molecules with new properties.",
    relatedObjects: ["hydrogen-atom", "glucose-molecule", "dna-width"],
    learningTags: ["molecule", "nanometer", "chemistry", "polarity"],
  },
  "glucose-molecule": {
    whyItMatters: "Glucose connects molecular scale to biological energy and cell processes.",
    relatedObjects: ["water-molecule", "dna-width", "red-blood-cell"],
    learningTags: ["molecule", "biology", "energy", "nanometer"],
  },
  "dna-width": {
    whyItMatters: "DNA width shows why molecular biology requires tools beyond ordinary light microscopes.",
    relatedObjects: ["dna-helix", "virus", "e-coli"],
    learningTags: ["dna", "molecule", "nanometer", "genetics"],
  },
  "dna-helix": {
    whyItMatters: "The helix repeat turns abstract genetics into a measurable nanoscale structure.",
    relatedObjects: ["dna-width", "virus", "red-blood-cell"],
    learningTags: ["dna", "helix", "genetics", "nanometer"],
  },
  virus: {
    whyItMatters: "Viruses bridge molecular structures and living cells, making nanometer scale meaningful.",
    relatedObjects: ["dna-width", "e-coli", "red-blood-cell"],
    learningTags: ["virus", "nanometer", "microscope", "biology"],
  },
  "e-coli": {
    whyItMatters: "It helps compare bacteria with viruses, blood cells, and human-scale objects.",
    relatedObjects: ["virus", "red-blood-cell", "white-blood-cell"],
    learningTags: ["bacteria", "micrometer", "cell", "biology"],
  },
  "red-blood-cell": {
    whyItMatters: "It helps students understand micrometer-scale biological structures.",
    relatedObjects: ["white-blood-cell", "e-coli", "human-hair-width"],
    learningTags: ["biology", "microscope", "cell", "micrometer"],
  },
  "white-blood-cell": {
    whyItMatters: "It gives a familiar cell-scale comparison to red blood cells and bacteria.",
    relatedObjects: ["red-blood-cell", "e-coli", "human-hair-width"],
    learningTags: ["biology", "immune", "cell", "micrometer"],
  },
  "human-hair-width": {
    whyItMatters: "Hair width is a visible bridge from microscopic structures to everyday measurement.",
    relatedObjects: ["red-blood-cell", "grain-of-sand", "human"],
    learningTags: ["micrometer", "measurement", "human", "visible"],
  },
  "grain-of-sand": {
    whyItMatters: "A sand grain makes millimeter scale intuitive and links size to granular physics.",
    relatedObjects: ["human-hair-width", "ant", "coin"],
    learningTags: ["millimeter", "granular", "geology", "measurement"],
  },
  ant: {
    whyItMatters: "Ants show how forces, friction, and strength change at small animal scale.",
    relatedObjects: ["grain-of-sand", "coin", "human"],
    learningTags: ["animal", "millimeter", "friction", "motion"],
  },
  coin: {
    whyItMatters: "A coin is a classroom-friendly reference for centimeters, diameter, and scale.",
    relatedObjects: ["grain-of-sand", "football", "human"],
    learningTags: ["centimeter", "diameter", "everyday", "measurement"],
  },
  football: {
    whyItMatters: "It helps connect everyday object size with radius, diameter, surface area, and volume.",
    relatedObjects: ["coin", "human", "elephant"],
    learningTags: ["everyday", "sphere", "centimeter", "volume"],
  },
  human: {
    whyItMatters: "Human size is the reference point students naturally use for all other scales.",
    relatedObjects: ["football", "giraffe", "earth"],
    learningTags: ["meter", "human", "reference", "measurement"],
  },
  giraffe: {
    whyItMatters: "A giraffe shows how meters still cover very different biological sizes.",
    relatedObjects: ["human", "elephant", "blue-whale"],
    learningTags: ["animal", "meter", "biology", "height"],
  },
  elephant: {
    whyItMatters: "Elephants make mass, support, and body scaling easier to discuss.",
    relatedObjects: ["human", "giraffe", "blue-whale"],
    learningTags: ["animal", "meter", "biology", "scaling"],
  },
  "blue-whale": {
    whyItMatters: "It is a powerful comparison for the upper range of living animal size.",
    relatedObjects: ["elephant", "tyrannosaurus-rex", "mount-everest"],
    learningTags: ["animal", "ocean", "meter", "largest"],
  },
  earth: {
    whyItMatters: "Earth makes planetary diameter, gravity, atmosphere, and curvature measurable.",
    relatedObjects: ["moon", "jupiter", "sun"],
    learningTags: ["planet", "diameter", "gravity", "kilometer"],
  },
  moon: {
    whyItMatters: "The Moon helps compare satellites, planets, tides, and orbital distance.",
    relatedObjects: ["earth", "jupiter", "earth-sun-distance"],
    learningTags: ["moon", "satellite", "planetary", "orbit"],
  },
  jupiter: {
    whyItMatters: "Jupiter reveals how large gas giants are compared with Earth.",
    relatedObjects: ["earth", "sun", "solar-system"],
    learningTags: ["planet", "gas giant", "solar system", "diameter"],
  },
  sun: {
    whyItMatters: "The Sun connects planetary scale to stars, fusion, light, and the Solar System.",
    relatedObjects: ["earth", "jupiter", "sirius"],
    learningTags: ["star", "fusion", "solar", "diameter"],
  },
  "earth-sun-distance": {
    whyItMatters: "One astronomical unit is the first practical ruler for Solar System distances.",
    relatedObjects: ["earth", "sun", "solar-system"],
    learningTags: ["astronomical unit", "distance", "solar system", "light"],
  },
  "light-year": {
    whyItMatters: "A light year helps students separate distance from time while studying space.",
    relatedObjects: ["earth-sun-distance", "milky-way", "andromeda"],
    learningTags: ["light year", "distance", "interstellar", "speed of light"],
  },
  "milky-way": {
    whyItMatters: "The Milky Way is the first step from stars to galaxy-scale structure.",
    relatedObjects: ["light-year", "andromeda", "local-group"],
    learningTags: ["galaxy", "stars", "light year", "cosmos"],
  },
  "observable-universe": {
    whyItMatters: "It marks the largest meaningful viewing scale in this classroom explorer.",
    relatedObjects: ["laniakea", "hercules-corona-borealis", "milky-way"],
    learningTags: ["cosmic", "universe", "horizon", "expansion"],
  },
};

function item(id, name, category, sizeMeters, x, y, importance, summary, facts, formula, renderStyle, color, options = {}) {
  return {
    id,
    name,
    category,
    categoryGroup: options.categoryGroup,
    difficultyLevel: options.difficultyLevel,
    assetPath: options.assetPath,
    assetAspect: options.assetAspect,
    assetScale: options.assetScale,
    learningTags: options.learningTags,
    sizeMeters,
    logSize: Math.log10(sizeMeters),
    x,
    y,
    importance,
    summary,
    facts,
    formula,
    renderStyle,
    color,
  };
}

function spriteOptions(assetKey) {
  return scaleUniverseSpriteSpec(assetKey) ?? {};
}

function scaleBandForLog(log) {
  if (log < -12) return "Subatomic";
  if (log < -9) return "Atomic";
  if (log < -6) return "Molecular";
  if (log < -3) return "Cellular / Microscopic";
  if (log < 3) return "Human Scale";
  if (log < 8) return "Planetary";
  if (log < 13) return "Solar System";
  if (log < 18) return "Interstellar";
  if (log < 23) return "Galactic";
  return "Cosmic";
}

function categoryGroupFor(category, name) {
  const text = `${category} ${name}`.toLowerCase();
  if (text.includes("subatomic") || text.includes("particle") || text.includes("nucleus")) return "Particles";
  if (text.includes("atom")) return "Atoms";
  if (text.includes("molecule") || text.includes("dna") || text.includes("protein") || text.includes("ribosome")) return "Molecules";
  if (text.includes("biology") || text.includes("cell") || text.includes("virus") || text.includes("bacteria")) return "Cells and Microbes";
  if (text.includes("animal") || text.includes("whale") || text.includes("giraffe") || text.includes("elephant")) return "Animals";
  if (text.includes("planet") || text.includes("moon") || text.includes("satellite")) return "Planets and Moons";
  if (text.includes("star") || text.includes("black hole")) return "Stars";
  if (text.includes("galaxy") || text.includes("nebula") || text.includes("cluster")) return "Galaxies";
  if (text.includes("cosmic") || text.includes("supercluster") || text.includes("wall") || text.includes("universe")) return "Cosmic Structures";
  if (text.includes("distance") || text.includes("orbit") || text.includes("light year") || text.includes("solar system")) return "Distances";
  if (text.includes("mount") || text.includes("city") || text.includes("geography") || text.includes("building")) return "Earth and Geography";
  return "Human Scale";
}

function difficultyFor(log, importance) {
  if (importance >= 10 || (log > -4 && log < 9)) return "beginner";
  if (log < -12 || log > 22) return "advanced";
  return "intermediate";
}

function relatedFor(id, group) {
  return scaleUniverseObjects.filter((object) => object.id !== id && categoryGroupFor(object.category, object.name) === group).slice(0, 3).map((object) => object.id);
}

function renderStyleFor(category, group, name) {
  const text = `${category} ${group} ${name}`.toLowerCase();
  if (text.includes("atom")) return "atom";
  if (text.includes("molecule") || text.includes("protein") || text.includes("ribosome")) return "molecule";
  if (text.includes("dna")) return "dna";
  if (text.includes("virus")) return "virus";
  if (text.includes("bacteria") || text.includes("e. coli")) return "bacteria";
  if (text.includes("red blood")) return "redBloodCell";
  if (text.includes("white blood")) return "whiteBloodCell";
  if (text.includes("cell")) return "cell";
  if (text.includes("saturn")) return "planetRings";
  if (group === "Planets and Moons") return "planet";
  if (group === "Stars") return "star";
  if (group === "Galaxies") return "galaxy";
  if (group === "Cosmic Structures") return "cosmicStructure";
  if (group === "Distances") return "lineDistance";
  if (text.includes("mount")) return "mountain";
  if (group === "Animals") return "animal";
  if (text.includes("human")) return "human";
  if (text.includes("building") || text.includes("tower") || text.includes("classroom") || text.includes("house")) return "building";
  if (text.includes("vehicle") || text.includes("bus") || text.includes("car") || text.includes("bicycle") || text.includes("airplane") || text.includes("train")) return "vehicle";
  return "circle";
}

function colorFor(group, index) {
  const palettes = {
    Particles: ["#f87171", "#facc15", "#a78bfa"],
    Atoms: ["#60a5fa", "#93c5fd", "#c4b5fd"],
    Molecules: ["#22d3ee", "#facc15", "#34d399"],
    "Cells and Microbes": ["#ef4444", "#22c55e", "#e0f2fe"],
    Animals: ["#d69e2e", "#65a30d", "#7c8680"],
    "Earth and Geography": ["#94a3b8", "#38bdf8", "#f59e0b"],
    "Planets and Moons": ["#22c55e", "#f59e0b", "#cbd5e1"],
    Stars: ["#facc15", "#fb7185", "#bfdbfe"],
    Galaxies: ["#93c5fd", "#c4b5fd", "#818cf8"],
    "Cosmic Structures": ["#64748b", "#a78bfa", "#60a5fa"],
    Distances: ["#38bdf8", "#fde68a", "#a78bfa"],
    "Human Scale": ["#f97316", "#c0c7d2", "#111827"],
  };
  const colors = palettes[group] ?? palettes["Human Scale"];
  return colors[index % colors.length];
}

function scientificLabel(sizeMeters) {
  if (sizeMeters >= 0.01 && sizeMeters < 1000) return `${Number(sizeMeters.toPrecision(3))} m`;
  return `${sizeMeters.toExponential(2).replace("e", " x 10^")} m`;
}
