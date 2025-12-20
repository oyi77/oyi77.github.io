class WindowManager {
  constructor(terminal) {
    this.terminal = terminal;
    this.windows = [];
    this.activeWindow = null;
  }

  createWindow(title, content, options = {}) {
    const window = {
      id: Date.now(),
      title: title,
      content: content,
      x: options.x || 0,
      y: options.y || 0,
      width: options.width || 80,
      height: options.height || 24,
      visible: true
    };

    this.windows.push(window);
    this.activeWindow = window;
    return window;
  }

  closeWindow(windowId) {
    this.windows = this.windows.filter(w => w.id !== windowId);
    if (this.activeWindow && this.activeWindow.id === windowId) {
      this.activeWindow = this.windows.length > 0 ? this.windows[0] : null;
    }
  }

  renderWindow(window) {
    if (!window.visible) return;

    // Simple window rendering in terminal
    const border = '═'.repeat(window.width - 2);
    const top = `╔${border}╗`;
    const bottom = `╚${border}╝`;
    
    this.terminal.write(`\r\n${top}\r\n`);
    this.terminal.write(`║ ${window.title.padEnd(window.width - 4)} ║\r\n`);
    this.terminal.write(`╠${border}╣\r\n`);
    
    const lines = window.content.split('\n');
    for (const line of lines) {
      const truncated = line.substring(0, window.width - 4);
      this.terminal.write(`║ ${truncated.padEnd(window.width - 4)} ║\r\n`);
    }
    
    this.terminal.write(`${bottom}\r\n`);
  }

  renderAll() {
    this.windows.forEach(window => {
      if (window.visible) {
        this.renderWindow(window);
      }
    });
  }
}

window.WindowManager = WindowManager;

