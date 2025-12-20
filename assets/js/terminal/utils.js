class TerminalUtils {
    static center(text, width = 80) {
        const lines = text.split('\n');
        return lines.map(line => {
            const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, ''); // Remove ANSI codes for length calc
            const padding = Math.max(0, Math.floor((width - cleanLine.length) / 2));
            return ' '.repeat(padding) + line;
        }).join('\n');
    }

    static table(data, cols, width = 80) {
        let output = '';
        data.forEach(row => {
            let line = '  ';
            cols.forEach((col, idx) => {
                const val = String(row[col.key] || '');
                const pad = col.width || 20;
                line += val.padEnd(pad);
                if (idx < cols.length - 1) line += ' | ';
            });
            output += line + '\r\n';
        });
        return output;
    }

    static wrap(text, width = 60) {
        const words = text.split(' ');
        let lines = [];
        let currentLine = '  ';

        words.forEach(word => {
            if ((currentLine + word).length > width) {
                lines.push(currentLine);
                currentLine = '  ' + word + ' ';
            } else {
                currentLine += word + ' ';
            }
        });
        lines.push(currentLine);
        return lines.join('\r\n');
    }
}

window.TerminalUtils = TerminalUtils;
