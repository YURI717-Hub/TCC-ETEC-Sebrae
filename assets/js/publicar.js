import { db, ref, push, set, auth, onAuthStateChanged } from "./firebaseConfig.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnSalvar = document.querySelector(".publicar");
  const nomeInput = document.getElementById("produto-nome");
  const categoriaInput = document.getElementById("categoria");
  const marcaInput = document.getElementById("marca");
  const precoInput = document.getElementById("preco");
  const gtinInput = document.getElementById("GTIN");
  const estoqueInput = document.getElementById("estoque");
  const descricaoInput = document.getElementById("descricao-prod");
  const imagemInput = document.getElementById("imageInput");

  if (!btnSalvar) return;

  let fornecedorAtual = null;

  onAuthStateChanged(auth, (user) => {
    fornecedorAtual = user; // fica null se ninguém estiver logado
  });

  // Converte um File em base64 (Promise, pra poder usar await)
  function arquivoParaBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Redimensiona a imagem para 225x225 e devolve como base64 (reaproveitando sua lógica de canvas)
  function redimensionarParaBase64(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => { img.src = e.target.result; };
      reader.onerror = reject;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 225;
        canvas.height = 225;

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, 225, 225);

        const ratio = Math.min(225 / img.width, 225 / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;
        const x = (225 - newWidth) / 2;
        const y = (225 - newHeight) / 2;

        ctx.drawImage(img, x, y, newWidth, newHeight);
        resolve(canvas.toDataURL("image/jpeg", 0.8)); // 0.8 = qualidade, ajuda a controlar o tamanho
      };

      reader.readAsDataURL(file);
    });
  }

  btnSalvar.addEventListener("click", async () => {
    if (!fornecedorAtual) {
      alert("Você precisa estar logado como fornecedor para publicar um produto.");
      return;
    }

    const nome = nomeInput.value.trim();
    const categoria = categoriaInput.value.trim();
    const marca = marcaInput.value.trim();
    const preco = parseFloat(precoInput.value) || 0;
    const gtin = gtinInput.value.trim();
    const estoque = parseInt(estoqueInput.value) || 0;
    const descricao = descricaoInput.value.trim();

    if (!nome || !descricao || preco <= 0) {
      alert("Preencha o nome, descrição e preço do produto!");
      return;
    }

    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";

    try {
      const arquivos = Array.from(imagemInput.files);
      let imagensBase64 = [];

      if (arquivos.length > 0) {
        imagensBase64 = await Promise.all(arquivos.map(redimensionarParaBase64));
      }

      const novoProduto = {
        nome,
        categoria,
        marca,
        preco,
        gtin,
        estoque,
        estoqueOriginal: estoque,
        descricao,
        imagens: imagensBase64,
        imagemPrincipal: imagensBase64[0] || "../images/produtos/produtos/sem-imagem.png",
        nota: 4.5,
        peso: 0.3,
        altura: 5.0,
        largura: 10.0,
        comprimento: 15.0,
        fornecedorId: fornecedorAtual.uid,
        fornecedorEmail: fornecedorAtual.email,
        criadoEm: Date.now()
      };

      const produtosRef = ref(db, "produtos");
      const novaRef = push(produtosRef);
      await set(novaRef, novoProduto);

      // Referência cruzada: lista de produtos deste fornecedor (facilita telas de "meus produtos"/estoque)
      const refFornecedorProduto = ref(db, `fornecedores/${fornecedorAtual.uid}/produtos/${novaRef.key}`);
      await set(refFornecedorProduto, true);

      alert("✅ Produto salvo com sucesso! Ele já aparece em produtos.html");

      nomeInput.value = "";
      categoriaInput.value = "";
      marcaInput.value = "";
      precoInput.value = "";
      gtinInput.value = "";
      estoqueInput.value = "";
      descricaoInput.value = "";
      imagemInput.value = "";
      document.getElementById("preview").innerHTML = "";
      document.getElementById("count").textContent = "0";

    } catch (erro) {
      console.error(erro);
      alert("Erro ao salvar o produto: " + erro.message);
    } finally {
      btnSalvar.disabled = false;
      btnSalvar.textContent = "Salvar e Publicar";
    }
  });
});
