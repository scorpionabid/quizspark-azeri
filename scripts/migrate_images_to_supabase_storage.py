#!/usr/bin/env python3
import os
import mimetypes
import urllib.request
import urllib.parse
import json

SUPABASE_STORAGE_URL = "http://127.0.0.1:8090/storage/v1/object/question-images"
PUBLIC_BASE_URL = "https://supa.imtahan.store/storage/v1/object/public/question-images"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzM2MDA1MTQsImV4cCI6MjA4ODk2MDUxNH0.w1RU2ZEvkqGPUrrum3Mq0GP3cA41RzBsftpFq81Gx1Y"
IMAGES_DIR = "/srv/quizspark-azeri/public/images"
SQL_FILE = "/srv/quizspark-azeri/scripts/migrate_images_to_supabase_storage.sql"

def upload_images():
    print("--- 1. Uploading images to Supabase Storage ---")
    files = sorted(os.listdir(IMAGES_DIR))
    uploaded = 0
    for f in files:
        file_path = os.path.join(IMAGES_DIR, f)
        if not os.path.isfile(file_path):
            continue
        
        mime_type, _ = mimetypes.guess_type(file_path)
        if not mime_type:
            mime_type = "image/png" if f.endswith(".png") else "image/jpeg"
        
        url = f"{SUPABASE_STORAGE_URL}/{urllib.parse.quote(f)}"
        with open(file_path, "rb") as fp:
            data = fp.read()
        
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Authorization": f"Bearer {SERVICE_KEY}",
                "apikey": SERVICE_KEY,
                "Content-Type": mime_type,
                "x-upsert": "true"
            },
            method="POST"
        )
        try:
            with urllib.request.urlopen(req) as resp:
                result = json.loads(resp.read().decode())
                print(f" [OK] {f} ({len(data)} bytes) -> {result.get('Key')}")
                uploaded += 1
        except Exception as e:
            print(f" [ERR] {f}: {e}")
    
    print(f"Total uploaded: {uploaded}/{len(files)}\n")

def generate_sql():
    print("--- 2. Generating SQL migration script ---")
    files = sorted(os.listdir(IMAGES_DIR))
    
    sql_statements = [
        "BEGIN;\n",
        "-- Normalize all ./images/ and /images/ paths to Supabase Storage public URLs\n"
    ]

    for f in files:
        public_url = f"{PUBLIC_BASE_URL}/{f}"
        
        sql_statements.append(f"""
-- File: {f}
UPDATE questions
SET question_text = replace(replace(replace(question_text, './images/{f}', '{public_url}'), '/images/{f}', '{public_url}'), 'images/{f}', '{public_url}'),
    explanation = replace(replace(replace(explanation, './images/{f}', '{public_url}'), '/images/{f}', '{public_url}'), 'images/{f}', '{public_url}'),
    question_image_url = '{public_url}'
WHERE question_image_url IN ('/images/{f}', './images/{f}', 'images/{f}')
   OR question_text LIKE '%{f}%';

UPDATE question_bank
SET question_text = replace(replace(replace(question_text, './images/{f}', '{public_url}'), '/images/{f}', '{public_url}'), 'images/{f}', '{public_url}'),
    explanation = replace(replace(replace(explanation, './images/{f}', '{public_url}'), '/images/{f}', '{public_url}'), 'images/{f}', '{public_url}'),
    question_image_url = '{public_url}'
WHERE question_image_url IN ('/images/{f}', './images/{f}', 'images/{f}')
   OR question_text LIKE '%{f}%';
""")

    sql_statements.append("COMMIT;\n")

    with open(SQL_FILE, "w", encoding="utf-8") as fp:
        fp.write("\n".join(sql_statements))
    
    print(f"Generated SQL script: {SQL_FILE}")

if __name__ == "__main__":
    upload_images()
    generate_sql()
