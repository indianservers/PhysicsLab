/** An explicit DOM bridge for the heterogeneous, independently authored studio pages.
 * Values are read from real controls/readouts, never recomputed as a second physics model.
 * Snapshots describe exposed controls, not hidden solver or camera state.
 */
import { flushSync } from 'react-dom';

export type LabControl = { key: string; label: string; value: string; type: string; min?: string; max?: string; step?: string; disabled: boolean; options?: string[] };
export type LabReading = { label: string; value: string };
export type LabSnapshot = { version: 1; route: string; at: string; controls: LabControl[]; readings: LabReading[]; preview?: string };
const compact = (value: string | null | undefined) => (value ?? '').replace(/\s+/g, ' ').trim().slice(0, 240);
export function labRoot(): HTMLElement | null { return document.querySelector('[data-studio-apparatus]'); }
function elements() {
  return [...(labRoot()?.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input[type="range"],input[type="number"],input[type="checkbox"],input[type="radio"],select') ?? [])]
    .filter(node => !node.closest('[role="dialog"],[data-lab-workspace]') && node.getClientRects().length)
    // Navigation menus are not model parameters: replaying one could leave the lab.
    .filter(node => !(node instanceof HTMLSelectElement && ([...node.options].some(o=>o.value.startsWith('/')) || /subject|lesson|studio|navigate|jump to|chapter/i.test(node.getAttribute('aria-label')??''))));
}
function name(node: HTMLInputElement | HTMLSelectElement) {
  const external = node.id ? [...document.querySelectorAll<HTMLLabelElement>('label')].find(label => label.htmlFor === node.id)?.textContent : '';
  return compact(node.getAttribute('aria-label') || node.name || node.id || external || node.closest('label')?.textContent || 'Parameter').replace(/[-+]?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi, '#');
}
function keyedElements() {
  const counts = new Map<string, number>();
  return elements().map(node => {
    const label = name(node), base = `${node.tagName}:${node.type}:${node.id || node.name || label}`;
    const index = counts.get(base) ?? 0; counts.set(base, index + 1);
    return { node, label, key: `${base}:${index}` };
  });
}
function controlValue(node: HTMLInputElement|HTMLSelectElement) {
  if(node instanceof HTMLInputElement&&['checkbox','radio'].includes(node.type))return String(node.checked);
  return node.value;
}
function choices() {
  const groups=new Map<Element,number>();
  return [...(labRoot()?.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')??[])].filter(node=>node.getClientRects().length&&!node.closest('[role="dialog"]')&&!/\b(observe|predict|experiment|explain|challenge|pause|play|run|reset|settings|notes|help)\b/i.test(node.getAttribute('aria-label')||compact(node.textContent))).map(node=>{
    const group=node.closest('[role="group"]')||node.parentElement!;
    if(!groups.has(group))groups.set(group,groups.size);
    const label=compact(group.getAttribute('aria-label')||group.className||'Choice');
    return {node,key:`choice:${label}:${groups.get(group)}:${compact(node.textContent)}`,label};
  });
}
export function locateLabQuantity(label: string, moveFocus = false) {
  const root=labRoot();if(!root)return;
  root.querySelectorAll('.slw-linked-quantity').forEach(node=>node.classList.remove('slw-linked-quantity'));
  const words=label.toLowerCase().match(/[a-z]{4,}/g)??[];
  const matches=[...root.querySelectorAll<HTMLElement>('input,select,dt,[data-reading],svg[aria-label],canvas[aria-label]')].filter(node=>{
    const text=(node.getAttribute('aria-label')||node.closest('label')?.textContent||node.textContent||'').toLowerCase();
    return words.some(word=>text.includes(word));
  });
  matches.forEach(node=>(node.closest('label')??node).classList.add('slw-linked-quantity'));
  if(moveFocus){const target=matches.find(n=>n.matches('input,select,[tabindex]'))??matches[0];target?.scrollIntoView({block:'center',behavior:'instant'});target?.focus({preventScroll:true});}
}
export function locateLabSymbol(symbol:string) {
  const root=labRoot();if(!root)return 0;
  root.querySelectorAll('.slw-linked-quantity').forEach(node=>node.classList.remove('slw-linked-quantity'));
  const pattern=new RegExp(`(^|[^\\p{L}\\p{N}])${symbol.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}([^\\p{L}\\p{N}]|$)`,'u');
  const found=[...root.querySelectorAll<HTMLElement>('dt,dd,[data-reading],label,svg text,[aria-label]')].filter(n=>pattern.test(n.getAttribute('aria-label')||n.textContent||''));
  found.forEach(n=>n.classList.add('slw-linked-quantity'));
  return found.length;
}
export function captureLab(route: string): LabSnapshot {
  // A paired number field is the canonical physical value. Its slider can use
  // logarithmic coordinates or browser step rounding, so do not replay both.
  const controls = keyedElements().filter(({node})=>!(node instanceof HTMLInputElement&&node.type==='range'&&node.closest('label')?.querySelector('input[type="number"]'))).map(({node, label, key}) => ({key,label,value:controlValue(node),type:node.type,disabled:node.disabled,...(node instanceof HTMLInputElement ? {min:node.min,max:node.max,step:node.step||'1'} : {options:[...node.options].map(o=>o.value)})}));
  const nodes = [...(labRoot()?.querySelectorAll<HTMLElement>('[data-reading],dl dd,output,[class*="readings"] strong,[class*="readouts"] strong,[class*="measurements"] strong') ?? [])].filter(n=>n.getClientRects().length);
  const readings = nodes.map(node => ({ label: compact(node.previousElementSibling?.textContent || node.closest('dl div')?.querySelector('dt')?.textContent || node.getAttribute('aria-label') || node.dataset.reading || 'Readout'), value: compact(node.textContent) })).filter(r=>r.value);
  controls.push(...choices().filter(c=>c.node.getAttribute('aria-pressed')==='true').map(c=>({key:c.key,label:c.label,value:compact(c.node.textContent),type:'choice',disabled:c.node.disabled,options:choices().filter(x=>x.label===c.label).map(x=>compact(x.node.textContent))})));
  return {version:1,route,at:new Date().toISOString(),controls,readings:readings.filter((r,i,a)=>a.findIndex(x=>x.label===r.label&&x.value===r.value)===i).slice(0,80)};
}
export function setLabControl(key: string, value: string): boolean {
  if(key.startsWith('choice:')){
    const original=choices().find(c=>c.key===key);
    const option=original&&choices().find(c=>c.label===original.label&&compact(c.node.textContent)===value);
    if(!option||option.node.disabled)return false;
    if(option.node.getAttribute('aria-pressed')!=='true')flushSync(()=>option.node.click());return true;
  }
  const item = keyedElements().find(item=>item.key===key);
  if (!item || item.node.disabled) return false;
  const node=item.node;
  if (node instanceof HTMLSelectElement && ![...node.options].some(o=>o.value===value&&!o.disabled)) return false;
  if (node instanceof HTMLInputElement && ['range','number'].includes(node.type)) {
    const n=Number(value); if(!value.trim()||!Number.isFinite(n)||(node.min!==''&&n<Number(node.min))||(node.max!==''&&n>Number(node.max))) return false;
  }
  const check=node instanceof HTMLInputElement&&['checkbox','radio'].includes(node.type);
  if(check&&value!=='true'&&value!=='false')return false;
  // Native setters bypass React's value tracker; dispatch feeds the existing page handler.
  const prototype=node instanceof HTMLSelectElement?HTMLSelectElement.prototype:HTMLInputElement.prototype;
  const property=check?'checked':'value';
  flushSync(()=>{
    if(check) { if((node as HTMLInputElement).checked!==(value==='true'))node.click(); }
    else { Object.getOwnPropertyDescriptor(prototype,property)?.set?.call(node,value);node.dispatchEvent(new Event(node instanceof HTMLSelectElement?'change':'input',{bubbles:true})); }
  });
  if(node instanceof HTMLInputElement&&node.type==='number')flushSync(()=>node.dispatchEvent(new FocusEvent('focusout',{bubbles:true})));
  return true;
}
export function restoreLab(snapshot: LabSnapshot, route: string) {
  if(snapshot.version!==1||snapshot.route!==route||!Array.isArray(snapshot.controls))return {applied:0,skipped:0};
  let applied=0,skipped=0;
  for(const c of snapshot.controls.slice(0,100)) { if(c&&typeof c.key==='string'&&typeof c.value==='string'&&setLabControl(c.key,c.value))applied++;else skipped++; }
  return {applied,skipped};
}
export function validSnapshot(value: unknown, route: string): value is LabSnapshot {
  if(!value||typeof value!=='object')return false;
  const v=value as LabSnapshot;
  return v.version===1&&v.route===route&&typeof v.at==='string'&&Array.isArray(v.controls)&&v.controls.length<=100&&v.controls.every(c=>c&&typeof c.key==='string'&&typeof c.label==='string'&&typeof c.value==='string')&&Array.isArray(v.readings)&&v.readings.every(r=>r&&typeof r.label==='string'&&typeof r.value==='string');
}
export function downloadLab(name: string, value: unknown) {
  const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
/** Optional visual evidence. Empty WebGL buffers are rejected rather than saved. */
export function captureLabPreview():string|undefined {
  const root=labRoot();if(!root)return;
  for(const canvas of root.querySelectorAll<HTMLCanvasElement>('canvas')){
    if(canvas.width<100||canvas.height<80||!canvas.getClientRects().length)continue;
    try{
      const copy=document.createElement('canvas'),scale=Math.min(1,640/canvas.width,360/canvas.height);copy.width=Math.round(canvas.width*scale);copy.height=Math.round(canvas.height*scale);
      const context=copy.getContext('2d');if(!context)continue;context.drawImage(canvas,0,0,copy.width,copy.height);
      const pixels=context.getImageData(0,0,copy.width,copy.height).data;
      if(!pixels.some((value,i)=>i%4===3&&value>0))continue;
      return copy.toDataURL('image/png');
    }catch{/* Tainted or unavailable buffers have a text-evidence fallback. */}
  }
  const original=[...root.querySelectorAll<SVGSVGElement>('svg[viewBox]')].find(svg=>{const r=svg.getBoundingClientRect();return r.width>=180&&r.height>=100;});
  if(!original)return;
  const clone=original.cloneNode(true) as SVGSVGElement;clone.setAttribute('xmlns','http://www.w3.org/2000/svg');
  const sources=[original,...original.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];
  copies.forEach((node,i)=>{const style=getComputedStyle(sources[i]);for(const key of ['fill','stroke','stroke-width','font-size','font-family','color'])node.setAttribute(key,style.getPropertyValue(key));});
  clone.querySelectorAll('script,foreignObject').forEach(node=>node.remove());
  return 'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(clone))));
}
export function safeLabPreview(value:unknown):string|undefined {
  return typeof value==='string'&&value.length<1_000_000&&/^data:image\/(?:png|svg\+xml);base64,[a-zA-Z0-9+/=]+$/.test(value)?value:undefined;
}
export function downloadEvidenceImage(title: string, snapshot: LabSnapshot) {
  const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]!));
  const lines=[...snapshot.readings.map(r=>`${r.label}: ${r.value}`),...snapshot.controls.map(c=>`${c.label}: ${c.value}`)].slice(0,60);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="${180+lines.length*32}" viewBox="0 0 1100 ${180+lines.length*32}"><rect width="100%" height="100%" fill="#101e30"/><g fill="#e9f1fc" font-family="sans-serif"><text x="40" y="55" font-size="28">${escape(title)} — evidence snapshot</text><text x="40" y="91" font-size="16">${escape(snapshot.route)} · ${escape(snapshot.at)}</text><text x="40" y="125" font-size="15">Displayed model values and exposed controls; not independent measurements.</text>${lines.map((line,i)=>`<text x="40" y="${170+i*32}" font-size="17">${escape(line)}</text>`).join('')}</g></svg>`;
  const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));const link=document.createElement('a');link.href=url;link.download=`${title}-evidence.svg`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
