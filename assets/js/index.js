
document.addEventListener("DOMContentLoaded", function () {
  const carrossel = document.querySelector('.carrossel');
  const imagens = document.querySelectorAll('.carrossel img');
  const largura = 384; // largura da imagem em px
  let index = 0;

  setInterval(() => {
    index = (index + 1) % imagens.length;
    carrossel.style.transform = `translateX(-${index * largura}px)`;
  }, 3000); // troca a imagem a cada 3 segundos
});