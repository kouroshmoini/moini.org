# Publishing Workflow

## In Pages CMS

For Markdown posts and HTML pages:

1. Set `Published` to `false` to keep content private.
2. Set `Publish At` to the date/time you want it to go live.

The scheduled workflow runs every 15 minutes and automatically flips `Published` to `true` when the `Publish At` time is reached.

## Preview Without Publishing

Run local preview including unpublished and scheduled content:

```bash
bundle exec jekyll serve --future --unpublished --drafts
```

This lets you preview `.md` and `.html` files before they are publicly visible.
