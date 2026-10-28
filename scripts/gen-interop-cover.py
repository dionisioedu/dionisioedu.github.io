#!/usr/bin/env python3
"""Generate the cover for the C# / C++ interoperability article (1200x630).

House style of dionisio.dev (see scripts/gen-career-covers.py) but the middle
band is a *boundary* diagram instead of a flow: two stacked runtimes with a
thin interop seam between them, and a resource ownership split that is the
whole point of the article.

Output: public/assets/images/csharp-cpp-interop.png
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630

BG = (15, 23, 42)          # #0F172A
GRID = (30, 41, 59)        # #1E293B
TEAL = (45, 212, 191)      # #2DD4BF
LAVENDER = (197, 134, 192) # #C586C0
TEXT = (226, 232, 240)     # #E2E8F0
MUTED = (148, 163, 184)    # #94A3B8
DIM = (100, 116, 139)      # #64748B

MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
MONO_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"


def f(path, size):
    return ImageFont.truetype(path, size)


def draw_grid(d):
    for x in range(0, W, 40):
        d.line([(x, 0), (x, H)], fill=GRID, width=1)
    for y in range(0, H, 40):
        d.line([(0, y), (W, y)], fill=GRID, width=1)


def box(d, xy, color, fill=None, width=2):
    x0, y0, x1, y1 = xy
    d.rectangle([x0, y0, x1, y1], outline=color, fill=fill, width=width)


def make(out):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    draw_grid(d)

    d.rectangle([0, 0, W, 8], fill=TEAL)

    # header
    d.text((60, 40), "DIONISIO.DEV / INTEROP", font=f(MONO, 21), fill=MUTED)
    d.line([(60, 78), (W - 60, 78)], fill=GRID, width=2)

    # headline — one word per line, size to fit 1080px
    lines = ["C# + C++", "ONE PROCESS."]
    fh = f(MONO_BOLD, 62)
    y = 106
    for i, line in enumerate(lines):
        d.text((60, y), line, font=fh, fill=TEXT if i == 0 else TEAL)
        y += 78

    d.text((60, y + 2), "Two runtimes. One object lifetime contract.",
           font=f(MONO, 22), fill=MUTED)

    # ---------------- boundary diagram ----------------
    dx0, dx1 = 60, W - 60
    top_y, top_h = 306, 96
    seam_h = 46
    bot_y = top_y + top_h + seam_h
    bot_h = 134

    # managed runtime
    box(d, (dx0, top_y, dx1, top_y + top_h), TEAL, fill=(20, 39, 48))
    d.text((dx0 + 22, top_y + 16), "C# / .NET  ·  CLR", font=f(MONO_BOLD, 26), fill=TEAL)
    d.text((dx0 + 22, top_y + 54), "Garbage Collector owns the object graph",
           font=f(MONO, 19), fill=MUTED)
    # small gc tag right-aligned
    gcw = d.textlength("managed heap", font=f(MONO, 17))
    d.text((dx1 - 22 - gcw, top_y + 22), "managed heap", font=f(MONO, 17), fill=DIM)

    # seam — C++/CLI
    seam_mid = top_y + top_h + seam_h // 2
    d.line([(dx0 + 26, top_y + top_h), (dx0 + 26, bot_y)], fill=LAVENDER, width=2)
    d.line([(dx1 - 26, top_y + top_h), (dx1 - 26, bot_y)], fill=LAVENDER, width=2)
    seam_label = "C++/CLI BRIDGE  ·  ^ handle  ·  !finalizer"
    sw = d.textlength(seam_label, font=f(MONO_BOLD, 19))
    d.rectangle([(W - sw) // 2 - 16, seam_mid - 15, (W + sw) // 2 + 16, seam_mid + 15],
                fill=BG, outline=LAVENDER, width=2)
    d.text(((W - sw) // 2, seam_mid - 11), seam_label, font=f(MONO_BOLD, 19), fill=LAVENDER)

    # arrows crossing the seam
    for ax in (dx0 + 26 + 120, dx1 - 26 - 120):
        d.line([(ax, top_y + top_h + 4), (ax, bot_y - 4)], fill=LAVENDER, width=2)
        d.polygon([(ax, bot_y - 4), (ax - 5, bot_y - 12), (ax + 5, bot_y - 12)], fill=LAVENDER)
        d.polygon([(ax, top_y + top_h + 4), (ax - 5, top_y + top_h + 12),
                   (ax + 5, top_y + top_h + 12)], fill=LAVENDER)

    # native runtime
    box(d, (dx0, bot_y, dx1, bot_y + bot_h), LAVENDER, fill=(34, 26, 38))
    d.text((dx0 + 22, bot_y + 16), "C++  ·  NATIVE", font=f(MONO_BOLD, 26), fill=LAVENDER)
    d.text((dx0 + 22, bot_y + 54), "RAII owns it. You decide when it dies.",
           font=f(MONO, 19), fill=MUTED)

    # leak / lifetime tags inside the native panel
    tags = [("new NativeEngine()", TEAL), ("~EngineBridge()", LAVENDER),
            ("delete engine", MUTED)]
    tx = dx0 + 22
    ty = bot_y + bot_h - 38
    for label, col in tags:
        tw = d.textlength(label, font=f(MONO, 16))
        d.rectangle([tx, ty - 4, tx + tw + 18, ty + 22], outline=col, width=1)
        d.text((tx + 9, ty), label, font=f(MONO, 16), fill=col)
        tx += tw + 30

    # ---------------- footer ----------------
    footer = "CLR  .  C++/CLI  .  P/Invoke  .  marshaling  .  IDisposable  .  finalizer"
    d.line([(60, H - 52), (W - 60, H - 52)], fill=GRID, width=2)
    d.text((60, H - 40), footer, font=f(MONO, 18), fill=MUTED)

    img.save(out)
    print("wrote", out, img.size)


if __name__ == "__main__":
    import sys
    from pathlib import Path
    root = Path(__file__).resolve().parent.parent
    target = sys.argv[1] if len(sys.argv) > 1 else root / "public/assets/images/csharp-cpp-interop.png"
    make(str(target))
