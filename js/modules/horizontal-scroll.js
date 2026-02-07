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

  let canvasCount = strip.querySelectorAll(".canvas").length;
  let totalWidth = canvasCount * window.innerWidth;

  window.addEventListener("resize", function () {
    totalWidth = canvasCount * window.innerWidth;
  });

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

    if (debug) {
      debug.textContent =
        `canvases: ${canvasCount} | totalW: ${totalWidth}px\n` +
        `maxScroll: ${maxScroll}px\n` +
        `rect.top: ${Math.round(rect.top)} | trackH: ${Math.round(trackHeight)}\n` +
        `progress: ${progress.toFixed(3)} | translateX: ${Math.round(tx)}px\n` +
        `offsets: ${Math.round(initialOffset)}px (init) / ${Math.round(finalOffset)}px (final)`;
    }

    requestAnimationFrame(onScroll);
  }

  requestAnimationFrame(onScroll);
}
