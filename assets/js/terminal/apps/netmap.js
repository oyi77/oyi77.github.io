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

        const map = `
      \x1b[1;36m[ GATEWAY ]\x1b[0m
           |
    +------+------+
    |             |
\x1b[1;33m[ NOD-01 ]\x1b[0m    \x1b[1;33m[ NOD-02 ]\x1b[0m
    |             |
\x1b[1;32m[ DATABASE ]\x1b[0m  \x1b[1;31m[ FIREWALL ]\x1b[0m
           |
      \x1b[1;35m[ MAIN FRAME ]\x1b[0m
    `;

        this.terminal.write(TerminalUtils.center(map, width) + '\r\n');

        this.terminal.write('\r\n  \x1b[1;32mNOD-01:\x1b[0m \x1b[1;34m192.168.1.4\x1b[0m (Active)');
        this.terminal.write('\r\n  \x1b[1;32mNOD-02:\x1b[0m \x1b[1;34m192.168.1.12\x1b[0m (Encrypted)');
        this.terminal.write('\r\n  \x1b[1;31mTHREAT:\x1b[0m \x1b[5;1;31mNONE DETECTED\x1b[0m\r\n');
    }
}

window.NetMapApp = NetMapApp;
