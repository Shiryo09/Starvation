# Guia de Imagens — Starvation Brand

Este diretório foi estruturado para que você possa substituir os placeholders pelas suas próprias fotos de produtos, lookbooks e banners de forma simples e organizada.

---

## 📁 Estrutura de Pastas

```text
site/img/
│
├── banners/          -> Banners principais (hero, drops e lookbook)
│   ├── banner-hero-drop01.jpg      (Recomendado: 1920x800px ou 2560x1080px - Proporção ~21:9 ou 16:9)
│   ├── banner-hero-drop02.jpg
│   └── banner-lookbook.jpg
│
├── drops/            -> Imagens e capas temáticas dos Drops mensais
│   ├── drop-mahabre-cover.jpg      (Recomendado: 800x1000px - Proporção 4:5)
│   └── drop-eclipse-cover.jpg
│
├── camisetas/        -> Fotos das camisetas (frente, costas, detalhes, modelo)
│   ├── camiseta-dungeon-frente.jpg  (Recomendado: 800x1000px - Proporção 4:5)
│   ├── camiseta-dungeon-costas.jpg
│   ├── camiseta-dungeon-detalhe.jpg
│   ├── camiseta-dungeon-modelo.jpg
│   ├── camiseta-gro-goroth-frente.jpg
│   └── camiseta-gro-goroth-costas.jpg
│
├── bones/            -> Fotos dos bonés e gorros
│   ├── bone-eclipse-frente.jpg     (Recomendado: 800x1000px - Proporção 4:5 ou 1:1)
│   ├── bone-eclipse-lateral.jpg
│   └── gorro-vazio-frente.jpg
│
├── acessorios/       -> Fotos de anéis, colares, cintos e relíquias
│   ├── anel-marca-frente.jpg       (Recomendado: 800x1000px ou 1000x1000px - Proporção 1:1 ou 4:5)
│   ├── anel-marca-detalhe.jpg
│   ├── colar-behelit-frente.jpg
│   └── cinto-dungeon-frente.jpg
│
└── placeholders/     -> Placeholders SVG temáticos de alta qualidade (utilizados por padrão)
```

---

## 📐 Especificações Recomendadas

| Tipo de Imagem | Proporção | Dimensões Ideais | Formato Ideal |
| :--- | :--- | :--- | :--- |
| **Produtos (Roupas/Modelos)** | `4:5` | `800 x 1000 px` ou `1200 x 1500 px` | `.webp` ou `.jpg` (otimizado) |
| **Acessórios (Detalhes)** | `1:1` ou `4:5` | `800 x 800 px` ou `800 x 1000 px` | `.webp` ou `.jpg` |
| **Banner Principal (Hero)** | `16:9` ou `21:9` | `1920 x 800 px` até `2560 x 1080 px` | `.webp` ou `.jpg` |
| **Thumbnails / Miniaturas** | `4:5` | Geradas automaticamente pelo CSS | `.webp` ou `.jpg` |

---

## 🔄 Como Substituir uma Imagem:

1. Salve sua foto dentro da pasta correspondente (`camisetas/`, `bones/`, etc.).
2. Abra o arquivo `site/products.js`.
3. No produto desejado, altere a lista `imagens`:
   ```javascript
   imagens: [
     'img/camisetas/sua-camiseta-frente.jpg',
     'img/camisetas/sua-camiseta-costas.jpg',
     'img/camisetas/sua-camiseta-detalhe.jpg'
   ]
   ```
4. A primeira imagem da lista será a exibida por padrão no catálogo.
5. A segunda imagem da lista será a exibida automaticamente quando o cliente passar o mouse por cima do card no catálogo (efeito Lookbook/Alternazero).
6. Todas as imagens da lista aparecerão como miniaturas selecionáveis no Modal de Detalhes do Produto.
