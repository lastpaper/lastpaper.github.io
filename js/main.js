/* ============================================
   SISTEMA DE PARTÍCULAS INTERATIVAS
   ============================================ */
const canvas = document.getElementById('galaxy-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 150;
let mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Verificar se a partícula está dentro dos limites da tela
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Verificar colisão com o mouse
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 3;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 3;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 3;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 3;
            }
        }

        // Mover partícula
        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

function init() {
    particlesArray = [];
    let colors = ['#ff006e', '#8338ec', '#3a86ff', '#ffbe0b', '#fb5607'];

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        let color = colors[Math.floor(Math.random() * colors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                         + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

            if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                opacityValue = 1 - (distance / 10000);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.2})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

init();
animate();

window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

/* ============================================
   PLAYER DE MÚSICA
   ============================================ */
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
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
        audioPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        bars.forEach(bar => bar.style.animationPlayState = 'running');
    }
    isPlaying = !isPlaying;
}

audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = progress + '%';
});

progressBar.parentElement.addEventListener('click', (e) => {
    const width = e.target.parentElement.offsetWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
});

/* ============================================
   EFEITO DE PARALLAX NO TÍTULO
   ============================================ */
document.addEventListener('mousemove', (e) => {
    const title = document.querySelector('.main-title');
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;

    title.style.transform = `translateX(${x}px) translateY(${y}px)`;
});

/* ============================================
   ANIMAÇÃO DE ENTRADA AO SCROLL
   ============================================ */
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

document.querySelectorAll('.description-section, .social-section, .music-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease-out';
    observer.observe(el);
});

/* ============================================
   EFEITO DE CLIQUE NAS PARTÍCULAS
   ============================================ */
document.addEventListener('click', (e) => {
    createClickEffect(e.clientX, e.clientY);
});

function createClickEffect(x, y) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.boxShadow = '0 0 20px currentColor';

        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 8;
        const velocity = 5;
        let opacity = 1;
        let size = 8;

        const animate = () => {
            opacity -= 0.02;
            size += 1;

            particle.style.opacity = opacity;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = (x + Math.cos(angle) * velocity * (1 - opacity) * 50) + 'px';
            particle.style.top = (y + Math.sin(angle) * velocity * (1 - opacity) * 50) + 'px';

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        animate();
    }
}

/* ============================================
   CONSOLE MESSAGE
   ============================================ */
console.log('%c PAPER - UNIVERSO DIGITAL 🌌', 'color: #ff006e; font-size: 24px; font-weight: bold;');
console.log('%cBem-vindo ao cosmos digital', 'color: #8338ec; font-size: 14px;');
