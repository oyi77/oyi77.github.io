class AchievementsApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        const data = window.JEKYLL_DATA?.terminal || {};
        const portalAchievements = window.JEKYLL_DATA?.portal?.achievements || [];
        const width = this.terminal.cols || 60;

        const defaultRecords = [
            { id: 'TRA-01', title: '70% Accuracy in Trading', comp: 'Bitwyre' },
            { id: 'EFF-01', title: '30% Increase Efficiency', comp: 'Viapulsa' },
            { id: 'LED-01', title: 'Led 3000+ Employees', comp: 'GarudaMedia' },
            { id: 'MIN-01', title: 'Pioneered Legal Crypto', comp: 'Solomon' },
            { id: 'REV-01', title: 'Managed 5B+ Turnover', comp: 'Berkah' }
        ];

        let records = defaultRecords;
        // Build from experience data if available
        if (data.experience && data.experience.length > 0) {
            let idx = 0;
            records = data.experience
                .filter(exp => exp.highlight || exp.achievement)
                .map(exp => {
                    idx++;
                    const prefix = (exp.company || exp.name || 'UNK').substring(0, 3).toUpperCase();
                    return {
                        id: `${prefix}-${String(idx).padStart(2, '0')}`,
                        title: exp.highlight || exp.achievement || exp.role || '',
                        comp: exp.company || exp.name || ''
                    };
                });
            if (records.length === 0) records = defaultRecords;
        }
        // Merge portal achievements if available
        if (portalAchievements.length > 0) {
            portalAchievements.forEach((ach, i) => {
                records.push({
                    id: `PRT-${String(i + 1).padStart(2, '0')}`,
                    title: ach.title || ach.name || '',
                    comp: ach.company || ach.source || ''
                });
            });
        }

        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;32mQUERYING MISSION ACCOMPLISHMENTS...\x1b[0m', width) + '\r\n');
        this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');

        records.forEach(r => {
            this.terminal.write(`  \x1b[1;33m${r.id}\x1b[0m | \x1b[1;36m${r.title.padEnd(25)}\x1b[0m | ${r.comp}\r\n`);
        });

        this.terminal.write('\r\n  ' + TerminalUtils.center('\x1b[1;32mType \'companies <id>\' for details.\x1b[0m', width) + '\r\n');
    }
}

window.AchievementsApp = AchievementsApp;
