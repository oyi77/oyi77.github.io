# frozen_string_literal: true

module Jekyll
  class AssetOptimizer < Generator
    safe true
    priority :low

    def generate(site)
      return unless site.config['asset_optimization'] != false
      
      optimize_css(site)
      optimize_js(site)
      generate_critical_css(site)
      
      Jekyll.logger.info "Asset Optimizer:", "Optimized assets"
    end

    private

    def optimize_css(site)
      css_dir = File.join(site.source, 'assets', 'css')
      return unless File.directory?(css_dir)
      
      Dir.glob(File.join(css_dir, '*.css')).each do |css_file|
        next if css_file.include?('.min.')
        
        content = File.read(css_file)
        optimized = minify_css(content)
        
        # Write minified version
        min_file = css_file.sub('.css', '.min.css')
        File.write(min_file, optimized)
        
        Jekyll.logger.debug "Asset Optimizer:", "Minified #{File.basename(css_file)}"
      end
    end

    def optimize_js(site)
      js_dir = File.join(site.source, 'assets', 'js')
      return unless File.directory?(js_dir)
      
      # Only optimize if we have a minifier available
      # For now, we'll just create a placeholder
      Jekyll.logger.debug "Asset Optimizer:", "JS optimization skipped (requires external tool)"
    end

    def generate_critical_css(site)
      # Generate critical CSS for above-the-fold content
      # This is a simplified version
      css_dir = File.join(site.source, 'assets', 'css')
      return unless File.directory?(css_dir)
      
      terminal_css = File.join(css_dir, 'terminal.css')
      return unless File.exist?(terminal_css)
      
      content = File.read(terminal_css)
      
      # Extract critical CSS (simplified - in production, use a proper tool)
      critical = extract_critical_css(content)
      
      critical_file = File.join(css_dir, 'critical.css')
      File.write(critical_file, critical)
      
      Jekyll.logger.debug "Asset Optimizer:", "Generated critical.css"
    end

    def minify_css(css)
      # Basic CSS minification
      css
        .gsub(/\/\*.*?\*\//m, '') # Remove comments
        .gsub(/\s+/, ' ') # Collapse whitespace
        .gsub(/\s*\{\s*/, '{') # Remove spaces around braces
        .gsub(/\s*\}\s*/, '}')
        .gsub(/\s*;\s*/, ';') # Remove spaces around semicolons
        .gsub(/\s*:\s*/, ':') # Remove spaces around colons
        .gsub(/\s*,\s*/, ',') # Remove spaces around commas
        .strip
    end

    def extract_critical_css(css)
      # Extract critical CSS rules
      # This is a simplified version - in production, use a tool like critical
      
      critical_rules = []
      
      # Extract :root variables (always critical)
      css.scan(/:root\s*\{[^}]*\}/m) do |match|
        critical_rules << match
      end
      
      # Extract body and html rules
      css.scan(/(?:body|html|\.terminal-wrapper|\.terminal-container)\s*\{[^}]*\}/m) do |match|
        critical_rules << match
      end
      
      critical_rules.join("\n")
    end
  end
end

