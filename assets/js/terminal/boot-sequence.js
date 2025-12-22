class BootSequence {
    constructor(terminal, onComplete) {
        this.terminal = terminal;
        this.onComplete = onComplete;
        this.skipped = false;
        this.recoveryMode = false;
        this.recoveryKeyPressed = false;
        this.postPhaseActive = false;

        // BIOS Information
        this.biosInfo = [
            'OYI-BIOS (C) 2025 DeepMind Tech.',
            'Bios Version 2.0.0 Build 20251221',
            'CPU: Neural Quantum Processor @ 4.5GHz',
            '64GB RAM System 533MHz',
            'Keyboard ..... Detected',
            'Mouse ...... Detected',
            'Hard Disk .. Detected (512TB Neural Storage)',
        ];

        // Bind keys
        this.keyHandler = (e) => {
            if (e.key === 'Escape' && !this.skipped) {
                this.skip();
            } else if (this.postPhaseActive && (e.key === 'r' || e.key === 'R' || e.key === 'F8')) {
                this.recoveryKeyPressed = true;
            }
        };
        window.addEventListener('keydown', this.keyHandler);
    }

    async start() {
        this.terminal.clear();

        // Phase 1: POST
        await this.runPOST();
        if (this.skipped) return;

        // Phase 2: Boot Loader
        await this.runBootLoader();
        if (this.skipped) return;

        // Phase 3: Kernel Init
        await this.runKernelInit();
        if (this.skipped) return;

        this.finish();
    }

    skip() {
        this.skipped = true;
        this.terminal.clear();
        this.finish();
    }

    finish() {
        // Clean up key handler
        window.removeEventListener('keydown', this.keyHandler);
        this.onComplete();
    }

    async typeText(text, delay = 20, newline = true) {
        if (this.skipped) return;

        for (let i = 0; i < text.length; i++) {
            if (this.skipped) return;
            this.terminal.write(text[i]);
            await this.wait(delay);
        }
        if (newline) this.terminal.write('\r\n');
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async runPOST() {
        this.terminal.clear();
        this.postPhaseActive = true;
        this.recoveryKeyPressed = false;

        const width = this.terminal.cols || 60;
        const logo = [
            '\x1b[33m' + '+'.padEnd(width - 1, '-') + '+',
            '|  ENERGY STAR Simulation' + ' '.repeat(Math.max(0, width - 26)) + '|',
            '+'.padEnd(width - 1, '-') + '+\x1b[0m',
            ''
        ];

        for (const line of logo) {
            this.terminal.write(line + '\r\n');
        }

        await this.wait(500);

        for (const line of this.biosInfo) {
            await this.typeText(line, 5);
        }

        this.terminal.write('\r\n');
        await this.typeText('ESC to skip boot | Press R or F8 for Recovery Mode', 5);
        this.terminal.write('\r\n');

        const checks = [
            'Memory', 'Video', 'Storage', 'Drivers'
        ];

        // Check for recovery key during POST checks
        for (const check of checks) {
            this.terminal.write(`Checking ${check.padEnd(10)}`);
            for (let i = 0; i < 3; i++) {
                if (this.skipped) {
                    this.postPhaseActive = false;
                    return;
                }
                if (this.recoveryKeyPressed) {
                    this.postPhaseActive = false;
                    await this.showRecoveryMenu();
                    return;
                }
                this.terminal.write('.');
                await this.wait(100);
            }
            this.terminal.write(' \x1b[1;32mOK\x1b[0m\r\n');
        }

        // Final check before proceeding
        if (this.recoveryKeyPressed) {
            this.postPhaseActive = false;
            await this.showRecoveryMenu();
            return;
        }

        this.postPhaseActive = false;
        await this.wait(500);
    }

    async showRecoveryMenu() {
        this.terminal.clear();
        const width = this.terminal.cols || 60;

        const menu = [
            '',
            '\x1b[1;33m╔═══════════════════════════════════════════════════════╗\x1b[0m',
            '\x1b[1;33m║\x1b[0m          \x1b[1;36mOYI-BIOS RECOVERY MODE\x1b[0m                    \x1b[1;33m║\x1b[0m',
            '\x1b[1;33m╠═══════════════════════════════════════════════════════╣\x1b[0m',
            '\x1b[1;33m║\x1b[0m                                                       \x1b[1;33m║\x1b[0m',
            '\x1b[1;33m║\x1b[0m  \x1b[1;32m[1]\x1b[0m Normal Boot (Default)                          \x1b[1;33m║\x1b[0m',
            '\x1b[1;33m║\x1b[0m  \x1b[1;32m[2]\x1b[0m Recovery Mode (System Diagnostics)            \x1b[1;33m║\x1b[0m',
            '\x1b[1;33m║\x1b[0m  \x1b[1;32m[3]\x1b[0m Safe Mode (Minimal Features)                  \x1b[1;33m║\x1b[0m',
            '\x1b[1;33m║\x1b[0m  \x1b[1;32m[4]\x1b[0m Developer Mode (Debug Info)                  \x1b[1;33m║\x1b[0m',
            '\x1b[1;33m║\x1b[0m                                                       \x1b[1;33m║\x1b[0m',
            '\x1b[1;33m╚═══════════════════════════════════════════════════════╝\x1b[0m',
            '',
            '\x1b[1;30mSelect option [1-4] (default: 1, auto-selects in 5 seconds)...\x1b[0m'
        ];

        for (const line of menu) {
            this.terminal.write(TerminalUtils.center(line, width) + '\r\n');
        }

        // Wait for user input or auto-select
        let selected = false;
        let selection = 1; // Default to normal boot

        const inputHandler = (e) => {
            if (e.key >= '1' && e.key <= '4') {
                selection = parseInt(e.key);
                selected = true;
                window.removeEventListener('keydown', inputHandler);
            } else if (e.key === 'Enter' && !selected) {
                selected = true;
                window.removeEventListener('keydown', inputHandler);
            }
        };

        window.addEventListener('keydown', inputHandler);

        // Auto-select after 5 seconds
        const autoSelect = setTimeout(() => {
            if (!selected) {
                selected = true;
                window.removeEventListener('keydown', inputHandler);
            }
        }, 5000);

        // Wait for selection
        while (!selected) {
            await this.wait(100);
        }

        clearTimeout(autoSelect);
        window.removeEventListener('keydown', inputHandler);

        // Process selection
        this.terminal.write(`\r\n\x1b[1;32mSelected: ${selection}\x1b[0m\r\n\r\n`);
        await this.wait(500);

        switch (selection) {
            case 2:
                this.recoveryMode = true;
                await this.runRecoveryMode();
                break;
            case 3:
                await this.runSafeMode();
                break;
            case 4:
                await this.runDeveloperMode();
                break;
            default:
                // Normal boot - continue
                break;
        }
    }

    async runRecoveryMode() {
        this.terminal.clear();
        const width = this.terminal.cols || 60;

        const diagnostics = [
            '\x1b[1;36m╔═══════════════════════════════════════════════════════╗\x1b[0m',
            '\x1b[1;36m║\x1b[0m          \x1b[1;33mSYSTEM DIAGNOSTICS\x1b[0m                          \x1b[1;36m║\x1b[0m',
            '\x1b[1;36m╠═══════════════════════════════════════════════════════╣\x1b[0m',
            '\x1b[1;36m║\x1b[0m                                                       \x1b[1;36m║\x1b[0m',
            '\x1b[1;36m║\x1b[0m  \x1b[1;32mSystem Status:\x1b[0m OPERATIONAL                          \x1b[1;36m║\x1b[0m',
            '\x1b[1;36m║\x1b[0m  \x1b[1;32mVirtual FS:\x1b[0m MOUNTED                                 \x1b[1;36m║\x1b[0m',
            '\x1b[1;36m║\x1b[0m  \x1b[1;32mJekyll Data:\x1b[0m LOADED                                 \x1b[1;36m║\x1b[0m',
            '\x1b[1;36m║\x1b[0m  \x1b[1;32mGitHub API:\x1b[0m READY                                   \x1b[1;36m║\x1b[0m',
            '\x1b[1;36m║\x1b[0m                                                       \x1b[1;36m║\x1b[0m',
            '\x1b[1;36m║\x1b[0m  \x1b[1;33mHidden Commands Available:\x1b[0m                           \x1b[1;36m║\x1b[0m',
            '\x1b[1;36m║\x1b[0m    - \x1b[1;32mrecovery-info\x1b[0m - Show recovery information       \x1b[1;36m║\x1b[0m',
            '\x1b[1;36m║\x1b[0m    - \x1b[1;32mdebug\x1b[0m - Enable debug mode                      \x1b[1;36m║\x1b[0m',
            '\x1b[1;36m║\x1b[0m    - \x1b[1;32msysinfo\x1b[0m - Detailed system information          \x1b[1;36m║\x1b[0m',
            '\x1b[1;36m║\x1b[0m                                                       \x1b[1;36m║\x1b[0m',
            '\x1b[1;36m╚═══════════════════════════════════════════════════════╝\x1b[0m',
            '',
            '\x1b[1;30mRecovery mode enabled. Hidden commands are now available.\x1b[0m',
            '\x1b[1;30mContinuing to normal boot...\x1b[0m'
        ];

        for (const line of diagnostics) {
            this.terminal.write(TerminalUtils.center(line, width) + '\r\n');
        }

        await this.wait(2000);
        // Store recovery mode state
        if (window.terminalOS) {
            window.terminalOS.recoveryMode = true;
        }
    }

    async runSafeMode() {
        this.terminal.clear();
        const width = this.terminal.cols || 60;

        this.terminal.write(TerminalUtils.center('\x1b[1;33mSAFE MODE ENABLED\x1b[0m', width) + '\r\n');
        this.terminal.write(TerminalUtils.center('\x1b[1;30mMinimal features loaded for stability\x1b[0m', width) + '\r\n\r\n');
        await this.wait(1500);
    }

    async runDeveloperMode() {
        this.terminal.clear();
        const width = this.terminal.cols || 60;

        const debugInfo = [
            '\x1b[1;35m╔═══════════════════════════════════════════════════════╗\x1b[0m',
            '\x1b[1;35m║\x1b[0m            \x1b[1;33mDEVELOPER MODE\x1b[0m                            \x1b[1;35m║\x1b[0m',
            '\x1b[1;35m╠═══════════════════════════════════════════════════════╣\x1b[0m',
            '\x1b[1;35m║\x1b[0m                                                       \x1b[1;35m║\x1b[0m',
            '\x1b[1;35m║\x1b[0m  \x1b[1;32mDebug Mode:\x1b[0m ENABLED                                  \x1b[1;35m║\x1b[0m',
            '\x1b[1;35m║\x1b[0m  \x1b[1;32mConsole Logging:\x1b[0m VERBOSE                            \x1b[1;35m║\x1b[0m',
            '\x1b[1;35m║\x1b[0m  \x1b[1;32mPerformance Metrics:\x1b[0m TRACKING                         \x1b[1;35m║\x1b[0m',
            '\x1b[1;35m║\x1b[0m                                                       \x1b[1;35m║\x1b[0m',
            '\x1b[1;35m╚═══════════════════════════════════════════════════════╝\x1b[0m'
        ];

        for (const line of debugInfo) {
            this.terminal.write(TerminalUtils.center(line, width) + '\r\n');
        }

        await this.wait(1500);
        // Store developer mode state
        if (window.terminalOS) {
            window.terminalOS.developerMode = true;
        }
    }

    async runBootLoader() {
        this.terminal.clear();
        const width = this.terminal.cols || 60;

        const bootMenu = [
            '\x1b[1;37m GNU GRUB v2.06\x1b[0m',
            '+' + '-'.repeat(width - 4) + '+',
            '| \x1b[1;30;47m* OyiOS v2.0 (Jekyll Core) ' + ' '.repeat(Math.max(0, width - 29)) + '\x1b[0m |',
            '|   OyiOS (Recovery Mode)   ' + ' '.repeat(Math.max(0, width - 29)) + ' |',
            '+' + '-'.repeat(width - 4) + '+',
            '',
            'Booting in '
        ];

        for (const line of bootMenu) {
            this.terminal.write(line + '\r\n');
        }

        for (let i = 2; i > 0; i--) {
            this.terminal.write(`${i}... `);
            await this.wait(500);
        }
    }

    async runKernelInit() {
        this.terminal.clear();

        const logs = [
            'Init cgroup subsys cpuset',
            'Linux version 5.15.0-76',
            'KERNEL supported cpus: Intel, AMD',
            'BIOS-e820: usable',
            '\x1b[1;32m[ OK ]\x1b[0m Local File Systems.',
            '\x1b[1;32m[ OK ]\x1b[0m Network Manager.',
            '\x1b[1;32m[ OK ]\x1b[0m Login Prompts.',
            '\x1b[1;32m[ OK ]\x1b[0m Neural Link Interface.',
            '\x1b[1;32m[ OK ]\x1b[0m Auth User: \x1b[1;33mOyi77\x1b[0m',
            '\x1b[1;32m[ OK ]\x1b[0m Mounting _data as VirtualFS...',
            '\x1b[1;32m[ OK ]\x1b[0m Starting GitHub API Service...',
        ];

        for (const log of logs) {
            if (this.skipped) return;
            this.terminal.write(`[${(Math.random() * 2).toFixed(6)}] ${log}\r\n`);
            await this.wait(Math.random() * 50 + 20);
        }

        const width = this.terminal.cols || 60;
        this.terminal.write('\r\n\x1b[1;36mInitializing Profile\x1b[0m\r\n');

        // Make progress bar responsive to terminal width
        const barWidth = Math.min(Math.max(width - 20, 20), 50);
        this.terminal.write('[');
        for (let i = 0; i < barWidth; i++) {
            if (this.skipped) return;
            this.terminal.write('#');
            await this.wait(20);
        }
        this.terminal.write('] 100%\r\n');

        await this.wait(300);
        this.terminal.write('\x1b[1;32mACCESS GRANTED\x1b[0m\r\n');
        await this.wait(500);
        
        // Clear kernel initialization logs after boot completes
        this.terminal.clear();
    }
}
