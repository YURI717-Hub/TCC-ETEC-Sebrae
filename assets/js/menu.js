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