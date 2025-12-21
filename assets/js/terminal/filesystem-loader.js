class FileSystemLoader {
    constructor(filesystem) {
        this.fs = filesystem;
    }

    loadJekyllData() {
        if (!window.JEKYLL_DATA) {
            console.warn('JEKYLL_DATA not available');
            return;
        }

        if (!this.fs || typeof this.fs.createDirectory !== 'function') {
            console.error('FileSystem not properly initialized');
            return;
        }

        try {
            const data = window.JEKYLL_DATA;

            // Create standard directories if they don't exist
            try {
                this.fs.createDirectory('/home/user/documents');
                this.fs.createDirectory('/home/user/projects');
                this.fs.createDirectory('/home/user/company_logs');
            } catch (e) {
                console.warn('Error creating directories:', e);
            }

            // Load Bio/About
            if (data.terminal && data.terminal.bio) {
                try {
                    this.fs.writeFile('/home/user/about.txt', data.terminal.bio);
                } catch (e) {
                    console.warn('Error writing about.txt:', e);
                }
            }

            // Load Projects as text files
            if (data.terminal && data.terminal.sites && Array.isArray(data.terminal.sites)) {
                data.terminal.sites.forEach(site => {
                    try {
                        const content = `Name: ${site.name || 'Unknown'}\nDescription: ${site.description || ''}\nURL: ${site.url || ''}\nCategory: ${site.category || ''}`;
                        const filename = (site.name || 'project').toLowerCase().replace(/\s+/g, '_') + '.txt';
                        this.fs.writeFile(`/home/user/projects/${filename}`, content);
                    } catch (e) {
                        console.warn('Error writing project file:', e);
                    }
                });
            }

            // Load Companies as text files
            if (data.companies && data.companies.companies && Array.isArray(data.companies.companies)) {
                data.companies.companies.forEach(comp => {
                    try {
                        const content = `Company: ${comp.name || 'Unknown'}\nRole: ${comp.role || ''}\nPeriod: ${comp.period || ''}\n\nDescription:\n${comp.description || ''}`;
                        const filename = (comp.id || 'company') + '.log';
                        this.fs.writeFile(`/home/user/company_logs/${filename}`, content);
                    } catch (e) {
                        console.warn('Error writing company log:', e);
                    }
                });
            }

            // Create Welcome Message
            try {
                const title = (data.site && data.site.title) ? data.site.title : 'Terminal OS';
                this.fs.writeFile('/home/user/welcome.msg', `Welcome to ${title}.\nSystem is fully operational.`);
            } catch (e) {
                console.warn('Error writing welcome message:', e);
            }
        } catch (error) {
            console.error('Error loading Jekyll data:', error);
        }
    }
}

window.FileSystemLoader = FileSystemLoader;
