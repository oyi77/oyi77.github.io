# Terminal Core Agents

**Generated:** 2026-01-20

## OVERVIEW
Core runtime for TerminalOS: boot, kernel wiring, filesystem, themes, effects, and window management.

## ARCHITECTURE
- `core.js` owns command dispatch, terminal lifecycle, and app registry.
- Boot path flows through `boot-sequence.js` and `kernel.js` before handoff to `core.js`.
- `filesystem.js` provides in-memory *nix-like operations; `filesystem-loader.js` hydrates from Jekyll data.
- `window-manager.js` manages multi-window UI within the terminal shell.
- `themes.js` and `effects.js` control CRT visuals and theme switching.

## KEY COMPONENTS
- `assets/js/terminal/core.js` - main entry and command router.
- `assets/js/terminal/kernel.js` - OS boot + init glue.
- `assets/js/terminal/filesystem.js` - virtual filesystem API.
- `assets/js/terminal/filesystem-loader.js` - data bridge from `_data/`.
- `assets/js/terminal/themes.js` - theme registry + persistence.

## EXTENDING
- Keep classes global: `window.X = X;` (no module imports).
- New command implementations live in `assets/js/terminal/apps/`.
- Register new commands in `assets/js/terminal/core.js` (handler + app map).
- Use `TerminalUtils` for wrapping/centering and ANSI colors.

## ANTI-PATTERNS
- Do not use `import`/`require` in this directory.
- Do not hardcode content; use `window.JEKYLL_DATA` instead.
