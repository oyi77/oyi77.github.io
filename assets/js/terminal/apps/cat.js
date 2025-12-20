class CatApp {
  constructor(terminal, filesystem, windowManager, os) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
    this.os = os;
    this.highlighter = new SyntaxHighlighter();
  }

  async run(args) {
    if (args.length === 0) {
      this.terminal.write('\x1b[1;31mcat: missing file operand\x1b[0m\r\n');
      this.terminal.write('Usage: cat [OPTIONS] FILE...\r\n');
      this.terminal.write('Options:\r\n');
      this.terminal.write('  -n, --number    number all output lines\r\n');
      this.terminal.write('  -A, --show-all  equivalent to -vET\r\n');
      this.terminal.write('  -E, --show-ends display $ at end of each line\r\n');
      return;
    }

    // Parse flags
    const flags = {
      number: false,
      showAll: false,
      showEnds: false
    };

    const files = [];
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith('-')) {
        if (arg === '-n' || arg === '--number') {
          flags.number = true;
        } else if (arg === '-A' || arg === '--show-all') {
          flags.showAll = true;
          flags.showEnds = true;
        } else if (arg === '-E' || arg === '--show-ends') {
          flags.showEnds = true;
        } else if (arg === '-h' || arg === '--help') {
          this.terminal.write('Usage: cat [OPTIONS] FILE...\r\n');
          this.terminal.write('Concatenate and display file contents\r\n\r\n');
          this.terminal.write('Options:\r\n');
          this.terminal.write('  -n, --number    number all output lines\r\n');
          this.terminal.write('  -A, --show-all  equivalent to -vET\r\n');
          this.terminal.write('  -E, --show-ends display $ at end of each line\r\n');
          this.terminal.write('  -h, --help     display this help and exit\r\n');
          return;
        }
      } else {
        files.push(arg);
      }
    }

    if (files.length === 0) {
      this.terminal.write('\x1b[1;31mcat: missing file operand\x1b[0m\r\n');
      return;
    }

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const resolvedPath = this.filesystem.resolvePath(this.os.currentPath, file);
      const content = this.filesystem.readFile(resolvedPath);

      if (content === null) {
        this.terminal.write(`\x1b[1;31mcat: ${file}: No such file or directory\x1b[0m\r\n`);
        continue;
      }

      // Check if binary
      if (this.highlighter.isBinary(content)) {
        this.terminal.write(`\x1b[1;33mcat: ${file}: binary file detected\x1b[0m\r\n`);
        this.terminal.write('\x1b[1;30m(Use hexdump or similar tool to view binary files)\x1b[0m\r\n');
        continue;
      }

      // Get file extension for syntax highlighting
      const fileExtension = file.split('.').pop() || '';
      let processedContent = content;

      // Apply syntax highlighting
      processedContent = this.highlighter.highlight(processedContent, fileExtension);

      // Split into lines
      const lines = processedContent.split('\n');

      // Apply flags
      lines.forEach((line, index) => {
        let output = '';

        // Line numbers
        if (flags.number) {
          const lineNum = (index + 1).toString().padStart(6, ' ');
          output += `\x1b[1;30m${lineNum}\x1b[0m  `;
        }

        // Line content
        output += line;

        // Show ends
        if (flags.showEnds) {
          output += '\x1b[1;30m$\x1b[0m';
        }

        this.terminal.write(output + '\r\n');
      });

      // Add separator between multiple files
      if (i < files.length - 1) {
        this.terminal.write('\r\n\x1b[1;30m' + '─'.repeat(60) + '\x1b[0m\r\n\r\n');
      }
    }
  }
}

window.CatApp = CatApp;

