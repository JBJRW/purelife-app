#!/bin/bash
# ============================================================
#  dr.smoothie.ai — Script de deploy a GitHub + Vercel
#  JRMB Food Network LLC
#  Ejecutar desde: carpeta raíz del repo purelife-app
# ============================================================

set -e  # Detener si hay errores

GREEN='\033[0;32m'
GOLD='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}"
echo "╔══════════════════════════════════════╗"
echo "║   dr.smoothie.ai — Deploy Script     ║"
echo "║   JRMB Food Network LLC              ║"
echo "╚══════════════════════════════════════╝"
echo -e "${NC}"

# ── 1. Verificar que estamos en el repo correcto
echo -e "${GOLD}[1/7] Verificando repo...${NC}"
if [ ! -d ".git" ]; then
  echo -e "${RED}ERROR: No estás en la raíz del repo git.${NC}"
  echo "Ejecuta: cd ~/ruta/al/purelife-app"
  exit 1
fi
echo "✓ Repo git detectado"

# ── 2. Verificar rama
echo -e "${GOLD}[2/7] Verificando rama...${NC}"
BRANCH=$(git branch --show-current)
echo "✓ Rama actual: $BRANCH"

# ── 3. Instalar dependencias
echo -e "${GOLD}[3/7] Instalando dependencias...${NC}"
npm install
echo "✓ npm install completado"

# ── 4. Build local de prueba
echo -e "${GOLD}[4/7] Build de verificación...${NC}"
npm run build
echo "✓ Build exitoso → dist/"

# ── 5. Git add + commit
echo -e "${GOLD}[5/7] Committing cambios...${NC}"
git add -A
git status
echo ""
read -p "¿Confirmar commit? (s/n): " confirm
if [ "$confirm" != "s" ]; then
  echo "Commit cancelado."
  exit 0
fi

TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
git commit -m "feat: Bio-Tech UI v2 + HealthProfile + WeeklySeries + VideoStudio — $TIMESTAMP"
echo "✓ Commit creado"

# ── 6. Push a main
echo -e "${GOLD}[6/7] Push a GitHub main...${NC}"
git push origin main
echo "✓ Push a main completado"

# ── 7. Resultado
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ DEPLOY COMPLETADO                                ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Vercel detectará el push automáticamente            ║${NC}"
echo -e "${GREEN}║  Build en curso en: vercel.com/dashboard             ║${NC}"
echo -e "${GREEN}║                                                       ║${NC}"
echo -e "${GREEN}║  URLs de la app:                                      ║${NC}"
echo -e "${GREEN}║  → purelifewellnessclub.org                          ║${NC}"
echo -e "${GREEN}║  → purelife-app-umber.vercel.app                     ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Rutas disponibles:"
echo "  /              → Landing Bio-Tech"
echo "  /app/profile   → Health Profile Module"
echo "  /app/series    → Weekly Series"
echo "  /app/studio    → Video Studio 4K"
echo ""
