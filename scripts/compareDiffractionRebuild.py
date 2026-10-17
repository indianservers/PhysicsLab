from pathlib import Path
from PIL import Image
import numpy as np,cv2,json,subprocess,re
out=Path('artifacts/physics-studio-audit/diffraction')
a=Image.open('C:/Indian Servers/temp/Physics/studiotargetUI/all/10_optics/06_diffraction.png').convert('RGB').crop((203,0,1536,1024));b=Image.open(out/'after-1536.png').convert('RGB').crop((201,0,1536,1024)).resize(a.size,Image.Resampling.LANCZOS)
aa=np.asarray(a);bb=np.asarray(b);d=np.abs(aa.astype(float)-bb.astype(float));x=cv2.cvtColor(aa,cv2.COLOR_RGB2GRAY).astype(float);y=cv2.cvtColor(bb,cv2.COLOR_RGB2GRAY).astype(float);mx=cv2.GaussianBlur(x,(11,11),1.5);my=cv2.GaussianBlur(y,(11,11),1.5);vx=cv2.GaussianBlur(x*x,(11,11),1.5)-mx*mx;vy=cv2.GaussianBlur(y*y,(11,11),1.5)-my*my;cov=cv2.GaussianBlur(x*y,(11,11),1.5)-mx*my;ssim=float((((2*mx*my+6.5025)*(2*cov+58.5225))/((mx*mx+my*my+6.5025)*(vx+vy+58.5225))).mean())
Image.fromarray(np.minimum(d*3,255).astype('uint8')).save(out/'difference.png');comparison=Image.new('RGB',(a.width*2,1024));comparison.paste(a,(0,0));comparison.paste(b,(a.width,0));comparison.save(out/'comparison.png')
old=subprocess.check_output(['git','show','HEAD:src/pages/DiffractionStudioPage.tsx'],encoding='utf-8');new=Path('src/pages/DiffractionStudioPage.tsx').read_text(encoding='utf-8-sig');sidebar=lambda s:re.search(r'<aside className="frs-side">.*?</aside>',s,re.S).group();assert sidebar(old)==sidebar(new)
regions={}
for name,(l,t,r,bot)in {'header':(203,0,1536,90),'apparatus':(213,90,1194,612),'lowerCards':(213,620,1526,935),'inspector':(1201,90,1526,612),'transport':(213,950,1526,1002)}.items():regions[name]={'meanAbsoluteChannelDifference':round(float(d[t:bot,l-203:r-203].mean()),3)}
result={'route':'/optics/diffraction','reference':'10_optics/06_diffraction.png','viewport':[1536,1024],'targetSidebarWidth':203,'currentSidebarWidth':201,'sidebarExcluded':True,'sidebarSourceUnchanged':True,'mainWidthNormalized':True,'meanAbsoluteChannelDifference':round(float(d.mean()),3),'ssim':round(ssim,4),'regions':regions,'note':'Diagnostics, not acceptance percentages. Original apparatus, aperture close-up and real Top/Side/Front camera views; four reference learning modes. Corrected default width 6.32 mm and ±0.362° instead of inconsistent mockup readings. Sidebar preserved. Materials/background, apparatus proportions, instrument detail and typography remain open. No reference pixels are application assets.'}
(out/'visual-comparison.json').write_bytes(json.dumps(result,indent=2).encode('utf-8'));print(result)
first=np.asarray(Image.open(out/'packets-0.png').convert('RGB')).astype(int);last=np.asarray(Image.open(out/'packets-0.37.png').convert('RGB')).astype(int);mask=np.max(np.abs(first-last),axis=2)>20;count=int(mask.sum());assert count>10,'Native representative packets should move visibly';motion={'passed':True,'pixelsChangingByMoreThan20':count,'physicalTimesNs':[0,.37],'view':'axis markers','note':'Actual rendered stage pixels; paused time set through the Experiment control.'};(out/'visible-packet-motion.json').write_bytes(json.dumps(motion,indent=2).encode('utf-8'));print(motion)
thumbs=[]
for width in [1536,1920,1024,768,390,320]:
 im=Image.open(out/f'after-{width}.png').convert('RGB');im.thumbnail((430,680));thumbs.append((width,im))
sheet=Image.new('RGB',(1290,1440),'#061321')
from PIL import ImageDraw
for i,(width,im)in enumerate(thumbs):
 col=i%3;row=i//3;sheet.paste(im,(col*430,row*720+30));ImageDraw.Draw(sheet).text((col*430+10,row*720+8),str(width)+' px',fill='white')
sheet.save(out/'responsive-contact-sheet.png')
