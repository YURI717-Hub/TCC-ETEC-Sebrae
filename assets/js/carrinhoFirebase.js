// carrinhoFrete.js
// Cuida do cálculo de frete, do cupom de desconto e da gravação no Firebase.
// Antes esse código ficava solto dentro de um <script type="module"> no
// próprio carrinho.html — foi movido para um arquivo separado para ficar
// mais fácil de manter e de depurar.

import { salvarFreteFirebase } from "./salvarFrete.js";
import { db, ref, set, push, remove, auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const spanSedex = document.getElementById("val-frete");
const spanNormal = document.querySelector(".val-frete1");
const opFrete = document.getElementById("opFrete");
const radioNormal = document.getElementById("demora");
const radioRapido = document.getElementById("rapido");
const btnCalcular = document.getElementById("btnCalcular");
const inputCep = document.getElementById("cepDestino");

/**
 * Exposto em "window" para que carinho.js (que cuida do total do carrinho)
 * saiba qual frete está selecionado no momento, sem que os dois arquivos
 * precisem se importar um ao outro.
 */
window.getFreteSelecionado = function getFreteSelecionado() {
  if (radioRapido && radioRapido.checked) {
    return parseValorFrete(spanSedex?.textContent);
  }
  if (radioNormal && radioNormal.checked) {
    return parseValorFrete(spanNormal?.textContent);
  }
  return 0;
};

function parseValorFrete(texto) {
  if (!texto) return 0;
  const limpo = texto.replace("R$", "").trim().replace(",", ".");
  const valor = parseFloat(limpo);
  return Number.isNaN(valor) ? 0 : valor;
}

function salvarCep(cep) {
  if (!cep || cep.replace(/\D/g, "").length < 8) {
    alert("Digite um CEP válido.");
    return false;
  }
  localStorage.setItem("cepUsuario", cep);
  return true;
}

function salvarFreteSelecionado(radio) {
  const tipo = radio.value; // "normal" ou "rapida"
  const valor = tipo === "rapida" ? spanSedex?.textContent : spanNormal?.textContent;

  localStorage.setItem("freteSelecionado", tipo);
  localStorage.setItem("valorFrete", valor || "");

  if (typeof window.updateTotal === "function") {
    window.updateTotal();
  }
}

radioNormal?.addEventListener("change", () => salvarFreteSelecionado(radioNormal));
radioRapido?.addEventListener("change", () => salvarFreteSelecionado(radioRapido));

async function calcularFrete() {
  const cepDestino = inputCep?.value.trim() || "";

  if (!salvarCep(cepDestino)) {
    return;
  }

  if (spanSedex) spanSedex.textContent = "Calculando...";
  if (spanNormal) spanNormal.textContent = "Calculando...";

  const body = {
    from: { postal_code: "01216000" },
    to: { postal_code: cepDestino },
    package: { height: 6, width: 16, length: 20, weight: 1, format: 1 },
    options: { receipt: false, own_hand: false, collect: false }
  };

  try {
    const response = await fetch("/api/calcularFrete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      if (spanSedex) spanSedex.textContent = "Nenhum serviço encontrado.";
      if (spanNormal) spanNormal.textContent = "";
      return;
    }

    const sedex = data.find((s) => s.name?.toUpperCase().includes("SEDEX"));
    const standard = data.find((s) => s.name?.toUpperCase() === "STANDARD");

    if (sedex?.price && spanSedex) {
      spanSedex.textContent = `R$ ${sedex.price}`;
      salvarFreteFirebase("sedex", sedex.price);
      localStorage.setItem("frete_sedex", sedex.price);
    }

    if (standard?.price && spanNormal) {
      spanNormal.textContent = `R$ ${standard.price}`;
      salvarFreteFirebase("standard", standard.price);
      localStorage.setItem("frete_standard", standard.price);
    }

    if (opFrete) opFrete.style.display = "flex";
  } catch (error) {
    console.error("Erro no frete:", error);
    if (spanSedex) spanSedex.textContent = "Erro ao calcular.";
    if (spanNormal) spanNormal.textContent = "";
  }
}

btnCalcular?.addEventListener("click", calcularFrete);

/* ------------------------------
    CARRINHO NO FIREBASE
------------------------------ */
export function adicionarAoCarrinho(produto) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "../pages/login.html";
      return;
    }

    const carrinhoRef = ref(db, "carrinhos/" + user.uid);
    const novoItem = push(carrinhoRef);

    set(novoItem, produto)
      .then(() => alert("Produto adicionado ao carrinho!"))
      .catch((error) => console.error("Erro ao salvar no carrinho:", error));
  });
}

export function removerDoCarrinho(idFirebase) {
  onAuthStateChanged(auth, (user) => {
    if (!user) return;

    const itemRef = ref(db, "carrinhos/" + user.uid + "/" + idFirebase);

    remove(itemRef)
      .then(() => console.log("Item removido:", idFirebase))
      .catch((err) => console.error("Erro ao remover:", err));
  });
}

/* ------------------------------
    SALVAR TOTAL DO CARRINHO
------------------------------ */
function salvarTotalCarrinho() {
  const total = document.getElementById("total")?.textContent.trim();
  if (total) {
    localStorage.setItem("totalCarrinho", total);
  }
}

window.addEventListener("DOMContentLoaded", salvarTotalCarrinho);
