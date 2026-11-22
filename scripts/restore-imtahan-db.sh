#!/bin/bash
# Quiz lokal baza berpasi: auth istifadecileri + public sxemasi
# Istifade (Windows-dan):
#   docker cp <dump> supabase-db:/tmp/imtahan_latest.dump
#   docker cp scripts/restore-imtahan-db.sh supabase-db:/tmp/restore.sh
#   docker exec -e LOCAL_LOGIN_EMAIL=... -e LOCAL_LOGIN_PASSWORD=... supabase-db bash /tmp/restore.sh
set -u
DUMP=/tmp/imtahan_latest.dump
PSQL="psql -U supabase_admin -d postgres -v ON_ERROR_STOP=0 -q"

echo ">> 1. public sxemasi sifirlanir"
$PSQL -c "drop schema if exists public cascade;" \
      -c "create schema public authorization pg_database_owner;" \
      -c "grant usage on schema public to postgres, anon, authenticated, service_role;" \
      -c "grant all on schema public to postgres, service_role;"

echo ">> 2. Genislenmeler"
$PSQL -c "create extension if not exists vector with schema extensions;" \
      -c "create extension if not exists pg_trgm with schema public;" \
      -c "alter extension pg_trgm set schema public;"

echo ">> 3. auth istifadecileri (users, identities)"
$PSQL -c "truncate auth.identities, auth.users cascade;"
pg_restore -U supabase_admin -d postgres --data-only --disable-triggers --schema=auth -t users -t identities $DUMP 2>&1 | tail -n 5

echo ">> 4. public sxemasi berpa edilir"
pg_restore -U supabase_admin -d postgres --schema=public $DUMP 2>&1 | grep -E "error|warning" | tail -n 10

echo ">> 5. auth.users triggerleri"
pg_restore -l $DUMP | grep -E "TRIGGER auth users" > /tmp/auth_triggers.list
$PSQL -c "drop trigger if exists on_auth_user_created on auth.users;" \
      -c "drop trigger if exists on_auth_user_last_sign_in on auth.users;"
pg_restore -U supabase_admin -d postgres -L /tmp/auth_triggers.list $DUMP 2>&1 | tail -n 5

echo ">> 5b. Lokal giris sifresi (yalniz LOCAL_LOGIN_EMAIL/LOCAL_LOGIN_PASSWORD verilibse)"
if [ -n "${LOCAL_LOGIN_EMAIL:-}" ] && [ -n "${LOCAL_LOGIN_PASSWORD:-}" ]; then
  $PSQL -v email="$LOCAL_LOGIN_EMAIL" -v pass="$LOCAL_LOGIN_PASSWORD" <<'SQL'
update auth.users
   set encrypted_password = extensions.crypt(:'pass', extensions.gen_salt('bf')),
       email_confirmed_at = coalesce(email_confirmed_at, now())
 where email = :'email';
SQL
fi

echo ">> 6. PostgREST sxema kesi yenilenir"
$PSQL -c "notify pgrst, 'reload schema';"

echo ">> Yoxlama"
$PSQL -t -c "select 'public tables', count(*) from information_schema.tables where table_schema='public' union all select 'auth.users', count(*) from auth.users union all select 'profiles', count(*) from public.profiles union all select 'quizzes', count(*) from public.quizzes union all select 'question_bank', count(*) from public.question_bank union all select 'auth triggers', count(*) from pg_trigger where tgrelid='auth.users'::regclass and not tgisinternal;"
rm -f $DUMP /tmp/auth_triggers.list
