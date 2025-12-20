class CVApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        this.terminal.write('\r\n \x1b[1;32mINITIATING SECURE DATA STREAM TO CV OS...\x1b[0m\r\n');
        this.terminal.write(' Protocol: \x1b[1;33mHTTPS-XFER\x1b[0m\r\n');
        this.terminal.write(' Target:   \x1b[1;36mhttps://oyi77.github.io/oyi77\x1b[0m\r\n');

        await new Promise(r => setTimeout(r, 1000));

        window.open('https://oyi77.github.io/oyi77', '_blank');

        this.terminal.write(' \x1b[1;32m[ TRANSFER SUCCESSFUL ]\x1b[0m\r\n');
    }
}

window.CVApp = CVApp;
