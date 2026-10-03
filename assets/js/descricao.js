// ==========================================================
// Página de descrição do produto:
// 1) Lê o ?id= da URL e busca o produto no Realtime Database
// 2) Preenche imagem, nome, preço, descrição e especificações
// 3) Carrega as avaliações reais daquele produto (média + gráfico)
// 4) Permite que qualquer visitante envie nome + nota + comentário
// ==========================================================

import { db, ref, onValue, get, push, update } from "./firebaseConfig.js";

const params = new URLSearchParams(window.location.search);
const produtoId = params.get("id");

const elConteudo = document.getElementById("conteudo-produto");
const elNaoEncontrado = document.getElementById("produto-nao-encontrado");

const elImagem = document.getElementById("imagem-principal");
const elNome = document.getElementById("produto-nome");
const elPreco = document.getElementById("produto-preco");
const elDescricao = document.getElementById("produto-descricao");
const elFabricante = document.getElementById("spec-fabricante");
const elCategoria = document.getElementById("spec-categoria");
const elEan = document.getElementById("spec-ean");
const elEstoque = document.getElementById("spec-estoque");

const elMediaGeral = document.getElementById("media-geral");
const elEstrelasMedia = document.getElementById("estrelas-media");
const elTotalAvaliacoes = document.getElementById("total-avaliacoes");
const elHistograma = document.getElementById("histograma-avaliacoes");
const elListaAvaliacoes = document.getElementById("lista-avaliacoes");
const elSemAvaliacoes = document.getElementById("sem-avaliacoes");

const formAvaliacao = document.getElementById("form-avaliacao");
const inputNome = document.getElementById("avaliacao-nome");
const inputComentario = document.getElementById("avaliacao-comentario");
const estrelasPicker = document.getElementById("avaliacao-estrelas");
const spansEstrelas = estrelasPicker ? estrelasPicker.querySelectorAll("span") : [];
const elErro = document.getElementById("avaliacao-erro");

// ------------------------------------------------------------
// Monta uma faixa de estrelas (cheia/vazia) como HTML
// ------------------------------------------------------------
function htmlEstrelas(nota, tamanho = "text-base") {
  const cheias = Math.round(nota);
  let html = "";
  for (let i = 1; i <= 5; i++) {
    const classe = i <= cheias ? "" : "text-gray-300";
    html += `<span class="material-symbols-outlined ${tamanho} ${classe}">star</span>`;
  }
  return html;
}

// ------------------------------------------------------------
// 1) CARREGAR O PRODUTO
// ------------------------------------------------------------
async function carregarProduto() {
  if (!produtoId) {
    elConteudo.classList.add("hidden");
    elNaoEncontrado.classList.remove("hidden");
    return;
  }

  try {
    const snapshot = await get(ref(db, `produtos/${produtoId}`));
    const produto = snapshot.val();

    if (!produto) {
      elConteudo.classList.add("hidden");
      elNaoEncontrado.classList.remove("hidden");
      return;
    }

    document.title = `${produto.nome || "Produto"} - Auto Peças Express`;

    elImagem.src = produto.imagemPrincipal || "../images/produtos/produtos/sem-imagem.png";
    elImagem.alt = produto.nome || "Produto";

    elNome.textContent = produto.nome || "Produto sem nome";
    elDescricao.textContent = produto.descricao || "";

    const preco = Number(produto.preco ?? 0).toFixed(2).replace(".", ",");
    elPreco.textContent = `R$ ${preco}`;

    elFabricante.textContent = produto.fabricante || "—";
    elCategoria.textContent = produto.categoria || "—";
    elEan.textContent = produto.ean || "—";
    elEstoque.textContent =
      produto.estoque > 0 ? `${produto.estoque} unidade(s)` : "Fora de estoque";
  } catch (err) {
    console.error("Erro ao carregar produto:", err);
    elConteudo.classList.add("hidden");
    elNaoEncontrado.classList.remove("hidden");
  }
}

// ------------------------------------------------------------
// 2) AVALIAÇÕES: ouvir em tempo real e renderizar
// ------------------------------------------------------------
function escutarAvaliacoes() {
  if (!produtoId) return;

  const avaliacoesRef = ref(db, `avaliacoes/${produtoId}`);

  onValue(avaliacoesRef, (snapshot) => {
    const dados = snapshot.val() || {};
    const lista = Object.entries(dados)
      .map(([id, valor]) => ({ id, ...valor }))
      .sort((a, b) => (b.data ?? 0) - (a.data ?? 0)); // mais recente primeiro

    renderizarResumo(lista);
    renderizarLista(lista);
  });
}

function renderizarResumo(lista) {
  const total = lista.length;
  const soma = lista.reduce((acc, r) => acc + Number(r.nota || 0), 0);
  const media = total > 0 ? soma / total : 0;

  elMediaGeral.textContent = media.toFixed(1);
  elEstrelasMedia.innerHTML = htmlEstrelas(media, "text-xl");
  elTotalAvaliacoes.textContent = total;

  // Histograma de 5 a 1 estrela
  let htmlBarras = "";
  for (let estrela = 5; estrela >= 1; estrela--) {
    const qtd = lista.filter((r) => Math.round(r.nota) === estrela).length;
    const pct = total > 0 ? Math.round((qtd / total) * 100) : 0;

    htmlBarras += `
      <div class="flex items-center gap-4 text-sm">
        <span class="text-text-light w-16">${estrela} estrela${estrela > 1 ? "s" : ""}</span>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div class="bg-gradient-to-r from-secondary to-primary h-3 rounded-full" style="width: ${pct}%"></div>
        </div>
        <span class="text-text-light w-8 text-right">${pct}%</span>
      </div>
    `;
  }
  elHistograma.innerHTML = htmlBarras;
}

function renderizarLista(lista) {
  if (lista.length === 0) {
    elListaAvaliacoes.innerHTML = "";
    elListaAvaliacoes.appendChild(elSemAvaliacoes);
    elSemAvaliacoes.classList.remove("hidden");
    return;
  }

  elListaAvaliacoes.innerHTML = lista
    .map((r) => {
      const dataFormatada = r.data
        ? new Date(r.data).toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "";

      const nomeSeguro = escaparHtml(r.nome || "Anônimo");
      const comentarioSeguro = escaparHtml(r.comentario || "");

      return `
        <div class="flex gap-4 p-6 rounded-lg bg-surface-light/50 border border-border-light shadow-subtle">
          <div class="w-12 h-12 rounded-full border-2 border-primary bg-background-light flex items-center justify-center font-bold text-accent-dark">
            ${nomeSeguro.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="flex items-center gap-4 flex-wrap">
              <h4 class="font-bold text-accent-dark">${nomeSeguro}</h4>
              <span class="text-xs text-text-light">${dataFormatada}</span>
            </div>
            <div class="flex text-secondary my-1">${htmlEstrelas(r.nota, "text-base")}</div>
            <p class="text-text-dark leading-relaxed">${comentarioSeguro}</p>
          </div>
        </div>
      `;
    })
    .join("");
}

// Evita que um comentário com HTML/script quebre a página (XSS básico)
function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// ------------------------------------------------------------
// 3) SELETOR DE ESTRELAS DO FORMULÁRIO
// ------------------------------------------------------------
function configurarSeletorEstrelas() {
  if (!estrelasPicker) return;

  spansEstrelas.forEach((span) => {
    span.addEventListener("click", () => {
      const valor = Number(span.dataset.valor);
      estrelasPicker.dataset.nota = valor;
      pintarEstrelasPicker(valor);
    });

    span.addEventListener("mouseenter", () => {
      pintarEstrelasPicker(Number(span.dataset.valor));
    });
  });

  estrelasPicker.addEventListener("mouseleave", () => {
    pintarEstrelasPicker(Number(estrelasPicker.dataset.nota));
  });
}

function pintarEstrelasPicker(nota) {
  spansEstrelas.forEach((span) => {
    const valor = Number(span.dataset.valor);
    span.classList.toggle("text-secondary", valor <= nota);
    span.classList.toggle("text-gray-300", valor > nota);
  });
}

// ------------------------------------------------------------
// 4) ENVIAR NOVA AVALIAÇÃO
// ------------------------------------------------------------
function configurarFormulario() {
  if (!formAvaliacao) return;

  formAvaliacao.addEventListener("submit", async (e) => {
    e.preventDefault();
    elErro.classList.add("hidden");

    const nome = inputNome.value.trim();
    const comentario = inputComentario.value.trim();
    const nota = Number(estrelasPicker.dataset.nota || 0);

    if (!nome || !comentario || nota === 0) {
      elErro.textContent = "Preenche seu nome, uma nota de 1 a 5 estrelas e o comentário.";
      elErro.classList.remove("hidden");
      return;
    }

    try {
      await push(ref(db, `avaliacoes/${produtoId}`), {
        nome,
        nota,
        comentario,
        data: Date.now(),
      });

      formAvaliacao.reset();
      estrelasPicker.dataset.nota = 0;
      pintarEstrelasPicker(0);
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      elErro.textContent = "Não foi possível enviar sua avaliação agora. Tente de novo.";
      elErro.classList.remove("hidden");
    }
  });
}

// ------------------------------------------------------------
// INICIALIZAÇÃO
// ------------------------------------------------------------
carregarProduto();
escutarAvaliacoes();
configurarSeletorEstrelas();
configurarFormulario();
