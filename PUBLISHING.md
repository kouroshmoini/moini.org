# Publishing Workflow

## In Pages CMS

For Markdown posts and HTML pages:

1. In `Publish`, choose `Publish now` to make it public immediately.
2. Or choose `Choose date & time`, then set `Date & Time (for scheduled posts)`.

The scheduled workflow runs every 15 minutes and automatically flips scheduled content to published once the chosen time is reached.
For posts, the same scheduled value is also copied to `date` at publish time so only one effective date is shown on the site.

## SEO Fields

Posts and editable pages now support:

- `SEO Title`
- `SEO Description`
- `Social Preview Image`
- `Hide From Search Engines` (`noindex`)

Canonical URL is generated automatically from each page URL.
These fields automatically populate the page `<title>`, meta description, Open Graph, Twitter card, and robots tags.
