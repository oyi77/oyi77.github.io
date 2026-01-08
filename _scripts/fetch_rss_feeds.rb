#!/usr/bin/env ruby
# frozen_string_literal: true

# RSS Feed Aggregator
# Fetches RSS feeds from all social platforms and aggregates them into a single YAML file
# Uses native RSS/Atom feeds where available, RSSHub for Twitter/X

require 'net/http'
require 'uri'
require 'rss'
require 'yaml'
require 'time'
require 'json'

class RSSFeedAggregator
  # RSSHub public instances (fallback list)
  RSSHUB_INSTANCES = [
    'https://rsshub.app',
    'https://rsshub.rssforever.com',
    'https://www.rsshub.in',
    'https://rss.ovh'
  ].freeze

  # RSS Feed Sources
  FEED_SOURCES = {
    medium: {
      url: 'https://medium.com/feed/@oyi77',
      source: 'Medium',
      type: 'rss'
    },
    devto: {
      url: 'https://dev.to/feed/oyi77',
      source: 'Dev.to',
      type: 'rss'
    },
    substack: {
      url: 'https://oyi77.substack.com/feed',
      source: 'Substack',
      type: 'rss'
    },
    publish0x: {
      url: 'https://www.publish0x.com/@cr4zydud3.rss',
      source: 'Publish0x',
      type: 'rss',
      note: 'May require authentication - returns 403'
    },
    github_oyi77: {
      url: 'https://github.com/oyi77.atom',
      source: 'GitHub',
      type: 'atom'
    },
    github_jokogendeng77: {
      url: 'https://github.com/jokogendeng77.atom',
      source: 'GitHub',
      type: 'atom'
    },
    gitlab: {
      url: 'https://gitlab.com/oyi77/-/activity.atom',
      source: 'GitLab',
      type: 'atom'
    },
    bitbucket_jokogendeng: {
      route: '/bitbucket/repos/jokoGendeng',
      source: 'Bitbucket',
      type: 'rsshub',
      note: 'Requires RSSHub - public instances may be unavailable'
    },
    bitbucket_oyi77: {
      route: '/bitbucket/repos/oyi77',
      source: 'Bitbucket',
      type: 'rsshub',
      note: 'Requires RSSHub - public instances may be unavailable'
    },
    quora: {
      route: '/quora/user/Paijo-43',
      source: 'Quora',
      type: 'rsshub'
    },
    twitter: {
      url: 'https://rss.app/feeds/v1.1/LM3lo4yDRC5DqlMX.json',
      source: 'Twitter',
      type: 'json'
    },
    linkedin: {
      route: '/linkedin/posts/fikriizzuddin',
      source: 'LinkedIn',
      type: 'rsshub'
    }
  }.freeze

  MAX_POSTS_PER_SOURCE = 50
  MAX_TOTAL_POSTS = 200

  def initialize
    @posts = []
    @errors = []
  end

  def fetch_all
    puts "Starting RSS feed aggregation..."
    puts "=" * 60

    FEED_SOURCES.each do |key, config|
      puts "\nFetching #{config[:source]}..."
      begin
        fetch_feed(key, config)
      rescue => e
        error_msg = "Error fetching #{config[:source]}: #{e.message}"
        puts "  ❌ #{error_msg}"
        @errors << error_msg
      end
    end

    puts "\n" + "=" * 60
    puts "Aggregation complete!"
    puts "Total posts: #{@posts.length}"
    puts "Errors: #{@errors.length}"
    @errors.each { |e| puts "  - #{e}" } if @errors.any?
  end

  def fetch_feed(key, config)
    case config[:type]
    when 'rss', 'atom'
      fetch_native_feed(config[:url], config[:source], config[:type])
    when 'json'
      fetch_json_feed(config[:url], config[:source])
    when 'rsshub'
      fetch_rsshub_feed(config[:route], config[:source], config[:tweets_only])
    else
      puts "  ⚠️  Unknown feed type: #{config[:type]}"
      []
    end
  end

  def fetch_native_feed(url, source, type)
    uri = URI(url)
    response = fetch_with_retry(uri, follow_redirects: true)

    unless response.is_a?(Net::HTTPSuccess)
      raise "HTTP #{response.code}: #{response.message}"
    end

    feed = parse_feed(response.body, type)
    extract_items(feed, source, url)
  rescue => e
    raise "Failed to fetch #{source}: #{e.message}"
  end

  def fetch_json_feed(url, source)
    uri = URI(url)
    response = fetch_with_retry(uri, follow_redirects: true)

    unless response.is_a?(Net::HTTPSuccess)
      raise "HTTP #{response.code}: #{response.message}"
    end

    data = JSON.parse(response.body)
    extract_json_items(data, source, url)
  rescue => e
    raise "Failed to fetch #{source}: #{e.message}"
  end

  def extract_json_items(data, source, feed_url)
    items = []
    json_items = data['items'] || []

    json_items.first(MAX_POSTS_PER_SOURCE).each do |item|
      post = {
        title: clean_text(item['title'] || ''),
        excerpt: clean_text(item['content_text'] || item['summary'] || ''),
        link: item['url'] || feed_url,
        source: source,
        published_date: parse_date(item['date_published']),
        author: item['authors']&.first&.dig('name') || 'Lead Software Engineer',
        categories: item['categories'] || [],
        tags: item['tags'] || []
      }

      # Deduplicate by URL
      unless @posts.any? { |p| p[:link] == post[:link] }
        items << post
        @posts << post
      end
    end

    puts "  ✅ Extracted #{items.length} posts"
    items
  end

  def fetch_rsshub_feed(route, source, tweets_only = false)
    # Try RSSHub instances in order
    RSSHUB_INSTANCES.each do |base_url|
      begin
        url = "#{base_url}#{route}"
        uri = URI(url)
        response = fetch_with_retry(uri, timeout: 10)

        if response.is_a?(Net::HTTPSuccess)
          feed = parse_feed(response.body, 'rss')
          items = extract_items(feed, source, url, tweets_only)
          puts "  ✅ Fetched from #{base_url}"
          return items
        elsif response.code == '429'
          puts "  ⚠️  Rate limited on #{base_url}, trying next..."
          next
        else
          puts "  ⚠️  HTTP #{response.code} from #{base_url}, trying next..."
          next
        end
      rescue => e
        puts "  ⚠️  Error with #{base_url}: #{e.message}, trying next..."
        next
      end
    end

    # If all instances failed, skip Twitter (don't fail the workflow)
    puts "  ⚠️  All RSSHub instances failed, skipping #{source}"
    []
  end

  def fetch_with_retry(uri, max_retries: 3, timeout: 5, follow_redirects: true)
    retries = 0
    begin
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = (uri.scheme == 'https')
      http.read_timeout = timeout
      http.open_timeout = timeout

      request = Net::HTTP::Get.new(uri)
      request['User-Agent'] = 'Mozilla/5.0 (compatible; RSSAggregator/1.0)'

      response = http.request(request)
      
      # Follow redirects
      if follow_redirects && response.is_a?(Net::HTTPRedirection)
        redirect_uri = URI(response['location'])
        redirect_uri = URI.join(uri, redirect_uri) unless redirect_uri.absolute?
        return fetch_with_retry(redirect_uri, max_retries: max_retries, timeout: timeout, follow_redirects: true)
      end
      
      response
    rescue => e
      retries += 1
      if retries < max_retries
        sleep(1 * retries) # Exponential backoff
        retry
      else
        raise e
      end
    end
  end

  def parse_feed(content, type)
    case type
    when 'rss'
      RSS::Parser.parse(content, false)
    when 'atom'
      RSS::Parser.parse(content, false)
    else
      raise "Unknown feed type: #{type}"
    end
  rescue => e
    raise "Failed to parse feed: #{e.message}"
  end

  def extract_items(feed, source, feed_url, tweets_only = false)
    items = []
    feed_items = feed.respond_to?(:items) ? feed.items : feed.entries

    feed_items.first(MAX_POSTS_PER_SOURCE).each do |item|
      # For Twitter via RSSHub, filter to only original tweets if requested
      if tweets_only && source == 'Twitter'
        # Skip retweets/replies (they often have different patterns in RSS)
        title = item.title.to_s
        link = item.link.to_s
        next if title.start_with?('RT @') || title.start_with?('Re:')
      end

      # Handle date extraction for both RSS and Atom feeds
      date_value = nil
      if item.respond_to?(:pubDate)
        date_value = item.pubDate
      elsif item.respond_to?(:published)
        date_value = item.published
      elsif item.respond_to?(:updated)
        date_value = item.updated
      elsif item.respond_to?(:dc_date)
        date_value = item.dc_date
      end

      post = {
        title: clean_text(item.title.to_s),
        excerpt: clean_text(extract_description(item)),
        link: extract_link(item) || feed_url,
        source: source,
        published_date: parse_date(date_value),
        author: extract_author(item, feed),
        categories: extract_categories(item),
        tags: extract_tags(item)
      }

      # Deduplicate by URL
      unless @posts.any? { |p| p[:link] == post[:link] }
        items << post
        @posts << post
      end
    end

    puts "  ✅ Extracted #{items.length} posts"
    items
  end

  def extract_link(item)
    # Handle both RSS and Atom feed link formats
    if item.respond_to?(:link)
      link = item.link
      # Atom feeds may have link as an object with href
      if link.respond_to?(:href)
        link.href.to_s
      else
        link.to_s
      end
    elsif item.respond_to?(:url)
      item.url.to_s
    else
      nil
    end
  end

  def extract_description(item)
    if item.respond_to?(:description)
      item.description.to_s
    elsif item.respond_to?(:content)
      item.content.to_s
    elsif item.respond_to?(:summary)
      item.summary.to_s
    else
      ''
    end
  end

  def extract_author(item, feed)
    if item.respond_to?(:author)
      item.author.to_s
    elsif item.respond_to?(:dc_creator)
      item.dc_creator.to_s
    elsif feed.respond_to?(:author)
      feed.author.to_s
    else
      'Lead Software Engineer'
    end
  end

  def extract_categories(item)
    categories = []
    if item.respond_to?(:categories)
      categories.concat(item.categories.map(&:to_s))
    end
    if item.respond_to?(:dc_subject)
      categories.concat(Array(item.dc_subject).map(&:to_s))
    end
    categories.uniq.reject(&:empty?)
  end

  def extract_tags(item)
    # Tags are often in categories or dc:subject
    extract_categories(item)
  end

  def parse_date(date_string)
    return Time.now.utc.iso8601 if date_string.nil?

    begin
      if date_string.is_a?(Time)
        date_string.utc.iso8601
      else
        Time.parse(date_string.to_s).utc.iso8601
      end
    rescue
      Time.now.utc.iso8601
    end
  end

  def clean_text(text)
    return '' if text.nil?

    # Remove HTML tags
    text = text.gsub(/<[^>]+>/, ' ')
    # Decode HTML entities
    text = text.gsub(/&nbsp;/, ' ')
               .gsub(/&amp;/, '&')
               .gsub(/&lt;/, '<')
               .gsub(/&gt;/, '>')
               .gsub(/&quot;/, '"')
               .gsub(/&#39;/, "'")
    # Clean up whitespace
    text = text.gsub(/\s+/, ' ').strip
    text
  end

  def save_to_yaml(output_path)
    # Sort by date (newest first)
    sorted_posts = @posts.sort_by { |p| p[:published_date] || '' }.reverse.first(MAX_TOTAL_POSTS)

    data = {
      'posts' => sorted_posts.map do |post|
        {
          'title' => post[:title],
          'excerpt' => post[:excerpt],
          'link' => post[:link],
          'source' => post[:source],
          'published_date' => post[:published_date],
          'author' => post[:author],
          'categories' => post[:categories] || [],
          'tags' => post[:tags] || []
        }
      end
    }

    File.write(output_path, data.to_yaml)
    puts "\n✅ Saved #{sorted_posts.length} posts to #{output_path}"
  end
end

# Main execution
if __FILE__ == $0
  aggregator = RSSFeedAggregator.new
  aggregator.fetch_all

  output_path = File.join(__dir__, '..', '_data', 'aggregated_posts.yml')
  aggregator.save_to_yaml(output_path)

  exit(aggregator.instance_variable_get(:@errors).empty? ? 0 : 1)
end

