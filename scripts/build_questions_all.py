#!/usr/bin/env python3
"""Generate public/data/questions-all.json from individual year files."""
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_ROOT, "public", "data")
OUTPUT = os.path.join(DATA_DIR, "questions-all.json")

all_questions = []
for year in range(2000, 2027):
    filepath = os.path.join(DATA_DIR, f"questions-{year}.json")
    with open(filepath) as f:
        questions = json.load(f)
    all_questions.extend(questions)
    print(f"  {year}: {len(questions)} questions")

all_questions.sort(key=lambda q: -q["year"])

with open(OUTPUT, "w") as f:
    json.dump(all_questions, f)

print(f"\nTotal: {len(all_questions)} questions -> {OUTPUT}")
