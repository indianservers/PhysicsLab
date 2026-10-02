export type FieldInput={mass:number;radius:number;density:number};
export const FIELD_DEFAULTS={mass:5.97e24,radius:2.08e7,density:15};
export function fieldSettings(v:FieldInput){return{mass:Math.max(1e23,Math.min(1e26,Number(v.mass)||1e23)),radius:Math.max(1e6,Math.min(1e9,Number(v.radius)||1e6)),density:Math.max(5,Math.min(40,Number(v.density)||5))}}
export function fieldSolution(v:FieldInput){const G=6.674e-11,g=G*v.mass/(v.radius*v.radius),phi=-G*v.mass/v.radius;return{g,phi}}
