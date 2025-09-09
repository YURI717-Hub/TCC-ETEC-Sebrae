/*INICIO CÓDIGO - MENU HAMBURGUER*/

function menu() {
  document.body.classList.toggle("show-menu");
}
document.addEventListener("DOMContentLoaded", function () {
  const carrossel = document.querySelector('.carrossel');
  const imagens = document.querySelectorAll('.carrossel img');
  let index = 0;

  function slideShow() {
    const largura = imagens[0].clientWidth;
    const gap = 16;
    index = (index + 1) % imagens.length;
    const deslocamento = index * (largura + gap);
    carrossel.style.transform = `translateX(-${deslocamento}px)`;
  }
  setInterval(slideShow, 3000);

  window.addEventListener('resize', () => {
    index = 0;
    carrossel.style.transform = 'translateX(0px)';
  });
});

/*FIM CÓDIGOJS - MENU HAMBURGUER*/

/*INICIO CÓDIGOJS - PRODUTOS - CÓDIGOJS - */


/*FIM - PRODUTOSjs*/

/*INICIO - CARRINHOjs*/
// Verifica se o DOM está carregado
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  // Configura os botões "Adicionar ao Carrinho"
  var addToCartButtons = document.getElementsByClassName("button-colors");
  for (var i = 0; i < addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener("click", addToCartClicked);
  }

  // Se estiver na página do carrinho, carrega os itens
  if (window.location.pathname.includes("carrinho.html")) {
    loadCartItems();
    setupCartEvents();
  }
}

// Função para adicionar produto ao carrinho
function addToCartClicked(event) {
  var button = event.target;
  var productCard = button.closest('.product');

  var product = {
    image: productCard.querySelector(".image-product").src,
    name: productCard.querySelector(".produto-descricao").innerText,
    price: productCard.querySelector(".produto-preco").innerText,
    quantity: 1
  };

  addToCart(product);

}

// Adiciona produto ao localStorage
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Verifica se o produto já está no carrinho
  let existingItem = cart.find(item => item.name === product.name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
}

// Carrega os itens do carrinho na página do carrinho
function loadCartItems() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let tableBody = document.querySelector(".cart-table tbody");

  if (!tableBody) return;

  tableBody.innerHTML = "";

  cart.forEach(item => {
    let row = document.createElement("tr");
    row.className = "cart-product";
    row.innerHTML = `
          <td class="product-indentification">
              <img class="product-imagem" src="${item.image}" alt="${item.name}">
              <strong class="product-title">${item.name}</strong>
          </td>
          <td class="product-price">
              <span>${item.price}</span>
          </td>
          <td>
              <input class="product-qtd" type="number" value="${item.quantity}" min="1">
              <button class="remove-button">Remover</button>
          </td>
      `;
    tableBody.appendChild(row);
  });

  updateTotal();

}

// Configura os eventos do carrinho
function setupCartEvents() {
  // Eventos de remoção
  document.querySelectorAll(".remove-button").forEach(button => {
    button.addEventListener("click", function (e) {
      let productName = e.target.closest("tr").querySelector(".product-title").textContent;
      removeFromCart(productName);
      e.target.closest("tr").remove();
      updateTotal();
    });
  });

  // Eventos de alteração de quantidade
  document.querySelectorAll(".product-qtd").forEach(input => {
    input.addEventListener("change", function (e) {
      let productName = e.target.closest("tr").querySelector(".product-title").textContent;
      updateQuantity(productName, parseInt(e.target.value));
      updateTotal();

    });
  });
}

// Remove item do carrinho
function removeFromCart(productName) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.name !== productName);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Atualiza quantidade no carrinho
function updateQuantity(productName, newQuantity) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let item = cart.find(item => item.name === productName);
  if (item) {
    item.quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

// Atualiza o total
function updateTotal() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;

  cart.forEach(item => {
    let price = parseFloat(item.price.replace("R$", "").replace(",", "."));
    total += price * item.quantity;
  });

  let totalElement = document.querySelector(".total span");
  if (totalElement) {
    totalElement.textContent = "R$ " + total.toFixed(2).replace(".", ",");
  }


}
/*FIM - CARRINHOjs */