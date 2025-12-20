# 🖥️ Hacker Terminal OS - Portfolio Hub

> **An immersive terminal-based operating system experience showcasing technical leadership and engineering excellence**

[![Live Demo](https://img.shields.io/badge/Live-Demo-00ff00?style=for-the-badge)](https://oyi77.github.io/terminal/)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-181717?style=for-the-badge&logo=github)](https://oyi77.github.io/)
[![Portfolio](https://img.shields.io/badge/CV-OS-00ff00?style=for-the-badge)](https://oyi77.github.io/oyi77)

## 🎯 Overview

This is not just a portfolio—it's a **fully interactive hacker-themed terminal OS** that simulates a complete boot experience from BIOS to command prompt. Built to showcase my journey as a **Technical Lead** who has successfully led 4 major companies with teams ranging from 18 to 3000+ employees.

### 🏢 Leadership Highlights

- **GarudaMedia** - Affiliate & ads publisher with 3000+ employees
- **Solomon Mining** - Indonesia's first legal crypto mining operation  
- **BerkahKarya** - Talent & digital marketing agency, 5B+ IDR monthly turnover
- **AiTradePulse** - Algorithmic trading platform with 90%+ win rate

## ✨ Features

### 🚀 Boot Sequence
- **BIOS Simulation** - POST checks, hardware detection, memory enumeration
- **Boot Loader** - GRUB-style interface with kernel loading animation
- **OS Initialization** - Service startup, filesystem mounting, network setup
- **Skip Option** - Press ESC to skip boot sequence

### 💻 Terminal Experience
- **Matrix-Style Interface** - Green phosphor, amber, and cyberpunk themes
- **CRT Effects** - Scanlines, glitch animations, phosphor glow
- **Rich Commands** - 20+ interactive commands
- **Virtual File System** - Navigate directories, read files, explore achievements
- **Command History** - Persistent history with arrow key navigation
- **Tab Completion** - Smart command completion

### 🎮 Interactive Commands

#### Core Commands
- `help` - Show all available commands
- `whoami` - Display detailed profile and leadership experience
- `companies` - Explore achievements across 4 major companies
- `achievements` - Browse categorized accomplishments
- `skills` - Visual skills matrix with proficiency levels
- `cv` - Open interactive CV OS in new tab

#### File System
- `ls` - List directory contents
- `cd` - Change directory
- `cat` - Read file contents with syntax highlighting and line numbers
  - `cat -n file.txt` - Show line numbers
  - `cat -E file.txt` - Show $ at end of each line
  - `cat -A file.txt` - Show all (equivalent to -vET)
  - Supports multiple files: `cat file1.txt file2.txt`
- `pwd` - Print working directory

#### Fun & Easter Eggs
- `hack` - Hacking simulation mini-game
- `decrypt` - Decrypt classified files
- `theme` - Switch terminal themes
- `matrix` - Toggle Matrix rain effect

### 📁 Virtual File System

```
/
├── home/user/
│   ├── README.txt
│   ├── cv.pdf
│   └── portfolio/
├── companies/
│   ├── garudamedia/
│   ├── solomon-mining/
│   ├── berkahkarya/
│   └── aitradepulse/
├── achievements/
│   ├── leadership.txt
│   ├── technical.txt
│   └── business-impact.txt
├── skills/
└── classified/
    └── encrypted_*.enc
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Terminal**: [xterm.js](https://xtermjs.org/) - Full-featured terminal emulator
- **Site Generator**: Jekyll with Minimal Mistakes theme
- **Hosting**: GitHub Pages
- **Effects**: Custom CSS animations, Canvas API for particles

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/oyi77/oyi77.github.io.git
cd oyi77.github.io

# Install Jekyll dependencies
bundle install

# Run local server
bundle exec jekyll serve

# Open browser to http://localhost:4000/terminal/
```

### Deployment

This site automatically deploys to GitHub Pages on push to the `main` branch.

```bash
# Make changes
git add .
git commit -m "Update terminal features"
git push origin main

# Site will be live at https://oyi77.github.io/
```

## 📖 Command Reference

For a complete list of commands and usage examples, see [COMMANDS.md](COMMANDS.md).

### Essential Commands

| Command | Description | Example |
|---------|-------------|---------|
| `help` | Show all commands | `help` |
| `whoami` | Display profile | `whoami` |
| `companies` | List companies | `companies` |
| `companies <name>` | Company details | `companies garudamedia` |
| `achievements` | Show achievements | `achievements` |
| `skills` | Skills matrix | `skills` |
| `cv` | Open CV OS | `cv` |
| `ls [path]` | List directory | `ls /companies` |
| `cat <file>` | Read file | `cat /home/user/README.txt` |
| `theme <name>` | Change theme | `theme matrix` |
| `clear` | Clear screen | `clear` |

## 🎨 Themes

- **Matrix** - Classic green phosphor (default)
- **Amber** - Vintage amber terminal
- **Hacker** - Bright green on black
- **Cyberpunk** - Neon colors

Switch themes with: `theme <name>`

## 📂 Project Structure

```
oyi77.github.io/
├── _data/
│   ├── terminal.yml          # Main configuration & data
│   ├── companies.yml          # Company details
│   └── navigation.yml         # Site navigation
├── _pages/
│   └── terminal.md            # Terminal page
├── assets/
│   ├── css/
│   │   └── terminal.css       # Terminal styling & effects
│   └── js/
│       └── terminal/
│           ├── boot-sequence.js    # Boot system
│           ├── core.js             # Main terminal logic
│           ├── effects.js          # Visual effects
│           ├── filesystem.js       # Virtual FS
│           ├── themes.js           # Theme management
│           └── apps/               # Command applications
│               ├── whoami.js
│               ├── companies.js
│               ├── achievements.js
│               ├── skills-matrix.js
│               └── ...
├── MuchammadFikriIzzuddin_CV.pdf
└── README.md
```

## 🎯 Key Features Implementation

### Boot Sequence
The boot sequence provides an immersive experience simulating a real computer startup:
1. **BIOS** - Hardware checks and POST
2. **Boot Loader** - OS selection and kernel loading
3. **Init** - System services initialization

### Command System
Each command is implemented as a modular app in `assets/js/terminal/apps/`, making it easy to add new commands.

### Virtual File System
A complete virtual filesystem with directories, files, and navigation. Files contain real content about achievements and experience.

## 🌟 Highlights

- ✅ **Immersive Experience** - Full boot sequence from BIOS to prompt
- ✅ **Leadership Showcase** - Detailed achievements from 4 major companies
- ✅ **Interactive** - 20+ commands, mini-games, easter eggs
- ✅ **Visual Effects** - Matrix rain, glitch effects, CRT simulation
- ✅ **Responsive** - Works on desktop, tablet, and mobile
- ✅ **Fast** - Optimized loading, skip boot option
- ✅ **Accessible** - Keyboard navigation, high contrast themes
- ✅ **Advanced Terminal** - xterm.js with Search, Unicode11, Serialize, and Image addons
- ✅ **Enhanced Cat** - Syntax highlighting, line numbers, multiple file support
- ✅ **Web3OS Integration** - Decentralized OS capabilities, npm package installation, Node.js execution
- ✅ **Auto Deployment** - GitHub Actions workflow for automatic GitHub Pages deployment

## 📱 Responsive Design

The terminal automatically adapts to different screen sizes:
- **Desktop** - Full experience with all effects
- **Tablet** - Optimized layout with essential effects
- **Mobile** - Simplified boot, touch-friendly commands

## 🔗 Links

- **Live Terminal OS**: [oyi77.github.io/terminal](https://oyi77.github.io/terminal/)
- **Interactive CV OS**: [oyi77.github.io/oyi77](https://oyi77.github.io/oyi77)
- **GitHub Profile**: [@oyi77](https://github.com/oyi77)
- **LinkedIn**: [fikriizzuddin](https://linkedin.com/in/fikriizzuddin)
- **Portfolio Hub**: [linktr.ee/jokogendeng](https://linktr.ee/jokogendeng)

## 📄 CV Download

Download my CV: [MuchammadFikriIzzuddin_CV.pdf](MuchammadFikriIzzuddin_CV.pdf)

Or use the terminal: `cat ~/cv.pdf` or `cv download`

## 🤝 About Me

**Muchammad Fikri Izzuddin**  
Lead Software Engineer | Technical Lead | Blockchain Developer

7+ years of experience in full-stack development, blockchain, and embedded systems. Proven track record of leading teams from 18 to 3000+ members, architecting scalable solutions, and driving significant business impact.

### Core Expertise
- **Leadership**: Led 4 major companies, managed teams of 3000+ employees
- **Full-Stack**: Python, JavaScript, React, Node.js, PHP
- **Blockchain**: Smart contracts, DeFi, crypto trading systems
- **DevOps**: Docker, Kubernetes, AWS, CI/CD
- **Trading**: Algorithmic trading, 90%+ win rate systems

## 📜 License

This project is open source and available for educational purposes. Feel free to explore the code and use it as inspiration for your own terminal-based portfolio.

## 🙏 Acknowledgments

- [xterm.js](https://xtermjs.org/) - Terminal emulator
- [Jekyll](https://jekyllrb.com/) - Static site generator
- [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) - Jekyll theme
- [GitHub Pages](https://pages.github.com/) - Hosting

---

**Built with ❤️ and ☕ by [Muchammad Fikri Izzuddin](https://github.com/oyi77)**

*"Code is poetry, terminals are art"* 🎨
