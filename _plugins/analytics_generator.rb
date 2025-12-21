# frozen_string_literal: true

module Jekyll
  class AnalyticsGenerator < Generator
    safe true
    priority :normal

    def generate(site)
      analytics = {
        'events' => generate_event_schemas(site),
        'metrics' => generate_metrics(site),
        'tracking_config' => generate_tracking_config(site),
        'generated_at' => Time.now.strftime('%Y-%m-%d %H:%M:%S UTC')
      }
      
      # Write to data file
      data_dir = File.join(site.source, '_data')
      FileUtils.mkdir_p(data_dir)
      
      data_file = File.join(data_dir, 'analytics.yml')
      File.write(data_file, analytics.to_yaml)
      
      Jekyll.logger.info "Analytics Generator:", "Generated analytics schemas"
    end

    private

    def generate_event_schemas(site)
      events = []
      
      # Terminal command events
      events << {
        'name' => 'terminal_command',
        'category' => 'terminal',
        'parameters' => ['command', 'args', 'timestamp'],
        'description' => 'Track terminal command usage'
      }
      
      # Page view events
      events << {
        'name' => 'page_view',
        'category' => 'navigation',
        'parameters' => ['page', 'referrer', 'timestamp'],
        'description' => 'Track page views'
      }
      
      # Project click events
      events << {
        'name' => 'project_click',
        'category' => 'engagement',
        'parameters' => ['project_name', 'project_url', 'source'],
        'description' => 'Track project link clicks'
      }
      
      # Theme change events
      events << {
        'name' => 'theme_change',
        'category' => 'preference',
        'parameters' => ['theme_name', 'previous_theme'],
        'description' => 'Track theme changes'
      }
      
      events
    end

    def generate_metrics(site)
      terminal_data = site.data['terminal'] || {}
      companies_data = site.data['companies'] || {}
      repo_stats = site.data['repository_stats'] || {}
      
      {
        'portfolio' => {
          'total_projects' => (terminal_data['projects'] || []).length,
          'total_companies' => (companies_data['companies'] || []).length,
          'total_skills' => count_total_skills(terminal_data),
          'total_repositories' => repo_stats.dig('summary', 'total_repos') || 0
        },
        'performance' => {
          'page_load_target' => 2.0, # seconds
          'interactive_target' => 3.0, # seconds
          'lighthouse_score_target' => 90
        },
        'engagement' => {
          'terminal_commands' => ['help', 'whoami', 'companies', 'repos', 'skills'],
          'popular_pages' => ['/terminal/', '/about/', '/']
        }
      }
    end

    def generate_tracking_config(site)
      {
        'enabled' => site.config['analytics'] != false,
        'provider' => site.config['analytics_provider'] || 'none',
        'events' => {
          'terminal_commands' => true,
          'page_views' => true,
          'project_clicks' => true,
          'theme_changes' => true
        },
        'privacy' => {
          'anonymize_ip' => true,
          'respect_dnt' => true
        }
      }
    end

    def count_total_skills(terminal_data)
      return 0 unless terminal_data['skills']
      
      terminal_data['skills'].values.flatten.length
    end
  end
end

