/* ============================================
   PAPEL-MOEDA - INTERATIVIDADE COM MOVIMENTO
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // CURSOR PERSONALIZADO
    // ============================================
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            setTimeout(() => {
                cursorFollower.style.left = (e.clientX - 10) + 'px';
                cursorFollower.style.top = (e.clientY - 10) + 'px';
            }, 100);
        });

        const interactiveElements = document.querySelectorAll('a, button, .image-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursorFollower.style.transform = 'scale(1.5)';
            });

            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
            });
        });
    }

    // ============================================
    // 🌊 PARALLAX 3D DO CARROSSel COM O MOUSE
    // O carrossel inteiro inclina conforme o cursor
    // ============================================
    const galleryContainer = document.getElementById('galleryContainer');
    const rotatingImages = document.getElementById('rotatingImages');
    let parallaxActive = true;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    // Listener de mouse na galeria para efeito parallax
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return;

        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;

        // Limita a inclinação a ±15 graus para não distorcer demais
        targetRotateY = mouseX * 15;
        targetRotateX = -mouseY * 10;
    });

    // Animação suave do parallax com easing
    function animateParallax() {
        // Interpolação suave (lerp)
        currentRotateX += (targetRotateX - currentRotateX) * 0.08;
        currentRotateY += (targetRotateY - currentRotateY) * 0.08;

        if (galleryContainer && parallaxActive) {
            galleryContainer.style.transform =
                `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
        }

        requestAnimationFrame(animateParallax);
    }
    animateParallax();

    // Pausa o parallax quando o mouse sai da janela
    document.addEventListener('mouseleave', () => {
        targetRotateX = 0;
        targetRotateY = 0;
    });

    // ============================================
    // 🎯 CONTROLE DE VELOCIDADE DO CARROSSEL
    // ============================================
    // Pausar rotação ao passar o mouse
    rotatingImages.addEventListener('mouseenter', () => {
        rotatingImages.style.animationPlayState = 'paused';
    });

    rotatingImages.addEventListener('mouseleave', () => {
        rotatingImages.style.animationPlayState = 'running';
    });

    // ============================================
    // 🖱️ EFEITO DE TILT 3D EM CADA CARD (HOVER)
    // Cada card inclina conforme a posição do mouse DENTRO dele
    // ============================================
    const imageCards = document.querySelectorAll('.image-card');

    imageCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            card.style.transform = `
                rotateY(calc(var(--i) * 51.43deg))
                translateZ(500px)
                scale(1.1)
                rotateX(${rotateX}deg)
                rotateY(${rotateY + (card.style.getPropertyValue('--i') * 51.43)}deg)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ============================================
    // 🌌 SISTEMA DE PARTÍCULAS
    // ============================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 80;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = this.getRandomColor();
        }

        getRandomColor() {
            const colors = ['#ff003c', '#00f0ff', '#ffd700'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();

            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - distance/1000})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    // ============================================
    // 🎵 PLAYER DE MÚSICA
    // ============================================
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const bars = document.querySelectorAll('.bar');

    let isPlaying = false;

    playBtn.addEventListener('click', togglePlay);

    function togglePlay() {
        if (isPlaying) {
            audioPlayer.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            bars.forEach(bar => bar.style.animationPlayState = 'paused');
        } else {
            audioPlayer.play().catch(error => {
                console.log("Interação do usuário necessária para reproduzir áudio.");
            });
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            bars.forEach(bar => bar.style.animationPlayState = 'running');
        }
        isPlaying = !isPlaying;
    }

    audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = progress + '%';
        }
    });

    progressBar.parentElement.addEventListener('click', (e) => {
        const width = e.target.parentElement.offsetWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        if (duration) {
            audioPlayer.currentTime = (clickX / width) * duration;
        }
    });

    prevBtn.addEventListener('click', () => {
        audioPlayer.currentTime = 0;
        if (!isPlaying) togglePlay();
    });

    nextBtn.addEventListener('click', () => {
        audioPlayer.currentTime = 0;
        if (!isPlaying) togglePlay();
    });

    // ============================================
    // 🔤 EFEITO GLITCH NO TÍTULO
    // ============================================
    const glitchElement = document.querySelector('.glitch');
    const originalText = glitchElement.textContent;
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    function glitchText() {
        let iterations = 0;
        const interval = setInterval(() => {
            glitchElement.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iterations >= originalText.length) {
                clearInterval(interval);
            }

            iterations += 1/3;
        }, 50);
    }

    setInterval(glitchText, 6000);

    // ============================================
    // 💥 PARTÍCULA AO CLICAR
    // ============================================
    document.addEventListener('click', (e) => {
        createClickParticle(e.clientX, e.clientY);
    });

    function createClickParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = 'var(--color-primary)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.boxShadow = '0 0 20px var(--color-primary)';
        particle.style.transform = 'translate(-50%, -50%)';

        document.body.appendChild(particle);

        let opacity = 1;
        let size = 10;

        const animate = () => {
            opacity -= 0.03;
            size += 3;

            particle.style.opacity = opacity;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        animate();
    }

    // ============================================
    // 🎮 CONTROLES EXTRAS DO CARROSSEL (TECLADO)
    // ============================================
    let rotationSpeed = 30; // segundos por volta

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            rotationSpeed = Math.max(10, rotationSpeed - 5);
            rotatingImages.style.animationDuration = rotationSpeed + 's';
        } else if (e.key === 'ArrowRight') {
            rotationSpeed = Math.min(60, rotationSpeed + 5);
            rotatingImages.style.animationDuration = rotationSpeed + 's';
        } else if (e.key === ' ') {
            e.preventDefault();
            const playState = rotatingImages.style.animationPlayState;
            rotatingImages.style.animationPlayState = playState === 'paused' ? 'running' : 'paused';
        }
    });

    // ============================================
    // 🖱️ SCROLL PARA CONTROLAR ROTAÇÃO
    // ============================================
    let scrollAccumulator = 0;
    let isScrollControlling = false;
    let scrollTimeout;

    galleryContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        isScrollControlling = true;
        rotatingImages.style.animationPlayState = 'paused';

        scrollAccumulator += e.deltaY * 0.5;
        rotatingImages.style.transform = `rotateY(${scrollAccumulator}deg)`;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrollControlling = false;
            rotatingImages.style.animationPlayState = 'running';
        }, 1500);
    }, { passive: false });

    /* ============================================
       INCREMENTO: LÓGICA DA HEMEROTECA AND
       ============================================ */

    // Banco de dados com conteúdo real extraído de anovademocracia.com.br
    const andNewsData = [
        {
            category: "Internacional",
            title: "Plantão Palestina: ‘Cumpra sua palavra ou pague o preço’, adverte Irã",
            date: "12/07/2026",
            excerpt: "Após nova violação dos EUA, a força ianque para Gaza encolhe drasticamente enquanto o Irã atinge bases em cinco países em resposta aos bombardeios costeiras.",
            link: "https://anovademocracia.com.br"
        },
        {
            category: "Brasil",
            title: "Mineradora dos irmãos Batista contamina Pantanal e expulsa moradores",
            date: "13/07/2026",
            excerpt: "Reportagem especial expõe a devastação socioambiental e a violência contra comunidades tradicionais na região, denunciando a negligência estatal e a ganância do capital.",
            link: "https://anovademocracia.com.br"
        },
        {
            category: "Internacional",
            title: "EUA articulam rede internacional de inteligência contra a esquerda",
            date: "13/07/2026",
            excerpt: "Estratégia ianque prevê designações de 'terrorismo político', assistência de segurança e mapeamento de vínculos transnacionais de organizações progressistas na América Latina.",
            link: "https://anovademocracia.com.br"
        },
        {
            category: "Editorial",
            title: "Apoiar a Resistência da Palestina e do Irã é a mais alta tarefa",
            date: "04/04/2026",
            excerpt: "O editorial destaca a necessidade imperativa de unidade anti-imperialista global frente à escalada agressiva do capital financeiro e das potências ocidentais.",
            link: "https://anovademocracia.com.br"
        },
        {
            category: "Reportagem Especial",
            title: "Policiais brasileiros são treinados pelo FBI e aplicam doutrina ianque",
            date: "13/04/2026",
            excerpt: "Pesquisador revela como a cooperação internacional de segurança serve, na prática, para reprimir movimentos sociais e manter a ordem burguesa no Brasil.",
            link: "https://anovademocracia.com.br"
        },
        {
            category: "Brasil",
            title: "Ambulantes protestam contra 'Tolerância Zero' e são reprimidos no Rio",
            date: "12/07/2026",
            excerpt: "A violência de Estado continua: Polícia Militar atua com brutalidade contra trabalhadores informais que lutam pelo direito à cidade e à sobrevivência.",
            link: "https://anovademocracia.com.br"
        },
        {
            category: "Internacional",
            title: "Dívida dos EUA beira 40 trilhões de dólares",
            date: "13/07/2026",
            excerpt: "Guerra e juros altos descarregam a crise sobre os trabalhadores e aprofundam a decomposição geral do sistema imperialista, segundo análise econômica.",
            link: "https://anovademocracia.com.br"
        }
    ];

    const newsGrid = document.getElementById('andNewsGrid');
    const tabs = document.querySelectorAll('.and-tab');
    const modal = document.getElementById('andModal');
    const modalClose = document.querySelector('.and-modal-close');

    // Função para renderizar as notícias
    function renderNews(filter = 'todas') {
        newsGrid.innerHTML = '';

        const filteredData = filter === 'todas'
            ? andNewsData
            : andNewsData.filter(news => news.category === filter);

        filteredData.forEach((news, index) => {
            const card = document.createElement('div');
            card.className = 'and-news-card';
            card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;

            card.innerHTML = `
                <span class="and-news-category">${news.category}</span>
                <h3 class="and-news-title">${news.title}</h3>
                <div class="and-news-date">
                    <i class="far fa-calendar"></i> ${news.date}
                </div>
            `;

            // Evento de clique para abrir o modal
            card.addEventListener('click', () => openModal(news));
            newsGrid.appendChild(card);
        });
    }

    // Função para abrir o modal com os dados da notícia
    function openModal(news) {
        document.getElementById('modalCategory').textContent = news.category;
        document.getElementById('modalTitle').textContent = news.title;
        document.getElementById('modalDate').innerHTML = `<i class="far fa-calendar"></i> ${news.date}`;
        document.getElementById('modalExcerpt').textContent = news.excerpt;
        document.getElementById('modalLink').href = news.link;

        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Impede rolagem do fundo
    }

    // Função para fechar o modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Event Listeners para as abas
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove classe active de todas
            tabs.forEach(t => t.classList.remove('active'));
            // Adiciona na clicada
            tab.classList.add('active');
            // Renderiza com o filtro
            renderNews(tab.dataset.category);
        });
    });

    // Event Listeners do Modal
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Fechar modal com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Inicialização
    if (newsGrid) {
        renderNews('todas');
    }
    // ============================================
    // 🎯 CONSOLE MESSAGE (Easter Egg)
    // ============================================
    console.log('%c🔥 PAPEL-MOEDA 🔥', 'color: #ff003c; font-size: 24px; font-weight: bold;');
    console.log('%cEconomista Marxista | Pró-Irã', 'color: #00f0ff; font-size: 14px;');
    console.log('%c"A história de toda sociedade até aqui é a história da luta de classes" - Karl Marx', 'color: #ffd700; font-style: italic;');
    console.log('%c💡 Dica: Use ← → para controlar a velocidade do carrossel, ESPAÇO para pausar, e SCROLL para girar manualmente!', 'color: #ffffff; font-size: 12px;');

});
