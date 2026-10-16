from pathlib import Path
import json,numpy as np,cv2
from PIL import Image,ImageEnhance
root=Path('artifacts/physics-studio-audit');out=root/'reference-diffs';out.mkdir(exist_ok=True)
refs=Path('C:/Indian Servers/temp/Physics/studiotargetUI/all')
rows=json.loads((root/'studio-inventory.json').read_text())
captures={r['reference']:r for r in json.loads((root/'reference-captures.json').read_text())}
results=[]
def boundary(im):
 a=np.asarray(im.convert('RGB'),dtype=float)
 dy=np.abs(a[50:-50,1:321]-a[50:-50,:320]).mean(2)
 score=(dy>5).mean(0)*15+np.minimum(dy,20).mean(0)
 index=max(range(49,320),key=lambda x:score[x])
 return index+1,round(float(score[index]),3)
def ssim(a,b):
 x=cv2.cvtColor(a,cv2.COLOR_RGB2GRAY).astype(np.float64);y=cv2.cvtColor(b,cv2.COLOR_RGB2GRAY).astype(np.float64)
 mx=cv2.GaussianBlur(x,(11,11),1.5);my=cv2.GaussianBlur(y,(11,11),1.5)
 vx=cv2.GaussianBlur(x*x,(11,11),1.5)-mx*mx;vy=cv2.GaussianBlur(y*y,(11,11),1.5)-my*my
 cov=cv2.GaussianBlur(x*y,(11,11),1.5)-mx*my
 return float((((2*mx*my+6.5025)*(2*cov+58.5225))/((mx*mx+my*my+6.5025)*(vx+vy+58.5225))).mean())
for row in rows:
 cap=captures.get(row['mockup']);entry={'reference':row['mockup'],'route':row['currentRoute']}
 if not cap or cap.get('failure') or cap.get('actualWidth')!=row['width'] or cap.get('actualHeight')!=row['height']:
  results.append({**entry,'status':'Awaiting matching-size capture'});continue
 target=Image.open(refs/row['mockup']).convert('RGB');current=Image.open(root/'reference-captures'/f"{cap['key']}.png").convert('RGB')
 tx,score=boundary(target);cx=round(cap.get('mainLeft') or 0)
 if cx<40:cx,currentScore=boundary(current)
 currentMain=current.crop((cx,0,current.width,current.height)).resize((target.width-tx,target.height),Image.Resampling.LANCZOS)
 targetMain=target.crop((tx,0,target.width,target.height))
 a=np.array(targetMain);b=np.array(currentMain);delta=np.abs(a.astype(np.int16)-b.astype(np.int16))
 diff=Image.fromarray(np.minimum(delta*3,255).astype(np.uint8));diff.save(out/f"{cap['key']}.png")
 entry.update(status='Measured, manual visual review required',targetSidebar=tx,targetBorderConfidence=score,currentSidebar=cx,mae=round(float(delta.mean()),3),ssim=round(ssim(a,b),4),sidebarReviewRequired=score<25)
 results.append(entry)
(root/'visual-comparison.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
print('Compared',sum('ssim'in r for r in results),'/',len(rows),'pages; metrics do not establish fidelity.')
print('Review weakest:',sorted([(r['ssim'],r['route']) for r in results if 'ssim'in r])[:10])
