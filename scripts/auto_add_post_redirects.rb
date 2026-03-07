#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "digest"
require "fileutils"
require "open3"
require "time"
require "yaml"

REPO_ROOT = File.expand_path("..", __dir__)
POSTS_DIR = "_posts"
REDIRECTS_DIR = "_redirects"

def run_cmd(*cmd)
  output, status = Open3.capture2e(*cmd)
  [output, status.success?]
end

def front_matter_from(content)
  return {} unless content.start_with?("---\n")

  match = content.match(/\A---\s*\n(.*?)\n---\s*\n?/m)
  return {} unless match

  parsed = YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true)
  parsed.is_a?(Hash) ? parsed : {}
rescue Psych::SyntaxError
  {}
end

def parse_date(value)
  case value
  when Time
    value.to_date
  when Date
    value
  else
    Time.parse(value.to_s).to_date
  end
rescue ArgumentError, TypeError
  nil
end

def post_slug_from_path(path)
  filename = File.basename(path, File.extname(path))
  match = filename.match(/^\d{4}-\d{2}-\d{2}-(.+)$/)
  match ? match[1] : filename
end

def date_from_filename(path)
  filename = File.basename(path, File.extname(path))
  match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-/)
  return nil unless match

  Date.new(match[1].to_i, match[2].to_i, match[3].to_i)
rescue Date::Error
  nil
end

def build_post_url(path, front_matter)
  slug = post_slug_from_path(path)
  date = parse_date(front_matter["date"]) || date_from_filename(path)
  return nil unless date && slug && !slug.empty?

  format("/%<y>04d/%<m>02d/%<d>02d/%<slug>s/", y: date.year, m: date.month, d: date.day, slug: slug)
end

def write_redirect(old_url, new_url)
  FileUtils.mkdir_p(REDIRECTS_DIR)
  digest = Digest::SHA1.hexdigest(old_url)[0, 16]
  path = File.join(REDIRECTS_DIR, "auto-#{digest}.md")
  content = <<~EOF
    ---
    layout: redirect
    permalink: #{old_url}
    redirect_to: #{new_url}
    ---
  EOF

  return false if File.exist?(path) && File.read(path) == content

  File.write(path, content)
  true
end

def resolve_range
  env_range = ENV["REDIRECT_DIFF_RANGE"].to_s.strip
  return "HEAD~1..HEAD" if env_range.empty? || env_range.start_with?("0000000000000000000000000000000000000000")

  env_range
end

Dir.chdir(REPO_ROOT) do
  range = resolve_range
  from_ref, to_ref = range.split("..", 2)
  to_ref = "HEAD" if to_ref.nil? || to_ref.empty?

  diff_output, diff_ok = run_cmd("git", "diff", "--name-status", "--find-renames", range, "--", POSTS_DIR)
  unless diff_ok
    puts "Could not inspect post changes for range #{range}."
    exit 0
  end

  changes = []
  diff_output.each_line do |line|
    parts = line.strip.split("\t")
    next if parts.empty?

    status = parts[0]
    old_path = nil
    new_path = nil

    if status.start_with?("R")
      old_path = parts[1]
      new_path = parts[2]
    elsif status == "M"
      old_path = parts[1]
      new_path = parts[1]
    else
      next
    end

    next unless old_path&.end_with?(".md") && new_path&.end_with?(".md")
    next unless old_path.start_with?("#{POSTS_DIR}/") && new_path.start_with?("#{POSTS_DIR}/")

    changes << [old_path, new_path]
  end

  if changes.empty?
    puts "No post URL changes detected."
    exit 0
  end

  created = 0
  changes.each do |old_path, new_path|
    old_content, old_ok = run_cmd("git", "show", "#{from_ref}:#{old_path}")
    next unless old_ok

    new_content =
      if File.file?(new_path)
        File.read(new_path)
      else
        content, ok = run_cmd("git", "show", "#{to_ref}:#{new_path}")
        next unless ok
        content
      end

    old_front_matter = front_matter_from(old_content)
    new_front_matter = front_matter_from(new_content)
    old_url = build_post_url(old_path, old_front_matter)
    new_url = build_post_url(new_path, new_front_matter)

    next unless old_url && new_url
    next if old_url == new_url

    created += 1 if write_redirect(old_url, new_url)
  end

  if created.zero?
    puts "No redirect files created."
  else
    puts "Created/updated #{created} redirect file(s)."
  end
end
