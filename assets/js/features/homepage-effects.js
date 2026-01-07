// Homepage Interactive Effects
(function() {
  'use strict';

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initScrollProgress();
    initCommandPalette();
    initSkillTabs();
    initCounterAnimations();
    initScrollAnimations();
    initKonamiCode();
    initParticleToggle();
    initTerminalEmbedding();
  }

  // Scroll Progress Bar
  function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    function updateProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      progressBar.style.width = Math.min(scrollPercent, 100) + '%';
      progressBar.setAttribute('aria-valuenow', Math.round(scrollPercent));
    }

    window.addEventListener('scroll', throttle(updateProgress, 10));
    updateProgress();
  }

  // Command Palette
  function initCommandPalette() {
    const palette = document.getElementById('command-palette');
    const trigger = document.getElementById('command-palette-trigger');
    const input = document.getElementById('command-input');
    const closeBtn = document.querySelector('.command-palette-close');
    const results = document.getElementById('command-results');
    
    if (!palette || !trigger || !input) return;

    const commands = [
      { name: 'Go to Terminal', action: () => scrollToSection('terminal-section'), keywords: ['terminal', 'term', 'cli'] },
      { name: 'Go to Projects', action: () => scrollToSection('sites-hub'), keywords: ['projects', 'sites', 'hub'] },
      { name: 'Go to Highlights', action: () => scrollToSection('highlights'), keywords: ['highlights', 'achievements'] },
      { name: 'Go to Skills', action: () => scrollToSection('expertise'), keywords: ['skills', 'expertise', 'tech'] },
      { name: 'Go to Social', action: () => scrollToSection('social'), keywords: ['social', 'contact', 'links'] },
      { name: 'Go to Top', action: () => scrollToSection('hero'), keywords: ['top', 'home', 'hero'] },
    ];

    function openPalette() {
      palette.classList.add('active');
      palette.setAttribute('aria-hidden', 'false');
      input.focus();
      input.value = '';
      updateResults('');
    }

    function closePalette() {
      palette.classList.remove('active');
      palette.setAttribute('aria-hidden', 'true');
    }

    function updateResults(query) {
      if (!results) return;
      
      const queryLower = query.toLowerCase();
      const matches = commands.filter(cmd => 
        cmd.name.toLowerCase().includes(queryLower) ||
        cmd.keywords.some(kw => kw.includes(queryLower))
      );

      if (query === '') {
        results.innerHTML = '<div style="color: #00ff41; padding: 1rem;">Type to search commands...</div>';
        return;
      }

      if (matches.length === 0) {
        results.innerHTML = '<div style="color: #ff0000; padding: 1rem;">No commands found</div>';
        return;
      }

      results.innerHTML = matches.map((cmd, index) => `
        <div class="command-item" 
             style="padding: 0.75rem; cursor: pointer; border-bottom: 1px solid rgba(0, 255, 65, 0.2);"
             data-index="${index}"
             onmouseover="this.style.background='rgba(0, 255, 65, 0.1)'"
             onmouseout="this.style.background='transparent'">
          <div style="color: #00ff41; font-weight: bold;">${cmd.name}</div>
        </div>
      `).join('');

      // Add click handlers
      results.querySelectorAll('.command-item').forEach((item, index) => {
        item.addEventListener('click', () => {
          matches[index].action();
          closePalette();
        });
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openPalette();
      }
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        openPalette();
      }
      if (e.key === 'Escape' && palette.classList.contains('active')) {
        closePalette();
      }
    });

    if (trigger) {
      trigger.addEventListener('click', openPalette);
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', closePalette);
    }
    if (input) {
      input.addEventListener('input', (e) => updateResults(e.target.value));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const firstItem = results.querySelector('.command-item');
          if (firstItem) {
            firstItem.click();
          }
        }
      });
    }
  }

  // Skill Tabs Filtering
  function initSkillTabs() {
    const tabs = document.querySelectorAll('.skill-tab');
    const badges = document.querySelectorAll('.skill-badge');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const category = tab.dataset.category;
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter badges
        badges.forEach((badge, index) => {
          badge.style.setProperty('--index', index);
          
          if (category === 'all' || badge.dataset.category === category) {
            badge.style.display = 'inline-block';
            badge.style.animation = 'fadeInUp 0.5s ease backwards';
            badge.style.animationDelay = `${index * 0.05}s`;
          } else {
            badge.style.display = 'none';
          }
        });
      });
    });
  }

  // Counter Animations
  function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const interval = setInterval(() => {
              current += step;
              if (current >= target) {
                counter.textContent = target + '+';
                clearInterval(interval);
              } else {
                counter.textContent = Math.floor(current) + '+';
              }
            }, 16);
            observer.unobserve(counter);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(counter);
    });
  }

  // Scroll Animations
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe cards and sections
    document.querySelectorAll('.hub-card, .achievement-card, .timeline-item').forEach(el => {
      observer.observe(el);
    });
  }

  // Konami Code Easter Egg
  function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
      if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          activateEasterEgg();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    });
  }

  function activateEasterEgg() {
    // Create a fun effect
    const body = document.body;
    body.style.animation = 'glitch 0.5s';
    
    // Create confetti or particles
    for (let i = 0; i < 50; i++) {
      createParticle();
    }

    setTimeout(() => {
      body.style.animation = '';
    }, 500);
  }

  function createParticle() {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.background = ['#00ff41', '#00ffff', '#ff00ff'][Math.floor(Math.random() * 3)];
    particle.style.borderRadius = '50%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = '-10px';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '10000';
    particle.style.boxShadow = '0 0 10px currentColor';
    
    document.body.appendChild(particle);
    
    const duration = 2000 + Math.random() * 1000;
    const endX = (Math.random() - 0.5) * 200;
    const endY = window.innerHeight + 100;
    
    particle.animate([
      { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${endX}px, ${endY}px) rotate(360deg)`, opacity: 0 }
    ], {
      duration: duration,
      easing: 'ease-out'
    }).onfinish = () => particle.remove();
  }

  // Particle Toggle
  function initParticleToggle() {
    // Optional: Add particle system toggle button
    // This can be enhanced with a canvas-based particle system
  }

  // Terminal Embedding
  function initTerminalEmbedding() {
    const expandBtn = document.getElementById('terminal-expand-btn');
    const launchBtn = document.getElementById('terminal-launch-btn');
    const overlay = document.getElementById('terminal-fullpage-overlay');
    const closeBtn = document.getElementById('terminal-close-btn');
    const embedded = document.getElementById('terminal-embedded');
    const fullpage = document.getElementById('terminal-fullpage');

    if (!expandBtn || !overlay) return;

    // Expand to full page - redirect to terminal page
    expandBtn.addEventListener('click', () => {
      window.location.href = '/terminal/';
    });

    // Launch terminal - redirect to terminal page
    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        window.location.href = '/terminal/';
      });
    }

    // Close full page (if terminal is loaded on this page)
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        morphToEmbedded();
      });
    }

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        morphToEmbedded();
      }
    });

    function morphToFullPage() {
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Initialize terminal in full page if not already
      if (fullpage && !fullpage.querySelector('.xterm')) {
        if (window.terminalOS) {
          // Move terminal to full page container
          const termElement = embedded.querySelector('.xterm') || embedded.querySelector('#terminal');
          if (termElement && termElement.parentNode) {
            fullpage.appendChild(termElement);
          }
        } else if (window.TerminalOS) {
          initializeTerminalFullPage();
        }
      }
    }

    function morphToEmbedded() {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function initializeTerminalFullPage() {
      if (window.TerminalOS && fullpage) {
        window.terminalOSFullPage = new TerminalOS('terminal-fullpage');
      }
    }
  }

  // Utility Functions
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
})();

