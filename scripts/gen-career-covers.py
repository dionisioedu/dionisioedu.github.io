#!/usr/bin/env python3
"""Generate blog cover images (1200x630) matching the dionisio.dev visual identity.

Identity: deep charcoal bg, subtle grid, monospaced type, teal accent,
top bar, "DIONISIO.DEV / <tag>" header, headline, optional flow diagram,
and a footer keyword row separated by dots.
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630

BG = (15, 23, 42)          # #0F172A deep charcoal/navy
GRID = (30, 41, 59)        # #1E293B
TEAL = (45, 212, 191)      # #2DD4BF accent
LAVENDER = (197, 134, 192) # #C586C0 secondary accent
TEXT = (226, 232, 240)     # #E2E8F0
MUTED = (148, 163, 184)    # #94A3B8

MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
MONO_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def draw_grid(d):
    step = 40
    for x in range(0, W, step):
        d.line([(x, 0), (x, H)], fill=GRID, width=1)
    for y in range(0, H, step):
        d.line([(0, y), (W, y)], fill=GRID, width=1)


def make_cover(tag, headline_lines, sub, boxes, footer, out, accent=TEAL):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    draw_grid(d)

    # top accent bar
    d.rectangle([0, 0, W, 8], fill=accent)

    # header
    d.text((60, 44), f"DIONISIO.DEV / {tag}", font=font(MONO, 22), fill=MUTED)
    d.line([(60, 84), (W - 60, 84)], fill=GRID, width=2)

    # headline
    y = 140
    fh = font(MONO_BOLD, 58)
    for i, line in enumerate(headline_lines):
        color = TEXT if i == 0 else accent
        d.text((60, y), line, font=fh, fill=color)
        y += 74

    # subheadline
    d.text((60, y + 10), sub, font=font(MONO, 24), fill=MUTED)

    # flow diagram boxes
    y = y + 90
    box_w, box_h = 300, 84
    gap = 30
    total = len(boxes) * box_w + (len(boxes) - 1) * gap
    x = (W - total) // 2
    for i, label in enumerate(boxes):
        # accent the first and last, lavender the middle
        if i == 0 or i == len(boxes) - 1:
            border = accent
        else:
            border = LAVENDER
        d.rounded_rectangle([x, y, x + box_w, y + box_h], radius=4,
                            outline=border, width=2, fill=(20, 30, 50))
        tw = d.textlength(label, font=font(MONO_BOLD, 22))
        d.text((x + (box_w - tw) / 2, y + box_h / 2 - 14), label,
               font=font(MONO_BOLD, 22), fill=TEXT)
        if i < len(boxes) - 1:
            ax = x + box_w
            d.line([(ax + 6, y + box_h / 2), (ax + gap - 6, y + box_h / 2)],
                   fill=MUTED, width=2)
            d.polygon([(ax + gap - 6, y + box_h / 2 - 6),
                       (ax + gap - 6, y + box_h / 2 + 6),
                       (ax + gap, y + box_h / 2)], fill=MUTED)
        x += box_w + gap

    # footer keywords
    d.text((60, H - 76), footer, font=font(MONO, 22), fill=MUTED)

    img.save(out, "WEBP", quality=88, method=6)
    print("wrote", out, img.size)


if __name__ == "__main__":
    import os
    base = "/home/eduardo/projects/dionisioedu.github.io/public/assets/images"
    os.makedirs(base, exist_ok=True)

    make_cover(
        tag="CARREIRA / ESTUDO",
        headline_lines=["Estudo há meses", "e não saio do lugar."],
        sub="O problema não é falta de esforço.",
        boxes=["Curso passivo", "Sem projeto real", "Direção"],
        footer="CARREIRA . ESTUDO . PROJETO . MENTORIA . FOCO",
        out=f"{base}/carreira-estudo.webp",
    )

    make_cover(
        tag="CARREIRA / CURRÍCULO",
        headline_lines=["Seu currículo não", "passa da triagem."],
        sub="E não é por falta de experiência.",
        boxes=["30 segundos", "Evidência", "Entrevista"],
        footer="CARREIRA . CURRÍCULO . POSICIONAMENTO . ATS . MERCADO",
        out=f"{base}/carreira-curriculo.webp",
    )

    make_cover(
        tag="CARREIRA / SENIORIDADE",
        headline_lines=["Não sei se estou", "pronto para sênior."],
        sub="A resposta honesta sobre o gap.",
        boxes=["Pleno", "Decisão sob risco", "Sênior"],
        footer="CARREIRA . SENIORIDADE . DECISÃO . SISTEMAS . MERCADO",
        out=f"{base}/carreira-senioridade.webp",
    )
