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
  const expandedSections = document.getElementById('expanded-sections');
  const mainContent = document.getElementById('main-content');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  if (!toggleBtn || !expandedSections || !mainContent || !toggleContainer) {
    console.warn('Navigation elements not found - check HTML structure');
    return;
  }

  const toggleView = () => {
    const isExpanded = toggleBtn.classList.toggle('active');
    toggleContainer.classList.toggle('active');

    if (isExpanded) {
      // Navigate to Expanded
      mainContent.classList.add('slide-left');
      setTimeout(() => {
        expandedSections.classList.add('show');
        portfolioCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('animate');
          }, index * 80);
        });
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      // Navigate to Minimalist
      portfolioCards.forEach(card => card.classList.remove('animate'));
      expandedSections.classList.remove('show');
      setTimeout(() => {
        mainContent.classList.remove('slide-left');
      }, 100);
      document.body.style.overflow = '';
    }
  };

  toggleBtn.addEventListener('click', toggleView);
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
    tabs: ['Blockchain & Web3', 'Quant Systems', 'Experimental'],
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
          <h3>Muchammad Fikri Izzuddin</h3>
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
          <ul>
            <li><strong>Email</strong>: <a href="mailto:mbahkoe.pendekar@gmail.com">mbahkoe.pendekar@gmail.com</a></li>
            <li><strong>Location</strong>: Surabaya, East Java, Indonesia</li>
            <li><strong>Social</strong>: <a href="https://linkedin.com/in/fikriizzuddin" target="_blank">LinkedIn</a> | <a href="https://github.com/oyi77" target="_blank">GitHub</a></li>
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
  modalContent.innerHTML = `<div class="tab-pane active">${content}</div>`;
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
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  updateTime();
  setInterval(updateTime, 1000);
  initToggle();
  initModal();
  console.log('Portal system loaded with real content.');
});
