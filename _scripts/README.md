# Scripts Documentation

This directory contains utility scripts for the portfolio site.

## RSS Feed Aggregator

**File:** `fetch_rss_feeds.rb`

Fetches RSS feeds from all social platforms and aggregates them into `_data/aggregated_posts.yml`.

### Usage

```bash
# Install dependencies first
bundle install

# Run the script
bundle exec ruby _scripts/fetch_rss_feeds.rb
```

### Features

- Fetches from multiple sources: Medium, Dev.to, Substack, Publish0x, GitHub, GitLab, Twitter (via RSSHub)
- Handles RSSHub fallback instances if primary is rate-limited
- Deduplicates posts by URL
- Limits to 50 posts per source, 200 total
- Gracefully handles errors (skips failed sources)

### RSS Sources

1. **Medium**: `https://medium.com/feed/@oyi77`
2. **Dev.to**: `https://dev.to/feed/oyi77`
3. **Substack**: `https://oyi77.substack.com/feed`
4. **Publish0x**: `https://www.publish0x.com/cr4zydud3/rss`
5. **GitHub (oyi77)**: `https://github.com/oyi77.atom`
6. **GitHub (jokogendeng77)**: `https://github.com/jokogendeng77.atom`
7. **GitLab**: `https://gitlab.com/oyi77/-/activity.atom`
8. **Twitter/X**: Via RSSHub public instance (`/twitter/user/this_is_paijo`)

### Automated Updates

The script runs automatically via GitHub Actions workflow (`.github/workflows/update-blog-posts.yml`) daily at 2 AM UTC. You can also trigger it manually from the Actions tab.

## Favicon Generator

**File:** `generate_favicon.rb`

Generates all required favicon sizes from the SVG source.

### Usage

```bash
# Requires ImageMagick
brew install imagemagick  # macOS
# or
sudo apt-get install imagemagick  # Linux

# Run the script
bundle exec ruby _scripts/generate_favicon.rb
```

### Output

Generates favicons in `assets/images/favicons/`:
- Standard favicons (16x16 to 256x256)
- Apple touch icons (57x57 to 180x180)
- Android Chrome icons
- Windows tiles
- Multi-resolution favicon.ico
- Web manifest (`site.webmanifest`)

### Fallback

If ImageMagick is not available, the script will create a fallback SVG favicon.

