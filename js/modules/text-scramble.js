/**
 * Effets d'animation au scroll pour la section horizontal-scroll
 *
 * — Text scramble : révélation progressive lettre par lettre
 *   Le corps du code-snippet est encrypté dès le chargement,
 *   puis décode vers l'HTML original au scroll trigger.
 *
 * — Highlight : sweep coloré sur les éléments [data-highlight]
 *   data-highlight-delay="400"  — délai en ms (défaut : 0)
 */

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&?';

function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function scrambleFlat(text) {
    return text.split('').map(c => (c === ' ' || c === '\n') ? c : randomChar()).join('');
}

/**
 * Déclenche l'animation de décodage sur un élément.
 * Si _scrambleOriginalHtml est défini, restaure l'innerHTML à la fin.
 * @param {HTMLElement} element
 */
export function scrambleText(element) {
    if (element._scrambling || element._scrambled) return;

    const duration     = parseFloat(element.dataset.scrambleDuration ?? 0.9);
    const speed        = 0.04;
    const originalHTML = element._scrambleOriginalHtml ?? null;

    element.removeAttribute('data-scramble');
    element._scrambling = true;

    // Collecter les nœuds texte avec leur original stocké (mode structure-preserving)
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
        if (node._originalText !== undefined) textNodes.push(node);
    }

    if (textNodes.length > 0) {
        // Animation en place : préserve les spans et les couleurs syntaxiques
        let offset = 0;
        const nodeInfo = textNodes.map(n => {
            const start = offset;
            offset += n._originalText.length;
            return { node: n, orig: n._originalText, start };
        });
        const totalLen = offset;
        const steps = Math.ceil(duration / speed);
        let step = 0;

        const interval = setInterval(() => {
            const revealed = Math.floor((step / steps) * totalLen);
            nodeInfo.forEach(({ node, orig, start }) => {
                let text = '';
                for (let i = 0; i < orig.length; i++) {
                    const c = orig[i];
                    if (c === ' ' || c === '\n') { text += c; continue; }
                    text += (start + i) < revealed ? c : randomChar();
                }
                node.textContent = text;
            });
            step++;
            if (step > steps) {
                clearInterval(interval);
                if (originalHTML !== null) element.innerHTML = originalHTML;
                else textNodes.forEach(({ node, orig }) => { node.textContent = orig; });
                element._scrambling = false;
                element._scrambled  = true;
            }
        }, speed * 1000);

    } else {
        // Fallback flat (éléments sans nœuds texte taggés)
        const original = element._scrambleFlatText ?? element.textContent.replace(/\s+/g, ' ').trim();
        const steps = Math.ceil(duration / speed);
        let step = 0;

        const interval = setInterval(() => {
            const progress = step / steps;
            let scrambled  = '';
            for (let i = 0; i < original.length; i++) {
                if (original[i] === ' ' || original[i] === '\n') { scrambled += original[i]; continue; }
                scrambled += progress * original.length > i ? original[i] : randomChar();
            }
            element.textContent = scrambled;
            step++;
            if (step > steps) {
                clearInterval(interval);
                if (originalHTML !== null) element.innerHTML = originalHTML;
                else element.textContent = original;
                element._scrambling = false;
                element._scrambled  = true;
            }
        }, speed * 1000);
    }
}

/**
 * Vérifie quels éléments [data-scramble] sont dans le viewport
 * et déclenche le décodage. À appeler dans le scroll handler.
 * @param {NodeList|Array} elements
 * @param {number} [threshold=0.75]
 */
export function checkScrambleTriggers(elements, threshold = 0.75) {
    elements.forEach(el => {
        if (el._scrambled || el._scrambling) return;
        const rect = el.getBoundingClientRect();
        if (rect.left < window.innerWidth * threshold && rect.right > 0) {
            const delay = parseInt(el.dataset.scrambleDelay ?? '0', 10);
            if (delay > 0) {
                setTimeout(() => scrambleText(el), delay);
            } else {
                scrambleText(el);
            }
        }
    });
}

/**
 * Vérifie quels éléments [data-highlight] sont dans le viewport
 * et déclenche le sweep coloré (classe .highlight-active).
 * @param {NodeList|Array} elements
 * @param {number} [threshold=0.75]
 */
export function checkHighlightTriggers(elements, threshold = 0.75) {
    elements.forEach(el => {
        if (el._highlighted) return;
        const rect = el.getBoundingClientRect();
        if (rect.left < window.innerWidth * threshold && rect.right > 0) {
            const delay = parseInt(el.dataset.highlightDelay ?? '0', 10);
            setTimeout(() => {
                el.classList.add('highlight-active');
                el._highlighted = true;
            }, delay);
        }
    });
}

export { scrambleFlat };
