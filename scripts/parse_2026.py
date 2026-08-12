#!/usr/bin/env python3
"""Parse official GATE 2026 CS-1 and CS-2 question papers + answer keys.

Inputs (in scripts/cache/):
  CS1.pdf, CS2.pdf                 - master question papers
  CS1_Keys.pdf, CS2_Keys.pdf       - official answer keys

Output:
  scripts/cache/2026_parsed.json
"""
import json
import os
import re

import fitz

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "cache")

# Decorative images that appear on every page (GATE logo + watermark).
DECORATIVE_XREFS = {}


def collect_decorative_xrefs(doc):
    """Images whose size is constant across many pages are decorations."""
    from collections import Counter

    xref_sizes = Counter()
    for page in doc:
        for img in page.get_images(full=True):
            xref = img[0]
            w, h = img[2], img[3]
            xref_sizes[(xref, w, h)] += 1
    return {xref for (xref, w, h), count in xref_sizes.items() if count >= len(doc) / 2}


def reconstruct_page_lines(page):
    """Return cleaned text lines, with stacked fractions merged into a/b.

    GATE papers typeset fractions by stacking the numerator above the
    denominator. In the PDF this produces two adjacent text lines whose
    bounding boxes overlap vertically (negative gap) with overlapping
    x-ranges -- distinct from normal paragraphs or table grids.
    """
    raw = []
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            text = "".join(s["text"] for s in line["spans"])
            x0, y0, x1, y1 = line["bbox"]
            raw.append([x0, y0, x1, y1, text])
    raw.sort(key=lambda r: (r[1], r[0]))
    out = []
    i = 0
    while i < len(raw):
        x0a, y0a, x1a, y1a, ta = raw[i]
        if i + 1 < len(raw):
            x0b, y0b, x1b, y1b, tb = raw[i + 1]
            gap = y0b - y1a
            ox = max(0.0, min(x1a, x1b) - max(x0a, x0b))
            ta_s, tb_s = ta.strip(), tb.strip()
            short = (
                ta_s
                and tb_s
                and " " not in ta_s
                and " " not in tb_s
                and len(ta_s) <= 5
                and len(tb_s) <= 5
            )
            if short and gap < 3.0 and ox >= 3.0:
                out.append(f"{ta_s}/{tb_s}")
                i += 2
                continue
        out.append(ta)
        i += 1
    return clean_page_text("\n".join(out))


def clean_page_text(text):
    """Remove page furniture lines (footer / header / watermarks)."""
    lines = []
    for line in text.splitlines():
        s = line.strip()
        if not s:
            lines.append("")
            continue
        if s.startswith("Organizing Institute:"):
            continue
        if re.match(r"^Page \d+ of \d+$", s):
            continue
        if re.match(r"^Computer Science & Information Technology \(CS[12]\)$", s):
            continue
        lines.append(s)
    return lines


def extract_questions(lines):
    """Split cleaned lines into question blocks keyed by number."""
    blocks = []  # list of (qno, [lines])
    current = None
    header = None
    for line in lines:
        m = re.match(r"^Q\.\s*(\d+)\s*$", line)
        if m:
            if current is None or current[1]:
                if current is not None:
                    blocks.append(current)
                current = (int(m.group(1)), [])
                header = False
            continue
        # Section / marks-group headers
        if re.match(r"^(General Aptitude \(GA\)|Computer Science & Information Technology)", line):
            if current is not None and current[1]:
                blocks.append(current)
            current = None
            continue
        if re.match(r"^Q\.\s*\d+\s*[–-]\s*Q\.?\s*\d+\s*Carry", line):
            if current is not None and current[1]:
                blocks.append(current)
            current = None
            continue
        if line.startswith("Q.") and "Carry" in line:
            if current is not None and current[1]:
                blocks.append(current)
            current = None
            continue
        if current is not None:
            current[1].append(line)
    if current is not None and current[1]:
        blocks.append(current)
    return blocks


def split_question_text(lines):
    """Split a question's lines into (text_lines, options list of (label, lines))."""
    opt_re = re.compile(r"^\(([A-E])\)\s*(.*)$")
    text = []
    options = []
    cur_label = None
    cur_opt = []
    for line in lines:
        m = opt_re.match(line)
        if m:
            if cur_label is not None:
                options.append((cur_label, cur_opt))
            cur_label = m.group(1)
            cur_opt = []
            if m.group(2).strip():
                cur_opt.append(m.group(2).strip())
            continue
        if cur_label is not None:
            cur_opt.append(line.strip())
        else:
            text.append(line.strip())
    if cur_label is not None:
        options.append((cur_label, cur_opt))
    return text, options


def parse_answer_key(path):
    """Parse the answer key text table into {qno: row}.

    The key PDF renders as a table whose cells are extracted one token per
    line in row-major order: qno, session, type, section, key/range, marks.
    """
    doc = fitz.open(path)
    tokens = []
    for page in doc:
        for line in page.get_text().splitlines():
            s = line.strip()
            if not s:
                continue
            tokens.append(s)
    SKIP = {
        "Q. No.", "Session", "Question Type", "Section", "Key/Range",
        "Marks",
    }
    data = [t for t in tokens if t not in SKIP and not re.match(r"^Page \d+ of \d+$", t)
            and not t.startswith("Answer Key for")]
    if len(data) % 6 != 0:
        print(f"  WARN {path}: {len(data)} tokens not divisible by 6")
    rows = {}
    for i in range(0, len(data) - len(data) % 6, 6):
        qno_s, session, qtype, section, answer, marks = data[i : i + 6]
        qno = int(qno_s)
        rows[qno] = {
            "qno": qno,
            "type": qtype,
            "section": section,
            "answer": answer,
            "marks": int(marks),
        }
    return rows


def extract_images(doc, paper):
    """Extract question diagram images per page, mapped to nearest question."""
    out = {}
    # Determine page -> set of questions appearing on it (by scanning page text)
    for pno, page in enumerate(doc):
        text = clean_page_text(page.get_text())
        qnos = [int(m.group(1)) for m in re.finditer(r"^Q\.\s*(\d+)\s*$", "\n".join(text), re.M)]
        if not qnos:
            continue
        # fallback: scan raw text
        if not qnos:
            qnos = [int(m.group(1)) for m in re.finditer(r"Q\.\s*(\d+)", page.get_text())]
        target_qno = qnos[-1]
        for img in page.get_images(full=True):
            xref = img[0]
            if xref in DECORATIVE_XREFS:
                continue
            rects = page.get_image_rects(xref)
            for r in rects:
                if r.width < 40 or r.height < 30:
                    continue
                pix = fitz.Pixmap(doc, xref)
                if pix.n - pix.alpha >= 4:
                    pix = fitz.Pixmap(fitz.csRGB, pix)
                fname = f"{paper}-q{target_qno}-{xref}.png"
                out.setdefault(target_qno, []).append(fname)
                p = os.path.join(HERE, "..", "public", "images", "2026", fname)
                os.makedirs(os.path.dirname(p), exist_ok=True)
                pix.save(p)
    return out


def main():
    for paper in ["CS1", "CS2"]:
        qp = fitz.open(os.path.join(CACHE, f"{paper}.pdf"))
        global DECORATIVE_XREFS
        DECORATIVE_XREFS = collect_decorative_xrefs(qp)
        keys = parse_answer_key(os.path.join(CACHE, f"{paper}_Keys.pdf"))

        all_lines = []
        for page in qp:
            all_lines.extend(reconstruct_page_lines(page))
            all_lines.append("")  # page break

        blocks = extract_questions(all_lines)
        images = extract_images(qp, paper)

        parsed = []
        for qno, lines in blocks:
            if qno not in keys:
                continue
            text_lines, options = split_question_text(lines)
            key = keys[qno]
            parsed.append({
                "year": 2026,
                "set": paper[2],  # '1' or '2'
                "number": qno,
                "section": key["section"],
                "type": key["type"].lower(),  # mcq / msq / nat
                "marks": key["marks"],
                "answer": key["answer"],
                "text": "\n".join(x for x in text_lines if x).strip(),
                "options": ["\n".join(x for x in o if x).strip() for _, o in options],
                "optionLabels": [lbl for lbl, _ in options],
                "images": images.get(qno, []),
            })
        paper_parsed = sorted(parsed, key=lambda q: q["number"])
        print(f"{paper}: parsed {len(paper_parsed)} questions, keys={len(keys)}")
        for q in paper_parsed:
            if not q["text"]:
                print("  WARN empty text for", q["number"])
        with open(os.path.join(CACHE, f"2026_{paper}.json"), "w") as f:
            json.dump(paper_parsed, f, indent=1)


if __name__ == "__main__":
    main()
