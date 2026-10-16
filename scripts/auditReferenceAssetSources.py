import json,cv2,numpy as np
from pathlib import Path
from urllib.parse import urlparse,unquote
root=Path('artifacts/physics-studio-audit');public=Path('public').resolve();references=Path('C:/Indian Servers/temp/Physics/studiotargetUI/all')
rows=json.loads((root/'reference-tabs.json').read_text());orb=cv2.ORB_create(nfeatures=1400);matcher=cv2.BFMatcher(cv2.NORM_HAMMING)
cache={};results=[]
def features(path):
 key=str(path)
 if key not in cache:
  image=cv2.imdecode(np.fromfile(path,dtype=np.uint8),cv2.IMREAD_GRAYSCALE)
  if image is None:cache[key]=(None,None);return cache[key]
  if max(image.shape)>1200:image=cv2.resize(image,None,fx=1200/max(image.shape),fy=1200/max(image.shape))
  cache[key]=orb.detectAndCompute(image,None)
 return cache[key]
for row in rows:
 kpTarget,dTarget=features(references/row['reference'])
 for url in row.get('assets',[]):
  path=(public/unquote(urlparse(url).path).lstrip('/')).resolve()
  if not path.is_relative_to(public) or not path.exists() or path.suffix.lower() not in ['.png','.jpg','.jpeg','.webp']:continue
  kp,des=features(path)
  if des is None or dTarget is None:continue
  matches=matcher.knnMatch(des,dTarget,k=2);good=[m[0] for m in matches if len(m)==2 and m[0].distance<.7*m[1].distance]
  inliers=0
  if len(good)>=8:
   a=np.float32([kp[m.queryIdx].pt for m in good]).reshape(-1,1,2);b=np.float32([kpTarget[m.trainIdx].pt for m in good]).reshape(-1,1,2)
   _,mask=cv2.findHomography(a,b,cv2.RANSAC,4)
   if mask is not None:inliers=int(mask.sum())
  results.append({'reference':row['reference'],'route':row['route'],'asset':str(path.relative_to(public)),'featureMatches':len(good),'consistentMatches':inliers,'review':inliers>=12 and inliers/max(1,len(good))>=.7})
(root/'asset-source-review.json').write_text(json.dumps(results,indent=2),encoding='utf-8');print('Checked',len(results),'asset/reference pairs. Potential shared-image regions:',sum(r['review'] for r in results));print([r for r in results if r['review']])
