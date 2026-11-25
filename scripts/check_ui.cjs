/* Browser regression checks. Run after a Jekyll build with Playwright installed. */
const { chromium, firefox, webkit } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
// Serve the built site on an available loopback port on each test OS.
async function serveBuild() {
  const server = require('http-server').createServer({root: '_site', cache: -1});
  await new Promise((resolve, reject) => {
    server.server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  server.server.unref();
  return 'http://127.0.0.1:' + server.server.address().port;
}
const routes = [
  '/', '/blog/', '/about/', '/projects/chinatown-gateway/',
  '/2025/05/01/transit-led-brownfield-redevelopment-in-hochelaga-maisonneuve/',
  '/2025/04/14/muskrat-falls-a-case-study-in-megaproject-mismanagement/'
];
const sizes = [
  {name:'laptop',width:1280,height:800,minPageWidth:1150,minReportWidth:900},
  {name:'desktop',width:1440,height:1000,minPageWidth:1300,minReportWidth:980},
  {name:'full-hd',width:1920,height:1080,minPageWidth:1700,minReportWidth:1200},
  {name:'wide',width:2560,height:1440,minPageWidth:2050,minReportWidth:1300},
  {name:'tablet',width:768,height:1024},
  {name:'iphone-se',width:375,height:667},
  {name:'iphone',width:390,height:844},
  {name:'iphone-large',width:430,height:932},
  {name:'landscape',width:844,height:390}
];
function corridorIsMoving() {
  const video = document.querySelector('.corridor-film');
  const image = document.querySelector('.corridor-film-fallback');
  return (!video.paused && video.currentTime > .1) ||
    (!image.hidden && image.src.startsWith('blob:') && image.complete && image.naturalWidth > 0);
}

(async () => {
  await fs.mkdir('ui-checks', {recursive:true});
  const base = process.env.UI_BASE_URL || await serveBuild();
  let checked = 0;
  for (const [name, engine] of Object.entries({chromium, firefox, webkit})) {
    if (process.env.UI_BROWSER && name !== process.env.UI_BROWSER) continue;
    const browser = await engine.launch({channel: process.env.UI_CHANNEL || undefined});
    try {
      for (const size of sizes) {
        const context = await browser.newContext({
          viewport:{width:size.width,height:size.height},
          isMobile:name !== 'firefox' && size.width<900, hasTouch:size.width<900, deviceScaleFactor:1
        });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        for (const theme of ['light','dark']) {
          await page.emulateMedia({colorScheme:theme});
          for (let i=0;i<routes.length;i++) {
            const response=await page.goto(base+routes[i],{waitUntil:'networkidle'});
            assert.ok([200,304].includes(response.status()), 'Page must load or validate its cached content');
            await page.locator('h1').waitFor();
            assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1),true,name+' '+size.name+' '+routes[i]+' overflow');
            const surface = await page.locator('body').boundingBox();
            const wordmark = page.locator('.wordmark-name');
            assert.ok(await wordmark.evaluate(el => parseFloat(getComputedStyle(el).fontSize) >= 20));
            if (i === 0 && size.minPageWidth) {
              const main = await page.locator('main').boundingBox();
              assert.ok(main.width >= size.minPageWidth, size.name + ' needs room for the homepage');
              assert.ok(main.width <= 2113, 'The homepage should keep a maximum width');
              assert.ok(Math.abs(main.x - surface.x - (surface.width - main.width) / 2) < 2);
              const covers = await page.locator('.post-gallery .entry-image').all();
              if (covers.length > 1) assert.equal((await covers[0].boundingBox()).y, (await covers[1].boundingBox()).y);
            }
            const fonts = await page.evaluate(async () => {
              await document.fonts.ready;
              return [document.body, document.querySelector('h1')].map(el => {
                const family = getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim();
                return [...document.fonts].some(face => face.family.replace(/["']/g, '') === family && face.status === 'loaded') ? family : '';
              });
            });
            assert.deepEqual(fonts, ['Nunito', 'Bricolage Grotesque']);
            if (i >= 3) {
              const figures = await page.locator('.post-hero img, .report-content > .report-figure img, .post-uniform-figures .report-figure img, .corridor-film-poster').all();
              const prose = await page.locator('.report-content > p').first().boundingBox();
              assert.ok(figures.length > 0);
              for (const figure of figures) {
                const box = await figure.boundingBox();
                assert.ok(Math.abs(box.x - prose.x) < 2 && Math.abs(box.width - prose.width) < 2,
                  name + ' ' + size.name + ' artwork must align with the text on ' + routes[i]);
                if (await figure.evaluate(img => img.complete && img.naturalWidth > 0 && !img.matches('.corridor-film-poster'))) {
                  const ratio = await figure.evaluate(img => img.naturalHeight / img.naturalWidth);
                  assert.ok(Math.abs(box.height - ratio * box.width) < 2, 'Artwork should keep its intrinsic proportions');
                }
              }
            }
            if (i === 3) {
              const content = await page.locator('.report-content').boundingBox();
              const paragraph = await page.locator('.report-content > p').first().boundingBox();
              const main = await page.locator('main').boundingBox();
              assert.ok(Math.abs(content.x - main.x - (main.width - content.width) / 2) < 2,
                'Centre the reading column within the page: ' + JSON.stringify({content, main}));
              if (size.minReportWidth) {
                assert.ok(content.width >= size.minReportWidth, size.name + ' needs a wider reading column');
              } else if (size.width <= 430) {
                assert.ok(content.width >= size.width - 46, 'The report should use the available phone width');
              }
              assert.ok(content.width <= 1329);
              assert.ok(paragraph.width >= content.width - 2, 'Prose should fill its reading column');
            }
            const missing=await page.locator('.report-contents a').evaluateAll(links=>links.filter(a=>!document.getElementById(decodeURIComponent(a.hash.slice(1)))).length);
            assert.equal(missing,0,'Missing report section');
            const planes = await page.locator('.ambient-map svg').evaluateAll(svgs => svgs.map(svg => {
              const {a, d, e, f} = svg.getScreenCTM();
              return [a, d, e, f];
            }));
            assert.equal(planes.length, 1);
            assert.ok(Math.abs(planes[0][0] - planes[0][1]) < .001, 'City dots must remain circular');
            if(size.name==='iphone' || size.name==='desktop') {
              await page.screenshot({path:'ui-checks/'+name+'-'+size.name+'-'+theme+'-'+i+'.png'});
            }
            if (i === 3 && size.name === 'desktop' && theme === 'light') {
              const film = page.locator('.corridor-film');
              const stage = page.locator('.project-map-stage');
              await stage.scrollIntoViewIfNeeded();
              assert.ok(await film.evaluate(v => (v.autoplay || v.hidden) && v.muted && v.hasAttribute('playsinline') && v.loop && !v.controls));
              await page.waitForFunction(corridorIsMoving);
              if (await film.isVisible()) {
                await film.evaluate(v => v.pause());
                await page.waitForFunction(corridorIsMoving);
              }
              await page.locator('h1').scrollIntoViewIfNeeded();
              await page.waitForFunction(() => document.querySelector('.project-map-stage').getBoundingClientRect().top >= innerHeight);
              await stage.scrollIntoViewIfNeeded();
              await page.waitForFunction(corridorIsMoving);

              if (await film.isVisible()) {
                await film.evaluate(v => {
                  v.currentTime = v.duration - .3;
                });
                await page.waitForFunction(() => {
                  const video = document.querySelector('.corridor-film');
                  return video.currentTime < 1 || video.hidden;
                });
              }
              if (await film.isVisible()) {
                // A stalled video can remain in the playing state without advancing.
                await film.evaluate(v => Object.defineProperty(v, 'currentTime', {value: v.currentTime}));
              }
              await page.locator('.corridor-film-fallback').waitFor({state:'visible'});
              assert.ok(await page.locator('.corridor-film-fallback').evaluate(img => img.complete && img.naturalWidth > 0));
              for (const marker of await page.locator('.map-hotspot').all()) {
                await marker.hover();
                const drawing = marker.locator('.map-stop-thumbnail');
                await drawing.waitFor({state:'visible'});
                assert.ok(await drawing.evaluate(img => img.complete && img.naturalWidth > 0));
              }
            }
            checked++;
          }
        }
        assert.deepEqual(errors, [], name + ' ' + size.name + ' browser errors');
        await context.close();
      }
      const context=await browser.newContext({viewport:{width:390,height:844},isMobile:name !== 'firefox',hasTouch:true});
      const page=await context.newPage();
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(base+routes[3],{waitUntil:'networkidle'});
      await page.locator('.project-map-stage').scrollIntoViewIfNeeded();
      await page.waitForFunction(corridorIsMoving);
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
      const markers = page.locator('.map-hotspot');
      for (const marker of await markers.all()) {
        await marker.tap();
        await marker.locator('.map-stop-thumbnail').waitFor({state:'visible'});
        assert.equal(await marker.getAttribute('aria-expanded'), 'true');
      }
      await markers.last().tap();
      await markers.last().locator('.map-stop-thumbnail').waitFor({state:'hidden'});
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
      const story = page.locator('[aria-labelledby="transit-analysis"]');
      assert.equal(await story.locator('.map-essay-entry:visible').count(), 3);
      assert.equal(await story.getByRole('tab').count(), 0);
      assert.equal(await story.locator('.image-enlarge').count(), 3);
      await page.goto(base+'/blog/',{waitUntil:'networkidle'});
      assert.equal(await page.locator('[data-filter], .project-filters').count(), 0);
      const allPosts = await page.locator('.post-index .post-entry > a').evaluateAll(links => links.map(a => a.pathname));
      for (const route of routes.slice(3)) assert.ok(allPosts.includes(route));
      await page.goto(base + '/');
      const recentPosts = await page.locator('.post-gallery .post-entry > a').evaluateAll(links => links.map(a => a.pathname));
      assert.deepEqual(recentPosts, allPosts.slice(0, 3));
      await page.goto(base + '/about/');
      await page.emulateMedia({media:'print'});
      assert.equal(await page.locator('.about-actions').isVisible(), false);
      assert.equal(await page.locator('#education').isVisible(), true);
      await page.emulateMedia({media:'screen'});
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
      assert.ok(await nojsPage.locator('.map-essay-entry:visible').count()>1);
      await nojs.close();
      const blockedVideo = await browser.newContext({viewport:{width:390,height:844}});
      const fallbackPage = await blockedVideo.newPage();
      await fallbackPage.route('**/corridor-day-night.mp4', route => route.abort());
      await fallbackPage.goto(base+routes[3]);
      await fallbackPage.locator('.project-map-stage').scrollIntoViewIfNeeded();
      await fallbackPage.locator('.corridor-film-fallback').waitFor({state:'visible'});
      await fallbackPage.waitForFunction(() => {
        const image = document.querySelector('.corridor-film-fallback');
        return image.src.startsWith('blob:') && image.complete && image.naturalWidth > 0;
      });
      assert.equal(await fallbackPage.locator('video').evaluate(v => v.controls), false);
      await fallbackPage.emulateMedia({reducedMotion:'reduce'});
      await fallbackPage.locator('.corridor-film-fallback').waitFor({state:'hidden'});
      assert.equal(await fallbackPage.locator('.corridor-film-poster').isVisible(), true);
      await fallbackPage.emulateMedia({reducedMotion:'no-preference'});
      await fallbackPage.locator('.corridor-film-fallback').waitFor({state:'visible'});
      await blockedVideo.close();
      console.log(name+': responsive layouts, themes, navigation, search, viewer, tabs, reduced motion and no-JS checks passed');
    } finally { await browser.close(); }
  }
  console.log('Verified '+checked+' page / viewport / theme combinations.');
})().catch(error=>{console.error(error);process.exitCode=1});
