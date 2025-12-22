# Command System Architecture

## Command Types

### Local Commands (Portfolio-Specific)

Commands implemented locally for portfolio context:

- `whoami` - Portfolio identity
- `companies` - Work history
- `achievements` - Accomplishments
- `repos` - GitHub integration
- `sysmon` - System monitor
- `cv` - Interactive CV
- `hack` - Privilege escalation game
- `opm` - Package manager
- `github` - GitHub explorer
- `stats` - Repository stats
- `market` - Market data

### Delegated Commands (EcmaOS)

Standard Unix/Linux commands delegated to EcmaOS kernel:

- File operations: `mkdir`, `touch`, `rm`, `mv`, `cp`
- Directory: `ls`, `cd`, `pwd`
- System: `ps`, `kill`, `df`, `du`, `free`, `env`
- Network: `fetch`, `download`
- Utilities: `edit`, `load`
- Entertainment: `snake`, `video`, `play`, `screensaver`
- Effects: `matrix`, `decrypt`

## Command Registration

### Registration Points

1. **Switch Statement** (`core.js` line ~427): Primary routing
2. **appMap** (`core.js` line ~573): App class mapping
3. **Tab Completion** (`core.js` line ~829): Command list
4. **Help System** (`help.js`): Command documentation

### Adding a New Command

1. Create app class in `assets/js/terminal/apps/`
2. Export to window: `window.CommandNameApp = CommandNameApp;`
3. Add to switch statement in `handleCommand()`
4. Add to `appMap` in `runCommand()`
5. Add to tab completion list
6. Add to help documentation
7. Load script in `_layouts/terminal.html`

## Command App Structure

```javascript
class CommandNameApp {
  constructor(terminal, filesystem, windowManager, os) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
    this.os = os;
  }

  async run(args) {
    // Command implementation
    // Use this.terminal.write() for output
    // Use ANSI color codes for formatting
  }
}

window.CommandNameApp = CommandNameApp;
```

## Command Delegation

### EcmaOS Fallthrough

When a command is not found in the switch statement:

```javascript
default:
  if (this.ecmaKernel) {
    try {
      if (typeof this.ecmaKernel.execute === 'function') {
        await this.ecmaKernel.execute(input, this.terminal);
        this.prompt();
        return;
      }
    } catch (e) {
      console.error("EcmaOS execution failed:", e);
    }
  }
  this.terminal.write(`\x1b[1;31m${command}: command not found\x1b[0m\r\n`);
```

### Decision Matrix

**Implement Locally When:**
- Needs portfolio-specific data (Jekyll integration)
- Custom UI/UX for portfolio context
- Portfolio-specific behavior

**Delegate to EcmaOS When:**
- Standard Unix command behavior
- File system operations
- System utilities
- Games/entertainment

## Error Handling

All commands should:

1. Validate arguments
2. Check data availability
3. Handle errors gracefully
4. Provide user-friendly messages
5. Use ANSI color codes for errors (red)

## ANSI Color Codes

- `\x1b[1;32m` - Bold green (success)
- `\x1b[1;31m` - Bold red (error)
- `\x1b[1;33m` - Bold yellow (warning)
- `\x1b[1;36m` - Bold cyan (info)
- `\x1b[1;30m` - Bold black (subtle)
- `\x1b[0m` - Reset

