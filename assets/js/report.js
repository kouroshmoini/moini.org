/* Shared accessible comparisons and image viewer. No per-post scripts. */
(() => {
  document.querySelectorAll('[data-comparison]').forEach(root => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    const guided = matchMedia('(min-width: 60rem) and (min-height: 38rem) and (prefers-reduced-motion: no-preference)');
    function select(index, focus = false) {
      tabs.forEach((tab,i) => {tab.setAttribute('aria-selected', String(i===index)); tab.tabIndex = i===index ? 0 : -1; panels[i].hidden = !guided.matches && i!==index;});
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
    let touchStart;
    root.addEventListener('touchstart', event => {
      touchStart = !guided.matches && event.touches.length === 1 &&
        event.target.closest('.comparison-panel .report-figure') ? event.touches[0] : null;
    }, {passive: true});
    root.addEventListener('touchcancel', () => { touchStart = null; });
    root.addEventListener('touchend', event => {
      if (!touchStart) return;
      const dx = event.changedTouches[0].clientX - touchStart.clientX;
      const dy = event.changedTouches[0].clientY - touchStart.clientY;
      touchStart = null;
      if (Math.abs(dx) < 48 || Math.abs(dx) < 1.6 * Math.abs(dy)) return;
      if (event.cancelable) event.preventDefault();
      const index = panels.findIndex(panel => !panel.hidden);
      select(Math.max(0, Math.min(panels.length - 1, index + (dx < 0 ? 1 : -1))));
    }, {passive: false});
    function adaptComparison() {
      root.querySelector('[role="tablist"]').hidden = guided.matches;
      panels.forEach(panel => {
        panel.setAttribute('role', guided.matches ? 'group' : 'tabpanel');
        panel.tabIndex = guided.matches ? -1 : 0;
      });
      select(Math.max(0, tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true')));
      window.dispatchEvent(new Event('resize'));
    }
    guided.addEventListener('change', adaptComparison);
    adaptComparison();
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
  const canvas = dialog.querySelector('.viewer-canvas');
  const zoom = dialog.querySelector('[data-viewer-zoom]');
  const originalLink = dialog.querySelector('[data-viewer-original]');
  const previous = dialog.querySelector('[data-viewer-prev]');
  const next = dialog.querySelector('[data-viewer-next]');
  previous.innerHTML = '<span aria-hidden="true">←</span><span class="viewer-label">Previous</span>';
  next.innerHTML = '<span class="viewer-label">Next</span><span aria-hidden="true">→</span>';
  const links = [...document.querySelectorAll('a[data-image-viewer]')];
  const status = document.createElement('span');
  status.className = 'viewer-status'; status.setAttribute('role','status');
  canvas.before(status); canvas.tabIndex = 0;
  canvas.setAttribute('aria-label','Image area. Use plus or minus to zoom, arrow keys to pan when zoomed. Swipe to change images when fitted.');
  image.draggable = false;
  const zoomOut = document.createElement('button');
  zoomOut.type = 'button'; zoomOut.className = 'button'; zoomOut.textContent = '−';
  zoomOut.setAttribute('aria-label','Zoom out'); zoom.before(zoomOut);
  const fullscreen = document.createElement('button');
  fullscreen.type = 'button'; fullscreen.className = 'button viewer-fullscreen'; fullscreen.textContent = 'Fullscreen';
  if (dialog.requestFullscreen && document.fullscreenEnabled) {
    zoom.after(fullscreen);
    fullscreen.addEventListener('click',async () => {
      try { if(document.fullscreenElement) await document.exitFullscreen(); else await dialog.requestFullscreen(); }
      catch { status.textContent = 'Fullscreen is unavailable in this browser.'; }
    });
    document.addEventListener('fullscreenchange',() => {fullscreen.textContent=document.fullscreenElement?'Exit fullscreen':'Fullscreen';resize();});
  }
  let opener, index = 0, scale = 1, drag = null, pinch = null;
  const pointers = new Map();
  function resize() {
    if (!image.naturalWidth || !dialog.open) return;
    const fit = Math.min(canvas.clientWidth / image.naturalWidth, canvas.clientHeight / image.naturalHeight);
    image.style.width = `${Math.round(image.naturalWidth * fit * scale)}px`;
    image.style.height = `${Math.round(image.naturalHeight * fit * scale)}px`;
  }
  function setZoom(value, anchor) {
    const oldWidth = image.clientWidth || canvas.clientWidth;
    const oldHeight = image.clientHeight || canvas.clientHeight;
    const x = anchor?.x ?? canvas.clientWidth / 2;
    const y = anchor?.y ?? canvas.clientHeight / 2;
    const focusX = (canvas.scrollLeft + x - Math.max(0, (canvas.clientWidth - oldWidth) / 2)) / oldWidth;
    const focusY = (canvas.scrollTop + y - Math.max(0, (canvas.clientHeight - oldHeight) / 2)) / oldHeight;
    scale = Math.max(1, Math.min(4, value));
    dialog.classList.toggle('is-zoomed', scale > 1);
    zoom.setAttribute('aria-pressed', String(scale > 1));
    zoom.textContent = scale === 1 ? 'Zoom in' : Math.round(scale * 100) + '%';
    zoomOut.disabled = scale === 1;
    resize();
    canvas.scrollTo({
      left: focusX * image.clientWidth - x + Math.max(0, (canvas.clientWidth - image.clientWidth) / 2),
      top: focusY * image.clientHeight - y + Math.max(0, (canvas.clientHeight - image.clientHeight) / 2), behavior: 'instant'
    });
  }
  function show(position) {
    pointers.clear(); pinch = null; drag = null;
    canvas.classList.remove('is-dragging');
    index = (position + links.length) % links.length;
    const link = links[index];
    status.textContent = 'Loading image…'; canvas.setAttribute('aria-busy','true');
    image.src = link.href; image.alt = link.querySelector('img')?.alt || '';
    originalLink.href = link.href;
    const sourceCaption = link.closest('figure')?.querySelector('figcaption');
    caption.textContent = sourceCaption?.children.length ? [...sourceCaption.childNodes].map(el => el.textContent.trim()).filter(Boolean).join(' ') : sourceCaption?.textContent || image.alt;
    dialog.querySelector('.viewer-count').textContent = `${index + 1} / ${links.length}`;
    setZoom(1); canvas.scrollTo(0,0);
    previous.disabled = next.disabled = links.length < 2;
  }
  image.addEventListener('load',() => {
    canvas.setAttribute('aria-busy','false');
    status.textContent = matchMedia('(pointer: coarse)').matches ? 'Pinch to zoom · Drag to pan · Swipe when fitted' : 'Use + / − to zoom · Drag to pan'; resize();
  });
  image.addEventListener('error',() => {canvas.setAttribute('aria-busy','false');status.textContent='Image could not load. Try the Original link.';});
  links.forEach((link,i) => link.addEventListener('click',event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); opener = document.activeElement?.matches('.corridor-preview-image, .study-stage') ? document.activeElement : link; dialog.showModal(); show(i);
    dialog.querySelector('[aria-label="Close image"]').focus({preventScroll: true});
  }));
  previous.addEventListener('click',() => show(index-1));
  next.addEventListener('click',() => show(index+1));
  zoom.addEventListener('click',() => setZoom(scale>=4?1:scale+1));
  zoomOut.addEventListener('click',() => setZoom(scale-1));
  canvas.addEventListener('dblclick',() => setZoom(scale>1?1:2));
  function pinchDistance() {
    const [a, b] = [...pointers.values()];
    return Math.hypot(b.x - a.x, b.y - a.y);
  }
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    canvas.setPointerCapture(event.pointerId);
    if (pointers.size === 2) {
      pinch = {distance: pinchDistance(), scale}; drag = null;
    } else if (pointers.size === 1) {
      drag = {id: event.pointerId, x: event.clientX, y: event.clientY, left: canvas.scrollLeft, top: canvas.scrollTop};
    }
    canvas.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    if (pinch && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const bounds = canvas.getBoundingClientRect();
      setZoom(pinch.scale * pinchDistance() / Math.max(1, pinch.distance), {
        x: (a.x + b.x) / 2 - bounds.left, y: (a.y + b.y) / 2 - bounds.top
      });
    } else if (drag && drag.id === event.pointerId && scale > 1) {
      canvas.scrollLeft = drag.left + drag.x - event.clientX;
      canvas.scrollTop = drag.top + drag.y - event.clientY;
    }
  });
  function finishDrag(event) {
    if (drag && drag.id === event.pointerId && !pinch) {
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (event.type === 'pointerup' && scale === 1 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        show(index + (dx < 0 ? 1 : -1));
      }
    }
    pointers.delete(event.pointerId); drag = null; pinch = null;
    canvas.classList.remove('is-dragging');
  }
  canvas.addEventListener('pointerup', finishDrag);
  canvas.addEventListener('pointercancel', finishDrag);
  canvas.addEventListener('lostpointercapture', finishDrag);
  canvas.addEventListener('wheel', event => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const bounds = canvas.getBoundingClientRect();
    setZoom(scale * Math.exp(-event.deltaY * .01), {x: event.clientX - bounds.left, y: event.clientY - bounds.top});
  }, {passive: false});
  dialog.addEventListener('keydown',event => {
    if(event.key==='+' || event.key==='='){event.preventDefault();setZoom(scale+1);}
    if(event.key==='-'){event.preventDefault();setZoom(scale-1);}
    if(event.key==='0'){event.preventDefault();setZoom(1);}
    if(scale>1 && event.target===canvas && ['ArrowRight','ArrowLeft','ArrowUp','ArrowDown'].includes(event.key)) {
      event.preventDefault();canvas.scrollBy(event.key==='ArrowRight'?80:event.key==='ArrowLeft'?-80:0,event.key==='ArrowDown'?80:event.key==='ArrowUp'?-80:0);
    } else if(scale===1 && event.key==='ArrowRight'){event.preventDefault();show(index+1);}
    else if(scale===1 && event.key==='ArrowLeft'){event.preventDefault();show(index-1);}
  });
  dialog.addEventListener('click',event => {if(event.target===dialog) dialog.close();});
  dialog.addEventListener('close',() => {
    image.removeAttribute('src'); pointers.clear(); drag = null; pinch = null;
    if(document.fullscreenElement===dialog) document.exitFullscreen().catch(()=>{});
    requestAnimationFrame(() => opener?.focus({preventScroll:true}));
  });
  window.addEventListener('resize',resize);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
})();
