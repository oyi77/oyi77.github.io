class NetMapApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        const width = this.terminal.cols || 60;

        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;32mSCANNING LOCAL TOPOLOGY...\x1b[0m', width) + '\r\n');
        await new Promise(r => setTimeout(r, 1000));

        // Build responsive network map based on terminal width
        const centerX = Math.floor(width / 2);
        const gatewayPos = centerX - 6;
        const node1Pos = centerX - 20;
        const node2Pos = centerX + 8;
        const dbPos = centerX - 20;
        const fwPos = centerX + 8;
        const mainPos = centerX - 6;
        
        // Create properly aligned map
        const lines = [];
        lines.push(' '.repeat(gatewayPos) + '\x1b[1;36m[ GATEWAY ]\x1b[0m');
        lines.push(' '.repeat(centerX - 1) + '|');
        lines.push(' '.repeat(Math.max(0, centerX - 12)) + '+------+------+');
        lines.push(' '.repeat(Math.max(0, node1Pos)) + '\x1b[1;33m[ NOD-01 ]\x1b[0m' + ' '.repeat(Math.max(0, node2Pos - node1Pos - 9)) + '\x1b[1;33m[ NOD-02 ]\x1b[0m');
        lines.push(' '.repeat(Math.max(0, centerX - 12)) + '|' + ' '.repeat(12) + '|');
        lines.push(' '.repeat(Math.max(0, dbPos)) + '\x1b[1;32m[ DATABASE ]\x1b[0m' + ' '.repeat(Math.max(0, fwPos - dbPos - 10)) + '\x1b[1;31m[ FIREWALL ]\x1b[0m');
        lines.push(' '.repeat(centerX - 1) + '|');
        lines.push(' '.repeat(mainPos) + '\x1b[1;35m[ MAIN FRAME ]\x1b[0m');

        // Write each line
        lines.forEach(line => {
            this.terminal.write(line + '\r\n');
        });

        this.terminal.write('\r\n  \x1b[1;32mNOD-01:\x1b[0m \x1b[1;34m192.168.1.4\x1b[0m (Active)');
        this.terminal.write('\r\n  \x1b[1;32mNOD-02:\x1b[0m \x1b[1;34m192.168.1.12\x1b[0m (Encrypted)');
        this.terminal.write('\r\n  \x1b[1;31mTHREAT:\x1b[0m \x1b[5;1;31mNONE DETECTED\x1b[0m\r\n');
    }
}

window.NetMapApp = NetMapApp;
