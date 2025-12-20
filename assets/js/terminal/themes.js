class ThemeManager {
    constructor(terminal) {
        this.terminal = terminal;
        this.themes = {
            matrix: {
                background: '#0d0d0d',
                foreground: '#00ff41',
                cursor: '#00ff41',
                selection: '#003b00',
                black: '#000000',
                red: '#ff0000',
                green: '#00ff41',
                yellow: '#ffff00',
                blue: '#0000ff',
                magenta: '#ff00ff',
                cyan: '#00ffff',
                white: '#ffffff'
            },
            amber: {
                background: '#1a1200',
                foreground: '#ffb000',
                cursor: '#ffb000',
                selection: '#4d3300',
                black: '#000000',
                red: '#ff3300',
                green: '#ffcc00',
                yellow: '#ffff33',
                blue: '#ff9900',
                magenta: '#ff6600',
                cyan: '#ffff00',
                white: '#ffeedd'
            },
            hacker: {
                background: '#000000',
                foreground: '#33ff33',
                cursor: '#33ff33',
                selection: '#1a331a',
                black: '#000000',
                red: '#cc0000',
                green: '#33ff33',
                yellow: '#ffff33',
                blue: '#0066ff',
                magenta: '#cc33cc',
                cyan: '#33cccc',
                white: '#ffffff'
            },
            cyberpunk: {
                background: '#0b0014',
                foreground: '#d200ff',
                cursor: '#00fff2',
                selection: '#3d004d',
                black: '#000000',
                red: '#ff0055',
                green: '#00ff9f',
                yellow: '#fcee0a',
                blue: '#00c3ff',
                magenta: '#ff00ff',
                cyan: '#00fff2',
                white: '#ffffff'
            }
        };

        this.currentTheme = 'matrix';
    }

    setTheme(name) {
        if (this.themes[name]) {
            this.currentTheme = name;
            this.terminal.options.theme = this.themes[name];
            this.updateCSSVars(this.themes[name]);
            return true;
        }
        return false;
    }

    updateCSSVars(theme) {
        document.documentElement.style.setProperty('--term-color', theme.foreground);
        document.documentElement.style.setProperty('--term-bg', theme.background);
    }
}
