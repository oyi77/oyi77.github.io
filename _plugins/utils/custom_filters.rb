# frozen_string_literal: true

module Jekyll
  module CustomFilters
    # Time ago filter - converts date to "X time ago" format
    def time_ago(date)
      return '' unless date
      
      date_obj = date.is_a?(String) ? Date.parse(date) : date
      return '' unless date_obj.is_a?(Date)
      
      now = Date.today
      days = (now - date_obj).to_i
      
      case days
      when 0
        'today'
      when 1
        'yesterday'
      when 2..30
        "#{days} days ago"
      when 31..365
        months = (days / 30.0).round
        "#{months} #{months == 1 ? 'month' : 'months'} ago"
      else
        years = (days / 365.0).round(1)
        "#{years} #{years == 1 ? 'year' : 'years'} ago"
      end
    end

    # Format currency - formats numbers as currency
    def format_currency(amount, currency = 'USD')
      return '' unless amount
      
      # Handle string amounts like "5B+ IDR"
      if amount.is_a?(String)
        return amount if amount.include?('+') || amount.include?('B') || amount.include?('M')
      end
      
      amount_num = amount.to_f
      
      case currency.upcase
      when 'USD'
        if amount_num >= 1_000_000
          "$#{(amount_num / 1_000_000).round(1)}M"
        elsif amount_num >= 1_000
          "$#{(amount_num / 1_000).round(1)}K"
        else
          "$#{amount_num.round(2)}"
        end
      when 'IDR'
        if amount_num >= 1_000_000_000
          "#{(amount_num / 1_000_000_000).round(1)}B IDR"
        elsif amount_num >= 1_000_000
          "#{(amount_num / 1_000_000).round(1)}M IDR"
        else
          "#{amount_num.round(0)} IDR"
        end
      else
        "#{amount_num.round(2)} #{currency}"
      end
    end

    # Truncate words - truncates text to specified number of words
    def truncate_words(text, count = 50)
      return '' unless text
      
      words = text.to_s.split(/\s+/)
      if words.length <= count
        text
      else
        words.first(count).join(' ') + '...'
      end
    end

    # Highlight code - simple syntax highlighting (basic implementation)
    def highlight_code(code, language = 'javascript')
      return '' unless code
      
      # This is a basic implementation
      # For full syntax highlighting, consider using Rouge or similar
      code.to_s
        .gsub(/\b(function|class|const|let|var|if|else|for|while|return|async|await)\b/, '<span class="keyword">\1</span>')
        .gsub(/(["'])(?:(?=(\\?))\2.)*?\1/, '<span class="string">\0</span>')
        .gsub(/\b\d+\b/, '<span class="number">\0</span>')
    end

    # Anonymize email - masks email address for privacy
    def anonymize_email(email)
      return '' unless email
      
      parts = email.to_s.split('@')
      return email if parts.length != 2
      
      username = parts[0]
      domain = parts[1]
      
      if username.length <= 2
        masked_username = username[0] + '*'
      else
        masked_username = username[0] + '*' * (username.length - 2) + username[-1]
      end
      
      "#{masked_username}@#{domain}"
    end

    # Group by category - groups array of items by a category field
    def group_by_category(items, category_key = 'category')
      return {} unless items.is_a?(Array)
      
      grouped = {}
      items.each do |item|
        category = item.is_a?(Hash) ? item[category_key] : item.send(category_key) rescue nil
        category ||= 'uncategorized'
        
        grouped[category] ||= []
        grouped[category] << item
      end
      
      grouped
    end

    # Sort by date - sorts array by date field
    def sort_by_date(items, date_key = 'date', order = 'desc')
      return [] unless items.is_a?(Array)
      
      sorted = items.sort_by do |item|
        date_str = item.is_a?(Hash) ? item[date_key] : item.send(date_key) rescue nil
        date = parse_date_for_sort(date_str)
        date || Date.new(1900, 1, 1)
      end
      
      order == 'asc' ? sorted : sorted.reverse
    end

    # Calculate percentage - calculates percentage value
    def calculate_percentage(part, total)
      return 0 unless part && total
      
      part_num = part.to_f
      total_num = total.to_f
      
      return 0 if total_num == 0
      
      ((part_num / total_num) * 100).round(1)
    end

    # Merge hashes - merges multiple hashes
    def merge_hashes(*hashes)
      result = {}
      hashes.each do |hash|
        next unless hash.is_a?(Hash)
        result.merge!(hash)
      end
      result
    end

    # Format duration - formats duration in months/years
    def format_duration(months)
      return '' unless months
      
      months_num = months.to_f
      
      if months_num < 12
        "#{months_num.round(0)} #{months_num == 1 ? 'month' : 'months'}"
      else
        years = (months_num / 12.0).round(1)
        "#{years} #{years == 1 ? 'year' : 'years'}"
      end
    end

    # Extract year from date string
    def extract_year(date_str)
      return nil unless date_str
      
      match = date_str.to_s.match(/(\d{4})/)
      match ? match[1].to_i : nil
    end

    # Count items in array
    def count_items(array)
      array.is_a?(Array) ? array.length : 0
    end

    # Get top N items
    def top_items(array, count = 5, sort_key = nil)
      return [] unless array.is_a?(Array)
      
      sorted = if sort_key
        array.sort_by { |item| item.is_a?(Hash) ? item[sort_key].to_i : 0 }.reverse
      else
        array
      end
      
      sorted.first(count)
    end

    private

    def parse_date_for_sort(date_str)
      return nil unless date_str
      
      # Try to parse various date formats
      if date_str.is_a?(Date) || date_str.is_a?(Time)
        return date_str.to_date
      end
      
      # Try ISO format
      begin
        return Date.parse(date_str.to_s)
      rescue
        # Try extracting year
        year_match = date_str.to_s.match(/(\d{4})/)
        return Date.new(year_match[1].to_i, 1, 1) if year_match
      end
      
      nil
    end
  end
end

Liquid::Template.register_filter(Jekyll::CustomFilters)

