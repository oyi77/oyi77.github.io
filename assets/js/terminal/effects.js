class TerminalEffects {
    constructor(terminal) {
        this.terminal = terminal;
        this.container = terminal.element;
        this.activeEffects = new Set();
        this.isActive = true;
    }

    addScanline() {
        const overlay = document.createElement('div');
        overlay.className = 'crt-scanline';
        this.container.parentElement.appendChild(overlay);
        this.activeEffects.add('scanline');
    }

    addGlitch() {
        const container = this.container.parentElement;
        container.classList.add('glitch-effect');
        setTimeout(() => {
            container.classList.remove('glitch-effect');
        }, 200);
    }

    startMatrixRain() {
        if (this.activeEffects.has('matrix')) return;

        const canvas = document.createElement('canvas');
        canvas.className = 'matrix-canvas';
        this.container.parentElement.prepend(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;

        const rainDrops = [];
        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0'; // Green text
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };

        const interval = setInterval(draw, 30);
        this.activeEffects.add('matrix');
        this.matrixInterval = interval;
        this.matrixCanvas = canvas;
    }

    stopMatrixRain() {
        if (this.matrixInterval) {
            clearInterval(this.matrixInterval);
            this.matrixCanvas.remove();
            this.activeEffects.delete('matrix');
        }
    }

    toggleScanlines() {
        const container = this.container.parentElement;
        container.classList.toggle('crt-active');
    }

    async glitchText(text) {
        // Return scrambled text that progressively unscrambles
        return text; // Placeholder for logic
    }
}
