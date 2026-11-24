-- ============================================================================
-- SCRIPT DE DEFINIÇÃO DE ESTRUTURA DE BANCO DE DADOS (DDL)
-- Projeto: Starvation Streetwear - Catálogo & E-commerce
-- Universo: Dark RPG (Fear & Hunger) e Obras de Kentaro Miura (Berserk)
-- Arquivo: script-ddl.sql
-- Local: modelagem/script-ddl.sql
-- ============================================================================

-- 0. Criação e Seleção do Banco de Dados
CREATE DATABASE IF NOT EXISTS StarvationDB;
USE StarvationDB;

-- Remoção prévia das tabelas na ordem inversa de dependência (filhas para pais)
DROP TABLE IF EXISTS Pagamento;
DROP TABLE IF EXISTS ItemPedido;
DROP TABLE IF EXISTS Pedido;
DROP TABLE IF EXISTS ProdutoImagem;
DROP TABLE IF EXISTS Produto;
DROP TABLE IF EXISTS EnderecoEntrega;
DROP TABLE IF EXISTS Cliente;
DROP TABLE IF EXISTS Fornecedor;
DROP TABLE IF EXISTS Categoria;

-- ============================================================================
-- 1. TABELAS PAI (Sem Chaves Estrangeiras)
-- ============================================================================

-- Tabela 1: Categorias de Roupas e Peças (3FN)
-- Organiza o catálogo temático (Camisetas Oversized, Headwear, Acessórios, etc.)
CREATE TABLE Categoria (
    idCategoria INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nomeCategoria VARCHAR(60) NOT NULL UNIQUE,
    descricao VARCHAR(255) NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabela 2: Fornecedores Homologados
-- Fornecedores das malhas pesadas (260/280 GSM), pratas 925, sarjas e estamparia
CREATE TABLE Fornecedor (
    idFornecedor INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    razaoSocial VARCHAR(120) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cidade VARCHAR(60) NOT NULL,
    dataCadastro DATE NOT NULL DEFAULT (CURRENT_DATE)
);

-- Tabela 3: Clientes da Marca Starvation
-- Dados cadastrais com identificador único, CPF e telefone
CREATE TABLE Cliente (
    idCliente INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(125) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    dataNascimento DATE NOT NULL,
    dataCadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. TABELAS FILHAS E INTERMEDIÁRIAS (Com Chaves Estrangeiras)
-- ============================================================================

-- Tabela 4: Endereço de Entrega dos Clientes (1FN - Atributo Composto Desmembrado)
-- Permite que um cliente possua endereço atômico e estruturado para envios
CREATE TABLE EnderecoEntrega (
    idEndereco INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    idCliente INT UNSIGNED NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(60) NULL,
    bairro VARCHAR(60) NOT NULL,
    cidade VARCHAR(60) NOT NULL,
    uf CHAR(2) NOT NULL,
    cep CHAR(9) NOT NULL,
    CONSTRAINT fk_endereco_cliente
        FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Tabela 5: Produtos do Catálogo / Drop Limitado (3FN e 2FN)
-- Peças brutalistas inspiradas em Fear & Hunger e Berserk
CREATE TABLE Produto (
    idProduto INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    idCategoria INT UNSIGNED NOT NULL,
    idFornecedor INT UNSIGNED NOT NULL,
    nomeProduto VARCHAR(120) NOT NULL,
    descricao TEXT NULL,
    precoUnitario DECIMAL(10, 2) NOT NULL CHECK (precoUnitario > 0),
    estoque INT UNSIGNED NOT NULL DEFAULT 0,
    cor VARCHAR(50) NOT NULL,
    tamanho VARCHAR(20) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_produto_categoria
        FOREIGN KEY (idCategoria) REFERENCES Categoria(idCategoria)
        ON UPDATE CASCADE,
    CONSTRAINT fk_produto_fornecedor
        FOREIGN KEY (idFornecedor) REFERENCES Fornecedor(idFornecedor)
        ON UPDATE CASCADE
);

-- Tabela 6: Galeria de Imagens dos Produtos (1FN - Atributo Multivalorado)
-- Registra múltiplas fotos para cada produto do site (Frente, Costas, Detalhes)
CREATE TABLE ProdutoImagem (
    idImagem INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    idProduto INT UNSIGNED NOT NULL,
    caminhoImagem VARCHAR(255) NOT NULL,
    tipoVisualizacao VARCHAR(30) NOT NULL CHECK (tipoVisualizacao IN ('Frente', 'Costas', 'Detalhes', 'Lado')),
    ehPrincipal BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_imagem_produto
        FOREIGN KEY (idProduto) REFERENCES Produto(idProduto)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Tabela 7: Pedidos de Compra (3FN)
-- Registra a ordem de compra vinculando cliente, endereço de entrega e status
CREATE TABLE Pedido (
    idPedido INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    idCliente INT UNSIGNED NOT NULL,
    idEndereco INT UNSIGNED NOT NULL,
    dataPedido DATE NOT NULL,
    statusPedido VARCHAR(30) NOT NULL DEFAULT 'Processando' 
        CHECK (statusPedido IN ('Processando', 'Enviado', 'Entregue', 'Cancelado')),
    valorTotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (valorTotal >= 0),
    CONSTRAINT fk_pedido_cliente
        FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente)
        ON UPDATE CASCADE,
    CONSTRAINT fk_pedido_endereco
        FOREIGN KEY (idEndereco) REFERENCES EnderecoEntrega(idEndereco)
        ON UPDATE CASCADE
);

-- Tabela 8: Itens do Pedido (2FN - Relação N:M entre Pedido e Produto)
-- Registra quantidade, preço histórico praticado no ato da compra e subtotal
CREATE TABLE ItemPedido (
    idItemPedido INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    idPedido INT UNSIGNED NOT NULL,
    idProduto INT UNSIGNED NOT NULL,
    quantidade INT UNSIGNED NOT NULL CHECK (quantidade > 0),
    precoPraticado DECIMAL(10, 2) NOT NULL CHECK (precoPraticado > 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal > 0),
    CONSTRAINT uk_pedido_produto UNIQUE (idPedido, idProduto),
    CONSTRAINT fk_item_pedido
        FOREIGN KEY (idPedido) REFERENCES Pedido(idPedido)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_item_produto
        FOREIGN KEY (idProduto) REFERENCES Produto(idProduto)
        ON UPDATE CASCADE
);

-- Tabela 9: Pagamentos dos Pedidos
-- Registra o método financeiro, valor liquidado e status da transação
CREATE TABLE Pagamento (
    idPagamento INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    idPedido INT UNSIGNED NOT NULL,
    formaPagamento VARCHAR(30) NOT NULL CHECK (formaPagamento IN ('PIX', 'CARTAO_CREDITO', 'BOLETO')),
    valorPago DECIMAL(10, 2) NOT NULL CHECK (valorPago > 0),
    dataHoraPagamento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statusPagamento VARCHAR(30) NOT NULL DEFAULT 'APROVADO' 
        CHECK (statusPagamento IN ('PENDENTE', 'APROVADO', 'RECUSADO', 'ESTORNADO')),
    CONSTRAINT fk_pagamento_pedido
        FOREIGN KEY (idPedido) REFERENCES Pedido(idPedido)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
