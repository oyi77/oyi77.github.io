class FileSystemLoader {
    constructor(filesystem) {
        this.fs = filesystem;
    }

    loadJekyllData() {
        if (!window.JEKYLL_DATA) return;

        const data = window.JEKYLL_DATA;

        // Create standard directories if they don't exist
        this.fs.mkdir('/home/user/documents');
        this.fs.mkdir('/home/user/projects');
        this.fs.mkdir('/home/user/company_logs');

        // Load Bio/About
        if (data.terminal && data.terminal.bio) {
            this.fs.writeFile('/home/user/about.txt', data.terminal.bio);
        }

        // Load Projects as text files
        if (data.terminal && data.terminal.sites) {
            data.terminal.sites.forEach(site => {
                const content = `Name: ${site.name}\nDescription: ${site.description}\nURL: ${site.url}\nCategory: ${site.category}`;
                const filename = site.name.toLowerCase().replace(/\s+/g, '_') + '.txt';
                this.fs.writeFile(`/home/user/projects/${filename}`, content);
            });
        }

        // Load Companies as text files
        if (data.companies && data.companies.companies) {
            data.companies.companies.forEach(comp => {
                const content = `Company: ${comp.name}\nRole: ${comp.role}\nPeriod: ${comp.period}\n\nDescription:\n${comp.description}`;
                const filename = comp.id + '.log';
                this.fs.writeFile(`/home/user/company_logs/${filename}`, content);
            });
        }

        // Create Welcome Message
        this.fs.writeFile('/home/user/welcome.msg', `Welcome to ${data.site.title}.\nSystem is fully operational.`);
    }
}

window.FileSystemLoader = FileSystemLoader;
