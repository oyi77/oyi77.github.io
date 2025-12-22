class JobsApp {
  constructor(terminal, filesystem, windowManager, os) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
    this.os = os;
    this.storageKey = 'oyi_job_applications';
  }

  async run(args) {
    const width = this.terminal.cols || 60;
    const command = args[0] || 'list';

    try {
      switch (command) {
        case 'list':
        case 'ls':
          await this.listJobs(width);
          break;
        case 'add':
          await this.addJob(args.slice(1), width);
          break;
        case 'update':
          await this.updateJob(args.slice(1), width);
          break;
        case 'notes':
          await this.addNotes(args.slice(1), width);
          break;
        case 'export':
          await this.exportJobs(width);
          break;
        case 'clear':
          await this.clearJobs(width);
          break;
        case 'help':
          this.showHelp(width);
          break;
        default:
          this.terminal.write(`\r\n\x1b[1;31mUnknown command: ${command}\x1b[0m\r\n`);
          this.terminal.write('Use \x1b[1;32mjobs help\x1b[0m for usage information.\r\n');
      }
    } catch (error) {
      this.terminal.write(`\r\n\x1b[1;31mError: ${error.message}\x1b[0m\r\n`);
    }
  }

  getJobs() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveJobs(jobs) {
    localStorage.setItem(this.storageKey, JSON.stringify(jobs));
  }

  async listJobs(width) {
    const jobs = this.getJobs();
    width = width || this.terminal.cols || 60;

    this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36mJOB APPLICATION TRACKER\x1b[0m', width) + '\r\n');
    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');

    if (jobs.length === 0) {
      this.terminal.write('  \x1b[1;33mNo applications tracked yet.\x1b[0m\r\n');
      this.terminal.write('  Use \x1b[1;32mjobs add <company> <position>\x1b[0m to add a new application.\r\n\r\n');
      return;
    }

    jobs.forEach((job, index) => {
      const statusColor = this.getStatusColor(job.status);
      this.terminal.write(`  \x1b[1;33m[${index + 1}]\x1b[0m \x1b[1;32m${job.company}\x1b[0m - ${job.position}\r\n`);
      this.terminal.write(`      Status: ${statusColor}${job.status.toUpperCase()}\x1b[0m\r\n`);
      this.terminal.write(`      Date: ${job.date}\r\n`);
      if (job.interviewDate) {
        this.terminal.write(`      Interview: ${job.interviewDate}\r\n`);
      }
      if (job.notes) {
        const notePreview = job.notes.length > 50 ? job.notes.substring(0, 50) + '...' : job.notes;
        this.terminal.write(`      Notes: \x1b[1;30m${notePreview}\x1b[0m\r\n`);
      }
      this.terminal.write('\r\n');
    });

    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
    this.terminal.write(`  Total: ${jobs.length} application${jobs.length !== 1 ? 's' : ''}\r\n`);
  }

  async addJob(args, width) {
    if (args.length < 2) {
      this.terminal.write('\r\n\x1b[1;31mUsage: jobs add <company> <position>\x1b[0m\r\n');
      this.terminal.write('Example: jobs add "Google" "Senior Software Engineer"\r\n');
      return;
    }

    const company = args[0];
    const position = args.slice(1).join(' ');
    const jobs = this.getJobs();

    const newJob = {
      id: Date.now().toString(),
      company: company,
      position: position,
      status: 'applied',
      date: new Date().toISOString().split('T')[0],
      interviewDate: null,
      notes: ''
    };

    jobs.push(newJob);
    this.saveJobs(jobs);

    this.terminal.write(`\r\n\x1b[1;32m✓ Added application:\x1b[0m\r\n`);
    this.terminal.write(`  Company: ${company}\r\n`);
    this.terminal.write(`  Position: ${position}\r\n`);
    this.terminal.write(`  Status: APPLIED\r\n`);
    this.terminal.write(`  Date: ${newJob.date}\r\n`);
  }

  async updateJob(args, width) {
    if (args.length < 2) {
      this.terminal.write('\r\n\x1b[1;31mUsage: jobs update <id> <status>\x1b[0m\r\n');
      this.terminal.write('Status: applied, interview, offer, rejected\r\n');
      this.terminal.write('Example: jobs update 1 interview\r\n');
      return;
    }

    const id = args[0];
    const status = args[1].toLowerCase();
    const validStatuses = ['applied', 'interview', 'offer', 'rejected'];

    if (!validStatuses.includes(status)) {
      this.terminal.write(`\r\n\x1b[1;31mInvalid status. Use: ${validStatuses.join(', ')}\x1b[0m\r\n`);
      return;
    }

    const jobs = this.getJobs();
    const jobIndex = parseInt(id) - 1;

    if (jobIndex < 0 || jobIndex >= jobs.length) {
      this.terminal.write(`\r\n\x1b[1;31mJob not found. Use 'jobs list' to see available jobs.\x1b[0m\r\n`);
      return;
    }

    jobs[jobIndex].status = status;
    this.saveJobs(jobs);

    this.terminal.write(`\r\n\x1b[1;32m✓ Updated job #${id} status to: ${status.toUpperCase()}\x1b[0m\r\n`);
  }

  async addNotes(args, width) {
    if (args.length < 2) {
      this.terminal.write('\r\n\x1b[1;31mUsage: jobs notes <id> <note text>\x1b[0m\r\n');
      this.terminal.write('Example: jobs notes 1 "Technical interview scheduled for next week"\r\n');
      return;
    }

    const id = args[0];
    const note = args.slice(1).join(' ');
    const jobs = this.getJobs();
    const jobIndex = parseInt(id) - 1;

    if (jobIndex < 0 || jobIndex >= jobs.length) {
      this.terminal.write(`\r\n\x1b[1;31mJob not found. Use 'jobs list' to see available jobs.\x1b[0m\r\n`);
      return;
    }

    jobs[jobIndex].notes = note;
    this.saveJobs(jobs);

    this.terminal.write(`\r\n\x1b[1;32m✓ Added notes to job #${id}\x1b[0m\r\n`);
  }

  async exportJobs(width) {
    const jobs = this.getJobs();
    width = width || this.terminal.cols || 60;

    if (jobs.length === 0) {
      this.terminal.write('\r\n\x1b[1;33mNo jobs to export.\x1b[0m\r\n');
      return;
    }

    this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36mJOB APPLICATIONS REPORT\x1b[0m', width) + '\r\n');
    this.terminal.write('  ' + '\x1b[1;30m' + '='.repeat(width - 10) + '\x1b[0m\r\n\r\n');

    const statusCounts = {};
    jobs.forEach(job => {
      statusCounts[job.status] = (statusCounts[job.status] || 0) + 1;
    });

    this.terminal.write('  \x1b[1;33mSTATUS SUMMARY:\x1b[0m\r\n');
    Object.entries(statusCounts).forEach(([status, count]) => {
      const statusColor = this.getStatusColor(status);
      this.terminal.write(`    ${statusColor}${status.toUpperCase().padEnd(12)}\x1b[0m: ${count}\r\n`);
    });

    this.terminal.write('\r\n  \x1b[1;33mDETAILED LIST:\x1b[0m\r\n');
    jobs.forEach((job, index) => {
      const statusColor = this.getStatusColor(job.status);
      this.terminal.write(`\r\n  [${index + 1}] ${job.company} - ${job.position}\r\n`);
      this.terminal.write(`      Status: ${statusColor}${job.status.toUpperCase()}\x1b[0m | Date: ${job.date}\r\n`);
      if (job.notes) {
        this.terminal.write(`      Notes: ${job.notes}\r\n`);
      }
    });

    this.terminal.write('\r\n  ' + '\x1b[1;30m' + '='.repeat(width - 10) + '\x1b[0m\r\n');
    this.terminal.write(`  Total Applications: ${jobs.length}\r\n`);
  }

  async clearJobs(width) {
    const jobs = this.getJobs();
    if (jobs.length === 0) {
      this.terminal.write('\r\n\x1b[1;33mNo jobs to clear.\x1b[0m\r\n');
      return;
    }

    localStorage.removeItem(this.storageKey);
    this.terminal.write(`\r\n\x1b[1;32m✓ Cleared ${jobs.length} job application(s)\x1b[0m\r\n`);
  }

  showHelp(width) {
    width = width || this.terminal.cols || 60;
    this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36mJOB TRACKER COMMANDS\x1b[0m', width) + '\r\n');
    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');

    const commands = [
      { cmd: 'jobs list', desc: 'List all tracked applications' },
      { cmd: 'jobs add <company> <position>', desc: 'Add new application' },
      { cmd: 'jobs update <id> <status>', desc: 'Update application status' },
      { cmd: 'jobs notes <id> <notes>', desc: 'Add notes to application' },
      { cmd: 'jobs export', desc: 'Show detailed report' },
      { cmd: 'jobs clear', desc: 'Clear all applications' },
      { cmd: 'jobs help', desc: 'Show this help' }
    ];

    commands.forEach(c => {
      this.terminal.write(`  \x1b[1;33m${c.cmd.padEnd(25)}\x1b[0m ${c.desc}\r\n`);
    });

    this.terminal.write('\r\n  \x1b[1;33mStatus Values:\x1b[0m applied, interview, offer, rejected\r\n');
    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
  }

  getStatusColor(status) {
    const colors = {
      'applied': '\x1b[1;36m',
      'interview': '\x1b[1;33m',
      'offer': '\x1b[1;32m',
      'rejected': '\x1b[1;31m'
    };
    return colors[status] || '\x1b[0m';
  }
}

window.JobsApp = JobsApp;

