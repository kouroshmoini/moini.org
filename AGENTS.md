# moini.org

This is Kourosh Moini’s Jekyll portfolio. Keep the production URL at https://moini.org/ and preserve existing page, post, and media links. LinkedIn is the only public contact channel. Keep phone numbers, email addresses, and private résumé copies out of public content.

## Add or edit a post

- Add one Markdown file to `_posts/` using `YYYY-MM-DD-lowercase-slug.md`. Use the example in [PUBLISHING.md](PUBLISHING.md).
- Write the article below the YAML front matter. Use `##` for the first level of article headings. The layout renders the title as the page heading and adds the article to Writing and search.
- Set a stable, unique permalink in the existing `/YYYY/MM/DD/slug/` format. Keep that permalink when editing a published post, including when changing its title or display date.
- Store any new media under `assets/uploads/<slug>/` and add descriptive alt text. Keep existing article media in place.
- Existing posts may use `content_blocks` for their custom diagrams and layouts. Preserve those blocks when editing those posts. New posts can use the Markdown body alone.
- Run `ruby scripts/check_posts.rb`. If Jekyll is installed, also run `bundle exec jekyll build` and check the post in the rendered site. Otherwise use the GitHub pull request’s deploy preview.
- Follow the repository’s normal GitHub review and publishing flow. Keep an unpublished draft off `main`, and keep private drafts outside this public repository.
