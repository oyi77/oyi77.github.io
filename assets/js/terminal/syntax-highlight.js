class SyntaxHighlighter {
  constructor() {
    this.languages = {
      js: this.highlightJS,
      javascript: this.highlightJS,
      json: this.highlightJSON,
      md: this.highlightMarkdown,
      markdown: this.highlightMarkdown,
      yml: this.highlightYAML,
      yaml: this.highlightYAML,
      txt: this.highlightPlain,
      py: this.highlightPython,
      python: this.highlightPython,
      php: this.highlightPHP,
      html: this.highlightHTML,
      css: this.highlightCSS
    };
  }

  highlight(content, fileExtension) {
    const ext = fileExtension.toLowerCase().replace('.', '');
    const highlighter = this.languages[ext] || this.highlightPlain;
    return highlighter.call(this, content);
  }

  highlightJS(content) {
    const lines = content.split('\n');
    return lines.map(line => {
      // Keywords
      line = line.replace(/\b(function|const|let|var|if|else|for|while|return|class|extends|async|await|import|export|from|default|new|this|true|false|null|undefined)\b/g, 
        '\x1b[1;35m$1\x1b[0m');
      // Strings
      line = line.replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, 
        '\x1b[1;32m$1$2$1\x1b[0m');
      // Comments
      line = line.replace(/\/\/.*$/g, '\x1b[1;30m$&\x1b[0m');
      line = line.replace(/\/\*[\s\S]*?\*\//g, '\x1b[1;30m$&\x1b[0m');
      // Numbers
      line = line.replace(/\b\d+\.?\d*\b/g, '\x1b[1;33m$&\x1b[0m');
      return line;
    }).join('\n');
  }

  highlightJSON(content) {
    const lines = content.split('\n');
    return lines.map(line => {
      // Keys
      line = line.replace(/"([^"]+)":/g, '\x1b[1;36m"$1"\x1b[0m:');
      // Strings
      line = line.replace(/:\s*"([^"]*)"/g, ': \x1b[1;32m"$1"\x1b[0m');
      // Numbers
      line = line.replace(/:\s*(\d+\.?\d*)/g, ': \x1b[1;33m$1\x1b[0m');
      // Booleans
      line = line.replace(/:\s*(true|false|null)/g, ': \x1b[1;35m$1\x1b[0m');
      return line;
    }).join('\n');
  }

  highlightMarkdown(content) {
    const lines = content.split('\n');
    return lines.map(line => {
      // Headers
      line = line.replace(/^(#{1,6})\s+(.+)$/g, '\x1b[1;36m$1\x1b[0m \x1b[1;33m$2\x1b[0m');
      // Bold
      line = line.replace(/\*\*(.+?)\*\*/g, '\x1b[1m$1\x1b[0m');
      // Italic
      line = line.replace(/\*(.+?)\*/g, '\x1b[3m$1\x1b[0m');
      // Code blocks
      line = line.replace(/`([^`]+)`/g, '\x1b[1;35m`$1`\x1b[0m');
      // Links
      line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '\x1b[1;34m[$1]\x1b[0m(\x1b[4;34m$2\x1b[0m)');
      return line;
    }).join('\n');
  }

  highlightYAML(content) {
    const lines = content.split('\n');
    return lines.map(line => {
      // Keys
      line = line.replace(/^(\s*)([^:]+):/g, '$1\x1b[1;36m$2\x1b[0m:');
      // Strings
      line = line.replace(/:\s*"([^"]*)"/g, ': \x1b[1;32m"$1"\x1b[0m');
      // Numbers
      line = line.replace(/:\s*(\d+\.?\d*)/g, ': \x1b[1;33m$1\x1b[0m');
      // Comments
      line = line.replace(/#.*$/g, '\x1b[1;30m$&\x1b[0m');
      return line;
    }).join('\n');
  }

  highlightPython(content) {
    const lines = content.split('\n');
    return lines.map(line => {
      // Keywords
      line = line.replace(/\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|finally|with|pass|break|continue|True|False|None)\b/g,
        '\x1b[1;35m$1\x1b[0m');
      // Strings
      line = line.replace(/(['"])((?:\\.|(?!\1)[^\\])*?)\1/g,
        '\x1b[1;32m$1$2$1\x1b[0m');
      // Comments
      line = line.replace(/#.*$/g, '\x1b[1;30m$&\x1b[0m');
      // Numbers
      line = line.replace(/\b\d+\.?\d*\b/g, '\x1b[1;33m$&\x1b[0m');
      return line;
    }).join('\n');
  }

  highlightPHP(content) {
    const lines = content.split('\n');
    return lines.map(line => {
      // PHP tags
      line = line.replace(/<\?php/g, '\x1b[1;35m<?php\x1b[0m');
      line = line.replace(/\?>/g, '\x1b[1;35m?>\x1b[0m');
      // Keywords
      line = line.replace(/\b(function|class|if|else|foreach|return|echo|print|array|public|private|protected)\b/g,
        '\x1b[1;35m$1\x1b[0m');
      // Strings
      line = line.replace(/(['"])((?:\\.|(?!\1)[^\\])*?)\1/g,
        '\x1b[1;32m$1$2$1\x1b[0m');
      // Comments
      line = line.replace(/\/\/.*$|\/\*[\s\S]*?\*\//g, '\x1b[1;30m$&\x1b[0m');
      return line;
    }).join('\n');
  }

  highlightHTML(content) {
    const lines = content.split('\n');
    return lines.map(line => {
      // Tags
      line = line.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)/g, '\x1b[1;35m<$1$2\x1b[0m');
      line = line.replace(/>/g, '\x1b[1;35m>\x1b[0m');
      // Attributes
      line = line.replace(/(\w+)="([^"]*)"/g, '\x1b[1;36m$1\x1b[0m="\x1b[1;32m$2\x1b[0m"');
      return line;
    }).join('\n');
  }

  highlightCSS(content) {
    const lines = content.split('\n');
    return lines.map(line => {
      // Selectors
      line = line.replace(/^([^{]+)\{/g, '\x1b[1;36m$1\x1b[0m{');
      // Properties
      line = line.replace(/(\s+)([a-zA-Z-]+):/g, '$1\x1b[1;33m$2\x1b[0m:');
      // Values
      line = line.replace(/:\s*([^;]+);/g, ': \x1b[1;32m$1\x1b[0m;');
      // Comments
      line = line.replace(/\/\*[\s\S]*?\*\//g, '\x1b[1;30m$&\x1b[0m');
      return line;
    }).join('\n');
  }

  highlightPlain(content) {
    return content;
  }

  isBinary(content) {
    // Check for null bytes or high percentage of non-printable characters
    if (content.indexOf('\0') !== -1) return true;
    
    const nonPrintable = content.split('').filter(c => {
      const code = c.charCodeAt(0);
      return code < 32 && code !== 9 && code !== 10 && code !== 13;
    }).length;
    
    return nonPrintable / content.length > 0.3;
  }
}

window.SyntaxHighlighter = SyntaxHighlighter;

