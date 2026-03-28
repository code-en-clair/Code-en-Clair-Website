/**
 * Main entry point pour tous les modules JavaScript
 * Initialise tous les modules au chargement du document
 */

import { initHeader } from './modules/header.js';
import { initTyped } from './modules/typed.js';
import { initHorizontalScroll } from './modules/horizontal-scroll.js';
import { initWaves } from './modules/waves.js';
import { initScrollReveal } from './modules/scroll-reveal.js';
import { initTheme } from './modules/theme.js';
import { initHeroCarousel } from './modules/hero-carousel.js';
import { initRoadmapHover } from './modules/roadmap-hover.js';

// Initialiser au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    console.log("🎯 Initializing Code en Clair...");

    initTheme();
    initHeader();
    initHeroCarousel();
    initTyped();
    initHorizontalScroll();
    initWaves();
    initScrollReveal();
    initRoadmapHover();

    console.log("✅ All modules initialized");
});
