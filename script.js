const produtos = [
    { nome: "Camiseta Azul", categoria: "Roupas", preco: 29.99 },
    { nome: "Camiseta Vermelha", categoria: "Roupas", preco: 24.99 },
    { nome: "Calça Jeans", categoria: "Roupas", preco: 49.99 },
    { nome: "Tênis Esportivo", categoria: "Calçados", preco: 99.99 },
    { nome: "Relógio de Pulso", categoria: "Acessórios", preco: 149.99 }
];

document.getElementById('searchInput').addEventListener('input', function() {
    const termoBusca = this.value.toLowerCase();
    const resultados = produtos.filter(produto => produto.nome.toLowerCase().includes(termoBusca));
    mostrarResultados(resultados);
});

function mostrarResultados(resultados) {
    const container = document.getElementById('productGrid');
    container.innerHTML = '';  // Limpa os resultados anteriores

    if (resultados.length > 0) {
        resultados.forEach(produto => {
            const produtoDiv = document.createElement('div');
            produtoDiv.textContent = `${produto.nome} - ${produto.categoria} - R$${produto.preco.toFixed(2)}`;
            container.appendChild(produtoDiv);
        });
    } else {
        container.innerHTML = 'Nenhum produto encontrado.';
    }
}

// Função para registrar um usuário
async function registerUser(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost:3000/api/usuarios/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Usuário registrado com sucesso!');
            document.getElementById('registerForm').reset();
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
    }
}

// Função para fazer login
async function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;

    try {
        const response = await fetch('http://localhost:3000/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Login realizado com sucesso!');
            localStorage.setItem('token', data.token); // Armazena o token JWT
            document.getElementById('loginForm').reset();
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
    }
}

// Função para cadastrar um produto
async function registerProduct(event) {
    event.preventDefault();
    const nome = document.getElementById('nomeProduto').value;
    const descricao = document.getElementById('descricaoProduto').value;
    const preco = parseFloat(document.getElementById('precoProduto').value);
    const estoque = parseInt(document.getElementById('estoqueProduto').value);

    try {
        const response = await fetch('http://localhost:3000/api/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, descricao, preco, estoque }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Produto cadastrado com sucesso!');
            document.getElementById('productForm').reset();
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
    }
}

// Função para buscar produtos com base no nome
async function searchProducts() {
    const searchQuery = document.getElementById('searchInput').value;

    try {
        const response = await fetch(`http://localhost:3000/api/produtos/search?nome=${searchQuery}`);
        const products = await response.json();
        const productGrid = document.getElementById('productGrid');
        productGrid.innerHTML = ''; // Limpa a lista de produtos anterior

        if (products.length === 0) {
            productGrid.innerHTML = '<p>Nenhum produto encontrado.</p>';
        } else {
            products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.innerHTML = `
                    <h3>${product.nome}</h3>
                    <p>${product.descricao}</p>
                    <p>Preço: R$ ${product.preco.toFixed(2)}</p>
                    <p>Estoque: ${product.estoque}</p>
                `;
                productGrid.appendChild(productItem);
            });
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

// Event listeners para os formulários
document.getElementById('registerForm').addEventListener('submit', registerUser);
document.getElementById('loginForm').addEventListener('submit', loginUser);
document.getElementById('productForm').addEventListener('submit', registerProduct);
