/* ------------------------------
    PARSE E FORMAT BRL
------------------------------ */
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

/* ------------------------------
    CARREGAMENTO DO DOCUMENTO
------------------------------ */
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

function ready() {
    document.addEventListener("click", function (e) {
        const addBtn = e.target.closest(".button-colors");
        if (addBtn) {
            e.preventDefault();
            addToCartFromButton(addBtn);
        }
    });

    if (window.location.pathname.includes("carrinho.html") || document.querySelector(".cart-table")) {
        loadCartItems();
        const tableBody = document.querySelector(".cart-table tbody");

        if (tableBody) {
            tableBody.addEventListener("click", function (e) {
                const removeBtn = e.target.closest(".remove-button");
                const addBtn = e.target.closest(".add-button");

                if (removeBtn) {
                    const row = removeBtn.closest("tr");
                    const name = row.querySelector(".product-title")?.textContent.trim();
                    const input = row.querySelector(".product-qtd");
                    const current = parseInt(input.value) || 1;

                    if (current > 1) {
                        input.value = current - 1;
                        updateQuantity(name, parseInt(input.value));
                    } else {
                        removeFromCart(name);
                        row.remove();
                    }

                    updateTotal();
                    checkEmptyCartUI();
                }

                if (addBtn) {
                    const row = addBtn.closest("tr");
                    const name = row.querySelector(".product-title")?.textContent.trim();
                    const input = row.querySelector(".product-qtd");
                    const current = parseInt(input.value) || 0;

                    input.value = current + 1;
                    updateQuantity(name, parseInt(input.value));
                    updateTotal();
                }
            });

            tableBody.addEventListener("change", function (e) {
                const input = e.target.closest(".product-qtd");
                if (!input) return;

                const newQ = parseInt(input.value) || 1;
                input.value = newQ;

                const row = input.closest("tr");
                const name = row.querySelector(".product-title")?.textContent.trim();

                updateQuantity(name, parseInt(input.value));
                updateTotal();
            });
        }
    }
}

/* ------------------------------
    ADICIONAR AO CARRINHO
------------------------------ */
function addToCartFromButton(button) {
    const productCard = button.closest(".product");
    if (!productCard) return;

    const imgEl = productCard.querySelector(".image-product");
    const nameEl = productCard.querySelector(".produto-descricao a");
    const priceEl = productCard.querySelector(".produto-preco");

    let precoTexto = priceEl.innerText.trim();
    precoTexto = precoTexto.replace("R$:", "").trim();

    const product = {
        image: imgEl?.src || "",
        name: nameEl?.innerText.trim() || "Produto sem nome",
        price: precoTexto,
        quantity: 1
    };

    addToCart(product);

    if (window.location.pathname.includes("carrinho.html") || document.querySelector(".cart-table")) {
        loadCartItems();
    }

    updateTotal();
}

/* ------------------------------
    GERENCIAMENTO DO CARRINHO
------------------------------ */
function getCart() {
    try { return JSON.parse(localStorage.getItem('cart')) || []; }
    catch (e) { return []; }
}

function setCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }

function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push(product);
    }

    setCart(cart);
}

function removeFromCart(productName) {
    let cart = getCart();
    cart = cart.filter(item => item.name !== productName);
    setCart(cart);
}

function updateQuantity(productName, newQuantity) {
    const cart = getCart();
    const item = cart.find(i => i.name === productName);

    if (item) {
        item.quantity = newQuantity;
        setCart(cart);
    }
}

/* ------------------------------
    CARREGAR ITENS DO CARRINHO
------------------------------ */
function loadCartItems() {
    const cart = getCart();
    const tableBody = document.querySelector(".cart-table tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (cart.length === 0) {
        tableBody.innerHTML = `
            <tr class="cart-empty-row">
                <td colspan="3" style="text-align:center; padding: 20px;">
                    Nenhum produto no carrinho.
                </td>
            </tr>
        `;
        updateTotal();
        return;
    }

    cart.forEach(item => {
        const row = document.createElement("tr");
        row.className = "cart-product";

        row.innerHTML = `
            <td class="product-indentification">
                <img class="product-imagem" src="${item.image}" style="max-width:70px">
                <strong class="product-title">${item.name}</strong>
            </td>

            <td class="product-price">
                <span class="price-single">${item.price}</span>
            </td>

            <td class="qtd-rem">
                <div class="flex">
                    <img src="../images/menos.png" width="10"  class="remove-button" style="cursor:pointer">
                    <input class="product-qtd" type="number" value="${item.quantity}" min="1" style="width:45px;text-align:center">
                    <img src="../images/mais.png" width="10"  class="add-button" style="cursor:pointer">
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });

    updateTotal();
}

/* ------------------------------
    SISTEMA DE DESCONTO
------------------------------ */
function setDesconto(valor) {
    localStorage.setItem("desconto", valor);
}

function getDesconto() {
    return parseFloat(localStorage.getItem("desconto")) || 0;
}

function calcularSubtotal() {
    const cart = getCart();
    let subtotal = 0;

    cart.forEach(item => {
        const preco = parseBRL(item.price);
        const qty = parseInt(item.quantity) || 1;
        subtotal += preco * qty;
    });

    const subtotalEl = document.querySelector(".price-prod");
    if (subtotalEl) subtotalEl.textContent = formatBRL(subtotal);

    return subtotal;
}

function updateTotal() {
    const subtotal = calcularSubtotal();

    const freteText = document.querySelector("#val-frete")?.textContent || "R$ 0,00";
    const frete = parseBRL(freteText);

    let desconto = getDesconto();

    const descontoEl = document.querySelector(".price-des");
    if (descontoEl) descontoEl.textContent = formatBRL(desconto);

    const total = subtotal + frete - desconto;

    const totalElement = document.getElementById("total");
    if (totalElement) totalElement.textContent = formatBRL(total);
}

function checkEmptyCartUI() {
    const cart = getCart();

    if (cart.length === 0) {
        const tableBody = document.querySelector(".cart-table tbody");
        if (tableBody) {
            tableBody.innerHTML = `
                <tr class="cart-empty-row">
                    <td colspan="3" style="text-align:center; padding: 20px;">
                        Nenhum produto no carrinho.
                    </td>
                </tr>
            `;
        }

        const subtotalEl = document.querySelector(".price-prod");
        if (subtotalEl) subtotalEl.textContent = formatBRL(0);

        const totalEl = document.getElementById("total");
        if (totalEl) totalEl.textContent = formatBRL(0);
    }
}

/* ------------------------------
        CUPOM DE DESCONTO
------------------------------ */
function aplicarCupom() {
    const cupom = document.getElementById('cupom').value;
    const msg = document.getElementById('mensagem-cupom');

    if (cupom === 'DESCONTO10') {

        setDesconto(10); // Aplica desconto

        msg.textContent = 'Cupom aplicado! Desconto de R$ 10.';
        msg.style.color = 'green';

        updateTotal();

    } else {

        setDesconto(0); // Remove desconto

        msg.textContent = 'Cupom inválido.';
        msg.style.color = 'red';

        updateTotal();
    }
}

/* ------------------------------
        CARRINHO PAGAMENTO
        (para pagamento.html)
------------------------------ */
/* ------------------------------
        CARRINHO PAGAMENTO HTML
------------------------------ */
function loadPaymentCart() {
    const cart = getCart();
    const productsList = document.querySelector(".products-list");
    const totalLabel = document.querySelector(".total-label");
    const totalValue = document.querySelector(".total-value");

    if (!productsList || !totalLabel || !totalValue) return;

    productsList.innerHTML = "";

    if (cart.length === 0) {
        productsList.innerHTML = `<li style="text-align:center; padding:10px;">Nenhum produto no carrinho.</li>`;
        totalLabel.textContent = "SubTotal (0 itens)";
        totalValue.textContent = formatBRL(0);
        return;
    }

    let totalItems = 0;
    let subtotal = 0;

    cart.forEach(item => {
        const li = document.createElement("li");
        li.className = "product-item";
        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="max-width:50px; margin-right:10px;">
            <strong>${item.name}</strong> - ${item.quantity} x <span>R$ ${item.price}</span>
        `;
        productsList.appendChild(li);

        totalItems += parseInt(item.quantity);
        subtotal += parseBRL(item.price) * item.quantity;
    });

    totalLabel.textContent = `SubTotal (${totalItems} itens)`;
    totalValue.textContent = formatBRL(subtotal);
}


// Chame esta função quando a página pagamento.html carregar
if (window.location.pathname.includes("pagamento.html")) {
    document.addEventListener("DOMContentLoaded", loadPaymentCart);
}

