from pathlib import Path
from PIL import Image
import numpy as np,cv2,json,shutil
root=Path('artifacts/physics-studio-audit');out=root/'reflection';reference=Path('C:/Indian Servers/temp/Physics/studiotargetUI/all/10_optics/01_reflection.png')
a=Image.open(reference).convert('RGB').crop((200,0,1536,1024));b=Image.open(out/'after-1536.png').convert('RGB').crop((201,0,1536,1024)).resize(a.size,Image.Resampling.LANCZOS)
aa=np.asarray(a);bb=np.asarray(b);d=np.abs(aa.astype(float)-bb.astype(float));x=cv2.cvtColor(aa,cv2.COLOR_RGB2GRAY).astype(float);y=cv2.cvtColor(bb,cv2.COLOR_RGB2GRAY).astype(float);mx=cv2.GaussianBlur(x,(11,11),1.5);my=cv2.GaussianBlur(y,(11,11),1.5);vx=cv2.GaussianBlur(x*x,(11,11),1.5)-mx*mx;vy=cv2.GaussianBlur(y*y,(11,11),1.5)-my*my;cov=cv2.GaussianBlur(x*y,(11,11),1.5)-mx*my;ssim=float((((2*mx*my+6.5025)*(2*cov+58.5225))/((mx*mx+my*my+6.5025)*(vx+vy+58.5225))).mean())
Image.fromarray(np.minimum(d*3,255).astype('uint8')).save(out/'difference.png');comparison=Image.new('RGB',(a.width*2,a.height));comparison.paste(a,(0,0));comparison.paste(b,(a.width,0));comparison.save(out/'comparison.png')
before=root/'reference-captures/10_optics__01_reflection.png'
if before.exists():shutil.copy2(before,out/'before.png')
regions={}
for name,(left,top,right,bottom) in {'header':(220,0,1517,94),'apparatus':(220,94,1174,709),'transport':(220,724,1174,766),'inspector':(1187,94,1517,766),'lower_cards':(220,781,1517,992)}.items():
 region=d[top:bottom,left-200:right-200];regions[name]={'meanAbsoluteChannelDifference':round(float(region.mean()),3)}
result={'route':'/optics/reflection','reference':'10_optics/01_reflection.png','viewport':[1536,1024],'targetSidebar':200,'currentSidebar':201,'sidebarExcluded':True,'meanAbsoluteChannelDifference':round(float(d.mean()),3),'ssim':round(ssim,4),'regions':regions,'frozenTimeSeconds':0,'parameters':{'incidentDegrees':40,'mirrorDegrees':0,'rays':3},'note':'Diagnostic metrics, not acceptance percentages. Main reflector is a straight plane and impact/protractor centers coincide; reference photograph/illustration offsets the vertex and has different apparent ray angles. Native materials/lighting, instrument detail and font treatment remain below photographic target. No screenshot assets used in app.'};(out/'visual-comparison.json').write_bytes(json.dumps(result,indent=2).encode('utf-8'));print(result)
