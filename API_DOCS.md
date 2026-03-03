# 📡 Documentação da API - OutletPro

## 📋 Base URL

```
Desenvolvimento: http://localhost:3000
Produção: https://seu-dominio.com
```

## 🔐 Autenticação

Todas as requisições (exceto `/api/login`) precisam do header:

```http
Authorization: Bearer SEU_JWT_TOKEN
```

### Obter Token

**POST** `/api/login`

```json
{
  "email": "usuario@exemplo.com",
  "password": "sua_senha"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "type": "admin",
    "company_id": 1
  }
}
```

---

## 👥 Autenticação

### Verificar Token

**GET** `/api/auth/verify`

Valida se o token JWT atual é válido.

**Headers:**
```
Authorization: Bearer TOKEN
```

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "nome": "João",
    "type": "admin"
  }
}
```

### Logout

**POST** `/api/auth/logout`

```json
{ "success": true }
```

---

## 🏢 Empresas

### Listar Empresas

**GET** `/api/companies`

Usuários Master veem todas; Admins veem apenas sua empresa.

**Response:**
```json
[
  {
    "id": 1,
    "nome": "Loja Central",
    "cnpj": "12345678000190",
    "responsible": "João Silva",
    "email": "contato@lojacentral.com",
    "phone": "11987654321",
    "slug": "loja-central",
    "createdAt": "2024-03-01",
    "updatedAt": "2024-03-01"
  }
]
```

### Criar Empresa

**POST** `/api/companies`

Apenas Master pode criar.

**Body:**
```json
{
  "nome": "Nova Loja",
  "cnpj": "98765432000123",
  "responsible": "Maria Santos",
  "email": "maria@loja.com",
  "phone": "11998765432",
  "slug": "nova-loja",
  "adminName": "Admin Loja",
  "adminUser": "admin_nova",
  "adminEmail": "admin@loja.com",
  "adminPass": "SenhaSegura123!",
  "contractStart": "2024-03-01",
  "contractEnd": "2025-03-01",
  "modules": ["vendas", "produtos", "relatorios"]
}
```

**Response (201):**
```json
{
  "company": { "id": 2, "nome": "Nova Loja", ... },
  "admin": { "id": 5, "nome": "Admin Loja", ... }
}
```

### Atualizar Empresa

**PUT** `/api/companies/:id`

```json
{
  "nome": "Loja Central Atualizada",
  "email": "novoemail@loja.com"
}
```

### Deletar Empresa

**DELETE** `/api/companies/:id`

Apenas Master. Deleta empresa + usuários + contratos.

```json
{ "success": true }
```

---

## 👤 Usuários

### Listar Usuários

**GET** `/api/users`

Admins veem apenas usuários da sua empresa.

**Response:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "user": "joao.silva",
    "email": "joao@exemplo.com",
    "type": "seller",
    "company_id": 1,
    "status": "Ativo"
  }
]
```

### Criar Usuário

**POST** `/api/users`

```json
{
  "nome": "Novo Vendedor",
  "user": "vendedor1",
  "email": "vendedor@exemplo.com",
  "senha": "SenhaForte123!",
  "type": "seller",
  "company_id": 1,
  "status": "Ativo"
}
```

**Response (201):**
```json
{
  "id": 2,
  "nome": "Novo Vendedor",
  "type": "seller",
  "status": "Ativo"
}
```

### Atualizar Usuário

**PUT** `/api/users/:id`

```json
{
  "nome": "Novo Nome",
  "email": "newemail@exemplo.com",
  "status": "Inativo",
  "senha": "NovaSenha123!"
}
```

### Deletar Usuário

**DELETE** `/api/users/:id`

```json
{ "success": true }
```

---

## 📦 Produtos

### Listar Produtos

**GET** `/api/produtos`

```json
[
  {
    "id": 1,
    "nome": "Camisa Polo",
    "marca": "Nike",
    "preco": 89.90,
    "estoque": 50,
    "estoqueMin": 10,
    "company_id": 1
  }
]
```

### Criar Produto

**POST** `/api/produtos`

```json
{
  "nome": "Tênis Esportivo",
  "marca": "Adidas",
  "preco": 199.90,
  "estoque": 30,
  "estoqueMin": 5,
  "company_id": 1
}
```

### Atualizar Produto

**PUT** `/api/produtos/:id`

```json
{
  "preco": 219.90,
  "estoque": 25
}
```

### Deletar Produto

**DELETE** `/api/produtos/:id`

---

## 💰 Vendas

### Listar Vendas

**GET** `/api/vendas`

```json
[
  {
    "id": 1,
    "cliente": "João da Silva",
    "cpf": "12345678901",
    "produtos": "[{\"nome\":\"Camisa\",\"preco\":89.90,\"qtd\":2}]",
    "qtdTotal": 2,
    "valor": 179.80,
    "desconto": 5,
    "status": "Concluída",
    "data": "2024-03-01",
    "seller_id": 1
  }
]
```

### Criar Venda

**POST** `/api/vendas`

```json
{
  "cliente": "Maria Santos",
  "cpf": "98765432100",
  "seller_id": 1,
  "produtos": [
    {"nome": "Camisa Polo", "preco": 89.90, "qtd": 2}
  ],
  "desconto": 10,
  "valor": 159.82
}
```

**Response (201):**
```json
{
  "id": 1,
  "cliente": "Maria Santos",
  "valor": 159.82,
  "status": "Concluída"
}
```

### Deletar Venda

**DELETE** `/api/vendas/:id`

Restaura estoque automaticamente.

---

## 📄 Notas Fiscais

### Listar Notas

**GET** `/api/notas`

```json
[
  {
    "id": 1,
    "cliente": "Maria Santos",
    "cpf": "98765432100",
    "produtos": "[{\"nome\":\"Camisa\",\"qtd\":2}]",
    "valor": 159.82,
    "desconto": 10,
    "data": "2024-03-01",
    "hora": "14:30:00",
    "venda_id": 1
  }
]
```

### Criar Nota

**POST** `/api/notas`

Normalmente criada automaticamente ao registrar uma venda.

### Imprimir Nota

**GET** `/api/notas/:id/print`

Retorna HTML formatado para impressão.

---

## 💼 Contratos

### Listar Contratos

**GET** `/api/contratos`

```json
[
  {
    "id": 1,
    "company_id": 1,
    "startDate": "2024-03-01",
    "endDate": "2025-03-01",
    "modules": ["vendas", "produtos", "relatorios"],
    "status": "Ativo"
  }
]
```

### Criar Contrato

**POST** `/api/contratos`

```json
{
  "company_id": 1,
  "startDate": "2024-03-01",
  "endDate": "2025-03-01",
  "modules": ["vendas", "produtos", "relatorios"],
  "status": "Ativo"
}
```

---

## 🏪 Vendedores

### Listar Vendedores

**GET** `/api/sellers`

```json
[
  {
    "id": 1,
    "nome": "João Vendedor",
    "email": "joao@exemplo.com",
    "company_id": 1,
    "permissions": ["dashboard", "vendas"]
  }
]
```

### Criar Vendedor

**POST** `/api/sellers`

```json
{
  "nome": "Novo Vendedor",
  "email": "novo@exemplo.com",
  "company_id": 1
}
```

---

## 📊 Configuração

### Obter Config

**GET** `/api/config`

Retorna configurações da empresa logada.

```json
{
  "nome": "Loja Central",
  "slug": "loja-central",
  "branding": { "logo": "...", "cor_principal": "#7c6dff" }
}
```

---

## ✅ Health Check

### Status do Servidor

**GET** `/api/health`

```json
{ "ok": true }
```

---

## 🔄 Root Endpoint

### Verificar Status

**GET** `/`

```json
{
  "message": "Servidor OutletPro está funcionando corretamente",
  "status": "ok"
}
```

---

## ⚠️ Respostas de Erro

### 400 - Bad Request

```json
{ "error": "Campo obrigatório ausente" }
```

### 401 - Não Autenticado

```json
{ "error": "Não autenticado" }
```

### 403 - Sem Permissão

```json
{ "error": "Acesso negado" }
```

### 404 - Não Encontrado

```json
{ "error": "Recurso não encontrado" }
```

### 500 - Erro Servidor

```json
{ "error": "Erro interno do servidor" }
```

---

## 📝 Exemplo Completo: Registrar Venda

```bash
# 1. Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "master@outletpro.com",
    "password": "123456"
  }'

# Response: { "token": "eyJ...", "user": {...} }

# 2. Registrar Venda
curl -X POST http://localhost:3000/api/vendas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJ..." \
  -d '{
    "cliente": "João Silva",
    "cpf": "12345678901",
    "seller_id": 1,
    "produtos": [
      {"nome": "Camisa Polo", "preco": 89.90, "qtd": 2}
    ],
    "desconto": 10,
    "valor": 169.80
  }'
```

---

## 🚀 Rate Limiting (Produção)

Recomendado implementar:
- 100 requisições/minuto para usuários normais
- 1000 requisições/minuto para admins

---

## 📚 Para Mais Informações

- [README.md](./README.md) - Visão geral
- [INSTALACAO.md](./INSTALACAO.md) - Setup
- [Issues](https://github.com/seu-usuario/outletpro/issues) - Suporte
