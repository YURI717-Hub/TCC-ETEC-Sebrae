document.addEventListener("DOMContentLoaded", () => {
  const btnSalvar = document.querySelector(".publicar");
  const nomeInput = document.getElementById("produto-nome");
  const categoriaInput = document.getElementById("categoria");
  const marcaInput = document.getElementById("marca");
  const precoInput = document.getElementById("preco");
  const descricaoInput = document.getElementById("descricao-prod");
  const imagemInput = document.getElementById("imageInput");
  const imagemCarroInput = document.getElementById("carImageInput"); // NOVO
  const notaInput = document.getElementById("nota"); // NOVO

  btnSalvar.addEventListener("click", () => {
    const nome = nomeInput.value.trim();
    const categoria = categoriaInput.value.trim();
    const marca = marcaInput.value.trim();
    const preco = parseFloat(precoInput.value) || 0;
    const descricao = descricaoInput.value.trim();
    const imagem = imagemInput.files[0]
      ? URL.createObjectURL(imagemInput.files[0])
      : "../images/produtos/produtos/sem-imagem.png";
    const imagemCarro = imagemCarroInput.files[0]
      ? URL.createObjectURL(imagemCarroInput.files[0])
      : "../images/produtos/produtos/sem-imagem.png";
    const nota = parseFloat(notaInput.value) || 4.5;

    if (!nome || !descricao || preco <= 0) {
      alert("Preencha o nome, descrição e preço do produto!");
      return;
    }

    const novoProduto = {
      nome,
      categoria,
      marca,
      preco,
      descricao,
      imagem,
      imagemCarro,
      nota,
      peso: 0.3,
      altura: 5.0,
      largura: 10.0,
      comprimento: 15.0
    };

    const produtosSalvos = JSON.parse(localStorage.getItem("produtos")) || [];
    produtosSalvos.push(novoProduto);
    localStorage.setItem("produtos", JSON.stringify(produtosSalvos));

    alert("✅ Produto salvo com sucesso! Ele aparecerá em produtos.html");

    nomeInput.value = "";
    categoriaInput.value = "";
    marcaInput.value = "";
    precoInput.value = "";
    descricaoInput.value = "";
    imagemInput.value = "";
    imagemCarroInput.value = "";
    notaInput.value = "";
  });
});
