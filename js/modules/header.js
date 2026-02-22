/**
 * Module de gestion du header (Apple-style V2)
 * Gère l'ouverture/fermeture des panels de navigation
 * + Search overlay + Mobile menu + Shrink on scroll + Accessibilité clavier
 */

/* ===== DROPDOWN PANELS (DESKTOP) ===== */
function setupDropdownPanels(navItems, panelItems, headerPanel, pageContent, closePanel) {
    navItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            const target = item.getAttribute("data-panel");
            panelItems.forEach(panel => panel.classList.remove("is-active"));
            headerPanel.classList.add("is-open");
            if (pageContent) pageContent.classList.add("is-blurred");
            requestAnimationFrame(() => {
                panelItems.forEach(panel => {
                    if (panel.getAttribute("data-panel") === target) {
                        panel.classList.add("is-active");
                    }
                });
            });
        });

        // Accessibilité clavier : Enter/Space pour ouvrir
        item.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                item.querySelector("a").click();
            }
        });
    });

    headerPanel.addEventListener("mouseleave", closePanel);
    headerPanel.addEventListener("mouseenter", () => {
        headerPanel.classList.add("is-open");
        if (pageContent) pageContent.classList.add("is-blurred");
    });
}

/* ===== SEARCH OVERLAY ===== */
function setupSearchOverlay(searchButton, searchOverlay, searchInput, searchClose, closeSearch) {
    if (!searchButton || !searchOverlay) return;

    searchButton.addEventListener("click", () => {
        searchOverlay.classList.add("is-open");
        document.body.style.overflow = "hidden";
        setTimeout(() => searchInput?.focus(), 100);
    });

    searchClose?.addEventListener("click", closeSearch);

    // Fermeture par clic sur le fond
    searchOverlay.addEventListener("click", (e) => {
        if (e.target === searchOverlay) closeSearch();
    });
}

/* ===== MOBILE MENU ===== */
function setupMobileMenu(burgerMenu, mobileMenu, mobileBackdrop, openMobileMenu, closeMobileMenu) {
    if (!burgerMenu || !mobileMenu) return;

    burgerMenu.addEventListener("click", () => {
        if (mobileMenu.classList.contains("is-open")) closeMobileMenu();
        else openMobileMenu();
    });

    // Fermeture par clic sur le backdrop
    mobileBackdrop?.addEventListener("click", closeMobileMenu);
}

/* ===== GESTIONNAIRE ESCAPE UNIFIÉ ===== */
function setupEscapeHandler(searchOverlay, mobileMenu, headerPanel, closeSearch, closeMobileMenu, closePanel) {
    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        if (searchOverlay?.classList.contains("is-open")) closeSearch();
        if (mobileMenu?.classList.contains("is-open")) closeMobileMenu();
        if (headerPanel.classList.contains("is-open")) closePanel();
    });
}

export function initHeader() {
    const header = document.querySelector("header");
    const headerPanel = document.querySelector(".header-panel");
    const navItems = document.querySelectorAll(".nav-item");
    const panelItems = document.querySelectorAll(".panel-item");
    const pageContent = document.querySelector(".page-content");

    if (!headerPanel || !navItems.length) return;

    const searchOverlay = document.getElementById("searchOverlay");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileBackdrop = document.getElementById("mobileBackdrop");
    const burgerMenu = document.querySelector(".burger-menu");

    function closePanel() {
        headerPanel.classList.remove("is-open");
        if (pageContent) pageContent.classList.remove("is-blurred");
        panelItems.forEach(panel => panel.classList.remove("is-active"));
    }

    function closeSearch() {
        searchOverlay?.classList.remove("is-open");
        document.body.style.overflow = "";
    }

    function openMobileMenu() {
        mobileMenu.classList.add("is-open");
        mobileBackdrop?.classList.add("is-open");
        burgerMenu.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove("is-open");
        mobileBackdrop?.classList.remove("is-open");
        burgerMenu.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }

    setupDropdownPanels(navItems, panelItems, headerPanel, pageContent, closePanel);
    setupSearchOverlay(
        document.querySelector(".search-button"),
        searchOverlay,
        document.querySelector(".search-input"),
        document.querySelector(".search-close"),
        closeSearch
    );
    setupMobileMenu(burgerMenu, mobileMenu, mobileBackdrop, openMobileMenu, closeMobileMenu);

    /* ===== SHRINK ON SCROLL (APPLE STYLE) ===== */
    window.addEventListener("scroll", () => {
        header?.classList.toggle("is-scrolled", window.pageYOffset > 100);
    });

    setupEscapeHandler(searchOverlay, mobileMenu, headerPanel, closeSearch, closeMobileMenu, closePanel);
}
