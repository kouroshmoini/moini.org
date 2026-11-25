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
})();
