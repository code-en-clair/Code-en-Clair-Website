/**
 * Roadmap — cycle automatique + hover
 *
 * Remplace les keyframes CSS. Le JS gère :
 *  - le cycle : une étape active à la fois, toutes les 5s
 *  - le hover : pause du cycle, état actif sur l'étape survolée, reprise fluide au départ
 */

// ── Durées ────────────────────────────────────────────────────────────────────
const STEP_DURATION   = 5000;  // ms entre chaque changement d'étape
const TRANSITION_IN   = 700;   // ms pour passer à l'état actif
const TRANSITION_OUT  = 500;   // ms pour revenir à l'état inactif
const EASING          = 'ease-in-out';

// ── États visuels ─────────────────────────────────────────────────────────────
const ACTIVE = {
  dot:    { borderColor: '#6B46C1',              backgroundColor: '#6B46C1',  boxShadow: '0 0 16px rgba(107,70,193,0.6)' },
  inner:  { backgroundColor: '#ffffff' },
  number: { color: 'rgba(107,70,193,0.55)' },
  title:  { color: '#ffffff' },
  desc:   { color: 'rgba(255,255,255,0.55)' }
};

const INACTIVE = {
  dot:    { borderColor: 'rgba(107,70,193,0.8)', backgroundColor: '#0d0d14', boxShadow: 'none' },
  inner:  { backgroundColor: 'rgba(107,70,193,0.8)' },
  number: { color: 'rgba(107,70,193,0.18)' },
  title:  { color: 'rgba(255,255,255,0.2)' },
  desc:   { color: 'rgba(255,255,255,0.15)' }
};

// ── Utilitaires ───────────────────────────────────────────────────────────────
function camelToKebab(str) {
  return str.replace(/([A-Z])/g, c => '-' + c.toLowerCase());
}

function applyWithTransition(el, state, duration, easing = EASING) {
  el.style.transition = Object.keys(state)
    .map(k => `${camelToKebab(k)} ${duration}ms ${easing}`)
    .join(', ');
  Object.assign(el.style, state);
}

function applyImmediate(el, state) {
  el.style.transition = 'none';
  Object.assign(el.style, state);
}

function getEls(step) {
  return {
    dot:    step.querySelector('.step-dot'),
    inner:  step.querySelector('.step-dot-inner'),
    number: step.querySelector('.step-number'),
    title:  step.querySelector('.step-title'),
    desc:   step.querySelector('.step-desc')
  };
}

function activateStep(step, duration = TRANSITION_IN) {
  const { dot, inner, number, title, desc } = getEls(step);
  applyWithTransition(dot,    ACTIVE.dot,    duration);
  applyWithTransition(inner,  ACTIVE.inner,  duration);
  applyWithTransition(number, ACTIVE.number, duration);
  applyWithTransition(title,  ACTIVE.title,  duration);
  applyWithTransition(desc,   ACTIVE.desc,   duration);
}

function deactivateStep(step, duration = TRANSITION_OUT) {
  const { dot, inner, number, title, desc } = getEls(step);
  applyWithTransition(dot,    INACTIVE.dot,    duration);
  applyWithTransition(inner,  INACTIVE.inner,  duration);
  applyWithTransition(number, INACTIVE.number, duration);
  applyWithTransition(title,  INACTIVE.title,  duration);
  applyWithTransition(desc,   INACTIVE.desc,   duration);
}

function initAllInactive(steps) {
  steps.forEach(step => {
    const { dot, inner, number, title, desc } = getEls(step);
    applyImmediate(dot,    INACTIVE.dot);
    applyImmediate(inner,  INACTIVE.inner);
    applyImmediate(number, INACTIVE.number);
    applyImmediate(title,  INACTIVE.title);
    applyImmediate(desc,   INACTIVE.desc);
  });
}

// ── Initialisation ────────────────────────────────────────────────────────────
function initRoadmapHover() {
  const roadmap = document.querySelector('.roadmap');
  if (!roadmap) return;

  const steps      = Array.from(roadmap.querySelectorAll('.step'));
  let currentIndex = 0;
  let cycleTimer   = null;
  let leaveTimer   = null;
  let isHovering   = false;

  // État initial sans transition
  initAllInactive(steps);
  // Petite temporisation pour laisser le DOM se stabiliser avant le premier cycle
  setTimeout(() => activateStep(steps[currentIndex], TRANSITION_IN), 100);

  function nextStep() {
    deactivateStep(steps[currentIndex]);
    currentIndex = (currentIndex + 1) % steps.length;
    // Démarre l'activation pendant que la désactivation se termine — pas de gap visible
    setTimeout(() => activateStep(steps[currentIndex]), 200);
  }

  function startCycle() {
    cycleTimer = setInterval(nextStep, STEP_DURATION);
  }

  function stopCycle() {
    clearInterval(cycleTimer);
    cycleTimer = null;
  }

  // ── Hover ──────────────────────────────────────────────────────────────────
  roadmap.addEventListener('mouseenter', () => {
    if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
    if (isHovering) return;
    isHovering = true;

    stopCycle();
    // Ramène tous les steps à l'inactif sans toucher l'étape courante
    steps.forEach((step, i) => {
      if (i !== currentIndex) deactivateStep(step, TRANSITION_OUT);
    });
    // L'étape courante reste active — le hover sur un step précis l'overridera
  });

  roadmap.addEventListener('mouseleave', () => {
    if (!isHovering) return;
    isHovering = false;

    // Ramène l'étape survolée à inactive
    steps.forEach(step => deactivateStep(step, TRANSITION_OUT));

    // Reprend le cycle après la transition de sortie
    leaveTimer = setTimeout(() => {
      activateStep(steps[currentIndex], TRANSITION_IN);
      setTimeout(startCycle, TRANSITION_IN);
      leaveTimer = null;
    }, TRANSITION_OUT);
  });

  steps.forEach(step => {
    step.addEventListener('mouseenter', () => {
      if (!isHovering) return;
      steps.forEach(s => deactivateStep(s, TRANSITION_OUT));
      activateStep(step, TRANSITION_IN);
    });
  });

  // Lance le cycle
  startCycle();
}

export { initRoadmapHover };
