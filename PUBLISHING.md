# Publishing Workflow

## In Pages CMS

For Markdown posts and HTML pages:

1. Set `Published` to `false` to keep content private.
2. Set `Publish At` to the date/time you want it to go live.

The scheduled workflow runs every 15 minutes and automatically flips `Published` to `true` when the `Publish At` time is reached.

## Post URL Slugs

- New posts now require a `URL Slug`.
- Slug format: lowercase letters, numbers, and hyphens only.
- Post file names use this slug, and post URLs follow:
  - `/blog/your-slug/`

## SEO Fields

Posts and editable pages now support:

- `SEO Title`
- `SEO Description`
- `Social Preview Image`
- `Canonical URL`
- `Hide From Search Engines` (`noindex`)

These fields automatically populate the page `<title>`, meta description, Open Graph, Twitter card, canonical URL, and robots tags.

## Redirect Management

Use the `Redirects` collection in Pages CMS:

- `From Path` (example: `/old-page/`)
- `To URL` (example: `/new-page/` or `https://example.com/new-page`)

Each redirect generates a redirect page using the `redirect` layout.

## Validation Checks

GitHub Actions now validates content on push and pull requests:

- required post fields (`title`, `date`, `slug`)
- slug format and filename match
- `published`/`noindex` are booleans when present
- `publish_at` is a valid date/time when present
- redirect entries include `layout: redirect`, `permalink`, and `redirect_to`
