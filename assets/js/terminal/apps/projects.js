class ProjectsApp {
  constructor(terminal, filesystem, windowManager) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
  }

  async run(args) {
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
        this.terminal.write('Make sure your repositories have GitHub Pages enabled.\r\n');
        return;
      }

      this.displayProjects(projects);
    } catch (error) {
      this.terminal.write(`\x1b[1;31mError: ${error.message}\x1b[0m\r\n`);
      this.terminal.write('Make sure GitHub API is accessible or check your network connection.\r\n');
    }
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

