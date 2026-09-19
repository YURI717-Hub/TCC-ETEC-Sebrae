// ajustarHeader.js
// Mede a altura real do header fixo e ajusta a variável --header-height,
// usada no CSS para empurrar o conteúdo pra baixo dele sem sobrar vão.

function ajustarEspacoHeader() {
  const header = document.querySelector("header");
  if (!header) return;

  document.documentElement.style.setProperty(
    "--header-height",
    header.offsetHeight + "px"
  );
}

window.addEventListener("load", ajustarEspacoHeader);
window.addEventListener("resize", ajustarEspacoHeader);

// Reajusta também se o header mudar de tamanho por conta própria
// (ex.: o menu virar duas linhas em telas pequenas)
if (window.ResizeObserver) {
  const header = document.querySelector("header");
  if (header) {
    new ResizeObserver(ajustarEspacoHeader).observe(header);
  }
}
