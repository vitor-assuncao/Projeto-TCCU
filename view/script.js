let isLoggedIn = false; // Variável para controlar o estado de login

async function registerUser(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!nome || !email || !senha) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/usuarios/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Usuário registrado com sucesso!');
            localStorage.setItem('token', data.token);
            document.getElementById('registerForm').reset();
            showLoggedInModal(nome); // Exibe o modal do usuário logado
        } else {
            alert(data.error || 'Erro ao registrar usuário.');
        }
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        alert('Erro ao registrar usuário.');
    }
}

async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;

    if (!email || !senha) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Login realizado com sucesso!');
            localStorage.setItem('token', data.token);
            document.getElementById('loginForm').reset();
            showLoggedInModal(data.user.nome); // Exibe o modal do usuário logado
        } else {
            alert(data.error || 'Erro ao fazer login.');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login.');
    }
}

// Função para alternar a visibilidade entre dois modais
function toggleModal(modalToShow, modalToHide) {
    modalToHide.classList.add('hidden');
    modalToShow.classList.remove('hidden');
}

// Função para exibir o modal de usuário logado
function showLoggedInModal(userName) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loggedInModal = document.getElementById('loggedInModal');
    const userProfileName = document.getElementById('userProfileName');

    // Esconde os modais de login e registro
    loginModal.classList.add('hidden');
    registerModal.classList.add('hidden');

    // Define o estado de login como true
    isLoggedIn = true;

    // Atualiza o nome do usuário no modal logado
    userProfileName.textContent = `Perfil: ${userName}`;

    // Exibe o modal de usuário logado
    loggedInModal.classList.remove('hidden');
}

// Função para abrir o formulário de inserção de produto
function openProductForm() {
    alert("Formulário de Inserção de Produto"); // Substitua pelo código para abrir o modal ou a página do formulário
}

document.addEventListener("DOMContentLoaded", function () {
    const userIcon = document.getElementById("userIcon");
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loggedInModal = document.getElementById('loggedInModal');

    const showRegisterLink = document.getElementById('showRegisterLink'); // Link "Cadastre-se"
    const showLoginLink = document.getElementById('showLoginLink'); // Link "Entrar"

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }

    if (userIcon) {
        userIcon.addEventListener("click", function () {
            if (isLoggedIn) {
                loggedInModal.classList.toggle("hidden"); // Abre o modal de usuário logado se estiver logado
            } else {
                loginModal.classList.toggle("hidden"); // Caso contrário, abre o modal de login
            }
        });
    }

    // Event listener para alternar para o modal de registro ao clicar em "Cadastre-se"
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function (e) {
            e.preventDefault();
            toggleModal(registerModal, loginModal); // Alterna para o modal de cadastro
        });
    }

    // Event listener para alternar para o modal de login ao clicar em "Entrar"
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function (e) {
            e.preventDefault();
            toggleModal(loginModal, registerModal); // Alterna para o modal de login
        });
    }

    window.addEventListener('click', function (event) {
        if (!loginModal.contains(event.target) && !userIcon.contains(event.target)) {
            loginModal.classList.add('hidden');
        }
        if (!registerModal.contains(event.target)) {
            registerModal.classList.add('hidden');
        }
        if (!loggedInModal.contains(event.target)) {
            loggedInModal.classList.add('hidden');
        }
    });

    if (loginModal) {
        loginModal.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }

    if (registerModal) {
        registerModal.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }
});

// Função para registrar um produto
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

// Função de Buscar Produtos
async function searchProducts() {
    const searchQuery = document.getElementById('searchInput').value; // Pega o valor do campo de busca

    if (!searchQuery) {
        alert('Por favor, insira um termo de busca!');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/produtos/search?nome=${encodeURIComponent(searchQuery)}`);
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

