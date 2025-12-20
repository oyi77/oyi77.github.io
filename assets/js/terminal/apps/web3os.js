class Web3OSApp {
  constructor(terminal, filesystem, windowManager, os) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
    this.os = os;
    this.web3os = null;
  }

  async run(args) {
    if (!this.web3os) {
      // Try to get Web3OS integration from OS
      if (this.os.web3os) {
        this.web3os = this.os.web3os;
      } else {
        this.terminal.write('\x1b[1;31mWeb3OS: Integration not initialized\x1b[0m\r\n');
        this.terminal.write('Web3OS runtime is not available in this environment.\r\n');
        return;
      }
    }

    if (args.length === 0) {
      await this.showStatus();
      return;
    }

    const command = args[0].toLowerCase();

    switch (command) {
      case 'status':
        await this.showStatus();
        break;
      case 'install':
        if (args.length < 2) {
          this.terminal.write('\x1b[1;31mUsage: web3os install <package-name>\x1b[0m\r\n');
          return;
        }
        await this.installPackage(args[1]);
        break;
      case 'node':
        if (args.length < 2) {
          this.terminal.write('\x1b[1;31mUsage: web3os node <code>\x1b[0m\r\n');
          return;
        }
        await this.executeNode(args.slice(1).join(' '));
        break;
      case 'wallet':
        await this.connectWallet();
        break;
      case 'help':
        this.showHelp();
        break;
      default:
        this.terminal.write(`\x1b[1;31mUnknown command: ${command}\x1b[0m\r\n`);
        this.showHelp();
    }
  }

  async showStatus() {
    const width = this.terminal.cols || 60;
    
    // Check if Web3OS loader script is present
    const hasLoader = document.querySelector('script[src*="web3os.sh"]') !== null;
    const hasWeb3OS = typeof window.web3os !== 'undefined' || typeof window.Web3OS !== 'undefined';
    
    const status = this.web3os ? this.web3os.getStatus() : {
      initialized: false,
      available: false,
      kernel: false,
      runtime: false
    };

    this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36m>> Web3OS Status <<\x1b[0m', width) + '\r\n\r\n');

    this.terminal.write(`  \x1b[1;32mLoader Script:\x1b[0m ${hasLoader ? '\x1b[1;32mLoaded\x1b[0m' : '\x1b[1;31mNot Found\x1b[0m'}\r\n`);
    this.terminal.write(`  \x1b[1;32mWeb3OS Object:\x1b[0m ${hasWeb3OS ? '\x1b[1;32mDetected\x1b[0m' : '\x1b[1;31mNot Detected\x1b[0m'}\r\n`);
    this.terminal.write(`  \x1b[1;32mInitialized:\x1b[0m ${status.initialized ? '\x1b[1;32mYes\x1b[0m' : '\x1b[1;31mNo\x1b[0m'}\r\n`);
    this.terminal.write(`  \x1b[1;32mAvailable:\x1b[0m ${status.available ? '\x1b[1;32mYes\x1b[0m' : '\x1b[1;31mNo\x1b[0m'}\r\n`);
    this.terminal.write(`  \x1b[1;32mKernel:\x1b[0m ${status.kernel ? '\x1b[1;32mLoaded\x1b[0m' : '\x1b[1;31mNot Loaded\x1b[0m'}\r\n`);
    this.terminal.write(`  \x1b[1;32mRuntime:\x1b[0m ${status.runtime ? '\x1b[1;32mAvailable\x1b[0m' : '\x1b[1;31mNot Available\x1b[0m'}\r\n`);

    if (!status.available) {
      this.terminal.write('\r\n\x1b[1;33mNote: Web3OS runtime is not fully initialized.\x1b[0m\r\n');
      if (!hasLoader) {
        this.terminal.write('\x1b[1;31m✗\x1b[0m Web3OS loader script not found in page.\r\n');
        this.terminal.write('   The loader should be: <script type="module" src="https://web3os.sh/_loader.js"></script>\r\n');
      } else if (!hasWeb3OS) {
        this.terminal.write('\x1b[1;33m⚠\x1b[0m Loader script found but Web3OS object not detected.\r\n');
        this.terminal.write('   Web3OS may still be loading, or there may be a compatibility issue.\r\n');
        this.terminal.write('   Try refreshing the page or check browser console for errors.\r\n');
      } else {
        this.terminal.write('\x1b[1;33m⚠\x1b[0m Web3OS detected but integration not initialized.\r\n');
        this.terminal.write('   Some features may still work. Try: web3os install <package>\r\n');
      }
    } else {
      this.terminal.write('\r\n\x1b[1;32m✓ Web3OS is ready to use!\x1b[0m\r\n');
    }

    this.terminal.write('\r\n');
  }

  async installPackage(packageName) {
    this.terminal.write(`\r\n\x1b[1;33mInstalling package: ${packageName}...\x1b[0m\r\n`);

    try {
      const result = await this.web3os.installPackage(packageName);
      this.terminal.write(`\x1b[1;32m✓ Package ${packageName} installed successfully\x1b[0m\r\n`);
      if (result) {
        this.terminal.write(`  ${result}\r\n`);
      }
    } catch (error) {
      this.terminal.write(`\x1b[1;31m✗ Failed to install package: ${error.message}\x1b[0m\r\n`);
    }

    this.terminal.write('\r\n');
  }

  async executeNode(code) {
    this.terminal.write(`\r\n\x1b[1;33mExecuting Node.js code...\x1b[0m\r\n`);

    try {
      const result = await this.web3os.executeNode(code);
      this.terminal.write(`\x1b[1;32mResult:\x1b[0m\r\n`);
      this.terminal.write(`${result}\r\n`);
    } catch (error) {
      this.terminal.write(`\x1b[1;31mExecution error: ${error.message}\x1b[0m\r\n`);
    }

    this.terminal.write('\r\n');
  }

  async connectWallet() {
    this.terminal.write(`\r\n\x1b[1;33mConnecting to Web3 wallet...\x1b[0m\r\n`);

    try {
      const result = await this.web3os.connectWallet();
      this.terminal.write(`\x1b[1;32m✓ Wallet connected successfully\x1b[0m\r\n`);
      if (result && result.address) {
        this.terminal.write(`  Address: ${result.address}\r\n`);
      }
    } catch (error) {
      this.terminal.write(`\x1b[1;31m✗ Wallet connection failed: ${error.message}\x1b[0m\r\n`);
    }

    this.terminal.write('\r\n');
  }

  showHelp() {
    const width = this.terminal.cols || 60;

    this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36m>> Web3OS Commands <<\x1b[0m', width) + '\r\n\r\n');

    this.terminal.write('  \x1b[1;33mweb3os\x1b[0m              Show Web3OS status\r\n');
    this.terminal.write('  \x1b[1;33mweb3os status\x1b[0m       Show detailed status\r\n');
    this.terminal.write('  \x1b[1;33mweb3os install <pkg>\x1b[0m Install npm package\r\n');
    this.terminal.write('  \x1b[1;33mweb3os node <code>\x1b[0m   Execute Node.js code\r\n');
    this.terminal.write('  \x1b[1;33mweb3os wallet\x1b[0m       Connect Web3 wallet\r\n');
    this.terminal.write('  \x1b[1;33mweb3os help\x1b[0m         Show this help\r\n');

    this.terminal.write('\r\n');
  }
}

window.Web3OSApp = Web3OSApp;

