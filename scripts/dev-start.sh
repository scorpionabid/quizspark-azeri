#!/bin/bash
set -e

# Rənglər
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Tətbiq başladılır...${NC}"

# Supabase yoxla
if ! supabase status >/dev/null 2>&1; then
    echo -e "${BLUE}🐳 Supabase başladılır...${NC}"
    supabase start
fi

# Frontend-i Docker üzərində başlat
echo -e "${BLUE}🐳 Frontend konteyneri başladılır...${NC}"
docker-compose up -d --build

# Brauzerdə pəncərələri aç
echo -e "${BLUE}🌍 Lokal dashboard-lar və tətbiq brauzerdə açılır...${NC}"
open "http://localhost:3005"      # Tətbiq (Frontend)
open "http://localhost:54323"     # Supabase Studio (Database)
open "http://localhost:54324"     # Mailpit (Email testləri)

echo -e "${GREEN}📊 Tətbiq: http://localhost:3005${NC}"
echo -e "${GREEN}📊 Supabase Studio: http://localhost:54323${NC}"
echo -e "${GREEN}📊 Mailpit: http://localhost:54324${NC}"

echo -e "${BLUE}📝 Loqları izləmək üçün: docker-compose logs -f${NC}"
