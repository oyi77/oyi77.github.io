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

                // Show coding animation
                await this.showCodingAnimation(width);

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

                // Add links
                this.terminal.write('\r\n  \x1b[1;33mLINKS:\x1b[0m\r\n');
                this.terminal.write('  \x1b[1;36mCV OS:\x1b[0m \x1b]8;;https://oyi77.github.io/oyi77\x1b\\https://oyi77.github.io/oyi77\x1b]8;;\x1b\\\r\n');
                this.terminal.write('  \x1b[1;36mLinktree:\x1b[0m \x1b]8;;https://linktr.ee/jokogendeng\x1b\\https://linktr.ee/jokogendeng\x1b]8;;\x1b\\\r\n');

                this.terminal.write('\r\n  \x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
                this.terminal.write('  Type \x1b[1;32mcompanies\x1b[0m | \x1b[1;32mcv\x1b[0m | \x1b[1;32mskills\x1b[0m\r\n');
        }

        async showCodingAnimation(width) {
                const frames = [
                        `    ╔════════════════╗
    ║  Coding...     ║
    ║  █░░░░░░░░░░░░  ║
    ╚════════════════╝`,
                        `    ╔════════════════╗
    ║  Coding...     ║
    ║  ██░░░░░░░░░░░  ║
    ╚════════════════╝`,
                        `    ╔════════════════╗
    ║  Coding...     ║
    ║  ███░░░░░░░░░░  ║
    ╚════════════════╝`,
                        `    ╔════════════════╗
    ║  Coding...     ║
    ║  ████░░░░░░░░░  ║
    ╚════════════════╝`,
                        `    ╔════════════════╗
    ║  Coding...     ║
    ║  █████░░░░░░░░  ║
    ╚════════════════╝`,
                        `    ╔════════════════╗
    ║  Coding...     ║
    ║  ██████░░░░░░░  ║
    ╚════════════════╝`,
                        `    ╔════════════════╗
    ║  Coding...     ║
    ║  ███████░░░░░░  ║
    ╚════════════════╝`,
                        `    ╔════════════════╗
    ║  Coding...     ║
    ║  ████████░░░░░  ║
    ╚════════════════╝`,
                        `    ╔════════════════╗
    ║  Coding...     ║
    ║  █████████░░░░  ║
    ╚════════════════╝`,
                        `    ╔════════════════╗
    ║  Coding...     ║
    ║  ██████████░░░  ║
    ╚════════════════╝`,
                        `    ╔════════════════╗
    ║  Coding...     ║
    ║  ███████████░░  ║
    ╚════════════════╝`,
                        `    ╔════════════════╗
    ║  Coding...     ║
    ║  ████████████░  ║
    ╚════════════════╝`,
                        `    ╔════════════════╗
    ║  Coding...     ║
    ║  █████████████  ║
    ╚════════════════╝`,
                        `    ╔════════════════╗
    ║  Coding...     ║
    ║  ██████████████  ║
    ╚════════════════╝`,
                        `    ╔════════════════╗
    ║  ✓ Complete!   ║
    ║  ██████████████  ║
    ╚════════════════╝`
                ];

                // Write initial frame
                const initialLines = frames[0].split('\n');
                initialLines.forEach(line => {
                        this.terminal.write(TerminalUtils.center(`\x1b[1;32m${line}\x1b[0m`, width) + '\r\n');
                });

                // Animate by moving cursor up and overwriting
                for (let i = 1; i < frames.length; i++) {
                        await this.wait(150);

                        // Move cursor up to start of animation (4 lines)
                        this.terminal.write('\x1b[4A');

                        const lines = frames[i].split('\n');
                        lines.forEach(line => {
                                this.terminal.write('\x1b[2K'); // Clear current line
                                this.terminal.write(TerminalUtils.center(`\x1b[1;32m${line}\x1b[0m`, width) + '\r\n');
                        });
                }

                await this.wait(500);

                // Clear animation
                this.terminal.write('\x1b[4A'); // Move up 4 lines
                for (let i = 0; i < 4; i++) {
                        this.terminal.write('\x1b[2K\r\n'); // Clear each line
                }
        }

        async wait(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
        }
}

window.WhoAmIApp = WhoAmIApp;

