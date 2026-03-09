# Publishing Workflow

## In Pages CMS

For Markdown posts and HTML pages:

1. In `Blog Posts`, set `Date` to the date/time you want shown on the post.
2. Set `Visibility` to `Visible` or `Hidden`.

Only `Visible` posts are shown on the website.

## Optional Scheduling

Pages still support scheduled publishing with `Published` + `Publish Date & Time`.
The scheduled workflow runs every 15 minutes and flips `Published` to `true` once `Publish Date & Time` is reached.

## SEO Fields

Posts and editable pages now support:

- `SEO Title`
- `SEO Description`
- `Social Preview Image`
- `Hide From Search Engines` (`noindex`)

Canonical URL is generated automatically from each page URL.
These fields automatically populate the page `<title>`, meta description, Open Graph, Twitter card, and robots tags.
