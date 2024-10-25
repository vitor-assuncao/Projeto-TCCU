async function registerUser(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Verifica se os campos não estão vazios antes de enviar
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
            document.getElementById('registerForm').reset(); // Limpa o formulário
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

    // Verifica se os campos não estão vazios
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
            localStorage.setItem('token', data.token); // Armazena o token JWT
            document.getElementById('loginForm').reset();
        } else {
            alert(data.error || 'Erro ao fazer login.');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login.');
    }
}


// Função para alternar modais de login e registro
function toggleModal(modalToShow, modalToHide) {
    modalToHide.classList.add('hidden');
    modalToShow.classList.remove('hidden');
}

// Verifica se o DOM foi completamente carregado antes de registrar os event listeners
document.addEventListener("DOMContentLoaded", function () {
    const userIcon = document.getElementById("userIcon");
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');

    // Referência aos links para alternar entre login e cadastro
    const showRegisterLink = document.getElementById('showRegisterLink');
    const showLoginLink = document.getElementById('showLoginLink');

    // Referência ao formulário de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }

    // Referência ao formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }

    // Evento para abrir o modal de login ao clicar no ícone de usuário
    if (userIcon && loginModal) {
        userIcon.addEventListener("click", function () {
            loginModal.classList.toggle("hidden");
        });
    }

    // Alternar para o modal de registro
    if (showRegisterLink && loginModal && registerModal) {
        showRegisterLink.addEventListener('click', function (e) {
            e.preventDefault();
            toggleModal(registerModal, loginModal);
        });
    }

    // Alternar para o modal de login
    if (showLoginLink && loginModal && registerModal) {
        showLoginLink.addEventListener('click', function (e) {
            e.preventDefault();
            toggleModal(loginModal, registerModal);
        });
    }

    // Fechar os modais ao clicar fora deles
    window.addEventListener('click', function (event) {
        if (loginModal && !loginModal.contains(event.target) && !userIcon.contains(event.target)) {
            loginModal.classList.add('hidden');
        }

        if (registerModal && !registerModal.contains(event.target)) {
            registerModal.classList.add('hidden');
        }
    });

    // Prevenir que o clique dentro do modal feche o modal
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
