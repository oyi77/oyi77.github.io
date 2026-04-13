class DashboardApp {
  constructor(terminal, filesystem, windowManager, os) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
    this.os = os;
  }

  async run(args) {
    const data = window.JEKYLL_DATA?.terminal || {};

    const sitesCount = (data.sites && Array.isArray(data.sites)) ? data.sites.length : 0;
    const projectsCount = (data.projects && Array.isArray(data.projects)) ? data.projects.length : 0;
    const rolesCount = (data.experience && Array.isArray(data.experience)) ? data.experience.length : 0;

    // Build dynamic links section
    let linksSection = '';
    if (data.links && Array.isArray(data.links) && data.links.length > 0) {
      data.links.forEach(link => {
        const label = link.label || link.name || 'Link';
        const url = link.url || '#';
        linksSection += `  \x1b[1;33m${label}\x1b[0m - ${url}\r\n`;
      });
    }

    let statsLine = '';
    if (sitesCount > 0 || projectsCount > 0 || rolesCount > 0) {
      const parts = [];
      if (sitesCount > 0) parts.push(`${sitesCount} Sites`);
      if (projectsCount > 0) parts.push(`${projectsCount} Projects`);
      if (rolesCount > 0) parts.push(`${rolesCount} Roles`);
      statsLine = `\x1b[1;32mPortfolio Stats:\x1b[0m ${parts.join(' | ')}\r\n`;
    }

    let text = `
\x1b[1;36m╔═══════════════════════════════════════════════════════════╗\x1b[0m
\x1b[1;36m║\x1b[0m  \x1b[1;33mTerminal OS Dashboard\x1b[0m                                      \x1b[1;36m║\x1b[0m
\x1b[1;36m╚═══════════════════════════════════════════════════════════╝\x1b[0m

\x1b[1;32mWelcome to my Terminal Portfolio Hub!\x1b[0m
${statsLine}
\x1b[1;35mQuick Access:\x1b[0m
  \x1b[1;33mcv\x1b[0m              - Open CV OS (Interactive Portfolio)
  \x1b[1;33msites\x1b[0m            - Browse all my websites & projects
  \x1b[1;33msites featured\x1b[0m   - Show featured sites only
  \x1b[1;33mabout\x1b[0m            - About me & professional info
  \x1b[1;33mprojects\x1b[0m         - GitHub Pages projects

\x1b[1;35mNavigation:\x1b[0m
  \x1b[1;33mls\x1b[0m               - List files
  \x1b[1;33mcd\x1b[0m <dir>         - Change directory
  \x1b[1;33mcat\x1b[0m <file>      - Read file contents

\x1b[1;35mInformation:\x1b[0m
  \x1b[1;33mabout experience\x1b[0m - Work experience
  \x1b[1;33mabout skills\x1b[0m     - Skills by category
  \x1b[1;33mabout projects\x1b[0m   - Open-source projects
  \x1b[1;33mabout education\x1b[0m  - Education details

\x1b[1;35mUtilities:\x1b[0m
  \x1b[1;33mclear\x1b[0m            - Clear terminal
  \x1b[1;33mhelp\x1b[0m             - Show help

`;

    if (linksSection) {
      text += `\x1b[1;35mLinks:\x1b[0m\r\n${linksSection}\r\n`;
    }

    text += `\x1b[1;36m─────────────────────────────────────────────────────────────\x1b[0m

\x1b[1;33mTip:\x1b[0m Type \x1b[1;33msites\x1b[0m to see all my websites and projects!
\x1b[1;33mTip:\x1b[0m Type \x1b[1;33mcv\x1b[0m to open my interactive CV OS!

`;

    this.terminal.write(text);
  }
}

window.DashboardApp = DashboardApp;

