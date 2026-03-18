#!/bin/bash
# QuizSpark Azeri — Production Pull & Deploy Script
# İstifadə: ./pull.sh
set -e

PROJECT_DIR="/srv/quizspark-azeri"
SUPA_DIR="$PROJECT_DIR/supabase-docker"
BACKUP_DIR="$PROJECT_DIR/database-backups"
MIGRATIONS_DIR="$PROJECT_DIR/supabase/migrations"
APPLIED_LOG="$PROJECT_DIR/.applied_migrations"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Rənglər
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()   { echo -e "${GREEN}[OK]${NC} $1"; }
fail() { echo -e "${RED}[XƏTA]${NC} $1"; exit 1; }
info() { echo -e "${YELLOW}[...]${NC} $1"; }

cd "$PROJECT_DIR"

# ═══════════════════════════════════════════
# 1. DB BACKUP
# ═══════════════════════════════════════════
info "DB backup alınır..."
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/quizspark_${TIMESTAMP}.sql"

docker exec supabase-db pg_dump -U postgres postgres > "$BACKUP_FILE" 2>/dev/null \
  || fail "pg_dump uğursuz oldu"

FILE_SIZE=$(stat -c%s "$BACKUP_FILE" 2>/dev/null || echo 0)
if [ "$FILE_SIZE" -lt 1000 ]; then
  fail "Backup faylı çox kiçikdir: $FILE_SIZE bytes"
fi
ok "Backup: $(du -h "$BACKUP_FILE" | cut -f1)"

# 5 gündən köhnə backup-ları sil
find "$BACKUP_DIR" -name "*.sql" -mtime +5 -delete 2>/dev/null || true

# ═══════════════════════════════════════════
# 2. GIT PULL
# ═══════════════════════════════════════════
info "Git pull edilir..."
BEFORE=$(git rev-parse HEAD)
git pull origin main 2>&1 || fail "git pull uğursuz oldu"
AFTER=$(git rev-parse HEAD)

if [ "$BEFORE" = "$AFTER" ]; then
  ok "Git: Yeni dəyişiklik yoxdur."
  SKIP_BUILD=true
else
  ok "Yeni commit: $AFTER"
  git log --oneline "$BEFORE..$AFTER"
  SKIP_BUILD=false
fi

# ═══════════════════════════════════════════
# 3. YENİ MİGRASİYALAR
# ═══════════════════════════════════════════
info "Migrasiyalar yoxlanılır..."
touch "$APPLIED_LOG"

NEW_MIGRATIONS=()
for f in $(ls "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort); do
  fname=$(basename "$f")
  if ! grep -qxF "$fname" "$APPLIED_LOG"; then
    NEW_MIGRATIONS+=("$f")
  fi
done

if [ ${#NEW_MIGRATIONS[@]} -eq 0 ]; then
  ok "Yeni migrasiya yoxdur."
else
  info "${#NEW_MIGRATIONS[@]} yeni migrasiya tətbiq edilir..."
  for f in "${NEW_MIGRATIONS[@]}"; do
    fname=$(basename "$f")
    info "  → $fname"
    docker exec -i supabase-db psql -U postgres -d postgres < "$f" \
      || fail "Migrasiya uğursuz: $fname"
    echo "$fname" >> "$APPLIED_LOG"
    ok "  ✓ $fname"
  done
fi

# ═══════════════════════════════════════════
# 4. QUIZ APP BUILD & DEPLOY
# ═══════════════════════════════════════════
if [ "$SKIP_BUILD" = true ]; then
  info "Quiz App build atlanır (yeni kod yoxdur)."
else
  info "Quiz App build edilir..."
  docker compose -f docker-compose.prod.yml up -d --build \
    || fail "Docker build uğursuz oldu"
  ok "Quiz App deploy edildi."
fi

# ═══════════════════════════════════════════
# 5. HEALTHCHECKLƏRz
# ═══════════════════════════════════════════
info "Healthcheck edilir..."
if [ "$SKIP_BUILD" = true ]; then
  sleep 3
else
  sleep 15
fi

# Quiz App — 3 cəhd
QUIZ_OK=false
for i in 1 2 3; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081 2>/dev/null || echo 0)
  if [ "$HTTP_CODE" = "200" ]; then
    ok "Quiz App: http://localhost:8081 → $HTTP_CODE"
    QUIZ_OK=true
    break
  fi
  info "  Quiz App cavab vermədi ($HTTP_CODE), yenidən cəhd $i/3..."
  sleep 5
done
[ "$QUIZ_OK" = true ] || fail "Quiz App cavab vermir: HTTP $HTTP_CODE"

# Supabase API — 3 cəhd
SUPA_OK=false
for i in 1 2 3; do
  SUPA_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/rest/v1/ 2>/dev/null || echo 0)
  if [ "$SUPA_CODE" = "200" ] || [ "$SUPA_CODE" = "401" ]; then
    ok "Supabase API: http://localhost:8090 → $SUPA_CODE"
    SUPA_OK=true
    break
  fi
  info "  Supabase API cavab vermədi ($SUPA_CODE), yenidən cəhd $i/3..."
  sleep 5
done
[ "$SUPA_OK" = true ] || fail "Supabase API cavab vermir: HTTP $SUPA_CODE"

# ═══════════════════════════════════════════
echo ""
echo -e "${GREEN}════════════════════════════════${NC}"
echo -e "${GREEN}  Deploy uğurla tamamlandı ✓${NC}"
echo -e "${GREEN}════════════════════════════════${NC}"
echo "  Quiz App : https://imtahan.store"
echo "  Supabase : https://supa.imtahan.store"
if [ "$SKIP_BUILD" = true ]; then
  echo "  Commit   : $(git rev-parse HEAD) (yeni dəyişiklik yox)"
else
  echo "  Commit   : $AFTER"
fi
echo ""
