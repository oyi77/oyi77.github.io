class SitesApp {
  constructor(terminal, filesystem, windowManager) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
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

    try {
      const response = await fetch('/_data/terminal.yml');
      if (response.ok) {
        const text = await response.text();
        const data = this.parseYaml(text);
        this.sitesData = data?.sites || [];
      }
    } catch (e) {
      this.sitesData = [];
    }
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

  parseYaml(text) {
    // Simplified YAML parser
    const data = {};
    const lines = text.split('\n');
    const context = [{ obj: data, indent: -1, key: null }];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      if (trimmed.startsWith('#') || !trimmed) continue;

      const indent = line.match(/^(\s*)/)[1].length;
      const isListItem = trimmed.startsWith('-');
      
      while (context.length > 1 && context[context.length - 1].indent >= indent) {
        context.pop();
      }
      
      const current = context[context.length - 1].obj;
      const currentKey = context[context.length - 1].key;
      
      if (isListItem) {
        const itemContent = trimmed.substring(1).trim();
        const itemMatch = itemContent.match(/^([^:]+):\s*(.+)?$/);
        
        let targetKey = currentKey;
        if (!targetKey && i > 0) {
          for (let j = i - 1; j >= 0; j--) {
            const prevLine = lines[j].trim();
            if (prevLine && !prevLine.startsWith('#') && !prevLine.startsWith('-')) {
              const prevMatch = prevLine.match(/^([^:]+):\s*$/);
              if (prevMatch) {
                targetKey = prevMatch[1].trim();
                break;
              }
            }
          }
        }
        
        if (itemMatch) {
          const key = itemMatch[1].trim();
          let value = (itemMatch[2] || '').trim();
          
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          
          const parent = context.length > 1 ? context[context.length - 2].obj : data;
          const arrayKey = context[context.length - 1].key || targetKey;
          
          if (arrayKey) {
            if (!parent[arrayKey] || !Array.isArray(parent[arrayKey])) {
              parent[arrayKey] = [];
            }
            
            if (parent[arrayKey].length === 0 || 
                typeof parent[arrayKey][parent[arrayKey].length - 1] !== 'object' ||
                Array.isArray(parent[arrayKey][parent[arrayKey].length - 1])) {
              parent[arrayKey].push({});
            }
            
            const lastObj = parent[arrayKey][parent[arrayKey].length - 1];
            lastObj[key] = value || '';
            
            if (!value) {
              context.push({ obj: lastObj, indent: indent, key: key });
            }
          }
        } else {
          const parent = context.length > 1 ? context[context.length - 2].obj : data;
          const arrayKey = context[context.length - 1].key || targetKey;
          
          if (arrayKey) {
            if (!parent[arrayKey] || !Array.isArray(parent[arrayKey])) {
              parent[arrayKey] = [];
            }
            parent[arrayKey].push(itemContent);
          }
        }
      } else {
        const match = trimmed.match(/^([^:]+):\s*(.+)?$/);
        if (match) {
          const key = match[1].trim();
          let value = (match[2] || '').trim();
          
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          
          if (value === '' || value === 'null') {
            current[key] = {};
            context.push({ obj: current[key], indent: indent, key: key });
          } else {
            current[key] = value;
          }
        }
      }
    }
    
    return data;
  }
}

window.SitesApp = SitesApp;

