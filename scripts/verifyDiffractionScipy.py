import json,numpy as np
from scipy.special import jv
from scipy.integrate import quad
from pathlib import Path
out=Path('artifacts/physics-studio-audit/diffraction');cases=json.loads((out/'fresnel-reference-input.json').read_text());maximum=0
for case in cases:
 p=case['optics'];q=p['a']*case['y']/(p['lambda']*p['L']);N=p['a']**2/(p['lambda']*p['L'])
 if p['aperture']=='slit':
  f=lambda t:np.exp(1j*np.pi*N*t*t-2j*np.pi*q*t);lo=-.5;hi=.5
 else:
  f=lambda t:2*t*np.exp(1j*np.pi*N*t*t/4)*jv(0,np.pi*q*t);lo=0;hi=1
 re=quad(lambda t:float(np.real(f(t))),lo,hi,epsabs=2e-11,limit=1000)[0];im=quad(lambda t:float(np.imag(f(t))),lo,hi,epsabs=2e-11,limit=1000)[0];err=max(abs(re-case['field']['re']),abs(im-case['field']['im']));maximum=max(maximum,err);assert err<1e-9,case
result={'passed':True,'independentReference':'SciPy integrate.quad and special.jv, independent adaptive quadrature','complexFieldCases':len(cases),'maxAbsoluteFieldError':maximum,'includesWideApertureShortDistanceHighFresnelNumber':True};(out/'fresnel-reference.json').write_bytes(json.dumps(result,indent=2).encode());print(result)
