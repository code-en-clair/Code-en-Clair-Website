/**
 * Pinned Horizontal Scroll — V2 Editorial
 * Desktop : 3 canvases defilent horizontalement via scroll vertical
 * Mobile (≤ 768px) : Carousel swipe tactile avec dots de navigation
 */

const MOBILE_BREAKPOINT = 768;

export function initHorizontalScroll() {
  const track = document.getElementById("track");
  const strip = document.getElementById("strip");

  if (!track || !strip) {
    console.warn("Horizontal scroll: elements non trouves");
    return;
  }

  let currentMode = null; // 'desktop' | 'mobile'
  let desktopCleanup = null;
  let mobileCleanup = null;

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  // ============ MODE DESKTOP (logique existante) ============
  function initDesktop() {
    let totalWidth = strip.scrollWidth;
    let ticking = false;

    function onScroll() {
      const rect = track.getBoundingClientRect();
      const trackHeight = track.offsetHeight - window.innerHeight;
      const initialOffset = window.innerWidth * 0.4;
      const finalOffset = window.innerWidth * 0.2;
      const maxScroll = totalWidth - window.innerWidth + initialOffset + finalOffset;
      const startOffset = window.innerHeight / 2;
      const adjustedTop = -rect.top + startOffset;
      const progress = Math.min(Math.max(adjustedTop / trackHeight, 0), 1);
      const tx = -progress * maxScroll + initialOffset;
      strip.style.transform = `translateX(${tx}px)`;
    }

    function scrollHandler() {
      if (!ticking) {
        requestAnimationFrame(function () {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    function resizeHandler() {
      totalWidth = strip.scrollWidth;
      onScroll();
    }

    window.addEventListener("scroll", scrollHandler);
    window.addEventListener("resize", resizeHandler);
    onScroll();

    return function cleanup() {
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("resize", resizeHandler);
      strip.style.transform = "";
    };
  }

  // ============ MODE MOBILE (stack vertical, pas de JS) ============
  function initMobileStack() {
    // CSS gere tout : flex-direction column, transform: none
    // On s'assure juste que le strip n'a pas de transform residuel
    strip.style.transform = "";

    return function cleanup() {
      strip.style.transform = "";
    };
  }

  // ============ GESTIONNAIRE DE MODE ============
  function setMode() {
    const newMode = isMobile() ? "mobile" : "desktop";
    if (newMode === currentMode) return;

    if (currentMode === "desktop" && desktopCleanup) desktopCleanup();
    if (currentMode === "mobile" && mobileCleanup) mobileCleanup();

    if (newMode === "desktop") {
      desktopCleanup = initDesktop();
    } else {
      mobileCleanup = initMobileStack();
    }

    currentMode = newMode;
  }

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setMode, 150);
  });

  setMode();
}
