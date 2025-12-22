class ActivityApp {
  constructor(terminal, filesystem, windowManager, os) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
    this.os = os;
    this.githubClient = null;
  }

  async run(args) {
    const width = this.terminal.cols || 60;
    const watchMode = args.includes('--watch') || args.includes('-w');

    if (watchMode) {
      await this.watchActivity(width);
    } else {
      await this.showActivity(width);
    }
  }

  async showActivity(width) {
    this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36mACTIVITY FEED\x1b[0m', width) + '\r\n');
    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');

    try {
      // Initialize GitHub client if available
      if (typeof GitHubClient !== 'undefined') {
        this.githubClient = new GitHubClient();
      }

      // Fetch recent commits
      await this.showRecentCommits(width);

      // Show project updates if available
      await this.showProjectUpdates(width);

      this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
      this.terminal.write('  Use \x1b[1;32mactivity --watch\x1b[0m for auto-refresh mode\r\n');

    } catch (error) {
      this.terminal.write(`\r\n\x1b[1;31mError loading activity: ${error.message}\x1b[0m\r\n`);
    }
  }

  async showRecentCommits(width) {
    this.terminal.write('  \x1b[1;33mRECENT COMMITS\x1b[0m\r\n\r\n');

    try {
      if (!this.githubClient) {
        // Fallback: show static info
        this.terminal.write('    \x1b[1;30mGitHub API not available. Showing cached data.\x1b[0m\r\n\r\n');
        const recentRepos = window.JEKYLL_DATA?.terminal?.projects || [];
        recentRepos.slice(0, 3).forEach((repo, index) => {
          this.terminal.write(`    [${index + 1}] \x1b[1;32m${repo.name}\x1b[0m\r\n`);
          this.terminal.write(`        ${repo.description}\r\n`);
          this.terminal.write(`        \x1b[1;36m${repo.url}\x1b[0m\r\n\r\n`);
        });
        return;
      }

      const username = window.JEKYLL_DATA?.terminal?.github_username || 'oyi77';
      const response = await fetch(`https://api.github.com/users/${username}/events/public?per_page=10`);

      if (!response.ok) throw new Error('GitHub API error');

      const events = await response.json();
      const commits = events.filter(e => e.type === 'PushEvent').slice(0, 5);

      if (commits.length === 0) {
        this.terminal.write('    \x1b[1;30mNo recent commits found.\x1b[0m\r\n\r\n');
        return;
      }

      commits.forEach((event, index) => {
        const repo = event.repo.name;
        const date = new Date(event.created_at);
        const timeAgo = this.getTimeAgo(date);
        
        this.terminal.write(`    [${index + 1}] \x1b[1;32m${repo}\x1b[0m\r\n`);
        if (event.payload && event.payload.commits) {
          const commit = event.payload.commits[0];
          this.terminal.write(`        \x1b[1;36m${commit.message.substring(0, 50)}${commit.message.length > 50 ? '...' : ''}\x1b[0m\r\n`);
        }
        this.terminal.write(`        \x1b[1;30m${timeAgo}\x1b[0m\r\n\r\n`);
      });

    } catch (error) {
      this.terminal.write(`    \x1b[1;31mError fetching commits: ${error.message}\x1b[0m\r\n\r\n`);
    }
  }

  async showProjectUpdates(width) {
    this.terminal.write('  \x1b[1;33mPROJECT UPDATES\x1b[0m\r\n\r\n');

    const projects = window.JEKYLL_DATA?.terminal?.projects || [];
    if (projects.length === 0) {
      this.terminal.write('    \x1b[1;30mNo project updates available.\x1b[0m\r\n\r\n');
      return;
    }

    projects.slice(0, 3).forEach((project, index) => {
      this.terminal.write(`    [${index + 1}] \x1b[1;32m${project.name}\x1b[0m\r\n`);
      this.terminal.write(`        ${project.description}\r\n`);
      this.terminal.write(`        \x1b[1;36mTech: ${project.technologies}\x1b[0m\r\n\r\n`);
    });
  }

  async watchActivity(width) {
    this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36mACTIVITY FEED (WATCH MODE)\x1b[0m', width) + '\r\n');
    this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
    this.terminal.write('  \x1b[1;33mPress Ctrl+C to exit watch mode\x1b[0m\r\n\r\n');

    let watchInterval;
    let isWatching = true;

    const updateActivity = async () => {
      if (!isWatching) return;
      
      // Clear previous content (simplified - in real terminal would use proper cursor control)
      this.terminal.write('\r\n  \x1b[1;30m[Refreshing...]\x1b[0m\r\n');
      await this.showActivity(width);
    };

    // Initial load
    await updateActivity();

    // Set up interval for auto-refresh (every 30 seconds)
    watchInterval = setInterval(updateActivity, 30000);

    // Note: In a real implementation, you'd set up proper signal handling
    // For now, this is a simplified version
    this.terminal.write('\r\n  \x1b[1;30mWatch mode active. Refresh every 30s.\x1b[0m\r\n');
    this.terminal.write('  \x1b[1;30mNote: Use regular "activity" command for one-time view.\x1b[0m\r\n');
  }

  getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    return 'just now';
  }
}

window.ActivityApp = ActivityApp;

