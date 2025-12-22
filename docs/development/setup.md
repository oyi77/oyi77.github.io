# Development Setup

## Prerequisites

- Ruby 2.7+ (for Jekyll)
- Bundler gem
- Git

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/oyi77/oyi77.github.io.git
cd oyi77.github.io
```

### 2. Install Dependencies

```bash
bundle install
```

This installs:
- Jekyll and GitHub Pages gems
- Jekyll plugins (paginate, sitemap, gist, feed, etc.)
- Optional: octokit, nokogiri

### 3. Run Local Server

```bash
bundle exec jekyll serve
```

Access at: `http://localhost:4000/terminal/`

## Environment Variables (Optional)

For full functionality, set these environment variables:

```bash
export GITHUB_TOKEN=your_github_token  # For GitHub data fetching
```

## Project Structure

```
oyi77.github.io/
├── _data/              # Jekyll data files
├── _pages/             # Static pages
├── _posts/             # Blog posts
├── _plugins/           # Jekyll plugins
├── _layouts/           # Layout templates
├── assets/
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript
│   │   └── terminal/  # Terminal OS code
│   └── images/        # Images
└── docs/              # Documentation
```

## Development Workflow

1. Make changes to files
2. Jekyll auto-rebuilds (watch mode)
3. Refresh browser to see changes
4. Check console for errors

## Testing

### Manual Testing

1. Test all commands in terminal
2. Verify filesystem operations
3. Check theme switching
4. Test responsive design
5. Verify error handling

### Browser Testing

Test in:
- Chrome/Edge (primary)
- Firefox
- Safari
- Mobile browsers

## Troubleshooting

### Jekyll Build Errors

- Check Ruby version: `ruby -v`
- Update gems: `bundle update`
- Clear cache: `rm -rf .jekyll-cache`

### Terminal Not Loading

- Check browser console for errors
- Verify xterm.js CDN links
- Check script loading order

### Data Not Loading

- Verify `window.JEKYLL_DATA` exists
- Check filesystem-loader.js execution
- Verify data files in `_data/`

## Code Style

- **JavaScript**: ES6+, 2 spaces, semicolons
- **Ruby**: 2 spaces, frozen_string_literal
- **YAML**: 2 spaces, consistent structure
- **CSS**: kebab-case, mobile-first

## Git Workflow

1. Create feature branch
2. Make changes
3. Test locally
4. Commit with clear messages
5. Push to GitHub
6. GitHub Pages auto-deploys

