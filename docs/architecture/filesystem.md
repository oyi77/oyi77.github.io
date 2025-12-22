# Virtual Filesystem Architecture

## Overview

The virtual filesystem provides a complete directory structure that mirrors real filesystem operations while being backed by Jekyll data and in-memory storage.

## Filesystem Structure

```
/
├── home/
│   └── user/
│       ├── README.txt
│       ├── cv.pdf
│       ├── documents/
│       ├── projects/
│       └── company_logs/
├── companies/
│   ├── garudamedia/
│   ├── solomon-mining/
│   ├── berkahkarya/
│   └── aitradepulse/
├── achievements/
│   ├── leadership.txt
│   └── technical.txt
├── skills/
│   ├── languages.txt
│   └── frameworks.txt
└── classified/
    └── secret_project.enc
```

## VirtualFileSystem Class

### Core Methods

- `resolvePath(currentPath, targetPath)` - Resolve relative/absolute paths
- `exists(path)` - Check if path exists
- `isDirectory(path)` - Check if path is directory
- `isFile(path)` - Check if path is file
- `list(path)` - List directory contents
- `readFile(path)` - Read file content
- `writeFile(path, content)` - Write file
- `createDirectory(path)` - Create directory
- `remove(path)` - Remove file/directory
- `move(sourcePath, destPath)` - Move/rename file

### Path Resolution

Supports:
- Absolute paths: `/home/user`
- Relative paths: `../parent`
- Home shortcut: `~` → `/home/user`
- Current directory: `.`
- Parent directory: `..`

## Jekyll Data Integration

### FileSystemLoader

Loads Jekyll data into virtual filesystem:

1. Reads `window.JEKYLL_DATA`
2. Creates directory structure
3. Generates text files from YAML/JSON
4. Populates filesystem with data

### Data Sources

- `terminal.yml` - Bio, skills, projects, experience
- `companies.yml` - Company details and achievements
- `projects.json` - Project information
- Generated data files from plugins

## File Operations

### Reading Files

```javascript
const content = this.filesystem.readFile('/home/user/README.txt');
if (content !== null) {
  // Process content
}
```

### Writing Files

```javascript
const success = this.filesystem.writeFile('/home/user/newfile.txt', 'content');
```

### Directory Operations

```javascript
// Create directory
this.filesystem.createDirectory('/home/user/newdir');

// List directory
const listing = this.filesystem.list('/home/user');
listing.forEach(item => {
  console.log(item.name, item.type);
});
```

## Integration with Commands

Commands use filesystem for:

- `ls` - List directory contents
- `cd` - Change directory
- `cat` - Read file contents
- `mkdir` - Create directory (EcmaOS)
- `touch` - Create file (EcmaOS)
- `rm` - Remove file (EcmaOS)

## Data Persistence

- **In-Memory**: Filesystem state stored in memory
- **Jekyll Data**: Source of truth for portfolio content
- **User Created**: Files created via commands persist in session
- **No Persistence**: Changes don't persist across page reloads (by design)

