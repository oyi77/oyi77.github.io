# Project Context

## Purpose

This is an **interactive portfolio website** showcasing the professional experience and technical expertise of **Muchammad Fikri Izzuddin**, a Lead Software Engineer with 7+ years of experience. The project serves multiple goals:

1. **Professional Branding**: Present a unique, memorable portfolio that stands out to global recruiters and hiring managers
2. **Technical Showcase**: Demonstrate full-stack development skills through an immersive, interactive web experience
3. **Career Advancement**: Support job search efforts by providing multiple access points (Terminal OS, Graphical CV, PDF download)
4. **SEO Optimization**: Maximize discoverability for remote software engineering opportunities

The site features:
- **Multi-tier access system**: Terminal OS, Graphical CV OS, and traditional PDF download
- **Interactive portfolio hub**: Dynamic navigation with expandable sections and modal content
- **Real-time integrations**: GitHub stats, live clock, and analytics
- **Premium aesthetics**: Modern design with glassmorphism, animations, and responsive layouts

## Tech Stack

### Core Technologies
- **Jekyll** (4.3.x) - Static site generator with Ruby
- **Ruby** (3.x) - Backend language for Jekyll plugins
- **HTML5** - Semantic markup with Schema.org structured data
- **CSS3** - Custom styling with modern features (Grid, Flexbox, animations)
- **JavaScript (ES6+)** - Vanilla JS for interactivity (no frameworks)
- **Liquid** - Jekyll templating language

### Frontend
- **Vanilla JavaScript** - No frameworks, pure ES6+ for maximum performance
- **Custom CSS** - No CSS frameworks (no Tailwind, Bootstrap, etc.)
- **Google Fonts** - Inter (UI), JetBrains Mono (code/terminal)
- **SVG Icons** - Inline SVG for social media and UI elements

### Jekyll Plugins (Custom Ruby)
- `analytics_generator.rb` - Analytics tracking and metrics
- `asset_optimizer.rb` - Asset optimization and compression
- `custom_filters.rb` - Custom Liquid filters for data transformation
- `data_compressor.rb` - Data compression for performance
- `github_data_fetcher.rb` - Fetch GitHub repository data
- `market_data_fetcher.rb` - Market data integration (for trading projects)
- `metrics_calculator.rb` - Calculate professional metrics
- `repository_analytics_generator.rb` - Repository analytics
- `seo_generator.rb` - SEO metadata generation
- `skills_matrix_generator.rb` - Skills matrix generation
- `timeline_generator.rb` - Career timeline generation

### Data Storage
- **YAML** - Structured data files in `_data/` directory
  - `companies.yml` - Company/employer information
  - `led_projects.yml` - Project portfolio
  - `approaches.yml` - Technical approaches
  - `case_studies.yml` - Case studies
  - `terminal.yml` - Terminal OS configuration
  - `navigation.yml` - Site navigation
- **JSON** - Project data (`projects.json`)

### External Services & APIs
- **GitHub Pages** - Hosting platform
- **GitHub API** - Real-time repository statistics
- **Google Fonts API** - Typography
- **Schema.org** - Structured data for SEO

### Build & Deployment
- **Bundler** - Ruby dependency management
- **Jekyll Build** - Static site generation
- **GitHub Actions** - CI/CD (via `.github/` workflows)
- **Git** - Version control

## Project Conventions

### Code Style

#### JavaScript
- **ES6+ Syntax**: Use modern JavaScript features (arrow functions, const/let, template literals)
- **No Frameworks**: Pure vanilla JavaScript only
- **Naming Conventions**:
  - Functions: `camelCase` (e.g., `updateTime()`, `initToggle()`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `JEKYLL_DATA`)
  - Variables: `camelCase` (e.g., `currentState`, `modalData`)
  - DOM IDs: `kebab-case` (e.g., `modal-overlay`, `current-time`)
  - CSS Classes: `kebab-case` (e.g., `.portfolio-card`, `.modal-container`)
- **Comments**: Use block comments (`/** */`) for function documentation
- **Code Organization**: Group related functions with section headers using `// ============`

#### CSS
- **Custom Properties**: Use CSS variables for theming (colors, spacing, etc.)
- **BEM-like Naming**: Block-element pattern (e.g., `.modal-container`, `.modal-header`)
- **Mobile-First**: Design for mobile, then enhance for desktop
- **Animations**: Use `transition` and `@keyframes` for smooth interactions
- **No Preprocessors**: Pure CSS only (no SASS, LESS, etc.)

#### Ruby (Jekyll Plugins)
- **Class Names**: `PascalCase` (e.g., `AnalyticsGenerator`)
- **Methods**: `snake_case` (e.g., `generate_analytics`)
- **File Names**: `snake_case.rb` (e.g., `github_data_fetcher.rb`)
- **Indentation**: 2 spaces

#### YAML Data Files
- **Keys**: `snake_case` (e.g., `team_size`, `key_metrics`)
- **Structure**: Hierarchical, well-indented (2 spaces)
- **Comments**: Use `#` for documentation
- **Multiline Strings**: Use `|` for preserving line breaks

#### HTML
- **Semantic Markup**: Use appropriate HTML5 elements (`<header>`, `<main>`, `<section>`, `<nav>`)
- **Accessibility**: Include ARIA attributes (`role`, `aria-label`, `aria-hidden`)
- **SEO**: Include meta tags, Open Graph, Twitter Cards, Schema.org JSON-LD
- **Indentation**: 2 spaces

### Architecture Patterns

#### Static Site Generation (Jekyll)
- **Data-Driven**: Content stored in `_data/` YAML files, rendered via Liquid templates
- **Plugin Architecture**: Custom Ruby plugins extend Jekyll functionality
- **Separation of Concerns**: 
  - Content (YAML/Markdown)
  - Presentation (HTML/Liquid templates)
  - Styling (CSS)
  - Behavior (JavaScript)

#### Frontend Architecture
- **Progressive Enhancement**: Core content works without JavaScript
- **Component-Based**: Reusable UI components (cards, modals, navigation)
- **State Management**: Simple state tracking via JavaScript variables (no Redux/Vuex)
- **Event-Driven**: DOM events trigger UI updates

#### Modal System
- **Data Structure**: `modalData` object contains all modal content
- **Dynamic Rendering**: Content injected into DOM on-demand
- **Tab Navigation**: Multi-tab interface within modals
- **Keyboard Navigation**: ESC to close, Enter/Space to activate

#### Navigation System
- **Three-State Navigation**:
  1. **Main**: Initial landing page with 3 access cards
  2. **Expanded**: Portfolio sections grid (10 cards)
  3. **Metrics**: Achievement metrics and GitHub stats
- **Toggle Button**: Single button that changes arrow direction (→, ↓, ↑)
- **Slide Animations**: CSS transitions for smooth state changes

#### SEO Architecture
- **Multi-Layer SEO**:
  - HTML meta tags (title, description, keywords)
  - Open Graph (Facebook)
  - Twitter Cards
  - Schema.org JSON-LD (Person, EducationalOccupationalCredential)
- **Canonical URLs**: Prevent duplicate content
- **Sitemap**: Auto-generated via Jekyll plugin

### Testing Strategy

#### Manual Testing
- **Browser Compatibility**: Test in Chrome, Firefox, Safari, Edge
- **Responsive Design**: Test on mobile (320px), tablet (768px), desktop (1024px+)
- **Accessibility**: Keyboard navigation, screen reader compatibility
- **Performance**: Page load speed, animation smoothness

#### Visual Testing
- **Design Review**: Ensure premium aesthetics, no generic colors
- **Typography**: Verify font loading and readability
- **Animations**: Check smoothness and timing
- **Dark Mode**: Ensure proper contrast and visibility

#### Integration Testing
- **GitHub API**: Verify stats load correctly
- **External Links**: Check all social media and portfolio links
- **PDF Download**: Ensure CV.pdf is accessible

#### SEO Testing
- **Google Search Console**: Monitor indexing and search performance
- **Structured Data**: Validate Schema.org markup
- **Meta Tags**: Verify Open Graph and Twitter Card rendering

### Git Workflow

#### Branching Strategy
- **main**: Production branch (deployed to GitHub Pages)
- **develop**: Development branch for staging changes
- **feature/***: Feature branches for new functionality
- **fix/***: Bug fix branches

#### Commit Conventions
- **Format**: `<type>(<scope>): <subject>`
- **Types**:
  - `feat`: New feature
  - `fix`: Bug fix
  - `docs`: Documentation changes
  - `style`: Code style changes (formatting, no logic change)
  - `refactor`: Code refactoring
  - `perf`: Performance improvements
  - `test`: Testing updates
  - `chore`: Build/tooling changes
- **Examples**:
  - `feat(modal): add tabbed navigation system`
  - `fix(css): resolve mobile layout overflow`
  - `docs(readme): update installation instructions`

#### Pull Request Process
1. Create feature branch from `develop`
2. Make changes and commit with conventional messages
3. Test locally (`bundle exec jekyll serve`)
4. Create PR to `develop`
5. Review and merge
6. Deploy `develop` → `main` for production

## Domain Context

### Professional Background
- **Name**: Muchammad Fikri Izzuddin
- **Location**: Surabaya, East Java, Indonesia (UTC+7)
- **Experience**: 7+ years in software engineering
- **Specializations**: Full-stack development, blockchain, algorithmic trading, technical leadership
- **Team Leadership**: Led teams from 3 to 3,000+ members
- **Industries**: FinTech, Blockchain, Digital Marketing, Talent Management, E-commerce

### Key Companies
1. **Bitwyre** (2024-Present): Crypto exchange, on-chain trading
2. **AiTradePulse** (2023-Present): Algorithmic trading platform (Founder)
3. **Linguise** (2023-2024): SaaS company (France)
4. **Viapulsa** (2023-2024): Digital transformation
5. **BerkahKarya** (2022-2023): Talent management, 5B+ IDR monthly revenue
6. **Solomon Mining** (2021-2022): Indonesia's first legal crypto mining (CTO)
7. **GarudaMedia** (2019-2021): Affiliate marketing, 3,000+ employees

### Technical Expertise
- **Languages**: Python, JavaScript/TypeScript, PHP, C++, C#, Java, Bash, PowerShell
- **Frontend**: React, Next.js, HTML5, CSS3, Flutter
- **Backend**: Node.js, Django, Laravel, Express.js
- **Blockchain**: Smart Contracts, Web3, DEX, DeFi
- **Trading**: Algorithmic trading, quantitative analysis, ML models
- **Infrastructure**: Docker, Kubernetes, AWS, PostgreSQL, Redis, MongoDB
- **AI/ML**: TensorFlow, PyTorch, NumPy, Pandas

### Career Goals
- **Target**: Remote position with global company
- **Salary**: Competitive USD-based compensation
- **Roles**: Senior Software Engineer, Tech Lead, Engineering Manager
- **Industries**: FinTech, Crypto, SaaS, Remote-first companies

## Important Constraints

### Technical Constraints
- **GitHub Pages Limitations**:
  - Static site only (no server-side processing)
  - Jekyll version locked to GitHub Pages compatible version
  - No custom Jekyll plugins in production (must use safe mode)
  - HTTPS only (no HTTP)
- **Performance**:
  - Keep page load time under 3 seconds
  - Minimize JavaScript bundle size
  - Optimize images and assets
- **Browser Support**:
  - Modern browsers only (Chrome, Firefox, Safari, Edge - last 2 versions)
  - No IE11 support required

### Design Constraints
- **Aesthetics**: Must be premium, modern, and memorable (no generic designs)
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive**: Must work on all screen sizes (320px to 4K)
- **SEO**: Must rank well for "remote software engineer" keywords

### Content Constraints
- **Accuracy**: All professional information must be accurate and verifiable
- **Privacy**: No sensitive personal information (phone numbers, full address)
- **Professional**: Maintain professional tone while being engaging
- **Up-to-date**: Keep experience and projects current

### Deployment Constraints
- **GitHub Pages**: Must deploy via GitHub Pages (no custom servers)
- **Domain**: Uses `oyi77.github.io` domain
- **Build Time**: Jekyll build must complete within GitHub Actions limits
- **File Size**: Repository size should stay under 1GB

## External Dependencies

### Required Services
- **GitHub Pages**: Hosting platform (free tier)
- **GitHub API**: Repository statistics (rate-limited: 60 requests/hour unauthenticated)
- **Google Fonts**: Typography (Inter, JetBrains Mono)

### Optional Services
- **Google Analytics**: Traffic tracking (currently disabled, can be enabled)
- **Google Search Console**: SEO monitoring
- **LinkedIn**: Professional profile integration
- **Linktree**: Social media aggregation

### Development Dependencies
- **Ruby**: 3.x or higher
- **Bundler**: Gem dependency management
- **Jekyll**: 4.3.x
- **Git**: Version control

### Build Dependencies (Gemfile)
```ruby
gem "jekyll", "~> 4.3"
gem "jekyll-paginate"
gem "jekyll-sitemap"
gem "jekyll-gist"
gem "jekyll-feed"
gem "jemoji"
gem "jekyll-include-cache"
gem "minimal-mistakes-jekyll" # Remote theme
```

### API Rate Limits
- **GitHub API**: 60 requests/hour (unauthenticated), 5,000/hour (authenticated)
- **Google Fonts**: No strict limits, but use sparingly for performance

### Third-Party Assets
- **Fonts**: Google Fonts CDN
- **Icons**: Inline SVG (no external icon libraries)
- **Images**: Self-hosted in `/assets/images/`

## File Structure

```
oyi77.github.io/
├── _config.yml              # Jekyll configuration
├── _data/                   # YAML data files
│   ├── companies.yml
│   ├── led_projects.yml
│   ├── case_studies.yml
│   ├── approaches.yml
│   ├── terminal.yml
│   ├── navigation.yml
│   └── projects.json
├── _plugins/                # Custom Ruby plugins
│   ├── analytics_generator.rb
│   ├── asset_optimizer.rb
│   ├── github_data_fetcher.rb
│   └── ... (11 plugins total)
├── _pages/                  # Static pages
├── _posts/                  # Blog posts
├── _layouts/                # Page layouts
├── assets/
│   ├── css/
│   │   └── portal.css       # Main stylesheet
│   ├── js/
│   │   ├── portal.js        # Main JavaScript
│   │   └── contact-widget.js
│   └── images/              # Images and assets
├── docs/                    # Documentation
├── openspec/                # OpenSpec files
│   └── project.md           # This file
├── index.html               # Homepage
├── CV.pdf                   # Downloadable resume
├── Gemfile                  # Ruby dependencies
└── README.md                # Project README
```

## Notes for AI Assistants

### When Making Changes
1. **Preserve Aesthetics**: Maintain premium, modern design - no generic colors or basic layouts
2. **Test Responsiveness**: Always check mobile, tablet, and desktop views
3. **SEO First**: Include proper meta tags, structured data, and semantic HTML
4. **Accessibility**: Add ARIA labels, keyboard navigation, and screen reader support
5. **Performance**: Optimize images, minimize JS/CSS, lazy load when possible
6. **Data-Driven**: Update YAML files in `_data/` rather than hardcoding content
7. **Consistency**: Follow existing naming conventions and code style
8. **Documentation**: Update this file when adding new features or dependencies

### Common Tasks
- **Add new project**: Update `_data/led_projects.yml` or `_data/projects.json`
- **Update experience**: Modify `_data/companies.yml`
- **Add blog post**: Create file in `_posts/` with YAML frontmatter
- **Modify homepage**: Edit `index.html` and `assets/js/portal.js`
- **Update styles**: Edit `assets/css/portal.css`
- **Add modal content**: Update `modalData` object in `assets/js/portal.js`

### Testing Locally
```bash
# Install dependencies
bundle install

# Run local server
bundle exec jekyll serve

# Open http://localhost:4000
```

### Deployment
- Push to `main` branch
- GitHub Actions automatically builds and deploys
- Changes live within 1-2 minutes
