/**
 * Pinned Horizontal Scroll — V2 Editorial
 * 3 canvases plein ecran qui defilent horizontalement.
 */

var track = document.getElementById("track");
var strip = document.getElementById("strip");
var debug = document.getElementById("debug");

var canvasCount = strip.querySelectorAll(".canvas").length;
var totalWidth = canvasCount * window.innerWidth;

window.addEventListener("resize", function () {
  totalWidth = canvasCount * window.innerWidth;
});

function onScroll() {
  var rect = track.getBoundingClientRect();
  var trackHeight = track.offsetHeight - window.innerHeight;

  // Offset initial et final pour centrer les éléments au début et à la fin
  var initialOffset = window.innerWidth * 0.4; // Commence au centre
  var finalOffset = window.innerWidth * 0.20; // Termine à 75% pour transition plus douce

  // Ajuster maxScroll pour inclure les offsets
  var maxScroll = totalWidth - window.innerWidth + initialOffset + finalOffset;

  // Démarrage anticipé : commence quand la section arrive au milieu de l'écran
  var startOffset = window.innerHeight / 2;
  var adjustedTop = -rect.top + startOffset;

  var progress = Math.min(Math.max(adjustedTop / trackHeight, 0), 1);

  // Calculer translateX avec les offsets
  var tx = -progress * maxScroll + initialOffset;

  strip.style.transform = "translateX(" + tx + "px)";

  debug.textContent =
    "canvases: " + canvasCount + " | totalW: " + totalWidth + "px\n" +
    "maxScroll: " + maxScroll + "px\n" +
    "rect.top: " + Math.round(rect.top) + " | trackH: " + Math.round(trackHeight) + "\n" +
    "progress: " + progress.toFixed(3) + " | translateX: " + Math.round(tx) + "px" + "\n" +
    "offsets: " + Math.round(initialOffset) + "px (init) / " + Math.round(finalOffset) + "px (final)";

  requestAnimationFrame(onScroll);
}

requestAnimationFrame(onScroll);
