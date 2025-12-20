class BootSequence {
    constructor(terminal, onComplete) {
        this.terminal = terminal;
        this.onComplete = onComplete;
        this.skipped = false;

        // BIOS Information
        this.biosInfo = [
            'OYI-BIOS (C) 2025 DeepMind Tech.',
            'Bios Version 1.0.4 Build 20251221',
            'CPU: Neural Quantum Processor @ 4.5GHz',
            '64GB RAM System 533MHz',
            'Keyboard ..... Detected',
            'Mouse ...... Detected',
            'Hard Disk .. Detected (512TB Neural Storage)',
        ];

        // Bind escape key to skip
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.skipped) {
                this.skip();
            }
        });
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
        await this.typeText('ESC to skip boot', 5);
        this.terminal.write('\r\n');

        const checks = [
            'Memory', 'Video', 'Storage', 'Drivers'
        ];

        for (const check of checks) {
            this.terminal.write(`Checking ${check.padEnd(10)}`);
            for (let i = 0; i < 3; i++) {
                if (this.skipped) return;
                this.terminal.write('.');
                await this.wait(100);
            }
            this.terminal.write(' \x1b[1;32mOK\x1b[0m\r\n');
        }

        await this.wait(500);
    }

    async runBootLoader() {
        this.terminal.clear();
        const width = this.terminal.cols || 60;

        const bootMenu = [
            '\x1b[1;37m GNU GRUB v2.06\x1b[0m',
            '+' + '-'.repeat(width - 4) + '+',
            '| \x1b[1;30;47m* OyiOS (Kernel 5.15) ' + ' '.repeat(Math.max(0, width - 26)) + '\x1b[0m |',
            '|   OyiOS (Recovery)    ' + ' '.repeat(Math.max(0, width - 26)) + ' |',
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
        ];

        for (const log of logs) {
            if (this.skipped) return;
            this.terminal.write(`[${(Math.random() * 2).toFixed(6)}] ${log}\r\n`);
            await this.wait(Math.random() * 50 + 20);
        }

        const width = this.terminal.cols || 60;
        this.terminal.write('\r\n\x1b[1;36mInitializing Profile\x1b[0m\r\n');

        const barWidth = Math.min(width - 10, 30);
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
    }
}
