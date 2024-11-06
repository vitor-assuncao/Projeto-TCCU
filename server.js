const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'view')));
app.use(express.static(__dirname));
// Torna a pasta 'uploads' pública para acesso às imagens
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração do multer para salvar a imagem na pasta 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define a pasta onde as imagens serão armazenadas
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Define o nome do arquivo
    }
});

const upload = multer({ storage });

// Rota para a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html')); // Corrigido o caminho
});

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

app.post('/api/produtos', upload.single('imagem'), (req, res) => {
    const { nome, descricao, preco, estoque } = req.body;
    const imagem = req.file ? req.file.path : null;
    console.log('Dados recebidos para registro de produto:', { nome, descricao, preco, estoque, imagem });

    const sql = 'INSERT INTO Produto (nome, descricao, preco, estoque, imagem) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome, descricao, preco, estoque, imagem], (err, result) => {
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
    const { nome } = req.query;
    
    if (!nome) {
        return res.status(400).json({ error: 'Parâmetro de busca não fornecido' });
    }

    const sql = 'SELECT * FROM Produto WHERE nome LIKE ?';
    db.query(sql, [`%${nome}%`], (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            res.status(500).json({ error: 'Erro ao buscar produtos' });
        } else {
            res.status(200).json(results);
        }
    });
});


// Rota para registro de usuário
app.post('/api/usuarios/register', async (req, res) => {
    const { nome, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);
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
        const match = await bcrypt.compare(senha, user.senha);

        if (!match) {
            return res.status(400).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user.id }, 'seu_segredo', { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
    });
});

// Rota para adicionar item ao carrinho
app.post('/api/carrinho/adicionar', (req, res) => {
    const { usuarioId, produtoId } = req.body;

    // Validação: Verifique se os valores foram enviados
    if (!usuarioId || !produtoId) {
        return res.status(400).json({ error: 'Campos usuarioId e produtoId são obrigatórios' });
    }

    // Verifica se o carrinho do usuário já existe
    const checkCarrinhoSql = 'SELECT id FROM Carrinho WHERE usuario_id = ?';
    db.query(checkCarrinhoSql, [usuarioId], (err, results) => {
        if (err) {
            console.error('Erro ao verificar o carrinho:', err);
            return res.status(500).json({ error: 'Erro ao verificar o carrinho' });
        }

        // Se o carrinho não existir, cria um novo
        let carrinhoId = results.length > 0 ? results[0].id : null;
        if (!carrinhoId) {
            const createCarrinhoSql = 'INSERT INTO Carrinho (usuario_id) VALUES (?)';
            db.query(createCarrinhoSql, [usuarioId], (err, result) => {
                if (err) {
                    console.error('Erro ao criar carrinho:', err);
                    return res.status(500).json({ error: 'Erro ao criar carrinho' });
                }
                carrinhoId = result.insertId;

                // Insere o produto no carrinho
                inserirProdutoCarrinho(carrinhoId, produtoId, res);
            });
        } else {
            // Se o carrinho já existe, insere o produto
            inserirProdutoCarrinho(carrinhoId, produtoId, res);
        }
    });
});

// Função auxiliar para inserir o produto no carrinho
function inserirProdutoCarrinho(carrinhoId, produtoId, res) {
    console.log('Inserindo produto no carrinho:', { carrinhoId, produtoId }); // Log para depuração

    const addProdutoSql = 'INSERT INTO Carrinho_Produto (carrinho_id, produto_id) VALUES (?, ?)';
    db.query(addProdutoSql, [carrinhoId, produtoId], (err) => {
        if (err) {
            console.error('Erro ao adicionar produto ao carrinho:', err);
            return res.status(500).json({ error: 'Erro ao adicionar produto ao carrinho' });
        }
        res.status(200).json({ message: 'Produto adicionado ao carrinho com sucesso' });
    });
}


// Rota para remover item do carrinho
app.delete('/api/carrinho/remover', (req, res) => {
    const { usuarioId, produtoId } = req.body;

    // Verifica se o carrinho do usuário existe
    const checkCarrinhoSql = 'SELECT id FROM Carrinho WHERE usuario_id = ?';
    db.query(checkCarrinhoSql, [usuarioId], (err, results) => {
        if (err || results.length === 0) {
            console.error('Erro ao verificar carrinho ou carrinho não encontrado:', err);
            return res.status(404).json({ error: 'Carrinho não encontrado' });
        }

        const carrinhoId = results[0].id;
        const removeProdutoSql = 'DELETE FROM Carrinho_Produto WHERE carrinho_id = ? AND produto_id = ?';
        db.query(removeProdutoSql, [carrinhoId, produtoId], (err) => {
            if (err) {
                console.error('Erro ao remover produto do carrinho:', err);
                return res.status(500).json({ error: 'Erro ao remover produto do carrinho' });
            }
            res.status(200).json({ message: 'Produto removido do carrinho com sucesso' });
        });
    });
});

// Rota para obter todos os produtos
app.get('/api/produtos', (req, res) => {
    const sql = 'SELECT * FROM Produto';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            res.status(500).json({ error: 'Erro ao buscar produtos' });
        } else {
            res.status(200).json(results);
        }
    });
});


// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
