// perfilFornecedor.js
// Carrega os dados do fornecedor logado e o resumo de vendas por produto.
// "Vendido" aqui é calculado como (estoqueOriginal - estoque), pois ainda não
// existe uma coleção de pedidos no banco. Veja observação no chat.

import { db, auth, onAuthStateChanged, ref } from "./firebaseConfig.js";
import { get, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const elNome = document.getElementById("fornecedor-nome");
const elEmail = document.getElementById("fornecedor-email");
const elTotalPecas = document.getElementById("total-pecas");
const elTotalUnidades = document.getElementById("total-vendido-unidades");
const elTotalValor = document.getElementById("total-vendido-valor");
const tbody = document.querySelector("#vendasTable tbody");

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function mensagemTabela(texto) {
  tbody.innerHTML = "";
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  td.colSpan = 4;
  td.style.textAlign = "center";
  td.style.padding = "20px";
  td.textContent = texto;
  tr.appendChild(td);
  tbody.appendChild(tr);
}

async function carregarPerfil(user) {
  elEmail.textContent = user.email || "-";

  try {
    // Se algum dia você salvar dados extras em fornecedores/{uid}/dados
    // (nome, empresa, telefone...), eles aparecem aqui automaticamente.
    const snapshot = await get(ref(db, `fornecedores/${user.uid}/dados`));
    const dados = snapshot.exists() ? snapshot.val() : null;
    elNome.textContent = dados?.nome || dados?.empresa || user.displayName || user.email || "Fornecedor";
  } catch (erro) {
    console.error(erro);
    elNome.textContent = user.displayName || user.email || "Fornecedor";
  }
}

async function carregarVendas(user) {
  mensagemTabela("Carregando vendas...");

  try {
    const consulta = query(
      ref(db, "produtos"),
      orderByChild("fornecedorId"),
      equalTo(user.uid)
    );
    const snapshot = await get(consulta);

    if (!snapshot.exists()) {
      elTotalPecas.textContent = "0";
      elTotalUnidades.textContent = "0";
      elTotalValor.textContent = formatarMoeda(0);
      mensagemTabela("Você ainda não tem produtos cadastrados.");
      return;
    }

    let totalPecas = 0;
    let totalUnidades = 0;
    let totalValor = 0;
    const linhas = [];

    snapshot.forEach((filho) => {
      const produto = filho.val();
      totalPecas++;

      const estoqueOriginal = Number(produto.estoqueOriginal ?? produto.estoque ?? 0);
      const estoqueAtual = Number(produto.estoque ?? 0);
      const vendidos = Math.max(estoqueOriginal - estoqueAtual, 0);
      const preco = Number(produto.preco ?? 0);
      const totalProduto = vendidos * preco;

      totalUnidades += vendidos;
      totalValor += totalProduto;

      if (vendidos > 0) {
        linhas.push({
          nome: produto.nome ?? "(sem nome)",
          vendidos,
          preco,
          totalProduto
        });
      }
    });

    elTotalPecas.textContent = totalPecas;
    elTotalUnidades.textContent = totalUnidades;
    elTotalValor.textContent = formatarMoeda(totalValor);

    if (!linhas.length) {
      mensagemTabela("Nenhuma venda registrada ainda.");
      return;
    }

    linhas.sort((a, b) => b.totalProduto - a.totalProduto);

    tbody.innerHTML = "";
    linhas.forEach((linha) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${linha.nome}</td>
        <td>${linha.vendidos}</td>
        <td>${formatarMoeda(linha.preco)}</td>
        <td>${formatarMoeda(linha.totalProduto)}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (erro) {
    console.error(erro);
    mensagemTabela("Não foi possível carregar as vendas.");
  }
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  carregarPerfil(user);
  carregarVendas(user);
});
