from pathlib import Path
from PIL import Image
import numpy as np,cv2,json,shutil
root=Path('artifacts/physics-studio-audit');refs=Path('C:/Indian Servers/temp/Physics/studiotargetUI/all/08_oscillations')
rows=[('spring-shm','01_spring_shm.png',245,201,'spring-shm'),('pendulum','02_pendulum.png',217,217,'pendulum'),('energy-exchange','03_energy_exchange.png',224,201,'energy-exchange'),('damping','04_damping.png',224,201,'damping'),('resonance','05_resonance.png',197,201,'resonance'),('coupled','06_coupled_oscillators.png',223,201,'coupled-oscillators')]
results=[]
for folder,reference,target_side,current_side,route in rows:
 out=root/folder;current=out/'after-1536.png'
 if not current.exists():continue
 target=Image.open(refs/reference).convert('RGB');capture=Image.open(current).convert('RGB');a=target.crop((target_side,0,target.width,target.height));b=capture.crop((current_side,0,capture.width,target.height)).resize(a.size,Image.Resampling.LANCZOS)
 aa=np.asarray(a);bb=np.asarray(b);d=np.abs(aa.astype(float)-bb.astype(float));x=cv2.cvtColor(aa,cv2.COLOR_RGB2GRAY).astype(float);y=cv2.cvtColor(bb,cv2.COLOR_RGB2GRAY).astype(float);mx=cv2.GaussianBlur(x,(11,11),1.5);my=cv2.GaussianBlur(y,(11,11),1.5);vx=cv2.GaussianBlur(x*x,(11,11),1.5)-mx*mx;vy=cv2.GaussianBlur(y*y,(11,11),1.5)-my*my;cov=cv2.GaussianBlur(x*y,(11,11),1.5)-mx*my;ssim=float((((2*mx*my+6.5025)*(2*cov+58.5225))/((mx*mx+my*my+6.5025)*(vx+vy+58.5225))).mean())
 Image.fromarray(np.minimum(d*3,255).astype('uint8')).save(out/'difference.png');comparison=Image.new('RGB',(a.width*2,a.height));comparison.paste(a,(0,0));comparison.paste(b,(a.width,0));comparison.save(out/'comparison.png')
 before=root/'reference-captures'/('08_oscillations__'+reference)
 if before.exists() and not (out/'before.png').exists():shutil.copy2(before,out/'before.png')
 result={'route':'/motion/'+route,'reference':'08_oscillations/'+reference,'viewport':[target.width,target.height],'sidebarExcluded':True,'targetSidebar':target_side,'currentSidebar':current_side,'meanAbsoluteChannelDifference':round(float(d.mean()),3),'ssim':round(ssim,4),'beforeSource':str(before),'note':'Diagnostic metrics are not acceptance percentages. Rebuilt apparatus material/light realism remains different from target photos; current state is frozen at documented model time. Existing sidebar excluded and main region widths aligned. Correct physics values replace inconsistent illustrative reference values.'};(out/'visual-comparison.json').write_text(json.dumps(result,indent=2),encoding='utf-8');results.append(result)
print(json.dumps([{k:r[k] for k in ['route','meanAbsoluteChannelDifference','ssim']} for r in results],indent=2))
