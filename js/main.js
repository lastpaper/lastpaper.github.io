// Efeito de clique nos botões (feedback visual)
document.querySelectorAll('.link-btn').forEach(button => {
    button.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });

    button.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-3px)'; // Volta ao estado de hover
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

console.log("Perfil PAPER carregado com sucesso.");
