#!/usr/bin/env ruby
# frozen_string_literal: true

# Favicon Generator
# Generates all required favicon sizes from SVG source
# Requires ImageMagick or similar tool

require 'fileutils'
require 'json'

class FaviconGenerator
  SIZES = {
    # Standard favicons
    'favicon-16x16.png' => 16,
    'favicon-32x32.png' => 32,
    'favicon-48x48.png' => 48,
    'favicon-64x64.png' => 64,
    'favicon-96x96.png' => 96,
    'favicon-128x128.png' => 128,
    'favicon-192x192.png' => 192,
    'favicon-256x256.png' => 256,
    # Apple touch icons
    'apple-touch-icon-57x57.png' => 57,
    'apple-touch-icon-72x72.png' => 72,
    'apple-touch-icon-76x76.png' => 76,
    'apple-touch-icon-114x114.png' => 114,
    'apple-touch-icon-120x120.png' => 120,
    'apple-touch-icon-144x144.png' => 144,
    'apple-touch-icon-152x152.png' => 152,
    'apple-touch-icon-180x180.png' => 180,
    # Android icons
    'android-chrome-144x144.png' => 144,
    'android-chrome-192x192.png' => 192,
    # Windows tiles
    'mstile-144x144.png' => 144,
    'mstile-270x270.png' => 270
  }.freeze

  def initialize(source_svg, output_dir)
    @source_svg = source_svg
    @output_dir = output_dir
    @errors = []
  end

  def generate_all
    puts "Generating favicons from #{@source_svg}..."
    puts "=" * 60

    # Create output directory
    FileUtils.mkdir_p(@output_dir)

    # Check if ImageMagick is available
    unless system('which convert > /dev/null 2>&1')
      puts "⚠️  ImageMagick not found. Using fallback method..."
      generate_fallback
      return
    end

    # Generate all sizes
    SIZES.each do |filename, size|
      output_path = File.join(@output_dir, filename)
      generate_size(size, output_path)
    end

    # Generate favicon.ico (multi-resolution)
    generate_ico

    # Generate web manifest
    generate_web_manifest

    puts "\n" + "=" * 60
    puts "✅ Favicon generation complete!"
    puts "Output directory: #{@output_dir}"
  end

  def generate_size(size, output_path)
    begin
      cmd = "convert #{@source_svg} -resize #{size}x#{size} -background none #{output_path}"
      system(cmd)
      if $?.success?
        puts "  ✅ Generated #{File.basename(output_path)} (#{size}x#{size})"
      else
        raise "Command failed: #{cmd}"
      end
    rescue => e
      error_msg = "Failed to generate #{File.basename(output_path)}: #{e.message}"
      puts "  ❌ #{error_msg}"
      @errors << error_msg
    end
  end

  def generate_ico
    # Create multi-resolution ICO from multiple PNG sizes
    ico_path = File.join(@output_dir, 'favicon.ico')
    sizes_for_ico = [16, 32, 48]
    
    begin
      png_files = sizes_for_ico.map { |s| File.join(@output_dir, "favicon-#{s}x#{s}.png") }
      cmd = "convert #{png_files.join(' ')} #{ico_path}"
      system(cmd)
      if $?.success?
        puts "  ✅ Generated favicon.ico (multi-resolution)"
      else
        # Fallback: just use 32x32
        system("convert #{File.join(@output_dir, 'favicon-32x32.png')} #{ico_path}")
        puts "  ✅ Generated favicon.ico (32x32)"
      end
    rescue => e
      puts "  ⚠️  Could not generate ICO: #{e.message}"
    end
  end

  def generate_fallback
    # Fallback: Copy SVG as favicon (browsers will handle it)
    puts "  ⚠️  Using SVG as favicon (ImageMagick not available)"
    puts "  💡 Install ImageMagick for full favicon generation: brew install imagemagick"
    
    # Create a simple fallback
    FileUtils.cp(@source_svg, File.join(@output_dir, 'favicon.svg'))
  end

  def generate_web_manifest
    manifest_path = File.join(__dir__, '..', 'site.webmanifest')
    manifest = {
      "name" => "Lead Software Engineer Portfolio",
      "short_name" => "OYI Portfolio",
      "icons" => [
        {
          "src" => "/assets/images/favicons/android-chrome-192x192.png",
          "sizes" => "192x192",
          "type" => "image/png"
        },
        {
          "src" => "/assets/images/favicons/android-chrome-144x144.png",
          "sizes" => "144x144",
          "type" => "image/png"
        }
      ],
      "theme_color" => "#0d0d0d",
      "background_color" => "#0d0d0d",
      "display" => "standalone",
      "start_url" => "/"
    }

    File.write(manifest_path, JSON.pretty_generate(manifest))
    puts "  ✅ Generated site.webmanifest"
  end
end

# Main execution
if __FILE__ == $0
  source_svg = File.join(__dir__, '..', 'assets', 'images', 'favicon-source.svg')
  output_dir = File.join(__dir__, '..', 'assets', 'images', 'favicons')

  unless File.exist?(source_svg)
    puts "❌ Source SVG not found: #{source_svg}"
    exit 1
  end

  generator = FaviconGenerator.new(source_svg, output_dir)
  generator.generate_all

  exit(generator.instance_variable_get(:@errors).empty? ? 0 : 1)
end

