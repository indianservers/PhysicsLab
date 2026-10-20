import chapters from './studioTheoryContent.json';
import { referenceLabsByStudio } from './studioReferenceLabs';
import { studioHomeById } from './conceptStudioHomes';

export type StudioTheoryChapter = (typeof chapters)[keyof typeof chapters];
export const studioTheory: Record<string, StudioTheoryChapter> = chapters;

export const theoryReferences = {
  measurement: [{ title: 'NIST: Evaluating Type B standard uncertainty', url: 'https://physics.nist.gov/cuu/Uncertainty/typeb.html' }, { title: 'NIST: SI definitions and units', url: 'https://www.nist.gov/pml/special-publication-330/sp-330-section-2' }],
  mechanics: [{ title: 'MIT: Classical Mechanics — course and textbook', url: 'https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/' }],
  fields: [{ title: 'MIT: Electricity and Magnetism — course notes', url: 'https://web.mit.edu/8.02t/www/802TEAL3D/visualizations/coursenotes/index.htm' }],
  electronics: [{ title: 'MIT: Microelectronic Devices and Circuits — lecture notes', url: 'https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/pages/lecture-notes/' }],
  thermal: [{ title: 'OpenStax: University Physics Volume 2 — index and topics', url: 'https://openstax.org/books/university-physics-volume-2/pages/index' }],
  optics: [{ title: 'OpenStax: University Physics Volume 3 — index and topics', url: 'https://openstax.org/books/university-physics-volume-3/pages/index' }],
  modern: [{ title: 'NIST: Fundamental physical constants', url: 'https://physics.nist.gov/cuu/Constants/index.html' }, { title: 'OpenStax: University Physics Volume 3 — index and topics', url: 'https://openstax.org/books/university-physics-volume-3/pages/index' }],
  astronomy: [{ title: 'UCLA: Ned Wright’s Cosmology Tutorial', url: 'https://www.astro.ucla.edu/~wright/cosmolog.html' }, { title: 'NASA Exoplanet Archive: atmospheric and transit data definitions', url: 'https://exoplanetarchive.ipac.caltech.edu/docs/atmospheres/atmospheres_columns.html' }],
};

export function theoryForRoute(pathname: string) {
  const chapter = studioTheory[pathname.replace(/\/$/, '')];
  if (!chapter) return null;
  const studio = studioHomeById.get(chapter.studio);
  const labs = referenceLabsByStudio[chapter.studio] ?? [];
  const lab = labs.find(item => item.route === pathname.replace(/\/$/, ''));
  const group = chapter.studio;
  const references = group === 'measurement' ? theoryReferences.measurement
    : group === 'electronics' ? theoryReferences.electronics
    : group === 'electricity' || group === 'magnetism' ? theoryReferences.fields
    : group === 'thermodynamics' ? theoryReferences.thermal
    : group === 'optics' ? theoryReferences.optics
    : group === 'modern-physics' ? theoryReferences.modern
    : group === 'astronomy-astrophysics' ? theoryReferences.astronomy
    : theoryReferences.mechanics;
  return { chapter, studio, lab, labs, references };
}
