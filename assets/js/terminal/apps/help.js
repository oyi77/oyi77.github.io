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
      { cmd: 'hack', desc: 'Privilege escalation simulation' },
      { cmd: 'install', desc: 'List EcmaOS packages (use opm for full features)' },
      { cmd: 'opm', desc: 'Advanced package manager (install, search, registry)' },
      { cmd: 'shell', desc: 'Simulated local shell (safe demo mode)' },
      { cmd: 'about', desc: 'About information and bio' },
      { cmd: 'dashboard', desc: 'System dashboard overview' },
      { cmd: 'file-manager', desc: 'File manager interface (alias: fm)' },
      { cmd: 'projects', desc: 'GitHub projects listing (use --led for led projects)' },
      { cmd: 'sites', desc: 'Portfolio sites and links' },
      { cmd: 'case-studies', desc: 'Case studies portfolio (alias: cases)' },
      { cmd: 'approaches', desc: 'Problem-solving approaches and methodologies' }
    ];

    // Integrasi EcmaOS - Merge into Core
    if (this.os.ecmaKernel) {
      let ecmaCommands = [];
      if (this.os.ecmaKernel.commands) {
        ecmaCommands = Object.keys(this.os.ecmaKernel.commands).map(cmd => ({ cmd, desc: 'EcmaOS Native' }));
      } else if (typeof this.os.ecmaKernel.getCommands === 'function') {
        ecmaCommands = this.os.ecmaKernel.getCommands();
      }

      // Fallback if no dynamic commands found
      if (ecmaCommands.length === 0) {
        const knownEcmaCommands = [
          { cmd: 'fetch', desc: 'Download file from URL' },
          { cmd: 'download', desc: 'Download and save resource' },
          { cmd: 'load', desc: 'Load module or script' },
          { cmd: 'edit', desc: 'Open file in editor' },
          { cmd: 'touch', desc: 'Create empty file or update timestamp' },
          { cmd: 'mkdir', desc: 'Create directory' },
          { cmd: 'rm', desc: 'Remove file or directory' },
          { cmd: 'cp', desc: 'Copy files or directories' },
          { cmd: 'mv', desc: 'Move or rename files' },
          { cmd: 'cat', desc: 'Display file contents' },
          { cmd: 'ls', desc: 'List directory contents' },
          { cmd: 'cd', desc: 'Change directory' },
          { cmd: 'pwd', desc: 'Print working directory' },
          { cmd: 'env', desc: 'Display environment variables' },
          { cmd: 'df', desc: 'Show disk space usage' },
          { cmd: 'du', desc: 'Estimate file space usage' },
          { cmd: 'ps', desc: 'List running processes' },
          { cmd: 'kill', desc: 'Terminate process' },
          { cmd: 'free', desc: 'Display memory usage' },
          { cmd: 'chkdisk', desc: 'Check disk for errors' },
          { cmd: 'format', desc: 'Format storage device' },
          { cmd: 'mount', desc: 'Mount filesystem' },
          { cmd: 'umount', desc: 'Unmount filesystem' },
      { cmd: 'snake', desc: 'Play snake game' },
      { cmd: 'video', desc: 'Play video file' },
      { cmd: 'play', desc: 'Play media file' },
      { cmd: 'screensaver', desc: 'Activate screensaver' },
      { cmd: 'decrypt', desc: 'Decrypt classified files' },
      { cmd: 'matrix', desc: 'Matrix rain screensaver effect' }
        ];
        ecmaCommands = knownEcmaCommands;
      }

      // Add to core list (avoid duplicates)
      ecmaCommands.forEach(ec => {
        if (!core.some(c => c.cmd.split(' ')[0] === ec.cmd)) {
          core.push(ec);
        }
      });
    }

    core.forEach(c => this.terminal.write(`    \x1b[1;33m${c.cmd.padEnd(12)}\x1b[0m | ${c.desc}\r\n`));

    this.terminal.write('\r\n  \x1b[1;32mFILESYSTEM OPS:\x1b[0m\r\n');
    const fs = [
      { cmd: 'ls [path]', desc: 'List directory contents' },
      { cmd: 'cd [path]', desc: 'Change directory' },
      { cmd: 'pwd', desc: 'Print working directory' },
      { cmd: 'cat [file]', desc: 'Read file (with syntax highlighting)' },
      { cmd: 'cat -n [file]', desc: 'Show line numbers' },
      { cmd: 'cat -E [file]', desc: 'Show $ at end of lines' },
      { cmd: 'cat -A [file]', desc: 'Show all (equivalent to -vET)' },
      { cmd: 'mkdir [dir]', desc: 'Create directory (EcmaOS)' },
      { cmd: 'touch [file]', desc: 'Create file (EcmaOS)' },
      { cmd: 'rm [file]', desc: 'Remove file (EcmaOS)' },
      { cmd: 'mv [src] [dest]', desc: 'Move/rename file (EcmaOS)' },
      { cmd: 'cp [src] [dest]', desc: 'Copy file (EcmaOS)' },
      { cmd: 'decrypt [file]', desc: 'Decrypt classified files' },
      { cmd: 'clear', desc: 'Clear terminal screen' }
    ];
    fs.forEach(c => this.terminal.write(`    \x1b[1;33m${c.cmd.padEnd(18)}\x1b[0m | ${c.desc}\r\n`));

    this.terminal.write('\r\n  \x1b[1;32mMARKET ANALYZER:\x1b[0m\r\n');
    const market = [
      { cmd: 'market crypto', desc: 'Real-time cryptocurrency prices' },
      { cmd: 'market indices', desc: 'Stock market indices data' },
      { cmd: 'market live', desc: 'Fetch live market data' },
      { cmd: 'crypto', desc: 'Alias for market crypto' },
      { cmd: 'coins', desc: 'Alias for market crypto' }
    ];
    market.forEach(c => this.terminal.write(`    \x1b[1;33m${c.cmd.padEnd(20)}\x1b[0m | ${c.desc}\r\n`));

    this.terminal.write('\r\n  \x1b[1;32mADVANCED FEATURES:\x1b[0m\r\n');
    const advanced = [
      { cmd: 'stats', desc: 'Repository & code quality statistics' },
      { cmd: 'analytics', desc: 'Analytics dashboard' },
      { cmd: 'github-stats', desc: 'GitHub profile statistics' }
    ];
    advanced.forEach(c => this.terminal.write(`    \x1b[1;33m${c.cmd.padEnd(20)}\x1b[0m | ${c.desc}\r\n`));


    this.terminal.write('\r\n  \x1b[1;32mENTERTAINMENT:\x1b[0m\r\n');
    const entertainment = [
      { cmd: 'matrix', desc: 'Matrix rain screensaver effect' },
      { cmd: 'snake', desc: 'Play classic snake game' },
      { cmd: 'video [file]', desc: 'Play video file' },
      { cmd: 'play [file]', desc: 'Play media file' },
      { cmd: 'screensaver', desc: 'Activate screensaver' }
    ];
    entertainment.forEach(c => this.terminal.write(`    \x1b[1;33m${c.cmd.padEnd(18)}\x1b[0m | ${c.desc}\r\n`));

    this.terminal.write('\r\n  \x1b[1;32mINTERFACE:\x1b[0m\r\n');
    this.terminal.write('    \x1b[1;33mtheme <id>\x1b[0m     | matrix, amber, hacker, cyberpunk\r\n');
    this.terminal.write('    \x1b[1;33mhome\x1b[0m            | Show welcome banner and starting screen\r\n');

    this.terminal.write('\r\n  \x1b[1;32mKEYBOARD SHORTCUTS:\x1b[0m\r\n');
    this.terminal.write('    \x1b[1;33mCtrl+F\x1b[0m     | Search terminal content\r\n');
    this.terminal.write('    \x1b[1;33mTab\x1b[0m        | Command autocomplete\r\n');
    this.terminal.write('    \x1b[1;33m↑/↓\x1b[0m        | Command history navigation\r\n');

    this.terminal.write('\r\n  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
    this.terminal.write('  Tip: Use \x1b[1;32mTab\x1b[0m for autocomplete, \x1b[1;32mCtrl+F\x1b[0m to search.\r\n');
  }
}

window.HelpApp = HelpApp;

