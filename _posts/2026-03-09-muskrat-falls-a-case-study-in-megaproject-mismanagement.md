---
title: "Muskrat Falls: A Case Study in Megaproject Mismanagement"
published: true
noindex: false
content_blocks:
  - _block: raw_html
    block_label: full
    html: >-
      <!-- =========================================================

      MUSKRAT FALLS PAGE SECTIONS

      1) Top subtle jump block

      2) Middle framed project description + project information

      3) Bottom download section

      ========================================================= -->


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

      2) MIDDLE FRAMED SECTION

      Matches the clean framed look

      ========================================================= -->

      <section class="paperOverview" aria-label="Project Description">
        <style>
          .paperOverview{
            margin: 42px 0 48px;
            font: inherit;
            color: var(--text);
            position: relative;
          }

          /* left border */
          .paperOverview::before{
            content:"";
            position:absolute;
            left:0;
            top:0;
            bottom:0;
            width:1px;
            background:var(--border);
          }

          /* right border */
          .paperOverview::after{
            content:"";
            position:absolute;
            right:0;
            top:0;
            bottom:0;
            width:1px;
            background:var(--border);
          }

          .paperOverview__grid{
            display:grid;
            grid-template-columns: 1.2fr 1fr;
            gap:56px;
            position:relative;
            padding:0 26px;
            align-items:start;
          }

          /* middle divider */
          .paperOverview__grid::before{
            content:"";
            position:absolute;
            left:50%;
            top:0;
            bottom:0;
            width:1px;
            background:var(--border);
            transform:translateX(-28px);
          }

          @media (max-width: 980px){
            .paperOverview__grid{
              grid-template-columns:1fr;
              gap:38px;
            }

            .paperOverview__grid::before,
            .paperOverview::after{
              display:none;
            }
          }

          .paperOverview__panel{
            padding:0;
          }

          .paperOverview__title{
            margin:0 0 18px;
            font-size:1.25em;
            font-weight:700;
            letter-spacing:-0.01em;
            line-height:1.2;
            color:var(--text);
          }

          .paperOverview__text{
            margin:0 0 18px;
            color:var(--text);
            line-height:1.7;
            font-size:1em;
          }

          .paperOverview__text:last-child{
            margin-bottom:0;
          }

          .paperOverview__meta{
            display:grid;
            grid-template-columns:140px 1fr;
            column-gap:18px;
            row-gap:16px;
          }

          @media (max-width: 560px){
            .paperOverview__meta{
              grid-template-columns:1fr;
              row-gap:10px;
            }
          }

          .paperOverview__metaLabel{
            color:var(--muted);
            font-weight:600;
            font-size:0.95em;
            line-height:1.35;
          }

          .paperOverview__metaValue{
            color:var(--text);
            font-size:1em;
            line-height:1.45;
            font-weight:500;
          }
        </style>

        <div class="paperOverview__grid">
          <div class="paperOverview__panel">
            <h2 class="paperOverview__title">Project Description</h2>

            <p class="paperOverview__text">
              This research paper examines the Muskrat Falls hydroelectric megaproject as a case study in infrastructure financing, public risk exposure, and megaproject mismanagement. The paper analyzes how inaccurate cost estimates, weak oversight, risk mismanagement, and political decision-making contributed to major cost overruns and long-term financial burdens.
            </p>

            <p class="paperOverview__text">
              In addition to the financing structure, the paper also discusses broader planning implications, including public-private risk allocation, federal loan guarantees, Indigenous consultation, environmental concerns, and the limits of framing large-scale hydroelectric development as a straightforward green energy success.
            </p>
          </div>

          <div class="paperOverview__panel">
            <h2 class="paperOverview__title">Project Information</h2>

            <div class="paperOverview__meta">
              <div class="paperOverview__metaLabel">Course</div>
              <div class="paperOverview__metaValue">URBS 470</div>

              <div class="paperOverview__metaLabel">Type</div>
              <div class="paperOverview__metaValue">Research Paper</div>

              <div class="paperOverview__metaLabel">Theme</div>
              <div class="paperOverview__metaValue">Infrastructure Finance / Megaprojects</div>

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
