/**
 * Module de gestion du header (Apple-style V2)
 * Gère l'ouverture/fermeture des panels de navigation
 * + Search overlay + Mobile menu + Shrink on scroll + Accessibilité clavier
 */

export function initHeader() {
    const header = document.querySelector("header");
    const headerPanel = document.querySelector(".header-panel");
    const navItems = document.querySelectorAll(".nav-item");
    const panelItems = document.querySelectorAll(".panel-item");
    const pageContent = document.querySelector(".page-content");

    // Nouveaux éléments
    const searchButton = document.querySelector(".search-button");
    const searchOverlay = document.getElementById("searchOverlay");
    const searchClose = document.querySelector(".search-close");
    const searchInput = document.querySelector(".search-input");
    const burgerMenu = document.querySelector(".burger-menu");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!headerPanel || !navItems.length) return;

    /* ===== DROPDOWN PANELS (DESKTOP) ===== */
    navItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            const target = item.getAttribute("data-panel");

            panelItems.forEach(panel => {
                panel.classList.remove("is-active");
            });

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

    headerPanel.addEventListener("mouseleave", () => {
        headerPanel.classList.remove("is-open");
        if (pageContent) pageContent.classList.remove("is-blurred");

        panelItems.forEach(panel => {
            panel.classList.remove("is-active");
        });
    });

    headerPanel.addEventListener("mouseenter", () => {
        headerPanel.classList.add("is-open");
        if (pageContent) pageContent.classList.add("is-blurred");
    });

    /* ===== SEARCH OVERLAY ===== */
    if (searchButton && searchOverlay) {
        searchButton.addEventListener("click", () => {
            searchOverlay.classList.add("is-open");
            document.body.style.overflow = "hidden";
            setTimeout(() => searchInput?.focus(), 100);
        });

        searchClose?.addEventListener("click", closeSearch);

        // Fermeture par Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && searchOverlay.classList.contains("is-open")) {
                closeSearch();
            }
        });

        // Fermeture par clic sur le fond
        searchOverlay.addEventListener("click", (e) => {
            if (e.target === searchOverlay) {
                closeSearch();
            }
        });
    }

    function closeSearch() {
        searchOverlay?.classList.remove("is-open");
        document.body.style.overflow = "";
    }

    /* ===== MOBILE MENU ===== */
    const mobileBackdrop = document.getElementById("mobileBackdrop");

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

    if (burgerMenu && mobileMenu) {
        // Toggle via burger button
        burgerMenu.addEventListener("click", () => {
            if (mobileMenu.classList.contains("is-open")) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Fermeture par clic sur le backdrop
        mobileBackdrop?.addEventListener("click", closeMobileMenu);

        // Fermeture par Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
                closeMobileMenu();
            }
        });
    }

    /* ===== SHRINK ON SCROLL (APPLE STYLE) ===== */
    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header?.classList.add("is-scrolled");
        } else {
            header?.classList.remove("is-scrolled");
        }
    });

    /* ===== ACCESSIBILITÉ CLAVIER GLOBALE ===== */
    // Fermeture des panels avec Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && headerPanel.classList.contains("is-open")) {
            headerPanel.classList.remove("is-open");
            if (pageContent) pageContent.classList.remove("is-blurred");
            panelItems.forEach(panel => {
                panel.classList.remove("is-active");
            });
        }
    });
}
