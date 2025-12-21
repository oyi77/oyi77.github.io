#!/usr/bin/env ruby
# frozen_string_literal: true

# External API Data Fetcher Script
# Fetches data from external APIs and generates _data/external_stats.yml

require 'net/http'
require 'json'
require 'uri'
require 'yaml'
require 'date'

class ExternalDataFetcher
  def initialize(data_dir = '_data')
    @data_dir = data_dir
    @stats = {
      'hackerrank' => {},
      'linkedin' => {},
      'external_projects' => [],
      'generated_at' => Time.now.strftime('%Y-%m-%d %H:%M:%S UTC')
    }
  end

  def fetch_all
    puts "Fetching external data..."
    
    # Fetch HackerRank stats (if profile URL available)
    fetch_hackerrank_stats if ENV['HACKERRANK_USERNAME']
    
    # Fetch LinkedIn stats (limited without API access)
    fetch_linkedin_stats if ENV['LINKEDIN_PROFILE']
    
    # Process external project metrics
    process_external_projects
    
    # Write to data file
    write_data_file
  end

  private

  def fetch_hackerrank_stats
    username = ENV['HACKERRANK_USERNAME']
    return unless username
    
    puts "Fetching HackerRank stats for #{username}..."
    
    # HackerRank doesn't have a public API, so we'll create a placeholder
    # In a real implementation, you might scrape or use unofficial APIs
    @stats['hackerrank'] = {
      'username' => username,
      'profile_url' => "https://www.hackerrank.com/#{username}",
      'note' => 'HackerRank data requires web scraping or unofficial API',
      'certifications' => [
        'Problem Solving (Intermediate)',
        'Python (Basic)',
        'SQL (Advanced)',
        'Rest API (Intermediate)',
        'JavaScript (Intermediate)'
      ]
    }
  end

  def fetch_linkedin_stats
    profile = ENV['LINKEDIN_PROFILE']
    return unless profile
    
    puts "Fetching LinkedIn stats..."
    
    # LinkedIn requires official API access or web scraping
    # This is a placeholder structure
    @stats['linkedin'] = {
      'profile_url' => profile,
      'note' => 'LinkedIn data requires official API access',
      'connections' => '500+',
      'profile_views' => 'N/A'
    }
  end

  def process_external_projects
    # Read terminal.yml to get project URLs
    terminal_file = File.join(@data_dir, 'terminal.yml')
    return unless File.exist?(terminal_file)
    
    terminal_data = YAML.load_file(terminal_file)
    sites = terminal_data['sites'] || []
    
    sites.each do |site|
      next unless site['url'] && site['url'].start_with?('http')
      
      project_stats = {
        'name' => site['name'],
        'url' => site['url'],
        'category' => site['category'],
        'description' => site['description'],
        'status' => check_url_status(site['url']),
        'last_checked' => Time.now.strftime('%Y-%m-%d %H:%M:%S UTC')
      }
      
      @stats['external_projects'] << project_stats
    end
  end

  def check_url_status(url)
    begin
      uri = URI(url)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true if uri.scheme == 'https'
      http.read_timeout = 5
      http.open_timeout = 5
      
      response = http.head(uri.path.empty? ? '/' : uri.path)
      
      case response.code.to_i
      when 200..299
        'online'
      when 300..399
        'redirect'
      when 400..499
        'client_error'
      when 500..599
        'server_error'
      else
        'unknown'
      end
    rescue => e
      'error'
    end
  end

  def write_data_file
    FileUtils.mkdir_p(@data_dir)
    data_file = File.join(@data_dir, 'external_stats.yml')
    
    File.write(data_file, @stats.to_yaml)
    puts "External stats written to #{data_file}"
  end
end

# Run if executed directly
if __FILE__ == $0
  fetcher = ExternalDataFetcher.new
  fetcher.fetch_all
end

