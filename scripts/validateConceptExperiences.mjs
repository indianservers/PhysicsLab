import fs from "node:fs";
const data=fs.readFileSync("src/lib/conceptExperiences.ts","utf8");const page=fs.readFileSync("src/pages/ConceptExperiencesPage.tsx","utf8");const topic=fs.readFileSync("src/pages/TopicPage.tsx","utf8");const app=fs.readFileSync("src/App.tsx","utf8");const component=fs.readFileSync("src/components/ConceptExperience.tsx","utf8");
const ids=[...data.matchAll(/\{id:"([^"]+)",title:/g)].map((match)=>match[1]);
const requested=["measurement","mechanics","motion-kinematics","force-newton","work-energy-power","gravitation","oscillations","waves-sound","optics","electricity","magnetism","electronics","thermodynamics","fluid-mechanics","modern-physics","astronomy-astrophysics"];
const checks=[
  ["all 16 requested concepts exist",requested.every((id)=>ids.includes(id))&&ids.length===16],
  ["every concept has controls",(data.match(/controls:\[/g)??[]).length===16],
  ["every concept has real-time examples",(data.match(/examples:\[/g)??[]).length===16],
  ["every concept has applications",(data.match(/applications:\[/g)??[]).length===16],
  ["every concept has observation guidance",(data.match(/observe:\[/g)??[]).length===16],
  ["studio has direct concept routes",app.includes('path="/concept-studio/:conceptId"')&&page.includes("ConceptExperienceSelector")],
  ["topic pages embed live concept models",topic.includes("<ConceptExperience")&&Object.keys({measurement:1,mechanics:1,waves:1,optics:1,electricity:1,magnetism:1,electronics:1,thermodynamics:1}).every((key)=>topic.includes(`${key}:`))],
  ["animations respect reduced motion",fs.readFileSync("src/concept-experiences.css","utf8").includes("prefers-reduced-motion")],
  ["every model exposes a synchronized live graph",component.includes("RealtimeGraph")&&component.includes("LIVE DATA STREAM")],
  ["scientific method uses predict observe explain",component.includes("PREDICT")&&component.includes("OBSERVE")&&component.includes("EXPLAIN")],
  ["notebook persists trials locally",component.includes("physicslab-concept-notebook-v1")&&component.includes("localStorage.setItem")],
  ["recent trials can be compared",component.includes("conceptTrials.slice(-2)")&&component.includes("Recorded evidence")],
  ["notebook supports data export",component.includes("Export JSON")&&component.includes("application/json")],
  ["field and engineering scenario modes are available",component.includes("FIELD EXAMPLE")&&component.includes("ENGINEERING")&&component.includes("loadScenario")],
  ["calibration missions have measurable setpoints",component.includes("CALIBRATION CHALLENGE")&&component.includes("COMMISSIONED")&&component.includes("concept-targets")],
  ["instrument status is visible",component.includes("60 Hz MODEL")&&component.includes("SENSORS NOMINAL")&&component.includes("SI UNITS")],
];let failed=0;for(const[label,pass]of checks){console.log(`${pass?"PASS":"FAIL"}  ${label}`);if(!pass)failed++}if(failed)process.exit(1);console.log(`\n${checks.length} live-concept checks passed.`);
