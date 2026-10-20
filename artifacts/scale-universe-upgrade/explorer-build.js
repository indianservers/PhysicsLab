var Xh=[on("Meter","m",1,"everyday classroom measurements","Human"),on("Millimeter","mm",.001,"small visible objects","Grain of Sand"),on("Micrometer","um",1e-6,"cells and bacteria","Red Blood Cell"),on("Nanometer","nm",1e-9,"molecules and DNA","DNA Width"),on("Picometer","pm",1e-12,"atoms and atomic bonds","Hydrogen Atom"),on("Femtometer","fm",1e-15,"atomic nuclei and nucleons","Proton"),on("Kilometer","km",1e3,"geography and planetary surfaces","Mount Everest"),on("Astronomical Unit","AU",1496e8,"Solar System distances","Distance from Earth to Sun"),on("Light Year","ly",9461e12,"interstellar and galactic distances","Light Year"),on("Parsec","pc",3086e13,"astronomy and star distances","distance set by 1 arcsecond parallax")];function Ls(n){let e=Math.abs(n);if(!Number.isFinite(e)||e===0)return"0 m";let i=[{limit:1e-13,factor:1e-15,symbol:"fm"},{limit:1e-10,factor:1e-12,symbol:"pm"},{limit:1e-7,factor:1e-9,symbol:"nm"},{limit:1e-4,factor:1e-6,symbol:"um"},{limit:1,factor:.001,symbol:"mm"},{limit:1e3,factor:1,symbol:"m"},{limit:1e8,factor:1e3,symbol:"km"},{limit:1e10,factor:1e9,symbol:"Gm"},{limit:5e14,factor:149597870700,symbol:"AU"},{limit:2e17,factor:9461e12,symbol:"ly"},{limit:1/0,factor:3086e13,symbol:"pc"}].find(r=>e<r.limit),s=n/i.factor;return`${Ml(s)} ${i.symbol}`}function Sl(){return Xh.map(n=>`
        <article>
          <strong>${n.name}</strong>
          <span>${n.symbol}</span>
          <p>1 ${n.symbol} = ${Ml(n.meters)} m</p>
          <small>Useful for ${n.usefulFor}. Example: ${n.example}.</small>
        </article>
      `).join("")}function on(n,e,t,i,s){return{name:n,symbol:e,meters:t,usefulFor:i,example:s}}function Ml(n){if(n===0)return"0";let e=Math.abs(n);if(e>=1e3||e<.01)return n.toExponential(2).replace("e"," x 10^");let t=n.toFixed(e>=100?0:e>=10?1:2);return t.includes(".")?t.replace(/0+$/,"").replace(/\.$/,""):t}var Al=[["needle-tip","Needle Tip","Everyday Object",1e-4,"Human Scale",7,"A sharp metal tip useful for comparing sub-millimeter sizes."],["dust-speck","Dust Speck","Everyday Object",5e-5,"Human Scale",7,"A small visible speck near the limit of everyday sight."],["flour-grain","Flour Grain","Everyday Object",15e-5,"Human Scale",7,"A tiny food particle only a fraction of a millimeter across."],["sugar-crystal","Sugar Crystal","Everyday Object",6e-4,"Human Scale",7,"A small crystal made from many sugar molecules."],["mustard-seed","Mustard Seed","Everyday Object",.0015,"Human Scale",7,"A familiar seed measured in millimeters."],["chia-seed","Chia Seed","Everyday Object",.002,"Human Scale",7,"A tiny seed that helps compare small visible objects."],["lentil","Lentil","Everyday Object",.005,"Human Scale",7,"A small food item near half a centimeter wide."],["peppercorn","Peppercorn","Everyday Object",.005,"Human Scale",7,"A small round spice at millimeter scale."],["eraser","Eraser","Everyday Object",.04,"Human Scale",7,"A classroom object measured in centimeters."],["paperclip","Paper Clip","Everyday Object",.033,"Human Scale",7,"A small bent wire object used to compare centimeters."],["thumbtack","Thumbtack","Everyday Object",.012,"Human Scale",7,"A small pin-like object near centimeter scale."],["staple","Staple","Everyday Object",.013,"Human Scale",7,"A small metal fastener a little over one centimeter wide."],["button","Button","Everyday Object",.018,"Human Scale",7,"A small clothing fastener at centimeter scale."],["marble","Marble","Everyday Object",.016,"Human Scale",7,"A small glass sphere useful for radius and diameter comparisons."],["dice","Dice","Everyday Object",.016,"Human Scale",7,"A cube-shaped object with equal side lengths."],["battery-aa","AA Battery","Everyday Object",.05,"Human Scale",7,"A common cylindrical battery roughly five centimeters long."],["chalk-stick","Chalk Stick","Everyday Object",.08,"Human Scale",7,"A classroom object about the length of a hand."],["usb-drive","USB Drive","Everyday Object",.06,"Human Scale",7,"A small storage device at centimeter scale."],["key","Key","Everyday Object",.06,"Human Scale",7,"A metal object that fits easily in the hand."],["spoon","Spoon","Everyday Object",.18,"Human Scale",7,"A utensil measured in tens of centimeters."],["fork","Fork","Everyday Object",.19,"Human Scale",7,"A utensil slightly longer than many pencils."],["toothbrush","Toothbrush","Everyday Object",.18,"Human Scale",7,"A personal object at decimeter scale."],["calculator","Calculator","Everyday Object",.15,"Human Scale",7,"A classroom device that fits in one hand."],["notebook","Notebook","Everyday Object",.24,"Human Scale",7,"A page-sized object useful for area comparisons."],["textbook","Textbook","Everyday Object",.28,"Human Scale",7,"A book-sized classroom object at decimeter scale."],["water-bottle","Water Bottle","Everyday Object",.25,"Human Scale",7,"A common bottle roughly a quarter meter tall."],["coffee-mug","Coffee Mug","Everyday Object",.11,"Human Scale",7,"A cup-sized object that helps compare decimeter lengths."],["desk-lamp","Desk Lamp","Everyday Object",.4,"Human Scale",7,"A tabletop lamp around half a meter tall."],["school-bag","School Bag","Everyday Object",.45,"Human Scale",7,"A carried object close to torso scale."],["laptop","Laptop","Everyday Object",.35,"Human Scale",8,"A familiar computer measured in tens of centimeters."],["tablet","Tablet","Everyday Object",.25,"Human Scale",7,"A flat handheld device at decimeter scale."],["monitor","Computer Monitor","Everyday Object",.6,"Human Scale",7,"A desktop display about half a meter across."],["chair","Chair","Furniture",.9,"Human Scale",7,"A seat that connects furniture scale to human body scale."],["desk","Desk","Furniture",1.2,"Human Scale",7,"A classroom table near meter scale."],["door","Door","Building Part",2.1,"Human Scale",8,"A human-height opening useful for comparing body scale."],["whiteboard","Whiteboard","Building Part",2.4,"Human Scale",7,"A classroom board a few meters across."],["ceiling-fan","Ceiling Fan","Everyday Object",1.2,"Human Scale",7,"A rotating object near meter scale."],["classroom-window","Classroom Window","Building Part",1.5,"Human Scale",7,"A window about the size of a person."],["student-desk-row","Student Desk Row","Classroom Object",5,"Human Scale",7,"A row of desks spanning several meters."],["laboratory-table","Laboratory Table","Classroom Object",2.4,"Human Scale",7,"A workbench-sized object used in science rooms."],["microscope","Microscope","Scientific Instrument",.4,"Human Scale",8,"A classroom instrument used to observe microscopic objects."],["telescope","Small Telescope","Scientific Instrument",.9,"Human Scale",8,"An optical instrument near meter scale."],["football-goal","Football Goal","Sports Object",7.3,"Human Scale",7,"A sports structure several meters wide."],["basketball-hoop","Basketball Hoop","Sports Object",3.05,"Human Scale",7,"A regulation hoop height just over three meters."],["cricket-bat","Cricket Bat","Sports Object",.97,"Human Scale",7,"A handheld sports object close to one meter long."],["tennis-racket","Tennis Racket","Sports Object",.69,"Human Scale",7,"A sports object around two-thirds of a meter long."],["skateboard","Skateboard","Vehicle",.8,"Human Scale",7,"A small wheeled board below one meter long."],["scooter","Scooter","Vehicle",1.1,"Human Scale",7,"A compact vehicle near meter scale."],["motorbike","Motorbike","Vehicle",2.1,"Human Scale",7,"A two-wheeled vehicle a few meters long."],["auto-rickshaw","Auto Rickshaw","Vehicle",2.6,"Human Scale",7,"A compact three-wheeled vehicle."],["minivan","Minivan","Vehicle",4.8,"Human Scale",7,"A family vehicle slightly larger than a car."],["bus-stop-shelter","Bus Stop Shelter","Building / Landmark",5,"Earth and Geography",7,"A small street structure at human scale."],["traffic-signal","Traffic Signal","Building / Landmark",4.5,"Earth and Geography",7,"A roadside signal structure taller than a person."],["street-light","Street Light","Building / Landmark",8,"Earth and Geography",7,"A pole-mounted light at small infrastructure scale."],["utility-pole","Utility Pole","Building / Landmark",12,"Earth and Geography",7,"A tall pole that carries wires above streets."],["small-tree","Small Tree","Plant",4,"Earth and Geography",7,"A young tree a few meters tall."],["mango-tree","Mango Tree","Plant",15,"Earth and Geography",7,"A mature fruit tree at house scale."],["coconut-tree","Coconut Tree","Plant",25,"Earth and Geography",7,"A tall palm tree at tens of meters scale."],["garden-bench","Garden Bench","Everyday Object",1.8,"Human Scale",7,"A public seat close to human body scale."],["playground-slide","Playground Slide","Building / Landmark",4,"Earth and Geography",7,"A small playground structure."],["water-tank","Water Tank","Building / Landmark",3,"Earth and Geography",7,"A storage tank a few meters across."],["apartment-floor","Apartment Floor Height","Building / Landmark",3.2,"Earth and Geography",7,"A single floor height in a building."],["two-storey-house","Two Storey House","Building / Landmark",7,"Earth and Geography",8,"A small building measured in meters."],["school-building","School Building","Building / Landmark",30,"Earth and Geography",8,"A familiar campus building at tens of meters scale."],["basketball-court","Basketball Court","Sports Object",28,"Earth and Geography",7,"A court almost thirty meters long."],["cricket-pitch","Cricket Pitch","Sports Object",20.12,"Earth and Geography",7,"A standard pitch about twenty meters long."],["swimming-lane","Swimming Lane","Sports Object",50,"Earth and Geography",7,"A pool lane length at tens of meters scale."],["metro-train-car","Metro Train Car","Vehicle",22,"Human Scale",7,"A rail car about twenty meters long."],["railway-platform","Railway Platform","Building / Landmark",200,"Earth and Geography",7,"A long platform spanning hundreds of meters."],["pedestrian-bridge","Pedestrian Bridge","Building / Landmark",40,"Earth and Geography",7,"A small bridge at street scale."],["cell-tower","Cell Tower","Building / Landmark",40,"Earth and Geography",7,"A tower used for wireless communication."],["wind-turbine","Wind Turbine","Building / Landmark",120,"Earth and Geography",8,"A large machine that converts wind energy into electricity."],["solar-panel-row","Solar Panel Row","Building / Landmark",20,"Earth and Geography",7,"A row of solar panels at tens of meters scale."],["water-tower","Water Tower","Building / Landmark",50,"Earth and Geography",7,"An elevated water storage structure."],["radio-telescope-dish","Radio Telescope Dish","Scientific Instrument",100,"Earth and Geography",8,"A large dish that detects radio waves from space."],["small-pond","Small Pond","Geography",30,"Earth and Geography",7,"A small body of water at local outdoor scale."],["city-block","City Block","Geography",120,"Earth and Geography",7,"A city block is a useful urban distance."],["neighborhood","Neighborhood","Geography",1e3,"Earth and Geography",7,"A local area about a kilometer across."],["village","Village","Geography",2e3,"Earth and Geography",7,"A settlement measured in kilometers."],["stadium","Stadium","Building / Landmark",200,"Earth and Geography",8,"A large sports venue at hundreds of meters scale."],["airport-terminal","Airport Terminal","Building / Landmark",500,"Earth and Geography",7,"A large transportation building."],["harbor-ship","Harbor Ship","Vehicle",150,"Human Scale",7,"A large ship seen at harbor scale."],["cargo-ship","Cargo Ship","Vehicle",300,"Human Scale",8,"A very large ship hundreds of meters long."],["dam","Dam","Building / Landmark",200,"Earth and Geography",8,"A major structure that holds back water."],["bridge-span","Bridge Span","Building / Landmark",1e3,"Earth and Geography",8,"A large bridge span can reach kilometer scale."],["hill","Hill","Geography",300,"Earth and Geography",7,"A local landform smaller than a mountain."],["river-width","River Width","Geography",500,"Earth and Geography",7,"A wide river crossing measured in hundreds of meters."],["lake","Lake","Geography",1e4,"Earth and Geography",8,"A lake can span many kilometers."],["island","Island","Geography",5e4,"Earth and Geography",8,"An island can span city to regional scale."],["cloud","Cloud","Atmosphere",1e3,"Earth and Geography",7,"A cloud can be around a kilometer wide."],["rain-cell","Rain Cell","Atmosphere",5e3,"Earth and Geography",7,"A local rain cell spans several kilometers."],["thunderstorm","Thunderstorm Cell","Atmosphere",1e4,"Earth and Geography",8,"A storm cell can cover a large local area."],["hot-air-balloon","Hot Air Balloon","Vehicle",20,"Human Scale",7,"A balloon is a large human-made object that floats in air."],["drone","Drone","Vehicle",.5,"Human Scale",7,"A small flying machine at hand scale."],["satellite-bus","Small Satellite Bus","Vehicle",1.5,"Human Scale",8,"A compact spacecraft body about person scale."]];var qh={"needle-tip":{aspect:1.9,scale:2.2},"dust-speck":{aspect:1,scale:1.8},"flour-grain":{aspect:1,scale:1.8},"sugar-crystal":{aspect:1,scale:1.9},"mustard-seed":{aspect:1,scale:1.9},"chia-seed":{aspect:1,scale:1.9},lentil:{aspect:1.25,scale:1.9},peppercorn:{aspect:1,scale:1.9},eraser:{aspect:1.7,scale:2.2},paperclip:{aspect:1.85,scale:2.3},thumbtack:{aspect:1,scale:2},staple:{aspect:1.9,scale:2.1},button:{aspect:1,scale:1.95},marble:{aspect:1,scale:1.95},dice:{aspect:1,scale:1.95},"battery-aa":{aspect:.45,scale:2.35},"chalk-stick":{aspect:3.6,scale:2.6},"usb-drive":{aspect:1.9,scale:2.25},key:{aspect:2.3,scale:2.35},spoon:{aspect:4.2,scale:2.9},fork:{aspect:4.3,scale:2.9},toothbrush:{aspect:4.4,scale:2.9},calculator:{aspect:.74,scale:2.45},notebook:{aspect:.72,scale:2.45},textbook:{aspect:.75,scale:2.5},"water-bottle":{aspect:.42,scale:2.55},"coffee-mug":{aspect:1.15,scale:2.15},"desk-lamp":{aspect:.9,scale:2.55},"school-bag":{aspect:.78,scale:2.85},laptop:{aspect:1.45,scale:2.75},tablet:{aspect:.72,scale:2.4},monitor:{aspect:1.35,scale:2.65},chair:{aspect:.85,scale:2.65},desk:{aspect:1.8,scale:2.8},door:{aspect:.46,scale:2.9},whiteboard:{aspect:1.75,scale:2.75},"ceiling-fan":{aspect:1.9,scale:2.7},"classroom-window":{aspect:1.35,scale:2.6},"student-desk-row":{aspect:2.9,scale:3},"laboratory-table":{aspect:2.1,scale:2.8},microscope:{aspect:.78,scale:2.6},telescope:{aspect:2.35,scale:2.8},football:{aspect:1,scale:2.25},basketball:{aspect:1,scale:2.25},"football-goal":{aspect:2.4,scale:3},"basketball-hoop":{aspect:.65,scale:2.85},"cricket-bat":{aspect:.28,scale:2.85},"tennis-racket":{aspect:.45,scale:2.75},skateboard:{aspect:2.7,scale:2.7},scooter:{aspect:1.6,scale:2.75},motorbike:{aspect:2.2,scale:2.85},"auto-rickshaw":{aspect:1.55,scale:2.8},minivan:{aspect:2.2,scale:2.9},car:{aspect:2.35,scale:2.85},bicycle:{aspect:2.15,scale:2.75},"school-bus":{aspect:2.8,scale:3},"bus-stop-shelter":{aspect:1.7,scale:2.9},"traffic-signal":{aspect:.38,scale:3},"street-light":{aspect:.32,scale:3},"utility-pole":{aspect:.28,scale:3},"small-tree":{aspect:.72,scale:2.9},"mango-tree":{aspect:.9,scale:3},"coconut-tree":{aspect:.55,scale:3},"garden-bench":{aspect:2,scale:2.75},"playground-slide":{aspect:1.5,scale:2.85},"water-tank":{aspect:1.1,scale:2.75},"apartment-floor":{aspect:2,scale:2.65},"two-storey-house":{aspect:1.25,scale:2.9},"school-building":{aspect:2.1,scale:3},"basketball-court":{aspect:1.85,scale:3},"cricket-pitch":{aspect:3.5,scale:3},"swimming-lane":{aspect:3.2,scale:3},"metro-train-car":{aspect:3.5,scale:3},"railway-platform":{aspect:4,scale:3},"pedestrian-bridge":{aspect:3,scale:3},"cell-tower":{aspect:.42,scale:3},"wind-turbine":{aspect:.7,scale:3},"solar-panel-row":{aspect:3,scale:3},"water-tower":{aspect:.75,scale:3},"radio-telescope-dish":{aspect:1.25,scale:3},"small-pond":{aspect:1.8,scale:2.8},"city-block":{aspect:2.5,scale:3},neighborhood:{aspect:2.2,scale:3},village:{aspect:2.2,scale:3},stadium:{aspect:2.2,scale:3},"airport-terminal":{aspect:2.5,scale:3},"harbor-ship":{aspect:3.1,scale:3},"cargo-ship":{aspect:3.4,scale:3},dam:{aspect:3,scale:3},"bridge-span":{aspect:4,scale:3},hill:{aspect:1.8,scale:2.8},"river-width":{aspect:3.5,scale:3},lake:{aspect:2.2,scale:3},island:{aspect:1.8,scale:3},cloud:{aspect:1.8,scale:2.8},"rain-cell":{aspect:1.5,scale:2.8},thunderstorm:{aspect:1.45,scale:2.9},"hot-air-balloon":{aspect:.75,scale:2.9},drone:{aspect:2.2,scale:2.5},"satellite-bus":{aspect:1.4,scale:2.6},human:{aspect:.42,scale:2.85},giraffe:{aspect:.78,scale:3},elephant:{aspect:1.75,scale:3},"blue-whale":{aspect:3,scale:3},"tyrannosaurus-rex":{aspect:1.9,scale:3}};function $h(n){return n={andromeda:"andromeda-galaxy",laniakea:"laniakea-supercluster"}[n]??n,`/assets/scale-universe/sprites/${n}.png`}function wl(n){if(!n)return null;let e=qh[n]??{aspect:1.33,scale:2.65};return{assetPath:$h(n),assetAspect:e.aspect,assetScale:e.scale}}var Yh={planets:{sourceName:"NASA JPL \u2014 volumetric mean radii (diameters = 2r)",sourceUrl:"https://ssd.jpl.nasa.gov/planets/phys_par.html"},planck:{sourceName:"NIST CODATA \u2014 Planck length",sourceUrl:"https://physics.nist.gov/cgi-bin/cuu/Value?plkl"},dna:{sourceName:"NCBI Bookshelf \u2014 Heredity, Genes, and DNA",sourceUrl:"https://www.ncbi.nlm.nih.gov/books/NBK9944/"},universe:{sourceName:"NASA \u2014 How Big Is Space?",sourceUrl:"https://www.nasa.gov/science-research/astrophysics/how-big-is-space-we-asked-a-nasa-expert-episode-61/"},liberty:{sourceName:"US National Park Service \u2014 Statue of Liberty facts",sourceUrl:"https://www.nps.gov/stli/learn/statue-of-liberty-facts.htm"},eiffel:{sourceName:"Soci\xE9t\xE9 d\u2019Exploitation de la Tour Eiffel \u2014 key figures",sourceUrl:"https://www.toureiffel.paris/en/the-monument/key-figures"},burj:{sourceName:"Emaar \u2014 Burj Khalifa fact sheet",sourceUrl:"https://bk.emaar.com/en/assets/FACT-SHEET.pdf"},sun:{sourceName:"NASA Science \u2014 Sun facts",sourceUrl:"https://science.nasa.gov/sun/facts/"},au:{sourceName:"NASA JPL \u2014 IAU astronomical unit definition",sourceUrl:"https://ssd.jpl.nasa.gov/glossary/au.html"},lightYear:{sourceName:"NASA Science \u2014 What is a light-year?",sourceUrl:"https://science.nasa.gov/exoplanets/what-is-a-light-year/"},nearbyGalaxies:{sourceName:"ESO \u2014 A Cosmic Zoo in the Large Magellanic Cloud",sourceUrl:"https://www.eso.org/public/news/eso1021/"},crab:{sourceName:"NASA Hubble \u2014 Zoom into the Crab Nebula",sourceUrl:"https://science.nasa.gov/asset/hubble/zoom-into-the-crab-nebula/"}},Zh={"planck-length":[1616255e-41,"length","planck","Theoretical length derived from constants; not a resolved particle or a proven minimum length."],mercury:[4878800,"diameter","planets"],venus:[12103600,"diameter","planets"],earth:[127420168e-1,"diameter","planets"],mars:[6779e3,"diameter","planets"],jupiter:[139822e3,"diameter","planets"],saturn:[116464e3,"diameter","planets","Volumetric mean globe diameter; rings are excluded."],uranus:[50724e3,"diameter","planets"],neptune:[49244e3,"diameter","planets"],ceres:[939400,"diameter","planets"],pluto:[2376600,"diameter","planets"],sun:[14e8,"diameter","sun","Approximate photospheric diameter, rounded to NASA\u2019s reference value; diffuse atmospheric layers extend farther."],"earth-sun-distance":[149597870700,"distance","au","One astronomical unit is exactly 149,597,870,700 m by convention; actual Earth\u2013Sun separation varies over the orbit."],"light-year":[946e13,"distance","lightYear","Approximate distance light travels in one year; this is a length, not a time interval."],"large-magellanic-cloud":[13e19,"diameter","nearbyGalaxies","Approximate visible stellar extent, about 14,000 light-years; excludes the extended gaseous halo. Corrects a factor-of-ten error in the legacy catalog."],"milky-way":[946e18,"diameter","nearbyGalaxies","Approximate 100,000-light-year stellar-disk diameter; excludes the much larger dark-matter halo."],"crab-nebula":[104e15,"width","crab","Approximate 11-light-year extent of the expanding remnant; wavelength, boundary and epoch affect the measurement."],"dna-width":[2e-9,"width","dna","Approximate B-DNA double-helix diameter; not total molecule length."],"dna-helix":[34e-10,"length","dna","Axial length of one B-DNA helical turn; not the entire strand."],"observable-universe":[88e25,"diameter","universe","Approximate present-day comoving diameter, about 93 billion light-years; model dependent, not the age of the universe."],"statue-of-liberty":[92.9894,"height","liberty","Ground to torch, including pedestal."],"eiffel-tower":[330,"height","eiffel","Overall height including antenna."],"burj-khalifa":[828,"height","burj","Architectural height including spire."]},Jh={electron:["extent","Experimental resolution reference, not an electron diameter. Fundamental electrons are point-like in the Standard Model; this is not a measured radius."],"quark-scale":["extent","Interaction-scale reference only. Quarks have no established hard-sphere diameter."],"quark-interaction-scale":["extent","Interaction-scale reference only. Quarks have no established hard-sphere diameter."],proton:["diameter","Approximate twice the proton charge radius; diffuse charge distribution, not a hard surface."],neutron:["diameter","Illustrative nucleon extent; a neutron has no hard boundary."],"solar-system":["extent","Diameter of the planetary region out to approximately Neptune\u2019s orbit; excludes the Oort cloud."],"earth-sun-distance":["distance","Mean Earth\u2013Sun separation, approximately one astronomical unit."],"earth-moon-distance":["distance","Mean center-to-center separation; varies over the orbit."],"neptune-orbit":["diameter","Diameter of the orbital path, approximately twice the semimajor axis; not Neptune\u2019s diameter."],"oort-cloud":["radius","Assumed outer radius of the Oort cloud; highly uncertain and boundary dependent."],"low-earth-orbit":["height","Illustrative altitude of 400 km above Earth\u2019s surface. LEO spans a range; this is not the instantaneous ISS altitude."],"gps-orbit":["radius","Approximate Earth-center orbital radius; not altitude above the surface."],"black-hole-stellar":["eventHorizonDiameter","Schwarzschild horizon diameter for an illustrative roughly 10 solar-mass non-rotating black hole; apparent shadow is larger."],"sagittarius-a":["eventHorizonDiameter","Approximate Schwarzschild-equivalent diameter for about 4 million solar masses; not the observed shadow diameter. Spin changes the horizon."],"mount-everest":["height","Summit elevation above mean sea level; not mountain width or base-to-summit relief."],"earth-atmosphere":["thickness","100 km is a conventional space boundary reference, not the physical end of the atmosphere."],"milky-way":["diameter","Approximate stellar-disk diameter; excludes the larger dark-matter halo."],andromeda:["diameter","Approximate stellar-disk extent; boundary dependent, excludes halo."],football:["diameter","Association football (soccer) reference diameter, about 22 cm; not an American football."],"basketball-hoop":["height","Rim height above the floor, not hoop diameter."],"human-hair-width":["width","Representative hair shaft width; varies between people."],"paper-thickness":["thickness","Representative single-sheet thickness; paper grades vary."],butterfly:["wingspan","Illustrative wingspan; no species is specified."]},jh=new Set(["human","giraffe","chair","door","microscope","water-bottle","desk-lamp","school-bag","coffee-mug","ceiling-fan","small-tree","mango-tree","coconut-tree","street-light","utility-pole","cell-tower","water-tower","wind-turbine","apartment-floor","two-storey-house","school-building"]);function El(n){let e=Zh[n.id],t=Jh[n.id],i=["Planet","Moon","Natural Satellite","Dwarf Planet","Star","Atom","Subatomic Particle"].includes(n.category),s=e?.[1]??t?.[0]??(jh.has(n.id)?"height":i?"diameter":/Width/.test(n.name)?"width":/Galaxy|Nebula|Cosmic|Supercluster|Group|Geography|Atmosphere/.test(n.category)?"extent":"length"),r=e?.[3]??t?.[1]??(n.category==="Atom"?"Effective atomic diameter; electron probability distributions have no fixed surface and are not classical orbits.":`Representative ${s}; the named specimen, model, species or boundary is not specified.`),a=/hercules|great-wall/.test(n.id),o=["betelgeuse","uy-scuti","stephenson-2-18"].includes(n.id);return{sizeMeters:e?.[0]??n.sizeMeters,measurementType:s,dimensionAxis:s==="height"?"vertical":s==="diameter"?"diameter":"horizontal",estimated:!0,measurementDefinition:r,uncertainty:a?"Proposed large-scale structure; extent, statistical significance and boundaries are disputed.":o?"Highly uncertain stellar photospheric diameter; distance, variability and model assumptions affect the estimate.":r,validationStatus:e?"source-checked reference":"reference estimate \u2014 source review pending",...e?Yh[e[2]]:{sourceName:"Existing educational catalog \u2014 independent measurement source pending",sourceUrl:null},scientificExplanation:`${n.summary} ${r}`,visualType:n.category==="Astronomical Distance"?"measurement-path":"reference-illustration",aliases:{"red-blood-cell":["RBC"],"dna-width":["DNA"],"dna-helix":["DNA"],"sagittarius-a":["Sgr A*","Sagittarius A*"],"earth-moon-distance":["Earth-Moon"],laniakea:["Laniakea"],"low-earth-orbit":["ISS altitude reference"]}[n.id]??[]}}var Gi={human:{assetPath:"/assets/scale-universe/cutouts-v2/human.png",sourceBox:[273,39,477,1426],aspect:.3345021037868163,alphaExtrema:[0,254],generation:"OpenAI imagegen; illustrative AI-generated asset, not a scientific measurement source"},car:{assetPath:"/assets/scale-universe/cutouts-v2/car.png",sourceBox:[48,174,1678,579],aspect:2.8981001727115716,alphaExtrema:[0,255],generation:"OpenAI imagegen; illustrative AI-generated asset, not a scientific measurement source"},"school-bus":{assetPath:"/assets/scale-universe/cutouts-v2/school-bus.png",sourceBox:[27,32,2127,643],aspect:3.3079315707620527,alphaExtrema:[0,255],generation:"OpenAI imagegen; illustrative AI-generated asset, not a scientific measurement source"},door:{assetPath:"/assets/scale-universe/cutouts-v2/door.png",sourceBox:[189,34,646,1458],aspect:.4430727023319616,alphaExtrema:[0,254],generation:"OpenAI imagegen; illustrative AI-generated asset, not a scientific measurement source"},laptop:{assetPath:"/assets/scale-universe/cutouts-v2/laptop.png",sourceBox:[50,68,1436,873],aspect:1.6449026345933562,alphaExtrema:[0,254],generation:"OpenAI imagegen; illustrative AI-generated asset, not a scientific measurement source"},microscope:{assetPath:"/assets/scale-universe/cutouts-v2/microscope.png",sourceBox:[80,13,1068,1225],aspect:.8718367346938776,alphaExtrema:[0,255],generation:"OpenAI imagegen; illustrative AI-generated asset, not a scientific measurement source"}};var St=-35,kt=27,Kh={Subatomic:"This scale contains particles smaller than atoms, such as protons, neutrons, and electrons.",Atomic:"Atoms are the building blocks of chemical elements and are measured around angstrom scales.",Molecular:"Molecules are groups of atoms bonded together, often measured in nanometers.","Cellular / Microscopic":"Cells, microbes, and fine biological structures are usually measured in micrometers.","Human Scale":"These are objects we can see, touch, and measure directly in everyday life.",Planetary:"Moons, mountains, and planets are measured in thousands to millions of meters.","Solar System":"Distances become so large that astronomical units help make comparisons easier.",Interstellar:"The spaces between stars are so wide that light years become useful.",Galactic:"Stars, nebulae, and galaxies require light years and galactic-scale thinking.",Cosmic:"This scale includes galaxy clusters, superclusters, and the observable universe."},Qh=[Ne("proton","Proton","Subatomic Particle",17e-16,-420,-90,10,"A proton is a positively charged particle found in atomic nuclei.",["Radius is about one femtometer.","It is built from quarks and gluons.","It helps define the identity of an element."],"1.7 x 10^-15 m","particle","#ff6b6b"),Ne("neutron","Neutron","Subatomic Particle",17e-16,-250,80,9,"A neutron is a neutral particle found in most atomic nuclei.",["It is close in size to a proton.","Free neutrons decay over time.","Neutrons stabilize many nuclei."],"1.7 x 10^-15 m","particle","#b8c7d9"),Ne("electron","Electron","Subatomic Particle",1e-18,180,-70,10,"An electron is a tiny negatively charged particle with no measured internal size.",["In the Standard Model it is treated as point-like.","Scattering experiments constrain any radius to far below atomic size.","Electric current is often electron motion."],"<~10^-18 m experimental scale","particle","#ffd60a"),Ne("hydrogen-atom","Hydrogen Atom","Atom",106e-12,-260,-120,10,"Hydrogen is the simplest atom, with one proton and one electron.",["It is the most abundant element in the universe.","Atomic size is measured in angstroms.","Its spectrum helped reveal quantum energy levels."],"1.06 x 10^-10 m","circle","#60a5fa"),Ne("carbon-atom","Carbon Atom","Atom",14e-11,-50,105,8,"Carbon atoms bond in many ways and form the backbone of organic chemistry.",["Carbon has six protons.","It can form chains, sheets, and crystals.","Graphite and diamond are carbon structures."],"1.4 x 10^-10 m","circle","#94a3b8"),Ne("water-molecule","Water Molecule","Molecule",275e-12,230,80,8,"A water molecule is made of two hydrogen atoms bonded to oxygen.",["Its polarity helps dissolve many substances.","It is larger than a single atom.","Hydrogen bonding shapes water's properties."],"2.75 x 10^-10 m","circle","#38bdf8"),Ne("glucose-molecule","Glucose Molecule","Molecule",9e-10,-190,-20,7,"Glucose is a sugar molecule used by cells for energy.",["It contains carbon, hydrogen, and oxygen.","It is roughly nanometer scale.","It stores chemical energy."],"9 x 10^-10 m","circle","#f59e0b"),Ne("dna-width","DNA Width","Molecule",2e-9,95,-115,9,"DNA is about two nanometers wide.",["This width is far below optical microscope resolution.","DNA stores genetic information.","The double helix has paired molecular bases."],"2 x 10^-9 m","dna","#facc15"),Ne("dna-helix","DNA Helix","Molecule",34e-10,275,35,8,"One turn of DNA helix is a few nanometers long.",["The helix repeats about every 3.4 nm.","Bases stack along the molecule.","Molecular scale is visible with advanced instruments."],"3.4 x 10^-9 m","dna","#fde047"),Ne("virus","Virus","Biology / Microscopic Physics",1e-7,-300,-80,9,"A virus is much smaller than most cells.",["Many viruses are tens to hundreds of nanometers wide.","They require host cells to reproduce.","Electron microscopes reveal their structure."],"1 x 10^-7 m","cell","#ef4444"),Ne("e-coli","E. coli","Biology / Microscopic Physics",2e-6,-110,100,9,"E. coli is a rod-shaped bacterium a few micrometers long.",["It is larger than most viruses.","It can be seen with a light microscope.","Its motion can involve flagella."],"2 x 10^-6 m","bacteria","#22c55e"),Ne("red-blood-cell","Red Blood Cell","Biology / Microscopic Physics",7e-6,110,-70,10,"A red blood cell carries oxygen through the body.",["It is roughly 7 micrometers wide.","It is much larger than most bacteria.","It can be seen using a microscope."],"7 x 10^-6 m","cell","#dc2626"),Ne("white-blood-cell","White Blood Cell","Biology / Microscopic Physics",12e-6,265,95,8,"White blood cells help the body fight infection.",["They are often larger than red blood cells.","They are part of the immune system.","Their shape can change during motion."],"1.2 x 10^-5 m","cell","#e0f2fe"),Ne("human-hair-width","Human Hair Width","Human Scale",8e-5,-250,-80,7,"A human hair is tens of micrometers wide.",["Hair width varies widely.","It is visible to the eye.","It is much wider than most cells."],"8 x 10^-5 m","lineDistance","#64748b"),Ne("grain-of-sand","Grain of Sand","Human Scale",5e-4,-70,80,8,"A grain of sand is about half a millimeter across.",["Sand grains vary by rock type.","They are enormous compared with cells.","Granular materials have interesting physics."],"5 x 10^-4 m","circle","#f4c26b"),Ne("ant","Ant","Animal",.005,150,-40,8,"An ant is millimeter scale.",["Ant size depends on species.","Its mass is small but its strength-to-weight ratio is high.","Motion is strongly affected by friction and surface forces."],"5 x 10^-3 m","animal","#111827"),Ne("coin","Coin","Everyday Object",.024,-220,95,7,"A coin is a few centimeters wide.",["It is human-hand scale.","Thickness is much smaller than diameter.","Circular objects help introduce diameter and radius."],"2.4 x 10^-2 m","circle","#c0c7d2"),Ne("football","Football","Everyday Object",.22,0,-110,7,"A football is tens of centimeters across.",["It is close to common classroom scale.","Its shape is roughly spherical or ellipsoidal.","It helps compare volume and diameter."],"2.2 x 10^-1 m","ellipse","#f97316",Sn("football")),Ne("human","Human","Human Scale",1.7,220,50,10,"A human body is about meter scale.",["A typical adult is around 1 to 2 meters tall.","This scale is our everyday reference.","Many classroom measurements start here."],"1.7 x 10^0 m","human","#111827",Sn("human")),Ne("giraffe","Giraffe","Animal",5.5,-260,-70,8,"A giraffe is one of the tallest living animals.",["Adult height can exceed 5 meters.","It is several times taller than a human.","Animal scale still sits near 10^0 meters."],"5.5 x 10^0 m","animal","#d69e2e",Sn("giraffe")),Ne("elephant","Elephant","Animal",6,40,90,8,"An elephant is several meters long.",["It is one of the largest land animals.","Its mass is far larger than a human's.","Biological scaling affects bones and motion."],"6 x 10^0 m","animal","#7c8680",Sn("elephant")),Ne("blue-whale","Blue Whale","Animal",30,250,-105,9,"A blue whale is the largest known animal.",["It can be around 30 meters long.","It lives in the ocean.","Large body size changes heat and motion constraints."],"3 x 10^1 m","ellipse","#2563eb",Sn("blue-whale")),Ne("tyrannosaurus-rex","Tyrannosaurus Rex","Animal / Fossil",12,-150,110,8,"Tyrannosaurus rex was a large predatory dinosaur.",["It was about 12 meters long.","Its fossils reveal extinct animal scale.","It is much larger than a human."],"1.2 x 10^1 m","animal","#65a30d",Sn("tyrannosaurus-rex")),Ne("mount-everest","Mount Everest","Planetary / Earth",8849,-40,-80,9,"Mount Everest is Earth's highest mountain above sea level.",["Its height is about 8.8 km.","It is tiny compared with Earth's diameter.","Mountains reveal geological scale."],"8.849 x 10^3 m","mountain","#94a3b8"),Ne("earth","Earth","Planet",12742e3,-260,70,10,"Earth is the planet we live on.",["Earth's diameter is about 12,742 km.","Gravity holds its atmosphere and oceans.","It is small compared with the Sun."],"1.2742 x 10^7 m","planet","#22c55e"),Ne("moon","Moon","Natural Satellite",3474e3,-15,-100,9,"The Moon is Earth's natural satellite.",["Its diameter is about 3,474 km.","Its gravity causes tides with the Sun.","It is much smaller than Earth."],"3.474 x 10^6 m","planet","#cbd5e1"),Ne("jupiter","Jupiter","Planet",1398e5,210,80,9,"Jupiter is the largest planet in the Solar System.",["Its diameter is about 140,000 km.","It is a gas giant.","It is much larger than Earth."],"1.398 x 10^8 m","planet","#f59e0b"),Ne("sun","Sun","Star",13927e5,-170,-70,10,"The Sun is the star at the center of the Solar System.",["Its diameter is about 1.39 million km.","Fusion in its core releases energy.","It dominates Solar System mass."],"1.3927 x 10^9 m","star","#facc15"),Ne("sirius","Sirius","Star",238e7,90,105,8,"Sirius is a bright star visible from Earth.",["It is larger than the Sun.","It appears bright because it is nearby and luminous.","Star sizes vary greatly."],"2.38 x 10^9 m","star","#bfdbfe"),Ne("betelgeuse","Betelgeuse","Star",12e11,270,-85,9,"Betelgeuse is a red supergiant star.",["Its size is hundreds of times the Sun's diameter.","Its exact radius varies by measurement.","Supergiants show how enormous stars can become."],"~1.2 x 10^12 m","star","#fb7185"),Ne("solar-system","Planetary Solar System","Solar System",9e12,-280,60,10,"The main planetary Solar System is roughly measured by Neptune's orbital diameter.",["This is not the full Oort Cloud extent.","Distances are often measured in astronomical units.","The Sun is the central mass."],"~9 x 10^12 m across Neptune's orbit","lineDistance","#fde68a"),Ne("earth-sun-distance","Distance from Earth to Sun","Astronomical Distance",1496e8,-40,-90,10,"One astronomical unit is the average Earth-Sun distance.",["It is about 150 million km.","Light takes about 8 minutes to cross it.","It anchors Solar System distance scales."],"1 AU = 1.496 x 10^11 m","lineDistance","#38bdf8"),Ne("light-year","Light Year","Astronomical Distance",9461e12,220,90,10,"A light year is the distance light travels in one year.",["It is a distance, not a time.","It is about 9.46 trillion km.","Interstellar distances often use light years."],"c x 1 year = 9.461 x 10^15 m","lineDistance","#a78bfa"),Ne("milky-way","Milky Way Galaxy","Galaxy",105e19,-220,-80,10,"The Milky Way is our home galaxy.",["It contains hundreds of billions of stars.","Its diameter is about 100,000 light years.","The Sun orbits around its center."],"~1.05 x 10^21 m","galaxy","#93c5fd"),Ne("andromeda","Andromeda Galaxy","Galaxy",21e20,45,95,9,"Andromeda is a large spiral galaxy near the Milky Way.",["It is larger than the Milky Way.","It is on a long-term collision course with our galaxy.","It is visible under dark skies."],"~2.1 x 10^21 m","galaxy","#c4b5fd"),Ne("local-group","Local Group","Galaxy Group",1e23,250,-70,9,"The Local Group contains the Milky Way, Andromeda, and many smaller galaxies.",["It is several million light years across.","Gravity binds its member galaxies.","It is part of larger cosmic structure."],"~1 x 10^23 m","galaxy","#818cf8"),Ne("virgo-supercluster","Virgo Supercluster","Supercluster",105e22,-260,70,8,"The Virgo Supercluster is a large collection of galaxy groups and clusters.",["It includes the Local Group.","Superclusters reveal cosmic web structure.","They are not always tightly gravitationally bound."],"~1.05 x 10^24 m","galaxy","#60a5fa"),Ne("laniakea","Laniakea Supercluster","Supercluster",5e24,-20,-100,9,"Laniakea is the large-scale region containing the Milky Way's flow of galaxies.",["Its name means immense heaven.","It organizes galaxy motions on huge scales.","It is hundreds of millions of light years across."],"~5 x 10^24 m","galaxy","#a78bfa"),Ne("hercules-corona-borealis","Hercules-Corona Borealis Great Wall","Cosmic Structure",1e26,205,85,8,"This proposed giant structure represents extreme cosmic scale.",["Its size estimate is enormous and debated.","Large structures are found through galaxy and gamma-ray burst distributions.","It approaches observable-universe scale."],"~1 x 10^26 m","galaxy","#64748b"),Ne("observable-universe","Observable Universe","Cosmic Horizon",88e25,0,0,10,"The observable universe is the region whose light can reach us in principle.",["Its diameter is about 93 billion light years.","Expansion affects how distances are measured.","It is the largest scale in this prototype."],"~8.8 x 10^26 m","galaxy","#f8fafc")],Tl=[["planck-length","Planck Length","Subatomic Particle",1616e-38,"Particles",10,"A theoretical minimum length scale used in quantum gravity.","Planck scale"],["atomic-nucleus","Atomic Nucleus","Subatomic Particle",1e-14,"Particles",9,"The dense central core of an atom.","Nuclear scale"],["helium-nucleus","Helium Nucleus","Subatomic Particle",32e-16,"Particles",8,"A compact nucleus made of two protons and two neutrons.","Alpha particle scale"],["quark-scale","Quark Interaction Scale","Subatomic Particle",1e-18,"Particles",8,"A scale used to discuss quarks inside hadrons.","Quark scale"],["uranium-atom","Uranium Atom","Atom",35e-11,"Atoms",8,"A large heavy atom used in nuclear physics.","3.5 x 10^-10 m"],["oxygen-atom","Oxygen Atom","Atom",12e-11,"Atoms",7,"An atom central to water, air, and life chemistry.","1.2 x 10^-10 m"],["silicon-atom","Silicon Atom","Atom",22e-11,"Atoms",7,"A semiconductor atom important in electronics.","2.2 x 10^-10 m"],["gold-atom","Gold Atom","Atom",29e-11,"Atoms",7,"A heavy atom familiar from materials and electronics.","2.9 x 10^-10 m"],["oxygen-molecule","Oxygen Molecule","Molecule",3e-10,"Molecules",8,"A diatomic molecule needed for respiration.","3 x 10^-10 m"],["carbon-dioxide","Carbon Dioxide Molecule","Molecule",33e-11,"Molecules",8,"A linear greenhouse gas molecule.","3.3 x 10^-10 m"],["nitrogen-molecule","Nitrogen Molecule","Molecule",31e-11,"Molecules",7,"The main molecule in Earth's atmosphere.","3.1 x 10^-10 m"],["caffeine-molecule","Caffeine Molecule","Molecule",1e-9,"Molecules",7,"A familiar organic molecule at nanometer scale.","1 x 10^-9 m"],["protein-molecule","Protein Molecule","Molecule",5e-9,"Molecules",8,"A molecular machine made from folded amino acid chains.","5 x 10^-9 m"],["hemoglobin","Hemoglobin Molecule","Molecule",65e-10,"Molecules",8,"A protein that carries oxygen in red blood cells.","6.5 x 10^-9 m"],["ribosome","Ribosome","Molecule",25e-9,"Molecules",8,"A molecular machine that builds proteins.","2.5 x 10^-8 m"],["cell-membrane","Cell Membrane Thickness","Molecule",8e-9,"Molecules",7,"A thin molecular boundary surrounding many cells.","8 x 10^-9 m"],["influenza-virus","Influenza Virus","Biology / Microscopic Physics",1e-7,"Cells and Microbes",8,"A virus roughly one hundred nanometers across.","1 x 10^-7 m"],["bacteriophage","Bacteriophage","Biology / Microscopic Physics",2e-7,"Cells and Microbes",8,"A virus that infects bacteria.","2 x 10^-7 m"],["coronavirus","Coronavirus","Biology / Microscopic Physics",12e-8,"Cells and Microbes",8,"A spiked virus at nanometer scale.","1.2 x 10^-7 m"],["yeast-cell","Yeast Cell","Biology / Microscopic Physics",5e-6,"Cells and Microbes",8,"A single-celled fungus visible under a microscope.","5 x 10^-6 m"],["platelet","Blood Platelet","Biology / Microscopic Physics",2e-6,"Cells and Microbes",7,"A tiny blood component involved in clotting.","2 x 10^-6 m"],["human-egg-cell","Human Egg Cell","Biology / Microscopic Physics",1e-4,"Cells and Microbes",8,"One of the largest human cells.","1 x 10^-4 m"],["pollen-grain","Pollen Grain","Biology / Microscopic Physics",3e-5,"Cells and Microbes",7,"A microscopic plant structure.","3 x 10^-5 m"],["dust-mite","Dust Mite","Biology / Microscopic Physics",3e-4,"Cells and Microbes",7,"A tiny animal near the edge of naked-eye visibility.","3 x 10^-4 m"],["amoeba","Amoeba","Biology / Microscopic Physics",5e-4,"Cells and Microbes",7,"A single-celled organism that can be hundreds of micrometers wide.","5 x 10^-4 m"],["salt-crystal","Salt Crystal","Everyday Object",3e-4,"Human Scale",7,"A visible crystal made from many ions.","3 x 10^-4 m"],["sesame-seed","Sesame Seed","Everyday Object",.003,"Human Scale",7,"A small seed useful for millimeter comparisons.","3 x 10^-3 m"],["rice-grain","Rice Grain","Everyday Object",.007,"Human Scale",7,"A familiar grain at millimeter scale.","7 x 10^-3 m"],["paper-thickness","Paper Thickness","Everyday Object",1e-4,"Human Scale",7,"A sheet of paper is about a tenth of a millimeter thick.","1 x 10^-4 m"],["pencil","Pencil","Everyday Object",.19,"Human Scale",7,"A classroom object measured in centimeters.","0.19 m"],["smartphone","Smartphone","Everyday Object",.16,"Human Scale",8,"A familiar object at hand scale.","0.16 m"],["basketball","Basketball","Everyday Object",.24,"Human Scale",7,"A ball near a quarter meter in diameter.","0.24 m"],["honey-bee","Honey Bee","Animal",.015,"Animals",8,"A small flying insect measured in centimeters.","1.5 x 10^-2 m"],["butterfly","Butterfly Wingspan","Animal",.07,"Animals",7,"A small animal wingspan at centimeter scale.","7 x 10^-2 m"],["mouse","Mouse","Animal",.09,"Animals",7,"A small mammal at decimeter scale.","9 x 10^-2 m"],["cat","Cat","Animal",.46,"Animals",7,"A familiar animal under one meter long.","0.46 m"],["dog","Dog","Animal",.9,"Animals",7,"A common animal near meter scale.","0.9 m"],["horse","Horse","Animal",2.4,"Animals",8,"A large animal a few meters long.","2.4 m"],["school-bus","School Bus","Vehicle",11,"Human Scale",8,"A classroom-friendly large vehicle.","11 m"],["car","Car","Vehicle",4.5,"Human Scale",8,"A common vehicle several meters long.","4.5 m"],["bicycle","Bicycle","Vehicle",1.8,"Human Scale",7,"A human-powered vehicle at meter scale.","1.8 m"],["house","House","Building",12,"Earth and Geography",8,"A building useful for comparing human spaces.","12 m"],["classroom","Classroom","Building",9,"Earth and Geography",8,"A familiar room-scale learning space.","9 m"],["statue-of-liberty","Statue of Liberty","Building / Landmark",93,"Earth and Geography",8,"A landmark almost one hundred meters tall.","93 m"],["eiffel-tower","Eiffel Tower","Building / Landmark",330,"Earth and Geography",8,"A tall human-built structure.","330 m"],["burj-khalifa","Burj Khalifa","Building / Landmark",828,"Earth and Geography",9,"One of the tallest buildings on Earth.","828 m"],["grand-canyon-width","Grand Canyon Width","Geography",29e3,"Earth and Geography",8,"A major canyon width measured in kilometers.","29 km"],["city","City","Geography",5e4,"Earth and Geography",8,"A city spans tens of kilometers.","50 km"],["india-width","India Width","Geography",3e6,"Earth and Geography",9,"A country-scale distance across India.","3 x 10^6 m"],["earth-moon-distance","Earth-Moon Distance","Astronomical Distance",3844e5,"Distances",9,"The average distance between Earth and the Moon.","3.844 x 10^8 m"],["mars","Mars","Planet",6779e3,"Planets and Moons",8,"A rocky planet smaller than Earth.","6.779 x 10^6 m"],["venus","Venus","Planet",12104e3,"Planets and Moons",8,"A rocky planet close in size to Earth.","1.2104 x 10^7 m"],["mercury","Mercury","Planet",4879e3,"Planets and Moons",7,"The smallest planet in the Solar System.","4.879 x 10^6 m"],["saturn","Saturn","Planet",11646e4,"Planets and Moons",9,"A gas giant famous for its rings.","1.1646 x 10^8 m"],["uranus","Uranus","Planet",50724e3,"Planets and Moons",7,"An ice giant planet.","5.0724 x 10^7 m"],["neptune","Neptune","Planet",49244e3,"Planets and Moons",7,"A distant ice giant planet.","4.9244 x 10^7 m"],["neptune-orbit","Neptune Orbit Diameter","Astronomical Distance",9e12,"Distances",8,"The approximate diameter of Neptune's orbit around the Sun.","9 x 10^12 m across"],["oort-cloud","Oort Cloud Outer Radius","Astronomical Distance",15e15,"Distances",8,"A distant icy reservoir extending far beyond the planets.","outer radius ~1.5 x 10^16 m"],["pollux","Pollux","Star",122e8,"Stars",8,"An orange giant star larger than the Sun.","1.22 x 10^10 m"],["arcturus","Arcturus","Star",35e9,"Stars",8,"A bright red giant star.","3.5 x 10^10 m"],["rigel","Rigel","Star",109e9,"Stars",8,"A luminous blue supergiant.","1.09 x 10^11 m"],["uy-scuti","UY Scuti","Star",24e11,"Stars",8,"A very large red supergiant star.","2.4 x 10^12 m"],["stephenson-2-18","Stephenson 2-18","Star",3e12,"Stars",8,"An extreme red supergiant candidate.","3 x 10^12 m"],["distance-proxima","Distance to Proxima Centauri","Astronomical Distance",401e14,"Distances",9,"The distance to the nearest known star system.","4.01 x 10^16 m"],["orion-nebula","Orion Nebula","Nebula",227e15,"Galaxies",8,"A nearby star-forming nebula.","2.27 x 10^17 m"],["crab-nebula","Crab Nebula","Nebula",104e15,"Galaxies",8,"A supernova remnant in our galaxy.","1.04 x 10^17 m"],["large-magellanic-cloud","Large Magellanic Cloud","Galaxy",13e20,"Galaxies",8,"A satellite galaxy of the Milky Way.","1.3 x 10^21 m"],["triangulum-galaxy","Triangulum Galaxy","Galaxy",57e19,"Galaxies",8,"A spiral galaxy in the Local Group.","5.7 x 10^20 m"],["sloan-great-wall","Sloan Great Wall","Cosmic Structure",13e24,"Cosmic Structures",8,"A huge cosmic web feature.","1.3 x 10^25 m"],["bootes-void","Bootes Void","Cosmic Structure",31e23,"Cosmic Structures",7,"A vast region with relatively few galaxies.","3.1 x 10^24 m"],["shapley-supercluster","Shapley Supercluster","Cosmic Structure",62e23,"Cosmic Structures",8,"A massive concentration of galaxies.","6.2 x 10^24 m"],["cosmic-web-filament","Cosmic Web Filament","Cosmic Structure",2e25,"Cosmic Structures",8,"A threadlike galaxy structure in the cosmic web.","2 x 10^25 m"],["football-field","Football Field","Everyday Object",105,"Human Scale",7,"A large sports field useful for classroom comparison.","105 m"],["swimming-pool","Swimming Pool","Everyday Object",50,"Human Scale",7,"A pool length at tens of meters.","50 m"],["train","Train","Vehicle",200,"Human Scale",7,"A long vehicle made of connected cars.","200 m"],["airplane","Passenger Airplane","Vehicle",70,"Human Scale",8,"A large aircraft tens of meters long.","70 m"],["runway","Airport Runway","Geography",3e3,"Earth and Geography",7,"A runway can be several kilometers long.","3 km"],["mountain-range-width","Mountain Range Width","Geography",2e5,"Earth and Geography",7,"A regional landform width.","200 km"],["earth-atmosphere","Earth Atmosphere Thickness","Geography",1e5,"Earth and Geography",8,"A simplified useful atmosphere thickness.","100 km"],["low-earth-orbit","Low Earth Orbit Height","Astronomical Distance",4e5,"Distances",8,"A common satellite altitude scale.","400 km"],["gps-orbit","GPS Orbit Radius","Astronomical Distance",266e5,"Distances",7,"The orbital size used by GPS satellites.","2.66 x 10^7 m"],["asteroid-bennu","Asteroid Bennu","Small Solar System Body",490,"Planets and Moons",7,"A small asteroid visited by spacecraft.","490 m"],["ceres","Ceres","Dwarf Planet",94e4,"Planets and Moons",7,"The largest object in the asteroid belt.","9.4 x 10^5 m"],["pluto","Pluto","Dwarf Planet",2377e3,"Planets and Moons",7,"A dwarf planet in the outer Solar System.","2.377 x 10^6 m"],["titan","Titan","Moon",515e4,"Planets and Moons",7,"Saturn's large moon with a thick atmosphere.","5.15 x 10^6 m"],["europa","Europa","Moon",312e4,"Planets and Moons",7,"An icy moon of Jupiter.","3.12 x 10^6 m"],["black-hole-stellar","Stellar Black Hole Horizon","Compact Object",6e4,"Stars",8,"A simplified event horizon size for a stellar black hole.","60 km"],["sagittarius-a","Sagittarius A* Horizon","Compact Object",24e9,"Stars",9,"The black hole at the center of the Milky Way.","2.4 x 10^10 m"],["planetary-nebula","Planetary Nebula","Nebula",9e15,"Galaxies",7,"A glowing shell from an aging star.","9 x 10^15 m"],["globular-cluster","Globular Cluster","Star Cluster",9e17,"Galaxies",8,"A dense cluster of old stars.","9 x 10^17 m"]],eu=Tl.map((n,e)=>Ne(n[0],n[1],n[2],n[3],(e%9-4)*86,(Math.floor(e/9)%7-3)*62,n[5],n[6],[`${n[1]} belongs to the ${n[4]} category.`,`Its size is approximately ${n[7]}.`,"Use it as an approximate classroom comparison point."],n[7],Ll(n[2],n[4],n[1]),Dl(n[4],e),{categoryGroup:n[4],...Sn(n[0])})),tu=Al.map((n,e)=>Ne(n[0],n[1],n[2],n[3],(e%12-5.5)*72,(Math.floor(e/12)%8-3.5)*56,n[5],n[6],[`${n[1]} is a local reference object students can recognize.`,`Its largest classroom-useful length is approximately ${Ds(n[3])}.`,"Use it to connect powers of ten to familiar surroundings."],Ds(n[3]),Ll(n[2],n[4],n[1]),Dl(n[4],e+Tl.length),{categoryGroup:n[4],...Sn(n[0]),learningTags:["local object","everyday scale",n[4].toLowerCase()]})),Cl=[...Qh,...eu,...tu];function Rl(){return Cl.map(n=>{let e={...n,...El(n)},t=nu[e.id]??{},i=Math.log10(e.sizeMeters),s=iu(i),r=e.categoryGroup??Pl(e.category,e.name),a=t.learningTags??e.learningTags??[e.category.toLowerCase(),r.toLowerCase(),s.toLowerCase()],o=Ls(e.sizeMeters),l=e.assetPath?{}:Sn(e.id);return{...l,...e,...t,assetPath:e.assetPath??l.assetPath,...Gi[e.id]?{assetPath:Gi[e.id].assetPath,assetAspect:Gi[e.id].aspect,sourceBox:Gi[e.id].sourceBox,visualType:"generated-transparent-reference"}:{},logSize:i,log10Size:i,description:e.summary,facts:e.facts.map(c=>c.startsWith("Its size is approximately")?`Its reference ${e.measurementType} is approximately ${Ds(e.sizeMeters)}.`:c),scaleBand:s,band:s,categoryGroup:r,bestUnitLabel:o,difficultyLevel:e.difficultyLevel??su(i,e.importance),whyItMatters:t.whyItMatters??"This object helps compare sizes across powers of ten.",relatedObjects:t.relatedObjects??ru(e.id,r),learningTags:a,formula:Ds(e.sizeMeters),searchText:`${e.name} ${(e.aliases??[]).join(" ")} ${e.category} ${r} ${s} ${a.join(" ")} ${o}`.toLowerCase()}})}function Il(n,e){let t=e(n);return Kh[t]??"This scale helps students compare objects using powers of ten."}var nu={proton:{whyItMatters:"It anchors the femtometer scale and helps connect nuclear physics to atomic structure.",relatedObjects:["neutron","electron","hydrogen-atom"],learningTags:["subatomic","nucleus","charge","femtometer"]},neutron:{whyItMatters:"It shows that atomic nuclei contain neutral matter as well as charged protons.",relatedObjects:["proton","electron","carbon-atom"],learningTags:["subatomic","nucleus","isotope","femtometer"]},electron:{whyItMatters:"Electrons connect tiny particle scale to electricity, chemistry, and atomic spectra.",relatedObjects:["proton","hydrogen-atom","carbon-atom"],learningTags:["subatomic","electricity","charge","atom"]},"hydrogen-atom":{whyItMatters:"Hydrogen makes atomic scale concrete because it is the simplest atom.",relatedObjects:["proton","electron","carbon-atom"],learningTags:["atom","angstrom","spectra","quantum"]},"carbon-atom":{whyItMatters:"Carbon links atomic size to molecules, life, materials, graphite, and diamond.",relatedObjects:["hydrogen-atom","glucose-molecule","dna-width"],learningTags:["atom","chemistry","bonding","material"]},"water-molecule":{whyItMatters:"Water helps students see how atoms combine into molecules with new properties.",relatedObjects:["hydrogen-atom","glucose-molecule","dna-width"],learningTags:["molecule","nanometer","chemistry","polarity"]},"glucose-molecule":{whyItMatters:"Glucose connects molecular scale to biological energy and cell processes.",relatedObjects:["water-molecule","dna-width","red-blood-cell"],learningTags:["molecule","biology","energy","nanometer"]},"dna-width":{whyItMatters:"DNA width shows why molecular biology requires tools beyond ordinary light microscopes.",relatedObjects:["dna-helix","virus","e-coli"],learningTags:["dna","molecule","nanometer","genetics"]},"dna-helix":{whyItMatters:"The helix repeat turns abstract genetics into a measurable nanoscale structure.",relatedObjects:["dna-width","virus","red-blood-cell"],learningTags:["dna","helix","genetics","nanometer"]},virus:{whyItMatters:"Viruses bridge molecular structures and living cells, making nanometer scale meaningful.",relatedObjects:["dna-width","e-coli","red-blood-cell"],learningTags:["virus","nanometer","microscope","biology"]},"e-coli":{whyItMatters:"It helps compare bacteria with viruses, blood cells, and human-scale objects.",relatedObjects:["virus","red-blood-cell","white-blood-cell"],learningTags:["bacteria","micrometer","cell","biology"]},"red-blood-cell":{whyItMatters:"It helps students understand micrometer-scale biological structures.",relatedObjects:["white-blood-cell","e-coli","human-hair-width"],learningTags:["biology","microscope","cell","micrometer"]},"white-blood-cell":{whyItMatters:"It gives a familiar cell-scale comparison to red blood cells and bacteria.",relatedObjects:["red-blood-cell","e-coli","human-hair-width"],learningTags:["biology","immune","cell","micrometer"]},"human-hair-width":{whyItMatters:"Hair width is a visible bridge from microscopic structures to everyday measurement.",relatedObjects:["red-blood-cell","grain-of-sand","human"],learningTags:["micrometer","measurement","human","visible"]},"grain-of-sand":{whyItMatters:"A sand grain makes millimeter scale intuitive and links size to granular physics.",relatedObjects:["human-hair-width","ant","coin"],learningTags:["millimeter","granular","geology","measurement"]},ant:{whyItMatters:"Ants show how forces, friction, and strength change at small animal scale.",relatedObjects:["grain-of-sand","coin","human"],learningTags:["animal","millimeter","friction","motion"]},coin:{whyItMatters:"A coin is a classroom-friendly reference for centimeters, diameter, and scale.",relatedObjects:["grain-of-sand","football","human"],learningTags:["centimeter","diameter","everyday","measurement"]},football:{whyItMatters:"It helps connect everyday object size with radius, diameter, surface area, and volume.",relatedObjects:["coin","human","elephant"],learningTags:["everyday","sphere","centimeter","volume"]},human:{whyItMatters:"Human size is the reference point students naturally use for all other scales.",relatedObjects:["football","giraffe","earth"],learningTags:["meter","human","reference","measurement"]},giraffe:{whyItMatters:"A giraffe shows how meters still cover very different biological sizes.",relatedObjects:["human","elephant","blue-whale"],learningTags:["animal","meter","biology","height"]},elephant:{whyItMatters:"Elephants make mass, support, and body scaling easier to discuss.",relatedObjects:["human","giraffe","blue-whale"],learningTags:["animal","meter","biology","scaling"]},"blue-whale":{whyItMatters:"It is a powerful comparison for the upper range of living animal size.",relatedObjects:["elephant","tyrannosaurus-rex","mount-everest"],learningTags:["animal","ocean","meter","largest"]},earth:{whyItMatters:"Earth makes planetary diameter, gravity, atmosphere, and curvature measurable.",relatedObjects:["moon","jupiter","sun"],learningTags:["planet","diameter","gravity","kilometer"]},moon:{whyItMatters:"The Moon helps compare satellites, planets, tides, and orbital distance.",relatedObjects:["earth","jupiter","earth-sun-distance"],learningTags:["moon","satellite","planetary","orbit"]},jupiter:{whyItMatters:"Jupiter reveals how large gas giants are compared with Earth.",relatedObjects:["earth","sun","solar-system"],learningTags:["planet","gas giant","solar system","diameter"]},sun:{whyItMatters:"The Sun connects planetary scale to stars, fusion, light, and the Solar System.",relatedObjects:["earth","jupiter","sirius"],learningTags:["star","fusion","solar","diameter"]},"earth-sun-distance":{whyItMatters:"One astronomical unit is the first practical ruler for Solar System distances.",relatedObjects:["earth","sun","solar-system"],learningTags:["astronomical unit","distance","solar system","light"]},"light-year":{whyItMatters:"A light year helps students separate distance from time while studying space.",relatedObjects:["earth-sun-distance","milky-way","andromeda"],learningTags:["light year","distance","interstellar","speed of light"]},"milky-way":{whyItMatters:"The Milky Way is the first step from stars to galaxy-scale structure.",relatedObjects:["light-year","andromeda","local-group"],learningTags:["galaxy","stars","light year","cosmos"]},"observable-universe":{whyItMatters:"It marks the largest meaningful viewing scale in this classroom explorer.",relatedObjects:["laniakea","hercules-corona-borealis","milky-way"],learningTags:["cosmic","universe","horizon","expansion"]}};function Ne(n,e,t,i,s,r,a,o,l,c,d,u,h={}){return{id:n,name:e,category:t,categoryGroup:h.categoryGroup,difficultyLevel:h.difficultyLevel,assetPath:h.assetPath,assetAspect:h.assetAspect,assetScale:h.assetScale,learningTags:h.learningTags,sizeMeters:i,logSize:Math.log10(i),x:s,y:r,importance:a,summary:o,facts:l,formula:c,renderStyle:d,color:u}}function Sn(n){return wl(n)??{}}function iu(n){return n<-12?"Subatomic":n<-9?"Atomic":n<-6?"Molecular":n<-3?"Cellular / Microscopic":n<3?"Human Scale":n<8?"Planetary":n<13?"Solar System":n<18?"Interstellar":n<23?"Galactic":"Cosmic"}function Pl(n,e){let t=`${n} ${e}`.toLowerCase();return t.includes("subatomic")||t.includes("particle")||t.includes("nucleus")?"Particles":t.includes("atom")?"Atoms":t.includes("molecule")||t.includes("dna")||t.includes("protein")||t.includes("ribosome")?"Molecules":t.includes("biology")||t.includes("cell")||t.includes("virus")||t.includes("bacteria")?"Cells and Microbes":t.includes("animal")||t.includes("whale")||t.includes("giraffe")||t.includes("elephant")?"Animals":t.includes("planet")||t.includes("moon")||t.includes("satellite")?"Planets and Moons":t.includes("star")||t.includes("black hole")?"Stars":t.includes("galaxy")||t.includes("nebula")||t.includes("cluster")?"Galaxies":t.includes("cosmic")||t.includes("supercluster")||t.includes("wall")||t.includes("universe")?"Cosmic Structures":t.includes("distance")||t.includes("orbit")||t.includes("light year")||t.includes("solar system")?"Distances":t.includes("mount")||t.includes("city")||t.includes("geography")||t.includes("building")?"Earth and Geography":"Human Scale"}function su(n,e){return e>=10||n>-4&&n<9?"beginner":n<-12||n>22?"advanced":"intermediate"}function ru(n,e){return Cl.filter(t=>t.id!==n&&Pl(t.category,t.name)===e).slice(0,3).map(t=>t.id)}function Ll(n,e,t){let i=`${n} ${e} ${t}`.toLowerCase();return i.includes("atom")?"atom":i.includes("molecule")||i.includes("protein")||i.includes("ribosome")?"molecule":i.includes("dna")?"dna":i.includes("virus")?"virus":i.includes("bacteria")||i.includes("e. coli")?"bacteria":i.includes("red blood")?"redBloodCell":i.includes("white blood")?"whiteBloodCell":i.includes("cell")?"cell":i.includes("saturn")?"planetRings":e==="Planets and Moons"?"planet":e==="Stars"?"star":e==="Galaxies"?"galaxy":e==="Cosmic Structures"?"cosmicStructure":e==="Distances"?"lineDistance":i.includes("mount")?"mountain":e==="Animals"?"animal":i.includes("human")?"human":i.includes("building")||i.includes("tower")||i.includes("classroom")||i.includes("house")?"building":i.includes("vehicle")||i.includes("bus")||i.includes("car")||i.includes("bicycle")||i.includes("airplane")||i.includes("train")?"vehicle":"circle"}function Dl(n,e){let t={Particles:["#f87171","#facc15","#a78bfa"],Atoms:["#60a5fa","#93c5fd","#c4b5fd"],Molecules:["#22d3ee","#facc15","#34d399"],"Cells and Microbes":["#ef4444","#22c55e","#e0f2fe"],Animals:["#d69e2e","#65a30d","#7c8680"],"Earth and Geography":["#94a3b8","#38bdf8","#f59e0b"],"Planets and Moons":["#22c55e","#f59e0b","#cbd5e1"],Stars:["#facc15","#fb7185","#bfdbfe"],Galaxies:["#93c5fd","#c4b5fd","#818cf8"],"Cosmic Structures":["#64748b","#a78bfa","#60a5fa"],Distances:["#38bdf8","#fde68a","#a78bfa"],"Human Scale":["#f97316","#c0c7d2","#111827"]},i=t[n]??t["Human Scale"];return i[e%i.length]}function Ds(n){return n>=.01&&n<1e3?`${Number(n.toPrecision(3))} m`:`${n.toExponential(2).replace("e"," x 10^")} m`}var Ul="scaleUniverseBookmarks";function Fl(n,e,t){let i=n.querySelector(".scale-bookmarks-panel"),s=au(),r=h=>s.includes(h),a=h=>(s=r(h.id)?s.filter(p=>p!==h.id):[...s,h.id],Nl(s),d(),r(h.id)),o=()=>{d(),i.hidden=!1},l=()=>{i.hidden=!0},c=()=>{s=[],Nl(s),d()},d=()=>{let h=s.map(p=>e.find(m=>m.id===p)).filter(Boolean);i.innerHTML=`
      <button type="button" class="scale-info-close" data-bookmarks-close aria-label="Close bookmarks">Close</button>
      <p class="scale-eyebrow">Saved objects</p>
      <h3>Bookmarks</h3>
      <div class="scale-bookmark-list">
        ${h.length?h.map(p=>`<button type="button" data-bookmark-id="${p.id}"><strong>${p.name}</strong><span>${p.bestUnitLabel}</span></button>`).join(""):'<p class="scale-empty-state">No bookmarks yet. Open any object and tap Bookmark.</p>'}
      </div>
      <button type="button" data-bookmarks-clear>Clear All Bookmarks</button>
    `},u=h=>{h.target.closest("[data-bookmarks-close]")&&l(),h.target.closest("[data-bookmarks-clear]")&&c();let p=h.target.closest("[data-bookmark-id]")?.dataset.bookmarkId;if(p){let m=e.find(x=>x.id===p);m&&t.zoomTo(m)}};return i.addEventListener("click",u),d(),{open:o,close:l,toggle:a,isBookmarked:r,list:()=>[...s],destroy(){i.removeEventListener("click",u)}}}function au(){try{let n=JSON.parse(localStorage.getItem(Ul)??"[]");return Array.isArray(n)?n:[]}catch{return[]}}function Nl(n){localStorage.setItem(Ul,JSON.stringify(n))}function ou(n,e,t=76){return t*10**(Math.log10(n)-e)}function Bl(n,e,t,i,s,r=new Set){let a=Math.min(t*.72,i*.75);return n.map(o=>({object:o,extent:ou(o.sizeMeters,e),distance:Math.abs(o.logSize-e)})).filter(o=>o.extent>=3&&o.extent<=a&&(r.size===0||r.has(o.object.categoryGroup)||o.object.id===s)).sort((o,l)=>+(l.object.id===s)-+(o.object.id===s)||Ol(l.object)-Ol(o.object)||o.distance-l.distance)}function Ol(n){let e=["human","door","laptop","microscope","car","school-bus","chair","desk","football","earth","moon","jupiter","sun","dna-width","hydrogen-atom","red-blood-cell","observable-universe"];return n.importance+(e.includes(n.id)?8:0)}function kl(n,e,t,i=0,s=0,r=null){let a=e<600,o=a?4:8,l=a?104:112,c=Math.max(80,t-l-45),d=[[],[]],u=[0,0],h=[];for(let p of n){if(h.length>=o)break;let{object:m,extent:x}=p,g=m.dimensionAxis==="vertical"?m.assetAspect??.65:m.dimensionAxis==="diameter"?1:Math.max(1,m.assetAspect??1.5),f=m.dimensionAxis==="vertical"?x*g:x,S=m.dimensionAxis==="vertical"?x:x/g,A=Math.max(f+28,a?110:150,m.name.length*6.5+18),b=u[0]<=u[1]?0:1;if(u[b]+A>e-40&&(b=1-b),u[b]+A>e-40||S>c*.6){if(m.id!==r)continue;b=1}let C={...p,boxWidth:f,boxHeight:S,radius:x/2,row:b,footprint:A,opacity:Math.min(1,(x-2)/9)};d[b].push(C),u[b]+=A,h.push(C)}return d.forEach((p,m)=>{let x=(e-u[m])/2;p.forEach(g=>{g.screenX=x+g.footprint/2+i,g.screenY=l+c*(m===0?.36:.86)-g.boxHeight/2+s,x+=g.footprint})}),h}var zl=new Map;function $t(n){return n<-12?"Subatomic":n<-9?"Atomic":n<-6?"Molecular":n<-3?"Cellular / Microscopic":n<3?"Human Scale":n<8?"Planetary":n<13?"Solar System":n<18?"Interstellar":n<23?"Galactic":"Cosmic"}function Hl(n,e){let{width:t,height:i,currentLog:s,panX:r,panY:a,objects:o,selectedObjectId:l}=e;n.clearRect(0,0,t,i),cu(n,t,i,s),hu(n,t,i,s);let c=Bl(o,s,t,i,l,e.categoryFilters),d=kl(c,t,i,r,a,l);e.layoutPositions??=new Map,e.layoutAnimating=!1;for(let m of d){let x=e.layoutPositions.get(m.object.id);if(x&&!e.prefersReducedMotion){let g=m.screenX-x.x,f=m.screenY-x.y;Math.abs(g)+Math.abs(f)>.5&&(m.screenX=x.x+g*.22,m.screenY=x.y+f*.22,e.layoutAnimating=!0)}e.layoutPositions.set(m.object.id,{x:m.screenX,y:m.screenY})}let u=new Set(d.map(m=>m.object.id));for(let m of e.layoutPositions.keys())u.has(m)||e.layoutPositions.delete(m);let h=[];d.length||(n.fillStyle="#a8c6db",n.font="13px Inter, system-ui",n.textAlign="center",n.fillText("No catalog reference at this length. Use the ruler or search to continue.",t/2,i*.65,t-32));for(let m of d){n.save(),n.globalAlpha=m.opacity;let{screenX:x,screenY:g,boxWidth:f,boxHeight:S,object:A}=m,b=g+S/2+5;n.strokeStyle="rgba(102,210,244,.24)",n.lineWidth=1,n.beginPath(),n.ellipse(x,b,Math.max(14,f*.6),5,0,0,Math.PI*2),n.stroke(),A.sourceBox&&Wl(n,A,x,g,m.radius)||e.models?.draw(n,A,x,g,f,S)||(A.category==="Astronomical Distance"||A.id==="planck-length"||A.id==="electron"||A.id.includes("quark")?$l(n,x,g,m.extent/3,"#9edaf0"):uu(n,m)),n.strokeStyle="rgba(139,211,239,.65)",n.lineWidth=1,n.beginPath(),n.moveTo(x-m.extent/2,b+9),n.lineTo(x+m.extent/2,b+9),n.stroke();for(let w of[-1,1])n.beginPath(),n.moveTo(x+w*m.extent/2,b+5),n.lineTo(x+w*m.extent/2,b+13),n.stroke();n.restore(),Cu(n,m,h,s,t,A.id===l,i)}let p=d.find(m=>m.object.id===l);return p&&Ru(n,p),n.font=`${t<600?9:11}px Inter, system-ui`,n.fillStyle="#9bb9cc",n.textAlign="left",n.fillText(t<600?`${d.length} visible / ${o.length} searchable \xB7 shared physical scale`:`${d.length} visible / ${o.length} searchable \xB7 shared physical scale \xB7 illustrative surfaces`,18,i-16),t>=600&&(n.textAlign="right",n.fillText(`76 px = ${lu(s)}`,t-18,i-16)),d}function lu(n){return`10^${n.toFixed(2)} m`}function cu(n,e,t,i){n.fillStyle="#030a18",n.fillRect(0,0,e,t);let s=Xl("/assets/scale-universe/cosmic-backdrop-v2.png");if(s?.complete&&s.naturalWidth){let o=Math.max(e/s.width,t/s.height);n.save(),n.globalAlpha=i<-3?.2:.65,n.drawImage(s,(e-s.width*o)/2,(t-s.height*o)/2,s.width*o,s.height*o),n.restore()}let r=i<-9?255:i<-3?170:i<6?207:i<18?225:260,a=n.createRadialGradient(e*.5,t*.65,0,e*.5,t*.65,e*.7);a.addColorStop(0,`hsla(${r},65%,32%,.22)`),a.addColorStop(1,"transparent"),n.fillStyle=a,n.fillRect(0,0,e,t),n.fillStyle="rgba(222,240,255,.45)";for(let o=0;o<110;o++)n.beginPath(),n.arc(o*137.5%e,o*83.7%t,o%5?.5:1,0,Math.PI*2),n.fill()}function hu(n,e,t,i){let s=t*.2;n.strokeStyle="rgba(112,194,235,.12)",n.lineWidth=1;for(let r=-12;r<=12;r++)n.beginPath(),n.moveTo(e/2+r*18,s),n.lineTo(e/2+r*150,t),n.stroke();for(let r=0;r<14;r++){let a=s+(t-s)*(r/13)**2;n.beginPath(),n.moveTo(0,a),n.lineTo(e,a),n.stroke()}}function uu(n,e){let{object:t,screenX:i,screenY:s,radius:r}=e;if(!(t.assetPath&&!["Particles","Atoms","Molecules","Cells and Microbes"].includes(t.categoryGroup)&&Wl(n,t,i,s,r)))return t.renderStyle==="atom"||t.renderStyle==="circle"&&t.categoryGroup==="Atoms"?fu(n,i,s,r,t.color):t.renderStyle==="circle"&&t.categoryGroup==="Molecules"||t.renderStyle==="molecule"?Gl(n,i,s,r,t.color):t.renderStyle==="dna"?xu(n,i,s,r,t.color):t.renderStyle==="virus"?pu(n,i,s,r,t.color):t.renderStyle==="bacteria"?_u(n,i,s,r,t.color):t.renderStyle==="redBloodCell"?mu(n,i,s,r,t.color):t.renderStyle==="whiteBloodCell"?gu(n,i,s,r,t.color):t.renderStyle==="cell"?za(n,i,s,r,t.color):t.renderStyle==="planetRings"?yu(n,i,s,r,t.color):t.renderStyle==="planet"?ql(n,i,s,r,t.color):t.renderStyle==="star"?vu(n,i,s,r,t.color):t.renderStyle==="galaxy"?bu(n,i,s,r,t.color):t.renderStyle==="cosmicStructure"?Su(n,i,s,r,t.color):t.renderStyle==="human"?Mu(n,i,s,r,t.color):t.renderStyle==="animal"?Au(n,i,s,r,t.color):t.renderStyle==="building"?Eu(n,i,s,r,t.color):t.renderStyle==="vehicle"?Tu(n,i,s,r,t.color):t.renderStyle==="mountain"?wu(n,i,s,r,t.color):t.renderStyle==="lineDistance"?$l(n,i,s,r,t.color):t.renderStyle==="ellipse"?ka(n,i,s,r,t.color):Ba(n,i,s,r,t.color)}function Wl(n,e,t,i,s){let r=Xl(e.assetPath);if(!r||!r.complete||r.naturalWidth===0)return!1;let{width:a,height:o}=du(e,r,s);return n.save(),["Galaxy","Nebula","Supercluster","Galaxy Group","Cosmic Horizon","Cosmic Structure","Star Cluster"].includes(e.category)&&(n.globalCompositeOperation="screen"),n.shadowColor="rgba(0,0,0,0.34)",n.shadowBlur=Math.max(6,Math.max(a,o)*.08),n.shadowOffsetY=Math.max(2,Math.max(a,o)*.04),e.sourceBox?n.drawImage(r,...e.sourceBox,t-a/2,i-o/2,a,o):n.drawImage(r,t-a/2,i-o/2,a,o),n.restore(),!0}function du(n,e,t){let i=n.sourceBox?n.sourceBox[2]/n.sourceBox[3]:e.naturalWidth/e.naturalHeight||1,s=t*2;return n.dimensionAxis==="vertical"?{width:s*i,height:s}:{width:s,height:s/i}}function Xl(n){if(typeof Image>"u")return null;let e=zl.get(n);if(e)return e;let t=new Image;return t.decoding="async",t.loading="eager",t.onload=()=>window.dispatchEvent(new Event("scale-asset-ready")),t.src=n,zl.set(n,t),t}function fu(n,e,t,i,s){let r=n.createRadialGradient(e,t,0,e,t,i);r.addColorStop(0,"rgba(135,191,255,.65)"),r.addColorStop(.4,"rgba(100,160,255,.25)"),r.addColorStop(1,"rgba(100,160,255,0)"),n.fillStyle=r,n.beginPath(),n.arc(e,t,i,0,Math.PI*2),n.fill(),n.fillStyle=s;for(let a=0;a<170;a++){let o=a*2.39996,l=i*Math.sqrt(a*.618034%1);n.globalAlpha=.2+.5*(1-l/i),n.beginPath(),n.arc(e+Math.cos(o)*l,t+Math.sin(o)*l,.7,0,Math.PI*2),n.fill()}n.globalAlpha=1}function Gl(n,e,t,i,s){let r=[[e-i*.55,t+i*.08,i*.34],[e+i*.15,t-i*.2,i*.45],[e+i*.72,t+i*.22,i*.28]];n.strokeStyle="rgba(255,255,255,0.55)",n.lineWidth=Math.max(2,i*.08),n.beginPath(),n.moveTo(r[0][0],r[0][1]),n.lineTo(r[1][0],r[1][1]),n.lineTo(r[2][0],r[2][1]),n.stroke();for(let[a,o,l]of r)Ba(n,a,o,l,s)}function pu(n,e,t,i,s){n.strokeStyle=s,n.lineWidth=Math.max(2,i*.06);for(let r=0;r<12;r+=1){let a=r/12*Math.PI*2;n.beginPath(),n.moveTo(e+Math.cos(a)*i*.82,t+Math.sin(a)*i*.82),n.lineTo(e+Math.cos(a)*i*1.2,t+Math.sin(a)*i*1.2),n.stroke(),Ba(n,e+Math.cos(a)*i*1.28,t+Math.sin(a)*i*1.28,i*.12,s)}za(n,e,t,i,s)}function Ba(n,e,t,i,s){let r=n.createRadialGradient(e,t,1,e,t,i*2.3);r.addColorStop(0,s),r.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=r,n.beginPath(),n.arc(e,t,i*1.5,0,Math.PI*2),n.fill(),n.fillStyle=s,n.beginPath(),n.arc(e,t,Math.max(4,i*.55),0,Math.PI*2),n.fill()}function ka(n,e,t,i,s){n.fillStyle=s,n.beginPath(),n.ellipse(e,t,i*1.35,i*.72,-.15,0,Math.PI*2),n.fill(),n.strokeStyle="rgba(255,255,255,0.45)",n.stroke()}function za(n,e,t,i,s){ka(n,e,t,i,s),n.fillStyle="rgba(255,255,255,0.28)",n.beginPath(),n.ellipse(e,t,i*.58,i*.34,.2,0,Math.PI*2),n.fill(),n.fillStyle="rgba(255,255,255,0.22)";for(let r=0;r<5;r+=1)n.beginPath(),n.arc(e+Math.cos(r*1.7)*i*.52,t+Math.sin(r*1.4)*i*.34,Math.max(2,i*.07),0,Math.PI*2),n.fill()}function mu(n,e,t,i,s){ka(n,e,t,i,s);let r=n.createRadialGradient(e,t,1,e,t,i*.9);r.addColorStop(0,"rgba(80, 0, 0, 0.45)"),r.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=r,n.beginPath(),n.ellipse(e,t,i*.7,i*.38,0,0,Math.PI*2),n.fill()}function gu(n,e,t,i,s){za(n,e,t,i,s),n.fillStyle="rgba(59, 130, 246, 0.55)",n.beginPath(),n.arc(e-i*.1,t,i*.28,0,Math.PI*2),n.arc(e+i*.18,t+i*.08,i*.22,0,Math.PI*2),n.fill()}function _u(n,e,t,i,s){n.fillStyle=s,Ga(n,e-i,t-i*.48,i*2,i*.96,i*.48),n.fill(),n.strokeStyle="rgba(255,255,255,0.55)",n.stroke(),n.strokeStyle=s;for(let r=-2;r<=2;r+=1)n.beginPath(),n.moveTo(e+i*.8,t+r*i*.16),n.quadraticCurveTo(e+i*1.45,t+r*i*.4,e+i*1.9,t+r*i*.1),n.stroke()}function xu(n,e,t,i,s){n.lineWidth=Math.max(2,i*.07);for(let r of[-.32,.32]){n.strokeStyle=r<0?s:"#38bdf8",n.beginPath();for(let a=-20;a<=20;a+=1){let o=e+a/20*i*1.5,l=t+Math.sin(a*.75)*i*.32+r*i;a===-20?n.moveTo(o,l):n.lineTo(o,l)}n.stroke()}n.strokeStyle="rgba(255,255,255,0.65)";for(let r=-16;r<=16;r+=4)n.beginPath(),n.moveTo(e+r/20*i*1.5,t+Math.sin(r*.75)*i*.32-i*.22),n.lineTo(e+r/20*i*1.5,t+Math.sin(r*.75)*i*.32+i*.22),n.stroke()}function ql(n,e,t,i,s){let r=n.createRadialGradient(e-i*.35,t-i*.38,i*.1,e,t,i);r.addColorStop(0,"#ffffff"),r.addColorStop(.25,s),r.addColorStop(1,"#0f172a"),n.fillStyle=r,n.beginPath(),n.arc(e,t,i,0,Math.PI*2),n.fill(),n.strokeStyle="rgba(255,255,255,0.35)",n.stroke()}function yu(n,e,t,i,s){n.save(),n.strokeStyle="rgba(255,255,255,0.55)",n.lineWidth=Math.max(2,i*.05),n.beginPath(),n.ellipse(e,t,i*1.65,i*.42,-.25,0,Math.PI*2),n.stroke(),n.restore(),ql(n,e,t,i,s)}function vu(n,e,t,i,s){let r=n.createRadialGradient(e,t,i*.1,e,t,i*2.4);r.addColorStop(0,"#ffffff"),r.addColorStop(.35,s),r.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=r,n.beginPath(),n.arc(e,t,i*2.3,0,Math.PI*2),n.fill(),n.fillStyle=s,n.beginPath(),n.arc(e,t,i,0,Math.PI*2),n.fill()}function bu(n,e,t,i,s){n.save(),n.translate(e,t),n.rotate(-.35);let r=n.createRadialGradient(0,0,i*.1,0,0,i*1.7);r.addColorStop(0,"#ffffff"),r.addColorStop(.35,s),r.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=r,n.beginPath(),n.ellipse(0,0,i*1.65,i*.72,0,0,Math.PI*2),n.fill(),n.strokeStyle="rgba(255,255,255,0.45)";for(let a=0;a<2;a+=1){n.beginPath();for(let o=0;o<70;o+=1){let l=o/10,c=l+a*Math.PI,d=Math.cos(c)*l*i*.13,u=Math.sin(c)*l*i*.05;o===0?n.moveTo(d,u):n.lineTo(d,u)}n.stroke()}n.restore()}function Su(n,e,t,i,s){n.strokeStyle="rgba(147,197,253,0.45)",n.fillStyle=s,n.lineWidth=Math.max(1,i*.025);let r=[];for(let a=0;a<14;a+=1)r.push([e+Math.cos(a*2.1)*i*(.25+a%5*.18),t+Math.sin(a*1.7)*i*(.25+a%4*.18)]);n.beginPath();for(let a=0;a<r.length-1;a+=1)n.moveTo(r[a][0],r[a][1]),n.lineTo(r[a+1][0],r[a+1][1]);n.stroke();for(let[a,o]of r)n.beginPath(),n.arc(a,o,Math.max(2,i*.06),0,Math.PI*2),n.fill()}function Mu(n,e,t,i,s){n.strokeStyle=s,n.fillStyle=s,n.lineWidth=Math.max(2,i*.08),n.beginPath(),n.arc(e,t-i*.52,i*.18,0,Math.PI*2),n.fill(),n.beginPath(),n.moveTo(e,t-i*.32),n.lineTo(e,t+i*.35),n.moveTo(e-i*.38,t-i*.02),n.lineTo(e+i*.38,t-i*.02),n.moveTo(e,t+i*.35),n.lineTo(e-i*.35,t+i*.82),n.moveTo(e,t+i*.35),n.lineTo(e+i*.35,t+i*.82),n.stroke()}function Au(n,e,t,i,s){n.fillStyle=s,n.beginPath(),n.ellipse(e,t,i*1.15,i*.52,0,0,Math.PI*2),n.fill(),n.beginPath(),n.arc(e+i*.9,t-i*.25,i*.32,0,Math.PI*2),n.fill(),n.strokeStyle=s,n.lineWidth=Math.max(2,i*.08);for(let r of[-.45,-.12,.35,.68])n.beginPath(),n.moveTo(e+r*i,t+i*.42),n.lineTo(e+r*i,t+i*1.05),n.stroke()}function wu(n,e,t,i,s){n.fillStyle=s,n.beginPath(),n.moveTo(e-i*1.4,t+i),n.lineTo(e-i*.3,t-i*1.25),n.lineTo(e+i*.25,t+i*.2),n.lineTo(e+i*.65,t-i*.65),n.lineTo(e+i*1.45,t+i),n.closePath(),n.fill()}function Eu(n,e,t,i,s){n.fillStyle=s,n.fillRect(e-i*.55,t-i,i*1.1,i*2),n.fillStyle="rgba(255,255,255,0.45)";let r=3,a=5;for(let o=0;o<a;o+=1)for(let l=0;l<r;l+=1)n.fillRect(e-i*.38+l*i*.28,t-i*.75+o*i*.3,i*.12,i*.12)}function Tu(n,e,t,i,s){n.fillStyle=s,Ga(n,e-i*1.1,t-i*.35,i*2.2,i*.7,i*.15),n.fill(),n.fillStyle="rgba(255,255,255,0.55)",n.fillRect(e-i*.55,t-i*.25,i*.32,i*.22),n.fillRect(e+i*.05,t-i*.25,i*.32,i*.22),n.fillStyle="#0f172a",n.beginPath(),n.arc(e-i*.65,t+i*.38,i*.18,0,Math.PI*2),n.arc(e+i*.65,t+i*.38,i*.18,0,Math.PI*2),n.fill()}function $l(n,e,t,i,s){n.strokeStyle=s,n.lineWidth=Math.max(3,i*.06),n.beginPath(),n.moveTo(e-i*1.5,t),n.lineTo(e+i*1.5,t),n.stroke(),n.fillStyle=s,n.beginPath(),n.arc(e-i*1.5,t,Math.max(4,i*.16),0,Math.PI*2),n.arc(e+i*1.5,t,Math.max(4,i*.16),0,Math.PI*2),n.fill()}function Cu(n,e,t,i,s,r=!1,a=600){let{object:o,screenX:l,screenY:c,radius:d,opacity:u}=e,h=!0,p=Math.max(116,s-24),m=s<480?11:12;n.font=`${o.importance>=9||r?800:650} ${m}px Inter, system-ui, sans-serif`;let x=o.name,g=n.measureText(x),f=Math.min(g.width+14,p),S=s<480?24:26,A={x:ln(l-f/2,8,s-f-8),y:ln(c+e.boxHeight/2+20,108,a-54),width:f,height:S};for(let b=0;b<3&&t.some(C=>Vl(A,C));b+=1)A={...A,y:A.y+S+3};!r&&t.some(b=>Vl(A,b))||(t.push(A),n.globalAlpha=r?1:u,n.fillStyle=h?"rgba(5, 8, 22, 0.78)":"rgba(255,255,255,0.82)",Ga(n,A.x,A.y,A.width,A.height,9),n.fill(),n.strokeStyle="#4d91b7",n.stroke(),n.fillStyle="#e6f5ff",n.textAlign="center",n.textBaseline="middle",n.fillText(x,A.x+A.width/2,A.y+S/2+1,A.width-10),n.globalAlpha=1)}function Ru(n,e){n.save(),n.strokeStyle="#a78bfa",n.lineWidth=4,n.setLineDash([10,7]),n.beginPath(),n.arc(e.screenX,e.screenY,e.radius*1.35+12,0,Math.PI*2),n.stroke(),n.restore()}function Ga(n,e,t,i,s,r){let a=Math.min(r,i/2,s/2);n.beginPath(),n.moveTo(e+a,t),n.lineTo(e+i-a,t),n.quadraticCurveTo(e+i,t,e+i,t+a),n.lineTo(e+i,t+s-a),n.quadraticCurveTo(e+i,t+s,e+i-a,t+s),n.lineTo(e+a,t+s),n.quadraticCurveTo(e,t+s,e,t+s-a),n.lineTo(e,t+a),n.quadraticCurveTo(e,t,e+a,t)}function Vl(n,e){return n.x<e.x+e.width&&n.x+n.width>e.x&&n.y<e.y+e.height&&n.y+n.height>e.y}function ln(n,e,t){return Math.max(e,Math.min(t,n))}function Zl(n,e,t){let i=n.querySelector(".scale-slider-track"),s=n.querySelector(".scale-slider-fill"),r=n.querySelector(".scale-slider-thumb"),a=n.querySelector(".scale-slider-ticks"),o=!1;i.tabIndex=0,i.setAttribute("role","slider"),i.setAttribute("aria-label","Logarithmic reference length in meters"),i.setAttribute("aria-valuemin",String(St)),i.setAttribute("aria-valuemax",String(kt));let l=()=>{let m=(e.currentLog-St)/(kt-St)*100;i.setAttribute("aria-valuenow",e.currentLog.toFixed(2)),i.setAttribute("aria-valuetext",`10 to the power ${e.currentLog.toFixed(2)} meters`),s.style.width=`${m}%`,r.style.left=`${m}%`,r.innerHTML=`<strong>10<sup>${Math.round(e.targetLog)}</sup></strong><span>${e.scaleBand??"meters"}</span>`},c=m=>{let x=i.getBoundingClientRect(),g=ln((m-x.left)/x.width,0,1);e.targetLog=St+g*(kt-St),t(e.targetLog),l()},d=m=>{o=!0,c(Yl(m)),i.setPointerCapture?.(m.pointerId),m.preventDefault()},u=m=>{o&&(c(Yl(m)),m.preventDefault())},h=()=>{o=!1},p=m=>{let x={ArrowRight:.25,ArrowLeft:-.25,ArrowUp:-.25,ArrowDown:.25,PageUp:-3,PageDown:3};if(m.key==="Home")t(St);else if(m.key==="End")t(kt);else if(x[m.key]!==void 0)t(ln(e.targetLog+x[m.key],St,kt));else return;m.preventDefault(),m.stopPropagation()};return Iu(a),i.addEventListener("pointerdown",d),i.addEventListener("pointermove",u),i.addEventListener("pointerup",h),i.addEventListener("pointercancel",h),i.addEventListener("keydown",p),l(),{updateVisual:l,destroy(){i.removeEventListener("pointerdown",d),i.removeEventListener("pointermove",u),i.removeEventListener("pointerup",h),i.removeEventListener("pointercancel",h),i.removeEventListener("keydown",p)}}}function Yl(n){return n.clientX}function Iu(n){if(!n)return;let e=Array.from({length:kt-St+1},(t,i)=>St+i);n.innerHTML=e.map(t=>{let i=(t-St)/(kt-St)*100;return`<span class="${t%3===0||t===St||t===kt?"major":"minor"}" style="left:${i}%"><i></i><em>10<sup>${t}</sup></em></span>`}).join("")}function Jl(n,e,t){let i=n.querySelector(".scale-compare-panel"),s=n.querySelector(".scale-compare-select"),r=null,a=null,o=[];for(let p of e){let m=document.createElement("option");m.value=p.id,m.textContent=`${p.name} (${Lu(p.logSize)} m)`,s.appendChild(m)}let l=p=>{r=p,o=[],a=e.find(m=>m.id!==r.id&&m.importance>=9)??e[0],s.value=a.id,d(),i.hidden=!1},c=()=>{i.hidden=!0},d=()=>{if(!r||!a)return;let p=[r,a,...o].filter((S,A,b)=>b.findIndex(C=>C.id===S.id)===A),m=Math.max(...p.map(S=>S.sizeMeters)),x=r.sizeMeters>=a.sizeMeters?r:a,g=x===r?a:r,f=x.sizeMeters/g.sizeMeters;i.querySelector(".scale-compare-body").innerHTML=`
      <div class="scale-compare-grid">
        ${Va(r)}
        ${Va(a)}
        ${o.map(Va).join("")}
      </div>
      <div class="scale-compare-physical" aria-label="Shared linear scale comparison">${p.map(S=>`<div style="width:${100*S.sizeMeters/m}px;height:${100*S.sizeMeters/m}px"><span>${S.name}</span></div>`).join("")}</div>
      <p class="scale-compare-measure-note">Shared linear scale: 100 px = ${Vi(m)}. Smaller dimensions below one pixel remain subpixel; they are not enlarged. Comparing declared reference lengths, which may use different axes.</p>
      <button type="button" data-compare-add ${p.length>=4?"disabled":""}>Keep selection and add another (up to 4)</button>
      <p class="scale-compare-ratio"><strong>${x.name}</strong> is about <strong>${Pu(f)}</strong> larger than <strong>${g.name}</strong>.</p>
      <div class="scale-compare-actions">
        <button type="button" data-compare-zoom="a">Zoom to ${r.name}</button>
        <button type="button" data-compare-zoom="b">Zoom to ${a.name}</button>
      </div>
    `},u=()=>{a=e.find(p=>p.id===s.value)??a,d()},h=p=>{p.target.closest("[data-compare-close]")&&c(),p.target.closest("[data-compare-add]")&&a&&o.length<2&&(!o.some(x=>x.id===a.id)&&a.id!==r.id&&o.push(a),a=e.find(x=>x.id!==r.id&&!o.some(g=>g.id===x.id))??a,s.value=a.id,d());let m=p.target.closest("[data-compare-zoom]")?.dataset.compareZoom;m==="a"&&r&&t.zoomTo(r),m==="b"&&a&&t.zoomTo(a)};return s.addEventListener("change",u),i.addEventListener("click",h),{open:l,close:c,destroy(){s.removeEventListener("change",u),i.removeEventListener("click",h)}}}function Va(n){return`
    <article>
      <span>${n.category}</span>
      <strong>${n.name}</strong>
      <em>${Vi(n.sizeMeters)}</em>
      <small>10<sup>${n.logSize.toFixed(1)}</sup> meters</small>
    </article>
  `}function Pu(n){return!Number.isFinite(n)||n<=0?"unknown":n<1e3?`${n.toFixed(n>=100?0:1).replace(/\.0$/,"")}x`:n<1e6?`${(n/1e3).toFixed(n>=1e5?0:1).replace(/\.0$/,"")} thousand times`:n<1e9?`${(n/1e6).toFixed(n>=1e8?0:1).replace(/\.0$/,"")} million times`:`10^${Math.log10(n).toFixed(1)} times`}function Vi(n){if(n===0)return"0 m";let e=Math.floor(Math.log10(Math.abs(n))),t=n/Math.pow(10,e);return`${t.toFixed(t>=10?0:2).replace(/\.?0+$/,"")} x 10^${e} m`}function Lu(n){return`10^${n.toFixed(1)}`}var Ns=["Particles","Atoms","Molecules","Cells and Microbes","Human Scale","Animals","Earth and Geography","Planets and Moons","Stars","Galaxies","Cosmic Structures","Distances"];function jl(n,e,t){let i=n.querySelector(".scale-filter-panel"),s=new Set(Ns),r=()=>{i.innerHTML=`
      <div class="scale-filter-head">
        <p class="scale-eyebrow">Categories</p>
        <button type="button" data-filter-reset>Reset Filters</button>
      </div>
      <div class="scale-filter-chips">
        ${Ns.map(l=>`<button type="button" data-filter="${l}" aria-pressed="${s.has(l)}">${l}</button>`).join("")}
      </div>
    `},a=()=>{e.categoryFilters=new Set(s),t.onChange?.()},o=l=>{if(l.target.closest("[data-filter-reset]")){s.clear();for(let h of Ns)s.add(h);r(),a();return}let d=l.target.closest("[data-filter]");if(!d)return;let u=d.dataset.filter;s.has(u)?s.delete(u):s.add(u),r(),a()};return i.addEventListener("click",o),r(),a(),{reset(){s.clear();for(let l of Ns)s.add(l);r(),a()},destroy(){i.removeEventListener("click",o)}}}function Us(n,e,t={}){let i=(e.relatedObjects??[]).map(u=>t.objects?.find(h=>h.id===u)).filter(Boolean),s=t.isBookmarked?.(e.id);n.hidden=!1,n.dataset.sheetState="half",n.classList.remove("scale-sheet-expanded"),n.innerHTML=`
    <div class="scale-sheet-handle" aria-hidden="true"></div>
    <button class="scale-info-close" type="button" aria-label="Close object information">Close</button>
    <p class="scale-eyebrow">${e.category}</p>
    ${e.assetPath?`<img class="scale-info-sprite" src="${e.assetPath}" alt="" loading="lazy" />`:""}
    <h2>${e.name}</h2>
    <canvas class="scale-preview-canvas" width="640" height="320" aria-label="Illustrative object preview; drag to rotate"></canvas>
    <p class="scale-preview-caption">Illustrative preview \xB7 drag to rotate supported 3D models \xB7 main view uses shared measurement brackets</p>
    <dl>
      <div><dt>Measurement</dt><dd>Approximate ${e.measurementType}</dd></div>
      <div><dt>Best unit</dt><dd>${e.bestUnitLabel??Vi(e.sizeMeters)}</dd></div>
      <div><dt>Size in meters</dt><dd>${Vi(e.sizeMeters)}</dd></div>
      <div><dt>Power of ten</dt><dd>10<sup>${e.logSize.toFixed(1)}</sup> meters</dd></div>
      <div><dt>Scale band</dt><dd>${e.scaleBand??$t(e.logSize)}</dd></div>
      <div><dt>Difficulty</dt><dd>${e.difficultyLevel??"beginner"}</dd></div>
      <div><dt>Scientific notation</dt><dd>${e.formula}</dd></div>
    </dl>
    <p>${e.summary}</p>
    <p>${e.measurementDefinition}</p>
    <p class="scale-source-note">${e.uncertainty}<br><strong>${e.validationStatus}</strong><br>${e.sourceUrl?`<a href="${e.sourceUrl}" target="_blank" rel="noopener noreferrer">${e.sourceName}</a>`:e.sourceName}</p>
    <h3>Why this matters</h3>
    <p>${e.whyItMatters}</p>
    <h3>Key facts</h3>
    <ol>${e.facts.map(u=>`<li>${u}</li>`).join("")}</ol>
    <h3>Scale notation</h3>
    <code>${e.formula}</code>
    ${i.length?`<h3>Related objects</h3><div class="scale-related-list">${i.map(u=>`<button type="button" data-related-id="${u.id}">${u.name}</button>`).join("")}</div>`:""}
    ${e.learningTags?.length?`<div class="scale-info-tags">${e.learningTags.map(u=>`<span>${u}</span>`).join("")}</div>`:""}
    <div class="scale-info-actions">
      <button type="button" data-info-action="focus">Focus Object</button>
      ${e.sourceUrl?`<a href="${e.sourceUrl}" target="_blank" rel="noopener noreferrer">Learn More \u2197</a>`:'<button type="button" disabled title="Independent measurement source is pending review">Source review pending</button>'}
      <button type="button" data-info-action="bookmark">${s?"Remove Bookmark":"Bookmark"}</button>
      <button type="button" data-info-action="compare">Compare</button>
      <button type="button" data-info-action="journey">Guided Journey</button>
      <button type="button" data-info-action="more">More</button>
    </div>
  `;let r=n.querySelector("canvas"),a=r.getContext("2d"),o=0,l=null,c=()=>{if(a.clearRect(0,0,640,320),!t.models?.draw(a,e,320,155,205,205,o)){let u=new Image;u.onload=()=>{if(!r.isConnected)return;let h=230/Math.max(u.width,u.height);a.drawImage(u,320-u.width*h/2,155-u.height*h/2,u.width*h,u.height*h)},e.assetPath&&(u.src=e.assetPath)}};c(),r.onpointerdown=u=>{l=u.clientX,r.setPointerCapture(u.pointerId)},r.onpointermove=u=>{l!==null&&(o+=(u.clientX-l)*.02,l=u.clientX,c())},r.onpointerup=r.onpointercancel=()=>{l=null};let d=u=>{u.target.closest(".scale-info-close")&&t.onClose?.();let h=u.target.closest("[data-info-action]")?.dataset.infoAction;h==="compare"&&t.onCompare?.(e),h==="focus"&&t.onRelated?.(e),h==="journey"&&t.onJourney?.(e),h==="bookmark"&&t.onBookmark?.(e),h==="more"&&(n.classList.toggle("scale-sheet-expanded"),n.dataset.sheetState=n.classList.contains("scale-sheet-expanded")?"expanded":"half");let p=u.target.closest("[data-related-id]")?.dataset.relatedId;if(p){let m=t.objects?.find(x=>x.id===p);m&&t.onRelated?.(m)}};n.onclick=d}function Hi(n){n.hidden=!0,n.onclick=null,n.innerHTML=""}var Ha=[{id:"complete-universe",name:"From Planck Length to the Observable Universe",objectIds:["planck-length","proton","hydrogen-atom","dna-width","virus","red-blood-cell","human","school-bus","burj-khalifa","mount-everest","earth","jupiter","sun","solar-system","light-year","milky-way","local-group","laniakea","observable-universe"]},{id:"atom-to-human",name:"From Atom to Human",objectIds:["hydrogen-atom","dna-width","virus","e-coli","red-blood-cell","human-hair-width","human"]},{id:"cell-to-elephant",name:"From Cell to Elephant",objectIds:["red-blood-cell","human-hair-width","grain-of-sand","ant","human","giraffe","elephant"]},{id:"earth-to-sun",name:"From Earth to Sun",objectIds:["moon","earth","jupiter","sun","earth-sun-distance"]},{id:"solar-to-galaxy",name:"From Solar System to Galaxy",objectIds:["sun","earth-sun-distance","solar-system","light-year","milky-way"]},{id:"human-to-observable",name:"From Human to Observable Universe",objectIds:["human","mount-everest","earth","sun","solar-system","light-year","milky-way","local-group","observable-universe"]}];function Kl(n,e,t){let i=n.querySelector(".scale-journey-picker"),s=n.querySelector(".scale-journey-status"),r=null,a=0;i.innerHTML=Ha.map(f=>`<button type="button" data-journey-id="${f.id}">${f.name}</button>`).join("");let o=()=>{i.hidden=!1,s.hidden=!0},l=()=>{i.hidden=!0},c=f=>{r=Ha.find(S=>S.id===f)??Ha[0],a=0,i.hidden=!0,s.hidden=!1,p()},d=()=>{r=null,a=0,s.hidden=!0},u=()=>{r&&(a=Math.min(r.objectIds.length-1,a+1),p())},h=()=>{r&&(a=Math.max(0,a-1),p())},p=()=>{let f=Du(e,r,a);f&&(t.zoomTo(f),m(f))},m=f=>{s.innerHTML=`
      <p class="scale-eyebrow">Guided Journey</p>
      <h3>${r.name}</h3>
      <strong>Step ${a+1} of ${r.objectIds.length}</strong>
      <p>${f.name}</p><p>${f.measurementDefinition??f.summary}</p>
      <small>Size: 10<sup>${f.logSize.toFixed(1)}</sup> m</small>
      <div class="scale-journey-actions">
        <button type="button" data-journey-action="previous" ${a===0?"disabled":""}>Previous</button>
        <button type="button" data-journey-action="next" ${a===r.objectIds.length-1?"disabled":""}>Next</button>
        <button type="button" data-journey-action="exit">Exit Journey</button>
      </div>
    `},x=f=>{let S=f.target.closest("[data-journey-id]")?.dataset.journeyId;S&&c(S)},g=f=>{let S=f.target.closest("[data-journey-action]")?.dataset.journeyAction;S==="previous"&&h(),S==="next"&&u(),S==="exit"&&d()};return i.addEventListener("click",x),s.addEventListener("click",g),{openPicker:o,closePicker:l,start:c,next:u,previous:h,exit:d,destroy(){i.removeEventListener("click",x),s.removeEventListener("click",g)}}}function Du(n,e,t){return e?n.find(i=>i.id===e.objectIds[t])??null:null}function Ql(n,e){let t=n.querySelector(".scale-quiz-panel"),i=[],s=0,r=0,a=!1,o=()=>{i=Nu(e).slice(0,10),s=0,r=0,a=!1,t.hidden=!1,c()},l=()=>{t.hidden=!0},c=(p="")=>{let m=i[s];if(!m){t.innerHTML=`
        <button type="button" class="scale-info-close" data-quiz-close>Close</button>
        <p class="scale-eyebrow">Quiz complete</p>
        <h3>Score: ${r}/10</h3>
        <p>${r>=8?"Excellent scale thinking.":"Good practice. Try again to strengthen powers-of-ten intuition."}</p>
        <button type="button" data-quiz-restart>Restart Quiz</button>
      `;return}t.innerHTML=`
      <button type="button" class="scale-info-close" data-quiz-close aria-label="Exit quiz">Close</button>
      <p class="scale-eyebrow">Quiz Mode</p>
      <h3>Question ${s+1} of 10</h3>
      <p>${m.prompt}</p>
      <div class="scale-quiz-options">
        ${m.options.map(x=>`<button type="button" data-answer="${x.id}">${x.label}</button>`).join("")}
      </div>
      ${p?`<p class="scale-quiz-feedback">${p}</p>`:""}
      <div class="scale-quiz-footer">
        <strong>Score: ${r}</strong>
        <button type="button" data-quiz-next ${a?"":"disabled"}>${s===9?"Finish":"Next"}</button>
      </div>
    `},d=p=>{if(a)return;let m=i[s];a=!0;let x=p===m.answerId;x&&(r+=1),c(`${x?"Correct.":"Not quite."} ${m.explanation}`)},u=()=>{a&&(s+=1,a=!1,c())},h=p=>{p.target.closest("[data-quiz-close]")&&l(),p.target.closest("[data-quiz-restart]")&&o(),p.target.closest("[data-quiz-next]")&&u();let m=p.target.closest("[data-answer]")?.dataset.answer;m&&d(m)};return t.addEventListener("click",h),{start:o,close:l,destroy(){t.removeEventListener("click",h)}}}function Nu(n){let e=n.filter(u=>u.importance>=8),t=[Wi("earth","mount-everest"),Wi("human","red-blood-cell"),Wi("sun","earth"),Wi("milky-way","solar-system"),Wi("elephant","ant")].map(([u,h])=>{let p=n.find(g=>g.id===u),m=n.find(g=>g.id===h);if(!p||!m)return null;let x=p.sizeMeters>m.sizeMeters?p:m;return{type:"larger",prompt:`Which is larger: ${p.name} or ${m.name}?`,options:[{id:p.id,label:p.name},{id:m.id,label:m.name}],answerId:x.id,explanation:`${x.name} is larger because it measures about ${x.bestUnitLabel}.`}}).filter(Boolean),i=e.slice(0,8).map(u=>{let h=$t(u.logSize),p=Uu([h,"Subatomic","Atomic","Molecular","Cellular / Microscopic","Human Scale","Planetary","Galactic","Cosmic"]).slice(0,4);return{type:"band",prompt:`Which scale band best matches ${u.name}?`,options:p.map(m=>({id:m,label:m})),answerId:h,explanation:`${u.name} belongs near 10^${Math.round(u.logSize)} meters, which is ${h}.`}}),s=n.find(u=>u.id==="earth"),r=n.find(u=>u.id==="jupiter"),a=(r.sizeMeters/s.sizeMeters).toFixed(1),o={type:"ratio",prompt:"Approximately how many Earth mean diameters fit across Jupiter?",options:[a,"2.0","100.0","1000.0"].map(u=>({id:u,label:u})),answerId:a,explanation:`Divide Jupiter\u2019s ${r.bestUnitLabel} by Earth\u2019s ${s.bestUnitLabel}: about ${a}.`},l=["e-coli","virus","red-blood-cell","human"].map(u=>n.find(h=>h.id===u)),c=[...l].sort((u,h)=>Math.abs(u.logSize+6)-Math.abs(h.logSize+6))[0],d={type:"nearest",prompt:"Which reference length is closest to 10\u207B\u2076 meters on the logarithmic ruler?",options:l.map(u=>({id:u.id,label:u.name})),answerId:c.id,explanation:`${c.name} has reference length ${c.bestUnitLabel}.`};return[...t,o,d,...i]}function Wi(n,e){return[n,e]}function Uu(n){return[...new Set(n)]}function ec(n,e,t,i,s,r={}){let a=h=>h.searchText??`${h.name} ${h.category} ${(h.learningTags??[]).join(" ")}`.toLowerCase(),o=()=>{let h=n.value.trim().toLowerCase();if(e.innerHTML="",t.hidden=!h,!h){e.hidden=!0;return}let p=i.filter(x=>a(x).includes(h)).sort((x,g)=>g.importance-x.importance).slice(0,8);if(e.hidden=!1,p.length===0){e.innerHTML='<p class="scale-empty-state">No results. Try biology, micrometer, planet, galaxy, or beginner.</p>';return}let m=r.getFilters?.()??new Set;for(let x of p){let g=m.size>0&&!m.has(x.categoryGroup),f=document.createElement("button");f.type="button",f.dataset.objectId=x.id,f.innerHTML=`<strong>${r.isBookmarked?.(x.id)?"* ":""}${x.name}</strong><small>${x.category} - ${x.scaleBand} - ${x.difficultyLevel}</small><em>${x.bestUnitLabel}${g?" - hidden by filter":""}</em>`,e.appendChild(f)}},l=h=>{let p=h.target.closest?.("button[data-object-id]");if(!p)return;let m=i.find(x=>x.id===p.dataset.objectId);m&&(n.value=m.name,e.hidden=!0,s(m),h.preventDefault())},c=h=>{if(h.key==="ArrowDown"){e.querySelector("button")?.focus(),h.preventDefault();return}if(h.key!=="Enter")return;let p=n.value.trim().toLowerCase();if(!p)return;let m=i.find(x=>x.name.toLowerCase()===p||x.aliases?.some(g=>g.toLowerCase()===p))??i.find(x=>a(x).includes(p));m&&(n.value=m.name,t.hidden=!1,e.hidden=!0,s(m))},d=()=>{n.value="",t.hidden=!0,e.hidden=!0,n.focus()},u=h=>{!e.contains(h.target)&&h.target!==n&&(e.hidden=!0)};return n.addEventListener("input",o),n.addEventListener("focus",o),n.addEventListener("keydown",c),t.addEventListener("click",d),e.addEventListener("click",l),document.addEventListener("click",u),{destroy(){n.removeEventListener("input",o),n.removeEventListener("focus",o),n.removeEventListener("keydown",c),t.removeEventListener("click",d),e.removeEventListener("click",l),document.removeEventListener("click",u)}}}var Fs=[{id:"powers-of-ten-atom-to-human",title:"Powers of Ten: Atom to Human",steps:[Nt("hydrogen-atom","Atoms are around 10^-10 meters, far too small to see directly."),Nt("dna-width","DNA width is measured in nanometers."),Nt("red-blood-cell","Cells move us into micrometers."),Nt("human","Human size is the everyday meter-scale reference.")]},{id:"biology-scale-molecule-to-cell",title:"Biology Scale: Molecule to Cell",steps:[Nt("water-molecule","Molecules are nanoscale arrangements of atoms."),Nt("protein-molecule","Proteins are larger molecular machines."),Nt("virus","Viruses bridge molecular scale and living cells."),Nt("e-coli","Bacteria are usually micrometer-scale organisms."),Nt("red-blood-cell","Human cells can be compared directly under microscopes.")]},{id:"space-scale-earth-to-observable",title:"Space Scale: Earth to Observable Universe",steps:[Nt("earth","Earth is a planet-scale object measured in kilometers."),Nt("earth-sun-distance","Astronomical units help with Solar System distances."),Nt("light-year","Light years help with distances between stars."),Nt("milky-way","Galaxies contain billions of stars."),Nt("observable-universe","The observable universe is the largest scale in this module.")]}];function tc(n,e,t){let i=n.querySelector(".scale-teacher-panel"),s=!1,r=Fs[0],a=0,o=!1,l=()=>{s=!0,n.classList.add("scale-teacher-mode"),h(),i.hidden=!1},c=()=>{o=!1,t.setPaused?.(!1),s=!1,n.classList.remove("scale-teacher-mode"),i.hidden=!0},d=f=>{r=Fs.find(S=>S.id===f)??Fs[0],a=0,u()},u=()=>{let f=r.steps[a],S=e.find(A=>A.id===f.objectId);S&&t.zoomTo(S),i.innerHTML=`
      <p class="scale-eyebrow">Teacher Mode</p>
      <h3>${r.title}</h3>
      <strong>Step ${a+1} of ${r.steps.length}</strong>
      <p>${f.teachingNote}</p>
      <div class="scale-journey-actions">
        <button type="button" data-teacher-action="previous" ${a===0?"disabled":""}>Previous</button>
        <button type="button" data-teacher-action="next" ${a===r.steps.length-1?"disabled":""}>Next</button>
        <button type="button" data-teacher-action="exit">Exit Teacher Mode</button>
        <button type="button" data-teacher-action="pause">${o?"Resume":"Pause"} transition</button>
      </div>
      <small>Keyboard: Left/Right arrows move steps, F fullscreen, Escape exits.</small>
    `},h=()=>{i.innerHTML=`
      <p class="scale-eyebrow">Teacher Mode</p>
      <h3>Choose a classroom lesson</h3>
      <div class="scale-teacher-lessons">
        ${Fs.map(f=>`<button type="button" data-teacher-lesson="${f.id}">${f.title}</button>`).join("")}
      </div>
      <button type="button" data-teacher-action="exit">Exit Teacher Mode</button>
      <small>Keyboard: Left/Right arrows move steps, F fullscreen, Escape exits.</small>
    `},p=()=>{a=Math.min(r.steps.length-1,a+1),u()},m=()=>{a=Math.max(0,a-1),u()},x=f=>{let S=f.target.closest("[data-teacher-lesson]")?.dataset.teacherLesson;S&&d(S);let A=f.target.closest("[data-teacher-action]")?.dataset.teacherAction;A==="next"&&p(),A==="previous"&&m(),A==="exit"&&c(),A==="pause"&&(o=!o,t.setPaused?.(o),f.target.textContent=`${o?"Resume":"Pause"} transition`)},g=f=>{s&&(f.target.closest?.("input,textarea,select")||(f.key==="ArrowRight"&&p(),f.key==="ArrowLeft"&&m(),f.key==="Escape"&&c(),f.key.toLowerCase()==="f"&&n.requestFullscreen?.()))};return i.addEventListener("click",x),window.addEventListener("keydown",g),{open:l,close:c,isEnabled:()=>s,destroy(){i.removeEventListener("click",x),window.removeEventListener("keydown",g)}}}function Nt(n,e){return{objectId:n,teachingNote:e}}var kr="184";var Sc=0,wo=1,Mc=2;var _s=1,Ac=2,Ui=3,In=0,Dt=1,gn=2,_n=0,li=1,Eo=2,To=3,Co=4,wc=5;var Wn=100,Ec=101,Tc=102,Cc=103,Rc=104,Ic=200,Pc=201,Lc=202,Dc=203,sr=204,rr=205,Nc=206,Uc=207,Fc=208,Oc=209,Bc=210,kc=211,zc=212,Gc=213,Vc=214,ar=0,or=1,lr=2,ci=3,cr=4,hr=5,ur=6,dr=7,Ro=0,Hc=1,Wc=2,tn=0,Io=1,Po=2,Lo=3,Do=4,No=5,Uo=6,Fo=7;var Oo=300,jn=301,hi=302,zr=303,Gr=304,xs=306,fr=1e3,un=1001,pr=1002,bt=1003,Xc=1004;var ys=1005;var Mt=1006,Vr=1007;var Kn=1008;var Ot=1009,Bo=1010,ko=1011,Fi=1012,Hr=1013,nn=1014,sn=1015,xn=1016,Wr=1017,Xr=1018,Oi=1020,zo=35902,Go=35899,Vo=1021,Ho=1022,Jt=1023,dn=1026,Qn=1027,Wo=1028,qr=1029,ei=1030,$r=1031;var Yr=1033,vs=33776,bs=33777,Ss=33778,Ms=33779,Zr=35840,Jr=35841,jr=35842,Kr=35843,Qr=36196,ea=37492,ta=37496,na=37488,ia=37489,As=37490,sa=37491,ra=37808,aa=37809,oa=37810,la=37811,ca=37812,ha=37813,ua=37814,da=37815,fa=37816,pa=37817,ma=37818,ga=37819,_a=37820,xa=37821,ya=36492,va=36494,ba=36495,Sa=36283,Ma=36284,ws=36285,Aa=36286;var Ji=2300,mr=2301,ir=2302,mo=2303,go=2400,_o=2401,xo=2402;var qc=3200;var wa=0,$c=1,Dn="",Ct="srgb",ji="srgb-linear",Ki="linear",Je="srgb";var oi=7680;var yo=519,Yc=512,Zc=513,Jc=514,Ea=515,jc=516,Kc=517,Ta=518,Qc=519,vo=35044;var Xo="300 es",en=2e3,Ci=2001;function Fu(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Ou(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function Qi(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function eh(){let n=Qi("canvas");return n.style.display="block",n}var nc={},Ri=null;function qo(...n){let e="THREE."+n.shift();Ri?Ri("log",e,...n):console.log(e,...n)}function th(n){let e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ce(...n){n=th(n);let e="THREE."+n.shift();if(Ri)Ri("warn",e,...n);else{let t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Re(...n){n=th(n);let e="THREE."+n.shift();if(Ri)Ri("error",e,...n);else{let t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function gr(...n){let e=n.join(" ");e in nc||(nc[e]=!0,Ce(...n))}function nh(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}var ih={[ar]:or,[lr]:ur,[cr]:dr,[ci]:hr,[or]:ar,[ur]:lr,[dr]:cr,[hr]:ci},fn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let s=i[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Et=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Wa=Math.PI/180,_r=180/Math.PI;function Es(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Et[n&255]+Et[n>>8&255]+Et[n>>16&255]+Et[n>>24&255]+"-"+Et[e&255]+Et[e>>8&255]+"-"+Et[e>>16&15|64]+Et[e>>24&255]+"-"+Et[t&63|128]+Et[t>>8&255]+"-"+Et[t>>16&255]+Et[t>>24&255]+Et[i&255]+Et[i>>8&255]+Et[i>>16&255]+Et[i>>24&255]).toLowerCase()}function We(n,e,t){return Math.max(e,Math.min(t,n))}function Bu(n,e){return(n%e+e)%e}function Xa(n,e,t){return(1-t)*n+t*e}function Xi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ut(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var $e=class n{static{n.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(We(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(We(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},pn=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],d=i[s+2],u=i[s+3],h=r[a+0],p=r[a+1],m=r[a+2],x=r[a+3];if(u!==x||l!==h||c!==p||d!==m){let g=l*h+c*p+d*m+u*x;g<0&&(h=-h,p=-p,m=-m,x=-x,g=-g);let f=1-o;if(g<.9995){let S=Math.acos(g),A=Math.sin(S);f=Math.sin(f*S)/A,o=Math.sin(o*S)/A,l=l*f+h*o,c=c*f+p*o,d=d*f+m*o,u=u*f+x*o}else{l=l*f+h*o,c=c*f+p*o,d=d*f+m*o,u=u*f+x*o;let S=1/Math.sqrt(l*l+c*c+d*d+u*u);l*=S,c*=S,d*=S,u*=S}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){let o=i[s],l=i[s+1],c=i[s+2],d=i[s+3],u=r[a],h=r[a+1],p=r[a+2],m=r[a+3];return e[t]=o*m+d*u+l*p-c*h,e[t+1]=l*m+d*h+c*u-o*p,e[t+2]=c*m+d*p+o*h-l*u,e[t+3]=d*m-o*u-l*h-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),d=o(s/2),u=o(r/2),h=l(i/2),p=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=h*d*u+c*p*m,this._y=c*p*u-h*d*m,this._z=c*d*m+h*p*u,this._w=c*d*u-h*p*m;break;case"YXZ":this._x=h*d*u+c*p*m,this._y=c*p*u-h*d*m,this._z=c*d*m-h*p*u,this._w=c*d*u+h*p*m;break;case"ZXY":this._x=h*d*u-c*p*m,this._y=c*p*u+h*d*m,this._z=c*d*m+h*p*u,this._w=c*d*u-h*p*m;break;case"ZYX":this._x=h*d*u-c*p*m,this._y=c*p*u+h*d*m,this._z=c*d*m-h*p*u,this._w=c*d*u+h*p*m;break;case"YZX":this._x=h*d*u+c*p*m,this._y=c*p*u+h*d*m,this._z=c*d*m-h*p*u,this._w=c*d*u-h*p*m;break;case"XZY":this._x=h*d*u-c*p*m,this._y=c*p*u-h*d*m,this._z=c*d*m+h*p*u,this._w=c*d*u+h*p*m;break;default:Ce("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],d=t[6],u=t[10],h=i+o+u;if(h>0){let p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(d-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(i>o&&i>u){let p=2*Math.sqrt(1+i-o-u);this._w=(d-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>u){let p=2*Math.sqrt(1+o-i-u);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+d)/p}else{let p=2*Math.sqrt(1+u-i-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(We(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+a*o+s*c-r*l,this._y=s*d+a*l+r*o-i*c,this._z=r*d+a*c+i*l-s*o,this._w=a*d-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),d=Math.sin(c);l=Math.sin(l*c)/d,t=Math.sin(t*c)/d,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},B=class n{static{n.prototype.isVector3=!0}constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ic.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ic.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),d=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+l*c+a*u-o*d,this.y=i+l*d+o*c-r*u,this.z=s+l*u+r*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(We(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return qa.copy(this).projectOnVector(e),this.sub(qa)}reflect(e){return this.sub(qa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(We(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},qa=new B,ic=new pn,Pe=class n{static{n.prototype.isMatrix3=!0}constructor(e,t,i,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){let d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=l,d[6]=i,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],d=i[4],u=i[7],h=i[2],p=i[5],m=i[8],x=s[0],g=s[3],f=s[6],S=s[1],A=s[4],b=s[7],C=s[2],w=s[5],I=s[8];return r[0]=a*x+o*S+l*C,r[3]=a*g+o*A+l*w,r[6]=a*f+o*b+l*I,r[1]=c*x+d*S+u*C,r[4]=c*g+d*A+u*w,r[7]=c*f+d*b+u*I,r[2]=h*x+p*S+m*C,r[5]=h*g+p*A+m*w,r[8]=h*f+p*b+m*I,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*a*d-t*o*c-i*r*d+i*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=d*a-o*c,h=o*l-d*r,p=c*r-a*l,m=t*u+i*h+s*p;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return e[0]=u*x,e[1]=(s*c-d*i)*x,e[2]=(o*i-s*a)*x,e[3]=h*x,e[4]=(d*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=p*x,e[7]=(i*l-c*t)*x,e[8]=(a*t-i*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply($a.makeScale(e,t)),this}rotate(e){return this.premultiply($a.makeRotation(-e)),this}translate(e,t){return this.premultiply($a.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},$a=new Pe,sc=new Pe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),rc=new Pe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ku(){let n={enabled:!0,workingColorSpace:ji,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Je&&(s.r=Rn(s.r),s.g=Rn(s.g),s.b=Rn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Je&&(s.r=Ti(s.r),s.g=Ti(s.g),s.b=Ti(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Dn?Ki:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return gr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return gr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[ji]:{primaries:e,whitePoint:i,transfer:Ki,toXYZ:sc,fromXYZ:rc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ct},outputColorSpaceConfig:{drawingBufferColorSpace:Ct}},[Ct]:{primaries:e,whitePoint:i,transfer:Je,toXYZ:sc,fromXYZ:rc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ct}}}),n}var He=ku();function Rn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ti(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var mi,xr=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{mi===void 0&&(mi=Qi("canvas")),mi.width=e.width,mi.height=e.height;let s=mi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=mi}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Qi("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Rn(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Rn(t[i]/255)*255):t[i]=Rn(t[i]);return{data:t,width:e.width,height:e.height}}else return Ce("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},zu=0,Ii=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:zu++}),this.uuid=Es(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Ya(s[a].image)):r.push(Ya(s[a]))}else r=Ya(s);i.url=r}return t||(e.images[this.uuid]=i),i}};function Ya(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?xr.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ce("Texture: Unable to serialize Texture."),{})}var Gu=0,Za=new B,Lt=class n extends fn{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=un,s=un,r=Mt,a=Kn,o=Jt,l=Ot,c=n.DEFAULT_ANISOTROPY,d=Dn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Gu++}),this.uuid=Es(),this.name="",this.source=new Ii(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new $e(0,0),this.repeat=new $e(1,1),this.center=new $e(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Pe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Za).x}get height(){return this.source.getSize(Za).y}get depth(){return this.source.getSize(Za).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){Ce(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ce(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Oo)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case fr:e.x=e.x-Math.floor(e.x);break;case un:e.x=e.x<0?0:1;break;case pr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case fr:e.y=e.y-Math.floor(e.y);break;case un:e.y=e.y<0?0:1;break;case pr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Lt.DEFAULT_IMAGE=null;Lt.DEFAULT_MAPPING=Oo;Lt.DEFAULT_ANISOTROPY=1;var lt=class n{static{n.prototype.isVector4=!0}constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r,l=e.elements,c=l[0],d=l[4],u=l[8],h=l[1],p=l[5],m=l[9],x=l[2],g=l[6],f=l[10];if(Math.abs(d-h)<.01&&Math.abs(u-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+x)<.1&&Math.abs(m+g)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let A=(c+1)/2,b=(p+1)/2,C=(f+1)/2,w=(d+h)/4,I=(u+x)/4,y=(m+g)/4;return A>b&&A>C?A<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(A),s=w/i,r=I/i):b>C?b<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),i=w/s,r=y/s):C<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),i=I/r,s=y/r),this.set(i,s,r,t),this}let S=Math.sqrt((g-m)*(g-m)+(u-x)*(u-x)+(h-d)*(h-d));return Math.abs(S)<.001&&(S=1),this.x=(g-m)/S,this.y=(u-x)/S,this.z=(h-d)/S,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this.w=We(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this.w=We(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(We(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},yr=class extends fn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new lt(0,0,e,t),this.scissorTest=!1,this.viewport=new lt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:i.depth},r=new Lt(s),a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){let t={minFilter:Mt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ii(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ht=class extends yr{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},es=class extends Lt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=bt,this.minFilter=bt,this.wrapR=un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var vr=class extends Lt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=bt,this.minFilter=bt,this.wrapR=un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var dt=class n{static{n.prototype.isMatrix4=!0}constructor(e,t,i,s,r,a,o,l,c,d,u,h,p,m,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,d,u,h,p,m,x,g)}set(e,t,i,s,r,a,o,l,c,d,u,h,p,m,x,g){let f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=d,f[10]=u,f[14]=h,f[3]=p,f[7]=m,f[11]=x,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();let t=this.elements,i=e.elements,s=1/gi.setFromMatrixColumn(e,0).length(),r=1/gi.setFromMatrixColumn(e,1).length(),a=1/gi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let h=a*d,p=a*u,m=o*d,x=o*u;t[0]=l*d,t[4]=-l*u,t[8]=c,t[1]=p+m*c,t[5]=h-x*c,t[9]=-o*l,t[2]=x-h*c,t[6]=m+p*c,t[10]=a*l}else if(e.order==="YXZ"){let h=l*d,p=l*u,m=c*d,x=c*u;t[0]=h+x*o,t[4]=m*o-p,t[8]=a*c,t[1]=a*u,t[5]=a*d,t[9]=-o,t[2]=p*o-m,t[6]=x+h*o,t[10]=a*l}else if(e.order==="ZXY"){let h=l*d,p=l*u,m=c*d,x=c*u;t[0]=h-x*o,t[4]=-a*u,t[8]=m+p*o,t[1]=p+m*o,t[5]=a*d,t[9]=x-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let h=a*d,p=a*u,m=o*d,x=o*u;t[0]=l*d,t[4]=m*c-p,t[8]=h*c+x,t[1]=l*u,t[5]=x*c+h,t[9]=p*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let h=a*l,p=a*c,m=o*l,x=o*c;t[0]=l*d,t[4]=x-h*u,t[8]=m*u+p,t[1]=u,t[5]=a*d,t[9]=-o*d,t[2]=-c*d,t[6]=p*u+m,t[10]=h-x*u}else if(e.order==="XZY"){let h=a*l,p=a*c,m=o*l,x=o*c;t[0]=l*d,t[4]=-u,t[8]=c*d,t[1]=h*u+x,t[5]=a*d,t[9]=p*u-m,t[2]=m*u-p,t[6]=o*d,t[10]=x*u+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Vu,e,Hu)}lookAt(e,t,i){let s=this.elements;return zt.subVectors(e,t),zt.lengthSq()===0&&(zt.z=1),zt.normalize(),On.crossVectors(i,zt),On.lengthSq()===0&&(Math.abs(i.z)===1?zt.x+=1e-4:zt.z+=1e-4,zt.normalize(),On.crossVectors(i,zt)),On.normalize(),Os.crossVectors(zt,On),s[0]=On.x,s[4]=Os.x,s[8]=zt.x,s[1]=On.y,s[5]=Os.y,s[9]=zt.y,s[2]=On.z,s[6]=Os.z,s[10]=zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],d=i[1],u=i[5],h=i[9],p=i[13],m=i[2],x=i[6],g=i[10],f=i[14],S=i[3],A=i[7],b=i[11],C=i[15],w=s[0],I=s[4],y=s[8],E=s[12],L=s[1],T=s[5],D=s[9],W=s[13],X=s[2],F=s[6],k=s[10],V=s[14],Q=s[3],ee=s[7],oe=s[11],xe=s[15];return r[0]=a*w+o*L+l*X+c*Q,r[4]=a*I+o*T+l*F+c*ee,r[8]=a*y+o*D+l*k+c*oe,r[12]=a*E+o*W+l*V+c*xe,r[1]=d*w+u*L+h*X+p*Q,r[5]=d*I+u*T+h*F+p*ee,r[9]=d*y+u*D+h*k+p*oe,r[13]=d*E+u*W+h*V+p*xe,r[2]=m*w+x*L+g*X+f*Q,r[6]=m*I+x*T+g*F+f*ee,r[10]=m*y+x*D+g*k+f*oe,r[14]=m*E+x*W+g*V+f*xe,r[3]=S*w+A*L+b*X+C*Q,r[7]=S*I+A*T+b*F+C*ee,r[11]=S*y+A*D+b*k+C*oe,r[15]=S*E+A*W+b*V+C*xe,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],u=e[6],h=e[10],p=e[14],m=e[3],x=e[7],g=e[11],f=e[15],S=l*p-c*h,A=o*p-c*u,b=o*h-l*u,C=a*p-c*d,w=a*h-l*d,I=a*u-o*d;return t*(x*S-g*A+f*b)-i*(m*S-g*C+f*w)+s*(m*A-x*C+f*I)-r*(m*b-x*w+g*I)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=e[9],h=e[10],p=e[11],m=e[12],x=e[13],g=e[14],f=e[15],S=t*o-i*a,A=t*l-s*a,b=t*c-r*a,C=i*l-s*o,w=i*c-r*o,I=s*c-r*l,y=d*x-u*m,E=d*g-h*m,L=d*f-p*m,T=u*g-h*x,D=u*f-p*x,W=h*f-p*g,X=S*W-A*D+b*T+C*L-w*E+I*y;if(X===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/X;return e[0]=(o*W-l*D+c*T)*F,e[1]=(s*D-i*W-r*T)*F,e[2]=(x*I-g*w+f*C)*F,e[3]=(h*w-u*I-p*C)*F,e[4]=(l*L-a*W-c*E)*F,e[5]=(t*W-s*L+r*E)*F,e[6]=(g*b-m*I-f*A)*F,e[7]=(d*I-h*b+p*A)*F,e[8]=(a*D-o*L+c*y)*F,e[9]=(i*L-t*D-r*y)*F,e[10]=(m*w-x*b+f*S)*F,e[11]=(u*b-d*w-p*S)*F,e[12]=(o*E-a*T-l*y)*F,e[13]=(t*T-i*E+s*y)*F,e[14]=(x*A-m*C-g*S)*F,e[15]=(d*C-u*A+h*S)*F,this}scale(e){let t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,d=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,d*o+i,d*l-s*a,0,c*l-s*o,d*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,d=a+a,u=o+o,h=r*c,p=r*d,m=r*u,x=a*d,g=a*u,f=o*u,S=l*c,A=l*d,b=l*u,C=i.x,w=i.y,I=i.z;return s[0]=(1-(x+f))*C,s[1]=(p+b)*C,s[2]=(m-A)*C,s[3]=0,s[4]=(p-b)*w,s[5]=(1-(h+f))*w,s[6]=(g+S)*w,s[7]=0,s[8]=(m+A)*I,s[9]=(g-S)*I,s[10]=(1-(h+x))*I,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinant();if(r===0)return i.set(1,1,1),t.identity(),this;let a=gi.set(s[0],s[1],s[2]).length(),o=gi.set(s[4],s[5],s[6]).length(),l=gi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),jt.copy(this);let c=1/a,d=1/o,u=1/l;return jt.elements[0]*=c,jt.elements[1]*=c,jt.elements[2]*=c,jt.elements[4]*=d,jt.elements[5]*=d,jt.elements[6]*=d,jt.elements[8]*=u,jt.elements[9]*=u,jt.elements[10]*=u,t.setFromRotationMatrix(jt),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,s,r,a,o=en,l=!1){let c=this.elements,d=2*r/(t-e),u=2*r/(i-s),h=(t+e)/(t-e),p=(i+s)/(i-s),m,x;if(l)m=r/(a-r),x=a*r/(a-r);else if(o===en)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===Ci)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=en,l=!1){let c=this.elements,d=2/(t-e),u=2/(i-s),h=-(t+e)/(t-e),p=-(i+s)/(i-s),m,x;if(l)m=1/(a-r),x=a/(a-r);else if(o===en)m=-2/(a-r),x=-(a+r)/(a-r);else if(o===Ci)m=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=u,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},gi=new B,jt=new dt,Vu=new B(0,0,0),Hu=new B(1,1,1),On=new B,Os=new B,zt=new B,ac=new dt,oc=new pn,Pn=class n{constructor(e=0,t=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],d=s[9],u=s[2],h=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-We(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(We(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-We(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(We(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-We(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,p),this._y=0);break;default:Ce("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return ac.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ac,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return oc.setFromEuler(this),this.setFromQuaternion(oc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Pn.DEFAULT_ORDER="XYZ";var ts=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Wu=0,lc=new B,_i=new pn,Mn=new dt,Bs=new B,qi=new B,Xu=new B,qu=new pn,cc=new B(1,0,0),hc=new B(0,1,0),uc=new B(0,0,1),dc={type:"added"},$u={type:"removed"},xi={type:"childadded",child:null},Ja={type:"childremoved",child:null},Rt=class n extends fn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Wu++}),this.uuid=Es(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new B,t=new Pn,i=new pn,s=new B(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new dt},normalMatrix:{value:new Pe}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ts,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return _i.setFromAxisAngle(e,t),this.quaternion.multiply(_i),this}rotateOnWorldAxis(e,t){return _i.setFromAxisAngle(e,t),this.quaternion.premultiply(_i),this}rotateX(e){return this.rotateOnAxis(cc,e)}rotateY(e){return this.rotateOnAxis(hc,e)}rotateZ(e){return this.rotateOnAxis(uc,e)}translateOnAxis(e,t){return lc.copy(e).applyQuaternion(this.quaternion),this.position.add(lc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(cc,e)}translateY(e){return this.translateOnAxis(hc,e)}translateZ(e){return this.translateOnAxis(uc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Mn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Bs.copy(e):Bs.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),qi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Mn.lookAt(qi,Bs,this.up):Mn.lookAt(Bs,qi,this.up),this.quaternion.setFromRotationMatrix(Mn),s&&(Mn.extractRotation(s.matrixWorld),_i.setFromRotationMatrix(Mn),this.quaternion.premultiply(_i.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Re("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(dc),xi.child=e,this.dispatchEvent(xi),xi.child=null):Re("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent($u),Ja.child=e,this.dispatchEvent(Ja),Ja.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Mn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Mn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Mn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(dc),xi.child=e,this.dispatchEvent(xi),xi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,e,Xu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,qu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),u=a(e.shapes),h=a(e.skeletons),p=a(e.animations),m=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),p.length>0&&(i.animations=p),m.length>0&&(i.nodes=m)}return i.object=s,i;function a(o){let l=[];for(let c in o){let d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};Rt.DEFAULT_UP=new B(0,1,0);Rt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Cn=class extends Rt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Yu={type:"move"},Pi=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Cn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Cn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Cn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,i),f=this._getHandJoint(c,x);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}let d=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=d.position.distanceTo(u.position),p=.02,m=.005;c.inputState.pinching&&h>p+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=p-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Yu)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Cn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},sh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bn={h:0,s:0,l:0},ks={h:0,s:0,l:0};function ja(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var Ge=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ct){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,He.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=He.workingColorSpace){return this.r=e,this.g=t,this.b=i,He.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=He.workingColorSpace){if(e=Bu(e,1),t=We(t,0,1),i=We(i,0,1),t===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=ja(a,r,e+1/3),this.g=ja(a,r,e),this.b=ja(a,r,e-1/3)}return He.colorSpaceToWorking(this,s),this}setStyle(e,t=Ct){function i(r){r!==void 0&&parseFloat(r)<1&&Ce("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ce("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ce("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ct){let i=sh[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ce("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Rn(e.r),this.g=Rn(e.g),this.b=Rn(e.b),this}copyLinearToSRGB(e){return this.r=Ti(e.r),this.g=Ti(e.g),this.b=Ti(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ct){return He.workingToColorSpace(Tt.copy(this),e),Math.round(We(Tt.r*255,0,255))*65536+Math.round(We(Tt.g*255,0,255))*256+Math.round(We(Tt.b*255,0,255))}getHexString(e=Ct){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=He.workingColorSpace){He.workingToColorSpace(Tt.copy(this),t);let i=Tt.r,s=Tt.g,r=Tt.b,a=Math.max(i,s,r),o=Math.min(i,s,r),l,c,d=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=d<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=He.workingColorSpace){return He.workingToColorSpace(Tt.copy(this),t),e.r=Tt.r,e.g=Tt.g,e.b=Tt.b,e}getStyle(e=Ct){He.workingToColorSpace(Tt.copy(this),e);let t=Tt.r,i=Tt.g,s=Tt.b;return e!==Ct?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Bn),this.setHSL(Bn.h+e,Bn.s+t,Bn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Bn),e.getHSL(ks);let i=Xa(Bn.h,ks.h,t),s=Xa(Bn.s,ks.s,t),r=Xa(Bn.l,ks.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Tt=new Ge;Ge.NAMES=sh;var ns=class extends Rt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Pn,this.environmentIntensity=1,this.environmentRotation=new Pn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Kt=new B,An=new B,Ka=new B,wn=new B,yi=new B,vi=new B,fc=new B,Qa=new B,eo=new B,to=new B,no=new lt,io=new lt,so=new lt,Hn=class n{constructor(e=new B,t=new B,i=new B){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Kt.subVectors(e,t),s.cross(Kt);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Kt.subVectors(s,t),An.subVectors(i,t),Ka.subVectors(e,t);let a=Kt.dot(Kt),o=Kt.dot(An),l=Kt.dot(Ka),c=An.dot(An),d=An.dot(Ka),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;let h=1/u,p=(c*l-o*d)*h,m=(a*d-o*l)*h;return r.set(1-p-m,m,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,wn)===null?!1:wn.x>=0&&wn.y>=0&&wn.x+wn.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,wn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,wn.x),l.addScaledVector(a,wn.y),l.addScaledVector(o,wn.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return no.setScalar(0),io.setScalar(0),so.setScalar(0),no.fromBufferAttribute(e,t),io.fromBufferAttribute(e,i),so.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(no,r.x),a.addScaledVector(io,r.y),a.addScaledVector(so,r.z),a}static isFrontFacing(e,t,i,s){return Kt.subVectors(i,t),An.subVectors(e,t),Kt.cross(An).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Kt.subVectors(this.c,this.b),An.subVectors(this.a,this.b),Kt.cross(An).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,r=this.c,a,o;yi.subVectors(s,i),vi.subVectors(r,i),Qa.subVectors(e,i);let l=yi.dot(Qa),c=vi.dot(Qa);if(l<=0&&c<=0)return t.copy(i);eo.subVectors(e,s);let d=yi.dot(eo),u=vi.dot(eo);if(d>=0&&u<=d)return t.copy(s);let h=l*u-d*c;if(h<=0&&l>=0&&d<=0)return a=l/(l-d),t.copy(i).addScaledVector(yi,a);to.subVectors(e,r);let p=yi.dot(to),m=vi.dot(to);if(m>=0&&p<=m)return t.copy(r);let x=p*c-l*m;if(x<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(i).addScaledVector(vi,o);let g=d*m-p*u;if(g<=0&&u-d>=0&&p-m>=0)return fc.subVectors(r,s),o=(u-d)/(u-d+(p-m)),t.copy(s).addScaledVector(fc,o);let f=1/(g+x+h);return a=x*f,o=h*f,t.copy(i).addScaledVector(yi,a).addScaledVector(vi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},mn=class{constructor(e=new B(1/0,1/0,1/0),t=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Qt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Qt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Qt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Qt):Qt.fromBufferAttribute(r,a),Qt.applyMatrix4(e.matrixWorld),this.expandByPoint(Qt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),zs.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),zs.copy(i.boundingBox)),zs.applyMatrix4(e.matrixWorld),this.union(zs)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Qt),Qt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter($i),Gs.subVectors(this.max,$i),bi.subVectors(e.a,$i),Si.subVectors(e.b,$i),Mi.subVectors(e.c,$i),kn.subVectors(Si,bi),zn.subVectors(Mi,Si),ii.subVectors(bi,Mi);let t=[0,-kn.z,kn.y,0,-zn.z,zn.y,0,-ii.z,ii.y,kn.z,0,-kn.x,zn.z,0,-zn.x,ii.z,0,-ii.x,-kn.y,kn.x,0,-zn.y,zn.x,0,-ii.y,ii.x,0];return!ro(t,bi,Si,Mi,Gs)||(t=[1,0,0,0,1,0,0,0,1],!ro(t,bi,Si,Mi,Gs))?!1:(Vs.crossVectors(kn,zn),t=[Vs.x,Vs.y,Vs.z],ro(t,bi,Si,Mi,Gs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Qt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Qt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(En[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),En[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),En[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),En[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),En[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),En[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),En[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),En[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(En),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},En=[new B,new B,new B,new B,new B,new B,new B,new B],Qt=new B,zs=new mn,bi=new B,Si=new B,Mi=new B,kn=new B,zn=new B,ii=new B,$i=new B,Gs=new B,Vs=new B,si=new B;function ro(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){si.fromArray(n,r);let o=s.x*Math.abs(si.x)+s.y*Math.abs(si.y)+s.z*Math.abs(si.z),l=e.dot(si),c=t.dot(si),d=i.dot(si);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}var gt=new B,Hs=new $e,Zu=0,Vt=class extends fn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Zu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=vo,this.updateRanges=[],this.gpuType=sn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Hs.fromBufferAttribute(this,t),Hs.applyMatrix3(e),this.setXY(t,Hs.x,Hs.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix3(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix4(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyNormalMatrix(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.transformDirection(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Xi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ut(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Xi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Xi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Xi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Xi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),i=Ut(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),i=Ut(i,this.array),s=Ut(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),i=Ut(i,this.array),s=Ut(s,this.array),r=Ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==vo&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}};var is=class extends Vt{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var ss=class extends Vt{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var vt=class extends Vt{constructor(e,t,i){super(new Float32Array(e),t,i)}},Ju=new mn,Yi=new B,ao=new B,Li=class{constructor(e=new B,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):Ju.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Yi.subVectors(e,this.center);let t=Yi.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Yi,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ao.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Yi.copy(e.center).add(ao)),this.expandByPoint(Yi.copy(e.center).sub(ao))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ju=0,Yt=new dt,oo=new Rt,Ai=new B,Gt=new mn,Zi=new mn,yt=new B,Zt=class n extends fn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=Es(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Fu(e)?ss:is)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Pe().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Yt.makeRotationFromQuaternion(e),this.applyMatrix4(Yt),this}rotateX(e){return Yt.makeRotationX(e),this.applyMatrix4(Yt),this}rotateY(e){return Yt.makeRotationY(e),this.applyMatrix4(Yt),this}rotateZ(e){return Yt.makeRotationZ(e),this.applyMatrix4(Yt),this}translate(e,t,i){return Yt.makeTranslation(e,t,i),this.applyMatrix4(Yt),this}scale(e,t,i){return Yt.makeScale(e,t,i),this.applyMatrix4(Yt),this}lookAt(e){return oo.lookAt(e),oo.updateMatrix(),this.applyMatrix4(oo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ai).negate(),this.translate(Ai.x,Ai.y,Ai.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new vt(i,3))}else{let i=Math.min(e.length,t.count);for(let s=0;s<i;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ce("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new mn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Re("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let r=t[i];Gt.setFromBufferAttribute(r),this.morphTargetsRelative?(yt.addVectors(this.boundingBox.min,Gt.min),this.boundingBox.expandByPoint(yt),yt.addVectors(this.boundingBox.max,Gt.max),this.boundingBox.expandByPoint(yt)):(this.boundingBox.expandByPoint(Gt.min),this.boundingBox.expandByPoint(Gt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Re('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Li);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Re("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(e){let i=this.boundingSphere.center;if(Gt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Zi.setFromBufferAttribute(o),this.morphTargetsRelative?(yt.addVectors(Gt.min,Zi.min),Gt.expandByPoint(yt),yt.addVectors(Gt.max,Zi.max),Gt.expandByPoint(yt)):(Gt.expandByPoint(Zi.min),Gt.expandByPoint(Zi.max))}Gt.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)yt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(yt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)yt.fromBufferAttribute(o,c),l&&(Ai.fromBufferAttribute(e,c),yt.add(Ai)),s=Math.max(s,i.distanceToSquared(yt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Re('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Re("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Vt(new Float32Array(4*i.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let y=0;y<i.count;y++)o[y]=new B,l[y]=new B;let c=new B,d=new B,u=new B,h=new $e,p=new $e,m=new $e,x=new B,g=new B;function f(y,E,L){c.fromBufferAttribute(i,y),d.fromBufferAttribute(i,E),u.fromBufferAttribute(i,L),h.fromBufferAttribute(r,y),p.fromBufferAttribute(r,E),m.fromBufferAttribute(r,L),d.sub(c),u.sub(c),p.sub(h),m.sub(h);let T=1/(p.x*m.y-m.x*p.y);isFinite(T)&&(x.copy(d).multiplyScalar(m.y).addScaledVector(u,-p.y).multiplyScalar(T),g.copy(u).multiplyScalar(p.x).addScaledVector(d,-m.x).multiplyScalar(T),o[y].add(x),o[E].add(x),o[L].add(x),l[y].add(g),l[E].add(g),l[L].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let y=0,E=S.length;y<E;++y){let L=S[y],T=L.start,D=L.count;for(let W=T,X=T+D;W<X;W+=3)f(e.getX(W+0),e.getX(W+1),e.getX(W+2))}let A=new B,b=new B,C=new B,w=new B;function I(y){C.fromBufferAttribute(s,y),w.copy(C);let E=o[y];A.copy(E),A.sub(C.multiplyScalar(C.dot(E))).normalize(),b.crossVectors(w,E);let T=b.dot(l[y])<0?-1:1;a.setXYZW(y,A.x,A.y,A.z,T)}for(let y=0,E=S.length;y<E;++y){let L=S[y],T=L.start,D=L.count;for(let W=T,X=T+D;W<X;W+=3)I(e.getX(W+0)),I(e.getX(W+1)),I(e.getX(W+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Vt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,p=i.count;h<p;h++)i.setXYZ(h,0,0,0);let s=new B,r=new B,a=new B,o=new B,l=new B,c=new B,d=new B,u=new B;if(e)for(let h=0,p=e.count;h<p;h+=3){let m=e.getX(h+0),x=e.getX(h+1),g=e.getX(h+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,g),o.add(d),l.add(d),c.add(d),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let h=0,p=t.count;h<p;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)yt.fromBufferAttribute(e,t),yt.normalize(),e.setXYZ(t,yt.x,yt.y,yt.z)}toNonIndexed(){function e(o,l){let c=o.array,d=o.itemSize,u=o.normalized,h=new c.constructor(l.length*d),p=0,m=0;for(let x=0,g=l.length;x<g;x++){o.isInterleavedBufferAttribute?p=l[x]*o.data.stride+o.offset:p=l[x]*d;for(let f=0;f<d;f++)h[m++]=c[p++]}return new Vt(h,d,u)}if(this.index===null)return Ce("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,i);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let d=0,u=c.length;d<u;d++){let h=c[d],p=e(h,i);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],d=[];for(let u=0,h=c.length;u<h;u++){let p=c[u];d.push(p.toJSON(e.data))}d.length>0&&(s[l]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let s=e.attributes;for(let c in s){let d=s[c];this.setAttribute(c,d.clone(t))}let r=e.morphAttributes;for(let c in r){let d=[],u=r[c];for(let h=0,p=u.length;h<p;h++)d.push(u[h].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,d=a.length;c<d;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Ku=0,Xn=class extends fn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ku++}),this.uuid=Es(),this.name="",this.type="Material",this.blending=li,this.side=In,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=sr,this.blendDst=rr,this.blendEquation=Wn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ge(0,0,0),this.blendAlpha=0,this.depthFunc=ci,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=yo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=oi,this.stencilZFail=oi,this.stencilZPass=oi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){Ce(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ce(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==li&&(i.blending=this.blending),this.side!==In&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==sr&&(i.blendSrc=this.blendSrc),this.blendDst!==rr&&(i.blendDst=this.blendDst),this.blendEquation!==Wn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ci&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==yo&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==oi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==oi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==oi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Tn=new B,lo=new B,Ws=new B,Gn=new B,co=new B,Xs=new B,ho=new B,br=class{constructor(e=new B,t=new B(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Tn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Tn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Tn.copy(this.origin).addScaledVector(this.direction,t),Tn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){lo.copy(e).add(t).multiplyScalar(.5),Ws.copy(t).sub(e).normalize(),Gn.copy(this.origin).sub(lo);let r=e.distanceTo(t)*.5,a=-this.direction.dot(Ws),o=Gn.dot(this.direction),l=-Gn.dot(Ws),c=Gn.lengthSq(),d=Math.abs(1-a*a),u,h,p,m;if(d>0)if(u=a*l-o,h=a*o-l,m=r*d,u>=0)if(h>=-m)if(h<=m){let x=1/d;u*=x,h*=x,p=u*(u+a*h+2*o)+h*(a*u+h+2*l)+c}else h=r,u=Math.max(0,-(a*h+o)),p=-u*u+h*(h+2*l)+c;else h=-r,u=Math.max(0,-(a*h+o)),p=-u*u+h*(h+2*l)+c;else h<=-m?(u=Math.max(0,-(-a*r+o)),h=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+h*(h+2*l)+c):h<=m?(u=0,h=Math.min(Math.max(-r,-l),r),p=h*(h+2*l)+c):(u=Math.max(0,-(a*r+o)),h=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+h*(h+2*l)+c);else h=a>0?-r:r,u=Math.max(0,-(a*h+o)),p=-u*u+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(lo).addScaledVector(Ws,h),p}intersectSphere(e,t){Tn.subVectors(e.center,this.origin);let i=Tn.dot(this.direction),s=Tn.dot(Tn)-i*i,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l,c=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),d>=0?(r=(e.min.y-h.y)*d,a=(e.max.y-h.y)*d):(r=(e.max.y-h.y)*d,a=(e.min.y-h.y)*d),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-h.z)*u,l=(e.max.z-h.z)*u):(o=(e.max.z-h.z)*u,l=(e.min.z-h.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Tn)!==null}intersectTriangle(e,t,i,s,r){co.subVectors(t,e),Xs.subVectors(i,e),ho.crossVectors(co,Xs);let a=this.direction.dot(ho),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Gn.subVectors(this.origin,e);let l=o*this.direction.dot(Xs.crossVectors(Gn,Xs));if(l<0)return null;let c=o*this.direction.dot(co.cross(Gn));if(c<0||l+c>a)return null;let d=-o*Gn.dot(ho);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},rs=class extends Xn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ge(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pn,this.combine=Ro,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},pc=new dt,ri=new br,qs=new Li,mc=new B,$s=new B,Ys=new B,Zs=new B,uo=new B,Js=new B,gc=new B,js=new B,It=class extends Rt{constructor(e=new Zt,t=new rs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){Js.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let d=o[l],u=r[l];d!==0&&(uo.fromBufferAttribute(u,e),a?Js.addScaledVector(uo,d):Js.addScaledVector(uo.sub(t),d))}t.add(Js)}return t}raycast(e,t){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),qs.copy(i.boundingSphere),qs.applyMatrix4(r),ri.copy(e.ray).recast(e.near),!(qs.containsPoint(ri.origin)===!1&&(ri.intersectSphere(qs,mc)===null||ri.origin.distanceToSquared(mc)>(e.far-e.near)**2))&&(pc.copy(r).invert(),ri.copy(e.ray).applyMatrix4(pc),!(i.boundingBox!==null&&ri.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ri)))}_computeIntersections(e,t,i){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,h=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=h.length;m<x;m++){let g=h[m],f=a[g.materialIndex],S=Math.max(g.start,p.start),A=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let b=S,C=A;b<C;b+=3){let w=o.getX(b),I=o.getX(b+1),y=o.getX(b+2);s=Ks(this,f,e,i,c,d,u,w,I,y),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,p.start),x=Math.min(o.count,p.start+p.count);for(let g=m,f=x;g<f;g+=3){let S=o.getX(g),A=o.getX(g+1),b=o.getX(g+2);s=Ks(this,a,e,i,c,d,u,S,A,b),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,x=h.length;m<x;m++){let g=h[m],f=a[g.materialIndex],S=Math.max(g.start,p.start),A=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));for(let b=S,C=A;b<C;b+=3){let w=b,I=b+1,y=b+2;s=Ks(this,f,e,i,c,d,u,w,I,y),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let g=m,f=x;g<f;g+=3){let S=g,A=g+1,b=g+2;s=Ks(this,a,e,i,c,d,u,S,A,b),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function Qu(n,e,t,i,s,r,a,o){let l;if(e.side===Dt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===In,o),l===null)return null;js.copy(o),js.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(js);return c<t.near||c>t.far?null:{distance:c,point:js.clone(),object:n}}function Ks(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,$s),n.getVertexPosition(l,Ys),n.getVertexPosition(c,Zs);let d=Qu(n,e,t,i,$s,Ys,Zs,gc);if(d){let u=new B;Hn.getBarycoord(gc,$s,Ys,Zs,u),s&&(d.uv=Hn.getInterpolatedAttribute(s,o,l,c,u,new $e)),r&&(d.uv1=Hn.getInterpolatedAttribute(r,o,l,c,u,new $e)),a&&(d.normal=Hn.getInterpolatedAttribute(a,o,l,c,u,new B),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));let h={a:o,b:l,c,normal:new B,materialIndex:0};Hn.getNormal($s,Ys,Zs,h.normal),d.face=h,d.barycoord=u}return d}var Sr=class extends Lt{constructor(e=null,t=1,i=1,s,r,a,o,l,c=bt,d=bt,u,h){super(null,a,o,l,c,d,s,r,u,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var fo=new B,ed=new B,td=new Pe,hn=class{constructor(e=new B(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=fo.subVectors(i,t).cross(ed.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){let s=e.delta(fo),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||td.getNormalMatrix(e),s=this.coplanarPoint(fo).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},ai=new Li,nd=new $e(.5,.5),Qs=new B,Di=class{constructor(e=new hn,t=new hn,i=new hn,s=new hn,r=new hn,a=new hn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=en,i=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],d=r[4],u=r[5],h=r[6],p=r[7],m=r[8],x=r[9],g=r[10],f=r[11],S=r[12],A=r[13],b=r[14],C=r[15];if(s[0].setComponents(c-a,p-d,f-m,C-S).normalize(),s[1].setComponents(c+a,p+d,f+m,C+S).normalize(),s[2].setComponents(c+o,p+u,f+x,C+A).normalize(),s[3].setComponents(c-o,p-u,f-x,C-A).normalize(),i)s[4].setComponents(l,h,g,b).normalize(),s[5].setComponents(c-l,p-h,f-g,C-b).normalize();else if(s[4].setComponents(c-l,p-h,f-g,C-b).normalize(),t===en)s[5].setComponents(c+l,p+h,f+g,C+b).normalize();else if(t===Ci)s[5].setComponents(l,h,g,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ai.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ai.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ai)}intersectsSprite(e){ai.center.set(0,0,0);let t=nd.distanceTo(e.center);return ai.radius=.7071067811865476+t,ai.applyMatrix4(e.matrixWorld),this.intersectsSphere(ai)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(Qs.x=s.normal.x>0?e.max.x:e.min.x,Qs.y=s.normal.y>0?e.max.y:e.min.y,Qs.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Qs)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var as=class extends Lt{constructor(e=[],t=jn,i,s,r,a,o,l,c,d){super(e,t,i,s,r,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},os=class extends Lt{constructor(e,t,i,s,r,a,o,l,c){super(e,t,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ln=class extends Lt{constructor(e,t,i=nn,s,r,a,o=bt,l=bt,c,d=dn,u=1){if(d!==dn&&d!==Qn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:u};super(h,s,r,a,o,l,d,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ii(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Mr=class extends Ln{constructor(e,t=nn,i=jn,s,r,a=bt,o=bt,l,c=dn){let d={width:e,height:e,depth:1},u=[d,d,d,d,d,d];super(e,e,t,i,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ls=class extends Lt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},qn=class n extends Zt{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],d=[],u=[],h=0,p=0;m("z","y","x",-1,-1,i,t,e,a,r,0),m("z","y","x",1,-1,i,t,-e,a,r,1),m("x","z","y",1,1,e,i,t,s,a,2),m("x","z","y",1,-1,e,i,-t,s,a,3),m("x","y","z",1,-1,e,t,i,s,r,4),m("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new vt(c,3)),this.setAttribute("normal",new vt(d,3)),this.setAttribute("uv",new vt(u,2));function m(x,g,f,S,A,b,C,w,I,y,E){let L=b/I,T=C/y,D=b/2,W=C/2,X=w/2,F=I+1,k=y+1,V=0,Q=0,ee=new B;for(let oe=0;oe<k;oe++){let xe=oe*T-W;for(let ye=0;ye<F;ye++){let Ve=ye*L-D;ee[x]=Ve*S,ee[g]=xe*A,ee[f]=X,c.push(ee.x,ee.y,ee.z),ee[x]=0,ee[g]=0,ee[f]=w>0?1:-1,d.push(ee.x,ee.y,ee.z),u.push(ye/I),u.push(1-oe/y),V+=1}}for(let oe=0;oe<y;oe++)for(let xe=0;xe<I;xe++){let ye=h+xe+F*oe,Ve=h+xe+F*(oe+1),Xe=h+(xe+1)+F*(oe+1),Te=h+(xe+1)+F*oe;l.push(ye,Ve,Te),l.push(Ve,Xe,Te),Q+=6}o.addGroup(p,Q,E),p+=Q,h+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var cs=class n extends Zt{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let d=[],u=[],h=[],p=[],m=0,x=[],g=i/2,f=0;S(),a===!1&&(e>0&&A(!0),t>0&&A(!1)),this.setIndex(d),this.setAttribute("position",new vt(u,3)),this.setAttribute("normal",new vt(h,3)),this.setAttribute("uv",new vt(p,2));function S(){let b=new B,C=new B,w=0,I=(t-e)/i;for(let y=0;y<=r;y++){let E=[],L=y/r,T=L*(t-e)+e;for(let D=0;D<=s;D++){let W=D/s,X=W*l+o,F=Math.sin(X),k=Math.cos(X);C.x=T*F,C.y=-L*i+g,C.z=T*k,u.push(C.x,C.y,C.z),b.set(F,I,k).normalize(),h.push(b.x,b.y,b.z),p.push(W,1-L),E.push(m++)}x.push(E)}for(let y=0;y<s;y++)for(let E=0;E<r;E++){let L=x[E][y],T=x[E+1][y],D=x[E+1][y+1],W=x[E][y+1];(e>0||E!==0)&&(d.push(L,T,W),w+=3),(t>0||E!==r-1)&&(d.push(T,D,W),w+=3)}c.addGroup(f,w,0),f+=w}function A(b){let C=m,w=new $e,I=new B,y=0,E=b===!0?e:t,L=b===!0?1:-1;for(let D=1;D<=s;D++)u.push(0,g*L,0),h.push(0,L,0),p.push(.5,.5),m++;let T=m;for(let D=0;D<=s;D++){let X=D/s*l+o,F=Math.cos(X),k=Math.sin(X);I.x=E*k,I.y=g*L,I.z=E*F,u.push(I.x,I.y,I.z),h.push(0,L,0),w.x=F*.5+.5,w.y=k*.5*L+.5,p.push(w.x,w.y),m++}for(let D=0;D<s;D++){let W=C+D,X=T+D;b===!0?d.push(X,X+1,W):d.push(X+1,X,W),y+=3}c.addGroup(f,y,b===!0?1:2),f+=y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var hs=class n extends Zt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,d=l+1,u=e/o,h=t/l,p=[],m=[],x=[],g=[];for(let f=0;f<d;f++){let S=f*h-a;for(let A=0;A<c;A++){let b=A*u-r;m.push(b,-S,0),x.push(0,0,1),g.push(A/o),g.push(1-f/l)}}for(let f=0;f<l;f++)for(let S=0;S<o;S++){let A=S+c*f,b=S+c*(f+1),C=S+1+c*(f+1),w=S+1+c*f;p.push(A,b,w),p.push(b,C,w)}this.setIndex(p),this.setAttribute("position",new vt(m,3)),this.setAttribute("normal",new vt(x,3)),this.setAttribute("uv",new vt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}};var us=class n extends Zt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let l=Math.min(a+o,Math.PI),c=0,d=[],u=new B,h=new B,p=[],m=[],x=[],g=[];for(let f=0;f<=i;f++){let S=[],A=f/i,b=0;f===0&&a===0?b=.5/t:f===i&&l===Math.PI&&(b=-.5/t);for(let C=0;C<=t;C++){let w=C/t;u.x=-e*Math.cos(s+w*r)*Math.sin(a+A*o),u.y=e*Math.cos(a+A*o),u.z=e*Math.sin(s+w*r)*Math.sin(a+A*o),m.push(u.x,u.y,u.z),h.copy(u).normalize(),x.push(h.x,h.y,h.z),g.push(w+b,1-A),S.push(c++)}d.push(S)}for(let f=0;f<i;f++)for(let S=0;S<t;S++){let A=d[f][S+1],b=d[f][S],C=d[f+1][S],w=d[f+1][S+1];(f!==0||a>0)&&p.push(A,b,w),(f!==i-1||l<Math.PI)&&p.push(b,C,w)}this.setIndex(p),this.setAttribute("position",new vt(m,3)),this.setAttribute("normal",new vt(x,3)),this.setAttribute("uv",new vt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};function ui(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let s=n[t][i];if(_c(s))s.isRenderTargetTexture?(Ce("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(_c(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Pt(n){let e={};for(let t=0;t<n.length;t++){let i=ui(n[t]);for(let s in i)e[s]=i[s]}return e}function _c(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function id(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function $o(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:He.workingColorSpace}var rh={clone:ui,merge:Pt},sd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,rd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Wt=class extends Xn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sd,this.fragmentShader=rd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ui(e.uniforms),this.uniformsGroups=id(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},Ar=class extends Wt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},ds=class extends Xn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ge(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ge(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=wa,this.normalScale=new $e(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var wr=class extends Xn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=qc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Er=class extends Xn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function er(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}var $n=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=t[++i],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(i=2,r=o);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=t[--i-1],e>=r)break e}a=i,i=0;break t}break n}for(;i<a;){let o=i+a>>>1;e<t[o]?a=o:i=o+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=i[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Tr=class extends $n{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:go,endingEnd:go}}intervalChanged_(e,t,i){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case _o:r=e,o=2*t-i;break;case xo:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case _o:a=e,l=2*i-t;break;case xo:a=1,l=i+s[1]-s[0];break;default:a=e-1,l=t}let c=(i-t)*.5,d=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=r*d,this._offsetNext=a*d}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,d=this._offsetPrev,u=this._offsetNext,h=this._weightPrev,p=this._weightNext,m=(i-t)/(s-t),x=m*m,g=x*m,f=-h*g+2*h*x-h*m,S=(1+h)*g+(-1.5-2*h)*x+(-.5+h)*m+1,A=(-1-p)*g+(1.5+p)*x+.5*m,b=p*g-p*x;for(let C=0;C!==o;++C)r[C]=f*a[d+C]+S*a[c+C]+A*a[l+C]+b*a[u+C];return r}},Cr=class extends $n{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,d=(i-t)/(s-t),u=1-d;for(let h=0;h!==o;++h)r[h]=a[c+h]*u+a[l+h]*d;return r}},Rr=class extends $n{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Ir=class extends $n{interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,d=this.settings||this.DefaultSettings_,u=d.inTangents,h=d.outTangents;if(!u||!h){let x=(i-t)/(s-t),g=1-x;for(let f=0;f!==o;++f)r[f]=a[c+f]*g+a[l+f]*x;return r}let p=o*2,m=e-1;for(let x=0;x!==o;++x){let g=a[c+x],f=a[l+x],S=m*p+x*2,A=h[S],b=h[S+1],C=e*p+x*2,w=u[C],I=u[C+1],y=(i-t)/(s-t),E,L,T,D,W;for(let X=0;X<8;X++){E=y*y,L=E*y,T=1-y,D=T*T,W=D*T;let k=W*t+3*D*y*A+3*T*E*w+L*s-i;if(Math.abs(k)<1e-10)break;let V=3*D*(A-t)+6*T*y*(w-A)+3*E*(s-w);if(Math.abs(V)<1e-10)break;y=y-k/V,y=Math.max(0,Math.min(1,y))}r[x]=W*g+3*D*y*b+3*T*E*I+L*f}return r}},Xt=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=er(t,this.TimeBufferType),this.values=er(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:er(e.times,Array),values:er(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Rr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Cr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Tr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Ir(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.settings=this.settings),t}setInterpolation(e){let t;switch(e){case Ji:t=this.InterpolantFactoryMethodDiscrete;break;case mr:t=this.InterpolantFactoryMethodLinear;break;case ir:t=this.InterpolantFactoryMethodSmooth;break;case mo:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Ce("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ji;case this.InterpolantFactoryMethodLinear:return mr;case this.InterpolantFactoryMethodSmooth:return ir;case this.InterpolantFactoryMethodBezier:return mo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,r=0,a=s-1;for(;r!==s&&i[r]<e;)++r;for(;a!==-1&&i[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Re("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,r=i.length;r===0&&(Re("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){Re("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Re("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&Ou(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Re("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===ir,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],d=e[o+1];if(c!==d&&(o!==1||c!==e[0]))if(s)l=!0;else{let u=o*i,h=u-i,p=u+i;for(let m=0;m!==i;++m){let x=t[u+m];if(x!==t[h+m]||x!==t[p+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let u=o*i,h=a*i;for(let p=0;p!==i;++p)t[h+p]=t[u+p]}++a}}if(r>0){e[a]=e[r];for(let o=r*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Xt.prototype.ValueTypeName="";Xt.prototype.TimeBufferType=Float32Array;Xt.prototype.ValueBufferType=Float32Array;Xt.prototype.DefaultInterpolation=mr;var Yn=class extends Xt{constructor(e,t,i){super(e,t,i)}};Yn.prototype.ValueTypeName="bool";Yn.prototype.ValueBufferType=Array;Yn.prototype.DefaultInterpolation=Ji;Yn.prototype.InterpolantFactoryMethodLinear=void 0;Yn.prototype.InterpolantFactoryMethodSmooth=void 0;var Pr=class extends Xt{constructor(e,t,i,s){super(e,t,i,s)}};Pr.prototype.ValueTypeName="color";var Lr=class extends Xt{constructor(e,t,i,s){super(e,t,i,s)}};Lr.prototype.ValueTypeName="number";var Dr=class extends $n{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(s-t),c=e*o;for(let d=c+o;c!==d;c+=4)pn.slerpFlat(r,0,a,c-o,a,c,l);return r}},fs=class extends Xt{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new Dr(this.times,this.values,this.getValueSize(),e)}};fs.prototype.ValueTypeName="quaternion";fs.prototype.InterpolantFactoryMethodSmooth=void 0;var Zn=class extends Xt{constructor(e,t,i){super(e,t,i)}};Zn.prototype.ValueTypeName="string";Zn.prototype.ValueBufferType=Array;Zn.prototype.DefaultInterpolation=Ji;Zn.prototype.InterpolantFactoryMethodLinear=void 0;Zn.prototype.InterpolantFactoryMethodSmooth=void 0;var Nr=class extends Xt{constructor(e,t,i,s){super(e,t,i,s)}};Nr.prototype.ValueTypeName="vector";var Ur=class{constructor(e,t,i){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(d){o++,r===!1&&s.onStart!==void 0&&s.onStart(d,a,o),r=!0},this.itemEnd=function(d){a++,s.onProgress!==void 0&&s.onProgress(d,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(d){s.onError!==void 0&&s.onError(d)},this.resolveURL=function(d){return l?l(d):d},this.setURLModifier=function(d){return l=d,this},this.addHandler=function(d,u){return c.push(d,u),this},this.removeHandler=function(d){let u=c.indexOf(d);return u!==-1&&c.splice(u,2),this},this.getHandler=function(d){for(let u=0,h=c.length;u<h;u+=2){let p=c[u],m=c[u+1];if(p.global&&(p.lastIndex=0),p.test(d))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},ah=new Ur,Fr=class{constructor(e){this.manager=e!==void 0?e:ah,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Fr.DEFAULT_MATERIAL_NAME="__DEFAULT";var ps=class extends Rt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ge(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},ms=class extends ps{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ge(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},po=new dt,xc=new B,yc=new B,bo=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new $e(512,512),this.mapType=Ot,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Di,this._frameExtents=new $e(1,1),this._viewportCount=1,this._viewports=[new lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;xc.setFromMatrixPosition(e.matrixWorld),t.position.copy(xc),yc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(yc),t.updateMatrixWorld(),po.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(po,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Ci||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(po)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},tr=new B,nr=new pn,cn=new B,gs=class extends Rt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=en,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(tr,nr,cn),cn.x===1&&cn.y===1&&cn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(tr,nr,cn.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(tr,nr,cn),cn.x===1&&cn.y===1&&cn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(tr,nr,cn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Vn=new B,vc=new $e,bc=new $e,Ft=class extends gs{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=_r*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Wa*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return _r*2*Math.atan(Math.tan(Wa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Vn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Vn.x,Vn.y).multiplyScalar(-e/Vn.z),Vn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Vn.x,Vn.y).multiplyScalar(-e/Vn.z)}getViewSize(e,t){return this.getViewBounds(e,vc,bc),t.subVectors(bc,vc)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Wa*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var Jn=class extends gs{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},So=class extends bo{constructor(){super(new Jn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ni=class extends ps{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.target=new Rt,this.shadow=new So}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var wi=-90,Ei=1,Or=class extends Rt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ft(wi,Ei,e,t);s.layers=this.layers,this.add(s);let r=new Ft(wi,Ei,e,t);r.layers=this.layers,this.add(r);let a=new Ft(wi,Ei,e,t);a.layers=this.layers,this.add(a);let o=new Ft(wi,Ei,e,t);o.layers=this.layers,this.add(o);let l=new Ft(wi,Ei,e,t);l.layers=this.layers,this.add(l);let c=new Ft(wi,Ei,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===en)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ci)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,d]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,d),e.setRenderTarget(u,h,p),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},Br=class extends Ft{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Yo="\\[\\]\\.:\\/",ad=new RegExp("["+Yo+"]","g"),Zo="[^"+Yo+"]",od="[^"+Yo.replace("\\.","")+"]",ld=/((?:WC+[\/:])*)/.source.replace("WC",Zo),cd=/(WCOD+)?/.source.replace("WCOD",od),hd=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Zo),ud=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Zo),dd=new RegExp("^"+ld+cd+hd+ud+"$"),fd=["material","materials","bones","map"],Mo=class{constructor(e,t,i){let s=i||ot.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},ot=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(ad,"")}static parseTrackName(e){let t=dd.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);fd.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=i(o.children);if(l)return l}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ce("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){Re("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Re("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Re("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let d=0;d<e.length;d++)if(e[d].name===c){c=d;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Re("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Re("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){Re("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){Re("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;Re("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Re("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Re("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ot.Composite=Mo;ot.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ot.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ot.prototype.GetterByBindingType=[ot.prototype._getValue_direct,ot.prototype._getValue_array,ot.prototype._getValue_arrayElement,ot.prototype._getValue_toArray];ot.prototype.SetterByBindingTypeAndVersioning=[[ot.prototype._setValue_direct,ot.prototype._setValue_direct_setNeedsUpdate,ot.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_array,ot.prototype._setValue_array_setNeedsUpdate,ot.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_arrayElement,ot.prototype._setValue_arrayElement_setNeedsUpdate,ot.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_fromArray,ot.prototype._setValue_fromArray_setNeedsUpdate,ot.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var U0=new Float32Array(1);var Ao=class n{static{n.prototype.isMatrix2=!0}constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=s,this}};function Jo(n,e,t,i){let s=pd(i);switch(t){case Vo:return n*e;case Wo:return n*e/s.components*s.byteLength;case qr:return n*e/s.components*s.byteLength;case ei:return n*e*2/s.components*s.byteLength;case $r:return n*e*2/s.components*s.byteLength;case Ho:return n*e*3/s.components*s.byteLength;case Jt:return n*e*4/s.components*s.byteLength;case Yr:return n*e*4/s.components*s.byteLength;case vs:case bs:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ss:case Ms:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Jr:case Kr:return Math.max(n,16)*Math.max(e,8)/4;case Zr:case jr:return Math.max(n,8)*Math.max(e,8)/2;case Qr:case ea:case na:case ia:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ta:case As:case sa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ra:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case aa:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case oa:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case la:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case ca:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case ha:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case ua:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case da:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case fa:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case pa:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case ma:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case ga:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case _a:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case xa:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case ya:case va:case ba:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Sa:case Ma:return Math.ceil(n/4)*Math.ceil(e/4)*8;case ws:case Aa:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function pd(n){switch(n){case Ot:case Bo:return{byteLength:1,components:1};case Fi:case ko:case xn:return{byteLength:2,components:1};case Wr:case Xr:return{byteLength:2,components:4};case nn:case Hr:case sn:return{byteLength:4,components:1};case zo:case Go:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:kr}}));typeof window<"u"&&(window.__THREE__?Ce("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=kr);function Rh(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function md(n){let e=new WeakMap;function t(o,l){let c=o.array,d=o.usage,u=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,d),o.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){let d=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,d);else{u.sort((p,m)=>p.start-m.start);let h=0;for(let p=1;p<u.length;p++){let m=u[h],x=u[p];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++h,u[h]=x)}u.length=h+1;for(let p=0,m=u.length;p<m;p++){let x=u[p];n.bufferSubData(c,x.start*d.BYTES_PER_ELEMENT,d,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var gd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_d=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,xd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,yd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,vd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,bd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Sd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Md=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ad=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,wd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ed=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Td=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Cd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Rd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Id=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Pd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ld=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Dd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Nd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ud=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Fd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Od=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Bd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,kd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,zd=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Gd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Vd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Hd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Wd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Xd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,qd="gl_FragColor = linearToOutputTexel( gl_FragColor );",$d=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Yd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Zd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Jd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,jd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Kd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Qd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ef=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,tf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,nf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,sf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,rf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,af=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,of=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,cf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,hf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,uf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,df=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ff=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,pf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,mf=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,gf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,_f=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,xf=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,yf=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,vf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Mf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Af=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ef=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Tf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Cf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Rf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,If=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Pf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Lf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Df=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Nf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Uf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Ff=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Of=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,kf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,zf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Gf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Vf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Hf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Wf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Xf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,$f=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Yf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Zf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Jf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,jf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Kf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Qf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,ep=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,tp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,np=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ip=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,sp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,rp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ap=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,op=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,lp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,cp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,up=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,dp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,fp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,pp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,mp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,gp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,_p=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,xp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ap=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,wp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ep=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Tp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Cp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ip=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Pp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Lp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Np=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Up=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Fp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Op=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Bp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,kp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Vp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,qp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$p=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Yp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Zp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Jp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Be={alphahash_fragment:gd,alphahash_pars_fragment:_d,alphamap_fragment:xd,alphamap_pars_fragment:yd,alphatest_fragment:vd,alphatest_pars_fragment:bd,aomap_fragment:Sd,aomap_pars_fragment:Md,batching_pars_vertex:Ad,batching_vertex:wd,begin_vertex:Ed,beginnormal_vertex:Td,bsdfs:Cd,iridescence_fragment:Rd,bumpmap_pars_fragment:Id,clipping_planes_fragment:Pd,clipping_planes_pars_fragment:Ld,clipping_planes_pars_vertex:Dd,clipping_planes_vertex:Nd,color_fragment:Ud,color_pars_fragment:Fd,color_pars_vertex:Od,color_vertex:Bd,common:kd,cube_uv_reflection_fragment:zd,defaultnormal_vertex:Gd,displacementmap_pars_vertex:Vd,displacementmap_vertex:Hd,emissivemap_fragment:Wd,emissivemap_pars_fragment:Xd,colorspace_fragment:qd,colorspace_pars_fragment:$d,envmap_fragment:Yd,envmap_common_pars_fragment:Zd,envmap_pars_fragment:Jd,envmap_pars_vertex:jd,envmap_physical_pars_fragment:cf,envmap_vertex:Kd,fog_vertex:Qd,fog_pars_vertex:ef,fog_fragment:tf,fog_pars_fragment:nf,gradientmap_pars_fragment:sf,lightmap_pars_fragment:rf,lights_lambert_fragment:af,lights_lambert_pars_fragment:of,lights_pars_begin:lf,lights_toon_fragment:hf,lights_toon_pars_fragment:uf,lights_phong_fragment:df,lights_phong_pars_fragment:ff,lights_physical_fragment:pf,lights_physical_pars_fragment:mf,lights_fragment_begin:gf,lights_fragment_maps:_f,lights_fragment_end:xf,lightprobes_pars_fragment:yf,logdepthbuf_fragment:vf,logdepthbuf_pars_fragment:bf,logdepthbuf_pars_vertex:Sf,logdepthbuf_vertex:Mf,map_fragment:Af,map_pars_fragment:wf,map_particle_fragment:Ef,map_particle_pars_fragment:Tf,metalnessmap_fragment:Cf,metalnessmap_pars_fragment:Rf,morphinstance_vertex:If,morphcolor_vertex:Pf,morphnormal_vertex:Lf,morphtarget_pars_vertex:Df,morphtarget_vertex:Nf,normal_fragment_begin:Uf,normal_fragment_maps:Ff,normal_pars_fragment:Of,normal_pars_vertex:Bf,normal_vertex:kf,normalmap_pars_fragment:zf,clearcoat_normal_fragment_begin:Gf,clearcoat_normal_fragment_maps:Vf,clearcoat_pars_fragment:Hf,iridescence_pars_fragment:Wf,opaque_fragment:Xf,packing:qf,premultiplied_alpha_fragment:$f,project_vertex:Yf,dithering_fragment:Zf,dithering_pars_fragment:Jf,roughnessmap_fragment:jf,roughnessmap_pars_fragment:Kf,shadowmap_pars_fragment:Qf,shadowmap_pars_vertex:ep,shadowmap_vertex:tp,shadowmask_pars_fragment:np,skinbase_vertex:ip,skinning_pars_vertex:sp,skinning_vertex:rp,skinnormal_vertex:ap,specularmap_fragment:op,specularmap_pars_fragment:lp,tonemapping_fragment:cp,tonemapping_pars_fragment:hp,transmission_fragment:up,transmission_pars_fragment:dp,uv_pars_fragment:fp,uv_pars_vertex:pp,uv_vertex:mp,worldpos_vertex:gp,background_vert:_p,background_frag:xp,backgroundCube_vert:yp,backgroundCube_frag:vp,cube_vert:bp,cube_frag:Sp,depth_vert:Mp,depth_frag:Ap,distance_vert:wp,distance_frag:Ep,equirect_vert:Tp,equirect_frag:Cp,linedashed_vert:Rp,linedashed_frag:Ip,meshbasic_vert:Pp,meshbasic_frag:Lp,meshlambert_vert:Dp,meshlambert_frag:Np,meshmatcap_vert:Up,meshmatcap_frag:Fp,meshnormal_vert:Op,meshnormal_frag:Bp,meshphong_vert:kp,meshphong_frag:zp,meshphysical_vert:Gp,meshphysical_frag:Vp,meshtoon_vert:Hp,meshtoon_frag:Wp,points_vert:Xp,points_frag:qp,shadow_vert:$p,shadow_frag:Yp,sprite_vert:Zp,sprite_frag:Jp},he={common:{diffuse:{value:new Ge(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Pe},alphaMap:{value:null},alphaMapTransform:{value:new Pe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Pe}},envmap:{envMap:{value:null},envMapRotation:{value:new Pe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Pe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Pe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Pe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Pe},normalScale:{value:new $e(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Pe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Pe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Pe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Pe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ge(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new B},probesMax:{value:new B},probesResolution:{value:new B}},points:{diffuse:{value:new Ge(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Pe},alphaTest:{value:0},uvTransform:{value:new Pe}},sprite:{diffuse:{value:new Ge(16777215)},opacity:{value:1},center:{value:new $e(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Pe},alphaMap:{value:null},alphaMapTransform:{value:new Pe},alphaTest:{value:0}}},vn={basic:{uniforms:Pt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:Be.meshbasic_vert,fragmentShader:Be.meshbasic_frag},lambert:{uniforms:Pt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ge(0)},envMapIntensity:{value:1}}]),vertexShader:Be.meshlambert_vert,fragmentShader:Be.meshlambert_frag},phong:{uniforms:Pt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ge(0)},specular:{value:new Ge(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Be.meshphong_vert,fragmentShader:Be.meshphong_frag},standard:{uniforms:Pt([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new Ge(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag},toon:{uniforms:Pt([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new Ge(0)}}]),vertexShader:Be.meshtoon_vert,fragmentShader:Be.meshtoon_frag},matcap:{uniforms:Pt([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:Be.meshmatcap_vert,fragmentShader:Be.meshmatcap_frag},points:{uniforms:Pt([he.points,he.fog]),vertexShader:Be.points_vert,fragmentShader:Be.points_frag},dashed:{uniforms:Pt([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Be.linedashed_vert,fragmentShader:Be.linedashed_frag},depth:{uniforms:Pt([he.common,he.displacementmap]),vertexShader:Be.depth_vert,fragmentShader:Be.depth_frag},normal:{uniforms:Pt([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:Be.meshnormal_vert,fragmentShader:Be.meshnormal_frag},sprite:{uniforms:Pt([he.sprite,he.fog]),vertexShader:Be.sprite_vert,fragmentShader:Be.sprite_frag},background:{uniforms:{uvTransform:{value:new Pe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Be.background_vert,fragmentShader:Be.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Pe}},vertexShader:Be.backgroundCube_vert,fragmentShader:Be.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Be.cube_vert,fragmentShader:Be.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Be.equirect_vert,fragmentShader:Be.equirect_frag},distance:{uniforms:Pt([he.common,he.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Be.distance_vert,fragmentShader:Be.distance_frag},shadow:{uniforms:Pt([he.lights,he.fog,{color:{value:new Ge(0)},opacity:{value:1}}]),vertexShader:Be.shadow_vert,fragmentShader:Be.shadow_frag}};vn.physical={uniforms:Pt([vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Pe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Pe},clearcoatNormalScale:{value:new $e(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Pe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Pe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Pe},sheen:{value:0},sheenColor:{value:new Ge(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Pe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Pe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Pe},transmissionSamplerSize:{value:new $e},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Pe},attenuationDistance:{value:0},attenuationColor:{value:new Ge(0)},specularColor:{value:new Ge(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Pe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Pe},anisotropyVector:{value:new $e},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Pe}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag};var Ca={r:0,b:0,g:0},jp=new dt,Ih=new Pe;Ih.set(-1,0,0,0,1,0,0,0,1);function Kp(n,e,t,i,s,r){let a=new Ge(0),o=s===!0?0:1,l,c,d=null,u=0,h=null;function p(S){let A=S.isScene===!0?S.background:null;if(A&&A.isTexture){let b=S.backgroundBlurriness>0;A=e.get(A,b)}return A}function m(S){let A=!1,b=p(S);b===null?g(a,o):b&&b.isColor&&(g(b,1),A=!0);let C=n.xr.getEnvironmentBlendMode();C==="additive"?t.buffers.color.setClear(0,0,0,1,r):C==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function x(S,A){let b=p(A);b&&(b.isCubeTexture||b.mapping===xs)?(c===void 0&&(c=new It(new qn(1,1,1),new Wt({name:"BackgroundCubeMaterial",uniforms:ui(vn.backgroundCube.uniforms),vertexShader:vn.backgroundCube.vertexShader,fragmentShader:vn.backgroundCube.fragmentShader,side:Dt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(C,w,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=b,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(jp.makeRotationFromEuler(A.backgroundRotation)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Ih),c.material.toneMapped=He.getTransfer(b.colorSpace)!==Je,(d!==b||u!==b.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,d=b,u=b.version,h=n.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):b&&b.isTexture&&(l===void 0&&(l=new It(new hs(2,2),new Wt({name:"BackgroundMaterial",uniforms:ui(vn.background.uniforms),vertexShader:vn.background.vertexShader,fragmentShader:vn.background.fragmentShader,side:In,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=b,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=He.getTransfer(b.colorSpace)!==Je,b.matrixAutoUpdate===!0&&b.updateMatrix(),l.material.uniforms.uvTransform.value.copy(b.matrix),(d!==b||u!==b.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,d=b,u=b.version,h=n.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function g(S,A){S.getRGB(Ca,$o(n)),t.buffers.color.setClear(Ca.r,Ca.g,Ca.b,A,r)}function f(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,A=1){a.set(S),o=A,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,g(a,o)},render:m,addToRenderList:x,dispose:f}}function Qp(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null),r=s,a=!1;function o(T,D,W,X,F){let k=!1,V=u(T,X,W,D);r!==V&&(r=V,c(r.object)),k=p(T,X,W,F),k&&m(T,X,W,F),F!==null&&e.update(F,n.ELEMENT_ARRAY_BUFFER),(k||a)&&(a=!1,b(T,D,W,X),F!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function l(){return n.createVertexArray()}function c(T){return n.bindVertexArray(T)}function d(T){return n.deleteVertexArray(T)}function u(T,D,W,X){let F=X.wireframe===!0,k=i[D.id];k===void 0&&(k={},i[D.id]=k);let V=T.isInstancedMesh===!0?T.id:0,Q=k[V];Q===void 0&&(Q={},k[V]=Q);let ee=Q[W.id];ee===void 0&&(ee={},Q[W.id]=ee);let oe=ee[F];return oe===void 0&&(oe=h(l()),ee[F]=oe),oe}function h(T){let D=[],W=[],X=[];for(let F=0;F<t;F++)D[F]=0,W[F]=0,X[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:W,attributeDivisors:X,object:T,attributes:{},index:null}}function p(T,D,W,X){let F=r.attributes,k=D.attributes,V=0,Q=W.getAttributes();for(let ee in Q)if(Q[ee].location>=0){let xe=F[ee],ye=k[ee];if(ye===void 0&&(ee==="instanceMatrix"&&T.instanceMatrix&&(ye=T.instanceMatrix),ee==="instanceColor"&&T.instanceColor&&(ye=T.instanceColor)),xe===void 0||xe.attribute!==ye||ye&&xe.data!==ye.data)return!0;V++}return r.attributesNum!==V||r.index!==X}function m(T,D,W,X){let F={},k=D.attributes,V=0,Q=W.getAttributes();for(let ee in Q)if(Q[ee].location>=0){let xe=k[ee];xe===void 0&&(ee==="instanceMatrix"&&T.instanceMatrix&&(xe=T.instanceMatrix),ee==="instanceColor"&&T.instanceColor&&(xe=T.instanceColor));let ye={};ye.attribute=xe,xe&&xe.data&&(ye.data=xe.data),F[ee]=ye,V++}r.attributes=F,r.attributesNum=V,r.index=X}function x(){let T=r.newAttributes;for(let D=0,W=T.length;D<W;D++)T[D]=0}function g(T){f(T,0)}function f(T,D){let W=r.newAttributes,X=r.enabledAttributes,F=r.attributeDivisors;W[T]=1,X[T]===0&&(n.enableVertexAttribArray(T),X[T]=1),F[T]!==D&&(n.vertexAttribDivisor(T,D),F[T]=D)}function S(){let T=r.newAttributes,D=r.enabledAttributes;for(let W=0,X=D.length;W<X;W++)D[W]!==T[W]&&(n.disableVertexAttribArray(W),D[W]=0)}function A(T,D,W,X,F,k,V){V===!0?n.vertexAttribIPointer(T,D,W,F,k):n.vertexAttribPointer(T,D,W,X,F,k)}function b(T,D,W,X){x();let F=X.attributes,k=W.getAttributes(),V=D.defaultAttributeValues;for(let Q in k){let ee=k[Q];if(ee.location>=0){let oe=F[Q];if(oe===void 0&&(Q==="instanceMatrix"&&T.instanceMatrix&&(oe=T.instanceMatrix),Q==="instanceColor"&&T.instanceColor&&(oe=T.instanceColor)),oe!==void 0){let xe=oe.normalized,ye=oe.itemSize,Ve=e.get(oe);if(Ve===void 0)continue;let Xe=Ve.buffer,Te=Ve.type,j=Ve.bytesPerElement,ue=Te===n.INT||Te===n.UNSIGNED_INT||oe.gpuType===Hr;if(oe.isInterleavedBufferAttribute){let ne=oe.data,we=ne.stride,Ee=oe.offset;if(ne.isInstancedInterleavedBuffer){for(let Ae=0;Ae<ee.locationSize;Ae++)f(ee.location+Ae,ne.meshPerAttribute);T.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Ae=0;Ae<ee.locationSize;Ae++)g(ee.location+Ae);n.bindBuffer(n.ARRAY_BUFFER,Xe);for(let Ae=0;Ae<ee.locationSize;Ae++)A(ee.location+Ae,ye/ee.locationSize,Te,xe,we*j,(Ee+ye/ee.locationSize*Ae)*j,ue)}else{if(oe.isInstancedBufferAttribute){for(let ne=0;ne<ee.locationSize;ne++)f(ee.location+ne,oe.meshPerAttribute);T.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let ne=0;ne<ee.locationSize;ne++)g(ee.location+ne);n.bindBuffer(n.ARRAY_BUFFER,Xe);for(let ne=0;ne<ee.locationSize;ne++)A(ee.location+ne,ye/ee.locationSize,Te,xe,ye*j,ye/ee.locationSize*ne*j,ue)}}else if(V!==void 0){let xe=V[Q];if(xe!==void 0)switch(xe.length){case 2:n.vertexAttrib2fv(ee.location,xe);break;case 3:n.vertexAttrib3fv(ee.location,xe);break;case 4:n.vertexAttrib4fv(ee.location,xe);break;default:n.vertexAttrib1fv(ee.location,xe)}}}}S()}function C(){E();for(let T in i){let D=i[T];for(let W in D){let X=D[W];for(let F in X){let k=X[F];for(let V in k)d(k[V].object),delete k[V];delete X[F]}}delete i[T]}}function w(T){if(i[T.id]===void 0)return;let D=i[T.id];for(let W in D){let X=D[W];for(let F in X){let k=X[F];for(let V in k)d(k[V].object),delete k[V];delete X[F]}}delete i[T.id]}function I(T){for(let D in i){let W=i[D];for(let X in W){let F=W[X];if(F[T.id]===void 0)continue;let k=F[T.id];for(let V in k)d(k[V].object),delete k[V];delete F[T.id]}}}function y(T){for(let D in i){let W=i[D],X=T.isInstancedMesh===!0?T.id:0,F=W[X];if(F!==void 0){for(let k in F){let V=F[k];for(let Q in V)d(V[Q].object),delete V[Q];delete F[k]}delete W[X],Object.keys(W).length===0&&delete i[D]}}}function E(){L(),a=!0,r!==s&&(r=s,c(r.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:L,dispose:C,releaseStatesOfGeometry:w,releaseStatesOfObject:y,releaseStatesOfProgram:I,initAttributes:x,enableAttribute:g,disableUnusedAttributes:S}}function em(n,e,t){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function a(l,c,d){d!==0&&(n.drawArraysInstanced(i,l,c,d),t.update(c,i,d))}function o(l,c,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,d);let h=0;for(let p=0;p<d;p++)h+=c[p];t.update(h,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function tm(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let I=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(I){return!(I!==Jt&&i.convert(I)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(I){let y=I===xn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(I!==Ot&&i.convert(I)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==sn&&!y)}function l(I){if(I==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",d=l(c);d!==c&&(Ce("WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);let u=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Ce("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),A=n.getParameter(n.MAX_VARYING_VECTORS),b=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),C=n.getParameter(n.MAX_SAMPLES),w=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:h,maxTextures:p,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:S,maxVaryings:A,maxFragmentUniforms:b,maxSamples:C,samples:w}}function nm(n){let e=this,t=null,i=0,s=!1,r=!1,a=new hn,o=new Pe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){let p=u.length!==0||h||i!==0||s;return s=h,i=u.length,p},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,h){t=d(u,h,0)},this.setState=function(u,h,p){let m=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,f=n.get(u);if(!s||m===null||m.length===0||r&&!g)r?d(null):c();else{let S=r?0:i,A=S*4,b=f.clippingState||null;l.value=b,b=d(m,h,A,p);for(let C=0;C!==A;++C)b[C]=t[C];f.clippingState=b,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(u,h,p,m){let x=u!==null?u.length:0,g=null;if(x!==0){if(g=l.value,m!==!0||g===null){let f=p+x*4,S=h.matrixWorldInverse;o.getNormalMatrix(S),(g===null||g.length<f)&&(g=new Float32Array(f));for(let A=0,b=p;A!==x;++A,b+=4)a.copy(u[A]).applyMatrix4(S,o),a.normal.toArray(g,b),g[b+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}var ti=4,oh=[.125,.215,.35,.446,.526,.582],di=20,im=256,Ts=new Jn,lh=new Ge,jo=null,Ko=0,Qo=0,el=!1,sm=new B,Ia=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){let{size:a=256,position:o=sm}=r;jo=this._renderer.getRenderTarget(),Ko=this._renderer.getActiveCubeFace(),Qo=this._renderer.getActiveMipmapLevel(),el=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=uh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=hh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(jo,Ko,Qo),this._renderer.xr.enabled=el,e.scissorTest=!1,Bi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===jn||e.mapping===hi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),jo=this._renderer.getRenderTarget(),Ko=this._renderer.getActiveCubeFace(),Qo=this._renderer.getActiveMipmapLevel(),el=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Mt,minFilter:Mt,generateMipmaps:!1,type:xn,format:Jt,colorSpace:ji,depthBuffer:!1},s=ch(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ch(e,t,i);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=rm(r)),this._blurMaterial=om(r,e,t),this._ggxMaterial=am(r,e,t)}return s}_compileMaterial(e){let t=new It(new Zt,e);this._renderer.compile(t,Ts)}_sceneToCubeUV(e,t,i,s,r){let l=new Ft(90,1,t,i),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,p=u.toneMapping;u.getClearColor(lh),u.toneMapping=tn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new It(new qn,new rs({name:"PMREM.Background",side:Dt,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,g=x.material,f=!1,S=e.background;S?S.isColor&&(g.color.copy(S),e.background=null,f=!0):(g.color.copy(lh),f=!0);for(let A=0;A<6;A++){let b=A%3;b===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+d[A],r.y,r.z)):b===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+d[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+d[A]));let C=this._cubeSize;Bi(s,b*C,A>2?C:0,C,C),u.setRenderTarget(s),f&&u.render(x,l),u.render(e,l)}u.toneMapping=p,u.autoClear=h,e.background=S}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===jn||e.mapping===hi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=uh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=hh());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;Bi(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Ts)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;let l=a.uniforms,c=i/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-d*d),h=0+c*1.25,p=u*h,{_lodMax:m}=this,x=this._sizeLods[i],g=3*x*(i>m-ti?i-m+ti:0),f=4*(this._cubeSize-x);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=m-t,Bi(r,g,f,3*x,2*x),s.setRenderTarget(r),s.render(o,Ts),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-i,Bi(e,g,f,3*x,2*x),s.setRenderTarget(e),s.render(o,Ts)}_blur(e,t,i,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Re("blur direction must be either latitudinal or longitudinal!");let d=3,u=this._lodMeshes[s];u.material=c;let h=c.uniforms,p=this._sizeLods[i]-1,m=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*di-1),x=r/m,g=isFinite(r)?1+Math.floor(d*x):di;g>di&&Ce(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${di}`);let f=[],S=0;for(let I=0;I<di;++I){let y=I/x,E=Math.exp(-y*y/2);f.push(E),I===0?S+=E:I<g&&(S+=2*E)}for(let I=0;I<f.length;I++)f[I]=f[I]/S;h.envMap.value=e.texture,h.samples.value=g,h.weights.value=f,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);let{_lodMax:A}=this;h.dTheta.value=m,h.mipInt.value=A-i;let b=this._sizeLods[s],C=3*b*(s>A-ti?s-A+ti:0),w=4*(this._cubeSize-b);Bi(t,C,w,3*b,2*b),l.setRenderTarget(t),l.render(u,Ts)}};function rm(n){let e=[],t=[],i=[],s=n,r=n-ti+1+oh.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let l=1/o;a>n-ti?l=oh[a-n+ti-1]:a===0&&(l=0),t.push(l);let c=1/(o-2),d=-c,u=1+c,h=[d,d,u,d,u,u,d,d,u,u,d,u],p=6,m=6,x=3,g=2,f=1,S=new Float32Array(x*m*p),A=new Float32Array(g*m*p),b=new Float32Array(f*m*p);for(let w=0;w<p;w++){let I=w%3*2/3-1,y=w>2?0:-1,E=[I,y,0,I+2/3,y,0,I+2/3,y+1,0,I,y,0,I+2/3,y+1,0,I,y+1,0];S.set(E,x*m*w),A.set(h,g*m*w);let L=[w,w,w,w,w,w];b.set(L,f*m*w)}let C=new Zt;C.setAttribute("position",new Vt(S,x)),C.setAttribute("uv",new Vt(A,g)),C.setAttribute("faceIndex",new Vt(b,f)),i.push(new It(C,null)),s>ti&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function ch(n,e,t){let i=new Ht(n,e,t);return i.texture.mapping=xs,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Bi(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function am(n,e,t){return new Wt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:im,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Da(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:_n,depthTest:!1,depthWrite:!1})}function om(n,e,t){let i=new Float32Array(di),s=new B(0,1,0);return new Wt({name:"SphericalGaussianBlur",defines:{n:di,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Da(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:_n,depthTest:!1,depthWrite:!1})}function hh(){return new Wt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Da(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:_n,depthTest:!1,depthWrite:!1})}function uh(){return new Wt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Da(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:_n,depthTest:!1,depthWrite:!1})}function Da(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var Pa=class extends Ht{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new as(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new qn(5,5,5),r=new Wt({name:"CubemapFromEquirect",uniforms:ui(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Dt,blending:_n});r.uniforms.tEquirect.value=t;let a=new It(s,r),o=t.minFilter;return t.minFilter===Kn&&(t.minFilter=Mt),new Or(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}};function lm(n){let e=new WeakMap,t=new WeakMap,i=null;function s(h,p=!1){return h==null?null:p?a(h):r(h)}function r(h){if(h&&h.isTexture){let p=h.mapping;if(p===zr||p===Gr)if(e.has(h)){let m=e.get(h).texture;return o(m,h.mapping)}else{let m=h.image;if(m&&m.height>0){let x=new Pa(m.height);return x.fromEquirectangularTexture(n,h),e.set(h,x),h.addEventListener("dispose",c),o(x.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){let p=h.mapping,m=p===zr||p===Gr,x=p===jn||p===hi;if(m||x){let g=t.get(h),f=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==f)return i===null&&(i=new Ia(n)),g=m?i.fromEquirectangular(h,g):i.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),g.texture;if(g!==void 0)return g.texture;{let S=h.image;return m&&S&&S.height>0||x&&S&&l(S)?(i===null&&(i=new Ia(n)),g=m?i.fromEquirectangular(h):i.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),h.addEventListener("dispose",d),g.texture):null}}}return h}function o(h,p){return p===zr?h.mapping=jn:p===Gr&&(h.mapping=hi),h}function l(h){let p=0,m=6;for(let x=0;x<m;x++)h[x]!==void 0&&p++;return p===m}function c(h){let p=h.target;p.removeEventListener("dispose",c);let m=e.get(p);m!==void 0&&(e.delete(p),m.dispose())}function d(h){let p=h.target;p.removeEventListener("dispose",d);let m=t.get(p);m!==void 0&&(t.delete(p),m.dispose())}function u(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:u}}function cm(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&gr("WebGLRenderer: "+i+" extension not supported."),s}}}function hm(n,e,t,i){let s={},r=new WeakMap;function a(u){let h=u.target;h.index!==null&&e.remove(h.index);for(let m in h.attributes)e.remove(h.attributes[m]);h.removeEventListener("dispose",a),delete s[h.id];let p=r.get(h);p&&(e.remove(p),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(u,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function l(u){let h=u.attributes;for(let p in h)e.update(h[p],n.ARRAY_BUFFER)}function c(u){let h=[],p=u.index,m=u.attributes.position,x=0;if(m===void 0)return;if(p!==null){let S=p.array;x=p.version;for(let A=0,b=S.length;A<b;A+=3){let C=S[A+0],w=S[A+1],I=S[A+2];h.push(C,w,w,I,I,C)}}else{let S=m.array;x=m.version;for(let A=0,b=S.length/3-1;A<b;A+=3){let C=A+0,w=A+1,I=A+2;h.push(C,w,w,I,I,C)}}let g=new(m.count>=65535?ss:is)(h,1);g.version=x;let f=r.get(u);f&&e.remove(f),r.set(u,g)}function d(u){let h=r.get(u);if(h){let p=u.index;p!==null&&h.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:d}}function um(n,e,t){let i;function s(u){i=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,h){n.drawElements(i,h,r,u*a),t.update(h,i,1)}function c(u,h,p){p!==0&&(n.drawElementsInstanced(i,h,r,u*a,p),t.update(h,i,p))}function d(u,h,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,r,u,0,p);let x=0;for(let g=0;g<p;g++)x+=h[g];t.update(x,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d}function dm(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:Re("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function fm(n,e,t){let i=new WeakMap,s=new lt;function r(a,o,l){let c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0,h=i.get(o);if(h===void 0||h.count!==u){let E=function(){I.dispose(),i.delete(o),o.removeEventListener("dispose",E)};h!==void 0&&h.texture.dispose();let p=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],S=o.morphAttributes.color||[],A=0;p===!0&&(A=1),m===!0&&(A=2),x===!0&&(A=3);let b=o.attributes.position.count*A,C=1;b>e.maxTextureSize&&(C=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);let w=new Float32Array(b*C*4*u),I=new es(w,b,C,u);I.type=sn,I.needsUpdate=!0;let y=A*4;for(let L=0;L<u;L++){let T=g[L],D=f[L],W=S[L],X=b*C*4*L;for(let F=0;F<T.count;F++){let k=F*y;p===!0&&(s.fromBufferAttribute(T,F),w[X+k+0]=s.x,w[X+k+1]=s.y,w[X+k+2]=s.z,w[X+k+3]=0),m===!0&&(s.fromBufferAttribute(D,F),w[X+k+4]=s.x,w[X+k+5]=s.y,w[X+k+6]=s.z,w[X+k+7]=0),x===!0&&(s.fromBufferAttribute(W,F),w[X+k+8]=s.x,w[X+k+9]=s.y,w[X+k+10]=s.z,w[X+k+11]=W.itemSize===4?s.w:1)}}h={count:u,texture:I,size:new $e(b,C)},i.set(o,h),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let p=0;for(let x=0;x<c.length;x++)p+=c[x];let m=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",m),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function pm(n,e,t,i,s){let r=new WeakMap;function a(c){let d=s.render.frame,u=c.geometry,h=e.get(c,u);if(r.get(h)!==d&&(e.update(h),r.set(h,d)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==d&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,d))),c.isSkinnedMesh){let p=c.skeleton;r.get(p)!==d&&(p.update(),r.set(p,d))}return h}function o(){r=new WeakMap}function l(c){let d=c.target;d.removeEventListener("dispose",l),i.releaseStatesOfObject(d),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:a,dispose:o}}var mm={[Io]:"LINEAR_TONE_MAPPING",[Po]:"REINHARD_TONE_MAPPING",[Lo]:"CINEON_TONE_MAPPING",[Do]:"ACES_FILMIC_TONE_MAPPING",[Uo]:"AGX_TONE_MAPPING",[Fo]:"NEUTRAL_TONE_MAPPING",[No]:"CUSTOM_TONE_MAPPING"};function gm(n,e,t,i,s){let r=new Ht(e,t,{type:n,depthBuffer:i,stencilBuffer:s,depthTexture:i?new Ln(e,t):void 0}),a=new Ht(e,t,{type:xn,depthBuffer:!1,stencilBuffer:!1}),o=new Zt;o.setAttribute("position",new vt([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new vt([0,2,0,0,2,0],2));let l=new Ar({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new It(o,l),d=new Jn(-1,1,1,-1,0,1),u=null,h=null,p=!1,m,x=null,g=[],f=!1;this.setSize=function(S,A){r.setSize(S,A),a.setSize(S,A);for(let b=0;b<g.length;b++){let C=g[b];C.setSize&&C.setSize(S,A)}},this.setEffects=function(S){g=S,f=g.length>0&&g[0].isRenderPass===!0;let A=r.width,b=r.height;for(let C=0;C<g.length;C++){let w=g[C];w.setSize&&w.setSize(A,b)}},this.begin=function(S,A){if(p||S.toneMapping===tn&&g.length===0)return!1;if(x=A,A!==null){let b=A.width,C=A.height;(r.width!==b||r.height!==C)&&this.setSize(b,C)}return f===!1&&S.setRenderTarget(r),m=S.toneMapping,S.toneMapping=tn,!0},this.hasRenderPass=function(){return f},this.end=function(S,A){S.toneMapping=m,p=!0;let b=r,C=a;for(let w=0;w<g.length;w++){let I=g[w];if(I.enabled!==!1&&(I.render(S,C,b,A),I.needsSwap!==!1)){let y=b;b=C,C=y}}if(u!==S.outputColorSpace||h!==S.toneMapping){u=S.outputColorSpace,h=S.toneMapping,l.defines={},He.getTransfer(u)===Je&&(l.defines.SRGB_TRANSFER="");let w=mm[h];w&&(l.defines[w]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=b.texture,S.setRenderTarget(x),S.render(c,d),x=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){r.depthTexture&&r.depthTexture.dispose(),r.dispose(),a.dispose(),o.dispose(),l.dispose()}}var Ph=new Lt,il=new Ln(1,1),Lh=new es,Dh=new vr,Nh=new as,dh=[],fh=[],ph=new Float32Array(16),mh=new Float32Array(9),gh=new Float32Array(4);function zi(n,e,t){let i=n[0];if(i<=0||i>0)return n;let s=e*t,r=dh[s];if(r===void 0&&(r=new Float32Array(s),dh[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function _t(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function xt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Na(n,e){let t=fh[e];t===void 0&&(t=new Int32Array(e),fh[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function _m(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function xm(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;n.uniform2fv(this.addr,e),xt(t,e)}}function ym(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(_t(t,e))return;n.uniform3fv(this.addr,e),xt(t,e)}}function vm(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;n.uniform4fv(this.addr,e),xt(t,e)}}function bm(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(_t(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),xt(t,e)}else{if(_t(t,i))return;gh.set(i),n.uniformMatrix2fv(this.addr,!1,gh),xt(t,i)}}function Sm(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(_t(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),xt(t,e)}else{if(_t(t,i))return;mh.set(i),n.uniformMatrix3fv(this.addr,!1,mh),xt(t,i)}}function Mm(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(_t(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),xt(t,e)}else{if(_t(t,i))return;ph.set(i),n.uniformMatrix4fv(this.addr,!1,ph),xt(t,i)}}function Am(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function wm(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;n.uniform2iv(this.addr,e),xt(t,e)}}function Em(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;n.uniform3iv(this.addr,e),xt(t,e)}}function Tm(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;n.uniform4iv(this.addr,e),xt(t,e)}}function Cm(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Rm(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(_t(t,e))return;n.uniform2uiv(this.addr,e),xt(t,e)}}function Im(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(_t(t,e))return;n.uniform3uiv(this.addr,e),xt(t,e)}}function Pm(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(_t(t,e))return;n.uniform4uiv(this.addr,e),xt(t,e)}}function Lm(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(il.compareFunction=t.isReversedDepthBuffer()?Ta:Ea,r=il):r=Ph,t.setTexture2D(e||r,s)}function Dm(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Dh,s)}function Nm(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Nh,s)}function Um(n,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Lh,s)}function Fm(n){switch(n){case 5126:return _m;case 35664:return xm;case 35665:return ym;case 35666:return vm;case 35674:return bm;case 35675:return Sm;case 35676:return Mm;case 5124:case 35670:return Am;case 35667:case 35671:return wm;case 35668:case 35672:return Em;case 35669:case 35673:return Tm;case 5125:return Cm;case 36294:return Rm;case 36295:return Im;case 36296:return Pm;case 35678:case 36198:case 36298:case 36306:case 35682:return Lm;case 35679:case 36299:case 36307:return Dm;case 35680:case 36300:case 36308:case 36293:return Nm;case 36289:case 36303:case 36311:case 36292:return Um}}function Om(n,e){n.uniform1fv(this.addr,e)}function Bm(n,e){let t=zi(e,this.size,2);n.uniform2fv(this.addr,t)}function km(n,e){let t=zi(e,this.size,3);n.uniform3fv(this.addr,t)}function zm(n,e){let t=zi(e,this.size,4);n.uniform4fv(this.addr,t)}function Gm(n,e){let t=zi(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Vm(n,e){let t=zi(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Hm(n,e){let t=zi(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Wm(n,e){n.uniform1iv(this.addr,e)}function Xm(n,e){n.uniform2iv(this.addr,e)}function qm(n,e){n.uniform3iv(this.addr,e)}function $m(n,e){n.uniform4iv(this.addr,e)}function Ym(n,e){n.uniform1uiv(this.addr,e)}function Zm(n,e){n.uniform2uiv(this.addr,e)}function Jm(n,e){n.uniform3uiv(this.addr,e)}function jm(n,e){n.uniform4uiv(this.addr,e)}function Km(n,e,t){let i=this.cache,s=e.length,r=Na(t,s);_t(i,r)||(n.uniform1iv(this.addr,r),xt(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=il:a=Ph;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function Qm(n,e,t){let i=this.cache,s=e.length,r=Na(t,s);_t(i,r)||(n.uniform1iv(this.addr,r),xt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Dh,r[a])}function eg(n,e,t){let i=this.cache,s=e.length,r=Na(t,s);_t(i,r)||(n.uniform1iv(this.addr,r),xt(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Nh,r[a])}function tg(n,e,t){let i=this.cache,s=e.length,r=Na(t,s);_t(i,r)||(n.uniform1iv(this.addr,r),xt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Lh,r[a])}function ng(n){switch(n){case 5126:return Om;case 35664:return Bm;case 35665:return km;case 35666:return zm;case 35674:return Gm;case 35675:return Vm;case 35676:return Hm;case 5124:case 35670:return Wm;case 35667:case 35671:return Xm;case 35668:case 35672:return qm;case 35669:case 35673:return $m;case 5125:return Ym;case 36294:return Zm;case 36295:return Jm;case 36296:return jm;case 35678:case 36198:case 36298:case 36306:case 35682:return Km;case 35679:case 36299:case 36307:return Qm;case 35680:case 36300:case 36308:case 36293:return eg;case 36289:case 36303:case 36311:case 36292:return tg}}var sl=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Fm(t.type)}},rl=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ng(t.type)}},al=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],i)}}},tl=/(\w+)(\])?(\[|\.)?/g;function _h(n,e){n.seq.push(e),n.map[e.id]=e}function ig(n,e,t){let i=n.name,s=i.length;for(tl.lastIndex=0;;){let r=tl.exec(i),a=tl.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){_h(t,c===void 0?new sl(o,n,e):new rl(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new al(o),_h(t,u)),t=u}}}var ki=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);ig(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){let r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&i.push(a)}return i}};function xh(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var sg=37297,rg=0;function ag(n,e){let t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}var yh=new Pe;function og(n){He._getMatrix(yh,He.workingColorSpace,n);let e=`mat3( ${yh.elements.map(t=>t.toFixed(4))} )`;switch(He.getTransfer(n)){case Ki:return[e,"LinearTransferOETF"];case Je:return[e,"sRGBTransferOETF"];default:return Ce("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function vh(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+ag(n.getShaderSource(e),o)}else return r}function lg(n,e){let t=og(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var cg={[Io]:"Linear",[Po]:"Reinhard",[Lo]:"Cineon",[Do]:"ACESFilmic",[Uo]:"AgX",[Fo]:"Neutral",[No]:"Custom"};function hg(n,e){let t=cg[e];return t===void 0?(Ce("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Ra=new B;function ug(){He.getLuminanceCoefficients(Ra);let n=Ra.x.toFixed(4),e=Ra.y.toFixed(4),t=Ra.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function dg(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Rs).join(`
`)}function fg(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function pg(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(e,s),a=r.name,o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Rs(n){return n!==""}function bh(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Sh(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var mg=/^[ \t]*#include +<([\w\d./]+)>/gm;function ol(n){return n.replace(mg,_g)}var gg=new Map;function _g(n,e){let t=Be[e];if(t===void 0){let i=gg.get(e);if(i!==void 0)t=Be[i],Ce('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return ol(t)}var xg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Mh(n){return n.replace(xg,yg)}function yg(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ah(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var vg={[_s]:"SHADOWMAP_TYPE_PCF",[Ui]:"SHADOWMAP_TYPE_VSM"};function bg(n){return vg[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Sg={[jn]:"ENVMAP_TYPE_CUBE",[hi]:"ENVMAP_TYPE_CUBE",[xs]:"ENVMAP_TYPE_CUBE_UV"};function Mg(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":Sg[n.envMapMode]||"ENVMAP_TYPE_CUBE"}var Ag={[hi]:"ENVMAP_MODE_REFRACTION"};function wg(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Ag[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Eg={[Ro]:"ENVMAP_BLENDING_MULTIPLY",[Hc]:"ENVMAP_BLENDING_MIX",[Wc]:"ENVMAP_BLENDING_ADD"};function Tg(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Eg[n.combine]||"ENVMAP_BLENDING_NONE"}function Cg(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function Rg(n,e,t,i){let s=n.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=bg(t),c=Mg(t),d=wg(t),u=Tg(t),h=Cg(t),p=dg(t),m=fg(r),x=s.createProgram(),g,f,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Rs).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Rs).join(`
`),f.length>0&&(f+=`
`)):(g=[Ah(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Rs).join(`
`),f=[Ah(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==tn?"#define TONE_MAPPING":"",t.toneMapping!==tn?Be.tonemapping_pars_fragment:"",t.toneMapping!==tn?hg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Be.colorspace_pars_fragment,lg("linearToOutputTexel",t.outputColorSpace),ug(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Rs).join(`
`)),a=ol(a),a=bh(a,t),a=Sh(a,t),o=ol(o),o=bh(o,t),o=Sh(o,t),a=Mh(a),o=Mh(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",t.glslVersion===Xo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Xo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let A=S+g+a,b=S+f+o,C=xh(s,s.VERTEX_SHADER,A),w=xh(s,s.FRAGMENT_SHADER,b);s.attachShader(x,C),s.attachShader(x,w),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function I(T){if(n.debug.checkShaderErrors){let D=s.getProgramInfoLog(x)||"",W=s.getShaderInfoLog(C)||"",X=s.getShaderInfoLog(w)||"",F=D.trim(),k=W.trim(),V=X.trim(),Q=!0,ee=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(Q=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,x,C,w);else{let oe=vh(s,C,"vertex"),xe=vh(s,w,"fragment");Re("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+F+`
`+oe+`
`+xe)}else F!==""?Ce("WebGLProgram: Program Info Log:",F):(k===""||V==="")&&(ee=!1);ee&&(T.diagnostics={runnable:Q,programLog:F,vertexShader:{log:k,prefix:g},fragmentShader:{log:V,prefix:f}})}s.deleteShader(C),s.deleteShader(w),y=new ki(s,x),E=pg(s,x)}let y;this.getUniforms=function(){return y===void 0&&I(this),y};let E;this.getAttributes=function(){return E===void 0&&I(this),E};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(x,sg)),L},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=rg++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=C,this.fragmentShader=w,this}var Ig=0,ll=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new cl(e),t.set(e,i)),i}},cl=class{constructor(e){this.id=Ig++,this.code=e,this.usedTimes=0}};function Pg(n){return n===ei||n===As||n===ws}function Lg(n,e,t,i,s,r){let a=new ts,o=new ll,l=new Set,c=[],d=new Map,u=i.logarithmicDepthBuffer,h=i.precision,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return l.add(y),y===0?"uv":`uv${y}`}function x(y,E,L,T,D,W){let X=T.fog,F=D.geometry,k=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?T.environment:null,V=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,Q=e.get(y.envMap||k,V),ee=Q&&Q.mapping===xs?Q.image.height:null,oe=p[y.type];y.precision!==null&&(h=i.getMaxPrecision(y.precision),h!==y.precision&&Ce("WebGLProgram.getParameters:",y.precision,"not supported, using",h,"instead."));let xe=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,ye=xe!==void 0?xe.length:0,Ve=0;F.morphAttributes.position!==void 0&&(Ve=1),F.morphAttributes.normal!==void 0&&(Ve=2),F.morphAttributes.color!==void 0&&(Ve=3);let Xe,Te,j,ue;if(oe){let Le=vn[oe];Xe=Le.vertexShader,Te=Le.fragmentShader}else Xe=y.vertexShader,Te=y.fragmentShader,o.update(y),j=o.getVertexShaderID(y),ue=o.getFragmentShaderID(y);let ne=n.getRenderTarget(),we=n.state.buffers.depth.getReversed(),Ee=D.isInstancedMesh===!0,Ae=D.isBatchedMesh===!0,tt=!!y.map,ke=!!y.matcap,Ze=!!Q,je=!!y.aoMap,Oe=!!y.lightMap,ct=!!y.bumpMap,Ke=!!y.normalMap,At=!!y.displacementMap,P=!!y.emissiveMap,ht=!!y.metalnessMap,Ue=!!y.roughnessMap,nt=y.anisotropy>0,le=y.clearcoat>0,at=y.dispersion>0,M=y.iridescence>0,_=y.sheen>0,O=y.transmission>0,Z=nt&&!!y.anisotropyMap,N=le&&!!y.clearcoatMap,H=le&&!!y.clearcoatNormalMap,te=le&&!!y.clearcoatRoughnessMap,$=M&&!!y.iridescenceMap,J=M&&!!y.iridescenceThicknessMap,ce=_&&!!y.sheenColorMap,ge=_&&!!y.sheenRoughnessMap,re=!!y.specularMap,ie=!!y.specularColorMap,Ie=!!y.specularIntensityMap,Fe=O&&!!y.transmissionMap,Ye=O&&!!y.thicknessMap,R=!!y.gradientMap,se=!!y.alphaMap,Y=y.alphaTest>0,pe=!!y.alphaHash,ae=!!y.extensions,K=tn;y.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(K=n.toneMapping);let be={shaderID:oe,shaderType:y.type,shaderName:y.name,vertexShader:Xe,fragmentShader:Te,defines:y.defines,customVertexShaderID:j,customFragmentShaderID:ue,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:h,batching:Ae,batchingColor:Ae&&D._colorsTexture!==null,instancing:Ee,instancingColor:Ee&&D.instanceColor!==null,instancingMorph:Ee&&D.morphTexture!==null,outputColorSpace:ne===null?n.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:He.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:tt,matcap:ke,envMap:Ze,envMapMode:Ze&&Q.mapping,envMapCubeUVHeight:ee,aoMap:je,lightMap:Oe,bumpMap:ct,normalMap:Ke,displacementMap:At,emissiveMap:P,normalMapObjectSpace:Ke&&y.normalMapType===$c,normalMapTangentSpace:Ke&&y.normalMapType===wa,packedNormalMap:Ke&&y.normalMapType===wa&&Pg(y.normalMap.format),metalnessMap:ht,roughnessMap:Ue,anisotropy:nt,anisotropyMap:Z,clearcoat:le,clearcoatMap:N,clearcoatNormalMap:H,clearcoatRoughnessMap:te,dispersion:at,iridescence:M,iridescenceMap:$,iridescenceThicknessMap:J,sheen:_,sheenColorMap:ce,sheenRoughnessMap:ge,specularMap:re,specularColorMap:ie,specularIntensityMap:Ie,transmission:O,transmissionMap:Fe,thicknessMap:Ye,gradientMap:R,opaque:y.transparent===!1&&y.blending===li&&y.alphaToCoverage===!1,alphaMap:se,alphaTest:Y,alphaHash:pe,combine:y.combine,mapUv:tt&&m(y.map.channel),aoMapUv:je&&m(y.aoMap.channel),lightMapUv:Oe&&m(y.lightMap.channel),bumpMapUv:ct&&m(y.bumpMap.channel),normalMapUv:Ke&&m(y.normalMap.channel),displacementMapUv:At&&m(y.displacementMap.channel),emissiveMapUv:P&&m(y.emissiveMap.channel),metalnessMapUv:ht&&m(y.metalnessMap.channel),roughnessMapUv:Ue&&m(y.roughnessMap.channel),anisotropyMapUv:Z&&m(y.anisotropyMap.channel),clearcoatMapUv:N&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:H&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:te&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:$&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:J&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:ce&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:ge&&m(y.sheenRoughnessMap.channel),specularMapUv:re&&m(y.specularMap.channel),specularColorMapUv:ie&&m(y.specularColorMap.channel),specularIntensityMapUv:Ie&&m(y.specularIntensityMap.channel),transmissionMapUv:Fe&&m(y.transmissionMap.channel),thicknessMapUv:Ye&&m(y.thicknessMap.channel),alphaMapUv:se&&m(y.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(Ke||nt),vertexNormals:!!F.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!F.attributes.uv&&(tt||se),fog:!!X,useFog:y.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||F.attributes.normal===void 0&&Ke===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:we,skinning:D.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:Ve,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:W.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:K,decodeVideoTexture:tt&&y.map.isVideoTexture===!0&&He.getTransfer(y.map.colorSpace)===Je,decodeVideoTextureEmissive:P&&y.emissiveMap.isVideoTexture===!0&&He.getTransfer(y.emissiveMap.colorSpace)===Je,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===gn,flipSided:y.side===Dt,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:ae&&y.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ae&&y.extensions.multiDraw===!0||Ae)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return be.vertexUv1s=l.has(1),be.vertexUv2s=l.has(2),be.vertexUv3s=l.has(3),l.clear(),be}function g(y){let E=[];if(y.shaderID?E.push(y.shaderID):(E.push(y.customVertexShaderID),E.push(y.customFragmentShaderID)),y.defines!==void 0)for(let L in y.defines)E.push(L),E.push(y.defines[L]);return y.isRawShaderMaterial===!1&&(f(E,y),S(E,y),E.push(n.outputColorSpace)),E.push(y.customProgramCacheKey),E.join()}function f(y,E){y.push(E.precision),y.push(E.outputColorSpace),y.push(E.envMapMode),y.push(E.envMapCubeUVHeight),y.push(E.mapUv),y.push(E.alphaMapUv),y.push(E.lightMapUv),y.push(E.aoMapUv),y.push(E.bumpMapUv),y.push(E.normalMapUv),y.push(E.displacementMapUv),y.push(E.emissiveMapUv),y.push(E.metalnessMapUv),y.push(E.roughnessMapUv),y.push(E.anisotropyMapUv),y.push(E.clearcoatMapUv),y.push(E.clearcoatNormalMapUv),y.push(E.clearcoatRoughnessMapUv),y.push(E.iridescenceMapUv),y.push(E.iridescenceThicknessMapUv),y.push(E.sheenColorMapUv),y.push(E.sheenRoughnessMapUv),y.push(E.specularMapUv),y.push(E.specularColorMapUv),y.push(E.specularIntensityMapUv),y.push(E.transmissionMapUv),y.push(E.thicknessMapUv),y.push(E.combine),y.push(E.fogExp2),y.push(E.sizeAttenuation),y.push(E.morphTargetsCount),y.push(E.morphAttributeCount),y.push(E.numDirLights),y.push(E.numPointLights),y.push(E.numSpotLights),y.push(E.numSpotLightMaps),y.push(E.numHemiLights),y.push(E.numRectAreaLights),y.push(E.numDirLightShadows),y.push(E.numPointLightShadows),y.push(E.numSpotLightShadows),y.push(E.numSpotLightShadowsWithMaps),y.push(E.numLightProbes),y.push(E.shadowMapType),y.push(E.toneMapping),y.push(E.numClippingPlanes),y.push(E.numClipIntersection),y.push(E.depthPacking)}function S(y,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),y.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),y.push(a.mask)}function A(y){let E=p[y.type],L;if(E){let T=vn[E];L=rh.clone(T.uniforms)}else L=y.uniforms;return L}function b(y,E){let L=d.get(E);return L!==void 0?++L.usedTimes:(L=new Rg(n,E,y,s),c.push(L),d.set(E,L)),L}function C(y){if(--y.usedTimes===0){let E=c.indexOf(y);c[E]=c[c.length-1],c.pop(),d.delete(y.cacheKey),y.destroy()}}function w(y){o.remove(y)}function I(){o.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:A,acquireProgram:b,releaseProgram:C,releaseShaderCache:w,programs:c,dispose:I}}function Dg(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Ng(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function wh(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Eh(){let n=[],e=0,t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(h){let p=0;return h.isInstancedMesh&&(p+=2),h.isSkinnedMesh&&(p+=1),p}function o(h,p,m,x,g,f){let S=n[e];return S===void 0?(S={id:h.id,object:h,geometry:p,material:m,materialVariant:a(h),groupOrder:x,renderOrder:h.renderOrder,z:g,group:f},n[e]=S):(S.id=h.id,S.object=h,S.geometry=p,S.material=m,S.materialVariant=a(h),S.groupOrder=x,S.renderOrder=h.renderOrder,S.z=g,S.group=f),e++,S}function l(h,p,m,x,g,f){let S=o(h,p,m,x,g,f);m.transmission>0?i.push(S):m.transparent===!0?s.push(S):t.push(S)}function c(h,p,m,x,g,f){let S=o(h,p,m,x,g,f);m.transmission>0?i.unshift(S):m.transparent===!0?s.unshift(S):t.unshift(S)}function d(h,p){t.length>1&&t.sort(h||Ng),i.length>1&&i.sort(p||wh),s.length>1&&s.sort(p||wh)}function u(){for(let h=e,p=n.length;h<p;h++){let m=n[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:u,sort:d}}function Ug(){let n=new WeakMap;function e(i,s){let r=n.get(i),a;return r===void 0?(a=new Eh,n.set(i,[a])):s>=r.length?(a=new Eh,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Fg(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new B,color:new Ge};break;case"SpotLight":t={position:new B,direction:new B,color:new Ge,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new B,color:new Ge,distance:0,decay:0};break;case"HemisphereLight":t={direction:new B,skyColor:new Ge,groundColor:new Ge};break;case"RectAreaLight":t={color:new Ge,position:new B,halfWidth:new B,halfHeight:new B};break}return n[e.id]=t,t}}}function Og(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var Bg=0;function kg(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function zg(n){let e=new Fg,t=Og(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new B);let s=new B,r=new dt,a=new dt;function o(c){let d=0,u=0,h=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let p=0,m=0,x=0,g=0,f=0,S=0,A=0,b=0,C=0,w=0,I=0;c.sort(kg);for(let E=0,L=c.length;E<L;E++){let T=c[E],D=T.color,W=T.intensity,X=T.distance,F=null;if(T.shadow&&T.shadow.map&&(T.shadow.map.texture.format===ei?F=T.shadow.map.texture:F=T.shadow.map.depthTexture||T.shadow.map.texture),T.isAmbientLight)d+=D.r*W,u+=D.g*W,h+=D.b*W;else if(T.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(T.sh.coefficients[k],W);I++}else if(T.isDirectionalLight){let k=e.get(T);if(k.color.copy(T.color).multiplyScalar(T.intensity),T.castShadow){let V=T.shadow,Q=t.get(T);Q.shadowIntensity=V.intensity,Q.shadowBias=V.bias,Q.shadowNormalBias=V.normalBias,Q.shadowRadius=V.radius,Q.shadowMapSize=V.mapSize,i.directionalShadow[p]=Q,i.directionalShadowMap[p]=F,i.directionalShadowMatrix[p]=T.shadow.matrix,S++}i.directional[p]=k,p++}else if(T.isSpotLight){let k=e.get(T);k.position.setFromMatrixPosition(T.matrixWorld),k.color.copy(D).multiplyScalar(W),k.distance=X,k.coneCos=Math.cos(T.angle),k.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),k.decay=T.decay,i.spot[x]=k;let V=T.shadow;if(T.map&&(i.spotLightMap[C]=T.map,C++,V.updateMatrices(T),T.castShadow&&w++),i.spotLightMatrix[x]=V.matrix,T.castShadow){let Q=t.get(T);Q.shadowIntensity=V.intensity,Q.shadowBias=V.bias,Q.shadowNormalBias=V.normalBias,Q.shadowRadius=V.radius,Q.shadowMapSize=V.mapSize,i.spotShadow[x]=Q,i.spotShadowMap[x]=F,b++}x++}else if(T.isRectAreaLight){let k=e.get(T);k.color.copy(D).multiplyScalar(W),k.halfWidth.set(T.width*.5,0,0),k.halfHeight.set(0,T.height*.5,0),i.rectArea[g]=k,g++}else if(T.isPointLight){let k=e.get(T);if(k.color.copy(T.color).multiplyScalar(T.intensity),k.distance=T.distance,k.decay=T.decay,T.castShadow){let V=T.shadow,Q=t.get(T);Q.shadowIntensity=V.intensity,Q.shadowBias=V.bias,Q.shadowNormalBias=V.normalBias,Q.shadowRadius=V.radius,Q.shadowMapSize=V.mapSize,Q.shadowCameraNear=V.camera.near,Q.shadowCameraFar=V.camera.far,i.pointShadow[m]=Q,i.pointShadowMap[m]=F,i.pointShadowMatrix[m]=T.shadow.matrix,A++}i.point[m]=k,m++}else if(T.isHemisphereLight){let k=e.get(T);k.skyColor.copy(T.color).multiplyScalar(W),k.groundColor.copy(T.groundColor).multiplyScalar(W),i.hemi[f]=k,f++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=he.LTC_FLOAT_1,i.rectAreaLTC2=he.LTC_FLOAT_2):(i.rectAreaLTC1=he.LTC_HALF_1,i.rectAreaLTC2=he.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=h;let y=i.hash;(y.directionalLength!==p||y.pointLength!==m||y.spotLength!==x||y.rectAreaLength!==g||y.hemiLength!==f||y.numDirectionalShadows!==S||y.numPointShadows!==A||y.numSpotShadows!==b||y.numSpotMaps!==C||y.numLightProbes!==I)&&(i.directional.length=p,i.spot.length=x,i.rectArea.length=g,i.point.length=m,i.hemi.length=f,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=A,i.pointShadowMap.length=A,i.spotShadow.length=b,i.spotShadowMap.length=b,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=A,i.spotLightMatrix.length=b+C-w,i.spotLightMap.length=C,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=I,y.directionalLength=p,y.pointLength=m,y.spotLength=x,y.rectAreaLength=g,y.hemiLength=f,y.numDirectionalShadows=S,y.numPointShadows=A,y.numSpotShadows=b,y.numSpotMaps=C,y.numLightProbes=I,i.version=Bg++)}function l(c,d){let u=0,h=0,p=0,m=0,x=0,g=d.matrixWorldInverse;for(let f=0,S=c.length;f<S;f++){let A=c[f];if(A.isDirectionalLight){let b=i.directional[u];b.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),u++}else if(A.isSpotLight){let b=i.spot[p];b.position.setFromMatrixPosition(A.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),p++}else if(A.isRectAreaLight){let b=i.rectArea[m];b.position.setFromMatrixPosition(A.matrixWorld),b.position.applyMatrix4(g),a.identity(),r.copy(A.matrixWorld),r.premultiply(g),a.extractRotation(r),b.halfWidth.set(A.width*.5,0,0),b.halfHeight.set(0,A.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),m++}else if(A.isPointLight){let b=i.point[h];b.position.setFromMatrixPosition(A.matrixWorld),b.position.applyMatrix4(g),h++}else if(A.isHemisphereLight){let b=i.hemi[x];b.direction.setFromMatrixPosition(A.matrixWorld),b.direction.transformDirection(g),x++}}}return{setup:o,setupView:l,state:i}}function Th(n){let e=new zg(n),t=[],i=[],s=[];function r(h){u.camera=h,t.length=0,i.length=0,s.length=0}function a(h){t.push(h)}function o(h){i.push(h)}function l(h){s.push(h)}function c(){e.setup(t)}function d(h){e.setupView(t,h)}let u={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:d,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Gg(n){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new Th(n),e.set(s,[o])):r>=a.length?(o=new Th(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}var Vg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Hg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Wg=[new B(1,0,0),new B(-1,0,0),new B(0,1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1)],Xg=[new B(0,-1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1),new B(0,-1,0),new B(0,-1,0)],Ch=new dt,Cs=new B,nl=new B;function qg(n,e,t){let i=new Di,s=new $e,r=new $e,a=new lt,o=new wr,l=new Er,c={},d=t.maxTextureSize,u={[In]:Dt,[Dt]:In,[gn]:gn},h=new Wt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $e},radius:{value:4}},vertexShader:Vg,fragmentShader:Hg}),p=h.clone();p.defines.HORIZONTAL_PASS=1;let m=new Zt;m.setAttribute("position",new Vt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new It(m,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=_s;let f=this.type;this.render=function(w,I,y){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;this.type===Ac&&(Ce("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=_s);let E=n.getRenderTarget(),L=n.getActiveCubeFace(),T=n.getActiveMipmapLevel(),D=n.state;D.setBlending(_n),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let W=f!==this.type;W&&I.traverse(function(X){X.material&&(Array.isArray(X.material)?X.material.forEach(F=>F.needsUpdate=!0):X.material.needsUpdate=!0)});for(let X=0,F=w.length;X<F;X++){let k=w[X],V=k.shadow;if(V===void 0){Ce("WebGLShadowMap:",k,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);let Q=V.getFrameExtents();s.multiply(Q),r.copy(V.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/Q.x),s.x=r.x*Q.x,V.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/Q.y),s.y=r.y*Q.y,V.mapSize.y=r.y));let ee=n.state.buffers.depth.getReversed();if(V.camera._reversedDepth=ee,V.map===null||W===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===Ui){if(k.isPointLight){Ce("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new Ht(s.x,s.y,{format:ei,type:xn,minFilter:Mt,magFilter:Mt,generateMipmaps:!1}),V.map.texture.name=k.name+".shadowMap",V.map.depthTexture=new Ln(s.x,s.y,sn),V.map.depthTexture.name=k.name+".shadowMapDepth",V.map.depthTexture.format=dn,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=bt,V.map.depthTexture.magFilter=bt}else k.isPointLight?(V.map=new Pa(s.x),V.map.depthTexture=new Mr(s.x,nn)):(V.map=new Ht(s.x,s.y),V.map.depthTexture=new Ln(s.x,s.y,nn)),V.map.depthTexture.name=k.name+".shadowMap",V.map.depthTexture.format=dn,this.type===_s?(V.map.depthTexture.compareFunction=ee?Ta:Ea,V.map.depthTexture.minFilter=Mt,V.map.depthTexture.magFilter=Mt):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=bt,V.map.depthTexture.magFilter=bt);V.camera.updateProjectionMatrix()}let oe=V.map.isWebGLCubeRenderTarget?6:1;for(let xe=0;xe<oe;xe++){if(V.map.isWebGLCubeRenderTarget)n.setRenderTarget(V.map,xe),n.clear();else{xe===0&&(n.setRenderTarget(V.map),n.clear());let ye=V.getViewport(xe);a.set(r.x*ye.x,r.y*ye.y,r.x*ye.z,r.y*ye.w),D.viewport(a)}if(k.isPointLight){let ye=V.camera,Ve=V.matrix,Xe=k.distance||ye.far;Xe!==ye.far&&(ye.far=Xe,ye.updateProjectionMatrix()),Cs.setFromMatrixPosition(k.matrixWorld),ye.position.copy(Cs),nl.copy(ye.position),nl.add(Wg[xe]),ye.up.copy(Xg[xe]),ye.lookAt(nl),ye.updateMatrixWorld(),Ve.makeTranslation(-Cs.x,-Cs.y,-Cs.z),Ch.multiplyMatrices(ye.projectionMatrix,ye.matrixWorldInverse),V._frustum.setFromProjectionMatrix(Ch,ye.coordinateSystem,ye.reversedDepth)}else V.updateMatrices(k);i=V.getFrustum(),b(I,y,V.camera,k,this.type)}V.isPointLightShadow!==!0&&this.type===Ui&&S(V,y),V.needsUpdate=!1}f=this.type,g.needsUpdate=!1,n.setRenderTarget(E,L,T)};function S(w,I){let y=e.update(x);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Ht(s.x,s.y,{format:ei,type:xn})),h.uniforms.shadow_pass.value=w.map.depthTexture,h.uniforms.resolution.value=w.mapSize,h.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(I,null,y,h,x,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(I,null,y,p,x,null)}function A(w,I,y,E){let L=null,T=y.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(T!==void 0)L=T;else if(L=y.isPointLight===!0?l:o,n.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0||I.alphaToCoverage===!0){let D=L.uuid,W=I.uuid,X=c[D];X===void 0&&(X={},c[D]=X);let F=X[W];F===void 0&&(F=L.clone(),X[W]=F,I.addEventListener("dispose",C)),L=F}if(L.visible=I.visible,L.wireframe=I.wireframe,E===Ui?L.side=I.shadowSide!==null?I.shadowSide:I.side:L.side=I.shadowSide!==null?I.shadowSide:u[I.side],L.alphaMap=I.alphaMap,L.alphaTest=I.alphaToCoverage===!0?.5:I.alphaTest,L.map=I.map,L.clipShadows=I.clipShadows,L.clippingPlanes=I.clippingPlanes,L.clipIntersection=I.clipIntersection,L.displacementMap=I.displacementMap,L.displacementScale=I.displacementScale,L.displacementBias=I.displacementBias,L.wireframeLinewidth=I.wireframeLinewidth,L.linewidth=I.linewidth,y.isPointLight===!0&&L.isMeshDistanceMaterial===!0){let D=n.properties.get(L);D.light=y}return L}function b(w,I,y,E,L){if(w.visible===!1)return;if(w.layers.test(I.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&L===Ui)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,w.matrixWorld);let W=e.update(w),X=w.material;if(Array.isArray(X)){let F=W.groups;for(let k=0,V=F.length;k<V;k++){let Q=F[k],ee=X[Q.materialIndex];if(ee&&ee.visible){let oe=A(w,ee,E,L);w.onBeforeShadow(n,w,I,y,W,oe,Q),n.renderBufferDirect(y,null,W,oe,w,Q),w.onAfterShadow(n,w,I,y,W,oe,Q)}}}else if(X.visible){let F=A(w,X,E,L);w.onBeforeShadow(n,w,I,y,W,F,null),n.renderBufferDirect(y,null,W,F,w,null),w.onAfterShadow(n,w,I,y,W,F,null)}}let D=w.children;for(let W=0,X=D.length;W<X;W++)b(D[W],I,y,E,L)}function C(w){w.target.removeEventListener("dispose",C);for(let y in c){let E=c[y],L=w.target.uuid;L in E&&(E[L].dispose(),delete E[L])}}}function $g(n,e){function t(){let R=!1,se=new lt,Y=null,pe=new lt(0,0,0,0);return{setMask:function(ae){Y!==ae&&!R&&(n.colorMask(ae,ae,ae,ae),Y=ae)},setLocked:function(ae){R=ae},setClear:function(ae,K,be,Le,ft){ft===!0&&(ae*=Le,K*=Le,be*=Le),se.set(ae,K,be,Le),pe.equals(se)===!1&&(n.clearColor(ae,K,be,Le),pe.copy(se))},reset:function(){R=!1,Y=null,pe.set(-1,0,0,0)}}}function i(){let R=!1,se=!1,Y=null,pe=null,ae=null;return{setReversed:function(K){if(se!==K){let be=e.get("EXT_clip_control");K?be.clipControlEXT(be.LOWER_LEFT_EXT,be.ZERO_TO_ONE_EXT):be.clipControlEXT(be.LOWER_LEFT_EXT,be.NEGATIVE_ONE_TO_ONE_EXT),se=K;let Le=ae;ae=null,this.setClear(Le)}},getReversed:function(){return se},setTest:function(K){K?ne(n.DEPTH_TEST):we(n.DEPTH_TEST)},setMask:function(K){Y!==K&&!R&&(n.depthMask(K),Y=K)},setFunc:function(K){if(se&&(K=ih[K]),pe!==K){switch(K){case ar:n.depthFunc(n.NEVER);break;case or:n.depthFunc(n.ALWAYS);break;case lr:n.depthFunc(n.LESS);break;case ci:n.depthFunc(n.LEQUAL);break;case cr:n.depthFunc(n.EQUAL);break;case hr:n.depthFunc(n.GEQUAL);break;case ur:n.depthFunc(n.GREATER);break;case dr:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}pe=K}},setLocked:function(K){R=K},setClear:function(K){ae!==K&&(ae=K,se&&(K=1-K),n.clearDepth(K))},reset:function(){R=!1,Y=null,pe=null,ae=null,se=!1}}}function s(){let R=!1,se=null,Y=null,pe=null,ae=null,K=null,be=null,Le=null,ft=null;return{setTest:function(Qe){R||(Qe?ne(n.STENCIL_TEST):we(n.STENCIL_TEST))},setMask:function(Qe){se!==Qe&&!R&&(n.stencilMask(Qe),se=Qe)},setFunc:function(Qe,bn,rn){(Y!==Qe||pe!==bn||ae!==rn)&&(n.stencilFunc(Qe,bn,rn),Y=Qe,pe=bn,ae=rn)},setOp:function(Qe,bn,rn){(K!==Qe||be!==bn||Le!==rn)&&(n.stencilOp(Qe,bn,rn),K=Qe,be=bn,Le=rn)},setLocked:function(Qe){R=Qe},setClear:function(Qe){ft!==Qe&&(n.clearStencil(Qe),ft=Qe)},reset:function(){R=!1,se=null,Y=null,pe=null,ae=null,K=null,be=null,Le=null,ft=null}}}let r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap,d={},u={},h={},p=new WeakMap,m=[],x=null,g=!1,f=null,S=null,A=null,b=null,C=null,w=null,I=null,y=new Ge(0,0,0),E=0,L=!1,T=null,D=null,W=null,X=null,F=null,k=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,Q=0,ee=n.getParameter(n.VERSION);ee.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(ee)[1]),V=Q>=1):ee.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(ee)[1]),V=Q>=2);let oe=null,xe={},ye=n.getParameter(n.SCISSOR_BOX),Ve=n.getParameter(n.VIEWPORT),Xe=new lt().fromArray(ye),Te=new lt().fromArray(Ve);function j(R,se,Y,pe){let ae=new Uint8Array(4),K=n.createTexture();n.bindTexture(R,K),n.texParameteri(R,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(R,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let be=0;be<Y;be++)R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY?n.texImage3D(se,0,n.RGBA,1,1,pe,0,n.RGBA,n.UNSIGNED_BYTE,ae):n.texImage2D(se+be,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ae);return K}let ue={};ue[n.TEXTURE_2D]=j(n.TEXTURE_2D,n.TEXTURE_2D,1),ue[n.TEXTURE_CUBE_MAP]=j(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[n.TEXTURE_2D_ARRAY]=j(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ue[n.TEXTURE_3D]=j(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ne(n.DEPTH_TEST),a.setFunc(ci),ct(!1),Ke(wo),ne(n.CULL_FACE),je(_n);function ne(R){d[R]!==!0&&(n.enable(R),d[R]=!0)}function we(R){d[R]!==!1&&(n.disable(R),d[R]=!1)}function Ee(R,se){return h[R]!==se?(n.bindFramebuffer(R,se),h[R]=se,R===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=se),R===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=se),!0):!1}function Ae(R,se){let Y=m,pe=!1;if(R){Y=p.get(se),Y===void 0&&(Y=[],p.set(se,Y));let ae=R.textures;if(Y.length!==ae.length||Y[0]!==n.COLOR_ATTACHMENT0){for(let K=0,be=ae.length;K<be;K++)Y[K]=n.COLOR_ATTACHMENT0+K;Y.length=ae.length,pe=!0}}else Y[0]!==n.BACK&&(Y[0]=n.BACK,pe=!0);pe&&n.drawBuffers(Y)}function tt(R){return x!==R?(n.useProgram(R),x=R,!0):!1}let ke={[Wn]:n.FUNC_ADD,[Ec]:n.FUNC_SUBTRACT,[Tc]:n.FUNC_REVERSE_SUBTRACT};ke[Cc]=n.MIN,ke[Rc]=n.MAX;let Ze={[Ic]:n.ZERO,[Pc]:n.ONE,[Lc]:n.SRC_COLOR,[sr]:n.SRC_ALPHA,[Bc]:n.SRC_ALPHA_SATURATE,[Fc]:n.DST_COLOR,[Nc]:n.DST_ALPHA,[Dc]:n.ONE_MINUS_SRC_COLOR,[rr]:n.ONE_MINUS_SRC_ALPHA,[Oc]:n.ONE_MINUS_DST_COLOR,[Uc]:n.ONE_MINUS_DST_ALPHA,[kc]:n.CONSTANT_COLOR,[zc]:n.ONE_MINUS_CONSTANT_COLOR,[Gc]:n.CONSTANT_ALPHA,[Vc]:n.ONE_MINUS_CONSTANT_ALPHA};function je(R,se,Y,pe,ae,K,be,Le,ft,Qe){if(R===_n){g===!0&&(we(n.BLEND),g=!1);return}if(g===!1&&(ne(n.BLEND),g=!0),R!==wc){if(R!==f||Qe!==L){if((S!==Wn||C!==Wn)&&(n.blendEquation(n.FUNC_ADD),S=Wn,C=Wn),Qe)switch(R){case li:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Eo:n.blendFunc(n.ONE,n.ONE);break;case To:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Co:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Re("WebGLState: Invalid blending: ",R);break}else switch(R){case li:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Eo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case To:Re("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Co:Re("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Re("WebGLState: Invalid blending: ",R);break}A=null,b=null,w=null,I=null,y.set(0,0,0),E=0,f=R,L=Qe}return}ae=ae||se,K=K||Y,be=be||pe,(se!==S||ae!==C)&&(n.blendEquationSeparate(ke[se],ke[ae]),S=se,C=ae),(Y!==A||pe!==b||K!==w||be!==I)&&(n.blendFuncSeparate(Ze[Y],Ze[pe],Ze[K],Ze[be]),A=Y,b=pe,w=K,I=be),(Le.equals(y)===!1||ft!==E)&&(n.blendColor(Le.r,Le.g,Le.b,ft),y.copy(Le),E=ft),f=R,L=!1}function Oe(R,se){R.side===gn?we(n.CULL_FACE):ne(n.CULL_FACE);let Y=R.side===Dt;se&&(Y=!Y),ct(Y),R.blending===li&&R.transparent===!1?je(_n):je(R.blending,R.blendEquation,R.blendSrc,R.blendDst,R.blendEquationAlpha,R.blendSrcAlpha,R.blendDstAlpha,R.blendColor,R.blendAlpha,R.premultipliedAlpha),a.setFunc(R.depthFunc),a.setTest(R.depthTest),a.setMask(R.depthWrite),r.setMask(R.colorWrite);let pe=R.stencilWrite;o.setTest(pe),pe&&(o.setMask(R.stencilWriteMask),o.setFunc(R.stencilFunc,R.stencilRef,R.stencilFuncMask),o.setOp(R.stencilFail,R.stencilZFail,R.stencilZPass)),P(R.polygonOffset,R.polygonOffsetFactor,R.polygonOffsetUnits),R.alphaToCoverage===!0?ne(n.SAMPLE_ALPHA_TO_COVERAGE):we(n.SAMPLE_ALPHA_TO_COVERAGE)}function ct(R){T!==R&&(R?n.frontFace(n.CW):n.frontFace(n.CCW),T=R)}function Ke(R){R!==Sc?(ne(n.CULL_FACE),R!==D&&(R===wo?n.cullFace(n.BACK):R===Mc?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):we(n.CULL_FACE),D=R}function At(R){R!==W&&(V&&n.lineWidth(R),W=R)}function P(R,se,Y){R?(ne(n.POLYGON_OFFSET_FILL),(X!==se||F!==Y)&&(X=se,F=Y,a.getReversed()&&(se=-se),n.polygonOffset(se,Y))):we(n.POLYGON_OFFSET_FILL)}function ht(R){R?ne(n.SCISSOR_TEST):we(n.SCISSOR_TEST)}function Ue(R){R===void 0&&(R=n.TEXTURE0+k-1),oe!==R&&(n.activeTexture(R),oe=R)}function nt(R,se,Y){Y===void 0&&(oe===null?Y=n.TEXTURE0+k-1:Y=oe);let pe=xe[Y];pe===void 0&&(pe={type:void 0,texture:void 0},xe[Y]=pe),(pe.type!==R||pe.texture!==se)&&(oe!==Y&&(n.activeTexture(Y),oe=Y),n.bindTexture(R,se||ue[R]),pe.type=R,pe.texture=se)}function le(){let R=xe[oe];R!==void 0&&R.type!==void 0&&(n.bindTexture(R.type,null),R.type=void 0,R.texture=void 0)}function at(){try{n.compressedTexImage2D(...arguments)}catch(R){Re("WebGLState:",R)}}function M(){try{n.compressedTexImage3D(...arguments)}catch(R){Re("WebGLState:",R)}}function _(){try{n.texSubImage2D(...arguments)}catch(R){Re("WebGLState:",R)}}function O(){try{n.texSubImage3D(...arguments)}catch(R){Re("WebGLState:",R)}}function Z(){try{n.compressedTexSubImage2D(...arguments)}catch(R){Re("WebGLState:",R)}}function N(){try{n.compressedTexSubImage3D(...arguments)}catch(R){Re("WebGLState:",R)}}function H(){try{n.texStorage2D(...arguments)}catch(R){Re("WebGLState:",R)}}function te(){try{n.texStorage3D(...arguments)}catch(R){Re("WebGLState:",R)}}function $(){try{n.texImage2D(...arguments)}catch(R){Re("WebGLState:",R)}}function J(){try{n.texImage3D(...arguments)}catch(R){Re("WebGLState:",R)}}function ce(R){return u[R]!==void 0?u[R]:n.getParameter(R)}function ge(R,se){u[R]!==se&&(n.pixelStorei(R,se),u[R]=se)}function re(R){Xe.equals(R)===!1&&(n.scissor(R.x,R.y,R.z,R.w),Xe.copy(R))}function ie(R){Te.equals(R)===!1&&(n.viewport(R.x,R.y,R.z,R.w),Te.copy(R))}function Ie(R,se){let Y=c.get(se);Y===void 0&&(Y=new WeakMap,c.set(se,Y));let pe=Y.get(R);pe===void 0&&(pe=n.getUniformBlockIndex(se,R.name),Y.set(R,pe))}function Fe(R,se){let pe=c.get(se).get(R);l.get(se)!==pe&&(n.uniformBlockBinding(se,pe,R.__bindingPointIndex),l.set(se,pe))}function Ye(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),d={},u={},oe=null,xe={},h={},p=new WeakMap,m=[],x=null,g=!1,f=null,S=null,A=null,b=null,C=null,w=null,I=null,y=new Ge(0,0,0),E=0,L=!1,T=null,D=null,W=null,X=null,F=null,Xe.set(0,0,n.canvas.width,n.canvas.height),Te.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ne,disable:we,bindFramebuffer:Ee,drawBuffers:Ae,useProgram:tt,setBlending:je,setMaterial:Oe,setFlipSided:ct,setCullFace:Ke,setLineWidth:At,setPolygonOffset:P,setScissorTest:ht,activeTexture:Ue,bindTexture:nt,unbindTexture:le,compressedTexImage2D:at,compressedTexImage3D:M,texImage2D:$,texImage3D:J,pixelStorei:ge,getParameter:ce,updateUBOMapping:Ie,uniformBlockBinding:Fe,texStorage2D:H,texStorage3D:te,texSubImage2D:_,texSubImage3D:O,compressedTexSubImage2D:Z,compressedTexSubImage3D:N,scissor:re,viewport:ie,reset:Ye}}function Yg(n,e,t,i,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new $e,d=new WeakMap,u=new Set,h,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(M,_){return m?new OffscreenCanvas(M,_):Qi("canvas")}function g(M,_,O){let Z=1,N=at(M);if((N.width>O||N.height>O)&&(Z=O/Math.max(N.width,N.height)),Z<1)if(typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&M instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&M instanceof ImageBitmap||typeof VideoFrame<"u"&&M instanceof VideoFrame){let H=Math.floor(Z*N.width),te=Math.floor(Z*N.height);h===void 0&&(h=x(H,te));let $=_?x(H,te):h;return $.width=H,$.height=te,$.getContext("2d").drawImage(M,0,0,H,te),Ce("WebGLRenderer: Texture has been resized from ("+N.width+"x"+N.height+") to ("+H+"x"+te+")."),$}else return"data"in M&&Ce("WebGLRenderer: Image in DataTexture is too big ("+N.width+"x"+N.height+")."),M;return M}function f(M){return M.generateMipmaps}function S(M){n.generateMipmap(M)}function A(M){return M.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:M.isWebGL3DRenderTarget?n.TEXTURE_3D:M.isWebGLArrayRenderTarget||M.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function b(M,_,O,Z,N,H=!1){if(M!==null){if(n[M]!==void 0)return n[M];Ce("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+M+"'")}let te;Z&&(te=e.get("EXT_texture_norm16"),te||Ce("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=_;if(_===n.RED&&(O===n.FLOAT&&($=n.R32F),O===n.HALF_FLOAT&&($=n.R16F),O===n.UNSIGNED_BYTE&&($=n.R8),O===n.UNSIGNED_SHORT&&te&&($=te.R16_EXT),O===n.SHORT&&te&&($=te.R16_SNORM_EXT)),_===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.R8UI),O===n.UNSIGNED_SHORT&&($=n.R16UI),O===n.UNSIGNED_INT&&($=n.R32UI),O===n.BYTE&&($=n.R8I),O===n.SHORT&&($=n.R16I),O===n.INT&&($=n.R32I)),_===n.RG&&(O===n.FLOAT&&($=n.RG32F),O===n.HALF_FLOAT&&($=n.RG16F),O===n.UNSIGNED_BYTE&&($=n.RG8),O===n.UNSIGNED_SHORT&&te&&($=te.RG16_EXT),O===n.SHORT&&te&&($=te.RG16_SNORM_EXT)),_===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.RG8UI),O===n.UNSIGNED_SHORT&&($=n.RG16UI),O===n.UNSIGNED_INT&&($=n.RG32UI),O===n.BYTE&&($=n.RG8I),O===n.SHORT&&($=n.RG16I),O===n.INT&&($=n.RG32I)),_===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.RGB8UI),O===n.UNSIGNED_SHORT&&($=n.RGB16UI),O===n.UNSIGNED_INT&&($=n.RGB32UI),O===n.BYTE&&($=n.RGB8I),O===n.SHORT&&($=n.RGB16I),O===n.INT&&($=n.RGB32I)),_===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&($=n.RGBA8UI),O===n.UNSIGNED_SHORT&&($=n.RGBA16UI),O===n.UNSIGNED_INT&&($=n.RGBA32UI),O===n.BYTE&&($=n.RGBA8I),O===n.SHORT&&($=n.RGBA16I),O===n.INT&&($=n.RGBA32I)),_===n.RGB&&(O===n.UNSIGNED_SHORT&&te&&($=te.RGB16_EXT),O===n.SHORT&&te&&($=te.RGB16_SNORM_EXT),O===n.UNSIGNED_INT_5_9_9_9_REV&&($=n.RGB9_E5),O===n.UNSIGNED_INT_10F_11F_11F_REV&&($=n.R11F_G11F_B10F)),_===n.RGBA){let J=H?Ki:He.getTransfer(N);O===n.FLOAT&&($=n.RGBA32F),O===n.HALF_FLOAT&&($=n.RGBA16F),O===n.UNSIGNED_BYTE&&($=J===Je?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT&&te&&($=te.RGBA16_EXT),O===n.SHORT&&te&&($=te.RGBA16_SNORM_EXT),O===n.UNSIGNED_SHORT_4_4_4_4&&($=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&($=n.RGB5_A1)}return($===n.R16F||$===n.R32F||$===n.RG16F||$===n.RG32F||$===n.RGBA16F||$===n.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function C(M,_){let O;return M?_===null||_===nn||_===Oi?O=n.DEPTH24_STENCIL8:_===sn?O=n.DEPTH32F_STENCIL8:_===Fi&&(O=n.DEPTH24_STENCIL8,Ce("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===nn||_===Oi?O=n.DEPTH_COMPONENT24:_===sn?O=n.DEPTH_COMPONENT32F:_===Fi&&(O=n.DEPTH_COMPONENT16),O}function w(M,_){return f(M)===!0||M.isFramebufferTexture&&M.minFilter!==bt&&M.minFilter!==Mt?Math.log2(Math.max(_.width,_.height))+1:M.mipmaps!==void 0&&M.mipmaps.length>0?M.mipmaps.length:M.isCompressedTexture&&Array.isArray(M.image)?_.mipmaps.length:1}function I(M){let _=M.target;_.removeEventListener("dispose",I),E(_),_.isVideoTexture&&d.delete(_),_.isHTMLTexture&&u.delete(_)}function y(M){let _=M.target;_.removeEventListener("dispose",y),T(_)}function E(M){let _=i.get(M);if(_.__webglInit===void 0)return;let O=M.source,Z=p.get(O);if(Z){let N=Z[_.__cacheKey];N.usedTimes--,N.usedTimes===0&&L(M),Object.keys(Z).length===0&&p.delete(O)}i.remove(M)}function L(M){let _=i.get(M);n.deleteTexture(_.__webglTexture);let O=M.source,Z=p.get(O);delete Z[_.__cacheKey],a.memory.textures--}function T(M){let _=i.get(M);if(M.depthTexture&&(M.depthTexture.dispose(),i.remove(M.depthTexture)),M.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(_.__webglFramebuffer[Z]))for(let N=0;N<_.__webglFramebuffer[Z].length;N++)n.deleteFramebuffer(_.__webglFramebuffer[Z][N]);else n.deleteFramebuffer(_.__webglFramebuffer[Z]);_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer[Z])}else{if(Array.isArray(_.__webglFramebuffer))for(let Z=0;Z<_.__webglFramebuffer.length;Z++)n.deleteFramebuffer(_.__webglFramebuffer[Z]);else n.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&n.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let Z=0;Z<_.__webglColorRenderbuffer.length;Z++)_.__webglColorRenderbuffer[Z]&&n.deleteRenderbuffer(_.__webglColorRenderbuffer[Z]);_.__webglDepthRenderbuffer&&n.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let O=M.textures;for(let Z=0,N=O.length;Z<N;Z++){let H=i.get(O[Z]);H.__webglTexture&&(n.deleteTexture(H.__webglTexture),a.memory.textures--),i.remove(O[Z])}i.remove(M)}let D=0;function W(){D=0}function X(){return D}function F(M){D=M}function k(){let M=D;return M>=s.maxTextures&&Ce("WebGLTextures: Trying to use "+M+" texture units while this GPU supports only "+s.maxTextures),D+=1,M}function V(M){let _=[];return _.push(M.wrapS),_.push(M.wrapT),_.push(M.wrapR||0),_.push(M.magFilter),_.push(M.minFilter),_.push(M.anisotropy),_.push(M.internalFormat),_.push(M.format),_.push(M.type),_.push(M.generateMipmaps),_.push(M.premultiplyAlpha),_.push(M.flipY),_.push(M.unpackAlignment),_.push(M.colorSpace),_.join()}function Q(M,_){let O=i.get(M);if(M.isVideoTexture&&nt(M),M.isRenderTargetTexture===!1&&M.isExternalTexture!==!0&&M.version>0&&O.__version!==M.version){let Z=M.image;if(Z===null)Ce("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)Ce("WebGLRenderer: Texture marked for update but image is incomplete");else{we(O,M,_);return}}else M.isExternalTexture&&(O.__webglTexture=M.sourceTexture?M.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+_)}function ee(M,_){let O=i.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&O.__version!==M.version){we(O,M,_);return}else M.isExternalTexture&&(O.__webglTexture=M.sourceTexture?M.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+_)}function oe(M,_){let O=i.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&O.__version!==M.version){we(O,M,_);return}t.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+_)}function xe(M,_){let O=i.get(M);if(M.isCubeDepthTexture!==!0&&M.version>0&&O.__version!==M.version){Ee(O,M,_);return}t.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+_)}let ye={[fr]:n.REPEAT,[un]:n.CLAMP_TO_EDGE,[pr]:n.MIRRORED_REPEAT},Ve={[bt]:n.NEAREST,[Xc]:n.NEAREST_MIPMAP_NEAREST,[ys]:n.NEAREST_MIPMAP_LINEAR,[Mt]:n.LINEAR,[Vr]:n.LINEAR_MIPMAP_NEAREST,[Kn]:n.LINEAR_MIPMAP_LINEAR},Xe={[Yc]:n.NEVER,[Qc]:n.ALWAYS,[Zc]:n.LESS,[Ea]:n.LEQUAL,[Jc]:n.EQUAL,[Ta]:n.GEQUAL,[jc]:n.GREATER,[Kc]:n.NOTEQUAL};function Te(M,_){if(_.type===sn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Mt||_.magFilter===Vr||_.magFilter===ys||_.magFilter===Kn||_.minFilter===Mt||_.minFilter===Vr||_.minFilter===ys||_.minFilter===Kn)&&Ce("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(M,n.TEXTURE_WRAP_S,ye[_.wrapS]),n.texParameteri(M,n.TEXTURE_WRAP_T,ye[_.wrapT]),(M===n.TEXTURE_3D||M===n.TEXTURE_2D_ARRAY)&&n.texParameteri(M,n.TEXTURE_WRAP_R,ye[_.wrapR]),n.texParameteri(M,n.TEXTURE_MAG_FILTER,Ve[_.magFilter]),n.texParameteri(M,n.TEXTURE_MIN_FILTER,Ve[_.minFilter]),_.compareFunction&&(n.texParameteri(M,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(M,n.TEXTURE_COMPARE_FUNC,Xe[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===bt||_.minFilter!==ys&&_.minFilter!==Kn||_.type===sn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){let O=e.get("EXT_texture_filter_anisotropic");n.texParameterf(M,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function j(M,_){let O=!1;M.__webglInit===void 0&&(M.__webglInit=!0,_.addEventListener("dispose",I));let Z=_.source,N=p.get(Z);N===void 0&&(N={},p.set(Z,N));let H=V(_);if(H!==M.__cacheKey){N[H]===void 0&&(N[H]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,O=!0),N[H].usedTimes++;let te=N[M.__cacheKey];te!==void 0&&(N[M.__cacheKey].usedTimes--,te.usedTimes===0&&L(_)),M.__cacheKey=H,M.__webglTexture=N[H].texture}return O}function ue(M,_,O){return Math.floor(Math.floor(M/O)/_)}function ne(M,_,O,Z){let H=M.updateRanges;if(H.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,_.width,_.height,O,Z,_.data);else{H.sort((ge,re)=>ge.start-re.start);let te=0;for(let ge=1;ge<H.length;ge++){let re=H[te],ie=H[ge],Ie=re.start+re.count,Fe=ue(ie.start,_.width,4),Ye=ue(re.start,_.width,4);ie.start<=Ie+1&&Fe===Ye&&ue(ie.start+ie.count-1,_.width,4)===Fe?re.count=Math.max(re.count,ie.start+ie.count-re.start):(++te,H[te]=ie)}H.length=te+1;let $=t.getParameter(n.UNPACK_ROW_LENGTH),J=t.getParameter(n.UNPACK_SKIP_PIXELS),ce=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,_.width);for(let ge=0,re=H.length;ge<re;ge++){let ie=H[ge],Ie=Math.floor(ie.start/4),Fe=Math.ceil(ie.count/4),Ye=Ie%_.width,R=Math.floor(Ie/_.width),se=Fe,Y=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Ye),t.pixelStorei(n.UNPACK_SKIP_ROWS,R),t.texSubImage2D(n.TEXTURE_2D,0,Ye,R,se,Y,O,Z,_.data)}M.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,$),t.pixelStorei(n.UNPACK_SKIP_PIXELS,J),t.pixelStorei(n.UNPACK_SKIP_ROWS,ce)}}function we(M,_,O){let Z=n.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(Z=n.TEXTURE_2D_ARRAY),_.isData3DTexture&&(Z=n.TEXTURE_3D);let N=j(M,_),H=_.source;t.bindTexture(Z,M.__webglTexture,n.TEXTURE0+O);let te=i.get(H);if(H.version!==te.__version||N===!0){if(t.activeTexture(n.TEXTURE0+O),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let Y=He.getPrimaries(He.workingColorSpace),pe=_.colorSpace===Dn?null:He.getPrimaries(_.colorSpace),ae=_.colorSpace===Dn||Y===pe?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ae)}t.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment);let J=g(_.image,!1,s.maxTextureSize);J=le(_,J);let ce=r.convert(_.format,_.colorSpace),ge=r.convert(_.type),re=b(_.internalFormat,ce,ge,_.normalized,_.colorSpace,_.isVideoTexture);Te(Z,_);let ie,Ie=_.mipmaps,Fe=_.isVideoTexture!==!0,Ye=te.__version===void 0||N===!0,R=H.dataReady,se=w(_,J);if(_.isDepthTexture)re=C(_.format===Qn,_.type),Ye&&(Fe?t.texStorage2D(n.TEXTURE_2D,1,re,J.width,J.height):t.texImage2D(n.TEXTURE_2D,0,re,J.width,J.height,0,ce,ge,null));else if(_.isDataTexture)if(Ie.length>0){Fe&&Ye&&t.texStorage2D(n.TEXTURE_2D,se,re,Ie[0].width,Ie[0].height);for(let Y=0,pe=Ie.length;Y<pe;Y++)ie=Ie[Y],Fe?R&&t.texSubImage2D(n.TEXTURE_2D,Y,0,0,ie.width,ie.height,ce,ge,ie.data):t.texImage2D(n.TEXTURE_2D,Y,re,ie.width,ie.height,0,ce,ge,ie.data);_.generateMipmaps=!1}else Fe?(Ye&&t.texStorage2D(n.TEXTURE_2D,se,re,J.width,J.height),R&&ne(_,J,ce,ge)):t.texImage2D(n.TEXTURE_2D,0,re,J.width,J.height,0,ce,ge,J.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Fe&&Ye&&t.texStorage3D(n.TEXTURE_2D_ARRAY,se,re,Ie[0].width,Ie[0].height,J.depth);for(let Y=0,pe=Ie.length;Y<pe;Y++)if(ie=Ie[Y],_.format!==Jt)if(ce!==null)if(Fe){if(R)if(_.layerUpdates.size>0){let ae=Jo(ie.width,ie.height,_.format,_.type);for(let K of _.layerUpdates){let be=ie.data.subarray(K*ae/ie.data.BYTES_PER_ELEMENT,(K+1)*ae/ie.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Y,0,0,K,ie.width,ie.height,1,ce,be)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Y,0,0,0,ie.width,ie.height,J.depth,ce,ie.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Y,re,ie.width,ie.height,J.depth,0,ie.data,0,0);else Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Fe?R&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Y,0,0,0,ie.width,ie.height,J.depth,ce,ge,ie.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Y,re,ie.width,ie.height,J.depth,0,ce,ge,ie.data)}else{Fe&&Ye&&t.texStorage2D(n.TEXTURE_2D,se,re,Ie[0].width,Ie[0].height);for(let Y=0,pe=Ie.length;Y<pe;Y++)ie=Ie[Y],_.format!==Jt?ce!==null?Fe?R&&t.compressedTexSubImage2D(n.TEXTURE_2D,Y,0,0,ie.width,ie.height,ce,ie.data):t.compressedTexImage2D(n.TEXTURE_2D,Y,re,ie.width,ie.height,0,ie.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Fe?R&&t.texSubImage2D(n.TEXTURE_2D,Y,0,0,ie.width,ie.height,ce,ge,ie.data):t.texImage2D(n.TEXTURE_2D,Y,re,ie.width,ie.height,0,ce,ge,ie.data)}else if(_.isDataArrayTexture)if(Fe){if(Ye&&t.texStorage3D(n.TEXTURE_2D_ARRAY,se,re,J.width,J.height,J.depth),R)if(_.layerUpdates.size>0){let Y=Jo(J.width,J.height,_.format,_.type);for(let pe of _.layerUpdates){let ae=J.data.subarray(pe*Y/J.data.BYTES_PER_ELEMENT,(pe+1)*Y/J.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,pe,J.width,J.height,1,ce,ge,ae)}_.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,ce,ge,J.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,re,J.width,J.height,J.depth,0,ce,ge,J.data);else if(_.isData3DTexture)Fe?(Ye&&t.texStorage3D(n.TEXTURE_3D,se,re,J.width,J.height,J.depth),R&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,ce,ge,J.data)):t.texImage3D(n.TEXTURE_3D,0,re,J.width,J.height,J.depth,0,ce,ge,J.data);else if(_.isFramebufferTexture){if(Ye)if(Fe)t.texStorage2D(n.TEXTURE_2D,se,re,J.width,J.height);else{let Y=J.width,pe=J.height;for(let ae=0;ae<se;ae++)t.texImage2D(n.TEXTURE_2D,ae,re,Y,pe,0,ce,ge,null),Y>>=1,pe>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in n){let Y=n.canvas;if(Y.hasAttribute("layoutsubtree")||Y.setAttribute("layoutsubtree","true"),J.parentNode!==Y){Y.appendChild(J),u.add(_),Y.onpaint=Le=>{let ft=Le.changedElements;for(let Qe of u)ft.includes(Qe.image)&&(Qe.needsUpdate=!0)},Y.requestPaint();return}let pe=0,ae=n.RGBA,K=n.RGBA,be=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,pe,ae,K,be,J),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Ie.length>0){if(Fe&&Ye){let Y=at(Ie[0]);t.texStorage2D(n.TEXTURE_2D,se,re,Y.width,Y.height)}for(let Y=0,pe=Ie.length;Y<pe;Y++)ie=Ie[Y],Fe?R&&t.texSubImage2D(n.TEXTURE_2D,Y,0,0,ce,ge,ie):t.texImage2D(n.TEXTURE_2D,Y,re,ce,ge,ie);_.generateMipmaps=!1}else if(Fe){if(Ye){let Y=at(J);t.texStorage2D(n.TEXTURE_2D,se,re,Y.width,Y.height)}R&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ce,ge,J)}else t.texImage2D(n.TEXTURE_2D,0,re,ce,ge,J);f(_)&&S(Z),te.__version=H.version,_.onUpdate&&_.onUpdate(_)}M.__version=_.version}function Ee(M,_,O){if(_.image.length!==6)return;let Z=j(M,_),N=_.source;t.bindTexture(n.TEXTURE_CUBE_MAP,M.__webglTexture,n.TEXTURE0+O);let H=i.get(N);if(N.version!==H.__version||Z===!0){t.activeTexture(n.TEXTURE0+O);let te=He.getPrimaries(He.workingColorSpace),$=_.colorSpace===Dn?null:He.getPrimaries(_.colorSpace),J=_.colorSpace===Dn||te===$?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,J);let ce=_.isCompressedTexture||_.image[0].isCompressedTexture,ge=_.image[0]&&_.image[0].isDataTexture,re=[];for(let K=0;K<6;K++)!ce&&!ge?re[K]=g(_.image[K],!0,s.maxCubemapSize):re[K]=ge?_.image[K].image:_.image[K],re[K]=le(_,re[K]);let ie=re[0],Ie=r.convert(_.format,_.colorSpace),Fe=r.convert(_.type),Ye=b(_.internalFormat,Ie,Fe,_.normalized,_.colorSpace),R=_.isVideoTexture!==!0,se=H.__version===void 0||Z===!0,Y=N.dataReady,pe=w(_,ie);Te(n.TEXTURE_CUBE_MAP,_);let ae;if(ce){R&&se&&t.texStorage2D(n.TEXTURE_CUBE_MAP,pe,Ye,ie.width,ie.height);for(let K=0;K<6;K++){ae=re[K].mipmaps;for(let be=0;be<ae.length;be++){let Le=ae[be];_.format!==Jt?Ie!==null?R?Y&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,be,0,0,Le.width,Le.height,Ie,Le.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,be,Ye,Le.width,Le.height,0,Le.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):R?Y&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,be,0,0,Le.width,Le.height,Ie,Fe,Le.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,be,Ye,Le.width,Le.height,0,Ie,Fe,Le.data)}}}else{if(ae=_.mipmaps,R&&se){ae.length>0&&pe++;let K=at(re[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,pe,Ye,K.width,K.height)}for(let K=0;K<6;K++)if(ge){R?Y&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,re[K].width,re[K].height,Ie,Fe,re[K].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ye,re[K].width,re[K].height,0,Ie,Fe,re[K].data);for(let be=0;be<ae.length;be++){let ft=ae[be].image[K].image;R?Y&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,be+1,0,0,ft.width,ft.height,Ie,Fe,ft.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,be+1,Ye,ft.width,ft.height,0,Ie,Fe,ft.data)}}else{R?Y&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Ie,Fe,re[K]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ye,Ie,Fe,re[K]);for(let be=0;be<ae.length;be++){let Le=ae[be];R?Y&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,be+1,0,0,Ie,Fe,Le.image[K]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,be+1,Ye,Ie,Fe,Le.image[K])}}}f(_)&&S(n.TEXTURE_CUBE_MAP),H.__version=N.version,_.onUpdate&&_.onUpdate(_)}M.__version=_.version}function Ae(M,_,O,Z,N,H){let te=r.convert(O.format,O.colorSpace),$=r.convert(O.type),J=b(O.internalFormat,te,$,O.normalized,O.colorSpace),ce=i.get(_),ge=i.get(O);if(ge.__renderTarget=_,!ce.__hasExternalTextures){let re=Math.max(1,_.width>>H),ie=Math.max(1,_.height>>H);N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?t.texImage3D(N,H,J,re,ie,_.depth,0,te,$,null):t.texImage2D(N,H,J,re,ie,0,te,$,null)}t.bindFramebuffer(n.FRAMEBUFFER,M),Ue(_)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,N,ge.__webglTexture,0,ht(_)):(N===n.TEXTURE_2D||N>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&N<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Z,N,ge.__webglTexture,H),t.bindFramebuffer(n.FRAMEBUFFER,null)}function tt(M,_,O){if(n.bindRenderbuffer(n.RENDERBUFFER,M),_.depthBuffer){let Z=_.depthTexture,N=Z&&Z.isDepthTexture?Z.type:null,H=C(_.stencilBuffer,N),te=_.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Ue(_)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ht(_),H,_.width,_.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,ht(_),H,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,H,_.width,_.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,M)}else{let Z=_.textures;for(let N=0;N<Z.length;N++){let H=Z[N],te=r.convert(H.format,H.colorSpace),$=r.convert(H.type),J=b(H.internalFormat,te,$,H.normalized,H.colorSpace);Ue(_)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ht(_),J,_.width,_.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,ht(_),J,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,J,_.width,_.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ke(M,_,O){let Z=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,M),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let N=i.get(_.depthTexture);if(N.__renderTarget=_,(!N.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),Z){if(N.__webglInit===void 0&&(N.__webglInit=!0,_.depthTexture.addEventListener("dispose",I)),N.__webglTexture===void 0){N.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,N.__webglTexture),Te(n.TEXTURE_CUBE_MAP,_.depthTexture);let ce=r.convert(_.depthTexture.format),ge=r.convert(_.depthTexture.type),re;_.depthTexture.format===dn?re=n.DEPTH_COMPONENT24:_.depthTexture.format===Qn&&(re=n.DEPTH24_STENCIL8);for(let ie=0;ie<6;ie++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,re,_.width,_.height,0,ce,ge,null)}}else Q(_.depthTexture,0);let H=N.__webglTexture,te=ht(_),$=Z?n.TEXTURE_CUBE_MAP_POSITIVE_X+O:n.TEXTURE_2D,J=_.depthTexture.format===Qn?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(_.depthTexture.format===dn)Ue(_)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,J,$,H,0,te):n.framebufferTexture2D(n.FRAMEBUFFER,J,$,H,0);else if(_.depthTexture.format===Qn)Ue(_)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,J,$,H,0,te):n.framebufferTexture2D(n.FRAMEBUFFER,J,$,H,0);else throw new Error("Unknown depthTexture format")}function Ze(M){let _=i.get(M),O=M.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==M.depthTexture){let Z=M.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),Z){let N=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,Z.removeEventListener("dispose",N)};Z.addEventListener("dispose",N),_.__depthDisposeCallback=N}_.__boundDepthTexture=Z}if(M.depthTexture&&!_.__autoAllocateDepthBuffer)if(O)for(let Z=0;Z<6;Z++)ke(_.__webglFramebuffer[Z],M,Z);else{let Z=M.texture.mipmaps;Z&&Z.length>0?ke(_.__webglFramebuffer[0],M,0):ke(_.__webglFramebuffer,M,0)}else if(O){_.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[Z]),_.__webglDepthbuffer[Z]===void 0)_.__webglDepthbuffer[Z]=n.createRenderbuffer(),tt(_.__webglDepthbuffer[Z],M,!1);else{let N=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,H=_.__webglDepthbuffer[Z];n.bindRenderbuffer(n.RENDERBUFFER,H),n.framebufferRenderbuffer(n.FRAMEBUFFER,N,n.RENDERBUFFER,H)}}else{let Z=M.texture.mipmaps;if(Z&&Z.length>0?t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=n.createRenderbuffer(),tt(_.__webglDepthbuffer,M,!1);else{let N=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,H=_.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,H),n.framebufferRenderbuffer(n.FRAMEBUFFER,N,n.RENDERBUFFER,H)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function je(M,_,O){let Z=i.get(M);_!==void 0&&Ae(Z.__webglFramebuffer,M,M.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Ze(M)}function Oe(M){let _=M.texture,O=i.get(M),Z=i.get(_);M.addEventListener("dispose",y);let N=M.textures,H=M.isWebGLCubeRenderTarget===!0,te=N.length>1;if(te||(Z.__webglTexture===void 0&&(Z.__webglTexture=n.createTexture()),Z.__version=_.version,a.memory.textures++),H){O.__webglFramebuffer=[];for(let $=0;$<6;$++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[$]=[];for(let J=0;J<_.mipmaps.length;J++)O.__webglFramebuffer[$][J]=n.createFramebuffer()}else O.__webglFramebuffer[$]=n.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let $=0;$<_.mipmaps.length;$++)O.__webglFramebuffer[$]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(te)for(let $=0,J=N.length;$<J;$++){let ce=i.get(N[$]);ce.__webglTexture===void 0&&(ce.__webglTexture=n.createTexture(),a.memory.textures++)}if(M.samples>0&&Ue(M)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let $=0;$<N.length;$++){let J=N[$];O.__webglColorRenderbuffer[$]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[$]);let ce=r.convert(J.format,J.colorSpace),ge=r.convert(J.type),re=b(J.internalFormat,ce,ge,J.normalized,J.colorSpace,M.isXRRenderTarget===!0),ie=ht(M);n.renderbufferStorageMultisample(n.RENDERBUFFER,ie,re,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+$,n.RENDERBUFFER,O.__webglColorRenderbuffer[$])}n.bindRenderbuffer(n.RENDERBUFFER,null),M.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),tt(O.__webglDepthRenderbuffer,M,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(H){t.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),Te(n.TEXTURE_CUBE_MAP,_);for(let $=0;$<6;$++)if(_.mipmaps&&_.mipmaps.length>0)for(let J=0;J<_.mipmaps.length;J++)Ae(O.__webglFramebuffer[$][J],M,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+$,J);else Ae(O.__webglFramebuffer[$],M,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);f(_)&&S(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(te){for(let $=0,J=N.length;$<J;$++){let ce=N[$],ge=i.get(ce),re=n.TEXTURE_2D;(M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(re=M.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(re,ge.__webglTexture),Te(re,ce),Ae(O.__webglFramebuffer,M,ce,n.COLOR_ATTACHMENT0+$,re,0),f(ce)&&S(re)}t.unbindTexture()}else{let $=n.TEXTURE_2D;if((M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&($=M.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture($,Z.__webglTexture),Te($,_),_.mipmaps&&_.mipmaps.length>0)for(let J=0;J<_.mipmaps.length;J++)Ae(O.__webglFramebuffer[J],M,_,n.COLOR_ATTACHMENT0,$,J);else Ae(O.__webglFramebuffer,M,_,n.COLOR_ATTACHMENT0,$,0);f(_)&&S($),t.unbindTexture()}M.depthBuffer&&Ze(M)}function ct(M){let _=M.textures;for(let O=0,Z=_.length;O<Z;O++){let N=_[O];if(f(N)){let H=A(M),te=i.get(N).__webglTexture;t.bindTexture(H,te),S(H),t.unbindTexture()}}}let Ke=[],At=[];function P(M){if(M.samples>0){if(Ue(M)===!1){let _=M.textures,O=M.width,Z=M.height,N=n.COLOR_BUFFER_BIT,H=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,te=i.get(M),$=_.length>1;if($)for(let ce=0;ce<_.length;ce++)t.bindFramebuffer(n.FRAMEBUFFER,te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ce,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ce,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,te.__webglMultisampledFramebuffer);let J=M.texture.mipmaps;J&&J.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,te.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,te.__webglFramebuffer);for(let ce=0;ce<_.length;ce++){if(M.resolveDepthBuffer&&(M.depthBuffer&&(N|=n.DEPTH_BUFFER_BIT),M.stencilBuffer&&M.resolveStencilBuffer&&(N|=n.STENCIL_BUFFER_BIT)),$){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,te.__webglColorRenderbuffer[ce]);let ge=i.get(_[ce]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ge,0)}n.blitFramebuffer(0,0,O,Z,0,0,O,Z,N,n.NEAREST),l===!0&&(Ke.length=0,At.length=0,Ke.push(n.COLOR_ATTACHMENT0+ce),M.depthBuffer&&M.resolveDepthBuffer===!1&&(Ke.push(H),At.push(H),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,At)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ke))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),$)for(let ce=0;ce<_.length;ce++){t.bindFramebuffer(n.FRAMEBUFFER,te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ce,n.RENDERBUFFER,te.__webglColorRenderbuffer[ce]);let ge=i.get(_[ce]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ce,n.TEXTURE_2D,ge,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,te.__webglMultisampledFramebuffer)}else if(M.depthBuffer&&M.resolveDepthBuffer===!1&&l){let _=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[_])}}}function ht(M){return Math.min(s.maxSamples,M.samples)}function Ue(M){let _=i.get(M);return M.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function nt(M){let _=a.render.frame;d.get(M)!==_&&(d.set(M,_),M.update())}function le(M,_){let O=M.colorSpace,Z=M.format,N=M.type;return M.isCompressedTexture===!0||M.isVideoTexture===!0||O!==ji&&O!==Dn&&(He.getTransfer(O)===Je?(Z!==Jt||N!==Ot)&&Ce("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Re("WebGLTextures: Unsupported texture color space:",O)),_}function at(M){return typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement?(c.width=M.naturalWidth||M.width,c.height=M.naturalHeight||M.height):typeof VideoFrame<"u"&&M instanceof VideoFrame?(c.width=M.displayWidth,c.height=M.displayHeight):(c.width=M.width,c.height=M.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=W,this.getTextureUnits=X,this.setTextureUnits=F,this.setTexture2D=Q,this.setTexture2DArray=ee,this.setTexture3D=oe,this.setTextureCube=xe,this.rebindTextures=je,this.setupRenderTarget=Oe,this.updateRenderTargetMipmap=ct,this.updateMultisampleRenderTarget=P,this.setupDepthRenderbuffer=Ze,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=Ue,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Zg(n,e){function t(i,s=Dn){let r,a=He.getTransfer(s);if(i===Ot)return n.UNSIGNED_BYTE;if(i===Wr)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Xr)return n.UNSIGNED_SHORT_5_5_5_1;if(i===zo)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Go)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Bo)return n.BYTE;if(i===ko)return n.SHORT;if(i===Fi)return n.UNSIGNED_SHORT;if(i===Hr)return n.INT;if(i===nn)return n.UNSIGNED_INT;if(i===sn)return n.FLOAT;if(i===xn)return n.HALF_FLOAT;if(i===Vo)return n.ALPHA;if(i===Ho)return n.RGB;if(i===Jt)return n.RGBA;if(i===dn)return n.DEPTH_COMPONENT;if(i===Qn)return n.DEPTH_STENCIL;if(i===Wo)return n.RED;if(i===qr)return n.RED_INTEGER;if(i===ei)return n.RG;if(i===$r)return n.RG_INTEGER;if(i===Yr)return n.RGBA_INTEGER;if(i===vs||i===bs||i===Ss||i===Ms)if(a===Je)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===vs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===bs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ss)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ms)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===vs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===bs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ss)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ms)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Zr||i===Jr||i===jr||i===Kr)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Zr)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Jr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===jr)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Kr)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Qr||i===ea||i===ta||i===na||i===ia||i===As||i===sa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Qr||i===ea)return a===Je?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===ta)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===na)return r.COMPRESSED_R11_EAC;if(i===ia)return r.COMPRESSED_SIGNED_R11_EAC;if(i===As)return r.COMPRESSED_RG11_EAC;if(i===sa)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===ra||i===aa||i===oa||i===la||i===ca||i===ha||i===ua||i===da||i===fa||i===pa||i===ma||i===ga||i===_a||i===xa)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===ra)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===aa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===oa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===la)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ca)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ha)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ua)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===da)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===fa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===pa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ma)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ga)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===_a)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===xa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ya||i===va||i===ba)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===ya)return a===Je?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===va)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ba)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Sa||i===Ma||i===ws||i===Aa)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Sa)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ma)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ws)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Aa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Oi?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var Jg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,jg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,hl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new ls(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Wt({vertexShader:Jg,fragmentShader:jg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new It(new hs(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},ul=class extends fn{constructor(e,t){super();let i=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,d=null,u=null,h=null,p=null,m=null,x=typeof XRWebGLBinding<"u",g=new hl,f={},S=t.getContextAttributes(),A=null,b=null,C=[],w=[],I=new $e,y=null,E=new Ft;E.viewport=new lt;let L=new Ft;L.viewport=new lt;let T=[E,L],D=new Br,W=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let ue=C[j];return ue===void 0&&(ue=new Pi,C[j]=ue),ue.getTargetRaySpace()},this.getControllerGrip=function(j){let ue=C[j];return ue===void 0&&(ue=new Pi,C[j]=ue),ue.getGripSpace()},this.getHand=function(j){let ue=C[j];return ue===void 0&&(ue=new Pi,C[j]=ue),ue.getHandSpace()};function F(j){let ue=w.indexOf(j.inputSource);if(ue===-1)return;let ne=C[ue];ne!==void 0&&(ne.update(j.inputSource,j.frame,c||a),ne.dispatchEvent({type:j.type,data:j.inputSource}))}function k(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",V);for(let j=0;j<C.length;j++){let ue=w[j];ue!==null&&(w[j]=null,C[j].disconnect(ue))}W=null,X=null,g.reset();for(let j in f)delete f[j];e.setRenderTarget(A),p=null,h=null,u=null,s=null,b=null,Te.stop(),i.isPresenting=!1,e.setPixelRatio(y),e.setSize(I.width,I.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,i.isPresenting===!0&&Ce("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,i.isPresenting===!0&&Ce("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(A=e.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",k),s.addEventListener("inputsourceschange",V),S.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(I),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let ne=null,we=null,Ee=null;S.depth&&(Ee=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ne=S.stencil?Qn:dn,we=S.stencil?Oi:nn);let Ae={colorFormat:t.RGBA8,depthFormat:Ee,scaleFactor:r};u=this.getBinding(),h=u.createProjectionLayer(Ae),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),b=new Ht(h.textureWidth,h.textureHeight,{format:Jt,type:Ot,depthTexture:new Ln(h.textureWidth,h.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{let ne={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,ne),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),b=new Ht(p.framebufferWidth,p.framebufferHeight,{format:Jt,type:Ot,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Te.setContext(s),Te.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function V(j){for(let ue=0;ue<j.removed.length;ue++){let ne=j.removed[ue],we=w.indexOf(ne);we>=0&&(w[we]=null,C[we].disconnect(ne))}for(let ue=0;ue<j.added.length;ue++){let ne=j.added[ue],we=w.indexOf(ne);if(we===-1){for(let Ae=0;Ae<C.length;Ae++)if(Ae>=w.length){w.push(ne),we=Ae;break}else if(w[Ae]===null){w[Ae]=ne,we=Ae;break}if(we===-1)break}let Ee=C[we];Ee&&Ee.connect(ne)}}let Q=new B,ee=new B;function oe(j,ue,ne){Q.setFromMatrixPosition(ue.matrixWorld),ee.setFromMatrixPosition(ne.matrixWorld);let we=Q.distanceTo(ee),Ee=ue.projectionMatrix.elements,Ae=ne.projectionMatrix.elements,tt=Ee[14]/(Ee[10]-1),ke=Ee[14]/(Ee[10]+1),Ze=(Ee[9]+1)/Ee[5],je=(Ee[9]-1)/Ee[5],Oe=(Ee[8]-1)/Ee[0],ct=(Ae[8]+1)/Ae[0],Ke=tt*Oe,At=tt*ct,P=we/(-Oe+ct),ht=P*-Oe;if(ue.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(ht),j.translateZ(P),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Ee[10]===-1)j.projectionMatrix.copy(ue.projectionMatrix),j.projectionMatrixInverse.copy(ue.projectionMatrixInverse);else{let Ue=tt+P,nt=ke+P,le=Ke-ht,at=At+(we-ht),M=Ze*ke/nt*Ue,_=je*ke/nt*Ue;j.projectionMatrix.makePerspective(le,at,M,_,Ue,nt),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function xe(j,ue){ue===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(ue.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let ue=j.near,ne=j.far;g.texture!==null&&(g.depthNear>0&&(ue=g.depthNear),g.depthFar>0&&(ne=g.depthFar)),D.near=L.near=E.near=ue,D.far=L.far=E.far=ne,(W!==D.near||X!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),W=D.near,X=D.far),D.layers.mask=j.layers.mask|6,E.layers.mask=D.layers.mask&-5,L.layers.mask=D.layers.mask&-3;let we=j.parent,Ee=D.cameras;xe(D,we);for(let Ae=0;Ae<Ee.length;Ae++)xe(Ee[Ae],we);Ee.length===2?oe(D,E,L):D.projectionMatrix.copy(E.projectionMatrix),ye(j,D,we)};function ye(j,ue,ne){ne===null?j.matrix.copy(ue.matrixWorld):(j.matrix.copy(ne.matrixWorld),j.matrix.invert(),j.matrix.multiply(ue.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(ue.projectionMatrix),j.projectionMatrixInverse.copy(ue.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=_r*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(h===null&&p===null))return l},this.setFoveation=function(j){l=j,h!==null&&(h.fixedFoveation=j),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=j)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(D)},this.getCameraTexture=function(j){return f[j]};let Ve=null;function Xe(j,ue){if(d=ue.getViewerPose(c||a),m=ue,d!==null){let ne=d.views;p!==null&&(e.setRenderTargetFramebuffer(b,p.framebuffer),e.setRenderTarget(b));let we=!1;ne.length!==D.cameras.length&&(D.cameras.length=0,we=!0);for(let ke=0;ke<ne.length;ke++){let Ze=ne[ke],je=null;if(p!==null)je=p.getViewport(Ze);else{let ct=u.getViewSubImage(h,Ze);je=ct.viewport,ke===0&&(e.setRenderTargetTextures(b,ct.colorTexture,ct.depthStencilTexture),e.setRenderTarget(b))}let Oe=T[ke];Oe===void 0&&(Oe=new Ft,Oe.layers.enable(ke),Oe.viewport=new lt,T[ke]=Oe),Oe.matrix.fromArray(Ze.transform.matrix),Oe.matrix.decompose(Oe.position,Oe.quaternion,Oe.scale),Oe.projectionMatrix.fromArray(Ze.projectionMatrix),Oe.projectionMatrixInverse.copy(Oe.projectionMatrix).invert(),Oe.viewport.set(je.x,je.y,je.width,je.height),ke===0&&(D.matrix.copy(Oe.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),we===!0&&D.cameras.push(Oe)}let Ee=s.enabledFeatures;if(Ee&&Ee.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=i.getBinding();let ke=u.getDepthInformation(ne[0]);ke&&ke.isValid&&ke.texture&&g.init(ke,s.renderState)}if(Ee&&Ee.includes("camera-access")&&x){e.state.unbindTexture(),u=i.getBinding();for(let ke=0;ke<ne.length;ke++){let Ze=ne[ke].camera;if(Ze){let je=f[Ze];je||(je=new ls,f[Ze]=je);let Oe=u.getCameraImage(Ze);je.sourceTexture=Oe}}}}for(let ne=0;ne<C.length;ne++){let we=w[ne],Ee=C[ne];we!==null&&Ee!==void 0&&Ee.update(we,ue,c||a)}Ve&&Ve(j,ue),ue.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ue}),m=null}let Te=new Rh;Te.setAnimationLoop(Xe),this.setAnimationLoop=function(j){Ve=j},this.dispose=function(){}}},Kg=new dt,Uh=new Pe;Uh.set(-1,0,0,0,1,0,0,0,1);function Qg(n,e){function t(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function i(g,f){f.color.getRGB(g.fogColor.value,$o(n)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function s(g,f,S,A,b){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?r(g,f):f.isMeshLambertMaterial?(r(g,f),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(r(g,f),u(g,f)):f.isMeshPhongMaterial?(r(g,f),d(g,f),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(r(g,f),h(g,f),f.isMeshPhysicalMaterial&&p(g,f,b)):f.isMeshMatcapMaterial?(r(g,f),m(g,f)):f.isMeshDepthMaterial?r(g,f):f.isMeshDistanceMaterial?(r(g,f),x(g,f)):f.isMeshNormalMaterial?r(g,f):f.isLineBasicMaterial?(a(g,f),f.isLineDashedMaterial&&o(g,f)):f.isPointsMaterial?l(g,f,S,A):f.isSpriteMaterial?c(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,t(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===Dt&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,t(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===Dt&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,t(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,t(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);let S=e.get(f),A=S.envMap,b=S.envMapRotation;A&&(g.envMap.value=A,g.envMapRotation.value.setFromMatrix4(Kg.makeRotationFromEuler(b)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Uh),g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,g.aoMapTransform))}function a(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform))}function o(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function l(g,f,S,A){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*S,g.scale.value=A*.5,f.map&&(g.map.value=f.map,t(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function c(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function d(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function u(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function h(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function p(g,f,S){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Dt&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=S.texture,g.transmissionSamplerSize.value.set(S.width,S.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,f){f.matcap&&(g.matcap.value=f.matcap)}function x(g,f){let S=e.get(f).light;g.referencePosition.value.setFromMatrixPosition(S.matrixWorld),g.nearDistance.value=S.shadow.camera.near,g.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function e0(n,e,t,i){let s={},r={},a=[],o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,A){let b=A.program;i.uniformBlockBinding(S,b)}function c(S,A){let b=s[S.id];b===void 0&&(m(S),b=d(S),s[S.id]=b,S.addEventListener("dispose",g));let C=A.program;i.updateUBOMapping(S,C);let w=e.render.frame;r[S.id]!==w&&(h(S),r[S.id]=w)}function d(S){let A=u();S.__bindingPointIndex=A;let b=n.createBuffer(),C=S.__size,w=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,C,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,A,b),b}function u(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return Re("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(S){let A=s[S.id],b=S.uniforms,C=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,A);for(let w=0,I=b.length;w<I;w++){let y=Array.isArray(b[w])?b[w]:[b[w]];for(let E=0,L=y.length;E<L;E++){let T=y[E];if(p(T,w,E,C)===!0){let D=T.__offset,W=Array.isArray(T.value)?T.value:[T.value],X=0;for(let F=0;F<W.length;F++){let k=W[F],V=x(k);typeof k=="number"||typeof k=="boolean"?(T.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,D+X,T.__data)):k.isMatrix3?(T.__data[0]=k.elements[0],T.__data[1]=k.elements[1],T.__data[2]=k.elements[2],T.__data[3]=0,T.__data[4]=k.elements[3],T.__data[5]=k.elements[4],T.__data[6]=k.elements[5],T.__data[7]=0,T.__data[8]=k.elements[6],T.__data[9]=k.elements[7],T.__data[10]=k.elements[8],T.__data[11]=0):ArrayBuffer.isView(k)?T.__data.set(new k.constructor(k.buffer,k.byteOffset,T.__data.length)):(k.toArray(T.__data,X),X+=V.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,D,T.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(S,A,b,C){let w=S.value,I=A+"_"+b;if(C[I]===void 0)return typeof w=="number"||typeof w=="boolean"?C[I]=w:ArrayBuffer.isView(w)?C[I]=w.slice():C[I]=w.clone(),!0;{let y=C[I];if(typeof w=="number"||typeof w=="boolean"){if(y!==w)return C[I]=w,!0}else{if(ArrayBuffer.isView(w))return!0;if(y.equals(w)===!1)return y.copy(w),!0}}return!1}function m(S){let A=S.uniforms,b=0,C=16;for(let I=0,y=A.length;I<y;I++){let E=Array.isArray(A[I])?A[I]:[A[I]];for(let L=0,T=E.length;L<T;L++){let D=E[L],W=Array.isArray(D.value)?D.value:[D.value];for(let X=0,F=W.length;X<F;X++){let k=W[X],V=x(k),Q=b%C,ee=Q%V.boundary,oe=Q+ee;b+=ee,oe!==0&&C-oe<V.storage&&(b+=C-oe),D.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=b,b+=V.storage}}}let w=b%C;return w>0&&(b+=C-w),S.__size=b,S.__cache={},this}function x(S){let A={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(A.boundary=4,A.storage=4):S.isVector2?(A.boundary=8,A.storage=8):S.isVector3||S.isColor?(A.boundary=16,A.storage=12):S.isVector4?(A.boundary=16,A.storage=16):S.isMatrix3?(A.boundary=48,A.storage=48):S.isMatrix4?(A.boundary=64,A.storage=64):S.isTexture?Ce("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(A.boundary=16,A.storage=S.byteLength):Ce("WebGLRenderer: Unsupported uniform value type.",S),A}function g(S){let A=S.target;A.removeEventListener("dispose",g);let b=a.indexOf(A.__bindingPointIndex);a.splice(b,1),n.deleteBuffer(s[A.id]),delete s[A.id],delete r[A.id]}function f(){for(let S in s)n.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:l,update:c,dispose:f}}var t0=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),yn=null;function n0(){return yn===null&&(yn=new Sr(t0,16,16,ei,xn),yn.name="DFG_LUT",yn.minFilter=Mt,yn.magFilter=Mt,yn.wrapS=un,yn.wrapT=un,yn.generateMipmaps=!1,yn.needsUpdate=!0),yn}var La=class{constructor(e={}){let{canvas:t=eh(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:h=!1,outputBufferType:p=Ot}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;let x=p,g=new Set([Yr,$r,qr]),f=new Set([Ot,nn,Fi,Oi,Wr,Xr]),S=new Uint32Array(4),A=new Int32Array(4),b=new B,C=null,w=null,I=[],y=[],E=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=tn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let L=this,T=!1,D=null;this._outputColorSpace=Ct;let W=0,X=0,F=null,k=-1,V=null,Q=new lt,ee=new lt,oe=null,xe=new Ge(0),ye=0,Ve=t.width,Xe=t.height,Te=1,j=null,ue=null,ne=new lt(0,0,Ve,Xe),we=new lt(0,0,Ve,Xe),Ee=!1,Ae=new Di,tt=!1,ke=!1,Ze=new dt,je=new B,Oe=new lt,ct={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ke=!1;function At(){return F===null?Te:1}let P=i;function ht(v,U){return t.getContext(v,U)}try{let v={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${kr}`),t.addEventListener("webglcontextlost",K,!1),t.addEventListener("webglcontextrestored",be,!1),t.addEventListener("webglcontextcreationerror",Le,!1),P===null){let U="webgl2";if(P=ht(U,v),P===null)throw ht(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(v){throw Re("WebGLRenderer: "+v.message),v}let Ue,nt,le,at,M,_,O,Z,N,H,te,$,J,ce,ge,re,ie,Ie,Fe,Ye,R,se,Y;function pe(){Ue=new cm(P),Ue.init(),R=new Zg(P,Ue),nt=new tm(P,Ue,e,R),le=new $g(P,Ue),nt.reversedDepthBuffer&&h&&le.buffers.depth.setReversed(!0),at=new dm(P),M=new Dg,_=new Yg(P,Ue,le,M,nt,R,at),O=new lm(L),Z=new md(P),se=new Qp(P,Z),N=new hm(P,Z,at,se),H=new pm(P,N,Z,se,at),Ie=new fm(P,nt,_),ge=new nm(M),te=new Lg(L,O,Ue,nt,se,ge),$=new Qg(L,M),J=new Ug,ce=new Gg(Ue),ie=new Kp(L,O,le,H,m,l),re=new qg(L,H,nt),Y=new e0(P,at,nt,le),Fe=new em(P,Ue,at),Ye=new um(P,Ue,at),at.programs=te.programs,L.capabilities=nt,L.extensions=Ue,L.properties=M,L.renderLists=J,L.shadowMap=re,L.state=le,L.info=at}pe(),x!==Ot&&(E=new gm(x,t.width,t.height,s,r));let ae=new ul(L,P);this.xr=ae,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let v=Ue.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){let v=Ue.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return Te},this.setPixelRatio=function(v){v!==void 0&&(Te=v,this.setSize(Ve,Xe,!1))},this.getSize=function(v){return v.set(Ve,Xe)},this.setSize=function(v,U,q=!0){if(ae.isPresenting){Ce("WebGLRenderer: Can't change size while VR device is presenting.");return}Ve=v,Xe=U,t.width=Math.floor(v*Te),t.height=Math.floor(U*Te),q===!0&&(t.style.width=v+"px",t.style.height=U+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,v,U)},this.getDrawingBufferSize=function(v){return v.set(Ve*Te,Xe*Te).floor()},this.setDrawingBufferSize=function(v,U,q){Ve=v,Xe=U,Te=q,t.width=Math.floor(v*q),t.height=Math.floor(U*q),this.setViewport(0,0,v,U)},this.setEffects=function(v){if(x===Ot){Re("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let U=0;U<v.length;U++)if(v[U].isOutputPass===!0){Ce("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(Q)},this.getViewport=function(v){return v.copy(ne)},this.setViewport=function(v,U,q,z){v.isVector4?ne.set(v.x,v.y,v.z,v.w):ne.set(v,U,q,z),le.viewport(Q.copy(ne).multiplyScalar(Te).round())},this.getScissor=function(v){return v.copy(we)},this.setScissor=function(v,U,q,z){v.isVector4?we.set(v.x,v.y,v.z,v.w):we.set(v,U,q,z),le.scissor(ee.copy(we).multiplyScalar(Te).round())},this.getScissorTest=function(){return Ee},this.setScissorTest=function(v){le.setScissorTest(Ee=v)},this.setOpaqueSort=function(v){j=v},this.setTransparentSort=function(v){ue=v},this.getClearColor=function(v){return v.copy(ie.getClearColor())},this.setClearColor=function(){ie.setClearColor(...arguments)},this.getClearAlpha=function(){return ie.getClearAlpha()},this.setClearAlpha=function(){ie.setClearAlpha(...arguments)},this.clear=function(v=!0,U=!0,q=!0){let z=0;if(v){let G=!1;if(F!==null){let fe=F.texture.format;G=g.has(fe)}if(G){let fe=F.texture.type,_e=f.has(fe),de=ie.getClearColor(),ve=ie.getClearAlpha(),Se=de.r,De=de.g,ze=de.b;_e?(S[0]=Se,S[1]=De,S[2]=ze,S[3]=ve,P.clearBufferuiv(P.COLOR,0,S)):(A[0]=Se,A[1]=De,A[2]=ze,A[3]=ve,P.clearBufferiv(P.COLOR,0,A))}else z|=P.COLOR_BUFFER_BIT}U&&(z|=P.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(z|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&P.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(v){v.setRenderer(this),D=v},this.dispose=function(){t.removeEventListener("webglcontextlost",K,!1),t.removeEventListener("webglcontextrestored",be,!1),t.removeEventListener("webglcontextcreationerror",Le,!1),ie.dispose(),J.dispose(),ce.dispose(),M.dispose(),O.dispose(),H.dispose(),se.dispose(),Y.dispose(),te.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",pl),ae.removeEventListener("sessionend",ml),ni.stop()};function K(v){v.preventDefault(),qo("WebGLRenderer: Context Lost."),T=!0}function be(){qo("WebGLRenderer: Context Restored."),T=!1;let v=at.autoReset,U=re.enabled,q=re.autoUpdate,z=re.needsUpdate,G=re.type;pe(),at.autoReset=v,re.enabled=U,re.autoUpdate=q,re.needsUpdate=z,re.type=G}function Le(v){Re("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function ft(v){let U=v.target;U.removeEventListener("dispose",ft),Qe(U)}function Qe(v){bn(v),M.remove(v)}function bn(v){let U=M.get(v).programs;U!==void 0&&(U.forEach(function(q){te.releaseProgram(q)}),v.isShaderMaterial&&te.releaseShaderCache(v))}this.renderBufferDirect=function(v,U,q,z,G,fe){U===null&&(U=ct);let _e=G.isMesh&&G.matrixWorld.determinant()<0,de=kh(v,U,q,z,G);le.setMaterial(z,_e);let ve=q.index,Se=1;if(z.wireframe===!0){if(ve=N.getWireframeAttribute(q),ve===void 0)return;Se=2}let De=q.drawRange,ze=q.attributes.position,Me=De.start*Se,et=(De.start+De.count)*Se;fe!==null&&(Me=Math.max(Me,fe.start*Se),et=Math.min(et,(fe.start+fe.count)*Se)),ve!==null?(Me=Math.max(Me,0),et=Math.min(et,ve.count)):ze!=null&&(Me=Math.max(Me,0),et=Math.min(et,ze.count));let pt=et-Me;if(pt<0||pt===1/0)return;se.setup(G,z,de,q,ve);let ut,it=Fe;if(ve!==null&&(ut=Z.get(ve),it=Ye,it.setIndex(ut)),G.isMesh)z.wireframe===!0?(le.setLineWidth(z.wireframeLinewidth*At()),it.setMode(P.LINES)):it.setMode(P.TRIANGLES);else if(G.isLine){let wt=z.linewidth;wt===void 0&&(wt=1),le.setLineWidth(wt*At()),G.isLineSegments?it.setMode(P.LINES):G.isLineLoop?it.setMode(P.LINE_LOOP):it.setMode(P.LINE_STRIP)}else G.isPoints?it.setMode(P.POINTS):G.isSprite&&it.setMode(P.TRIANGLES);if(G.isBatchedMesh)if(Ue.get("WEBGL_multi_draw"))it.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let wt=G._multiDrawStarts,me=G._multiDrawCounts,Bt=G._multiDrawCount,qe=ve?Z.get(ve).bytesPerElement:1,qt=M.get(z).currentProgram.getUniforms();for(let an=0;an<Bt;an++)qt.setValue(P,"_gl_DrawID",an),it.render(wt[an]/qe,me[an])}else if(G.isInstancedMesh)it.renderInstances(Me,pt,G.count);else if(q.isInstancedBufferGeometry){let wt=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,me=Math.min(q.instanceCount,wt);it.renderInstances(Me,pt,me)}else it.render(Me,pt)};function rn(v,U,q){v.transparent===!0&&v.side===gn&&v.forceSinglePass===!1?(v.side=Dt,v.needsUpdate=!0,Ps(v,U,q),v.side=In,v.needsUpdate=!0,Ps(v,U,q),v.side=gn):Ps(v,U,q)}this.compile=function(v,U,q=null){q===null&&(q=v),w=ce.get(q),w.init(U),y.push(w),q.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(w.pushLight(G),G.castShadow&&w.pushShadow(G))}),v!==q&&v.traverseVisible(function(G){G.isLight&&G.layers.test(U.layers)&&(w.pushLight(G),G.castShadow&&w.pushShadow(G))}),w.setupLights();let z=new Set;return v.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let fe=G.material;if(fe)if(Array.isArray(fe))for(let _e=0;_e<fe.length;_e++){let de=fe[_e];rn(de,q,G),z.add(de)}else rn(fe,q,G),z.add(fe)}),w=y.pop(),z},this.compileAsync=function(v,U,q=null){let z=this.compile(v,U,q);return new Promise(G=>{function fe(){if(z.forEach(function(_e){M.get(_e).currentProgram.isReady()&&z.delete(_e)}),z.size===0){G(v);return}setTimeout(fe,10)}Ue.get("KHR_parallel_shader_compile")!==null?fe():setTimeout(fe,10)})};let Fa=null;function Oh(v){Fa&&Fa(v)}function pl(){ni.stop()}function ml(){ni.start()}let ni=new Rh;ni.setAnimationLoop(Oh),typeof self<"u"&&ni.setContext(self),this.setAnimationLoop=function(v){Fa=v,ae.setAnimationLoop(v),v===null?ni.stop():ni.start()},ae.addEventListener("sessionstart",pl),ae.addEventListener("sessionend",ml),this.render=function(v,U){if(U!==void 0&&U.isCamera!==!0){Re("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;D!==null&&D.renderStart(v,U);let q=ae.enabled===!0&&ae.isPresenting===!0,z=E!==null&&(F===null||q)&&E.begin(L,F);if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(U),U=ae.getCamera()),v.isScene===!0&&v.onBeforeRender(L,v,U,F),w=ce.get(v,y.length),w.init(U),w.state.textureUnits=_.getTextureUnits(),y.push(w),Ze.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Ae.setFromProjectionMatrix(Ze,en,U.reversedDepth),ke=this.localClippingEnabled,tt=ge.init(this.clippingPlanes,ke),C=J.get(v,I.length),C.init(),I.push(C),ae.enabled===!0&&ae.isPresenting===!0){let _e=L.xr.getDepthSensingMesh();_e!==null&&Oa(_e,U,-1/0,L.sortObjects)}Oa(v,U,0,L.sortObjects),C.finish(),L.sortObjects===!0&&C.sort(j,ue),Ke=ae.enabled===!1||ae.isPresenting===!1||ae.hasDepthSensing()===!1,Ke&&ie.addToRenderList(C,v),this.info.render.frame++,tt===!0&&ge.beginShadows();let G=w.state.shadowsArray;if(re.render(G,v,U),tt===!0&&ge.endShadows(),this.info.autoReset===!0&&this.info.reset(),(z&&E.hasRenderPass())===!1){let _e=C.opaque,de=C.transmissive;if(w.setupLights(),U.isArrayCamera){let ve=U.cameras;if(de.length>0)for(let Se=0,De=ve.length;Se<De;Se++){let ze=ve[Se];_l(_e,de,v,ze)}Ke&&ie.render(v);for(let Se=0,De=ve.length;Se<De;Se++){let ze=ve[Se];gl(C,v,ze,ze.viewport)}}else de.length>0&&_l(_e,de,v,U),Ke&&ie.render(v),gl(C,v,U)}F!==null&&X===0&&(_.updateMultisampleRenderTarget(F),_.updateRenderTargetMipmap(F)),z&&E.end(L),v.isScene===!0&&v.onAfterRender(L,v,U),se.resetDefaultState(),k=-1,V=null,y.pop(),y.length>0?(w=y[y.length-1],_.setTextureUnits(w.state.textureUnits),tt===!0&&ge.setGlobalState(L.clippingPlanes,w.state.camera)):w=null,I.pop(),I.length>0?C=I[I.length-1]:C=null,D!==null&&D.renderEnd()};function Oa(v,U,q,z){if(v.visible===!1)return;if(v.layers.test(U.layers)){if(v.isGroup)q=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(U);else if(v.isLightProbeGrid)w.pushLightProbeGrid(v);else if(v.isLight)w.pushLight(v),v.castShadow&&w.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||Ae.intersectsSprite(v)){z&&Oe.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Ze);let _e=H.update(v),de=v.material;de.visible&&C.push(v,_e,de,q,Oe.z,null)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||Ae.intersectsObject(v))){let _e=H.update(v),de=v.material;if(z&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),Oe.copy(v.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),Oe.copy(_e.boundingSphere.center)),Oe.applyMatrix4(v.matrixWorld).applyMatrix4(Ze)),Array.isArray(de)){let ve=_e.groups;for(let Se=0,De=ve.length;Se<De;Se++){let ze=ve[Se],Me=de[ze.materialIndex];Me&&Me.visible&&C.push(v,_e,Me,q,Oe.z,ze)}}else de.visible&&C.push(v,_e,de,q,Oe.z,null)}}let fe=v.children;for(let _e=0,de=fe.length;_e<de;_e++)Oa(fe[_e],U,q,z)}function gl(v,U,q,z){let{opaque:G,transmissive:fe,transparent:_e}=v;w.setupLightsView(q),tt===!0&&ge.setGlobalState(L.clippingPlanes,q),z&&le.viewport(Q.copy(z)),G.length>0&&Is(G,U,q),fe.length>0&&Is(fe,U,q),_e.length>0&&Is(_e,U,q),le.buffers.depth.setTest(!0),le.buffers.depth.setMask(!0),le.buffers.color.setMask(!0),le.setPolygonOffset(!1)}function _l(v,U,q,z){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[z.id]===void 0){let Me=Ue.has("EXT_color_buffer_half_float")||Ue.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[z.id]=new Ht(1,1,{generateMipmaps:!0,type:Me?xn:Ot,minFilter:Kn,samples:Math.max(4,nt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:He.workingColorSpace})}let fe=w.state.transmissionRenderTarget[z.id],_e=z.viewport||Q;fe.setSize(_e.z*L.transmissionResolutionScale,_e.w*L.transmissionResolutionScale);let de=L.getRenderTarget(),ve=L.getActiveCubeFace(),Se=L.getActiveMipmapLevel();L.setRenderTarget(fe),L.getClearColor(xe),ye=L.getClearAlpha(),ye<1&&L.setClearColor(16777215,.5),L.clear(),Ke&&ie.render(q);let De=L.toneMapping;L.toneMapping=tn;let ze=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),w.setupLightsView(z),tt===!0&&ge.setGlobalState(L.clippingPlanes,z),Is(v,q,z),_.updateMultisampleRenderTarget(fe),_.updateRenderTargetMipmap(fe),Ue.has("WEBGL_multisampled_render_to_texture")===!1){let Me=!1;for(let et=0,pt=U.length;et<pt;et++){let ut=U[et],{object:it,geometry:wt,material:me,group:Bt}=ut;if(me.side===gn&&it.layers.test(z.layers)){let qe=me.side;me.side=Dt,me.needsUpdate=!0,xl(it,q,z,wt,me,Bt),me.side=qe,me.needsUpdate=!0,Me=!0}}Me===!0&&(_.updateMultisampleRenderTarget(fe),_.updateRenderTargetMipmap(fe))}L.setRenderTarget(de,ve,Se),L.setClearColor(xe,ye),ze!==void 0&&(z.viewport=ze),L.toneMapping=De}function Is(v,U,q){let z=U.isScene===!0?U.overrideMaterial:null;for(let G=0,fe=v.length;G<fe;G++){let _e=v[G],{object:de,geometry:ve,group:Se}=_e,De=_e.material;De.allowOverride===!0&&z!==null&&(De=z),de.layers.test(q.layers)&&xl(de,U,q,ve,De,Se)}}function xl(v,U,q,z,G,fe){v.onBeforeRender(L,U,q,z,G,fe),v.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),G.onBeforeRender(L,U,q,z,v,fe),G.transparent===!0&&G.side===gn&&G.forceSinglePass===!1?(G.side=Dt,G.needsUpdate=!0,L.renderBufferDirect(q,U,z,G,v,fe),G.side=In,G.needsUpdate=!0,L.renderBufferDirect(q,U,z,G,v,fe),G.side=gn):L.renderBufferDirect(q,U,z,G,v,fe),v.onAfterRender(L,U,q,z,G,fe)}function Ps(v,U,q){U.isScene!==!0&&(U=ct);let z=M.get(v),G=w.state.lights,fe=w.state.shadowsArray,_e=G.state.version,de=te.getParameters(v,G.state,fe,U,q,w.state.lightProbeGridArray),ve=te.getProgramCacheKey(de),Se=z.programs;z.environment=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?U.environment:null,z.fog=U.fog;let De=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap;z.envMap=O.get(v.envMap||z.environment,De),z.envMapRotation=z.environment!==null&&v.envMap===null?U.environmentRotation:v.envMapRotation,Se===void 0&&(v.addEventListener("dispose",ft),Se=new Map,z.programs=Se);let ze=Se.get(ve);if(ze!==void 0){if(z.currentProgram===ze&&z.lightsStateVersion===_e)return vl(v,de),ze}else de.uniforms=te.getUniforms(v),D!==null&&v.isNodeMaterial&&D.build(v,q,de),v.onBeforeCompile(de,L),ze=te.acquireProgram(de,ve),Se.set(ve,ze),z.uniforms=de.uniforms;let Me=z.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Me.clippingPlanes=ge.uniform),vl(v,de),z.needsLights=Gh(v),z.lightsStateVersion=_e,z.needsLights&&(Me.ambientLightColor.value=G.state.ambient,Me.lightProbe.value=G.state.probe,Me.directionalLights.value=G.state.directional,Me.directionalLightShadows.value=G.state.directionalShadow,Me.spotLights.value=G.state.spot,Me.spotLightShadows.value=G.state.spotShadow,Me.rectAreaLights.value=G.state.rectArea,Me.ltc_1.value=G.state.rectAreaLTC1,Me.ltc_2.value=G.state.rectAreaLTC2,Me.pointLights.value=G.state.point,Me.pointLightShadows.value=G.state.pointShadow,Me.hemisphereLights.value=G.state.hemi,Me.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Me.spotLightMatrix.value=G.state.spotLightMatrix,Me.spotLightMap.value=G.state.spotLightMap,Me.pointShadowMatrix.value=G.state.pointShadowMatrix),z.lightProbeGrid=w.state.lightProbeGridArray.length>0,z.currentProgram=ze,z.uniformsList=null,ze}function yl(v){if(v.uniformsList===null){let U=v.currentProgram.getUniforms();v.uniformsList=ki.seqWithValue(U.seq,v.uniforms)}return v.uniformsList}function vl(v,U){let q=M.get(v);q.outputColorSpace=U.outputColorSpace,q.batching=U.batching,q.batchingColor=U.batchingColor,q.instancing=U.instancing,q.instancingColor=U.instancingColor,q.instancingMorph=U.instancingMorph,q.skinning=U.skinning,q.morphTargets=U.morphTargets,q.morphNormals=U.morphNormals,q.morphColors=U.morphColors,q.morphTargetsCount=U.morphTargetsCount,q.numClippingPlanes=U.numClippingPlanes,q.numIntersection=U.numClipIntersection,q.vertexAlphas=U.vertexAlphas,q.vertexTangents=U.vertexTangents,q.toneMapping=U.toneMapping}function Bh(v,U){if(v.length===0)return null;if(v.length===1)return v[0].texture!==null?v[0]:null;b.setFromMatrixPosition(U.matrixWorld);for(let q=0,z=v.length;q<z;q++){let G=v[q];if(G.texture!==null&&G.boundingBox.containsPoint(b))return G}return null}function kh(v,U,q,z,G){U.isScene!==!0&&(U=ct),_.resetTextureUnits();let fe=U.fog,_e=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?U.environment:null,de=F===null?L.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:He.workingColorSpace,ve=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,Se=O.get(z.envMap||_e,ve),De=z.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,ze=!!q.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Me=!!q.morphAttributes.position,et=!!q.morphAttributes.normal,pt=!!q.morphAttributes.color,ut=tn;z.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(ut=L.toneMapping);let it=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,wt=it!==void 0?it.length:0,me=M.get(z),Bt=w.state.lights;if(tt===!0&&(ke===!0||v!==V)){let rt=v===V&&z.id===k;ge.setState(z,v,rt)}let qe=!1;z.version===me.__version?(me.needsLights&&me.lightsStateVersion!==Bt.state.version||me.outputColorSpace!==de||G.isBatchedMesh&&me.batching===!1||!G.isBatchedMesh&&me.batching===!0||G.isBatchedMesh&&me.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&me.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&me.instancing===!1||!G.isInstancedMesh&&me.instancing===!0||G.isSkinnedMesh&&me.skinning===!1||!G.isSkinnedMesh&&me.skinning===!0||G.isInstancedMesh&&me.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&me.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&me.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&me.instancingMorph===!1&&G.morphTexture!==null||me.envMap!==Se||z.fog===!0&&me.fog!==fe||me.numClippingPlanes!==void 0&&(me.numClippingPlanes!==ge.numPlanes||me.numIntersection!==ge.numIntersection)||me.vertexAlphas!==De||me.vertexTangents!==ze||me.morphTargets!==Me||me.morphNormals!==et||me.morphColors!==pt||me.toneMapping!==ut||me.morphTargetsCount!==wt||!!me.lightProbeGrid!=w.state.lightProbeGridArray.length>0)&&(qe=!0):(qe=!0,me.__version=z.version);let qt=me.currentProgram;qe===!0&&(qt=Ps(z,U,G),D&&z.isNodeMaterial&&D.onUpdateProgram(z,qt,me));let an=!1,Nn=!1,fi=!1,st=qt.getUniforms(),mt=me.uniforms;if(le.useProgram(qt.program)&&(an=!0,Nn=!0,fi=!0),z.id!==k&&(k=z.id,Nn=!0),me.needsLights){let rt=Bh(w.state.lightProbeGridArray,G);me.lightProbeGrid!==rt&&(me.lightProbeGrid=rt,Nn=!0)}if(an||V!==v){le.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),st.setValue(P,"projectionMatrix",v.projectionMatrix),st.setValue(P,"viewMatrix",v.matrixWorldInverse);let Fn=st.map.cameraPosition;Fn!==void 0&&Fn.setValue(P,je.setFromMatrixPosition(v.matrixWorld)),nt.logarithmicDepthBuffer&&st.setValue(P,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&st.setValue(P,"isOrthographic",v.isOrthographicCamera===!0),V!==v&&(V=v,Nn=!0,fi=!0)}if(me.needsLights&&(Bt.state.directionalShadowMap.length>0&&st.setValue(P,"directionalShadowMap",Bt.state.directionalShadowMap,_),Bt.state.spotShadowMap.length>0&&st.setValue(P,"spotShadowMap",Bt.state.spotShadowMap,_),Bt.state.pointShadowMap.length>0&&st.setValue(P,"pointShadowMap",Bt.state.pointShadowMap,_)),G.isSkinnedMesh){st.setOptional(P,G,"bindMatrix"),st.setOptional(P,G,"bindMatrixInverse");let rt=G.skeleton;rt&&(rt.boneTexture===null&&rt.computeBoneTexture(),st.setValue(P,"boneTexture",rt.boneTexture,_))}G.isBatchedMesh&&(st.setOptional(P,G,"batchingTexture"),st.setValue(P,"batchingTexture",G._matricesTexture,_),st.setOptional(P,G,"batchingIdTexture"),st.setValue(P,"batchingIdTexture",G._indirectTexture,_),st.setOptional(P,G,"batchingColorTexture"),G._colorsTexture!==null&&st.setValue(P,"batchingColorTexture",G._colorsTexture,_));let Un=q.morphAttributes;if((Un.position!==void 0||Un.normal!==void 0||Un.color!==void 0)&&Ie.update(G,q,qt),(Nn||me.receiveShadow!==G.receiveShadow)&&(me.receiveShadow=G.receiveShadow,st.setValue(P,"receiveShadow",G.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&U.environment!==null&&(mt.envMapIntensity.value=U.environmentIntensity),mt.dfgLUT!==void 0&&(mt.dfgLUT.value=n0()),Nn){if(st.setValue(P,"toneMappingExposure",L.toneMappingExposure),me.needsLights&&zh(mt,fi),fe&&z.fog===!0&&$.refreshFogUniforms(mt,fe),$.refreshMaterialUniforms(mt,z,Te,Xe,w.state.transmissionRenderTarget[v.id]),me.needsLights&&me.lightProbeGrid){let rt=me.lightProbeGrid;mt.probesSH.value=rt.texture,mt.probesMin.value.copy(rt.boundingBox.min),mt.probesMax.value.copy(rt.boundingBox.max),mt.probesResolution.value.copy(rt.resolution)}ki.upload(P,yl(me),mt,_)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(ki.upload(P,yl(me),mt,_),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&st.setValue(P,"center",G.center),st.setValue(P,"modelViewMatrix",G.modelViewMatrix),st.setValue(P,"normalMatrix",G.normalMatrix),st.setValue(P,"modelMatrix",G.matrixWorld),z.uniformsGroups!==void 0){let rt=z.uniformsGroups;for(let Fn=0,pi=rt.length;Fn<pi;Fn++){let bl=rt[Fn];Y.update(bl,qt),Y.bind(bl,qt)}}return qt}function zh(v,U){v.ambientLightColor.needsUpdate=U,v.lightProbe.needsUpdate=U,v.directionalLights.needsUpdate=U,v.directionalLightShadows.needsUpdate=U,v.pointLights.needsUpdate=U,v.pointLightShadows.needsUpdate=U,v.spotLights.needsUpdate=U,v.spotLightShadows.needsUpdate=U,v.rectAreaLights.needsUpdate=U,v.hemisphereLights.needsUpdate=U}function Gh(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return X},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(v,U,q){let z=M.get(v);z.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),M.get(v.texture).__webglTexture=U,M.get(v.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:q,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,U){let q=M.get(v);q.__webglFramebuffer=U,q.__useDefaultFramebuffer=U===void 0};let Vh=P.createFramebuffer();this.setRenderTarget=function(v,U=0,q=0){F=v,W=U,X=q;let z=null,G=!1,fe=!1;if(v){let de=M.get(v);if(de.__useDefaultFramebuffer!==void 0){le.bindFramebuffer(P.FRAMEBUFFER,de.__webglFramebuffer),Q.copy(v.viewport),ee.copy(v.scissor),oe=v.scissorTest,le.viewport(Q),le.scissor(ee),le.setScissorTest(oe),k=-1;return}else if(de.__webglFramebuffer===void 0)_.setupRenderTarget(v);else if(de.__hasExternalTextures)_.rebindTextures(v,M.get(v.texture).__webglTexture,M.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){let De=v.depthTexture;if(de.__boundDepthTexture!==De){if(De!==null&&M.has(De)&&(v.width!==De.image.width||v.height!==De.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");_.setupDepthRenderbuffer(v)}}let ve=v.texture;(ve.isData3DTexture||ve.isDataArrayTexture||ve.isCompressedArrayTexture)&&(fe=!0);let Se=M.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Se[U])?z=Se[U][q]:z=Se[U],G=!0):v.samples>0&&_.useMultisampledRTT(v)===!1?z=M.get(v).__webglMultisampledFramebuffer:Array.isArray(Se)?z=Se[q]:z=Se,Q.copy(v.viewport),ee.copy(v.scissor),oe=v.scissorTest}else Q.copy(ne).multiplyScalar(Te).floor(),ee.copy(we).multiplyScalar(Te).floor(),oe=Ee;if(q!==0&&(z=Vh),le.bindFramebuffer(P.FRAMEBUFFER,z)&&le.drawBuffers(v,z),le.viewport(Q),le.scissor(ee),le.setScissorTest(oe),G){let de=M.get(v.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+U,de.__webglTexture,q)}else if(fe){let de=U;for(let ve=0;ve<v.textures.length;ve++){let Se=M.get(v.textures[ve]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+ve,Se.__webglTexture,q,de)}}else if(v!==null&&q!==0){let de=M.get(v.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,de.__webglTexture,q)}k=-1},this.readRenderTargetPixels=function(v,U,q,z,G,fe,_e,de=0){if(!(v&&v.isWebGLRenderTarget)){Re("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ve=M.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&_e!==void 0&&(ve=ve[_e]),ve){le.bindFramebuffer(P.FRAMEBUFFER,ve);try{let Se=v.textures[de],De=Se.format,ze=Se.type;if(v.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+de),!nt.textureFormatReadable(De)){Re("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!nt.textureTypeReadable(ze)){Re("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=v.width-z&&q>=0&&q<=v.height-G&&P.readPixels(U,q,z,G,R.convert(De),R.convert(ze),fe)}finally{let Se=F!==null?M.get(F).__webglFramebuffer:null;le.bindFramebuffer(P.FRAMEBUFFER,Se)}}},this.readRenderTargetPixelsAsync=async function(v,U,q,z,G,fe,_e,de=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ve=M.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&_e!==void 0&&(ve=ve[_e]),ve)if(U>=0&&U<=v.width-z&&q>=0&&q<=v.height-G){le.bindFramebuffer(P.FRAMEBUFFER,ve);let Se=v.textures[de],De=Se.format,ze=Se.type;if(v.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+de),!nt.textureFormatReadable(De))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!nt.textureTypeReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Me=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Me),P.bufferData(P.PIXEL_PACK_BUFFER,fe.byteLength,P.STREAM_READ),P.readPixels(U,q,z,G,R.convert(De),R.convert(ze),0);let et=F!==null?M.get(F).__webglFramebuffer:null;le.bindFramebuffer(P.FRAMEBUFFER,et);let pt=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await nh(P,pt,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Me),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,fe),P.deleteBuffer(Me),P.deleteSync(pt),fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,U=null,q=0){let z=Math.pow(2,-q),G=Math.floor(v.image.width*z),fe=Math.floor(v.image.height*z),_e=U!==null?U.x:0,de=U!==null?U.y:0;_.setTexture2D(v,0),P.copyTexSubImage2D(P.TEXTURE_2D,q,0,0,_e,de,G,fe),le.unbindTexture()};let Hh=P.createFramebuffer(),Wh=P.createFramebuffer();this.copyTextureToTexture=function(v,U,q=null,z=null,G=0,fe=0){let _e,de,ve,Se,De,ze,Me,et,pt,ut=v.isCompressedTexture?v.mipmaps[fe]:v.image;if(q!==null)_e=q.max.x-q.min.x,de=q.max.y-q.min.y,ve=q.isBox3?q.max.z-q.min.z:1,Se=q.min.x,De=q.min.y,ze=q.isBox3?q.min.z:0;else{let mt=Math.pow(2,-G);_e=Math.floor(ut.width*mt),de=Math.floor(ut.height*mt),v.isDataArrayTexture?ve=ut.depth:v.isData3DTexture?ve=Math.floor(ut.depth*mt):ve=1,Se=0,De=0,ze=0}z!==null?(Me=z.x,et=z.y,pt=z.z):(Me=0,et=0,pt=0);let it=R.convert(U.format),wt=R.convert(U.type),me;U.isData3DTexture?(_.setTexture3D(U,0),me=P.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(_.setTexture2DArray(U,0),me=P.TEXTURE_2D_ARRAY):(_.setTexture2D(U,0),me=P.TEXTURE_2D),le.activeTexture(P.TEXTURE0),le.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,U.flipY),le.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),le.pixelStorei(P.UNPACK_ALIGNMENT,U.unpackAlignment);let Bt=le.getParameter(P.UNPACK_ROW_LENGTH),qe=le.getParameter(P.UNPACK_IMAGE_HEIGHT),qt=le.getParameter(P.UNPACK_SKIP_PIXELS),an=le.getParameter(P.UNPACK_SKIP_ROWS),Nn=le.getParameter(P.UNPACK_SKIP_IMAGES);le.pixelStorei(P.UNPACK_ROW_LENGTH,ut.width),le.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ut.height),le.pixelStorei(P.UNPACK_SKIP_PIXELS,Se),le.pixelStorei(P.UNPACK_SKIP_ROWS,De),le.pixelStorei(P.UNPACK_SKIP_IMAGES,ze);let fi=v.isDataArrayTexture||v.isData3DTexture,st=U.isDataArrayTexture||U.isData3DTexture;if(v.isDepthTexture){let mt=M.get(v),Un=M.get(U),rt=M.get(mt.__renderTarget),Fn=M.get(Un.__renderTarget);le.bindFramebuffer(P.READ_FRAMEBUFFER,rt.__webglFramebuffer),le.bindFramebuffer(P.DRAW_FRAMEBUFFER,Fn.__webglFramebuffer);for(let pi=0;pi<ve;pi++)fi&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,M.get(v).__webglTexture,G,ze+pi),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,M.get(U).__webglTexture,fe,pt+pi)),P.blitFramebuffer(Se,De,_e,de,Me,et,_e,de,P.DEPTH_BUFFER_BIT,P.NEAREST);le.bindFramebuffer(P.READ_FRAMEBUFFER,null),le.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(G!==0||v.isRenderTargetTexture||M.has(v)){let mt=M.get(v),Un=M.get(U);le.bindFramebuffer(P.READ_FRAMEBUFFER,Hh),le.bindFramebuffer(P.DRAW_FRAMEBUFFER,Wh);for(let rt=0;rt<ve;rt++)fi?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,mt.__webglTexture,G,ze+rt):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,mt.__webglTexture,G),st?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Un.__webglTexture,fe,pt+rt):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Un.__webglTexture,fe),G!==0?P.blitFramebuffer(Se,De,_e,de,Me,et,_e,de,P.COLOR_BUFFER_BIT,P.NEAREST):st?P.copyTexSubImage3D(me,fe,Me,et,pt+rt,Se,De,_e,de):P.copyTexSubImage2D(me,fe,Me,et,Se,De,_e,de);le.bindFramebuffer(P.READ_FRAMEBUFFER,null),le.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else st?v.isDataTexture||v.isData3DTexture?P.texSubImage3D(me,fe,Me,et,pt,_e,de,ve,it,wt,ut.data):U.isCompressedArrayTexture?P.compressedTexSubImage3D(me,fe,Me,et,pt,_e,de,ve,it,ut.data):P.texSubImage3D(me,fe,Me,et,pt,_e,de,ve,it,wt,ut):v.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,fe,Me,et,_e,de,it,wt,ut.data):v.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,fe,Me,et,ut.width,ut.height,it,ut.data):P.texSubImage2D(P.TEXTURE_2D,fe,Me,et,_e,de,it,wt,ut);le.pixelStorei(P.UNPACK_ROW_LENGTH,Bt),le.pixelStorei(P.UNPACK_IMAGE_HEIGHT,qe),le.pixelStorei(P.UNPACK_SKIP_PIXELS,qt),le.pixelStorei(P.UNPACK_SKIP_ROWS,an),le.pixelStorei(P.UNPACK_SKIP_IMAGES,Nn),fe===0&&U.generateMipmaps&&P.generateMipmap(me),le.unbindTexture()},this.initRenderTarget=function(v){M.get(v).__webglFramebuffer===void 0&&_.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?_.setTextureCube(v,0):v.isData3DTexture?_.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?_.setTexture2DArray(v,0):_.setTexture2D(v,0),le.unbindTexture()},this.resetState=function(){W=0,X=0,F=null,le.reset(),se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return en}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=He._getDrawingBufferColorSpace(e),t.unpackColorSpace=He._getUnpackColorSpace()}};function Fh(){let n;try{n=new La({alpha:!0,antialias:!0,powerPreference:"low-power"})}catch{return null}n.setSize(384,384),n.setPixelRatio(1),n.setClearColor(0,0),n.outputColorSpace=Ct;let e=new ns;e.add(new ms(13037055,2109508,2.5));let t=new Ni(16772827,3);t.position.set(-3,4,5),e.add(t);let i=new Ni(7129599,1.5);i.position.set(3,2,-3),e.add(i);let s=new Jn(-1.65,1.65,1.65,-1.65,.1,30);s.position.set(0,0,8);let r=new Map,a=new Set;return{draw(o,l,c,d,u,h,p=0){if(a.has(l.id))return!1;let m=`${l.id}:${p.toFixed(1)}`,x=r.get(m);if(!x){let f=s0(l);if(!f)return a.add(l.id),!1;f.rotation.y=p;let S=new mn().setFromObject(f),A=S.getCenter(new B);f.position.sub(A);let b=S.getSize(new B),C=Math.max(b.x,b.y,.001);f.scale.setScalar(2.8/C),f.position.multiplyScalar(2.8/C),e.add(f),n.render(e,s),x=document.createElement("canvas"),x.width=384,x.height=384,x.getContext("2d").drawImage(n.domElement,0,0),e.remove(f),f.traverse(w=>{w.geometry?.dispose(),w.material&&(w.material.map?.dispose(),w.material.dispose())}),r.set(m,x),r.size>40&&r.delete(r.keys().next().value)}let g=Math.max(u,h)*3.3/2.8;return o.drawImage(x,c-g/2,d-g/2,g,g),!0},destroy(){r.clear(),n.dispose(),n.forceContextLoss()}}}var dl={earth:3311813,mercury:9998474,venus:14269569,mars:12150082,jupiter:12755585,saturn:14730395,uranus:10280413,neptune:3957718,moon:11184549,titan:14068583,europa:14078393,pluto:11902082,ceres:9605773};function s0(n){let e=new Cn,t=n.id,i=(o,l={})=>new ds({color:o,roughness:.48,metalness:.12,...l}),s=(o,l,c,d,u,h,p)=>{let m=new It(new qn(o,l,c),i(p));return m.position.set(d,u,h),e.add(m),m},r=(o,l,c,d,u,h)=>{let p=new It(new us(o,40,28),i(u,h));return p.position.set(l,c,d),e.add(p),p},a=(o,l,c,d,u,h)=>{let p=new It(new cs(o,o,l,24),i(h));return p.position.set(c,d,u),e.add(p),p};if(t in dl||n.category==="Star"){let o=n.category==="Star",l=r(1,0,0,0,dl[t]??n.color,o?{emissive:n.color,emissiveIntensity:.7}:{}),c=document.createElement("canvas");c.width=512,c.height=256;let d=c.getContext("2d");d.fillStyle=`#${new Ge(dl[t]??n.color).getHexString()}`,d.fillRect(0,0,512,256);for(let u=0;u<180;u++)d.fillStyle=u%2?"#ffffff25":"#00000018",d.beginPath(),d.ellipse(u*113%512,u*71%256,t==="jupiter"||t==="saturn"?260:6+u%20,t==="jupiter"||t==="saturn"?2:3+u%9,0,0,Math.PI*2),d.fill();if(t==="earth"){d.fillStyle="#5c9869";for(let u=0;u<28;u++)d.beginPath(),d.ellipse(90+u*39%320,35+u*29%180,14+u%18,10+u%14,u,0,Math.PI*2),d.fill()}l.material.map=new os(c),l.material.map.colorSpace=Ct}else if(t==="human"){r(.12,0,.75,0,12424314),s(.33,.48,.17,0,.35,0,3423817);for(let o of[-1,1])a(.065,.65,o*.1,-.22,0,2570058),a(.048,.5,o*.24,.28,0,9597276),s(.14,.08,.25,o*.1,-.56,.04,1383462)}else if(["car","school-bus","minivan","auto-rickshaw","metro-train-car","train"].includes(t)){let o=t==="school-bus"||t==="metro-train-car"||t==="train",l=o?3.4:2.5;s(l,.55,.9,0,0,0,o?14526527:5138043),s(l*.7,o?.6:.35,.82,0,.4,0,o?15052092:5401474);for(let c=0;c<(o?7:2);c++)s(o?.3:.55,.27,.025,-l*.3+c*(o?.33:.65),.45,.43,1453382);for(let c of[-l*.32,l*.32])for(let d of[-.46,.46]){let u=a(.24,.14,c,-.29,d,1382945);u.rotation.x=Math.PI/2}e.rotation.y=-.3}else if(["door","whiteboard","classroom-window"].includes(t)){if(s(t==="door"?.9:2.4,t==="door"?2.1:1.3,.09,0,0,0,t==="door"?8673586:14280934),t==="door"){for(let o of[-.45,.45])s(.65,.65,.03,0,o,.06,6898984);r(.035,.32,0,.1,13810810)}}else if(["laptop","tablet","monitor","smartphone","calculator"].includes(t)){if(s(1.4,.9,.06,0,.15,0,9017251),s(1.28,.76,.02,0,.15,.05,664384),t==="laptop"){s(1.4,.045,.8,0,-.32,.35,9215658);for(let o=0;o<8;o++)s(.1,.015,.33,-.5+o*.14,-.29,.25,3424850)}e.rotation.y=-.22}else if(["chair","desk","laboratory-table","garden-bench"].includes(t)){let o=t==="chair",l=o?.65:1.5;s(l,.09,.65,0,0,0,10582603),o&&s(l,.6,.08,0,.36,-.28,10320205);for(let c of[-l*.4,l*.4])for(let d of[-.26,.26])a(.035,.6,c,-.32,d,8162711);e.rotation.y=-.25}else if(t==="microscope"||t==="telescope"){s(.7,.08,.45,0,-.5,0,9411493),s(.12,.75,.12,.2,-.1,0,6911616),s(.5,.06,.4,0,-.08,.05,2700350);let o=a(.1,.6,-.05,.28,0,11845317);o.rotation.z=-.4,r(.12,-.23,.5,0,1713971)}else if(["football","basketball","marble","coin"].includes(t)){r(1,0,0,0,t==="football"?15527144:t==="basketball"?13203512:12110039);for(let o=0;o<5;o++)r(.13,Math.cos(o*1.3)*.65,Math.sin(o*1.3)*.65,.75,t==="football"?2437178:6832938)}else if(n.category==="Molecule"&&!/dna|ribosome|membrane/.test(t)){let o=t==="water-molecule";r(o?.3:.22,0,0,0,14765637);let l=o?2:6;for(let c=0;c<l;c++){let d=o?(-52.25+c*104.5)*Math.PI/180:c*Math.PI/3,u=Math.sin(d)*.65,h=Math.cos(d)*.65,p=a(.04,.65,u/2,h/2,0,10664133);p.rotation.z=-d,r(.16,u,h,0,o?15658734:5400441)}}else return null;return e}function Pv(n){let e=Rl(),t=e,i=t.length;n.innerHTML=`
    <section class="scale-explorer" aria-label="Scale of Universe Explorer">
      <header class="scale-topbar">
        <div class="scale-title-block">
          <p class="scale-eyebrow">Browser-only physics module</p>
          <h1><span class="scale-orbit-mark" aria-hidden="true">\u25CE</span> Scale of Universe <em>Explorer</em></h1>
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
        <details class="scale-filter-drawer"><summary>Object filters</summary><aside class="scale-filter-panel" aria-label="Object category filters"></aside></details>

        <canvas aria-label="Scale of Universe canvas visualization" role="img" tabindex="0"></canvas>
        <div class="scale-reference-badge"><span>SCIENTIFIC SCALE \xB7 VISUAL REFERENCES</span><b>Shared physical scale \xB7 illustrative surfaces</b></div>
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
          <div class="scale-unit-grid">${Sl()}</div>
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
      <footer class="scale-control-deck"><nav class="scale-path-panel" aria-label="Scale categories"></nav>
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
          <button type="button" data-action="sound" disabled title="Audio is not available">Sound unavailable</button>
        </div>
        <div class="scale-object-count-control" aria-label="Displayed object count control">
          <label for="scale-object-count">
            <span>Total objects to display</span>
            <strong><output data-object-count-output>${i}</output> / ${t.length}</strong>
          </label>
          <input id="scale-object-count" type="range" min="30" max="${t.length}" step="1" value="${i}" />
        </div>
        <div class="scale-slider" aria-label="Logarithmic scale slider">
          <div class="scale-slider-track">
            <div class="scale-slider-ticks" aria-hidden="true"></div>
            <div class="scale-slider-fill"></div>
            <div class="scale-slider-thumb"></div>
          </div>
          <div class="scale-slider-labels"><span>10<sup>-35</sup> m</span><span>10<sup>0</sup> m</span><span>10<sup>27</sup> m</span></div>
        </div>
      </footer>
    </section>
  `;let s=n.querySelector(".scale-explorer"),r={"zoom-in":"\u2295","zoom-out":"\u2296",journey:"\u2667",quiz:"\u265C",teacher:"\u2659",bookmarks:"\u2667",units:"\u2194",help:"?",reset:"\u27F3",fullscreen:"\u26F6",sound:"\u266A"};for(let N of s.querySelectorAll("[data-action]"))N.dataset.icon=r[N.dataset.action];let a=n.querySelector("canvas"),o=a.getContext("2d"),l=n.querySelector(".scale-legend"),c=n.querySelector(".scale-info-panel"),d=n.querySelector(".scale-search input"),u=n.querySelector(".scale-search-clear"),h=n.querySelector(".scale-search-results"),p=n.querySelector(".scale-help-panel"),m=n.querySelector(".scale-units-panel"),x=n.querySelector(".scale-path-panel"),g=n.querySelector("#scale-object-count"),f=n.querySelector("[data-object-count-output]"),S=navigator.connection?.saveData||navigator.deviceMemory&&navigator.deviceMemory<=4||navigator.hardwareConcurrency<=4;s.dataset.reducedEffects=String(!!S);let A=S?null:Fh(),b={models:A,minLog:St,maxLog:kt,currentLog:0,targetLog:0,panX:0,panY:0,selectedObjectId:null,width:1,height:1,isMobile:!1,scaleBand:$t(0),categoryFilters:new Set,prefersReducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches,objects:e,displayObjects:t,visibleObjects:[],objectDisplayLimit:i},C=0,w=!0,I=Number.NaN,y=null,E=0,L=null,T=null,D=null,W=new Map,X=()=>{w=!0},F=N=>{let H=Math.round(ln(Number(N),30,t.length));b.objectDisplayLimit=H,g.value=String(H),f.textContent=String(H),X()},k=()=>{let N=a.getBoundingClientRect(),H=Math.min(window.devicePixelRatio||1,2);b.width=Math.max(300,N.width),b.height=Math.max(260,N.height),b.isMobile=b.width<640||window.matchMedia("(max-width: 640px)").matches,s.dataset.mobile=b.isMobile?"true":"false",a.width=Math.round(b.width*H),a.height=Math.round(b.height*H),o.setTransform(H,0,0,H,0,0),X()},V=N=>{b.targetLog=ln(N,St,kt),b.scaleBand=$t(b.targetLog),Xe.updateVisual(),fl(x,b.targetLog),X()},Q=N=>{b.panX=0,b.panY=0},ee=N=>{b.selectedObjectId=N.id,V(N.logSize),Q(N),Us(c,N,{onClose:oe,onCompare:H=>ne.open(H),onJourney:()=>Ee.openPicker(),onRelated:H=>ee(H),onBookmark:H=>{Te.toggle(H),Us(c,H,Ve(H))},isBookmarked:H=>Te.isBookmarked(H),objects:e,models:A}),X()},oe=()=>{b.selectedObjectId=null,Hi(c),X()},xe=()=>{d.value="",u.hidden=!0,h.hidden=!0,b.currentLog=0,b.targetLog=0,b.panX=0,b.panY=0,b.scaleBand=$t(0),ne.close(),Ee.exit(),oe(),Xe.updateVisual(),X()},ye=N=>{ee(N)},Ve=N=>({onClose:oe,onCompare:H=>ne.open(H),onJourney:()=>Ee.openPicker(),onRelated:H=>ee(H),onBookmark:H=>{Te.toggle(H),Us(c,H,Ve(H))},isBookmarked:H=>Te.isBookmarked(H),objects:e,models:A}),Xe=Zl(n.querySelector(".scale-slider"),b,V),Te=Fl(s,e,{zoomTo:ye}),j=ec(d,h,u,e,ee,{getFilters:()=>b.categoryFilters,isBookmarked:N=>Te.isBookmarked(N)}),ue=jl(s,b,{onChange:X}),ne=Jl(s,e,{zoomTo:ye}),we=N=>{ye(N),Hi(c)},Ee=Kl(s,e,{zoomTo:we}),Ae=Ql(s,e),tt=tc(s,e,{zoomTo:we,setPaused:N=>{b.paused=N,X()}}),ke=N=>{N.preventDefault(),V(b.targetLog+(N.deltaY<0?-.18:.18))},Ze=N=>{if(N.target.closest?.("input, select, textarea")){N.key==="Escape"&&(h.hidden=!0,d.blur());return}(N.key==="+"||N.key==="=")&&V(b.targetLog-1),(N.key==="-"||N.key==="_")&&V(b.targetLog+1),N.key.toLowerCase()==="r"&&xe(),N.key==="Escape"&&(p.hidden=!0,m.hidden=!0,Ee.closePicker(),ne.close(),Te.close(),Ae.close(),oe())},je=N=>{F(N.target.value)},Oe=N=>{if(a.focus(),W.set(N.pointerId,Ua(N)),a.setPointerCapture?.(N.pointerId),E=0,W.size===1&&(y=Ua(N),T=null,D=null),W.size===2){let H=Z();T=H.distance,D=H.center}N.preventDefault()},ct=N=>{if(W.has(N.pointerId)){if(W.set(N.pointerId,Ua(N)),W.size===1&&y){let H=Ua(N),te=H.x-y.x,$=H.y-y.y;b.panX+=te,b.panY+=$,E+=Math.abs(te)+Math.abs($),y=H,X()}if(W.size>=2){let H=Z();if(T&&D){let te=ln(H.distance/T,.72,1.32),$=-Math.log10(te)*2.8;V(b.targetLog+$),b.panX+=H.center.x-D.x,b.panY+=H.center.y-D.y,E+=Math.abs(H.center.x-D.x)+Math.abs(H.center.y-D.y)}T=H.distance,D=H.center,X()}N.preventDefault()}},Ke=N=>{W.delete(N.pointerId),W.size===0&&(y=null,T=null,D=null),W.size===1&&(y=[...W.values()][0])},At=N=>{if(E>12)return;let H=a.getBoundingClientRect(),te=N.clientX-H.left,$=N.clientY-H.top,J=[...b.visibleObjects].reverse().find(ce=>Math.hypot(ce.screenX-te,ce.screenY-$)<=Math.max(ce.radius*1.2,18));J&&ee(J.object)},P=N=>{b.isMobile&&N.target.closest(".scale-sheet-handle")&&(L=N.clientY,c.setPointerCapture?.(N.pointerId))},ht=N=>{if(L==null)return;let H=Math.max(0,N.clientY-L);c.style.transform=`translateY(${H}px)`,N.preventDefault()},Ue=N=>{if(L==null)return;let H=N.clientY-L;c.style.transform="",L=null,H>90&&oe()},nt=()=>{sessionStorage.getItem("scaleUniverseHelpHidden")!=="true"&&(p.hidden=!1)},le=()=>{p.querySelector("[data-help-session]")?.checked&&sessionStorage.setItem("scaleUniverseHelpHidden","true"),p.hidden=!0},at={"zoom-in":()=>V(b.targetLog-1),"zoom-out":()=>V(b.targetLog+1),journey:()=>Ee.openPicker(),quiz:()=>Ae.start(),teacher:()=>tt.open(),bookmarks:()=>Te.open(),units:()=>{m.hidden=!1},help:()=>{p.hidden=!1},reset:xe,fullscreen:async()=>{try{document.fullscreenElement?await document.exitFullscreen():await s.requestFullscreen?.()}catch{p.hidden=!1}},sound:()=>{let N=n.querySelector('[data-action="sound"]');N.textContent="Sound Coming Soon"}},M=N=>{N.target.closest("[data-help-close]")&&le(),N.target.closest("[data-units-close]")&&(m.hidden=!0);let H=N.target.closest("[data-band-log]")?.dataset.bandLog;H!==void 0&&(b.selectedObjectId=null,Hi(c),b.panX=0,b.panY=0,V(Number(H)));let te=N.target?.closest?.("[data-action]")?.dataset?.action;["journey","quiz","teacher","bookmarks","units","help"].includes(te)&&(Hi(c),ne.close(),Ee.exit(),Ee.closePicker(),Ae.close(),tt.close(),Te.close(),p.hidden=!0,m.hidden=!0),te&&at[te]&&at[te]()},_=()=>{let N=b.targetLog-b.currentLog;if(!b.paused&&Math.abs(N)>1e-5){let H=Math.abs(N)>8?.075:.145;b.currentLog+=b.prefersReducedMotion?N:N*H,b.currentLog=ln(b.currentLog,St,kt),w=!0}(w||Math.abs(b.currentLog-I)>.002)&&(s.dataset.exponent=b.currentLog.toFixed(5),s.dataset.pan=`${b.panX.toFixed(1)},${b.panY.toFixed(1)}`,s.dataset.selectedObject=b.selectedObjectId??"",b.scaleBand=$t(b.currentLog),b.visibleObjects=Hl(o,b),r0(l,b.currentLog,b.isMobile),fl(x,b.currentLog),Xe.updateVisual(),I=b.currentLog,w=b.layoutAnimating,s.dataset.visibleObjects=b.visibleObjects.map(H=>H.object.id).join(",")),C=requestAnimationFrame(_)};k(),F(i),fl(x,0),C=requestAnimationFrame(_);let O=()=>X();return window.addEventListener("scale-asset-ready",O),window.addEventListener("resize",k),window.addEventListener("keydown",Ze),a.addEventListener("wheel",ke,{passive:!1}),a.addEventListener("pointerdown",Oe),a.addEventListener("pointermove",ct),a.addEventListener("pointerup",Ke),a.addEventListener("pointercancel",Ke),a.addEventListener("click",At),c.addEventListener("pointerdown",P),c.addEventListener("pointermove",ht),c.addEventListener("pointerup",Ue),c.addEventListener("pointercancel",Ue),g.addEventListener("input",je),n.addEventListener("click",M),{destroy(){cancelAnimationFrame(C),window.removeEventListener("scale-asset-ready",O),window.removeEventListener("resize",k),window.removeEventListener("keydown",Ze),a.removeEventListener("wheel",ke),a.removeEventListener("pointerdown",Oe),a.removeEventListener("pointermove",ct),a.removeEventListener("pointerup",Ke),a.removeEventListener("pointercancel",Ke),a.removeEventListener("click",At),c.removeEventListener("pointerdown",P),c.removeEventListener("pointermove",ht),c.removeEventListener("pointerup",Ue),c.removeEventListener("pointercancel",Ue),g.removeEventListener("input",je),n.removeEventListener("click",M),Xe.destroy(),j.destroy(),ue.destroy(),Te.destroy(),ne.destroy(),Ee.destroy(),Ae.destroy(),tt.destroy(),A?.destroy(),n.innerHTML=""}};function Z(){let[N,H]=[...W.values()],te=H.x-N.x,$=H.y-N.y;return{distance:Math.max(12,Math.hypot(te,$)),center:{x:(N.x+H.x)/2,y:(N.y+H.y)/2}}}}function fl(n,e){let t=[["Subatomic",-15],["Atomic",-10],["Molecular",-8],["Cellular",-5],["Human",0],["Planetary",7],["Solar",11],["Stellar",13],["Galactic",21],["Cosmic",26.9]],i=$t(e).split(" ")[0].replace("Interstellar","Stellar"),s=["\u269B","\u25C9","\u2B21","\u25CC","\u2659","\u25CD","\u2600","\u2726","\u25CE","\u2727"];n.innerHTML=t.map(([r,a],o)=>`<button type="button" data-band-log="${a}" aria-pressed="${i.toLowerCase().startsWith(r.toLowerCase().slice(0,5))}" class="${i.toLowerCase().startsWith(r.toLowerCase().slice(0,5))?"active":""}"><span aria-hidden="true">${s[o]}</span>${r}</button>`).join("")}function r0(n,e,t){let i=$t(e),s=Number(e.toFixed(2));n.innerHTML=`<span>Current Scale</span><strong>10<sup>${s}</sup> <small>meters</small></strong><em>Band: ${i}</em><p>${Il(e,$t)}</p><small class="scale-actual-length">Reference length \u2248 ${Ls(10**e)}</small>`}function Ua(n){return{x:n.clientX,y:n.clientY}}export{Pv as createScaleUniverseExplorer};
/*! Bundled license information:

three/build/three.core.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
