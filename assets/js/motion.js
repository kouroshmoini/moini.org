/* One scroll update for reading position, header, and back-to-top. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const top = document.querySelector('.back-top');
  const content = document.querySelector('.report-content');
  const progress = document.querySelector('.reading-progress');
  const contents = document.querySelector('.report-contents');
  const links = [...document.querySelectorAll('.report-contents a')];
  const sections = links.map(link => document.getElementById(decodeURIComponent(link.hash.slice(1))));
  const mobile = matchMedia('(max-width: 50rem)');
  let frame = 0, current = -1;
  function update() {
    frame = 0;
    header?.classList.toggle('is-scrolled', scrollY > 16);
    if (top) top.hidden = scrollY < 700;
    if (!content || !progress) return;
    const offset = (header?.getBoundingClientRect().height || 80) + 24;
    const bounds = content.getBoundingClientRect();
    const distance = content.offsetHeight - innerHeight + offset;
    progress.hidden = distance <= 0;
    if (!progress.hidden) progress.firstElementChild.style.transform =
      'scaleX(' + Math.max(0, Math.min(1, (offset - bounds.top) / distance)) + ')';
    let index = 0;
    sections.forEach((section, i) => { if (section && section.getBoundingClientRect().top <= offset + 32) index = i; });
    if (index === current) return;
    current = index;
    links.forEach((link, i) => i === index ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
  }
  function queue() { if (!frame) frame = requestAnimationFrame(update); }
  addEventListener('scroll', queue, {passive: true});
  addEventListener('resize', queue);
  if (content && 'ResizeObserver' in window) new ResizeObserver(queue).observe(content);
  if (contents) {
    const adaptContents = () => { contents.open = !mobile.matches; };
    mobile.addEventListener('change', adaptContents); adaptContents();
    links.forEach(link => link.addEventListener('click', () => {
      if (!mobile.matches) return;
      contents.open = false;
      // Resolve the anchor after the collapsed contents has changed page height.
      requestAnimationFrame(() => {
        const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
        if (!target) return;
        target.tabIndex = -1; target.focus({preventScroll: true});
        target.scrollIntoView({behavior: reduce.matches ? 'instant' : 'smooth'});
      });
    }));
  }
  update();
  // Scroll-linked entrances reverse at the lower viewport edge. Never fade content
  // out at the top: long reports must stay readable while their figures are explored.
  const selector = '.work-card,.profile-entry,.skill-grid > div,.writing-row,.report-content > p,.report-content > h2,.report-content > ul,.report-content > figure,.report-content > section,.report-content > .report-table-wrap,.proposal-statistics';
  const items = [...document.querySelectorAll(selector)]
    .filter(el => !el.parentElement.closest(selector))
    .map(el => ({el, y: 0}));
  const nearby = new Set();
  let revealFrame = 0;
  const paintReveals = () => {
    revealFrame = 0;
    const readings = [...nearby].map(item => ({item, top: item.el.getBoundingClientRect().top - item.y}));
    readings.forEach(({item, top}) => {
      const focused = item.el.matches(':focus-within, :target') || item.el.querySelector(':target');
      const t = reduce.matches || focused ? 1 : Math.max(0, Math.min(1, (innerHeight * .98 - top) / (innerHeight * .28)));
      const eased = 1 - Math.pow(1 - t, 3);
      item.y = (1 - eased) * 18;
      item.el.style.setProperty('--reveal-y', item.y + 'px');
      item.el.style.setProperty('--reveal-opacity', String(.16 + .84 * eased));
    });
  };
  const queueReveals = () => { if (!revealFrame) revealFrame = requestAnimationFrame(paintReveals); };
  if ('IntersectionObserver' in window) {
    const byElement = new Map(items.map(item => [item.el, item]));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const item = byElement.get(entry.target);
        if (entry.isIntersecting) nearby.add(item);
        else {
          nearby.delete(item); item.y = 0;
          item.el.style.removeProperty('--reveal-y');
          item.el.style.removeProperty('--reveal-opacity');
        }
      });
      queueReveals();
    }, {rootMargin: '80px 0px'});
    items.forEach(item => { item.el.classList.add('scroll-reveal'); observer.observe(item.el); });
    addEventListener('scroll', queueReveals, {passive: true});
    addEventListener('resize', queueReveals);
    document.addEventListener('focusin', queueReveals);
    addEventListener('hashchange', queueReveals);
    reduce.addEventListener('change', queueReveals);
  }
})();
