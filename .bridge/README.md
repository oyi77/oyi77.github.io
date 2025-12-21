# Shell Bridge Server

Optional WebSocket bridge for connecting browser terminal to your local system.

## ⚠️ Security Warning

**CRITICAL**: This bridge gives browser access to your terminal. Only use on localhost!

- ✅ Safe: Running on `localhost` only
- ❌ NEVER expose to public internet
- ❌ NEVER run on production server
- ✅ Use authentication token in production

## Installation

### Option 1: Direct Run (Recommended for Testing)

```bash
cd .bridge
node shell-bridge.js
```

### Option 2: Global Install (Future)

```bash
# Not yet published - for reference only
npm install -g @oyi77/shell-bridge
shell-bridge start
```

## Configuration

### Environment Variables

```bash
# Port (default: 8765)
export SHELL_BRIDGE_PORT=8765

# Authentication token (optional but recommended)
export SHELL_BRIDGE_TOKEN=your-secret-token-here
```

### With Authentication

```bash
SHELL_BRIDGE_TOKEN=mysecret123 node shell-bridge.js
```

Then in browser console:
```javascript
localStorage.setItem('shell-bridge-token', 'mysecret123');
```

## Usage

1. **Start the bridge server:**
   ```bash
   node .bridge/shell-bridge.js
   ```

2. **In your browser terminal:**
   ```bash
   shell
   ```

3. **To disconnect:**
   ```bash
   exit
   ```

## Features

- ✅ Real-time command execution
- ✅ Full terminal access (zsh/bash/powershell)
- ✅ Localhost-only security
- ✅ Optional authentication
- ✅ Automatic fallback to simulation mode

## Troubleshooting

### Connection Failed

1. Check bridge server is running
2. Verify port 8765 is not blocked
3. Check browser console for errors

### Commands Not Working

1. Ensure shell process spawned correctly
2. Check server logs
3. Try restarting bridge server

## Development

### Dependencies

```bash
npm install ws
```

### Testing

```bash
# Terminal 1: Start bridge
node shell-bridge.js

# Terminal 2: Test with wscat
npm install -g wscat
wscat -c ws://localhost:8765
```

## License

MIT - Use at your own risk
