class ShellApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
        this.shellActive = false;
        this.shellPath = '/Users/paijo';
        this.shellUser = 'paijo';
        this.shellHost = 'MacBook-Pro';
        this.ws = null;
        this.shellMode = 'simulated';
    }

    async run(args) {
        const width = this.terminal.cols || 60;

        // Handle help flag
        if (args.includes('-h') || args.includes('--help')) {
            this.showHelp();
            return;
        }

        // Handle install flag
        if (args.includes('install')) {
            this.showInstallGuide();
            return;
        }

        // Try to connect to bridge server
        const bridgeUrl = localStorage.getItem('shell-bridge-url') || 'ws://localhost:8765';

        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36m╔═══════════════════════════════════════╗\x1b[0m', width) + '\r\n');
        this.terminal.write(TerminalUtils.center('\x1b[1;36m║      LOCAL SHELL CONNECTION           ║\x1b[0m', width) + '\r\n');
        this.terminal.write(TerminalUtils.center('\x1b[1;36m╚═══════════════════════════════════════╝\x1b[0m', width) + '\r\n\r\n');

        this.terminal.write('  \x1b[1;33mAttempting connection...\x1b[0m\r\n');
        this.terminal.write(`  Bridge URL: ${bridgeUrl}\r\n\r\n`);

        try {
            await this.connectToBridge(bridgeUrl);
        } catch (error) {
            this.terminal.write('  \x1b[1;31m✗ Connection failed\x1b[0m\r\n');
            this.terminal.write(`  Error: ${error.message}\r\n\r\n`);
            this.terminal.write('  \x1b[1;33m💡 Bridge server not running?\x1b[0m\r\n');
            this.terminal.write('  Run: \x1b[1;32mshell install\x1b[0m for setup instructions\r\n');
            this.terminal.write('  Run: \x1b[1;32mshell --help\x1b[0m for more options\r\n\r\n');

            // Fallback to simulation mode
            this.terminal.write('  \x1b[1;36mℹ Falling back to simulation mode...\x1b[0m\r\n\r\n');
            await this.wait(500);
            this.startSimulatedShell();
        }
    }

    async connectToBridge(url) {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(url);

            ws.onopen = () => {
                this.ws = ws;
                this.terminal.write('  \x1b[1;32m✓ Connected to local system!\x1b[0m\r\n');
                this.terminal.write(`  \x1b[1;32m✓ Real shell access enabled\x1b[0m\r\n\r\n`);
                this.terminal.write('  \x1b[1;30mType "exit" to disconnect\x1b[0m\r\n');
                this.startRealShell();
                resolve();
            };

            ws.onerror = () => {
                reject(new Error('WebSocket connection failed'));
            };

            ws.onclose = () => {
                if (this.shellActive) {
                    this.terminal.write('\r\n\r\n\x1b[1;31m✗ Connection lost\x1b[0m\r\n');
                    this.exitShell();
                }
            };

            // Timeout after 2 seconds
            setTimeout(() => {
                if (ws.readyState !== WebSocket.OPEN) {
                    ws.close();
                    reject(new Error('Connection timeout'));
                }
            }, 2000);
        });
    }

    startRealShell() {
        this.shellActive = true;
        this.shellMode = 'real';
        this.os.shellMode = true;

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.output) {
                this.terminal.write(data.output);
            }
        };

        this.os.shellCallback = async (input) => {
            if (input.trim().toLowerCase() === 'exit') {
                this.ws.close();
                this.exitShell();
                return;
            }
            this.ws.send(JSON.stringify({ command: input }));
        };
    }

    startSimulatedShell() {
        this.shellActive = true;
        this.shellMode = 'simulated';
        this.os.shellMode = true;

        this.terminal.write('  \x1b[1;33m⚠ SIMULATION MODE\x1b[0m\r\n');
        this.terminal.write('  Safe, browser-only shell for demonstration.\r\n\r\n');
        this.terminal.write('  \x1b[1;30mSupported: ls, pwd, whoami, uname, date, exit\x1b[0m\r\n');

        this.os.shellCallback = async (input) => {
            await this.handleShellCommand(input.trim());
        };
        this.showShellPrompt();
    }

    showHelp() {
        this.terminal.write('\r\n\x1b[1;36m╔═══════════════════════════════════════╗\x1b[0m\r\n');
        this.terminal.write('\x1b[1;36m║        SHELL COMMAND HELP             ║\x1b[0m\r\n');
        this.terminal.write('\x1b[1;36m╚═══════════════════════════════════════╝\x1b[0m\r\n\r\n');

        this.terminal.write('  \x1b[1;33mUSAGE:\x1b[0m\r\n');
        this.terminal.write('    shell              - Connect to local system (or simulate)\r\n');
        this.terminal.write('    shell install      - Show bridge installation guide\r\n');
        this.terminal.write('    shell --help       - Show this help\r\n\r\n');

        this.terminal.write('  \x1b[1;33mMODES:\x1b[0m\r\n');
        this.terminal.write('    \x1b[1;32mReal Mode:\x1b[0m      Connects via WebSocket bridge to your Mac\r\n');
        this.terminal.write('    \x1b[1;33mSimulation:\x1b[0m     Safe, browser-only fake shell (fallback)\r\n\r\n');

        this.terminal.write('  \x1b[1;33mCONFIGURATION:\x1b[0m\r\n');
        this.terminal.write('    Default bridge: ws://localhost:8765\r\n');
        this.terminal.write('    To change: localStorage.setItem(\'shell-bridge-url\', \'ws://...\');\r\n\r\n');
    }

    showInstallGuide() {
        this.terminal.write('\r\n\x1b[1;36m╔═══════════════════════════════════════╗\x1b[0m\r\n');
        this.terminal.write('\x1b[1;36m║    SHELL BRIDGE INSTALLATION GUIDE    ║\x1b[0m\r\n');
        this.terminal.write('\x1b[1;36m╚═══════════════════════════════════════╝\x1b[0m\r\n\r\n');

        this.terminal.write('  \x1b[1;33m📦 STEP 1: Install Dependencies\x1b[0m\r\n');
        this.terminal.write('  cd .bridge && npm install\r\n\r\n');

        this.terminal.write('  \x1b[1;33m🚀 STEP 2: Start Bridge Server\x1b[0m\r\n');
        this.terminal.write('  node .bridge/shell-bridge.js\r\n\r\n');

        this.terminal.write('  \x1b[1;33m🔗 STEP 3: Connect from Browser\x1b[0m\r\n');
        this.terminal.write('  Type: \x1b[1;32mshell\x1b[0m\r\n\r\n');

        this.terminal.write('  \x1b[1;31m⚠️  SECURITY WARNING:\x1b[0m\r\n');
        this.terminal.write('  • Only run bridge on localhost\r\n');
        this.terminal.write('  • Never expose to public internet\r\n');
        this.terminal.write('  • Use authentication token (optional)\r\n\r\n');

        this.terminal.write('  \x1b[1;36m📚 DOCUMENTATION:\x1b[0m\r\n');
        this.terminal.write('  See: .bridge/README.md\r\n\r\n');
    }

    showShellPrompt() {
        const path = this.shellPath.replace(`/Users/${this.shellUser}`, '~');
        this.terminal.write(`\r\n\x1b[1;32m${this.shellUser}@${this.shellHost}\x1b[0m:\x1b[1;34m${path}\x1b[0m$ `);
    }

    async handleShellCommand(input) {
        if (!input) {
            this.showShellPrompt();
            return;
        }

        const [cmd, ...args] = input.split(/\s+/);

        switch (cmd.toLowerCase()) {
            case 'ls':
                await this.cmdLs(args);
                break;
            case 'pwd':
                this.cmdPwd();
                break;
            case 'whoami':
                this.cmdWhoami();
                break;
            case 'uname':
                this.cmdUname(args);
                break;
            case 'date':
                this.cmdDate();
                break;
            case 'hostname':
                this.cmdHostname();
                break;
            case 'uptime':
                this.cmdUptime();
                break;
            case 'echo':
                this.cmdEcho(args);
                break;
            case 'clear':
                this.terminal.clear();
                break;
            case 'exit':
                this.exitShell();
                return;
            case 'help':
                this.cmdHelp();
                break;
            default:
                this.terminal.write(`\r\n\x1b[1;31m${cmd}: command not found\x1b[0m`);
                this.terminal.write('\r\nType "help" for available commands.');
        }

        this.showShellPrompt();
    }

    async cmdLs(args) {
        this.terminal.write('\r\n');
        const files = [
            'Desktop', 'Documents', 'Downloads', 'Pictures',
            'Music', 'Videos', 'Applications', '.bashrc',
            '.zshrc', 'oyi77.github.io'
        ];

        if (args.includes('-la') || args.includes('-l')) {
            files.forEach(file => {
                const isDir = !file.startsWith('.');
                const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
                const size = Math.floor(Math.random() * 10000);
                const date = 'Dec 21 12:00';
                this.terminal.write(`${perms}  1 ${this.shellUser}  staff  ${size.toString().padStart(6)}  ${date}  \x1b[1;34m${file}\x1b[0m\r\n`);
            });
        } else {
            const cols = 4;
            for (let i = 0; i < files.length; i += cols) {
                const row = files.slice(i, i + cols);
                this.terminal.write(row.map(f => `\x1b[1;34m${f.padEnd(20)}\x1b[0m`).join('') + '\r\n');
            }
        }
    }

    cmdPwd() {
        this.terminal.write(`\r\n${this.shellPath}`);
    }

    cmdWhoami() {
        this.terminal.write(`\r\n${this.shellUser}`);
    }

    cmdUname(args) {
        if (args.includes('-a')) {
            this.terminal.write('\r\nDarwin MacBook-Pro.local 23.1.0 Darwin Kernel Version 23.1.0 x86_64');
        } else {
            this.terminal.write('\r\nDarwin');
        }
    }

    cmdDate() {
        const now = new Date();
        this.terminal.write(`\r\n${now.toString()}`);
    }

    cmdHostname() {
        this.terminal.write(`\r\n${this.shellHost}.local`);
    }

    cmdUptime() {
        const uptime = Math.floor(Math.random() * 100000);
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const mins = Math.floor((uptime % 3600) / 60);
        this.terminal.write(`\r\n${days} days, ${hours}:${mins.toString().padStart(2, '0')}`);
    }

    cmdEcho(args) {
        this.terminal.write('\r\n' + args.join(' '));
    }

    cmdHelp() {
        this.terminal.write('\r\n\x1b[1;33mSimulated Local Shell Commands:\x1b[0m');
        this.terminal.write('\r\n  ls [-la]    - List directory contents');
        this.terminal.write('\r\n  pwd         - Print working directory');
        this.terminal.write('\r\n  whoami      - Print current user');
        this.terminal.write('\r\n  uname [-a]  - Print system information');
        this.terminal.write('\r\n  date        - Print current date/time');
        this.terminal.write('\r\n  hostname    - Print hostname');
        this.terminal.write('\r\n  uptime      - Print system uptime');
        this.terminal.write('\r\n  echo <text> - Print text');
        this.terminal.write('\r\n  clear       - Clear screen');
        this.terminal.write('\r\n  exit        - Exit shell and return to TerminalOS');
    }

    exitShell() {
        this.shellActive = false;
        this.os.shellMode = false;
        this.os.shellCallback = null;

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        this.terminal.write('\r\n\r\n\x1b[1;32m✓ Disconnected from shell\x1b[0m');
        this.terminal.write('\r\n\x1b[1;32m✓ Returned to TerminalOS\x1b[0m\r\n');
        this.os.prompt();
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.ShellApp = ShellApp;
