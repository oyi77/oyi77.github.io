class ReposApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
        this.github = new GitHubClient();
    }

    async run(args) {
        const width = this.terminal.cols || 60;

        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;32mINITIATING REAL-TIME REPOSITORY SCAN...\x1b[0m', width) + '\r\n');
        this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n\r\n');

        try {
            this.terminal.write('  \x1b[1;33m[1/3]\x1b[0m Identifying target profile...');
            const username = await this.github.getUsername();
            this.terminal.write(` \x1b[1;32m${username}\x1b[0m\r\n`);
            await new Promise(r => setTimeout(r, 400));

            this.terminal.write('  \x1b[1;33m[2/3]\x1b[0m Intercepting repository data shards...');
            const repos = await this.github.getRepositories();
            this.terminal.write(` \x1b[1;32m${repos.length} found\x1b[0m\r\n`);
            await new Promise(r => setTimeout(r, 400));

            this.terminal.write('  \x1b[1;33m[3/3]\x1b[0m Calibrating leaderboard matrix...\r\n\r\n');

            // Filter (only own repos) and Sort by stars
            const leaderboard = repos
                .filter(r => !r.fork) // Focus on original creations
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 10); // Top 10

            this.terminal.write(TerminalUtils.center('\x1b[1;36m>> REPOSITORY LEADERBOARD (By Stars) <<\x1b[0m', width) + '\r\n');
            this.terminal.write('  ' + '\x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');

            leaderboard.forEach((repo, idx) => {
                const starIcon = '\x1b[1;33m★\x1b[0m';
                const rank = (idx + 1).toString().padStart(2);
                const name = repo.name.padEnd(25);
                const stars = repo.stargazers_count.toString().padStart(4);
                const lang = (repo.language || 'N/A').padEnd(10);

                this.terminal.write(`  ${rank}. \x1b[1;32m${name}\x1b[0m | ${starIcon} ${stars} | ${lang}\r\n`);
                // Add a micro-delay for "rendering" effect
            });

            this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;32m[ SCAN COMPLETE ]\x1b[0m', width) + '\r\n');

        } catch (error) {
            this.terminal.write('\r\n  \x1b[1;31m[ ERROR ] Scan failed: ' + error.message + '\x1b[0m\r\n');
        }
    }
}

window.ReposApp = ReposApp;
