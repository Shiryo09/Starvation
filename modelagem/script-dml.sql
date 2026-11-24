-- ============================================================================
-- SCRIPT DE MANIPULAÇÃO DE DADOS (DML) - POVOAMENTO ORIENTADO A CENÁRIOS REAIS
-- Projeto: Starvation Streetwear - Catálogo & E-commerce
-- Inspiração: Dark RPG (Fear & Hunger) e Obras de Kentaro Miura (Berserk)
-- Arquivo: script-dml.sql
-- Local: modelagem/script-dml.sql
-- ============================================================================

USE StarvationDB;

-- ============================================================================
-- Cenário 1 — Estruturação da Marca e Homologação de Fornecedores Especializados
--
-- Antes de lançar o primeiro drop da marca Starvation no e-commerce, os fundadores
-- definiram as categorias principais de vestuário e acessórios para organizar o
-- catálogo do site. Em seguida, fecharam contratos com 5 fornecedores homologados
-- para tecelagem em malha pesada (260/280 GSM), fundição de prata 925 envelhecida,
-- sarjas desfiadas para bonés, estamparia corrosiva e embalagens personalizadas.
-- ============================================================================

-- Inserção na tabela: Categoria (5 registros)
INSERT INTO Categoria (nomeCategoria, descricao, ativo) VALUES
('Camisetas Oversized', 'Camisetas streetwear em malha pesada 260g/m² com estampas em silk corrosivo e estética brutalista.', TRUE),
('Bonés & Headwear', 'Headwear com bordados sombrios, dad hats desgastados e beanies pesados em tricô térmico.', TRUE),
('Acessórios & Relíquias', 'Anéis maciços em prata envelhecida 925, amuletos forjados e cintos com fivelas de ferro oxidado.', TRUE),
('Calças & Bermudas Street', 'Calças cargo utilitárias com bolsos profundos, fit amplo e sarja de alta gramatura.', TRUE),
('Moletons & Jaquetas', 'Hoodies pesados 400g/m² flanelados com capuz estruturado e acabamentos desgastados.', TRUE);

-- Inserção na tabela: Fornecedor (5 registros)
INSERT INTO Fornecedor (razaoSocial, cnpj, telefone, email, cidade) VALUES
('Têxtil DarkWear Malhas Pesadas Ltda', '12.345.678/0001-90', '(11) 3322-1100', 'contato@darkwearmalhas.com.br', 'São Paulo'),
('Forja Midland Prata 925 & Fundições ME', '23.456.789/0001-01', '(19) 3871-4455', 'comercial@forjamidland.com.br', 'Campinas'),
('Headwear & Sarjas Desfiadas Brasil', '34.567.890/0001-12', '(47) 3255-8899', 'pedidos@headwearbrasil.com.br', 'Brusque'),
('Estamparia Silk Corrosivo Caverna EIRELI', '45.678.901/0001-23', '(11) 98765-4321', 'producao@silkcaverna.com.br', 'São Paulo'),
('Embalagens & Lacres Brutalistas SA', '56.789.012/0001-34', '(41) 3344-7788', 'vendas@embalagensbrutalistas.com.br', 'Curitiba');


-- ============================================================================
-- Cenário 2 — Entrada do Catálogo Oficial e Drops Limitados (Produtos e Galeria)
--
-- Com a matéria-prima e as confecções prontas, a Starvation cadastrou o primeiro
-- lote oficial de produtos no sistema, contendo as peças icônicas inspiradas em
-- Fear & Hunger e Berserk. Para cada produto, foram estabelecidos o preço unitário,
-- a cor, o tamanho e a quantidade física disponível no estoque central.
-- Além disso, foram associadas as imagens em alta resolução para exibição no catálogo.
-- ============================================================================

-- Inserção na tabela: Produto (7 registros)
INSERT INTO Produto (idCategoria, idFornecedor, nomeProduto, descricao, precoUnitario, estoque, cor, tamanho, ativo) VALUES
(1, 1, "Camiseta Oversized Dungeons of Ma'habre", 'Modelagem oversized clássica em malha penteada 100% algodão 260 GSM com hachuras brutas.', 159.90, 14, 'Preto Estonado Vintage', 'M', TRUE),
(1, 1, 'Camiseta Heavyweight The Eclipse / God Hand', 'Tributo à grande obra de Miura. Malha encorpada 280 GSM e Marca do Sacrifício em carmesim sangrento.', 169.90, 8, 'Carvão Mineral', 'G', TRUE),
(1, 4, 'Camiseta Boxy Gro-goroth: God of Destruction', 'Invocação ao deus primordial da destruição. Silhueta boxy mais ampla nos ombros.', 149.90, 5, 'Preto Sangue Seco', 'M', TRUE),
(2, 3, 'Dad Hat Vintage Brand of Torment', 'Boné modelo Dad Hat 6 gomos em sarja 100% algodão desfiada artesanalmente e bordado em alta densidade.', 99.90, 16, 'Preto Desgastado', 'Único', TRUE),
(2, 3, 'Gorro Beanie Ribbed Crow Mauler', 'Gorro canelado pesado e elástico em tricô térmico premium com tag vulcanizada crânio e bico.', 89.90, 20, 'Preto Carvão Profundo', 'Único', TRUE),
(3, 2, "Anel Maciço Behelit's Awakening 925", 'Esculpido em relevo brutalista retratando os traços do ovo do rei em Prata de Lei 925 envelhecida.', 229.90, 6, 'Prata Velha Oxidada', '22', TRUE),
(3, 2, 'Amuleto Relíquia: God of Fear and Hunger', 'Medalhão fundido em metal maciço e corrente veneziana de 4mm em aço cirúrgico 316L.', 139.90, 10, 'Bronze Medieval Escurecido', 'Corrente 65cm', TRUE);

-- Inserção na tabela: ProdutoImagem (7 registros com caminhos reais do frontend)
INSERT INTO ProdutoImagem (idProduto, caminhoImagem, tipoVisualizacao, ehPrincipal) VALUES
(1, 'img/camisetas/camisa_mahabre_frente.jpg', 'Frente', TRUE),
(1, 'img/camisetas/camisa_mahabre_costas.jpg', 'Costas', FALSE),
(2, 'img/camisetas/camisa_eclipse_frente.jpg', 'Frente', TRUE),
(3, 'img/camisetas/camisa_grogoroth_frente.jpg', 'Frente', TRUE),
(4, 'img/bones/bone-torment-frente.jpg', 'Frente', TRUE),
(5, 'img/bones/gorro-crow-frente.jpg', 'Frente', TRUE),
(6, 'img/acessorios/anel-behelit-frente.jpg', 'Frente', TRUE);


-- ============================================================================
-- Cenário 3 — Lançamento do E-commerce: Cadastro dos Primeiros Clientes e Endereços
--
-- Na meia-noite do lançamento do drop, a plataforma da Starvation foi ao ar.
-- Cinco clientes e entusiastas do universo da marca criaram suas contas
-- no site e cadastraram seus endereços completos de entrega para envio via transportadora.
-- ============================================================================

-- Inserção na tabela: Cliente (5 registros)
INSERT INTO Cliente (nome, cpf, telefone, dataNascimento, dataCadastro) VALUES
('Rodrigo Alvares', '111.222.333-44', '(11) 98765-1122', '1995-07-14', '2026-10-01 00:05:00'),
('Beatriz Falcone', '222.333.444-55', '(81) 99123-4567', '1998-11-20', '2026-10-01 00:12:00'),
('Lucas Guts Ferreira', '333.444.555-66', '(51) 98456-7890', '1992-04-03', '2026-10-01 00:25:00'),
('Casca Ribeiro Mendonça', '444.555.666-77', '(21) 97321-9876', '1996-09-15', '2026-10-01 01:10:00'),
('Judeau Silveira Ramos', '555.666.777-88', '(31) 98888-2233', '1994-02-28', '2026-10-01 02:40:00');

-- Inserção na tabela: EnderecoEntrega (5 registros)
INSERT INTO EnderecoEntrega (idCliente, logradouro, numero, complemento, bairro, cidade, uf, cep) VALUES
(1, 'Rua das Almas Perdidas', '66', 'Apto 42', 'Bela Vista', 'São Paulo', 'SP', '01311-000'),
(2, 'Avenida do Eclipse', '108', 'Bloco C, Casa 4', 'Boa Viagem', 'Recife', 'PE', '51020-010'),
(3, 'Rua do Ferreiro Negro', '500', 'Fundos', 'Floresta', 'Porto Alegre', 'RS', '90220-001'),
(4, 'Alameda dos Falcões', '77', 'Cobertura 01', 'Copacabana', 'Rio de Janeiro', 'RJ', '22070-010'),
(5, 'Rua do Acampamento Mercenário', '12', 'Casa', 'Savassi', 'Belo Horizonte', 'MG', '30140-060');


-- ============================================================================
-- Cenário 4 — Primeiro Drop Limitado: Realização de Pedidos e Itens Comprados
--
-- Durante as primeiras horas de drop aberto, os cinco clientes adicionaram produtos
-- aos seus carrinhos e finalizaram as compras. Cada pedido foi gerado com seu
-- respectivo endereço de destino, status inicial e itens individuais contendo o
-- preço praticado no exato instante da transação.
-- ============================================================================

-- Inserção na tabela: Pedido (5 registros)
-- Pedido 1: Rodrigo Alvares (Camiseta Ma'habre + Dad Hat) -> Total: 259.80 (Entregue)
-- Pedido 2: Beatriz Falcone (2 Camisetas The Eclipse + Gorro Crow) -> Total: 429.70 (Enviado)
-- Pedido 3: Lucas Guts Ferreira (Anel Behelit + Amuleto Relíquia) -> Total: 369.80 (Processando)
-- Pedido 4: Casca Ribeiro Mendonça (Camiseta Boxy Gro-goroth) -> Total: 149.90 (Processando)
-- Pedido 5: Judeau Silveira Ramos (Dad Hat + Camiseta Ma'habre) -> Total: 259.80 (Processando)

INSERT INTO Pedido (idCliente, idEndereco, dataPedido, statusPedido, valorTotal) VALUES
(1, 1, '2026-10-01', 'Entregue', 259.80),
(2, 2, '2026-10-01', 'Enviado', 429.70),
(3, 3, '2026-10-02', 'Processando', 369.80),
(4, 4, '2026-10-02', 'Processando', 149.90),
(5, 5, '2026-10-03', 'Processando', 259.80);

-- Inserção na tabela: ItemPedido (10 registros correspondentes aos 5 pedidos)
INSERT INTO ItemPedido (idPedido, idProduto, quantidade, precoPraticado, subtotal) VALUES
-- Itens do Pedido 1 (Total R$ 259.80): 1 Camiseta Ma'habre + 1 Dad Hat Brand of Torment
(1, 1, 1, 159.90, 159.90),
(1, 4, 1, 99.90, 99.90),

-- Itens do Pedido 2 (Total R$ 429.70): 2 Camisetas The Eclipse + 1 Gorro Crow Mauler
(2, 2, 2, 169.90, 339.80),
(2, 5, 1, 89.90, 89.90),

-- Itens do Pedido 3 (Total R$ 369.80): 1 Anel Behelit 925 + 1 Amuleto Relíquia F&H
(3, 6, 1, 229.90, 229.90),
(3, 7, 1, 139.90, 139.90),

-- Itens do Pedido 4 (Total R$ 149.90): 1 Camiseta Gro-goroth
(4, 3, 1, 149.90, 149.90),

-- Itens do Pedido 5 (Total R$ 259.80): 1 Dad Hat Brand of Torment + 1 Camiseta Ma'habre
(5, 4, 1, 99.90, 99.90),
(5, 1, 1, 159.90, 159.90);


-- ============================================================================
-- Cenário 5 — Liquidação Financeira: Processamento e Confirmação de Pagamentos
--
-- Após a confirmação dos pedidos, o gateway de pagamento processou as transações
-- utilizando Pix, Cartão de Crédito e Boleto Bancário. Todas as transações foram
-- confirmadas e associadas aos seus respectivos pedidos, garantindo a baixa dos itens.
-- ============================================================================

-- Inserção na tabela: Pagamento (5 registros)
INSERT INTO Pagamento (idPedido, formaPagamento, valorPago, dataHoraPagamento, statusPagamento) VALUES
(1, 'PIX', 259.80, '2026-10-01 00:15:30', 'APROVADO'),
(2, 'CARTAO_CREDITO', 429.70, '2026-10-01 00:22:15', 'APROVADO'),
(3, 'CARTAO_CREDITO', 369.80, '2026-10-02 09:30:00', 'APROVADO'),
(4, 'PIX', 149.90, '2026-10-02 14:10:05', 'APROVADO'),
(5, 'BOLETO', 259.80, '2026-10-03 11:45:20', 'APROVADO');
