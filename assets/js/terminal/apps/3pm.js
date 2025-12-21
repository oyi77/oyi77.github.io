class PackageManagerApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        const width = this.terminal.cols || 60;
        const subCommand = args[0];

        if (!subCommand || subCommand === 'help') {
            this.showHelp(width);
            return;
        }

        switch (subCommand) {
            case 'list':
                this.listPackages();
                break;
            case 'install':
                await this.installPackage(args[1], width);
                break;
            case 'search':
                this.searchPackages(args[1]);
                break;
            default:
                this.terminal.write(`\x1b[1;31m3pm: unknown command: ${subCommand}\x1b[0m\r\n`);
        }
    }

    showHelp(width) {
        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;35m[ 3PM PACKAGE MANAGER ]\x1b[0m', width) + '\r\n');
        this.terminal.write('  Usage: 3pm <command> [package]\r\n\r\n');
        this.terminal.write('  Commands:\r\n');
        this.terminal.write('    install   Install a virtual addon\r\n');
        this.terminal.write('    list      List installed modules\r\n');
        this.terminal.write('    search    Query the decentralized registry\r\n');
        this.terminal.write('    help      Show this manual\r\n');
    }

    listPackages() {
        this.terminal.write('\r\n\x1b[1;32mINSTALLED MODULES:\x1b[0m\r\n');
        
        // Default packages
        const defaultPackages = [
            { name: 'core-metal-shim', version: 'v2.1.0' },
            { name: 'xterm-web-links', version: 'v0.9.0' },
            { name: 'oyi-os-kernel', version: 'v5.15.0' }
        ];
        
        // Get installed packages from localStorage
        const installedPackages = JSON.parse(localStorage.getItem('3pm_installed_packages') || '[]');
        
        // Combine default and installed packages
        const allPackages = [...defaultPackages, ...installedPackages];
        
        if (allPackages.length === 0) {
            this.terminal.write('  \x1b[1;30mNo packages installed.\x1b[0m\r\n');
        } else {
            allPackages.forEach(pkg => {
                this.terminal.write(`  - ${pkg.name.padEnd(20)} [${pkg.version || 'latest'}]\r\n`);
            });
        }
    }

    async installPackage(pkg, width) {
        if (!pkg) {
            this.terminal.write('\x1b[1;31mError: No package specified.\x1b[0m\r\n');
            return;
        }

        this.terminal.write(`\r\n\x1b[1;33m[ 3PM ] Fetching ${pkg} from IPFS network...\x1b[0m\r\n`);
        await new Promise(r => setTimeout(r, 800));

        // Progress bar
        for (let i = 0; i <= 10; i++) {
            const bar = '='.repeat(i) + '>'.repeat(i < 10 ? 1 : 0) + ' '.repeat(10 - i);
            this.terminal.write(`\r  [${bar}] ${i * 10}%`);
            await new Promise(r => setTimeout(r, 150));
        }

        this.terminal.write(`\r\n\x1b[1;32mSuccessfully installed ${pkg} (Metal context).\x1b[0m\r\n`);
        
        // Store installed package in localStorage
        const installedPackages = JSON.parse(localStorage.getItem('3pm_installed_packages') || '[]');
        
        // Check if package already exists
        const exists = installedPackages.find(p => p.name === pkg);
        if (!exists) {
            installedPackages.push({
                name: pkg,
                version: 'latest',
                installedAt: new Date().toISOString()
            });
            localStorage.setItem('3pm_installed_packages', JSON.stringify(installedPackages));
        }
    }

    searchPackages(query) {
        this.terminal.write(`\r\n\x1b[1;36mSearch results for "${query || ''}":\x1b[0m\r\n`);
        this.terminal.write('  - @web3os/wallet-connect   - Secure DApp link\r\n');
        this.terminal.write('  - @web3os/ens-resolver     - Identity protocol\r\n');
        this.terminal.write('  - @oyi-os/glitch-addon     - VFX enhancement\r\n');
    }
}

window.PackageManagerApp = PackageManagerApp;
