/**
 * Pinned Horizontal Scroll — V2 Editorial
 * Desktop : 3 canvases défilent horizontalement via scroll vertical
 * Mobile (≤ 768px) : stack vertical, CSS gère tout
 */

const MOBILE_BREAKPOINT = 768;

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

    function onScroll() {
        strip.style.transform = `translateX(${computeTranslateX(track, strip)}px)`;
    }

    function scrollHandler() {
        if (!ticking) {
            requestAnimationFrame(() => { onScroll(); ticking = false; });
            ticking = true;
        }
    }

    window.addEventListener("scroll", scrollHandler);
    window.addEventListener("resize", onScroll);
    onScroll();
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
