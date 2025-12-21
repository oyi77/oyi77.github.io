class StatsApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        const width = this.terminal.cols || 60;

        // Get stats from JEKYLL_DATA
        const repoStats = window.JEKYLL_DATA?.repository_stats;
        const metrics = window.JEKYLL_DATA?.metrics;
        const timeline = window.JEKYLL_DATA?.timeline;

        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36m>> STATISTICS DASHBOARD <<\x1b[0m', width) + '\r\n\r\n');

        // Repository Statistics
        if (repoStats && repoStats.summary) {
            this.terminal.write('  \x1b[1;33mREPOSITORY STATISTICS:\x1b[0m\r\n');
            const summary = repoStats.summary;
            this.terminal.write(`    Total Repositories: \x1b[1;32m${summary.total_repos || 0}\x1b[0m\r\n`);
            this.terminal.write(`    Total Stars: \x1b[1;32m${summary.total_stars || 0}\x1b[0m\r\n`);
            this.terminal.write(`    Total Forks: \x1b[1;32m${summary.total_forks || 0}\x1b[0m\r\n`);
            this.terminal.write(`    Total Commits: \x1b[1;32m${summary.total_commits || 0}\x1b[0m\r\n`);
            
            if (summary.languages && Object.keys(summary.languages).length > 0) {
                this.terminal.write('    Languages: ');
                const langList = Object.keys(summary.languages).slice(0, 5).join(', ');
                this.terminal.write(`\x1b[1;36m${langList}\x1b[0m\r\n`);
            }
            this.terminal.write('\r\n');
        }

        // Performance Metrics
        if (metrics) {
            if (metrics.code_quality && Object.keys(metrics.code_quality).length > 0) {
                this.terminal.write('  \x1b[1;33mCODE QUALITY METRICS:\x1b[0m\r\n');
                const quality = metrics.code_quality;
                this.terminal.write(`    Quality Score: \x1b[1;32m${quality.quality_score || 'N/A'}\x1b[0m\r\n`);
                this.terminal.write(`    Rating: \x1b[1;32m${quality.quality_rating || 'N/A'}\x1b[0m\r\n`);
                this.terminal.write(`    Avg Stars/Repo: \x1b[1;32m${quality.average_stars || 0}\x1b[0m\r\n`);
                this.terminal.write('\r\n');
            }

            if (metrics.project_health && Object.keys(metrics.project_health).length > 0) {
                this.terminal.write('  \x1b[1;33mPROJECT HEALTH:\x1b[0m\r\n');
                const health = metrics.project_health;
                this.terminal.write(`    Active Repos: \x1b[1;32m${health.active_repositories || 0}\x1b[0m\r\n`);
                this.terminal.write(`    Health Score: \x1b[1;32m${health.health_score || 'N/A'}\x1b[0m\r\n`);
                this.terminal.write(`    Rating: \x1b[1;32m${health.health_rating || 'N/A'}\x1b[0m\r\n`);
                this.terminal.write('\r\n');
            }
        }

        // Timeline Summary
        if (timeline && timeline.summary) {
            this.terminal.write('  \x1b[1;33mCAREER SUMMARY:\x1b[0m\r\n');
            const summary = timeline.summary;
            this.terminal.write(`    Total Duration: \x1b[1;32m${summary.total_duration_years || 0} years\x1b[0m\r\n`);
            this.terminal.write(`    Companies: \x1b[1;32m${summary.total_companies || 0}\x1b[0m\r\n`);
            this.terminal.write(`    Team Members Led: \x1b[1;32m${summary.total_team_members_led || 0}+\x1b[0m\r\n`);
            this.terminal.write('\r\n');
        }

        // Generated timestamp
        if (repoStats && repoStats.generated_at) {
            this.terminal.write('  \x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
            this.terminal.write(`  \x1b[1;30mLast updated: ${repoStats.generated_at}\x1b[0m\r\n`);
        }

        this.terminal.write('\r\n');
    }
}

window.StatsApp = StatsApp;

