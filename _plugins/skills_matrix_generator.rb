# frozen_string_literal: true

module Jekyll
  class SkillsMatrixGenerator < Generator
    safe true
    priority :high

    def generate(site)
      @site = site
      terminal_data = site.data['terminal']
      return unless terminal_data && terminal_data['skills']

      skills = terminal_data['skills']
      matrix = {
        'categories' => {},
        'proficiency_levels' => {
          'expert' => [],
          'advanced' => [],
          'intermediate' => [],
          'beginner' => []
        },
        'technology_tree' => {},
        'skill_combinations' => [],
        'generated_at' => Time.now.strftime('%Y-%m-%d %H:%M:%S UTC')
      }

      # Process each skill category
      skills.each do |category, items|
        next unless items.is_a?(Array)
        
        matrix['categories'][category] = {
          'count' => items.length,
          'skills' => items.map do |skill|
            {
              'name' => skill,
              'category' => category,
              'proficiency' => calculate_proficiency(skill, category, terminal_data),
              'years_experience' => estimate_experience(skill, terminal_data)
            }
          end
        }
        
        # Categorize by proficiency
        matrix['categories'][category]['skills'].each do |skill_data|
          proficiency = skill_data['proficiency']
          matrix['proficiency_levels'][proficiency] << {
            'name' => skill_data['name'],
            'category' => category
          }
        end
      end

      # Build technology tree (relationships between technologies)
      matrix['technology_tree'] = build_technology_tree(skills, terminal_data, site)
      
      # Find skill combinations (technologies often used together)
      matrix['skill_combinations'] = find_skill_combinations(terminal_data, site)

      # Write to data file
      data_dir = File.join(site.source, '_data')
      FileUtils.mkdir_p(data_dir)
      
      data_file = File.join(data_dir, 'skills_matrix.yml')
      File.write(data_file, matrix.to_yaml)
      
      total_skills = skills.values.flatten.length
      Jekyll.logger.info "Skills Matrix:", "Generated matrix for #{total_skills} skills"
    end

    private

    def calculate_proficiency(skill, category, terminal_data)
      # Determine proficiency based on:
      # 1. Category importance
      # 2. Mention in experience/achievements
      # 3. Years of experience
      
      experience = terminal_data['experience'] || []
      projects = terminal_data['projects'] || []
      
      # Check if skill is mentioned in experience
      mentioned_count = 0
      experience.each do |exp|
        achievements = exp['achievements'] || []
        achievements.each do |achievement|
          mentioned_count += 1 if achievement.downcase.include?(skill.downcase)
        end
      end
      
      projects.each do |project|
        tech = project['technologies'] || ''
        mentioned_count += 1 if tech.downcase.include?(skill.downcase)
      end
      
      # Determine proficiency level
      if mentioned_count >= 3 || category == 'programming_languages'
        'expert'
      elsif mentioned_count >= 2 || category == 'frameworks'
        'advanced'
      elsif mentioned_count >= 1
        'intermediate'
      else
        'beginner'
      end
    end

    def estimate_experience(skill, terminal_data)
      # Estimate years of experience based on:
      # - When skill first appears in experience
      # - How frequently it's mentioned
      
      experience = terminal_data['experience'] || []
      companies = site.data['companies'] || {}
      companies_list = companies['companies'] || []
      
      first_mention = nil
      experience.each do |exp|
        period = exp['period'] || ''
        achievements = exp['achievements'] || []
        
        achievements.each do |achievement|
          if achievement.downcase.include?(skill.downcase)
            # Extract year from period
            year_match = period.match(/(\d{4})/)
            if year_match
              year = year_match[1].to_i
              first_mention = year if first_mention.nil? || year < first_mention
            end
          end
        end
      end
      
      if first_mention
        current_year = Time.now.year
        years = current_year - first_mention
        return [years, 0].max
      end
      
      # Default based on category
      case skill
      when /Python|JavaScript|PHP/
        7 # Core languages, likely longest experience
      when /React|Node\.js|Django|Laravel/
        5 # Frameworks
      when /Docker|Kubernetes|AWS/
        4 # DevOps tools
      else
        3 # Other technologies
      end
    end

    def build_technology_tree(skills, terminal_data, site)
      tree = {}
      
      # Define technology relationships
      relationships = {
        'JavaScript' => ['React', 'Node.js', 'Express.js', 'TypeScript'],
        'Python' => ['Django', 'Flask', 'NumPy', 'Pandas', 'TensorFlow'],
        'PHP' => ['Laravel', 'CodeIgniter'],
        'Node.js' => ['Express.js', 'React'],
        'React' => ['JavaScript', 'TypeScript'],
        'Docker' => ['Kubernetes', 'AWS'],
        'PostgreSQL' => ['MySQL', 'MongoDB']
      }
      
      all_skills = skills.values.flatten
      
      all_skills.each do |skill|
        tree[skill] = {
          'related' => [],
          'dependencies' => [],
          'used_with' => []
        }
        
        # Find related technologies
        relationships.each do |key, related|
          if skill == key
            tree[skill]['related'] = related.select { |r| all_skills.include?(r) }
          elsif related.include?(skill)
            tree[skill]['dependencies'] << key if all_skills.include?(key)
          end
        end
        
        # Find technologies used together in projects
        projects = terminal_data['projects'] || []
        projects.each do |project|
          tech = project['technologies'] || ''
          if tech.include?(skill)
            tech.split(',').each do |other_tech|
              other_tech = other_tech.strip
              if other_tech != skill && all_skills.include?(other_tech) && !tree[skill]['used_with'].include?(other_tech)
                tree[skill]['used_with'] << other_tech
              end
            end
          end
        end
      end
      
      tree
    end

    def find_skill_combinations(terminal_data, site)
      combinations = []
      
      # Analyze projects to find common technology stacks
      projects = terminal_data['projects'] || []
      stacks = {}
      
      projects.each do |project|
        tech = project['technologies'] || ''
        tech_list = tech.split(',').map(&:strip).sort
        stack_key = tech_list.join(' + ')
        
        stacks[stack_key] ||= {
          'technologies' => tech_list,
          'count' => 0,
          'projects' => []
        }
        stacks[stack_key]['count'] += 1
        stacks[stack_key]['projects'] << project['name']
      end
      
      # Return top combinations
      stacks.values
        .sort_by { |s| -s['count'] }
        .first(10)
        .each do |stack|
          combinations << {
            'technologies' => stack['technologies'],
            'frequency' => stack['count'],
            'projects' => stack['projects']
          }
        end
      
      combinations
    end
  end
end

