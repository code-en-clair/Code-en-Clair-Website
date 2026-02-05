/**
 * Pinned Horizontal Scroll
 * Les cards défilent horizontalement pendant le scroll vertical
 * grâce à position: sticky + translateX piloté par la progression du scroll.
 */

var track = document.getElementById("track");
var cards = document.getElementById("pinnedCards");
var debug = document.getElementById("debug");

var cardCount = cards.querySelectorAll(".card").length;
var CARD_W = 420;
var GAP = 32;
var totalWidth = (cardCount * CARD_W) + ((cardCount - 1) * GAP);

function onScroll() {
  var wrapperWidth = cards.parentElement.offsetWidth;
  var maxScroll = totalWidth - wrapperWidth;

  var rect = track.getBoundingClientRect();
  var trackHeight = track.offsetHeight - window.innerHeight;
  var progress = Math.min(Math.max(-rect.top / trackHeight, 0), 1);
  var tx = -progress * maxScroll;

  cards.style.transform = "translateX(" + tx + "px)";

  debug.textContent =
    "cards: " + cardCount + " | totalW: " + totalWidth + "px\n" +
    "wrapperW: " + wrapperWidth + "px | maxScroll: " + maxScroll + "px\n" +
    "rect.top: " + Math.round(rect.top) + " | trackH: " + Math.round(trackHeight) + "\n" +
    "progress: " + progress.toFixed(3) + " | translateX: " + Math.round(tx) + "px";

  requestAnimationFrame(onScroll);
}

requestAnimationFrame(onScroll);
