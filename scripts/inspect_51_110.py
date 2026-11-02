#!/usr/bin/env python3
import json

with open('/tmp/grade8_questions.json') as f:
    items = json.load(f)

# Let's inspect questions from 51 to 110 to see Kimya, Fizika, Biologiya
for it in items[50:110]:
    txt = it['text'].replace('\n', ' ')
    print(f"{it['idx']:3d}: {txt[:90]}")
