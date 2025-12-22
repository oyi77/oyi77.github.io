# Jekyll Plugin Development

## Plugin Overview

Jekyll plugins generate data files at build time from various sources (GitHub API, calculations, external APIs).

## Plugin Structure

```ruby
# frozen_string_literal: true

module Jekyll
  class PluginName < Generator
    safe true
    priority :normal

    def generate(site)
      begin
        # Plugin logic
        data = generate_data(site)
        
        # Write to data file
        data_dir = File.join(site.source, '_data')
        FileUtils.mkdir_p(data_dir)
        data_file = File.join(data_dir, 'output.yml')
        File.write(data_file, data.to_yaml)
        
        Jekyll.logger.info "Plugin Name:", "Generated data"
      rescue => e
        Jekyll.logger.warn "Plugin Name:", "Error: #{e.message}"
      end
    end

    private

    def generate_data(site)
      # Implementation
    end
  end
end
```

## Plugin Types

### Generator Plugins

Run during site generation, create data files:

- `github_data_fetcher.rb` - Fetches GitHub data
- `market_data_fetcher.rb` - Fetches market data
- `metrics_calculator.rb` - Calculates metrics
- `seo_generator.rb` - Generates SEO data

### Filter Plugins

Provide Liquid filters:

- `custom_filters.rb` - Custom filters (time_ago, format_currency)

## Priority Levels

- `:high` - Run early (data dependencies)
- `:normal` - Default priority
- `:low` - Run late (optimizations)

## Error Handling

All plugins should:

1. Wrap main logic in `begin/rescue`
2. Log warnings for non-fatal errors
3. Create fallback data when possible
4. Never break the build

## Accessing Site Data

```ruby
# Access config
site.config['github_username']

# Access data files
site.data['terminal']
site.data['companies']

# Access posts/pages
site.posts.docs
site.pages
```

## Writing Data Files

```ruby
data_dir = File.join(site.source, '_data')
FileUtils.mkdir_p(data_dir)

data_file = File.join(data_dir, 'output.yml')
File.write(data_file, data.to_yaml)
```

## Environment Variables

Access via `ENV`:

```ruby
token = ENV['GITHUB_TOKEN']
if token
  # Use token
else
  # Fallback behavior
end
```

## Logging

```ruby
Jekyll.logger.info "Plugin:", "Success message"
Jekyll.logger.warn "Plugin:", "Warning message"
Jekyll.logger.debug "Plugin:", "Debug message"
Jekyll.logger.error "Plugin:", "Error message"
```

## Testing Plugins

1. Run Jekyll build: `bundle exec jekyll build`
2. Check `_data/` for generated files
3. Verify data structure
4. Test with missing data/API failures

## Plugin Examples

### Simple Data Generator

```ruby
def generate(site)
  data = {
    'items' => ['item1', 'item2'],
    'generated_at' => Time.now.iso8601
  }
  
  write_data_file(site, 'simple.yml', data)
end
```

### API Data Fetcher

```ruby
def generate(site)
  begin
    data = fetch_from_api
    write_data_file(site, 'api_data.yml', data)
  rescue => e
    Jekyll.logger.warn "API Fetcher:", "Error: #{e.message}"
    write_fallback_data(site)
  end
end
```

### Data Calculator

```ruby
def generate(site)
  source_data = site.data['source']
  return unless source_data
  
  calculated = calculate_metrics(source_data)
  write_data_file(site, 'metrics.yml', calculated)
end
```

## Best Practices

1. **Safe Mode**: Always set `safe true`
2. **Error Handling**: Never let plugins break builds
3. **Fallbacks**: Provide fallback data when APIs fail
4. **Logging**: Log important operations
5. **Performance**: Cache expensive operations
6. **Documentation**: Document plugin purpose and requirements

