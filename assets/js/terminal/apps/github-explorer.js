class GitHubExplorerApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.fs = filesystem;
        this.wm = windowManager;
        this.os = os;
        this.username = window.JEKYLL_DATA?.site?.github_username || 'oyi77';
        this.cachedRepos = null;
    }

    async run(args) {
        const subcmd = args[0];

        if (subcmd === 'refresh') {
            this.cachedRepos = null;
            this.terminal.write(`\r\n\x1b[1;33m[GITHUB]\x1b[0m Clearing cache...\r\n`);
        }

        await this.fetchRepos();

        if (!this.cachedRepos) {
            this.terminal.write(`\r\n\x1b[1;31m[ERROR]\x1b[0m Failed to fetch GitHub data.\r\n`);
            return;
        }

        if (args.length > 0 && args[0] !== 'refresh') {
            // Search/Filter logic could go here
            this.showRepoDetails(args[0]);
        } else {
            this.showRepoList();
        }
    }

    async fetchRepos() {
        if (this.cachedRepos) return;

        this.terminal.write(`\r\n\x1b[1;34m[GITHUB]\x1b[0m Connecting to api.github.com/users/${this.username}...\r\n`);

        try {
            const response = await fetch(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=100`);
            if (!response.ok) throw new Error(response.statusText);

            this.cachedRepos = await response.json();
            // Sort by stars descending
            this.cachedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);

            this.terminal.write(`\x1b[1;32m[SUCCESS]\x1b[0m Fetched ${this.cachedRepos.length} repositories.\r\n`);
        } catch (error) {
            this.terminal.write(`\x1b[1;31m[ERROR]\x1b[0m Connection failed: ${error.message}\r\n`);
        }
    }

    showRepoList() {
        this.terminal.write(`\r\n\x1b[1;37mGitHub Repositories for ${this.username}\x1b[0m\r\n`);
        this.terminal.write(`\x1b[1;30m${'-'.repeat(this.terminal.cols)}\x1b[0m\r\n`);

        const headers = ["NAME", "STARS", "LANG", "UPDATED"];
        // Simple formatting calculation
        this.terminal.write(`\x1b[1;36m%-30s %-8s %-15s %-12s\x1b[0m\r\n`.replace(/%-(\d+)s/g, (match, width) => {
            // Mock printf behavior manually if needed, or just use simple spacing
            return match;
        }));
        // Actually, let's just use manual padding
        const rowFormat = (name, stars, lang, updated) => {
            const n = name.padEnd(30).slice(0, 30);
            const s = stars.toString().padEnd(8);
            const l = (lang || '-').padEnd(15).slice(0, 15);
            return `${n} ${s} ${l} ${updated}`;
        };

        this.terminal.write(`\x1b[1;36m${rowFormat("NAME", "STARS", "LANGUAGE", "UPDATED")}\x1b[0m\r\n`);
        this.terminal.write(`\x1b[1;30m${'-'.repeat(this.terminal.cols)}\x1b[0m\r\n`);

        this.cachedRepos.slice(0, 15).forEach(repo => {
            const date = new Date(repo.updated_at).toISOString().split('T')[0];
            const color = repo.fork ? '\x1b[30m' : '\x1b[37m'; // Dim forks
            const nameColor = repo.fork ? '\x1b[30m' : '\x1b[1;32m';

            this.terminal.write(`${nameColor}${repo.name.padEnd(30).slice(0, 30)}\x1b[0m `);
            this.terminal.write(`\x1b[33m${repo.stargazers_count.toString().padEnd(8)}\x1b[0m `);
            this.terminal.write(`\x1b[36m${(repo.language || '-').padEnd(15).slice(0, 15)}\x1b[0m `);
            this.terminal.write(`\x1b[30m${date}\x1b[0m\r\n`);
        });

        if (this.cachedRepos.length > 15) {
            this.terminal.write(`\r\n\x1b[30m... and ${this.cachedRepos.length - 15} more. Type 'github <name>' for details.\x1b[0m\r\n`);
        }
    }

    showRepoDetails(repoName) {
        const repo = this.cachedRepos.find(r => r.name.toLowerCase() === repoName.toLowerCase());

        if (!repo) {
            this.terminal.write(`\r\n\x1b[1;31mRepository '${repoName}' not found.\x1b[0m\r\n`);
            return;
        }

        const content = `
Name:        ${repo.name}
Full Name:   ${repo.full_name}
Stars:       ${repo.stargazers_count}
Forks:       ${repo.forks_count}
Language:    ${repo.language}
Created:     ${repo.created_at}
Updated:     ${repo.updated_at}
URL:         ${repo.html_url}
Using Web3OS: ${repo.homepage ? 'Yes (' + repo.homepage + ')' : 'No'}

Description:
${repo.description || 'No description provided.'}
        `;

        this.wm.createWindow(`GitHub: ${repo.name}`, content, { width: 60, height: 20 });
    }
}

window.GitHubExplorerApp = GitHubExplorerApp;
