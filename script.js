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
    const container = document.getElementById('results');
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
