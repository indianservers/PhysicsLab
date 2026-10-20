import fs from 'node:fs';
const audit = JSON.parse(fs.readFileSync('artifacts/scale-universe-upgrade/remaining-image-audit.json', 'utf8'));
const subjects = {
  football: 'a round association football (soccer ball) with black and white panels',
  'paper-thickness': 'a single thin white sheet of paper viewed nearly edge-on, with a sliver of its top surface visible',
  'water-molecule': 'a water ball-and-stick molecule, one red oxygen bonded to two white hydrogen atoms in a bent configuration',
  'oxygen-molecule': 'an oxygen molecule, two red oxygen atoms bonded together',
  'carbon-dioxide': 'a carbon dioxide molecule, a gray carbon atom between two red oxygen atoms in a straight line',
  'nitrogen-molecule': 'a nitrogen molecule, two blue nitrogen atoms bonded together',
  'india-width': 'a complete recognizable outline of India, shaded relief land only, no surrounding sea',
  'earth-atmosphere': 'an Earth globe surrounded by a thin blue atmospheric shell',
  'solar-system': 'an illustrative Solar System, central Sun and eight planets on faint orbital paths',
  'cell-tower': 'a full-height cellular communications lattice tower with sector antennas',
  'apartment-floor': 'a cutaway single apartment floor with floor slab, ceiling slab and exterior wall',
  'rain-cell': 'an isolated localized rain cloud with narrow rain streaks directly below it',
  thunderstorm: 'an isolated towering cumulonimbus cloud with anvil top and a rain shaft',
};
const records = audit.filter(object => object.status === 'needs-specific-cutout').map(object => {
  let style = 'detailed realistic three-dimensional educational illustration, subject-specific shape, materials and features';
  if (['Galaxies', 'Cosmic Structures', 'Stars'].includes(object.categoryGroup)) style = 'detailed illustrative astronomical visualization with structure and coloration appropriate to the named subject, isolated luminous structure without a surrounding starfield';
  if (object.categoryGroup === 'Earth and Geography') style = 'detailed miniature architectural or geographic cutout; landscapes are an isolated patch of terrain with a clean irregular outline';
  if (object.categoryGroup === 'Planets and Moons') style = 'detailed scientific illustration with the recognizable surface and prominent features of the named body';
  return { ...object, prompt: `Use case: scientific-educational. Asset: single transparent PNG sprite for a scale-of-universe explorer. Subject: one ${subjects[object.id] ?? object.name}. Style: ${style}. Show the full subject centered, mild three-quarter view, recognizable silhouette, all extremities in frame, small clear margin. Animals show full body; buildings show full height; planets and stars show full disc. Genuine transparent alpha everywhere outside the subject, including all corners and gaps. No background rectangle, no backdrop, no starfield behind the object, no floor, no cast shadow, no pedestal, no border, no labels, no numbers, no text, no watermark. Render the specific subject rather than a generic icon. Illustration, not a literal scientific observation.` };
});
fs.writeFileSync('artifacts/scale-universe-upgrade/remaining-generation-prompts.json', JSON.stringify(records, null, 2));
console.log(`${records.length} subject-specific prompts prepared.`);
