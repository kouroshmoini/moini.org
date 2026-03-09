---
title: Revitalizing Hochelaga-Maisonneuve
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
  - _block: rich_text
    block_label: BACKGROUND AND CONTEXT
    content: >-
      # BACKGROUND AND CONTEXT


      ![](/assets/uploads/revitalizing-hochelaga-maisonneuve/Copy%20of%20URBS%20433%20FINAL%20REPORT%20MAY%201ST.png)
  - _block: raw_html
    block_label: Project Information
    html: >-
      <section class="projInfo" aria-label="Project Information and Objectives">
        <style>
          .projInfo{
            margin: 38px 0;
            font: inherit;
            color: var(--text);
            position: relative;
          }

          /* Main two-column grid */
          .projInfo__grid{
            display: grid;
            grid-template-columns: 1fr 1.1fr;
            gap: 36px;
            position: relative;
          }
          @media (max-width: 980px){
            .projInfo__grid{ grid-template-columns: 1fr; }
          }

          /* LEFT vertical line */
          .projInfo::before{
            content:"";
            position:absolute;
            left:0;
            top:0;
            bottom:0;
            width:1px;
            background: var(--border);
          }

          /* RIGHT vertical line */
          .projInfo::after{
            content:"";
            position:absolute;
            right:0;
            top:0;
            bottom:0;
            width:1px;
            background: var(--border);
          }

          /* Middle divider line */
          .projInfo__grid::before{
            content:"";
            position:absolute;
            top:0;
            bottom:0;
            left:50%;
            width:1px;
            background: var(--border);
            transform: translateX(-18px); /* aligns with gap */
          }

          @media (max-width: 980px){
            .projInfo::after,
            .projInfo__grid::before{
              display:none;
            }
          }

          /* Panel spacing */
          .projInfo__panel{
            padding: 0 18px;
          }

          .projInfo__title{
            margin: 0 0 16px;
            font-size: 1.15em;
            font-weight: 750;
            letter-spacing: -0.01em;
            line-height: 1.2;
          }

          /* Compact definition layout */
          .projInfo__rows{
            display: grid;
            grid-template-columns: 140px 1fr;
            column-gap: 16px;
            row-gap: 14px;
          }

          @media (max-width: 520px){
            .projInfo__rows{
              grid-template-columns: 1fr;
              row-gap: 10px;
            }
          }

          .projInfo__label{
            color: var(--muted);
            font-weight: 650;
            font-size: 0.95em;
          }

          .projInfo__value{
            color: var(--text);
            font-size: 1em;
            line-height: 1.45;
          }

          /* Objectives */
          .projInfo__list{
            margin: 0;
            padding-left: 20px;
            line-height: 1.65;
            font-size: 1em;
          }

          .projInfo__list li{
            margin-bottom: 12px;
          }
        </style>

        <div class="projInfo__grid">
          <!-- Project Information -->
          <div class="projInfo__panel">
            <h3 class="projInfo__title">Project Information</h3>

            <div class="projInfo__rows">
              <div class="projInfo__label">Type</div>
              <div class="projInfo__value">Planning &amp; GIS Experience (2024–2025)</div>

              <div class="projInfo__label">Location</div>
              <div class="projInfo__value">Hochelaga-Maisonneuve, Montreal, QC, Canada</div>

              <div class="projInfo__label">Area</div>
              <div class="projInfo__value">~42 ha</div>

              <div class="projInfo__label">Coordinator</div>
              <div class="projInfo__value">Prof. Pierre Gauthier</div>

              <div class="projInfo__label">Project Scope</div>
              <div class="projInfo__value">Strategic Redevelopment Plan</div>

              <div class="projInfo__label">Tools</div>
              <div class="projInfo__value">ArcGIS Pro, Illustrator, SketchUp</div>
            </div>
          </div>

          <!-- Objectives -->
          <div class="projInfo__panel">
            <h3 class="projInfo__title">Objectives</h3>

            <ul class="projInfo__list">
              <li>Conducted GIS-based mapping and spatial analysis</li>
              <li>Created slope feasibility graphs and transit network evaluations</li>
              <li>Designed land use, green infrastructure, and density plans</li>
              <li>Developed diagrammatic 3D visualizations illustrating the proposed redevelopment strategy</li>
              <li>Proposed alternative tram alignment and tunnel segment</li>
              <li>Integrated climate vulnerability and transit equity analysis</li>
            </ul>
          </div>
        </div>
      </section>
  - _block: rich_text
    block_label: Background
    content: >-
      # Background


      Hochelaga-Maisonneuve, a historically industrial neighbourhood in eastern
      Montreal, has long been shaped by its proximity to the Port and its role
      in manufacturing and logistics. Following decades of deindustrialization,
      the area now faces challenges related to underutilized land, brownfield
      contamination, and fragmented urban form. Despite its decline,
      Hochelaga-Maisonneuve remains rich in cultural identity and is
      strategically located near key civic anchors such as the Olympic Stadium
      and Botanical Garden. This project focused on a 42-hectare redevelopment
      zone within the neighbourhood, characterized by large industrial parcels,
      limited green space, and poor transit access. The objective was to
      reimagine this area as a sustainable, high density, mixed-use district
      that reconnects with the surrounding urban fabric. Special emphasis was
      placed on enhancing transit coverage through a new tram line, integrating
      climate-adaptive infrastructure, and transforming the legacy street grid
      to support walkability, ecological resilience, and inclusive urban living.
  - _block: rich_text
    block_label: History & Ecology
    content: >-
      # History & Ecology


      ![](/assets/uploads/revitalizing-hochelaga-maisonneuve/final-perm.jpg)


      *   The analysis focused on environmental sustainability, with historical
      context as a secondary lens.
          
      *   Early development followed Notre-Dame Street, shaping the area’s
      initial urban form.
          
      *   The site evolved from farmland to industrial use, including factories
      and rail.
          
      *   Uneven terrain and wooded remnants reflect its layered ecological
      history.
          
      *   Urbanization led to the loss of historic streams, increasing flood
      risk.
          
      *   This presents an opportunity for green infrastructure and stormwater
      management.
          

      * * *


      ![](/assets/uploads/revitalizing-hochelaga-maisonneuve/Copy%20of%20URBS%20433%20FINAL%20REPORT%20MAY%201ST-3.jpg)


      *   Satellite imagery reveals large, underused plots with minimal
      vegetation, highlighting the extent of brownfield and industrial land.
          
      *   The area includes storage facilities, manufacturers, and
      distributors—such as Pom bakery and Coca-Cola—linked to Port activity.
          
      *   These parcels offer major redevelopment potential, combining land
      reuse with environmental remediation.
          
      *   The site’s industrial concentration and ecological disruption reflect
      its legacy and underscore the need for reintegration.
          

      # Redevelopment Vision


      ![](/assets/uploads/revitalizing-hochelaga-maisonneuve/Hochelaga-vision.jpg)


      *   Redevelopment Opportunity: Transform a brownfield- heavy, industrial
      area into a vibrant, mixed-use neighbourhood.
          
      *   Urban Integration: Extend the existing Hochelaga- Maisonneuve urban
      fabric through cohesive planning and design.
          
      *   Regional Destination: Establish the area as a new urban hub serving
      both local residents and the Greater Montreal Area.
          
      *   Anchor Institutions: Leverage proximity to the Olympic Stadium, Stade
      Saputo, and Botanical Gardens as catalysts for activity.
          
      *   Transit-Oriented Development: Introduce a new tram line to improve
      site access, strengthen connectivity, and support higher-density uses.
          
      *   Complete Community: Enable a livable district where people can live,
      work, and enjoy public and recreational spaces.
          
      *   Year-Round Activation: Encourage longer visits by event-goers through
      dining, public space, and cultural programming.
          
      *   Long-Term Goal: Position the area as a standalone destination, not
      just an extension of nearby landmarks.
  - _block: raw_html
    block_label: "       Transit Analysis (scoped)"
    html: >-
      <section class="tea" aria-label="Transit Analysis">
        <style>
          /* =========================
             Transit Analysis (scoped)
             Adds Slope-style reveal animation on maps
          ========================= */

          .tea{
            margin: 60px 0;
            color: var(--text);
            font: inherit;
          }

          .tea__title{
            margin: 0 0 8px;
            font-size: 1.9em;
            font-weight: 700;
            letter-spacing: -0.01em;
            line-height: 1.2;
          }

          .tea__subtitle{
            margin: 0 0 18px;
            font-size: 1em;
            color: var(--muted);
            line-height: 1.6;
          }

          /* Tabs match slope */
          .tea__tabs{
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            margin: 10px 0 16px;
          }

          .tea__tab{
            appearance: none;
            border: 1px solid var(--border);
            background: transparent;
            color: var(--muted);
            padding: 10px 14px;
            border-radius: 999px;
            font: inherit;
            font-size: 1em;
            line-height: 1;
            cursor: pointer;
            user-select: none;
            transition: background 180ms ease, color 180ms ease, border-color 180ms ease, transform 120ms ease;
          }

          .tea__tab:hover{
            color: var(--text);
            border-color: color-mix(in srgb, var(--border) 55%, var(--text) 45%);
            transform: translateY(-1px);
          }

          .tea__tab[aria-selected="true"]{
            background: var(--panel);
            color: var(--text);
            border-color: color-mix(in srgb, var(--border) 40%, var(--text) 60%);
          }

          /* Panels */
          .tea__panel{
            display: none;
            opacity: 0;
            transform: translateY(6px);
            transition: opacity 300ms ease, transform 300ms ease;
          }
          .tea__panel.is-active{ display: block; }
          .tea__panel.is-visible{ opacity: 1; transform: translateY(0); }

          .tea__grid{
            display: grid;
            grid-template-columns: 1.6fr 1fr;
            gap: 22px;
            align-items: start;
          }
          @media (max-width: 980px){
            .tea__grid{ grid-template-columns: 1fr; }
          }

          /* square frames */
          .tea__media{
            border: 1px solid var(--border);
            background: transparent;
            border-radius: 0;
            overflow: hidden;
          }

          .tea__imgbtn{
            all: unset;
            display: block;
            cursor: zoom-in;
          }

          /* === Reveal animation wrapper (same idea as slopeStudy__reveal) === */
          .tea__reveal{
            position: relative;
            overflow: hidden;
          }

          .tea__img{
            width: 100%;
            height: auto;
            display: block;
            object-fit: contain;
            background: transparent;
            border-radius: 0;
          }

          .tea__wipe{
            position: absolute;
            inset: 0;
            background: var(--bg);
            transform: translateX(0%);
            pointer-events: none;
          }

          .tea__scan{
            position: absolute;
            top: 0;
            bottom: 0;
            width: 14px;
            left: 0;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent);
            opacity: 0;
            pointer-events: none;
          }

          /* When panel becomes visible, run animations */
          .tea__panel.is-visible .tea__wipe{
            animation: teaWipe 900ms cubic-bezier(.2,.7,.2,1) 120ms forwards;
          }
          .tea__panel.is-visible .tea__scan{
            opacity: 1;
            animation: teaScan 900ms cubic-bezier(.2,.7,.2,1) 120ms forwards;
          }

          @keyframes teaWipe{
            from { transform: translateX(0%); }
            to   { transform: translateX(100%); }
          }
          @keyframes teaScan{
            from { transform: translateX(0%); }
            to   { transform: translateX(100%); }
          }

          @media (prefers-reduced-motion: reduce){
            .tea__panel,
            .tea__tab{
              transition: none !important;
            }
            .tea__panel.is-visible .tea__wipe,
            .tea__panel.is-visible .tea__scan{
              animation: none !important;
              opacity: 0 !important;
            }
          }

          .tea__captionrow{
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 10px 12px;
            border-top: 1px solid var(--border);
            color: var(--muted);
            font-size: 0.92em;
            line-height: 1.4;
          }

          .tea__zoomhint{
            white-space: nowrap;
            color: var(--muted);
            text-decoration: underline;
            text-underline-offset: 3px;
            cursor: zoom-in;
          }

          .tea__aside{
            border: 1px solid var(--border);
            background: transparent;
            border-radius: 0;
            padding: 14px 14px 12px;
          }

          .tea__asideKicker{
            font-size: 0.78em;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: var(--muted);
            margin: 0 0 8px;
          }

          .tea__asideTitle{
            margin: 0 0 10px;
            font-size: 1.05em;
            font-weight: 700;
            color: var(--text);
            line-height: 1.25;
          }

          .tea__bullets{
            margin: 0;
            padding-left: 20px;
            color: var(--text);
            line-height: 1.7;
            font-size: 1em;
          }

          .tea__bullets li{ margin: 0 0 10px; }
          .tea__bullets li:last-child{ margin-bottom: 0; }

          /* ===== Zoom overlay ===== */
          .tea__overlay{
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.88);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 18px;
            cursor: zoom-out;
          }
          .tea__overlay.is-open{ display: flex; }

          .tea__overlayInner{
            position: relative;
            max-width: 96vw;
            max-height: 92vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .tea__overlayImg{
            max-width: 96vw;
            max-height: 92vh;
            width: auto;
            height: auto;
            object-fit: contain;
            border-radius: 0;
            display: block;
            cursor: zoom-out;
          }

          .tea__close{
            position: absolute;
            top: -10px;
            right: -10px;
            width: 40px;
            height: 40px;
            border: 1px solid rgba(255,255,255,0.45);
            background: rgba(0,0,0,0.65);
            color: #fff;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            line-height: 1;
            border-radius: 0;
          }
        </style>

        <h2 class="tea__title">Transit Analysis</h2>
        <p class="tea__subtitle">
          Step by step comparison of the existing transit landscape, the city rejected alignment, and the proposed alternative.
        </p>

        <div class="tea__tabs" role="tablist" aria-label="Transit comparison steps">
          <button class="tea__tab" role="tab" aria-selected="true" aria-controls="tea-panel-1" id="tea-tab-1" type="button">
            Current Transit Landscape
          </button>
          <button class="tea__tab" role="tab" aria-selected="false" aria-controls="tea-panel-2" id="tea-tab-2" type="button">
            Rejected Tram Line
          </button>
          <button class="tea__tab" role="tab" aria-selected="false" aria-controls="tea-panel-3" id="tea-tab-3" type="button">
            New Proposed Tram Line
          </button>
        </div>

        <div class="tea__panelwrap">
          <!-- PANEL 1 -->
          <div class="tea__panel is-active is-visible" role="tabpanel" id="tea-panel-1" aria-labelledby="tea-tab-1" tabindex="0">
            <div class="tea__grid">
              <div class="tea__media">
                <button class="tea__imgbtn" type="button" data-zoom-src="/assets/uploads/revitalizing-hochelaga-maisonneuve/1.jpg" aria-label="Open image full screen">
                  <div class="tea__reveal">
                    <img class="tea__img" src="/assets/uploads/revitalizing-hochelaga-maisonneuve/1.jpg" alt="Current transit landscape map" loading="lazy">
                    <div class="tea__wipe"></div>
                    <div class="tea__scan"></div>
                  </div>
                </button>
                <div class="tea__captionrow">
                  <div>Figure: existing transit network and baseline access conditions.</div>
                  <div class="tea__zoomhint" data-zoom-src="/assets/uploads/revitalizing-hochelaga-maisonneuve/1.jpg">Click image to zoom</div>
                </div>
              </div>

              <aside class="tea__aside" aria-label="Key points">
                <div class="tea__asideKicker">Key Points</div>
                <div class="tea__asideTitle">Current Transit Landscape</div>
                <ul class="tea__bullets">
                  <li>Shows existing metro stops, bus lanes, and the current network structure.</li>
                  <li>Highlights where transit access is concentrated and where gaps remain.</li>
                  <li>Sets the baseline used to evaluate later options.</li>
                </ul>
              </aside>
            </div>
          </div>

          <!-- PANEL 2 -->
          <div class="tea__panel" role="tabpanel" id="tea-panel-2" aria-labelledby="tea-tab-2" tabindex="0">
            <div class="tea__grid">
              <div class="tea__media">
                <button class="tea__imgbtn" type="button" data-zoom-src="/assets/uploads/revitalizing-hochelaga-maisonneuve/2.jpg" aria-label="Open image full screen">
                  <div class="tea__reveal">
                    <img class="tea__img" src="/assets/uploads/revitalizing-hochelaga-maisonneuve/2.jpg" alt="Rejected tram line map" loading="lazy">
                    <div class="tea__wipe"></div>
                    <div class="tea__scan"></div>
                  </div>
                </button>
                <div class="tea__captionrow">
                  <div>Figure: city studied alternative route and constraints (including context inset).</div>
                  <div class="tea__zoomhint" data-zoom-src="/assets/uploads/revitalizing-hochelaga-maisonneuve/2.jpg">Click image to zoom</div>
                </div>
              </div>

              <aside class="tea__aside" aria-label="Key points">
                <div class="tea__asideKicker">Key Points</div>
                <div class="tea__asideTitle">Rejected Tram Line</div>
                <ul class="tea__bullets">
                  <li>The city studied an alternative tram route via Honoré Beaugrand, L’Assomption, and Hochelaga, but rejected it in the 2024 PSE report.</li>
                  <li>Honoré Beaugrand had right of way issues due to a narrow layout and dense driveways.</li>
                  <li>L’Assomption’s steeper slope would likely require an invasive trench ramp to meet tram standards.</li>
                </ul>
              </aside>
            </div>
          </div>

          <!-- PANEL 3 -->
          <div class="tea__panel" role="tabpanel" id="tea-panel-3" aria-labelledby="tea-tab-3" tabindex="0">
            <div class="tea__grid">
              <div class="tea__media">
                <button class="tea__imgbtn" type="button" data-zoom-src="/assets/uploads/revitalizing-hochelaga-maisonneuve/3.jpg" aria-label="Open image full screen">
                  <div class="tea__reveal">
                    <img class="tea__img" src="/assets/uploads/revitalizing-hochelaga-maisonneuve/3.jpg" alt="New proposed tram line map" loading="lazy">
                    <div class="tea__wipe"></div>
                    <div class="tea__scan"></div>
                  </div>
                </button>
                <div class="tea__captionrow">
                  <div>Figure: proposed alignment and context inset (full figure shown in zoom).</div>
                  <div class="tea__zoomhint" data-zoom-src="/assets/uploads/revitalizing-hochelaga-maisonneuve/3.jpg">Click image to zoom</div>
                </div>
              </div>

              <aside class="tea__aside" aria-label="Key points">
                <div class="tea__asideKicker">Key Points</div>
                <div class="tea__asideTitle">New Proposed Tram Line</div>
                <ul class="tea__bullets">
                  <li>Proposes a tram route via Hochelaga and Viau to avoid slope and space issues in earlier alignments.</li>
                  <li>Adds a tunnel segment on Viau to manage steep grades with minimal disruption.</li>
                  <li>Improves east west transit access and connects key redevelopment areas.</li>
                  <li>Supports goals of mobility equity and sustainable, transit oriented development.</li>
                </ul>
              </aside>
            </div>
          </div>
        </div>

        <!-- Zoom overlay -->
        <div class="tea__overlay" id="teaOverlay" aria-hidden="true">
          <div class="tea__overlayInner" role="dialog" aria-modal="true" aria-label="Image viewer">
            <button class="tea__close" type="button" id="teaClose" aria-label="Close">×</button>
            <img class="tea__overlayImg" id="teaOverlayImg" alt="">
          </div>
        </div>

        <script>
          (function(){
            const root = document.querySelector('.tea');
            if(!root) return;

            const tabs = Array.from(root.querySelectorAll('.tea__tab'));
            const panels = Array.from(root.querySelectorAll('.tea__panel'));

            function restartReveal(panel){
              // Restart wipe + scan every time a panel is shown
              const wipe = panel.querySelector('.tea__wipe');
              const scan = panel.querySelector('.tea__scan');
              if(wipe){
                wipe.style.animation = 'none';
                wipe.offsetHeight;
                wipe.style.animation = '';
              }
              if(scan){
                scan.style.animation = 'none';
                scan.offsetHeight;
                scan.style.animation = '';
              }
            }

            function setActive(index){
              tabs.forEach((t, i) => t.setAttribute('aria-selected', i === index ? 'true' : 'false'));
              panels.forEach((p, i) => {
                const active = i === index;
                if(active){
                  p.classList.add('is-active');
                  requestAnimationFrame(() => {
                    p.classList.add('is-visible');
                    restartReveal(p);
                  });
                } else {
                  p.classList.remove('is-visible');
                  setTimeout(() => p.classList.remove('is-active'), 300);
                }
              });
            }

            tabs.forEach((tab, idx) => tab.addEventListener('click', () => setActive(idx)));

            const overlay = root.querySelector('#teaOverlay');
            const overlayImg = root.querySelector('#teaOverlayImg');
            const closeBtn = root.querySelector('#teaClose');

            let savedScrollY = 0;

            function lockScroll(){
              savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
              document.body.style.position = 'fixed';
              document.body.style.top = `-${savedScrollY}px`;
              document.body.style.left = '0';
              document.body.style.right = '0';
              document.body.style.width = '100%';
            }

            function unlockScroll(){
              document.body.style.position = '';
              document.body.style.top = '';
              document.body.style.left = '';
              document.body.style.right = '';
              document.body.style.width = '';
              window.scrollTo(0, savedScrollY);
            }

            function openZoom(src, alt){
              overlayImg.src = src;
              overlayImg.alt = alt || 'Full image';
              overlay.classList.add('is-open');
              overlay.setAttribute('aria-hidden', 'false');
              lockScroll();
            }

            function closeZoom(){
              overlay.classList.remove('is-open');
              overlay.setAttribute('aria-hidden', 'true');
              overlayImg.src = '';
              unlockScroll();
            }

            root.querySelectorAll('[data-zoom-src]').forEach(el => {
              el.addEventListener('click', (e) => {
                e.preventDefault();
                const src = el.getAttribute('data-zoom-src');
                const img = el.closest('.tea__media')?.querySelector('img');
                openZoom(src, img ? img.alt : '');
              });
            });

            closeBtn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              closeZoom();
            });

            overlay.addEventListener('click', (e) => {
              e.preventDefault();
              closeZoom();
            });

            window.addEventListener('keydown', (e) => {
              if(e.key === 'Escape' && overlay.classList.contains('is-open')) closeZoom();
            });
          })();
        </script>
      </section>
  - _block: raw_html
    block_label: Slope analysis
    html: >-
      <section class="slopeStudy" aria-label="Slope Profile Summary">


      <style>
        .slopeStudy{
          margin: 60px 0;
          font: inherit;
          color: var(--text);
        }

        .slopeStudy__title{
          margin: 0 0 8px;
          font-size: 1.9em;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .slopeStudy__subtitle{
          margin: 0 0 18px;
          color: var(--muted);
          line-height: 1.6;
          font-size: 1em;
        }

        .slopeStudy__gridTop{
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 18px;
          align-items: start;
          margin-bottom: 26px;
        }
        @media (max-width: 980px){
          .slopeStudy__gridTop{ grid-template-columns: 1fr; }
        }

        /* Map container: flat, but image corners are square */
        .slopeStudy__mapWrap{
          border: 1px solid var(--border);
          background: transparent;
          overflow: hidden;
        }
        .slopeStudy__map{
          width: 100%;
          height: auto;
          display: block;
          border-radius: 0; /* no rounded image */
        }

        /* Bullets box: flat */
        .slopeStudy__aside{
          border: 1px solid var(--border);
          background: transparent;
          padding: 14px 14px 12px;
        }
        .slopeStudy__kicker{
          font-size: 0.78em;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 0 0 8px;
        }
        .slopeStudy__bullets{
          margin: 0;
          padding-left: 20px; /* ensure bullets show */
          line-height: 1.7;
          font-size: 1em;
          color: var(--text);
        }
        .slopeStudy__bullets li{ margin: 0 0 10px; }
        .slopeStudy__bullets li:last-child{ margin-bottom: 0; }

        /* Tabs */
        .slopeStudy__tabs{
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          margin: 10px 0 16px;
        }
        .slopeStudy__tab{
          appearance: none;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--muted);
          padding: 10px 14px;
          border-radius: 999px;
          font: inherit;
          font-size: 1em;
          line-height: 1;
          cursor: pointer;
          user-select: none;
          transition: background 180ms ease, color 180ms ease, border-color 180ms ease, transform 120ms ease;
        }
        .slopeStudy__tab:hover{
          color: var(--text);
          border-color: color-mix(in srgb, var(--border) 55%, var(--text) 45%);
          transform: translateY(-1px);
        }
        /* Strong “selected” state */
        .slopeStudy__tab[aria-selected="true"]{
          background: var(--panel);
          color: var(--text);
          border-color: color-mix(in srgb, var(--border) 40%, var(--text) 60%);
        }

        /* Graph panel container: flat */
        .slopeStudy__graphWrap{
          border: 1px solid var(--border);
          background: transparent;
          overflow: hidden;
        }

        /* Panels fade/slide */
        .slopeStudy__panel{
          display: none;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 380ms ease, transform 380ms ease;
        }
        .slopeStudy__panel.is-active{ display: block; }
        .slopeStudy__panel.is-visible{
          opacity: 1;
          transform: translateY(0);
        }

        /* Premium “graph draw” reveal animation (left->right) */
        .slopeStudy__reveal{
          position: relative;
          overflow: hidden;  /* key */
        }

        /* The image itself: square corners */
        .slopeStudy__graphImg{
          width: 100%;
          height: auto;
          display: block;
          border-radius: 0; /* no rounded image */
        }

        /* The wipe overlay that animates away */
        .slopeStudy__wipe{
          position: absolute;
          inset: 0;
          background: var(--bg);
          transform: translateX(0%);
          pointer-events: none;
        }

        /* subtle “scan line” */
        .slopeStudy__scan{
          position: absolute;
          top: 0;
          bottom: 0;
          width: 14px;
          left: 0;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent);
          opacity: 0;
          pointer-events: none;
        }

        /* When panel becomes visible, run animations */
        .slopeStudy__panel.is-visible .slopeStudy__wipe{
          animation: slopeWipe 900ms cubic-bezier(.2,.7,.2,1) 120ms forwards;
        }
        .slopeStudy__panel.is-visible .slopeStudy__scan{
          opacity: 1;
          animation: slopeScan 900ms cubic-bezier(.2,.7,.2,1) 120ms forwards;
        }

        @keyframes slopeWipe{
          from { transform: translateX(0%); }
          to   { transform: translateX(100%); }
        }
        @keyframes slopeScan{
          from { transform: translateX(0%); }
          to   { transform: translateX(100%); }
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce){
          .slopeStudy__panel,
          .slopeStudy__tab{
            transition: none !important;
          }
          .slopeStudy__panel.is-visible .slopeStudy__wipe,
          .slopeStudy__panel.is-visible .slopeStudy__scan{
            animation: none !important;
            opacity: 0 !important;
          }
        }

        /* Small caption */
        .slopeStudy__caption{
          padding: 10px 12px;
          border-top: 1px solid var(--border);
          color: var(--muted);
          font-size: 0.92em;
          line-height: 1.4;
        }
      </style>


      <h2 class="slopeStudy__title">Slope Profile Summary</h2>

      <p class="slopeStudy__subtitle">
        Slope feasibility comparison of Assomption Blvd and Viau Street for tram alignment design.
      </p>


      <div class="slopeStudy__gridTop">
        <div class="slopeStudy__mapWrap">
          <img
            class="slopeStudy__map"
            src="/assets/uploads/revitalizing-hochelaga-maisonneuve/SlopeMap.jpeg"
            alt="Slope analysis map of Viau and Assomption corridors"
            loading="lazy">
        </div>

        <aside class="slopeStudy__aside" aria-label="Key points">
          <div class="slopeStudy__kicker">Key Points</div>
          <ul class="slopeStudy__bullets">
            <li>Slope analysis compared Assomption Blvd and Viau Street for tram feasibility.</li>
            <li>Assomption’s slope reaches ~14%, far above the 6% tram limit, implying major trenching or grade separation.</li>
            <li>Viau shows a more consistent profile closer to acceptable standards.</li>
            <li>A tunnel segment is proposed on Viau to manage steeper sections and reduce surface disruption.</li>
          </ul>
        </aside>
      </div>


      <div class="slopeStudy__tabs" role="tablist" aria-label="Slope profile
      tabs">
        <button class="slopeStudy__tab" type="button" role="tab"
          aria-selected="true" aria-controls="slope-panel-viau" id="slope-tab-viau">
          Viau Street
        </button>

        <button class="slopeStudy__tab" type="button" role="tab"
          aria-selected="false" aria-controls="slope-panel-assomption" id="slope-tab-assomption">
          Assomption Boulevard
        </button>
      </div>


      <div class="slopeStudy__graphWrap">
        <!-- VIAU -->
        <div class="slopeStudy__panel is-active is-visible" role="tabpanel"
          id="slope-panel-viau" aria-labelledby="slope-tab-viau" tabindex="0">

          <div class="slopeStudy__reveal">
            <img
              class="slopeStudy__graphImg"
              src="/assets/uploads/revitalizing-hochelaga-maisonneuve/ViauStreet.jpg"
              alt="Slope profile graph: Viau Street"
              loading="lazy">
            <div class="slopeStudy__wipe"></div>
            <div class="slopeStudy__scan"></div>
          </div>

          <div class="slopeStudy__caption">
            Figure: slope profile along Viau Street (6% threshold band shown in the chart).
          </div>
        </div>

        <!-- ASSOMPTION -->
        <div class="slopeStudy__panel" role="tabpanel"
          id="slope-panel-assomption" aria-labelledby="slope-tab-assomption" tabindex="0">

          <div class="slopeStudy__reveal">
            <img
              class="slopeStudy__graphImg"
              src="/assets/uploads/revitalizing-hochelaga-maisonneuve/AssomptionStreet.jpg"
              alt="Slope profile graph: Assomption Boulevard"
              loading="lazy">
            <div class="slopeStudy__wipe"></div>
            <div class="slopeStudy__scan"></div>
          </div>

          <div class="slopeStudy__caption">
            Figure: slope profile along Assomption Boulevard (peak segments exceed the 6% tram limit).
          </div>
        </div>
      </div>


      <script>

      (function(){
        const root = document.querySelector('.slopeStudy');
        if(!root) return;

        const tabs = Array.from(root.querySelectorAll('.slopeStudy__tab'));
        const panels = {
          viau: root.querySelector('#slope-panel-viau'),
          assomption: root.querySelector('#slope-panel-assomption')
        };

        function setActive(key){
          tabs.forEach(t => {
            t.setAttribute('aria-selected', t.id === ('slope-tab-' + key) ? 'true' : 'false');
          });

          Object.entries(panels).forEach(([k, p]) => {
            const active = (k === key);

            if(active){
              p.classList.add('is-active');
              requestAnimationFrame(() => {
                p.classList.add('is-visible');

                /* restart wipe animation cleanly every time */
                const wipe = p.querySelector('.slopeStudy__wipe');
                const scan = p.querySelector('.slopeStudy__scan');
                if(wipe){
                  wipe.style.animation = 'none';
                  wipe.offsetHeight;
                  wipe.style.animation = '';
                }
                if(scan){
                  scan.style.animation = 'none';
                  scan.offsetHeight;
                  scan.style.animation = '';
                }
              });
            } else {
              p.classList.remove('is-visible');
              setTimeout(() => p.classList.remove('is-active'), 380);
            }
          });
        }

        root.querySelector('#slope-tab-viau').addEventListener('click', () => setActive('viau'));
        root.querySelector('#slope-tab-assomption').addEventListener('click', () => setActive('assomption'));
      })();

      </script>


      </section>
  - _block: rich_text
    block_label: Stop Access and Coverage
    content: >-
      # Stop Access and Coverage


      ![](/assets/uploads/revitalizing-hochelaga-maisonneuve/stops.jpg)


      *   Proposed tram stops are spaced about 800 meters apart to balance
      accessibility and efficiency.
          
      *   The spacing avoids overlap with existing metro service and reflects
      best practices in tram design.
          
      *   Stops are placed at key intersections and redevelopment zones to
      support network integration.
          

      ![](/assets/uploads/revitalizing-hochelaga-maisonneuve/Coverage.jpg)


      *   A 500-meter buffer analysis shows the tram extends access beyond the
      STM Green Line’s walking radius.
          
      *   It improves coverage, especially in the southern parts of the
      neighbourhood.
          
      *   The new stops complement existing bus routes, enhancing accessibility
      without replacing current services.
          

      # Sustainable Mobility Strategy


      ![](/assets/uploads/revitalizing-hochelaga-maisonneuve/Copy%20of%20URBS%20433%20FINAL%20REPORT%20MAY%201ST-2%20copy%204.jpg)


      ![](/assets/uploads/revitalizing-hochelaga-maisonneuve/Copy%20of%20URBS%20433%20FINAL%20REPORT%20MAY%201ST%20copy%202.jpg)


      *   The tram alignment crosses zones identified as vulnerable to extreme
      heat, based on climate sensitivity data.
          
      *   These areas are often far from metro access, densely built, or located
      on underused industrial land.
          
      *   To address this, the design includes green tracks—vegetated corridors
      that reduce heat and manage stormwater.
          
      *   Inspired by Paris’s T9 tramway, this approach adapts infrastructure to
      climate challenges while improving access to key community services.
  - _block: raw_html
    block_label: New development Proposal
    html: >-
      <section class="devStudy" aria-label="New Development Proposal">


      <style>
        .devStudy{
          margin: 60px 0;
          font: inherit;
          color: var(--text);
        }

        .devStudy__title{
          margin: 0 0 8px;
          font-size: 1.9em; /* match slope title */
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .devStudy__subtitle{
          margin: 0 0 18px;
          color: var(--muted);
          line-height: 1.6;
          font-size: 1em; /* match body */
        }

        /* Tabs: SAME style as slopeStudy */
        .devStudy__tabs{
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          margin: 10px 0 16px;
        }
        .devStudy__tab{
          appearance: none;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--muted);
          padding: 10px 14px;
          border-radius: 999px;
          font: inherit;
          font-size: 1em;
          line-height: 1;
          cursor: pointer;
          user-select: none;
          transition: background 180ms ease, color 180ms ease, border-color 180ms ease, transform 120ms ease;
        }
        .devStudy__tab:hover{
          color: var(--text);
          border-color: color-mix(in srgb, var(--border) 55%, var(--text) 45%);
          transform: translateY(-1px);
        }
        .devStudy__tab[aria-selected="true"]{
          background: var(--panel);
          color: var(--text);
          border-color: color-mix(in srgb, var(--border) 40%, var(--text) 60%);
        }

        /* Panel fade/slide */
        .devStudy__panel{
          display: none;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 380ms ease, transform 380ms ease;
        }
        .devStudy__panel.is-active{ display: block; }
        .devStudy__panel.is-visible{
          opacity: 1;
          transform: translateY(0);
        }

        /* Layout: image + bullets (flat, square) */
        .devStudy__grid{
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 18px;
          align-items: start;
        }
        @media (max-width: 980px){
          .devStudy__grid{ grid-template-columns: 1fr; }
        }

        .devStudy__media{
          border: 1px solid var(--border);
          background: transparent;
          overflow: hidden; /* square */
        }

        /* Click-to-zoom button wrapper (no default button styles) */
        .devStudy__imgBtn{
          all: unset;
          display: block;
          cursor: zoom-in;
        }

        /* Premium reveal animation container */
        .devStudy__reveal{
          position: relative;
          overflow: hidden;
        }

        /* Image: square corners, no cropping */
        .devStudy__img{
          width: 100%;
          height: auto;
          display: block;
          border-radius: 0;
          object-fit: contain;
          background: transparent;
        }

        /* Wipe + scan (same idea as slopeStudy) */
        .devStudy__wipe{
          position: absolute;
          inset: 0;
          background: var(--bg);
          transform: translateX(0%);
          pointer-events: none;
        }
        .devStudy__scan{
          position: absolute;
          top: 0;
          bottom: 0;
          width: 14px;
          left: 0;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent);
          opacity: 0;
          pointer-events: none;
        }

        .devStudy__panel.is-visible .devStudy__wipe{
          animation: devWipe 900ms cubic-bezier(.2,.7,.2,1) 120ms forwards;
        }
        .devStudy__panel.is-visible .devStudy__scan{
          opacity: 1;
          animation: devScan 900ms cubic-bezier(.2,.7,.2,1) 120ms forwards;
        }

        @keyframes devWipe{
          from { transform: translateX(0%); }
          to   { transform: translateX(100%); }
        }
        @keyframes devScan{
          from { transform: translateX(0%); }
          to   { transform: translateX(100%); }
        }

        .devStudy__caption{
          padding: 10px 12px;
          border-top: 1px solid var(--border);
          color: var(--muted);
          font-size: 0.92em;
          line-height: 1.4;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
        }
        .devStudy__zoomhint{
          white-space: nowrap;
          color: var(--muted);
          text-decoration: underline;
          text-underline-offset: 3px;
          cursor: zoom-in;
        }

        /* Bullets box: flat, square */
        .devStudy__aside{
          border: 1px solid var(--border);
          background: transparent;
          padding: 14px 14px 12px;
        }
        .devStudy__kicker{
          font-size: 0.78em;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 0 0 8px;
        }
        .devStudy__asideTitle{
          margin: 0 0 10px;
          font-size: 1.05em;
          font-weight: 700;
          color: var(--text);
          line-height: 1.25;
        }
        .devStudy__bullets{
          margin: 0;
          padding-left: 20px;
          line-height: 1.7;
          font-size: 1em;
          color: var(--text);
        }
        .devStudy__bullets li{ margin: 0 0 10px; }
        .devStudy__bullets li:last-child{ margin-bottom: 0; }

        /* ===== Zoom overlay (no jump) ===== */
        .devStudy__overlay{
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.86);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 18px;
          cursor: zoom-out;
        }
        .devStudy__overlay.is-open{ display: flex; }

        .devStudy__overlayInner{
          position: relative;
          width: min(1600px, 96vw);
          height: min(92vh, 1000px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .devStudy__overlayImg{
          max-width: 96vw;
          max-height: 92vh;
          width: auto;
          height: auto;
          object-fit: contain;
          background: transparent;
          border-radius: 0;
          cursor: zoom-out;
        }

        .devStudy__close{
          position: absolute;
          top: -10px;
          right: -10px;
          width: 42px;
          height: 42px;
          border-radius: 999px;
          border: 1px solid rgba(0,0,0,0.20);
          background: rgba(255,255,255,0.92);
          color: #111;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          line-height: 1;
        }
        .devStudy__close:hover{ background: rgba(255,255,255,1); }

        .devStudy__noscroll{
          overflow: hidden !important;
          touch-action: none;
        }

        @media (prefers-reduced-motion: reduce){
          .devStudy__panel,
          .devStudy__tab{
            transition: none !important;
          }
          .devStudy__panel.is-visible .devStudy__wipe,
          .devStudy__panel.is-visible .devStudy__scan{
            animation: none !important;
            opacity: 0 !important;
          }
        }
      </style>


      <h2 class="devStudy__title">New Development Proposal</h2>

      <p class="devStudy__subtitle">
        Step by step development concept showing the 3D massing, proposed plots and green spaces, and the street framework.
      </p>


      <div class="devStudy__tabs" role="tablist" aria-label="Development
      proposal tabs">
        <button class="devStudy__tab" type="button" role="tab"
          aria-selected="true" aria-controls="dev-panel-3d" id="dev-tab-3d">
          3D Development
        </button>

        <button class="devStudy__tab" type="button" role="tab"
          aria-selected="false" aria-controls="dev-panel-layout" id="dev-tab-layout">
          Plots + Green Spaces
        </button>

        <button class="devStudy__tab" type="button" role="tab"
          aria-selected="false" aria-controls="dev-panel-street" id="dev-tab-street">
          Street Framework
        </button>
      </div>


      <!-- PANELS -->

      <div class="devStudy__panelwrap">

        <!-- 3D DEVELOPMENT -->
        <div class="devStudy__panel is-active is-visible" role="tabpanel"
          id="dev-panel-3d" aria-labelledby="dev-tab-3d" tabindex="0">

          <div class="devStudy__grid">
            <div class="devStudy__media">
              <button class="devStudy__imgBtn" type="button"
                data-zoom-src="/assets/uploads/revitalizing-hochelaga-maisonneuve/development.png"
                aria-label="Open 3D development image full screen">
                <div class="devStudy__reveal">
                  <img class="devStudy__img"
                    src="/assets/uploads/revitalizing-hochelaga-maisonneuve/development.png"
                    alt="3D development concept"
                    loading="lazy">
                  <div class="devStudy__wipe"></div>
                  <div class="devStudy__scan"></div>
                </div>
              </button>

              <div class="devStudy__caption">
                <div>Figure: 3D development concept (massing and block structure).</div>
                <div class="devStudy__zoomhint" data-zoom-src="/assets/uploads/revitalizing-hochelaga-maisonneuve/development.png">Click image to zoom</div>
              </div>
            </div>

            <aside class="devStudy__aside" aria-label="Key points">
              <div class="devStudy__kicker">Key Points</div>
              <div class="devStudy__asideTitle">3D Development</div>
              <ul class="devStudy__bullets">
                <li>Illustrates the proposed block structure and built form arrangement.</li>
                <li>Shows how the new layout fits into the surrounding urban fabric.</li>
                <li>Highlights the overall development logic before detailing plots and streets.</li>
              </ul>
            </aside>
          </div>
        </div>

        <!-- PLOTS + GREEN SPACES (combined image) -->
        <div class="devStudy__panel" role="tabpanel"
          id="dev-panel-layout" aria-labelledby="dev-tab-layout" tabindex="0">

          <div class="devStudy__grid">
            <div class="devStudy__media">
              <button class="devStudy__imgBtn" type="button"
                data-zoom-src="/assets/uploads/revitalizing-hochelaga-maisonneuve/layout_dev.png"
                aria-label="Open plots and green space layout image full screen">
                <div class="devStudy__reveal">
                  <img class="devStudy__img"
                    src="/assets/uploads/revitalizing-hochelaga-maisonneuve/layout_dev.png"
                    alt="Proposed plots, green spaces, and built form"
                    loading="lazy">
                  <div class="devStudy__wipe"></div>
                  <div class="devStudy__scan"></div>
                </div>
              </button>

              <div class="devStudy__caption">
                <div>Figure: proposed plots, green spaces, and built form (combined graphic).</div>
                <div class="devStudy__zoomhint" data-zoom-src="/assets/uploads/revitalizing-hochelaga-maisonneuve/layout_dev.png">Click image to zoom</div>
              </div>
            </div>

            <aside class="devStudy__aside" aria-label="Key points">
              <div class="devStudy__kicker">Key Points</div>
              <div class="devStudy__asideTitle">Plots + Green Spaces</div>
              <ul class="devStudy__bullets">
                <li>The industrial allotment system is reorganized to introduce finer grained blocks.</li>
                <li>Restructuring improves integration with surrounding residential fabric.</li>
                <li>Green spaces are consolidated within blocks for dedicated green infrastructure zones.</li>
                <li>Layout supports higher density, mixed use development and semi private open spaces.</li>
              </ul>
            </aside>
          </div>
        </div>

        <!-- STREET FRAMEWORK -->
        <div class="devStudy__panel" role="tabpanel"
          id="dev-panel-street" aria-labelledby="dev-tab-street" tabindex="0">

          <div class="devStudy__grid">
            <div class="devStudy__media">
              <button class="devStudy__imgBtn" type="button"
                data-zoom-src="/assets/uploads/revitalizing-hochelaga-maisonneuve/street.jpg"
                aria-label="Open proposed street framework image full screen">
                <div class="devStudy__reveal">
                  <img class="devStudy__img"
                    src="/assets/uploads/revitalizing-hochelaga-maisonneuve/street.jpg"
                    alt="Proposed street grid and hierarchy"
                    loading="lazy">
                  <div class="devStudy__wipe"></div>
                  <div class="devStudy__scan"></div>
                </div>
              </button>

              <div class="devStudy__caption">
                <div>Figure: proposed street grid and hierarchy to improve connectivity.</div>
                <div class="devStudy__zoomhint" data-zoom-src="/assets/uploads/revitalizing-hochelaga-maisonneuve/street.jpg">Click image to zoom</div>
              </div>
            </div>

            <aside class="devStudy__aside" aria-label="Key points">
              <div class="devStudy__kicker">Key Points</div>
              <div class="devStudy__asideTitle">Street Framework</div>
              <ul class="devStudy__bullets">
                <li>A new street hierarchy subdivides large industrial parcels and improves walkability.</li>
                <li>Key existing streets are retained and integrated into a finer grained layout.</li>
                <li>A shared street intersects Pierre de Coubertin and Hochelaga to enhance pedestrian connectivity.</li>
                <li>Proposed streets target a typical width of 28.4 meters to support multimodal access.</li>
              </ul>
            </aside>
          </div>
        </div>
      </div>


      <!-- Zoom overlay -->

      <div class="devStudy__overlay" id="devOverlay" aria-hidden="true">
        <div class="devStudy__overlayInner" role="dialog" aria-modal="true" aria-label="Image viewer">
          <button class="devStudy__close" type="button" id="devClose" aria-label="Close">×</button>
          <img class="devStudy__overlayImg" id="devOverlayImg" alt="">
        </div>
      </div>


      <script>

      (function(){
        const root = document.querySelector('.devStudy');
        if(!root) return;

        const tabs = Array.from(root.querySelectorAll('.devStudy__tab'));
        const panels = {
          "3d": root.querySelector('#dev-panel-3d'),
          "layout": root.querySelector('#dev-panel-layout'),
          "street": root.querySelector('#dev-panel-street')
        };

        function restartReveal(panel){
          const wipe = panel.querySelector('.devStudy__wipe');
          const scan = panel.querySelector('.devStudy__scan');
          if(wipe){
            wipe.style.animation = 'none';
            wipe.offsetHeight;
            wipe.style.animation = '';
          }
          if(scan){
            scan.style.animation = 'none';
            scan.offsetHeight;
            scan.style.animation = '';
          }
        }

        function setActive(key){
          tabs.forEach(t => {
            t.setAttribute('aria-selected', t.id === ('dev-tab-' + key) ? 'true' : 'false');
          });

          Object.entries(panels).forEach(([k, p]) => {
            const active = (k === key);
            if(active){
              p.classList.add('is-active');
              requestAnimationFrame(() => {
                p.classList.add('is-visible');
                restartReveal(p);
              });
            } else {
              p.classList.remove('is-visible');
              setTimeout(() => p.classList.remove('is-active'), 380);
            }
          });
        }

        root.querySelector('#dev-tab-3d').addEventListener('click', () => setActive('3d'));
        root.querySelector('#dev-tab-layout').addEventListener('click', () => setActive('layout'));
        root.querySelector('#dev-tab-street').addEventListener('click', () => setActive('street'));

        // ===== Zoom overlay (no jump) =====
        const overlay = root.querySelector('#devOverlay');
        const overlayImg = root.querySelector('#devOverlayImg');
        const closeBtn = root.querySelector('#devClose');
        let savedScrollY = 0;

        function lockScroll(){
          savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
          document.documentElement.classList.add('devStudy__noscroll');
          document.body.classList.add('devStudy__noscroll');

          document.body.style.position = 'fixed';
          document.body.style.top = `-${savedScrollY}px`;
          document.body.style.left = '0';
          document.body.style.right = '0';
          document.body.style.width = '100%';
        }

        function unlockScroll(){
          document.documentElement.classList.remove('devStudy__noscroll');
          document.body.classList.remove('devStudy__noscroll');

          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.left = '';
          document.body.style.right = '';
          document.body.style.width = '';

          window.scrollTo(0, savedScrollY);
        }

        function openZoom(src, alt){
          overlayImg.src = src;
          overlayImg.alt = alt || 'Full image';
          overlay.classList.add('is-open');
          overlay.setAttribute('aria-hidden', 'false');
          lockScroll();
        }

        function closeZoom(){
          overlay.classList.remove('is-open');
          overlay.setAttribute('aria-hidden', 'true');
          overlayImg.src = '';
          unlockScroll();
        }

        // Open on click (image + hint)
        root.querySelectorAll('[data-zoom-src]').forEach(el => {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            const src = el.getAttribute('data-zoom-src');
            const img = el.closest('.devStudy__media')?.querySelector('img');
            openZoom(src, img ? img.alt : '');
          });
        });

        // Close controls
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeZoom();
        });

        // Click ANYWHERE closes
        overlay.addEventListener('click', (e) => {
          e.preventDefault();
          closeZoom();
        });

        // Escape closes
        window.addEventListener('keydown', (e) => {
          if(e.key === 'Escape' && overlay.classList.contains('is-open')) closeZoom();
        });
      })();

      </script>


      </section>
  - _block: raw_html
    block_label: Land use 3D
    html: >-
      <section class="landUse" aria-label="Land Use">
        <style>
          .landUse{
            margin: 60px 0;
            font: inherit;
            color: var(--text);
          }

          .landUse__title{
            margin: 0 0 14px;
            font-size: 1.9em;
            font-weight: 700;
            letter-spacing: -0.01em;
            line-height: 1.2;
          }

          .landUse__grid{
            display: grid;
            grid-template-columns: 420px 1fr;
            gap: 18px;
            align-items: stretch;
          }

          @media (max-width: 980px){
            .landUse__grid{ grid-template-columns: 1fr; }
          }

          /* LEFT PANEL */
          .landUse__panel{
            border: 1px solid var(--border);
            background: transparent;
            padding: 14px;
          }

          .landUse__head{
            display: grid;
            grid-template-columns: 1fr 140px;
            gap: 12px;
            align-items: center;
            padding: 0 0 10px;
            border-bottom: 1px solid var(--border);
            margin-bottom: 12px;
            color: var(--muted);
            font-size: 0.95em;
          }

          .landUse__rows{
            display: grid;
            gap: 10px;
          }

          .landUse__row{
            display: grid;
            grid-template-columns: 1fr 140px;
            gap: 12px;
            align-items: center;
            padding: 10px;
            border: 1px solid var(--border);
            background: transparent;
          }

          .landUse__label{
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .landUse__swatch{
            width: 14px;
            height: 14px;
            border: 1px solid var(--border);
            background: var(--swatch);
          }

          .landUse__name{
            font-weight: 600;
            color: var(--text);
          }

          /* VALUE BOX */
          .landUse__valBox{
            justify-self: end;
            min-width: 120px;
            text-align: right;
            padding: 9px 10px;
            border: 1px solid var(--border);
            background: color-mix(in srgb, var(--swatch) 28%, transparent);
            font-variant-numeric: tabular-nums;
            letter-spacing: 0.01em;
            font-weight: 600;
            font-size: 0.95em;
            color: var(--text);
          }

          /* TOTALS */
          .landUse__foot{
            margin-top: 14px;
            padding-top: 12px;
            border-top: 1px solid var(--border);
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .landUse__stat{
            border: 1px solid var(--border);
            padding: 12px 10px;
            background: transparent;
          }

          .landUse__statLabel{
            color: var(--muted);
            font-size: 0.9em;
            margin-bottom: 6px;
          }

          .landUse__statValue{
            font-weight: 650;
            font-size: 1em;
            font-variant-numeric: tabular-nums;
          }

          /* RIGHT IMAGE */
          .landUse__media{
            border: 1px solid var(--border);
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
          }

          .landUse__img{
            display: block;
            max-width: 100%;
            max-height: 82vh;
            height: auto;
            object-fit: contain;
          }

          @media (max-width: 980px){
            .landUse__img{ max-height: 70vh; }
          }
        </style>

        <h2 class="landUse__title">Land Use</h2>

        <div class="landUse__grid">
          <div class="landUse__panel">
            <div class="landUse__head">
              <div>Land Use</div>
              <div style="text-align:right;">Area (sqm)</div>
            </div>

            <div class="landUse__rows">
              <div class="landUse__row" style="--swatch:#d6a0a0;">
                <div class="landUse__label">
                  <span class="landUse__swatch"></span>
                  <span class="landUse__name">Commercial</span>
                </div>
                <div class="landUse__valBox" data-count="11794">11,794</div>
              </div>

              <div class="landUse__row" style="--swatch:#c4b4e2;">
                <div class="landUse__label">
                  <span class="landUse__swatch"></span>
                  <span class="landUse__name">Industrial</span>
                </div>
                <div class="landUse__valBox" data-count="19087">19,087</div>
              </div>

              <div class="landUse__row" style="--swatch:#89a6bf;">
                <div class="landUse__label">
                  <span class="landUse__swatch"></span>
                  <span class="landUse__name">Institutional</span>
                </div>
                <div class="landUse__valBox" data-count="25432">25,432</div>
              </div>

              <div class="landUse__row" style="--swatch:#d2b07a;">
                <div class="landUse__label">
                  <span class="landUse__swatch"></span>
                  <span class="landUse__name">Mixed-use</span>
                </div>
                <div class="landUse__valBox" data-count="75076">75,076</div>
              </div>

              <div class="landUse__row" style="--swatch:#d6de85;">
                <div class="landUse__label">
                  <span class="landUse__swatch"></span>
                  <span class="landUse__name">Residential</span>
                </div>
                <div class="landUse__valBox" data-count="231726">231,726</div>
              </div>
            </div>

            <div class="landUse__foot">
              <div class="landUse__stat">
                <div class="landUse__statLabel">Total Dwellings</div>
                <div class="landUse__statValue" data-count="13574">13,574</div>
              </div>

              <div class="landUse__stat">
                <div class="landUse__statLabel">Estimated Population</div>
                <div class="landUse__statValue" data-count="31220">31,220</div>
              </div>
            </div>
          </div>

          <div class="landUse__media">
            <img
              class="landUse__img"
              src="/assets/uploads/revitalizing-hochelaga-maisonneuve/3d_landuse.png"
              alt="3D land use"
              loading="lazy">
          </div>
        </div>

        <script>
          (function(){
            const root = document.querySelector('.landUse');
            if(!root) return;

            function format(n){
              return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            function animate(){
              const targets = root.querySelectorAll('[data-count]');

              targets.forEach(el => {
                const end = Number(el.dataset.count) || 0;
                const dur = 1500;
                const startTime = performance.now();

                el.textContent = "0";

                function tick(now){
                  const progress = Math.min(1, (now - startTime) / dur);
                  const eased = 1 - Math.pow(1 - progress, 3);
                  const value = Math.round(end * eased);
                  el.textContent = format(value);
                  if(progress < 1) requestAnimationFrame(tick);
                }

                requestAnimationFrame(tick);
              });
            }

            const io = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if(entry.isIntersecting){
                  animate();
                }
              });
            }, { threshold: 0.35 });

            io.observe(root);
          })();
        </script>
      </section>
  - _block: rich_text
    block_label: land use cont.
    content: >-
      ![](/assets/uploads/revitalizing-hochelaga-maisonneuve/landuse.jpg)


      *   The land use plan promotes a mix of functions for better integration
      with the surrounding urban fabric.
          
      *   Residential use dominates, but key commercial and institutional areas
      enhance functionality.
          
      *   A new commercial corridor along Rue Pierre-de-Coubertin connects to
      the tram line and shared street, boosting accessibility and vibrancy.
          
      *   Industrial and institutional uses are concentrated in the north to
      reduce noise near residential zones.
  - _block: rich_text
    block_label: "Building hight "
    content: >-
      # Building Heights


      ![](/assets/uploads/revitalizing-hochelaga-maisonneuve/Building_h.jpg)


      *   Building heights range from 3–4 storeys (residential) to 5–6 storeys
      (mixed-use), with 11–12 storey buildings at the edges near green spaces.
          
      *   Taller buildings are placed strategically to take advantage of views
      of the golf course and Olympic Complex.
          
      *   The redevelopment includes 12,574 new dwellings, with a projected
      population of 31,220.
          
      *   Land use mix: 64% residential, 21% mixed-use, 7% institutional, 5%
      industrial, 3% commercial—supporting density and functional diversity.
  - _block: raw_html
    block_label: download full report
    html: >-
      <section id="full-report-download" class="reportDownload"
      aria-label="Download Full Report">

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
            Full Report – Revitalizing Hochelaga-Maisonneuve
          </div>

          <div class="reportDownload__actions">
            <a
              class="reportDownload__btn"
              href="/assets/uploads/revitalizing-hochelaga-maisonneuve/revitalizing-hochelaga-maisonneuve.pdf"
              download="Revitalizing Hochelaga-Maisonneuve.pdf"
              type="application/pdf">
              Download PDF
            </a>

            <a
              class="reportDownload__btn"
              href="/assets/uploads/revitalizing-hochelaga-maisonneuve/revitalizing-hochelaga-maisonneuve.pdf"
              target="_blank"
              rel="noopener"
              type="application/pdf">
              Open in new tab
            </a>
          </div>
        </div>

      </section>
hero_image: /assets/uploads/revitalizing-hochelaga-maisonneuve/Hochelaga-vision.jpg
published: true
date: 2025-05-01T14:46
publish_at: 2025-05-01T14:46
noindex: false
visibility: visible
---
-- Title ----- */

      .slopeStudy__title{
        margin: 0 0 8px;
        font-size: 1.9em;
        font-weight: 700;
        letter-spacing: -0.01em;
      }


      .slopeStudy__subtitle{
        margin: 0 0 28px;
        color: var(--muted);
        line-height: 1.6;
        font-size: 1em;
      }


      /* ----- Map Hero ----- */

      .slopeStudy__mapWrap{
        border: 1px solid var(--border);
        border-radius: 18px;
        overflow: hidden;
        margin-bottom: 40px;
      }


      .slopeStudy__map{
        width: 100%;
        height: auto;
        display: block;
      }


      /* ----- Toggle ----- */

      .slopeStudy__toggle{
        display: flex;
        justify-content: center;
        gap: 14px;
        margin-bottom: 28px;
      }


      .slopeStudy__btn{
        appearance: none;
        border: 1px solid var(--border);
        background: transparent;
        padding: 10px 20px;
        border-radius: 999px;
        font: inherit;
        font-size: 1em;
        cursor: pointer;
        color: var(--muted);
        transition: all 200ms ease;
      }


      .slopeStudy__btn:hover{
        color: var(--text);
      }


      .slopeStudy__btn[aria-selected="true"]{
        background: var(--panel);
        color: var(--text);
        border-color: color-mix(in srgb, var(--border) 40%, var(--text) 60%);
      }


      /* ----- Graph Container ----- */

      .slopeStudy__graphWrap{
        position: relative;
        border: 1px solid var(--border);
        border-radius: 18px;
        overflow: hidden;
      }


      .slopeStudy__graph{
        display: none;
        opacity: 0;
        transform: translateY(6px);
        transition: opacity 400ms ease, transform 400ms ease;
      }


      .slopeStudy__graph.is-active{
        display: block;
      }


      .slopeStudy__graph.is-visible{
        opacity: 1;
        transform: translateY(0);
      }


      .slopeStudy__graph img{
        width: 100%;
        height: auto;
        display: block;
      }


      .slopeStudy__graph.is-visible img{
        animation: fadeInGraph 800ms ease forwards;
      }


      @keyframes fadeInGraph{
        from{ opacity:0; transform:scale(0.99); }
        to{ opacity:1; transform:scale(1); }
      }


      /* Responsive */

      @media (max-width: 900px){
        .slopeStudy__title{ font-size: 1.6em; }
      }

      </style>



      <h2 class="slopeStudy__title">Slope Profile Summary</h2>

      <p class="slopeStudy__subtitle">

      Comparison of Viau Street and Assomption Boulevard slope conditions for
      tram feasibility.

      </p>


      <!-- MAP HERO -->

      <div class="slopeStudy__mapWrap">
        <img
          class="slopeStudy__map"
          src="/assets/uploads/revitalizing-hochelaga-maisonneuve/SlopeMap.jpeg"
          alt="Slope analysis map of Viau and Assomption corridors"
          loading="lazy">
      </div>


      <!-- TOGGLE -->

      <div class="slopeStudy__toggle" role="tablist" aria-label="Slope profile
      toggle">
        <button class="slopeStudy__btn" role="tab" aria-selected="true" data-target="viau" type="button">
          Viau Street
        </button>
        <button class="slopeStudy__btn" role="tab" aria-selected="false" data-target="assomption" type="button">
          Assomption Boulevard
        </button>
      </div>


      <!-- GRAPHS -->

      <div class="slopeStudy__graphWrap">

        <div class="slopeStudy__graph is-active is-visible" id="graph-viau">
          <img
            src="/assets/uploads/revitalizing-hochelaga-maisonneuve/ViauStreet.jpeg"
            alt="Slope profile graph for Viau Street"
            loading="lazy">
        </div>

        <div class="slopeStudy__graph" id="graph-assomption">
          <img
            src="/assets/uploads/revitalizing-hochelaga-maisonneuve/AssomptionStreet.jpeg"
            alt="Slope profile graph for Assomption Boulevard"
            loading="lazy">
        </div>

      </div>


      <script>

      (function(){
        const root = document.querySelector('.slopeStudy');
        if(!root) return;

        const buttons = root.querySelectorAll('.slopeStudy__btn');
        const graphs = {
          viau: root.querySelector('#graph-viau'),
          assomption: root.querySelector('#graph-assomption')
        };

        function activate(target){
          buttons.forEach(btn=>{
            btn.setAttribute('aria-selected', btn.dataset.target === target ? 'true' : 'false');
          });

          Object.entries(graphs).forEach(([key, graph])=>{
            if(key === target){
              graph.classList.add('is-active');
              requestAnimationFrame(()=> graph.classList.add('is-visible'));
            } else {
              graph.classList.remove('is-visible');
              setTimeout(()=> graph.classList.remove('is-active'), 400);
            }
          });
        }

        buttons.forEach(btn=>{
          btn.addEventListener('click', ()=> activate(btn.dataset.target));
        });
      })();

      </script>


      </section>
date: 2025-05-01
hero_image: /assets/uploads/revitalizing-hochelaga-maisonneuve/Hochelaga-vision.jpg
---
-- Title ----- */

      .slopeStudy__title{
        margin: 0 0 8px;
        font-size: 1.9em;
        font-weight: 700;
        letter-spacing: -0.01em;
      }


      .slopeStudy__subtitle{
        margin: 0 0 28px;
        color: var(--muted);
        line-height: 1.6;
        font-size: 1em;
      }


      /* ----- Map Hero ----- */

      .slopeStudy__mapWrap{
        border: 1px solid var(--border);
        border-radius: 18px;
        overflow: hidden;
        margin-bottom: 40px;
      }


      .slopeStudy__map{
        width: 100%;
        height: auto;
        display: block;
      }


      /* ----- Toggle ----- */

      .slopeStudy__toggle{
        display: flex;
        justify-content: center;
        gap: 14px;
        margin-bottom: 28px;
      }


      .slopeStudy__btn{
        appearance: none;
        border: 1px solid var(--border);
        background: transparent;
        padding: 10px 20px;
        border-radius: 999px;
        font: inherit;
        font-size: 1em;
        cursor: pointer;
        color: var(--muted);
        transition: all 200ms ease;
      }


      .slopeStudy__btn:hover{
        color: var(--text);
      }


      .slopeStudy__btn[aria-selected="true"]{
        background: var(--panel);
        color: var(--text);
        border-color: color-mix(in srgb, var(--border) 40%, var(--text) 60%);
      }


      /* ----- Graph Container ----- */

      .slopeStudy__graphWrap{
        position: relative;
        border: 1px solid var(--border);
        border-radius: 18px;
        overflow: hidden;
      }


      .slopeStudy__graph{
        display: none;
        opacity: 0;
        transform: translateY(6px);
        transition: opacity 400ms ease, transform 400ms ease;
      }


      .slopeStudy__graph.is-active{
        display: block;
      }


      .slopeStudy__graph.is-visible{
        opacity: 1;
        transform: translateY(0);
      }


      .slopeStudy__graph img{
        width: 100%;
        height: auto;
        display: block;
      }


      .slopeStudy__graph.is-visible img{
        animation: fadeInGraph 800ms ease forwards;
      }


      @keyframes fadeInGraph{
        from{ opacity:0; transform:scale(0.99); }
        to{ opacity:1; transform:scale(1); }
      }


      /* Responsive */

      @media (max-width: 900px){
        .slopeStudy__title{ font-size: 1.6em; }
      }

      </style>



      <h2 class="slopeStudy__title">Slope Profile Summary</h2>

      <p class="slopeStudy__subtitle">

      Comparison of Viau Street and Assomption Boulevard slope conditions for
      tram feasibility.

      </p>


      <!-- MAP HERO -->

      <div class="slopeStudy__mapWrap">
        <img
          class="slopeStudy__map"
          src="/assets/uploads/revitalizing-hochelaga-maisonneuve/SlopeMap.jpeg"
          alt="Slope analysis map of Viau and Assomption corridors"
          loading="lazy">
      </div>


      <!-- TOGGLE -->

      <div class="slopeStudy__toggle" role="tablist" aria-label="Slope profile
      toggle">
        <button class="slopeStudy__btn" role="tab" aria-selected="true" data-target="viau" type="button">
          Viau Street
        </button>
        <button class="slopeStudy__btn" role="tab" aria-selected="false" data-target="assomption" type="button">
          Assomption Boulevard
        </button>
      </div>


      <!-- GRAPHS -->

      <div class="slopeStudy__graphWrap">

        <div class="slopeStudy__graph is-active is-visible" id="graph-viau">
          <img
            src="/assets/uploads/revitalizing-hochelaga-maisonneuve/ViauStreet.jpeg"
            alt="Slope profile graph for Viau Street"
            loading="lazy">
        </div>

        <div class="slopeStudy__graph" id="graph-assomption">
          <img
            src="/assets/uploads/revitalizing-hochelaga-maisonneuve/AssomptionStreet.jpeg"
            alt="Slope profile graph for Assomption Boulevard"
            loading="lazy">
        </div>

      </div>


      <script>

      (function(){
        const root = document.querySelector('.slopeStudy');
        if(!root) return;

        const buttons = root.querySelectorAll('.slopeStudy__btn');
        const graphs = {
          viau: root.querySelector('#graph-viau'),
          assomption: root.querySelector('#graph-assomption')
        };

        function activate(target){
          buttons.forEach(btn=>{
            btn.setAttribute('aria-selected', btn.dataset.target === target ? 'true' : 'false');
          });

          Object.entries(graphs).forEach(([key, graph])=>{
            if(key === target){
              graph.classList.add('is-active');
              requestAnimationFrame(()=> graph.classList.add('is-visible'));
            } else {
              graph.classList.remove('is-visible');
              setTimeout(()=> graph.classList.remove('is-active'), 400);
            }
          });
        }

        buttons.forEach(btn=>{
          btn.addEventListener('click', ()=> activate(btn.dataset.target));
        });
      })();

      </script>


      </section>
date: 2025-05-01
hero_image: /assets/uploads/revitalizing-hochelaga-maisonneuve/Hochelaga-vision.jpg
---
