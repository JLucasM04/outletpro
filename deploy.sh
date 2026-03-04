#!/bin/bash

##############################################################################
# Script de Deploy do OutletPro no AWS EC2
# Este script instala Node.js, clona o repositório e configura o servidor
# Use: bash deploy.sh
##############################################################################

set -e

echo "=========================================="
echo "🚀 OutletPro - Deploy Automático"
echo "=========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_step() {
    echo -e "${BLUE}[$1]${NC} $2"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# ============================================================================
# 1. ATUALIZAR SISTEMA
# ============================================================================
print_step "1/8" "Atualizando sistema..."
sudo apt update
sudo apt upgrade -y
print_success "Sistema atualizado"

# ============================================================================
# 2. INSTALAR NODE.JS
# ============================================================================
print_step "2/8" "Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
print_success "Node.js instalado: $(node --version)"

# ============================================================================
# 3. INSTALAR PM2 (para manter o servidor rodando)
# ============================================================================
print_step "3/8" "Instalando PM2..."
sudo npm install -g pm2
pm2 completion install
print_success "PM2 instalado"

# ============================================================================
# 4. CLONAR REPOSITÓRIO
# ============================================================================
print_step "4/8" "Clonando repositório do GitHub..."

if [ -d "outletpro" ]; then
    print_warning "Diretório outletpro já existe, pulando clone..."
else
    # MUDE ISSO PARA SEU REPOSITÓRIO!
    git clone https://github.com/SEUUSUARIO/outletpro.git
    print_success "Repositório clonado"
fi

cd outletpro/server

# ============================================================================
# 5. INSTALAR DEPENDÊNCIAS
# ============================================================================
print_step "5/8" "Instalando dependências npm..."
npm install
print_success "Dependências instaladas"

# ============================================================================
# 6. CRIAR ARQUIVO .env
# ============================================================================
print_step "6/8" "Configurando variáveis de ambiente..."

if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
PORT=3000
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 32)
MASTER_PASSWORD=123456
DATABASE_URL=sqlite:database.sqlite
CORS_ORIGIN=*
EOF
    print_success "Arquivo .env criado"
else
    print_warning ".env já existe, pulando..."
fi

# ============================================================================
# 7. INICIAR COM PM2
# ============================================================================
print_step "7/8" "Iniciando servidor com PM2..."
pm2 start index.js --name "outletpro"
pm2 startup
pm2 save
print_success "Servidor iniciado com PM2"

# ============================================================================
# 8. INSTALAR E CONFIGURAR NGINX
# ============================================================================
print_step "8/8" "Instalando Nginx como reverse proxy..."
sudo apt install -y nginx

# Criar configuração do Nginx
sudo tee /etc/nginx/sites-available/outletpro > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    # Limite de tamanho de upload
    client_max_body_size 10M;

    # Timeout para requisições longas
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Permitir requisições OPTIONS (CORS)
    if (\$request_method = 'OPTIONS') {
        return 204;
    }
}
EOF

# Habilitar site
sudo ln -sf /etc/nginx/sites-available/outletpro /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

print_success "Nginx configurado e iniciado"

# ============================================================================
# RESUMO FINAL
# ============================================================================
echo ""
echo "=========================================="
echo -e "${GREEN}✓ Deploy Concluído com Sucesso!${NC}"
echo "=========================================="
echo ""
echo "📊 Status do Servidor:"
pm2 status
echo ""
echo "🌐 Acesse:"
echo "   http://seu-ip-publico"
echo ""
echo "📝 Comandos úteis:"
echo "   Ver logs:         pm2 logs outletpro"
echo "   Parar:            pm2 stop outletpro"
echo "   Reiniciar:        pm2 restart outletpro"
echo "   Ver status:       pm2 status"
echo ""
echo "=========================================="
