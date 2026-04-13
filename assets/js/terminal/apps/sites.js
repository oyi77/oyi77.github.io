class SitesApp {
  constructor(terminal, filesystem, windowManager, os) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
    this.os = os;
    this.sitesData = null;
  }

  async run(args) {
    await this.loadData();

    const subcommand = args[0]?.toLowerCase();

    switch (subcommand) {
      case 'open':
      case 'visit':
        if (args[1]) {
          await this.openSite(args[1]);
        } else {
          this.terminal.write('\x1b[1;31mUsage: sites open <site-name>\x1b[0m\r\n');
        }
        break;
      case 'featured':
        this.showFeatured();
        break;
      default:
        this.showAll();
    }
  }

  async loadData() {
    if (this.sitesData) return;
    this.sitesData = window.JEKYLL_DATA?.terminal?.sites || [];
  }

  showAll() {
    const sites = this.sitesData || [];
    
    if (sites.length === 0) {
      this.terminal.write('\x1b[1;33mNo sites configured.\x1b[0m\r\n');
      return;
    }

    let text = `
\x1b[1;36m╔═══════════════════════════════════════════════════════════╗\x1b[0m
\x1b[1;36m║\x1b[0m  \x1b[1;33mMy Websites & Projects\x1b[0m                                      \x1b[1;36m║\x1b[0m
\x1b[1;36m╚═══════════════════════════════════════════════════════════╝\x1b[0m

`;

    // Group by category
    const byCategory = {};
    sites.forEach(site => {
      const category = site.category || 'other';
      if (!byCategory[category]) {
        byCategory[category] = [];
      }
      byCategory[category].push(site);
    });

    // Display by category
    const categoryNames = {
      portfolio: 'Portfolio',
      trading: 'Trading Platforms',
      ecommerce: 'E-Commerce',
      platform: 'Platforms',
      other: 'Other'
    };

    let index = 1;
    for (const [category, categorySites] of Object.entries(byCategory)) {
      const categoryName = categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
      text += `\x1b[1;35m${categoryName}:\x1b[0m\r\n`;
      
      categorySites.forEach(site => {
        const num = index.toString().padStart(2, '0');
        const featured = site.featured ? ' \x1b[1;33m★\x1b[0m' : '';
        text += `  \x1b[1;32m[${num}]\x1b[0m \x1b[1;33m${site.name}\x1b[0m${featured}\r\n`;
        if (site.description) {
          text += `      ${site.description}\r\n`;
        }
        text += `      \x1b[1;36mURL:\x1b[0m ${site.url}\r\n`;
        text += `      \x1b[1;36mOpen:\x1b[0m \x1b[1;33msites open ${site.name.toLowerCase().replace(/\s+/g, '-')}\x1b[0m\r\n`;
        text += '\r\n';
        index++;
      });
    }

    text += `\x1b[1;36m─────────────────────────────────────────────────────────────\x1b[0m\r\n`;
    text += `\r\n`;
    text += `Quick access:\r\n`;
    text += `  \x1b[1;33msites featured\x1b[0m - Show featured sites only\r\n`;
    text += `  \x1b[1;33msites open <name>\x1b[0m - Open a site in new tab\r\n`;
    text += `  \x1b[1;33mcv\x1b[0m - Open CV OS (portfolio)\r\n`;

    this.terminal.write(text);
  }

  showFeatured() {
    const sites = (this.sitesData || []).filter(site => site.featured);
    
    if (sites.length === 0) {
      this.terminal.write('\x1b[1;33mNo featured sites.\x1b[0m\r\n');
      return;
    }

    let text = `
\x1b[1;36m╔═══════════════════════════════════════════════════════════╗\x1b[0m
\x1b[1;36m║\x1b[0m  \x1b[1;33mFeatured Websites\x1b[0m \x1b[1;33m★\x1b[0m                                         \x1b[1;36m║\x1b[0m
\x1b[1;36m╚═══════════════════════════════════════════════════════════╝\x1b[0m

`;

    sites.forEach((site, index) => {
      const num = (index + 1).toString().padStart(2, '0');
      text += `\x1b[1;32m[${num}]\x1b[0m \x1b[1;33m${site.name}\x1b[0m \x1b[1;33m★\x1b[0m\r\n`;
      if (site.description) {
        text += `     ${site.description}\r\n`;
      }
      text += `     \x1b[1;36mURL:\x1b[0m ${site.url}\r\n`;
      text += `     \x1b[1;36mOpen:\x1b[0m \x1b[1;33msites open ${site.name.toLowerCase().replace(/\s+/g, '-')}\x1b[0m\r\n`;
      text += '\r\n';
    });

    this.terminal.write(text);
  }

  async openSite(siteName) {
    const sites = this.sitesData || [];
    const normalizedName = siteName.toLowerCase().replace(/[-\s]/g, '');
    
    const site = sites.find(s => {
      const normalized = s.name.toLowerCase().replace(/[-\s]/g, '');
      return normalized === normalizedName || normalized.includes(normalizedName) || normalizedName.includes(normalized);
    });

    if (site) {
      window.open(site.url, '_blank');
      this.terminal.write(`\x1b[1;32mOpening ${site.name}...\x1b[0m\r\n`);
      this.terminal.write(`\x1b[1;36mURL: ${site.url}\x1b[0m\r\n`);
    } else {
      this.terminal.write(`\x1b[1;31mSite not found: ${siteName}\x1b[0m\r\n`);
      this.terminal.write(`Type \x1b[1;33msites\x1b[0m to see all available sites.\r\n`);
    }
  }

}

window.SitesApp = SitesApp;

