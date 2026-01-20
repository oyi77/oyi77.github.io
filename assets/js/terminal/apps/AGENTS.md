# Terminal Apps Agents

**Generated:** 2026-01-20

## OVERVIEW
Command applications for the TerminalOS shell. Each file is one command class.

## COMMAND PATTERN
```javascript
class CommandNameApp {
  constructor(terminal, filesystem, windowManager, os) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
    this.os = os;
  }

  async run(args) {
    // command implementation
  }
}

window.CommandNameApp = CommandNameApp;
```

## REGISTERING COMMANDS
- Add handler in `assets/js/terminal/core.js` `handleCommand()` switch.
- Add app constructor in `runCommand()` app map.
- Add to tab-completion list if applicable.

## OUTPUT RULES
- Use ANSI color codes for status (`\x1b[1;32m`, `\x1b[1;31m`, etc.).
- Always end lines with `\r\n`.
- Use `this.terminal.cols || 60` for width-aware formatting.

## UTILITIES
- `TerminalUtils.center()` and `TerminalUtils.wrap()` for formatting.
- Use filesystem helpers: `resolvePath`, `exists`, `isDirectory`, `read`.

## ANTI-PATTERNS
- No imports or module syntax.
- Avoid hardcoding content; prefer `_data/` via `window.JEKYLL_DATA`.
