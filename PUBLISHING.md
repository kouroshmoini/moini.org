# Publishing on moini.org

This is a static Jekyll portfolio. Markdown is the content source; there is no CMS, dashboard, or required AI provider. GitHub Pages publishes `main`. Preserve the domain and every published permalink.

## File map

- `_posts/`: articles and project reports, with YAML metadata followed by Markdown.
- `_layouts/default.html`: shared navigation, footer, search and scripts.
- `_layouts/post.html`: shared report header, facts, skill tags, contents and reading area.
- `_includes/figure.html`: image, caption and accessible enlargement.
- `_includes/comparison.html`: keyboard-accessible image comparisons.
- `_includes/download.html`: consistent original-document links.
- `_data/`: structured content used by reusable components, such as `hochelaga.json`.
- `assets/uploads/<project>/`: original project media. Preserve published media URLs.
- `assets/css/main.css`: design tokens, typography, layout and shared components.
- `assets/css/motion.css`: interaction motion and reduced-motion handling.
- `assets/css/chinatown.css`: only the Chinatown corridor and illustration layout.
- `assets/js/report.js`: shared comparison tabs and image viewer.
- `assets/js/motion.js`: reading progress, active section and restrained reveals.
- `templates/`: copyable starter posts. Excluded from the website build.
- `docs/`: editing guidance and factual change records. Excluded from the build.

## Add a project or article

1. Copy `templates/project.md` or `templates/article.md` to `_posts/YYYY-MM-DD-short-slug.md`.
2. Replace every placeholder. Set the actual publication date. For academic work, use `project_period` for the study dates; do not invent a day of completion.
3. Set a permanent `permalink`, such as `/projects/project-name/` or `/YYYY/MM/DD/slug/`. Never change it after publication.
4. Add `facts`, `skills`, and `sections`. Skills must be supported by the article, résumé or supplied work. For a team project, state team context without assigning unverified individual authorship.
5. Put media under `assets/uploads/<slug>/`. Add descriptive alt text and explain whether an image is an observation, proposal, or model. Use the figure include. Do not add glare effects, inline styles or inline JavaScript.
6. Keep the report flow clear: question/context → methods → findings or proposal → limitations/next steps → sources or original report. Use second-level headings; match their generated IDs in `sections`.
7. Set `featured: true` to appear in Selected work. Optional `card_title`, `card_image`, and `card_alt` control the card. All posts appear in Work & writing and search automatically.
8. Run `ruby scripts/check_posts.rb`, then `bundle exec jekyll build`. Check the preview at desktop and mobile sizes, both themes, section links, image viewer, tabs, search, and reduced-motion preference.
9. Review the factual diff, publish via a pull request, and verify the deployed page.

## Reusable components

```liquid
{% include figure.html src="/assets/uploads/project/map.jpg" alt="Describe the map" caption="Explain the map and its source." %}
{% include download.html id="original-report" title="Project report" src="/assets/uploads/project/report.pdf" %}
{% include comparison.html id="options" title="Compare options" items=site.data.project.options %}
```

A comparison data file is JSON or YAML with an array of objects: `label`, `src`, `alt`, optional `caption`, and `points` (a list of factual statements). Without JavaScript, every panel remains visible. With JavaScript, use arrow keys, Home and End to switch tabs. Image links work without JavaScript; enhanced viewers support Escape and return focus to the opener.

## Editorial rules

Keep sentences direct and use Canadian spelling. Use bold sparingly to identify a method or an important finding. Distinguish proposed results from measured outcomes. Do not claim that an academic proposal was built, approved, or independently validated. Do not add new software skills, dates, quantities, interview counts, or authorship without evidence. Preserve source discrepancies and explain them rather than silently correcting them. Keep an edit log when making substantive factual or interpretive changes.

Phone numbers, email addresses and private résumé files must never be published. LinkedIn is the only public contact channel. Keep private drafts and source material outside this public repository.

## Optional visitor analytics

GoatCounter is currently disabled. To activate it, create a private-dashboard GoatCounter site and set `analytics.goatcounter_code` in `_config.yml` to its public site code. Never put tokens, passwords, or your IP address in Git. The tracker loads only in production on `moini.org` or `www.moini.org`.

Exclude your own browser through GoatCounter's browser exclusion (`https://moini.org/#toggle-goatcounter`); repeat for each device/browser. A stable IP can be excluded in GoatCounter settings. A page visit does not establish who visited or prove that a résumé link was used.
