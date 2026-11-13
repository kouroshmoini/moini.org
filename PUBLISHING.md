# Publishing on moini.org

Add a Markdown file under `_posts/` and put any new images in `assets/uploads/<slug>/`. The homepage, Writing page, and search pick up published posts automatically. GitHub Pages rebuilds after changes reach `main`.

For example, save `_posts/2026-11-13-mapping-walkability.md` with this structure:

```markdown
---
title: "Mapping Walkability"
date: "2026-11-13"
permalink: /2026/11/13/mapping-walkability/
subtitle: "A short description for the homepage and Writing page."
---

Start the article here.

## What I looked at

Continue with your methods, findings, and any references.
```

For a lead image, add `hero_image: /assets/uploads/mapping-walkability/map.jpg` and a descriptive `hero_alt` to the front matter. Optional metadata includes `hero_caption`, `seo_title`, `seo_description`, and `og_image`. Keep the permalink after a post goes live. A case study can use an existing or dedicated `/projects/slug/` URL. Set a future date to keep a post out of builds until that date has passed and the site rebuilds. Keep private drafts outside this public repository.

Run `ruby scripts/check_posts.rb` before opening a pull request. You can also use `bundle exec jekyll build` and review the generated pages in `_site/`.

## Optional visitor analytics

The site has an opt-in GoatCounter integration. To activate it:

1. Create a GoatCounter site for `moini.org` and leave the dashboard private.
2. Set `analytics.goatcounter_code` in `_config.yml` to the account’s site code (the part before `.goatcounter.com`). The code is public. Keep credentials and tokens out of the repository.
3. Publish the change. Only production pages on `moini.org` and `www.moini.org` load the tracker.
4. To exclude your own visits, use GoatCounter’s browser exclusion on each device and browser you use. Open `https://moini.org/#toggle-goatcounter` and reload if needed. If you have a stable IP, add it under **Settings → Tracking → Ignore IPs** in GoatCounter. Keep your IP out of Git.

The private dashboard shows visits by page and approximate location. An opening of the portfolio homepage can appear in those counts, but the existing URL alone does not identify a visitor or whether they came from a résumé.
