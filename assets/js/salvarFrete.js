// salvarFrete.js
import { db, ref, set } from "./firebaseConfig.js";

// 🔥 Função para salvar frete no Realtime Database
export function salvarFreteFirebase(tipo, preco) {
    const freteRef = ref(db, "fretes/" + tipo);

    set(freteRef, {
        tipo: tipo,
        preco: preco,
        data: new Date().toISOString()
    })
    .then(() => console.log("Frete salvo no Firebase:", tipo, preco))
    .catch(err => console.error("Erro ao salvar frete:", err));
}
