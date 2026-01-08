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
      // Trigger eye animation if in main
      if (currentState === 'main') {
        triggerEyeAnimation();
      }

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

  // Cursor leave animation
  document.addEventListener('mouseleave', () => {
    triggerEyeAnimation();
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

function triggerEyeAnimation() {
  const eye = document.getElementById('eye-animation');
  if (eye) {
    eye.classList.add('active');
    setTimeout(() => {
      eye.classList.remove('active');
    }, 3000);
  }
}

// ============================================================================
// MODAL SYSTEM & CONTENT
// ============================================================================

const modalData = {
  posts: {
    title: 'Featured Publications & Insights',
    tabs: ['Engineering', 'Trading', 'Blockchain'],
    content: {
      'Engineering': `
        <section>
          <h3>High-Scale Architecture & Leadership</h3>
          <p>Over the years, I've specialized in building systems that don't just work, but scale effortlessly. My focus is on radical efficiency and technical transparency.</p>
          <ul>
            <li><strong>Microservices at Scale</strong>: Insights into orchestrating massive regional networks. In my tenure at GarudaMedia, I managed a network of 3,000+ employees, requiring a shift from monolithic thinking to a robust microservices mesh on AWS.</li>
            <li><strong>Legacy Transformations</strong>: A deep dive into the technical hurdles of migrating core PHP applications to modern Node.js environments. This isn't just about syntax; it's about re-architecting for the event-driven future.</li>
            <li><strong>CI/CD Excellence</strong>: Why automation is the heartbeat of a high-performing team. I've consistently reduced deployment cycles by up to 60% through aggressive automation and agile mentorship.</li>
          </ul>
        </section>
      `,
      'Trading': `
        <section>
          <h3>Quantitative Analysis & Algo Design</h3>
          <p>My approach to trading is purely mathematical and data-driven. I build systems that find signal in the noise of volatile markets.</p>
          <ul>
            <li><strong>The 90% Win-Rate Blueprint</strong>: A look into the ensemble machine learning models—combining LSTM, GRU, and Transformer architectures—that drive the predictive power of AiTradePulse.</li>
            <li><strong>High-Frequency Execution</strong>: Engineering for the edge. Achieving sub-10ms execution latency isn't just a goal; it's a requirement for competing in modern arbitrage and market-making environments.</li>
            <li><strong>Risk Management Systems</strong>: Building the "brakes" for the algorithms. Implementing real-time position monitoring, automated stop-losses, and complex portfolio correlation analysis to protect capital.</li>
          </ul>
        </section>
      `,
      'Blockchain': `
        <section>
          <h3>On-Chain Dynamics & Web3 Security</h3>
          <p>Blockchain isn't just a database; it's a new paradigm of trust and automation. I focus on the bridge between on-chain data and actionable execution.</p>
          <ul>
            <li><strong>Fomo Watcher Internal</strong>: A breakdown of how we monitor 10,000+ new tokens daily. By analyzing whale wallet movements and liquidity patterns in real-time, we identified high-potential trades with 70% accuracy.</li>
            <li><strong>Automated DEX Clearing</strong>: How we replaced manual labor with smart reconciliation algorithms. By automating transaction matching and settlement, we reduced operational overhead by 60%.</li>
            <li><strong>Smart Contract Security</strong>: Best practices for building custodian systems and payment gateways that handle millions in assets without sacrificing speed or user experience.</li>
          </ul>
        </section>
      `
    }
  },
  achievements: {
    title: 'Milestones & Impact',
    tabs: ['Quantifiable Wins', 'Industry Firsts', 'Team Growth'],
    content: {
      'Quantifiable Wins': `
        <section>
          <h3>Hard Metrics of Success</h3>
          <ul>
            <li><strong>$100K USD Net Profit</strong>: Generated through the proprietary Fomo Watcher token prediction campaign at Bitwyre.</li>
            <li><strong>50% Infrastructure Savings</strong>: Achieved at GarudaMedia by optimizing cloud utilization and migrating to a containerized microservices architecture.</li>
            <li><strong>5B+ IDR Monthly Volume</strong>: Securely managed through custom-built finance and analytics dashboards at BerkahKarya.</li>
            <li><strong>30% Process Efficiency Boost</strong>: Realized at Viapulsa through the implementation of a modern, automated workflow management system.</li>
          </ul>
        </section>
      `,
      'Industry Firsts': `
        <section>
          <h3>Pioneering Legal Crypto in Indonesia</h3>
          <p><strong>Solomon Mining (2021-2022)</strong>: I had the honor of establishing the first fully compliant and legal cryptocurrency mining operation in Indonesia. This involved not just technical deployment (500+ TH/s capacity), but also building the KYC/AML frameworks required by national regulators.</p>
          <h4>DEX Infrastructure Innovation</h4>
          <p>Developed early-stage international OTC portals that enabled seamless, cross-border large-volume transactions, paving the way for institutional crypto adoption in Southeast Asia.</p>
        </section>
      `,
      'Team Growth': `
        <section>
          <h3>Technical Leadership at Scale</h3>
          <p>My career has seen me lead teams ranging from small, elite groups of 3 to massive networks of <strong>3,000+ employees</strong>. At BerkahKarya, I expanded the engineering team by 3x, growing from 10 to 30+ members while simultaneously increasing delivery velocity by 60%.</p>
          <h4>Mentorship & Culture</h4>
          <p>I believe that strong teams are built on a culture of belonging and radical transparency. I've been recognized for my ability to mentor junior talent into high-performing senior engineers.</p>
        </section>
      `
    }
  },
  experience: {
    title: 'Professional Journey',
    tabs: ['Current', 'History'],
    content: {
      'Current': `
        <section>
          <h3>Bitwyre Crypto Exchange</h3>
          <em>Onchain Trader & Lead Blockchain Developer (2024-Present)</em>
          <p>Leading the next generation of on-chain trading and exchange infrastructure.</p>
          <ul>
            <li><strong>Fomo Watcher</strong>: Engineered an advanced token prediction system achieving a 70% accuracy rate across major chains.</li>
            <li><strong>DEX Clearing</strong>: Developed automated reconciliation algorithms that slashed manual labor by 60%.</li>
            <li><strong>Product Leadership</strong>: Headed the development of the global Card Product (crypto-to-fiat) and the institutional OTC Portal.</li>
            <li><strong>Systems Optimization</strong>: Optimized custodian and backend systems for 99.9% uptime and accelerated transaction processing.</li>
          </ul>
        </section>
        <section>
          <h3>AiTradePulse</h3>
          <em>Founder & CTO (2023-Present)</em>
          <p>Launched a cutting-edge algorithmic trading platform focused on AI-driven market prediction and low-latency execution.</p>
          <ul>
            <li><strong>Strategy Development</strong>: Built 50+ active trading algorithms achieving consistent 90%+ win rates.</li>
            <li><strong>Infrastructure</strong>: Architected a sub-10ms execution engine integrated with 15+ major cryptocurrency exchanges.</li>
            <li><strong>Risk Systems</strong>: Implemented multi-layered risk controls including real-time slippage monitoring and automated deleveraging.</li>
          </ul>
        </section>
      `,
      'History': `
        <section>
          <h3>Linguise (France)</h3>
          <em>Senior Full Stack Engineer (2023-2024)</em>
          <p>Focused on upgrading core systems and building administrative tools for a global user base.</p>
          <ul>
            <li><strong>API Migration</strong>: Led the high-stakes migration of core API services from legacy PHP to modern, scalable Node.js.</li>
            <li><strong>Admin Systems</strong>: Designed and built a comprehensive dashboard for customer management, service monitoring, and automated billing.</li>
            <li><strong>Team Leadership</strong>: Directly led a team of 3 engineers to establish coding standards and modern DevOps practices.</li>
          </ul>
        </section>
        <section>
          <h3>Viapulsa</h3>
          <em>Technical Lead (2023-2024)</em>
          <p>Pioneered the digital transformation of one of Indonesia's largest credit-to-cash service providers.</p>
          <ul>
            <li><strong>Digital Migration</strong>: Successfully transitioned a 100% offline business operation to a fully automated online platform.</li>
            <li><strong>Workflow Management</strong>: Architected a custom system to handle high-volume transactions with zero-manual intervention, boosting efficiency by 30%.</li>
            <li><strong>Leadership</strong>: Managed a multidisciplinary team of 18 members, hitting all project milestones ahead of schedule.</li>
          </ul>
        </section>
        <section>
          <h3>BerkahKarya</h3>
          <em>Head of Engineering (2022-2023)</em>
          <p>Led the technological development for a major talent management and digital marketing agency.</p>
          <ul>
            <li><strong>Revenue Scale</strong>: Managed platforms handling 5B+ IDR monthly turnover with absolute security and precision.</li>
            <li><strong>AI Integration</strong>: Built an AI-powered influencer analytics engine that tracked engagement across 1,000+ content creators.</li>
            <li><strong>Team Growth</strong>: Scaled the engineering department from 10 to 30+ members within one year.</li>
          </ul>
        </section>
        <section>
          <h3>Solomon Mining</h3>
          <em>CTO / Technical Lead (2021-2022)</em>
          <p>Architected the technical foundation for Indonesia's first legal cryptocurrency mining facility.</p>
          <ul>
            <li><strong>Facility Design</strong>: Deployed and optimized mining infrastructure with a 500+ TH/s capacity.</li>
            <li><strong>Hardware Optimization</strong>: Increased mining efficiency by 20% through custom firmware and temperature-based power management.</li>
            <li><strong>Compliance</strong>: Built the first KYC/AML reporting systems for mining operations approved by Indonesian regulators.</li>
          </ul>
        </section>
        <section>
          <h3>GarudaMedia</h3>
          <em>Technical Lead / Engineering Manager (2019-2021)</em>
          <p>Served as a key technical leader for one of Indonesia's largest affiliate marketing empires.</p>
          <ul>
            <li><strong>Massive Scale</strong>: Architected infrastructure to support 100M+ monthly page views and millions of daily tracking events.</li>
            <li><strong>Workforce Leadership</strong>: Managed a technical network supporting over 3,000 employees across multiple regions.</li>
            <li><strong>Cost Efficiency</strong>: Reduced global infrastructure spending by 40% through aggressive cloud optimization and the move to AWS Lambda and Docker.</li>
          </ul>
        </section>
      `
    }
  },
  projects: {
    title: 'Project Portfolio',
    tabs: ['Blockchain & Web3', 'Quant Systems', 'Content & Media', 'Experimental'],
    content: {
      'Blockchain & Web3': `
        <section>
          <h3>On-Chain Engineering Highlights</h3>
          <h4>Fomo Watcher</h4>
          <p>An advanced real-time scanner for Ethereum, BSC, and Solana. It uses machine learning to identify high-probability breakout tokens by analyzing volume, liquidity locks, and wallet signatures.</p>
          <h4>DEX Settler</h4>
          <p>A high-throughput automated settlement engine designed for decentralized exchanges to ensure zero-lag transaction reconciliation.</p>
          <h4>Crypto Card Portal</h4>
          <p>A secure gateway for seamless crypto-to-fiat conversions, enabling global payments via traditional card infrastructure.</p>
        </section>
      `,
      'Quant Systems': `
        <section>
          <h3>Trading & Analytics</h3>
          <h4>Algo Expert Hub</h4>
          <p>A comprehensive platform for developing, backtesting, and deploying algorithmic trading strategies across multiple asset classes.</p>
          <h4>Low-Latency Bridge</h4>
          <p>A specialized C++ execution engine designed to minimize slippage by interacting directly with exchange memory pools.</p>
          <h4>Market Sentiment Engine</h4>
          <p>Uses Natural Language Processing to analyze social media and news feeds to predict short-term market volatility.</p>
        </section>
      `,
      'Content & Media': `
        <section>
          <h3>Publications & News Platforms</h3>
          <h4>Blog</h4>
          <p>Aggregated articles from Medium, Dev.to, Substack, GitHub, and more. A comprehensive collection of technical insights, engineering practices, and thought leadership content.</p>
          <p style="margin-top: 15px;">
            <a href="/blog/" target="_blank" style="color: var(--portal-accent); text-decoration: underline;">Visit Blog →</a>
          </p>
          <h4>News Aggregator</h4>
          <p>Real-time terminal news aggregator with curated technical sources. Stay updated with the latest developments in software engineering, blockchain, and technology.</p>
          <p style="margin-top: 15px;">
            <a href="/news/" target="_blank" style="color: var(--portal-accent); text-decoration: underline;">Visit News →</a>
          </p>
        </section>
      `,
      'Experimental': `
        <section>
          <h3>Tools & Open Source</h3>
          <h4>Nuclear</h4>
          <p>A free music delivery project that optimized user interface interactions, boosting engagement by 11%.</p>
          <h4>AI Auto Job Apply</h4>
          <p>An automated solution built with Python and TypeScript that leverages LLMs to customize resumes and apply to relevant positions.</p>
          <h4>RBMiner Tools</h4>
          <p>Hardware-level optimization scripts that provided a 20% efficiency boost for multi-GPU mining rigs.</p>
        </section>
      `
    }
  },
  skills: {
    title: 'Technical Arsenal',
    tabs: ['Core Languages', 'Modern Frameworks', 'Infrastructure'],
    content: {
      'Core Languages': `
        <section>
          <h3>The Foundation</h3>
          <ul>
            <li><strong>High-Level</strong>: Python (Expert), JavaScript/TypeScript (Expert), PHP (Advanced).</li>
            <li><strong>Systems & Trading</strong>: C++, C#, Java, MQL4/MQL5.</li>
            <li><strong>Automation</strong>: Bash, PowerShell, Shell, Makefile.</li>
          </ul>
        </section>
      `,
      'Modern Frameworks': `
        <section>
          <h3>Application Development</h3>
          <ul>
            <li><strong>Web</strong>: React, Next.js, Django, Laravel, Express.js, CodeIgniter.</li>
            <li><strong>Data Science</strong>: TensorFlow, PyTorch, NumPy, Pandas.</li>
            <li><strong>Mobile</strong>: Flutter.</li>
          </ul>
        </section>
      `,
      'Infrastructure': `
        <section>
          <h3>Cloud & Operations</h3>
          <ul>
            <li><strong>Platforms</strong>: AWS (High Complexity), Google Cloud, DigitalOcean.</li>
            <li><strong>Containerization</strong>: Docker, Kubernetes, Terraform.</li>
            <li><strong>Persistence</strong>: PostgreSQL (TimescaleDB), MongoDB, Redis, MySQL, Oracle.</li>
            <li><strong>Networking</strong>: MQTT, WebSockets, REST, gRPC.</li>
          </ul>
        </section>
      `
    }
  },
  about: {
    title: 'Profile & Mission',
    tabs: ['The Professional', 'The Vision', 'The Connection'],
    content: {
      'The Professional': `
        <section>
          <h3>Lead Software Engineer</h3>
          <p>A visionary Technical Lead with 7+ years of experience in high-stakes engineering environments. From managing thousands of employees to developing sub-10ms trading algorithms, my career is defined by tackling "impossible" complexity.</p>
          <p>My background in Business Management from <strong>ITS Surabaya</strong> allows me to bridge the gap between deep technical implementation and high-level business strategy.</p>
        </section>
      `,
      'The Vision': `
        <section>
          <h3>Architecture as Art</h3>
          <p>I believe that code is more than just instructions; it's a creative expression of efficiency. My mission is to build digital infrastructure that isn't just reliable, but beautiful in its execution.</p>
          <blockquote>"Efficiency is the ultimate form of elegance."</blockquote>
        </section>
      `,
      'The Connection': `
        <section>
          <h3>Get in Touch</h3>
          <p>I am always looking for challenges that push the boundaries of what is technically possible.</p>
          <div style="margin: 20px 0;">
            <button onclick="window.ContactFormHandler && window.ContactFormHandler.show();" style="padding: 12px 30px; background: #000; border: 1px solid #fff; color: #fff; font-family: 'Monaco', 'Menlo', monospace; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='#fff'; this.style.color='#000';" onmouseout="this.style.background='#000'; this.style.color='#fff';">
              Open Contact Form
            </button>
          </div>
          <ul>
            <li><strong>Schedule a Call</strong>: <a href="https://cal.com/oyi77" target="_blank">cal.com/oyi77</a></li>
            <li><strong>Location</strong>: Southeast Asia</li>
            <li><strong>Social</strong>: <a href="https://github.com/oyi77" target="_blank">GitHub</a></li>
          </ul>
        </section>
      `
    }
  },
  certifications: {
    title: 'Validations & Education',
    tabs: ['Technical', 'Leadership', 'Institutional'],
    content: {
      'Technical': `
        <section>
          <h3>HackerRank Verified</h3>
          <ul>
            <li><strong>SQL (Advanced)</strong>: Demonstrating mastery in complex query optimization and database design.</li>
            <li><strong>Problem Solving (Intermediate)</strong>: Data structures and algorithmic proficiency.</li>
            <li><strong>JavaScript / Python / REST API</strong>: Core language and integration validation.</li>
          </ul>
        </section>
      `,
      'Leadership': `
        <section>
          <h3>Professional Development</h3>
          <ul>
            <li><strong>Cert Prep: Scrum Master</strong>: Validated expertise in agile leadership.</li>
            <li><strong>Inclusion & Belonging</strong>: Certified in creating high-performing, inclusive work cultures.</li>
            <li><strong>Hybrid Team Management</strong>: Excellence in coordinating global, remote-first engineering teams.</li>
          </ul>
        </section>
      `,
      'Institutional': `
        <section>
          <h3>Academic Foundation</h3>
          <h4>Institut Teknologi Sepuluh Nopember (ITS) Surabaya</h4>
          <p>Bachelor of Business Management (GPA: 3.4/4.0)</p>
          <p><em>Focus: Organizational Strategy & Strategic Implementation</em></p>
        </section>
      `
    }
  },
  leadership: {
    title: 'Impact & Strategy',
    tabs: ['The Scale', 'The Growth', 'The Method'],
    content: {
      'The Scale': `
        <section>
          <h3>Leading 3,000+</h3>
          <p>Leadership at scale isn't about micro-managing; it's about building systems that manage themselves. At GarudaMedia, I was responsible for the technical standards and infrastructure that supported a distributed network of thousands of employees.</p>
        </section>
      `,
      'The Growth': `
        <section>
          <h3>Exponential Development</h3>
          <p>I specialize in taking teams from "Startup Chaos" to "Enterprise Excellence." By implementing rigorous code review processes and modern CI/CD pipelines, I've consistently achieved 60% improvements in team delivery velocity.</p>
        </section>
      `,
      'The Method': `
        <section>
          <h3>Radical Transparency</h3>
          <p>My leadership philosophy is built on technical transparency and meritocracy. I foster environments where the best idea wins, and every engineer is empowered to take ownership of their work.</p>
        </section>
      `
    }
  },
  'case-studies': {
    title: 'Deep Research In-Sights',
    tabs: ['Trading Tech', 'Scaling Tech', 'Business Tech'],
    content: {
      'Trading Tech': `
        <section>
          <h3>Case Study: Fomo Watcher</h3>
          <p>The challenge was to identify "moon" events on-chain before they hit the mainstream. By building a multi-chain ingestion engine and applying pattern-matching algorithms, we filtered out noise and identified 70% of trending tokens early. This technical edge resulted in a $100K net profit for the campaign.</p>
        </section>
      `,
      'Scaling Tech': `
        <section>
          <h3>Case Study: GarudaMedia Cloud Mesh</h3>
          <p>Handling 100M+ page views monthly required a shift from static servers to a dynamic, auto-scaling mesh. We implemented Kubernetes clusters on AWS with persistent redis caching layers. Result: Zero downtime during traffic spikes and a 40% reduction in monthly cloud spend.</p>
        </section>
      `,
      'Business Tech': `
        <section>
          <h3>Case Study: Viapulsa Transformation</h3>
          <p>Viapulsa's legacy business was 100% manual. I architected a full-stack digital solution that automated user onboarding, credit verification, and payout processing. Result: A complete pivot to an online-first business model with a 30% increase in overall transactional throughput.</p>
        </section>
      `
    }
  },
  examples: {
    title: 'Demo Repository',
    tabs: ['Live Platforms', 'Open Utilities', 'Bots'],
    content: {
      'Live Platforms': `
        <section>
          <h3>Public Projects</h3>
          <ul>
            <li><strong>CV OS</strong>: An interactive, retro-terminal resume experience. <a href="https://oyi77.github.io/oyi77" target="_blank">[Live Demo]</a></li>
            <li><strong>AI Trade Pulse</strong>: Public facing dashboard for trading analytics and strategy resources.  <a href="https://aitradepulse.com" target="_blank">[Live Demo]</a></li>
            <li><strong>Jual Buah</strong>: A high-performance e-commerce platform for fresh produce. <a href="https://jualbuah.com" target="_blank">[Live Demo]</a></li>
          </ul>
        </section>
      `,
      'Open Utilities': `
        <section>
          <h3>GitHub Highlights</h3>
          <ul>
            <li><strong>ai-auto-job-apply</strong>: A Python-based automation tool for the modern career search.</li>
            <li><strong>wifi-jammer</strong>: A security research tool exploring network vulnerabilities.</li>
            <li><strong>RBMiner</strong>: Hardware optimization suite for specialized mining operations.</li>
          </ul>
        </section>
      `,
      'Bots': `
        <section>
          <h3>Automation & AI</h3>
          <ul>
            <li><strong>Shopee Affiliate Bot</strong>: Multi-threaded crawler and automated poster for the Shopee network.</li>
            <li><strong>Telegram AI Trade</strong>: Integration of OpenAI LLMs into real-time trading notifications via MQL5.</li>
            <li><strong>TikTok Yap Assistant</strong>: An AI-driven content helper for social media automation.</li>
          </ul>
        </section>
      `
    }
  }
};

let currentSection = null;
let currentTab = 0;

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
  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  const modal = document.getElementById('modal-overlay');
  if (modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
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
    card.addEventListener('keypress', (e) => {
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
  try {
    const username = 'oyi77';
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) throw new Error('GitHub API error');

    const data = await response.json();

    // Update repository count
    const repoCountEl = document.getElementById('repo-count');
    if (repoCountEl) {
      animateToValue(repoCountEl, data.public_repos || 0);
    }

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

      const starsEl = document.getElementById('github-stars');
      const forksEl = document.getElementById('github-forks');

      if (starsEl) animateToValue(starsEl, totalStars);
      if (forksEl) animateToValue(forksEl, totalForks);
    }

    // Contributions (approximate - GitHub API doesn't provide this directly)
    const contributionsEl = document.getElementById('github-contributions');
    if (contributionsEl) {
      contributionsEl.textContent = 'Active';
    }

  } catch (error) {
    console.warn('Failed to load GitHub stats:', error);
    // Set fallback values
    const elements = ['repo-count', 'github-stars', 'github-forks', 'github-contributions'];
    elements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '--';
    });
  }
}

function animateToValue(element, target) {
  const current = parseInt(element.textContent) || 0;

  // If we're already at the target (or starting from 0 to 0), just update and exit
  if (current === target) {
    element.textContent = target;
    return;
  }

  const increment = target > current ? 1 : -1;
  const duration = 1500;
  const steps = Math.abs(target - current);
  // Prevent division by zero or infinite delay
  const delay = steps > 0 ? duration / steps : 0;

  let currentValue = current;
  const timer = setInterval(() => {
    currentValue += increment;
    element.textContent = currentValue;

    if (currentValue === target) {
      clearInterval(timer);
    }
  }, delay);
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
  initModal();
  initOnboarding();
  // Initialize metrics animation when expanded sections are shown
  const expandedSections = document.getElementById('expanded-sections');
  if (expandedSections) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('show')) {
          setTimeout(() => {
            initMetricsAnimation();
            loadGitHubStats();
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

  // Cursor leave animation (Keep eye animation)
  document.addEventListener('mouseleave', () => {
    triggerEyeAnimation();
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

// ============================================================================
// ADVANCED ANIMATIONS LOGIC
// ============================================================================

const EyeFollower = {
  activeEyes: [],
  mousePos: { x: 0, y: 0 },
  maxTravelX: 180,
  maxTravelY: 80,

  init() {
    window.addEventListener('mousemove', (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
      this.update();
    });
  },

  register(element) {
    if (!this.activeEyes.includes(element)) {
      this.activeEyes.push(element);
    }
  },

  unregister(element) {
    this.activeEyes = this.activeEyes.filter(e => e !== element);
  },

  update() {
    if (this.activeEyes.length === 0) return;

    this.activeEyes.forEach(eye => {
      const rect = eye.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = this.mousePos.x - centerX;
      const dy = this.mousePos.y - centerY;

      const pupilX = this.clamp(dx / 5, -this.maxTravelX, this.maxTravelX);
      const pupilY = this.clamp(dy / 5, -this.maxTravelY, this.maxTravelY);

      eye.style.setProperty('--pupil-x', `${pupilX}px`);
      eye.style.setProperty('--pupil-y', `${pupilY}px`);
    });
  },

  clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }
};

EyeFollower.init();

function triggerEyeAnimation() {
  const eye = document.getElementById('eye-animation');
  if (eye && !eye.classList.contains('active')) {
    eye.classList.add('active');
    const svg = eye.querySelector('.scary-eye-svg');

    // Safety check
    if (!svg) return;

    // Start closed
    svg.classList.add('closed');
    svg.classList.remove('crying'); // Reset state

    // Animate opening
    setTimeout(() => {
      svg.classList.remove('closed');
      EyeFollower.register(svg);
    }, 1000);

    setTimeout(() => {
      eye.classList.remove('active');
      EyeFollower.unregister(svg);
    }, 5000);
  }
}

// Removed triggerLimboAnimation as it is replaced by CTA Modal
