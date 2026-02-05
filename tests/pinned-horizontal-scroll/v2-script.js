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
  var maxScroll = totalWidth - window.innerWidth;

  var rect = track.getBoundingClientRect();
  var trackHeight = track.offsetHeight - window.innerHeight;
  var progress = Math.min(Math.max(-rect.top / trackHeight, 0), 1);
  var tx = -progress * maxScroll;

  strip.style.transform = "translateX(" + tx + "px)";

  debug.textContent =
    "canvases: " + canvasCount + " | totalW: " + totalWidth + "px\n" +
    "maxScroll: " + maxScroll + "px\n" +
    "rect.top: " + Math.round(rect.top) + " | trackH: " + Math.round(trackHeight) + "\n" +
    "progress: " + progress.toFixed(3) + " | translateX: " + Math.round(tx) + "px";

  requestAnimationFrame(onScroll);
}

requestAnimationFrame(onScroll);
