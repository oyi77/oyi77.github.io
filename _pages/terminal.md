---
permalink: /terminal/
title: "Terminal"
layout: terminal
author_profile: false
---


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

