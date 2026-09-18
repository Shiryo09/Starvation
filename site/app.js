/**
 * STARVATION — Aplicação Principal
 * Catálogo Dark RPG inspirado em Fear & Hunger, Kentaro Miura e Alternazero.
 * Gerenciamento de Estado, Carrinho, Multi-Imagens, Login/Autenticação e Pedidos (conforme MER).
 */

// Contas e Pedidos de Exemplo Inicial (Inicializados no localStorage se vazios)
const USUARIOS_PADRAO = [
  {
    id_cliente: 'CLI-847291',
    nome: 'Guts de Midland',
    email: 'guts@berserk.com',
    telefone: '(11) 98765-4321',
    endereco: 'Rua do Espadachim Negro, 108 - Bairro do Eclipse, Midland',
    senha: '123'
  },
  {
    id_cliente: 'CLI-519302',
    nome: 'Ragnvaldr Merciless',
    email: 'ragnvaldr@fearhunger.com',
    telefone: '(41) 99123-4567',
    endereco: 'Masmorras Antigas de Ma\'habre, Nível 3',
    senha: '123'
  }
];

const PEDIDOS_PADRAO = [
  {
    id_pedido: 'STV-2026-8941',
    id_cliente: 'CLI-847291',
    cliente_nome: 'Guts de Midland',
    cliente_email: 'guts@berserk.com',
    cliente_telefone: '(11) 98765-4321',
    endereco_entrega: 'Rua do Espadachim Negro, 108 - Bairro do Eclipse, Midland',
    observacoes: 'Entregar na forja do ferreiro Godo.',
    data_pedido: '2026-09-01T14:20:00.000Z',
    data_formatada: '01/09/2026 às 14:20',
    status: 'Entregue nas Sombras',
    total: 399.80,
    itens: [
      {
        id_produto: 'STV-CAM-02',
        nome: 'Camiseta Heavyweight The Eclipse / God Hand',
        cor: 'Carvão Mineral',
        tamanho: 'GG',
        imagem: 'img/camisetas/tshirt-eclipse-frente.svg',
        quantidade: 1,
        preco_unitario: 169.90,
        subtotal: 169.90
      },
      {
        id_produto: 'STV-ACE-01',
        nome: "Anel Maciço Behelit's Awakening 925",
        cor: 'Prata Velha Oxidada',
        tamanho: '24',
        imagem: 'img/acessorios/anel-behelit-frente.svg',
        quantidade: 1,
        preco_unitario: 229.90,
        subtotal: 229.90
      }
    ]
  }
];

// Estado Global da Aplicação
const appState = {
  categoriaAtiva: 'todas',
  dropAtivo: 'todos',
  termoBusca: '',
  ordenacao: 'padrao',
  carrinho: [],
  clienteAtual: null,
  mostrarTodosPedidos: false,
  produtoModal: null,
  imagemAtivaModalIndex: 0
};

// Formatação Monetária BRL
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  carregarEstadoLocal();
  iniciarContadorDrop();
  renderizarBotoesCategorias();
  renderizarCatalogo();
  configurarEventosGlobais();
  atualizarBadgeCarrinho();
  atualizarUIUsuario();
  iniciarSliderLookbook();
});

/* ==========================================================================
   PERSISTÊNCIA LOCAL (localStorage)
   ========================================================================== */

function obterUsuariosCadastrados() {
  try {
    const usuarios = localStorage.getItem('starvation_usuarios');
    if (usuarios) {
      return JSON.parse(usuarios);
    }
  } catch (e) {
    console.error('Erro ao ler usuários', e);
  }
  // Se não houver, inicializa com os padrões
  salvarUsuarios(USUARIOS_PADRAO);
  return USUARIOS_PADRAO;
}

function salvarUsuarios(usuarios) {
  try {
    localStorage.setItem('starvation_usuarios', JSON.stringify(usuarios));
  } catch (e) {
    console.error('Erro ao salvar usuários', e);
  }
}

function carregarEstadoLocal() {
  try {
    // Garante que o banco de usuários existe
    obterUsuariosCadastrados();

    // Carrega sessão ativa
    const usuarioAtivo = localStorage.getItem('starvation_usuario_ativo');
    if (usuarioAtivo) {
      appState.clienteAtual = JSON.parse(usuarioAtivo);
    }

    // Carrega carrinho
    const cartSalvo = localStorage.getItem('starvation_carrinho');
    if (cartSalvo) {
      appState.carrinho = JSON.parse(cartSalvo);
    }

    // Garante que pedidos iniciais existem
    const pedidosSalvos = localStorage.getItem('starvation_pedidos');
    if (!pedidosSalvos) {
      localStorage.setItem('starvation_pedidos', JSON.stringify(PEDIDOS_PADRAO));
    }
  } catch (e) {
    console.error('Erro ao ler localStorage', e);
  }
}

function salvarCarrinhoLocal() {
  try {
    localStorage.setItem('starvation_carrinho', JSON.stringify(appState.carrinho));
  } catch (e) {
    console.error('Erro ao salvar carrinho', e);
  }
}

function salvarSessaoUsuario(usuario) {
  try {
    if (usuario) {
      localStorage.setItem('starvation_usuario_ativo', JSON.stringify(usuario));
      appState.clienteAtual = usuario;
    } else {
      localStorage.removeItem('starvation_usuario_ativo');
      appState.clienteAtual = null;
    }
    atualizarUIUsuario();
  } catch (e) {
    console.error('Erro ao alterar sessão', e);
  }
}

function obterPedidosSalvos() {
  try {
    const pedidos = localStorage.getItem('starvation_pedidos');
    return pedidos ? JSON.parse(pedidos) : [];
  } catch (e) {
    console.error('Erro ao ler pedidos', e);
    return [];
  }
}

function salvarNovoPedido(novoPedido) {
  try {
    const pedidos = obterPedidosSalvos();
    pedidos.unshift(novoPedido);
    localStorage.setItem('starvation_pedidos', JSON.stringify(pedidos));
    return true;
  } catch (e) {
    console.error('Erro ao salvar pedido', e);
    return false;
  }
}

/* ==========================================================================
   AUTENTICAÇÃO: LOGIN, REGISTRO & PERFIL DE CLIENTE
   ========================================================================== */

function abrirModalAuth(abaPadrao = 'login') {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  if (appState.clienteAtual) {
    alternarAbaAuth('profile');
  } else {
    alternarAbaAuth(abaPadrao);
  }

  limparMensagensAuth();
  modal.showModal();
  document.body.classList.add('modal-open');
}

function fecharModalAuth() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.close();
    document.body.classList.remove('modal-open');
  }
  limparMensagensAuth();
}

function alternarAbaAuth(aba) {
  const tabs = document.querySelectorAll('.auth-tab');
  const panels = document.querySelectorAll('.auth-tab-panel');

  tabs.forEach(t => {
    t.classList.toggle('active', t.getAttribute('onclick')?.includes(aba));
  });

  panels.forEach(p => {
    p.classList.toggle('active', p.id === `panel-auth-${aba}`);
  });

  limparMensagensAuth();
}

function limparMensagensAuth() {
  const loginFeedback = document.getElementById('login-feedback');
  const regFeedback = document.getElementById('register-feedback');
  if (loginFeedback) {
    loginFeedback.style.display = 'none';
    loginFeedback.textContent = '';
    loginFeedback.className = 'auth-feedback-msg';
  }
  if (regFeedback) {
    regFeedback.style.display = 'none';
    regFeedback.textContent = '';
    regFeedback.className = 'auth-feedback-msg';
  }
}

function preencherLoginDemo() {
  document.getElementById('login-email').value = 'guts@berserk.com';
  document.getElementById('login-senha').value = '123';
  limparMensagensAuth();
}

function executarLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const senha = document.getElementById('login-senha').value.trim();
  const feedback = document.getElementById('login-feedback');

  const usuarios = obterUsuariosCadastrados();
  const usuario = usuarios.find(u => u.email.toLowerCase() === email && u.senha === senha);

  if (!usuario) {
    feedback.className = 'auth-feedback-msg error';
    feedback.textContent = 'E-mail ou senha incorretos. Verifique suas credenciais.';
    feedback.style.display = 'flex';
    return;
  }

  // Sucesso no login
  salvarSessaoUsuario(usuario);
  feedback.className = 'auth-feedback-msg success';
  feedback.textContent = `Seja bem-vindo de volta, ${usuario.nome}!`;
  feedback.style.display = 'flex';

  setTimeout(() => {
    fecharModalAuth();
  }, 700);
}

function executarRegistro(e) {
  e.preventDefault();
  const nome = document.getElementById('reg-nome').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const telefone = document.getElementById('reg-telefone').value.trim();
  const endereco = document.getElementById('reg-endereco').value.trim();
  const senha = document.getElementById('reg-senha').value.trim();
  const senhaConfirm = document.getElementById('reg-senha-confirm').value.trim();
  const feedback = document.getElementById('register-feedback');

  if (senha !== senhaConfirm) {
    feedback.className = 'auth-feedback-msg error';
    feedback.textContent = 'As senhas informadas não coincidem.';
    feedback.style.display = 'flex';
    return;
  }

  if (senha.length < 3) {
    feedback.className = 'auth-feedback-msg error';
    feedback.textContent = 'A senha deve conter no mínimo 3 caracteres.';
    feedback.style.display = 'flex';
    return;
  }

  const usuarios = obterUsuariosCadastrados();
  if (usuarios.some(u => u.email.toLowerCase() === email)) {
    feedback.className = 'auth-feedback-msg error';
    feedback.textContent = 'Este e-mail já está cadastrado no acervo.';
    feedback.style.display = 'flex';
    return;
  }

  const novoUsuario = {
    id_cliente: 'CLI-' + Math.floor(100000 + Math.random() * 900000),
    nome,
    email,
    telefone,
    endereco,
    senha
  };

  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);
  salvarSessaoUsuario(novoUsuario);

  feedback.className = 'auth-feedback-msg success';
  feedback.textContent = `Conta criada com sucesso! Alma gravada no livro.`;
  feedback.style.display = 'flex';

  setTimeout(() => {
    fecharModalAuth();
  }, 800);
}

function executarLogout() {
  salvarSessaoUsuario(null);
  fecharModalAuth();
  alert('Você encerrou sua sessão no templo.');
  renderizarHistoricoPedidos();
}

function atualizarUIUsuario() {
  const headerBtn = document.getElementById('btn-header-auth');
  const headerLabel = document.getElementById('header-auth-label');
  const tabProfile = document.getElementById('tab-btn-profile');
  const tabLogin = document.getElementById('tab-btn-login');
  const tabRegister = document.getElementById('tab-btn-register');

  if (appState.clienteAtual) {
    // Usuário Logado
    const primeiroNome = appState.clienteAtual.nome.split(' ')[0].toUpperCase();
    if (headerLabel) {
      headerLabel.textContent = primeiroNome;
    }
    if (headerBtn) {
      headerBtn.title = `Conectado como ${appState.clienteAtual.nome} (Ver Perfil)`;
      headerBtn.classList.add('logged-in');
    }

    // Preencher dados do Perfil no Modal
    document.getElementById('profile-user-name').textContent = appState.clienteAtual.nome;
    document.getElementById('profile-user-id').textContent = appState.clienteAtual.id_cliente;
    document.getElementById('profile-user-email').textContent = appState.clienteAtual.email;
    document.getElementById('profile-user-phone').textContent = appState.clienteAtual.telefone;
    document.getElementById('profile-user-address').textContent = appState.clienteAtual.endereco || 'Não cadastrado';

    if (tabProfile) tabProfile.style.display = 'block';
    if (tabLogin) tabLogin.style.display = 'none';
    if (tabRegister) tabRegister.style.display = 'none';

    // Banner no Checkout
    const checkoutBanner = document.getElementById('checkout-auth-banner');
    if (checkoutBanner) {
      checkoutBanner.innerHTML = `
        <span>⚔ Conectado como <strong>${appState.clienteAtual.nome}</strong> (${appState.clienteAtual.email}). Seus dados foram preenchidos.</span>
      `;
      checkoutBanner.style.display = 'flex';
    }
  } else {
    // Deslogado
    if (headerLabel) {
      headerLabel.textContent = 'ENTRAR';
    }
    if (headerBtn) {
      headerBtn.title = 'Entrar na Conta / Registrar';
      headerBtn.classList.remove('logged-in');
    }

    if (tabProfile) tabProfile.style.display = 'none';
    if (tabLogin) tabLogin.style.display = 'block';
    if (tabRegister) tabRegister.style.display = 'block';

    const checkoutBanner = document.getElementById('checkout-auth-banner');
    if (checkoutBanner) {
      checkoutBanner.style.display = 'none';
      checkoutBanner.innerHTML = '';
    }
  }
}

/* ==========================================================================
   RENDERIZAÇÃO DO CATÁLOGO & MULTI-IMAGENS
   ========================================================================== */

function renderizarBotoesCategorias() {
  const container = document.getElementById('category-filter-list');
  if (!container) return;

  container.innerHTML = CATEGORIAS.map(cat => `
    <button type="button" 
            class="filter-pill ${appState.categoriaAtiva === cat.id_categoria ? 'active' : ''}" 
            data-category="${cat.id_categoria}">
      ${cat.nome}
    </button>
  `).join('');

  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.categoriaAtiva = btn.getAttribute('data-category');
      renderizarCatalogo();
    });
  });
}

function filtrarProdutos() {
  return PRODUTOS.filter(prod => {
    // Filtro de Categoria
    const matchCat = appState.categoriaAtiva === 'todas' || prod.id_categoria === appState.categoriaAtiva;
    
    // Filtro de Drop
    const matchDrop = appState.dropAtivo === 'todos' || prod.id_drop === appState.dropAtivo;
    
    // Filtro de Busca
    const matchBusca = !appState.termoBusca || 
      prod.nome.toLowerCase().includes(appState.termoBusca.toLowerCase()) ||
      prod.cor.toLowerCase().includes(appState.termoBusca.toLowerCase()) ||
      prod.descricao.toLowerCase().includes(appState.termoBusca.toLowerCase()) ||
      prod.drop_nome.toLowerCase().includes(appState.termoBusca.toLowerCase());

    return matchCat && matchDrop && matchBusca;
  }).sort((a, b) => {
    if (appState.ordenacao === 'menor-preco') return a.preco - b.preco;
    if (appState.ordenacao === 'maior-preco') return b.preco - a.preco;
    if (appState.ordenacao === 'nome') return a.nome.localeCompare(b.nome);
    return 0; // Padrão
  });
}

function renderizarCatalogo() {
  const grid = document.getElementById('product-grid');
  const counter = document.getElementById('products-count');
  if (!grid) return;

  const produtosFiltrados = filtrarProdutos();
  if (counter) {
    counter.textContent = `${produtosFiltrados.length} ${produtosFiltrados.length === 1 ? 'item encontrado' : 'itens encontrados'}`;
  }

  if (produtosFiltrados.length === 0) {
    grid.innerHTML = `
      <div class="empty-catalog">
        <div class="empty-sigil">
          <img src="../site/img/banners/fear-and-hunger-coin-flip.gif" alt="Nenhum item encontrado" class="empty-gif" style="display: none;" onload="this.style.display='block'; const s = this.nextElementSibling; if(s) s.style.display='none';">
          <span class="empty-fallback-skull">☠</span>
        </div>
        <h3>Nenhum artefato encontrado</h3>
        <p>Nenhuma relíquia condizente com os filtros selecionados nas profundezas do catálogo.</p>
        <button type="button" class="btn btn-outline" id="btn-reset-filters">Limpar Filtros</button>
      </div>
    `;
    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        appState.categoriaAtiva = 'todas';
        appState.dropAtivo = 'todos';
        appState.termoBusca = '';
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
        renderizarBotoesCategorias();
        renderizarCatalogo();
      });
    }
    return;
  }

  grid.innerHTML = produtosFiltrados.map(prod => {
    const imgPrincipal = prod.imagens[0];
    const imgSecundaria = prod.imagens[1] || prod.imagens[0];
    const temMultiImagens = prod.imagens.length > 1;

    return `
      <article class="product-card" data-id="${prod.id_produto}">
        <!-- Container de Multi-Imagens (Frente / Costas / Detalhe) -->
        <div class="card-image-wrap" onclick="abrirModalProduto('${prod.id_produto}')">
          <img src="${imgPrincipal}" 
               alt="${prod.nome} - Frente" 
               class="product-img img-primary" 
               loading="lazy" />
          
          ${temMultiImagens ? `
            <img src="${imgSecundaria}" 
                 alt="${prod.nome} - Costas/Detalhes" 
                 class="product-img img-secondary" 
                 loading="lazy" />
          ` : ''}

          <!-- Badges de Status / Drop -->
          <div class="card-badges">
            <span class="badge-drop">${prod.drop_nome}</span>
            ${prod.estoque <= 6 ? `<span class="badge-stock">Restam ${prod.estoque}</span>` : ''}
          </div>

          <!-- Indicador de Galeria de Fotos -->
          <div class="photo-counter-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
            </svg>
            <span>${prod.imagens.length} ângulos</span>
          </div>

          <!-- Overlay Rápido com botão de visualização -->
          <div class="card-quick-actions">
            <button type="button" class="btn-quick-view" onclick="event.stopPropagation(); abrirModalProduto('${prod.id_produto}')">
              VISUALIZAR PEÇA
            </button>
          </div>
        </div>

        <!-- Informações do Produto -->
        <div class="card-info">
          <div class="card-header-meta">
            <span class="card-category">${prod.id_categoria.toUpperCase()}</span>
            <span class="card-color">${prod.cor}</span>
          </div>

          <h3 class="card-title" onclick="abrirModalProduto('${prod.id_produto}')">${prod.nome}</h3>
          
          <div class="card-price-row">
            <span class="card-price">${formatarMoeda(prod.preco)}</span>
            <span class="card-installments">ou 3x de ${formatarMoeda(prod.preco / 3)}</span>
          </div>

          <!-- Seletor Rápido de Tamanho e Ação de Adicionar -->
          <div class="card-sizes-row">
            ${prod.tamanhos.map(tam => `
              <span class="size-chip" title="Tamanho ${tam}">${tam}</span>
            `).join('')}
          </div>

          <div class="card-action-bottom">
            <button type="button" class="btn btn-card-buy" onclick="adicionarAoCarrinhoRapido('${prod.id_produto}')">
              <span>+ ADICIONAR AO PEDIDO</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/* ==========================================================================
   MODAL DE DETALHES DO PRODUTO (COM GALERIA MULTI-IMAGEM)
   ========================================================================== */

function abrirModalProduto(idProduto) {
  const produto = PRODUTOS.find(p => p.id_produto === idProduto);
  if (!produto) return;

  appState.produtoModal = {
    ...produto,
    tamanhoSelecionado: produto.tamanhos[0],
    quantidadeSelecionada: 1
  };
  appState.imagemAtivaModalIndex = 0;

  atualizarConteudoModalProduto();
  
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.showModal();
    document.body.classList.add('modal-open');
  }
}

function fecharModalProduto() {
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.close();
    document.body.classList.remove('modal-open');
  }
}

function atualizarConteudoModalProduto() {
  const prod = appState.produtoModal;
  if (!prod) return;

  // Imagem Principal Ativa
  const mainImageEl = document.getElementById('modal-main-image');
  if (mainImageEl) {
    mainImageEl.src = prod.imagens[appState.imagemAtivaModalIndex] || prod.imagens[0];
    mainImageEl.alt = `${prod.nome} - Imagem ${appState.imagemAtivaModalIndex + 1}`;
  }

  // Miniaturas (Thumbnails)
  const thumbsContainer = document.getElementById('modal-thumbs-list');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = prod.imagens.map((imgSrc, idx) => `
      <button type="button" 
              class="thumb-item ${idx === appState.imagemAtivaModalIndex ? 'active' : ''}" 
              onclick="trocarImagemModal(${idx})" 
              aria-label="Ver imagem ${idx + 1}">
        <img src="${imgSrc}" alt="Miniatura ${idx + 1}" />
      </button>
    `).join('');
  }

  // Textos e Metas
  document.getElementById('modal-product-tag').textContent = `${prod.drop_nome} • ${prod.tag}`;
  document.getElementById('modal-product-title').textContent = prod.nome;
  document.getElementById('modal-product-price').textContent = formatarMoeda(prod.preco);
  document.getElementById('modal-product-color').textContent = `Cor: ${prod.cor}`;
  document.getElementById('modal-product-desc').textContent = prod.descricao;
  document.getElementById('modal-product-stock').textContent = `Estoque disponível: ${prod.estoque} unidades`;

  // Detalhes / Especificações
  const detailsList = document.getElementById('modal-product-specs');
  if (detailsList && prod.detalhes) {
    detailsList.innerHTML = prod.detalhes.map(d => `<li>${d}</li>`).join('');
  }

  // Seletor de Tamanhos
  const sizesContainer = document.getElementById('modal-sizes-container');
  if (sizesContainer) {
    sizesContainer.innerHTML = prod.tamanhos.map(tam => `
      <button type="button" 
              class="modal-size-btn ${tam === prod.tamanhoSelecionado ? 'active' : ''}" 
              onclick="selecionarTamanhoModal('${tam}')">
        ${tam}
      </button>
    `).join('');
  }

  // Quantidade
  const qtyInput = document.getElementById('modal-qty-value');
  if (qtyInput) {
    qtyInput.textContent = prod.quantidadeSelecionada;
  }
}

function trocarImagemModal(index) {
  appState.imagemAtivaModalIndex = index;
  const prod = appState.produtoModal;
  const mainImageEl = document.getElementById('modal-main-image');
  if (mainImageEl && prod) {
    mainImageEl.src = prod.imagens[index];
  }
  const thumbs = document.querySelectorAll('#modal-thumbs-list .thumb-item');
  thumbs.forEach((t, idx) => {
    t.classList.toggle('active', idx === index);
  });
}

function selecionarTamanhoModal(tam) {
  if (!appState.produtoModal) return;
  appState.produtoModal.tamanhoSelecionado = tam;
  const btns = document.querySelectorAll('#modal-sizes-container .modal-size-btn');
  btns.forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === tam);
  });
}

function alterarQuantidadeModal(delta) {
  if (!appState.produtoModal) return;
  let novaQtd = appState.produtoModal.quantidadeSelecionada + delta;
  if (novaQtd < 1) novaQtd = 1;
  if (novaQtd > appState.produtoModal.estoque) novaQtd = appState.produtoModal.estoque;

  appState.produtoModal.quantidadeSelecionada = novaQtd;
  const qtyEl = document.getElementById('modal-qty-value');
  if (qtyEl) qtyEl.textContent = novaQtd;
}

function adicionarAoCarrinhoDoModal() {
  const prod = appState.produtoModal;
  if (!prod) return;

  adicionarItemCarrinho({
    id_produto: prod.id_produto,
    nome: prod.nome,
    preco_unitario: prod.preco, // PREÇO NO MOMENTO DA COMPRA CONFORME MER
    tamanho: prod.tamanhoSelecionado,
    quantidade: prod.quantidadeSelecionada,
    imagem: prod.imagens[0],
    cor: prod.cor,
    estoqueMax: prod.estoque,
    id_categoria: prod.id_categoria
  });

  fecharModalProduto();
  abrirDrawerCarrinho();
}

function adicionarAoCarrinhoRapido(idProduto) {
  const prod = PRODUTOS.find(p => p.id_produto === idProduto);
  if (!prod) return;

  // Adiciona com o primeiro tamanho disponível
  adicionarItemCarrinho({
    id_produto: prod.id_produto,
    nome: prod.nome,
    preco_unitario: prod.preco,
    tamanho: prod.tamanhos[0],
    quantidade: 1,
    imagem: prod.imagens[0],
    cor: prod.cor,
    estoqueMax: prod.estoque,
    id_categoria: prod.id_categoria
  });

  abrirDrawerCarrinho();
}

/* ==========================================================================
   CARRINHO DE COMPRAS & REGRAS DO MER
   ========================================================================== */

function adicionarItemCarrinho(novoItem) {
  // Procura se o mesmo produto e tamanho já estão no carrinho
  const indexExistente = appState.carrinho.findIndex(
    item => item.id_produto === novoItem.id_produto && item.tamanho === novoItem.tamanho
  );

  if (indexExistente > -1) {
    const qtdTotal = appState.carrinho[indexExistente].quantidade + novoItem.quantidade;
    appState.carrinho[indexExistente].quantidade = Math.min(qtdTotal, novoItem.estoqueMax || 99);
  } else {
    appState.carrinho.push(novoItem);
  }

  salvarCarrinhoLocal();
  atualizarBadgeCarrinho();
  renderizarItensCarrinho();
}

function alterarQuantidadeCarrinho(index, delta) {
  if (!appState.carrinho[index]) return;
  const item = appState.carrinho[index];
  item.quantidade += delta;

  if (item.quantidade <= 0) {
    appState.carrinho.splice(index, 1);
  }

  salvarCarrinhoLocal();
  atualizarBadgeCarrinho();
  renderizarItensCarrinho();
}

function removerItemCarrinho(index) {
  appState.carrinho.splice(index, 1);
  salvarCarrinhoLocal();
  atualizarBadgeCarrinho();
  renderizarItensCarrinho();
}

function calcularTotalCarrinho() {
  return appState.carrinho.reduce((acc, item) => {
    return acc + (item.quantidade * item.preco_unitario);
  }, 0);
}

function atualizarBadgeCarrinho() {
  const badges = document.querySelectorAll('.cart-counter-badge');
  const totalItens = appState.carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  badges.forEach(b => {
    b.textContent = totalItens;
    b.style.display = totalItens > 0 ? 'inline-flex' : 'none';
  });
}

function renderizarItensCarrinho() {
  const container = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal-val');
  const btnCheckout = document.getElementById('btn-cart-checkout');
  if (!container) return;

  const total = calcularTotalCarrinho();
  if (subtotalEl) subtotalEl.textContent = formatarMoeda(total);

  if (appState.carrinho.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">⛓</div>
        <p class="cart-empty-title">Sua sacola do vazio está desocupada.</p>
        <p class="cart-empty-sub">Escolha peças dos drops ativos para iniciar seu pedido.</p>
      </div>
    `;
    if (btnCheckout) btnCheckout.disabled = true;
    return;
  }

  if (btnCheckout) btnCheckout.disabled = false;

  container.innerHTML = appState.carrinho.map((item, index) => {
    const itemSubtotal = item.quantidade * item.preco_unitario;

    return `
      <div class="cart-item">
        <img src="${item.imagem}" alt="${item.nome}" class="cart-item-img" />
        <div class="cart-item-info">
          <div class="cart-item-title-row">
            <h4 class="cart-item-title">${item.nome}</h4>
            <button type="button" class="btn-remove-item" onclick="removerItemCarrinho(${index})" title="Remover item">
              &times;
            </button>
          </div>
          <div class="cart-item-meta">
            <span>Tamanho: <strong>${item.tamanho}</strong></span>
            <span>Cor: ${item.cor}</span>
          </div>
          <div class="cart-item-price-row">
            <span class="cart-item-unit-price">${formatarMoeda(item.preco_unitario)}</span>
            
            <div class="qty-stepper">
              <button type="button" onclick="alterarQuantidadeCarrinho(${index}, -1)">-</button>
              <span>${item.quantidade}</span>
              <button type="button" onclick="alterarQuantidadeCarrinho(${index}, 1)">+</button>
            </div>
            
            <span class="cart-item-subtotal">${formatarMoeda(itemSubtotal)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function abrirDrawerCarrinho() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (drawer && backdrop) {
    renderizarItensCarrinho();
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.classList.add('drawer-open');
  }
}

function fecharDrawerCarrinho() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('drawer-open');
  }
}

/* ==========================================================================
   FINALIZAÇÃO DO PEDIDO (CHECKOUT - CONFORME MER)
   ========================================================================== */

function abrirCheckoutModal() {
  if (appState.carrinho.length === 0) return;

  fecharDrawerCarrinho();
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;

  // Preencher formulário com o cliente logado ou salvo
  if (appState.clienteAtual) {
    document.getElementById('checkout-nome').value = appState.clienteAtual.nome || '';
    document.getElementById('checkout-email').value = appState.clienteAtual.email || '';
    document.getElementById('checkout-telefone').value = appState.clienteAtual.telefone || '';
    document.getElementById('checkout-endereco').value = appState.clienteAtual.endereco || '';
  }

  atualizarUIUsuario();
  renderizarResumoCheckout();
  modal.showModal();
  document.body.classList.add('modal-open');
}

function fecharCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.close();
    document.body.classList.remove('modal-open');
  }
}

function renderizarResumoCheckout() {
  const container = document.getElementById('checkout-items-summary');
  const totalEl = document.getElementById('checkout-total-val');
  if (!container) return;

  const total = calcularTotalCarrinho();
  if (totalEl) totalEl.textContent = formatarMoeda(total);

  container.innerHTML = appState.carrinho.map(item => `
    <div class="checkout-item-line">
      <div class="checkout-item-title-col">
        <strong>${item.nome}</strong> (${item.tamanho})
        <div class="checkout-item-sub">Qtd: ${item.quantidade} &times; ${formatarMoeda(item.preco_unitario)} (preço no pedido)</div>
      </div>
      <div class="checkout-item-subtotal">
        ${formatarMoeda(item.quantidade * item.preco_unitario)}
      </div>
    </div>
  `).join('');
}

function processarFinalizacaoPedido(e) {
  e.preventDefault();

  const nome = document.getElementById('checkout-nome').value.trim();
  const email = document.getElementById('checkout-email').value.trim().toLowerCase();
  const telefone = document.getElementById('checkout-telefone').value.trim();
  const endereco = document.getElementById('checkout-endereco').value.trim();
  const obs = document.getElementById('checkout-obs').value.trim();

  if (!nome || !email || !telefone) {
    alert('Por favor, preencha todos os campos obrigatórios para identificação do cliente.');
    return;
  }

  // Criação ou associação da Entidade Cliente (conforme MER)
  let clienteId = appState.clienteAtual?.id_cliente;
  if (!clienteId) {
    // Procura se já existe um usuário cadastrado com esse e-mail
    const usuarios = obterUsuariosCadastrados();
    const existente = usuarios.find(u => u.email.toLowerCase() === email);
    if (existente) {
      clienteId = existente.id_cliente;
    } else {
      clienteId = 'CLI-' + Math.floor(100000 + Math.random() * 900000);
    }
  }

  const cliente = {
    id_cliente: clienteId,
    nome,
    email,
    telefone,
    endereco
  };

  // Se não estiver logado, vincula como cliente local
  if (!appState.clienteAtual) {
    salvarSessaoUsuario(cliente);
  }

  // Criação dos ItensPedido (conforme MER: registra quantidade e preço unitário no momento da compra)
  const itensPedido = appState.carrinho.map(item => ({
    id_produto: item.id_produto,
    nome: item.nome,
    cor: item.cor,
    tamanho: item.tamanho,
    imagem: item.imagem,
    quantidade: item.quantidade,
    preco_unitario: item.preco_unitario, // PREÇO CONGELADO NO INSTANTE DA COMPRA
    subtotal: item.quantidade * item.preco_unitario
  }));

  const totalCalculado = itensPedido.reduce((acc, it) => acc + it.subtotal, 0);

  // Criação da Entidade Pedido (conforme MER)
  const novoPedido = {
    id_pedido: 'STV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
    id_cliente: cliente.id_cliente,
    cliente_nome: cliente.nome,
    cliente_email: cliente.email,
    cliente_telefone: cliente.telefone,
    endereco_entrega: endereco,
    observacoes: obs,
    data_pedido: new Date().toISOString(),
    data_formatada: new Date().toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: 'Em Separação no Templo',
    total: totalCalculado,
    itens: itensPedido
  };

  const sucesso = salvarNovoPedido(novoPedido);
  if (!sucesso) {
    alert('Houve um erro ao registrar seu pedido. Tente novamente.');
    return;
  }

  // Limpa o carrinho
  appState.carrinho = [];
  salvarCarrinhoLocal();
  atualizarBadgeCarrinho();
  fecharCheckoutModal();

  // Exibir Confirmação de Sucesso
  exibirConfirmacaoPedido(novoPedido);
}

function exibirConfirmacaoPedido(pedido) {
  const modal = document.getElementById('success-order-modal');
  if (!modal) return;

  document.getElementById('success-order-id').textContent = pedido.id_pedido;
  document.getElementById('success-client-name').textContent = pedido.cliente_nome;
  document.getElementById('success-order-total').textContent = formatarMoeda(pedido.total);
  document.getElementById('success-order-date').textContent = pedido.data_formatada;

  const itensList = document.getElementById('success-order-items-list');
  if (itensList) {
    itensList.innerHTML = pedido.itens.map(item => `
      <li>
        <span>${item.quantidade}x ${item.nome} (Tam: ${item.tamanho})</span>
        <strong>${formatarMoeda(item.preco_unitario)} un. — Subtotal: ${formatarMoeda(item.subtotal)}</strong>
      </li>
    `).join('');
  }

  modal.showModal();
  document.body.classList.add('modal-open');
}

/* ==========================================================================
   CONSULTA DE PEDIDOS ("MEUS PEDIDOS" - REGRAS DE NEGÓCIO)
   ========================================================================== */

function abrirModalMeusPedidos() {
  const modal = document.getElementById('orders-history-modal');
  if (!modal) return;

  renderizarHistoricoPedidos();
  modal.showModal();
  document.body.classList.add('modal-open');
}

function fecharModalMeusPedidos() {
  const modal = document.getElementById('orders-history-modal');
  if (modal) {
    modal.close();
    document.body.classList.remove('modal-open');
  }
}

function renderizarHistoricoPedidos() {
  const container = document.getElementById('orders-history-container');
  const userBadge = document.getElementById('orders-user-badge');
  if (!container) return;

  const todosPedidos = obterPedidosSalvos();
  let pedidosFiltrados = todosPedidos;

  // Se o usuário estiver autenticado e não escolheu ver todos, filtra por seu ID ou email
  if (appState.clienteAtual && !appState.mostrarTodosPedidos) {
    pedidosFiltrados = todosPedidos.filter(p => 
      p.id_cliente === appState.clienteAtual.id_cliente || 
      p.cliente_email?.toLowerCase() === appState.clienteAtual.email?.toLowerCase()
    );

    if (userBadge) {
      userBadge.innerHTML = `
        <span>⚔ Exibindo pedidos de <strong>${appState.clienteAtual.nome}</strong> (${appState.clienteAtual.email})</span>
        <button type="button" class="btn-link-demo" onclick="appState.mostrarTodosPedidos = true; renderizarHistoricoPedidos();">
          (Ver todos os pedidos locais)
        </button>
      `;
    }
  } else if (appState.clienteAtual && appState.mostrarTodosPedidos) {
    if (userBadge) {
      userBadge.innerHTML = `
        <span>Exibindo todos os pedidos do dispositivo.</span>
        <button type="button" class="btn-link-demo" onclick="appState.mostrarTodosPedidos = false; renderizarHistoricoPedidos();">
          (Filtrar apenas os meus)
        </button>
      `;
    }
  } else {
    if (userBadge) {
      userBadge.innerHTML = `
        <span>Exibindo pedidos deste navegador. <a href="javascript:void(0)" onclick="fecharModalMeusPedidos(); abrirModalAuth('login');" style="color:var(--color-gold);text-decoration:underline;">Entre na sua conta</a> para ver pedidos vinculados.</span>
      `;
    }
  }

  if (pedidosFiltrados.length === 0) {
    container.innerHTML = `
      <div class="orders-empty">
        <p>Nenhum pedido encontrado ${appState.clienteAtual && !appState.mostrarTodosPedidos ? 'para esta conta' : 'no acervo'}.</p>
        <span class="orders-empty-tip">Quando você realizar um pedido, ele ficará salvo com todos os registros de preço original no instante da compra.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = pedidosFiltrados.map(ped => `
    <div class="order-history-card">
      <div class="order-card-header">
        <div>
          <span class="order-tag">PEDIDO</span>
          <h4 class="order-code">${ped.id_pedido}</h4>
          <div class="order-meta-date">${ped.data_formatada}</div>
        </div>
        <div class="order-status-box">
          <span class="status-badge">${ped.status}</span>
          <span class="order-total-highlight">${formatarMoeda(ped.total)}</span>
        </div>
      </div>

      <div class="order-card-client-info">
        <span>Cliente: <strong>${ped.cliente_nome}</strong> (${ped.cliente_email})</span>
        ${ped.endereco_entrega ? `<br><small style="color:var(--text-muted)">Entrega: ${ped.endereco_entrega}</small>` : ''}
      </div>

      <!-- Itens do Pedido com Preço Congelado e Quantidade -->
      <div class="order-items-table">
        <h5>Itens Registrados:</h5>
        <ul>
          ${ped.itens.map(item => `
            <li class="order-item-row">
              <span class="item-desc">${item.quantidade}x ${item.nome} — Tam: ${item.tamanho} (${item.cor})</span>
              <span class="item-snapshot-price">${formatarMoeda(item.preco_unitario)} / un. = <strong>${formatarMoeda(item.subtotal)}</strong></span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   TEMPORIZADOR DO DROP MENSAL (COUNTDOWN)
   ========================================================================== */

function iniciarContadorDrop() {
  const dropAtivo = DROPS.find(d => d.ativo) || DROPS[0];
  const targetDate = new Date(dropAtivo.fim_drop).getTime();

  function atualizarRelogio() {
    const agora = new Date().getTime();
    const distancia = targetDate - agora;

    const elDias = document.getElementById('timer-days');
    const elHoras = document.getElementById('timer-hours');
    const elMin = document.getElementById('timer-minutes');
    const elSeg = document.getElementById('timer-seconds');

    if (!elDias || !elHoras || !elMin || !elSeg) return;

    if (distancia < 0) {
      elDias.textContent = '00';
      elHoras.textContent = '00';
      elMin.textContent = '00';
      elSeg.textContent = '00';
      return;
    }

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    elDias.textContent = String(dias).padStart(2, '0');
    elHoras.textContent = String(horas).padStart(2, '0');
    elMin.textContent = String(minutos).padStart(2, '0');
    elSeg.textContent = String(segundos).padStart(2, '0');
  }

  atualizarRelogio();
  setInterval(atualizarRelogio, 1000);
}

/* ==========================================================================
   EVENTOS GLOBAIS E LISTENERS
   ========================================================================== */

function configurarEventosGlobais() {
  // Busca em tempo real
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.termoBusca = e.target.value.trim();
      renderizarCatalogo();
    });
  }

  // Ordenação de produtos
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      appState.ordenacao = e.target.value;
      renderizarCatalogo();
    });
  }

  // Filtro de Drop
  const dropFilter = document.getElementById('drop-filter-select');
  if (dropFilter) {
    dropFilter.addEventListener('change', (e) => {
      appState.dropAtivo = e.target.value;
      renderizarCatalogo();
    });
  }

  // Botões de Carrinho
  document.querySelectorAll('.btn-trigger-cart').forEach(btn => {
    btn.addEventListener('click', abrirDrawerCarrinho);
  });

  const btnCloseDrawer = document.getElementById('btn-close-cart');
  if (btnCloseDrawer) {
    btnCloseDrawer.addEventListener('click', fecharDrawerCarrinho);
  }

  const drawerBackdrop = document.getElementById('drawer-backdrop');
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', fecharDrawerCarrinho);
  }

  // Botão Avançar para Pedido
  const btnCheckout = document.getElementById('btn-cart-checkout');
  if (btnCheckout) {
    btnCheckout.addEventListener('click', abrirCheckoutModal);
  }

  // Formulário de Checkout
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', processarFinalizacaoPedido);
  }

  // Botão Login/Perfil no Header
  const btnHeaderAuth = document.getElementById('btn-header-auth');
  if (btnHeaderAuth) {
    btnHeaderAuth.addEventListener('click', () => {
      abrirModalAuth(appState.clienteAtual ? 'profile' : 'login');
    });
  }

  // Formulários de Login e Registro
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', executarLogin);
  }

  const formRegister = document.getElementById('form-register');
  if (formRegister) {
    formRegister.addEventListener('submit', executarRegistro);
  }

  // Fechar modais com clique fora
  document.querySelectorAll('dialog').forEach(dlg => {
    dlg.addEventListener('click', (e) => {
      const rect = dlg.getBoundingClientRect();
      const clickInside = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      if (!clickInside) {
        dlg.close();
        document.body.classList.remove('modal-open');
      }
    });
  });

  // Botões de "Meus Pedidos"
  document.querySelectorAll('.btn-trigger-orders').forEach(btn => {
    btn.addEventListener('click', abrirModalMeusPedidos);
  });
}

/**
 * ==========================================================================
 * CARROSSEL / SLIDER DO LOOKBOOK EDITORIAL
 * Suporta transição automática com o tempo e navegação por bolinhas clicáveis.
 * Detecta dinamicamente a quantidade de slides adicionados ao HTML.
 * ==========================================================================
 */
function iniciarSliderLookbook() {
  const container = document.getElementById('lookbook-slider');
  if (!container) return;

  const slides = container.querySelectorAll('.lookbook-slide');
  const dotsContainer = document.getElementById('lookbook-dots');
  if (!slides || slides.length === 0) return;

  let slideAtual = 0;
  let timerAutoSlide = null;
  const TEMPO_ROTACAO_MS = 4500; // Tempo de exibição de cada imagem: 4.5 segundos

  function irParaSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.lookbook-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    slideAtual = index;
  }

  function proximoSlide() {
    const proximoIndex = (slideAtual + 1) % slides.length;
    irParaSlide(proximoIndex);
  }

  function reiniciarTimer() {
    if (timerAutoSlide) clearInterval(timerAutoSlide);
    if (slides.length > 1) {
      timerAutoSlide = setInterval(proximoSlide, TEMPO_ROTACAO_MS);
    }
  }

  // Gera as bolinhas clicáveis de acordo com a quantidade de imagens
  if (dotsContainer && slides.length > 1) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `lookbook-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ver imagem ${idx + 1} do Editorial`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        irParaSlide(idx);
        reiniciarTimer();
      });
      dotsContainer.appendChild(dot);
    });
  } else if (dotsContainer) {
    dotsContainer.innerHTML = '';
  }

  // Pausar rotação ao passar o mouse por cima
  container.addEventListener('mouseenter', () => {
    if (timerAutoSlide) clearInterval(timerAutoSlide);
  });

  container.addEventListener('mouseleave', () => {
    reiniciarTimer();
  });

  // Inicia no primeiro slide
  irParaSlide(0);
  reiniciarTimer();
}
