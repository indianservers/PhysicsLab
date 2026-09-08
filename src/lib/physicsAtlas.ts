export const ATLAS_DEFAULTS = { mass: 3, acceleration: 4, frequency: 48, wavelength: .5, temperature: 300, separation: 2 };
export type AtlasParameters = typeof ATLAS_DEFAULTS;
export function atlasReadings(p: AtlasParameters) {
  return { force: p.mass * p.acceleration, speed: p.frequency * p.wavelength, wavelength: p.wavelength, temperature: p.temperature, gravity: 6.67430e-11 * p.mass * 1e12 / p.separation ** 2 };
}
export const atlasTopics = [
 { id: 'matter', label: 'Matter', x: 260, y: 148, route: '/concept-studio/modern-physics', description: 'Matter has mass. Its gravitational interaction links microscopic structure to the cosmos.' },
 { id: 'motion', label: 'Motion', x: 560, y: 95, route: '/concept-studio/motion-kinematics', description: 'The net force changes velocity: acceleration is net force divided by mass.' },
 { id: 'forces', label: 'Forces', x: 872, y: 167, route: '/concept-studio/force-newton', description: 'A force describes an interaction. Action and reaction act on different objects.' },
 { id: 'waves', label: 'Waves', x: 148, y: 325, route: '/concept-studio/waves-sound', description: 'A traveling wave moves one wavelength per period. Its speed is frequency × wavelength.' },
 { id: 'fields', label: 'Fields', x: 940, y: 380, route: '/concept-studio/magnetism', description: 'Fields assign a physical quantity to every location. Field lines indicate direction, not particle paths.' },
 { id: 'heat', label: 'Heat', x: 355, y: 520, route: '/concept-studio/thermodynamics', description: 'Heat is energy transferred because of a temperature difference. Temperature is measured in kelvin.' },
 { id: 'cosmos', label: 'Cosmos', x: 770, y: 563, route: '/concept-studio/astronomy-astrophysics', description: 'Newtonian gravity between point masses decreases with the square of their separation.' },
] as const;

