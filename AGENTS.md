# moini.org

Read `PUBLISHING.md` before changing content. This is a Jekyll portfolio, published at https://moini.org/. Preserve every existing page, post, PDF and media URL. LinkedIn is the only public contact channel; never publish phone numbers, email addresses or private résumés.

Use `_layouts/post.html` and the components in `_includes/` for reports. Copy a starter from `templates/` when adding a post. Keep article copy in Markdown, optional comparison data in `_data/`, shared styling in `assets/css/`, and behavior in `assets/js/`. Do not embed CSS or JavaScript in posts. Keep existing project visuals and original document links unless asked to remove them.

Facts must come from the supplied work or verified sources. Keep team authorship clear without inventing individual contributions. Treat proposals as proposals and identify source inconsistencies. Do not claim Chinatown illustration authorship for Kourosh. Keep a factual edit record for substantial rewrites.

Run `ruby scripts/check_posts.rb` and a Jekyll build. Check responsive layouts, light/dark themes, section navigation, image viewing, comparison keyboard behavior and reduced motion. Content and ordinary links must work without JavaScript. Avoid glare, hidden entrance content, perpetual motion or animated numerical results.

## Handoff for future editors

- Start from the latest `main`. For a new post, copy the matching template and check a published example before editing. Use Hochelaga-Maisonneuve for a technical team report, Chinatown Gateway for an illustrated public-realm study, and Muskrat Falls for a research article.
- Keep the established sequence: summary and project facts, demonstrated skills, section navigation, context and objective, methods, findings or proposal, limitations, then sources or the public report. Keep front matter section IDs aligned with the actual headings. Use the shared figure, comparison and download includes, with descriptive alt text, captions and measured dimensions. Keep technical images legible in both themes with a white backing where needed, and position enlargement controls clear of map labels.
- Represent team work as team work. Credit Kourosh's individual contributions only when confirmed. Before publishing new source PDFs or graphics, check visible text, searchable text and metadata for teammate and instructor names or private contact details. Use the approved public redacted files. Keep citations to published sources intact.
- Use the shared green palette, typography, spacing and layout. Keep report text still and animations tied to interactions. Preserve slow, circular city traffic at the edges with a quieter centre, no bursts, and a reduced-motion fallback. Keep the left-side mobile menu and ensure controls work by tap and keyboard as well as mouse.
- Before publishing layout or interaction changes, use the Portfolio quality workflow in `.github/workflows/check-site.yml`. Check both themes on desktop and iPhone-sized screens, including the report contents, map markers, image viewer, search and reduced motion. Verify the live page after deployment. In the handoff to Kourosh, distinguish factual text edits from visual changes and state what was tested.

## Scroll and report exploration

The requested scroll treatment uses `motion.js` and `motion.css`: reveal near the lower viewport edge, reverse on upward scrolling, and keep content fully visible in the reading zone. Do not fade it out at the top, blur text, intercept scrolling or hide content without JavaScript. Respect reduced motion and printing. This supersedes the earlier instruction against report entrance motion.

Hochelaga uses the shared comparison include for its transit, slopes, development and land-use views. Step controls in `projects.js` follow the existing tab state; preserve keyboard/touch support and all original image links. Land-use selection highlights the corresponding table row, not guessed regions of the source maps. Keep rounded percentages separate from area values, and never animate source quantities into invented intermediate values.
