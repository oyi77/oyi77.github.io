# Adding New Commands

## Step-by-Step Guide

### 1. Create App File

Create `assets/js/terminal/apps/command-name.js`:

```javascript
class CommandNameApp {
  constructor(terminal, filesystem, windowManager, os) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
    this.os = os;
  }

  async run(args) {
    const width = this.terminal.cols || 60;
    
    // Command implementation
    this.terminal.write('\r\n\x1b[1;36mCommand Output\x1b[0m\r\n');
    
    // Handle arguments
    if (args.length === 0) {
      this.terminal.write('Usage: command-name [options]\r\n');
      return;
    }
    
    // Process command
    // ...
  }
}

window.CommandNameApp = CommandNameApp;
```

### 2. Register in core.js

#### Add to Switch Statement

```javascript
case 'command-name':
case 'cmd':  // Optional alias
  await this.runCommand('command-name', args);
  break;
```

#### Add to appMap

```javascript
const appMap = {
  // ... existing commands
  'command-name': CommandNameApp,
};
```

### 3. Add to Tab Completion

```javascript
const commands = [
  // ... existing commands
  'command-name',
];
```

### 4. Update Help

Edit `assets/js/terminal/apps/help.js`:

```javascript
const core = [
  // ... existing commands
  { cmd: 'command-name', desc: 'Description of command' },
];
```

### 5. Load Script

Add to `_layouts/terminal.html`:

```html
<script src="{{ '/assets/js/terminal/apps/command-name.js' | relative_url }}"></script>
```

## Command Patterns

### Simple Command

```javascript
async run(args) {
  this.terminal.write('\r\nHello from command!\r\n');
}
```

### Command with Arguments

```javascript
async run(args) {
  if (args.length === 0) {
    this.terminal.write('\x1b[1;31mError: Missing argument\x1b[0m\r\n');
    return;
  }
  
  const arg = args[0];
  // Process argument
}
```

### Command with Filesystem Access

```javascript
async run(args) {
  const path = args[0] || this.os.currentPath;
  const resolvedPath = this.filesystem.resolvePath(this.os.currentPath, path);
  
  if (!this.filesystem.exists(resolvedPath)) {
    this.terminal.write(`\x1b[1;31mError: Path not found\x1b[0m\r\n`);
    return;
  }
  
  // Use filesystem
}
```

### Command with Jekyll Data

```javascript
async run(args) {
  const data = window.JEKYLL_DATA?.terminal;
  if (!data) {
    this.terminal.write('\x1b[1;31mError: Data not available\x1b[0m\r\n');
    return;
  }
  
  // Use data
}
```

### Async Command with API

```javascript
async run(args) {
  try {
    this.terminal.write('\r\n\x1b[1;33mLoading...\x1b[0m\r\n');
    
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    
    // Process and display data
    this.terminal.write(`\x1b[1;32mData loaded\x1b[0m\r\n`);
  } catch (error) {
    this.terminal.write(`\x1b[1;31mError: ${error.message}\x1b[0m\r\n`);
  }
}
```

## Best Practices

1. **Error Handling**: Always validate inputs and handle errors
2. **User Feedback**: Provide clear messages for all operations
3. **ANSI Colors**: Use consistent color coding
4. **Width Awareness**: Use `this.terminal.cols` for responsive output
5. **Async Operations**: Use async/await for I/O operations
6. **Documentation**: Update help and docs when adding commands

## Testing Your Command

1. Load terminal in browser
2. Type command name
3. Test with various arguments
4. Test error cases
5. Verify tab completion works
6. Check help documentation

## Examples

See existing commands in `assets/js/terminal/apps/` for reference:
- `whoami.js` - Simple data display
- `companies.js` - Complex data with navigation
- `repos.js` - API integration
- `hack.js` - Interactive game
- `opm.js` - Complex command with subcommands

