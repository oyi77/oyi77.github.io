class SkillsApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        const width = this.terminal.cols || 60;
        const showVisual = args.includes('--visual') || args.includes('--matrix') || args.includes('-v');

        if (showVisual) {
            await this.showVisualMatrix(width);
        } else {
            await this.showStandardList(width);
        }
    }

    async showStandardList(width) {
        const skills = [
            { cat: 'PROGRAMMING', items: ['Python', 'JS/TS', 'C++', 'PHP', 'MQL4/5'] },
            { cat: 'FRAMEWORKS', items: ['React', 'Node.js', 'Django', 'Laravel'] },
            { cat: 'INFRASTRUCTURE', items: ['Docker', 'K8s', 'AWS', 'GCP', 'CI/CD'] },
            { cat: 'SPECIALIZED', items: ['Blockchain', 'Algo Trading', 'Embedded'] }
        ];

        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;32mCAPABILITY MATRIX LOADING...\x1b[0m', width) + '\r\n');
        this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');

        for (const skillGroup of skills) {
            this.terminal.write(`  \x1b[1;33m${skillGroup.cat.padEnd(15)}\x1b[0m : `);
            const items = skillGroup.items.join(' | ');
            this.terminal.write(`\x1b[1;36m${items}\x1b[0m\r\n`);
            await new Promise(r => setTimeout(r, 100));
        }

        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;32m[ OPERATION COMPLETE ]\x1b[0m', width) + '\r\n');
        this.terminal.write('  Use \x1b[1;32mskills --visual\x1b[0m for proficiency matrix\r\n');
    }

    async showVisualMatrix(width) {
        const skillsData = window.JEKYLL_DATA?.terminal?.skills;
        const skills = [
            { name: 'Python', level: 95, years: 7, category: 'Programming' },
            { name: 'JavaScript/TypeScript', level: 90, years: 7, category: 'Programming' },
            { name: 'React', level: 88, years: 6, category: 'Framework' },
            { name: 'Node.js', level: 90, years: 6, category: 'Framework' },
            { name: 'Docker', level: 85, years: 5, category: 'Infrastructure' },
            { name: 'Kubernetes', level: 80, years: 4, category: 'Infrastructure' },
            { name: 'AWS', level: 85, years: 5, category: 'Cloud' },
            { name: 'PostgreSQL', level: 88, years: 6, category: 'Database' },
            { name: 'Blockchain', level: 85, years: 4, category: 'Specialized' },
            { name: 'Algorithmic Trading', level: 90, years: 5, category: 'Specialized' }
        ];

        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36mSKILLS PROFICIENCY MATRIX\x1b[0m', width) + '\r\n');
        this.terminal.write('  ' + '\x1b[1;30m' + '='.repeat(width - 10) + '\x1b[0m\r\n\r\n');

        // Group by category
        const categories = {};
        skills.forEach(skill => {
            if (!categories[skill.category]) {
                categories[skill.category] = [];
            }
            categories[skill.category].push(skill);
        });

        for (const [category, categorySkills] of Object.entries(categories)) {
            this.terminal.write(`  \x1b[1;33m${category.toUpperCase()}\x1b[0m\r\n`);
            this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');

            for (const skill of categorySkills) {
                const barWidth = Math.floor((skill.level / 100) * 30);
                const bar = '█'.repeat(barWidth) + '░'.repeat(30 - barWidth);
                const levelColor = skill.level >= 90 ? '\x1b[1;32m' : skill.level >= 80 ? '\x1b[1;33m' : '\x1b[1;36m';
                
                this.terminal.write(`  \x1b[1;36m${skill.name.padEnd(25)}\x1b[0m `);
                this.terminal.write(`${levelColor}${bar}\x1b[0m `);
                this.terminal.write(`${levelColor}${skill.level}%\x1b[0m `);
                this.terminal.write(`\x1b[1;30m(${skill.years}y)\x1b[0m\r\n`);
            }
            this.terminal.write('\r\n');
        }

        // Certifications
        const certifications = window.JEKYLL_DATA?.terminal?.certifications || [];
        if (certifications.length > 0) {
            this.terminal.write('  \x1b[1;33mCERTIFICATIONS\x1b[0m\r\n');
            this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');
            certifications.slice(0, 5).forEach(cert => {
                this.terminal.write(`    \x1b[1;32m✓\x1b[0m ${cert.name} - ${cert.issuer}\r\n`);
            });
            this.terminal.write('\r\n');
        }

        this.terminal.write('  ' + '\x1b[1;30m' + '='.repeat(width - 10) + '\x1b[0m\r\n');
        this.terminal.write('  Legend: \x1b[1;32m90-100%\x1b[0m Expert | \x1b[1;33m80-89%\x1b[0m Advanced | \x1b[1;36m<80%\x1b[0m Proficient\r\n');
    }
}

window.SkillsApp = SkillsApp;
