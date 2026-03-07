#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "time"
require "yaml"

REPO_ROOT = File.expand_path("..", __dir__)
TIMEZONE = ENV.fetch("PUBLISH_TIMEZONE", "UTC")
TARGET_GLOB = "**/*.{md,html}"
SKIP_DIRS = %w[
  .git
  .github
  .jekyll-cache
  _site
  admin
  assets
].freeze

def extract_front_matter(content)
  return nil unless content.start_with?("---\n")

  match = content.match(/\A---\s*\n(.*?)\n---\s*\n?/m)
  return nil unless match

  {
    raw_front_matter: match[1],
    body: content[match.end(0)..] || ""
  }
end

def skip_path?(path)
  segments = path.split(File::SEPARATOR)
  segments.any? { |segment| SKIP_DIRS.include?(segment) }
end

def parse_publish_time(value)
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

def set_top_level_key(front_matter, key, value)
  key_line = /^#{Regexp.escape(key)}:\s*.*$/

  if front_matter.match?(key_line)
    front_matter.sub(key_line, "#{key}: #{value}")
  else
    "#{front_matter.rstrip}\n#{key}: #{value}\n"
  end
end

ENV["TZ"] = TIMEZONE
now = Time.now
published_paths = []

Dir.chdir(REPO_ROOT) do
  Dir.glob(TARGET_GLOB).sort.each do |path|
    next unless File.file?(path)
    next if skip_path?(path)

    source = File.read(path)
    parsed_content = extract_front_matter(source)
    next unless parsed_content

    raw_front_matter = parsed_content[:raw_front_matter]
    front_matter = YAML.safe_load(raw_front_matter, permitted_classes: [Date, Time], aliases: true)
    next unless front_matter.is_a?(Hash)

    published = front_matter.fetch("published", true)
    publish_at = front_matter["publish_at"]

    next unless published == false && publish_at

    publish_time = parse_publish_time(publish_at)
    next unless publish_time && publish_time <= now

    updated_front_matter = set_top_level_key(raw_front_matter, "published", "true")
    updated_front_matter = set_top_level_key(updated_front_matter, "published_at", now.iso8601)

    next if updated_front_matter == raw_front_matter

    updated_source = +"---\n"
    updated_source << updated_front_matter
    updated_source << "---\n"
    updated_source << parsed_content[:body]

    File.write(path, updated_source)
    published_paths << path
  end
end

if published_paths.empty?
  puts "No scheduled entries to publish."
else
  puts "Published #{published_paths.length} scheduled entr#{published_paths.length == 1 ? "y" : "ies"}:"
  published_paths.each { |path| puts " - #{path}" }
end
