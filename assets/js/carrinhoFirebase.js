// carrinhoFirebase.js
import { 
    auth, 
    db, 
    ref, 
    push,
    onAuthStateChanged
} from "./firebaseConfig.js";

// Adicionar produto no Firebase
export function adicionarAoCarrinho(produto) {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            alert("Você precisa estar logado para adicionar produtos ao carrinho.");
            window.location.href = "login.html";
            return;
        }

        const userId = user.uid;
        const carrinhoRef = ref(db, "carrinhos/" + userId);

        try {
            await push(carrinhoRef, produto);
            alert("Produto adicionado ao carrinho!");
        } catch (e) {
            console.error("Erro ao salvar produto:", e);
        }
    });
}
