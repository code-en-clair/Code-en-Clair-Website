/**
 * Module d'animation des vagues
 * Gère l'animation canvas des lignes ondulantes
 */

class WaveLine {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.points = [];
        this.numPoints = 150;
        this.amplitude = Math.random() * 150 + 100;
        this.frequency = Math.random() * 0.008 + 0.002;
        this.speed = Math.random() * 0.1 + 0.3;
        this.offset = Math.random() * Math.PI * 2;
        this.yBase = Math.random() * canvasHeight;
        this.opacity = Math.random() * 0.15 + 0.08; 
        this.direction = Math.random() > 0.5 ? 1 : -1;
        
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
            
            if (this.isHorizontal) {
                // Lignes horizontales ondulantes
                const x = t * this.canvasWidth;
                const wave1 = Math.sin(t * Math.PI * 4 + time * this.speed + this.offset) * this.amplitude * 0.5;
                const wave2 = Math.cos(t * Math.PI * 6 - time * this.speed * 0.7) * this.amplitude * 0.3;
                const wave3 = Math.sin(t * Math.PI * 2 + time * this.speed * 1.2) * this.amplitude * 0.2;
                const y = this.yBase + wave1 + wave2 + wave3;
                
                this.points[i].x = x;
                this.points[i].y = y;
            } else {
                // Lignes verticales ondulantes
                const y = t * this.canvasHeight;
                const wave1 = Math.sin(t * Math.PI * 4 + time * this.speed + this.offset) * this.amplitude * 0.5;
                const wave2 = Math.cos(t * Math.PI * 6 - time * this.speed * 0.7) * this.amplitude * 0.3;
                const wave3 = Math.sin(t * Math.PI * 2 + time * this.speed * 1.2) * this.amplitude * 0.2;
                const x = this.xBase + wave1 + wave2 + wave3;
                
                this.points[i].x = x;
                this.points[i].y = y;
            }
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
        ctx.strokeStyle = `rgba(124, 58, 237, ${this.opacity})`;
        ctx.lineWidth = 1.5;
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
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Création de nombreuses lignes
    const lines = [];
    const numLines = 25; // Réduit à 25 pour de meilleures performances
    
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
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Réinitialisation des lignes avec les nouvelles dimensions
        lines.forEach(line => {
            line.resize(canvas.width, canvas.height);
        });
    });
}