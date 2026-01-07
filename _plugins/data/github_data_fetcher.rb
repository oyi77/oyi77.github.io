# frozen_string_literal: true

module Jekyll
  class GitHubDataFetcher < Generator
    safe true
    priority :normal

    def generate(site)
      username = site.config['github_username']
      return unless username
      
      data_dir = File.join(site.source, '_data')
      FileUtils.mkdir_p(data_dir)
      data_file = File.join(data_dir, 'github_stats.yml')
      
      token = ENV['GITHUB_TOKEN']
      
      if token
        # Fetch fresh data
        stats = {
          'profile' => {},
          'repositories' => [],
          'contributions' => {},
          'languages' => {},
          'generated_at' => Time.now.strftime('%Y-%m-%d %H:%M:%S UTC')
        }
        
        begin
          stats = fetch_github_data(username, token, stats)
          File.write(data_file, stats.to_yaml)
          Jekyll.logger.info "GitHub Data Fetcher:", "Fetched data for #{username}"
        rescue => e
          Jekyll.logger.warn "GitHub Data Fetcher:", "Error fetching data: #{e.message}"
          # Try to use existing file if available
          use_existing_data(data_file, username)
        end
      else
        # No token - use existing data or create placeholder
        Jekyll.logger.info "GitHub Data Fetcher:", "GITHUB_TOKEN not set, using existing data or placeholder"
        use_existing_data(data_file, username)
      end
    end
    
    def use_existing_data(data_file, username)
      if File.exist?(data_file)
        Jekyll.logger.info "GitHub Data Fetcher:", "Using existing github_stats.yml"
      else
        # Create placeholder data
        placeholder = {
          'profile' => {
            'login' => username,
            'name' => username,
            'message' => 'GitHub data requires GITHUB_TOKEN environment variable'
          },
          'repositories' => [],
          'contributions' => {},
          'languages' => {},
          'generated_at' => Time.now.strftime('%Y-%m-%d %H:%M:%S UTC'),
          'note' => 'Set GITHUB_TOKEN environment variable to fetch real data'
        }
        File.write(data_file, placeholder.to_yaml)
        Jekyll.logger.info "GitHub Data Fetcher:", "Created placeholder github_stats.yml"
      end
    end

    private

    def fetch_github_data(username, token, stats)
      require 'net/http'
      require 'json'
      require 'uri'
      
      base_url = 'https://api.github.com'
      
      # Fetch user profile
      stats['profile'] = fetch_user_profile(username, token, base_url)
      
      # Fetch repositories
      stats['repositories'] = fetch_repositories(username, token, base_url)
      
      # Calculate language breakdown
      stats['languages'] = calculate_languages(stats['repositories'])
      
      # Fetch contribution statistics (simplified)
      stats['contributions'] = fetch_contributions(username, token, base_url)
      
      stats
    end

    def fetch_user_profile(username, token, base_url)
      uri = URI("#{base_url}/users/#{username}")
      response = make_request(uri, token)
      
      return {} unless response && response.code == '200'
      
      data = JSON.parse(response.body)
      {
        'login' => data['login'],
        'name' => data['name'],
        'bio' => data['bio'],
        'public_repos' => data['public_repos'],
        'followers' => data['followers'],
        'following' => data['following'],
        'created_at' => data['created_at'],
        'updated_at' => data['updated_at'],
        'avatar_url' => data['avatar_url'],
        'html_url' => data['html_url']
      }
    end

    def fetch_repositories(username, token, base_url)
      uri = URI("#{base_url}/users/#{username}/repos?per_page=100&sort=updated&type=owner")
      response = make_request(uri, token)
      
      return [] unless response && response.code == '200'
      
      repos = JSON.parse(response.body)
      
      repos.map do |repo|
        next if repo['fork'] # Skip forks
        next if repo['archived'] # Skip archived
        
        {
          'name' => repo['name'],
          'full_name' => repo['full_name'],
          'description' => repo['description'],
          'stars' => repo['stargazers_count'],
          'forks' => repo['forks_count'],
          'language' => repo['language'],
          'languages_url' => repo['languages_url'],
          'created_at' => repo['created_at'],
          'updated_at' => repo['updated_at'],
          'pushed_at' => repo['pushed_at'],
          'size' => repo['size'],
          'open_issues' => repo['open_issues_count'],
          'default_branch' => repo['default_branch'],
          'url' => repo['html_url'],
          'topics' => repo['topics'] || []
        }
      end.compact
    end

    def calculate_languages(repositories)
      languages = {}
      
      repositories.each do |repo|
        lang = repo['language']
        next unless lang
        
        languages[lang] ||= {
          'count' => 0,
          'repos' => []
        }
        languages[lang]['count'] += 1
        languages[lang]['repos'] << repo['name']
      end
      
      # Sort by count
      languages.sort_by { |_k, v| -v['count'] }.to_h
    end

    def fetch_contributions(username, token, base_url)
      # GitHub API doesn't provide direct contribution graph data
      # This is a simplified version that estimates based on repository activity
      
      {
        'estimated_annual_commits' => estimate_commits(username, token, base_url),
        'active_repositories' => count_active_repos(username, token, base_url),
        'last_activity' => get_last_activity(username, token, base_url)
      }
    end

    def estimate_commits(username, token, base_url)
      # Estimate based on repository count and activity
      # This is a rough estimate
      uri = URI("#{base_url}/users/#{username}/repos?per_page=1")
      response = make_request(uri, token)
      
      return 0 unless response && response.code == '200'
      
      # Get total count from Link header if available
      link_header = response['Link']
      if link_header
        match = link_header.match(/page=(\d+)>; rel="last"/)
        repo_count = match ? match[1].to_i : 10
      else
        repo_count = 10
      end
      
      # Rough estimate: 50-100 commits per repo per year
      (repo_count * 75).round
    end

    def count_active_repos(username, token, base_url)
      uri = URI("#{base_url}/users/#{username}/repos?per_page=100&sort=updated")
      response = make_request(uri, token)
      
      return 0 unless response && response.code == '200'
      
      repos = JSON.parse(response.body)
      cutoff_date = Date.today - 90 # Last 90 days
      
      repos.count do |repo|
        updated = Date.parse(repo['updated_at'])
        updated >= cutoff_date
      end
    end

    def get_last_activity(username, token, base_url)
      uri = URI("#{base_url}/users/#{username}/events/public?per_page=1")
      response = make_request(uri, token)
      
      return nil unless response && response.code == '200'
      
      events = JSON.parse(response.body)
      return nil if events.empty?
      
      events.first['created_at']
    end

    def make_request(uri, token)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.read_timeout = 10
      
      request = Net::HTTP::Get.new(uri)
      request['Authorization'] = "token #{token}"
      request['Accept'] = 'application/vnd.github.v3+json'
      request['User-Agent'] = 'Jekyll-GitHub-Data-Fetcher'
      
      http.request(request)
    rescue => e
      Jekyll.logger.warn "GitHub Data Fetcher:", "Request failed: #{e.message}"
      nil
    end
  end
end

