class NeoFetchApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        const width = this.terminal.cols || 60;

        // Detect system info
        const osName = navigator.platform || 'OyiOS';
        const browser = navigator.userAgent.split(' ').pop();
        const cores = navigator.hardwareConcurrency || 'N/A';
        const memory = navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Unknown';
        const resolution = `${window.screen.width}x${window.screen.height}`;

        const logo = [
            "  \x1b[1;32m       ..---..      \x1b[0m",
            "  \x1b[1;32m    ./########\\..   \x1b[0m",
            "  \x1b[1;32m   /##########\\     \x1b[0m",
            "  \x1b[1;32m  |############|    \x1b[0m",
            "  \x1b[1;32m  |############|    \x1b[0m",
            "  \x1b[1;32m   \\##########/     \x1b[0m",
            "  \x1b[1;32m    '\\######/'      \x1b[0m",
            "  \x1b[1;32m       ''---''      \x1b[0m"
        ];

        const info = [
            `\x1b[1;32mroot\x1b[0m@\x1b[1;32moyi-os\x1b[0m`,
            `--------------`,
            `\x1b[1;32mOS:\x1b[0m OyiOS / Metal Kernel`,
            `\x1b[1;32mHost:\x1b[0m ${osName}`,
            `\x1b[1;32mKernel:\x1b[0m 5.15.0-76-generic`,
            `\x1b[1;32mUptime:\x1b[0m 12 days, 4 hours`,
            `\x1b[1;32mPackages:\x1b[0m 3pm (v1.0.4)`,
            `\x1b[1;32mShell:\x1b[0m oyi-sh 2.0`,
            `\x1b[1;32mResolution:\x1b[0m ${resolution}`,
            `\x1b[1;32mTerminal:\x1b[0m xterm.js`,
            `\x1b[1;32mCPU:\x1b[0m Neural ${cores} Core`,
            `\x1b[1;32mMemory:\x1b[0m ${memory}`
        ];

        this.terminal.write('\r\n');
        for (let i = 0; i < Math.max(logo.length, info.length); i++) {
            const logoPart = logo[i] || ' '.repeat(20);
            const infoPart = info[i] || '';
            this.terminal.write(logoPart + infoPart + '\r\n');
        }

        // Color Palette
        this.terminal.write('\r\n  ');
        for (let c = 0; c < 8; c++) {
            this.terminal.write(`\x1b[4${c}m   \x1b[0m`);
        }
        this.terminal.write('\r\n');
    }
}

window.NeoFetchApp = NeoFetchApp;
