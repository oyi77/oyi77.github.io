# frozen_string_literal: true

module Jekyll
  class DataCompressor < Generator
    safe true
    priority :low

    def generate(site)
      return unless site.config['data_compression'] != false
      
      compress_data_files(site)
      generate_compressed_versions(site)
      
      Jekyll.logger.info "Data Compressor:", "Compressed data files"
    end

    private

    def compress_data_files(site)
      data_dir = File.join(site.source, '_data')
      return unless File.directory?(data_dir)
      
      # Find large JSON/YAML files
      large_files = Dir.glob(File.join(data_dir, '*.{yml,yaml,json}')).select do |file|
        File.size(file) > 50_000 # Files larger than 50KB
      end
      
      large_files.each do |file|
        compress_file(file)
      end
    end

    def generate_compressed_versions(site)
      # Generate compressed versions for terminal use
      data_dir = File.join(site.source, '_data')
      return unless File.directory?(data_dir)
      
      terminal_data_files = ['terminal.yml', 'companies.yml', 'repository_stats.yml']
      
      terminal_data_files.each do |filename|
        file_path = File.join(data_dir, filename)
        next unless File.exist?(file_path)
        
        data = YAML.load_file(file_path)
        
        # Create compressed version (remove unnecessary whitespace, etc.)
        compressed = compress_yaml_data(data)
        
        compressed_file = File.join(data_dir, filename.sub('.yml', '.compressed.yml'))
        File.write(compressed_file, compressed.to_yaml)
      end
    end

    def compress_file(file_path)
      # Basic file compression (remove comments, extra whitespace)
      content = File.read(file_path)
      
      if file_path.end_with?('.yml', '.yaml')
        compressed = compress_yaml_string(content)
      elsif file_path.end_with?('.json')
        compressed = compress_json_string(content)
      else
        return
      end
      
      # Write compressed version
      compressed_path = file_path.sub(/\.(yml|yaml|json)$/, '.compressed.\1')
      File.write(compressed_path, compressed)
      
      original_size = File.size(file_path)
      compressed_size = File.size(compressed_path)
      ratio = ((1 - compressed_size.to_f / original_size) * 100).round(1)
      
      Jekyll.logger.debug "Data Compressor:", 
        "Compressed #{File.basename(file_path)}: #{ratio}% reduction"
    end

    def compress_yaml_string(yaml_content)
      # Remove comments and extra whitespace
      yaml_content
        .lines
        .reject { |line| line.strip.start_with?('#') && !line.strip.start_with?('#!') }
        .map(&:rstrip)
        .join("\n")
        .gsub(/\n{3,}/, "\n\n") # Collapse multiple newlines
    end

    def compress_json_string(json_content)
      require 'json'
      
      data = JSON.parse(json_content)
      JSON.generate(data)
    rescue
      json_content
    end

    def compress_yaml_data(data)
      # Remove empty values, nil values, and compress structure
      case data
      when Hash
        compressed = {}
        data.each do |key, value|
          compressed_value = compress_yaml_data(value)
          compressed[key] = compressed_value unless compressed_value.nil? || 
                           (compressed_value.is_a?(Hash) && compressed_value.empty?) ||
                           (compressed_value.is_a?(Array) && compressed_value.empty?)
        end
        compressed
      when Array
        data.map { |item| compress_yaml_data(item) }.compact
      else
        data
      end
    end
  end
end

