#!/bin/bash

##############################################################################
# Script de Atualização Rápida do OutletPro
# Puxa última versão do GitHub e reinicia o servidor
# Use: bash update.sh
##############################################################################

set -e

echo "📥 Atualizando OutletPro..."
echo ""

cd ~/outletpro

# Backup antes de atualizar
echo "💾 Fazendo backup..."
bash backup.sh

echo ""
echo "📦 Puxando atualizações do GitHub..."
git pull origin main

echo ""
echo "📚 Instalando dependências..."
cd server
npm install

echo ""
echo "🔄 Reiniciando servidor..."
pm2 restart outletpro

echo ""
echo "✅ Atualização concluída!"
echo ""
pm2 status outletpro
echo ""
echo "📊 Últimos logs:"
pm2 logs outletpro --lines 20
