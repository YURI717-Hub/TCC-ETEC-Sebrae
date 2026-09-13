import { db, ref, get, set } from "./firebaseConfig.js";

// Usa leitura + escrita manual (mais simples que transaction e já evita valor negativo)
export async function baixarEstoque(produtoId, quantidadeComprada) {
  const estoqueRef = ref(db, `produtos/${produtoId}/estoque`);
  const snapshot = await get(estoqueRef);
  const estoqueAtual = snapshot.val() || 0;

  const novoEstoque = estoqueAtual - quantidadeComprada;

  if (novoEstoque < 0) {
    throw new Error("Estoque insuficiente para essa quantidade.");
  }

  await set(estoqueRef, novoEstoque);
  return novoEstoque;
}
