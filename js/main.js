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
                cursorFollower.style.left = (e.clientX - 10) + 'px';
                cursorFollower.style.top = (e.clientY - 10) + 'px';
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
    const numberOfParticles = 80; // Reduzido levemente para melhor performance em mobile

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
            audioPlayer.play().catch(error => {
                console.log("Interação do usuário necessária para reproduzir áudio.");
            });
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            bars.forEach(bar => bar.style.animationPlayState = 'running');
        }
        isPlaying = !isPlaying;
    }

    // Atualizar barra de progresso
    audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = progress + '%';
        }
    });

    // Clique na barra de progresso
    progressBar.parentElement.addEventListener('click', (e) => {
        const width = e.target.parentElement.offsetWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        if (duration) {
            audioPlayer.currentTime = (clickX / width) * duration;
        }
    });

    // Botões anterior/próxima (reiniciam a faixa, já que é loop de uma só)
    prevBtn.addEventListener('click', () => {
        audioPlayer.currentTime = 0;
        if (!isPlaying) togglePlay();
    });

    nextBtn.addEventListener('click', () => {
        audioPlayer.currentTime = 0;
        if (!isPlaying) togglePlay();
    });

    // ============================================
    // CONTROLE DE VELOCIDADE DAS IMAGENS
    // ============================================
    const rotatingImages = document.querySelector('.rotating-images');

    // Pausar rotação ao passar o mouse
    rotatingImages.addEventListener('mouseenter', () => {
        rotatingImages.style.animationPlayState = 'paused';
    });

    rotatingImages.addEventListener('mouseleave', () => {
        rotatingImages.style.animationPlayState = 'running';
    });

    // ============================================
    // EFEITO DE DIGITAÇÃO/GLITCH NO TÍTULO
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

    // Executar glitch a cada 6 segundos
    setInterval(glitchText, 6000);

    // ============================================
    // EFEITO DE PARTÍCULA AO CLICAR
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
    // CONSOLE MESSAGE (Easter Egg)
    // ============================================
    console.log('%c🔥 PAPEL-MOEDA 🔥', 'color: #ff003c; font-size: 24px; font-weight: bold;');
    console.log('%cEconomista Marxista | Pró-Irã', 'color: #00f0ff; font-size: 14px;');
    console.log('%c"A história de toda sociedade até aqui é a história da luta de classes" - Karl Marx', 'color: #ffd700; font-style: italic;');

});
