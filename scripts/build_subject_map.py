#!/usr/bin/env python3
"""Build a lightweight questionId -> subject map.

Reads data/questions-YYYY.json and writes data/question-subjects.json
and public/data/question-subjects.json (used by the client to compute
per-subject progress without downloading every question file).
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DATA = os.path.join(ROOT, "data")
PUBLIC = os.path.join(ROOT, "public", "data")

mapping = {}
for year in range(2000, 2027):
    path = os.path.join(DATA, f"questions-{year}.json")
    if not os.path.exists(path):
        continue
    with open(path) as f:
        for q in json.load(f):
            mapping[q["id"]] = q.get("subject", "Unclassified")

payload = json.dumps(mapping, ensure_ascii=False, indent=1, sort_keys=True)

for out_dir in (DATA, PUBLIC):
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, "question-subjects.json")
    with open(out, "w") as f:
        f.write(payload)

print(f"question-subjects.json: {len(mapping)} mappings written to data/ and public/data/")
