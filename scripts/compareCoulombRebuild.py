from pathlib import Path
from PIL import Image
import numpy as np,cv2,json,subprocess,re
out=Path('artifacts/physics-studio-audit/coulomb-force')
a=Image.open('C:/Indian Servers/temp/Physics/studiotargetUI/all/11_electricity/01_coulomb_force.png').convert('RGB').crop((204,0,1536,1024));b=Image.open(out/'after-1536.png').convert('RGB').crop((201,0,1536,1024)).resize(a.size,Image.Resampling.LANCZOS)
aa=np.asarray(a);bb=np.asarray(b);d=np.abs(aa.astype(float)-bb.astype(float));x=cv2.cvtColor(aa,cv2.COLOR_RGB2GRAY).astype(float);y=cv2.cvtColor(bb,cv2.COLOR_RGB2GRAY).astype(float);mx=cv2.GaussianBlur(x,(11,11),1.5);my=cv2.GaussianBlur(y,(11,11),1.5);vx=cv2.GaussianBlur(x*x,(11,11),1.5)-mx*mx;vy=cv2.GaussianBlur(y*y,(11,11),1.5)-my*my;cov=cv2.GaussianBlur(x*y,(11,11),1.5)-mx*my;ssim=float((((2*mx*my+6.5025)*(2*cov+58.5225))/((mx*mx+my*my+6.5025)*(vx+vy+58.5225))).mean())
Image.fromarray(np.minimum(d*3,255).astype('uint8')).save(out/'difference.png');comparison=Image.new('RGB',(a.width*2,1024));comparison.paste(a,(0,0));comparison.paste(b,(a.width,0));comparison.save(out/'comparison.png')
old=subprocess.check_output(['git','show','HEAD:src/pages/CoulombForceStudioPage.tsx'],encoding='utf-8');new=Path('src/pages/CoulombForceStudioPage.tsx').read_text(encoding='utf-8-sig');sidebar=lambda s:re.search(r'<aside className="frs-side">.*?</aside>',s,re.S).group();assert sidebar(old)==sidebar(new)
regions={}
for name,(l,t,r,bot)in {'header':(204,0,1536,83),'apparatus':(213,83,1118,923),'controls':(1128,83,1520,340),'readingsAndEquation':(1128,350,1520,665),'graph':(1128,674,1520,923),'transport':(213,947,1520,1000)}.items():regions[name]={'meanAbsoluteChannelDifference':round(float(d[t:bot,l-204:r-204].mean()),3)}
result={'route':'/electricity/coulomb-force','reference':'11_electricity/01_coulomb_force.png','viewport':[1536,1024],'targetSidebarWidth':204,'currentSidebarWidth':201,'sidebarExcluded':True,'sidebarSourceUnchanged':True,'mainWidthNormalized':True,'meanAbsoluteChannelDifference':round(float(d.mean()),3),'ssim':round(ssim,4),'regions':regions,'note':'Diagnostics, not acceptance percentages. Original native point-charge apparatus, model field lines, equipotential wireframes and strength slice. Sidebar unchanged; four reference modes. Field readings and a true slope-minus-two log-log curve correct inconsistent mockup values. Background/material realism, fine hardware and typography remain open. No reference pixels are application assets.'}
(out/'visual-comparison.json').write_bytes(json.dumps(result,indent=2).encode('utf-8'));print(result)
first=np.asarray(Image.open(out/'markers-0.png').convert('RGB')).astype(int);last=np.asarray(Image.open(out/'markers-0.37.png').convert('RGB')).astype(int);mask=np.max(np.abs(first-last),axis=2)>20;count=int(mask.sum());assert count>10,'Native representative direction markers should move visibly';motion={'passed':True,'pixelsChangingByMoreThan20':count,'inspectionTimesSeconds':[0,.37],'view':'field-direction markers','note':'Actual rendered stage pixels; inspection time set through Experiment. These markers illustrate field direction, not physical charge flow.'};(out/'visible-direction-motion.json').write_bytes(json.dumps(motion,indent=2).encode('utf-8'));print(motion)
thumbs=[]
for width in [1536,1920,1024,768,390,320]:
 im=Image.open(out/f'after-{width}.png').convert('RGB');im.thumbnail((430,680));thumbs.append((width,im))
sheet=Image.new('RGB',(1290,1440),'#061321')
from PIL import ImageDraw
for i,(width,im)in enumerate(thumbs):
 col=i%3;row=i//3;sheet.paste(im,(col*430,row*720+30));ImageDraw.Draw(sheet).text((col*430+10,row*720+8),str(width)+' px',fill='white')
sheet.save(out/'responsive-contact-sheet.png')
