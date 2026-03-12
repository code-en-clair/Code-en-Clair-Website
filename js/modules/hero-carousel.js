/**
 * Carousel du hero — section "Ce que tu pourras créer"
 * Défilement automatique toutes les 4s, navigation par points cliquables
 */

export function initHeroCarousel() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('#carouselDots .carousel-dot');
  const glow = document.getElementById('showcaseGlow');
  const counter = document.getElementById('slideCounter');
  const cpFill = document.getElementById('cpFill');

  if (!slides.length || !glow) return;

  const glowColors = [
    'rgba(139, 92, 246, 0.15)',
    'rgba(251, 191, 36, 0.1)',
    'rgba(251, 146, 60, 0.1)',
    'rgba(99, 102, 241, 0.1)',
    'rgba(236, 72, 153, 0.1)',
  ];

  let current = 0;
  let timer;

  function goToSlide(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    glow.style.background = `radial-gradient(circle, ${glowColors[current]} 0%, transparent 70%)`;
    if (counter) counter.textContent = current + 1;
    // Réinitialiser l'animation de la barre de progression
    if (cpFill) {
      cpFill.style.animation = 'none';
      void cpFill.offsetWidth; // reflow
      cpFill.style.animation = 'cpFill 4s linear infinite';
    }
    clearInterval(timer);
    timer = setInterval(nextSlide, 4000);
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  // Rendre goToSlide accessible depuis les onclick HTML
  window.goToSlide = goToSlide;

  // Init
  glow.style.background = `radial-gradient(circle, ${glowColors[0]} 0%, transparent 70%)`;
  timer = setInterval(nextSlide, 4000);
}
