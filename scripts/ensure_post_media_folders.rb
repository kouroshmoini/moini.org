#!/usr/bin/env ruby
# frozen_string_literal: true

require "fileutils"
require "date"
require "yaml"

REPO_ROOT = File.expand_path("..", __dir__)
UPLOADS_DIR = "assets/uploads"
DEFAULT_FOLDER = "new-post"

def extract_front_matter(content)
  return nil unless content.start_with?("---\n")

  match = content.match(/\A---\s*\n(.*?)\n---\s*\n?/m)
  return nil unless match

  {
    raw_front_matter: match[1],
    body: content[match.end(0)..] || ""
  }
end

def slugify(value)
  slug = value.to_s.strip.downcase
  slug = slug.gsub("&", " and ")
  slug = slug.gsub(/[^\p{Alnum}]+/, "-")
  slug = slug.gsub(/\A-+|-+\z/, "")
  slug.empty? ? DEFAULT_FOLDER : slug
end

def set_top_level_key(front_matter, key, value)
  key_line = /^#{Regexp.escape(key)}:\s*.*$/

  if front_matter.match?(key_line)
    front_matter.sub(key_line, "#{key}: #{value}")
  else
    "#{front_matter.rstrip}\n#{key}: #{value}\n"
  end
end

def merge_or_move_folder(source, destination)
  return unless Dir.exist?(source)

  FileUtils.mkdir_p(destination)

  Dir.children(source).each do |entry|
    FileUtils.mv(File.join(source, entry), File.join(destination, entry))
  end

  FileUtils.rm_rf(source)
end

def public_upload_path(folder)
  "/#{UPLOADS_DIR}/#{folder}"
end

def repo_upload_path(folder)
  "#{UPLOADS_DIR}/#{folder}"
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

    title = front_matter["title"]
    desired_folder = slugify(title)
    desired_public_path = public_upload_path(desired_folder)
    desired_repo_path = repo_upload_path(desired_folder)

    previous_public_paths = [public_upload_path(DEFAULT_FOLDER)]
    previous_media_folder = front_matter["media_folder"].to_s.strip
    previous_public_paths << previous_media_folder if previous_media_folder.start_with?("/#{UPLOADS_DIR}/")
    previous_public_paths.uniq!

    previous_public_paths.each do |previous_public_path|
      next if previous_public_path == desired_public_path

      previous_folder = previous_public_path.sub(%r{\A/#{Regexp.escape(UPLOADS_DIR)}/}, "")
      previous_repo_path = repo_upload_path(previous_folder)
      next unless previous_folder.match?(/\A[a-z0-9][a-z0-9-]*\z/)

      merge_or_move_folder(previous_repo_path, desired_repo_path)
    end

    FileUtils.mkdir_p(desired_repo_path)
    gitkeep_path = File.join(desired_repo_path, ".gitkeep")
    FileUtils.touch(gitkeep_path) unless File.exist?(gitkeep_path)
    updated_folders << desired_repo_path

    updated_front_matter = set_top_level_key(parsed_content[:raw_front_matter], "media_folder", desired_public_path)
    updated_body = parsed_content[:body].dup

    previous_public_paths.each do |previous_public_path|
      next if previous_public_path == desired_public_path

      updated_front_matter = updated_front_matter.gsub("#{previous_public_path}/", "#{desired_public_path}/")
      updated_body = updated_body.gsub("#{previous_public_path}/", "#{desired_public_path}/")

      previous_repo_path = previous_public_path.sub(%r{\A/}, "")
      updated_front_matter = updated_front_matter.gsub("#{previous_repo_path}/", "#{desired_repo_path}/")
      updated_body = updated_body.gsub("#{previous_repo_path}/", "#{desired_repo_path}/")
    end

    updated_source = +"---\n"
    updated_source << updated_front_matter
    updated_source << "---\n"
    updated_source << updated_body

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
