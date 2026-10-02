import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const root = 'C:/Indian Servers/temp/Physics/studiotargetUI/all';
// Existing lesson routes, in mockup order. Null means no dedicated lesson route exists.
const lessons = {
concept_overview: ['@/concept-studio','@/graph','@/roadmap','@/experiments','@/comparison','@/quiz'],
measurement: ['@/measurement/meter-scale','@/measurement/vernier-caliper','@/measurement/micrometer','@/measurement/spherometer','@/measurement/mass-time','@/measurement/uncertainty'],
mechanics: ['@/mechanics/free-body-diagrams','@/mechanics/inclined-plane','@/mechanics/pulley-systems','@/mechanics/torque-levers','@/mechanics/equilibrium-com','@/mechanics/momentum-collisions'],
motion_kinematics: ['@/motion/position-time','@/motion/velocity-time','@/motion/acceleration-time','@/motion/projectile-motion','@/motion/relative-motion','@/motion/circular-motion'],
force_newton: ['balanced-unbalanced-forces','newton-s-second-law','balanced-unbalanced-forces','friction','inclined-plane','vector-resolution'],
work_energy_power: ['work-power','conservation-of-energy','conservation-of-energy','conservation-of-energy','work-power','sources-of-energy'],
gravitation: ['universal-gravitation','universal-gravitation','satellite-orbit','satellite-orbit','satellite-orbit','satellite-orbit'],
oscillations: ['shm-spring','simple-pendulum','shm-spring','shm-spring','ac-lcr-resonance','chaotic-coupled-oscillators'],
waves_sound: ['wave-lab','wave-lab','wave-lab','wave-lab','fourier-making-waves',null],
optics: ['reflection-plane-mirror','glass-slab-refraction','lens-formula','mirror-formula','young-double-slit','single-slit-diffraction'],
electricity: ['electrostatic-field-potential','electrostatic-field-potential','electrostatic-field-potential','ohms-law','kirchhoff-circuit','capacitor-lab'],
magnetism: ['magnetic-field-current','lorentz-force','magnetic-field-current','electromagnet','emi-faraday','electromagnet'],
electronics: ['semiconductor-diode','semiconductor-diode',null,null,'logic-gates',null],
thermodynamics: ['heat-and-temperature','heat-transfer','gas-laws','thermodynamic-process','statistical-ensemble-lab','thermodynamic-process'],
fluid_mechanics: ['density-float-sink','fluid-pressure','buoyancy','bernoulli-fluid-flow','bernoulli-fluid-flow',null],
modern_physics: ['advanced-quantum-operators','photoelectric-equation','de-broglie-wavelength','bohr-model','build-a-nucleus','nuclear-decay'],
astronomy_astrophysics: ['satellite-orbit','@/astrophysics','blackbody-spectrum','@/astrophysics','@/astrophysics','@/astrophysics'],
};
const rows=[];
const previous=await fs.readFile('docs/studio-rebuild/inventory.json','utf8').then(JSON.parse).catch(()=>({pages:[]}));
async function discover(dir) {
 for (const item of (await fs.readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))) {
  const file=path.join(dir,item.name);
  if(item.isDirectory()) await discover(file);
  else if(/\.(png|webp|jpg)$/i.test(item.name)) {
   const studio=path.basename(dir), slug=studio.replace(/^\d+_/, '');
   const index=Number(item.name.match(/^\d+/)?.[0])-1;
   const lesson=lessons[slug]?.[index];
   const bytes=await fs.readFile(file);
   rows.push({studio,page:item.name.replace(/^\d+_|\.png$/g,'').replaceAll('_',' '),mockup:path.relative(root,file).replaceAll('\\','/'),width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),sha256:crypto.createHash('sha256').update(bytes).digest('hex'),route:lesson?(lesson.startsWith('@')?lesson.slice(1):'/experiments/'+lesson):null,mapping:lesson?'Existing related route; page-specific coverage must be inspected':'No dedicated route found in lesson catalog; inspect subject metadata before implementation',implementation:'NOT STARTED',interaction:'NOT STARTED',physics:'NOT STARTED',screenshot:'NOT STARTED',responsive:'NOT STARTED',build:'NOT STARTED'});
  }
 }
}
await discover(root);
for(const row of rows){
 const prior=previous.pages.find(p=>p.mockup===row.mockup);
 if(prior)for(const key of ['implementation','interaction','physics','screenshot','responsive','build','remaining'])row[key]=prior[key]??row[key];
 if(!row.route){row.route='/concept-studio/'+row.studio.replace(/^\d+_/,'').replaceAll('_','-');row.mapping='Parent studio exists; no dedicated lesson route in catalog. Inspect and implement page-specific coverage.';}
}
for(const row of rows){const originals=rows.filter(r=>r.sha256===row.sha256&&r.mockup.split('/').length===2);if(row.mockup.split('/').length>2)row.duplicateOf=originals[0]?.mockup??null;}
rows.sort((a,b)=>a.studio.localeCompare(b.studio)||a.mockup.localeCompare(b.mockup));
await fs.mkdir('docs/studio-rebuild',{recursive:true});
await fs.writeFile('docs/studio-rebuild/inventory.json',JSON.stringify({root,generated:new Date().toISOString(),pages:rows},null,2));
await fs.writeFile('docs/studio-rebuild/PROGRESS.md',`# Physics Studio mockup rebuild\n\n${new Set(rows.map(r=>r.studio)).size} named studios; ${rows.length} image files; ${rows.filter(r=>r.duplicateOf).length} byte-identical nested copies. All mockups are inventoried recursively. Related routes are preserved; they are not assertions of full page coverage.\n\nCurrent page: ${rows.find(r=>!r.duplicateOf&&r.implementation!=='VERIFIED')?.page??'All pages verified'}. Continue in inventory order; do not advance past known defects.\n\nReusable engines: src/lib/labCalculators; src/experiments/shared/experimentRegistry.ts; lesson-specific src/experiments folders; ConceptStudioThreeScene; ConceptExperience; Recharts; existing SVG/Canvas tools. Preserve their contracts.\n\n| Studio | Page | Mockup | Existing route | Implementation | Interactions | Physics | Screenshot | Responsive | Build | Remaining |\n|---|---|---|---|---|---|---|---|---|---|---|\n`+rows.map(r=>`| ${r.studio} | ${r.page} | ${r.mockup} | ${r.route??'UNMAPPED'} | ${r.implementation} | ${r.interaction} | ${r.physics} | ${r.screenshot} | ${r.responsive} | ${r.build} | ${r.remaining??(r.duplicateOf?'Identical copy of '+r.duplicateOf:r.mapping)} |`).join('\n')+'\n');
console.log(JSON.stringify({studios:new Set(rows.map(r=>r.studio)).size,files:rows.length,duplicates:rows.filter(r=>r.duplicateOf).length,unmapped:rows.filter(r=>!r.route).map(r=>r.mockup)},null,2));

