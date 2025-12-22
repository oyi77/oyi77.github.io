class ApproachesApp {
  constructor(terminal, filesystem, windowManager, os) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
    this.os = os;
  }

  async run(args) {
    const width = this.terminal.cols || 60;
    const data = window.JEKYLL_DATA?.approaches;

    if (!data || !data.approaches) {
      this.terminal.write('\r\n\x1b[1;33mWarning: Approaches data not loaded\x1b[0m\r\n');
      this.terminal.write('  Data may still be loading. Try again in a moment.\r\n');
      this.terminal.write('  Visit \x1b[1;36m/approaches/\x1b[0m for full approaches.\r\n');
      return;
    }

    const approaches = data.approaches;

    if (args.length === 0) {
      // List all approaches
      this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36mPROBLEM-SOLVING APPROACHES\x1b[0m', width) + '\r\n');
      this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');

      approaches.forEach((approach, index) => {
        this.terminal.write(`  \x1b[1;33m[${index + 1}]\x1b[0m \x1b[1;32m${approach.title}\x1b[0m\r\n`);
        this.terminal.write(`      Category: \x1b[1;36m${approach.category}\x1b[0m\r\n`);
        
        if (approach.frameworks_used && approach.frameworks_used.length > 0) {
          this.terminal.write(`      Frameworks: ${approach.frameworks_used.slice(0, 3).join(', ')}\r\n`);
        }
        
        this.terminal.write('\r\n');
      });

      this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
      this.terminal.write('  Use \x1b[1;32mapproaches <id>\x1b[0m to view details\r\n');
      this.terminal.write('  Or visit \x1b[1;36m/approaches/\x1b[0m for full pages\r\n');
      return;
    }

    // Show specific approach
    const approachId = args[0];
    const approach = approaches.find(a => a.id === approachId || a.id.includes(approachId));

    if (!approach) {
      this.terminal.write(`\r\n\x1b[1;31mApproach not found: ${approachId}\x1b[0m\r\n`);
      this.terminal.write('Use \x1b[1;32mapproaches\x1b[0m to list all approaches.\r\n');
      return;
    }

    this.terminal.write('\r\n' + TerminalUtils.center(`\x1b[1;36m${approach.title}\x1b[0m`, width) + '\r\n');
    this.terminal.write('  ' + '\x1b[1;30m' + '='.repeat(width - 10) + '\x1b[0m\r\n\r\n');

    this.terminal.write(`  \x1b[1;32mCategory:\x1b[0m ${approach.category}\r\n\r\n`);

    this.terminal.write('  \x1b[1;33mMETHODOLOGY:\x1b[0m\r\n');
    this.terminal.write('  ' + TerminalUtils.wrap(approach.methodology, width - 4) + '\r\n\r\n');

    if (approach.frameworks_used && approach.frameworks_used.length > 0) {
      this.terminal.write('  \x1b[1;33mFRAMEWORKS USED:\x1b[0m\r\n');
      approach.frameworks_used.forEach(framework => {
        this.terminal.write(`    - ${framework}\r\n`);
      });
      this.terminal.write('\r\n');
    }

    this.terminal.write('  \x1b[1;33mDECISION-MAKING PROCESS:\x1b[0m\r\n');
    this.terminal.write('  ' + TerminalUtils.wrap(approach.decision_making_process, width - 4) + '\r\n\r\n');

    if (approach.key_principles && approach.key_principles.length > 0) {
      this.terminal.write('  \x1b[1;33mKEY PRINCIPLES:\x1b[0m\r\n');
      approach.key_principles.forEach(principle => {
        this.terminal.write(`    - ${principle}\r\n`);
      });
      this.terminal.write('\r\n');
    }

    if (approach.case_studies && approach.case_studies.length > 0) {
      this.terminal.write('  \x1b[1;33mRELATED CASE STUDIES:\x1b[0m\r\n');
      approach.case_studies.forEach(caseId => {
        this.terminal.write(`    - ${caseId}\r\n`);
      });
      this.terminal.write('\r\n');
    }

    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
    this.terminal.write('  Visit \x1b[1;36m/approaches/\x1b[0m for full documentation\r\n');
  }
}

window.ApproachesApp = ApproachesApp;

