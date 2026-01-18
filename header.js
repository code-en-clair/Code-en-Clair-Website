document.addEventListener("DOMContentLoaded", () => {
    const headerPanel = document.querySelector(".header-panel");
    const navItems = document.querySelectorAll(".nav-item");
    const panelItems = document.querySelectorAll(".panel-item");
    const pageContent = document.querySelector(".page-content");

    /* ===== OUVERTURE DU BANDEAU ===== */
    navItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            const target = item.getAttribute("data-panel");

            /* 1. Reset de tous les panels (état initial) */
            panelItems.forEach(panel => {
                panel.classList.remove("is-active");
            });

            /* 2. Ouverture du bandeau */
            headerPanel.classList.add("is-open");
            pageContent.classList.add("is-blurred");

            /* 3. Frame suivante → activation du bon panel (animation possible) */
            requestAnimationFrame(() => {
                panelItems.forEach(panel => {
                    if (panel.getAttribute("data-panel") === target) {
                        panel.classList.add("is-active");
                    }
                });
            });
        });
    });

    /* ===== FERMETURE DU BANDEAU ===== */
    headerPanel.addEventListener("mouseleave", () => {
        headerPanel.classList.remove("is-open");
        pageContent.classList.remove("is-blurred");

        /* Reset obligatoire pour rejouer l’animation */
        panelItems.forEach(panel => {
            panel.classList.remove("is-active");
        });
    });
});
