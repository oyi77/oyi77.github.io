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
            const data = window.JEKYLL_DATA || {};
            
            // Validate data structure
            if (typeof data !== 'object') {
                console.error('JEKYLL_DATA is not an object');
                return;
            }

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

            // Load Skills as individual files per category
            if (data.terminal && data.terminal.skills && typeof data.terminal.skills === 'object') {
                try {
                    this.fs.createDirectory('/home/user/skills');
                } catch (e) { /* directory may already exist */ }
                Object.entries(data.terminal.skills).forEach(([category, items]) => {
                    try {
                        const skillList = Array.isArray(items)
                            ? items.map(s => typeof s === 'string' ? s : (s.name || String(s))).join('\n')
                            : String(items);
                        const filename = category.toLowerCase().replace(/\s+/g, '_') + '.txt';
                        this.fs.writeFile(`/home/user/skills/${filename}`, skillList);
                    } catch (e) {
                        console.warn('Error writing skill file:', e);
                    }
                });
            }

            // Load Experience as individual files per role
            if (data.terminal && data.terminal.experience && Array.isArray(data.terminal.experience)) {
                try {
                    this.fs.createDirectory('/home/user/experience');
                } catch (e) { /* directory may already exist */ }
                data.terminal.experience.forEach(exp => {
                    try {
                        const company = (exp.company || exp.name || 'unknown').toLowerCase().replace(/\s+/g, '-');
                        const role = (exp.role || 'role').toLowerCase().replace(/\s+/g, '-');
                        const filename = `${company}-${role}.txt`.replace(/[^a-z0-9.\-_]/g, '');
                        const content = [
                            `Company: ${exp.company || exp.name || 'Unknown'}`,
                            `Role: ${exp.role || ''}`,
                            `Period: ${exp.period || ''}`,
                            exp.location ? `Location: ${exp.location}` : '',
                            '',
                            exp.description || exp.highlight || ''
                        ].filter(Boolean).join('\n');
                        this.fs.writeFile(`/home/user/experience/${filename}`, content);
                    } catch (e) {
                        console.warn('Error writing experience file:', e);
                    }
                });
            }

            // Load Education
            if (data.terminal && data.terminal.education) {
                try {
                    const edu = data.terminal.education;
                    let content = '';
                    if (Array.isArray(edu)) {
                        content = edu.map(e => {
                            return [
                                `Institution: ${e.institution || e.school || ''}`,
                                `Degree: ${e.degree || ''}`,
                                `Field: ${e.field || ''}`,
                                `Period: ${e.period || e.year || ''}`,
                                ''
                            ].join('\n');
                        }).join('\n');
                    } else {
                        content = String(edu);
                    }
                    this.fs.writeFile('/home/user/education.txt', content);
                } catch (e) {
                    console.warn('Error writing education.txt:', e);
                }
            }

            // Load Certifications as individual files
            if (data.terminal && data.terminal.certifications && Array.isArray(data.terminal.certifications)) {
                try {
                    this.fs.createDirectory('/home/user/certifications');
                } catch (e) { /* directory may already exist */ }
                data.terminal.certifications.forEach(cert => {
                    try {
                        const name = (cert.name || cert.title || 'cert').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9.\-_]/g, '');
                        const content = [
                            `Name: ${cert.name || cert.title || ''}`,
                            `Issuer: ${cert.issuer || cert.organization || ''}`,
                            cert.date ? `Date: ${cert.date}` : '',
                            cert.url ? `URL: ${cert.url}` : '',
                            cert.credential_id ? `Credential ID: ${cert.credential_id}` : ''
                        ].filter(Boolean).join('\n');
                        this.fs.writeFile(`/home/user/certifications/${name}.txt`, content);
                    } catch (e) {
                        console.warn('Error writing certification file:', e);
                    }
                });
            }

            // Load Summary/Bio
            if (data.terminal && data.terminal.bio) {
                try {
                    this.fs.writeFile('/home/user/summary.txt', data.terminal.bio);
                } catch (e) {
                    console.warn('Error writing summary.txt:', e);
                }
            }
        } catch (error) {
            console.error('Error loading Jekyll data:', error);
        }
    }
}

window.FileSystemLoader = FileSystemLoader;
