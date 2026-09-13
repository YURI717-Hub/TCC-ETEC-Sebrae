import { db, ref, onValue } from "./firebaseConfig.js";

const container = document.getElementById("produtos-container");

function gerarEstrelas(nota) {
  const notaArredondada = Math.round(nota);
  let estrelas = "";
  for (let i = 0; i < 5; i++) {
    estrelas += i < notaArredondada ? "★" : "☆";
  }
  return estrelas;
}

function criarCardProduto(produto) {
  const div = document.createElement("div");
  div.className = "product";
  div.dataset.produtoId = produto.id;

  const precoFormatado = Number(produto.preco).toFixed(2).replace(".", ",");

  div.innerHTML = `
    <figure>
      <img class="image-product" src="${produto.imagemPrincipal || '../images/produtos/produtos/sem-imagem.png'}" alt="${produto.nome || ''}">
    </figure>
    <p class="produto-descricao">
      <a href="./descricao.html?id=${produto.id}">${produto.descricao || produto.nome || ''}</a>
    </p>
    <div class="rodape">
      <p class="rate">${gerarEstrelas(produto.nota || 4.5)}</p>
      <p class="produto-preco"><span>R$</span>${precoFormatado}</p>
    </div>
    <button class="button-colors" ${produto.estoque <= 0 ? "disabled" : ""}>
      ${produto.estoque <= 0 ? "Fora de estoque" : "Adicionar ao Carrinho"}
    </button>
  `;

  return div;
}

function renderizarProdutosFirebase(produtos) {
  // Remove só os produtos do Firebase renderizados antes (mantém os manuais intactos)
  document.querySelectorAll(".produto-firebase").forEach(el => el.remove());

  // Usa o MESMO grid que já tem os produtos manuais, em vez de criar um novo
  let grid = container.querySelector(".cols.cols-4");
  if (!grid) {
    grid = document.createElement("div");
    grid.className = "cols cols-4";
    container.appendChild(grid);
  }

  const lista = Object.entries(produtos || {}).map(([id, dados]) => ({ id, ...dados }));

  lista.forEach(produto => {
    const card = criarCardProduto(produto);
    card.classList.add("produto-firebase"); // marca pra poder remover/atualizar depois
    grid.appendChild(card);
  });
}

const produtosRef = ref(db, "produtos");
onValue(produtosRef, (snapshot) => {
  const produtos = snapshot.val();
  renderizarProdutosFirebase(produtos);
});
