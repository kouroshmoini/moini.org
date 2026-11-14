/* Shared accessible comparisons and image viewer. No per-post scripts. */
(() => {
  document.querySelectorAll('[data-comparison]').forEach(root => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    function select(index, focus = false) {
      tabs.forEach((tab,i) => {tab.setAttribute('aria-selected', String(i===index)); tab.tabIndex = i===index ? 0 : -1; panels[i].hidden = i!==index;});
      if (focus) tabs[index].focus();
    }
    panels.forEach((panel,i) => {panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tabs[i].id);panel.tabIndex=0;});
    tabs.forEach((tab,i) => {
      tab.addEventListener('click',() => select(i));
      tab.addEventListener('keydown',event => {
        let next;
        if(event.key==='ArrowRight') next=(i+1)%tabs.length;
        if(event.key==='ArrowLeft') next=(i-1+tabs.length)%tabs.length;
        if(event.key==='Home') next=0;
        if(event.key==='End') next=tabs.length-1;
        if(next!==undefined){event.preventDefault();select(next,true);}
      });
    });
    select(0);root.querySelector('[role="tablist"]').hidden=false;
  });
  const copy = document.querySelector('.copy-section');
  if (copy && navigator.clipboard) {
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      const active = document.querySelector('.report-contents a[aria-current]');
      const status = document.querySelector('.copy-status');
      try { await navigator.clipboard.writeText(active?.href || location.href); status.textContent = 'Section link copied'; }
      catch { status.textContent = 'Use your browser’s address bar to copy the link.'; }
      setTimeout(() => { status.textContent = ''; }, 3500);
    });
  }
  const dialog = document.getElementById('imageViewer');
  if (!dialog || !dialog.showModal) return;
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('p');
  const zoom = dialog.querySelector('[data-viewer-zoom]');
  const originalLink = dialog.querySelector('[data-viewer-original]');
  const previous = dialog.querySelector('[data-viewer-prev]');
  const next = dialog.querySelector('[data-viewer-next]');
  const links = [...document.querySelectorAll('a[data-image-viewer]')];
  let opener, index = 0;
  function show(position) {
    index = (position + links.length) % links.length;
    const link = links[index];
    image.src = link.href; image.alt = link.querySelector('img')?.alt || '';
    originalLink.href = link.href;
    caption.textContent = link.closest('figure')?.querySelector('figcaption')?.textContent || image.alt;
    dialog.querySelector('.viewer-count').textContent = `${index + 1} / ${links.length}`;
    dialog.classList.remove('is-zoomed'); zoom.setAttribute('aria-pressed','false'); zoom.textContent = 'Zoom in';
    dialog.querySelector('.viewer-canvas').scrollTo(0,0);
    previous.disabled = next.disabled = links.length < 2;
  }
  links.forEach((link,i) => link.addEventListener('click',event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); opener = link; show(i); dialog.showModal();
  }));
  previous.addEventListener('click',() => show(index-1));
  next.addEventListener('click',() => show(index+1));
  zoom.addEventListener('click',() => {
    const expanded = dialog.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-pressed',String(expanded)); zoom.textContent = expanded ? 'Fit image' : 'Zoom in';
  });
  dialog.addEventListener('keydown',event => {
    if (dialog.classList.contains('is-zoomed')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); show(index+1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(index-1); }
  });
  dialog.addEventListener('click',event => {if(event.target===dialog) dialog.close();});
  dialog.addEventListener('close',() => {image.removeAttribute('src');opener?.focus({preventScroll:true});});
})();
