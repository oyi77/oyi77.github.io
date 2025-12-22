class VirtualFileSystem {
  constructor() {
    this.fs = {
      '/': { type: 'directory', children: {} },
      '/home': { type: 'directory', children: {} },
      '/home/user': {
        type: 'directory',
        children: {
          'README.txt': {
            type: 'file',
            content: `
=============================================================================
  ____        _ ____  _____ 
 / __ \\__  __(_) __ \\/ ___/ 
/ / / / / / / / / / /\\__ \\  
/ /_/ / /_/ / / /_/ /___/ /  
\\____/\\__, /_/\\____//____/   
     /____/                  

VIRTUAL FILE SYSTEM v2.0
AUTHORIZED ACCESS ONLY
=============================================================================

This system contains the professional records and achievement logs of 
Muchammad Fikri Izzuddin.

[ QUICK NAVIGATION ]
--------------------
- /companies    : Enterprise leadership records
- /achievements : Mission accomplishment logs
- /skills       : Capability matrix
- /classified   : Encrypted data streams

[ CORE COMMANDS ]
-----------------
- help          : List all system operations
- whoami        : View current user profile
- ls, cd, cat   : Traverse and read system logs
- theme         : Switch interface protocols

-----------------------------------------------------------------------------
`
          },
          'cv.pdf': {
            type: 'file',
            content: ` [PDF DATA STREAM] Location: /CV.pdf\r\n Protocol: open-link\r\n Action: Use 'cv' command to download or view.`
          }
        }
      },
      '/companies': {
        type: 'directory',
        children: {
          'garudamedia': { type: 'directory', children: {} },
          'solomon-mining': { type: 'directory', children: {} },
          'berkahkarya': { type: 'directory', children: {} },
          'aitradepulse': { type: 'directory', children: {} }
        }
      },
      '/achievements': {
        type: 'directory',
        children: {
          'leadership.txt': { type: 'file', content: 'LED-01: Led Team of 3000+ Employees at GarudaMedia\r\nLED-02: Managed 5B+ Monthly turnover at BerkahKarya' },
          'technical.txt': { type: 'file', content: 'TEC-01: 70% Accuracy in Trading Prediction at Bitwyre\r\nTEC-02: 90%+ Winrate Algo Trading Platform at AiTradePulse' }
        }
      },
      '/skills': {
        type: 'directory',
        children: {
          'languages.txt': { type: 'file', content: 'Python, JavaScript, TypeScript, C++, PHP, MQL4/5' },
          'frameworks.txt': { type: 'file', content: 'React, Node.js, Django, Laravel, Express' }
        }
      },
      '/classified': {
        type: 'directory',
        children: {
          'secret_project.enc': { type: 'file', content: 'XF-77-ALPHA: [ENCRYPTED DATA STREAM]\r\nUse "decrypt" command to analyze.' }
        }
      },
      '/usr/bin': {
        type: 'directory',
        children: {
          'whoami': { type: 'executable', command: 'whoami' },
          'companies': { type: 'executable', command: 'companies' },
          'achievements': { type: 'executable', command: 'achievements' },
          'skills': { type: 'executable', command: 'skills' },
          'hack': { type: 'executable', command: 'hack' }
        }
      }
    };

    this.init();
  }

  init() {
    // Ensure all parent directories exist
    this.ensurePath('/home/user');
    this.ensurePath('/usr/bin');
    this.ensurePath('/etc');
  }

  ensurePath(path) {
    const parts = path.split('/').filter(p => p);
    let current = '/';

    for (const part of parts) {
      const fullPath = current === '/' ? `/${part}` : `${current}/${part}`;
      if (!this.fs[fullPath]) {
        this.fs[fullPath] = {
          type: 'directory',
          children: {}
        };
      }
      current = fullPath;
    }
  }

  resolvePath(currentPath, targetPath) {
    if (targetPath.startsWith('/')) {
      return this.normalizePath(targetPath);
    }

    if (targetPath === '~') {
      return '/home/user';
    }

    if (targetPath === '..') {
      const parts = currentPath.split('/').filter(p => p);
      if (parts.length > 0) {
        parts.pop();
        return '/' + parts.join('/') || '/';
      }
      return '/';
    }

    if (targetPath === '.') {
      return currentPath;
    }

    const combined = currentPath === '/' ? `/${targetPath}` : `${currentPath}/${targetPath}`;
    return this.normalizePath(combined);
  }

  normalizePath(path) {
    const parts = path.split('/').filter(p => p);
    const normalized = [];

    for (const part of parts) {
      if (part === '.') {
        continue;
      } else if (part === '..') {
        if (normalized.length > 0) {
          normalized.pop();
        }
      } else {
        normalized.push(part);
      }
    }

    return '/' + normalized.join('/') || '/';
  }

  exists(path) {
    return this.fs[path] !== undefined;
  }

  isDirectory(path) {
    const node = this.fs[path];
    return node && node.type === 'directory';
  }

  isFile(path) {
    const node = this.fs[path];
    return node && node.type === 'file';
  }

  isExecutable(command) {
    const execPath = `/usr/bin/${command}`;
    const node = this.fs[execPath];
    return node && node.type === 'executable';
  }

  list(path) {
    const node = this.fs[path];
    if (!node) {
      return null;
    }

    if (node.type !== 'directory') {
      return null;
    }

    const items = [];
    for (const [name, child] of Object.entries(node.children || {})) {
      items.push({
        name,
        type: child.type === 'directory' ? 'directory' : 'file'
      });
    }

    // Add parent directory reference
    if (path !== '/') {
      items.unshift({ name: '..', type: 'directory' });
    }

    return items.sort((a, b) => {
      if (a.name === '..') return -1;
      if (b.name === '..') return 1;
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }

  readFile(path) {
    const node = this.fs[path];
    if (!node) {
      return null;
    }

    if (node.type === 'file') {
      return node.content || '';
    }

    return null;
  }

  writeFile(path, content) {
    const dirPath = path.substring(0, path.lastIndexOf('/'));
    this.ensurePath(dirPath);

    const fileName = path.substring(path.lastIndexOf('/') + 1);
    const dir = this.fs[dirPath];

    if (dir && dir.type === 'directory') {
      dir.children[fileName] = {
        type: 'file',
        content: content
      };
      return true;
    }

    return false;
  }

  createDirectory(path) {
    this.ensurePath(path);
    return this.exists(path);
  }

  remove(path) {
    if (!this.exists(path)) {
      return false;
    }

    // Find parent directory
    const parts = path.split('/').filter(p => p);
    if (parts.length === 0) {
      return false; // Cannot remove root
    }

    const fileName = parts.pop();
    const parentPath = parts.length === 0 ? '/' : '/' + parts.join('/');
    const parent = this.fs[parentPath];

    if (parent && parent.type === 'directory' && parent.children) {
      delete parent.children[fileName];
      delete this.fs[path];
      return true;
    }

    return false;
  }

  move(sourcePath, destPath) {
    if (!this.exists(sourcePath)) {
      return false;
    }

    const sourceNode = this.fs[sourcePath];
    if (!sourceNode) {
      return false;
    }

    // Ensure destination directory exists
    const destParts = destPath.split('/').filter(p => p);
    const destFileName = destParts.pop();
    const destDirPath = destParts.length === 0 ? '/' : '/' + destParts.join('/');
    this.ensurePath(destDirPath);

    const destDir = this.fs[destDirPath];
    if (!destDir || destDir.type !== 'directory') {
      return false;
    }

    // Copy node to destination
    destDir.children[destFileName] = JSON.parse(JSON.stringify(sourceNode));

    // Remove from source
    this.remove(sourcePath);

    // Update path in filesystem
    this.fs[destPath] = destDir.children[destFileName];
    
    return true;
  }
}

window.VirtualFileSystem = VirtualFileSystem;

