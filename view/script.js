let isLoggedIn = false; // Variável para controlar o estado de login

async function registerUser(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

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

            // Salva os dados do usuário no localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuarioId', data.user.id);
            localStorage.setItem('userName', data.user.nome);
            localStorage.setItem('isLoggedIn', 'true');

            // Atualiza a interface para o estado logado
            showLoggedInModal(data.user.nome);
        } else {
            alert(data.error || 'Erro ao registrar usuário.');
        }
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        alert('Erro ao registrar usuário.');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName');
    
    if (isLoggedIn && userName) {
        showLoggedInModal(userName); // Mostra o modal de usuário logado
    }
});



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
            // Salve o ID do usuário no localStorage
            console.log('Dados recebidos do servidor:', data); // Para depuração
            localStorage.setItem('usuarioId', data.user.id); // Certifique-se de que 'data.user.id' está correto
            localStorage.setItem('token', data.token);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', data.user.nome);

            // Mostra o modal logado
            showLoggedInModal(data.user.nome);
        } else {
            alert(data.error || 'Erro ao fazer login.');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login.');
    }
    console.log('Dados recebidos do servidor:', data)
}


// Função para exibir o modal de usuário logado
function showLoggedInModal(userName) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loggedInModal = document.getElementById('loggedInModal');
    const userProfileName = document.getElementById('userProfileName');

    if (!loginModal || !registerModal || !loggedInModal || !userProfileName) {
        console.error('Elementos necessários para o modal de login não foram encontrados.');
        return;
    }

    // Atualiza o estado para logado
    isLoggedIn = true;

    // Define o nome do usuário
    userProfileName.textContent = `Perfil: ${userName}`;

    // Esconde os modais de login e registro
    loginModal.classList.add('hidden');
    registerModal.classList.add('hidden');

    // Mostra o modal de usuário logado
    loggedInModal.classList.remove('hidden');
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
                    <button class="buy-button" 
                        data-id="${product.id}" 
                        data-name="${product.nome}" 
                        data-price="${product.preco}" 
                        data-description="${product.descricao}" 
                        data-image="${product.imagem}" 
                        data-stock="${product.estoque}">
                        Comprar
                    </button>
                </div>
            `;

            productGrid.appendChild(productItem);
        });

        // Adiciona eventos de clique aos botões "Comprar"
        const buyButtons = document.querySelectorAll('.buy-button');
        buyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                console.log(`Produto ID capturado ao clicar: ${productId}`);
                const productName = button.getAttribute('data-name');
                const productPrice = button.getAttribute('data-price');
                const productDescription = button.getAttribute('data-description');
                const productImage = button.getAttribute('data-image');
                const productStock = button.getAttribute('data-stock');

                if (!productId) {
                    console.error('Erro: ID do produto não encontrado.');
                    return;
                }

                // Redireciona para a página do produto com o ID e outros detalhes na URL
                const productUrl = `tela_produto.html?id=${productId}&name=${encodeURIComponent(productName)}&price=${productPrice}&description=${encodeURIComponent(productDescription)}&image=${encodeURIComponent(productImage)}&stock=${productStock}`;
                window.location.href = productUrl;
            });
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

    // Obtém os parâmetros da URL
    const productId = urlParams.get('id');
    const productName = urlParams.get('name');
    const productPrice = urlParams.get('price');
    const productDescription = urlParams.get('description');
    const productImage = urlParams.get('image');
    const productStock = urlParams.get('stock');

    // Verifica se o ID do produto foi capturado
    if (productId) {
        console.log(`Produto ID capturado: ${productId}`);
    } else {
        console.error('Erro: ID do produto não encontrado na URL.');
    }

    // Atualiza os detalhes do produto na página
    if (productName) {
        document.getElementById('productName').textContent = productName;
        document.getElementById('productPrice').textContent = `R$ ${productPrice || '0,00'}`;
        document.getElementById('productStock').textContent = `Estoque: ${productStock || '0'} unidades`;
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

// Referências ao carrinho
document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.querySelector('#cartIcon'); // Ícone do carrinho
    const cartModal = document.querySelector('#cart'); // Modal do carrinho
    const cartOverlay = document.querySelector('#cartOverlay'); // Overlay escuro
    const cartItemsContainer = document.querySelector('#cartItems'); // Container dos itens
    const cartTotalElement = document.querySelector('#cartTotal'); // Total do carrinho
    const closeCartButton = document.querySelector('#closeCart'); // Botão de fechar o carrinho

    if (!cartIcon) {
        console.error('Elemento #cartIcon não encontrado no DOM.');
        return;
    }

    // Evento ao clicar no ícone do carrinho
    cartIcon.addEventListener('click', async () => {
        console.log('Ícone do carrinho clicado!');
        const usuarioId = localStorage.getItem('usuarioId');
    
        if (!usuarioId) {
            alert('Você precisa estar logado para ver o carrinho.');
            return;
        }
    
        try {
            const response = await fetch(`/api/carrinho?usuarioId=${usuarioId}`);
            const data = await response.json();
            console.log('Itens do carrinho recebidos:', data);
    
            cartItemsContainer.innerHTML = '';
    
            if (data.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">Sua sacola está vazia.</p>';
                cartTotalElement.textContent = 'R$ 0,00';
            } else {
                let total = 0;
    
                data.forEach((item) => {
                    total += item.preco;
                    cartItemsContainer.innerHTML += `
                        <div class="cart-item">
                            <img src="/${item.imagem}" alt="${item.nome}" class="cart-item-image">
                            <div class="cart-item-details">
                                <h4>${item.nome}</h4>
                                <p>R$ ${item.preco.toFixed(2)}</p>
                            </div>
                        </div>
                    `;
                });
    
                cartTotalElement.textContent = `R$ ${total.toFixed(2)}`;
            }
    
            // Exibe o modal do carrinho e o overlay
            cartModal.classList.add('open');
            cartModal.classList.remove('hidden');
            cartOverlay.classList.add('open');
            cartOverlay.classList.remove('hidden');
            console.log('Exibindo o modal do carrinho');
        } catch (error) {
            console.error('Erro ao carregar o carrinho:', error);
        }
    });

    // Fecha o modal do carrinho e remove o overlay
    closeCartButton.addEventListener('click', () => {
        console.log('Fechando o modal do carrinho');
        cartModal.classList.add('hidden');
        cartModal.classList.remove('open');
        cartOverlay.classList.add('hidden');
        cartOverlay.classList.remove('open');
    });

    // Fecha o carrinho ao clicar fora do modal
    cartOverlay.addEventListener('click', () => {
        console.log('Fechando o modal do carrinho pelo overlay');
        cartModal.classList.add('hidden');
        cartModal.classList.remove('open');
        cartOverlay.classList.add('hidden');
        cartOverlay.classList.remove('open');
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const addToCartButton = document.querySelector('.buy-button2'); // Botão de adicionar ao carrinho

    if (addToCartButton) {
        addToCartButton.addEventListener('click', async () => {
            const usuarioId = localStorage.getItem('usuarioId'); // ID do usuário logado
            const productId = new URLSearchParams(window.location.search).get('id'); // ID do produto pela URL

            if (!usuarioId) {
                alert('Você precisa estar logado para adicionar produtos ao carrinho.');
                return;
            }

            if (!productId) {
                alert('Erro ao obter ID do produto.');
                return;
            }

            try {
                console.log(`Adicionando produto ao carrinho. Usuário: ${usuarioId}, Produto: ${productId}`);

                // Faz a requisição para adicionar o produto ao carrinho
                const response = await fetch('/api/carrinho/adicionar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        usuarioId: usuarioId,
                        produtoId: productId,
                    }),
                });

                const data = await response.json();
                if (response.ok) {
                    console.log('Produto adicionado ao carrinho:', data);
                    alert('Produto adicionado ao carrinho com sucesso!');
                } else {
                    alert(data.error || 'Erro ao adicionar produto ao carrinho.');
                }
            } catch (error) {
                console.error('Erro ao adicionar produto ao carrinho:', error);
                alert('Erro ao adicionar o produto ao carrinho.');
            }
        });
    }
});
