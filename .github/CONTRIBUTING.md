# 🤝 Guia de Contribuição - OutletPro

Obrigado por querer contribuir ao OutletPro! Este documento fornece as diretrizes para contribuir ao projeto.

---

## Como Contribuir

### 1. Reportar Bugs

Antes de criar um bug report, verifique se o problema já foi reportado. Se encontrar seu bug descrito, adicione mais contexto ao relatório existente em vez de criar um novo.

**Como fazer um bom bug report:**

1. **Use um título claro e descritivo**
   - ❌ Ruim: "Algo está quebrado"
   - ✅ Bom: "Ao registrar venda, erro 500 quando produto tem estoque 0"

2. **Descreva os passos exatos para reproduzir**
   ```
   1. Faça login como seller
   2. Clique em "Nova Venda"
   3. Adicione produto com estoque zerado
   4. Clique "Salvar"
   ```

3. **Inclua screenshots/videos se aplicável**

4. **Especifique seu ambiente**
   - Node.js version
   - Sistema operacional
   - Browser (se frontend issue)

### 2. Sugerir Enhancements

Abra uma issue com o label `enhancement` descrevendo:

- **O que você quer adicionar?**
- **Por que seria útil?**
- **Exemplo visual ou prototipo (opcional)**

### 3. Pull Requests

**Antes de começar:**

1. Faça fork do repositório
2. Clone seu fork: `git clone https://github.com/seu-usuario/outletpro.git`
3. Crie uma branch: `git checkout -b feature/something-cool`

**Enquanto desenvolve:**

- ✅ Escreva código limpo e bem documentado
- ✅ Siga o estilo de código existente
- ✅ Adicione comentários em lógica complexa
- ✅ Teste suas mudanças localmente
- ✅ Não inclua credenciais ou dados sensíveis

**Ao submeter PR:**

1. Use um título descritivo
   - ✅ "Add CPF field to sales invoices"
   - ❌ "Fix stuff"

2. Descreva o que você faz
   ```
   ## O que foi alterado?
   - Added CPF validation
   - Updated invoice generation
   
   ## Por quê?
   Permite rastrear vendas por cliente
   
   ## Como testar?
   1. Registre venda com CPF
   2. Gere nota fiscal
   3. Verifique CPF na nota
   ```

3. Referencie issues: `Closes #123`

4. Aguarde review

---

## Padrões de Código

### JavaScript

```javascript
// ✅ BOM
function atualizarValorProduto(produtoId) {
  const produto = produtos.find(p => p.id === produtoId);
  if (!produto) return;
  
  const precoField = document.getElementById('preco');
  precoField.value = produto.preco;
}

// ❌ RUIM
function upd(id) {
  let p = produtos.find(x => x.id == id);
  if (p) {
    document.getElementById('preco').value = p.preco;
  }
}
```

**Regras:**
- Use `const` por padrão, `let` quando necessário, nunca `var`
- Nomes descritivos em português (porque é sistema em PT-BR)
- Máximo 80 caracteres por linha
- Use arrow functions para callbacks
- Valide inputs/outputs

### HTML/CSS

```html
<!-- ✅ BOM -->
<div class="venda-form">
  <label for="cliente-input">Cliente:</label>
  <input 
    id="cliente-input" 
    type="text" 
    class="form-input"
    placeholder="Nome do cliente"
    required
  >
</div>

<!-- ❌ RUIM -->
<div>
  <input type="text" value="">
</div>
```

**Regras:**
- IDs em kebab-case
- Classes em kebab-case
- Atributos semanticamente corretos
- Sempre use `for` em labels

### Node.js/Express

```javascript
// ✅ BOM
app.post('/api/vendas', verifyToken, async (req, res) => {
  try {
    const { cliente, cpf, produtos } = req.body;
    
    // Validar
    if (!cliente || !cpf) {
      return res.status(400).json({ error: 'Campos obrigatórios' });
    }
    
    // Processar
    const venda = await Sale.create({ cliente, cpf, produtos });
    
    // Retornar
    res.status(201).json(venda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// ❌ RUIM
app.post('/api/vendas', (req, res) => {
  let venda = new Sale(req.body);
  venda.save();
  res.json(venda);
});
```

**Regras:**
- Use middleware para autenticação
- Sempre valide inputs
- Use try/catch
- Retorne status HTTP apropriados
- Log errors

---

## Estrutura de Commits

```
<tipo>(<escopo>): <mensagem>

<corpo>

<footer>
```

**Tipos:**
- `feat`: Nova feature
- `fix`: Bug fix
- `docs`: Documentação
- `style`: Formatação (sem mudança lógica)
- `refactor`: Restruturação (sem mudança de comportamento)
- `test`: Testes
- `chore`: Dependências, build, etc

**Exemplos:**

```
feat(vendas): adicionar campo CPF
Permite rastrear cliente em vendas. CPF validado formato 11 dígitos.

fix(autenticação): corrigir JWT expiração
Footer: Closes #42
```

---

## Ambiente de Desenvolvimento

### Setup

```bash
# 1. Fork & Clone
git clone https://github.com/seu-usuario/outletpro.git
cd outletpro

# 2. Instalar dependências
cd server
npm install

# 3. Variáveis de ambiente
cp .env.example .env
# Editar .env com suas configs

# 4. Iniciar
npm run dev

# 5. Acessar
# Frontend: http://localhost:3000
# Backend: http://localhost:3000/api
```

### Scripts Disponíveis

```bash
npm start           # Iniciar produção
npm run dev         # Iniciar com nodemon (dev)
npm test            # Rodar testes (quando implementado)
npm run lint        # Verificar linting (quando implementado)
```

---

## Processo de Review

Um maintainer vai revisar seu PR em até 3 dias.

**Pode pedir mudanças se:**
- Código não segue os padrões
- Funcionalidade quebra features existentes
- Falta documentação

**Vai ser mesclado se:**
- ✅ Segue padrões
- ✅ Tem testes ou é bem testado
- ✅ Documentação está clara
- ✅ Sem conflitos com main

---

## Dúvidas?

- Abra uma issue com label `question`
- Email: suporte@outletpro.com
- Discuta em Discussions

---

## Código de Conduta

### Nossa Responsabilidade

Nós nos comprometemos a tornar a participação em nosso projeto uma experiência livre de assédio para todos.

### Expectativas

- Use linguagem respeitosa
- Aceite críticas construtivas
- Foco em discussões técnicas, não pessoais
- Respeite diversidade e inclusão

### Aplicação

Comportamento inaceitável será revisitado por maintainers. Podem resultar em ban temporário ou permanente.

---

Obrigado por contribuir! 🎉
