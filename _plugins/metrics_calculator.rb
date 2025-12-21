# frozen_string_literal: true

module Jekyll
  class MetricsCalculator < Generator
    safe true
    priority :normal

    def generate(site)
      metrics = {
        'code_quality' => {},
        'project_health' => {},
        'performance_indicators' => {},
        'generated_at' => Time.now.strftime('%Y-%m-%d %H:%M:%S UTC')
      }
      
      # Calculate metrics from GitHub data if available
      github_stats = site.data['github_stats']
      if github_stats
        metrics['code_quality'] = calculate_code_quality(github_stats)
        metrics['project_health'] = calculate_project_health(github_stats)
      end
      
      # Calculate performance indicators from repository stats
      repo_stats = site.data['repository_stats']
      if repo_stats
        metrics['performance_indicators'] = calculate_performance_indicators(repo_stats)
      end
      
      # Write to data file
      data_dir = File.join(site.source, '_data')
      FileUtils.mkdir_p(data_dir)
      
      data_file = File.join(data_dir, 'metrics.yml')
      File.write(data_file, metrics.to_yaml)
      
      Jekyll.logger.info "Metrics Calculator:", "Generated performance metrics"
    end

    private

    def calculate_code_quality(github_stats)
      repos = github_stats['repositories'] || []
      return {} if repos.empty?
      
      total_repos = repos.length
      total_stars = repos.sum { |r| r['stars'] || 0 }
      total_forks = repos.sum { |r| r['forks'] || 0 }
      total_issues = repos.sum { |r| r['open_issues'] || 0 }
      
      avg_stars = total_repos > 0 ? (total_stars.to_f / total_repos).round(1) : 0
      avg_forks = total_repos > 0 ? (total_forks.to_f / total_repos).round(1) : 0
      
      # Calculate quality score (0-100)
      # Based on stars, forks, and issue ratio
      star_score = [avg_stars / 10.0, 50].min # Max 50 points for stars
      fork_score = [avg_forks / 5.0, 30].min # Max 30 points for forks
      issue_penalty = [total_issues / total_repos.to_f, 20].min # Penalty for issues
      
      quality_score = (star_score + fork_score - issue_penalty).round(1)
      quality_score = [[quality_score, 0].max, 100].min
      
      {
        'total_repositories' => total_repos,
        'average_stars' => avg_stars,
        'average_forks' => avg_forks,
        'total_open_issues' => total_issues,
        'quality_score' => quality_score,
        'quality_rating' => rating_for_score(quality_score)
      }
    end

    def calculate_project_health(github_stats)
      repos = github_stats['repositories'] || []
      return {} if repos.empty?
      
      now = Time.now
      active_repos = 0
      stale_repos = 0
      archived_repos = 0
      
      repos.each do |repo|
        updated_at = repo['updated_at']
        next unless updated_at
        
        updated = Time.parse(updated_at)
        days_since_update = (now - updated).to_i / 86400
        
        if days_since_update < 30
          active_repos += 1
        elsif days_since_update < 180
          # Moderately active
        else
          stale_repos += 1
        end
      end
      
      health_score = calculate_health_score(active_repos, stale_repos, repos.length)
      
      {
        'active_repositories' => active_repos,
        'stale_repositories' => stale_repos,
        'total_repositories' => repos.length,
        'health_score' => health_score,
        'health_rating' => rating_for_score(health_score)
      }
    end

    def calculate_performance_indicators(repo_stats)
      repos = repo_stats['repositories'] || []
      return {} if repos.empty?
      
      total_commits = repo_stats['summary']['total_commits'] || 0
      total_stars = repo_stats['summary']['total_stars'] || 0
      total_forks = repo_stats['summary']['total_forks'] || 0
      total_repos = repo_stats['summary']['total_repos'] || 0
      
      {
        'total_commits' => total_commits,
        'total_stars' => total_stars,
        'total_forks' => total_forks,
        'commits_per_repo' => total_repos > 0 ? (total_commits.to_f / total_repos).round(1) : 0,
        'stars_per_repo' => total_repos > 0 ? (total_stars.to_f / total_repos).round(1) : 0,
        'forks_per_repo' => total_repos > 0 ? (total_forks.to_f / total_repos).round(1) : 0,
        'language_diversity' => (repo_stats['summary']['languages'] || {}).length
      }
    end

    def calculate_health_score(active, stale, total)
      return 0 if total == 0
      
      active_ratio = active.to_f / total
      stale_ratio = stale.to_f / total
      
      # Health score: 0-100
      # Higher score for more active repos, lower for stale
      base_score = active_ratio * 100
      penalty = stale_ratio * 30
      
      score = (base_score - penalty).round(1)
      [[score, 0].max, 100].min
    end

    def rating_for_score(score)
      case score
      when 80..100
        'excellent'
      when 60..79
        'good'
      when 40..59
        'fair'
      when 20..39
        'poor'
      else
        'needs_improvement'
      end
    end
  end
end

