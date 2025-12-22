class CaseStudiesApp {
  constructor(terminal, filesystem, windowManager, os) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
    this.os = os;
  }

  async run(args) {
    const width = this.terminal.cols || 60;
    const data = window.JEKYLL_DATA?.case_studies;

    if (!data || !data.case_studies) {
      this.terminal.write('\r\n\x1b[1;31mError: Case studies data not available\x1b[0m\r\n');
      this.terminal.write('Visit /case-studies/ for full case studies.\r\n');
      return;
    }

    const studies = data.case_studies;

    if (args.length === 0) {
      // List all case studies
      this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36mCASE STUDIES PORTFOLIO\x1b[0m', width) + '\r\n');
      this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');

      studies.forEach((study, index) => {
        this.terminal.write(`  \x1b[1;33m[${index + 1}]\x1b[0m \x1b[1;32m${study.title}\x1b[0m\r\n`);
        this.terminal.write(`      Company: \x1b[1;36m${study.company}\x1b[0m | Period: ${study.period}\r\n`);
        this.terminal.write(`      Role: ${study.role}\r\n`);
        
        if (study.metrics && study.metrics.length > 0) {
          const keyMetric = study.metrics[0];
          this.terminal.write(`      Key Result: \x1b[1;32m${keyMetric.metric}: ${keyMetric.value}\x1b[0m\r\n`);
        }
        
        this.terminal.write('\r\n');
      });

      this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
      this.terminal.write('  Use \x1b[1;32mcase-studies <id>\x1b[0m to view details\r\n');
      this.terminal.write('  Or visit \x1b[1;36m/case-studies/\x1b[0m for full pages\r\n');
      return;
    }

    // Show specific case study
    const studyId = args[0];
    const study = studies.find(s => s.id === studyId || s.id.includes(studyId));

    if (!study) {
      this.terminal.write(`\r\n\x1b[1;31mCase study not found: ${studyId}\x1b[0m\r\n`);
      this.terminal.write('Use \x1b[1;32mcase-studies\x1b[0m to list all case studies.\r\n');
      return;
    }

    this.terminal.write('\r\n' + TerminalUtils.center(`\x1b[1;36m${study.title}\x1b[0m`, width) + '\r\n');
    this.terminal.write('  ' + '\x1b[1;30m' + '='.repeat(width - 10) + '\x1b[0m\r\n\r\n');

    this.terminal.write(`  \x1b[1;32mCompany:\x1b[0m ${study.company}\r\n`);
    this.terminal.write(`  \x1b[1;32mPeriod:\x1b[0m ${study.period}\r\n`);
    this.terminal.write(`  \x1b[1;32mRole:\x1b[0m ${study.role}\r\n\r\n`);

    this.terminal.write('  \x1b[1;33mPROBLEM:\x1b[0m\r\n');
    this.terminal.write('  ' + TerminalUtils.wrap(study.problem, width - 4) + '\r\n\r\n');

    this.terminal.write('  \x1b[1;33mCHALLENGE:\x1b[0m\r\n');
    this.terminal.write('  ' + TerminalUtils.wrap(study.challenge, width - 4) + '\r\n\r\n');

    this.terminal.write('  \x1b[1;33mAPPROACH:\x1b[0m\r\n');
    this.terminal.write('  ' + TerminalUtils.wrap(study.approach, width - 4) + '\r\n\r\n');

    this.terminal.write('  \x1b[1;33mSOLUTION:\x1b[0m\r\n');
    this.terminal.write('  ' + TerminalUtils.wrap(study.solution, width - 4) + '\r\n\r\n');

    if (study.metrics && study.metrics.length > 0) {
      this.terminal.write('  \x1b[1;33mRESULTS:\x1b[0m\r\n');
      study.metrics.forEach(metric => {
        this.terminal.write(`    \x1b[1;32m${metric.metric}:\x1b[0m ${metric.value}\r\n`);
      });
      this.terminal.write('\r\n');
    }

    if (study.technologies && study.technologies.length > 0) {
      this.terminal.write('  \x1b[1;33mTECHNOLOGIES:\x1b[0m\r\n');
      this.terminal.write('    ' + study.technologies.join(', ') + '\r\n\r\n');
    }

    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
    this.terminal.write('  Visit \x1b[1;36m/case-studies/${study.id}/\x1b[0m for full case study\r\n');
  }
}

window.CaseStudiesApp = CaseStudiesApp;

