from pathlib import Path
from PIL import Image
import numpy as np,cv2,json,shutil
root=Path('artifacts/physics-studio-audit');out=root/'interference';reference=Path('C:/Indian Servers/temp/Physics/studiotargetUI/all/09_waves_sound/03_interference.png')
a=Image.open(reference).convert('RGB').crop((229,0,1536,1024));b=Image.open(out/'after-1536.png').convert('RGB').crop((201,0,1536,1024)).resize(a.size,Image.Resampling.LANCZOS)
aa=np.asarray(a);bb=np.asarray(b);d=np.abs(aa.astype(float)-bb.astype(float));x=cv2.cvtColor(aa,cv2.COLOR_RGB2GRAY).astype(float);y=cv2.cvtColor(bb,cv2.COLOR_RGB2GRAY).astype(float);mx=cv2.GaussianBlur(x,(11,11),1.5);my=cv2.GaussianBlur(y,(11,11),1.5);vx=cv2.GaussianBlur(x*x,(11,11),1.5)-mx*mx;vy=cv2.GaussianBlur(y*y,(11,11),1.5)-my*my;cov=cv2.GaussianBlur(x*y,(11,11),1.5)-mx*my;ssim=float((((2*mx*my+6.5025)*(2*cov+58.5225))/((mx*mx+my*my+6.5025)*(vx+vy+58.5225))).mean())
Image.fromarray(np.minimum(d*3,255).astype('uint8')).save(out/'difference.png');comparison=Image.new('RGB',(a.width*2,a.height));comparison.paste(a,(0,0));comparison.paste(b,(a.width,0));comparison.save(out/'comparison.png')
before=root/'reference-captures/09_waves_sound__03_interference.png'
if before.exists():shutil.copy2(before,out/'before.png')
result={'route':'/motion/interference','reference':'09_waves_sound/03_interference.png','viewport':[1536,1024],'targetSidebar':229,'currentSidebar':201,'sidebarExcluded':True,'meanAbsoluteChannelDifference':round(float(d.mean()),3),'ssim':round(ssim,4),'frozenTime':0,'note':'Metrics are diagnostic, not acceptance percentages. Diagnostic only. Native water material/lighting differs from the reference photograph; source distances, wavelength and normalized intensity are computed consistently in SI rather than copying inconsistent reference samples.'};(out/'visual-comparison.json').write_text(json.dumps(result,indent=2),encoding='utf-8');print(result)
