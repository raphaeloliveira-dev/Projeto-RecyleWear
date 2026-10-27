CREATE DATABASE recyclewear;
USE recyclewear;

CREATE TABLE categoria (
id_categoria INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(50) NOT NULL,
descricao TEXT
);

INSERT INTO categoria ( nome, descricao ) VALUES
( 'Camiseta',
'Composição : 100% Algodão;
Modelagem: Regular (corte reto e confortável)
Diferenciais: Tecido fresco, alta durabilidade e fácil de combinar.'
);

CREATE TABLE usuario (
id_usuario INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(50) NOT NULL,
email VARCHAR(100) NOT NULL, 
senha VARCHAR(255) NOT NULL,
cpf VARCHAR(18) NOT NULL
);

INSERT INTO usuario (nome, email, senha, cpf) VALUES
( 'Rodrigo',
'rodrigo.oliver51@gmail.com',
'Rodrigo14912',
'416.194.813-09'
);

CREATE TABLE produto (
id_produto INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
preco DECIMAL(10,2) NOT NULL,
estoque INT NOT NULL DEFAULT 0,
id_categoria INT NOT NULL,
FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

INSERT INTO produto (nome, preco, estoque, id_categoria) VALUES
( 'Camiseta Básica 100% Algodão',
69.99,
100,
1
);

INSERT INTO produto (nome, preco, estoque, id_categoria) VALUES
( 'Camiseta Polo',
89.99,
80,
1
);


CREATE TABLE compra (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_compra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario)
);

INSERT INTO compra (id_usuario, valor) VALUES
( 1,
69.99
);

CREATE TABLE item_compras (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,

    FOREIGN KEY (id_compra)
        REFERENCES compra(id_compra),

    FOREIGN KEY (id_produto)
        REFERENCES produto(id_produto)
);

INSERT INTO item_compras
    (id_compra, id_produto, quantidade)
VALUES
    (1, 1, 1);

SELECT * FROM categoria;
SELECT * FROM usuario;
SELECT * FROM produto;
SELECT * FROM compra;
SELECT * FROM item_compras;