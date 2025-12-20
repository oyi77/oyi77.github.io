class HackApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        this.terminal.write('\r\n \x1b[1;31m!!! WARNING: UNAUTHORIZED PRIVILEGE ESCALATION DETECTED !!!\x1b[0m\r\n');
        await this.wait(500);
        this.terminal.write(' Initiating social engineering protocol...\r\n');

        const steps = [
            ' Bypassing firewall...',
            ' Cracking encrypted hash...',
            ' Injecting payload into main frame...',
            ' Intercepting handshake...',
            ' Escalating to root access...'
        ];

        for (const step of steps) {
            this.terminal.write(step);
            for (let i = 0; i < 5; i++) {
                this.terminal.write('.');
                await this.wait(200);
            }
            this.terminal.write(' \x1b[1;32mDONE\x1b[0m\r\n');
        }

        await this.wait(500);
        this.terminal.write('\r\n \x1b[1;32mSYSTEM COMPROMISED. WELCOME MASTER.\x1b[0m\r\n');
        this.terminal.write(' You have unlocked special trivia: \x1b[1;33m"Oyi" is a slang for "Iyo" (Yes) in Javanese.\x1b[0m\r\n');

        // Trigger matrix rain if not already running
        if (this.os.effects) {
            this.os.effects.startMatrixRain();
            this.terminal.write('\r\n \x1b[1;30mMatrix visualization protocol initialized.\x1b[0m\r\n');
        }
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.HackApp = HackApp;
