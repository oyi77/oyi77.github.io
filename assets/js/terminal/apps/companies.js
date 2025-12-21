class CompaniesApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
        this.companies = null;
    }

    async loadData() {
        // Try injected Jekyll data first (preferred)
        if (window.JEKYLL_DATA && window.JEKYLL_DATA.companies && window.JEKYLL_DATA.companies.companies) {
            this.companies = window.JEKYLL_DATA.companies.companies;
            console.log('Companies data loaded from JEKYLL_DATA');
            return;
        }

        // Fallback to fetch if data not injected (for local dev or direct file access)
        const paths = ['/_data/companies.yml', './_data/companies.yml', '../_data/companies.yml'];
        for (const path of paths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    const text = await response.text();
                    this.companies = this.parseYaml(text);
                    console.log('Companies data loaded from fetch:', path);
                    return;
                }
            } catch (e) { }
        }
        console.error('Failed to load companies data');
    }

    parseYaml(text) {
        const companies = [];
        const lines = text.split('\n');
        let current = null;
        let inAchievements = false;

        for (let line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;

            if (trimmed.startsWith('- id:')) {
                if (current) companies.push(current);
                current = { achievements: [], key_metrics: [] };
                current.id = trimmed.split(':')[1].trim().replace(/['"]/g, '');
            } else if (current) {
                if (trimmed.startsWith('name:')) current.name = trimmed.split(':')[1].trim().replace(/['"]/g, '');
                else if (trimmed.startsWith('role:')) current.role = trimmed.split(':')[1].trim().replace(/['"]/g, '');
                else if (trimmed.startsWith('period:')) current.period = trimmed.split(':')[1].trim().replace(/['"]/g, '');
                else if (trimmed.startsWith('team_size:')) current.team_size = trimmed.split(':')[1].trim().replace(/['"]/g, '');
                else if (trimmed.startsWith('tagline:')) current.tagline = trimmed.split(':')[1].trim().replace(/['"]/g, '');
                else if (trimmed.startsWith('achievements:')) inAchievements = true;
                else if (trimmed.startsWith('- ') && inAchievements) {
                    current.achievements.push(trimmed.substring(2).replace(/['"]/g, ''));
                } else if (trimmed.includes(':') && !trimmed.startsWith('-')) {
                    inAchievements = false;
                }
            }
        }
        if (current) companies.push(current);
        return companies;
    }

    async run(args) {
        if (!this.companies) await this.loadData();
        const width = this.terminal.cols || 60;

        if (args.length === 0) {
            this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;32mENTERPRISE LEADERSHIP RECORDS\x1b[0m', width) + '\r\n');
            this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
            this.companies.forEach(c => {
                this.terminal.write(`  \x1b[1;36m${c.id.padEnd(15)}\x1b[0m | ${c.name}\r\n`);
            });
            this.terminal.write('\r\n  Usage: \x1b[1;33mcompanies <id>\x1b[0m\r\n');
            return;
        }

        const id = args[0].toLowerCase();
        const company = this.companies.find(c => c.id === id);

        if (!company) {
            this.terminal.write(`\x1b[1;31mRecord not found: ${id}\x1b[0m\r\n`);
            return;
        }

        this.terminal.write(`\r\n  \x1b[1;32mCOMPANY PROFILE: ${company.name.toUpperCase()}\x1b[0m\r\n`);
        this.terminal.write(`  \x1b[1;33m${company.tagline}\x1b[0m\r\n`);
        this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
        this.terminal.write(`  \x1b[1;36mRole:\x1b[0m      ${company.role}\r\n`);
        this.terminal.write(`  \x1b[1;36mPeriod:\x1b[0m    ${company.period}\r\n`);
        this.terminal.write(`  \x1b[1;36mTeam Size:\x1b[0m ${company.team_size}\r\n\r\n`);

        this.terminal.write(`  \x1b[1;33mKEY ACHIEVEMENTS:\x1b[0m\r\n`);
        company.achievements.forEach(a => {
            this.terminal.write(TerminalUtils.wrap(`\x1b[1;32m[+]\x1b[0m ${a}`, width - 5) + '\r\n');
        });
        this.terminal.write('\r\n');
    }
}

window.CompaniesApp = CompaniesApp;
