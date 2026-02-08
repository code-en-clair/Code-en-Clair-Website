/**
 * Pinned Horizontal Scroll — V2 Editorial
 * 3 canvases plein écran qui défilent horizontalement.
 */

export function initHorizontalScroll() {
  const track = document.getElementById("track");
  const strip = document.getElementById("strip");
  const debug = document.getElementById("debug");

  if (!track || !strip) {
    console.warn("Horizontal scroll: éléments non trouvés");
    return;
  }

  let totalWidth = strip.scrollWidth;

  window.addEventListener("resize", function () {
    totalWidth = strip.scrollWidth;
    onScroll();
  });

  let ticking = false;

  function onScroll() {
    const rect = track.getBoundingClientRect();
    const trackHeight = track.offsetHeight - window.innerHeight;

    const initialOffset = window.innerWidth * 0.4;
    const finalOffset = window.innerWidth * 0.2;

    const maxScroll =
      totalWidth - window.innerWidth + initialOffset + finalOffset;

    const startOffset = window.innerHeight / 2;
    const adjustedTop = -rect.top + startOffset;

    const progress = Math.min(Math.max(adjustedTop / trackHeight, 0), 1);

    const tx = -progress * maxScroll + initialOffset;

    strip.style.transform = `translateX(${tx}px)`;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Position initiale au chargement
  onScroll();
}
