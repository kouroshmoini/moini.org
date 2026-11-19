/* Browser regression checks. Run after a Jekyll build with Playwright installed. */
const { chromium, webkit } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const base = process.env.UI_BASE_URL || 'http://127.0.0.1:4000';
const routes = [
  '/', '/blog/', '/about/', '/projects/chinatown-gateway/',
  '/2025/05/01/transit-led-brownfield-redevelopment-in-hochelaga-maisonneuve/',
  '/2025/04/14/muskrat-falls-a-case-study-in-megaproject-mismanagement/'
];
const sizes = [
  {name:'desktop',width:1440,height:1000},
  {name:'iphone-se',width:375,height:667},
  {name:'iphone',width:390,height:844},
  {name:'iphone-large',width:430,height:932},
  {name:'landscape',width:844,height:390}
];
(async () => {
  await fs.mkdir('ui-checks', {recursive:true});
  let checked = 0;
  for (const [name, engine] of Object.entries({chromium, webkit})) {
    const browser = await engine.launch();
    try {
      for (const size of sizes) {
        const context = await browser.newContext({
          viewport:{width:size.width,height:size.height},
          isMobile:size.width<900, hasTouch:size.width<900, deviceScaleFactor:1
        });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        for (const theme of ['light','dark']) {
          await page.emulateMedia({colorScheme:theme});
          for (let i=0;i<routes.length;i++) {
            const response=await page.goto(base+routes[i],{waitUntil:'networkidle'});
            assert.equal(response.status(),200);
            await page.locator('h1').waitFor();
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1),true,name+' '+size.name+' '+routes[i]+' overflow');
            const missing=await page.locator('.report-contents a').evaluateAll(links=>links.filter(a=>!document.getElementById(decodeURIComponent(a.hash.slice(1)))).length);
            assert.equal(missing,0,'Missing report section');
            const planes = await page.locator('.ambient-map svg').evaluateAll(svgs => svgs.map(svg => {
              const {a, d, e, f} = svg.getScreenCTM();
              return [a, d, e, f];
            }));
            assert.equal(planes.length, 2);
            assert.ok(Math.abs(planes[0][0] - planes[0][1]) < .001, 'City dots must remain circular');
            assert.deepEqual(planes[0], planes[1], 'Responder lights must track the same streets');
            if(size.name==='iphone' || size.name==='desktop') {
              await page.screenshot({path:'ui-checks/'+name+'-'+size.name+'-'+theme+'-'+i+'.png'});
            }
            checked++;
          }
        }
        assert.deepEqual(errors, [], name + ' ' + size.name + ' browser errors');
        await context.close();
      }
      const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
      const page=await context.newPage();
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(base+routes[3],{waitUntil:'networkidle'});
      assert.equal(await page.locator('.report-contents').evaluate(e=>e.open),false);
      await page.locator('.report-contents summary').click();
      await page.locator('.report-contents a').nth(1).click();
      assert.equal(await page.locator('.report-contents').evaluate(e=>e.open),false);
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
      await page.locator('#themeToggle').click();
      assert.equal(await page.locator('.theme-icon:not([hidden])').count(),1);
      await page.locator('#openSearch').click();
      await page.locator('#searchInput').fill('Chinatown');
      await page.locator('#searchResults a').first().waitFor();
      assert.equal(await page.locator('#searchInput').evaluate(e=>getComputedStyle(e).fontSize),'16px');
      await page.keyboard.press('Escape');
      await page.locator('.corridor-stops a').first().click();
      assert.equal(await page.locator('.corridor-preview').isVisible(),true);
      await page.locator('.corridor-preview-image').scrollIntoViewIfNeeded();
      const scroll=await page.evaluate(()=>scrollY);
      const selectedSrc = await page.locator('.corridor-preview .figure-art img').evaluate(img=>img.src);
      await page.locator('.corridor-preview-image').click();
      await page.locator('.viewer-canvas[aria-busy="false"]').waitFor();
      assert.equal(await page.locator('#imageViewer').evaluate(e=>e.open),true);
      assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('modal-open')),true);
      const viewer=await page.locator('#imageViewer').boundingBox();
      assert.ok(viewer.width<=391 && viewer.height<=845,'Viewer must fit phone');
      await page.locator('[data-viewer-zoom]').click();
      assert.equal(await page.locator('[data-viewer-zoom]').getAttribute('aria-pressed'),'true');
      await page.getByRole('button',{name:'Zoom out',exact:true}).click();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('.viewer-canvas img').evaluate(img=>img.src),selectedSrc);
      assert.equal(await page.locator('[data-viewer-next],[data-viewer-prev]').count(),0);
      await page.locator('.viewer-canvas[aria-busy="false"]').waitFor();
      await page.locator('[aria-label="Close image"]').click();
      await page.waitForFunction(()=>!document.documentElement.classList.contains('modal-open'));
      assert.ok(Math.abs(await page.evaluate(()=>scrollY)-scroll)<3,'Closing image restores reading position');
      await page.goto(base+routes[4],{waitUntil:'networkidle'});
      const tabs=page.locator('[data-comparison]').first().locator('[role="tab"]');
      await tabs.first().focus();await page.keyboard.press('ArrowRight');
      assert.equal(await tabs.nth(1).getAttribute('aria-selected'),'true');
      await page.goto(base+'/blog/',{waitUntil:'networkidle'});
      await page.locator('[data-filter="gis"]').click();
      assert.ok(await page.locator('.writing-row:visible').count()>0);
      assert.deepEqual(errors,[]);
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.goto(base+routes[4],{waitUntil:'networkidle'});
      assert.equal(await page.locator('.ambient-map-agents').getAttribute('hidden'),'');
      assert.equal(await page.locator('.report-content > p').first().evaluate(e=>e.getAnimations().length),0);
      assert.equal(await page.locator('.proposal-statistics strong').first().evaluate(e=>e.querySelector('[aria-hidden]')!==null),false);
      await context.close();
      const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
      const nojsPage=await nojs.newPage();
      await nojsPage.goto(base+routes[4]);
      assert.equal(await nojsPage.locator('#primaryNav').isVisible(),true);
      assert.equal(await nojsPage.locator('.report-contents').evaluate(e=>e.open),true);
      assert.ok(await nojsPage.locator('.comparison-panel:visible').count()>1);
      await nojs.close();
      console.log(name+': responsive layouts, themes, navigation, search, viewer, tabs, reduced motion and no-JS checks passed');
    } finally { await browser.close(); }
  }
  console.log('Verified '+checked+' page / viewport / theme combinations.');
})().catch(error=>{console.error(error);process.exitCode=1});
