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

$novoNome= $_POST["nome"];
$novoSobrenome= $_POST["sobrenome"];
$novoEmail= $_POST["email"];
$novoCpf= $_POST["cpf"];               
$novoTelefone= $_POST["telefone"];
$novoCep= $_POST["cep"];
$novaRua= $_POST["rua"];
$novoNumero= $_POST["numero"];
$novoBairro= $_POST["bairro"];
$novoCidade= $_POST["cidade"];
$novoEstado= $_POST["estado"];
$novoComplemento= $_POST["complemento"];
$novoSenha= $_POST["senha"];
$confirmarSenha= $_POST["confirmar"];

if($novoSenha != $confirmarSenha) {
    echo "As senhas não conferem Por favor, tente novamente. <br/>
    <a href='../pages/cadastro.html'>Voltar</a>";

    exit;
}



$TABLE = "usuarios";

//inclusão de dados


 try{  $sql = $pdo->prepare("INSERT INTO ".$TABLE. 
 "(nome, sobrenome, email, cpf, telefone, numero, cep, rua,  bairro, cidade, estado, complemento, senha) 
 VALUES 
    (:C1,:C2,:C3,:C4,:C5,:C6,:C7,:C8,:C9,:C10,:C11,:C12,:C13);");  

  $sql->bindValue(":C1", $novoNome);
    $sql->bindValue(":C2", $novoSobrenome);
    $sql->bindValue(":C3", $novoEmail);
    $sql->bindValue(":C4", $novoCpf);
    $sql->bindValue(":C5", $novoTelefone);
    $sql->bindValue(":C6", $novoNumero);
    $sql->bindValue(":C7", $novoCep);
    $sql->bindValue(":C8", $novaRua);
    $sql->bindValue(":C9", $novoBairro);
    $sql->bindValue(":C10", $novoCidade);
    $sql->bindValue(":C11", $novoEstado);
    $sql->bindValue(":C12", $novoComplemento);
    $sql->bindValue(":C13", $novoSenha);
    $sql->execute();

    header("location: ../pages/perfil.php");
    exit;

 }
 catch(Exception $er){
    echo "Erro ao inserir dados: " . $er->getMessage();
    exit;
 }








?>