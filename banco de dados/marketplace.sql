CREATE DATABASE Marketplace;
USE Marketplace;

-- Tabela Usuario
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- Tabela Produto
CREATE TABLE Produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DOUBLE NOT NULL,
    estoque INT NOT NULL,
    imagem VARCHAR(255)
);

-- Tabela Carrinho
CREATE TABLE Carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- Tabela de associação Carrinho_Produto
CREATE TABLE Carrinho_Produto (
    carrinho_id INT,
    produto_id INT,
    PRIMARY KEY (carrinho_id, produto_id),
    FOREIGN KEY (carrinho_id) REFERENCES Carrinho(id),
    FOREIGN KEY (produto_id) REFERENCES Produto(id)
);

-- Tabela Pedido
CREATE TABLE Pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    data DATE NOT NULL,
    total DOUBLE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- Tabela BancoDeDados (simulada como Log de Operações para registrar salvamento, carregamento e remoção de dados)
CREATE TABLE LogOperacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operacao VARCHAR(50) NOT NULL,
    objeto_tipo VARCHAR(50),
    objeto_id INT,
    data_operacao DATETIME DEFAULT CURRENT_TIMESTAMP
);
