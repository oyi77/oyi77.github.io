class CVApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        if (!args || args.length === 0) {
            this.terminal.write('\r\n\x1b[1;36m>> ACCESSING CV CHANNELS...\x1b[0m\r\n');
            this.terminal.write('Available formats:\r\n');
            this.terminal.write('  \x1b[1;32mcv interactive\x1b[0m - Launch graphical cvOS (One Piece themed)\r\n');
            this.terminal.write('  \x1b[1;32mcv pdf\x1b[0m         - Download official PDF CV\r\n');
            this.terminal.write('  \x1b[1;32mcv text\x1b[0m        - View plain text summary in terminal\r\n');
            this.terminal.write('\r\nDefaulting to interactive mode in 2 seconds...\r\n');

            setTimeout(() => {
                window.open('/oyi77', '_blank');
            }, 2000);
            return;
        }

        const subCommand = args[0].toLowerCase();
        if (subCommand === 'interactive' || subCommand === 'gui') {
            this.terminal.write('\r\nLaunching Graphical OS...\r\n');
            window.open('/oyi77', '_blank');
        } else if (subCommand === 'pdf' || subCommand === 'download') {
            this.terminal.write('\r\nInitiating secure download...\r\n');
            
            // Check filesystem for CV file reference
            const fsPath = this.filesystem.resolvePath(this.os.currentPath, 'cv.pdf');
            const fsContent = this.filesystem.readFile(fsPath);
            
            let cvUrl = '/assets/pdf/CV.pdf'; // Default path
            
            if (fsContent) {
              // Extract path from filesystem content
              const pathMatch = fsContent.match(/Location: ([^\r\n]+)/);
              if (pathMatch) {
                cvUrl = pathMatch[1].trim();
              }
            }
            
            // Try to open the CV
            try {
              const link = document.createElement('a');
              link.href = cvUrl;
              link.target = '_blank';
              link.download = 'LeadSoftwareEngineer_CV.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              this.terminal.write(`\x1b[1;32mCV download initiated: ${cvUrl}\x1b[0m\r\n`);
            } catch (error) {
              this.terminal.write(`\x1b[1;33mWarning: Could not open CV directly. Trying alternative method...\x1b[0m\r\n`);
              window.open(cvUrl, '_blank');
            }
        } else if (subCommand === 'text' || subCommand === 'cat') {
            this.terminal.write('\r\nStreaming text credentials...\r\n');
            // Mocking cat behavior for simplicity or use the actual handler if accessible
            this.terminal.writeln('\x1b[1;32m[ ROLE ]\x1b[0m Lead Software Engineer');
            this.terminal.writeln('\x1b[1;32m[ EXP  ]\x1b[0m 7+ Years');
            this.terminal.writeln('\x1b[1;32m[ TECH ]\x1b[0m Python, Node.js, React, Blockchain, AWS');
        } else {
            this.terminal.write(`\r\nUnknown format: ${subCommand}. Use 'cv interactive', 'cv pdf', or 'cv text'.\r\n`);
        }
    }
}

window.CVApp = CVApp;
