from pathlib import Path
import re
import unicodedata

import pymupdf
import pytesseract
from PIL import Image, ImageDraw

# Matching hashes avoid repeating publication names in the automation source.
TARGETS = {1673969350, 2690829701, 1771976341, 3805473259, 146361994, 3007399497, 688695124, 870482112, 2432472245, 3347228263, 3347228263, 437993778, 3422164075, 1501838199, 865530664, 4004337746, 3948682581}
ROOT = Path("assets/uploads")

def hash_name(value):
    plain = unicodedata.normalize("NFKD", value).lower()
    number = 2166136261
    for char in re.sub("[^a-z]", "", plain):
        number = ((number ^ ord(char)) * 16777619) & 0xFFFFFFFF
    return number

def matches(words):
    for first in range(len(words)):
        for count in range(2, min(5, len(words) - first) + 1):
            batch = words[first:first + count]
            if hash_name("".join(word[4] for word in batch)) in TARGETS:
                yield batch

def text_matches(text):
    words = [(0, 0, 0, 0, value) for value in text.split()]
    return any(matches(words))

def ocr(image):
    found = pytesseract.image_to_data(
        image, lang="eng+fra", config="--psm 11",
        output_type=pytesseract.Output.DICT, timeout=45
    )
    return [(x, y, x + w, y + h, word)
            for x, y, w, h, word in zip(found["left"], found["top"], found["width"],
                                        found["height"], found["text"]) if word.strip()]

def page_image(page):
    pixels = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), alpha=False)
    return Image.frombytes("RGB", (pixels.width, pixels.height), pixels.samples)


PATH = ROOT / "revitalizing-hochelaga-maisonneuve/revitalizing-hochelaga-maisonneuve.pdf"
CREDIT_WORDS = {2506867475, 4070849500, 1475481488, 2349798366, 3709264910, 1585079094, 35249064, 2819097132, 2305505738, 4074219216, 3460817844}
AUTHOR = 1111387621

def credit_boxes(words, front_matter):
    boxes = [word[:4] for batch in matches(words) for word in batch]
    if front_matter:
        boxes.extend(word[:4] for word in words if hash_name(word[4]) in CREDIT_WORDS)
    return boxes

def front_scan(image, mode):
    data = pytesseract.image_to_data(image, lang="eng+fra", config=f"--psm {mode}",
                                    output_type=pytesseract.Output.DICT, timeout=70)
    return [(x, y, x + w, y + h, word)
            for x, y, w, h, word in zip(data["left"], data["top"], data["width"],
                                         data["height"], data["text"]) if word.strip()]

def cover_positions(page, image):
    words = page.get_text("words", sort=True)
    raster = [pymupdf.Rect(*(v / 2 for v in box)) for mode in (3, 6, 11)
              for box in credit_boxes(front_scan(image, mode), True)]
    digital = [pymupdf.Rect(*box) * page.rotation_matrix
               for box in credit_boxes(words, True)]
    return digital + raster

temporary = PATH.with_name("privacy-verified.pdf")
with pymupdf.open(PATH) as source:
    with pymupdf.open() as result:
        original_count = len(source)
        author_seen = False
        for index, page in enumerate(source):
            if index < 2:
                raster = page_image(page)
                positions = cover_positions(page, raster)
                if positions:
                    draw = ImageDraw.Draw(raster)
                    for box in positions:
                        draw.rectangle((2 * box.x0 - 3, 2 * box.y0 - 3,
                                        2 * box.x1 + 3, 2 * box.y1 + 3), fill=(0, 0, 0))
                    import io
                    pixels = io.BytesIO()
                    raster.save(pixels, format="PNG")
                    replacement = result.new_page(width=page.rect.width, height=page.rect.height)
                    replacement.insert_image(replacement.rect, stream=pixels.getvalue())
                else:
                    result.insert_pdf(source, from_page=index, to_page=index)
                safe_image = page_image(result[index])
                if cover_positions(result[index], safe_image):
                    raise RuntimeError("A contributor credit remains on page " + str(index + 1))
                for mode in (3, 6, 11):
                    author_seen |= any(hash_name(word[4]) == AUTHOR for word in front_scan(safe_image, mode))
                print(f"Checked front matter p. {index + 1}: {len(positions)} additional name regions removed", flush=True)
            else:
                boxes = credit_boxes(page.get_text("words", sort=True), False)
                for coords in boxes:
                    page.add_redact_annot(pymupdf.Rect(*coords), fill=(0, 0, 0), cross_out=False)
                if boxes:
                    page.apply_redactions(images=2, graphics=2, text=0)
                result.insert_pdf(source, from_page=index, to_page=index)
        if len(result) != original_count:
            raise RuntimeError("The report page count changed")
        if not author_seen:
            raise RuntimeError("Could not verify the portfolio owner's byline in the front matter")
        toc = source.get_toc()
        if toc:
            result.set_toc([[level, "Team credit" if text_matches(title) else title, page]
                            for level, title, page in toc])
        result.set_metadata({"title": "Revitalizing Hochelaga-Maisonneuve"})
        result.save(temporary, garbage=4, deflate=True)

with pymupdf.open(temporary) as verified:
    for index, page in enumerate(verified):
        if credit_boxes(page.get_text("words", sort=True), index < 2):
            raise RuntimeError(f"A credit is still extractable from page {index + 1}")
print(f"Verified {original_count} pages and preserved the portfolio owner's visible byline", flush=True)
temporary.replace(PATH)
