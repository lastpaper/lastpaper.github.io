// ============================================
// PARTÍCULAS - ESTRELAS + METEOROS
// ============================================
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars = [];
    let meteors = [];
    const STAR_COUNT = 180;
    const METEOR_COUNT = 3; // máximos simultâneos

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    // --- Estrelas ---
    class Star {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.baseAlpha = Math.random() * 0.6 + 0.3;
            this.phase = Math.random() * Math.PI * 2;
            this.color = ['#ffffff', '#ffd700', '#00f0ff', '#ff6b6b'][Math.floor(Math.random() * 4)];
        }
        update(time) {
            this.x += this.speedX;
            this.y += this.speedY;
            // Borda com wrap-around
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
            // Cintilação
            this.currentAlpha = this.baseAlpha * (0.7 + 0.3 * Math.sin(time * 0.002 + this.phase));
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.currentAlpha;
            ctx.fill();
            // Brilho extra para estrelas maiores
            if (this.size > 1.8) {
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 12;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            ctx.globalAlpha = 1;
        }
    }

    // --- Meteoros (estrelas cadentes) ---
    class Meteor {
        constructor() {
            this.reset(true);
        }
        reset(initial = false) {
            this.active = true;
            this.x = Math.random() * width;
            this.y = Math.random() * height * 0.4; // começa na parte superior
            this.length = Math.random() * 80 + 40;
            this.speed = Math.random() * 4 + 3;
            this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.8; // ~45°
            this.opacity = 1;
            this.life = 1;
            this.decay = 0.005 + Math.random() * 0.01;
            // Cor do meteoro (branco/azulado)
            this.color = `rgba(255, 255, 255, 1)`;
        }
        update() {
            if (!this.active) return;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.life -= this.decay;
            this.opacity = this.life;
            if (this.life <= 0 || this.x > width + 100 || this.y > height + 100) {
                this.active = false;
            }
        }
        draw() {
            if (!this.active || this.opacity <= 0) return;
            const tailX = this.x - Math.cos(this.angle) * this.length;
            const tailY = this.y - Math.sin(this.angle) * this.length;
            const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            grad.addColorStop(0.3, `rgba(200, 230, 255, ${this.opacity * 0.6})`);
            grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(tailX, tailY);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2 * this.opacity;
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 20;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Ponto brilhante na cabeça
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2.5 * this.opacity, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 25;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // Inicializar estrelas
    function initStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push(new Star());
        }
    }
    initStars();

    // Gerenciar meteoros
    let meteorTimer = 0;
    function updateMeteors() {
        // Adicionar novos meteoros aleatoriamente
        meteorTimer++;
        if (meteorTimer > 120 && meteors.length < METEOR_COUNT) { // a cada ~2 segundos
            if (Math.random() < 0.3) {
                meteors.push(new Meteor());
            }
            meteorTimer = 0;
        }
        // Atualizar e limpar inativos
        meteors = meteors.filter(m => {
            m.update();
            return m.active;
        });
    }

    // Animação principal
    let time = 0;
    function animate() {
        time++;
        ctx.clearRect(0, 0, width, height);

        // Desenhar estrelas
        stars.forEach(star => {
            star.update(time);
            star.draw();
        });

        // Desenhar conexões (linhas entre estrelas próximas)
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    const alpha = 0.12 * (1 - dist / 130);
                    ctx.beginPath();
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Meteoros
        updateMeteors();
        meteors.forEach(m => m.draw());

        requestAnimationFrame(animate);
    }
    animate();

    // Reajustar ao redimensionar
    window.addEventListener('resize', () => {
        resize();
        // Reposicionar estrelas proporcionalmente? (opcional)
        // Vamos apenas recriar para evitar distorção
        initStars();
    });
}
