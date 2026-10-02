import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = new URL("./", import.meta.url);
const oldAudit = JSON.parse(await fs.readFile(new URL("../physics-syllabus-gaps-20260903/gap_data.json", import.meta.url), "utf8"));
const current = JSON.parse(await fs.readFile(new URL("./lesson_data.json", import.meta.url), "utf8"));

const appTitles = new Set(current.lessonProfiles.map((item) => item.title));
const schoolFrameworks = "AP SCERT; NCERT/CBSE; Telangana SCERT; Kerala SCERT; Tamil Nadu; Karnataka; Maharashtra";
const higherFrameworks = "UGC model curriculum; University of Delhi; IISc";

const phaseFor = (g) => {
  if (g.stage === "Middle" || g.stage === "Secondary") return g.priority === "Critical" ? "Phase 1" : "Phase 2";
  if (g.stage === "Senior Secondary") return g.priority === "Critical" ? "Phase 1" : "Phase 2";
  if (g.stage === "Undergraduate") return g.priority === "Critical" ? "Phase 2" : "Phase 3";
  if (g.stage === "Postgraduate") return "Phase 3";
  return "Phase 4";
};

const normalizeNear = (value) => String(value || "None")
  .split(" • ")
  .map((part) => part.replace(/^\d+:\s*/, ""))
  .join("; ");

const gaps = oldAudit.gaps
  .filter((g) => !["Foundational", "Preparatory"].includes(g.stage))
  .map((g, index) => {
    const near = normalizeNear(g.near);
    const closest = near.split("; ").find((title) => appTitles.has(title)) || near;
    const frameworks = ["Middle", "Secondary"].includes(g.stage)
      ? schoolFrameworks
      : g.stage === "Senior Secondary"
        ? "AP Intermediate; CBSE Physics 042; representative state higher-secondary boards"
        : higherFrameworks + (g.stage === "Doctoral / Research" ? "; UGC PhD Regulations; CSIR-NET; institutional PhD coursework" : "; CSIR-NET Physical Sciences");
    return {
      id: `G-${String(index + 1).padStart(3, "0")}`,
      stage: g.stage,
      level: g.level,
      frameworks,
      domain: g.category,
      topic: g.title,
      theoryGap: g.concepts,
      theoryStatus: g.coverage === "Missing" ? "Missing" : "Partial",
      labGap: g.lab,
      labStatus: g.coverage === "Missing" ? "Missing" : "No dedicated syllabus lab",
      nearest: closest || "None",
      priority: g.priority,
      phase: phaseFor(g),
      evidence: g.sourceNames,
      sourceUrl: g.sourceUrls,
      action: g.coverage === "Missing"
        ? "Create theory sequence and an evidence-producing virtual lab."
        : "Extend the nearest lesson with the listed theory, controls, observations, and assessment."
    };
  });

const practicals = [
  ["P-001","Grades 6–8","AP/NCERT/state middle science","Motion measurement and speed-time/velocity-time graphs","Distance-Time Graph Builder","Partial","Add stopwatch/video trials, uncertainty, slope and area interpretation","Critical","Phase 1"],
  ["P-002","Grades 6–8","AP/NCERT/state middle science","Liquid pressure, atmospheric pressure and hydraulic lift","Fluid Pressure with Depth","Partial","Add Pascal-law syringe lift and atmospheric-pressure demonstrations","High","Phase 2"],
  ["P-003","Grades 6–8","AP/NCERT/state middle science","Archimedes principle and relative density by overflow","Buoyancy","Partial","Add displaced-volume balance and relative-density observations","High","Phase 2"],
  ["P-004","Grades 6–8","AP/NCERT/state middle science","Electroscope: charging by friction, contact and induction","Static Electricity and Lightning","Partial","Add leaf-electroscope controls and charge-sign inference","High","Phase 2"],
  ["P-005","Grades 6–8","AP/NCERT/state middle science","Fuse, MCB, earthing, overload and short-circuit safety","Heating Effect of Current","Partial","Build a fault-current and household-safety simulator","Critical","Phase 1"],
  ["P-006","Grades 6–8","AP/NCERT/state middle science","Simple DC motor construction","Lorentz Force on Moving Charge","Partial","Add coil, commutator, torque and energy-conversion controls","Critical","Phase 1"],
  ["P-007","Grades 6–8","AP/NCERT/state middle science","Generator induction foundations","Faraday Induction","Partial","Add hand-crank generator polarity and waveform investigation","High","Phase 2"],
  ["P-008","Grades 6–8","AP SCERT Class 8","Earthquake P/S waves and epicentre triangulation","Wave Lab","Partial","Add seismogram timing and three-station triangulation","High","Phase 2"],
  ["P-009","Grades 9–10","AP/CBSE/state secondary science","Ticker-tape or video fit for uniformly accelerated motion","Uniform Motion","Partial","Add equation fitting, residuals and uncertainty","Critical","Phase 1"],
  ["P-010","Grades 9–10","AP/CBSE/state secondary science","Momentum and impulse collision experiment","Elastic Collision","Partial","Add impulse-time graph and vector momentum balance","Critical","Phase 1"],
  ["P-011","Grades 9–10","AP/CBSE/state secondary science","Domestic wiring, kWh billing, fuse/MCB and earthing","Electric Power and Energy","Partial","Add virtual household circuit and billing workflow","Critical","Phase 1"],
  ["P-012","Grades 9–10","AP/CBSE/state secondary science","Motor assembly and Fleming left-hand rule","Lorentz Force on Moving Charge","Partial","Add physical motor parts and direction-rule assessment","High","Phase 2"],
  ["P-013","Grades 9–10","AP/CBSE/state secondary science","AC generator and Fleming right-hand rule","AC Generator","Partial","Add slip-ring waveform, polarity and direction tasks","High","Phase 2"],
  ["P-014","Grades 9–10","AP/CBSE/state secondary science","Prism spectrum and scattering tank","Prism Dispersion","Partial","Add minimum deviation, wavelength-dependent index and sky-colour model","High","Phase 2"],
  ["P-015","Class XI","CBSE Physics 042 / NCERT lab manual","Physical balance and principle of moments","Balancing Act","Partial","Add zero correction, sensitivity and uncertainty record","High","Phase 2"],
  ["P-016","Class XI","CBSE Physics 042 / NCERT lab manual","Second's pendulum and period-vs-length graph","Simple Pendulum","Partial","Add graph-derived effective length and error propagation","High","Phase 2"],
  ["P-017","Class XI","CBSE Physics 042 / NCERT lab manual","Pendulum energy dissipation: amplitude squared vs time","Damping Studio","Partial","Register as a lab with observation table and fit","High","Phase 2"],
  ["P-018","Class XI","CBSE Physics 042 / NCERT lab manual","Young modulus of a wire","Hooke's Law","Partial","Create stress-strain apparatus, diameter input and modulus fit","Critical","Phase 1"],
  ["P-019","Class XI","CBSE Physics 042 / NCERT lab manual","Helical spring force constant","Hooke's Law","Partial","Add load-extension graph, least count and hysteresis check","High","Phase 2"],
  ["P-020","Class XI","CBSE Physics 042 / NCERT lab manual","Boyle law: P-V and P-1/V graphs","Gas Laws and Kinetic Theory","Partial","Add two required graph views and uncertainty","High","Phase 2"],
  ["P-021","Class XI","CBSE Physics 042 / NCERT lab manual","Surface tension by capillary rise","None","Missing","Create capillary-rise lab with meniscus, radius and density","Critical","Phase 1"],
  ["P-022","Class XI","CBSE Physics 042 / NCERT lab manual","Viscosity by terminal velocity / Stokes law","Viscosity Studio","Partial","Register as a lab and add terminal-velocity fit","Critical","Phase 1"],
  ["P-023","Class XI","CBSE Physics 042 / NCERT lab manual","Specific heat by mixtures/cooling","Calorimetry Mixing Lab","Partial","Add calorimeter correction, cooling loss and uncertainty","High","Phase 2"],
  ["P-024","Class XI","CBSE Physics 042 / NCERT lab manual","Sonometer: frequency-length and tension-length relations","Standing Waves Studio","Partial","Register prescribed experiment with measured graph","High","Phase 2"],
  ["P-025","Class XI","CBSE Physics 042 / NCERT lab manual","Speed of sound by resonance tube","Echo and Speed of Sound","Partial","Add two-resonance positions and end correction","Critical","Phase 1"],
  ["P-026","Class XI","CBSE Physics 042 / NCERT lab manual","Cooling curve for molten wax","None","Missing","Create phase-change cooling curve with plateau analysis","High","Phase 2"],
  ["P-027","Class XI","CBSE Physics 042 / NCERT lab manual","Bimetallic strip and thermal expansion activities","Heat Transfer","Partial","Add differential-expansion geometry and observation task","High","Phase 2"],
  ["P-028","Class XII","CBSE Physics 042 / NCERT lab manual","Potentiometer: compare EMFs and internal resistance","Cell Internal Resistance","Partial","Create wire-length null-point potentiometer apparatus","Critical","Phase 1"],
  ["P-029","Class XII","CBSE Physics 042 / NCERT lab manual","Moving-coil galvanometer: resistance, figure of merit and conversion","None","Missing","Create half-deflection and ammeter/voltmeter conversion lab","Critical","Phase 1"],
  ["P-030","Class XII","CBSE Physics 042 / NCERT lab manual","AC mains frequency using sonometer","Standing Waves Studio","Partial","Add electromagnetic driver and frequency inference","High","Phase 2"],
  ["P-031","Class XII","CBSE Physics 042 / NCERT lab manual","Convex/concave mirror and lens focal-length variants","Mirror Formula; Lens Formula","Partial","Add prescribed u-v and auxiliary-lens methods","High","Phase 2"],
  ["P-032","Class XII","CBSE Physics 042 / NCERT lab manual","Prism minimum-deviation refractive index","Prism Dispersion","Partial","Add angle-of-incidence/deviation table and Dm fit","High","Phase 2"],
  ["P-033","Class XII","CBSE Physics 042 / NCERT lab manual","Diode I-V curve in forward and reverse bias","Semiconductor Diode and Rectifier","Partial","Add real curve-tracing workflow and breakdown limits","High","Phase 2"],
  ["P-034","Class XII","CBSE Physics 042 / NCERT lab manual","LDR response versus light intensity","Sensors Studio","Partial","Register as lab with distance/intensity model and graph","High","Phase 2"],
  ["P-035","Undergraduate","UGC/DU/IISc representative core","Oscilloscope, signal generator and phase measurement","None","Missing","Create virtual CRO with calibration and Lissajous mode","Critical","Phase 2"],
  ["P-036","Undergraduate","UGC/DU representative core","Op-amp, feedback and active filters","Amplifiers Studio","Partial","Add inverting/non-inverting/filter measurements and Bode plots","Critical","Phase 2"],
  ["P-037","Undergraduate","UGC/DU representative core","Flip-flops, counters, ADC and DAC","Logic Gates","Partial","Add stateful sequential logic and timing diagrams","High","Phase 3"],
  ["P-038","Undergraduate","UGC/DU/IISc representative core","Crystal structure and X-ray diffraction","None","Missing","Create Bragg diffraction and powder-pattern indexing lab","Critical","Phase 2"],
  ["P-039","Undergraduate","UGC/DU/IISc representative core","Hall effect, band gap and semiconductor transport","Semiconductor Diode and Rectifier","Partial","Add Hall voltage, carrier sign/density and band-gap fit","Critical","Phase 2"],
  ["P-040","Undergraduate","UGC/DU representative core","Michelson/Fabry-Perot interferometry and coherence","Young's Double Slit","Partial","Create movable-mirror interferometer and coherence controls","High","Phase 3"],
  ["P-041","Undergraduate","UGC/DU representative core","Laser cavity, Gaussian beam and fibre-optic link","Total Internal Reflection","Partial","Add laser threshold/modes and fibre loss/dispersion","Critical","Phase 2"],
  ["P-042","Undergraduate/PG","DU/IISc/CSIR representative curricula","Radiation detector calibration, statistics and shielding","Nuclear Decay and Half-Life","Partial","Add GM/scintillator response, dead time and dose safety","Critical","Phase 2"],
  ["P-043","Undergraduate/PG","DU/IISc representative curricula","DAQ, sensors, lock-in detection and noise spectra","Sensors Studio","Partial","Create instrument chain, calibration and signal-below-noise lab","Critical","Phase 2"],
  ["P-044","PG","DU/IISc representative curricula","XRD, Raman, SEM/TEM and magnetometry workflow","None","Missing","Create multi-technique materials characterization lab","Critical","Phase 3"],
  ["P-045","PG","DU/IISc representative curricula","Plasma particle-in-cell / MHD experiment","Lorentz Force on Moving Charge","Partial","Add collective fields, Debye shielding and instability diagnostics","High","Phase 3"],
  ["P-046","PG/PhD","IISc/institutional research training","Vacuum, cryogenic and high-field commissioning","None","Missing","Create safety-first apparatus commissioning scenarios","High","Phase 4"],
  ["P-047","PhD","UGC PhD / institutional research training","Bayesian inference, model comparison and inverse problems","Measurement, Error, and Significant Figures","Partial","Add reproducible notebook-style parameter estimation","Critical","Phase 4"],
  ["P-048","PhD","UGC PhD / institutional research training","Reproducibility, version control, FAIR data and research ethics","Computational Physics Workflow","Partial","Create auditable research workflow, metadata and peer-review tasks","Critical","Phase 4"],
];

const frameworks = [
  ["AP SCERT","Classes 6–7","General science textbooks, two semesters","Partial","App map uses only five broad focus tags and does not enumerate every chapter/activity.","Add official AP chapter/activity rows and evidence links."],
  ["AP SCERT","Class 8","Physical Science, semesters 1–2","Partial","Strong headline matches; electroscope, earthquake/seismic analysis, safety and device-building need dedicated labs.","Map every textbook chapter and activity, not only five strands."],
  ["AP SCERT / BSE AP","Classes 9–10","Physical science / general science","Partial","Core motion, force, gravitation, energy, optics, electricity and magnetism exist; depth and practical equivalence remain incomplete.","Add experiment-level equivalence and board-year metadata."],
  ["AP Intermediate","Classes 11–12","Physics theory and practical pathway","Partial","No explicit BIEAP framework in the app; senior-secondary practicals are not audited separately.","Create AP Intermediate theory and practical framework rows."],
  ["NCERT / CBSE","Classes 6–8","NCF-SE/new textbooks plus middle-stage science","Partial","Headline concepts exist, but curriculum granularity, competencies and practical evidence are incomplete.","Map learning outcomes and prescribed activities."],
  ["CBSE Science 086","Classes 9–10","Secondary science","Partial","All headline units appear, but motor/generator, domestic wiring, motion graphs and investigatory work are shallow.","Add subtopic-level theory and practical records."],
  ["CBSE Physics 042","Class 11","14 theory chapters and prescribed practicals","Partial","Theory families exist; surface tension, resonance tube, Young modulus, cooling curve and bimetal activities lack full labs.","Prioritize P-018, P-021, P-025 and instrument accuracy."],
  ["CBSE Physics 042","Class 12","9 units plus prescribed practicals","Partial","Strong electrostatics/optics/modern coverage; potentiometer, galvanometer conversion, AC phasors, magnetism in matter and transistor amplifier remain gaps.","Prioritize P-028 and P-029, then theory depth."],
  ["Telangana SCERT","Classes 6–10","State science and physical-science e-books","Not mapped","App has no Telangana framework despite similar content.","Create board-specific mapping and retain chapter names/year."],
  ["Kerala SCERT","Classes 6–10","Basic science and dedicated Physics IX–X","Not mapped","Official Physics books exist, but the app has no Kerala lane.","Map Kerala IX–X chapter and activity differences."],
  ["Tamil Nadu","Classes 6–12","State science/physics textbooks","Not mapped","No Tamil Nadu framework or practical equivalence is represented.","Add theory and lab mapping after textbook chapter extraction."],
  ["Karnataka","Classes 6–12","State science/physics pathway","Not mapped","No Karnataka framework or practical equivalence is represented.","Add state textbook and PUC practical mapping."],
  ["Maharashtra Balbharati","Classes 6–12","State science and XI–XII Physics","Not mapped","No Maharashtra framework; XI–XII topics and activities include state-specific sequencing.","Map Balbharati XI–XII chapter/activity structure."],
  ["UGC / University of Delhi / IISc","Undergraduate","BSc/BS core and labs","Large gap","Only five coarse undergraduate topics are in the app curriculum map; 30 normalized core gaps remain.","Build mathematical physics, electronics, solid-state and instrumentation sequence."],
  ["University of Delhi / IISc / CSIR","Postgraduate","MSc/MS core, electives and labs","Large gap","Only five coarse postgraduate topics are mapped; 20 advanced theory/lab gaps remain.","Add QM, EM, condensed matter, nuclear/particle, optics and computation depth."],
  ["UGC PhD / IISc / institutional","PhD","Coursework plus research training","Large gap","A PhD is specialization-dependent; app has five broad research lanes but lacks core research-method infrastructure.","Prioritize reproducibility, inference, instrumentation, safety and data stewardship."],
];

const sources = [
  ["AP Department of School Education","AP government textbooks, Classes 6–10","Current portal accessed 2026-09-10","https://cse.ap.gov.in/textBooksDownloadingPagetitleWise","Official AP textbook inventory; direct PDFs used for Class 8 and 9 checks."],
  ["BSE Andhra Pradesh","SSC 2026 model papers and blueprints","2026","https://bse.ap.gov.in/SUBJECT_WISE_MODEL_PAPER_26.htm","Current Class 10 assessment structure and subject naming."],
  ["AP SCERT / Samagra Shiksha","Class 8 Physical Science Semester 2","First published 2022; impressions 2023–2024","https://cse.ap.gov.in/downloadBooks/Physics%20Books/8_Physics_SEM-2_Textbook.pdf/8","Light, chemical effects of current, natural phenomena, combustion, stars and solar system."],
  ["AP SCERT / Samagra Shiksha","Class 9 Physical Science Semesters 1–2","Current portal copy","https://cse.ap.gov.in/textBooksDownloadingPagetitleWise","Matter/atoms/motion; force, gravitation, work-energy and sound."],
  ["NCERT","NCF School Education 2023","2023; official page current 2026","https://ncert.nic.in/focus-group.php?ln=en","Stage outcomes, competencies and experiential science direction."],
  ["NCERT","Textbooks PDF portal, Classes I–XII","Current portal","https://ncert.nic.in/textbook.php","NCERT textbook chapter sources."],
  ["NCERT","Science exemplar chapter inventory","Current portal","https://ncert.nic.in/exemplar-problems.php?ln=en","Classes 6–10 science chapter cross-check."],
  ["NCERT","Science and Physics laboratory manuals","Current portal","https://ncert.nic.in/science-laboratory-manual.php","Official experiments, activities, projects and demonstrations."],
  ["CBSE Academic","Curriculum 2026–27","2026–27","https://cbseacademic.nic.in/curriculum_2027.html","Current secondary and senior-secondary curriculum index."],
  ["CBSE Academic","Physics 042, Classes XI–XII","2026–27","https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Physics_SecP2_2026-27.pdf","Theory units, 30-mark practical scheme, experiments and activities."],
  ["Telangana SCERT","Textbooks I–X","2024–25 portal edition","https://www.scert.telangana.gov.in/Home.aspx/pdf/Pdf/Pdf/DisplayContent.aspx?encry=ammkNW4%2Fgx+NeApstGPX+A%3D%3D","Representative state-board physical-science check."],
  ["Kerala SCERT","Curriculum 2024 and revised textbooks","2024 onward","https://scert.kerala.gov.in/curriculum-2024/","Representative state curriculum and dedicated Physics IX."],
  ["Kerala SCERT","Standard 10 textbooks","Current portal","https://scert.kerala.gov.in/standard-10/","Dedicated Physics Parts 1 and 2."],
  ["Tamil Nadu Textbook Corporation","School textbook catalogue","2026–27","https://www.textbookcorp.in/","Representative state textbook availability and grade coverage."],
  ["Maharashtra Balbharati","e-Book library","Current portal","https://ebooks.ebalbharati.in/","State textbook inventory, Classes 1–12."],
  ["Maharashtra Balbharati","Physics Standard XI","Implemented 2019–20","https://books.ebalbharati.in/pdfs/1103020415.pdf","Representative higher-secondary physics structure and activities."],
  ["UGC","Model Curriculum portal — Physics","Current portal","https://www.ugc.gov.in/facultycorner/Model_Curriculum","National higher-education reference; universities retain autonomy."],
  ["University of Delhi","BSc (Hons) Physics programme structure","Current page","https://academicaffairs.du.ac.in/syllabi/department-of-physics-and-astrophysics/","Detailed undergraduate theory/practical structure."],
  ["University of Delhi","MSc Physics first-year PGCF","2025 curriculum","https://physics.du.ac.in/pdfs/syll2025/MSc_PhysicsPGCF1stYear.pdf","Current representative postgraduate mathematical/core physics."],
  ["IISc","BS (Research) Physics course structure","Current page","https://bs-ug.iisc.ac.in/course-structure/physics?from=home","Research-intensive undergraduate core, labs and electives."],
  ["IISc CHEP","Academic programmes and PhD course requirements","Current page","https://chep.iisc.ac.in/academic-programmes/","Representative PhD coursework and comprehensive-exam expectations."],
  ["UGC","Minimum Standards and Procedure for Award of PhD Regulations","2022","https://www.ugc.gov.in/KeyInitiative?ID=5a+g5HaAjyPaGaXtnVc3+Q%3D%3D","PhD programme baseline; not a single national physics syllabus."],
  ["CSIR-HRDG","CSIR-UGC NET Physical Sciences syllabus portal","Current page accessed 2026-09-10","https://www.csirhrdg.res.in/Home/Index/1/Default/3485/78","Representative postgraduate/research-entry breadth and analytical expectations."],
  ["Physics Simulator source","Current curriculum and experiment registry","Workspace snapshot 2026-09-10","Local workspace: src/lib/curriculum.ts and src/lib/experiments.ts","92 registered lessons; 74 coarse curriculum topics; app mapping logic reviewed."],
];

const wb = Workbook.create();
const summary = wb.worksheets.add("Summary");
const gapSheet = wb.worksheets.add("Gap Register");
const practicalSheet = wb.worksheets.add("Practical Gaps");
const frameworkSheet = wb.worksheets.add("Framework Review");
const inventorySheet = wb.worksheets.add("App Inventory");
const sourceSheet = wb.worksheets.add("Sources");

const colors = { navy: "#172033", blue: "#315B8A", pale: "#EAF0F7", ink: "#1F2937", muted: "#667085", line: "#D0D5DD", red: "#FDE8E7", amber: "#FFF4D6", green: "#E7F4EA", white: "#FFFFFF" };
const font = "Arial";

function setup(sheet) {
  sheet.showGridLines = false;
  sheet.getRange("A1:Z500").format.font = { name: font, size: 10, color: colors.ink };
}

function heading(sheet, title, note, lastCol) {
  setup(sheet);
  sheet.getRange(`A2:${lastCol}2`).merge();
  sheet.getRange("A2").values = [[title]];
  sheet.getRange(`A4:${lastCol}4`).merge();
  sheet.getRange("A4").values = [[note]];
  sheet.getRange("A2").format = { font: { name: font, size: 16, bold: true, color: colors.ink }, verticalAlignment: "center" };
  sheet.getRange("A3:" + lastCol + "3").format.borders = { bottom: { style: "thin", color: colors.blue } };
  sheet.getRange("A4").format = { font: { name: font, size: 10, italic: true, color: colors.muted }, wrapText: true, verticalAlignment: "top" };
  sheet.getRange("2:2").format.rowHeight = 28;
  sheet.getRange("4:4").format.rowHeight = 32;
}

function addTable(sheet, startRow, headers, rows, name, widths, freezeCols = 2) {
  const start = startRow;
  const end = startRow + rows.length;
  const lastCol = colName(headers.length);
  sheet.getRangeByIndexes(start - 1, 0, rows.length + 1, headers.length).values = [headers, ...rows];
  const table = sheet.tables.add(`A${start}:${lastCol}${end}`, true, name);
  table.style = "TableStyleMedium2";
  table.showBandedRows = true;
  table.showFilterButton = true;
  sheet.getRange(`A${start}:${lastCol}${start}`).format = { fill: colors.blue, font: { name: font, bold: true, color: colors.white }, wrapText: true, horizontalAlignment: "center", verticalAlignment: "center" };
  sheet.getRange(`A${start}:${lastCol}${start}`).format.rowHeight = 36;
  if (rows.length) {
    sheet.getRange(`A${start + 1}:${lastCol}${end}`).format = { font: { name: font, size: 9, color: colors.ink }, wrapText: true, verticalAlignment: "top" };
    sheet.getRange(`A${start}:${lastCol}${end}`).format.borders = { insideHorizontal: { style: "thin", color: colors.line }, bottom: { style: "thin", color: colors.line } };
  }
  widths.forEach((width, index) => sheet.getRangeByIndexes(0, index, Math.max(end, 8), 1).format.columnWidth = width);
  sheet.freezePanes.freezeRows(start);
  sheet.freezePanes.freezeColumns(freezeCols);
  return { end, lastCol };
}

function colName(n) {
  let s = "";
  while (n > 0) { n--; s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26); }
  return s;
}

heading(summary, "Physics syllabus gap audit", "Grades 6 through PhD. Current app snapshot compared with AP SCERT, CBSE/NCERT, representative state boards, and representative Indian university/research curricula.", "L");
const summaryMetrics = [
  ["Registered app lessons/labs", current.lessonProfiles.length],
  ["Curriculum topics in app map", current.curriculumTopics.length],
  ["Normalized theory gap candidates", gaps.length],
  ["Practical/lab gaps reviewed", practicals.length],
  ["App lessons with generic theory", current.lessonProfiles.filter((x) => String(x.theory).startsWith("This starter experiment")).length],
  ["App lessons with 0–1 viva question", current.lessonProfiles.filter((x) => x.vivaCount <= 1).length],
  ["Unmapped registered app lessons", current.lessonProfiles.filter((x) => x.mappedTopics.length === 0).length],
];
summary.getRange("A6:B6").merge();
summary.getRange("A6").values = [["Metric"]];
summary.getRange("C6").values = [["Result"]];
for (let row = 7; row <= 13; row++) {
  summary.getRange(`A${row}:B${row}`).merge();
  summary.getRange(`A${row}`).values = [[summaryMetrics[row - 7][0]]];
  summary.getRange(`C${row}`).values = [[summaryMetrics[row - 7][1]]];
}
summary.getRange("A6:C6").format = { fill: colors.blue, font: { name: font, bold: true, color: colors.white }, horizontalAlignment: "center" };
summary.getRange("A7:B13").format.font = { name: font, bold: true, color: colors.ink };
summary.getRange("C7:C13").format = { fill: colors.pale, font: { name: font, size: 12, bold: true, color: colors.blue }, horizontalAlignment: "right" };
summary.getRange("A6:C13").format.borders = { preset: "outside", style: "thin", color: colors.line };

summary.getRange("D6:H6").values = [["Stage", "All gaps", "Critical", "Missing theory", "Partial theory"]];
summary.getRange("D6:H6").format = { fill: colors.blue, font: { name: font, bold: true, color: colors.white }, horizontalAlignment: "center" };
const stages = ["Middle","Secondary","Senior Secondary","Undergraduate","Postgraduate","Doctoral / Research"];
summary.getRange("D7:D12").values = stages.map((s) => [s]);
for (let row = 7; row <= 12; row++) {
  summary.getRange(`E${row}`).formulas = [[`=COUNTIF('Gap Register'!$B$7:$B$124,D${row})`]];
  summary.getRange(`F${row}`).formulas = [[`=COUNTIFS('Gap Register'!$B$7:$B$124,D${row},'Gap Register'!$L$7:$L$124,"Critical")`]];
  summary.getRange(`G${row}`).formulas = [[`=COUNTIFS('Gap Register'!$B$7:$B$124,D${row},'Gap Register'!$H$7:$H$124,"Missing")`]];
  summary.getRange(`H${row}`).formulas = [[`=COUNTIFS('Gap Register'!$B$7:$B$124,D${row},'Gap Register'!$H$7:$H$124,"Partial")`]];
}
summary.getRange("D7:H12").format.borders = { insideHorizontal: { style: "thin", color: colors.line }, bottom: { style: "thin", color: colors.line } };
summary.getRange("D:D").format.columnWidth = 24;
summary.getRange("E:H").format.columnWidth = 14;
summary.getRange("E7:H12").format.horizontalAlignment = "right";

summary.getRange("A16:L16").merge();
summary.getRange("A16").values = [["Highest-priority findings"]];
summary.getRange("A16").format = { fill: colors.navy, font: { name: font, size: 11, bold: true, color: colors.white } };
summary.getRange("A17:C23").values = [
  ["Coverage logic", null, "The syllabus UI marks a band covered whenever any linked experiment exists; it does not test required subtopics or practical equivalence."],
  ["AP coverage", null, "AP SCERT is present as four broad bands, but AP chapter/activity evidence and AP Intermediate practicals are not represented at item level."],
  ["School theory", null, "Most headline domains exist. The largest gaps are kinematics graphs, impulse, domestic wiring/safety, motor-generator construction, detailed optics and energy-system calculations."],
  ["XI–XII labs", null, "Priority gaps are Young modulus, surface tension, resonance tube, potentiometer and moving-coil galvanometer conversion."],
  ["UG core", null, "Mathematical physics, Maxwell theory, network analysis, analog/digital electronics, solid state, interferometry, photonics and instrumentation are incomplete."],
  ["PG/PhD", null, "Advanced quantum/field theory, many-body and condensed matter, plasma, detector/materials labs, inference, reproducibility, safety and data stewardship remain largely absent."],
  ["Content depth", null, "Nine registered lessons still use generic theory/procedure text; 89 of 92 have at most one viva question; 17 registered lessons are not linked to curriculum topics."],
];
for (let r = 17; r <= 23; r++) {
  summary.getRange(`A${r}:B${r}`).merge();
  summary.getRange(`C${r}:L${r}`).merge();
}
summary.getRange("A17:L23").format = { wrapText: true, verticalAlignment: "top", borders: { insideHorizontal: { style: "thin", color: colors.line } } };
summary.getRange("A17:B23").format = { font: { name: font, bold: true, color: colors.ink }, horizontalAlignment: "left" };
summary.getRange("A17:L23").format.rowHeight = 34;
summary.getRange("A:B").format.columnWidth = 18;
for (let c = 2; c < 12; c++) summary.getRangeByIndexes(0, c, 30, 1).format.columnWidth = 12;
summary.getRange("D:D").format.columnWidth = 22;

heading(gapSheet, "Theory and curriculum gap register", "Normalized missing or partial physics topics from Grade 6 through PhD. A nearby simulation does not count as complete coverage unless it teaches the listed subtopic and produces syllabus-level evidence.", "P");
const gapRows = gaps.map((g) => [g.id,g.stage,g.level,g.frameworks,g.domain,g.topic,g.theoryGap,g.theoryStatus,g.labGap,g.labStatus,g.nearest,g.priority,g.phase,g.action,g.evidence,g.sourceUrl]);
addTable(gapSheet, 6, ["Gap ID","Stage","Level","Frameworks","Domain","Missing / incomplete topic","Theory required","Theory status","Required lab / simulation","Lab status","Nearest current app content","Priority","Roadmap","Recommended action","Evidence source","Source URL"], gapRows, "GapRegisterTable", [10,20,20,42,20,38,48,15,44,22,36,13,13,50,40,55], 3);
gapSheet.getRange(`H7:H${6 + gapRows.length}`).conditionalFormats.addCustom('=H7="Missing"',{fill:colors.red,font:{color:"#9B1C1C",bold:true}});
gapSheet.getRange(`H7:H${6 + gapRows.length}`).conditionalFormats.addCustom('=H7="Partial"',{fill:colors.amber,font:{color:"#8A5A00",bold:true}});
gapSheet.getRange(`L7:L${6 + gapRows.length}`).conditionalFormats.addCustom('=L7="Critical"',{fill:colors.red,font:{color:"#9B1C1C",bold:true}});

heading(practicalSheet, "Practical and virtual-lab gaps", "Prescribed or representative experiments that are missing or only partly represented. Status considers apparatus, controls, observation table, graph/fit, uncertainty, precautions and assessment—not just a related animation.", "I");
addTable(practicalSheet, 6, ["Practical ID","Level","Framework / basis","Required experiment","Nearest current app content","Status","What must be added","Priority","Roadmap"], practicals, "PracticalGapsTable", [11,18,34,42,34,13,52,13,13], 2);
practicalSheet.getRange(`F7:F${6 + practicals.length}`).conditionalFormats.addCustom('=F7="Missing"',{fill:colors.red,font:{color:"#9B1C1C",bold:true}});
practicalSheet.getRange(`F7:F${6 + practicals.length}`).conditionalFormats.addCustom('=F7="Partial"',{fill:colors.amber,font:{color:"#8A5A00",bold:true}});
practicalSheet.getRange(`H7:H${6 + practicals.length}`).conditionalFormats.addCustom('=H7="Critical"',{fill:colors.red,font:{color:"#9B1C1C",bold:true}});

heading(frameworkSheet, "Framework coverage review", "Framework-level diagnosis. “Not mapped” means the app has relevant physics content but no explicit board/university framework lane. Higher education and PhD curricula are institution- and specialization-dependent.", "F");
addTable(frameworkSheet, 6, ["Framework","Level","Target scope","Current status","Finding","Next action"], frameworks, "FrameworkReviewTable", [28,20,40,16,60,48], 2);
frameworkSheet.getRange(`D7:D${6 + frameworks.length}`).conditionalFormats.addCustom('=D7="Not mapped"',{fill:colors.red,font:{color:"#9B1C1C",bold:true}});
frameworkSheet.getRange(`D7:D${6 + frameworks.length}`).conditionalFormats.addCustom('=D7="Large gap"',{fill:colors.red,font:{color:"#9B1C1C",bold:true}});
frameworkSheet.getRange(`D7:D${6 + frameworks.length}`).conditionalFormats.addCustom('=D7="Partial"',{fill:colors.amber,font:{color:"#8A5A00",bold:true}});

heading(inventorySheet, "Current app lesson inventory", "Registered experiment/lesson records extracted from the current source tree. Dedicated studio pages may exist outside this registry; that mismatch is itself a mapping and discoverability gap.", "L");
const inventoryRows = current.lessonProfiles
  .slice()
  .sort((a,b) => String(a.category).localeCompare(String(b.category)) || String(a.title).localeCompare(String(b.title)))
  .map((x) => [x.lessonId,x.title,x.category,x.classLevel,x.difficulty,x.mappedClasses.join("; ") || "Unmapped",x.mappedTopics.join("; ") || "Unmapped",x.theory,x.formulae.join("; "),x.apparatus.join("; "),x.vivaCount,x.readinessScore]);
addTable(inventorySheet, 6, ["Lesson ID","Title","Domain","Declared level","Difficulty","Mapped classes","Mapped topics","Theory text","Formulae","Apparatus","Viva count","Readiness score"], inventoryRows, "AppInventoryTable", [30,34,20,28,14,26,42,62,46,46,12,15], 2);
inventorySheet.getRange(`F7:G${6 + inventoryRows.length}`).conditionalFormats.addCustom('=F7="Unmapped"',{fill:colors.red,font:{color:"#9B1C1C",bold:true}});

heading(sourceSheet, "Sources and scope", "Primary/official sources were preferred. State-board sampling is representative, not an assertion that every state uses an identical sequence. University and PhD rows are normalized from representative curricula because India has no single universal physics syllabus above Class 12.", "E");
addTable(sourceSheet, 6, ["Publisher / authority","Source","Edition / date","URL or access note","Used for"], sources, "SourcesTable", [34,48,28,70,64], 1);
sourceSheet.getRange(`D7:D${6 + sources.length}`).format.font = { name: font, size: 9, color: "#175CD3", underline: true };

for (const sheet of [summary, gapSheet, practicalSheet, frameworkSheet, inventorySheet, sourceSheet]) {
  const used = sheet.getUsedRange();
  if (used) used.format.verticalAlignment = "top";
}

wb.recalculate();

const checks = {};
checks.summary = (await wb.inspect({kind:"table",range:"Summary!A2:H23",include:"values,formulas",tableMaxRows:24,tableMaxCols:8,maxChars:12000})).ndjson;
checks.gaps = (await wb.inspect({kind:"table",range:"Gap Register!A6:P14",include:"values,formulas",tableMaxRows:10,tableMaxCols:16,maxChars:12000})).ndjson;
checks.practicals = (await wb.inspect({kind:"table",range:"Practical Gaps!A6:I14",include:"values,formulas",tableMaxRows:10,tableMaxCols:9,maxChars:10000})).ndjson;
checks.errors = (await wb.inspect({kind:"match",searchTerm:"#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",options:{useRegex:true,maxResults:300},summary:"final formula error scan",maxChars:8000})).ndjson;
await fs.writeFile(new URL("./audit_checks.ndjson", import.meta.url), Object.entries(checks).map(([k,v]) => `# ${k}\n${v}`).join("\n"), "utf8");

const previews = [
  ["Summary","A1:L23","preview-summary.png"],
  ["Gap Register","A1:P22","preview-gaps.png"],
  ["Practical Gaps","A1:I22","preview-practicals.png"],
  ["Framework Review","A1:F22","preview-frameworks.png"],
  ["App Inventory","A1:L20","preview-inventory.png"],
  ["Sources","A1:E22","preview-sources.png"],
];
for (const [sheetName, range, file] of previews) {
  const blob = await wb.render({sheetName,range,scale:1,format:"png"});
  await fs.writeFile(new URL(`./${file}`, import.meta.url), new Uint8Array(await blob.arrayBuffer()));
}

const exported = await SpreadsheetFile.exportXlsx(wb);
await exported.save(fileURLToPath(new URL("./physics_syllabus_gap_audit_grade6_to_phd.xlsx", import.meta.url)));

console.log(JSON.stringify({lessons: current.lessonProfiles.length, curriculumTopics: current.curriculumTopics.length, gaps: gaps.length, practicals: practicals.length, sources: sources.length}));
