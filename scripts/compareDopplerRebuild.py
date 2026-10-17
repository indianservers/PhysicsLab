from pathlib import Path
from PIL import Image
import numpy as np,cv2,json,shutil
root=Path('artifacts/physics-studio-audit');out=root/'doppler-effect';reference=Path('C:/Indian Servers/temp/Physics/studiotargetUI/all/09_waves_sound/06_doppler_effect.png')
a=Image.open(reference).convert('RGB').crop((235,0,1536,1024));b=Image.open(out/'after-1536.png').convert('RGB').crop((201,0,1536,1024)).resize(a.size,Image.Resampling.LANCZOS)
aa=np.asarray(a);bb=np.asarray(b);d=np.abs(aa.astype(float)-bb.astype(float));x=cv2.cvtColor(aa,cv2.COLOR_RGB2GRAY).astype(float);y=cv2.cvtColor(bb,cv2.COLOR_RGB2GRAY).astype(float);mx=cv2.GaussianBlur(x,(11,11),1.5);my=cv2.GaussianBlur(y,(11,11),1.5);vx=cv2.GaussianBlur(x*x,(11,11),1.5)-mx*mx;vy=cv2.GaussianBlur(y*y,(11,11),1.5)-my*my;cov=cv2.GaussianBlur(x*y,(11,11),1.5)-mx*my;ssim=float((((2*mx*my+6.5025)*(2*cov+58.5225))/((mx*mx+my*my+6.5025)*(vx+vy+58.5225))).mean())
Image.fromarray(np.minimum(d*3,255).astype('uint8')).save(out/'difference.png');comparison=Image.new('RGB',(a.width*2,a.height));comparison.paste(a,(0,0));comparison.paste(b,(a.width,0));comparison.save(out/'comparison.png')
before=root/'reference-captures/09_waves_sound__06_doppler_effect.png'
if before.exists():shutil.copy2(before,out/'before.png')
regions={}
for name,(left,top,right,bottom) in {'header':(235,0,1536,118),'apparatus':(257,130,1201,580),'controls':(1216,130,1519,580),'waveform':(257,595,844,945),'readings':(854,595,1519,945),'footer':(257,965,1519,1024)}.items():
 region=d[top:bottom,left-235:right-235];regions[name]={'meanAbsoluteChannelDifference':round(float(region.mean()),3)}
result={'route':'/motion/doppler-effect','reference':'09_waves_sound/06_doppler_effect.png','viewport':[1536,1024],'targetSidebar':235,'currentSidebar':201,'sidebarExcluded':True,'meanAbsoluteChannelDifference':round(float(d.mean()),3),'ssim':round(ssim,4),'regions':regions,'frozenTime':0,'parameters':{'source':30,'observer':0,'frequency':800},'note':'Diagnostic metrics, not acceptance percentages. Native apparatus material/lighting and font treatment remain below target. Physically correct crest spacing, signed observer convention and sample frequencies intentionally differ from inconsistent illustrative reference arcs/curves/readouts. Default correct f+876.677, f-735.657 Hz; lambda+.39125, lambda-.46625 m.'};(out/'visual-comparison.json').write_bytes(json.dumps(result,indent=2).encode('utf-8'));print(result)
