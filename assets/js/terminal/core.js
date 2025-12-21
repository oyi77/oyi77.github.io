class TerminalOS {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.terminal = null;
    this.filesystem = null;
    this.windowManager = null;
    this.themeManager = null;
    this.effects = null;
    this.currentPath = '/home/user';
    this.commandHistory = [];
    this.historyIndex = -1;
    this.currentInput = '';

    // User management
    this.currentUser = 'guest'; // Start as guest
    this.isRoot = false; // Track root access

    // Session tracking for uptime
    this.sessionStartTime = Date.now();

    // Hack game state
    this.hackStage = 0;
    this.hackCallback = null;

    // Advanced addons
    this.searchAddon = null;
    this.serializeAddon = null;
    this.imageAddon = null;
    this.unicode11Addon = null;



    // EcmaOS Kernel
    this.ecmaKernel = null;

    // Root access state
    this.isRoot = localStorage.getItem('root-access') === 'true';
    this.currentUser = this.isRoot ? 'root' : 'guest';

    this.init();
  }

  async init() {
    // Initialize EcmaOS parallel to xterm setup
    this.initEcmaOS().catch(e => console.error('Failed to load EcmaOS:', e));

    // Initialize xterm.js
    console.log('Terminal OS Init - window.Terminal type:', typeof window.Terminal);

    // Inspect the object structure if it is an object
    if (typeof window.Terminal === 'object') {
      console.log('window.Terminal keys:', Object.keys(window.Terminal));
      try {
        console.log('window.Terminal stringified:', JSON.stringify(window.Terminal));
      } catch (e) { console.log('Cannot stringify window.Terminal'); }
    }

    let Terminal = window.Terminal || (typeof Terminal !== 'undefined' ? Terminal : null);

    // Some bundles put Terminal inside a Terminal property
    if (Terminal && typeof Terminal !== 'function' && typeof Terminal.Terminal === 'function') {
      console.log('Using nested Terminal.Terminal');
      Terminal = Terminal.Terminal;
    }

    console.log('Final Terminal Constructor:', Terminal);
    if (!Terminal || typeof Terminal !== 'function') {
      console.error('Terminal constructor not found or not a function!', Terminal);
      return;
    }
    this.terminal = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#0d0d0d',
        foreground: '#00ff41',
        cursor: '#00ff41',
        selection: '#003b00',
        black: '#000000',
        red: '#ff0000',
        green: '#00ff41',
        yellow: '#ffff00',
        blue: '#0000ff',
        magenta: '#ff00ff',
        cyan: '#00ffff',
        white: '#ffffff'
      },
      fontSize: window.innerWidth < 768 ? 12 : 14,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      letterSpacing: 0,
      lineHeight: 1.1,
      scrollback: 1000,
    });

    this.terminal.open(this.container);

    // Load addons - FitAddon for auto-resize
    this.fitAddon = null;
    if (window.FitAddon) {
      try {
        const FitAddonClass = window.FitAddon.FitAddon || window.FitAddon;
        if (FitAddonClass) {
          this.fitAddon = new FitAddonClass();
          this.terminal.loadAddon(this.fitAddon);
          this.fitAddon.fit();

          window.addEventListener('resize', () => {
            if (this.fitAddon) {
              this.terminal.options.fontSize = window.innerWidth < 768 ? 12 : 14;
              this.fitAddon.fit();
            }
          });
        }
      } catch (e) {
        console.warn('FitAddon not available');
      }
    }

    // WebLinks Addon - clickable links
    if (window.WebLinksAddon) {
      try {
        const WebLinksAddonClass = window.WebLinksAddon.WebLinksAddon || window.WebLinksAddon;
        this.terminal.loadAddon(new WebLinksAddonClass());
      } catch (e) {
        console.warn('WebLinksAddon not available');
      }
    }

    // Webgl/Canvas Addon - high performance rendering
    if (window.WebglAddon) {
      try {
        const WebglAddonClass = window.WebglAddon.WebglAddon || window.WebglAddon;
        const webgl = new WebglAddonClass();
        this.terminal.loadAddon(webgl);
      } catch (e) {
        console.warn('WebGL not supported, falling back to DOM renderer');
      }
    } else if (window.CanvasAddon) {
      try {
        const CanvasAddonClass = window.CanvasAddon.CanvasAddon || window.CanvasAddon;
        this.terminal.loadAddon(new CanvasAddonClass());
      } catch (e) {
        console.warn('CanvasAddon not available');
      }
    }

    // Unicode11 Addon - Enhanced Unicode support
    if (window.Unicode11Addon) {
      try {
        const Unicode11AddonClass = window.Unicode11Addon.Unicode11Addon || window.Unicode11Addon;
        this.unicode11Addon = new Unicode11AddonClass();
        this.terminal.loadAddon(this.unicode11Addon);
      } catch (e) {
        // Silently fail - Unicode11 is optional
      }
    }

    // Search Addon - Terminal content search
    if (window.SearchAddon) {
      try {
        const SearchAddonClass = window.SearchAddon.SearchAddon || window.SearchAddon;
        this.searchAddon = new SearchAddonClass();
        this.terminal.loadAddon(this.searchAddon);
        this.setupSearchHandlers();
      } catch (e) {
        console.warn('SearchAddon not available');
      }
    }

    // Serialize Addon - Terminal state serialization
    if (window.SerializeAddon) {
      try {
        const SerializeAddonClass = window.SerializeAddon.SerializeAddon || window.SerializeAddon;
        this.serializeAddon = new SerializeAddonClass();
        this.terminal.loadAddon(this.serializeAddon);
      } catch (e) {
        console.warn('SerializeAddon not available');
      }
    }

    // Image Addon - Image display support
    if (window.ImageAddon) {
      try {
        const ImageAddonClass = window.ImageAddon.ImageAddon || window.ImageAddon;
        this.imageAddon = new ImageAddonClass();
        this.terminal.loadAddon(this.imageAddon);
      } catch (e) {
        console.warn('ImageAddon not available');
      }
    }



    // Initialize systems
    this.filesystem = new VirtualFileSystem();

    // Initialize FileSystem Loader (Jekyll Data)
    if (window.FileSystemLoader) {
      try {
        this.fsLoader = new FileSystemLoader(this.filesystem);
        this.fsLoader.loadJekyllData();
      } catch (error) {
        console.warn('FileSystemLoader error:', error);
        // Continue even if loader fails
      }
    }

    this.windowManager = new WindowManager(this.terminal);
    this.themeManager = new ThemeManager(this.terminal);
    this.effects = new TerminalEffects(this.terminal);

    // Set up input handling but don't start prompt yet
    this.setupInputHandling();

    // Start Boot Sequence
    const boot = new BootSequence(this.terminal, async () => {
      // Show Matrix-style terminal visuals
      this.effects.addScanline();

      // Load user preferences
      const savedTheme = localStorage.getItem('term-theme') || 'modern';
      this.themeManager.setTheme(savedTheme);

      // Start UI update loop
      this.startUIUpdates();

      // Show welcome message
      await this.showWelcome();
      this.prompt();
    });

    await boot.start();
  }

  setupSearchHandlers() {
    if (!this.searchAddon) return;

    // Handle Ctrl+F to activate search
    this.terminal.onKey(({ key, domEvent }) => {
      if (domEvent.ctrlKey && key === 'f') {
        domEvent.preventDefault();
        this.activateSearch();
      }
    });
  }

  activateSearch() {
    if (!this.searchAddon) return;

    const searchTerm = prompt('Search terminal content:');
    if (searchTerm) {
      this.searchAddon.findNext(searchTerm);
      this.terminal.write(`\r\n\x1b[1;33mSearching for: "${searchTerm}"\x1b[0m\r\n`);
      this.terminal.write('\x1b[1;30mPress Ctrl+F again to find next, or type to continue...\x1b[0m\r\n');
      this.prompt();
    }
  }

  setupInputHandling() {
    this.terminal.onData((data) => {
      // Add glitch effect on input for immersion
      if (Math.random() > 0.99) this.effects.addGlitch();

      if (data === '\r' || data === '\n') {
        this.handleCommand(this.currentInput);
        this.currentInput = '';
        this.historyIndex = -1;
      } else if (data === '\x7f' || data === '\b') {
        if (this.currentInput.length > 0) {
          this.currentInput = this.currentInput.slice(0, -1);
          this.terminal.write('\b \b');
        }
      } else if (data === '\x1b[A') {
        if (this.commandHistory.length > 0) {
          if (this.historyIndex === -1) {
            this.historyIndex = this.commandHistory.length - 1;
          } else if (this.historyIndex > 0) {
            this.historyIndex--;
          }
          this.currentInput = this.commandHistory[this.historyIndex];
          this.terminal.write('\r\x1b[K' + this.getPromptText() + this.currentInput);
        }
      } else if (data === '\x1b[B') {
        if (this.historyIndex !== -1) {
          if (this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.currentInput = this.commandHistory[this.historyIndex];
          } else {
            this.historyIndex = -1;
            this.currentInput = '';
          }
          this.terminal.write('\r\x1b[K' + this.getPromptText() + this.currentInput);
        }
      } else if (data === '\t') {
        this.handleTabCompletion();
      } else if (data.charCodeAt(0) >= 32) {
        this.currentInput += data;
        this.terminal.write(data);
      }
    });
  }

  async showWelcome() {
    const width = this.terminal.cols || 80;

    // Centered ASCII Banner (Small & Robust)
    const bannerLines = [
      " ██████╗ ██╗   ██╗██╗     ██████╗ ███████╗",
      "██╔═══██╗╚██╗ ██╔╝██║    ██╔═══██╗██╔════╝",
      "██║   ██║ ╚████╔╝ ██║    ██║   ██║███████╗",
      "██║   ██║  ╚██╔╝  ██║    ██║   ██║╚════██║",
      "╚██████╔╝   ██║   ██║    ╚██████╔╝███████║",
      " ╚═════╝    ╚═╝   ╚═╝     ╚═════╝ ╚══════╝"
    ];

    this.terminal.write('\r\n');
    bannerLines.forEach(line => {
      this.terminal.write(TerminalUtils.center(`\x1b[1;32m${line}\x1b[0m`, width) + '\r\n');
    });

    this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36m>> SYSTEM ONLINE | KERNEL v5.15 <<\x1b[0m', width) + '\r\n');
    this.terminal.write(TerminalUtils.center('\x1b[1;30m' + '='.repeat(width > 40 ? 40 : width - 4) + '\x1b[0m', width) + '\r\n\r\n');

    // Boxed Commands
    const boxWidth = Math.min(width - 4, 50);
    const boxIndent = Math.floor((width - boxWidth) / 2);
    const indent = ' '.repeat(boxIndent);

    this.terminal.write(indent + '\x1b[1;33m+-- PROTOCOL OVERRIDE --------------------+\x1b[0m\r\n');
    this.terminal.write(indent + '\x1b[1;33m|\x1b[0m \x1b[1;36mwhoami\x1b[0m      | User Identity Profile      \x1b[1;33m|\x1b[0m\r\n');
    this.terminal.write(indent + '\x1b[1;33m|\x1b[0m \x1b[1;36mcompanies\x1b[0m   | Enterprise Leadership Log  \x1b[1;33m|\x1b[0m\r\n');
    this.terminal.write(indent + '\x1b[1;33m|\x1b[0m \x1b[1;36mrepos\x1b[0m       | Real-time Code Shards      \x1b[1;33m|\x1b[0m\r\n');
    this.terminal.write(indent + '\x1b[1;33m|\x1b[0m \x1b[1;36msysmon\x1b[0m      | Resource Analytics         \x1b[1;33m|\x1b[0m\r\n');
    this.terminal.write(indent + '\x1b[1;33m|\x1b[0m \x1b[1;36mhelp\x1b[0m        | Operational Directives     \x1b[1;33m|\x1b[0m\r\n');
    this.terminal.write(indent + '\x1b[1;33m+-----------------------------------------+\x1b[0m\r\n\r\n');

    const uptime = this.calculateUptime();
    const status = `\x1b[1;32mSTATUS:\x1b[0m STABLE | \x1b[1;32mUPTIME:\x1b[0m ${uptime} | \x1b[1;31mTHREAT:\x1b[0m NONE`;
    this.terminal.write(TerminalUtils.center(status, width) + '\r\n');

    // Display Data Load Status
    const projectsCount = (window.JEKYLL_DATA && window.JEKYLL_DATA.terminal && window.JEKYLL_DATA.terminal.sites) ? window.JEKYLL_DATA.terminal.sites.length : 0;
    const companiesCount = (window.JEKYLL_DATA && window.JEKYLL_DATA.companies && window.JEKYLL_DATA.companies.companies) ? window.JEKYLL_DATA.companies.companies.length : 0;

    this.terminal.write('\r\n' + TerminalUtils.center(`\x1b[1;30mLOADED: ${projectsCount} projects, ${companiesCount} enterprise logs, Virtual FS synchronized.\x1b[0m`, width) + '\r\n');
    this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;30mTip: Try command "hack" for elevated access simulation.\x1b[0m', width) + '\r\n');
  }

  getPromptText() {
    const path = this.currentPath === '/home/user' ? '~' : this.currentPath;
    const user = this.isRoot ? 'root' : this.currentUser;
    const promptChar = this.isRoot ? '#' : '$';

    // Update UI overlay path
    const pathDisplay = document.querySelector('.path-display');
    if (pathDisplay) {
      pathDisplay.textContent = `${user}@oyi-os:${path}`;
    }

    const userColor = this.isRoot ? '\x1b[1;31m' : '\x1b[1;33m';
    return `${userColor}${user}\x1b[0m@\x1b[1;34moyi-os\x1b[0m:\x1b[1;36m${path}\x1b[0m${promptChar} `;
  }

  startUIUpdates() {
    setInterval(() => {
      const uptimeDisplay = document.getElementById('uptime-display');
      if (uptimeDisplay) {
        uptimeDisplay.textContent = this.calculateUptime();
      }
    }, 1000);
  }

  calculateUptime() {
    const now = Date.now();
    const diff = now - this.sessionStartTime;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}D ${hours % 24}H ${minutes % 60}M`;
    } else if (hours > 0) {
      return `${hours}H ${minutes % 60}M`;
    } else if (minutes > 0) {
      return `${minutes}M ${seconds % 60}S`;
    } else {
      return `${seconds}S`;
    }
  }

  prompt() {
    this.terminal.write('\r\n' + this.getPromptText());
  }

  async handleCommand(input) {
    input = input.trim();
    if (!input) {
      this.terminal.write('\r\n');
      this.prompt();
      return;
    }

    if (input && (this.commandHistory.length === 0 || this.commandHistory[this.commandHistory.length - 1] !== input)) {
      this.commandHistory.push(input);
      if (this.commandHistory.length > 100) this.commandHistory.shift();
    }

    // Check if hack game is active
    if (this.hackCallback && this.hackStage > 0) {
      this.terminal.write('\r\n');
      await this.hackCallback(input);
      this.prompt();
      return;
    }

    // Check if shell mode is active
    if (this.shellMode && this.shellCallback) {
      await this.shellCallback(input);
      return;
    }

    this.terminal.write('\r\n');
    const [command, ...args] = input.split(/\s+/);
    const cmd = command.toLowerCase();

    try {
      switch (cmd) {
        case 'help':
          await this.runCommand('help', args);
          break;
        case 'whoami':
          await this.runCommand('whoami', args);
          break;
        case 'companies':
          await this.runCommand('companies', args);
          break;
        case 'achievements':
          await this.runCommand('achievements', args);
          break;
        case 'repos':
        case 'scan':
          await this.runCommand('repos', args);
          break;
        case 'sysmon':
          await this.runCommand('sysmon', args);
          break;
        case 'netmap':
          await this.runCommand('netmap', args);
          break;
        case 'neofetch':
          await this.runCommand('neofetch', args);
          break;
        case 'skills':
          await this.runCommand('skills', args);
          break;
        case 'wallet':
          await this.runCommand('wallet', args);
          break;
        case 'theme':
          if (args[0]) {
            if (this.themeManager.setTheme(args[0])) {
              localStorage.setItem('term-theme', args[0]);
              this.terminal.write(`\x1b[1;32mTheme protocol updated to: ${args[0]}\x1b[0m\r\n`);
            } else {
              this.terminal.write(`\x1b[1;31mUnknown theme protocol: ${args[0]}\x1b[0m\r\n`);
            }
          } else {
            this.terminal.write(`Usage: theme [matrix|amber|hacker|cyberpunk]\r\n`);
          }
          break;
        case 'cv':
          await this.runCommand('cv', args);
          break;
        case 'install':
          await this.runCommand('install', args);
          break;
        case 'opm':
          await this.runCommand('opm', args);
          break;
        case 'shell':
          await this.runCommand('shell', args);
          break;
        case 'ls':
          this.runLs(args);
          break;
        case 'cd':
          this.runCd(args);
          break;
        case 'clear':
        case 'cls':
          this.terminal.clear();
          break;
        case 'hack':
          await this.runCommand('hack', args);
          break;

        case 'github':
          await this.runCommand('github', args);
          break;
        case 'stats':
          await this.runCommand('stats', args);
          break;
        case 'analytics':
          await this.runCommand('analytics', args);
          break;
        case 'github-stats':
        case 'ghstats':
          await this.runCommand('github-stats', args);
          break;
        case 'market':
        case 'crypto':
        case 'coins':
        case 'indices':
          await this.runCommand('market', args);
          break;
        case 'share':
          await this.runCommand('share', args);
          break;
        case 'home':
          this.terminal.clear();
          await this.showWelcome();
          break;
        default:
          // Try EcmaOS if command not found in local apps
          if (this.ecmaKernel) {
            try {
              // Assuming EcmaOS kernel has an execute or similar method. 
              // Based on standard shells, it might be exec(cmd, args) or similar.
              // We will try a flexible approach or log if we aren't sure yet.
              // For now, let's assume `execute` or `handle`.
              // Since we don't know the API, I'll logging structure for now and try to execute.

              // inspecting kernel if possible
              if (typeof this.ecmaKernel.execute === 'function') {
                await this.ecmaKernel.execute(input, this.terminal);
                this.prompt();
                return;
              } else if (typeof this.ecmaKernel.handle === 'function') {
                await this.ecmaKernel.handle(input, this.terminal);
                this.prompt();
                return;
              }
            } catch (e) {
              console.error("EcmaOS execution failed:", e);
            }
          }

          this.terminal.write(`\x1b[1;31m${command}: command not found\x1b[0m\r\n`);
      }
    } catch (error) {
      this.terminal.write(`\x1b[1;31mSystem Error: ${error.message}\x1b[0m\r\n`);
    }

    this.prompt();
  }

  async runCommand(command, args) {
    const appMap = {
      'help': HelpApp,
      'whoami': WhoAmIApp,
      'companies': CompaniesApp,
      'achievements': AchievementsApp,
      'repos': ReposApp,
      'sysmon': SysMonApp,
      'netmap': NetMapApp,
      'neofetch': NeoFetchApp,
      'skills': SkillsApp,
      'wallet': WalletApp,
      'cv': CVApp,
      'hack': HackApp,
      'install': InstallApp,
      'opm': OpmApp,
      'shell': ShellApp,

      'github': GitHubExplorerApp,
      'stats': StatsApp,
      'analytics': AnalyticsApp,
      'github-stats': GitHubStatsApp,
      'market': MarketApp,
      'share': ShareApp
    };

    const AppClass = appMap[command];
    if (AppClass) {
      const app = new AppClass(this.terminal, this.filesystem, this.windowManager, this);
      await app.run(args);
    }
  }

  // ... (ls, cd, cat, etc. stay but updated with themes/colors)
  runLs(args) {
    const path = args[0] || this.currentPath;
    const resolvedPath = this.filesystem.resolvePath(this.currentPath, path);
    const listing = this.filesystem.list(resolvedPath);

    if (listing === null) {
      this.terminal.write(`\x1b[1;31mls: cannot access '${path}': No such file or directory\x1b[0m\r\n`);
      return;
    }

    listing.forEach(item => {
      const color = item.type === 'directory' ? '\x1b[1;34m' : '\x1b[0m';
      const suffix = item.type === 'directory' ? '/' : '';
      this.terminal.write(`${color}${item.name}${suffix}\x1b[0m  `);
    });
    this.terminal.write('\r\n');
  }

  runCd(args) {
    if (args.length === 0) {
      this.currentPath = '/home/user';
      return;
    }
    const targetPath = args[0];
    const resolvedPath = this.filesystem.resolvePath(this.currentPath, targetPath);
    if (this.filesystem.exists(resolvedPath) && this.filesystem.isDirectory(resolvedPath)) {
      this.currentPath = resolvedPath;
    } else {
      this.terminal.write(`\x1b[1;31mcd: ${targetPath}: No such file or directory\x1b[0m\r\n`);
    }
  }


  handleTabCompletion() {
    const input = this.currentInput.trim();
    const parts = input.split(/\s+/);
    const lastPart = parts[parts.length - 1] || '';

    // If first word, complete commands
    if (parts.length === 1) {
      const commands = ['help', 'whoami', 'companies', 'achievements', 'repos', 'scan', 'sysmon', 'netmap', 'neofetch', 'skills', 'wallet', 'theme', 'ls', 'cd', 'cat', 'clear', 'hack', 'cv', 'github', 'stats', 'analytics', 'github-stats', 'ghstats', 'market', 'crypto', 'coins', 'indices', 'home', 'install', 'opm', 'shell'];
      const matches = commands.filter(cmd => cmd.startsWith(lastPart));

      if (matches.length === 1) {
        const completion = matches[0].slice(lastPart.length);
        this.currentInput += completion;
        this.terminal.write(completion);
      } else if (matches.length > 1) {
        this.terminal.write('\r\n');
        matches.forEach(match => this.terminal.write(match + '  '));
        this.terminal.write('\r\n' + this.getPromptText() + this.currentInput);
      }
    } else {
      // Try to complete file paths
      const resolvedPath = this.filesystem.resolvePath(this.currentPath, lastPart);
      const dirPath = resolvedPath.substring(0, resolvedPath.lastIndexOf('/')) || this.currentPath;
      const prefix = lastPart.substring(lastPart.lastIndexOf('/') + 1);

      const listing = this.filesystem.list(dirPath);
      if (listing) {
        const matches = listing
          .map(item => item.name)
          .filter(name => name.startsWith(prefix));

        if (matches.length === 1) {
          const completion = matches[0].slice(prefix.length);
          this.currentInput += completion;
          this.terminal.write(completion);
        } else if (matches.length > 1) {
          this.terminal.write('\r\n');
          matches.forEach(match => this.terminal.write(match + '  '));
          this.terminal.write('\r\n' + this.getPromptText() + this.currentInput);
        }
      }
    }
  }

  async initEcmaOS() {
    try {
      const module = await import('/assets/js/terminal/ecmaos-kernel.js');
      const KernelClass = module.Kernel;
      console.log('EcmaOS Kernel Class Loaded:', KernelClass);

      // Instantiate the kernel
      if (typeof KernelClass === 'function') {
        this.ecmaKernel = new KernelClass();
        console.log('EcmaOS Kernel Instance Created:', this.ecmaKernel);
      } else if (typeof KernelClass === 'object') {
        // If it's already an instance or singleton
        this.ecmaKernel = KernelClass;
        console.log('EcmaOS Kernel Object:', this.ecmaKernel);
      }

      // Try to initialize if method exists
      if (this.ecmaKernel && typeof this.ecmaKernel.start === 'function') {
        await this.ecmaKernel.start(this.terminal);
      } else if (this.ecmaKernel && typeof this.ecmaKernel.init === 'function') {
        await this.ecmaKernel.init(this.terminal);
      }

      console.log('EcmaOS Kernel Ready. Execute method:', typeof this.ecmaKernel?.execute);
    } catch (error) {
      console.error('Error loading EcmaOS:', error);
    }
  }
}

window.TerminalOS = TerminalOS;

