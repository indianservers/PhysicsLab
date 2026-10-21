"""Build a proposal-only UX roadmap from the 96-lab studio registry."""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'outputs/studio-ux-roadmap'
OUT.mkdir(parents=True, exist_ok=True)
registry = (ROOT / 'src/lib/studioReferenceLabs.ts').read_text(encoding='utf-8')
registry = json.loads(registry[registry.index('{', registry.index('= {')):].rstrip().removesuffix(';'))
names = dict(re.findall(r'id:"([^"]+)",name:"([^"]+)"', (ROOT / 'src/lib/conceptStudioHomes.ts').read_text(encoding='utf-8')))
theory = json.loads((ROOT / 'src/lib/studioTheoryContent.json').read_text(encoding='utf-8'))

# Three deliberately selected design anchors per lab: manipulation, evidence, visual explanation.
# The order follows the six labs in each studio's source registry.
anchors = '''
left and right endpoint positions|endpoint difference with reading uncertainty|eye position and parallax sight line
jaw separation and zero offset|main-scale plus coincident-division reading|magnified vernier coincidence
thimble rotation and zero correction|pitch and least-count calculation|unwrapped sleeve and thimble scales
leg spacing and central screw height|curvature radius with propagated uncertainty|sphere cross-section and sagitta
balance calibration and timing interval|repeated mass and elapsed-time readings|reaction delay versus instrument resolution
input uncertainties and correlations|uncertainty budget and final rounded result|correlated versus independent error contributions
force magnitude and direction|vector sum and acceleration|isolated body with labeled force origins
slope angle and friction coefficient|parallel and normal force components|slope-aligned vector decomposition
load mass and rope arrangement|effort, displacement ratio and work|continuous rope path and supporting segments
force application point and angle|signed torque about the selected pivot|perpendicular moment arm
mass positions and support locations|center of mass and tipping margin|support polygon and projected center of mass
mass ratio and collision restitution|total momentum and kinetic-energy change|before-and-after velocity vectors
position keyframes and time interval|displacement and local slope|secant approaching a tangent on x(t)
velocity segments and duration|signed area and displacement|positive and negative regions under v(t)
acceleration segments and initial velocity|velocity change and integrated position|linked a(t), v(t) and x(t) plots
launch angle and initial speed|range, apex and flight time|independent horizontal and vertical motion
observer velocity and object velocity|relative position and relative velocity|synchronized reference-frame views
radius and angular speed|period and centripetal acceleration|tangent velocity and radial acceleration
initial velocity and external force|motion before and after a force change|inertial motion with force-state markers
net force and inertial mass|acceleration and F/m ratio|matched force and acceleration arrows
interaction strength and body masses|equal opposite forces and unequal accelerations|force pairs drawn on separate bodies
applied force and surface coefficients|static threshold and kinetic friction|stick-slip transition and force balance
rope direction and applied load|tension and normal reaction|contact normals and rope-aligned force arrows
multiple force vectors|residual resultant and target acceleration|component polygon and cancellation
force angle and displacement|signed work and force-displacement area|parallel versus perpendicular force components
mass and speed|kinetic energy and speed-squared relation|energy bars linked to motion
mass, elevation and energy datum|potential-energy difference|movable reference level with height markers
initial height and dissipative force|mechanical energy and thermal transfer|stacked energy account through the trajectory
load and completion time|work per unit time|equal-work tasks with different durations
input energy and useful output|efficiency and waste energy|proportional input/output/loss flow diagram
two masses and their separation|inverse-square force and equal force pairs|center-to-center distance marker
source mass and probe position|field strength and direction|field vectors with adjustable sampling density
source mass and radius|potential and potential difference|negative potential curve with infinity reference
initial speed and orbital radius|orbital energy, eccentricity and period|conic orbit with focus and velocity vectors
launch radius and launch speed|specific energy and escape threshold|bound, parabolic and unbound trajectories
semimajor axis and eccentricity|period-squared ratio and swept area|equal-time sectors about the focus
spring constant and attached mass|period, displacement and restoring force|phase circle linked to the spring
pendulum length and release angle|period and angle-dependent approximation error|arc coordinate and tangential acceleration
oscillation amplitude and phase|kinetic and potential-energy exchange|phase-locked energy bars
damping strength and initial displacement|amplitude envelope and energy decay|under-, critical- and over-damped responses
drive frequency and damping|steady-state amplitude and phase lag|response peak and driving-force phase
coupling strength and initial displacement|normal-mode frequencies and beat envelope|energy exchange between paired oscillators
wavelength and frequency|wave speed and phase difference|tracked crest versus medium particle
individual wave amplitude and phase|instantaneous sum and component displacement|components and resultant on shared axes
source separation and phase difference|path difference and resultant amplitude|constructive and destructive loci
boundary condition and driving frequency|allowed modes, nodes and antinodes|standing-wave envelope and particle motion
tone frequency and harmonic amplitudes|spectral peaks and fundamental frequency|time waveform linked to frequency spectrum
source and observer velocity|received frequency and arrival interval|emission wavefronts and relative motion
incident angle and mirror orientation|equal angles measured from the normal|incident ray, normal and reflected ray
refractive indices and incident angle|Snell relation and critical angle|ray bending with angle arcs at the interface
object distance and focal length|image distance and magnification|principal rays and signed optical distances
object distance and mirror curvature|image position and magnification|curved mirror rays with virtual extensions
slit separation and wavelength|fringe spacing and path difference|screen intensity aligned to two-slit rays
aperture width and wavelength|central-maximum width and minima positions|aperture geometry aligned to intensity profile
charge signs and separation|force magnitude and inverse-square trend|equal opposite force arrows
charge arrangement and probe position|field vector and superposition|field lines distinguished from probe force
source charges and probe position|potential sum and equipotential spacing|equipotentials overlaid with field direction
carrier density and drift conditions|charge flow per time and current direction|slow carrier drift versus circuit response
resistance and source voltage|node potentials, branch current and power|schematic aligned to circuit measurements
plate geometry and dielectric|capacitance, charge and stored energy|field between plates and dielectric polarization
magnet orientation and probe position|local field direction and relative strength|continuous field loops through the magnet
charge sign, velocity and magnetic field|magnetic force and trajectory curvature|right-hand-rule triad with sign reversal
wire current and radial probe distance|azimuthal field and inverse-distance trend|concentric field loops and current direction
turn density and current|internal field and finite-length variation|coil cross-section with central and fringe fields
coil orientation and changing flux|induced emf and signed flux rate|flux-area geometry and Lenz-law direction
coil current and core choice|field change and model validity|coil, core and pole labels
temperature and semiconductor doping|carrier populations and conductivity trend|band diagram and carrier-type legend
bias voltage and polarity|current-voltage operating point|junction barrier and forward/reverse bias
base drive and collector circuit|collector current and operating region|cutoff, active and saturation boundaries
signal amplitude and circuit gain|output waveform and clipping|input/output traces on shared time axes
binary inputs and gate selection|truth-table output|signal path with high/low labels
physical stimulus and sensor settings|calibration curve and output units|stimulus-to-electrical-signal chain
temperature scale and thermometer state|equivalent Celsius, Kelvin and Fahrenheit readings|aligned temperature scales and absolute zero
temperature difference and material properties|heat-transfer rate and energy change|conduction, convection and radiation pathways
gas volume, temperature and amount|pressure and state-variable ratios|P-V, P-T and V-T views
heat input and work interaction|internal-energy change and signed energy balance|system boundary with heat/work arrows
thermal reservoirs and transferred heat|system and surroundings entropy change|separate entropy ledgers and total change
reservoir temperatures and cycle controls|work output, rejected heat and efficiency|cycle path linked to energy-flow diagram
fluid density and measurement depth|pressure difference and unit conversion|pressure arrows with depth reference
connected-vessel geometry and fluid levels|pressure equality at equal elevations|horizontal comparison line through the fluid
object density and displaced volume|buoyant force and equilibrium immersion|displaced-fluid volume and force balance
pipe cross-section and inlet flow|volume flow rate and local velocity|streamtube area linked to velocity markers
height, cross-section and flow conditions|pressure, kinetic and gravitational head|aligned energy-head bars along a streamline
fluid viscosity and flow geometry|drag or pressure-flow response within model limits|velocity profile and shear layers
state amplitudes and measurement basis|normalized outcome probabilities|state representation separated from measured counts
light frequency, intensity and stopping voltage|maximum electron energy and photocurrent|threshold frequency and stopping-potential graph
particle momentum and kinetic energy|de Broglie wavelength and approximation difference|wave scale linked to particle momentum
atomic transition and spectral series|photon energy and spectral-line position|energy levels connected to emitted wavelengths
proton and neutron numbers|binding energy and nuclide identity|nuclide chart with evidence-based stability labels
initial population and decay constant|remaining nuclei, activity and half-life|stochastic counts beside expected decay curve
planet selection and orbital time|orbital distance, period and speed|heliocentric orbit with scale-mode indicator
initial stellar mass and evolutionary stage|stage duration and stellar properties|H-R path with branch-dependent outcomes
line identification and redshift|rest versus observed wavelength|aligned reference and observed spectra
mass-profile parameters and radius|rotation curve and enclosed mass|disk, bulge and halo contributions
cosmological parameters and redshift|distance measures and expansion history|scale factor linked to observable redshift
planet radius, inclination and period|transit depth, duration and detection geometry|orbital view linked to a light curve
'''.strip().splitlines()
assert len(anchors) == 96, len(anchors)

def suggestions(lab, t, a):
    control, metric, visual = a.split('|')
    # A common review framework is intentionally reused; every recommendation is bound
    # to the lab's selected controls, evidence, representation, or authored investigation.
    rows = [
      ('UX','P1','First-minute goal',f'Open with one concrete task involving {control}; show the expected observation involving {metric} before introducing advanced controls.'),
      ('UI','P1','Control hierarchy',f'Group {control} in a primary control section; move display-only preferences to a separate section so changing the model and changing its view are distinguishable.'),
      ('UX','P1','Precise adjustment',f'Pair adjustments for {control} with editable values, unit labels and small-step buttons; retain an equivalent non-drag interaction wherever a handle is used.'),
      ('UI','P1','Evidence hierarchy',f'Give {metric} a persistent result area with stable number widths, clear units and precision appropriate to the model.'),
      ('UI','P1','Direct visual linkage',f'Connect control focus to a highlight in {visual}; remove the highlight on blur so the visualization does not accumulate distracting emphasis.'),
      ('UX','P1','Predict before reveal',f'In Predict, ask what happens to {metric} when one element of {control} changes; save the prediction and reveal the comparison only after the learner runs the case.'),
      ('UX','P1','Experiment checklist',f'Turn this investigation into selectable steps with a recording slot per step: {t["investigation"]}'),
      ('UI','P1','Explain at the observation',f'In Explain, place an expandable annotation beside {visual} that connects the visible behavior to: {t["core"]}'),
      ('UX','P2','Challenge progression',f'Offer a guided challenge about {metric}, then the same task with hints hidden; score the reasoning and final state separately.'),
      ('UX','P1','Tab continuity',f'Preserve {control}, recorded evidence and scroll position when switching Observe, Predict, Experiment, Explain and Challenge; expose the active mode in a shareable URL.'),
      ('UX','P1','Tab interaction refinement',f'For this lab’s mode strip, verify arrow-key navigation, visible focus, selected state and panel association; returning from theory should restore focus to the originating {lab["title"]} control.'),
      ('UI','P1','Equation-to-scene mapping',f'Allow each term in “{t["equation"]}” to highlight its corresponding readout or element of {visual}; provide a plain-text explanation alongside symbols.'),
      ('UI','P1','Units drawer',f'Add a compact units and symbols drawer next to the equation: {t["symbols"]} Keep units visible even when that drawer is closed.'),
      ('UX','P2','Worked-example replay',f'Make the existing worked example replayable as ordered steps, highlighting the substituted quantities before showing the result: {" ".join(t["example"])}'),
      ('UI','P2','Derivation stepper',f'Present the derivation one step at a time with Back and Show all controls. The first annotated step should be: {t["derivation"][0]}'),
      ('UX','P1','Misconception feedback',f'When a prediction conflicts with the model, offer a targeted comparison around this misconception rather than a generic wrong-answer message: {t["misconception"]}'),
      ('UI','P1','Assumptions in context',f'Place a concise model-limit badge beside {metric}; expand it to show: {t["assumptions"]}'),
      ('UX','P2','Paired comparison',f'Let learners pin a baseline and compare a second setting of {control}; align the two views of {visual} and show changes in {metric}.'),
      ('UX','P2','Trial notebook',f'Add a trial table that records {control}, {metric} and a learner note; include undo for removing a row and a clear indication of which trial is currently displayed.'),
      ('UI','P2','Inspectable evidence',f'Provide an inspect mode for {metric}: synchronized cursor values for continuous plots, or selectable labeled rows for discrete states; keep the inspected point visible in {visual}.'),
      ('UX','P2','Reversible exploration',f'Provide named baseline reset and one-step undo for changes to {control}; preview what a reset will replace when recorded trials are present.'),
      ('UI','P1','Narrow-screen layout',f'On a narrow screen, keep {visual} above the primary {control} controls, and make {metric} available through a compact sticky summary without covering tab content.'),
      ('UI','P1','Redundant visual encoding',f'Use labels plus line styles, shapes or arrowheads in {visual}; make the comparison understandable in grayscale and avoid relying on color alone.'),
      ('UX','P1','Accessible evidence summary',f'Expose a readable summary of {metric} and the selected state of {visual}; announce user-triggered changes at a controlled rate rather than announcing every animation frame.'),
      ('UI','P2','Visual density control',f'Offer essential and detailed annotation levels for {visual}; retain units and the main {metric} readout in both modes.'),
      ('UX','P2','Motion and rendering preference',f'If {visual} animates, offer pause, slower playback and reduced-motion presentation; for a static view, offer a simplified rendering option that retains all numerical evidence.'),
      ('UX','P2','Reasoning self-check',f'Present this self-check with an optional hint and a separate answer reveal: {t["question"]} Preserve the learner’s reasoning when revealing the explanation.'),
      ('UX','P2','Extension pathway',f'Add an optional “Beyond this model” activity after the core task: {t["extension"]} State when it is a conceptual extension rather than something the current simulator calculates.'),
      ('UX','P2','Reproducible sharing',f'Create a share/export summary containing {control}, {metric}, model assumptions and lab version; offer a text alternative to the visual snapshot of {visual}.'),
      ('UX','P3','Studio learning connection',f'End the session with a concise evidence-based recap of {metric}, the saved prediction and one next-lab link within {names[t["studio"]]}; explain the conceptual connection before navigation.'),
    ]
    return [dict(number=i+1, category=c, priority=p, title=title, proposal=body) for i,(c,p,title,body) in enumerate(rows)]

studios=[]
i=0
for sid, labs in registry.items():
    entries=[]
    for lab in labs:
        entries.append(dict(**lab, url='https://physics.aimersociety.com'+lab['route'], suggestions=suggestions(lab,theory[lab['route']],anchors[i])))
        i+=1
    studios.append(dict(id=sid,name=names[sid],labs=entries))
assert len(studios)==16 and i==96
assert all(len(l['suggestions'])==30 for s in studios for l in s['labs'])
assert len({l['route'] for s in studios for l in s['labs']})==96
data=dict(date='2026-10-20',status='Design roadmap; shared implementation documented in docs/studio-ux-implementation.md',method='Inventory from the local 16-studio, 96-lab registry. Thirty shared review dimensions are tailored to each lab’s controls, evidence, visual explanation and existing theory. Priorities are proposed sequencing, not measured severity. Suggestions may refine existing features; this is not a new defect audit.',sources=[dict(title='W3C Tabs Pattern',url='https://www.w3.org/WAI/ARIA/apg/patterns/tabs/'),dict(title='W3C WCAG 2.2',url='https://www.w3.org/TR/WCAG22/')],studios=studios)
(OUT/'roadmap.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
esc=html.escape
sections=[]
for s in studios:
    cards=[]
    for lab in s['labs']:
        items=''.join(f'<li data-priority="{x["priority"]}" data-category="{x["category"]}"><span class="tag">{x["priority"]} · {x["category"]}</span> <strong>{esc(x["title"])}</strong><p>{esc(x["proposal"])}</p></li>' for x in lab['suggestions'])
        cards.append(f'<details class="lab" data-studio="{s["id"]}"><summary>{esc(lab["title"])} <span>30 proposals</span></summary><p><a href="{lab["url"]}">Open lab</a> · <code>{lab["route"]}</code></p><ol>{items}</ol></details>')
    sections.append(f'<section data-studio="{s["id"]}"><h2>{esc(s["name"])} <small>6 labs · 180 proposals</small></h2>{"".join(cards)}</section>')
options=''.join(f'<option value="{s["id"]}">{esc(s["name"])}</option>' for s in studios)
page='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Physics Studios — UX/UI Roadmap</title>
<style>:root{font:16px/1.6 system-ui;color:#17243b;background:#f2f5fa}body{max-width:1100px;margin:auto;padding:24px}h1{line-height:1.15;font-size:2.4rem}h2{margin-top:40px}small,summary span{font-size:.85rem;font-weight:400;color:#536179}header,.toolbar,.lab{background:white;border:1px solid #d4ddeb;border-radius:12px;padding:20px;margin:12px 0}.toolbar{position:sticky;top:0;z-index:2;display:flex;gap:12px;flex-wrap:wrap;box-shadow:0 4px 16px #17243b14}label{display:flex;flex-direction:column;font-size:.8rem;gap:4px}input,select,button{font:inherit;padding:9px;border:1px solid #8191a8;border-radius:5px;min-height:44px}button{background:#e9eff9;cursor:pointer}summary{font-size:1.15rem;font-weight:650;cursor:pointer;min-height:32px}summary span{float:right}.tag{font-size:.75rem;background:#e8eef8;padding:3px 7px;border-radius:4px}li{padding:12px 8px;border-bottom:1px solid #e0e6ef}li p{margin:5px 0 0}a{color:#174dac}code{overflow-wrap:anywhere}*:focus-visible{outline:3px solid #6c38c7;outline-offset:3px}[hidden]{display:none!important}footer{padding:25px 0}@media(max-width:600px){body{padding:12px}.toolbar{position:static}h1{font-size:1.9rem}summary span{float:none;display:block}ol{padding-left:25px}}@media print{.toolbar{display:none}body{background:white}.lab{break-inside:auto}}</style>
<header><p>DESIGN PROPOSALS · 20 OCTOBER 2026</p><h1>16 studios. 96 labs.<br>2,880 UX/UI enhancements.</h1><p>Thirty suggestions per lab, organized around interaction, evidence, visual explanation and learning. Use the filters to review one studio or priority at a time.</p><p><strong>Scope:</strong> This is a proposal inventory, not a claim that every feature is absent. It builds on the existing tabs, theory, worked examples and learning modes. A common set of review dimensions is tailored to each lab using its local physics content and three selected design anchors. Validate feasibility against the current implementation before scheduling.</p><p><strong>Priority:</strong> P1 = core comprehension and access; P2 = richer exploration; P3 = learning continuity. These are suggested priorities, not measured defect severities.</p><p><a href="roadmap.json" download>Download structured JSON</a> · <a href="../../docs/studio-ux-implementation.md">Implementation notes and verification scope</a></p></header>
<div class="toolbar"><label>Search labs or proposals<input id="search" type="search" placeholder="e.g. diffraction, uncertainty"></label><label>Studio<select id="studio"><option value="">All studios</option>OPTIONS</select></label><label>Priority<select id="priority"><option value="">All priorities</option><option>P1</option><option>P2</option><option>P3</option></select></label><label>Type<select id="category"><option value="">UX + UI</option><option>UX</option><option>UI</option></select></label><button id="expand">Expand visible labs</button><button id="collapse">Collapse all</button><p id="count" role="status" aria-live="polite"></p></div>
<main>SECTIONS</main><footer><p>Inventory: <code>src/lib/conceptStudioHomes.ts</code> and <code>src/lib/studioReferenceLabs.ts</code>. Physics context: <code>src/lib/studioTheoryContent.json</code>.</p><p>Accessibility reference points: <a href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/">W3C Tabs Pattern</a> and <a href="https://www.w3.org/TR/WCAG22/">WCAG 2.2</a>. These guide keyboard/focus behavior, alternatives to dragging and non-color cues; this report is not a conformance certification.</p></footer>
<script>const $=s=>document.querySelector(s);function filter(){let labs=0,items=0;const q=$('#search').value.toLowerCase().trim(),sid=$('#studio').value,p=$('#priority').value,c=$('#category').value;document.querySelectorAll('.lab').forEach(l=>{const name=l.querySelector('summary').textContent.toLowerCase();let visible=0;l.querySelectorAll('li').forEach(i=>{i.hidden=!!((p&&i.dataset.priority!==p)||(c&&i.dataset.category!==c)||(q&&!name.includes(q)&&!i.textContent.toLowerCase().includes(q)));if(!i.hidden)visible++});l.hidden=!!((sid&&l.dataset.studio!==sid)||!visible);if(!l.hidden){labs++;items+=visible}});document.querySelectorAll('section').forEach(s=>s.hidden=![...s.querySelectorAll('.lab')].some(l=>!l.hidden));$('#count').textContent=labs+' labs · '+items+' proposals'}['search','studio','priority','category'].forEach(id=>$('#'+id).addEventListener('input',filter));$('#expand').onclick=()=>document.querySelectorAll('.lab:not([hidden])').forEach(l=>l.open=true);$('#collapse').onclick=()=>document.querySelectorAll('.lab').forEach(l=>l.open=false);filter();</script></html>'''.replace('OPTIONS',options).replace('SECTIONS',''.join(sections))
(OUT/'index.html').write_text(page,encoding='utf-8')
print(f'Built {len(studios)} studios, {i} labs, {i*30} proposals: {OUT}')
