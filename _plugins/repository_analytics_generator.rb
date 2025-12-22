# frozen_string_literal: true

module Jekyll
  class RepositoryAnalyticsGenerator < Generator
    safe true
    priority :high

    def generate(site)
      return unless site.config['github_username']

      begin
        username = site.config['github_username']
        stats = {
          'repositories' => [],
          'summary' => {
            'total_repos' => 0,
            'total_stars' => 0,
            'total_forks' => 0,
            'total_commits' => 0,
            'languages' => {},
            'top_repos' => [],
            'activity_trends' => {}
          },
          'generated_at' => Time.now.strftime('%Y-%m-%d %H:%M:%S UTC')
        }

        # Fetch repository data from GitHub API if available
        if ENV['GITHUB_TOKEN']
          begin
            stats = fetch_github_stats(username, stats)
          rescue => e
            Jekyll.logger.warn "Repository Analytics:", "Error fetching GitHub stats: #{e.message}"
            stats = generate_from_local_data(site, stats)
          end
        else
          # Fallback: Use project data from terminal.yml
          stats = generate_from_local_data(site, stats)
        end

        # Write to data file
        data_dir = File.join(site.source, '_data')
        FileUtils.mkdir_p(data_dir)
        
        data_file = File.join(data_dir, 'repository_stats.yml')
        File.write(data_file, stats.to_yaml)
        
        Jekyll.logger.info "Repository Analytics:", "Generated #{stats['summary']['total_repos']} repository stats"
      rescue => e
        Jekyll.logger.warn "Repository Analytics:", "Error: #{e.message}"
        Jekyll.logger.debug "Repository Analytics:", e.backtrace.join("\n")
      end
    end

    private

    def fetch_github_stats(username, stats)
      require 'net/http'
      require 'json'
      require 'uri'

      token = ENV['GITHUB_TOKEN']
      base_url = 'https://api.github.com'
      
      begin
        # Fetch user repositories
        uri = URI("#{base_url}/users/#{username}/repos?per_page=100&sort=updated")
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        
        request = Net::HTTP::Get.new(uri)
        request['Authorization'] = "token #{token}"
        request['Accept'] = 'application/vnd.github.v3+json'
        
        response = http.request(request)
        
        if response.code == '200'
          repos = JSON.parse(response.body)
          
          repos.each do |repo|
            next if repo['fork'] # Skip forks for now
            
            repo_stats = {
              'name' => repo['name'],
              'full_name' => repo['full_name'],
              'description' => repo['description'],
              'stars' => repo['stargazers_count'],
              'forks' => repo['forks_count'],
              'language' => repo['language'],
              'created_at' => repo['created_at'],
              'updated_at' => repo['updated_at'],
              'pushed_at' => repo['pushed_at'],
              'size' => repo['size'],
              'open_issues' => repo['open_issues_count'],
              'default_branch' => repo['default_branch'],
              'url' => repo['html_url']
            }
            
            # Fetch commit count
            commit_uri = URI("#{base_url}/repos/#{repo['full_name']}/commits?per_page=1")
            commit_request = Net::HTTP::Get.new(commit_uri)
            commit_request['Authorization'] = "token #{token}"
            commit_request['Accept'] = 'application/vnd.github.v3+json'
            
            commit_response = http.request(commit_request)
            if commit_response.code == '200'
              # Get total commits from Link header or make additional request
              repo_stats['commit_count'] = estimate_commits(repo['full_name'], token)
            end
            
            stats['repositories'] << repo_stats
            
            # Update summary
            stats['summary']['total_stars'] += repo['stargazers_count']
            stats['summary']['total_forks'] += repo['forks_count']
            stats['summary']['total_commits'] += repo_stats['commit_count'] || 0
            
            # Language breakdown
            if repo['language']
              stats['summary']['languages'][repo['language']] ||= 0
              stats['summary']['languages'][repo['language']] += 1
            end
          end
          
          stats['summary']['total_repos'] = stats['repositories'].length
          
          # Top repos by stars
          stats['summary']['top_repos'] = stats['repositories']
            .sort_by { |r| -r['stars'] }
            .first(10)
            .map { |r| { 'name' => r['name'], 'stars' => r['stars'], 'forks' => r['forks'] } }
        end
      rescue => e
        Jekyll.logger.warn "Repository Analytics:", "Error fetching GitHub data: #{e.message}"
        stats = generate_from_local_data(site, stats)
      end
      
      stats
    end

    def estimate_commits(full_name, token)
      # Estimate commits - GitHub API doesn't provide direct count
      # This is a simplified version
      require 'net/http'
      require 'json'
      require 'uri'
      
      begin
        uri = URI("https://api.github.com/repos/#{full_name}/commits?per_page=1")
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        
        request = Net::HTTP::Get.new(uri)
        request['Authorization'] = "token #{token}"
        request['Accept'] = 'application/vnd.github.v3+json'
        
        response = http.request(request)
        
        # Try to get count from Link header
        link_header = response['Link']
        if link_header && link_header.include?('rel="last"')
          match = link_header.match(/page=(\d+)>; rel="last"/)
          return match[1].to_i if match
        end
        
        # Fallback: estimate based on repo age and activity
        return 50 # Conservative estimate
      rescue
        return 50
      end
    end

    def generate_from_local_data(site, stats)
      # Use project data from terminal.yml
      terminal_data = site.data['terminal']
      return stats unless terminal_data && terminal_data['projects']
      
      projects = terminal_data['projects']
      
      projects.each do |project|
        repo_name = project['url']&.split('/')&.last
        next unless repo_name
        
        repo_stats = {
          'name' => repo_name,
          'description' => project['description'],
          'url' => project['url'],
          'technologies' => project['technologies'],
          'stars' => 0, # Would need API to get real values
          'forks' => 0,
          'language' => extract_primary_language(project['technologies']),
          'commit_count' => 50 # Estimate
        }
        
        stats['repositories'] << repo_stats
        stats['summary']['total_repos'] += 1
        stats['summary']['total_commits'] += 50
        
        lang = repo_stats['language']
        if lang
          stats['summary']['languages'][lang] ||= 0
          stats['summary']['languages'][lang] += 1
        end
      end
      
      stats['summary']['top_repos'] = stats['repositories']
        .first(10)
        .map { |r| { 'name' => r['name'], 'description' => r['description'] } }
      
      stats
    end

    def extract_primary_language(technologies)
      return nil unless technologies
      
      # Extract first language from technologies string
      langs = ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'PHP', 'Ruby', 'Go', 'Rust']
      technologies.split(',').each do |tech|
        langs.each do |lang|
          return lang if tech.include?(lang)
        end
      end
      
      'Other'
    end
  end
end

