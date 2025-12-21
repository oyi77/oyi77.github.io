class GitHubStatsApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        const width = this.terminal.cols || 60;

        const githubStats = window.JEKYLL_DATA?.github_stats;
        const repoStats = window.JEKYLL_DATA?.repository_stats;

        this.terminal.write('\r\n' + TerminalUtils.center('\x1b[1;36m>> GITHUB STATISTICS <<\x1b[0m', width) + '\r\n\r\n');

        // Profile Information
        if (githubStats && githubStats.profile) {
            this.terminal.write('  \x1b[1;33mPROFILE:\x1b[0m\r\n');
            const profile = githubStats.profile;
            this.terminal.write(`    Username: \x1b[1;32m${profile.login || 'N/A'}\x1b[0m\r\n`);
            this.terminal.write(`    Name: \x1b[1;32m${profile.name || 'N/A'}\x1b[0m\r\n`);
            this.terminal.write(`    Public Repos: \x1b[1;32m${profile.public_repos || 0}\x1b[0m\r\n`);
            this.terminal.write(`    Followers: \x1b[1;32m${profile.followers || 0}\x1b[0m\r\n`);
            this.terminal.write(`    Following: \x1b[1;32m${profile.following || 0}\x1b[0m\r\n`);
            this.terminal.write('\r\n');
        }

        // Repository Statistics
        if (repoStats && repoStats.summary) {
            this.terminal.write('  \x1b[1;33mREPOSITORY SUMMARY:\x1b[0m\r\n');
            const summary = repoStats.summary;
            this.terminal.write(`    Total Repos: \x1b[1;32m${summary.total_repos || 0}\x1b[0m\r\n`);
            this.terminal.write(`    Total Stars: \x1b[1;32m${summary.total_stars || 0}\x1b[0m\r\n`);
            this.terminal.write(`    Total Forks: \x1b[1;32m${summary.total_forks || 0}\x1b[0m\r\n`);
            this.terminal.write(`    Total Commits: \x1b[1;32m${summary.total_commits || 0}\x1b[0m\r\n`);
            this.terminal.write('\r\n');
        }

        // Language Breakdown
        if (githubStats && githubStats.languages && Object.keys(githubStats.languages).length > 0) {
            this.terminal.write('  \x1b[1;33mLANGUAGE BREAKDOWN:\x1b[0m\r\n');
            const languages = githubStats.languages;
            const sortedLangs = Object.entries(languages)
                .sort((a, b) => b[1]['count'] - a[1]['count'])
                .slice(0, 10);
            
            sortedLangs.forEach(([lang, data]) => {
                const count = data['count'] || 0;
                const repos = (data['repos'] || []).slice(0, 3).join(', ');
                this.terminal.write(`    \x1b[1;36m${lang}\x1b[0m: ${count} repos`);
                if (repos) {
                    this.terminal.write(` (${repos}${data['repos'].length > 3 ? '...' : ''})`);
                }
                this.terminal.write('\r\n');
            });
            this.terminal.write('\r\n');
        }

        // Top Repositories
        if (repoStats && repoStats.summary && repoStats.summary.top_repos) {
            this.terminal.write('  \x1b[1;33mTOP REPOSITORIES:\x1b[0m\r\n');
            const topRepos = repoStats.summary.top_repos.slice(0, 5);
            topRepos.forEach((repo, idx) => {
                const stars = repo.stars || 0;
                const forks = repo.forks || 0;
                this.terminal.write(`    ${idx + 1}. \x1b[1;36m${repo.name}\x1b[0m`);
                if (stars > 0 || forks > 0) {
                    this.terminal.write(` (\x1b[1;32m⭐ ${stars}\x1b[0m, \x1b[1;32m🍴 ${forks}\x1b[0m)`);
                }
                this.terminal.write('\r\n');
            });
            this.terminal.write('\r\n');
        }

        // Contributions
        if (githubStats && githubStats.contributions) {
            this.terminal.write('  \x1b[1;33mCONTRIBUTIONS:\x1b[0m\r\n');
            const contribs = githubStats.contributions;
            this.terminal.write(`    Estimated Annual Commits: \x1b[1;32m${contribs.estimated_annual_commits || 'N/A'}\x1b[0m\r\n`);
            this.terminal.write(`    Active Repositories: \x1b[1;32m${contribs.active_repositories || 0}\x1b[0m\r\n`);
            if (contribs.last_activity) {
                this.terminal.write(`    Last Activity: \x1b[1;32m${contribs.last_activity}\x1b[0m\r\n`);
            }
            this.terminal.write('\r\n');
        }

        if (githubStats && githubStats.generated_at) {
            this.terminal.write('  \x1b[1;30m' + '-'.repeat(width - 10) + '\x1b[0m\r\n');
            this.terminal.write(`  \x1b[1;30mLast updated: ${githubStats.generated_at}\x1b[0m\r\n`);
        }

        this.terminal.write('\r\n');
    }
}

window.GitHubStatsApp = GitHubStatsApp;

