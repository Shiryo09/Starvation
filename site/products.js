/**
 * STARVATION — Catálogo de Produtos & Coleções
 * Inspirado no universo Dark RPG de Fear & Hunger e nas obras de Kentaro Miura (Berserk).
 * Estrutura conforme Modelo Entidade-Relacionamento (MER.md) e Regras de Negócio (README.md).
 **/

const CATEGORIAS = [
  {
    id_categoria: 'todas',
    nome: 'Todas as Peças',
    descricao: 'Coleção completa de vestuário e artefatos de Starvation.'
  },
  {
    id_categoria: 'camisetas',
    nome: 'Camisetas',
    descricao: 'Camisetas oversized em malha pesada 260g/m² com estampas em silk corrosivo e estética brutalista.'
  },
  {
    id_categoria: 'bones',
    nome: 'Bonés & Gorros',
    descricao: 'Headwear com bordados sombrios, dad hats desgastados e beanies pesados.'
  },
  {
    id_categoria: 'acessorios',
    nome: 'Acessórios & Relíquias',
    descricao: 'Anéis em prata envelhecida, amuletos de dungeon forjados e cintos com metais oxidados.'
  }
];

const DROPS = [
  {
    id_drop: 'drop-01',
    nome: "Drop I: As Masmorras de Ma'habre",
    tema: 'Fear & Hunger',
    ativo: true,
    data_lancamento: 'Setembro 2026',
    fim_drop: '2026-10-15T23:59:59',
    descricao: 'Uma imersão na decadência, tormento e segredos esquecidos sob as catacumbas ancestrais.',
    banner: 'img/banners/hero-drop01.svg'
  },
  {
    id_drop: 'drop-02',
    nome: 'Drop II: O Eclipse da Mão de Deus',
    tema: 'Kentaro Miura Tribute',
    ativo: false,
    data_lancamento: 'Outubro 2026',
    fim_drop: '2026-11-15T23:59:59',
    descricao: 'Homenagem solene à grande obra de Kentaro Miura. Silhuetas de espadachins negros, aço e o estigma do sacrifício.',
    banner: 'img/banners/hero-drop02.svg'
  }
];

const PRODUTOS = [
  {
    id_produto: 'STV-CAM-01',
    nome: "Camiseta Oversized Dungeons of Ma'habre",
    id_categoria: 'camisetas',
    id_drop: 'drop-01',
    drop_nome: "Drop I: Ma'habre",
    preco: 159.90,
    estoque: 14,
    cor: 'Preto Estonado Vintage',
    tamanhos: ['P', 'M', 'G', 'GG', 'XG'],
    tamanho_selecionado: 'M',
    tag: 'DROP ATIVO',
    descricao: 'Modelagem oversized clássica em malha penteada 100% algodão 260 GSM. Estampa frontal minimalista com o selo do templo ancestral e mega estampa dorsal reproduzindo a cartografia das catacumbas em hachuras brutas.',
    detalhes: [
      'Malha 100% algodão pesado (260 g/m²)',
      'Gola canelada 2x1 com 3cm de espessura',
      'Lavagem estonada com aspecto vintage desgastado',
      'Estampa em silk-screen corrosivo de altíssima durabilidade',
      'Costura reforçada de ombro a ombro'
    ],
    imagens: [
      'img/camisetas/camisa_mahabre_frente.jpg',
      'img/camisetas/camisa_mahabre_costas.jpg',
      'img/camisetas/camisa_mahabre_detalhes.jpg'
    ]
  },
  {
    id_produto: 'STV-CAM-02',
    nome: 'Camiseta Heavyweight The Eclipse / God Hand',
    id_categoria: 'camisetas',
    id_drop: 'drop-02',
    drop_nome: 'Drop II: Eclipse',
    preco: 169.90,
    estoque: 8,
    cor: 'Carvão Mineral',
    tamanhos: ['P', 'M', 'G', 'GG', 'XG'],
    tamanho_selecionado: 'G',
    tag: 'PRÉ-VENDA EXCLUSIVA',
    descricao: 'Tributo direto ao mestre Kentaro Miura. Foco no horror cósmico e no destino inexorável. Estampa frontal com a Marca do Sacrifício em carmesim sangrento e dorsal com o eclipse total sobre o campo de espadas.',
    detalhes: [
      'Malha premium 280 GSM encorpada',
      'Corte reto streetwear japonês',
      'Pigmentação a frio reativa',
      'Estampa com relevo emborrachado na marca frontal',
      'Tag rúnica costurada na barra'
    ],
    imagens: [
      'img/camisetas/camisa_eclipse_frente.jpg',
      'img/camisetas/camisa_eclipse_costas.jpg',
      'img/camisetas/camisa_eclipse_detalhes.jpg'
    ]
  },
  {
    id_produto: 'STV-CAM-03',
    nome: 'Camiseta Boxy Gro-goroth: God of Destruction',
    id_categoria: 'camisetas',
    id_drop: 'drop-01',
    drop_nome: "Drop I: Ma'habre",
    preco: 149.90,
    estoque: 5,
    cor: 'Preto Sangue Seco',
    tamanhos: ['P', 'M', 'G', 'GG'],
    tamanho_selecionado: 'M',
    tag: 'ÚLTIMAS PEÇAS',
    descricao: 'Invocação ao deus primordial da destruição e do sacrifício em Fear & Hunger. Silhueta boxy mais ampla nos ombros e comprimento encurtado, inspirada no streetwear contemporâneo.',
    detalhes: [
      '100% Algodão vortex resistente a pilling',
      'Modelagem Boxy Fit moderna',
      'Silk em tinta plastisol fosca sem toque',
      'Acabamento em pesponto duplo'
    ],
    imagens: [
      'img/camisetas/camisa_grogoroth_frente.jpg',
      'img/camisetas/camisa_grogoroth_costas.jpg',
      'img/camisetas/camisa_grogoroth_detalhes.jpg'
    ]
  },
  {
    id_produto: 'STV-CAM-04',
    nome: 'Camiseta Moonscorch: Festival of Termina',
    id_categoria: 'camisetas',
    id_drop: 'drop-01',
    drop_nome: "Drop I: Ma'habre",
    preco: 154.90,
    estoque: 12,
    cor: 'Preto Desbotado',
    tamanhos: ['P', 'M', 'G', 'GG', 'XG'],
    tamanho_selecionado: 'P',
    tag: 'DROP ATIVO',
    descricao: 'Inspirada na loucura desenfreada provocada pela lua cheia de Rher. O design combina estética grotesca de horror corporal com caligrafia gótica desconstruída.',
    detalhes: [
      'Malha estonada com tratamento amaciante',
      'Estampa corroída com gradiente lunar',
      'Modelagem unissex oversized',
      'Edição numerada com tiragem limitada de 50 peças'
    ],
    imagens: [
      'img/camisetas/camisa_termina_frente.jpg',
      'img/camisetas/camisa_termina_costas.jpg',
      'img/camisetas/camisa_termina_detalhes.jpg'
    ]
  },
  {
    id_produto: 'STV-BON-01',
    nome: 'Dad Hat Vintage Brand of Torment',
    id_categoria: 'bones',
    id_drop: 'drop-02',
    drop_nome: 'Drop II: Eclipse',
    preco: 99.90,
    estoque: 16,
    cor: 'Preto Desgastado',
    tamanhos: ['Único'],
    tamanho_selecionado: 'Único',
    tag: 'DESTAQUE',
    descricao: 'Boné modelo Dad Hat 6 gomos em sarja 100% algodão pré-lavada e desfiada artesanalmente. Bordado frontal com o glifo da agonia em linha carmesim de alta densidade.',
    detalhes: [
      'Sarja pesada 100% algodão amaciada',
      'Regulador traseiro em fivela de latão envelhecido',
      'Aba curva com 4 costuras reforçadas',
      'Acabamento interno com fita personalizada Starvation'
    ],
    imagens: [
      'img/bones/bone-torment-frente.jpg',
      'img/bones/bone-torment-lado.jpg',
      'img/bones/bone-torment-costas.jpg'
    ]
  },
  {
    id_produto: 'STV-BON-02',
    nome: 'Boné 5-Panel Sylvian Cult Strapback',
    id_categoria: 'bones',
    id_drop: 'drop-01',
    drop_nome: "Drop I: Ma'habre",
    preco: 109.90,
    estoque: 7,
    cor: 'Verde Cripta & Preto',
    tamanhos: ['Único'],
    tamanho_selecionado: 'Único',
    tag: 'EDIÇÃO LIMITADA',
    descricao: 'Boné no corte 5-Panel moderno com aba reta flexível. Estampa sutil dos ritos da deusa Sylvian com ilhoses metálicos pretos de ventilação lateral.',
    detalhes: [
      'Construção 5-Panel anatômica',
      'Alça de regulagem em couro vegetal escurecido',
      'Fecho de metal anodizado preto fosco',
      'Patch bordado de alta resolução'
    ],
    imagens: [
      'img/bones/bone-sylvian-frente.jpg',
      'img/bones/bone-sylvian-lado.jpg',
      'img/bones/bone-sylvian-costas.jpg'
    ]
  },
  {
    id_produto: 'STV-BON-03',
    nome: 'Gorro Beanie Ribbed Crow Mauler',
    id_categoria: 'bones',
    id_drop: 'drop-01',
    drop_nome: "Drop I: Ma'habre",
    preco: 89.90,
    estoque: 20,
    cor: 'Preto Carvão Profundo',
    tamanhos: ['Único'],
    tamanho_selecionado: 'Único',
    tag: 'ESSENCIAL',
    descricao: 'Gorro canelado pesado e elástico, homenagem ao algoz mais temido das profundezas de Fear & Hunger. Tag emborrachada frontal com o crânio e bico corrompido.',
    detalhes: [
      'Tricô em fio acrílico térmico premium 100%',
      'Malha dupla canelada com dobra ajustável',
      'Tag emborrachada vulcanizada preta sobre preta',
      'Toque macio que não pinica'
    ],
    imagens: [
      'img/bones/gorro-crow-frente.jpg',
      'img/bones/gorro-crow-lado.jpg',
      'img/bones/gorro-crow-costas.jpg'
    ]
  },
  {
    id_produto: 'STV-ACE-01',
    nome: "Anel Maciço Behelit's Awakening 925",
    id_categoria: 'acessorios',
    id_drop: 'drop-02',
    drop_nome: 'Drop II: Eclipse',
    preco: 229.90,
    estoque: 6,
    cor: 'Prata Velha Oxidada',
    tamanhos: ['18', '20', '22', '24', '26'],
    tamanho_selecionado: '22',
    tag: 'JOALHERIA OBSCURA',
    descricao: 'Esculpido em relevo brutalista retratando os traços contorcidos do ovo do rei supremo. Cada peça passa por oxidação química manual com enxofre para ressaltar as fissuras e sombras.',
    detalhes: [
      'Prata de Lei 925 ou Liga nobre de alta fusão antialérgica',
      'Acabamento fosco com banho oxidado envelhecido',
      'Gravação interna do selo Starvation',
      'Acompanha estojo rúnico em veludo negro'
    ],
    imagens: [
      'img/acessorios/anel-behelit-frente.jpg',
      'img/acessorios/anel-behelit-lado.jpg',
      'img/acessorios/anel-behelit-costas.jpg'
    ]
  },
  {
    id_produto: 'STV-ACE-02',
    nome: 'Amuleto Relíquia: God of Fear and Hunger',
    id_categoria: 'acessorios',
    id_drop: 'drop-01',
    drop_nome: "Drop I: Ma'habre",
    preco: 139.90,
    estoque: 10,
    cor: 'Bronze Medieval Escurecido',
    tamanhos: ['Corrente 65cm'],
    tamanho_selecionado: 'Corrente 65cm',
    tag: 'DROP ATIVO',
    descricao: 'Medalhão fundido em metal maciço retratando a ascensão da deusa da dor e sobrevivência. Acompanha corrente veneziana encorpada de 4mm com fecho lagosta reforçado.',
    detalhes: [
      'Pingente de 3.5cm de diâmetro em bronze patinado',
      'Corrente em aço cirúrgico 316L que não oxida e não desbota',
      'Resistente à água e ao suor',
      'Polimento rústico artesanal'
    ],
    imagens: [
      'img/acessorios/colar-amulet-frente.jpg',
      'img/acessorios/colar-amulet-lado.jpg',
      'img/acessorios/colar-amulet-costas.jpg'
    ]
  },
  {
    id_produto: 'STV-ACE-03',
    nome: 'Cinto Tático Black Iron Spikes & Buckle',
    id_categoria: 'acessorios',
    id_drop: 'drop-02',
    drop_nome: 'Drop II: Eclipse',
    preco: 149.90,
    estoque: 9,
    cor: 'Couro Bovino Preto & Ferro',
    tamanhos: ['P (85-95cm)', 'M (95-105cm)', 'G (105-115cm)'],
    tamanho_selecionado: 'M (95-105cm)',
    tag: 'NOVO',
    descricao: 'Cinto em fita de couro legítimo com 4cm de largura. Fivela forjada em ferro com geometria medieval inspirada nas armaduras do bando do falcão.',
    detalhes: [
      'Couro soleta genuíno 3.8mm de espessura',
      'Fivela maciça fundida com revestimento anticorrosivo',
      'Passador em aço escovado com entalhe rúnico',
      '7 furos para regulagem com ilhoses reforçados'
    ],
    imagens: [
      'img/acessorios/cinto-iron-frente.jpg',
      'img/acessorios/cinto-iron-lado.jpg',
      'img/acessorios/cinto-iron-detalhes.jpg'
    ]
  },

  /* ==========================================================================
     [SEÇÃO - NOVO PRODUTO 1]: Personalize as informações do seu produto abaixo
     ========================================================================== */
  {
    id_produto: 'STV-CAM-05',
    nome: 'Camiseta Heavyweight Vazio Ancestral (Novo Produto)',
    id_categoria: 'camisetas', // 'camisetas', 'bones' ou 'acessorios'
    id_drop: 'drop-01',        // 'drop-01' (Ma'habre) ou 'drop-02' (Eclipse)
    drop_nome: "Drop I: Ma'habre",
    preco: 159.90,             // Preço em número com ponto (ex: 159.90)
    estoque: 10,               // Quantidade em estoque
    cor: 'Preto Carvão Vintage',
    tamanhos: ['P', 'M', 'G', 'GG', 'XG'],
    tamanho_selecionado: 'M',
    tag: 'NOVO',               // 'NOVO', 'DROP ATIVO', 'EDIÇÃO LIMITADA', 'DESTAQUE', etc.
    descricao: 'Insira aqui a descrição completa do seu novo produto. Explique o conceito da peça, a modelagem e os diferenciais visuais inspirados no universo Dark RPG.',
    detalhes: [
      'Malha premium 100% algodão encorpado',
      'Gola canelada reforçada de 3cm',
      'Estampa em silk corrosivo de alta durabilidade',
      'Costura reforçada ombro a ombro'
    ],
    imagens: [
      'img/camisetas/tshirt-mahabre-frente.svg',
      'img/camisetas/tshirt-mahabre-costas.svg',
      'img/camisetas/tshirt-mahabre-detalhe.svg'
    ]
  },

  /* ==========================================================================
     [SEÇÃO - NOVO PRODUTO 2]: Personalize as informações do seu produto abaixo
     ========================================================================== */
  {
    id_produto: 'STV-BON-04',
    nome: 'Boné Strapback Sigilo das Sombras (Novo Produto)',
    id_categoria: 'bones',     // 'camisetas', 'bones' ou 'acessorios'
    id_drop: 'drop-02',        // 'drop-01' (Ma'habre) ou 'drop-02' (Eclipse)
    drop_nome: 'Drop II: Eclipse',
    preco: 119.90,             // Preço em número com ponto (ex: 119.90)
    estoque: 12,               // Quantidade em estoque
    cor: 'Preto Desbotado & Carmesim',
    tamanhos: ['Único'],
    tamanho_selecionado: 'Único',
    tag: 'NOVO',               // 'NOVO', 'DROP ATIVO', 'EDIÇÃO LIMITADA', 'DESTAQUE', etc.
    descricao: 'Insira aqui a descrição completa do seu segundo produto. Detalhe materiais, tipo de fecho, bordados e acabamentos rústicos da peça.',
    detalhes: [
      'Sarja 100% algodão pré-lavada e macia',
      'Bordado rúnico de alta resolução na parte frontal',
      'Fecho ajustável tipo strapback em fivela de latão oxidado',
      'Fita interna personalizada Starvation'
    ],
    imagens: [
      'img/bones/bone-torment-frente.svg',
      'img/bones/bone-torment-costas.svg',
      'img/bones/bone-torment-detalhe.svg'
    ]
  }
];

