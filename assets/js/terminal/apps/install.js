class InstallApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        if (args.length === 0) {
            this.terminal.write('\r\nUsage: install <package_name> | -l | --list | ls\r\n');
            return;
        }

        const command = args[0];

        if (command === '-l' || command === '--list' || command === 'ls') {
            await this.showPackageList();
        } else {
            // Limited functionality - direct to opm for full package management
            this.terminal.write(`\r\n\x1b[1;33mPackage: ${command}\x1b[0m\r\n`);
            this.terminal.write('\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\r\n');
            this.terminal.write('\r\n\x1b[1;31m⚠ Limited Functionality\x1b[0m\r\n');
            this.terminal.write('The \x1b[1;33minstall\x1b[0m command only supports listing EcmaOS packages.\r\n');
            this.terminal.write('\r\nFor advanced package management, use \x1b[1;32mopm\x1b[0m (Oyi Package Manager):\r\n');
            this.terminal.write('  \x1b[1;36mopm install\x1b[0m <package>[@version]\r\n');
            this.terminal.write('  \x1b[1;36mopm search\x1b[0m <query>\r\n');
            this.terminal.write('  \x1b[1;36mopm list\x1b[0m\r\n');
            this.terminal.write('\r\nType \x1b[1;32mopm --help\x1b[0m for more options.\r\n');
        }
    }

    async showPackageList() {
        this.terminal.write('\r\n\x1b[1;36mFETCHING ECMAOS REGISTRY...\x1b[0m\r\n');

        try {
            // Fetch EcmaOS Apps
            const appsResponse = await fetch('https://registry.npmjs.org/-/v1/search?text=scope:ecmaos-apps');
            const appsData = await appsResponse.json();

            this.terminal.write('\r\n\x1b[1;32mEcmaOS Apps (scope: @ecmaos-apps):\x1b[0m\r\n');
            if (appsData.objects && appsData.objects.length > 0) {
                appsData.objects.forEach(pkg => {
                    this.terminal.write(`  \x1b[1;33m${pkg.package.name}\x1b[0m - ${pkg.package.description || 'No description'}\r\n`);
                });
            } else {
                this.terminal.write('  No apps found or network error.\r\n');
            }

            // Fetch EcmaOS Devices
            this.terminal.write('\r\n\x1b[1;36mFETCHING DEVICES...\x1b[0m\r\n');
            const devicesResponse = await fetch('https://registry.npmjs.org/-/v1/search?text=scope:ecmaos-devices');
            const devicesData = await devicesResponse.json();

            this.terminal.write('\x1b[1;32mEcmaOS Devices (scope: @ecmaos-devices):\x1b[0m\r\n');
            if (devicesData.objects && devicesData.objects.length > 0) {
                devicesData.objects.forEach(pkg => {
                    this.terminal.write(`  \x1b[1;33m${pkg.package.name}\x1b[0m - ${pkg.package.description || 'No description'}\r\n`);
                });
            } else {
                this.terminal.write('  No devices found or network error.\r\n');
            }

            this.terminal.write('\r\n\x1b[1;30mUse "install <package>" to install.\x1b[0m\r\n');

        } catch (error) {
            this.terminal.write(`\r\n\x1b[1;31mRegistry Fetch Error: ${error.message}\x1b[0m\r\n`);
            this.terminal.write('Falling back to static links:\r\n  https://www.npmjs.com/org/ecmaos-apps\r\n');
        }
    }
}

window.InstallApp = InstallApp;
