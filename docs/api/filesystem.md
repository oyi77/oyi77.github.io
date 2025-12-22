# Filesystem API

## VirtualFileSystem Class

### Constructor

```javascript
const filesystem = new VirtualFileSystem();
```

### Path Resolution

#### `resolvePath(currentPath, targetPath)`

Resolves relative or absolute paths.

**Parameters**:
- `currentPath` (string) - Current working directory
- `targetPath` (string) - Target path (relative or absolute)

**Returns**: Normalized absolute path

**Examples**:
```javascript
filesystem.resolvePath('/home/user', 'documents') 
// → '/home/user/documents'

filesystem.resolvePath('/home/user', '../parent') 
// → '/home'

filesystem.resolvePath('/home/user', '~') 
// → '/home/user'

filesystem.resolvePath('/home/user', '/absolute/path') 
// → '/absolute/path'
```

### Path Existence

#### `exists(path)`

Check if path exists.

**Returns**: `boolean`

```javascript
if (filesystem.exists('/home/user/README.txt')) {
  // File exists
}
```

#### `isDirectory(path)`

Check if path is a directory.

**Returns**: `boolean`

#### `isFile(path)`

Check if path is a file.

**Returns**: `boolean`

### Directory Operations

#### `list(path)`

List directory contents.

**Parameters**:
- `path` (string) - Directory path

**Returns**: Array of `{name: string, type: 'directory'|'file'}` or `null`

**Example**:
```javascript
const listing = filesystem.list('/home/user');
if (listing) {
  listing.forEach(item => {
    console.log(item.name, item.type);
  });
}
```

#### `createDirectory(path)`

Create directory and parent directories.

**Parameters**:
- `path` (string) - Directory path

**Returns**: `boolean` - Success

### File Operations

#### `readFile(path)`

Read file content.

**Parameters**:
- `path` (string) - File path

**Returns**: File content (string) or `null` if not found

**Example**:
```javascript
const content = filesystem.readFile('/home/user/README.txt');
if (content !== null) {
  console.log(content);
}
```

#### `writeFile(path, content)`

Write file content.

**Parameters**:
- `path` (string) - File path
- `content` (string) - File content

**Returns**: `boolean` - Success

**Example**:
```javascript
filesystem.writeFile('/home/user/newfile.txt', 'Hello World');
```

#### `remove(path)`

Remove file or directory.

**Parameters**:
- `path` (string) - Path to remove

**Returns**: `boolean` - Success

#### `move(sourcePath, destPath)`

Move or rename file.

**Parameters**:
- `sourcePath` (string) - Source path
- `destPath` (string) - Destination path

**Returns**: `boolean` - Success

## Filesystem Structure

### Standard Directories

- `/` - Root directory
- `/home/user/` - User home directory
- `/companies/` - Company records
- `/achievements/` - Achievement logs
- `/skills/` - Skills data
- `/classified/` - Encrypted files

### File Types

- **File**: Contains text content
- **Directory**: Contains children
- **Executable**: Command reference (in `/usr/bin/`)

## Integration with Commands

Commands access filesystem via `this.filesystem`:

```javascript
class MyApp {
  constructor(terminal, filesystem, windowManager, os) {
    this.filesystem = filesystem;
    this.os = os; // Access currentPath via this.os.currentPath
  }

  async run(args) {
    const path = args[0] || this.os.currentPath;
    const resolvedPath = this.filesystem.resolvePath(this.os.currentPath, path);
    
    if (!this.filesystem.exists(resolvedPath)) {
      this.terminal.write(`\x1b[1;31mPath not found\x1b[0m\r\n`);
      return;
    }
    
    if (this.filesystem.isDirectory(resolvedPath)) {
      const listing = this.filesystem.list(resolvedPath);
      // Process directory
    } else {
      const content = this.filesystem.readFile(resolvedPath);
      // Process file
    }
  }
}
```

## Jekyll Data Integration

Filesystem is populated by `FileSystemLoader` from Jekyll data:

- Terminal data → `/home/user/` files
- Company data → `/companies/` directories
- Project data → `/home/user/projects/` files

## Limitations

- **No Persistence**: Changes don't persist across page reloads
- **In-Memory**: All data stored in memory
- **Read-Only by Default**: Some directories are read-only
- **No Permissions**: No file permission system

