from pathlib import Path
from PIL import Image

Image.MAX_IMAGE_PIXELS = None


def stitch_group(parts: list[Path]) -> Path:
    images = [Image.open(part).convert("RGB") for part in parts]
    width = max(image.width for image in images)
    height = sum(image.height for image in images)
    output = Image.new("RGB", (width, height), "white")
    y = 0
    for image in images:
        output.paste(image, (0, y))
        y += image.height
    destination = Path(str(parts[0]).split(".part000.png")[0] + ".png")
    output.save(destination, format="PNG", optimize=True)
    for image in images:
        image.close()
    for part in parts:
        part.unlink()
    return destination


root = Path(r"C:\Indian Servers\temp\Physics")
groups: dict[str, list[Path]] = {}
for part in root.rglob("*.part*.png"):
    key = str(part).split(".part")[0]
    groups.setdefault(key, []).append(part)

for key, parts in sorted(groups.items()):
    ordered = sorted(parts)
    destination = stitch_group(ordered)
    print(f"{destination}\t{len(ordered)} tiles")
