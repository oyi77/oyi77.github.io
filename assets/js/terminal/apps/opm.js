class OpmApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;

        // Registry management
        this.registries = this.loadRegistries();
    }

    loadRegistries() {
        const saved = localStorage.getItem('opm_registries');
        return saved ? JSON.parse(saved) : {
            'npm': 'https://registry.npmjs.org',
            'ecmaos-apps': 'https://registry.npmjs.org/-/v1/search?text=scope:ecmaos-apps',
            'ecmaos-devices': 'https://registry.npmjs.org/-/v1/search?text=scope:ecmaos-devices'
        };
    }

    saveRegistries() {
        localStorage.setItem('opm_registries', JSON.stringify(this.registries));
    }

    async run(args) {
        if (args.length === 0) {
            this.showHelp();
            return;
        }

        const command = args[0];
        const subArgs = args.slice(1);

        switch (command) {
            case 'install':
            case 'i':
                await this.install(subArgs);
                break;
            case 'uninstall':
            case 'remove':
            case 'rm':
                await this.uninstall(subArgs);
                break;
            case 'list':
            case 'ls':
                await this.list(subArgs);
                break;
            case 'search':
                await this.search(subArgs);
                break;
            case 'update':
                await this.update(subArgs);
                break;
            case 'registry':
                await this.registryCommand(subArgs);
                break;
            case 'help':
            case '--help':
            case '-h':
                this.showHelp();
                break;
            default:
                this.terminal.write(`\r\n\x1b[1;31mUnknown command: ${command}\x1b[0m\r\n`);
                this.terminal.write('Type \x1b[1;32mopm --help\x1b[0m for usage.\r\n');
        }
    }

    async install(args) {
        if (args.length === 0) {
            this.terminal.write('\r\n\x1b[1;31mError: Package name required\x1b[0m\r\n');
            this.terminal.write('Usage: opm install <package>[@version] [--registry <url>]\r\n');
            return;
        }

        const packageName = args[0];
        const registryFlag = args.indexOf('--registry');
        const registry = registryFlag !== -1 ? args[registryFlag + 1] : this.registries['npm'];

        this.terminal.write(`\r\n\x1b[1;36m📦 Installing ${packageName}...\x1b[0m\r\n`);

        // Delegate to EcmaOS kernel if available
        if (this.os.ecmaKernel && typeof this.os.ecmaKernel.execute === 'function') {
            try {
                await this.os.ecmaKernel.execute(`install ${packageName}`, this.terminal);
            } catch (error) {
                this.terminal.write(`\r\n\x1b[1;31m✗ Installation failed: ${error.message}\x1b[0m\r\n`);
            }
        } else {
            this.terminal.write('\r\n\x1b[1;33m⚠ EcmaOS kernel not available\x1b[0m\r\n');
            this.terminal.write('Package installation requires EcmaOS kernel.\r\n');
            this.terminal.write('Simulating installation for demonstration...\r\n');

            // Simulate installation
            await this.simulateInstall(packageName, registry);
        }
    }

    async simulateInstall(packageName, registry) {
        try {
            this.terminal.write(`\r\nFetching ${packageName} from ${registry}...\r\n`);

            const response = await fetch(`${registry}/${packageName}`);
            if (!response.ok) {
                throw new Error(`Package not found: ${packageName}`);
            }

            const data = await response.json();
            const latestVersion = data['dist-tags']?.latest || 'unknown';

            this.terminal.write(`\x1b[1;32m✓\x1b[0m Found ${packageName}@${latestVersion}\r\n`);
            this.terminal.write(`\x1b[1;32m✓\x1b[0m Package would be installed (simulation mode)\r\n`);

        } catch (error) {
            this.terminal.write(`\r\n\x1b[1;31m✗ ${error.message}\x1b[0m\r\n`);
        }
    }

    async uninstall(args) {
        if (args.length === 0) {
            this.terminal.write('\r\n\x1b[1;31mError: Package name required\x1b[0m\r\n');
            this.terminal.write('Usage: opm uninstall <package>\r\n');
            return;
        }

        const packageName = args[0];
        this.terminal.write(`\r\n\x1b[1;36m🗑️  Uninstalling ${packageName}...\x1b[0m\r\n`);

        if (this.os.ecmaKernel && typeof this.os.ecmaKernel.execute === 'function') {
            try {
                await this.os.ecmaKernel.execute(`uninstall ${packageName}`, this.terminal);
            } catch (error) {
                this.terminal.write(`\r\n\x1b[1;31m✗ Uninstall failed: ${error.message}\x1b[0m\r\n`);
            }
        } else {
            this.terminal.write('\x1b[1;33m⚠ EcmaOS kernel not available (simulation mode)\x1b[0m\r\n');
            this.terminal.write(`\x1b[1;32m✓\x1b[0m ${packageName} would be removed\r\n`);
        }
    }

    async list(args) {
        this.terminal.write('\r\n\x1b[1;36m📋 Installed Packages\x1b[0m\r\n');
        this.terminal.write('\x1b[1;30m' + '─'.repeat(50) + '\x1b[0m\r\n');

        if (this.os.ecmaKernel && typeof this.os.ecmaKernel.execute === 'function') {
            try {
                await this.os.ecmaKernel.execute('list', this.terminal);
            } catch (error) {
                this.terminal.write(`\r\n\x1b[1;33m⚠ Could not fetch package list\x1b[0m\r\n`);
                this.terminal.write('No packages installed (or kernel unavailable).\r\n');
            }
        } else {
            this.terminal.write('\x1b[1;30mNo packages installed\x1b[0m\r\n');
        }
    }

    async search(args) {
        if (args.length === 0) {
            this.terminal.write('\r\n\x1b[1;31mError: Search query required\x1b[0m\r\n');
            this.terminal.write('Usage: opm search <query>\r\n');
            return;
        }

        const query = args.join(' ');
        this.terminal.write(`\r\n\x1b[1;36m🔍 Searching for: ${query}\x1b[0m\r\n`);

        try {
            const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=10`);
            const data = await response.json();

            if (data.objects && data.objects.length > 0) {
                this.terminal.write('\x1b[1;30m' + '─'.repeat(50) + '\x1b[0m\r\n');
                data.objects.forEach(pkg => {
                    this.terminal.write(`\x1b[1;33m${pkg.package.name}\x1b[0m@${pkg.package.version}\r\n`);
                    this.terminal.write(`  ${pkg.package.description || 'No description'}\r\n`);
                    this.terminal.write(`  \x1b[1;30m${pkg.package.links?.npm || ''}\x1b[0m\r\n\r\n`);
                });
            } else {
                this.terminal.write('\x1b[1;30mNo packages found\x1b[0m\r\n');
            }
        } catch (error) {
            this.terminal.write(`\r\n\x1b[1;31m✗ Search failed: ${error.message}\x1b[0m\r\n`);
        }
    }

    async update(args) {
        const packageName = args[0];

        if (packageName) {
            this.terminal.write(`\r\n\x1b[1;36m⬆️  Updating ${packageName}...\x1b[0m\r\n`);
        } else {
            this.terminal.write('\r\n\x1b[1;36m⬆️  Updating all packages...\x1b[0m\r\n');
        }

        if (this.os.ecmaKernel && typeof this.os.ecmaKernel.execute === 'function') {
            const cmd = packageName ? `update ${packageName}` : 'update';
            try {
                await this.os.ecmaKernel.execute(cmd, this.terminal);
            } catch (error) {
                this.terminal.write(`\r\n\x1b[1;31m✗ Update failed: ${error.message}\x1b[0m\r\n`);
            }
        } else {
            this.terminal.write('\x1b[1;33m⚠ EcmaOS kernel not available (simulation mode)\x1b[0m\r\n');
        }
    }

    async registryCommand(args) {
        if (args.length === 0) {
            this.terminal.write('\r\nUsage: opm registry <add|remove|list>\r\n');
            return;
        }

        const subCmd = args[0];

        switch (subCmd) {
            case 'add':
                if (args.length < 3) {
                    this.terminal.write('\r\nUsage: opm registry add <name> <url>\r\n');
                    return;
                }
                this.registries[args[1]] = args[2];
                this.saveRegistries();
                this.terminal.write(`\r\n\x1b[1;32m✓\x1b[0m Registry '${args[1]}' added\r\n`);
                break;

            case 'remove':
            case 'rm':
                if (args.length < 2) {
                    this.terminal.write('\r\nUsage: opm registry remove <name>\r\n');
                    return;
                }
                if (this.registries[args[1]]) {
                    delete this.registries[args[1]];
                    this.saveRegistries();
                    this.terminal.write(`\r\n\x1b[1;32m✓\x1b[0m Registry '${args[1]}' removed\r\n`);
                } else {
                    this.terminal.write(`\r\n\x1b[1;31m✗\x1b[0m Registry '${args[1]}' not found\r\n`);
                }
                break;

            case 'list':
            case 'ls':
                this.terminal.write('\r\n\x1b[1;36m📚 Configured Registries\x1b[0m\r\n');
                this.terminal.write('\x1b[1;30m' + '─'.repeat(50) + '\x1b[0m\r\n');
                Object.entries(this.registries).forEach(([name, url]) => {
                    this.terminal.write(`\x1b[1;33m${name.padEnd(20)}\x1b[0m ${url}\r\n`);
                });
                break;

            default:
                this.terminal.write(`\r\n\x1b[1;31mUnknown registry command: ${subCmd}\x1b[0m\r\n`);
        }
    }

    showHelp() {
        this.terminal.write('\r\n\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\r\n');
        this.terminal.write('\x1b[1;32m  OPM - Oyi Package Manager\x1b[0m\r\n');
        this.terminal.write('\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\r\n\r\n');

        this.terminal.write('\x1b[1;33mPackage Management:\x1b[0m\r\n');
        this.terminal.write('  opm install <pkg>[@ver]     Install package\r\n');
        this.terminal.write('  opm uninstall <pkg>         Remove package\r\n');
        this.terminal.write('  opm list                    List installed\r\n');
        this.terminal.write('  opm search <query>          Search npm registry\r\n');
        this.terminal.write('  opm update [pkg]            Update packages\r\n\r\n');

        this.terminal.write('\x1b[1;33mRegistry Management:\x1b[0m\r\n');
        this.terminal.write('  opm registry add <name> <url>   Add registry\r\n');
        this.terminal.write('  opm registry remove <name>      Remove registry\r\n');
        this.terminal.write('  opm registry list               List registries\r\n\r\n');

        this.terminal.write('\x1b[1;33mOptions:\x1b[0m\r\n');
        this.terminal.write('  --registry <url>            Use custom registry\r\n\r\n');

        this.terminal.write('\x1b[1;30mExamples:\x1b[0m\r\n');
        this.terminal.write('  opm install lodash\r\n');
        this.terminal.write('  opm search react\r\n');
        this.terminal.write('  opm registry add custom https://registry.example.com\r\n');
    }
}

window.OpmApp = OpmApp;
