const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Ajustar tamaño del canvas al tamaño de la ventana
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FFFFFF'];

class Rocket {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.centerX = Math.random() * canvas.width; // Ubicación aleatoria
        this.centerY = Math.random() * canvas.height; // Ubicación aleatoria
        this.angle = Math.atan2(this.centerY - this.y, this.centerX - this.x);  // Ángulo hacia un punto aleatorio
        this.speed = 5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.exploded = false;
        this.particles = [];
        this.explosionType = Math.floor(Math.random() * 4); // Tipo de explosión aleatorio
    }

    update() {
        if (!this.exploded) {
            // Movimiento hacia el punto aleatorio
            this.x += this.speed * Math.cos(this.angle);
            this.y += this.speed * Math.sin(this.angle);

            // Cuando el cohete esté cerca de la ubicación de explosión, explota
            if (Math.abs(this.x - this.centerX) < 5 && Math.abs(this.y - this.centerY) < 5) {
                this.explode();
            }
        } else {
            this.particles.forEach(particle => particle.update());
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            this.particles.forEach(particle => particle.draw());
        }
    }

    explode() {
        this.exploded = true;
        const particleCount = 40;
        const angleStep = (Math.PI * 2) / particleCount;

        for (let i = 0; i < particleCount; i++) {
            const angle = i * angleStep;
            const speed = Math.random() * 3 + 2;  // Velocidad de la partícula
            const speedX = Math.cos(angle) * speed;
            const speedY = Math.sin(angle) * speed;

            switch (this.explosionType) {
                case 0: // Tipo de explosión Rayos
                    this.particles.push(new LightningParticle(this.x, this.y, this.color, speedX, speedY));
                    break;
                case 1: // Tipo de explosión Estrella
                    this.particles.push(new StarParticle(this.x, this.y, this.color, speedX, speedY));
                    break;
                case 2: // Tipo de explosión Circular
                    this.particles.push(new CircularParticle(this.x, this.y, this.color, speedX, speedY));
                    break;
                case 3: // Tipo de explosión Chispas
                    this.particles.push(new SparkParticle(this.x, this.y, this.color, speedX, speedY));
                    break;
            }
        }
        
        this.makeMultipleFireworks(); // Nuevamente creamos más fuegos artificiales en varias ubicaciones
    }

    makeMultipleFireworks() {
        for (let i = 0; i < 5; i++) { // Generar múltiples explosiones en diferentes ubicaciones
            let fireX = Math.random() * canvas.width;
            let fireY = Math.random() * canvas.height;
            let fire = {
                numberNow: 0,
                numberMax: 40,  // Ajusta el número máximo de partículas
            };

            let color = this.randomColor();
            let velocity = Math.random() * 2 + 6;
            let max = fire.numberNow + fire.numberMax;

            for (let i = fire.numberNow; i < max; i++) {
                let rad = (i * Math.PI * 2) / max;
                let size = Math.random();
                
                let vx = Math.cos(rad) * velocity * (Math.random() * 0.5 + 0.5);
                let vy = Math.sin(rad) * velocity * (Math.random() * 0.5 + 0.5);
                
                let life = Math.round((Math.random() * 50) / 2) * 2;  // Tamaño de vida
                this.particles.push(new CircularParticle(fireX, fireY, color, vx, vy));
            }
        }
    }

    randomColor() {
        const colors = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FFFFFF'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Partículas tipo rayo
class LightningParticle {
    constructor(x, y, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.length = Math.random() * 30 + 10;
        this.alpha = 1;
        this.color = color;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.length *= 0.98;
        this.alpha -= 0.02;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.speedX * this.length, this.y + this.speedY * this.length);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
}

// Partículas tipo estrella
class StarParticle {
    constructor(x, y, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.alpha = 1;
        this.color = color;
        this.radius = 2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.01;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

// Partículas tipo círculo
class CircularParticle {
    constructor(x, y, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.alpha = 1;
        this.color = color;
        this.radius = Math.random() * 3 + 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.02;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

// Partículas tipo chispa
class SparkParticle {
    constructor(x, y, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.alpha = 1;
        this.color = color;
        this.radius = Math.random() * 1 + 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.05;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

let rockets = [];

function shootRockets() {
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = canvas.height; // Puedes ajustarlo para cambiar la altura de inicio
        rockets.push(new Rocket(x, y));
    }
}

function drawText() {
    const text = '¡Feliz Año Nuevo 2025!';
    const fontSize = 80;
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

setInterval(shootRockets, 1000); // Lanza 5 cohetes cada segundo

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Actualizar y dibujar los fuegos artificiales
    rockets = rockets.filter(rocket => rocket.exploded ? rocket.particles.some(p => p.alpha > 0) : true);
    rockets.forEach(rocket => {
        rocket.update();
        rocket.draw();
    });

    // Dibujar texto
    drawText();

    requestAnimationFrame(animate);
}

animate();
