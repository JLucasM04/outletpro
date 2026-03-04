# ⚡ Quick Start - OutletPro no AWS EC2

## 🎯 Em 3 Passos Simples:

### 1. Criar instância na AWS

```
https://console.aws.amazon.com → EC2 → Launch Instances
- AMI: Ubuntu 22.04 LTS
- Tipo: t2.micro
- Storage: 20 GB
- Firewall: Abra portas 22, 80, 443
- Download: Salve o arquivo .pem
```

### 2. Conectar e fazer Deploy

```powershell
# PowerShell no seu PC
ssh -i "outletpro-key.pem" ubuntu@seu-ip-publico

# Nu servidor (depois de conectado):
cd ~
git clone https://github.com/SEUUSUARIO/outletpro.git
cd outletpro
chmod +x deploy.sh
bash deploy.sh
```

Espere 10 minutos...

### 3. Acessar

```
http://seu-ip-publico
Email: master@outletpro.com
Senha: 123456
```

---

## 📝 Comandos Úteis

| Comando | Resultado |
|---------|-----------|
| `pm2 status` | Ver se servidor está rodando |
| `pm2 logs outletpro` | Ver logs |
| `bash update.sh` | Atualizar para última versão |
| `bash backup.sh` | Fazer backup |

---

## 🎓 Documentação Completa

Veja: [AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md)

---

**Suporte:** Verifique os logs com `pm2 logs outletpro` se tiver problemas.
