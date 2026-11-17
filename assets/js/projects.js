/* Progressive project exploration. Source data and all original figures remain readable without JS. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-project-map]').forEach(root => {
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

    links.forEach(link => {
      const id = link.hash.slice(1);
      const figure = figures.get(id);
      if (!figure) return;
      link.setAttribute('aria-controls', panel.id);
      link.setAttribute('aria-expanded', 'false');
      if (link.classList.contains('map-hotspot')) {
        const thumbnail = figure.querySelector('img').cloneNode();
        thumbnail.className = 'map-stop-thumbnail';
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
        selected = selected === id ? null : id;
        links.forEach(control => control.setAttribute('aria-expanded', String(control.hash.slice(1) === selected)));
        panel.hidden = !selected;
        if (selected) {
          const image = figure.querySelector('img').cloneNode();
          const caption = document.createElement('div');
          caption.className = 'corridor-preview-copy';
          caption.append(...[...figure.querySelector('figcaption').children].map(child => child.cloneNode(true)));
          const enlarge = document.createElement('button');
          enlarge.type = 'button'; enlarge.className = 'corridor-preview-image';
          enlarge.setAttribute('aria-label', 'Enlarge selected intervention');
          enlarge.append(image);
          const hint = document.createElement('span'); hint.className = 'enlarge-label';
          hint.textContent = 'View larger ↗'; enlarge.append(hint);
          enlarge.addEventListener('click', () => figure.querySelector('a[data-image-viewer]')?.click());
          const close = document.createElement('button');
          close.type = 'button'; close.className = 'text-link'; close.textContent = 'Close detail';
          close.addEventListener('click', () => { selected = id; link.click(); link.focus({preventScroll: true}); });
          caption.append(close);
          panel.replaceChildren(enlarge, caption);
          if (!reduce.matches) panel.animate?.([{opacity: 0, transform: 'translateY(-6px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 240, easing: 'ease-out'});
          if (link.classList.contains('map-hotspot')) {
            panel.tabIndex = -1;
            panel.focus({preventScroll: true});
            panel.scrollIntoView({block: 'nearest', behavior: reduce.matches ? 'instant' : 'smooth'});
          }
        } else {
          panel.replaceChildren();
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
