# Changelog - OutletPro

Todas as mudanças notáveis desse projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto segue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2024-03-01

### ✨ Adicionado
- **Autenticação JWT** - Sistema seguro de login com JWT tokens (12h expiry)
- **Gestão de Empresas** - Multi-tenant com suporte a múltiplas lojas
- **Gestão de Usuários** - Roles: Master, Admin, Seller com permissões granulares
- **Gestão de Produtos** - CRUD completo com controle de estoque
- **Gestão de Vendas** - Carrinho de compras com múltiplos produtos
- **Notas Fiscais** - Geração automática com CPF/CNPJ
- **Desconto Percentual** - Aplique descontos flexíveis por venda
- **Dashboard** - Gráficos Chart.js com KPIs principais
- **Dark/Light Theme** - Toggle entre temas escuro e claro
- **Validação de CPF** - Formato 11 dígitos validado
- **API REST** - 15+ endpoints para integração
- **Documentação** - README, INSTALACAO, API_DOCS, ARQUITETURA

### 🔧 Técnico
- Backend: Node.js 16+ com Express.js
- Database: SQLite3 com Sequelize ORM
- Frontend: HTML5/CSS3/JavaScript Vanilla
- Auth: bcrypt para hashing de senhas
- Formato de dados: JSON para armazenamento em DB

### 🎨 Design
- Cor principal: #7c6dff (roxo)
- Fonte: Syne + DM Sans
- Dark theme como padrão
- Interface responsiva

---

## [1.1.0] - Planejado (Q2 2024)

### 🔜 Planejado
- [ ] Export de relatórios em PDF
- [ ] Integração PIX/Stripe
- [ ] Backup automático em nuvem
- [ ] Sistema de notificações (Email/WhatsApp)
- [ ] Filtros avançados em vendas
- [ ] Histórico de alterações
- [ ] Melhoria de perormance com indexação DB

---

## [2.0.0] - Planejado (Q3 2024)

### 🚀 Planejado
- [ ] Aplicativo Mobile (React Native)
- [ ] Sincronização em nuvem (Firebase)
- [ ] Inteligência Artificial para previsões de estoque
- [ ] Marketplace de integrações
- [ ] API pública autenticada

---

## Como reportar mudanças

Para propor mudanças para este changelog:
1. Abra uma issue ou PR
2. Descreva a mudança
3. Faça referência a issues/PRs relacionadas

---

## Versionamento

Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR** version (1.0.0) = breaking changes
- **MINOR** version (1.1.0) = new features, backward compatible
- **PATCH** version (1.0.1) = bug fixes

---

## Release Process

1. Atualizar versão em `package.json`
2. Atualizar este CHANGELOG.md
3. Criar tag Git: `git tag -a v1.0.0 -m "Version 1.0.0"`
4. Push: `git push origin main --tags`
5. GitHub detecta automaticamente e cria release

---

## Links

- [Roadmap Técnico](./ARQUITETURA.md#-roadmap-técnico)
- [API Documentation](./API_DOCS.md)
- [Installation Guide](./INSTALACAO.md)
