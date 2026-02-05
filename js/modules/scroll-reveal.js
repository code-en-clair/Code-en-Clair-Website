/**
 * Module de révélation au scroll
 * Ajoute la classe .is-visible aux éléments .reveal quand ils entrent dans le viewport
 */

export function initScrollReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            } else {
                entry.target.classList.remove("is-visible");
            }
        });
    }, {
        threshold: 0.15
    });

    elements.forEach((el) => observer.observe(el));
}
