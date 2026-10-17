from pathlib import Path
from PIL import Image
import numpy as np,cv2,json,shutil
root=Path('artifacts/physics-studio-audit');out=root/'standing-waves';reference=Path('C:/Indian Servers/temp/Physics/studiotargetUI/all/09_waves_sound/04_standing_waves.png')
a=Image.open(reference).convert('RGB').crop((201,0,1536,1024));b=Image.open(out/'after-1536.png').convert('RGB').crop((201,0,1536,1024))
aa=np.asarray(a);bb=np.asarray(b);d=np.abs(aa.astype(float)-bb.astype(float));x=cv2.cvtColor(aa,cv2.COLOR_RGB2GRAY).astype(float);y=cv2.cvtColor(bb,cv2.COLOR_RGB2GRAY).astype(float);mx=cv2.GaussianBlur(x,(11,11),1.5);my=cv2.GaussianBlur(y,(11,11),1.5);vx=cv2.GaussianBlur(x*x,(11,11),1.5)-mx*mx;vy=cv2.GaussianBlur(y*y,(11,11),1.5)-my*my;cov=cv2.GaussianBlur(x*y,(11,11),1.5)-mx*my;ssim=float((((2*mx*my+6.5025)*(2*cov+58.5225))/((mx*mx+my*my+6.5025)*(vx+vy+58.5225))).mean())
Image.fromarray(np.minimum(d*3,255).astype('uint8')).save(out/'difference.png');comparison=Image.new('RGB',(a.width*2,a.height));comparison.paste(a,(0,0));comparison.paste(b,(a.width,0));comparison.save(out/'comparison.png')
before=root/'reference-captures/09_waves_sound__04_standing_waves.png'
if before.exists():shutil.copy2(before,out/'before.png')
regions={}
for name,(left,top,right,bottom) in {'header':(210,5,1526,102),'modes':(210,112,1526,162),'apparatus':(210,170,1526,552),'lower_panels':(210,564,1526,910),'transport':(210,920,1526,1000)}.items():
 region=d[top:bottom,left-201:right-201];regions[name]={'meanAbsoluteChannelDifference':round(float(region.mean()),3)}
result={'route':'/motion/standing-waves','reference':'09_waves_sound/04_standing_waves.png','viewport':[1536,1024],'targetSidebar':201,'currentSidebar':201,'sidebarExcluded':True,'meanAbsoluteChannelDifference':round(float(d.mean()),3),'ssim':round(ssim,4),'regions':regions,'frozenTime':0,'note':'Diagnostic metrics, not acceptance percentages. Remaining PBR material/lighting and typography differences. Native instantaneous string is a single normal mode; ghost trails are prior analytical states. Readouts correct inconsistent reference values: T=25 N, mu=.005 kg/m, L=1 m, n=3 imply v=70.7107 m/s and f=106.066 Hz.'};(out/'visual-comparison.json').write_text(json.dumps(result,indent=2),encoding='utf-8');print(result)
