/**
 * Module d'animation des vagues
 * Gère l'animation canvas des lignes ondulantes
 * (Version sans interaction souris)
 */

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 2731;

const IS_MOBILE = window.innerWidth <= 768;

class WaveLine {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.points = [];
        this.numPoints = 150;
        this.amplitude = IS_MOBILE
            ? Math.random() * 60 + 40
            : Math.random() * 150 + 100;
        this.frequency = Math.random() * 0.008 + 0.002;
        this.speed = 0.15;
        this.offset = Math.random() * Math.PI * 2;
        // Positions en ratio (0-1) pour eviter le re-random au resize
        this.yRatio = Math.random();
        this.xRatio = Math.random();
        this.yBase = this.yRatio * canvasHeight;
        this.opacity = IS_MOBILE
            ? Math.random() * 0.25 + 0.15
            : Math.random() * 0.35 + 0.15;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.lineWidth = IS_MOBILE
            ? Math.random() * 1 + 0.3
            : Math.random() * 2 + 0.5;

        // Type de ligne: horizontal ou vertical
        this.isHorizontal = Math.random() > 0.3;

        // Position de base pour lignes verticales
        this.xBase = this.xRatio * canvasWidth;

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
            
            // Calcul de la position de base avec les ondes
            if (this.isHorizontal) {
                px = t * this.canvasWidth;
                py = this.yBase + wave1 + wave2 + wave3;
            } else {
                px = this.xBase + wave1 + wave2 + wave3;
                py = t * this.canvasHeight;
            }

            // Assignation directe sans calcul de force souris
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

        // Couleur adaptée au thème
        const isDarkTheme = !document.documentElement.hasAttribute('data-theme') ||
                           document.documentElement.getAttribute('data-theme') === 'dark';
        const color = isDarkTheme
            ? `rgba(70, 10, 174, ${this.opacity})`  // Violet pour mode sombre
            : `rgba(255, 200, 140, ${this.opacity})`; // Violet plus clair pour mode clair

        ctx.strokeStyle = color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    }
    
    resize(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        // Garder les memes ratios pour eviter un "saut" visuel
        this.yBase = this.yRatio * canvasHeight;
        this.xBase = this.xRatio * canvasWidth;
    }
}

export function initWaves() {
    const canvas = document.getElementById('wavesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const pageHeight = document.documentElement.scrollHeight;

    canvas.width = Math.min(window.innerWidth, MAX_WIDTH);
    canvas.height = Math.min(pageHeight, MAX_HEIGHT);

    // Moins de lignes sur mobile pour la performance et la lisibilite
    const lines = [];
    const numLines = IS_MOBILE ? 12 : 30;
    
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

    // Gestion du redimensionnement (debounce 200ms)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            canvas.width = Math.min(window.innerWidth, MAX_WIDTH);
            canvas.height = Math.min(document.documentElement.scrollHeight, MAX_HEIGHT);

            lines.forEach(line => {
                line.resize(canvas.width, canvas.height);
            });
        }, 200);
    });
}