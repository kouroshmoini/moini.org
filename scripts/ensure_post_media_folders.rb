#!/usr/bin/env ruby
# frozen_string_literal: true

require "fileutils"
require "date"
require "yaml"

REPO_ROOT = File.expand_path("..", __dir__)
UPLOADS_DIR = "assets/uploads"

def extract_front_matter(content)
  return nil unless content.start_with?("---\n")

  match = content.match(/\A---\s*\n(.*?)\n---\s*\n?/m)
  return nil unless match

  {
    raw_front_matter: match[1],
    body: content[match.end(0)..] || ""
  }
end

def set_top_level_key(front_matter, key, value)
  key_line = /^#{Regexp.escape(key)}:\s*.*$/

  if front_matter.match?(key_line)
    front_matter.sub(key_line, "#{key}: #{value}")
  else
    "#{front_matter.rstrip}\n#{key}: #{value}\n"
  end
end

changed_posts = ARGV.empty? ? Dir.glob("_posts/*.md").sort : ARGV
updated_posts = []
updated_folders = []

Dir.chdir(REPO_ROOT) do
  changed_posts.each do |post_path|
    next unless post_path.start_with?("_posts/")
    next unless File.file?(post_path)

    source = File.read(post_path)
    parsed_content = extract_front_matter(source)
    next unless parsed_content

    begin
      front_matter = YAML.safe_load(parsed_content[:raw_front_matter], permitted_classes: [Date, Time], aliases: true)
    rescue Psych::SyntaxError => e
      warn "Skipping #{post_path}: invalid front matter (#{e.message.lines.first&.strip})"
      next
    end
    next unless front_matter.is_a?(Hash)

    current_folder = front_matter["media_folder"].to_s.strip
    upload_root = "/#{UPLOADS_DIR}/"
    next if current_folder.start_with?(upload_root) && current_folder != "#{upload_root}no-title"

    # A post's filename is stable when its title is edited in Pages CMS.
    folder = File.basename(post_path, ".md").downcase.gsub(/[^a-z0-9-]+/, "-")
    next unless folder.match?(/\A[a-z0-9][a-z0-9-]*\z/)

    repo_folder = File.join(UPLOADS_DIR, folder)
    FileUtils.mkdir_p(repo_folder)
    gitkeep_path = File.join(repo_folder, ".gitkeep")
    FileUtils.touch(gitkeep_path) unless File.exist?(gitkeep_path)
    updated_folders << repo_folder

    front_matter = set_top_level_key(parsed_content[:raw_front_matter], "media_folder", "#{upload_root}#{folder}")
    updated_source = "---\n#{front_matter.rstrip}\n---\n#{parsed_content[:body]}"

    next if updated_source == source

    File.write(post_path, updated_source)
    updated_posts << post_path
  end
end

if updated_posts.empty? && updated_folders.empty?
  puts "No post media folder changes needed."
else
  puts "Ensured media folders:"
  updated_folders.uniq.sort.each { |path| puts " - #{path}" }

  unless updated_posts.empty?
    puts "Updated post media_folder metadata:"
    updated_posts.uniq.sort.each { |path| puts " - #{path}" }
  end
end
