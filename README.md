# OutletPro - Sistema de Gestão de Vendas

## Começar

### Opção 1: Usar sem servidor (recomendado para desenvolvimento rápido)

1. Abra `index.html` num navegador
2. Faça login com o usuário padrão `admin`. Senhas de demonstração foram neutralizadas neste repositório — se necessário, restaure ou defina uma senha via interface de administração.
3. Os dados ficam armazenados localmente no navegador

### Opção 2: Com servidor Node.js (produção)

#### Pré-requisitos
- Node.js 16+ instalado

#### Instalação

```powershell
# Instalar dependências
cd server
npm install

# Iniciar servidor
npm start
```

O servidor vai rodar em `http://localhost:3000`

#### Criar primeira empresa

1. Acesse `http://localhost:3000/admin.html`
2. Preencha os dados:
   - Nome: ex. "Minha Loja"
   - Slug: ex. "minha-loja" 
   - Email admin: ex. "adm@minha-loja.com"
   - Senha: ex. "SUA_SENHA_SEGURA"
3. Clique em "Criar"

#### Fazer login

1. Acesse `http://localhost:3000/login.html`
2. Digite o e-mail e senha criados
3. Você entre no sistema multi-tenant

## Estrutura

```
outletpro/
  ├── index.html           (dashboard principal)
  ├── login.html          (página de login)
  ├── admin.html          (criar empresas)
  ├── outlet-system_3.html (versão alternativa)
  └── server/
      ├── index.js        (API Express)
      ├── models.js       (Sequelize models)
      ├── config.js       (conexão BD)
      └── package.json    (dependências)
```

## Funcionalidades

- ✅ Dashboard com KPIs
- ✅ Gestão de vendas
- ✅ Catálogo de produtos
- ✅ Controle de estoque
- ✅ Gerenciamento de vendedores
- ✅ Multi-empresa (com servidor)
- ✅ Isolamento de dados por tenant
- ✅ Autenticação com JWT

## Próximos passos

1. Expandir rotas API (POST/PUT/DELETE para produtos, vendas, etc.)
2. Integrar com banco dados real (Postgres, MySQL, etc.)
3. Adicionar dashboard de relatórios
4. Implementar envio de e-mails
5. Deploy na cloud (Heroku, Azure, AWS, etc.)
