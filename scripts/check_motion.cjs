/* Scroll reversal and project exploration across desktop and iPhone WebKit. */
const {chromium, webkit} = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.UI_BASE_URL || 'http://127.0.0.1:4000';
const path = '/2025/05/01/transit-led-brownfield-redevelopment-in-hochelaga-maisonneuve/';
(async () => {
  for (const engine of [chromium, webkit]) {
    const browser = await engine.launch();
    try {
      for (const width of [390, 1440]) for (const colorScheme of ['light', 'dark']) {
        const page = await browser.newPage({viewport:{width,height:844},colorScheme,hasTouch:width===390,isMobile:width===390});
        await page.goto(base+path, {waitUntil:'networkidle'});
        const comparison = page.locator('[data-comparison]').first();
        await comparison.locator('.comparison-steps button').last().click();
        await page.waitForTimeout(100);
        assert.equal(await comparison.locator('[aria-selected="true"]').textContent(), 'Earlier alignment');
        await comparison.locator('[role="tab"]').nth(1).focus();
        await page.keyboard.press('End');
        assert.equal(await comparison.locator('[aria-selected="true"]').textContent(), 'Proposed alignment');
        const land = page.locator('[data-landuse-id="residential"]');
        await land.click();
        assert.equal(await page.locator('.landuse-row-active .landuse-residential').count(), 1);
        await land.click();
        assert.equal(await page.locator('.landuse-row-active').count(), 0);
        const views = page.locator('[data-comparison]').last();
        await views.locator('.comparison-steps button').last().click();
        assert.equal(await views.locator('.comparison-panel:not([hidden]) img').getAttribute('src'), '/assets/uploads/revitalizing-hochelaga-maisonneuve/landuse.jpg');
        // Move focus away, then compare the same paragraph at entry, reading, entry.
        await page.evaluate(() => document.activeElement.blur());
        const item = page.locator('.report-content > p.scroll-reveal').nth(3);
        async function position(fraction) {
          await item.evaluate((el, f) => {
            const y = parseFloat(el.style.getPropertyValue('--reveal-y')) || 0;
            scrollTo({top:scrollY+el.getBoundingClientRect().top-y-innerHeight*f,behavior:'instant'});
          }, fraction);
          await page.waitForTimeout(200);
          return Number(await item.evaluate(el=>getComputedStyle(el).opacity));
        }
        const entering = await position(.94);
        const reading = await position(.5);
        const reversing = await position(.94);
        assert.ok(entering < .8 && entering > .15, 'Entrance fades progressively');
        assert.equal(reading, 1, 'Reading zone remains fully visible');
        assert.ok(reversing < .8, 'Upward scroll reverses the entrance');
        await page.emulateMedia({reducedMotion:'reduce'});
        assert.equal(await position(.94), 1, 'Reduced motion keeps content visible');
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
        await page.screenshot({path:`ui-checks/motion-${engine.name()}-${width}-${colorScheme}.png`});
        await page.close();
      }
      const page = await browser.newPage({javaScriptEnabled:false});
      await page.goto(base+path);
      assert.equal(await page.locator('#landuse-views-panel-1').isVisible(),true);
      assert.equal(await page.locator('#landuse-views-panel-2').isVisible(),true);
      await page.close();
    } finally { await browser.close(); }
  }
  console.log('Scroll reversal, reading visibility, reduced motion, project controls and no-JS fallback passed in Chromium and WebKit.');
})().catch(error=>{console.error(error);process.exit(1);});
