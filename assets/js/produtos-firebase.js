import { db, ref, onValue } from "./firebaseConfig.js";

const produtosRef = ref(db, "produtos");

onValue(produtosRef, (snapshot) => {
  const produtos = snapshot.val() || {};

  // Transforma o objeto do Firebase { chave: {...dados} } em array [{ id, ...dados }]
  const lista = Object.entries(produtos).map(([id, dados]) => ({ id, ...dados }));

  // renderizarProdutos já existe em produtos.js: limpa o container,
  // desenha os cards, atualiza o contador e alimenta a busca.
  window.renderizarProdutos(lista);
});
