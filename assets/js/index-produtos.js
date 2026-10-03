// ==========================================================
// Mostra uma prévia dos produtos na home (os 8 primeiros do banco),
// reaproveitando o mesmo card/estilo da página de produtos
// (window.renderizarProdutos vem de produtos.js, carregado antes deste).
// ==========================================================

import { db, ref, onValue } from "./firebaseConfig.js";

const QUANTIDADE_NA_HOME = 8;

const produtosRef = ref(db, "produtos");

onValue(produtosRef, (snapshot) => {
  const produtos = snapshot.val() || {};
  const lista = Object.entries(produtos).map(([id, dados]) => ({ id, ...dados }));

  if (typeof window.renderizarProdutos === "function") {
    window.renderizarProdutos(lista.slice(0, QUANTIDADE_NA_HOME));
  }
});
