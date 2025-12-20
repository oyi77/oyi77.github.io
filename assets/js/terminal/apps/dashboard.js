class DashboardApp {
  constructor(terminal, filesystem, windowManager) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
  }

  async run(args) {
    let text = `
\x1b[1;36m╔═══════════════════════════════════════════════════════════╗\x1b[0m
\x1b[1;36m║\x1b[0m  \x1b[1;33mTerminal OS Dashboard\x1b[0m                                      \x1b[1;36m║\x1b[0m
\x1b[1;36m╚═══════════════════════════════════════════════════════════╝\x1b[0m

\x1b[1;32mWelcome to my Terminal Portfolio Hub!\x1b[0m

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
  \x1b[1;33mopen\x1b[0m <name>      - Open site/project
  \x1b[1;33mclear\x1b[0m            - Clear terminal
  \x1b[1;33mhelp\x1b[0m             - Show help

\x1b[1;36m─────────────────────────────────────────────────────────────\x1b[0m

\x1b[1;33mTip:\x1b[0m Type \x1b[1;33msites\x1b[0m to see all my websites and projects!
\x1b[1;33mTip:\x1b[0m Type \x1b[1;33mcv\x1b[0m to open my interactive CV OS!

`;

    this.terminal.write(text);
  }
}

window.DashboardApp = DashboardApp;

