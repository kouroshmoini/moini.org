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

def redact_pdf(path):
    with pymupdf.open(path) as document:
        if document.needs_pass:
            raise RuntimeError("Encrypted report")
        touched = []
        for index, page in enumerate(document):
            rectangles = []
            for batch in matches(page.get_text("words", sort=True)):
                rectangles.extend(pymupdf.Rect(*word[:4]) for word in batch)
            for batch in matches(ocr(page_image(page))):
                for x0, y0, x1, y1, _ in batch:
                    rect = pymupdf.Rect(x0 / 2, y0 / 2, x1 / 2, y1 / 2)
                    rectangles.append(rect * page.derotation_matrix)
            if rectangles:
                for rect in rectangles:
                    page.add_redact_annot(
                        pymupdf.Rect(rect.x0 - .6, rect.y0 - .6, rect.x1 + .6, rect.y1 + .6),
                        fill=(0, 0, 0), cross_out=False
                    )
                page.apply_redactions(images=2, graphics=2, text=0)
                touched.append(index)
        if not touched:
            raise RuntimeError("Expected names were not found in " + path.name)
        document.set_metadata({"title": document.metadata.get("title", "") if
                               not text_matches(document.metadata.get("title", "")) else ""})
        document.del_xml_metadata()
        for entry in document.get_toc():
            if text_matches(entry[1]):
                entry[1] = "Redacted credit"
        toc = document.get_toc()
        if any(text_matches(entry[1]) for entry in toc):
            document.set_toc([[level, "Redacted credit" if text_matches(title) else title, page]
                              for level, title, page in toc])
        updated = path.with_name(path.stem + ".redacted.pdf")
        document.save(updated, garbage=4, deflate=True)
    with pymupdf.open(updated) as checked:
        for page in checked:
            if any(matches(page.get_text("words", sort=True))):
                raise RuntimeError("A matched name is still extractable: " + path.name)
        for idx in touched:
            if any(matches(ocr(page_image(checked[idx])))):
                raise RuntimeError("A matched name is still visible: " + path.name)
    updated.replace(path)
    print(f"Verified PDF: {path.name}; pages redacted: {', '.join(str(x + 1) for x in touched)}", flush=True)

def redact_raster(path):
    with Image.open(path) as original:
        image = original.convert("RGB")
        boxes = [word[:4] for batch in matches(ocr(image)) for word in batch]
        if not boxes:
            print("Scanned image: " + path.name, flush=True)
            return
        draw = ImageDraw.Draw(image)
        for x0, y0, x1, y1 in boxes:
            draw.rectangle((x0 - 2, y0 - 2, x1 + 2, y1 + 2), fill=(0, 0, 0))
        if any(matches(ocr(image))):
            raise RuntimeError("A matched name is still visible: " + path.name)
        # Save new pixels without copying original metadata or thumbnails.
        image.save(path, quality=96)
        print("Verified redacted image: " + path.name, flush=True)

for path in sorted(ROOT.rglob("*")):
    extension = path.suffix.lower()
    if extension == ".pdf":
        redact_pdf(path)
    elif extension in {".png", ".jpg", ".jpeg"}:
        redact_raster(path)
