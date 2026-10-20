"""Validate and copy generated cutouts without altering image pixels."""
import json
import shutil
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
reports = root / 'artifacts/scale-universe-upgrade'
target = root / 'public/assets/scale-universe/cutouts-v4'
target.mkdir(parents=True, exist_ok=True)
manifest_path = root / 'src/physics/scale-of-universe/scaleUniverseCutouts.js'
manifest = json.loads(manifest_path.read_text(encoding='utf-8').split('=', 1)[1].strip().rstrip(';'))
results, rejected, prompts = [], [], []
for file in sorted((reports / 'remaining-generation').glob('*.json')):
    entry = json.loads(file.read_text(encoding='utf-8'))
    prompts.append(entry)
    filename = entry['id'] + ('-reviewed' if entry.get('revision') else '') + '.png'
    with Image.open(entry['source']) as image:
        if image.mode != 'RGBA':
            rejected.append({'id': entry['id'], 'reason': 'No alpha channel'})
            continue
        alpha = image.getchannel('A')
        corners = [alpha.getpixel(point) for point in [(0, 0), (image.width-1, 0), (0, image.height-1), (image.width-1, image.height-1)]]
        fraction = alpha.histogram()[0] / (image.width * image.height)
        if max(corners) > 1 or fraction < .1:
            rejected.append({'id': entry['id'], 'reason': 'Background is insufficiently transparent', 'cornerAlpha': corners, 'transparentFraction': fraction})
            continue
        bounds = alpha.point(lambda value: 255 if value > 32 else 0).getbbox()
        left, top, right, bottom = bounds
        metadata = {
            'assetPath': f"/assets/scale-universe/cutouts-v4/{filename}",
            'sourceBox': [left, top, right-left, bottom-top],
            'aspect': (right-left)/(bottom-top),
            'alphaExtrema': list(alpha.getextrema()),
            'generation': 'OpenAI imagegen; illustrative AI-generated asset, not a scientific measurement source',
        }
        manifest[entry['id']] = metadata
        results.append({'id': entry['id'], 'size': list(image.size), 'cornerAlpha': corners, 'transparentFraction': fraction, **metadata})
    shutil.copy2(entry['source'], target / filename)
manifest_path.write_text('export const scaleCutouts = ' + json.dumps(manifest, indent=2) + ';\n', encoding='utf-8')
(reports / 'remaining-alpha-verification.json').write_text(json.dumps({'installed': results, 'rejected': rejected}, indent=2), encoding='utf-8')
(reports / 'remaining-generation-final.json').write_text(json.dumps(prompts, indent=2), encoding='utf-8')
audit = json.loads((reports / 'remaining-image-audit.json').read_text(encoding='utf-8'))
for object in audit:
    if object['id'] in manifest:
        object['status'] = 'transparent-cutout'
        object['assetPath'] = manifest[object['id']]['assetPath']
(reports / 'image-coverage-current.json').write_text(json.dumps({
    'transparentCutouts': sum(object['status'] == 'transparent-cutout' for object in audit),
    'scientificSchematics': sum(object['status'] == 'scientific-schematic' for object in audit),
    'remaining': [object for object in audit if object['status'] == 'needs-specific-cutout'],
    'objects': audit,
}, indent=2), encoding='utf-8')
print(json.dumps({'installed': len(results), 'rejected': rejected}))
