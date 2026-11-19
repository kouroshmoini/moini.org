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
  const portrait = matchMedia('(max-width: 50rem) and (min-height: 40rem) and (orientation: portrait)');
  const hero = document.querySelector('.hero');
  const inset = () => (header?.offsetHeight || 0) + 12;
  const studies = [];
  for (const root of document.querySelectorAll('[data-sequence]')) {
    if (root.dataset.sequence === 'narrative') {
      for (const paragraph of [...root.children]) {
        const figure = paragraph.nextElementSibling;
        if (!paragraph.matches('p') || !figure?.matches('figure')) continue;
        const row = document.createElement('div');
        paragraph.before(row);
        row.append(paragraph, figure);
      }
    }
    const steps = [...root.children];
    const images = steps.map(step => step.querySelector('a[data-image-viewer] img'));
    if (steps.length < 2 || images.some(image => !image)) continue;
    const stage = document.createElement('button');
    stage.type = 'button';
    stage.className = 'study-stage';
    root.prepend(stage);
    root.style.setProperty('--study-end', steps.length + 1);
    const plates = images.map(image => {
      const plate = image.cloneNode(false);
      plate.alt = '';
      stage.append(plate);
      return plate;
    });
    steps.forEach(step => step.classList.add('study-step'));
    const study = {root, stage, steps, plates, images, current: -1};
    stage.addEventListener('click', () => images[study.current]?.closest('a').click());
    studies.push(study);
  }

  function updateScenes() {
    if (hero && !reduce.matches) {
      const box = hero.getBoundingClientRect();
      hero.style.setProperty('--cover-shift', (clamp((inset() - box.top) / box.height) * 7).toFixed(2) + '%');
    }
    if (reduce.matches) return;
    for (const study of studies) {
      if (!study.root.classList.contains('guided-study')) continue;
      const box = study.root.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) continue;
      const centres = study.steps.map(step => {
        const rect = step.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });
      const line = innerHeight * (wide.matches ? .52 : .7);
      let position = 0;
      for (let i = 1; i < centres.length; i++) {
        const fraction = clamp((line - centres[i-1]) / Math.max(1, centres[i] - centres[i-1]));
        const blend = clamp((fraction - .28) / .44);
        position += blend * blend * (3 - 2 * blend);
      }
      const lower = Math.floor(position);
      study.plates.forEach((plate, index) => {
        // Opaque lower plate lets the incoming map dissolve without a white flash.
        plate.style.opacity = index === lower ? 1 : index === lower + 1 ? position - lower : 0;
      });
      const current = Math.round(position);
      if (study.current !== current) {
        study.current = current;
        study.stage.setAttribute('aria-label', 'Enlarge: ' + study.images[current].alt);
      }
    }
  }
  function adaptScenes() {
    studies.forEach(study => study.root.classList.toggle('guided-study', !reduce.matches && (wide.matches || (portrait.matches && study.root.dataset.sequence !== 'comparison'))));
    update();
  }
  wide.addEventListener('change', adaptScenes);
  portrait.addEventListener('change', adaptScenes);
  reduce.addEventListener('change', adaptScenes);
  adaptScenes();
})();
