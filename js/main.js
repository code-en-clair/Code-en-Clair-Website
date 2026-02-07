/**
 * Main entry point pour tous les modules JavaScript
 * Initialise tous les modules au chargement du document
 */

import { initHeader } from './modules/header.js';
import { initHorizontalScroll } from './modules/horizontal-scroll.js';
import { initTerminal } from './modules/terminal.js';
import { initWaves } from './modules/waves.js';
import { initScrollReveal } from './modules/scroll-reveal.js';
import { initTheme } from './modules/theme.js';

// Initialiser au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    console.log("🎯 Initializing Code en Clair...");

    initTheme();
    initHeader();
    initHorizontalScroll();
    initTerminal();
    initWaves();
    initScrollReveal();

    console.log("✅ All modules initialized");
});
