# Publishing Workflow

## In Pages CMS

For Markdown posts and HTML pages:

1. Set `Published` to `false` to keep content private.
2. Set `Publish At` to the date/time you want it to go live.

The scheduled workflow runs every 15 minutes and automatically flips `Published` to `true` when the `Publish At` time is reached.

## SEO Fields

Posts and editable pages now support:

- `SEO Title`
- `SEO Description`
- `Social Preview Image`
- `Hide From Search Engines` (`noindex`)

Canonical URL is generated automatically from each page URL.
These fields automatically populate the page `<title>`, meta description, Open Graph, Twitter card, and robots tags.

## Automatic URL Redirects

Post URLs are date-based, so changing a post date can change its URL.

An automatic GitHub Action now creates redirect files in `_redirects/` when a post URL changes, so old links continue to work.
