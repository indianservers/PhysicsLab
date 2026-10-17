from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np,cv2,json,subprocess,re
out=Path('artifacts/physics-studio-audit/transistors')
a=Image.open('C:/Indian Servers/temp/Physics/studiotargetUI/all/13_electronics/03_transistors.png').convert('RGB').crop((181,0,1536,1024))
def metrics(im):
 b=im.convert('RGB').crop((201,0,1536,1024)).resize(a.size,Image.Resampling.LANCZOS);aa=np.asarray(a);bb=np.asarray(b);d=np.abs(aa.astype(float)-bb.astype(float));x=cv2.cvtColor(aa,cv2.COLOR_RGB2GRAY).astype(float);y=cv2.cvtColor(bb,cv2.COLOR_RGB2GRAY).astype(float);mx=cv2.GaussianBlur(x,(11,11),1.5);my=cv2.GaussianBlur(y,(11,11),1.5);vx=cv2.GaussianBlur(x*x,(11,11),1.5)-mx*mx;vy=cv2.GaussianBlur(y*y,(11,11),1.5)-my*my;cov=cv2.GaussianBlur(x*y,(11,11),1.5)-mx*my;ssim=float((((2*mx*my+6.5025)*(2*cov+58.5225))/((mx*mx+my*my+6.5025)*(vx+vy+58.5225))).mean());return b,d,{'meanAbsoluteChannelDifference':round(float(d.mean()),3),'ssim':round(ssim,4)}
b,d,after=metrics(Image.open(out/'after-1536.png'));_,_,before=metrics(Image.open(out/'before.png'));Image.fromarray(np.minimum(d*3,255).astype('uint8')).save(out/'difference.png');comparison=Image.new('RGB',(a.width*2,1024));comparison.paste(a,(0,0));comparison.paste(b,(a.width,0));comparison.save(out/'comparison.png')

result={"before":before,"after":after,"sidebarExcluded":True,"targetSidebarWidth":181,"currentSidebarWidth":201,"note":"Diagnostic metrics, not completion percentages. Native apparatus and correct SI model differ from the reference. Visual refinement remains open."}; (out/"visual-comparison.json").write_text(json.dumps(result,indent=2),encoding="utf-8"); print(result)

regions={'header':(181,0,1536,114),'stage':(199,114,1056,487),'controls':(199,500,1056,719),'transferAndRegions':(199,732,1056,921),'output':(1073,120,1522,455),'parameters':(1073,469,1522,733),'relationAndChallenge':(1073,747,1522,921),'toolbar':(199,936,1522,1000)}
result['regions']={name:{'meanAbsoluteChannelDifference':round(float(d[t:bot,l-181:r-181].mean()),3)} for name,(l,t,r,bot) in regions.items()}
old=subprocess.check_output(['git','show','HEAD:src/pages/TransistorsStudioPage.tsx'],encoding='utf-8')
new=Path('src/pages/TransistorsStudioPage.tsx').read_text(encoding='utf-8-sig')
sidebar=lambda s:re.search(r'<aside className="frs-side">.*?</aside>',s,re.S).group()
result['sidebarSourceUnchanged']=sidebar(old)==sidebar(new);assert result['sidebarSourceUnchanged']
(out/'visual-comparison.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
first=np.asarray(Image.open(out/'motion-0.png').convert('RGB')).astype(int);last=np.asarray(Image.open(out/'motion-1s.png').convert('RGB')).astype(int)
count=int((np.max(np.abs(first-last),axis=2)>20).sum());assert count>10
(out/'visible-branch-flow.json').write_text(json.dumps({'passed':True,'pixelsChangingByMoreThan20':count,'modelTimesSeconds':[0,1],'note':'Native two-channel supplies and collector/base packets share the model and integrated branch charge. Packet speeds are symbolic charge flux, not electron drift.'},indent=2),encoding='utf-8')
sheet=Image.new('RGB',(1720,1440),'#061321')
for i,width in enumerate([1536,1920,1251,1250,1024,768,390,320]):
 im=Image.open(out/f'after-{width}.png').convert('RGB');im.thumbnail((430,680));sheet.paste(im,(i%4*430,i//4*720+30));ImageDraw.Draw(sheet).text((i%4*430+10,i//4*720+8),str(width)+' px',fill='white')
sheet.save(out/'responsive-contact-sheet.png')
