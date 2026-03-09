# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Code en Clair is a French educational website for teaching programming. It's a static website built with vanilla HTML/CSS/JavaScript (no frameworks, no build step).

## Development

**Run locally:** Use VS Code Live Server extension (configured on port 5501)

No package.json, no npm scripts, no build process. Edit files directly and refresh the browser.

## Architecture

### CSS Structure (`css/`)
- `main.css` - Entry point, imports all other CSS
- `variables.css` - Design tokens (colors, spacing, transitions, z-index, formation color schemes)
- `components/` - Component styles (header, footer, panels, terminal, learning, learning-paths)
- `layouts/` - Base styles (`base.css`) and hero section (`hero.css`)
- `utils/` - Animations, fonts (InterVar + Organetto variants), waves background

### JavaScript Structure (`js/`)
ES6 modules loaded via `main.js` (init order matters):
- `modules/theme.js` - Dark/light theme toggle, localStorage persistence, logo swap, syncs all switches
- `modules/header.js` - Navigation panel dropdowns, search overlay, mobile burger menu, header shrink on scroll
- `modules/horizontal-scroll.js` - Pinned sticky section with transform-based horizontal scrolling (850vh track)
- `modules/terminal.js` - Animated terminal with typing effect (30-line sequence, loops)
- `modules/waves.js` - Canvas-based animated wave background (WaveLine class, theme-aware colors)
- `modules/scroll-reveal.js` - IntersectionObserver-based reveal animations (`.reveal` + `.is-visible`)

### Key Patterns
- CSS variables in `:root` for theming (dark theme: `--bg-primary: #141619`)
- Dark/light theme via `data-theme="light"` attribute on `<html>` (dark is default, no attribute)
- Glass morphism with `backdrop-filter: blur(16px)`
- `data-panel` attributes for dynamic panel targeting
- Z-index layering: header (1000), modal (2000)
- Horizontal scroll: pinned sticky section + 850vh track + `transform: translateX()` driven by scroll
- Formation color schemes: Python (yellow/blue), Frontend (orange/yellow), Algorithmique C (blue/purple)

### Fonts
Custom fonts in `assets/fonts/`:
- **InterVar** - Variable font for body text (100-900 weights, TTF)
- **Organetto** - Display font, 7 width variants (Normal, Condensed, Expanded, Extra, SemiExp, SemiExt, UltraCnd), each with weights 100-700 (WOFF2). **Does not support accented characters** (é, ç, à) — avoid accents in Organetto text.

### Hero Section (`css/layouts/hero.css`)
Bento-style layout intégré depuis le mockup `tests/hero_section/hero-v3-bento.html` :
- `.hero-section` — flex column, `min-height: 100vh`, contient les blobs ambiants et `.hero-bento`
- `.hero-bento` — `flex: 1`, padding `60px 64px 0`, max-width 1400px centré. Contient `.hero-top` + `.hero-ticker-section`
- `.hero-top` — grille `1fr auto`, gap 64px. Colonne gauche : texte + CTAs. Colonne droite : `.hero-side-card` (360px)
- `.hero-ticker-section` — bandeau défilant avec `margin: 48px -64px 0` pour casser le padding parent (pleine largeur)
- Tokens locaux : `--hero-neon`, `--hero-cyan`, `--hero-card`, `--hero-border` (surchargés en mode clair)
- **Header est `sticky` (pas `fixed`)** — pas besoin de `padding-top` de compensation dans le hero

### Tests
Prototypes dans `tests/` :
- `tests/pinned-horizontal-scroll/` - Prototypes standalone (v1 card grid, v2 editorial canvas) pour la section horizontal scroll. HTML/CSS/JS autonomes, sans dépendance sur le CSS/JS principal.
- `tests/hero_section/hero-v3-bento.html` - Mockup retenu pour le hero bento (désormais intégré dans `index.html`)

## Conventions

- French language in UI and comments
- Semantic commit messages in French (e.g., `feat(typography):`, `correction des waves`)
- BEM-like CSS naming
