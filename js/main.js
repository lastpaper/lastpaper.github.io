/* ============================================
   PAPEL-MOEDA - INTERATIVIDADE
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
                cursorFollower.style.left = e.clientX - 10 + 'px';
                cursorFollower.style.top = e.clientY - 10 + 'px';
            }, 100);
        });

        // Efeito de hover em elementos interativos
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
    // SISTEMA DE PARTÍCULAS
    // ============================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 100;

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

            // Conectar partículas próximas
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

    // Redimensionar canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    // ============================================
    // PLAYER DE MÚSICA
    // ============================================
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const bars = document.querySelectorAll('.bar');

    let isPlaying = false;

    // Play/Pause
    playBtn.addEventListener('click', togglePlay);

    function togglePlay() {
        if (isPlaying) {
            audioPlayer.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            bars.forEach(bar => bar.style.animationPlayState = 'paused');
        } else {
            audioPlayer.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            bars.forEach(bar => bar.style.animationPlayState = 'running');
        }
        isPlaying = !isPlaying;
    }

    // Atualizar barra de progresso
    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = progress + '%';
    });

    // Clique na barra de progresso
    progressBar.parentElement.addEventListener('click', (e) => {
        const width = e.target.parentElement.offsetWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    });

    // Botões anterior/próxima (simulação)
    prevBtn.addEventListener('click', () => {
        audioPlayer.currentTime = 0;
        if (!isPlaying) {
            togglePlay();
        }
    });

    nextBtn.addEventListener('click', () => {
        audioPlayer.currentTime = 0;
        if (!isPlaying) {
            togglePlay();
        }
    });

    // ============================================
    // EFEITO DE PARALLAX NAS IMAGENS
    // ============================================
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.image-card');
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        cards.forEach((card, index) => {
            const speed = (index + 1) * 10;
            const x = mouseX * speed;
            const y = mouseY * speed;

            if (!card.matches(':hover')) {
                card.style.transform += ` rotateX(${y}deg) rotateY(${-x}deg)`;
            }
        });
    });

    // ============================================
    // ANIMAÇÃO DE ENTRADA AO SCROLL
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos
    document.querySelectorAll('.info-card, .music-player, .social-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });

    // ============================================
    // EFEITO DE DIGITAÇÃO NO TÍTULO
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

    // Executar glitch a cada 5 segundos
    setInterval(glitchText, 5000);

    // ============================================
    // CONTROLE DE VELOCIDADE DAS IMAGENS
    // ============================================
    const rotatingImages = document.querySelector('.rotating-images');
    let currentSpeed = 30; // segundos para uma rotação completa

    // Pausar rotação ao passar o mouse
    rotatingImages.addEventListener('mouseenter', () => {
        rotatingImages.style.animationPlayState = 'paused';
    });

    rotatingImages.addEventListener('mouseleave', () => {
        rotatingImages.style.animationPlayState = 'running';
    });
    // ============================================
    // CONTROLE DA ROTAÇÃO ORBITAL
    // ============================================
    const rotatingImages = document.querySelector('.rotating-images');
    
    // Pausa a rotação suavemente quando o mouse está sobre a área do site
    document.querySelector('.main-container').addEventListener('mouseenter', () => {
        if(rotatingImages) rotatingImages.style.animationPlayState = 'paused';
    });

    document.querySelector('.main-container').addEventListener('mouseleave', () => {
        if(rotatingImages) rotatingImages.style.animationPlayState = 'running';
    });
    // ============================================
    // EFEITO DE SOM AO CLICAR (opcional)
    // ============================================
    document.addEventListener('click', (e) => {
        // Criar partícula no ponto do clique
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

        document.body.appendChild(particle);

        // Animar
        let opacity = 1;
        let size = 10;

        const animate = () => {
            opacity -= 0.02;
            size += 2;

            particle.style.opacity = opacity;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.transform = `translate(-${size/2}px, -${size/2}px)`;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        animate();
    }

    // ============================================
    // CONSOLE MESSAGE
    // ============================================
    console.log('%c🔥 PAPEL-MOEDA 🔥', 'color: #ff003c; font-size: 24px; font-weight: bold;');
    console.log('%cEconomista Marxista | Pró-Irã', 'color: #00f0ff; font-size: 14px;');
    console.log('%c"A história de toda sociedade até aqui é a história da luta de classes"', 'color: #ffd700; font-style: italic;');

});
