# MER - Modelo Entidade-Relacionamento

## 1. Entidades

### Cliente

**Definição:** Representa as pessoas que realizam pedidos no sistema de e-commerce.

### Pedido

**Definição:** Representa uma compra realizada por um cliente, contendo os produtos selecionados.

### Produto

**Definição:** Representa as camisetas e acessórios disponíveis na loja.

### Categoria

**Definição:** Representa a classificação utilizada para organizar os produtos da loja.

### ItemPedido

**Definição:** Representa um produto pertencente a um determinado pedido, permitindo registrar a quantidade e o preço do produto no momento da compra.

---

## 2. Relacionamentos e Cardinalidades

### Cliente e Pedido

[Cliente] (1) <realiza> (N) [Pedido]

**Explicação:** Um Cliente pode realizar vários Pedidos, mas cada Pedido pertence a apenas um Cliente.

### Pedido e Produto

[Pedido] (N) <contém> (N) [Produto]

**Explicação:** Um Pedido pode conter vários Produtos e um Produto pode estar presente em vários Pedidos. Para representar essa relação no banco de dados, utiliza-se a entidade associativa ItemPedido.

### Categoria e Produto

[Categoria] (1) <possui> (N) [Produto]

**Explicação:** Uma Categoria pode possuir vários Produtos, mas cada Produto pertence a uma única Categoria.

### Pedido e ItemPedido

[Pedido] (1) <possui> (N) [ItemPedido]

**Explicação:** Um Pedido pode possuir vários itens, sendo que cada ItemPedido pertence a um único Pedido.

### Produto e ItemPedido

[Produto] (1) <participa> (N) [ItemPedido]

**Explicação:** Um Produto pode aparecer em vários ItensPedido de diferentes pedidos, mas cada ItemPedido representa apenas um Produto.

---

## 3. Sugestão de Atributos

### Cliente

- **id_cliente (PK)** — Identificador único do cliente.
- nome — Nome do cliente.
- email — E-mail do cliente.
- telefone — Telefone do cliente.

### Pedido

- **id_pedido (PK)** — Identificador único do pedido.
- data_pedido — Data em que o pedido foi realizado.
- status — Situação atual do pedido.

### Produto

- **id_produto (PK)** — Identificador único do produto.
- nome — Nome do produto.
- descricao — Descrição do produto.
- preco — Preço do produto.
- estoque — Quantidade disponível do produto.
- tamanho — Tamanho do produto, quando aplicável.
- cor — Cor do produto.
- id_categoria — Referência à categoria do produto.

### Categoria

- **id_categoria (PK)** — Identificador único da categoria.
- nome — Nome da categoria.
- descricao — Descrição da categoria.

### ItemPedido

- **id_pedido (PK/FK)** — Identificador do pedido ao qual o item pertence.
- **id_produto (PK/FK)** — Identificador do produto presente no pedido.
- quantidade — Quantidade do produto no pedido.
- preco_unitario — Preço unitário do produto no momento do pedido.
- subtotal (derivado) — Resultado da multiplicação da quantidade pelo preço unitário.

---

## 4. Diagrama Entidade e Relacionamento (DER)

O Diagrama Entidade e Relacionamento (DER) será desenvolvido utilizando o draw.io e representa visualmente as entidades, seus atributos, relacionamentos e respectivas cardinalidades.
