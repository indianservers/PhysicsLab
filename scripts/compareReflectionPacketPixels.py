from PIL import Image
import numpy as np,json
from pathlib import Path
folder=Path('artifacts/physics-studio-audit/reflection')
a=np.asarray(Image.open(folder/'packet-time-0.png').convert('RGB')).astype(int)
b=np.asarray(Image.open(folder/'packet-time-037ns.png').convert('RGB')).astype(int)
difference=np.abs(a-b)
result={'physicalTimeBeforeSeconds':0,'physicalTimeAfterSeconds':.37e-9,'changedPixels':int(np.any(difference>0,axis=2).sum()),'stronglyChangedPixels':int(np.any(difference>20,axis=2).sum()),'maxChannelDifference':int(difference.max()),'scope':'Same paused apparatus and ray geometry; only model packet time changes.'}
assert result['stronglyChangedPixels']>0
(folder/'visible-packet-motion.json').write_bytes(json.dumps(result,indent=2).encode('utf-8'))
print(result)
