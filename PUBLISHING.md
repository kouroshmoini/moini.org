# Publishing Workflow

## In Pages CMS

For Markdown posts and HTML pages:

1. Leave `Publish Now` off to keep content private.
2. Set `Publish Date & Time` to when you want it to go live.

The scheduled workflow runs every 15 minutes and automatically flips `published` to `true` when the `Publish Date & Time` is reached.
For posts, the same scheduled value is also copied to `date` at publish time so only one effective date is shown on the site.

## SEO Fields

Posts and editable pages now support:

- `SEO Title`
- `SEO Description`
- `Social Preview Image`
- `Hide From Search Engines` (`noindex`)

Canonical URL is generated automatically from each page URL.
These fields automatically populate the page `<title>`, meta description, Open Graph, Twitter card, and robots tags.
