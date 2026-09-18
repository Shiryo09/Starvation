# Guia Completo: Como Adicionar Produtos ao Catálogo — Starvation

Este guia explica detalhadamente como o catálogo da **Starvation** funciona, onde encontrar as **duas novas seções de produtos** já preparadas para você, e o passo a passo de como adicionar quantos itens novos você desejar no futuro.

---

## 📌 1. Como Funciona o Catálogo da Loja

O catálogo da Starvation é **dinâmico e automatizado**:
- Todos os produtos da loja ficam cadastrados na lista `PRODUTOS` dentro do arquivo [`products.js`](products.js).
- O arquivo [`app.js`](app.js) lê essa lista e gera automaticamente os cards no catálogo ([`index.html`](index.html)), o contador de peças, os filtros de categorias, busca em tempo real, os modais de detalhes e a integração com o carrinho de compras.
- **Vantagem:** Você **não precisa duplicar código HTML** para cada produto! Basta adicionar ou editar o item no arquivo JavaScript para que ele apareça imediatamente no site com todas as funcionalidades ativas.

---

## ⚡ 2. As Duas Seções Já Criadas para Você

Para facilitar, já criamos e configuramos **duas seções completas de produtos** prontas para você preencher no final da lista de produtos em [`products.js`](products.js):

### 🏷️ Seção 1: Novo Produto 1
- **Localização:** Linhas ~305 de [`products.js`](products.js)
- **ID Atual:** `STV-CAM-05`
- **Categoria Pré-definida:** `camisetas`
- **Drop:** `drop-01` (*Drop I: Ma'habre*)
- **Tag:** `NOVO`

### 🏷️ Seção 2: Novo Produto 2
- **Localização:** Linhas ~340 de [`products.js`](products.js)
- **ID Atual:** `STV-BON-04`
- **Categoria Pré-definida:** `bones`
- **Drop:** `drop-02` (*Drop II: Eclipse*)
- **Tag:** `NOVO`

> 💡 **Para personalizá-los agora:** Basta abrir o arquivo [`products.js`](products.js), localizar os blocos comentados `[SEÇÃO - NOVO PRODUTO 1]` e `[SEÇÃO - NOVO PRODUTO 2]` e alterar o nome, preço, descrição e caminhos das fotos!

---

## 🛠️ 3. Passo a Passo: Como Adicionar Mais Produtos Depois

Sempre que quiser adicionar um 3º, 4º ou mais produtos ao catálogo, siga os 4 passos abaixo:

### Passo 1: Salve as imagens do produto
1. Prepare as fotos do produto (frente, costas e detalhes).
2. Salve os arquivos na pasta da categoria correspondente:
   - Camisetas: `img/camisetas/`
   - Bonés e gorros: `img/bones/`
   - Acessórios e relíquias: `img/acessorios/`
3. **Dicas para as imagens:**
   - **Proporção recomendada:** `4:5` (ex: `800 x 1000 px` ou `1200 x 1500 px`).
   - **Formatos ideais:** `.jpg` ou `.webp`.
   - **Efeito hover:** A 1ª imagem da lista será a capa do card. A 2ª imagem será exibida quando o cliente passar o mouse por cima do card! Todas as imagens cadastradas estarão disponíveis no modal de detalhes do produto.

---

### Passo 2: Abra o arquivo de produtos
Abra o arquivo [`products.js`](products.js) no seu editor de código.

---

### Passo 3: Adicione um novo bloco no array `PRODUTOS`
Vá até o final da lista `const PRODUTOS = [ ... ];` (logo antes de fechar os colchetes `];`).

Coloque uma vírgula `,` após o produto anterior e cole o seguinte modelo:

```javascript
  {
    id_produto: 'STV-CAM-06',
    nome: 'Nome do Seu Novo Produto',
    id_categoria: 'camisetas',
    id_drop: 'drop-01',
    drop_nome: "Drop I: Ma'habre",
    preco: 169.90,
    estoque: 10,
    cor: 'Preto Estonado',
    tamanhos: ['P', 'M', 'G', 'GG', 'XG'],
    tamanho_selecionado: 'M',
    tag: 'NOVO',
    descricao: 'Descrição temática detalhada sobre a inspiração da peça e corte.',
    detalhes: [
      'Malha premium 100% algodão 260g/m²',
      'Estampa em silk-screen corrosivo de alta durabilidade',
      'Gola canelada reforçada de 3cm',
      'Costura ombro a ombro'
    ],
    imagens: [
      'img/camisetas/sua-foto-frente.jpg',
      'img/camisetas/sua-foto-costas.jpg',
      'img/camisetas/sua-foto-detalhe.jpg'
    ]
  }
```

---

### Passo 4: Salve o arquivo e atualize o site
1. Salve o arquivo [`products.js`](products.js) (`Ctrl + S`).
2. Abra ou recarregue a página [`index.html`](index.html) no navegador (`F5`).
3. O novo produto já estará visível no catálogo, com filtros de categoria, busca e modal funcionando!

---

## 📖 4. Dicionário de Campos do Produto

| Campo | Tipo | Exemplo | Descrição |
| :--- | :--- | :--- | :--- |
| `id_produto` | Texto | `'STV-CAM-06'` | Identificador único do produto. Nunca repita o mesmo ID. |
| `nome` | Texto | `'Camiseta Dark Omen'` | Nome da peça exibido no card e no modal. |
| `id_categoria` | Texto | `'camisetas'` | Deve ser exatamente `'camisetas'`, `'bones'` ou `'acessorios'`. |
| `id_drop` | Texto | `'drop-01'` | Identificador do drop (`'drop-01'` para Ma'habre ou `'drop-02'` para Eclipse). |
| `drop_nome` | Texto | `"Drop I: Ma'habre"` | Nome amigável do drop que aparece no selo do card. |
| `preco` | Número | `159.90` | Preço em reais. Use **ponto** para os centavos (nunca use vírgula ou `R$`). |
| `estoque` | Número | `15` | Quantidade disponível. Se for $\le 6$, exibirá o aviso *"Restam X"*. |
| `cor` | Texto | `'Preto Vintage'` | Nome descritivo da cor exibido no topo do card. |
| `tamanhos` | Lista | `['P', 'M', 'G', 'GG']` | Lista com os botões de tamanhos disponíveis. Para bonés/anéis use `['Único']`. |
| `tamanho_selecionado` | Texto | `'M'` | Qual tamanho virá pré-selecionado ao abrir o card. |
| `tag` | Texto | `'NOVO'` | Selo exibido no card (ex: `'NOVO'`, `'DROP ATIVO'`, `'DESTAQUE'`, `'ÚLTIMAS PEÇAS'`). |
| `descricao` | Texto | `'Tecido encorpado...'` | Parágrafo explicativo da peça exibido no modal. |
| `detalhes` | Lista | `['100% Algodão', ...]` | Tópicos de características técnicas exibidos no modal. |
| `imagens` | Lista | `['img/...', ...]` | Caminhos relativos das fotos (mínimo 1, recomendado 2 a 3). |

---

## 📋 5. Modelos Prontos por Categoria (Copiar e Colar)

### 👕 Modelo para Camiseta
```javascript
  {
    id_produto: 'STV-CAM-06',
    nome: 'Camiseta Oversized Exemplo',
    id_categoria: 'camisetas',
    id_drop: 'drop-01',
    drop_nome: "Drop I: Ma'habre",
    preco: 159.90,
    estoque: 10,
    cor: 'Preto Carvão',
    tamanhos: ['P', 'M', 'G', 'GG', 'XG'],
    tamanho_selecionado: 'M',
    tag: 'NOVO',
    descricao: 'Modelagem boxy oversized inspirada em dark streetwear.',
    detalhes: [
      'Malha 100% algodão 260g/m²',
      'Silk screen sem toque',
      'Lavagem estonada vintage'
    ],
    imagens: [
      'img/camisetas/sua-camiseta-frente.jpg',
      'img/camisetas/sua-camiseta-costas.jpg',
      'img/camisetas/sua-camiseta-detalhe.jpg'
    ]
  },
```

### 🧢 Modelo para Boné / Gorro
```javascript
  {
    id_produto: 'STV-BON-05',
    nome: 'Dad Hat Exemplo',
    id_categoria: 'bones',
    id_drop: 'drop-02',
    drop_nome: 'Drop II: Eclipse',
    preco: 99.90,
    estoque: 8,
    cor: 'Preto Desbotado',
    tamanhos: ['Único'],
    tamanho_selecionado: 'Único',
    tag: 'DESTAQUE',
    descricao: 'Boné confeccionado em sarja pesada com regulador de latão.',
    detalhes: [
      'Sarja 100% algodão pré-lavada',
      'Bordado frontal em alto relevo',
      'Fecho traseiro em metal oxidado'
    ],
    imagens: [
      'img/bones/seu-bone-frente.jpg',
      'img/bones/seu-bone-lado.jpg',
      'img/bones/seu-bone-costas.jpg'
    ]
  },
```

### 💍 Modelo para Acessório / Relíquia
```javascript
  {
    id_produto: 'STV-ACE-04',
    nome: 'Anel / Colar Exemplo',
    id_categoria: 'acessorios',
    id_drop: 'drop-02',
    drop_nome: 'Drop II: Eclipse',
    preco: 189.90,
    estoque: 5,
    cor: 'Prata Envelhecida',
    tamanhos: ['18', '20', '22', '24'],
    tamanho_selecionado: '20',
    tag: 'JOALHERIA OBSCURA',
    descricao: 'Artefato forjado em liga nobre com pátina envelhecida manual.',
    detalhes: [
      'Prata de Lei 925 com banho envelhecido',
      'Gravação em relevo com runas ancestrais',
      'Acompanha estojo de veludo Starvation'
    ],
    imagens: [
      'img/acessorios/seu-acessorio-frente.jpg',
      'img/acessorios/seu-acessorio-lado.jpg',
      'img/acessorios/seu-acessorio-detalhe.jpg'
    ]
  },
```

---

## ⚠️ 6. Cuidados e Erros Comuns

1. **Vírgula entre os itens:** Cada objeto de produto dentro do array `PRODUTOS` deve terminar com uma vírgula `,` para separá-lo do próximo. Apenas o último item da lista não precisa obrigatoriamente de vírgula.
2. **Formato do Preço:** Escreva sempre como número decimal com ponto: `preco: 149.90` (evite colocar aspas ou escrever `preco: 'R$ 149,90'`).
3. **ID Único:** Certifique-se de que cada produto tenha um `id_produto` diferente (ex: `STV-CAM-05`, `STV-CAM-06`).
4. **Categorias Corretas:** As categorias válidas são exatamente:
   - `'camisetas'`
   - `'bones'`
   - `'acessorios'`
   *(Escrever em minúsculas e sem acento).*
5. **Caminho das Imagens:** Verifique se o nome do arquivo da imagem bate exatamente com o arquivo salvo na pasta `img/` (incluindo letras maiúsculas/minúsculas e extensão `.jpg` ou `.png`).

