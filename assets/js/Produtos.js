// ==========================================================
// PRODUTOS: renderização a partir de dados (banco/Firebase)
// + busca funcionando sobre os dados, não sobre HTML fixo.
// ==========================================================

// Guarda a lista completa vinda do banco, pra busca poder filtrar
// sem precisar buscar de novo no servidor a cada letra digitada.
window.todosProdutos = [];

const containerProdutos = document.getElementById("containerProdutos");
const produtosStatusEl = document.getElementById("produtos-status");
const produtosVazioEl = document.getElementById("produtos-vazio");

/**
 * Formato esperado de cada produto, vindo do Firebase (Realtime Database):
 * {
 *   id: "abc123",              // chave do nó no Firebase
 *   nome: "Filtro de ar",
 *   descricao: "Filtro de ar para Fiat Uno Mille 1.0...",
 *   imagemPrincipal: "https://.../foto.jpg",
 *   preco: 37.50,
 *   nota: 4.5,                 // 0 a 5, pode vir com decimal (é arredondado pra estrela)
 *   estoque: 10,               // <= 0 desabilita o botão e mostra "Fora de estoque"
 *   link: "./descricao.html?id=abc123"  // opcional, senão monta a partir do id
 * }
 */

// Mostra alguns cards "esqueleto" enquanto os dados não chegam do banco
function mostrarCarregando(qtd = 8) {
  if (!containerProdutos) return;
  containerProdutos.innerHTML = "";
  for (let i = 0; i < qtd; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "produto-skeleton";
    skeleton.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-line" style="width: 90%"></div>
      <div class="skeleton-line" style="width: 60%"></div>
      <div class="skeleton-line" style="width: 40%; margin-bottom: 1rem;"></div>
    `;
    containerProdutos.appendChild(skeleton);
  }
}

// Constrói o HTML de um card de produto
function criarCardProduto(produto) {
  const notaArredondada = Math.round(produto.nota ?? produto.estrelas ?? 0);
  const estrelasCheias = "★".repeat(notaArredondada);
  const estrelasVazias = "☆".repeat(5 - notaArredondada);
  const precoFormatado = Number(produto.preco ?? 0).toFixed(2).replace(".", ",");
  const semEstoque = (produto.estoque ?? 1) <= 0;
  const nomeOuDescricao = produto.descricao || produto.nome || "";

  const card = document.createElement("div");
  card.className = "product";
  card.dataset.produtoId = produto.id ?? "";
  // Junta nome + descrição em minúsculo, pra busca encontrar por qualquer um dos dois
  card.dataset.descricao = `${produto.nome ?? ""} ${nomeOuDescricao}`.toLowerCase();

  card.innerHTML = `
    <figure>
      <img class="image-product" src="${produto.imagemPrincipal ?? produto.imagem ?? "../images/produtos/produtos/sem-imagem.png"}" alt="${produto.nome ?? nomeOuDescricao ?? "Produto"}">
    </figure>
    <div class="product-body">
      <p class="produto-descricao">
        <a href="${produto.link ?? `./descricao.html?id=${produto.id ?? ""}`}">${nomeOuDescricao}</a>
      </p>
      <div class="rodape">
        <p class="rate">${estrelasCheias}${estrelasVazias}</p>
        <p class="produto-preco"><span>R$</span>${precoFormatado}</p>
      </div>
      <button class="button-colors" data-id="${produto.id ?? ""}" ${semEstoque ? "disabled" : ""}>
        ${semEstoque ? "Fora de estoque" : "Adicionar ao Carrinho"}
      </button>
    </div>
  `;

  return card;
}

/**
 * Chame esta função depois que os dados chegarem do banco/Firebase:
 *   renderizarProdutos(listaDeProdutos)
 */
function renderizarProdutos(lista) {
  window.todosProdutos = Array.isArray(lista) ? lista : [];

  if (!containerProdutos) return;
  containerProdutos.innerHTML = "";

  if (window.todosProdutos.length === 0) {
    if (produtosVazioEl) produtosVazioEl.classList.add("show");
    return;
  }

  if (produtosVazioEl) produtosVazioEl.classList.remove("show");

  const grid = document.createElement("div");
  grid.className = "cols";
  window.todosProdutos.forEach((produto) => {
    grid.appendChild(criarCardProduto(produto));
  });
  containerProdutos.appendChild(grid);

  if (produtosStatusEl) {
    produtosStatusEl.textContent = `${window.todosProdutos.length} produto(s) encontrado(s)`;
  }
}

// ------------------------------------------------------------
// BUSCA
// ------------------------------------------------------------

function filtrarProdutos() {
  const buscaInput = document.querySelector(".busca-input");
  if (!buscaInput) return;

  const termo = buscaInput.value.toLowerCase().trim();
  const cards = containerProdutos ? containerProdutos.querySelectorAll(".product") : [];

  let visiveis = 0;

  cards.forEach((card) => {
    const bate = termo === "" || card.dataset.descricao.includes(termo);
    card.style.display = bate ? "" : "none";
    if (bate) visiveis++;
  });

  if (produtosStatusEl) {
    produtosStatusEl.textContent =
      termo === ""
        ? `${window.todosProdutos.length} produto(s) encontrado(s)`
        : `${visiveis} resultado(s) para "${buscaInput.value}"`;
  }

  if (produtosVazioEl) {
    produtosVazioEl.classList.toggle("show", visiveis === 0 && window.todosProdutos.length > 0);
  }
}

// Debounce simples pra não filtrar a cada milissegundo enquanto digita
function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const buscaInput = document.querySelector(".busca-input");
  if (buscaInput) {
    buscaInput.addEventListener("input", debounce(filtrarProdutos, 200));
  }

  // Mostra o skeleton assim que a página carrega, antes dos dados chegarem
  mostrarCarregando();
});

// Expõe pro seu script do Firebase (produtos-firebase.js) poder chamar
window.renderizarProdutos = renderizarProdutos;
window.filtrarProdutos = filtrarProdutos;
