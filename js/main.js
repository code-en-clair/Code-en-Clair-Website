/**
 * Main entry point pour tous les modules JavaScript
 * Initialise tous les modules au chargement du document
 */

import { initHeader } from './modules/header.js';
import { initTerminal } from './modules/terminal.js';

// Initialiser au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    console.log("🎯 Initializing Code en Clair...");
    
    initHeader();
    initTerminal();
    
    console.log("✅ All modules initialized");
});
