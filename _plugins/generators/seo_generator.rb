# frozen_string_literal: true

module Jekyll
  class SEOGenerator < Generator
    safe true
    priority :normal

    def generate(site)
      begin
        seo_data = {
          'meta_tags' => generate_meta_tags(site),
          'structured_data' => generate_structured_data(site),
          'sitemap_priorities' => generate_sitemap_priorities(site),
          'generated_at' => Time.now.strftime('%Y-%m-%d %H:%M:%S UTC')
        }
        
        # Write to data file
        data_dir = File.join(site.source, '_data')
        FileUtils.mkdir_p(data_dir)
        
        data_file = File.join(data_dir, 'seo.yml')
        File.write(data_file, seo_data.to_yaml)
        
        Jekyll.logger.info "SEO Generator:", "Generated SEO metadata"
      rescue => e
        Jekyll.logger.warn "SEO Generator:", "Error: #{e.message}"
        Jekyll.logger.debug "SEO Generator:", e.backtrace.join("\n")
      end
    end

    private

    def generate_meta_tags(site)
      terminal_data = site.data['terminal'] || {}
      companies_data = site.data['companies'] || {}
      
      {
        'title' => site.config['title'] || 'Portfolio',
        'description' => site.config['description'] || terminal_data['bio'] || '',
        'keywords' => extract_keywords(site, terminal_data, companies_data),
        'author' => terminal_data['name'] || site.config['author']&.dig('name') || '',
        'og_title' => site.config['title'],
        'og_description' => site.config['description'],
        'og_type' => 'profile',
        'og_url' => site.config['url'],
        'twitter_card' => 'summary_large_image',
        'twitter_creator' => site.config['twitter_username'] || '',
        'canonical_url' => site.config['url']
      }
    end

    def generate_structured_data(site)
      terminal_data = site.data['terminal'] || {}
      companies_data = site.data['companies'] || {}
      
      # Person schema
      person_schema = {
        '@context' => 'https://schema.org',
        '@type' => 'Person',
        'name' => terminal_data['name'] || '',
        'jobTitle' => terminal_data['title'] || '',
        'description' => terminal_data['bio'] || '',
        'url' => site.config['url'],
        'sameAs' => extract_social_links(terminal_data),
        'knowsAbout' => extract_skills(terminal_data)
      }
      
      # Add email if available
      person_schema['email'] = terminal_data['email'] if terminal_data['email']
      
      # Add location
      if terminal_data['location']
        person_schema['address'] = {
          '@type' => 'PostalAddress',
          'addressLocality' => terminal_data['location']
        }
      end
      
      # Organization schemas for companies
      organizations = []
      if companies_data['companies']
        companies_data['companies'].each do |company|
          organizations << {
            '@type' => 'Organization',
            'name' => company['name'],
            'description' => company['description'],
            'industry' => company['industry']
          }
        end
      end
      
      {
        'person' => person_schema,
        'organizations' => organizations
      }
    end

    def generate_sitemap_priorities(site)
      priorities = {
        '/' => 1.0,
        '/terminal/' => 0.9,
        '/about/' => 0.8
      }
      
      # Add post priorities
      site.posts.docs.each do |post|
        priorities[post.url] = 0.7
      end
      
      # Add page priorities
      site.pages.each do |page|
        url = page.url
        next if url == '/' || priorities.key?(url)
        
        priority = case url
        when /terminal/
          0.9
        when /about|contact/
          0.8
        else
          0.6
        end
        
        priorities[url] = priority
      end
      
      priorities
    end

    def extract_keywords(site, terminal_data, companies_data)
      keywords = []
      
      # From site config
      if site.config['keywords']
        keywords.concat(site.config['keywords'].split(',').map(&:strip))
      end
      
      # From skills
      if terminal_data['skills']
        terminal_data['skills'].values.flatten.each do |skill|
          keywords << skill.to_s
        end
      end
      
      # From companies
      if companies_data['companies']
        companies_data['companies'].each do |company|
          keywords << company['industry'] if company['industry']
          keywords.concat(company['technologies'] || [])
        end
      end
      
      keywords.uniq.join(', ')
    end

    def extract_social_links(terminal_data)
      links = []
      
      if terminal_data['links']
        terminal_data['links'].each do |link|
          links << link['url'] if link['url']
        end
      end
      
      links
    end

    def extract_skills(terminal_data)
      skills = []
      
      if terminal_data['skills']
        terminal_data['skills'].values.flatten.each do |skill|
          skills << skill.to_s
        end
      end
      
      skills
    end
  end
end

