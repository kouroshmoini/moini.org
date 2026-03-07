#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "time"
require "yaml"

REPO_ROOT = File.expand_path("..", __dir__)
POST_GLOB = "_posts/*.md"
REDIRECT_GLOB = "_redirects/*.{md,markdown,html}"
PAGE_FILES = ["index.html", "about/index.html"].freeze

def read_front_matter(path)
  source = File.read(path)
  return {} unless source.start_with?("---\n")

  match = source.match(/\A---\s*\n(.*?)\n---\s*\n?/m)
  return {} unless match

  data = YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true)
  data.is_a?(Hash) ? data : {}
end

def boolean?(value)
  value == true || value == false
end

def parse_time(value)
  case value
  when Time
    value
  when Date
    value.to_time
  else
    Time.parse(value.to_s)
  end
rescue ArgumentError, TypeError
  nil
end

def post_slug_from_filename(path)
  filename = File.basename(path, ".md")
  filename.sub(/^\d{4}-\d{2}-\d{2}-/, "")
end

def valid_slug?(value)
  !!(value.to_s =~ /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/)
end

def valid_path?(value)
  value.is_a?(String) && value.start_with?("/")
end

errors = []

Dir.chdir(REPO_ROOT) do
  Dir.glob(POST_GLOB).sort.each do |path|
    data = read_front_matter(path)
    slug = data["slug"]

    errors << "#{path}: missing required 'title'" if data["title"].to_s.strip.empty?
    errors << "#{path}: missing required 'date'" if data["date"].to_s.strip.empty?
    errors << "#{path}: missing required 'slug'" if slug.to_s.strip.empty?

    unless slug.to_s.strip.empty?
      errors << "#{path}: invalid slug '#{slug}'" unless valid_slug?(slug)
      expected_slug = post_slug_from_filename(path)
      if slug != expected_slug
        errors << "#{path}: slug '#{slug}' does not match filename slug '#{expected_slug}'"
      end
    end

    if data.key?("published") && !boolean?(data["published"])
      errors << "#{path}: 'published' must be boolean"
    end

    if data.key?("noindex") && !boolean?(data["noindex"])
      errors << "#{path}: 'noindex' must be boolean"
    end

    if data.key?("publish_at") && data["publish_at"] && parse_time(data["publish_at"]).nil?
      errors << "#{path}: 'publish_at' is not a valid date/time"
    end
  end

  PAGE_FILES.each do |path|
    next unless File.file?(path)

    data = read_front_matter(path)
    if data.key?("published") && !boolean?(data["published"])
      errors << "#{path}: 'published' must be boolean"
    end

    if data.key?("noindex") && !boolean?(data["noindex"])
      errors << "#{path}: 'noindex' must be boolean"
    end

    if data.key?("publish_at") && data["publish_at"] && parse_time(data["publish_at"]).nil?
      errors << "#{path}: 'publish_at' is not a valid date/time"
    end
  end

  Dir.glob(REDIRECT_GLOB).sort.each do |path|
    data = read_front_matter(path)
    errors << "#{path}: missing required 'layout: redirect'" unless data["layout"] == "redirect"

    unless valid_path?(data["permalink"])
      errors << "#{path}: 'permalink' must start with /"
    end

    redirect_to = data["redirect_to"]
    if redirect_to.to_s.strip.empty?
      errors << "#{path}: missing required 'redirect_to'"
    end
  end
end

if errors.empty?
  puts "Content validation passed."
  exit 0
end

puts "Content validation failed:"
errors.each { |error| puts " - #{error}" }
exit 1
