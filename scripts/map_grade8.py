#!/usr/bin/env python3
import json

with open('/tmp/grade8_questions.json') as f:
    items = json.load(f)

# Let's map each index to a subject
# 1-156
# Let's check each question one by one
mapping = {}

for it in items:
    idx = it['idx']
    txt = it['text']
    cid = it['id']
    
    # Defaults or rules
    pass
