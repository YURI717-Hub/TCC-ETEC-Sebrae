create database autopeca;
use autopeca;

create table usuarios(
id int auto_increment primary key,
nome varchar(100) not null,
sobrenome varchar(100) not null,
email varchar(100) not null,
cpf  varchar(14) not null ,
telefone varchar(14) not null,
numero int not null,
rua varchar(100 ) not null, 
cep varchar (10) not null, 
bairro varchar(100) not null,
cidade varchar(110) not null,
estado varchar(2) not null,
complemento varchar(100),
senha varchar(100) not null
);
 
  select *from usuarios;
 drop table usuarios;
