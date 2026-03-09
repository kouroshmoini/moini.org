---
title: "Muskrat Falls: A Case Study in Megaproject Mismanagement"
published: false
noindex: false
content_blocks:
  - _block: raw_html
    block_label: Jump to download
    html: >-
      <section class="quickDownload" aria-label="Quick jump to report download">
        <style>
          /* Keep this if you want smooth scroll site-wide.
             If you only want it for this link, the JS below already smooth-scrolls. */
          html { scroll-behavior: smooth; }

          .quickDownload{
            margin: 10px 0 28px;
            padding: 8px 12px;
            border: 1px solid var(--border);
            background: transparent;
            text-align: center;
            font: inherit;
            font-size: 0.9em;
            color: var(--muted);
          }

          .quickDownload__link{
            color: var(--text);
            text-decoration: none;
            font-weight: 600;
            margin-left: 6px;
            border-bottom: 1px solid transparent;
            transition: border-color 160ms ease;
          }

          .quickDownload__link:hover{
            border-bottom-color: var(--text);
          }

          /* IMPORTANT: makes anchor land correctly even with sticky headers */
          #full-report-download{
            scroll-margin-top: 90px; /* adjust if your header is taller/shorter */
          }
        </style>

        Looking for the full report?
        <a href="#full-report-download" class="quickDownload__link" id="quickDownloadLink">
          Jump to download
        </a>

        <script>
          (function(){
            const link = document.getElementById('quickDownloadLink');
            if(!link) return;

            link.addEventListener('click', (e) => {
              const id = link.getAttribute('href')?.slice(1);
              const target = id ? document.getElementById(id) : null;
              if(!target) return;

              e.preventDefault();

              // First scroll
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });

              // Retry once after layout settles (images/fonts shifting)
              setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 350);
            });
          })();
        </script>
      </section>
---
