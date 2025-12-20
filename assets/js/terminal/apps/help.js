class HelpApp {
  constructor(terminal, filesystem, windowManager, os) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
    this.os = os;
  }

  async run(args) {
    const width = this.terminal.cols || 60;

    this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36mSYSTEM OPERATIONS COMMAND REFERENCE\x1b[0m', width) + '\r\n');
    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');

    this.terminal.write('  \x1b[1;32mCORE MODULES:\x1b[0m\r\n');
    const core = [
      { cmd: 'whoami', desc: 'Identity & leadership profile' },
      { cmd: 'companies', desc: 'Enterprise records [options: <id>]' },
      { cmd: 'achievements', desc: 'Mission accomplishment logs' },
      { cmd: 'repos', desc: 'Real-time repository scan' },
      { cmd: 'sysmon', desc: 'Real-time htop resource monitor' },
      { cmd: 'neofetch', desc: 'System information summary' },
      { cmd: 'netmap', desc: 'Network topology visualization' },
      { cmd: 'skills', desc: 'Capability matrix' },
      { cmd: 'cv', desc: 'Interactive CV stream' },
      { cmd: 'wallet', desc: 'Web3 wallet connection' },
      { cmd: '3pm', desc: 'Package manager interface' },
      { cmd: 'hack', desc: 'Privilege escalation simulation' }
    ];
    core.forEach(c => this.terminal.write(`    \x1b[1;33m${c.cmd.padEnd(12)}\x1b[0m | ${c.desc}\r\n`));

    this.terminal.write('\r\n  \x1b[1;32mFILESYSTEM OPS:\x1b[0m\r\n');
    const fs = [
      { cmd: 'ls [path]', desc: 'List directory contents' },
      { cmd: 'cd [path]', desc: 'Change directory' },
      { cmd: 'cat [file]', desc: 'Read file (with syntax highlighting)' },
      { cmd: 'cat -n [file]', desc: 'Show line numbers' },
      { cmd: 'cat -E [file]', desc: 'Show $ at end of lines' },
      { cmd: 'cat -A [file]', desc: 'Show all (equivalent to -vET)' },
      { cmd: 'clear', desc: 'Clear terminal screen' }
    ];
    fs.forEach(c => this.terminal.write(`    \x1b[1;33m${c.cmd.padEnd(15)}\x1b[0m | ${c.desc}\r\n`));

    this.terminal.write('\r\n  \x1b[1;32mADVANCED FEATURES:\x1b[0m\r\n');
    const advanced = [
      { cmd: 'web3os', desc: 'Web3OS status and info' },
      { cmd: 'web3os install <pkg>', desc: 'Install npm package' },
      { cmd: 'web3os node <code>', desc: 'Execute Node.js code' },
      { cmd: 'web3os wallet', desc: 'Connect Web3 wallet' },
      { cmd: 'web3os help', desc: 'Web3OS command help' }
    ];
    advanced.forEach(c => this.terminal.write(`    \x1b[1;33m${c.cmd.padEnd(20)}\x1b[0m | ${c.desc}\r\n`));

    this.terminal.write('\r\n  \x1b[1;32mINTERFACE:\x1b[0m\r\n');
    this.terminal.write('    \x1b[1;33mtheme <id>\x1b[0m  | matrix, amber, hacker, cyberpunk\r\n');

    this.terminal.write('\r\n  \x1b[1;32mKEYBOARD SHORTCUTS:\x1b[0m\r\n');
    this.terminal.write('    \x1b[1;33mCtrl+F\x1b[0m     | Search terminal content\r\n');
    this.terminal.write('    \x1b[1;33mTab\x1b[0m        | Command autocomplete\r\n');
    this.terminal.write('    \x1b[1;33m↑/↓\x1b[0m        | Command history navigation\r\n');

    this.terminal.write('\r\n  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
    this.terminal.write('  Tip: Use \x1b[1;32mTab\x1b[0m for autocomplete, \x1b[1;32mCtrl+F\x1b[0m to search.\r\n');
  }
}

window.HelpApp = HelpApp;

