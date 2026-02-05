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
- `variables.css` - Design tokens (colors, spacing, transitions, z-index)
- `components/` - Component styles (header, footer, panels, terminal, learning cards)
- `layouts/` - Base styles and hero section
- `utils/` - Animations, fonts, waves background

### JavaScript Structure (`js/`)
ES6 modules loaded via `main.js`:
- `modules/header.js` - Navigation panel dropdowns with mouseenter/mouseleave
- `modules/terminal.js` - Animated terminal with typing effect (30-line sequence)
- `modules/waves.js` - Canvas-based animated wave background (WaveLine class)

### Key Patterns
- CSS variables in `:root` for theming (dark theme: `--bg-primary: #141619`)
- Glass morphism with `backdrop-filter`
- `data-panel` attributes for dynamic panel targeting
- Z-index layering: header (1000), modal (2000)

### Fonts
Custom fonts in `assets/fonts/`:
- **InterVar** - Variable font for body text (400-900 weights)
- **Organetto** - Display font (weights: 200, 400, 700, 800)

## Conventions

- French language in UI and comments
- Semantic commit messages in French (e.g., `feat(typography):`, `correction des waves`)
- BEM-like CSS naming
