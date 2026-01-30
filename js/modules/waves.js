/**
 * Module d'animation des vagues
 * Gère l'animation canvas des lignes ondulantes
 */

const mouse = {
    x: -9999,
    y: -9999,
    radius: 520 
};

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY + window.scrollY; // IMPORTANT pour le scroll
});

window.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
});

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 2731;


class WaveLine {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.points = [];
        this.numPoints = 150;
        this.amplitude = Math.random() * 150 + 100;
        this.frequency = Math.random() * 0.008 + 0.002;
        this.speed = 0.15;
        this.offset = Math.random() * Math.PI * 2;
        this.yBase = Math.random() * canvasHeight;
        this.opacity = Math.random() * 0.15 + 0.08; 
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.lineWidth = Math.random() * 2 + 0.5;
        
        // Type de ligne: horizontal ou vertical
        this.isHorizontal = Math.random() > 0.3;
        
        // Position de base pour lignes verticales
        this.xBase = Math.random() * canvasWidth;
        
        this.initPoints();
    }
    
    initPoints() {
        this.points = [];
        for (let i = 0; i < this.numPoints; i++) {
            this.points.push({ x: 0, y: 0 });
        }
    }
    
    update(time) {
        for (let i = 0; i < this.numPoints; i++) {
            const t = i / this.numPoints;

            const wave1 = Math.sin(t * Math.PI * 4 + time * this.speed + this.offset) * this.amplitude * 0.5;
            const wave2 = Math.cos(t * Math.PI * 6 - time * this.speed * 0.7) * this.amplitude * 0.3;
            const wave3 = Math.sin(t * Math.PI * 2 + time * this.speed * 1.2) * this.amplitude * 0.2;

            let px, py;
            if (this.isHorizontal) {
            px = t * this.canvasWidth;
            py = this.yBase + wave1 + wave2 + wave3;
            } else {
            px = this.xBase + wave1 + wave2 + wave3;
            py = t * this.canvasHeight;
            }

            /* ===== Interaction curseur ===== */

            const dx = px - mouse.x;
            const dy = py - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);


            if (dist > 0 && dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const strength = force * 35;

            px += (dx / dist) * strength;
            py += (dy / dist) * strength;
            }

            this.points[i].x = px;
            this.points[i].y = py;
            }
        }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        // Utilisation de courbes de Bézier pour un rendu fluide
        for (let i = 1; i < this.points.length - 2; i++) {
            const xc = (this.points[i].x + this.points[i + 1].x) / 2;
            const yc = (this.points[i].y + this.points[i + 1].y) / 2;
            ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
        }
        
        // Derniers points
        ctx.quadraticCurveTo(
            this.points[this.numPoints - 2].x,
            this.points[this.numPoints - 2].y,
            this.points[this.numPoints - 1].x,
            this.points[this.numPoints - 1].y
        );
        
        // Couleur violette pour correspondre au thème
        ctx.strokeStyle = `rgba(70, 10, 174, ${this.opacity})`;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    }
    
    resize(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.yBase = Math.random() * canvasHeight;
        this.xBase = Math.random() * canvasWidth;
        this.initPoints();
    }
}

export function initWaves() {
    const canvas = document.getElementById('wavesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const pageHeight = document.documentElement.scrollHeight;

    canvas.width = Math.min(window.innerWidth, MAX_WIDTH);
    canvas.height = Math.min(pageHeight, MAX_HEIGHT);


    // Création de nombreuses lignes
    const lines = [];
    const numLines = 30;
    
    for (let i = 0; i < numLines; i++) {
        lines.push(new WaveLine(canvas.width, canvas.height));
    }

    let time = 0;
    
    function animate() {
        // Fond transparent
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        time += 0.02;
        
        // Mise à jour et dessin de toutes les lignes
        lines.forEach(line => {
            line.update(time);
            line.draw(ctx);
        });
        
        requestAnimationFrame(animate);
    }

    animate();

    // Gestion du redimensionnement
    window.addEventListener('resize', () => {
        canvas.width = Math.min(window.innerWidth, MAX_WIDTH);
        canvas.height = Math.min(document.documentElement.scrollHeight, MAX_HEIGHT);

        // Réinitialisation des lignes avec les nouvelles dimensions
        lines.forEach(line => {
            line.resize(canvas.width, canvas.height);
        });
    });
}