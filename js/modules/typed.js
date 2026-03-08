/**
 * Effet typewriter sur .hero-description
 * Gère les éléments inline (ex: <code>) en les recréant segment par segment
 */

export function initTyped() {
    const el = document.querySelector('.hero-description');
    if (!el) return;

    // Accessibilité : si l'utilisateur préfère sans animation, affiche directement
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.classList.add('typed-active');
        return;
    }

    // Collecte les segments (texte brut ou élément inline)
    const segments = [];
    el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.replace(/\s+/g, ' ');
            if (text.trim()) segments.push({ type: 'text', content: text });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            segments.push({ type: 'element', tag: node.tagName.toLowerCase(), content: node.textContent });
        }
    });

    // Vide le paragraphe et le rend visible
    el.innerHTML = '';
    el.classList.add('typed-active');

    // Curseur clignotant
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    el.appendChild(cursor);

    // Crée les nœuds DOM pour chaque segment (tous vides au départ)
    const nodes = segments.map(seg => {
        const node = document.createElement(seg.type === 'element' ? seg.tag : 'span');
        el.insertBefore(node, cursor);
        return node;
    });

    let si = 0, ci = 0;

    function tick() {
        if (si >= segments.length) {
            setTimeout(() => cursor.remove(), 500);
            return;
        }
        const { content } = segments[si];
        if (ci < content.length) {
            nodes[si].textContent = content.slice(0, ci + 1);
            ci++;
            setTimeout(tick, 14);
        } else {
            si++;
            ci = 0;
            tick(); // segment suivant immédiatement
        }
    }

    // Démarre après l'animation du titre (fadeInUp ~0.8s + délai 0.4s)
    setTimeout(tick, 900);
}
