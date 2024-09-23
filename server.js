const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', // Altere para sua senha
    database: 'Marketplace'
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados');
});

// Rota para inserir um produto
app.post('/api/produtos', (req, res) => {
    const { nome, descricao, preco, estoque } = req.body;
    const sql = 'INSERT INTO Produto (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)';
    db.query(sql, [nome, descricao, preco, estoque], (err, result) => {
        if (err) {
            console.error('Erro ao inserir produto:', err);
            res.status(500).json({ error: 'Erro ao inserir produto' });
        } else {
            res.status(200).json({ message: 'Produto inserido com sucesso' });
        }
    });
});

// Rota para buscar produtos com base no nome
app.get('/api/produtos/search', (req, res) => {
    const { nome } = req.query; // Pega o parâmetro de busca na query string
    const sql = 'SELECT * FROM Produto WHERE nome LIKE ?'; // SQL para buscar produtos que contenham o nome
    db.query(sql, [`%${nome}%`], (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            res.status(500).json({ error: 'Erro ao buscar produtos' });
        } else {
            res.status(200).json(results); // Retorna os produtos encontrados
        }
    });
});


// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
