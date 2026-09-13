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
  // Remove renderizações anteriores desta origem (evita duplicar em cada atualização do banco)
  document.querySelectorAll(".cols-firebase").forEach(el => el.remove());

  const lista = Object.entries(produtos || {}).map(([id, dados]) => ({ id, ...dados }));

  for (let i = 0; i < lista.length; i += 4) {
    const grupo = lista.slice(i, i + 4);
    const colsDiv = document.createElement("div");
    colsDiv.className = "cols cols-4 cols-firebase"; // classe extra só pra controle interno
    grupo.forEach(produto => colsDiv.appendChild(criarCardProduto(produto)));
    container.appendChild(colsDiv);
  }
}

const produtosRef = ref(db, "produtos");
onValue(produtosRef, (snapshot) => {
  const produtos = snapshot.val();
  renderizarProdutosFirebase(produtos);
});
