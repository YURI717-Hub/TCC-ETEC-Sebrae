// entregaFrete.js
// Cuida da página de entrega: busca o endereço pelo CEP salvo, mostra os
// preços de frete e marca automaticamente a opção que a pessoa já tinha
// escolhido lá no carrinho.
//
// Correção importante: antes, marcar o rádio salvo (marcarFreteSalvo)
// só acontecia DENTRO do .then() da busca no Firebase, e só se o Firebase
// realmente tivesse os preços salvos em "fretes/sedex" e "fretes/standard".
// Se esse nó não existisse por qualquer motivo, a marcação nunca rodava —
// mesmo a pessoa tendo escolhido certinho no carrinho. Marcar o rádio não
// depende do Firebase, então agora essa parte roda de forma independente,
// usando o localStorage (que o carrinho já grava na hora).

import { db, ref, get } from "./firebaseConfig.js";

const radioNormal = document.getElementById("normal");
const radioRapida = document.getElementById("rapida");
const spanStandard = document.getElementById("frete-standard");
const spanSedex = document.getElementById("frete-sedex");

/* ------------------------------
    ENDEREÇO VIA CEP
------------------------------ */
window.addEventListener("DOMContentLoaded", () => {
    const cep = localStorage.getItem("cepUsuario");
    if (!cep) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => response.json())
        .then((data) => {
            if (data.erro) return;

            document.getElementById("rua").textContent = data.logradouro;
            document.getElementById("bairro").textContent = data.bairro;
            document.getElementById("cidade").textContent = data.localidade;
            document.getElementById("estado").textContent = data.uf;

            localStorage.setItem("endereco_rua", data.logradouro);
            localStorage.setItem("endereco_bairro", data.bairro);
            localStorage.setItem("endereco_cidade", data.localidade);
            localStorage.setItem("endereco_estado", data.uf);
            localStorage.setItem("endereco_cep", cep);
        })
        .catch((err) => console.error("Erro ao buscar CEP:", err));
});

/* ------------------------------
    MARCAR O FRETE JÁ ESCOLHIDO
    (não depende do Firebase — roda sempre)
------------------------------ */
function marcarFreteSalvo() {
    const salvo = localStorage.getItem("freteSelecionado"); // "normal" ou "rapida"
    if (!salvo) return;

    const radio = document.getElementById(salvo);
    if (radio) {
        radio.checked = true;
    }
}

/* ------------------------------
    PREÇOS DO FRETE
    1) mostra na hora usando o que o carrinho já salvou no localStorage
    2) atualiza com o Firebase depois, se tiver algo mais recente
------------------------------ */
function preencherPrecosLocalStorage() {
    const sedex = localStorage.getItem("frete_sedex");
    const standard = localStorage.getItem("frete_standard");

    if (standard && spanStandard) spanStandard.textContent = `R$ ${standard}`;
    if (sedex && spanSedex) spanSedex.textContent = `R$ ${sedex}`;
}

function preencherPrecosFirebase() {
    const fretesRef = ref(db, "fretes");

    get(fretesRef)
        .then((snapshot) => {
            if (!snapshot.exists()) return;

            const fretes = snapshot.val();

            if (fretes.standard?.preco && spanStandard) {
                spanStandard.textContent = `R$ ${fretes.standard.preco}`;
            }
            if (fretes.sedex?.preco && spanSedex) {
                spanSedex.textContent = `R$ ${fretes.sedex.preco}`;
            }
        })
        .catch((err) => console.error("Erro ao buscar frete no Firebase:", err));
}

preencherPrecosLocalStorage();
preencherPrecosFirebase();
marcarFreteSalvo(); // roda sempre, não fica esperando o Firebase

/* ------------------------------
    SALVAR TROCA DE FRETE
------------------------------ */
function salvarFrete(idRadio) {
    const valor =
        idRadio === "normal"
            ? spanStandard?.textContent.trim()
            : spanSedex?.textContent.trim();

    localStorage.setItem("freteSelecionado", idRadio);
    localStorage.setItem("valorFrete", valor || "");
}

radioNormal?.addEventListener("change", () => salvarFrete("normal"));
radioRapida?.addEventListener("change", () => salvarFrete("rapida"));

/* ------------------------------
    VALIDAÇÃO ANTES DE AVANÇAR
------------------------------ */
window.validarFrete = function validarFrete() {
    if (!radioNormal?.checked && !radioRapida?.checked) {
        alert("Selecione uma opção de frete antes de continuar.");
        return false;
    }
    return true;
};
