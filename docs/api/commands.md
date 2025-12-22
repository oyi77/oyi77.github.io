# Command Reference

Complete reference for all terminal commands.

## Core Commands

### `help`
Display command reference.

**Usage**: `help`

**Description**: Shows all available commands organized by category.

---

### `whoami`
Display user profile and leadership experience.

**Usage**: `whoami`

**Description**: Shows detailed professional profile, skills, and experience.

---

### `companies`
Explore company leadership records.

**Usage**: 
- `companies` - List all companies
- `companies <id>` - Show company details

**Examples**:
- `companies`
- `companies garudamedia`

---

### `achievements`
Browse mission accomplishment logs.

**Usage**: `achievements`

**Description**: Shows categorized achievements and accomplishments.

---

### `repos`
Real-time GitHub repository scan.

**Usage**: `repos` or `scan`

**Description**: Fetches and displays GitHub repositories.

---

### `sysmon`
Real-time system resource monitor.

**Usage**: `sysmon`

**Description**: Shows system resources (CPU, memory, etc.) in htop style.

---

### `neofetch`
System information summary.

**Usage**: `neofetch`

**Description**: Displays system information in ASCII art style.

---

### `skills`
Capability matrix display.

**Usage**: `skills`

**Description**: Shows technical skills organized by category.

---

### `cv`
Interactive CV access.

**Usage**:
- `cv` - Default interactive mode
- `cv interactive` - Launch graphical CV OS
- `cv pdf` - Download PDF CV
- `cv text` - View text summary

---

### `hack`
Privilege escalation simulation game.

**Usage**: `hack`

**Description**: Interactive hacking mini-game to gain root access.

---

### `opm`
Advanced package manager.

**Usage**:
- `opm install <pkg>` - Install package
- `opm list` - List installed packages
- `opm search <query>` - Search packages
- `opm update` - Update packages

---

## Filesystem Commands

### `ls`
List directory contents.

**Usage**: `ls [path]`

**Examples**:
- `ls`
- `ls /companies`
- `ls ~/projects`

---

### `cd`
Change directory.

**Usage**: `cd [path]`

**Examples**:
- `cd /companies`
- `cd ..`
- `cd ~`

---

### `pwd`
Print working directory.

**Usage**: `pwd`

---

### `cat`
Display file contents with syntax highlighting.

**Usage**: 
- `cat <file>`
- `cat -n <file>` - Show line numbers
- `cat -E <file>` - Show $ at end of lines
- `cat -A <file>` - Show all

**Examples**:
- `cat README.txt`
- `cat -n /home/user/about.txt`

---

## EcmaOS Commands

These commands are delegated to the EcmaOS kernel:

### File Operations
- `mkdir <dir>` - Create directory
- `touch <file>` - Create file
- `rm <file>` - Remove file
- `mv <src> <dest>` - Move/rename file
- `cp <src> <dest>` - Copy file

### System Commands
- `ps` - List processes
- `kill <pid>` - Terminate process
- `df` - Disk space usage
- `du` - File space usage
- `free` - Memory usage
- `env` - Environment variables

### Network
- `fetch <url>` - Download file
- `download <url>` - Download resource

### Utilities
- `edit <file>` - Open file editor
- `load <module>` - Load module

### Entertainment
- `snake` - Play snake game
- `video <file>` - Play video
- `play <file>` - Play media
- `screensaver` - Activate screensaver
- `matrix` - Matrix rain effect
- `decrypt <file>` - Decrypt file

---

## Advanced Commands

### `github`
GitHub repository explorer.

**Usage**: `github [username]`

---

### `stats`
Repository and code quality statistics.

**Usage**: `stats`

---

### `analytics`
Analytics dashboard.

**Usage**: `analytics`

---

### `market`
Market data display.

**Usage**:
- `market crypto` - Cryptocurrency prices
- `market indices` - Stock indices
- `crypto` - Alias for market crypto

---

### `theme`
Switch terminal theme.

**Usage**: `theme <name>`

**Themes**: `matrix`, `amber`, `hacker`, `cyberpunk`

---

### `clear` / `cls`
Clear terminal screen.

**Usage**: `clear`

---

### `home`
Show welcome banner.

**Usage**: `home`

---

## Keyboard Shortcuts

- **Tab** - Command/file completion
- **↑/↓** - Command history navigation
- **Ctrl+F** - Search terminal content
- **ESC** - Skip boot sequence

