# 🛍️ OutletPro - Sistema de Gestão de Vendas

[![Node.js](https://img.shields.io/badge/Node.js-16+-green?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-black?logo=express)](https://expressjs.com)
[![SQLite3](https://img.shields.io/badge/SQLite-3-blue?logo=sqlite)](https://www.sqlite.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Sistema profissional de gestão de vendas, estoque e notas fiscais com interface moderna e segurança em primeiro lugar.

---

## ✨ Principais Características

### 🎯 Funcionalidades Core
- ✅ **Gestão de Vendas** - Registre vendas com carrinho de múltiplos produtos
- ✅ **Controle de Estoque** - Atualização automática de inventário
- ✅ **Notas Fiscais** - Geração automática com CPF/CNPJ
- ✅ **Desconto Percentual** - Aplique descontos flexíveis por venda
- ✅ **Múltiplos Usuários** - Diferentes perfis (Master, Admin, Seller)
- ✅ **Multi-Empresa** - Suporte para gerenciar várias lojas

### 🔒 Segurança
- ✅ Autenticação JWT com expiração 12h
- ✅ Senhas hasheadas com bcrypt
- ✅ Validação de entrada em servidor e cliente
- ✅ CORS configurado
- ✅ Estrutura de roles (Master/Admin/Seller)

### 🎨 Interface
- ✅ Dark/Light Theme
- ✅ Design Responsivo
- ✅ Tema moderno com gradientes
- ✅ Ícones e animações suaves
- ✅ Filtros e busca em tempo real

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 16+ ([Download](https://nodejs.org))
- npm 7+ ou yarn
- Git

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/outletpro.git
cd outletpro

# 2. Instale dependências
cd server
npm install
cd ..

# 3. Inicie o servidor
npm start
```

**Servidor rodando em:** `http://localhost:3000`

### 👤 Login Padrão (Primeira Execução)

```
Email:    master@outletpro.com
Senha:    123456
Perfil:   Master
```

⚠️ **IMPORTANTE:** Mude a senha na primeira execução em produção!

---

## 📚 Documentação

- **[INSTALACAO.md](./INSTALACAO.md)** - Guia completo de instalação e configuração
- **[API_DOCS.md](./API_DOCS.md)** - Referência completa da API REST
- **[ARQUITETURA.md](./ARQUITETURA.md)** - Diagrama arquitetural, schema DB e padrões

---

## 📂 Estrutura de Pastas

```
outletpro/
├── server/
│   ├── index.js              ← Servidor principal
│   ├── models.js             ← Schema banco de dados
│   ├── config.js             ← Configurações
│   ├── package.json          ← Dependências
│   └── database.sqlite       ← Banco de dados (auto-criado)
│
├── outlet-system_3.html      ← Frontend SPA completo
├── login.html                ← Página de autenticação
│
├── README.md                 ← Este arquivo
├── INSTALACAO.md             ← Setup e deployment
├── API_DOCS.md               ← Referência de endpoints
├── ARQUITETURA.md            ← Padrões arquiteturais
├── LICENSE                   ← MIT License
└── .gitignore                ← Git configuration
```

---

## 🔄 Fluxo de Venda (Exemplo)

```
1. Login → 2. Nova Venda → 3. Adicionar produtos ao carrinho 
→ 4. Aplicar desconto → 5. Registrar → 6. Nota auto-gerada
```

---

## 🗄️ Banco de Dados

Tabelas principais:
- **companies** - Empresas
- **users** - Usuários (Master, Admin, Seller)
- **products** - Produtos com estoque
- **sales** - Vendas com cart JSON
- **invoices** - Notas fiscais

[Esquema completo →](./ARQUITETURA.md#-schema-do-banco-de-dados)

---

## 🔐 Autenticação

- JWT com 12h expiry
- Senhas com bcrypt
- Roles: Master | Admin | Seller
- Token em Authorization header

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiI...
```

---

## 📊 Stack Tecnológico

| Layer | Tecnologia |
|-------|-----------|
| Frontend | HTML5/CSS3/JS Vanilla |
| Backend | Node.js + Express.js |
| Database | SQLite3 |
| ORM | Sequelize |
| Auth | JWT + bcrypt |

---

## 🚀 Deployment

**Opções recomendadas:**
- DigitalOcean (Linux VPS)
- Heroku (PaaS)
- Docker (Containerizado)

Veja [INSTALACAO.md - Deployment](./INSTALACAO.md#-deployment)

---

## 📡 APIs Disponíveis

```
POST   /api/login               # Login
GET    /api/companies           # Listar empresas
POST   /api/products            # Criar produto
POST   /api/vendas              # Registrar venda
GET    /api/notas               # Listar notas
```

[Documentação completa →](./API_DOCS.md)

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| Porta 3000 em uso | Mudar porta ou parar processo |
| Database LOCKED | Delete database.sqlite |
| CORS error | Adicionar domínio à whitelist |

[Mais informações →](./INSTALACAO.md#-troubleshooting)

---

## 📈 Performance

- Response time: <100ms
- Suporta: 100+ usuários (SQLite)
- Para volume alto: migrar para PostgreSQL

---

## 🤝 Contribuindo

1. Fork
2. Feature branch: `git checkout -b feature/xyz`
3. Commit: `git commit -m 'Add xyz'`
4. Push: `git push origin feature/xyz`
5. Pull Request

---

## 📋 Roadmap

### v1.0.0 ✅
- [x] Autenticação JWT
- [x] Vendas com carrinho
- [x] Notas fiscais automáticas
- [x] Multi-empresa

### v1.1.0 (Q2 2024)
- [ ] Relatórios PDF
- [ ] Integração PIX
- [ ] Backup nuvem

### v2.0.0 (Q3 2024)
- [ ] App Mobile
- [ ] IA e previsões

---

## 📄 Licença

MIT License © 2024 OutletPro. [Veja LICENSE](LICENSE)

---

## 💬 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/outletpro/issues)
- **Email**: suporte@outletpro.com
- **Docs**: [Documentação](.)

---

**Desenvolvido com ❤️ para vendedores que buscam profissionalismo**

