/**
 * Module de révélation au scroll
 * Ajoute la classe .is-visible aux éléments .reveal quand ils entrent dans le viewport
 */

export function initScrollReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const delay = entry.target.dataset.revealDelay ?? '0s';
            entry.target.style.transitionDelay = delay;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12
    });

    elements.forEach((el) => observer.observe(el));
}
