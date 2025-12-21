# EcmaOS Project Rules & Guidelines

## Project Overview
This project is a personal portfolio website modeled as a "Terminal OS" (EcmaOS). It integrates standard web technologies (Jekyll, HTML, CSS) with valid EcmaOS kernel logic.

## Codebase Structure
- **Core Logic**: `assets/js/terminal/core.js` (TerminalOS class).
- **EcmaOS Kernel**: `assets/js/terminal/ecmaos-kernel.js` (Dynamically loaded).
- **Apps**: `assets/js/terminal/apps/` (Individual command implementations).
- **UI/Layout**: `_layouts/terminal.html`.

## Integration Standards
1.  **EcmaOS Native Commands**:
    - Usable directly without `ecmaos` prefix.
    - `TerminalOS.handleCommand` delegates unknown commands to `EcmaOS`.
2.  **Help System**:
    - Dynamically lists kernel commands with fallback.
3.  **Package Management**:
    - `install` command handles package listings (`-l`, `--list`, `ls`).

## Project Goals
- **Full EcmaOS Compatibility**.
- **Seamless Fallback**.
- **Extensibility**.

## References
- EcmaOS Apps: https://www.npmjs.com/org/ecmaos-apps
