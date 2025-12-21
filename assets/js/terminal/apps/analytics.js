class AnalyticsApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        const width = this.terminal.cols || 60;

        const analytics = window.JEKYLL_DATA?.analytics;
        const metrics = window.JEKYLL_DATA?.metrics;

        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36m>> ANALYTICS DASHBOARD <<\x1b[0m', width) + '\r\n\r\n');

        if (!analytics) {
            this.terminal.write('  \x1b[1;31mNo analytics data available\x1b[0m\r\n\r\n');
            return;
        }

        // Portfolio Metrics
        if (analytics.metrics && analytics.metrics.portfolio) {
            this.terminal.write('  \x1b[1;33mPORTFOLIO METRICS:\x1b[0m\r\n');
            const portfolio = analytics.metrics.portfolio;
            this.terminal.write(`    Total Projects: \x1b[1;32m${portfolio.total_projects || 0}\x1b[0m\r\n`);
            this.terminal.write(`    Total Companies: \x1b[1;32m${portfolio.total_companies || 0}\x1b[0m\r\n`);
            this.terminal.write(`    Total Skills: \x1b[1;32m${portfolio.total_skills || 0}\x1b[0m\r\n`);
            this.terminal.write(`    Total Repositories: \x1b[1;32m${portfolio.total_repositories || 0}\x1b[0m\r\n`);
            this.terminal.write('\r\n');
        }

        // Performance Targets
        if (analytics.metrics && analytics.metrics.performance) {
            this.terminal.write('  \x1b[1;33mPERFORMANCE TARGETS:\x1b[0m\r\n');
            const perf = analytics.metrics.performance;
            this.terminal.write(`    Page Load Target: \x1b[1;32m${perf.page_load_target || 'N/A'}s\x1b[0m\r\n`);
            this.terminal.write(`    Interactive Target: \x1b[1;32m${perf.interactive_target || 'N/A'}s\x1b[0m\r\n`);
            this.terminal.write(`    Lighthouse Score Target: \x1b[1;32m${perf.lighthouse_score_target || 'N/A'}\x1b[0m\r\n`);
            this.terminal.write('\r\n');
        }

        // Engagement Metrics
        if (analytics.metrics && analytics.metrics.engagement) {
            this.terminal.write('  \x1b[1;33mENGAGEMENT METRICS:\x1b[0m\r\n');
            const engagement = analytics.metrics.engagement;
            
            if (engagement.terminal_commands && engagement.terminal_commands.length > 0) {
                this.terminal.write('    Terminal Commands: ');
                this.terminal.write(`\x1b[1;36m${engagement.terminal_commands.join(', ')}\x1b[0m\r\n`);
            }
            
            if (engagement.popular_pages && engagement.popular_pages.length > 0) {
                this.terminal.write('    Popular Pages: ');
                this.terminal.write(`\x1b[1;36m${engagement.popular_pages.join(', ')}\x1b[0m\r\n`);
            }
            this.terminal.write('\r\n');
        }

        // Event Schemas
        if (analytics.events && analytics.events.length > 0) {
            this.terminal.write('  \x1b[1;33mTRACKED EVENTS:\x1b[0m\r\n');
            analytics.events.slice(0, 5).forEach(event => {
                this.terminal.write(`    \x1b[1;36m${event.name}\x1b[0m (${event.category})\r\n`);
            });
            this.terminal.write('\r\n');
        }

        // Tracking Configuration
        if (analytics.tracking_config) {
            this.terminal.write('  \x1b[1;33mTRACKING CONFIG:\x1b[0m\r\n');
            const config = analytics.tracking_config;
            this.terminal.write(`    Enabled: \x1b[1;32m${config.enabled ? 'Yes' : 'No'}\x1b[0m\r\n`);
            this.terminal.write(`    Provider: \x1b[1;32m${config.provider || 'None'}\x1b[0m\r\n`);
            this.terminal.write('\r\n');
        }

        if (analytics.generated_at) {
            this.terminal.write('  \x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
            this.terminal.write(`  \x1b[1;30mGenerated: ${analytics.generated_at}\x1b[0m\r\n`);
        }

        this.terminal.write('\r\n');
    }
}

window.AnalyticsApp = AnalyticsApp;

