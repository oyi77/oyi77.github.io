class WhoAmIApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        const width = this.terminal.cols || 60;

        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36m>> IDENTITY VERIFICATION SUCCESSFUL <<\x1b[0m', width) + '\r\n\r\n');

        const info = [
            { label: 'NAME', val: 'Muchammad Fikri Izzuddin' },
            { label: 'ROLE', val: 'Lead Software Engineer / Technical Lead' },
            { label: 'LEVEL', val: 'Elite / Multi-Company Technical Lead' },
            { label: 'LOC', val: 'East Java, Indonesia' }
        ];

        info.forEach(i => {
            this.terminal.write(`  \x1b[1;32m${i.label.padEnd(10)}:\x1b[0m ${i.val}\r\n`);
        });

        this.terminal.write('\r\n  \x1b[1;33mEXPERIENCE SUMMARY:\x1b[0m\r\n');
        const summary = "Highly accomplished and results-driven Software Engineer Lead with 7+ years of experience in full-stack development, blockchain, and embedded systems. Proven ability to lead cross-functional teams (up to 3000+ members), architect scalable solutions, and drive significant business impact.";
        this.terminal.write(TerminalUtils.wrap(summary, width - 10) + '\r\n\r\n');

        this.terminal.write('  \x1b[1;33mLEADERSHIP LOG:\x1b[0m\r\n');
        const logs = [
            { company: 'GarudaMedia', desc: '3000+ Employees Managed' },
            { company: 'Solomon Mining', desc: 'First Legal Crypto' },
            { company: 'BerkahKarya', desc: '5B+ Monthly turnover' },
            { company: 'AiTradePulse', desc: '90%+ Winrate Algo' }
        ];

        logs.forEach((log, idx) => {
            this.terminal.write(`  ${idx + 1}. \x1b[1;36m${log.company.padEnd(15)}\x1b[0m - ${log.desc}\r\n`);
        });

        this.terminal.write('\r\n  \x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
        this.terminal.write('  Type \x1b[1;32mcompanies\x1b[0m | \x1b[1;32mcv\x1b[0m | \x1b[1;32mskills\x1b[0m\r\n');
    }
}

window.WhoAmIApp = WhoAmIApp;
