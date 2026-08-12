#!/usr/bin/env python3
"""Merge 2026 parsed data into the app schema and write questions-2026.json.

Inputs:  scripts/cache/2026_CS1.json, scripts/cache/2026_CS2.json
Output:  data/questions-2026.json, updates data/index.json
"""
import json
import os
import sys
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DATA = os.path.join(ROOT, "data")
CACHE = os.path.join(HERE, "cache")
IMG_DIR = os.path.join(ROOT, "public", "images", "2026")

sys.path.insert(0, HERE)
from subject_map import subject_from_keywords


def build_answer_map(key_pdf_path):
    """Parse key PDF into {qno: {answer, type, marks}}."""
    import fitz
    doc = fitz.open(key_pdf_path)
    tokens = []
    for page in doc:
        for line in page.get_text().splitlines():
            s = line.strip()
            if not s:
                continue
            tokens.append(s)
    SKIP = {"Q. No.", "Session", "Question Type", "Section", "Key/Range", "Marks"}
    data = [t for t in tokens if t not in SKIP and not re.match(r"^Page \d+ of \d+$", t)
            and not t.startswith("Answer Key for")]
    rows = {}
    for i in range(0, len(data) - len(data) % 6, 6):
        qno_s, _, qtype, section, answer, marks = data[i:i + 6]
        qno = int(qno_s)
        rows[qno] = {"answer": answer, "type": qtype.lower(), "marks": int(marks)}
    return rows


def merge(paper, key_path, parsed_path):
    keys = build_answer_map(key_path)
    with open(parsed_path) as f:
        questions = json.load(f)

    result = []
    for q in questions:
        qno = q["number"]
        key = keys.get(qno, {})
        qtype = key.get("type", q.get("type", "mcq"))
        marks = key.get("marks", q.get("marks", 1))
        answer = key.get("answer", q.get("answer"))

        subject = subject_from_keywords(q.get("text", ""))

        correct_answer = None
        if qtype == "mcq":
            correct_answer = [answer] if answer and len(answer) <= 2 else None
        elif qtype == "msq":
            correct_answer = answer.split(";") if answer and ";" in answer else ([answer] if answer else None)
        else:  # nat
            correct_answer = [answer] if answer else None

        options = q.get("options", [])
        option_labels = q.get("optionLabels", [])

        images = [{"src": f"/images/2026/{img}", "kind": "local"} for img in q.get("images", [])]

        item = {
            "id": f"2026-{paper.lower()}-{qno}",
            "year": 2026,
            "set": q.get("set", paper[2]),
            "number": qno,
            "section": q.get("section", "CS"),
            "type": qtype,
            "subject": subject,
            "difficulty": "medium",
            "marks": marks,
            "text": q.get("text", ""),
            "options": options,
            "correctAnswer": correct_answer,
            "explanation": None,
            "images": images,
            "sourceUrl": f"https://gateoverflow.in/tag/gatecse-2026",
            "source": "official2026",
        }
        result.append(item)
    return result


def main():
    os.makedirs(DATA, exist_ok=True)

    cs1 = merge("CS1",
                os.path.join(CACHE, "CS1_Keys.pdf"),
                os.path.join(CACHE, "2026_CS1.json"))
    cs2 = merge("CS2",
                os.path.join(CACHE, "CS2_Keys.pdf"),
                os.path.join(CACHE, "2026_CS2.json"))

    all_2026 = sorted(cs1 + cs2, key=lambda q: q["number"])
    with open(os.path.join(DATA, "questions-2026.json"), "w") as f:
        json.dump(all_2026, f, ensure_ascii=False, indent=1)
    print(f"questions-2026.json: {len(all_2026)} questions")

    # Update index.json
    with open(os.path.join(DATA, "index.json")) as f:
        index = json.load(f)
    index["years"]["2026"] = len(all_2026)
    index["total"] += len(all_2026)
    for q in all_2026:
        existing = next((s for s in index["subjects"] if s["name"] == q["subject"]), None)
        if existing:
            existing["count"] += 1
        else:
            index["subjects"].append({"name": q["subject"], "count": 1})
        index["types"][q["type"]] = index["types"].get(q["type"], 0) + 1
    index["subjects"].sort(key=lambda s: s["count"], reverse=True)
    with open(os.path.join(DATA, "index.json"), "w") as f:
        json.dump(index, f, ensure_ascii=False, indent=1)
    print(f"index updated: total={index['total']}")


if __name__ == "__main__":
    main()
