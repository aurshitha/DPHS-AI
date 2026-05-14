import fitz
import pytesseract
from PIL import Image
import re

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def clean_text(text):
    text = re.sub(r'[\x00-\x1F]+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


# ✅ KEEP FILTER but VERY LIGHT (not destructive)
def is_noise(text):
    # Only remove extreme junk
    if len(text.strip()) < 20:
        return True
    return False


def extract_ocr(page):
    pix = page.get_pixmap(dpi=300)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    return pytesseract.image_to_string(img, config='--oem 3 --psm 6')


# ✅ NEW: line-based chunking (works for medical reports)
def split_text(text, max_len=120):
    lines = text.split("\n")
    chunks = []
    buffer = ""

    for line in lines:
        line = line.strip()
        if not line:
            continue

        buffer += " " + line

        if len(buffer) > max_len:
            chunks.append(buffer.strip())
            buffer = ""

    if buffer:
        chunks.append(buffer.strip())

    return chunks


def extract_structured_rows(text):
    rows = []
    for line in text.split("\n"):
        match = re.search(r'([A-Za-z\s\-/]+?)\s+([<>]?\d+\.?\d*)\s*([a-zA-Z/%]*)', line)
        if match:
            rows.append({
                "test": match.group(1).strip(),
                "value": match.group(2),
                "unit": match.group(3)
            })
    return rows


def process_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    all_chunks = []

    print(f"📄 Total pages: {len(doc)}")

    for i, page in enumerate(doc):
        text = page.get_text()

        # ✅ KEEP OCR but not destructive
        ocr_text = extract_ocr(page)
        if len(ocr_text.strip()) > 30:
            text += "\n" + ocr_text

        text = clean_text(text)

        print(f"🔎 Page {i+1} sample:", text[:120])

        # ✅ PAGE-LEVEL CHUNKING (critical fix)
        chunks = split_text(text)

        for ch in chunks:
            if is_noise(ch):
                continue

            structured = extract_structured_rows(ch)

            all_chunks.append({
                "page": i + 1,
                "section": f"Page {i+1}",  # ✅ stable section
                "text": ch,
                "structured_data": structured
            })

        print(f"✅ Page {i+1} done | chunks: {len(chunks)}")

    # ✅ fallback (rare now)
    if not all_chunks:
        print("⚠️ No chunks — forcing fallback")

        all_chunks.append({
            "page": 1,
            "section": "RAW",
            "text": text[:2000],
            "structured_data": []
        })

    print(f"📊 Total chunks: {len(all_chunks)}")
    return all_chunks