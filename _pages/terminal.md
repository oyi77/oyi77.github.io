---
permalink: /terminal/
title: "Terminal"
layout: single
author_profile: false
---

<div class="terminal-wrapper">
  <div class="terminal-container">
    <div id="terminal"></div>
  </div>
</div>

<!-- Load xterm.js from CDN -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/xterm@5.3.0/css/xterm.css" />
<script src="https://cdn.jsdelivr.net/npm/xterm@5.3.0/lib/xterm.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/lib/xterm-addon-fit.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xterm-addon-web-links@0.9.0/lib/xterm-addon-web-links.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xterm-addon-webgl@0.16.0/lib/xterm-addon-webgl.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xterm-addon-canvas@0.5.0/lib/xterm-addon-canvas.js"></script>
<!-- Advanced xterm.js addons -->
<script src="https://cdn.jsdelivr.net/npm/xterm-addon-search@0.13.0/lib/xterm-addon-search.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xterm-addon-unicode11@0.5.0/lib/xterm-addon-unicode11.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xterm-addon-serialize@0.7.0/lib/xterm-addon-serialize.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xterm-addon-image@0.5.0/lib/xterm-addon-image.js"></script>

<!-- Web3OS Loader -->
<script type="module" src="https://web3os.sh/_loader.js"></script>

<!-- Load terminal CSS -->
<link rel="stylesheet" href="{{ '/assets/css/terminal.css' | relative_url }}" />

<!-- Load terminal core files -->
<script src="{{ '/assets/js/terminal/utils.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/filesystem.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/window-manager.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/boot-sequence.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/effects.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/themes.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/github.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/syntax-highlight.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/web3os.js' | relative_url }}"></script>

<!-- New Hacker OS Apps -->
<script src="{{ '/assets/js/terminal/apps/help.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/apps/whoami.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/apps/companies.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/apps/achievements.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/apps/repos.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/apps/sysmon.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/apps/netmap.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/apps/neofetch.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/apps/skills.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/apps/3pm.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/apps/wallet.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/apps/cv.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/apps/hack.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/apps/cat.js' | relative_url }}"></script>
<script src="{{ '/assets/js/terminal/apps/web3os.js' | relative_url }}"></script>

<script src="{{ '/assets/js/terminal/core.js' | relative_url }}"></script>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Ensure FitAddon is available in the expected format
  if (typeof FitAddon !== 'undefined' && !window.FitAddon.FitAddon) {
    window.FitAddon = { FitAddon: FitAddon };
  }

  const terminalOS = new TerminalOS('terminal');
  window.terminalOS = terminalOS;
});
</script>

