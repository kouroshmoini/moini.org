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
    updateScenes();
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
  const clamp = value => Math.max(0, Math.min(1, value));
  const wide = matchMedia('(min-width: 60rem) and (min-height: 38rem)');
  const hero = document.querySelector('.hero');
  const gallery = document.querySelector('#project-gallery');
  const runway = gallery?.closest('.gallery-runway');
  const frameElement = gallery?.closest('.gallery-frame');
  const nav = frameElement?.querySelector('.gallery-nav');
  const cards = gallery ? [...gallery.children] : [];
  const buttons = nav ? [...nav.children] : [];
  const inset = () => (header?.offsetHeight || 0) + 12;
  let pinned = false;

  function sizeGallery() {
    if (!gallery || cards.length < 2) return;
    nav.hidden = false;
    runway.classList.add('gallery-ready');
    pinned = wide.matches && !reduce.matches && frameElement.offsetHeight + inset() + 12 <= innerHeight;
    runway.classList.toggle('gallery-pinned', pinned);
    runway.style.setProperty('--pin-top', inset() + 'px');
    runway.style.setProperty('--travel', Math.min(innerHeight * .8, gallery.clientWidth) + 'px');
    queue();
  }

  function showProject(index) {
    if (pinned) {
      const length = runway.offsetHeight - frameElement.offsetHeight;
      window.scrollTo({top: scrollY + runway.getBoundingClientRect().top - inset() +
        length * index / (cards.length - 1), behavior: 'instant'});
    } else {
      gallery.scrollTo({left: cards[index].offsetLeft - cards[0].offsetLeft,
        behavior: reduce.matches ? 'instant' : 'smooth'});
    }
  }
  function markProject() {
    const distance = gallery.scrollWidth - gallery.clientWidth;
    const index = distance ? Math.round((cards.length - 1) * gallery.scrollLeft / distance) : 0;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  }
  buttons.forEach((button, i) => button.addEventListener('click', () => showProject(i)));
  cards.forEach((card, i) => card.addEventListener('focus', () => {
    if (pinned) showProject(i);
  }));
  gallery?.addEventListener('scroll', markProject, {passive: true});
  if (gallery && 'ResizeObserver' in window) new ResizeObserver(sizeGallery).observe(frameElement);

  // Keep the two original site-analysis figures paired with their own text.
  const analysis = document.querySelector('#site-analysis');
  let mapStory, mapSteps = [], maps = [];
  if (analysis) {
    let element = analysis.nextElementSibling;
    while (element?.matches('p') && element.nextElementSibling?.matches('.report-figure')) {
      mapSteps.push(element);
      maps.push(element.nextElementSibling);
      element = element.nextElementSibling.nextElementSibling;
    }
    if (maps.length > 1) {
      mapStory = document.createElement('div');
      mapStory.className = 'map-story';
      analysis.after(mapStory);
      mapSteps.forEach((paragraph, i) => {
        const step = document.createElement('div');
        step.className = 'map-step';
        step.append(paragraph, maps[i]);
        mapStory.append(step);
      });
    }
  }
  function updateScenes() {
    if (hero && !reduce.matches) {
      const box = hero.getBoundingClientRect();
      const progress = clamp((inset() - box.top) / box.height);
      hero.style.setProperty('--cover-shift', (progress * 7).toFixed(2) + '%');
    }
    if (pinned) {
      const distance = runway.offsetHeight - frameElement.offsetHeight;
      const progress = clamp((inset() - runway.getBoundingClientRect().top) / Math.max(1, distance));
      gallery.scrollLeft = progress * (gallery.scrollWidth - gallery.clientWidth);
    }
    if (mapStory) {
      const sequence = wide.matches && !reduce.matches;
      const active = mapSteps.reduce((last, paragraph, i) =>
        paragraph.getBoundingClientRect().top <= innerHeight * .55 ? i : last, 0);
      maps.forEach((figure, i) => {
        figure.classList.toggle('current-map', i === active);
        figure.inert = sequence && i !== active;
      });
    }
  }
  function adaptScenes() {
    mapStory?.classList.toggle('map-guided', wide.matches && !reduce.matches);
    sizeGallery();
    update();
    if (gallery) markProject();
  }
  addEventListener('resize', sizeGallery);
  reduce.addEventListener('change', adaptScenes);
  wide.addEventListener('change', adaptScenes);
  adaptScenes();
})();
