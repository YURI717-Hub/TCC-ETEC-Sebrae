// estoque.js
// Carrega na tabela apenas as peças publicadas pelo fornecedor logado.

import { db, auth } from "./firebaseConfig.js";
import {
  ref,
  get,
  set,
  remove,
  query,
  orderByChild,
  equalTo
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const tbody = document.querySelector("#estoqueTable tbody");

/* ---------- helpers ---------- */

function mensagem(texto) {
  tbody.innerHTML = "";
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = 5;
  td.style.textAlign = "center";
  td.style.padding = "20px";
  td.textContent = texto;
  tr.appendChild(td);
  tbody.appendChild(tr);
}

function formatarPreco(valor) {
  const n = Number(valor);
  return isNaN(n) ? "0.00" : n.toFixed(2);
}

/* ---------- render ---------- */

function criarLinha(id, produto, nomeFornecedorPadrao) {
  const tr = document.createElement("tr");
  tr.dataset.id = id;

  const nome = produto.nome ?? produto.nomePeca ?? produto.titulo ?? "(sem nome)";
  const quantidade = produto.estoque ?? produto.quantidade ?? 0;
  const fornecedor = produto.fornecedorNome ?? nomeFornecedorPadrao;
  const preco = produto.preco ?? produto.valor ?? 0;

  [nome, quantidade, fornecedor, formatarPreco(preco)].forEach(valor => {
    const td = document.createElement("td");
    td.textContent = valor;
    tr.appendChild(td);
  });

  const tdAcoes = document.createElement("td");
  const botao = document.createElement("button");
  botao.textContent = "Remover";
  botao.addEventListener("click", () => removerItem(id, nome, tr));
  tdAcoes.appendChild(botao);
  tr.appendChild(tdAcoes);

  return tr;
}

/* ---------- carregamento ---------- */

async function carregarEstoque(user) {
  mensagem("Carregando estoque...");

  const nomeFornecedor = user.displayName || user.email || "Fornecedor";

  try {
    const consulta = query(
      ref(db, "produtos"),
      orderByChild("fornecedorId"),
      equalTo(user.uid)
    );

    const snapshot = await get(consulta);

    if (!snapshot.exists()) {
      mensagem("Você ainda não publicou nenhuma peça.");
      return;
    }

    tbody.innerHTML = "";
    snapshot.forEach(filho => {
      tbody.appendChild(criarLinha(filho.key, filho.val(), nomeFornecedor));
    });
  } catch (erro) {
    console.error(erro);
    mensagem("Não foi possível carregar o estoque. Tente novamente.");
  }
}

/* ---------- ações ---------- */

async function removerItem(produtoId, nome, linha) {
  if (!confirm(`Remover "${nome}" do estoque?`)) return;

  try {
    await remove(ref(db, `produtos/${produtoId}`));
    linha.remove();
    if (!tbody.children.length) {
      mensagem("Você ainda não publicou nenhuma peça.");
    }
  } catch (erro) {
    console.error(erro);
    alert("Erro ao remover a peça.");
  }
}

/* ---------- baixa de estoque (versão corrigida) ---------- */

export async function baixarEstoque(produtoId, quantidadeComprada) {
  const qtd = Number(quantidadeComprada);

  if (!produtoId) throw new Error("Produto inválido.");
  if (!Number.isFinite(qtd) || qtd <= 0) {
    throw new Error("Quantidade inválida.");
  }

  const estoqueRef = ref(db, `produtos/${produtoId}/estoque`);
  const snapshot = await get(estoqueRef);

  if (!snapshot.exists()) {
    throw new Error("Produto não encontrado no estoque.");
  }

  const estoqueAtual = Number(snapshot.val()) || 0;
  const novoEstoque = estoqueAtual - qtd;

  if (novoEstoque < 0) {
    throw new Error("Estoque insuficiente para essa quantidade.");
  }

  await set(estoqueRef, novoEstoque);
  return novoEstoque;
}

/* ---------- start ---------- */

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  carregarEstoque(user);
});
