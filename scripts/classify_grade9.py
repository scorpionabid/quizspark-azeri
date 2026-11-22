#!/usr/bin/env python3
import json

with open('/tmp/grade9_questions.json') as f:
    items = json.load(f)

for it in items:
    idx = it['idx']
    cid = it['id']
    txt = it['text'].replace('\n', ' ')
    print(f"{idx:3d}: {txt[:110]}")
