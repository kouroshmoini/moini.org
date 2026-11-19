/* Progressive project exploration. Source data and all original figures remain readable without JS. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-project-map]').forEach(root => {
    const film = root.querySelector('.corridor-film');
    if (film) {
      function applyMotionPreference() {
        film.autoplay = !reduce.matches;
        if (reduce.matches) film.pause();
      }
      applyMotionPreference();
      reduce.addEventListener('change', applyMotionPreference);
    }
    const links = [...root.querySelectorAll('.corridor-stops a, .map-hotspot')];
    const panel = root.querySelector('.corridor-preview');
    const figures = new Map([...document.querySelectorAll('.chinatown-visuals figure')].map(figure => [figure.id, figure]));
    let selected;
    let hovered;
    let focused;

    function highlight() {
      const active = hovered || focused || selected;
      links.forEach(link => link.classList.toggle('is-previewed', link.hash.slice(1) === active));
      figures.forEach((figure, id) => figure.classList.toggle('is-previewed', id === active));
    }

    function closePreview() {
      selected = hovered = focused = null;
      panel.hidden = true;
      panel.replaceChildren();
      links.forEach(control => control.setAttribute('aria-expanded', 'false'));
      highlight();
    }

    document.addEventListener('pointerdown', event => {
      if (selected && !event.target.closest('.map-hotspot, .corridor-stops a, .corridor-preview, dialog')) closePreview();
    });
    root.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) {
        if (panel.contains(document.activeElement)) {
          links.find(link => link.hash.slice(1) === selected)?.focus({preventScroll: true});
        }
        closePreview();
      }
    });

    links.forEach(link => {
      const id = link.hash.slice(1);
      const figure = figures.get(id);
      if (!figure) return;
      link.setAttribute('aria-controls', panel.id);
      link.setAttribute('aria-expanded', 'false');
      if (link.classList.contains('map-hotspot')) {
        const thumbnail = figure.querySelector('img').cloneNode();
        thumbnail.className = 'map-stop-thumbnail';
        thumbnail.loading = 'eager';
        thumbnail.alt = '';
        thumbnail.setAttribute('aria-hidden', 'true');
        link.append(thumbnail);
      }
      link.addEventListener('pointerenter', event => {
        if (event.pointerType === 'touch') return;
        hovered = id;
        highlight();
      });
      link.addEventListener('pointerleave', () => { hovered = null; highlight(); });
      link.addEventListener('focus', () => { focused = id; highlight(); });
      link.addEventListener('blur', () => { focused = null; highlight(); });
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (selected === id) {
          closePreview();
          return;
        }
        selected = id;
        links.forEach(control => control.setAttribute('aria-expanded', String(control.hash.slice(1) === selected)));
        panel.hidden = false;
        const image = figure.querySelector('img').cloneNode();
        const caption = document.createElement('div');
        caption.className = 'corridor-preview-copy';
        caption.append(...[...figure.querySelector('figcaption').children].map(child => child.cloneNode(true)));
        const enlarge = document.createElement('button');
        enlarge.type = 'button'; enlarge.className = 'image-enlarge corridor-preview-image';
        enlarge.setAttribute('aria-label', 'Enlarge selected intervention');
        enlarge.textContent = 'Enlarge ↗';
        const art = document.createElement('div');
        art.className = 'figure-art';
        art.append(image, enlarge);
        enlarge.addEventListener('click', () => {
          enlarge.focus({preventScroll: true});
          figure.querySelector('[data-image-viewer]')?.click();
        });
        const close = document.createElement('button');
        close.type = 'button'; close.className = 'text-link'; close.textContent = 'Close detail';
        close.addEventListener('click', () => { link.focus({preventScroll: true}); closePreview(); });
        const stops = [...root.querySelectorAll('.corridor-stops a')];
        const stopIndex = stops.findIndex(stop => stop.hash === link.hash);
        const controls = document.createElement('nav');
        controls.className = 'corridor-controls';
        controls.setAttribute('aria-label', 'Follow the corridor');
        for (const [offset, label] of [[-1, '← West'], [1, 'East →']]) {
          const nextStop = stops[stopIndex + offset];
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = label;
          button.disabled = !nextStop;
          if (nextStop) {
            button.setAttribute('aria-label', label + ': ' + nextStop.querySelector('strong').textContent);
            button.addEventListener('click', () => {
              nextStop.click();
              const title = panel.querySelector('.corridor-preview-copy strong, .corridor-preview-copy h3') || panel;
              title.tabIndex = -1;
              title.focus({preventScroll: true});
            });
          }
          controls.append(button);
        }
        controls.append(close);
        caption.append(controls);
        panel.replaceChildren(art, caption);
        if (!reduce.matches) panel.animate?.([{opacity: 0}, {opacity: 1}], {duration: 240, easing: 'ease-out'});
        if (!link.classList.contains('map-hotspot') && panel.getBoundingClientRect().top < 100) {
          panel.tabIndex = -1;
          panel.focus({preventScroll: true});
          panel.scrollIntoView({block: 'nearest', behavior: reduce.matches ? 'instant' : 'smooth'});
        }
        highlight();
      });
    });
  });
  document.querySelectorAll('[data-landuse]').forEach(root=>{
    const buttons=[...root.querySelectorAll('[data-landuse-id]')];
    buttons.forEach(button=>button.addEventListener('click',()=>{
      buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
      root.querySelector('.landuse-explanation').textContent=button.dataset.description;
    }));
  });
  if(!('IntersectionObserver' in window))return;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add('data-in-view');observer.unobserve(entry.target);
    if(reduce.matches)return;
    // Values stay at their source figures; only the bar shapes animate.

  }),{threshold:.2});
  document.querySelectorAll('[data-landuse],.proposal-statistics').forEach(el=>observer.observe(el));
})();
