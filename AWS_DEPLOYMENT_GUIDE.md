# 🚀 Deploy OutletPro no AWS EC2 - Guia Completo

**Tempo estimado: 20-30 minutos**

---

## ⚡ Resumo Rápido

1. **Criar instância EC2 na AWS**
2. **Conectar via SSH**
3. **Executar script de deploy**
4. **Pronto! Sistema rodando**

---

## 📝 Passo 1: Criar Instância EC2 (5 min)

### 1.1 Acessar AWS Console

1. Acesse: https://console.aws.amazon.com
2. Faça login com sua conta
3. Vá para: **EC2 Dashboard**

### 1.2 Iniciar Instância

1. Clique em **Instances** (no menu esquerdo)
2. Clique em **Launch Instances**
3. Escolha configurações:
   - **Name**: `outletpro` ou qualquer nome
   - **AMI**: Procure por `Ubuntu Server 22.04 LTS` (free tier)
   - **Instance type**: `t2.micro` (free tier elegível)
   - **Storage**: 20 GB (free tier)

### 1.3 Configurar Security Group (Firewall)

Clique em **Edit security groups inbound rules**:

| Type | Protocol | Port | Source | Descrição |
|------|----------|------|--------|-----------|
| SSH | TCP | 22 | 0.0.0.0/0 | Acesso remoto |
| HTTP | TCP | 80 | 0.0.0.0/0 | Site |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Site seguro |
| Custom TCP | TCP | 3000 | 0.0.0.0/0 | API (opcional) |

### 1.4 Criar/Selecionar Key Pair

1. Clique em **Create new key pair**
2. Nome: `outletpro-key`
3. Format: **PEM** (para Mac/Linux) ou **PPK** (para Windows com PuTTY)
4. **Download Key Pair** - Salve em local seguro!

### 1.5 Launch

1. Clique em **Launch Instance**
2. Espere 1-2 minutos pela inicialização
3. Clique em **View instances**
4. **Anote o Public IP** (ex: `54.123.456.789`)

✅ **Instância criada e rodando!**

---

## 🔐 Passo 2: Conectar via SSH (2 min)

### 2.1 Windows com PowerShell

```powershell
# Navegue até onde salvou o arquivo .pem
cd C:\Users\seu-usuario\Downloads

# Conectar
ssh -i "outletpro-key.pem" ubuntu@seu-ip-publico
```

Exemplo:
```powershell
ssh -i "outletpro-key.pem" ubuntu@54.123.456.789
```

### 2.2 Mac/Linux com Terminal

```bash
cd ~/Downloads
chmod 400 outletpro-key.pem
ssh -i outletpro-key.pem ubuntu@seu-ip-publico
```

### 2.3 Windows com PuTTY

1. Abra PuTTY
2. **Host Name**: `ubuntu@seu-ip-publico`
3. **Connection → SSH → Auth**: Selecione arquivo `.ppk`
4. Clique **Open**

✅ **Conectado ao servidor!**

---

## 🚀 Passo 3: Deploy Automático (10 min)

Uma vez conectado no EC2 via SSH, execute:

### 3.1 Clonar repositório

```bash
cd ~
git clone https://github.com/SEU-USUARIO/outletpro.git
cd outletpro
```

### 3.2 Executar Script de Deploy

```bash
chmod +x deploy.sh
bash deploy.sh
```

**O script vai:**
- ✅ Atualizar o sistema
- ✅ Instalar Node.js 18
- ✅ Instalar PM2 (gerencidor de processos)
- ✅ Instalar dependências
- ✅ Configurar banco de dados
- ✅ Iniciar servidor
- ✅ Instalar e configurar Nginx

Espere 5-10 minutos para conclusão.

✅ **Sistema deployed e rodando!**

---

## 🌐 Passo 4: Acessar o Sistema (2 min)

### 4.1 Via HTTP

Abra no navegador:
```
http://seu-ip-publico
```

Exemplo:
```
http://54.123.456.789
```

### 4.2 Fazer Login

- **Email**: `master@outletpro.com`
- **Senha**: `123456`

---

## 🎯 Passo 5: Usar Domínio Próprio (Opcional - 5 min)

Se tiver um domínio (ex: `meusite.com.br`):

### 5.1 Apontar DNS para EC2

1. Acesse seu registrador de domínio (GoDaddy, Registro.br, etc)
2. Vá para **Gerenciar DNS**
3. Crie/edite registro **A**:
   - **Nome**: `@` (ou deixe vazio)
   - **Tipo**: `A`
   - **Valor**: Seu IP público do EC2 (ex: `54.123.456.789`)
4. Salve e aguarde propagação (5-30 minutos)

### 5.2 Testar DNS

```bash
# No terminal, espere propagação
ping seu-dominio.com.br
```

### 5.3 Configurar HTTPS com Let's Encrypt

```bash
# Conecte via SSH novamente
ssh -i "outletpro-key.pem" ubuntu@seu-ip-publico

# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Gerar certificado
sudo certbot certonly --nginx -d seu-dominio.com.br

# Atualizar configuração Nginx
sudo nano /etc/nginx/sites-available/outletpro
```

Substitua este trecho:

```nginx
# De:
server {
    listen 80;
    server_name _;
}

# Para:
server {
    listen 443 ssl http2;
    server_name seu-dominio.com.br;
    
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com.br/privkey.pem;
    
    # Resto da configuração igual...
}

# Adicione redirect de HTTP para HTTPS:
server {
    listen 80;
    server_name seu-dominio.com.br;
    return 301 https://$server_name$request_uri;
}
```

Depois:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

Agora acesse: `https://seu-dominio.com.br` ✅

---

## 🔧 Comandos Úteis

### Ver Status do Servidor

```bash
pm2 status
pm2 logs outletpro
```

### Parar/Reiniciar/Deletar

```bash
# Parar
pm2 stop outletpro

# Reiniciar
pm2 restart outletpro

# Deletar
pm2 delete outletpro
```

### Ver Logs

```bash
# Últimos 100 linhas
pm2 logs outletpro

# Tempo real
pm2 logs outletpro --lines 100 --follow
```

### SSH Novamente

```bash
ssh -i "outletpro-key.pem" ubuntu@seu-ip-publico
```

---

## 🆘 Troubleshooting

### Erro: "Connection refused"
- Verifique se a instância está rodando (EC2 Dashboard)
- Verifique se o Security Group permite porta 22

### Erro: "Permission denied (publickey)"
- Verifique se está usando arquivo `.pem` correto
- Verifique permissões: `chmod 400 outletpro-key.pem`

### Nginx mostra "502 Bad Gateway"
```bash
# PM2 pode ter caído
pm2 restart outletpro
```

### Servidor rodando mas site não carrega
```bash
# Verificar logs
pm2 logs outletpro

# Verificar se Node está rodando
ps aux | grep node
```

---

## 💰 Custo Estimado

**AWS Free Tier (1 ano):**
- EC2 t2.micro: **GRÁTIS** (750 horas/mês)
- Storage EBS: **GRÁTIS** (30 GB/mês)
- Transferência de dados: **GRÁTIS** (100 GB/mês out)

**Após 1 ano (estimado):**
- ~$10-15/mês para t2.micro
- +$1-2/mês para storage
- **Total: ~$12-17/mês**

---

## 📊 Monitoramento Recomendado

```bash
# Instalar ferramentas de monitoramento
npm install -g pm2-plus

# No dashboard AWS EC2
# Ativar CloudWatch para monitorar CPU/RAM/Rede
```

---

## ✅ Checklist Final

- [ ] Instância EC2 criada e rodando
- [ ] SSH conectado com sucesso
- [ ] Script de deploy executado
- [ ] Server respondendo em `http://seu-ip`
- [ ] Login funcionando com master@outletpro.com
- [ ] Domínio apontando para EC2 (se tiver)
- [ ] HTTPS configurado (se tiver domínio)

---

## 🆘 Suporte

Se der problema:
1. Verifique os logs: `pm2 logs outletpro`
2. Verifique status: `pm2 status`
3. SSH novamente e reinicie: `pm2 restart outletpro`

Qualquer dúvida, revise este guia ou o `deploy.sh`

**Bom deployment! 🎉**
