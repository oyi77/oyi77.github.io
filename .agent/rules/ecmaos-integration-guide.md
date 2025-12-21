# EcmaOS Integration Guide

## Architecture Overview
This portfolio site integrates EcmaOS kernel natively into a custom TerminalOS implementation.

### Key Components
- **TerminalOS** (`assets/js/terminal/core.js`): Main terminal class
- **EcmaOS Kernel** (`assets/js/terminal/ecmaos-kernel.js`): Dynamically loaded ES module
- **Apps** (`assets/js/terminal/apps/`): Individual command implementations

## Integration Pattern
1. **Dynamic Import**: EcmaOS kernel loaded via `import()` in `initEcmaOS()`
2. **Command Delegation**: Unknown commands fall through to EcmaOS kernel
3. **Seamless UX**: Users don't need `ecmaos` prefix for native commands

## Command Implementation Standards

### Native Commands (via EcmaOS)
Commands like `cat`, `ls`, `cd`, `install`, `snake`, etc. are handled by the kernel.

### Local Commands (TerminalOS Apps)
- Each app is a class in `apps/` directory
- Must be registered in `core.js` appMap
- Must have switch case in `handleCommand()`
- Constructor signature: `(terminal, filesystem, windowManager, os)`

### Install Command Pattern
The `install` command demonstrates best practices:
- Fetches real-time data from npm registry API
- Graceful error handling with fallback
- Async/await for network operations
- Clean terminal output formatting

## Help System
- EcmaOS commands merged into "CORE MODULES" section
- Dynamic command discovery with hardcoded fallback
- No separate "EcmaOS Kernel" section

## Removed/Deprecated
- **Web3OS**: Completely removed (was legacy integration)
- **3pm**: Package manager removed (replaced by `install`)

## Best Practices
1. Always add switch case when adding to appMap
2. Use async/await for I/O operations
3. Provide user feedback during long operations
4. Implement graceful degradation
5. Keep help documentation synchronized
