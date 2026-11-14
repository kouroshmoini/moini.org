#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "yaml"
require "uri"
require "json"

root = File.expand_path("..", __dir__)
errors = []
permalinks = {}

Dir.chdir(root) do
  Dir.glob("_posts/*.md").sort.each do |path|
    name = File.basename(path)
    errors << "#{path}: expected YYYY-MM-DD-lowercase-slug.md" unless name.match?(/\A\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.md\z/)

    match = File.read(path).match(/\A---[ \t]*\r?\n(.*?)^---[ \t]*\r?$\n?(.*)\z/m)
    unless match
      errors << "#{path}: missing YAML front matter"
      next
    end

    yaml, body = match.captures
    data = YAML.safe_load(yaml, permitted_classes: [Date, Time])
    unless data.is_a?(Hash)
      errors << "#{path}: front matter must be a mapping"
      next
    end

    keys = Psych.parse(yaml).root.children.each_slice(2).map { |key, _| key.value }
    errors << "#{path}: duplicate front matter keys" if keys.uniq.length != keys.length
    errors << "#{path}: title is required" if data["title"].to_s.strip.empty?
    Date.iso8601(data["date"].to_s[0, 10])
    Date.iso8601(name[0, 10])

    permalink = data["permalink"].to_s
    if !permalink.match?(%r{\A/(?:\d{4}/\d{2}/\d{2}|projects)/[a-z0-9]+(?:-[a-z0-9]+)*/\z})
      errors << "#{path}: add a stable /YYYY/MM/DD/slug/ or /projects/slug/ permalink"
    elsif permalinks.key?(permalink)
      errors << "#{path}: permalink already used by #{permalinks[permalink]}"
    else
      permalinks[permalink] = path
    end

    errors << "#{path}: post needs an article body" if body.strip.empty?
    errors << "#{path}: use shared components instead of inline CSS/JS" if body.match?(/<(?:style|script)\b/i)
    sections = data["sections"] || []
    ids = sections.map { |section| section["id"] }
    errors << "#{path}: duplicate section IDs" unless ids.uniq == ids
    sections.each do |section|
      id = section["id"].to_s
      heading_ids = body.scan(/^##+ (.+)$/).flatten.map { |heading| heading.downcase.gsub(/[^a-z0-9 -]/, "").strip.gsub(/ +/, "-") }
      unless heading_ids.include?(id) || body.include?(%Q(id="#{id}"))
        errors << "#{path}: section target ##{id} is missing"
      end
    end
    media = body.scan(/(?:src|href)=["'](\/assets\/uploads\/[^"']+)["']/).flatten
    media.each do |url|
      local = URI::DEFAULT_PARSER.unescape(url).delete_prefix("/")
      errors << "#{path}: missing media #{url}" unless File.file?(local)
    end

    hero_image = data["hero_image"].to_s
    unless hero_image.empty?
      unless hero_image.start_with?("/assets/uploads/") && File.file?(hero_image.delete_prefix("/"))
        errors << "#{path}: hero_image must point to a file under /assets/uploads/"
      end
      errors << "#{path}: add hero_alt for the hero image" if data["hero_alt"].to_s.strip.empty?
    end
  rescue Psych::Exception, ArgumentError => e
    errors << "#{path}: #{e.message.lines.first.strip}"
  end
end

abort errors.join("\n") unless errors.empty?
puts "Validated #{permalinks.length} posts."


Dir.glob(File.join(root, "_data", "*.json")).each do |path|
  JSON.parse(File.read(path))
end
