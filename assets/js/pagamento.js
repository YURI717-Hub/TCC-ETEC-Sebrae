document.addEventListener("DOMContentLoaded", () => {
    const btnBoleto = document.querySelector(".btn.boleto");
    const btnPix = document.querySelector(".btn.pix");
    const container = document.getElementById("pagamento-container");

    function getCart() {
        try { return JSON.parse(localStorage.getItem('cart')) || []; }
        catch (e) { return []; }
    }

    function parseBRL(value) {
        if (!value && value !== 0) return 0;
        try {
            const s = String(value)
                .replace("R$:", "")
                .replace("R$", "")
                .replace(/\s/g, "");
            return parseFloat(s.replace(/\./g, "").replace(",", ".")) || 0;
        } catch (e) {
            return 0;
        }
    }

    function formatBRL(num) {
        return "R$ " + Number(num).toFixed(2).replace(".", ",");
    }

    // -------------------- BOLETO --------------------
    btnBoleto.addEventListener("click", () => {
        fetch("../js/gerar_boleto.php")
            .then(res => res.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                container.innerHTML = `<iframe src="${url}" width="100%" height="500px"></iframe>`;
            })
            .catch(err => console.error("Erro ao gerar boleto:", err));
    });

    // -------------------- PIX --------------------
    btnPix.addEventListener("click", () => {
        container.innerHTML = ""; // Limpa container

        const cart = getCart();
        let total = 0;

        cart.forEach(item => {
            total += parseBRL(item.price) * item.quantity;
        });

        // Dados PIX fictícios
        const chavePix = "teste@exemplo.com";

        // Cria QR Code container
        const qrDiv = document.createElement("div");
        qrDiv.id = "pix-qr";
        container.appendChild(qrDiv);

        // Mostra informação do PIX
        const info = document.createElement("p");
        info.innerHTML = `Chave PIX: <strong>${chavePix}</strong> `;
        container.appendChild(info);

        // Gera QR Code
        const pixPayload = `00020126360014BR.GOV.BCB.PIX0114${chavePix}52040000`;
        new QRCode(qrDiv, {
            text: pixPayload,
            width: 200,
            height: 200
        });
    });
});
