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
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', nome);
            document.getElementById('registerForm').reset();
            showLoggedInModal(nome);
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
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', data.user.nome);
            document.getElementById('loginForm').reset();
            showLoggedInModal(data.user.nome);
        } else {
            alert(data.error || 'Erro ao fazer login.');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login.');
    }
}

// Função para exibir o modal de usuário logado
function showLoggedInModal(userName) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loggedInModal = document.getElementById('loggedInModal');
    const userProfileName = document.getElementById('userProfileName');

    if (!loginModal || !registerModal || !loggedInModal || !userProfileName) {
        return; // Sai da função se qualquer um dos elementos não existir
    }
    
    // Define o estado de login como true
    isLoggedIn = true;

    // Atualiza o nome do usuário no modal logado
    userProfileName.textContent = `Perfil: ${userName}`;

    // Esconde os modais de login e registro e exibe o modal de usuário logado
    loginModal.classList.add('hidden');
    registerModal.classList.add('hidden');
}

// Função para abrir a página de inserção de produto
function openProductForm() {
    window.location.href = "vender_produto.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const userIcon = document.getElementById("userIcon");
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loggedInModal = document.getElementById('loggedInModal');

    const showRegisterLink = document.getElementById('showRegisterLink');
    const showLoginLink = document.getElementById('showLoginLink');

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }

    // Verifica se o usuário está logado ao carregar a página
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const userName = localStorage.getItem('userName');
        isLoggedIn = true;
        showLoggedInModal(userName);
    }

    // Alterna entre mostrar e esconder o modal de usuário logado ao clicar no ícone
    if (userIcon) {
        userIcon.addEventListener("click", function (event) {
            event.stopPropagation();
            if (isLoggedIn) {
                loggedInModal.classList.toggle("hidden");
            } else {
                loginModal.classList.toggle("hidden");
            }
        });
    }

    // Alterna para o modal de registro ao clicar em "Cadastre-se"
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function (e) {
            e.preventDefault();
            toggleModal(registerModal, loginModal);
        });
    }

    // Alterna para o modal de login ao clicar em "Entrar"
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function (e) {
            e.preventDefault();
            toggleModal(loginModal, registerModal);
        });
    }

  // Fecha os modais ao clicar fora deles
    window.addEventListener('click', function (event) {
    if (loginModal && userIcon && !loginModal.contains(event.target) && !userIcon.contains(event.target)) {
        loginModal.classList.add('hidden');
    }
    if (registerModal && !registerModal.contains(event.target)) {
        registerModal.classList.add('hidden');
    }
    if (isLoggedIn && loggedInModal && userIcon && !loggedInModal.contains(event.target) && !userIcon.contains(event.target)) {
        loggedInModal.classList.add('hidden');
    }
});

    // Previne o fechamento ao clicar dentro dos modais
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

    if (loggedInModal) {
        loggedInModal.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }
});

// Função para alternar a visibilidade entre dois modais
function toggleModal(modalToShow, modalToHide) {
    modalToHide.classList.add('hidden');
    modalToShow.classList.remove('hidden');
}

// Função para logout
function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    isLoggedIn = false;
    alert('Você foi deslogado.');
    window.location.href = 'index.html';
}

// Função para registrar um produto
async function registerProduct(event) {
    console.log("teste");
    event.preventDefault();
    
    const nome = document.getElementById('nomeProduto').value;
    const descricao = document.getElementById('descricaoProduto').value;
    const preco = parseFloat(document.getElementById('precoProduto').value);
    const estoque = parseInt(document.getElementById('estoqueProduto').value);
    const imagem = document.getElementById('imagemProduto').files[0]; // Seleção da imagem

    // FormData para enviar os dados do produto e a imagem
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('preco', preco);
    formData.append('estoque', estoque);
    formData.append('imagem', imagem); // Adiciona a imagem ao FormData

    try {
        const response = await fetch('http://localhost:3000/api/produtos', {
            method: 'POST',
            body: formData // Envia o FormData contendo os dados e a imagem
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


document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("productForm");
    if (productForm) {
        productForm.addEventListener("submit", registerProduct);
    }
});

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

document.addEventListener("DOMContentLoaded", function () {
    const productGrid = document.getElementById('productGrid');
    
    if (productGrid) {
        loadProducts();
    } else {
        console.error("Elemento productGrid não encontrado.");
    }
});


// Função para carregar produtos por nome
async function loadProducts() {
    const searchQuery = document.getElementById('searchInput').value; // Obtém o valor do campo de busca

    if (!searchQuery) {
        return; // Sai se o campo de busca estiver vazio
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
                    <div class="product-card">
                        <div class="product-image-container">
                            <img src="/${product.imagem}" alt="${product.nome}" class="product-image"/>
                        </div>
                        <h3 class="product-name">${product.nome}</h3>
                        <p class="product-price">R$ ${product.preco.toFixed(2)}</p>
                        <button class="buy-button">Comprar</button>
                    </div>
                `;

                // Adiciona o evento de clique ao botão "Comprar"
                const buyButton = productItem.querySelector('.buy-button');
                buyButton.addEventListener('click', () => {
                    const url = `tela_produto.html?name=${encodeURIComponent(product.nome)}&price=${encodeURIComponent(product.preco)}&description=${encodeURIComponent(product.descricao)}&image=${encodeURIComponent(product.imagem)}&stock=${encodeURIComponent(product.estoque)}`;
                    window.location.href = url;
                });

                productGrid.appendChild(productItem);
            });
        }
    } catch (error) {
        // Erro silencioso
    }
}

let allProducts = [];

// Função para carregar todos os produtos ao iniciar
async function loadAllProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/produtos');
        const products = await response.json();
        allProducts = products; // Salva todos os produtos na variável global
        renderProducts(allProducts); // Renderiza todos os produtos inicialmente
    } catch (error) {
        // Erro silencioso
    }
}

// Função para carregar produtos filtrados por nome
function loadProducts() {
    const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase(); // Obtém o valor do campo de busca

    if (!searchQuery) {
        renderProducts(allProducts); // Renderiza todos os produtos se a pesquisa estiver vazia
        return;
    }

    const filteredProducts = allProducts.filter(product =>
        product.nome.toLowerCase().includes(searchQuery)
    );
    renderProducts(filteredProducts); // Renderiza os produtos filtrados
}

// Função para renderizar os produtos na página
function renderProducts(products) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = ''; // Limpa o grid anterior

    if (products.length === 0) {
        productGrid.innerHTML = '<p>Nenhum produto encontrado.</p>'; // Mostra mensagem se não encontrar nada
    } else {
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <div class="product-card">
                    <div class="product-image-container">
                        <img src="/${product.imagem}" alt="${product.nome}" class="product-image"/>
                    </div>
                    <h3 class="product-name">${product.nome}</h3>
                    <p class="product-price">R$ ${product.preco.toFixed(2)}</p>
                    <button class="buy-button">Comprar</button>
                </div>
            `;

            // Adiciona o evento de clique ao botão "Comprar"
            const buyButton = productItem.querySelector('.buy-button');
            buyButton.addEventListener('click', () => {
                const url = `tela_produto.html?name=${encodeURIComponent(product.nome)}&price=${encodeURIComponent(product.preco)}&description=${encodeURIComponent(product.descricao)}&image=${encodeURIComponent(product.imagem)}&stock=${encodeURIComponent(product.estoque)}`;
                window.location.href = url;
            });

            productGrid.appendChild(productItem);
        });
    }
}

// Adiciona eventos e carrega os produtos ao iniciar
document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById('searchButton'); // Botão de busca
    const searchInput = document.getElementById('searchInput');  // Campo de busca

    if (searchButton) {
        searchButton.addEventListener('click', loadProducts);
    }

    if (searchInput) {
        searchInput.addEventListener('input', loadProducts); // Filtra enquanto o usuário digita
    }

    loadAllProducts(); // Carrega todos os produtos ao iniciar
})

// Adiciona evento ao botão de busca
document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById('searchButton'); // Botão de busca
    if (searchButton) {
        searchButton.addEventListener('click', loadProducts);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const productName = urlParams.get('name');
    const productPrice = urlParams.get('price');
    const productDescription = urlParams.get('description');
    const productImage = urlParams.get('image');
    const productStock = urlParams.get('stock'); // Novo campo para estoque

    if (productName) {
        document.getElementById('productName').textContent = productName;
        document.getElementById('productPrice').textContent = `R$ ${productPrice || '0,00'}`;
        document.getElementById('productStock').textContent = `Estoque: ${productStock || '0'} unidades`; // Atualiza o estoque
        document.getElementById('productDescription').textContent = productDescription || 'Sem descrição disponível';


        const imageElement = document.querySelector('#productImage');
        if (productImage) {
            imageElement.src = `/${productImage}`;
            imageElement.alt = productName;
        } else {
            imageElement.src = 'icons/default-product.png'; // Imagem padrão se não houver
            imageElement.alt = 'Imagem padrão';
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const productGrid = document.getElementById('productGrid');
    
    if (productGrid) {
        loadProducts();
    } else {
        console.warn("Elemento productGrid não encontrado. Verifique se ele existe na página atual.");
    }
});
