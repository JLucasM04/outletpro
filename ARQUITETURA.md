# 🏗️ Arquitetura do OutletPro

## 📐 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                        │
│  outlet-system_3.html (SPA - Single Page Application)           │
│  - Dashboard, Vendas, Produtos, Notas, Relatórios              │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTP/HTTPS
                      │ (REST API + JWT)
┌─────────────────────▼───────────────────────────────────────────┐
│                   SERVIDOR (Node.js + Express)                  │
│  Porta: 3000 (Dev), 80/443 (Prod)                              │
│                                                                 │
│  ├── Routes → Autenticação                                      │
│  ├── Routes → Gestão de Empresas                               │
│  ├── Routes → Gestão de Usuários                               │
│  ├── Routes → Gestão de Produtos                               │
│  ├── Routes → Gestão de Vendas                                 │
│  ├── Routes → Gestão de Notas Fiscais                          │
│  ├── Routes → Gestão de Contratos                              │
│  ├── Middleware → JWT Authentication                           │
│  └── Static Files → Servir HTML/CSS/JS                         │
└─────────────────────┬───────────────────────────────────────────┘
                      │ SQL
                      │ (Sequelize ORM)
┌─────────────────────▼───────────────────────────────────────────┐
│                   BANCO DE DADOS (SQLite3)                      │
│  database.sqlite                                                │
│                                                                 │
│  ├── Table: companies (Empresas)                               │
│  ├── Table: users (Usuários)                                   │
│  ├── Table: products (Produtos)                                │
│  ├── Table: sales (Vendas)                                     │
│  ├── Table: invoices (Notas Fiscais)                           │
│  └── Table: contracts (Contratos)                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📂 Estrutura de Pastas

```
outletpro/
├── server/
│   ├── index.js              ← Express server principal
│   ├── models.js             ← Modelos Sequelize (DB schema)
│   ├── config.js             ← Configurações (JWT, BD, etc)
│   ├── package.json          ← Dependencies
│   └── database.sqlite       ← Banco de dados (auto-criado)
│
├── outlet-system_3.html      ← Frontend SPA (2869+ linhas)
├── login.html                ← Página de login
├── index.html                ← Index estático
│
├── README.md                 ← Documentação principal
├── INSTALACAO.md             ← Guia de instalação
├── API_DOCS.md              ← Documentação da API
├── ARQUITETURA.md           ← Este arquivo
│
├── .env                      ← Variáveis de ambiente (não commitar)
├── .gitignore               ← Arquivos a ignorar no git
└── package.json             ← Root package (se houver)
```

---

## 🗄️ Schema do Banco de Dados

### 1. **Companies** (Empresas)

```sql
CREATE TABLE companies (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  responsible VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(15),
  slug VARCHAR(255) UNIQUE,
  branding JSON,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Relacionamentos:**
- 1 Empresa → N Usuários
- 1 Empresa → N Produtos
- 1 Empresa → N Vendas
- 1 Empresa → N Notas Fiscais

---

### 2. **Users** (Usuários)

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  user VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  role ENUM('master', 'admin', 'seller') DEFAULT 'seller',
  status ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
  company_id INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

**Papéis:**
- **Master**: Acesso total a todas empresas
- **Admin**: Gerencia sua empresa (usuários, produtos)
- **Seller**: Apenas registra vendas

---

### 3. **Products** (Produtos)

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  marca VARCHAR(255),
  preco DECIMAL(10, 2) NOT NULL,
  estoque INTEGER DEFAULT 0,
  estoqueMin INTEGER DEFAULT 5,
  company_id INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

---

### 4. **Sales** (Vendas)

```sql
CREATE TABLE sales (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  company_id INTEGER NOT NULL,
  cliente VARCHAR(255) NOT NULL,
  cpf VARCHAR(11),
  seller_id INTEGER,
  produtos JSON,                    -- Array de produtos: [{"nome":"...", "preco":100, "qtd":2}]
  qtdTotal INTEGER,                 -- Quantidade total de itens
  valor DECIMAL(10, 2) NOT NULL,     -- Valor total da venda
  desconto DECIMAL(5, 2) DEFAULT 0,  -- Percentual de desconto
  status ENUM('Concluída', 'Cancelada') DEFAULT 'Concluída',
  data DATE,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (seller_id) REFERENCES users(id)
);
```

---

### 5. **Invoices** (Notas Fiscais)

```sql
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  company_id INTEGER NOT NULL,
  cliente VARCHAR(255) NOT NULL,
  cpf VARCHAR(11),
  produtos JSON,                    -- Array de produtos
  qtd INTEGER,                      -- Quantidade total
  valor DECIMAL(10, 2) NOT NULL,
  desconto DECIMAL(5, 2) DEFAULT 0,
  data DATE,
  hora TIME,
  venda_id INTEGER,                 -- Referência à venda original
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (venda_id) REFERENCES sales(id)
);
```

---

### 6. **Contracts** (Contratos)

```sql
CREATE TABLE contracts (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  company_id INTEGER NOT NULL UNIQUE,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  modules JSON,                     -- Módulos: ["vendas", "produtos", "relatorios"]
  status ENUM('Ativo', 'Vencido', 'Cancelado') DEFAULT 'Ativo',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

---

## 🔄 Fluxo de Dados - Registrar Venda

```
┌─────────────────────┐
│ Frontend (Browser)  │
│                     │
│ 1. Usuário clica    │
│    "Salvar Venda"   │
└──────────┬──────────┘
           │
           │ 2. saveVenda()
           │    - Valida CPF (11 dígitos)
           │    - Serializa carrinho em JSON
           │    │
           │    ├─ carrinhoItems = [
           │    │    {nome: "Camisa", preco: 89.90, qtd: 2},
           │    │    {nome: "Calça", preco: 129.90, qtd: 1}
           │    │  ]
           │    │
           │    └─ Total = (89.90*2) + 129.90 = 309.70
           │       Desconto (10%) = 30.97
           │       Final = 278.73
           │
           ▼ 3. POST /api/vendas
┌──────────────────────────────┐
│   API (Node.js + Express)    │
│                              │
│ 4. Recebe requisição         │
│ 5. Valida token JWT          │
│ 6. Verifica estoque          │
│                              │
│ FOR EACH produto no carrinho │
│   - estoque_atual -= qtd     │
│   - Valida estoqueMin        │
│   - Se < 0 → erro            │
│ END FOR                       │
│                              │
│ 7. Cria registro em DB       │
│ 8. Auto-gera nota fiscal     │
└──────────┬───────────────────┘
           │
           ▼ 9. UPDATE products SET estoque = ?
┌──────────────────────────────┐
│   Banco de Dados (SQLite)    │
│                              │
│ 10. Atualiza estoque:        │
│     Camisa: 50 → 48          │
│     Calça:  30 → 29          │
│                              │
│ 11. Insere venda             │
│ 12. Insere nota fiscal       │
└──────────┬───────────────────┘
           │
           ▼ 13. Response: {id: 1, ...}
┌─────────────────────┐
│ Frontend (Browser)  │
│                     │
│ 14. Atualiza telas: │
│     - clearCarrinho │
│     - renderVendas()│
│     - renderNotas() │
│     - Alert: OK     │
└─────────────────────┘
```

---

## 🔐 Fluxo de Autenticação

```
┌─────────────────────────────┐
│  1. Usuário tenta login     │
│     Email + Senha           │
└──────────┬──────────────────┘
           │
           ▼ 2. POST /api/login
┌──────────────────────────────┐
│   Servidor Node.js           │
│                              │
│ 3. Hash da senha (bcrypt)    │
│    entrada = "senha123"      │
│    hash    = "$2b$10$..."    │
│                              │
│ 4. Compara com BD            │
│    SELECT user WHERE email   │
│    bcrypt.compare()          │
│                              │
│    ✓ Match → Gera JWT        │
│    ✗ Falha → Error 401       │
│                              │
│ 5. Cria JWT Token:           │
│    - header: {alg, typ}      │
│    - payload: {id, email}    │
│    - signature: hash         │
│    - expira em: 12 horas     │
│                              │
│ 6. Retorna token + user info │
└──────────┬───────────────────┘
           │
           ▼ 7. Response
┌──────────────────────────────┐
│ Frontend armazena:           │
│                              │
│ localStorage.token =         │
│   "eyJhbGciOiJIUzI1NiI..."   │
│                              │
│ localStorage.user = {        │
│   id: 1,                     │
│   nome: "João",              │
│   type: "admin"              │
│ }                            │
└──────────┬───────────────────┘
           │
           ▼ 8. Próximas requisições
┌──────────────────────────────┐
│ Header em cada request:      │
│                              │
│ Authorization:               │
│   Bearer eyJhbGciOi...       │
│                              │
│ Servidor valida JWT:         │
│ ✓ Válido → Continua          │
│ ✗ Expirado → Error 401       │
│ ✗ Inválido → Error 401       │
└──────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Styling (Dark/Light theme)
- **JavaScript Vanilla** - Sem dependências externas
- **Chart.js** - Gráficos (dashboard)
- **LocalStorage API** - Persistência local

### Backend
- **Node.js 16+** - Runtime JavaScript servidor
- **Express.js 4.x** - Framework web
- **Sequelize 6.x** - ORM para banco dados
- **SQLite3** - Banco de dados relacional
- **bcrypt** - Hash de senhas
- **jsonwebtoken** - JWT para autenticação
- **body-parser** - Parsing JSON
- **cors** - Cross-Origin Resource Sharing

### DevOps
- **npm** - Gerenciador de pacotes
- **Git** - Versionamento
- **GitHub** - Repositório remoto

---

## 🔒 Camadas de Segurança

### 1. Autenticação
```javascript
const token = jwt.sign(
  { id: user.id, email: user.email, type: user.role },
  JWT_SECRET,
  { expiresIn: '12h' }
);
```

### 2. Validação de Token
```javascript
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Não autenticado' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
});
```

### 3. Hashing de Senha
```javascript
const hash = bcrypt.hashSync(senha, 10);
// Armazenar hash, NUNCA a senha em texto plano
```

### 4. Validação de CORS
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://outletpro.com'],
  credentials: true
}));
```

### 5. Validação de Entrada
```javascript
if (!cliente || cliente.trim() === '') {
  return res.status(400).json({ error: 'Cliente obrigatório' });
}

if (cpf && cpf.replace(/\D/g, '').length !== 11) {
  return res.status(400).json({ error: 'CPF inválido' });
}
```

---

## 📊 Diagrama de Casos de Uso

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌──────────┐          ┌─────────────┐            │
│  │ Master   │          │   Admin     │            │
│  │ User     │          │   User      │            │
│  └────┬─────┘          └──────┬──────┘            │
│       │                       │                    │
│       │   Gerencia            │                    │
│       ├──► Empresas      ┌────┴────────────────┐  │
│       │   Usuários       │ Gerencia:            │  │
│       │   Contratos      │ - Usuários           │  │
│       │                  │ - Produtos           │  │
│       │                  │ - Relatórios         │  │
│       │                  └────┬────────────────┘  │
│       │                       │                    │
│       └───────────────────────┼──────────────────┐ │
│                               │                  │ │
│                    ┌──────────▼──────────┐       │ │
│                    │   Seller User       │       │ │
│                    │                     │       │ │
│                    │ Registra:           │       │ │
│                    │ - Vendas            │       │ │
│                    │ - Notas Fiscais     │       │ │
│                    └─────────────────────┘       │ │
│                                                   │ │
└─────────────────────────────────────────────────┘ │
```

---

## 🚀 Fluxo de Deployment

### Desenvolvimento (Local)
```bash
npm install
npm start
# Acessa http://localhost:3000
# Database: ./database.sqlite (auto-criado)
```

### Produção (Linux/Docker)

**Option 1: DigitalOcean Droplet**
```bash
ssh root@seu_ip
cd /var/www/outletpro
npm install --production
NODE_ENV=production npm start
# PM2 para manter serviço ativo
pm2 start server/index.js --name outletpro
```

**Option 2: Heroku**
```bash
heroku create seu-app
git push heroku main
# App roda em https://seu-app.herokuapp.com
```

**Option 3: Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📈 Performance

### Recomendações
- **Cache**: Implementar Redis para sessões
- **CDN**: Servir assets estáticos via CloudFlare
- **DB**: Indexar colunas frequentemente consultadas
  ```sql
  CREATE INDEX idx_company_id ON sales(company_id);
  CREATE INDEX idx_user_email ON users(email);
  ```

### Monitoramento
- **PM2 Plus**: Monitor de processos Node.js
- **DataDog/NewRelic**: APM
- **CloudWatch**: Logs e métricas

---

## 🔄 Versionamento

```
Semântico: MAJOR.MINOR.PATCH
v1.0.0 - Release inicial
v1.1.0 - Novo recurso (relatorios PDF)
v1.1.1 - Bug fix
v2.0.0 - Breaking changes
```

---

## 📝 Roadmap Técnico

### v1.0.0 ✅ (Release Atual)
- [x] Autenticação JWT
- [x] Gestão de produtos/estoque
- [x] Registro de vendas c/ carrinho
- [x] Notas fiscais automáticas
- [x] Multi-empresa
- [x] Múltiplos usuários

### v1.1.0 (Q2 2024)
- [ ] Relatórios PDF exportáveis
- [ ] Dashboard com gráficos avançados
- [ ] Integração PIX/Stripe
- [ ] Backup automático
- [ ] Notificações por email

### v2.0.0 (Q3 2024)
- [ ] Aplicativo Mobile (React Native)
- [ ] Sincronização em nuvem
- [ ] Marketplace de integrações
- [ ] Analytics com IA

---

## 🆘 Troubleshooting

### Erro: "Port 3000 already in use"
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess
Stop-Process -Id PID
```

### Erro: "Database locked"
- SQLite tem limite de escrita simultânea
- Solução: Usar PostgreSQL em produção

### Erro: "CORS policy: No 'Access-Control-Allow-Origin'"
- Verificar CORS headers em `index.js`
- Adicionar domínio à lista whitelist

---

## 📞 Support

- Issues: https://github.com/seu-usuario/outletpro/issues
- Email: suporte@outletpro.com
- Docs: https://outletpro.com/docs
