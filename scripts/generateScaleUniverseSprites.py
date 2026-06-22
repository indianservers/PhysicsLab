from __future__ import annotations

import math
import re
from pathlib import Path
from typing import Callable

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "src" / "physics" / "scale-of-universe" / "scaleUniverseSpriteCatalog.js"
OUT = ROOT / "public" / "assets" / "scale-universe" / "sprites"
SIZE = 512
SCALE = 3


def parse_asset_keys() -> list[str]:
    text = CATALOG.read_text(encoding="utf-8")
    keys: list[str] = []
    for line in text.splitlines():
      match = re.match(r'\s*(?:"([^"]+)"|([a-z0-9-]+)):\s*\{', line)
      if match:
          keys.append(match.group(1) or match.group(2))
    return keys


def canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGBA", (SIZE * SCALE, SIZE * SCALE), (0, 0, 0, 0))
    return image, ImageDraw.Draw(image, "RGBA")


def sc(value: float) -> int:
    return round(value * SCALE)


def box(x0: float, y0: float, x1: float, y1: float) -> tuple[int, int, int, int]:
    return (sc(x0), sc(y0), sc(x1), sc(y1))


def line(draw: ImageDraw.ImageDraw, coords: list[tuple[float, float]], fill, width: float = 4) -> None:
    draw.line([(sc(x), sc(y)) for x, y in coords], fill=fill, width=sc(width), joint="curve")


def shadow(image: Image.Image, bbox: tuple[float, float, float, float], blur: float = 15) -> None:
    layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer, "RGBA")
    d.ellipse(box(*bbox), fill=(0, 0, 0, 82))
    layer = layer.filter(ImageFilter.GaussianBlur(sc(blur)))
    image.alpha_composite(layer)


def radial_sphere(draw: ImageDraw.ImageDraw, cx: float, cy: float, r: float, base, hi=(255, 255, 255, 185)) -> None:
    for i in range(34, 0, -1):
        t = i / 34
        color = tuple(round(base[j] * (0.55 + 0.45 * t)) for j in range(3)) + (255,)
        draw.ellipse(box(cx - r * t, cy - r * t, cx + r * t, cy + r * t), fill=color)
    draw.ellipse(box(cx - r * 0.45, cy - r * 0.5, cx + r * 0.05, cy - r * 0.05), fill=hi)


def save_asset(key: str, drawer: Callable[[Image.Image, ImageDraw.ImageDraw], None]) -> None:
    image, draw = canvas()
    drawer(image, draw)
    image = image.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    image.save(OUT / f"{key}.png")


def draw_football(image, draw) -> None:
    shadow(image, (122, 372, 390, 440), 18)
    radial_sphere(draw, 256, 256, 142, (238, 244, 246))
    draw.polygon([(sc(256), sc(172)), (sc(316), sc(215)), (sc(294), sc(288)), (sc(218), sc(288)), (sc(196), sc(215))], fill=(24, 33, 48, 245))
    for pts in [
        [(196, 215), (150, 222), (130, 270), (170, 302), (218, 288)],
        [(316, 215), (362, 222), (382, 270), (342, 302), (294, 288)],
        [(218, 288), (198, 355), (256, 396), (314, 355), (294, 288)],
        [(196, 215), (190, 150), (256, 114), (322, 150), (316, 215)],
    ]:
        draw.line([(sc(x), sc(y)) for x, y in pts], fill=(18, 25, 36, 230), width=sc(7), joint="curve")
    draw.ellipse(box(138, 138, 374, 374), outline=(255, 255, 255, 190), width=sc(9))


def draw_school_bag(image, draw) -> None:
    shadow(image, (148, 390, 364, 450), 18)
    draw.rounded_rectangle(box(164, 116, 348, 390), radius=sc(36), fill=(37, 89, 157, 255), outline=(15, 46, 92, 255), width=sc(7))
    draw.rounded_rectangle(box(190, 94, 322, 155), radius=sc(32), fill=(48, 111, 188, 255), outline=(15, 46, 92, 230), width=sc(6))
    draw.rounded_rectangle(box(184, 240, 328, 372), radius=sc(26), fill=(242, 165, 56, 255), outline=(141, 72, 16, 230), width=sc(6))
    draw.rounded_rectangle(box(198, 258, 314, 340), radius=sc(18), fill=(255, 190, 78, 255), outline=(161, 85, 22, 220), width=sc(5))
    draw.arc(box(122, 154, 196, 356), start=100, end=268, fill=(20, 54, 103, 255), width=sc(17))
    draw.arc(box(316, 154, 390, 356), start=-88, end=80, fill=(20, 54, 103, 255), width=sc(17))
    draw.line([(sc(256), sc(116)), (sc(256), sc(390))], fill=(185, 219, 255, 105), width=sc(4))
    draw.rounded_rectangle(box(214, 274, 298, 292), radius=sc(9), fill=(31, 73, 132, 205))


def draw_basketball(image, draw) -> None:
    shadow(image, (122, 372, 390, 440), 18)
    radial_sphere(draw, 256, 256, 142, (229, 112, 35))
    draw.arc(box(112, 110, 400, 402), start=80, end=280, fill=(55, 31, 22, 230), width=sc(8))
    draw.arc(box(112, 110, 400, 402), start=-100, end=100, fill=(55, 31, 22, 230), width=sc(8))
    draw.line([(sc(114), sc(256)), (sc(398), sc(256))], fill=(55, 31, 22, 230), width=sc(8))
    draw.line([(sc(256), sc(114)), (sc(256), sc(398))], fill=(55, 31, 22, 230), width=sc(8))


def draw_book_like(image, draw, cover=(52, 97, 170), pages=(236, 241, 245)) -> None:
    shadow(image, (150, 390, 362, 444), 17)
    draw.rounded_rectangle(box(150, 104, 356, 396), radius=sc(22), fill=cover + (255,), outline=(21, 42, 78, 240), width=sc(7))
    draw.polygon([(sc(184), sc(124)), (sc(354), sc(104)), (sc(354), sc(392)), (sc(184), sc(376))], fill=tuple(pages) + (230,))
    draw.line([(sc(184), sc(124)), (sc(184), sc(376))], fill=(19, 35, 64, 230), width=sc(7))
    for y in [170, 212, 254, 296]:
        draw.line([(sc(212), sc(y)), (sc(328), sc(y - 8))], fill=(93, 111, 133, 120), width=sc(3))


def draw_bottle(image, draw) -> None:
    shadow(image, (176, 410, 336, 452), 14)
    draw.rounded_rectangle(box(218, 82, 294, 154), radius=sc(20), fill=(15, 118, 110, 255))
    draw.rounded_rectangle(box(184, 138, 328, 410), radius=sc(44), fill=(69, 193, 207, 215), outline=(12, 96, 116, 240), width=sc(7))
    draw.rounded_rectangle(box(200, 206, 312, 302), radius=sc(22), fill=(222, 249, 250, 190))
    draw.rectangle(box(220, 88, 292, 110), fill=(233, 180, 65, 255))


def draw_laptop(image, draw) -> None:
    shadow(image, (98, 372, 414, 438), 17)
    draw.rounded_rectangle(box(120, 120, 392, 314), radius=sc(18), fill=(36, 48, 64, 255), outline=(126, 149, 176, 230), width=sc(7))
    draw.rounded_rectangle(box(142, 142, 370, 294), radius=sc(8), fill=(50, 167, 218, 255))
    draw.polygon([(sc(86), sc(338)), (sc(426), sc(338)), (sc(390), sc(392)), (sc(122), sc(392))], fill=(170, 184, 198, 255), outline=(75, 85, 99, 230))
    draw.rounded_rectangle(box(218, 350, 294, 366), radius=sc(8), fill=(115, 126, 140, 200))


def draw_monitor(image, draw) -> None:
    shadow(image, (118, 394, 394, 452), 16)
    draw.rounded_rectangle(box(94, 98, 418, 304), radius=sc(22), fill=(32, 43, 62, 255), outline=(130, 154, 184, 230), width=sc(8))
    draw.rounded_rectangle(box(124, 126, 388, 276), radius=sc(9), fill=(95, 205, 233, 255))
    draw.rectangle(box(232, 304, 280, 382), fill=(75, 85, 99, 255))
    draw.rounded_rectangle(box(178, 376, 334, 404), radius=sc(12), fill=(113, 128, 150, 255))


def draw_furniture(image, draw, kind="chair") -> None:
    shadow(image, (122, 404, 396, 454), 16)
    if kind == "desk":
        draw.rounded_rectangle(box(78, 196, 434, 256), radius=sc(16), fill=(136, 82, 43, 255), outline=(75, 44, 28, 240), width=sc(7))
        for x in [120, 382]:
            draw.rounded_rectangle(box(x, 250, x + 34, 410), radius=sc(8), fill=(94, 55, 34, 255))
    elif kind == "door":
        draw.rounded_rectangle(box(180, 64, 332, 432), radius=sc(10), fill=(151, 91, 47, 255), outline=(88, 52, 30, 255), width=sc(8))
        draw.rounded_rectangle(box(202, 88, 310, 412), radius=sc(6), outline=(200, 131, 72, 180), width=sc(5))
        draw.ellipse(box(286, 252, 306, 272), fill=(245, 190, 82, 255))
    elif kind == "whiteboard":
        draw.rounded_rectangle(box(76, 140, 436, 330), radius=sc(18), fill=(237, 247, 251, 255), outline=(85, 101, 122, 230), width=sc(9))
        draw.rectangle(box(98, 315, 414, 334), fill=(160, 174, 192, 255))
        draw.line([(sc(136), sc(194)), (sc(220), sc(194))], fill=(40, 134, 190, 210), width=sc(6))
    else:
        draw.rounded_rectangle(box(164, 118, 332, 224), radius=sc(18), fill=(88, 107, 132, 255))
        draw.rounded_rectangle(box(148, 228, 348, 278), radius=sc(16), fill=(116, 134, 158, 255))
        for x in [176, 316]:
            draw.line([(sc(x), sc(276)), (sc(x - 28), sc(414))], fill=(60, 72, 88, 255), width=sc(11))


def draw_vehicle(image, draw, kind="car") -> None:
    shadow(image, (78, 360, 434, 430), 18)
    if kind == "bicycle":
        for cx in [158, 354]:
            draw.ellipse(box(cx - 58, 292, cx + 58, 408), outline=(18, 25, 36, 255), width=sc(9))
        line(draw, [(158, 350), (238, 248), (282, 350), (158, 350), (354, 350), (238, 248), (354, 350)], (49, 123, 176, 255), 9)
        line(draw, [(238, 248), (238, 202), (272, 198)], (49, 123, 176, 255), 8)
    elif kind == "motorbike" or kind == "scooter":
        for cx in [152, 360]:
            draw.ellipse(box(cx - 45, 312, cx + 45, 402), fill=(20, 26, 36, 255))
            draw.ellipse(box(cx - 24, 333, cx + 24, 381), fill=(156, 163, 175, 255))
        draw.rounded_rectangle(box(140, 230, 330, 320), radius=sc(35), fill=(40, 151, 199, 255), outline=(13, 78, 112, 255), width=sc(7))
        line(draw, [(322, 236), (390, 188)], (40, 151, 199, 255), 9)
    else:
        body = (43, 132, 197, 255) if kind != "bus" else (235, 167, 50, 255)
        draw.rounded_rectangle(box(80, 218, 432, 330), radius=sc(36), fill=body, outline=(21, 44, 73, 230), width=sc(7))
        draw.polygon([(sc(156), sc(218)), (sc(218), sc(154)), (sc(322), sc(154)), (sc(378), sc(218))], fill=(95, 195, 228, 255), outline=(21, 44, 73, 220))
        for cx in [156, 356]:
            draw.ellipse(box(cx - 34, 306, cx + 34, 374), fill=(20, 26, 36, 255))
            draw.ellipse(box(cx - 16, 324, cx + 16, 356), fill=(214, 226, 238, 255))


def draw_animal(image, draw, kind="generic") -> None:
    shadow(image, (84, 390, 428, 452), 18)
    if kind == "giraffe":
        body = (218, 158, 75, 255)
        dark = (108, 67, 35, 245)
        draw.ellipse(box(118, 258, 320, 356), fill=body, outline=(95, 57, 30, 160), width=sc(4))
        draw.rounded_rectangle(box(278, 116, 324, 306), radius=sc(20), fill=body)
        draw.ellipse(box(292, 74, 394, 132), fill=body, outline=(95, 57, 30, 150), width=sc(4))
        draw.polygon([(sc(374), sc(96)), (sc(430), sc(112)), (sc(378), sc(126))], fill=body)
        for horn_x in [318, 356]:
            draw.line([(sc(horn_x), sc(82)), (sc(horn_x), sc(52))], fill=dark, width=sc(7))
            draw.ellipse(box(horn_x - 9, 44, horn_x + 9, 60), fill=dark)
        draw.polygon([(sc(288), sc(118)), (sc(264), sc(154)), (sc(310), sc(142))], fill=dark)
        for x, y, rx, ry in [(165, 284, 16, 13), (218, 306, 18, 15), (282, 282, 14, 16), (303, 180, 11, 17), (304, 226, 13, 18), (342, 106, 10, 8)]:
            draw.ellipse(box(x - rx, y - ry, x + rx, y + ry), fill=dark)
        for x in [150, 208, 274, 312]:
            draw.rounded_rectangle(box(x, 336, x + 20, 438), radius=sc(8), fill=(156, 96, 45, 255))
            draw.rectangle(box(x - 2, 424, x + 26, 440), fill=dark)
        draw.line([(sc(122), sc(298)), (sc(80), sc(250))], fill=dark, width=sc(7))
        draw.ellipse(box(416, 108, 430, 122), fill=(12, 18, 24, 255))
    elif kind == "elephant":
        draw.ellipse(box(88, 206, 346, 360), fill=(112, 124, 124, 255), outline=(58, 70, 74, 150), width=sc(4))
        draw.ellipse(box(282, 158, 426, 302), fill=(124, 137, 138, 255), outline=(58, 70, 74, 150), width=sc(4))
        draw.ellipse(box(258, 176, 344, 282), fill=(92, 104, 106, 210))
        line(draw, [(386, 254), (410, 320), (382, 388)], (112, 124, 124, 255), 24)
        for x in [158, 246, 326]:
            draw.line([(sc(x), sc(328)), (sc(x), sc(426))], fill=(85, 94, 96, 255), width=sc(19))
        draw.polygon([(sc(394), sc(252)), (sc(440), sc(236)), (sc(408), sc(282))], fill=(243, 231, 203, 255))
        draw.ellipse(box(382, 208, 398, 224), fill=(15, 23, 42, 255))
    elif kind == "rex":
        draw.ellipse(box(96, 218, 344, 342), fill=(82, 138, 54, 255), outline=(37, 84, 37, 160), width=sc(4))
        draw.ellipse(box(300, 150, 434, 242), fill=(96, 158, 62, 255), outline=(37, 84, 37, 160), width=sc(4))
        draw.polygon([(sc(424), sc(194)), (sc(466), sc(210)), (sc(424), sc(228))], fill=(72, 118, 49, 255))
        draw.polygon([(sc(118), sc(270)), (sc(30), sc(340)), (sc(148), sc(324))], fill=(72, 118, 49, 255))
        for x in [190, 288]:
            line(draw, [(x, 322), (x - 20, 420)], (57, 88, 40, 255), 14)
        draw.ellipse(box(386, 182, 400, 196), fill=(10, 16, 24, 255))
    elif kind == "whale":
        draw.ellipse(box(70, 190, 430, 334), fill=(42, 108, 180, 255))
        draw.polygon([(sc(420), sc(258)), (sc(490), sc(206)), (sc(466), sc(258)), (sc(490), sc(310))], fill=(38, 94, 160, 255))
        draw.polygon([(sc(216), sc(214)), (sc(266), sc(116)), (sc(286), sc(232))], fill=(34, 87, 150, 255))
        draw.ellipse(box(144, 218, 158, 232), fill=(5, 12, 24, 255))
    else:
        draw.ellipse(box(116, 220, 344, 344), fill=(122, 94, 57, 255))
        draw.ellipse(box(316, 176, 420, 270), fill=(133, 102, 61, 255))
        for x in [162, 242, 326]:
            draw.line([(sc(x), sc(320)), (sc(x), sc(426))], fill=(80, 60, 38, 255), width=sc(14))


def draw_human(image, draw) -> None:
    shadow(image, (180, 402, 332, 454), 15)
    draw.ellipse(box(220, 72, 292, 144), fill=(226, 185, 142, 255), outline=(111, 75, 50, 140), width=sc(3))
    draw.rounded_rectangle(box(196, 152, 316, 292), radius=sc(30), fill=(41, 128, 185, 255), outline=(15, 55, 95, 210), width=sc(5))
    draw.rounded_rectangle(box(174, 160, 210, 290), radius=sc(18), fill=(226, 185, 142, 255))
    draw.rounded_rectangle(box(302, 160, 338, 290), radius=sc(18), fill=(226, 185, 142, 255))
    draw.rounded_rectangle(box(204, 286, 248, 430), radius=sc(18), fill=(42, 52, 75, 255))
    draw.rounded_rectangle(box(264, 286, 308, 430), radius=sc(18), fill=(42, 52, 75, 255))
    draw.rounded_rectangle(box(190, 418, 254, 444), radius=sc(12), fill=(18, 24, 38, 255))
    draw.rounded_rectangle(box(258, 418, 322, 444), radius=sc(12), fill=(18, 24, 38, 255))


def draw_building(image, draw, kind="building") -> None:
    shadow(image, (86, 400, 426, 456), 18)
    if kind in {"tree", "plant"}:
        draw.rounded_rectangle(box(238, 250, 276, 430), radius=sc(18), fill=(114, 74, 38, 255))
        for cx, cy, r in [(212, 214, 72), (288, 204, 78), (254, 138, 82), (330, 258, 66)]:
            draw.ellipse(box(cx - r, cy - r, cx + r, cy + r), fill=(63, 140, 72, 238))
        return
    if kind == "wind":
        draw.polygon([(sc(244), sc(428)), (sc(268), sc(428)), (sc(260), sc(176)), (sc(252), sc(176))], fill=(220, 228, 236, 255))
        draw.ellipse(box(230, 150, 282, 202), fill=(235, 241, 245, 255))
        for ang in [0, 120, 240]:
            a = math.radians(ang)
            line(draw, [(256, 176), (256 + math.cos(a) * 138, 176 + math.sin(a) * 138)], (226, 234, 240, 255), 13)
        return
    color = (69, 148, 203, 255) if kind != "house" else (229, 145, 55, 255)
    draw.rounded_rectangle(box(128, 134, 384, 420), radius=sc(16), fill=color, outline=(31, 58, 93, 230), width=sc(7))
    if kind == "house":
        draw.polygon([(sc(106), sc(160)), (sc(256), sc(62)), (sc(406), sc(160))], fill=(171, 74, 52, 255))
    for row in range(4):
        for col in range(3):
            draw.rounded_rectangle(box(164 + col * 72, 178 + row * 54, 206 + col * 72, 212 + row * 54), radius=sc(4), fill=(236, 247, 250, 190))


def draw_small_object(image, draw, key: str) -> None:
    shadow(image, (160, 372, 352, 430), 13)
    if key in {"spoon", "fork", "toothbrush", "chalk-stick", "pencil", "cricket-bat"}:
        color = (220, 95, 72, 255) if key == "toothbrush" else (180, 119, 62, 255)
        line(draw, [(136, 310), (384, 190)], color, 22)
        if key == "spoon":
            draw.ellipse(box(340, 148, 428, 230), fill=(220, 226, 232, 255), outline=(95, 105, 118, 220), width=sc(5))
        elif key == "fork":
            for x in [352, 370, 388, 406]:
                line(draw, [(x, 148), (x - 30, 210)], (220, 226, 232, 255), 7)
        elif key == "toothbrush":
            draw.rounded_rectangle(box(344, 158, 432, 204), radius=sc(12), fill=(76, 190, 225, 255))
            for x in [354, 370, 386, 402]:
                line(draw, [(x, 156), (x, 118)], (245, 249, 252, 255), 5)
        else:
            draw.polygon([(sc(390), sc(176)), (sc(444), sc(156)), (sc(414), sc(206))], fill=(50, 35, 25, 255))
        return
    if key in {"calculator", "tablet"}:
        draw.rounded_rectangle(box(164, 100, 348, 408), radius=sc(26), fill=(44, 56, 75, 255), outline=(140, 153, 174, 230), width=sc(7))
        draw.rounded_rectangle(box(186, 132, 326, 200), radius=sc(12), fill=(93, 214, 232, 220))
        if key == "calculator":
            for row in range(4):
                for col in range(3):
                    draw.rounded_rectangle(box(196 + col * 44, 232 + row * 38, 226 + col * 44, 258 + row * 38), radius=sc(6), fill=(226, 232, 240, 220))
        return
    if key == "microscope":
        draw.rounded_rectangle(box(184, 354, 370, 406), radius=sc(14), fill=(55, 65, 81, 255))
        line(draw, [(252, 322), (324, 166)], (65, 80, 104, 255), 24)
        draw.rounded_rectangle(box(280, 126, 378, 174), radius=sc(14), fill=(86, 103, 128, 255))
        draw.ellipse(box(158, 244, 280, 366), outline=(54, 70, 96, 255), width=sc(16))
        return
    if key == "telescope":
        line(draw, [(92, 288), (416, 186)], (47, 96, 155, 255), 36)
        draw.rounded_rectangle(box(336, 146, 438, 194), radius=sc(18), fill=(183, 201, 220, 255))
        line(draw, [(256, 296), (204, 428)], (74, 85, 104, 255), 12)
        line(draw, [(256, 296), (328, 428)], (74, 85, 104, 255), 12)
        return
    if key in {"coffee-mug"}:
        draw.rounded_rectangle(box(160, 158, 322, 360), radius=sc(34), fill=(233, 239, 244, 255), outline=(95, 111, 130, 220), width=sc(7))
        draw.ellipse(box(288, 210, 394, 306), outline=(233, 239, 244, 255), width=sc(18))
        return
    if key in {"dice", "button", "marble", "peppercorn", "lentil", "mustard-seed", "chia-seed"}:
        color = (238, 238, 238) if key == "dice" else (194, 137, 69)
        radial_sphere(draw, 256, 256, 96, color)
        if key == "dice":
            for cx, cy in [(220, 220), (292, 220), (256, 256), (220, 292), (292, 292)]:
                draw.ellipse(box(cx - 9, cy - 9, cx + 9, cy + 9), fill=(20, 28, 40, 255))
        return
    draw.rounded_rectangle(box(160, 190, 352, 322), radius=sc(24), fill=(105, 137, 172, 255), outline=(48, 64, 86, 230), width=sc(7))
    draw.ellipse(box(186, 116, 326, 256), fill=(240, 244, 248, 155))


def choose_drawer(key: str) -> Callable[[Image.Image, ImageDraw.ImageDraw], None]:
    if key == "football":
        return draw_football
    if key == "basketball":
        return draw_basketball
    if key == "school-bag":
        return draw_school_bag
    if key in {"notebook", "textbook"}:
        return lambda image, draw: draw_book_like(image, draw, (44, 84, 157) if key == "notebook" else (137, 66, 72))
    if key == "water-bottle":
        return draw_bottle
    if key == "laptop":
        return draw_laptop
    if key == "monitor":
        return draw_monitor
    if key in {"chair", "desk", "door", "whiteboard"}:
        return lambda image, draw: draw_furniture(image, draw, key)
    if key in {"car", "minivan", "school-bus", "metro-train-car", "auto-rickshaw", "motorbike", "scooter", "bicycle"}:
        kind = "bus" if "bus" in key or "train" in key else ("bicycle" if key == "bicycle" else ("motorbike" if key in {"motorbike", "scooter"} else "car"))
        return lambda image, draw: draw_vehicle(image, draw, kind)
    if key == "human":
        return draw_human
    if key in {"giraffe", "elephant", "blue-whale", "tyrannosaurus-rex"}:
        kind = {"tyrannosaurus-rex": "rex", "blue-whale": "whale"}.get(key, key)
        return lambda image, draw: draw_animal(image, draw, kind)
    if any(word in key for word in ["tree", "plant", "mango", "coconut"]):
        return lambda image, draw: draw_building(image, draw, "tree")
    if "wind-turbine" in key:
        return lambda image, draw: draw_building(image, draw, "wind")
    if any(word in key for word in ["house", "building", "tower", "terminal", "stadium", "shelter"]):
        return lambda image, draw: draw_building(image, draw, "house")
    return lambda image, draw: draw_small_object(image, draw, key)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    keys = parse_asset_keys()
    for key in keys:
        save_asset(key, choose_drawer(key))
    print(f"Generated {len(keys)} scale-universe PNG sprites in {OUT}")


if __name__ == "__main__":
    main()
