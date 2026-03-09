---
title: "Muskrat Falls: A Case Study in Megaproject Mismanagement"
published: true
noindex: false
content_blocks:
  - _block: raw_html
    block_label: full
    html: >-
      <!-- =========================================================

      1) TOP SUBTLE JUMP BLOCK

      Place this near the top of the page

      ========================================================= -->


      <section class="quickDownload" aria-label="Quick jump to paper download">
        <style>
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

          #full-paper-download{
            scroll-margin-top: 90px;
          }
        </style>

        Looking for the full paper?
        <a href="#full-paper-download" class="quickDownload__link" id="quickPaperDownloadLink">
          Jump to download
        </a>

        <script>
          (function(){
            const link = document.getElementById('quickPaperDownloadLink');
            if(!link) return;

            link.addEventListener('click', (e) => {
              const id = link.getAttribute('href')?.slice(1);
              const target = id ? document.getElementById(id) : null;
              if(!target) return;

              e.preventDefault();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });

              setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 350);
            });
          })();
        </script>
      </section>




      <!-- =========================================================

      2) DETAILED PROJECT DESCRIPTION SECTION

      Place this under your title / intro area

      ========================================================= -->


      <section class="paperOverview" aria-label="Project Description">
        <style>
          .paperOverview{
            margin: 42px 0 48px;
            font: inherit;
            color: var(--text);
          }

          .paperOverview__wrap{
            border: 1px solid var(--border);
            background: transparent;
            padding: 22px;
          }

          .paperOverview__title{
            margin: 0 0 14px;
            font-size: 1.25em;
            font-weight: 700;
            letter-spacing: -0.01em;
            line-height: 1.2;
          }

          .paperOverview__text{
            margin: 0;
            color: var(--muted);
            line-height: 1.7;
            font-size: 1em;
          }

          .paperOverview__text + .paperOverview__text{
            margin-top: 14px;
          }

          .paperOverview__meta{
            margin-top: 18px;
            padding-top: 14px;
            border-top: 1px solid var(--border);
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 12px;
          }

          @media (max-width: 900px){
            .paperOverview__meta{
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 560px){
            .paperOverview__meta{
              grid-template-columns: 1fr;
            }
          }

          .paperOverview__metaItem{
            border: 1px solid var(--border);
            padding: 12px;
            background: transparent;
          }

          .paperOverview__metaLabel{
            font-size: 0.82em;
            color: var(--muted);
            letter-spacing: 0.06em;
            text-transform: uppercase;
            margin-bottom: 6px;
          }

          .paperOverview__metaValue{
            font-size: 1em;
            color: var(--text);
            line-height: 1.45;
            font-weight: 600;
          }
        </style>

        <div class="paperOverview__wrap">
          <h2 class="paperOverview__title">Project Description</h2>

          <p class="paperOverview__text">
            This research paper examines the Muskrat Falls hydroelectric megaproject as a case study in infrastructure financing, public risk exposure, and megaproject mismanagement. The paper analyzes how inaccurate cost estimates, weak oversight, risk mismanagement, and political decision-making contributed to major cost overruns and long-term financial burdens.
          </p>

          <p class="paperOverview__text">
            In addition to the financing structure, the paper also discusses broader planning implications, including public-private risk allocation, federal loan guarantees, Indigenous consultation, environmental concerns, and the limits of framing large-scale hydroelectric development as a straightforward green energy success.
          </p>

          <div class="paperOverview__meta">
            <div class="paperOverview__metaItem">
              <div class="paperOverview__metaLabel">Course</div>
              <div class="paperOverview__metaValue">URBS 470</div>
            </div>

            <div class="paperOverview__metaItem">
              <div class="paperOverview__metaLabel">Type</div>
              <div class="paperOverview__metaValue">Research Paper</div>
            </div>

            <div class="paperOverview__metaItem">
              <div class="paperOverview__metaLabel">Theme</div>
              <div class="paperOverview__metaValue">Infrastructure Finance / Megaprojects</div>
            </div>

            <div class="paperOverview__metaItem">
              <div class="paperOverview__metaLabel">Institution</div>
              <div class="paperOverview__metaValue">Concordia University</div>
            </div>
          </div>
        </div>
      </section>




      <!-- =========================================================

      3) BOTTOM DOWNLOAD SECTION

      Place this at the end of the page

      ========================================================= -->


      <section id="full-paper-download" class="reportDownload"
      aria-label="Download Full Paper">

        <style>
          .reportDownload{
            margin: 60px 0 40px;
            font: inherit;
            color: var(--text);
          }

          .reportDownload__wrap{
            border: 1px solid var(--border);
            background: transparent;
            padding: 22px;
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
            align-items: center;
            justify-content: space-between;
          }

          .reportDownload__title{
            margin: 0;
            font-size: 1.2em;
            font-weight: 700;
            letter-spacing: -0.01em;
            line-height: 1.2;
          }

          .reportDownload__actions{
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }

          .reportDownload__btn{
            appearance: none;
            border: 1px solid var(--border);
            background: transparent;
            color: var(--text);
            padding: 12px 16px;
            font: inherit;
            font-size: 0.9em;
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: border-color 160ms ease, transform 120ms ease;
          }

          .reportDownload__btn:hover{
            border-color: color-mix(in srgb, var(--border) 40%, var(--text) 60%);
            transform: translateY(-1px);
          }
        </style>

        <div class="reportDownload__wrap">
          <div class="reportDownload__title">
            Full Paper – Muskrat Falls: A Case Study in Megaproject Mismanagement
          </div>

          <div class="reportDownload__actions">
            <a
              class="reportDownload__btn"
              href="/assets/uploads/Muskrat%20falls/individual%20-URBS470-Final-paper.pdf"
              download="individual-URBS470-Final-paper.pdf"
              type="application/pdf">
              Download PDF
            </a>

            <a
              class="reportDownload__btn"
              href="/assets/uploads/Muskrat%20falls/individual%20-URBS470-Final-paper.pdf"
              target="_blank"
              rel="noopener"
              type="application/pdf">
              Open in new tab
            </a>
          </div>
        </div>

      </section>
date: 2025-04-14T07:16
---
