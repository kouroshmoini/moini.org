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
    let touchStart;
    root.addEventListener('touchstart', event => {
      touchStart = event.touches.length === 1 &&
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
    root.querySelector('[role="tablist"]').hidden = false;
    select(0);
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
  const canvas = dialog.querySelector('.viewer-canvas');
  const zoom = dialog.querySelector('[data-viewer-zoom]');
  const zoomOut = dialog.querySelector('[data-viewer-out]');
  const close = dialog.querySelector('[data-viewer-close]');
  const status = dialog.querySelector('.viewer-status');
  image.draggable = false;
  let opener, scale = 1, drag = null, pinch = null;
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
    zoom.disabled = scale >= 4;
    zoomOut.disabled = scale === 1;
    resize();
    canvas.scrollTo({
      left: focusX * image.clientWidth - x + Math.max(0, (canvas.clientWidth - image.clientWidth) / 2),
      top: focusY * image.clientHeight - y + Math.max(0, (canvas.clientHeight - image.clientHeight) / 2), behavior: 'instant'
    });
  }
  image.addEventListener('load', () => {
    canvas.setAttribute('aria-busy', 'false');
    status.textContent = '';
    resize();
  });
  image.addEventListener('error', () => {
    canvas.setAttribute('aria-busy', 'false');
    if (dialog.open) status.textContent = 'The image could not be loaded.';
  });
  document.querySelectorAll('a[data-image-viewer]').forEach(link => {
    const source = link.parentElement.querySelector('img');
    const control = document.createElement('button');
    control.type = 'button';
    control.className = 'image-enlarge';
    control.setAttribute('data-image-viewer', '');
    control.setAttribute('aria-label', 'Enlarge: ' + source.alt);
    control.textContent = link.textContent;
    link.replaceWith(control);
    control.addEventListener('click', () => {
      opener = document.activeElement?.matches('.corridor-preview-image') ? document.activeElement : control;
      status.textContent = '';
      canvas.setAttribute('aria-busy', 'true');
      image.alt = source.alt;
      image.src = link.href;
      dialog.showModal();
      setZoom(1);
      canvas.scrollTo(0, 0);
      close.focus({preventScroll: true});
    });
  });
  close.addEventListener('click', () => dialog.close());
  zoom.addEventListener('click', () => setZoom(scale + 1));
  zoomOut.addEventListener('click',() => setZoom(scale-1));
  canvas.addEventListener('dblclick',() => setZoom(scale>1?1:2));
  function pinchDistance() {
    const [a, b] = [...pointers.values()];
    return Math.hypot(b.x - a.x, b.y - a.y);
  }
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    if (event.target === image || scale > 1) canvas.setPointerCapture(event.pointerId);
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
    }
  });
  canvas.addEventListener('click', event => {
    if (event.target !== canvas || scale !== 1) return;
    const box = image.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right ||
        event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close',() => {
    image.removeAttribute('src'); pointers.clear(); drag = null; pinch = null;
    status.textContent = '';
    requestAnimationFrame(() => opener?.focus({preventScroll:true}));
  });
  window.addEventListener('resize',resize);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
})();
