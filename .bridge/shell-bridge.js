#!/usr/bin/env node

/**
 * Shell Bridge Server
 * Connects browser terminal to local system via WebSocket
 * 
 * SECURITY WARNING: Only run on localhost! Never expose to internet!
 */

const WebSocket = require('ws');
const { spawn } = require('child_process');
const os = require('os');

const PORT = process.env.SHELL_BRIDGE_PORT || 8765;
const AUTH_TOKEN = process.env.SHELL_BRIDGE_TOKEN || null;

const wss = new WebSocket.Server({ port: PORT });

console.log(`🚀 Shell Bridge Server started on ws://localhost:${PORT}`);
console.log(`⚠️  WARNING: Only accessible from localhost for security`);
if (AUTH_TOKEN) {
    console.log(`🔒 Authentication enabled`);
}

wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;

    // Security: Only allow localhost
    if (!clientIp.includes('127.0.0.1') && !clientIp.includes('::1') && !clientIp.includes('localhost')) {
        console.log(`❌ Rejected connection from ${clientIp}`);
        ws.close();
        return;
    }

    console.log(`✓ Client connected from ${clientIp}`);

    let shell = null;
    const shellType = process.platform === 'win32' ? 'powershell.exe' : process.env.SHELL || '/bin/zsh';

    // Spawn shell process
    shell = spawn(shellType, [], {
        cwd: os.homedir(),
        env: process.env
    });

    // Send shell output to browser
    shell.stdout.on('data', (data) => {
        ws.send(JSON.stringify({
            output: data.toString()
        }));
    });

    shell.stderr.on('data', (data) => {
        ws.send(JSON.stringify({
            output: `\x1b[1;31m${data.toString()}\x1b[0m`
        }));
    });

    shell.on('close', () => {
        ws.close();
    });

    // Receive commands from browser
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            // Check auth token if enabled
            if (AUTH_TOKEN && data.token !== AUTH_TOKEN) {
                ws.send(JSON.stringify({
                    output: '\x1b[1;31mAuthentication failed\x1b[0m\r\n'
                }));
                ws.close();
                return;
            }

            if (data.command) {
                shell.stdin.write(data.command + '\n');
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('✗ Client disconnected');
        if (shell) {
            shell.kill();
        }
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down Shell Bridge Server...');
    wss.close(() => {
        process.exit(0);
    });
});
