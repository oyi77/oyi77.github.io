# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-20
**Context:** Terminal OS Portfolio (Jekyll + Vanilla JS)

## OVERVIEW
A hacker-themed terminal operating system portfolio built with Jekyll (static site) and vanilla JavaScript (client-side OS). Simulates a full boot sequence, window management, and filesystem interaction without a backend.

## STRUCTURE
```
.
├── _config.yml              # Site configuration
├── _data/                   # Content database (YAML/JSON)
├── _plugins/                # Ruby build extensions (Gems)
├── assets/
│   ├── js/
│   │   ├── terminal/        # Core OS Kernel (Boot, FS, WindowManager)
│   │   │   └── apps/        # Individual Command Applications (exe)
│   │   └── features/        # Standalone page interactions
│   └── css/                 # CRT effects and theming
└── openspec/                # Specifications and Change Management
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| **Add Command** | `assets/js/terminal/apps/` | Create Class, register in `core.js` |
| **Modify Kernel** | `assets/js/terminal/` | Core logic (`filesystem.js`, `core.js`) |
| **Update Data** | `_data/` | `terminal.yml`, `projects.json` |
| **Build Logic** | `_plugins/` | Ruby generators and filters |
| **Content** | `_pages/`, `_posts/` | Markdown with Front Matter |

## CODE MAP

| Component | Path | Role | Key Pattern |
|-----------|------|------|-------------|
| **Kernel** | `assets/js/terminal/core.js` | Main Entry | `window.TerminalOS` |
| **Filesystem** | `assets/js/terminal/filesystem.js` | Virtual FS | In-memory, mimics *nix |
| **Apps** | `assets/js/terminal/apps/*.js` | Commands | `class XApp { run(args) }` |
| **Loader** | `assets/js/terminal/filesystem-loader.js` | Bridge | Injects Jekyll data to JS |

## CONVENTIONS

### JavaScript (Client-Side)
- **No Bundler**: Files loaded via `<script>` tags in `_layouts/terminal.html`.
- **Global Scope**: Classes exported to `window` (e.g., `window.WhoAmIApp = WhoAmIApp`).
- **Async Commands**: All command `run()` methods must be `async`.
- **Terminal Access**: `this.terminal` provides xterm.js instance.

### Jekyll (Build-Side)
- **Data-Driven**: Content heavily sourced from `_data/`.
- **Plugins**: Custom Ruby plugins in `_plugins/` handle complex data fetching/generation.

### Styling
- **Theming**: CSS Variables (`--term-color`, `--term-bg`) in `terminal.css`.
- **Effects**: Scanlines/CRT effects via pure CSS overlays.

## ANTI-PATTERNS (THIS PROJECT)
- **DO NOT** use `import`/`require` in terminal JS (no module system).
- **DO NOT** hardcode content in JS; use `_data/` and inject via `window.JEKYLL_DATA`.
- **DO NOT** modify `vendor/` files directly.
- **DO NOT** assume backend existence (static site only).

## COMMANDS
```bash
# Development
bundle exec jekyll serve      # Start local server (localhost:4000)

# Content
openspec list                 # Check active specs/changes
```
