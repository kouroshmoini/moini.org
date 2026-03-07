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

## Live Preview While Editing In Pages CMS

If you save in Pages CMS and want to see updates instantly without refreshing production:

```bash
./scripts/live_preview.sh
```

What this does:

- Runs Jekyll with live reload (`--livereload`) so your browser refreshes automatically.
- Pulls latest commits from `origin/<current-branch>` every 5 seconds.
- Rebuilds as files change, including unpublished/scheduled content.

Then open:

- `http://127.0.0.1:4000`
