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

      2) Short project description

      3) Additional paper information section

      4) Bottom download section

      ========================================================= -->


      <!-- =========================================================

      1) TOP SUBTLE JUMP BLOCK

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

      2) SHORT PROJECT DESCRIPTION

      ========================================================= -->

      <section class="paperIntro" aria-label="Paper introduction">
        <style>
          .paperIntro{
            margin: 42px 0 42px;
            font: inherit;
            color: var(--text);
          }

          .paperIntro__wrap{
            border-left: 1px solid var(--border);
            border-right: 1px solid var(--border);
            padding: 0 28px;
          }

          .paperIntro__title{
            margin: 0 0 18px;
            font-size: 1.25em;
            font-weight: 700;
            letter-spacing: -0.01em;
            line-height: 1.2;
            color: var(--text);
          }

          .paperIntro__text{
            margin: 0 0 18px;
            color: var(--text);
            line-height: 1.75;
            font-size: 1em;
            max-width: 100%;
          }

          .paperIntro__text:last-child{
            margin-bottom: 0;
          }
        </style>

        <div class="paperIntro__wrap">
          <h2 class="paperIntro__title">Project Description</h2>

          <p class="paperIntro__text">
            This research paper examines the Muskrat Falls hydroelectric megaproject as a case study in infrastructure financing, public risk exposure, and megaproject mismanagement. The paper focuses on how inaccurate early estimates, weak oversight, fragmented delivery structures, and political decision-making contributed to severe cost overruns and long-term financial burdens.
          </p>

          <p class="paperIntro__text">
            It also explores the broader planning implications of megaproject governance, including public-private risk allocation, federal loan guarantees, environmental concerns, and Indigenous consultation.
          </p>
        </div>
      </section>



      <!-- =========================================================

      3) NEW ADDITIONAL INFO SECTION

      ========================================================= -->

      <section class="paperDetails" aria-label="Paper details and focus">
        <style>
          .paperDetails{
            margin: 0 0 52px;
            font: inherit;
            color: var(--text);
          }

          .paperDetails__frame{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 36px;
            border-left: 1px solid var(--border);
            border-right: 1px solid var(--border);
            padding: 0 28px;
          }

          @media (max-width: 980px){
            .paperDetails__frame{
              grid-template-columns: 1fr;
              gap: 30px;
            }
          }

          .paperDetails__panel{
            min-width: 0;
          }

          .paperDetails__panel--right{
            border-left: 1px solid var(--border);
            padding-left: 34px;
          }

          @media (max-width: 980px){
            .paperDetails__panel--right{
              border-left: 0;
              padding-left: 0;
            }
          }

          .paperDetails__title{
            margin: 0 0 18px;
            font-size: 1.2em;
            font-weight: 700;
            letter-spacing: -0.01em;
            line-height: 1.2;
            color: var(--text);
          }

          .paperDetails__meta{
            display: grid;
            grid-template-columns: 120px 1fr;
            column-gap: 20px;
            row-gap: 18px;
            align-items: start;
          }

          @media (max-width: 560px){
            .paperDetails__meta{
              grid-template-columns: 1fr;
              row-gap: 10px;
            }
          }

          .paperDetails__metaLabel{
            color: var(--muted);
            font-weight: 600;
            font-size: 0.95em;
            line-height: 1.35;
          }

          .paperDetails__metaValue{
            color: var(--text);
            font-size: 1em;
            line-height: 1.5;
            font-weight: 500;
            word-break: break-word;
          }

          .paperDetails__list{
            margin: 0;
            padding-left: 18px;
            color: var(--text);
            line-height: 1.7;
            font-size: 1em;
          }

          .paperDetails__list li{
            margin-bottom: 10px;
          }

          .paperDetails__list li:last-child{
            margin-bottom: 0;
          }
        </style>

        <div class="paperDetails__frame">
          <div class="paperDetails__panel">
            <h2 class="paperDetails__title">Paper Information</h2>

            <div class="paperDetails__meta">
              <div class="paperDetails__metaLabel">Course</div>
              <div class="paperDetails__metaValue">URBS 470</div>

              <div class="paperDetails__metaLabel">Type</div>
              <div class="paperDetails__metaValue">Research Paper</div>

              <div class="paperDetails__metaLabel">Theme</div>
              <div class="paperDetails__metaValue">Infrastructure Finance / Megaprojects</div>

              <div class="paperDetails__metaLabel">Case Study</div>
              <div class="paperDetails__metaValue">Muskrat Falls Hydroelectric Project</div>

              <div class="paperDetails__metaLabel">Institution</div>
              <div class="paperDetails__metaValue">Concordia University</div>
            </div>
          </div>

          <div class="paperDetails__panel paperDetails__panel--right">
            <h2 class="paperDetails__title">What the Paper Covers</h2>

            <ul class="paperDetails__list">
              <li>Cost overruns and inaccurate early project estimates</li>
              <li>Public ownership, federal guarantees, and financial risk exposure</li>
              <li>Megaproject governance and accountability failures</li>
              <li>Environmental concerns associated with hydroelectric development</li>
              <li>Indigenous consultation and broader planning implications</li>
            </ul>
          </div>
        </div>
      </section>



      <!-- =========================================================

      4) BOTTOM DOWNLOAD SECTION

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
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 18px;
            align-items: center;
          }

          @media (max-width: 900px){
            .reportDownload__wrap{
              grid-template-columns: 1fr;
            }
          }

          .reportDownload__title{
            margin: 0;
            font-size: 1.2em;
            font-weight: 700;
            letter-spacing: -0.01em;
            line-height: 1.35;
            min-width: 0;
          }

          .reportDownload__actions{
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: flex-end;
          }

          @media (max-width: 900px){
            .reportDownload__actions{
              justify-content: flex-start;
            }
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
            white-space: nowrap;
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
              href="/assets/uploads/muskrat-falls-a-case-study-in-megaproject-mismanagement/muskrat-falls-report.pdf"
              download="muskrat-falls-report.pdf"
              type="application/pdf">
              Download PDF
            </a>

            <a
              class="reportDownload__btn"
              href="/assets/uploads/muskrat-falls-a-case-study-in-megaproject-mismanagement/muskrat-falls-report.pdf"
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
