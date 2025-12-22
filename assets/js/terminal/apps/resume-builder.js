class ResumeBuilderApp {
  constructor(terminal, filesystem, windowManager, os) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
    this.os = os;
  }

  async run(args) {
    const width = this.terminal.cols || 60;
    const command = args[0] || 'build';

    try {
      switch (command) {
        case 'build':
          await this.buildResume(args.slice(1), width);
          break;
        case 'preview':
          await this.previewResume(width);
          break;
        case 'export':
          await this.exportResume(args.slice(1), width);
          break;
        case 'help':
          this.showHelp(width);
          break;
        default:
          this.terminal.write(`\r\n\x1b[1;31mUnknown command: ${command}\x1b[0m\r\n`);
          this.terminal.write('Use \x1b[1;32mresume help\x1b[0m for usage information.\r\n');
      }
    } catch (error) {
      this.terminal.write(`\r\n\x1b[1;31mError: ${error.message}\x1b[0m\r\n`);
    }
  }

  async buildResume(args, width) {
    const format = args[0] || 'markdown';
    const data = window.JEKYLL_DATA?.terminal;

    if (!data) {
      this.terminal.write('\r\n\x1b[1;31mError: Terminal data not available\x1b[0m\r\n');
      return;
    }

    this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36mBUILDING RESUME\x1b[0m', width) + '\r\n');
    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');

    const resume = this.generateResume(data, format);
    
    if (format === 'markdown' || format === 'md') {
      await this.displayMarkdown(resume, width);
      this.terminal.write('\r\n  Use \x1b[1;32mresume export markdown\x1b[0m to download\r\n');
    } else {
      await this.displayText(resume, width);
      this.terminal.write('\r\n  Use \x1b[1;32mresume export text\x1b[0m to download\r\n');
    }
  }

  generateResume(data, format) {
    const lines = [];

    // Header
    lines.push('# ' + data.name);
    lines.push(data.title);
    lines.push('');
    lines.push(`Email: ${data.email}`);
    lines.push(`Phone: ${data.phone}`);
    lines.push(`Location: ${data.location}`);
    lines.push(`GitHub: https://github.com/${data.github_username}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // Summary
    lines.push('## Professional Summary');
    lines.push('');
    lines.push(data.bio || data.summary);
    lines.push('');

    // Experience
    if (data.experience && data.experience.length > 0) {
      lines.push('## Professional Experience');
      lines.push('');
      data.experience.forEach(exp => {
        lines.push(`### ${exp.role} - ${exp.company}`);
        lines.push(`*${exp.period}* | ${exp.location}`);
        lines.push('');
        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements.forEach(achievement => {
            lines.push(`- ${achievement}`);
          });
        }
        lines.push('');
      });
    }

    // Skills
    if (data.skills) {
      lines.push('## Technical Skills');
      lines.push('');
      Object.entries(data.skills).forEach(([category, items]) => {
        if (Array.isArray(items) && items.length > 0) {
          lines.push(`**${category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:**`);
          lines.push(items.join(', '));
          lines.push('');
        }
      });
    }

    // Education
    if (data.education) {
      lines.push('## Education');
      lines.push('');
      lines.push(`**${data.education.degree}**`);
      lines.push(`${data.education.institution}`);
      lines.push(`${data.education.period} | GPA: ${data.education.gpa}`);
      lines.push('');
    }

    // Certifications
    if (data.certifications && data.certifications.length > 0) {
      lines.push('## Certifications');
      lines.push('');
      data.certifications.forEach(cert => {
        lines.push(`- ${cert.name} - ${cert.issuer}`);
      });
      lines.push('');
    }

    // Projects (if available)
    if (data.projects && data.projects.length > 0) {
      lines.push('## Key Projects');
      lines.push('');
      data.projects.slice(0, 5).forEach(project => {
        lines.push(`### ${project.name}`);
        lines.push(project.description);
        if (project.url) {
          lines.push(`GitHub: ${project.url}`);
        }
        lines.push('');
      });
    }

    return lines.join('\n');
  }

  async displayMarkdown(resume, width) {
    const lines = resume.split('\n');
    this.terminal.write('  \x1b[1;33mRESUME (Markdown Format)\x1b[0m\r\n');
    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');

    lines.forEach(line => {
      if (line.startsWith('# ')) {
        this.terminal.write(`  \x1b[1;36m${line}\x1b[0m\r\n`);
      } else if (line.startsWith('## ')) {
        this.terminal.write(`  \x1b[1;33m${line}\x1b[0m\r\n`);
      } else if (line.startsWith('### ')) {
        this.terminal.write(`  \x1b[1;32m${line}\x1b[0m\r\n`);
      } else if (line.startsWith('- ')) {
        this.terminal.write(`    ${line}\r\n`);
      } else if (line.trim() === '') {
        this.terminal.write('\r\n');
      } else {
        this.terminal.write(`  ${line}\r\n`);
      }
    });
  }

  async displayText(resume, width) {
    const lines = resume.split('\n');
    this.terminal.write('  \x1b[1;33mRESUME (Text Format)\x1b[0m\r\n');
    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');

    lines.forEach(line => {
      const cleanLine = line.replace(/[#*_`]/g, '').trim();
      if (cleanLine) {
        this.terminal.write(`  ${cleanLine}\r\n`);
      } else {
        this.terminal.write('\r\n');
      }
    });
  }

  async previewResume(width) {
    await this.buildResume(['markdown'], width);
  }

  async exportResume(args, width) {
    const format = args[0] || 'markdown';
    const data = window.JEKYLL_DATA?.terminal;

    if (!data) {
      this.terminal.write('\r\n\x1b[1;31mError: Terminal data not available\x1b[0m\r\n');
      return;
    }

    const resume = this.generateResume(data, format);
    const filename = `Resume_${data.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${format === 'markdown' || format === 'md' ? 'md' : 'txt'}`;

    // Create download
    const blob = new Blob([resume], { type: format === 'markdown' || format === 'md' ? 'text/markdown' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    this.terminal.write(`\r\n\x1b[1;32m✓ Resume exported as: ${filename}\x1b[0m\r\n`);
    this.terminal.write('  File downloaded to your default download folder.\r\n');
  }

  showHelp(width) {
    this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36mRESUME BUILDER COMMANDS\x1b[0m', width) + '\r\n');
    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');

    const commands = [
      { cmd: 'resume build [format]', desc: 'Build and display resume (markdown/text)' },
      { cmd: 'resume preview', desc: 'Preview resume in terminal' },
      { cmd: 'resume export [format]', desc: 'Export resume as file (markdown/text)' },
      { cmd: 'resume help', desc: 'Show this help' }
    ];

    commands.forEach(c => {
      this.terminal.write(`  \x1b[1;33m${c.cmd.padEnd(25)}\x1b[0m ${c.desc}\r\n`);
    });

    this.terminal.write('\r\n  \x1b[1;33mFormats:\x1b[0m markdown (default), text\r\n');
    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
  }
}

window.ResumeBuilderApp = ResumeBuilderApp;

