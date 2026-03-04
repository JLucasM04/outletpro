#!/bin/bash

##############################################################################
# Script de Backup do OutletPro
# Faz backup da aplicação e banco de dados
# Cron: Execute diariamente com: 0 2 * * * /home/ubuntu/outletpro/backup.sh
##############################################################################

set -e

# Configurações
BACKUP_DIR="/home/ubuntu/backups"
APP_DIR="/home/ubuntu/outletpro"
DATABASE_FILE="$APP_DIR/server/database.sqlite"
DAYS_TO_KEEP=7
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/outletpro_backup_$DATE.tar.gz"

echo "🔄 Iniciando backup..."
echo "Data: $(date)"

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

# Fazer snapshot do banco de dados (se existir)
if [ -f "$DATABASE_FILE" ]; then
    echo "💾 Fazendo backup do banco de dados..."
    cp "$DATABASE_FILE" "$BACKUP_DIR/database_$DATE.sqlite"
fi

# Fazer backup da aplicação
echo "📦 Compactando aplicação..."
tar -czf "$BACKUP_FILE" \
    --exclude="$APP_DIR/server/node_modules" \
    --exclude="$APP_DIR/.git" \
    "$APP_DIR"

echo "✓ Backup criado: $BACKUP_FILE"
echo "📊 Tamanho: $(du -h $BACKUP_FILE | cut -f1)"

# Remover backups antigos
echo "🧹 Removendo backups com mais de $DAYS_TO_KEEP dias..."
find "$BACKUP_DIR" -name "outletpro_backup_*.tar.gz" -mtime +$DAYS_TO_KEEP -delete
find "$BACKUP_DIR" -name "database_*.sqlite" -mtime +$DAYS_TO_KEEP -delete

echo "✅ Backup concluído!"
echo ""
echo "📍 Local: $BACKUP_DIR"
echo "✓ Backups mantidos: Últimos $DAYS_TO_KEEP dias"
