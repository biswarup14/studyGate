#!/usr/bin/env python3
"""Normalize legacy GATEOverflow dataset (2000-2025) into clean per-year JSON.

Input:  scripts/cache/gate_legacy.json
Output: data/questions-YYYY.json + data/index.json + public/images/legacy/
"""
import json
import os
import re
from concurrent.futures import ThreadPoolExecutor

from bs4 import BeautifulSoup

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CACHE = os.path.join(HERE, "cache")
DATA = os.path.join(ROOT, "data")
IMG_DIR = os.path.join(ROOT, "public", "images", "legacy")

from subject_map import subject_from_tags as _subject_from_tags, subject_from_keywords
from subtopic_map import subtopic_for

YEAR_TAG = re.compile(r"^gatecse(?:-(\d{4})|-set\d|-(\d{4})-set\d)?|^gatecse(\d{4})-set\d")
OLD_YEAR_TAG = re.compile(r"^gate(\d{4})$")


def gate_year(tags):
    """Return the GATE CS year for a question, or None if not GATE CSE."""
    for t in tags:
        m = re.match(r"^gatecse-(\d{4})(?:-set\d)?$", t)
        if m:
            return int(m.group(1))
        m = re.match(r"^gatecse(\d{4})-set\d$", t)
        if m:
            return int(m.group(1))
        m = OLD_YEAR_TAG.match(t)
        if m and int(m.group(1)) >= 1987:
            return int(m.group(1))
    return None


def gate_set(tags):
    for t in tags:
        m = re.match(r"^gatecse-\d{4}-set(\d)$", t)
        if m:
            return m.group(1)
        m = re.match(r"^gatecse(\d{4})-set(\d)$", t)
        if m:
            return m.group(2)
    return None


def subject_from_tags_with_fallback(tags, text=""):
    subj = _subject_from_tags(tags)
    if subj == "Unclassified" and text:
        subj = subject_from_keywords(text)
    return subj


def difficulty_from_tags(tags):
    if "easy" in tags:
        return "easy"
    if "difficult" in tags:
        return "hard"
    return "medium"


def parse_title(title):
    """Extract (number, section) from a title like 'GATE CSE 2017 Set 2 | Question: 04'."""
    t = re.sub(r"\s+", " ", title or "")
    section = "GA" if "GA Question" in t else "CS"
    m = re.search(r"Question:\s*([0-9]+)", t)
    number = int(m.group(1)) if m else None
    return number, section


def html_to_text(node):
    """Convert an HTML fragment to plain text, preserving $...$ LaTeX."""
    for br in node.find_all("br"):
        br.replace_with("\n")
    for p in node.find_all("p"):
        p.append("\n")
    return re.sub(r"\n{2,}", "\n\n", node.get_text()).strip()


def extract_question(html):
    """Return (text, options, images) from a question_html fragment."""
    soup = BeautifulSoup(html, "html.parser")
    images = []
    for i, img in enumerate(soup.find_all("img")):
        src = img.get("src", "")
        if src:
            images.append(src)
            img.replace_with(f"[IMAGE:{i}]")
    ol = soup.find("ol")
    if ol is not None:
        options = []
        for li in ol.find_all("li"):
            txt = html_to_text(li)
            txt = re.sub(r"^\s*[({]?[A-E][)}]?\.?\s*", "", txt) if re.match(
                r"^\s*[({]?[A-E][)}]?\.?\s", txt) else txt
            options.append(txt.strip())
        ol.decompose()
    else:
        options = []
    text = html_to_text(soup)
    return text, options, images


def extract_explanation(answers_html):
    if not answers_html:
        return None
    parts = []
    images = []
    for block in answers_html:
        soup = BeautifulSoup(block, "html.parser")
        # drop heading like 'Answer 1'
        for h in soup.find_all(["h1", "h2", "h3"]):
            h.decompose()
        for i, img in enumerate(soup.find_all("img")):
            src = img.get("src", "")
            if src:
                images.append(src)
                img.replace_with(f"[IMAGE:{len(parts) * 100 + i}]")
        parts.append(html_to_text(soup))
    text = "\n".join(p for p in parts if p)
    return text, images


def normalize_answer(correct_option):
    if not correct_option:
        return None
    s = str(correct_option).strip()
    if s in ("X", "-"):
        return None
    if re.fullmatch(r"[A-E](?:;[A-E])*", s):
        return s.split(";")
    if re.fullmatch(r"[A-E],[A-E]", s):
        return s.split(",")
    return [s]  # numeric / range answer


def main():
    os.makedirs(DATA, exist_ok=True)
    os.makedirs(IMG_DIR, exist_ok=True)

    raw = open(os.path.join(CACHE, "gate_legacy.json"), "r").read()
    legacy = json.JSONDecoder(strict=False).decode(raw)
    print(f"legacy records: {len(legacy)}")

    by_year = {}
    stats = {"kept": 0, "dropped_non_cse": 0, "dropped_pre2000": 0, "no_answer": 0}
    image_manifest = []

    for q in legacy:
        tags = q.get("tags", [])
        year = gate_year(tags)
        if year is None:
            stats["dropped_non_cse"] += 1
            continue
        if year < 2000:
            stats["dropped_pre2000"] += 1
            continue

        number, section = parse_title(q.get("title", ""))
        setno = gate_set(tags)
        text, options, qimages = extract_question(q.get("question_html", ""))
        expl = extract_explanation(q.get("answers_html"))
        explanation, eimages = (expl if expl else (None, []))

        qid = re.search(r"/\d+", q.get("link", "")).group(0).lstrip("/")
        images = [{"src": u, "kind": "remote"} for u in qimages + eimages]

        correct = normalize_answer(q.get("correct_option"))
        qtype = "nat" if "numerical-answers" in tags else (
            "msq" if ("multiple-selects" in tags or (correct and len(correct) > 1)) else "mcq"
        )
        marks = 2 if "two-marks" in tags else (1 if "one-mark" in tags else None)

        subject = subject_from_tags_with_fallback(tags, text)

        item = {
            "id": qid,
            "year": year,
            "set": setno,
            "number": number,
            "section": section,
            "type": qtype,
            "subject": subject,
            "subtopic": subtopic_for(subject, tags, text),
            "difficulty": difficulty_from_tags(tags),
            "marks": marks,
            "text": text,
            "options": options,
            "correctAnswer": correct,
            "explanation": explanation,
            "images": images,
            "sourceUrl": q.get("link", ""),
            "source": "gateoverflow",
        }
        if correct is None:
            stats["no_answer"] += 1
        by_year.setdefault(year, []).append(item)
        image_manifest.extend(images)
        stats["kept"] += 1

    print(stats)

    for year in sorted(by_year):
        items = sorted(by_year[year], key=lambda x: (x["number"] or 0))
        with open(os.path.join(DATA, f"questions-{year}.json"), "w") as f:
            json.dump(items, f, ensure_ascii=False, indent=1)
        print(f"  {year}: {len(items)} questions")

    # Build index.json
    from collections import Counter

    subjects = Counter()
    subtopics = Counter()
    types = Counter()
    years = {}
    total = 0
    for year, items in by_year.items():
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
    print("index written:", json.dumps(index, ensure_ascii=False)[:300])

    existing = len([f for f in os.listdir(IMG_DIR) if os.path.isfile(os.path.join(IMG_DIR, f))]) if os.path.exists(IMG_DIR) else 0
    if existing < 100:
        download_images(image_manifest)
    else:
        print(f"skipping image download ({existing} images already exist)")


def download_images(manifest, concurrency=8):
    import urllib.request

    seen = {}
    jobs = []
    for im in manifest:
        url = im["src"]
        if url in seen or "blobid" not in url:
            continue
        seen[url] = True
        blobid = re.search(r"qa_blobid=([0-9]+)", url).group(1)
        dest = os.path.join(IMG_DIR, f"{blobid}.img")
        if os.path.exists(dest):
            continue
        jobs.append((url, dest))

    def fetch(job):
        url, dest = job
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read()
            with open(dest, "wb") as f:
                f.write(data)
            return True
        except Exception as e:
            return False

    done = 0
    ok = 0
    with ThreadPoolExecutor(max_workers=concurrency) as ex:
        for res in ex.map(fetch, jobs):
            done += 1
            if res:
                ok += 1
            if done % 50 == 0:
                print(f"  images: {done}/{len(jobs)}")
    print(f"images downloaded: {ok}/{len(jobs)}")


if __name__ == "__main__":
    main()
