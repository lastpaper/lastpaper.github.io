// Efeito simples de clique nos botões
document.querySelectorAll('.link-btn').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
});

console.log("Perfil Papel-Moeda carregado.");
