-- =========================================================================
-- MODELAGEM DE BANCO DE DADOS: NORMALIZAÇÃO (1FN, 2FN e 3FN) E MAPEAMENTO DER->SQL
-- Contexto: Catálogo de Roupas & E-commerce - Starvation Streetwear
-- Inspiração: Dark RPG (Fear & Hunger) e Obras de Kentaro Miura (Berserk)
-- =========================================================================

-- Remove o banco de dados se ele já existir para reiniciar os testes
DROP DATABASE IF EXISTS StarvationDB;

-- Criação e seleção do banco de dados
CREATE DATABASE StarvationDB;
USE StarvationDB;


-- =========================================================================
-- CONCEITO DE NORMALIZAÇÃO DE DADOS
-- "A chave, toda a chave, e nada além da chave!"
-- =========================================================================


-- =========================================================================
-- 1. TABELA CLIENTE (Aplicando 1FN e 3FN)
--
-- CONCEITO DER INICIAL:
-- O Cliente possui Atributo Composto (Endereço de Entrega) e Atributo Multivalorado (E-mail).
--
-- APLICAÇÃO DA 1ª FORMA NORMAL (1FN - ATOMICIDADE):
-- 1. Atributo Composto (Endereço): Foi DESMEMBRADO em suas partes simples e
--    atômicas: logradouro, numero, bairro, cidade, uf e cep.
-- 2. Atributo Multivalorado (E-mail): Um cliente pode ter múltiplos e-mails de contato.
--    Para não violar a 1FN (evitando criar colunas email1, email2 ou concatenar
--    vários e-mails com ponto-e-vírgula em uma única coluna), o e-mail foi isolado
--    na tabela associada 'ClienteEmail'.
--
-- APLICAÇÃO DA 3ª FORMA NORMAL (3FN - ELIMINAÇÃO DE DEPENDÊNCIA TRANSITIVA):
-- 1. O nome do cliente depende DIRETAMENTE da chave primária (idCliente).
-- 2. Não armazenamos informações redundantes que dependam de outros campos não-chave.
-- =========================================================================
CREATE TABLE Cliente (
  -- idCliente: Chave Primária Artificial (Surrogate Key)
  idCliente INT UNSIGNED NOT NULL PRIMARY KEY,

  -- Atributo Simples / Atômico
  nome VARCHAR(125) NOT NULL,

  -- ATRIBUTO COMPOSTO (ENDEREÇO) DESMEMBRADO (1FN):
  -- Todos os campos são atômicos e indivisíveis.
  logradouro VARCHAR(150) NOT NULL,
  numero VARCHAR(10) NOT NULL,
  bairro VARCHAR(60) NOT NULL,
  cidade VARCHAR(60) NOT NULL,
  uf CHAR(2) NOT NULL,
  cep CHAR(8) NOT NULL
);


-- =========================================================================
-- 1.1 TABELA CLIENTE_EMAIL (Solução da 1FN para Atributo Multivalorado)
--
-- CONCEITO:
-- Um cliente pode ter zero, um ou vários e-mails cadastrados.
-- A chave primária é COMPOSTA (idCliente + email) para garantir unicidade
-- e evitar duplicidades para um mesmo usuário.
-- =========================================================================
CREATE TABLE ClienteEmail (
  idCliente INT UNSIGNED NOT NULL,
  email VARCHAR(100) NOT NULL,

  -- Chave Primária Composta (1FN)
  PRIMARY KEY (idCliente, email),

  -- Chave Estrangeira com Integridade Referencial
  CONSTRAINT fk_cliente_email
    FOREIGN KEY (idCliente)
    REFERENCES Cliente(idCliente)
    ON DELETE CASCADE
);


-- =========================================================================
-- 2. TABELA CATEGORIA (Aplicando a 3ª FORMA NORMAL - 3FN no Catálogo)
--
-- CONCEITO:
-- No catálogo da Starvation, os produtos são divididos em categorias 
-- (Camisetas Oversized, Bonés/Headwear, Acessórios de Metal).
--
-- APLICAÇÃO DA 3ª FORMA NORMAL (3FN):
-- Se colocássemos 'nomeCategoria' e 'descricaoCategoria' diretamente na tabela Produto,
-- teríamos dependência transitiva: idProduto -> idCategoria -> nomeCategoria.
-- Ao isolar a Categoria em sua própria tabela, evitamos redundância de texto 
-- e anomalias de atualização no catálogo.
-- =========================================================================
CREATE TABLE Categoria (
  idCategoria INT UNSIGNED NOT NULL PRIMARY KEY,
  nomeCategoria VARCHAR(60) NOT NULL,
  descricao VARCHAR(255) NULL
);


-- =========================================================================
-- 3. TABELA PRODUTO (Tabela Base do Catálogo de Roupas - 3FN e 2FN)
--
-- CONCEITO:
-- Representa as peças do vestuário e acessórios disponíveis para compra.
-- Cada produto possui seus atributos próprios (nome, descrição, preço de catálogo, 
-- cor, tamanho e estoque) e referencia a Categoria via Chave Estrangeira (FK).
-- =========================================================================
CREATE TABLE Produto (
  idProduto INT UNSIGNED NOT NULL PRIMARY KEY,
  nomeProduto VARCHAR(120) NOT NULL,
  descricao TEXT NULL,
  precoUnitario DECIMAL(10,2) NOT NULL,
  estoque INT UNSIGNED NOT NULL DEFAULT 0,
  cor VARCHAR(50) NOT NULL,
  tamanho VARCHAR(20) NOT NULL,

  -- FK ligando à Categoria (3FN mantida sem dependência transitiva)
  idCategoria INT UNSIGNED NOT NULL,

  CONSTRAINT fk_produto_categoria
    FOREIGN KEY (idCategoria)
    REFERENCES Categoria(idCategoria)
);


-- =========================================================================
-- 3.1 TABELA PRODUTO_IMAGEM (Solução da 1FN para Múltiplas Imagens do Catálogo)
--
-- CONCEITO CONFORME REQUISITOS DO SITE:
-- "Cada produto pode conter ou exibir mais de uma imagem para o catálogo"
-- (Frente, Costas, Detalhes de Tecido/Costura).
--
-- APLICAÇÃO DA 1ª FORMA NORMAL (1FN):
-- Para não violar a 1FN criando colunas 'imagem1', 'imagem2', 'imagem3',
-- criamos uma entidade fraca/associada. A chave primária é COMPOSTA
-- (idProduto + caminhoImagem).
-- =========================================================================
CREATE TABLE ProdutoImagem (
  idProduto INT UNSIGNED NOT NULL,
  caminhoImagem VARCHAR(255) NOT NULL,
  tipoVisualizacao VARCHAR(30) NOT NULL, -- Ex: 'Frente', 'Costas', 'Detalhe'

  -- Chave Primária Composta (1FN)
  PRIMARY KEY (idProduto, caminhoImagem),

  -- Chave Estrangeira com deleção em cascata
  CONSTRAINT fk_produto_imagem
    FOREIGN KEY (idProduto)
    REFERENCES Produto(idProduto)
    ON DELETE CASCADE
);


-- =========================================================================
-- 4. TABELA PEDIDO (Aplicando a 3ª FORMA NORMAL - 3FN)
--
-- APLICAÇÃO DA 3ª FORMA NORMAL (3FN):
-- Regra: Nenhum atributo não-chave deve depender de outro atributo não-chave.
--
-- VIOLAÇÃO DA 3FN (O QUE NÃO FAZER):
-- PEDIDO (idPedido, dataPedido, idCliente, nomeCliente, enderecoCliente)
-- Problema: idPedido determina idCliente; porém, nomeCliente e endereço dependem de idCliente.
-- Se o cliente mudasse de endereço ou corrigisse o nome, precisaríamos atualizar 
-- todos os pedidos passados!
--
-- FORMA CORRETA (3FN APLICADA):
-- Mantemos no Pedido APENAS a Chave Estrangeira 'idCliente'. Dados cadastrais
-- são obtidos através de JOIN com a tabela Cliente.
-- =========================================================================
CREATE TABLE Pedido (
  idPedido INT UNSIGNED NOT NULL PRIMARY KEY,
  dataPedido DATE NOT NULL,
  statusPedido VARCHAR(30) NOT NULL DEFAULT 'Processando',
  
  -- FK ligando ao Cliente (3FN mantida)
  idCliente INT UNSIGNED NOT NULL,

  CONSTRAINT fk_pedido_cliente
    FOREIGN KEY (idCliente)
    REFERENCES Cliente(idCliente)
);


-- =========================================================================
-- 5. TABELA ITEM_PEDIDO (Aplicando a 2ª FORMA NORMAL - 2FN)
--
-- CONCEITO: Relacionamento N:M entre Pedido e Produto.
-- A Chave Primária é COMPOSTA: (idPedido, idProduto).
--
-- APLICAÇÃO DA 2ª FORMA NORMAL (2FN - DEPENDÊNCIA FUNCIONAL TOTAL):
-- Regra: Todos os atributos não-chave devem depender da TOTALIDADE da PK Composta.
--
-- VIOLAÇÃO DA 2FN (O QUE NÃO FAZER):
-- ITEM_PEDIDO (idPedido, idProduto, quantidade, precoPraticado, nomeProduto, corProduto)
-- Problema: 'nomeProduto' e 'corProduto' dependem APENAS de 'idProduto' (dependência parcial).
--
-- FORMA CORRETA (2FN APLICADA):
-- 1. 'quantidade' e 'precoPraticado' dependem da junção de idPedido E idProduto.
--    Nota: 'precoPraticado' é mantido aqui porque registra o valor histórico
--    no exato instante da compra, imune a futuras alterações na tabela Produto.
-- 2. 'nomeProduto', 'descricao' e 'cor' ficam ISOLADOS na tabela Produto.
-- =========================================================================
CREATE TABLE ItemPedido (
  idPedido INT UNSIGNED NOT NULL,
  idProduto INT UNSIGNED NOT NULL,
  quantidade INT UNSIGNED NOT NULL,
  precoPraticado DECIMAL(10,2) NOT NULL,

  -- Chave Primária Composta (2FN)
  PRIMARY KEY (idPedido, idProduto),

  -- Chaves Estrangeiras
  CONSTRAINT fk_item_pedido
    FOREIGN KEY (idPedido)
    REFERENCES Pedido(idPedido),

  CONSTRAINT fk_item_produto
    FOREIGN KEY (idProduto)
    REFERENCES Produto(idProduto)
);


-- =========================================================================
-- 6. INSERÇÃO DE DADOS (DML) - POVOAMENTO DO BANCO DE DADOS
-- =========================================================================

-- Inserindo Clientes (1FN: Endereço Atômico desmembrado)
INSERT INTO Cliente (idCliente, nome, logradouro, numero, bairro, cidade, uf, cep) VALUES
(1, 'Rodrigo Alvares', 'Rua das Almas Perdidas', '66', 'Bela Vista', 'São Paulo', 'SP', '01311000'),
(2, 'Beatriz Falcone', 'Avenida do Eclipse', '108', 'Boa Viagem', 'Recife', 'PE', '51020010'),
(3, 'Lucas Guts Ferreira', 'Rua do Ferreiro Negro', '500', 'Floresta', 'Porto Alegre', 'RS', '90220001');

-- Inserindo E-mails (1FN: Atributo Multivalorado resolvido em tabela própria)
INSERT INTO ClienteEmail (idCliente, email) VALUES
(1, 'rodrigo.alvares@darkmail.com'),
(1, 'rodrigo.dev@corporativo.com'), -- Rodrigo possui 2 e-mails cadastrados!
(2, 'beatriz.falcone@berserkmail.org');
-- Lucas Ferreira (idCliente 3) ainda não cadastrou e-mail de contato alternativo.

-- Inserindo Categorias de Roupas (3FN: Isolando metadados de classificação)
INSERT INTO Categoria (idCategoria, nomeCategoria, descricao) VALUES
(1, 'Camisetas', 'Camisetas oversized em malha pesada 260g/m² com estampas em silk corrosivo e estética brutalista.'),
(2, 'Bonés & Gorros', 'Headwear com bordados sombrios, dad hats desgastados e beanies pesados em tricô térmico.'),
(3, 'Acessórios & Relíquias', 'Anéis maciços em prata envelhecida 925, amuletos forjados e cintos com fivelas de ferro oxidado.');

-- Inserindo Produtos do Catálogo Starvation (Peças inspiradas em Fear & Hunger e Kentaro Miura)
INSERT INTO Produto (idProduto, nomeProduto, descricao, precoUnitario, estoque, cor, tamanho, idCategoria) VALUES
(10, "Camiseta Oversized Dungeons of Ma'habre", 'Modelagem oversized clássica em malha penteada 100% algodão 260 GSM com hachuras brutas.', 159.90, 14, 'Preto Estonado Vintage', 'M', 1),
(20, 'Camiseta Heavyweight The Eclipse / God Hand', 'Tributo à grande obra de Miura. Malha encorpada 280 GSM e Marca do Sacrifício em carmesim sangrento.', 169.90, 8, 'Carvão Mineral', 'G', 1),
(30, 'Camiseta Boxy Gro-goroth: God of Destruction', 'Invocação ao deus primordial da destruição. Silhueta boxy mais ampla nos ombros.', 149.90, 5, 'Preto Sangue Seco', 'M', 1),
(40, 'Dad Hat Vintage Brand of Torment', 'Boné modelo Dad Hat 6 gomos em sarja 100% algodão desfiada artesanalmente e bordado em alta densidade.', 99.90, 16, 'Preto Desgastado', 'Único', 2),
(50, 'Gorro Beanie Ribbed Crow Mauler', 'Gorro canelado pesado e elástico em tricô térmico premium com tag vulcanizada crânio e bico.', 89.90, 20, 'Preto Carvão Profundo', 'Único', 2),
(60, "Anel Maciço Behelit's Awakening 925", 'Esculpido em relevo brutalista retratando os traços do ovo do rei em Prata de Lei 925 envelhecida.', 229.90, 6, 'Prata Velha Oxidada', '22', 3),
(70, 'Amuleto Relíquia: God of Fear and Hunger', 'Medalhão fundido em metal maciço e corrente veneziana de 4mm em aço cirúrgico 316L.', 139.90, 10, 'Bronze Medieval Escurecido', 'Corrente 65cm', 3);

-- Inserindo Imagens do Catálogo (1FN: Atributo Multivalorado de Imagens por Produto)
INSERT INTO ProdutoImagem (idProduto, caminhoImagem, tipoVisualizacao) VALUES
(10, 'img/camisetas/camisa_mahabre_frente.jpg', 'Frente'),
(10, 'img/camisetas/camisa_mahabre_costas.jpg', 'Costas'),
(10, 'img/camisetas/camisa_mahabre_detalhes.jpg', 'Detalhes'),
(20, 'img/camisetas/camisa_eclipse_frente.jpg', 'Frente'),
(20, 'img/camisetas/camisa_eclipse_costas.jpg', 'Costas'),
(40, 'img/bones/bone-torment-frente.jpg', 'Frente'),
(40, 'img/bones/bone-torment-lado.jpg', 'Lado'),
(60, 'img/acessorios/anel-behelit-frente.jpg', 'Frente'),
(60, 'img/acessorios/anel-behelit-lado.jpg', 'Lado');

-- Inserindo Pedidos (3FN: Apenas FK idCliente e metadados diretos do pedido)
INSERT INTO Pedido (idPedido, dataPedido, statusPedido, idCliente) VALUES
(101, '2026-10-01', 'Entregue', 1),
(102, '2026-10-04', 'Enviado', 1),
(103, '2026-10-08', 'Processando', 2),
(104, '2026-10-12', 'Processando', 3);

-- Inserindo Itens dos Pedidos (2FN: Quantidade e Preço Praticado dependem de idPedido + idProduto)
INSERT INTO ItemPedido (idPedido, idProduto, quantidade, precoPraticado) VALUES
(101, 10, 1, 159.90), -- Pedido 101: 1 Camiseta Ma'habre
(101, 40, 1, 99.90),  -- Pedido 101: 1 Dad Hat Brand of Torment
(102, 60, 1, 229.90), -- Pedido 102: 1 Anel Behelit 925
(103, 20, 2, 169.90), -- Pedido 103: 2 Camisetas The Eclipse
(103, 50, 1, 89.90),  -- Pedido 103: 1 Gorro Crow Mauler
(104, 30, 1, 149.90), -- Pedido 104: 1 Camiseta Gro-goroth
(104, 70, 1, 139.90); -- Pedido 104: 1 Amuleto Relíquia F&H


-- =========================================================================
-- 7. CONSULTAS DEMONSTRATIVAS DAS FORMAS NORMAIS (DQL)
-- =========================================================================

-- -------------------------------------------------------------------------
-- DEMONSTRAÇÃO DA 1FN (Consultando Atributos Multivalorados via JOIN)
-- 1. Exibe todos os e-mails cadastrados para o cliente Rodrigo Alvares.
-- -------------------------------------------------------------------------
SELECT 
    c.idCliente AS 'ID Cliente',
    c.nome AS 'Nome do Cliente',
    e.email AS 'E-mail Cadastrado'
FROM Cliente c
INNER JOIN ClienteEmail e ON c.idCliente = e.idCliente
WHERE c.idCliente = 1;


-- -------------------------------------------------------------------------
-- DEMONSTRAÇÃO DA 1FN (Múltiplas Imagens de um Produto no Catálogo)
-- 2. Exibe as imagens da galeria de um produto específico para o frontend.
-- -------------------------------------------------------------------------
SELECT 
    p.nomeProduto AS 'Peça / Produto',
    img.tipoVisualizacao AS 'Ângulo / Visão',
    img.caminhoImagem AS 'Caminho do Arquivo'
FROM Produto p
INNER JOIN ProdutoImagem img ON p.idProduto = img.idProduto
WHERE p.idProduto = 10;


-- -------------------------------------------------------------------------
-- DEMONSTRAÇÃO DA 2FN E 3FN (Reconstrução Completa dos Pedidos sem Redundância)
-- Como o nome do cliente não foi duplicado no pedido (3FN), a categoria não foi
-- duplicada no produto (3FN) e o nome do produto não foi duplicado no item (2FN),
-- usamos JOIN para cruzar as tabelas perfeitamente normalizadas.
-- -------------------------------------------------------------------------
SELECT 
    p.idPedido AS 'Nº Pedido',
    p.dataPedido AS 'Data Compra',
    p.statusPedido AS 'Status',
    c.nome AS 'Cliente',
    cat.nomeCategoria AS 'Categoria',
    prod.nomeProduto AS 'Produto',
    prod.cor AS 'Cor',
    prod.tamanho AS 'Tamanho',
    item.quantidade AS 'Qtd',
    item.precoPraticado AS 'Preço Unit. (R$)',
    (item.quantidade * item.precoPraticado) AS 'Subtotal (R$)'
FROM Pedido p
INNER JOIN Cliente c ON p.idCliente = c.idCliente
INNER JOIN ItemPedido item ON p.idPedido = item.idPedido
INNER JOIN Produto prod ON item.idProduto = prod.idProduto
INNER JOIN Categoria cat ON prod.idCategoria = cat.idCategoria
ORDER BY p.idPedido, item.idProduto;


-- -------------------------------------------------------------------------
-- DEMONSTRAÇÃO COM FILTROS E AGREGAÇÃO (Total de Vendas e Faturamento por Categoria)
-- Mostra quais departamentos do catálogo geraram mais receita.
-- -------------------------------------------------------------------------
SELECT 
    cat.nomeCategoria AS 'Categoria',
    COUNT(DISTINCT item.idPedido) AS 'Total de Pedidos',
    SUM(item.quantidade) AS 'Total Peças Vendidas',
    SUM(item.quantidade * item.precoPraticado) AS 'Faturamento Total (R$)'
FROM Categoria cat
INNER JOIN Produto prod ON cat.idCategoria = prod.idCategoria
INNER JOIN ItemPedido item ON prod.idProduto = item.idProduto
GROUP BY cat.idCategoria, cat.nomeCategoria
ORDER BY `Faturamento Total (R$)` DESC;


-- -------------------------------------------------------------------------
-- DEMONSTRAÇÃO COM FILTROS E AGREGAÇÃO (Histórico e Gasto Total por Cliente)
-- Exibe quanto cada cliente já investiu na marca Starvation.
-- -------------------------------------------------------------------------
SELECT 
    c.idCliente AS 'ID',
    c.nome AS 'Cliente',
    CONCAT(c.cidade, '/', c.uf) AS 'Localidade',
    COUNT(DISTINCT p.idPedido) AS 'Qtd Pedidos',
    SUM(item.quantidade * item.precoPraticado) AS 'Valor Total Gasto (R$)'
FROM Cliente c
INNER JOIN Pedido p ON c.idCliente = p.idCliente
INNER JOIN ItemPedido item ON p.idPedido = item.idPedido
GROUP BY c.idCliente, c.nome, c.cidade, c.uf
ORDER BY `Valor Total Gasto (R$)` DESC;

