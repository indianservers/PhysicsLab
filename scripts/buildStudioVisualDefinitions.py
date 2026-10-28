"""Explicit physical axes for every registered lab; values stay in existing solver units."""
import json
import hashlib
from pathlib import Path

rows='''
angle|Eye angle|°|state.measured|Measured length|cm
jaw|Jaw separation|mm|s.corrected|Corrected diameter|mm
turns|Thimble rotation|turns|s.corrected|Corrected thickness|mm
height|Screw height|mm|s.radius|Radius of curvature|mm
spacingCm|Gate spacing|cm|trial.elapsed|Elapsed gate time|s
precision|Calibration half-width|mL|stats.uB|Type B standard uncertainty|mL
force|Applied force|N|s.ax|Horizontal acceleration|m/s²
angle|Incline angle|°|f.acceleration|Acceleration down slope|m/s²
massB|Mass B|kg|f.freeAcceleration|Free acceleration|m/s²
effort|Effort force|N|s.net|Net torque|N·m
tilt|Support tilt|°|s.margin|Stability margin|cm
u1|Initial velocity of body 1|m/s|state.momentum|Total momentum|kg·m/s
@time|Inspection time|s|state.x|Position|m
@time|Inspection time|s|state.v|Velocity|m/s
amplitude|Acceleration pulse amplitude|m/s²|pulse.totalDeltaV|Total velocity change|m/s
angle|Launch angle|°|flight.rangeM|Horizontal range|m
current|Current speed|m/s|solution.groundSpeed|Ground speed|m/s
omega|Angular velocity|rad/s|s.centripetalAcceleration|Centripetal acceleration|m/s²
drag|Resistive force|N|s.stopTime|Stopping time|s
appliedForceN|Applied force|N|state.accelerationMps2|Acceleration|m/s²
massA|Mass A|kg|s.impulseA|Impulse on body A|N·s
pull|Applied pull|N|s.friction|Friction force|N
angleA|Left rope angle|°|s.ta|Left rope tension|N
wind|Wind force|N|s.net|Net horizontal force|N
angle|Force angle|°|s.work|Work done|J
speed|Speed|m/s|s.energy|Kinetic energy|J
height|Height above datum|m|s.energy|Gravitational potential energy|J
position|Track position|m|s.ke|Kinetic energy|J
time|Task duration|s|s.power|Average power|W
load|Motor load setting|%|s.efficiency|Efficiency|%
r|Center separation|m|s.force|Gravitational force|N
radius|Probe radius|m|s.g|Gravitational field magnitude|m/s²
radius|Probe radius|m|s.V|Gravitational potential|J/kg
speed|Launch speed|km/s|s.e|Orbital eccentricity|1
speed|Launch speed|km/s|s.residual|Residual speed|km/s
a|Semimajor axis|AU|s.T|Orbital period|days
time|Inspection time|s|s.x|Spring displacement|m
length|Pendulum length|m|solution.finiteT|Finite-amplitude period|s
time|Inspection time|s|s.ke|Kinetic energy|J
time|Inspection time|s|s.x|Displacement|m
frequency|Drive frequency|Hz|s.amp|Steady-state amplitude|m
time|Inspection time|s|s.theta1|Oscillator 1 angle|rad
frequency|Frequency|Hz|s.lambda|Wavelength|m
fa|Wave A frequency|Hz|s.lambdaA|Wave A wavelength|m
probe|Probe coordinate|m|s.I|Normalized intensity|1
length|String length|m|s.freq|Mode frequency|Hz
frequency|Frequency|Hz|s.wavelength|Wavelength|m
source|Source speed|m/s|s.observed|Observed frequency|Hz
incident|Incident angle|°|s.reflected|Reflected angle|°
angle|Incident angle|°|s.angleB|Refracted angle|°
object|Object distance|cm|s.di|Image distance|m
object|Object distance|cm|s.di|Image distance|m
wavelength|Wavelength|nm|s.spacing|Fringe spacing|m
width|Aperture width or diameter|μm|s.exactWidth|Nominal far-field central width|mm
r|Charge separation|m|s.mag|Electrostatic force magnitude|N
q1|Source charge 1|μC|s.mag|Electric field magnitude|N/C
z|Probe z coordinate|m|s.V|Electric potential|V
voltage|Applied voltage|V|s.I|Current|A
voltage|Source voltage|V|s.total|Total current|A
area|Plate area|cm²|s.C|Capacitance|F
separation|Magnet gap|cm|field.B|Field magnitude at probe|T
speed|Particle speed|m/s|s.r|Orbit radius|m
radius|Probe radius|cm|s.B|Magnetic field magnitude|T
current|Solenoid current|A|s.centerB|Central magnetic field|T
speed|Magnet speed|m/s|frame.emf|Induced emf|V
current|Current setting|A|frame.B|Core magnetic field|T
temperature|Temperature|K|s.sigma|Conductivity|S/m
voltage|Source voltage|V|frame.current|Diode current|A
ib|Base current setting|μA|frame.ic|Collector current|A
gain|Gain setting|1|cycle.gain|Fundamental voltage gain|1
a|Logic input A|logic 0/1|s.yVolts|Output voltage|V
stimulus|Sensor stimulus|% full scale|s.resistance|Sensor resistance|Ω
a|Temperature A|K|s.ka|Mean particle kinetic energy|J
delta|Temperature difference|K|s.rate|Heat transfer rate|W
T|Gas temperature|K|s.P|Gas pressure|kPa
Q|Heat supplied|kJ|s.dU|Internal energy change|kJ
deltaT|Initial temperature difference|K|s.S|Total entropy change|J/K
hot|Hot reservoir temperature|K|s.eta|Thermal efficiency|1
depth|Probe depth|m|s.pressure|Gauge pressure|kPa
depth|Probe depth|m|s.pressure|Hydrostatic gauge pressure|kPa
fraction|Immersed fraction|1|s.fb|Buoyant force|N
a2|Outlet cross-section|m²|s.v2|Outlet velocity|m/s
speed|Inlet speed|m/s|s.p2|Throat pressure|kPa
radius|Sphere radius|mm|s.vt|Terminal speed|m/s
sigma|Wavepacket width|nm|s.spread|Position spread|nm
freq|Light frequency|10¹⁴ Hz|s.stop|Stopping potential|V
energy|Electron kinetic energy|eV|s.lambda|de Broglie wavelength|nm
ni|Initial principal level|n|s.lambda|Emission wavelength|nm
n|Neutron number|count|s.per|Binding energy per nucleon|MeV
time|Elapsed time|years|s.n|Remaining nuclei|count
time|Elapsed time|days|s.angle|Orbital phase|rad
mass|Initial stellar mass|M☉|s.life|Stellar lifetime|years
redshift|Redshift|1|s.velocity|Recession velocity|km/s
radius|Galactocentric radius|kpc|s.speed|Circular speed|km/s
h0|Hubble constant|km/s/Mpc|s.dist|Comoving distance|Gly
radius|Planet radius|R⊕|s.depth|Fractional transit depth|1
'''.strip().splitlines()
existing=json.loads(Path('src/lib/studioVisualDefinitions.json').read_text(encoding='utf-8'))
report=json.loads(Path('artifacts/studio-physics-audit/results.json').read_text(encoding='utf-8'))['labs']
labs=[{'route':item['route'],'title':existing[item['route']]['title']} for item in report if not item['model'].startswith('../')]
assert len(rows)==len(labs)==96
definitions={}
models={item['route']:item['model'] for item in json.loads(Path('artifacts/studio-physics-audit/results.json').read_text(encoding='utf-8'))['labs']}
for lab,row in zip(labs,rows):
    key,xlabel,xunit,quantity,ylabel,yunit=row.split('|')
    model_file=Path('src/lib')/(models[lab['route']]+'.ts')
    definitions[lab['route']]={'title':lab['title'],'parameter':key.removeprefix('@'),'source':'scene' if key.startswith('@') else 'input','xLabel':xlabel,'xUnit':xunit,'quantity':quantity,'yLabel':ylabel,'yUnit':yunit,'discrete':lab['route'] in ['/electronics/logic-gates','/modern-physics/atomic-spectra','/modern-physics/nuclear-structure'],'solverVersion':hashlib.sha256(model_file.read_bytes()).hexdigest()[:12]}
definitions.update({route:d for route,d in existing.items() if route not in definitions})
Path('src/lib/studioVisualDefinitions.json').write_text(json.dumps(definitions,ensure_ascii=False,indent=2),encoding='utf-8')
print('Wrote 96 explicit graph definitions; verify units against the production solvers before release.')
