function menu(){
    const navbar = document.querySelector(".navbar");
    const menuButton = document.querySelector(".menu-button");

     menuButton.addEventListener("click", () => {
        navbar.classList.toggle("show-menu");
     });
}


// pagina de pagamento ( formulario )

  document.addEventListener('DOMContentLoaded', function() {
   var modal = document.getElementById('modal');
   var btnCredito = document.querySelector('.btn.credito');
   var span = document.getElementsByClassName('close')[0];
   var form = document.getElementById('form');
   var sucesso = document.getElementById('sucesso');

   // pra abrir
   btnCredito.onclick = function() {
       modal.style.display = 'block';
       form.reset(); 
   }
   // Fechar 
   span.onclick = function() {
       modal.style.display = 'none';
   }
   
   window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  }
  // Enviar formulário
  form.onsubmit = function(e) {
      e.preventDefault();

      // Simula envio (colocar código real de API)
      console.log('Dados enviados:', {
          numero: document.getElementById('numero').value,
          titular: document.getElementById('titular').value,
          validade: document.getElementById('validade').value,
          cvv: document.getElementById('cvv').value
      });
      modal.style.display = 'none';
      sucesso.style.display = 'block';
      setTimeout(function() {
          sucesso.style.display = 'none';
      }, 3000); 
  }
});
function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}


// pesquisa de poduto

function filtrarProdutos() {
    let input = document.querySelector(".busca-input").value.toLowerCase();
    let produtos = document.querySelectorAll(".product");

    produtos.forEach(produto => {
      let descricao = produto.querySelector(".produto-descricao").innerText.toLowerCase();

      if (descricao.includes(input)) {
        produto.style.display = "block"; // mostra o produto
      } else {
        produto.style.display = "none"; // esconde o produto
      }
    });
  }

//   
  // MENSAGEM ENVIO AO CARRINHO
          // funciona mesmo se produtos forem adicionados depois
    document.addEventListener('DOMContentLoaded', () => {
        const msg = document.getElementById('mensagem-carrinho');
        let hideTimeout = null;
  
        const container = document.querySelector('.products-container') || document.body;
        container.addEventListener('click', (e) => {
          const btn = e.target.closest('.button-colors');
          if (!btn) return; 
  
          const product = btn.closest('.product');
          const descricaoElem = product ? product.querySelector('.produto-descricao') : null;
          let nome = 'Produto';
  
          if (descricaoElem) {
            nome = descricaoElem.innerText.trim().split(/\n/)[0];
            if (nome.length > 40) nome = nome.slice(0, 40).trim() + '...';
          }
  
          // mostra a mensagem
          msg.textContent = `${nome} adicionado ao carrinho!`;
          msg.classList.add('show');
  
          if (hideTimeout) clearTimeout(hideTimeout);
          hideTimeout = setTimeout(() => {
            msg.classList.remove('show');
          }, 3300);
        });
      });