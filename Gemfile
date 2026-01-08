source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins

gem "tzinfo-data"
# wdm is optional for file watching on Windows - Jekyll will use polling if not available
# gem "wdm", "~> 0.1.0" if Gem.win_platform?

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "jekyll-paginate"
  gem "jekyll-sitemap"
  gem "jekyll-gist"
  gem "jekyll-feed"
  gem "jemoji"
  gem "jekyll-include-cache"
  gem "jekyll-algolia"
end

# Additional gems for custom plugins and build-time processing
gem "octokit", "~> 4.25"  # GitHub API client (optional, fallback to net/http if not available)
gem "nokogiri", "~> 1.14"  # HTML/XML parsing for external data fetching
gem "rss", "~> 0.2"  # RSS/Atom feed parsing
