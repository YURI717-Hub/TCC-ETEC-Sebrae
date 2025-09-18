
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/perfil.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script  type="text/javascript" src="../js/menu.js"></script>
    <title>Document</title>
</head>
<body>
 <header>
    <div class="navbar">
      <div class="header-linear-content">
        <a href="../../home.html">
          <h1 class="logo">AutoPeças <span> Express </span></h1>
        </a>
        <nav>
          <ul>
            <li><a href="perfil.php">Meu Perfil</a></li>
            <li><a href="produto.html">Produtos</a></li>
            <li><a href="sobre.html">Sobre</a></li>
          </ul>
        </nav>

        <div class="pesquisa">
          <input type="text" class="busca-input" placeholder="Qual Peça esta Procurando?">

        </div>
        <div>
          <figure class="nav-icon-container">
            <a href="carrinho.html"> <img src="../images/carrinho.png" alt=""></a>
          </figure>


          <ul class="login">
            <li><a href="login.html">Entrar</a></li>
            <li>|</li>
            <li><a href="cadastro.html">Cadastro</a></li>
            </li>
          </ul>
          <figure>
            <img onload="menu();" src="../images/menu.png" alt="" class="menu-button">
          </figure>
        </div>
      </div>

    </div>
  </header>


   <h2 class="titulo2">perfil</h2> <br>
<main class="Perfil-container">
    <?php
$local_Server= "localhost";
$local_User = "root";
$local_Password = "sebrae@123";
$local_Database = "autopeca";

try{
    $pdo = new PDO("mysql:host=$local_Server;dbname=$local_Database", $local_User, $local_Password);
    $pdo->exec("SET CHARACTER SET utf8");

}
catch(Exception $er){
    echo "Atenção - Erro ao Conectar:  ". $er->getMessage();
    die();
}
function atualizarDado($pdo, $id, $campo, $valor) {
    $camposPermitidos = [
        'nome','sobrenome','email','cpf','telefone',
        'cep','rua','numero','complemento','bairro',
        'cidade','estado','senha'
    ];

    if (!in_array($campo, $camposPermitidos)) {
        echo "<p style='color:red'>Campo inválido!</p>";
        return;
    }

    if ($campo === 'senha') {
        $valor = password_hash($valor, PASSWORD_DEFAULT);
    }

    $id = (int)$id;
    $sql = "UPDATE usuarios SET $campo = :valor WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':valor', $valor, PDO::PARAM_STR);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo "<p style='color:green'>Dados atualizados com sucesso!</p>";
    } else {
        echo "<p style='color:red'>Erro ao atualizar os dados.</p>";
    }
}

function excluirUsuario($pdo, $id) {
    $id = (int)$id;
    $sql = "DELETE FROM usuarios WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo "<p style='color:green'>Registro excluído com sucesso!</p>";
    } else {
        echo "<p style='color:red'>Erro ao excluir o registro.</p>";
    }
}

// ===== TRATAR POST =====
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['alterar'])) {
        $campo = $_POST['campo'] ?? '';
        $valor = $_POST['valor'] ?? '';
        $idUsuario = $_POST['id_usuario'] ?? 0;
        atualizarDado($pdo, $idUsuario, $campo, $valor);
    }

    if (isset($_POST['excluir'])) {
        $idUsuario = $_POST['id_usuario'] ?? 0;
        excluirUsuario($pdo, $idUsuario);
    }
}

// ===== CONSULTA USUÁRIOS =====

$TABLE = "usuarios";

try{
    $sql="SELECT * FROM ".$TABLE.";";
    $ponteiro = $pdo->prepare($sql);
    $ponteiro->execute();
    $resultado = $ponteiro->fetchAll(PDO::FETCH_ASSOC);

        if(count($resultado) >0){
             
           foreach($resultado as $indice => $conteudo){
    echo "
    <div class='foto-perfil'>
        <img src='../images/user.jpeg' alt='Foto de perfil'>
    </div>


   
        <fieldset class='dadosp'>
            <legend class='leg'>Dados Pessoais</legend>

            <label for='nome'>Nome</label>
            <input type='text' id='nome' name='nome' value='".$conteudo['nome']."'><br><br>

            <label for='sobrenome'>Sobrenome</label>
            <input type='text' id='sobrenome' name='sobrenome' value='".$conteudo['sobrenome']."'><br><br>

            <label for='email'>Email</label>
            <input type='email' id='email' name='email' value='".$conteudo['email']."'><br><br>

            <label for='cpf'>CPF</label>
            <input type='text' id='cpf' name='cpf' value='".$conteudo['cpf']."'><br><br>

            <label for='telefone'>Telefone</label>
            <input type='tel' id='telefone' name='telefone' value='".$conteudo['telefone']."'><br><br>
        </fieldset>

        <fieldset class='ender'>
            <legend class='leg'>Endereço</legend>

            <label for='cep'>CEP</label>
            <input type='text' id='cep' name='cep' value='".$conteudo['cep']."'><br><br>

            <label for='rua'>Rua</label>
            <input type='text' id='rua' name='rua' value='".$conteudo['rua']."'><br><br>

            <label for='numero'>Número</label>
            <input type='text' id='numero' name='numero' value='".$conteudo['numero']."'><br><br>

            <label for='complemento'>Complemento</label>
            <input type='text' id='complemento' name='complemento' value='".$conteudo['complemento']."'><br><br>

            <label for='bairro'>Bairro</label>
            <input type='text' id='bairro' name='bairro' value='".$conteudo['bairro']."'><br><br>

            <label for='cidade'>Cidade</label>
            <input type='text' id='cidade' name='cidade' value='".$conteudo['cidade']."'><br><br>

            <label for='estado'>Estado (UF)</label>
            <input type='text' id='estado' name='estado' value='".$conteudo['estado']."'><br><br>
        </fieldset>

        <fieldset class='senha'>
            <legend class='leg'>Senha</legend>

            <label for='senha'>Senha</label>
            <input type='password' id='senha' name='senha' value='".$conteudo['senha']."'><br><br>
        
            </fieldset>

 <div class='form-edicao'>

    <!-- FORMULÁRIO DE ALTERAR -->
    <form method='post'>
        <div class='lado'>
            <input type='hidden' name='id_usuario' value='" .$conteudo['id'] ."'>

            <label>Campo:</label> <br />
            <select class='campo-sel' name='campo'>
                <option value='nome'>Nome</option>
                <option value='sobrenome'>Sobrenome</option>
                <option value='email'>Email</option>
                <option value='cpf'>CPF</option>
                <option value='telefone'>Telefone</option>
                <option value='cep'>CEP</option>
                <option value='rua'>Rua</option>
                <option value='numero'>Número</option>
                <option value='complemento'>Complemento</option>
                <option value='bairro'>Bairro</option>
                <option value='cidade'>Cidade</option>
                <option value='estado'>Estado</option>
                <option value='senha'>Senha</option>
            </select> <br />

            <input type='text' name='valor' placeholder='Novo valor'> <br />
        </div>
<div class='t1'>
  
          <button type='submit' name='alterar'>Alterar</button>
</div>
    </form>

    <!-- FORMULÁRIO DE EXCLUIR -->
    <form class='t1' method='post'>
        <input type='hidden' name='id_usuario' value='". $conteudo['id'] ."'>
        <button type='submit' name='excluir'>Excluir</button>
    </form>

</div>

    ";
}

   
   
        };

}
catch(Exception $e){
    echo "atenção- Erro ao consultar: " . $e->getMessage();


};

?>

</main>


 <footer>
    <div class="footer-superior-completa">
      <div class="footer-superior-esquerdo">
        <h4 class="footer-topico">Institucional</h4>
        <ul class="sub-topicos">
          <li><a href="sobre.html">Sobre a empresa</a></li>
          <li><a href="lgpd.html">Política de Privacidade</a></li>
          <li><a href="">Termos de Uso</a></li>
        </ul>
      </div>
      <div class="footer-superior-meio">
        <h4 class="footer-topico">Ajuda</h4>
        <ul class="sub-topicos">
          <li><a href="">Fale Conosco/Suporte</a></li>
          <li><a href="">Trocas e Devoluções</a></li>
          <li><a href="">Formas de Pagamento</a></li>
          <li><a href="">Prazo de Entrega</a></li>
        </ul>
      </div>
      <div class="footer-superior-direito">
        <h4 class="footer-topico">Contato</h4>
        <ul class="lista-contato">
          <li>Telefone:(11) 99999-9999</li>
          <li>Email: contato@autoexpress.com.br</li>
          <li>Horario de atendimento: Seg a Sex, das 8h às 18h</li>
        </ul>
      </div>
    </div>
    <hr class="footer-divisao" />
    <div class="footer-inferior-completa">
      <div class="footer-inferior-esquerdo">
        <h4 class="footer-topico">Meios de pagamento:</h4>
        <figure class="image-pag">
          <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
          <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" />
          <img src="https://img.icons8.com/fluency/48/pix.png" alt="Pix" />

        </figure>
      </div>
      <div class="footer-inferior-direito">
        <h4 class="footer-topico">Redes Sociais</h4>
        <div class="espacamento-icone-sociais">
          <a href="#"><img src="https://img.icons8.com/ios-filled/30/ffffff/facebook.png" alt="Facebook" /></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/30/ffffff/instagram-new.png" alt="Instagram" /></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/30/ffffff/youtube-play.png" alt="YouTube" /></a>

        </div>
      </div>
    </div>

    <div class="footer-creditos">
      <p>Créditos</p>
    </div>
  </footer>










           

</body>
</html>


