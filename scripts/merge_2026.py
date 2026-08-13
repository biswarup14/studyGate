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
from subtopic_map import subtopic_from_keywords

# Curated (subject, subtopic) for questions keyword rules cannot classify
# reliably (math-heavy texts, or subject only visible in the options).
SUBJECT_OVERRIDES = {
    "2026-cs1-3": ("Discrete Mathematics", "Combinatorics"),
    "2026-cs1-12": ("Discrete Mathematics", "Combinatorics"),
    "2026-cs1-22": ("Digital Logic", "Number Systems & Representation"),
    "2026-cs1-27": ("Programming in C", "Strings"),
    "2026-cs1-28": ("Compiler Design", "Parsing"),
    "2026-cs1-36": ("Digital Logic", "Number Systems & Representation"),
    "2026-cs1-46": ("Engineering Mathematics", "Calculus"),
    "2026-cs2-27": ("Engineering Mathematics", "Calculus"),
    "2026-cs2-28": ("Digital Logic", "Number Systems & Representation"),
    "2026-cs2-34": ("Digital Logic", "Number Systems & Representation"),
    "2026-cs2-43": ("Computer Networks", "Data Link Layer"),
}


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
        subtopic = subtopic_from_keywords(subject, q.get("text", ""))

        qid = f"2026-{paper.lower()}-{qno}"
        if qid in SUBJECT_OVERRIDES:
            subject, subtopic = SUBJECT_OVERRIDES[qid]

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
            "id": qid,
            "year": 2026,
            "set": q.get("set", paper[2]),
            "number": qno,
            "section": q.get("section", "CS"),
            "type": qtype,
            "subject": subject,
            "subtopic": subtopic,
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

    rebuild_index()


def rebuild_index():
    """Regenerate index.json from all data/questions-YYYY.json files."""
    from collections import Counter

    subjects = Counter()
    subtopics = Counter()
    types = Counter()
    years = {}
    total = 0
    for year in range(2000, 2027):
        path = os.path.join(DATA, f"questions-{year}.json")
        if not os.path.exists(path):
            continue
        items = json.load(open(path))
        years[year] = len(items)
        total += len(items)
        for it in items:
            subjects[it["subject"]] += 1
            types[it["type"]] += 1
            if it["subtopic"]:
                subtopics[(it["subject"], it["subtopic"])] += 1

    subtopic_groups = {}
    for (subj, sub), v in subtopics.most_common():
        subtopic_groups.setdefault(subj, []).append({"name": sub, "count": v})

    index = {
        "total": total,
        "years": years,
        "subjects": [{"name": k, "count": v} for k, v in subjects.most_common()],
        "subtopics": subtopic_groups,
        "types": dict(types),
        "updatedAt": "2026-08-13",
    }
    with open(os.path.join(DATA, "index.json"), "w") as f:
        json.dump(index, f, ensure_ascii=False, indent=1)
    print(f"index rebuilt: total={index['total']}")


if __name__ == "__main__":
    main()
