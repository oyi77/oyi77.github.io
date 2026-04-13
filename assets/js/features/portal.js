/**
 * Portal.js - Interactive functionality for the portfolio homepage
 * Features: Real-time clock, toggle expansion, modal system
 */

// ============================================================================
// TIME/DATE DISPLAY
// ============================================================================

function updateTime() {
  const now = new Date();

  // Format time (HH:MM:SS)
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;

  // Format date (DAY, DD MONTH YYYY)
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const dayName = days[now.getDay()];
  const day = String(now.getDate()).padStart(2, '0');
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const dateString = `${dayName}, ${day} ${month} ${year}`;

  // Update DOM (with null checks)
  const timeEl = document.getElementById('current-time');
  const dateEl = document.getElementById('current-date');

  if (timeEl) timeEl.textContent = timeString;
  if (dateEl) dateEl.textContent = dateString;
}

// ============================================================================
// DUAL-SCREEN NAVIGATION
// ============================================================================

function initToggle() {
  const toggleBtn = document.getElementById('see-more-btn');
  const toggleContainer = document.getElementById('toggle-container');
  const dualArrowContainer = document.getElementById('dual-arrow-container');
  const navArrowLeft = document.getElementById('nav-arrow-left');
  const navArrowDown = document.getElementById('nav-arrow-down');
  const expandedSections = document.getElementById('expanded-sections');
  const mainContent = document.getElementById('main-content');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  const metricsSections = document.getElementById('metrics-sections');
  const curatedSections = document.getElementById('curated-sections');
  const arrow = toggleBtn?.querySelector('.arrow');

  if (!toggleBtn || !expandedSections || !mainContent || !toggleContainer || !metricsSections || !curatedSections) {
    console.warn('Navigation elements not found - check HTML structure');
    return;
  }

  let currentState = 'main'; // 'main' | 'expanded' | 'metrics' | 'curated'

  const updateArrowVisibility = () => {
    const mainRightToggle = document.getElementById('main-right-toggle');

    // Hide all arrows first
    toggleContainer.style.display = 'none';
    if (dualArrowContainer) dualArrowContainer.style.display = 'none';
    if (mainRightToggle) mainRightToggle.style.display = 'none';

    if (currentState === 'expanded') {
      // Show dual arrows (left and down)
      if (dualArrowContainer) {
        dualArrowContainer.style.display = 'flex';
        if (navArrowLeft) navArrowLeft.style.display = 'flex';
        if (navArrowDown) navArrowDown.style.display = 'flex';
      }
    } else if (currentState === 'metrics') {
      // Show only up arrow (single toggle pointing up)
      toggleContainer.style.display = 'flex';
      // toggleContainer.style.left = 'calc(50% + 480px)'; // OLD: Right side
      toggleContainer.style.left = '30px'; // NEW: Left side
      toggleContainer.style.right = 'auto';
      if (arrow) arrow.textContent = '↑';
    } else if (currentState === 'curated') {
      // Show only right arrow (single toggle pointing right, positioned on right side)
      toggleContainer.style.display = 'flex';
      toggleContainer.style.left = 'auto';
      toggleContainer.style.right = '30px';
      if (arrow) arrow.textContent = '→';
    } else if (currentState === 'main') {
      // Show left arrow on left side, right arrow on right side
      toggleContainer.style.display = 'flex';
      toggleContainer.style.left = '30px';
      toggleContainer.style.right = 'auto';
      if (arrow) arrow.textContent = '←';
      // Also show right arrow for expanded view
      if (mainRightToggle) {
        mainRightToggle.style.display = 'flex';
        const rightArrow = mainRightToggle.querySelector('.arrow');
        if (rightArrow) rightArrow.textContent = '→';
      }
    }
  };

  const showMain = () => {
    currentState = 'main';
    toggleBtn.classList.remove('active');
    toggleContainer.classList.remove('active');
    portfolioCards.forEach(card => card.classList.remove('animate'));
    expandedSections.classList.remove('show');
    metricsSections.classList.remove('show');
    curatedSections.classList.remove('show');
    metricsSections.setAttribute('aria-hidden', 'true');
    curatedSections.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      mainContent.classList.remove('slide-left');
      mainContent.classList.remove('slide-right');
    }, 100);
    document.body.style.overflow = '';
    updateArrowVisibility();
  };

  const showExpanded = () => {
    // If coming from metrics, just hide metrics
    if (currentState === 'metrics') {
      metricsSections.classList.remove('show');
      metricsSections.setAttribute('aria-hidden', 'true');
    } else if (currentState === 'curated') {
      curatedSections.classList.remove('show');
      curatedSections.setAttribute('aria-hidden', 'true');
      setTimeout(() => {
        mainContent.classList.remove('slide-right');
        mainContent.classList.add('slide-left');
      }, 100);
    } else {
      // Coming from main
      mainContent.classList.add('slide-left');
      toggleBtn.classList.add('active');
      toggleContainer.classList.add('active');
      setTimeout(() => {
        expandedSections.classList.add('show');
        portfolioCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('animate');
          }, index * 80);
        });
      }, 100);
    }
    currentState = 'expanded';
    document.body.style.overflow = 'hidden';
    updateArrowVisibility();
  };

  const showMetrics = () => {
    currentState = 'metrics';
    metricsSections.setAttribute('aria-hidden', 'false');
    metricsSections.classList.add('show');
    // Trigger metrics animation
    setTimeout(() => {
      initMetricsAnimation();
      loadGitHubStats();
    }, 100);
    updateArrowVisibility();
  };

  const showCurated = () => {
    currentState = 'curated';
    curatedSections.setAttribute('aria-hidden', 'false');
    mainContent.classList.add('slide-right');
    setTimeout(() => {
      curatedSections.classList.add('show');
      // Trigger GitHub Pages scan if not already done
      if (!curatedSections.dataset.scanned) {
        scanGitHubPages();
      }
    }, 100);
    document.body.style.overflow = 'hidden';
    updateArrowVisibility();
  };

  // Left arrow handler for main page
  toggleBtn.addEventListener('click', () => {
    if (currentState === 'main') {
      showCurated();
    } else {
      toggleView();
    }
  });

  // Refresh button handler
  const refreshBtn = document.getElementById('curated-refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      curatedSections.dataset.scanned = 'false';
      scanGitHubPages(true); // Force refresh
    });
  }

  const toggleView = () => {
    if (currentState === 'main') {
      showExpanded();
    } else if (currentState === 'expanded') {
      showMetrics();
    } else if (currentState === 'metrics') {
      showExpanded();
    } else if (currentState === 'curated') {
      showMain();
    }
  };

  // Right toggle button handler for main page
  const mainRightBtn = document.getElementById('main-right-btn');
  if (mainRightBtn) {
    mainRightBtn.addEventListener('click', () => {
      if (currentState === 'main') {
        showExpanded();
      }
    });
  }

  // Dual arrow handlers
  if (navArrowLeft) {
    navArrowLeft.addEventListener('click', () => {
      if (currentState === 'expanded') {
        showMain();
      }
    });
  }

  if (navArrowDown) {
    navArrowDown.addEventListener('click', () => {
      if (currentState === 'expanded') {
        showMetrics();
      }
    });
  }

  // Handle keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Navigation Logic
    if (currentState === 'main') {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        showExpanded();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showCurated();
      }
    } else if (currentState === 'expanded') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showMain();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        showMetrics();
      }
    } else if (currentState === 'metrics') {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        showExpanded();
      }
    } else if (currentState === 'curated') {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        showMain();
      }
    }

    if (e.key === 'Escape') {
      if (currentState === 'metrics') {
        showExpanded();
      } else if (currentState === 'expanded') {
        showMain();
      } else if (currentState === 'curated') {
        showMain();
      }
    }

    // Help shortcut
    if (e.key === '?' || (e.key === 'h' && e.shiftKey)) {
      e.preventDefault();
      showOnboarding();
    }
  });

  updateArrowVisibility();
  
  // Initialize tooltips with interval-based show/hide
  initArrowTooltips();
}

// ============================================================================
// ARROW TOOLTIPS WITH INTERVAL SHOW/HIDE
// ============================================================================

function initArrowTooltips() {
  const tooltipConfigs = [
    {
      button: document.getElementById('see-more-btn'),
      text: 'Curated Portfolio',
      updateText: (state) => {
        // Left arrow on main goes to curated, on metrics goes to expanded, on curated goes to main
        if (state === 'main') return 'Curated Portfolio';
        if (state === 'metrics') return 'Back to Expanded';
        return 'Back to Main';
      }
    },
    {
      button: document.getElementById('main-right-btn'),
      text: 'Expanded View',
      updateText: () => 'Expanded View'
    },
    {
      button: document.getElementById('nav-arrow-left'),
      text: 'Back to Main',
      updateText: () => 'Back to Main'
    },
    {
      button: document.getElementById('nav-arrow-down'),
      text: 'Key Achievements',
      updateText: () => 'Key Achievements'
    }
  ];

  const tooltipIntervals = new Map();
  let isUserInteracting = false;

  function createTooltip(button, text) {
    if (!button) return null;
    
    // Remove existing tooltip if any
    const existingTooltip = button.querySelector('.arrow-tooltip');
    if (existingTooltip) {
      existingTooltip.remove();
    }

    const tooltip = document.createElement('div');
    tooltip.className = 'arrow-tooltip';
    tooltip.textContent = text;
    tooltip.setAttribute('aria-hidden', 'true');
    button.appendChild(tooltip);
    return tooltip;
  }

  function showTooltip(tooltip) {
    if (tooltip && !isUserInteracting) {
      tooltip.classList.add('show');
      tooltip.setAttribute('aria-hidden', 'false');
    }
  }

  function hideTooltip(tooltip) {
    if (tooltip) {
      tooltip.classList.remove('show');
      tooltip.setAttribute('aria-hidden', 'true');
    }
  }

  function startTooltipInterval(button, tooltip, updateTextFn) {
    // Clear existing interval if any
    if (tooltipIntervals.has(button)) {
      clearInterval(tooltipIntervals.get(button));
    }

    let isVisible = false;
    const interval = setInterval(() => {
      // Check if button is visible (not display: none)
      const isButtonVisible = button.offsetParent !== null && 
                              window.getComputedStyle(button).display !== 'none';
      
      if (!isUserInteracting && isButtonVisible) {
        // Button is visible
        if (!isVisible) {
          // Update text based on current state
          if (updateTextFn) {
            const currentState = getCurrentState();
            tooltip.textContent = updateTextFn(currentState);
          }
          showTooltip(tooltip);
          isVisible = true;
        } else {
          hideTooltip(tooltip);
          isVisible = false;
        }
      } else if (!isButtonVisible) {
        // Button is hidden, hide tooltip
        hideTooltip(tooltip);
        isVisible = false;
      }
    }, 3000); // Show for 3s, hide for 3s (total 6s cycle)

    tooltipIntervals.set(button, interval);
  }

  function getCurrentState() {
    const expandedSections = document.getElementById('expanded-sections');
    const metricsSections = document.getElementById('metrics-sections');
    const curatedSections = document.getElementById('curated-sections');
    
    // Check visibility via display style or class
    if (metricsSections?.classList.contains('show') || 
        (metricsSections && window.getComputedStyle(metricsSections).opacity === '1')) {
      return 'metrics';
    }
    if (expandedSections?.classList.contains('show') || 
        (expandedSections && window.getComputedStyle(expandedSections).left === '0px')) {
      return 'expanded';
    }
    if (curatedSections?.classList.contains('show') || 
        (curatedSections && window.getComputedStyle(curatedSections).right === '0px')) {
      return 'curated';
    }
    return 'main';
  }

  // Create tooltips for all buttons
  tooltipConfigs.forEach(config => {
    if (!config.button) return;

    const tooltip = createTooltip(config.button, config.text);
    if (!tooltip) return;

    // Start interval-based show/hide
    startTooltipInterval(config.button, tooltip, config.updateText);

    // Show on hover, hide on leave
    config.button.addEventListener('mouseenter', () => {
      isUserInteracting = true;
      if (config.updateText) {
        const currentState = getCurrentState();
        tooltip.textContent = config.updateText(currentState);
      }
      showTooltip(tooltip);
    });

    config.button.addEventListener('mouseleave', () => {
      isUserInteracting = false;
      hideTooltip(tooltip);
    });

    // Update tooltip text when state changes
    const observer = new MutationObserver(() => {
      if (config.updateText && tooltip) {
        const currentState = getCurrentState();
        tooltip.textContent = config.updateText(currentState);
      }
    });

    // Observe changes to expanded/curated/metrics sections visibility
    const expandedSections = document.getElementById('expanded-sections');
    const curatedSections = document.getElementById('curated-sections');
    const metricsSections = document.getElementById('metrics-sections');
    if (expandedSections) {
      observer.observe(expandedSections, { attributes: true, attributeFilter: ['class'] });
    }
    if (curatedSections) {
      observer.observe(curatedSections, { attributes: true, attributeFilter: ['class'] });
    }
    if (metricsSections) {
      observer.observe(metricsSections, { attributes: true, attributeFilter: ['class'] });
    }
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    tooltipIntervals.forEach(interval => clearInterval(interval));
  });
}

// ============================================================================
// MODAL SYSTEM & CONTENT (Data-Driven from JEKYLL_DATA)
// ============================================================================

/**
 * Builds the modalData object dynamically from window.JEKYLL_DATA.
 * Sources: terminal.yml, companies.yml, case_studies.yml, led_projects.yml,
 *          aggregated_posts.yml, portal.yml
 * Falls back to sensible defaults when data is unavailable.
 */
function buildModalData() {
  const D = window.JEKYLL_DATA || {};
  const t = D.terminal || {};
  const companies = (D.companies && D.companies.companies) || [];
  const caseStudies = (D.case_studies && D.case_studies.case_studies) || [];
  const ledProjects = (D.led_projects && D.led_projects.led_projects) || [];
  const experience = t.experience || [];
  const skills = t.skills || {};
  const certs = t.certifications || [];
  const projects = t.projects || [];
  const sites = t.sites || [];
  const links = t.links || [];
  const education = t.education || {};
  const contactForm = t.contact_form || {};

  // --- Helpers ---
  function esc(s) { return (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function companyByName(name) {
    return companies.find(function(c) {
      return c.name && c.name.toLowerCase().indexOf(name.toLowerCase()) >= 0;
    });
  }
  function extractYears(period) {
    var m = (period || '').match(/(\d{4})/g);
    return m ? m.join('-') : period || '';
  }
  function buildExpSection(entry) {
    var html = '<section>';
    html += '<h3>' + esc(entry.company) + '</h3>';
    html += '<em>' + esc(entry.role) + ' (' + extractYears(entry.period) + ')</em>';
    if (entry.location) html += '<p>' + esc(entry.location) + '</p>';
    if (entry.achievements && entry.achievements.length) {
      html += '<ul>';
      entry.achievements.forEach(function(a) { html += '<li>' + esc(a) + '</li>'; });
      html += '</ul>';
    }
    html += '</section>';
    return html;
  }
  function buildCaseStudySection(cs) {
    var html = '<section>';
    html += '<h3>Case Study: ' + esc(cs.title) + '</h3>';
    if (cs.problem) html += '<p><strong>Challenge:</strong> ' + esc(cs.problem.trim()) + '</p>';
    if (cs.solution) html += '<p><strong>Solution:</strong> ' + esc(cs.solution.trim()) + '</p>';
    if (cs.metrics && cs.metrics.length) {
      html += '<ul>';
      cs.metrics.forEach(function(m) { html += '<li><strong>' + esc(m.metric) + '</strong>: ' + esc(m.value) + '</li>'; });
      html += '</ul>';
    }
    if (cs.outcome) html += '<p><em>' + esc(cs.outcome.trim()) + '</em></p>';
    html += '</section>';
    return html;
  }

  // --- Posts (from aggregated_posts or fallback to experience-based insights) ---
  var postsSection = (function() {
    var posts = D.aggregated_posts || [];
    // Group posts by category/source if available
    var engineering = [], trading = [], blockchain = [];
    if (Array.isArray(posts) && posts.length > 0) {
      posts.forEach(function(p) {
        var cats = ((p.categories || []).join(' ') + ' ' + (p.source || '') + ' ' + (p.title || '')).toLowerCase();
        if (cats.indexOf('trade') >= 0 || cats.indexOf('algo') >= 0 || cats.indexOf('quant') >= 0) {
          trading.push(p);
        } else if (cats.indexOf('blockchain') >= 0 || cats.indexOf('crypto') >= 0 || cats.indexOf('web3') >= 0 || cats.indexOf('defi') >= 0) {
          blockchain.push(p);
        } else {
          engineering.push(p);
        }
      });
    }
    function renderPostList(arr, fallbackHtml) {
      if (!arr.length) return fallbackHtml;
      var html = '<section><ul>';
      arr.slice(0, 8).forEach(function(p) {
        html += '<li>';
        if (p.url) {
          html += '<a href="' + esc(p.url) + '" target="_blank" rel="noopener"><strong>' + esc(p.title || 'Untitled') + '</strong></a>';
        } else {
          html += '<strong>' + esc(p.title || 'Untitled') + '</strong>';
        }
        if (p.date) html += ' <em>(' + esc(p.date.toString().substring(0, 10)) + ')</em>';
        if (p.excerpt) html += '<br>' + esc(p.excerpt.substring(0, 150));
        html += '</li>';
      });
      html += '</ul></section>';
      return html;
    }
    // Fallback content derived from company achievements
    var gm = companyByName('garuda');
    var engFallback = '<section><h3>High-Scale Architecture & Leadership</h3><p>' + esc(t.bio || '') + '</p>';
    engFallback += '<ul>';
    if (gm) { engFallback += '<li><strong>Microservices at Scale</strong>: Managed a network of ' + esc(gm.team_size || '3000+') + ' employees at ' + esc(gm.name) + '.</li>'; }
    engFallback += '<li><strong>Legacy Transformations</strong>: Migrating core PHP applications to modern Node.js environments.</li>';
    engFallback += '<li><strong>CI/CD Excellence</strong>: Reduced deployment cycles by up to 60% through automation.</li></ul></section>';

    var tradeFallback = '<section><h3>Quantitative Analysis & Algo Design</h3><ul>';
    var atp = companyByName('aitradepulse');
    if (atp) {
      (atp.key_metrics || []).forEach(function(m) { tradeFallback += '<li><strong>' + esc(m.metric) + ' (' + esc(m.value) + ')</strong>: ' + esc(m.description) + '</li>'; });
    }
    tradeFallback += '</ul></section>';

    var chainFallback = '<section><h3>On-Chain Dynamics & Web3 Security</h3><ul>';
    var bw = companyByName('bitwyre') || {};
    var bwProjects = ledProjects.filter(function(p) { return p.company === 'bitwyre'; });
    bwProjects.forEach(function(p) {
      chainFallback += '<li><strong>' + esc(p.name) + '</strong>: ' + esc((p.description || '').trim()) + '</li>';
    });
    if (!bwProjects.length) chainFallback += '<li>Fomo Watcher, DEX Clearing, OTC Portal — on-chain engineering at Bitwyre.</li>';
    chainFallback += '</ul></section>';

    return {
      title: 'Featured Publications & Insights',
      tabs: ['Engineering', 'Trading', 'Blockchain'],
      content: {
        'Engineering': renderPostList(engineering, engFallback),
        'Trading': renderPostList(trading, tradeFallback),
        'Blockchain': renderPostList(blockchain, chainFallback)
      }
    };
  })();

  // --- Achievements (from companies data) ---
  var achievementsSection = (function() {
    var gm = companyByName('garuda');
    var sm = companyByName('solomon');
    var bk = companyByName('berkah');
    var vp = companies.find(function(c) { return c.name && c.name.toLowerCase().indexOf('viapulsa') >= 0; }) ||
             { achievements: [] };

    var winsHtml = '<section><h3>Hard Metrics of Success</h3><ul>';
    // Pull quantifiable wins from all companies
    companies.forEach(function(co) {
      (co.key_metrics || []).forEach(function(m) {
        if (m.value && m.value !== 'Confidential') {
          winsHtml += '<li><strong>' + esc(m.value) + ' ' + esc(m.metric) + '</strong>: ' + esc(m.description) + ' (' + esc(co.name) + ')</li>';
        }
      });
    });
    winsHtml += '</ul></section>';

    var firstsHtml = '<section><h3>Pioneering Legal Crypto in Indonesia</h3>';
    if (sm) {
      firstsHtml += '<p><strong>' + esc(sm.name) + ' (' + esc(sm.period) + ')</strong>: ' + esc((sm.description || '').trim()) + '</p>';
      firstsHtml += '<h4>Key Metrics</h4><ul>';
      (sm.key_metrics || []).forEach(function(m) { firstsHtml += '<li><strong>' + esc(m.metric) + '</strong>: ' + esc(m.value) + '</li>'; });
      firstsHtml += '</ul>';
    }
    firstsHtml += '</section>';

    var growthHtml = '<section><h3>Technical Leadership at Scale</h3>';
    var compSummary = (D.companies && D.companies.summary) || {};
    growthHtml += '<p>Led teams ranging from small, elite groups to massive networks of <strong>' + esc(compSummary.total_team_members_led || '3,000+') + ' employees</strong>.</p>';
    if (bk) {
      growthHtml += '<p>At ' + esc(bk.name) + ', expanded the engineering team by 3x while increasing delivery velocity by 60%.</p>';
    }
    growthHtml += '<h4>Mentorship & Culture</h4><p>Strong teams are built on a culture of belonging and radical transparency.</p></section>';

    return {
      title: 'Milestones & Impact',
      tabs: ['Quantifiable Wins', 'Industry Firsts', 'Team Growth'],
      content: {
        'Quantifiable Wins': winsHtml,
        'Industry Firsts': firstsHtml,
        'Team Growth': growthHtml
      }
    };
  })();

  // --- Experience (from terminal.yml experience array) ---
  var experienceSection = (function() {
    // Split into current (contains "Present") and history
    var current = experience.filter(function(e) { return (e.period || '').indexOf('Present') >= 0; });
    var history = experience.filter(function(e) { return (e.period || '').indexOf('Present') < 0; });
    // Also add AiTradePulse from companies if not in experience
    var atpCompany = companyByName('aitradepulse');
    var hasAtp = experience.some(function(e) { return (e.company || '').toLowerCase().indexOf('aitradepulse') >= 0; });
    if (!hasAtp && atpCompany) {
      current.push({
        company: atpCompany.name,
        role: atpCompany.role,
        period: atpCompany.period,
        location: atpCompany.location,
        achievements: atpCompany.achievements || []
      });
    }
    // Add older companies from companies.yml if not in terminal experience
    ['solomon', 'garuda'].forEach(function(name) {
      var co = companyByName(name);
      var already = experience.some(function(e) { return (e.company || '').toLowerCase().indexOf(name) >= 0; });
      if (!already && co) {
        history.push({
          company: co.name,
          role: co.role,
          period: co.period,
          location: co.location,
          achievements: co.achievements || []
        });
      }
    });

    return {
      title: 'Professional Journey',
      tabs: ['Current', 'History'],
      content: {
        'Current': current.length ? current.map(buildExpSection).join('') : '<section><p>Current experience data not available.</p></section>',
        'History': history.length ? history.map(buildExpSection).join('') : '<section><p>Historical experience data not available.</p></section>'
      }
    };
  })();

  // --- Projects (from terminal.yml projects, led_projects, and sites) ---
  var projectsSection = (function() {
    var blockchain = [], quant = [], content = [], experimental = [];
    // Categorize led_projects by company
    ledProjects.forEach(function(p) {
      var name = (p.name || '').toLowerCase();
      var comp = (p.company || '').toLowerCase();
      if (comp === 'bitwyre' || name.indexOf('dex') >= 0 || name.indexOf('card') >= 0 || name.indexOf('otc') >= 0) {
        blockchain.push(p);
      } else {
        quant.push(p);
      }
    });
    function renderLedProject(p) {
      var html = '<h4>' + esc(p.name) + '</h4>';
      html += '<p>' + esc((p.description || '').trim()) + '</p>';
      if (p.outcomes && p.outcomes.length) {
        html += '<ul>';
        p.outcomes.slice(0, 3).forEach(function(o) { html += '<li>' + esc(o) + '</li>'; });
        html += '</ul>';
      }
      return html;
    }

    var blockchainHtml = '<section><h3>On-Chain Engineering Highlights</h3>';
    if (blockchain.length) {
      blockchain.forEach(function(p) { blockchainHtml += renderLedProject(p); });
    } else {
      // Fallback to terminal.yml projects
      projects.forEach(function(p) {
        var desc = (p.description || '').toLowerCase();
        if (desc.indexOf('blockchain') >= 0 || desc.indexOf('crypto') >= 0 || desc.indexOf('mining') >= 0) {
          blockchainHtml += '<h4>' + esc(p.name) + '</h4><p>' + esc(p.description) + '</p>';
        }
      });
    }
    blockchainHtml += '</section>';

    var quantHtml = '<section><h3>Trading & Analytics</h3>';
    if (quant.length) {
      quant.forEach(function(p) { quantHtml += renderLedProject(p); });
    }
    // Add AiTradePulse from companies
    var atp = companyByName('aitradepulse');
    if (atp) {
      quantHtml += '<h4>' + esc(atp.name) + '</h4><p>' + esc((atp.description || '').trim()) + '</p>';
    }
    quantHtml += '</section>';

    // Content & Media from sites
    var contentHtml = '<section><h3>Publications & News Platforms</h3>';
    var featuredSites = sites.filter(function(s) { return s.featured; });
    if (featuredSites.length) {
      featuredSites.forEach(function(s) {
        contentHtml += '<h4>' + esc(s.name) + '</h4>';
        contentHtml += '<p>' + esc(s.description) + '</p>';
        contentHtml += '<p style="margin-top: 10px;"><a href="' + esc(s.url) + '" target="_blank" style="color: var(--portal-accent); text-decoration: underline;">' + esc(s.name) + ' &rarr;</a></p>';
      });
    }
    contentHtml += '</section>';

    // Experimental from terminal.yml open-source projects
    var experimentalHtml = '<section><h3>Tools & Open Source</h3>';
    projects.forEach(function(p) {
      experimentalHtml += '<h4>' + esc(p.name) + '</h4>';
      experimentalHtml += '<p>' + esc(p.description) + '</p>';
      if (p.url) {
        experimentalHtml += '<p><a href="' + esc(p.url) + '" target="_blank" style="color: var(--portal-accent);">[Source]</a></p>';
      }
    });
    experimentalHtml += '</section>';

    return {
      title: 'Project Portfolio',
      tabs: ['Blockchain & Web3', 'Quant Systems', 'Content & Media', 'Experimental'],
      content: {
        'Blockchain & Web3': blockchainHtml,
        'Quant Systems': quantHtml,
        'Content & Media': contentHtml,
        'Experimental': experimentalHtml
      }
    };
  })();

  // --- Skills (from terminal.yml skills object) ---
  var skillsSection = (function() {
    var langs = skills.programming_languages || [];
    var frameworks = (skills.frameworks || []);
    var databases = (skills.databases || []);
    var tools = (skills.tools || []);
    var specialized = (skills.specialized || []);

    // Separate languages into tiers
    var highLevel = langs.filter(function(l) { return ['Python', 'JavaScript', 'TypeScript', 'PHP'].indexOf(l) >= 0; });
    var systems = langs.filter(function(l) { return ['C++', 'Java', 'MQL4/MQL5', 'C#'].indexOf(l) >= 0; });
    var automation = langs.filter(function(l) { return ['Bash', 'PowerShell', 'Shell'].indexOf(l) >= 0; });

    var langHtml = '<section><h3>The Foundation</h3><ul>';
    if (highLevel.length) langHtml += '<li><strong>High-Level</strong>: ' + highLevel.map(esc).join(', ') + '</li>';
    if (systems.length) langHtml += '<li><strong>Systems & Trading</strong>: ' + systems.map(esc).join(', ') + '</li>';
    if (automation.length) langHtml += '<li><strong>Automation</strong>: ' + automation.map(esc).join(', ') + '</li>';
    langHtml += '</ul></section>';

    var fwHtml = '<section><h3>Application Development</h3><ul>';
    if (frameworks.length) fwHtml += '<li><strong>Web</strong>: ' + frameworks.map(esc).join(', ') + '</li>';
    fwHtml += '<li><strong>Data Science</strong>: TensorFlow, PyTorch, NumPy, Pandas</li>';
    fwHtml += '</ul></section>';

    var infraHtml = '<section><h3>Cloud & Operations</h3><ul>';
    var cloudTools = tools.filter(function(t) { return ['AWS', 'Google Cloud', 'DigitalOcean'].indexOf(t) >= 0; });
    var containerTools = tools.filter(function(t) { return ['Docker', 'Kubernetes', 'Terraform'].indexOf(t) >= 0; });
    if (cloudTools.length) infraHtml += '<li><strong>Platforms</strong>: ' + cloudTools.map(esc).join(', ') + '</li>';
    if (containerTools.length) infraHtml += '<li><strong>Containerization</strong>: ' + containerTools.map(esc).join(', ') + '</li>';
    if (databases.length) infraHtml += '<li><strong>Persistence</strong>: ' + databases.map(esc).join(', ') + '</li>';
    if (specialized.length) infraHtml += '<li><strong>Specialized</strong>: ' + specialized.map(esc).join(', ') + '</li>';
    infraHtml += '</ul></section>';

    return {
      title: 'Technical Arsenal',
      tabs: ['Core Languages', 'Modern Frameworks', 'Infrastructure'],
      content: {
        'Core Languages': langHtml,
        'Modern Frameworks': fwHtml,
        'Infrastructure': infraHtml
      }
    };
  })();

  // --- About (from terminal.yml bio, education, links, contact_form) ---
  var aboutSection = (function() {
    var profHtml = '<section><h3>' + esc(t.title || 'Lead Software Engineer') + '</h3>';
    profHtml += '<p>' + esc(t.bio || '') + '</p>';
    if (education.institution) {
      profHtml += '<p>Background in Business Management from <strong>' + esc(education.institution) + '</strong> (GPA: ' + esc(education.gpa || '') + ').</p>';
    }
    profHtml += '</section>';

    var visionHtml = '<section><h3>Architecture as Art</h3>';
    visionHtml += '<p>Code is more than just instructions; it\'s a creative expression of efficiency. The mission is to build digital infrastructure that isn\'t just reliable, but beautiful in its execution.</p>';
    visionHtml += '<blockquote>"Efficiency is the ultimate form of elegance."</blockquote></section>';

    var connectHtml = '<section><h3>Get in Touch</h3>';
    connectHtml += '<p>Always looking for challenges that push the boundaries of what is technically possible.</p>';
    connectHtml += '<div style="margin: 20px 0;">';
    connectHtml += '<button onclick="window.ContactFormHandler && window.ContactFormHandler.show();" style="padding: 12px 30px; background: #000; border: 1px solid #fff; color: #fff; font-family: \'Monaco\', \'Menlo\', monospace; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background=\'#fff\'; this.style.color=\'#000\';" onmouseout="this.style.background=\'#000\'; this.style.color=\'#fff\';">Open Contact Form</button>';
    connectHtml += '</div><ul>';
    if (contactForm.cal_com_url) {
      connectHtml += '<li><strong>Schedule a Call</strong>: <a href="' + esc(contactForm.cal_com_url) + '" target="_blank">' + esc(contactForm.cal_com_url) + '</a></li>';
    }
    connectHtml += '<li><strong>Location</strong>: ' + esc(t.location || 'Southeast Asia') + '</li>';
    // Add social links
    var socialLinks = links.filter(function(l) { return ['GitHub', 'Twitter', 'Medium', 'LinkedIn'].indexOf(l.label) >= 0; });
    if (socialLinks.length) {
      connectHtml += '<li><strong>Social</strong>: ';
      connectHtml += socialLinks.map(function(l) { return '<a href="' + esc(l.url) + '" target="_blank">' + esc(l.label) + '</a>'; }).join(' | ');
      connectHtml += '</li>';
    }
    connectHtml += '</ul></section>';

    return {
      title: 'Profile & Mission',
      tabs: ['The Professional', 'The Vision', 'The Connection'],
      content: {
        'The Professional': profHtml,
        'The Vision': visionHtml,
        'The Connection': connectHtml
      }
    };
  })();

  // --- Certifications (from terminal.yml certifications array) ---
  var certificationsSection = (function() {
    var technical = certs.filter(function(c) { return (c.issuer || '').toLowerCase() === 'hackerrank'; });
    var leadership = certs.filter(function(c) {
      var issuer = (c.issuer || '').toLowerCase();
      return issuer === 'linkedin' || issuer === 'nasba';
    });

    var techHtml = '<section><h3>HackerRank Verified</h3><ul>';
    if (technical.length) {
      technical.forEach(function(c) { techHtml += '<li><strong>' + esc(c.name) + '</strong> (' + esc(c.issuer) + ')</li>'; });
    } else {
      techHtml += '<li>Certification data loading...</li>';
    }
    techHtml += '</ul></section>';

    var leaderHtml = '<section><h3>Professional Development</h3><ul>';
    if (leadership.length) {
      leadership.forEach(function(c) { leaderHtml += '<li><strong>' + esc(c.name) + '</strong> (' + esc(c.issuer) + ')</li>'; });
    } else {
      leaderHtml += '<li>Certification data loading...</li>';
    }
    leaderHtml += '</ul></section>';

    var instHtml = '<section><h3>Academic Foundation</h3>';
    if (education.institution) {
      instHtml += '<h4>' + esc(education.institution) + '</h4>';
      instHtml += '<p>' + esc(education.degree || '') + ' (GPA: ' + esc(education.gpa || '') + '/4.0)</p>';
      instHtml += '<p><em>Period: ' + esc(education.period || '') + '</em></p>';
    }
    instHtml += '</section>';

    return {
      title: 'Validations & Education',
      tabs: ['Technical', 'Leadership', 'Institutional'],
      content: {
        'Technical': techHtml,
        'Leadership': leaderHtml,
        'Institutional': instHtml
      }
    };
  })();

  // --- Leadership (from companies data — scale, growth, method) ---
  var leadershipSection = (function() {
    var gm = companyByName('garuda');
    var bk = companyByName('berkah');
    var compSummary = (D.companies && D.companies.summary) || {};

    var scaleHtml = '<section><h3>Leading ' + esc(compSummary.total_team_members_led || '3,000+') + '</h3>';
    scaleHtml += '<p>Leadership at scale isn\'t about micro-managing; it\'s about building systems that manage themselves.</p>';
    if (gm) {
      scaleHtml += '<p>At ' + esc(gm.name) + ', responsible for the technical standards and infrastructure that supported a distributed network of ' + esc(gm.team_size || '3000+') + ' employees.</p>';
    }
    scaleHtml += '</section>';

    var growthHtml = '<section><h3>Exponential Development</h3>';
    growthHtml += '<p>Specializing in taking teams from "Startup Chaos" to "Enterprise Excellence."</p>';
    if (bk) {
      growthHtml += '<p>At ' + esc(bk.name) + ', grew engineering team from 10 to 30+ members while increasing delivery velocity by 60%.</p>';
    }
    growthHtml += '</section>';

    var methodHtml = '<section><h3>Radical Transparency</h3>';
    methodHtml += '<p>Leadership philosophy built on technical transparency and meritocracy. Fostering environments where the best idea wins, and every engineer is empowered to take ownership of their work.</p>';
    methodHtml += '</section>';

    return {
      title: 'Impact & Strategy',
      tabs: ['The Scale', 'The Growth', 'The Method'],
      content: {
        'The Scale': scaleHtml,
        'The Growth': growthHtml,
        'The Method': methodHtml
      }
    };
  })();

  // --- Case Studies (from case_studies.yml) ---
  var caseStudiesSection = (function() {
    // Map case studies to tabs
    var tabMap = {};
    var tabNames = [];
    caseStudies.forEach(function(cs) {
      var company = (cs.company || '').toLowerCase();
      var tabName;
      if (company.indexOf('bitwyre') >= 0 || company.indexOf('aitradepulse') >= 0) {
        tabName = 'Trading Tech';
      } else if (company.indexOf('garuda') >= 0) {
        tabName = 'Scaling Tech';
      } else {
        tabName = 'Business Tech';
      }
      if (!tabMap[tabName]) { tabMap[tabName] = []; tabNames.push(tabName); }
      tabMap[tabName].push(cs);
    });
    // Ensure all 3 tabs exist
    ['Trading Tech', 'Scaling Tech', 'Business Tech'].forEach(function(tab) {
      if (!tabMap[tab]) { tabMap[tab] = []; if (tabNames.indexOf(tab) < 0) tabNames.push(tab); }
    });

    var contentObj = {};
    tabNames.forEach(function(tab) {
      if (tabMap[tab].length) {
        contentObj[tab] = tabMap[tab].map(buildCaseStudySection).join('');
      } else {
        contentObj[tab] = '<section><p>No case studies available in this category yet.</p></section>';
      }
    });

    return {
      title: 'Deep Research In-Sights',
      tabs: ['Trading Tech', 'Scaling Tech', 'Business Tech'],
      content: contentObj
    };
  })();

  // --- Examples / Demo Repository (from terminal.yml sites + projects) ---
  var examplesSection = (function() {
    // Live Platforms from featured sites
    var liveHtml = '<section><h3>Public Projects</h3><ul>';
    sites.filter(function(s) { return s.featured; }).forEach(function(s) {
      liveHtml += '<li><strong>' + esc(s.name) + '</strong>: ' + esc(s.description);
      liveHtml += ' <a href="' + esc(s.url) + '" target="_blank">[Live Demo]</a></li>';
    });
    liveHtml += '</ul></section>';

    // Open Utilities from terminal.yml projects (tools/utilities)
    var utilProjects = projects.filter(function(p) {
      var n = (p.name || '').toLowerCase();
      return n.indexOf('auto-job') >= 0 || n.indexOf('wifi') >= 0 || n.indexOf('rbminer') >= 0 || n.indexOf('miner') >= 0 || n.indexOf('kemkes') >= 0 || n.indexOf('nuclear') >= 0;
    });
    var utilHtml = '<section><h3>GitHub Highlights</h3><ul>';
    if (utilProjects.length) {
      utilProjects.forEach(function(p) {
        utilHtml += '<li><strong>' + esc(p.name) + '</strong>: ' + esc(p.description);
        if (p.url) utilHtml += ' <a href="' + esc(p.url) + '" target="_blank">[Source]</a>';
        utilHtml += '</li>';
      });
    }
    utilHtml += '</ul></section>';

    // Bots from terminal.yml projects
    var botProjects = projects.filter(function(p) {
      var n = (p.name || '').toLowerCase();
      return n.indexOf('bot') >= 0 || n.indexOf('telegram') >= 0 || n.indexOf('tiktok') >= 0 || n.indexOf('shopee') >= 0;
    });
    var botHtml = '<section><h3>Automation & AI</h3><ul>';
    if (botProjects.length) {
      botProjects.forEach(function(p) {
        botHtml += '<li><strong>' + esc(p.name) + '</strong>: ' + esc(p.description);
        if (p.url) botHtml += ' <a href="' + esc(p.url) + '" target="_blank">[Source]</a>';
        botHtml += '</li>';
      });
    }
    botHtml += '</ul></section>';

    return {
      title: 'Demo Repository',
      tabs: ['Live Platforms', 'Open Utilities', 'Bots'],
      content: {
        'Live Platforms': liveHtml,
        'Open Utilities': utilHtml,
        'Bots': botHtml
      }
    };
  })();

  return {
    posts: postsSection,
    achievements: achievementsSection,
    experience: experienceSection,
    projects: projectsSection,
    skills: skillsSection,
    about: aboutSection,
    certifications: certificationsSection,
    leadership: leadershipSection,
    'case-studies': caseStudiesSection,
    examples: examplesSection
  };
}

// Build modal data from JEKYLL_DATA (deferred until DOM ready)
let modalData = {};

let currentSection = null;
let currentTab = 0;

let lastFocusedElement = null;

function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstEl = focusableElements[0];
  const lastEl = focusableElements[focusableElements.length - 1];

  modal._trapHandler = function(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  };
  modal.addEventListener('keydown', modal._trapHandler);
}

function releaseFocus(modal) {
  if (modal._trapHandler) {
    modal.removeEventListener('keydown', modal._trapHandler);
    delete modal._trapHandler;
  }
}

function openModal(section) {
  const modal = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalTabs = document.getElementById('modal-tabs');
  const modalContent = document.getElementById('modal-content');

  currentSection = section;
  currentTab = 0;

  const data = modalData[section];
  if (!data) return;

  modalTitle.textContent = data.title;
  modalTabs.innerHTML = '';
  data.tabs.forEach((tab, index) => {
    const tabBtn = document.createElement('button');
    tabBtn.className = `modal-tab ${index === 0 ? 'active' : ''}`;
    tabBtn.textContent = tab;
    tabBtn.setAttribute('role', 'tab');
    tabBtn.setAttribute('aria-selected', index === 0);
    tabBtn.addEventListener('click', () => switchTab(index));
    modalTabs.appendChild(tabBtn);
  });

  updateModalContent();
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lastFocusedElement = document.activeElement;
  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.focus();
  trapFocus(modal);
}

function closeModal() {
  const modal = document.getElementById('modal-overlay');
  if (modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    releaseFocus(modal);
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
    document.body.style.overflow = '';
    currentSection = null;
  }
}

function switchTab(index) {
  currentTab = index;
  const tabs = document.querySelectorAll('.modal-tab');
  tabs.forEach((tab, i) => {
    tab.className = `modal-tab ${i === index ? 'active' : ''}`;
    tab.setAttribute('aria-selected', i === index);
  });
  updateModalContent();
}

function updateModalContent() {
  const modalContent = document.getElementById('modal-content');
  const data = modalData[currentSection];
  const tabName = data.tabs[currentTab];
  const content = data.content[tabName];
  
  // Add "View Blog" button for posts section
  let footerButton = '';
  if (currentSection === 'posts') {
    footerButton = `
      <div class="modal-footer">
        <a href="/blog/" class="view-blog-btn" aria-label="View all blog posts">
          <span class="btn-icon">→</span>
          <span class="btn-text">View Blog</span>
        </a>
      </div>
    `;
  }
  
  modalContent.innerHTML = `<div class="tab-pane active">${content}</div>${footerButton}`;
}

function initModal() {
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
      const section = card.getAttribute('data-section');
      openModal(section);
    });
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.getAttribute('data-section'));
      }
    });
  });

  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentSection) closeModal();
  });
}

// ============================================================================
// METRICS DASHBOARD ANIMATION
// ============================================================================

function initMetricsAnimation() {
  const metricValues = document.querySelectorAll('.metric-value, .achievement-value');

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        animateCounter(entry.target);
      }
    });
  }, observerOptions);

  metricValues.forEach(value => {
    observer.observe(value);
  });
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  if (isNaN(target)) return;
  const suffix = element.getAttribute('data-suffix') || '';
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current >= target) {
      element.textContent = target + suffix;
    } else {
      element.textContent = Math.floor(current) + suffix;
      requestAnimationFrame(updateCounter);
    }
  };

  requestAnimationFrame(updateCounter);
}

// ============================================================================
// GITHUB STATS LOADING
// ============================================================================

async function loadGitHubStats() {
  const fallback = window.JEKYLL_DATA?.github_stats || {};
  const elements = {
    repos: document.getElementById('repo-count'),
    stars: document.getElementById('github-stars'),
    forks: document.getElementById('github-forks'),
    contributions: document.getElementById('github-contributions')
  };

  // Show loading state
  Object.values(elements).forEach(el => {
    if (el) el.textContent = '...';
  });

  try {
    const username = 'oyi77';
    const response = await fetch(`https://api.github.com/users/${username}`);

    // Check rate limit
    const remaining = parseInt(response.headers.get('X-RateLimit-Remaining'));
    if (remaining === 0) {
      console.warn('GitHub API rate limit reached, using build-time data');
      applyGitHubFallback(elements, fallback);
      return;
    }

    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const data = await response.json();
    if (elements.repos) animateToValue(elements.repos, data.public_repos || 0);

    // Fetch repositories for stars/forks
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    if (reposResponse.ok) {
      const repos = await reposResponse.json();
      let totalStars = 0;
      let totalForks = 0;

      repos.forEach(repo => {
        totalStars += repo.stargazers_count || 0;
        totalForks += repo.forks_count || 0;
      });

      if (elements.stars) animateToValue(elements.stars, totalStars);
      if (elements.forks) animateToValue(elements.forks, totalForks);
    }

    if (elements.contributions) {
      elements.contributions.textContent = 'Active';
    }

  } catch (error) {
    console.warn('Failed to load GitHub stats:', error);
    applyGitHubFallback(elements, fallback);
  }
}

function applyGitHubFallback(elements, fallback) {
  if (elements.repos) elements.repos.textContent = fallback.public_repos || 'N/A';
  if (elements.stars) elements.stars.textContent = fallback.total_stars || 'N/A';
  if (elements.forks) elements.forks.textContent = fallback.total_forks || 'N/A';
  if (elements.contributions) elements.contributions.textContent = fallback.status || 'N/A';
}

function animateToValue(element, target) {
  const current = parseInt(element.textContent) || 0;
  if (isNaN(target) || current === target) {
    element.textContent = target;
    return;
  }

  const duration = 1500;
  const startTime = performance.now();
  const diff = target - current;

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic for smooth deceleration
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(current + diff * eased);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// ============================================================================
// ONBOARDING SYSTEM
// ============================================================================

function initOnboarding() {
  const onboardingModal = document.getElementById('onboarding-modal');
  const onboardingClose = document.getElementById('onboarding-close');
  const onboardingGotIt = document.getElementById('onboarding-got-it');
  const helpBtn = document.getElementById('help-btn');

  if (!onboardingModal) return;

  const closeOnboarding = () => {
    onboardingModal.classList.remove('show');
    onboardingModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (onboardingClose) {
    onboardingClose.addEventListener('click', closeOnboarding);
  }

  if (onboardingGotIt) {
    onboardingGotIt.addEventListener('click', () => {
      localStorage.setItem('hasSeenOnboarding', 'true');
      closeOnboarding();
    });
  }

  if (helpBtn) {
    helpBtn.addEventListener('click', showOnboarding);
  }

  // Close on outside click
  onboardingModal.addEventListener('click', (e) => {
    if (e.target.id === 'onboarding-modal') {
      closeOnboarding();
    }
  });

  // Check if user has seen onboarding
  const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
  if (!hasSeenOnboarding) {
    // Show after a short delay
    setTimeout(() => {
      showOnboarding();
    }, 1000);
  }
}

function showOnboarding() {
  const onboardingModal = document.getElementById('onboarding-modal');
  if (onboardingModal) {
    onboardingModal.classList.add('show');
    onboardingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

// ============================================================================
// GITHUB PAGES SCANNING
// ============================================================================

async function scanGitHubPages(forceRefresh = false) {
  const curatedGrid = document.getElementById('curated-grid');
  const curatedSkeleton = document.getElementById('curated-skeleton');
  const curatedSections = document.getElementById('curated-sections');
  const refreshBtn = document.getElementById('curated-refresh-btn');

  if (!curatedGrid || !curatedSections) return;

  // Known GitHub Pages - add these directly without scanning
  const knownPages = [
    { path: '/news', url: 'https://oyi77.github.io/news', title: 'News Aggregator', description: 'Real-time terminal news feed', repo: 'news', stars: 0 },
    { path: '/wifi-jammer', url: 'https://oyi77.github.io/wifi-jammer', title: 'WiFi Jammer', description: 'Security research tool', repo: 'wifi-jammer', stars: 0 },
    { path: '/adbs', url: 'https://oyi77.github.io/adbs', title: 'ADbS', description: 'AI Behavior, Rule & Task System', repo: 'adbs', stars: 0 },
    { path: '/oyi77', url: 'https://oyi77.github.io/oyi77', title: 'One Piece cvOS', description: 'Graphical CV OS', repo: 'oyi77', stars: 0 },
    { path: '/terminal', url: 'https://oyi77.github.io/terminal', title: 'Terminal OS', description: 'Interactive Terminal Portfolio', repo: 'terminal', stars: 0 }
  ];

  // Check cache first (unless forcing refresh)
  if (!forceRefresh) {
    const cachedResults = localStorage.getItem('githubPagesScanResults');
    const cacheTimestamp = localStorage.getItem('githubPagesScanTimestamp');
    const cacheAge = cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : Infinity;
    const cacheValid = cacheAge < 7 * 24 * 60 * 60 * 1000; // 7 days cache

    if (cachedResults && cacheValid) {
      try {
        const results = JSON.parse(cachedResults);
        displayCuratedPages(results, true); // Pass true to indicate cached data
        return;
      } catch (e) {
        console.warn('Failed to parse cached results, will refresh', e);
        localStorage.removeItem('githubPagesScanResults');
        localStorage.removeItem('githubPagesScanTimestamp');
      }
    }
  } else {
    localStorage.removeItem('githubPagesScanResults');
    localStorage.removeItem('githubPagesScanTimestamp');
  }

  // Show loading state
  // curatedGrid.innerHTML = '<div class="curated-loading">Scanning GitHub repositories for Pages...</div>';
  curatedGrid.style.display = 'none';
  if (curatedSkeleton) curatedSkeleton.style.display = 'grid';
  if (refreshBtn) refreshBtn.disabled = true;

  const username = 'oyi77';
  const baseDomain = 'https://oyi77.github.io';
  const discoveredPages = [...knownPages]; // Start with known pages

  // Repos to skip (already in knownPages)
  const skipRepos = ['wifi-jammer', 'adbs', 'oyi77', 'terminal'];

  try {
    // Fetch only PUBLIC repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=public`);

    if (!reposResponse.ok) {
      throw new Error('Failed to fetch repositories');
    }

    const repos = await reposResponse.json();

    // Filter to only public repos and skip known ones
    const reposToCheck = repos.filter(repo =>
      repo.private === false && !skipRepos.includes(repo.name)
    );

    // Limit to first 10 repos to avoid rate limits
    const limitedRepos = reposToCheck.slice(0, 10);

    // Check each repository for GitHub Pages
    for (const repo of limitedRepos) {
      // Skip if already in known pages
      if (skipRepos.includes(repo.name)) {
        continue;
      }

      try {
        // Check if repo has pages enabled via GitHub API
        const pagesResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/pages`);

        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();

          // Project pages - served at /repo-name
          const pagesUrl = `${baseDomain}/${repo.name}`;
          const path = `/${repo.name}`;

          // Verify the page is actually accessible
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            const testResponse = await fetch(pagesUrl, {
              method: 'HEAD',
              signal: controller.signal,
              cache: 'no-cache'
            });

            clearTimeout(timeoutId);

            if (testResponse.ok || testResponse.status === 200) {
              discoveredPages.push({
                path: path,
                url: pagesUrl,
                title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                description: repo.description || `GitHub Pages for ${repo.name}`,
                repo: repo.name,
                stars: repo.stargazers_count || 0
              });
            }
          } catch (testError) {
            // Skip if can't verify
            continue;
          }
        }
      } catch (pagesError) {
        // Repository doesn't have pages or API error - skip
        continue;
      }

      // Delay to avoid rate limiting (longer delay)
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Sort by stars (if available) or alphabetically
    discoveredPages.sort((a, b) => {
      if (a.stars && b.stars) {
        return b.stars - a.stars;
      }
      return a.title.localeCompare(b.title);
    });

    // Cache results
    localStorage.setItem('githubPagesScanResults', JSON.stringify(discoveredPages));
    localStorage.setItem('githubPagesScanTimestamp', Date.now().toString());
    curatedSections.dataset.scanned = 'true';

    displayCuratedPages(discoveredPages, false);

  } catch (error) {
    console.warn('Failed to scan GitHub Pages:', error);
    // Use known pages as fallback
    displayCuratedPages(knownPages, false);
  } finally {
    // Hide loading state
    if (curatedSkeleton) curatedSkeleton.style.display = 'none';
    curatedGrid.style.display = 'grid';
    if (refreshBtn) refreshBtn.disabled = false;
  }
}

function displayCuratedPages(pages, isCached = false) {
  const curatedGrid = document.getElementById('curated-grid');
  if (!curatedGrid) return;

  if (pages.length === 0) {
    curatedGrid.innerHTML = '<div class="curated-empty">No GitHub Pages found. Check back later!</div>';
    return;
  }

  const cacheIndicator = isCached ? '<div class="curated-cache-indicator">📦 Cached data</div>' : '';

  curatedGrid.innerHTML = cacheIndicator + pages.map(page => `
    <a href="${page.url}" class="curated-card" target="_blank" rel="noopener noreferrer">
      <div class="curated-card-icon">🔗</div>
      <h3 class="curated-card-title">${page.title}</h3>
      <p class="curated-card-path">${page.path === '/' ? '/ (root)' : page.path}</p>
      ${page.description ? `<p class="curated-card-desc">${page.description}</p>` : ''}
      ${page.stars !== undefined ? `<div class="curated-card-stars">⭐ ${page.stars}</div>` : ''}
    </a>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  updateTime();
  setInterval(updateTime, 1000);
  initToggle();
  // Build modal data from JEKYLL_DATA (injected by Jekyll at build time)
  modalData = buildModalData();
  initModal();
  initOnboarding();
  // Initialize metrics animation when expanded sections are shown
  let githubStatsLoaded = false;
  let metricsInitialized = false;
  const expandedSections = document.getElementById('expanded-sections');
  if (expandedSections) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('show')) {
          setTimeout(() => {
            if (!metricsInitialized) {
              initMetricsAnimation();
              metricsInitialized = true;
            }
            if (!githubStatsLoaded) {
              loadGitHubStats();
              githubStatsLoaded = true;
            }
          }, 100);
        }
      });
    });
    observer.observe(expandedSections, { attributes: true, attributeFilter: ['class'] });
  }
  // Exit intent - CTA Modal (Mouse Leave Strategy)
  // Triggers when mouse leaves the viewport at the top (exit intent)
  document.addEventListener('mouseleave', (e) => {
    // Check if mouse left via the top of the screen (y < 0)
    if (e.clientY <= 0) {
      showCTAModal();
    }
  });

  initCTAModal();
  console.log('Portal system loaded with real content.');
});

// ============================================================================
// CTA MODAL LOGIC
// ============================================================================

function initCTAModal() {
  const modal = document.getElementById('cta-modal');
  const closeBtn = document.getElementById('cta-close');
  const stayBtn = document.getElementById('cta-stay-btn');

  if (!modal) return;

  const closeModal = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (stayBtn) stayBtn.addEventListener('click', closeModal);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function showCTAModal() {
  const modal = document.getElementById('cta-modal');
  if (modal) {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  }
}


