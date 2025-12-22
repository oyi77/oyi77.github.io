# Local Build Guide

## Building Locally

### Development Server

```bash
bundle exec jekyll serve
```

Access at: `http://localhost:4000/`

### Production Build

```bash
bundle exec jekyll build
```

Output in `_site/` directory.

## Build Options

### Incremental Build

```bash
bundle exec jekyll serve --incremental
```

Faster rebuilds by only processing changed files.

### Draft Posts

```bash
bundle exec jekyll serve --drafts
```

Include posts in `_drafts/` directory.

### Future Posts

```bash
bundle exec jekyll serve --future
```

Include posts with future dates.

## Build Configuration

### Jekyll Config

Settings in `_config.yml`:
- `url`: Site URL
- `baseurl`: Base URL path
- `plugins`: Enabled plugins
- `theme`: Jekyll theme

### Plugin Configuration

Plugin settings in `_config.yml`:
- `asset_optimization`: Enable asset optimization
- `data_compression`: Enable data compression
- `analytics_provider`: Analytics provider

## Environment Variables

Set before building:

```bash
export GITHUB_TOKEN=your_token
bundle exec jekyll build
```

## Build Output

### Generated Files

- `_site/` - Built site
- `_data/*.yml` - Generated data files
- `assets/css/*.min.css` - Minified CSS

### Data Files Generated

Plugins generate:
- `github_stats.yml` - GitHub data
- `market_data.yml` - Market data
- `metrics.yml` - Performance metrics
- `skills_matrix.yml` - Skills matrix
- `timeline.yml` - Career timeline
- `analytics.yml` - Analytics schemas
- `repository_stats.yml` - Repository stats
- `seo.yml` - SEO metadata

## Troubleshooting

### Build Errors

- Check Ruby version
- Update gems: `bundle update`
- Clear cache: `rm -rf .jekyll-cache _site`

### Plugin Errors

- Check plugin syntax
- Verify required data files exist
- Check environment variables

### Performance

- Use incremental builds for development
- Disable plugins during development if needed
- Clear generated files periodically

