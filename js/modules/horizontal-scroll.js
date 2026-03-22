/**
 * Pinned Horizontal Scroll — V2 Editorial
 * Desktop : 3 canvases défilent horizontalement via scroll vertical
 * Mobile (≤ 768px) : stack vertical, CSS gère tout
 */

import { checkScrambleTriggers, checkHighlightTriggers, scrambleFlat } from './text-scramble.js';

const MOBILE_BREAKPOINT = 768;

/**
 * Pour chaque .code-snippet :
 * — wrappe le contenu code (hors header) dans un .code-snippet__body
 * — stocke l'innerHTML original sur l'élément
 * — affiche immédiatement du texte encrypté (même longueur, même espaces)
 * — tague le body pour le décodage au scroll
 */
function scrambleTextNodesInPlace(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(n => {
        n._originalText = n.textContent;
        n.textContent = scrambleFlat(n.textContent);
    });
}

function setupCodeSnippetScramble(strip) {
    strip.querySelectorAll('.code-snippet').forEach(snippet => {
        const header = snippet.querySelector('.code-snippet__header');

        // Wrapper pour le corps du code
        const body = document.createElement('div');
        body.className = 'code-snippet__body';

        // Déplacer tous les nœuds non-header dans le wrapper
        Array.from(snippet.childNodes).forEach(node => {
            if (node !== header) body.appendChild(node);
        });
        snippet.appendChild(body);

        // Stocker l'HTML original AVANT encryption (préserve la coloration)
        body._scrambleOriginalHtml = body.innerHTML;

        // Encrypter les nœuds texte en place (préserve la structure des spans et les couleurs)
        scrambleTextNodesInPlace(body);

        // Tagger pour le décodage au scroll
        body.dataset.scramble         = '';
        body.dataset.scrambleDuration = '1.2';
    });
}

function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
}

function computeTranslateX(track, strip) {
    const rect = track.getBoundingClientRect();
    const trackHeight = track.offsetHeight - window.innerHeight;
    const initialOffset = window.innerWidth * 0.4;
    const finalOffset = window.innerWidth * 0.2;
    const maxScroll = strip.scrollWidth - window.innerWidth + initialOffset + finalOffset;
    const adjustedTop = -rect.top + window.innerHeight / 2;
    const progress = Math.min(Math.max(adjustedTop / trackHeight, 0), 1);
    return -progress * maxScroll + initialOffset;
}

function initDesktop(track, strip) {
    let ticking = false;
    setupCodeSnippetScramble(strip);
    const scrambleEls   = strip.querySelectorAll("[data-scramble]");
    const highlightEls  = strip.querySelectorAll("[data-highlight]");
    const pinnedSection = track.querySelector('.pinned-section');

    function onScroll() {
        strip.style.transform = `translateX(${computeTranslateX(track, strip)}px)`;

        const rect = track.getBoundingClientRect();

        // Dès que le bas du track remonte au-dessus du bas du viewport, la .pinned-section
        // se décolle (position sticky libérée) et reste visible dans la zone de sortie (100vh).
        // On la masque immédiatement pour éviter tout débordement visuel sur la section suivante.
        if (pinnedSection) {
            pinnedSection.style.visibility = rect.bottom <= window.innerHeight ? 'hidden' : '';
        }

        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
            if (scrambleEls.length)  checkScrambleTriggers(scrambleEls, 1.0);
            if (highlightEls.length) checkHighlightTriggers(highlightEls, 1.0);
        }
    }

    function scrollHandler() {
        if (!ticking) {
            requestAnimationFrame(() => { onScroll(); ticking = false; });
            ticking = true;
        }
    }

    window.addEventListener("scroll", scrollHandler);
    window.addEventListener("resize", onScroll);
    onScroll(); // positionne le strip sans vérifier le scramble (track hors viewport au chargement)
}

function initMobileStack(strip) {
    // CSS gère tout : flex-direction column, transform: none
    // On s'assure juste que le strip n'a pas de transform résiduel
    strip.style.transform = "";
}

function scrollToCanvas(canvas, track, strip) {
    const initialOffset = window.innerWidth * 0.4;
    const finalOffset = window.innerWidth * 0.2;
    const maxScroll = strip.scrollWidth - window.innerWidth + initialOffset + finalOffset;
    const trackHeight = track.offsetHeight - window.innerHeight;

    const progress = Math.min(Math.max((canvas.offsetLeft + initialOffset) / maxScroll, 0), 1);
    const scrollY = track.offsetTop - window.innerHeight / 2 + progress * trackHeight;

    window.scrollTo({ top: scrollY, behavior: "smooth" });
}

function setupCanvasLinks(track, strip) {
    document.querySelectorAll("[data-canvas-target]").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            if (isMobile()) return;
            const canvas = document.getElementById(link.dataset.canvasTarget);
            if (canvas) scrollToCanvas(canvas, track, strip);
        });
    });
}

export function initHorizontalScroll() {
    const track = document.getElementById("track");
    const strip = document.getElementById("strip");

    if (!track || !strip) {
        console.warn("Horizontal scroll: elements non trouves");
        return;
    }

    let currentMode = null;
    let resizeTimer;

    function setMode() {
        const newMode = isMobile() ? "mobile" : "desktop";
        if (newMode === currentMode) return;
        if (newMode === "desktop") initDesktop(track, strip);
        else initMobileStack(strip);
        currentMode = newMode;
    }

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setMode, 150);
    });

    setMode();
    setupCanvasLinks(track, strip);
}
