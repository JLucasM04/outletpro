# OutletPro - Documentação de API e Backend

## 📋 Índice
1. [Estrutura de Dados](#estrutura-de-dados)
2. [Autenticação](#autenticação)
3. [Endpoints de API](#endpoints-de-api)
4. [Integração Frontend-Backend](#integração-frontend-backend)

---

## 🗂️ Estrutura de Dados

### Usuários
```json
{
  "id": 0,
  "nome": "João Silva",
  "user": "joao.silva",
  "senha": "hashed_password",
  "email": "joao@empresa.com",
  "company_id": 1,
  "type": "admin|seller|master",
  "status": "Ativo|Inativo",
  "createdAt": "2026-03-01T10:00:00Z"
}
```

### Empresas
```json
{
  "id": 1,
  "nome": "Loja ABC",
  "cnpj": "12.345.678/0001-99",
  "responsible": "João da Silva",
  "email": "empresa@abc.com",
  "phone": "(11) 99999-9999",
  "createdAt": "2026-03-01T10:00:00Z"
}
```

### Produtos
```json
{
  "id": 1,
  "company_id": 1,
  "nome": "Tênis Cross",
  "marca": "Nike",
  "preco": 299.90,
  "estoque": 45,
  "estoqueMin": 10
}
```

### Vendas
```json
{
  "id": 1,
  "company_id": 1,
  "cliente": "Maria Silva",
  "produto": "Tênis Cross",
  "qtd": 2,
  "valor": 599.80,
  "status": "Concluída",
  "data": "01/03/2026",
  "createdAt": "2026-03-01T14:30:00Z"
}
```

### Notas Fiscais
```json
{
  "id": 1,
  "company_id": 1,
  "cliente": "Maria Silva",
  "valor": 599.80,
  "data": "01/03/2026",
  "hora": "14:30:25",
  "numero_nfe": "123456789",
  "status": "Emitida"
}
```

### Vendedores
```json
{
  "id": 1,
  "company_id": 1,
  "nome": "Pedro Oliveira",
  "user": "pedro.oliveira",
  "email": "pedro@enterprise.com",
  "status": "Ativo"
}
```

---

## 🔐 Autenticação

### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "user": "master",
  "senha": "123"
}

Response (200):
{
  "id": 0,
  "nome": "Master Admin",
  "user": "master",
  "email": "master@outletpro.com",
  "type": "master",
  "status": "Ativo",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (401):
{
  "error": "Usuário ou senha incorretos"
}
```

### Verificar Sessão
```
GET /api/auth/verify
Headers:
  Authorization: Bearer token_aqui

Response (200):
{
  "valid": true,
  "user": {...}
}

Response (401):
{
  "valid": false,
  "error": "Token inválido ou expirado"
}
```

### Logout
```
POST /api/auth/logout
Headers:
  Authorization: Bearer token_aqui

Response (200):
{
  "success": true
}
```

---

## 🔌 Endpoints de API

### Empresas

#### Listar Empresas
```
GET /api/companies
Headers:
  Authorization: Bearer token_aqui

Response (200):
[
  { id: 1, nome: "Loja ABC", cnpj: "...", responsible: "...", email: "..." },
  { id: 2, nome: "Loja XYZ", cnpj: "...", responsible: "...", email: "..." }
]
```

#### Criar Empresa (Master Only)
```
POST /api/companies
Headers:
  Authorization: Bearer token_aqui
Content-Type: application/json

Body:
{
  "nome": "Loja Nova",
  "cnpj": "12.345.678/0001-99",
  "responsible": "João Silva",
  "email": "empresa@novo.com",
  "phone": "(11) 99999-9999",
  "adminUser": "admin_novo",
  "adminPass": "senha123"
}

Response (201):
{
  "id": 3,
  "nome": "Loja Nova",
  "cnpj": "...",
  "...": "..."
}
```

#### Deletar Empresa (Master Only)
```
DELETE /api/companies/:id
Headers:
  Authorization: Bearer token_aqui

Response (200):
{
  "success": true,
  "message": "Empresa deletada"
}
```

---

### Vendas

#### Listar Vendas da Empresa
```
GET /api/companies/:companyId/vendas
Headers:
  Authorization: Bearer token_aqui

Response (200):
[
  { id: 1, cliente: "Maria Silva", produto: "Tênis", qtd: 2, valor: 599.80, status: "Concluída", data: "01/03/2026" },
  { id: 2, cliente: "Pedro Oliveira", produto: "Jaqueta", qtd: 1, valor: 189.90, status: "Concluída", data: "01/03/2026" }
]
```

#### Criar Venda
```
POST /api/companies/:companyId/vendas
Headers:
  Authorization: Bearer token_aqui
Content-Type: application/json

Body:
{
  "cliente": "Maria Silva",
  "produto": "Tênis Cross",
  "qtd": 2,
  "valor": 599.80
}

Response (201):
{
  "id": 3,
  "cliente": "Maria Silva",
  "produto": "Tênis Cross",
  "qtd": 2,
  "valor": 599.80,
  "status": "Concluída",
  "data": "01/03/2026"
}
```

#### Deletar Venda
```
DELETE /api/companies/:companyId/vendas/:vendaId
Headers:
  Authorization: Bearer token_aqui

Response (200):
{
  "success": true
}
```

---

### Produtos

#### Listar Produtos
```
GET /api/companies/:companyId/produtos
Headers:
  Authorization: Bearer token_aqui

Response (200):
[
  { id: 1, nome: "Tênis Cross", marca: "Nike", preco: 299.90, estoque: 45, estoqueMin: 10 },
  { id: 2, nome: "Jaqueta Wind", marca: "Adidas", preco: 189.90, estoque: 8, estoqueMin: 10 }
]
```

#### Criar Produto
```
POST /api/companies/:companyId/produtos
Headers:
  Authorization: Bearer token_aqui
Content-Type: application/json

Body:
{
  "nome": "Tênis Cross",
  "marca": "Nike",
  "preco": 299.90,
  "estoque": 45,
  "estoqueMin": 10
}

Response (201):
{
  "id": 1,
  "nome": "Tênis Cross",
  "marca": "Nike",
  "preco": 299.90,
  "estoque": 45,
  "estoqueMin": 10
}
```

#### Atualizar Estoque
```
PATCH /api/companies/:companyId/produtos/:produtoId/estoque
Headers:
  Authorization: Bearer token_aqui
Content-Type: application/json

Body:
{
  "quantidade": 10,
  "operacao": "adicionar|remover"
}

Response (200):
{
  "id": 1,
  "nome": "Tênis Cross",
  "estoque": 55
}
```

---

### Notas Fiscais

#### Listar Notas
```
GET /api/companies/:companyId/notas
Headers:
  Authorization: Bearer token_aqui

Response (200):
[
  { id: 1, cliente: "Maria Silva", valor: 599.80, data: "01/03/2026", numero_nfe: "123456789", status: "Emitida" }
]
```

#### Emitir Nota Fiscal
```
POST /api/companies/:companyId/notas
Headers:
  Authorization: Bearer token_aqui
Content-Type: application/json

Body:
{
  "cliente": "Maria Silva",
  "valor": 599.80,
  "vendaId": 1
}

Response (201):
{
  "id": 1,
  "cliente": "Maria Silva",
  "valor": 599.80,
  "numero_nfe": "123456789",
  "status": "Emitida",
  "data": "01/03/2026"
}
```

---

### Vendedores

#### Listar Vendedores
```
GET /api/companies/:companyId/vendedores
Headers:
  Authorization: Bearer token_aqui

Response (200):
[
  { id: 1, nome: "Pedro Oliveira", user: "pedro.oliveira", email: "pedro@empresa.com", status: "Ativo" }
]
```

#### Adicionar Vendedor
```
POST /api/companies/:companyId/vendedores
Headers:
  Authorization: Bearer token_aqui
Content-Type: application/json

Body:
{
  "nome": "Pedro Oliveira",
  "user": "pedro.oliveira",
  "email": "pedro@empresa.com",
  "senha": "senha123"
}

Response (201):
{
  "id": 1,
  "nome": "Pedro Oliveira",
  "user": "pedro.oliveira",
  "email": "pedro@empresa.com",
  "status": "Ativo"
}
```

#### Remover Vendedor
```
DELETE /api/companies/:companyId/vendedores/:vendedorId
Headers:
  Authorization: Bearer token_aqui

Response (200):
{
  "success": true
}
```

---

## 🔄 Integração Frontend-Backend

### 1. Modificar DataManager

Atualmente, o frontend usa `localStorage`. Para integrar com backend, modifique a classe `DataManager`:

```javascript
class DataManager {
    static async getCompanies() {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('/api/companies', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }

    static async saveCompanies(data) {
        // Para backend, você criaria novo item via POST
        // const response = await fetch('/api/companies', { 
        //     method: 'POST', 
        //     body: JSON.stringify(data) 
        // });
    }

    static async getProdutos(companyId) {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/api/companies/${companyId}/produtos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }

    // ... similares para outros recursos
}
```

### 2. Modificar Autenticação

Na função `handleLogin` do `index.html`:

```javascript
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: username, senha: password })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('op_session_user', JSON.stringify(data));
            
            // Redirecionar conforme tipo de usuário
            if (data.type === 'master') {
                window.location.href = 'outlet-system_3.html?view=master-companies';
            } else {
                window.location.href = 'outlet-system_3.html?view=dashboard';
            }
        } else {
            showError('Falha na autenticação');
        }
    } catch (e) {
        showError('Erro de conexão: ' + e.message);
    }
}
```

### 3. Adições ao Header de Requisições

Sempre incluir o token:

```javascript
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
};
```

---

## 🚀 Stack Recomendado para Backend

### Node.js + Express + PostgreSQL

```javascript
// server.js
const express = require('express');
const postgres = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

// Middleware de autenticação
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Login
app.post('/api/auth/login', async (req, res) => {
    const { user, senha } = req.body;
    
    // Buscar usuário no banco
    const result = await db.query('SELECT * FROM users WHERE user = $1', [user]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    
    const userData = result.rows[0];
    const validPassword = await bcrypt.compare(senha, userData.senha);
    
    if (!validPassword) return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    
    const token = jwt.sign({ id: userData.id, type: userData.type }, process.env.JWT_SECRET);
    res.json({ ...userData, token });
});

// Listar empresas (Master only)
app.get('/api/companies', authenticateToken, async (req, res) => {
    if (req.user.type !== 'master') return res.sendStatus(403);
    
    const result = await db.query('SELECT * FROM companies');
    res.json(result.rows);
});

// Criar empresa (Master only)
app.post('/api/companies', authenticateToken, async (req, res) => {
    if (req.user.type !== 'master') return res.sendStatus(403);
    
    const { nome, cnpj, responsible, email, phone, adminUser, adminPass } = req.body;
    
    // Validações
    if (!nome || !cnpj || !responsible || !adminUser) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }
    
    try {
        // Inserir empresa
        const companyResult = await db.query(
            'INSERT INTO companies (nome, cnpj, responsible, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, cnpj, responsible, email, phone]
        );
        
        // Criar usuário admin da empresa
        const hashedPass = await bcrypt.hash(adminPass, 10);
        await db.query(
            'INSERT INTO users (nome, user, senha, email, company_id, type, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [responsible, adminUser, hashedPass, email, companyResult.rows[0].id, 'admin', 'Ativo']
        );
        
        res.status(201).json(companyResult.rows[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => console.log('Backend rodando em port 3000'));
```

**Banco de Dados (PostgreSQL):**

```sql
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    responsible VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    user VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(200),
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    type VARCHAR(50) CHECK (type IN ('master', 'admin', 'seller')),
    status VARCHAR(50) DEFAULT 'Ativo',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    nome VARCHAR(200) NOT NULL,
    marca VARCHAR(100),
    preco DECIMAL(10, 2),
    estoque INT DEFAULT 0,
    estoque_min INT DEFAULT 5
);

CREATE TABLE vendas (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    cliente VARCHAR(200),
    produto VARCHAR(200),
    qtd INT,
    valor DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'Concluída',
    data DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notas_fiscais (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    cliente VARCHAR(200),
    valor DECIMAL(10, 2),
    numero_nfe VARCHAR(50) UNIQUE,
    data DATE,
    hora TIME,
    status VARCHAR(50) DEFAULT 'Emitida'
);
```

---

## ✅ Checklist de Integração

- [ ] Criar backend com Node.js/Express
- [ ] Configurar banco de dados (PostgreSQL)
- [ ] Implementar autenticação JWT
- [ ] Criar endpoints de CRUD para: Empresas, Usuários, Produtos, Vendas, Notas
- [ ] Implementar validação e tratamento de erros
- [ ] Modificar DataManager do frontend para usar API
- [ ] Implementar rate limiting
- [ ] Adicionar testes de API
- [ ] Configurar CORS
- [ ] Deploy em produção

---

## 📞 Suporte

Para dúvidas ou contribuições, favor contatar a equipe de desenvolvimento.
