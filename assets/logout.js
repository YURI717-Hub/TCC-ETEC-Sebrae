// logout.js
// Usado em estoque.html, publicar.html e perfilFornecedor.html

import { auth } from "./firebaseConfig.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const linkSair = document.querySelector(".logout a");

if (linkSair) {
  linkSair.addEventListener("click", async (event) => {
    event.preventDefault();

    linkSair.textContent = "Saindo...";

    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (erro) {
      console.error(erro);
      alert("Não foi possível sair. Tente novamente.");
      linkSair.textContent = "Sair";
    }
  });
}
