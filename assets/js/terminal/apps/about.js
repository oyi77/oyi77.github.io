class AboutApp {
  constructor(terminal, filesystem, windowManager) {
    this.terminal = terminal;
    this.filesystem = filesystem;
    this.windowManager = windowManager;
    this.aboutData = null;
  }

  async run(args) {
    // Load data if not already loaded
    if (!this.aboutData) {
      await this.loadData();
    }

    const subcommand = args[0]?.toLowerCase();

    switch (subcommand) {
      case 'experience':
      case 'exp':
        this.showExperience();
        break;
      case 'skills':
        this.showSkills();
        break;
      case 'projects':
        this.showProjects();
        break;
      case 'education':
      case 'edu':
        this.showEducation();
        break;
      case 'certifications':
      case 'certs':
        this.showCertifications();
        break;
      default:
        this.showSummary();
    }
  }

  async loadData() {
    // Try to load from window.JEKYLL_DATA first (injected by Jekyll)
    if (window.JEKYLL_DATA && window.JEKYLL_DATA.terminal) {
      this.aboutData = window.JEKYLL_DATA.terminal;
      return;
    }

    // Fallback: Try to load about data from terminal.yml
    try {
      const response = await fetch('/_data/terminal.yml');
      if (response.ok) {
        const text = await response.text();
        this.aboutData = this.parseYaml(text);
        return;
      }
    } catch (e) {
      // Fallback to default
    }

    // Fallback to _config.yml author info
    try {
      const response = await fetch('/_config.yml');
      if (response.ok) {
        const text = await response.text();
        this.aboutData = this.parseYaml(text);
      }
    } catch (e) {
      // Use defaults
      this.aboutData = {};
    }
  }

  showSummary() {
    const data = this.aboutData;
    const name = data?.name || 'Developer';
    const title = data?.title || '';
    const bio = data?.bio || 'Welcome to my terminal portfolio!';
    const location = data?.location || '';
    const github = data?.github_username || '';
    const summary = data?.summary || '';
    const links = this.parseLinks(data?.links) || [];
    const calComUrl = data?.contact_form?.cal_com_url || 'https://cal.com/oyi77';

    let aboutText = `
\x1b[1;36m╔═══════════════════════════════════════════════════════════╗\x1b[0m
\x1b[1;36m║\x1b[0m  \x1b[1;33mAbout Me\x1b[0m                                                  \x1b[1;36m║\x1b[0m
\x1b[1;36m╚═══════════════════════════════════════════════════════════╝\x1b[0m

\x1b[1;32mName:\x1b[0m        ${name}
${title ? `\x1b[1;32mTitle:\x1b[0m       ${title}\r\n` : ''}\x1b[1;32mBio:\x1b[0m         ${bio}
${summary ? `\x1b[1;32mSummary:\x1b[0m     ${summary}\r\n` : ''}${location ? `\x1b[1;32mLocation:\x1b[0m    ${location}\r\n` : ''}${github ? `\x1b[1;32mGitHub:\x1b[0m       https://github.com/${github}\r\n` : ''}
${links.length > 0 ? `\x1b[1;32mLinks:\x1b[0m\r\n${links.map(link => `              \x1b[1;36m${link.label}:\x1b[0m ${link.url}`).join('\r\n')}\r\n` : ''}
\x1b[1;36m─────────────────────────────────────────────────────────────\x1b[0m

\x1b[1;33mContact:\x1b[0m
  Use the contact form widget (bottom right) or visit:
  \x1b[1;36m${calComUrl}\x1b[0m - Schedule a call

\x1b[1;33mQuick Links:\x1b[0m
  \x1b[1;33mcv\x1b[0m              - Open CV OS (Interactive Portfolio)
  \x1b[1;33msites\x1b[0m            - Browse all websites & projects
  \x1b[1;33mdashboard\x1b[0m        - Show dashboard

\x1b[1;33mAvailable sub-commands:\x1b[0m
  \x1b[1;33mabout experience\x1b[0m  - Show work experience
  \x1b[1;33mabout skills\x1b[0m      - Show skills by category
  \x1b[1;33mabout projects\x1b[0m   - Show open-source projects
  \x1b[1;33mabout education\x1b[0m   - Show education details
  \x1b[1;33mabout certifications\x1b[0m - Show certifications

Type \x1b[1;33mprojects\x1b[0m to see my GitHub Pages projects.
Type \x1b[1;33mhelp\x1b[0m for available commands.
`;

    this.terminal.write(aboutText);
  }

  showExperience() {
    const experience = this.aboutData?.experience || [];
    
    if (experience.length === 0) {
      this.terminal.write('\x1b[1;33mNo experience data available.\x1b[0m\r\n');
      return;
    }

    let text = `
\x1b[1;36m╔═══════════════════════════════════════════════════════════╗\x1b[0m
\x1b[1;36m║\x1b[0m  \x1b[1;33mWork Experience\x1b[0m                                            \x1b[1;36m║\x1b[0m
\x1b[1;36m╚═══════════════════════════════════════════════════════════╝\x1b[0m

`;

    experience.forEach((exp, index) => {
      text += `\x1b[1;32m[${index + 1}] ${exp.company || 'Company'}\x1b[0m\r\n`;
      text += `     \x1b[1;33mRole:\x1b[0m       ${exp.role || 'N/A'}\r\n`;
      text += `     \x1b[1;33mPeriod:\x1b[0m     ${exp.period || 'N/A'}\r\n`;
      if (exp.location) {
        text += `     \x1b[1;33mLocation:\x1b[0m   ${exp.location}\r\n`;
      }
      if (exp.achievements && Array.isArray(exp.achievements)) {
        text += `     \x1b[1;33mAchievements:\x1b[0m\r\n`;
        exp.achievements.forEach(achievement => {
          text += `       • ${achievement}\r\n`;
        });
      }
      text += '\r\n';
    });

    this.terminal.write(text);
  }

  showSkills() {
    const skills = this.aboutData?.skills || {};
    
    if (Object.keys(skills).length === 0) {
      this.terminal.write('\x1b[1;33mNo skills data available.\x1b[0m\r\n');
      return;
    }

    let text = `
\x1b[1;36m╔═══════════════════════════════════════════════════════════╗\x1b[0m
\x1b[1;36m║\x1b[0m  \x1b[1;33mSkills\x1b[0m                                                       \x1b[1;36m║\x1b[0m
\x1b[1;36m╚═══════════════════════════════════════════════════════════╝\x1b[0m

`;

    const categoryNames = {
      programming_languages: 'Programming Languages',
      frameworks: 'Frameworks & Libraries',
      databases: 'Databases',
      tools: 'Tools & Platforms',
      specialized: 'Specialized'
    };

    for (const [category, items] of Object.entries(skills)) {
      if (Array.isArray(items) && items.length > 0) {
        const categoryName = categoryNames[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        text += `\x1b[1;32m${categoryName}:\x1b[0m\r\n`;
        text += `  ${items.join(', ')}\r\n\r\n`;
      }
    }

    this.terminal.write(text);
  }

  showProjects() {
    const projects = this.aboutData?.projects || [];
    
    if (projects.length === 0) {
      this.terminal.write('\x1b[1;33mNo projects data available.\x1b[0m\r\n');
      return;
    }

    let text = `
\x1b[1;36m╔═══════════════════════════════════════════════════════════╗\x1b[0m
\x1b[1;36m║\x1b[0m  \x1b[1;33mOpen-Source Projects\x1b[0m                                        \x1b[1;36m║\x1b[0m
\x1b[1;36m╚═══════════════════════════════════════════════════════════╝\x1b[0m

`;

    projects.forEach((project, index) => {
      text += `\x1b[1;32m[${index + 1}] ${project.name || 'Project'}\x1b[0m\r\n`;
      if (project.description) {
        text += `     ${project.description}\r\n`;
      }
      if (project.technologies) {
        text += `     \x1b[1;36mTech:\x1b[0m ${project.technologies}\r\n`;
      }
      if (project.url) {
        text += `     \x1b[1;36mURL:\x1b[0m  ${project.url}\r\n`;
      }
      text += '\r\n';
    });

    this.terminal.write(text);
  }

  showEducation() {
    const education = this.aboutData?.education || {};
    
    if (!education.institution) {
      this.terminal.write('\x1b[1;33mNo education data available.\x1b[0m\r\n');
      return;
    }

    let text = `
\x1b[1;36m╔═══════════════════════════════════════════════════════════╗\x1b[0m
\x1b[1;36m║\x1b[0m  \x1b[1;33mEducation\x1b[0m                                                  \x1b[1;36m║\x1b[0m
\x1b[1;36m╚═══════════════════════════════════════════════════════════╝\x1b[0m

\x1b[1;32mInstitution:\x1b[0m ${education.institution || 'N/A'}
\x1b[1;32mDegree:\x1b[0m      ${education.degree || 'N/A'}
${education.gpa ? `\x1b[1;32mGPA:\x1b[0m         ${education.gpa}\r\n` : ''}\x1b[1;32mPeriod:\x1b[0m      ${education.period || 'N/A'}
${education.location ? `\x1b[1;32mLocation:\x1b[0m    ${education.location}\r\n` : ''}
`;

    this.terminal.write(text);
  }

  showCertifications() {
    const certifications = this.aboutData?.certifications || [];
    
    if (certifications.length === 0) {
      this.terminal.write('\x1b[1;33mNo certifications data available.\x1b[0m\r\n');
      return;
    }

    let text = `
\x1b[1;36m╔═══════════════════════════════════════════════════════════╗\x1b[0m
\x1b[1;36m║\x1b[0m  \x1b[1;33mCertifications\x1b[0m                                             \x1b[1;36m║\x1b[0m
\x1b[1;36m╚═══════════════════════════════════════════════════════════╝\x1b[0m

`;

    certifications.forEach((cert, index) => {
      text += `\x1b[1;32m[${index + 1}] ${cert.name || 'Certification'}\x1b[0m\r\n`;
      if (cert.issuer) {
        text += `     \x1b[1;36mIssuer:\x1b[0m ${cert.issuer}\r\n`;
      }
      text += '\r\n';
    });

    this.terminal.write(text);
  }

  parseYaml(text) {
    // Simplified YAML parser for our specific structure
    // This handles: key-value pairs, simple arrays, and nested objects
    const data = {};
    const lines = text.split('\n');
    const context = [{ obj: data, indent: -1, key: null }];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      if (trimmed.startsWith('#') || !trimmed) continue;

      const indent = line.match(/^(\s*)/)[1].length;
      const isListItem = trimmed.startsWith('-');
      
      // Find the right context level
      while (context.length > 1 && context[context.length - 1].indent >= indent) {
        context.pop();
      }
      
      const current = context[context.length - 1].obj;
      const currentKey = context[context.length - 1].key;
      
      if (isListItem) {
        const itemContent = trimmed.substring(1).trim();
        const itemMatch = itemContent.match(/^([^:]+):\s*(.+)?$/);
        
        // Determine which array we're adding to
        let targetKey = currentKey;
        if (!targetKey && i > 0) {
          // Look backwards for the array key
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
          // Object in array: "- key: value"
          const key = itemMatch[1].trim();
          let value = (itemMatch[2] || '').trim();
          
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          
          // Get the array from parent context
          const parent = context.length > 1 ? context[context.length - 2].obj : data;
          const arrayKey = context[context.length - 1].key || targetKey;
          
          if (arrayKey) {
            if (!parent[arrayKey] || !Array.isArray(parent[arrayKey])) {
              parent[arrayKey] = [];
            }
            
            // Get or create the last object
            if (parent[arrayKey].length === 0 || 
                typeof parent[arrayKey][parent[arrayKey].length - 1] !== 'object' ||
                Array.isArray(parent[arrayKey][parent[arrayKey].length - 1])) {
              parent[arrayKey].push({});
            }
            
            const lastObj = parent[arrayKey][parent[arrayKey].length - 1];
            lastObj[key] = value || '';
            
            // If value is empty, it might be a nested object
            if (!value) {
              context.push({ obj: lastObj, indent: indent, key: key });
            }
          }
        } else {
          // Simple array item: "- value"
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
        // Key-value pair: "key: value"
        const match = trimmed.match(/^([^:]+):\s*(.+)?$/);
        if (match) {
          const key = match[1].trim();
          let value = (match[2] || '').trim();
          
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          
          if (value === '' || value === 'null') {
            // Empty value means nested object or array
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

  parseLinks(links) {
    if (!links) return [];
    if (Array.isArray(links)) return links;
    if (typeof links === 'string') {
      try {
        return JSON.parse(links);
      } catch (e) {
        return [];
      }
    }
    return [];
  }
}

window.AboutApp = AboutApp;
