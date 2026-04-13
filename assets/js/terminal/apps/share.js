class ShareApp {
    constructor(terminal, filesystem, windowManager, os) {
        this.terminal = terminal;
        this.filesystem = filesystem;
        this.windowManager = windowManager;
        this.os = os;
    }

    async run(args) {
        const data = window.JEKYLL_DATA?.terminal || {};
        this.terminal.write('\r\n\x1b[1;32m[ GENERATING RECRUITER-READY SNIPPET ]\x1b[0m\r\n\r\n');

        const name = data.name || 'Lead Software Engineer';
        const title = data.title || 'Lead Software Engineer (Remote Ready)';

        // Build top skills from data
        let topSkills = 'Python, React, Node.js, Smart Contracts, AWS';
        if (data.skills && typeof data.skills === 'object') {
            const allSkills = Object.values(data.skills).flat().map(s => typeof s === 'string' ? s : (s.name || s));
            if (allSkills.length > 0) topSkills = allSkills.slice(0, 5).join(', ');
        }

        // Find portfolio URL from links
        let portfolioUrl = 'https://oyi77.github.io';
        if (data.links && Array.isArray(data.links)) {
            const portfolioLink = data.links.find(l => /portfolio/i.test(l.label || l.name || ''));
            if (portfolioLink) portfolioUrl = portfolioLink.url || portfolioUrl;
        }

        // Get first achievement
        let keyAchievement = 'Reduced Dex Cleaning manual efforts by 60% @ Bitwyre.';
        if (data.experience && data.experience.length > 0) {
            const first = data.experience.find(e => e.highlight || e.achievement);
            if (first) keyAchievement = `${first.highlight || first.achievement} @ ${first.company || first.name || ''}`;
        }

        const snippet = `
🚀 **Candidate Profile: ${name}**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 **Role:** ${title}
💼 **Experience:** 7+ Years (Blockchain, Trading, Full-Stack)
🏆 **Key Achievement:** ${keyAchievement}
🛠️ **Stack:** ${topSkills}
🔗 **Interactive Portfolio:** ${portfolioUrl}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

        this.terminal.write(snippet.replace(/\n/g, '\r\n') + '\r\n\r\n');
        
        this.terminal.write('\x1b[1;33mTIP:\x1b[0m Copy this block to share with your HR team or LinkedIn connection!\r\n');
        
        // Try to copy to clipboard automatically if supported
        try {
            await navigator.clipboard.writeText(snippet);
            this.terminal.write('\x1b[1;32m[ AUTO-COPIED TO CLIPBOARD ]\x1b[0m\r\n');
        } catch (err) {
            this.terminal.write('\x1b[1;31m[ MANUAL COPY REQUIRED ]\x1b[0m\r\n');
        }
    }
}

window.ShareApp = ShareApp;
