# Publishing Workflow

## In Pages CMS

For Markdown posts and HTML pages:

1. Set `Published` to `false` to keep content private.
2. Set `Publish At` to the date/time you want it to go live.
3. Optional: set `Show In Public Lists` / `Show In Public Navigation` to `false` if you want direct-URL preview without showing in Home/Blog/Search/nav.

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

## Browser-Only Live Refresh (No Commands)

If you do not want to run terminal commands, open your site with:

- `https://moini.org/?cmslive=1`

This enables a browser mode that checks for deployed page updates every 10 seconds and auto-refreshes when a new version is live.

Note: this is on your website tab, not inside the Pages CMS editor UI.

To turn it off:

- Click `turn off` in the bottom-right badge, or
- Open `https://moini.org/?cmslive=0`
