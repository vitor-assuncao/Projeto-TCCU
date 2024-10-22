// Função para registrar um usuário
// Função para registrar um usuário
async function registerUser(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

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
            document.getElementById('registerForm').reset(); // Limpa o formulário
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
    const searchQuery = document.getElementById('searchInput').value; // Pega o valor do campo de busca

    try {
        const response = await fetch(`http://localhost:3000/api/produtos/search?nome=${searchQuery}`);
        const products = await response.json();
        const productGrid = document.getElementById('productGrid');
        productGrid.innerHTML = ''; // Limpa a lista de produtos anterior

        if (products.length === 0) {
            productGrid.innerHTML = '<p>Nenhum produto encontrado.</p>'; // Mostra mensagem se não encontrar nada
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

// Verifica se o DOM foi completamente carregado antes de registrar os event listeners
document.addEventListener("DOMContentLoaded", function () {
    const userIcon = document.getElementById("userIcon");
    const userModal = document.getElementById("userModal");

    // Verifica se o formulário de registro existe
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Adiciona um listener para o evento de submit no formulário de registro
        registerForm.addEventListener('submit', registerUser);
    }

    // Verifica se o ícone do usuário existe
    if (userIcon) {
        userIcon.addEventListener("click", function (event) {
            event.preventDefault(); // Evita o comportamento de link padrão
            console.log("Ícone de usuário clicado!");
            userModal.classList.toggle("hidden");
        });

        // Fecha o modal ao clicar fora dele
        window.addEventListener("click", function (event) {
            if (!userModal.contains(event.target) && !userIcon.contains(event.target)) {
                userModal.classList.add("hidden");
            }
        });
    } else {
        console.error("O elemento userIcon não foi encontrado. Verifique o ID no HTML.");
    }
});