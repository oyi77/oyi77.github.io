class ProjectsApp {
  constructor(terminal, filesystem, windowManager) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
  }

  async run(args) {
    const width = this.terminal.cols || 60;
    const ledProjects = window.JEKYLL_DATA?.led_projects?.led_projects;
    const showLed = args.includes('--led') || args.includes('-l');

    if (showLed && ledProjects) {
      this.displayLedProjects(ledProjects, width);
      return;
    }

    this.terminal.write('\x1b[1;36mFetching GitHub Pages projects...\x1b[0m\r\n');

    try {
      // Try to load from static JSON first
      let projects = [];
      try {
        const response = await fetch('/_data/projects.json');
        if (response.ok) {
          projects = await response.json();
        }
      } catch (e) {
        // Fallback to GitHub API
      }

      // If no static data, use GitHub API
      if (projects.length === 0) {
        const github = new GitHubClient();
        projects = await github.getPagesProjects();
      }

      if (projects.length === 0) {
        this.terminal.write('\x1b[1;33mNo GitHub Pages projects found.\x1b[0m\r\n');
        this.terminal.write('Use \x1b[1;32mprojects --led\x1b[0m to view led projects.\r\n');
        this.terminal.write('Visit \x1b[1;36m/led-projects/\x1b[0m for full project details.\r\n');
        return;
      }

      this.displayProjects(projects);
      this.terminal.write('\r\nUse \x1b[1;32mprojects --led\x1b[0m to view led projects.\r\n');
    } catch (error) {
      this.terminal.write(`\x1b[1;31mError: ${error.message}\x1b[0m\r\n`);
      this.terminal.write('Use \x1b[1;32mprojects --led\x1b[0m to view led projects.\r\n');
    }
  }

  displayLedProjects(projects, width) {
    this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36mLED PROJECTS PORTFOLIO\x1b[0m', width) + '\r\n');
    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');

    projects.forEach((project, index) => {
      this.terminal.write(`  \x1b[1;33m[${index + 1}]\x1b[0m \x1b[1;32m${project.name}\x1b[0m\r\n`);
      this.terminal.write(`      Company: \x1b[1;36m${project.company}\x1b[0m | Period: ${project.period}\r\n`);
      this.terminal.write(`      Team Size: ${project.team_size} | Role: ${project.role}\r\n`);
      
      if (project.metrics && project.metrics.length > 0) {
        const keyMetric = project.metrics[0];
        this.terminal.write(`      Key Result: \x1b[1;32m${keyMetric.metric}: ${keyMetric.value}\x1b[0m\r\n`);
      }
      
      this.terminal.write('\r\n');
    });

    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
    this.terminal.write('  Visit \x1b[1;36m/led-projects/\x1b[0m for full project details\r\n');
  }

  displayProjects(projects) {
    this.terminal.write('\r\n');
    this.terminal.write('\x1b[1;36m╔═══════════════════════════════════════════════════════════╗\x1b[0m\r\n');
    this.terminal.write('\x1b[1;36m║\x1b[0m  \x1b[1;33mGitHub Pages Projects\x1b[0m                                      \x1b[1;36m║\x1b[0m\r\n');
    this.terminal.write('\x1b[1;36m╚═══════════════════════════════════════════════════════════╝\x1b[0m\r\n');
    this.terminal.write('\r\n');

    projects.forEach((project, index) => {
      const num = (index + 1).toString().padStart(2, '0');
      this.terminal.write(`\x1b[1;32m[${num}]\x1b[0m \x1b[1;33m${project.name}\x1b[0m\r\n`);
      this.terminal.write(`     ${project.description}\r\n`);
      this.terminal.write(`     \x1b[1;36mPages:\x1b[0m ${project.pagesUrl}\r\n`);
      this.terminal.write(`     \x1b[1;36mRepo:\x1b[0m  ${project.url}\r\n`);
      if (project.language) {
        this.terminal.write(`     \x1b[1;36mLang:\x1b[0m  ${project.language}\r\n`);
      }
      if (project.stars > 0) {
        this.terminal.write(`     \x1b[1;36mStars:\x1b[0m ${project.stars}\r\n`);
      }
      this.terminal.write('\r\n');
    });

    this.terminal.write('\x1b[1;36m─────────────────────────────────────────────────────────────\x1b[0m\r\n');
    this.terminal.write('\r\n');
    this.terminal.write('To open a project, type: \x1b[1;33mopen <project-name>\x1b[0m\r\n');
    this.terminal.write('Example: \x1b[1;33mopen ' + (projects[0]?.name || 'project-name') + '\x1b[0m\r\n');
  }
}

window.ProjectsApp = ProjectsApp;

