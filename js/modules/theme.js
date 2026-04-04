/**
 * Gestion du thème clair/sombre
 * Synchronise tous les boutons de switch thème et sauvegarde la préférence
 */

export function initTheme() {
    const themeToggles = document.querySelectorAll('.theme-switch__input');
    const htmlElement = document.documentElement;

    // Récupérer le thème sauvegardé ou utiliser le thème sombre par défaut
    const savedTheme = localStorage.getItem('theme') || 'dark';

    // Appliquer le thème au chargement
    applyTheme(savedTheme);

    // Ajouter des listeners sur tous les boutons de switch
    themeToggles.forEach(toggle => {
        // Synchroniser l'état du checkbox avec le thème actuel
        toggle.checked = savedTheme === 'light';

        // Écouter les changements
        toggle.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'light' : 'dark';
            applyTheme(newTheme);
            syncToggles(newTheme);
        });
    });

    /**
     * Applique le thème sur le document
     * @param {string} theme - 'light' ou 'dark'
     */
    function applyTheme(theme) {
        if (theme === 'light') {
            htmlElement.setAttribute('data-theme', 'light');
        } else {
            htmlElement.removeAttribute('data-theme');
        }

        // Changer les logos selon le thème
        updateLogos(theme);

        // Sauvegarder dans localStorage
        localStorage.setItem('theme', theme);

        // Notifier les autres modules du changement de thème
        document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));

        console.log(`🎨 Theme changed to: ${theme}`);
    }

    /**
     * Change les logos selon le thème
     * @param {string} theme - 'light' ou 'dark'
     */
    function updateLogos(theme) {
        const logos = document.querySelectorAll('.theme-logo');
        const logoSrc = theme === 'light'
            ? '/assets/img/black_logo_cec.png'
            : '/assets/img/white_logo_cec.png';

        logos.forEach(logo => {
            logo.src = logoSrc;
        });
    }

    /**
     * Synchronise tous les boutons de switch thème
     * @param {string} theme - 'light' ou 'dark'
     */
    function syncToggles(theme) {
        themeToggles.forEach(toggle => {
            toggle.checked = theme === 'light';
        });
    }
}
