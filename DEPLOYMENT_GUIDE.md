# OutletPro - Guia de Implementação e Deployment

## 📋 Índice
1. [Ambiente de Desenvolvimento](#ambiente-de-desenvolvimento)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Instalação e Configuração](#instalação-e-configuração)
4. [Testes](#testes)
5. [Deployment](#deployment)
6. [Monitoramento](#monitoramento)

---

## 🛠️ Ambiente de Desenvolvimento

### Requisitos Mínimos
- **Node.js** v16+ 
- **PostgreSQL** v12+
- **npm** ou **yarn**
- **Git**
- **Navegador moderno** (Chrome, Firefox, Edge)

### Instalação Local

#### 1. Clone o repositório
```bash
git clone https://github.com/seu-repo/outletpro.git
cd outletpro
```

#### 2. Setup do Frontend
```bash
# Copiar arquivos estáticos
cp index.html public/
cp outlet-system_3.html public/

# Servir com Python (desenvolvimento rápido)
python -m http.server 8000

# Ou com Node.js
npm install -g http-server
http-server public -p 8000
```

#### 3. Setup do Backend

```bash
# Criar pasta do backend
mkdir backend
cd backend

# Inicializar Node.js
npm init -y

# Instalar dependências
npm install express pg bcryptjs jsonwebtoken cors dotenv

# Criar arquivo .env
echo "DATABASE_URL=postgresql://user:password@localhost:5432/outletpro
JWT_SECRET=sua_chave_secreta_aqui
NODE_ENV=development
PORT=3000" > .env

# Criar estrutura de pastas
mkdir -p src/routes src/controllers src/models src/middleware

# Criar arquivo principal
touch src/server.js
```

---

## 📁 Estrutura do Projeto

```
outletpro/
├── frontend/
│   ├── index.html                    # Login page
│   ├── outlet-system_3.html          # Main dashboard
│   ├── styles/
│   │   └── theme.css                 # Design tokens
│   └── assets/
│       ├── logo.png
│       └── favicon.ico
│
├── backend/
│   ├── src/
│   │   ├── server.js                # Entry point
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT verification
│   │   ├── routes/
│   │   │   ├── auth.js              # Login, logout
│   │   │   ├── companies.js         # Company CRUD
│   │   │   ├── products.js          # Product management
│   │   │   ├── sales.js             # Sales operations
│   │   │   ├── invoices.js          # Invoice generation
│   │   │   └── sellers.js           # Seller management
│   │   ├── controllers/
│   │   │   └── (lógica de negócio)
│   │   ├── models/
│   │   │   └── database.js          # Connection pool
│   │   └── utils/
│   │       ├── validation.js        # Input validation
│   │       └── errors.js            # Error handling
│   ├── migrations/                  # Database schemas
│   ├── seeds/                       # Initial data
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── API_DOCUMENTATION.md         # API reference
│   └── DEPLOYMENT_GUIDE.md          # Este arquivo
│
└── .gitignore
```

---

## 📦 Instalação e Configuração

### Backend Setup Completo

#### 1. Database Setup (PostgreSQL)

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE outletpro;
CREATE USER outletpro WITH PASSWORD 'senha_segura_123';
ALTER USER outletpro CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE outletpro TO outletpro;

# Sair
\q

# Conectar ao banco novo
psql -U outletpro -d outletpro
```

#### 2. Criar Schema do Banco

Execute `backend/migrations/init.sql`:

```sql
-- Companies
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    responsible VARCHAR(200) NOT NULL,
    email VARCHAR(200),
    phone VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    user VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(200) UNIQUE,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    type VARCHAR(20) CHECK (type IN ('master', 'admin', 'seller')) NOT NULL,
    status VARCHAR(20) DEFAULT 'Ativo',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sellers
CREATE TABLE sellers (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    nome VARCHAR(200) NOT NULL,
    user VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(200),
    commission_rate DECIMAL(5, 2) DEFAULT 5.00,
    status VARCHAR(20) DEFAULT 'Ativo',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    nome VARCHAR(200) NOT NULL,
    marca VARCHAR(100),
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT DEFAULT 0,
    estoque_min INT DEFAULT 5,
    sku VARCHAR(100) UNIQUE,
    categoria VARCHAR(100),
    descricao TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sales
CREATE TABLE vendas (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    cliente VARCHAR(200) NOT NULL,
    seller_id INT REFERENCES sellers(id),
    produto VARCHAR(200) NOT NULL,
    produto_id INT REFERENCES produtos(id),
    qtd INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    valor_total DECIMAL(10, 2),
    desconto DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Concluída',
    data DATE,
    hora TIME,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoices
CREATE TABLE notas_fiscais (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    cliente VARCHAR(200) NOT NULL,
    cpf_cnpj VARCHAR(18),
    valor DECIMAL(10, 2) NOT NULL,
    numero_nfe VARCHAR(50) UNIQUE,
    serie INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'Emitida',
    xml_path VARCHAR(500),
    data DATE,
    hora TIME,
    venda_id INT REFERENCES vendas(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_produtos_company ON produtos(company_id);
CREATE INDEX idx_vendas_company ON vendas(company_id);
CREATE INDEX idx_vendas_data ON vendas(data);
CREATE INDEX idx_notas_company ON notas_fiscais(company_id);
CREATE INDEX idx_sellers_company ON sellers(company_id);
```

#### 3. Backend Server

Criar `backend/src/server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
    console.error('Erro no pool de conexão:', err);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Routes (placeholder - implementar nos próximos arquivos)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/invoices', require('./routes/invoices'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    if (err.status) {
        return res.status(err.status).json({ error: err.message });
    }
    
    res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 OutletPro Backend rodando em http://localhost:${PORT}`);
    console.log(`📊 Database: ${process.env.NODE_ENV} environment`);
    console.log(`🔒 JWT Secret configurado: ${'*'.repeat(10)}`);
});

module.exports = app;
```

#### 4. Exemplo de Route (Auth)

Criar `backend/src/routes/auth.js`:

```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Login
router.post('/login', async (req, res) => {
    try {
        const { user, senha } = req.body;

        // Validação
        if (!user || !senha) {
            return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
        }

        // Buscar usuário
        const result = await pool.query(
            'SELECT * FROM users WHERE user = $1 AND status = $2',
            [user, 'Ativo']
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuário ou senha incorretos' });
        }

        const userData = result.rows[0];

        // Verificar senha
        const validPassword = await bcrypt.compare(senha, userData.senha);
        if (!validPassword) {
            return res.status(401).json({ error: 'Usuário ou senha incorretos' });
        }

        // Atualizar last_login
        await pool.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [userData.id]
        );

        // Gerar token JWT
        const token = jwt.sign(
            { id: userData.id, type: userData.type, company_id: userData.company_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remover senha da resposta
        delete userData.senha;

        res.json({ ...userData, token });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Logout (opcional - token expira automaticamente)
router.post('/logout', (req, res) => {
    // Blacklist the token or just return success (client removes token)
    res.json({ success: true, message: 'Logout realizado' });
});

module.exports = router;
```

---

## ✅ Testes

### Testes Manuais com cURL

```bash
# 1. Health Check
curl -X GET http://localhost:3000/api/health

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"user":"master","senha":"123"}'

# Response:
# {"id":1,"nome":"Master","user":"master","type":"master","token":"eyJhbGc..."}

# 3. Usar token para próximas requisições
TOKEN="seu_token_aqui"

curl -X GET http://localhost:3000/api/companies \
  -H "Authorization: Bearer $TOKEN"
```

### Testes Automatizados (Jest)

```bash
npm install --save-dev jest supertest

# Criar arquivo de teste
mkdir -p backend/tests
touch backend/tests/auth.test.js
```

`backend/tests/auth.test.js`:
```javascript
const request = require('supertest');
const app = require('../src/server');

describe('Auth Endpoints', () => {
    test('POST /api/auth/login - Success', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ user: 'master', senha: '123' });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('POST /api/auth/login - Invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ user: 'invalid', senha: 'wrong' });
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    });
});
```

Executar:
```bash
npm test
```

---

## 🚀 Deployment

### Opção 1: Heroku

```bash
# 1. Criar conta e instalar Heroku CLI
# 2. Login
heroku login

# 3. Criar app
heroku create outletpro

# 4. Adicionar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 5. Deploy
git push heroku main

# 6. Verificar logs
heroku logs --tail
```

### Opção 2: AWS EC2

```bash
# 1. SSH para instância
ssh -i seu-key.pem ubuntu@seu-ip

# 2. Instalar Node.js e PostgreSQL
sudo apt update
sudo apt install nodejs npm postgresql postgresql-contrib

# 3. Clonar código
git clone https://seu-repo.git

# 4. Instalar dependências
cd backend
npm install

# 5. Configurar .env com credenciais de produção
nano .env

# 6. Iniciar com PM2 (process manager)
sudo npm install -g pm2
pm2 start src/server.js --name "outletpro"
pm2 startup
pm2 save

# 7. Configurar Nginx como reverse proxy
sudo apt install nginx
# ... configurar nginx para portar tráfego 80 → 3000
```

### Opção 3: Docker (Recomendado)

Criar `Dockerfile`:
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

Criar `docker-compose.yml`:
```yaml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: outletpro
      POSTGRES_USER: outletpro
      POSTGRES_PASSWORD: senha_segura
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://outletpro:senha_segura@db:5432/outletpro
      JWT_SECRET: sua_chave_secreta
      NODE_ENV: production
    ports:
      - "3000:3000"

  frontend:
    image: nginx:alpine
    volumes:
      - ./frontend:/usr/share/nginx/html
    ports:
      - "80:80"

volumes:
  postgres_data:
```

Executar:
```bash
docker-compose up -d

# Build apenas backend
docker build -t outletpro-backend ./backend

# Ou pull from registry
docker pull seu-docker-registry/outletpro-backend:latest
```

---

## 📊 Monitoramento

### Logging (Winston)

```bash
npm install winston
```

`backend/src/utils/logger.js`:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'outletpro-backend' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;
```

### Monitoramento de Performance

```bash
npm install pm2 pm2-logrotate

pm2 install pm2-logrotate
pm2 logs outletpro
pm2 monit
```

### Alertas com New Relic (Opcional)

```bash
npm install newrelic
```

Adicionar no início de `server.js`:
```javascript
require('newrelic');
```

---

## 🔒 Segurança

- [ ] Todas as senhas em bcrypt (salt rounds ≥ 10)
- [ ] JWT secrets em variáveis de ambiente
- [ ] HTTPS em produção (SSL/TLS)
- [ ] Rate limiting em endpoints críticos
- [ ] CORS configurado restritivamente
- [ ] Validação de input em todos os endpoints
- [ ] SQL injection prevention com prepared statements
- [ ] Headers de segurança (helmet.js)
- [ ] Environment variables nunca commitidas
- [ ] Logs auditados para compliance

### Adicionar Helmet para Headers de Segurança

```bash
npm install helmet

# Em server.js
const helmet = require('helmet');
app.use(helmet());
```

---

## 📈 Próximos Passos

1. **Integração com NFS-e** para emissão automática de notas fiscais
2. **Dashboard em tempo real** com WebSockets
3. **Sistema de comissões** para vendedores
4. **Integração com sistemas de pagamento** (Stripe, PagSeguro)
5. **App mobile** com React Native
6. **Sincronização offline** com service workers
7. **Backup automático** do banco de dados

---

## 📞 Suporte

- **Issues:** GitHub Issues
- **Email:** suporte@outletpro.com
- **Docs:** https://docs.outletpro.com

---

**Última atualização:** 2026-03-01 | **Versão:** 1.0
