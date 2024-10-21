const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

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

// Servir arquivos estáticos da pasta 'view' (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'view')));

// Servir o arquivo HTML principal diretamente da raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Arquivo HTML na raiz do projeto
});

// Rota para registro de usuário
app.post('/api/usuarios/register', async (req, res) => {
    const { nome, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10); // Hash da senha
    const sql = 'INSERT INTO Usuario (nome, email, senha) VALUES (?, ?, ?)';
    db.query(sql, [nome, email, hashedPassword], (err, result) => {
        if (err) {
            console.error('Erro ao registrar usuário:', err);
            res.status(500).json({ error: 'Erro ao registrar usuário' });
        } else {
            res.status(201).json({ message: 'Usuário registrado com sucesso' });
        }
    });
});

// Rota para login de usuário
app.post('/api/usuarios/login', (req, res) => {
    const { email, senha } = req.body;
    const sql = 'SELECT * FROM Usuario WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ error: 'Credenciais inválidas' });
        }

        const user = results[0];
        const match = await bcrypt.compare(senha, user.senha); // Verifica a senha

        if (!match) {
            return res.status(400).json({ error: 'Credenciais inválidas' });
        }

        // Gera um token JWT
        const token = jwt.sign({ id: user.id }, 'seu_segredo', { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
    });
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
