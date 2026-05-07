#!/usr/bin/env ruby
# frozen_string_literal: true

require "fileutils"
require "date"
require "open3"
require "yaml"

REPO_ROOT = File.expand_path("..", __dir__)
UPLOADS_DIR = "assets/uploads"
BASE_SHA = ENV["DELETED_POST_BASE_SHA"].to_s.strip

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
  slug
end

def git_show(ref, path)
  stdout, stderr, status = Open3.capture3("git", "show", "#{ref}:#{path}")
  return stdout if status.success?

  warn "Skipping #{path}: could not read deleted file from #{ref} (#{stderr.lines.first&.strip})"
  nil
end

def first_upload_folder(path)
  match = path.match(%r{(?:\A|/)#{Regexp.escape(UPLOADS_DIR)}/([^/\s)'")]+)})
  return nil unless match

  match[1]
end

def folder_safe?(folder)
  folder.match?(/\A[a-z0-9][a-z0-9-]*\z/)
end

def remaining_content_references?(folder)
  needle = "#{UPLOADS_DIR}/#{folder}"
  public_needle = "/#{needle}"
  paths = Dir.glob("**/*.{md,html,yml,yaml,json,liquid}").reject do |path|
    path.start_with?(".git/", "_site/", ".jekyll-cache/", UPLOADS_DIR)
  end

  paths.any? do |path|
    next false unless File.file?(path)

    source = File.read(path)
    source.include?(needle) || source.include?(public_needle)
  end
end

deleted_posts = ARGV
removed_folders = []
skipped_folders = []

if BASE_SHA.empty?
  warn "DELETED_POST_BASE_SHA is required."
  exit 1
end

Dir.chdir(REPO_ROOT) do
  deleted_posts.each do |post_path|
    next unless post_path.start_with?("_posts/")

    source = git_show(BASE_SHA, post_path)
    next unless source

    candidates = []
    parsed_content = extract_front_matter(source)

    if parsed_content
      begin
        front_matter = YAML.safe_load(parsed_content[:raw_front_matter], permitted_classes: [Date, Time], aliases: true)
      rescue Psych::SyntaxError => e
        warn "Skipping front matter for #{post_path}: invalid YAML (#{e.message.lines.first&.strip})"
        front_matter = {}
      end

      if front_matter.is_a?(Hash)
        media_folder = front_matter["media_folder"].to_s.strip
        candidates << first_upload_folder(media_folder) if media_folder.start_with?("/#{UPLOADS_DIR}/")

        title_slug = slugify(front_matter["title"])
        candidates << title_slug unless title_slug.empty?
      end
    end

    file_slug = File.basename(post_path, ".md").sub(/\A\d{4}-\d{2}-\d{2}-/, "")
    candidates << file_slug unless file_slug.empty?
    candidates.concat(source.scan(%r{/#{Regexp.escape(UPLOADS_DIR)}/([a-z0-9][a-z0-9-]*)/}).flatten)
    candidates.concat(source.scan(%r{#{Regexp.escape(UPLOADS_DIR)}/([a-z0-9][a-z0-9-]*)/}).flatten)

    candidates.compact.uniq.each do |folder|
      next unless folder_safe?(folder)

      repo_path = File.join(UPLOADS_DIR, folder)
      next unless Dir.exist?(repo_path)

      if remaining_content_references?(folder)
        skipped_folders << repo_path
        next
      end

      FileUtils.rm_rf(repo_path)
      removed_folders << repo_path
    end
  end
end

if removed_folders.empty? && skipped_folders.empty?
  puts "No deleted post media folders to remove."
else
  unless removed_folders.empty?
    puts "Removed media folders for deleted posts:"
    removed_folders.uniq.sort.each { |path| puts " - #{path}" }
  end

  unless skipped_folders.empty?
    puts "Skipped media folders still referenced by remaining content:"
    skipped_folders.uniq.sort.each { |path| puts " - #{path}" }
  end
end
