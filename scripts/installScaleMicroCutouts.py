"""Copy generated PNGs without modifying pixels; validate alpha and index content bounds."""
import json
import shutil
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
report_dir = root / 'artifacts/scale-universe-upgrade'
sources = json.loads((report_dir / 'micro-generation-prompts.json').read_text(encoding='utf-8'))
destination = root / 'public/assets/scale-universe/cutouts-v3'
destination.mkdir(parents=True, exist_ok=True)
manifest_path = root / 'src/physics/scale-of-universe/scaleUniverseCutouts.js'
manifest = json.loads(manifest_path.read_text(encoding='utf-8').split('=', 1)[1].strip().rstrip(';'))
results = []
for entry in sources:
    source = Path(entry['source'])
    with Image.open(source) as image:
        assert image.mode == 'RGBA', (entry['id'], image.mode)
        alpha = image.getchannel('A')
        histogram = alpha.histogram()
        transparent_fraction = histogram[0] / (image.width * image.height)
        corners = [alpha.getpixel(point) for point in [(0, 0), (image.width-1, 0), (0, image.height-1), (image.width-1, image.height-1)]]
        # Some generated antialiased corners retain alpha 1/255, visually transparent.
        assert max(corners) <= 1, (entry['id'], 'opaque corner', corners)
        assert transparent_fraction > .1, (entry['id'], 'insufficient transparency')
        bounds = alpha.point(lambda value: 255 if value > 32 else 0).getbbox()
        assert bounds, entry['id']
        left, top, right, bottom = bounds
        metadata = {
            'assetPath': f"/assets/scale-universe/cutouts-v3/{entry['id']}.png",
            'sourceBox': [left, top, right-left, bottom-top],
            'aspect': (right-left)/(bottom-top),
            'alphaExtrema': list(alpha.getextrema()),
            'generation': 'OpenAI imagegen; illustrative AI-generated asset, not a scientific measurement source',
        }
        results.append({'id': entry['id'], 'size': list(image.size), 'transparentFraction': transparent_fraction, 'cornerAlpha': corners, **metadata})
        manifest[entry['id']] = metadata
    shutil.copy2(source, destination / f"{entry['id']}.png")
manifest_path.write_text('export const scaleCutouts = ' + json.dumps(manifest, indent=2) + ';\n', encoding='utf-8')
(report_dir / 'micro-alpha-verification.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
print(f'Installed {len(results)} unmodified transparent PNGs; corner alpha is at most 1/255.')
