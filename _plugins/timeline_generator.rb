# frozen_string_literal: true

module Jekyll
  class TimelineGenerator < Generator
    safe true
    priority :high

    def generate(site)
      companies_data = site.data['companies']
      terminal_data = site.data['terminal']
      
      timeline = {
        'events' => [],
        'summary' => {
          'total_duration_years' => 0,
          'total_companies' => 0,
          'total_team_members_led' => 0,
          'career_milestones' => []
        },
        'generated_at' => Time.now.strftime('%Y-%m-%d %H:%M:%S UTC')
      }

      # Process companies
      if companies_data && companies_data['companies']
        companies_data['companies'].each do |company|
          event = process_company_event(company)
          timeline['events'] << event if event
        end
      end

      # Process experience from terminal.yml
      if terminal_data && terminal_data['experience']
        terminal_data['experience'].each do |exp|
          event = process_experience_event(exp, companies_data)
          timeline['events'] << event if event
        end
      end

      # Sort events chronologically
      timeline['events'].sort_by! { |e| parse_date(e['start_date']) }

      # Calculate summary metrics
      timeline['summary'] = calculate_summary(timeline['events'])

      # Write to data file
      data_dir = File.join(site.source, '_data')
      FileUtils.mkdir_p(data_dir)
      
      data_file = File.join(data_dir, 'timeline.yml')
      File.write(data_file, timeline.to_yaml)
      
      Jekyll.logger.info "Timeline Generator:", "Generated timeline with #{timeline['events'].length} events"
    end

    private

    def process_company_event(company)
      period = company['period'] || ''
      start_date, end_date = parse_period(period)
      
      return nil unless start_date
      
      {
        'type' => 'company',
        'id' => company['id'],
        'name' => company['name'],
        'role' => company['role'],
        'start_date' => start_date,
        'end_date' => end_date,
        'duration_months' => calculate_duration_months(start_date, end_date),
        'duration_years' => calculate_duration_years(start_date, end_date),
        'location' => company['location'],
        'team_size' => parse_team_size(company['team_size']),
        'industry' => company['industry'],
        'key_metrics' => company['key_metrics'] || [],
        'achievements_count' => (company['achievements'] || []).length,
        'technologies' => company['technologies'] || []
      }
    end

    def process_experience_event(exp, companies_data)
      period = exp['period'] || ''
      start_date, end_date = parse_period(period)
      
      return nil unless start_date
      
      # Try to find matching company data
      company_data = nil
      if companies_data && companies_data['companies']
        company_data = companies_data['companies'].find { |c| c['name'] == exp['company'] }
      end
      
      {
        'type' => 'experience',
        'company' => exp['company'],
        'role' => exp['role'],
        'start_date' => start_date,
        'end_date' => end_date,
        'duration_months' => calculate_duration_months(start_date, end_date),
        'duration_years' => calculate_duration_years(start_date, end_date),
        'location' => exp['location'],
        'achievements_count' => (exp['achievements'] || []).length,
        'team_size' => company_data ? parse_team_size(company_data['team_size']) : nil
      }
    end

    def parse_period(period_str)
      return [nil, nil] unless period_str
      
      # Handle formats like "2019 - 2021", "December 2024 – Present", "January 2023 – January 2024"
      period_str = period_str.strip
      
      # Check for "Present"
      is_present = period_str.downcase.include?('present')
      
      # Extract dates
      dates = period_str.split(/[-–—]/).map(&:strip)
      
      start_str = dates[0]
      end_str = dates[1] || (is_present ? 'Present' : nil)
      
      start_date = parse_date_string(start_str)
      end_date = is_present ? nil : parse_date_string(end_str)
      
      [start_date, end_date]
    end

    def parse_date_string(date_str)
      return nil unless date_str
      
      date_str = date_str.strip
      
      # Handle "Present"
      return nil if date_str.downcase == 'present'
      
      # Try different date formats
      # Format: "December 2024", "Jan 2023", "2019", "January 2023"
      month_names = {
        'january' => 1, 'february' => 2, 'march' => 3, 'april' => 4,
        'may' => 5, 'june' => 6, 'july' => 7, 'august' => 8,
        'september' => 9, 'october' => 10, 'november' => 11, 'december' => 12,
        'jan' => 1, 'feb' => 2, 'mar' => 3, 'apr' => 4,
        'may' => 5, 'jun' => 6, 'jul' => 7, 'aug' => 8,
        'sep' => 9, 'oct' => 10, 'nov' => 11, 'dec' => 12
      }
      
      # Try "Month Year" format
      month_match = date_str.match(/(\w+)\s+(\d{4})/i)
      if month_match
        month_name = month_match[1].downcase
        year = month_match[2].to_i
        month = month_names[month_name] || 1
        return Date.new(year, month, 1)
      end
      
      # Try "Year" format
      year_match = date_str.match(/(\d{4})/)
      if year_match
        year = year_match[1].to_i
        return Date.new(year, 1, 1)
      end
      
      nil
    end

    def parse_date(date_obj)
      return Date.new(3000, 1, 1) if date_obj.nil? # Present dates go to end
      return date_obj if date_obj.is_a?(Date)
      
      if date_obj.is_a?(String)
        parsed = parse_date_string(date_obj)
        return parsed if parsed
      end
      
      Date.new(3000, 1, 1)
    end

    def calculate_duration_months(start_date, end_date)
      return nil unless start_date
      
      end_date ||= Date.today
      
      years = end_date.year - start_date.year
      months = end_date.month - start_date.month
      
      total_months = years * 12 + months
      total_months += 1 if end_date.day >= start_date.day # Round up if day is same or later
      
      total_months
    end

    def calculate_duration_years(start_date, end_date)
      months = calculate_duration_months(start_date, end_date)
      return nil unless months
      
      (months / 12.0).round(1)
    end

    def parse_team_size(team_size_str)
      return 0 unless team_size_str
      
      # Extract number from strings like "3000+", "50+", "15+"
      match = team_size_str.to_s.match(/(\d+)/)
      return match[1].to_i if match
      
      0
    end

    def calculate_summary(events)
      summary = {
        'total_duration_years' => 0,
        'total_companies' => 0,
        'total_team_members_led' => 0,
        'career_milestones' => []
      }
      
      total_months = 0
      companies = Set.new
      total_team = 0
      
      events.each do |event|
        # Calculate total duration
        if event['duration_months']
          total_months += event['duration_months']
        end
        
        # Count unique companies
        company_name = event['name'] || event['company']
        companies.add(company_name) if company_name
        
        # Sum team sizes
        if event['team_size'] && event['team_size'] > 0
          total_team += event['team_size']
        end
        
        # Identify milestones
        if event['team_size'] && event['team_size'] >= 100
          summary['career_milestones'] << {
            'date' => event['start_date'],
            'event' => "Led team of #{event['team_size']}+ at #{company_name}",
            'type' => 'leadership'
          }
        end
      end
      
      summary['total_duration_years'] = (total_months / 12.0).round(1)
      summary['total_companies'] = companies.length
      summary['total_team_members_led'] = total_team
      
      # Sort milestones by date
      summary['career_milestones'].sort_by! { |m| parse_date(m['date']) }
      
      summary
    end
  end
end

