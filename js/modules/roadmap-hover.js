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
function isLight() {
  return document.documentElement.getAttribute('data-theme') === 'light';
}

function ACTIVE() {
  return {
    dot:    { borderColor: '#6B46C1',              backgroundColor: '#6B46C1',  boxShadow: '0 0 16px rgba(107,70,193,0.6)' },
    inner:  { backgroundColor: isLight() ? '#6B46C1' : '#ffffff' },
    number: { color: 'rgba(107,70,193,0.55)' },
    title:  { color: isLight() ? 'rgba(0,0,0,0.85)' : '#ffffff' },
    desc:   { color: isLight() ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.55)' }
  };
}

function INACTIVE() {
  return {
    dot:    { borderColor: 'rgba(107,70,193,0.8)', backgroundColor: isLight() ? '#f5f5f5' : '#0d0d14', boxShadow: 'none' },
    inner:  { backgroundColor: 'rgba(107,70,193,0.8)' },
    number: { color: 'rgba(107,70,193,0.18)' },
    title:  { color: isLight() ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.2)' },
    desc:   { color: isLight() ? 'rgba(0,0,0,0.50)' : 'rgba(255,255,255,0.15)' }
  };
}

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
  const state = ACTIVE();
  applyWithTransition(dot,    state.dot,    duration);
  applyWithTransition(inner,  state.inner,  duration);
  applyWithTransition(number, state.number, duration);
  applyWithTransition(title,  state.title,  duration);
  applyWithTransition(desc,   state.desc,   duration);
}

function deactivateStep(step, duration = TRANSITION_OUT) {
  const { dot, inner, number, title, desc } = getEls(step);
  const state = INACTIVE();
  applyWithTransition(dot,    state.dot,    duration);
  applyWithTransition(inner,  state.inner,  duration);
  applyWithTransition(number, state.number, duration);
  applyWithTransition(title,  state.title,  duration);
  applyWithTransition(desc,   state.desc,   duration);
}

function initAllInactive(steps) {
  steps.forEach(step => {
    const { dot, inner, number, title, desc } = getEls(step);
    const state = INACTIVE();
    applyImmediate(dot,    state.dot);
    applyImmediate(inner,  state.inner);
    applyImmediate(number, state.number);
    applyImmediate(title,  state.title);
    applyImmediate(desc,   state.desc);
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

  // Active une étape puis programme le passage à la suivante après STEP_DURATION.
  // Le timer part du moment de l'activation → chaque étape reste active exactement STEP_DURATION ms.
  function activateAndSchedule(index) {
    activateStep(steps[index]);
    cycleTimer = setTimeout(nextStep, STEP_DURATION);
  }

  function nextStep() {
    cycleTimer = null;
    deactivateStep(steps[currentIndex]);
    currentIndex = (currentIndex + 1) % steps.length;
    // Démarre l'activation pendant que la désactivation se termine — pas de gap visible
    setTimeout(() => {
      if (!isHovering) activateAndSchedule(currentIndex);
    }, 200);
  }

  function stopCycle() {
    clearTimeout(cycleTimer);
    cycleTimer = null;
  }

  // Petite temporisation pour laisser le DOM se stabiliser avant le premier cycle
  setTimeout(() => activateAndSchedule(currentIndex), 100);

  // Réappliquer les couleurs quand le thème change
  document.addEventListener('themechange', () => {
    steps.forEach((step, i) => {
      if (i === currentIndex && !isHovering) {
        applyImmediate(getEls(step).title, ACTIVE().title);
        applyImmediate(getEls(step).desc,  ACTIVE().desc);
        applyImmediate(getEls(step).inner, ACTIVE().inner);
      } else {
        const els = getEls(step);
        applyImmediate(els.title,  INACTIVE().title);
        applyImmediate(els.desc,   INACTIVE().desc);
        applyImmediate(els.dot,    INACTIVE().dot);
        applyImmediate(els.inner,  INACTIVE().inner);
        applyImmediate(els.number, INACTIVE().number);
      }
    });
  });

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
      activateAndSchedule(currentIndex);
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
}

export { initRoadmapHover };
