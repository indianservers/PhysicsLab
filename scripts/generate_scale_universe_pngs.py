from pathlib import Path
import math
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "assets" / "scale-universe" / "sprites"
SIZE = 192


SPRITES = [
    ("needle-tip", "pin"),
    ("dust-speck", "grain"),
    ("flour-grain", "grain"),
    ("sugar-crystal", "crystal"),
    ("mustard-seed", "seed"),
    ("chia-seed", "seed"),
    ("lentil", "seed"),
    ("peppercorn", "seed"),
    ("eraser", "block"),
    ("paperclip", "clip"),
    ("thumbtack", "pin"),
    ("staple", "clip"),
    ("button", "button"),
    ("marble", "sphere"),
    ("dice", "cube"),
    ("battery-aa", "battery"),
    ("chalk-stick", "cylinder"),
    ("usb-drive", "drive"),
    ("key", "key"),
    ("spoon", "spoon"),
    ("fork", "fork"),
    ("toothbrush", "brush"),
    ("calculator", "device"),
    ("notebook", "book"),
    ("textbook", "book"),
    ("water-bottle", "bottle"),
    ("coffee-mug", "mug"),
    ("desk-lamp", "lamp"),
    ("school-bag", "bag"),
    ("laptop", "laptop"),
    ("tablet", "tablet"),
    ("monitor", "monitor"),
    ("chair", "chair"),
    ("desk", "desk"),
    ("door", "door"),
    ("whiteboard", "board"),
    ("ceiling-fan", "fan"),
    ("classroom-window", "window"),
    ("student-desk-row", "desks"),
    ("laboratory-table", "table"),
    ("microscope", "microscope"),
    ("telescope", "telescope"),
    ("football-goal", "goal"),
    ("basketball-hoop", "hoop"),
    ("cricket-bat", "bat"),
    ("tennis-racket", "racket"),
    ("skateboard", "skateboard"),
    ("scooter", "scooter"),
    ("motorbike", "motorbike"),
    ("auto-rickshaw", "rickshaw"),
    ("minivan", "van"),
    ("bus-stop-shelter", "shelter"),
    ("traffic-signal", "signal"),
    ("street-light", "streetlight"),
    ("utility-pole", "pole"),
    ("small-tree", "tree"),
    ("mango-tree", "tree"),
    ("coconut-tree", "palm"),
    ("garden-bench", "bench"),
    ("playground-slide", "slide"),
    ("water-tank", "tank"),
    ("apartment-floor", "building"),
    ("two-storey-house", "house"),
    ("school-building", "school"),
    ("basketball-court", "court"),
    ("cricket-pitch", "pitch"),
    ("swimming-lane", "lane"),
    ("metro-train-car", "train"),
    ("railway-platform", "platform"),
    ("pedestrian-bridge", "bridge"),
    ("cell-tower", "tower"),
    ("wind-turbine", "turbine"),
    ("solar-panel-row", "solar"),
    ("water-tower", "watertower"),
    ("radio-telescope-dish", "dish"),
    ("small-pond", "pond"),
    ("city-block", "city"),
    ("neighborhood", "neighborhood"),
    ("village", "village"),
    ("stadium", "stadium"),
    ("airport-terminal", "terminal"),
    ("harbor-ship", "ship"),
    ("cargo-ship", "ship"),
    ("dam", "dam"),
    ("bridge-span", "bridge"),
    ("hill", "hill"),
    ("river-width", "river"),
    ("lake", "lake"),
    ("island", "island"),
    ("cloud", "cloud"),
    ("rain-cell", "cloud"),
    ("thunderstorm", "storm"),
    ("hot-air-balloon", "balloon"),
    ("drone", "drone"),
    ("satellite-bus", "satellite"),
]


PALETTE = {
    "blue": (42, 123, 220),
    "cyan": (18, 184, 210),
    "green": (45, 150, 82),
    "lime": (125, 190, 62),
    "yellow": (236, 180, 42),
    "orange": (232, 117, 39),
    "red": (210, 71, 63),
    "purple": (116, 89, 200),
    "gray": (112, 125, 140),
    "dark": (42, 52, 67),
    "brown": (142, 91, 49),
}


def rgba(color, alpha=255):
    return (*color, alpha)


def gradient_disc(draw, cx, cy, r, base):
    for i in range(int(r), 0, -1):
        t = i / r
        color = tuple(int(base[j] * (0.72 + 0.32 * (1 - t)) + 255 * 0.18 * (1 - t)) for j in range(3))
        draw.ellipse((cx - i, cy - i, cx + i, cy + i), fill=rgba(color, 255))
    draw.ellipse((cx - r * 0.35, cy - r * 0.45, cx + r * 0.05, cy - r * 0.1), fill=(255, 255, 255, 78))


def rounded_rect(draw, box, fill, radius=18, outline=None, width=2):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)
    x1, y1, x2, y2 = box
    draw.rounded_rectangle((x1 + 8, y1 + 6, x2 - 8, y1 + (y2 - y1) * 0.42), radius=radius, fill=(255, 255, 255, 42))


def shadow_layer():
    im = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse((34, 132, 158, 164), fill=(0, 0, 0, 48))
    return im.filter(ImageFilter.GaussianBlur(10))


def draw_sprite(kind, key):
    im = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    im.alpha_composite(shadow_layer())
    d = ImageDraw.Draw(im)
    color = list(PALETTE.values())[abs(hash(key)) % len(PALETTE)]
    alt = list(PALETTE.values())[(abs(hash(key)) // 7) % len(PALETTE)]

    if kind in {"grain", "seed", "crystal"}:
        for n in range(9 if kind == "grain" else 5):
            a = n * 1.9 + abs(hash(key)) % 5
            x = 96 + math.cos(a) * (12 + n * 2)
            y = 95 + math.sin(a) * (8 + n * 1.5)
            r = 12 + (n % 3) * 4
            gradient_disc(d, x, y, r, color if n % 2 else alt)
        if kind == "crystal":
            d.polygon([(96, 35), (138, 74), (122, 132), (73, 150), (48, 92)], fill=rgba(color, 210), outline=(255, 255, 255, 110))
            d.line((96, 35, 96, 128), fill=(255, 255, 255, 70), width=2)
            d.line((48, 92, 138, 74), fill=(255, 255, 255, 60), width=2)

    elif kind in {"sphere", "button"}:
        gradient_disc(d, 96, 88, 55, color)
        if kind == "button":
            for x in [82, 110]:
                for y in [75, 103]:
                    d.ellipse((x - 5, y - 5, x + 5, y + 5), fill=(35, 45, 58, 145))

    elif kind in {"cube", "block"}:
        rounded_rect(d, (47, 48, 145, 139), rgba(color), radius=14, outline=(255, 255, 255, 90), width=3)
        if kind == "cube":
            for x in [75, 96, 117]:
                for y in [73, 96, 119]:
                    d.ellipse((x - 5, y - 5, x + 5, y + 5), fill=(255, 255, 255, 190))

    elif kind in {"book", "board", "door", "window", "solar"}:
        rounded_rect(d, (38, 42, 154, 142), rgba(color), radius=10, outline=(255, 255, 255, 100), width=3)
        for i in range(4):
            y = 62 + i * 18
            d.line((55, y, 136, y), fill=(255, 255, 255, 110), width=2)
        if kind == "solar":
            for x in range(52, 146, 24):
                d.line((x, 45, x, 139), fill=(8, 25, 50, 95), width=2)

    elif kind in {"device", "drive", "tablet", "laptop", "monitor"}:
        rounded_rect(d, (39, 46, 153, 126), rgba((35, 45, 62)), radius=10, outline=(255, 255, 255, 110), width=3)
        rounded_rect(d, (50, 56, 142, 112), rgba(color, 230), radius=6)
        if kind in {"laptop", "monitor"}:
            d.rounded_rectangle((65, 128, 128, 142), radius=5, fill=(60, 70, 85, 255))

    elif kind in {"bottle", "mug", "battery"}:
        rounded_rect(d, (66, 45, 123, 143), rgba(color), radius=20, outline=(255, 255, 255, 100), width=3)
        d.rectangle((78, 32, 111, 50), fill=rgba(color))
        if kind == "mug":
            d.arc((111, 69, 154, 119), 270, 90, fill=rgba(color), width=10)
        if kind == "battery":
            d.rectangle((82, 24, 108, 39), fill=(220, 230, 240, 255))
            d.rectangle((73, 75, 116, 113), fill=(255, 255, 255, 55))

    elif kind in {"chair", "desk", "table", "bench", "desks"}:
        rounded_rect(d, (45, 58, 147, 102), rgba(color), radius=10, outline=(255, 255, 255, 90), width=2)
        for x in [60, 132]:
            d.line((x, 101, x - 12, 145), fill=rgba((45, 55, 70)), width=7)
        if kind in {"chair", "bench"}:
            rounded_rect(d, (52, 35, 140, 76), rgba(alt), radius=10)

    elif kind in {"car", "van", "rickshaw", "scooter", "motorbike", "train", "ship"}:
        rounded_rect(d, (35, 80, 157, 122), rgba(color), radius=18, outline=(255, 255, 255, 90), width=2)
        d.polygon([(62, 80), (82, 55), (121, 58), (141, 80)], fill=rgba(alt))
        if kind == "ship":
            d.polygon([(28, 96), (164, 96), (139, 132), (53, 132)], fill=rgba(color), outline=(255, 255, 255, 80))
        for x in [61, 132]:
            gradient_disc(d, x, 128, 12, PALETTE["dark"])

    elif kind in {"building", "house", "school", "shelter", "terminal", "city", "neighborhood", "village", "stadium"}:
        rounded_rect(d, (48, 50, 145, 145), rgba(color), radius=8, outline=(255, 255, 255, 90), width=2)
        if kind == "house":
            d.polygon([(40, 70), (96, 28), (152, 70)], fill=rgba(alt), outline=(255, 255, 255, 90))
        for x in range(62, 133, 24):
            for y in range(68, 128, 22):
                d.rounded_rectangle((x, y, x + 12, y + 11), radius=2, fill=(255, 235, 155, 185))

    elif kind in {"tree", "palm"}:
        d.rounded_rectangle((88, 83, 105, 148), radius=8, fill=rgba(PALETTE["brown"]))
        for n in range(7):
            a = n * math.pi * 2 / 7
            gradient_disc(d, 96 + math.cos(a) * 24, 64 + math.sin(a) * 16, 25, PALETTE["green"])
        if kind == "palm":
            for n in range(8):
                a = -math.pi / 2 + (n - 3.5) * 0.28
                d.line((96, 67, 96 + math.cos(a) * 58, 67 + math.sin(a) * 42), fill=rgba(PALETTE["green"]), width=8)

    elif kind in {"tower", "streetlight", "pole", "turbine", "dish", "signal", "watertower"}:
        d.line((96, 42, 96, 148), fill=rgba(color), width=10)
        d.line((74, 148, 118, 148), fill=rgba(color), width=8)
        if kind == "turbine":
            for a in [0, 2.1, 4.2]:
                d.polygon([(96, 62), (96 + math.cos(a) * 54, 62 + math.sin(a) * 12), (96 + math.cos(a + 0.18) * 20, 62 + math.sin(a + 0.18) * 8)], fill=(235, 245, 255, 230))
        elif kind == "dish":
            d.pieslice((48, 35, 144, 118), 200, 340, fill=rgba(alt), outline=(255, 255, 255, 90))
        elif kind == "signal":
            rounded_rect(d, (74, 40, 118, 120), rgba(PALETTE["dark"]), radius=12)
            for y, c in [(58, PALETTE["red"]), (80, PALETTE["yellow"]), (102, PALETTE["green"])]:
                gradient_disc(d, 96, y, 10, c)

    elif kind in {"cloud", "storm"}:
        for x, y, r in [(67, 91, 27), (93, 75, 36), (125, 95, 29)]:
            gradient_disc(d, x, y, r, (205, 222, 235))
        d.rounded_rectangle((47, 91, 147, 126), radius=25, fill=(205, 222, 235, 245))
        if kind == "storm":
            d.polygon([(92, 122), (75, 159), (98, 149), (87, 177), (123, 134), (102, 142)], fill=rgba(PALETTE["yellow"]))

    elif kind in {"river", "pond", "lake", "island"}:
        d.ellipse((31, 63, 161, 132), fill=rgba(PALETTE["cyan"], 225), outline=(255, 255, 255, 95), width=3)
        d.arc((42, 75, 150, 116), 10, 165, fill=(255, 255, 255, 90), width=3)
        if kind == "island":
            d.ellipse((76, 78, 118, 108), fill=rgba(PALETTE["green"]))

    elif kind in {"hill"}:
        d.polygon([(24, 142), (82, 61), (121, 110), (152, 78), (174, 142)], fill=rgba(PALETTE["green"]), outline=(255, 255, 255, 80))
        d.line((82, 61, 95, 82), fill=(255, 255, 255, 130), width=3)

    elif kind in {"balloon", "drone", "satellite"}:
        if kind == "balloon":
            gradient_disc(d, 96, 69, 43, color)
            d.polygon([(78, 111), (114, 111), (105, 141), (87, 141)], fill=rgba(PALETTE["brown"]))
        elif kind == "drone":
            rounded_rect(d, (76, 78, 116, 104), rgba(color), radius=10)
            for x, y in [(54, 65), (138, 65), (54, 119), (138, 119)]:
                d.line((96, 91, x, y), fill=rgba(color), width=4)
                d.ellipse((x - 14, y - 7, x + 14, y + 7), outline=rgba(alt), width=4)
        else:
            rounded_rect(d, (78, 70, 114, 111), rgba(color), radius=6)
            d.rectangle((34, 76, 75, 104), fill=rgba(PALETTE["blue"], 210))
            d.rectangle((117, 76, 158, 104), fill=rgba(PALETTE["blue"], 210))

    else:
        # Generic polished object mark.
        gradient_disc(d, 96, 88, 50, color)
        d.rounded_rectangle((54, 120, 138, 139), radius=9, fill=rgba(alt))

    return im


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for key, kind in SPRITES:
        draw_sprite(kind, key).save(OUT / f"{key}.png")
    print(f"generated {len(SPRITES)} png sprites in {OUT}")


if __name__ == "__main__":
    main()
