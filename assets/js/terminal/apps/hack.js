class HackApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
        this.stage = 0;
        this.hints = 0;
        this.startTime = null;
    }

    async run(args) {
        const width = this.terminal.cols || 60;

        // Check if already root
        if (this.os.isRoot) {
            this.terminal.write('\r\n\x1b[1;32m✓ You already have root access!\x1b[0m\r\n');
            this.terminal.write('Type \x1b[1;33mwhoami\x1b[0m to verify your privileges.\r\n\r\n');
            return;
        }

        this.startTime = Date.now();
        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;31m╔═══════════════════════════════════════╗\x1b[0m', width) + '\r\n');
        this.terminal.write(TerminalUtils.center('\x1b[1;31m║   PRIVILEGE ESCALATION CTF CHALLENGE   ║\x1b[0m', width) + '\r\n');
        this.terminal.write(TerminalUtils.center('\x1b[1;31m╚═══════════════════════════════════════╝\x1b[0m', width) + '\r\n\r\n');

        this.terminal.write('  \x1b[1;33mObjective:\x1b[0m Gain root access through 4 realistic CTF challenges\r\n');
        this.terminal.write('  \x1b[1;33mReward:\x1b[0m Root access + Hacker theme unlock\r\n');
        this.terminal.write('  \x1b[1;30mType "hint" at any stage for help\x1b[0m\r\n\r\n');

        await this.wait(1000);
        await this.stage1_NetworkRecon();
    }

    async stage1_NetworkRecon() {
        this.stage = 1;
        const width = this.terminal.cols || 60;

        this.terminal.write('\r\n\x1b[1;36m╔═══ STAGE 1/4: NETWORK RECONNAISSANCE ═══╗\x1b[0m\r\n');
        this.terminal.write('  \x1b[1;33mScenario:\x1b[0m You discovered an open port on the target system\r\n');
        this.terminal.write('  \x1b[1;33mTask:\x1b[0m Identify the service running on port 31337\r\n\r\n');

        this.terminal.write('  \x1b[1;32mPort Scan Results:\x1b[0m\r\n');
        this.terminal.write('  22/tcp   open  ssh\r\n');
        this.terminal.write('  80/tcp   open  http\r\n');
        this.terminal.write('  443/tcp  open  https\r\n');
        this.terminal.write('  \x1b[1;33m31337/tcp open  ?????\x1b[0m\r\n\r\n');

        this.terminal.write('  \x1b[1;30mBanner from port 31337:\x1b[0m\r\n');
        this.terminal.write('  \x1b[1;32m"Welcome to the Elite Service v1.0"\x1b[0m\r\n');
        this.terminal.write('  \x1b[1;32m"Service: E-L-I-T-E"\x1b[0m\r\n\r\n');

        this.terminal.write('  \x1b[1;33mEnter the service name:\x1b[0m ');

        this.os.hackStage = 1;
        this.os.hackCallback = async (input) => {
            const cmd = input.trim().toLowerCase();

            if (cmd === 'elite' || cmd === 'e-l-i-t-e') {
                this.terminal.write('\r\n  \x1b[1;32m✓ Correct! Service identified: ELITE\x1b[0m\r\n');
                await this.wait(500);
                this.os.hackStage = 2;
                await this.stage2_SQLInjection();
            } else if (cmd === 'hint') {
                this.hints++;
                this.terminal.write('\r\n  \x1b[1;33m💡 Hint: Look at the banner message. The service name is spelled out.\x1b[0m\r\n\r\n');
            } else {
                this.terminal.write('\r\n  \x1b[1;31m✗ Incorrect. Analyze the banner carefully.\x1b[0m\r\n\r\n');
            }
        };
    }

    async stage2_SQLInjection() {
        this.stage = 2;

        this.terminal.write('\r\n\x1b[1;36m╔═══ STAGE 2/4: SQL INJECTION ═══╗\x1b[0m\r\n');
        this.terminal.write('  \x1b[1;33mScenario:\x1b[0m Found a login form vulnerable to SQL injection\r\n');
        this.terminal.write('  \x1b[1;33mTask:\x1b[0m Bypass authentication using SQL injection\r\n\r\n');

        this.terminal.write('  \x1b[1;32mLogin Form:\x1b[0m\r\n');
        this.terminal.write('  Username: admin\r\n');
        this.terminal.write('  Password: [REQUIRED]\r\n\r\n');

        this.terminal.write('  \x1b[1;30mSQL Query (visible in debug mode):\x1b[0m\r\n');
        this.terminal.write('  \x1b[1;30mSELECT * FROM users WHERE username=\'admin\' AND password=\'[INPUT]\'\x1b[0m\r\n\r\n');

        this.terminal.write('  \x1b[1;33mEnter SQL injection payload:\x1b[0m ');

        this.os.hackCallback = async (input) => {
            const cmd = input.trim().toLowerCase();

            // Accept common SQL injection payloads
            if (cmd.includes("' or '1'='1") || cmd.includes("' or 1=1") ||
                cmd.includes("admin' --") || cmd.includes("' or 'a'='a")) {
                this.terminal.write('\r\n  \x1b[1;32m✓ Authentication bypassed! SQL injection successful!\x1b[0m\r\n');
                this.terminal.write('  \x1b[1;32mLogged in as: admin\x1b[0m\r\n');
                await this.wait(500);
                this.os.hackStage = 3;
                await this.stage3_BufferOverflow();
            } else if (cmd === 'hint') {
                this.hints++;
                this.terminal.write('\r\n  \x1b[1;33m💡 Hint: Try making the WHERE clause always true. Use: \' or \'1\'=\'1\x1b[0m\r\n\r\n');
            } else {
                this.terminal.write('\r\n  \x1b[1;31m✗ Invalid payload. Think about making the condition always true.\x1b[0m\r\n\r\n');
            }
        };
    }

    async stage3_BufferOverflow() {
        this.stage = 3;

        this.terminal.write('\r\n\x1b[1;36m╔═══ STAGE 3/4: BUFFER OVERFLOW ═══╗\x1b[0m\r\n');
        this.terminal.write('  \x1b[1;33mScenario:\x1b[0m Found a vulnerable binary with buffer overflow\r\n');
        this.terminal.write('  \x1b[1;33mTask:\x1b[0m Calculate the return address to exploit\r\n\r\n');

        this.terminal.write('  \x1b[1;32mMemory Layout:\x1b[0m\r\n');
        this.terminal.write('  Buffer:        0xbffff700 (64 bytes)\r\n');
        this.terminal.write('  Saved EBP:     0xbffff740\r\n');
        this.terminal.write('  Return Addr:   0xbffff744\r\n');
        this.terminal.write('  Shell Code:    \x1b[1;33m0xbffff800\x1b[0m\r\n\r\n');

        this.terminal.write('  \x1b[1;30mTo exploit: Overwrite return address with shellcode location\x1b[0m\r\n\r\n');

        this.terminal.write('  \x1b[1;33mEnter the shellcode address (format: 0xbffff800):\x1b[0m ');

        this.os.hackCallback = async (input) => {
            const cmd = input.trim().toLowerCase();

            if (cmd === '0xbffff800' || cmd === 'bffff800') {
                this.terminal.write('\r\n  \x1b[1;32m✓ Exploit successful! Shell spawned!\x1b[0m\r\n');
                this.terminal.write('  \x1b[1;32mGained shell access as user "hacker"\x1b[0m\r\n');
                await this.wait(500);
                this.os.hackStage = 4;
                await this.stage4_PrivilegeEscalation();
            } else if (cmd === 'hint') {
                this.hints++;
                this.terminal.write('\r\n  \x1b[1;33m💡 Hint: The shellcode is at 0xbffff800. Enter this address.\x1b[0m\r\n\r\n');
            } else {
                this.terminal.write('\r\n  \x1b[1;31m✗ Wrong address. Check the memory layout.\x1b[0m\r\n\r\n');
            }
        };
    }

    async stage4_PrivilegeEscalation() {
        this.stage = 4;

        this.terminal.write('\r\n\x1b[1;36m╔═══ STAGE 4/4: PRIVILEGE ESCALATION ═══╗\x1b[0m\r\n');
        this.terminal.write('  \x1b[1;33mScenario:\x1b[0m Found SUID binary with sudo misconfiguration\r\n');
        this.terminal.write('  \x1b[1;33mTask:\x1b[0m Execute the privilege escalation command\r\n\r\n');

        this.terminal.write('  \x1b[1;32mSUID Binary Found:\x1b[0m /usr/bin/sudo-legacy\r\n');
        this.terminal.write('  \x1b[1;32mVulnerability:\x1b[0m CVE-2021-3156 (Baron Samedit)\r\n\r\n');

        this.terminal.write('  \x1b[1;30mExploit command format:\x1b[0m\r\n');
        this.terminal.write('  \x1b[1;30msudo -u#-1 /bin/bash\x1b[0m\r\n\r\n');

        this.terminal.write('  \x1b[1;33mEnter the privilege escalation command:\x1b[0m ');

        this.os.hackCallback = async (input) => {
            const cmd = input.trim().toLowerCase();

            if (cmd.includes('sudo') && (cmd.includes('-u#-1') || cmd.includes('u#-1')) && cmd.includes('bash')) {
                await this.grantRootAccess();
            } else if (cmd === 'hint') {
                this.hints++;
                this.terminal.write('\r\n  \x1b[1;33m💡 Hint: Use: sudo -u#-1 /bin/bash\x1b[0m\r\n\r\n');
            } else {
                this.terminal.write('\r\n  \x1b[1;31m✗ Incorrect command. Check the exploit format.\x1b[0m\r\n\r\n');
            }
        };
    }

    async grantRootAccess() {
        const width = this.terminal.cols || 60;
        const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);

        this.terminal.write('\r\n\r\n');

        // Victory animation
        for (let i = 0; i < 3; i++) {
            this.terminal.write('\x1b[1;32m' + '█'.repeat(width) + '\x1b[0m\r\n');
            await this.wait(100);
        }

        this.terminal.write(TerminalUtils.center('\x1b[1;32m╔═══════════════════════════════════════╗\x1b[0m', width) + '\r\n');
        this.terminal.write(TerminalUtils.center('\x1b[1;32m║     ROOT ACCESS GRANTED - CTF PWNED    ║\x1b[0m', width) + '\r\n');
        this.terminal.write(TerminalUtils.center('\x1b[1;32m╚═══════════════════════════════════════╝\x1b[0m', width) + '\r\n\r\n');

        // Grant root access
        this.os.isRoot = true;
        this.os.currentUser = 'root';
        localStorage.setItem('root-access', 'true');

        // Switch to hacker theme
        if (this.os.themeManager && this.os.themeManager.setTheme) {
            this.os.themeManager.setTheme('hacker');
            localStorage.setItem('term-theme', 'hacker');
        }

        // Show stats
        this.terminal.write('  \x1b[1;33m🏆 CTF COMPLETION STATS:\x1b[0m\r\n');
        this.terminal.write(`  Time: ${elapsedTime}s\r\n`);
        this.terminal.write(`  Hints Used: ${this.hints}\r\n`);
        this.terminal.write(`  Score: ${this.calculateScore(elapsedTime, this.hints)}/100\r\n\r\n`);

        this.terminal.write('  \x1b[1;32m✓ Root privileges activated\x1b[0m\r\n');
        this.terminal.write('  \x1b[1;32m✓ Hacker theme enabled\x1b[0m\r\n');
        this.terminal.write('  \x1b[1;32m✓ Prompt updated to root@oyi-os\x1b[0m\r\n\r\n');

        this.terminal.write('  \x1b[1;36m💡 Fun Fact:\x1b[0m "Oyi" is Javanese slang for "Iyo" (Yes)\r\n');
        this.terminal.write('  \x1b[1;30mReload the page to see your new hacker theme!\x1b[0m\r\n\r\n');

        // Clear hack callback
        this.os.hackStage = 0;
        this.os.hackCallback = null;
    }

    calculateScore(time, hints) {
        let score = 100;
        score -= Math.min(time, 60); // -1 per second, max -60
        score -= hints * 10; // -10 per hint
        return Math.max(score, 0);
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.HackApp = HackApp;
