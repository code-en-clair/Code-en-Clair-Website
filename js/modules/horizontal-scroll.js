/**
 * horizontal-scroll-bs.js — Brutalist Stack · Code en Clair
 *
 * Scroll vertical → translation horizontale du strip #bs-strip.
 * Tous les IDs/classes sont préfixés "bs-" pour ne pas interférer
 * avec le reste de la page.
 */
import { scrambleText, scrambleFlat } from './text-scramble.js';

export function initHorizontalScroll() {
  const track       = document.getElementById('bs-track');
  const strip       = document.getElementById('bs-strip');
  const progressBar = document.getElementById('bs-progressBar');
  const fCurrent    = document.getElementById('bsFCurrent');
  const fTotal      = document.getElementById('bsFTotal');
  const navFill     = document.getElementById('bsNavFill');
  const navLang     = document.getElementById('bsNavLang');
  const navPct      = document.getElementById('bsNavPct');
  const navBottom   = document.querySelector('.bs-nav-bottom');
  const scrollHint  = document.getElementById('bsScrollHint');
  const fCounter    = document.querySelector('.bs-f-counter');

  if (!track || !strip) {
    console.warn('[horizontal-scroll-bs] #bs-track ou #bs-strip introuvable.');
    return;
  }

  const canvases = Array.from(document.querySelectorAll('.bs-canvas'));
  const N        = canvases.length;
  const langs    = canvases.map(c => c.dataset.lang   || '');
  const accents  = canvases.map(c => c.dataset.accent || '#fff');

  if (fTotal) fTotal.textContent = String(N).padStart(2, '0');

  /* ── WIPE REVEAL : initialise les titres cachés + couleur accent ── */
  canvases.forEach(canvas => {
    canvas.style.setProperty('--bs-wipe-color', canvas.dataset.accent || '#f0ede8');
    const title = canvas.querySelector('.bs-lang-title');
    if (title) title.classList.add('bs-wipe-pending');
  });
  const canvasWipeTriggered = new Array(N).fill(false);

  /* ── SCRAMBLE : pré-encode les éléments de chaque canvas ── */
  // Construit un tableau par canvas : [{ el, delay, duration }, ...]
  const canvasScrambleEls = canvases.map(canvas => {
    const items = [];

    // Stats : flat scramble, délais décalés par position dans le canvas
    canvas.querySelectorAll('.bs-sr-stat-val').forEach((el, i) => {
      el._scrambleFlatText = el.textContent.trim();
      el.textContent = scrambleFlat(el._scrambleFlatText);
      el.dataset.scrambleDuration = '1.4';
      items.push({ el, delay: i * 160 });
    });

    // Code block : structure-preserving (préserve les <span> colorés)
    const block = canvas.querySelector('.bs-code-block');
    if (block) {
      const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null);
      let node;
      while ((node = walker.nextNode())) {
        if (!node.textContent.trim()) continue;
        node._originalText = node.textContent;
        node.textContent = scrambleFlat(node.textContent);
      }
      block.dataset.scrambleDuration = '1.8';
      items.push({ el: block, delay: 0 });
    }

    return items;
  });

  const canvasTriggered    = new Array(N).fill(false);
  const canvasAnimTriggered = new Array(N).fill(false);

  let ticking = false;

  function isTrackInView() {
    const rect = track.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  const HEADER_H = 53;

  function getProgress() {
    const rect   = track.getBoundingClientRect();
    const trackH = track.offsetHeight - window.innerHeight + HEADER_H;
    return Math.min(Math.max((HEADER_H - rect.top) / trackH, 0), 1);
  }

  function update() {
    const inView = isTrackInView();

    /* Affiche/masque les UI fixes seulement quand le track est visible */
    if (navBottom) navBottom.classList.toggle('visible', inView);
    if (fCounter)  fCounter.style.opacity  = inView ? '1' : '0';
    if (progressBar) progressBar.style.opacity = inView ? '1' : '0';

    if (!inView) return;

    const p = getProgress();

    /* Translation du strip */
    const totalW = strip.scrollWidth - window.innerWidth;
    strip.style.transform = `translateX(${-p * totalW}px)`;

    /* Barre de progression */
    if (progressBar) progressBar.style.width = (p * 100) + '%';

    /* Index actif */
    const idx    = Math.min(Math.floor(p * N + 0.15), N - 1);
    const accent = accents[idx];

    /* Compteur */
    if (fCurrent) { fCurrent.textContent = String(idx + 1).padStart(2, '0'); fCurrent.style.color = accent; }
    if (progressBar) progressBar.style.background = accent;

    /* Nav bas */
    if (navFill) { navFill.style.width = (p * 100) + '%'; navFill.style.background = accent; }
    if (navLang) navLang.textContent = langs[idx];
    if (navPct)  navPct.textContent  = Math.round(p * 100) + '%';

    /* Dots de chaque canvas synchronisés */
    canvases.forEach(canvas => {
      canvas.querySelectorAll('.bs-sdot').forEach((dot, i) => {
        dot.classList.toggle('active', i === idx);
        dot.style.background = i === idx ? accent : '';
      });
    });

    /* Scroll hint : visible seulement en tout début de section */
    if (scrollHint) {
      const atStart = p < 0.04;
      scrollHint.classList.toggle('visible', atStart);
    }

    canvases.forEach((canvas, k) => {
      /* Wipe reveal : déclenche quand le titre entre dans le viewport */
      if (!canvasWipeTriggered[k]) {
        const title = canvas.querySelector('.bs-lang-title');
        if (title) {
          const r = title.getBoundingClientRect();
          if (r.left < window.innerWidth && r.right > 0) {
            canvasWipeTriggered[k] = true;
            title.classList.remove('bs-wipe-pending');
            title.classList.add('bs-wipe-reveal');
          }
        }
      }

      /* Reveal editorial blocks + info cards : déclenche quand col-left entre dans le viewport */
      if (!canvasAnimTriggered[k]) {
        const colLeft = canvas.querySelector('.bs-col-left');
        if (colLeft) {
          const r = colLeft.getBoundingClientRect();
          if (r.left < window.innerWidth * 0.75 && r.right > 0) {
            canvasAnimTriggered[k] = true;

            canvas.querySelectorAll('.bs-editorial-block').forEach((el, i) => {
              el.style.transitionDelay = `${0.05 + i * 0.1}s`;
              el.classList.add('is-revealed');
            });

            canvas.querySelectorAll('.bs-info-card').forEach((card, i) => {
              card.style.transitionDelay = `${0.35 + i * 0.08}s`;
              card.classList.add('is-revealed');
            });

            canvas.querySelectorAll('.bs-topic').forEach((topic, i) => {
              topic.style.transitionDelay = `${0.1 + i * 0.06}s`;
              topic.classList.add('is-revealed');
            });
          }
        }
      }

      /* Scramble : déclenche quand la sidebar entre dans le viewport */
      if (!canvasTriggered[k]) {
        const sidebar = canvas.querySelector('.bs-sidebar-right');
        if (sidebar) {
          const r = sidebar.getBoundingClientRect();
          if (r.left < window.innerWidth && r.right > 0) {
            canvasTriggered[k] = true;
            canvasScrambleEls[k].forEach(({ el, delay }) => {
              if (el._scrambled || el._scrambling) return;
              if (delay > 0) setTimeout(() => scrambleText(el), delay);
              else scrambleText(el);
            });
          }
        }
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { update(); ticking = false; });
      ticking = true;
    }
  });

  window.addEventListener('resize', update);
  update();

}