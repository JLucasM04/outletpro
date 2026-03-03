# 📖 Guia Completo de Instalação - OutletPro

## 📋 Sumário
1. [Pré-requisitos](#pré-requisitos)
2. [Instalação Local](#instalação-local)
3. [Configuração Inicial](#configuração-inicial)
4. [Primeiro Login](#primeiro-login)
5. [Deployment em Produção](#deployment-em-produção)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

### Obrigatório
- **Node.js** 16+ ([Download](https://nodejs.org/pt-br/))
- **npm** (incluído com Node.js)
- **Git** (para clonar o repositório)

### Recomendado
- **VS Code** ou editor similar
- **Postman** (para testar API)
- **SQLite Browser** (para inspeccionar BD)

### Verificar Instalação

```powershell
node --version    # v16+
npm --version     # 8+
git --version     # 2.30+
```

---

## 💻 Instalação Local

### Passo 1: Clonar o Repositório

```powershell
# HTTPS
git clone https://github.com/seu-usuario/outletpro.git
cd outletpro

# Ou SSH
git clone git@github.com:seu-usuario/outletpro.git
cd outletpro
```

### Passo 2: Instalar Dependências

```powershell
# Navegue até a pasta do servidor
cd server

# Instale todas as dependências
npm install
```

**Dependências Instaladas:**
- `express` - Framework web
- `sequelize` - ORM para BD
- `sqlite3` - Banco de dados
- `bcrypt` - Hash de senhas
- `jsonwebtoken` - Autenticação JWT
- `body-parser` - Parser JSON/forms

### Passo 3: Iniciar o Servidor

```powershell
# Modo desenvolvimento (com auto-reload)
npm run dev

# Ou modo produção
npm start
```

✅ **Sucesso!** O servidor estará rodando em:
```
http://localhost:3000
```

---

## ⚙️ Configuração Inicial

### Variáveis de Ambiente

Crie um arquivo `.env` na pasta `server/`:

```env
# Porta padrão
PORT=3000

# JWT Secret (gere uma string aleatória forte)
JWT_SECRET=seu_secret_super_seguro_aqui_123456

# Ambiente
NODE_ENV=development

# Banco de dados (padrão: database.sqlite)
DB_PATH=./database.sqlite
```

**Gerar JWT_SECRET forte:**

```powershell
# Windows PowerShell
-join ((1..32) | ForEach-Object { [char][int](Get-Random -Minimum 33 -Maximum 127) })

# Linux/Mac
openssl rand -base64 32
```

### Inicialização do Banco de Dados

O banco é criado **automaticamente** na primeira execução:

1. ✅ Tabelas criadas
2. ✅ Usuário Master padrão inserido
3. ✅ Estrutura pronta para usar

**Dados Iniciais:**

```
Usuário Master:
- Username: master
- Email: master@outletpro.com
- Senha: 123456
```

⚠️ **⚠️ IMPORTANTE**: Altere esta senha imediatamente em produção!

---

## 🔐 Primeiro Login

### Acessar o Sistema

1. Abra o navegador
2. Acesse: `http://localhost:3000`
3. Clique em **"Entrar"**

### Fazer Login

```
Email: master@outletpro.com
Senha: 123456
```

### Primeiro Acesso

Após fazer login como Master, você pode:

1. **Criar Empresa"**
   - Vá para "Empresas"
   - Clique "+ Nova Empresa"
   - Preencha nome, CNPJ, responsável
   - **Importante**: Crie um Admin para gerenciar

2. **Criar Vendedor**
   - Vá para "Vendedores"
   - Clique "+ Novo Vendedor"
   - Configure permissões

3. **Adicionar Produtos**
   - Acesse "Produtos"
   - Clique "+ Novo Produto"
   - Adicione marca, preço, estoque

4. **Registrar Venda**
   - Vá para "Vendas"
   - Clique "+ Nova Venda"
   - Selecione produtos e finalize

---

## 🚀 Deployment em Produção

### Opção 1: DigitalOcean (Recomendado)

#### Create Droplet
1. Escolha Ubuntu 22.04 LTS
2. Tamanho: $6/mês (1GB RAM, 1vCPU)
3. SSH Key para segurança

#### Deploy via SSH

```bash
# Conectar ao servidor
ssh root@seu_ip_droplet

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clonar repositório
git clone https://github.com/seu-usuario/outletpro.git
cd outletpro/server

# Instalar dependências
npm install

# Instalar PM2 (process manager)
sudo npm install -g pm2

# Iniciar aplicação
pm2 start index.js --name "outletpro"
pm2 startup
pm2 save

# Configurar Nginx como reverse proxy
sudo apt-get install nginx
# ... configurar nginx.conf ...
```

### Opção 2: Heroku (Simples)

```bash
# Instalar Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create seu-app-name

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

### Opção 3: Docker (Profissional)

`Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t outletpro .
docker run -p 3000:3000 outletpro
```

### Configuração de Produção

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=seu_secret_ultra_seguro_gerado
DB_PATH=/var/outletpro/database.sqlite
```

### Certificado SSL (HTTPS)

```bash
# com Let's Encrypt via Certbot
sudo certbot certonly --standalone -d seu-dominio.com

# Auto-renew
sudo certbot renew --dry-run
```

---

## ❓ Troubleshooting

### ❌ "Port 3000 already in use"

```powershell
# Encontrar processo na porta
netstat -ano | findstr :3000

# Matar processo (windows)
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Ou usar porta diferente
$env:PORT=3001
npm start
```

### ❌ "Cannot find module 'express'"

```powershell
# Reinstalar dependências
rm -r node_modules package-lock.json
npm install
```

### ❌ "Database error"

```powershell
# Deletar BD corrompido
rm database.sqlite

# Reiniciar (recria vazio)
npm start
```

### ❌ "JWT token invalid/expired"

- Faça logout e login novamente
- Limpe localStorage do navegador
- Verifique JWT_SECRET no .env

### ❌ "Estoque não atualiza"

- Verifique permissões do usuário (deve ser seller/admin)
- Confirme que produto existe no estoque
- Verifique logs do servidor

---

## 📊 Monitoramento

### Logs

```powershell
# Ver logs em tempo real (PM2)
pm2 logs outletpro

# Arquivos de log
cat ~/.pm2/logs/outletpro-out.log
cat ~/.pm2/logs/outletpro-error.log
```

### Performance

```powershell
# Ver status
pm2 status

# Monitoramento contínuo
pm2 monit
```

---

## 🔄 Atualizações

```bash
# Baixar novas mudanças
git pull origin main

# Instalar dependências novas
npm install

# Reiniciar
pm2 restart outletpro
```

---

## 📚 Próximos Passos

1. Leia [API_DOCS.md](./API_DOCS.md) para documentação da API
2. Configure backup automático do banco de dados
3. Implemente SSL em produção
4. Configure rate limiting
5. Adicione monitoramento (Sentry, LogRocket)

---

## 💬 Suporte

Dúvidas? Abra uma [issue no GitHub](https://github.com/seu-usuario/outletpro/issues)

✅ **Instalação concluída com sucesso!**
