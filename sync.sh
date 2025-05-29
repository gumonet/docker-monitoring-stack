#!/bin/bash
# Directorios a excluir
EXCLUDES=(
  ".git"
  "node_modules"
  "dist"
  "tmp"
  "*.log"
)
# Configuración
LOCAL_DIR="$(pwd)/"
REMOTE_USER="gumonet"
REMOTE_HOST="192.16.0.20"
REMOTE_PATH="/home/gumonet/docker-cluster/monitoring"
SSH_KEY="$HOME/.ssh/id_rsa"  # O ajusta si usas otro path

EXCLUDE_ARGS=()
for DIR in "${EXCLUDES[@]}"; do
  EXCLUDE_ARGS+=("--exclude=${DIR}")
done

# Comando rsync
rsync -avz --delete -e "ssh" \
  "${EXCLUDE_ARGS[@]}" \
  "${LOCAL_DIR}" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}"
# Resultado
if [ $? -eq 0 ]; then
  echo "✅ Sincronización completada correctamente."
else
  echo "❌ Error durante la sincronización."
fi