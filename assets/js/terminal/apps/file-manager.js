class FileManagerApp {
  constructor(terminal, filesystem, windowManager) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
  }

  async run(args) {
    const path = args[0] || '/home/user';
    const listing = this.filesystem.list(path);
    
    if (listing === null) {
      this.terminal.write(`\x1b[1;31mError: Cannot access '${path}'\x1b[0m\r\n`);
      return;
    }

    this.terminal.write(`\x1b[1;36mFile Manager - ${path}\x1b[0m\r\n`);
    this.terminal.write('\x1b[1;36m─────────────────────────────────────────────────────────────\x1b[0m\r\n');
    this.terminal.write('\r\n');

    listing.forEach(item => {
      const icon = item.type === 'directory' ? '\x1b[1;34m📁\x1b[0m' : '\x1b[0m📄\x1b[0m';
      const color = item.type === 'directory' ? '\x1b[1;34m' : '\x1b[0m';
      const suffix = item.type === 'directory' ? '/' : '';
      this.terminal.write(`${icon} ${color}${item.name}${suffix}\x1b[0m\r\n`);
    });

    this.terminal.write('\r\n');
    this.terminal.write('Use \x1b[1;33mls\x1b[0m, \x1b[1;33mcd\x1b[0m, and \x1b[1;33mcat\x1b[0m commands to navigate.\r\n');
  }
}

window.FileManagerApp = FileManagerApp;

